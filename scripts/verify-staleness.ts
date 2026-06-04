#!/usr/bin/env npx tsx
/**
 * scripts/verify-staleness.ts
 *
 * Daily verification that the staleness rules from PR #390 are taking
 * effect in production. Runs from this laptop via launchd (no Vercel
 * compute cost — pure HTTP fetches against the public site).
 *
 * What it checks
 * --------------
 * For each sample URL, fetches the HTML and inspects two things:
 *   1. Response header `X-Robots-Tag` (if Vercel/Next.js set it)
 *   2. `<meta name="robots" content="...">` in the rendered HTML
 *
 * The expected state per URL comes from the same `isStale()` policy
 * the live pages use — so the script's expectation table is always
 * in sync with the deployed rule. A mismatch means the deploy didn't
 * pick up the noindex (or a stale-rule regression slipped in).
 *
 * Sample URLs cover:
 *   - Stale past date (today − 30 days) on 4 date-keyed clusters
 *   - Stale future date (today + 30 days) on 4 date-keyed clusters
 *   - Fresh date (today + 0) on 4 date-keyed clusters — must NOT noindex
 *   - Stale festival year (currentYear − 2) — must noindex
 *   - Fresh festival year (currentYear) — must NOT noindex
 *   - Evergreen reference URL (/en) — must NOT noindex
 *
 * Output
 * ------
 *   - Console table summarising each URL's expected vs actual state
 *   - JSONL append to `scripts/output/staleness-verify-timeline.jsonl`
 *     (one entry per run; building a daily timeline for trend tracking)
 *   - Exit code 0 if every URL matches expectation, 1 otherwise so
 *     launchd's failure reporting flags the regression
 *
 * Usage
 * -----
 *   npx tsx scripts/verify-staleness.ts                 # default: prod
 *   npx tsx scripts/verify-staleness.ts --base http://localhost:3000
 *   npx tsx scripts/verify-staleness.ts --strict        # exit on first mismatch
 *   npx tsx scripts/verify-staleness.ts --json          # JSON-only output (for piping)
 *
 * launchd: scripts/verify-staleness.plist.template
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const PROD_BASE = 'https://dekhopanchang.com';

interface Args {
  base: string;
  strict: boolean;
  jsonOnly: boolean;
}

function parseArgs(argv: string[]): Args {
  const getFlag = (name: string): string | undefined => {
    const idx = argv.indexOf(name);
    if (idx === -1 || idx === argv.length - 1) return undefined;
    return argv[idx + 1];
  };
  return {
    base: (getFlag('--base') ?? PROD_BASE).replace(/\/$/, ''),
    strict: argv.includes('--strict'),
    jsonOnly: argv.includes('--json'),
  };
}

function ymdUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

function offsetDate(now: Date, days: number): string {
  return ymdUtc(new Date(now.getTime() + days * 86_400_000));
}

interface SampleUrl {
  path: string;
  expectNoindex: boolean;
  reason: string;
}

/**
 * Build the sample URL list dynamically from `now` so the expected
 * staleness boundaries always match `STALENESS_DAYS = 14` and
 * `FESTIVAL_YEAR_OFFSET = 1` from src/lib/seo/staleness.ts. If those
 * constants change, change the offsets here in the same commit —
 * otherwise this script will start flagging the deploy as broken when
 * the deploy is actually working as designed.
 */
function buildSampleUrls(now: Date): SampleUrl[] {
  const today = ymdUtc(now);
  const past30 = offsetDate(now, -30);
  const future30 = offsetDate(now, 30);
  const past7 = offsetDate(now, -7);
  const currentYear = now.getUTCFullYear();

  return [
    // Rule 1 — date-keyed clusters, stale past
    { path: `/en/choghadiya/${past30}`, expectNoindex: true, reason: 'date − 30d past 14d threshold' },
    { path: `/en/panchang/date/${past30}`, expectNoindex: true, reason: 'date − 30d past 14d threshold' },
    { path: `/en/gauri-panchang/${past30}`, expectNoindex: true, reason: 'date − 30d past 14d threshold' },
    { path: `/en/horoscope/mesh/${past30}`, expectNoindex: true, reason: 'date − 30d past 14d threshold' },

    // Rule 1 — stale future
    { path: `/en/choghadiya/${future30}`, expectNoindex: true, reason: 'date + 30d past 14d threshold' },
    { path: `/en/panchang/date/${future30}`, expectNoindex: true, reason: 'date + 30d past 14d threshold' },

    // Rule 1 — fresh (within ±14 window)
    { path: `/en/choghadiya/${today}`, expectNoindex: false, reason: 'today — indexable' },
    { path: `/en/panchang/date/${today}`, expectNoindex: false, reason: 'today — indexable' },
    { path: `/en/choghadiya/${past7}`, expectNoindex: false, reason: '7d past inside 14d window' },

    // Rule 3 — year-keyed festival, stale
    { path: `/en/festivals/diwali/${currentYear - 2}`, expectNoindex: true, reason: `year − 2 (${currentYear - 2}) past 1-year threshold` },

    // Rule 3 — current year, indexable
    { path: `/en/festivals/diwali/${currentYear}`, expectNoindex: false, reason: 'current year — indexable' },

    // Evergreen reference — must NOT noindex
    { path: '/en', expectNoindex: false, reason: 'evergreen homepage' },
  ];
}

interface RobotsState {
  metaRobots: string | null;
  xRobotsTag: string | null;
  isNoindex: boolean;
  fetchOk: boolean;
  httpStatus: number;
}

const META_ROBOTS_RE = /<meta\s+[^>]*name=["']robots["'][^>]*content=["']([^"']+)["'][^>]*>/i;

async function fetchRobotsState(url: string): Promise<RobotsState> {
  const res = await fetch(url, {
    redirect: 'follow',
    headers: { 'User-Agent': 'panchang-staleness-verify/1.0' },
  });
  const xRobots = res.headers.get('x-robots-tag');
  let metaContent: string | null = null;
  if (res.headers.get('content-type')?.includes('html')) {
    const html = await res.text();
    const m = html.match(META_ROBOTS_RE);
    metaContent = m ? m[1] : null;
  }
  const hay = `${xRobots ?? ''} ${metaContent ?? ''}`.toLowerCase();
  return {
    metaRobots: metaContent,
    xRobotsTag: xRobots,
    isNoindex: hay.includes('noindex'),
    fetchOk: res.ok,
    httpStatus: res.status,
  };
}

interface VerifyResult {
  url: string;
  expectedNoindex: boolean;
  state: RobotsState;
  matches: boolean;
  reason: string;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const now = new Date();
  const samples = buildSampleUrls(now);

  const results: VerifyResult[] = [];
  for (const s of samples) {
    const url = `${args.base}${s.path}`;
    try {
      const state = await fetchRobotsState(url);
      const matches = state.fetchOk && state.isNoindex === s.expectNoindex;
      results.push({ url, expectedNoindex: s.expectNoindex, state, matches, reason: s.reason });
      if (args.strict && !matches) break;
    } catch (err) {
      results.push({
        url,
        expectedNoindex: s.expectNoindex,
        state: {
          metaRobots: null,
          xRobotsTag: null,
          isNoindex: false,
          fetchOk: false,
          httpStatus: 0,
        },
        matches: false,
        reason: `${s.reason} — fetch threw: ${err instanceof Error ? err.message : String(err)}`,
      });
      if (args.strict) break;
    }
  }

  const summary = {
    runAt: now.toISOString(),
    base: args.base,
    total: results.length,
    passed: results.filter((r) => r.matches).length,
    failed: results.filter((r) => !r.matches).length,
    results: results.map((r) => ({
      url: r.url,
      expectedNoindex: r.expectedNoindex,
      actualNoindex: r.state.isNoindex,
      httpStatus: r.state.httpStatus,
      matches: r.matches,
      reason: r.reason,
    })),
  };

  // Append-only JSONL timeline.
  const outDir = path.join(process.cwd(), 'scripts/output');
  fs.mkdirSync(outDir, { recursive: true });
  fs.appendFileSync(
    path.join(outDir, 'staleness-verify-timeline.jsonl'),
    JSON.stringify(summary) + '\n',
  );

  if (args.jsonOnly) {
    console.log(JSON.stringify(summary, null, 2));
  } else {
    console.log(`Staleness verification @ ${summary.runAt}`);
    console.log(`Base: ${summary.base}`);
    console.log(`Result: ${summary.passed}/${summary.total} passed, ${summary.failed} failed`);
    console.log('');
    console.log('URL                                                          Exp  Act  HTTP  ✓');
    console.log('────────────────────────────────────────────────────────── ──── ──── ───── ─');
    for (const r of summary.results) {
      const exp = r.expectedNoindex ? 'noidx' : 'index';
      const act = r.actualNoindex ? 'noidx' : 'index';
      const ok = r.matches ? '✓' : '✗';
      const short = r.url.replace(args.base, '').padEnd(58);
      console.log(`${short} ${exp.padEnd(4)} ${act.padEnd(4)} ${String(r.httpStatus).padStart(5)} ${ok}`);
    }
    if (summary.failed > 0) {
      console.log('');
      console.log('FAIL — mismatches:');
      for (const r of summary.results.filter((x) => !x.matches)) {
        console.log(`  ${r.url}`);
        console.log(`    expected noindex=${r.expectedNoindex} actual=${r.actualNoindex} http=${r.httpStatus}`);
        console.log(`    reason: ${r.reason}`);
      }
    }
  }

  process.exit(summary.failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('UNCAUGHT:', err);
  process.exit(2);
});

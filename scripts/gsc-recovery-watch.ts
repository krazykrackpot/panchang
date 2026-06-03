#!/usr/bin/env npx tsx
/**
 * scripts/gsc-recovery-watch.ts
 *
 * Daily sampling of GSC URL Inspection state on stale + fresh URLs to
 * build a recovery timeline post the May-31 cliff + the staleness rule
 * (PR #390) deploy. Runs from this laptop via launchd (uses ADC — no
 * Vercel cost, no committed credentials).
 *
 * What it samples
 * ---------------
 * Two sets of URLs:
 *   - "stale-set": URLs we marked noindex via the staleness rule.
 *     Recovery looks like coverageState transitioning Indexed →
 *     "Excluded by 'noindex' tag" over T+5–14 days.
 *   - "fresh-set": URLs that should be indexable but were "URL unknown
 *     to Google" on the May-31 diagnosis. Recovery looks like
 *     coverageState moving "unknown" → "Discovered" → "Indexed" as
 *     crawl budget recovers.
 *
 * For each URL it records: coverageState, indexingState, lastCrawlTime,
 * googleCanonical, userCanonical, robotsTxtState. These are exactly the
 * fields URL Inspection returns; we just persist the relevant subset
 * into a JSONL timeline.
 *
 * Auth
 * ----
 * Application Default Credentials. Setup is one-time:
 *   gcloud auth application-default login
 *   gcloud services enable searchconsole.googleapis.com --project=dekhopanchang
 *   gcloud auth application-default set-quota-project dekhopanchang
 *
 * See: reference_gsc_via_adc.md in memory.
 *
 * Output
 * ------
 *   scripts/output/gsc-recovery-timeline.jsonl  (append-only)
 *
 * Each line is a full snapshot:
 *   { runAt, urlSet: {stale: […], fresh: […]} }
 * where each URL entry is:
 *   { url, coverageState, indexingState, lastCrawlTime, googleCanonical }
 *
 * Querying the timeline (later):
 *   jq -s '.[-7:]' scripts/output/gsc-recovery-timeline.jsonl  # last 7 days
 *
 * Usage
 * -----
 *   npx tsx scripts/gsc-recovery-watch.ts             # default: today's samples
 *   npx tsx scripts/gsc-recovery-watch.ts --json      # JSON only, no table
 *
 * launchd: scripts/gsc-recovery-watch.plist.template
 */

import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const SITE = 'sc-domain:dekhopanchang.com';
const INSPECT_ENDPOINT = 'https://searchconsole.googleapis.com/v1/urlInspection/index:inspect';
const BASE_URL = 'https://dekhopanchang.com';

function getAccessToken(): string {
  try {
    return execSync('gcloud auth application-default print-access-token', {
      encoding: 'utf-8',
    }).trim();
  } catch (err) {
    console.error('gcloud auth failed — run `gcloud auth application-default login` first.');
    throw err;
  }
}

interface InspectionResult {
  coverageState?: string;
  indexingState?: string;
  lastCrawlTime?: string;
  googleCanonical?: string;
  userCanonical?: string;
  robotsTxtState?: string;
  verdict?: string;
}

async function inspectUrl(url: string, token: string): Promise<InspectionResult> {
  const res = await fetch(INSPECT_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': 'dekhopanchang',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inspectionUrl: url, siteUrl: SITE }),
  });
  if (!res.ok) {
    throw new Error(`URL Inspection ${res.status} for ${url}: ${await res.text()}`);
  }
  const data = (await res.json()) as { inspectionResult?: { indexStatusResult?: InspectionResult } };
  return data.inspectionResult?.indexStatusResult ?? {};
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

/**
 * Stale-set: URLs we expect to see "Excluded by 'noindex' tag" once
 * Google re-crawls. These are the URLs PR #390 flipped from indexable
 * to noindex.
 *
 * Fresh-set: URLs that should re-enter the index as crawl budget
 * recovers. These were "URL unknown to Google" on May-31's diagnosis.
 *
 * Both sets are intentionally small (~5 per set) — GSC's URL
 * Inspection has per-property quota (~2,000 calls/day) but we don't
 * want to noisy-up the timeline either. 10 sample URLs daily is plenty
 * to see the recovery curve without diluting it.
 */
function buildUrlSets(now: Date) {
  const past30 = offsetDate(now, -30);
  const past20 = offsetDate(now, -20);
  const today = ymdUtc(now);
  const tomorrow = offsetDate(now, 1);
  const currentYear = now.getUTCFullYear();

  return {
    stale: [
      `${BASE_URL}/en/choghadiya/${past30}`,
      `${BASE_URL}/en/panchang/date/${past30}`,
      `${BASE_URL}/mai/choghadiya/${past20}`,
      `${BASE_URL}/en/horoscope/mesh/${past30}`,
      `${BASE_URL}/en/festivals/diwali/${currentYear - 2}`,
    ],
    fresh: [
      `${BASE_URL}/en/choghadiya/${today}`,
      `${BASE_URL}/en/panchang/date/${today}`,
      `${BASE_URL}/mai/choghadiya/${today}`,
      `${BASE_URL}/en/choghadiya/${tomorrow}`,
      `${BASE_URL}/en/festivals/diwali/${currentYear}`,
    ],
  };
}

async function main() {
  const jsonOnly = process.argv.includes('--json');
  const now = new Date();
  const sets = buildUrlSets(now);
  const token = getAccessToken();

  async function inspectSet(urls: string[]) {
    const out: Array<{
      url: string;
      coverageState: string;
      indexingState: string;
      lastCrawlTime: string;
      googleCanonical: string;
      verdict: string;
      error?: string;
    }> = [];
    for (const url of urls) {
      try {
        const r = await inspectUrl(url, token);
        out.push({
          url,
          coverageState: r.coverageState ?? '(empty)',
          indexingState: r.indexingState ?? '(empty)',
          lastCrawlTime: r.lastCrawlTime ?? '(none)',
          googleCanonical: r.googleCanonical ?? '(none)',
          verdict: r.verdict ?? '(empty)',
        });
      } catch (err) {
        out.push({
          url,
          coverageState: '(error)',
          indexingState: '(error)',
          lastCrawlTime: '(error)',
          googleCanonical: '(error)',
          verdict: '(error)',
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }
    return out;
  }

  const stale = await inspectSet(sets.stale);
  const fresh = await inspectSet(sets.fresh);

  const snapshot = {
    runAt: now.toISOString(),
    site: SITE,
    urlSet: { stale, fresh },
  };

  const outDir = path.join(process.cwd(), 'scripts/output');
  fs.mkdirSync(outDir, { recursive: true });
  fs.appendFileSync(
    path.join(outDir, 'gsc-recovery-timeline.jsonl'),
    JSON.stringify(snapshot) + '\n',
  );

  if (jsonOnly) {
    console.log(JSON.stringify(snapshot, null, 2));
    return;
  }

  console.log(`GSC recovery snapshot @ ${snapshot.runAt}`);
  console.log('');
  console.log('STALE-SET (expect → "Excluded by \'noindex\' tag" over T+5–14d):');
  for (const r of stale) {
    console.log(`  ${r.url}`);
    console.log(`    coverage=${r.coverageState}  lastCrawl=${r.lastCrawlTime}`);
    if (r.error) console.log(`    ⚠ ${r.error}`);
  }
  console.log('');
  console.log('FRESH-SET (expect → unknown→Discovered→Indexed as crawl budget recovers):');
  for (const r of fresh) {
    console.log(`  ${r.url}`);
    console.log(`    coverage=${r.coverageState}  lastCrawl=${r.lastCrawlTime}`);
    if (r.error) console.log(`    ⚠ ${r.error}`);
  }
}

main().catch((err) => {
  console.error('UNCAUGHT:', err);
  process.exit(2);
});

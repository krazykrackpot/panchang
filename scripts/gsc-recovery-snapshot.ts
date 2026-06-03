#!/usr/bin/env npx tsx
/**
 * scripts/gsc-recovery-snapshot.ts
 *
 * Per-locale snapshot from `utm_visits` for tracking whether the
 * May-31 GSC-drop recovery (canonical homepages, sitemap regen,
 * rashi/yoga slug redirects) is taking effect.
 *
 * Reads the last 7 days vs the prior 7 days and reports, per locale:
 *   - page_view count
 *   - search-referrer rate (Google + Bing + DuckDuckGo)
 *   - scroll-depth distribution
 *   - dwell-time distribution
 *
 * Reads from `utm_visits` only — the existing UTM tracking already
 * captures landing_page + referrer + event_metadata. No new schema.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/gsc-recovery-snapshot.ts
 *   npx tsx --env-file=.env.local scripts/gsc-recovery-snapshot.ts --days 14
 *
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. `tsx`
 * does NOT auto-load .env.local — use --env-file=.env.local (Node
 * 20.6+) or export the vars manually. Same convention as
 * scripts/grant-brihaspati-credits.ts.
 */

import { createClient } from '@supabase/supabase-js';

interface Args {
  days: number;
}

function parseArgs(argv: string[]): Args {
  const days = Number(getFlag(argv, '--days') ?? '7');
  if (!Number.isFinite(days) || days < 1 || days > 90) {
    throw new Error(`--days must be 1..90 (got ${days})`);
  }
  return { days };
}

function getFlag(argv: string[], name: string): string | undefined {
  const idx = argv.indexOf(name);
  if (idx === -1 || idx === argv.length - 1) return undefined;
  return argv[idx + 1];
}

const SEARCH_HOSTS = /(google|bing|duckduckgo|yandex|baidu|brave)\./i;

const LOCALE_PREFIX = /^\/([a-z]{2,3})(?:\/|$)/;
function localeFromPath(path: string | null): string {
  if (!path) return '(unknown)';
  const m = path.match(LOCALE_PREFIX);
  return m ? m[1] : '(other)';
}

interface VisitRow {
  created_at: string;
  event: string;
  landing_page: string | null;
  referrer: string | null;
  event_metadata: Record<string, unknown> | null;
}

interface LocaleSnapshot {
  pageViews: number;
  searchReferrers: number;
  scrollBuckets: Record<string, number>;
  dwellBuckets: Record<string, number>;
}

function emptySnapshot(): LocaleSnapshot {
  return {
    pageViews: 0,
    searchReferrers: 0,
    scrollBuckets: { '0': 0, '25': 0, '50': 0, '75': 0, '100': 0 },
    dwellBuckets: { '0-5s': 0, '5-30s': 0, '30s-2m': 0, '2-5m': 0, '5m+': 0 },
  };
}

function summarise(rows: VisitRow[]): Map<string, LocaleSnapshot> {
  const byLocale = new Map<string, LocaleSnapshot>();
  for (const row of rows) {
    // For `page_engagement` rows the authoritative route is the one
    // captured at fire time inside the closure (`event_metadata.route`),
    // NOT `utm_visits.landing_page`. The latter is filled by reading
    // `window.location.pathname` inside `/api/track-utm`'s upstream
    // helper, which during SPA navigation already reflects the NEW
    // route by the time the beacon fires from the OLD route's
    // effect-cleanup. Without this branch, every engagement event
    // gets attributed to the next page the user navigated to.
    // Gemini PR #393 cycle-1 HIGH.
    let path = row.landing_page;
    if (
      row.event === 'page_engagement'
      && row.event_metadata
      && typeof (row.event_metadata as { route?: unknown }).route === 'string'
    ) {
      path = (row.event_metadata as { route: string }).route;
    }
    const locale = localeFromPath(path);
    let snap = byLocale.get(locale);
    if (!snap) {
      snap = emptySnapshot();
      byLocale.set(locale, snap);
    }

    if (row.event === 'page_view') {
      snap.pageViews++;
      if (row.referrer && SEARCH_HOSTS.test(row.referrer)) {
        snap.searchReferrers++;
      }
    }

    if (row.event === 'page_engagement' && row.event_metadata) {
      const md = row.event_metadata;
      const scroll = String((md as { scrollMaxBucket?: unknown }).scrollMaxBucket ?? '');
      const dwell = String((md as { dwellBucket?: unknown }).dwellBucket ?? '');
      if (scroll in snap.scrollBuckets) snap.scrollBuckets[scroll]++;
      if (dwell in snap.dwellBuckets) snap.dwellBuckets[dwell]++;
    }
  }
  return byLocale;
}

function pct(num: number, denom: number): string {
  if (denom === 0) return '  —  ';
  return `${((num / denom) * 100).toFixed(1).padStart(5)}%`;
}

function arrow(curr: number, prev: number): string {
  if (prev === 0 && curr === 0) return '  —  ';
  if (prev === 0) return '  ↑↑ ';
  const delta = ((curr - prev) / prev) * 100;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${delta.toFixed(1).padStart(5)}%`;
}

function formatScrollDist(buckets: Record<string, number>): string {
  const total = Object.values(buckets).reduce((a, b) => a + b, 0);
  if (total === 0) return '—';
  const parts = (['0', '25', '50', '75', '100'] as const).map((b) => `${b}:${pct(buckets[b], total).trim()}`);
  return parts.join(' ');
}

function formatDwellDist(buckets: Record<string, number>): string {
  const total = Object.values(buckets).reduce((a, b) => a + b, 0);
  if (total === 0) return '—';
  const order = ['0-5s', '5-30s', '30s-2m', '2-5m', '5m+'] as const;
  return order.map((b) => `${b}:${pct(buckets[b], total).trim()}`).join(' ');
}

async function main() {
  const { days } = parseArgs(process.argv.slice(2));
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    console.error('Run with: npx tsx --env-file=.env.local scripts/gsc-recovery-snapshot.ts');
    process.exit(1);
  }
  const supabase = createClient(url, key);

  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const recentStart = new Date(now - days * dayMs).toISOString();
  const priorStart = new Date(now - 2 * days * dayMs).toISOString();
  const priorEnd = recentStart;

  // PostgREST default cap is 1000 rows; at >1000 events per window the
  // snapshot silently truncates and lies. Bump the explicit limit to
  // accommodate ~1 year of growth at current traffic. Graduate to
  // server-side aggregation if we ever approach this cap.
  // Gemini PR #393 cycle-1 MED.
  const ROW_LIMIT = 50_000;

  const { data: recentRows, error: e1 } = await supabase
    .from('utm_visits')
    .select('created_at, event, landing_page, referrer, event_metadata')
    .gte('created_at', recentStart)
    .in('event', ['page_view', 'page_engagement'])
    .limit(ROW_LIMIT);

  if (e1) {
    console.error('[gsc-recovery-snapshot] recent query failed:', e1);
    process.exit(1);
  }

  const { data: priorRows, error: e2 } = await supabase
    .from('utm_visits')
    .select('created_at, event, landing_page, referrer, event_metadata')
    .gte('created_at', priorStart)
    .lt('created_at', priorEnd)
    .in('event', ['page_view', 'page_engagement'])
    .limit(ROW_LIMIT);

  if (e2) {
    console.error('[gsc-recovery-snapshot] prior query failed:', e2);
    process.exit(1);
  }

  const recent = summarise((recentRows ?? []) as VisitRow[]);
  const prior = summarise((priorRows ?? []) as VisitRow[]);
  const allLocales = new Set<string>([...recent.keys(), ...prior.keys()]);
  const sorted = [...allLocales].sort((a, b) => (recent.get(b)?.pageViews ?? 0) - (recent.get(a)?.pageViews ?? 0));

  console.log('');
  console.log(`GSC Recovery Snapshot — last ${days}d vs prior ${days}d`);
  console.log('='.repeat(78));
  console.log('locale | views | Δ      | search% | scroll dist (0/25/50/75/100)        | dwell dist');
  console.log('-'.repeat(78));
  for (const locale of sorted) {
    const r = recent.get(locale) ?? emptySnapshot();
    const p = prior.get(locale) ?? emptySnapshot();
    const searchPct = pct(r.searchReferrers, r.pageViews);
    const scrollDist = formatScrollDist(r.scrollBuckets);
    const dwellDist = formatDwellDist(r.dwellBuckets);
    console.log(
      `${locale.padEnd(7)}| ${String(r.pageViews).padStart(5)} | ${arrow(r.pageViews, p.pageViews)} | ${searchPct} | ${scrollDist.padEnd(35)} | ${dwellDist}`,
    );
  }
  console.log('');
}

main().catch((err) => {
  console.error('[gsc-recovery-snapshot] fatal:', err);
  process.exit(1);
});

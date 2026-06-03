/**
 * URL enumerator for IndexNow "prune stale" pings.
 *
 * Counterpart to `indexnow-urls.ts`:
 *   - indexnow-urls.ts: pings URLs we want CRAWLED + UPDATED in the
 *     index (today's panchang, fresh dates). Daily, 3 staggered groups.
 *   - indexnow-prune.ts (this file): pings URLs we want CRAWLED + DROPPED
 *     from the index. The pages themselves emit `robots: noindex` (via
 *     staleness.ts); pinging just triggers the re-crawl so search engines
 *     see the new noindex tag and update.
 *
 * What we ping
 * ------------
 *
 *   Rule 1 — date-keyed clusters:
 *     /panchang/date/[date], /choghadiya/[date],
 *     /gauri-panchang/[date], /horoscope/[rashi]/[date]
 *   Window: today−90 .. today−15 + today+15 .. today+90
 *           (skipping the ±14 day indexable window from staleness.ts)
 *
 *   Rule 3 — year-keyed festival pages:
 *     /festivals/[slug]/[year]
 *   Window: years in FESTIVAL_VALID_YEARS that are < currentYear-1
 *
 * Locale fan-out: all 9 active locales for date-keyed and festival
 * clusters. The thin-coverage policy from indexable-locales.ts doesn't
 * apply here — these are not /learn URLs.
 *
 * Volume (Jun 2026 baseline, ±45-day stale window):
 *   - Date-keyed past: 31 days × (3 + 12) paths × 9 locales = ~4,200 URLs
 *   - Date-keyed future: 31 days × 15 paths × 9 locales = ~4,200 URLs
 *   - Festival: 0 stale years in 2026, ramps to ~360 URLs from 2028+
 *   Total ~8,400 URLs per run in 2026. Under IndexNow's 10k cap with headroom.
 *
 * Window choice (±45 not ±90):
 *   URLs more than 45 days outside the indexable window are likely already
 *   dropped by Google's natural re-crawl cycle. Pinging them = wasted budget
 *   without recovering the IndexNow rate-limit window cost (a single 472-URL
 *   submit 429'd us during the 2026-06-01 recovery dispatch). The 45-day
 *   reach catches every URL that was indexable in the last 30 days but
 *   crossed the 14-day staleness boundary recently — exactly the URLs Google
 *   most likely still has cached.
 */

import { TOP_FESTIVAL_SLUGS, FESTIVAL_VALID_YEARS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_YEAR_OFFSET, STALENESS_DAYS } from '@/lib/seo/staleness';

/** Locales to ping. All 9 active — these aren't thin-coverage routes. */
export const INDEXNOW_PRUNE_LOCALES = [
  'en', 'hi', 'mai', 'mr', 'bn', 'ta', 'te', 'gu', 'kn',
] as const;

/**
 * How far past + future to enumerate. Stale dates within this window
 * get pinged. Going beyond ~45 days yields URLs Google likely already
 * dropped from its index naturally — ping budget wasted. See file
 * header for the rate-limit reasoning behind the 45-day choice.
 */
const STALE_WINDOW_DAYS = 45;

/** Rashis used by the /horoscope/[rashi]/[date] cluster. Local to this
 *  module since the prune cluster's rashi list might evolve differently
 *  from the indexnow-urls.ts daily-ping list. */
const RASHIS_FOR_HOROSCOPE = [
  'mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya',
  'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen',
] as const;

/** Date-keyed cluster path templates. The `{date}` placeholder gets
 *  replaced with YYYY-MM-DD for each stale date in the window.
 *  `{rashi}` placeholder is fanned out across RASHIS_FOR_HOROSCOPE. */
const DATE_CLUSTERS: ReadonlyArray<{ template: string; fanOutRashi: boolean }> = [
  { template: '/panchang/date/{date}', fanOutRashi: false },
  { template: '/choghadiya/{date}', fanOutRashi: false },
  { template: '/gauri-panchang/{date}', fanOutRashi: false },
  { template: '/horoscope/{rashi}/{date}', fanOutRashi: true },
];

function ymdUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/**
 * Build the full prune-ping URL path list.
 *
 * Symmetric ±90 window around `today`, skipping the ±14 indexable
 * window. Locale × cluster × rashi fan-out. Returns site-relative
 * paths (e.g., `/en/choghadiya/2026-04-01`) suitable for passing
 * straight to `submitUrlsToIndexNow()`.
 *
 * @param now Test injection point. Defaults to `new Date()`.
 */
export function buildIndexNowPrunePaths(now: Date = new Date()): string[] {
  const paths: string[] = [];

  // Rule 1 — date-keyed clusters.
  // Past stale window: [-STALE_WINDOW_DAYS, -(STALENESS_DAYS+1)]
  // Future stale window: [STALENESS_DAYS+1, STALE_WINDOW_DAYS]
  // STALENESS_DAYS+1 because exactly STALENESS_DAYS is still indexable
  // per staleness.ts; the first stale day is STALENESS_DAYS+1.
  const todayUtcMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const day = 86_400_000;

  const offsets: number[] = [];
  for (let d = STALENESS_DAYS + 1; d <= STALE_WINDOW_DAYS; d++) {
    offsets.push(-d);
    offsets.push(+d);
  }

  for (const locale of INDEXNOW_PRUNE_LOCALES) {
    for (const offset of offsets) {
      const dateStr = ymdUtc(new Date(todayUtcMs + offset * day));
      for (const cluster of DATE_CLUSTERS) {
        if (cluster.fanOutRashi) {
          for (const rashi of RASHIS_FOR_HOROSCOPE) {
            paths.push(`/${locale}${cluster.template.replace('{rashi}', rashi).replace('{date}', dateStr)}`);
          }
        } else {
          paths.push(`/${locale}${cluster.template.replace('{date}', dateStr)}`);
        }
      }
    }
  }

  // Rule 3 — year-keyed festival pages.
  // Stale year = year < currentYear - FESTIVAL_YEAR_OFFSET.
  // Restrict to FESTIVAL_VALID_YEARS — pinging years we never generated
  // would just return 404s and waste budget.
  const currentYear = now.getUTCFullYear();
  const staleFestivalYears = FESTIVAL_VALID_YEARS.filter(
    (y) => y < currentYear - FESTIVAL_YEAR_OFFSET,
  );

  for (const locale of INDEXNOW_PRUNE_LOCALES) {
    for (const year of staleFestivalYears) {
      for (const slug of TOP_FESTIVAL_SLUGS) {
        paths.push(`/${locale}/festivals/${slug}/${year}`);
      }
    }
  }

  return paths;
}

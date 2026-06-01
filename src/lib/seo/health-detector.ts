/**
 * Detect significant week-over-week click drops per locale from GSC
 * page-level data. Lives separate from the cron route so it can be
 * unit-tested with stubbed data — the route is then a thin orchestrator.
 *
 * Tuning knobs (overridable via env in the cron route):
 *   - dropThreshold       0..1, default 0.4 (40%)
 *   - minBaselineClicks   skip a locale unless its same-day-last-week
 *                         clicks exceed this floor — keeps low-volume
 *                         locales from generating alert noise on
 *                         random ±1 click jitter (default 50)
 *
 * The 2026-05-31 14:00 UTC crash was a -89% impressions drop on a
 * baseline of ~2,750/hr — well above any reasonable threshold; the
 * defaults catch it with margin to spare.
 */

import { locales, type Locale } from '@/lib/i18n/config';

export interface PageClicksRow {
  url: string;
  clicks: number;
}

export interface DropDetectionConfig {
  dropThreshold: number;     // fraction, e.g. 0.4 for 40%
  minBaselineClicks: number; // absolute floor
}

export interface LocaleDrop {
  locale: Locale;
  yesterdayClicks: number;
  baselineClicks: number;
  dropFraction: number;      // (baseline - yest) / baseline, in [0, 1]
}

const ACTIVE: readonly Locale[] = locales;

/**
 * Extract the active locale from a GSC page URL such as
 * `https://dekhopanchang.com/mai/choghadiya/2026-06-01`. Returns null
 * for URLs without a recognised locale prefix (e.g. /sitemap.xml,
 * /robots.txt, or a non-locale dir like /api/...).
 *
 * Accepts `null | undefined` defensively — GSC API responses
 * occasionally include rows with empty `keys`, which would propagate
 * as `undefined` here and otherwise crash with TypeError on the
 * regex match. (Gemini PR #337 cycle-1 HIGH.)
 */
export function localeFromUrl(url: string | null | undefined): Locale | null {
  if (!url) return null;
  const m = url.match(/^https?:\/\/[^/]+\/([a-z]{2,3})(?:\/|$)/);
  if (!m) return null;
  const candidate = m[1];
  return (ACTIVE as readonly string[]).includes(candidate)
    ? (candidate as Locale)
    : null;
}

/** Sum clicks per locale by parsing the URL prefix. */
export function aggregateByLocale(rows: readonly PageClicksRow[]): Record<Locale, number> {
  const agg = Object.fromEntries(ACTIVE.map((l) => [l, 0])) as Record<Locale, number>;
  for (const r of rows) {
    const loc = localeFromUrl(r.url);
    if (!loc) continue;
    // `?? 0` guard — defensive against a malformed GSC row with
    // null/undefined `clicks`, which would otherwise NaN-poison the
    // aggregate and silently disable detection for that locale.
    // (Gemini PR #337 cycle-1 MED.)
    agg[loc] += r.clicks ?? 0;
  }
  return agg;
}

/**
 * Compare two per-locale click maps; return the locales where
 * `yesterday[loc]` dropped by `>= config.dropThreshold` relative to
 * `baseline[loc]`, gated by `config.minBaselineClicks` to suppress
 * low-volume noise.
 */
export function detectDrops(
  yesterday: Record<Locale, number>,
  baseline: Record<Locale, number>,
  config: DropDetectionConfig,
): LocaleDrop[] {
  const drops: LocaleDrop[] = [];
  for (const loc of ACTIVE) {
    const y = yesterday[loc] ?? 0;
    const b = baseline[loc] ?? 0;
    // `b <= 0` guard — protects against division by zero if
    // `minBaselineClicks` is misconfigured to 0 (Gemini PR #337
    // cycle-1 MED). With the default floor of 50 this is unreachable
    // but the check is cheap and removes the foot-gun.
    if (b <= 0 || b < config.minBaselineClicks) continue;
    const dropFraction = (b - y) / b;
    if (dropFraction >= config.dropThreshold) {
      drops.push({
        locale: loc,
        yesterdayClicks: y,
        baselineClicks: b,
        dropFraction,
      });
    }
  }
  // Largest drop first — alert email reads most-urgent-first.
  drops.sort((a, b) => b.dropFraction - a.dropFraction);
  return drops;
}

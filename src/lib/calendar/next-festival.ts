/**
 * "Next festival after this date" lookup. Used by date-keyed page bodies
 * (/choghadiya/[date], /panchang/date/[date], /gauri-panchang/[date]) to
 * render a proximity callout — "Next major festival: Krishna Janmashtami
 * in 12 days" — that differentiates adjacent dates' bodies.
 *
 * Computes the festival calendar for the date's year (and falls through
 * to year+1 if the date is in late December / no later entries exist in
 * the current year). Filters to major + regional festivals; skips vrats
 * by default so the callout focuses on bigger landmarks. Callers can
 * override via `includeVrat`.
 */
import { generateFestivalCalendarV2, type FestivalEntry } from './festival-generator';

/**
 * Module-level cache: festival list per `${year}|${lat}|${lng}|${timezone}`
 * key. Generation is expensive (full year, all categories) — caching
 * keeps the per-date page render cheap even though the page itself is
 * ISR-cached. Cache survives until the Next.js server process restarts.
 */
const festivalCache = new Map<string, FestivalEntry[]>();

function getYearFestivals(year: number, lat: number, lng: number, timezone: string): FestivalEntry[] {
  const key = `${year}|${lat}|${lng}|${timezone}`;
  const cached = festivalCache.get(key);
  if (cached) return cached;
  const list = generateFestivalCalendarV2(year, lat, lng, timezone);
  festivalCache.set(key, list);
  return list;
}

export interface NextFestivalResult {
  festival: FestivalEntry;
  /** Days from `fromDateStr` to the festival (1 = tomorrow, 0 = same day). */
  daysAway: number;
}

/**
 * Return the next N festivals on or after `fromDateStr`, sorted by date
 * ascending. Eligibility filter: major + regional + eclipse by default;
 * vrats opt-in via options.includeVrat.
 *
 * Searches current year + next year. Returns fewer than `count` if the
 * window doesn't have enough eligible entries (rare — major + regional +
 * vrat together yield 100+ entries/year).
 */
export function getUpcomingFestivals(
  fromDateStr: string,
  lat: number,
  lng: number,
  timezone: string,
  options: { count?: number; includeVrat?: boolean } = {},
): NextFestivalResult[] {
  const count = options.count ?? 5;
  // Parse YYYY-MM-DD into UTC components so the date math is portable
  // (Lesson L: never `new Date(str)` on a date-only string — local-tz
  // platforms drift by a day). UTC components keep day-counts deterministic.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromDateStr);
  if (!m) return [];
  const fromYear = Number(m[1]);
  const fromUtc = Date.UTC(fromYear, Number(m[2]) - 1, Number(m[3]));

  // Walk the year, then next year, collecting until we have `count`
  // entries. Two-year window is plenty — no festival is >365 days from
  // any date, and we typically hit the cap within the current year.
  const collected: NextFestivalResult[] = [];
  for (const year of [fromYear, fromYear + 1]) {
    if (collected.length >= count) break;
    const list = getYearFestivals(year, lat, lng, timezone);
    const eligible = list.filter(f => {
      if (options.includeVrat) return true;
      return f.type === 'major' || f.type === 'regional' || f.type === 'eclipse';
    });
    const sorted = eligible
      .map(f => {
        const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(f.date);
        if (!dm) return null;
        const utc = Date.UTC(Number(dm[1]), Number(dm[2]) - 1, Number(dm[3]));
        return { entry: f, utc };
      })
      .filter((x): x is { entry: FestivalEntry; utc: number } => x !== null)
      .filter(x => x.utc >= fromUtc)
      .sort((a, b) => a.utc - b.utc);
    for (const { entry, utc } of sorted) {
      if (collected.length >= count) break;
      // Dedupe across year boundary — a festival emitted by both years
      // (very rare; shouldn't happen, but defensive against the
      // generator's de-dup quirks) would otherwise list twice.
      if (collected.some(c => c.festival === entry)) continue;
      collected.push({
        festival: entry,
        daysAway: Math.round((utc - fromUtc) / 86400000),
      });
    }
  }
  return collected;
}

/**
 * Convenience wrapper — returns the single next eligible festival, or null.
 * Equivalent to `getUpcomingFestivals(...)[0] ?? null`. Kept for callers
 * that only need the head entry; new callers should prefer
 * `getUpcomingFestivals` and slice as needed.
 */
export function getNextFestival(
  fromDateStr: string,
  lat: number,
  lng: number,
  timezone: string,
  options: { includeVrat?: boolean } = {},
): NextFestivalResult | null {
  const list = getUpcomingFestivals(fromDateStr, lat, lng, timezone, {
    count: 1,
    includeVrat: options.includeVrat,
  });
  return list[0] ?? null;
}

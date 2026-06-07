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
 * Find the next festival (filter: major + regional; vrat optional) on or
 * after `fromDateStr` (YYYY-MM-DD). Returns null if no eligible festival
 * exists in the current or next calendar year.
 */
export function getNextFestival(
  fromDateStr: string,
  lat: number,
  lng: number,
  timezone: string,
  options: { includeVrat?: boolean } = {},
): NextFestivalResult | null {
  // Parse YYYY-MM-DD into UTC components so the date math is portable
  // (Lesson L: never `new Date(str)` on a date-only string — it's
  // interpreted as UTC midnight on some platforms and local midnight on
  // others). UTC components keep the day-count arithmetic deterministic.
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fromDateStr);
  if (!m) return null;
  const fromYear = Number(m[1]);
  const fromUtc = Date.UTC(fromYear, Number(m[2]) - 1, Number(m[3]));

  // Search the current year, then next year if no later entry exists.
  // Two-year window is enough — no festival is >365 days from any date.
  for (const year of [fromYear, fromYear + 1]) {
    const list = getYearFestivals(year, lat, lng, timezone);
    // Eligibility: type major OR regional (rich enough to warrant a
    // callout); vrats are noisier — opt in only.
    const eligible = list.filter(f => {
      if (options.includeVrat) return true;
      return f.type === 'major' || f.type === 'regional' || f.type === 'eclipse';
    });
    // Sort by date ascending (festival generator returns in source order,
    // not date order).
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
    if (sorted.length > 0) {
      const first = sorted[0];
      const daysAway = Math.round((first.utc - fromUtc) / 86400000);
      return { festival: first.entry, daysAway };
    }
  }
  return null;
}

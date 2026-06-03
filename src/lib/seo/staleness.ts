/**
 * Page staleness rules — single source of truth.
 *
 * Two rules ship today (Jun 2026 GSC-drop response, per the
 * /docs/spec/staleness-strategy.md decision matrix):
 *
 *   Rule 1 — date-keyed URLs (YYYY-MM-DD in path):
 *            stale if |today - urlDate| > STALENESS_DAYS
 *            applies to /panchang/date/[date], /choghadiya/[date],
 *            /gauri-panchang/[date], /horoscope/[rashi]/[date]
 *
 *   Rule 3 — year-keyed URLs (YYYY in path):
 *            stale if urlYear < currentYear - FESTIVAL_YEAR_OFFSET
 *            applies to /festivals/[slug]/[year]
 *
 * Rule 2 (period-keyed daily/weekly/monthly URLs — e.g.
 * /horoscope/[rashi]/weekly) was scoped but deferred. The check requires
 * comparing request-time `now` vs the ISR-cached page's gen-time, which
 * generateMetadata can't see — it only runs at regeneration. Making the
 * route fully dynamic to fix that loses the ISR/CPU benefit. Acceptable
 * worst-case is one revalidate cycle (24h) of stale snapshot served at
 * a period boundary. Revisit with proxy/middleware noindex injection if
 * GSC top losers show period-keyed URLs at T+14d.
 *
 * IMPORTANT: every consumer of this module must read STALENESS_DAYS
 * (not re-define 14). The IndexNow prune script enumerates URLs based
 * on the same constant — if these drift, we'd ping URLs that are
 * still indexable, or skip URLs that flipped noindex. Lesson Q applied.
 */

/** Rule 1 threshold — locked at 14 days (user call 2026-06-03). */
export const STALENESS_DAYS = 14;

/**
 * Rule 3 offset — festivals for `year < currentYear - FESTIVAL_YEAR_OFFSET`
 * are stale. At the locked value of 1: when current is 2026, years 2024
 * and earlier are stale; 2025 stays indexable for residual "diwali 2025"
 * searches that linger past year-end.
 */
export const FESTIVAL_YEAR_OFFSET = 1;

export type StalenessKind = 'date-keyed' | 'year-keyed';

interface DateKeyedInput {
  kind: 'date-keyed';
  /** YYYY-MM-DD. Already validated upstream (isStrictYmd or equivalent). */
  urlDate: string;
  /** Injectable for tests. Defaults to `new Date()`. */
  now?: Date;
}

interface YearKeyedInput {
  kind: 'year-keyed';
  /** 4-digit year. Already validated upstream. */
  urlYear: number;
  /** Injectable for tests. Defaults to `new Date()`. */
  now?: Date;
}

export type StalenessInput = DateKeyedInput | YearKeyedInput;

/**
 * Returns true if the URL should emit `robots: { index: false, follow: true }`.
 *
 * For an invalid `urlDate` (parse failure), returns `false` so the existing
 * 404 / notFound() logic on the page handler still owns the "URL is wrong"
 * path. We don't pretend stale here — we let the upstream page reject the URL.
 */
export function isStale(input: StalenessInput): boolean {
  const now = input.now ?? new Date();

  if (input.kind === 'date-keyed') {
    const targetMs = Date.parse(`${input.urlDate}T00:00:00Z`);
    if (Number.isNaN(targetMs)) return false;
    const todayMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const days = Math.abs(targetMs - todayMs) / 86_400_000;
    return days > STALENESS_DAYS;
  }

  // year-keyed
  const currentYear = now.getUTCFullYear();
  return input.urlYear < currentYear - FESTIVAL_YEAR_OFFSET;
}

/**
 * Convenience for the four date-keyed page handlers. Returns the
 * `robots` metadata object to spread into generateMetadata's return, or
 * undefined when the page should stay indexable.
 *
 * Use as:
 *   return {
 *     title, description,
 *     ...staleRobots(dateStr),
 *     alternates: { ... },
 *   };
 */
export function staleRobots(urlDate: string, now?: Date): { robots: { index: false; follow: true } } | undefined {
  if (!isStale({ kind: 'date-keyed', urlDate, now })) return undefined;
  return { robots: { index: false, follow: true } };
}

/** Same shape for year-keyed pages. */
export function staleYearRobots(urlYear: number, now?: Date): { robots: { index: false; follow: true } } | undefined {
  if (!isStale({ kind: 'year-keyed', urlYear, now })) return undefined;
  return { robots: { index: false, follow: true } };
}

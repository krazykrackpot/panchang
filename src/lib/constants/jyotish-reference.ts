/**
 * Ujjain — the traditional prime meridian of Hindu astronomy.
 *
 * Per Surya Siddhanta, Ujjain (Avanti) is the canonical reference for
 * Jyotish computations: it sits on the 75°47' E meridian and was used
 * as the reference longitude for all classical Indian astronomical
 * tables. Modern panchang publishers still compute "all-India"
 * reference panchang for Ujjain.
 *
 * Use this constant whenever you need a default Jyotish reference
 * point — e.g. SEO surfaces showing "today's panchang" without a
 * user-supplied location, festival generators where the rule is
 * "Ujjain sunrise", precomputed daily widgets, social posts.
 *
 * DO NOT inline the 23.1765 / 75.7885 numbers. ~10 call sites used to
 * (cron/social-post, hindu-calendar, daily-article, calendar layouts,
 * precompute models, …) — this module is the canonical replacement.
 */

// (No private IANA constant — `UJJAIN_REFERENCE.ianaZone` below is the
// single source of truth for the IANA representative.)

export const UJJAIN_REFERENCE = {
  lat: 23.1765,
  lng: 75.7885,
  // Ujjain observes IST (UTC+5:30). India has no DST, so the offset
  // is fixed year-round — call sites can use this constant directly
  // instead of going through `getUTCOffsetForDate(..., iana)`.
  tzOffsetHours: 5.5,
  name: 'Ujjain',
  // IANA representative name for IST. We are FORCED to expose this for
  // call sites that hand the timezone to lower-level engines requiring
  // an IANA string (`generateFestivalCalendarV2`, `getUTCOffsetForDate`,
  // raw `Intl.DateTimeFormat` constructors, etc.). It is NOT the Jyotish
  // reference — that is `name` above ("Ujjain"). The IANA database
  // happens to use Kolkata as the canonical city for the +5:30 zone;
  // this constant lets call sites avoid hardcoding the string inline
  // (12 prior duplicates) and keeps the "Jyotish reference is Ujjain"
  // statement co-located with its IANA shadow.
  //
  // If you only need the offset (not the IANA name itself) prefer
  // `tzOffsetHours` above — it is type-narrowed to 5.5 and avoids the
  // tzdata lookup.
  ianaZone: 'Asia/Kolkata',
} as const;

/**
 * Today's wall-clock date at Ujjain (= IST), as numeric parts.
 *
 * Uses `toLocaleDateString('en-CA', { timeZone })` rather than manual
 * offset arithmetic (`now.getTime() + 5.5*3600*1000`, then reading the
 * UTC components). Both produce the same answer for IST today, but the
 * IANA-based path is more obviously correct to a reader — and survives
 * cleanly if we ever need to swap the reference zone (Lesson L: never
 * hand-shift dates in computation code without a justifying comment).
 *
 * Gemini PR #710 MED.
 */
export function getUjjainToday(): { year: number; month: number; day: number } {
  // 'en-CA' formats YYYY-MM-DD which splits cleanly on '-'.
  const istDateStr = new Date().toLocaleDateString('en-CA', { timeZone: UJJAIN_REFERENCE.ianaZone });
  const [year, month, day] = istDateStr.split('-').map(Number);
  return { year, month, day };
}

/**
 * Format a Date as Ujjain (= IST) wall-clock for display.
 *
 * Thin wrapper around `Date.prototype.toLocaleDateString` that fixes
 * the timezone so the call site doesn't have to know IST's IANA name.
 */
export function formatUjjainDate(
  date: Date,
  locale: string,
  options: Intl.DateTimeFormatOptions,
): string {
  return date.toLocaleDateString(locale, { ...options, timeZone: UJJAIN_REFERENCE.ianaZone });
}

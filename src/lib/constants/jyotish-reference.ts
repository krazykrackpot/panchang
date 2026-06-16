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

export const UJJAIN_REFERENCE = {
  lat: 23.1765,
  lng: 75.7885,
  // Ujjain observes IST (UTC+5:30). India has no DST, so the offset
  // is fixed year-round — call sites can use this constant directly
  // instead of going through `getUTCOffsetForDate(..., iana)`.
  tzOffsetHours: 5.5,
  name: 'Ujjain',
} as const;

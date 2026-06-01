/**
 * Strict YYYY-MM-DD validators shared between the proxy (edge) and
 * date-based route handlers. Centralised here per Lesson Q — the
 * "every component must round-trip through Date.UTC" check existed
 * inline in panchang/date and horoscope/[rashi]/[date]; duplicating it
 * is one bad-leap-year edit away from drift.
 *
 * Why we care: `new Date('2026-02-30')` parses fine in JavaScript and
 * rolls over to March 2. Without strict validation, a URL like
 * /en/horoscope/aries/2026-02-30 served real horoscope content (for
 * March 2) under a URL Google should 404. That's duplicate content and
 * costs ranking.
 *
 * The proxy uses these to short-circuit invalid date URLs with a real
 * HTTP 404 — page-level `notFound()` calls render the not-found page
 * but Vercel ISR caches the response as HTTP 200 (soft-404). Catching
 * it at the proxy is the only way to emit a real 404 for ISR routes.
 */

/** True iff `s` is YYYY-MM-DD AND every component round-trips through Date.UTC. */
export function isStrictYmd(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const [y, m, d] = s.split('-').map(Number);
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const utc = new Date(Date.UTC(y, m - 1, d));
  return (
    !isNaN(utc.getTime()) &&
    utc.getUTCFullYear() === y &&
    utc.getUTCMonth() + 1 === m &&
    utc.getUTCDate() === d
  );
}

/**
 * True iff `s` LOOKS like YYYY-MM-DD shape (4-2-2 digits with hyphens)
 * but fails strict round-trip — e.g. 2026-02-30, 2026-04-31, 2025-02-29.
 * Strings that aren't date-shaped at all (e.g. "weekly", "monthly",
 * "delhi") return false so the proxy lets them through to the
 * appropriate sibling route.
 */
export function isRolloverDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  return !isStrictYmd(s);
}

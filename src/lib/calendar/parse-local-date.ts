/**
 * Parse a "YYYY-MM-DD" string into a Date anchored at LOCAL midnight.
 *
 * Why this exists: `new Date('2026-05-22')` is parsed by the spec as UTC
 * midnight (ISO 8601 date-only form). For users west of UTC this lands on
 * the *previous* civil day when formatted in local time, so a Friday cell
 * suddenly reads "Thursday" in the detail panel header and in mobile list
 * rows. See CLAUDE.md Lesson L for the broader rule.
 *
 * Returns null on malformed input rather than NaN-on-arrival.
 */
export function parseLocalDate(yyyyMmDd: string): Date | null {
  // Cheap structural check first — Date constructor will silently produce
  // an Invalid Date and propagate Lesson-L-class bugs.
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(yyyyMmDd);
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  return new Date(y, m - 1, d);
}

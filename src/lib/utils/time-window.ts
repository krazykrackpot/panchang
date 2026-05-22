/**
 * Midnight-wrap-aware time-window predicate.
 *
 * CLAUDE.md Lesson R hard rule: "Any time-range comparison
 * `now >= start && now < end` MUST handle midnight wrapping."
 *
 * Inputs are 24h "HH:MM" strings (local time — the caller is responsible
 * for resolving the window to the same timezone as `now`).
 *
 * Semantics:
 *   - inclusive start, exclusive end (matches the canonical "we are inside
 *     this slot" convention used across the project's panchang code)
 *   - when `end < start` (e.g. start='22:30', end='01:15'), we treat the
 *     window as spanning midnight and return true for both halves
 *   - when `start === end`, the window is empty (returns false for any now)
 */
export function isInsideWindow(now: string, start: string, end: string): boolean {
  const toMin = (t: string) => {
    const [h, mm] = t.split(':').map(Number);
    return h * 60 + mm;
  };
  const n = toMin(now);
  const s = toMin(start);
  const e = toMin(end);
  if (s === e) return false;
  return e < s ? (n >= s || n < e) : (n >= s && n < e);
}

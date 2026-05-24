/**
 * Birth-data normalisation helpers.
 *
 * Used for dedup comparisons of saved kundalis. Without normalisation,
 * `"12:00"` and `"12:00:00"` would compare unequal — each represents the
 * same birth time but came from different UI inputs (different `<input>`
 * defaults across pages). Per audit P1-23 + the CLAUDE.md global rule
 * "Normalize keys before comparing: trim + lowercase names, round floats
 * to fixed precision."
 *
 * Time-of-birth canonical form: HH:MM (no seconds). Both `"12:00"` and
 * `"12:00:00"` round-trip to `"12:00"`.
 */

/** Strip seconds, ensure HH:MM. Returns the input unchanged if it doesn't match either common shape. */
export function normalizeBirthTime(t: string | null | undefined): string {
  if (!t) return '';
  const trimmed = t.trim();
  // HH:MM:SS → HH:MM
  const m = trimmed.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/);
  if (!m) return trimmed;
  const hh = m[1].padStart(2, '0');
  const mm = m[2];
  return `${hh}:${mm}`;
}

/** Normalise a name for dedup: trim + lowercase. Empty if nullish. */
export function normalizeBirthName(name: string | null | undefined): string {
  return (name ?? '').trim().toLowerCase();
}

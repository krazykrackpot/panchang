/**
 * Dur Muhurtam (inauspicious muhurta) lookup tables.
 *
 * Each entry is an array of 0-indexed muhurta indices for that weekday.
 * The day is divided into 15 muhurtas from sunrise to sunset.
 * Muhurta duration = (sunset - sunrise) / 15.
 *
 * Sources:
 *   A: Kaala Prakashika / South Indian (matches Prokerala, Drik Panchang)
 *   B: Nirṇaya Sindhu / North Indian (older Dharma Sindhu lineage)
 *
 * Verified against Prokerala Apr 5-11, 2026.
 * Weekday index: 0=Sunday (matches JD weekday convention).
 */

/** Kaala Prakashika tradition (primary — matches modern panchangs) */
export const DUR_MUHURTAM_A: readonly number[][] = [
  [13],    // Sunday    — 14th muhurta
  [8, 11], // Monday    — 9th & 12th muhurta
  [3],     // Tuesday   — 4th muhurta
  [7],     // Wednesday — 8th muhurta
  [5, 11], // Thursday  — 6th & 12th muhurta
  [3, 8],  // Friday    — 4th & 9th muhurta
  [2],     // Saturday  — 3rd muhurta
] as const;

/** Nirṇaya Sindhu tradition (alternate) */
export const DUR_MUHURTAM_B: readonly number[][] = [
  [6, 10], // Sunday    — 7th & 11th muhurta
  [5],     // Monday    — 6th muhurta
  [7],     // Tuesday   — 8th muhurta
  [7],     // Wednesday — 8th muhurta
  [3],     // Thursday  — 4th muhurta
  [4, 8],  // Friday    — 5th & 9th muhurta
  [1],     // Saturday  — 2nd muhurta
] as const;

/**
 * Varjyam (Thyajyam) and Amrit Kalam ghati offset tables.
 *
 * Source: Prashna Marga Ch.7 (Thyajya Nakshatra Bhoga), WisdomLib edition.
 * Cross-validated against Prokerala Panchang (±1-5 min agreement).
 *
 * IMPORTANT: 1 ghati = 1/60th of the nakshatra's ACTUAL duration (NOT fixed 24 min).
 * Offset formula: nakshatra_start + (ghati / 60) * nakshatra_duration
 * Duration of window: 4 ghatis = (4/60) * nakshatra_duration
 * Accuracy ceiling: ±12 min (inherent to integer-ghati classical tables).
 *
 * Array index: nakshatra number - 1 (0=Ashwini, 26=Revati).
 */

/** Primary Varjyam ghati offset from nakshatra start (0-indexed by nakshatra) */
export const VARJYAM_GHATI: readonly number[] = [
  50, 24, 30, 40, 15,  // Ashwini(1)-Mrigashira(5)
  21, 30, 20, 32, 30,  // Ardra(6)-Magha(10) — Ardra=21, Punarvasu=30, Pushya=20
  20, 18, 22, 20, 14,  // P.Phalguni(11)-Swati(15) — U.Phalguni=18
  14, 10, 14, 20, 24,  // Vishakha(16)-P.Ashadha(20)
  20, 10, 10, 18, 16,  // U.Ashadha(21)-P.Bhadra(25)
  26, 30,              // U.Bhadra(26)-Revati(27)
] as const;

/**
 * Secondary Varjyam offset for nakshatras with dual Thyajyam (Prashna Marga 7.18).
 * -1 means no second window. Only Mula(19) has dual windows at 20 and 56 ghatis.
 */
export const VARJYAM_GHATI_2: readonly number[] = [
  -1, -1, -1, -1, -1,  // Ashwini(1)-Mrigashira(5)
  -1, -1, -1, -1, -1,  // Ardra(6)-Magha(10)
  -1, -1, -1, -1, -1,  // P.Phalguni(11)-Swati(15)
  -1, -1, -1, 56, -1,  // Vishakha(16)-P.Ashadha(20) — Mula(19) dual
  -1, -1, -1, -1, -1,  // U.Ashadha(21)-P.Bhadra(25)
  -1, -1,              // U.Bhadra(26)-Revati(27)
] as const;

/** Amrit Kalam ghati offset from nakshatra start (Prashna Marga Ch.7) */
export const AMRIT_GHATI: readonly number[] = [
  42, 48, 54, 52, 38,  // Ashwini(1)-Mrigashira(5)
  35, 54, 44, 56, 54,  // Ardra(6)-Magha(10)
  44, 42, 45, 44, 38,  // P.Phalguni(11)-Swati(15)
  38, 34, 38, 44, 48,  // Vishakha(16)-P.Ashadha(20)
  38, 34, 43, 42, 40,  // U.Ashadha(21)-P.Bhadra(25)
  49, 54,              // U.Bhadra(26)-Revati(27)
] as const;

/** Duration of Varjyam/Amrit windows in ghatis */
export const WINDOW_DURATION_GHATI = 4;

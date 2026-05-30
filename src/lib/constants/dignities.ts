/**
 * Canonical Jyotish Dignity Tables
 *
 * SINGLE SOURCE OF TRUTH for exaltation, debilitation, moolatrikona,
 * and sign lordship. ALL other files MUST import from here.
 *
 * See CLAUDE.md Lesson Q: "Constants that appear in multiple files must live in one shared file."
 * See CLAUDE.md Lesson S: "Canonical BPHS tables must be defined ONCE."
 */

/**
 * Exaltation signs for each planet.
 * Key: planet ID (0=Sun through 8=Ketu)
 * Value: rashi number (1=Aries through 12=Pisces)
 *
 * Source: BPHS Ch.3, verified Apr 2026 across 12 files.
 */
export const EXALTATION_SIGNS: Record<number, number> = {
  0: 1,   // Sun exalted in Aries
  1: 2,   // Moon exalted in Taurus
  2: 10,  // Mars exalted in Capricorn
  3: 6,   // Mercury exalted in Virgo
  4: 4,   // Jupiter exalted in Cancer
  5: 12,  // Venus exalted in Pisces
  6: 7,   // Saturn exalted in Libra
  7: 3,   // Rahu exalted in Gemini (per BPHS)
  8: 9,   // Ketu exalted in Sagittarius (per BPHS)
};

/**
 * Debilitation signs (opposite of exaltation).
 */
export const DEBILITATION_SIGNS: Record<number, number> = {
  0: 7,   // Sun debilitated in Libra
  1: 8,   // Moon debilitated in Scorpio
  2: 4,   // Mars debilitated in Cancer
  3: 12,  // Mercury debilitated in Pisces
  4: 10,  // Jupiter debilitated in Capricorn
  5: 6,   // Venus debilitated in Virgo
  6: 1,   // Saturn debilitated in Aries
  7: 9,   // Rahu debilitated in Sagittarius
  8: 3,   // Ketu debilitated in Gemini
};

/**
 * Exaltation degrees (exact degree of deep exaltation).
 * Source: BPHS Ch.3
 */
export const EXALTATION_DEGREES: Record<number, number> = {
  0: 10,  // Sun at 10° Aries
  1: 3,   // Moon at 3° Taurus
  2: 28,  // Mars at 28° Capricorn
  3: 15,  // Mercury at 15° Virgo
  4: 5,   // Jupiter at 5° Cancer
  5: 27,  // Venus at 27° Pisces
  6: 20,  // Saturn at 20° Libra
};

/**
 * Moolatrikona signs and degree ranges.
 * Source: BPHS Ch.4, verified Apr 2026.
 */
export const MOOLATRIKONA: Record<number, { sign: number; startDeg: number; endDeg: number }> = {
  0: { sign: 5, startDeg: 0, endDeg: 20 },    // Sun: Leo 0-20°
  1: { sign: 2, startDeg: 4, endDeg: 20 },    // Moon: Taurus 4-20°
  2: { sign: 1, startDeg: 0, endDeg: 12 },    // Mars: Aries 0-12°
  3: { sign: 6, startDeg: 16, endDeg: 20 },   // Mercury: Virgo 16-20°
  4: { sign: 9, startDeg: 0, endDeg: 10 },    // Jupiter: Sagittarius 0-10°
  5: { sign: 7, startDeg: 0, endDeg: 5 },     // Venus: Libra 0-5°
  6: { sign: 11, startDeg: 0, endDeg: 20 },   // Saturn: Aquarius 0-20°
};

/**
 * Sign lordship  –  which planet rules each rashi.
 * Key: rashi number (1=Aries through 12=Pisces)
 * Value: planet ID (0=Sun through 6=Saturn)
 *
 * Rahu and Ketu have no sign lordship in classical Jyotish.
 */
export const SIGN_LORDS: Record<number, number> = {
  1: 2,   // Aries -> Mars
  2: 5,   // Taurus -> Venus
  3: 3,   // Gemini -> Mercury
  4: 1,   // Cancer -> Moon
  5: 0,   // Leo -> Sun
  6: 3,   // Virgo -> Mercury
  7: 5,   // Libra -> Venus
  8: 2,   // Scorpio -> Mars
  9: 4,   // Sagittarius -> Jupiter
  10: 6,  // Capricorn -> Saturn
  11: 6,  // Aquarius -> Saturn
  12: 4,  // Pisces -> Jupiter
};

/**
 * Own signs for each planet (signs they rule).
 * Key: planet ID -> array of rashi numbers
 */
export const OWN_SIGNS: Record<number, number[]> = {
  0: [5],       // Sun -> Leo
  1: [4],       // Moon -> Cancer
  2: [1, 8],    // Mars -> Aries, Scorpio
  3: [3, 6],    // Mercury -> Gemini, Virgo
  4: [9, 12],   // Jupiter -> Sagittarius, Pisces
  5: [2, 7],    // Venus -> Taurus, Libra
  6: [10, 11],  // Saturn -> Capricorn, Aquarius
};

/**
 * Check if a planet is in its own sign.
 */
export function isOwnSign(planetId: number, sign: number): boolean {
  return OWN_SIGNS[planetId]?.includes(sign) ?? false;
}

/**
 * Exaltation degree cap for planets whose exaltation sign overlaps with
 * their own Moolatrikona range. Only the Moon and Mercury collide:
 *
 *   - Moon:    Exalted   0–3° Taurus  (peak at 3°)
 *              MT        4–20° Taurus
 *              Above 20°: falls through to friendship with sign-lord Venus.
 *
 *   - Mercury: Exalted   0–15° Virgo  (peak at 15°)
 *              MT        16–20° Virgo
 *              Own       20–30° Virgo  (Mercury rules Virgo)
 *
 * For every other planet the exaltation sign does not overlap with its
 * MT or own-sign ranges, so exaltation applies across the full 0–30°
 * (no entry here — `isExaltedAtDegree` short-circuits to true).
 *
 * Values are set to the corresponding MT.startDeg so the boundary is
 * exclusive on the exaltation side (`degree < cap`) and inclusive on
 * the MT side (`degree >= mt.startDeg`), giving a clean handoff with
 * no gap in classification.
 *
 * Source: BPHS Ch.4, verified Apr 2026 (CLAUDE.md Lesson U).
 */
export const EXALTATION_UPPER_DEG: Record<number, number> = {
  1: 4,   // Moon — MT starts at 4° Taurus
  3: 16,  // Mercury — MT starts at 16° Virgo
};

/**
 * Check if a planet is in its exaltation sign.
 * Note: this returns true anywhere in the exaltation sign, including the
 * degrees that classically belong to Moolatrikona or own-sign for Moon
 * and Mercury. Use `isExaltedAtDegree` for degree-aware classification.
 */
export function isExalted(planetId: number, sign: number): boolean {
  return EXALTATION_SIGNS[planetId] === sign;
}

/**
 * Degree-aware exaltation check.
 *
 * Returns true when the planet sits in its exaltation sign AND, for
 * planets with an `EXALTATION_UPPER_DEG` entry (Moon, Mercury), below
 * the degree at which Moolatrikona takes over.
 *
 * Use this — not the sign-only `isExalted` — anywhere you classify
 * dignity tiers or display "Exalted" status to a user. The sign-only
 * version is retained for callers that intentionally want "is in the
 * exaltation sign" (e.g. yoga detection by sign), but the default for
 * dignity surfaces should be the degree-aware version.
 */
export function isExaltedAtDegree(
  planetId: number,
  sign: number,
  longitude: number,
): boolean {
  if (EXALTATION_SIGNS[planetId] !== sign) return false;
  const cap = EXALTATION_UPPER_DEG[planetId];
  if (cap == null) return true; // full-sign exaltation
  return longitude < cap;
}

/**
 * Parama Uchcha — within ±1° of the planet's exact exaltation degree.
 * Returns false outside the exaltation sign, and outside the degree
 * window (for Moon / Mercury) where the planet is no longer exalted.
 */
const PARAMA_UCHCHA_ORB_DEG = 1;
export function isParamaUchcha(
  planetId: number,
  sign: number,
  longitude: number,
): boolean {
  if (!isExaltedAtDegree(planetId, sign, longitude)) return false;
  const peak = EXALTATION_DEGREES[planetId];
  return peak != null && Math.abs(longitude - peak) <= PARAMA_UCHCHA_ORB_DEG;
}

/**
 * Check if a planet is debilitated.
 */
export function isDebilitated(planetId: number, sign: number): boolean {
  return DEBILITATION_SIGNS[planetId] === sign;
}

/**
 * Get the lord (ruler) of a sign.
 */
export function getSignLord(sign: number): number {
  return SIGN_LORDS[sign] ?? 0;
}

/**
 * Sign lords as a 0-indexed array (index 0=Aries, 11=Pisces).
 * Equivalent to SIGN_LORDS but for code that uses array indexing:
 *   SIGN_LORDS_ARRAY[sign - 1] === SIGN_LORDS[sign]
 */
export const SIGN_LORDS_ARRAY: number[] = [2, 5, 3, 1, 0, 3, 5, 2, 4, 6, 6, 4];

/**
 * Moolatrikona as sign-only mapping (no degree ranges).
 * Key: planet ID (0-6), Value: moolatrikona sign number (1-12).
 * Use MOOLATRIKONA for the full range data when degree checks are needed.
 */
export const MOOLATRIKONA_SIGN: Record<number, number> = {
  0: 5,   // Sun: Leo
  1: 2,   // Moon: Taurus
  2: 1,   // Mars: Aries
  3: 6,   // Mercury: Virgo
  4: 9,   // Jupiter: Sagittarius
  5: 7,   // Venus: Libra
  6: 11,  // Saturn: Aquarius
};

/**
 * Marana Karaka Sthana (MKS) — the house where a planet's natural significations
 * are weakened to a "death-like" state. From Phaladeepika Ch.7 / Saravali.
 *
 * Sun-to-Saturn only. Rahu and Ketu are DELIBERATELY EXCLUDED here despite
 * some commentaries (KP tradition extends to Rahu→9, Ketu→3). The classical
 * Phaladeepika / Saravali sources do not list MKS for the lunar nodes, and
 * including them inflates the "rare" dosha frequency in a way that masks
 * the real Sun-Saturn cases. Picked deliberately to align two engines that
 * previously diverged: the yogas-complete table included nodes, the
 * yoga-engine/rules/dosha table did not. See audit P0-22 (2026-05-23).
 *
 * Single source of truth — every detector must import from here.
 */
export const MARANA_KARAKA_HOUSE: Record<number, number> = {
  0: 12, // Sun in 12th
  1: 8,  // Moon in 8th
  2: 7,  // Mars in 7th
  3: 4,  // Mercury in 4th
  4: 3,  // Jupiter in 3rd
  5: 6,  // Venus in 6th
  6: 1,  // Saturn in 1st
};

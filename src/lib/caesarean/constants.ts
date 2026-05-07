// src/lib/caesarean/constants.ts

/**
 * Classical birth-election constants.
 * Sources: BPHS Ch.3-7, Muhurta Chintamani, Prasna Marga Ch.9,
 * Kalaprakashika, Saravali, practitioner consensus.
 *
 * ALL constants defined here — NEVER duplicate in other files (Lesson Q).
 */

import type { LocaleText } from '@/types/panchang';

// ─── Dasha Lord Scores ──────────────────────────────────────────────────────

/** Base desirability score for starting a maha dasha at birth (0-10). */
export const DASHA_LORD_BIRTH_SCORE: Record<string, number> = {
  Jupiter: 10,
  Venus: 9,
  Mercury: 8,
  Moon: 7,
  Sun: 6,
  Mars: 4,
  Saturn: 3,
  Rahu: 2,
  Ketu: 1,
};

// ─── Janma Nakshatra Doshas ─────────────────────────────────────────────────

export interface JanmaNakshatraDosha {
  nakshatraId: number;
  problematicPada: number | null; // null = all padas mildly affected
  severity: 'severe' | 'moderate' | 'mild';
  harm: LocaleText;
}

export const JANMA_NAKSHATRA_DOSHAS: JanmaNakshatraDosha[] = [
  { nakshatraId: 9,  problematicPada: 4,    severity: 'severe',   harm: { en: 'Ashlesha 4th pada — harm to mother', hi: 'आश्लेषा चतुर्थ चरण — माता को हानि' } },
  { nakshatraId: 10, problematicPada: 1,    severity: 'severe',   harm: { en: 'Magha 1st pada — harm to father', hi: 'मघा प्रथम चरण — पिता को हानि' } },
  { nakshatraId: 18, problematicPada: 4,    severity: 'severe',   harm: { en: 'Jyeshtha 4th pada — harm to elder sibling', hi: 'ज्येष्ठा चतुर्थ चरण — बड़े भाई/बहन को हानि' } },
  { nakshatraId: 19, problematicPada: 1,    severity: 'severe',   harm: { en: 'Moola 1st pada — harm to father/family', hi: 'मूल प्रथम चरण — पिता/परिवार को हानि' } },
  { nakshatraId: 9,  problematicPada: null, severity: 'moderate', harm: { en: 'Ashlesha — general caution', hi: 'आश्लेषा — सामान्य सावधानी' } },
  { nakshatraId: 19, problematicPada: null, severity: 'moderate', harm: { en: 'Moola — general caution', hi: 'मूल — सामान्य सावधानी' } },
];

// ─── Gandanta Zones ─────────────────────────────────────────────────────────

/**
 * Gandanta = last 3°20' of a water sign -> first 3°20' of a fire sign.
 * Water signs: Cancer (4), Scorpio (8), Pisces (12)
 * Fire signs:  Leo (5), Sagittarius (9), Aries (1)
 * Junctions: Cancer->Leo, Scorpio->Sagittarius, Pisces->Aries
 *
 * In sidereal degrees:
 *   Cancer ends at 120°,  Leo starts at 120°  -> zone: 116.667° - 123.333°
 *   Scorpio ends at 240°, Sagittarius at 240° -> zone: 236.667° - 243.333°
 *   Pisces ends at 360°,  Aries starts at 0°  -> zone: 356.667° - 3.333°
 */
export const GANDANTA_ZONES: Array<{ startDeg: number; endDeg: number; wraps: boolean }> = [
  { startDeg: 116.667, endDeg: 123.333, wraps: false },
  { startDeg: 236.667, endDeg: 243.333, wraps: false },
  { startDeg: 356.667, endDeg: 3.333,   wraps: true },
];

export function isInGandanta(moonSidDeg: number): boolean {
  for (const zone of GANDANTA_ZONES) {
    if (zone.wraps) {
      if (moonSidDeg >= zone.startDeg || moonSidDeg <= zone.endDeg) return true;
    } else {
      if (moonSidDeg >= zone.startDeg && moonSidDeg <= zone.endDeg) return true;
    }
  }
  return false;
}

// ─── Moon House Scores ──────────────────────────────────────────────────────

/** Moon's house from lagna -> score (Muhurta Chintamani) */
export const MOON_HOUSE_SCORE: Record<number, number> = {
  1: 8, 2: 5, 3: 3, 4: 8, 5: 7, 6: 0,
  7: 8, 8: 0, 9: 7, 10: 8, 11: 5, 12: 0,
};

// ─── Lagna Lord House Placement Scores ──────────────────────────────────────

/** Lagna lord's house -> placement score (BPHS Ch.6) */
export const LAGNA_LORD_HOUSE_SCORE: Record<number, number> = {
  1: 5, 2: 2, 3: 1, 4: 5, 5: 4, 6: 0,
  7: 5, 8: 0, 9: 4, 10: 5, 11: 3, 12: 0,
};

// ─── Nakshatra Gana (temperament group) ─────────────────────────────────────

/**
 * Nakshatra ID (1-27) -> Gana. Deva = divine, Manushya = human, Rakshasa = demon.
 * VERIFIED values for the user-specified edge cases:
 *   Shravana(22)=Deva, Dhanishta(23)=Rakshasa, Shatabhisha(24)=Rakshasa,
 *   PurvaBhadra(25)=Manushya, UttaraBhadra(26)=Manushya
 */
export const NAKSHATRA_GANA: Record<number, 'deva' | 'manushya' | 'rakshasa'> = {
  1: 'deva',      // Ashwini
  2: 'manushya',  // Bharani
  3: 'rakshasa',  // Krittika
  4: 'deva',      // Rohini
  5: 'deva',      // Mrigashira
  6: 'manushya',  // Ardra
  7: 'deva',      // Punarvasu
  8: 'deva',      // Pushya
  9: 'rakshasa',  // Ashlesha
  10: 'rakshasa', // Magha
  11: 'manushya', // Purva Phalguni
  12: 'manushya', // Uttara Phalguni
  13: 'deva',     // Hasta
  14: 'rakshasa', // Chitra
  15: 'deva',     // Swati
  16: 'rakshasa', // Vishakha
  17: 'deva',     // Anuradha
  18: 'rakshasa', // Jyeshtha
  19: 'rakshasa', // Moola
  20: 'manushya', // Purva Ashadha
  21: 'manushya', // Uttara Ashadha
  22: 'deva',     // Shravana
  23: 'rakshasa', // Dhanishta
  24: 'rakshasa', // Shatabhisha
  25: 'manushya', // Purva Bhadrapada
  26: 'manushya', // Uttara Bhadrapada
  27: 'deva',     // Revati
};

// ─── Benefic/Malefic Classification ─────────────────────────────────────────

/** Natural benefics: Jupiter(4), Venus(5), Mercury(3). Moon(1) handled separately (waxing = benefic). */
export const NATURAL_BENEFICS = new Set([4, 5, 3]);
/** Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8) */
export const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

// ─── Pushkar Navamsha Lagnas ────────────────────────────────────────────────

/**
 * Pushkar Navamsha: specific navamsha divisions considered highly auspicious.
 * Each sign has certain degree ranges where the navamsha falls in a Pushkar division.
 * Stored as { sign, startDeg, endDeg } objects (degree ranges within that sign).
 * From Saravali / Jataka Parijata.
 */
export const PUSHKAR_NAVAMSHA_RANGES: Array<{ sign: number; startDeg: number; endDeg: number }> = [
  // Aries: 20°00' - 23°20' (Libra navamsha)
  { sign: 1, startDeg: 20, endDeg: 23.333 },
  // Taurus: 6°40' - 10°00' (Virgo navamsha), 20°00' - 23°20' (Pisces navamsha)
  { sign: 2, startDeg: 6.667, endDeg: 10 },
  { sign: 2, startDeg: 20, endDeg: 23.333 },
  // Gemini: 16°40' - 20°00' (Sagittarius navamsha)
  { sign: 3, startDeg: 16.667, endDeg: 20 },
  // Cancer: 0°00' - 3°20' (Cancer navamsha), 13°20' - 16°40' (Pisces navamsha)
  { sign: 4, startDeg: 0, endDeg: 3.333 },
  { sign: 4, startDeg: 13.333, endDeg: 16.667 },
  // Leo: 6°40' - 10°00' (Libra navamsha), 26°40' - 30°00' (Pisces navamsha)
  { sign: 5, startDeg: 6.667, endDeg: 10 },
  { sign: 5, startDeg: 26.667, endDeg: 30 },
  // Virgo: 16°40' - 20°00' (Pisces navamsha)
  { sign: 6, startDeg: 16.667, endDeg: 20 },
  // Libra: 0°00' - 3°20' (Libra navamsha), 20°00' - 23°20' (Aries navamsha)
  { sign: 7, startDeg: 0, endDeg: 3.333 },
  { sign: 7, startDeg: 20, endDeg: 23.333 },
  // Scorpio: 6°40' - 10°00' (Pisces navamsha), 26°40' - 30°00' (Cancer navamsha)
  { sign: 8, startDeg: 6.667, endDeg: 10 },
  { sign: 8, startDeg: 26.667, endDeg: 30 },
  // Sagittarius: 16°40' - 20°00' (Aries navamsha)
  { sign: 9, startDeg: 16.667, endDeg: 20 },
  // Capricorn: 0°00' - 3°20' (Capricorn navamsha), 13°20' - 16°40' (Pisces navamsha)
  { sign: 10, startDeg: 0, endDeg: 3.333 },
  { sign: 10, startDeg: 13.333, endDeg: 16.667 },
  // Aquarius: 6°40' - 10°00' (Aries navamsha), 26°40' - 30°00' (Libra navamsha)
  { sign: 11, startDeg: 6.667, endDeg: 10 },
  { sign: 11, startDeg: 26.667, endDeg: 30 },
  // Pisces: 16°40' - 20°00' (Cancer navamsha)
  { sign: 12, startDeg: 16.667, endDeg: 20 },
];

// ─── Badhaka Lords ──────────────────────────────────────────────────────────

/**
 * Badhakesh (obstruction lord) by lagna sign.
 * Movable signs (1,4,7,10): 11th lord is badhaka
 * Fixed signs (2,5,8,11): 9th lord is badhaka
 * Dual signs (3,6,9,12): 7th lord is badhaka
 *
 * Accepts signLords as a parameter to avoid circular dependency (Lesson Q).
 * Caller imports SIGN_LORDS from @/lib/constants/dignities and passes it in.
 */
export function getBadhakeshPlanet(lagnaSign: number, signLords: Record<number, number>): number {
  const modality = getSignModality(lagnaSign);
  const badhakHouse = modality === 'movable' ? 11 : modality === 'fixed' ? 9 : 7;
  const badhakSign = ((lagnaSign - 1 + badhakHouse - 1) % 12) + 1;
  return signLords[badhakSign];
}

function getSignModality(sign: number): 'movable' | 'fixed' | 'dual' {
  const mod = ((sign - 1) % 3);
  return mod === 0 ? 'movable' : mod === 1 ? 'fixed' : 'dual';
}

// ─── Combustion Orbs (BPHS Ch.3) ───────────────────────────────────────────

/**
 * Planet ID -> combustion orb in degrees.
 * Mercury: 14° (12° if retrograde), Venus: 10° (8° if retrograde).
 * Retrograde adjustments handled in scorer (Lesson X).
 */
export const COMBUSTION_ORBS: Record<number, number> = {
  1: 12, // Moon
  2: 17, // Mars
  3: 14, // Mercury (12 if retrograde — handled in scorer)
  4: 11, // Jupiter
  5: 10, // Venus (8 if retrograde — handled in scorer)
  6: 15, // Saturn
};

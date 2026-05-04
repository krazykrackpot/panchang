/**
 * Classical Muhurta Checks — hard vetoes and lagna scoring
 *
 * These checks implement rules with strong textual consensus from:
 * - Muhurta Chintamani Ch. 6 (Vivah Prakarana)
 * - Dharmasindhu (Vivaha Prakarana)
 * - B.V. Raman's Muhurtha (Ch. 12-13)
 *
 * See docs/muhurta-rules.md for full citations.
 */

import { getPlanetaryPositions, toSidereal, getRashiNumber } from '@/lib/ephem/astronomical';
import { computeCombust } from '@/lib/ephem/coordinates';
import { calculateAscendant } from '@/lib/ephem/kundali-calc';
import type { ExtendedActivity } from '@/types/muhurta-ai';
import type { LocaleText } from '@/types/panchang';

// ─── Venus / Jupiter Combustion ─────────────────────────────────────────────
// Muhurta Chintamani + Dharmasindhu: Marriage absolutely forbidden when
// Venus (Shukra) or Jupiter (Guru) is combust.
// Venus governs conjugal happiness; Jupiter governs dharma and progeny.

/**
 * Check if Venus or Jupiter is combust at the given JD.
 * Returns the combust planet name(s) or null if neither is combust.
 */
export function checkVivahCombustion(jd: number): { vetoed: boolean; planets: string[] } {
  const positions = getPlanetaryPositions(jd);
  const sun = positions.find(p => p.id === 0);
  if (!sun) return { vetoed: false, planets: [] };

  const combustPlanets: string[] = [];

  // Venus (id=5)
  const venus = positions.find(p => p.id === 5);
  if (venus && computeCombust(5, venus.longitude, sun.longitude, venus.isRetrograde)) {
    combustPlanets.push('Venus');
  }

  // Jupiter (id=4)
  const jupiter = positions.find(p => p.id === 4);
  if (jupiter && computeCombust(4, jupiter.longitude, sun.longitude, jupiter.isRetrograde)) {
    combustPlanets.push('Jupiter');
  }

  return { vetoed: combustPlanets.length > 0, planets: combustPlanets };
}

// ─── Lagna (Ascendant) Scoring ──────────────────────────────────────────────
// Muhurta Chintamani: "Even where other favourable conditions are not present,
// a properly chosen lagna will remove the defects."
//
// Best for Vivah: Mithuna (3), Kanya (6), Tula (7)
// Also good: Vrishabha (2), Karka (4), Dhanu (9), Meena (12)
// Neutral: Simha (5), Makara (10), Kumbha (11)
// Avoid: Mesha (1), Vrischika (8)
//
// B.V. Raman: Taurus(2) through Libra(7) + Pisces(12). 8th house must be empty.

// Vivah lagna suitability: rashi index 1-12 → score
const VIVAH_LAGNA_SCORE: Record<number, number> = {
  1: -2,  // Mesha (Aries) — Mars-ruled, aggressive for marriage
  2: 6,   // Vrishabha (Taurus) — Venus-ruled, excellent
  3: 8,   // Mithuna (Gemini) — MC top pick
  4: 5,   // Karka (Cancer) — Moon-ruled, emotional, good
  5: 2,   // Simha (Leo) — Sun-ruled, neutral
  6: 8,   // Kanya (Virgo) — MC top pick
  7: 8,   // Tula (Libra) — MC top pick, Venus-ruled
  8: -3,  // Vrischika (Scorpio) — Mars-ruled, 8th natural sign
  9: 5,   // Dhanu (Sagittarius) — Jupiter-ruled, good
  10: 1,  // Makara (Capricorn) — Saturn-ruled, neutral
  11: 1,  // Kumbha (Aquarius) — Saturn-ruled, neutral
  12: 5,  // Meena (Pisces) — Jupiter-ruled, good
};

// Generic lagna scores for non-marriage activities
const GENERIC_LAGNA_SCORE: Record<number, number> = {
  1: 3, 2: 5, 3: 5, 4: 4, 5: 3, 6: 5,
  7: 5, 8: 0, 9: 5, 10: 3, 11: 3, 12: 4,
};

export interface LagnaResult {
  rashi: number;       // 1-12
  rashiName: string;
  score: number;       // -3 to +8
  isExcellent: boolean; // MC top picks
}

const RASHI_NAMES = [
  '', 'Mesha', 'Vrishabha', 'Mithuna', 'Karka', 'Simha', 'Kanya',
  'Tula', 'Vrischika', 'Dhanu', 'Makara', 'Kumbha', 'Meena',
];

/**
 * Compute sidereal lagna at a given JD and score it for an activity.
 */
export function scoreLagna(
  jd: number,
  lat: number,
  lng: number,
  activityId: string,
): LagnaResult {
  const tropicalAsc = calculateAscendant(jd, lat, lng);
  const siderealAsc = toSidereal(tropicalAsc, jd);
  const rashi = getRashiNumber(siderealAsc);

  const scores = activityId === 'marriage' || activityId === 'engagement'
    ? VIVAH_LAGNA_SCORE
    : GENERIC_LAGNA_SCORE;

  const score = scores[rashi] ?? 0;
  const isExcellent = activityId === 'marriage'
    ? [3, 6, 7].includes(rashi)  // Gemini, Virgo, Libra
    : score >= 5;

  return {
    rashi,
    rashiName: RASHI_NAMES[rashi] || `Rashi ${rashi}`,
    score,
    isExcellent,
  };
}

// ─── Adhika Masa Check ──────────────────────────────────────────────────────
// Dharmasindhu: Marriage prohibited during Adhika (intercalary) Masa.
// An Adhika Masa occurs when a lunar month contains no solar ingress
// (sankranti). This happens ~once every 2.7 years.

import { getLunarMasaForDate } from '@/lib/calendar/hindu-months';

/**
 * Check if a date falls in Adhika (intercalary) Masa.
 * Dharmasindhu explicitly prohibits marriage during Adhika Masa.
 */
export function isAdhikaMasa(year: number, month: number, day: number): boolean {
  const masa = getLunarMasaForDate(year, month, day);
  return masa?.isAdhika ?? false;
}

// ─── Chaturmas Check ────────────────────────────────────────────────────────
// Dharmasindhu: Marriage prohibited during Chaturmas (Harishayana period).
// Chaturmas = Devshayani Ekadashi (Ashadha Shukla 11) to
//             Prabodhini Ekadashi (Kartika Shukla 11).
// ~July to November in the Gregorian calendar.
//
// Precise Ekadashi boundaries require the tithi table. We approximate
// using Amanta month names: Shravana and Bhadrapada are fully within
// Chaturmas; Ashadha (latter half) and Ashwina/Kartika (first half)
// are partial. We conservatively mark Shravana + Bhadrapada as hard
// veto, and Ashadha/Ashwina as soft (handled by the month being
// naturally poor for marriage due to monsoon/inauspicious yogas).

// Amanta masa indices: 0=Chaitra..11=Phalguna
// Shravana=4, Bhadrapada=5 are fully within Chaturmas.
// Ashadha=3 is partial (after Ekadashi), Ashwina=6 is partial (until Ekadashi).
const CHATURMAS_FULL_MONTHS = [4, 5]; // Shravana, Bhadrapada — hard veto
const CHATURMAS_PARTIAL_MONTHS = [3, 6]; // Ashadha, Ashwina — soft penalty

/**
 * Check if a date falls within Chaturmas.
 * Returns 'full' for months entirely within Chaturmas (hard veto),
 * 'partial' for edge months (soft penalty), or null.
 */
export function checkChaturmas(year: number, month: number, day: number): 'full' | 'partial' | null {
  const masa = getLunarMasaForDate(year, month, day);
  if (!masa) return null;
  if (CHATURMAS_FULL_MONTHS.includes(masa.masaIdx)) return 'full';
  if (CHATURMAS_PARTIAL_MONTHS.includes(masa.masaIdx)) return 'partial';
  return null;
}

// ─── Krishna Paksha Conditional Logic ───────────────────────────────────────
// No classical text explicitly forbids Krishna Paksha for marriage.
// Shukla Paksha is universally preferred (waxing Moon = growth).
// However, Krishna Paksha with excellent nakshatra + good lagna IS allowed
// by several traditions and is found in practice.
//
// Rule: Krishna Paksha is permitted when nakshatra is in the "good" list
// AND lagna is favourable (score >= 5). Otherwise, heavy penalty.

// ─── Navamsha Shuddhi ───────────────────────────────────────────────────────
// Muhurta Chintamani: Navamsha Shuddhi is emphasised over Lagna Shuddhi for
// Vivah. The navamsha (D9 division) of the lagna at the muhurta moment should
// fall in an auspicious sign. Each navamsha spans 3°20' (~13.3 minutes of time),
// making this the finest-grained classical timing tool.
//
// Auspicious navamsha signs for Vivah: same as auspicious lagnas.

/**
 * Compute the navamsha rashi of the lagna and return a bonus/penalty.
 * Navamsha = floor((degree_in_sign) / 3.333...) → maps to a rashi.
 * The starting rashi of the navamsha cycle depends on the sign's element:
 *   Fire signs (1,5,9): start from Aries (1)
 *   Earth signs (2,6,10): start from Capricorn (10)
 *   Air signs (3,7,11): start from Libra (7)
 *   Water signs (4,8,12): start from Cancer (4)
 */
export function scoreNavamshaShuddhi(
  jd: number,
  lat: number,
  lng: number,
  activityId: string,
): { navamshaRashi: number; score: number } {
  const tropicalAsc = calculateAscendant(jd, lat, lng);
  const siderealAsc = toSidereal(tropicalAsc, jd);
  const signNum = getRashiNumber(siderealAsc); // 1-12
  const degInSign = siderealAsc % 30;
  const navamshaIdx = Math.floor(degInSign / (30 / 9)); // 0-8

  // Starting rashi based on element
  const ELEMENT_START: Record<number, number> = {
    1: 1, 5: 1, 9: 1,     // Fire → Aries
    2: 10, 6: 10, 10: 10,  // Earth → Capricorn
    3: 7, 7: 7, 11: 7,     // Air → Libra
    4: 4, 8: 4, 12: 4,     // Water → Cancer
  };

  const startRashi = ELEMENT_START[signNum] ?? 1;
  const navamshaRashi = ((startRashi - 1 + navamshaIdx) % 12) + 1;

  // Score the navamsha rashi using the same lagna scoring tables
  const scores = activityId === 'marriage' || activityId === 'engagement'
    ? VIVAH_LAGNA_SCORE
    : GENERIC_LAGNA_SCORE;

  // Navamsha contribution is smaller than lagna (secondary factor)
  const rawScore = scores[navamshaRashi] ?? 0;
  const score = Math.round(rawScore / 2); // Half weight of lagna

  return { navamshaRashi, score };
}

// ─── Krishna Paksha Conditional Logic ───────────────────────────────────────

/**
 * Compute Krishna Paksha penalty based on supporting factors.
 * Returns a score adjustment: 0 (no penalty) to -6 (heavy penalty).
 *
 * Logic:
 * - Krishna + good nakshatra + good lagna → mild penalty (-1)
 * - Krishna + good nakshatra + neutral lagna → moderate penalty (-3)
 * - Krishna + bad nakshatra → heavy penalty (-6, but hard veto may catch first)
 */
export function krishnaPakshaAdjustment(
  isKrishna: boolean,
  nakshatraInGoodList: boolean,
  lagnaScore: number,
): number {
  if (!isKrishna) return 0;  // Shukla — no penalty

  if (nakshatraInGoodList && lagnaScore >= 5) {
    // Classical texts allow this combination
    return -1;
  }
  if (nakshatraInGoodList) {
    // Good nakshatra but lagna is not supporting
    return -3;
  }
  // Bad nakshatra in Krishna Paksha — very unfavourable
  return -6;
}

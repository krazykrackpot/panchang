/**
 * Classical Muhurta Checks — hard vetoes, lagna scoring, and period prohibitions.
 *
 * This module implements the most authoritative muhurta rules — those with strong
 * textual consensus across multiple classical sources. These are primarily used for
 * Vivah (marriage) muhurta, the most complex and rule-heavy samskara, but several
 * checks (Chaturmas, Adhika Masa, Kharmas) apply to all samskaras.
 *
 * CLASSICAL SOURCES:
 *   - Muhurta Chintamani (MC) Ch. 6 — Vivah Prakarana (marriage chapter)
 *   - Dharmasindhu (DS) — Vivaha Prakarana
 *   - B.V. Raman's "Muhurtha" Ch. 12-13
 *   - BPHS (Brihat Parashara Hora Shastra) — combustion orbs, planetary phases
 *   - Prashna Marga Ch. 7 — general muhurta principles
 *
 * CHECKS IN THIS FILE:
 *   1. Venus/Jupiter Combustion (TIER 0 VETO for marriage):
 *      MC + DS explicitly prohibit marriage when Venus or Jupiter is combust.
 *      Venus governs conjugal happiness; Jupiter governs dharma and progeny.
 *      Uses BPHS combustion orbs (10° Venus / 8° if retrograde; 11° Jupiter).
 *
 *   2. Lagna (Ascendant) Scoring (TIER 2 — strong factor):
 *      MC: "A properly chosen lagna removes defects." Gemini, Virgo, Libra
 *      are the MC top picks for marriage. Aries and Scorpio are avoided.
 *
 *   3. Navamsha Shuddhi (TIER 3 — moderate factor):
 *      MC emphasises D9 lagna quality over rashi lagna for marriage.
 *      Each navamsha spans 3°20' — the finest classical timing tool.
 *
 *   4. Adhika Masa (TIER 0 VETO for marriage):
 *      DS explicitly prohibits marriage during the intercalary month.
 *
 *   5. Chaturmas (TIER 0 VETO for marriage):
 *      DS: Harishayana period from Devshayani Ekadashi to Prabodhini Ekadashi.
 *      Uses exact tithi-table dates, not month-level approximation.
 *
 *   6. Prohibited Solar Months / Kharmas (TIER 0 VETO for marriage):
 *      DS + MC: Sun in Dhanu (Sagittarius) or Meena (Pisces) = Kharmas/Malamas.
 *
 *   7. Dakshinayana (TIER 0 VETO for Mundan/first haircut):
 *      MC Chudakarana Prakarana: requires Uttarayana (northern solar course).
 *
 *   8. Shishutva — Infant Venus/Jupiter (TIER 3 — moderate negative):
 *      BPHS describes planetary phases after combustion. First 5 days after
 *      heliacal rising, the planet is still too weak for samskara muhurta.
 *
 *   9. Krishna Paksha Conditional Logic (TIER 4 — weak negative):
 *      No classical text explicitly forbids Krishna Paksha for marriage,
 *      but Shukla is universally preferred. Penalty adjusted by supporting factors.
 *
 * See docs/muhurta-rules.md for full shloka citations and cross-references.
 */

import { getPlanetaryPositions, toSidereal, getRashiNumber, sunLongitude } from '@/lib/ephem/astronomical';
import { computeCombust } from '@/lib/ephem/coordinates';
import { calculateAscendant } from '@/lib/ephem/kundali-calc';
import type { ExtendedActivity } from '@/types/muhurta-ai';
import type { LocaleText } from '@/types/panchang';

// ─── Venus / Jupiter Combustion ─────────────────────────────────────────────
// Muhurta Chintamani + Dharmasindhu: Marriage absolutely forbidden when
// Venus (Shukra) or Jupiter (Guru) is combust.
// Venus governs conjugal happiness; Jupiter governs dharma and progeny.
//
// COMBUSTION ORBS (BPHS standard — coordinates.ts):
//   Venus: 10° (8° if retrograde) | Jupiter: 11°
// Vedic astrology recognises tiered combustion:
//   10° orb = challenging (delays, dissatisfaction, ego clashes)
//   5-6° orb = full combustion (failed relationships, separation risk)
// We use the BPHS 10° standard. Some modern services use narrower orbs
// (~5-6°), which is why they may show dates we block. Our choice is the
// stricter classical reading — this is an explicit design decision.

export interface CombustionResult {
  vetoed: boolean;
  planets: string[];
  details: { planet: string; distance: number; orb: number; severity: 'full' | 'partial' }[];
}

/**
 * Check if Venus or Jupiter is combust at the given JD.
 *
 * COMBUSTION (Asta Graha) occurs when a planet is within a certain angular
 * distance of the Sun along the ecliptic. The planet's light is "burnt"
 * by the Sun's overwhelming brilliance, weakening its significations.
 *
 * BPHS standard combustion orbs (Lesson X — different for retrograde):
 *   Venus:   10° direct, 8° retrograde (reduced orb when retrograde)
 *   Jupiter: 11° (same in both directions)
 *   Mercury: 14° direct, 12° retrograde (not checked here — only relevant for education muhurta)
 *
 * Two severity levels for UI display:
 *   "partial" (6°-10°/11°): challenging but not fatal
 *   "full" (<6°): planet completely overwhelmed — strongest prohibition
 *
 * @param jd - Julian Day at the muhurta moment
 * @returns CombustionResult with vetoed flag, planet names, and angular distances
 */
export function checkVivahCombustion(jd: number): CombustionResult {
  const positions = getPlanetaryPositions(jd);
  const sun = positions.find(p => p.id === 0);
  if (!sun) return { vetoed: false, planets: [], details: [] };

  const combustPlanets: string[] = [];
  const details: CombustionResult['details'] = [];

  // Venus (id=5) — BPHS orb: 10° (8° retrograde)
  const venus = positions.find(p => p.id === 5);
  if (venus) {
    const diff = Math.abs(venus.longitude - sun.longitude);
    const dist = Math.min(diff, 360 - diff);
    const orb = venus.isRetrograde ? 8 : 10;
    if (dist < orb) {
      combustPlanets.push('Venus');
      details.push({ planet: 'Venus', distance: Math.round(dist * 10) / 10, orb, severity: dist < 6 ? 'full' : 'partial' });
    }
  }

  // Jupiter (id=4) — BPHS orb: 11°
  const jupiter = positions.find(p => p.id === 4);
  if (jupiter) {
    const diff = Math.abs(jupiter.longitude - sun.longitude);
    const dist = Math.min(diff, 360 - diff);
    if (dist < 11) {
      combustPlanets.push('Jupiter');
      details.push({ planet: 'Jupiter', distance: Math.round(dist * 10) / 10, orb: 11, severity: dist < 6 ? 'full' : 'partial' });
    }
  }

  return { vetoed: combustPlanets.length > 0, planets: combustPlanets, details };
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
 * Compute the sidereal lagna (ascendant) at a given JD and score it for an activity.
 *
 * MC Ch.6: "Even where other favourable conditions are not present,
 * a properly chosen lagna will remove the defects."
 *
 * For marriage (Vivah):
 *   BEST (score 8): Mithuna (Gemini), Kanya (Virgo), Tula (Libra) — MC top picks
 *   GOOD (score 5-6): Vrishabha (Taurus), Karka (Cancer), Dhanu (Sagittarius), Meena (Pisces)
 *   NEUTRAL (score 1-2): Simha (Leo), Makara (Capricorn), Kumbha (Aquarius)
 *   AVOID (score <0): Mesha (Aries, -2), Vrischika (Scorpio, -3)
 *     Aries and Scorpio are Mars-ruled — too aggressive/destructive for marriage.
 *     Scorpio is additionally the natural 8th sign (death/transformation).
 *
 * For generic activities: scores based on B.V. Raman's general muhurta guidance.
 *
 * @param jd         - Julian Day at the muhurta moment
 * @param lat        - Geographic latitude
 * @param lng        - Geographic longitude
 * @param activityId - Activity identifier (e.g., 'marriage', 'business')
 * @returns LagnaResult with rashi, score, and whether it's an MC top pick
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
 *
 * An Adhika (extra/intercalary) Masa occurs when a lunar month contains
 * no solar sankranti (ingress into a new zodiac sign). This happens
 * approximately once every 2.7 years due to the ~11-day difference
 * between the solar year (365.25 days) and 12 lunar months (354 days).
 *
 * Dharmasindhu explicitly prohibits marriage during Adhika Masa:
 * "अधिकमासे विवाहः न कार्यः" — marriage should not be performed in Adhika Masa.
 *
 * This is a TIER 0 (absolute veto) check — no positive factor can override it.
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
// We use exact Ekadashi dates from the tithi table rather than month-level
// approximation. The previous approach (checking masaIdx) could be off by
// up to 2 weeks at the boundaries.
//
// Reference location for tithi table: Ujjain (23.18°N, 75.79°E) — the
// traditional reference meridian for Indian astronomy. Ekadashi dates vary
// by at most 1 day across locations, which is acceptable for this boundary.

import { buildYearlyTithiTable, lookupTithiByMonthAndNumber } from '@/lib/calendar/tithi-table';

// Cache Chaturmas boundaries per year: { startDate, endDate } as 'YYYY-MM-DD'
const chaturmasBoundaryCache = new Map<number, { start: string; end: string } | null>();

// Ujjain reference coordinates for tithi table
const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

// Fallback: month-level approximation (Amanta masa indices: 0=Chaitra..11=Phalguna)
const CHATURMAS_FULL_MONTHS = [4, 5, 6]; // Shravana, Bhadrapada, Ashwina
const CHATURMAS_PARTIAL_MONTHS = [3, 7]; // Ashadha (latter half), Kartika (first half)

/**
 * Get exact Chaturmas boundary dates for a given year.
 * Devshayani Ekadashi = Ashadha Shukla Ekadashi (tithi 11 in 'ashadha' month)
 * Prabodhini Ekadashi = Kartika Shukla Ekadashi (tithi 11 in 'kartika' month)
 *
 * Returns null if tithi table lookup fails.
 */
function getChaturmasBoundaries(year: number): { start: string; end: string } | null {
  if (chaturmasBoundaryCache.has(year)) {
    return chaturmasBoundaryCache.get(year)!;
  }

  try {
    const table = buildYearlyTithiTable(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);

    // Devshayani Ekadashi: Ashadha Shukla Ekadashi = tithi 11 in Ashadha
    const ashadhaEkadashis = lookupTithiByMonthAndNumber(table, 'ashadha', 11);
    // Filter only non-Adhika month entries
    const devshayani = ashadhaEkadashis.find(e => !e.masa.isAdhika);

    // Prabodhini Ekadashi: Kartika Shukla Ekadashi = tithi 11 in Kartika
    const kartikaEkadashis = lookupTithiByMonthAndNumber(table, 'kartika', 11);
    const prabodhini = kartikaEkadashis.find(e => !e.masa.isAdhika);

    if (!devshayani || !prabodhini) {
      console.warn('[checkChaturmas] Could not find Ekadashi dates in tithi table for year', year);
      chaturmasBoundaryCache.set(year, null);
      return null;
    }

    const boundaries = {
      start: devshayani.sunriseDate, // Chaturmas begins on Devshayani Ekadashi
      end: prabodhini.sunriseDate,   // Chaturmas ends on Prabodhini Ekadashi
    };

    chaturmasBoundaryCache.set(year, boundaries);
    return boundaries;
  } catch (err) {
    console.error('[checkChaturmas] Tithi table build failed for year', year, err);
    chaturmasBoundaryCache.set(year, null);
    return null;
  }
}

/**
 * Check if a date falls within Chaturmas.
 * Uses exact Ekadashi dates from the tithi table when available.
 * Returns 'full' if the date falls between Devshayani and Prabodhini Ekadashi,
 * or null if outside Chaturmas.
 *
 * Falls back to month-level approximation if the tithi table lookup fails.
 */
export function checkChaturmas(year: number, month: number, day: number): 'full' | 'partial' | null {
  const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

  // Try exact Ekadashi boundaries first
  // Chaturmas can span two calendar years (unlikely but handle Dec/Jan edge)
  const boundaries = getChaturmasBoundaries(year) || getChaturmasBoundaries(year - 1);

  if (boundaries) {
    // Date is within Chaturmas if: start <= date <= end
    if (dateStr >= boundaries.start && dateStr <= boundaries.end) {
      return 'full';
    }
    return null;
  }

  // Fallback: month-level approximation with console.warn
  console.warn('[checkChaturmas] Using month-level fallback for', dateStr);
  const masa = getLunarMasaForDate(year, month, day);
  if (!masa) return null;
  if (CHATURMAS_FULL_MONTHS.includes(masa.masaIdx)) return 'full';
  if (CHATURMAS_PARTIAL_MONTHS.includes(masa.masaIdx)) return 'partial';
  return null;
}

// ─── Prohibited Solar Months (Kharmas / Malamas) ────────────────────────────
// Dharmasindhu + Muhurta Chintamani: Marriage prohibited when the Sun
// transits certain signs. The primary prohibition is Kharmas (Sun in
// Pisces / Mina, ~Mar 14 - Apr 14). Drik Panchang also blocks marriage
// during Sun in Karka (Cancer), Simha (Leo), Kanya (Virgo), and
// Dhanu (Sagittarius). These correspond to monsoon + winter periods.
//
// Auspicious solar months for marriage per Dharmasindhu:
//   Mesha (Aries), Vrishabha (Taurus), Mithuna (Gemini),
//   Vrischika (Scorpio), Makara (Capricorn), Kumbha (Aquarius)
// Prohibited: Karka, Simha, Kanya, Tula, Dhanu, Mina

// Sidereal Sun sign → solar month. 1=Mesha..12=Mina
// Strict classical Kharmas: Dhanu (Sagittarius) + Mina (Pisces) only.
// Dharmasindhu specifically names Sun in Dhanu as Kharmas/Malamas.
// Some traditions extend to Mina. Karka/Simha/Kanya overlap with
// Dakshinayana + Chaturmas which are checked separately — adding them
// here would double-count. We follow Dharmasindhu strictly.
const PROHIBITED_SOLAR_SIGNS = new Set([
  9,  // Dhanu (Sagittarius) — ~Dec 16 - Jan 14 (Kharmas proper)
  12, // Mina (Pisces) — ~Mar 14 - Apr 14 (extended Kharmas)
]);

/**
 * Check if the Sun is in a prohibited solar sign for marriage.
 * Uses sidereal Sun longitude at noon.
 */
export function isProhibitedSolarMonth(jd: number): boolean {
  const tropSun = sunLongitude(jd);
  const sidSun = toSidereal(tropSun, jd);
  const solarSign = Math.floor(sidSun / 30) + 1; // 1=Mesha..12=Mina
  return PROHIBITED_SOLAR_SIGNS.has(solarSign);
}

// ─── Dakshinayana Check (for Mundan) ────────────────────────────────────────
// Muhurta Chintamani (Chudakarana Prakarana): Mundan requires Uttarayana
// (Sun's northern course). Permitted solar months: Makara(10), Kumbha(11),
// Mesha(1), Vrishabha(2), Mithuna(3). Meena(12) excluded despite being
// technically in Uttarayana (it's Kharmas).
// Dakshinayana = Karka(4) through Dhanu(9) = ~Jul-Dec — forbidden for mundan.

const UTTARAYANA_SIGNS = new Set([1, 2, 3, 10, 11]); // Mesha..Mithuna + Makara..Kumbha

/**
 * Check if the Sun is in Dakshinayana (southern course).
 * Returns true if Dakshinayana — mundan is forbidden.
 */
export function isDakshinayana(jd: number): boolean {
  const tropSun = sunLongitude(jd);
  const sidSun = toSidereal(tropSun, jd);
  const solarSign = Math.floor(sidSun / 30) + 1;
  return !UTTARAYANA_SIGNS.has(solarSign);
}

// ─── Shishutva (Infant Venus/Jupiter) ───────────────────────────────────────
// After Venus or Jupiter emerges from combustion (heliacal rising), the
// planet passes through phases: Bala (infant), Kumara (youth), Yuva (adult).
// During Bala, beneficent influence is still too weak for samskaras.
//
// Classical texts describe the phases qualitatively but don't specify exact
// durations for muhurta purposes. We use 5 days — conservative enough to
// match the concept without being as aggressive as a 10-day window (which
// has no specific textual backing). This is an area of legitimate
// interpretive variation between practitioners.
//
// TEXTUAL BASIS: Moderate. The concept is real (BPHS describes planetary
// phases after combustion), but the specific muhurta application and
// duration are practitioner-derived, not shloka-specified.

const SHISHUTVA_DAYS = 5;

/**
 * Check if Venus or Jupiter is in Shishutva (infant) phase.
 * Returns true if either planet just emerged from combustion within
 * the last SHISHUTVA_DAYS days.
 */
export function checkShishutva(jd: number): boolean {
  const today = checkVivahCombustion(jd);
  if (today.vetoed) return false; // Still combust — handled by combustion check

  const recent = checkVivahCombustion(jd - SHISHUTVA_DAYS);
  if (recent.vetoed) return true; // Was combust recently — Shishutva active

  return false;
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
 * Compute Navamsha Shuddhi — the D9 quality of the lagna at the muhurta moment.
 *
 * MC Ch.6: Navamsha Shuddhi is emphasised over Lagna Shuddhi for Vivah muhurta.
 * The navamsha (1/9th of a sign = 3°20') of the lagna determines a secondary
 * sign, and the auspiciousness of THAT sign matters for the muhurta.
 *
 * Since each navamsha spans only 3°20' of ecliptic arc, and the ascendant
 * traverses ~1° every 4 minutes, the navamsha changes approximately every
 * 13 minutes — making it the finest-grained classical timing tool available.
 *
 * NAVAMSHA MAPPING (BPHS Ch.6):
 *   The starting rashi of the navamsha cycle depends on the sign's element:
 *     Fire signs (Aries, Leo, Sagittarius): start from Aries (1)
 *     Earth signs (Taurus, Virgo, Capricorn): start from Capricorn (10)
 *     Air signs (Gemini, Libra, Aquarius): start from Libra (7)
 *     Water signs (Cancer, Scorpio, Pisces): start from Cancer (4)
 *
 * Score contribution is half-weight of lagna (secondary factor per MC's hierarchy).
 *
 * @param jd         - Julian Day at the muhurta moment
 * @param lat        - Geographic latitude
 * @param lng        - Geographic longitude
 * @param activityId - Activity identifier
 * @returns navamshaRashi (1-12) and score adjustment
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
 * Compute Krishna Paksha (waning Moon) penalty based on supporting factors.
 *
 * No classical text explicitly FORBIDS Krishna Paksha for marriage — it is
 * Shukla Paksha (waxing Moon) that is universally PREFERRED. The waxing Moon
 * symbolises growth, prosperity, and increasing light, making it the natural
 * choice for auspicious beginnings.
 *
 * However, several traditions and practitioners DO accept Krishna Paksha when
 * compensating factors are strong (excellent nakshatra + strong lagna). This
 * function implements a graduated penalty system:
 *
 *   - Krishna + good nakshatra + good lagna → mild penalty (-1)
 *     Classical texts allow this combination for marriage.
 *
 *   - Krishna + good nakshatra + neutral/weak lagna → moderate penalty (-3)
 *     The nakshatra is fine but lagna isn't supporting — weaker foundation.
 *
 *   - Krishna + bad nakshatra → heavy penalty (-6)
 *     The hard veto from bad nakshatra may catch this first, but the Krishna
 *     Paksha penalty stacks if it doesn't.
 *
 * @param isKrishna           - True if tithi 16-30 (waning Moon)
 * @param nakshatraInGoodList - True if the nakshatra is auspicious for this activity
 * @param lagnaScore          - Lagna score from scoreLagna() (higher = better)
 * @returns Score adjustment: 0 (no penalty) to -6 (heavy penalty)
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

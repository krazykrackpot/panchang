/**
 * Yogini Dasha System — 36-year planetary period cycle
 *
 * Classical reference: Saravali, Mantra Mahodadhi, Dasha Paddhati
 *
 * Key characteristics:
 * - 8 Yogini periods totaling 36 years
 * - Fast-moving cycle (~3 repetitions per lifetime)
 * - Excellent for timing short-term events (job changes, health, travel)
 * - Each Yogini is mapped to a ruling planet
 *
 * Sequence: Mangala(Moon,1) → Pingala(Sun,2) → Dhanya(Jupiter,3) →
 *           Bhramari(Mars,4) → Bhadrika(Mercury,5) → Ulka(Saturn,6) →
 *           Siddha(Venus,7) → Sankata(Rahu,8) = 36 years
 *
 * Nakshatra mapping (0-based):
 *   Ashwini(0), Magha(9), Moola(18)           → Mangala (Moon, 1yr)
 *   Bharani(1), P.Phalguni(10), P.Ashadha(19) → Pingala (Sun, 2yr)
 *   Krittika(2), U.Phalguni(11), U.Ashadha(20)→ Dhanya (Jupiter, 3yr)
 *   Rohini(3), Hasta(12), Shravana(21)        → Bhramari (Mars, 4yr)
 *   Mrigashira(4), Chitra(13), Dhanishta(22)  → Bhadrika (Mercury, 5yr)
 *   Ardra(5), Swati(14), Shatabhisha(23)      → Ulka (Saturn, 6yr)
 *   Punarvasu(6), Vishakha(15), P.Bhadra(24)  → Siddha (Venus, 7yr)
 *   Pushya(7), Anuradha(16), U.Bhadra(25)     → Sankata (Rahu, 8yr)
 *   Ashlesha(8), Jyeshtha(17), Revati(26)     → Mangala (Moon, 1yr) [cycle wraps]
 *
 * Formula: lordIndex = (nakshatraIndex % 9) % 8
 */

import type { DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

export interface YoginiInfo {
  yogini: string;
  yoginiName: LocaleText;
  planet: string;
  planetId: number;
  years: number;
}

export const YOGINI_SEQUENCE: YoginiInfo[] = [
  { yogini: 'Mangala', yoginiName: { en: 'Mangala', hi: 'मंगला', sa: 'मङ्गला' }, planet: 'Moon', planetId: 1, years: 1 },
  { yogini: 'Pingala', yoginiName: { en: 'Pingala', hi: 'पिंगला', sa: 'पिङ्गला' }, planet: 'Sun', planetId: 0, years: 2 },
  { yogini: 'Dhanya', yoginiName: { en: 'Dhanya', hi: 'धान्या', sa: 'धान्या' }, planet: 'Jupiter', planetId: 4, years: 3 },
  { yogini: 'Bhramari', yoginiName: { en: 'Bhramari', hi: 'भ्रामरी', sa: 'भ्रामरी' }, planet: 'Mars', planetId: 2, years: 4 },
  { yogini: 'Bhadrika', yoginiName: { en: 'Bhadrika', hi: 'भद्रिका', sa: 'भद्रिका' }, planet: 'Mercury', planetId: 3, years: 5 },
  { yogini: 'Ulka', yoginiName: { en: 'Ulka', hi: 'उल्का', sa: 'उल्का' }, planet: 'Saturn', planetId: 6, years: 6 },
  { yogini: 'Siddha', yoginiName: { en: 'Siddha', hi: 'सिद्धा', sa: 'सिद्धा' }, planet: 'Venus', planetId: 5, years: 7 },
  { yogini: 'Sankata', yoginiName: { en: 'Sankata', hi: 'संकटा', sa: 'सङ्कटा' }, planet: 'Rahu', planetId: 7, years: 8 },
];

export const TOTAL_YOGINI_YEARS = 36;

/**
 * Planet display names combining planet + yogini name
 * Format: "Planet (Yogini)" in each locale
 */
const PLANET_NAMES: Record<string, LocaleText> = {
  Moon: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  Sun: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  Jupiter: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  Mars: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  Mercury: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  Saturn: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  Venus: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  Rahu: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
};

function buildPlanetName(yogini: YoginiInfo): LocaleText {
  const pn = PLANET_NAMES[yogini.planet];
  return {
    en: `${pn.en} (${yogini.yoginiName.en})`,
    hi: `${pn.hi} (${yogini.yoginiName.hi})`,
    sa: `${pn.sa} (${yogini.yoginiName.sa})`,
  };
}

/**
 * Get starting Yogini lord index from Moon's nakshatra.
 *
 * Nakshatras cycle in groups of 9, mapping to 8 Yoginis:
 *   index 0-7 → Yogini 0-7
 *   index 8   → wraps to Yogini 0 (Mangala)
 *
 * Formula: (nakshatraIndex % 9) % 8
 *
 * @param nakshatraIndex 0-based (0=Ashwini … 26=Revati)
 */
export function getYoginiLordIndex(nakshatraIndex: number): number {
  return (nakshatraIndex % 9) % 8;
}

function addYearsToDate(date: Date, years: number): Date {
  const result = new Date(date.getTime());
  const wholeDays = years * 365.25;
  result.setTime(result.getTime() + wholeDays * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * Calculate Yogini Dasha periods with Antar and Pratyantar sub-periods.
 *
 * @param moonNakshatraIndex - Moon's nakshatra (0-based, 0=Ashwini … 26=Revati)
 * @param moonDegreeInNakshatra - Moon's position within nakshatra (0 to 13.333 degrees)
 * @param birthDate - Date of birth
 */
export function calculateYoginiDashas(
  moonNakshatraIndex: number,
  moonDegreeInNakshatra: number,
  birthDate: Date,
): DashaEntry[] {
  if (moonNakshatraIndex < 0 || moonNakshatraIndex > 26) {
    console.error(`[yogini-dasha] Invalid nakshatra index: ${moonNakshatraIndex}`);
    throw new Error(`[yogini-dasha] moonNakshatraIndex must be 0-26, got ${moonNakshatraIndex}`);
  }
  const nakshatraSpan = 360 / 27; // 13.333... degrees
  if (moonDegreeInNakshatra < 0 || moonDegreeInNakshatra > nakshatraSpan + 0.001) {
    console.error(`[yogini-dasha] Invalid degree in nakshatra: ${moonDegreeInNakshatra}`);
    throw new Error(`[yogini-dasha] moonDegreeInNakshatra must be 0-${nakshatraSpan.toFixed(3)}, got ${moonDegreeInNakshatra}`);
  }
  const fractionElapsed = moonDegreeInNakshatra / nakshatraSpan;

  // Starting dasha lord from Moon's nakshatra
  const startLordIndex = getYoginiLordIndex(moonNakshatraIndex);
  const startLord = YOGINI_SEQUENCE[startLordIndex];

  // Remaining period of the first (partial) dasha
  const remainingYears = startLord.years * (1 - fractionElapsed);

  const dashas: DashaEntry[] = [];
  let currentDate = new Date(birthDate.getTime());

  for (let i = 0; i < 8; i++) {
    const lordIndex = (startLordIndex + i) % 8;
    const lord = YOGINI_SEQUENCE[lordIndex];
    const years = i === 0 ? remainingYears : lord.years;
    const endDate = addYearsToDate(currentDate, years);

    // Calculate Antardasha sub-periods
    const subPeriods = calculateAntarDasha(lordIndex, currentDate, years);

    dashas.push({
      planet: lord.planet,
      planetName: buildPlanetName(lord),
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'maha',
      subPeriods,
    });

    currentDate = new Date(endDate.getTime());
  }

  return dashas;
}

/**
 * Calculate Antardasha (sub-periods) for a given Mahadasha.
 * Duration formula: antarLord.years / TOTAL_YOGINI_YEARS * mahaDuration
 */
function calculateAntarDasha(
  mahaLordIndex: number,
  startDate: Date,
  totalYears: number,
): DashaEntry[] {
  const subPeriods: DashaEntry[] = [];
  let currentDate = new Date(startDate.getTime());

  for (let i = 0; i < 8; i++) {
    const antarLordIndex = (mahaLordIndex + i) % 8;
    const antarLord = YOGINI_SEQUENCE[antarLordIndex];

    const scaledYears = (antarLord.years * totalYears) / TOTAL_YOGINI_YEARS;
    const endDate = addYearsToDate(currentDate, scaledYears);

    // Calculate Pratyantardasha sub-sub-periods
    const pratyantarPeriods = calculatePratyantarDasha(antarLordIndex, currentDate, scaledYears);

    subPeriods.push({
      planet: antarLord.planet,
      planetName: buildPlanetName(antarLord),
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'antar',
      subPeriods: pratyantarPeriods,
    });

    currentDate = new Date(endDate.getTime());
  }

  return subPeriods;
}

/**
 * Calculate Pratyantardasha (sub-sub-periods)
 */
function calculatePratyantarDasha(
  antarLordIndex: number,
  startDate: Date,
  totalYears: number,
): DashaEntry[] {
  const subPeriods: DashaEntry[] = [];
  let currentDate = new Date(startDate.getTime());

  for (let i = 0; i < 8; i++) {
    const pratyantarLordIndex = (antarLordIndex + i) % 8;
    const pratyantarLord = YOGINI_SEQUENCE[pratyantarLordIndex];

    const scaledYears = (pratyantarLord.years * totalYears) / TOTAL_YOGINI_YEARS;
    const endDate = addYearsToDate(currentDate, scaledYears);

    subPeriods.push({
      planet: pratyantarLord.planet,
      planetName: buildPlanetName(pratyantarLord),
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'pratyantar',
    });

    currentDate = new Date(endDate.getTime());
  }

  return subPeriods;
}

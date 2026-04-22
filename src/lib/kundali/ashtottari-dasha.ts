/**
 * Ashtottari Dasha System — 108-year planetary period cycle
 *
 * Classical reference: BPHS (Brihat Parashara Hora Shastra) Ch. 20
 *
 * Key differences from Vimshottari (120yr):
 * - Uses 8 planets (excludes Ketu)
 * - Total cycle = 108 years
 * - Different nakshatra-to-lord mapping (groups of 3 nakshatras)
 * - Classically prescribed for Krishna Paksha (waning Moon) births
 *
 * Sequence: Sun(6) → Moon(15) → Mars(8) → Mercury(17) → Saturn(10)
 *           → Jupiter(19) → Venus(21) → Rahu(12) = 108 years
 * Reference: BPHS Ch.20 — mainstream reading excludes Ketu, not Rahu
 */

import type { DashaEntry } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';

export const ASHTOTTARI_SEQUENCE: { planet: string; years: number }[] = [
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 15 },
  { planet: 'Mars', years: 8 },
  { planet: 'Mercury', years: 17 },
  { planet: 'Saturn', years: 10 },
  { planet: 'Jupiter', years: 19 },
  { planet: 'Venus', years: 21 },
  { planet: 'Rahu', years: 12 },
];

export const TOTAL_ASHTOTTARI_YEARS = 108;

/**
 * Classical nakshatra-to-starting-lord mapping (BPHS).
 *
 * Starting from Ardra (0-based index 5), nakshatras are grouped in threes,
 * cycling through the 8 Ashtottari lords. The remaining 3 nakshatras
 * (Krittika=2, Rohini=3, Mrigashira=4) wrap to Sun (cycle repeats).
 *
 *   Ardra(5), Punarvasu(6), Pushya(7)               → Sun(0)
 *   Ashlesha(8), Magha(9), P.Phalguni(10)            → Moon(1)
 *   U.Phalguni(11), Hasta(12), Chitra(13)            → Mars(2)
 *   Swati(14), Vishakha(15), Anuradha(16)            → Mercury(3)
 *   Jyeshtha(17), Mula(18), P.Ashadha(19)            → Saturn(4)
 *   U.Ashadha(20), Shravana(21), Dhanishta(22)       → Jupiter(5)
 *   Shatabhisha(23), P.Bhadrapada(24), U.Bhadra(25)  → Venus(6)
 *   Revati(26), Ashwini(0), Bharani(1)               → Rahu(7)
 *   Krittika(2), Rohini(3), Mrigashira(4)            → Sun(0) [wrap]
 *
 * Array index = nakshatra index (0-based: 0=Ashwini … 26=Revati)
 * Value = index into ASHTOTTARI_SEQUENCE (0=Sun … 7=Rahu)
 */
function buildNakshatraToLordIndex(): number[] {
  const map = new Array<number>(27).fill(0);
  const startNakshatra = 5; // Ardra
  // 8 lords x 3 nakshatras = 24 nakshatras covered
  for (let lordIdx = 0; lordIdx < 8; lordIdx++) {
    for (let offset = 0; offset < 3; offset++) {
      const nakIdx = (startNakshatra + lordIdx * 3 + offset) % 27;
      map[nakIdx] = lordIdx;
    }
  }
  // Remaining 3: Krittika(2), Rohini(3), Mrigashira(4) → Sun(0)
  map[2] = 0;
  map[3] = 0;
  map[4] = 0;
  return map;
}

export const NAKSHATRA_TO_LORD_INDEX: number[] = buildNakshatraToLordIndex();

const PLANET_NAME_MAP: Record<string, LocaleText> = {
  Sun: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  Moon: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  Mars: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  Mercury: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  Jupiter: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  Venus: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  Saturn: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  Rahu: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
};

function addYearsToDate(date: Date, years: number): Date {
  const result = new Date(date.getTime());
  const wholeDays = years * 365.25;
  result.setTime(result.getTime() + wholeDays * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * Calculate Ashtottari Dasha periods with Antar and Pratyantar sub-periods
 *
 * @param moonNakshatraIndex - Moon's nakshatra (0-based, 0=Ashwini … 26=Revati)
 * @param moonDegreeInNakshatra - Moon's position within nakshatra (0 to 13.333 degrees)
 * @param birthDate - Date of birth
 */
export function calculateAshtottariDashas(
  moonNakshatraIndex: number,
  moonDegreeInNakshatra: number,
  birthDate: Date,
): DashaEntry[] {
  const nakshatraSpan = 360 / 27; // 13.333... degrees
  const fractionElapsed = moonDegreeInNakshatra / nakshatraSpan;

  // Starting dasha lord from Moon's nakshatra
  const startLordIndex = NAKSHATRA_TO_LORD_INDEX[moonNakshatraIndex];
  const startLord = ASHTOTTARI_SEQUENCE[startLordIndex];

  // Remaining period of the first (partial) dasha
  const remainingYears = startLord.years * (1 - fractionElapsed);

  const dashas: DashaEntry[] = [];
  let currentDate = new Date(birthDate.getTime());

  for (let i = 0; i < 8; i++) {
    const lordIndex = (startLordIndex + i) % 8;
    const lord = ASHTOTTARI_SEQUENCE[lordIndex];
    const years = i === 0 ? remainingYears : lord.years;
    const endDate = addYearsToDate(currentDate, years);

    // Calculate Antardasha sub-periods
    const subPeriods = calculateAntarDasha(lordIndex, currentDate, years);

    dashas.push({
      planet: lord.planet,
      planetName: PLANET_NAME_MAP[lord.planet],
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
 * Duration formula (same proportional logic as Vimshottari):
 *   antarDuration = (antarLord.years / TOTAL_YEARS) * mahaDuration
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
    const antarLord = ASHTOTTARI_SEQUENCE[antarLordIndex];

    // Proportional subdivision: antarYears / 108 * mahaDuration
    const scaledYears = (antarLord.years * totalYears) / TOTAL_ASHTOTTARI_YEARS;
    const endDate = addYearsToDate(currentDate, scaledYears);

    // Calculate Pratyantardasha sub-sub-periods
    const pratyantarPeriods = calculatePratyantarDasha(antarLordIndex, currentDate, scaledYears);

    subPeriods.push({
      planet: antarLord.planet,
      planetName: PLANET_NAME_MAP[antarLord.planet],
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
    const pratyantarLord = ASHTOTTARI_SEQUENCE[pratyantarLordIndex];

    const scaledYears = (pratyantarLord.years * totalYears) / TOTAL_ASHTOTTARI_YEARS;
    const endDate = addYearsToDate(currentDate, scaledYears);

    subPeriods.push({
      planet: pratyantarLord.planet,
      planetName: PLANET_NAME_MAP[pratyantarLord.planet],
      startDate: currentDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      level: 'pratyantar',
    });

    currentDate = new Date(endDate.getTime());
  }

  return subPeriods;
}

/**
 * Check if Ashtottari Dasha is classically applicable.
 *
 * Classical rule from Parashara: Ashtottari is prescribed when the Moon
 * is in Krishna Paksha (waning phase) at birth.
 *
 * Krishna Paksha = Sun-Moon angular distance > 180° (i.e., Moon has traveled
 * past Full Moon and is heading toward New Moon).
 *
 * @param sunLongitude - Sidereal Sun longitude (0-360)
 * @param moonLongitude - Sidereal Moon longitude (0-360)
 * @returns true if Moon is in Krishna Paksha (waning)
 */
export function isAshtottariApplicable(sunLongitude: number, moonLongitude: number): boolean {
  // Angular distance Moon - Sun (normalized to 0-360)
  const diff = ((moonLongitude - sunLongitude) % 360 + 360) % 360;
  // Krishna Paksha: Moon has traveled > 180° ahead of Sun
  return diff > 180;
}

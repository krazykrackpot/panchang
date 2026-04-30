/**
 * Vimshottari Dasha calculation
 * The 120-year planetary period system based on Moon's nakshatra at birth
 */

import type { DashaPeriod } from './types';

// Dasha lords in order, with their period in years
const DASHA_SEQUENCE: Array<{ planet: string; years: number }> = [
  { planet: 'Ketu', years: 7 },
  { planet: 'Venus', years: 20 },
  { planet: 'Sun', years: 6 },
  { planet: 'Moon', years: 10 },
  { planet: 'Mars', years: 7 },
  { planet: 'Rahu', years: 18 },
  { planet: 'Jupiter', years: 16 },
  { planet: 'Saturn', years: 19 },
  { planet: 'Mercury', years: 17 },
];

// Each nakshatra's ruling planet maps to a dasha lord
// Nakshatras cycle through dasha lords: Ashwini=Ketu, Bharani=Venus, etc.
const NAKSHATRA_DASHA_LORD: number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Ashwini-Ashlesha (Ketu through Mercury)
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Magha-Jyeshtha
  0, 1, 2, 3, 4, 5, 6, 7, 8, // Moola-Revati
];

const TOTAL_DASHA_YEARS = 120;

function addYearsToDate(date: Date, years: number): Date {
  const result = new Date(date.getTime());
  const wholeDays = years * 365.25;
  result.setTime(result.getTime() + wholeDays * 24 * 60 * 60 * 1000);
  return result;
}

/**
 * Calculate Vimshottari Dasha periods
 * @param moonNakshatraIndex - Moon's nakshatra (0-26)
 * @param moonDegreeInNakshatra - Moon's position within nakshatra (degrees, 0 to 13.333)
 * @param birthDate - Date of birth
 */
export function calculateDashas(
  moonNakshatraIndex: number,
  moonDegreeInNakshatra: number,
  birthDate: Date
): DashaPeriod[] {
  const nakshatraSpan = 360 / 27; // 13.333... degrees
  const fractionElapsed = moonDegreeInNakshatra / nakshatraSpan;

  // Starting dasha lord
  const startLordIndex = NAKSHATRA_DASHA_LORD[moonNakshatraIndex];
  const startLord = DASHA_SEQUENCE[startLordIndex];

  // Remaining period of the first dasha
  const remainingYears = startLord.years * (1 - fractionElapsed);

  const dashas: DashaPeriod[] = [];
  let currentDate = new Date(birthDate.getTime());

  // First (partial) dasha
  const firstEndDate = addYearsToDate(currentDate, remainingYears);
  dashas.push({
    planet: startLord.planet,
    startDate: new Date(currentDate.getTime()),
    endDate: firstEndDate,
    years: remainingYears,
    subPeriods: calculateAntarDasha(startLordIndex, currentDate, remainingYears),
  });
  currentDate = firstEndDate;

  // Subsequent full dashas
  for (let i = 1; i < 9; i++) {
    const lordIndex = (startLordIndex + i) % 9;
    const lord = DASHA_SEQUENCE[lordIndex];
    const endDate = addYearsToDate(currentDate, lord.years);

    dashas.push({
      planet: lord.planet,
      startDate: new Date(currentDate.getTime()),
      endDate,
      years: lord.years,
      subPeriods: calculateAntarDasha(lordIndex, currentDate, lord.years),
    });
    currentDate = endDate;
  }

  return dashas;
}

/**
 * Level names for reference:
 *   1 = Mahadasha, 2 = Antardasha, 3 = Pratyantardasha,
 *   4 = Sookshma Dasha, 5 = Prana Dasha
 *
 * The algorithm is identical at every level: subdivide the parent period
 * proportionally by the 9-planet Vimshottari year ratios, starting from
 * the parent's lord. Recursion depth is capped at level 5.
 */
const MAX_DASHA_DEPTH = 5;

function calculateSubPeriods(parentLordIndex: number, startDate: Date, totalYears: number, depth: number): DashaPeriod[] {
  if (depth > MAX_DASHA_DEPTH) return [];

  const subPeriods: DashaPeriod[] = [];
  let currentDate = new Date(startDate.getTime());

  for (let i = 0; i < 9; i++) {
    const lordIndex = (parentLordIndex + i) % 9;
    const lord = DASHA_SEQUENCE[lordIndex];
    const scaledYears = (lord.years * totalYears) / TOTAL_DASHA_YEARS;
    const endDate = addYearsToDate(currentDate, scaledYears);

    // Only recurse to deeper levels for Pratyantardasha and below when periods
    // are long enough to be meaningful (> 1 day = ~0.00274 years)
    const children = (depth < MAX_DASHA_DEPTH && scaledYears > 0.003)
      ? calculateSubPeriods(lordIndex, currentDate, scaledYears, depth + 1)
      : undefined;

    subPeriods.push({
      planet: lord.planet,
      startDate: new Date(currentDate.getTime()),
      endDate,
      years: scaledYears,
      ...(children?.length ? { subPeriods: children } : {}),
    });
    currentDate = endDate;
  }

  return subPeriods;
}

// Backward-compatible wrapper
function calculateAntarDasha(mahaLordIndex: number, startDate: Date, totalYears: number): DashaPeriod[] {
  return calculateSubPeriods(mahaLordIndex, startDate, totalYears, 2);
}

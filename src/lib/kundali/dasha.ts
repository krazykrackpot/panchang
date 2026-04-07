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

function calculateAntarDasha(mahaLordIndex: number, startDate: Date, totalYears: number): DashaPeriod[] {
  const subPeriods: DashaPeriod[] = [];
  let currentDate = new Date(startDate.getTime());

  for (let i = 0; i < 9; i++) {
    const antarLordIndex = (mahaLordIndex + i) % 9;
    const antarLord = DASHA_SEQUENCE[antarLordIndex];
    const mahaLord = DASHA_SEQUENCE[mahaLordIndex];

    // Antar dasha duration (BPHS): (antarLord.years / TOTAL_DASHA_YEARS) × totalYears
    // Equivalent to the 2-step form: (mahaYears × antarYears / 120) / mahaYears × totalYears
    const scaledYears = (antarLord.years * totalYears) / TOTAL_DASHA_YEARS;

    const endDate = addYearsToDate(currentDate, scaledYears);

    subPeriods.push({
      planet: antarLord.planet,
      startDate: new Date(currentDate.getTime()),
      endDate,
      years: scaledYears,
    });
    currentDate = endDate;
  }

  return subPeriods;
}

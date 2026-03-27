/**
 * Mudda Dasha — Vimshottari Dasha compressed to one solar year (365.25 days)
 * Used in Varshaphal annual chart predictions
 */

import type { MuddaDashaPeriod } from '@/types/varshaphal';
import type { Trilingual } from '@/types/panchang';

const TOTAL_YEARS = 120;
const YEAR_DAYS = 365.25;

// Vimshottari years for each planet
const DASHA_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const DASHA_ORDER = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];

// Compressed to 365.25 days
const MUDDA_DAYS: Record<string, number> = {
  Ketu: (7 / TOTAL_YEARS) * YEAR_DAYS,       // ~21.29 days
  Venus: (20 / TOTAL_YEARS) * YEAR_DAYS,     // ~60.88 days
  Sun: (6 / TOTAL_YEARS) * YEAR_DAYS,        // ~18.26 days
  Moon: (10 / TOTAL_YEARS) * YEAR_DAYS,      // ~30.44 days
  Mars: (7 / TOTAL_YEARS) * YEAR_DAYS,       // ~21.29 days
  Rahu: (18 / TOTAL_YEARS) * YEAR_DAYS,      // ~54.79 days
  Jupiter: (16 / TOTAL_YEARS) * YEAR_DAYS,   // ~48.70 days
  Saturn: (19 / TOTAL_YEARS) * YEAR_DAYS,    // ~57.83 days
  Mercury: (17 / TOTAL_YEARS) * YEAR_DAYS,   // ~51.76 days
};

const PLANET_NAMES: Record<string, Trilingual> = {
  Sun: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  Moon: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
  Mars: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
  Mercury: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
  Jupiter: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
  Venus: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
  Saturn: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
  Rahu: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
  Ketu: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
};

// Nakshatra lords (1-27 mapped to dasha sequence)
const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

export function calculateMuddaDasha(
  moonNakshatra: number,
  moonDegInNakshatra: number,
  solarReturnDate: Date,
): MuddaDashaPeriod[] {
  const nakshatraSpan = 360 / 27; // 13.333...
  const fractionCompleted = moonDegInNakshatra / nakshatraSpan;

  // Starting lord is the nakshatra lord
  const lord = NAKSHATRA_LORDS[(moonNakshatra - 1) % 27];
  const lordIndex = DASHA_ORDER.indexOf(lord);

  const periods: MuddaDashaPeriod[] = [];
  let currentDate = new Date(solarReturnDate);

  for (let i = 0; i < 9; i++) {
    const idx = (lordIndex + i) % 9;
    const planet = DASHA_ORDER[idx];
    let days = MUDDA_DAYS[planet];

    // First period: only remaining portion
    if (i === 0) {
      days = days * (1 - fractionCompleted);
    }

    const endDate = new Date(currentDate);
    endDate.setTime(endDate.getTime() + days * 24 * 60 * 60 * 1000);

    periods.push({
      planet,
      planetName: PLANET_NAMES[planet],
      startDate: formatDate(currentDate),
      endDate: formatDate(endDate),
      durationDays: Math.round(days),
    });

    currentDate = new Date(endDate);
  }

  return periods;
}

function formatDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

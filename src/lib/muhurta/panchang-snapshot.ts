/**
 * Panchang Snapshot  –  computes the 5 panchanga elements + Moon position
 * for a given Julian Day and location.
 *
 * Used by the muhurta engine's context-builder to evaluate each time window.
 * Extracted from ai-recommender.ts to remove dependency on dead scoring code.
 *
 * Ayanamsha: always Lahiri (Hindu calendar standard for muhurta).
 * User-chosen ayanamsha applies to kundali, NOT to muhurta/calendar.
 */

import {
  calculateTithi, calculateYoga, calculateKarana,
  moonLongitude, toSidereal,
  getNakshatraNumber, getRashiNumber,
} from '@/lib/ephem/astronomical';

export interface PanchangSnapshot {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;     // 0=Sunday per Math.floor(jd + 1.5) % 7
  moonSign: number;    // 1-12 rashi
  moonSid: number;     // Moon's sidereal longitude (degrees)  –  needed for Varjyam + Gandanta checks
}

/**
 * Compute panchanga snapshot at a given Julian Day.
 * All calculations use Lahiri ayanamsha (muhurta standard).
 */
export function getPanchangSnapshot(jd: number, _lat: number, _lng: number): PanchangSnapshot {
  const tithiResult = calculateTithi(jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);
  const nakshatra = getNakshatraNumber(moonSid);
  const yoga = calculateYoga(jd);
  const karana = calculateKarana(jd);
  const moonSign = getRashiNumber(moonSid);

  // Weekday from JD  –  Math.floor(jd + 1.5) % 7 gives 0=Sunday,
  // matching Date.getUTCDay() and all hora/choghadiya/Rahu Kaal lookup tables.
  const weekday = Math.floor(jd + 1.5) % 7; // 0=Sunday

  return { tithi: tithiResult.number, nakshatra, yoga, karana, weekday, moonSign, moonSid };
}

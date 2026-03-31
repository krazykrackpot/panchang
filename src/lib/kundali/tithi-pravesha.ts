/**
 * Tithi Pravesha — Annual chart from Tithi birthday
 * The exact moment when the Sun returns to the same tithi as at birth.
 * PVR Narasimha Rao's signature technique for annual predictions.
 * Reference: Vedic Astrology: An Integrated Approach (PVR)
 */

import { dateToJD, calculateTithi, sunLongitude, moonLongitude, approximateSunrise } from '@/lib/ephem/astronomical';

export interface TithiPraveshaResult {
  year: number;
  birthTithi: number;
  birthPaksha: 'shukla' | 'krishna';
  praveshaDate: string;     // ISO date of tithi pravesha
  praveshaTime: string;     // approximate time HH:MM
  sunLongitude: number;     // Sun's sidereal longitude at pravesha
  moonLongitude: number;    // Moon's sidereal longitude at pravesha
}

/**
 * Find the Tithi Pravesha date for a given year
 * Scans the year to find when Sun's longitude matches birth tithi
 */
export function calculateTithiPravesha(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  targetYear: number,
  lat: number,
  lng: number,
  tzOffset: number,
): TithiPraveshaResult | null {
  // Get birth tithi
  const birthJD = dateToJD(birthYear, birthMonth, birthDay, 12 - tzOffset);
  const birthSunrise = approximateSunrise(birthJD, lat, lng);
  const birthJDSunrise = dateToJD(birthYear, birthMonth, birthDay, birthSunrise);
  const birthTithi = calculateTithi(birthJDSunrise);
  const birthTithiNum = birthTithi.number;
  const birthPaksha = birthTithiNum <= 15 ? 'shukla' as const : 'krishna' as const;

  // Get birth Sun longitude (sidereal)
  const birthSunLong = sunLongitude(birthJDSunrise);

  // Scan the target year: find when Sun returns to same longitude AND tithi matches
  // Sun returns to same longitude ~365.25 days later
  const approxReturnJD = dateToJD(targetYear, birthMonth, birthDay, 12 - tzOffset);

  // Search window: ±30 days around expected return
  for (let dayOffset = -30; dayOffset <= 30; dayOffset++) {
    const scanJD = approxReturnJD + dayOffset;
    const scanTithi = calculateTithi(scanJD);

    if (scanTithi.number === birthTithiNum) {
      // Found! Refine to find the exact moment tithi starts
      // Binary search within this day
      let lo = scanJD - 0.5;
      let hi = scanJD + 0.5;
      for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        const midTithi = calculateTithi(mid);
        if (midTithi.number === birthTithiNum) {
          hi = mid;
        } else {
          lo = mid;
        }
      }

      const praveshaJD = hi;
      // Convert JD to date
      const d = new Date((praveshaJD - 2440587.5) * 86400000);
      const dateStr = `${d.getUTCFullYear()}-${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-${d.getUTCDate().toString().padStart(2, '0')}`;

      // Local time
      const utHours = (praveshaJD % 1) * 24;
      const localHours = ((utHours + tzOffset) + 24) % 24;
      const timeStr = `${Math.floor(localHours).toString().padStart(2, '0')}:${Math.floor((localHours % 1) * 60).toString().padStart(2, '0')}`;

      return {
        year: targetYear,
        birthTithi: birthTithiNum,
        birthPaksha,
        praveshaDate: dateStr,
        praveshaTime: timeStr,
        sunLongitude: sunLongitude(praveshaJD),
        moonLongitude: moonLongitude(praveshaJD),
      };
    }
  }

  return null;
}

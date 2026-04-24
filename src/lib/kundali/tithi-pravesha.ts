/**
 * Tithi Pravesha — Annual chart from Tithi birthday
 * The exact moment when the Sun returns to the same tithi as at birth.
 * PVR Narasimha Rao's signature technique for annual predictions.
 * Reference: Vedic Astrology: An Integrated Approach (PVR)
 */

import { dateToJD, calculateTithi, sunLongitude, moonLongitude, toSidereal, approximateSunriseSafe } from '@/lib/ephem/astronomical';

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
 * Find the Tithi Pravesha date for a given year.
 * Scans a ±30 day window around the expected birthday, collects ALL
 * occurrences of the birth tithi, and picks the one whose Sun is
 * closest to the natal Sun longitude (= correct lunar month).
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
  const birthSunrise = approximateSunriseSafe(birthJD, lat, lng);
  const birthJDSunrise = dateToJD(birthYear, birthMonth, birthDay, birthSunrise);
  const birthTithi = calculateTithi(birthJDSunrise);
  const birthTithiNum = birthTithi.number;
  const birthPaksha = birthTithiNum <= 15 ? 'shukla' as const : 'krishna' as const;

  // Birth Sun sidereal longitude — used to pick the correct lunar month
  const birthSunSid = toSidereal(sunLongitude(birthJDSunrise), birthJDSunrise);

  // Scan the target year: collect ALL occurrences of the birth tithi
  const approxReturnJD = dateToJD(targetYear, birthMonth, birthDay, 12 - tzOffset);
  const candidates: { jd: number; sunDist: number }[] = [];

  for (let dayOffset = -30; dayOffset <= 30; dayOffset++) {
    const scanJD = approxReturnJD + dayOffset;
    const scanTithi = calculateTithi(scanJD);

    if (scanTithi.number === birthTithiNum) {
      // Binary search for exact tithi start (first moment tithi number matches)
      let lo = scanJD - 0.5;
      let hi = scanJD + 0.5;
      for (let iter = 0; iter < 20; iter++) {
        const mid = (lo + hi) / 2;
        if (calculateTithi(mid).number === birthTithiNum) hi = mid; else lo = mid;
      }

      // Refine: binary search for exact elongation degree (start of this tithi)
      // The tithi start boundary is at (tithiNum - 1) * 12 degrees of Moon-Sun elongation.
      // Without this refinement the result can be off by ~12 hours.
      const targetDeg = (birthTithiNum - 1) * 12;
      let loRefine = hi - 0.5;
      let hiRefine = hi + 0.5;
      for (let iter = 0; iter < 25; iter++) {
        const mid = (loRefine + hiRefine) / 2;
        const { degree } = calculateTithi(mid);
        // Normalize degree distance handling 360→0 wraparound
        let delta = degree - targetDeg;
        if (delta > 180) delta -= 360;
        if (delta < -180) delta += 360;
        if (Math.abs(delta) < 0.001) break;
        if (delta < 0) loRefine = mid; else hiRefine = mid;
      }
      const praveshaJD = (loRefine + hiRefine) / 2;

      // Sidereal Sun distance from natal position — closer = correct month
      const scanSunSid = toSidereal(sunLongitude(praveshaJD), praveshaJD);
      let sunDist = Math.abs(scanSunSid - birthSunSid);
      if (sunDist > 180) sunDist = 360 - sunDist;

      candidates.push({ jd: praveshaJD, sunDist });

      // Skip ahead past this tithi occurrence (~2 days to avoid re-matching same one)
      dayOffset += 2;
    }
  }

  if (candidates.length === 0) return null;

  // Pick the candidate whose Sun is closest to the natal Sun longitude
  candidates.sort((a, b) => a.sunDist - b.sunDist);
  const best = candidates[0];
  const praveshaJD = best.jd;

  // Convert JD to date (UTC-based to avoid server timezone dependency)
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
    // Return SIDEREAL longitudes (this is a Vedic technique)
    sunLongitude: toSidereal(sunLongitude(praveshaJD), praveshaJD),
    moonLongitude: toSidereal(moonLongitude(praveshaJD), praveshaJD),
  };
}

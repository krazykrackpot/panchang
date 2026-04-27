/**
 * Solar Return Calculator
 * Finds the exact Julian Day when the Sun returns to its natal sidereal longitude
 */

import { dateToJD, sunLongitude, toSidereal, normalizeDeg } from '@/lib/ephem/astronomical';

export interface SolarReturnResult {
  jd: number;
  date: Date;
}

/**
 * Find when the Sun returns to its natal sidereal longitude in a given year
 * Uses day-by-day scan + binary search refinement
 */
export function findSolarReturn(
  natalSunSidereal: number,
  year: number,
  birthLat: number,
  birthLng: number,
  birthTz: number,
): SolarReturnResult {
  // Scan the entire year day by day
  const startJD = dateToJD(year, 1, 1, 12 - birthTz);
  const endJD = dateToJD(year + 1, 1, 1, 12 - birthTz);

  let prevDiff = 999;
  let bestJD = startJD;

  // Day-by-day scan to find approximate crossing
  for (let jd = startJD; jd < endJD; jd += 1) {
    const sunSid = toSidereal(sunLongitude(jd), jd);
    const diff = angleDiff(sunSid, natalSunSidereal);

    if (Math.abs(diff) < Math.abs(prevDiff)) {
      bestJD = jd;
      prevDiff = diff;
    }

    // Check if we crossed the target between yesterday and today
    const prevSunSid = toSidereal(sunLongitude(jd - 1), jd - 1);
    const prevD = angleDiff(prevSunSid, natalSunSidereal);
    const currD = angleDiff(sunSid, natalSunSidereal);

    if (prevD * currD < 0 && Math.abs(prevD) < 10 && Math.abs(currD) < 10) {
      // Crossed! Binary search between jd-1 and jd
      bestJD = binarySearchSolarReturn(jd - 1, jd, natalSunSidereal);
      break;
    }
  }

  // Fine-tune with binary search around best JD
  if (Math.abs(prevDiff) > 0.01) {
    bestJD = binarySearchSolarReturn(bestJD - 1, bestJD + 1, natalSunSidereal);
  }

  return {
    jd: bestJD,
    date: jdToDateObj(bestJD, birthTz),
  };
}

function binarySearchSolarReturn(jdLow: number, jdHigh: number, targetSidLong: number): number {
  for (let i = 0; i < 50; i++) {
    const mid = (jdLow + jdHigh) / 2;
    const sunSid = toSidereal(sunLongitude(mid), mid);
    const diff = angleDiff(sunSid, targetSidLong);

    if (Math.abs(diff) < 0.001) return mid; // Sub-minute precision

    // Determine direction: Sun moves ~1°/day eastward
    if (diff > 0) {
      jdHigh = mid;
    } else {
      jdLow = mid;
    }
  }
  return (jdLow + jdHigh) / 2;
}

/** Signed angular difference, returns value in [-180, 180] */
function angleDiff(a: number, b: number): number {
  let d = normalizeDeg(a - b);
  if (d > 180) d -= 360;
  return d;
}

function jdToDateObj(jd: number, tzOffset: number): Date {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a = z;
  if (z >= 2299161) {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const dayFrac = b - d - Math.floor(30.6001 * e) + f;
  const day = Math.floor(dayFrac);
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const hourFrac = (dayFrac - day) * 24 + tzOffset;
  const hour = Math.floor(hourFrac);
  const min = Math.floor((hourFrac - hour) * 60);

  // Lesson L: use Date.UTC — the JD→Gregorian conversion gives UT components.
  // Local-time constructor would shift by server timezone offset on Vercel (UTC) vs dev.
  return new Date(Date.UTC(year, month - 1, day, hour, min));
}

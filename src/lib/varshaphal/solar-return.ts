/**
 * Solar Return Calculator
 * Finds the exact Julian Day when the Sun returns to its natal sidereal longitude
 */

import { dateToJD, sunLongitude, toSidereal, normalizeDeg } from '@/lib/ephem/astronomical';

/**
 * Round 3 R3-TZ-1 — `SolarReturnResult.date` was a sentinel Date whose
 * UTC components held the BIRTH-LOCATION wall-clock (so consumers using
 * `.getUTCFullYear/Month/Date/Hours/Minutes/Day` got the local wall-clock
 * back). The contract was non-obvious — any consumer calling `.getTime()`
 * would silently get a `tzOffset`-shifted ms, and hour-overflow near year
 * boundaries with large tzOffsets (e.g. Pacific/Kiritimati +14) relied on
 * Date.UTC auto-normalisation.
 *
 * The new shape exposes the structured wall-clock components directly so
 * the contract is explicit. `date` is retained for backward compatibility
 * (consumers already migrated to UTC accessors continue to work) but new
 * code should prefer the explicit fields.
 */
export interface SolarReturnResult {
  jd: number;
  /** Birth-location wall-clock year (Gregorian). */
  year: number;
  /** Birth-location wall-clock month (1-12). */
  month: number;
  /** Birth-location wall-clock day-of-month (1-31). */
  day: number;
  /** Birth-location wall-clock hour (0-23). */
  hour: number;
  /** Birth-location wall-clock minute (0-59). */
  minute: number;
  /** Day of week (0=Sun..6=Sat) at the solar-return UT instant, per BPHS
   *  Lesson O JD-weekday convention. */
  weekday: number;
  /**
   * @deprecated Sentinel Date whose UTC accessors hold the wall-clock
   * components. Use `year/month/day/hour/minute/weekday` instead.
   * `.getTime()` is NOT a true UT ms instant — it's `tzOffset`-shifted.
   */
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

  const parts = jdToParts(bestJD, birthTz);
  return {
    jd: bestJD,
    year: parts.year,
    month: parts.month,
    day: parts.day,
    hour: parts.hour,
    minute: parts.minute,
    weekday: parts.weekday,
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

/**
 * Round 3 R3-TZ-1 — return structured wall-clock parts directly. Pure
 * arithmetic, no Date roundtrip. Weekday per BPHS Lesson O: JD-based
 * formula `Math.floor(jd + 1.5) % 7` gives 0=Sunday.
 */
function jdToParts(jd: number, tzOffset: number): {
  year: number; month: number; day: number; hour: number; minute: number; weekday: number;
} {
  // Gemini #165 — single Gregorian conversion on the local-time JD.
  // The earlier UT-block was dead code (computed values were never used).
  // Shift JD by tzOffset/24 to get the birth-location wall-clock instant;
  // the standard JD→Gregorian conversion then yields the local components.
  const localJd = jd + tzOffset / 24;
  const z2 = Math.floor(localJd + 0.5);
  const f2 = localJd + 0.5 - z2;
  let a2 = z2;
  if (z2 >= 2299161) {
    const alpha2 = Math.floor((z2 - 1867216.25) / 36524.25);
    a2 = z2 + 1 + alpha2 - Math.floor(alpha2 / 4);
  }
  const b2 = a2 + 1524;
  const c2 = Math.floor((b2 - 122.1) / 365.25);
  const dCoef2 = Math.floor(365.25 * c2);
  const e2 = Math.floor((b2 - dCoef2) / 30.6001);
  const dayFracLocal = b2 - dCoef2 - Math.floor(30.6001 * e2) + f2;
  const day = Math.floor(dayFracLocal);
  const month = e2 < 14 ? e2 - 1 : e2 - 13;
  const year = month > 2 ? c2 - 4716 : c2 - 4715;
  const hourFrac = (dayFracLocal - day) * 24;
  const hour = Math.floor(hourFrac);
  const minute = Math.floor((hourFrac - hour) * 60);
  // JD weekday (UT, not local) — varsheshvara per project convention.
  const weekday = ((Math.floor(jd + 1.5) % 7) + 7) % 7;
  return { year, month, day, hour, minute, weekday };
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

  // Lesson L: use Date.UTC  –  the JD→Gregorian conversion gives UT components.
  // Local-time constructor would shift by server timezone offset on Vercel (UTC) vs dev.
  return new Date(Date.UTC(year, month - 1, day, hour, min));
}

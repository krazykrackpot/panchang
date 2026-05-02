/**
 * Ganda Mool Nakshatra date computation.
 *
 * Ganda Mool = 6 nakshatras at the junctions between water and fire signs:
 *   Ashwini (1), Ashlesha (9), Magha (10), Jyeshtha (18), Mula (19), Revati (27)
 *
 * These are considered inauspicious for birth. Babies born during Ganda Mool
 * nakshatra require a shanti puja (usually on the 27th day after birth).
 *
 * Algorithm: Scan the year at 2-hour intervals for Moon's sidereal longitude.
 * When Moon crosses a Ganda Mool boundary, refine with binary search.
 */

import {
  dateToJD,
  moonLongitude,
  toSidereal,
  getNakshatraNumber,
} from '@/lib/ephem/astronomical';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import type { LocaleText } from '@/types/panchang';

// Ganda Mool nakshatra IDs (1-based)
export const GANDA_MOOL_IDS = [1, 9, 10, 18, 19, 27] as const;

export interface GandaMoolEntry {
  nakshatraId: number;
  nakshatraName: LocaleText;
  ruler: string;
  rulerName: LocaleText;
  startJd: number;
  endJd: number;
  startDate: string;   // YYYY-MM-DD
  endDate: string;
  startTime: string;   // HH:MM local
  endTime: string;
  durationHours: number;
  month: number;        // 1-12
}

/**
 * Find all Ganda Mool periods in a given year for a location.
 */
export function computeGandaMoolDates(
  year: number,
  lat: number,
  lon: number,
  timezone: string,
): GandaMoolEntry[] {
  const entries: GandaMoolEntry[] = [];
  const gmSet = new Set(GANDA_MOOL_IDS as readonly number[]);

  // Scan from Jan 1 to Dec 31 at 2-hour steps
  const startJd = dateToJD(year, 1, 1, 0);
  const endJd = dateToJD(year + 1, 1, 1, 0);
  const step = 2 / 24; // 2 hours in days

  let prevNak = getNakshatraNumber(toSidereal(moonLongitude(startJd), startJd));
  let inGM = gmSet.has(prevNak);
  let gmStartJd = inGM ? startJd : 0;

  for (let jd = startJd + step; jd <= endJd; jd += step) {
    const nak = getNakshatraNumber(toSidereal(moonLongitude(jd), jd));

    if (!inGM && gmSet.has(nak) && !gmSet.has(prevNak)) {
      // Entered a GM nakshatra — refine start
      gmStartJd = refineBoundary(jd - step, jd, (j) => {
        const n = getNakshatraNumber(toSidereal(moonLongitude(j), j));
        return gmSet.has(n);
      });
      inGM = true;
    } else if (inGM && !gmSet.has(nak) && gmSet.has(prevNak)) {
      // Exited a GM nakshatra — refine end
      const gmEndJd = refineBoundary(jd - step, jd, (j) => {
        const n = getNakshatraNumber(toSidereal(moonLongitude(j), j));
        return gmSet.has(n);
      }, true);

      // Build the entry
      const nakAtStart = getNakshatraNumber(toSidereal(moonLongitude(gmStartJd + 0.001), gmStartJd + 0.001));
      const nakData = NAKSHATRAS[nakAtStart - 1];
      if (nakData) {
        const startDate = jdToLocalDate(gmStartJd, timezone);
        const endDate = jdToLocalDate(gmEndJd, timezone);
        entries.push({
          nakshatraId: nakAtStart,
          nakshatraName: nakData.name,
          ruler: nakData.ruler,
          rulerName: nakData.rulerName,
          startJd: gmStartJd,
          endJd: gmEndJd,
          startDate: startDate.dateStr,
          endDate: endDate.dateStr,
          startTime: startDate.timeStr,
          endTime: endDate.timeStr,
          durationHours: Math.round((gmEndJd - gmStartJd) * 24 * 10) / 10,
          month: startDate.month,
        });
      }
      inGM = false;
    }

    prevNak = nak;
  }

  return entries;
}

/** Binary search to find the exact JD where a condition changes. */
function refineBoundary(
  jdLow: number,
  jdHigh: number,
  isInside: (jd: number) => boolean,
  findExit = false,
): number {
  for (let i = 0; i < 20; i++) {
    const mid = (jdLow + jdHigh) / 2;
    const inside = isInside(mid);
    if (findExit ? inside : !inside) {
      jdLow = mid;
    } else {
      jdHigh = mid;
    }
  }
  return findExit ? jdHigh : jdHigh;
}

/** Convert JD to local date string and time string. */
function jdToLocalDate(jd: number, timezone: string): { dateStr: string; timeStr: string; month: number } {
  // JD → UTC Date
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
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  const intDay = Math.floor(dayFrac);
  const utcHours = (dayFrac - intDay) * 24;

  // Apply timezone offset
  const utcDate = new Date(Date.UTC(year, month - 1, intDay, Math.floor(utcHours), Math.floor((utcHours % 1) * 60)));
  const offset = getUTCOffsetForDate(year, month, intDay, timezone);
  const localMs = utcDate.getTime() + offset * 3600 * 1000;
  const localDate = new Date(localMs);

  const yy = localDate.getUTCFullYear();
  const mm = localDate.getUTCMonth() + 1;
  const dd = localDate.getUTCDate();
  const hh = localDate.getUTCHours();
  const mi = localDate.getUTCMinutes();

  return {
    dateStr: `${yy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`,
    timeStr: `${String(hh).padStart(2, '0')}:${String(mi).padStart(2, '0')}`,
    month: mm,
  };
}

/**
 * Birth Time Rectification — Candidate Generator (Phase 1)
 *
 * Generates birth time candidates within the search window and computes
 * the ascendant degree/sign for each using the fast calcAscendant function.
 */

import { calcAscendant, dateToJD } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import type { RectificationInput } from './types';

export interface CandidateInfo {
  time: string; // "HH:MM"
  lagnaSign: number; // 1-12
  lagnaSignName: { en: string; hi: string };
  lagnaDegree: number; // 0-360
}

/**
 * Parse "HH:MM" to total minutes from midnight.
 */
function timeToMinutes(t: string): number {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Convert total minutes from midnight to "HH:MM".
 */
function minutesToTime(mins: number): string {
  // Wrap around midnight (0-1439)
  const wrapped = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(wrapped / 60);
  const m = wrapped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/**
 * Determine the lagna sign (1-12) from a longitude in degrees (0-360).
 */
function signFromLongitude(deg: number): number {
  return Math.floor(deg / 30) + 1;
}

/**
 * Generate all candidate birth times with their ascendant info.
 *
 * Strategy:
 * - If approximateTime given: +/- 1.5 hours (90 min each side) in 2-min steps
 * - If timeRange given: scan that range in 2-min steps
 * - If neither: scan 06:00 to 18:00 in 4-min steps (180 candidates)
 */
export function generateCandidates(input: RectificationInput): CandidateInfo[] {
  const [year, month, day] = input.birthDate.split('-').map(Number);

  let startMin: number;
  let endMin: number;
  let stepMin: number;

  if (input.approximateTime) {
    const approxMin = timeToMinutes(input.approximateTime);
    startMin = approxMin - 90; // -1.5 hours
    endMin = approxMin + 90; // +1.5 hours
    stepMin = 2;
  } else if (input.timeRange) {
    startMin = timeToMinutes(input.timeRange.from);
    endMin = timeToMinutes(input.timeRange.to);
    stepMin = 2;
  } else {
    // Default: 6 AM to 6 PM, 4-minute steps
    startMin = 360; // 06:00
    endMin = 1080; // 18:00
    stepMin = 4;
  }

  // Clamp to 00:00 - 23:59
  startMin = Math.max(0, startMin);
  endMin = Math.min(1439, endMin);

  const candidates: CandidateInfo[] = [];

  for (let mins = startMin; mins <= endMin; mins += stepMin) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const decimalHour = h + m / 60;

    // Convert local time to UT using the numeric timezone offset
    // Per Lesson L: use explicit UTC arithmetic, never local Date constructors
    const utHour = decimalHour - input.birthTimezone;
    const jd = dateToJD(year, month, day, utHour);

    const ascDeg = calcAscendant(jd, input.birthLat, input.birthLng);
    const signNum = signFromLongitude(ascDeg); // 1-12
    const rashi = RASHIS[signNum - 1];

    candidates.push({
      time: minutesToTime(mins),
      lagnaSign: signNum,
      lagnaSignName: { en: rashi.name.en, hi: rashi.name.hi ?? rashi.name.en },
      lagnaDegree: ascDeg,
    });
  }

  return candidates;
}

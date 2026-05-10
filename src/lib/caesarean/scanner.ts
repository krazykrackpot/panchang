// src/lib/caesarean/scanner.ts

/**
 * Caesarean Birth Time Scanner
 *
 * Iterates a date range within operating-hour constraints, computes a
 * lightweight chart snapshot for each window, and scores it via
 * the 5-pillar scorer. Returns ranked slots sorted by score descending.
 *
 * Performance: for a 7-day range at 15-min resolution with 8am-5pm hours,
 * that's 7 x 36 = 252 evaluations. Each evaluation computes ascendant +
 * planet positions + panchang snapshot  –  roughly 2-5ms each on modern
 * hardware, so total scan time is ~0.5-1.2 seconds.
 *
 * Design: noon planet positions are reused for all windows on the same day
 * (planets other than Moon barely move intra-day). Moon data comes from the
 * per-window panchang snapshot at midpoint for accuracy (~13 deg/day motion).
 */

import { calculateAscendant } from '@/lib/ephem/kundali-calc';
import {
  dateToJD,
  getAyanamsha,
  getPlanetaryPositions,
  toSidereal,
  getRashiNumber,
} from '@/lib/ephem/astronomical';
import { getPanchangSnapshot } from '@/lib/muhurta/panchang-snapshot';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { scoreBirthSlot } from './scorer';
import type { ChartSnapshot } from './scorer';
import type { CaesareanScanInput, CaesareanScanResult, ScoredBirthSlot } from './types';
import { SIGN_LORDS } from '@/lib/constants/dignities';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';

/**
 * Scan a date range for optimal caesarean birth times.
 *
 * @param input - Date range, location, operating hours, and scan resolution
 * @returns Ranked slots sorted by score descending, capped at maxResults
 */
export function scanCaesareanSlots(input: CaesareanScanInput): CaesareanScanResult {
  const startTime = Date.now();
  const {
    startDate, endDate, lat, lng, timezone,
    opStart, opEnd,
    windowMinutes = 15,
    maxResults = 20,
  } = input;

  const allSlots: ScoredBirthSlot[] = [];
  let totalEvaluated = 0;

  // Parse date strings as UTC to avoid local-timezone drift (Lesson L)
  const [startY, startM, startD] = startDate.split('-').map(Number);
  const [endY, endM, endD] = endDate.split('-').map(Number);
  const startMs = Date.UTC(startY, startM - 1, startD);
  const endMs = Date.UTC(endY, endM - 1, endD);
  const ONE_DAY_MS = 86400000;

  for (let dayMs = startMs; dayMs <= endMs; dayMs += ONE_DAY_MS) {
    const dayDate = new Date(dayMs);
    const y = dayDate.getUTCFullYear();
    const m = dayDate.getUTCMonth() + 1;
    const d = dayDate.getUTCDate();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // Resolve timezone offset for this specific date (DST-aware)
    const tzOffset = getUTCOffsetForDate(y, m, d, timezone);

    // JD at noon UT for this date  –  used for ayanamsha and planet positions
    const jdNoon = dateToJD(y, m, d, 12);
    const ayanamsha = getAyanamsha(jdNoon, 'lahiri');

    // Planet positions at noon UT (sufficient for house placement  – 
    // planets other than Moon move slowly, and Moon data comes from
    // per-window panchang snapshot below)
    const noonPlanets = getPlanetaryPositions(jdNoon);

    // Pre-compute sidereal positions for noon planets
    const noonPlanetsSid = noonPlanets.map(p => ({
      id: p.id,
      sidLong: toSidereal(p.longitude, jdNoon, ayanamsha),
      speed: p.speed,
      isRetrograde: p.speed < 0,
    }));

    // Iterate time windows within operating hours
    const stepHours = windowMinutes / 60;
    for (let hour = opStart; hour < opEnd; hour += stepHours) {
      const windowStartHour = hour;
      const windowEndHour = Math.min(hour + stepHours, opEnd);
      const midHour = (windowStartHour + windowEndHour) / 2;

      // Convert local midpoint time to UT for JD computation
      // local_time = UT + tzOffset, so UT = local_time - tzOffset
      const midHourUT = midHour - tzOffset;
      const midJD = jdNoon + (midHourUT - 12) / 24;

      // Compute ascendant at midpoint (returns tropical degrees)
      const tropicalAsc = calculateAscendant(midJD, lat, lng);
      const sidAsc = toSidereal(tropicalAsc, midJD, ayanamsha);
      const lagnaSign = getRashiNumber(sidAsc);
      const lagnaDegreesInSign = sidAsc % 30;
      const lagnaLordId = SIGN_LORDS[lagnaSign];

      // Build planet house placements (whole-sign from lagna)
      const planetSnaps = noonPlanetsSid.map(p => {
        const sign = getRashiNumber(p.sidLong);
        const house = ((sign - lagnaSign + 12) % 12) + 1;
        return {
          id: p.id,
          sign,
          house,
          longitude: p.sidLong,
          isRetrograde: p.isRetrograde,
        };
      });

      // Get panchang snapshot at midpoint for accurate Moon position
      // (Moon moves ~13 deg/day, so noon position would be +/- 6.5 deg off)
      const panchangSnap = getPanchangSnapshot(midJD, lat, lng);
      const moonSidDeg = panchangSnap.moonSid;
      const moonSign = panchangSnap.moonSign;
      const moonHouse = ((moonSign - lagnaSign + 12) % 12) + 1;

      // Nakshatra from Moon's sidereal longitude
      // Each nakshatra spans 360/27 = 13.333... degrees
      const nakshatraDeg = 360 / 27;
      const moonNakshatraId = Math.floor(moonSidDeg / nakshatraDeg) + 1;
      const padaDeg = nakshatraDeg / 4;
      const degreesIntoNakshatra = moonSidDeg % nakshatraDeg;
      const moonNakshatraPada = Math.floor(degreesIntoNakshatra / padaDeg) + 1;

      // Lagna lord placement
      const lagnaLordSnap = planetSnaps.find(p => p.id === lagnaLordId);
      const lagnaLordSign = lagnaLordSnap?.sign ?? lagnaSign;
      const lagnaLordHouse = lagnaLordSnap?.house ?? 1;

      // Sun position for combustion check
      const sunPlanet = planetSnaps.find(p => p.id === 0);
      const sunSidDeg = sunPlanet?.longitude ?? 0;

      const chartSnap: ChartSnapshot = {
        lagnaSign,
        lagnaDegreesInSign,
        lagnaLordId,
        lagnaLordSign,
        lagnaLordHouse,
        moonSign,
        moonHouse,
        moonSidDeg,
        moonNakshatraId: Math.max(1, Math.min(27, moonNakshatraId)),
        moonNakshatraPada: Math.max(1, Math.min(4, moonNakshatraPada)),
        planets: planetSnaps,
        tithiNumber: panchangSnap.tithi,
        yogaNumber: panchangSnap.yoga,
        karanaNumber: panchangSnap.karana,
        sunSidDeg,
      };

      const scored = scoreBirthSlot(chartSnap);

      // Fill in time and date data
      scored.date = dateStr;
      scored.time = formatTime(windowStartHour);
      scored.endTime = formatTime(windowEndHour);

      // Fill in panchang display names from constant tables
      const clampedNakId = Math.max(1, Math.min(27, moonNakshatraId));
      scored.panchang = {
        tithi: TITHIS[panchangSnap.tithi - 1]?.name ?? { en: `Tithi ${panchangSnap.tithi}` },
        nakshatra: NAKSHATRAS[clampedNakId - 1]?.name ?? { en: `Nakshatra ${clampedNakId}` },
        yoga: YOGAS[panchangSnap.yoga - 1]?.name ?? { en: `Yoga ${panchangSnap.yoga}` },
        karana: KARANAS[panchangSnap.karana - 1]?.name ?? { en: `Karana ${panchangSnap.karana}` },
      };

      allSlots.push(scored);
      totalEvaluated++;
    }
  }

  // Sort by score descending, take top N
  allSlots.sort((a, b) => b.score - a.score);
  const topSlots = allSlots.slice(0, maxResults);

  return {
    slots: topSlots,
    meta: {
      dateRange: { start: startDate, end: endDate },
      location: { lat, lng },
      operatingHours: { start: opStart, end: opEnd },
      totalSlotsEvaluated: totalEvaluated,
      computeTimeMs: Date.now() - startTime,
    },
  };
}

/**
 * Format a fractional hour as HH:MM string.
 * E.g., 9.5 => "09:30", 14.25 => "14:15"
 */
function formatTime(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

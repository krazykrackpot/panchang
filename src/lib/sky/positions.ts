/**
 * Sky positions utility — converts tropical planetary positions to sidereal
 * using Lahiri ayanamsha and enriches with rashi/nakshatra/pada metadata.
 *
 * NOTE: All date construction uses Date.UTC to avoid local-timezone bias (Lesson L).
 * NOTE: getPlanetaryPositions() returns tropical longitudes; we apply lahiriAyanamsha
 *       + toSidereal() here to get sidereal values for Vedic display.
 */

import {
  getPlanetaryPositions,
  lahiriAyanamsha,
  toSidereal,
  normalizeDeg,
} from '@/lib/ephem/astronomical';
import { dateToJD } from '@/lib/astronomy/julian';

export interface SkyPlanetPosition {
  id: number; // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
  name: string;
  siderealLongitude: number; // 0-360
  speed: number; // deg/day
  isRetrograde: boolean;
  rashi: number; // 1-12
  nakshatra: number; // 1-27
  nakshatraPada: number; // 1-4
}

/** Planet names by id (0=Sun … 8=Ketu) */
const PLANET_NAMES: Record<number, string> = {
  0: 'Sun',
  1: 'Moon',
  2: 'Mars',
  3: 'Mercury',
  4: 'Jupiter',
  5: 'Venus',
  6: 'Saturn',
  7: 'Rahu',
  8: 'Ketu',
};

/**
 * Convert a Date to Julian Day Number using UTC components.
 * Uses dateToJD from astronomy/julian which accepts (year, month, day, hour, min, sec).
 */
function dateToJDSafe(date: Date): number {
  return dateToJD(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );
}

/**
 * Compute nakshatra pada (1-4) for a given sidereal longitude.
 * Each nakshatra spans 360/27 ≈ 13.333°, divided into 4 padas of ~3.333° each.
 */
function getNakshatraPada(sidLong: number): number {
  const nakshatraSpan = 360 / 27; // 13.333...
  const posInNakshatra = sidLong % nakshatraSpan;
  return Math.floor(posInNakshatra / (nakshatraSpan / 4)) + 1;
}

/**
 * Get current sidereal planetary positions using Lahiri ayanamsha.
 *
 * @param date  Optional date — defaults to now (new Date()). Internally uses
 *              Date.UTC components to avoid local-timezone skew.
 */
export function getCurrentSkyPositions(date?: Date): SkyPlanetPosition[] {
  const d = date ?? new Date();
  const jd = dateToJDSafe(d);
  const ayanamsha = lahiriAyanamsha(jd);

  const tropicalPositions = getPlanetaryPositions(jd);

  return tropicalPositions.map((p) => {
    const siderealLongitude = normalizeDeg(toSidereal(p.longitude, jd, ayanamsha));
    const rashi = Math.floor(siderealLongitude / 30) + 1; // 1-12
    const nakshatra = Math.floor(siderealLongitude / (360 / 27)) + 1; // 1-27
    const nakshatraPada = getNakshatraPada(siderealLongitude);

    return {
      id: p.id,
      name: PLANET_NAMES[p.id] ?? `Planet ${p.id}`,
      siderealLongitude,
      speed: p.speed,
      isRetrograde: p.isRetrograde,
      rashi,
      nakshatra,
      nakshatraPada,
    };
  });
}

/**
 * Ayanamsa calculations
 * The precession correction that converts tropical (Western) to sidereal (Vedic) longitudes.
 */

import { julianCenturies } from './julian';

export type AyanamsaType = 'lahiri' | 'krishnamurti' | 'raman';

/**
 * Calculate Ayanamsa value for a given Julian Day
 * Returns the precession in degrees to subtract from tropical longitude
 */
export function getAyanamsa(jd: number, type: AyanamsaType = 'lahiri'): number {
  const T = julianCenturies(jd);

  switch (type) {
    case 'lahiri': {
      // Lahiri (Chitrapaksha) Ayanamsa — IAE standard
      // Constants aligned with ephem/astronomical.ts (±1 arcsecond for 1900-2100)
      const t = (jd - 2451545.0) / 36525.0;
      return 23.85306 + 1.39722 * t + 0.00018 * t * t - 0.000005 * t * t * t;
    }
    case 'krishnamurti': {
      // KP (Krishnamurti Paddhati) Ayanamsa — ~6 arcmin offset from Lahiri
      const t = (jd - 2451545.0) / 36525.0;
      return 23.76056 + 1.39722 * t + 0.00018 * t * t;
    }
    case 'raman': {
      // BV Raman Ayanamsa
      const t = (jd - 2451545.0) / 36525.0;
      return 22.37778 + 1.38250 * t + 0.00015 * t * t;
    }
    default:
      return getAyanamsa(jd, 'lahiri');
  }
}

/** Convert tropical longitude to sidereal longitude */
export function tropicalToSidereal(tropicalLon: number, ayanamsa: number): number {
  let sidereal = tropicalLon - ayanamsa;
  if (sidereal < 0) sidereal += 360;
  if (sidereal >= 360) sidereal -= 360;
  return sidereal;
}

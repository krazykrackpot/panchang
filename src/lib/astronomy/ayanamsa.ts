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
      // Lahiri (Chitrapaksha) Ayanamsa
      // Based on the position of Spica (Chitra) at 180° sidereal
      // Reference: Indian Astronomical Ephemeris standard
      const t = (jd - 2451545.0) / 36525.0;
      return 23.853765 + 1.3970294 * t + 0.0001722 * t * t;
    }
    case 'krishnamurti': {
      // KP (Krishnamurti Paddhati) Ayanamsa
      // Slightly different from Lahiri
      const t = (jd - 2451545.0) / 36525.0;
      return 23.743056 + 1.3970294 * t + 0.0001722 * t * t;
    }
    case 'raman': {
      // BV Raman Ayanamsa
      const t = (jd - 2451545.0) / 36525.0;
      return 22.460148 + 1.3870286 * t;
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

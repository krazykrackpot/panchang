/**
 * Sunrise/Sunset calculations
 * Based on Meeus, "Astronomical Algorithms" Chapter 15
 */

import { dateToJD, julianCenturies, degToRad, radToDeg, normalizeAngle } from './julian';
import { getSolarPosition, getEquationOfTime } from './solar';

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  dawn: Date;      // Civil twilight start
  dusk: Date;       // Civil twilight end
  dayDurationMinutes: number;
}

/**
 * Calculate sunrise/sunset for a given date and location
 * @param year - Year
 * @param month - Month (1-12)
 * @param day - Day of month
 * @param latitude - Observer latitude (degrees, N positive)
 * @param longitude - Observer longitude (degrees, E positive)
 * @param timezoneOffset - Timezone offset from UTC in hours (e.g., 5.5 for IST)
 */
export function getSunTimes(
  year: number, month: number, day: number,
  latitude: number, longitude: number,
  timezoneOffset: number
): SunTimes {
  const jd = dateToJD(year, month, day, 12, 0, 0); // Noon UTC
  const T = julianCenturies(jd);
  const solar = getSolarPosition(jd);
  const eot = getEquationOfTime(jd);

  const decl = degToRad(solar.declination);
  const lat = degToRad(latitude);

  // Hour angle for sunrise/sunset (center of sun disk at horizon, with refraction)
  const h0 = degToRad(-0.8333); // Standard altitude for sunrise/sunset
  const cosH0 = (Math.sin(h0) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl));

  // Hour angle for civil twilight
  const h1 = degToRad(-6);
  const cosH1 = (Math.sin(h1) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl));

  // Clamp for polar regions
  const clampedH0 = Math.max(-1, Math.min(1, cosH0));
  const clampedH1 = Math.max(-1, Math.min(1, cosH1));

  const H0 = radToDeg(Math.acos(clampedH0)); // degrees
  const H1 = radToDeg(Math.acos(clampedH1));

  // Solar noon in minutes from midnight (local time)
  const solarNoon = 720 - 4 * longitude - eot + timezoneOffset * 60;

  const sunriseMinutes = solarNoon - 4 * H0;
  const sunsetMinutes = solarNoon + 4 * H0;
  const dawnMinutes = solarNoon - 4 * H1;
  const duskMinutes = solarNoon + 4 * H1;

  const toDate = (minutes: number): Date => {
    const h = Math.floor(minutes / 60);
    const m = Math.floor(minutes % 60);
    const s = Math.round((minutes % 1) * 60);
    return new Date(year, month - 1, day, h, m, s);
  };

  return {
    sunrise: toDate(sunriseMinutes),
    sunset: toDate(sunsetMinutes),
    dawn: toDate(dawnMinutes),
    dusk: toDate(duskMinutes),
    dayDurationMinutes: sunsetMinutes - sunriseMinutes,
  };
}

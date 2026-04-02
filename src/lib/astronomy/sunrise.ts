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
  const lat = degToRad(latitude);

  // Helper: compute hour angle for a given solar altitude threshold at a specific JD
  function computeHourAngle(jd: number, altitudeDeg: number): number {
    const solar = getSolarPosition(jd);
    const decl = degToRad(solar.declination);
    const h = degToRad(altitudeDeg);
    const cosHA = (Math.sin(h) - Math.sin(lat) * Math.sin(decl)) / (Math.cos(lat) * Math.cos(decl));
    return radToDeg(Math.acos(Math.max(-1, Math.min(1, cosHA))));
  }

  // First pass: use noon for initial estimate
  // EoT sign convention: getEquationOfTime returns (apparent - mean) solar time in minutes
  // Solar noon formula: noon = 720 - 4*longitude + EoT + timezone*60
  // (when EoT is negative, apparent sun is behind mean sun → noon comes later)
  const jdNoon = dateToJD(year, month, day, 12, 0, 0); // Noon UTC
  const eotNoon = getEquationOfTime(jdNoon);
  const solarNoon = 720 - 4 * longitude - eotNoon + timezoneOffset * 60;

  const H0_initial = computeHourAngle(jdNoon, -0.8333);
  let sunriseMinutes = solarNoon - 4 * H0_initial;
  let sunsetMinutes = solarNoon + 4 * H0_initial;

  // Second pass: recalculate using declination at the estimated sunrise/sunset times
  const sunriseUTCHours = (sunriseMinutes - timezoneOffset * 60) / 60;
  const sunsetUTCHours = (sunsetMinutes - timezoneOffset * 60) / 60;

  const jdSunrise = dateToJD(year, month, day, sunriseUTCHours, 0, 0);
  const jdSunset = dateToJD(year, month, day, sunsetUTCHours, 0, 0);

  const eotSunrise = getEquationOfTime(jdSunrise);
  const eotSunset = getEquationOfTime(jdSunset);

  const H0_rise = computeHourAngle(jdSunrise, -0.8333);
  const H0_set = computeHourAngle(jdSunset, -0.8333);

  const solarNoonRise = 720 - 4 * longitude - eotSunrise + timezoneOffset * 60;
  const solarNoonSet = 720 - 4 * longitude - eotSunset + timezoneOffset * 60;

  sunriseMinutes = solarNoonRise - 4 * H0_rise;
  sunsetMinutes = solarNoonSet + 4 * H0_set;

  // Civil twilight (single-pass is fine — less precision needed)
  const H1 = computeHourAngle(jdNoon, -6);
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

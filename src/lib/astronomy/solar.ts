/**
 * Solar position calculations
 * Based on Jean Meeus, "Astronomical Algorithms" (2nd ed.), Chapter 25
 * Accuracy: ~0.01° in longitude
 */

import { julianCenturies, normalizeAngle, degToRad } from './julian';

export interface SolarPosition {
  longitude: number;      // Geometric ecliptic longitude (degrees)
  apparentLongitude: number; // Apparent longitude (corrected for nutation/aberration)
  distance: number;       // Distance from Earth (AU)
  rightAscension: number; // Right ascension (degrees)
  declination: number;    // Declination (degrees)
}

export function getSolarPosition(jd: number): SolarPosition {
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;

  // Geometric mean longitude of the Sun (degrees)
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T2);

  // Mean anomaly of the Sun (degrees)
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T2);
  const Mrad = degToRad(M);

  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T2) * Math.sin(Mrad)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad)
    + 0.000289 * Math.sin(3 * Mrad);

  // Sun's true longitude
  const sunLongitude = normalizeAngle(L0 + C);

  // Sun's true anomaly
  const v = M + C;

  // Sun's radius vector (distance in AU)
  const e = 0.016708634 - 0.000042037 * T - 0.0000001267 * T2;
  const R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(degToRad(v)));

  // Apparent longitude (nutation + aberration)
  const omega = 125.04 - 1934.136 * T;
  const apparentLongitude = normalizeAngle(sunLongitude - 0.00569 - 0.00478 * Math.sin(degToRad(omega)));

  // Obliquity of ecliptic
  const epsilon0 = 23.0 + 26.0 / 60 + 21.448 / 3600
    - (46.8150 / 3600) * T
    - (0.00059 / 3600) * T2
    + (0.001813 / 3600) * T3;
  const epsilon = epsilon0 + 0.00256 * Math.cos(degToRad(omega));

  const epsilonRad = degToRad(epsilon);
  const lambdaRad = degToRad(apparentLongitude);

  // Right ascension and declination
  const rightAscension = normalizeAngle(
    Math.atan2(Math.cos(epsilonRad) * Math.sin(lambdaRad), Math.cos(lambdaRad)) * 180 / Math.PI
  );
  const declination = Math.asin(Math.sin(epsilonRad) * Math.sin(lambdaRad)) * 180 / Math.PI;

  return {
    longitude: sunLongitude,
    apparentLongitude,
    distance: R,
    rightAscension,
    declination,
  };
}

/** Mean obliquity of the ecliptic */
export function getObliquity(jd: number): number {
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;
  return 23.0 + 26.0 / 60 + 21.448 / 3600
    - (46.8150 / 3600) * T
    - (0.00059 / 3600) * T2
    + (0.001813 / 3600) * T3;
}

/** Greenwich Mean Sidereal Time (degrees) */
export function getGMST(jd: number): number {
  const T = julianCenturies(jd);
  const theta = 280.46061837
    + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T * T
    - T * T * T / 38710000.0;
  return normalizeAngle(theta);
}

/** Local Sidereal Time (degrees) */
export function getLST(jd: number, longitudeDeg: number): number {
  return normalizeAngle(getGMST(jd) + longitudeDeg);
}

/** Equation of time (minutes) — difference between apparent and mean solar time */
export function getEquationOfTime(jd: number): number {
  const T = julianCenturies(jd);
  const epsilon = degToRad(getObliquity(jd));
  const L0 = degToRad(normalizeAngle(280.46646 + 36000.76983 * T));
  const e = 0.016708634 - 0.000042037 * T;
  const M = degToRad(normalizeAngle(357.52911 + 35999.05029 * T));

  const y = Math.tan(epsilon / 2) * Math.tan(epsilon / 2);

  const EoT = y * Math.sin(2 * L0)
    - 2 * e * Math.sin(M)
    + 4 * e * y * Math.sin(M) * Math.cos(2 * L0)
    - 0.5 * y * y * Math.sin(4 * L0)
    - 1.25 * e * e * Math.sin(2 * M);

  return EoT * 180 / Math.PI * 4; // Convert to minutes
}

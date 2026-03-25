/**
 * Lunar position calculations
 * Based on Jean Meeus, "Astronomical Algorithms" (2nd ed.), Chapter 47
 * Simplified — uses the largest periodic terms for ~0.5° accuracy
 */

import { julianCenturies, normalizeAngle, degToRad } from './julian';

export interface LunarPosition {
  longitude: number;     // Ecliptic longitude (degrees)
  latitude: number;      // Ecliptic latitude (degrees)
  distance: number;      // Distance from Earth (km)
  parallax: number;      // Horizontal parallax (degrees)
}

export function getLunarPosition(jd: number): LunarPosition {
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Moon's mean longitude (degrees)
  const Lp = normalizeAngle(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0 - T4 / 65194000.0);

  // Moon's mean elongation (degrees)
  const D = normalizeAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0);

  // Sun's mean anomaly (degrees)
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0);

  // Moon's mean anomaly (degrees)
  const Mp = normalizeAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0);

  // Moon's argument of latitude (degrees)
  const F = normalizeAngle(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0 + T4 / 863310000.0);

  // Convert to radians
  const Dr = degToRad(D);
  const Mr = degToRad(M);
  const Mpr = degToRad(Mp);
  const Fr = degToRad(F);

  // Longitude correction terms (largest terms from Meeus Table 47.A)
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  let sumL = 0;
  let sumR = 0;

  // Longitude and distance terms [D, M, Mp, F, sinCoeff, cosCoeff]
  const lrTerms: [number, number, number, number, number, number][] = [
    [0, 0, 1, 0, 6288774, -20905355],
    [2, 0, -1, 0, 1274027, -3699111],
    [2, 0, 0, 0, 658314, -2955968],
    [0, 0, 2, 0, 213618, -569925],
    [0, 1, 0, 0, -185116, 48888],
    [0, 0, 0, 2, -114332, -3149],
    [2, 0, -2, 0, 58793, 246158],
    [2, -1, -1, 0, 57066, -152138],
    [2, 0, 1, 0, 53322, -170733],
    [2, -1, 0, 0, 45758, -204586],
    [0, 1, -1, 0, -40923, -129620],
    [1, 0, 0, 0, -34720, 108743],
    [0, 1, 1, 0, -30383, 104755],
    [2, 0, 0, -2, 15327, 10321],
    [0, 0, 1, 2, -12528, 0],
    [0, 0, 1, -2, 10980, 79661],
    [4, 0, -1, 0, 10675, -34782],
    [0, 0, 3, 0, 10034, -23210],
    [4, 0, -2, 0, 8548, -21636],
    [2, 1, -1, 0, -7888, 24208],
    [2, 1, 0, 0, -6766, 30824],
    [1, 0, -1, 0, -5163, -8379],
    [1, 1, 0, 0, 4987, -16675],
    [2, -1, 1, 0, 4036, -12831],
    [2, 0, 2, 0, 3994, -10445],
    [4, 0, 0, 0, 3861, -11650],
    [2, 0, -3, 0, 3665, 14403],
    [0, 1, -2, 0, -2689, -7003],
    [2, 0, -1, 2, -2602, 0],
    [2, -1, -2, 0, 2390, 10056],
    [1, 0, 1, 0, -2348, 6322],
    [2, -2, 0, 0, 2236, -9884],
    [0, 1, 2, 0, -2120, 5751],
    [0, 2, 0, 0, -2069, 0],
    [2, -2, -1, 0, 2048, -4950],
    [2, 0, 1, -2, -1773, 4130],
    [2, 0, 0, 2, -1595, 0],
    [4, -1, -1, 0, 1215, -3958],
    [0, 0, 2, 2, -1110, 0],
    [3, 0, -1, 0, -892, 3258],
    [2, 1, 1, 0, -810, 2616],
    [4, -1, -2, 0, 759, -1897],
    [0, 2, -1, 0, -713, -2117],
    [2, 2, -1, 0, -700, 2354],
    [2, 1, -2, 0, 691, 0],
    [2, -1, 0, -2, 596, 0],
    [4, 0, 1, 0, 549, -1423],
    [0, 0, 4, 0, 537, -1117],
    [4, -1, 0, 0, 520, -1571],
    [1, 0, -2, 0, -487, -1739],
  ];

  for (const [d, m, mp, f, sl, sr] of lrTerms) {
    const arg = d * Dr + m * Mr + mp * Mpr + f * Fr;
    let eCorr = 1;
    if (Math.abs(m) === 1) eCorr = E;
    if (Math.abs(m) === 2) eCorr = E * E;
    sumL += sl * eCorr * Math.sin(arg);
    sumR += sr * eCorr * Math.cos(arg);
  }

  // Latitude terms [D, M, Mp, F, sinCoeff]
  const bTerms: [number, number, number, number, number][] = [
    [0, 0, 0, 1, 5128122],
    [0, 0, 1, 1, 280602],
    [0, 0, 1, -1, 277693],
    [2, 0, 0, -1, 173237],
    [2, 0, -1, 1, 55413],
    [2, 0, -1, -1, 46271],
    [2, 0, 0, 1, 32573],
    [0, 0, 2, 1, 17198],
    [2, 0, 1, -1, 9266],
    [0, 0, 2, -1, 8822],
    [2, -1, 0, -1, 8216],
    [2, 0, -2, -1, 4324],
    [2, 0, 1, 1, 4200],
    [2, 1, 0, -1, -3359],
    [2, -1, -1, 1, 2463],
    [2, -1, 0, 1, 2211],
    [2, -1, -1, -1, 2065],
    [0, 1, -1, -1, -1870],
    [4, 0, -1, -1, 1828],
    [0, 1, 0, 1, -1794],
    [0, 0, 0, 3, -1749],
    [0, 1, -1, 1, -1565],
    [1, 0, 0, 1, -1491],
    [0, 1, 1, 1, -1475],
    [0, 1, 1, -1, -1410],
    [0, 1, 0, -1, -1344],
    [1, 0, 0, -1, -1335],
    [0, 0, 3, 1, 1107],
    [4, 0, 0, -1, 1021],
    [4, 0, -1, 1, 833],
  ];

  let sumB = 0;
  for (const [d, m, mp, f, sb] of bTerms) {
    const arg = d * Dr + m * Mr + mp * Mpr + f * Fr;
    let eCorr = 1;
    if (Math.abs(m) === 1) eCorr = E;
    if (Math.abs(m) === 2) eCorr = E * E;
    sumB += sb * eCorr * Math.sin(arg);
  }

  // Additional corrections
  const A1 = degToRad(normalizeAngle(119.75 + 131.849 * T));
  const A2 = degToRad(normalizeAngle(53.09 + 479264.290 * T));
  const A3 = degToRad(normalizeAngle(313.45 + 481266.484 * T));

  sumL += 3958 * Math.sin(A1) + 1962 * Math.sin(degToRad(Lp) - Fr) + 318 * Math.sin(A2);
  sumB += -2235 * Math.sin(degToRad(Lp)) + 382 * Math.sin(A3) + 175 * Math.sin(A1 - Fr)
    + 175 * Math.sin(A1 + Fr) + 127 * Math.sin(degToRad(Lp) - Mpr) - 115 * Math.sin(degToRad(Lp) + Mpr);

  const longitude = normalizeAngle(Lp + sumL / 1000000);
  const latitude = sumB / 1000000;
  const distance = 385000.56 + sumR / 1000;
  const parallax = Math.asin(6378.14 / distance) * 180 / Math.PI;

  return { longitude, latitude, distance, parallax };
}

/** Moon phase angle (0-360): 0=New, 90=First Quarter, 180=Full, 270=Last Quarter */
export function getMoonPhase(sunLongitude: number, moonLongitude: number): number {
  return normalizeAngle(moonLongitude - sunLongitude);
}

/**
 * Lunar position calculations
 * Based on Jean Meeus, "Astronomical Algorithms" (2nd ed.), Chapter 47
 * Simplified — uses the largest periodic terms for ~0.5° accuracy.
 *
 * The full ELP-2000/82 theory (Chapront-Touzé & Chapront) contains thousands
 * of periodic terms. This implementation retains the ~50 largest longitude/
 * distance terms and ~30 largest latitude terms, which is sufficient for
 * panchang purposes (nakshatra spans 13°20', tithi spans 12°).
 *
 * Accuracy bounds (vs full ELP-2000):
 *   - Longitude: ±0.5° typical, ±1° worst case
 *   - Latitude:  ±0.3°
 *   - Distance:  ±500 km (~0.13%)
 *
 * For kundali chart placement the ~0.5° error means nakshatra pada
 * (3°20' each) may occasionally be off by one near boundaries. For
 * tithi (12° each) and yoga (13°20') the error is negligible.
 *
 * References:
 *   - Meeus Ch. 47: "Position of the Moon"
 *   - Meeus Ch. 22: Julian centuries from J2000.0 (T parameter)
 *   - ELP-2000/82: Chapront-Touzé & Chapront, Astronomy & Astrophysics 124 (1983)
 */

import { julianCenturies, normalizeAngle, degToRad } from './julian';

export interface LunarPosition {
  longitude: number;     // Ecliptic longitude (degrees), geometric (not apparent)
  latitude: number;      // Ecliptic latitude (degrees), geocentric
  distance: number;      // Distance from Earth centre (km), mean ~385,000
  parallax: number;      // Horizontal parallax (degrees) — angular radius of Earth as seen from Moon
}

/**
 * Compute the Moon's geocentric ecliptic position for a given Julian Day.
 *
 * Uses the five fundamental arguments of lunar theory (Meeus Ch. 47, Table 47.A/B):
 *   Lp — Moon's mean longitude (origin of the periodic series)
 *   D  — Mean elongation of the Moon from the Sun
 *   M  — Sun's mean anomaly (Earth's orbital eccentricity effect)
 *   Mp — Moon's mean anomaly (Moon's own elliptical orbit)
 *   F  — Moon's argument of latitude (distance from ascending node)
 *
 * Each periodic term is a sinusoidal function of an integer linear combination
 * of these five arguments: sin(d·D + m·M + mp·Mp + f·F). The coefficients
 * d, m, mp, f identify the physical perturbation each term represents
 * (e.g., the evection, variation, annual equation, parallactic inequality).
 */
export function getLunarPosition(jd: number): LunarPosition {
  // T = Julian centuries from J2000.0 (Meeus eq. 22.1)
  const T = julianCenturies(jd);
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  // Lp: Moon's mean longitude, referred to the mean equinox of date (Meeus eq. 47.1)
  // This is the origin from which the periodic corrections are applied.
  const Lp = normalizeAngle(218.3164477 + 481267.88123421 * T - 0.0015786 * T2 + T3 / 538841.0 - T4 / 65194000.0);

  // D: Mean elongation of the Moon — angular separation between the mean
  // longitudes of the Moon and Sun. Controls lunation-dependent terms (Meeus eq. 47.2).
  const D = normalizeAngle(297.8501921 + 445267.1114034 * T - 0.0018819 * T2 + T3 / 545868.0 - T4 / 113065000.0);

  // M: Sun's mean anomaly — the Sun's position in its (Earth's) elliptical orbit.
  // Terms involving M are multiplied by the eccentricity factor E (Meeus eq. 47.6),
  // since Earth's orbital eccentricity is slowly decreasing (Meeus eq. 47.4).
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T - 0.0001536 * T2 + T3 / 24490000.0);

  // Mp: Moon's mean anomaly — the Moon's position in its own elliptical orbit.
  // The largest periodic term (±6.289° in longitude) depends on Mp alone (Meeus eq. 47.5).
  const Mp = normalizeAngle(134.9633964 + 477198.8675055 * T + 0.0087414 * T2 + T3 / 69699.0 - T4 / 14712000.0);

  // F: Moon's argument of latitude — angular distance from the ascending node.
  // Governs the Moon's excursion above/below the ecliptic; dominant in latitude terms.
  const F = normalizeAngle(93.2720950 + 483202.0175233 * T - 0.0036539 * T2 - T3 / 3526000.0 + T4 / 863310000.0);

  // Convert to radians
  const Dr = degToRad(D);
  const Mr = degToRad(M);
  const Mpr = degToRad(Mp);
  const Fr = degToRad(F);

  // E: Eccentricity correction factor (Meeus eq. 47.6).
  // Terms that depend on the Sun's mean anomaly M must be scaled by E (if |m|=1)
  // or E² (if |m|=2), because Earth's orbital eccentricity changes over centuries.
  // E ≈ 1.0 at J2000.0 and decreases ~0.0025 per century.
  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  // sumL: accumulated longitude correction in units of 0.000001° (micro-degrees)
  // sumR: accumulated distance correction in units of 0.001 km (milli-km)
  let sumL = 0;
  let sumR = 0;

  // Periodic terms for longitude (ΣL) and distance (ΣR) from Meeus Table 47.A.
  // Each row: [D multiplier, M multiplier, Mp multiplier, F multiplier, sinCoeff, cosCoeff]
  //   sinCoeff → contribution to ΣL (longitude), cosCoeff → contribution to ΣR (distance)
  //
  // The largest term [0,0,1,0] with sinCoeff=6288774 is the "equation of the centre" —
  // the Moon's elliptical orbit correction (~6.289° amplitude).
  // The second term [2,0,-1,0] (sinCoeff=1274027, ~1.274°) is the "evection" —
  // a perturbation caused by the Sun's gravitational pull on the Moon's orbit.
  // The third term [2,0,0,0] (sinCoeff=658314, ~0.658°) is the "variation" —
  // another solar perturbation that depends on elongation D.
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

  // Sum all periodic terms, applying the eccentricity correction E for
  // terms that involve the Sun's anomaly M (Meeus p. 338).
  for (const [d, m, mp, f, sl, sr] of lrTerms) {
    // The argument is the linear combination d·D + m·M + mp·Mp + f·F (in radians)
    const arg = d * Dr + m * Mr + mp * Mpr + f * Fr;
    // Apply E correction: E^|m| accounts for the secular decrease of Earth's eccentricity
    let eCorr = 1;
    if (Math.abs(m) === 1) eCorr = E;
    if (Math.abs(m) === 2) eCorr = E * E;
    sumL += sl * eCorr * Math.sin(arg);
    sumR += sr * eCorr * Math.cos(arg);
  }

  // Periodic terms for latitude (ΣB) from Meeus Table 47.B.
  // Each row: [D multiplier, M multiplier, Mp multiplier, F multiplier, sinCoeff]
  // The dominant term [0,0,0,1] with coeff=5128122 (~5.128°) is the Moon's
  // maximum geocentric latitude — the inclination of the Moon's orbit to the ecliptic.
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

  // Additional additive corrections not covered by the main periodic tables
  // (Meeus p. 342). These account for:
  //   A1 — the effect of Venus on the Moon's longitude (~0.004°)
  //   A2 — the effect of Jupiter on the Moon's longitude (~0.0003°)
  //   A3 — a latitude correction related to the Moon's flattened orbit
  //   Lp-F term — the "reduction to the ecliptic" correction
  const A1 = degToRad(normalizeAngle(119.75 + 131.849 * T));
  const A2 = degToRad(normalizeAngle(53.09 + 479264.290 * T));
  const A3 = degToRad(normalizeAngle(313.45 + 481266.484 * T));

  sumL += 3958 * Math.sin(A1) + 1962 * Math.sin(degToRad(Lp) - Fr) + 318 * Math.sin(A2);
  sumB += -2235 * Math.sin(degToRad(Lp)) + 382 * Math.sin(A3) + 175 * Math.sin(A1 - Fr)
    + 175 * Math.sin(A1 + Fr) + 127 * Math.sin(degToRad(Lp) - Mpr) - 115 * Math.sin(degToRad(Lp) + Mpr);

  // Convert accumulated micro-degree sums to actual degrees and add to mean values.
  // sumL and sumB are in units of 0.000001°; sumR is in units of 0.001 km.
  const longitude = normalizeAngle(Lp + sumL / 1000000);
  const latitude = sumB / 1000000;
  // 385000.56 km is the Moon's mean distance; sumR/1000 gives the periodic variation
  const distance = 385000.56 + sumR / 1000;
  // Horizontal parallax: angular size of Earth's radius as seen from the Moon.
  // 6378.14 km = Earth's equatorial radius. sin(parallax) = R_earth / distance.
  const parallax = Math.asin(6378.14 / distance) * 180 / Math.PI;

  return { longitude, latitude, distance, parallax };
}

/**
 * Moon phase angle (0-360): 0=New, 90=First Quarter, 180=Full, 270=Last Quarter.
 * This is the elongation of the Moon from the Sun. In Vedic panchang, the
 * phase angle directly determines the tithi: tithi = floor(phase / 12) + 1.
 * Shukla Paksha (waxing) = tithis 1-15 (phase 0°-180°),
 * Krishna Paksha (waning) = tithis 16-30 (phase 180°-360°).
 */
export function getMoonPhase(sunLongitude: number, moonLongitude: number): number {
  return normalizeAngle(moonLongitude - sunLongitude);
}

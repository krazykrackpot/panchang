/**
 * Planetary position calculations (simplified)
 * Uses truncated VSOP87-like series for reasonable accuracy (~1°)
 * Covers: Mercury, Venus, Mars, Jupiter, Saturn, Rahu (mean node), Ketu
 */

import { julianCenturies, normalizeAngle, degToRad } from './julian';

export type PlanetId = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'rahu' | 'ketu';

export interface PlanetPosition {
  longitude: number;  // Ecliptic longitude (degrees)
  isRetrograde: boolean;
}

interface OrbitalElements {
  L: number[];  // Mean longitude coefficients
  a: number;    // Semi-major axis (AU) — not used for longitude, included for completeness
  e: number[];  // Eccentricity coefficients
  w: number[];  // Longitude of perihelion coefficients
}

const orbitalData: Record<string, OrbitalElements> = {
  mercury: {
    L: [252.250906, 149472.6746358, -0.00000535, 0.000000002],
    a: 0.387098310,
    e: [0.20563175, 0.000020406, -0.0000000284, -0.00000000017],
    w: [77.456119, 1.5564775, 0.00029589, 0.000000056],
  },
  venus: {
    L: [181.979801, 58517.8156760, 0.00000165, -0.000000002],
    a: 0.723329820,
    e: [0.00677188, -0.000047766, 0.0000000975, 0.00000000044],
    w: [131.563707, 1.4022188, -0.00107337, -0.000005195],
  },
  mars: {
    L: [355.433275, 19140.2993313, 0.00000261, -0.000000003],
    a: 1.523679342,
    e: [0.09340062, 0.000090483, -0.0000000806, -0.00000000035],
    w: [336.060234, 1.8410331, 0.00013515, 0.000000318],
  },
  jupiter: {
    L: [34.351484, 3034.9056746, -0.00008501, 0.000000004],
    a: 5.202603191,
    e: [0.04849485, 0.000163244, -0.0000004719, -0.00000000197],
    w: [14.331309, 1.6126668, 0.00103127, -0.000004569],
  },
  saturn: {
    L: [50.077471, 1222.1137943, 0.00021004, -0.000000019],
    a: 9.554909596,
    e: [0.05550862, -0.000346818, -0.0000006456, 0.00000000338],
    w: [93.056787, 1.9637694, 0.00083757, 0.000004899],
  },
};

function polyEval(coeffs: number[], T: number): number {
  let result = 0;
  let Tpow = 1;
  for (const c of coeffs) {
    result += c * Tpow;
    Tpow *= T;
  }
  return result;
}

function getHeliocentricLongitude(planet: string, T: number): number {
  const data = orbitalData[planet];
  const L = normalizeAngle(polyEval(data.L, T));
  const e = polyEval(data.e, T);
  const w = normalizeAngle(polyEval(data.w, T));

  // Mean anomaly
  const M = normalizeAngle(L - w);
  const Mrad = degToRad(M);

  // Equation of center (simplified Kepler)
  const C = (2 * e - e * e * e / 4) * Math.sin(Mrad) * 180 / Math.PI
    + (5 / 4) * e * e * Math.sin(2 * Mrad) * 180 / Math.PI
    + (13 / 12) * e * e * e * Math.sin(3 * Mrad) * 180 / Math.PI;

  return normalizeAngle(L + C);
}

/** Get Earth's heliocentric longitude */
function getEarthLongitude(T: number): number {
  const L = normalizeAngle(100.466449 + 35999.3728519 * T - 0.00000568 * T * T);
  const e = 0.016708634 - 0.000042037 * T;
  const w = normalizeAngle(102.937348 + 1.7195269 * T + 0.00045962 * T * T);
  const M = normalizeAngle(L - w);
  const Mrad = degToRad(M);
  const C = (2 * e) * Math.sin(Mrad) * 180 / Math.PI
    + (5 / 4) * e * e * Math.sin(2 * Mrad) * 180 / Math.PI;
  return normalizeAngle(L + C);
}

/** Convert heliocentric to geocentric longitude (simplified) */
function helioToGeo(planetLon: number, earthLon: number, planetDistance: number, isInner: boolean): number {
  if (isInner) {
    // For inner planets, use elongation-based approximation
    const helioElongation = normalizeAngle(planetLon - earthLon);
    // Simplified geocentric conversion
    const sinElongation = Math.sin(degToRad(helioElongation));
    const cosElongation = Math.cos(degToRad(helioElongation));
    const geoAngle = Math.atan2(
      planetDistance * sinElongation,
      planetDistance * cosElongation - 1.0
    );
    return normalizeAngle(earthLon + 180 + geoAngle * 180 / Math.PI);
  } else {
    // For outer planets, simplified geocentric conversion
    const diff = normalizeAngle(planetLon - earthLon);
    const parallax = Math.asin(Math.sin(degToRad(diff)) / planetDistance) * 180 / Math.PI;
    return normalizeAngle(planetLon - parallax);
  }
}

/** Mean lunar node (Rahu) */
function getMeanNode(T: number): number {
  return normalizeAngle(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441.0);
}

export function getPlanetPosition(planet: PlanetId, jd: number): PlanetPosition {
  const T = julianCenturies(jd);

  if (planet === 'rahu') {
    return { longitude: getMeanNode(T), isRetrograde: true }; // Rahu always retrograde (mean node)
  }

  if (planet === 'ketu') {
    return { longitude: normalizeAngle(getMeanNode(T) + 180), isRetrograde: true };
  }

  const earthLon = getEarthLongitude(T);
  const planetLon = getHeliocentricLongitude(planet, T);

  const isInner = planet === 'mercury' || planet === 'venus';
  const distances: Record<string, number> = {
    mercury: 0.387, venus: 0.723, mars: 1.524, jupiter: 5.203, saturn: 9.537,
  };

  const geoLon = helioToGeo(planetLon, earthLon, distances[planet], isInner);

  // Check retrograde: compare position with a small time step
  const T2 = julianCenturies(jd + 1);
  const earthLon2 = getEarthLongitude(T2);
  const planetLon2 = getHeliocentricLongitude(planet, T2);
  const geoLon2 = helioToGeo(planetLon2, earthLon2, distances[planet], isInner);

  let diff = geoLon2 - geoLon;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return {
    longitude: geoLon,
    isRetrograde: diff < 0,
  };
}

export function getAllPlanetPositions(jd: number): Record<PlanetId, PlanetPosition> {
  const planets: PlanetId[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu'];
  const result = {} as Record<PlanetId, PlanetPosition>;
  for (const p of planets) {
    result[p] = getPlanetPosition(p, jd);
  }
  return result;
}

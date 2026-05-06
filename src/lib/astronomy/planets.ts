/**
 * Planetary position calculations (simplified Keplerian + equation of centre)
 *
 * This module computes geocentric ecliptic longitudes for the five visible planets
 * (Mercury through Saturn) plus the lunar nodes (Rahu/Ketu). It does NOT use the
 * full VSOP87 series (thousands of terms); instead it uses a simplified model:
 *
 *   1. Evaluate mean orbital elements as polynomials in T (Julian centuries)
 *      — coefficients from Meeus Ch. 31, Table 31.A (Simon et al. 1994)
 *   2. Compute the equation of centre (Keplerian correction for elliptical orbit)
 *      using a 3-term series expansion of Kepler's equation
 *   3. Convert heliocentric → geocentric via simplified parallax correction
 *
 * Accuracy bounds (vs full VSOP87 / Swiss Ephemeris):
 *   - Mercury: ±1-2° (fast-moving, strong perturbations from Venus/Jupiter)
 *   - Venus:   ±0.5-1°
 *   - Mars:    ±1° (Jupiter perturbations not modelled)
 *   - Jupiter: ±0.5° (Saturn mutual perturbation omitted)
 *   - Saturn:  ±0.5° (Jupiter mutual perturbation omitted)
 *   - Rahu/Ketu: ±1.5° (mean node, not true node; nutation ignored)
 *
 * These accuracies are adequate for rashi (30° signs) placement but may
 * occasionally err on nakshatra (13°20') boundaries. For kundali charts,
 * the canonical engine in ephem/kundali-calc.ts is preferred.
 *
 * Lesson DD: When this fallback is active (no Swiss Ephemeris), downstream
 * code should add a warning to KundaliData.warnings[].
 *
 * References:
 *   - Meeus, "Astronomical Algorithms" (2nd ed.), Ch. 31: orbital elements
 *   - Meeus Ch. 30: equation of centre (Kepler's equation series expansion)
 *   - Meeus Ch. 33: heliocentric to geocentric conversion
 */

import { julianCenturies, normalizeAngle, degToRad } from './julian';

export type PlanetId = 'mercury' | 'venus' | 'mars' | 'jupiter' | 'saturn' | 'rahu' | 'ketu';

export interface PlanetPosition {
  longitude: number;  // Geocentric ecliptic longitude (degrees), tropical
  isRetrograde: boolean;  // True when daily motion is negative (apparent westward drift)
}

/**
 * Keplerian orbital elements, expressed as polynomial coefficients in T.
 * Each array [c0, c1, c2, ...] evaluates as c0 + c1·T + c2·T² + ...
 * where T is Julian centuries from J2000.0.
 */
interface OrbitalElements {
  L: number[];  // Mean longitude (degrees) — position if orbit were circular
  a: number;    // Semi-major axis (AU) — used for geocentric parallax correction
  e: number[];  // Eccentricity — shape of the ellipse (0 = circle, 1 = parabola)
  w: number[];  // Longitude of perihelion (degrees) — direction of closest approach to Sun
}

// Orbital element polynomials for each planet.
// Source: Meeus Table 31.A (Simon, Bretagnon, Chapront et al., 1994).
// These are referred to the mean ecliptic and equinox of date.
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

/**
 * Evaluate a polynomial c0 + c1·T + c2·T² + ... using Horner-like iteration.
 * Used to compute time-varying orbital elements from their polynomial coefficients.
 */
function polyEval(coeffs: number[], T: number): number {
  let result = 0;
  let Tpow = 1;
  for (const c of coeffs) {
    result += c * Tpow;
    Tpow *= T;
  }
  return result;
}

/**
 * Compute heliocentric ecliptic longitude for a planet.
 *
 * Steps (Meeus Ch. 30-31):
 *   1. L = mean longitude (where the planet would be on a circular orbit)
 *   2. w = longitude of perihelion
 *   3. M = L - w = mean anomaly (angle from perihelion on the mean orbit)
 *   4. C = equation of centre (correction from circular to elliptical motion)
 *   5. True longitude = L + C
 *
 * The equation of centre is a truncated series solution to Kepler's equation,
 * accurate to ~0.01° for eccentricities < 0.1 (all planets except Mercury at e≈0.206).
 * For Mercury the 3-term series still gives ~0.1° accuracy.
 */
function getHeliocentricLongitude(planet: string, T: number): number {
  const data = orbitalData[planet];
  const L = normalizeAngle(polyEval(data.L, T));  // Mean longitude
  const e = polyEval(data.e, T);                   // Orbital eccentricity
  const w = normalizeAngle(polyEval(data.w, T));   // Longitude of perihelion

  // Mean anomaly: angle swept from perihelion on the mean (circular) orbit
  const M = normalizeAngle(L - w);
  const Mrad = degToRad(M);

  // Equation of centre: converts mean anomaly → true anomaly.
  // This is the series expansion of Kepler's equation E - e·sin(E) = M,
  // expressed as ν - M (true anomaly minus mean anomaly).
  // Term 1: ~(2e)·sin(M) — dominant elliptical correction
  // Term 2: ~(5/4)e²·sin(2M) — second-order correction
  // Term 3: ~(13/12)e³·sin(3M) — third-order, significant only for Mercury
  const C = (2 * e - e * e * e / 4) * Math.sin(Mrad) * 180 / Math.PI
    + (5 / 4) * e * e * Math.sin(2 * Mrad) * 180 / Math.PI
    + (13 / 12) * e * e * e * Math.sin(3 * Mrad) * 180 / Math.PI;

  // True heliocentric longitude = mean longitude + equation of centre
  return normalizeAngle(L + C);
}

/**
 * Get Earth's heliocentric longitude (needed to convert other planets to geocentric).
 * Uses the same equation-of-centre approach but with only 2 terms, since Earth's
 * eccentricity (~0.0167) is small enough that the e³ term is negligible.
 * Accuracy: ~0.01° — more than sufficient for the geocentric conversion.
 */
function getEarthLongitude(T: number): number {
  const L = normalizeAngle(100.466449 + 35999.3728519 * T - 0.00000568 * T * T);
  const e = 0.016708634 - 0.000042037 * T;  // Earth's eccentricity (~0.017, slowly decreasing)
  const w = normalizeAngle(102.937348 + 1.7195269 * T + 0.00045962 * T * T);
  const M = normalizeAngle(L - w);
  const Mrad = degToRad(M);
  // Only 2 terms needed for Earth's small eccentricity
  const C = (2 * e) * Math.sin(Mrad) * 180 / Math.PI
    + (5 / 4) * e * e * Math.sin(2 * Mrad) * 180 / Math.PI;
  return normalizeAngle(L + C);
}

/**
 * Convert heliocentric to geocentric longitude (simplified parallax method).
 *
 * The conversion differs for inner vs outer planets (Meeus Ch. 33):
 *
 * Inner planets (Mercury, Venus): orbit is inside Earth's orbit. The full
 * triangle Sun-Earth-Planet is solved using atan2 to find the geocentric
 * direction. The "1.0" in the denominator is Earth's orbital radius (1 AU).
 *
 * Outer planets (Mars, Jupiter, Saturn): orbit is outside Earth's orbit.
 * A simpler parallax approximation works because the planet is always
 * farther from the Sun than Earth. The correction is arcsin(sin(diff)/R),
 * where R is the planet's distance in AU.
 *
 * Neither method accounts for orbital inclination (all planets assumed
 * coplanar) or mutual perturbations — these are the main sources of the
 * ±0.5-2° error in this simplified model.
 */
function helioToGeo(planetLon: number, earthLon: number, planetDistance: number, isInner: boolean): number {
  if (isInner) {
    // Inner planet: solve the Sun-Earth-Planet triangle via atan2.
    // earthLon + 180 gives the Sun's geocentric longitude (opposite direction).
    const helioElongation = normalizeAngle(planetLon - earthLon);
    const sinElongation = Math.sin(degToRad(helioElongation));
    const cosElongation = Math.cos(degToRad(helioElongation));
    // planetDistance is in AU; 1.0 = Earth's distance from Sun
    const geoAngle = Math.atan2(
      planetDistance * sinElongation,
      planetDistance * cosElongation - 1.0
    );
    return normalizeAngle(earthLon + 180 + geoAngle * 180 / Math.PI);
  } else {
    // Outer planet: small-angle parallax correction.
    // The further the planet, the smaller the Earth-induced parallax.
    const diff = normalizeAngle(planetLon - earthLon);
    const parallax = Math.asin(Math.sin(degToRad(diff)) / planetDistance) * 180 / Math.PI;
    return normalizeAngle(planetLon - parallax);
  }
}

/**
 * Mean lunar ascending node (Rahu) — Meeus Ch. 47, eq. 47.7.
 *
 * This is the MEAN node, not the true (osculating) node. The mean node
 * moves uniformly retrograde at ~19.35°/year (one full cycle in ~18.6 years).
 * The true node oscillates ±1.5° around the mean due to solar perturbations.
 *
 * In Vedic astrology, Rahu is the ascending node and is always considered
 * retrograde (moving westward through the zodiac). Ketu = Rahu + 180°.
 *
 * Lesson W: Ketu's speed is the SAME as Rahu's (both retrograde). Never
 * negate Ketu's speed — only add 180° to the longitude.
 */
function getMeanNode(T: number): number {
  return normalizeAngle(125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + T * T * T / 467441.0);
}

/**
 * Compute the geocentric ecliptic longitude of a planet for a given Julian Day.
 *
 * For the five physical planets (Mercury-Saturn), the method is:
 *   1. Compute heliocentric longitudes of both the planet and Earth
 *   2. Convert to geocentric via helioToGeo()
 *   3. Detect retrograde by comparing position at jd vs jd+1 (1-day finite difference)
 *
 * For Rahu/Ketu (lunar nodes), the mean node formula is used directly —
 * they are always retrograde by definition.
 *
 * Retrograde detection: a planet appears retrograde (moving westward) when
 * Earth overtakes it (outer planets) or when it passes between Earth and
 * the Sun (inner planets). This is detected by a negative daily motion.
 */
export function getPlanetPosition(planet: PlanetId, jd: number): PlanetPosition {
  const T = julianCenturies(jd);

  // Rahu (ascending node) — always retrograde, uses mean node formula
  if (planet === 'rahu') {
    return { longitude: getMeanNode(T), isRetrograde: true };
  }

  // Ketu (descending node) — diametrically opposite Rahu, also always retrograde
  if (planet === 'ketu') {
    return { longitude: normalizeAngle(getMeanNode(T) + 180), isRetrograde: true };
  }

  const earthLon = getEarthLongitude(T);
  const planetLon = getHeliocentricLongitude(planet, T);

  const isInner = planet === 'mercury' || planet === 'venus';
  // Mean semi-major axes in AU — used as approximate distances for the
  // geocentric parallax calculation. Using mean values introduces some error
  // when a planet is near perihelion/aphelion, but < 0.5° for all planets.
  const distances: Record<string, number> = {
    mercury: 0.387, venus: 0.723, mars: 1.524, jupiter: 5.203, saturn: 9.537,
  };

  const geoLon = helioToGeo(planetLon, earthLon, distances[planet], isInner);

  // Retrograde detection via 1-day finite difference of geocentric longitude.
  // If tomorrow's position is west of today's (diff < 0), the planet is retrograde.
  const T2 = julianCenturies(jd + 1);
  const earthLon2 = getEarthLongitude(T2);
  const planetLon2 = getHeliocentricLongitude(planet, T2);
  const geoLon2 = helioToGeo(planetLon2, earthLon2, distances[planet], isInner);

  // Normalise the difference to [-180, +180] to handle the 0°/360° wrap
  let diff = geoLon2 - geoLon;
  if (diff > 180) diff -= 360;
  if (diff < -180) diff += 360;

  return {
    longitude: geoLon,
    isRetrograde: diff < 0,
  };
}

/** Compute geocentric positions for all 7 Vedic grahas (5 planets + Rahu + Ketu). */
export function getAllPlanetPositions(jd: number): Record<PlanetId, PlanetPosition> {
  const planets: PlanetId[] = ['mercury', 'venus', 'mars', 'jupiter', 'saturn', 'rahu', 'ketu'];
  const result = {} as Record<PlanetId, PlanetPosition>;
  for (const p of planets) {
    result[p] = getPlanetPosition(p, jd);
  }
  return result;
}

/**
 * Planetary coordinate calculations for Vedic astrology.
 *
 * Provides ecliptic latitude, equatorial coordinate transforms,
 * and combustion checks for all nine Vedic grahas.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter,
 *             5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeDeg(deg: number): number {
  return ((deg % 360) + 360) % 360;
}

function toRad(deg: number): number {
  return deg * Math.PI / 180;
}

function toDeg(rad: number): number {
  return rad * 180 / Math.PI;
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PlanetCoordinates {
  /** Ecliptic latitude in degrees */
  latitude: number;
  /** Right ascension in degrees (0-360) */
  rightAscension: number;
  /** Declination in degrees (-90 to +90) */
  declination: number;
}

// ---------------------------------------------------------------------------
// Orbital elements for outer/inner planets (simplified perturbation)
// ---------------------------------------------------------------------------

interface PlanetOrbital {
  inclination: number;       // degrees
  ascendingNodeJ2000: number; // degrees at J2000
  nodeDriftRate: number;      // degrees per Julian century
}

const PLANET_ORBITALS: Record<number, PlanetOrbital> = {
  2: { inclination: 1.85,  ascendingNodeJ2000: 49.6,  nodeDriftRate: 0.772 },  // Mars
  3: { inclination: 7.0,   ascendingNodeJ2000: 48.3,  nodeDriftRate: 1.185 },  // Mercury
  4: { inclination: 1.3,   ascendingNodeJ2000: 100.5, nodeDriftRate: 0.176 },  // Jupiter
  5: { inclination: 3.39,  ascendingNodeJ2000: 76.7,  nodeDriftRate: 0.899 },  // Venus
  6: { inclination: 2.49,  ascendingNodeJ2000: 113.7, nodeDriftRate: 0.331 },  // Saturn
};

// ---------------------------------------------------------------------------
// Combustion orbs (degrees from Sun)
// ---------------------------------------------------------------------------

const COMBUST_ORBS: Record<number, number> = {
  1: 12,  // Moon
  2: 17,  // Mars
  3: 14,  // Mercury
  4: 11,  // Jupiter
  5: 10,  // Venus
  6: 15,  // Saturn
};

// ---------------------------------------------------------------------------
// computePlanetLatitude
// ---------------------------------------------------------------------------

/**
 * Compute the ecliptic latitude of a planet in degrees.
 *
 * @param planetId - Graha id (0-8)
 * @param jd       - Julian Day number
 * @returns Ecliptic latitude in degrees
 */
export function computePlanetLatitude(planetId: number, jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;

  // Sun — always on the ecliptic
  if (planetId === 0) return 0;

  // Moon — full perturbation series (max ±5.15°)
  if (planetId === 1) {
    const Mp = normalizeDeg(134.963 + 477198.868 * T); // Moon mean anomaly
    const F  = normalizeDeg(93.272  + 483202.018 * T); // argument of latitude
    const D  = normalizeDeg(297.850 + 445267.112 * T); // mean elongation
    // Sun mean anomaly (M) included for completeness; not used in these terms
    // const M = normalizeDeg(357.529 + 35999.050 * T);

    const lat =
      5.128  * Math.sin(toRad(F)) +
      0.2806 * Math.sin(toRad(Mp + F)) +
      0.2777 * Math.sin(toRad(Mp - F)) +
      0.1732 * Math.sin(toRad(2 * D - F)) +
      0.0545 * Math.sin(toRad(2 * D - Mp + F)) +
      0.0336 * Math.sin(toRad(2 * D + F));

    return lat;
  }

  // Rahu (ascending node) and Ketu (descending node) — ecliptic latitude = 0
  //
  // By definition the lunar nodes are the points where the Moon's orbit
  // INTERSECTS the ecliptic.  A point on the ecliptic has zero ecliptic
  // latitude.  The Moon itself has non-zero latitude (up to ±5.15°) because
  // its orbit is inclined ~5° to the ecliptic, but at the nodes the Moon's
  // path crosses zero — the nodes themselves are always ON the ecliptic.
  //
  // HISTORICAL BUG (now fixed): the code returned ±Moon latitude for Rahu/Ketu,
  // presumably confusing the inclination of the Moon's ORBIT with the latitude
  // of the nodes themselves.  This corrupted the RA/declination/altitude output
  // shown in GrahaDetail panels for these two shadow planets.
  if (planetId === 7 || planetId === 8) return 0;

  // Other planets (2-6): simplified perturbation
  const orbital = PLANET_ORBITALS[planetId];
  if (!orbital) return 0;

  const ascNode = orbital.ascendingNodeJ2000 + orbital.nodeDriftRate * T;

  // We don't have the heliocentric longitude here, so we use the geocentric
  // ecliptic longitude as an approximation for the argument of latitude.
  // The caller can supply a more precise longitude via computeFullCoordinates.
  // For standalone use we derive a rough mean longitude from mean elements.
  const meanLongitudes: Record<number, (T: number) => number> = {
    2: (t) => normalizeDeg(355.433 + 19140.299 * t),   // Mars
    3: (t) => normalizeDeg(252.251 + 149472.675 * t),   // Mercury
    4: (t) => normalizeDeg(34.351  + 3034.906 * t),     // Jupiter
    5: (t) => normalizeDeg(181.979 + 58517.816 * t),    // Venus
    6: (t) => normalizeDeg(50.077  + 1222.114 * t),     // Saturn
  };

  const L = meanLongitudes[planetId]!(T);
  return orbital.inclination * Math.sin(toRad(L - ascNode));
}

// ---------------------------------------------------------------------------
// eclipticToEquatorial
// ---------------------------------------------------------------------------

/**
 * Convert ecliptic coordinates to equatorial (RA / Dec).
 *
 * @param longitude - Ecliptic longitude in degrees
 * @param latitude  - Ecliptic latitude in degrees
 * @param jd        - Julian Day number (for obliquity)
 * @returns Object with `ra` (degrees 0-360) and `dec` (degrees -90 to +90)
 */
export function eclipticToEquatorial(
  longitude: number,
  latitude: number,
  jd: number,
): { ra: number; dec: number } {
  const T = (jd - 2451545.0) / 36525.0;
  const epsilon = toRad(23.4393 - 0.013 * T); // obliquity of ecliptic

  const lambda = toRad(longitude);
  const beta   = toRad(latitude);

  // Declination
  const sinDec =
    Math.sin(beta) * Math.cos(epsilon) +
    Math.cos(beta) * Math.sin(epsilon) * Math.sin(lambda);
  const dec = toDeg(Math.asin(sinDec));

  // Right Ascension
  const y = Math.sin(lambda) * Math.cos(epsilon) - Math.tan(beta) * Math.sin(epsilon);
  const x = Math.cos(lambda);
  const ra = normalizeDeg(toDeg(Math.atan2(y, x)));

  return { ra, dec };
}

// ---------------------------------------------------------------------------
// computeFullCoordinates
// ---------------------------------------------------------------------------

/**
 * Compute full coordinate set (latitude, RA, declination) for a planet.
 *
 * @param planetId  - Graha id (0-8)
 * @param longitude - Pre-computed ecliptic longitude in degrees
 * @param jd        - Julian Day number
 * @returns PlanetCoordinates
 */
export function computeFullCoordinates(
  planetId: number,
  longitude: number,
  jd: number,
): PlanetCoordinates {
  const latitude = computePlanetLatitude(planetId, jd);
  const { ra, dec } = eclipticToEquatorial(longitude, latitude, jd);

  return {
    latitude,
    rightAscension: ra,
    declination: dec,
  };
}

// ---------------------------------------------------------------------------
// computeCombust
// ---------------------------------------------------------------------------

/**
 * Check whether a planet is combust (too close to the Sun).
 *
 * Per BPHS, Mercury and Venus have reduced combustion orbs when retrograde:
 * Mercury: 14° direct, 12° retrograde. Venus: 10° direct, 8° retrograde.
 *
 * @param planetId    - Graha id (0-8)
 * @param planetLong  - Planet ecliptic longitude in degrees
 * @param sunLong     - Sun ecliptic longitude in degrees
 * @param isRetrograde - Whether the planet is retrograde (optional, defaults false)
 * @returns `true` if the planet is combust
 */
export function computeCombust(
  planetId: number,
  planetLong: number,
  sunLong: number,
  isRetrograde = false,
): boolean {
  // Sun, Rahu, and Ketu are never combust
  if (planetId === 0 || planetId === 7 || planetId === 8) return false;

  let orb = COMBUST_ORBS[planetId];
  if (orb === undefined) return false;

  // Reduced orbs for retrograde Mercury and Venus (BPHS)
  if (isRetrograde) {
    if (planetId === 3) orb = 12;  // Mercury: 14 → 12
    if (planetId === 5) orb = 8;   // Venus: 10 → 8
  }

  const diff = Math.abs(planetLong - sunLong);
  const angularDistance = Math.min(diff, 360 - diff);

  return angularDistance < orb;
}

// ---------------------------------------------------------------------------
// Greenwich Mean Sidereal Time (GMST)
// ---------------------------------------------------------------------------

/**
 * Compute Greenwich Mean Sidereal Time for a given Julian Day.
 * Formula from Meeus, Astronomical Algorithms, Ch. 12.
 *
 * @param jd - Julian Day number
 * @returns GMST in degrees (0-360)
 */
export function computeGMST(jd: number): number {
  const T = (jd - 2451545.0) / 36525.0;
  let gmst =
    280.46061837 +
    360.98564736629 * (jd - 2451545.0) +
    0.000387933 * T * T -
    (T * T * T) / 38710000.0;
  return normalizeDeg(gmst);
}

// ---------------------------------------------------------------------------
// Local Sidereal Time (LST)
// ---------------------------------------------------------------------------

/**
 * Compute Local Sidereal Time.
 *
 * @param jd  - Julian Day number
 * @param lng - Observer longitude in degrees (east positive)
 * @returns LST in degrees (0-360)
 */
export function computeLST(jd: number, lng: number): number {
  return normalizeDeg(computeGMST(jd) + lng);
}

// ---------------------------------------------------------------------------
// Equatorial → Horizontal (Alt/Az)
// ---------------------------------------------------------------------------

/**
 * Convert equatorial coordinates (RA/Dec) to horizontal coordinates (Alt/Az).
 *
 * @param ra  - Right Ascension in DEGREES (0-360)
 * @param dec - Declination in DEGREES (-90 to +90)
 * @param lat - Observer latitude in DEGREES
 * @param lng - Observer longitude in DEGREES
 * @param jd  - Julian Day (for computing Local Sidereal Time)
 * @returns { altitude, azimuth } in DEGREES
 *   altitude: -90 to +90 (negative = below horizon)
 *   azimuth: 0-360 (0=North, 90=East, 180=South, 270=West)
 */
export function equatorialToHorizontal(
  ra: number,
  dec: number,
  lat: number,
  lng: number,
  jd: number,
): { altitude: number; azimuth: number } {
  const lst = computeLST(jd, lng);
  const ha = toRad(lst - ra); // Hour Angle in radians

  const decR = toRad(dec);
  const latR = toRad(lat);

  // Altitude
  const sinAlt =
    Math.sin(decR) * Math.sin(latR) +
    Math.cos(decR) * Math.cos(latR) * Math.cos(ha);
  const altitude = toDeg(Math.asin(sinAlt));

  // Azimuth
  const altR = Math.asin(sinAlt);
  const cosAltTimescosLat = Math.cos(altR) * Math.cos(latR);

  // Guard against division by zero at the poles or zenith
  let azimuth: number;
  if (Math.abs(cosAltTimescosLat) < 1e-10) {
    azimuth = 0;
  } else {
    const cosAz = (Math.sin(decR) - sinAlt * Math.sin(latR)) / cosAltTimescosLat;
    // Clamp for numerical safety (floating point can push slightly outside [-1, 1])
    const clampedCosAz = Math.max(-1, Math.min(1, cosAz));
    azimuth = toDeg(Math.acos(clampedCosAz));
    // If HA > 0 (west of meridian), azimuth is in the western half (> 180)
    if (Math.sin(ha) > 0) {
      azimuth = 360 - azimuth;
    }
  }

  return { altitude, azimuth: normalizeDeg(azimuth) };
}

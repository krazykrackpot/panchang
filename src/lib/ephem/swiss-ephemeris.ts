/**
 * Swiss Ephemeris Integration — Sub-arcsecond planetary positions
 * Replaces Meeus algorithms for Sun, Moon, and all planets.
 * Uses the 'sweph' npm package (Swiss Ephemeris Node.js binding).
 *
 * Accuracy: < 0.001° for all planets (vs Meeus: Sun ~0.01°, Moon ~0.5°, Mars ~22°)
 * Time range: 5400 BC to 5400 AD
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sweph: any = null;
let swephChecked = false;

function getSweph() {
  if (swephChecked) return sweph;
  swephChecked = true;

  // Only load on server side (Node.js), never in browser
  if (typeof window !== 'undefined') return null;

  try {
    // Dynamic require to avoid Turbopack bundling the native module
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    sweph = eval('require')('sweph');
    sweph.set_sid_mode(sweph.constants.SE_SIDM_LAHIRI, 0, 0);
  } catch {
    sweph = null;
  }
  return sweph;
}

export function isSwissEphAvailable(): boolean {
  return getSweph() !== null;
}

/**
 * Convert Gregorian date + UT hour to Julian Day Number
 */
export function swissJulDay(year: number, month: number, day: number, utHour: number = 0): number {
  const se = getSweph();
  if (!se) return 0;
  return se.julday(year, month, day, utHour, se.constants.SE_GREG_CAL);
}

/**
 * Get Lahiri ayanamsha for a given JD
 */
export function swissAyanamsha(jd: number): number {
  const se = getSweph();
  if (!se) return 0;
  se.set_sid_mode(se.constants.SE_SIDM_LAHIRI, 0, 0);
  return se.get_ayanamsa_ut(jd);
}

/**
 * Get tropical longitude for a planet at a given JD
 * Returns degrees (0-360)
 */
export function swissPlanetLongitude(jd: number, planetId: number): {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
} {
  const se = getSweph();
  if (!se) return { longitude: 0, latitude: 0, distance: 0, speed: 0 };

  const PLANET_MAP: Record<number, number> = {
    0: se.constants.SE_SUN,
    1: se.constants.SE_MOON,
    2: se.constants.SE_MARS,
    3: se.constants.SE_MERCURY,
    4: se.constants.SE_JUPITER,
    5: se.constants.SE_VENUS,
    6: se.constants.SE_SATURN,
    7: se.constants.SE_MEAN_NODE,  // Rahu (mean node)
    8: se.constants.SE_MEAN_NODE,  // Ketu (calculated as Rahu + 180)
  };

  const sePlanet = PLANET_MAP[planetId];
  if (sePlanet === undefined) return { longitude: 0, latitude: 0, distance: 0, speed: 0 };

  const flags = se.constants.SEFLG_SWIEPH | se.constants.SEFLG_SPEED;
  const result = se.calc_ut(jd, sePlanet, flags);

  let longitude = result.data[0];
  const latitude = result.data[1];
  const distance = result.data[2];
  let speed = result.data[3];

  // Ketu = Rahu + 180
  if (planetId === 8) {
    longitude = (longitude + 180) % 360;
    speed = -speed; // Ketu moves opposite to Rahu's reported speed
  }

  return { longitude, latitude, distance, speed };
}

/**
 * Get sidereal longitude for a planet (tropical - ayanamsha)
 */
export function swissSiderealLongitude(jd: number, planetId: number): number {
  const trop = swissPlanetLongitude(jd, planetId);
  const ayan = swissAyanamsha(jd);
  return ((trop.longitude - ayan) % 360 + 360) % 360;
}

/**
 * Get all planetary positions at once (optimized: single ayanamsha calc)
 */
export function swissAllPlanets(jd: number): {
  planets: { id: number; tropical: number; sidereal: number; latitude: number; speed: number; isRetrograde: boolean }[];
  ayanamsha: number;
} | null {
  const se = getSweph();
  if (!se) return null;

  const ayan = swissAyanamsha(jd);
  const planets: { id: number; tropical: number; sidereal: number; latitude: number; speed: number; isRetrograde: boolean }[] = [];

  for (let id = 0; id <= 8; id++) {
    const pos = swissPlanetLongitude(jd, id);
    const sidereal = ((pos.longitude - ayan) % 360 + 360) % 360;
    planets.push({
      id,
      tropical: pos.longitude,
      sidereal,
      latitude: pos.latitude,
      speed: pos.speed,
      isRetrograde: id !== 7 && id !== 8 && pos.speed < 0,  // Rahu/Ketu always retrograde
    });
  }

  // Rahu/Ketu are naturally retrograde
  const rahu = planets.find(p => p.id === 7);
  if (rahu) rahu.isRetrograde = true;
  const ketu = planets.find(p => p.id === 8);
  if (ketu) ketu.isRetrograde = true;

  return { planets, ayanamsha: ayan };
}

/**
 * Compute sunrise for a given JD and location using Swiss Ephemeris
 */
export function swissSunrise(jd: number, lat: number, lng: number): number {
  const se = getSweph();
  if (!se) return 6.0; // fallback

  try {
    // Use swe_rise_trans for precise sunrise
    const result = se.rise_trans(
      jd,
      se.constants.SE_SUN,
      0, // star name (empty)
      se.constants.SE_CALC_RISE | se.constants.SE_BIT_DISC_CENTER,
      [lng, lat, 0], // geopos: [lng, lat, altitude]
      0, // atmospheric pressure
      0, // atmospheric temperature
    );
    if (result && result.data) {
      return result.data; // JD of sunrise
    }
  } catch {
    // Fallback: approximate
  }
  return jd + (6.0 / 24.0); // rough fallback
}

/**
 * Compute sunset for a given JD and location
 */
export function swissSunset(jd: number, lat: number, lng: number): number {
  const se = getSweph();
  if (!se) return 18.0; // fallback

  try {
    const result = se.rise_trans(
      jd,
      se.constants.SE_SUN,
      0,
      se.constants.SE_CALC_SET | se.constants.SE_BIT_DISC_CENTER,
      [lng, lat, 0],
      0,
      0,
    );
    if (result && result.data) {
      return result.data;
    }
  } catch {
    // Fallback
  }
  return jd + (18.0 / 24.0);
}

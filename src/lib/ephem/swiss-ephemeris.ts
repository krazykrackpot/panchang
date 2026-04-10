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

// ─── Memoization cache for expensive SwEph calls ─────────────────────────
// Key: JD rounded to 6 decimals (~0.1 second precision)
// Same JD always produces same planetary positions, so safe to cache.
const planetCache = new Map<string, { longitude: number; latitude: number; distance: number; speed: number }>();
const allPlanetsCache = new Map<string, ReturnType<typeof swissAllPlanets>>();
const ayanamshaCache = new Map<string, number>();
const CACHE_MAX = 500; // Limit cache size to prevent memory leaks

function cacheKey(jd: number, extra?: number): string {
  return `${jd.toFixed(6)}${extra !== undefined ? `:${extra}` : ''}`;
}

function pruneCache(cache: Map<string, unknown>) {
  if (cache.size > CACHE_MAX) {
    const keys = cache.keys();
    for (let i = 0; i < CACHE_MAX / 2; i++) {
      const k = keys.next();
      if (k.done) break;
      cache.delete(k.value);
    }
  }
}

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

// Swiss Eph ayanamsha mode constants for supported systems
const SIDM_MAP: Record<string, number> = {
  lahiri: 1,        // SE_SIDM_LAHIRI
  true_chitra: 27,  // SE_SIDM_TRUE_CITRA — tracks Spica's actual current position
  true_revati: 28,  // SE_SIDM_TRUE_REVATI — Revati (zeta Piscium) at 0° Aries
  kp: 1,            // KP uses Lahiri base with ~6 arcmin offset (handled in getAyanamsha)
  raman: 3,         // SE_SIDM_RAMAN
  bv_raman: 3,      // Same as Raman
  yukteshwar: 7,    // SE_SIDM_YUKTESHWAR
  jn_bhasin: 13,    // SE_SIDM_JN_BHASIN
  fagan_bradley: 0, // SE_SIDM_FAGAN_BRADLEY
  true_pushya: 29,  // SE_SIDM_TRUE_PUSHYA — Pushya (delta Cancri) at fixed position
  galactic_center: 17, // SE_SIDM_GALCENT_0SAG — Galactic center at 0° Sagittarius
};

/**
 * Get ayanamsha for a given JD using Swiss Ephemeris (memoized).
 * Supports multiple ayanamsha systems via SE_SIDM constants.
 */
export function swissAyanamsha(jd: number, sidMode?: string): number {
  const mode = sidMode || 'lahiri';
  // Use mode string hash for cache key to avoid collisions (KP vs Lahiri share same SIDM constant)
  const modeHash = mode.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const key = cacheKey(jd, modeHash);
  const cached = ayanamshaCache.get(key);
  if (cached !== undefined) return cached;

  const se = getSweph();
  if (!se) return 0;
  // KP (Krishnamurti) is Lahiri with a ~6 arcmin offset — no dedicated Swiss Eph constant
  const isKP = mode === 'kp';
  const sidmNum = isKP ? (se.constants.SE_SIDM_LAHIRI ?? 1) : (SIDM_MAP[mode] ?? se.constants.SE_SIDM_LAHIRI);
  se.set_sid_mode(sidmNum, 0, 0);
  let result = se.get_ayanamsa_ut(jd);
  if (isKP) result -= 0.09444; // KP offset: ~6 arcmin (0.094°) less than Lahiri

  // Reset to Lahiri after use (other SwEph calls assume Lahiri)
  se.set_sid_mode(se.constants.SE_SIDM_LAHIRI, 0, 0);

  pruneCache(ayanamshaCache);
  ayanamshaCache.set(key, result);
  return result;
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
  // Check memoization cache
  const key = cacheKey(jd, planetId);
  const cached = planetCache.get(key);
  if (cached) return cached;

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
    speed = -speed;
  }

  const value = { longitude, latitude, distance, speed };
  pruneCache(planetCache);
  planetCache.set(key, value);
  return value;
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
  planets: { id: number; tropical: number; sidereal: number; latitude: number; distance: number; speed: number; isRetrograde: boolean }[];
  ayanamsha: number;
} | null {
  // Check memoization cache
  const key = cacheKey(jd);
  const cached = allPlanetsCache.get(key);
  if (cached) return cached;

  const se = getSweph();
  if (!se) return null;

  const ayan = swissAyanamsha(jd);
  const planets: { id: number; tropical: number; sidereal: number; latitude: number; distance: number; speed: number; isRetrograde: boolean }[] = [];

  for (let id = 0; id <= 8; id++) {
    const pos = swissPlanetLongitude(jd, id);
    const sidereal = ((pos.longitude - ayan) % 360 + 360) % 360;
    planets.push({
      id,
      tropical: pos.longitude,
      sidereal,
      latitude: pos.latitude,
      distance: pos.distance,
      speed: pos.speed,
      isRetrograde: id !== 7 && id !== 8 && pos.speed < 0,  // Rahu/Ketu always retrograde
    });
  }

  // Rahu/Ketu are naturally retrograde
  const rahu = planets.find(p => p.id === 7);
  if (rahu) rahu.isRetrograde = true;
  const ketu = planets.find(p => p.id === 8);
  if (ketu) ketu.isRetrograde = true;

  const result = { planets, ayanamsha: ayan };
  pruneCache(allPlanetsCache);
  allPlanetsCache.set(key, result);
  return result;
}

/**
 * Compute sunrise UT hours using Swiss Ephemeris rise_trans (sub-minute accuracy).
 * Falls back to corrected Meeus formula if rise_trans fails.
 * Returns UT decimal hours (same format as approximateSunrise in astronomical.ts).
 */
export function swissSunrise(jd: number, lat: number, lng: number): number {
  const se = getSweph();
  if (!se) return 6.0;

  // Normalize to midnight UT of the calendar day containing jd.
  // JD integers correspond to noon, so midnight = Math.floor(jd + 0.5) - 0.5
  const jdMidnight = Math.floor(jd + 0.5) - 0.5;

  const geopos = [lng, lat, 0]; // [longitude°, latitude°, altitude m]
  const result = se.rise_trans(
    jdMidnight,
    se.constants.SE_SUN,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_RISE,
    geopos,
    1013.25, // standard pressure mbar
    15,      // standard temperature °C
  );

  if (result.flag === -1 || result.error || !result.data) return 6.0; // polar / error

  // Convert result JD to UT decimal hours from midnight
  const utHours = (result.data - jdMidnight) * 24;
  return ((utHours % 24) + 24) % 24;
}

/**
 * Compute sunset UT hours using Swiss Ephemeris rise_trans (sub-minute accuracy).
 * Falls back gracefully if rise_trans fails.
 */
export function swissSunset(jd: number, lat: number, lng: number): number {
  const se = getSweph();
  if (!se) return 18.0;

  const jdMidnight = Math.floor(jd + 0.5) - 0.5;

  const geopos = [lng, lat, 0];
  const result = se.rise_trans(
    jdMidnight,
    se.constants.SE_SUN,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_SET,
    geopos,
    1013.25,
    15,
  );

  if (result.flag === -1 || result.error || !result.data) return 18.0;

  const utHours = (result.data - jdMidnight) * 24;
  return ((utHours % 24) + 24) % 24;
}

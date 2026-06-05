import { approximateSunrise, approximateSunset } from './astronomical';

/**
 * Swiss Ephemeris Integration  –  Sub-arcsecond planetary positions
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
  } catch (err) {
    console.error('[sweph] Swiss Ephemeris load failed — falling back to Meeus:', err);
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
  true_chitra: 27,  // SE_SIDM_TRUE_CITRA  –  tracks Spica's actual current position
  true_revati: 28,  // SE_SIDM_TRUE_REVATI  –  Revati (zeta Piscium) at 0° Aries
  kp: 5,            // SE_SIDM_KRISHNAMURTI — sweph's native KP ayanamsha
  raman: 3,         // SE_SIDM_RAMAN
  bv_raman: 3,      // Same as Raman
  yukteshwar: 7,    // SE_SIDM_YUKTESHWAR
  jn_bhasin: 13,    // SE_SIDM_JN_BHASIN
  fagan_bradley: 0, // SE_SIDM_FAGAN_BRADLEY
  true_pushya: 29,  // SE_SIDM_TRUE_PUSHYA  –  Pushya (delta Cancri) at fixed position
  galactic_center: 17, // SE_SIDM_GALCENT_0SAG  –  Galactic center at 0° Sagittarius
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
  // SE_SIDM_KRISHNAMURTI (5) is sweph's native KP ayanamsha. The earlier
  // "Lahiri base − 0.09444° hardcoded" approximation drifted ~0.14 arcmin
  // from sweph's true KP value because the Lahiri↔KP offset varies with
  // time (the two ayanamshas have different polynomial rates).
  const sidmNum = SIDM_MAP[mode] ?? se.constants.SE_SIDM_LAHIRI;
  se.set_sid_mode(sidmNum, 0, 0);
  const result = se.get_ayanamsa_ut(jd);

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
export function swissPlanetLongitude(jd: number, planetId: number, useTrueNode?: boolean): {
  longitude: number;
  latitude: number;
  distance: number;
  speed: number;
} {
  // Check memoization cache  –  include useTrueNode flag to prevent mean-node
  // results being served for true-node requests (or vice versa)
  const key = `${jd.toFixed(6)}_${planetId}${useTrueNode ? '_T' : ''}`;
  const cached = planetCache.get(key);
  if (cached) return cached;

  const se = getSweph();
  if (!se) return { longitude: 0, latitude: 0, distance: 0, speed: 0 };

  // SE_TRUE_NODE includes nutation oscillation (±1.5°); SE_MEAN_NODE is the
  // smooth average path. Most traditional Indian systems use mean node.
  const nodeConstant = useTrueNode ? se.constants.SE_TRUE_NODE : se.constants.SE_MEAN_NODE;
  const PLANET_MAP: Record<number, number> = {
    0: se.constants.SE_SUN,
    1: se.constants.SE_MOON,
    2: se.constants.SE_MARS,
    3: se.constants.SE_MERCURY,
    4: se.constants.SE_JUPITER,
    5: se.constants.SE_VENUS,
    6: se.constants.SE_SATURN,
    7: nodeConstant,  // Rahu (node  –  mean or true per user preference)
    8: nodeConstant,  // Ketu (calculated as Rahu + 180)
  };

  const sePlanet = PLANET_MAP[planetId];
  if (sePlanet === undefined) return { longitude: 0, latitude: 0, distance: 0, speed: 0 };

  const flags = se.constants.SEFLG_SWIEPH | se.constants.SEFLG_SPEED;
  const result = se.calc_ut(jd, sePlanet, flags);

  let longitude = result.data[0];
  const latitude = result.data[1];
  const distance = result.data[2];
  let speed = result.data[3];

  // Ketu = Rahu + 180 (same orbital speed  –  both nodes move retrograde)
  // NOTE: Do NOT negate the speed. Swiss Eph returns mean node speed as negative
  // (~-0.053°/day, retrograde). Ketu shares the same retrograde motion as Rahu,
  // so the speed sign should be preserved, not inverted.
  // HISTORICAL BUG (now fixed): speed was negated, giving Ketu a positive speed
  // (+0.053°/day) despite being retrograde. This caused the GrahaTab UI to show
  // Ketu in normal text color instead of retrograde-red, and any downstream code
  // using speed sign (rather than isRetrograde flag) to get the wrong answer.
  if (planetId === 8) {
    longitude = (longitude + 180) % 360;
    // speed remains unchanged  –  Ketu moves at the same rate and direction as Rahu
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
export function swissAllPlanets(jd: number, useTrueNode?: boolean): {
  planets: { id: number; tropical: number; sidereal: number; latitude: number; distance: number; speed: number; isRetrograde: boolean }[];
  ayanamsha: number;
} | null {
  // Check memoization cache  –  include useTrueNode flag to avoid cross-contamination
  const key = `${jd.toFixed(6)}${useTrueNode ? '_T' : ''}`;
  const cached = allPlanetsCache.get(key);
  if (cached) return cached;

  const se = getSweph();
  if (!se) return null;

  const ayan = swissAyanamsha(jd);
  const planets: { id: number; tropical: number; sidereal: number; latitude: number; distance: number; speed: number; isRetrograde: boolean }[] = [];

  for (let id = 0; id <= 8; id++) {
    const pos = swissPlanetLongitude(jd, id, useTrueNode);
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
/**
 * Compute sunrise using Swiss Ephemeris rise_trans.
 * Returns the Julian Day of sunrise, or null if polar non-rise.
 *
 * @param jd - Julian Day (any time on the target date  –  used to find the right day)
 * @param lat - Geographic latitude
 * @param lng - Geographic longitude
 * @param tzOffset - Timezone offset in hours. Required to search from LOCAL midnight
 *   so that positive-offset zones (IST, CEST) find the right sunrise.
 */
export function swissSunriseJD(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const se = getSweph();
  if (!se) return null;

  // Start search from LOCAL midnight expressed in UT.
  // For IST (5.5): local midnight = UT midnight - 5.5h
  const jdUtMidnight = Math.floor(jd + 0.5) - 0.5;
  const jdSearchStart = jdUtMidnight - tzOffset / 24;

  const geopos = [lng, lat, 0];
  const result = se.rise_trans(
    jdSearchStart,
    se.constants.SE_SUN,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_RISE,
    geopos,
    1013.25,
    15,
  );

  if (result.flag === -1 || result.error || !result.data) return null;
  return result.data;
}

/** Backward-compatible wrapper: returns UT hours from UT midnight of the input JD's day */
export function swissSunrise(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const riseJD = swissSunriseJD(jd, lat, lng, tzOffset);
  if (riseJD === null) return null;
  const jdUtMidnight = Math.floor(jd + 0.5) - 0.5;
  return ((riseJD - jdUtMidnight) * 24 + 24) % 24;
}

/**
 * Compute sunset UT hours using Swiss Ephemeris rise_trans (sub-minute accuracy).
 * Falls back gracefully if rise_trans fails.
 */
export function swissSunset(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const se = getSweph();
  if (!se) return null;

  const jdUtMidnight = Math.floor(jd + 0.5) - 0.5;
  const jdSearchStart = jdUtMidnight - tzOffset / 24;

  const geopos = [lng, lat, 0];
  const result = se.rise_trans(
    jdSearchStart,
    se.constants.SE_SUN,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_SET,
    geopos,
    1013.25,
    15,
  );

  if (result.flag === -1 || result.error || !result.data) return null;

  const utHours = (result.data - jdUtMidnight) * 24;
  return ((utHours % 24) + 24) % 24;
}

/**
 * Compute moonrise UT hours using Swiss Ephemeris rise_trans.
 * Returns UT decimal hours from midnight, or null if moon doesn't rise.
 */
export function swissMoonrise(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const se = getSweph();
  if (!se) return null;

  const jdUtMidnight = Math.floor(jd + 0.5) - 0.5;
  const jdSearchStart = jdUtMidnight - tzOffset / 24;
  const geopos = [lng, lat, 0];
  const result = se.rise_trans(
    jdSearchStart,
    se.constants.SE_MOON,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_RISE,
    geopos,
    1013.25,
    15,
  );

  if (result.flag === -1 || result.error || !result.data) return null;
  const utHours = (result.data - jdUtMidnight) * 24;
  return ((utHours % 24) + 24) % 24;
}

export function swissMoonset(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const se = getSweph();
  if (!se) return null;

  const jdUtMidnight = Math.floor(jd + 0.5) - 0.5;
  const jdSearchStart = jdUtMidnight - tzOffset / 24;
  const geopos = [lng, lat, 0];
  const result = se.rise_trans(
    jdSearchStart,
    se.constants.SE_MOON,
    '',
    se.constants.SEFLG_SWIEPH,
    se.constants.SE_CALC_SET,
    geopos,
    1013.25,
    15,
  );

  if (result.flag === -1 || result.error || !result.data) return null;
  const utHours = (result.data - jdUtMidnight) * 24;
  return ((utHours % 24) + 24) % 24;
}

// ─── Lagna (ascendant) via Swiss Ephemeris ─────────────────────────────────
/**
 * TROPICAL ascendant computed via Swiss Ephemeris (Whole Sign house system).
 *
 * Returns the apparent tropical longitude of the eastern horizon's ecliptic
 * intersection — the same quantity our existing Meeus `calculateAscendant`
 * returns. Callers subtract ayanamsha to obtain sidereal. This keeps the
 * lagna in the same reference frame as our planet positions (apparent
 * tropical − mean Lahiri ayanamsha).
 *
 * Why 'W' (Whole Sign): uses only the ascendant point. Other systems
 * (Placidus / Koch) divide by cos(lat) for quadrant cusps and degenerate
 * at polar latitudes. `houses_ex2` returns the actual astronomical
 * ascendant in `data.points[0]` regardless of the house system; 'W' is
 * just the cheapest mode that survives polar input.
 *
 * Returns null when sweph isn't loaded OR sweph itself fails (genuine pole
 * at |lat| ≥ ~89.5°). Caller decides between Meeus fallback or hard error.
 */
export function swissAscendant(jdUt: number, lat: number, lng: number): number | null {
  const se = getSweph();
  if (!se) return null;

  // No SEFLG_SIDEREAL — we want tropical apparent, matching calculateAscendant's
  // contract. Callers subtract swissAyanamsha(jd) downstream.
  const result = se.houses_ex2(jdUt, 0, lat, lng, 'W');

  if (result.flag < 0) {
    console.error(`[sweph] houses_ex2 failed at lat=${lat.toFixed(4)}° lng=${lng.toFixed(4)}°: ${result.error ?? 'unknown'}`);
    return null;
  }
  const asc = result.data?.points?.[0];
  if (asc == null || !Number.isFinite(asc)) return null;
  return asc;
}

// ─── Placidus house cusps via Swiss Ephemeris ───────────────────────────────
/**
 * 12 Placidus house cusps via Swiss Ephemeris.
 *
 * When `sidMode` is provided we drive sweph in `SEFLG_SIDEREAL` mode so the
 * returned cusps are already sidereal (caller passes `ayanamsha` as 0). When
 * `sidMode` is undefined the cusps come back tropical and the caller is
 * expected to subtract ayanamsha post-hoc — kept for parity with the older
 * subtract-after path until all KP callers migrate.
 *
 * Returns null when sweph isn't loaded OR the Placidus method failed
 * (typically polar latitudes |lat| > 66°33′ where the diurnal-semi-arc
 * trisection has no solution).
 */
const SEFLG_SIDEREAL = 64 * 1024; // 0x10000 — sweph internal constant
export function swissPlacidusCusps(
  jdUt: number,
  lat: number,
  lng: number,
  sidMode?: string,
): number[] | null {
  const se = getSweph();
  if (!se) return null;

  let iflag = 0;
  if (sidMode) {
    const sidmNum = SIDM_MAP[sidMode] ?? se.constants.SE_SIDM_LAHIRI;
    se.set_sid_mode(sidmNum, 0, 0);
    iflag = SEFLG_SIDEREAL;
  }

  const result = se.houses_ex2(jdUt, iflag, lat, lng, 'P');

  if (sidMode) {
    // Restore default Lahiri for the rest of the engine
    se.set_sid_mode(se.constants.SE_SIDM_LAHIRI, 0, 0);
  }

  if (result.flag < 0) {
    console.error(`[sweph] Placidus houses_ex2 failed at lat=${lat.toFixed(4)}° lng=${lng.toFixed(4)}°: ${result.error ?? 'unknown'}`);
    return null;
  }
  const houses = result.data?.houses;
  if (!Array.isArray(houses) || houses.length < 12) return null;
  // sweph returns houses[0..11] = cusps 1..12 (or [1..12] depending on binding).
  // Defend against both conventions: pick whichever produces 12 finite values.
  const fromZero = houses.slice(0, 12);
  if (fromZero.every((v: unknown) => typeof v === 'number' && Number.isFinite(v))) {
    return fromZero;
  }
  const fromOne = houses.slice(1, 13);
  if (fromOne.length === 12 && fromOne.every((v: unknown) => typeof v === 'number' && Number.isFinite(v))) {
    return fromOne;
  }
  return null;
}

// ─── Unified sunrise/sunset entry points (sweph primary, Meeus fallback) ──
/**
 * Sunrise UT hours (0-24) — sweph primary, Meeus fallback when sweph isn't
 * loaded. Returns null when the sun does not rise on this date at this
 * latitude (polar non-rise day). Callers MUST handle null explicitly; there
 * is intentionally no "?? 6" default to avoid silent-failure stamping.
 *
 * Used in place of the old approximateSunriseSafe() across all server paths.
 */
export function sunriseUTHours(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const swiss = swissSunrise(jd, lat, lng, tzOffset);
  if (swiss !== null) return swiss;
  // Either sweph isn't loaded or it couldn't compute. Try Meeus.
  // approximateSunrise also returns null on polar non-rise — propagate honestly.
  return approximateSunrise(jd, lat, lng);
}

/**
 * Sunset UT hours (0-24) — same semantics as sunriseUTHours.
 */
export function sunsetUTHours(jd: number, lat: number, lng: number, tzOffset: number = 0): number | null {
  const swiss = swissSunset(jd, lat, lng, tzOffset);
  if (swiss !== null) return swiss;
  return approximateSunset(jd, lat, lng);
}

/**
 * Sunrise UT hours with explicit fallback for polar non-rise days.
 *
 * Returns `{ value, isFallback }`. When sunrise is real (sweph or Meeus
 * computed it), `value` is the real time and `isFallback` is false. When
 * the sun does not rise on this date at this latitude, `value` is the
 * caller-supplied fallback and `isFallback` is true.
 *
 * Use ONLY when null-handling at the call site would significantly
 * complicate logic AND the fallback is documented as a known approximation
 * (e.g., festival-generator running over hundreds of cities, where any
 * specific polar day produces synthetic but non-blocking output). The
 * tuple shape forces the caller to acknowledge the fallback.
 *
 * Callers are responsible for surfacing the approximation to users via
 * warnings when isFallback is true.
 *
 * Prefer sunriseUTHours() directly when you can handle null.
 */
export function sunriseUTHoursOr(
  jd: number, lat: number, lng: number, tzOffset: number, fallback: number,
): { value: number; isFallback: boolean } {
  const sr = sunriseUTHours(jd, lat, lng, tzOffset);
  if (sr !== null) return { value: sr, isFallback: false };
  return { value: fallback, isFallback: true };
}

/**
 * Sunset UT hours with explicit fallback. Same semantics as sunriseUTHoursOr.
 */
export function sunsetUTHoursOr(
  jd: number, lat: number, lng: number, tzOffset: number, fallback: number,
): { value: number; isFallback: boolean } {
  const ss = sunsetUTHours(jd, lat, lng, tzOffset);
  if (ss !== null) return { value: ss, isFallback: false };
  return { value: fallback, isFallback: true };
}

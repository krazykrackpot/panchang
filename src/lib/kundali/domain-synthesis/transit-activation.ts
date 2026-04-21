/**
 * Transit Activation — Lightweight current transit computation
 *
 * Computes approximate current sidereal longitudes for slow planets
 * (Jupiter, Saturn, Rahu, Ketu) using mean daily motion from J2000.0
 * epoch. Accuracy is ±1-2°, which is sufficient for sign-level transit
 * analysis in the Personal Pandit engine.
 *
 * Planet IDs: 4=Jupiter, 6=Saturn, 7=Rahu, 8=Ketu
 * Rashi IDs: 1-based (1=Aries … 12=Pisces)
 */

import { dateToJD } from '@/lib/astronomy/julian';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Julian Day Number of J2000.0 epoch (Jan 1.5, 2000 TT). */
const J2000 = 2451545.0;

/** Lahiri Ayanamsha at J2000.0 (degrees). */
const AYANAMSHA_J2000 = 23.85;

/** Rate of precession (degrees per Julian year). */
const AYANAMSHA_RATE = 0.01396;

/**
 * Mean tropical longitudes and daily motion rates at J2000.0 for slow planets.
 *
 * long0 = tropical longitude on J2000.0 (degrees)
 * rate  = mean daily motion (degrees/day, negative for retrograde-mean nodes)
 */
const PLANET_EPOCH: Record<number, { long0: number; rate: number }> = {
  4: { long0: 25.25,  rate: 0.08310 },  // Jupiter: ~Aries 25° at J2000, ~30.3°/yr
  6: { long0: 40.65,  rate: 0.03346 },  // Saturn:  ~Taurus 10° at J2000, ~12.2°/yr
  7: { long0: 120.0,  rate: -0.05299 }, // Rahu (mean node): ~Cancer, retrograde ~19.3°/yr
  8: { long0: 300.0,  rate: -0.05299 }, // Ketu: always opposite Rahu
};

/** Slow planet IDs used for transit analysis. */
const SLOW_PLANET_IDS = [4, 6, 7, 8] as const;

// ---------------------------------------------------------------------------
// Retrograde heuristic ranges
// ---------------------------------------------------------------------------

/**
 * Approximate synodic retrograde windows for Jupiter and Saturn.
 * These are expressed as tropical longitude ranges relative to the Sun.
 * A planet is retrograde when it's roughly in opposition to the Sun
 * (elongation ~120-240° from Sun for outer planets).
 *
 * Simple heuristic: compute Sun-planet elongation; if > 120° and < 240°,
 * the planet is approximately retrograde. This is a rough estimate (~80%
 * accuracy) but sufficient for narrative text.
 *
 * Rahu and Ketu always move retrograde (mean motion is negative).
 */

/** Mean daily motion of the Sun in tropical longitude. */
const SUN_DAILY_RATE = 0.9856;

/** Tropical longitude of the Sun at J2000.0. */
const SUN_LONG_J2000 = 280.46;

// ---------------------------------------------------------------------------
// Core computation
// ---------------------------------------------------------------------------

/**
 * Compute the approximate current sidereal longitude for a slow planet.
 *
 * @param pid - Planet ID (4, 6, 7, or 8)
 * @param jd  - Julian Day number
 * @returns Sidereal longitude in degrees [0, 360)
 */
export function currentSiderealLong(pid: number, jd: number): number {
  const epoch = PLANET_EPOCH[pid];
  if (!epoch) return 0;

  const days = jd - J2000;
  const years = days / 365.25;

  // Mean tropical longitude
  const tropicalLong = epoch.long0 + epoch.rate * days;

  // Lahiri ayanamsha for the given date
  const ayanamsha = AYANAMSHA_J2000 + AYANAMSHA_RATE * years;

  // Sidereal longitude, normalised to [0, 360)
  return ((tropicalLong - ayanamsha) % 360 + 360) % 360;
}

/**
 * Determine the Vedic sign (rashi) from a sidereal longitude.
 *
 * @param siderealDeg - Sidereal longitude in degrees [0, 360)
 * @returns Rashi ID 1-12 (1=Aries, 12=Pisces)
 */
function signFromLongitude(siderealDeg: number): number {
  return Math.floor(siderealDeg / 30) + 1;
}

/**
 * Compute the house number a transiting planet occupies relative to the
 * natal ascendant sign.
 *
 * In Vedic whole-sign houses, house 1 = ascendant sign,
 * house 2 = next sign, etc.
 *
 * @param transitSign   - Current sign of transiting planet (1-12)
 * @param ascendantSign - Natal ascendant sign (1-12)
 * @returns House number 1-12
 */
function transitHouseFromSign(transitSign: number, ascendantSign: number): number {
  return ((transitSign - ascendantSign + 12) % 12) + 1;
}

/**
 * Check whether a slow planet is approximately retrograde on a given date.
 *
 * Rahu and Ketu are always retrograde (mean node is retrograde).
 * For Jupiter and Saturn, we use a Sun-elongation heuristic:
 * retrograde when elongation is roughly 120°-240° (opposition zone).
 *
 * @param pid - Planet ID
 * @param jd  - Julian Day number
 * @returns true if the planet is likely retrograde
 */
function isRetrograde(pid: number, jd: number): boolean {
  // Rahu and Ketu are always retrograde
  if (pid === 7 || pid === 8) return true;

  const days = jd - J2000;

  // Sun's mean tropical longitude
  const sunLong = ((SUN_LONG_J2000 + SUN_DAILY_RATE * days) % 360 + 360) % 360;

  // Planet's mean tropical longitude
  const epoch = PLANET_EPOCH[pid];
  if (!epoch) return false;
  const planetLong = ((epoch.long0 + epoch.rate * days) % 360 + 360) % 360;

  // Elongation from Sun (angle planet leads Sun)
  const elongation = ((planetLong - sunLong) % 360 + 360) % 360;

  // Outer planets are retrograde near opposition (elongation ~120-240°)
  return elongation > 120 && elongation < 240;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** A single transit entry for a slow planet. */
export interface TransitEntry {
  planetId: number;
  currentSign: number;
  transitHouse: number;
  isRetrograde: boolean;
}

/**
 * Compute current transits for slow planets (Jupiter, Saturn, Rahu, Ketu)
 * relative to the natal ascendant sign.
 *
 * Uses lightweight mean-motion approximation (no ephemeris or lat/lng needed).
 * Accuracy is ±1-2° (sufficient for sign-level house placement).
 *
 * @param natalAscSign - The natal ascendant sign (1-12)
 * @param currentDate  - Date to compute transits for (defaults to today)
 * @returns Array of 4 transit entries (one per slow planet)
 */
export function computeCurrentTransits(
  natalAscSign: number,
  currentDate?: Date,
): TransitEntry[] {
  const now = currentDate ?? new Date();
  const jd = dateToJD(
    now.getUTCFullYear(),
    now.getUTCMonth() + 1,
    now.getUTCDate(),
    now.getUTCHours() + now.getUTCMinutes() / 60,
  );

  const entries: TransitEntry[] = [];

  for (const pid of SLOW_PLANET_IDS) {
    const siderealLong = currentSiderealLong(pid, jd);
    const sign = signFromLongitude(siderealLong);
    const house = transitHouseFromSign(sign, natalAscSign);
    const retro = isRetrograde(pid, jd);

    entries.push({
      planetId: pid,
      currentSign: sign,
      transitHouse: house,
      isRetrograde: retro,
    });
  }

  return entries;
}

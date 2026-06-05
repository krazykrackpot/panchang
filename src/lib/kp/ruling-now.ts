/**
 * Lean RP-only computation for a moment-in-time at a location.
 *
 * Used by /kp/transits + /embed/kp-ruling (sunrise & now modes) to
 * compute just the 7 ruling planets without running the full chart
 * pipeline (cuspal analysis, significators, planet dignities, etc).
 *
 * Spec: docs/superpowers/specs/2026-06-05-kp-ui-batch-design.md §4 + §5.1
 *
 * NOTE: Placidus cusps still need to be computed to derive Asc — the
 * full pipeline call would compute significators + dignities + combust
 * which the embed/transits page doesn't render. Trade-off accepted:
 * we skip ~70% of generateKPChart work.
 */

import { dateToJD, getPlanetaryPositions, normalizeDeg } from '@/lib/ephem/astronomical';
import { getAyanamsha } from '@/lib/ephem/astronomical';
import { calculatePlacidusCusps } from './placidus';
import { getRulingPlanets } from './ruling-planets';
import type { RulingPlanets } from '@/types/kp';

export interface RulingNowInput {
  /** Epoch milliseconds. Optional — defaults to Date.now(). */
  atEpochMs?: number;
  /** Geodetic latitude in degrees (-90..90). */
  lat: number;
  /** Geodetic longitude in degrees (-180..180). */
  lng: number;
}

export interface RulingNowResult {
  julianDay: number;
  ascDeg: number;
  moonDeg: number;
  ayanamshaValue: number;
  rulingPlanets: RulingPlanets;
  /** The UTC moment used for computation (matches atEpochMs if provided). */
  computedAtUtc: Date;
}

/**
 * Compute the 7 KP ruling planets at a moment for a location.
 *
 * @throws Error when lat/lng are out of range.
 */
export function getRulingPlanetsForMoment(
  input: RulingNowInput,
): RulingNowResult {
  const { lat, lng } = input;

  if (lat < -90 || lat > 90) {
    throw new Error(`[kp/ruling-now] lat out of range: ${lat}`);
  }
  if (lng < -180 || lng > 180) {
    throw new Error(`[kp/ruling-now] lng out of range: ${lng}`);
  }

  const epochMs = input.atEpochMs ?? Date.now();
  const computedAtUtc = new Date(epochMs);

  // Build UT-based JD components. Lesson L: use UTC explicitly.
  const year = computedAtUtc.getUTCFullYear();
  const month = computedAtUtc.getUTCMonth() + 1;
  const day = computedAtUtc.getUTCDate();
  const utHour =
    computedAtUtc.getUTCHours() +
    computedAtUtc.getUTCMinutes() / 60 +
    computedAtUtc.getUTCSeconds() / 3600;

  const jd = dateToJD(year, month, day, utHour);
  const ayanamshaValue = getAyanamsha(jd, 'kp');

  // Asc comes from Placidus cusp 0.
  const cusps = calculatePlacidusCusps(jd, lat, lng, ayanamshaValue);
  const ascDeg = cusps[0]?.degree ?? 0;

  // Moon is planet id=1 in getPlanetaryPositions output (tropical).
  const planets = getPlanetaryPositions(jd);
  const moonTropical = planets.find((p) => p.id === 1);
  if (!moonTropical) {
    throw new Error('[kp/ruling-now] moon position missing from ephemeris');
  }
  const moonDeg = normalizeDeg(moonTropical.longitude - ayanamshaValue);

  const rulingPlanets = getRulingPlanets(jd, ascDeg, moonDeg);

  return {
    julianDay: jd,
    ascDeg,
    moonDeg,
    ayanamshaValue,
    rulingPlanets,
    computedAtUtc,
  };
}

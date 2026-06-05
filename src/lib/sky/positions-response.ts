/**
 * Response-shape validator for /api/sky/positions consumers.
 *
 * Centralised because every client (LiveSkyMap, sky/page, CelestialSphere,
 * transit-playground) destructures `data.positions` from the JSON body —
 * but the endpoint can return three different shapes:
 *
 *   1. 200 OK   →  { positions: SkyPlanetPosition[], timestamp: string }
 *   2. 4xx/5xx  →  { error: string }                           (no `positions`)
 *   3. Network  →  fetch threw                                  (no body at all)
 *
 * Naively writing `setPositions(data.positions)` on shape #2 lands `undefined`
 * in component state — and the very next render does `positions.map(...)` and
 * React kills the tree (#418 / 'Cannot read properties of undefined').
 * This was the user-visible crash in the prod logs for /api/sky/positions
 * (June 2026, slider drag → 429 burst → unguarded destructure).
 *
 * Use `parsePositionsResponse(data)` at every consumer:
 *   - returns the array when the body has the success shape
 *   - returns null otherwise (caller keeps last-good positions or reports error)
 *
 * Pair with checking `res.ok` BEFORE calling .json() so transport-level
 * failures are surfaced separately from shape mismatches.
 */

import type { SkyPlanetPosition } from './positions';

export function parsePositionsResponse(data: unknown): SkyPlanetPosition[] | null {
  if (typeof data !== 'object' || data === null) return null;
  const positions = (data as { positions?: unknown }).positions;
  return Array.isArray(positions) ? (positions as SkyPlanetPosition[]) : null;
}

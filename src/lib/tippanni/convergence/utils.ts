// src/lib/tippanni/convergence/utils.ts

import { isBenefic, isMalefic } from '@/lib/tippanni/utils';
import type { ConvergenceInput, PlanetFilter } from './types';

const DUSTHANA_HOUSES = new Set([6, 8, 12]);

/**
 * Returns true if a planet is considered strong:
 *   - not debilitated
 *   - not combust
 *   - shadbala >= 1.0
 *   - not placed in a dusthana house (6/8/12)
 */
export function isPlanetStrong(planetId: number, input: ConvergenceInput): boolean {
  const planet = input.planets.find((p) => p.id === planetId);
  if (!planet) return false;
  if (planet.isDebilitated) return false;
  if (planet.isCombust) return false;
  if (planet.shadbala < 1.0) return false;
  if (DUSTHANA_HOUSES.has(planet.house)) return false;
  return true;
}

/**
 * Returns true if a house is afflicted:
 *   - a malefic planet occupies it, OR
 *   - the house lord is debilitated or combust
 */
export function isHouseAfflicted(house: number, input: ConvergenceInput): boolean {
  // Check for malefic occupant
  const hasMaleficOccupant = input.planets.some(
    (p) => p.house === house && isMalefic(p.id),
  );
  if (hasMaleficOccupant) return true;

  // Find the lord of the house
  const houseData = input.houses.find((h) => h.house === house);
  if (!houseData) return false;

  const lord = input.planets.find((p) => p.id === houseData.lordId);
  if (!lord) return false;

  return lord.isDebilitated || lord.isCombust;
}

/**
 * Computes the house number of a transit sign counted from the natal Moon sign.
 * Both moonSign and transitSign are 1-based (1–12).
 * Result is 1-based (1–12).
 */
export function getHouseFromMoon(moonSign: number, transitSign: number): number {
  return ((transitSign - moonSign + 12) % 12) + 1;
}

/**
 * Returns a scoring weight for a planet:
 *   - 1.5 for natural malefics (Sun, Mars, Saturn, Rahu, Ketu)
 *   - 1.0 for natural benefics (Moon, Mercury, Jupiter, Venus)
 */
export function getPlanetWeight(planetId: number): number {
  return isMalefic(planetId) ? 1.5 : 1.0;
}

/**
 * Returns true if planetId matches the given filter:
 *   - 'any'     → always true
 *   - 'malefic' → true for natural malefics
 *   - 'benefic' → true for natural benefics
 *   - number    → exact match on planet id
 */
export function matchesPlanetFilter(filter: PlanetFilter, planetId: number): boolean {
  if (filter === 'any') return true;
  if (filter === 'malefic') return isMalefic(planetId);
  if (filter === 'benefic') return isBenefic(planetId);
  return filter === planetId;
}

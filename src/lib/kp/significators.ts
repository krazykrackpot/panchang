/**
 * KP Significator Calculation
 *
 * For each house (1-12) the significators are graded into four levels:
 *
 *  Level 1 (strongest): Planets posited in the star (nakshatra) of planets
 *                       that OCCUPY the house.
 *  Level 2:             Planets that OCCUPY the house.
 *  Level 3:             Planets posited in the star of the HOUSE LORD.
 *  Level 4 (weakest):   The house lord itself.
 *
 * The `combined` array merges all four levels (unique, preserving order).
 */

import type { KPPlanet, KPCusp, SignificatorEntry } from '@/types/kp';

// ---------------------------------------------------------------------------
// Nakshatra lord mapping: nakshatra number (1-27) -> planet id
// ---------------------------------------------------------------------------

const NAKSHATRA_LORDS_BY_ID: number[] = [
  // nk 1-9
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  // nk 10-18
  8, 5, 0, 1, 2, 7, 4, 6, 3,
  // nk 19-27
  8, 5, 0, 1, 2, 7, 4, 6, 3,
];

// ---------------------------------------------------------------------------
// Sign lord mapping: sign (1-12) -> planet id
// ---------------------------------------------------------------------------

const SIGN_LORD_IDS: Record<number, number> = {
  1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
  7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Get the nakshatra number (1-27) from sidereal longitude */
function nakshatraNum(deg: number): number {
  return Math.floor(((deg % 360 + 360) % 360) / (360 / 27)) + 1;
}

/** Determine which house a planet occupies based on cusp boundaries */
function findHouseForDegree(deg: number, cusps: KPCusp[]): number {
  const sorted = [...cusps].sort((a, b) => a.house - b.house);

  for (let i = 0; i < 12; i++) {
    const cuspStart = sorted[i].degree;
    const cuspEnd = sorted[(i + 1) % 12].degree;
    const normDeg = ((deg % 360) + 360) % 360;

    if (cuspEnd > cuspStart) {
      // Normal case (no zodiac wrap)
      if (normDeg >= cuspStart && normDeg < cuspEnd) {
        return sorted[i].house;
      }
    } else {
      // Wraps around 0 degrees
      if (normDeg >= cuspStart || normDeg < cuspEnd) {
        return sorted[i].house;
      }
    }
  }

  // Fallback: closest cusp
  return 1;
}

/** Get the lord (planet id) of a given house cusp */
function houseLordId(house: number, cusps: KPCusp[]): number {
  const cusp = cusps.find((c) => c.house === house);
  if (!cusp) return 0;
  return SIGN_LORD_IDS[cusp.sign] ?? 0;
}

/** Unique values preserving insertion order */
function unique(arr: number[]): number[] {
  return [...new Set(arr)];
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate KP significators for all 12 houses.
 *
 * @param planets Array of KPPlanet objects (with longitude, nakshatra etc.)
 * @param cusps   Array of 12 KPCusp objects
 * @returns Array of 12 SignificatorEntry objects (one per house)
 */
export function calculateSignificators(
  planets: KPPlanet[],
  cusps: KPCusp[]
): SignificatorEntry[] {
  // Pre-compute: which house each planet occupies
  const planetHouse: Record<number, number> = {};
  for (const p of planets) {
    planetHouse[p.planet.id] = findHouseForDegree(p.longitude, cusps);
  }

  // Pre-compute: nakshatra lord of each planet
  const planetStarLord: Record<number, number> = {};
  for (const p of planets) {
    const nk = nakshatraNum(p.longitude);
    planetStarLord[p.planet.id] = NAKSHATRA_LORDS_BY_ID[nk - 1];
  }

  const entries: SignificatorEntry[] = [];

  for (let house = 1; house <= 12; house++) {
    // L2: Planets occupying this house
    const occupants = planets
      .filter((p) => planetHouse[p.planet.id] === house)
      .map((p) => p.planet.id);

    // L1: Planets in the star of occupants
    const level1: number[] = [];
    for (const occId of occupants) {
      for (const p of planets) {
        if (planetStarLord[p.planet.id] === occId) {
          level1.push(p.planet.id);
        }
      }
    }

    // L4: House lord
    const lordId = houseLordId(house, cusps);
    const level4 = [lordId];

    // L3: Planets in the star of the house lord
    const level3: number[] = [];
    for (const p of planets) {
      if (planetStarLord[p.planet.id] === lordId) {
        level3.push(p.planet.id);
      }
    }

    entries.push({
      house,
      level1: unique(level1),
      level2: unique(occupants),
      level3: unique(level3),
      level4: unique(level4),
      combined: unique([...level1, ...occupants, ...level3, ...level4]),
    });
  }

  return entries;
}

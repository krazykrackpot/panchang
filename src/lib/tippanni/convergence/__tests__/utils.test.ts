// src/lib/tippanni/convergence/__tests__/utils.test.ts

import { describe, it, expect } from 'vitest';
import {
  isPlanetStrong,
  isHouseAfflicted,
  getHouseFromMoon,
  getPlanetWeight,
  matchesPlanetFilter,
} from '../utils';
import type { ConvergenceInput } from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makePlanet(
  overrides: Partial<ConvergenceInput['planets'][number]> = {},
): ConvergenceInput['planets'][number] {
  return {
    id: 4, // Jupiter — benefic by default
    house: 1,
    sign: 1,
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    shadbala: 1.2,
    ...overrides,
  };
}

function makeHouse(
  overrides: Partial<ConvergenceInput['houses'][number]> = {},
): ConvergenceInput['houses'][number] {
  return { house: 1, sign: 1, lordId: 2, ...overrides };
}

function makeInput(
  planets: ConvergenceInput['planets'],
  houses: ConvergenceInput['houses'],
): ConvergenceInput {
  return {
    ascendant: 1,
    moonSign: 4,
    planets,
    houses,
    dashaLord: 4,
    antarLord: 5,
    yogaIds: [],
    doshaIds: [],
    transits: [],
    ashtakavargaSAV: new Array(12).fill(28),
    ashtakavargaBPI: Array.from({ length: 9 }, () => new Array(12).fill(4)),
    relationships: {
      houseRulers: {},
      planetHouses: {},
      planetSigns: {},
      transitHouses: {},
      dashaLord: 4,
      antarLord: 5,
    },
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

// ─── isPlanetStrong ───────────────────────────────────────────────────────────

describe('isPlanetStrong', () => {
  it('returns true for a healthy, well-placed planet', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 9, shadbala: 1.5 })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(true);
  });

  it('returns false when planet is debilitated', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 9, shadbala: 1.5, isDebilitated: true })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when planet is combust', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 1, shadbala: 1.2, isCombust: true })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when shadbala < 1.0', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 1, shadbala: 0.7 })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when planet is in a dusthana house (6)', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 6, shadbala: 1.5 })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when planet is in a dusthana house (8)', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 8, shadbala: 1.5 })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when planet is in a dusthana house (12)', () => {
    const input = makeInput(
      [makePlanet({ id: 4, house: 12, shadbala: 1.5 })],
      [],
    );
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('returns false when planet is not in the input list', () => {
    const input = makeInput([], []);
    expect(isPlanetStrong(4, input)).toBe(false);
  });

  it('accepts shadbala exactly equal to 1.0 as strong', () => {
    const input = makeInput(
      [makePlanet({ id: 5, house: 2, shadbala: 1.0 })],
      [],
    );
    expect(isPlanetStrong(5, input)).toBe(true);
  });
});

// ─── isHouseAfflicted ─────────────────────────────────────────────────────────

describe('isHouseAfflicted', () => {
  it('returns true when a malefic (Saturn=6) occupies the house', () => {
    const input = makeInput(
      [makePlanet({ id: 6, house: 7 })], // Saturn in house 7
      [makeHouse({ house: 7, lordId: 5 })], // Venus lords house 7, Venus is healthy
      // Venus not in planets → lord not found → lord check returns false
      // but malefic occupant → true
    );
    expect(isHouseAfflicted(7, input)).toBe(true);
  });

  it('returns true when a malefic (Mars=2) occupies the house', () => {
    const input = makeInput(
      [makePlanet({ id: 2, house: 5 })],
      [makeHouse({ house: 5, lordId: 4 })],
    );
    expect(isHouseAfflicted(5, input)).toBe(true);
  });

  it('returns true when house lord is debilitated', () => {
    const lordPlanet = makePlanet({ id: 4, house: 3, isDebilitated: true });
    const input = makeInput(
      [lordPlanet],
      [makeHouse({ house: 1, lordId: 4 })],
    );
    expect(isHouseAfflicted(1, input)).toBe(true);
  });

  it('returns true when house lord is combust', () => {
    const lordPlanet = makePlanet({ id: 4, house: 3, isCombust: true });
    const input = makeInput(
      [lordPlanet],
      [makeHouse({ house: 1, lordId: 4 })],
    );
    expect(isHouseAfflicted(1, input)).toBe(true);
  });

  it('returns false for a clean house with benefic occupant and healthy lord', () => {
    const jupiter = makePlanet({ id: 4, house: 9, shadbala: 1.4 }); // benefic occupant
    const venus = makePlanet({ id: 5, house: 1, shadbala: 1.2 }); // house lord
    const input = makeInput(
      [jupiter, venus],
      [makeHouse({ house: 9, lordId: 5 })],
    );
    expect(isHouseAfflicted(9, input)).toBe(false);
  });

  it('returns false when house data is not found in input', () => {
    const input = makeInput([], []);
    expect(isHouseAfflicted(5, input)).toBe(false);
  });

  it('returns false when lord is not in the planets list', () => {
    // No malefic occupant, lord not found → not afflicted
    const input = makeInput(
      [],
      [makeHouse({ house: 3, lordId: 4 })],
    );
    expect(isHouseAfflicted(3, input)).toBe(false);
  });
});

// ─── getHouseFromMoon ─────────────────────────────────────────────────────────

describe('getHouseFromMoon', () => {
  it('returns 1 when transit sign equals moon sign', () => {
    expect(getHouseFromMoon(4, 4)).toBe(1);
  });

  it('returns 2 when transit is one sign ahead', () => {
    expect(getHouseFromMoon(4, 5)).toBe(2);
  });

  it('returns 12 when transit is one sign behind', () => {
    expect(getHouseFromMoon(4, 3)).toBe(12);
  });

  it('handles wrap-around from sign 12 to sign 1', () => {
    // Moon in Pisces (12), transit in Aries (1) → house 2
    expect(getHouseFromMoon(12, 1)).toBe(2);
  });

  it('handles wrap-around from sign 1 to sign 12', () => {
    // Moon in Aries (1), transit in Pisces (12) → house 12
    expect(getHouseFromMoon(1, 12)).toBe(12);
  });

  it('returns 7 for transit opposite to moon (6 signs ahead)', () => {
    // Moon in Aries (1), transit in Libra (7) → house 7
    expect(getHouseFromMoon(1, 7)).toBe(7);
  });

  it('result is always between 1 and 12 inclusive', () => {
    for (let moon = 1; moon <= 12; moon++) {
      for (let transit = 1; transit <= 12; transit++) {
        const house = getHouseFromMoon(moon, transit);
        expect(house).toBeGreaterThanOrEqual(1);
        expect(house).toBeLessThanOrEqual(12);
      }
    }
  });
});

// ─── getPlanetWeight ──────────────────────────────────────────────────────────

describe('getPlanetWeight', () => {
  const malefics = [0, 2, 6, 7, 8]; // Sun, Mars, Saturn, Rahu, Ketu
  const benefics = [1, 3, 4, 5];    // Moon, Mercury, Jupiter, Venus

  it.each(malefics)('returns 1.5 for malefic planet id=%i', (id) => {
    expect(getPlanetWeight(id)).toBe(1.5);
  });

  it.each(benefics)('returns 1.0 for benefic planet id=%i', (id) => {
    expect(getPlanetWeight(id)).toBe(1.0);
  });
});

// ─── matchesPlanetFilter ──────────────────────────────────────────────────────

describe('matchesPlanetFilter', () => {
  it("'any' matches every planet", () => {
    for (let id = 0; id <= 8; id++) {
      expect(matchesPlanetFilter('any', id)).toBe(true);
    }
  });

  it("'malefic' matches Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8)", () => {
    expect(matchesPlanetFilter('malefic', 0)).toBe(true);
    expect(matchesPlanetFilter('malefic', 2)).toBe(true);
    expect(matchesPlanetFilter('malefic', 6)).toBe(true);
    expect(matchesPlanetFilter('malefic', 7)).toBe(true);
    expect(matchesPlanetFilter('malefic', 8)).toBe(true);
  });

  it("'malefic' does not match benefics", () => {
    expect(matchesPlanetFilter('malefic', 1)).toBe(false);
    expect(matchesPlanetFilter('malefic', 3)).toBe(false);
    expect(matchesPlanetFilter('malefic', 4)).toBe(false);
    expect(matchesPlanetFilter('malefic', 5)).toBe(false);
  });

  it("'benefic' matches Moon(1), Mercury(3), Jupiter(4), Venus(5)", () => {
    expect(matchesPlanetFilter('benefic', 1)).toBe(true);
    expect(matchesPlanetFilter('benefic', 3)).toBe(true);
    expect(matchesPlanetFilter('benefic', 4)).toBe(true);
    expect(matchesPlanetFilter('benefic', 5)).toBe(true);
  });

  it("'benefic' does not match malefics", () => {
    expect(matchesPlanetFilter('benefic', 0)).toBe(false);
    expect(matchesPlanetFilter('benefic', 2)).toBe(false);
    expect(matchesPlanetFilter('benefic', 6)).toBe(false);
    expect(matchesPlanetFilter('benefic', 7)).toBe(false);
    expect(matchesPlanetFilter('benefic', 8)).toBe(false);
  });

  it('exact number filter matches only that planet id', () => {
    expect(matchesPlanetFilter(4, 4)).toBe(true);
    expect(matchesPlanetFilter(4, 5)).toBe(false);
    expect(matchesPlanetFilter(0, 0)).toBe(true);
    expect(matchesPlanetFilter(0, 1)).toBe(false);
  });
});

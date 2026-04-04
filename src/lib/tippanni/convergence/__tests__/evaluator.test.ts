// src/lib/tippanni/convergence/__tests__/evaluator.test.ts

import { describe, it, expect } from 'vitest';
import { evaluateCondition } from '../evaluator';
import type { ConvergenceInput, PatternCondition } from '../types';

// ── Helper factory ────────────────────────────────────────────────────────────

function makeInput(overrides: Partial<ConvergenceInput> = {}): ConvergenceInput {
  const defaultPlanets: ConvergenceInput['planets'] = [
    // Sun (0) — malefic, house 1, sign 1
    { id: 0, house: 1, sign: 1, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.2 },
    // Moon (1) — benefic, house 4, sign 4
    { id: 1, house: 4, sign: 4, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.1 },
    // Mars (2) — malefic, house 7, sign 7
    { id: 2, house: 7, sign: 7, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.0 },
    // Mercury (3) — benefic, house 2, sign 2
    { id: 3, house: 2, sign: 2, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 },
    // Jupiter (4) — benefic, house 10, sign 10
    { id: 4, house: 10, sign: 10, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.5 },
    // Venus (5) — benefic, house 5, sign 5
    { id: 5, house: 5, sign: 5, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.4 },
    // Saturn (6) — malefic, house 8, sign 8
    { id: 6, house: 8, sign: 8, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.2 },
    // Rahu (7) — malefic, house 9, sign 9
    { id: 7, house: 9, sign: 9, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.8 },
    // Ketu (8) — malefic, house 3, sign 3
    { id: 8, house: 3, sign: 3, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.8 },
  ];

  const defaultHouses: ConvergenceInput['houses'] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    sign: i + 1,
    lordId: i, // simplified: house n → lord is planet n-1 (0-indexed)
  }));

  const defaultRelationships: ConvergenceInput['relationships'] = {
    houseRulers: { 1: 0, 2: 3, 3: 8, 4: 1, 5: 5, 6: 6, 7: 2, 8: 6, 9: 7, 10: 6, 11: 7, 12: 4 },
    planetHouses: { 0: 1, 1: 4, 2: 7, 3: 2, 4: 10, 5: 5, 6: 8, 7: 9, 8: 3 },
    planetSigns: { 0: 1, 1: 4, 2: 7, 3: 2, 4: 10, 5: 5, 6: 8, 7: 9, 8: 3 },
    transitHouses: { 4: 9, 6: 4, 7: 5 }, // Jupiter transit house 9, Saturn house 4, Rahu house 5
    dashaLord: 4, // Jupiter
    antarLord: 5, // Venus
  };

  return {
    ascendant: 1,
    moonSign: 4,
    planets: defaultPlanets,
    houses: defaultHouses,
    dashaLord: 4,     // Jupiter
    antarLord: 5,     // Venus
    yogaIds: ['gajakesari', 'hamsa'],
    doshaIds: ['mangal-dosha'],
    transits: [],
    ashtakavargaSAV: Array(12).fill(28),
    ashtakavargaBPI: Array(9).fill(Array(12).fill(4)),
    relationships: defaultRelationships,
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
    ...overrides,
  };
}

// ── natal: planet-in-house ────────────────────────────────────────────────────

describe('natal: planet-in-house', () => {
  it('returns true when Mars (id=2) is in house 7', () => {
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 2, house: 7 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when no planet matching filter is in house 7 (benefic filter, only Mars there)', () => {
    // Mars is malefic, so benefic filter should return false
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'benefic', house: 7 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns true with malefic filter when Mars is in house 7', () => {
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'malefic', house: 7 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true with "any" filter for any occupied house', () => {
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'any', house: 4 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when no planet occupies the given house', () => {
    // House 6 has no planet in default setup (Saturn is house 8, Ketu house 3)
    const cond: PatternCondition = { type: 'natal', check: 'planet-in-house', planet: 'any', house: 6 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── natal: lord-strong ────────────────────────────────────────────────────────

describe('natal: lord-strong', () => {
  it('returns true when lord of house 10 is Jupiter (id=4) with high shadbala', () => {
    // House 10 ruler = 6 (Saturn) in default, override to Jupiter (4) as ruler
    const input = makeInput();
    input.relationships.houseRulers[10] = 4; // Jupiter rules house 10
    // Jupiter: house=10, not debilitated, not combust, shadbala=1.5, not in dusthana
    const cond: PatternCondition = { type: 'natal', check: 'lord-strong', house: 10 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('returns false when lord of house 10 is Saturn (id=6) in dusthana (house 8)', () => {
    // Default: house 10 ruler = 6 (Saturn), Saturn is in house 8 (dusthana)
    const cond: PatternCondition = { type: 'natal', check: 'lord-strong', house: 10 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns false when lord is debilitated', () => {
    const input = makeInput();
    input.relationships.houseRulers[5] = 3; // Mercury rules house 5
    const mercury = input.planets.find((p) => p.id === 3)!;
    mercury.isDebilitated = true;
    const cond: PatternCondition = { type: 'natal', check: 'lord-strong', house: 5 };
    expect(evaluateCondition(cond, input)).toBe(false);
  });

  it('returns false when house ruler is not found', () => {
    const input = makeInput();
    delete (input.relationships.houseRulers as Record<number, number>)[11];
    const cond: PatternCondition = { type: 'natal', check: 'lord-strong', house: 11 };
    expect(evaluateCondition(cond, input)).toBe(false);
  });
});

// ── natal: lord-afflicted ─────────────────────────────────────────────────────

describe('natal: lord-afflicted', () => {
  it('returns true when a malefic (Mars) occupies house 7', () => {
    // Mars (malefic) is in house 7 by default
    const cond: PatternCondition = { type: 'natal', check: 'lord-afflicted', house: 7 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when house lord is debilitated', () => {
    const input = makeInput();
    // House 4: lord = Moon (id=1), make Moon debilitated
    input.relationships.houseRulers[4] = 1;
    input.houses[3].lordId = 1;
    const moon = input.planets.find((p) => p.id === 1)!;
    moon.isDebilitated = true;
    const cond: PatternCondition = { type: 'natal', check: 'lord-afflicted', house: 4 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('returns false when house has only benefics and lord is clean', () => {
    // House 10: Jupiter (benefic) is there, and Jupiter's lord in houseRulers...
    // Override house 10 to have Jupiter as lord and Jupiter is clean
    const input = makeInput();
    input.relationships.houseRulers[10] = 4;
    input.houses[9].lordId = 4;
    // Jupiter: not malefic, not debilitated, not combust
    const cond: PatternCondition = { type: 'natal', check: 'lord-afflicted', house: 10 };
    expect(evaluateCondition(cond, input)).toBe(false);
  });
});

// ── natal: yoga-present ───────────────────────────────────────────────────────

describe('natal: yoga-present', () => {
  it('returns true when gajakesari is in yogaIds', () => {
    const cond: PatternCondition = { type: 'natal', check: 'yoga-present', yogaId: 'gajakesari' };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when raja-yoga is not in yogaIds', () => {
    const cond: PatternCondition = { type: 'natal', check: 'yoga-present', yogaId: 'raja-yoga' };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns true when hamsa yoga is present', () => {
    const cond: PatternCondition = { type: 'natal', check: 'yoga-present', yogaId: 'hamsa' };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });
});

// ── natal: dosha-present ──────────────────────────────────────────────────────

describe('natal: dosha-present', () => {
  it('returns true when mangal-dosha is present', () => {
    const cond: PatternCondition = { type: 'natal', check: 'dosha-present', doshaId: 'mangal-dosha' };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when kaal-sarp is not present', () => {
    const cond: PatternCondition = { type: 'natal', check: 'dosha-present', doshaId: 'kaal-sarp' };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── natal: benefic-aspect-to-house ───────────────────────────────────────────

describe('natal: benefic-aspect-to-house', () => {
  it('returns true when Jupiter (benefic, sign 10) aspects house with sign 10 (0 distance)', () => {
    // Jupiter in sign 10, house 10 has sign 10 → distance = 0 (kendra)
    const cond: PatternCondition = { type: 'natal', check: 'benefic-aspect-to-house', house: 10 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when Jupiter (sign 10) is 3 signs away from target house sign 7', () => {
    // Jupiter sign=10, target sign=7 → distance = (10-7+12)%12 = 3 (kendra)
    const cond: PatternCondition = { type: 'natal', check: 'benefic-aspect-to-house', house: 7 };
    // house 7 has sign 7 in default setup
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when no benefic is at kendra distance from the house sign', () => {
    // House 6 has sign 6. Benefic signs: Moon=4, Mercury=2, Jupiter=10, Venus=5
    // Distances from sign 6: Moon(4)=(4-6+12)%12=10, Merc(2)=(2-6+12)%12=8, Jup(10)=(10-6)%12=4, Venus(5)=(5-6+12)%12=11
    // None are in {0,3,6,9}
    const cond: PatternCondition = { type: 'natal', check: 'benefic-aspect-to-house', house: 6 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── transit: planet-in-house-from-moon ───────────────────────────────────────

describe('transit: planet-in-house-from-moon', () => {
  it('returns true when transitHouses[6]=4 and checking planet 6 house 4', () => {
    // Saturn (6) transit house = 4 in default relationships
    const cond: PatternCondition = { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when transit house does not match', () => {
    const cond: PatternCondition = { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 7 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns true for Jupiter (4) in transit house 9', () => {
    const cond: PatternCondition = { type: 'transit', check: 'planet-in-house-from-moon', planet: 4, house: 9 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when planet has no transit house entry', () => {
    const cond: PatternCondition = { type: 'transit', check: 'planet-in-house-from-moon', planet: 3, house: 1 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── dasha: lord-rules-or-occupies ────────────────────────────────────────────

describe('dasha: lord-rules-or-occupies', () => {
  it('returns true when dashaLord (Jupiter=4) rules house 12', () => {
    // Default: houseRulers[12] = 4 (Jupiter)
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 12 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when antarLord (Venus=5) rules house 5', () => {
    // Default: houseRulers[5] = 5 (Venus)
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when dashaLord (Jupiter=4) occupies house 10', () => {
    // Default: planetHouses[4] = 10, so Jupiter occupies house 10
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 10 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when antarLord (Venus=5) occupies house 5', () => {
    // Default: planetHouses[5] = 5
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 5 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when neither dashaLord nor antarLord rules or occupies the house', () => {
    // House 3: ruler=8 (Ketu), occupied by Ketu. Neither Jupiter(4) nor Venus(5)
    const cond: PatternCondition = { type: 'dasha', check: 'lord-rules-or-occupies', house: 3 };
    // houseRulers[3]=8, planetHouses[4]=10, planetHouses[5]=5 — neither is 3
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── dasha: lord-is-planet ─────────────────────────────────────────────────────

describe('dasha: lord-is-planet', () => {
  it('returns true when dashaLord (4=Jupiter) matches planet 4', () => {
    const cond: PatternCondition = { type: 'dasha', check: 'lord-is-planet', planet: 4 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns true when antarLord (5=Venus) matches planet 5', () => {
    const cond: PatternCondition = { type: 'dasha', check: 'lord-is-planet', planet: 5 };
    expect(evaluateCondition(cond, makeInput())).toBe(true);
  });

  it('returns false when neither dashaLord nor antarLord matches', () => {
    const cond: PatternCondition = { type: 'dasha', check: 'lord-is-planet', planet: 2 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns true when checking dashaLord override to 7 (Rahu)', () => {
    const input = makeInput({ dashaLord: 7, antarLord: 8 });
    const cond: PatternCondition = { type: 'dasha', check: 'lord-is-planet', planet: 7 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });
});

// ── retro: planet-retrograde ──────────────────────────────────────────────────

describe('retro: planet-retrograde', () => {
  it('returns true when Mars (id=2) is retrograde', () => {
    const input = makeInput();
    input.planets.find((p) => p.id === 2)!.isRetrograde = true;
    const cond: PatternCondition = { type: 'retro', check: 'planet-retrograde', planet: 2 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('returns false when Mars is not retrograde', () => {
    // Default: Mars not retrograde
    const cond: PatternCondition = { type: 'retro', check: 'planet-retrograde', planet: 2 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns false when planet id is not found', () => {
    const cond: PatternCondition = { type: 'retro', check: 'planet-retrograde', planet: 99 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

// ── combust: planet-combust ───────────────────────────────────────────────────

describe('combust: planet-combust', () => {
  it('returns true when Mercury (id=3) is combust', () => {
    const input = makeInput();
    input.planets.find((p) => p.id === 3)!.isCombust = true;
    const cond: PatternCondition = { type: 'combust', check: 'planet-combust', planet: 3 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('returns false when Mercury is not combust', () => {
    const cond: PatternCondition = { type: 'combust', check: 'planet-combust', planet: 3 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });

  it('returns true when Venus (id=5) is combust', () => {
    const input = makeInput();
    input.planets.find((p) => p.id === 5)!.isCombust = true;
    const cond: PatternCondition = { type: 'combust', check: 'planet-combust', planet: 5 };
    expect(evaluateCondition(cond, input)).toBe(true);
  });

  it('returns false when planet id is not found', () => {
    const cond: PatternCondition = { type: 'combust', check: 'planet-combust', planet: 99 };
    expect(evaluateCondition(cond, makeInput())).toBe(false);
  });
});

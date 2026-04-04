// src/lib/tippanni/convergence/__tests__/scoring.test.ts

import { describe, it, expect } from 'vitest';
import { scorePattern } from '../scoring';
import type {
  ConvergenceInput,
  ConvergencePattern,
  PatternCondition,
} from '../types';
import { TippanniSection } from '../types';

// ── Mock pattern ──────────────────────────────────────────────────────────────
//
// 3 conditions:
//   C0 — natal planet-in-house: Mars (id=2) in house 10
//   C1 — transit planet-in-house-from-moon: Saturn (id=6) in house 4
//   C2 — dasha lord-is-planet: planet 4 (Jupiter)
//
// Significance = 3

const MOCK_PATTERN: ConvergencePattern = {
  id: 'test-career-push',
  theme: 'career',
  significance: 3,
  conditions: [
    { type: 'natal', check: 'planet-in-house', planet: 2, house: 10 },   // C0
    { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4 }, // C1
    { type: 'dasha', check: 'lord-is-planet', planet: 4 },               // C2
  ],
  text: {
    full: { en: 'Full career push text', hi: 'पूर्ण करियर पाठ' },
    mild: { en: 'Mild career push text', hi: 'सौम्य करियर पाठ' },
  },
  advice: { en: 'Stay focused on your goals', hi: 'अपने लक्ष्यों पर ध्यान दें' },
  laypersonNote: { en: 'A strong career period', hi: 'एक मजबूत करियर काल' },
  relatedSections: [TippanniSection.DashaSynthesis, TippanniSection.LifeAreas],
};

// ── Input factory ─────────────────────────────────────────────────────────────
//
// Parameters control which conditions pass:
//   marsInHouse10   → C0 passes (natal planet-in-house Mars=2 in house 10)
//   saturnTransit4  → C1 passes (transit Saturn=6 in house-from-moon=4)
//   dashIsJupiter   → C2 passes (dashaLord=4 Jupiter)

interface MakeInputOptions {
  marsInHouse10?: boolean;
  saturnTransitHouse4?: boolean;
  dashaIsJupiter?: boolean;
  /** Override SAV bindus for Saturn's transit sign (sign 8 index=7 by default) */
  saturnTransitSAV?: number;
}

function makeInput({
  marsInHouse10 = true,
  saturnTransitHouse4 = true,
  dashaIsJupiter = true,
  saturnTransitSAV = 28,
}: MakeInputOptions = {}): ConvergenceInput {
  // Mars (id=2) placed in house 10 or house 7 (misses C0)
  const marsHouse = marsInHouse10 ? 10 : 7;

  // Saturn transit: place Saturn in sign 7 (so house-from-moon = (7-4+12)%12+1 = 4)
  // when saturnTransitHouse4=true; else sign 9 → house = (9-4+12)%12+1 = 6
  const saturnTransitSign = saturnTransitHouse4 ? 7 : 9;

  const dashaLord = dashaIsJupiter ? 4 : 2; // Jupiter=4 or Mars=2

  // SAV array: index 6 (sign 7, Saturn's transit sign when active)
  const ashtakavargaSAV = Array(12).fill(28) as number[];
  ashtakavargaSAV[saturnTransitSign - 1] = saturnTransitSAV;

  const planets: ConvergenceInput['planets'] = [
    { id: 0, house: 1,  sign: 1,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.2 },
    { id: 1, house: 4,  sign: 4,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.1 },
    { id: 2, house: marsHouse, sign: marsHouse, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.0 },
    { id: 3, house: 2,  sign: 2,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.3 },
    { id: 4, house: 9,  sign: 9,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.5 },
    { id: 5, house: 5,  sign: 5,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.4 },
    { id: 6, house: 8,  sign: 8,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 1.2 },
    { id: 7, house: 11, sign: 11, isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.8 },
    { id: 8, house: 3,  sign: 3,  isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, shadbala: 0.8 },
  ];

  const houses: ConvergenceInput['houses'] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    sign: i + 1,
    lordId: i,
  }));

  // transitHouses[6] must equal 4 for C1 to pass
  const transitHouses: Record<number, number> = saturnTransitHouse4
    ? { 4: 9, 6: 4, 7: 5 }
    : { 4: 9, 6: 6, 7: 5 }; // Saturn→house 6 misses C1

  const relationships: ConvergenceInput['relationships'] = {
    houseRulers: { 1: 0, 2: 3, 3: 8, 4: 1, 5: 5, 6: 6, 7: 2, 8: 6, 9: 7, 10: 6, 11: 7, 12: 4 },
    planetHouses: { 0: 1, 1: 4, 2: marsHouse, 3: 2, 4: 9, 5: 5, 6: 8, 7: 11, 8: 3 },
    planetSigns: { 0: 1, 1: 4, 2: marsHouse, 3: 2, 4: 9, 5: 5, 6: 8, 7: 11, 8: 3 },
    transitHouses,
    dashaLord,
    antarLord: 5,
  };

  return {
    ascendant: 1,
    moonSign: 4,
    planets,
    houses,
    dashaLord,
    antarLord: 5,
    yogaIds: ['gajakesari'],
    doshaIds: [],
    transits: [
      { planetId: 4, sign: 9, isRetrograde: false },
      { planetId: 6, sign: saturnTransitSign, isRetrograde: false },
      { planetId: 7, sign: 5, isRetrograde: false },
    ],
    ashtakavargaSAV,
    ashtakavargaBPI: Array(9).fill(Array(12).fill(4)),
    relationships,
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('scorePattern', () => {
  // ── Test 1: Full match (all 3 conditions pass) ────────────────────────────
  describe('full match — all 3 conditions satisfied', () => {
    it('returns a non-null MatchedPattern', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput());
      expect(result).not.toBeNull();
    });

    it('sets isFullMatch = true', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.isFullMatch).toBe(true);
    });

    it('sets matchCount = 3 and totalConditions = 3', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.matchCount).toBe(3);
      expect(result.totalConditions).toBe(3);
    });

    it('uses the full text', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.text.en).toBe('Full career push text');
      expect(result.text.hi).toBe('पूर्ण करियर पाठ');
    });

    it('carries through advice, laypersonNote, relatedSections', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.advice.en).toBe('Stay focused on your goals');
      expect(result.laypersonNote.en).toBe('A strong career period');
      expect(result.relatedSections).toEqual([TippanniSection.DashaSynthesis, TippanniSection.LifeAreas]);
    });

    it('produces a positive finalScore', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.finalScore).toBeGreaterThan(0);
    });

    it('sets patternId and theme from the pattern definition', () => {
      const result = scorePattern(MOCK_PATTERN, makeInput())!;
      expect(result.patternId).toBe('test-career-push');
      expect(result.theme).toBe('career');
    });
  });

  // ── Test 2: Partial match (2 of 3 conditions pass) ───────────────────────
  describe('partial match — 2 of 3 conditions satisfied (dasha misses)', () => {
    const partialInput = makeInput({ dashaIsJupiter: false }); // C2 fails

    it('returns a non-null MatchedPattern', () => {
      const result = scorePattern(MOCK_PATTERN, partialInput);
      expect(result).not.toBeNull();
    });

    it('sets isFullMatch = false', () => {
      const result = scorePattern(MOCK_PATTERN, partialInput)!;
      expect(result.isFullMatch).toBe(false);
    });

    it('sets matchCount = 2 and totalConditions = 3', () => {
      const result = scorePattern(MOCK_PATTERN, partialInput)!;
      expect(result.matchCount).toBe(2);
      expect(result.totalConditions).toBe(3);
    });

    it('uses the mild text', () => {
      const result = scorePattern(MOCK_PATTERN, partialInput)!;
      expect(result.text.en).toBe('Mild career push text');
      expect(result.text.hi).toBe('सौम्य करियर पाठ');
    });

    it('produces a positive finalScore', () => {
      const result = scorePattern(MOCK_PATTERN, partialInput)!;
      expect(result.finalScore).toBeGreaterThan(0);
    });
  });

  // ── Test 3: No match / insufficient matches ───────────────────────────────
  describe('no match — 0 conditions satisfied', () => {
    const noMatchInput = makeInput({
      marsInHouse10: false,
      saturnTransitHouse4: false,
      dashaIsJupiter: false,
    });

    it('returns null', () => {
      const result = scorePattern(MOCK_PATTERN, noMatchInput);
      expect(result).toBeNull();
    });
  });

  describe('single match — only 1 condition satisfied', () => {
    const singleMatchInput = makeInput({
      marsInHouse10: true,       // C0 passes
      saturnTransitHouse4: false, // C1 fails
      dashaIsJupiter: false,      // C2 fails
    });

    it('returns null when only 1 condition matches', () => {
      const result = scorePattern(MOCK_PATTERN, singleMatchInput);
      expect(result).toBeNull();
    });
  });

  // ── Test 4: Full match scores higher than partial match ───────────────────
  describe('score ordering', () => {
    it('full match finalScore > partial match finalScore', () => {
      const fullResult = scorePattern(MOCK_PATTERN, makeInput())!;
      const partialResult = scorePattern(MOCK_PATTERN, makeInput({ dashaIsJupiter: false }))!;

      expect(fullResult).not.toBeNull();
      expect(partialResult).not.toBeNull();
      expect(fullResult.finalScore).toBeGreaterThan(partialResult.finalScore);
    });
  });

  // ── Ashtakavarga modifier ─────────────────────────────────────────────────
  describe('ashtakavarga modifier on transit conditions', () => {
    it('boosts score when transit sign has >= 30 bindus', () => {
      const baseResult = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 28 }))!;
      const boostedResult = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 31 }))!;

      expect(boostedResult.finalScore).toBeGreaterThan(baseResult.finalScore);
    });

    it('reduces score when transit sign has <= 22 bindus', () => {
      const baseResult = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 28 }))!;
      const reducedResult = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 20 }))!;

      expect(reducedResult.finalScore).toBeLessThan(baseResult.finalScore);
    });

    it('high-bindu score > mid-bindu score > low-bindu score', () => {
      const high = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 32 }))!;
      const mid  = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 26 }))!;
      const low  = scorePattern(MOCK_PATTERN, makeInput({ saturnTransitSAV: 18 }))!;

      expect(high.finalScore).toBeGreaterThan(mid.finalScore);
      expect(mid.finalScore).toBeGreaterThan(low.finalScore);
    });
  });

  // ── Explicit weight override ──────────────────────────────────────────────
  describe('explicit weight field on conditions', () => {
    it('uses explicit weight instead of planet-derived weight', () => {
      const patternWithExplicitWeight: ConvergencePattern = {
        ...MOCK_PATTERN,
        id: 'test-explicit-weight',
        conditions: [
          { type: 'natal', check: 'planet-in-house', planet: 2, house: 10, weight: 2.5 },
          { type: 'transit', check: 'planet-in-house-from-moon', planet: 6, house: 4, weight: 2.5 },
          { type: 'dasha', check: 'lord-is-planet', planet: 4, weight: 2.5 },
        ],
      };

      const defaultResult = scorePattern(MOCK_PATTERN, makeInput())!;
      const heavyResult = scorePattern(patternWithExplicitWeight, makeInput())!;

      // All weights=2.5 should yield a higher score than planet-derived weights
      // (Mars=1.5, Saturn=1.5, Jupiter dasha=1.0 → avg 1.33 vs 2.5)
      expect(heavyResult.finalScore).toBeGreaterThan(defaultResult.finalScore);
    });
  });

  // ── Score formula verification ────────────────────────────────────────────
  describe('score formula precision', () => {
    it('full match: computes expected score for known inputs (no transit in transits array affects SAV modifier)', () => {
      // Pattern with 2 natal conditions only (no transit) → ashtakavargaModifier = 1.0
      const simplePattern: ConvergencePattern = {
        ...MOCK_PATTERN,
        id: 'test-simple',
        significance: 4,
        conditions: [
          { type: 'natal', check: 'planet-in-house', planet: 2, house: 10 }, // Mars=malefic → weight 1.5
          { type: 'dasha', check: 'lord-is-planet', planet: 4 },             // dashaLord=Jupiter=benefic → weight 1.0
        ],
      };
      const input = makeInput();
      const result = scorePattern(simplePattern, input)!;

      // conditionWeightSum = (1.5 + 1.0) / 2 = 1.25
      // matchRatio = 1.0 (full match, 2/2)
      // ashtakavargaModifier = 1.0 (no transit conditions)
      // finalScore = 4 * 1.25 * 1.0 * 1.0 = 5.0
      expect(result.finalScore).toBeCloseTo(5.0, 5);
    });

    it('partial match: matchRatio 0.6 reduces score correctly', () => {
      // 2-condition pattern where only 1 passes → matchCount=1 → returns null
      // Use 3-condition pattern with 2 passing to test 0.6 ratio
      // C0 (Mars house 10) + C1 (Saturn transit house 4) pass; C2 (dasha Jupiter) fails
      const input = makeInput({ dashaIsJupiter: false, saturnTransitSAV: 28 });
      const result = scorePattern(MOCK_PATTERN, input)!;

      // Matched: C0 (Mars=malefic→1.5), C1 (Saturn=malefic→1.5)
      // conditionWeightSum = (1.5 + 1.5) / 2 = 1.5
      // matchRatio = 0.6
      // ashtakavargaModifier: Saturn transit sign 7 → SAV[6] = 28 → no modifier → 1.0
      // finalScore = 3 * 1.5 * 0.6 * 1.0 = 2.7
      expect(result.finalScore).toBeCloseTo(2.7, 5);
    });
  });
});

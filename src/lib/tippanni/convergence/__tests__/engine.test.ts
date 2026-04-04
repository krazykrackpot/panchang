// src/lib/tippanni/convergence/__tests__/engine.test.ts

import { describe, it, expect } from 'vitest';
import { runConvergenceEngine } from '../engine';
import { CONVERGENCE_VERSION } from '../types';
import type { ConvergenceInput } from '../types';

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds a minimal but valid planet array entry.
 */
function makePlanet(
  id: number,
  house: number,
  sign: number,
  overrides: Partial<ConvergenceInput['planets'][0]> = {},
): ConvergenceInput['planets'][0] {
  return {
    id,
    house,
    sign,
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    shadbala: 1.0,
    ...overrides,
  };
}

/**
 * Builds a minimal but valid house entry.
 */
function makeHouse(house: number, sign: number, lordId: number): ConvergenceInput['houses'][0] {
  return { house, sign, lordId };
}

/**
 * Returns a flat 28-element SAV array with all bindus set to 25 (neutral).
 */
function neutralSAV(): number[] {
  return new Array(28).fill(25);
}

/**
 * Returns an empty 9×12 BPI matrix.
 */
function emptyBPI(): number[][] {
  return Array.from({ length: 9 }, () => new Array(12).fill(0));
}

// ─── Fixture: Career Peak Chart ───────────────────────────────────────────────
//
// Target pattern: 'career-peak'
// Conditions:
//   1. natal lord-strong house 10  → houseRulers[10]=6 (Saturn), Saturn id=6 placed in
//      house 3 sign 3 with shadbala=1.4, not debilitated, not combust → isPlanetStrong=true
//   2. transit planet-in-house-from-moon planet=4 house=10
//      → relationships.transitHouses[4] = 10
//   3. dasha lord-rules-or-occupies house 10
//      → dashaLord=6, houseRulers[10]=6 → 6===6 ✓
//
// All 3 conditions fire → isFullMatch = true

function makeCareerPeakChart(): ConvergenceInput {
  // Ascendant Aries (1), Moon sign Aries (1)
  const ascendant = 1;
  const moonSign = 1;

  // Saturn (id=6) in house 3, sign 3 — strong (shadbala > 1.0, not dusthana)
  const planets = [
    makePlanet(6, 3, 3, { shadbala: 1.4 }), // Saturn — lord of house 10 in Aries asc
  ];

  // Houses: we need house 10 with lordId=6 (Saturn rules 10th in Aries ascendant = Capricorn)
  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    // In Aries asc: house N has sign N. House 10 = Capricorn (sign 10), lord = Saturn (6)
    const sign = ((ascendant - 1 + i) % 12) + 1;
    // Simplified lord mapping for Aries asc
    const lordMap: Record<number, number> = {
      1: 2,  // Aries → Mars
      2: 5,  // Taurus → Venus
      3: 3,  // Gemini → Mercury
      4: 1,  // Cancer → Moon
      5: 0,  // Leo → Sun
      6: 3,  // Virgo → Mercury
      7: 5,  // Libra → Venus
      8: 2,  // Scorpio → Mars
      9: 4,  // Sagittarius → Jupiter
      10: 6, // Capricorn → Saturn
      11: 6, // Aquarius → Saturn
      12: 4, // Pisces → Jupiter
    };
    return makeHouse(houseNum, sign, lordMap[houseNum] ?? 0);
  });

  const relationships = {
    houseRulers: {
      1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3,
      7: 5, 8: 2, 9: 4, 10: 6, 11: 6, 12: 4,
    },
    planetHouses: {
      6: 3, // Saturn in house 3
    },
    planetSigns: {
      6: 3,
    },
    // Jupiter (4) transiting sign 10 from moon sign 1 → house 10 from moon
    transitHouses: {
      4: 10,
    },
    dashaLord: 6,
    antarLord: 0,
  };

  return {
    ascendant,
    moonSign,
    planets,
    houses,
    dashaLord: 6,  // Saturn
    antarLord: 0,  // Sun
    yogaIds: [],
    doshaIds: [],
    transits: [
      { planetId: 4, sign: 10, isRetrograde: false }, // Jupiter transiting Capricorn
    ],
    ashtakavargaSAV: neutralSAV(),
    ashtakavargaBPI: emptyBPI(),
    relationships,
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

// ─── Fixture: Quiet Chart ─────────────────────────────────────────────────────
//
// A chart where no pattern fires at all — no meaningful convergences.
// All lords weak (shadbala < 1.0), no transits aligned, neutral dasha.

function makeQuietChart(): ConvergenceInput {
  const planets = [
    makePlanet(0, 1, 1, { shadbala: 0.5 }), // Sun — weak
    makePlanet(1, 2, 2, { shadbala: 0.5 }), // Moon — weak
  ];

  const houses = Array.from({ length: 12 }, (_, i) => {
    const houseNum = i + 1;
    return makeHouse(houseNum, houseNum, 0); // all lords = Sun (id=0)
  });

  const relationships = {
    houseRulers: Object.fromEntries(
      Array.from({ length: 12 }, (_, i) => [i + 1, 0]),
    ),
    planetHouses: { 0: 1, 1: 2 },
    planetSigns: { 0: 1, 1: 2 },
    transitHouses: {}, // no transits aligned
    dashaLord: 3,      // Mercury — rules nothing relevant
    antarLord: 3,
  };

  return {
    ascendant: 3,
    moonSign: 5,
    planets,
    houses,
    dashaLord: 3,
    antarLord: 3,
    yogaIds: [],
    doshaIds: [],
    transits: [],
    ashtakavargaSAV: neutralSAV(),
    ashtakavargaBPI: emptyBPI(),
    relationships,
    dashaTransitionWithin6Months: false,
    navamshaConfirmations: {},
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('runConvergenceEngine', () => {
  describe('career peak chart', () => {
    it('detects the career-peak pattern with isFullMatch = true', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      const careerPeak = result.patterns.find((p) => p.patternId === 'career-peak');
      expect(careerPeak).toBeDefined();
      expect(careerPeak!.isFullMatch).toBe(true);
    });

    it('produces executive insights with length > 0', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.executive.insights.length).toBeGreaterThan(0);
    });

    it('produces activation > 0', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.executive.activation).toBeGreaterThan(0);
    });

    it('executive insight for career-peak uses Convergence suffix (full match)', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      const insight = result.executive.insights.find((i) =>
        i.relatedPatterns.includes('career-peak'),
      );
      expect(insight).toBeDefined();
      expect(insight!.theme).toContain('Convergence');
    });

    it('favorability is positive for career-peak chart', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.executive.favorability).toBeGreaterThan(0);
    });
  });

  describe('quiet chart', () => {
    it('tone is quiet when no patterns match', () => {
      const result = runConvergenceEngine(makeQuietChart());
      expect(result.executive.tone).toBe('quiet');
    });

    it('patterns array is empty for quiet chart', () => {
      const result = runConvergenceEngine(makeQuietChart());
      expect(result.patterns.length).toBe(0);
    });

    it('activation is 0 for quiet chart', () => {
      const result = runConvergenceEngine(makeQuietChart());
      expect(result.executive.activation).toBe(0);
    });
  });

  describe('result structure', () => {
    it('result has valid version string matching CONVERGENCE_VERSION', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.version).toBe(CONVERGENCE_VERSION);
    });

    it('patterns are sorted by finalScore descending', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      for (let i = 1; i < result.patterns.length; i++) {
        expect(result.patterns[i - 1].finalScore).toBeGreaterThanOrEqual(
          result.patterns[i].finalScore,
        );
      }
    });

    it('computedAt is a valid ISO date string', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(() => new Date(result.computedAt)).not.toThrow();
      expect(new Date(result.computedAt).toISOString()).toBe(result.computedAt);
    });

    it('transitOverlay is empty (Phase 2 placeholder)', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.transitOverlay.snapshot).toHaveLength(0);
      expect(result.transitOverlay.retroStatus).toHaveLength(0);
      expect(result.transitOverlay.combustStatus).toHaveLength(0);
      expect(result.transitOverlay.ashtakavargaHighlights).toHaveLength(0);
    });

    it('metaInsights is empty array (not populated in engine)', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      expect(result.executive.metaInsights).toHaveLength(0);
    });
  });

  describe('dasha transition urgent flag', () => {
    it('adds an urgent flag when dashaTransitionWithin6Months is true', () => {
      const input = makeCareerPeakChart();
      input.dashaTransitionWithin6Months = true;
      const result = runConvergenceEngine(input);
      expect(result.executive.urgentFlags.length).toBeGreaterThan(0);
      expect(result.executive.urgentFlags[0].severity).toBe(3);
      expect(result.executive.urgentFlags[0].icon).toBe('transition');
    });

    it('does not add urgent flag when dashaTransitionWithin6Months is false', () => {
      const input = makeCareerPeakChart();
      input.dashaTransitionWithin6Months = false;
      const result = runConvergenceEngine(input);
      const transitionFlags = result.executive.urgentFlags.filter(
        (f) => f.icon === 'transition',
      );
      expect(transitionFlags).toHaveLength(0);
    });
  });

  describe('section markers', () => {
    it('populates sectionMarkers from matched pattern relatedSections', () => {
      const result = runConvergenceEngine(makeCareerPeakChart());
      // career-peak has relatedSections: [PlanetInsights, DashaSynthesis, LifeAreas]
      const allMarkedPatternIds = Object.values(result.sectionMarkers).flat();
      expect(allMarkedPatternIds).toContain('career-peak');
    });
  });
});

/**
 * Tests for personal transit calculations
 * Validates computePersonalTransits and computeUpcomingTransitions
 */
import { describe, it, expect } from 'vitest';
import { computePersonalTransits, computeUpcomingTransitions } from '../personal-transits';
import type { PersonalTransit, UpcomingTransition } from '../personal-transits';

describe('computePersonalTransits', () => {
  // SAV table: 12 entries (one per sign), typical values 18-35
  const sampleSavTable = [28, 25, 30, 22, 27, 31, 24, 19, 33, 26, 29, 21];

  it('returns an array of PersonalTransit objects for slow planets', () => {
    const ascendantSign = 1; // Aries
    const result = computePersonalTransits(ascendantSign, sampleSavTable);

    expect(Array.isArray(result)).toBe(true);
    // Should have entries for Saturn, Jupiter, Rahu, Ketu (4 slow planets)
    expect(result.length).toBe(4);
  });

  it('each transit has required fields with valid ranges', () => {
    const ascendantSign = 4; // Cancer
    const result = computePersonalTransits(ascendantSign, sampleSavTable);

    for (const transit of result) {
      // planetId must be one of the slow planets
      expect([4, 6, 7, 8]).toContain(transit.planetId);
      // currentSign 1-12
      expect(transit.currentSign).toBeGreaterThanOrEqual(1);
      expect(transit.currentSign).toBeLessThanOrEqual(12);
      // house 1-12
      expect(transit.house).toBeGreaterThanOrEqual(1);
      expect(transit.house).toBeLessThanOrEqual(12);
      // savBindu from the table
      expect(typeof transit.savBindu).toBe('number');
      // quality enum
      expect(['strong', 'neutral', 'weak']).toContain(transit.quality);
      // trilingual fields
      expect(transit.planetName.en).toBeTruthy();
      expect(transit.signName.en).toBeTruthy();
      expect(transit.interpretation.en).toBeTruthy();
      expect(transit.interpretation.hi).toBeTruthy();
      expect(transit.interpretation.sa).toBeTruthy();
    }
  });

  it('house is correctly computed from ascendant', () => {
    // If planet is in sign X and ascendant is sign X, house should be 1
    const ascendantSign = 1;
    const result = computePersonalTransits(ascendantSign, sampleSavTable);

    for (const transit of result) {
      const expectedHouse = ((transit.currentSign - ascendantSign + 12) % 12) + 1;
      expect(transit.house).toBe(expectedHouse);
    }
  });

  it('quality is determined by SAV bindu thresholds', () => {
    // Create a SAV table where all values are high (>= 28)
    const highSav = Array(12).fill(30);
    const result = computePersonalTransits(1, highSav);
    for (const transit of result) {
      expect(transit.quality).toBe('strong');
    }

    // All values low (< 22)
    const lowSav = Array(12).fill(18);
    const resultLow = computePersonalTransits(1, lowSav);
    for (const transit of resultLow) {
      expect(transit.quality).toBe('weak');
    }

    // Neutral range (22-27)
    const midSav = Array(12).fill(25);
    const resultMid = computePersonalTransits(1, midSav);
    for (const transit of resultMid) {
      expect(transit.quality).toBe('neutral');
    }
  });

  it('handles different ascendant signs correctly', () => {
    for (let asc = 1; asc <= 12; asc++) {
      const result = computePersonalTransits(asc, sampleSavTable);
      expect(result.length).toBe(4);
      for (const transit of result) {
        expect(transit.house).toBeGreaterThanOrEqual(1);
        expect(transit.house).toBeLessThanOrEqual(12);
      }
    }
  });

  it('uses savBindu from the correct sign index', () => {
    const result = computePersonalTransits(1, sampleSavTable);
    for (const transit of result) {
      // savBindu should match the SAV table at sign - 1 index
      expect(transit.savBindu).toBe(sampleSavTable[transit.currentSign - 1]);
    }
  });

  it('handles empty SAV table gracefully (defaults to 0)', () => {
    const result = computePersonalTransits(1, []);
    expect(result.length).toBe(4);
    for (const transit of result) {
      expect(transit.savBindu).toBe(0);
      expect(transit.quality).toBe('weak'); // 0 < 22 → weak
    }
  });
});

describe('computeUpcomingTransitions', () => {
  it('returns an array of UpcomingTransition objects', () => {
    const result = computeUpcomingTransitions();
    expect(Array.isArray(result)).toBe(true);
  });

  it('each transition has required fields', () => {
    const result = computeUpcomingTransitions();
    for (const transition of result) {
      expect([4, 6, 7, 8]).toContain(transition.planetId);
      expect(transition.planetName.en).toBeTruthy();
      expect(transition.fromSign.en).toBeTruthy();
      expect(transition.toSign.en).toBeTruthy();
      expect(transition.approximateDate).toBeTruthy();
      // Date format: "Mon YYYY"
      expect(transition.approximateDate).toMatch(/[A-Z][a-z]{2}\s+\d{4}/);
    }
  });

  it('fromSign and toSign are always different for each transition', () => {
    const result = computeUpcomingTransitions();
    for (const transition of result) {
      // The whole point of a transition is that the sign changes
      expect(transition.fromSign.en).not.toBe(transition.toSign.en);
    }
  });

  it('only includes slow planets (Saturn, Jupiter, Rahu, Ketu)', () => {
    const result = computeUpcomingTransitions();
    const validIds = [4, 6, 7, 8];
    for (const transition of result) {
      expect(validIds).toContain(transition.planetId);
    }
  });
});

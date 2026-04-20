/**
 * Tests for Task 6: Life Overview + Cross-Domain Links
 *
 * Tests are intentionally kept in a separate file from domain-synthesis.test.ts
 * to avoid test runner conflicts.
 */

import { describe, it, expect } from 'vitest';
import {
  generateLifeOverview,
  type OverviewInput,
} from '@/lib/kundali/domain-synthesis/life-overview';
import {
  detectCrossDomainLinks,
  type CrossDomainInput,
} from '@/lib/kundali/domain-synthesis/cross-domain';

// ---------------------------------------------------------------------------
// generateLifeOverview
// ---------------------------------------------------------------------------

describe('generateLifeOverview', () => {
  const baseInput: OverviewInput = {
    ascendantSign: 1,            // Aries
    atmakarakaPlanetId: 4,       // Jupiter — "a teacher"
    strongestHouseNumber: 10,    // career and public impact
    currentMahadashaLordId: 6,   // Saturn — "a builder"
    nativeAge: 38,               // consolidation phase
  };

  it('produces non-empty en and hi text for a typical chart', () => {
    const result = generateLifeOverview(baseInput);
    expect(result.en.length).toBeGreaterThan(50);
    expect(result.hi.length).toBeGreaterThan(20);
  });

  it('en text contains the AK archetype for Jupiter', () => {
    const result = generateLifeOverview(baseInput);
    expect(result.en).toContain('a teacher');
  });

  it('en text contains the sign essence for Aries', () => {
    const result = generateLifeOverview(baseInput);
    expect(result.en).toContain('pioneering fire');
  });

  it('en text contains the house theme for house 10', () => {
    const result = generateLifeOverview(baseInput);
    expect(result.en).toContain('career and public impact');
  });

  it('en text contains the dasha archetype for Saturn', () => {
    const result = generateLifeOverview(baseInput);
    expect(result.en).toContain('a builder');
  });

  it('uses "building" phase for age < 35', () => {
    const result = generateLifeOverview({ ...baseInput, nativeAge: 28 });
    expect(result.en).toContain('building');
  });

  it('uses "consolidation" phase for age 35-49', () => {
    const result = generateLifeOverview({ ...baseInput, nativeAge: 42 });
    expect(result.en).toContain('consolidation');
  });

  it('uses "harvest" phase for age 50-64', () => {
    const result = generateLifeOverview({ ...baseInput, nativeAge: 55 });
    expect(result.en).toContain('harvest');
  });

  it('uses "legacy" phase for age 65+', () => {
    const result = generateLifeOverview({ ...baseInput, nativeAge: 70 });
    expect(result.en).toContain('legacy');
  });

  it('hi text contains the expected phase word for consolidation', () => {
    const result = generateLifeOverview({ ...baseInput, nativeAge: 42 });
    expect(result.hi).toContain('सुदृढ़ीकरण');
  });

  it('falls back gracefully for out-of-range planet id', () => {
    const result = generateLifeOverview({
      ...baseInput,
      atmakarakaPlanetId: 99,
    });
    // Should not throw; should produce valid text
    expect(result.en.length).toBeGreaterThan(50);
    expect(result.hi.length).toBeGreaterThan(20);
    // Fallback archetype used
    expect(result.en).toContain('a seeker');
  });

  it('falls back gracefully for out-of-range ascendant sign', () => {
    const result = generateLifeOverview({
      ...baseInput,
      ascendantSign: 0,
    });
    expect(result.en.length).toBeGreaterThan(50);
  });

  it('works for every valid planet id (0-8) without throwing', () => {
    for (let pid = 0; pid <= 8; pid++) {
      expect(() =>
        generateLifeOverview({ ...baseInput, atmakarakaPlanetId: pid }),
      ).not.toThrow();
    }
  });

  it('works for every valid rashi (1-12) without throwing', () => {
    for (let sign = 1; sign <= 12; sign++) {
      expect(() =>
        generateLifeOverview({ ...baseInput, ascendantSign: sign }),
      ).not.toThrow();
    }
  });
});

// ---------------------------------------------------------------------------
// detectCrossDomainLinks
// ---------------------------------------------------------------------------

describe('detectCrossDomainLinks', () => {
  /**
   * Helper: build standard house-lord array where Saturn (6) lords house 10
   * and house 7, with other houses getting default lords.
   */
  function buildHouseLords(
    overrides: Record<number, number> = {},
  ): { house: number; lordId: number }[] {
    // Default lords: house N → planet (N-1) % 9 (just for test purposes)
    const defaults: { house: number; lordId: number }[] = Array.from(
      { length: 12 },
      (_, i) => ({ house: i + 1, lordId: i % 9 }),
    );
    return defaults.map((entry) =>
      overrides[entry.house] !== undefined
        ? { house: entry.house, lordId: overrides[entry.house] }
        : entry,
    );
  }

  /** Standard planet-house array (planet id → house id, 1-indexed) */
  function buildPlanetHouses(
    map: Record<number, number> = {},
  ): { planetId: number; house: number }[] {
    return Array.from({ length: 9 }, (_, pid) => ({
      planetId: pid,
      house: map[pid] ?? ((pid % 12) + 1),
    }));
  }

  it('detects shared lord when Saturn (6) lords both house 10 (career) and house 7 (marriage)', () => {
    // career primary houses: [10, 6], marriage primary houses: [7]
    // Saturn lords both 10 and 7
    const input: CrossDomainInput = {
      houseLords: buildHouseLords({ 10: 6, 7: 6 }),
      planetHouses: buildPlanetHouses(),
    };

    const links = detectCrossDomainLinks(input);
    // Should find the career-marriage connection
    const found = links.some(
      (l) =>
        (l.linkedDomain === 'career' || l.linkedDomain === 'marriage') &&
        l.linkType === 'depends_on',
    );
    expect(found).toBe(true);
  });

  it('returns at most 5 links regardless of chart complexity', () => {
    // Use a chart where many planets are shared lords to maximise connections
    const input: CrossDomainInput = {
      // All houses lorded by planet 4 (Jupiter) to maximise overlaps
      houseLords: Array.from({ length: 12 }, (_, i) => ({
        house: i + 1,
        lordId: 4,
      })),
      planetHouses: buildPlanetHouses(),
    };

    const links = detectCrossDomainLinks(input);
    expect(links.length).toBeLessThanOrEqual(5);
  });

  it('handles empty input gracefully and returns an empty array', () => {
    const input: CrossDomainInput = {
      houseLords: [],
      planetHouses: [],
    };
    const links = detectCrossDomainLinks(input);
    expect(links).toEqual([]);
  });

  it('returns an array (possibly empty) when only house lords are provided', () => {
    const input: CrossDomainInput = {
      houseLords: buildHouseLords(),
      planetHouses: [],
    };
    const links = detectCrossDomainLinks(input);
    expect(Array.isArray(links)).toBe(true);
  });

  it('each link has a linkedDomain, linkType, and non-empty explanation', () => {
    const input: CrossDomainInput = {
      houseLords: buildHouseLords({ 10: 6, 7: 6 }),
      planetHouses: buildPlanetHouses(),
    };
    const links = detectCrossDomainLinks(input);
    for (const link of links) {
      expect(link.linkedDomain).toBeTruthy();
      expect(['supports', 'conflicts', 'depends_on']).toContain(link.linkType);
      expect(link.explanation.en.length).toBeGreaterThan(20);
      expect(link.explanation.hi.length).toBeGreaterThan(10);
    }
  });

  it('does not produce duplicate domain-pair links (max 5)', () => {
    const input: CrossDomainInput = {
      // Saturn lords houses used by multiple domain pairs
      houseLords: buildHouseLords({ 10: 6, 7: 6, 2: 6, 9: 6 }),
      planetHouses: buildPlanetHouses(),
    };
    const links = detectCrossDomainLinks(input);

    // Result is capped at 5
    expect(links.length).toBeLessThanOrEqual(5);
    // Each (source-implied) domain pair is unique — verified by checking that
    // the same linkedDomain does not appear with the same explanation text twice
    const explanations = links.map((l) => l.explanation.en);
    const uniqueExplanations = new Set(explanations);
    expect(uniqueExplanations.size).toBe(explanations.length);
  });

  it('detects planet-overlap link when Jupiter (4) sits in house 7 (marriage primary house)', () => {
    // Jupiter is a primary planet for: wealth [4], marriage [5→4], children [4], spiritual [4]
    // Wealth primary planets: [4, 5, 3]; marriage primary houses: [7]
    const input: CrossDomainInput = {
      houseLords: buildHouseLords(),
      // Jupiter in house 7
      planetHouses: buildPlanetHouses({ 4: 7 }),
    };
    const links = detectCrossDomainLinks(input);
    // Should find at least one overlap-based link involving marriage domain
    const found = links.some((l) => l.linkedDomain === 'marriage');
    expect(found).toBe(true);
  });
});

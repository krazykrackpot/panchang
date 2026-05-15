/**
 * Yoga Interaction Tests (G4)
 *
 * Tests the three interaction types: clusters, same-planet conflicts,
 * and cross-yoga cancellations. Uses the existing Arjun (Aquarius lagna)
 * chart fixture + synthetic yoga arrays for targeted testing.
 */

import { describe, it, expect } from 'vitest';
import { analyseInteractions } from '../interactions';
import type { EvaluatedYoga, YogaContext, YogaGroup } from '../types';

// ─── Minimal mock context for cross-cancellation house lord lookups ───

const mockCtx: YogaContext = {
  ascendantSign: 11, // Aquarius
  ascendantLongitude: 300,
  planets: [],
  houseSigns: { 1: 11, 2: 12, 3: 1, 4: 2, 5: 3, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8, 11: 9, 12: 10 },
  planetHouse: () => 1,
  planetSign: () => 1,
  planetLongitude: () => 0,
  planetDegreeInSign: () => 0,
  isRetrograde: () => false,
  isCombust: () => false,
  houseSign: (h: number) => ((h + 9) % 12) + 1, // Aquarius=11 as 1st
  houseLord: (h: number) => {
    // Sign lords for Aquarius lagna
    const signLords: Record<number, number> = { 11: 6, 12: 4, 1: 2, 2: 5, 3: 3, 4: 1, 5: 0, 6: 3, 7: 5, 8: 2, 9: 4, 10: 6 };
    const sign = ((h + 9) % 12) + 1;
    return signLords[sign] ?? 0;
  },
  dignity: () => 'neutral',
  isKendra: (h: number) => [1, 4, 7, 10].includes(h),
  isTrikona: (h: number) => [1, 5, 9].includes(h),
  isDusthana: (h: number) => [6, 8, 12].includes(h),
  isUpachaya: (h: number) => [3, 6, 10, 11].includes(h),
  areConjunct: () => false,
  doesAspect: () => false,
  isNaturalBenefic: (id: number) => [1, 3, 4, 5].includes(id),
  isFunctionalBenefic: () => false,
  isYogakaraka: (id: number) => id === 5, // Venus for Aquarius
  planetsInHouse: () => [],
  houseOffset: () => 1,
};

// ─── Yoga factory ───

function makeYoga(overrides: Partial<EvaluatedYoga> & { id: string; group: YogaGroup }): EvaluatedYoga {
  return {
    name: { en: overrides.id, hi: overrides.id, sa: overrides.id },
    isAuspicious: true,
    present: true,
    strength: 'Moderate',
    classicalRef: '',
    formationRule: { en: '', hi: '' },
    description: { en: '', hi: '' },
    involvedPlanets: [],
    affectedDomains: 'all',
    domainImpactWeight: 2,
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// B: Cluster Detection
// ─────────────────────────────────────────────────────────────────────────────

describe('Cluster Detection', () => {
  it('no cluster when only 1 raja yoga', () => {
    const yogas = [makeYoga({ id: 'raja-1', group: 'raja' })];
    analyseInteractions(yogas, mockCtx);
    expect(yogas[0].interactions).toBeUndefined();
  });

  it('2-yoga cluster: boosts weakest by 1 tier', () => {
    const yogas = [
      makeYoga({ id: 'raja-1', group: 'raja', strength: 'Strong' }),
      makeYoga({ id: 'raja-2', group: 'raja', strength: 'Moderate' }),
    ];
    analyseInteractions(yogas, mockCtx);

    // raja-2 (weaker) should be boosted to Strong
    expect(yogas[1].strength).toBe('Strong');
    expect(yogas[1].interactions).toHaveLength(1);
    expect(yogas[1].interactions![0].type).toBe('cluster_boost');
    expect(yogas[1].interactions![0].strengthDelta).toBe(1);

    // raja-1 (stronger) gets informational cluster note
    expect(yogas[0].interactions).toHaveLength(1);
    expect(yogas[0].interactions![0].strengthDelta).toBe(0);
  });

  it('3-yoga cluster: boosts all non-Strong', () => {
    const yogas = [
      makeYoga({ id: 'raja-1', group: 'raja', strength: 'Strong' }),
      makeYoga({ id: 'raja-2', group: 'raja', strength: 'Moderate' }),
      makeYoga({ id: 'raja-3', group: 'raja', strength: 'Weak' }),
    ];
    analyseInteractions(yogas, mockCtx);

    expect(yogas[0].strength).toBe('Strong'); // was Strong, stays Strong
    expect(yogas[1].strength).toBe('Strong'); // was Moderate, boosted
    expect(yogas[2].strength).toBe('Moderate'); // was Weak, boosted
  });

  it('does not cluster non-clustereable groups (chandra)', () => {
    const yogas = [
      makeYoga({ id: 'chandra-1', group: 'chandra', strength: 'Moderate' }),
      makeYoga({ id: 'chandra-2', group: 'chandra', strength: 'Moderate' }),
    ];
    analyseInteractions(yogas, mockCtx);
    expect(yogas[0].interactions).toBeUndefined();
    expect(yogas[1].interactions).toBeUndefined();
  });

  it('does not cluster non-present yogas', () => {
    const yogas = [
      makeYoga({ id: 'raja-1', group: 'raja', present: true }),
      makeYoga({ id: 'raja-2', group: 'raja', present: false }),
    ];
    analyseInteractions(yogas, mockCtx);
    expect(yogas[0].interactions).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// A: Same-Planet Conflicts
// ─────────────────────────────────────────────────────────────────────────────

describe('Same-Planet Conflicts', () => {
  it('detects conflict when planet in both auspicious and inauspicious yoga', () => {
    const yogas = [
      makeYoga({ id: 'good-yoga', group: 'raja', isAuspicious: true, involvedPlanets: [4] }), // Jupiter
      makeYoga({ id: 'bad-yoga', group: 'dosha', isAuspicious: false, involvedPlanets: [4] }), // Jupiter
    ];
    analyseInteractions(yogas, mockCtx);

    expect(yogas[0].interactions).toHaveLength(1);
    expect(yogas[0].interactions![0].type).toBe('planet_conflict');
    expect(yogas[0].interactions![0].strengthDelta).toBe(0); // informational only
    expect(yogas[0].interactions![0].description.en).toContain('Jupiter');

    expect(yogas[1].interactions).toHaveLength(1);
    expect(yogas[1].interactions![0].type).toBe('planet_conflict');
  });

  it('no conflict when both yogas are auspicious', () => {
    const yogas = [
      makeYoga({ id: 'good-1', group: 'raja', isAuspicious: true, involvedPlanets: [4] }),
      makeYoga({ id: 'good-2', group: 'dhana', isAuspicious: true, involvedPlanets: [4] }),
    ];
    analyseInteractions(yogas, mockCtx);
    // No planet_conflict (both auspicious)
    const conflicts = yogas.flatMap(y => y.interactions ?? []).filter(i => i.type === 'planet_conflict');
    expect(conflicts).toHaveLength(0);
  });

  it('excludes Rahu/Ketu from conflict detection', () => {
    const yogas = [
      makeYoga({ id: 'good-yoga', group: 'raja', isAuspicious: true, involvedPlanets: [7] }), // Rahu
      makeYoga({ id: 'bad-yoga', group: 'dosha', isAuspicious: false, involvedPlanets: [7] }), // Rahu
    ];
    analyseInteractions(yogas, mockCtx);
    const conflicts = yogas.flatMap(y => y.interactions ?? []).filter(i => i.type === 'planet_conflict');
    expect(conflicts).toHaveLength(0);
  });

  it('no conflict when inauspicious yoga is not present', () => {
    const yogas = [
      makeYoga({ id: 'good-yoga', group: 'raja', isAuspicious: true, involvedPlanets: [4], present: true }),
      makeYoga({ id: 'bad-yoga', group: 'dosha', isAuspicious: false, involvedPlanets: [4], present: false }),
    ];
    analyseInteractions(yogas, mockCtx);
    const conflicts = yogas.flatMap(y => y.interactions ?? []).filter(i => i.type === 'planet_conflict');
    expect(conflicts).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// C: Cross-Yoga Cancellation
// ─────────────────────────────────────────────────────────────────────────────

describe('Cross-Yoga Cancellation', () => {
  it('dhana + daridra sharing a planet → both weakened', () => {
    const yogas = [
      makeYoga({ id: 'dhana-1', group: 'dhana', isAuspicious: true, strength: 'Strong', involvedPlanets: [4] }),
      makeYoga({ id: 'daridra-1', group: 'dhana', isAuspicious: false, strength: 'Moderate', involvedPlanets: [4] }),
    ];
    analyseInteractions(yogas, mockCtx);

    expect(yogas[0].strength).toBe('Moderate'); // Strong → Moderate
    expect(yogas[1].strength).toBe('Weak'); // Moderate → Weak
    expect(yogas[0].interactions!.find(i => i.type === 'cross_cancellation')).toBeDefined();
    expect(yogas[1].interactions!.find(i => i.type === 'cross_cancellation')).toBeDefined();
  });

  it('raja + arishta sharing a planet → raja weakened, arishta informational', () => {
    const yogas = [
      makeYoga({ id: 'raja-1', group: 'raja', isAuspicious: true, strength: 'Strong', involvedPlanets: [6] }),
      makeYoga({ id: 'arishta-1', group: 'arishta', isAuspicious: false, strength: 'Moderate', involvedPlanets: [6] }),
    ];
    analyseInteractions(yogas, mockCtx);

    expect(yogas[0].strength).toBe('Moderate'); // Raja weakened
    expect(yogas[1].strength).toBe('Moderate'); // Arishta unchanged
    expect(yogas[0].interactions!.find(i => i.type === 'cross_cancellation')!.strengthDelta).toBe(-1);
    expect(yogas[1].interactions!.find(i => i.type === 'cross_cancellation')!.strengthDelta).toBe(0);
  });

  it('dhana + daridra NOT sharing a planet → no cancellation', () => {
    const yogas = [
      makeYoga({ id: 'dhana-1', group: 'dhana', isAuspicious: true, involvedPlanets: [4] }),
      makeYoga({ id: 'daridra-1', group: 'dhana', isAuspicious: false, involvedPlanets: [6] }),
    ];
    analyseInteractions(yogas, mockCtx);
    const cancellations = yogas.flatMap(y => y.interactions ?? []).filter(i => i.type === 'cross_cancellation');
    expect(cancellations).toHaveLength(0);
  });

  it('cluster boost + cross-cancellation net to correct result', () => {
    // 2 dhana yogas (cluster) + 1 daridra sharing a planet with one
    const yogas = [
      makeYoga({ id: 'dhana-1', group: 'dhana', isAuspicious: true, strength: 'Moderate', involvedPlanets: [4] }),
      makeYoga({ id: 'dhana-2', group: 'dhana', isAuspicious: true, strength: 'Weak', involvedPlanets: [5] }),
      makeYoga({ id: 'daridra-1', group: 'dhana', isAuspicious: false, strength: 'Moderate', involvedPlanets: [4] }),
    ];
    analyseInteractions(yogas, mockCtx);

    // Cluster: dhana-1 (Moderate) and dhana-2 (Weak). Only auspicious ones cluster.
    // dhana-2 boosted Weak → Moderate
    // Then cross-cancellation: dhana-1 shares planet 4 with daridra-1 → dhana-1 weakened
    // dhana-1: Moderate → Weak (cross-cancellation)
    expect(yogas[0].strength).toBe('Weak'); // cluster didn't boost (was stronger), then cross-cancelled
    expect(yogas[1].strength).toBe('Moderate'); // boosted by cluster
    expect(yogas[2].strength).toBe('Weak'); // daridra weakened by cross-cancellation
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Edge cases
// ─────────────────────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  it('handles empty yoga array', () => {
    const yogas: EvaluatedYoga[] = [];
    analyseInteractions(yogas, mockCtx);
    expect(yogas).toHaveLength(0);
  });

  it('handles single yoga', () => {
    const yogas = [makeYoga({ id: 'solo', group: 'raja' })];
    analyseInteractions(yogas, mockCtx);
    expect(yogas[0].interactions).toBeUndefined();
  });

  it('strength never exceeds Strong', () => {
    const yogas = [
      makeYoga({ id: 'raja-1', group: 'raja', strength: 'Strong' }),
      makeYoga({ id: 'raja-2', group: 'raja', strength: 'Strong' }),
      makeYoga({ id: 'raja-3', group: 'raja', strength: 'Strong' }),
    ];
    analyseInteractions(yogas, mockCtx);
    for (const y of yogas) expect(y.strength).toBe('Strong');
  });

  it('strength never goes below Weak', () => {
    const yogas = [
      makeYoga({ id: 'dhana-1', group: 'dhana', isAuspicious: true, strength: 'Weak', involvedPlanets: [4] }),
      makeYoga({ id: 'daridra-1', group: 'dhana', isAuspicious: false, strength: 'Weak', involvedPlanets: [4] }),
    ];
    analyseInteractions(yogas, mockCtx);
    for (const y of yogas) expect(y.strength).toBe('Weak');
  });
});

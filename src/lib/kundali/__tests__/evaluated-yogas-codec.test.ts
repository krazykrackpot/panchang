/**
 * Round-trip identity + edge-case tests for the evaluatedYogas codec.
 *
 * The contract: strip → store → rehydrate produces an object whose
 * downstream consumers cannot distinguish from the original. Anything
 * that breaks this round-trip is a regression that would put dirty
 * yoga prose on user-facing pages.
 */
import { describe, it, expect } from 'vitest';
import {
  stripEvaluatedYoga,
  rehydrateEvaluatedYoga,
  stripKundaliForStorage,
  rehydrateKundali,
  type StoredEvaluatedYoga,
} from '@/lib/kundali/evaluated-yogas-codec';
import { ALL_YOGA_RULES } from '@/lib/kundali/yoga-engine/rules';
import type { EvaluatedYoga } from '@/lib/kundali/yoga-engine/types';
import type { KundaliData } from '@/types/kundali';

function ruleToEvaluated(
  rule: (typeof ALL_YOGA_RULES)[number],
  overrides: Partial<EvaluatedYoga> = {},
): EvaluatedYoga {
  return {
    id: rule.id,
    name: rule.name,
    group: rule.group,
    ...(rule.subGroup !== undefined && { subGroup: rule.subGroup }),
    isAuspicious: rule.isAuspicious,
    present: false,
    strength: 'Weak',
    classicalRef: rule.classicalRef,
    formationRule: rule.formationRule,
    description: rule.description,
    involvedPlanets: [],
    affectedDomains: rule.affectedDomains,
    domainImpactWeight: rule.domainImpactWeight,
    ...(rule.domainWeights !== undefined && { domainWeights: rule.domainWeights }),
    ...overrides,
  };
}

describe('stripEvaluatedYoga', () => {
  it('keeps exactly the chart-specific fields', () => {
    const rule = ALL_YOGA_RULES.find(r => r.id === 'ruchaka')!;
    const full = ruleToEvaluated(rule, {
      present: true,
      strength: 'Strong',
      involvedPlanets: [2],
    });
    const stored = stripEvaluatedYoga(full);
    expect(Object.keys(stored).sort()).toEqual(
      ['id', 'involvedPlanets', 'present', 'strength'].sort(),
    );
    expect(stored.id).toBe('ruchaka');
    expect(stored.present).toBe(true);
    expect(stored.strength).toBe('Strong');
    expect(stored.involvedPlanets).toEqual([2]);
  });

  it('preserves optional cancellation/interaction/pattern fields when present', () => {
    const rule = ALL_YOGA_RULES[0];
    const full = ruleToEvaluated(rule, {
      present: true,
      strength: 'Moderate',
      cancellationStatus: {
        anyCancelled: false,
        details: [{ cancelled: false, reason: 'no cancellation rules fired', effect: 'cancel' }],
      },
      patternData: { startHouse: 1, endHouse: 5, chainLength: 5 },
    });
    const stored = stripEvaluatedYoga(full);
    expect(stored.cancellationStatus).toBeDefined();
    expect(stored.patternData).toEqual({ startHouse: 1, endHouse: 5, chainLength: 5 });
  });

  it('omits undefined optional fields entirely (no `key: undefined`)', () => {
    const rule = ALL_YOGA_RULES[0];
    const full = ruleToEvaluated(rule);
    const stored = stripEvaluatedYoga(full);
    expect('cancellationStatus' in stored).toBe(false);
    expect('interactions' in stored).toBe(false);
    expect('patternData' in stored).toBe(false);
  });

  it('drops all catalog fields', () => {
    const rule = ALL_YOGA_RULES.find(r => r.id === 'gajakesari')!;
    const full = ruleToEvaluated(rule);
    const stored = stripEvaluatedYoga(full) as Record<string, unknown>;
    for (const k of ['name', 'description', 'classicalRef', 'formationRule', 'group', 'isAuspicious', 'affectedDomains', 'domainImpactWeight', 'domainWeights', 'subGroup']) {
      expect(k in stored).toBe(false);
    }
  });
});

describe('rehydrateEvaluatedYoga', () => {
  it('re-attaches all catalog fields from ALL_YOGA_RULES', () => {
    const rule = ALL_YOGA_RULES.find(r => r.id === 'ruchaka')!;
    const stored: StoredEvaluatedYoga = {
      id: 'ruchaka',
      present: true,
      strength: 'Strong',
      involvedPlanets: [2],
    };
    const rehydrated = rehydrateEvaluatedYoga(stored);
    expect(rehydrated.name).toEqual(rule.name);
    // Engine convention: sa falls back to en (engine.ts:218-223). Rehydrate mirrors.
    expect(rehydrated.description).toEqual({ en: rule.description.en, hi: rule.description.hi, sa: rule.description.en });
    expect(rehydrated.formationRule).toEqual({ en: rule.formationRule.en, hi: rule.formationRule.hi, sa: rule.formationRule.en });
    expect(rehydrated.classicalRef).toBe(rule.classicalRef);
    expect(rehydrated.group).toBe(rule.group);
    expect(rehydrated.isAuspicious).toBe(rule.isAuspicious);
    expect(rehydrated.affectedDomains).toEqual(rule.affectedDomains);
    expect(rehydrated.domainImpactWeight).toBe(rule.domainImpactWeight);
  });

  it('preserves chart-specific fields untouched', () => {
    const stored: StoredEvaluatedYoga = {
      id: 'gajakesari',
      present: true,
      strength: 'Strong',
      involvedPlanets: [1, 4],
      cancellationStatus: {
        anyCancelled: false,
        details: [],
      },
    };
    const rehydrated = rehydrateEvaluatedYoga(stored);
    expect(rehydrated.present).toBe(true);
    expect(rehydrated.strength).toBe('Strong');
    expect(rehydrated.involvedPlanets).toEqual([1, 4]);
    expect(rehydrated.cancellationStatus).toEqual(stored.cancellationStatus);
  });

  it('handles unknown yoga id without throwing (degrade gracefully)', () => {
    const stored: StoredEvaluatedYoga = {
      id: 'no-such-yoga',
      present: false,
      strength: 'Weak',
      involvedPlanets: [],
    };
    const rehydrated = rehydrateEvaluatedYoga(stored);
    expect(rehydrated.id).toBe('no-such-yoga');
    expect(rehydrated.name).toEqual({ en: 'no-such-yoga', hi: 'no-such-yoga', sa: 'no-such-yoga' });
    expect(rehydrated.description).toEqual({ en: '', hi: '', sa: '' });
    expect(rehydrated.formationRule).toEqual({ en: '', hi: '', sa: '' });
  });
});

describe('strip → rehydrate round-trip identity', () => {
  it('is exact for every yoga in ALL_YOGA_RULES (present=false)', () => {
    for (const rule of ALL_YOGA_RULES) {
      const original = ruleToEvaluated(rule);
      const stored = stripEvaluatedYoga(original);
      const rehydrated = rehydrateEvaluatedYoga(stored);
      // The rehydrated shape must be a superset of the original — every
      // catalog field present in original must equal what was restored.
      expect(rehydrated.id).toBe(original.id);
      expect(rehydrated.name).toEqual(original.name);
      // Engine convention: sa = en. ruleToEvaluated() creates the test
      // input from the rule directly (no `sa`); rehydrate adds it.
      expect(rehydrated.description.en).toBe(original.description.en);
      expect(rehydrated.description.hi).toBe(original.description.hi);
      expect(rehydrated.description.sa).toBe(original.description.en);
      expect(rehydrated.formationRule.en).toBe(original.formationRule.en);
      expect(rehydrated.formationRule.hi).toBe(original.formationRule.hi);
      expect(rehydrated.formationRule.sa).toBe(original.formationRule.en);
      expect(rehydrated.classicalRef).toBe(original.classicalRef);
      expect(rehydrated.group).toBe(original.group);
      expect(rehydrated.isAuspicious).toBe(original.isAuspicious);
      expect(rehydrated.affectedDomains).toEqual(original.affectedDomains);
      expect(rehydrated.domainImpactWeight).toBe(original.domainImpactWeight);
      expect(rehydrated.present).toBe(original.present);
      expect(rehydrated.strength).toBe(original.strength);
      expect(rehydrated.involvedPlanets).toEqual(original.involvedPlanets);
    }
  });

  it('preserves cancellation + pattern + interaction blobs verbatim', () => {
    const rule = ALL_YOGA_RULES[0];
    const original = ruleToEvaluated(rule, {
      present: true,
      strength: 'Moderate',
      cancellationStatus: {
        anyCancelled: true,
        details: [
          { cancelled: true, reason: 'Saturn aspects Mars', effect: 'cancel' },
          { cancelled: false, reason: 'Mars not retrograde', effect: 'weaken' },
        ],
      },
      patternData: { startHouse: 3, endHouse: 8, chainLength: 6, firstPlanet: 0, lastPlanet: 6 },
    });
    const round = rehydrateEvaluatedYoga(stripEvaluatedYoga(original));
    expect(round.cancellationStatus).toEqual(original.cancellationStatus);
    expect(round.patternData).toEqual(original.patternData);
  });
});

describe('stripKundaliForStorage / rehydrateKundali', () => {
  it('handles null / undefined input safely', () => {
    expect(stripKundaliForStorage(null as unknown as KundaliData)).toBeNull();
    expect(rehydrateKundali(null)).toBeNull();
    expect(rehydrateKundali(undefined)).toBeUndefined();
  });

  it('round-trips a kundali shape with evaluatedYogas', () => {
    const rule0 = ALL_YOGA_RULES[0];
    const rule1 = ALL_YOGA_RULES[1];
    const original = {
      ascendant: { sign: 1 },
      planets: [],
      evaluatedYogas: [
        ruleToEvaluated(rule0, { present: true, strength: 'Strong', involvedPlanets: [2] }),
        ruleToEvaluated(rule1, { present: false, strength: 'Weak', involvedPlanets: [] }),
      ],
    } as unknown as KundaliData;

    const stripped = stripKundaliForStorage(original);
    // Non-yoga fields preserved
    expect((stripped as unknown as { ascendant: { sign: number } }).ascendant.sign).toBe(1);
    // Yogas stripped — no catalog fields in storage
    const storedYogas = stripped.evaluatedYogas as unknown as Record<string, unknown>[];
    expect('name' in storedYogas[0]).toBe(false);
    expect('description' in storedYogas[0]).toBe(false);

    const rehydrated = rehydrateKundali(stripped)!;
    expect(rehydrated.evaluatedYogas).toHaveLength(2);
    expect(rehydrated.evaluatedYogas![0].name).toEqual(rule0.name);
    // Engine convention: sa = en (rehydrate mirrors).
    expect(rehydrated.evaluatedYogas![0].description.en).toBe(rule0.description.en);
    expect(rehydrated.evaluatedYogas![0].description.hi).toBe(rule0.description.hi);
    expect(rehydrated.evaluatedYogas![0].present).toBe(true);
    expect(rehydrated.evaluatedYogas![1].name).toEqual(rule1.name);
  });

  it('is a no-op for a kundali without evaluatedYogas', () => {
    const noYogas = { ascendant: { sign: 5 } } as unknown as KundaliData;
    expect(stripKundaliForStorage(noYogas)).toEqual(noYogas);
    expect(rehydrateKundali(noYogas)).toEqual(noYogas);
  });

  it('does not mutate the input', () => {
    const rule = ALL_YOGA_RULES[0];
    const original = {
      evaluatedYogas: [ruleToEvaluated(rule, { present: true, strength: 'Strong', involvedPlanets: [0] })],
    } as unknown as KundaliData;
    const snapshot = JSON.stringify(original);
    stripKundaliForStorage(original);
    expect(JSON.stringify(original)).toBe(snapshot);
    rehydrateKundali(original);
    expect(JSON.stringify(original)).toBe(snapshot);
  });
});

describe('dynamic affectedDomains (Malika / Parivartana)', () => {
  it('preserves a chart-specific affectedDomains override across the round-trip', () => {
    // graha-malika defaults to 'all' in the rule but the engine overrides
    // to a per-chart array via detection.customData.domains.
    const grahaRule = ALL_YOGA_RULES.find(r => r.id === 'graha-malika')!;
    const engineOutput = ruleToEvaluated(grahaRule, {
      present: true,
      strength: 'Moderate',
      involvedPlanets: [0, 1, 4],
      affectedDomains: ['children', 'education'],
    });
    const stored = stripEvaluatedYoga(engineOutput);
    expect(stored.affectedDomains).toEqual(['children', 'education']);
    const rehydrated = rehydrateEvaluatedYoga(stored);
    expect(rehydrated.affectedDomains).toEqual(['children', 'education']);
  });

  it('omits affectedDomains from storage when it matches the catalog default', () => {
    const ruchakaRule = ALL_YOGA_RULES.find(r => r.id === 'ruchaka')!;
    const engineOutput = ruleToEvaluated(ruchakaRule, {
      present: true,
      strength: 'Strong',
      involvedPlanets: [2],
      affectedDomains: ruchakaRule.affectedDomains,
    });
    const stored = stripEvaluatedYoga(engineOutput) as Record<string, unknown>;
    expect('affectedDomains' in stored).toBe(false);
    const rehydrated = rehydrateEvaluatedYoga(stored as StoredEvaluatedYoga);
    expect(rehydrated.affectedDomains).toEqual(ruchakaRule.affectedDomains);
  });
});

describe('storage size reduction (sanity check)', () => {
  it('strips ≥80% of bytes per yoga entry on average', () => {
    let originalBytes = 0;
    let storedBytes = 0;
    for (const rule of ALL_YOGA_RULES) {
      const e = ruleToEvaluated(rule, { present: false, strength: 'Weak', involvedPlanets: [] });
      originalBytes += JSON.stringify(e).length;
      storedBytes += JSON.stringify(stripEvaluatedYoga(e)).length;
    }
    const reduction = 1 - storedBytes / originalBytes;
    expect(reduction).toBeGreaterThan(0.8);
    expect(originalBytes).toBeGreaterThan(0);
  });
});

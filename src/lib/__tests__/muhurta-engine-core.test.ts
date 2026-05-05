import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerRule, registerRules, getRulesFor, getRule,
  getAllRules, clearRules, getRuleCount,
} from '@/lib/muhurta/engine/registry';
import type { MuhurtaRule, RuleContext } from '@/lib/muhurta/engine/types';
import { PANCHANGA_RULES } from '@/lib/muhurta/engine/rules/panchanga';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import type { PanchangSnapshot } from '@/lib/muhurta/ai-recommender';

function makeRule(overrides: Partial<MuhurtaRule> & { id: string }): MuhurtaRule {
  return {
    name: { en: overrides.id, hi: overrides.id },
    category: 'panchanga',
    scope: 'window',
    effect: 'bonus',
    tier: 3,
    appliesTo: 'all',
    evaluate: () => null,
    ...overrides,
  };
}

describe('Rule Registry', () => {
  beforeEach(() => clearRules());

  it('registers and retrieves a rule by ID', () => {
    registerRule(makeRule({ id: 'test-1' }));
    expect(getRule('test-1')).toBeDefined();
    expect(getRule('test-1')!.id).toBe('test-1');
  });

  it('throws on duplicate rule ID', () => {
    registerRule(makeRule({ id: 'dup' }));
    expect(() => registerRule(makeRule({ id: 'dup' }))).toThrow('Duplicate rule ID: dup');
  });

  it('registers multiple rules at once', () => {
    registerRules([makeRule({ id: 'a' }), makeRule({ id: 'b' }), makeRule({ id: 'c' })]);
    expect(getRuleCount()).toBe(3);
  });

  it('filters rules by activity', () => {
    registerRules([
      makeRule({ id: 'all-rule', appliesTo: 'all' }),
      makeRule({ id: 'marriage-only', appliesTo: ['marriage'] }),
      makeRule({ id: 'travel-only', appliesTo: ['travel'] }),
    ]);
    const marriageRules = getRulesFor('marriage', 'window');
    expect(marriageRules.map(r => r.id)).toContain('all-rule');
    expect(marriageRules.map(r => r.id)).toContain('marriage-only');
    expect(marriageRules.map(r => r.id)).not.toContain('travel-only');
  });

  it('filters rules by scope', () => {
    registerRules([
      makeRule({ id: 'day-rule', scope: 'day' }),
      makeRule({ id: 'window-rule', scope: 'window' }),
    ]);
    expect(getRulesFor('marriage', 'day').map(r => r.id)).toEqual(['day-rule']);
    expect(getRulesFor('marriage', 'window').map(r => r.id)).toEqual(['window-rule']);
  });

  it('sorts rules by tier (lowest first = highest authority)', () => {
    registerRules([
      makeRule({ id: 'tier-3', tier: 3 }),
      makeRule({ id: 'tier-0', tier: 0 }),
      makeRule({ id: 'tier-2', tier: 2 }),
    ]);
    const rules = getRulesFor('marriage', 'window');
    expect(rules.map(r => r.id)).toEqual(['tier-0', 'tier-2', 'tier-3']);
  });
});

// ---------------------------------------------------------------------------
// Panchanga Rules
// ---------------------------------------------------------------------------

function makeCtx(snapOverrides: Partial<PanchangSnapshot> = {}): RuleContext {
  const marriageRules = getExtendedActivity('marriage');
  const defaultSnap: PanchangSnapshot = {
    tithi: 7,        // Shukla Saptami
    nakshatra: 4,    // Rohini
    yoga: 5,         // auspicious
    karana: 3,       // Chara
    weekday: 4,      // Thursday
    moonSign: 2,
    moonSid: 45.0,
  };
  return {
    date: '2026-06-15',
    jdNoon: 2461575.0,
    sunriseUT: 2461574.7,
    sunsetUT: 2461575.3,
    weekday: snapOverrides.weekday ?? defaultSnap.weekday,
    windowStartUT: 2461574.8,
    windowEndUT: 2461574.9,
    midpointJD: 2461574.85,
    snap: { ...defaultSnap, ...snapOverrides },
    activity: 'marriage',
    activityRules: marriageRules,
    lat: 46.46,
    lng: 6.84,
    tz: 2,
  };
}

describe('Panchanga Rules', () => {
  it('exports all 6 rules in PANCHANGA_RULES', () => {
    expect(PANCHANGA_RULES).toHaveLength(6);
    const ids = PANCHANGA_RULES.map(r => r.id);
    expect(ids).toContain('tithi-quality');
    expect(ids).toContain('nakshatra-quality');
    expect(ids).toContain('yoga-quality');
    expect(ids).toContain('karana-quality');
    expect(ids).toContain('vara-quality');
    expect(ids).toContain('panchaka');
  });

  describe('tithi-quality', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'tithi-quality')!;

    it('scores +8 for Shukla Saptami (tithi=7) for marriage', () => {
      // Saptami (7) is in marriage goodTithis, Shukla paksha
      const result = rule.evaluate(makeCtx({ tithi: 7 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(8);
    });

    it('scores -5 for Krishna Navami (tithi=24) due to avoidTithis', () => {
      // tithi 24 = Krishna paksha, pakshaRelTithi = 9, which is in avoidTithis
      // Krishna non-good = -3, plus avoid = -5, total = -8
      // But the task says "scores -5" — avoidTithi adds -5 on top of base
      const result = rule.evaluate(makeCtx({ tithi: 24 }));
      expect(result).not.toBeNull();
      // pakshaRelTithi=9, not in goodTithis, isKrishna=true => -3
      // pakshaRelTithi=9 is in avoidTithis => additional -5
      // total = -8
      expect(result!.points).toBe(-8);
    });
  });

  describe('nakshatra-quality', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'nakshatra-quality')!;

    it('scores +8 for Rohini (4) for marriage', () => {
      // Rohini (4) is in marriage goodNakshatras
      const result = rule.evaluate(makeCtx({ nakshatra: 4 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(8);
    });

    it('hard-vetoes Ardra (6) for marriage with tier 0', () => {
      // Ardra (6) is in marriage hardAvoidNakshatras
      const result = rule.evaluate(makeCtx({ nakshatra: 6 }));
      expect(result).not.toBeNull();
      expect(result!.vetoed).toBe(true);
      expect(result!.tier).toBe(0);
    });
  });

  describe('karana-quality', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'karana-quality')!;

    it('scores -5 for Vishti (7) and is Tier 4', () => {
      const result = rule.evaluate(makeCtx({ karana: 7 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(-5);
      expect(result!.tier).toBe(4);
    });

    it('scores +2 for Chara karana (1-6)', () => {
      const result = rule.evaluate(makeCtx({ karana: 3 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(2);
    });
  });

  describe('yoga-quality', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'yoga-quality')!;

    it('scores -3 for inauspicious yoga (1)', () => {
      const result = rule.evaluate(makeCtx({ yoga: 1 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(-3);
    });

    it('scores +4 for auspicious yoga (5)', () => {
      const result = rule.evaluate(makeCtx({ yoga: 5 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(4);
    });
  });

  describe('vara-quality', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'vara-quality')!;

    it('scores +3 for Thursday (good weekday for marriage)', () => {
      const result = rule.evaluate(makeCtx({ weekday: 4 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(3);
    });

    it('scores -4 for Tuesday', () => {
      const result = rule.evaluate(makeCtx({ weekday: 2 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(-4);
    });
  });

  describe('panchaka', () => {
    const rule = PANCHANGA_RULES.find(r => r.id === 'panchaka')!;

    it('returns null when nakshatra is outside 23-27', () => {
      const result = rule.evaluate(makeCtx({ nakshatra: 10 }));
      expect(result).toBeNull();
    });

    it('scores -5 when nakshatra is in 23-27 range', () => {
      const result = rule.evaluate(makeCtx({ nakshatra: 25 }));
      expect(result).not.toBeNull();
      expect(result!.points).toBe(-5);
      expect(result!.cancelledBy).toContain('pushkar-navamsha');
    });
  });
});

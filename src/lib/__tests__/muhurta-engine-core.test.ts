import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerRule, registerRules, getRulesFor, getRule,
  getAllRules, clearRules, getRuleCount,
} from '@/lib/muhurta/engine/registry';
import type { MuhurtaRule } from '@/lib/muhurta/engine/types';

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

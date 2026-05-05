/**
 * Muhurta Engine — Rule Registry
 */

import type { MuhurtaRule, RuleScope } from './types';
import type { ExtendedActivityId } from '@/types/muhurta-ai';

const rules: Map<string, MuhurtaRule> = new Map();

export function registerRule(rule: MuhurtaRule): void {
  if (rules.has(rule.id)) {
    throw new Error(`[muhurta-engine] Duplicate rule ID: ${rule.id}`);
  }
  rules.set(rule.id, rule);
}

export function registerRules(ruleList: MuhurtaRule[]): void {
  for (const rule of ruleList) registerRule(rule);
}

export function getRulesFor(activity: ExtendedActivityId, scope: RuleScope): MuhurtaRule[] {
  const result: MuhurtaRule[] = [];
  for (const rule of rules.values()) {
    if (rule.scope !== scope) continue;
    if (rule.appliesTo === 'all' || rule.appliesTo.includes(activity)) {
      result.push(rule);
    }
  }
  return result.sort((a, b) => a.tier - b.tier);
}

export function getRule(id: string): MuhurtaRule | undefined {
  return rules.get(id);
}

export function getAllRules(): MuhurtaRule[] {
  return [...rules.values()];
}

export function clearRules(): void {
  rules.clear();
}

export function getRuleCount(): number {
  return rules.size;
}

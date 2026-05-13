/**
 * Yoga Detection Engine
 *
 * The main orchestrator that:
 * 1. Takes a YogaContext and a list of YogaRule definitions
 * 2. Evaluates each rule's conditions via the evaluator
 * 3. Checks cancellation conditions
 * 4. Assesses strength
 * 5. Returns EvaluatedYoga[] results
 *
 * Also provides:
 * - evaluateAllYogas() — runs ALL registered rules from the rule registry
 * - toYogaComplete() — backward-compatible adapter to the old YogaComplete format
 *
 * The engine is PURE: no side effects, no state, no DOM access, no API calls.
 *
 * Planet IDs: 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu
 */

import type {
  YogaRule,
  YogaContext,
  YogaDetectionResult,
  EvaluatedYoga,
  YogaCancellation,
  DomainType,
} from './types';
import type { YogaComplete } from '@/lib/kundali/yogas-complete';
import { evaluateCondition } from './evaluator';

// ─────────────────────────────────────────────────────────────────────────────
// Rule registry — all yoga rules are registered here
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Global registry of yoga rules.
 * Rules are added via registerYogaRules() — typically called once at module load
 * from each rule definition file (e.g. rules/mahapurusha.ts, rules/chandra.ts).
 *
 * Design decision: mutable registry instead of a single giant array allows
 * rule files to be split by category and loaded independently.
 */
const yogaRuleRegistry: YogaRule[] = [];

/**
 * Register one or more yoga rules with the global registry.
 *
 * @deprecated Use `evaluateWithRules(rules, ctx)` instead to avoid global mutable state.
 * Kept for backward compatibility with existing callers.
 *
 * Call this from each rule definition file to add rules. For example:
 * ```ts
 * // In rules/mahapurusha.ts
 * import { registerYogaRules } from '../engine';
 * registerYogaRules([ruchakaRule, bhadraRule, hamsaRule, malavyaRule, shashaRule]);
 * ```
 *
 * Duplicate IDs are detected and logged as errors (Lesson A: never silently swallow).
 */
export function registerYogaRules(rules: YogaRule[]): void {
  const existingIds = new Set(yogaRuleRegistry.map(r => r.id));

  for (const rule of rules) {
    if (existingIds.has(rule.id)) {
      console.error(`[yoga-engine] Duplicate yoga rule ID: '${rule.id}' — skipping. Fix the rule definitions.`);
      continue;
    }
    yogaRuleRegistry.push(rule);
    existingIds.add(rule.id);
  }
}

/**
 * Get all registered yoga rules. Primarily for testing and introspection.
 */
export function getRegisteredRules(): readonly YogaRule[] {
  return yogaRuleRegistry;
}

/**
 * Clear the rule registry. Used only in tests to reset state between test runs.
 * @deprecated Use `evaluateWithRules(rules, ctx)` instead to avoid global mutable state.
 * @internal
 */
export function _clearRegistry(): void {
  yogaRuleRegistry.length = 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core evaluation logic
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a single yoga rule against a chart context.
 *
 * Steps:
 * 1. Evaluate the rule's formation conditions
 * 2. If present, check cancellation conditions
 * 3. If present, assess strength
 * 4. Build and return the EvaluatedYoga result
 *
 * @param rule - The yoga rule definition
 * @param ctx  - The precomputed chart context
 * @returns The evaluated yoga result
 */
export function evaluateYogaRule(rule: YogaRule, ctx: YogaContext): EvaluatedYoga {
  // ── Step 1: Evaluate formation conditions ──
  const condResult = evaluateCondition(rule.conditions, ctx);

  // Build the initial detection result
  const detection: YogaDetectionResult = {
    present: condResult.met,
    strength: 'Moderate', // default, refined in step 3
    involvedPlanets: condResult.involvedPlanets,
    customData: condResult.customData,
  };

  // Extract pattern data from customData if present (for Malika/Nabhasa yogas)
  if (condResult.customData) {
    if (typeof condResult.customData['chainLength'] === 'number') {
      detection.chainLength = condResult.customData['chainLength'] as number;
    }
    if (typeof condResult.customData['startHouse'] === 'number') {
      detection.startHouse = condResult.customData['startHouse'] as number;
    }
    if (typeof condResult.customData['endHouse'] === 'number') {
      detection.endHouse = condResult.customData['endHouse'] as number;
    }
    if (typeof condResult.customData['firstPlanet'] === 'number') {
      detection.firstPlanet = condResult.customData['firstPlanet'] as number;
    }
    if (typeof condResult.customData['lastPlanet'] === 'number') {
      detection.lastPlanet = condResult.customData['lastPlanet'] as number;
    }
  }

  // ── Step 2: Check cancellations (only if yoga is present) ──
  let cancellationStatus: EvaluatedYoga['cancellationStatus'] | undefined;
  let anyCancelled = false;

  if (detection.present && rule.cancellations && rule.cancellations.length > 0) {
    const details = evaluateCancellations(rule.cancellations, ctx);
    anyCancelled = details.some(d => d.cancelled && d.effect === 'cancel');
    cancellationStatus = { anyCancelled, details };

    // If fully cancelled, mark as not present
    if (anyCancelled) {
      detection.present = false;
    }
  }

  // ── Step 3: Assess strength (only if still present after cancellation) ──
  if (detection.present) {
    detection.strength = rule.assessStrength(ctx, detection);

    // Weaken if any cancellation has 'weaken' effect
    if (cancellationStatus) {
      const hasWeakening = cancellationStatus.details.some(d => d.cancelled && d.effect === 'weaken');
      if (hasWeakening && detection.strength === 'Strong') {
        detection.strength = 'Moderate';
      } else if (hasWeakening && detection.strength === 'Moderate') {
        detection.strength = 'Weak';
      }
    }
  }

  // ── Step 4: Build the EvaluatedYoga result ──
  const evaluated: EvaluatedYoga = {
    id: rule.id,
    name: rule.name,
    group: rule.group,
    subGroup: rule.subGroup,
    isAuspicious: rule.isAuspicious,
    present: detection.present,
    strength: detection.present ? detection.strength : 'Weak',
    classicalRef: rule.classicalRef,
    // Trilingual: sa falls back to en (Sanskrit translation not always available)
    formationRule: { en: rule.formationRule.en, hi: rule.formationRule.hi, sa: rule.formationRule.en },
    description: detection.present
      ? { en: rule.description.en, hi: rule.description.hi, sa: rule.description.en }
      : rule.absentDescription
        ? { en: rule.absentDescription.en, hi: rule.absentDescription.hi, sa: rule.absentDescription.en }
        : { en: rule.description.en, hi: rule.description.hi, sa: rule.description.en },
    involvedPlanets: detection.involvedPlanets,
    affectedDomains: rule.affectedDomains,
    domainImpactWeight: rule.domainImpactWeight,
    cancellationStatus,
  };

  // Override affectedDomains from customData if present (for Malika/Parivartana dynamic domains)
  if (detection.customData?.domains) {
    evaluated.affectedDomains = detection.customData.domains as DomainType[];
  }

  // Add pattern data if present
  if (detection.startHouse !== undefined || detection.chainLength !== undefined) {
    evaluated.patternData = {
      startHouse: detection.startHouse,
      endHouse: detection.endHouse,
      chainLength: detection.chainLength,
      firstPlanet: detection.firstPlanet,
      lastPlanet: detection.lastPlanet,
    };
  }

  return evaluated;
}

/**
 * Evaluate cancellation conditions for a yoga.
 *
 * Each cancellation is checked independently. A yoga can have multiple
 * cancellation rules — some may cancel entirely, others just weaken.
 *
 * @param cancellations - Array of cancellation rules to check
 * @param ctx - The chart context
 * @returns Array of cancellation check results
 */
function evaluateCancellations(
  cancellations: YogaCancellation[],
  ctx: YogaContext,
): { cancelled: boolean; reason: string; effect: 'cancel' | 'weaken' }[] {
  return cancellations.map((cancel) => {
    const result = evaluateCondition(cancel.condition, ctx);
    return {
      cancelled: result.met,
      reason: cancel.reason.en, // Use English for internal tracking
      effect: cancel.effect,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Batch evaluation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Evaluate a list of yoga rules against a chart context WITHOUT using the global registry.
 *
 * This is the PREFERRED entry point — it avoids the mutable global registry entirely,
 * eliminating race conditions in concurrent/re-render scenarios.
 *
 * @param rules - Array of yoga rules to evaluate (e.g. ALL_YOGA_RULES)
 * @param ctx   - The precomputed chart context (from buildYogaContext)
 * @returns Array of all evaluated yogas
 */
export function evaluateWithRules(rules: YogaRule[], ctx: YogaContext): EvaluatedYoga[] {
  return rules.map(rule => evaluateYogaRule(rule, ctx));
}

/**
 * Evaluate a specific list of yoga rules against a chart context.
 *
 * @deprecated Use evaluateWithRules instead — identical behaviour, clearer name.
 */
export function evaluateYogaRules(rules: YogaRule[], ctx: YogaContext): EvaluatedYoga[] {
  return evaluateWithRules(rules, ctx);
}

/**
 * Evaluate ALL registered yoga rules against a chart context.
 *
 * @deprecated Use `evaluateWithRules(rules, ctx)` instead to avoid global mutable state.
 *
 * @param ctx - The precomputed chart context (from buildYogaContext)
 * @returns Array of all evaluated yogas
 */
export function evaluateAllYogas(ctx: YogaContext): EvaluatedYoga[] {
  if (yogaRuleRegistry.length === 0) {
    console.error('[yoga-engine] No yoga rules registered. Did you forget to import rule definition files?');
    return [];
  }

  return evaluateYogaRules(yogaRuleRegistry, ctx);
}

// ─────────────────────────────────────────────────────────────────────────────
// Backward-compatible adapter
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Category mapping from YogaGroup to the old YogaComplete.category values.
 *
 * The old YogaComplete interface uses a simpler category system. This map
 * converts the richer YogaGroup taxonomy to the old categories for backward
 * compatibility with existing UI components.
 */
const GROUP_TO_CATEGORY: Record<string, YogaComplete['category']> = {
  mahapurusha: 'mahapurusha',
  chandra: 'moon_based',
  surya: 'sun_based',
  raja: 'raja',
  dhana: 'wealth',
  dosha: 'dosha',
  nabhasa: 'other',
  malika: 'other',
  parivartana: 'raja',
  arishta: 'inauspicious',
  sannyasa: 'other',
  conjunction: 'other',
  navamsha: 'other',
  tajika: 'other',
};

/**
 * Convert an EvaluatedYoga to the old YogaComplete format.
 *
 * This adapter ensures backward compatibility with existing UI components
 * (YogasTab, tippanni engine) that consume YogaComplete[].
 *
 * The YogaComplete interface is defined in `@/lib/kundali/yogas-complete.ts`
 * and is referenced by `KundaliData.yogasComplete`.
 *
 * Note: sa (Sanskrit) locale not supported in old YogaComplete format — falls back to en.
 *
 * @param evaluated - The new-format evaluated yoga
 * @returns A YogaComplete object compatible with existing consumers
 */
export function toYogaComplete(evaluated: EvaluatedYoga): YogaComplete {
  return {
    id: evaluated.id,
    name: {
      en: evaluated.name.en,
      hi: evaluated.name.hi,
      sa: evaluated.name.sa,
    },
    category: GROUP_TO_CATEGORY[evaluated.group] ?? 'other',
    isAuspicious: evaluated.isAuspicious,
    present: evaluated.present,
    strength: evaluated.strength,
    formationRule: {
      en: evaluated.formationRule.en,
      hi: evaluated.formationRule.hi,
    },
    description: {
      en: evaluated.description.en,
      hi: evaluated.description.hi,
    },
  };
}

/**
 * Evaluate all registered yogas and return results in the old YogaComplete format.
 *
 * Drop-in replacement for the old `detectYogas()` function.
 * Use this during migration to maintain backward compatibility.
 *
 * @param ctx - The precomputed chart context (from buildYogaContext)
 * @returns Array of YogaComplete objects, compatible with KundaliData.yogasComplete
 */
export function evaluateAllYogasCompat(ctx: YogaContext): YogaComplete[] {
  return evaluateAllYogas(ctx).map(toYogaComplete);
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility: filter helpers for UI
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter evaluated yogas to only those that are present in the chart.
 */
export function presentYogas(yogas: EvaluatedYoga[]): EvaluatedYoga[] {
  return yogas.filter(y => y.present);
}

/**
 * Filter evaluated yogas by group.
 */
export function yogasByGroup(yogas: EvaluatedYoga[], group: string): EvaluatedYoga[] {
  return yogas.filter(y => y.group === group);
}

/**
 * Filter evaluated yogas by domain.
 * Returns yogas where the specified domain is in affectedDomains or affectedDomains is 'all'.
 */
export function yogasByDomain(yogas: EvaluatedYoga[], domain: DomainType): EvaluatedYoga[] {
  return yogas.filter(y =>
    y.affectedDomains === 'all' || (Array.isArray(y.affectedDomains) && y.affectedDomains.includes(domain))
  );
}

/**
 * Get a domain score from evaluated yogas.
 *
 * Sums the domainImpactWeight of all present yogas affecting the given domain,
 * with sign: positive for auspicious, negative for inauspicious.
 *
 * @param yogas - Evaluated yogas (typically from evaluateAllYogas)
 * @param domain - The life domain to score
 * @returns Numeric score (positive = auspicious, negative = inauspicious)
 */
export function domainScore(yogas: EvaluatedYoga[], domain: DomainType): number {
  let score = 0;
  for (const y of yogas) {
    if (!y.present) continue;
    const domainMatch =
      y.affectedDomains === 'all' ||
      (Array.isArray(y.affectedDomains) && y.affectedDomains.includes(domain));
    if (!domainMatch) continue;

    const sign = y.isAuspicious ? 1 : -1;
    const strengthMultiplier = y.strength === 'Strong' ? 1.5 : y.strength === 'Moderate' ? 1.0 : 0.5;
    score += sign * y.domainImpactWeight * strengthMultiplier;
  }
  return score;
}

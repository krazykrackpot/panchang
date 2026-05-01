// src/lib/tippanni/convergence/scoring.ts

import { evaluateCondition } from './evaluator';
import { getPlanetWeight } from './utils';
import { getThemeWeight } from '@/lib/tippanni/stage-weights';
import type { ConvergencePattern, ConvergenceInput, MatchedPattern, PatternCondition } from './types';

// ── Weight resolution ─────────────────────────────────────────────────────────

/**
 * Resolves the weight for a single matched condition.
 * Priority:
 *   1. Explicit `weight` field on the condition
 *   2. Planet-specific weight via getPlanetWeight() for conditions that
 *      reference a concrete planet id (natal planet-in-house with number,
 *      transit, retro, combust)
 *   3. For dasha conditions: getPlanetWeight(input.dashaLord)
 *   4. Default: 1.0
 */
function resolveConditionWeight(cond: PatternCondition, input: ConvergenceInput): number {
  // Explicit weight always wins
  if (cond.weight !== undefined) return cond.weight;

  // Natal planet-in-house with a specific planet id (not a filter string)
  if (
    cond.type === 'natal' &&
    cond.check === 'planet-in-house' &&
    typeof cond.planet === 'number'
  ) {
    return getPlanetWeight(cond.planet);
  }

  // Transit: references a concrete planet id
  if (cond.type === 'transit') {
    return getPlanetWeight(cond.planet);
  }

  // Retro / combust: reference a concrete planet id
  if (cond.type === 'retro' || cond.type === 'combust') {
    return getPlanetWeight(cond.planet);
  }

  // Dasha: use dashaLord weight
  if (cond.type === 'dasha') {
    return getPlanetWeight(input.dashaLord);
  }

  return 1.0;
}

// ── Ashtakavarga modifier ─────────────────────────────────────────────────────

/**
 * For matched transit conditions, looks up the SAV bindu count for the
 * transit's sign and adjusts a running modifier:
 *   - bindus >= 30 → modifier *= 1.3
 *   - bindus <= 22 → modifier *= 0.7
 *   - otherwise    → no change (1.0 factor)
 *
 * If no transit conditions matched, returns 1.0.
 */
function computeAshtakavargaModifier(
  conditions: PatternCondition[],
  matchedFlags: boolean[],
  input: ConvergenceInput,
): number {
  const matchedTransits = conditions.filter(
    (cond, i) => matchedFlags[i] && cond.type === 'transit',
  ) as Extract<PatternCondition, { type: 'transit' }>[];

  if (matchedTransits.length === 0) return 1.0;

  let modifier = 1.0;
  for (const transit of matchedTransits) {
    // Find the transit planet's current sign
    const transitPlanet = input.transits.find((t) => t.planetId === transit.planet);
    if (!transitPlanet) continue;

    const bindus = input.ashtakavargaSAV[transitPlanet.sign - 1]; // sign is 1-based
    if (bindus >= 30) {
      modifier *= 1.3;
    } else if (bindus <= 22) {
      modifier *= 0.7;
    }
    // 23–29 → no change
  }

  return modifier;
}

// ── Main export ───────────────────────────────────────────────────────────────

/**
 * Evaluates all conditions in a ConvergencePattern against the given input.
 *
 * Returns a MatchedPattern if at least 2 conditions match, otherwise null.
 *
 * Scoring formula:
 *   finalScore = pattern.significance
 *              * conditionWeightSum   (average weight of matched conditions)
 *              * matchRatio           (1.0 full match, 0.6 partial)
 *              * ashtakavargaModifier (based on SAV bindus for transit signs)
 */
export function scorePattern(
  pattern: ConvergencePattern,
  input: ConvergenceInput,
): MatchedPattern | null {
  const conditions = pattern.conditions;
  const totalConditions = conditions.length;

  // Step 1: evaluate all conditions
  const matchedFlags = conditions.map((cond) => evaluateCondition(cond, input));
  const matchCount = matchedFlags.filter(Boolean).length;

  // Step 2: require at least 2 matches
  if (matchCount < 2) return null;

  // Step 3: full / partial
  const isFullMatch = matchCount === totalConditions;

  // Step 4: match ratio
  const matchRatio = isFullMatch ? 1.0 : 0.6;

  // Step 5: condition weight sum (normalized by matchCount)
  let weightSum = 0;
  for (let i = 0; i < conditions.length; i++) {
    if (matchedFlags[i]) {
      weightSum += resolveConditionWeight(conditions[i], input);
    }
  }
  const conditionWeightSum = weightSum / matchCount;

  // Step 6: ashtakavarga modifier
  const ashtakavargaModifier = computeAshtakavargaModifier(conditions, matchedFlags, input);

  // Step 6b: life-stage theme weight (when stage is available)
  const stageModifier = input.stage
    ? getThemeWeight(pattern.theme, input.stage)
    : 1.0;

  // Step 7: final score
  const finalScore =
    pattern.significance * conditionWeightSum * matchRatio * ashtakavargaModifier * stageModifier;

  // Step 8: return MatchedPattern
  return {
    patternId: pattern.id,
    theme: pattern.theme,
    matchCount,
    totalConditions,
    isFullMatch,
    finalScore,
    text: isFullMatch ? pattern.text.full : pattern.text.mild,
    advice: pattern.advice,
    laypersonNote: pattern.laypersonNote,
    relatedSections: pattern.relatedSections,
  };
}

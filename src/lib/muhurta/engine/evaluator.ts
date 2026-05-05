/**
 * Muhurta Engine — Evaluator (Layer 2)
 *
 * Runs all rules from the registry, resolves cancellations using the
 * 5-tier authority system, and normalises scores to 0-100.
 *
 * Tier 0 assessments CANNOT be cancelled — hard vetoes are absolute.
 * Only positive assessments can cancel negative ones. First canceller wins.
 */

import { getRulesFor } from './registry';
import type {
  RuleContext,
  RuleAssessment,
  ResolvedAssessment,
  Cancellation,
  EvaluationResult,
  MuhurtaGrade,
  WindowBreakdown,
} from './types';

// Category max-point caps
const CATEGORY_MAX: Record<string, number> = {
  panchanga: 25,
  graha: 15,
  kaala: 20,
  lagna: 12,
  'yoga-special': 10,
  personal: 20,
  period: 0, // period only produces vetoes, never score contributions
};

const MAX_POSSIBLE = 25 + 15 + 20 + 12 + 10 + 20; // 102

function assignGrade(score: number): MuhurtaGrade {
  if (score >= 75) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 45) return 'fair';
  if (score >= 30) return 'marginal';
  return 'poor';
}

/**
 * Run all rules for a given scope and collect non-null assessments.
 * If any assessment has vetoed=true, it is added to the vetoes array.
 */
function collectAssessments(
  ctx: RuleContext,
  scope: 'day' | 'window'
): { assessments: RuleAssessment[]; vetoes: RuleAssessment[] } {
  const rules = getRulesFor(ctx.activity, scope);
  const assessments: RuleAssessment[] = [];
  const vetoes: RuleAssessment[] = [];

  for (const rule of rules) {
    const result = rule.evaluate(ctx);
    if (!result) continue;
    assessments.push(result);
    if (result.vetoed) {
      vetoes.push(result);
    }
  }

  return { assessments, vetoes };
}

/**
 * Convert raw assessments to resolved assessments (default: not cancelled).
 */
function toResolved(assessments: RuleAssessment[]): ResolvedAssessment[] {
  return assessments.map((a) => ({
    ...a,
    cancelled: false,
    effectivePoints: a.points,
  }));
}

/**
 * Resolve cancellations among resolved assessments.
 *
 * Rules:
 * - Only positive-point assessments with a non-empty `cancels` list can cancel.
 * - Only negative-point assessments can be cancelled.
 * - Tier 0 assessments CANNOT be cancelled by anything.
 * - Tier 1 (Godhuli) cancels everything except Tier 0.
 * - Otherwise, canceller.tier <= target.tier - 2 (e.g., Tier 2 cancels Tier 4).
 * - First canceller wins — if two cancellers target the same assessment, first one (by tier) takes it.
 */
function resolveCancellations(
  resolved: ResolvedAssessment[]
): Cancellation[] {
  const cancellations: Cancellation[] = [];

  // Find cancellers: positive points + non-empty cancels array, sorted by tier (already sorted from registry)
  const cancellers = resolved
    .filter((a) => a.points > 0 && a.cancels && a.cancels.length > 0)
    .sort((a, b) => a.tier - b.tier);

  for (const canceller of cancellers) {
    for (const targetId of canceller.cancels!) {
      // Find all matching negative assessments that can be cancelled
      for (const target of resolved) {
        if (target.ruleId !== targetId) continue;
        if (target.points >= 0) continue; // only cancel negatives
        if (target.cancelled) continue; // first canceller wins
        if (target.tier === 0) continue; // Tier 0 is absolute

        // Tier check: Tier 1 cancels everything except Tier 0;
        // otherwise canceller.tier <= target.tier - 2
        const canCancel =
          canceller.tier === 1 || canceller.tier <= target.tier - 2;

        if (canCancel) {
          target.cancelled = true;
          target.cancelledByRuleId = canceller.ruleId;
          target.effectivePoints = 0;

          cancellations.push({
            cancellerRuleId: canceller.ruleId,
            cancellerReason: canceller.reason,
            cancelledRuleId: target.ruleId,
            cancelledReason: target.reason,
            source: canceller.source,
          });
        }
      }
    }
  }

  return cancellations;
}

/**
 * Compute per-category scores from effective points, clamped to category max.
 */
function computeBreakdown(resolved: ResolvedAssessment[]): WindowBreakdown {
  const sums: Record<string, number> = {};

  for (const a of resolved) {
    const cat = a.category;
    sums[cat] = (sums[cat] || 0) + a.effectivePoints;
  }

  // Clamp each category to [0, max]
  const clamp = (cat: string): number => {
    const raw = sums[cat] || 0;
    const max = CATEGORY_MAX[cat] ?? 0;
    return Math.max(0, Math.min(max, raw));
  };

  return {
    panchanga: clamp('panchanga'),
    graha: clamp('graha'),
    kaala: clamp('kaala'),
    lagna: clamp('lagna'),
    special: clamp('yoga-special'),
    personal: clamp('personal'),
  };
}

/**
 * Main evaluator: runs all rules, resolves cancellations, scores 0-100.
 */
export function evaluateWindow(ctx: RuleContext): EvaluationResult {
  // 1. Run day-level rules
  const dayResult = collectAssessments(ctx, 'day');
  if (dayResult.vetoes.length > 0) {
    return makeVetoResult(dayResult.assessments, dayResult.vetoes);
  }

  // 2. Run window-level rules
  const windowResult = collectAssessments(ctx, 'window');
  if (windowResult.vetoes.length > 0) {
    const allAssessments = [...dayResult.assessments, ...windowResult.assessments];
    const allVetoes = [...dayResult.vetoes, ...windowResult.vetoes];
    return makeVetoResult(allAssessments, allVetoes);
  }

  // 3. Resolve cancellations
  const allAssessments = [...dayResult.assessments, ...windowResult.assessments];
  const resolved = toResolved(allAssessments);
  const cancellations = resolveCancellations(resolved);

  // 4. Compute category scores
  const breakdown = computeBreakdown(resolved);

  // 5. Compute final score
  const rawScore =
    breakdown.panchanga +
    breakdown.graha +
    breakdown.kaala +
    breakdown.lagna +
    breakdown.special +
    breakdown.personal;
  const score = Math.round(
    Math.max(0, Math.min(100, (rawScore / MAX_POSSIBLE) * 100))
  );

  // 6. Assign grade
  const grade = assignGrade(score);

  // 7. Collect active special yogas
  const activeSpecialYogas = resolved
    .filter(
      (a) =>
        a.category === 'yoga-special' &&
        a.points > 0 &&
        !a.cancelled
    )
    .map((a) => a.ruleId);

  return {
    score,
    rawScore,
    grade,
    breakdown,
    assessments: resolved,
    vetoes: [],
    cancellations,
    activeSpecialYogas,
  };
}

/**
 * Build an EvaluationResult for a vetoed window (score=0, grade=poor).
 */
function makeVetoResult(
  assessments: RuleAssessment[],
  vetoes: RuleAssessment[]
): EvaluationResult {
  return {
    score: 0,
    rawScore: 0,
    grade: 'poor',
    breakdown: {
      panchanga: 0,
      graha: 0,
      kaala: 0,
      lagna: 0,
      special: 0,
      personal: 0,
    },
    assessments: toResolved(assessments),
    vetoes,
    cancellations: [],
    activeSpecialYogas: [],
  };
}

/**
 * Muhurta Engine — Evaluator (Layer 2 of the 3-layer muhurta architecture)
 *
 * ARCHITECTURE OVERVIEW:
 *   Layer 1: Rules (individual checks — tithi quality, nakshatra suitability, etc.)
 *   Layer 2: Evaluator (THIS FILE — runs rules, resolves conflicts, scores)
 *   Layer 3: Scanner (iterates date ranges, generates time windows, calls evaluator)
 *
 * WHAT THIS FILE DOES:
 *   1. Collects all rule assessments for a given muhurta window (day-level + window-level).
 *   2. Resolves CANCELLATIONS using a 5-tier authority system — the key innovation
 *      of this engine that distinguishes it from simple additive scoring.
 *   3. Computes per-category scores clamped to category maximums.
 *   4. Normalises the raw score to 0-100 with dynamic denominator.
 *   5. Assigns a grade: excellent (≥75), good (≥60), fair (≥45), marginal (≥30), poor (<30).
 *
 * 5-TIER CANCELLATION SYSTEM:
 *   Classical muhurta texts (Muhurta Chintamani, Dharma Sindhu, Prashna Marga)
 *   describe scenarios where a positive factor "removes the defect" of a negative one.
 *   For example, Godhuli Lagna (Tier 1) cancels most negative assessments because
 *   "even inauspicious factors are neutralised during Godhuli" (MC Ch.6).
 *
 *   Tier 0: ABSOLUTE VETO — cannot be cancelled by anything.
 *           Examples: Venus/Jupiter combustion for marriage (Dharma Sindhu explicit prohibition),
 *           Adhika Masa, Chaturmas. These are hard blocks — no positive factor overrides them.
 *
 *   Tier 1: SUPREME POSITIVE — cancels everything except Tier 0.
 *           Example: Godhuli Lagna (~±12 min around sunset). MC states this period is
 *           so powerful it overrides all other muhurta defects.
 *
 *   Tier 2: STRONG FACTOR — can cancel Tier 4 negatives.
 *           Examples: auspicious tithi-nakshatra combination, strong lagna.
 *
 *   Tier 3: MODERATE FACTOR — can cancel Tier 5+ (if any existed).
 *           Standard positive assessments.
 *
 *   Tier 4: WEAK NEGATIVE — can be cancelled by Tier 1 or Tier 2 positives.
 *           Examples: Krishna Paksha penalty, mildly inauspicious yoga.
 *
 *   CANCELLATION RULE: A positive assessment at tier N can cancel a negative
 *   assessment at tier M if: N=1 (supreme) OR N ≤ M-2. First canceller wins.
 *
 * SCORING CATEGORIES:
 *   panchanga (max 25): tithi, nakshatra, yoga, karana quality for the activity
 *   graha (max 15): planetary positions and strengths
 *   kaala (max 20): Rahu Kaal, Yamaganda, Gulika, Varjyam overlap
 *   lagna (max 12): ascendant sign suitability + navamsha shuddhi
 *   yoga-special (max 10): Sarvartha Siddhi, Amrit Siddhi, etc. (only in denominator when active)
 *   personal (max 20): Tara Bala, Chandra Bala, Dasha compatibility (only when birth data provided)
 *   period (max 0): period rules only produce vetoes, never score contributions
 *
 * BASE MAX = 72 (panchanga + graha + kaala + lagna). Personal and special categories
 * are added to the denominator only when applicable, making the score fair for users
 * with and without birth data.
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

// Category max-point caps — ceiling for each scoring category.
// Raw sums are clamped to [0, max] to prevent a single dominant category
// from overshadowing others (e.g., 5 special yogas shouldn't score 50).
const CATEGORY_MAX: Record<string, number> = {
  panchanga: 25,      // tithi + nakshatra + yoga + karana quality
  graha: 15,          // planetary dignity, combustion, retrograde effects
  kaala: 20,          // freedom from Rahu Kaal, Yamaganda, Gulika, Varjyam
  lagna: 12,          // ascendant sign suitability + navamsha shuddhi
  'yoga-special': 10, // Sarvartha Siddhi, Amrit Siddhi, Guru Pushya, etc.
  personal: 20,       // Tara Bala (8) + Chandra Bala (8) + Dasha (8), capped at 20
  period: 0,          // period rules (Chaturmas, Adhika Masa) only produce vetoes
};

// Base max (always applicable): the four universal categories
// panchanga(25) + graha(15) + kaala(20) + lagna(12) = 72
const BASE_MAX = 25 + 15 + 20 + 12;

/**
 * Assign a qualitative grade from the 0-100 normalised score.
 * These thresholds are calibrated against manually-scored reference muhurtas
 * from Muhurta Chintamani example charts.
 */
function assignGrade(score: number): MuhurtaGrade {
  if (score >= 75) return 'excellent'; // All factors align — proceed with confidence
  if (score >= 60) return 'good';      // Strongly favourable, minor blemishes acceptable
  if (score >= 45) return 'fair';      // Acceptable if no better window available
  if (score >= 30) return 'marginal';  // Use only if urgent; remedial measures advised
  return 'poor';                        // Avoid — significant inauspicious factors present
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
 * Main evaluator — runs all rules, resolves cancellations, and produces a 0-100 score.
 *
 * EXECUTION FLOW:
 *   1. Run DAY-level rules first (checks that apply to the entire day, e.g., Adhika Masa,
 *      Chaturmas, Venus combustion). If ANY day-level rule vetoes, the entire day is
 *      blocked — no need to evaluate individual time windows.
 *
 *   2. Run WINDOW-level rules (checks specific to this time slot, e.g., Rahu Kaal overlap,
 *      lagna sign, Varjyam). If any window-level rule vetoes, this window is blocked.
 *
 *   3. Resolve CANCELLATIONS: positive assessments can neutralise negative ones according
 *      to the 5-tier authority hierarchy (see module-level comment).
 *
 *   4. Compute per-category scores (clamped to category max).
 *
 *   5. Compute dynamic maxPossible: includes personal and special categories only when
 *      they are applicable (birth data provided / special yogas fired).
 *
 *   6. Normalise: score = (rawScore / maxPossible) × 100, clamped to [0, 100].
 *
 * @param ctx - Rule context containing panchanga snapshot, location, activity, birth data
 * @returns EvaluationResult with score, grade, breakdown, assessments, and cancellations
 */
export function evaluateWindow(ctx: RuleContext): EvaluationResult {
  // 1. Run day-level rules — these apply to the entire day (vetoes block all windows)
  const dayResult = collectAssessments(ctx, 'day');
  if (dayResult.vetoes.length > 0) {
    return makeVetoResult(dayResult.assessments, dayResult.vetoes);
  }

  // 2. Run window-level rules — specific to this time slot
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

  // 5. Compute dynamic maxPossible based on what data/rules are applicable
  // Personal category: only include if birth data was provided
  // tara-bala(8) + chandra-bala(8) = 16 without dasha; +8 with dasha = 24 (capped to 20)
  let personalMax = 0;
  if (ctx.birthNakshatra !== undefined || ctx.birthRashi !== undefined) {
    personalMax = 16; // tara(8) + chandra(8)
    if (ctx.dashaLords) {
      personalMax = 20; // capped: 8+8+8=24 → cap 20
    }
  }

  // Special yogas: only include in denominator if at least one fired positively
  const specialFired = resolved.some(
    (a) => a.category === 'yoga-special' && a.points > 0 && !a.cancelled
  );
  const specialMax = specialFired ? 10 : 0;

  const maxPossible = BASE_MAX + personalMax + specialMax;

  // 5b. Compute final score
  const rawScore =
    breakdown.panchanga +
    breakdown.graha +
    breakdown.kaala +
    breakdown.lagna +
    breakdown.special +
    breakdown.personal;
  const score = Math.round(
    Math.max(0, Math.min(100, (rawScore / maxPossible) * 100))
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

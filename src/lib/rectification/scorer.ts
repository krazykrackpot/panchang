/**
 * Birth Time Rectification — Scorer (Phase 3)
 *
 * Ranks candidate birth times by their total event-match scores,
 * clusters by lagna sign, and returns the top 3 with confidence
 * and strength assessment.
 */

import type { RectificationCandidate, RectificationResult, EventMatch } from './types';
import type { CandidateInfo } from './candidate-generator';

interface ScoredCandidate {
  candidate: CandidateInfo;
  eventMatches: EventMatch[];
  totalScore: number;
}

/**
 * Score, cluster, and rank candidates. Returns the final RectificationResult.
 *
 * Algorithm:
 * 1. For each candidate, sum event match scores → totalScore
 * 2. Group candidates by lagna sign, pick the best within each group
 * 3. Normalize confidence to 0-100 based on max possible score (10 * numEvents)
 * 4. Return top 3 by confidence
 * 5. Determine strength label
 */
export function rankCandidates(
  scored: ScoredCandidate[],
  searchWindow: { from: string; to: string }
): RectificationResult {
  if (scored.length === 0) {
    return {
      candidates: [],
      searchWindow,
      candidatesEvaluated: 0,
      strength: 'insufficient',
    };
  }

  // Max possible score = 10 points per event
  const numEvents = scored[0]?.eventMatches.length ?? 0;
  const maxPossible = numEvents * 10;

  // Group by lagna sign — pick the candidate with highest totalScore per sign
  const bySign = new Map<number, ScoredCandidate[]>();
  for (const s of scored) {
    const sign = s.candidate.lagnaSign;
    if (!bySign.has(sign)) bySign.set(sign, []);
    bySign.get(sign)!.push(s);
  }

  // For each sign group: pick the best candidate, compute average score for the group
  const signBest: {
    best: ScoredCandidate;
    avgScore: number;
  }[] = [];

  for (const [, group] of bySign) {
    // Sort descending by totalScore
    group.sort((a, b) => b.totalScore - a.totalScore);
    const best = group[0];
    const avgScore = group.reduce((sum, g) => sum + g.totalScore, 0) / group.length;
    signBest.push({ best, avgScore });
  }

  // Sort sign groups by best candidate's totalScore descending
  signBest.sort((a, b) => b.best.totalScore - a.best.totalScore);

  // Take top 3 sign groups
  const top3 = signBest.slice(0, 3);

  // Build result candidates with normalized confidence
  const candidates: RectificationCandidate[] = top3.map(({ best }) => {
    const confidence = maxPossible > 0
      ? Math.round((best.totalScore / maxPossible) * 100)
      : 0;

    return {
      birthTime: best.candidate.time,
      lagnaSign: best.candidate.lagnaSign,
      lagnaSignName: best.candidate.lagnaSignName,
      lagnaDegree: Math.round(best.candidate.lagnaDegree * 100) / 100,
      confidence: Math.min(100, confidence),
      totalScore: best.totalScore,
      eventMatches: best.eventMatches,
    };
  });

  // Determine strength
  const strength = determineStrength(candidates);

  return {
    candidates,
    searchWindow,
    candidatesEvaluated: scored.length,
    strength,
  };
}

/**
 * Determine the confidence strength label based on candidate distribution.
 *
 * - 'strong': top candidate >70% AND gap to second >30 percentage points
 * - 'ambiguous': top 2 within 10 percentage points of each other
 * - 'insufficient': top candidate <40%
 * - 'moderate': everything else
 */
function determineStrength(
  candidates: RectificationCandidate[]
): 'strong' | 'moderate' | 'ambiguous' | 'insufficient' {
  if (candidates.length === 0) return 'insufficient';

  const top = candidates[0].confidence;
  const second = candidates.length > 1 ? candidates[1].confidence : 0;

  if (top < 40) return 'insufficient';
  if (top > 70 && (top - second) > 30) return 'strong';
  if (candidates.length > 1 && Math.abs(top - second) <= 10) return 'ambiguous';
  return 'moderate';
}

// Re-export the ScoredCandidate type for use in the engine
export type { ScoredCandidate };

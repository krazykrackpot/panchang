// src/lib/kundali/health-diagnosis/scoring-utils.ts
//
// Shared scoring utilities for all 22 element scorers (Task B1 onwards).
//
// Exports:
//   w(weights, axis, elementId)     — safe weight-axis resolver; logs a
//                                     console.error on typos and returns 0.
//   vulnerabilityScore(resilience)  — inverts a resilience score to a
//                                     vulnerability index in [0, 100].
//   ratingFromScore(vulnerability)  — maps a vulnerability index to a Sanskrit
//                                     rating tier (uttama → atyadhama).
//   dignityToScore(tier)            — converts a DignityTier to a 0-100 scalar
//                                     suitable for weighting alongside Shadbala.
//
// These functions are intentionally small and side-effect-free so that every
// element scorer (B2-B22) can import them without pulling in unrelated code.
//
// Rating thresholds (vulnerability 0-100, where 0 = perfectly healthy):
//   < 25  → uttama    (strong resilience, minimal vulnerability)
//   < 50  → madhyama  (moderate resilience, some vulnerability)
//   < 75  → adhama    (challenged resilience, notable vulnerability)
//   ≥ 75  → atyadhama (weak resilience, high vulnerability)

import type { Rating } from '@/lib/kundali/domain-synthesis/types';
import type { WeightVector } from './weights';
import type { DignityTier } from './strength-inputs';

/**
 * Resolve a named weight axis from a vector. Logs (and returns 0) when the
 * axis is absent so typos in element scorers surface as console errors
 * during dev rather than silently inflated/deflated scores in production.
 *
 * Element scorers must use this helper rather than `WEIGHTS[key] ?? 0`.
 *
 * @param weights    The WeightVector for the current element.
 * @param axis       The axis name to look up (must match a key in weights.ts).
 * @param elementId  The caller's ElementId string, for diagnostic messages.
 * @returns          The weight value, or 0 if the axis is absent.
 */
export function w(weights: WeightVector, axis: string, elementId: string): number {
  const v = weights[axis];
  if (v === undefined) {
    console.error(`[health-diagnosis/${elementId}] unknown weight axis: "${axis}"`);
    return 0;
  }
  return v;
}

/**
 * Converts a DignityTier to a 0-100 scalar for use as a weight-vector axis.
 *
 * Scale chosen to be proportional to the dignityMultiplier in strength-inputs.ts
 * but expressed as an absolute score (rather than a multiplier) so it can be
 * summed with other 0-100 axes in a weighted average.
 *
 * Mapping:
 *   exalted      → 95  (near-maximum; best placement)
 *   moolatrikona → 85
 *   own          → 80
 *   friend       → 65
 *   neutral      → 50  (midpoint baseline)
 *   enemy        → 30
 *   debilitated  → 10  (near-minimum; worst placement)
 *   unknown      → 50  (treat as neutral when flags unavailable)
 */
export function dignityToScore(tier: DignityTier): number {
  switch (tier) {
    case 'exalted':      return 95;
    case 'moolatrikona': return 85;
    case 'own':          return 80;
    case 'friend':       return 65;
    case 'neutral':      return 50;
    case 'enemy':        return 30;
    case 'debilitated':  return 10;
    default:             return 50; // unknown — treat as neutral
  }
}

/**
 * Converts a resilience score in [0, 100] to a vulnerability index in [0, 100].
 *
 * High resilience → low vulnerability (good health prognosis).
 * Low resilience  → high vulnerability (challenged health prognosis).
 *
 * The result is clamped to [0, 100] to guard against floating-point drift
 * in callers that weight-sum axes that individually exceed 100.
 *
 * @param resilience  Weighted sum of positive health indicators, normalised to [0, 100].
 * @returns           Vulnerability index in [0, 100].
 */
export function vulnerabilityScore(resilience: number): number {
  return Math.max(0, Math.min(100, 100 - resilience));
}

/**
 * Maps a vulnerability index in [0, 100] to a Sanskrit rating tier.
 *
 * Thresholds:
 *   vulnerability < 25  → 'uttama'    (strong)
 *   vulnerability < 50  → 'madhyama'  (moderate)
 *   vulnerability < 75  → 'adhama'    (challenged)
 *   vulnerability ≥ 75  → 'atyadhama' (critical)
 *
 * Verification (mental check):
 *   resilience = 80 → vulnerability = 20 → uttama   ✓
 *   resilience = 55 → vulnerability = 45 → madhyama ✓
 *   resilience = 30 → vulnerability = 70 → adhama   ✓
 *   resilience = 10 → vulnerability = 90 → atyadhama ✓
 *
 * @param vulnerability  Score from vulnerabilityScore(), in [0, 100].
 * @returns              Sanskrit rating tier.
 */
export function ratingFromScore(vulnerability: number): Rating {
  if (vulnerability < 25) return 'uttama';
  if (vulnerability < 50) return 'madhyama';
  if (vulnerability < 75) return 'adhama';
  return 'atyadhama';
}

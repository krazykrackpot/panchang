// src/lib/kundali/health-diagnosis/scoring-utils.ts
//
// Shared scoring utilities for all 22 element scorers (Task B1 onwards).
//
// Exports:
//   w(weights, axis, elementId)                       — safe weight-axis resolver; logs a
//                                                       console.error on typos and returns 0.
//   vulnerabilityScore(resilience)                    — inverts a resilience score to a
//                                                       vulnerability index in [0, 100].
//   ratingFromScore(vulnerability)                    — maps a vulnerability index to a Sanskrit
//                                                       rating tier (uttama → atyadhama).
//   dignityToScore(tier)                              — converts a DignityTier to a 0-100 scalar
//                                                       suitable for weighting alongside Shadbala.
//   yogaSignatureContribution(signatureIds, matches)  — direction-aware yoga signature axis score.
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
import { SIGNATURE_REGISTRY } from './signatures';

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

/**
 * Compute the yogaSignatures axis contribution for an element scorer.
 *
 * Direction semantics (per SignatureDef.direction):
 *   'risk'       — match lowers resilience: matched → 0, absent → 100.
 *   'protective' — match raises resilience: matched → 100, absent → 0.
 *
 * Returns 0 when signatureIds is empty (contributes zero resilience, matching
 * the old inline behaviour for elements with no relevant signatures).
 *
 * All currently-registered signatures are 'risk' signals (pathological yogas).
 * The 'protective' branch exists for future beneficial signatures (e.g. Hamsa,
 * Malavya) that may be added in later phases.
 *
 * @param signatureIds  The list of signature IDs relevant to this element.
 * @param signatures    The detectAllSignatures() boolean map for the native.
 * @returns             A 0–100 resilience contribution for the yogaSignatures axis.
 */
export function yogaSignatureContribution(
  signatureIds: string[],
  signatures: Record<string, boolean>,
): number {
  // H5 audit fix: empty signature list means "no risk signals registered for
  // this element" — neutral, not worst-case. Return 100 ("no risk fired") to
  // match the direction='risk' semantics: an absent risk signal → resilience=100.
  // Previously returned 0 (max vulnerability), which baked a 5-15pt vulnerability
  // floor into every element that has no signatures, pushing charts that should
  // rate 'uttama' into 'madhyama'.
  if (signatureIds.length === 0) return 100;
  let sum = 0;
  let validCount = 0;
  for (const id of signatureIds) {
    const def = SIGNATURE_REGISTRY[id];
    if (!def) continue; // unknown id — skip entirely (don't penalise resilience)
    validCount++;
    const matched = signatures[id] === true;
    if (def.direction === 'risk') {
      // Risk signal present → vulnerability up → resilience contribution = 0.
      // Risk signal absent  → no risk        → resilience contribution = 100.
      sum += matched ? 0 : 100;
    } else {
      // Protective signal present → resilience contribution = 100.
      // Protective signal absent  → resilience contribution = 0.
      sum += matched ? 100 : 0;
    }
  }
  // Divide by validCount (not signatureIds.length) so unknown ids don't
  // silently drag down resilience by contributing 0 to the average.
  return validCount === 0 ? 0 : sum / validCount;
}

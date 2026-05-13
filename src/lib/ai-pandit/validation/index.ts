/**
 * Validation Wall — Orchestrator
 *
 * Runs all 4 validation layers in sequence with short-circuit on failure.
 * Applies fixable corrections (Layer 3) before returning.
 *
 * Layer execution order:
 * 1. Verdict Alignment (tone vs engine verdict)
 * 2. Claim Verification (structured claims vs SAC)
 * 2b. Narrative Scanner (regex-extracted claims vs SAC)
 * 3. Tradition Guardrails (immutable Jyotish rules + Hinglish detection)
 */

import type {
  LLMOutput,
  StructuredAstrologicalContext,
  ValidationResult,
  ValidationFailure,
  ValidationLayer,
} from '../types';
import { checkVerdictAlignment } from './verdict-alignment';
import { verifyClaims } from './claim-verifier';
import { verifyScannedClaims } from './narrative-scanner';
import { checkTraditionGuardrails } from './tradition-guardrails';

export function validate(
  llmOutput: LLMOutput,
  sac: StructuredAstrologicalContext,
  locale: string,
): ValidationResult {
  const allFailures: ValidationFailure[] = [];
  const allWarnings: ValidationFailure[] = [];
  const layersChecked: ValidationLayer[] = [];
  let totalDuration = 0;

  // ── Layer 1: Verdict alignment ──
  layersChecked.push('verdict_alignment');
  const l1 = checkVerdictAlignment(llmOutput.narrative, sac.primaryVerdict);
  totalDuration += l1.durationMs;
  if (!l1.passed) {
    return {
      passed: false,
      failures: l1.failures,
      warnings: [],
      durationMs: totalDuration,
    };
  }

  // ── Layer 2: Structured claim verification ──
  layersChecked.push('claim_verification');
  const l2 = verifyClaims(llmOutput.claims, sac);
  totalDuration += l2.durationMs;
  if (!l2.passed) {
    return {
      passed: false,
      failures: l2.failures,
      warnings: [],
      durationMs: totalDuration,
    };
  }

  // ── Layer 2b: Narrative scanner ──
  layersChecked.push('narrative_scan');
  const l2b = verifyScannedClaims(llmOutput.narrative, sac, llmOutput.claims);
  totalDuration += l2b.durationMs;
  if (!l2b.passed) {
    return {
      passed: false,
      failures: l2b.failures,
      warnings: [],
      durationMs: totalDuration,
    };
  }

  // ── Layer 3: Tradition guardrails ──
  layersChecked.push('tradition_guardrails');
  const l3 = checkTraditionGuardrails(llmOutput.narrative, locale);
  totalDuration += l3.durationMs;
  allWarnings.push(...l3.warnings);

  // Non-fixable L3 failures block delivery (fixable ones are informational)
  const nonFixable = l3.failures.filter(f => !f.fixable);
  allFailures.push(...l3.failures);

  if (nonFixable.length > 0) {
    return {
      passed: false,
      failures: allFailures,
      warnings: allWarnings,
      durationMs: totalDuration,
    };
  }

  // Note: L3 fixable corrections (benefic↔malefic swaps) are not auto-applied
  // in v1 because building reliable find/replace pairs requires per-rule logic.
  // These are flagged as fixable for future implementation — see design doc §5.5.

  return {
    passed: true,
    failures: allFailures,
    warnings: allWarnings,
    durationMs: totalDuration,
  };
}

import { describe, it, expect } from 'vitest';
import { verifyClaims } from '../validation/claim-verifier';
import { EXPECTED_SAC } from './fixtures/sample-sac';
import type { LLMClaim } from '../types';

describe('verifyClaims', () => {
  it('passes when all claims are correct', () => {
    const claims: LLMClaim[] = [
      { type: 'planet_house', data: { planet: 6, house: 7 } },    // Saturn in 7th ✓
      { type: 'planet_house', data: { planet: 4, house: 4 } },    // Jupiter in 4th ✓
      { type: 'planet_dignity', data: { planet: 6, dignity: 'exalted' } }, // Saturn exalted ✓
      { type: 'dasha_reference', data: { major: 6, sub: 3 } },    // Saturn-Mercury ✓
      { type: 'yoga_mentioned', data: { name: 'gajakesari' } },   // In SAC ✓
      { type: 'sade_sati', data: { active: true } },              // Active ✓
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(true);
    expect(result.failures).toHaveLength(0);
  });

  it('fails on wrong planet house', () => {
    const claims: LLMClaim[] = [
      { type: 'planet_house', data: { planet: 4, house: 10 } },   // Jupiter in 10th — WRONG (actual: 4th)
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('Jupiter');
    expect(result.failures[0].message).toContain('house 4');
  });

  it('fails on wrong planet dignity', () => {
    const claims: LLMClaim[] = [
      { type: 'planet_dignity', data: { planet: 0, dignity: 'exalted' } }, // Sun exalted — WRONG (actual: neutral in Gemini)
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('Sun');
  });

  it('fails on wrong dasha reference', () => {
    const claims: LLMClaim[] = [
      { type: 'dasha_reference', data: { major: 4, sub: 5 } },    // Jupiter-Venus — WRONG
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('Mahadasha lord 4');
  });

  it('fails on hallucinated yoga', () => {
    const claims: LLMClaim[] = [
      { type: 'yoga_mentioned', data: { name: 'hamsa' } },        // Not in SAC
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
    expect(result.failures[0].message).toContain('hamsa');
  });

  it('fails on wrong sade sati status', () => {
    const claims: LLMClaim[] = [
      { type: 'sade_sati', data: { active: false } },             // WRONG — is active
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
  });

  it('passes verdict_tone claims (redundant with L1)', () => {
    const claims: LLMClaim[] = [
      { type: 'verdict_tone', data: { tone: 'anything' } },
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(true);
  });

  it('ignores unknown claim types', () => {
    const claims: LLMClaim[] = [
      { type: 'unknown_type' as any, data: { foo: 'bar' } },
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(true);
  });

  it('passes empty claims array', () => {
    const result = verifyClaims([], EXPECTED_SAC);
    expect(result.passed).toBe(true);
  });

  it('reports multiple failures', () => {
    const claims: LLMClaim[] = [
      { type: 'planet_house', data: { planet: 4, house: 10 } },   // Wrong
      { type: 'yoga_mentioned', data: { name: 'hamsa' } },        // Wrong
    ];
    const result = verifyClaims(claims, EXPECTED_SAC);
    expect(result.passed).toBe(false);
    expect(result.failures).toHaveLength(2);
  });
});

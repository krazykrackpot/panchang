/**
 * Domain Synthesis Scorer Tests
 */

import { describe, it, expect } from 'vitest';
import { scoreDomain, type ScorerInput } from '@/lib/kundali/domain-synthesis/scorer';
import { DOMAIN_CONFIGS } from '@/lib/kundali/domain-synthesis/config';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Neutral baseline input — produces a middling score. */
function neutralInput(): ScorerInput {
  return {
    houseBhavabala: 5,
    lordDignity: 'neutral',
    lordInKendra: false,
    beneficOccupants: 0,
    maleficOccupants: 0,
    beneficAspects: 0,
    maleficAspects: 0,
    relevantYogaCount: 1,
    relevantDoshaCount: 0,
    cancelledDoshas: 0,
    dashaActivatesHouse: false,
    vargaDeliveryScore: 50,
  };
}

/** Strong signals across the board. */
function strongInput(): ScorerInput {
  return {
    houseBhavabala: 9,
    lordDignity: 'exalted',
    lordInKendra: true,
    beneficOccupants: 2,
    maleficOccupants: 0,
    beneficAspects: 2,
    maleficAspects: 0,
    relevantYogaCount: 4,
    relevantDoshaCount: 0,
    cancelledDoshas: 0,
    dashaActivatesHouse: true,
    vargaDeliveryScore: 90,
  };
}

/** Weak / afflicted signals. */
function weakInput(): ScorerInput {
  return {
    houseBhavabala: 2,
    lordDignity: 'debilitated',
    lordInKendra: false,
    beneficOccupants: 0,
    maleficOccupants: 2,
    beneficAspects: 0,
    maleficAspects: 2,
    relevantYogaCount: 0,
    relevantDoshaCount: 3,
    cancelledDoshas: 0,
    dashaActivatesHouse: false,
    vargaDeliveryScore: 10,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('scoreDomain', () => {
  const healthConfig = DOMAIN_CONFIGS[0]; // health

  it('strong signals produce uttama rating (score >= 7.5)', () => {
    const result = scoreDomain(healthConfig, strongInput());
    expect(result.rating).toBe('uttama');
    expect(result.score).toBeGreaterThanOrEqual(7.5);
    expect(result.color).toBe('text-emerald-400');
    expect(result.label.en).toBe('Strong (Uttama)');
    expect(result.label.hi).toBe('प्रबल (उत्तम)');
  });

  it('weak signals produce adhama or atyadhama rating (score < 5.0)', () => {
    const result = scoreDomain(healthConfig, weakInput());
    expect(['adhama', 'atyadhama']).toContain(result.rating);
    expect(result.score).toBeLessThan(5.0);
  });

  it('all 8 domain configs produce valid ratings with neutral inputs', () => {
    const input = neutralInput();
    for (const config of DOMAIN_CONFIGS) {
      const result = scoreDomain(config, input);
      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(10);
      expect(['uttama', 'madhyama', 'adhama', 'atyadhama']).toContain(result.rating);
      expect(result.label.en).toBeTruthy();
      expect(result.label.hi).toBeTruthy();
      expect(result.color).toBeTruthy();
    }
  });

  it('score is deterministic (same input produces same output)', () => {
    const input = neutralInput();
    const result1 = scoreDomain(healthConfig, input);
    const result2 = scoreDomain(healthConfig, input);
    expect(result1).toEqual(result2);
  });

  it('score is rounded to 1 decimal place', () => {
    const result = scoreDomain(healthConfig, neutralInput());
    const decimals = result.score.toString().split('.')[1];
    // Either integer or at most 1 decimal
    expect(!decimals || decimals.length <= 1).toBe(true);
  });

  it('score is clamped between 0 and 10', () => {
    // Extreme high
    const high = scoreDomain(healthConfig, {
      ...strongInput(),
      houseBhavabala: 10,
      vargaDeliveryScore: 100,
    });
    expect(high.score).toBeLessThanOrEqual(10);

    // Extreme low
    const low = scoreDomain(healthConfig, {
      ...weakInput(),
      houseBhavabala: 0,
      relevantDoshaCount: 10,
      maleficOccupants: 4,
      maleficAspects: 4,
      vargaDeliveryScore: 0,
    });
    expect(low.score).toBeGreaterThanOrEqual(0);
  });

  it('kendra bonus increases lord placement score', () => {
    const base = neutralInput();
    const withKendra = { ...base, lordInKendra: true };
    const r1 = scoreDomain(healthConfig, base);
    const r2 = scoreDomain(healthConfig, withKendra);
    expect(r2.score).toBeGreaterThan(r1.score);
  });

  it('dasha activation increases score', () => {
    const base = neutralInput();
    const withDasha = { ...base, dashaActivatesHouse: true };
    const r1 = scoreDomain(healthConfig, base);
    const r2 = scoreDomain(healthConfig, withDasha);
    expect(r2.score).toBeGreaterThan(r1.score);
  });

  it('cancelled doshas reduce penalty', () => {
    const withDoshas: ScorerInput = {
      ...neutralInput(),
      relevantDoshaCount: 2,
      cancelledDoshas: 0,
    };
    const withCancelled: ScorerInput = {
      ...neutralInput(),
      relevantDoshaCount: 2,
      cancelledDoshas: 2,
    };
    const r1 = scoreDomain(healthConfig, withDoshas);
    const r2 = scoreDomain(healthConfig, withCancelled);
    expect(r2.score).toBeGreaterThan(r1.score);
  });
});

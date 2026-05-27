// src/lib/kundali/health-diagnosis/__tests__/weights.test.ts
import { describe, it, expect } from 'vitest';
import {
  DEFAULT_WEIGHTS,
  ELEMENT_WEIGHTS,
  weightVectorForElement,
} from '../weights';
import type { WeightVector } from '../weights';
import { ELEMENT_IDS } from '../element-catalog';

/** Sum all values in a WeightVector — must be within [0.95, 1.05] */
function sumWeights(wv: WeightVector): number {
  return Object.values(wv).reduce((acc, v) => acc + v, 0);
}

describe('WeightVector sums', () => {
  it('DEFAULT_WEIGHTS sums to ~1.0', () => {
    const s = sumWeights(DEFAULT_WEIGHTS);
    expect(s).toBeGreaterThanOrEqual(0.95);
    expect(s).toBeLessThanOrEqual(1.05);
  });

  it('every ELEMENT_WEIGHTS entry sums to ~1.0', () => {
    for (const [id, wv] of Object.entries(ELEMENT_WEIGHTS)) {
      const s = sumWeights(wv as WeightVector);
      expect(s, `${id} weight vector sums to ${s}`).toBeGreaterThanOrEqual(0.95);
      expect(s, `${id} weight vector sums to ${s}`).toBeLessThanOrEqual(1.05);
    }
  });

  it('ELEMENT_WEIGHTS covers all 22 element ids from ELEMENT_CATALOG', () => {
    const defined = new Set(Object.keys(ELEMENT_WEIGHTS));
    for (const id of ELEMENT_IDS) {
      expect(defined.has(id), `${id} missing from ELEMENT_WEIGHTS`).toBe(true);
    }
    expect(defined.size).toBe(22);
  });
});

describe('per-element constraints', () => {
  it('vitality: sunShadbala >= 0.15 and eighthLordDignity >= 0.1', () => {
    const wv = ELEMENT_WEIGHTS['vitality']!;
    expect(wv['sunShadbala']).toBeGreaterThanOrEqual(0.15);
    expect(wv['eighthLordDignity']).toBeGreaterThanOrEqual(0.1);
  });

  it('mental: moonShadbala >= 0.2 and aspectsOnMoon >= 0.1', () => {
    const wv = ELEMENT_WEIGHTS['mental']!;
    expect(wv['moonShadbala']).toBeGreaterThanOrEqual(0.2);
    expect(wv['aspectsOnMoon']).toBeGreaterThanOrEqual(0.1);
  });
});

describe('weightVectorForElement', () => {
  it('returns element-specific weights for known ids', () => {
    for (const id of ELEMENT_IDS) {
      const wv = weightVectorForElement(id);
      expect(wv).toBeDefined();
      expect(sumWeights(wv)).toBeGreaterThanOrEqual(0.95);
    }
  });

  it('returns DEFAULT_WEIGHTS for an unknown id', () => {
    // Cast to ElementId to force the call
    const wv = weightVectorForElement('__nonexistent__' as Parameters<typeof weightVectorForElement>[0]);
    expect(wv).toBe(DEFAULT_WEIGHTS);
  });
});

/**
 * Tests for the per-category analysis Zod schemas (REVIEW_TRACKER P4).
 * Schemas are permissive at launch — every field is optional and extra
 * fields pass through. The point is to catch blatant type mismatches
 * (string where number expected, etc.).
 */
import { describe, it, expect } from 'vitest';
import { validateAnalysis } from './schemas';
import { BRIHASPATI_CATEGORIES } from '../types';

describe('analysis schemas — permissive happy paths', () => {
  it.each(BRIHASPATI_CATEGORIES)('%s schema accepts an empty analysis blob', (category) => {
    const r = validateAnalysis(category, {});
    expect(r.ok).toBe(true);
  });

  it.each(BRIHASPATI_CATEGORIES)('%s schema accepts unknown fields (passthrough)', (category) => {
    const r = validateAnalysis(category, { unknown_field: 'whatever', another: 42 });
    expect(r.ok).toBe(true);
  });

  it('career schema accepts the spec-shaped blob', () => {
    const r = validateAnalysis('career', {
      tenth_lord_state: 'strong',
      dasa_affecting: 'Saturn-Jupiter',
      dignity_of_significators: [{ planet: 'Saturn', dignity: 'own', house: 10 }],
    });
    expect(r.ok).toBe(true);
  });

  it('marriage schema accepts manglik:boolean and timing_windows array', () => {
    const r = validateAnalysis('marriage', {
      seventh_house_state: 'mixed',
      manglik: false,
      timing_windows: [{ lord: 'Venus', start: '2027-03-14', end: '2034-03-14' }],
    });
    expect(r.ok).toBe(true);
  });

  it('finance schema accepts wealth_score as number', () => {
    const r = validateAnalysis('finance', { wealth_score: 7 });
    expect(r.ok).toBe(true);
  });
});

describe('analysis schemas — type mismatches caught', () => {
  it('career schema rejects dignity_of_significators that is not an array', () => {
    const r = validateAnalysis('career', { dignity_of_significators: 'not an array' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errors.length).toBeGreaterThan(0);
  });

  it('marriage schema rejects manglik as string', () => {
    const r = validateAnalysis('marriage', { manglik: 'no' });
    expect(r.ok).toBe(false);
  });

  it('finance schema rejects wealth_score as string', () => {
    const r = validateAnalysis('finance', { wealth_score: 'high' });
    expect(r.ok).toBe(false);
  });
});

describe('analysis schemas — coverage', () => {
  it('has a schema for every category', () => {
    for (const category of BRIHASPATI_CATEGORIES) {
      // Just ensure it doesn't throw — empty blob should pass for all
      expect(() => validateAnalysis(category, {})).not.toThrow();
    }
  });
});

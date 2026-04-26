import { describe, it, expect } from 'vitest';
import { scoreDashaHarmony } from '../dasha-harmony';
import { getExtendedActivity } from '../activity-rules-extended';

describe('scoreDashaHarmony', () => {
  it('returns max score when antar lord is in activity goodHoras', () => {
    const marriage = getExtendedActivity('marriage');
    // marriage.goodHoras = [5, 4, 1] → Venus, Jupiter, Moon
    const result = scoreDashaHarmony(
      { maha: 1, antar: 4, pratyantar: 0 }, // Jupiter antardasha
      marriage,
    );
    expect(result.score).toBe(10);
    expect(result.favorable).toBe(true);
  });

  it('returns partial score when only maha lord matches', () => {
    const marriage = getExtendedActivity('marriage');
    const result = scoreDashaHarmony(
      { maha: 4, antar: 6, pratyantar: 0 },
      marriage,
    );
    expect(result.score).toBe(5);
    expect(result.favorable).toBe(true);
  });

  it('returns 0 for malefic antar lord', () => {
    const marriage = getExtendedActivity('marriage');
    const result = scoreDashaHarmony(
      { maha: 2, antar: 6, pratyantar: 0 },
      marriage,
    );
    expect(result.score).toBe(0);
    expect(result.favorable).toBe(false);
  });

  it('returns neutral score for non-matching non-malefic lord', () => {
    const marriage = getExtendedActivity('marriage');
    const result = scoreDashaHarmony(
      { maha: 0, antar: 3, pratyantar: 0 }, // Mercury antar
      marriage,
    );
    expect(result.score).toBe(3);
    expect(result.favorable).toBe(true);
  });

  it('works with different activities', () => {
    const surgery = getExtendedActivity('surgery');
    // surgery.goodHoras = [2, 0, 4] → Mars, Sun, Jupiter
    const result = scoreDashaHarmony(
      { maha: 0, antar: 2, pratyantar: 0 },
      surgery,
    );
    expect(result.score).toBe(10);
    expect(result.favorable).toBe(true);
  });

  it('returns score between 0 and 10', () => {
    const activities = ['marriage', 'travel', 'property', 'education'] as const;
    for (const actId of activities) {
      const act = getExtendedActivity(actId);
      for (let antar = 0; antar <= 8; antar++) {
        const result = scoreDashaHarmony(
          { maha: 0, antar, pratyantar: 0 },
          act,
        );
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(10);
        expect(typeof result.label).toBe('string');
        expect(typeof result.favorable).toBe('boolean');
      }
    }
  });
});

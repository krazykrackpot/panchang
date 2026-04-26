import { describe, it, expect } from 'vitest';
import { scorePrakriti, PRAKRITI_QUESTIONS } from '../prakriti-quiz';

describe('PRAKRITI_QUESTIONS', () => {
  it('has exactly 5 questions', () => {
    expect(PRAKRITI_QUESTIONS.length).toBe(5);
  });

  it('each question has 3 options covering all doshas', () => {
    for (const q of PRAKRITI_QUESTIONS) {
      expect(q.options.length).toBe(3);
      const doshas = q.options.map(o => o.dosha).sort();
      expect(doshas).toEqual(['kapha', 'pitta', 'vata']);
    }
  });

  it('each question has en and hi text', () => {
    for (const q of PRAKRITI_QUESTIONS) {
      expect(q.question.en).toBeTruthy();
      expect(q.question.hi).toBeTruthy();
      for (const o of q.options) {
        expect(o.label.en).toBeTruthy();
        expect(o.label.hi).toBeTruthy();
      }
    }
  });
});

describe('scorePrakriti', () => {
  it('returns correct dominant for all-vata answers', () => {
    const answers = { frame: 'vata' as const, digestion: 'vata' as const, sleep: 'vata' as const, stress: 'vata' as const, energy: 'vata' as const };
    const result = scorePrakriti(answers);
    expect(result.dominant).toBe('vata');
    expect(result.scores.vata).toBe(5);
    expect(result.label).toMatch(/^Vata/);
  });

  it('returns correct profile for mixed answers', () => {
    // pitta=3, kapha=2, vata=0 → dominant pitta, secondary kapha
    const answers = { frame: 'pitta' as const, digestion: 'pitta' as const, sleep: 'kapha' as const, stress: 'pitta' as const, energy: 'kapha' as const };
    const result = scorePrakriti(answers);
    expect(result.dominant).toBe('pitta');
    expect(result.scores.pitta).toBe(3);
    expect(result.label).toBe('Pitta-Kapha');
  });

  it('scores are always between 0 and 5', () => {
    const answers = { frame: 'vata' as const, digestion: 'pitta' as const, sleep: 'kapha' as const, stress: 'vata' as const, energy: 'pitta' as const };
    const result = scorePrakriti(answers);
    for (const score of Object.values(result.scores)) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(5);
    }
  });
});

import { describe, it, expect } from 'vitest';
import { RASHI_PAIR_CONTENT, getPairContent } from '@/lib/constants/rashi-compatibility';

describe('RASHI_PAIR_CONTENT', () => {
  it('has exactly 78 entries', () => {
    expect(RASHI_PAIR_CONTENT).toHaveLength(78);
  });

  it('each pair has rashi1 <= rashi2', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.rashi1).toBeLessThanOrEqual(p.rashi2);
    });
  });

  it('each pair has en content for all narrative fields', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.summary.en).toBeTruthy();
      expect(p.temperament.en).toBeTruthy();
      expect(p.communication.en).toBeTruthy();
      expect(p.romance.en).toBeTruthy();
      expect(p.career.en).toBeTruthy();
      expect(p.challenges.en).toBeTruthy();
      expect(p.remedies.en).toBeTruthy();
      expect(p.oneLiner.en).toBeTruthy();
    });
  });

  it('score is between 0 and 36', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.score).toBeGreaterThanOrEqual(0);
      expect(p.score).toBeLessThanOrEqual(36);
    });
  });

  it('summary and oneLiner have hi translations', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.summary.hi).toBeTruthy();
      expect(p.oneLiner.hi).toBeTruthy();
    });
  });

  it('all narrative fields have sa (Sanskrit) translations', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.oneLiner.sa).toBeTruthy();
      expect(p.summary.sa).toBeTruthy();
      expect(p.temperament.sa).toBeTruthy();
      expect(p.communication.sa).toBeTruthy();
      expect(p.romance.sa).toBeTruthy();
      expect(p.career.sa).toBeTruthy();
      expect(p.challenges.sa).toBeTruthy();
      expect(p.remedies.sa).toBeTruthy();
    });
  });

  it('covers all unique pairs (no duplicates)', () => {
    const keys = RASHI_PAIR_CONTENT.map(p => `${p.rashi1}-${p.rashi2}`);
    const unique = new Set(keys);
    expect(unique.size).toBe(78);
  });

  it('same-element trines have high scores (28+)', () => {
    // Aries-Leo (1-5), Aries-Sagittarius (1-9), Leo-Sagittarius (5-9) are fire trines
    const fireTrines = [
      getPairContent(1, 5),
      getPairContent(1, 9),
      getPairContent(5, 9),
    ];
    fireTrines.forEach(p => {
      expect(p).toBeDefined();
      expect(p!.score).toBeGreaterThanOrEqual(28);
    });
  });

  it('enemy lords + 6/8 distance have low scores (<= 18)', () => {
    // Sun (Leo 5) vs Saturn (Capricorn 10) — enemies, 6 apart
    const p = getPairContent(5, 10);
    expect(p).toBeDefined();
    expect(p!.score).toBeLessThanOrEqual(18);
  });
});

describe('getPairContent', () => {
  it('returns content for valid pair either order', () => {
    const p1 = getPairContent(1, 2);
    const p2 = getPairContent(2, 1);
    expect(p1).toBeDefined();
    expect(p1).toEqual(p2);
  });

  it('returns undefined for invalid IDs', () => {
    expect(getPairContent(0, 13)).toBeUndefined();
  });

  it('returns content for same-sign pair', () => {
    const p = getPairContent(1, 1);
    expect(p).toBeDefined();
    expect(p!.rashi1).toBe(1);
    expect(p!.rashi2).toBe(1);
  });
});

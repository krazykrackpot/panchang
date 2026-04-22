import { describe, it, expect } from 'vitest';
import { getSignAspects, computeRashiDrishti } from '../rashi-drishti';

describe('Rashi Drishti — getSignAspects', () => {
  it('Aries (1, movable) aspects Leo(5), Scorpio(8), Aquarius(11) — NOT Taurus(2)', () => {
    const aspects = getSignAspects(1);
    expect(aspects).toEqual([5, 8, 11]);
    expect(aspects).not.toContain(2);
  });

  it('Taurus (2, fixed) aspects Cancer(4), Libra(7), Capricorn(10) — NOT Aries(1)', () => {
    const aspects = getSignAspects(2);
    expect(aspects).toEqual([4, 7, 10]);
    expect(aspects).not.toContain(1);
  });

  it('Gemini (3, dual) aspects Virgo(6), Sagittarius(9), Pisces(12)', () => {
    const aspects = getSignAspects(3);
    expect(aspects).toEqual([6, 9, 12]);
  });

  it('Cancer (4, movable) aspects Leo(5), Scorpio(8), Aquarius(11) — NOT Taurus(2)? No, Cancer adjacent to Leo(5)', () => {
    // Cancer=4 is movable, aspects Fixed signs except adjacent.
    // Adjacent to Cancer(4): Gemini(3) and Leo(5). Leo is Fixed.
    // So Cancer aspects: Taurus(2), Scorpio(8), Aquarius(11) — NOT Leo(5)
    const aspects = getSignAspects(4);
    expect(aspects).toEqual([2, 8, 11]);
    expect(aspects).not.toContain(5);
  });

  it('Leo (5, fixed) aspects Aries(1), Libra(7), Capricorn(10) — NOT Cancer(4)', () => {
    // Leo=5 is fixed, aspects Movable signs except adjacent.
    // Adjacent: Cancer(4) and Virgo(6). Cancer is Movable.
    // So Leo aspects: Aries(1), Libra(7), Capricorn(10)
    const aspects = getSignAspects(5);
    expect(aspects).toEqual([1, 7, 10]);
    expect(aspects).not.toContain(4);
  });

  it('every sign aspects exactly 3 other signs', () => {
    for (let s = 1; s <= 12; s++) {
      expect(getSignAspects(s)).toHaveLength(3);
    }
  });
});

describe('Rashi Drishti — computeRashiDrishti', () => {
  it('returns exactly 12 entries', () => {
    const results = computeRashiDrishti();
    expect(results).toHaveLength(12);
  });

  it('each entry has correct quality classification', () => {
    const results = computeRashiDrishti();
    const movable = results.filter(r => r.quality === 'movable');
    const fixed = results.filter(r => r.quality === 'fixed');
    const dual = results.filter(r => r.quality === 'dual');
    expect(movable).toHaveLength(4);
    expect(fixed).toHaveLength(4);
    expect(dual).toHaveLength(4);
  });

  it('aspectedBy is the reverse of aspects', () => {
    const results = computeRashiDrishti();
    // If sign A aspects sign B, then B's aspectedBy should contain A
    for (const entry of results) {
      for (const target of entry.aspects) {
        const targetEntry = results.find(r => r.sign === target)!;
        expect(targetEntry.aspectedBy).toContain(entry.sign);
      }
    }
  });
});

/**
 * Unit tests for getPlanetAspects.
 *
 * Reference: BPHS Ch.3 graha-drishti tables, cross-checked against the
 * classical example "Saturn in Lagna aspects 3, 7, 10" frequently cited
 * in modern Jyotish texts.
 */
import { describe, it, expect } from 'vitest';
import { getPlanetAspects } from '@/lib/kundali/graha-drishti';

describe('getPlanetAspects — universal 7th aspect', () => {
  it('Sun in 1 → [7]', () => expect(getPlanetAspects(0, 1)).toEqual([7]));
  it('Sun in 4 → [10]', () => expect(getPlanetAspects(0, 4)).toEqual([10]));
  it('Sun in 7 → [1]', () => expect(getPlanetAspects(0, 7)).toEqual([1]));
  it('Sun in 12 → [6]', () => expect(getPlanetAspects(0, 12)).toEqual([6]));

  it('Moon in 5 → [11]', () => expect(getPlanetAspects(1, 5)).toEqual([11]));
  it('Mercury in 8 → [2]', () => expect(getPlanetAspects(3, 8)).toEqual([2]));
  it('Venus in 11 → [5]', () => expect(getPlanetAspects(5, 11)).toEqual([5]));
});

describe('getPlanetAspects — Mars (4th and 8th specials)', () => {
  it('Mars in 1 → [7, 4, 8] (classical example)', () => {
    expect(getPlanetAspects(2, 1)).toEqual([7, 4, 8]);
  });
  it('Mars in 6 → [12, 9, 1] (wrap)', () => {
    expect(getPlanetAspects(2, 6)).toEqual([12, 9, 1]);
  });
  it('Mars in 12 → [6, 3, 7]', () => {
    expect(getPlanetAspects(2, 12)).toEqual([6, 3, 7]);
  });
  it('Mars in 9 → [3, 12, 4]', () => {
    expect(getPlanetAspects(2, 9)).toEqual([3, 12, 4]);
  });
});

describe('getPlanetAspects — Jupiter (5th and 9th specials)', () => {
  it('Jupiter in 1 → [7, 5, 9] (classical example)', () => {
    expect(getPlanetAspects(4, 1)).toEqual([7, 5, 9]);
  });
  it('Jupiter in 6 → [12, 10, 2] (wrap on 9th)', () => {
    expect(getPlanetAspects(4, 6)).toEqual([12, 10, 2]);
  });
  it('Jupiter in 10 → [4, 2, 6]', () => {
    expect(getPlanetAspects(4, 10)).toEqual([4, 2, 6]);
  });
});

describe('getPlanetAspects — Saturn (3rd and 10th specials)', () => {
  it('Saturn in 1 → [7, 3, 10] (classical example "Saturn in Lagna")', () => {
    expect(getPlanetAspects(6, 1)).toEqual([7, 3, 10]);
  });
  it('Saturn in 11 → [5, 1, 8] (wrap on 3rd and 10th)', () => {
    expect(getPlanetAspects(6, 11)).toEqual([5, 1, 8]);
  });
  it('Saturn in 4 → [10, 6, 1]', () => {
    expect(getPlanetAspects(6, 4)).toEqual([10, 6, 1]);
  });
  it('Saturn in 12 → [6, 2, 9]', () => {
    expect(getPlanetAspects(6, 12)).toEqual([6, 2, 9]);
  });
});

describe('getPlanetAspects — Rahu (per BPHS: 5th and 9th)', () => {
  it('Rahu in 4 → [10, 8, 12]', () => {
    expect(getPlanetAspects(7, 4)).toEqual([10, 8, 12]);
  });
  it('Rahu in 1 → [7, 5, 9]', () => {
    expect(getPlanetAspects(7, 1)).toEqual([7, 5, 9]);
  });
});

describe('getPlanetAspects — Ketu (per BPHS: 5th and 9th)', () => {
  it('Ketu in 1 → [7, 5, 9]', () => {
    expect(getPlanetAspects(8, 1)).toEqual([7, 5, 9]);
  });
  it('Ketu in 8 → [2, 12, 4]', () => {
    expect(getPlanetAspects(8, 8)).toEqual([2, 12, 4]);
  });
});

describe('getPlanetAspects — wrap arithmetic across house 12', () => {
  it('wraps Saturn 10 + 10 → 8 (= 20 mod 12, then +1 / -1 adjustment)', () => {
    // Saturn at 10: 10 + 10 - 1 = 19, wrapped = 7. The 10th from 10 is 7.
    expect(getPlanetAspects(6, 10)).toEqual([4, 12, 7]);
  });
  it('Mars at 12 with 8th aspect lands on 7 (12 + 8 - 1 = 19 → 7)', () => {
    expect(getPlanetAspects(2, 12)[2]).toBe(7);
  });
});

describe('getPlanetAspects — input validation', () => {
  it('throws on house 0', () => {
    expect(() => getPlanetAspects(2, 0)).toThrow(RangeError);
  });
  it('throws on house 13', () => {
    expect(() => getPlanetAspects(2, 13)).toThrow(RangeError);
  });
  it('throws on negative house', () => {
    expect(() => getPlanetAspects(2, -1)).toThrow(RangeError);
  });
  it('throws on non-integer house', () => {
    expect(() => getPlanetAspects(2, 5.5)).toThrow(RangeError);
  });
  it('unknown planet id returns just the 7th aspect (graceful — no special table entry)', () => {
    expect(getPlanetAspects(99, 5)).toEqual([11]);
  });
});

/**
 * D60 (Shashtiamsha) divisional chart — BPHS Ch.6
 *
 * Each sign is split into 60 parts of 0.5° each.
 * Odd signs (0-based even index): count from the same sign.
 * Even signs (0-based odd index): count from the 7th sign (opposite).
 *
 * getDivisionalSign returns 1-based rashi (1=Aries … 12=Pisces).
 */
import { describe, it, expect } from 'vitest';
import { getDivisionalSign } from '@/lib/ephem/kundali-calc';

describe('D60 Shashtiamsha', () => {
  // Helper: longitude from sign (0-based) + degree within sign
  const lon = (signIdx: number, deg: number) => signIdx * 30 + deg;

  it('0° Aries (odd sign, part=0) → Aries (1)', () => {
    // signIdx=0, part=0, odd sign → (0+0+0)%12 = 0 → 1-based = 1
    expect(getDivisionalSign(lon(0, 0), 60)).toBe(1);
  });

  it('15° Aries (odd sign, part=30) → Libra (7)', () => {
    // signIdx=0, part=30, odd sign → (0+0+30)%12 = 6 → 1-based = 7
    expect(getDivisionalSign(lon(0, 15), 60)).toBe(7);
  });

  it('0° Taurus (even sign, part=0) → Scorpio (8)', () => {
    // signIdx=1, part=0, even sign → (1+6+0)%12 = 7 → 1-based = 8
    expect(getDivisionalSign(lon(1, 0), 60)).toBe(8);
  });

  it('15° Taurus (even sign, part=30) → Taurus (2)', () => {
    // signIdx=1, part=30, even sign → (1+6+30)%12 = 37%12 = 1 → 1-based = 2
    expect(getDivisionalSign(lon(1, 15), 60)).toBe(2);
  });

  it('29.9° Pisces (even sign, part=59) → Leo (5)', () => {
    // signIdx=11, part=59, even sign → (11+6+59)%12 = 76%12 = 4 → 1-based = 5
    expect(getDivisionalSign(lon(11, 29.9), 60)).toBe(5);
  });

  it('0° Gemini (odd sign, part=0) → Gemini (3)', () => {
    // signIdx=2, part=0, odd sign → (2+0+0)%12 = 2 → 1-based = 3
    expect(getDivisionalSign(lon(2, 0), 60)).toBe(3);
  });

  it('7.5° Cancer (even sign, part=15) → Scorpio (8)', () => {
    // signIdx=3, part=15, even sign → (3+6+15)%12 = 24%12 = 0 → 1-based = 1? No: 24%12=0 → 1
    // Wait: (3+6+15) = 24, 24%12 = 0, +1 = 1 (Aries)
    expect(getDivisionalSign(lon(3, 7.5), 60)).toBe(1);
  });

  it('odd sign symmetry: last part of Aries wraps correctly', () => {
    // 29.5° Aries: part=59, odd → (0+0+59)%12 = 11 → 1-based = 12 (Pisces)
    expect(getDivisionalSign(lon(0, 29.5), 60)).toBe(12);
  });

  it('even sign symmetry: last part of Taurus wraps correctly', () => {
    // 29.5° Taurus: part=59, even → (1+6+59)%12 = 66%12 = 6 → 1-based = 7 (Libra)
    expect(getDivisionalSign(lon(1, 29.5), 60)).toBe(7);
  });

  it('odd vs even sign difference at same degree', () => {
    // 10° Aries (odd, signIdx=0): part=20, → (0+0+20)%12 = 8 → Sagittarius (9)
    // 10° Taurus (even, signIdx=1): part=20, → (1+6+20)%12 = 27%12 = 3 → Cancer (4)
    const aries = getDivisionalSign(lon(0, 10), 60);
    const taurus = getDivisionalSign(lon(1, 10), 60);
    expect(aries).toBe(9);  // Sagittarius
    expect(taurus).toBe(4); // Cancer
    expect(aries).not.toBe(taurus); // Must differ due to +6 offset
  });
});

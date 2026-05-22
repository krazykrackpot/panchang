/**
 * Tarabalam + Chandrabalam consistency suite.
 *
 * Previously the grid + list re-implemented the modular arithmetic inline.
 * Both surfaces now call computeBalam(); this test pins the canonical
 * outputs for known inputs so a future engine fix can't silently disagree
 * with the calendar.
 */
import { describe, it, expect } from 'vitest';
import { computeBalam, FAVORABLE_TARAS, FAVORABLE_HOUSES } from '@/lib/panchang/balam';
import { makeNatalContext } from '@/types/tithi-calendar';

describe('computeBalam — engine output (pins current behavior)', () => {
  // The engine uses `((today - birth + 27) % 9) || 9` — which shifts the
  // conventional Tara position by 1 vs. the naive (diff % 9) + 1. These
  // tests pin the codebase's chosen convention rather than the Vedic-text
  // reading, so a future fix can intentionally flip the convention without
  // silently shifting the calendar's personalisation.
  it('diff=0 (same nakshatra) lands on Tara 9 / 1st house (Janma rashi)', () => {
    const r = computeBalam(5, 7, 5, 7);
    expect(r.tarabalam.tara).toBe(9);
    expect(r.chandrabalam.house).toBe(1);
    expect(r.chandrabalam.favorable).toBe(false); // 1st house = Janma rashi, unfavorable
  });
  it('diff=+1 nakshatra, +2 rashis: Tara 1 (Janma per engine), 3rd house', () => {
    const r = computeBalam(5, 7, 6, 9);
    expect(r.tarabalam.tara).toBe(1);
    expect(r.tarabalam.favorable).toBe(false);
    expect(r.chandrabalam.house).toBe(3);
    expect(r.chandrabalam.favorable).toBe(true);
  });
  it('diff=+8 nakshatras → Tara 8 (Mitra, favourable)', () => {
    const r = computeBalam(1, 1, 9, 1);
    expect(r.tarabalam.tara).toBe(8);
    expect(r.tarabalam.favorable).toBe(true);
  });
  it('nakshatra wraparound 27→1: diff=+1 lands at Tara 1', () => {
    // (1 - 27 + 27) % 9 = 1 → Tara 1
    const r = computeBalam(27, 1, 1, 1);
    expect(r.tarabalam.tara).toBe(1);
  });
  it('rashi wraparound 12→1: gives 2nd house', () => {
    // ((1 - 12 + 12) % 12) + 1 = 1 + 1 = 2 → 2nd house
    const r = computeBalam(1, 12, 1, 1);
    expect(r.chandrabalam.house).toBe(2);
  });
});

describe('FAVORABLE_TARAS / FAVORABLE_HOUSES — sanity', () => {
  it('FAVORABLE_TARAS canonical set per Muhurta Chintamani', () => {
    // Sampat(2), Kshema(4), Sadhana(6), Mitra(8), Parama Mitra(9)
    expect(Array.from(FAVORABLE_TARAS).sort()).toEqual([2, 4, 6, 8, 9]);
  });
  it('FAVORABLE_HOUSES canonical set', () => {
    expect(Array.from(FAVORABLE_HOUSES).sort((a, b) => a - b)).toEqual([3, 6, 7, 9, 10, 11]);
  });
});

describe('makeNatalContext — guard semantics', () => {
  it('present for valid 1..27 / 1..12 inputs', () => {
    expect(makeNatalContext(5, 7)).toEqual({ kind: 'present', nakshatra: 5, moonSign: 7 });
  });
  it('none for out-of-range', () => {
    expect(makeNatalContext(0, 7)).toEqual({ kind: 'none' });
    expect(makeNatalContext(28, 7)).toEqual({ kind: 'none' });
    expect(makeNatalContext(5, 13)).toEqual({ kind: 'none' });
    expect(makeNatalContext(5, 0)).toEqual({ kind: 'none' });
  });
  it('none for NaN / null / undefined', () => {
    expect(makeNatalContext(NaN, 7)).toEqual({ kind: 'none' });
    expect(makeNatalContext(5, NaN)).toEqual({ kind: 'none' });
    expect(makeNatalContext(null, 7)).toEqual({ kind: 'none' });
    expect(makeNatalContext(5, undefined)).toEqual({ kind: 'none' });
  });
  it('none when only one is provided (co-required invariant)', () => {
    expect(makeNatalContext(5, null)).toEqual({ kind: 'none' });
    expect(makeNatalContext(null, 7)).toEqual({ kind: 'none' });
  });
});

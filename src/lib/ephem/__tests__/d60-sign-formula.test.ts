/**
 * D60 sign-calculation formula — exercises both supported conventions
 * (existing 'sanjay-rath-simplified' vs new 'bphs-canonical').
 *
 * BPHS-canonical formula (Ch.6 v.33 "tadraaseh", per JHora author Rao's
 * clarification): `((signIndex + part) % 12) + 1`, where
 * `part = floor(degInSign * 2)` is the 0..59 segment number.
 *
 * Sanjay-Rath-simplified (existing default): same as BPHS for odd signs;
 * for even signs add a +6 offset. Kept as default in this PR so engine
 * behaviour is unchanged unless callers opt in. PR-I flips the default
 * with a settings toggle + DB persistence.
 *
 * Key invariant: for ODD signs both conventions return the same sign for
 * every degree. Differences appear only in even signs.
 */

import { describe, it, expect } from 'vitest';
import { getDivisionalSign, generateKundali } from '../kundali-calc';

const SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
] as const;
const sign = (n: number) => SIGN_NAMES[n - 1];

describe('getDivisionalSign D60 — default convention (sanjay-rath-simplified)', () => {
  it('Aries (odd) 0° → Aries', () => {
    expect(getDivisionalSign(0, 60)).toBe(1);
  });

  it('Aries 15° → Libra (segment 30, 30 % 12 = 6, +1 = 7)', () => {
    expect(getDivisionalSign(15, 60)).toBe(7);
  });

  it('Aries 29.5° → Pisces (segment 59, 59 % 12 = 11, +1 = 12)', () => {
    expect(getDivisionalSign(29.5, 60)).toBe(12);
  });

  it('Taurus (even) 0° → Scorpio (signIndex 1 + d60Offset 6 + part 0, mod 12, +1 = 8)', () => {
    expect(getDivisionalSign(30, 60)).toBe(8);
    expect(sign(getDivisionalSign(30, 60))).toBe('Scorpio');
  });

  it('Taurus 15° → Taurus (signIndex 1 + 6 + 30, mod 12, +1)', () => {
    expect(getDivisionalSign(45, 60)).toBe(2);
  });
});

describe('getDivisionalSign D60 — BPHS-canonical convention (opt-in)', () => {
  const opts = { d60SignConvention: 'bphs-canonical' as const };

  it('Aries (odd) 0° → Aries (matches default for odd signs)', () => {
    expect(getDivisionalSign(0, 60, opts)).toBe(1);
  });

  it('Aries 15° → Libra (matches default for odd signs)', () => {
    expect(getDivisionalSign(15, 60, opts)).toBe(7);
  });

  it('Aries 29.5° → Pisces (matches default for odd signs)', () => {
    expect(getDivisionalSign(29.5, 60, opts)).toBe(12);
  });

  it('Taurus (even) 0° → Taurus (NO +6 offset; different from default)', () => {
    // signIndex 1, part 0 → (1+0)%12 + 1 = 2 (Taurus)
    // Default gives Libra (7); canonical gives Taurus (2).
    expect(getDivisionalSign(30, 60, opts)).toBe(2);
    expect(getDivisionalSign(30, 60)).not.toBe(2); // default differs
  });

  it('Taurus 15° → Scorpio (different from default Taurus)', () => {
    // signIndex 1, part 30 → (1+30)%12 + 1 = 8 (Scorpio)
    expect(getDivisionalSign(45, 60, opts)).toBe(8);
    expect(sign(getDivisionalSign(45, 60, opts))).toBe('Scorpio');
  });

  it('Taurus 29.5° → Aries (segment 59, (1+59)%12+1 = 1)', () => {
    expect(getDivisionalSign(59.5, 60, opts)).toBe(1);
    expect(sign(getDivisionalSign(59.5, 60, opts))).toBe('Aries');
  });
});

describe('getDivisionalSign D60 — odd-sign invariant', () => {
  it('returns the same sign for both conventions across all 60 odd-sign segments', () => {
    // Sweep Aries at every 0.5° boundary and verify the two conventions match.
    for (let i = 0; i < 60; i++) {
      const deg = i * 0.5;
      const def = getDivisionalSign(deg, 60);
      const can = getDivisionalSign(deg, 60, { d60SignConvention: 'bphs-canonical' });
      expect(def).toBe(can);
    }
    // Same for Leo (signIndex 4, odd)
    for (let i = 0; i < 60; i++) {
      const deg = 120 + i * 0.5;
      const def = getDivisionalSign(deg, 60);
      const can = getDivisionalSign(deg, 60, { d60SignConvention: 'bphs-canonical' });
      expect(def).toBe(can);
    }
  });

  it('always differs by exactly +6 for even signs', () => {
    // Default for even sign = canonical shifted by +6 (mod 12).
    for (let i = 0; i < 60; i++) {
      const deg = 30 + i * 0.5; // Taurus, signIndex 1
      const def = getDivisionalSign(deg, 60);
      const can = getDivisionalSign(deg, 60, { d60SignConvention: 'bphs-canonical' });
      const shifted = ((can - 1 + 6) % 12) + 1;
      expect(def).toBe(shifted);
    }
  });
});

describe('generateKundali D60 — opts threading', () => {
  const EINSTEIN = {
    name: 'Albert Einstein',
    date: '1879-03-14',
    time: '11:30',
    place: 'Ulm',
    lat: 48.3974,
    lng: 9.9934,
    timezone: 'Europe/Berlin',
    ayanamsha: 'lahiri' as const,
  };

  it('default omitted → existing simplified behaviour preserved', () => {
    const k = generateKundali(EINSTEIN);
    expect(k.divisionalCharts?.D60).toBeDefined();
    // No assertion on specific values — the point is the API still works.
  });

  it('opts.d60SignConvention=bphs-canonical changes D60 placement vs default', () => {
    const kDefault = generateKundali(EINSTEIN);
    const kCanonical = generateKundali(EINSTEIN, { d60SignConvention: 'bphs-canonical' });
    // D60 ascendant sign should differ for an even-sign ascendant; for odd it
    // would be identical. Einstein's ascendant is Gemini (sign 3, odd), so
    // ascendant D60 sign will match; but per-planet placements include
    // planets in even signs (Pisces, Capricorn) — those should differ.
    const d1Default = kDefault.divisionalCharts!.D60;
    const d1Canonical = kCanonical.divisionalCharts!.D60;
    // At least ONE planet placement must differ between the two conventions
    // (Einstein has multiple planets in Pisces — an even sign).
    const planetsDifferent = JSON.stringify(d1Default.houses) !== JSON.stringify(d1Canonical.houses);
    expect(planetsDifferent).toBe(true);
  });

  it('explicit sanjay-rath-simplified produces identical output to omitted default', () => {
    const kOmitted = generateKundali(EINSTEIN);
    const kExplicit = generateKundali(EINSTEIN, { d60SignConvention: 'sanjay-rath-simplified' });
    expect(kOmitted.divisionalCharts?.D60).toEqual(kExplicit.divisionalCharts?.D60);
  });
});

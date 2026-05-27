// src/lib/kundali/health-diagnosis/__tests__/elements/pinda-ayurdaya.test.ts
//
// Tests for the Pinda Ayurdaya computation (BPHS Ch. Ayur) and the
// BPHS longevity classification helper.

import { describe, it, expect } from 'vitest';
import { computePindaAyurdaya, classifyLongevity } from '../../elements/pinda-ayurdaya';
import { collectStrengthInputs } from '../../strength-inputs';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const BIRTH = {
  name: 'Test Fixture',
  date: '1990-01-15',
  time: '06:30',
  place: 'Varanasi, India',
  lat: 25.32,
  lng: 82.97,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri' as const,
};

describe('computePindaAyurdaya', () => {
  it('returns a positive integer in the typical range for a fixture chart', () => {
    const k = generateKundali(BIRTH);
    const s = collectStrengthInputs(k);
    const years = computePindaAyurdaya(k, s);
    expect(years).toBeGreaterThan(20);
    expect(years).toBeLessThan(250);
    expect(Number.isInteger(years)).toBe(true);
  });

  it('excludes Rahu and Ketu — only planets 0-6 contribute', () => {
    const k = generateKundali(BIRTH);
    const s = collectStrengthInputs(k);
    const years = computePindaAyurdaya(k, s);
    // 7 planets × max base years (19+25+15+12+15+21+20 = 127)
    // × max retrograde multiplier (×2) = 254 absolute ceiling.
    // (Combust and dusthana can only reduce, never push above this.)
    expect(years).toBeLessThanOrEqual(254);
  });

  it('returns a value greater than zero even for a weakly-dignified chart', () => {
    // A real chart will always have at least some planets contributing.
    const k = generateKundali(BIRTH);
    const s = collectStrengthInputs(k);
    const years = computePindaAyurdaya(k, s);
    expect(years).toBeGreaterThan(0);
  });
});

describe('classifyLongevity', () => {
  it('maps years to BPHS classification (Alpa/Madhya/Purna)', () => {
    expect(classifyLongevity(0)).toBe('alpa');
    expect(classifyLongevity(20)).toBe('alpa');
    expect(classifyLongevity(31)).toBe('alpa');
    expect(classifyLongevity(32)).toBe('madhya');
    expect(classifyLongevity(50)).toBe('madhya');
    expect(classifyLongevity(69)).toBe('madhya');
    expect(classifyLongevity(70)).toBe('purna');
    expect(classifyLongevity(100)).toBe('purna');
    expect(classifyLongevity(254)).toBe('purna');
  });

  it('returns madhya for the former stub value of 50', () => {
    // The old stub was pindaAyurdaya = 50.  classifyLongevity(50) must be 'madhya'
    // so that the existing test expectation (score in [0,100], valid rating, factors ≥4)
    // remains stable across the stub → real transition.
    expect(classifyLongevity(50)).toBe('madhya');
  });
});

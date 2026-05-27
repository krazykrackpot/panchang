// src/lib/kundali/health-diagnosis/__tests__/elements/allergies.test.ts
// B20 — inferential badge, opt-in (defaultVisible: false)
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { collectStrengthInputs } from '../../strength-inputs';
import { detectAllSignatures } from '../../signatures';
import { scoreAllergies } from '../../elements/allergies';
import { ELEMENT_CATALOG } from '../../element-catalog';

const BIRTH: BirthData = { name: 'Test Fixture', date: '1990-01-15', time: '06:30', place: 'Varanasi, India', lat: 25.32, lng: 82.97, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' };
const kundali = generateKundali(BIRTH);
const strength = collectStrengthInputs(kundali);
const signatures = detectAllSignatures(kundali);
const result = scoreAllergies(kundali, strength, signatures, 'en');

describe('scoreAllergies', () => {
  it('returns a NatalElement with score in [0,100], valid rating, and at least 4 factors', () => {
    expect(result.natalScore).toBeGreaterThanOrEqual(0);
    expect(result.natalScore).toBeLessThanOrEqual(100);
    expect(['uttama', 'madhyama', 'adhama', 'atyadhama']).toContain(result.rating);
    expect(Array.isArray(result.factors)).toBe(true);
    expect(result.factors.length).toBeGreaterThanOrEqual(4);
    for (const f of result.factors) {
      expect(f.label.en).toBeTruthy();
      expect(['positive', 'neutral', 'negative']).toContain(f.verdict);
      expect(typeof f.value).toBe('string');
    }
    expect(Array.isArray(result.classicalSignatures)).toBe(true);
    // allergies is inferential
    expect(result.badge).toBe('inferential');
  });
  it('returns correct metadata matching ELEMENT_CATALOG[allergies]', () => {
    const meta = ELEMENT_CATALOG['allergies'];
    expect(result.id).toBe('allergies');
    expect(result.name.en).toBe(meta.name.en);
    expect(result.category).toBe(meta.category);
    expect(result.badge).toBe('inferential');
    expect(result.requiresDisclaimer).toBe(meta.requiresDisclaimer);
  });
});

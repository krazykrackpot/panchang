// src/lib/kundali/health-diagnosis/__tests__/elements/mental.test.ts
//
// Task B2 — mental element scorer tests.
//
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { collectStrengthInputs } from '../../strength-inputs';
import { detectAllSignatures } from '../../signatures';
import { scoreMental } from '../../elements/mental';
import { ELEMENT_CATALOG } from '../../element-catalog';

// ─── Shared fixture ──────────────────────────────────────────────────────────
const BIRTH: BirthData = {
  name: 'Test Fixture',
  date: '1990-01-15',
  time: '06:30',
  place: 'Varanasi, India',
  lat: 25.32,
  lng: 82.97,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

const kundali = generateKundali(BIRTH);
const strength = collectStrengthInputs(kundali);
const signatures = detectAllSignatures(kundali);
const result = scoreMental(kundali, strength, signatures, 'en');

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('scoreMental', () => {
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

    for (const sig of result.classicalSignatures) {
      expect(typeof sig.id).toBe('string');
      expect(sig.name.en).toBeTruthy();
      expect(typeof sig.source).toBe('string');
    }
  });

  it('returns correct metadata matching ELEMENT_CATALOG[mental]', () => {
    const meta = ELEMENT_CATALOG['mental'];

    expect(result.id).toBe('mental');
    expect(result.name.en).toBe(meta.name.en);
    expect(result.category).toBe(meta.category);
    expect(result.badge).toBe(meta.badge);
    expect(result.requiresDisclaimer).toBe(meta.requiresDisclaimer);
  });
});

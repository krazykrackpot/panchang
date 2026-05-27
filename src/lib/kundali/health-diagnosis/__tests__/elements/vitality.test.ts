// src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts
//
// Task B1 — vitality element scorer tests.
//
// Two it() blocks:
//   1. Score range + non-empty factors
//   2. Metadata accuracy — output fields match ELEMENT_CATALOG['vitality']
//
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { collectStrengthInputs } from '../../strength-inputs';
import { detectAllSignatures } from '../../signatures';
import { scoreVitality } from '../../elements/vitality';
import { ELEMENT_CATALOG } from '../../element-catalog';

// ─── Shared fixture ──────────────────────────────────────────────────────────
// 1990-01-15 06:30 IST, Varanasi — same chart used in strength-inputs tests.
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
const result = scoreVitality(kundali, strength, signatures, 'en');

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('scoreVitality', () => {
  it('returns a NatalElement with score in [0,100], valid rating, and at least 4 factors', () => {
    // natalScore must be a vulnerability index in [0, 100]
    expect(result.natalScore).toBeGreaterThanOrEqual(0);
    expect(result.natalScore).toBeLessThanOrEqual(100);

    // rating must be one of the four Sanskrit tiers
    expect(['uttama', 'madhyama', 'adhama', 'atyadhama']).toContain(result.rating);

    // factors must be non-empty and have at least 4 entries for transparency
    expect(Array.isArray(result.factors)).toBe(true);
    expect(result.factors.length).toBeGreaterThanOrEqual(4);

    // every factor must have a LocaleText label, verdict, and value
    for (const f of result.factors) {
      expect(f.label.en).toBeTruthy();
      expect(['positive', 'neutral', 'negative']).toContain(f.verdict);
      expect(typeof f.value).toBe('string');
    }

    // classicalSignatures must be an array (may be empty for this chart)
    expect(Array.isArray(result.classicalSignatures)).toBe(true);

    // each classical signature entry must carry id, name, source
    for (const sig of result.classicalSignatures) {
      expect(typeof sig.id).toBe('string');
      expect(sig.name.en).toBeTruthy();
      expect(typeof sig.source).toBe('string');
    }
  });

  it('returns correct metadata matching ELEMENT_CATALOG[vitality]', () => {
    const meta = ELEMENT_CATALOG['vitality'];

    expect(result.id).toBe('vitality');
    expect(result.name.en).toBe(meta.name.en);
    expect(result.category).toBe(meta.category);
    expect(result.badge).toBe(meta.badge);
    expect(result.requiresDisclaimer).toBe(meta.requiresDisclaimer);
  });
});

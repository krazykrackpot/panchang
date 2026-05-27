// src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts
//
// Task B23 — elements index aggregator tests.
//
// Verifies:
//   1. SCORERS map covers exactly the 22 ElementIds in ELEMENT_IDS
//   2. Every scorer is a callable function
//   3. Calling every scorer with the shared test fixture produces a valid NatalElement

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { collectStrengthInputs } from '../../strength-inputs';
import { detectAllSignatures } from '../../signatures';
import { SCORERS } from '../../elements/index';
import { ELEMENT_IDS } from '../../element-catalog';

// ─── Shared fixture ───────────────────────────────────────────────────────────
// 1990-01-15 06:30 IST, Varanasi — same chart used across all Phase A-B tests.
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('SCORERS aggregator', () => {
  it('has exactly 22 entries — one per ElementId', () => {
    expect(Object.keys(SCORERS).length).toBe(22);
  });

  it('covers every ElementId in ELEMENT_IDS', () => {
    for (const id of ELEMENT_IDS) {
      expect(SCORERS[id], `SCORERS missing entry for "${id}"`).toBeDefined();
    }
  });

  it('has no extra keys beyond the 22 canonical ElementIds', () => {
    const canonical = new Set(ELEMENT_IDS);
    for (const key of Object.keys(SCORERS)) {
      expect(canonical.has(key as typeof ELEMENT_IDS[number]), `unexpected key "${key}" in SCORERS`).toBe(true);
    }
  });

  it('every scorer entry is a function', () => {
    for (const [id, scorer] of Object.entries(SCORERS)) {
      expect(typeof scorer, `SCORERS["${id}"] should be a function`).toBe('function');
    }
  });

  it('every scorer returns a valid NatalElement for the test fixture', () => {
    const VALID_RATINGS = new Set(['uttama', 'madhyama', 'adhama', 'atyadhama']);
    for (const [id, scorer] of Object.entries(SCORERS)) {
      const result = scorer(kundali, strength, signatures, 'en');

      // id must match the map key
      expect(result.id, `SCORERS["${id}"] returned wrong id`).toBe(id);

      // natalScore must be a vulnerability index in [0, 100]
      expect(result.natalScore, `SCORERS["${id}"] natalScore out of range`).toBeGreaterThanOrEqual(0);
      expect(result.natalScore, `SCORERS["${id}"] natalScore out of range`).toBeLessThanOrEqual(100);

      // rating must be one of the four Sanskrit tiers
      expect(
        VALID_RATINGS.has(result.rating),
        `SCORERS["${id}"] returned invalid rating "${result.rating}"`,
      ).toBe(true);

      // factors must be an array
      expect(Array.isArray(result.factors), `SCORERS["${id}"] factors should be array`).toBe(true);

      // classicalSignatures must be an array
      expect(Array.isArray(result.classicalSignatures), `SCORERS["${id}"] classicalSignatures should be array`).toBe(true);

      // requiresDisclaimer must be boolean
      expect(typeof result.requiresDisclaimer, `SCORERS["${id}"] requiresDisclaimer should be boolean`).toBe('boolean');
    }
  });
});

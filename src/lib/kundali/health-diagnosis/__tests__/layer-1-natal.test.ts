// src/lib/kundali/health-diagnosis/__tests__/layer-1-natal.test.ts
//
// Task C1 — Layer 1 natal composer tests.
//
// Verifies:
//   1. Default mode (extended: false) returns exactly 19 natalElements
//   2. Extended mode (extended: true) returns exactly 22 natalElements
//   3. hiddenElements is correct in both modes
//   4. Every natalElement has a valid score, rating, and id
//   5. No duplicate ids in the result

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { composeLayer1 } from '../layer-1-natal';
import { DEFAULT_VISIBLE_IDS, EXTENDED_IDS, ELEMENT_IDS } from '../element-catalog';

// ─── Shared fixture ───────────────────────────────────────────────────────────
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

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('composeLayer1 — default (19 elements)', () => {
  const result = composeLayer1(kundali, false, 'en');

  it('returns exactly 19 natalElements', () => {
    expect(result.natalElements.length).toBe(19);
  });

  it('hiddenElements contains the 3 opt-in IDs', () => {
    expect(result.hiddenElements.length).toBe(3);
    const hidden = new Set(result.hiddenElements);
    for (const id of EXTENDED_IDS) {
      expect(hidden.has(id), `"${id}" should be in hiddenElements`).toBe(true);
    }
  });

  it('natalElements ids match DEFAULT_VISIBLE_IDS in order', () => {
    for (let i = 0; i < DEFAULT_VISIBLE_IDS.length; i++) {
      expect(result.natalElements[i].id).toBe(DEFAULT_VISIBLE_IDS[i]);
    }
  });

  it('every natalElement has a valid score, rating, factors, and id', () => {
    const VALID_RATINGS = new Set(['uttama', 'madhyama', 'adhama', 'atyadhama']);
    for (const el of result.natalElements) {
      expect(el.natalScore).toBeGreaterThanOrEqual(0);
      expect(el.natalScore).toBeLessThanOrEqual(100);
      expect(VALID_RATINGS.has(el.rating)).toBe(true);
      expect(Array.isArray(el.factors)).toBe(true);
      expect(Array.isArray(el.classicalSignatures)).toBe(true);
      expect(typeof el.requiresDisclaimer).toBe('boolean');
    }
  });

  it('no duplicate ids in natalElements', () => {
    const ids = result.natalElements.map(el => el.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });
});

describe('composeLayer1 — extended (22 elements)', () => {
  const result = composeLayer1(kundali, true, 'en');

  it('returns exactly 22 natalElements', () => {
    expect(result.natalElements.length).toBe(22);
  });

  it('hiddenElements is empty when extended: true', () => {
    expect(result.hiddenElements.length).toBe(0);
  });

  it('natalElements ids match all ELEMENT_IDS in order', () => {
    for (let i = 0; i < ELEMENT_IDS.length; i++) {
      expect(result.natalElements[i].id).toBe(ELEMENT_IDS[i]);
    }
  });

  it('opt-in elements (allergies, cancer, longevity) are present', () => {
    const ids = new Set(result.natalElements.map(el => el.id));
    expect(ids.has('allergies')).toBe(true);
    expect(ids.has('cancer')).toBe(true);
    expect(ids.has('longevity')).toBe(true);
  });
});

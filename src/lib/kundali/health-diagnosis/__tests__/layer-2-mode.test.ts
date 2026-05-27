// src/lib/kundali/health-diagnosis/__tests__/layer-2-mode.test.ts
//
// Task C2 — Layer 2 mode composer tests.
//
// Verifies:
//   1. Returns a valid PrakritiResult with percentages summing to ~100
//   2. modeNote has non-empty en and hi strings
//   3. modeNote mentions primaryDosha by name (capitalised)
//   4. Layer 2 is purely informational — scores array is absent (no natalElements)

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { composeLayer2 } from '../layer-2-mode';

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
const result = composeLayer2(kundali);

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('composeLayer2', () => {
  it('returns a PrakritiResult with valid dosha percentages', () => {
    const { vata, pitta, kapha } = result.prakriti.percentages;

    // Each percentage must be in [0, 100]
    expect(vata).toBeGreaterThanOrEqual(0);
    expect(vata).toBeLessThanOrEqual(100);
    expect(pitta).toBeGreaterThanOrEqual(0);
    expect(pitta).toBeLessThanOrEqual(100);
    expect(kapha).toBeGreaterThanOrEqual(0);
    expect(kapha).toBeLessThanOrEqual(100);

    // Percentages should sum to approximately 100 (rounding may give 99-101)
    const total = vata + pitta + kapha;
    expect(total).toBeGreaterThanOrEqual(98);
    expect(total).toBeLessThanOrEqual(102);
  });

  it('primaryDosha is one of Vata, Pitta, Kapha', () => {
    const valid = new Set(['Vata', 'Pitta', 'Kapha']);
    expect(valid.has(result.prakriti.primaryDosha)).toBe(true);
  });

  it('prakritiType is a non-empty combined dosha string', () => {
    expect(typeof result.prakriti.prakritiType).toBe('string');
    expect(result.prakriti.prakritiType.length).toBeGreaterThan(0);
    // Should be "X-Y" format (two doshas separated by hyphen)
    expect(result.prakriti.prakritiType).toMatch(/^[A-Za-z]+-[A-Za-z]+$/);
  });

  it('modeNote has non-empty en and hi strings', () => {
    expect(typeof result.modeNote.en).toBe('string');
    expect(result.modeNote.en.length).toBeGreaterThan(0);
    expect(typeof result.modeNote.hi).toBe('string');
    expect(result.modeNote.hi.length).toBeGreaterThan(0);
  });

  it('modeNote.en mentions the primaryDosha by name', () => {
    const primaryDosha = result.prakriti.primaryDosha;
    // The mode note must reference the dosha (capitalised) to be meaningful
    expect(result.modeNote.en).toContain(primaryDosha);
  });

  it('Layer 2 result has no natalElements — it is purely informational', () => {
    // Type check: the result shape must NOT include natalElements
    expect((result as Record<string, unknown>)['natalElements']).toBeUndefined();
  });
});

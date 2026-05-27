// src/lib/kundali/health-diagnosis/__tests__/index.test.ts
//
// Task C4 — Main engine integration tests.
//
// Verifies computeHealthDiagnosis() composes all layers correctly and returns
// the full HealthDiagnosis contract (spec §8):
//
//   1. Default mode returns 19 natalElements, 3 hiddenElements
//   2. Extended mode returns 22 natalElements, 0 hiddenElements
//   3. displayedElements mirrors natalElements count (clamped to [0,100])
//   4. currentMultipliers is keyed by every natalElement id
//   5. overall.rating is a valid Rating; summary is a LocaleText with en/hi
//   6. prakriti has vata/pitta/kapha ∈ [0,100] summing to ~100
//   7. disclaimers: 'psychiatric' requiresDisclaimer → disclaimer present
//   8. optedInToExtended reflects the options.extended flag
//   9. bodMap / diseaseProfile / timeline are arrays (may be empty on stubbed env)
//   10. Corrupt kundali (empty object) falls back gracefully without throwing

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { computeHealthDiagnosis } from '../index';

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
const TODAY   = new Date('2026-06-01T00:00:00Z');
const AGE     = 36;

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('computeHealthDiagnosis — default mode (extended: false)', () => {
  const result = computeHealthDiagnosis(kundali, { today: TODAY, age: AGE });

  it('returns exactly 19 natalElements', () => {
    expect(result.natalElements.length).toBe(19);
  });

  it('returns exactly 3 hiddenElements', () => {
    expect(result.hiddenElements.length).toBe(3);
    const hidden = new Set(result.hiddenElements);
    expect(hidden.has('allergies')).toBe(true);
    expect(hidden.has('cancer')).toBe(true);
    expect(hidden.has('longevity')).toBe(true);
  });

  it('optedInToExtended is false', () => {
    expect(result.optedInToExtended).toBe(false);
  });

  it('displayedElements count matches natalElements count', () => {
    expect(result.displayedElements.length).toBe(result.natalElements.length);
  });

  it('all displayedScores are clamped to [0, 100]', () => {
    for (const d of result.displayedElements) {
      expect(d.displayedScore).toBeGreaterThanOrEqual(0);
      expect(d.displayedScore).toBeLessThanOrEqual(100);
      expect(Number.isInteger(d.displayedScore)).toBe(true);
    }
  });

  it('displayedElements have no unclampedScore field (public contract)', () => {
    for (const d of result.displayedElements) {
      // unclampedScore must NOT appear on the public displayed element
      expect((d as Record<string, unknown>)['unclampedScore']).toBeUndefined();
    }
  });

  it('displayedElements trend is valid', () => {
    const valid = new Set(['improving', 'stable', 'worsening']);
    for (const d of result.displayedElements) {
      expect(valid.has(d.trend)).toBe(true);
    }
  });

  it('currentMultipliers covers every natalElement id', () => {
    for (const el of result.natalElements) {
      expect(result.currentMultipliers[el.id]).toBeDefined();
      const m = result.currentMultipliers[el.id];
      expect(m.dashaContribution).toBeGreaterThanOrEqual(0);
      expect(m.dashaContribution).toBeLessThanOrEqual(0.5);
      expect(m.transitContribution).toBeGreaterThanOrEqual(0);
      expect(m.transitContribution).toBeLessThanOrEqual(0.5);
      expect(m.lifeStageGate).toBeGreaterThanOrEqual(0.5);
      expect(m.lifeStageGate).toBeLessThanOrEqual(1.5);
    }
  });

  it('overall.rating is a valid Rating', () => {
    const valid = new Set(['uttama', 'madhyama', 'adhama', 'atyadhama']);
    expect(valid.has(result.overall.rating)).toBe(true);
  });

  it('overall.summary has non-empty en and hi strings', () => {
    expect(typeof result.overall.summary.en).toBe('string');
    expect(result.overall.summary.en.length).toBeGreaterThan(0);
    expect(typeof result.overall.summary.hi).toBe('string');
    expect(result.overall.summary.hi.length).toBeGreaterThan(0);
  });

  it('prakriti percentages are in [0, 100] and sum to ~100', () => {
    const { vata, pitta, kapha } = result.prakriti;
    expect(vata).toBeGreaterThanOrEqual(0);
    expect(pitta).toBeGreaterThanOrEqual(0);
    expect(kapha).toBeGreaterThanOrEqual(0);
    expect(vata + pitta + kapha).toBeGreaterThanOrEqual(98);
    expect(vata + pitta + kapha).toBeLessThanOrEqual(102);
  });

  it('modeNote has an en string', () => {
    expect(typeof result.modeNote.en).toBe('string');
  });

  it('bodyMap, diseaseProfile, timeline are arrays', () => {
    expect(Array.isArray(result.bodyMap)).toBe(true);
    expect(Array.isArray(result.timeline)).toBe(true);
    expect(Array.isArray(result.diseaseProfile.topVulnerabilities)).toBe(true);
    expect(Array.isArray(result.diseaseProfile.signaturePatterns)).toBe(true);
  });

  it('disclaimers array is present and scoped to psychiatric (which is default-visible)', () => {
    // psychiatric is default-visible with requiresDisclaimer: true.
    // Therefore at minimum one disclaimer entry should exist referencing it.
    expect(Array.isArray(result.disclaimers)).toBe(true);
    const allScopes = result.disclaimers.flatMap(d => d.scope);
    expect(allScopes).toContain('psychiatric');
  });

  it('disclaimer text has en string', () => {
    for (const d of result.disclaimers) {
      expect(typeof d.text.en).toBe('string');
      expect(d.text.en.length).toBeGreaterThan(0);
    }
  });
});

// ─── Extended mode ────────────────────────────────────────────────────────────

describe('computeHealthDiagnosis — extended mode (extended: true)', () => {
  const result = computeHealthDiagnosis(kundali, { extended: true, today: TODAY, age: AGE });

  it('returns exactly 22 natalElements', () => {
    expect(result.natalElements.length).toBe(22);
  });

  it('returns exactly 0 hiddenElements', () => {
    expect(result.hiddenElements.length).toBe(0);
  });

  it('optedInToExtended is true', () => {
    expect(result.optedInToExtended).toBe(true);
  });

  it('allergies, cancer, longevity are all present in natalElements', () => {
    const ids = new Set(result.natalElements.map(el => el.id));
    expect(ids.has('allergies')).toBe(true);
    expect(ids.has('cancer')).toBe(true);
    expect(ids.has('longevity')).toBe(true);
  });

  it('cancer and longevity have requiresDisclaimer: true', () => {
    const cancer   = result.natalElements.find(el => el.id === 'cancer');
    const longevity = result.natalElements.find(el => el.id === 'longevity');
    expect(cancer?.requiresDisclaimer).toBe(true);
    expect(longevity?.requiresDisclaimer).toBe(true);
  });

  it('disclaimers scope includes cancer and longevity in extended mode', () => {
    const allScopes = result.disclaimers.flatMap(d => d.scope);
    expect(allScopes).toContain('cancer');
    expect(allScopes).toContain('longevity');
  });

  it('no duplicate ids across 22 natalElements', () => {
    const ids = result.natalElements.map(el => el.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ─── Graceful fallback on corrupt kundali ────────────────────────────────────

describe('computeHealthDiagnosis — graceful fallback on corrupt input', () => {
  it('does not throw and returns a safe HealthDiagnosis shape', () => {
    // Cast an empty object so TypeScript lets us test the runtime guard
    const badInput = {} as Parameters<typeof computeHealthDiagnosis>[0];

    let result: ReturnType<typeof computeHealthDiagnosis> | undefined;
    expect(() => {
      result = computeHealthDiagnosis(badInput);
    }).not.toThrow();

    expect(result).toBeDefined();
    expect(Array.isArray(result!.natalElements)).toBe(true);
    expect(Array.isArray(result!.displayedElements)).toBe(true);
    expect(Array.isArray(result!.disclaimers)).toBe(true);
    expect(typeof result!.overall.rating).toBe('string');
  });
});

// ─── Gender hint propagation ──────────────────────────────────────────────────

describe('computeHealthDiagnosis — gender option', () => {
  it('does not throw for male gender option', () => {
    expect(() =>
      computeHealthDiagnosis(kundali, { today: TODAY, age: AGE, gender: 'male' }),
    ).not.toThrow();
  });

  it('does not throw for female gender option', () => {
    expect(() =>
      computeHealthDiagnosis(kundali, { today: TODAY, age: AGE, gender: 'female' }),
    ).not.toThrow();
  });

  it('returns same element count regardless of gender', () => {
    const male   = computeHealthDiagnosis(kundali, { today: TODAY, age: AGE, gender: 'male' });
    const female = computeHealthDiagnosis(kundali, { today: TODAY, age: AGE, gender: 'female' });
    expect(male.natalElements.length).toBe(female.natalElements.length);
  });
});

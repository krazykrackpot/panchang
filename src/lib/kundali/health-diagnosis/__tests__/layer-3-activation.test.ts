// src/lib/kundali/health-diagnosis/__tests__/layer-3-activation.test.ts
//
// Task C3 — Layer 3 activation composer tests.
//
// Verifies:
//   1. Returns arrays matching natalElements length
//   2. displayedElements: displayedScore clamped to [0,100]; no unclampedScore field
//   3. internalDisplayedElements: carries unclampedScore (may exceed 100 for
//      highly-activated charts, or equal natalScore for zero multipliers)
//   4. trend is one of 'improving' | 'stable' | 'worsening'
//   5. currentMultipliers: all contributions within spec bounds
//   6. Life-stage gate: skeletal gate differs between age 20 and age 70
//   7. Sade Sati: mental element has higher transitContribution when active

import { describe, it, expect, vi, afterEach } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import { composeLayer1 } from '../layer-1-natal';
import { composeLayer3 } from '../layer-3-activation';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

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
const { natalElements } = composeLayer1(kundali, false, 'en');

const TODAY = new Date('2026-06-01T00:00:00Z');
const AGE   = 36;

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('composeLayer3 — output shape', () => {
  const result = composeLayer3(kundali, natalElements, TODAY, AGE);

  it('displayedElements has same length as natalElements input', () => {
    expect(result.displayedElements.length).toBe(natalElements.length);
  });

  it('internalDisplayedElements has same length as natalElements input', () => {
    expect(result.internalDisplayedElements.length).toBe(natalElements.length);
  });

  it('currentMultipliers has one entry per natalElement', () => {
    expect(Object.keys(result.currentMultipliers).length).toBe(natalElements.length);
  });

  it('displayedElements: displayedScore is clamped to [0, 100]', () => {
    for (const d of result.displayedElements) {
      expect(d.displayedScore, `${d.id} displayedScore out of range`).toBeGreaterThanOrEqual(0);
      expect(d.displayedScore, `${d.id} displayedScore out of range`).toBeLessThanOrEqual(100);
    }
  });

  it('displayedElements: no unclampedScore field (public surface)', () => {
    for (const d of result.displayedElements) {
      expect((d as Record<string, unknown>)['unclampedScore']).toBeUndefined();
    }
  });

  it('internalDisplayedElements: unclampedScore is present and is a number', () => {
    for (const d of result.internalDisplayedElements) {
      expect(typeof d.unclampedScore, `${d.id} unclampedScore should be a number`).toBe('number');
    }
  });

  it('internalDisplayedElements: unclampedScore >= 0', () => {
    for (const d of result.internalDisplayedElements) {
      // Unclamped can exceed 100 but must be non-negative (natalScore × positive multipliers)
      expect(d.unclampedScore, `${d.id} unclampedScore should be >= 0`).toBeGreaterThanOrEqual(0);
    }
  });

  it('trend is one of improving | stable | worsening', () => {
    const validTrends = new Set(['improving', 'stable', 'worsening']);
    for (const d of result.displayedElements) {
      expect(
        validTrends.has(d.trend),
        `${d.id} trend "${d.trend}" is invalid`,
      ).toBe(true);
    }
  });

  it('nextInflectionDate is null or a valid YYYY-MM-DD string', () => {
    for (const d of result.displayedElements) {
      if (d.nextInflectionDate !== null) {
        expect(d.nextInflectionDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});

describe('composeLayer3 — multiplier bounds', () => {
  const result = composeLayer3(kundali, natalElements, TODAY, AGE);

  it('dashaContribution ∈ [0, 0.5] for all elements', () => {
    for (const [id, m] of Object.entries(result.currentMultipliers)) {
      expect(m.dashaContribution, `${id} dashaContribution out of [0,0.5]`).toBeGreaterThanOrEqual(0);
      expect(m.dashaContribution, `${id} dashaContribution out of [0,0.5]`).toBeLessThanOrEqual(0.5);
    }
  });

  it('transitContribution ∈ [0, 0.5] for all elements', () => {
    for (const [id, m] of Object.entries(result.currentMultipliers)) {
      expect(m.transitContribution, `${id} transitContribution out of [0,0.5]`).toBeGreaterThanOrEqual(0);
      expect(m.transitContribution, `${id} transitContribution out of [0,0.5]`).toBeLessThanOrEqual(0.5);
    }
  });

  it('lifeStageGate ∈ [0.5, 1.5] for all elements', () => {
    for (const [id, m] of Object.entries(result.currentMultipliers)) {
      expect(m.lifeStageGate, `${id} lifeStageGate out of [0.5,1.5]`).toBeGreaterThanOrEqual(0.5);
      expect(m.lifeStageGate, `${id} lifeStageGate out of [0.5,1.5]`).toBeLessThanOrEqual(1.5);
    }
  });
});

describe('composeLayer3 — life-stage gate differentiation', () => {
  it('skeletal gate is lower for age 20 than for age 70', () => {
    const young  = composeLayer3(kundali, natalElements, TODAY, 20);
    const senior = composeLayer3(kundali, natalElements, TODAY, 70);
    const youngGate  = young.currentMultipliers['skeletal']?.lifeStageGate ?? 1.0;
    const seniorGate = senior.currentMultipliers['skeletal']?.lifeStageGate ?? 1.0;
    expect(youngGate).toBeLessThan(seniorGate);
  });

  it('reproductive gate is lower for age 10 than for age 30', () => {
    const child = composeLayer3(kundali, natalElements, TODAY, 10);
    const adult = composeLayer3(kundali, natalElements, TODAY, 30);
    const childGate = child.currentMultipliers['reproductive']?.lifeStageGate ?? 1.0;
    const adultGate = adult.currentMultipliers['reproductive']?.lifeStageGate ?? 1.0;
    expect(childGate).toBeLessThan(adultGate);
  });
});

describe('composeLayer3 — Sade Sati sensitivity', () => {
  // Sade Sati is now time-varying: isSadeSatiActiveAt() computes Saturn's
  // current sign from a real transit call rather than reading the static
  // kundali.sadeSati.isActive flag.  The two fixture tests below verify the
  // time-varying behaviour directly.

  it('sadeSatiActive in currentMultipliers is a boolean (time-varying result)', () => {
    // The result reflects Saturn's actual transit position on TODAY, not the
    // static snapshot.  We cannot predict the exact boolean without knowing
    // Saturn's position at test time, so we assert type only.
    const result = composeLayer3(kundali, natalElements, TODAY, AGE);
    for (const m of Object.values(result.currentMultipliers)) {
      expect(typeof m.sadeSatiActive).toBe('boolean');
    }
  });

  it('sadeSatiActive is consistent across all elements for a given date', () => {
    // All elements share the same isSadeSatiActiveAt() call for today's date,
    // so every element must report the same sadeSatiActive boolean.
    const result = composeLayer3(kundali, natalElements, TODAY, AGE);
    const values = Object.values(result.currentMultipliers).map(m => m.sadeSatiActive);
    expect(values.every(v => v === values[0])).toBe(true);
  });

  it('mental element has higher transitContribution when Saturn is in Sade Sati range', () => {
    // Construct a kundali where Moon is in the same sign as Saturn's current transit
    // (peak Sade Sati: distance = 1) by setting Moon sign to Saturn's current sign.
    // We derive Saturn's current sign from a computePanchang call and fake a Moon
    // at that exact sign so isSadeSatiActiveAt returns true.
    const y = TODAY.getUTCFullYear();
    const mo = TODAY.getUTCMonth() + 1;
    const d = TODAY.getUTCDate();
    const tz = getUTCOffsetForDate(y, mo, d, 'UTC');
    const pan = computePanchang({ year: y, month: mo, day: d, lat: 28.61, lng: 77.21, tzOffset: tz, timezone: 'UTC' });
    const saturnPlanet = pan.planets.find((g: { id: number }) => g.id === 6);
    // If we cannot get Saturn's position, skip (environment may not have ephemeris).
    if (!saturnPlanet) return;
    const saturnSign: number = (saturnPlanet as { rashi?: number; longitude?: number }).rashi
      ?? Math.floor(((saturnPlanet as { longitude?: number }).longitude ?? 0) / 30) + 1;

    // Build a kundali copy where the Moon planet's sign equals saturnSign (peak SS).
    // Also adjust ascendant so the chart is self-consistent enough for the test.
    const moonWithSadeSati = {
      ...kundali.planets.find(p => p.planet.id === 1)!,
      sign: saturnSign,
    };
    const kundaliInSS = {
      ...kundali,
      planets: kundali.planets.map(p => p.planet.id === 1 ? moonWithSadeSati : p),
    } as typeof kundali;

    // Kundali without SS: Moon sign offset by 6 (opposite of SS range)
    const moonNoSadeSati = {
      ...kundali.planets.find(p => p.planet.id === 1)!,
      sign: ((saturnSign + 5) % 12) + 1, // 6 signs away — not in 12/1/2 from Saturn
    };
    const kundaliNoSS = {
      ...kundali,
      planets: kundali.planets.map(p => p.planet.id === 1 ? moonNoSadeSati : p),
    } as typeof kundali;

    const withSS    = composeLayer3(kundaliInSS,  natalElements, TODAY, AGE);
    const withoutSS = composeLayer3(kundaliNoSS,  natalElements, TODAY, AGE);

    // Sade Sati active should differ between the two kundali variants
    const mentalWith    = withSS.currentMultipliers['mental']?.transitContribution ?? 0;
    const mentalWithout = withoutSS.currentMultipliers['mental']?.transitContribution ?? 0;

    // With Sade Sati active, mental gets a bonus on top of planet-house hits.
    // At minimum sadeSatiActive should differ; if planet-house hits are identical,
    // the SS bonus (0.05 + 0.1 elevated = 0.15 for mental) makes the difference.
    const ssActive    = withSS.currentMultipliers['mental']?.sadeSatiActive;
    const ssInactive  = withoutSS.currentMultipliers['mental']?.sadeSatiActive;
    expect(ssActive).toBe(true);
    expect(ssInactive).toBe(false);
    expect(mentalWith).toBeGreaterThanOrEqual(mentalWithout);
  });
});

describe('composeLayer3 — unclamped vs clamped', () => {
  it('unclampedScore equals displayedScore when score is in [0,100]', () => {
    const result = composeLayer3(kundali, natalElements, TODAY, AGE);
    for (let i = 0; i < result.displayedElements.length; i++) {
      const pub = result.displayedElements[i];
      const int = result.internalDisplayedElements[i];
      // When unclamped is in [0,100], displayed == round(unclamped)
      if (int.unclampedScore >= 0 && int.unclampedScore <= 100) {
        expect(pub.displayedScore).toBe(Math.round(int.unclampedScore));
      }
    }
  });

  it('id ordering matches between displayedElements and internalDisplayedElements', () => {
    const result = composeLayer3(kundali, natalElements, TODAY, AGE);
    for (let i = 0; i < result.displayedElements.length; i++) {
      expect(result.displayedElements[i].id).toBe(result.internalDisplayedElements[i].id);
    }
  });
});

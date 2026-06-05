/**
 * Cross-source verification V3 — Equal / Whole-Sign / Sripati house systems
 * vs classical (BPHS Ch.7-8, Phaladeepika Ch.5).
 *
 * Placidus K.P. is already cross-source-verified at
 * src/lib/kp/__tests__/placidus.test.ts (AstroSage K.P. New for Delhi
 * 1990-01-15 10:30 IST + structural invariants + latitude sensitivity).
 *
 * This V3 fills the gap for the three GEOMETRIC house systems exposed
 * by `src/lib/kundali/house-systems.ts`. Each uses a closed-form rule
 * derived from the Ascendant degree — no ephemeris involved, so the
 * cross-source IS the classical formula itself. Asserting the engine
 * matches the formula to within floating-point precision locks the
 * behaviour against any future refactor.
 *
 * Classical references:
 *
 *   - Equal: house cusp N = asc + (N-1)·30° (mod 360). House size 30°.
 *     Source: BPHS Ch.7 v.1 — "Equal" / "Mean" house division.
 *
 *   - Whole-Sign: house 1 = entire sign containing the Ascendant
 *     (cusp at 0° of that sign). House N = next sign sequentially.
 *     Source: BPHS Ch.7 v.5 + Phaladeepika Ch.5 v.4. Used in
 *     Tajika/Varshaphal and classical Parashari analysis.
 *
 *   - Sripati / Porphyry-Vedic: Bhava Madhyas at the Equal cusps,
 *     Bhava Sandhis (boundaries) at midpoints between Madhyas. Each
 *     house starts at asc-15° + (N-1)·30°. Used widely in Maharashtra
 *     and southern Indian tradition.
 *     Source: Brihat Parashara Ch.7-8 + Sripati Paddhati.
 *
 * Audit angle 2, V3 (2026-06-05).
 */

import { describe, it, expect } from 'vitest';
import {
  calculateSripatiCusps,
  calculateWholeSignCusps,
  calculateCusps,
  getHouseForCusps,
} from '@/lib/kundali/house-systems';

const REF_ASCS = [0, 15, 30, 89.99, 90, 150, 180, 270, 359, 359.999] as const;

// Float-equality helper: 12 cusps × 360° span, ms-grade precision.
const NEAR = (a: number, b: number, tol = 1e-9) => Math.abs(a - b) < tol;

// ───────────────────────────────────────────────────────────────────────────
// Equal house — BPHS Ch.7 v.1 (`cusp_N = asc + (N-1)·30°` mod 360)
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V3.1 — Equal house cusps follow BPHS Ch.7 v.1', () => {
  for (const asc of REF_ASCS) {
    it(`asc=${asc.toFixed(3)}°: cusp_N = asc + (N-1)·30° (mod 360)`, () => {
      const cusps = calculateCusps(asc, 'equal');
      expect(cusps.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        const expected = ((asc + i * 30) % 360 + 360) % 360;
        expect(NEAR(cusps[i], expected), `cusp ${i + 1}`).toBe(true);
      }
    });
  }

  it('all 12 cusps are distinct', () => {
    const cusps = calculateCusps(123.456, 'equal');
    expect(new Set(cusps.map(c => c.toFixed(6))).size).toBe(12);
  });

  it('each house spans exactly 30°', () => {
    const cusps = calculateCusps(42.7, 'equal');
    for (let i = 0; i < 12; i++) {
      let span = cusps[(i + 1) % 12] - cusps[i];
      if (span < 0) span += 360;
      expect(NEAR(span, 30)).toBe(true);
    }
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Whole Sign — BPHS Ch.7 v.5 (`cusp_1 = floor(asc / 30) * 30`)
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V3.2 — Whole-Sign cusps follow BPHS Ch.7 v.5', () => {
  for (const asc of REF_ASCS) {
    it(`asc=${asc.toFixed(3)}°: cusp_1 = floor(asc/30)·30°, each next sign +30°`, () => {
      const cusps = calculateWholeSignCusps(asc);
      const ascSign = Math.floor(asc / 30);
      expect(cusps.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        const expected = ((ascSign + i) % 12) * 30;
        expect(NEAR(cusps[i], expected), `cusp ${i + 1}`).toBe(true);
      }
    });
  }

  it('house 1 always starts at 0° of the Ascendant sign', () => {
    expect(calculateWholeSignCusps(0)[0]).toBe(0);
    expect(calculateWholeSignCusps(15)[0]).toBe(0);
    expect(calculateWholeSignCusps(29.999)[0]).toBe(0);
    expect(calculateWholeSignCusps(30)[0]).toBe(30);
    expect(calculateWholeSignCusps(180)[0]).toBe(180);
  });

  it('planet placement: planet in same sign as Asc → house 1', () => {
    // Asc 25° Aries, planet at 5° Aries → both in sign 0 → house 1.
    const cusps = calculateWholeSignCusps(25);
    expect(getHouseForCusps(5, cusps)).toBe(1);
    expect(getHouseForCusps(25, cusps)).toBe(1);
    expect(getHouseForCusps(29.99, cusps)).toBe(1);
  });

  it('planet placement: planet in next sign → house 2', () => {
    const cusps = calculateWholeSignCusps(25);
    expect(getHouseForCusps(30, cusps)).toBe(2);
    expect(getHouseForCusps(45, cusps)).toBe(2);
    expect(getHouseForCusps(59.99, cusps)).toBe(2);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// Sripati / Porphyry-Vedic — Brihat Parashara Ch.7-8 (cusps at asc - 15° + N·30°)
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V3.3 — Sripati cusps follow Bhava-Sandhi rule', () => {
  for (const asc of REF_ASCS) {
    it(`asc=${asc.toFixed(3)}°: cusp_N = (asc - 15) + (N-1)·30° (mod 360)`, () => {
      const cusps = calculateSripatiCusps(asc);
      expect(cusps.length).toBe(12);
      for (let i = 0; i < 12; i++) {
        const expected = ((asc - 15 + i * 30) % 360 + 360) % 360;
        // Sripati's midpoint computation has one nasty 180° wrap case
        // — tolerance 1e-6 covers float noise after the wrap.
        expect(Math.abs(cusps[i] - expected), `cusp ${i + 1} expected ${expected}, got ${cusps[i]}`).toBeLessThan(1e-6);
      }
    });
  }

  it('houses span 30° (Bhava Madhya is the Equal cusp; cusps shift -15°)', () => {
    const cusps = calculateSripatiCusps(42.7);
    for (let i = 0; i < 12; i++) {
      let span = cusps[(i + 1) % 12] - cusps[i];
      if (span < 0) span += 360;
      expect(Math.abs(span - 30)).toBeLessThan(1e-6);
    }
  });

  it('Sripati cusp 1 = Equal cusp 1 - 15° (Madhya vs Sandhi shift)', () => {
    const equalCusps = calculateCusps(42.7, 'equal');
    const sripatiCusps = calculateSripatiCusps(42.7);
    const expected = ((equalCusps[0] - 15) % 360 + 360) % 360;
    expect(Math.abs(sripatiCusps[0] - expected)).toBeLessThan(1e-6);
  });
});

// ───────────────────────────────────────────────────────────────────────────
// calculateCusps dispatcher — same inputs produce the same outputs
// as each direct system-specific function
// ───────────────────────────────────────────────────────────────────────────
describe('Verify V3.4 — calculateCusps dispatcher matches per-system functions', () => {
  for (const asc of [0, 30, 142.5, 270] as const) {
    it(`asc=${asc}°: equal dispatch === inline equal`, () => {
      const dispatched = calculateCusps(asc, 'equal');
      for (let i = 0; i < 12; i++) {
        const expected = ((asc + i * 30) % 360 + 360) % 360;
        expect(NEAR(dispatched[i], expected)).toBe(true);
      }
    });

    it(`asc=${asc}°: whole_sign dispatch === calculateWholeSignCusps`, () => {
      const dispatched = calculateCusps(asc, 'whole_sign');
      const direct = calculateWholeSignCusps(asc);
      for (let i = 0; i < 12; i++) {
        expect(NEAR(dispatched[i], direct[i])).toBe(true);
      }
    });

    it(`asc=${asc}°: sripati dispatch === calculateSripatiCusps`, () => {
      const dispatched = calculateCusps(asc, 'sripati');
      const direct = calculateSripatiCusps(asc);
      for (let i = 0; i < 12; i++) {
        expect(Math.abs(dispatched[i] - direct[i])).toBeLessThan(1e-9);
      }
    });
  }
});

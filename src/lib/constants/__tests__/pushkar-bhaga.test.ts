/**
 * Regression fixtures for the canonical Pushkar Bhaga + Pushkar Navamsha
 * tables. Locks the values set by PR #244 (which replaced a divergent
 * 1247-line natal yoga-engine copy of the navamsha table — Lesson Z
 * violation — with imports from this canonical module).
 *
 * Source: Saravali Ch.5 + Jataka Parijata (the standard Indian Jyotish
 * convention; BV Raman's "Hindu Predictive Astrology" and KS Charak both
 * cite the same 24-position set used here).
 *
 * Naming: signIdx is 0-based (0=Aries..11=Pisces), navamshaIdx is
 * 0-based (0=1st navamsha of the sign..8=9th navamsha). The encoded key
 * in PUSHKAR_NAVAMSHA_SET is `signIdx * 9 + navamshaIdx`. The (sign,
 * navamsha) labels below are 1-based for readability.
 *
 * The 24 positions, in canonical (sign, navamsha) form, classified by
 * sign type:
 *   - Movable signs (Aries, Cancer, Libra, Capricorn): 1st + 5th navamsha
 *     of each [Aries / Capricorn], or 1st + 7th [Cancer / Libra]
 *   - Fixed signs (Taurus, Leo, Scorpio, Aquarius):    5th + 9th or
 *     3rd + 5th or 1st + 7th depending on sign
 *   - Dual signs (Gemini, Virgo, Sagittarius, Pisces): 3rd + 7th or
 *     3rd + 5th or 5th + 9th
 *
 * The test below decodes the canonical SET back into (sign, navamsha)
 * tuples and asserts the full membership.
 */

import { describe, expect, it } from 'vitest';
import { PUSHKAR_BHAGA, PUSHKAR_NAVAMSHA_SET } from '../pushkar-bhaga';

// Canonical 24 (sign 1-based, navamsha 1-based) tuples. Any future change
// to PUSHKAR_NAVAMSHA_SET MUST update this fixture explicitly — the test
// uses set-equality, so adding/removing/shifting a position will fail
// loudly. This is the regression lock for PR #244.
const CANONICAL_PUSHKAR_NAVAMSHAS: ReadonlyArray<[sign: number, navamsha: number]> = [
  // Aries (movable)
  [1, 1], [1, 5],
  // Taurus (fixed)
  [2, 5], [2, 9],
  // Gemini (dual)
  [3, 3], [3, 7],
  // Cancer (movable)
  [4, 1], [4, 7],
  // Leo (fixed)
  [5, 1], [5, 5],
  // Virgo (dual)
  [6, 3], [6, 7],
  // Libra (movable)
  [7, 1], [7, 7],
  // Scorpio (fixed)
  [8, 3], [8, 5],
  // Sagittarius (dual)
  [9, 5], [9, 9],
  // Capricorn (movable)
  [10, 3], [10, 7],
  // Aquarius (fixed)
  [11, 1], [11, 7],
  // Pisces (dual)
  [12, 3], [12, 5],
];

// Per Saravali / Kalaprakashika — the single most auspicious degree per
// sign for Pushkar Bhaga. Orb is ±0.8°.
const CANONICAL_PUSHKAR_BHAGA: Record<number, number> = {
  1: 21,   // Aries
  2: 14,   // Taurus
  3: 18,   // Gemini
  4: 8,    // Cancer
  5: 19,   // Leo
  6: 9,    // Virgo
  7: 24,   // Libra
  8: 11,   // Scorpio
  9: 23,   // Sagittarius
  10: 14,  // Capricorn
  11: 19,  // Aquarius
  12: 9,   // Pisces
};

describe('Pushkar Navamsha — canonical SET (locks PR #244 fix)', () => {
  it('exposes exactly 24 positions', () => {
    expect(PUSHKAR_NAVAMSHA_SET.size).toBe(24);
  });

  it('every canonical (sign, navamsha) pair is present', () => {
    for (const [sign, navamsha] of CANONICAL_PUSHKAR_NAVAMSHAS) {
      const key = (sign - 1) * 9 + (navamsha - 1);
      expect(PUSHKAR_NAVAMSHA_SET.has(key)).toBe(true);
    }
  });

  it('no positions exist outside the canonical 24', () => {
    const canonicalKeys = new Set(
      CANONICAL_PUSHKAR_NAVAMSHAS.map(([s, n]) => (s - 1) * 9 + (n - 1)),
    );
    for (const key of PUSHKAR_NAVAMSHA_SET) {
      expect(canonicalKeys.has(key)).toBe(true);
    }
  });

  it('every sign (1-12) has exactly 2 Pushkar Navamshas', () => {
    const perSign: Record<number, number> = {};
    for (const key of PUSHKAR_NAVAMSHA_SET) {
      const sign = Math.floor(key / 9) + 1;
      perSign[sign] = (perSign[sign] || 0) + 1;
    }
    for (let s = 1; s <= 12; s++) {
      expect(perSign[s], `sign ${s} should have 2 Pushkar Navamshas`).toBe(2);
    }
  });

  it('all keys decode to valid (sign, navamsha) within bounds', () => {
    for (const key of PUSHKAR_NAVAMSHA_SET) {
      const sign = Math.floor(key / 9) + 1;
      const navamsha = (key % 9) + 1;
      expect(sign).toBeGreaterThanOrEqual(1);
      expect(sign).toBeLessThanOrEqual(12);
      expect(navamsha).toBeGreaterThanOrEqual(1);
      expect(navamsha).toBeLessThanOrEqual(9);
    }
  });

  it('Aries — 1st + 5th navamsha (movable sign convention)', () => {
    expect(PUSHKAR_NAVAMSHA_SET.has(0)).toBe(true);   // Aries 1st (0-3.333°)
    expect(PUSHKAR_NAVAMSHA_SET.has(4)).toBe(true);   // Aries 5th (13.333-16.667°)
    expect(PUSHKAR_NAVAMSHA_SET.has(6)).toBe(false);  // Aries 7th — NOT Pushkar
  });

  it('Libra — 1st + 7th navamsha (kendra movable convention)', () => {
    const libra0 = 6 * 9 + 0;  // signIdx 6 (Libra), navamsha 1
    const libra6 = 6 * 9 + 6;  // signIdx 6 (Libra), navamsha 7
    expect(PUSHKAR_NAVAMSHA_SET.has(libra0)).toBe(true);
    expect(PUSHKAR_NAVAMSHA_SET.has(libra6)).toBe(true);
  });

  it('Sagittarius — 5th + 9th navamsha (dual fire-sign convention)', () => {
    const sag4 = 8 * 9 + 4;
    const sag8 = 8 * 9 + 8;
    expect(PUSHKAR_NAVAMSHA_SET.has(sag4)).toBe(true);
    expect(PUSHKAR_NAVAMSHA_SET.has(sag8)).toBe(true);
  });
});

describe('Pushkar Bhaga — canonical degree per sign', () => {
  it('has entries for all 12 signs', () => {
    for (let s = 1; s <= 12; s++) {
      expect(PUSHKAR_BHAGA[s]).toBeDefined();
    }
  });

  it('matches Saravali / Kalaprakashika values', () => {
    for (const [sign, deg] of Object.entries(CANONICAL_PUSHKAR_BHAGA)) {
      expect(PUSHKAR_BHAGA[Number(sign)]).toBe(deg);
    }
  });

  it('all degrees are within 0-29 (within sign bounds)', () => {
    for (let s = 1; s <= 12; s++) {
      expect(PUSHKAR_BHAGA[s]).toBeGreaterThanOrEqual(0);
      expect(PUSHKAR_BHAGA[s]).toBeLessThan(30);
    }
  });
});

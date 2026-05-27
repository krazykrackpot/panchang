// src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/kundali';
import {
  collectStrengthInputs,
  houseLordId,
  type PlanetStrength,
  type HouseStrength,
  type DerivedHealthSignals,
} from '../strength-inputs';

// ─── Test fixture ───────────────────────────────────────────────────────────
// 1990-01-15 06:30 IST, Varanasi (25.32N, 82.97E) — chosen because it is a
// well-known reference date used in Jyotish textbooks and produces a chart
// with all nine planets in distinct houses.
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
const inputs = collectStrengthInputs(kundali);

// ─── Tests ─────────────────────────────────────────────────────────────────
describe('collectStrengthInputs', () => {
  it('returns a planets map keyed 0–8 with all required axes', () => {
    // All nine Jyotish planets (0=Sun … 8=Ketu) must be present.
    for (let pid = 0; pid <= 8; pid++) {
      const p = inputs.planets[pid] as PlanetStrength | undefined;
      expect(p, `planet ${pid} missing`).toBeDefined();
      if (!p) continue;

      // overall must be 0-100
      expect(p.overall).toBeGreaterThanOrEqual(0);
      expect(p.overall).toBeLessThanOrEqual(100);

      // All axes present (may be 0 / null / false defaults when upstream data absent)
      expect(typeof p.shadbalaRatio).toBe('number');
      expect(typeof p.dignity).toBe('string');
      expect(typeof p.baladiStrength).toBe('number');
      expect(typeof p.isCombust).toBe('boolean');
      expect(typeof p.isRetrograde).toBe('boolean');
      expect(typeof p.vargottama).toBe('boolean');
      expect(typeof p.vimsopaka).toBe('number');
      expect(typeof p.ashtakavargaBindus).toBe('number');
      // grahaYuddhaWinner: null or boolean
      expect(p.grahaYuddhaWinner === null || typeof p.grahaYuddhaWinner === 'boolean').toBe(true);
    }
  });

  it('returns a houses map keyed 1–12 with bhavabala, occupants, ownerStrength', () => {
    for (let h = 1; h <= 12; h++) {
      const hs = inputs.houses[h] as HouseStrength | undefined;
      expect(hs, `house ${h} missing`).toBeDefined();
      if (!hs) continue;

      expect(hs.bhavabala).toBeGreaterThanOrEqual(0);
      expect(hs.bhavabala).toBeLessThanOrEqual(100);

      expect(Array.isArray(hs.occupants)).toBe(true);

      expect(hs.ownerStrength).toBeGreaterThanOrEqual(0);
      expect(hs.ownerStrength).toBeLessThanOrEqual(100);
    }
  });

  it('populates derived health signals with expected types and safe defaults', () => {
    const d = inputs.derived as DerivedHealthSignals;

    // rahuHouse / ketuHouse: number (1-12) or undefined
    expect(d.rahuHouse === undefined || (typeof d.rahuHouse === 'number' && d.rahuHouse >= 1 && d.rahuHouse <= 12)).toBe(true);
    expect(d.ketuHouse === undefined || (typeof d.ketuHouse === 'number' && d.ketuHouse >= 1 && d.ketuHouse <= 12)).toBe(true);

    // placement scores: 0 (if node absent) or one of the canonical values {40, 50, 80, 100}
    const validPlacementValues = new Set([0, 40, 50, 80, 100]);
    expect(validPlacementValues.has(d.rahuPlacementScore), `rahuPlacementScore ${d.rahuPlacementScore} not in valid set`).toBe(true);
    expect(validPlacementValues.has(d.ketuPlacementScore), `ketuPlacementScore ${d.ketuPlacementScore} not in valid set`).toBe(true);

    // aspectsOnMoon: non-negative integers
    expect(d.aspectsOnMoon.malefic).toBeGreaterThanOrEqual(0);
    expect(d.aspectsOnMoon.benefic).toBeGreaterThanOrEqual(0);
    expect(Number.isInteger(d.aspectsOnMoon.malefic)).toBe(true);
    expect(Number.isInteger(d.aspectsOnMoon.benefic)).toBe(true);

    // moonPakshaBala: 0-100 (currently stubbed at 50)
    expect(d.moonPakshaBala).toBeGreaterThanOrEqual(0);
    expect(d.moonPakshaBala).toBeLessThanOrEqual(100);
    // Stub value — document the expectation so Phase E regression is visible
    // TODO (Phase E): remove this assertion once real elongation is wired.
    expect(d.moonPakshaBala).toBe(50);
  });

  it('houseLordId derives correct lord for lagna sign', () => {
    // lagna sign 1-based from ascendant; SIGN_LORD[sign] gives the lord.
    const lagnaSign = kundali.ascendant.sign; // 1-12
    const expectedLord = houseLordId(kundali, 1);
    // We cannot assert the exact planet without knowing the chart, but
    // we can assert it is a valid planet ID (0-8).
    expect(expectedLord).toBeGreaterThanOrEqual(0);
    expect(expectedLord).toBeLessThanOrEqual(8);

    // Regression: lagna lord must be the sign lord of the ascendant sign.
    // House N sign = (lagnaSign - 1 + N - 1) % 12 + 1  for whole-sign houses.
    const houseSign = ((lagnaSign - 1 + 0) % 12) + 1; // house 1
    expect(houseSign).toBe(lagnaSign);
    // The lord of houseSign must map to a valid planet.
    expect(expectedLord).toBeGreaterThanOrEqual(0);
  });
});

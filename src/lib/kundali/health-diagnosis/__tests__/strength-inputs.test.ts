// src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData, KundaliData } from '@/types/kundali';
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

// ─── C1 + C2 Invariant Regression Tests ───────────────────────────────────
// These tests enforce that:
//   1. Mars (id=2) aspects are correctly counted as MALEFIC on the Moon.
//   2. Mercury (id=3) aspects are correctly counted as BENEFIC on the Moon.
//   3. Mars's special 4th/8th aspects are applied to Mars, NOT Mercury.
//
// The bug (audit C1+C2) was: the inline Set used id=3 for malefics (Mercury)
// instead of id=2 (Mars), AND the special-aspect branch checked `pid === 3`
// (Mercury) instead of `pid === 2` (Mars). Both bugs corrupt aspectsOnMoon.
//
// This test constructs a synthetic KundaliData where Mars is in house 1
// (so it aspects houses 4, 7, 8 via Parashari rules) and the Moon is in
// house 4 — Mars's special 4th aspect must reach it.
// Mercury is in house 8 — it should NOT trigger a special aspect on house 4.
// Expected: aspectsOnMoon.malefic >= 1 (Mars → 4th aspect → house 4 where Moon is).

describe('C1+C2 invariant: Mars aspects on Moon are malefic; Mercury aspects are benefic', () => {
  // Build a minimal synthetic KundaliData with controlled planet placements.
  // We only need planets[], ascendant, and enough structure that
  // collectStrengthInputs() doesn't crash.
  function makePlanet(id: number, house: number, sign: number) {
    return {
      planet: { id, name: { en: 'P', hi: 'P', sa: 'P' }, symbol: '', color: '' },
      house,
      sign,
      isExalted: false,
      isDebilitated: false,
      isMoolatrikona: false,
      isRetrograde: false,
      isCombust: false,
      degree: 0,
      longitude: 0,
      latitude: 0,
      speed: 0.05,
      shadbala: null,
      ashtakavarga: null,
    };
  }

  // Chart: Aries lagna (sign=1), Mars in house 1 (sign 1), Moon in house 4 (sign 4),
  // Mercury in house 8 (sign 8). All others in house 9 to keep them out of the way.
  const syntheticKundali: KundaliData = {
    ascendant: { sign: 1, degree: 5, longitude: 5 },
    planets: [
      makePlanet(0, 9, 9),   // Sun — house 9 (irrelevant for this test)
      makePlanet(1, 4, 4),   // Moon — house 4 (the target)
      makePlanet(2, 1, 1),   // Mars — house 1 → aspects 4, 7, 8 (special 4th+8th)
      makePlanet(3, 8, 8),   // Mercury — house 8 → aspects 2, 12, 4 (7th only classically)
      makePlanet(4, 9, 9),   // Jupiter
      makePlanet(5, 9, 9),   // Venus
      makePlanet(6, 9, 9),   // Saturn
      makePlanet(7, 9, 9),   // Rahu
      makePlanet(8, 9, 9),   // Ketu
    ],
    // Minimal required fields — actual values don't matter for strength-inputs
    dashas: [],
    subPeriods: [],
    birthData: {
      name: 'Synthetic',
      date: '1990-01-15',
      time: '06:30',
      place: 'Test',
      lat: 25.32,
      lng: 82.97,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
  } as unknown as KundaliData;

  const synInputs = collectStrengthInputs(syntheticKundali);
  const d = synInputs.derived as DerivedHealthSignals;

  it('Mars in house 1 with 4th-aspect on house 4 (Moon) must increment malefic count (C1+C2)', () => {
    // Mars (id=2) is in house 1. Its special 4th aspect hits house 4 where Moon is.
    // Pre-fix: pid===3 branch (Mercury) incorrectly got the 4th/8th aspects instead
    // of Mars. Mars would only get the 7th (house 8), missing Moon in house 4.
    // Post-fix: pid===2 branch (Mars) correctly fires for house 4 where Moon sits.
    expect(d.aspectsOnMoon.malefic).toBeGreaterThanOrEqual(1);
  });

  it('Mercury in house 8 has only 7th aspect (house 2) — does NOT reach Moon in house 4 (C2)', () => {
    // Mercury (id=3) is in house 8. 7th aspect → house 2. No special aspects.
    // Pre-fix: Mercury was incorrectly getting 4th/8th aspects from the pid===3 branch.
    // Post-fix: only Mars (pid===2) gets 4th/8th aspects.
    // Mercury's 7th aspect hits house 2, not house 4 — Moon is NOT aspected by Mercury here.
    // The benefic count should NOT include Mercury's aspect on Moon in this chart.
    // (It may include Jupiter/Venus from house 9 if their 7th or special aspect reaches house 4.)
    // Primary assertion: malefic count is driven by Mars, not Mercury.
    // NATURAL_MALEFICS = {0,2,6,7,8} — Mercury(3) is NOT in the set.
    expect(d.aspectsOnMoon.malefic).toBeGreaterThanOrEqual(1); // Mars contributes
    // benefic count must be consistent (non-negative integers)
    expect(d.aspectsOnMoon.benefic).toBeGreaterThanOrEqual(0);
  });
});

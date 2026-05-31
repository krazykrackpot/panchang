/**
 * Integration test: generateKundali now populates kundali.d60Deities for
 * every planet 0..8 using the BPHS Ch.6 v.33-41 table from PR-E.
 *
 * The deity is derived from each planet's sidereal longitude — we don't
 * have to hand-compute it, just confirm the field is populated, has the
 * right shape, and matches the standalone computePlanetD60 helper for
 * each planet. That cross-check is the regression guard: if the engine
 * wiring drifts from the helper, this fails.
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '../kundali-calc';
import { computePlanetD60 } from '@/lib/constants/d60-deities';

const EINSTEIN = {
  name: 'Albert Einstein',
  date: '1879-03-14',
  time: '11:30',
  place: 'Ulm',
  lat: 48.3974,
  lng: 9.9934,
  timezone: 'Europe/Berlin',
  ayanamsha: 'lahiri' as const,
};

describe('generateKundali → d60Deities', () => {
  const k = generateKundali(EINSTEIN);

  it('populates d60Deities for all 9 grahas', () => {
    expect(k.d60Deities).toBeDefined();
    expect(k.d60Deities).toHaveLength(9);
    const ids = k.d60Deities!.map((d) => d.planetId).sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('each entry round-trips through computePlanetD60 from the planet\'s longitude', () => {
    for (const d of k.d60Deities!) {
      const planet = k.planets.find((p) => p.planet.id === d.planetId);
      expect(planet).toBeDefined();
      const recomputed = computePlanetD60(d.planetId, planet!.longitude);
      expect(d.positionInSign).toBe(recomputed.positionInSign);
      expect(d.deity.name.en).toBe(recomputed.deity.name.en);
      expect(d.isKrura).toBe(recomputed.isKrura);
    }
  });

  it('all positions are in the valid 1..60 range', () => {
    for (const d of k.d60Deities!) {
      expect(d.positionInSign).toBeGreaterThanOrEqual(1);
      expect(d.positionInSign).toBeLessThanOrEqual(60);
    }
  });

  it('each deity has non-empty EN/HI/SA names', () => {
    for (const d of k.d60Deities!) {
      expect(d.deity.name.en.length).toBeGreaterThan(0);
      expect(d.deity.name.hi.length).toBeGreaterThan(0);
      expect(d.deity.name.sa.length).toBeGreaterThan(0);
    }
  });

  it('Einstein Sun in Pisces 1.33° → segment 3 (even sign) / deity at index 57', () => {
    // Independently verified positions from PR #291 spec §4.1 cross-check:
    // Sun sign 12 (Pisces) house 10 1.33°.
    // signIndex = 11 (Pisces), even sign.
    // degInSign = 1.33, part = floor(1.33 / 0.5) = 2, position = 3.
    // Even-sign reversal: deity = odd-list index (60 - 3) = 57 = position 58 = Payodhi.
    const sun = k.d60Deities!.find((d) => d.planetId === 0);
    expect(sun).toBeDefined();
    expect(sun!.positionInSign).toBe(3);
    expect(sun!.deity.name.en).toBe('Payodhi');
  });
});

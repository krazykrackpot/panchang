// src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts
import { describe, it, expect } from 'vitest';
import { detectAllSignatures, SIGNATURE_REGISTRY } from '../signatures';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import { PLANET_IDS } from '@/lib/constants/grahas';

/**
 * Build a minimal KundaliData stub with only the planet placements needed
 * for signature detection. Fields not touched by the detector under test are
 * set to safe zero-values so TypeScript is satisfied without real computation.
 */
function stubKundali(placements: Array<{ id: number; house: number }>): KundaliData {
  const planets = placements.map(({ id, house }) => ({
    planet: { id, name: { en: '', hi: '', sa: '' }, symbol: '', color: '' },
    longitude: 0,
    latitude: 0,
    speed: 0,
    sign: 1,
    signName: { en: '', hi: '', sa: '' },
    house,
    nakshatra: { id: 1, name: { en: '', hi: '', sa: '' }, lord: { en: '', hi: '', sa: '' }, symbol: '', deity: { en: '', hi: '', sa: '' }, pada: [] as never },
    pada: 1,
    degree: '0°00\'00"',
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
  })) as PlanetPosition[];

  return {
    birthData: { date: '1990-01-01', time: '06:00', lat: 0, lng: 0, timezone: 'UTC', ayanamsha: 'lahiri' },
    ascendant: { degree: 0, sign: 1, signName: { en: '', hi: '', sa: '' } },
    planets,
    houses: [],
    chart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    dashas: [],
    dashaBalance: { planet: '', planetName: { en: '', hi: '', sa: '' }, years: 0, months: 0, days: 0 },
    shadBala: [],
    yogas: [],
    ashtakavarga: { bhinnashtakavarga: [], sarvashtakavarga: [], pindaAshtakavarga: [] },
  } as unknown as KundaliData;
}

describe('signatures registry', () => {
  it('exposes at least 12 detectors covering the spec\'s named yogas/patterns', () => {
    const ids = Object.keys(SIGNATURE_REGISTRY);
    expect(ids.length).toBeGreaterThanOrEqual(12);
    expect(ids).toEqual(expect.arrayContaining([
      'cardiac_risk', 'anxiety_mental', 'chronic_digestive', 'urogenital',
      'chronic_hidden', 'nervous_system_vata', 'respiratory', 'eye_sleep',
      'kemadruma', 'pisaca', 'mars_rahu_accident', 'saturn_rahu_malignancy',
    ]));
  });

  it('every signature has a direction field set to risk or protective', () => {
    for (const [id, def] of Object.entries(SIGNATURE_REGISTRY)) {
      expect(
        def.direction,
        `signature '${id}' is missing direction field`,
      ).toMatch(/^(risk|protective)$/);
    }
  });

  it('all currently-registered signatures are direction:risk (no protective ones yet)', () => {
    // This test documents the Phase B state. When a protective signature is added
    // in a future phase, this test should be updated to exclude it from the assertion.
    for (const [id, def] of Object.entries(SIGNATURE_REGISTRY)) {
      expect(def.direction, `signature '${id}' expected to be risk`).toBe('risk');
    }
  });

  it('detectAllSignatures returns boolean map keyed by signature id', () => {
    const k = generateKundali({
      date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21,
      timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });
    const detected = detectAllSignatures(k);
    for (const id of Object.keys(SIGNATURE_REGISTRY)) {
      expect(typeof detected[id]).toBe('boolean');
    }
  });
});

// ── mars_rahu_accident invariant tests ───────────────────────────────────────
// M5 audit fix added opposition detection (1/7 axis: |marsH - rahuH| === 6).
// These invariants ensure both the conjunction path AND the opposition path
// are exercised, catching a regression if the |diff| === 6 branch is dropped.

describe('mars_rahu_accident signature', () => {
  it('fires when Mars is in house 4 and Rahu is in house 4 (conjunction in accident house)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 4 },
      { id: PLANET_IDS.RAHU, house: 4 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(true);
  });

  it('fires when Mars is in house 8 and Rahu is in house 8 (conjunction in death house)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 8 },
      { id: PLANET_IDS.RAHU, house: 8 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(true);
  });

  it('fires when Mars is in house 1 and Rahu is in house 7 (opposition — M5 extension)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 1 },
      { id: PLANET_IDS.RAHU, house: 7 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(true);
  });

  it('fires when Mars is in house 7 and Rahu is in house 1 (opposition — reversed axis)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 7 },
      { id: PLANET_IDS.RAHU, house: 1 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(true);
  });

  it('does NOT fire when Mars is in house 1 and Rahu is in house 6 (not conjunction or opposition)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 1 },
      { id: PLANET_IDS.RAHU, house: 6 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(false);
  });

  it('does NOT fire when Mars is in house 2 and Rahu is in house 5 (trine — not accident pattern)', () => {
    const k = stubKundali([
      { id: PLANET_IDS.MARS, house: 2 },
      { id: PLANET_IDS.RAHU, house: 5 },
    ]);
    const detected = detectAllSignatures(k);
    expect(detected['mars_rahu_accident']).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateFullShadbala, type ShadBalaComplete } from './shadbala';

/** Build a minimal ShadBalaInput for testing */
function makeInput() {
  const planets = [
    { id: 0, longitude: 280, speed: 1.0,  house: 10, sign: 10, isRetrograde: false, isExalted: false, isDebilitated: false, isOwnSign: false, navamshaSign: 1 },
    { id: 1, longitude: 40,  speed: 13.0, house: 2,  sign: 2,  isRetrograde: false, isExalted: true,  isDebilitated: false, isOwnSign: false, navamshaSign: 4 },
    { id: 2, longitude: 300, speed: 0.5,  house: 11, sign: 11, isRetrograde: false, isExalted: false, isDebilitated: false, isOwnSign: false, navamshaSign: 8 },
    { id: 3, longitude: 260, speed: 1.2,  house: 9,  sign: 9,  isRetrograde: false, isExalted: false, isDebilitated: false, isOwnSign: false, navamshaSign: 3 },
    { id: 4, longitude: 90,  speed: 0.08, house: 4,  sign: 4,  isRetrograde: false, isExalted: true,  isDebilitated: false, isOwnSign: false, navamshaSign: 12 },
    { id: 5, longitude: 350, speed: 1.1,  house: 12, sign: 12, isRetrograde: false, isExalted: true,  isDebilitated: false, isOwnSign: false, navamshaSign: 7 },
    { id: 6, longitude: 200, speed: 0.03, house: 7,  sign: 7,  isRetrograde: false, isExalted: true,  isDebilitated: false, isOwnSign: false, navamshaSign: 11 },
    // Rahu/Ketu included but should be filtered out
    { id: 7, longitude: 60,  speed: -0.05, house: 3, sign: 3, isRetrograde: true,  isExalted: false, isDebilitated: false, isOwnSign: false, navamshaSign: 6 },
    { id: 8, longitude: 240, speed: -0.05, house: 9, sign: 9, isRetrograde: true,  isExalted: false, isDebilitated: false, isOwnSign: false, navamshaSign: 12 },
  ];

  return {
    planets,
    ascendantDeg: 280,
    julianDay: 2448257.5, // 1990-01-15
    birthDateObj: new Date('1990-01-15T06:00:00Z'),
    latitude: 28.6139,
    longitude: 77.2090,
    timezone: 5.5,
  };
}

describe('calculateFullShadbala', () => {
  let result: ShadBalaComplete[];

  beforeAll(() => {
    result = calculateFullShadbala(makeInput());
  });

  it('returns exactly 7 planets (excludes Rahu/Ketu)', () => {
    expect(result.length).toBe(7);
  });

  it('planet ids are 0 through 6', () => {
    const ids = result.map(r => r.planetId).sort();
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6]);
  });

  it('each planet has all required fields', () => {
    for (const p of result) {
      expect(p).toHaveProperty('planet');
      expect(p).toHaveProperty('planetId');
      expect(p).toHaveProperty('sthanaBala');
      expect(p).toHaveProperty('digBala');
      expect(p).toHaveProperty('kalaBala');
      expect(p).toHaveProperty('cheshtaBala');
      expect(p).toHaveProperty('naisargikaBala');
      expect(p).toHaveProperty('drikBala');
      expect(p).toHaveProperty('totalPinda');
      expect(p).toHaveProperty('rupas');
      expect(p).toHaveProperty('minRequired');
      expect(p).toHaveProperty('strengthRatio');
      expect(p).toHaveProperty('rank');
      expect(p).toHaveProperty('ishtaPhala');
      expect(p).toHaveProperty('kashtaPhala');
      expect(p).toHaveProperty('sthanaBreakdown');
      expect(p).toHaveProperty('kalaBreakdown');
    }
  });

  it('Naisargika Bala values are fixed', () => {
    const expected: Record<number, number> = {
      0: 60.00,
      1: 51.43,
      2: 17.14,
      3: 25.71,
      4: 34.29,
      5: 42.86,
      6: 8.57,
    };
    for (const p of result) {
      expect(p.naisargikaBala).toBeCloseTo(expected[p.planetId], 2);
    }
  });

  it('rupas = totalPinda / 60', () => {
    for (const p of result) {
      expect(p.rupas).toBeCloseTo(p.totalPinda / 60, 1);
    }
  });

  it('ranks are 1-7 with no duplicates', () => {
    const ranks = result.map(r => r.rank).sort();
    expect(ranks).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it('totalPinda is the sum of all six balas', () => {
    for (const p of result) {
      const computed = p.sthanaBala + p.digBala + p.kalaBala +
        p.cheshtaBala + p.naisargikaBala + p.drikBala;
      expect(p.totalPinda).toBeCloseTo(computed, 1);
    }
  });

  it('all numeric values are finite', () => {
    for (const p of result) {
      expect(Number.isFinite(p.totalPinda)).toBe(true);
      expect(Number.isFinite(p.rupas)).toBe(true);
      expect(Number.isFinite(p.sthanaBala)).toBe(true);
      expect(Number.isFinite(p.digBala)).toBe(true);
      expect(Number.isFinite(p.kalaBala)).toBe(true);
      expect(Number.isFinite(p.cheshtaBala)).toBe(true);
      expect(Number.isFinite(p.drikBala)).toBe(true);
      expect(Number.isFinite(p.ishtaPhala)).toBe(true);
      expect(Number.isFinite(p.kashtaPhala)).toBe(true);
    }
  });

  it('strengthRatio = rupas / minRequired', () => {
    for (const p of result) {
      expect(p.strengthRatio).toBeCloseTo(p.rupas / p.minRequired, 1);
    }
  });

  it('sthana breakdown has all sub-components', () => {
    for (const p of result) {
      const b = p.sthanaBreakdown;
      expect(b).toHaveProperty('ucchaBala');
      expect(b).toHaveProperty('saptavargaja');
      expect(b).toHaveProperty('ojhayugmaRashi');
      expect(b).toHaveProperty('ojhayugmaNavamsha');
      expect(b).toHaveProperty('kendradiBala');
      expect(b).toHaveProperty('drekkanaBala');
    }
  });

  it('kala breakdown has all sub-components', () => {
    for (const p of result) {
      const k = p.kalaBreakdown;
      expect(k).toHaveProperty('natonnataBala');
      expect(k).toHaveProperty('pakshaBala');
      expect(k).toHaveProperty('tribhagaBala');
      expect(k).toHaveProperty('abdaBala');
      expect(k).toHaveProperty('masaBala');
      expect(k).toHaveProperty('varaBala');
      expect(k).toHaveProperty('horaBala');
      expect(k).toHaveProperty('ayanaBala');
      expect(k).toHaveProperty('yuddhaBala');
    }
  });

  it('planet names are correct', () => {
    const nameMap: Record<number, string> = {
      0: 'Sun', 1: 'Moon', 2: 'Mars', 3: 'Mercury',
      4: 'Jupiter', 5: 'Venus', 6: 'Saturn',
    };
    for (const p of result) {
      expect(p.planet).toBe(nameMap[p.planetId]);
    }
  });
});

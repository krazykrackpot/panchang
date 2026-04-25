import { describe, it, expect } from 'vitest';
import { normalizeShadbala } from '../kundali/shadbala-normalize';
import type { ShadBalaComplete } from '../kundali/shadbala';

function makePlanet(overrides: Partial<ShadBalaComplete> & { planet: string; planetId: number }): ShadBalaComplete {
  return {
    sthanaBala: 100,
    digBala: 50,
    kalaBala: 80,
    cheshtaBala: 40,
    naisargikaBala: 30,
    drikBala: 10,
    totalPinda: 310,
    rupas: 5.17,
    minRequired: 5,
    strengthRatio: 1.03,
    rank: 1,
    ishtaPhala: 20,
    kashtaPhala: 5,
    sthanaBreakdown: {
      ucchaBala: 10, saptavargaja: 40, ojhayugmaRashi: 15,
      ojhayugmaNavamsha: 10, kendradiBala: 15, drekkanaBala: 10,
    },
    kalaBreakdown: {
      natonnataBala: 10, pakshaBala: 20, tribhagaBala: 5,
      abdaBala: 5, masaBala: 5, varaBala: 15, horaBala: 7,
      ayanaBala: 8, yuddhaBala: 5,
    },
    ...overrides,
  };
}

describe('normalizeShadbala', () => {
  it('returns 6 normalized values between 0-100 for each planet', () => {
    const data: ShadBalaComplete[] = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 120, digBala: 60, kalaBala: 90, cheshtaBala: 45, naisargikaBala: 60, drikBala: 15 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 80, digBala: 30, kalaBala: 50, cheshtaBala: 20, naisargikaBala: 51.43, drikBala: -5 }),
    ];
    const result = normalizeShadbala(data);
    for (const item of result) {
      expect(item.sthanaBala).toBeGreaterThanOrEqual(0);
      expect(item.sthanaBala).toBeLessThanOrEqual(100);
      expect(item.digBala).toBeGreaterThanOrEqual(0);
      expect(item.digBala).toBeLessThanOrEqual(100);
      expect(item.kalaBala).toBeGreaterThanOrEqual(0);
      expect(item.kalaBala).toBeLessThanOrEqual(100);
      expect(item.cheshtaBala).toBeGreaterThanOrEqual(0);
      expect(item.cheshtaBala).toBeLessThanOrEqual(100);
      expect(item.naisargikaBala).toBeGreaterThanOrEqual(0);
      expect(item.naisargikaBala).toBeLessThanOrEqual(100);
      expect(item.drikBala).toBeGreaterThanOrEqual(0);
      expect(item.drikBala).toBeLessThanOrEqual(100);
    }
  });

  it('normalizes relative to max in dataset — Sun=200 becomes 100, Moon=100 becomes 50', () => {
    const data: ShadBalaComplete[] = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 200, digBala: 60, kalaBala: 90, cheshtaBala: 45, naisargikaBala: 60, drikBala: 10 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 100, digBala: 30, kalaBala: 45, cheshtaBala: 22.5, naisargikaBala: 30, drikBala: 10 }),
    ];
    const result = normalizeShadbala(data);
    const sun = result.find(r => r.planet === 'Sun')!;
    const moon = result.find(r => r.planet === 'Moon')!;
    expect(sun.sthanaBala).toBeCloseTo(100, 1);
    expect(moon.sthanaBala).toBeCloseTo(50, 1);
  });

  it('handles negative drikBala by shifting all values to 0-based before normalizing', () => {
    const data: ShadBalaComplete[] = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 100, digBala: 60, kalaBala: 80, cheshtaBala: 40, naisargikaBala: 60, drikBala: 30 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 80, digBala: 30, kalaBala: 50, cheshtaBala: 20, naisargikaBala: 30, drikBala: -20 }),
    ];
    const result = normalizeShadbala(data);
    // All drikBala values must be 0-100 — no negatives
    for (const item of result) {
      expect(item.drikBala).toBeGreaterThanOrEqual(0);
      expect(item.drikBala).toBeLessThanOrEqual(100);
    }
    // The max-value planet should be at 100
    const sun = result.find(r => r.planet === 'Sun')!;
    const moon = result.find(r => r.planet === 'Moon')!;
    expect(sun.drikBala).toBeCloseTo(100, 1);
    expect(moon.drikBala).toBeCloseTo(0, 1);
  });

  it('handles all-equal values by returning 50 for all', () => {
    const data: ShadBalaComplete[] = [
      makePlanet({ planet: 'Sun', planetId: 0, sthanaBala: 100, digBala: 60, kalaBala: 80, cheshtaBala: 40, naisargikaBala: 60, drikBala: 10 }),
      makePlanet({ planet: 'Moon', planetId: 1, sthanaBala: 100, digBala: 60, kalaBala: 80, cheshtaBala: 40, naisargikaBala: 60, drikBala: 10 }),
    ];
    const result = normalizeShadbala(data);
    for (const item of result) {
      expect(item.sthanaBala).toBeCloseTo(50, 1);
      expect(item.digBala).toBeCloseTo(50, 1);
    }
  });

  it('preserves sthanaBreakdown, kalaBreakdown, totalPinda, rupas, strengthRatio, rank as passthrough fields', () => {
    const sthanaBreakdown = {
      ucchaBala: 12, saptavargaja: 45, ojhayugmaRashi: 15,
      ojhayugmaNavamsha: 10, kendradiBala: 15, drekkanaBala: 3,
    };
    const kalaBreakdown = {
      natonnataBala: 10, pakshaBala: 22, tribhagaBala: 5,
      abdaBala: 5, masaBala: 5, varaBala: 15, horaBala: 7,
      ayanaBala: 6, yuddhaBala: 5,
    };
    const data: ShadBalaComplete[] = [
      makePlanet({
        planet: 'Jupiter', planetId: 4,
        sthanaBreakdown,
        kalaBreakdown,
        totalPinda: 350,
        rupas: 5.83,
        strengthRatio: 1.17,
        rank: 2,
      }),
    ];
    const result = normalizeShadbala(data);
    const jup = result[0];
    expect(jup.sthanaBreakdown).toEqual(sthanaBreakdown);
    expect(jup.kalaBreakdown).toEqual(kalaBreakdown);
    expect(jup.totalPinda).toBe(350);
    expect(jup.rupas).toBeCloseTo(5.83);
    expect(jup.strengthRatio).toBeCloseTo(1.17);
    expect(jup.rank).toBe(2);
  });
});

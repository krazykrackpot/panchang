import { describe, it, expect } from 'vitest';
import { generateKundali } from './kundali-calc';
import type { BirthData, KundaliData } from '@/types/kundali';

const DELHI_BIRTH: BirthData = {
  name: 'Test Person',
  date: '1990-01-15',
  time: '06:00',
  place: 'Delhi',
  lat: 28.6139,
  lng: 77.2090,
  timezone: '5.5',
  ayanamsha: 'lahiri',
};

const MUMBAI_BIRTH: BirthData = {
  name: 'Mumbai Person',
  date: '2000-06-21',
  time: '14:30',
  place: 'Mumbai',
  lat: 19.0760,
  lng: 72.8777,
  timezone: '5.5',
  ayanamsha: 'lahiri',
};

describe('generateKundali', () => {
  let delhiKundali: KundaliData;
  let mumbaiKundali: KundaliData;

  beforeAll(() => {
    delhiKundali = generateKundali(DELHI_BIRTH);
    mumbaiKundali = generateKundali(MUMBAI_BIRTH);
  });

  // ── Structure validation ────────────────────────────────────────────

  it('returns valid KundaliData structure', () => {
    expect(delhiKundali).toHaveProperty('birthData');
    expect(delhiKundali).toHaveProperty('ascendant');
    expect(delhiKundali).toHaveProperty('planets');
    expect(delhiKundali).toHaveProperty('houses');
    expect(delhiKundali).toHaveProperty('chart');
    expect(delhiKundali).toHaveProperty('dashas');
    expect(delhiKundali).toHaveProperty('shadbala');
    expect(delhiKundali).toHaveProperty('ayanamshaValue');
    expect(delhiKundali).toHaveProperty('julianDay');
  });

  // ── Planets ─────────────────────────────────────────────────────────

  it('returns 9 planets (Sun through Ketu)', () => {
    expect(delhiKundali.planets.length).toBe(9);
  });

  it('planet ids are 0-8', () => {
    const ids = delhiKundali.planets.map(p => p.planet.id);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('each planet has sign between 1 and 12', () => {
    for (const p of delhiKundali.planets) {
      expect(p.sign).toBeGreaterThanOrEqual(1);
      expect(p.sign).toBeLessThanOrEqual(12);
    }
  });

  it('each planet has house between 1 and 12', () => {
    for (const p of delhiKundali.planets) {
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
  });

  it('each planet has longitude between 0 and 360', () => {
    for (const p of delhiKundali.planets) {
      expect(p.longitude).toBeGreaterThanOrEqual(0);
      expect(p.longitude).toBeLessThan(360);
    }
  });

  it('each planet has a nakshatra', () => {
    for (const p of delhiKundali.planets) {
      expect(p.nakshatra).toBeDefined();
      expect(p.nakshatra.id).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.id).toBeLessThanOrEqual(27);
    }
  });

  it('each planet has pada between 1 and 4', () => {
    for (const p of delhiKundali.planets) {
      expect(p.pada).toBeGreaterThanOrEqual(1);
      expect(p.pada).toBeLessThanOrEqual(4);
    }
  });

  it('isRetrograde is a boolean for each planet', () => {
    for (const p of delhiKundali.planets) {
      expect(typeof p.isRetrograde).toBe('boolean');
    }
  });

  it('isCombust is a boolean for each planet', () => {
    for (const p of delhiKundali.planets) {
      expect(typeof p.isCombust).toBe('boolean');
    }
  });

  // ── Ascendant ───────────────────────────────────────────────────────

  it('ascendant sign is between 1 and 12', () => {
    expect(delhiKundali.ascendant.sign).toBeGreaterThanOrEqual(1);
    expect(delhiKundali.ascendant.sign).toBeLessThanOrEqual(12);
  });

  it('ascendant degree is between 0 and 360', () => {
    expect(delhiKundali.ascendant.degree).toBeGreaterThanOrEqual(0);
    expect(delhiKundali.ascendant.degree).toBeLessThan(360);
  });

  it('ascendant has sign name with trilingual keys', () => {
    expect(delhiKundali.ascendant.signName).toHaveProperty('en');
    expect(delhiKundali.ascendant.signName).toHaveProperty('hi');
  });

  // ── Houses ──────────────────────────────────────────────────────────

  it('returns 12 houses', () => {
    expect(delhiKundali.houses.length).toBe(12);
  });

  it('houses are numbered 1-12', () => {
    const houseNums = delhiKundali.houses.map(h => h.house);
    expect(houseNums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('each house has degree, sign, and lord', () => {
    for (const h of delhiKundali.houses) {
      expect(h.degree).toBeGreaterThanOrEqual(0);
      expect(h.degree).toBeLessThan(360);
      expect(h.sign).toBeGreaterThanOrEqual(1);
      expect(h.sign).toBeLessThanOrEqual(12);
      expect(h.lord).toBeDefined();
    }
  });

  // ── Chart ───────────────────────────────────────────────────────────

  it('chart has 12 houses array', () => {
    expect(delhiKundali.chart.houses.length).toBe(12);
  });

  it('chart ascendant sign matches ascendant', () => {
    expect(delhiKundali.chart.ascendantSign).toBe(delhiKundali.ascendant.sign);
  });

  // ── Dashas ──────────────────────────────────────────────────────────

  it('dashas are generated (at least 1)', () => {
    expect(delhiKundali.dashas.length).toBeGreaterThan(0);
  });

  it('dasha entries have required fields', () => {
    for (const d of delhiKundali.dashas) {
      expect(d).toHaveProperty('planet');
      expect(d).toHaveProperty('startDate');
      expect(d).toHaveProperty('endDate');
      expect(d).toHaveProperty('level');
    }
  });

  it('maha dasha entries have sub-periods', () => {
    const mahaDashas = delhiKundali.dashas.filter(d => d.level === 'maha');
    expect(mahaDashas.length).toBeGreaterThan(0);
    for (const md of mahaDashas) {
      expect(md.subPeriods).toBeDefined();
      expect(md.subPeriods!.length).toBeGreaterThan(0);
    }
  });

  // ── Shadbala ────────────────────────────────────────────────────────

  it('shadbala has entries for 7 planets', () => {
    expect(delhiKundali.shadbala.length).toBe(7);
  });

  // ── Ayanamsha ───────────────────────────────────────────────────────

  it('ayanamsha value is reasonable (23-25 degrees for modern dates)', () => {
    expect(delhiKundali.ayanamshaValue).toBeGreaterThan(23);
    expect(delhiKundali.ayanamshaValue).toBeLessThan(25);
  });

  // ── Julian Day ──────────────────────────────────────────────────────

  it('julian day is reasonable', () => {
    // JD for 1990-01-15 should be around 2447907
    expect(delhiKundali.julianDay).toBeGreaterThan(2447900);
    expect(delhiKundali.julianDay).toBeLessThan(2447920);
  });

  // ── Different birth data produces different results ─────────────────

  it('different birth data produces different ascendants', () => {
    // Different dates/times/locations should generally produce different ascendants
    // (not guaranteed but very likely for these inputs)
    const sameSign = delhiKundali.ascendant.sign === mumbaiKundali.ascendant.sign;
    const sameDeg = Math.abs(delhiKundali.ascendant.degree - mumbaiKundali.ascendant.degree) < 0.01;
    // At least one of them should differ
    expect(sameSign && sameDeg).toBe(false);
  });

  // ── Extended data ───────────────────────────────────────────────────

  it('navamsha chart is generated', () => {
    expect(delhiKundali.navamshaChart).toBeDefined();
    expect(delhiKundali.navamshaChart.houses.length).toBe(12);
  });

  it('yogas complete is generated', () => {
    expect(delhiKundali.yogasComplete).toBeDefined();
    expect(delhiKundali.yogasComplete!.length).toBeGreaterThan(0);
  });

  it('full shadbala is generated', () => {
    expect(delhiKundali.fullShadbala).toBeDefined();
    expect(delhiKundali.fullShadbala!.length).toBe(7);
  });

  it('sade sati analysis is generated', () => {
    expect(delhiKundali.sadeSati).toBeDefined();
    expect(delhiKundali.sadeSati).toHaveProperty('allCycles');
  });
});

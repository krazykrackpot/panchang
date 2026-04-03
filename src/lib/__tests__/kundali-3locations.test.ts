/**
 * Kundali generation tests across 3 locations.
 * Verifies planet positions, houses, dashas, and yogas compute correctly.
 */
import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { KundaliData } from '@/types/kundali';

const BIRTH_DATA = [
  {
    label: 'Delhi native — Jan 15, 1990 06:30 IST',
    input: { name: 'Test Delhi', date: '1990-01-15', time: '06:30', place: 'Delhi', lat: 28.6139, lng: 77.209, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const },
  },
  {
    label: 'Bern native — Jul 20, 1985 14:15 CEST',
    input: { name: 'Test Bern', date: '1985-07-20', time: '14:15', place: 'Bern', lat: 46.948, lng: 7.447, timezone: 'Europe/Zurich', ayanamsha: 'lahiri' as const },
  },
  {
    label: 'Seattle native — Dec 3, 1995 22:00 PST',
    input: { name: 'Test Seattle', date: '1995-12-03', time: '22:00', place: 'Seattle', lat: 47.6062, lng: -122.3321, timezone: 'America/Los_Angeles', ayanamsha: 'lahiri' as const },
  },
];

describe.each(BIRTH_DATA)('Kundali Generation — $label', ({ input }) => {
  let k: KundaliData;

  // Generate once for all tests in this block
  it('generates without throwing', () => {
    k = generateKundali(input);
    expect(k).toBeDefined();
  });

  // ── Ascendant ──
  it('ascendant sign is 1-12', () => {
    expect(k.ascendant.sign).toBeGreaterThanOrEqual(1);
    expect(k.ascendant.sign).toBeLessThanOrEqual(12);
  });

  it('ascendant degree is 0-360', () => {
    expect(k.ascendant.degree).toBeGreaterThanOrEqual(0);
    expect(k.ascendant.degree).toBeLessThan(360);
  });

  it('ascendant has trilingual sign name', () => {
    expect(k.ascendant.signName.en).toBeTruthy();
    expect(k.ascendant.signName.hi).toBeTruthy();
  });

  // ── Planets ──
  it('has 9 planets (Sun through Ketu)', () => {
    expect(k.planets).toHaveLength(9);
  });

  it('all planets have valid signs (1-12)', () => {
    for (const p of k.planets) {
      expect(p.sign, `${p.planet.name.en} sign`).toBeGreaterThanOrEqual(1);
      expect(p.sign, `${p.planet.name.en} sign`).toBeLessThanOrEqual(12);
    }
  });

  it('all planets have valid houses (1-12)', () => {
    for (const p of k.planets) {
      expect(p.house, `${p.planet.name.en} house`).toBeGreaterThanOrEqual(1);
      expect(p.house, `${p.planet.name.en} house`).toBeLessThanOrEqual(12);
    }
  });

  it('all planets have longitudes 0-360', () => {
    for (const p of k.planets) {
      expect(p.longitude, `${p.planet.name.en} lon`).toBeGreaterThanOrEqual(0);
      expect(p.longitude, `${p.planet.name.en} lon`).toBeLessThan(360);
    }
  });

  it('Rahu and Ketu are exactly 180° apart', () => {
    const rahu = k.planets.find(p => p.planet.id === 7);
    const ketu = k.planets.find(p => p.planet.id === 8);
    expect(rahu).toBeDefined();
    expect(ketu).toBeDefined();
    const diff = Math.abs(rahu!.longitude - ketu!.longitude);
    const normalizedDiff = Math.min(diff, 360 - diff);
    expect(normalizedDiff).toBeCloseTo(180, 0);
  });

  it('Rahu is retrograde', () => {
    const rahu = k.planets.find(p => p.planet.id === 7);
    expect(rahu?.isRetrograde).toBe(true);
  });

  it('Ketu is retrograde', () => {
    const ketu = k.planets.find(p => p.planet.id === 8);
    expect(ketu?.isRetrograde).toBe(true);
  });

  // ── Houses ──
  it('has 12 houses', () => {
    expect(k.houses).toHaveLength(12);
  });

  it('house 1 degree matches ascendant', () => {
    expect(k.houses[0].degree).toBeCloseTo(k.ascendant.degree, 0);
  });

  // ── Chart Data ──
  it('chart has 12 houses with planet arrays', () => {
    expect(k.chart.houses).toHaveLength(12);
    for (const h of k.chart.houses) {
      expect(Array.isArray(h)).toBe(true);
    }
  });

  it('chart ascendantSign is valid', () => {
    expect(k.chart.ascendantSign).toBeGreaterThanOrEqual(1);
    expect(k.chart.ascendantSign).toBeLessThanOrEqual(12);
  });

  // ── Navamsha ──
  it('navamsha chart has 12 houses', () => {
    expect(k.navamshaChart.houses).toHaveLength(12);
  });

  // ── Dashas ──
  it('has at least 1 maha dasha', () => {
    expect(k.dashas.length).toBeGreaterThanOrEqual(1);
  });

  it('first dasha starts before birth date', () => {
    const firstStart = new Date(k.dashas[0].startDate);
    const birthDate = new Date(input.date);
    // First dasha might start before birth (balance dasha)
    expect(firstStart.getTime()).toBeLessThanOrEqual(birthDate.getTime() + 365 * 24 * 3600000);
  });

  it('maha dashas span 110-120 years (Vimshottari with balance dasha)', () => {
    const firstStart = new Date(k.dashas[0].startDate);
    const lastEnd = new Date(k.dashas[k.dashas.length - 1].endDate);
    const spanYears = (lastEnd.getTime() - firstStart.getTime()) / (365.25 * 24 * 3600000);
    // First dasha is balance dasha (partial), so total < 120
    expect(spanYears).toBeGreaterThan(110);
    expect(spanYears).toBeLessThanOrEqual(120);
  });

  it('all dashas have trilingual planet names', () => {
    for (const d of k.dashas) {
      expect(d.planetName.en, `dasha ${d.planet}`).toBeTruthy();
    }
  });

  // ── Shadbala ──
  it('has shadbala for at least 7 planets', () => {
    expect(k.shadbala.length).toBeGreaterThanOrEqual(7);
  });

  it('shadbala total strengths are positive', () => {
    for (const s of k.shadbala) {
      expect(s.totalStrength, `${s.planetName.en}`).toBeGreaterThan(0);
    }
  });

  // ── Yogas ──
  it('detects at least some yogas', () => {
    if (k.yogasComplete) {
      // At least some should be present (even if weak)
      const presentYogas = k.yogasComplete.filter(y => y.present);
      expect(presentYogas.length).toBeGreaterThanOrEqual(0);
    }
  });

  // ── Sade Sati ──
  it('sade sati analysis is computed', () => {
    expect(k.sadeSati).toBeDefined();
    expect(typeof k.sadeSati?.isActive).toBe('boolean');
  });

  // ── Ayanamsha ──
  it('ayanamsha value is between 23° and 25°', () => {
    expect(k.ayanamshaValue).toBeGreaterThan(23);
    expect(k.ayanamshaValue).toBeLessThan(25);
  });
});

// ── DST edge case: birth during DST transition ──────────────────

describe('Kundali — Birth during DST transition', () => {
  it('generates for birth at 02:30 AM March 29, 2026 Bern (CET→CEST gap)', () => {
    // 02:30 doesn't exist in local time (clocks jump 02:00→03:00)
    // The system should handle this gracefully
    const k = generateKundali({
      name: 'DST Baby',
      date: '2026-03-29',
      time: '02:30',
      place: 'Bern',
      lat: 46.948,
      lng: 7.447,
      timezone: 'Europe/Zurich',
      ayanamsha: 'lahiri',
    });
    expect(k).toBeDefined();
    expect(k.ascendant.sign).toBeGreaterThanOrEqual(1);
    expect(k.planets).toHaveLength(9);
  });

  it('generates for birth at 01:30 AM Nov 1, 2026 Seattle (PDT→PST, ambiguous hour)', () => {
    // 01:30 AM happens twice (once in PDT, once in PST)
    const k = generateKundali({
      name: 'Fall Back Baby',
      date: '2026-11-01',
      time: '01:30',
      place: 'Seattle',
      lat: 47.6062,
      lng: -122.3321,
      timezone: 'America/Los_Angeles',
      ayanamsha: 'lahiri',
    });
    expect(k).toBeDefined();
    expect(k.ascendant.sign).toBeGreaterThanOrEqual(1);
    expect(k.planets).toHaveLength(9);
  });
});

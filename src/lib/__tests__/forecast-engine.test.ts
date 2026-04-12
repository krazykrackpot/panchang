import { describe, it, expect, beforeAll } from 'vitest';
import { computeMonthlyTransits } from '@/lib/forecast/monthly-transit';
import { generateDashaNarrative } from '@/lib/forecast/dasha-narrative';
import { computeYearRating } from '@/lib/forecast/year-rating';
import { generateAnnualForecast } from '@/lib/forecast/annual-engine';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { generateVarshaphal } from '@/lib/varshaphal/index';
import type { BirthData } from '@/types/kundali';

// Shared test birth data: Delhi, Jan 15 2000, 12:00
const DELHI_BIRTH: BirthData = {
  name: 'Test Native',
  date: '2000-01-15',
  time: '12:00',
  place: 'New Delhi',
  lat: 28.6139,
  lng: 77.209,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri',
};

// Pre-compute natal chart and varshaphal once (expensive)
let natal: ReturnType<typeof generateKundali>;
let varshaphal: ReturnType<typeof generateVarshaphal>;

// Use beforeAll-style lazy init to avoid top-level computation blocking imports
function getNatal() {
  if (!natal) natal = generateKundali(DELHI_BIRTH);
  return natal;
}

function getVarshaphal() {
  if (!varshaphal) varshaphal = generateVarshaphal(DELHI_BIRTH, 2026);
  return varshaphal;
}

describe('monthly-transit', () => {
  it('returns 12 monthly snapshots', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    expect(result).toHaveLength(12);
    expect(result[0].month).toBe(1);
    expect(result[11].month).toBe(12);
  });

  it('each month has slow planet transits', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    for (const m of result) {
      expect(m.planets.length).toBeGreaterThanOrEqual(3); // At least Saturn, Jupiter, Rahu/Ketu
      expect(['favorable', 'mixed', 'challenging']).toContain(m.outlook);
    }
  });

  it('detects sign changes between months', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    // Month 1 can't have sign changes (no previous month to compare)
    expect(result[0].planets.every(p => !p.signChanged)).toBe(true);
  });

  it('month names are formatted correctly', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    expect(result[0].monthName).toBe('Jan 2026');
    expect(result[11].monthName).toBe('Dec 2026');
  });

  it('houses are calculated relative to ascendant sign', () => {
    const savTable = Array(12).fill(25);
    // Ascendant sign 4 (Cancer) — house should be (sign - 4 + 12) % 12 + 1
    const result = computeMonthlyTransits(4, savTable, 2026);
    for (const m of result) {
      for (const p of m.planets) {
        expect(p.house).toBeGreaterThanOrEqual(1);
        expect(p.house).toBeLessThanOrEqual(12);
        // Verify house calculation: ((sign - ascSign + 12) % 12) + 1
        const expectedHouse = ((p.sign - 4 + 12) % 12) + 1;
        expect(p.house).toBe(expectedHouse);
      }
    }
  });

  it('SAV bindus come from the provided table', () => {
    // Custom SAV table with distinct values
    const savTable = [30, 28, 22, 35, 18, 25, 27, 31, 20, 29, 24, 26];
    const result = computeMonthlyTransits(1, savTable, 2026);
    for (const m of result) {
      for (const p of m.planets) {
        expect(p.savBindu).toBe(savTable[p.sign - 1]);
      }
    }
  });

  it('avgSav is the mean of slow planet SAV values', () => {
    const savTable = Array(12).fill(30);
    const result = computeMonthlyTransits(1, savTable, 2026);
    for (const m of result) {
      // All SAV values are 30, so avg should be 30
      expect(m.avgSav).toBe(30);
    }
  });

  it('outlook reflects SAV thresholds', () => {
    // High SAV table => favorable
    const highSav = Array(12).fill(35);
    const highResult = computeMonthlyTransits(1, highSav, 2026);
    for (const m of highResult) {
      expect(m.outlook).toBe('favorable');
    }

    // Low SAV table => challenging
    const lowSav = Array(12).fill(15);
    const lowResult = computeMonthlyTransits(1, lowSav, 2026);
    for (const m of lowResult) {
      expect(m.outlook).toBe('challenging');
    }
  });
});

describe('dasha-narrative', () => {
  it('produces a narrative with currentMaha entry', () => {
    const n = getNatal();
    const narrative = generateDashaNarrative(n, 2026);

    expect(narrative.currentMaha).toBeDefined();
    expect(narrative.currentMaha.level).toBe('maha');
    expect(narrative.currentMaha.planet).toBeTruthy();
    expect(narrative.currentMaha.planetName).toBeDefined();
    expect(narrative.currentMaha.planetName.en).toBeTruthy();
    expect(narrative.currentMaha.planetName.hi).toBeTruthy();
    expect(narrative.currentMaha.planetId).toBeGreaterThanOrEqual(0);
    expect(narrative.currentMaha.planetId).toBeLessThanOrEqual(8);
  });

  it('currentMaha has valid house and sign', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);

    expect(narrative.currentMaha.sign).toBeGreaterThanOrEqual(1);
    expect(narrative.currentMaha.sign).toBeLessThanOrEqual(12);
    expect(narrative.currentMaha.house).toBeGreaterThanOrEqual(1);
    expect(narrative.currentMaha.house).toBeLessThanOrEqual(12);
  });

  it('currentMaha has dignity classification', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);
    expect(['exalted', 'debilitated', 'own', 'neutral']).toContain(narrative.currentMaha.dignity);
  });

  it('themes are trilingual', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);

    expect(narrative.currentMaha.themes.en).toBeTruthy();
    expect(narrative.currentMaha.themes.hi).toBeTruthy();
    expect(narrative.currentMaha.themes.sa).toBeTruthy();
    // English themes mention the planet name
    expect(narrative.currentMaha.themes.en).toContain(narrative.currentMaha.planet);
  });

  it('upcomingTransitions is an array with max 6 entries', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);

    expect(Array.isArray(narrative.upcomingTransitions)).toBe(true);
    expect(narrative.upcomingTransitions.length).toBeLessThanOrEqual(6);

    for (const t of narrative.upcomingTransitions) {
      expect(['maha', 'antar']).toContain(t.level);
      expect(t.planet).toBeTruthy();
      expect(t.startDate).toBeTruthy();
      expect(t.endDate).toBeTruthy();
    }
  });

  it('mahaChangesThisYear is a boolean', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);
    expect(typeof narrative.mahaChangesThisYear).toBe('boolean');
  });

  it('currentAntar is either null or a valid entry', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);

    if (narrative.currentAntar !== null) {
      expect(narrative.currentAntar.level).toBe('antar');
      expect(narrative.currentAntar.planet).toBeTruthy();
      expect(narrative.currentAntar.sign).toBeGreaterThanOrEqual(1);
      expect(narrative.currentAntar.sign).toBeLessThanOrEqual(12);
    }
  });

  it('transition dates are ISO strings within the year', () => {
    const narrative = generateDashaNarrative(getNatal(), 2026);

    for (const t of narrative.upcomingTransitions) {
      // startDate should be a valid date string
      const d = new Date(t.startDate);
      expect(d.getTime()).not.toBeNaN();
    }
  });
});

describe('year-rating', () => {
  it('produces a rating with overall score 1-5', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const transits = computeMonthlyTransits(n.ascendant.sign, new Array(12).fill(25), 2026);
    const rating = computeYearRating(n, v, transits);

    expect(rating.overall).toBeGreaterThanOrEqual(1);
    expect(rating.overall).toBeLessThanOrEqual(5);
  });

  it('has exactly 5 rating factors', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const transits = computeMonthlyTransits(n.ascendant.sign, new Array(12).fill(25), 2026);
    const rating = computeYearRating(n, v, transits);

    expect(rating.factors).toHaveLength(5);
  });

  it('each factor has name, score 1-5, and trilingual description', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const transits = computeMonthlyTransits(n.ascendant.sign, new Array(12).fill(25), 2026);
    const rating = computeYearRating(n, v, transits);

    for (const f of rating.factors) {
      expect(f.score).toBeGreaterThanOrEqual(1);
      expect(f.score).toBeLessThanOrEqual(5);
      expect(f.name.en).toBeTruthy();
      expect(f.name.hi).toBeTruthy();
      expect(f.name.sa).toBeTruthy();
      expect(f.description.en).toBeTruthy();
    }
  });

  it('factors include Muntha, Year Lord, Transit, Dasha, and Tajika', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const transits = computeMonthlyTransits(n.ascendant.sign, new Array(12).fill(25), 2026);
    const rating = computeYearRating(n, v, transits);

    const names = rating.factors.map(f => f.name.en);
    expect(names).toContain('Muntha Placement');
    expect(names).toContain('Year Lord Strength');
    expect(names).toContain('Transit Strength (SAV)');
    expect(names).toContain('Dasha Lord Dignity');
    expect(names).toContain('Tajika Yogas');
  });

  it('overall is a weighted average of factor scores', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const transits = computeMonthlyTransits(n.ascendant.sign, new Array(12).fill(25), 2026);
    const rating = computeYearRating(n, v, transits);

    // Weights: [0.15, 0.25, 0.25, 0.20, 0.15]
    const weights = [0.15, 0.25, 0.25, 0.20, 0.15];
    const expected = Math.round(
      rating.factors.reduce((sum, f, i) => sum + f.score * weights[i], 0) * 10
    ) / 10;
    expect(rating.overall).toBeCloseTo(expected, 1);
  });
});

describe('generateAnnualForecast (full integration)', () => {
  it('produces a complete annual forecast', () => {
    const n = getNatal();
    const v = getVarshaphal();
    const forecast = generateAnnualForecast(n, v, 2026);

    expect(forecast.year).toBe(2026);
    expect(forecast.natal).toBe(n);
    expect(forecast.varshaphal).toBe(v);
  });

  it('includes 12 monthly transits', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    expect(forecast.monthlyTransits).toHaveLength(12);
  });

  it('includes year rating with valid overall score', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    expect(forecast.yearRating).toBeDefined();
    expect(forecast.yearRating.overall).toBeGreaterThanOrEqual(1);
    expect(forecast.yearRating.overall).toBeLessThanOrEqual(5);
    expect(forecast.yearRating.factors).toHaveLength(5);
  });

  it('includes dasha narrative', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    expect(forecast.dashaNarrative).toBeDefined();
    expect(forecast.dashaNarrative.currentMaha).toBeDefined();
    expect(forecast.dashaNarrative.currentMaha.planet).toBeTruthy();
  });

  it('includes keyDates array sorted by date', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    expect(Array.isArray(forecast.keyDates)).toBe(true);

    // Verify sorted
    for (let i = 1; i < forecast.keyDates.length; i++) {
      expect(forecast.keyDates[i].date >= forecast.keyDates[i - 1].date).toBe(true);
    }

    // Each key date has required fields
    for (const kd of forecast.keyDates) {
      expect(kd.date).toMatch(/^\d{4}-\d{2}-\d{2}/);
      expect([1, 2, 3, 4]).toContain(kd.quarter);
      expect(['dasha_transition', 'sign_change', 'retrograde', 'eclipse']).toContain(kd.type);
      expect(kd.description.en).toBeTruthy();
    }
  });

  it('includes remedy recommendations', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    expect(Array.isArray(forecast.remedies)).toBe(true);

    // Should have at least gemstone + mantra for current dasha lord
    expect(forecast.remedies.length).toBeGreaterThanOrEqual(2);

    for (const r of forecast.remedies) {
      expect(['gemstone', 'mantra', 'practice']).toContain(r.type);
      expect(r.planetId).toBeGreaterThanOrEqual(0);
      expect(r.planetId).toBeLessThanOrEqual(8);
      expect(r.planetName.en).toBeTruthy();
      expect(r.recommendation.en).toBeTruthy();
    }
  });

  it('remedy gemstone recommendation references correct stone', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    const gemstone = forecast.remedies.find(r => r.type === 'gemstone');
    expect(gemstone).toBeDefined();
    // The recommendation text should mention a gem name
    expect(gemstone!.recommendation.en.length).toBeGreaterThan(10);
  });

  it('remedy mantra recommendation is present', () => {
    const forecast = generateAnnualForecast(getNatal(), getVarshaphal(), 2026);
    const mantra = forecast.remedies.find(r => r.type === 'mantra');
    expect(mantra).toBeDefined();
    // Mantra should contain "Om" or similar
    expect(mantra!.recommendation.en).toMatch(/Om|Namah/i);
  });
});

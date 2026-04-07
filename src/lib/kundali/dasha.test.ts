import { describe, it, expect } from 'vitest';
import { calculateDashas } from './dasha';

// Moon in Ashwini (nakshatra 0) = Ketu dasha; test at 7° of 13.33° span
const MOON_NAKSHATRA = 0;      // Ashwini → Ketu dasha (7 years)
const MOON_DEG_IN_NAKS = 7.0;  // 7° of 13.33°
const BIRTH_DATE = new Date('1990-01-15T06:00:00Z');

const TOTAL_DASHA_YEARS = 120;

describe('calculateDashas', () => {
  let dashas: ReturnType<typeof calculateDashas>;

  beforeAll(() => {
    dashas = calculateDashas(MOON_NAKSHATRA, MOON_DEG_IN_NAKS, BIRTH_DATE);
  });

  it('returns 9 maha dashas', () => {
    expect(dashas.length).toBe(9);
  });

  it('first maha dasha is Ketu (partial)', () => {
    expect(dashas[0].planet).toBe('Ketu');
  });

  it('first dasha is partial — less than 7 full years', () => {
    expect(dashas[0].years).toBeLessThan(7);
    expect(dashas[0].years).toBeGreaterThan(0);
  });

  it('full maha dashas 2-9 have canonical years', () => {
    const expectedYears = [20, 6, 10, 7, 18, 16, 19, 17]; // Venus through Mercury
    for (let i = 1; i < 9; i++) {
      expect(dashas[i].years).toBeCloseTo(expectedYears[i - 1], 5);
    }
  });

  it('each dasha has 9 antardasha sub-periods', () => {
    for (const d of dashas) {
      expect(d.subPeriods?.length).toBe(9);
    }
  });

  it('antardasha durations sum to maha dasha duration', () => {
    for (const d of dashas) {
      const subSum = d.subPeriods!.reduce((s, sp) => s + sp.years, 0);
      expect(subSum).toBeCloseTo(d.years, 5);
    }
  });

  it('antardasha formula: scaledYears = (antarLord.years × totalYears) / 120', () => {
    // Verify Sun maha dasha (6 years) antardasha periods
    const sunDasha = dashas.find(d => d.planet === 'Sun')!;
    const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury
    const sunIdx = 2; // Sun is index 2 in DASHA_SEQUENCE

    for (let i = 0; i < 9; i++) {
      const antarLordIdx = (sunIdx + i) % 9;
      const antarLordYears = DASHA_YEARS[antarLordIdx];
      const expectedScaled = (antarLordYears * 6) / TOTAL_DASHA_YEARS;
      expect(sunDasha.subPeriods![i].years).toBeCloseTo(expectedScaled, 5);
    }
  });

  it('dasha dates are sequential (endDate = next startDate)', () => {
    for (let i = 0; i < dashas.length - 1; i++) {
      expect(dashas[i].endDate.getTime()).toBeCloseTo(dashas[i + 1].startDate.getTime(), -3);
    }
  });

  it('antardasha dates within a maha dasha are sequential', () => {
    for (const d of dashas) {
      const subs = d.subPeriods!;
      for (let i = 0; i < subs.length - 1; i++) {
        expect(subs[i].endDate.getTime()).toBeCloseTo(subs[i + 1].startDate.getTime(), -3);
      }
    }
  });

  it('total of all maha dasha years (including partial first) > 100 and ≤ 120', () => {
    const total = dashas.reduce((s, d) => s + d.years, 0);
    expect(total).toBeGreaterThan(100);
    expect(total).toBeLessThanOrEqual(TOTAL_DASHA_YEARS + 0.001);
  });
});

import { describe, it, expect } from 'vitest';
import { computeVargaCrossRead } from '../varga-cross-read';
import type { KundaliData } from '@/types/kundali';

// Minimal fixture: two charts with basic planet data
function makeChart(overrides: Partial<KundaliData> = {}): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Delhi', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेष' } },
    planets: [
      { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3 },
      { id: 2, name: { en: 'Mars', hi: 'मंगल', sa: 'मंगल' }, longitude: 30, sign: 2, degree: 0, isRetrograde: false, house: 2 },
      { id: 3, name: { en: 'Mercury', hi: 'बुध', sa: 'बुध' }, longitude: 280, sign: 10, degree: 10, isRetrograde: false, house: 10 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 300, sign: 11, degree: 0, isRetrograde: false, house: 11 },
      { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: true, house: 7 },
      { id: 8, name: { en: 'Ketu', hi: 'केतु', sa: 'केतु' }, longitude: 0, sign: 1, degree: 0, isRetrograde: true, house: 1 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((i) % 12) + 1, degree: i * 30 })),
    chart: { houses: [], ascendantDeg: 10, ascendantSign: 1 },
    navamshaChart: { houses: [], ascendantDeg: 10, ascendantSign: 1 },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
    ...overrides,
  } as unknown as KundaliData;
}

describe('computeVargaCrossRead', () => {
  it('returns D9 cross-read for marriage context', () => {
    const chartA = makeChart();
    const chartB = makeChart();
    const result = computeVargaCrossRead(chartA, chartB, 'D9');
    expect(result.vargaType).toBe('D9');
    expect(result.compatibility).toBeGreaterThanOrEqual(0);
    expect(result.compatibility).toBeLessThanOrEqual(10);
    expect(result.narrative.en).toBeTruthy();
  });

  it('returns D7 cross-read for children context', () => {
    const chartA = makeChart();
    const chartB = makeChart();
    const result = computeVargaCrossRead(chartA, chartB, 'D7');
    expect(result.vargaType).toBe('D7');
    expect(result.compatibility).toBeGreaterThanOrEqual(0);
    expect(result.compatibility).toBeLessThanOrEqual(10);
    expect(result.narrative.en).toBeTruthy();
  });

  it('scores identical charts highly', () => {
    const chartA = makeChart();
    const chartB = makeChart();
    const result = computeVargaCrossRead(chartA, chartB, 'D9');
    // Identical charts should have same varga signs, so high compatibility
    expect(result.compatibility).toBeGreaterThanOrEqual(5);
  });

  it('generates bilingual narrative', () => {
    const chartA = makeChart();
    const chartB = makeChart({ ascendant: { degree: 10, sign: 7, signName: { en: 'Libra', hi: 'तुला', sa: 'तुला' } } });
    const result = computeVargaCrossRead(chartA, chartB, 'D9');
    expect(result.narrative.en).toBeTruthy();
    expect(result.narrative.hi).toBeTruthy();
  });
});

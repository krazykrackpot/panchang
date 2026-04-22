import { describe, it, expect } from 'vitest';
import { computeTransitRelationshipImpact } from '../transit-relationship';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

function makeMinimalChart(ascSign: number): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Test', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Test', hi: 'Test', sa: 'Test' } },
    planets: [
      { id: 0, name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य' }, longitude: 270, sign: 10, degree: 0, isRetrograde: false, house: 10 },
      { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 300, sign: 11, degree: 0, isRetrograde: false, house: 11 },
      { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 330, sign: 12, degree: 0, isRetrograde: false, house: 12 },
      { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: true, house: 7 },
    ] as PlanetPosition[],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((ascSign - 1 + i) % 12) + 1, degree: i * 30 })),
    chart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    navamshaChart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
  } as unknown as KundaliData;
}

const transitPlanets: PlanetPosition[] = [
  { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 180, sign: 7, degree: 0, isRetrograde: false, house: 7 },
  { id: 6, name: { en: 'Saturn', hi: 'शनि', sa: 'शनि' }, longitude: 330, sign: 12, degree: 0, isRetrograde: false, house: 12 },
  { id: 7, name: { en: 'Rahu', hi: 'राहु', sa: 'राहु' }, longitude: 0, sign: 1, degree: 0, isRetrograde: true, house: 1 },
] as PlanetPosition[];

describe('computeTransitRelationshipImpact', () => {
  it('returns transit impact for marriage context (houses 7, 1, 2)', () => {
    const chartA = makeMinimalChart(1); // Aries asc -> 7th house = Libra (sign 7)
    const chartB = makeMinimalChart(4); // Cancer asc -> 7th house = Capricorn (sign 10)
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'marriage');
    expect(result.overallTone).toMatch(/supportive|challenging|mixed|neutral/);
    expect(result.narrative.en).toBeTruthy();
    expect(Array.isArray(result.yourTransits)).toBe(true);
    expect(Array.isArray(result.theirTransits)).toBe(true);
  });

  it('returns transit impact for children context (houses 5, 1, 4)', () => {
    const chartA = makeMinimalChart(1);
    const chartB = makeMinimalChart(4);
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'children');
    expect(result.overallTone).toMatch(/supportive|challenging|mixed|neutral/);
    expect(result.narrative.en).toBeTruthy();
  });

  it('reports neutral when no slow planets hit relationship houses', () => {
    // Asc sign 5 (Leo): marriage houses 7,1,2 -> signs 11,5,6
    // Transit planets are on signs 7,12,1 -> no match
    const chartA = makeMinimalChart(5);
    const chartB = makeMinimalChart(5);
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'marriage');
    expect(result.overallTone).toBe('neutral');
    expect(result.yourTransits).toHaveLength(0);
  });

  it('generates bilingual narrative', () => {
    const chartA = makeMinimalChart(1);
    const chartB = makeMinimalChart(1);
    const result = computeTransitRelationshipImpact(chartA, chartB, transitPlanets, 'marriage');
    expect(result.narrative.hi).toBeTruthy();
  });
});

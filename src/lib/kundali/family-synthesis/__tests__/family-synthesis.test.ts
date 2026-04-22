import { describe, it, expect } from 'vitest';
import { computeMarriageDynamics } from '../marriage-dynamics';
import { computeChildDynamics } from '../child-dynamics';
import type { KundaliData, PlanetPosition } from '@/types/kundali';

/**
 * Build a fixture chart that satisfies both the synastry engine (p.planet.id, p.longitude)
 * and the family-synthesis helpers (getPid handles both p.id and p.planet.id).
 */
function makeFullChart(ascSign: number, overrides: Partial<KundaliData> = {}): KundaliData {
  const planets = [
    { id: 0, planet: { id: 0, name: { en: 'Sun', hi: 'सूर्य' } }, name: { en: 'Sun', hi: 'सूर्य' }, longitude: 270, sign: 10, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 10, nakshatra: 22, pada: 1, latitude: 0, speed: 1 },
    { id: 1, planet: { id: 1, name: { en: 'Moon', hi: 'चन्द्र' } }, name: { en: 'Moon', hi: 'चन्द्र' }, longitude: 60, sign: 3, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 3, nakshatra: 6, pada: 2, latitude: 0, speed: 13 },
    { id: 2, planet: { id: 2, name: { en: 'Mars', hi: 'मंगल' } }, name: { en: 'Mars', hi: 'मंगल' }, longitude: 30, sign: 2, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 2, nakshatra: 3, pada: 3, latitude: 0, speed: 0.5 },
    { id: 3, planet: { id: 3, name: { en: 'Mercury', hi: 'बुध' } }, name: { en: 'Mercury', hi: 'बुध' }, longitude: 280, sign: 10, degree: '10°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 10, nakshatra: 21, pada: 1, latitude: 0, speed: 1.2 },
    { id: 4, planet: { id: 4, name: { en: 'Jupiter', hi: 'गुरु' } }, name: { en: 'Jupiter', hi: 'गुरु' }, longitude: 120, sign: 5, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 5, nakshatra: 11, pada: 1, latitude: 0, speed: 0.08 },
    { id: 5, planet: { id: 5, name: { en: 'Venus', hi: 'शुक्र' } }, name: { en: 'Venus', hi: 'शुक्र' }, longitude: 180, sign: 7, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 7, nakshatra: 14, pada: 1, latitude: 0, speed: 1.1 },
    { id: 6, planet: { id: 6, name: { en: 'Saturn', hi: 'शनि' } }, name: { en: 'Saturn', hi: 'शनि' }, longitude: 330, sign: 12, degree: '0°0\'0"', isRetrograde: false, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 12, nakshatra: 26, pada: 1, latitude: 0, speed: 0.03 },
    { id: 7, planet: { id: 7, name: { en: 'Rahu', hi: 'राहु' } }, name: { en: 'Rahu', hi: 'राहु' }, longitude: 90, sign: 4, degree: '0°0\'0"', isRetrograde: true, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 4, nakshatra: 8, pada: 1, latitude: 0, speed: -0.05 },
    { id: 8, planet: { id: 8, name: { en: 'Ketu', hi: 'केतु' } }, name: { en: 'Ketu', hi: 'केतु' }, longitude: 270, sign: 10, degree: '0°0\'0"', isRetrograde: true, isCombust: false, isExalted: false, isDebilitated: false, isOwnSign: false, house: 10, nakshatra: 22, pada: 1, latitude: 0, speed: -0.05 },
  ] as unknown as PlanetPosition[];

  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, 0, 1).toISOString();
  const fiveYearsLater = new Date(now.getFullYear() + 5, 0, 1).toISOString();

  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Bern', lat: 46.9, lng: 7.4, timezone: 'Europe/Zurich', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Test', hi: 'Test', sa: 'Test' } },
    planets,
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      sign: ((ascSign - 1 + i) % 12) + 1,
      degree: i * 30,
      signName: { en: 'Test', hi: 'Test' },
      lord: 'Test',
      lordName: { en: 'Test', hi: 'Test' },
    })),
    chart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    navamshaChart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    dashas: [
      { planet: 'Venus', planetName: { en: 'Venus', hi: 'शुक्र' }, startDate: oneYearAgo, endDate: fiveYearsLater, level: 'maha' as const },
    ],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
    ...overrides,
  } as unknown as KundaliData;
}

describe('computeMarriageDynamics', () => {
  it('produces a complete RelationshipDynamics for two charts', () => {
    const chartA = makeFullChart(1);
    const chartB = makeFullChart(4);
    const transitPlanets = chartA.planets; // use natal as proxy for transits in test
    const result = computeMarriageDynamics(chartA, chartB, transitPlanets);

    expect(result.synastryHighlights).toBeDefined();
    expect(result.vargaCrossRead.vargaType).toBe('D9');
    expect(result.transitImpact.overallTone).toBeTruthy();
    expect(result.dashaSynchronicity).toBeDefined();
    expect(result.currentDynamic.en).toBeTruthy();
    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.monthlyForecast.en).toBeTruthy();
    // Guna score should exist for marriage
    expect(typeof result.gunaScore).toBe('number');
  });

  it('returns synastry highlights sorted by tightest orb', () => {
    const chartA = makeFullChart(1);
    const chartB = makeFullChart(1); // same asc for more conjunctions
    const result = computeMarriageDynamics(chartA, chartB, chartA.planets);

    if (result.synastryHighlights.length >= 2) {
      const orbs = result.synastryHighlights.map(h => h.orb);
      for (let i = 1; i < orbs.length; i++) {
        expect(orbs[i]).toBeGreaterThanOrEqual(orbs[i - 1]);
      }
    }
  });

  it('has at most 5 synastry highlights', () => {
    const chartA = makeFullChart(1);
    const chartB = makeFullChart(7);
    const result = computeMarriageDynamics(chartA, chartB, chartA.planets);
    expect(result.synastryHighlights.length).toBeLessThanOrEqual(5);
  });
});

describe('computeChildDynamics', () => {
  it('produces RelationshipDynamics for a parent-child pair', () => {
    const parent = makeFullChart(1);
    // ascSign=9 so Saturn(sign=12) lands on child's 4th house and Jupiter(sign=5) on 9th
    // -- triggering specific action items in generateChildActionItems
    const child = makeFullChart(9);
    const transitPlanets = parent.planets;
    const result = computeChildDynamics(parent, child, 'Arjun', transitPlanets);

    expect(result.synastryHighlights).toBeDefined();
    expect(result.vargaCrossRead.vargaType).toBe('D7');
    expect(result.transitImpact.overallTone).toBeTruthy();
    expect(result.dashaSynchronicity).toBeDefined();
    expect(result.currentDynamic.en).toBeTruthy();
    expect(result.actionItems.length).toBeGreaterThan(0);
    expect(result.monthlyForecast.en).toBeTruthy();
    // No guna score for children
    expect(result.gunaScore).toBeUndefined();
  });

  it('includes child name in the current dynamic narrative', () => {
    const parent = makeFullChart(1);
    const child = makeFullChart(4);
    const result = computeChildDynamics(parent, child, 'Priya', parent.planets);
    expect(result.currentDynamic.en).toContain('Priya');
  });

  it('uses D7 varga for child dynamics', () => {
    const parent = makeFullChart(5);
    const child = makeFullChart(11);
    const result = computeChildDynamics(parent, child, 'Dev', parent.planets);
    expect(result.vargaCrossRead.vargaType).toBe('D7');
  });
});

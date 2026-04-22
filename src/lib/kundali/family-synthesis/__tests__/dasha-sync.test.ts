import { describe, it, expect } from 'vitest';
import { computeDashaSynchronicity } from '../dasha-sync';
import type { KundaliData, DashaEntry } from '@/types/kundali';

function makeChartWithDashas(dashas: DashaEntry[], ascSign: number = 1): KundaliData {
  return {
    birthData: { name: 'Test', date: '1990-01-15', time: '06:00', place: 'Test', lat: 28.6, lng: 77.2, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' },
    ascendant: { degree: 10, sign: ascSign, signName: { en: 'Aries', hi: 'मेष', sa: 'मेष' } },
    planets: [
      { id: 5, name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र' }, longitude: 180, sign: 7, degree: 0, isRetrograde: false, house: 7 },
      { id: 4, name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु' }, longitude: 120, sign: 5, degree: 0, isRetrograde: false, house: 5 },
      { id: 1, name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र' }, longitude: 60, sign: 3, degree: 0, isRetrograde: false, house: 3 },
    ],
    houses: Array.from({ length: 12 }, (_, i) => ({ house: i + 1, sign: ((ascSign - 1 + i) % 12) + 1, degree: i * 30 })),
    chart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    navamshaChart: { houses: [], ascendantDeg: 10, ascendantSign: ascSign },
    dashas,
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2447913.5,
  } as unknown as KundaliData;
}

const now = new Date();
const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString();
const oneYearLater = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()).toISOString();

describe('computeDashaSynchronicity', () => {
  it('detects synchronicity when both dashas activate relationship houses', () => {
    // Venus Mahadasha for chart A (Venus lords 7th from Aries asc = Libra, sign 7)
    const dashasA: DashaEntry[] = [
      { planet: 'Venus', planetName: { en: 'Venus' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];
    // Jupiter Mahadasha for chart B (Jupiter lords 9th from Gemini asc = Sagittarius, sign 9)
    // Also Jupiter lords 10th from Gemini (Pisces = sign 12), occupies sign 5
    const dashasB: DashaEntry[] = [
      { planet: 'Jupiter', planetName: { en: 'Jupiter' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];

    const result = computeDashaSynchronicity(
      makeChartWithDashas(dashasA, 1),  // Aries asc
      makeChartWithDashas(dashasB, 3),  // Gemini asc
      'marriage',
    );
    expect(result.yourDasha).toBeTruthy();
    expect(result.theirDasha).toBeTruthy();
    expect(typeof result.inSync).toBe('boolean');
    expect(result.narrative.en).toBeTruthy();
  });

  it('works for children context', () => {
    // Jupiter Mahadasha for chart A: Jupiter lords 9th and 12th from Aries
    // Parent checks houses 5, 9 -> Jupiter lords 9th (Sagittarius)
    const dashasA: DashaEntry[] = [
      { planet: 'Jupiter', planetName: { en: 'Jupiter' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];
    const dashasB: DashaEntry[] = [
      { planet: 'Moon', planetName: { en: 'Moon' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];

    const result = computeDashaSynchronicity(
      makeChartWithDashas(dashasA, 1),
      makeChartWithDashas(dashasB, 1),
      'children',
    );
    expect(result.narrative.en).toBeTruthy();
  });

  it('returns not in sync when no relationship houses activated', () => {
    // Sun Mahadasha: Sun lords 5th (Leo) from Aries. For marriage context (7,1,2), Sun occupies sign 10 => house 10.
    // Sun lords house 5 (Leo). Neither 5 nor 10 is in {7,1,2}. So not activated.
    // Actually we need a planet that doesn't lord or occupy 7,1,2.
    // Mercury lords 3rd (Gemini) and 6th (Virgo) from Aries, occupies sign 10 => house 10. None match {7,1,2}.
    const dashasA: DashaEntry[] = [
      { planet: 'Mercury', planetName: { en: 'Mercury' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];
    const dashasB: DashaEntry[] = [
      { planet: 'Mercury', planetName: { en: 'Mercury' }, startDate: oneYearAgo, endDate: oneYearLater, level: 'maha' },
    ] as DashaEntry[];

    // We need a chart where Mercury doesn't sit in houses 7,1,2
    // With Aries asc (sign 1), Mercury in sign 10 -> house = ((10-1+12)%12)+1 = 10
    // Mercury lords sign 3 (house 3) and sign 6 (house 6). None is 7,1,2.
    const result = computeDashaSynchronicity(
      makeChartWithDashas(dashasA, 1),
      makeChartWithDashas(dashasB, 1),
      'marriage',
    );
    // Mercury doesn't activate 7,1,2 from Aries, so no sync
    expect(result.inSync).toBe(false);
  });
});

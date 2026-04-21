/**
 * Integration test for varga-tippanni engine wired to deep analysis,
 * narrative, and classical checks.
 */
import { describe, it, expect } from 'vitest';
import { generateVargaTippanni } from '../tippanni/varga-tippanni';
import type { KundaliData, PlanetPosition, DivisionalChart } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Minimal mock data
// ---------------------------------------------------------------------------

function makePlanet(id: number, sign: number, house: number, longitude: number): PlanetPosition {
  return {
    planet: { id, name: { en: `P${id}`, hi: `P${id}` }, symbol: '', color: '' },
    longitude,
    latitude: 0,
    speed: id === 6 ? -0.05 : 0.5, // Saturn retrograde for variety
    sign,
    signName: { en: `Sign${sign}`, hi: `Sign${sign}` },
    house,
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, lord: { en: 'Ketu', hi: 'केतु', sa: 'केतु' }, deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनीकुमार' }, symbol: { en: 'Horse head', hi: 'अश्व मुख', sa: 'अश्वमुख' }, startDeg: 0, endDeg: 13.333 },
    pada: 1,
    degree: '10°00\'00"',
    isRetrograde: id === 6,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
  };
}

function makeChart(ascSign: number, planetHouses: Record<number, number[]>): { houses: number[][]; ascendantDeg: number; ascendantSign: number } {
  const houses: number[][] = Array.from({ length: 12 }, () => []);
  for (const [h, pids] of Object.entries(planetHouses)) {
    houses[Number(h) - 1] = pids;
  }
  return { houses, ascendantDeg: (ascSign - 1) * 30 + 5, ascendantSign: ascSign };
}

function makeDivisionalChart(ascSign: number, planetHouses: Record<number, number[]>, key: string): DivisionalChart {
  const base = makeChart(ascSign, planetHouses);
  return {
    ...base,
    division: key,
    label: { en: `${key}`, hi: `${key}` },
  };
}

// Build a mock KundaliData with D1, navamsha (D9), and D10 in divisionalCharts
const mockKundali: KundaliData = {
  birthData: {
    name: 'Test Native',
    date: '2000-01-15',
    time: '10:30',
    place: 'Bern, Switzerland',
    lat: 46.948,
    lng: 7.4474,
    timezone: 'Europe/Zurich',
    ayanamsha: 'lahiri',
  },
  ascendant: { degree: 125, sign: 5, signName: { en: 'Leo', hi: 'सिंह' } },
  planets: [
    makePlanet(0, 10, 6, 280),  // Sun in Capricorn, 6th house
    makePlanet(1, 2, 10, 40),   // Moon in Taurus, 10th house
    makePlanet(2, 1, 9, 15),    // Mars in Aries (own), 9th house
    makePlanet(3, 11, 7, 315),  // Mercury in Aquarius, 7th house
    makePlanet(4, 1, 9, 10),    // Jupiter in Aries, 9th house
    makePlanet(5, 12, 8, 345),  // Venus in Pisces (exalted), 8th house
    makePlanet(6, 1, 9, 20),    // Saturn in Aries (debil), 9th house (retro)
    makePlanet(7, 5, 1, 130),   // Rahu in Leo, 1st house
    makePlanet(8, 11, 7, 310),  // Ketu in Aquarius, 7th house
  ],
  houses: Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: (5 + i * 30) % 360 + (i * 30),
    sign: ((4 + i) % 12) + 1,
    signName: { en: `S${((4 + i) % 12) + 1}`, hi: `S${((4 + i) % 12) + 1}` },
    lord: 'Sun',
    lordName: { en: 'Sun', hi: 'सूर्य' },
  })),
  chart: makeChart(5, { 1: [7], 6: [0], 7: [3, 8], 8: [5], 9: [2, 4, 6], 10: [1] }),
  navamshaChart: makeChart(9, { 1: [4], 2: [1], 3: [0], 5: [2], 7: [5, 3], 9: [6], 11: [7], 12: [8] }),
  divisionalCharts: {
    D10: makeDivisionalChart(3, { 1: [4], 3: [0, 3], 5: [2], 7: [1, 5], 10: [6], 11: [7], 12: [8] }, 'D10'),
    D7: makeDivisionalChart(12, { 1: [5], 2: [4], 5: [0], 7: [2, 1], 9: [3], 11: [6, 7], 12: [8] }, 'D7'),
  },
  dashas: [
    {
      planet: 'Jupiter',
      planetName: { en: 'Jupiter', hi: 'गुरु' },
      startDate: '2024-01-01',
      endDate: '2040-01-01',
      level: 'maha' as const,
      subPeriods: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2026-01-01',
          endDate: '2028-07-01',
          level: 'antar' as const,
        },
      ],
    },
  ],
  shadbala: [],
  ayanamshaValue: 24.2,
  julianDay: 2451559.5,
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('varga-tippanni integration', () => {
  const synthesis = generateVargaTippanni(mockKundali, 'en');

  it('produces VargaSynthesis with vargaInsights', () => {
    expect(synthesis).toBeDefined();
    expect(synthesis.vargaInsights.length).toBeGreaterThan(0);
  });

  it('produces deepAnalysis for D9 (via navamshaChart fallback)', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    expect(d9).toBeDefined();
    expect(d9?.deepAnalysis).toBeDefined();
    expect(d9?.deepAnalysis?.chartId).toBe('D9');
    expect(d9?.deepAnalysis?.domain).toBe('marriage');
  });

  it('produces deepAnalysis for D10 from divisionalCharts', () => {
    const d10 = synthesis.vargaInsights.find(v => v.chart === 'D10');
    expect(d10).toBeDefined();
    expect(d10?.deepAnalysis).toBeDefined();
    expect(d10?.deepAnalysis?.chartId).toBe('D10');
    expect(d10?.deepAnalysis?.domain).toBe('career');
  });

  it('D9 narrative is non-empty', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    expect(d9?.deepAnalysis?.narrative.en.length).toBeGreaterThan(50);
  });

  it('D9 narrative differs from D10 narrative', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    const d10 = synthesis.vargaInsights.find(v => v.chart === 'D10');
    if (d9?.deepAnalysis && d10?.deepAnalysis) {
      expect(d9.deepAnalysis.narrative.en).not.toBe(d10.deepAnalysis.narrative.en);
    }
  });

  it('deepAnalysis includes cross-correlation factors', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    const cc = d9?.deepAnalysis?.crossCorrelation;
    expect(cc).toBeDefined();
    if (cc) {
      expect(cc.dignityShifts).toBeDefined();
      expect(Array.isArray(cc.dignityShifts)).toBe(true);
      expect(cc.dispositorChain).toBeDefined();
      expect(cc.keyHouseLords).toBeDefined();
      expect(cc.pushkaraChecks).toBeDefined();
      expect(cc.gandantaChecks).toBeDefined();
      expect(cc.yogasInChart).toBeDefined();
      expect(cc.aspectsOnKeyHouses).toBeDefined();
    }
  });

  it('deepAnalysis includes promise/delivery verdict', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    const pd = d9?.deepAnalysis?.promiseDelivery;
    expect(pd).toBeDefined();
    if (pd) {
      expect(pd.d1Promise).toBeGreaterThanOrEqual(0);
      expect(pd.d1Promise).toBeLessThanOrEqual(100);
      expect(pd.dxxDelivery).toBeGreaterThanOrEqual(0);
      expect(pd.dxxDelivery).toBeLessThanOrEqual(100);
      expect(pd.verdictKey).toBeTruthy();
      expect(pd.verdict.en.length).toBeGreaterThan(10);
    }
  });

  it('overallCommentary is replaced by deep narrative when available', () => {
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    if (d9?.deepAnalysis) {
      // The overallCommentary should match the deep narrative
      expect(d9.overallCommentary.en).toBe(d9.deepAnalysis.narrative.en);
    }
  });

  it('D1 does NOT have deepAnalysis (no divisional chart entry for D1)', () => {
    const d1 = synthesis.vargaInsights.find(v => v.chart === 'D1');
    expect(d1).toBeDefined();
    // D1 is not in divisionalCharts and not D9, so buildDeepVargaAnalysis returns null
    expect(d1?.deepAnalysis).toBeUndefined();
  });

  it('produces deepAnalysis for D7 (children)', () => {
    const d7 = synthesis.vargaInsights.find(v => v.chart === 'D7');
    expect(d7?.deepAnalysis).toBeDefined();
    expect(d7?.deepAnalysis?.domain).toBe('children');
  });
});

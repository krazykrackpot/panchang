/**
 * Unit tests for Sudarshana Chakra engine.
 *
 * Uses a mock KundaliData with known planet placements to verify:
 * - Ring construction from correct starting signs
 * - Planet placement in each ring
 * - Dasha year cycling logic
 * - House-sign mapping correctness
 */
import { describe, it, expect } from 'vitest';
import { generateSudarshana } from '@/lib/kundali/sudarshana';
import type { KundaliData, PlanetPosition } from '@/types/kundali';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_NAKSHATRA = {
  id: 1,
  name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' },
  deity: { en: 'Ashwini Kumaras', hi: 'अश्विनीकुमार', sa: 'अश्विनीकुमारौ' },
  ruler: 'Ketu',
  rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
  startDeg: 0,
  endDeg: 13.333,
  pada: 1,
  symbol: '♈',
  nature: { en: 'Kshipra', hi: 'क्षिप्र', sa: 'क्षिप्रम्' },
};

function makePlanet(
  grahaId: number,
  sign: number,
  longitude: number,
  opts: Partial<PlanetPosition> = {},
): PlanetPosition {
  const graha = GRAHAS[grahaId];
  const rashi = RASHIS[sign - 1];
  const degInSign = longitude % 30;
  return {
    planet: graha,
    longitude,
    latitude: 0,
    speed: 1,
    sign,
    signName: rashi.name,
    house: sign,
    nakshatra: MOCK_NAKSHATRA,
    pada: 1,
    degree: `${Math.floor(degInSign)}°00'00"`,
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    ...opts,
  };
}

function buildMockChart(): KundaliData {
  const planets: PlanetPosition[] = [
    makePlanet(0, 5, 135),
    makePlanet(1, 4, 100),
    makePlanet(2, 1, 22),
    makePlanet(3, 6, 165),
    makePlanet(4, 9, 245, { isOwnSign: true }),
    makePlanet(5, 7, 195),
    makePlanet(6, 10, 290, { isOwnSign: true }),
    makePlanet(7, 3, 72),
    makePlanet(8, 9, 252),
  ];

  return {
    birthData: {
      name: 'Test Native',
      date: '2026-01-15',
      time: '10:30',
      place: 'Test City',
      lat: 46.46,
      lng: 6.84,
      timezone: 'Europe/Zurich',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 5, sign: 1, signName: RASHIS[0].name },
    planets,
    houses: [],
    chart: { houses: [], ascendantDeg: 5, ascendantSign: 1 },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.2,
    julianDay: 2461390.5,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Sudarshana Chakra Engine', () => {
  const chart = buildMockChart();
  const result = generateSudarshana(chart, 1);

  // --- Ring starting signs ---

  it('lagna ring starts from ascendant sign (Aries = 1)', () => {
    expect(result.lagnaRing.startSign).toBe(1);
  });

  it('chandra ring starts from Moon sign (Cancer = 4)', () => {
    expect(result.chandraRing.startSign).toBe(4);
  });

  it('surya ring starts from Sun sign (Leo = 5)', () => {
    expect(result.suryaRing.startSign).toBe(5);
  });

  // --- Each ring has 12 segments ---

  it('all rings have exactly 12 segments', () => {
    expect(result.lagnaRing.segments).toHaveLength(12);
    expect(result.chandraRing.segments).toHaveLength(12);
    expect(result.suryaRing.segments).toHaveLength(12);
  });

  // --- House numbering ---

  it('house numbers go from 1 to 12', () => {
    for (const ring of [result.lagnaRing, result.chandraRing, result.suryaRing]) {
      const numbers = ring.segments.map(s => s.houseNumber);
      expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
    }
  });

  // --- Sign assignment wraps correctly ---

  it('lagna ring sign sequence starts at 1 (Aries) and wraps', () => {
    const signs = result.lagnaRing.segments.map(s => s.signId);
    expect(signs).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('chandra ring sign sequence starts at 4 (Cancer) and wraps', () => {
    const signs = result.chandraRing.segments.map(s => s.signId);
    expect(signs).toEqual([4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]);
  });

  it('surya ring sign sequence starts at 5 (Leo) and wraps', () => {
    const signs = result.suryaRing.segments.map(s => s.signId);
    expect(signs).toEqual([5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4]);
  });

  // --- Planet placement ---

  it('Mars is in house 1 of lagna ring (Aries)', () => {
    const seg1 = result.lagnaRing.segments[0];
    expect(seg1.signId).toBe(1);
    const mars = seg1.planets.find(p => p.id === 2);
    expect(mars).toBeDefined();
  });

  it('Moon is in house 1 of chandra ring (Cancer)', () => {
    const seg1 = result.chandraRing.segments[0];
    expect(seg1.signId).toBe(4);
    const moon = seg1.planets.find(p => p.id === 1);
    expect(moon).toBeDefined();
  });

  it('Sun is in house 1 of surya ring (Leo)', () => {
    const seg1 = result.suryaRing.segments[0];
    expect(seg1.signId).toBe(5);
    const sun = seg1.planets.find(p => p.id === 0);
    expect(sun).toBeDefined();
  });

  it('Jupiter and Ketu share the same sign (Sagittarius)', () => {
    const sagSeg = result.lagnaRing.segments.find(s => s.signId === 9)!;
    const jupiter = sagSeg.planets.find(p => p.id === 4);
    const ketu = sagSeg.planets.find(p => p.id === 8);
    expect(jupiter).toBeDefined();
    expect(ketu).toBeDefined();
  });

  // --- Total planet count ---

  it('total planet count is the same in all three rings', () => {
    const count = (ring: typeof result.lagnaRing) =>
      ring.segments.reduce((sum, s) => sum + s.planets.length, 0);
    expect(count(result.lagnaRing)).toBe(9);
    expect(count(result.chandraRing)).toBe(9);
    expect(count(result.suryaRing)).toBe(9);
  });

  // --- Dasha entries ---

  it('generates 120 dasha entries', () => {
    expect(result.dashaEntries).toHaveLength(120);
  });

  it('age 0 activates house 1 in all rings', () => {
    const entry = result.dashaEntries[0];
    expect(entry.age).toBe(0);
    expect(entry.lagnaHouse).toBe(1);
    expect(entry.moonHouse).toBe(1);
    expect(entry.sunHouse).toBe(1);
  });

  it('age 11 activates house 12', () => {
    const entry = result.dashaEntries[11];
    expect(entry.age).toBe(11);
    expect(entry.lagnaHouse).toBe(12);
  });

  it('age 12 cycles back to house 1', () => {
    const entry = result.dashaEntries[12];
    expect(entry.age).toBe(12);
    expect(entry.lagnaHouse).toBe(1);
    expect(entry.moonHouse).toBe(1);
    expect(entry.sunHouse).toBe(1);
  });

  it('age 119 activates house 12', () => {
    const entry = result.dashaEntries[119];
    expect(entry.age).toBe(119);
    expect(entry.lagnaHouse).toBe(12);
  });

  // --- Interpretation ---

  it('interpretation has combined text for the selected age', () => {
    expect(result.interpretation.age).toBe(1);
    expect(result.interpretation.combined).toBeTruthy();
    expect(typeof result.interpretation.combined).toBe('string');
  });

  // --- Edge case: sign 12 wraps ---

  it('ring starting from sign 12 wraps correctly', () => {
    const piscesChart = buildMockChart();
    piscesChart.ascendant = { degree: 5, sign: 12, signName: RASHIS[11].name };
    const piscesResult = generateSudarshana(piscesChart, 1);
    const signs = piscesResult.lagnaRing.segments.map(s => s.signId);
    expect(signs).toEqual([12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
  });

  // --- Sign names match RASHIS ---

  it('all sign names in lagna ring match RASHIS data', () => {
    for (const seg of result.lagnaRing.segments) {
      const expectedName = RASHIS[seg.signId - 1].name.en;
      expect(seg.signName.en).toBe(expectedName);
    }
  });
});

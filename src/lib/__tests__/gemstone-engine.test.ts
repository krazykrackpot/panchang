import { describe, it, expect } from 'vitest';
import { generateGemstoneRecommendations } from '@/lib/remedies/gemstone-engine';
import type { KundaliData, PlanetPosition, ShadBala } from '@/types/kundali';
import { GRAHAS } from '@/lib/constants/grahas';
import { RASHIS } from '@/lib/constants/rashis';

// ---------------------------------------------------------------------------
// Helpers to build minimal chart fixtures
// ---------------------------------------------------------------------------

const MOCK_NAKSHATRA = {
  id: 1,
  name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' },
  deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनौ' },
  ruler: 'Ketu',
  rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
  startDeg: 0,
  endDeg: 13.333,
  symbol: '♈',
  nature: { en: 'Swift', hi: 'शीघ्र', sa: 'क्षिप्रम्' },
};

function makePlanet(
  grahaId: number,
  sign: number,
  house: number,
  opts: Partial<PlanetPosition> = {},
): PlanetPosition {
  return {
    planet: GRAHAS[grahaId],
    longitude: (sign - 1) * 30 + 15,
    latitude: 0,
    speed: 1,
    sign,
    signName: RASHIS[sign - 1].name,
    house,
    nakshatra: MOCK_NAKSHATRA,
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    isVargottama: false,
    isMrityuBhaga: false,
    ...opts,
  } as PlanetPosition;
}

function makeShadbala(planetName: string, totalStrength: number): ShadBala {
  return {
    planet: planetName,
    planetName: { en: planetName },
    totalStrength,
    sthanaBala: totalStrength * 0.3,
    digBala: totalStrength * 0.1,
    kalaBala: totalStrength * 0.3,
    cheshtaBala: totalStrength * 0.1,
    naisargikaBala: totalStrength * 0.1,
    drikBala: totalStrength * 0.1,
  };
}

function buildChart(overrides: {
  planets?: PlanetPosition[];
  shadbala?: ShadBala[];
  ascendantSign?: number;
} = {}): KundaliData {
  const ascSign = overrides.ascendantSign ?? 1;
  const defaultPlanets = [
    makePlanet(0, 5, 5),   // Sun in Leo, house 5
    makePlanet(1, 4, 4),   // Moon in Cancer, house 4
    makePlanet(2, 1, 1),   // Mars in Aries, house 1
    makePlanet(3, 6, 6),   // Mercury in Virgo, house 6
    makePlanet(4, 9, 9),   // Jupiter in Sagittarius, house 9
    makePlanet(5, 7, 7),   // Venus in Libra, house 7
    makePlanet(6, 10, 10), // Saturn in Capricorn, house 10
    makePlanet(7, 3, 3),   // Rahu in Gemini, house 3
    makePlanet(8, 9, 9),   // Ketu in Sagittarius, house 9
  ];
  const defaultShadbala = [
    makeShadbala('Sun', 80),
    makeShadbala('Moon', 75),
    makeShadbala('Mars', 70),
    makeShadbala('Mercury', 65),
    makeShadbala('Jupiter', 90),
    makeShadbala('Venus', 85),
    makeShadbala('Saturn', 60),
    makeShadbala('Rahu', 50),
    makeShadbala('Ketu', 50),
  ];

  return {
    birthData: {
      name: 'Test', date: '2026-01-15', time: '10:30', place: 'Test',
      lat: 46.46, lng: 6.84, timezone: 'Europe/Zurich', ayanamsha: 'lahiri',
    },
    ascendant: { degree: 5, sign: ascSign, signName: RASHIS[ascSign - 1].name },
    planets: overrides.planets ?? defaultPlanets,
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1, degree: i * 30, sign: ((ascSign - 1 + i) % 12) + 1,
      signName: RASHIS[((ascSign - 1 + i) % 12)].name,
      lord: 'Mars', lordName: { en: 'Mars' },
    })),
    chart: { houses: [], ascendantDeg: 5, ascendantSign: ascSign },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: 1 },
    dashas: [],
    shadbala: overrides.shadbala ?? defaultShadbala,
    ayanamshaValue: 24.2,
    julianDay: 2461390.5,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('generateGemstoneRecommendations', () => {
  it('returns recommendations for all 9 planets', () => {
    const chart = buildChart();
    const recs = generateGemstoneRecommendations(chart);
    expect(recs.length).toBe(9);
    const planetIds = recs.map(r => r.planetId).sort();
    expect(planetIds).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('debilitated planet gets high score', () => {
    const planets = [
      makePlanet(0, 7, 7, { isDebilitated: true }), // Sun debilitated in Libra
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 1),
      makePlanet(3, 6, 6),
      makePlanet(4, 9, 9),
      makePlanet(5, 7, 7),
      makePlanet(6, 10, 10),
      makePlanet(7, 3, 3),
      makePlanet(8, 9, 9),
    ];
    const recs = generateGemstoneRecommendations(buildChart({ planets }));
    const sunRec = recs.find(r => r.planetId === 0)!;
    expect(sunRec.needScore).toBeGreaterThanOrEqual(30);
    expect(sunRec.reasons.some(r => r.toLowerCase().includes('debilitat'))).toBe(true);
  });

  it('exalted planet gets reduced score', () => {
    const planets = [
      makePlanet(0, 1, 1, { isExalted: true }), // Sun exalted in Aries
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 1),
      makePlanet(3, 6, 6),
      makePlanet(4, 9, 9),
      makePlanet(5, 7, 7),
      makePlanet(6, 10, 10),
      makePlanet(7, 3, 3),
      makePlanet(8, 9, 9),
    ];
    const recs = generateGemstoneRecommendations(buildChart({ planets }));
    const sunRec = recs.find(r => r.planetId === 0)!;
    expect(sunRec.needScore).toBeLessThanOrEqual(10);
    expect(sunRec.needLevel).toBe('not_needed');
  });

  it('combust planet gets score boost', () => {
    const planets = [
      makePlanet(0, 5, 5),
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 1),
      makePlanet(3, 5, 5, { isCombust: true }), // Mercury combust
      makePlanet(4, 9, 9),
      makePlanet(5, 7, 7),
      makePlanet(6, 10, 10),
      makePlanet(7, 3, 3),
      makePlanet(8, 9, 9),
    ];
    const recs = generateGemstoneRecommendations(buildChart({ planets }));
    const mercRec = recs.find(r => r.planetId === 3)!;
    expect(mercRec.needScore).toBeGreaterThanOrEqual(15);
    expect(mercRec.reasons.some(r => r.toLowerCase().includes('combust'))).toBe(true);
  });

  it('dusthana house increases score', () => {
    const planets = [
      makePlanet(0, 5, 5),
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 8), // Mars in 8th house (dusthana)
      makePlanet(3, 6, 6),
      makePlanet(4, 9, 9),
      makePlanet(5, 7, 7),
      makePlanet(6, 10, 10),
      makePlanet(7, 3, 3),
      makePlanet(8, 9, 9),
    ];
    const recs = generateGemstoneRecommendations(buildChart({ planets }));
    const marsRec = recs.find(r => r.planetId === 2)!;
    expect(marsRec.needScore).toBeGreaterThanOrEqual(10);
    expect(marsRec.reasons.some(r => r.toLowerCase().includes('dusthana') || r.includes('house'))).toBe(true);
  });

  it('weak shadbala increases score', () => {
    const shadbala = [
      makeShadbala('Sun', 20), // Very weak
      makeShadbala('Moon', 80),
      makeShadbala('Mars', 80),
      makeShadbala('Mercury', 80),
      makeShadbala('Jupiter', 80),
      makeShadbala('Venus', 80),
      makeShadbala('Saturn', 80),
      makeShadbala('Rahu', 80),
      makeShadbala('Ketu', 80),
    ];
    const recs = generateGemstoneRecommendations(buildChart({ shadbala }));
    const sunRec = recs.find(r => r.planetId === 0)!;
    expect(sunRec.needScore).toBeGreaterThanOrEqual(20);
    expect(sunRec.reasons.some(r => r.toLowerCase().includes('shadbala') || r.toLowerCase().includes('strength'))).toBe(true);
  });

  it('results are sorted by needScore descending', () => {
    const recs = generateGemstoneRecommendations(buildChart());
    for (let i = 1; i < recs.length; i++) {
      expect(recs[i].needScore).toBeLessThanOrEqual(recs[i - 1].needScore);
    }
  });

  it('Saturn gets Blue Sapphire caution', () => {
    const recs = generateGemstoneRecommendations(buildChart());
    const saturnRec = recs.find(r => r.planetId === 6)!;
    expect(saturnRec.cautions.some(c => c.toLowerCase().includes('sapphire') || c.toLowerCase().includes('neelam') || c.toLowerCase().includes('trial'))).toBe(true);
  });

  it('Rahu/Ketu get shadow planet caution', () => {
    const recs = generateGemstoneRecommendations(buildChart());
    const rahuRec = recs.find(r => r.planetId === 7)!;
    const ketuRec = recs.find(r => r.planetId === 8)!;
    expect(rahuRec.cautions.some(c => c.toLowerCase().includes('shadow'))).toBe(true);
    expect(ketuRec.cautions.some(c => c.toLowerCase().includes('shadow'))).toBe(true);
  });

  it('remedy data is populated for every planet', () => {
    const recs = generateGemstoneRecommendations(buildChart());
    for (const rec of recs) {
      expect(rec.remedy).toBeDefined();
      expect(rec.remedy.gemstone).toBeTruthy();
      expect(rec.remedy.beejMantra).toBeTruthy();
    }
  });

  it('need levels map correctly from scores', () => {
    const chart = buildChart();
    const recs = generateGemstoneRecommendations(chart);
    for (const rec of recs) {
      if (rec.needScore >= 60) expect(rec.needLevel).toBe('critical');
      else if (rec.needScore >= 30) expect(rec.needLevel).toBe('recommended');
      else if (rec.needScore >= 10) expect(rec.needLevel).toBe('optional');
      else expect(rec.needLevel).toBe('not_needed');
    }
  });

  it('all-strong chart has mostly low scores', () => {
    const planets = [
      makePlanet(0, 5, 5, { isOwnSign: true }),   // Sun in Leo (own)
      makePlanet(1, 2, 2, { isExalted: true }),    // Moon exalted in Taurus
      makePlanet(2, 10, 10, { isExalted: true }),   // Mars exalted in Capricorn
      makePlanet(3, 6, 6, { isOwnSign: true }),    // Mercury in Virgo (own)
      makePlanet(4, 4, 4, { isExalted: true }),    // Jupiter exalted in Cancer
      makePlanet(5, 12, 12, { isExalted: true }),   // Venus exalted in Pisces
      makePlanet(6, 7, 7, { isExalted: true }),    // Saturn exalted in Libra
      makePlanet(7, 3, 3),                          // Rahu
      makePlanet(8, 9, 9),                          // Ketu
    ];
    const recs = generateGemstoneRecommendations(buildChart({ planets }));
    const highScoreCount = recs.filter(r => r.needScore >= 30).length;
    expect(highScoreCount).toBeLessThanOrEqual(2); // At most Rahu/Ketu might score
  });
});

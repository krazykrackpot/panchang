/**
 * Unit tests for the Detailed Compatibility Report engine
 */
import { describe, it, expect } from 'vitest';
import {
  generateDetailedReport,
  getNadiFromNakshatra,
  detectAspect,
} from '@/lib/matching/detailed-report';
import { analyzeMangalDosha } from '@/lib/kundali/mangal-dosha-engine';
import type { KundaliData, PlanetPosition, HouseCusp, ChartData } from '@/types/kundali';
import type { MatchResult } from '@/lib/matching/ashta-kuta';

// ── Helpers to create mock data ──────────────────────────────

function mockPlanet(id: number, overrides: Partial<PlanetPosition> = {}): PlanetPosition {
  return {
    planet: { id, name: { en: `Planet${id}` }, symbol: '', color: '' },
    longitude: 0,
    latitude: 0,
    speed: 1,
    sign: 1,
    signName: { en: 'Aries' },
    house: 1,
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: '' }, ruler: '', rulerName: { en: '' }, startDeg: 0, endDeg: 13.333, symbol: '', nature: { en: '' } },
    pada: 1,
    degree: '0°0\'0"',
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    ...overrides,
  };
}

function mockChart(overrides: {
  ascSign?: number;
  planets?: Partial<PlanetPosition>[];
  moonNak?: number;
  moonSign?: number;
  marsHouse?: number;
  marsSign?: number;
  jupiterHouse?: number;
  venusHouse?: number;
  venusSign?: number;
} = {}): KundaliData {
  const ascSign = overrides.ascSign ?? 1;
  const planets: PlanetPosition[] = [
    mockPlanet(0, { house: 1, sign: ascSign, longitude: (ascSign - 1) * 30 }), // Sun
    mockPlanet(1, { house: 4, sign: overrides.moonSign ?? 4, longitude: (overrides.moonSign ?? 4 - 1) * 30, nakshatra: { id: overrides.moonNak ?? 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: '' }, ruler: '', rulerName: { en: '' }, startDeg: 0, endDeg: 13.333, symbol: '', nature: { en: '' } }, pada: 1 }), // Moon
    mockPlanet(2, { house: overrides.marsHouse ?? 3, sign: overrides.marsSign ?? 3, longitude: (overrides.marsSign ?? 3 - 1) * 30 + 15 }), // Mars
    mockPlanet(3, { house: 2, sign: 2, longitude: 45 }), // Mercury
    mockPlanet(4, { house: overrides.jupiterHouse ?? 5, sign: 5, longitude: 130 }), // Jupiter
    mockPlanet(5, { house: overrides.venusHouse ?? 6, sign: overrides.venusSign ?? 6, longitude: (overrides.venusSign ?? 6 - 1) * 30 + 15 }), // Venus
    mockPlanet(6, { house: 10, sign: 10, longitude: 285 }), // Saturn
    mockPlanet(7, { house: 11, sign: 11, longitude: 315 }), // Rahu
    mockPlanet(8, { house: 5, sign: 5, longitude: 135 }), // Ketu
  ];

  // Apply custom planet overrides
  if (overrides.planets) {
    for (const po of overrides.planets) {
      const idx = planets.findIndex(p => p.planet.id === po.planet?.id);
      if (idx >= 0) {
        planets[idx] = { ...planets[idx], ...po };
      }
    }
  }

  const houses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: ((ascSign - 1) * 30 + i * 30) % 360,
    sign: ((ascSign - 1 + i) % 12) + 1,
    signName: { en: 'Sign' },
    lord: 'lord',
    lordName: { en: 'Lord' },
  }));

  const chart: ChartData = {
    houses: Array.from({ length: 12 }, (_, i) =>
      planets.filter(p => p.house === i + 1).map(p => p.planet.id)
    ),
    ascendantDeg: (ascSign - 1) * 30,
    ascendantSign: ascSign,
  };

  return {
    birthData: { name: 'Test', date: '2000-01-01', time: '12:00', place: 'Test', lat: 0, lng: 0, timezone: 'UTC', ayanamsha: 'lahiri' },
    ascendant: { degree: (ascSign - 1) * 30, sign: ascSign, signName: { en: 'Aries' } },
    planets,
    houses,
    chart,
    navamshaChart: chart,
    dashas: [],
    shadbala: [],
    ayanamshaValue: 24.1,
    julianDay: 2451545,
  };
}

function mockMatchResult(score: number = 25): MatchResult {
  return {
    totalScore: score,
    maxScore: 36,
    percentage: Math.round((score / 36) * 100),
    verdict: score >= 28 ? 'excellent' : score >= 21 ? 'good' : score >= 18 ? 'average' : score >= 14 ? 'below_average' : 'not_recommended',
    verdictText: { en: 'Good Match' },
    kutas: [
      { name: { en: 'Varna' }, maxPoints: 1, scored: 1, description: { en: 'test' } },
      { name: { en: 'Vashya' }, maxPoints: 2, scored: 2, description: { en: 'test' } },
      { name: { en: 'Tara' }, maxPoints: 3, scored: 3, description: { en: 'test' } },
      { name: { en: 'Yoni' }, maxPoints: 4, scored: 4, description: { en: 'test' } },
      { name: { en: 'Graha Maitri' }, maxPoints: 5, scored: 3, description: { en: 'test' } },
      { name: { en: 'Gana' }, maxPoints: 6, scored: 5, description: { en: 'test' } },
      { name: { en: 'Bhakoot' }, maxPoints: 7, scored: 0, description: { en: 'test' } },
      { name: { en: 'Nadi' }, maxPoints: 8, scored: 8, description: { en: 'test' } },
    ],
    nadiDoshaPresent: false,
  };
}

// ── Tests ────────────────────────────────────────────────────

describe('Mangal Dosha Engine — house severity', () => {
  // Engine house severity: 7,8=severe; 1,4=moderate; 2,12=mild; others=none
  function severityForHouse(house: number, sign: number): string {
    const planets = [
      mockPlanet(0, { house: 1, sign: 1 }),
      mockPlanet(1, { house: 4, sign: 4 }),
      mockPlanet(2, { house, sign }),
      mockPlanet(3, { house: 2, sign: 2 }),
      mockPlanet(4, { house: 5, sign: 5 }),
      mockPlanet(5, { house: 6, sign: 6 }),
      mockPlanet(6, { house: 10, sign: 10 }),
      mockPlanet(7, { house: 11, sign: 11 }),
      mockPlanet(8, { house: 5, sign: 5 }),
    ];
    return analyzeMangalDosha(planets, 1).houseSeverity;
  }

  it('returns severe for Mars in house 7', () => {
    expect(severityForHouse(7, 7)).toBe('severe');
  });

  it('returns severe for Mars in house 8', () => {
    expect(severityForHouse(8, 8)).toBe('severe');
  });

  it('returns moderate for Mars in house 4', () => {
    expect(severityForHouse(4, 4)).toBe('moderate');
  });

  it('returns mild for Mars in house 12', () => {
    expect(severityForHouse(12, 12)).toBe('mild');
  });

  it('returns moderate for Mars in house 1', () => {
    expect(severityForHouse(1, 1)).toBe('moderate');
  });

  it('returns mild for Mars in house 2', () => {
    expect(severityForHouse(2, 2)).toBe('mild');
  });

  it('returns none for Mars in house 3', () => {
    expect(severityForHouse(3, 3)).toBe('none');
  });

  it('returns none for Mars in house 5', () => {
    expect(severityForHouse(5, 5)).toBe('none');
  });
});

describe('Manglik Detection (via engine)', () => {
  it('detects Manglik when Mars is in house 7', () => {
    const chart = mockChart({ marsHouse: 7, marsSign: 7 });
    const result = analyzeMangalDosha(chart.planets, chart.ascendant.sign);
    expect(result.present).toBe(true);
    expect(result.houseSeverity).toBe('severe');
  });

  it('does not detect Manglik when Mars is safe from all 3 reference points', () => {
    // Mars in house 3, sign 3; asc sign 1; moon sign 1 (house from moon: ((3-1+12)%12)+1=3);
    // venus sign 1 (house from venus: 3) — all non-mangal houses
    const chart = mockChart({ marsHouse: 3, marsSign: 3, moonSign: 1, venusSign: 1, venusHouse: 1 });
    const result = analyzeMangalDosha(chart.planets, chart.ascendant.sign);
    expect(result.present).toBe(false);
    expect(result.effectiveSeverity).toBe('none');
  });
});

describe('Manglik Cancellation', () => {
  it('identifies mutual Manglik cancellation', () => {
    const chart1 = mockChart({ marsHouse: 7, marsSign: 7 });
    const chart2 = mockChart({ marsHouse: 8, marsSign: 8 });
    const match = mockMatchResult();
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.manglikAnalysis.cancellations).toContainEqual(
      expect.stringContaining('Both partners have Mangal Dosha')
    );
  });

  it('identifies Jupiter aspect cancellation', () => {
    // Jupiter in house 1 aspects house 5 (5th), house 7 (7th), house 9 (9th)
    // Mars in house 7 — Jupiter aspects it from house 1
    const chart1 = mockChart({ marsHouse: 7, marsSign: 7, jupiterHouse: 1 });
    const chart2 = mockChart({ marsHouse: 3 }); // not manglik
    const match = mockMatchResult();
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.manglikAnalysis.cancellations).toContainEqual(
      expect.stringContaining('Jupiter aspects Mars')
    );
    // Engine produces: "Partner 1: Jupiter aspects Mars (conjunction or 5th/7th/9th aspect), providing protection"
  });
});

describe('Nadi from Nakshatra', () => {
  it('Ashwini (1) = Aadi', () => {
    expect(getNadiFromNakshatra(1)).toBe('aadi');
  });

  it('Bharani (2) = Madhya', () => {
    expect(getNadiFromNakshatra(2)).toBe('madhya');
  });

  it('Krittika (3) = Antya', () => {
    expect(getNadiFromNakshatra(3)).toBe('antya');
  });

  it('Rohini (4) = Antya (zigzag)', () => {
    expect(getNadiFromNakshatra(4)).toBe('antya');
  });

  it('Mrigashira (5) = Madhya', () => {
    expect(getNadiFromNakshatra(5)).toBe('madhya');
  });

  it('Ardra (6) = Aadi', () => {
    expect(getNadiFromNakshatra(6)).toBe('aadi');
  });

  it('Revati (27) = Antya', () => {
    expect(getNadiFromNakshatra(27)).toBe('antya');
  });
});

describe('Aspect Detection', () => {
  it('detects conjunction within 10 degree orb', () => {
    expect(detectAspect(45, 50)).toBe('conjunction');
    expect(detectAspect(0, 8)).toBe('conjunction');
  });

  it('detects opposition within 10 degree orb', () => {
    expect(detectAspect(0, 175)).toBe('opposition');
    expect(detectAspect(90, 270)).toBe('opposition');
  });

  it('detects trine within 8 degree orb', () => {
    expect(detectAspect(0, 118)).toBe('trine');
    expect(detectAspect(0, 124)).toBe('trine');
  });

  it('detects square within 8 degree orb', () => {
    expect(detectAspect(0, 88)).toBe('square');
    expect(detectAspect(0, 95)).toBe('square');
  });

  it('returns null for non-aspect angles', () => {
    expect(detectAspect(0, 45)).toBeNull();
    expect(detectAspect(0, 150)).toBeNull();
  });
});

describe('7th House Analysis', () => {
  it('identifies planets in 7th house', () => {
    // Asc in Aries (1), 7th is Libra (7). Put Venus in house 7.
    const chart1 = mockChart({ ascSign: 1, venusHouse: 7, venusSign: 7 });
    const chart2 = mockChart({ ascSign: 4, marsHouse: 3 });
    const match = mockMatchResult();
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.seventhHouseAnalysis.chart1.planetsIn7th).toContain(5); // Venus
    expect(report.seventhHouseAnalysis.chart1.interpretation).toContain('Venus');
  });
});

describe('Narrative Generation', () => {
  it('generates strengths and challenges', () => {
    const chart1 = mockChart({ moonNak: 1, moonSign: 1, marsHouse: 7 });
    const chart2 = mockChart({ moonNak: 10, moonSign: 5, marsHouse: 3 });
    const match = mockMatchResult(25);
    const report = generateDetailedReport(chart1, chart2, match);

    expect(report.narrativeSummary.strengths.length).toBeGreaterThan(0);
    expect(report.narrativeSummary.overallNarrative.length).toBeGreaterThan(100);
    expect(report.narrativeSummary.advice.length).toBeGreaterThan(0);
  });

  it('reports no Manglik when Mars is safe from all reference points', () => {
    // Ensure Mars is not in mangal house from lagna, moon, or venus
    // Mars sign 3, asc 1 -> house 3 from lagna; moon sign 1 -> house 3 from moon; venus sign 1 -> house 3 from venus
    const chart1 = mockChart({ marsHouse: 3, marsSign: 3, moonSign: 1, venusSign: 1, venusHouse: 1 });
    const chart2 = mockChart({ marsHouse: 5, marsSign: 5, moonSign: 3, venusSign: 3, venusHouse: 3 });
    const match = mockMatchResult(30);
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.manglikAnalysis.chart1HasManglik).toBe(false);
    expect(report.manglikAnalysis.chart2HasManglik).toBe(false);
    expect(report.narrativeSummary.strengths).toContainEqual(
      expect.stringContaining('Manglik')
    );
  });
});

describe('Full Report Integration', () => {
  it('returns complete DetailedMatchReport structure', () => {
    const chart1 = mockChart({ moonNak: 1, moonSign: 1 });
    const chart2 = mockChart({ moonNak: 15, moonSign: 7 });
    const match = mockMatchResult(22);
    const report = generateDetailedReport(chart1, chart2, match);

    // Check all top-level keys exist
    expect(report.ashtaKuta).toBeDefined();
    expect(report.manglikAnalysis).toBeDefined();
    expect(report.nadiAnalysis).toBeDefined();
    expect(report.crossChartAspects).toBeDefined();
    expect(report.seventhHouseAnalysis).toBeDefined();
    expect(report.venusAnalysis).toBeDefined();
    expect(report.narrativeSummary).toBeDefined();

    // Check nadi analysis structure
    expect(['aadi', 'madhya', 'antya']).toContain(report.nadiAnalysis.chart1Nadi);
    expect(['aadi', 'madhya', 'antya']).toContain(report.nadiAnalysis.chart2Nadi);
    expect(typeof report.nadiAnalysis.doshaPresent).toBe('boolean');

    // Check venus analysis structure
    expect(report.venusAnalysis.chart1VenusSign).toBeGreaterThanOrEqual(1);
    expect(report.venusAnalysis.chart1VenusSign).toBeLessThanOrEqual(12);
  });

  it('detects Nadi Dosha when both partners have same nadi', () => {
    // Ashwini (1) = Aadi, Punarvasu (7) = Aadi — same nadi
    const chart1 = mockChart({ moonNak: 1, moonSign: 1 });
    const chart2 = mockChart({ moonNak: 7, moonSign: 4 });
    const match = mockMatchResult(18);
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.nadiAnalysis.chart1Nadi).toBe('aadi');
    expect(report.nadiAnalysis.chart2Nadi).toBe('aadi');
    expect(report.nadiAnalysis.doshaPresent).toBe(true);
  });

  it('no Nadi Dosha when different nadis', () => {
    // Ashwini (1) = Aadi, Bharani (2) = Madhya
    const chart1 = mockChart({ moonNak: 1, moonSign: 1 });
    const chart2 = mockChart({ moonNak: 2, moonSign: 1 });
    const match = mockMatchResult(28);
    const report = generateDetailedReport(chart1, chart2, match);
    expect(report.nadiAnalysis.chart1Nadi).toBe('aadi');
    expect(report.nadiAnalysis.chart2Nadi).toBe('madhya');
    expect(report.nadiAnalysis.doshaPresent).toBe(false);
  });
});

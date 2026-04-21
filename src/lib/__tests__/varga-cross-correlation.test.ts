/**
 * Tests for Varga Deep Cross-Correlation Engine
 */
import { describe, it, expect } from 'vitest';
import type { KundaliData, DivisionalChart, PlanetPosition } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import {
  buildDeepVargaAnalysis,
  computeDignityShifts,
  detectVargottama,
  buildDispositorChain,
  detectParivartana,
  computeSavOverlay,
  getPlanetSign,
  getPlanetHouse,
  getDignity,
  computeAspectsOnKeyHouses,
  detectYogasInDxx,
  traceKeyHouseLords,
  computeArgalaOnKeyHouses,
} from '../tippanni/varga-deep-analysis';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const lt = (en: string): LocaleText => ({ en, hi: en });

function makePlanetPosition(id: number, sign: number, house: number, longitude: number): PlanetPosition {
  return {
    planet: { id, name: lt(`P${id}`), abbr: lt(`P${id}`) },
    longitude,
    latitude: 0,
    speed: 1,
    sign,
    signName: lt(`Sign${sign}`),
    house,
    nakshatra: { id: 1, name: lt('N'), lord: lt('L'), deity: lt('D'), symbol: lt('S') },
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: false,
    isCombust: false,
    isExalted: sign === ({ 0: 1, 1: 2, 2: 10, 3: 6, 4: 4, 5: 12, 6: 7 } as Record<number, number>)[id],
    isDebilitated: false,
    isOwnSign: false,
  };
}

function makeDivisionalChart(
  ascSign: number,
  planetHouseMap: Record<number, number>, // planetId -> 0-based house index
): DivisionalChart {
  const houses: number[][] = Array.from({ length: 12 }, () => []);
  for (const [pid, hIdx] of Object.entries(planetHouseMap)) {
    houses[hIdx].push(Number(pid));
  }
  return {
    division: 'D9',
    label: lt('Navamsha'),
    houses,
    ascendantDeg: (ascSign - 1) * 30,
    ascendantSign: ascSign,
  };
}

function makeMinimalKundali(
  ascSign: number,
  planets: PlanetPosition[],
  divisionalCharts?: Record<string, DivisionalChart>,
): KundaliData {
  return {
    birthData: {
      name: 'Test',
      date: '2000-01-01',
      time: '12:00',
      place: 'Test',
      lat: 28.6,
      lng: 77.2,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: (ascSign - 1) * 30, sign: ascSign, signName: lt(`Sign${ascSign}`) },
    planets,
    houses: Array.from({ length: 12 }, (_, i) => ({
      house: i + 1,
      degree: 0,
      sign: ((ascSign - 1 + i) % 12) + 1,
      signName: lt(''),
      lord: '',
      lordName: lt(''),
    })),
    chart: {
      houses: Array.from({ length: 12 }, () => []),
      ascendantDeg: 0,
      ascendantSign: ascSign,
    },
    navamshaChart: {
      houses: Array.from({ length: 12 }, () => []),
      ascendantDeg: 0,
      ascendantSign: ascSign,
    },
    divisionalCharts,
    dashas: [],
    shadbala: [],
    ayanamshaValue: 23.85,
    julianDay: 2451545,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('buildDeepVargaAnalysis', () => {
  it('returns null for missing chart (non-D9)', () => {
    const kundali = makeMinimalKundali(1, []);
    const result = buildDeepVargaAnalysis(kundali, 'D10');
    expect(result).toBeNull();
  });

  it('returns null when divisionalCharts is undefined (non-D9)', () => {
    const kundali = makeMinimalKundali(1, [], undefined);
    const result = buildDeepVargaAnalysis(kundali, 'D10');
    expect(result).toBeNull();
  });

  it('returns a result for D9 via navamshaChart fallback', () => {
    // D9 is not in divisionalCharts, but navamshaChart exists
    const kundali = makeMinimalKundali(1, []);
    const result = buildDeepVargaAnalysis(kundali, 'D9');
    expect(result).not.toBeNull();
    expect(result?.chartId).toBe('D9');
    expect(result?.domain).toBe('marriage');
  });

  it('returns a valid DeepVargaResult for an existing chart', () => {
    const d9 = makeDivisionalChart(4, { 0: 0, 1: 3, 2: 6, 3: 0, 4: 4, 5: 1, 6: 9, 7: 2, 8: 8 });
    const planets = [
      makePlanetPosition(0, 1, 1, 15),   // Sun in Aries
      makePlanetPosition(1, 4, 4, 105),  // Moon in Cancer
      makePlanetPosition(2, 8, 8, 225),  // Mars in Scorpio
      makePlanetPosition(3, 1, 1, 10),   // Mercury in Aries
      makePlanetPosition(4, 9, 9, 255),  // Jupiter in Sagittarius
      makePlanetPosition(5, 2, 2, 45),   // Venus in Taurus
      makePlanetPosition(6, 10, 10, 285),// Saturn in Capricorn
      makePlanetPosition(7, 3, 3, 75),   // Rahu in Gemini
      makePlanetPosition(8, 9, 9, 255),  // Ketu in Sagittarius
    ];
    const kundali = makeMinimalKundali(1, planets, { D9: d9 });
    const result = buildDeepVargaAnalysis(kundali, 'D9');

    expect(result).not.toBeNull();
    expect(result!.chartId).toBe('D9');
    expect(result!.domain).toBe('marriage');
    expect(result!.crossCorrelation.dignityShifts).toHaveLength(9);
    expect(result!.crossCorrelation.pushkaraChecks).toHaveLength(9);
    expect(result!.crossCorrelation.gandantaChecks).toHaveLength(9);
    expect(result!.promiseDelivery).toBeDefined();
    expect(result!.promiseDelivery.d1Promise).toBeGreaterThanOrEqual(0);
    expect(result!.promiseDelivery.d1Promise).toBeLessThanOrEqual(100);
    expect(result!.narrative.en).toBeTruthy();
  });
});

describe('computeDignityShifts', () => {
  it('computes dignity shifts for all 9 planets', () => {
    const d9 = makeDivisionalChart(1, { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6, 7: 7, 8: 8 });
    const planets = Array.from({ length: 9 }, (_, i) =>
      makePlanetPosition(i, ((i) % 12) + 1, i + 1, i * 30 + 15)
    );
    const kundali = makeMinimalKundali(1, planets);
    const shifts = computeDignityShifts(kundali, d9);

    expect(shifts).toHaveLength(9);
    for (const s of shifts) {
      expect(s.planetId).toBeGreaterThanOrEqual(0);
      expect(s.planetId).toBeLessThanOrEqual(8);
      expect(['improved', 'same', 'declined', 'mixed']).toContain(s.shift);
      expect(s.narrative.en).toBeTruthy();
      expect(s.narrative.hi).toBeTruthy();
    }
  });

  it('marks vargottama when D1 and Dxx signs match', () => {
    // Sun in Aries in D1, also in house 0 (Aries) of D9 with Aries ascendant
    const d9 = makeDivisionalChart(1, { 0: 0 }); // Sun in house 0 = sign 1 (Aries)
    const planets = [makePlanetPosition(0, 1, 1, 15)]; // Sun in Aries in D1
    const kundali = makeMinimalKundali(1, planets);
    const shifts = computeDignityShifts(kundali, d9);

    const sunShift = shifts.find(s => s.planetId === 0);
    expect(sunShift).toBeDefined();
    expect(sunShift!.isVargottama).toBe(true);
    expect(sunShift!.d1Sign).toBe(1);
    expect(sunShift!.dxxSign).toBe(1);
  });
});

describe('detectVargottama', () => {
  it('detects vargottama correctly', () => {
    // Aries ascendant D9: house 0 = Aries(1), house 3 = Cancer(4)
    const d9 = makeDivisionalChart(1, { 0: 0, 1: 3, 4: 8 });
    const planets = [
      makePlanetPosition(0, 1, 1, 15),   // Sun Aries — vargottama (D9 house 0 = Aries)
      makePlanetPosition(1, 4, 4, 105),  // Moon Cancer — vargottama (D9 house 3 = Cancer)
      makePlanetPosition(4, 2, 5, 45),   // Jupiter Taurus — NOT vargottama (D9 house 8 = Scorpio)
    ];
    const kundali = makeMinimalKundali(1, planets);
    const vargottama = detectVargottama(kundali, d9);

    expect(vargottama).toContain(0); // Sun
    expect(vargottama).toContain(1); // Moon
    expect(vargottama).not.toContain(4); // Jupiter: D1=Taurus(2), D9=Scorpio(8)
  });

  it('returns empty array when no vargottama exists', () => {
    const d9 = makeDivisionalChart(7, { 0: 0 }); // Asc = Libra, house 0 = Libra(7)
    const planets = [makePlanetPosition(0, 1, 1, 15)]; // Sun in Aries in D1
    const kundali = makeMinimalKundali(1, planets);
    const vargottama = detectVargottama(kundali, d9);
    expect(vargottama).toHaveLength(0);
  });
});

describe('buildDispositorChain', () => {
  it('terminates at self-disposed planet', () => {
    // Aries asc: house 0=Aries. Mars(2) in house 0 = Aries (own sign → self-disposed)
    const chart = makeDivisionalChart(1, { 2: 0 });
    const chain = buildDispositorChain(chart, 2);

    expect(chain.isCircular).toBe(false);
    expect(chain.finalDispositor).toBe(2); // Mars is self-disposed in Aries
    expect(chain.chain.length).toBeGreaterThanOrEqual(1);
  });

  it('detects circular dispositor loop', () => {
    // Aries asc (sign 1):
    // house 0 = Aries(1), lord = Mars(2)
    // house 1 = Taurus(2), lord = Venus(5)
    // house 6 = Libra(7), lord = Venus(5)
    // Mars(2) in house 1 = Taurus → dispositor Venus(5)
    // Venus(5) in house 0 = Aries → dispositor Mars(2) → circular
    const chart = makeDivisionalChart(1, { 2: 1, 5: 0 });
    const chain = buildDispositorChain(chart, 2);

    expect(chain.isCircular).toBe(true);
    expect(chain.finalDispositor).toBeNull();
  });

  it('does not loop infinitely even with complex chains', () => {
    // Chain: Sun(0) in Leo(5) = own sign → self-disposed immediately
    // Asc = Leo(5), house 0 = Leo
    const chart = makeDivisionalChart(5, { 0: 0, 1: 3, 2: 5, 3: 1, 4: 4, 5: 2, 6: 8 });
    const chain = buildDispositorChain(chart, 0);
    expect(chain.chain.length).toBeLessThan(20);
    expect(chain.finalDispositor).toBe(0); // Sun is self-disposed in Leo
  });

  it('handles Rahu/Ketu dispositor chains', () => {
    // Rahu(7) in house 2 = Gemini(3) with Aries(1) asc → lord Mercury(3)
    const chart = makeDivisionalChart(1, { 7: 2, 3: 5 }); // Mercury in house 5 = Virgo(6)
    const chain = buildDispositorChain(chart, 7);
    // Rahu → Mercury(lord of Gemini) → Mercury in Virgo (own sign) → self-disposed
    expect(chain.chain.length).toBeGreaterThanOrEqual(2);
    expect(chain.finalDispositor).toBe(3); // Mercury self-disposed in Virgo
  });
});

describe('detectParivartana', () => {
  it('detects mutual exchange of signs', () => {
    // Aries(1) asc: house 0=Aries(1), house 1=Taurus(2)
    // Mars(2, lord of Aries) in house 1 = Taurus
    // Venus(5, lord of Taurus) in house 0 = Aries
    // → Mars in Venus's sign, Venus in Mars's sign = parivartana
    const chart = makeDivisionalChart(1, { 2: 1, 5: 0 });
    const parivartanas = detectParivartana(chart);

    expect(parivartanas.length).toBeGreaterThanOrEqual(1);
    const exchange = parivartanas.find(
      p => (p.planet1Id === 2 && p.planet2Id === 5) || (p.planet1Id === 5 && p.planet2Id === 2)
    );
    expect(exchange).toBeDefined();
  });

  it('returns empty array when no exchange exists', () => {
    // All planets in own signs — no exchange
    const chart = makeDivisionalChart(1, { 2: 0 }); // Mars in Aries (own sign, no exchange partner)
    const parivartanas = detectParivartana(chart);
    expect(parivartanas).toHaveLength(0);
  });
});

describe('computeSavOverlay', () => {
  it('handles missing ashtakavarga gracefully', () => {
    const kundali = makeMinimalKundali(1, []);
    const chart = makeDivisionalChart(1, { 0: 0 });
    const overlay = computeSavOverlay(kundali, chart);
    expect(overlay).toHaveLength(0);
  });

  it('returns SAV data for occupied signs', () => {
    const chart = makeDivisionalChart(1, { 0: 0, 1: 3 }); // Sun in house 0 (Aries), Moon in house 3 (Cancer)
    const savTable = [35, 25, 20, 28, 30, 22, 18, 32, 27, 26, 24, 31]; // 12 signs
    const kundali = makeMinimalKundali(1, [
      makePlanetPosition(0, 1, 1, 15),
      makePlanetPosition(1, 4, 4, 105),
    ]);
    kundali.ashtakavarga = {
      bpiTable: [],
      savTable,
      planetNames: [],
    };

    const overlay = computeSavOverlay(kundali, chart);
    expect(overlay.length).toBeGreaterThanOrEqual(1);

    // Aries (sign 1) should have 35 bindus = strong
    const ariesEntry = overlay.find(o => o.sign === 1);
    expect(ariesEntry).toBeDefined();
    expect(ariesEntry!.bindus).toBe(35);
    expect(ariesEntry!.quality).toBe('strong');

    // Cancer (sign 4) should have 28 bindus = average
    const cancerEntry = overlay.find(o => o.sign === 4);
    expect(cancerEntry).toBeDefined();
    expect(cancerEntry!.bindus).toBe(28);
    expect(cancerEntry!.quality).toBe('average');
  });
});

describe('getDignity', () => {
  it('returns exalted for Sun in Aries', () => {
    expect(getDignity(0, 1)).toBe('exalted');
  });

  it('returns debilitated for Sun in Libra', () => {
    expect(getDignity(0, 7)).toBe('debilitated');
  });

  it('returns own for Mars in Aries', () => {
    expect(getDignity(2, 1)).toBe('own');
  });

  it('returns neutral for Rahu/Ketu', () => {
    expect(getDignity(7, 5)).toBe('neutral');
    expect(getDignity(8, 10)).toBe('neutral');
  });
});

describe('aspect analysis', () => {
  it('detects 7th aspect on key houses', () => {
    // Mars(2) in house 0 (1st house). 7th from 1st = 7th house.
    // So Mars aspects the 7th house.
    const chart = makeDivisionalChart(1, { 2: 0 });
    const aspects = computeAspectsOnKeyHouses(chart, 'marriage');
    // Key houses for marriage: [1, 7, 2]
    const h7Aspects = aspects.find(a => a.house === 7);
    expect(h7Aspects).toBeDefined();
    // Mars in house 1 aspects house 7 (offset 6 from 0-based, which is offset 7 from 1-based)
    expect(h7Aspects!.aspectingPlanets.some(ap => ap.id === 2)).toBe(true);
  });
});

describe('yoga detection in Dxx', () => {
  it('detects Budhaditya yoga (Sun+Mercury conjunction)', () => {
    const chart = makeDivisionalChart(1, { 0: 0, 3: 0 }); // Sun and Mercury in same house
    const yogas = detectYogasInDxx(chart);
    const budhaditya = yogas.find(y => y.name === 'Budhaditya');
    expect(budhaditya).toBeDefined();
    expect(budhaditya!.planets).toContain(0);
    expect(budhaditya!.planets).toContain(3);
  });
});

describe('key house lords', () => {
  it('traces lords for marriage domain', () => {
    const chart = makeDivisionalChart(1, { 5: 3 }); // Venus in house 3 (Cancer)
    const lords = traceKeyHouseLords(chart, 'marriage');
    // Marriage key houses: [1, 7, 2]
    expect(lords.length).toBe(3);
    // 7th house from Aries = Libra(7), lord = Venus(5)
    const h7Lord = lords.find(l => l.house === 7);
    expect(h7Lord).toBeDefined();
    expect(h7Lord!.lordId).toBe(5); // Venus
  });
});

describe('argala computation', () => {
  it('identifies supporting and obstructing planets', () => {
    // Planets in 2nd from target house create argala (support)
    const chart = makeDivisionalChart(1, { 4: 1 }); // Jupiter in house 1 (2nd from house 0)
    const argala = computeArgalaOnKeyHouses(
      makeMinimalKundali(1, []),
      chart,
      'marriage',
    );
    // For house 1 (1st key house of marriage), 2nd from it = house 2 (index 1)
    const h1 = argala.find(a => a.house === 1);
    expect(h1).toBeDefined();
    expect(h1!.supporting).toContain(4); // Jupiter in 2nd from house 1
  });
});

import { describe, it, expect } from 'vitest';
import { detectChartPatterns, generateVedicProfile } from '../kundali/vedic-profile';
import type { KundaliData, PlanetPosition, HouseCusp, DashaEntry } from '@/types/kundali';

// Helper to create a minimal kundali for testing
function makeKundali(overrides: Partial<KundaliData> = {}): KundaliData {
  const defaultPlanets: PlanetPosition[] = [
    makePlanet(0, 5, 5, 10, false, false, false, false, false),  // Sun in Leo (own sign), house 5
    makePlanet(1, 4, 4, 1, false, false, false, false, false),    // Moon in Cancer, house 1 (to be overridden)
    makePlanet(2, 1, 1, 10, false, false, false, false, false),   // Mars in Aries (own sign), house 10
    makePlanet(3, 6, 6, 3, false, false, false, false, false),    // Mercury in Virgo, house 3
    makePlanet(4, 4, 4, 1, false, false, true, false, false),     // Jupiter in Cancer (exalted), house 1
    makePlanet(5, 12, 12, 9, false, false, true, false, false),   // Venus in Pisces (exalted), house 9
    makePlanet(6, 7, 7, 4, false, false, false, false, false),    // Saturn in Libra, house 4
    makePlanet(7, 1, 1, 10, false, false, false, false, false),   // Rahu in Aries, house 10
    makePlanet(8, 7, 7, 4, false, false, false, false, false),    // Ketu in Libra, house 4
  ];

  const defaultHouses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: i * 30,
    sign: ((i) % 12) + 1,
    signName: { en: `Sign${i+1}`, hi: `राशि${i+1}`, sa: `राशि${i+1}` },
    lord: 'Sun',
    lordName: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
  }));

  const defaultDashas: DashaEntry[] = [
    {
      planet: 'Saturn',
      planetName: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
      startDate: '2020-01-01',
      endDate: '2039-01-01',
      level: 'maha',
      subPeriods: [
        {
          planet: 'Mercury',
          planetName: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
          startDate: '2025-01-01',
          endDate: '2027-09-01',
          level: 'antar',
        },
      ],
    },
  ];

  return {
    birthData: {
      name: 'Test Person',
      date: '1990-08-15',
      time: '14:30',
      place: 'Corseaux, Switzerland',
      lat: 46.47,
      lng: 6.78,
      timezone: 'Europe/Zurich',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 15, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' } },
    planets: overrides.planets || defaultPlanets,
    houses: overrides.houses || defaultHouses,
    chart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 15, ascendantSign: 1 },
    navamshaChart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 15, ascendantSign: 1 },
    dashas: overrides.dashas || defaultDashas,
    shadbala: [],
    ayanamshaValue: 24.1,
    julianDay: 2448086.5,
    ...overrides,
  };
}

function makePlanet(
  id: number, sign: number, signIdx: number, house: number,
  retrograde: boolean, combust: boolean, exalted: boolean,
  debilitated: boolean, ownSign: boolean
): PlanetPosition {
  const PLANET_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
    0: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्यः' },
    1: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्रः' },
    2: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' },
    3: { en: 'Mercury', hi: 'बुध', sa: 'बुधः' },
    4: { en: 'Jupiter', hi: 'बृहस्पति', sa: 'बृहस्पतिः' },
    5: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्रः' },
    6: { en: 'Saturn', hi: 'शनि', sa: 'शनिः' },
    7: { en: 'Rahu', hi: 'राहु', sa: 'राहुः' },
    8: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
  };
  const SIGN_NAMES: Record<number, { en: string; hi: string; sa: string }> = {
    1: { en: 'Aries', hi: 'मेष', sa: 'मेषः' }, 2: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
    3: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' }, 4: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' },
    5: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' }, 6: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
    7: { en: 'Libra', hi: 'तुला', sa: 'तुला' }, 8: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
    9: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' }, 10: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
    11: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' }, 12: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
  };
  return {
    planet: { id, name: PLANET_NAMES[id] || { en: '', hi: '', sa: '' }, symbol: '', color: '' },
    longitude: sign * 30 + 15,
    latitude: 0,
    speed: 1,
    sign,
    signName: SIGN_NAMES[sign] || { en: '', hi: '', sa: '' },
    house,
    nakshatra: { id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' }, deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनीकुमारौ' }, ruler: 'Ketu', rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' }, startDeg: 0, endDeg: 13.333, symbol: '🐴', nature: { en: 'Swift, Light', hi: 'क्षिप्र, लघु', sa: 'क्षिप्रम्' } },
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: retrograde,
    isCombust: combust,
    isExalted: exalted,
    isDebilitated: debilitated,
    isOwnSign: ownSign,
  };
}

describe('detectChartPatterns', () => {
  it('detects stellium (3+ planets in one house)', () => {
    const planets = [
      makePlanet(0, 8, 8, 10, false, false, false, false, false),
      makePlanet(1, 8, 8, 10, false, false, false, false, false),
      makePlanet(2, 8, 8, 10, false, false, false, false, true),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 4, 4, 1, false, false, true, false, false),
      makePlanet(5, 12, 12, 9, false, false, true, false, false),
      makePlanet(6, 7, 7, 4, false, false, false, false, false),
      makePlanet(7, 1, 1, 7, false, false, false, false, false),
      makePlanet(8, 7, 7, 1, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const patterns = detectChartPatterns(k);
    const stellium = patterns.find(p => p.type === 'stellium');
    expect(stellium).toBeDefined();
    expect(stellium!.score).toBe(90);
    expect(stellium!.houses).toContain(10);
    // Stellium should be highest priority
    expect(patterns[0].type).toBe('stellium');
  });

  it('detects exalted lagna lord', () => {
    // Aries lagna → Mars is lagna lord. Mars exalted in Capricorn
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 4, 4, 4, false, false, false, false, false),
      makePlanet(2, 10, 10, 7, false, false, true, false, false), // Mars exalted
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 12, 12, 9, false, false, false, false, false),
      makePlanet(6, 11, 11, 8, false, false, false, false, false),
      makePlanet(7, 3, 3, 12, false, false, false, false, false),
      makePlanet(8, 9, 9, 6, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const patterns = detectChartPatterns(k);
    const dignified = patterns.find(p => p.type === 'dignifiedLagnaLord');
    expect(dignified).toBeDefined();
    expect(dignified!.score).toBe(70);
  });

  it('detects same lagna and moon sign', () => {
    // Aries lagna, Moon in Aries
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 1, 1, 1, false, false, false, false, false), // Moon in Aries = lagna sign
      makePlanet(2, 8, 8, 5, false, false, false, false, false),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 3, 3, 12, false, false, false, false, false),
      makePlanet(6, 11, 11, 8, false, false, false, false, false),
      makePlanet(7, 3, 3, 12, false, false, false, false, false),
      makePlanet(8, 9, 9, 6, false, false, false, false, false),
    ];
    const k = makeKundali({
      planets,
      ascendant: { degree: 15, sign: 1, signName: { en: 'Aries', hi: 'मेष', sa: 'मेषः' } },
    });
    const patterns = detectChartPatterns(k);
    const same = patterns.find(p => p.type === 'sameLagnaMoon');
    expect(same).toBeDefined();
  });

  it('returns patterns sorted by score descending', () => {
    const k = makeKundali();
    const patterns = detectChartPatterns(k);
    for (let i = 1; i < patterns.length; i++) {
      expect(patterns[i - 1].score).toBeGreaterThanOrEqual(patterns[i].score);
    }
  });
});

describe('generateVedicProfile', () => {
  it('returns a complete VedicProfile with all sections', () => {
    const k = makeKundali();
    const profile = generateVedicProfile(k, 'en');
    expect(profile.hook).toBeTruthy();
    expect(profile.coreIdentity.lagna).toBeTruthy();
    expect(profile.coreIdentity.moon).toBeTruthy();
    expect(profile.standout).toBeTruthy();
    expect(profile.nakshatraInsight).toBeTruthy();
    expect(profile.dashaContext).toBeTruthy();
    expect(profile.strengthTable.length).toBeGreaterThan(0);
    expect(profile.personName).toBe('Test Person');
  });

  it('returns Hindi content when locale is hi', () => {
    const k = makeKundali();
    const profile = generateVedicProfile(k, 'hi');
    // Hindi profile should contain Devanagari characters
    expect(profile.coreIdentity.lagna).toMatch(/[\u0900-\u097F]/);
  });

  it('omits doshaSection when no doshas present', () => {
    // Mars in 10H (not a manglik house: 1,2,4,7,8,12)
    // Rahu in 3H, Ketu in 9H — planets spread on both sides (no Kaal Sarpa)
    const planets = [
      makePlanet(0, 5, 5, 5, false, false, false, false, true),
      makePlanet(1, 2, 2, 11, false, false, false, false, false),
      makePlanet(2, 1, 1, 10, false, false, false, false, true),
      makePlanet(3, 6, 6, 3, false, false, false, false, false),
      makePlanet(4, 9, 9, 6, false, false, false, false, false),
      makePlanet(5, 3, 3, 9, false, false, false, false, false),
      makePlanet(6, 11, 11, 5, false, false, false, false, false),
      makePlanet(7, 3, 3, 3, false, false, false, false, false),
      makePlanet(8, 9, 9, 9, false, false, false, false, false),
    ];
    const k = makeKundali({ planets });
    const profile = generateVedicProfile(k, 'en');
    expect(profile.doshaSection).toBeNull();
  });
});

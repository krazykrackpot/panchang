/**
 * Domain Timeline Engine Tests
 */

import { describe, it, expect } from 'vitest';
import { computeDomainTimeline, type TimelineInput } from '@/lib/kundali/domain-synthesis/timeline';
import type { DomainConfig } from '@/lib/kundali/domain-synthesis/types';
import type { KundaliData, DashaEntry, PlanetPosition, HouseCusp } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const MOCK_DOMAIN_CONFIG: DomainConfig = {
  id: 'career',
  name: { en: 'Career', hi: 'करियर', sa: 'व्यवसायः' },
  vedicName: { en: 'Karma', hi: 'कर्म', sa: 'कर्म' },
  icon: 'saturn',
  primaryHouses: [10, 6],
  secondaryHouses: [1, 2, 7, 11],
  primaryPlanets: [0, 6, 3], // Sun, Saturn, Mercury
  relevantYogaCategories: ['raja', 'career', 'authority'],
  relevantDoshas: ['shani_dosha', 'kaal_sarpa'],
  divisionalCharts: ['D10'],
  jaiminiKarakas: ['AmK'],
  weights: {
    houseStrength: 0.20,
    lordPlacement: 0.20,
    occupantsAspects: 0.15,
    yogas: 0.15,
    doshas: 0.10,
    dashaActivation: 0.10,
    vargaConfirmation: 0.10,
  },
};

function makePlanet(id: number, sign: number, house: number, longitude: number): PlanetPosition {
  return {
    planet: { id, name: { en: ['Sun','Moon','Mars','Mercury','Jupiter','Venus','Saturn','Rahu','Ketu'][id], hi: '' }, symbol: '', color: '' },
    longitude,
    latitude: 0,
    speed: 1,
    sign,
    signName: { en: `Sign${sign}`, hi: '' },
    house,
    nakshatra: { id: 1, name: { en: '', hi: '', sa: '' }, deity: { en: '', hi: '', sa: '' }, ruler: '' },
    pada: 1,
    degree: '10°00\'00"',
    isRetrograde: id === 7 || id === 8,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
  };
}

function makeHouseCusp(house: number, sign: number, lord: string): HouseCusp {
  return {
    house,
    degree: (sign - 1) * 30,
    sign,
    signName: { en: `Sign${sign}`, hi: '' },
    lord,
    lordName: { en: lord, hi: '' },
  };
}

/** Create a minimal KundaliData with the fields timeline engine needs. */
function makeMockKundali(opts?: {
  dashas?: DashaEntry[];
  planets?: PlanetPosition[];
  houses?: HouseCusp[];
  ascSign?: number;
}): KundaliData {
  const ascSign = opts?.ascSign ?? 1; // Aries ascendant

  const defaultPlanets: PlanetPosition[] = [
    makePlanet(0, 5, 5, 130),   // Sun in Leo, 5th house
    makePlanet(1, 4, 4, 100),   // Moon in Cancer, 4th house
    makePlanet(2, 1, 1, 15),    // Mars in Aries, 1st house
    makePlanet(3, 6, 6, 165),   // Mercury in Virgo, 6th house
    makePlanet(4, 3, 3, 75),    // Jupiter in Gemini, 3rd house
    makePlanet(5, 7, 7, 195),   // Venus in Libra, 7th house
    makePlanet(6, 10, 10, 280), // Saturn in Capricorn, 10th house
    makePlanet(7, 9, 9, 260),   // Rahu in Sagittarius, 9th house
    makePlanet(8, 3, 3, 80),    // Ketu in Gemini, 3rd house
  ];

  const defaultHouses: HouseCusp[] = [
    makeHouseCusp(1, 1, 'Mars'),
    makeHouseCusp(2, 2, 'Venus'),
    makeHouseCusp(3, 3, 'Mercury'),
    makeHouseCusp(4, 4, 'Moon'),
    makeHouseCusp(5, 5, 'Sun'),
    makeHouseCusp(6, 6, 'Mercury'),
    makeHouseCusp(7, 7, 'Venus'),
    makeHouseCusp(8, 8, 'Mars'),
    makeHouseCusp(9, 9, 'Jupiter'),
    makeHouseCusp(10, 10, 'Saturn'),
    makeHouseCusp(11, 11, 'Saturn'),
    makeHouseCusp(12, 12, 'Jupiter'),
  ];

  return {
    birthData: {
      name: 'Test',
      date: '1990-01-01',
      time: '12:00',
      place: 'Test City',
      lat: 28.6,
      lng: 77.2,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 5, sign: ascSign, signName: { en: 'Aries', hi: 'मेष' } },
    planets: opts?.planets ?? defaultPlanets,
    houses: opts?.houses ?? defaultHouses,
    chart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 5, ascendantSign: ascSign },
    navamshaChart: { houses: Array.from({ length: 12 }, () => []), ascendantDeg: 0, ascendantSign: 1 },
    dashas: opts?.dashas ?? [],
    shadbala: [],
    ayanamshaValue: 24.1,
    julianDay: 2447892.5,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('computeDomainTimeline', () => {
  const baseDate = new Date('2026-04-12');

  it('returns a sorted array', () => {
    const kundali = makeMockKundali({
      dashas: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2027-01-15',
          endDate: '2030-01-15',
          level: 'maha',
          subPeriods: [
            {
              planet: 'Mercury',
              planetName: { en: 'Mercury', hi: 'बुध' },
              startDate: '2027-06-01',
              endDate: '2028-06-01',
              level: 'antar',
            },
            {
              planet: 'Venus',
              planetName: { en: 'Venus', hi: 'शुक्र' },
              startDate: '2028-06-01',
              endDate: '2029-09-01',
              level: 'antar',
            },
          ],
        },
      ],
    });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    // Verify sorting
    for (let i = 1; i < result.length; i++) {
      expect(result[i].startDate >= result[i - 1].startDate).toBe(true);
    }
  });

  it('finds dasha transitions within window', () => {
    // Saturn lords 10th house (career primary) in our mock
    const kundali = makeMockKundali({
      dashas: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2027-03-01',
          endDate: '2030-03-01',
          level: 'maha',
          subPeriods: [
            {
              planet: 'Mercury',
              planetName: { en: 'Mercury', hi: 'बुध' },
              startDate: '2027-06-15',
              endDate: '2028-06-15',
              level: 'antar',
            },
          ],
        },
      ],
    });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    const dashaTriggers = result.filter(t => t.triggerType === 'dasha_change');
    expect(dashaTriggers.length).toBeGreaterThan(0);

    // Saturn maha should be found (lords 10th house, career primary)
    const saturnTrigger = dashaTriggers.find(t => t.planets.includes(6));
    expect(saturnTrigger).toBeDefined();
    expect(saturnTrigger!.startDate).toBe('2027-03-01');
  });

  it('produces non-empty headlines in en and hi', () => {
    const kundali = makeMockKundali({
      dashas: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2027-01-01',
          endDate: '2030-01-01',
          level: 'maha',
        },
      ],
    });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    for (const trigger of result) {
      expect(trigger.description.en).toBeTruthy();
      expect(typeof trigger.description.en).toBe('string');
      expect(trigger.description.en!.length).toBeGreaterThan(5);
      // Hindi should also be present
      expect(trigger.description.hi).toBeTruthy();
    }
  });

  it('handles empty dasha list gracefully', () => {
    const kundali = makeMockKundali({ dashas: [] });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    // Should still return transit triggers (no crash)
    expect(Array.isArray(result)).toBe(true);
    // No dasha triggers
    const dashaTriggers = result.filter(t => t.triggerType === 'dasha_change');
    expect(dashaTriggers.length).toBe(0);
  });

  it('limits to yearsAhead window', () => {
    // Dasha starting in 8 years should NOT appear with yearsAhead=3
    const kundali = makeMockKundali({
      dashas: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2034-01-01',
          endDate: '2037-01-01',
          level: 'maha',
        },
      ],
    });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 3,
    });

    const dashaTriggers = result.filter(t => t.triggerType === 'dasha_change');
    expect(dashaTriggers.length).toBe(0);

    // All triggers should be within 3 years
    const cutoff = '2029-04-12';
    for (const trigger of result) {
      expect(trigger.startDate <= cutoff).toBe(true);
    }
  });

  it('generates transit triggers for slow planets in domain houses', () => {
    // Saturn is in sign 10 (Capricorn), 10th house — career primary house
    const kundali = makeMockKundali();

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    const transitTriggers = result.filter(t => t.triggerType === 'transit');
    expect(transitTriggers.length).toBeGreaterThan(0);
  });

  it('generates eclipse triggers when domain houses overlap nodal axis', () => {
    // Put Rahu in house 10 (career primary) to trigger eclipse detection
    const planets = [
      makePlanet(0, 5, 5, 130),
      makePlanet(1, 4, 4, 100),
      makePlanet(2, 1, 1, 15),
      makePlanet(3, 6, 6, 165),
      makePlanet(4, 3, 3, 75),
      makePlanet(5, 7, 7, 195),
      makePlanet(6, 10, 10, 280),
      makePlanet(7, 10, 10, 275), // Rahu in 10th house
      makePlanet(8, 4, 4, 95),    // Ketu in 4th house
    ];

    const kundali = makeMockKundali({ planets });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      yearsAhead: 5,
    });

    // Should have eclipse-related triggers (dasha_transit_confluence)
    const eclipseTriggers = result.filter(t => t.triggerType === 'dasha_transit_confluence');
    expect(eclipseTriggers.length).toBeGreaterThan(0);
    // Each should involve Rahu + Ketu
    for (const t of eclipseTriggers) {
      expect(t.planets).toContain(7);
      expect(t.planets).toContain(8);
    }
  });

  it('defaults to 5 years when yearsAhead not specified', () => {
    const kundali = makeMockKundali({
      dashas: [
        {
          planet: 'Saturn',
          planetName: { en: 'Saturn', hi: 'शनि' },
          startDate: '2030-06-01',
          endDate: '2033-06-01',
          level: 'maha',
        },
      ],
    });

    const result = computeDomainTimeline({
      domainConfig: MOCK_DOMAIN_CONFIG,
      kundali,
      currentDate: baseDate,
      // yearsAhead not provided — should default to 5
    });

    // Dasha in 2030 is within 5 years of 2026
    const dashaTriggers = result.filter(t => t.triggerType === 'dasha_change');
    expect(dashaTriggers.length).toBeGreaterThan(0);
  });
});

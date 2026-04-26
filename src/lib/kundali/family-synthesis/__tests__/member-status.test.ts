import { describe, it, expect } from 'vitest';
import {
  computeMemberStatus,
  type MemberStatusParams,
  type MemberStatus,
} from '../member-status';
import type { KundaliData, DashaEntry, PlanetPosition } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Helpers to build minimal KundaliData fixtures
// ---------------------------------------------------------------------------

function makePlanet(sign: number, overrides: Partial<PlanetPosition> = {}): PlanetPosition {
  return {
    planet: { id: 0, name: { en: 'Sun' }, symbol: 'Su' } as PlanetPosition['planet'],
    longitude: 0,
    latitude: 0,
    speed: 1,
    sign,
    signName: { en: 'Aries' },
    house: 1,
    nakshatra: { id: 1, name: { en: 'Ashwini' }, deity: { en: '' }, ruler: '', rulerName: { en: '' } } as PlanetPosition['nakshatra'],
    pada: 1,
    degree: '0°00\'00"',
    isRetrograde: false,
    isCombust: false,
    isExalted: false,
    isDebilitated: false,
    isOwnSign: false,
    ...overrides,
  };
}

function makeDasha(planet: string, start: string, end: string, subs?: DashaEntry[]): DashaEntry {
  return {
    planet,
    planetName: { en: planet },
    startDate: start,
    endDate: end,
    level: 'maha' as const,
    subPeriods: subs,
  };
}

function makeAntar(planet: string, start: string, end: string): DashaEntry {
  return {
    planet,
    planetName: { en: planet },
    startDate: start,
    endDate: end,
    level: 'antar' as const,
  };
}

function makeKundali(opts: {
  sunSign?: number;
  moonSign?: number;
  ascSign?: number;
  dashas?: DashaEntry[];
}): KundaliData {
  const sunSign = opts.sunSign ?? 1;
  const moonSign = opts.moonSign ?? 4;  // Cancer default
  const ascSign = opts.ascSign ?? 1;

  return {
    birthData: {
      name: 'Test',
      date: '2000-01-01',
      time: '12:00',
      place: 'Test',
      lat: 0,
      lng: 0,
      timezone: 'UTC',
      ayanamsha: 'lahiri',
    },
    ascendant: { degree: 0, sign: ascSign, signName: { en: 'Aries' } },
    planets: [
      makePlanet(sunSign),   // 0 = Sun
      makePlanet(moonSign),  // 1 = Moon
      makePlanet(1),         // 2 = Mars
      makePlanet(1),         // 3 = Mercury
      makePlanet(1),         // 4 = Jupiter
      makePlanet(1),         // 5 = Venus
      makePlanet(1),         // 6 = Saturn
      makePlanet(1),         // 7 = Rahu
      makePlanet(1),         // 8 = Ketu
    ],
    houses: [],
    chart: { houses: [], ascendantDeg: 0, ascendantSign: ascSign },
    navamshaChart: { houses: [], ascendantDeg: 0, ascendantSign: ascSign },
    dashas: opts.dashas ?? [
      makeDasha('Moon', '2020-01-01', '2030-01-01', [
        makeAntar('Moon', '2020-01-01', '2021-06-01'),
        makeAntar('Mars', '2021-06-01', '2023-01-01'),
        makeAntar('Rahu', '2023-01-01', '2025-06-01'),
        makeAntar('Jupiter', '2025-06-01', '2027-01-01'),
        makeAntar('Saturn', '2027-01-01', '2029-01-01'),
        makeAntar('Mercury', '2029-01-01', '2030-01-01'),
      ]),
      makeDasha('Mars', '2030-01-01', '2037-01-01'),
    ],
    shadbala: [],
    ayanamshaValue: 24.1,
    julianDay: 2451545,
  } as unknown as KundaliData;
}

function makeParams(overrides: Partial<MemberStatusParams> = {}): MemberStatusParams {
  return {
    name: 'Test Person',
    relationship: 'self',
    chartId: 'chart-001',
    kundali: makeKundali({}),
    currentSaturnSign: 8,    // Scorpio — not near Cancer(4) moon
    currentJupiterSign: 2,   // Taurus — not on natal Sun(1) or Moon(4)
    today: new Date(Date.UTC(2026, 3, 26)), // 2026-04-26
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('computeMemberStatus', () => {
  it('returns all required fields populated', () => {
    const status = computeMemberStatus(makeParams());

    expect(status.name).toBe('Test Person');
    expect(status.relationship).toBe('self');
    expect(status.chartId).toBe('chart-001');
    expect(status.currentDasha).toBeDefined();
    expect(status.currentDasha.mahaLord).toBeTruthy();
    expect(status.currentDasha.antarLord).toBeTruthy();
    expect(status.currentDasha.mahaEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(status.currentDasha.antarEnd).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(typeof status.currentDasha.isDashaTransition).toBe('boolean');
    expect(status.sadeSati).toBeDefined();
    expect(typeof status.sadeSati.isActive).toBe('boolean');
    expect(status.sadeSati.moonSign).toBeGreaterThanOrEqual(1);
    expect(status.sadeSati.moonSign).toBeLessThanOrEqual(12);
    expect(Array.isArray(status.transitAlerts)).toBe(true);
    expect(status.attention).toBeDefined();
    expect(status.attentionReason).toBeTruthy();
  });

  it('detects Sade Sati peak when Saturn is on Moon sign', () => {
    // Moon in Cancer (4), Saturn transit also in Cancer (4) → peak
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 4 }),
      currentSaturnSign: 4,
    }));

    expect(status.sadeSati.isActive).toBe(true);
    expect(status.sadeSati.phase).toBe('peak');
  });

  it('detects Sade Sati rising when Saturn is in previous sign', () => {
    // Moon in Cancer (4), Saturn in Gemini (3) → rising
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 4 }),
      currentSaturnSign: 3,
    }));

    expect(status.sadeSati.isActive).toBe(true);
    expect(status.sadeSati.phase).toBe('rising');
  });

  it('detects Sade Sati setting when Saturn is in next sign', () => {
    // Moon in Cancer (4), Saturn in Leo (5) → setting
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 4 }),
      currentSaturnSign: 5,
    }));

    expect(status.sadeSati.isActive).toBe(true);
    expect(status.sadeSati.phase).toBe('setting');
  });

  it('handles Sade Sati wrap-around for Aries Moon (sign 1)', () => {
    // Moon in Aries (1), Saturn in Pisces (12) → rising
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 1 }),
      currentSaturnSign: 12,
    }));

    expect(status.sadeSati.isActive).toBe(true);
    expect(status.sadeSati.phase).toBe('rising');
  });

  it('handles Sade Sati wrap-around for Pisces Moon (sign 12)', () => {
    // Moon in Pisces (12), Saturn in Aries (1) → setting
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 12 }),
      currentSaturnSign: 1,
    }));

    expect(status.sadeSati.isActive).toBe(true);
    expect(status.sadeSati.phase).toBe('setting');
  });

  it('detects dasha transition within 60 days', () => {
    // Antar ends 2026-05-15, today is 2026-04-26 → 19 days → transition
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({
        dashas: [
          makeDasha('Venus', '2020-01-01', '2040-01-01', [
            makeAntar('Venus', '2020-01-01', '2023-01-01'),
            makeAntar('Sun', '2023-01-01', '2026-05-15'),
            makeAntar('Moon', '2026-05-15', '2028-01-01'),
          ]),
        ],
      }),
      today: new Date(Date.UTC(2026, 3, 26)),
    }));

    expect(status.currentDasha.isDashaTransition).toBe(true);
    expect(status.currentDasha.mahaLord).toBe('Venus');
    expect(status.currentDasha.antarLord).toBe('Sun');
  });

  it('does not flag dasha transition when periods are far out', () => {
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({
        dashas: [
          makeDasha('Jupiter', '2020-01-01', '2036-01-01', [
            makeAntar('Jupiter', '2020-01-01', '2022-01-01'),
            makeAntar('Saturn', '2022-01-01', '2028-01-01'),
            makeAntar('Mercury', '2028-01-01', '2036-01-01'),
          ]),
        ],
      }),
      today: new Date(Date.UTC(2026, 3, 26)),
    }));

    expect(status.currentDasha.isDashaTransition).toBe(false);
    expect(status.currentDasha.mahaLord).toBe('Jupiter');
    expect(status.currentDasha.antarLord).toBe('Saturn');
  });

  it('identifies Jupiter transit on natal Moon as favorable', () => {
    // Moon in Cancer (4), Jupiter transit in Cancer (4)
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ moonSign: 4 }),
      currentJupiterSign: 4,
      currentSaturnSign: 8, // far from Moon — no Sade Sati
    }));

    expect(status.transitAlerts.length).toBeGreaterThanOrEqual(1);
    const jupMoon = status.transitAlerts.find(a =>
      a.description.includes('Jupiter transiting natal Moon'),
    );
    expect(jupMoon).toBeDefined();
    expect(jupMoon!.severity).toBe('positive');
  });

  it('identifies Saturn transit on natal Sun as challenging', () => {
    // Sun in Aries (1), Saturn transit in Aries (1)
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ sunSign: 1 }),
      currentSaturnSign: 1,
      currentJupiterSign: 7, // away from natal positions
    }));

    const satSun = status.transitAlerts.find(a =>
      a.description.includes('Saturn transiting natal Sun'),
    );
    expect(satSun).toBeDefined();
    expect(satSun!.severity).toBe('challenging');
  });

  it('returns stable when nothing notable is happening', () => {
    // Moon sign 4, Saturn sign 8, Jupiter sign 7 — nothing overlaps
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ sunSign: 1, moonSign: 4, ascSign: 10 }),
      currentSaturnSign: 8,
      currentJupiterSign: 7,
    }));

    expect(status.sadeSati.isActive).toBe(false);
    expect(status.transitAlerts).toHaveLength(0);
    expect(status.attention).toBe('stable');
    expect(status.attentionReason).toContain('No significant');
  });

  it('returns favorable when Jupiter is on ascendant with no Sade Sati', () => {
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ sunSign: 2, moonSign: 6, ascSign: 9 }),
      currentJupiterSign: 9, // on ascendant
      currentSaturnSign: 1,  // far from Moon(6)
    }));

    expect(status.attention).toBe('favorable');
    const jupAsc = status.transitAlerts.find(a =>
      a.description.includes('Jupiter transiting Ascendant'),
    );
    expect(jupAsc).toBeDefined();
  });

  it('returns critical when Sade Sati peak + challenging Saturn transit', () => {
    // Moon in Leo (5), Sun in Leo (5), Saturn in Leo (5)
    // → Sade Sati peak + Saturn on natal Sun + Saturn on natal Moon
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ sunSign: 5, moonSign: 5 }),
      currentSaturnSign: 5,
      currentJupiterSign: 10,
    }));

    expect(status.sadeSati.phase).toBe('peak');
    expect(status.attention).toBe('critical');
    expect(status.attentionReason).toContain('Sade Sati peak');
  });

  it('returns watch when Sade Sati is active (non-peak) with no other triggers', () => {
    // Moon in Cancer (4), Saturn in Gemini (3) → rising phase
    const status = computeMemberStatus(makeParams({
      kundali: makeKundali({ sunSign: 2, moonSign: 4, ascSign: 10 }),
      currentSaturnSign: 3,
      currentJupiterSign: 7,
    }));

    expect(status.sadeSati.phase).toBe('rising');
    expect(status.attention).toBe('watch');
    expect(status.attentionReason).toContain('rising');
  });
});

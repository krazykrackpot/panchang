import { describe, it, expect } from 'vitest';
import { generateDailyPrescription, getVaraRemedies } from '../remedies/prescription-engine';
import { computeHoraTable, getHoraWindowsForPlanet } from '../panchang/hora-engine';
import type { KundaliData, PlanetPosition, HouseCusp, DashaEntry, ShadBala } from '@/types/kundali';

// ─── Test Helpers ──────────────────────────────────────────────────────────

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
  1: { en: 'Aries', hi: 'मेष', sa: 'मेषः' },
  2: { en: 'Taurus', hi: 'वृषभ', sa: 'वृषभः' },
  3: { en: 'Gemini', hi: 'मिथुन', sa: 'मिथुनम्' },
  4: { en: 'Cancer', hi: 'कर्क', sa: 'कर्कटः' },
  5: { en: 'Leo', hi: 'सिंह', sa: 'सिंहः' },
  6: { en: 'Virgo', hi: 'कन्या', sa: 'कन्या' },
  7: { en: 'Libra', hi: 'तुला', sa: 'तुला' },
  8: { en: 'Scorpio', hi: 'वृश्चिक', sa: 'वृश्चिकः' },
  9: { en: 'Sagittarius', hi: 'धनु', sa: 'धनुः' },
  10: { en: 'Capricorn', hi: 'मकर', sa: 'मकरः' },
  11: { en: 'Aquarius', hi: 'कुम्भ', sa: 'कुम्भः' },
  12: { en: 'Pisces', hi: 'मीन', sa: 'मीनः' },
};

function makePlanet(
  id: number, sign: number, house: number,
  opts: { retrograde?: boolean; combust?: boolean; exalted?: boolean; debilitated?: boolean; ownSign?: boolean } = {}
): PlanetPosition {
  return {
    planet: { id, name: PLANET_NAMES[id] || { en: '', hi: '', sa: '' }, symbol: '', color: '' },
    longitude: sign * 30 + 15,
    latitude: 0,
    speed: 1,
    sign,
    signName: SIGN_NAMES[sign] || { en: '', hi: '', sa: '' },
    house,
    nakshatra: {
      id: 1, name: { en: 'Ashwini', hi: 'अश्विनी', sa: 'अश्विनी' },
      deity: { en: 'Ashwini Kumaras', hi: 'अश्विनी कुमार', sa: 'अश्विनीकुमारौ' },
      ruler: 'Ketu', rulerName: { en: 'Ketu', hi: 'केतु', sa: 'केतुः' },
      startDeg: 0, endDeg: 13.333, symbol: '🐴',
      nature: { en: 'Swift', hi: 'क्षिप्र', sa: 'क्षिप्रम्' },
    },
    pada: 1,
    degree: '15°00\'00"',
    isRetrograde: opts.retrograde ?? false,
    isCombust: opts.combust ?? false,
    isExalted: opts.exalted ?? false,
    isDebilitated: opts.debilitated ?? false,
    isOwnSign: opts.ownSign ?? false,
  };
}

function makeKundali(overrides: Partial<KundaliData> = {}): KundaliData {
  const defaultPlanets: PlanetPosition[] = [
    makePlanet(0, 5, 5, { ownSign: true }),    // Sun in Leo, house 5
    makePlanet(1, 4, 4),                        // Moon in Cancer, house 4
    makePlanet(2, 1, 10, { ownSign: true }),    // Mars in Aries, house 10
    makePlanet(3, 6, 3),                        // Mercury in Virgo, house 3
    makePlanet(4, 4, 1, { exalted: true }),     // Jupiter exalted in Cancer, house 1
    makePlanet(5, 12, 9, { exalted: true }),    // Venus exalted in Pisces, house 9
    makePlanet(6, 7, 4),                        // Saturn in Libra, house 4
    makePlanet(7, 1, 10),                       // Rahu in Aries, house 10
    makePlanet(8, 7, 4),                        // Ketu in Libra, house 4
  ];

  const defaultHouses: HouseCusp[] = Array.from({ length: 12 }, (_, i) => ({
    house: i + 1,
    degree: i * 30,
    sign: ((i) % 12) + 1,
    signName: { en: `Sign${i + 1}`, hi: `राशि${i + 1}`, sa: `राशि${i + 1}` },
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
    shadbala: overrides.shadbala || [],
    ayanamshaValue: 24.1,
    julianDay: 2448086.5,
    ...overrides,
  };
}

// Standard hora table: Sunday, equinox times (12h day, 12h night)
function makeHoraTable(varaDay = 0) {
  return computeHoraTable('06:00', '18:00', '06:00', varaDay);
}

// ─── Tests ─────────────────────────────────────────────────────────────────

describe('generateDailyPrescription', () => {
  it('returns an array of RemedyPrescription', () => {
    const kundali = makeKundali();
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);
    expect(Array.isArray(result)).toBe(true);
  });

  it('returns max 3 prescriptions even with many weak planets', () => {
    // All planets debilitated → all will score high
    const planets: PlanetPosition[] = [
      makePlanet(0, 7, 6, { debilitated: true }),   // Sun debilitated in Libra, 6H
      makePlanet(1, 8, 8, { debilitated: true }),   // Moon debilitated in Scorpio, 8H
      makePlanet(2, 4, 12, { debilitated: true }),  // Mars debilitated in Cancer, 12H
      makePlanet(3, 12, 8, { debilitated: true }),  // Mercury debilitated in Pisces, 8H
      makePlanet(4, 10, 6, { debilitated: true }),  // Jupiter debilitated in Capricorn, 6H
      makePlanet(5, 6, 12, { debilitated: true }),  // Venus debilitated in Virgo, 12H
      makePlanet(6, 1, 7, { debilitated: true }),   // Saturn debilitated in Aries, 7H
      makePlanet(7, 8, 8),                           // Rahu
      makePlanet(8, 2, 2),                           // Ketu
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);

    expect(result.length).toBeLessThanOrEqual(3);
    expect(result.length).toBe(3);
  });

  it('dosha-linked planets get critical urgency (Mars in house 7 = Mangal Dosha)', () => {
    const planets: PlanetPosition[] = [
      makePlanet(0, 5, 5, { ownSign: true }),
      makePlanet(1, 4, 4),
      makePlanet(2, 7, 7, { debilitated: false }), // Mars in 7H (Mangal Dosha), needs some weakness too
      makePlanet(3, 6, 3),
      makePlanet(4, 4, 1, { exalted: true }),
      makePlanet(5, 12, 9, { exalted: true }),
      makePlanet(6, 7, 4),
      makePlanet(7, 1, 10),
      makePlanet(8, 7, 4),
    ];
    // Give Mars low shadbala so it scores > 20
    const shadbala: ShadBala[] = [
      { planet: 'Mars', planetName: { en: 'Mars', hi: 'मंगल', sa: 'मङ्गलः' }, totalStrength: 25, sthanaBala: 5, digBala: 5, kalaBala: 5, cheshtaBala: 5, naisargikaBala: 3, drikBala: 2 },
    ];
    const kundali = makeKundali({ planets, shadbala });
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);

    const marsRx = result.find(r => r.planetId === 2);
    expect(marsRx).toBeDefined();
    if (marsRx) {
      expect(marsRx.urgency).toBe('critical');
    }
  });

  it('debilitated Saturn in house 7 appears with high urgency', () => {
    const planets: PlanetPosition[] = [
      makePlanet(0, 5, 5, { ownSign: true }),
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 10, { ownSign: true }),
      makePlanet(3, 6, 3),
      makePlanet(4, 4, 1, { exalted: true }),
      makePlanet(5, 12, 9, { exalted: true }),
      makePlanet(6, 1, 7, { debilitated: true }),  // Saturn debilitated in Aries, 7H
      makePlanet(7, 1, 10),
      makePlanet(8, 7, 4),
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable(6); // Saturday
    const result = generateDailyPrescription(kundali, hora);

    const saturnRx = result.find(r => r.planetId === 6);
    expect(saturnRx).toBeDefined();
    if (saturnRx) {
      // Saturn is current Mahadasha lord (from default dashas) + debilitated → critical
      expect(saturnRx.urgency).toBe('critical');
      expect(saturnRx.reason.en).toBeTruthy();
      expect(saturnRx.reason.hi).toBeTruthy();
    }
  });

  it('each prescription has non-empty mantra, charity, and reason', () => {
    const planets: PlanetPosition[] = [
      makePlanet(0, 7, 6, { debilitated: true }),
      makePlanet(1, 8, 8, { debilitated: true }),
      makePlanet(2, 4, 12, { debilitated: true }),
      makePlanet(3, 12, 8, { debilitated: true }),
      makePlanet(4, 10, 6, { debilitated: true }),
      makePlanet(5, 6, 12, { debilitated: true }),
      makePlanet(6, 1, 7, { debilitated: true }),
      makePlanet(7, 8, 8),
      makePlanet(8, 2, 2),
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);

    for (const rx of result) {
      expect(rx.mantra.beej).toBeTruthy();
      expect(rx.mantra.vedic).toBeTruthy();
      expect(rx.mantra.count).toBeGreaterThan(0);
      expect(rx.charity.item.en).toBeTruthy();
      expect(rx.charity.direction.en).toBeTruthy();
      expect(rx.reason.en).toBeTruthy();
      expect(rx.reason.hi).toBeTruthy();
    }
  });

  it('planets with no weakness are excluded (all strong chart)', () => {
    // All planets exalted or own sign — should score below threshold
    const planets: PlanetPosition[] = [
      makePlanet(0, 5, 5, { ownSign: true }),      // Sun own sign
      makePlanet(1, 2, 2, { exalted: true }),       // Moon exalted
      makePlanet(2, 10, 10, { exalted: true }),     // Mars exalted
      makePlanet(3, 6, 6, { ownSign: true }),       // Mercury own sign
      makePlanet(4, 4, 4, { exalted: true }),       // Jupiter exalted
      makePlanet(5, 12, 12, { exalted: true }),     // Venus exalted
      makePlanet(6, 7, 7, { ownSign: true }),       // Saturn own sign (Libra exalt, but own is Aquarius/Capricorn — let's use exalted)
      makePlanet(7, 1, 10),
      makePlanet(8, 7, 4),
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);

    // Strong planets should either have 0 prescriptions or only Rahu/Ketu if they score
    // All classical planets (0-6) should have low/zero scores
    const classicalRx = result.filter(r => r.planetId <= 6);
    // With exalted/own sign, gemstone engine gives negative scores, so these should be excluded
    expect(classicalRx.length).toBe(0);
  });

  it('hora windows are correctly matched to planets', () => {
    const planets: PlanetPosition[] = [
      makePlanet(0, 5, 5, { ownSign: true }),
      makePlanet(1, 4, 4),
      makePlanet(2, 1, 10, { ownSign: true }),
      makePlanet(3, 6, 3),
      makePlanet(4, 4, 1, { exalted: true }),
      makePlanet(5, 12, 9, { exalted: true }),
      makePlanet(6, 1, 7, { debilitated: true }),
      makePlanet(7, 1, 10),
      makePlanet(8, 7, 4),
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable(6); // Saturday — Saturn hora first
    const result = generateDailyPrescription(kundali, hora);

    const saturnRx = result.find(r => r.planetId === 6);
    if (saturnRx) {
      // Saturn should have hora windows from the Saturday hora table
      expect(saturnRx.optimalWindows.length).toBeGreaterThan(0);
      // Verify the windows match Saturn hora slots from the table
      const saturnHoras = getHoraWindowsForPlanet(hora, 6);
      expect(saturnRx.optimalWindows.length).toBe(saturnHoras.length);
      expect(saturnRx.optimalWindows[0].horaStart).toBe(saturnHoras[0].startTime);
      expect(saturnRx.optimalWindows[0].horaEnd).toBe(saturnHoras[0].endTime);
    }
  });

  it('prescriptions are sorted by urgency: critical first', () => {
    const planets: PlanetPosition[] = [
      makePlanet(0, 7, 6, { debilitated: true }),   // Sun debilitated + dusthana → will score high
      makePlanet(1, 8, 8, { debilitated: true }),   // Moon debilitated + dusthana
      makePlanet(2, 4, 7, { debilitated: true }),   // Mars debilitated in 7H (Mangal Dosha) → critical
      makePlanet(3, 6, 3),
      makePlanet(4, 10, 6, { debilitated: true }),
      makePlanet(5, 12, 9, { exalted: true }),
      makePlanet(6, 1, 7, { debilitated: true }),   // Saturn debilitated, Mahadasha lord → critical
      makePlanet(7, 1, 10),
      makePlanet(8, 7, 4),
    ];
    const kundali = makeKundali({ planets });
    const hora = makeHoraTable();
    const result = generateDailyPrescription(kundali, hora);

    // First prescriptions should be critical
    if (result.length >= 2) {
      expect(result[0].urgency).toBe('critical');
    }
  });
});

describe('getVaraRemedies', () => {
  const horaTable = makeHoraTable(0); // Sunday

  it('returns correct planet for Sunday (Sun)', () => {
    const vara = getVaraRemedies(0, horaTable);
    expect(vara.planet.id).toBe(0);
    expect(vara.planet.name.en).toBe('Sun');
  });

  it('returns correct planet for Monday (Moon)', () => {
    const mondayHora = makeHoraTable(1);
    const vara = getVaraRemedies(1, mondayHora);
    expect(vara.planet.id).toBe(1);
    expect(vara.planet.name.en).toBe('Moon');
  });

  it('returns correct planet for Saturday (Saturn)', () => {
    const saturdayHora = makeHoraTable(6);
    const vara = getVaraRemedies(6, saturdayHora);
    expect(vara.planet.id).toBe(6);
    expect(vara.planet.name.en).toBe('Saturn');
  });

  it('returns correct planets for all 7 days', () => {
    const expected = ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn'];
    for (let day = 0; day < 7; day++) {
      const h = makeHoraTable(day);
      const vara = getVaraRemedies(day, h);
      expect(vara.planet.name.en).toBe(expected[day]);
    }
  });

  it('has hora windows for the vara lord', () => {
    const vara = getVaraRemedies(0, horaTable);
    expect(vara.horaWindows.length).toBeGreaterThan(0);
    // Each window should have start/end times
    for (const w of vara.horaWindows) {
      expect(w.start).toMatch(/^\d{2}:\d{2}$/);
      expect(w.end).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('has non-empty mantra, charity, color, and gemstone', () => {
    for (let day = 0; day < 7; day++) {
      const h = makeHoraTable(day);
      const vara = getVaraRemedies(day, h);
      expect(vara.mantra.beej).toBeTruthy();
      expect(vara.mantra.count).toBeGreaterThan(0);
      expect(vara.charity.item.en).toBeTruthy();
      expect(vara.charity.direction.en).toBeTruthy();
      expect(vara.color.en).toBeTruthy();
      expect(vara.gemstone.en).toBeTruthy();
    }
  });

  it('message mentions the day and planet', () => {
    const vara = getVaraRemedies(6, makeHoraTable(6));
    expect(vara.message.en).toContain('Saturday');
    expect(vara.message.en).toContain('Saturn');
    expect(vara.message.hi).toBeTruthy();
  });
});

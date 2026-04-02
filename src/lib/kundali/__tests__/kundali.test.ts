/**
 * Comprehensive unit tests for the Kundali (Birth Chart) module
 * Tests calculateKundali, calculateDashas, and detectYogas
 */

import { describe, it, expect } from 'vitest';
import { calculateKundali, calculateDashas, detectYogas } from '../index';
import type { KundaliInput } from '../chart';
import type { GrahaPosition, HouseData, YogaDetection, GrahaId } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const DELHI_INPUT: KundaliInput = {
  year: 1990,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  latitude: 28.6139,
  longitude: 77.2090,
  timezoneOffset: 5.5,
  placeName: 'Delhi',
};

const LONDON_INPUT: KundaliInput = {
  year: 1990,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  latitude: 51.5074,
  longitude: -0.1278,
  timezoneOffset: 0,
  placeName: 'London',
};

const NEW_YORK_INPUT: KundaliInput = {
  year: 1990,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  latitude: 40.7128,
  longitude: -74.0060,
  timezoneOffset: -5,
  placeName: 'New York',
};

const TOKYO_INPUT: KundaliInput = {
  year: 1990,
  month: 6,
  day: 15,
  hour: 10,
  minute: 30,
  latitude: 35.6762,
  longitude: 139.6503,
  timezoneOffset: 9,
  placeName: 'Tokyo',
};

const ALL_GRAHA_IDS: GrahaId[] = [
  'sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu',
];

const DASHA_LORDS = ['Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury'];
const DASHA_YEARS = [7, 20, 6, 10, 7, 18, 16, 19, 17]; // total = 120

/** Build a minimal GrahaPosition for yoga testing */
function mockGraha(
  id: GrahaId,
  overrides: Partial<GrahaPosition> = {},
): GrahaPosition {
  return {
    id,
    name: id.charAt(0).toUpperCase() + id.slice(1),
    longitude: 0,
    signIndex: 0,
    sign: 'Aries',
    signSanskrit: 'Mesha',
    degreeInSign: 0,
    nakshatra: 'Ashwini',
    nakshatraIndex: 0,
    pada: 1,
    house: 1,
    isRetrograde: false,
    symbol: id.slice(0, 2),
    ...overrides,
  };
}

/** Build a minimal 12-house array */
function mockHouses(ascSignIndex: number, planetPlacements: Record<number, GrahaId[]> = {}): HouseData[] {
  return Array.from({ length: 12 }, (_, i) => ({
    number: i + 1,
    sign: `Sign${(ascSignIndex + i) % 12}`,
    signIndex: (ascSignIndex + i) % 12,
    planets: planetPlacements[i + 1] ?? [],
  }));
}

// ===========================================================================
// 1. calculateKundali
// ===========================================================================

describe('calculateKundali', () => {
  const delhi = calculateKundali(DELHI_INPUT);

  // ---- Structure tests ----

  it('returns all top-level fields', () => {
    expect(delhi).toHaveProperty('birthDetails');
    expect(delhi).toHaveProperty('ayanamsa');
    expect(delhi).toHaveProperty('ayanamsaType');
    expect(delhi).toHaveProperty('ascendant');
    expect(delhi).toHaveProperty('grahas');
    expect(delhi).toHaveProperty('houses');
    expect(delhi).toHaveProperty('dashas');
    expect(delhi).toHaveProperty('yogas');
    expect(delhi).toHaveProperty('navamsaHouses');
  });

  it('grahas array has exactly 9 elements', () => {
    expect(delhi.grahas).toHaveLength(9);
  });

  it('houses array has exactly 12 elements', () => {
    expect(delhi.houses).toHaveLength(12);
  });

  it('navamsaHouses array has exactly 12 elements', () => {
    expect(delhi.navamsaHouses).toHaveLength(12);
  });

  it('all grahas have valid signIndex (0-11)', () => {
    for (const g of delhi.grahas) {
      expect(g.signIndex).toBeGreaterThanOrEqual(0);
      expect(g.signIndex).toBeLessThanOrEqual(11);
    }
  });

  it('all grahas have valid house (1-12)', () => {
    for (const g of delhi.grahas) {
      expect(g.house).toBeGreaterThanOrEqual(1);
      expect(g.house).toBeLessThanOrEqual(12);
    }
  });

  it('all grahas have valid pada (1-4)', () => {
    for (const g of delhi.grahas) {
      expect(g.pada).toBeGreaterThanOrEqual(1);
      expect(g.pada).toBeLessThanOrEqual(4);
    }
  });

  it('all grahas have valid nakshatraIndex (0-26)', () => {
    for (const g of delhi.grahas) {
      expect(g.nakshatraIndex).toBeGreaterThanOrEqual(0);
      expect(g.nakshatraIndex).toBeLessThanOrEqual(26);
    }
  });

  it('all grahas have degreeInSign between 0 and 30', () => {
    for (const g of delhi.grahas) {
      expect(g.degreeInSign).toBeGreaterThanOrEqual(0);
      expect(g.degreeInSign).toBeLessThan(30);
    }
  });

  it('ascendant signIndex is 0-11', () => {
    expect(delhi.ascendant.signIndex).toBeGreaterThanOrEqual(0);
    expect(delhi.ascendant.signIndex).toBeLessThanOrEqual(11);
  });

  it('ascendant degreeInSign is 0-30', () => {
    expect(delhi.ascendant.degreeInSign).toBeGreaterThanOrEqual(0);
    expect(delhi.ascendant.degreeInSign).toBeLessThan(30);
  });

  it('all 9 unique graha ids are present', () => {
    const ids = delhi.grahas.map(g => g.id);
    for (const expected of ALL_GRAHA_IDS) {
      expect(ids).toContain(expected);
    }
    // No duplicates
    expect(new Set(ids).size).toBe(9);
  });

  it('Rahu and Ketu are approximately 180 degrees apart', () => {
    const rahu = delhi.grahas.find(g => g.id === 'rahu')!;
    const ketu = delhi.grahas.find(g => g.id === 'ketu')!;
    let diff = Math.abs(rahu.longitude - ketu.longitude);
    if (diff > 180) diff = 360 - diff;
    expect(diff).toBeCloseTo(180, 0); // within 1 degree
  });

  it('each house has a valid signIndex (0-11)', () => {
    for (const h of delhi.houses) {
      expect(h.signIndex).toBeGreaterThanOrEqual(0);
      expect(h.signIndex).toBeLessThanOrEqual(11);
    }
  });

  it('all 12 signs are represented across houses', () => {
    const signIndices = new Set(delhi.houses.map(h => h.signIndex));
    expect(signIndices.size).toBe(12);
  });

  it('house numbers run 1 through 12', () => {
    const nums = delhi.houses.map(h => h.number).sort((a, b) => a - b);
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('ayanamsa is between 22 and 26 degrees for a 1990 chart', () => {
    expect(delhi.ayanamsa).toBeGreaterThan(22);
    expect(delhi.ayanamsa).toBeLessThan(26);
  });

  it('default ayanamsa type is lahiri', () => {
    expect(delhi.ayanamsaType).toBe('lahiri');
  });

  it('birthDetails reflect the input', () => {
    expect(delhi.birthDetails.latitude).toBe(28.6139);
    expect(delhi.birthDetails.longitude).toBe(77.2090);
    expect(delhi.birthDetails.timezone).toBe(5.5);
    expect(delhi.birthDetails.place).toBe('Delhi');
    expect(delhi.birthDetails.time).toBe('10:30');
  });

  // ---- Ayanamsa type variants ----

  it('supports krishnamurti ayanamsa', () => {
    const kp = calculateKundali({ ...DELHI_INPUT, ayanamsaType: 'krishnamurti' });
    expect(kp.ayanamsaType).toBe('krishnamurti');
    expect(kp.ayanamsa).toBeGreaterThan(22);
    expect(kp.ayanamsa).toBeLessThan(26);
  });

  it('supports raman ayanamsa', () => {
    const raman = calculateKundali({ ...DELHI_INPUT, ayanamsaType: 'raman' });
    expect(raman.ayanamsaType).toBe('raman');
    expect(raman.ayanamsa).toBeGreaterThan(20);
    expect(raman.ayanamsa).toBeLessThan(26);
  });

  it('different ayanamsa types produce different ayanamsa values', () => {
    const lahiri = calculateKundali({ ...DELHI_INPUT, ayanamsaType: 'lahiri' });
    const raman = calculateKundali({ ...DELHI_INPUT, ayanamsaType: 'raman' });
    expect(lahiri.ayanamsa).not.toBeCloseTo(raman.ayanamsa, 1);
  });

  // ---- Multiple locations ----

  it('produces valid chart for London', () => {
    const chart = calculateKundali(LONDON_INPUT);
    expect(chart.grahas).toHaveLength(9);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant.signIndex).toBeGreaterThanOrEqual(0);
    expect(chart.ascendant.signIndex).toBeLessThanOrEqual(11);
  });

  it('produces valid chart for New York', () => {
    const chart = calculateKundali(NEW_YORK_INPUT);
    expect(chart.grahas).toHaveLength(9);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant.signIndex).toBeGreaterThanOrEqual(0);
  });

  it('produces valid chart for Tokyo', () => {
    const chart = calculateKundali(TOKYO_INPUT);
    expect(chart.grahas).toHaveLength(9);
    expect(chart.houses).toHaveLength(12);
    expect(chart.ascendant.signIndex).toBeGreaterThanOrEqual(0);
  });

  it('different locations produce different ascendants', () => {
    const delhiAsc = delhi.ascendant.longitude;
    const londonAsc = calculateKundali(LONDON_INPUT).ascendant.longitude;
    const tokyoAsc = calculateKundali(TOKYO_INPUT).ascendant.longitude;
    // At least two should differ
    const unique = new Set([
      Math.round(delhiAsc),
      Math.round(londonAsc),
      Math.round(tokyoAsc),
    ]);
    expect(unique.size).toBeGreaterThanOrEqual(2);
  });

  it('planet longitudes are in range 0-360', () => {
    for (const g of delhi.grahas) {
      expect(g.longitude).toBeGreaterThanOrEqual(0);
      expect(g.longitude).toBeLessThan(360);
    }
  });

  it('dashas array is non-empty', () => {
    expect(delhi.dashas.length).toBeGreaterThan(0);
  });

  it('yogas array is defined', () => {
    expect(Array.isArray(delhi.yogas)).toBe(true);
  });

  it('navamsa houses have 12 unique sign indices', () => {
    const signIndices = new Set(delhi.navamsaHouses.map(h => h.signIndex));
    expect(signIndices.size).toBe(12);
  });

  it('navamsa house numbers run 1 through 12', () => {
    const nums = delhi.navamsaHouses.map(h => h.number).sort((a, b) => a - b);
    expect(nums).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('house planet lists match graha house assignments', () => {
    // Every planet assigned to house N should appear in houses[N-1].planets
    for (const g of delhi.grahas) {
      const house = delhi.houses.find(h => h.number === g.house)!;
      expect(house.planets).toContain(g.id);
    }
  });
});

// ===========================================================================
// 2. calculateDashas
// ===========================================================================

describe('calculateDashas', () => {
  const birthDate = new Date(1990, 5, 15, 10, 30); // June 15, 1990

  // ---- Nakshatra-to-lord mapping ----

  it('Nakshatra 0 (Ashwini) starts with Ketu dasha', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    expect(dashas[0].planet).toBe('Ketu');
  });

  it('Nakshatra 1 (Bharani) starts with Venus dasha', () => {
    const dashas = calculateDashas(1, 0, birthDate);
    expect(dashas[0].planet).toBe('Venus');
  });

  it('Nakshatra 2 (Krittika) starts with Sun dasha', () => {
    const dashas = calculateDashas(2, 0, birthDate);
    expect(dashas[0].planet).toBe('Sun');
  });

  it('Nakshatra 9 (Ashlesha/Magha boundary) starts with Ketu dasha', () => {
    const dashas = calculateDashas(9, 0, birthDate);
    expect(dashas[0].planet).toBe('Ketu');
  });

  it('Nakshatra 18 (Jyeshtha/Moola boundary) starts with Ketu dasha', () => {
    const dashas = calculateDashas(18, 0, birthDate);
    expect(dashas[0].planet).toBe('Ketu');
  });

  // ---- Dasha cycle completeness ----

  it('all 9 dasha lords appear exactly once', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    const lords = dashas.map(d => d.planet);
    expect(lords).toHaveLength(9);
    for (const lord of DASHA_LORDS) {
      expect(lords).toContain(lord);
    }
  });

  it('total dasha years sum to 120', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    const totalYears = dashas.reduce((sum, d) => sum + d.years, 0);
    expect(totalYears).toBeCloseTo(120, 1);
  });

  it('dasha sequence follows correct order from starting lord', () => {
    // Starting from nakshatra 3 -> Moon (index 3 in DASHA_SEQUENCE)
    const dashas = calculateDashas(3, 0, birthDate);
    const expectedOrder = ['Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu', 'Venus', 'Sun'];
    const actualOrder = dashas.map(d => d.planet);
    expect(actualOrder).toEqual(expectedOrder);
  });

  // ---- moonDegreeInNakshatra effects ----

  it('moonDegreeInNakshatra = 0 gives full first period', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    expect(dashas[0].years).toBeCloseTo(7, 1); // Ketu = 7 years full
  });

  it('moonDegreeInNakshatra at midpoint gives half of first period', () => {
    const nakshatraSpan = 360 / 27; // ~13.333
    const midpoint = nakshatraSpan / 2;
    const dashas = calculateDashas(0, midpoint, birthDate);
    expect(dashas[0].years).toBeCloseTo(3.5, 1); // Half of Ketu's 7
  });

  it('moonDegreeInNakshatra near end gives small first period', () => {
    const nakshatraSpan = 360 / 27;
    const nearEnd = nakshatraSpan * 0.9;
    const dashas = calculateDashas(0, nearEnd, birthDate);
    expect(dashas[0].years).toBeCloseTo(0.7, 1); // 10% of 7
  });

  // ---- Date sequencing ----

  it('dates are sequential and non-overlapping', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    for (let i = 1; i < dashas.length; i++) {
      expect(dashas[i].startDate.getTime()).toBeGreaterThanOrEqual(
        dashas[i - 1].endDate.getTime() - 1000 // 1-second tolerance
      );
    }
  });

  it('end date of period N equals start date of period N+1', () => {
    const dashas = calculateDashas(5, 3, birthDate);
    for (let i = 0; i < dashas.length - 1; i++) {
      const diff = Math.abs(dashas[i].endDate.getTime() - dashas[i + 1].startDate.getTime());
      expect(diff).toBeLessThan(1000); // within 1 second
    }
  });

  it('first dasha starts at or near birth date', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    const diff = Math.abs(dashas[0].startDate.getTime() - birthDate.getTime());
    expect(diff).toBeLessThan(1000);
  });

  it('last dasha ends approximately 120 years after birth', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    const lastEnd = dashas[dashas.length - 1].endDate;
    const yearsSpan = (lastEnd.getTime() - birthDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);
    expect(yearsSpan).toBeCloseTo(120, 0);
  });

  // ---- Sub-periods (Antar Dasha) ----

  it('each maha dasha has 9 sub-periods', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    for (const d of dashas) {
      expect(d.subPeriods).toBeDefined();
      expect(d.subPeriods).toHaveLength(9);
    }
  });

  it('sub-period years sum to maha dasha years', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    for (const d of dashas) {
      const subTotal = d.subPeriods!.reduce((sum, sp) => sum + sp.years, 0);
      expect(subTotal).toBeCloseTo(d.years, 2);
    }
  });

  it('sub-periods start with the maha dasha lord', () => {
    const dashas = calculateDashas(0, 0, birthDate);
    for (const d of dashas) {
      expect(d.subPeriods![0].planet).toBe(d.planet);
    }
  });
});

// ===========================================================================
// 3. detectYogas
// ===========================================================================

describe('detectYogas', () => {

  // ---- Gajakesari Yoga ----

  it('detects Gajakesari Yoga when Jupiter is in kendra from Moon', () => {
    // Moon in house 1, Jupiter in house 4 (kendra from Moon)
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 1 });
      if (id === 'jupiter') return mockGraha(id, { house: 4 });
      return mockGraha(id, { house: 3 }); // others out of the way
    });
    const houses = mockHouses(0, { 1: ['moon'], 3: ['sun', 'mars', 'mercury', 'venus', 'saturn', 'rahu', 'ketu'], 4: ['jupiter'] });

    const yogas = detectYogas(grahas, houses, 0);
    const gk = yogas.find(y => y.name === 'Gajakesari Yoga');
    expect(gk).toBeDefined();
    expect(gk!.type).toBe('Other');
  });

  it('does not detect Gajakesari when Jupiter is not in kendra from Moon', () => {
    // Moon in house 1, Jupiter in house 3 (not a kendra)
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 1 });
      if (id === 'jupiter') return mockGraha(id, { house: 3 });
      return mockGraha(id, { house: 2 });
    });
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    const gk = yogas.find(y => y.name === 'Gajakesari Yoga');
    expect(gk).toBeUndefined();
  });

  it('Gajakesari also triggers when Jupiter is in house 7 from Moon', () => {
    // Moon house 2, Jupiter house 8 => diff = 6 => jupFromMoon = 7 (kendra)
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 2 });
      if (id === 'jupiter') return mockGraha(id, { house: 8 });
      return mockGraha(id, { house: 5 });
    });
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Gajakesari Yoga')).toBeDefined();
  });

  // ---- Pancha Mahapurusha: Ruchaka Yoga ----

  it('detects Ruchaka Yoga when Mars is in own sign (Aries) in kendra', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'mars') return mockGraha(id, { house: 1, signIndex: 0 }); // Aries, kendra
      if (id === 'moon') return mockGraha(id, { house: 6 });
      if (id === 'jupiter') return mockGraha(id, { house: 6 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 1: ['mars'] });

    const yogas = detectYogas(grahas, houses, 0);
    const ruchaka = yogas.find(y => y.name === 'Ruchaka Yoga');
    expect(ruchaka).toBeDefined();
    expect(ruchaka!.type).toBe('Pancha Mahapurusha');
    expect(ruchaka!.strength).toBe('Moderate'); // own sign, not exalted
  });

  it('detects Ruchaka Yoga as Strong when Mars is exalted (Capricorn) in kendra', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'mars') return mockGraha(id, { house: 10, signIndex: 9 }); // Capricorn, kendra (10th)
      if (id === 'moon') return mockGraha(id, { house: 6 });
      if (id === 'jupiter') return mockGraha(id, { house: 6 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 10: ['mars'] });

    const yogas = detectYogas(grahas, houses, 0);
    const ruchaka = yogas.find(y => y.name === 'Ruchaka Yoga');
    expect(ruchaka).toBeDefined();
    expect(ruchaka!.strength).toBe('Strong');
  });

  it('does not detect Ruchaka when Mars is in own sign but not in kendra', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'mars') return mockGraha(id, { house: 3, signIndex: 0 }); // Aries but house 3 (not kendra)
      if (id === 'moon') return mockGraha(id, { house: 6 });
      if (id === 'jupiter') return mockGraha(id, { house: 6 });
      return mockGraha(id, { house: 5 });
    });
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Ruchaka Yoga')).toBeUndefined();
  });

  // ---- Budhaditya Yoga ----

  it('detects Budhaditya Yoga when Sun and Mercury are in the same house', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'sun') return mockGraha(id, { house: 5, longitude: 120 });
      if (id === 'mercury') return mockGraha(id, { house: 5, longitude: 125 });
      if (id === 'moon') return mockGraha(id, { house: 2 });
      if (id === 'jupiter') return mockGraha(id, { house: 8 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 5: ['sun', 'mercury'] });

    const yogas = detectYogas(grahas, houses, 0);
    const budh = yogas.find(y => y.name === 'Budhaditya Yoga');
    expect(budh).toBeDefined();
    expect(budh!.type).toBe('Other');
  });

  it('Budhaditya is Strong when Sun-Mercury gap < 10 degrees', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'sun') return mockGraha(id, { house: 5, longitude: 120 });
      if (id === 'mercury') return mockGraha(id, { house: 5, longitude: 125 }); // 5 deg apart
      if (id === 'moon') return mockGraha(id, { house: 2 });
      if (id === 'jupiter') return mockGraha(id, { house: 8 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 5: ['sun', 'mercury'] });

    const yogas = detectYogas(grahas, houses, 0);
    const budh = yogas.find(y => y.name === 'Budhaditya Yoga');
    expect(budh!.strength).toBe('Strong');
  });

  // ---- Kemadruma Yoga ----

  it('detects Kemadruma when no planets adjacent to Moon and Moon not in kendra', () => {
    // Moon in house 3 (not kendra), no planets in house 2 or 4
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 3 });
      if (id === 'rahu') return mockGraha(id, { house: 6 });
      if (id === 'ketu') return mockGraha(id, { house: 12 });
      return mockGraha(id, { house: 9 }); // far from moon
    });
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    const kem = yogas.find(y => y.name === 'Kemadruma Yoga');
    expect(kem).toBeDefined();
    expect(kem!.type).toBe('Arishta');
    expect(kem!.strength).toBe('Weak');
  });

  it('does not detect Kemadruma when Moon is in kendra', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 1 }); // kendra
      return mockGraha(id, { house: 9 });
    });
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Kemadruma Yoga')).toBeUndefined();
  });

  // ---- Dhana Yoga ----

  it('detects Dhana Yoga when Jupiter is in 2nd house', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'jupiter') return mockGraha(id, { house: 2 });
      if (id === 'moon') return mockGraha(id, { house: 6 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 2: ['jupiter'] });

    const yogas = detectYogas(grahas, houses, 0);
    const dhana = yogas.find(y => y.name === 'Dhana Yoga');
    expect(dhana).toBeDefined();
    expect(dhana!.type).toBe('Dhana');
  });

  it('detects Dhana Yoga when Venus is in 11th house', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'venus') return mockGraha(id, { house: 11 });
      if (id === 'moon') return mockGraha(id, { house: 6 });
      if (id === 'jupiter') return mockGraha(id, { house: 6 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 11: ['venus'] });

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Dhana Yoga')).toBeDefined();
  });

  // ---- Empty / minimal scenarios ----

  it('returns an array (possibly empty) for any valid input', () => {
    // Planets scattered with no special yoga conditions
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map((id, i) =>
      mockGraha(id, { house: (i % 12) + 1, signIndex: (i * 3) % 12 }),
    );
    const houses = mockHouses(0);

    const yogas = detectYogas(grahas, houses, 0);
    expect(Array.isArray(yogas)).toBe(true);
  });

  it('yoga type is one of the known types', () => {
    const chart = calculateKundali(DELHI_INPUT);
    const validTypes = ['Raja', 'Dhana', 'Arishta', 'Pancha Mahapurusha', 'Other'];
    for (const y of chart.yogas) {
      expect(validTypes).toContain(y.type);
    }
  });

  it('yoga strength is one of Strong, Moderate, Weak', () => {
    const chart = calculateKundali(DELHI_INPUT);
    for (const y of chart.yogas) {
      expect(['Strong', 'Moderate', 'Weak']).toContain(y.strength);
    }
  });

  // ---- Chandra-Mangala Yoga ----

  it('detects Chandra-Mangala when Moon and Mars share a house', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'moon') return mockGraha(id, { house: 5 });
      if (id === 'mars') return mockGraha(id, { house: 5 });
      if (id === 'jupiter') return mockGraha(id, { house: 11 });
      return mockGraha(id, { house: 9 });
    });
    const houses = mockHouses(0, { 5: ['moon', 'mars'] });

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Chandra-Mangala Yoga')).toBeDefined();
  });

  // ---- Viparita Raja Yoga ----

  it('detects Viparita Raja Yoga with 2+ planets in dusthana', () => {
    const grahas: GrahaPosition[] = ALL_GRAHA_IDS.map(id => {
      if (id === 'sun') return mockGraha(id, { house: 6 });
      if (id === 'mars') return mockGraha(id, { house: 8 });
      if (id === 'moon') return mockGraha(id, { house: 2 }); // not in kendra, helps avoid false Kemadruma block
      if (id === 'jupiter') return mockGraha(id, { house: 2 });
      return mockGraha(id, { house: 3 });
    });
    const houses = mockHouses(0, { 6: ['sun'], 8: ['mars'] });

    const yogas = detectYogas(grahas, houses, 0);
    expect(yogas.find(y => y.name === 'Viparita Raja Yoga')).toBeDefined();
  });
});

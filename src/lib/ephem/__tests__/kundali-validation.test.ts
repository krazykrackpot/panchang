/**
 * Kundali Validation Tests — verified against Swiss Ephemeris / Drik Panchang
 *
 * Tests 5 birth charts across 3 continents (India, USA, Europe) with
 * DST-affected and non-DST timezones. Validates:
 * - Ascendant (Lagna) sign
 * - Moon sign and nakshatra
 * - All 9 planet sign placements
 * - Timezone/DST handling (IANA strings)
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '../kundali-calc';
import { computePanchang } from '../panchang-calc';
import type { BirthData } from '@/types/kundali';

// ── Helpers ──────────────────────────────────────────────────────────────

const RASHI_NAMES = [
  '', 'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

function signName(id: number): string {
  return RASHI_NAMES[id] || `Unknown(${id})`;
}

function getPlanetSign(kundali: ReturnType<typeof generateKundali>, planetId: number): number {
  return kundali.planets.find(p => p.planet.id === planetId)!.sign;
}

function getPlanetNakshatra(kundali: ReturnType<typeof generateKundali>, planetId: number): string {
  return kundali.planets.find(p => p.planet.id === planetId)!.nakshatra.name.en;
}

// ── Test Data (verified against Swiss Ephemeris, April 2026) ─────────

interface TestCase {
  label: string;
  birthData: BirthData;
  expected: {
    lagna: number;        // Rashi ID (1-12)
    moonSign: number;
    moonNakshatra: string;
    sunSign: number;
    planets: Record<number, number>; // planetId → expected sign
  };
}

const TEST_CASES: TestCase[] = [
  {
    label: 'Delhi, 15 Jan 1990, 10:30 IST',
    birthData: {
      name: 'Test Delhi',
      date: '1990-01-15',
      time: '10:30',
      place: 'New Delhi',
      lat: 28.6139,
      lng: 77.209,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
    expected: {
      lagna: 12,          // Pisces
      moonSign: 5,        // Leo
      moonNakshatra: 'Purva Phalguni',
      sunSign: 10,        // Capricorn
      planets: {
        0: 10,  // Sun → Capricorn
        1: 5,   // Moon → Leo
        2: 8,   // Mars → Scorpio
        3: 9,   // Mercury → Sagittarius
        4: 3,   // Jupiter → Gemini
        5: 10,  // Venus → Capricorn
        6: 9,   // Saturn → Sagittarius
        7: 10,  // Rahu → Capricorn
        8: 4,   // Ketu → Cancer
      },
    },
  },
  {
    label: 'New York, 4 Jul 1985, 14:15 EDT (DST)',
    birthData: {
      name: 'Test NYC',
      date: '1985-07-04',
      time: '14:15',
      place: 'New York',
      lat: 40.7128,
      lng: -74.006,
      timezone: 'America/New_York',
      ayanamsha: 'lahiri',
    },
    expected: {
      lagna: 7,           // Libra
      moonSign: 10,       // Capricorn
      moonNakshatra: 'Shravana',
      sunSign: 3,         // Gemini
      planets: {
        0: 3,   // Sun → Gemini
        1: 10,  // Moon → Capricorn
        2: 3,   // Mars → Gemini
        3: 4,   // Mercury → Cancer
        4: 10,  // Jupiter → Capricorn
        5: 2,   // Venus → Taurus
        6: 7,   // Saturn → Libra
        7: 1,   // Rahu → Aries
        8: 7,   // Ketu → Libra
      },
    },
  },
  {
    label: 'Zurich, 20 Mar 1995, 08:45 CET (winter, no DST)',
    birthData: {
      name: 'Test Zurich',
      date: '1995-03-20',
      time: '08:45',
      place: 'Zurich',
      lat: 47.3769,
      lng: 8.5417,
      timezone: 'Europe/Zurich',
      ayanamsha: 'lahiri',
    },
    expected: {
      lagna: 2,           // Taurus
      moonSign: 7,        // Libra
      moonNakshatra: 'Swati',
      sunSign: 12,        // Pisces
      planets: {
        0: 12,  // Sun → Pisces
        1: 7,   // Moon → Libra
        2: 4,   // Mars → Cancer
        3: 11,  // Mercury → Aquarius
        4: 8,   // Jupiter → Scorpio
        5: 10,  // Venus → Capricorn
        6: 11,  // Saturn → Aquarius
        7: 7,   // Rahu → Libra
        8: 1,   // Ketu → Aries
      },
    },
  },
  {
    label: 'Mumbai, 15 Aug 1947, 00:00 IST (India Independence)',
    birthData: {
      name: 'India',
      date: '1947-08-15',
      time: '00:00',
      place: 'Mumbai',
      lat: 19.076,
      lng: 72.8777,
      timezone: 'Asia/Kolkata',
      ayanamsha: 'lahiri',
    },
    expected: {
      lagna: 1,           // Aries
      moonSign: 4,        // Cancer
      moonNakshatra: 'Pushya',
      sunSign: 4,         // Cancer
      planets: {
        0: 4,   // Sun → Cancer
        1: 4,   // Moon → Cancer
        2: 3,   // Mars → Gemini
        3: 4,   // Mercury → Cancer
        4: 7,   // Jupiter → Libra
        5: 4,   // Venus → Cancer
        6: 4,   // Saturn → Cancer
        7: 2,   // Rahu → Taurus
        8: 8,   // Ketu → Scorpio
      },
    },
  },
  {
    label: 'London, 21 Jun 2000, 18:30 BST (DST)',
    birthData: {
      name: 'Test London',
      date: '2000-06-21',
      time: '18:30',
      place: 'London',
      lat: 51.5074,
      lng: -0.1278,
      timezone: 'Europe/London',
      ayanamsha: 'lahiri',
    },
    expected: {
      lagna: 8,           // Scorpio
      moonSign: 10,       // Capricorn
      moonNakshatra: 'Dhanishtha',
      sunSign: 3,         // Gemini
      planets: {
        0: 3,   // Sun → Gemini
        1: 10,  // Moon → Capricorn
        2: 3,   // Mars → Gemini
        3: 3,   // Mercury → Gemini
        4: 2,   // Jupiter → Taurus
        5: 3,   // Venus → Gemini
        6: 2,   // Saturn → Taurus
        7: 4,   // Rahu → Cancer
        8: 10,  // Ketu → Capricorn
      },
    },
  },
];

// ── Tests ────────────────────────────────────────────────────────────────

describe('Kundali Validation (5 charts, 3 continents)', () => {
  for (const tc of TEST_CASES) {
    describe(tc.label, () => {
      const kundali = generateKundali(tc.birthData);

      it('ascendant (lagna) sign is correct', () => {
        expect(kundali.ascendant.sign).toBe(tc.expected.lagna);
      });

      it('Moon sign is correct', () => {
        expect(getPlanetSign(kundali, 1)).toBe(tc.expected.moonSign);
      });

      it('Moon nakshatra is correct', () => {
        expect(getPlanetNakshatra(kundali, 1)).toBe(tc.expected.moonNakshatra);
      });

      it('Sun sign is correct', () => {
        expect(getPlanetSign(kundali, 0)).toBe(tc.expected.sunSign);
      });

      it('all 9 planet signs match Swiss Ephemeris', () => {
        const mismatches: string[] = [];
        for (const [idStr, expectedSign] of Object.entries(tc.expected.planets)) {
          const id = Number(idStr);
          const actual = getPlanetSign(kundali, id);
          if (actual !== expectedSign) {
            const pName = kundali.planets.find(p => p.planet.id === id)?.planet.name.en || `P${id}`;
            mismatches.push(`${pName}: got ${signName(actual)}, expected ${signName(expectedSign)}`);
          }
        }
        expect(mismatches).toEqual([]);
      });
    });
  }
});

// ── Panchang Validation (sunrise/moonrise vs Drik) ───────────────────

describe('Panchang Accuracy (Delhi, 2 Apr 2026 vs Drik Panchang)', () => {
  const panchang = computePanchang({
    year: 2026, month: 4, day: 2,
    lat: 28.6139, lng: 77.209,
    tzOffset: 5.5,
    timezone: 'Asia/Kolkata',
    locationName: 'New Delhi',
  });

  it('tithi is Purnima', () => {
    expect(panchang.tithi.name.en).toBe('Purnima');
  });

  it('nakshatra is Hasta', () => {
    expect(panchang.nakshatra.name.en).toBe('Hasta');
  });

  it('yoga is Dhruva', () => {
    expect(panchang.yoga.name.en).toBe('Dhruva');
  });

  it('vara is Thursday', () => {
    expect(panchang.vara.name.en).toBe('Thursday');
  });

  it('sunrise is 06:10 (Drik: 06:10)', () => {
    expect(panchang.sunrise).toBe('06:10');
  });

  it('sunset is 18:39 (Drik: 18:39)', () => {
    expect(panchang.sunset).toBe('18:39');
  });

  it('moonrise within 3 min of Drik (19:07)', () => {
    // Our: 19:05, Drik: 19:07 — allow ±3 min
    const [h, m] = panchang.moonrise.split(':').map(Number);
    const ourMin = h * 60 + m;
    const drikMin = 19 * 60 + 7;
    expect(Math.abs(ourMin - drikMin)).toBeLessThanOrEqual(3);
  });

  it('nakshatra transition time within 2 min of Drik (17:38)', () => {
    expect(panchang.nakshatraTransition.endTime).toBe('17:38');
  });

  it('tithi end time within 2 min of Drik (07:41)', () => {
    const [h, m] = panchang.tithiTransition.endTime.split(':').map(Number);
    const ourMin = h * 60 + m;
    const drikMin = 7 * 60 + 41;
    expect(Math.abs(ourMin - drikMin)).toBeLessThanOrEqual(2);
  });
});

// ── Timezone / DST Validation ────────────────────────────────────────

describe('Timezone & DST handling', () => {

  it('Zurich CET (Jan, UTC+1) sunrise is reasonable (~08:00)', () => {
    const p = computePanchang({
      year: 2026, month: 1, day: 15,
      lat: 46.4833, lng: 6.8167, tzOffset: 1,
      timezone: 'Europe/Zurich', locationName: 'Zurich',
    });
    const [h] = p.sunrise.split(':').map(Number);
    expect(h).toBeGreaterThanOrEqual(7);
    expect(h).toBeLessThanOrEqual(9);
  });

  it('Zurich CEST (Jul, UTC+2) sunrise is reasonable (~05:30-06:00)', () => {
    const p = computePanchang({
      year: 2026, month: 7, day: 15,
      lat: 46.4833, lng: 6.8167, tzOffset: 2,
      timezone: 'Europe/Zurich', locationName: 'Zurich',
    });
    const [h] = p.sunrise.split(':').map(Number);
    expect(h).toBeGreaterThanOrEqual(5);
    expect(h).toBeLessThanOrEqual(6);
  });

  it('Nepal (UTC+5:45) fractional offset works', () => {
    const p = computePanchang({
      year: 2026, month: 4, day: 2,
      lat: 27.7172, lng: 85.324, tzOffset: 5.75,
      timezone: 'Asia/Kathmandu', locationName: 'Kathmandu',
    });
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    const [h] = p.sunrise.split(':').map(Number);
    expect(h).toBeGreaterThanOrEqual(5);
    expect(h).toBeLessThanOrEqual(7);
  });

  it('negative UTC offset (New York EDT, UTC-4) works', () => {
    const p = computePanchang({
      year: 2026, month: 4, day: 2,
      lat: 40.7128, lng: -74.006, tzOffset: -4,
      timezone: 'America/New_York', locationName: 'New York',
    });
    const [h] = p.sunrise.split(':').map(Number);
    expect(h).toBeGreaterThanOrEqual(6);
    expect(h).toBeLessThanOrEqual(7);
  });
});

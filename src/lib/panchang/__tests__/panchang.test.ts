/**
 * Comprehensive unit tests for Panchang calculator
 * Tests all five elements: Tithi, Nakshatra, Yoga, Karana, and inauspicious periods
 */

import { describe, it, expect } from 'vitest';
import {
  calculateTithi,
  calculateNakshatra,
  calculateYoga,
  calculateKarana,
  calculateInauspiciousPeriods,
  calculatePanchang,
} from '../calculator';
import type { PanchangInput } from '../calculator';
import { TITHI_NAMES, NAKSHATRA_DATA, YOGA_DATA, KARANA_NAMES } from '../types';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Create a Date at a given hour:minute on 2024-03-20 (UTC) */
function makeDate(hour: number, minute: number): Date {
  return new Date(Date.UTC(2024, 2, 20, hour, minute, 0));
}

// ---------------------------------------------------------------------------
// 1. Tithi Calculation (14 tests)
// ---------------------------------------------------------------------------

describe('calculateTithi', () => {
  it('moonLon - sunLon = 0 gives Shukla Pratipada (tithi 1)', () => {
    const t = calculateTithi(100, 100);
    expect(t.number).toBe(1);
    expect(t.name).toBe('Pratipada');
    expect(t.paksha).toBe('Shukla');
  });

  it('moonLon - sunLon = 180 gives Krishna Pratipada (tithi 16)', () => {
    const t = calculateTithi(0, 180);
    expect(t.number).toBe(16);
    expect(t.name).toBe('Pratipada');
    expect(t.paksha).toBe('Krishna');
  });

  it('diff = 12 exactly gives boundary of tithi 2 (Shukla Dwitiya)', () => {
    const t = calculateTithi(0, 12);
    expect(t.number).toBe(2);
    expect(t.name).toBe('Dwitiya');
    expect(t.paksha).toBe('Shukla');
  });

  it('diff just below 12 stays at tithi 1', () => {
    const t = calculateTithi(0, 11.999);
    expect(t.number).toBe(1);
  });

  it('all 30 tithis at exact boundaries: diff = (n-1)*12', () => {
    for (let n = 1; n <= 30; n++) {
      const diff = (n - 1) * 12;
      // Use sunLon=0 so moonLon=diff directly
      const t = calculateTithi(0, diff);
      expect(t.number).toBe(n);
    }
  });

  it('paksha assignment: tithis 1-15 are Shukla', () => {
    for (let n = 1; n <= 15; n++) {
      const t = calculateTithi(0, (n - 1) * 12);
      expect(t.paksha).toBe('Shukla');
    }
  });

  it('paksha assignment: tithis 16-30 are Krishna', () => {
    for (let n = 16; n <= 30; n++) {
      const t = calculateTithi(0, (n - 1) * 12);
      expect(t.paksha).toBe('Krishna');
    }
  });

  it('wrapping: moonLon=10, sunLon=350 gives diff=20, tithi 2', () => {
    // normalizeAngle(10-350) = normalizeAngle(-340) = 20
    const t = calculateTithi(350, 10);
    expect(t.number).toBe(2);
    expect(t.name).toBe('Dwitiya');
    expect(t.paksha).toBe('Shukla');
  });

  it('tithi 15 is Purnima (full moon)', () => {
    const t = calculateTithi(0, 14 * 12); // diff = 168
    expect(t.number).toBe(15);
    expect(t.name).toBe('Purnima');
    expect(t.paksha).toBe('Shukla');
  });

  it('tithi 30 is Amavasya (new moon)', () => {
    const t = calculateTithi(0, 29 * 12); // diff = 348
    expect(t.number).toBe(30);
    expect(t.name).toBe('Amavasya');
    expect(t.paksha).toBe('Krishna');
  });

  it('every tithi has a non-empty deity string', () => {
    for (let n = 1; n <= 30; n++) {
      const t = calculateTithi(0, (n - 1) * 12);
      expect(t.deity).toBeTruthy();
      expect(typeof t.deity).toBe('string');
    }
  });

  it('every tithi has a non-empty description string', () => {
    for (let n = 1; n <= 30; n++) {
      const t = calculateTithi(0, (n - 1) * 12);
      expect(t.description).toBeTruthy();
    }
  });

  it('diff = 359.99 remains tithi 30', () => {
    const t = calculateTithi(0, 359.99);
    expect(t.number).toBe(30);
  });

  it('large angle values are handled correctly', () => {
    // sunLon=720 normalizes to 0, moonLon=732 normalizes to 12
    const t = calculateTithi(720, 732);
    expect(t.number).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// 2. Nakshatra Calculation (14 tests)
// ---------------------------------------------------------------------------

const NAKSHATRA_SPAN = 360 / 27; // ~13.3333 degrees

describe('calculateNakshatra', () => {
  it('moonLon = 0 gives Ashwini (nakshatra 1)', () => {
    const n = calculateNakshatra(0);
    expect(n.number).toBe(1);
    expect(n.name).toBe('Ashwini');
  });

  it('moonLon = 13.334 gives Bharani (nakshatra 2)', () => {
    const n = calculateNakshatra(NAKSHATRA_SPAN + 0.001);
    expect(n.number).toBe(2);
    expect(n.name).toBe('Bharani');
  });

  it('moonLon = 346.667 gives Revati (nakshatra 27)', () => {
    const n = calculateNakshatra(26 * NAKSHATRA_SPAN + 0.001);
    expect(n.number).toBe(27);
    expect(n.name).toBe('Revati');
  });

  it('all 27 nakshatras at midpoints', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * NAKSHATRA_SPAN;
      const n = calculateNakshatra(midpoint);
      expect(n.number).toBe(i + 1);
      expect(n.name).toBe(NAKSHATRA_DATA[i].name);
    }
  });

  it('pada 1 at start of nakshatra', () => {
    const n = calculateNakshatra(0.5); // early in Ashwini
    expect(n.pada).toBe(1);
  });

  it('pada 2 in second quarter of nakshatra', () => {
    const padaSpan = NAKSHATRA_SPAN / 4;
    const n = calculateNakshatra(padaSpan + 0.5);
    expect(n.pada).toBe(2);
  });

  it('pada 3 in third quarter of nakshatra', () => {
    const padaSpan = NAKSHATRA_SPAN / 4;
    const n = calculateNakshatra(2 * padaSpan + 0.5);
    expect(n.pada).toBe(3);
  });

  it('pada 4 in fourth quarter of nakshatra', () => {
    const padaSpan = NAKSHATRA_SPAN / 4;
    const n = calculateNakshatra(3 * padaSpan + 0.5);
    expect(n.pada).toBe(4);
  });

  it('pada never exceeds 4', () => {
    // Near the very end of the nakshatra span
    const n = calculateNakshatra(NAKSHATRA_SPAN - 0.001);
    expect(n.pada).toBeLessThanOrEqual(4);
  });

  it('ruler is populated for all nakshatras', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * NAKSHATRA_SPAN;
      const n = calculateNakshatra(midpoint);
      expect(n.ruler).toBeTruthy();
    }
  });

  it('deity is populated for all nakshatras', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * NAKSHATRA_SPAN;
      const n = calculateNakshatra(midpoint);
      expect(n.deity).toBeTruthy();
    }
  });

  it('symbol is populated for all nakshatras', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * NAKSHATRA_SPAN;
      const n = calculateNakshatra(midpoint);
      expect(n.symbol).toBeTruthy();
    }
  });

  it('description is populated for all nakshatras', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * NAKSHATRA_SPAN;
      const n = calculateNakshatra(midpoint);
      expect(n.description).toBeTruthy();
    }
  });

  it('boundary: last degree of Ashwini still gives nakshatra 1', () => {
    const n = calculateNakshatra(NAKSHATRA_SPAN - 0.01);
    expect(n.number).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 3. Yoga Calculation (8 tests)
// ---------------------------------------------------------------------------

const YOGA_SPAN = 360 / 27; // ~13.3333 degrees

describe('calculateYoga', () => {
  it('yoga 1 (Vishkambha) when sunLon + moonLon = 0', () => {
    const y = calculateYoga(0, 0);
    expect(y.number).toBe(1);
    expect(y.name).toBe('Vishkambha');
  });

  it('yoga 2 (Priti) when sum just crosses 13.333', () => {
    const y = calculateYoga(7, 7); // sum = 14
    expect(y.number).toBe(2);
    expect(y.name).toBe('Priti');
  });

  it('yoga 27 (Vaidhriti) when sum is near 360', () => {
    const y = calculateYoga(180, 170); // sum = 350
    expect(y.number).toBe(27);
    expect(y.name).toBe('Vaidhriti');
  });

  it('all 27 yogas at midpoints', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * YOGA_SPAN;
      // Keep sunLon=0 so moonLon controls the sum
      const y = calculateYoga(0, midpoint);
      expect(y.number).toBe(i + 1);
      expect(y.name).toBe(YOGA_DATA[i].name);
    }
  });

  it('sum wraps around: 200 + 200 = 400 -> normalized 40 -> yoga 4', () => {
    const y = calculateYoga(200, 200); // normalizeAngle(400)=40, 40/13.333=3 => yoga 4
    expect(y.number).toBe(4);
    expect(y.name).toBe('Saubhagya');
  });

  it('nature field is one of Auspicious, Inauspicious, Mixed', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * YOGA_SPAN;
      const y = calculateYoga(0, midpoint);
      expect(['Auspicious', 'Inauspicious', 'Mixed']).toContain(y.nature);
    }
  });

  it('meaning field is non-empty for all yogas', () => {
    for (let i = 0; i < 27; i++) {
      const midpoint = (i + 0.5) * YOGA_SPAN;
      const y = calculateYoga(0, midpoint);
      expect(y.meaning).toBeTruthy();
    }
  });

  it('Vyatipata (yoga 17) is Inauspicious', () => {
    const midpoint = (16 + 0.5) * YOGA_SPAN;
    const y = calculateYoga(0, midpoint);
    expect(y.name).toBe('Vyatipata');
    expect(y.nature).toBe('Inauspicious');
  });
});

// ---------------------------------------------------------------------------
// 4. Karana Calculation (10 tests)
// ---------------------------------------------------------------------------

describe('calculateKarana', () => {
  it('Kimstughna at diff = 0', () => {
    const k = calculateKarana(0, 0);
    expect(k.name).toBe('Kimstughna');
    expect(k.nature).toBe('Fixed');
  });

  it('diff = 6 gives first movable karana (Bava)', () => {
    const k = calculateKarana(0, 6);
    expect(k.name).toBe('Bava');
    expect(k.nature).toBe('Movable');
  });

  it('diff = 12 gives Balava (second in cycle)', () => {
    const k = calculateKarana(0, 12);
    expect(k.name).toBe('Balava');
    expect(k.nature).toBe('Movable');
  });

  it('movable karanas cycle through 7 names', () => {
    const expected = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
    for (let i = 0; i < 7; i++) {
      const k = calculateKarana(0, (i + 1) * 6);
      expect(k.name).toBe(expected[i]);
    }
  });

  it('Vishti (Bhadra) is Unstable', () => {
    // Vishti is the 7th in the movable cycle => karanaNum = 7, cycleIndex = 6
    const k = calculateKarana(0, 7 * 6); // diff = 42
    expect(k.name).toBe('Vishti');
    expect(k.nature).toBe('Unstable');
  });

  it('movable cycle repeats: karanaNum 8 = Bava again', () => {
    const k = calculateKarana(0, 8 * 6); // diff = 48
    expect(k.name).toBe('Bava');
    expect(k.nature).toBe('Movable');
  });

  it('fixed karana Shakuni at karanaNum 57 (diff = 342)', () => {
    const k = calculateKarana(0, 342);
    expect(k.name).toBe('Shakuni');
    expect(k.nature).toBe('Fixed');
  });

  it('fixed karana Chatushpada at karanaNum 58 (diff = 348)', () => {
    const k = calculateKarana(0, 348);
    expect(k.name).toBe('Chatushpada');
    expect(k.nature).toBe('Fixed');
  });

  it('fixed karana Naga at karanaNum 59 (diff = 354)', () => {
    const k = calculateKarana(0, 354);
    expect(k.name).toBe('Naga');
    expect(k.nature).toBe('Fixed');
  });

  it('karana number is always 1-11', () => {
    // Spot check various diffs across the full range
    for (let diff = 0; diff < 360; diff += 6) {
      const k = calculateKarana(0, diff);
      expect(k.number).toBeGreaterThanOrEqual(1);
      expect(k.number).toBeLessThanOrEqual(11);
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Inauspicious Periods (9 tests)
// ---------------------------------------------------------------------------

describe('calculateInauspiciousPeriods', () => {
  // Standard 12-hour day: sunrise 6:00 AM, sunset 6:00 PM
  const sunrise = new Date(2024, 2, 20, 6, 0, 0);
  const sunset = new Date(2024, 2, 20, 18, 0, 0);
  const eighthDuration = 90; // 720 minutes / 8 = 90 minutes

  // Rahu Kalam order: Sun=8, Mon=2, Tue=7, Wed=5, Thu=6, Fri=4, Sat=3
  // These are "which 8th of the day" (1-indexed)
  const rahuPeriods = [8, 2, 7, 5, 6, 4, 3];

  it.each([
    [0, 'Sunday'],
    [1, 'Monday'],
    [2, 'Tuesday'],
    [3, 'Wednesday'],
    [4, 'Thursday'],
    [5, 'Friday'],
    [6, 'Saturday'],
  ])('returns valid periods for dayOfWeek=%i (%s)', (dayOfWeek) => {
    const periods = calculateInauspiciousPeriods(sunrise, sunset, dayOfWeek as number);

    expect(periods.rahuKalam).toBeDefined();
    expect(periods.yamagandam).toBeDefined();
    expect(periods.gulikaKalam).toBeDefined();

    expect(periods.rahuKalam.label).toBe('Rahu Kalam');
    expect(periods.yamagandam.label).toBe('Yamagandam');
    expect(periods.gulikaKalam.label).toBe('Gulika Kalam');

    // Each period should be exactly 1/8 of the day
    const rahuDuration = periods.rahuKalam.end.getTime() - periods.rahuKalam.start.getTime();
    expect(rahuDuration).toBeCloseTo(eighthDuration * 60 * 1000, -2);
  });

  it('Monday Rahu Kalam starts at 7:30 for a 6AM-6PM day', () => {
    // Monday rahuPeriod = 2, so start = sunrise + (2-1)*90min = 6:00 + 90min = 7:30
    const periods = calculateInauspiciousPeriods(sunrise, sunset, 1);
    expect(periods.rahuKalam.start.getHours()).toBe(7);
    expect(periods.rahuKalam.start.getMinutes()).toBe(30);
    expect(periods.rahuKalam.end.getHours()).toBe(9);
    expect(periods.rahuKalam.end.getMinutes()).toBe(0);
  });

  it('Saturday Rahu Kalam starts at 9:00 for a 6AM-6PM day', () => {
    // Saturday rahuPeriod = 3, so start = 6:00 + (3-1)*90min = 6:00 + 180min = 9:00
    const periods = calculateInauspiciousPeriods(sunrise, sunset, 6);
    expect(periods.rahuKalam.start.getHours()).toBe(9);
    expect(periods.rahuKalam.start.getMinutes()).toBe(0);
  });

  it('all three periods are disjoint', () => {
    for (let dow = 0; dow <= 6; dow++) {
      const p = calculateInauspiciousPeriods(sunrise, sunset, dow);
      const intervals = [
        { s: p.rahuKalam.start.getTime(), e: p.rahuKalam.end.getTime() },
        { s: p.yamagandam.start.getTime(), e: p.yamagandam.end.getTime() },
        { s: p.gulikaKalam.start.getTime(), e: p.gulikaKalam.end.getTime() },
      ];

      // Check each pair for non-overlap
      for (let i = 0; i < intervals.length; i++) {
        for (let j = i + 1; j < intervals.length; j++) {
          const overlap =
            intervals[i].s < intervals[j].e && intervals[j].s < intervals[i].e;
          expect(overlap).toBe(false);
        }
      }
    }
  });

  it('all periods fall within sunrise-sunset', () => {
    for (let dow = 0; dow <= 6; dow++) {
      const p = calculateInauspiciousPeriods(sunrise, sunset, dow);
      for (const period of [p.rahuKalam, p.yamagandam, p.gulikaKalam]) {
        expect(period.start.getTime()).toBeGreaterThanOrEqual(sunrise.getTime());
        expect(period.end.getTime()).toBeLessThanOrEqual(sunset.getTime());
      }
    }
  });

  it('Rahu Kalam placement matches traditional order for each weekday', () => {
    for (let dow = 0; dow <= 6; dow++) {
      const p = calculateInauspiciousPeriods(sunrise, sunset, dow);
      const expectedStartMinutes = (rahuPeriods[dow] - 1) * eighthDuration;
      const expectedStart = new Date(sunrise.getTime() + expectedStartMinutes * 60 * 1000);
      expect(p.rahuKalam.start.getTime()).toBe(expectedStart.getTime());
    }
  });

  it('handles short winter day (sunrise 7:30, sunset 16:30)', () => {
    const winterSunrise = new Date(2024, 11, 21, 7, 30, 0);
    const winterSunset = new Date(2024, 11, 21, 16, 30, 0);
    const periods = calculateInauspiciousPeriods(winterSunrise, winterSunset, 6); // Saturday
    const dayMin = (16.5 - 7.5) * 60; // 540 minutes
    const eighthMin = dayMin / 8; // 67.5 minutes
    const rahuDuration = (periods.rahuKalam.end.getTime() - periods.rahuKalam.start.getTime()) / 60000;
    expect(rahuDuration).toBeCloseTo(eighthMin, 1);
  });
});

// ---------------------------------------------------------------------------
// 6. Full Panchang (calculatePanchang) (7 tests)
// ---------------------------------------------------------------------------

describe('calculatePanchang', () => {
  const delhiInput: PanchangInput = {
    year: 2024,
    month: 3,
    day: 20,
    latitude: 28.6139,
    longitude: 77.209,
    timezoneOffset: 5.5,
    locationName: 'Delhi',
  };

  it('returns all five panchang elements for Delhi on 2024-03-20', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.tithi).toBeDefined();
    expect(p.tithi.number).toBeGreaterThanOrEqual(1);
    expect(p.tithi.number).toBeLessThanOrEqual(30);

    expect(p.nakshatra).toBeDefined();
    expect(p.nakshatra.number).toBeGreaterThanOrEqual(1);
    expect(p.nakshatra.number).toBeLessThanOrEqual(27);

    expect(p.yoga).toBeDefined();
    expect(p.yoga.number).toBeGreaterThanOrEqual(1);
    expect(p.yoga.number).toBeLessThanOrEqual(27);

    expect(p.karana).toBeDefined();
    expect(p.karana.number).toBeGreaterThanOrEqual(1);
    expect(p.karana.number).toBeLessThanOrEqual(11);

    expect(p.date).toBeInstanceOf(Date);
  });

  it('returns sunrise and sunset for Delhi', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.sunrise).toBeInstanceOf(Date);
    expect(p.sunset).toBeInstanceOf(Date);
    // Sunrise should be before sunset
    expect(p.sunrise.getTime()).toBeLessThan(p.sunset.getTime());
  });

  it('ayanamsa is positive and approximately 24 degrees', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.ayanamsa).toBeGreaterThan(23);
    expect(p.ayanamsa).toBeLessThan(25);
  });

  it('location data is returned correctly', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.location.name).toBe('Delhi');
    expect(p.location.latitude).toBeCloseTo(28.6139, 3);
    expect(p.location.longitude).toBeCloseTo(77.209, 3);
    expect(p.location.timezone).toBe(5.5);
  });

  it('sun and moon longitudes are in valid range 0-360', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.sunLongitude).toBeGreaterThanOrEqual(0);
    expect(p.sunLongitude).toBeLessThan(360);
    expect(p.moonLongitude).toBeGreaterThanOrEqual(0);
    expect(p.moonLongitude).toBeLessThan(360);
  });

  it('works for London (different timezone and latitude)', () => {
    const londonInput: PanchangInput = {
      year: 2024,
      month: 3,
      day: 20,
      latitude: 51.5074,
      longitude: -0.1278,
      timezoneOffset: 0,
      locationName: 'London',
    };
    const p = calculatePanchang(londonInput);
    expect(p.tithi).toBeDefined();
    expect(p.nakshatra).toBeDefined();
    expect(p.yoga).toBeDefined();
    expect(p.karana).toBeDefined();
    expect(p.location.name).toBe('London');
    expect(p.sunrise).toBeInstanceOf(Date);
  });

  it('works for New York (negative timezone offset)', () => {
    const nyInput: PanchangInput = {
      year: 2024,
      month: 6,
      day: 15,
      latitude: 40.7128,
      longitude: -74.006,
      timezoneOffset: -4, // EDT
      locationName: 'New York',
    };
    const p = calculatePanchang(nyInput);
    expect(p.tithi).toBeDefined();
    expect(p.nakshatra).toBeDefined();
    expect(p.ayanamsa).toBeGreaterThan(23);
    expect(p.location.name).toBe('New York');
    // Moon phase should be 0-360
    expect(p.moonPhase).toBeGreaterThanOrEqual(0);
    expect(p.moonPhase).toBeLessThan(360);
  });

  it('inauspicious periods are included in full panchang result', () => {
    const p = calculatePanchang(delhiInput);
    expect(p.rahuKalam).toBeDefined();
    expect(p.rahuKalam.start).toBeInstanceOf(Date);
    expect(p.rahuKalam.end).toBeInstanceOf(Date);
    expect(p.yamagandam).toBeDefined();
    expect(p.gulikaKalam).toBeDefined();
  });

  it('defaults ayanamsa type to lahiri', () => {
    const p1 = calculatePanchang(delhiInput);
    const p2 = calculatePanchang({ ...delhiInput, ayanamsaType: 'lahiri' });
    expect(p1.ayanamsa).toBeCloseTo(p2.ayanamsa, 6);
    expect(p1.sunLongitude).toBeCloseTo(p2.sunLongitude, 6);
    expect(p1.moonLongitude).toBeCloseTo(p2.moonLongitude, 6);
  });
});

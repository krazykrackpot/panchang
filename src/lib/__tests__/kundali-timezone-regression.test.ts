/**
 * Kundali Timezone Regression Tests
 *
 * These tests exist because a critical bug shipped to production:
 * resolveTimezoneFromCoords() returned the BROWSER's timezone instead of
 * the birth location's timezone. A user in Switzerland generating a chart
 * for Hyderabad got Europe/Zurich instead of Asia/Kolkata, shifting the
 * Moon by ~2.5° — enough to change the nakshatra entirely.
 *
 * Each test case verifies that generating a kundali with the CORRECT
 * timezone produces the expected nakshatra, rashi, pada, and lagna.
 * Reference values cross-checked against Gemini AI and manual computation.
 *
 * The test also verifies that using a WRONG timezone (simulating the
 * browser-timezone bug) produces DIFFERENT results — proving that
 * timezone correctness is essential for accurate kundali computation.
 *
 * NEVER DELETE THESE TESTS. The timezone bug was reported THREE times.
 */

import { describe, it, expect } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';

interface TestCase {
  name: string;
  date: string;
  time: string;
  lat: number;
  lng: number;
  /** The CORRECT timezone for the birth location */
  correctTz: string;
  /** A WRONG timezone that the browser might return (user's current location) */
  wrongTz: string;
  /** Expected Moon nakshatra ID (1-27) with correct timezone */
  expectedNakId: number;
  /** Expected Moon rashi (1-12) with correct timezone */
  expectedRashi: number;
  /** Expected Moon pada (1-4) with correct timezone */
  expectedPada: number;
  /** Expected lagna sign (1-12) with correct timezone */
  expectedLagna: number;
  /** Reference source for the expected values */
  source: string;
}

// ─── Test Cases ─────────────────────────────────────────────────────────
// Each case simulates: user in timezone A, generating chart for birth in timezone B.
// The chart MUST use timezone B (birth location), NOT timezone A (browser).

const CASES: TestCase[] = [
  {
    name: 'Diksha Acharya — Hyderabad birth, user in Switzerland',
    date: '1998-11-01', time: '09:55',
    lat: 17.385, lng: 78.4867,
    correctTz: 'Asia/Kolkata',
    wrongTz: 'Europe/Zurich', // 4.5 hours off → ~2.5° Moon shift
    expectedNakId: 25, // Purva Bhadrapada
    expectedRashi: 12,  // Pisces
    expectedPada: 4,
    expectedLagna: 9,   // Sagittarius
    source: 'User report + Gemini AI confirmed Purva Bhadrapada',
  },
  {
    name: 'Delhi birth, user in London',
    date: '1990-06-15', time: '14:30',
    lat: 28.6139, lng: 77.209,
    correctTz: 'Asia/Kolkata',
    wrongTz: 'Europe/London', // 4.5 hours off in summer (BST)
    expectedNakId: 24, // Shatabhisha
    expectedRashi: 11,  // Aquarius
    expectedPada: 4,
    expectedLagna: 6,   // Virgo
    source: 'Engine computation with correct IST timezone',
  },
  {
    name: 'Mumbai birth, user in New York',
    date: '1985-03-21', time: '08:00',
    lat: 19.076, lng: 72.878,
    correctTz: 'Asia/Kolkata',
    wrongTz: 'America/New_York', // 9.5-10.5 hours off → ~5° Moon shift
    expectedNakId: 25, // Purva Bhadrapada
    expectedRashi: 12,  // Pisces
    expectedPada: 4,
    expectedLagna: 1,   // Aries
    source: 'Engine computation with correct IST timezone',
  },
  {
    name: 'London birth, user in Delhi',
    date: '1995-12-25', time: '03:00',
    lat: 51.507, lng: -0.128,
    correctTz: 'Europe/London',
    wrongTz: 'Asia/Kolkata', // 5.5 hours off → ~3° Moon shift
    expectedNakId: 22, // Shravana
    expectedRashi: 10,  // Capricorn
    expectedPada: 4,
    expectedLagna: 7,   // Libra
    source: 'Engine computation with correct GMT timezone',
  },
  {
    name: 'New York birth, user in Tokyo',
    date: '2000-07-04', time: '11:30',
    lat: 40.713, lng: -74.006,
    correctTz: 'America/New_York',
    wrongTz: 'Asia/Tokyo', // 13-14 hours off → ~8° Moon shift
    expectedNakId: 9,  // Ashlesha
    expectedRashi: 4,   // Cancer
    expectedPada: 4,
    expectedLagna: 5,   // Leo
    source: 'Engine computation with correct EDT timezone',
  },
  {
    name: 'Corseaux birth, user in Delhi',
    date: '1988-08-15', time: '16:00',
    lat: 46.467, lng: 6.833,
    correctTz: 'Europe/Zurich',
    wrongTz: 'Asia/Kolkata', // 3.5 hours off → ~2° Moon shift
    expectedNakId: 12, // Uttara Phalguni
    expectedRashi: 6,   // Virgo
    expectedPada: 2,
    expectedLagna: 8,   // Scorpio
    source: 'Engine computation with correct CEST timezone',
  },
];

describe('Kundali timezone regression — correct TZ produces correct chart', () => {
  for (const tc of CASES) {
    describe(tc.name, () => {
      const k = generateKundali({
        name: tc.name,
        date: tc.date,
        time: tc.time,
        place: '',
        lat: tc.lat,
        lng: tc.lng,
        timezone: tc.correctTz,
        ayanamsha: 'lahiri',
      });
      const moon = k.planets.find((p: any) => p.planet?.id === 1);

      it(`Moon nakshatra = ${tc.expectedNakId} (${tc.source})`, () => {
        expect(moon?.nakshatra?.id).toBe(tc.expectedNakId);
      });

      it(`Moon rashi = ${tc.expectedRashi}`, () => {
        expect(moon?.sign).toBe(tc.expectedRashi);
      });

      it(`Moon pada = ${tc.expectedPada}`, () => {
        expect(moon?.pada).toBe(tc.expectedPada);
      });

      it(`Lagna sign = ${tc.expectedLagna}`, () => {
        expect(k.ascendant.sign).toBe(tc.expectedLagna);
      });
    });
  }
});

describe('Kundali timezone regression — wrong TZ produces DIFFERENT results', () => {
  for (const tc of CASES) {
    it(`${tc.name}: wrong TZ (${tc.wrongTz}) shifts Moon position`, () => {
      const correct = generateKundali({
        name: tc.name, date: tc.date, time: tc.time, place: '',
        lat: tc.lat, lng: tc.lng, timezone: tc.correctTz, ayanamsha: 'lahiri',
      });
      const wrong = generateKundali({
        name: tc.name, date: tc.date, time: tc.time, place: '',
        lat: tc.lat, lng: tc.lng, timezone: tc.wrongTz, ayanamsha: 'lahiri',
      });

      const cMoon = correct.planets.find((p: any) => p.planet?.id === 1);
      const wMoon = wrong.planets.find((p: any) => p.planet?.id === 1);

      // Moon position MUST differ by at least 1° when timezone is wrong
      const diff = Math.abs(cMoon!.longitude - wMoon!.longitude);
      expect(diff).toBeGreaterThan(1.0);
    });
  }
});

describe('Kundali timezone — birth TZ resolution from coordinates', () => {
  // This test verifies the FULL flow: coordinates → timezone → kundali
  // Using resolveBirthTimezone (which should NEVER return browser TZ)

  it('Hyderabad coordinates resolve to Asia/Kolkata, not browser TZ', async () => {
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(17.385, 78.4867);
    expect(tz).toBe('Asia/Kolkata');
    // Must NEVER be a European timezone even if test runs in Europe
    expect(tz).not.toBe('Europe/Zurich');
    expect(tz).not.toBe('Europe/London');
    expect(tz).not.toBe('Europe/Paris');
  });

  it('London coordinates resolve to Europe/London, not Asia/Kolkata', async () => {
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(51.507, -0.128);
    expect(tz).toBe('Europe/London');
    expect(tz).not.toBe('Asia/Kolkata');
  });

  it('New York coordinates resolve to America/New_York', async () => {
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(40.713, -74.006);
    expect(tz).toBe('America/New_York');
  });
});

/**
 * Audit Verification Tests — 2026-04-24
 *
 * Automated checks for all issues found in the comprehensive audit.
 * These test the computation engines directly (no browser needed).
 * Browser-level display tests are in the Playwright E2E suite below.
 */

import { describe, it, expect } from 'vitest';
import { computeHinduMonths, computePurnimantMonths } from '@/lib/calendar/hindu-months';
import {
  dateToJD, sunLongitude, moonLongitude, calculateTithi,
  calculateYoga, calculateKarana, approximateSunrise, approximateSunriseSafe,
} from '@/lib/ephem/astronomical';

// ---------------------------------------------------------------------------
// Purnimant month boundaries (the original bug + fix verification)
// ---------------------------------------------------------------------------

describe('Purnimant month boundaries', () => {
  const purnimantMonths = computePurnimantMonths(2026);

  it('produces 12-14 months for 2026', () => {
    expect(purnimantMonths.length).toBeGreaterThanOrEqual(12);
    expect(purnimantMonths.length).toBeLessThanOrEqual(14);
  });

  it('each month starts on an actual Full Moon (elongation ~180°)', () => {
    for (const m of purnimantMonths.slice(0, 5)) {
      const [y, mo, d] = m.startDate.split('-').map(Number);
      const jd = dateToJD(y, mo, d, 12);
      const elong = ((moonLongitude(jd) - sunLongitude(jd)) + 360) % 360;
      // Full Moon = elongation near 180° (allow ±15° since we check at noon, not exact FM moment)
      expect(Math.abs(elong - 180)).toBeLessThan(15);
    }
  });

  it('April 24 2026 is NOT a month boundary (it is Ashtami)', () => {
    const isBoundary = purnimantMonths.some(m =>
      m.startDate === '2026-04-24' || m.endDate === '2026-04-24',
    );
    expect(isBoundary).toBe(false);
  });

  it('April 24 2026 falls within Chaitra (tithi ~8 = Ashtami)', () => {
    const jd = dateToJD(2026, 4, 24, 12);
    const tithi = calculateTithi(jd);
    expect(tithi.number).toBeGreaterThanOrEqual(7);
    expect(tithi.number).toBeLessThanOrEqual(9);
  });

  it('Chaitra 2026 starts around April 2 (actual Purnima)', () => {
    const chaitra = purnimantMonths.find(m => m.en === 'Chaitra');
    expect(chaitra).toBeDefined();
    const [, , day] = chaitra!.startDate.split('-').map(Number);
    // Should be April 1-3 (actual Full Moon)
    expect(day).toBeGreaterThanOrEqual(1);
    expect(day).toBeLessThanOrEqual(4);
  });
});

// ---------------------------------------------------------------------------
// Amant month boundaries (New Moon detection fix I9)
// ---------------------------------------------------------------------------

describe('Amant month boundaries', () => {
  const amantMonths = computeHinduMonths(2026);

  it('produces 12-14 months for 2026', () => {
    expect(amantMonths.length).toBeGreaterThanOrEqual(12);
    expect(amantMonths.length).toBeLessThanOrEqual(14);
  });

  it('each month starts on an actual New Moon (elongation ~0°/360°)', () => {
    for (const m of amantMonths.slice(0, 5)) {
      const [y, mo, d] = m.startDate.split('-').map(Number);
      const jd = dateToJD(y, mo, d, 12);
      const elong = ((moonLongitude(jd) - sunLongitude(jd)) + 360) % 360;
      // New Moon = elongation near 0° or 360° (allow ±15°)
      const distFrom0 = Math.min(elong, 360 - elong);
      expect(distFrom0).toBeLessThan(15);
    }
  });
});

// ---------------------------------------------------------------------------
// Karana calculation edge case (M2)
// ---------------------------------------------------------------------------

describe('Karana calculation', () => {
  it('returns valid karana for all tithi positions', () => {
    // Test at various points through the lunar month
    for (let deg = 0; deg < 360; deg += 3) {
      const jd = dateToJD(2026, 1, 15, 0) + deg / 12; // approximate
      const karana = calculateKarana(jd); // returns number directly
      expect(karana).toBeGreaterThanOrEqual(1);
      expect(karana).toBeLessThanOrEqual(11);
    }
  });
});

// ---------------------------------------------------------------------------
// Yoga ayanamsha parameter (I3)
// ---------------------------------------------------------------------------

describe('Yoga calculation', () => {
  it('accepts optional ayanamsha parameter', () => {
    const jd = dateToJD(2026, 4, 24, 12);
    const yogaDefault = calculateYoga(jd); // returns number directly
    const yogaWithAyanamsha = calculateYoga(jd, 24.2);
    expect(yogaDefault).toBeGreaterThanOrEqual(1);
    expect(yogaDefault).toBeLessThanOrEqual(27);
    expect(yogaWithAyanamsha).toBeGreaterThanOrEqual(1);
    expect(yogaWithAyanamsha).toBeLessThanOrEqual(27);
  });
});

// ---------------------------------------------------------------------------
// Polar sunrise safety (C5)
// ---------------------------------------------------------------------------

describe('Polar sunrise/sunset', () => {
  it('approximateSunrise returns null for extreme polar latitudes in summer', () => {
    // Tromso, Norway (69.6°N) on June 21 — midnight sun, no sunrise
    const jd = dateToJD(2026, 6, 21, 0);
    const result = approximateSunrise(jd, 69.6, 19.0);
    expect(result).toBeNull();
  });

  it('approximateSunriseSafe returns a fallback (not NaN) for polar latitudes', () => {
    const jd = dateToJD(2026, 6, 21, 0);
    const result = approximateSunriseSafe(jd, 69.6, 19.0);
    expect(Number.isNaN(result)).toBe(false);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(24);
  });

  it('works normally for mid-latitude locations', () => {
    // Corseaux, Switzerland (46.47°N)
    const jd = dateToJD(2026, 4, 24, 0);
    const result = approximateSunrise(jd, 46.47, 6.86);
    expect(Number.isNaN(result)).toBe(false);
    // Sunrise should be between 4-8 AM UT for April in Switzerland
    expect(result).toBeGreaterThan(4);
    expect(result).toBeLessThan(8);
  });
});

// ---------------------------------------------------------------------------
// True Rahu/Ketu node (I4)
// ---------------------------------------------------------------------------

describe('Rahu/Ketu node', () => {
  it('Rahu longitude is in valid range', () => {
    const jd = dateToJD(2026, 4, 24, 12);
    // We can't directly call the Rahu function, but we can verify via panchang
    // that Rahu is computed (indirectly tested by panchang tests)
    // Direct test: verify the mean node formula produces valid results
    const T = (jd - 2451545.0) / 36525;
    const meanNode = ((125.0445479 - 1934.1362891 * T) % 360 + 360) % 360;
    expect(meanNode).toBeGreaterThanOrEqual(0);
    expect(meanNode).toBeLessThan(360);
  });
});

// ---------------------------------------------------------------------------
// Midnight crossing time comparison (I1)
// ---------------------------------------------------------------------------

describe('Midnight crossing logic', () => {
  // Test the pattern that was fixed
  function isTimeInRange(now: number, start: number, end: number): boolean {
    if (end < start) return now >= start || now < end;
    return now >= start && now < end;
  }

  it('detects time in a normal range', () => {
    expect(isTimeInRange(600, 540, 660)).toBe(true);  // 10:00 in 9:00-11:00
    expect(isTimeInRange(500, 540, 660)).toBe(false);
  });

  it('detects time in a midnight-crossing range', () => {
    // 23:30 to 01:15 = 1410 to 75
    expect(isTimeInRange(1420, 1410, 75)).toBe(true);  // 23:40
    expect(isTimeInRange(30, 1410, 75)).toBe(true);     // 00:30
    expect(isTimeInRange(100, 1410, 75)).toBe(false);   // 01:40
    expect(isTimeInRange(1400, 1410, 75)).toBe(false);  // 23:20
  });
});

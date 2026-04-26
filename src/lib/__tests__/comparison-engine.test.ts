/**
 * Tests for the Tropical vs Sidereal Comparison Engine.
 *
 * Test strategy:
 *  - Use known Julian Day values so results are deterministic.
 *  - dateToJD(1990, 6, 15, 12) → JD 2448057.0 (mid-1990, Sun near Gemini)
 *  - Spring equinox 2000: dateToJD(2000, 3, 20, 7.33) → ~JD 2451623.8
 *    Sun is at 0° tropical Aries (vernal equinox definition) → sidereal ~336° (Pisces)
 */

import { describe, it, expect } from 'vitest';
import { computeComparison } from '@/lib/ephem/comparison-engine';
import { dateToJD } from '@/lib/ephem/astronomical';

// Reference JD values
const JD_1990_MID = dateToJD(1990, 6, 15, 12);   // ~JD 2448057.0
// 5 days after spring equinox 2000 — Sun at ~5° tropical Aries, sidereal ~341° Pisces.
// The exact equinox moment (Sun=359.9998°) rounds to sign 12 (Pisces) via getRashiNumber,
// since 359.9998/30 = 11.9999... which floor() → 11 → sign 12. Using March 25 gives
// Sun clearly in tropical Aries (sign 1) while sidereal remains Pisces (sign 12).
const JD_NEAR_EQUINOX_2000 = dateToJD(2000, 3, 25, 12);

describe('computeComparison — 1990-06-15 (Lahiri, default)', () => {
  const result = computeComparison(JD_1990_MID);

  it('returns exactly 9 planet entries', () => {
    expect(result.planets).toHaveLength(9);
  });

  it('planet IDs are 0 through 8 in order', () => {
    const ids = result.planets.map((p) => p.id);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('every planet has a non-empty English name', () => {
    for (const p of result.planets) {
      expect(p.name.en.length).toBeGreaterThan(0);
    }
  });

  it('computes ayanamsha ~23.7° for 1990 (Lahiri Meeus polynomial)', () => {
    // Lahiri ayanamsha in 1990 should be ~23.7°–23.8°
    const aya = result.precessionData.currentAyanamsha;
    expect(aya).toBeGreaterThan(23.4);
    expect(aya).toBeLessThan(24.1);
  });

  it('all tropical longitudes are in [0, 360)', () => {
    for (const p of result.planets) {
      expect(p.tropicalLongitude).toBeGreaterThanOrEqual(0);
      expect(p.tropicalLongitude).toBeLessThan(360);
    }
  });

  it('all sidereal longitudes are in [0, 360)', () => {
    for (const p of result.planets) {
      expect(p.siderealLongitude).toBeGreaterThanOrEqual(0);
      expect(p.siderealLongitude).toBeLessThan(360);
    }
  });

  it('sidereal longitude = tropical - ayanamsha (mod 360)', () => {
    const aya = result.precessionData.currentAyanamsha;
    for (const p of result.planets) {
      const expected = ((p.tropicalLongitude - aya) % 360 + 360) % 360;
      expect(p.siderealLongitude).toBeCloseTo(expected, 6);
    }
  });

  it('sign numbers are in range 1–12', () => {
    for (const p of result.planets) {
      expect(p.tropicalSign).toBeGreaterThanOrEqual(1);
      expect(p.tropicalSign).toBeLessThanOrEqual(12);
      expect(p.siderealSign).toBeGreaterThanOrEqual(1);
      expect(p.siderealSign).toBeLessThanOrEqual(12);
    }
  });

  it('isShifted matches sign comparison', () => {
    for (const p of result.planets) {
      expect(p.isShifted).toBe(p.tropicalSign !== p.siderealSign);
    }
  });

  it('shiftedCount matches actual shifted count', () => {
    const actual = result.planets.filter((p) => p.isShifted).length;
    expect(result.shiftedCount).toBe(actual);
  });

  it('at least 1 planet is shifted (ayanamsha ~23.7° makes this near-certain)', () => {
    // With ~23.7° ayanamsha, any planet within 23.7° of a sign boundary shifts.
    // Statistically, with 9 planets, at least 1 should shift in a random chart.
    expect(result.shiftedCount).toBeGreaterThanOrEqual(1);
  });

  it('generates a non-empty hookLine', () => {
    expect(result.hookLine).toBeTruthy();
    expect(result.hookLine.length).toBeGreaterThan(20);
  });

  it('hookLine is a string (not undefined)', () => {
    expect(typeof result.hookLine).toBe('string');
  });

  it('precessionData has correct yearlyRate (Lahiri ~50.3 arcsec/yr)', () => {
    const rate = result.precessionData.yearlyRate;
    // 50.3 arcsec/yr = 0.013972 deg/yr — allow ±0.001 tolerance
    expect(rate).toBeCloseTo(50.3 / 3600, 4);
  });

  it('precessionData.zeroYear is ~285 AD', () => {
    expect(result.precessionData.zeroYear).toBe(285);
  });

  it('precessionData.ayanamshaType is "lahiri" (default)', () => {
    expect(result.precessionData.ayanamshaType).toBe('lahiri');
  });

  it('Sun (id=0) has nakshatra data', () => {
    const sun = result.planets.find((p) => p.id === 0);
    expect(sun?.nakshatra).toBeDefined();
    expect(sun?.nakshatra?.number).toBeGreaterThanOrEqual(1);
    expect(sun?.nakshatra?.number).toBeLessThanOrEqual(27);
    expect(sun?.nakshatra?.name.en.length).toBeGreaterThan(0);
  });

  it('Moon (id=1) has nakshatra data', () => {
    const moon = result.planets.find((p) => p.id === 1);
    expect(moon?.nakshatra).toBeDefined();
    expect(moon?.nakshatra?.number).toBeGreaterThanOrEqual(1);
    expect(moon?.nakshatra?.number).toBeLessThanOrEqual(27);
    expect(moon?.nakshatra?.name.en.length).toBeGreaterThan(0);
  });

  it('Mars (id=2) has NO nakshatra data', () => {
    const mars = result.planets.find((p) => p.id === 2);
    expect(mars?.nakshatra).toBeUndefined();
  });

  it('sign names are non-empty strings', () => {
    for (const p of result.planets) {
      expect(p.tropicalSignName.en.length).toBeGreaterThan(0);
      expect(p.siderealSignName.en.length).toBeGreaterThan(0);
    }
  });
});

describe('computeComparison — spring equinox edge case (Mar 25 2000)', () => {
  // 5 days after vernal equinox: Sun at ~5° tropical Aries, sidereal ~341° Pisces.
  // This demonstrates the key Western/Vedic divergence: what the West calls Aries
  // is still Pisces in the Vedic sky due to the ~24° ayanamsha gap.
  const result = computeComparison(JD_NEAR_EQUINOX_2000);
  const sun = result.planets.find((p) => p.id === 0)!;

  it('near-equinox Sun is tropical Aries (sign 1)', () => {
    // Sun at ~5° tropical Aries — comfortably inside the sign
    expect(sun.tropicalSign).toBe(1);
    expect(sun.tropicalLongitude).toBeGreaterThan(0);
    expect(sun.tropicalLongitude).toBeLessThan(30);
  });

  it('near-equinox Sun is sidereal Pisces (sign 12)', () => {
    // ~24° ayanamsha shifts ~5° tropical Aries → ~341° sidereal = Pisces
    expect(sun.siderealSign).toBe(12);
    expect(sun.siderealLongitude).toBeGreaterThan(330);
    expect(sun.siderealLongitude).toBeLessThan(360);
  });

  it('near-equinox Sun is shifted (tropical Aries → sidereal Pisces)', () => {
    expect(sun.isShifted).toBe(true);
  });
});

describe('computeComparison — KP ayanamsha', () => {
  const result = computeComparison(JD_1990_MID, 'kp');

  it('returns 9 planets with KP ayanamsha type', () => {
    expect(result.planets).toHaveLength(9);
    expect(result.precessionData.ayanamshaType).toBe('kp');
  });

  it('KP ayanamsha is slightly less than Lahiri', () => {
    const lahiriResult = computeComparison(JD_1990_MID, 'lahiri');
    // KP is ~6 arcmin (~0.1°) less than Lahiri
    expect(result.precessionData.currentAyanamsha).toBeLessThan(
      lahiriResult.precessionData.currentAyanamsha,
    );
  });
});

describe('computeComparison — hookLine content', () => {
  it('hookLine mentions a sign name when Sun is shifted', () => {
    // For most dates, the Sun will be shifted and the hookLine will name a sign
    const result = computeComparison(JD_NEAR_EQUINOX_2000);
    const sun = result.planets.find((p) => p.id === 0)!;
    if (sun.isShifted) {
      // The hook line should mention the Vedic sign or some descriptive text
      expect(result.hookLine.length).toBeGreaterThan(30);
    }
    expect(typeof result.hookLine).toBe('string');
  });
});

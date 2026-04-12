/**
 * Core astronomical calculation tests
 * Validates Meeus algorithm implementations against known ephemeris values.
 */

import { describe, it, expect } from 'vitest';
import {
  dateToJD, sunLongitude, moonLongitude, lahiriAyanamsha,
  normalizeDeg, approximateSunrise, approximateSunset,
  calculateTithi, calculateYoga, getRashiNumber, getNakshatraNumber,
  getAyanamsha,
} from '../astronomical';
import type { AyanamshaType } from '../astronomical';

describe('Julian Day Number', () => {
  it('J2000.0 = Jan 1, 2000, 12:00 TT → JD 2451545.0', () => {
    expect(dateToJD(2000, 1, 1, 12)).toBeCloseTo(2451545.0, 3);
  });

  it('Jan 1 2025 → JD ~2460676.5', () => {
    expect(dateToJD(2025, 1, 1, 0)).toBeCloseTo(2460676.5, 0);
  });

  it('Sputnik launch Oct 4 1957 → JD ~2436115.5', () => {
    expect(dateToJD(1957, 10, 4, 0)).toBeCloseTo(2436115.5, 0);
  });
});

describe('Sun Longitude', () => {
  it('Sun at vernal equinox ~0° tropical', () => {
    const jdEquinox2025 = dateToJD(2025, 3, 20, 12);
    const sunLongEquinox = sunLongitude(jdEquinox2025);
    const eqAdj = sunLongEquinox < 5 ? sunLongEquinox : sunLongEquinox - 360;
    expect(eqAdj).toBeGreaterThanOrEqual(-2);
    expect(eqAdj).toBeLessThanOrEqual(2);
  });

  it('Sun at summer solstice ~90°', () => {
    const jdSolstice = dateToJD(2025, 6, 21, 12);
    const sunLong = sunLongitude(jdSolstice);
    expect(sunLong).toBeGreaterThanOrEqual(88);
    expect(sunLong).toBeLessThanOrEqual(92);
  });
});

describe('Moon Longitude', () => {
  it('Moon daily motion ~10-16°', () => {
    const jd1 = dateToJD(2025, 1, 1, 0);
    const jd2 = dateToJD(2025, 1, 2, 0);
    const moonDelta = normalizeDeg(moonLongitude(jd2) - moonLongitude(jd1));
    const delta = moonDelta < 180 ? moonDelta : 360 - moonDelta;
    expect(delta).toBeGreaterThanOrEqual(10);
    expect(delta).toBeLessThanOrEqual(16);
  });
});

describe('Lahiri Ayanamsha', () => {
  it('Ayanamsha at J2000 ~23.85°', () => {
    expect(lahiriAyanamsha(2451545.0)).toBeCloseTo(23.85, 1);
  });

  it('Ayanamsha in 2025 ~24.0-24.5°', () => {
    const jd2025 = dateToJD(2025, 1, 1, 0);
    const ayanamsha = lahiriAyanamsha(jd2025);
    expect(ayanamsha).toBeGreaterThanOrEqual(24.0);
    expect(ayanamsha).toBeLessThanOrEqual(24.5);
  });
});

describe('Multi-Ayanamsha', () => {
  const jdTest = dateToJD(2025, 1, 1, 0);

  it('Lahiri ~24°', () => {
    const lahiri = getAyanamsha(jdTest, 'lahiri');
    expect(lahiri).toBeGreaterThanOrEqual(23.5);
    expect(lahiri).toBeLessThanOrEqual(25.0);
  });

  it('KP close to Lahiri (within 0.3°)', () => {
    const lahiri = getAyanamsha(jdTest, 'lahiri');
    const kp = getAyanamsha(jdTest, 'kp');
    expect(Math.abs(lahiri - kp)).toBeLessThanOrEqual(0.3);
  });

  it('Raman < Lahiri by 0.5-2.5°', () => {
    const lahiri = getAyanamsha(jdTest, 'lahiri');
    const raman = getAyanamsha(jdTest, 'raman');
    const diff = lahiri - raman;
    expect(diff).toBeGreaterThanOrEqual(0.5);
    expect(diff).toBeLessThanOrEqual(2.5);
  });
});

describe('Sunrise/Sunset', () => {
  it('Delhi summer solstice sunrise/sunset/day-length', () => {
    const jdDelhi = dateToJD(2025, 6, 21, 0);
    const delhiSunrise = approximateSunrise(jdDelhi, 28.6, 77.2);
    const delhiSunset = approximateSunset(jdDelhi, 28.6, 77.2);
    const srNorm = delhiSunrise > 20 ? delhiSunrise - 24 : delhiSunrise;

    expect(srNorm).toBeGreaterThanOrEqual(-1);
    expect(srNorm).toBeLessThanOrEqual(2);
    expect(delhiSunset).toBeGreaterThanOrEqual(12);
    expect(delhiSunset).toBeLessThanOrEqual(15);
    expect(delhiSunset - srNorm).toBeGreaterThanOrEqual(12);
    expect(delhiSunset - srNorm).toBeLessThanOrEqual(16);
  });
});

describe('Tithi Calculation', () => {
  it('Full moon tithi ~15', () => {
    const jdFull = dateToJD(2025, 1, 13, 12);
    const tithiFull = calculateTithi(jdFull);
    expect(tithiFull.number).toBeGreaterThanOrEqual(13);
    expect(tithiFull.number).toBeLessThanOrEqual(17);
  });
});

describe('Rashi & Nakshatra', () => {
  it('Rashi from 0° → 1', () => {
    expect(getRashiNumber(0)).toBe(1);
  });

  it('Rashi from 30° → 2', () => {
    expect(getRashiNumber(30)).toBe(2);
  });

  it('Rashi from 359° → 12', () => {
    expect(getRashiNumber(359)).toBe(12);
  });

  it('Nakshatra from 0° → 1', () => {
    expect(getNakshatraNumber(0)).toBe(1);
  });

  it('Nakshatra from 13.34° → 2', () => {
    expect(getNakshatraNumber(13.34)).toBe(2);
  });
});

describe('Normalize Degrees', () => {
  it('370° → 10°', () => {
    expect(normalizeDeg(370)).toBeCloseTo(10, 2);
  });

  it('-10° → 350°', () => {
    expect(normalizeDeg(-10)).toBeCloseTo(350, 2);
  });

  it('0° → 0°', () => {
    expect(normalizeDeg(0)).toBeCloseTo(0, 2);
  });

  it('360° → 0°', () => {
    expect(normalizeDeg(360)).toBeCloseTo(0, 2);
  });
});

import { describe, it, expect } from 'vitest';
import {
  computePlanetLatitude,
  eclipticToEquatorial,
  computeCombust,
  computeFullCoordinates,
} from './coordinates';

// J2000.0 epoch Julian Day
const JD_J2000 = 2451545.0;
// A sample JD for 2024-01-15 12:00 UT
const JD_2024 = 2460324.0;

describe('computePlanetLatitude', () => {
  it('returns 0 for Sun (always on ecliptic)', () => {
    expect(computePlanetLatitude(0, JD_J2000)).toBe(0);
    expect(computePlanetLatitude(0, JD_2024)).toBe(0);
  });

  it('returns non-zero for Moon', () => {
    const lat = computePlanetLatitude(1, JD_2024);
    expect(lat).not.toBe(0);
    // Moon latitude stays within +/- 5.3 degrees
    expect(Math.abs(lat)).toBeLessThan(5.3);
  });

  it('Moon latitude is within expected range at J2000', () => {
    const lat = computePlanetLatitude(1, JD_J2000);
    expect(Math.abs(lat)).toBeLessThanOrEqual(5.3);
  });

  it('Rahu latitude is 0 — nodes lie on the ecliptic by definition', () => {
    // The lunar nodes are the points where the Moon's orbit crosses the ecliptic.
    // A point ON the ecliptic has zero ecliptic latitude by definition.
    // Previously this returned -(Moon latitude), which is astronomically incorrect.
    const rahuLat = computePlanetLatitude(7, JD_2024);
    expect(rahuLat).toBe(0);
  });

  it('Ketu latitude is 0 — nodes lie on the ecliptic by definition', () => {
    // Same reasoning as Rahu: the descending node is also on the ecliptic.
    // Previously this returned +(Moon latitude), which is astronomically incorrect.
    const ketuLat = computePlanetLatitude(8, JD_2024);
    expect(ketuLat).toBe(0);
  });

  it('Mars latitude is within plausible range', () => {
    const lat = computePlanetLatitude(2, JD_2024);
    expect(Math.abs(lat)).toBeLessThan(5);
  });

  it('Mercury latitude is within plausible range (high inclination)', () => {
    const lat = computePlanetLatitude(3, JD_2024);
    expect(Math.abs(lat)).toBeLessThan(10);
  });

  it('Jupiter latitude is within plausible range', () => {
    const lat = computePlanetLatitude(4, JD_2024);
    expect(Math.abs(lat)).toBeLessThan(3);
  });

  it('Venus latitude is within plausible range', () => {
    const lat = computePlanetLatitude(5, JD_2024);
    expect(Math.abs(lat)).toBeLessThan(5);
  });

  it('Saturn latitude is within plausible range', () => {
    const lat = computePlanetLatitude(6, JD_2024);
    expect(Math.abs(lat)).toBeLessThan(4);
  });

  it('unknown planet id returns 0', () => {
    expect(computePlanetLatitude(99, JD_2024)).toBe(0);
  });
});

describe('eclipticToEquatorial', () => {
  it('converts vernal equinox correctly (lon=0, lat=0)', () => {
    // At vernal equinox: RA = 0, Dec = 0
    const { ra, dec } = eclipticToEquatorial(0, 0, JD_J2000);
    expect(ra).toBeCloseTo(0, 1);
    expect(dec).toBeCloseTo(0, 1);
  });

  it('converts summer solstice correctly (lon=90, lat=0)', () => {
    // At lon=90: RA ~ 90, Dec ~ obliquity ~ 23.44
    const { ra, dec } = eclipticToEquatorial(90, 0, JD_J2000);
    expect(ra).toBeCloseTo(90, 0);
    expect(dec).toBeCloseTo(23.44, 0);
  });

  it('converts autumnal equinox correctly (lon=180, lat=0)', () => {
    const { ra, dec } = eclipticToEquatorial(180, 0, JD_J2000);
    expect(ra).toBeCloseTo(180, 1);
    expect(dec).toBeCloseTo(0, 1);
  });

  it('converts winter solstice correctly (lon=270, lat=0)', () => {
    const { ra, dec } = eclipticToEquatorial(270, 0, JD_J2000);
    expect(ra).toBeCloseTo(270, 0);
    expect(dec).toBeCloseTo(-23.44, 0);
  });

  it('RA is always in range [0, 360)', () => {
    for (let lon = 0; lon < 360; lon += 30) {
      const { ra } = eclipticToEquatorial(lon, 0, JD_2024);
      expect(ra).toBeGreaterThanOrEqual(0);
      expect(ra).toBeLessThan(360);
    }
  });

  it('declination is always in range [-90, 90]', () => {
    for (let lon = 0; lon < 360; lon += 30) {
      for (const lat of [-5, 0, 5]) {
        const { dec } = eclipticToEquatorial(lon, lat, JD_2024);
        expect(dec).toBeGreaterThanOrEqual(-90);
        expect(dec).toBeLessThanOrEqual(90);
      }
    }
  });
});

describe('computeCombust', () => {
  it('Sun is never combust', () => {
    expect(computeCombust(0, 100, 100)).toBe(false);
  });

  it('Rahu is never combust', () => {
    expect(computeCombust(7, 100, 100)).toBe(false);
  });

  it('Ketu is never combust', () => {
    expect(computeCombust(8, 100, 100)).toBe(false);
  });

  it('Moon is combust when within 12 degrees of Sun', () => {
    expect(computeCombust(1, 100, 95)).toBe(true);
    expect(computeCombust(1, 100, 111)).toBe(true);
  });

  it('Moon is NOT combust when beyond 12 degrees', () => {
    expect(computeCombust(1, 100, 85)).toBe(false);
    expect(computeCombust(1, 100, 115)).toBe(false);
  });

  it('Mars combust within 17 degrees', () => {
    expect(computeCombust(2, 50, 50)).toBe(true);
    expect(computeCombust(2, 50, 35)).toBe(true);
    expect(computeCombust(2, 50, 66)).toBe(true);
  });

  it('Mars NOT combust beyond 17 degrees', () => {
    expect(computeCombust(2, 50, 30)).toBe(false);
    expect(computeCombust(2, 50, 70)).toBe(false);
  });

  it('Mercury combust within 14 degrees', () => {
    expect(computeCombust(3, 200, 190)).toBe(true);
    expect(computeCombust(3, 200, 213)).toBe(true);
  });

  it('Jupiter combust within 11 degrees', () => {
    expect(computeCombust(4, 300, 295)).toBe(true);
    expect(computeCombust(4, 300, 310)).toBe(true);
  });

  it('Venus combust within 10 degrees', () => {
    expect(computeCombust(5, 180, 175)).toBe(true);
    expect(computeCombust(5, 180, 189)).toBe(true);
  });

  it('Saturn combust within 15 degrees', () => {
    expect(computeCombust(6, 0, 350)).toBe(true); // wrapping around 360
    expect(computeCombust(6, 0, 14)).toBe(true);
  });

  it('handles wrapping around 360 degrees', () => {
    // Venus orb = 10 (strict less-than)
    // Planet at 5, Sun at 355 -> angular distance = 10, 10 < 10 is false
    expect(computeCombust(5, 5, 355)).toBe(false);
    // Planet at 5, Sun at 356 -> angular distance = 9, 9 < 10 is true
    expect(computeCombust(5, 5, 356)).toBe(true);
    // Saturn orb = 15; planet at 5, Sun at 355 -> distance = 10, 10 < 15 is true
    expect(computeCombust(6, 5, 355)).toBe(true);
  });
});

describe('computeFullCoordinates', () => {
  it('returns PlanetCoordinates with all fields', () => {
    const result = computeFullCoordinates(0, 100, JD_2024);
    expect(result).toHaveProperty('latitude');
    expect(result).toHaveProperty('rightAscension');
    expect(result).toHaveProperty('declination');
  });

  it('Sun latitude is 0', () => {
    const result = computeFullCoordinates(0, 100, JD_2024);
    expect(result.latitude).toBe(0);
  });

  it('RA is in valid range', () => {
    const result = computeFullCoordinates(4, 200, JD_2024);
    expect(result.rightAscension).toBeGreaterThanOrEqual(0);
    expect(result.rightAscension).toBeLessThan(360);
  });

  it('declination is in valid range', () => {
    const result = computeFullCoordinates(4, 200, JD_2024);
    expect(result.declination).toBeGreaterThanOrEqual(-90);
    expect(result.declination).toBeLessThanOrEqual(90);
  });
});

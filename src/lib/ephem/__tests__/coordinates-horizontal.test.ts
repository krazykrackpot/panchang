import { describe, it, expect } from 'vitest';
import { equatorialToHorizontal, computeGMST, computeLST } from '../coordinates';

describe('computeGMST', () => {
  it('returns GMST for J2000.0 epoch', () => {
    // At J2000.0 (JD 2451545.0), GMST should be ~280.46 degrees
    const gmst = computeGMST(2451545.0);
    expect(gmst).toBeCloseTo(280.46, 0);
  });

  it('GMST advances ~0.986 degrees per day (mod 360)', () => {
    const g1 = computeGMST(2451545.0);
    const g2 = computeGMST(2451546.0);
    // GMST advances 360.986 deg/day, but after normalization to 0-360
    // the difference mod 360 is ~0.986 deg
    const diff = ((g2 - g1) + 360) % 360;
    expect(diff).toBeCloseTo(0.986, 1);
  });
});

describe('computeLST', () => {
  it('LST = GMST + longitude', () => {
    const gmst = computeGMST(2451545.0);
    const lst = computeLST(2451545.0, 30);
    expect(lst).toBeCloseTo((gmst + 30) % 360, 2);
  });
});

describe('equatorialToHorizontal', () => {
  // Polaris from Corseaux, Switzerland
  it('Polaris is always near the north celestial pole for northern observers', () => {
    // Polaris: RA ~37.95 deg, Dec ~+89.26 deg
    // From Corseaux (lat 46.46): altitude should be close to latitude (~46 deg)
    const jd = 2451545.0; // J2000.0
    const result = equatorialToHorizontal(37.95, 89.26, 46.46, 6.80, jd);
    // Polaris altitude approx equals observer latitude (within 2 deg)
    expect(result.altitude).toBeCloseTo(46.46, 0);
    // Azimuth should be close to 0 deg (North) or 360 deg
    const azNorth = result.azimuth > 180 ? 360 - result.azimuth : result.azimuth;
    expect(azNorth).toBeLessThan(5); // within 5 deg of north
  });

  it('a star at the zenith for an equatorial observer', () => {
    // An object at Dec 0 deg, RA = LST should be at the zenith from equator
    const jd = 2451545.0;
    const lst = computeLST(jd, 0);
    const result = equatorialToHorizontal(lst, 0, 0, 0, jd);
    expect(result.altitude).toBeCloseTo(90, 0);
  });

  it('returns negative altitude for objects below horizon', () => {
    // A star at Dec -80 deg should be below horizon from lat +46 deg
    const result = equatorialToHorizontal(0, -80, 46.46, 6.80, 2451545.0);
    expect(result.altitude).toBeLessThan(0);
  });

  it('azimuth is in range 0-360', () => {
    const result = equatorialToHorizontal(100, 20, 46.46, 6.80, 2460000.0);
    expect(result.azimuth).toBeGreaterThanOrEqual(0);
    expect(result.azimuth).toBeLessThan(360);
  });

  it('altitude is in range -90 to 90', () => {
    for (const ra of [0, 90, 180, 270]) {
      for (const dec of [-60, 0, 45, 85]) {
        const result = equatorialToHorizontal(ra, dec, 46.46, 6.80, 2460000.0);
        expect(result.altitude).toBeGreaterThanOrEqual(-90);
        expect(result.altitude).toBeLessThanOrEqual(90);
      }
    }
  });
});

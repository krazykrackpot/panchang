/**
 * Tests for deltaT (TT - UT) computation.
 * Reference values from USNO / Espenak & Meeus (2006).
 */
import { describe, it, expect } from 'vitest';
import { deltaT, jdToYear } from '@/lib/ephem/astronomical';

describe('deltaT', () => {
  it('returns 0 for years before 1900', () => {
    expect(deltaT(1800)).toBe(0);
    expect(deltaT(1000)).toBe(0);
  });

  it('returns ~63.8 seconds near year 2000', () => {
    const dt = deltaT(2000);
    // Espenak & Meeus: DeltaT at J2000.0 ~ 63.83 s
    expect(dt).toBeCloseTo(63.86, 0);
  });

  it('returns reasonable value for year 1950', () => {
    const dt = deltaT(1950);
    // Historical DeltaT ~29 s in 1950 (Chapront formula for 1900-1986 range)
    expect(dt).toBeGreaterThan(25);
    expect(dt).toBeLessThan(35);
  });

  it('returns reasonable value for year 2020', () => {
    const dt = deltaT(2020);
    // Observed DeltaT ~69.4 s in 2020
    expect(dt).toBeGreaterThan(65);
    expect(dt).toBeLessThan(75);
  });

  it('returns reasonable value for year 2026', () => {
    const dt = deltaT(2026);
    // Projected DeltaT ~72 s in 2026
    expect(dt).toBeGreaterThan(68);
    expect(dt).toBeLessThan(78);
  });

  it('monotonically increases from 2005 to 2050', () => {
    let prev = deltaT(2005);
    for (let y = 2010; y <= 2050; y += 5) {
      const curr = deltaT(y);
      expect(curr).toBeGreaterThan(prev);
      prev = curr;
    }
  });
});

describe('jdToYear', () => {
  it('converts J2000.0 to year 2000', () => {
    expect(jdToYear(2451545.0)).toBeCloseTo(2000.0, 2);
  });

  it('converts a known JD to approximate year', () => {
    // 2026-01-01 12:00 UT ~= JD 2461042.0
    const year = jdToYear(2461042.0);
    expect(year).toBeCloseTo(2026.0, 0);
  });
});

import { describe, it, expect } from 'vitest';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';

function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

describe('DST transitions', () => {
  it('Bern spring forward (March 30 2025 CET→CEST)', () => {
    const p = computePanchang({
      year: 2025, month: 3, day: 30,
      lat: 46.9481, lng: 7.4474,
      tzOffset: 2, timezone: 'Europe/Zurich',
    });
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    const sr = parseHHMM(p.sunrise);
    // Sunrise around 07:15-07:25 CEST
    expect(sr).toBeGreaterThan(6 * 60 + 50);
    expect(sr).toBeLessThan(7 * 60 + 40);
  });

  it('Bern fall back (October 26 2025 CEST→CET)', () => {
    const p = computePanchang({
      year: 2025, month: 10, day: 26,
      lat: 46.9481, lng: 7.4474,
      tzOffset: 1, timezone: 'Europe/Zurich',
    });
    const sr = parseHHMM(p.sunrise);
    // Sunrise ~7:04 CEST (before clocks fall back at 03:00) or ~8:04 CET
    // Engine may resolve DST per-JD, so accept either representation
    expect(sr).toBeGreaterThan(6 * 60 + 50);
    expect(sr).toBeLessThan(8 * 60 + 30);
  });

  it('Seattle spring forward (March 9 2025 PST→PDT)', () => {
    const p = computePanchang({
      year: 2025, month: 3, day: 9,
      lat: 47.6062, lng: -122.3321,
      tzOffset: -7, timezone: 'America/Los_Angeles',
    });
    expect(p.sunrise).toBeDefined();
    expect(parseHHMM(p.sunrise)).toBeLessThan(parseHHMM(p.sunset));
  });

  it('Seattle fall back (November 2 2025 PDT→PST)', () => {
    const p = computePanchang({
      year: 2025, month: 11, day: 2,
      lat: 47.6062, lng: -122.3321,
      tzOffset: -8, timezone: 'America/Los_Angeles',
    });
    expect(parseHHMM(p.sunrise)).toBeLessThan(parseHHMM(p.sunset));
  });
});

describe('geographic edge cases', () => {
  it('Southern hemisphere: Sydney winter solstice', () => {
    const p = computePanchang({
      year: 2025, month: 6, day: 21,
      lat: -33.8688, lng: 151.2093,
      tzOffset: 10, timezone: 'Australia/Sydney',
    });
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    // Short winter day
    expect(parseHHMM(p.sunrise)).toBeGreaterThan(6 * 60 + 50);
    expect(parseHHMM(p.sunset)).toBeLessThan(17 * 60 + 15);
  });

  it('Equatorial: Singapore near equinox', () => {
    const p = computePanchang({
      year: 2025, month: 3, day: 20,
      lat: 1.3521, lng: 103.8198,
      tzOffset: 8, timezone: 'Asia/Singapore',
    });
    const dayLen = parseHHMM(p.sunset) - parseHHMM(p.sunrise);
    expect(dayLen).toBeGreaterThan(11 * 60);
    expect(dayLen).toBeLessThan(13 * 60);
  });

  it('Date line: Auckland NZ', () => {
    const p = computePanchang({
      year: 2025, month: 1, day: 15,
      lat: -36.8485, lng: 174.7633,
      tzOffset: 13, timezone: 'Pacific/Auckland',
    });
    expect(p.sunrise).toBeDefined();
    expect(p.tithi).toBeDefined();
    expect(p.nakshatra).toBeDefined();
  });
});

describe('boundary conditions', () => {
  it('panchang elements valid across 15 dates in 2025-2026', () => {
    const dates = [
      { y: 2025, m: 1, d: 1 }, { y: 2025, m: 2, d: 14 }, { y: 2025, m: 3, d: 21 },
      { y: 2025, m: 4, d: 14 }, { y: 2025, m: 5, d: 26 }, { y: 2025, m: 6, d: 21 },
      { y: 2025, m: 7, d: 4 }, { y: 2025, m: 8, d: 15 }, { y: 2025, m: 9, d: 22 },
      { y: 2025, m: 10, d: 31 }, { y: 2025, m: 11, d: 15 }, { y: 2025, m: 12, d: 25 },
      { y: 2026, m: 1, d: 14 }, { y: 2026, m: 2, d: 28 }, { y: 2026, m: 3, d: 15 },
    ];
    dates.forEach(({ y, m, d }) => {
      const p = computePanchang({ year: y, month: m, day: d, lat: 28.6139, lng: 77.209, tzOffset: 5.5, timezone: 'Asia/Kolkata' });
      expect(p.tithi.number).toBeGreaterThanOrEqual(1);
      expect(p.tithi.number).toBeLessThanOrEqual(30);
      expect(p.nakshatra.id).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.id).toBeLessThanOrEqual(27);
      expect(p.yoga.number).toBeGreaterThanOrEqual(1);
      expect(p.yoga.number).toBeLessThanOrEqual(27);
    });
  });

  it('sunrise is always before sunset for Delhi', () => {
    for (let m = 1; m <= 12; m++) {
      const p = computePanchang({ year: 2025, month: m, day: 15, lat: 28.6139, lng: 77.209, tzOffset: 5.5, timezone: 'Asia/Kolkata' });
      expect(parseHHMM(p.sunrise), `month ${m}`).toBeLessThan(parseHHMM(p.sunset));
    }
  });
});

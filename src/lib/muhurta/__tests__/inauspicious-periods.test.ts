import { describe, it, expect } from 'vitest';
import {
  computeYamaganda,
  computeGulikaKaal,
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
} from '../inauspicious-periods';

describe('computeYamaganda', () => {
  // Sunday: segment 5, duration = (18-6)/8 = 1.5h each
  // Yamaganda = sunrise + (5-1)*1.5 = sunrise + 6h
  it('returns correct window for Sunday', () => {
    const result = computeYamaganda(6.0, 18.0, 0); // sunrise 6AM UT, sunset 6PM UT, Sunday
    expect(result.start).toBeCloseTo(12.0, 1); // noon
    expect(result.end).toBeCloseTo(13.5, 1);   // 1:30 PM
  });

  it('returns correct window for Wednesday', () => {
    // Wed: segment 2, sunrise + (2-1)*1.5 = sunrise + 1.5h
    const result = computeYamaganda(6.0, 18.0, 3); // Wednesday
    expect(result.start).toBeCloseTo(7.5, 1);  // 7:30 AM
    expect(result.end).toBeCloseTo(9.0, 1);    // 9:00 AM
  });

  it('scales with actual day duration', () => {
    // Short winter day: sunrise 7:30, sunset 16:30 → 9h day, segment = 9/8 = 1.125h
    const result = computeYamaganda(7.5, 16.5, 0); // Sunday, segment 5
    const duration = (16.5 - 7.5) / 8;
    expect(result.start).toBeCloseTo(7.5 + 4 * duration, 2);
    expect(result.end).toBeCloseTo(7.5 + 5 * duration, 2);
  });
});

describe('computeGulikaKaal', () => {
  it('returns correct window for Sunday', () => {
    // Sun: segment 7, sunrise + (7-1)*1.5 = sunrise + 9h
    const result = computeGulikaKaal(6.0, 18.0, 0);
    expect(result.start).toBeCloseTo(15.0, 1); // 3 PM
    expect(result.end).toBeCloseTo(16.5, 1);   // 4:30 PM
  });

  it('returns correct window for Saturday', () => {
    // Sat: segment 1, sunrise + 0 = sunrise
    const result = computeGulikaKaal(6.0, 18.0, 6);
    expect(result.start).toBeCloseTo(6.0, 1);
    expect(result.end).toBeCloseTo(7.5, 1);
  });
});

describe('computeInauspiciousForWindow', () => {
  it('detects Rahu Kaal overlap', () => {
    // Monday Rahu Kaal: order[1]=2, segment 2-1=1 → sunrise + 1*1.5 = 7.5 to 9.0
    const periods = computeInauspiciousForWindow(
      8.0, 8.25, // window 8:00-8:15 UT — inside Rahu Kaal
      6.0, 18.0, 1, // sunrise, sunset, Monday
      10, // nakshatra
      2460691.0, // jd
      5.5, // tz
    );
    const rahuKaal = periods.find(p => p.name === 'Rahu Kaal');
    expect(rahuKaal).toBeDefined();
    expect(rahuKaal!.active).toBe(true);
  });

  it('returns inactive Rahu Kaal for window outside it', () => {
    const periods = computeInauspiciousForWindow(
      14.0, 14.25,
      6.0, 18.0, 1,
      10, 2460691.0, 5.5,
    );
    const rahuKaal = periods.find(p => p.name === 'Rahu Kaal');
    expect(rahuKaal).toBeDefined();
    expect(rahuKaal!.active).toBe(false);
  });

  it('returns at least 3 period types (Rahu, Yama, Gulika)', () => {
    const periods = computeInauspiciousForWindow(
      10.0, 10.25,
      6.0, 18.0, 3,
      10, 2460691.0, 5.5,
    );
    const names = periods.map(p => p.name);
    expect(names).toContain('Rahu Kaal');
    expect(names).toContain('Yamaganda');
    expect(names).toContain('Gulika Kaal');
    expect(periods.length).toBeGreaterThanOrEqual(3);
  });
});

describe('computeInauspiciousPenalty', () => {
  it('returns 10 when no periods active', () => {
    const periods = [
      { name: 'Rahu Kaal', startTime: '12:00', endTime: '13:30', active: false },
      { name: 'Yamaganda', startTime: '07:30', endTime: '09:00', active: false },
      { name: 'Gulika Kaal', startTime: '15:00', endTime: '16:30', active: false },
    ];
    expect(computeInauspiciousPenalty(periods)).toBe(10);
  });

  it('deducts for active Rahu Kaal', () => {
    const periods = [
      { name: 'Rahu Kaal', startTime: '12:00', endTime: '13:30', active: true },
      { name: 'Yamaganda', startTime: '07:30', endTime: '09:00', active: false },
      { name: 'Gulika Kaal', startTime: '15:00', endTime: '16:30', active: false },
    ];
    expect(computeInauspiciousPenalty(periods)).toBe(6); // 10 - 4
  });

  it('clamps to 0 when multiple active', () => {
    const periods = [
      { name: 'Rahu Kaal', startTime: '12:00', endTime: '13:30', active: true },
      { name: 'Yamaganda', startTime: '12:00', endTime: '13:30', active: true },
      { name: 'Gulika Kaal', startTime: '12:00', endTime: '13:30', active: true },
      { name: 'Vishti (Bhadra)', startTime: '12:00', endTime: '13:30', active: true },
    ];
    // 10 - 4 - 3 - 2 - 4 = -3, clamped to 0
    expect(computeInauspiciousPenalty(periods)).toBe(0);
  });
});

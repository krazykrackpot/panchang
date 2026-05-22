import { describe, it, expect } from 'vitest';
import { istDate, daysBetweenIst, isMondayIst, lastMondayIst } from '@/lib/gamification/ist-day';

describe('IST date helpers', () => {
  it('istDate returns YYYY-MM-DD in Asia/Kolkata', () => {
    expect(istDate(new Date('2026-05-22T22:00:00Z'))).toBe('2026-05-23');
    expect(istDate(new Date('2026-05-22T18:00:00Z'))).toBe('2026-05-22');
  });

  it('daysBetweenIst returns correct day diff', () => {
    expect(daysBetweenIst('2026-05-22', '2026-05-23')).toBe(1);
    expect(daysBetweenIst('2026-05-22', '2026-05-22')).toBe(0);
    expect(daysBetweenIst('2026-05-22', '2026-05-29')).toBe(7);
  });

  it('isMondayIst is true only for Mondays', () => {
    expect(isMondayIst('2026-05-18')).toBe(true);  // Monday
    expect(isMondayIst('2026-05-19')).toBe(false); // Tuesday
    expect(isMondayIst('2026-05-25')).toBe(true);  // Monday
  });

  it('lastMondayIst returns the most recent Monday including today', () => {
    expect(lastMondayIst('2026-05-22')).toBe('2026-05-18'); // Fri → prev Mon
    expect(lastMondayIst('2026-05-18')).toBe('2026-05-18'); // Mon → itself
    expect(lastMondayIst('2026-05-19')).toBe('2026-05-18'); // Tue → prev day
  });
});

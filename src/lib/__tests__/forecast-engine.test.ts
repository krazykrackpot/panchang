import { describe, it, expect } from 'vitest';
import { computeMonthlyTransits } from '@/lib/forecast/monthly-transit';
import type { MonthlyTransitSnapshot } from '@/lib/forecast/monthly-transit';

describe('monthly-transit', () => {
  it('returns 12 monthly snapshots', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    expect(result).toHaveLength(12);
    expect(result[0].month).toBe(1);
    expect(result[11].month).toBe(12);
  });

  it('each month has slow planet transits', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    for (const m of result) {
      expect(m.planets.length).toBeGreaterThanOrEqual(3); // At least Saturn, Jupiter, Rahu/Ketu
      expect(['favorable', 'mixed', 'challenging']).toContain(m.outlook);
    }
  });

  it('detects sign changes between months', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    // Month 1 can't have sign changes (no previous month to compare)
    expect(result[0].planets.every(p => !p.signChanged)).toBe(true);
  });

  it('month names are formatted correctly', () => {
    const savTable = Array(12).fill(25);
    const result = computeMonthlyTransits(1, savTable, 2026);
    expect(result[0].monthName).toBe('Jan 2026');
    expect(result[11].monthName).toBe('Dec 2026');
  });
});

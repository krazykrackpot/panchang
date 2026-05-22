/**
 * parseLocalDate avoids the UTC-midnight gotcha that flips Friday → Thursday
 * for users west of UTC (CLAUDE.md Lesson L). These tests pin the contract.
 */
import { describe, it, expect } from 'vitest';
import { parseLocalDate } from '@/lib/calendar/parse-local-date';

describe('parseLocalDate', () => {
  it('parses a valid YYYY-MM-DD as local midnight', () => {
    const d = parseLocalDate('2026-05-22');
    expect(d).toBeInstanceOf(Date);
    expect(d!.getFullYear()).toBe(2026);
    expect(d!.getMonth()).toBe(4); // May (0-indexed)
    expect(d!.getDate()).toBe(22);
    expect(d!.getHours()).toBe(0);
    expect(d!.getMinutes()).toBe(0);
  });

  it('returns the same civil day as the input regardless of host timezone', () => {
    // `new Date('2026-05-22')` is UTC midnight → Date.getDate() returns 21
    // for hosts west of UTC. parseLocalDate must produce 22 unconditionally.
    expect(parseLocalDate('2026-05-22')!.getDate()).toBe(22);
  });

  it('rejects malformed input', () => {
    expect(parseLocalDate('2026/05/22')).toBeNull();
    expect(parseLocalDate('2026-5-22')).toBeNull();
    expect(parseLocalDate('22-05-2026')).toBeNull();
    expect(parseLocalDate('not a date')).toBeNull();
    expect(parseLocalDate('')).toBeNull();
  });

  it('rejects out-of-range month / day', () => {
    expect(parseLocalDate('2026-13-01')).toBeNull();
    expect(parseLocalDate('2026-00-15')).toBeNull();
    expect(parseLocalDate('2026-05-32')).toBeNull();
    expect(parseLocalDate('2026-05-00')).toBeNull();
  });
});

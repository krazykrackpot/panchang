/**
 * Tests for src/lib/utils/now-in-timezone.ts
 *
 * All tests pin system time to 2026-05-12T12:00:00Z (UTC noon) for
 * deterministic results across timezones:
 *   - Asia/Kolkata (IST, UTC+5:30) → 17:30 = 1050 min
 *   - Europe/Zurich (CEST, UTC+2)  → 14:00 = 840 min
 *   - America/New_York (EDT, UTC-4) → 08:00 = 480 min
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  nowMinutesInTimezone,
  isTimeRangeActive,
  formatCurrentTime12h,
  hasMomentPassed,
  todayInTimezone,
} from '@/lib/utils/now-in-timezone';

// UTC noon on 2026-05-12 (a Tuesday, well into CEST/IST/EDT summers)
const UTC_NOON = new Date('2026-05-12T12:00:00Z');

// 2026-05-13T00:30:00+05:30 = 2026-05-12T19:00:00Z
// → IST = 00:30 next day (midnight-crossing test)
const UTC_BEFORE_IST_MIDNIGHT = new Date('2026-05-12T19:00:00Z'); // 00:30 IST

describe('nowMinutesInTimezone', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UTC_NOON);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Asia/Kolkata at UTC noon → 17:30 IST = 1050 minutes', () => {
    const result = nowMinutesInTimezone('Asia/Kolkata');
    expect(result).toBe(1050); // 17 * 60 + 30
  });

  it('Europe/Zurich at UTC noon → 14:00 CEST = 840 minutes', () => {
    const result = nowMinutesInTimezone('Europe/Zurich');
    expect(result).toBe(840); // 14 * 60 + 0
  });

  it('America/New_York at UTC noon → 08:00 EDT = 480 minutes', () => {
    const result = nowMinutesInTimezone('America/New_York');
    expect(result).toBe(480); // 8 * 60 + 0
  });

  it('null timezone → returns reasonable value (0-1439), does not throw', () => {
    const result = nowMinutesInTimezone(null);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1439);
  });

  it('undefined timezone → returns reasonable value (0-1439), does not throw', () => {
    const result = nowMinutesInTimezone(undefined);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1439);
  });

  it('invalid IANA timezone → falls back to browser time, does not throw', () => {
    // Must not throw — should fall through to browser local time silently
    expect(() => nowMinutesInTimezone('Invalid/Timezone')).not.toThrow();
    const result = nowMinutesInTimezone('Invalid/Timezone');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1439);
  });

  it('empty string → falls back to browser time, does not throw', () => {
    expect(() => nowMinutesInTimezone('')).not.toThrow();
    const result = nowMinutesInTimezone('');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1439);
  });

  it('same instant gives different minutes in different timezones (proves tz is used)', () => {
    const kolkata = nowMinutesInTimezone('Asia/Kolkata');    // 1050
    const zurich  = nowMinutesInTimezone('Europe/Zurich');   // 840
    const newYork = nowMinutesInTimezone('America/New_York'); // 480

    expect(kolkata).not.toBe(zurich);
    expect(zurich).not.toBe(newYork);
    expect(kolkata).not.toBe(newYork);
  });
});

describe('isTimeRangeActive', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UTC_NOON);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // At UTC noon, Asia/Kolkata is 17:30
  it('17:00–18:00 in Asia/Kolkata at UTC noon → true (17:30 IST is in range)', () => {
    expect(isTimeRangeActive('17:00', '18:00', 'Asia/Kolkata')).toBe(true);
  });

  it('09:00–10:30 in Asia/Kolkata at UTC noon → false (17:30 IST is outside)', () => {
    expect(isTimeRangeActive('09:00', '10:30', 'Asia/Kolkata')).toBe(false);
  });

  it('14:00–15:00 in Europe/Zurich at UTC noon → true (14:00 CEST is start of range)', () => {
    // 14:00 >= 14:00 && 14:00 < 15:00 → true
    expect(isTimeRangeActive('14:00', '15:00', 'Europe/Zurich')).toBe(true);
  });

  it('same range 17:00–18:00 gives different results in Kolkata vs Zurich (proves tz matters)', () => {
    // At UTC noon: IST=17:30 (in range), CEST=14:00 (not in range)
    const kolkata = isTimeRangeActive('17:00', '18:00', 'Asia/Kolkata');
    const zurich  = isTimeRangeActive('17:00', '18:00', 'Europe/Zurich');
    expect(kolkata).toBe(true);
    expect(zurich).toBe(false);
  });

  // Midnight-crossing tests (Lesson R)
  describe('midnight-crossing ranges', () => {
    it('23:00–01:00 in Asia/Kolkata at IST 00:30 → true (Lesson R)', () => {
      // Pin to UTC 19:00 = IST 00:30 (crosses midnight)
      vi.setSystemTime(UTC_BEFORE_IST_MIDNIGHT);
      expect(isTimeRangeActive('23:00', '01:00', 'Asia/Kolkata')).toBe(true);
    });

    it('23:00–01:00 in Asia/Kolkata at IST 17:30 → false (not in midnight-crossing range)', () => {
      vi.setSystemTime(UTC_NOON); // IST 17:30
      expect(isTimeRangeActive('23:00', '01:00', 'Asia/Kolkata')).toBe(false);
    });

    it('22:30–23:30 (no midnight crossing) at IST 17:30 → false', () => {
      vi.setSystemTime(UTC_NOON); // IST 17:30
      expect(isTimeRangeActive('22:30', '23:30', 'Asia/Kolkata')).toBe(false);
    });

    it('17:00–18:00 in Europe/Zurich at UTC noon (CEST 14:00) → false', () => {
      // Non-crossing range; 14:00 not in 17:00–18:00
      expect(isTimeRangeActive('17:00', '18:00', 'Europe/Zurich')).toBe(false);
    });
  });
});

describe('formatCurrentTime12h', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(UTC_NOON);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('Asia/Kolkata at UTC noon → contains "5:30 PM"', () => {
    const result = formatCurrentTime12h('Asia/Kolkata');
    // Intl formats vary slightly ("5:30 PM" vs "5:30 PM"), but should contain the time
    expect(result).toMatch(/5:30\s*PM/i);
  });

  it('Europe/Zurich at UTC noon → contains "2:00 PM"', () => {
    const result = formatCurrentTime12h('Europe/Zurich');
    expect(result).toMatch(/2:00\s*PM/i);
  });

  it('America/New_York at UTC noon → contains "8:00 AM"', () => {
    const result = formatCurrentTime12h('America/New_York');
    expect(result).toMatch(/8:00\s*AM/i);
  });

  it('null timezone → returns a formatted time string, does not throw', () => {
    expect(() => formatCurrentTime12h(null)).not.toThrow();
    const result = formatCurrentTime12h(null);
    expect(result).toMatch(/\d+:\d{2}\s*(AM|PM)/i);
  });

  it('invalid timezone → falls back gracefully, does not throw', () => {
    expect(() => formatCurrentTime12h('Garbage/Timezone')).not.toThrow();
    const result = formatCurrentTime12h('Garbage/Timezone');
    expect(result).toMatch(/\d+:\d{2}\s*(AM|PM)/i);
  });
});

describe('hasMomentPassed', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Regression for the panchang highlight bug: at 2026-05-23 12:20 CEST the
  // previous-nakshatra card stayed highlighted because the moment "22:38"
  // on 2026-05-22 was incorrectly judged as "not passed" — the helper
  // compared only times-of-day and skipped the past-date branch.
  it('moment from yesterday is always "passed" regardless of time-of-day', () => {
    // 2026-05-23 12:20 Europe/Zurich = 10:20 UTC
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    expect(hasMomentPassed('22:38', '2026-05-22', 'Europe/Zurich')).toBe(true);
  });

  it('moment from tomorrow is never "passed"', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    expect(hasMomentPassed('00:01', '2026-05-24', 'Europe/Zurich')).toBe(false);
  });

  it('same-day moment in the future is not passed yet', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    // 22:39 Europe/Zurich on 2026-05-23 — still ~10 hours away
    expect(hasMomentPassed('22:39', '2026-05-23', 'Europe/Zurich')).toBe(false);
  });

  it('same-day moment in the past is passed', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    // 11:00 Europe/Zurich = 09:00 UTC — already past by 10:20 UTC (12:20 CEST)
    expect(hasMomentPassed('11:00', '2026-05-23', 'Europe/Zurich')).toBe(true);
  });

  it('date omitted → assumes today (legacy widget call sites)', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    // 11:00 CEST is already past 12:20 CEST today
    expect(hasMomentPassed('11:00', undefined, 'Europe/Zurich')).toBe(true);
    expect(hasMomentPassed('22:00', undefined, 'Europe/Zurich')).toBe(false);
  });

  it('Asia/Kolkata wall-clock differs from UTC by 5:30', () => {
    // 2026-05-23 18:00 UTC = 2026-05-23 23:30 IST
    vi.setSystemTime(new Date('2026-05-23T18:00:00Z'));
    expect(hasMomentPassed('23:00', '2026-05-23', 'Asia/Kolkata')).toBe(true);
    // 23:45 IST is still future at 23:30 IST
    expect(hasMomentPassed('23:45', '2026-05-23', 'Asia/Kolkata')).toBe(false);
  });

  it('invalid timezone → falls back to local time without throwing', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    expect(() => hasMomentPassed('11:00', '2026-05-22', 'Garbage/Tz')).not.toThrow();
  });
});

describe('todayInTimezone', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('2026-05-23 10:20 UTC → 2026-05-23 in Europe/Zurich (CEST)', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    expect(todayInTimezone('Europe/Zurich')).toBe('2026-05-23');
  });

  // Crosses the IST date boundary — UTC says May 22 but Kolkata is already May 23.
  it('2026-05-22 19:00 UTC → 2026-05-23 in Asia/Kolkata', () => {
    vi.setSystemTime(new Date('2026-05-22T19:00:00Z'));
    expect(todayInTimezone('Asia/Kolkata')).toBe('2026-05-23');
  });

  it('invalid timezone → falls back to local date without throwing', () => {
    vi.setSystemTime(new Date('2026-05-23T10:20:00Z'));
    expect(() => todayInTimezone('Garbage/Tz')).not.toThrow();
    expect(todayInTimezone('Garbage/Tz')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

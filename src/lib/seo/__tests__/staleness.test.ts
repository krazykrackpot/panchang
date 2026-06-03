/**
 * Tests for the staleness policy. Locked thresholds:
 *   STALENESS_DAYS = 14
 *   FESTIVAL_YEAR_OFFSET = 1
 *
 * If you're tempted to change them in staleness.ts, also update:
 *   - This file's expected boundaries
 *   - `src/lib/seo/indexnow-prune.ts` URL enumerator (it uses the same
 *     window to pick which URLs to ping for re-crawl)
 *   - The `staleRobots`/`staleYearRobots` call sites in the 5 page
 *     handlers (they're thin wrappers; no math, but the threshold
 *     surfaces in the user-visible robots tag)
 */
import { describe, it, expect } from 'vitest';
import { isStale, staleRobots, staleYearRobots, STALENESS_DAYS, FESTIVAL_YEAR_OFFSET } from '../staleness';

const FIXED_NOW = new Date('2026-06-03T12:00:00Z');

describe('STALENESS_DAYS + FESTIVAL_YEAR_OFFSET', () => {
  it('are locked at 14 and 1', () => {
    expect(STALENESS_DAYS).toBe(14);
    expect(FESTIVAL_YEAR_OFFSET).toBe(1);
  });
});

describe('isStale — Rule 1 (date-keyed)', () => {
  it('today is not stale', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-06-03', now: FIXED_NOW })).toBe(false);
  });

  it('exactly 14 days past is not stale (boundary)', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-05-20', now: FIXED_NOW })).toBe(false);
  });

  it('exactly 14 days future is not stale (boundary)', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-06-17', now: FIXED_NOW })).toBe(false);
  });

  it('15 days past is stale', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-05-19', now: FIXED_NOW })).toBe(true);
  });

  it('15 days future is stale', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-06-18', now: FIXED_NOW })).toBe(true);
  });

  it('30 days past is stale', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-05-04', now: FIXED_NOW })).toBe(true);
  });

  it('year boundary: Dec 25 vs Jan 5 (11 days apart) is not stale', () => {
    const jan5 = new Date('2026-01-05T12:00:00Z');
    expect(isStale({ kind: 'date-keyed', urlDate: '2025-12-25', now: jan5 })).toBe(false);
  });

  it('year boundary: Dec 15 vs Jan 5 (21 days apart) is stale', () => {
    const jan5 = new Date('2026-01-05T12:00:00Z');
    expect(isStale({ kind: 'date-keyed', urlDate: '2025-12-15', now: jan5 })).toBe(true);
  });

  it('leap year: Feb 29 → Mar 1 still distance-1', () => {
    const mar1 = new Date('2028-03-01T00:00:00Z');
    expect(isStale({ kind: 'date-keyed', urlDate: '2028-02-29', now: mar1 })).toBe(false);
  });

  it('DST transition does not shift the threshold (UTC math)', () => {
    // March 30, 2026 is a DST date in EU. Test that an exactly-14-days
    // comparison crossing a DST transition still returns false.
    const apr13 = new Date('2026-04-13T12:00:00Z');
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-03-30', now: apr13 })).toBe(false);
  });

  it('malformed urlDate returns false (lets 404 path own the error)', () => {
    expect(isStale({ kind: 'date-keyed', urlDate: 'not-a-date', now: FIXED_NOW })).toBe(false);
    expect(isStale({ kind: 'date-keyed', urlDate: '2026-13-99', now: FIXED_NOW })).toBe(false);
  });

  it('uses current `new Date()` when `now` is omitted', () => {
    // A date 5 years in the past should always be stale, regardless of
    // when this test runs.
    const fiveYearsAgo = new Date(Date.now() - 5 * 365.25 * 86_400_000).toISOString().slice(0, 10);
    expect(isStale({ kind: 'date-keyed', urlDate: fiveYearsAgo })).toBe(true);
  });
});

describe('isStale — Rule 3 (year-keyed)', () => {
  it('current year is not stale', () => {
    expect(isStale({ kind: 'year-keyed', urlYear: 2026, now: FIXED_NOW })).toBe(false);
  });

  it('previous year is not stale (residual searches still indexable)', () => {
    expect(isStale({ kind: 'year-keyed', urlYear: 2025, now: FIXED_NOW })).toBe(false);
  });

  it('two years past is stale', () => {
    expect(isStale({ kind: 'year-keyed', urlYear: 2024, now: FIXED_NOW })).toBe(true);
  });

  it('three years past is stale', () => {
    expect(isStale({ kind: 'year-keyed', urlYear: 2023, now: FIXED_NOW })).toBe(true);
  });

  it('future year is not stale (forward-looking searches valid)', () => {
    expect(isStale({ kind: 'year-keyed', urlYear: 2027, now: FIXED_NOW })).toBe(false);
    expect(isStale({ kind: 'year-keyed', urlYear: 2030, now: FIXED_NOW })).toBe(false);
  });
});

describe('staleRobots wrapper', () => {
  it('returns the robots object for stale dates', () => {
    expect(staleRobots('2026-05-04', FIXED_NOW)).toEqual({
      robots: { index: false, follow: true },
    });
  });

  it('returns undefined for fresh dates', () => {
    expect(staleRobots('2026-06-03', FIXED_NOW)).toBeUndefined();
  });
});

describe('staleYearRobots wrapper', () => {
  it('returns the robots object for stale years', () => {
    expect(staleYearRobots(2024, FIXED_NOW)).toEqual({
      robots: { index: false, follow: true },
    });
  });

  it('returns undefined for fresh years', () => {
    expect(staleYearRobots(2026, FIXED_NOW)).toBeUndefined();
    expect(staleYearRobots(2025, FIXED_NOW)).toBeUndefined();
  });
});

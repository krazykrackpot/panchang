import { describe, it, expect } from 'vitest';
import { isStrictYmd, isRolloverDate } from '../date-validation';

/**
 * Anchors the shared YYYY-MM-DD validator that backs both the proxy
 * (edge-level 404 for rollover URLs) and the date-based page handlers.
 *
 * The bug these tests prevent: `new Date('2026-02-30')` parses without
 * error and rolls over to 2026-03-02, which used to make Google index
 * /en/horoscope/aries/2026-02-30 with March-2 content — duplicate of
 * the legitimate /en/horoscope/aries/2026-03-02 URL.
 */

describe('isStrictYmd', () => {
  describe('accepts', () => {
    it.each([
      ['2026-06-01'],
      ['2026-01-01'],
      ['2026-12-31'],
      ['2024-02-29'], // Real leap day
      ['2000-02-29'], // Century leap (divisible by 400)
      ['2030-07-04'],
    ])('valid date %s', (s) => {
      expect(isStrictYmd(s)).toBe(true);
    });
  });

  describe('rejects rollover dates', () => {
    it.each([
      ['2026-02-30'], // Feb 30 → rolls to Mar 2
      ['2026-02-29'], // Non-leap-year Feb 29 → rolls to Mar 1
      ['2026-04-31'], // Apr has 30 days
      ['2026-06-31'], // Jun has 30 days
      ['2026-09-31'],
      ['2026-11-31'],
      ['1900-02-29'], // Century non-leap (divisible by 100 but not 400)
    ])('rollover %s', (s) => {
      expect(isStrictYmd(s)).toBe(false);
    });
  });

  describe('rejects out-of-range components', () => {
    it.each([
      ['2026-00-15'], // month 0
      ['2026-13-15'], // month 13
      ['2026-99-99'], // wildly out of range
      ['2026-06-00'], // day 0
      ['2026-06-32'], // day 32
    ])('out-of-range %s', (s) => {
      expect(isStrictYmd(s)).toBe(false);
    });
  });

  describe('rejects shape mismatches', () => {
    it.each([
      [''],
      ['weekly'],
      ['monthly'],
      ['delhi'],
      ['2026'],
      ['2026-06'],
      ['2026-06-1'], // missing leading zero
      ['26-06-01'], // 2-digit year
      ['2026/06/01'], // slashes
      ['2026-06-01T00:00:00Z'], // timestamp
      ['  2026-06-01  '], // whitespace
    ])('shape mismatch %s', (s) => {
      expect(isStrictYmd(s)).toBe(false);
    });
  });
});

describe('isRolloverDate', () => {
  describe('returns TRUE only for date-shaped rollovers', () => {
    it.each([
      ['2026-02-30'],
      ['2026-04-31'],
      ['2026-02-29'],
      ['2026-13-01'], // month 13 — still date-shape, fails round-trip
      ['2026-00-15'], // month 0 — still date-shape, fails round-trip
      ['2026-99-99'],
    ])('rollover %s → true', (s) => {
      expect(isRolloverDate(s)).toBe(true);
    });
  });

  describe('returns FALSE for non-date-shaped strings (lets siblings pass)', () => {
    // CRITICAL: these strings reach the same route position as [date]
    // in the horoscope tree (/horoscope/[rashi]/weekly is a sibling of
    // /horoscope/[rashi]/[date]). If isRolloverDate returned true here,
    // the proxy would incorrectly 404 the legitimate sibling routes.
    it.each([
      ['weekly'],
      ['monthly'],
      ['delhi'],
      [''],
      ['2026'], // year-only — used by /muhurta/[type]/[year]
      ['2026-06'], // year-month
    ])('non-date %s → false', (s) => {
      expect(isRolloverDate(s)).toBe(false);
    });
  });

  describe('returns FALSE for valid dates (let them through)', () => {
    it.each([
      ['2026-06-01'],
      ['2024-02-29'],
      ['2030-12-31'],
    ])('valid %s → false', (s) => {
      expect(isRolloverDate(s)).toBe(false);
    });
  });

  it('is the negation of isStrictYmd on YYYY-MM-DD-shaped inputs', () => {
    // Invariant: for any string matching the shape, exactly one of
    // (isStrictYmd, isRolloverDate) is true. For non-date-shaped
    // strings, both are false.
    const dateShaped = ['2026-06-01', '2026-02-30', '2024-02-29', '1900-02-29'];
    for (const s of dateShaped) {
      expect(isStrictYmd(s) || isRolloverDate(s)).toBe(true);
      expect(isStrictYmd(s) && isRolloverDate(s)).toBe(false);
    }
    const notDateShaped = ['weekly', 'monthly', '2026'];
    for (const s of notDateShaped) {
      expect(isStrictYmd(s)).toBe(false);
      expect(isRolloverDate(s)).toBe(false);
    }
  });
});

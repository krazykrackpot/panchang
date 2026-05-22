/**
 * Date-math regression suite for the tithi-grid end-time projection helpers.
 *
 * These helpers are exactly the bug class CLAUDE.md Lessons L and V warn
 * about (JD↔Date conversions, fractional-day projection, tz-offset
 * arithmetic). The PR review (test-coverage agent) flagged ~6 distinct
 * failure modes that had zero coverage. This file pins each one.
 */

import { describe, it, expect } from 'vitest';
import {
  jdToLocalHHMM,
  formatLocalTimeFromUT,
  nextBoundary,
} from '@/lib/calendar/tithi-grid-projection';
import { dateToJD } from '@/lib/ephem/astronomical';

describe('jdToLocalHHMM', () => {
  it('formats a same-day moment correctly with positive tz offset', () => {
    // 14:30 UT on 2026-05-22, tzOffset +2 (CEST) → local 16:30 same day
    const jd = dateToJD(2026, 5, 22, 14.5);
    expect(jdToLocalHHMM(jd, 2026, 5, 22, 2)).toEqual({ hhmm: '16:30', nextDay: false });
  });

  it('flags nextDay when the moment falls past local midnight', () => {
    // 23:30 UT on 2026-05-22, tzOffset +2 → local 01:30 next day
    const jd = dateToJD(2026, 5, 22, 23.5);
    expect(jdToLocalHHMM(jd, 2026, 5, 22, 2)).toEqual({ hhmm: '01:30', nextDay: true });
  });

  it('handles negative tz offset (US Eastern) — shifts to same-day evening', () => {
    // 02:00 UT on 2026-05-23 = 21:00 EST on 2026-05-22.
    // Caller anchors on 2026-05-22 (sunrise day) with tzOffset = -5.
    // hoursUT = 26, hoursLocal = 21, dayOffset = 0 → 21:00 same day.
    const jd = dateToJD(2026, 5, 23, 2);
    expect(jdToLocalHHMM(jd, 2026, 5, 22, -5)).toEqual({ hhmm: '21:00', nextDay: false });
  });

  it('handles half-hour tz offset (Asia/Kolkata = +5.5)', () => {
    // 12:00 UT → local 17:30 same day
    const jd = dateToJD(2026, 5, 22, 12);
    expect(jdToLocalHHMM(jd, 2026, 5, 22, 5.5)).toEqual({ hhmm: '17:30', nextDay: false });
  });

  it('handles quarter-hour tz offset (Nepal = +5.75) — boundary near midnight', () => {
    // 18.25 UT → 18.25 + 5.75 = 24.00 → 00:00 next day
    const jd = dateToJD(2026, 5, 22, 18.25);
    const result = jdToLocalHHMM(jd, 2026, 5, 22, 5.75);
    expect(result.hhmm).toBe('00:00');
    expect(result.nextDay).toBe(true);
  });

  it('carries minute-rounding to 60 into nextDay (review C1 fix)', () => {
    // 23:59:55 local — Math.round(0.999...) yields 60 → 00:00 + nextDay bump
    // Build a JD that lands exactly at 23:59:30 local with tz +0:
    //   hoursLocal = 23 + 59/60 + 30/3600 = 23.9916...
    // The carry-to-60 only happens at a few specific decimals — easiest to
    // pin by computing what hoursUT would need to be for the rounding to
    // bump. We assert the invariant: at any local time near 23:59:59 the
    // result is either 23:59 same-day or 00:00 next-day, never 24:00.
    const jd = dateToJD(2026, 5, 22, 23 + 59.7 / 60); // ~23:59:42 UT
    const r = jdToLocalHHMM(jd, 2026, 5, 22, 0);
    expect(r.hhmm).toMatch(/^(23:59|00:00)$/);
    if (r.hhmm === '00:00') expect(r.nextDay).toBe(true);
    else expect(r.nextDay).toBe(false);
  });
});

describe('formatLocalTimeFromUT', () => {
  it('formats a positive offset within the same day', () => {
    expect(formatLocalTimeFromUT(8, 2)).toBe('10:00');
  });

  it('wraps past midnight when offset pushes time past 24', () => {
    expect(formatLocalTimeFromUT(23, 2)).toBe('01:00');
  });

  it('wraps before midnight when negative offset pulls below 0', () => {
    expect(formatLocalTimeFromUT(1, -5)).toBe('20:00');
  });

  it('handles half-hour offsets', () => {
    expect(formatLocalTimeFromUT(12, 5.5)).toBe('17:30');
  });

  it('handles double-wrap-safe combined modulo', () => {
    // Absurd offset shouldn't iterate or stall.
    expect(formatLocalTimeFromUT(0, 28)).toBe('04:00');
    expect(formatLocalTimeFromUT(0, -28)).toBe('20:00');
  });
});

describe('nextBoundary', () => {
  // Synthetic value functions for predictable projections.
  // valueLinear: starts at 5, increases by 12 per day → crosses 12° boundary
  // in 7/12 of a day from jdStart.
  const valueLinear = (jdStart: number) => (jd: number) => 5 + (jd - jdStart) * 12;

  it('projects a same-day boundary correctly', () => {
    const jdStart = dateToJD(2026, 5, 22, 6); // 06:00 UT on 2026-05-22
    const result = nextBoundary(jdStart, valueLinear(jdStart), 12, 2026, 5, 22, 2);
    expect(result).toBeDefined();
    // remaining = 12 - (5 % 12) = 7. rate = 12/day. daysToCross = 7/12 ≈ 14h.
    // jdEnd ≈ 06:00 UT + 14h = 20:00 UT = 22:00 local.
    expect(result!.nextDay).toBe(false);
    // Tolerance ±2 minutes for floating-point.
    const [hh, mm] = result!.hhmm.split(':').map(Number);
    const totalMin = hh * 60 + mm;
    expect(Math.abs(totalMin - (22 * 60))).toBeLessThan(3);
  });

  it('flags nextDay when projection crosses local midnight', () => {
    // Rate stays 12/day but value starts at 11 (close to boundary at 12).
    // remaining = 12 - 11 = 1° → daysToCross = 1/12 ≈ 2h. From jdStart at
    // 22:30 UT, end is at ~00:30 UT next day. Local tz +2 → 02:30 next day.
    const jdStart = dateToJD(2026, 5, 22, 22.5);
    const fn = (jd: number) => 11 + (jd - jdStart) * 12;
    const r = nextBoundary(jdStart, fn, 12, 2026, 5, 22, 2);
    expect(r).toBeDefined();
    expect(r!.nextDay).toBe(true);
  });

  it('handles the 360° wrap on the rate-of-change sample', () => {
    // value just wrapped: v0 = 358, v1 = 4 (i.e. crossed 360 between samples).
    // dv = 4 - 358 = -354 → += 360 → 6 per day.
    const jdStart = dateToJD(2026, 5, 22, 6);
    const fn = (jd: number) => (jd === jdStart ? 358 : 4);
    const r = nextBoundary(jdStart, fn, 12, 2026, 5, 22, 0);
    expect(r).toBeDefined();
    // remaining = 12 - (358 % 12) = 12 - 10 = 2; daysToCross = 2/6 = 0.333 day = 8h.
    // jdEnd = 14:00 UT = 14:00 local.
    const [hh] = r!.hhmm.split(':').map(Number);
    expect(hh).toBe(14);
  });

  it('returns undefined and warns for a stationary accumulator', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const jdStart = dateToJD(2026, 5, 22, 6);
    const fn = () => 5; // stationary at 5 — never crosses
    const r = nextBoundary(jdStart, fn, 12, 2026, 5, 22, 0);
    expect(r).toBeUndefined();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockRestore();
  });
});

// Re-export vi so the test file resolves it (Vitest globals not enabled in
// this project's config — keeps consistency with sibling tests).
import { vi } from 'vitest';

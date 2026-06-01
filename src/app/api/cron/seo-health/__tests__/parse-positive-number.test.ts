/**
 * Edge-case coverage for `parsePositiveNumber`.
 *
 * The helper exists to close two Number(...) foot-guns the cron's
 * env tuning surface kept tripping over:
 *
 *   - `Number("")` returns 0 — would silently set the drop threshold
 *     to 0 and fire alerts every day (Gemini PR #337 cycle-2 HIGH).
 *   - `Number("foo")` returns NaN — would silently disable detection
 *     (Gemini PR #337 cycle-1 MED).
 *
 * Each below pins down one path the helper has to handle exactly.
 */
import { describe, it, expect } from 'vitest';
import { parsePositiveNumber } from '../route';

describe('parsePositiveNumber', () => {
  it('returns the parsed value when input is a valid positive number', () => {
    expect(parsePositiveNumber('0.5', 0.4)).toBe(0.5);
    expect(parsePositiveNumber('100', 50)).toBe(100);
    expect(parsePositiveNumber(' 0.7 ', 0.4)).toBe(0.7); // trims
  });

  it('falls back when input is undefined', () => {
    expect(parsePositiveNumber(undefined, 0.4)).toBe(0.4);
  });

  it('falls back when input is empty string (Number("") = 0 foot-gun)', () => {
    expect(parsePositiveNumber('', 0.4)).toBe(0.4);
  });

  it('falls back when input is whitespace only (Number("  ") = 0)', () => {
    expect(parsePositiveNumber('   ', 0.4)).toBe(0.4);
    expect(parsePositiveNumber('\t\n', 0.4)).toBe(0.4);
  });

  it('falls back when input is non-numeric (Number("foo") = NaN)', () => {
    expect(parsePositiveNumber('foo', 0.4)).toBe(0.4);
    expect(parsePositiveNumber('0.5x', 0.4)).toBe(0.4);
  });

  it('falls back when input is zero or negative', () => {
    expect(parsePositiveNumber('0', 0.4)).toBe(0.4);
    expect(parsePositiveNumber('-0.5', 0.4)).toBe(0.4);
  });

  it('falls back when input is Infinity', () => {
    expect(parsePositiveNumber('Infinity', 0.4)).toBe(0.4);
  });
});

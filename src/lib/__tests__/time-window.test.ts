/**
 * Lesson R compliance suite for the midnight-wrap-aware window check.
 * The helper's docstring explicitly cites the lesson but the PR review
 * (test-coverage agent) flagged that the wrap branch had zero coverage.
 */

import { describe, it, expect } from 'vitest';
import { isInsideWindow } from '@/lib/utils/time-window';

describe('isInsideWindow — non-wrap case', () => {
  it('inside', () => expect(isInsideWindow('14:30', '13:00', '15:00')).toBe(true));
  it('inclusive at start', () => expect(isInsideWindow('13:00', '13:00', '15:00')).toBe(true));
  it('exclusive at end', () => expect(isInsideWindow('15:00', '13:00', '15:00')).toBe(false));
  it('before the window', () => expect(isInsideWindow('12:59', '13:00', '15:00')).toBe(false));
  it('after the window', () => expect(isInsideWindow('15:01', '13:00', '15:00')).toBe(false));
});

describe('isInsideWindow — midnight wrap', () => {
  it('inside the late half', () => expect(isInsideWindow('23:00', '22:30', '01:15')).toBe(true));
  it('inside the early half', () => expect(isInsideWindow('00:30', '22:30', '01:15')).toBe(true));
  it('outside, between end and start', () => expect(isInsideWindow('12:00', '22:30', '01:15')).toBe(false));
  it('inclusive at wrap start', () => expect(isInsideWindow('22:30', '22:30', '01:15')).toBe(true));
  it('exclusive at wrap end', () => expect(isInsideWindow('01:15', '22:30', '01:15')).toBe(false));
});

describe('isInsideWindow — degenerate', () => {
  it('start === end means empty window, never inside', () => {
    expect(isInsideWindow('14:00', '14:00', '14:00')).toBe(false);
  });
});

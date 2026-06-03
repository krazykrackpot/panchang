/**
 * Pure-logic tests for PageEngagement bucket math. The DOM wiring
 * (scroll listener, pagehide, visibilitychange) is best covered by the
 * Playwright crawler; here we just lock down the bucket boundaries so
 * a future tweak that, say, makes "5-30s" overlap with "30s-2m" gets
 * caught immediately.
 */

import { describe, it, expect } from 'vitest';
import { bucketScroll, bucketDwell } from '../PageEngagement';

describe('bucketScroll', () => {
  it('maps below 25% to bucket 0', () => {
    expect(bucketScroll(0)).toBe(0);
    expect(bucketScroll(24.9)).toBe(0);
  });

  it('uses lower-inclusive boundaries', () => {
    expect(bucketScroll(25)).toBe(25);
    expect(bucketScroll(50)).toBe(50);
    expect(bucketScroll(75)).toBe(75);
    expect(bucketScroll(100)).toBe(100);
  });

  it('clamps above 100 to bucket 100', () => {
    expect(bucketScroll(150)).toBe(100);
  });
});

describe('bucketDwell', () => {
  it('uses upper-exclusive ms→bucket boundaries', () => {
    expect(bucketDwell(0)).toBe('0-5s');
    expect(bucketDwell(4_999)).toBe('0-5s');
    expect(bucketDwell(5_000)).toBe('5-30s');
    expect(bucketDwell(29_999)).toBe('5-30s');
    expect(bucketDwell(30_000)).toBe('30s-2m');
    expect(bucketDwell(119_999)).toBe('30s-2m');
    expect(bucketDwell(120_000)).toBe('2-5m');
    expect(bucketDwell(299_999)).toBe('2-5m');
    expect(bucketDwell(300_000)).toBe('5m+');
    expect(bucketDwell(60 * 60 * 1000)).toBe('5m+');
  });
});

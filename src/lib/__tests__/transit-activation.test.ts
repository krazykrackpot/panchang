/**
 * Tests for transit-activation module.
 *
 * Verifies:
 * - Returns exactly 4 planets (Jupiter, Saturn, Rahu, Ketu)
 * - Each entry has a valid house (1-12)
 * - Each entry has a valid sign (1-12)
 * - Rahu and Ketu are always retrograde
 * - Results are deterministic for a fixed date
 * - Works for all 12 possible ascendant signs
 */

import { describe, it, expect } from 'vitest';
import {
  computeCurrentTransits,
  currentSiderealLong,
  type TransitEntry,
} from '@/lib/kundali/domain-synthesis/transit-activation';

describe('computeCurrentTransits', () => {
  const SLOW_PLANET_IDS = [4, 6, 7, 8];

  it('returns exactly 4 transit entries', () => {
    const result = computeCurrentTransits(1); // Aries ascendant
    expect(result).toHaveLength(4);
  });

  it('returns entries for Jupiter (4), Saturn (6), Rahu (7), Ketu (8)', () => {
    const result = computeCurrentTransits(1);
    const ids = result.map(t => t.planetId).sort();
    expect(ids).toEqual([4, 6, 7, 8]);
  });

  it('each entry has a valid house between 1 and 12', () => {
    const result = computeCurrentTransits(5); // Leo ascendant
    for (const t of result) {
      expect(t.transitHouse).toBeGreaterThanOrEqual(1);
      expect(t.transitHouse).toBeLessThanOrEqual(12);
    }
  });

  it('each entry has a valid sign between 1 and 12', () => {
    const result = computeCurrentTransits(1);
    for (const t of result) {
      expect(t.currentSign).toBeGreaterThanOrEqual(1);
      expect(t.currentSign).toBeLessThanOrEqual(12);
    }
  });

  it('Rahu (7) is always retrograde', () => {
    const result = computeCurrentTransits(1);
    const rahu = result.find(t => t.planetId === 7);
    expect(rahu).toBeDefined();
    expect(rahu!.isRetrograde).toBe(true);
  });

  it('Ketu (8) is always retrograde', () => {
    const result = computeCurrentTransits(1);
    const ketu = result.find(t => t.planetId === 8);
    expect(ketu).toBeDefined();
    expect(ketu!.isRetrograde).toBe(true);
  });

  it('returns deterministic results for a fixed date', () => {
    const fixedDate = new Date('2026-04-12T12:00:00Z');
    const result1 = computeCurrentTransits(1, fixedDate);
    const result2 = computeCurrentTransits(1, fixedDate);
    expect(result1).toEqual(result2);
  });

  it('works correctly for all 12 ascendant signs', () => {
    const fixedDate = new Date('2026-04-12T12:00:00Z');
    for (let asc = 1; asc <= 12; asc++) {
      const result = computeCurrentTransits(asc, fixedDate);
      expect(result).toHaveLength(4);
      for (const t of result) {
        expect(t.transitHouse).toBeGreaterThanOrEqual(1);
        expect(t.transitHouse).toBeLessThanOrEqual(12);
        expect(t.currentSign).toBeGreaterThanOrEqual(1);
        expect(t.currentSign).toBeLessThanOrEqual(12);
      }
    }
  });

  it('transit house changes with different ascendant signs', () => {
    const fixedDate = new Date('2026-04-12T12:00:00Z');
    const result1 = computeCurrentTransits(1, fixedDate); // Aries asc
    const result2 = computeCurrentTransits(7, fixedDate); // Libra asc

    // Same planet sign but different houses
    const ju1 = result1.find(t => t.planetId === 4)!;
    const ju2 = result2.find(t => t.planetId === 4)!;
    expect(ju1.currentSign).toBe(ju2.currentSign); // Same sign
    expect(ju1.transitHouse).not.toBe(ju2.transitHouse); // Different house
  });

  it('Ketu sign is always opposite to Rahu sign', () => {
    const fixedDate = new Date('2026-04-12T12:00:00Z');
    const result = computeCurrentTransits(1, fixedDate);
    const rahu = result.find(t => t.planetId === 7)!;
    const ketu = result.find(t => t.planetId === 8)!;

    // Signs should be 6 apart (opposite)
    const diff = ((ketu.currentSign - rahu.currentSign + 12) % 12);
    expect(diff).toBe(6);
  });
});

describe('currentSiderealLong', () => {
  it('returns a value between 0 and 360 for Jupiter', () => {
    const jd = 2460780; // Approximate JD for Apr 2025
    const long = currentSiderealLong(4, jd);
    expect(long).toBeGreaterThanOrEqual(0);
    expect(long).toBeLessThan(360);
  });

  it('returns a value between 0 and 360 for Saturn', () => {
    const jd = 2460780;
    const long = currentSiderealLong(6, jd);
    expect(long).toBeGreaterThanOrEqual(0);
    expect(long).toBeLessThan(360);
  });

  it('returns 0 for unknown planet IDs', () => {
    const jd = 2460780;
    const long = currentSiderealLong(99, jd);
    expect(long).toBe(0);
  });
});

// src/lib/__tests__/caesarean-scanner.test.ts
import { describe, it, expect } from 'vitest';
import { scanCaesareanSlots } from '@/lib/caesarean/scanner';

describe('scanCaesareanSlots', () => {
  it('returns scored slots within operating hours', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-15', // Single day
      lat: 46.4667,  // Corseaux
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 9,
      opEnd: 15,
      windowMinutes: 60, // 1-hour windows for faster test
      maxResults: 10,
    });
    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots.length).toBeLessThanOrEqual(10);
    // All slots within operating hours
    for (const slot of result.slots) {
      const hour = parseInt(slot.time.split(':')[0], 10);
      expect(hour).toBeGreaterThanOrEqual(9);
      expect(hour).toBeLessThan(15);
    }
    // Sorted by score descending
    for (let i = 1; i < result.slots.length; i++) {
      expect(result.slots[i - 1].score).toBeGreaterThanOrEqual(result.slots[i].score);
    }
    // Each slot has a valid grade
    for (const slot of result.slots) {
      expect(['excellent', 'good', 'fair', 'marginal', 'poor', 'vetoed']).toContain(slot.grade);
    }
    // Meta populated
    expect(result.meta.totalSlotsEvaluated).toBeGreaterThan(0);
    expect(result.meta.computeTimeMs).toBeGreaterThanOrEqual(0);
  }, 30000); // Allow up to 30s  –  chart computation is CPU-heavy

  it('scans a 3-day range and returns ranked results', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-17',
      lat: 46.4667,
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 8,
      opEnd: 17,
      windowMinutes: 60,
      maxResults: 5,
    });
    expect(result.slots.length).toBeLessThanOrEqual(5);
    // Should have slots from at least 1 day (could be more)
    const dates = new Set(result.slots.map(s => s.date));
    expect(dates.size).toBeGreaterThanOrEqual(1);
  }, 60000);

  it('fills panchang display names on each slot', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-15',
      lat: 46.4667,
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 10,
      opEnd: 12,
      windowMinutes: 60,
      maxResults: 5,
    });
    expect(result.slots.length).toBeGreaterThan(0);
    for (const slot of result.slots) {
      // Panchang names should be populated, not empty
      expect(slot.panchang.tithi.en).toBeTruthy();
      expect(slot.panchang.nakshatra.en).toBeTruthy();
      expect(slot.panchang.yoga.en).toBeTruthy();
      expect(slot.panchang.karana.en).toBeTruthy();
      // Date and time should be filled
      expect(slot.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(slot.time).toMatch(/^\d{2}:\d{2}$/);
      expect(slot.endTime).toMatch(/^\d{2}:\d{2}$/);
    }
  }, 30000);

  it('respects maxResults cap', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-15',
      lat: 46.4667,
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 8,
      opEnd: 17,
      windowMinutes: 60,
      maxResults: 3,
    });
    expect(result.slots.length).toBeLessThanOrEqual(3);
    // Total evaluated should be more than maxResults (9 hours / 1-hour windows = 9 slots)
    expect(result.meta.totalSlotsEvaluated).toBeGreaterThan(3);
  }, 30000);
});

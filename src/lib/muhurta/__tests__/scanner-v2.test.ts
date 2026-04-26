import { describe, it, expect } from 'vitest';
import { scanDateRangeV2 } from '../time-window-scanner';
import type { ScanOptionsV2 } from '@/types/muhurta-ai';

const CORSEAUX_LAT = 46.4625;
const CORSEAUX_LNG = 6.8035;

describe('scanDateRangeV2', () => {
  it('returns windows for a single day with 120-min resolution', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 2,
      postSunsetHours: 3,
    };
    const windows = scanDateRangeV2(options);
    expect(Array.isArray(windows)).toBe(true);
    expect(windows.length).toBeGreaterThanOrEqual(6);
    expect(windows.length).toBeLessThanOrEqual(12);
  }, 30000);

  it('returns more windows with 15-min resolution', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 15,
      preSunriseHours: 2,
      postSunsetHours: 3,
    };
    const windows = scanDateRangeV2(options);
    expect(windows.length).toBeGreaterThanOrEqual(40);
    expect(windows.length).toBeLessThanOrEqual(80);
  }, 30000);

  it('windows include inauspicious period data', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 15,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);
    for (const w of windows) {
      expect(Array.isArray(w.inauspiciousPeriods)).toBe(true);
      expect(w.inauspiciousPeriods.length).toBeGreaterThanOrEqual(3);
      for (const p of w.inauspiciousPeriods) {
        expect(typeof p.name).toBe('string');
        expect(typeof p.active).toBe('boolean');
        expect(p.startTime).toMatch(/^\d{2}:\d{2}$/);
        expect(p.endTime).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  }, 30000);

  it('includes dasha harmony when dashaLords provided', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
      dashaLords: { maha: 1, antar: 4, pratyantar: 5 },
    };
    const windows = scanDateRangeV2(options);
    for (const w of windows) {
      expect(w.breakdown.dashaHarmony).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.dashaHarmony).toBeLessThanOrEqual(10);
    }
  }, 30000);

  it('score is normalized 0-100', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-10',
      activity: 'marriage',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);
    for (const w of windows) {
      expect(w.score).toBeGreaterThanOrEqual(0);
      expect(w.score).toBeLessThanOrEqual(100);
    }
  }, 30000);

  it('has breakdown with all fields', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'marriage',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);
    for (const w of windows) {
      expect(typeof w.breakdown.tithi).toBe('number');
      expect(typeof w.breakdown.nakshatra).toBe('number');
      expect(typeof w.breakdown.yoga).toBe('number');
      expect(typeof w.breakdown.karana).toBe('number');
      expect(typeof w.breakdown.taraBala).toBe('number');
      expect(typeof w.breakdown.chandraBala).toBe('number');
      expect(typeof w.breakdown.dashaHarmony).toBe('number');
      expect(typeof w.breakdown.inauspicious).toBe('number');
    }
  }, 30000);

  it('existing scanDateRange still works (backward compat)', async () => {
    const { scanDateRange } = await import('../time-window-scanner');
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      activity: 'marriage',
      lat: 28.6139,
      lng: 77.209,
      tz: 5.5,
    });
    expect(Array.isArray(windows)).toBe(true);
  }, 30000);
});

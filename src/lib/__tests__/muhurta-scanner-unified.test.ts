import { describe, it, expect } from 'vitest';
// Import engine to register rules
import '@/lib/muhurta/engine';
import { unifiedScan } from '@/lib/muhurta/engine/scanner';

describe('Unified Scanner', () => {
  it('scans a date range and returns windows with valid scores', () => {
    // Use wider range + business activity — marriage may be vetoed on specific
    // days due to hard inauspicious yoga or combustion (classical hardening)
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      activity: 'business',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
    });
    expect(windows.length).toBeGreaterThan(0);
    for (const w of windows) {
      expect(w.score).toBeGreaterThanOrEqual(0);
      expect(w.score).toBeLessThanOrEqual(100);
      expect(w.panchangContext.tithiName).toBeTruthy();
      expect(w.panchangContext.nakshatraName).toBeTruthy();
    }
  });

  it('filters by minScore', () => {
    const all = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
    });
    const filtered = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
      minScore: 50,
    });
    expect(filtered.length).toBeLessThanOrEqual(all.length);
    for (const w of filtered) expect(w.score).toBeGreaterThanOrEqual(50);
  });

  it('limits by maxResults', () => {
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
      maxResults: 3,
    });
    expect(windows.length).toBeLessThanOrEqual(3);
  });

  it('returns no windows on a combustion-vetoed day for marriage', () => {
    // Venus combust ~Jan 2026
    const windows = unifiedScan({
      startDate: '2026-01-20',
      endDate: '2026-01-20',
      activity: 'marriage',
      lat: 46.46,
      lng: 6.80,
      tz: 1,
      windowMinutes: 120,
    });
    expect(windows.length).toBe(0);
  });

  it('panchangContext has non-empty names', () => {
    const windows = unifiedScan({
      startDate: '2026-07-15',
      endDate: '2026-07-15',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 180,
    });
    if (windows.length > 0) {
      const w = windows[0];
      expect(w.panchangContext.tithiName.length).toBeGreaterThan(0);
      expect(w.panchangContext.nakshatraName.length).toBeGreaterThan(0);
      expect(w.panchangContext.yogaName.length).toBeGreaterThan(0);
      expect(w.panchangContext.karanaName.length).toBeGreaterThan(0);
    }
  });

  it('returns sorted by score descending', () => {
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-17',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
    });
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i - 1].score).toBeGreaterThanOrEqual(windows[i].score);
    }
  });

  it('includes verdicts when requested', () => {
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 180,
      includeVerdicts: true,
    });
    if (windows.length > 0) {
      const w = windows[0];
      expect(w.verdict).toBeDefined();
      expect(w.verdict!.grade).toBeTruthy();
      expect(w.verdict!.headline).toBeDefined();
    }
  });

  it('computes tara bala when birthNakshatra is provided', () => {
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-15',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 180,
      birthNakshatra: 1, // Ashwini
    });
    if (windows.length > 0) {
      const w = windows[0];
      expect(w.taraBala).toBeDefined();
      expect(w.taraBala!.tara).toBeGreaterThanOrEqual(1);
      expect(w.taraBala!.tara).toBeLessThanOrEqual(9);
      expect(w.taraBala!.name).toBeTruthy();
      expect(typeof w.taraBala!.auspicious).toBe('boolean');
    }
  });

  it('two-pass mode returns results', () => {
    const windows = unifiedScan({
      startDate: '2026-06-15',
      endDate: '2026-06-20',
      activity: 'travel',
      lat: 46.46,
      lng: 6.80,
      tz: 2,
      windowMinutes: 120,
      twoPass: true,
      twoPassTopDays: 2,
      maxResults: 5,
    });
    expect(windows.length).toBeLessThanOrEqual(5);
    // Should only have results from at most 2 unique days
    const uniqueDays = new Set(windows.map((w) => w.date));
    expect(uniqueDays.size).toBeLessThanOrEqual(2);
  });
});

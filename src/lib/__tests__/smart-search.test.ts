import { describe, it, expect } from 'vitest';
import {
  smartMuhurtaSearch,
  type SearchParams,
  type MuhurtaWindow,
  type UserSnapshot,
} from '../muhurta/smart-search';

// Test location: Corseaux, Switzerland (user's location per CLAUDE.md)
const CORSEAUX_PARAMS: SearchParams = {
  activity: 'marriage',
  startDate: '2026-10-10',
  endDate: '2026-10-20',
  lat: 46.4667,
  lng: 6.8,
  tzOffset: 2, // CEST (Central European Summer Time)
};

// Delhi for a second reference
const DELHI_PARAMS: SearchParams = {
  activity: 'business',
  startDate: '2026-05-01',
  endDate: '2026-05-10',
  lat: 28.6139,
  lng: 77.209,
  tzOffset: 5.5,
};

// Short range for faster tests
const SHORT_RANGE_PARAMS: SearchParams = {
  activity: 'travel',
  startDate: '2026-06-15',
  endDate: '2026-06-18',
  lat: 46.4667,
  lng: 6.8,
  tzOffset: 2,
};

describe('smartMuhurtaSearch', () => {
  it('returns max 3 windows sorted by score', () => {
    const windows = smartMuhurtaSearch(SHORT_RANGE_PARAMS);
    expect(windows.length).toBeLessThanOrEqual(3);
    // Sorted descending by score
    for (let i = 1; i < windows.length; i++) {
      expect(windows[i - 1].score).toBeGreaterThanOrEqual(windows[i].score);
    }
  });

  it('each window has all required fields', () => {
    const windows = smartMuhurtaSearch(SHORT_RANGE_PARAMS);
    for (const w of windows) {
      expect(w.date).toBeTruthy();
      expect(w.startTime).toBeTruthy();
      expect(w.endTime).toBeTruthy();
      expect(typeof w.score).toBe('number');
      expect(w.score).toBeGreaterThanOrEqual(0);
      expect(w.score).toBeLessThanOrEqual(100);
      expect(w.breakdown).toBeDefined();
      expect(w.proof).toBeDefined();
    }
  });

  it('works with a longer date range', () => {
    const windows = smartMuhurtaSearch(CORSEAUX_PARAMS);
    expect(Array.isArray(windows)).toBe(true);
    expect(windows.length).toBeLessThanOrEqual(3);
    // Each window date should be within the search range
    for (const w of windows) {
      expect(w.date >= '2026-10-10').toBe(true);
      expect(w.date <= '2026-10-20').toBe(true);
    }
  });

  it('works with personal snapshot', () => {
    const userSnapshot: UserSnapshot = {
      birthData: {
        name: 'Test',
        date: '1985-03-20',
        time: '08:00',
        place: 'Bern',
        lat: 46.9480,
        lng: 7.4474,
        timezone: 'Europe/Zurich',
        ayanamsha: 'lahiri',
      },
    };

    const windows = smartMuhurtaSearch(SHORT_RANGE_PARAMS, userSnapshot);
    expect(windows.length).toBeLessThanOrEqual(3);
    for (const w of windows) {
      expect(typeof w.breakdown.personal).toBe('number');
    }
  });

  it('returns windows with valid score breakdown fields', () => {
    const windows = smartMuhurtaSearch(DELHI_PARAMS);
    for (const w of windows) {
      const { panchang, lagna, hora, personal } = w.breakdown;
      expect(panchang).toBeGreaterThanOrEqual(0);
      expect(panchang).toBeLessThanOrEqual(25);
      expect(lagna).toBeGreaterThanOrEqual(0);
      expect(lagna).toBeLessThanOrEqual(25);
      expect(hora).toBeGreaterThanOrEqual(0);
      expect(hora).toBeLessThanOrEqual(25);
      expect(personal).toBeGreaterThanOrEqual(0);
      expect(personal).toBeLessThanOrEqual(25);
      expect(w.score).toBeGreaterThanOrEqual(0);
      expect(w.score).toBeLessThanOrEqual(100);
    }
  });

  it('different activities may produce different results', () => {
    const marriageWindows = smartMuhurtaSearch({
      ...SHORT_RANGE_PARAMS,
      activity: 'marriage',
    });
    const travelWindows = smartMuhurtaSearch({
      ...SHORT_RANGE_PARAMS,
      activity: 'travel',
    });

    // Both should return valid results — actual scores may differ
    expect(Array.isArray(marriageWindows)).toBe(true);
    expect(Array.isArray(travelWindows)).toBe(true);
  });
});

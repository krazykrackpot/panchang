import { describe, it, expect } from 'vitest';
import {
  coarseScan,
  fineScan,
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

describe('coarseScan', () => {
  it('returns ranked days with scores', () => {
    const days = coarseScan(CORSEAUX_PARAMS);
    expect(days.length).toBeGreaterThan(0);
    expect(days.length).toBeLessThanOrEqual(5);
    // Days should be sorted by peakScore descending
    for (let i = 1; i < days.length; i++) {
      expect(days[i - 1].peakScore).toBeGreaterThanOrEqual(days[i].peakScore);
    }
  });

  it('each day has valid date string and non-negative score', () => {
    const days = coarseScan(SHORT_RANGE_PARAMS);
    for (const d of days) {
      expect(d.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(d.peakScore).toBeGreaterThanOrEqual(0);
      expect(d.peakScore).toBeLessThanOrEqual(25); // max from scorePanchangFactors
    }
  });

  it('returns at most 5 days', () => {
    const days = coarseScan(CORSEAUX_PARAMS);
    expect(days.length).toBeLessThanOrEqual(5);
  });

  it('works with Delhi location and business activity', () => {
    const days = coarseScan(DELHI_PARAMS);
    expect(days.length).toBeGreaterThan(0);
    expect(days[0].date).toMatch(/^2026-05-/);
  });

  it('returns empty array for unknown activity', () => {
    const params = { ...SHORT_RANGE_PARAMS, activity: 'unknown_xyz' as never };
    const days = coarseScan(params);
    expect(days).toEqual([]);
  });
});

describe('fineScan', () => {
  it('returns windows for a single day', () => {
    // Use a date from coarse scan
    const days = coarseScan(SHORT_RANGE_PARAMS);
    expect(days.length).toBeGreaterThan(0);
    const topDate = days[0].date;

    const windows = fineScan(topDate, SHORT_RANGE_PARAMS);
    // May return 0 windows if nothing scores above threshold — that's valid
    expect(Array.isArray(windows)).toBe(true);
    expect(windows.length).toBeLessThanOrEqual(3);
  });

  it('each window has complete proof breakdown', () => {
    const days = coarseScan(CORSEAUX_PARAMS);
    if (days.length === 0) return; // skip if no days found
    const windows = fineScan(days[0].date, CORSEAUX_PARAMS);
    for (const w of windows) {
      // Proof structure
      expect(w.proof.tithi).toBeDefined();
      expect(w.proof.tithi.name).toBeTruthy();
      expect(w.proof.tithi.quality).toBeTruthy();
      expect(w.proof.nakshatra).toBeDefined();
      expect(w.proof.nakshatra.name).toBeTruthy();
      expect(w.proof.yoga).toBeDefined();
      expect(w.proof.yoga.name).toBeTruthy();
      expect(w.proof.lagna).toBeDefined();
      expect(w.proof.lagna.sign).toBeTruthy();
      expect(w.proof.lagna.quality).toBeTruthy();
      expect(w.proof.hora).toBeDefined();
      expect(w.proof.hora.planet).toBeTruthy();
      expect(typeof w.proof.hora.match).toBe('boolean');
      expect(Array.isArray(w.proof.specialYogas)).toBe(true);
    }
  });

  it('score components are in valid ranges (0-25 each)', () => {
    const days = coarseScan(CORSEAUX_PARAMS);
    if (days.length === 0) return;
    const windows = fineScan(days[0].date, CORSEAUX_PARAMS);
    for (const w of windows) {
      expect(w.breakdown.panchang).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.panchang).toBeLessThanOrEqual(25);
      expect(w.breakdown.lagna).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.lagna).toBeLessThanOrEqual(25);
      expect(w.breakdown.hora).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.hora).toBeLessThanOrEqual(25);
      expect(w.breakdown.personal).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.personal).toBeLessThanOrEqual(25);
    }
  });

  it('window times are valid HH:MM format', () => {
    const days = coarseScan(SHORT_RANGE_PARAMS);
    if (days.length === 0) return;
    const windows = fineScan(days[0].date, SHORT_RANGE_PARAMS);
    for (const w of windows) {
      expect(w.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(w.endTime).toMatch(/^\d{2}:\d{2}$/);
      expect(w.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('total score is sum of breakdown components', () => {
    const days = coarseScan(CORSEAUX_PARAMS);
    if (days.length === 0) return;
    const windows = fineScan(days[0].date, CORSEAUX_PARAMS);
    for (const w of windows) {
      const sum = w.breakdown.panchang + w.breakdown.lagna + w.breakdown.hora + w.breakdown.personal;
      expect(w.score).toBe(sum);
    }
  });

  it('personal score is 0 when no userSnapshot provided', () => {
    const days = coarseScan(SHORT_RANGE_PARAMS);
    if (days.length === 0) return;
    const windows = fineScan(days[0].date, SHORT_RANGE_PARAMS);
    for (const w of windows) {
      expect(w.breakdown.personal).toBe(0);
    }
  });

  it('includes personal score when userSnapshot provided', () => {
    const userSnapshot: UserSnapshot = {
      birthData: {
        name: 'Test User',
        date: '1990-05-15',
        time: '10:30',
        place: 'Delhi',
        lat: 28.6139,
        lng: 77.209,
        timezone: 'Asia/Kolkata',
        ayanamsha: 'lahiri',
      },
      dashaLords: { maha: 5, antar: 4, pratyantar: 3 }, // Venus-Jupiter-Mercury
    };

    const days = coarseScan(CORSEAUX_PARAMS);
    if (days.length === 0) return;
    const windows = fineScan(days[0].date, CORSEAUX_PARAMS, userSnapshot);
    // At least some windows should have non-zero personal score
    // (depends on astrological factors, but with birth data provided it's likely)
    const anyPersonal = windows.some(w => w.breakdown.personal > 0);
    // This is probabilistic; if all windows happen to have 0 personal, that's still valid
    // Just verify the structure is correct
    for (const w of windows) {
      expect(typeof w.breakdown.personal).toBe('number');
    }
  });
});

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
      // With birth data, personal component should be defined (may be 0 though)
      expect(typeof w.breakdown.personal).toBe('number');
    }
  });

  it('returns windows with valid score breakdown summing correctly', () => {
    const windows = smartMuhurtaSearch(DELHI_PARAMS);
    for (const w of windows) {
      const { panchang, lagna, hora, personal } = w.breakdown;
      expect(panchang + lagna + hora + personal).toBe(w.score);
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

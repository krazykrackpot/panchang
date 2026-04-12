/**
 * Muhurta Engine Tests
 * Tests for scoring, date scanning, and activity rules modules
 */

import { describe, it, expect } from 'vitest';
import {
  scorePanchangFactors,
  scoreTransitFactors,
  getPanchangSnapshot,
  type PanchangSnapshot,
} from '../ai-recommender';
import { scanDateRange } from '../time-window-scanner';
import {
  getExtendedActivity,
  getAllExtendedActivities,
  EXTENDED_ACTIVITIES,
} from '../activity-rules-extended';

// Delhi coordinates
const DELHI_LAT = 28.6139;
const DELHI_LNG = 77.209;

// JD 2460691.0 ~ Jan 15 2025 noon UTC
const TEST_JD = 2460691.0;

// ---------------------------------------------------------------------------
// Activity Rules
// ---------------------------------------------------------------------------
describe('activity-rules-extended', () => {
  it('getAllExtendedActivities returns 15+ activities', () => {
    const all = getAllExtendedActivities();
    expect(all.length).toBeGreaterThanOrEqual(15);
  });

  it('every activity has id and label with en/hi/sa', () => {
    const all = getAllExtendedActivities();
    for (const act of all) {
      expect(act.id).toBeTruthy();
      expect(act.label.en).toBeTruthy();
      expect(act.label.hi).toBeTruthy();
      expect(act.label.sa).toBeTruthy();
    }
  });

  it('every activity has required rule arrays', () => {
    const all = getAllExtendedActivities();
    for (const act of all) {
      expect(Array.isArray(act.goodTithis)).toBe(true);
      expect(Array.isArray(act.goodNakshatras)).toBe(true);
      expect(Array.isArray(act.goodWeekdays)).toBe(true);
      expect(Array.isArray(act.avoidTithis)).toBe(true);
      expect(Array.isArray(act.avoidNakshatras)).toBe(true);
      expect(Array.isArray(act.goodHoras)).toBe(true);
      expect(Array.isArray(act.relevantHouses)).toBe(true);
    }
  });

  it('getExtendedActivity("marriage") returns valid activity', () => {
    const marriage = getExtendedActivity('marriage');
    expect(marriage).toBeDefined();
    expect(marriage.id).toBe('marriage');
    expect(marriage.label.en).toBe('Marriage (Vivah)');
    expect(marriage.goodTithis.length).toBeGreaterThan(0);
    expect(marriage.goodNakshatras.length).toBeGreaterThan(0);
    expect(marriage.goodWeekdays.length).toBeGreaterThan(0);
    expect(marriage.goodHoras).toEqual([5, 4, 1]); // Venus, Jupiter, Moon
  });

  it('getExtendedActivity returns correct data for different types', () => {
    const travel = getExtendedActivity('travel');
    expect(travel.id).toBe('travel');
    expect(travel.label.en).toBe('Travel');
    expect(travel.relevantHouses).toEqual([3, 9, 12]);

    const surgery = getExtendedActivity('surgery');
    expect(surgery.id).toBe('surgery');
    expect(surgery.goodHoras).toEqual([2, 0, 4]); // Mars, Sun, Jupiter
  });

  it('EXTENDED_ACTIVITIES has exactly 20 entries', () => {
    expect(Object.keys(EXTENDED_ACTIVITIES).length).toBe(20);
  });

  it('no activity has overlapping good and avoid tithis', () => {
    const all = getAllExtendedActivities();
    for (const act of all) {
      const overlap = act.goodTithis.filter(t => act.avoidTithis.includes(t));
      expect(overlap).toEqual([]);
    }
  });

  it('no activity has overlapping good and avoid nakshatras', () => {
    const all = getAllExtendedActivities();
    for (const act of all) {
      const overlap = act.goodNakshatras.filter(n => act.avoidNakshatras.includes(n));
      expect(overlap).toEqual([]);
    }
  });
});

// ---------------------------------------------------------------------------
// Panchang Snapshot
// ---------------------------------------------------------------------------
describe('getPanchangSnapshot', () => {
  it('returns valid snapshot for known JD + Delhi coords', () => {
    const snap = getPanchangSnapshot(TEST_JD, DELHI_LAT, DELHI_LNG);

    expect(snap.tithi).toBeGreaterThanOrEqual(1);
    expect(snap.tithi).toBeLessThanOrEqual(30);

    expect(snap.nakshatra).toBeGreaterThanOrEqual(1);
    expect(snap.nakshatra).toBeLessThanOrEqual(27);

    expect(snap.yoga).toBeGreaterThanOrEqual(1);
    expect(snap.yoga).toBeLessThanOrEqual(27);

    expect(snap.karana).toBeGreaterThanOrEqual(1);
    expect(snap.karana).toBeLessThanOrEqual(11);

    expect(snap.weekday).toBeGreaterThanOrEqual(0);
    expect(snap.weekday).toBeLessThanOrEqual(6);

    expect(snap.moonSign).toBeGreaterThanOrEqual(1);
    expect(snap.moonSign).toBeLessThanOrEqual(12);
  });

  it('returns different snapshots for different JDs', () => {
    const snap1 = getPanchangSnapshot(TEST_JD, DELHI_LAT, DELHI_LNG);
    const snap2 = getPanchangSnapshot(TEST_JD + 5, DELHI_LAT, DELHI_LNG);

    // At least one field should differ over 5 days
    const differs =
      snap1.tithi !== snap2.tithi ||
      snap1.nakshatra !== snap2.nakshatra ||
      snap1.weekday !== snap2.weekday ||
      snap1.moonSign !== snap2.moonSign;
    expect(differs).toBe(true);
  });

  it('weekday is consistent with JD formula', () => {
    const snap = getPanchangSnapshot(TEST_JD, DELHI_LAT, DELHI_LNG);
    const expectedWeekday = Math.floor(TEST_JD + 1.5) % 7;
    expect(snap.weekday).toBe(expectedWeekday);
  });
});

// ---------------------------------------------------------------------------
// Score Panchang Factors
// ---------------------------------------------------------------------------
describe('scorePanchangFactors', () => {
  const marriageRules = getExtendedActivity('marriage');

  it('returns a score number and factors array', () => {
    const snap = getPanchangSnapshot(TEST_JD, DELHI_LAT, DELHI_LNG);
    const result = scorePanchangFactors(snap, marriageRules);

    expect(typeof result.score).toBe('number');
    expect(Array.isArray(result.factors)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(25);
  });

  it('gives positive score for matching tithi and nakshatra', () => {
    // Construct a snapshot that matches marriage good values
    const snap: PanchangSnapshot = {
      tithi: marriageRules.goodTithis[0],       // a good tithi
      nakshatra: marriageRules.goodNakshatras[0], // a good nakshatra
      yoga: 5,   // in 1-15 range (auspicious)
      karana: 3,  // chara karana (1-7)
      weekday: marriageRules.goodWeekdays[0],    // a good weekday
      moonSign: 1,
    };
    const result = scorePanchangFactors(snap, marriageRules);
    // 8 (tithi) + 8 (nakshatra) + 4 (yoga) + 2 (karana) + 3 (weekday) = 25
    expect(result.score).toBe(25);
    expect(result.factors.length).toBeGreaterThanOrEqual(3);
  });

  it('subtracts for avoid tithi and avoid nakshatra', () => {
    const snap: PanchangSnapshot = {
      tithi: marriageRules.avoidTithis[0],
      nakshatra: marriageRules.avoidNakshatras[0],
      yoga: 20,  // above 15 — not auspicious
      karana: 9,  // not chara
      weekday: 6, // Saturday — not in marriage goodWeekdays
      moonSign: 1,
    };
    const result = scorePanchangFactors(snap, marriageRules);
    // -5 (avoid tithi) + -5 (avoid nakshatra) = -10, clamped to 0
    expect(result.score).toBe(0);
    expect(result.factors.some(f => f.en.includes('Inauspicious'))).toBe(true);
  });

  it('score is clamped between 0 and 25', () => {
    // Even the best case should not exceed 25
    const snap: PanchangSnapshot = {
      tithi: marriageRules.goodTithis[0],
      nakshatra: marriageRules.goodNakshatras[0],
      yoga: 1,
      karana: 1,
      weekday: marriageRules.goodWeekdays[0],
      moonSign: 1,
    };
    const result = scorePanchangFactors(snap, marriageRules);
    expect(result.score).toBeLessThanOrEqual(25);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// Score Transit Factors
// ---------------------------------------------------------------------------
describe('scoreTransitFactors', () => {
  const marriageRules = getExtendedActivity('marriage');

  it('returns a score number and factors array', () => {
    const result = scoreTransitFactors(TEST_JD, marriageRules);

    expect(typeof result.score).toBe('number');
    expect(Array.isArray(result.factors)).toBe(true);
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(25);
  });

  it('returns consistent results for the same JD', () => {
    const r1 = scoreTransitFactors(TEST_JD, marriageRules);
    const r2 = scoreTransitFactors(TEST_JD, marriageRules);
    expect(r1.score).toBe(r2.score);
    expect(r1.factors.length).toBe(r2.factors.length);
  });

  it('factors contain trilingual objects', () => {
    const result = scoreTransitFactors(TEST_JD, marriageRules);
    for (const f of result.factors) {
      expect(typeof f.en).toBe('string');
      expect(typeof f.hi).toBe('string');
      expect(typeof f.sa).toBe('string');
    }
  });

  it('works with different activity rules', () => {
    const surgeryRules = getExtendedActivity('surgery');
    const result = scoreTransitFactors(TEST_JD, surgeryRules);
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(result.score).toBeLessThanOrEqual(25);
  });
});

// ---------------------------------------------------------------------------
// Scan Date Range
// ---------------------------------------------------------------------------
describe('scanDateRange', () => {
  it('returns scored windows for a 2-day range', () => {
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      activity: 'marriage',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    expect(Array.isArray(windows)).toBe(true);
    // May return 0 windows if scores are all < 40, but should still be an array
  }, 30000);

  it('windows have required fields when results exist', () => {
    // Use a wider range to increase chance of finding qualifying windows
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      activity: 'spiritual_practice',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    for (const w of windows) {
      expect(w.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(w.startTime).toMatch(/^\d{2}:\d{2}$/);
      expect(w.endTime).toMatch(/^\d{2}:\d{2}$/);
      expect(typeof w.totalScore).toBe('number');
      expect(w.totalScore).toBeGreaterThanOrEqual(40); // threshold in scanner
      expect(w.breakdown).toBeDefined();
      expect(typeof w.breakdown.panchangScore).toBe('number');
      expect(typeof w.breakdown.transitScore).toBe('number');
      expect(typeof w.breakdown.timingScore).toBe('number');
      expect(typeof w.breakdown.personalScore).toBe('number');
      expect(Array.isArray(w.keyFactors)).toBe(true);
    }
  }, 30000);

  it('windows are sorted by score descending', () => {
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      activity: 'business',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    for (let i = 1; i < windows.length; i++) {
      expect(windows[i - 1].totalScore).toBeGreaterThanOrEqual(windows[i].totalScore);
    }
  }, 30000);

  it('returns at most 20 windows', () => {
    // Scan a larger range (7 days = 21 possible windows)
    const windows = scanDateRange({
      startDate: '2025-01-10',
      endDate: '2025-01-20',
      activity: 'travel',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    expect(windows.length).toBeLessThanOrEqual(20);
  }, 30000);

  it('returns empty array for invalid activity', () => {
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      activity: 'nonexistent_activity' as any,
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    expect(windows).toEqual([]);
  }, 30000);

  it('includes taraBala and chandraBala when birth data provided', () => {
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      activity: 'marriage',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
      birthNakshatra: 10,
      birthRashi: 4,
    });

    for (const w of windows) {
      expect(w.taraBala).toBeDefined();
      expect(w.taraBala!.tara).toBeGreaterThanOrEqual(1);
      expect(w.taraBala!.tara).toBeLessThanOrEqual(9);
      expect(typeof w.taraBala!.name).toBe('string');
      expect(typeof w.taraBala!.auspicious).toBe('boolean');
      expect(typeof w.chandraBala).toBe('boolean');
    }
  }, 30000);

  it('panchangaShuddhi is between 0 and 5', () => {
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-17',
      activity: 'griha_pravesh',
      lat: DELHI_LAT,
      lng: DELHI_LNG,
      tz: 5.5,
    });

    for (const w of windows) {
      expect(w.panchangaShuddhi).toBeGreaterThanOrEqual(0);
      expect(w.panchangaShuddhi).toBeLessThanOrEqual(5);
    }
  }, 30000);
});

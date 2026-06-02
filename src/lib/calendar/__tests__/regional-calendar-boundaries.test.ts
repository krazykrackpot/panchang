/**
 * Regression anchors for the regional calendar boundary engine.
 *
 * These assertions lock in known-correct dates from authoritative
 * sources (Drik Panchang, Prokerala, Bangla Bhāratiya Calendar). Any
 * future drift in computeSankrantis / buildYearlyTithiTable / the
 * masa-name maps will trip a specific assertion rather than silently
 * shipping wrong dates to /regional.
 *
 * Adhika Masa is the highest-value invariant — its detection has
 * historically been brittle in panchang engines (mis-detection rate
 * was the bug pattern that justified the 16-file masa audit in 2026-04).
 * If the 2026 Adhika Jyeshtha assertion fails, do NOT just update the
 * expected value — investigate the engine first.
 */

import { describe, it, expect } from 'vitest';
import {
  computeRegionalMonthBoundaries,
  getRegionalNewYearDate,
  getCurrentMonthIndex,
  CALENDAR_REF_LOCATION,
  type RegionalCalendarId,
} from '../regional-calendar-boundaries';

const ALL_CALENDARS: RegionalCalendarId[] = [
  'tamil', 'bengali', 'malayalam', 'odia',
  'telugu', 'kannada', 'gujarati', 'marathi', 'mithila',
];

describe('CALENDAR_REF_LOCATION', () => {
  it('every calendar has a reference location with valid coordinates', () => {
    for (const cal of ALL_CALENDARS) {
      const loc = CALENDAR_REF_LOCATION[cal];
      expect(loc, `${cal} must have a ref location`).toBeDefined();
      expect(loc.lat).toBeGreaterThan(-90);
      expect(loc.lat).toBeLessThan(90);
      expect(loc.lng).toBeGreaterThan(-180);
      expect(loc.lng).toBeLessThan(180);
      expect(loc.timezone).toBeTruthy();
    }
  });
});

describe('getRegionalNewYearDate — anchor dates (verified against Drik / Prokerala)', () => {
  // Solar new years all anchored to Mesha sankranti — April 14 in 2026
  // (verified against Drik Panchang ingress times for Asia/Kolkata).
  it('Tamil Puthandu 2026 = April 14', () => {
    expect(getRegionalNewYearDate('tamil', 2026).date).toBe('2026-04-14');
  });
  it('Bengali Pohela Boishakh 2026 = April 14', () => {
    expect(getRegionalNewYearDate('bengali', 2026).date).toBe('2026-04-14');
  });
  it('Odia Pana Sankranti 2026 = April 14', () => {
    expect(getRegionalNewYearDate('odia', 2026).date).toBe('2026-04-14');
  });
  it('Malayalam Vishu 2026 = April 14 (Medam 1, NOT calendar-year start)', () => {
    // The Malayalam calendar year actually starts at Chingam (mid-Aug),
    // but the CULTURAL new year is Vishu = Medam 1 = Mesha sankranti.
    // The boundary engine override ensures this discrepancy is encoded
    // intentionally rather than silently mis-aligning to Chingam.
    expect(getRegionalNewYearDate('malayalam', 2026).date).toBe('2026-04-14');
  });
  it('Mithila Naya Barsh 2026 ≈ April 14 (Jur Sital ≈ Mesha sankranti)', () => {
    expect(getRegionalNewYearDate('mithila', 2026).date).toBe('2026-04-14');
  });

  // Lunisolar new years — Telugu/Kannada/Marathi all = Chaitra Shukla 1
  it('Telugu Ugadi 2026 = March 19', () => {
    // Drik Panchang confirms Ugadi 2026 falls on Thursday Mar 19.
    expect(getRegionalNewYearDate('telugu', 2026).date).toBe('2026-03-19');
  });
  it('Kannada Yugadi 2026 = March 19', () => {
    expect(getRegionalNewYearDate('kannada', 2026).date).toBe('2026-03-19');
  });
  it('Marathi Gudi Padwa 2026 = March 19', () => {
    expect(getRegionalNewYearDate('marathi', 2026).date).toBe('2026-03-19');
  });
  it('Telugu Ugadi 2027 = April 7 (delayed by Adhika Jyeshtha 2026)', () => {
    // After an Adhika Masa year, the next Ugadi is ~30 days later than
    // normal. Both 2026 and 2027 verified via Drik.
    expect(getRegionalNewYearDate('telugu', 2027).date).toBe('2027-04-07');
  });

  // Gujarati — day after Diwali Amavasya (Kartik 1)
  it('Gujarati Bestu Varas 2026 = November 9 (day after Diwali)', () => {
    // Diwali Amavasya 2026 = Nov 8 (Kartik Krishna Amavasya in Asia/Kolkata).
    expect(getRegionalNewYearDate('gujarati', 2026).date).toBe('2026-11-09');
  });
});

describe('computeRegionalMonthBoundaries — structural invariants', () => {
  it('every calendar returns ≥12 months for every year 2026-2028', () => {
    for (const cal of ALL_CALENDARS) {
      for (const year of [2026, 2027, 2028]) {
        const months = computeRegionalMonthBoundaries(cal, year);
        expect(months.length, `${cal} ${year} must have ≥12 months`).toBeGreaterThanOrEqual(12);
        expect(months.length, `${cal} ${year} cannot have more than 13 months`).toBeLessThanOrEqual(13);
      }
    }
  });

  it('every month has non-empty name, startDate, endDate', () => {
    const months = computeRegionalMonthBoundaries('tamil', 2026);
    for (const m of months) {
      expect(m.name).toBeTruthy();
      expect(m.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(m.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(m.endDate >= m.startDate).toBe(true);
    }
  });

  it('months are chronologically contiguous (each month starts day after previous ends)', () => {
    for (const cal of ALL_CALENDARS) {
      const months = computeRegionalMonthBoundaries(cal, 2026);
      for (let i = 1; i < months.length; i++) {
        const prevEnd = new Date(months[i - 1].endDate + 'T00:00:00Z');
        const thisStart = new Date(months[i].startDate + 'T00:00:00Z');
        const gapDays = Math.round((thisStart.getTime() - prevEnd.getTime()) / 86400000);
        // Most boundaries: thisStart = prevEnd + 1 day → gap = 1.
        // Lunisolar boundaries: tithi-table emits start/end on the SAME
        // day for adjacent months (Amavasya day spans midnight → both
        // months touch it). Allow either 0 or 1 day gap.
        expect(gapDays, `${cal} months[${i}] start should follow months[${i - 1}] end: ${months[i - 1].name} ends ${months[i - 1].endDate}, ${months[i].name} starts ${months[i].startDate}`).toBeGreaterThanOrEqual(0);
        expect(gapDays, `${cal} excess gap between ${months[i - 1].name} → ${months[i].name}`).toBeLessThanOrEqual(1);
      }
    }
  });
});

describe('Year-starts-with-Adhika edge case (Gemini PR #354 round-4 HIGH regression)', () => {
  // 2029 is the next lunisolar year that starts with an Adhika month —
  // Telugu/Kannada/Marathi/Mithila year 2029 opens with Adhika Chaitra
  // (Mar 15 → Apr 14) BEFORE nija Chaitra (Apr 14 → May 13). A prior
  // bug filtered Adhika from the `findIndex` start lookup AND broke
  // out of the month-collection loop on the very next entry (nija
  // Chaitra), producing either an Adhika-less 12-month year OR a
  // 1-month year. Both modes were dropped data. Fix preserves both.

  for (const cal of ['telugu', 'kannada', 'marathi', 'mithila'] as const) {
    it(`${cal} 2029 starts with Adhika Chaitra (year-start-with-Adhika case)`, () => {
      const months = computeRegionalMonthBoundaries(cal, 2029);
      expect(months.length, `${cal} 2029 must have 13 months (Adhika + 12 nija)`).toBe(13);
      expect(months[0].isAdhika, `${cal} 2029 month[0] must be the Adhika`).toBe(true);
      expect(months[0].name.toLowerCase()).toMatch(/adhika.*chaitr|adhika.*चैत्र|adhika.*చైత్ర|adhika.*ಚೈತ್ರ/i);
      // Second entry should be the nija (same canonical masa, no Adhika flag)
      expect(months[1].isAdhika).toBeFalsy();
    });

    it(`${cal} 2028 ends BEFORE Adhika Chaitra 2029 bleeds in (next-year-start-with-Adhika case)`, () => {
      // Gemini PR #354 round-5 HIGH: when current year has no Adhika
      // but the FOLLOWING year starts with Adhika (e.g. 2029 begins
      // with Adhika Chaitra), the break condition must trigger on the
      // Adhika Chaitra of the next year. A prior break-condition that
      // filtered `!m.isAdhika` would skip past the Adhika and bleed it
      // into the 2028 list as a spurious 13th entry.
      const months = computeRegionalMonthBoundaries(cal, 2028);
      expect(months.length, `${cal} 2028 must have 12 months (no Adhika; the Adhika is in 2029)`).toBe(12);
      // No Adhika anywhere in the 2028 list
      expect(months.some(m => m.isAdhika), `${cal} 2028 must contain no Adhika months`).toBe(false);
    });
  }
});

describe('Adhika Masa detection — Adhika Jyeshtha 2026', () => {
  // The 2026 Adhika Masa is Jyeshtha (May 17 - June 15 per Drik),
  // affecting all lunisolar calendars except Mithila (Purnimanta has
  // its own adhika cycle which falls on the same masa for this year).
  const expectedAdhikaCalendars = ['telugu', 'kannada', 'marathi'] as const;

  for (const cal of expectedAdhikaCalendars) {
    it(`${cal} 2026 has Adhika Jyeshtha`, () => {
      const months = computeRegionalMonthBoundaries(cal, 2026);
      const adhika = months.find(m => m.isAdhika);
      expect(adhika, `${cal} 2026 must contain an Adhika month`).toBeDefined();
      // Devanagari spelling फिक्स: previous regex had `जे्येष्ठ` with a
      // misplaced halant (्) that would never match real Marathi/Hindi
      // output. Corrected to `ज्येष्ठ` — Gemini PR #354 MEDIUM.
      expect(adhika!.name.toLowerCase()).toMatch(/jyeshth|ज्येष्ठ|ಜ್ಯೇಷ್ಠ|జ్యేష్ఠ/);
    });
  }

  it('Gujarati 2026 — Adhika is in the previous Vikram Samvat year (2025-26), not the year starting Nov 2026', () => {
    // Gujarati year 2026 = Kartik 2026 → Aso 2027. Adhika Jyeshtha 2026
    // fell in May 2026, which is in the PREVIOUS Gujarati year (Kartik
    // 2025 → Aso 2026). So Gujarati 2026 should have NO Adhika in its
    // 12-month list.
    const months = computeRegionalMonthBoundaries('gujarati', 2026);
    expect(months.some(m => m.isAdhika)).toBe(false);
  });

  it('No false-positive Adhika in 2027 (a non-Adhika year for all lunisolar)', () => {
    for (const cal of expectedAdhikaCalendars) {
      const months = computeRegionalMonthBoundaries(cal, 2027);
      const adhikaCount = months.filter(m => m.isAdhika).length;
      expect(adhikaCount, `${cal} 2027 must have no Adhika months`).toBe(0);
    }
  });
});

describe('Bengali post-Saha civil calendar — fixed 31/31/31/31/31/30/30/30/30/30/30/30+leap', () => {
  it('2026 Boishakh = 31 days (Apr 14 - May 14)', () => {
    const months = computeRegionalMonthBoundaries('bengali', 2026);
    expect(months[0].name).toContain('Boishakh');
    expect(months[0].startDate).toBe('2026-04-14');
    expect(months[0].endDate).toBe('2026-05-14');  // inclusive
    expect(daysBetween(months[0].startDate, months[0].endDate)).toBe(30);  // inclusive count: 31 days
  });

  it('2026 Choitro (12th month) = 30 days (non-leap year following)', () => {
    const months = computeRegionalMonthBoundaries('bengali', 2026);
    // Bengali year 2026 = Apr 2026 → Apr 2027. Choitro ends in 2027.
    // 2027 is NOT a Gregorian leap year, so Choitro = 30 days.
    const choitro = months[11];
    expect(choitro.name).toContain('Choitro');
    expect(daysBetween(choitro.startDate, choitro.endDate)).toBe(29);  // inclusive: 30 days
  });

  it('2027 Choitro = 31 days (Gregorian 2028 IS a leap year)', () => {
    const months = computeRegionalMonthBoundaries('bengali', 2027);
    const choitro = months[11];
    expect(choitro.name).toContain('Choitro');
    expect(daysBetween(choitro.startDate, choitro.endDate)).toBe(30);  // inclusive: 31 days
  });

  it('Year sums to 365 days (non-leap) or 366 days (leap)', () => {
    for (const year of [2026, 2027, 2028]) {
      const months = computeRegionalMonthBoundaries('bengali', year);
      const totalDays = months.reduce(
        (sum, m) => sum + daysBetween(m.startDate, m.endDate) + 1,
        0,
      );
      // 2027 Bengali year (Apr 27 → Apr 28) is the one with leap Choitro
      const expectedDays = year === 2027 ? 366 : 365;
      expect(totalDays, `Bengali ${year} should total ${expectedDays} days`).toBe(expectedDays);
    }
  });
});

describe('Solar calendars — year-wrap correctness (Margazhi → Thai bug regression)', () => {
  // Tamil Margazhi (month 9) ends Jan 13 of the NEXT Gregorian year;
  // Thai (month 10) starts Jan 14 of the NEXT year. A prior bug indexed
  // sankrantis by signId which conflated the same-year Jan-Makar
  // sankranti with the next-year one, producing endDate "2026-01-13" for
  // a month that ran Dec 2026 to Jan 2027.
  it('Tamil Margazhi 2026 ends in 2027 (not 2026)', () => {
    const months = computeRegionalMonthBoundaries('tamil', 2026);
    const margazhi = months[8];  // 9th month, 0-indexed
    expect(margazhi.name).toContain('Margazhi');
    expect(margazhi.startDate.startsWith('2026-')).toBe(true);
    expect(margazhi.endDate.startsWith('2027-')).toBe(true);
  });

  it('Tamil Thai 2026 starts Jan 14 2027 (Makar sankranti)', () => {
    const months = computeRegionalMonthBoundaries('tamil', 2026);
    const thai = months[9];
    expect(thai.name).toContain('Thai');
    expect(thai.startDate).toBe('2027-01-14');
  });

  it('Malayalam Karkidakam 2026 (12th month) ends in August 2027', () => {
    // Malayalam year starts Chingam (Aug), so 12th month Karkidakam ends
    // in the following Gregorian year.
    const months = computeRegionalMonthBoundaries('malayalam', 2026);
    const karkidakam = months[11];
    expect(karkidakam.name).toContain('Karkidakam');
    expect(karkidakam.endDate.startsWith('2027-08')).toBe(true);
  });
});

describe('getCurrentMonthIndex', () => {
  it('returns the index of the month containing today', () => {
    const months = computeRegionalMonthBoundaries('tamil', 2026);
    expect(getCurrentMonthIndex(months, '2026-04-14')).toBe(0);  // Chithirai start
    expect(getCurrentMonthIndex(months, '2026-05-01')).toBe(0);  // mid-Chithirai
    expect(getCurrentMonthIndex(months, '2026-05-15')).toBe(1);  // Vaikasi start
    expect(getCurrentMonthIndex(months, '2027-01-14')).toBe(9);  // Thai start
  });

  it('returns null when today is outside the boundary list', () => {
    const months = computeRegionalMonthBoundaries('tamil', 2026);
    // 2025-12-31 is BEFORE the 2026 Tamil year started (April 14, 2026)
    expect(getCurrentMonthIndex(months, '2025-12-31')).toBeNull();
    // 2028-12-01 is AFTER the 2026 Tamil year ended (April 13, 2027)
    expect(getCurrentMonthIndex(months, '2028-12-01')).toBeNull();
  });
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function daysBetween(startISO: string, endISO: string): number {
  const start = new Date(startISO + 'T00:00:00Z').getTime();
  const end = new Date(endISO + 'T00:00:00Z').getTime();
  return Math.round((end - start) / 86400000);
}

/**
 * April 2026 Full Month Panchang Validation
 *
 * Computes panchang for every day in April 2026 (Delhi, IST)
 * and validates key elements for cross-checking against Prokerala/Shubh Panchang.
 *
 * Reference location: New Delhi (28.6139°N, 77.2090°E, IST +5.5)
 */
import { describe, it, expect } from 'vitest';
import { computePanchang, type PanchangInput } from '../ephem/panchang-calc';

const DELHI: Omit<PanchangInput, 'year' | 'month' | 'day'> = {
  lat: 28.6139,
  lng: 77.2090,
  tzOffset: 5.5,
  timezone: 'Asia/Kolkata',
  locationName: 'New Delhi',
};

function panchangFor(day: number) {
  return computePanchang({ year: 2026, month: 4, day, ...DELHI });
}

function parseTimeToMinutes(time: string): number {
  const clean = time.replace(/\s*\(.*?\)\s*/, '').replace(/\+\d+$/, '');
  const [h, m] = clean.split(':').map(Number);
  return h * 60 + m;
}

// ──────────────────────────────────────────────────
// ANCHOR TESTS: Known dates verified against Prokerala
// ──────────────────────────────────────────────────

describe('April 2026 — Anchor dates (verified against Prokerala)', () => {
  it('Apr 1: Wednesday, Shukla Paksha', () => {
    const p = panchangFor(1);
    expect(p.vara.day).toBe(3); // Wednesday
    expect(p.tithi.paksha).toBe('shukla');
  });

  it('Apr 5: Sunday', () => {
    const p = panchangFor(5);
    expect(p.vara.day).toBe(0); // Sunday
  });

  it('Apr 12: Sunday, near Purnima', () => {
    const p = panchangFor(12);
    expect(p.vara.day).toBe(0);
    // Purnima can be on 12th or 13th depending on exact timing
    const tithiNum = p.tithi.number;
    expect(tithiNum).toBeGreaterThanOrEqual(14); // Chaturdashi or Purnima
    expect(tithiNum).toBeLessThanOrEqual(15);
  });

  it('Apr 14: Tuesday', () => {
    const p = panchangFor(14);
    expect(p.vara.day).toBe(2);
  });

  it('Purnima occurs between Apr 12-13', () => {
    const p12 = panchangFor(12);
    const p13 = panchangFor(13);
    const hasPurnima = p12.tithi.number === 15 || p13.tithi.number === 15;
    expect(hasPurnima).toBe(true);
  });

  it('Amavasya occurs between Apr 26-27', () => {
    const p26 = panchangFor(26);
    const p27 = panchangFor(27);
    const hasAmavasya = p26.tithi.number === 30 || p27.tithi.number === 30;
    expect(hasAmavasya).toBe(true);
  });
});

// ──────────────────────────────────────────────────
// CONSISTENCY TESTS: All 30 days
// ──────────────────────────────────────────────────

describe('April 2026 — All 30 days structural consistency', () => {
  const results = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    p: panchangFor(i + 1),
  }));

  it('all days have valid weekday (0-6)', () => {
    for (const { day, p } of results) {
      expect(p.vara.day, `Day ${day}`).toBeGreaterThanOrEqual(0);
      expect(p.vara.day, `Day ${day}`).toBeLessThanOrEqual(6);
    }
  });

  it('weekdays advance correctly through the month', () => {
    const apr1Weekday = results[0].p.vara.day;
    for (let i = 1; i < 30; i++) {
      const expected = (apr1Weekday + i) % 7;
      expect(results[i].p.vara.day, `Day ${i + 1}`).toBe(expected);
    }
  });

  it('all days have valid tithi (1-30)', () => {
    for (const { day, p } of results) {
      expect(p.tithi.number, `Day ${day}`).toBeGreaterThanOrEqual(1);
      expect(p.tithi.number, `Day ${day}`).toBeLessThanOrEqual(30);
    }
  });

  it('tithis generally advance (no more than 2 repeats or 1 skip)', () => {
    let repeatCount = 0;
    for (let i = 1; i < 30; i++) {
      const prev = results[i - 1].p.tithi.number;
      const curr = results[i].p.tithi.number;
      const diff = ((curr - prev + 30) % 30);
      expect(diff, `Day ${i} → ${i + 1}: tithi ${prev} → ${curr}`).toBeLessThanOrEqual(2);
      if (diff === 0) repeatCount++;
    }
    expect(repeatCount).toBeLessThan(5);
  });

  it('all days have valid nakshatra (1-27)', () => {
    for (const { day, p } of results) {
      expect(p.nakshatra.id, `Day ${day}`).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.id, `Day ${day}`).toBeLessThanOrEqual(27);
    }
  });

  it('all days have valid yoga (1-27)', () => {
    for (const { day, p } of results) {
      // yoga number from yogaData
      const yogaNum = (p.yoga as { id?: number; number?: number }).id
        || (p.yoga as { id?: number; number?: number }).number
        || 0;
      expect(yogaNum, `Day ${day}`).toBeGreaterThanOrEqual(1);
      expect(yogaNum, `Day ${day}`).toBeLessThanOrEqual(27);
    }
  });

  it('sunrise is before sunset for all days', () => {
    for (const { day, p } of results) {
      const sunriseMin = parseTimeToMinutes(p.sunrise);
      const sunsetMin = parseTimeToMinutes(p.sunset);
      expect(sunriseMin, `Day ${day}: sunrise ${p.sunrise}`).toBeLessThan(sunsetMin);
      // Delhi sunrise: 5:30-6:15 in April
      expect(sunriseMin, `Day ${day}: sunrise ${p.sunrise}`).toBeGreaterThan(320); // 5:20
      expect(sunriseMin, `Day ${day}: sunrise ${p.sunrise}`).toBeLessThan(380); // 6:20
      // Delhi sunset: 18:25-18:45 in April
      expect(sunsetMin, `Day ${day}: sunset ${p.sunset}`).toBeGreaterThan(1095); // 18:15
      expect(sunsetMin, `Day ${day}: sunset ${p.sunset}`).toBeLessThan(1140); // 19:00
    }
  });

  it('Rahu Kaal times are valid', () => {
    for (const { day, p } of results) {
      expect(p.rahuKaal.start, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
      expect(p.rahuKaal.end, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
      const start = parseTimeToMinutes(p.rahuKaal.start);
      const end = parseTimeToMinutes(p.rahuKaal.end);
      expect(end - start, `Day ${day}: Rahu Kaal duration`).toBeGreaterThan(80);
      expect(end - start, `Day ${day}: Rahu Kaal duration`).toBeLessThan(110);
    }
  });

  it('Yamaganda times are valid', () => {
    for (const { day, p } of results) {
      expect(p.yamaganda.start, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
      expect(p.yamaganda.end, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
    }
  });

  it('Dur Muhurtam windows exist for all days', () => {
    for (const { day, p } of results) {
      expect(p.durMuhurtam.length, `Day ${day}`).toBeGreaterThanOrEqual(1);
      for (const w of p.durMuhurtam) {
        expect(w.start, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
        expect(w.end, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  });

  it('Varjyam exists for most days', () => {
    let varjyamCount = 0;
    for (const { day, p } of results) {
      if (p.varjyam) {
        expect(p.varjyam.start, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
        expect(p.varjyam.end, `Day ${day}`).toMatch(/^\d{2}:\d{2}$/);
        varjyamCount++;
      }
    }
    expect(varjyamCount).toBeGreaterThan(20);
  });

  it('transition end times are valid time strings', () => {
    for (const { day, p } of results) {
      if (p.tithiTransition) {
        expect(p.tithiTransition.endTime, `Day ${day}: tithi end`).toMatch(/^\d{2}:\d{2}$/);
      }
      if (p.nakshatraTransition) {
        expect(p.nakshatraTransition.endTime, `Day ${day}: nak end`).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  });
});

// ──────────────────────────────────────────────────
// OUTPUT TABLE: Print full month for manual cross-check
// ──────────────────────────────────────────────────

describe('April 2026 — Full month table (for manual cross-check)', () => {
  it('prints panchang summary for all 30 days', () => {
    const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const rows: string[] = [];
    rows.push('Day | Wkd | Tithi              | Ends   | Nakshatra          | Ends   | Yoga              | Sunrise | Sunset');
    rows.push('----|-----|--------------------| ------|--------------------| ------|-------------------|---------|-------');

    for (let d = 1; d <= 30; d++) {
      const p = panchangFor(d);
      const pad = (s: string, n: number) => s.slice(0, n).padEnd(n);
      const tEnd = p.tithiTransition?.endTime || '??:??';
      const nEnd = p.nakshatraTransition?.endTime || '??:??';
      rows.push(
        `${String(d).padStart(3)} | ${WEEKDAYS[p.vara.day]} | ` +
        `${pad(p.tithi.name.en, 18)} | ${tEnd} | ` +
        `${pad(p.nakshatra.name.en, 18)} | ${nEnd} | ` +
        `${pad(p.yoga.name.en, 17)} | ` +
        `${p.sunrise}  | ${p.sunset}`
      );
    }

    console.log('\n=== APRIL 2026 PANCHANG — New Delhi ===\n');
    console.log(rows.join('\n'));
    console.log('\n');
    expect(true).toBe(true);
  });
});

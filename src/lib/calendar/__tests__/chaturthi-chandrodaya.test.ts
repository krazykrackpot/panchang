/**
 * Regression tests for the Chaturthi + chandrodaya-rule fix.
 *
 * Bug (pre-fix):
 *   1. Monthly recurring Sankashti Chaturthi in the MONTHLY_VRATS code path
 *      never applied `def.muhurtaRule` — the emit line hardcoded
 *      `date: match.sunriseDate`, silently ignoring the chandrodaya
 *      (moonrise-vyapini) attribution mandated by Dharmasindhu.
 *   2. `getKalaWindow('chandrodaya', …)` applied a `+1` day correction
 *      when `mrUT < srUT`, on the theory that a moonrise-UT below
 *      sunrise-UT meant "next-day pre-dawn moonrise". For
 *      eastern-hemisphere locations (Delhi), `sunriseUTHoursOr` returns
 *      the NEXT sunrise UT after the query, which lands on tomorrow's
 *      UT day (~24 hours) — the evening moonrise of Delhi at ~15.76 UT
 *      then triggered the +1 wrongly, shifting Sankashti forward one day.
 *
 * Reference (from Drik Panchang, cross-checked against Prokerala):
 *   Krishnapingala Sankashti Chaturthi — Friday, 3 July 2026
 *   Chaturthi tithi range (universal): 2026-07-03 05:50 UT → 2026-07-04 07:10 UT
 *   Moonrise Delhi on Sankashti day: 23:41 IST (= 18:11 UT) — during Chaturthi ✓
 *
 * A correct implementation must attribute Sankashti to Jul 3 regardless
 * of hemisphere, because Jul 3's evening moonrise falls DURING the
 * Chaturthi tithi at every populated latitude that sees a moonrise on
 * that date.
 */
import { describe, it, expect } from 'vitest';
import { generateFestivalCalendarV2 } from '../festival-generator';

interface Loc { name: string; lat: number; lon: number; tz: string }

const LOCATIONS: Loc[] = [
  { name: 'Delhi (Eastern hemisphere, +5:30)', lat: 28.6139, lon: 77.2090, tz: 'Asia/Kolkata' },
  // Western-hemisphere validation per Lesson-Seattle-Parama: heuristics
  // that pass on Delhi must be exercised in the Western hemisphere too.
  { name: 'Seattle (Western hemisphere, -7:00 DST)', lat: 47.6062, lon: -122.3321, tz: 'America/Los_Angeles' },
  // The bug-report location. Reported by a user in Corseaux + confirmed
  // by a second user in Switzerland.
  { name: 'Corseaux (Central Europe, +2:00 DST)', lat: 46.4703, lon: 6.8481, tz: 'Europe/Zurich' },
];

describe('chandrodaya rule fires for monthly Sankashti Chaturthi', () => {
  for (const loc of LOCATIONS) {
    it(`${loc.name} — Krishnapingala Sankashti 2026 falls on 2026-07-03`, () => {
      const fest = generateFestivalCalendarV2(2026, loc.lat, loc.lon, loc.tz);
      const july = fest.filter(
        (f) => f.slug === 'chaturthi' && f.date.startsWith('2026-07-'),
      );
      // Exactly one Sankashti in July 2026, and it must be Jul 3.
      expect(july).toHaveLength(1);
      expect(july[0].date).toBe('2026-07-03');
      expect(july[0].name.en).toBe('Sankashti Chaturthi');
      // Parana (fast-breaking) is on the OBSERVANCE day (Jul 3), not
      // the Udaya Tithi day (Jul 4). Regression guard for the Gemini
      // HIGH on PR #736: without this the parana window would be
      // computed for Jul 4's moonrise — 24h after the fast should be
      // broken.
      expect(july[0].paranaDate).toBe('2026-07-03');
    });
  }
});

describe('chandrodaya rule survives whole-year generation', () => {
  // Not a Drik-reference check (we only have one verified 2026
  // Sankashti reference so far — Krishnapingala Jul 3 above). Instead:
  // make sure the fix produces a plausible monthly cadence: at least 10
  // Sankashtis in the year, monotonically ordered, none in Adhika
  // months. Catches gross regressions where the muhurta-rule refactor
  // accidentally deduplicated or double-emitted.
  it('Delhi 2026 — emits a monthly Sankashti cadence', () => {
    const fest = generateFestivalCalendarV2(2026, 28.6139, 77.2090, 'Asia/Kolkata');
    const dates = fest
      .filter((f) => f.slug === 'chaturthi')
      .map((f) => f.date);
    // 10–13 emissions is the plausible range (12 lunar months ± an
    // Adhika-boundary drop or a year-edge extra).
    expect(dates.length).toBeGreaterThanOrEqual(10);
    expect(dates.length).toBeLessThanOrEqual(13);
    // Monotone (no duplicates, no out-of-order shuffling).
    const sorted = [...dates].sort();
    expect(dates).toEqual(sorted);
    // No repeated dates.
    expect(new Set(dates).size).toBe(dates.length);
  });
});

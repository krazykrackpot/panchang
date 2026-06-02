/**
 * Regression test for the `computePurnimantMonths` year-boundary bug.
 *
 * Bug discovered 2026-06-02 during the linking-topology PR's regional
 * calendar work. `computePurnimantMonths(2027)` was emitting an
 * off-by-one month name for entries 1–7 because its state machine
 * walked forward from Dec 1 2026 without knowing about 2026's Adhika
 * Jyeshtha (May 2026). After Adhika, the post-Adhika "sequential shift"
 * naming should carry forward; the missing lookback caused 2027 to
 * fall through to the pre-Adhika sankranti-naming branch and emit:
 *
 *   1 Magha       2026-12-24 → 2027-01-22   ← Drik says Pausha
 *   2 Phalguna    2027-01-22 → 2027-02-20   ← Drik says Magha
 *   3 Chaitra     2027-02-20 → 2027-03-22   ← Drik says Phalguna
 *   4 Vaishakha   2027-03-22 → 2027-04-20   ← Drik says Chaitra
 *   5 Jyeshtha    2027-04-20 → 2027-05-20   ← Drik says Vaishakha
 *   6 Ashadha     2027-05-20 → 2027-06-19   ← Drik says Jyeshtha
 *   7 Shravana    2027-06-19 → 2027-07-18   ← Drik says Ashadha (Jul 5 verified)
 *
 * Fix: extend `findFullMoons` / `findNewMoons` lookback to 3 years before
 * the target year so the state machine clears any in-flight post-Adhika
 * shift before reaching `year`. See PURNIMANT_LOOKBACK_YEARS in
 * src/lib/calendar/hindu-months.ts.
 *
 * Cross-source verification: anchors below confirmed via
 * drikpanchang.com/panchang/day-panchang.html for each date individually.
 * Do not change the expected values without re-verifying against Drik.
 */

import { describe, it, expect } from 'vitest';
import { computePurnimantMonths, computeHinduMonths } from '../hindu-months';

interface Anchor {
  date: string;
  expectedPurnimant: string;
  expectedAmanta: string;
  expectedAdhika?: boolean;
  source: string;
}

const DRIK_ANCHORS: Anchor[] = [
  // Verified 2026-06-02 via WebFetch on drikpanchang.com/panchang/day-panchang.html
  { date: '2026-12-28', expectedPurnimant: 'Pausha',   expectedAmanta: 'Margashirsha', source: 'Drik Panchang' },
  { date: '2027-07-05', expectedPurnimant: 'Ashadha',  expectedAmanta: 'Ashadha',      source: 'Drik Panchang' },
  { date: '2027-07-30', expectedPurnimant: 'Shravana', expectedAmanta: 'Ashadha',      source: 'Drik Panchang' },
  { date: '2027-08-10', expectedPurnimant: 'Shravana', expectedAmanta: 'Shravana',     source: 'Drik Panchang' },
];

function findContainingMonth(months: ReturnType<typeof computePurnimantMonths>, date: string) {
  return months.find(m => date >= m.startDate && date <= m.endDate);
}

describe('computePurnimantMonths — Drik-anchor regression (year-boundary post-Adhika)', () => {
  for (const anchor of DRIK_ANCHORS) {
    it(`${anchor.date}: Purnimanta = ${anchor.expectedPurnimant} (per ${anchor.source})`, () => {
      const year = parseInt(anchor.date.substring(0, 4), 10);
      const months = computePurnimantMonths(year);
      const match = findContainingMonth(months, anchor.date);
      expect(match, `no Purnimanta month found containing ${anchor.date}`).toBeDefined();
      // Strip "Adhika " prefix to compare base name; check isAdhika separately
      const baseName = match!.en.replace(/^Adhika /, '');
      expect(baseName).toBe(anchor.expectedPurnimant);
      if (anchor.expectedAdhika !== undefined) {
        expect(match!.isAdhika).toBe(anchor.expectedAdhika);
      }
    });
  }
});

describe('computeHinduMonths — Amanta cross-check (no regression)', () => {
  for (const anchor of DRIK_ANCHORS) {
    it(`${anchor.date}: Amanta = ${anchor.expectedAmanta} (per ${anchor.source})`, () => {
      const year = parseInt(anchor.date.substring(0, 4), 10);
      const months = computeHinduMonths(year);
      const match = findContainingMonth(months, anchor.date);
      expect(match, `no Amanta month found containing ${anchor.date}`).toBeDefined();
      const baseName = match!.en.replace(/^Adhika /, '');
      expect(baseName).toBe(anchor.expectedAmanta);
    });
  }
});

describe('computePurnimantMonths — structural invariants', () => {
  it('2026 Adhika Jyeshtha is correctly flagged + 14 entries', () => {
    const months = computePurnimantMonths(2026);
    expect(months.length).toBe(14);  // 12 + 1 Adhika + Pausha tail spanning Jan 2027
    const adhika = months.find(m => m.isAdhika);
    expect(adhika).toBeDefined();
    expect(adhika!.en).toContain('Jyeshtha');
  });

  it('No CONSECUTIVE Shravana/Bhadrapada/etc — the original bug-B pattern', () => {
    // Pre-fix bug: 2027 emitted two consecutive Shravana entries because
    // the 1-day sankranti scan missed the Karka→Simha transition that
    // happened within hours of a Full Moon boundary. After the lookback
    // fix the state machine pre-seeds correctly and uses sequential
    // naming through this transition, eliminating the duplicate.
    // (A duplicate name is OK when separated by an Adhika or by a
    //  full year — the year-boundary case is normal at index 0 vs 13.)
    for (const year of [2026, 2027, 2028, 2029, 2030]) {
      const months = computePurnimantMonths(year);
      for (let i = 1; i < months.length; i++) {
        const prev = months[i - 1];
        const curr = months[i];
        const prevBase = prev.en.replace(/^Adhika /, '');
        const currBase = curr.en.replace(/^Adhika /, '');
        if (prevBase === currBase && !prev.isAdhika && !curr.isAdhika) {
          throw new Error(
            `${year}: consecutive non-Adhika months share name "${prevBase}" — ` +
            `${prev.startDate}→${prev.endDate} then ${curr.startDate}→${curr.endDate}. ` +
            `Engine bug — only Adhika+nija pairs may share a base name.`,
          );
        }
      }
    }
  });
});

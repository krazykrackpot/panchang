/**
 * Cross-source verification V2 — Vimshottari Mahadasha vs BPHS canonical
 * + Prokerala-style reference values.
 *
 * `calculateVimshottariDasha(moonSidLong, birthDate)` is the canonical
 * dasha computation. Before this test, only structural assertions
 * (9 lords, sum ≈120y) existed — no check that the **starting balance
 * period** or the **end-date arithmetic** matched the BPHS Ch.46 rule.
 *
 * Per Prokerala (https://www.prokerala.com/astrology/vimshottari-dasha/),
 * the balance dasha at birth = `(1 - posInNakshatra) * lordYears`.
 * Phase 5e's Lesson-P millisecond arithmetic ensures end dates don't
 * truncation-drift over 120 years; that's the spec this test verifies.
 *
 * 5 reference Moon positions (one per nakshatra) anchor the cross-
 * source check. Each combines:
 *
 *   (a) Expected starting lord from BPHS Ch.46 sequence
 *       (Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn
 *       → Mercury, repeating per nakshatra group of 3)
 *   (b) Expected balance years from the `(1 - pos) * years` formula
 *   (c) Cumulative period boundaries summing to exactly 120 years
 *
 * 9 Mahadasha years (BPHS Ch.46):
 *   Ketu 7 · Venus 20 · Sun 6 · Moon 10 · Mars 7
 *   Rahu 18 · Jupiter 16 · Saturn 19 · Mercury 17  (sum = 120)
 *
 * Audit angle 2, V2 (2026-06-05).
 */

import { describe, it, expect } from 'vitest';
import { calculateVimshottariDasha } from '@/lib/ephem/kundali-calc';

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000;
const NAKSHATRA_SPAN = 360 / 27;

// ───────────────────────────────────────────────────────────────────────────
// BPHS Ch.46 canonical: 9-lord sequence + years (the cross-source reference)
// ───────────────────────────────────────────────────────────────────────────
const EXPECTED_ORDER = [
  { lord: 'Ketu',    years: 7  },
  { lord: 'Venus',   years: 20 },
  { lord: 'Sun',     years: 6  },
  { lord: 'Moon',    years: 10 },
  { lord: 'Mars',    years: 7  },
  { lord: 'Rahu',    years: 18 },
  { lord: 'Jupiter', years: 16 },
  { lord: 'Saturn',  years: 19 },
  { lord: 'Mercury', years: 17 },
] as const;

const YEARS_BY_LORD: Record<string, number> = Object.fromEntries(
  EXPECTED_ORDER.map(e => [e.lord, e.years]),
);

// Nakshatra index → starting Mahadasha lord. Repeats every 9 nakshatras
// (Ashwini→Magha→Mula = Ketu; Bharani→Purva Phalguni→Purva Ashadha = Venus; …).
function expectedStartLord(nakIdx: number): string {
  return EXPECTED_ORDER[nakIdx % 9].lord;
}

// ───────────────────────────────────────────────────────────────────────────
// 5 cross-source reference Moon positions
// ───────────────────────────────────────────────────────────────────────────
interface MoonRef {
  label: string;
  moonSidLong: number;    // sidereal longitude (degrees)
  birthDate: string;      // ISO YYYY-MM-DD for hashing into the calculation
  expectedStart: string;  // BPHS-derived first Mahadasha lord
  expectedBalanceYears: number;  // first Mahadasha balance period
  // Prokerala URL pattern (for manual cross-check by humans):
  prokeralaPattern: string;
}

const REFERENCES: readonly MoonRef[] = [
  // Ashwini start: nakIdx=0, pos=0 → balance = full Ketu = 7 years
  {
    label: 'Moon at 0° (start of Ashwini)',
    moonSidLong: 0.0,
    birthDate: '2026-01-01',
    expectedStart: 'Ketu',
    expectedBalanceYears: 7.0,
    prokeralaPattern: 'https://www.prokerala.com/astrology/vimshottari-dasha/?moon-long=0',
  },
  // Mid-Ashwini: pos=0.5 → Ketu balance = 7 * 0.5 = 3.5 years
  {
    label: 'Moon mid-Ashwini (pos=0.5)',
    moonSidLong: NAKSHATRA_SPAN / 2,
    birthDate: '2026-01-01',
    expectedStart: 'Ketu',
    expectedBalanceYears: 3.5,
    prokeralaPattern: 'https://www.prokerala.com/astrology/vimshottari-dasha/?moon-long=6.67',
  },
  // Start of Bharani: nakIdx=1, pos=0 → full Venus = 20 years
  {
    label: 'Moon at start of Bharani (nakIdx=1)',
    moonSidLong: NAKSHATRA_SPAN,
    birthDate: '2026-01-01',
    expectedStart: 'Venus',
    expectedBalanceYears: 20.0,
    prokeralaPattern: 'https://www.prokerala.com/astrology/vimshottari-dasha/?moon-long=13.33',
  },
  // Mid-Krittika: nakIdx=2, pos=0.5 → Sun balance = 6 * 0.5 = 3 years
  {
    label: 'Moon mid-Krittika (nakIdx=2, pos=0.5)',
    moonSidLong: NAKSHATRA_SPAN * 2 + NAKSHATRA_SPAN / 2,
    birthDate: '2026-01-01',
    expectedStart: 'Sun',
    expectedBalanceYears: 3.0,
    prokeralaPattern: 'https://www.prokerala.com/astrology/vimshottari-dasha/?moon-long=33.33',
  },
  // End of Rohini (nakIdx=3, pos→1): tiny Moon balance ≈ 0
  {
    label: 'Moon near end of Rohini (nakIdx=3, pos≈0.99)',
    moonSidLong: NAKSHATRA_SPAN * 3 + NAKSHATRA_SPAN * 0.99,
    birthDate: '2026-01-01',
    expectedStart: 'Moon',
    expectedBalanceYears: 10 * 0.01,
    prokeralaPattern: 'https://www.prokerala.com/astrology/vimshottari-dasha/?moon-long=53.20',
  },
] as const;

// ───────────────────────────────────────────────────────────────────────────
describe('Verify V2.1 — first Mahadasha lord matches BPHS Ch.46', () => {
  for (const ref of REFERENCES) {
    it(ref.label, () => {
      const dashas = calculateVimshottariDasha(ref.moonSidLong, new Date(ref.birthDate));
      expect(dashas.length).toBe(9);
      expect(dashas[0].planet).toBe(ref.expectedStart);
    });
  }

  // Independent: scan all 27 nakshatra starting points and confirm
  // the starting lord rotation is exactly the BPHS sequence.
  it('every nakshatra starts with the BPHS-prescribed Mahadasha lord', () => {
    for (let nak = 0; nak < 27; nak++) {
      const moonLong = nak * NAKSHATRA_SPAN; // start of nakshatra
      const dashas = calculateVimshottariDasha(moonLong, new Date('2026-01-01'));
      expect(dashas[0].planet, `nakshatra ${nak}`).toBe(expectedStartLord(nak));
    }
  });
});

describe('Verify V2.2 — balance period matches `(1 - pos) * lordYears`', () => {
  for (const ref of REFERENCES) {
    it(`${ref.label}: balance ≈ ${ref.expectedBalanceYears.toFixed(2)} years`, () => {
      const dashas = calculateVimshottariDasha(ref.moonSidLong, new Date(ref.birthDate));
      const first = dashas[0];
      const actualYears =
        (new Date(first.endDate).getTime() - new Date(first.startDate).getTime()) /
        MS_PER_YEAR;
      // ±0.01 year (≈3.65 days) tolerance — accounts for ms precision
      // and the polynomial fraction of moonSidLong/nakshatra-span.
      expect(Math.abs(actualYears - ref.expectedBalanceYears)).toBeLessThan(0.01);
    });
  }
});

describe('Verify V2.3 — 9-lord cycle order + Lesson-P ms arithmetic', () => {
  it('subsequent Mahadasha durations match BPHS years (±2 day truncation tolerance)', () => {
    const dashas = calculateVimshottariDasha(NAKSHATRA_SPAN, new Date('2026-01-01'));
    // Starting at Bharani → Venus full 20 years, then Sun 6, Moon 10, …
    // Check periods 2-9 against BPHS table (period 1 is the balance).
    //
    // Tolerance ±2 days = ~0.0055 years. The engine stores dates via
    // `toISOString().split('T')[0]` (date-only), truncating up to 24
    // hours of precision. Internally currentDate stays at ms precision
    // so period chaining is exact, but pure end-minus-start of the
    // stored strings can drift ±1 day per period when the boundary
    // doesn't land on a UTC midnight (e.g., 6 years × 365.25 = 2191.5
    // days, half-day rounded). ±2 days catches any drift > 1 boundary.
    const TOL = 2 / 365.25;
    for (let i = 1; i < 9; i++) {
      const lord = dashas[i].planet;
      const expectedYears = YEARS_BY_LORD[lord];
      const actualYears =
        (new Date(dashas[i].endDate).getTime() -
          new Date(dashas[i].startDate).getTime()) /
        MS_PER_YEAR;
      expect(Math.abs(actualYears - expectedYears), `period ${i} (${lord})`).toBeLessThan(TOL);
    }
  });

  it('total span across 9 Mahadashas equals 120 years (within 1 day cumulative)', () => {
    const dashas = calculateVimshottariDasha(NAKSHATRA_SPAN, new Date('2026-01-01'));
    const totalYears =
      (new Date(dashas[8].endDate).getTime() -
        new Date(dashas[0].startDate).getTime()) /
      MS_PER_YEAR;
    // The internal chaining is exact (currentDate stays as Date object,
    // not the truncated string), so the END of period 8 has the same
    // truncation error as a single period — ±1 day cumulative, not ±9.
    expect(Math.abs(totalYears - 120)).toBeLessThan(1 / 365.25);
  });

  it('subsequent Mahadasha follows the 9-lord cycle (no skips)', () => {
    const dashas = calculateVimshottariDasha(NAKSHATRA_SPAN, new Date('2026-01-01'));
    // Starting at Venus, the next 8 should be Sun, Moon, Mars, Rahu,
    // Jupiter, Saturn, Mercury, Ketu (one full BPHS cycle).
    const expected = ['Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury', 'Ketu'];
    for (let i = 0; i < 9; i++) {
      expect(dashas[i].planet).toBe(expected[i]);
    }
  });
});

describe('Verify V2.4 — endDate of period N = startDate of period N+1 (continuity)', () => {
  it('no gaps or overlaps between consecutive Mahadashas', () => {
    const dashas = calculateVimshottariDasha(NAKSHATRA_SPAN, new Date('2026-01-01'));
    for (let i = 0; i < 8; i++) {
      expect(dashas[i].endDate).toBe(dashas[i + 1].startDate);
    }
  });
});

describe('Verify V2.5 — Prokerala cross-source pointers (documented references)', () => {
  // This is a documentation-only test that surfaces the manual cross-
  // check URLs in the verification report. If the test passes, the
  // URLs are present; if it fails, someone removed them.
  for (const ref of REFERENCES) {
    it(`${ref.label}: Prokerala reference URL documented`, () => {
      expect(ref.prokeralaPattern).toMatch(/^https:\/\/www\.prokerala\.com/);
    });
  }
});

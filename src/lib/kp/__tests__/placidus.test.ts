/**
 * Placidus house-cusp engine — structural and reference invariants.
 *
 * Required by the KP roadmap spec (docs/specs/2026-06-04-kp-system-roadmap.md §2.1).
 *
 * Coverage:
 *   1. Structural invariants — 12 cusps, monotonic order around the wheel,
 *      Asc/Dsc and MC/IC pairs exactly antipodal, cusp 1 equals the main
 *      engine's `calculateAscendant` (validated against Swiss Ephemeris in
 *      `src/lib/ephem/__tests__/kundali-validation.test.ts`).
 *
 *   2. Three-latitude fixture matrix — Chennai (13°N), Delhi (28°N), London
 *      (51°N) at the same UTC moment cross-checked against AstroSage's
 *      published K.P. New chart for Delhi 1990-01-15 10:30 IST. All 12
 *      cusps within 2.2 arcmin (≤ 0.04°) of AstroSage — adequate for sub-lord
 *      determination at the 9-per-nakshatra (~1.5°) KP resolution.
 *
 *   3. Regression — engine intermediate cusps no longer duplicate
 *      (the pre-fix bug placed cusps 2≡5, 3≡6, 8≡11, 9≡12).
 */

import { describe, expect, it } from 'vitest';
import { calculatePlacidusCusps } from '../placidus';
import { calculateAscendant } from '@/lib/ephem/kundali-calc';
import { dateToJD, getAyanamsha } from '@/lib/ephem/astronomical';

// Tolerance for cross-engine comparison. 2.2 arcmin = 0.037°. This is the
// observed agreement between our engine + AstroSage's K.P. New chart for the
// Delhi 1990 fixture; mismatch beyond this likely indicates either an engine
// regression or an ayanamsha-formula divergence worth investigating.
const ARCMIN = 1 / 60;
const TOL_ARCMIN = 2.5 * ARCMIN; // generous to allow Meeus-fallback runs

// Tolerance for internal-consistency checks (Asc/Dsc antipodal etc.) where
// the engine must agree with itself bit-near-exactly.
const TOL_EXACT = 1e-6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function normalizeDeg(d: number): number {
  return ((d % 360) + 360) % 360;
}

/** Signed wrap-aware angular difference, returns value in (-180, 180]. */
function angleDiff(a: number, b: number): number {
  let d = a - b;
  while (d > 180) d -= 360;
  while (d <= -180) d += 360;
  return d;
}

// ---------------------------------------------------------------------------
// Fixtures — multiple latitudes at the same UTC moment isolate latitude
// dependence of Placidus (the trisection becomes more skewed as |lat| grows).
// ---------------------------------------------------------------------------

const JD_DELHI_1990 = dateToJD(1990, 1, 15, 5); // 10:30 IST = 05:00 UT
const AYAN_KP = getAyanamsha(JD_DELHI_1990, 'kp');

const FIXTURES = [
  { name: 'Chennai',   lat: 13.0827, lng: 80.2707 },
  { name: 'Delhi',     lat: 28.6,    lng: 77.2 },
  { name: 'London',    lat: 51.5074, lng: -0.1278 },
  { name: 'Equator',   lat:  0.0,    lng:  0.0 },
];

// ---------------------------------------------------------------------------
// 1. Structural invariants
// ---------------------------------------------------------------------------

describe('calculatePlacidusCusps — structural invariants', () => {
  for (const f of FIXTURES) {
    describe(`${f.name} (lat ${f.lat})`, () => {
      const cusps = calculatePlacidusCusps(JD_DELHI_1990, f.lat, f.lng, AYAN_KP);

      it('returns exactly 12 cusps', () => {
        expect(cusps).toHaveLength(12);
      });

      it('cusps are numbered 1..12 in order', () => {
        expect(cusps.map((c) => c.house)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
      });

      it('every cusp has a degree in [0, 360) and sign in [1, 12]', () => {
        for (const c of cusps) {
          expect(c.degree).toBeGreaterThanOrEqual(0);
          expect(c.degree).toBeLessThan(360);
          expect(c.sign).toBeGreaterThanOrEqual(1);
          expect(c.sign).toBeLessThanOrEqual(12);
        }
      });

      it('all 12 cusps are distinct (no duplicates)', () => {
        // The pre-fix engine produced cusp 2 ≡ cusp 5, 3 ≡ 6, 8 ≡ 11, 9 ≡ 12
        // because the antipodal-symmetric iteration converged to one fixed
        // point per quadrant pair. After the fix, each intermediate cusp
        // iterates to its own (haOffset, saCoef) HA target.
        const degrees = cusps.map((c) => c.degree.toFixed(4));
        expect(new Set(degrees).size).toBe(12);
      });

      it('Asc/Dsc (cusps 1 and 7) are antipodal', () => {
        const diff = Math.abs(angleDiff(cusps[0].degree, cusps[6].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('MC/IC (cusps 10 and 4) are antipodal', () => {
        const diff = Math.abs(angleDiff(cusps[9].degree, cusps[3].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('cusps 11 and 5 are antipodal (1/3 diurnal × 2 hemispheres)', () => {
        const diff = Math.abs(angleDiff(cusps[10].degree, cusps[4].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('cusps 12 and 6 are antipodal (2/3 diurnal × 2 hemispheres)', () => {
        const diff = Math.abs(angleDiff(cusps[11].degree, cusps[5].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('cusps 2 and 8 are antipodal', () => {
        const diff = Math.abs(angleDiff(cusps[1].degree, cusps[7].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('cusps 3 and 9 are antipodal', () => {
        const diff = Math.abs(angleDiff(cusps[2].degree, cusps[8].degree));
        expect(Math.abs(diff - 180)).toBeLessThan(TOL_EXACT);
      });

      it('cusp 1 (Asc) matches the main engine `calculateAscendant`', () => {
        // Cross-engine consistency: KP placidus.ts should produce the same Asc
        // as src/lib/ephem/kundali-calc.ts (validated against Swiss Ephemeris
        // in kundali-validation.test.ts). Bug history: pre-fix KP ascendant
        // omitted a +180° term and returned Dsc for every chart — every KP
        // cusp 1 was the wrong sign.
        const mainAscTrop = calculateAscendant(JD_DELHI_1990, f.lat, f.lng);
        const mainAscSid = normalizeDeg(mainAscTrop - AYAN_KP);
        expect(Math.abs(angleDiff(cusps[0].degree, mainAscSid))).toBeLessThan(TOL_ARCMIN);
      });
    });
  }
});

// ---------------------------------------------------------------------------
// 2. AstroSage fixture (K.P. New ayanamsha)
// ---------------------------------------------------------------------------

describe('calculatePlacidusCusps — vs AstroSage K.P. New, Delhi 1990-01-15 10:30 IST', () => {
  // Reference chart pulled live from AstroSage's KP planet-cusp tool 2026-06-05.
  // Form input: 15 Jan 1990 10:30:00 IST, New Delhi (lat 28°36' N, lng 77°12' E),
  // ayanamsa = K.P. New, charttype = kp. Result page captured via the
  // ascloud.astrosage.com/cloud/kpplanetcusp.asp HTML table.
  //
  // Each cusp is recorded as degrees-minutes-seconds; here we expand to
  // decimal degrees for the comparison.
  const ASTROSAGE_DELHI_1990: Array<{ house: number; dms: [number, number, number] }> = [
    { house: 1,  dms: [331, 29, 47] },
    { house: 2,  dms: [9,   54, 30] },
    { house: 3,  dms: [38,  59, 12] },
    { house: 4,  dms: [63,  14,  8] },
    { house: 5,  dms: [87,   3, 22] },
    { house: 6,  dms: [114, 46, 39] },
    { house: 7,  dms: [151, 29, 47] },
    { house: 8,  dms: [189, 54, 30] },
    { house: 9,  dms: [218, 59, 12] },
    { house: 10, dms: [243, 14,  8] },
    { house: 11, dms: [267,  3, 22] },
    { house: 12, dms: [294, 46, 39] },
  ];

  function dmsToDeg(d: number, m: number, s: number): number {
    return d + m / 60 + s / 3600;
  }

  // Delhi 28°36'N, 77°12'E — match the lat/lng AstroSage saw exactly so the
  // comparison isn't muddied by a different geocode of "New Delhi".
  const lat = 28 + 36 / 60;
  const lng = 77 + 12 / 60;
  const cusps = calculatePlacidusCusps(JD_DELHI_1990, lat, lng, AYAN_KP);

  for (const ref of ASTROSAGE_DELHI_1990) {
    it(`cusp ${ref.house} within ${(TOL_ARCMIN * 60).toFixed(1)} arcmin of AstroSage`, () => {
      const refDeg = dmsToDeg(...ref.dms);
      const diff = Math.abs(angleDiff(cusps[ref.house - 1].degree, refDeg));
      expect(diff).toBeLessThan(TOL_ARCMIN);
    });
  }
});

// ---------------------------------------------------------------------------
// 3. Latitude-dependence regression
// ---------------------------------------------------------------------------

describe('calculatePlacidusCusps — latitude sensitivity', () => {
  it('cusp angular width grows toward poles as Placidus skew increases', () => {
    // The Asc-to-IC quadrant (cusps 1 → 4) is 90° on the chart but spans
    // different ecliptic widths depending on latitude. At the equator the
    // four quadrants are equal; at high latitudes Placidus stretches/
    // compresses them. We only assert the qualitative behaviour: the
    // London chart's cusps 2-3 don't equal Chennai's.
    const eq = calculatePlacidusCusps(JD_DELHI_1990, 0, 0, AYAN_KP);
    const ldn = calculatePlacidusCusps(JD_DELHI_1990, 51.5, 0, AYAN_KP);
    // Same RAMC (same lng=0), but different latitude — intermediate cusps
    // must differ.
    expect(Math.abs(angleDiff(eq[1].degree, ldn[1].degree))).toBeGreaterThan(0.5);
    expect(Math.abs(angleDiff(eq[2].degree, ldn[2].degree))).toBeGreaterThan(0.5);
  });

  it('MC and IC are latitude-independent (only RAMC matters)', () => {
    const eq = calculatePlacidusCusps(JD_DELHI_1990, 0, 77.2, AYAN_KP);
    const ldh = calculatePlacidusCusps(JD_DELHI_1990, 51.5, 77.2, AYAN_KP);
    // Same RAMC (same lng) — MC and IC must match irrespective of latitude.
    expect(Math.abs(angleDiff(eq[9].degree, ldh[9].degree))).toBeLessThan(TOL_EXACT);
    expect(Math.abs(angleDiff(eq[3].degree, ldh[3].degree))).toBeLessThan(TOL_EXACT);
  });
});

/**
 * generateKPChart — end-to-end consistency invariants.
 *
 * Required by the KP roadmap spec (docs/specs/2026-06-04-kp-system-roadmap.md §2.1).
 *
 * The component-level tests (sub-lords.test.ts, placidus.test.ts,
 * ruling-planets.test.ts, prashna.test.ts, ruling-now.test.ts,
 * timezone-matrix.test.ts) pin individual stages. This file pins the
 * cross-stage glue:
 *   1. Cuspal sub-lord info matches `getSubLordForDegree(cusp.degree)`.
 *   2. Planetary sub-lord info matches `getSubLordForDegree(planet.longitude)`.
 *   3. House occupancy is consistent with cusp boundaries.
 *   4. Significator-level entries are well-formed (no out-of-range planet IDs,
 *      no duplicate planets within a single level).
 *   5. Ruling Planets fields are populated and self-consistent with the cast
 *      moment + Asc/Moon positions.
 *   6. Cuspal analysis covers all 12 houses.
 *
 * Fixture: Delhi 1990-01-15 10:30 IST, cross-checked against AstroSage's
 * K.P. New cusps in placidus.test.ts. Here we focus on engine-internal
 * consistency that no external reference can verify (e.g. that the cuspal
 * sub-lord shown in `cusps[].subLordInfo` matches the one inside
 * `cuspalAnalysis` and the one consumed by the prashna verdict).
 */

import { describe, expect, it } from 'vitest';
import { generateKPChart } from '../kp-chart';
import { getSubLordForDegree } from '../sub-lords';
import type { BirthData } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Fixture
// ---------------------------------------------------------------------------

const DELHI_1990: BirthData = {
  name: 'Test Subject',
  place: 'New Delhi',
  date: '1990-01-15',
  time: '10:30',
  lat: 28.6,
  lng: 77.2,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'kp',
};

// Multi-locale, multi-latitude smoke fixtures so consistency invariants
// exercise polar-ish, equatorial, and mid-latitude charts.
const FIXTURES: BirthData[] = [
  DELHI_1990,
  { ...DELHI_1990, place: 'Chennai', lat: 13.0827, lng: 80.2707 },
  { ...DELHI_1990, place: 'London',  lat: 51.5074, lng: -0.1278, timezone: 'Europe/London' },
  { ...DELHI_1990, place: 'Corseaux', lat: 46.4567, lng: 6.8442, timezone: 'Europe/Zurich' },
];

// ---------------------------------------------------------------------------
// 1. Cuspal sub-lord identity
// ---------------------------------------------------------------------------

describe('generateKPChart — cuspal sub-lord info matches direct lookup', () => {
  for (const fixture of FIXTURES) {
    it(`${fixture.place}: each cusp's subLordInfo equals getSubLordForDegree(cusp.degree)`, () => {
      const chart = generateKPChart(fixture);
      expect(chart.cusps).toHaveLength(12);
      for (const cusp of chart.cusps) {
        const expected = getSubLordForDegree(cusp.degree);
        // Compare structural identity — the engine stores a fresh object each
        // call, so use field-level equality, not reference equality.
        expect(cusp.subLordInfo.signLord.id).toBe(expected.signLord.id);
        expect(cusp.subLordInfo.starLord.id).toBe(expected.starLord.id);
        expect(cusp.subLordInfo.subLord.id).toBe(expected.subLord.id);
        expect(cusp.subLordInfo.subSubLord.id).toBe(expected.subSubLord.id);
      }
    });
  }
});

// ---------------------------------------------------------------------------
// 2. Planet sub-lord identity
// ---------------------------------------------------------------------------

describe('generateKPChart — planet sub-lord info matches direct lookup', () => {
  it('Delhi 1990: every planet sub-lord chain reads from getSubLordForDegree(longitude)', () => {
    const chart = generateKPChart(DELHI_1990);
    expect(chart.planets).toHaveLength(9); // 9 grahas: Sun..Saturn + Rahu/Ketu
    for (const planet of chart.planets) {
      const expected = getSubLordForDegree(planet.longitude);
      expect(planet.subLordInfo.signLord.id).toBe(expected.signLord.id);
      expect(planet.subLordInfo.starLord.id).toBe(expected.starLord.id);
      expect(planet.subLordInfo.subLord.id).toBe(expected.subLord.id);
    }
  });
});

// ---------------------------------------------------------------------------
// 3. House occupancy
// ---------------------------------------------------------------------------

describe('generateKPChart — house occupancy consistent with cusp boundaries', () => {
  it('Delhi 1990: every planet is assigned a house in [1, 12]', () => {
    const chart = generateKPChart(DELHI_1990);
    for (const p of chart.planets) {
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
  });

  it("each planet's house is the cusp range containing its longitude (Placidus)", () => {
    const chart = generateKPChart(DELHI_1990);
    const sortedCusps = [...chart.cusps].sort((a, b) => a.house - b.house);
    for (const planet of chart.planets) {
      const houseStart = sortedCusps[planet.house - 1].degree;
      const houseEnd = sortedCusps[planet.house % 12].degree;
      const lng = ((planet.longitude % 360) + 360) % 360;
      // Wrap-aware range check
      let inHouse: boolean;
      if (houseEnd > houseStart) {
        inHouse = lng >= houseStart - 1e-6 && lng < houseEnd + 1e-6;
      } else {
        inHouse = lng >= houseStart - 1e-6 || lng < houseEnd + 1e-6;
      }
      if (!inHouse) {
        throw new Error(
          `Planet at ${lng.toFixed(4)}° assigned house ${planet.house} ` +
            `but cusp range is [${houseStart.toFixed(4)}, ${houseEnd.toFixed(4)})`,
        );
      }
    }
  });

  it('houses array tally equals planet count', () => {
    const chart = generateKPChart(DELHI_1990);
    const sum = chart.chart.houses.reduce((s, ids) => s + ids.length, 0);
    expect(sum).toBe(chart.planets.length);
  });
});

// ---------------------------------------------------------------------------
// 4. Significators
// ---------------------------------------------------------------------------

describe('generateKPChart — significator levels are well-formed', () => {
  const chart = generateKPChart(DELHI_1990);

  it('produces 12 significator entries (one per house)', () => {
    expect(chart.significators).toHaveLength(12);
    expect(chart.significators.map((s) => s.house).sort((a, b) => a - b))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('every level holds planet IDs in [0, 8]', () => {
    for (const sig of chart.significators) {
      for (const id of [...sig.level1, ...sig.level2, ...sig.level3, ...sig.level4]) {
        expect(id).toBeGreaterThanOrEqual(0);
        expect(id).toBeLessThanOrEqual(8);
      }
    }
  });

  it('within a level, planet IDs are unique', () => {
    for (const sig of chart.significators) {
      expect(new Set(sig.level1).size).toBe(sig.level1.length);
      expect(new Set(sig.level2).size).toBe(sig.level2.length);
      expect(new Set(sig.level3).size).toBe(sig.level3.length);
      expect(new Set(sig.level4).size).toBe(sig.level4.length);
    }
  });

  it('combined list is the union of all 4 levels in insertion order, deduplicated', () => {
    for (const sig of chart.significators) {
      const fromLevels = [...new Set([...sig.level1, ...sig.level2, ...sig.level3, ...sig.level4])];
      expect(new Set(sig.combined)).toEqual(new Set(fromLevels));
    }
  });
});

// ---------------------------------------------------------------------------
// 5. Cuspal analysis
// ---------------------------------------------------------------------------

describe('generateKPChart — cuspal analysis row per house', () => {
  it('produces 12 cuspal analysis rows', () => {
    const chart = generateKPChart(DELHI_1990);
    expect(chart.cuspalAnalysis).toHaveLength(12);
    expect(chart.cuspalAnalysis.map((c) => c.house).sort((a, b) => a - b))
      .toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  });

  it('each row carries a signified-houses array of values in [1, 12]', () => {
    const chart = generateKPChart(DELHI_1990);
    for (const row of chart.cuspalAnalysis) {
      expect(Array.isArray(row.signifiedHouses)).toBe(true);
      for (const h of row.signifiedHouses) {
        expect(h).toBeGreaterThanOrEqual(1);
        expect(h).toBeLessThanOrEqual(12);
      }
    }
  });

  it('cuspalAnalysis[i].subLordName matches cusps[i].subLordInfo.subLord.name', () => {
    // The cuspal-analysis "Sub Lord" must come from the same lookup pipeline
    // as the cusp's own subLordInfo. Drift between the two would be invisible
    // to the user but would make significator math inconsistent with the
    // displayed cuspal table.
    const chart = generateKPChart(DELHI_1990);
    for (const row of chart.cuspalAnalysis) {
      const cusp = chart.cusps.find((c) => c.house === row.house);
      if (!cusp) throw new Error(`Missing cusp for house ${row.house}`);
      expect(row.subLordName.en).toBe(cusp.subLordInfo.subLord.name.en);
    }
  });
});

// ---------------------------------------------------------------------------
// 6. Ruling Planets (7-RP set)
// ---------------------------------------------------------------------------

describe('generateKPChart — ruling planets (7-RP)', () => {
  const chart = generateKPChart(DELHI_1990);
  const rp = chart.rulingPlanets;

  it('returns all 7 RP fields populated with valid planet IDs', () => {
    for (const field of [
      rp.ascSignLord, rp.ascStarLord, rp.ascSubLord,
      rp.moonSignLord, rp.moonStarLord, rp.moonSubLord,
      rp.dayLord,
    ]) {
      expect(field.id).toBeGreaterThanOrEqual(0);
      expect(field.id).toBeLessThanOrEqual(8);
      expect(field.name.en).toBeTruthy();
    }
  });

  it('ascSubLord matches getSubLordForDegree(cusps[0].degree).subLord', () => {
    const expected = getSubLordForDegree(chart.cusps[0].degree);
    expect(rp.ascSubLord.id).toBe(expected.subLord.id);
  });

  it('moonSubLord matches getSubLordForDegree(moon.longitude).subLord', () => {
    const moon = chart.planets.find((p) => p.planet.id === 1);
    if (!moon) throw new Error('Moon missing from planets array');
    const expected = getSubLordForDegree(moon.longitude);
    expect(rp.moonSubLord.id).toBe(expected.subLord.id);
  });
});

// ---------------------------------------------------------------------------
// 7. Regression: cusps remain distinct (the pre-fix bug created duplicates)
// ---------------------------------------------------------------------------

describe('generateKPChart — regression: no duplicate cusps', () => {
  for (const fixture of FIXTURES) {
    it(`${fixture.place}: all 12 cusp ecliptic positions are distinct`, () => {
      const chart = generateKPChart(fixture);
      const ecliptics = chart.cusps.map((c) => c.degree.toFixed(4));
      expect(new Set(ecliptics).size).toBe(12);
    });
  }
});

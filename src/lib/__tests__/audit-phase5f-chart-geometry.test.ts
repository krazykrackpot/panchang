/**
 * Audit 2026-06-05 Phase 5f — chart geometry consolidation (#23).
 *
 * Extracts the 12 SVG path strings of the North Indian diamond chart
 * to `src/lib/constants/chart-geometry.ts` and migrates 5 surfaces
 * that previously duplicated the geometry inline:
 *
 *   1. src/components/kundali/ChartNorth.tsx        (canonical, 586 lines)
 *   2. src/components/kundali/MiniChart.tsx         (215 lines)
 *   3. src/components/kundali/MiniChartNorth.tsx    (125 lines)
 *   4. src/components/learn/ExampleKundaliChart.tsx (228 lines)
 *   5. src/components/learn/HouseHighlightChart.tsx (149 lines)
 *
 * Each surface still owns its own centroids (cx/cy) and label
 * positions (signX/signY, labelX/labelY) — those are visual idiom
 * choices, not geometry. Only the `d` (path) attribute is canonical.
 *
 * Audit complaint: "a glyph or house-numbering fix in
 * `ChartNorth/ChartSouth` doesn't propagate." With the geometry
 * extracted, any change to a house path now lands once and propagates
 * to all 5 surfaces in the same render cycle.
 *
 * Scope decision: extracting only paths (not the full `compact` prop
 * refactor in the audit's "thin wrappers" wording) is lower-risk and
 * fully addresses the propagation concern. Each mini retains its
 * unique visual idiom (highlights, hardcoded examples, planet
 * symbols) — those don't drift the way coordinates do.
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { NORTH_DIAMOND_HOUSE_PATHS, NORTH_DIAMOND_VIEWBOX } from '@/lib/constants/chart-geometry';

const repoFile = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

// ───────────────────────────────────────────────────────────────────────────
// 1 — canonical constant shape + content
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5f.1 (#23): NORTH_DIAMOND_HOUSE_PATHS canonical shape', () => {
  it('exports 12 path strings, keyed 1-12', () => {
    expect(Object.keys(NORTH_DIAMOND_HOUSE_PATHS).sort((a, b) => Number(a) - Number(b))).toEqual([
      '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
    ]);
  });

  it('every path begins with `M` (SVG moveTo) and ends with `Z` (closepath)', () => {
    for (let i = 1; i <= 12; i++) {
      // Cast to keyof typeof — NORTH_DIAMOND_HOUSE_PATHS is now narrowed
      // to literal keys `1 | 2 | ... | 12` (no Record<number, ...>
      // annotation), so iteration variables need an explicit cast.
      // Gemini PR #450.
      const p = NORTH_DIAMOND_HOUSE_PATHS[i as keyof typeof NORTH_DIAMOND_HOUSE_PATHS];
      expect(p).toBeDefined();
      expect(p).toMatch(/^M\s/);
      expect(p).toMatch(/\sZ$/);
    }
  });

  it('viewBox is the documented 500×500', () => {
    expect(NORTH_DIAMOND_VIEWBOX).toBe(500);
  });

  // Spot-check known canonical values from BPHS North-Indian convention.
  // House 1 = central diamond (Lagna); houses 2, 12 = top wedges flanking it.
  it('house 1 (Lagna) is the central diamond', () => {
    expect(NORTH_DIAMOND_HOUSE_PATHS[1]).toBe('M 250 30 L 140 140 L 250 250 L 360 140 Z');
  });

  it('house 7 (Setting / DK) is the bottom-central diamond', () => {
    expect(NORTH_DIAMOND_HOUSE_PATHS[7]).toBe('M 250 470 L 140 360 L 250 250 L 360 360 Z');
  });
});

// ───────────────────────────────────────────────────────────────────────────
// 2 — drift guards: 5 surfaces import the canonical
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5f.2 (#23): 5 consuming surfaces import canonical paths', () => {
  const surfaces = [
    'src/components/kundali/ChartNorth.tsx',
    'src/components/kundali/MiniChart.tsx',
    'src/components/kundali/MiniChartNorth.tsx',
    'src/components/learn/ExampleKundaliChart.tsx',
    'src/components/learn/HouseHighlightChart.tsx',
  ];

  for (const path of surfaces) {
    it(`${path} imports NORTH_DIAMOND_HOUSE_PATHS`, () => {
      const src = repoFile(path);
      expect(src).toMatch(/NORTH_DIAMOND_HOUSE_PATHS[\s\S]*from\s+['"]@\/lib\/constants\/chart-geometry['"]/);
      // None of the surfaces should still inline the canonical M 250 30
      // diamond path for house 1 — that would mean a duplicate is back.
      const noInlineHouse1 = /path:\s*['"]M 250 30 L 140 140 L 250 250 L 360 140 Z['"]/;
      expect(src).not.toMatch(noInlineHouse1);
    });
  }
});

// ───────────────────────────────────────────────────────────────────────────
// 3 — anti-regression: the 5 surfaces all reference the same set
// ───────────────────────────────────────────────────────────────────────────
describe('Audit P5f.3 (#23): no surface diverges via partial migration', () => {
  it('every surface references each of the 12 NORTH_DIAMOND_HOUSE_PATHS[N] entries', () => {
    const surfaces = [
      'src/components/kundali/ChartNorth.tsx',
      'src/components/kundali/MiniChart.tsx',
      'src/components/kundali/MiniChartNorth.tsx',
      'src/components/learn/ExampleKundaliChart.tsx',
      'src/components/learn/HouseHighlightChart.tsx',
    ];
    for (const path of surfaces) {
      const src = repoFile(path);
      for (let i = 1; i <= 12; i++) {
        // Regex tolerates whitespace variants like `[1]` or `[ 1 ]`.
        const ref = new RegExp(`NORTH_DIAMOND_HOUSE_PATHS\\[\\s*${i}\\s*\\]`);
        expect(src, `${path} missing reference to house ${i}`).toMatch(ref);
      }
    }
  });
});

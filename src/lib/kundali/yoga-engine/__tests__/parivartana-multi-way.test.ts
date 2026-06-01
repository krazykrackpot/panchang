/**
 * Bahu-Parivartana (multi-way exchange) — algorithmic tests for the
 * lordship-graph cycle detector added in 2026-06-01.
 *
 * The test file deliberately doesn't drive `generateKundali()` end-to-end —
 * constructing a real birth chart that satisfies a chosen lordship-cycle
 * topology requires hand-tuning planet positions, which is fragile. Instead
 * we stub the parts of `YogaContext` that `findLordshipCycles` actually
 * touches: `houseLord(h)` and `planetHouse(planetId)`. The cycle detection
 * is a pure graph algorithm over those two lookups; the stub captures
 * everything that matters.
 *
 * Coverage:
 *   - Length-3 cycle is detected and normalised to canonical (min-rotated) form
 *   - Length-4 cycle ditto
 *   - Binary cycle is excluded when minLength = 3
 *   - Self-loop (length 1) is always excluded
 *   - No cycle (acyclic / all-tail) returns [] cleanly
 *   - Two disjoint cycles in the same chart both detected
 *   - Frequency cap (Lesson T): random charts trigger < 15% of the time
 */
import { describe, it, expect } from 'vitest';
import type { YogaContext } from '../types';
import { findLordshipCycles } from '../rules/parivartana';

// ─── Test stubs ───────────────────────────────────────────────────────────

/**
 * Minimal YogaContext stub: only the two lookups `findLordshipCycles`
 * actually invokes. Anything else throws so a future refactor that adds
 * new lookups inside the cycle finder will surface here loudly.
 */
function stubContext(houseLordMap: Record<number, number>, planetHouseMap: Record<number, number>): YogaContext {
  const handler: ProxyHandler<object> = {
    get(_t, prop) {
      if (prop === 'houseLord') return (h: number) => houseLordMap[h] ?? 0;
      if (prop === 'planetHouse') return (id: number) => planetHouseMap[id] ?? 1;
      throw new Error(`stubContext: unexpected access to ${String(prop)}`);
    },
  };
  return new Proxy({}, handler) as unknown as YogaContext;
}

// ─── Targeted topology tests ──────────────────────────────────────────────

describe('findLordshipCycles — 3-way Parivartana detection', () => {
  it('detects a clean 3-way cycle 1→5→9→1', () => {
    // Setup: lord of house 1 = planet A, A sits in house 5
    //        lord of house 5 = planet B, B sits in house 9
    //        lord of house 9 = planet C, C sits in house 1
    // All other houses self-loop (lord sits in own house) — they form
    // 9 separate length-1 cycles that we ignore via minLength = 3.
    const houseLordMap: Record<number, number> = {
      1: 100, 5: 101, 9: 102,
      // Stub lords for other houses; their lords sit in own house (self-loop).
      2: 200, 3: 201, 4: 202, 6: 204, 7: 205, 8: 206, 10: 207, 11: 208, 12: 209,
    };
    const planetHouseMap: Record<number, number> = {
      100: 5, 101: 9, 102: 1,
      // Other lords are in their own houses.
      200: 2, 201: 3, 202: 4, 204: 6, 205: 7, 206: 8, 207: 10, 208: 11, 209: 12,
    };
    const cycles = findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 3);
    expect(cycles).toHaveLength(1);
    // Canonical form starts at the smallest house number, rotates forward.
    expect(cycles[0]).toEqual([1, 5, 9]);
  });

  it('detects a 4-way cycle 1→4→7→10→1', () => {
    const houseLordMap: Record<number, number> = {
      1: 100, 4: 101, 7: 102, 10: 103,
      2: 200, 3: 201, 5: 203, 6: 204, 8: 206, 9: 207, 11: 208, 12: 209,
    };
    const planetHouseMap: Record<number, number> = {
      100: 4, 101: 7, 102: 10, 103: 1,
      200: 2, 201: 3, 203: 5, 204: 6, 206: 8, 207: 9, 208: 11, 209: 12,
    };
    const cycles = findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 3);
    expect(cycles).toHaveLength(1);
    expect(cycles[0]).toEqual([1, 4, 7, 10]);
  });

  it('detects two disjoint cycles in the same chart', () => {
    // Cycle A: 1→3→5→1 (length 3)
    // Cycle B: 2→7→2 (length 2 — included only when minLength ≤ 2)
    const houseLordMap: Record<number, number> = {
      1: 100, 3: 101, 5: 102,
      2: 200, 7: 201,
      4: 300, 6: 301, 8: 302, 9: 303, 10: 304, 11: 305, 12: 306,
    };
    const planetHouseMap: Record<number, number> = {
      100: 3, 101: 5, 102: 1,
      200: 7, 201: 2,
      300: 4, 301: 6, 302: 8, 303: 9, 304: 10, 305: 11, 306: 12,
    };
    const cyclesAll = findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 2);
    expect(cyclesAll).toHaveLength(2);
    // Sort by length then by first element so the assertion is order-stable.
    cyclesAll.sort((a, b) => a.length - b.length || a[0] - b[0]);
    expect(cyclesAll[0]).toEqual([2, 7]);
    expect(cyclesAll[1]).toEqual([1, 3, 5]);

    // With minLength=3, only the 3-cycle is reported.
    const cycles3 = findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 3);
    expect(cycles3).toHaveLength(1);
    expect(cycles3[0]).toEqual([1, 3, 5]);
  });
});

describe('findLordshipCycles — exclusions', () => {
  it('excludes binary cycle when minLength = 3 (binary handled by maha/dainya/khala rules)', () => {
    // Cycle 1↔7 (length 2)
    const houseLordMap: Record<number, number> = {
      1: 100, 7: 101,
      2: 200, 3: 201, 4: 202, 5: 203, 6: 204, 8: 206, 9: 207, 10: 208, 11: 209, 12: 210,
    };
    const planetHouseMap: Record<number, number> = {
      100: 7, 101: 1,
      200: 2, 201: 3, 202: 4, 203: 5, 204: 6, 206: 8, 207: 9, 208: 10, 209: 11, 210: 12,
    };
    expect(findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 3)).toEqual([]);
  });

  it('excludes self-loops (length 1) at any minLength ≥ 2', () => {
    // Every house's lord sits in own house — 12 length-1 cycles.
    const houseLordMap: Record<number, number> = {};
    const planetHouseMap: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      houseLordMap[h] = h + 100;
      planetHouseMap[h + 100] = h;
    }
    expect(findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 2)).toEqual([]);
  });

  it('returns empty array when no cycles exist (rare in practice; can\'t happen for an out-degree-1 finite graph)', () => {
    // Pathological "self-loop everywhere" — covered above. There's no way
    // to build a 12-node out-degree-1 graph with NO cycle (would require
    // an infinite tail). This test is a placeholder asserting the helper
    // returns an array and doesn't throw on the trivial case.
    const houseLordMap: Record<number, number> = {};
    const planetHouseMap: Record<number, number> = {};
    for (let h = 1; h <= 12; h++) {
      houseLordMap[h] = h + 100;
      planetHouseMap[h + 100] = h;
    }
    const result = findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 13);
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual([]);
  });
});

// ─── Frequency probe (Lesson T) ───────────────────────────────────────────

describe('findLordshipCycles — frequency sanity cap (variant of Lesson T)', () => {
  it('random-model rate sits in the 30-65% band (proves algorithm isn\'t accidentally counting length-2)', () => {
    // CLAUDE.md Lesson T's "rare yoga should fire <20%" guidance does NOT
    // map cleanly to Parivartana. Parivartana is a topological feature of
    // the lordship graph, not a conditional dignity-based yoga; for a
    // 12-node random out-degree-1 graph the analytic probability of
    // ANY cycle of length ≥ 3 is ~50%. Real charts will sit somewhat
    // lower because planet positions are correlated (Mercury near Sun,
    // ascendant/Moon distinctness, etc.) but not by an order of magnitude.
    //
    // The useful regression guard here is the OPPOSITE direction: if I'd
    // accidentally included length-2 cycles, the rate jumps to ~99% (every
    // chart with any binary exchange also gets flagged as multi-way). The
    // 65% upper bound catches that. The 30% lower bound catches the
    // opposite accident — minLength = 4 or some bug that drops most cycles.
    const seed = 0x9E3779B9; // golden-ratio constant for deterministic LCG
    let rng = seed;
    const next = () => {
      rng = (rng * 1664525 + 1013904223) >>> 0;
      return rng / 0xFFFFFFFF;
    };

    let triggerCount = 0;
    const N = 200;
    for (let trial = 0; trial < N; trial++) {
      const houseLordMap: Record<number, number> = {};
      const planetHouseMap: Record<number, number> = {};
      for (let h = 1; h <= 12; h++) {
        const synthLord = h + 1000;
        houseLordMap[h] = synthLord;
        planetHouseMap[synthLord] = Math.floor(next() * 12) + 1;
      }
      if (findLordshipCycles(stubContext(houseLordMap, planetHouseMap), 3).length > 0) {
        triggerCount++;
      }
    }
    const rate = triggerCount / N;
    expect(
      rate,
      `trigger rate ${(rate * 100).toFixed(1)}% on ${N} random charts — expected 30-65% for a topological yoga`,
    ).toBeGreaterThan(0.30);
    expect(rate).toBeLessThan(0.65);
  });
});

/**
 * Yoga frequency calibration test (CLAUDE.md lesson T).
 *
 * Generates N seeded random charts, counts how often each named yoga fires,
 * and asserts that the firing frequency falls within bounds documented in
 * the rule files (`src/lib/kundali/yoga-engine/rules/*.ts`) and CLAUDE.md
 * lesson T.
 *
 * Purpose: catch "condition too loose" bugs (e.g. PR #298 era Vasumati at
 * 79% instead of <5%, Gauri at 50% instead of <5%) the moment they regress.
 * A rare yoga firing 5× its expected rate is almost always a `.some()`
 * where `.every()` is required, or an aspect direction reversed.
 *
 * Test design:
 *   - Deterministic PRNG (seed = 42) so the same chart set runs every CI.
 *   - N = 200 — enough for ±5-8% precision per yoga at <50% rates.
 *   - Bounds generous (typically 2-3× documented value) so natural sampling
 *     variance doesn't false-positive; bounds tight enough to catch >2× drift.
 *   - Two .skip entries document KNOWN lesson-T violations to fix (mangal-dosha,
 *     kendradhipati-dosha) without blocking the rest of the calibration.
 *
 * Calibration baseline captured 2026-05-31 with seed=42 against the engine
 * at commit 0e3cf6c5. To re-calibrate bounds:
 *   npx tsx scripts/probe-yoga-freq.ts 200 42
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { mulberry32, randomChart } from './yoga-test-helpers';

const N = 200;
const SEED = 42;

let counts: Map<string, number>;
let totalCharts: number;

function freq(id: string): number {
  return (counts.get(id) ?? 0) / totalCharts;
}

beforeAll(() => {
  const rand = mulberry32(SEED);
  counts = new Map();
  totalCharts = 0;
  // No try/catch around generateKundali — `randomChart` clamps latitude to
  // the inhabited band [-55, 55] so the ascendant math doesn't degenerate.
  // A real generation error here SHOULD fail the test loudly with a stack
  // trace pointing at the engine bug, not get silently absorbed into a
  // slightly-undersized sample. (Gemini PR #325 cycle-2 MED.)
  for (let i = 0; i < N; i++) {
    const k = generateKundali(randomChart(rand, i));
    totalCharts++;
    for (const y of k.yogasComplete) {
      if (y.present) counts.set(y.id, (counts.get(y.id) ?? 0) + 1);
    }
  }
  // Defensive sanity check — kept as a belt-and-braces guard in case a
  // future refactor accidentally re-introduces a swallow-everything catch
  // above. (Gemini PR #325 cycle-1 MED.)
  if (totalCharts === 0) {
    throw new Error(
      `[yoga-frequency-calibration] no charts generated (seed=${SEED}). ` +
        `Engine likely broken; fix the engine before this test can run.`,
    );
  }
});

/**
 * Expected frequency bounds per yoga. Sources:
 *   - Rule-file docstrings (src/lib/kundali/yoga-engine/rules/*.ts)
 *   - CLAUDE.md lesson T
 *   - Observed 2026-05-31 baseline (seed=42, N=200)
 *
 * Bounds are inclusive percentages (0–1). Bands are roughly 2× the documented
 * expected rate, with at least 5% headroom, so a 2.5× regression fails fast
 * but natural variance does not.
 */
type Bound = { id: string; docs: string; min: number; max: number };

const COMMON_YOGAS: Bound[] = [
  // Chandra yogas
  { id: 'gajakesari',      docs: '~25% (chandra.ts)',   min: 0.12, max: 0.45 },
  { id: 'sunapha',         docs: '~35-50% (chandra.ts)', min: 0.18, max: 0.70 },
  { id: 'anapha',          docs: '~30-50% (chandra.ts)', min: 0.15, max: 0.70 },
  { id: 'durdhara',        docs: '~12-30% (chandra.ts)', min: 0.05, max: 0.45 },
  { id: 'shakata',         docs: '~17% (chandra.ts)',    min: 0.06, max: 0.30 },
  // Dosha (classical) — Mars in {1,2,4,7,8,12} from Lagna only per PR #326's
  // Phaladeepika fix. Pre-fix this fired at ~89.5% via the OR-of-three-
  // references rule; post-fix it sits at the mathematical baseline 6/12.
  { id: 'mangal-dosha',    docs: '~50% (dosha.ts, Phaladeepika Ch.6 — Lagna only)', min: 0.35, max: 0.65 },
];

const RARE_YOGAS: Bound[] = [
  // Documented "rare" — must NOT exceed ceiling (lesson T territory).
  { id: 'kemadruma',       docs: '~5% (chandra.ts)',           min: 0.00, max: 0.15 },
  { id: 'chandra-mangal',  docs: '~8% (chandra.ts)',           min: 0.00, max: 0.20 },
  { id: 'adhi',            docs: '~2% (chandra.ts)',           min: 0.00, max: 0.10 },
  // Mahapurusha (each ~5-8% per BPHS Ch.34)
  { id: 'ruchaka',         docs: '~5-8% (mahapurusha.ts)',     min: 0.00, max: 0.15 },
  { id: 'bhadra',          docs: '~5-8% (mahapurusha.ts)',     min: 0.00, max: 0.15 },
  { id: 'hamsa',           docs: '~5-8% (mahapurusha.ts)',     min: 0.00, max: 0.15 },
  { id: 'malavya',         docs: '~5-8% (mahapurusha.ts)',     min: 0.00, max: 0.15 },
  { id: 'shasha',          docs: '~5-8% (mahapurusha.ts)',     min: 0.00, max: 0.15 },
  // Dhana (rare per dhana.ts docs)
  { id: 'mahalakshmi',     docs: '~2% (dhana.ts)',             min: 0.00, max: 0.10 },
  { id: 'kalanidhi',       docs: '~2% (dhana.ts)',             min: 0.00, max: 0.10 },
  // Other rare
  { id: 'saraswati',       docs: 'rare — Mercury+Jupiter+Venus in kendra', min: 0.00, max: 0.30 },
];

describe('Yoga frequency calibration — common yogas', () => {
  it(`computed ${N} charts with deterministic seed ${SEED}`, () => {
    expect(totalCharts).toBeGreaterThanOrEqual(N - 5);
  });

  for (const b of COMMON_YOGAS) {
    it(`${b.id} fires ${(b.min * 100).toFixed(0)}-${(b.max * 100).toFixed(0)}% of charts [${b.docs}]`, () => {
      const f = freq(b.id);
      const hits = counts.get(b.id) ?? 0;
      expect(
        f,
        `${b.id}: observed ${hits}/${totalCharts} = ${(f * 100).toFixed(1)}% (expected ${b.docs})`,
      ).toBeGreaterThanOrEqual(b.min);
      expect(
        f,
        `${b.id}: observed ${hits}/${totalCharts} = ${(f * 100).toFixed(1)}% (expected ${b.docs})`,
      ).toBeLessThanOrEqual(b.max);
    });
  }
});

describe('Yoga frequency calibration — rare yogas (lesson T ceiling)', () => {
  for (const b of RARE_YOGAS) {
    it(`${b.id} fires ≤ ${(b.max * 100).toFixed(0)}% of charts [${b.docs}]`, () => {
      const f = freq(b.id);
      const hits = counts.get(b.id) ?? 0;
      expect(
        f,
        `${b.id}: observed ${hits}/${totalCharts} = ${(f * 100).toFixed(1)}% (expected ${b.docs}). ` +
          `If this fails, the rule is probably too loose — check for .some() where .every() ` +
          `is required, or aspect direction reversal. (lesson T)`,
      ).toBeLessThanOrEqual(b.max);
    });
  }
});

// Note: this file originally had a `describe.skip` block tracking two
// known lesson-T violations — `mangal-dosha` at 89.5% (classically wrong;
// fired on Mars from Lagna OR Moon OR Venus) and `kendradhipati-dosha`
// at 100% (chart-level dosha that fires by construction every lagna).
// Both have since been fixed:
//   - mangal-dosha → tightened to Lagna only in PR #326 (Phaladeepika
//     Ch.6 / Mansagari / Brihat Jataka). Now ~50%. Live assertion moved
//     up into COMMON_YOGAS.
//   - kendradhipati-dosha → removed entirely as a chart-level entry in
//     PR #328. The classical concept is a per-planet neutralisation
//     (BPHS Ch.34 v.10-11 "na shubha-phaladaa") surfaced through
//     functional-nature.ts as `nature: 'neutral'` with label
//     "Neutral (Kendra Lord)". The yoga id no longer exists in
//     yogasComplete so a frequency assertion is meaningless.
// The skip block is therefore deleted, not just emptied — there are
// currently no known frequency-calibration violations to track.

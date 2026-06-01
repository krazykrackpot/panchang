/**
 * One-shot exploratory script: generate N seeded random charts and report
 * the firing frequency of every yoga id. Used to calibrate the bounds in
 * src/lib/kundali/__tests__/yoga-frequency-calibration.test.ts.
 *
 * Run: npx tsx scripts/probe-yoga-freq.ts [N] [seed]
 */
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { mulberry32, randomChart } from '@/lib/kundali/__tests__/yoga-test-helpers';

const N = Number(process.argv[2] ?? 200);
const SEED = Number(process.argv[3] ?? 42);

// CLI input validation — silent NaN propagates into an empty table and
// `Infinityms each` perf print, which doesn't fail but is misleading.
// (Gemini PR #325 cycle-1 MED.)
if (!Number.isFinite(N) || N <= 0 || !Number.isInteger(N)) {
  console.error(`Usage: npx tsx scripts/probe-yoga-freq.ts [N] [seed]`);
  console.error(`N must be a positive integer (got: ${process.argv[2]})`);
  process.exit(1);
}
if (!Number.isFinite(SEED)) {
  console.error(`Usage: npx tsx scripts/probe-yoga-freq.ts [N] [seed]`);
  console.error(`Seed must be a finite number (got: ${process.argv[3]})`);
  process.exit(1);
}

const rand = mulberry32(SEED);
const counts = new Map<string, number>();
const t0 = Date.now();
let ok = 0;
let failed = 0;

for (let i = 0; i < N; i++) {
  const bd = randomChart(rand, i);
  try {
    const k = generateKundali(bd);
    ok++;
    for (const y of k.yogasComplete) {
      if (y.present) counts.set(y.id, (counts.get(y.id) ?? 0) + 1);
    }
  } catch (err) {
    // Log each failure so engine regressions are diagnosable. Without
    // this, the run silently increments `failed` and prints a slightly-
    // undersized table with no clue why. (Gemini PR #325 cycle-2 MED.)
    failed++;
    console.error(`Failed to generate chart ${i} (lat=${bd.lat.toFixed(2)}, lng=${bd.lng.toFixed(2)}, date=${bd.date}):`, err);
  }
}

// Exit early if every chart failed — otherwise the elapsed-per-chart math
// below produces `Infinity`/`NaN` and the empty frequency table looks like
// a healthy probe with simply no findings. (Gemini PR #325 cycle-1 MED.)
if (ok === 0) {
  console.error(`All ${failed} chart generations failed — check the kundali-calc engine.`);
  process.exit(1);
}

const elapsed = Date.now() - t0;
console.log(`Generated ${ok} charts (${failed} failed) in ${elapsed}ms (${(elapsed / ok).toFixed(1)}ms each)`);
console.log(`Seed: ${SEED}\n`);

const rows = [...counts.entries()]
  .map(([id, n]) => ({ id, n, pct: (n / ok) * 100 }))
  .sort((a, b) => b.pct - a.pct);

console.log('id'.padEnd(32) + 'count'.padStart(8) + '   freq');
console.log('-'.repeat(50));
for (const r of rows) {
  console.log(r.id.padEnd(32) + String(r.n).padStart(8) + `   ${r.pct.toFixed(1).padStart(5)}%`);
}

/**
 * One-shot exploratory script: generate N seeded random charts and report
 * the firing frequency of every yoga id. Used to calibrate the bounds in
 * src/lib/kundali/__tests__/yoga-frequency-calibration.test.ts.
 *
 * Run: npx tsx scripts/probe-yoga-freq.ts [N] [seed]
 */
import { generateKundali } from '@/lib/ephem/kundali-calc';
import type { BirthData } from '@/types/panchang';

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomChart(rand: () => number, i: number): BirthData {
  const year = 1950 + Math.floor(rand() * 70);
  const month = 1 + Math.floor(rand() * 12);
  const day = 1 + Math.floor(rand() * 28);
  const hour = Math.floor(rand() * 24);
  const minute = Math.floor(rand() * 60);
  // Inhabited latitude band — skip polar where ascendant math degenerates.
  const lat = -55 + rand() * 110;
  const lng = -180 + rand() * 360;
  return {
    name: `Chart ${i}`,
    date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    time: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    place: `Random ${i}`,
    lat,
    lng,
    timezone: 'UTC',
    ayanamsha: 'lahiri',
  };
}

const N = Number(process.argv[2] ?? 200);
const SEED = Number(process.argv[3] ?? 42);

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
  } catch {
    failed++;
  }
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

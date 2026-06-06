/**
 * Measurement spike — answers the open questions data-first.
 *
 * Reports for choghadiya:
 *   1. Compute time per (date, city) tuple (single-thread baseline)
 *   2. Storage size per Blob (median, p95)
 *   3. Projected catalog size for N cities × M days
 *
 * Run:
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/measure.ts
 */

import { performance } from 'node:perf_hooks';
import { precomputeChoghadiya } from './choghadiya';
import { InMemoryStorage, __setStorageForTests } from '@/lib/precompute/storage';
import { CITIES } from '@/lib/constants/cities';

const TOP_CITIES = [
  'delhi', 'mumbai', 'bangalore', 'kolkata', 'chennai',
  'hyderabad', 'pune', 'ahmedabad', 'patna', 'lucknow',
];

function median(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function p95(xs: number[]): number {
  const sorted = [...xs].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length * 0.95)] ?? 0;
}

function fmt(n: number): string {
  return n.toFixed(2);
}

async function main(): Promise<void> {
  // Use in-memory so we measure compute + serialize, not fs I/O.
  // (LocalFs adds ~1-3ms per write — separate concern.)
  const mem = new InMemoryStorage();
  __setStorageForTests(mem);

  // ── Pass 1: warm-up + per-tuple timing ─────────────────────────────────────
  console.log('\n=== Pass 1: per-tuple compute time (10 cities × 7 days = 70 tuples) ===');
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(Date.UTC(2026, 5, 7 + i));
    dates.push(d.toISOString().slice(0, 10));
  }

  const tupleTimes: number[] = [];
  const blobSizes: number[] = [];

  for (const date of dates) {
    for (const city of TOP_CITIES) {
      const t0 = performance.now();
      const results = await precomputeChoghadiya({
        dates: [date],
        cities: [city],
        skipIfPresent: false,
      });
      const t1 = performance.now();
      tupleTimes.push(t1 - t0);
      if (results[0]?.bytes) blobSizes.push(results[0].bytes);
    }
  }

  console.log(`  Tuples completed:     ${tupleTimes.length}`);
  console.log(`  Compute time:         median=${fmt(median(tupleTimes))}ms  p95=${fmt(p95(tupleTimes))}ms`);
  console.log(`  Blob size:            median=${median(blobSizes)}B  p95=${p95(blobSizes)}B`);
  console.log(`  Total bytes written:  ${blobSizes.reduce((a, b) => a + b, 0)}B`);

  // ── Pass 2: catalog projections ────────────────────────────────────────────
  console.log('\n=== Pass 2: projection — what would the catalog look like? ===');

  const medianBytes = median(blobSizes);
  const medianMs = median(tupleTimes);

  // Window scenarios. NOTE: locale is NOT a multiplier for choghadiya — one
  // Blob per (date, city) serves all 9 visible locales. For locale-dependent
  // routes (horoscope predictive text), multiply by 9.
  const scenarios = [
    { name: 'TINY  (top 10 cities × 30d)',    cities: 10,  days: 30,   locales: 1 },
    { name: 'SMALL (top 20 cities × 60d)',    cities: 20,  days: 60,   locales: 1 },
    { name: 'MED   (top 50 cities × 60d)',    cities: 50,  days: 60,   locales: 1 },
    { name: 'MED   (top 50 cities × 90d)',    cities: 50,  days: 90,   locales: 1 },
    { name: 'LARGE (top 50 cities × 365d)',   cities: 50,  days: 365,  locales: 1 },
    { name: 'X     (top 50 × 365 × 9 loc)',   cities: 50,  days: 365,  locales: 9 },
    { name: 'XL    (top 200 cities × 90d)',   cities: 200, days: 90,   locales: 1 },
    { name: 'FULL  (all 59 × 365d)',          cities: 59,  days: 365,  locales: 1 },
  ];

  console.log(`  ${'Scenario'.padEnd(40)} ${'Blobs'.padStart(8)} ${'Size'.padStart(10)} ${'Compute'.padStart(10)}`);
  console.log(`  ${'-'.repeat(75)}`);
  for (const s of scenarios) {
    const blobs = s.cities * s.days * s.locales;
    const sizeMB = (blobs * medianBytes) / (1024 * 1024);
    const computeMin = (blobs * medianMs) / 1000 / 60;
    console.log(
      `  ${s.name.padEnd(40)} ${String(blobs).padStart(8)} ${(fmt(sizeMB) + ' MB').padStart(10)} ${(fmt(computeMin) + ' min').padStart(10)}`,
    );
  }

  // ── Pass 3: locale partitioning sanity ─────────────────────────────────────
  console.log('\n=== Pass 3: which labels actually have all 9 locales in canonical compute? ===');
  // Inspect one slot to see what we're getting.
  mem.store.clear();
  await precomputeChoghadiya({
    dates: ['2026-06-07'],
    cities: ['delhi'],
    skipIfPresent: false,
  });
  const raw = await mem.get('choghadiya/2026-06-07/delhi');
  if (raw) {
    const blob = JSON.parse(raw);
    const first = blob.daySlots?.[0];
    if (first) {
      const present = Object.keys(first.name).sort();
      const expected = ['en', 'hi', 'ta', 'te', 'bn', 'gu', 'kn', 'mai', 'mr'].sort();
      const missing = expected.filter((l) => !present.includes(l));
      console.log(`  Locales present on name: ${present.join(', ')}`);
      console.log(`  Locales MISSING:         ${missing.length === 0 ? '(none)' : missing.join(', ')}`);
      console.log(`  → ${missing.length} locales fall through page-level tl() chain at render time.`);
    }
  }

  console.log(`\n=== Total catalog cardinality (all CITIES in repo): ${CITIES.length} ===\n`);
}

main().catch((err) => {
  console.error('[measure] failed:', err);
  process.exit(1);
});

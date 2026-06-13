/**
 * Panchang-city precompute script.
 *
 * Iterates (date × city) tuples and writes one Blob per tuple.
 * Each Blob holds the FULL computePanchang result + tithi-table
 * enrichment + festival list — the same shape /api/panchang
 * returns on a (date, citySlug) hint. Locale-independent (the
 * inner panchang LocaleText fields carry every locale; consumer
 * resolves via tl() at render time).
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/panchang-city.ts \
 *     --dates 2026-06-13,2026-06-14 \
 *     --cities delhi,mumbai
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/panchang-city.ts --dates ... --cities ...
 *
 * Lesson L gate: all date math via Date.UTC.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { panchangCityKey } from '@/lib/precompute/keys';
import { PanchangCityPageModel } from '@/lib/precompute/schema/panchang-city';
import { buildFreshModel } from '@/lib/precompute/panchang-city-page-model';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  dates: string[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputePanchangCity(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];
  const total = args.dates.length * args.cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const dateStr of args.dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/panchang-city] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    if (
      dateObj.getUTCFullYear() !== y ||
      dateObj.getUTCMonth() !== m - 1 ||
      dateObj.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/panchang-city] out-of-range date: ${dateStr}`);
    }

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        throw new Error(`[precompute/panchang-city] unknown city: ${citySlug}`);
      }

      processed++;
      if (processed % 100 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${dateStr}/${citySlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const data = await buildFreshModel(dateStr, y, m, d, city);
        const result = await setPrecomputed({
          key: panchangCityKey(dateStr, city.slug),
          schema: PanchangCityPageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/panchang-city] FAILED ${dateStr}/${citySlug}:`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  return results;
}

// ─── CLI entrypoint ─────────────────────────────────────────────────────────

const isCliEntrypoint = (() => {
  try {
    return typeof require !== 'undefined' && require.main === module;
  } catch {
    return Boolean(
      process.argv[1] &&
      (process.argv[1].endsWith('panchang-city.ts') || process.argv[1].endsWith('panchang-city.js')),
    );
  }
})();

if (isCliEntrypoint) {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const dates = (get('--dates') ?? '').split(',').filter(Boolean);
  const cities = (get('--cities') ?? '').split(',').filter(Boolean);
  const skipIfPresent = argv.includes('--skip-if-present');

  if (!dates.length || !cities.length) {
    console.error('Usage: tsx scripts/precompute/panchang-city.ts --dates 2026-06-13[,...] --cities delhi[,...]');
    process.exit(1);
  }

  precomputePanchangCity({ dates, cities, skipIfPresent })
    .then((results) => {
      const written = results.filter((r) => r.status === 'written');
      const skipped = results.filter((r) => r.status === 'skipped');
      console.log(`Done. written=${written.length} skipped=${skipped.length} total=${results.length}`);
    })
    .catch((err) => {
      console.error('Fatal:', err);
      process.exit(1);
    });
}

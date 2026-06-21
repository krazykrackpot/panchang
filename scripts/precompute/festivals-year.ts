/**
 * Festivals-year precompute script.
 *
 * One Blob per (year, city) — full FestivalEntry[] for the year at
 * the city's coordinates. Reused across every festival slug for that
 * (year, city) tuple. Trilingual labels baked in; one Blob serves
 * every locale.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/festivals-year.ts \
 *     --years 2026,2027 --cities delhi,mumbai
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/festivals-year.ts --years ... --cities ...
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { festivalsYearKey } from '@/lib/precompute/keys';
import { FestivalsYearPageModel } from '@/lib/precompute/schema/festivals-year';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { trimDescriptionsForBlob } from '@/lib/calendar/festival-blob-helpers';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  years: number[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputeFestivalsYear(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];
  const total = args.years.length * args.cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const year of args.years) {
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      throw new Error(`[precompute/festivals-year] invalid year: ${year}`);
    }

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        throw new Error(`[precompute/festivals-year] unknown city: ${citySlug}`);
      }

      processed++;
      if (processed % 20 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${year}/${citySlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const festivals = generateFestivalCalendarV2(year, city.lat, city.lng, city.timezone);
        // Trim description for festivals with FESTIVAL_DETAILS coverage —
        // ~32% Blob size reduction (~210 KB / 666 KB). Reader rehydrates
        // from FESTIVAL_DETAILS at parse time. See festival-blob-helpers.ts.
        const trimmed = trimDescriptionsForBlob(festivals);
        const data = {
          _v: 1 as const,
          _computedAt: new Date().toISOString(),
          year,
          city: city.slug,
          festivals: trimmed as unknown as Record<string, unknown>[],
        };

        const result = await setPrecomputed({
          key: festivalsYearKey(year, city.slug),
          schema: FestivalsYearPageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/festivals-year] FAILED ${year}/${citySlug}:`,
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
      (process.argv[1].endsWith('festivals-year.ts') || process.argv[1].endsWith('festivals-year.js')),
    );
  }
})();

if (isCliEntrypoint) {
  const argv = process.argv.slice(2);
  const get = (flag: string): string | undefined => {
    const i = argv.indexOf(flag);
    return i >= 0 ? argv[i + 1] : undefined;
  };
  const years = (get('--years') ?? '').split(',').map((s) => parseInt(s.trim(), 10)).filter((y) => Number.isInteger(y));
  const cities = (get('--cities') ?? '').split(',').filter(Boolean);
  const skipIfPresent = argv.includes('--skip-if-present');

  if (!years.length || !cities.length) {
    console.error('Usage: tsx scripts/precompute/festivals-year.ts --years 2026,2027 --cities delhi[,...] [--skip-if-present]');
    process.exit(1);
  }

  precomputeFestivalsYear({ years, cities, skipIfPresent })
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

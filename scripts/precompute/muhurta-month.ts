/**
 * Muhurta-month precompute script.
 *
 * One Blob per (activity, year, month, city). Fans out across the
 * ACTIVITY_SLUGS catalogue × 12 months × the full city catalogue.
 * Trilingual labels baked in.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/muhurta-month.ts \
 *     --years 2026 --cities delhi,mumbai
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/muhurta-month.ts --years ... --cities ...
 *
 * The activity list is derived from ACTIVITY_SLUGS in the page's
 * shared module — drift-proof against future additions.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { muhurtaMonthKey } from '@/lib/precompute/keys';
import { MuhurtaMonthPageModel } from '@/lib/precompute/schema/muhurta-month';
import { buildFreshModel } from '@/lib/precompute/muhurta-month-page-model';
import { getStorage } from '@/lib/precompute/storage';
import { ACTIVITY_SLUGS } from '@/app/[locale]/muhurta/[type]/[year]/[month]/[city]/shared';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  years: number[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputeMuhurtaMonth(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];

  const activityEntries = Object.entries(ACTIVITY_SLUGS);
  const total = args.years.length * 12 * activityEntries.length * args.cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const year of args.years) {
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      throw new Error(`[precompute/muhurta-month] invalid year: ${year}`);
    }

    for (let month = 1; month <= 12; month++) {
      for (const [activitySlug, activityId] of activityEntries) {
        for (const citySlug of args.cities) {
          const city = CITIES.find((c) => c.slug === citySlug);
          if (!city) {
            throw new Error(`[precompute/muhurta-month] unknown city: ${citySlug}`);
          }

          processed++;
          if (processed % 500 === 0 || processed === 1) {
            const elapsedSec = Math.round((Date.now() - t0) / 1000);
            const rate = processed / Math.max(elapsedSec, 1);
            const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
            console.log(`[progress] ${processed}/${total} (${activitySlug}/${year}-${month}/${citySlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
          }

          try {
            const key = muhurtaMonthKey(activitySlug, year, month, city.slug);
            // Existence check BEFORE buildFreshModel — scanDateRangeV2
            // costs 300-500ms per tuple, dwarfing the storage write.
            // Without this short-circuit, --skip-if-present still pays
            // the full 40-60min backfill compute every run.
            // Gemini PR #697 HIGH.
            if (args.skipIfPresent && (await getStorage().exists(key))) {
              results.push({ status: 'skipped', key });
              continue;
            }
            const data = buildFreshModel(activitySlug, activityId, year, month, city);
            const result = await setPrecomputed({
              key,
              schema: MuhurtaMonthPageModel,
              data,
              skipIfPresent: args.skipIfPresent,
            });
            results.push(result);
          } catch (err) {
            console.error(
              `[precompute/muhurta-month] FAILED ${activitySlug}/${year}-${month}/${citySlug}:`,
              err instanceof Error ? err.message : err,
            );
          }
        }
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
      (process.argv[1].endsWith('muhurta-month.ts') || process.argv[1].endsWith('muhurta-month.js')),
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
    console.error('Usage: tsx scripts/precompute/muhurta-month.ts --years 2026 --cities delhi[,...] [--skip-if-present]');
    process.exit(1);
  }

  precomputeMuhurtaMonth({ years, cities, skipIfPresent })
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

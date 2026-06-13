/**
 * Daily article precompute script.
 *
 * One Blob per (date, city) — bundles generateDailyArticle output +
 * the 12-rashi horoscope grid. Trilingual labels baked in; one Blob
 * per tuple serves every locale.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/daily-article.ts \
 *     --dates 2026-06-13,2026-06-14 \
 *     --cities delhi,mumbai
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/daily-article.ts --dates ... --cities ...
 *
 * Lesson L gate: explicit UTC.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { dailyArticleKey } from '@/lib/precompute/keys';
import { DailyArticlePageModel } from '@/lib/precompute/schema/daily-article';
import { buildFreshModel } from '@/lib/precompute/daily-article-page-model';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  dates: string[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputeDailyArticle(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];
  const total = args.dates.length * args.cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const dateStr of args.dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/daily-article] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const parsedDate = new Date(Date.UTC(y, m - 1, d));
    if (
      parsedDate.getUTCFullYear() !== y ||
      parsedDate.getUTCMonth() !== m - 1 ||
      parsedDate.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/daily-article] out-of-range date: ${dateStr}`);
    }

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        throw new Error(`[precompute/daily-article] unknown city: ${citySlug}`);
      }

      processed++;
      if (processed % 100 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${dateStr}/${citySlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const data = buildFreshModel(dateStr, parsedDate, city);
        const result = await setPrecomputed({
          key: dailyArticleKey(dateStr, city.slug),
          schema: DailyArticlePageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/daily-article] FAILED ${dateStr}/${citySlug}:`,
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
      (process.argv[1].endsWith('daily-article.ts') || process.argv[1].endsWith('daily-article.js')),
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
    console.error('Usage: tsx scripts/precompute/daily-article.ts --dates 2026-06-13[,...] --cities delhi[,...]');
    process.exit(1);
  }

  precomputeDailyArticle({ dates, cities, skipIfPresent })
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

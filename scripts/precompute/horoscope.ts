/**
 * Horoscope precompute script.
 *
 * Iterates (rashi, date) tuples and writes one JSON Blob per tuple
 * containing the locale-keyed page model. Locale is NOT in the key —
 * the engine output's LocaleText fields carry all 9 visible locales
 * baked in, so one Blob serves every locale.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/horoscope.ts \
 *     --dates 2026-06-11 --rashis mesh,vrishabh
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/horoscope.ts --dates ... --rashis ...
 *
 * Lesson L gate: all date math goes through Date.UTC.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { horoscopeKey } from '@/lib/precompute/keys';
import { HoroscopePageModel } from '@/lib/precompute/schema/horoscope';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { RASHIS } from '@/lib/constants/rashis';

interface RunArgs {
  dates: string[];
  rashis: string[];
  skipIfPresent: boolean;
}

export async function precomputeHoroscope(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];
  // Pre-index rashis by slug so the inner loop is O(1) per lookup
  // instead of O(N=12) per (date, rashi) tuple.
  const rashiMap = new Map(RASHIS.map((r) => [r.slug, r]));
  const total = args.dates.length * args.rashis.length;
  let processed = 0;
  const t0 = Date.now();

  for (const dateStr of args.dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/horoscope] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    if (
      dateObj.getUTCFullYear() !== y ||
      dateObj.getUTCMonth() !== m - 1 ||
      dateObj.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/horoscope] out-of-range date: ${dateStr}`);
    }

    for (const rashiSlug of args.rashis) {
      const rashi = rashiMap.get(rashiSlug);
      if (!rashi) {
        throw new Error(`[precompute/horoscope] unknown rashi: ${rashiSlug}`);
      }

      processed++;
      if (processed % 100 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${dateStr}/${rashiSlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const h = generateDailyHoroscope({ moonSign: rashi.id, date: dateStr });

        const data = {
          _v: 1 as const,
          _computedAt: new Date().toISOString(),
          date: h.date,
          moonSign: h.moonSign,
          moonSignName: h.moonSignName,
          overallScore: h.overallScore,
          areas: h.areas,
          insight: h.insight,
          luckyColor: h.luckyColor,
          luckyNumber: h.luckyNumber,
          luckyTime: h.luckyTime,
          luckyDirection: h.luckyDirection,
          transitSummary: h.transitSummary,
          compatibility: h.compatibility,
          remedy: h.remedy,
          dosAndDonts: h.dosAndDonts,
        };

        const result = await setPrecomputed({
          key: horoscopeKey(rashiSlug, dateStr),
          schema: HoroscopePageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/horoscope] FAILED ${dateStr}/${rashiSlug}:`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  return results;
}

const isCliEntrypoint = (() => {
  try {
    return typeof require !== 'undefined' && require.main === module;
  } catch {
    return Boolean(
      process.argv[1] &&
      (process.argv[1].endsWith('horoscope.ts') || process.argv[1].endsWith('horoscope.js')),
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
  const rashis = (get('--rashis') ?? '').split(',').filter(Boolean);
  const skipIfPresent = argv.includes('--skip-if-present');

  if (!dates.length || !rashis.length) {
    console.error('Usage: tsx scripts/precompute/horoscope.ts --dates 2026-06-11[,...] --rashis mesh[,...]');
    process.exit(1);
  }

  const expected = dates.length * rashis.length;
  precomputeHoroscope({ dates, rashis, skipIfPresent })
    .then((results) => {
      const written = results.filter((r) => r.status === 'written');
      const skipped = results.filter((r) => r.status === 'skipped');
      const totalBytes = written.reduce((acc, r) => acc + (r.bytes ?? 0), 0);
      console.log(
        `[precompute/horoscope] written=${written.length} skipped=${skipped.length} totalBytes=${totalBytes}`,
      );
      // results.length only counts tuples that succeeded through the
      // per-tuple try/catch — failures are logged and dropped on the
      // floor so the backfill drains. But CI/cron needs the partial-
      // failure signal so we exit non-zero when any tuple fell short.
      // Job still ran to completion (resumability preserved); just
      // surfaces the partial failure for ops to investigate.
      // Gemini PR #664 HIGH.
      if (results.length < expected) {
        console.error(
          `[precompute/horoscope] partial failure: ${results.length}/${expected} succeeded — see [precompute/horoscope] FAILED lines above`,
        );
        process.exit(1);
      }
    })
    .catch((err) => {
      console.error('[precompute/horoscope] failed:', err);
      process.exit(1);
    });
}

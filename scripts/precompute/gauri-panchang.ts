/**
 * Gauri Panchang precompute script.
 *
 * Sibling to scripts/precompute/choghadiya.ts. Iterates (date, city)
 * tuples and writes one JSON Blob per tuple containing the page model
 * (locale-keyed slot labels). Locale is intentionally NOT part of the
 * key — the slot labels are LocaleText objects so one Blob serves all
 * 9 visible locales.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/gauri-panchang.ts \
 *     --dates 2026-06-11 --cities chennai,delhi
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/gauri-panchang.ts --dates ... --cities ...
 *
 * Lesson L gate: all date math goes through Date.UTC.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { gauriPanchangKey } from '@/lib/precompute/keys';
import { GauriPanchangPageModel } from '@/lib/precompute/schema/gauri-panchang';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  dates: string[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputeGauriPanchang(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];
  const total = args.dates.length * args.cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const dateStr of args.dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/gauri-panchang] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    if (
      dateObj.getUTCFullYear() !== y ||
      dateObj.getUTCMonth() !== m - 1 ||
      dateObj.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/gauri-panchang] out-of-range date: ${dateStr}`);
    }
    const weekday = dateObj.getUTCDay();

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        throw new Error(`[precompute/gauri-panchang] unknown city: ${citySlug}`);
      }

      processed++;
      if (processed % 100 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${dateStr}/${citySlug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const tzOffset = getUTCOffsetForDate(y, m, d, city.timezone);
        const panchang = computePanchang({
          year: y,
          month: m,
          day: d,
          lat: city.lat,
          lng: city.lng,
          tzOffset,
          timezone: city.timezone,
        });

        if (!panchang.gauriPanchang) {
          console.warn(`[precompute/gauri-panchang] skip ${dateStr}/${citySlug}: no gauriPanchang`);
          continue;
        }

        const daySlots = panchang.gauriPanchang
          .filter((s) => s.period === 'day')
          .map((s) => ({
            name: s.name,
            type: String(s.type ?? ''),
            nature: String(s.nature ?? ''),
            startTime: s.startTime,
            endTime: s.endTime,
          }));
        const nightSlots = panchang.gauriPanchang
          .filter((s) => s.period === 'night')
          .map((s) => ({
            name: s.name,
            type: String(s.type ?? ''),
            nature: String(s.nature ?? ''),
            startTime: s.startTime,
            endTime: s.endTime,
          }));

        const data = {
          _v: 1 as const,
          _computedAt: new Date().toISOString(),
          date: dateStr,
          city: citySlug,
          weekday,
          tithiNumber: panchang.tithi?.number ?? 0,
          daySlots,
          nightSlots,
        };

        const result = await setPrecomputed({
          key: gauriPanchangKey(dateStr, citySlug),
          schema: GauriPanchangPageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/gauri-panchang] FAILED ${dateStr}/${citySlug}:`,
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
      (process.argv[1].endsWith('gauri-panchang.ts') || process.argv[1].endsWith('gauri-panchang.js')),
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
    console.error('Usage: tsx scripts/precompute/gauri-panchang.ts --dates 2026-06-11[,...] --cities chennai[,...]');
    process.exit(1);
  }

  precomputeGauriPanchang({ dates, cities, skipIfPresent })
    .then((results) => {
      const written = results.filter((r) => r.status === 'written');
      const skipped = results.filter((r) => r.status === 'skipped');
      const totalBytes = written.reduce((acc, r) => acc + (r.bytes ?? 0), 0);
      console.log(
        `[precompute/gauri-panchang] written=${written.length} skipped=${skipped.length} totalBytes=${totalBytes}`,
      );
    })
    .catch((err) => {
      console.error('[precompute/gauri-panchang] failed:', err);
      process.exit(1);
    });
}

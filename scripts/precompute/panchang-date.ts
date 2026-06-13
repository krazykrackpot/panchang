/**
 * Panchang-date precompute script.
 *
 * Iterates (date × seo-city) tuples and writes one JSON Blob per
 * tuple. The 9 visible locales map to 9 distinct SEO cities via
 * SEO_CITY_BY_LOCALE; each Blob carries all 10-locale LocaleText
 * fields, so `tl(field, locale)` at render time picks the right script.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/panchang-date.ts \
 *     --dates 2026-06-13,2026-06-14
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/panchang-date.ts --dates ...
 *
 * Lesson L gate: all date math via Date.UTC.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { panchangDateKey } from '@/lib/precompute/keys';
import { PanchangDatePageModel } from '@/lib/precompute/schema/panchang-date';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES, SEO_CITY_BY_LOCALE } from '@/lib/constants/cities';

interface RunArgs {
  dates: string[];
  skipIfPresent: boolean;
}

export async function precomputePanchangDate(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];

  // generateFestivalCalendarV2 builds the FULL yearly tithi table
  // internally — running it per (date, city) means we redo a 365-day
  // computation for every tuple. Cache by (year, city.slug) so the
  // 60-day window collapses from 60 × 9 = 540 calls to at most 18
  // (and typically 9 when the window stays inside one calendar year).
  // Gemini PR #693 catch.
  const festivalCache = new Map<string, ReturnType<typeof generateFestivalCalendarV2>>();

  // SEO cities — derived from the SEO_CITY_BY_LOCALE map. Each locale
  // maps to one city; the unique-city set is bounded at ~9 (one per
  // visible locale). We use Set/Array.from to dedupe.
  const citySlugs = Array.from(new Set(Object.values(SEO_CITY_BY_LOCALE)));
  const cities = citySlugs
    .map((slug) => CITIES.find((c) => c.slug === slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c));
  if (cities.length === 0) {
    throw new Error('[precompute/panchang-date] no SEO cities resolved — check SEO_CITY_BY_LOCALE vs CITIES');
  }

  const total = args.dates.length * cities.length;
  let processed = 0;
  const t0 = Date.now();

  for (const dateStr of args.dates) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/panchang-date] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    if (
      dateObj.getUTCFullYear() !== y ||
      dateObj.getUTCMonth() !== m - 1 ||
      dateObj.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/panchang-date] out-of-range date: ${dateStr}`);
    }
    const weekday = dateObj.getUTCDay();

    // Per-year festival list is reused across cities of the SAME
    // (lat,lng,timezone). The SEO cities span multiple timezones so
    // we don't optimise that here — re-derive per tuple. The festival
    // generator is fast enough that the cost is negligible vs
    // computePanchang.
    for (const city of cities) {
      processed++;
      if (processed % 50 === 0 || processed === 1) {
        const elapsedSec = Math.round((Date.now() - t0) / 1000);
        const rate = processed / Math.max(elapsedSec, 1);
        const etaSec = Math.round((total - processed) / Math.max(rate, 0.01));
        console.log(`[progress] ${processed}/${total} (${dateStr}/${city.slug}) elapsed=${elapsedSec}s rate=${rate.toFixed(2)}/s eta=${etaSec}s`);
      }

      try {
        const tzOffset = getUTCOffsetForDate(y, m, d, city.timezone);
        const panchang = computePanchang({
          year: y, month: m, day: d,
          lat: city.lat, lng: city.lng,
          tzOffset, timezone: city.timezone,
          locationName: city.name.en,
        });

        let festivalToday: { name: typeof panchang.tithi.name; slug: string } | null = null;
        try {
          const cacheKey = `${y}/${city.slug}`;
          let fests = festivalCache.get(cacheKey);
          if (!fests) {
            fests = generateFestivalCalendarV2(y, city.lat, city.lng, city.timezone);
            festivalCache.set(cacheKey, fests);
          }
          const hit = fests.find((f) => f.date === dateStr);
          if (hit) festivalToday = { name: hit.name, slug: hit.slug ?? '' };
        } catch (err) {
          // Non-fatal — same posture as the page handler.
          console.warn(
            `[precompute/panchang-date] festival lookup ${dateStr}/${city.slug}:`,
            err instanceof Error ? err.message : err,
          );
        }

        const data = {
          _v: 1 as const,
          _computedAt: new Date().toISOString(),
          date: dateStr,
          city: city.slug,
          weekday,
          tithi: { name: panchang.tithi.name, number: panchang.tithi.number },
          nakshatra: { name: panchang.nakshatra.name },
          yoga: panchang.yoga ? { name: panchang.yoga.name } : null,
          karana: panchang.karana ? { name: panchang.karana.name } : null,
          vara: panchang.vara ? { name: panchang.vara.name, day: panchang.vara.day } : null,
          sunrise: panchang.sunrise,
          sunset: panchang.sunset,
          rahuKaal: panchang.rahuKaal ?? null,
          abhijitMuhurta: panchang.abhijitMuhurta
            ? {
                start: panchang.abhijitMuhurta.start,
                end: panchang.abhijitMuhurta.end,
                available: panchang.abhijitMuhurta.available,
              }
            : null,
          festivalToday,
        };

        const result = await setPrecomputed({
          key: panchangDateKey(dateStr, city.slug),
          schema: PanchangDatePageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        console.error(
          `[precompute/panchang-date] FAILED ${dateStr}/${city.slug}:`,
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
      (process.argv[1].endsWith('panchang-date.ts') || process.argv[1].endsWith('panchang-date.js')),
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
  const skipIfPresent = argv.includes('--skip-if-present');

  if (!dates.length) {
    console.error('Usage: tsx scripts/precompute/panchang-date.ts --dates 2026-06-13[,...] [--skip-if-present]');
    process.exit(1);
  }

  precomputePanchangDate({ dates, skipIfPresent })
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

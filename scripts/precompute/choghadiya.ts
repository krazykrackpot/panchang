/**
 * Choghadiya precompute script.
 *
 * Iterates (date, city) tuples and writes one JSON Blob per tuple,
 * containing the page model (trilingual slot labels). Locale is
 * INTENTIONALLY NOT part of the key — the slot labels are locale-keyed
 * objects, so the page resolves at render time via tl(name, locale)
 * and one Blob serves all 9 visible locales.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/choghadiya.ts \
 *     --dates 2026-06-07,2026-06-08 \
 *     --cities delhi,mumbai
 *
 * Usage (CI / GH Action — to be wired in T0.5):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/choghadiya.ts --dates ... --cities ...
 *
 * Lesson L gate: all date math goes through Date.UTC. NEVER use the
 * local-tz `new Date(y, m-1, d)` constructor in this script.
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { choghadiyaKey } from '@/lib/precompute/keys';
import { ChoghadiyaPageModel } from '@/lib/precompute/schema/choghadiya';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { CITIES } from '@/lib/constants/cities';

interface RunArgs {
  dates: string[];
  cities: string[];
  skipIfPresent: boolean;
}

export async function precomputeChoghadiya(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];

  for (const dateStr of args.dates) {
    // Validate before destructuring (cycle-2 finding #2). A bad input like
    // "garbage" otherwise produces NaN tuples; the failure surfaces deep
    // inside the engine with a cryptic stack — particularly painful when
    // running an 8-min backfill that craters on tuple #14,000.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      throw new Error(`[precompute/choghadiya] invalid date format: ${JSON.stringify(dateStr)}`);
    }
    // Lesson L — explicit UTC construction.
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    // Catch out-of-range values that the regex can't reject by shape —
    // e.g. "2026-99-99" passes the regex but Date.UTC silently overflows
    // to a wildly different date (Sept 2034 in that case), which would
    // produce a Blob with the original date label but wrong astro data.
    if (
      dateObj.getUTCFullYear() !== y ||
      dateObj.getUTCMonth() !== m - 1 ||
      dateObj.getUTCDate() !== d
    ) {
      throw new Error(`[precompute/choghadiya] out-of-range date: ${dateStr}`);
    }
    const weekday = dateObj.getUTCDay(); // 0=Sun..6=Sat (Lesson O)

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        // Unknown-city is a config error — fail loud BEFORE the loop body.
        // (Won't crater mid-backfill the way a per-tuple compute error
        // might — the city list is fixed once per invocation.)
        throw new Error(`[precompute/choghadiya] unknown city: ${citySlug}`);
      }

      // Per-tuple isolation (cycle-2 finding #3). Without this, a single
      // failure deep in the batch — extreme timezone, engine NaN, transient
      // Blob write error — kills the entire run. With it, the failed
      // tuple is logged and skipped; restart-with-skipIfPresent picks up
      // exactly where the last successful tuple left off (closes the
      // backfill-resumability story end-to-end).
      try {
        const tzOffset = getUTCOffsetForDate(y, m - 1 + 1, d, city.timezone);
        const panchang = computePanchang({
          year: y,
          month: m,
          day: d,
          lat: city.lat,
          lng: city.lng,
          tzOffset,
          timezone: city.timezone,
        });

        if (!panchang.choghadiya) {
          // Engine couldn't compute (extreme polar lat etc). Skip rather
          // than write an empty page model.
          console.warn(`[precompute/choghadiya] skip ${dateStr}/${citySlug}: no choghadiya`);
          continue;
        }

        // Translate canonical compute output → page model.
        // Each slot's `name` is already trilingual on the canonical
        // ChoghadiyaSlot.name (LocaleText) — pass through directly.
        const daySlots = panchang.choghadiya
          .filter((s) => s.period === 'day')
          .map((s) => ({
            name: s.name,
            type: String(s.type ?? ''),
            nature: String(s.nature ?? ''),
            startTime: s.startTime,
            endTime: s.endTime,
          }));
        const nightSlots = panchang.choghadiya
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
          daySlots,
          nightSlots,
        };

        const result = await setPrecomputed({
          key: choghadiyaKey(dateStr, citySlug),
          schema: ChoghadiyaPageModel,
          data,
          skipIfPresent: args.skipIfPresent,
        });
        results.push(result);
      } catch (err) {
        // Don't rethrow — backfill must drain. Log enough that ops can
        // grep for failures and re-run the script (skipIfPresent will
        // resume past the succeeded tuples).
        console.error(
          `[precompute/choghadiya] FAILED ${dateStr}/${citySlug}:`,
          err instanceof Error ? err.message : err,
        );
      }
    }
  }

  return results;
}

// ─── CLI entrypoint ─────────────────────────────────────────────────────────
//
// ESM-safe is-main check (Gemini #470 finding #1). `require.main` is
// undefined in ESM and would throw ReferenceError on import. We fall
// back to inspecting process.argv[1] — works in both runtimes:
//   - CJS (tsx default for now):   require.main === module
//   - ESM (future migration):       process.argv[1] ends with this file
const isCliEntrypoint = (() => {
  try {
    return typeof require !== 'undefined' && require.main === module;
  } catch {
    // ReferenceError in strict ESM environments.
    return Boolean(
      process.argv[1] &&
      (process.argv[1].endsWith('choghadiya.ts') || process.argv[1].endsWith('choghadiya.js')),
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
    console.error('Usage: tsx scripts/precompute/choghadiya.ts --dates 2026-06-07[,...] --cities delhi[,...]');
    process.exit(1);
  }

  precomputeChoghadiya({ dates, cities, skipIfPresent })
    .then((results) => {
      const written = results.filter((r) => r.status === 'written');
      const skipped = results.filter((r) => r.status === 'skipped');
      const totalBytes = written.reduce((acc, r) => acc + (r.bytes ?? 0), 0);
      console.log(
        `[precompute/choghadiya] written=${written.length} skipped=${skipped.length} totalBytes=${totalBytes}`,
      );
    })
    .catch((err) => {
      console.error('[precompute/choghadiya] failed:', err);
      process.exit(1);
    });
}

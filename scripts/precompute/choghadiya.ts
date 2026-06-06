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
    // Lesson L — explicit UTC construction.
    const [y, m, d] = dateStr.split('-').map(Number);
    const dateObj = new Date(Date.UTC(y, m - 1, d));
    const weekday = dateObj.getUTCDay(); // 0=Sun..6=Sat (Lesson O)

    for (const citySlug of args.cities) {
      const city = CITIES.find((c) => c.slug === citySlug);
      if (!city) {
        throw new Error(`[precompute/choghadiya] unknown city: ${citySlug}`);
      }

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
          nature: String(s.nature ?? ''),
          startTime: s.startTime,
          endTime: s.endTime,
        }));
      const nightSlots = panchang.choghadiya
        .filter((s) => s.period === 'night')
        .map((s) => ({
          name: s.name,
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
    }
  }

  return results;
}

// ─── CLI entrypoint ─────────────────────────────────────────────────────────

if (require.main === module) {
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

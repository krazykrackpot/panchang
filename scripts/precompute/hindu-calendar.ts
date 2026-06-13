/**
 * Hindu calendar precompute script.
 *
 * One Blob per year — generateFestivalCalendarV2 against Ujjain
 * coordinates. Trilingual labels baked into each festival entry,
 * so one Blob per year covers all 9 visible locales.
 *
 * Usage (laptop dev):
 *   PRECOMPUTE_STORAGE=local npx tsx scripts/precompute/hindu-calendar.ts \
 *     --years 2026,2027
 *
 * Usage (CI / GH Action):
 *   PRECOMPUTE_STORAGE=blob BLOB_READ_WRITE_TOKEN=... \
 *     npx tsx scripts/precompute/hindu-calendar.ts --years 2026,2027
 */

import { setPrecomputed, type SetPrecomputedResult } from '@/lib/precompute/writer';
import { hinduCalendarKey } from '@/lib/precompute/keys';
import { HinduCalendarPageModel } from '@/lib/precompute/schema/hindu-calendar';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

interface RunArgs {
  years: number[];
  skipIfPresent: boolean;
}

export async function precomputeHinduCalendar(args: RunArgs): Promise<SetPrecomputedResult[]> {
  const results: SetPrecomputedResult[] = [];

  for (const year of args.years) {
    if (!Number.isInteger(year) || year < 1900 || year > 2200) {
      throw new Error(`[precompute/hindu-calendar] invalid year: ${year}`);
    }

    try {
      const festivals = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);
      const data = {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        year,
        festivals: festivals as unknown as Record<string, unknown>[],
      };

      const result = await setPrecomputed({
        key: hinduCalendarKey(year),
        schema: HinduCalendarPageModel,
        data,
        skipIfPresent: args.skipIfPresent,
      });
      results.push(result);
      console.log(`[precompute/hindu-calendar] ${year}: ${result.status} (${festivals.length} festivals)`);
    } catch (err) {
      console.error(
        `[precompute/hindu-calendar] FAILED ${year}:`,
        err instanceof Error ? err.message : err,
      );
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
      (process.argv[1].endsWith('hindu-calendar.ts') || process.argv[1].endsWith('hindu-calendar.js')),
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
  const skipIfPresent = argv.includes('--skip-if-present');

  if (!years.length) {
    console.error('Usage: tsx scripts/precompute/hindu-calendar.ts --years 2026,2027 [--skip-if-present]');
    process.exit(1);
  }

  precomputeHinduCalendar({ years, skipIfPresent })
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

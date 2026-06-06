/**
 * Page-handler entry point for /choghadiya/[date].
 *
 * Wraps `getPrecomputed` with the canonical compute as the fallback.
 * Returns the page-shaped model the route consumes directly — no
 * post-fetch translation in the route.
 *
 * Behaviour under all four flag/storage states:
 *
 *   PRECOMPUTE_FETCH_ENABLED  Blob present  →  Behaviour
 *   ────────────────────────  ────────────     ─────────────────────────
 *   false (kill switch off)   N/A           →  Always live-compute
 *   true                      no            →  Live-compute (fallback)
 *   true                      yes, valid    →  Read from Blob
 *   true                      yes, stale/   →  Live-compute (fallback)
 *                              schema-bad
 *
 * Output is byte-identical across all four states. The flag determines
 * cost shape, not user-visible content.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { choghadiyaKey } from './keys';
import {
  ChoghadiyaPageModel,
  type ChoghadiyaPageModel as ChoghadiyaPageModelT,
} from './schema/choghadiya';

interface Args {
  /** YYYY-MM-DD — must be pre-validated by the route. */
  date: string;
  /** Resolved city from getSeoCityForLocale(). */
  city: CityData;
}

export async function getChoghadiyaPageModel(args: Args): Promise<ChoghadiyaPageModelT> {
  const { date: dateStr, city } = args;
  const [y, m, d] = dateStr.split('-').map(Number);

  return await getPrecomputed({
    key: choghadiyaKey(dateStr, city.slug),
    schema: ChoghadiyaPageModel,
    fallback: async () => {
      // Live compute path — identical math to what page used to inline.
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
      const weekday = panchang.vara?.day ?? new Date(Date.UTC(y, m - 1, d)).getUTCDay();

      const daySlots = (panchang.choghadiya ?? [])
        .filter((s) => s.period === 'day')
        .map((s) => ({
          name: s.name,
          type: String(s.type ?? ''),
          nature: String(s.nature ?? ''),
          startTime: s.startTime,
          endTime: s.endTime,
        }));
      const nightSlots = (panchang.choghadiya ?? [])
        .filter((s) => s.period === 'night')
        .map((s) => ({
          name: s.name,
          type: String(s.type ?? ''),
          nature: String(s.nature ?? ''),
          startTime: s.startTime,
          endTime: s.endTime,
        }));

      return {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        date: dateStr,
        city: city.slug,
        weekday,
        daySlots,
        nightSlots,
      };
    },
  });
}

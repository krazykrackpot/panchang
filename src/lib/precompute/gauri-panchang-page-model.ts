/**
 * Page-handler entry point for /gauri-panchang/[date].
 *
 * Mirrors the choghadiya page-model loader. Wraps `getPrecomputed` with
 * the canonical compute as the fallback, returns the page-shaped model
 * directly — no post-fetch translation in the route. Behaviour under
 * all four flag/storage states matches the choghadiya loader so the
 * route layer is identical.
 *
 * Output is byte-identical across all four states (kill-switch off,
 * Blob missing, Blob stale, Blob valid). The flag determines cost shape,
 * not user-visible content.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { gauriPanchangKey } from './keys';
import {
  GauriPanchangPageModel,
  type GauriPanchangPageModel as GauriPanchangPageModelT,
  type GauriSlot,
} from './schema/gauri-panchang';

interface Args {
  /** YYYY-MM-DD — pre-validated by the route. */
  date: string;
  /** Resolved city from getSeoCityForLocale(). */
  city: CityData;
}

export async function getGauriPanchangPageModel(args: Args): Promise<GauriPanchangPageModelT> {
  const { date: dateStr, city } = args;
  const [y, m, d] = dateStr.split('-').map(Number);

  return await getPrecomputed({
    key: gauriPanchangKey(dateStr, city.slug),
    schema: GauriPanchangPageModel,
    fallback: async () => {
      // Live compute path — identical to what the page used to inline.
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
      const tithiNumber = panchang.tithi?.number ?? 0;

      const toSlot = (s: NonNullable<typeof panchang.gauriPanchang>[number]): GauriSlot => ({
        name: s.name,
        type: String(s.type ?? ''),
        nature: String(s.nature ?? ''),
        startTime: s.startTime,
        endTime: s.endTime,
      });

      const daySlots = (panchang.gauriPanchang ?? [])
        .filter((s) => s.period === 'day')
        .map(toSlot);
      const nightSlots = (panchang.gauriPanchang ?? [])
        .filter((s) => s.period === 'night')
        .map(toSlot);

      return {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        date: dateStr,
        city: city.slug,
        weekday,
        tithiNumber,
        daySlots,
        nightSlots,
      };
    },
  });
}

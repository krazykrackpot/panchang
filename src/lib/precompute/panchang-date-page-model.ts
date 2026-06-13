/**
 * Page-handler entry point for /[locale]/panchang/date/[date].
 *
 * Sibling to choghadiya/gauri-panchang/horoscope page-model loaders.
 * Wraps `getPrecomputed` with the canonical compute as fallback.
 *
 * Behaviour under all four flag/storage states matches the rest of the
 * precompute readers — output is byte-identical (modulo `_computedAt`)
 * across kill-switch-off / cold-cache / hot-blob / schema-invalid.
 */

import { computePanchang } from '@/lib/ephem/panchang-calc';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { panchangDateKey } from './keys';
import {
  PanchangDatePageModel,
  type PanchangDatePageModel as PanchangDatePageModelT,
} from './schema/panchang-date';

interface Args {
  /** YYYY-MM-DD — must be pre-validated by the route. */
  date: string;
  /** Resolved SEO city for this locale via getSeoCityForLocale(). */
  city: CityData;
}

export async function getPanchangDatePageModel(args: Args): Promise<PanchangDatePageModelT> {
  const { date: dateStr, city } = args;
  const [y, m, d] = dateStr.split('-').map(Number);

  return await getPrecomputed({
    key: panchangDateKey(dateStr, city.slug),
    schema: PanchangDatePageModel,
    fallback: async () => {
      // Live compute path — identical math to what the route inlines.
      // Lesson L: explicit UTC for weekday derivation.
      const tzOffset = getUTCOffsetForDate(y, m, d, city.timezone);
      const panchang = computePanchang({
        year: y, month: m, day: d,
        lat: city.lat, lng: city.lng,
        tzOffset, timezone: city.timezone,
        locationName: city.name.en,
      });
      const weekday = panchang.vara?.day ?? new Date(Date.UTC(y, m - 1, d)).getUTCDay();

      // Festival match via `.amanta` (handled inside generator) — same
      // single source of truth the page used to inline. Lesson ZC.
      let festivalToday: PanchangDatePageModelT['festivalToday'] = null;
      try {
        const fests = generateFestivalCalendarV2(y, city.lat, city.lng, city.timezone);
        const hit = fests.find((f) => f.date === dateStr);
        if (hit) {
          festivalToday = { name: hit.name, slug: hit.slug ?? '' };
        }
      } catch (err) {
        // Non-fatal — festival enrichment failure shouldn't drop the
        // panchang answer. Caller renders without the festival row.
        console.error('[precompute/panchang-date] festival lookup failed:', err);
      }

      return {
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
    },
  });
}

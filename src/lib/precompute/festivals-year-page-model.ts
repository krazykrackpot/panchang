/**
 * Page-handler entry point for /[locale]/festivals/[slug]/[year]/[city].
 *
 * Single generateFestivalCalendarV2 call wrapped in getPrecomputed,
 * keyed by (year, citySlug). Page consumer does .find(slug === ...)
 * + sunrise/sunset compute at render time.
 */

import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { festivalsYearKey } from './keys';
import {
  FestivalsYearPageModel,
  type FestivalsYearPageModel as FestivalsYearPageModelT,
} from './schema/festivals-year';

interface Args {
  year: number;
  city: CityData;
}

export async function getFestivalsYearPageModel(args: Args): Promise<FestivalsYearPageModelT> {
  const { year, city } = args;

  return await getPrecomputed({
    key: festivalsYearKey(year, city.slug),
    schema: FestivalsYearPageModel,
    fallback: async () => {
      const festivals = generateFestivalCalendarV2(year, city.lat, city.lng, city.timezone);
      return {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        year,
        city: city.slug,
        festivals: festivals as unknown as Record<string, unknown>[],
      };
    },
  });
}

/** Cast the opaque inner festivals back to the canonical type for
 *  type-safe field access by the page. */
export function asFestivalEntries(festivals: Record<string, unknown>[]): FestivalEntry[] {
  return festivals as unknown as FestivalEntry[];
}

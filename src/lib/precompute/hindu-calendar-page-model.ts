/**
 * Page-handler entry point for /[locale]/hindu-calendar/[year].
 *
 * Single generateFestivalCalendarV2 call wrapped in getPrecomputed.
 * Festivals are computed against Ujjain coordinates regardless of
 * locale — the page rules. One Blob per year serves every locale.
 */

import { generateFestivalCalendarV2, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { getPrecomputed } from './reader';
import { hinduCalendarKey } from './keys';
import {
  HinduCalendarPageModel,
  type HinduCalendarPageModel as HinduCalendarPageModelT,
} from './schema/hindu-calendar';

/** Ujjain — Mahakaleshwar Jyotirlinga, the page's canonical anchor
 *  for festival computation. Constants mirror page.tsx. */
const UJJAIN_LAT = 23.1765;
const UJJAIN_LNG = 75.7885;
const UJJAIN_TZ = 'Asia/Kolkata';

interface Args {
  year: number;
}

export async function getHinduCalendarPageModel(args: Args): Promise<HinduCalendarPageModelT> {
  const { year } = args;

  return await getPrecomputed({
    key: hinduCalendarKey(year),
    schema: HinduCalendarPageModel,
    fallback: async () => {
      const festivals = generateFestivalCalendarV2(year, UJJAIN_LAT, UJJAIN_LNG, UJJAIN_TZ);
      return {
        _v: 1 as const,
        _computedAt: new Date().toISOString(),
        year,
        festivals: festivals as unknown as Record<string, unknown>[],
      };
    },
  });
}

/** Casts the opaque inner festivals back to the canonical type for
 *  callers that want type-safe field access. The Blob always carries
 *  the engine's FestivalEntry shape; opaque storage was a Zod
 *  maintainability choice, not a data model change. */
export function asFestivalEntries(festivals: Record<string, unknown>[]): FestivalEntry[] {
  return festivals as unknown as FestivalEntry[];
}

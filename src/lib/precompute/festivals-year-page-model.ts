/**
 * Page-handler entry point for /[locale]/festivals/[slug]/[year]/[city].
 *
 * Single generateFestivalCalendarV2 call wrapped in getPrecomputed,
 * keyed by (year, citySlug). Page consumer does .find(slug === ...)
 * + sunrise/sunset compute at render time.
 */

import { generateFestivalCalendarV2, computePujaMuhurat, type FestivalEntry } from '@/lib/calendar/festival-generator';
import { rehydrateFestivalDescriptions } from '@/lib/calendar/festival-blob-helpers';
import type { CityData } from '@/lib/constants/cities';
import { UJJAIN_REFERENCE } from '@/lib/constants/jyotish-reference';
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

/** Cast the opaque inner festivals back to the canonical type AND
 *  rehydrate `description` from FESTIVAL_DETAILS — the precompute writer
 *  strips it to save ~32% Blob size (see festival-blob-helpers.ts). */
export function asFestivalEntries(festivals: Record<string, unknown>[]): FestivalEntry[] {
  const typed = festivals as unknown as FestivalEntry[];
  rehydrateFestivalDescriptions(typed);
  return typed;
}

/**
 * Lightweight festival lookup for a specific city + slug.
 *
 * Problem: the old path called getFestivalsYearPageModel({ city }) which,
 * on a Blob miss for non-precomputed cities, ran generateFestivalCalendarV2
 * for the entire year (358 festivals, 90ms/833MB). The festival/city page
 * only needs ONE entry — and just its date, tithi, parana fields, plus a
 * city-specific puja muhurat.
 *
 * Solution: try the city Blob first (works for the 59 precomputed cities).
 * On miss, read Ujjain's Blob (always precomputed — Ujjain is one of 59)
 * to get the festival date and tithi, then call computePujaMuhurat() for the
 * city (~5ms, ~10MB) instead of re-running the full year calendar.
 *
 * Trade-off: for diaspora cities with timezone offsets > 5h from IST, the
 * festival date could differ from Ujjain by ±1 day. We accept this because
 * (a) these pages are noindex, (b) 54K invocations/day at 7s was unsustainable,
 * (c) the puja muhurat times ARE city-specific (computed fresh).
 */

// Module-level Promise cache: stores the in-flight or resolved Blob read for
// Ujjain's festival calendar per year. Caching the Promise (not the resolved
// value) means concurrent requests that all see a cache miss still share ONE
// Blob read — no duplicate fetches. Gemini PR #716 HIGH.
// Bounded: at most 3 entries (years we generate festival pages for).
const _ujjainModelCache = new Map<number, Promise<FestivalsYearPageModelT | undefined>>();

export async function getFestivalForCity(args: {
  year: number;
  city: CityData;
  slug: string;
}): Promise<FestivalEntry | null> {
  const { year, city, slug } = args;

  // Fast path: city has a precomputed Blob (59 CITIES constant entries).
  const cityModel = await getPrecomputed({
    key: festivalsYearKey(year, city.slug),
    schema: FestivalsYearPageModel,
    // Return null on miss instead of live-computing the full year.
    fallback: async () => null as unknown as FestivalsYearPageModelT,
  });
  if (cityModel) {
    return asFestivalEntries(cityModel.festivals).find(f => f.slug === slug) ?? null;
  }

  // Slow path: city not precomputed. Use Ujjain Blob (always available) for
  // festival date + tithi, then compute city-specific puja muhurat only.
  // Cache the Promise so concurrent requests share one Blob read — not the
  // resolved value, to avoid duplicate fetches on simultaneous cache misses.
  // Gemini PR #716 HIGH.
  let ujjainPromise = _ujjainModelCache.get(year);
  if (!ujjainPromise) {
    ujjainPromise = getPrecomputed({
      key: festivalsYearKey(year, 'ujjain'),
      schema: FestivalsYearPageModel,
      fallback: async () => {
        // Defence-in-depth: Ujjain must always be precomputed, but if the
        // Blob is somehow missing, fall back to a targeted compute rather
        // than the full year calendar.
        const festivals = generateFestivalCalendarV2(
          year,
          UJJAIN_REFERENCE.lat,
          UJJAIN_REFERENCE.lng,
          UJJAIN_REFERENCE.ianaZone,
        );
        return {
          _v: 1 as const,
          _computedAt: new Date().toISOString(),
          year,
          city: 'ujjain',
          festivals: festivals as unknown as Record<string, unknown>[],
        };
      },
    }).then(m => m ?? undefined)
      .catch((err: unknown) => {
        // Evict on rejection so the next request retries instead of
        // awaiting a permanently-poisoned Promise. Gemini PR #716 HIGH.
        _ujjainModelCache.delete(year);
        throw err;
      });
    // Store immediately so concurrent requests share this in-flight fetch.
    _ujjainModelCache.set(year, ujjainPromise);
  }
  const ujjainModel = await ujjainPromise;

  // Guard: schema validation inside getPrecomputed can return null if the
  // fallback's return value fails the Zod parse. Gemini PR #716 MED.
  if (!ujjainModel) return null;
  const ujjainEntry = asFestivalEntries(ujjainModel.festivals).find(f => f.slug === slug);
  if (!ujjainEntry) return null;

  // Recompute puja muhurat for the requested city using the festival date
  // from Ujjain. computePujaMuhurat() only needs (slug, date, lat, lng, tz)
  // and runs in ~5ms using sunrise/sunset at the city — no full year calendar.
  const cityMuhurat = computePujaMuhurat(slug, ujjainEntry.date, city.lat, city.lng, city.timezone);

  // ujjainEntry sits in the module-level `_ujjainModelCache` — spreading it
  // copies the inner `description` object by REFERENCE, so without an
  // explicit shallow-copy any downstream consumer that mutates
  // `result.description` would also mutate the cached entry that the next
  // request reads. Defensive copy keeps cache integrity. Gemini PR #718 HIGH.
  const result: FestivalEntry = {
    ...ujjainEntry,
    description: ujjainEntry.description ? { ...ujjainEntry.description } : { en: '', hi: '' },
    pujaMuhurat: cityMuhurat,
  };
  return result;
}

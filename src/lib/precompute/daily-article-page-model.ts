/**
 * Page-handler entry point for /[locale]/daily/[date]/[city].
 *
 * Wraps `getPrecomputed` with a fallback that mirrors what the page
 * inlined before this PR — `generateDailyArticle` + 12 horoscope
 * computations across RASHIS. Output shape matches schema/
 * daily-article.ts; the page consumer casts the opaque horoscope
 * entries to DailyHoroscope at the boundary.
 */

import { generateDailyArticle, type ArticleCityConfig } from '@/lib/horoscope/daily-article';
import { generateDailyHoroscope, type DailyHoroscope } from '@/lib/horoscope/daily-engine';
import { RASHIS } from '@/lib/constants/rashis';
import type { CityData } from '@/lib/constants/cities';
import { getPrecomputed } from './reader';
import { dailyArticleKey } from './keys';
import {
  DailyArticlePageModel,
  type DailyArticlePageModel as DailyArticlePageModelT,
} from './schema/daily-article';

interface Args {
  /** YYYY-MM-DD — must be pre-validated by the caller. */
  date: string;
  /** Resolved city from getCityBySlug. */
  city: CityData;
}

export async function getDailyArticlePageModel(args: Args): Promise<DailyArticlePageModelT> {
  const { date: dateStr, city } = args;

  return await getPrecomputed({
    key: dailyArticleKey(dateStr, city.slug),
    schema: DailyArticlePageModel,
    fallback: async () => buildFreshModel(dateStr, city),
  });
}

export function buildFreshModel(
  dateStr: string,
  city: CityData,
): DailyArticlePageModelT {
  const cityConfig: ArticleCityConfig = {
    name: city.name.en,
    nameHi: city.name.hi || '',
    lat: city.lat,
    lng: city.lng,
    timezone: city.timezone,
  };
  // Reconstruct the date object from dateStr using explicit UTC
  // (Lesson L). The page handler's `parsed` is built via the local-tz
  // `new Date(y, m-1, d)` constructor — fine on Vercel's UTC runners
  // but fragile on any other server. Owning the construction here
  // guarantees byte-equivalent output between live compute (page
  // fallback path) and the writer script (which already uses
  // Date.UTC). Gemini PR #695 HIGH.
  const [y, m, d] = dateStr.split('-').map(Number);
  const utcDate = new Date(Date.UTC(y, m - 1, d));
  const article = generateDailyArticle(utcDate, cityConfig);
  const horoscopes = RASHIS.map((r) => generateDailyHoroscope({ moonSign: r.id, date: dateStr }));

  return {
    _v: 1 as const,
    _computedAt: new Date().toISOString(),
    date: dateStr,
    city: city.slug,
    article,
    horoscopes: horoscopes as unknown as Record<string, unknown>[],
  };
}

/** Cast the opaque horoscopes array back to the canonical type for
 *  type-safe field access by the page consumer. */
export function asHoroscopes(horoscopes: Record<string, unknown>[]): DailyHoroscope[] {
  return horoscopes as unknown as DailyHoroscope[];
}

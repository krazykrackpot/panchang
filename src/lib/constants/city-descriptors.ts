/**
 * Per-city descriptor paragraphs — ~80-120 word prose per city, in all 9
 * locales. Used by /panchang/<city> page bodies to break the "city-name-
 * swap" thin-content pattern: post the May 31 demotion city-cut, the 44
 * remaining city pages still shared identical tithi/nakshatra/yoga/karana
 * with two Indian cities on the same date — the only body difference was
 * the city name substitution.
 *
 * This descriptor renders as a server-rendered section above the daily
 * article and carries genuine city-specific facts: notable temples /
 * pilgrimage sites, local festival traditions where this city's observance
 * differs from the pan-India default, regional fast/feast practices,
 * climate or seasonal panchang notes, and (for diaspora cities) the
 * Hindu / Indian-origin community context.
 *
 * Source: scripts/generate-city-descriptors.py — Gemini 2.5 Flash on
 * Vertex AI with a real-traditions prompt. 1 EN authoring call + 8
 * translation calls fan out to mai/mr/ta/te/bn/gu/kn.
 *
 * Coverage: the 44 city slugs in SEO_INDEXABLE_CITY_SLUGS
 * (`src/lib/constants/cities-extended.ts`). Out-of-keep-list slugs are
 * noindex'd at the page level — no descriptor needed.
 */
import type { LocaleText } from '@/types/panchang';
import data from './city-descriptors.json';

export interface CityDescriptor {
  descriptor: LocaleText;
}

const CITY_DESCRIPTORS = data as Record<string, CityDescriptor>;

/**
 * Look up the descriptor paragraph for a city slug. Returns undefined
 * for slugs not in the SEO-indexable keep-list (or any slug the data
 * job hasn't covered yet) — callers should skip the section gracefully.
 */
export function getCityDescriptor(slug: string): CityDescriptor | undefined {
  if (!slug) return undefined;
  return CITY_DESCRIPTORS[slug];
}

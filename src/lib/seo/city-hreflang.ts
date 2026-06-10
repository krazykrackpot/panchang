/**
 * Hreflang map for /panchang/[city] (Phase 1, 2026-06-10).
 *
 * The generic `buildHreflangMap` emits an alternate for every visibleLocale,
 * which on the city pages translates to "every Marathi /mr/panchang/<slug>
 * URL claims to be the Marathi alternate of /en/panchang/<slug>". After the
 * Phase 1 cut, most of those Marathi (and Tamil/Telugu/etc.) variants are
 * either noindex (content-floor) or 410 Gone (proxy interception). Listing
 * them as hreflang alternates contradicts those signals and gives Google
 * a confused index-or-not picture.
 *
 * This helper only emits alternates for the locales where the slug is in
 * the Phase 1 curated set. x-default points at the highest-priority
 * indexable locale (`en` if present, else the first in the curated set).
 */
import {
  getIndexableLocalesForCity,
  CITIES_BY_LOCALE,
} from '@/lib/constants/cities-extended';
import { BASE_URL } from '@/lib/seo/base-url';
import { defaultLocale } from '@/lib/i18n/config';

export function buildCityHreflangMap(citySlug: string): Record<string, string> {
  const locales = getIndexableLocalesForCity(citySlug);
  if (locales.length === 0) {
    // Slug exists in ALL_CITIES but isn't curated for any locale — return
    // empty so Next.js doesn't emit an alternates block at all. The page
    // is noindex anyway (and likely 410 from the proxy if it was a legacy
    // indexable slug). Empty hreflang is the honest signal.
    return {};
  }
  const out: Record<string, string> = {};
  for (const loc of locales) {
    out[loc] = `${BASE_URL}/${loc}/panchang/${citySlug}`;
  }
  // x-default: prefer the project default locale when it's in the curated
  // set, otherwise the first curated locale. Mirrors pickFallbackLocale's
  // behavior in src/lib/seo/hreflang.ts (Gemini PR #408 cycle-2 MED).
  const xDefaultLocale =
    CITIES_BY_LOCALE[defaultLocale]?.has(citySlug) ? defaultLocale : locales[0];
  out['x-default'] = `${BASE_URL}/${xDefaultLocale}/panchang/${citySlug}`;
  return out;
}

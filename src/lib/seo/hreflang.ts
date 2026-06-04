import { visibleLocales, defaultLocale } from '@/lib/i18n/config';
import { BASE_URL } from '@/lib/seo/base-url';
import { getIndexableLocales } from '@/lib/seo/indexable-locales';

// Build the `alternates.languages` map for a given path template using the
// canonical visibleLocales list from i18n/config. Centralising this here
// means a single change to visibleLocales propagates everywhere — no more
// 132 layouts with stale hardcoded locale arrays that drift past locale
// retirements/restorations.
//
// `pathTemplate` is the path AFTER the locale segment, with a leading slash.
// Example: `/learn/modules/${MOD_ID}` → produces
//   { en: '<base>/en/learn/modules/X', hi: '<base>/hi/learn/modules/X', ..., 'x-default': '<base>/en/learn/modules/X' }
export function buildHreflangMap(pathTemplate: string): Record<string, string> {
  const normalised = pathTemplate.startsWith('/') ? pathTemplate : `/${pathTemplate}`;
  const out: Record<string, string> = {};
  for (const locale of visibleLocales) {
    out[locale] = `${BASE_URL}${normalised.replace(/^\//, `/${locale}/`)}`;
  }
  out['x-default'] = `${BASE_URL}${normalised.replace(/^\//, `/${defaultLocale}/`)}`;
  return out;
}

/**
 * Pick the locale to use when redirecting away from a non-indexable
 * URL — for canonical AND x-default. Prefers `defaultLocale` when it's
 * in the route's indexable set; otherwise falls back to the first
 * indexable locale. Guards against pointing canonical / x-default at
 * a noindex page when a future policy ever excludes `defaultLocale`
 * from a route's indexable set (today every prefix includes 'en',
 * but `PER_ROUTE_INDEXABLE` staging could in principle produce a set
 * that excludes it). Gemini PR #408 cycle-2 MED.
 */
function pickFallbackLocale(indexable: ReadonlyArray<string>): string {
  if (indexable.includes(defaultLocale)) return defaultLocale;
  return indexable[0] ?? defaultLocale;
}

/**
 * Dynamic hreflang map — reads the route's indexable-locale set from
 * the central policy in `indexable-locales.ts`. Use this for any
 * route that may have partial-locale coverage; falls back to
 * visibleLocales fan-out when the policy declares full coverage.
 *
 * IMPORTANT: visibleLocales (not `locales` from i18n config). `locales`
 * includes retired codes like `sa` that 301-redirect to /en/ —
 * emitting them as hreflang causes "Hreflang to redirect" GSC errors.
 *
 * Replaces `buildIndexableLagnaHreflang` (lagna-only, hardcoded en+hi)
 * for all callers — see spec §2.2 (Gemini PR #407 cycle-1 + cycle-2).
 */
export function buildIndexableHreflang(pathTemplate: string): Record<string, string> {
  const normalised = pathTemplate.startsWith('/') ? pathTemplate : `/${pathTemplate}`;
  const indexable = getIndexableLocales(normalised) ?? visibleLocales;
  const out: Record<string, string> = {};
  for (const locale of indexable) {
    out[locale] = `${BASE_URL}/${locale}${normalised}`;
  }
  out['x-default'] = `${BASE_URL}/${pickFallbackLocale(indexable)}${normalised}`;
  return out;
}

/**
 * Canonical URL for a (route, locale) pair, respecting the central
 * indexability policy. If the locale is non-indexable for the route,
 * the canonical falls back to an indexable locale via
 * `pickFallbackLocale` so the page points at a real, crawlable
 * canonical and doesn't compete for ranking.
 *
 * Centralising this avoids hardcoding `'en'` as the fallback in every
 * call site (~10 files in this PR). Gemini PR #408 cycle-1 MED;
 * fallback hardening per cycle-2 MED.
 */
export function buildCanonicalUrl(route: string, locale: string): string {
  const normalised = route.startsWith('/') ? route : `/${route}`;
  const indexable = getIndexableLocales(normalised);
  // Full coverage → input locale is canonical.
  if (!indexable) return `${BASE_URL}/${locale}${normalised}`;
  // Partial coverage: if the input locale is indexable, use it; else
  // fall back via pickFallbackLocale (defaultLocale preferred, first
  // indexable as backstop).
  const canonicalLocale = (indexable as readonly string[]).includes(locale)
    ? locale
    : pickFallbackLocale(indexable);
  return `${BASE_URL}/${canonicalLocale}${normalised}`;
}

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
  out['x-default'] = `${BASE_URL}/${defaultLocale}${normalised}`;
  return out;
}

/**
 * Canonical URL for a (route, locale) pair, respecting the central
 * indexability policy. If the locale is non-indexable for the route,
 * the canonical falls back to `defaultLocale` so the page points at
 * the real canonical and doesn't compete for ranking.
 *
 * Centralising this avoids hardcoding `'en'` as the fallback in every
 * call site (~10 files in this PR). When the default locale ever
 * changes — or when the policy expands `PER_ROUTE_INDEXABLE` so a
 * previously-non-indexable locale starts pointing at its own URL —
 * a single change here propagates everywhere. Gemini PR #408
 * cycle-1 MED.
 */
export function buildCanonicalUrl(route: string, locale: string): string {
  const normalised = route.startsWith('/') ? route : `/${route}`;
  const indexable = getIndexableLocales(normalised);
  const isIndexable = !indexable || (indexable as readonly string[]).includes(locale);
  const canonicalLocale = isIndexable ? locale : defaultLocale;
  return `${BASE_URL}/${canonicalLocale}${normalised}`;
}

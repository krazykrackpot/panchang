import { visibleLocales, defaultLocale } from '@/lib/i18n/config';

// Trim trailing slash so `${BASE_URL}/${locale}/...` never produces a double
// slash if the env var was set with a trailing `/`.
const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com').replace(/\/+$/, '');

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

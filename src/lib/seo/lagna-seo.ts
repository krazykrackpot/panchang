/**
 * Shared SEO constants for the kundali lagna + featured-yoga surfaces.
 *
 * Lives in /lib/seo/ rather than /lib/constants/ because these are
 * SEO-curation choices (which yogas to surface, which locales to
 * index), not domain truths. The yoga slugs themselves are validated
 * against the canonical YOGA_DETAIL_DATA at consumption time.
 *
 * Imported by:
 *   - src/app/[locale]/kundali/lagna/[sign]/page.tsx (page render +
 *     generateStaticParams)
 *   - src/app/[locale]/kundali/page.tsx (Featured Yogas + Lagna grids)
 *   - src/app/sitemap.ts (lagna sitemap fan-out)
 *
 * Single source of truth per CLAUDE.md Lesson Q. Gemini #245.
 */

/**
 * Locales that ship indexable lagna content. PR-1 was EN only; PR-2
 * added HI. Other locales still render EN content for hreflang
 * honesty but are tagged `noindex` in metadata.
 *
 * NOT moved into the global `visibleLocales` list (i18n/config.ts)
 * because indexability is a per-feature decision — vrat tracker and
 * panchang root are already on all 9 locales.
 */
export const INDEXABLE_LAGNA_LOCALES = ['en', 'hi'] as const;
export type IndexableLagnaLocale = (typeof INDEXABLE_LAGNA_LOCALES)[number];

/**
 * Yogas surfaced as featured cross-links on `/kundali` root + every
 * `/kundali/lagna/[sign]` page. Every slug below MUST exist in
 * `YOGA_DETAIL_DATA` (verified at build time via the existing
 * /learn/yoga/[slug] page).
 *
 * Selection criteria (May 2026):
 *   - High search volume on GSC for the yoga name itself
 *   - Rich content in YOGA_DETAIL_DATA (≥3 description paragraphs)
 *   - Mix of auspicious + cautionary yogas so the section reads as
 *     an honest catalogue, not promotional fluff
 */
export interface FeaturedYoga {
  slug: string;
  en: string;
  hi: string;
}

export const FEATURED_YOGAS: FeaturedYoga[] = [
  { slug: 'gajakesari', en: 'Gajakesari', hi: 'गजकेसरी' },
  { slug: 'chandra_mangala', en: 'Chandra-Mangala', hi: 'चन्द्र-मंगल' },
  { slug: 'mahabhagya', en: 'Mahabhagya', hi: 'महाभाग्य' },
  { slug: 'chatussagara', en: 'Chatussagara', hi: 'चतुःसागर' },
  { slug: 'vasumati', en: 'Vasumati', hi: 'वसुमती' },
  { slug: 'shankha', en: 'Shankha', hi: 'शंख' },
  { slug: 'bheri', en: 'Bheri', hi: 'भेरी' },
  { slug: 'kedara', en: 'Kedara', hi: 'केदार' },
  { slug: 'gauri', en: 'Gauri', hi: 'गौरी' },
  { slug: 'kemadruma', en: 'Kemadruma', hi: 'केमद्रुम' },
];

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com').replace(/\/+$/, '');

/**
 * Hreflang map restricted to indexable lagna locales (EN + HI) + x-default.
 *
 * Why this exists separately from the generic `buildHreflangMap`:
 * pages where most locales are `noindex` can't list those locales in
 * hreflang — Google flags "Hreflang to non-indexable page" / "Hreflang
 * conflicts" in Search Console (Gemini #250 HIGH). The generic helper
 * fans out to all 9 visible locales, which is correct only when every
 * locale URL is indexable.
 *
 * Used by:
 *   - /kundali/lagna/[sign] (EN+HI indexable, 7 others noindex)
 *   - /learn/yoga/[slug]    (EN+HI indexable, 7 others noindex)
 *
 * `pathTemplate` is the path AFTER the locale segment, with a leading
 * slash. Example: `/learn/yoga/gajakesari`.
 */
export function buildIndexableLagnaHreflang(pathTemplate: string): Record<string, string> {
  const normalised = pathTemplate.startsWith('/') ? pathTemplate : `/${pathTemplate}`;
  const out: Record<string, string> = {};
  for (const locale of INDEXABLE_LAGNA_LOCALES) {
    out[locale] = `${BASE_URL}/${locale}${normalised}`;
  }
  out['x-default'] = `${BASE_URL}/en${normalised}`;
  return out;
}

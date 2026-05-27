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

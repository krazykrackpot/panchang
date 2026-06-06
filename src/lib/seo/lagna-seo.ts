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
 * added HI. Wave-1 of the 9-locale rollout (2026-06-06) adds Maithili
 * (mai) via lagna-mai-overlay.json — 72 paragraphs (12 lagnas × 6
 * sections) translated by Claude with native review pending.
 *
 * Other locales (ta/te/kn/mr/gu/bn) still render the EN/HI fallback
 * content for hreflang honesty but are tagged `noindex` in metadata.
 * They land in waves 2-4 as their overlay JSONs complete — mirrors
 * the yoga overlay rollout cadence (#412 → #415 → #417).
 *
 * NOT moved into the global `visibleLocales` list (i18n/config.ts)
 * because indexability is a per-feature decision — vrat tracker and
 * panchang root are already on all 9 locales.
 */
export const INDEXABLE_LAGNA_LOCALES = ['en', 'hi', 'mai', 'mr'] as const;
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

import { buildIndexableHreflang } from '@/lib/seo/hreflang';

/**
 * Hreflang map restricted to the route's indexable-locale set + x-default.
 *
 * DEPRECATED — thin delegator to the generalised `buildIndexableHreflang`
 * in `src/lib/seo/hreflang.ts`. Kept so existing seo-invariants checks
 * that grep for the symbol continue to recognise the lagna pattern; new
 * code should import `buildIndexableHreflang` directly. The hardcoded
 * en+hi behaviour this helper used to ship was wrong for any route
 * outside lagna's en+hi-only world (see /gauri-panchang/ which actually
 * has ta+te+kn translations) — Gemini PR #407 cycle-1 MED.
 *
 * `pathTemplate` is the path AFTER the locale segment, with a leading
 * slash. Example: `/learn/yoga/gajakesari`.
 */
export function buildIndexableLagnaHreflang(pathTemplate: string): Record<string, string> {
  return buildIndexableHreflang(pathTemplate);
}

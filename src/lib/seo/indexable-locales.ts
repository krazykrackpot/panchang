/**
 * Per-route indexable-locale policy. Transitional staging — flips
 * back to indexable as translations land via option A.
 *
 * Several clusters render byte-identical EN or HI content for the
 * regional Indic locales (ta/te/bn/gu/kn/mr/mai) because their
 * underlying constants files store only `{ en, hi, sa? }`. Google's
 * canonical-consolidation algorithm correctly identifies this and
 * folds the regional URLs into the EN/HI canonical — the user-
 * visible May 31 2026 impressions cliff.
 *
 * This file is the single policy: which route prefixes ship
 * indexable content for which locales. Consulted by:
 *
 *   - src/lib/seo/metadata.ts   → `getPageMetadata` (per-page hreflang
 *     + noindex for non-indexable locales)
 *   - src/lib/seo/hreflang.ts   → `buildIndexableHreflang` (per-route
 *     hreflang map respecting the policy)
 *   - src/app/sitemap.ts        → `addEntries` (per-cluster fan-out)
 *   - hand-rolled `generateMetadata` callers per spec §2.2
 *
 * NOT a domain decision (which locales are "supported"). That lives
 * in `src/lib/i18n/config.ts`. This is the indexability projection of
 * actual translation coverage per cluster — a separate, looser concern.
 *
 * Lifecycle (spec §3 Promotion path):
 *   1. Untranslated → prefix policy stays restrictive → noindex
 *   2. Translated (single slug) → add to PER_ROUTE_INDEXABLE → flip indexable
 *   3. Fully translated (prefix × locale) → promote to INDEXABLE_BY_PREFIX,
 *      remove per-route entries
 *
 * Spec: docs/specs/2026-06-04-noindex-thin-translation-locales.md
 */

/** Locales that ship substantive translations across most clusters. */
export const INDEXABLE_EN_HI = ['en', 'hi'] as const;
export type IndexableEnHi = (typeof INDEXABLE_EN_HI)[number];

/**
 * Locales that ship indexable /kundali/lagna content. Defined here (the
 * leaf SEO module) rather than in `lagna-seo.ts` because the cluster's
 * indexable set is consumed by sitemap.ts → hreflang.ts (which imports
 * `getIndexableLocales` from this file). A reverse import from
 * `lagna-seo.ts` would close a circular dependency cycle (Gemini PR
 * #481 round-2 HIGH): `indexable-locales.ts → lagna-seo.ts → hreflang
 * .ts → indexable-locales.ts`.
 *
 * Wave 1 (2026-06-06) adds mai; wave 2 adds mr; wave 3 adds ta;
 * wave 4 adds te + kn; wave 5 (final) adds gu + bn — full 9-locale
 * parity across /kundali/lagna achieved.
 *
 * Re-exported from `lagna-seo.ts` for backward compat with existing
 * import sites that read the constant from there.
 */
export const INDEXABLE_LAGNA_LOCALES = ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const;
export type IndexableLagnaLocale = (typeof INDEXABLE_LAGNA_LOCALES)[number];

/**
 * Indexable-locale set per route prefix. A route is "thin-coverage"
 * if it starts with any prefix here; the matching prefix's set defines
 * which locales render real content (and therefore should be indexed
 * + sitemap-listed + hreflang-emitted).
 *
 * Entries represent CURRENT translation coverage. As option A's
 * translation pipeline ships per-prefix coverage, expand the set
 * here; see spec §3.
 */
const INDEXABLE_BY_PREFIX: ReadonlyArray<[string, ReadonlyArray<string>]> = [
  // All /learn/* slug pages — 82 of 124 audited are hardcoded {en, hi}
  // objects falling back to EN. Treating the whole subtree uniformly
  // is more honest than per-page allowlists that drift as new slugs ship.
  ['/learn/',          INDEXABLE_EN_HI],
  // /learn/yoga/[slug] — option A pilot grew from en+hi+mai (PR #412)
  // to en+hi+mai+ta (this PR) as Tamil overlay completed all 103 yoga
  // slugs via Claude Sonnet 4.6. Translations stored in
  // src/lib/constants/yoga-{loc}-overlay.json and overlaid at
  // module-load by yoga-details-with-overlay.ts. Longest-match prefix
  // resolution (Gemini PR #407 cycle-1) means this entry wins for any
  // /learn/yoga/... route over the broader /learn/ entry above.
  // te/bn/gu/kn/mr land in PR-2 as their overlays complete. Spec
  // 2026-06-04-noindex-thin-translation-locales.md §3 state 3.
  ['/learn/yoga/',     ['en', 'hi', 'mai', 'ta', 'te', 'bn', 'gu', 'kn', 'mr'] as const],
  // /matching/[pair] — rashi-compatibility.ts attaches per-locale
  // overlays for all 9 locales at module-load via
  // attachLocaleOverlay(). Each of the 78 pairs renders the 6 main
  // detail sections (temperament/communication/romance/career/
  // challenges/remedies) plus summary + oneLiner in the target
  // locale's script. Overlays generated via Gemini 2.5 Flash —
  // pending_native_review until proofread.
  ['/matching/',       ['en', 'hi', 'mai', 'mr', 'ta', 'te', 'kn', 'gu', 'bn'] as const],
  // /devotional/[type]/[slug] — aarti/stotram/chalisa rendering
  // currently falls back to en/hi-only stores
  ['/devotional/',     INDEXABLE_EN_HI],
  // /baby-names/[nakshatra] — name lists are en+hi only today
  ['/baby-names/',     INDEXABLE_EN_HI],
  // /horoscope/[rashi][/date|weekly|monthly] — daily-engine
  // generates en+hi only today
  ['/horoscope/',      INDEXABLE_EN_HI],
  // /gauri-panchang/[date] — gauri-panchang.ts has actual ta+te+kn data
  ['/gauri-panchang/', ['en', 'hi', 'ta', 'te', 'kn'] as const],
  // /kundali/lagna/[sign] — locale set sourced from the canonical
  // INDEXABLE_LAGNA_LOCALES in lagna-seo.ts (single source of truth —
  // Lesson Q, Gemini #245). Wave-1 adds Maithili; waves 2-5 will
  // promote mr/ta/te/kn/gu/bn one PR each as overlays complete.
  // Imported below to avoid duplicating the array literal here
  // (Gemini PR #481 MED — previously these two files had to be kept
  // in sync by hand).
  ['/kundali/lagna/',  INDEXABLE_LAGNA_LOCALES],
];

/**
 * Per-route additions to the prefix indexable set. Use this to mark
 * individual translated slugs as indexable while the rest of the
 * prefix stays noindexed.
 *
 * Keys are routes WITHOUT the locale prefix and WITHOUT a trailing
 * slash (the lookup normalises trailing slashes defensively).
 *
 * Lifecycle: option A's translation pipeline adds entries here as
 * each (slug × locale) ships with real translated content. When a
 * full (prefix × locale) is complete (e.g. all 137 yoga slugs
 * translated to mai), promote to INDEXABLE_BY_PREFIX above and
 * remove the now-redundant per-route entries. See spec §3.
 *
 * Empty at first commit; grows as option A ships translations.
 */
const PER_ROUTE_INDEXABLE: Readonly<Record<string, ReadonlyArray<string>>> = {
  // Empty at first option A wave — /learn/yoga/ was promoted to
  // prefix-level mai indexability above (all 103 slugs translated).
  // Future per-slug overrides land here for in-flight (incomplete)
  // translation work. See spec §3.
};

/**
 * Returns the indexable-locale list for a route, or `undefined` if the
 * route has full coverage (the default).
 *
 * Treat the return value as opaque — callers should not destructure or
 * compare element identity; just use it as a Locale[] for fan-out.
 */
export function getIndexableLocales(route: string): ReadonlyArray<string> | undefined {
  // Hub-page protection. Hubs like /learn, /matching, /devotional are
  // PARENT routes of thin-coverage prefixes; their own content is
  // proper PAGE_META-driven and stays indexable in all 9 locales.
  // Without this guard, a trailing-slash visit like `/learn/` would
  // match the `/learn/` prefix and noindex the hub.
  // Spec §2.1 (Gemini PR #407 cycle-1).
  for (const [prefix] of INDEXABLE_BY_PREFIX) {
    const hub = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
    if (route === hub || route === `${hub}/`) return undefined;
  }

  // Longest-match prefix resolution. If a future prefix like
  // `/learn/modules/` ships with its own different indexable set, it
  // must not be silently shadowed by the shorter `/learn/`. Order-
  // independence in INDEXABLE_BY_PREFIX is a maintainability property;
  // correctness should not depend on declaration order.
  // Spec §2.1 (Gemini PR #407 cycle-1).
  let longestMatch: readonly [string, ReadonlyArray<string>] | undefined;
  for (const entry of INDEXABLE_BY_PREFIX) {
    if (route.startsWith(entry[0])) {
      if (!longestMatch || entry[0].length > longestMatch[0].length) {
        longestMatch = entry;
      }
    }
  }
  const baseSet = longestMatch?.[1];

  // Routes outside thin-coverage prefixes are fully indexable —
  // overrides are inert (no expressive shape for "remove a locale
  // from full coverage"; YAGNI until we hit such a case).
  if (baseSet === undefined) return undefined;

  // Normalise trailing slash before the override lookup. Callers
  // generally build the route without one (e.g. `/matching/${pair}`),
  // but a stray slash from a future caller should not silently fall
  // through to the prefix-only result.
  // Spec §2.1 (Gemini PR #407 cycle-2).
  const cleanRoute = route.endsWith('/') && route.length > 1 ? route.slice(0, -1) : route;
  const extras = PER_ROUTE_INDEXABLE[cleanRoute];
  if (!extras || extras.length === 0) return baseSet;
  return [...new Set([...baseSet, ...extras])];
}

/**
 * True if the given locale is indexable for this route. Convenience
 * wrapper around `getIndexableLocales`.
 */
export function isLocaleIndexable(route: string, locale: string): boolean {
  const indexable = getIndexableLocales(route);
  if (!indexable) return true;
  return (indexable as readonly string[]).includes(locale);
}

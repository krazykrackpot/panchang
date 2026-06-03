/**
 * Per-route indexable-locale policy.
 *
 * Some clusters render English content for 7 of 9 locales because their
 * pages hardcode `{ en, hi }` objects and fall back to EN for ta/te/bn/
 * gu/kn/mai/mr. Advertising those URLs in 9-locale fan-out across
 * sitemap + hreflang produces a duplicate-content signal — Google
 * de-duplicates `/mai/learn/surya` against `/en/learn/surya`, and the
 * cluster gets demoted as "thin localised content."
 *
 * This file is the single policy: which route prefixes ship indexable
 * content for which locales. Consulted by:
 *
 *   - src/lib/seo/metadata.ts   → `getPageMetadata` (per-page hreflang
 *     + noindex for non-indexable locales)
 *   - src/app/sitemap.ts        → `addEntries` (per-cluster fan-out)
 *
 * NOT a domain decision (which locales are "supported"). That lives in
 * `src/lib/i18n/config.ts`. This is the indexability projection of
 * actual translation coverage per cluster — a separate, looser concern.
 *
 * To add a new thin-coverage cluster:
 *   1. Add its prefix to `EN_HI_ONLY_PREFIXES` below.
 *   2. Run the sitemap budget test — it'll show the URL count drop.
 *   3. Wait ~3-7 days post-deploy for Google to re-crawl.
 *
 * Pattern adopted from existing `INDEXABLE_LAGNA_LOCALES` (lagna-seo.ts)
 * after the May 31 2026 traffic collapse — that pattern was already
 * applied to /kundali/lagna/[sign] and /learn/yoga/[slug]. This file
 * generalises it to every thin-coverage cluster.
 */

/** Locales that ship substantive translations across most clusters. */
export const INDEXABLE_EN_HI = ['en', 'hi'] as const;
export type IndexableEnHi = (typeof INDEXABLE_EN_HI)[number];

/**
 * Route prefixes whose content is structurally en+hi only. A route
 * matches if it equals the prefix exactly OR starts with `<prefix>/`.
 *
 * Exclusions (kept indexable in all 9 locales):
 *   - `/learn` (the curriculum hub) — proper PAGE_META translations
 *   - `/learn/yoga/<slug>` — already handled by INDEXABLE_LAGNA_LOCALES
 *     in the layout (this file's policy is the same set, so the result
 *     is identical either way; layout's own metadata still wins)
 */
const EN_HI_ONLY_PREFIXES: readonly string[] = [
  // All /learn/* slug pages — 82 of 124 audited are hardcoded {en, hi}
  // objects falling back to EN. Treating the whole subtree uniformly
  // is more honest than per-page allowlists that drift as new slugs ship.
  '/learn/',
];

/**
 * Returns the indexable-locale list for a route, or `undefined` if the
 * route has full 9-locale coverage (the default).
 *
 * Treat the return value as opaque — callers should not destructure or
 * compare element identity; just use it as a Locale[] for fan-out.
 */
export function getIndexableLocales(route: string): ReadonlyArray<string> | undefined {
  // Hub check accepts both `/learn` and `/learn/` so a trailing slash
  // (introduced by a layout, middleware, or external link) doesn't fall
  // through to the prefix-match branch and get misclassified as thin.
  // The canonical `/learn` hub has full 9-locale PAGE_META translations
  // and must stay indexable everywhere. Don't normalise the route for
  // the prefix loop — that would silently break any future prefix that
  // legitimately ends with a slash. Gemini PR #391 HIGH (refined from
  // the original PR #383 trailing-slash normalisation).
  if (route === '/learn' || route === '/learn/') return undefined;

  // `/learn/anything` = thin. Substring match keeps each prefix's
  // exact slash semantics intact.
  for (const prefix of EN_HI_ONLY_PREFIXES) {
    if (route.startsWith(prefix)) return INDEXABLE_EN_HI;
  }
  return undefined;
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

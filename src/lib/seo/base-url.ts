/**
 * Canonical site origin for SEO output — `<link rel="canonical">`,
 * OpenGraph URLs, hreflang alternates, sitemap entries, structured
 * data IDs, and anything else that's rendered into HTML or surfaced
 * to crawlers.
 *
 * Always falls back to `https://dekhopanchang.com` so a preview
 * deployment (where `NEXT_PUBLIC_SITE_URL` is unset) never publishes
 * its `*.vercel.app` URL as a canonical — that would split crawler
 * signal between production and preview hosts.
 *
 * For server→server internal fetches that should hit the *current*
 * deployment (not the production domain), import `getInternalBaseUrl`
 * from `@/lib/utils/base-url` instead — it prefers `VERCEL_URL` and
 * falls back to `localhost:3000`, which is the correct behaviour for
 * same-origin API hops but the WRONG behaviour for SEO.
 *
 * `?.trim()` runs BEFORE `||` so a whitespace-only env var (Vercel
 * occasionally appends a newline) still falls back to the canonical
 * default rather than producing an empty string. The trailing-slash
 * strip uses `/\/+$/` (one-or-more) so a misconfigured `…com//` is
 * normalised — `/\/$/` only stripped one slash, which is why PR #266
 * had to be re-patched in PR #273.
 */
export const BASE_URL: string = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com'
).replace(/\/+$/, '');

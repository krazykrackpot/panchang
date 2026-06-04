/**
 * Bing Webmaster Tools API client.
 *
 * Bing offers a per-key API for both URL submission and sitemap
 * submission, separate from IndexNow. The two coexist:
 *
 *   - IndexNow → notifies Bing's index that specific URLs changed.
 *     Fast, daily-cron friendly, 10k URLs/submission. We already
 *     have this wired in `src/lib/seo/indexnow.ts`.
 *
 *   - Bing Webmaster API → directly submits URLs or sitemaps to
 *     Bing's webmaster account. Slower (100 URL/day quota) but
 *     surfaces in the Bing Webmaster Tools dashboard with coverage
 *     stats, search-query data, and structured-data validation. The
 *     equivalent of GSC.
 *
 * This module covers the second path. Used by:
 *   - scripts/bing-submit-sitemap.ts (one-shot sitemap push)
 *   - src/app/api/cron/bing-submit-urls/route.ts (daily URL push,
 *     100/day quota)
 *
 * Auth: a single API key from https://www.bing.com/webmasters/apikey
 * (Bing Webmaster Tools → Settings → API access).
 *
 * Env vars in production:
 *   BING_WEBMASTER_API_KEY  —  the API key string
 *
 * Without it, both consumers above no-op with a warning. Same shape
 * as the GSC client's auth fallback (gsc-client.ts).
 *
 * Bing API base: https://ssl.bing.com/webmaster/api.svc/json
 * Spec: https://learn.microsoft.com/en-us/bingwebmaster/
 */

export const BING_API_BASE = 'https://ssl.bing.com/webmaster/api.svc/json';
export const BING_SITE_URL = 'https://dekhopanchang.com';

/**
 * Read + trim the API key from env. Vercel sometimes stores env
 * values with trailing whitespace; trim once at the boundary.
 */
export function getBingApiKey(): string | undefined {
  const raw = process.env.BING_WEBMASTER_API_KEY;
  if (!raw) return undefined;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export interface BingSubmitResult {
  submitted: number;
  ok: boolean;
  status: number;
  error?: string;
}

/**
 * Submit a batch of URLs to Bing's webmaster index.
 *
 * Quota: Bing publishes 100 URLs/day per site. The docs sometimes
 * claim 10k but the actual production limit is 100; over-submission
 * returns 4xx without batch persistence. We cap at 100 here.
 *
 * Each URL must be absolute (https://dekhopanchang.com/...) — Bing
 * rejects path-only inputs at the API boundary.
 */
export async function submitUrlsToBing(
  urls: string[],
  apiKey: string,
): Promise<BingSubmitResult> {
  if (urls.length === 0) {
    return { submitted: 0, ok: false, status: 0, error: 'No URLs provided' };
  }
  const batch = urls.slice(0, 100);
  try {
    const res = await fetch(
      `${BING_API_BASE}/SubmitUrlBatch?apikey=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: BING_SITE_URL, urlList: batch }),
      },
    );
    return {
      submitted: batch.length,
      ok: res.ok,
      status: res.status,
      error: res.ok ? undefined : await res.text(),
    };
  } catch (err) {
    console.error('[bing-webmaster] submit failed:', err);
    return {
      submitted: 0,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Submit a sitemap URL to Bing. Single-shot; idempotent (Bing
 * de-dupes by URL).
 */
export async function submitSitemapToBing(
  sitemapUrl: string,
  apiKey: string,
): Promise<BingSubmitResult> {
  try {
    const res = await fetch(
      `${BING_API_BASE}/SubmitFeed?apikey=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteUrl: BING_SITE_URL, feedUrl: sitemapUrl }),
      },
    );
    return {
      submitted: 1,
      ok: res.ok,
      status: res.status,
      error: res.ok ? undefined : await res.text(),
    };
  } catch (err) {
    console.error('[bing-webmaster] sitemap submit failed:', err);
    return {
      submitted: 0,
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

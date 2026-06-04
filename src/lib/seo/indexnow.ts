/**
 * IndexNow helper  –  notifies all participating IndexNow consumers
 * (Bing, Yandex, Seznam, Naver) of new or updated URLs so they get
 * crawled quickly.
 *
 * Google does NOT participate in IndexNow. For Google we use the
 * Search Console sitemap submission (`scripts/gsc-submit-sitemap.ts`)
 * + URL Inspection API. The Bing equivalent of GSC's sitemap submission
 * is `scripts/bing-submit-sitemap.ts`. Don't reintroduce Google to the
 * participant list in this comment again — past edits got this wrong.
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * Protocol: POST a JSON body to https://api.indexnow.org/indexnow
 * with your key and a list of URLs. The key must also be hosted at:
 *   https://dekhopanchang.com/{key}.txt
 * (file lives at public/{key}.txt)
 *
 * Response codes:
 *   200 / 202  –  accepted
 *   400        –  invalid request
 *   403        –  key not found / mismatch
 *   422        –  URLs don't belong to declared host
 *   429        –  rate limited  –  back off and retry later
 *
 * Limit: up to 10,000 URLs per submission.
 */

// 32-char cryptographically random hex key. The previous value was a
// placeholder pattern (`a1b2c3d4e5f6...`) that protocols accept but
// advertises laziness on first glance and occasionally trips auditors.
// Regenerated 2026-06-04 via `openssl rand -hex 16`.
const INDEXNOW_KEY = '89ef80b257d5a8596056ec514f3c1f47';
const SITE_URL = 'https://dekhopanchang.com';
const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow';

export interface IndexNowResult {
  submitted: number;
  status: number;
  ok: boolean;
  error?: string;
}

/**
 * Submit a list of site-relative paths to IndexNow.
 * Paths must start with `/` (e.g. `/en/panchang/delhi`).
 * Does not throw  –  any failure is returned in the result object so callers
 * can log it without disrupting other cron work.
 */
export async function submitUrlsToIndexNow(paths: string[]): Promise<IndexNowResult> {
  if (paths.length === 0) {
    return { submitted: 0, status: 0, ok: false, error: 'No paths provided' };
  }

  // IndexNow accepts at most 10,000 URLs per call
  const batch = paths.slice(0, 10_000);
  const urls = batch.map(p => `${SITE_URL}${p}`);

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host: 'dekhopanchang.com',
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    const ok = response.status === 200 || response.status === 202;
    return { submitted: urls.length, status: response.status, ok };
  } catch (err) {
    console.error('[indexnow] fetch failed:', err);
    return {
      submitted: 0,
      status: 0,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

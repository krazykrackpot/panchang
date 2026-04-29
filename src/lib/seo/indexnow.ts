/**
 * IndexNow helper — notifies Bing, Yandex, and Google (since late 2024) of
 * new or updated URLs so they get crawled quickly.
 *
 * Protocol: POST a JSON body to https://api.indexnow.org/indexnow with your
 * key and a list of URLs. The key must also be hosted at:
 *   https://dekhopanchang.com/{key}.txt
 * (file lives at public/a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6.txt)
 *
 * Response codes:
 *   200 / 202 — accepted
 *   400       — invalid request
 *   403       — key not found / mismatch
 *   422       — URLs don't belong to declared host
 *   429       — rate limited — back off and retry later
 *
 * Limit: up to 10,000 URLs per submission.
 */

const INDEXNOW_KEY = 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6';
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
 * Does not throw — any failure is returned in the result object so callers
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

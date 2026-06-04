/**
 * Cron endpoint — submits the freshest URLs to Bing's Webmaster
 * Tools API directly, in addition to the IndexNow ping at
 * `/api/cron/index-urls`.
 *
 * Why both? IndexNow tells Bing's index that URLs changed. The
 * Webmaster API additionally surfaces those URLs in the Bing
 * Webmaster Tools dashboard with coverage stats, search-query
 * data, and the ability to inspect crawl status per URL — the
 * equivalent of Google Search Console.
 *
 * Quota: Bing publishes 100 URLs/day per site. We pick the EN-only
 * `INDEXNOW_GROUP_PRIMARY` rotation today (the highest-traffic
 * locale) and cap at 100 URLs. The IndexNow cron family still hits
 * all 9 locales 4×/day; this Bing-direct push is the extra "show
 * up on the Bing dashboard" layer.
 *
 * No-ops with a console.warn if `BING_WEBMASTER_API_KEY` isn't set,
 * same pattern as the GSC client's auth-missing fallback. The cron
 * stays armed so the operator can flip the env var in Vercel later
 * without redeploying.
 *
 * Schedule: 02:05 UTC daily — runs 2h after the EN/HI IndexNow
 * cron at 00:05 to leave Bing's index a quiet window between the
 * two notifications.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import {
  getBingApiKey,
  submitUrlsToBing,
  BING_SITE_URL,
} from '@/lib/seo/bing-webmaster';
import {
  buildIndexNowPaths,
  INDEXNOW_GROUP_PRIMARY,
} from '@/lib/seo/indexnow-urls';

export const maxDuration = 30;

/** Bing's daily-quota cap. Docs say up to 10k but actual prod limit is 100. */
const BING_DAILY_QUOTA = 100;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  const apiKey = getBingApiKey();
  if (!apiKey) {
    console.warn(
      '[bing-submit-urls] BING_WEBMASTER_API_KEY not set — skipping submission.',
    );
    return NextResponse.json({
      ok: true,
      submitted: 0,
      skipped: true,
      reason: 'BING_WEBMASTER_API_KEY not set',
    });
  }

  try {
    const today = new Date().toISOString().slice(0, 10);
    const paths = buildIndexNowPaths(INDEXNOW_GROUP_PRIMARY, today);
    // Bing requires absolute URLs. IndexNow accepts paths internally
    // (the helper expands them), but the Bing API rejects path-only.
    const urls = paths
      .slice(0, BING_DAILY_QUOTA)
      .map((p) => `${BING_SITE_URL}${p}`);
    const result = await submitUrlsToBing(urls, apiKey);
    if (!result.ok) {
      console.error('[bing-submit-urls] submission failed:', result);
      return NextResponse.json(
        { ok: false, submitted: 0, status: result.status, error: result.error },
        { status: 500 },
      );
    }
    return NextResponse.json({
      ok: true,
      submitted: result.submitted,
      status: result.status,
    });
  } catch (err) {
    console.error('[bing-submit-urls] uncaught:', err);
    return NextResponse.json(
      {
        ok: false,
        submitted: 0,
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}

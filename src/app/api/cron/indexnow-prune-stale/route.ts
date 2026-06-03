/**
 * Cron endpoint — pings IndexNow with URLs whose pages now emit
 * `robots: noindex` per the staleness policy (src/lib/seo/staleness.ts).
 *
 * Counterpart to `/api/cron/index-urls*` which pings FRESH URLs we want
 * crawled + updated. This one pings STALE URLs we want crawled + dropped.
 * The pages themselves are already noindex by the time we ping; the
 * ping just accelerates Bing/Yandex/Google's re-crawl + drop cycle.
 *
 * Cadence (per 2026-06-03 user call):
 *   - Daily 03:30 UTC for the first week of operation (recovery push)
 *   - Switch to weekly Sunday 03:30 UTC via a one-line vercel.json edit
 *     once the recovery curve stabilises
 *
 * The 03:30 slot deliberately avoids the 00:05 / 08:05 / 16:05 slots
 * used by `index-urls{,-devanagari,-southern}` so the prune ping
 * doesn't share a rate-limit window with the fresh-URL pings.
 *
 * Protected by CRON_SECRET header via verifyCronAuth (same pattern as
 * the rest of the cron family).
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';
import { buildIndexNowPrunePaths } from '@/lib/seo/indexnow-prune';

export const maxDuration = 30;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const paths = buildIndexNowPrunePaths();
    const result = await submitUrlsToIndexNow(paths);

    // Log the URL count + a few sample URLs so we can verify in
    // Vercel logs that the cron is firing against the right window.
    // First/last sample chosen because they bracket the past/future
    // boundary of the prune window.
    const sample = paths.length > 0 ? { first: paths[0], last: paths[paths.length - 1] } : null;
    console.log(
      `[indexnow-prune-stale] Submitted ${result.submitted}/${paths.length} URLs, ` +
        `status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
      sample,
    );

    // Return 502 on IndexNow failure so Vercel Cron Monitor + external
    // ping monitors (e.g. healthchecks.io) raise an alert. A 200 with
    // `ok: false` in the body looks healthy to off-the-shelf monitors
    // even though the actual work failed. Gemini PR #390 MEDIUM.
    return NextResponse.json(
      {
        purpose: 'prune-stale-noindex-urls',
        submitted: result.submitted,
        totalEnumerated: paths.length,
        indexNowStatus: result.status,
        ok: result.ok,
        sample,
        ...(result.error ? { error: result.error } : {}),
      },
      {
        status: result.ok ? 200 : 502,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  } catch (err) {
    console.error('[indexnow-prune-stale] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

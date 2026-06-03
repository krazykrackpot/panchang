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

    // Chunk into ≤5,000-URL batches. Two reasons:
    //   1. IndexNow's documented per-request cap is 10,000 URLs — a single
    //      payload at or near the cap risks silent rejection.
    //   2. The shared helper `submitUrlsToIndexNow()` silently truncates
    //      anything beyond 10,000 (via `paths.slice(0, 10_000)`); chunking
    //      keeps all paths actually submitted as the stale window grows
    //      (festival stale years compound at ~180 URLs/year from 2028).
    // 5,000 leaves comfortable headroom + lets the per-key rate-limit
    // window relax between sub-calls. Gemini PR #390 HIGH (re-review).
    const CHUNK_SIZE = 5000;
    let submitted = 0;
    let allOk = true;
    const statuses: number[] = [];
    const errors: string[] = [];
    for (let i = 0; i < paths.length; i += CHUNK_SIZE) {
      const chunk = paths.slice(i, i + CHUNK_SIZE);
      const chunkResult = await submitUrlsToIndexNow(chunk);
      submitted += chunkResult.submitted;
      statuses.push(chunkResult.status);
      if (!chunkResult.ok) allOk = false;
      if (chunkResult.error) errors.push(chunkResult.error);
    }

    // First/last URLs bracket the past/future stale window so log
    // grep'ing tells us at-a-glance which dates were pinged.
    const sample = paths.length > 0 ? { first: paths[0], last: paths[paths.length - 1] } : null;
    const errorJoined = errors.length > 0 ? errors.join(' | ') : undefined;
    console.log(
      `[indexnow-prune-stale] Submitted ${submitted}/${paths.length} URLs across ` +
        `${statuses.length} chunk(s), statuses: ${statuses.join(',')}` +
        (errorJoined ? `, errors: ${errorJoined}` : ''),
      sample,
    );

    // Return 502 on any IndexNow failure so Vercel Cron Monitor +
    // external ping monitors (e.g. healthchecks.io) raise an alert.
    // A 200 with `ok: false` in the body looks healthy to off-the-shelf
    // monitors even though the actual work failed. Gemini PR #390 MEDIUM.
    return NextResponse.json(
      {
        purpose: 'prune-stale-noindex-urls',
        submitted,
        totalEnumerated: paths.length,
        chunks: statuses.length,
        indexNowStatuses: statuses,
        ok: allOk,
        sample,
        ...(errorJoined ? { error: errorJoined } : {}),
      },
      {
        status: allOk ? 200 : 502,
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

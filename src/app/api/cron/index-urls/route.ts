/**
 * Cron endpoint — submits genuinely changing en/hi URLs to IndexNow
 * so Bing, Yandex (and Google, since late 2024) crawl updates fast.
 *
 * This is GROUP 1 of 3 staggered IndexNow cron families. The split
 * was introduced after the 2026-05-31 GSC drop showed the en+hi-only
 * surface left mai/mr/bn/ta/te/gu/kn under-pinged and slower to be
 * re-crawled by Bing during incidents. See `src/lib/seo/indexnow-urls.ts`
 * for the group definitions and the URL builder.
 *
 * Three cron files share the same builder:
 *   /api/cron/index-urls            00:05 UTC — en, hi      (this file)
 *   /api/cron/index-urls-devanagari 08:05 UTC — mai, mr, bn
 *   /api/cron/index-urls-southern   16:05 UTC — ta, te, gu, kn
 *
 * 8h between groups gives IndexNow's per-key rate-limit window time
 * to reset (we hit a 429 at 472 URLs during the recovery dispatch
 * earlier on 2026-06-01).
 *
 * Schedule: 00:05 UTC daily. Protected by CRON_SECRET header.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';
import {
  buildIndexNowPaths,
  INDEXNOW_GROUP_PRIMARY,
} from '@/lib/seo/indexnow-urls';

export const maxDuration = 30;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const paths = buildIndexNowPaths(INDEXNOW_GROUP_PRIMARY, today);
    const result = await submitUrlsToIndexNow(paths);

    console.log(
      `[index-urls primary en+hi] Submitted ${result.submitted} URLs, status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
    );

    return NextResponse.json(
      {
        group: 'primary',
        locales: INDEXNOW_GROUP_PRIMARY,
        submitted: result.submitted,
        indexNowStatus: result.status,
        ok: result.ok,
        ...(result.error ? { error: result.error } : {}),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[index-urls primary] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

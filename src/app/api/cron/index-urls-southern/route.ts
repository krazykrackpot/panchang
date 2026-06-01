/**
 * Cron endpoint — GROUP 3 of 3 staggered IndexNow cron families.
 * Pings ta + te + gu + kn URLs at 16:05 UTC daily.
 *
 * Lower per-locale traffic than the other two groups but all four
 * locales appeared in GSC Coverage Validation flagged-URL list for
 * the 2026-05-31 drop. Daily Bing/Yandex pings keep the regional
 * footprint visible.
 *
 * See `src/lib/seo/indexnow-urls.ts` for the URL builder + group
 * definitions; see `/api/cron/index-urls/route.ts` for the family
 * header comment explaining the 3-group split.
 *
 * Protected by CRON_SECRET header.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';
import {
  buildIndexNowPaths,
  INDEXNOW_GROUP_DRAVIDIAN_GU,
} from '@/lib/seo/indexnow-urls';

export const maxDuration = 30;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const paths = buildIndexNowPaths(INDEXNOW_GROUP_DRAVIDIAN_GU, today);
    const result = await submitUrlsToIndexNow(paths);

    console.log(
      `[index-urls southern ta+te+gu+kn] Submitted ${result.submitted} URLs, status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
    );

    return NextResponse.json(
      {
        group: 'southern',
        locales: INDEXNOW_GROUP_DRAVIDIAN_GU,
        submitted: result.submitted,
        indexNowStatus: result.status,
        ok: result.ok,
        ...(result.error ? { error: result.error } : {}),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[index-urls southern] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

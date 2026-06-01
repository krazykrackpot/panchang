/**
 * Cron endpoint — GROUP 2 of 3 staggered IndexNow cron families.
 * Pings mai + mr + bn URLs at 08:05 UTC daily.
 *
 * Maithili is per memory the #1 traffic driver and was one of the
 * locales hit hardest in the 2026-05-31 GSC drop. Bengali calendar
 * pages have ranked organically for `bangla calendar`; daily pings
 * keep Bing's index fresh.
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
  INDEXNOW_GROUP_DEVANAGARI_BN,
} from '@/lib/seo/indexnow-urls';

export const maxDuration = 30;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const today = new Date().toISOString().slice(0, 10);
    const paths = buildIndexNowPaths(INDEXNOW_GROUP_DEVANAGARI_BN, today);
    const result = await submitUrlsToIndexNow(paths);

    console.log(
      `[index-urls devanagari mai+mr+bn] Submitted ${result.submitted} URLs, status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
    );

    return NextResponse.json(
      {
        group: 'devanagari',
        locales: INDEXNOW_GROUP_DEVANAGARI_BN,
        submitted: result.submitted,
        indexNowStatus: result.status,
        ok: result.ok,
        ...(result.error ? { error: result.error } : {}),
      },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    console.error('[index-urls devanagari] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

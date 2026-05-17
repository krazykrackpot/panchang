/**
 * Cron endpoint: submits genuinely changing URLs to IndexNow so Bing, Yandex,
 * and Google crawl updated pages quickly.
 *
 * IMPORTANT: Bing warns against batch mode — only submit URLs whose content
 * actually changed TODAY (daily panchang, horoscope). Do NOT bulk-submit
 * hundreds of city pages daily — that triggers rate limiting and indexing delays.
 *
 * Schedule: 00:05 UTC daily (5 minutes after midnight).
 * Protected by CRON_SECRET header.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// Only en + hi for IndexNow — these are the primary traffic locales.
// Other locales get discovered via sitemap, not daily pings.
const INDEXNOW_LOCALES = ['en', 'hi'] as const;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const paths: string[] = [];
    const today = new Date().toISOString().slice(0, 10);

    for (const locale of INDEXNOW_LOCALES) {
      // Pages whose content genuinely changes daily:
      paths.push(`/${locale}/panchang`);                    // Daily panchang (dynamic title with tithi)
      paths.push(`/${locale}/rahu-kaal`);                   // Daily rahu kaal (dynamic title with times)
      paths.push(`/${locale}/horoscope`);                   // Daily horoscope hub
      paths.push(`/${locale}`);                             // Homepage (daily briefing)
      // Date-specific horoscope pages (new URL each day)
      const rashis = ['mesh','vrishabh','mithun','kark','simha','kanya','tula','vrishchik','dhanu','makar','kumbh','meen'];
      for (const r of rashis) {
        paths.push(`/${locale}/horoscope/${r}`);             // Daily rashi page (ISR refreshes)
        paths.push(`/${locale}/horoscope/${r}/${today}`);    // Today's date-specific URL
      }
    }

    // Total: ~58 URLs (2 locales × 29 paths) — lean, no batch bloat
    const result = await submitUrlsToIndexNow(paths);

    console.log(
      `[index-urls] Submitted ${result.submitted} URLs, status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
    );

    // Return 200 even if IndexNow rejected  –  cron failure should not be retried
    // aggressively for a non-critical SEO ping. The log above captures any issue.
    return NextResponse.json(
      {
        submitted: result.submitted,
        indexNowStatus: result.status,
        ok: result.ok,
        ...(result.error ? { error: result.error } : {}),
      },
      {
        headers: {
          // Never cache cron responses
          'Cache-Control': 'no-store',
        },
      },
    );
  } catch (err) {
    console.error('[index-urls] Unexpected error:', err);
    return NextResponse.json(
      { error: 'Internal error', detail: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

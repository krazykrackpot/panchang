/**
 * Cron endpoint: submits today's panchang URLs to IndexNow so Bing, Yandex,
 * and Google crawl new daily pages quickly.
 *
 * Schedule: 00:05 UTC daily (5 minutes after midnight — pages are live by then).
 * Protected by CRON_SECRET header (same pattern as all other cron routes).
 *
 * Active locales: en, hi, ta, bn (4 total).
 * City pages: 55 cities × 4 locales = 220 city URLs.
 * Plus main panchang + home pages per locale = 228 URLs per day.
 */

import { NextResponse } from 'next/server';
import { CITIES } from '@/lib/constants/cities';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';

// The 4 active locales served by this app.
// sa/te/kn/mr/gu/mai are NOT active — see CLAUDE.md feedback_four_locales.md
const ACTIVE_LOCALES = ['en', 'hi', 'ta', 'bn'] as const;

export async function GET(request: Request) {
  // Verify cron secret — same auth pattern used by all other cron routes
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET?.trim();
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const paths: string[] = [];

    for (const locale of ACTIVE_LOCALES) {
      // Home page
      paths.push(`/${locale}`);

      // Main panchang page (location-agnostic)
      paths.push(`/${locale}/panchang`);

      // City-specific panchang pages — one per city per locale
      for (const city of CITIES) {
        paths.push(`/${locale}/panchang/${city.slug}`);
      }
    }

    const result = await submitUrlsToIndexNow(paths);

    console.log(
      `[index-urls] Submitted ${result.submitted} URLs, status: ${result.status}` +
        (result.error ? `, error: ${result.error}` : ''),
    );

    // Return 200 even if IndexNow rejected — cron failure should not be retried
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

/**
 * Cron endpoint: submits genuinely changing URLs to IndexNow so Bing, Yandex,
 * and Google crawl updated pages quickly.
 *
 * IMPORTANT: Bing warns against batch mode — only submit URLs whose content
 * actually changed TODAY (daily panchang, horoscope). Do NOT bulk-submit
 * hundreds of city pages daily — that triggers rate limiting and indexing delays.
 *
 * We submit two flavours each run:
 *   1. **Daily-changing URLs** — content updates every day (panchang, rahu-kaal,
 *      horoscope hub + per-rashi + dated rashi). These NEED a daily ping.
 *   2. **Curated stable URLs** — high-value content pages (learn modules,
 *      tools, regional calendars). Their content doesn't change daily, but a
 *      periodic ping keeps Bing aware they exist (cf. Bing Webmaster's
 *      "important pages not submitted via IndexNow" recommendation). Total
 *      across both buckets is ~180 URLs/day, well under both IndexNow's
 *      10k/request cap and Bing's "no batch mode" threshold (their warning
 *      was aimed at the ~14k thin templated city pages, not curated hubs).
 *
 * Schedule: 00:05 UTC daily (5 minutes after midnight).
 * Protected by CRON_SECRET header.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { submitUrlsToIndexNow } from '@/lib/seo/indexnow';
import { TOP_FESTIVAL_SLUGS, FESTIVAL_VALID_YEARS } from '@/lib/calendar/festival-defs';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// Only en + hi for IndexNow — these are the primary traffic locales.
// Other locales get discovered via sitemap, not daily pings.
const INDEXNOW_LOCALES = ['en', 'hi'] as const;

// Curriculum: ancient-Indian-contributions slugs. Each is a static SEO page.
const CONTRIBUTION_SLUGS = [
  'al-khwarizmi', 'binary', 'calculus', 'cosmic-time', 'earth-rotation',
  'fibonacci', 'gravity', 'kerala-school', 'negative-numbers', 'pi',
  'pythagoras', 'sine', 'speed-of-light', 'timeline', 'zero',
] as const;

// Regional calendar landing pages — long-tail SEO for non-Hindi audiences.
const REGIONAL_CALENDARS = [
  'bengali', 'gujarati', 'iskcon', 'kannada', 'malayalam',
  'mithila', 'odia', 'tamil', 'telugu',
] as const;

// Stable tool landing pages — these don't change content daily but are
// high-intent landing pages worth keeping fresh in Bing's index.
const STABLE_TOOLS = [
  'sankalpa', 'sign-shift', 'sade-sati', 'varshaphal', 'kp-system',
  'prashna', 'baby-names', 'shraddha', 'dinacharya', 'kaal-sarp',
  'kaal-nirnaya', 'holashtak', 'chandra-darshan', 'chandrabalam',
  'financial-astrology', 'caesarean-muhurta', 'career-muhurta', 'muhurta-ai',
  'vedic-time', 'devotional', 'eclipses', 'retrograde', 'sarvatobhadra',
  'tropical-compare', 'choghadiya', 'gauri-panchang', 'hora',
  'sign-calculator', 'matching', 'kundali', 'pricing', 'about',
  'glossary', 'medical-astrology', 'learn',
] as const;

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    const paths: string[] = [];
    const today = new Date().toISOString().slice(0, 10);

    for (const locale of INDEXNOW_LOCALES) {
      // ── Bucket 1: daily-changing URLs ──────────────────────────────────
      paths.push(`/${locale}/panchang`);                    // Daily panchang (dynamic title with tithi)
      paths.push(`/${locale}/rahu-kaal`);                   // Daily rahu kaal (dynamic title with times)
      paths.push(`/${locale}/horoscope`);                   // Daily horoscope hub
      paths.push(`/${locale}`);                             // Homepage (daily briefing)
      const rashis = ['mesh','vrishabh','mithun','kark','simha','kanya','tula','vrishchik','dhanu','makar','kumbh','meen'];
      for (const r of rashis) {
        paths.push(`/${locale}/horoscope/${r}`);             // Daily rashi page (ISR refreshes)
        paths.push(`/${locale}/horoscope/${r}/${today}`);    // Today's date-specific URL
      }

      // ── Bucket 2: curated stable URLs ──────────────────────────────────
      for (const slug of CONTRIBUTION_SLUGS) {
        paths.push(`/${locale}/learn/contributions/${slug}`);
      }
      for (const r of REGIONAL_CALENDARS) {
        paths.push(`/${locale}/calendar/regional/${r}`);
      }
      for (const tool of STABLE_TOOLS) {
        paths.push(`/${locale}/${tool}`);
      }
      // Curriculum + reference hubs.
      paths.push(`/${locale}/calendar`);
      paths.push(`/${locale}/festivals`);
      paths.push(`/${locale}/learn/contributions`);

      // ── Bucket 3: festival × current+next year ────────────────────────
      // Mirrors Drik's strategy of keeping per-festival year pages fresh in
      // Bing's index. We ping only THIS year + NEXT year (not the full 5-year
      // window in our sitemap) because:
      //  - past-year festival pages are stable and already in Bing's index
      //  - current-year is the active high-intent query window
      //  - next-year captures the long-tail "diwali 2027" pre-search traffic
      // That's 20 festivals × 2 years × 2 locales = 80 URLs.
      // Filter against FESTIVAL_VALID_YEARS so we never submit a 404 URL —
      // routes outside that window call `notFound()`, and pinging 404s is
      // bad for our IndexNow reputation. As the calendar rolls past the
      // upper bound (currently 2029), this loop simply submits zero
      // festival URLs until festival-defs is bumped.
      const validYears = new Set<number>(FESTIVAL_VALID_YEARS);
      // Derive the year from the `today` string computed at the top of the
      // handler. Calling `new Date().getUTCFullYear()` here would build a
      // fresh Date and could race the midnight boundary against `today`
      // mid-cron-run.
      const currentYear = parseInt(today.slice(0, 4), 10);
      const nextYear = currentYear + 1;
      for (const fSlug of TOP_FESTIVAL_SLUGS) {
        for (const y of [currentYear, nextYear]) {
          if (validYears.has(y)) {
            paths.push(`/${locale}/festivals/${fSlug}/${y}`);
          }
        }
      }
    }

    // Total ~260 URLs/day (56 daily-changing + 124 curated stable + 80
    // festival current+next year, both locales). Well under IndexNow's
    // 10k/request cap and Bing's batch-rate trigger.
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
    // Drop `detail` — the console.error above retains the full message
    // for ops; returning err.message to the caller leaks internal state.
    // Audit Round 3.
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

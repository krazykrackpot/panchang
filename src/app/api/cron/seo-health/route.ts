/**
 * Cron endpoint — daily check for GSC click drops per locale.
 *
 * Why this exists
 * ---------------
 * On 2026-05-31 at 14:00 UTC clicks crashed -89% in one hour because
 * Marathi + Maithili pages emitted byte-identical Hindi titles. The
 * data was visible in GSC hourly within 4 hours but nobody looked
 * until traffic was clearly broken ~24h later. This cron closes the
 * detection-time gap: yesterday's clicks vs same-day-last-week, per
 * locale; if any locale drops >= the threshold, email the operator.
 *
 * Strategy
 * --------
 * 1. Pull yesterday's per-page clicks from GSC (page dimension).
 * 2. Pull same-day-last-week clicks.
 * 3. Aggregate by URL-prefix locale.
 * 4. Detect drops with a noise floor (`minBaselineClicks`) so low-
 *    volume locales don't spam.
 * 5. Email via Resend if any drops fired.
 *
 * Tuning
 * ------
 * Threshold + noise floor are env-overridable so an incident-response
 * playbook can dial them up/down without a deploy.
 *
 *   SEO_DROP_THRESHOLD       fraction 0..1, default 0.4
 *   SEO_MIN_BASELINE_CLICKS  integer,        default 50
 *   SEO_ALERT_TO             email,          default aditya.kr.jha@gmail.com
 *
 * Required GSC env (see src/lib/seo/gsc-client.ts):
 *   GOOGLE_OAUTH_CLIENT_ID, GOOGLE_OAUTH_CLIENT_SECRET, GSC_REFRESH_TOKEN
 *
 * Date offsets: target = T-3 days, baseline = T-10 days. GSC's
 * daily aggregate has a 24-48 hour processing latency, so querying
 * yesterday returns empty rows → false 100% drop alarm. T-3 is the
 * first reliably-settled day; T-10 gives the same day-of-week one
 * week prior (DoW matters because weekend traffic ≠ weekday).
 * (Gemini PR #337 cycle-1 CRITICAL.)
 *
 * Schedule: 07:00 UTC daily — sits comfortably past the GSC
 * settling window for T-3.
 */

import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getGscAccessToken, queryGsc, type GscRow } from '@/lib/seo/gsc-client';
import {
  aggregateByLocale,
  detectDrops,
  type LocaleDrop,
} from '@/lib/seo/health-detector';
import { sendEmail } from '@/lib/email/resend-client';

export const maxDuration = 60;

const DEFAULT_ALERT_TO = 'aditya.kr.jha@gmail.com';

function isoDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + daysOffset);
  return d.toISOString().slice(0, 10);
}

/**
 * Trim → reject empty → parse → require strictly positive finite.
 * Anything else returns the default. Closes the two Number(...) foot-
 * guns: `Number("")` is 0 (passes isFinite, fires alert spam), and
 * `Number("foo")` is NaN (passes nothing, disables detection).
 */
export function parsePositiveNumber(
  raw: string | undefined,
  fallback: number,
): number {
  const trimmed = raw?.trim();
  if (!trimmed) return fallback;
  const n = Number(trimmed);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

async function pageClicks(token: string, startDate: string, endDate: string): Promise<GscRow[]> {
  return queryGsc(token, {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: 25000,
  });
}

function renderAlertEmail(
  drops: LocaleDrop[],
  yesterdayDate: string,
  baselineDate: string,
): string {
  const rows = drops
    .map((d) => `
      <tr>
        <td style="padding:6px 12px;border:1px solid #555;"><b>/${d.locale}/</b></td>
        <td style="padding:6px 12px;border:1px solid #555;text-align:right;">${d.yesterdayClicks}</td>
        <td style="padding:6px 12px;border:1px solid #555;text-align:right;">${d.baselineClicks}</td>
        <td style="padding:6px 12px;border:1px solid #555;text-align:right;color:#ff6b6b;"><b>-${(d.dropFraction * 100).toFixed(1)}%</b></td>
      </tr>`)
    .join('');
  return `<!doctype html>
<html><body style="font-family:-apple-system,sans-serif;background:#0a0e27;color:#e6e2d8;padding:24px;">
  <h2 style="color:#d4a853;">GSC click drops detected</h2>
  <p>Comparing <b>${yesterdayDate}</b> vs <b>${baselineDate}</b> (same day, one week earlier).</p>
  <table style="border-collapse:collapse;margin:16px 0;">
    <thead>
      <tr style="background:#1a1f3a;">
        <th style="padding:6px 12px;border:1px solid #555;">Locale</th>
        <th style="padding:6px 12px;border:1px solid #555;">Yesterday clicks</th>
        <th style="padding:6px 12px;border:1px solid #555;">Baseline clicks</th>
        <th style="padding:6px 12px;border:1px solid #555;">Drop</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>
  <p>Diagnostic checklist:</p>
  <ol>
    <li>Confirm pages still serve 200 with valid content.</li>
    <li>URL Inspection the top affected URLs — look for "Discovered, not indexed" or canonical drift.</li>
    <li>Check the last deploy diff for SEO-sensitive changes (titles, hreflang, canonical, robots).</li>
    <li>If duplicate-content was introduced, the fix needs to land + Google needs to re-crawl. Recovery typically 2-4 weeks.</li>
  </ol>
  <p><a href="https://search.google.com/search-console?resource_id=sc-domain%3Adekhopanchang.com" style="color:#f0d48a;">Open Search Console</a></p>
</body></html>`;
}

export async function GET(request: Request) {
  const authError = verifyCronAuth(request);
  if (authError) return authError;

  try {
    // env tuning knobs. Two foot-guns to defend against:
    //   (a) Empty / whitespace string. `Number("")` returns 0, NOT
    //       NaN — so a bare `Number.isFinite()` check would accept it
    //       and set the threshold to 0, firing alerts every day for
    //       any change (Gemini PR #337 cycle-2 HIGH).
    //   (b) Non-numeric junk. `Number("foo")` returns NaN, which
    //       evaluates every comparison to false and silently disables
    //       detection (Gemini PR #337 cycle-1 MED).
    // Fix: trim, accept only non-empty strings that parse to a
    // positive number, with explicit range checks per knob. Anything
    // else falls back to the default.
    const dropThreshold = parsePositiveNumber(process.env.SEO_DROP_THRESHOLD, 0.4);
    const minBaselineClicks = parsePositiveNumber(process.env.SEO_MIN_BASELINE_CLICKS, 50);
    const alertTo = process.env.SEO_ALERT_TO?.trim() || DEFAULT_ALERT_TO;

    const token = await getGscAccessToken();
    // GSC daily aggregate has a 24-48h processing window. Target T-3
    // (first reliably-settled day) vs baseline T-10 (same day of week,
    // one week prior — DoW matters for traffic patterns).
    // (Gemini PR #337 cycle-1 CRITICAL.)
    const targetDate = isoDateOffset(-3);
    const baselineDate = isoDateOffset(-10);
    const [targetRows, baselineRows] = await Promise.all([
      pageClicks(token, targetDate, targetDate),
      pageClicks(token, baselineDate, baselineDate),
    ]);

    // `r.keys?.[0] ?? ''` — defensive against a GSC row with empty
    // `keys`. localeFromUrl handles the empty string by returning
    // null (no locale match) so it skips the row gracefully.
    // (Gemini PR #337 cycle-1 HIGH.)
    const yestAgg = aggregateByLocale(targetRows.map((r) => ({ url: r.keys?.[0] ?? '', clicks: r.clicks })));
    const baselineAgg = aggregateByLocale(baselineRows.map((r) => ({ url: r.keys?.[0] ?? '', clicks: r.clicks })));

    const drops = detectDrops(yestAgg, baselineAgg, { dropThreshold, minBaselineClicks });

    if (drops.length > 0) {
      const dropSummary = drops.map((d) => `/${d.locale}/=-${(d.dropFraction * 100).toFixed(1)}%`).join(' ');
      console.error(`[seo-health] ${drops.length} locale drop(s) on ${targetDate}: ${dropSummary}`);
      const email = await sendEmail({
        to: alertTo,
        subject: `[seo-health] ${drops.length} locale(s) dropped >${(dropThreshold * 100).toFixed(0)}% on ${targetDate}`,
        html: renderAlertEmail(drops, targetDate, baselineDate),
      });
      if (!email.success) {
        console.error('[seo-health] alert email send failed:', email.error);
      }
    } else {
      console.log(`[seo-health] no drops on ${targetDate}. target=${JSON.stringify(yestAgg)} baseline=${JSON.stringify(baselineAgg)}`);
    }

    return NextResponse.json({
      ok: true,
      targetDate,
      baselineDate,
      drops,
      targetClicksByLocale: yestAgg,
      baselineClicksByLocale: baselineAgg,
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[seo-health] failed:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500, headers: { 'Cache-Control': 'no-store' } },
    );
  }
}

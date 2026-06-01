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
 * Schedule: 07:00 UTC daily (GSC's daily aggregate has typically
 * settled by then, but is still fresh enough that the operator's
 * morning catches the alert).
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
    const dropThreshold = Number(process.env.SEO_DROP_THRESHOLD ?? 0.4);
    const minBaselineClicks = Number(process.env.SEO_MIN_BASELINE_CLICKS ?? 50);
    const alertTo = process.env.SEO_ALERT_TO?.trim() || DEFAULT_ALERT_TO;

    const token = await getGscAccessToken();
    const yesterday = isoDateOffset(-1);
    const baseline = isoDateOffset(-8);
    const [yestRows, baselineRows] = await Promise.all([
      pageClicks(token, yesterday, yesterday),
      pageClicks(token, baseline, baseline),
    ]);

    const yestAgg = aggregateByLocale(yestRows.map((r) => ({ url: r.keys[0], clicks: r.clicks })));
    const baselineAgg = aggregateByLocale(baselineRows.map((r) => ({ url: r.keys[0], clicks: r.clicks })));

    const drops = detectDrops(yestAgg, baselineAgg, { dropThreshold, minBaselineClicks });

    if (drops.length > 0) {
      const dropSummary = drops.map((d) => `/${d.locale}/=-${(d.dropFraction * 100).toFixed(1)}%`).join(' ');
      console.error(`[seo-health] ${drops.length} locale drop(s) on ${yesterday}: ${dropSummary}`);
      const email = await sendEmail({
        to: alertTo,
        subject: `[seo-health] ${drops.length} locale(s) dropped >${(dropThreshold * 100).toFixed(0)}% on ${yesterday}`,
        html: renderAlertEmail(drops, yesterday, baseline),
      });
      if (!email.success) {
        console.error('[seo-health] alert email send failed:', email.error);
      }
    } else {
      console.log(`[seo-health] no drops on ${yesterday}. yesterday=${JSON.stringify(yestAgg)} baseline=${JSON.stringify(baselineAgg)}`);
    }

    return NextResponse.json({
      ok: true,
      yesterday,
      baseline,
      drops,
      yesterdayClicksByLocale: yestAgg,
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

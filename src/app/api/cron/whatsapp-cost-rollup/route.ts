// Daily cron — snapshot WhatsApp MTD cost and alert/pause if cap reached.
//
// Schedule: vercel.json `"0 23 * * *"` — once a day at 23:00 UTC (04:30 IST).
// We choose a late-UTC time so the snapshot captures most of the day's
// sends and the operator gets a single end-of-day summary (instead of
// noisy mid-day alerts that the per-tick cron can already log).
//
// What this cron does:
//   1. Compute MTD cost via snapshotMtdCost()
//   2. If alertLevel = 'warn-80' or 'cap-100' AND we haven't already
//      alerted today, send an operator email
//   3. Always log the summary line (visible in Vercel logs as a daily
//      heartbeat)
//
// Auto-pause is enforced INLINE by the daily-send cron (it pre-checks
// MTD on every tick and writes status='skipped_budget' once cap hit).
// This cron's job is reporting, not enforcement — separating the two
// keeps the daily cron fast and avoids a circular dependency where the
// alert cron blocks the alert send cron.

import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { snapshotMtdCost, summarizeCost } from '@/lib/whatsapp/cost-rollup';
import { sendEmail } from '@/lib/email/resend-client';
import { todayInIst } from '@/lib/seo/regional-faq-dates';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  return handle(req);
}
export async function GET(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const authFail = verifyCronAuth(req);
  if (authFail) return authFail;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const snap = await snapshotMtdCost(supabase);
  const summary = summarizeCost(snap);
  // Single-line heartbeat in Vercel logs every day
  console.log(`[wa-cost-rollup] ${summary}`);

  // Operator alert — fire ONCE per day per alertLevel transition. We
  // dedupe by looking for an inbound_log row tagged with the alert key
  // sent today (re-use that table to avoid a new "operator_alerts"
  // table — phone_e164 column holds the alert key, message_body holds
  // the summary).
  const operatorEmail = (
    process.env.OPERATOR_ALERT_EMAIL ??
    process.env.EMAIL_ADMIN_BCC ??
    ''
  ).trim();

  let alertSent = false;
  if (snap.alertLevel !== 'none' && operatorEmail) {
    // Dedup key uses IST date so the 23:00 UTC cron tick (which lands at
    // 04:30 IST — between 00:00 and 05:30) keys to the same IST day as
    // an alert sent earlier the same IST evening. UTC date-slice would
    // off-by-one for IST pre-dawn ticks. (Gemini PR #706 round-4 HIGH)
    const todayKey = `wa-budget-${snap.alertLevel}-${todayInIst()}`;
    const { data: existing } = await supabase
      .from('whatsapp_inbound_log')
      .select('id')
      .eq('phone_e164', '+99999999999') // sentinel marker; never collides with real numbers
      .eq('classification', 'other')
      .ilike('message_body', `${todayKey}%`)
      .maybeSingle();
    if (!existing) {
      const subjectPrefix = snap.alertLevel === 'cap-100' ? '[CAP HIT]' : '[WARN 80%]';
      const result = await sendEmail({
        to: operatorEmail,
        subject: `${subjectPrefix} WhatsApp daily-panchang cost`,
        html: `
          <p>${summary}</p>
          <p>Status: <strong>${snap.alertLevel}</strong></p>
          ${snap.alertLevel === 'cap-100'
            ? '<p>The hourly cron is auto-skipping new sends. Existing subscribers will resume receiving messages on the 1st of next month, or sooner if you raise <code>WHATSAPP_MONTHLY_BUDGET_USD</code>.</p>'
            : '<p>Approaching the cap. No action required unless you want to raise <code>WHATSAPP_MONTHLY_BUDGET_USD</code> before sends are skipped at 100%.</p>'
          }
        `,
        // Don't BCC ourselves on operator alerts — avoids loops
        bcc: [],
      });
      if (result.success) {
        alertSent = true;
        // Mark the dedupe row
        await supabase.from('whatsapp_inbound_log').insert({
          phone_e164: '+99999999999',
          message_body: `${todayKey} ${summary}`,
          classification: 'other',
        });
      } else {
        console.error('[wa-cost-rollup] alert email failed:', result.error);
      }
    }
  }

  return NextResponse.json({
    ...snap,
    summary,
    alert_sent: alertSent,
  });
}

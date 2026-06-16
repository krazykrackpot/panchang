// POST /api/whatsapp/verify
//
// Verify the OTP the user received and flip their pending subscription to
// active (verified_at = now).
//
// Auth: Bearer token.
//
// Body: { code: "123456" }
//
// Response 200: { verified: true, subscription_id, phone_e164 }
// Response 400: invalid body / code format
// Response 401: unauthorized
// Response 404: no pending subscription for this user
// Response 410: code expired
// Response 422: code mismatch (max 5 attempts before forcing re-request)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyOtp } from '@/lib/whatsapp/otp';
import {
  nextScheduledSendUtc,
  resolveDefaultLocation,
  sendDailyForSubscription,
} from '@/lib/whatsapp/send-daily';
import { getMonthlyBudgetMicros } from '@/lib/whatsapp/cost-rollup';
import type { Locale } from '@/lib/i18n/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cap brute-force attempts at 5 per pending subscription. Stored in the
// DB column user_whatsapp_subscriptions.verification_attempts because
// in-memory state is unreliable in serverless: concurrent requests can be
// routed to different containers (bypassing the cap), and any container
// can be recycled at any time (resetting the counter).
// (Gemini PR #706 round-3 security-medium)
const MAX_ATTEMPTS = 5;

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const code = (body as Record<string, unknown>)?.code;
  if (typeof code !== 'string' || !/^\d{6}$/.test(code)) {
    return NextResponse.json({ error: 'code must be a 6-digit string' }, { status: 400 });
  }

  // Fetch the user's pending subscription. verification_attempts is the
  // DB-persisted brute-force counter (replaces the old in-memory Map per
  // Gemini PR #706 round-3 security-medium).
  const { data: sub, error: subErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('id, phone_e164, verification_code_hash, verification_expires_at, verification_attempts, verified_at')
    .eq('user_id', user.id)
    .is('opted_out_at', null)
    .maybeSingle();
  if (subErr) {
    console.error('[whatsapp/verify] subscription lookup failed:', subErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
  if (!sub) {
    return NextResponse.json({ error: 'No pending subscription. Please opt in first.' }, { status: 404 });
  }
  if (sub.verified_at) {
    return NextResponse.json(
      { verified: true, subscription_id: sub.id, phone_e164: sub.phone_e164, already_verified: true },
    );
  }
  if (!sub.verification_code_hash || !sub.verification_expires_at) {
    return NextResponse.json({ error: 'No pending code. Please request a new one.' }, { status: 404 });
  }
  if (new Date(sub.verification_expires_at).getTime() < Date.now()) {
    // Clear stale hash + reset attempts so a fresh /optin works cleanly
    await supabase
      .from('user_whatsapp_subscriptions')
      .update({
        verification_code_hash: null,
        verification_expires_at: null,
        verification_attempts: 0,
      })
      .eq('id', sub.id);
    return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 410 });
  }

  // Attempt cap — DB-backed. The read-then-write race window is tiny
  // (~10ms) and bounded by the 5-attempt cap; a determined attacker can
  // squeeze in maybe 1-2 extra attempts before the cap kicks in. For
  // pilot scale this is acceptable; if abused we'd swap to a Postgres
  // function with row-level locking (SELECT ... FOR UPDATE).
  const attempts = (sub.verification_attempts ?? 0) + 1;
  if (attempts > MAX_ATTEMPTS) {
    await supabase
      .from('user_whatsapp_subscriptions')
      .update({
        verification_code_hash: null,
        verification_expires_at: null,
        verification_attempts: 0,
      })
      .eq('id', sub.id);
    return NextResponse.json(
      { error: 'Too many attempts. Please request a new code.' },
      { status: 422 },
    );
  }
  // Increment now so subsequent racing requests see the higher count.
  await supabase
    .from('user_whatsapp_subscriptions')
    .update({ verification_attempts: attempts })
    .eq('id', sub.id);

  // Constant-time verify
  let matches = false;
  try {
    matches = await verifyOtp(code, sub.verification_code_hash);
  } catch (err) {
    console.error('[whatsapp/verify] hash compare failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
  if (!matches) {
    return NextResponse.json(
      { error: 'Incorrect code', attempts_remaining: MAX_ATTEMPTS - attempts },
      { status: 422 },
    );
  }

  // Success — flip verified_at, wipe the hash + reset attempts
  const { error: updateErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .update({
      verified_at: new Date().toISOString(),
      verification_code_hash: null,
      verification_expires_at: null,
      verification_attempts: 0,
    })
    .eq('id', sub.id);
  if (updateErr) {
    console.error('[whatsapp/verify] verified_at update failed:', updateErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  // ─── Immediate welcome send if next regular send is >12h away ────────
  // Rationale: predictable daily ritual beats marginal early-notification,
  // EXCEPT for the very first message. A user who verifies at 11:30 and
  // chose "6 AM" shouldn't wait 18.5h for proof that opt-in worked. If
  // the gap is <12h they get their first message at the normal time.
  //
  // We re-query the full subscription row to get send_time_local + tz +
  // locale + send_at_sunrise — fields we didn't select earlier.
  let welcomeSent = false;
  try {
    const { data: full } = await supabase
      .from('user_whatsapp_subscriptions')
      .select('id, user_id, phone_e164, locale, timezone, send_time_local, send_at_sunrise')
      .eq('id', sub.id)
      .single();
    if (full) {
      const next = nextScheduledSendUtc({
        timezone: full.timezone,
        send_time_local: full.send_time_local,
        send_at_sunrise: full.send_at_sunrise,
      });
      const hoursUntilNext = next
        ? (next.getTime() - Date.now()) / (60 * 60 * 1000)
        : 0;
      if (hoursUntilNext > 12) {
        // Pre-check budget — same cap the cron honours (shared helper
        // handles NaN / missing env safely).
        const monthlyBudgetMicros = getMonthlyBudgetMicros();
        const monthStart = new Date();
        monthStart.setUTCDate(1);
        monthStart.setUTCHours(0, 0, 0, 0);
        const { data: costRow } = await supabase
          .from('whatsapp_send_log')
          .select('cost_micros.sum()')
          .gte('sent_at', monthStart.toISOString())
          .not('status', 'in', '(skipped_budget,skipped_paused)')
          .single();
        const mtdCostMicros = Number(
          (costRow as { sum?: number | null } | null)?.sum ?? 0,
        );

        const loc = resolveDefaultLocation(full.locale as Locale);
        const outcome = await sendDailyForSubscription({
          supabase,
          sub: {
            id: full.id,
            user_id: full.user_id,
            phone_e164: full.phone_e164,
            locale: full.locale,
            timezone: full.timezone,
          },
          location: loc,
          panchangDate: new Date(),
          monthlyBudgetMicros,
          mtdCostMicros,
        });
        welcomeSent = outcome.status === 'sent';
      }
    }
  } catch (err) {
    // Welcome-send failure must NOT fail the verify response — the user
    // is verified successfully even if the welcome message couldn't go
    // out. Log + continue.
    console.error('[whatsapp/verify] welcome send failed (non-fatal):', err);
  }

  return NextResponse.json({
    verified: true,
    subscription_id: sub.id,
    phone_e164: sub.phone_e164,
    welcome_sent: welcomeSent,
  });
}

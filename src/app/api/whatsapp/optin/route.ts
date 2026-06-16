// POST /api/whatsapp/optin
//
// Create or refresh a pending-verification WhatsApp subscription for the
// authenticated user. Sends an OTP via WhatsApp template (whatsapp_otp_v1).
// User then POSTs to /api/whatsapp/verify with the code to flip
// `verified_at` and start receiving daily messages.
//
// Auth: Bearer token (Supabase access token in Authorization header).
//
// Body:
//   {
//     phone_e164: "+919876543210",
//     locale: "hi",
//     timezone: "Asia/Kolkata",
//     send_time_local: "06:00",       // top of the hour
//     send_at_sunrise: false
//   }
//
// Response 200:
//   { subscription_id: UUID, expires_at: ISO, dev_code?: "123456" }
//   (dev_code only in non-production for local testing)
//
// Response 4xx:
//   400 — validation errors
//   401 — unauthorized
//   409 — phone is already subscribed by a different user
//   429 — too many opt-in requests in 10 min
//   503 — server not configured (missing env)

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { validateOptin } from '@/lib/whatsapp/validation';
import { generateOtp, hashOtp, otpExpiresAt, OTP_VALIDITY_MINUTES } from '@/lib/whatsapp/otp';
import { sendTemplateMessage } from '@/lib/whatsapp/client';
import { TEMPLATES } from '@/lib/whatsapp/templates';
import { isWhatsAppBetaUser } from '@/lib/whatsapp/beta-gate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Throttle the same user to one opt-in request per minute (prevents OTP spam
// even if the UI's button is hammered).
const RECENT_REQUEST_WINDOW_MS = 60_000;

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  }

  // ─── Authenticate ─────────────────────────────────────────────────────
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ─── Phase 5: closed-beta gate ────────────────────────────────────────
  // Only users in WHATSAPP_BETA_USER_IDS (or "*") can opt in. Fail-closed
  // by default — if env is unset, nobody gets through.
  if (!isWhatsAppBetaUser(user.id)) {
    return NextResponse.json(
      { error: 'WhatsApp daily panchang is in closed beta. Get in touch if you want early access.' },
      { status: 403 },
    );
  }

  // ─── Validate body ────────────────────────────────────────────────────
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const v = validateOptin(body);
  if (!v.ok) {
    return NextResponse.json({ error: 'Validation failed', errors: v.errors }, { status: 400 });
  }
  const input = v.data;

  // ─── Check for active subscription owned by another user ──────────────
  // (The partial unique index would catch this at INSERT, but we surface a
  // clearer error before burning an OTP.)
  const { data: existingByPhone, error: phoneLookupErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('user_id, opted_out_at')
    .eq('phone_e164', input.phone_e164)
    .is('opted_out_at', null)
    .maybeSingle();
  if (phoneLookupErr) {
    console.error('[whatsapp/optin] phone lookup failed:', phoneLookupErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
  if (existingByPhone && existingByPhone.user_id !== user.id) {
    return NextResponse.json(
      { error: 'Phone already subscribed by a different account' },
      { status: 409 },
    );
  }

  // ─── Find or prepare the row ──────────────────────────────────────────
  // If the user has an existing pending row, we overwrite its OTP + phone
  // (allows fixing typos without manual cleanup). If they have an active
  // VERIFIED row, we refuse — they should opt out first.
  const { data: existingByUser } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('id, phone_e164, verified_at, opted_out_at, opted_in_at')
    .eq('user_id', user.id)
    .is('opted_out_at', null)
    .maybeSingle();

  if (existingByUser?.verified_at) {
    return NextResponse.json(
      {
        error: 'Already subscribed. Opt out first to change settings.',
        existing_phone: existingByUser.phone_e164,
      },
      { status: 409 },
    );
  }

  // ─── Throttle per-user opt-in frequency ───────────────────────────────
  if (existingByUser?.opted_in_at) {
    const sinceMs = Date.now() - new Date(existingByUser.opted_in_at).getTime();
    if (sinceMs < RECENT_REQUEST_WINDOW_MS) {
      const retryAfterSec = Math.ceil((RECENT_REQUEST_WINDOW_MS - sinceMs) / 1000);
      return NextResponse.json(
        { error: 'Too many opt-in attempts; please wait.', retry_after_seconds: retryAfterSec },
        { status: 429, headers: { 'Retry-After': String(retryAfterSec) } },
      );
    }
  }

  // ─── Generate OTP ─────────────────────────────────────────────────────
  const code = generateOtp();
  let codeHash: string;
  try {
    codeHash = await hashOtp(code);
  } catch (err) {
    console.error('[whatsapp/optin] OTP hash failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
  const expiresAt = otpExpiresAt();

  // ─── Upsert subscription row (service-role bypasses field-guard trigger) ───
  // For a new row: INSERT. For an existing pending row: UPDATE in place to
  // refresh the OTP without violating one_active_per_user.
  let subscriptionId: string;
  if (existingByUser) {
    // First field-guard trigger allows us to mutate verification_* + phone
    // because we run as service_role.
    const { data: updated, error: updateErr } = await supabase
      .from('user_whatsapp_subscriptions')
      .update({
        phone_e164: input.phone_e164,
        locale: input.locale,
        timezone: input.timezone,
        send_time_local: input.send_time_local,
        send_at_sunrise: input.send_at_sunrise,
        verification_code_hash: codeHash,
        verification_expires_at: expiresAt.toISOString(),
        verification_attempts: 0,
        verified_at: null,
        opted_in_at: new Date().toISOString(),
        opted_in_source: 'dashboard',
      })
      .eq('id', existingByUser.id)
      .select('id')
      .single();
    if (updateErr || !updated) {
      console.error('[whatsapp/optin] update failed:', updateErr);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    subscriptionId = updated.id;
  } else {
    const { data: inserted, error: insertErr } = await supabase
      .from('user_whatsapp_subscriptions')
      .insert({
        user_id: user.id,
        phone_e164: input.phone_e164,
        locale: input.locale,
        timezone: input.timezone,
        send_time_local: input.send_time_local,
        send_at_sunrise: input.send_at_sunrise,
        verification_code_hash: codeHash,
        verification_expires_at: expiresAt.toISOString(),
        opted_in_source: 'dashboard',
      })
      .select('id')
      .single();
    if (insertErr || !inserted) {
      console.error('[whatsapp/optin] insert failed:', insertErr);
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
    subscriptionId = inserted.id;
  }

  // ─── Send OTP via WhatsApp template ───────────────────────────────────
  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(' ')[0] ||
    user.email?.split('@')[0] ||
    'there';

  try {
    const sendResult = await sendTemplateMessage({
      to: input.phone_e164,
      templateName: TEMPLATES.whatsapp_otp_v1.name,
      templateLang: 'en',
      bodyParams: [firstName, code],
    });
    if (!sendResult.ok) {
      // Roll back: clear the OTP so the user can retry. We don't delete the
      // row to preserve the throttle window.
      await supabase
        .from('user_whatsapp_subscriptions')
        .update({ verification_code_hash: null, verification_expires_at: null })
        .eq('id', subscriptionId);
      const isInvalidPhone = ['131026', '131051'].includes(sendResult.errorCode ?? '');
      return NextResponse.json(
        {
          error: isInvalidPhone
            ? 'This phone number is not on WhatsApp'
            : 'Failed to send OTP via WhatsApp',
          code: sendResult.errorCode,
        },
        { status: isInvalidPhone ? 400 : 502 },
      );
    }
  } catch (err) {
    console.error('[whatsapp/optin] template send threw:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 502 });
  }

  const responseBody: Record<string, unknown> = {
    subscription_id: subscriptionId,
    expires_at: expiresAt.toISOString(),
    validity_minutes: OTP_VALIDITY_MINUTES,
  };
  // In non-production, return the dev code so local testing doesn't need a
  // real WhatsApp inbox. Production never reveals the code.
  if (process.env.NODE_ENV !== 'production') {
    responseBody.dev_code = code;
  }
  return NextResponse.json(responseBody);
}

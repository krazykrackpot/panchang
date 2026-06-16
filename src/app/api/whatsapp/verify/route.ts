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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Cap brute-force attempts at 5 per pending subscription before we wipe the
// hash and force a new /optin request. Stored in-memory per-pid for now;
// production scale would need Redis. At pilot (25 users) in-memory is fine.
const attemptCounter = new Map<string, number>();
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

  // Fetch the user's pending subscription
  const { data: sub, error: subErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .select('id, phone_e164, verification_code_hash, verification_expires_at, verified_at')
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
    // Clear stale hash so a fresh /optin works cleanly
    await supabase
      .from('user_whatsapp_subscriptions')
      .update({ verification_code_hash: null, verification_expires_at: null })
      .eq('id', sub.id);
    return NextResponse.json({ error: 'Code expired. Please request a new one.' }, { status: 410 });
  }

  // Attempt cap
  const attempts = (attemptCounter.get(sub.id) ?? 0) + 1;
  if (attempts > MAX_ATTEMPTS) {
    await supabase
      .from('user_whatsapp_subscriptions')
      .update({ verification_code_hash: null, verification_expires_at: null })
      .eq('id', sub.id);
    attemptCounter.delete(sub.id);
    return NextResponse.json(
      { error: 'Too many attempts. Please request a new code.' },
      { status: 422 },
    );
  }
  attemptCounter.set(sub.id, attempts);

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

  // Success — flip verified_at and wipe the hash
  const { error: updateErr } = await supabase
    .from('user_whatsapp_subscriptions')
    .update({
      verified_at: new Date().toISOString(),
      verification_code_hash: null,
      verification_expires_at: null,
    })
    .eq('id', sub.id);
  if (updateErr) {
    console.error('[whatsapp/verify] verified_at update failed:', updateErr);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }

  attemptCounter.delete(sub.id);

  return NextResponse.json({
    verified: true,
    subscription_id: sub.id,
    phone_e164: sub.phone_e164,
  });
}

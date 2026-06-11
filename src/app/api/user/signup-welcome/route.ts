/**
 * POST /api/user/signup-welcome
 *
 * Sends the immediate post-signup welcome email — the chart-independent
 * variant. Fires once per user from the /auth/callback page after a
 * successful sign-in (Google OAuth or email confirmation).
 *
 * Why this exists
 * ---------------
 * The original welcome email (src/lib/email/templates/welcome.ts) requires
 * chart data (moon sign, nakshatra, ascendant) and is sent from
 * /api/user/profile only on first-snapshot creation. Users who sign up but
 * never generate a chart silently received no welcome at all — leaving the
 * 7-day onboarding drip's Day 1 as the only post-signup contact, and that
 * arrives next morning at 8 UTC (up to 24 hours after signup).
 *
 * This route closes that gap by sending Day-1 content immediately on
 * successful auth callback. It also claims onboarding_drip_day = 1 on the
 * same row, which makes the drip cron skip Day 1 (the cron's claim filter
 * is `onboarding_drip_day < dripDay`, so a row at 1 is invisible to Day 1's
 * claim).
 *
 * Idempotency
 * -----------
 * Guarded by user_profiles.signup_welcome_sent_at (migration 035). The
 * atomic claim pattern is: UPDATE ... SET signup_welcome_sent_at = now()
 * WHERE id = $1 AND signup_welcome_sent_at IS NULL — only the first
 * invocation that observes NULL claims the send. Concurrent /auth/callback
 * mounts (the page re-runs on session refresh) and accidental client retries
 * are safe.
 *
 * Auth
 * ----
 * Same Bearer-token pattern as /api/user/profile: client passes the Supabase
 * access token; server reads the JWT to authenticate. No service-role usage.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { getOnboardingEmail } from '@/lib/email/onboarding-templates';
import { locales, type Locale } from '@/lib/i18n/config';

export const maxDuration = 15;

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
  if (authError || !user || !user.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Body is optional — locale defaults to 'en' if absent or invalid.
  // Validating against the visible-locales whitelist closes any open-redirect
  // / arbitrary-template-selection vector via a crafted body.
  let bodyLocale = 'en';
  try {
    const body = await req.json().catch(() => ({}));
    if (typeof body?.locale === 'string') bodyLocale = body.locale;
  } catch { /* invalid JSON body — fall through with default */ }
  const locale: Locale = (locales as readonly string[]).includes(bodyLocale)
    ? (bodyLocale as Locale)
    : 'en';

  // Atomically claim the send. .select() forces PostgREST to return the
  // updated rows so we can tell whether we actually claimed (length === 1)
  // or another concurrent invocation claimed it already (length === 0).
  // Same pattern as the welcome-email claim in /api/user/profile and the
  // drip-day claim in /api/cron/onboarding-drip.
  const { data: claimed, error: claimErr } = await supabase
    .from('user_profiles')
    .update({
      signup_welcome_sent_at: new Date().toISOString(),
      // Coincidentally claiming Day 1 so the cron will skip it tomorrow
      // (the cron filter is `onboarding_drip_day < dripDay`, so a row at
      // 1 is invisible to Day 1's claim). Without this we'd send TWO
      // welcomes to the user within 24 hours.
      onboarding_drip_day: 1,
    })
    .eq('id', user.id)
    .is('signup_welcome_sent_at', null)
    .select('id, display_name');

  if (claimErr) {
    console.error('[signup-welcome] claim failed:', claimErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }
  if (!claimed || claimed.length === 0) {
    // Already sent on a prior /auth/callback invocation — silent success.
    return NextResponse.json({ ok: true, sent: false, reason: 'already_sent' });
  }

  const displayName = claimed[0]?.display_name
    || (user.user_metadata as Record<string, unknown> | undefined)?.full_name as string | undefined
    || (user.user_metadata as Record<string, unknown> | undefined)?.name as string | undefined
    || user.email.split('@')[0];

  const template = getOnboardingEmail(1, locale, { name: displayName });

  const result = await sendEmail({
    to: user.email,
    subject: template.subject,
    html: template.html,
  });

  if (!result.success) {
    // Roll back the claim so the next /auth/callback retry (or the cron
    // tomorrow morning) can send. Same rollback pattern as the cron.
    const { error: rollbackErr } = await supabase
      .from('user_profiles')
      .update({ signup_welcome_sent_at: null, onboarding_drip_day: 0 })
      .eq('id', user.id);
    if (rollbackErr) {
      console.error('[signup-welcome] rollback failed (Resend send already failed):', rollbackErr.message);
    }
    console.error('[signup-welcome] send failed:', result.error);
    return NextResponse.json({ error: 'Email send failed' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, sent: true });
}

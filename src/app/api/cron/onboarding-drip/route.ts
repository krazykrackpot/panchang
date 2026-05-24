import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { getOnboardingEmail } from '@/lib/email/onboarding-templates';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

/**
 * Daily cron: sends 7-day onboarding drip emails to new users.
 * Runs at 8 AM UTC (1:30 PM IST).
 */
export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  // Get users who signed up in last 7 days
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentUsers, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id, display_name, created_at, onboarding_drip_day')
    .gte('created_at', sevenDaysAgo);

  if (fetchError) {
    console.error('[OnboardingDrip] Fetch error:', fetchError.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!recentUsers || recentUsers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, usersChecked: 0 });
  }

  let sent = 0;
  let failedCount = 0;

  for (const user of recentUsers) {
    const createdAt = new Date(user.created_at);
    const daysSinceSignup = Math.floor(
      (Date.now() - createdAt.getTime()) / (24 * 60 * 60 * 1000),
    );
    const dripDay = daysSinceSignup + 1; // Day 1 = signup day

    if (dripDay < 1 || dripDay > 7) continue;

    // Skip if already sent this day's email
    const lastDripDay = user.onboarding_drip_day || 0;
    if (dripDay <= lastDripDay) continue;

    // Get authoritative email from auth.users (user_profiles.email may be stale/missing)
    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(user.id);
    if (!authUser?.email) { continue; }

    // Determine locale from email domain or default to 'en'
    const locale: 'en' | 'hi' = 'en';

    try {
      const template = getOnboardingEmail(
        dripDay as 1 | 2 | 3 | 4 | 5 | 6 | 7,
        locale,
        { name: user.display_name || undefined },
      );

      // P1-18 — CLAIM-FIRST, send-after. Previously sent email first then
      // updated drip_day; any update failure (RLS, row-gone, network blip)
      // left the email sent but drip_day not advanced → next cron run
      // re-sends. Vercel cron retries on its own HTTP failure too — a
      // 30-min outage produces 2 attempts, both day-N emails.
      //
      // Now: atomically claim the day with a conditional WHERE — only the
      // first invocation that observes onboarding_drip_day < dripDay wins.
      // Multiple parallel cron invocations (and tomorrow's run if the email
      // succeeded today) all see count=0 and skip. Then send the email only
      // if we claimed it. If the email subsequently fails, roll back so the
      // next run retries (same "claim-then-act with rollback on failure"
      // pattern as Sprint 2's email-alerts fix).
      const { error: claimErr, count: claimCount } = await supabase
        .from('user_profiles')
        .update({ onboarding_drip_day: dripDay }, { count: 'exact' })
        .eq('id', user.id)
        .lt('onboarding_drip_day', dripDay);

      if (claimErr) {
        console.error('[OnboardingDrip] drip_day claim failed for', user.id, ':', claimErr.message);
        failedCount++;
        continue;
      }
      if (claimCount !== 1) {
        // Another invocation claimed it already, or the row was deleted.
        // Silent skip — not an error.
        continue;
      }

      const result = await sendEmail({
        to: authUser.email,
        subject: template.subject,
        html: template.html,
      });

      if (!result.success) {
        console.error('[OnboardingDrip] sendEmail failed for', user.id, ':', result.error);
        // Roll back the drip_day claim so tomorrow's run can retry.
        const { error: rollbackErr } = await supabase
          .from('user_profiles')
          .update({ onboarding_drip_day: lastDripDay })
          .eq('id', user.id)
          .eq('onboarding_drip_day', dripDay);
        if (rollbackErr) {
          console.error('[OnboardingDrip] drip_day rollback failed for', user.id, ':', rollbackErr.message);
        }
        failedCount++;
        continue;
      }

      sent++;
    } catch (err) {
      // Log server-side; the response stays generic — do NOT echo user ids
      // or stack traces back in the JSON (PII + schema recon).
      console.error('[OnboardingDrip] Failed for user', user.id, ':', err);
      failedCount++;
    }
  }

  return NextResponse.json({
    success: true,
    usersChecked: recentUsers.length,
    sent,
    failed: failedCount,
  });
}

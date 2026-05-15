import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { getOnboardingEmail } from '@/lib/email/onboarding-templates';

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
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  if (!recentUsers || recentUsers.length === 0) {
    return NextResponse.json({ success: true, sent: 0, usersChecked: 0 });
  }

  let sent = 0;
  const errors: string[] = [];

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

      const result = await sendEmail({
        to: authUser.email,
        subject: template.subject,
        html: template.html,
      });

      if (!result.success) {
        errors.push(`User ${user.id}: ${result.error}`);
        continue;
      }

      // Update drip day
      await supabase
        .from('user_profiles')
        .update({ onboarding_drip_day: dripDay })
        .eq('id', user.id);

      sent++;
    } catch (err) {
      console.error(`[OnboardingDrip] Failed for user ${user.id}:`, err);
      errors.push(`User ${user.id}: ${String(err)}`);
    }
  }

  return NextResponse.json({
    success: true,
    usersChecked: recentUsers.length,
    sent,
    ...(errors.length > 0 ? { errors } : {}),
  });
}

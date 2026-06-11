import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { getOnboardingEmail } from '@/lib/email/onboarding-templates';
import { locales, type Locale } from '@/lib/i18n/config';

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

  // Get users who signed up in last 7 days.
  // P2-39 — also pull `preferred_locale` so the drip emails go out in the
  // user's chosen language. The column has a CHECK constraint older than
  // the current locale list (only en/hi/sa allowed in the DB today); we
  // accept the stored value if it's a still-supported locale, otherwise
  // fall back to `en`. The DB constraint widening is tracked separately.
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
  const { data: recentUsers, error: fetchError } = await supabase
    .from('user_profiles')
    .select('id, display_name, created_at, onboarding_drip_day, preferred_locale')
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

    // Get authoritative email from auth.users (user_profiles.email may be stale/missing).
    // Round 3 R3-SF-5 — capture the admin error so a DB / admin-token blip
    // doesn't silently drop every user from the day's drip. Previously the
    // sustained-outage shape was "usersChecked: N, sent: 0" indistinguishable
    // from a healthy "all already-sent" state.
    const { data: { user: authUser }, error: adminErr } = await supabase.auth.admin.getUserById(user.id);
    if (adminErr) {
      console.error('[OnboardingDrip] getUserById failed for', user.id, ':', adminErr.message);
      continue;
    }
    if (!authUser?.email) { continue; }

    // P2-39 — read preferred_locale from the user_profiles row. Falls
    // back to 'en' if the column is null OR holds a value the onboarding
    // template doesn't cover yet. (Template uses `isDevanagariLocale` to
    // pick between Devanagari + English copy, so non-Devanagari regional
    // languages all land on 'en' — same as the previous hardcoded
    // behaviour but now the Hindi-speaking users get Hindi.)
    const preferred = (user as { preferred_locale?: string | null }).preferred_locale ?? 'en';
    const locale: Locale = (locales as readonly string[]).includes(preferred)
      ? (preferred as Locale)
      : 'en';

    // Chart-nudge swap on Day 3 + Day 5: if the user hasn't generated a
    // birth chart by these checkpoints, replace the regular drip content
    // with a focused chart-nudge email. Same drip cadence — no extra email
    // volume — just a re-targeted message for chart-less users at the two
    // points where the regular content (Day 3 cultural / Day 5 modules) is
    // less relevant than getting them past the chart-form friction.
    //
    // Day 3 is the first follow-up reminder; Day 5 is the gentler last
    // touch. Days 4 + 6 + 7 are intentionally NOT nudged: Day 4 (eclipse)
    // gracefully degrades without chart data, Day 6 (dasha) does too, and
    // Day 7 is the family-charts pitch which works either way.
    let hasChart = true;
    if (dripDay === 3 || dripDay === 5) {
      const { count: chartCount, error: chartCountErr } = await supabase
        .from('saved_charts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id);
      if (chartCountErr) {
        // Conservative: on a count-query failure, fall through to the
        // regular drip template rather than guessing chart-less. The
        // chart-nudge path is opt-in correctness — defaulting to the
        // existing path preserves prior behaviour on DB blips.
        console.error('[OnboardingDrip] chart count failed for', user.id, ':', chartCountErr.message);
      } else {
        hasChart = (chartCount ?? 0) > 0;
      }
    }

    try {
      const template = (dripDay === 3 && !hasChart)
        ? (await import('@/lib/email/templates/chart-nudge')).chartNudgeDay3(locale, user.display_name || undefined)
        : (dripDay === 5 && !hasChart)
          ? (await import('@/lib/email/templates/chart-nudge')).chartNudgeDay5(locale, user.display_name || undefined)
          : getOnboardingEmail(
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
      // P1-18 + Gemini #142 — Handle NULL drip_day. SQL `NULL < value` is
      // UNKNOWN (not TRUE), so `.lt(...)` alone would never match brand-
      // new users whose drip_day hasn't been initialised → Day 1 never
      // sent. `.or(lt | is null)` catches both states.
      const { error: claimErr, count: claimCount } = await supabase
        .from('user_profiles')
        .update({ onboarding_drip_day: dripDay }, { count: 'exact' })
        .eq('id', user.id)
        .or(`onboarding_drip_day.lt.${dripDay},onboarding_drip_day.is.null`);

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

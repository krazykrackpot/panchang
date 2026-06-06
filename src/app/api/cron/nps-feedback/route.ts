/**
 * GET /api/cron/nps-feedback
 *
 * Daily cron job (recommended 09:00 UTC = 14:30 IST = lunch hour for
 * Indian audience, mid-morning for European audience). Sends a one-time
 * NPS / feedback email to every user who has hit one of two engagement
 * triggers at least 3 days ago AND has not been emailed yet:
 *
 *   1. Saved a chart on `saved_charts` (first real chart save), OR
 *   2. Paid a Brihaspati question (`payment_verified=true`).
 *
 * 3-day delay gives the user time to actually use the product before
 * we ask for feedback. Sending sooner is too eager.
 *
 * Dedup: `user_profiles.nps_feedback_sent_at` (migration 042). Pattern
 * is the same "claim-first, send-after, rollback-on-failure" used by
 * /api/cron/onboarding-drip — atomically claim the row before sending
 * so duplicate cron invocations cannot double-send.
 *
 * Privacy contract: this job does NOT read Brihaspati question/answer
 * content. It only checks the metadata flags (payment_verified,
 * created_at, user_id) needed to decide who to email.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { npsFeedbackEmail, classifyEngagement } from '@/lib/email/templates/nps-feedback';

export const maxDuration = 60;

interface Candidate {
  user_id: string;
  has_chart: boolean;
  has_brihaspati: boolean;
}

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const threeDaysAgo = new Date(Date.now() - 3 * 86_400_000).toISOString();
  const dryRun = req.nextUrl.searchParams.get('dry') === '1';

  // 1. Start from the small set of users with nps_feedback_sent_at IS NULL.
  //    The partial index in migration 042 makes this fast even with a large
  //    profiles table; "pending" users at any given moment are bounded by
  //    new-signup throughput (typically tens, not thousands). Querying the
  //    triggers tables first would scan their entire history and run into
  //    the Supabase client's 1000-row default limit, silently dropping
  //    eligible users once those tables grow past 1000 rows. Gemini #221.
  const { data: pendingProfiles, error: pendingErr } = await supabase
    .from('user_profiles')
    .select('id, display_name')
    .is('nps_feedback_sent_at', null);

  if (pendingErr) {
    console.error('[NpsFeedback] pending profiles fetch error:', pendingErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!pendingProfiles || pendingProfiles.length === 0) {
    return NextResponse.json({ success: true, pendingProfiles: 0, eligible: 0, sent: 0, dryRun });
  }

  const pendingIds = pendingProfiles.map((p) => p.id);

  // 2. For these users only, check which trigger(s) fired 3+ days ago.
  //    Filtering by user_id keeps both queries bounded by `pendingIds.length`
  //    regardless of how large saved_charts or brihaspati_questions become.
  const { data: chartRows, error: chartErr } = await supabase
    .from('saved_charts')
    .select('user_id')
    .in('user_id', pendingIds)
    .lt('created_at', threeDaysAgo);

  if (chartErr) {
    console.error('[NpsFeedback] saved_charts fetch error:', chartErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // Privacy: select only the metadata columns needed to decide eligibility.
  // We do NOT read the question / answer text.
  const { data: brihaspatiRows, error: brihaspatiErr } = await supabase
    .from('brihaspati_questions')
    .select('user_id')
    .in('user_id', pendingIds)
    .eq('payment_verified', true)
    .lt('created_at', threeDaysAgo);

  if (brihaspatiErr) {
    console.error('[NpsFeedback] brihaspati_questions fetch error:', brihaspatiErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  // Merge by user_id, mark which trigger(s) fired.
  const byUser = new Map<string, Candidate>();
  for (const r of chartRows ?? []) {
    const u = r.user_id as string;
    const c = byUser.get(u) ?? { user_id: u, has_chart: false, has_brihaspati: false };
    c.has_chart = true;
    byUser.set(u, c);
  }
  for (const r of brihaspatiRows ?? []) {
    const u = r.user_id as string;
    const c = byUser.get(u) ?? { user_id: u, has_chart: false, has_brihaspati: false };
    c.has_brihaspati = true;
    byUser.set(u, c);
  }

  if (byUser.size === 0) {
    return NextResponse.json({ success: true, pendingProfiles: pendingProfiles.length, eligible: 0, sent: 0, dryRun });
  }

  // The eligible set is the intersection: pending users who hit a trigger.
  const eligible = pendingProfiles.filter((p) => byUser.has(p.id));

  let sent = 0;
  let failedCount = 0;
  const dryRunPreview: Array<{ user_id: string; email: string; engagement: string }> = [];

  for (const profile of eligible) {
    const candidate = byUser.get(profile.id);
    if (!candidate) continue;
    const engagement = classifyEngagement({
      hasChart: candidate.has_chart,
      hasBrihaspati: candidate.has_brihaspati,
    });

    // Get the authoritative email from auth.users — user_profiles may be
    // missing it for OAuth users. Same pattern as /api/cron/onboarding-drip.
    const { data: { user: authUser }, error: adminErr } = await supabase.auth.admin.getUserById(profile.id);
    if (adminErr) {
      console.error('[NpsFeedback] getUserById failed for', profile.id, ':', adminErr.message);
      failedCount++;
      continue;
    }
    if (!authUser?.email) continue;

    if (dryRun) {
      dryRunPreview.push({ user_id: profile.id, email: authUser.email, engagement });
      continue;
    }

    // 3. Atomically claim the send. Only the first invocation that observes
    //    nps_feedback_sent_at IS NULL wins. Duplicate cron runs (or two
    //    invocations of the same run racing) all see count=0 and skip.
    const now = new Date().toISOString();
    const { error: claimErr, count: claimCount } = await supabase
      .from('user_profiles')
      .update({ nps_feedback_sent_at: now }, { count: 'exact' })
      .eq('id', profile.id)
      .is('nps_feedback_sent_at', null);

    if (claimErr) {
      console.error('[NpsFeedback] claim failed for', profile.id, ':', claimErr.message);
      failedCount++;
      continue;
    }
    if (claimCount !== 1) continue; // someone else claimed it; silent skip.

    const template = npsFeedbackEmail({
      displayName: profile.display_name || '',
      engagement,
      userId: profile.id,
    });

    const result = await sendEmail({
      to: authUser.email,
      subject: template.subject,
      html: template.html,
    });

    if (!result.success) {
      console.error('[NpsFeedback] sendEmail failed for', profile.id, ':', result.error);
      // Roll back the claim so tomorrow's run retries.
      const { error: rollbackErr } = await supabase
        .from('user_profiles')
        .update({ nps_feedback_sent_at: null })
        .eq('id', profile.id)
        .eq('nps_feedback_sent_at', now);
      if (rollbackErr) {
        console.error('[NpsFeedback] rollback failed for', profile.id, ':', rollbackErr.message);
      }
      failedCount++;
      continue;
    }

    sent++;
  }

  return NextResponse.json({
    success: true,
    pendingProfiles: pendingProfiles.length,
    eligible: eligible.length,
    sent,
    failed: failedCount,
    dryRun,
    ...(dryRun ? { dryRunPreview } : {}),
  });
}

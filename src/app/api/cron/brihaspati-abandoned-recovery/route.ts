/**
 * GET /api/cron/brihaspati-abandoned-recovery
 *
 * Daily cron job. Sends a one-time "complete your reading" email to
 * every user who:
 *
 *   - Opened a Brihaspati Stripe Checkout (payment_ref LIKE 'cs_live_%')
 *   - Did NOT complete payment (payment_verified=false, status='pending')
 *   - Did so 30+ hours ago (Stripe session expires after 24h; the 6h
 *     buffer lets late webhook deliveries land before we email)
 *   - Did so within the last 14 days (older intent is too stale to nudge)
 *   - Hasn't received a recovery email yet (abandoned_recovery_sent_at IS NULL)
 *
 * Dedupe: `brihaspati_questions.abandoned_recovery_sent_at` (migration 064).
 * Same claim-first-send-after-rollback-on-failure pattern as
 * /api/cron/nps-feedback.
 *
 * Privacy contract: this job does NOT read the question text or any
 * answer. It only checks the metadata flags (status, payment_verified,
 * payment_ref prefix, created_at, user_id) needed to decide who to email.
 *
 * Dry run: append `?dry=1` to preview eligibility without sending.
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { brihaspatiAbandonedEmail } from '@/lib/email/templates/brihaspati-abandoned';

export const maxDuration = 60;

const HOURS_30 = 30 * 60 * 60 * 1000;
const DAYS_14 = 14 * 24 * 60 * 60 * 1000;

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const dryRun = req.nextUrl.searchParams.get('dry') === '1';
  const now = Date.now();
  const olderThan = new Date(now - HOURS_30).toISOString();
  const newerThan = new Date(now - DAYS_14).toISOString();

  const { data: candidateRows, error: selErr } = await supabase
    .from('brihaspati_questions')
    .select('id, user_id, created_at')
    .eq('status', 'pending')
    .eq('payment_verified', false)
    .like('payment_ref', 'cs_live_%')
    .is('abandoned_recovery_sent_at', null)
    .lt('created_at', olderThan)
    .gt('created_at', newerThan)
    .order('created_at', { ascending: true })
    .limit(200);

  if (selErr) {
    console.error('[brihaspati-abandoned-recovery] candidate query failed:', selErr.message);
    return NextResponse.json({ error: 'DB error' }, { status: 500 });
  }

  if (!candidateRows || candidateRows.length === 0) {
    return NextResponse.json({ success: true, candidates: 0, users: 0, sent: 0, failed: 0, dryRun });
  }

  // Bundle by user — a user with N pending abandoned questions gets ONE
  // email, and we mark all N rows so future runs don't re-nudge for the
  // same intent burst. New abandonments past the 30h threshold get
  // picked up on the next run.
  const userIds = Array.from(new Set(candidateRows.map((r) => String(r.user_id))));

  let sent = 0;
  let failed = 0;
  let skipped = 0;
  const dryPreview: Array<{ userId: string; email: string; questionCount: number }> = [];

  for (const userId of userIds) {
    const userRowIds = candidateRows
      .filter((r) => String(r.user_id) === userId)
      .map((r) => String(r.id));

    const { data: { user: authUser }, error: adminErr } = await supabase.auth.admin.getUserById(userId);
    if (adminErr) {
      console.error('[brihaspati-abandoned-recovery] getUserById failed for', userId, ':', adminErr.message);
      failed++;
      continue;
    }
    if (!authUser?.email) {
      skipped++;
      continue;
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name')
      .eq('id', userId)
      .maybeSingle();
    const displayName = (profile?.display_name as string | null | undefined) ?? '';

    if (dryRun) {
      dryPreview.push({ userId, email: authUser.email, questionCount: userRowIds.length });
      continue;
    }

    // Atomic claim: flip every still-NULL row for this user. The
    // IS NULL predicate gates concurrent cron invocations — only the
    // first one observes the rows and flips them; others see count=0.
    const claimedAt = new Date().toISOString();
    const { error: claimErr, count: claimCount } = await supabase
      .from('brihaspati_questions')
      .update({ abandoned_recovery_sent_at: claimedAt }, { count: 'exact' })
      .in('id', userRowIds)
      .is('abandoned_recovery_sent_at', null);

    if (claimErr) {
      console.error('[brihaspati-abandoned-recovery] claim failed for user', userId, ':', claimErr.message);
      failed++;
      continue;
    }
    if (!claimCount || claimCount === 0) {
      skipped++;
      continue;
    }

    const template = brihaspatiAbandonedEmail({ displayName });
    const result = await sendEmail({
      to: authUser.email,
      subject: template.subject,
      html: template.html,
      bcc: [],
    });

    if (!result.success) {
      console.error('[brihaspati-abandoned-recovery] sendEmail failed for user', userId, ':', result.error);
      const { error: rollbackErr } = await supabase
        .from('brihaspati_questions')
        .update({ abandoned_recovery_sent_at: null })
        .in('id', userRowIds)
        .eq('abandoned_recovery_sent_at', claimedAt);
      if (rollbackErr) {
        console.error('[brihaspati-abandoned-recovery] rollback failed for user', userId, ':', rollbackErr.message);
      }
      failed++;
      continue;
    }

    sent++;
  }

  return NextResponse.json({
    success: true,
    candidates: candidateRows.length,
    users: userIds.length,
    sent,
    failed,
    skipped,
    dryRun,
    ...(dryRun ? { dryPreview } : {}),
  });
}

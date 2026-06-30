/**
 * GET  /api/feedback/nps-inapp   → eligibility check
 * POST /api/feedback/nps-inapp   → submit score OR dismiss without scoring
 *
 * In-app companion to the email NPS prompt. Resend tells us 96% of
 * NPS emails are delivered but our `nps_endpoint_log` shows ~1.3%
 * click-through — Gmail buries the message in Promotions and nobody
 * looks. This route gives logged-in users a frictionless way to score
 * us from inside the app once that email window has lapsed.
 *
 * Eligibility (server-decided, never trust the client):
 *   1. Signed in
 *   2. user_profiles.nps_feedback_sent_at IS NOT NULL  AND  ≥7 days old
 *   3. user_profiles.nps_modal_shown_at  IS NULL       (not yet seen)
 *   4. No existing nps_responses row for this user, ANY source
 *      (covers users who already clicked the email button — we don't
 *      want to re-prompt them)
 *
 * On any POST we set nps_modal_shown_at, so a refresh+resubmit can't
 * spam the operator notification. Even a dismiss writes the column.
 *
 * Privacy contract: same as the email NPS endpoint. We never inspect
 * Brihaspati question/answer content — only metadata flags.
 *
 * Source label: rows from this route write `source='nps_inapp'` so
 * they coexist with `source='nps_email'` on the
 * (user_id, source) UNIQUE index (migration 022 / 069).
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';

const SOURCE = 'nps_inapp';
const MIN_DAYS_SINCE_EMAIL = 7;
const OPERATOR_ADDRESS = process.env.NPS_OPERATOR_EMAIL?.trim() || 'aditya.kr.jha@gmail.com';

const SubmitBody = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('submit'),
    score: z.number().int().min(0).max(10),
    reason: z.string().trim().max(2000).optional(),
  }),
  z.object({ action: z.literal('dismiss') }),
]);

type Outcome = 'success' | 'invalid_score' | 'db_error';

function bearerToken(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;
  const t = authHeader.slice(7).trim();
  return t.length > 0 ? t : null;
}

async function logEndpointHit(
  supabase: ReturnType<typeof getServerSupabase>,
  outcome: Outcome,
  userId: string | null,
  score: number | null,
  req: NextRequest,
): Promise<void> {
  // Reuse the same audit table as the email endpoint so a single query
  // (`SELECT outcome, COUNT(*) FROM nps_endpoint_log GROUP BY outcome`)
  // shows the funnel across both channels.
  if (!supabase) return;
  try {
    const { error } = await supabase.from('nps_endpoint_log').insert({
      user_id: userId,
      score,
      outcome,
      ip_hash: null, // in-app users are already authenticated; IP hash isn't a useful anti-abuse signal here
      user_agent: req.headers.get('user-agent')?.slice(0, 200) ?? null,
    });
    if (error) console.error('[feedback/nps-inapp] audit log insert returned error:', error.message);
  } catch (err) {
    console.error('[feedback/nps-inapp] audit log insert threw:', err);
  }
}

interface Eligibility {
  eligible: boolean;
  sent_at: string | null;
  shown_at: string | null;
  already_responded: boolean;
}

async function checkEligibility(
  supabase: NonNullable<ReturnType<typeof getServerSupabase>>,
  userId: string,
): Promise<Eligibility> {
  const { data: profile, error: profileErr } = await supabase
    .from('user_profiles')
    .select('nps_feedback_sent_at, nps_modal_shown_at')
    .eq('id', userId)
    .maybeSingle();
  if (profileErr) {
    console.error('[feedback/nps-inapp] profile read failed:', profileErr.message);
    return { eligible: false, sent_at: null, shown_at: null, already_responded: false };
  }
  const sentAt = profile?.nps_feedback_sent_at ?? null;
  const shownAt = profile?.nps_modal_shown_at ?? null;

  // Has the user already clicked an email NPS button? Don't re-prompt.
  const { count: existingResponses, error: respErr } = await supabase
    .from('nps_responses')
    .select('id', { head: true, count: 'exact' })
    .eq('user_id', userId);
  if (respErr) console.error('[feedback/nps-inapp] response count failed:', respErr.message);
  const alreadyResponded = (existingResponses ?? 0) > 0;

  const sentLongEnoughAgo =
    sentAt !== null &&
    Date.now() - new Date(sentAt).getTime() >= MIN_DAYS_SINCE_EMAIL * 86_400_000;
  const eligible = sentLongEnoughAgo && shownAt === null && !alreadyResponded;

  return { eligible, sent_at: sentAt, shown_at: shownAt, already_responded: alreadyResponded };
}

export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const token = bearerToken(req);
  if (!token) return NextResponse.json({ eligible: false }, { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ eligible: false }, { status: 401 });

  const elig = await checkEligibility(supabase, user.id);
  return NextResponse.json(elig);
}

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: z.infer<typeof SubmitBody>;
  try {
    const raw = await req.json();
    body = SubmitBody.parse(raw);
  } catch (err) {
    await logEndpointHit(supabase, 'invalid_score', user.id, null, req);
    return NextResponse.json(
      { error: 'Invalid body', detail: err instanceof Error ? err.message : 'parse error' },
      { status: 400 },
    );
  }

  // Re-check eligibility server-side. The client only TRIES to show the
  // modal; this stops a stale tab or replay from writing a duplicate row.
  const elig = await checkEligibility(supabase, user.id);
  if (!elig.eligible) {
    // Idempotent-style response: not eligible isn't an error, just a no-op.
    return NextResponse.json({ ok: true, skipped: 'not_eligible' });
  }

  // Always mark shown BEFORE write — even on dismiss, even if subsequent
  // write fails. The contract is "shown once, period." A retry just gives
  // {skipped:'not_eligible'} on the next call.
  const nowIso = new Date().toISOString();
  const { error: markErr } = await supabase
    .from('user_profiles')
    .update({ nps_modal_shown_at: nowIso })
    .eq('id', user.id)
    .is('nps_modal_shown_at', null);
  if (markErr) {
    console.error('[feedback/nps-inapp] mark shown failed:', markErr.message);
    await logEndpointHit(supabase, 'db_error', user.id, null, req);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (body.action === 'dismiss') {
    return NextResponse.json({ ok: true, dismissed: true });
  }

  // Submit path: upsert nps_responses (source='nps_inapp'), notify operator.
  const { error: upsertErr } = await supabase
    .from('nps_responses')
    .upsert(
      { user_id: user.id, score: body.score, reason: body.reason ?? null, source: SOURCE },
      { onConflict: 'user_id,source' },
    );
  if (upsertErr) {
    console.error('[feedback/nps-inapp] upsert failed:', upsertErr.message);
    await logEndpointHit(supabase, 'db_error', user.id, body.score, req);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  await logEndpointHit(supabase, 'success', user.id, body.score, req);

  // Operator notify — awaited inside try/catch. Same rationale as the
  // email endpoint: the serverless container suspends the moment we
  // return, so a true fire-and-forget Promise risks being killed
  // mid-fetch. Failure is logged but doesn't fail the user's submit.
  try {
    await notifyOperator(supabase, user.id, body.score, body.reason);
  } catch (err) {
    console.error('[feedback/nps-inapp] operator notify failed:', err);
  }

  return NextResponse.json({ ok: true, score: body.score });
}

async function notifyOperator(
  supabase: NonNullable<ReturnType<typeof getServerSupabase>>,
  userId: string,
  score: number,
  reason: string | undefined,
): Promise<void> {
  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser?.user?.email ?? '(unknown)';
  const category = score >= 9 ? 'PROMOTER' : score <= 6 ? 'DETRACTOR' : 'PASSIVE';
  const subject = `[NPS ${score} · in-app] ${category} from ${email}`;
  const reasonBlock = reason
    ? `<tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;vertical-align:top;">Reason</td><td style="padding:4px 0;white-space:pre-wrap;">${escapeHtml(reason)}</td></tr>`
    : '';
  const html = `
    <div style="font-family:-apple-system,sans-serif;color:#0a0e27;">
      <p>NPS captured from the in-app modal.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">Score</td><td style="padding:4px 0;"><strong>${score}</strong> (${category})</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">User</td><td style="padding:4px 0;">${escapeHtml(email)}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">User id</td><td style="padding:4px 0;font-family:monospace;">${userId}</td></tr>
        ${reasonBlock}
      </table>
    </div>
  `.trim();
  await sendEmail({ to: OPERATOR_ADDRESS, subject, html });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

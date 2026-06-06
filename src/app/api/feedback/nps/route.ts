/**
 * GET /api/feedback/nps?score=N&token=T
 *
 * The endpoint each score button in the NPS email points at. Verifies
 * the per-user HMAC token, validates the score (0..10), upserts a row
 * into `nps_responses`, fires off an operator notification email
 * (fire-and-forget), and redirects the user to /feedback/thanks.
 *
 * Replaces the previous `mailto:` flow — recipients only needed to
 * tap a button instead of composing an email, which collapsed friction
 * enough that we can hope to actually collect feedback (87 NPS emails
 * went out April→June with zero replies via the old flow).
 *
 * Privacy / abuse: the token is per-user HMAC-signed (src/lib/nps/token.ts)
 * so anyone who didn't receive the email can't fabricate a score for
 * another user. The token signs only the user_id, not the score, so the
 * recipient can legitimately change their mind from the same email —
 * the `(user_id, source)` UNIQUE constraint + upsert path handles it.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyNpsToken } from '@/lib/nps/token';
import { sendEmail } from '@/lib/email/resend-client';

const OPERATOR_ADDRESS = process.env.NPS_OPERATOR_EMAIL?.trim() || 'aditya.kr.jha@gmail.com';

function redirectTo(req: NextRequest, path: string): NextResponse {
  // Use the request's origin to build the redirect target so dev
  // (http://localhost:3000) and prod (https://dekhopanchang.com) both
  // land on their respective thanks page. URL ctor is cheap.
  const url = new URL(path, req.nextUrl.origin);
  return NextResponse.redirect(url, { status: 303 });
}

export async function GET(req: NextRequest) {
  const scoreRaw = req.nextUrl.searchParams.get('score');
  const token = req.nextUrl.searchParams.get('token');

  // Score must parse to an integer in [0, 10]. Anything else 400s rather
  // than redirecting — a bad score in a freshly-clicked email button
  // means our template is broken and we want to surface that.
  if (scoreRaw === null) {
    return NextResponse.json({ error: 'Missing score' }, { status: 400 });
  }
  const score = Number.parseInt(scoreRaw, 10);
  if (!Number.isInteger(score) || score < 0 || score > 10 || String(score) !== scoreRaw) {
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  const userId = verifyNpsToken(token);
  if (!userId) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  // Upsert on (user_id, source). Latest click wins — a respondent who
  // changes their mind from 7 to 9 lands at 9, not at both. The trigger
  // bumps updated_at automatically.
  const { error: upsertErr } = await supabase
    .from('nps_responses')
    .upsert(
      { user_id: userId, score, source: 'nps_email' },
      { onConflict: 'user_id,source' },
    );

  if (upsertErr) {
    console.error('[feedback/nps] upsert failed:', upsertErr.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  // Operator notification — AWAITED inside try/catch. The serverless
  // container can suspend the moment we return the redirect, so a true
  // fire-and-forget Promise risks being killed mid-network-call (the
  // whole reason we're capturing the score is so the operator HEARS
  // about it). A failed notify is logged but doesn't abort the user's
  // happy-path redirect — they shouldn't see an error because our
  // email backend is down.
  try {
    await notifyOperator(supabase, userId, score);
  } catch (err) {
    console.error('[feedback/nps] operator notify failed:', err);
  }

  return redirectTo(req, `/feedback/thanks?score=${score}`);
}

async function notifyOperator(
  supabase: ReturnType<typeof getServerSupabase>,
  userId: string,
  score: number,
): Promise<void> {
  if (!supabase) return;

  const { data: authUser } = await supabase.auth.admin.getUserById(userId);
  const email = authUser?.user?.email ?? '(unknown)';
  const signedUpAt = authUser?.user?.created_at ?? '(unknown)';
  const category =
    score >= 9 ? 'PROMOTER' : score <= 6 ? 'DETRACTOR' : 'PASSIVE';

  const subject = `[NPS ${score}] ${category} from ${email}`;
  const html = `
    <div style="font-family:-apple-system,sans-serif;color:#0a0e27;">
      <p>New NPS click captured.</p>
      <table style="border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">Score</td><td style="padding:4px 0;"><strong>${score}</strong> (${category})</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">User</td><td style="padding:4px 0;">${email}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">User id</td><td style="padding:4px 0;font-family:monospace;">${userId}</td></tr>
        <tr><td style="padding:4px 12px 4px 0;color:#6a6a6a;">Signed up</td><td style="padding:4px 0;">${signedUpAt}</td></tr>
      </table>
      <p style="font-size:13px;color:#6a6a6a;margin-top:24px;">
        If the recipient adds a reason via the mailto follow-up, it will land
        at <a href="mailto:namaste@dekhopanchang.com">namaste@dekhopanchang.com</a>
        as a separate message.
      </p>
    </div>
  `.trim();

  await sendEmail({ to: OPERATOR_ADDRESS, subject, html });
}

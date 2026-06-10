/**
 * GET /api/feedback/nps?score=N&token=T
 *
 * The endpoint each score button in the NPS email points at. Verifies
 * the per-user HMAC token, validates the score (0..10), upserts a row
 * into `nps_responses`, fires off an operator notification email
 * (fire-and-forget), and redirects the user to /feedback/thanks.
 *
 * Every code path — success, invalid_score, invalid_token, db_error,
 * no_db — also writes one row to `nps_endpoint_log` (migration 063)
 * so we can see the funnel even when nothing lands in nps_responses.
 * Built after the 2026-06-06 silent-invalidation incident: 87 in-flight
 * NPS emails had their tokens invalidated by a secret rotation, every
 * click returned 400, and the absence of nps_responses rows looked
 * indistinguishable from "no one clicked." Audit logging is the
 * observability that would have flagged it on day 1.
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
import { createHmac } from 'node:crypto';
import { getServerSupabase } from '@/lib/supabase/server';
import { verifyNpsToken } from '@/lib/nps/token';
import { sendEmail } from '@/lib/email/resend-client';
import { getClientIP } from '@/lib/api/rate-limit';

const OPERATOR_ADDRESS = process.env.NPS_OPERATOR_EMAIL?.trim() || 'aditya.kr.jha@gmail.com';
// Per-deployment salt for IP hashing. Falls back to NPS_TOKEN_SECRET so
// a deploy that has NPS infra at all also has the salt source. Plain
// sha256(ip) is brute-forceable in seconds against the ~4-billion IPv4
// keyspace; salting with a server-only secret makes the rainbow-table
// attack require knowing the secret. Gemini #666 MED-security.
function getIpHashSalt(): string {
  return (
    process.env.NPS_IP_HASH_SALT?.trim() ||
    process.env.NPS_TOKEN_SECRET?.trim() ||
    'unsalted-fallback-disable-in-prod'
  );
}

type Outcome = 'success' | 'invalid_token' | 'invalid_score' | 'db_error' | 'no_db';

function redirectTo(req: NextRequest, path: string): NextResponse {
  const url = new URL(path, req.nextUrl.origin);
  return NextResponse.redirect(url, { status: 303 });
}

/** HMAC-SHA256(salt, ip)[:16] — enough to dedupe spam from one source
 *  without storing the actual IP. Returns null when the IP can't be
 *  derived. Salted with a server secret so reverse-lookup against the
 *  small IPv4 keyspace requires knowing the salt. Gemini #666 MED. */
function hashIp(req: NextRequest): string | null {
  try {
    const ip = getClientIP(req);
    if (!ip || ip.startsWith('unknown')) return null;
    return createHmac('sha256', getIpHashSalt()).update(ip).digest('hex').slice(0, 16);
  } catch {
    return null;
  }
}

/** Best-effort audit write. Errors are logged but never block the
 *  user response — the route's job is to capture the click; if the
 *  audit fails the user shouldn't see anything different.
 *
 *  Supabase `.insert()` does NOT throw on database-level failures
 *  (RLS rejection, FK violation, etc.) — it returns `{ error }`.
 *  The try/catch alone would silently swallow those; explicitly
 *  destructure + log. Gemini #666 MED. */
async function logEndpointHit(
  supabase: ReturnType<typeof getServerSupabase>,
  outcome: Outcome,
  userId: string | null,
  score: number | null,
  req: NextRequest,
): Promise<void> {
  if (!supabase) return; // no_db outcome reaches here too — nothing to write to
  try {
    const { error } = await supabase.from('nps_endpoint_log').insert({
      user_id: userId,
      score,
      outcome,
      ip_hash: hashIp(req),
      user_agent: req.headers.get('user-agent')?.slice(0, 200) ?? null,
    });
    if (error) {
      console.error('[feedback/nps] audit log insert returned error:', error.message);
    }
  } catch (err) {
    console.error('[feedback/nps] audit log insert threw:', err);
  }
}

export async function GET(req: NextRequest) {
  const scoreRaw = req.nextUrl.searchParams.get('score');
  const token = req.nextUrl.searchParams.get('token');

  // DB connection is needed for both the upsert and the audit log; if
  // it isn't configured we can't even record the click. Return early
  // with `no_db` and skip audit write (no DB to write it to).
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  // Score must parse to an integer in [0, 10]. Anything else 400s rather
  // than redirecting — a bad score in a freshly-clicked email button
  // means our template is broken and we want to surface that.
  if (scoreRaw === null) {
    await logEndpointHit(supabase, 'invalid_score', null, null, req);
    return NextResponse.json({ error: 'Missing score' }, { status: 400 });
  }
  const score = Number.parseInt(scoreRaw, 10);
  if (!Number.isInteger(score) || score < 0 || score > 10 || String(score) !== scoreRaw) {
    await logEndpointHit(supabase, 'invalid_score', null, null, req);
    return NextResponse.json({ error: 'Invalid score' }, { status: 400 });
  }

  const userId = verifyNpsToken(token);
  if (!userId) {
    // Log the failed verify with the score the user picked — operator
    // can see "user picked 7 but token failed" patterns even without
    // knowing who the user was. This is the signal that would have
    // surfaced the 2026-06-06 rotation incident in minutes instead
    // of days.
    await logEndpointHit(supabase, 'invalid_token', null, score, req);
    return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
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
    await logEndpointHit(supabase, 'db_error', userId, score, req);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  await logEndpointHit(supabase, 'success', userId, score, req);

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

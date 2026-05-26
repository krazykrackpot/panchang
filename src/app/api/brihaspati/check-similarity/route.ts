/**
 * POST /api/brihaspati/check-similarity
 *
 * Read-only pre-flight: given a question text and a Bearer token,
 * returns any of the caller's recent brihaspati_questions whose
 * similarity to the new question is ≥ NEAR_DUPLICATE_THRESHOLD within
 * the last DUPLICATE_LOOKBACK_MINUTES.
 *
 * Used by the panel UI BEFORE creating any payment intent — lets the
 * client show "looks like you just asked this — view previous answer
 * or pay for a new one?" without committing to a charge.
 *
 * The actual payment-creating route (/api/brihaspati/order) ALSO
 * enforces this server-side (returns 409 with the same shape unless
 * `confirmDuplicate: true` is passed). This endpoint is convenience,
 * not the security boundary.
 *
 * Body: { question: string }
 * Returns: { duplicates: Array<{ questionId, similarity, minutesAgo, status }> }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  findNearDuplicates,
  DUPLICATE_LOOKBACK_MINUTES,
  type DuplicateCandidate,
} from '@/lib/brihaspati/similarity';
import { checkRateLimit, getClientIP } from '@/lib/api/rate-limit';

export async function POST(req: NextRequest) {
  try {
    // IP rate-limit. The similarity check itself is cheap, but
    // unbounded calls would let an unauthenticated attacker probe
    // for user-question text by brute-force. Cap matches the other
    // brihaspati-adjacent routes.
    const ip = getClientIP(req);
    const { allowed, resetAt } = checkRateLimit(ip, { maxRequests: 60, windowMs: 60000 });
    if (!allowed) {
      const retryAfter = Math.max(1, Math.ceil((resetAt - Date.now()) / 1000));
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429, headers: { 'X-RateLimit-Remaining': '0', 'Retry-After': String(retryAfter) } },
      );
    }

    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Not configured' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Destructure `data` first; the inner `.user` access on a nullable
    // `data` (network blip or odd auth-client return) would otherwise
    // throw TypeError before we hit the error check. Defensive per
    // Gemini PR #190 review.
    const { data, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    const user = data?.user;
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: { question?: unknown };
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const question = typeof body.question === 'string' ? body.question.trim() : '';
    if (!question || question.length < 3 || question.length > 500) {
      return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
    }

    const lookbackIso = new Date(Date.now() - DUPLICATE_LOOKBACK_MINUTES * 60 * 1000).toISOString();
    const { data: recent, error: recentErr } = await supabase
      .from('brihaspati_questions')
      .select('id, question, status, created_at')
      .eq('user_id', user.id)
      .neq('status', 'abandoned')
      .gt('created_at', lookbackIso)
      .order('created_at', { ascending: false })
      .limit(20);
    if (recentErr) {
      console.error('[brihaspati/check-similarity] lookback query failed:', recentErr.message);
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const candidates: DuplicateCandidate[] = (recent ?? []).map((r) => ({
      questionId: String(r.id),
      question: String(r.question ?? ''),
      status: String(r.status ?? ''),
      createdAt: String(r.created_at ?? ''),
    }));
    const dups = findNearDuplicates(question, candidates);

    return NextResponse.json({ duplicates: dups });
  } catch (err) {
    console.error('[brihaspati/check-similarity] handler failed:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

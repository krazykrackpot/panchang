/**
 * POST /api/brihaspati/share/enable
 *
 * Flips `is_public_share = true` on a question the user owns, then
 * returns a URL anyone can open to view the question + answer.
 *
 * Body: { questionId: string }
 * Returns: { shareUrl: string }
 *
 * Idempotent: calling twice on the same question returns the same URL
 * and is a no-op on the row after the first call.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL?.trim() || 'https://dekhopanchang.com').replace(/\/$/, '');

// UUID v4 shape — strict so we don't trip Postgres's
// "invalid input syntax for type uuid" error (which lands as a 500
// when we wanted a clean 400).
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(req: NextRequest) {
  try {
    const supabase = getServerSupabase();
    if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Parse + shape-check the body. req.json() accepts null / strings /
    // arrays as valid JSON; without the object guard a top-level null
    // would later TypeError on .questionId access (Gemini PR #209).
    let body: { questionId?: unknown; locale?: unknown };
    try {
      const parsed = await req.json();
      if (!parsed || typeof parsed !== 'object') {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
      }
      body = parsed as typeof body;
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    const questionId = typeof body.questionId === 'string' ? body.questionId : '';
    const locale = typeof body.locale === 'string' && /^[a-z]{2}$/.test(body.locale) ? body.locale : 'en';
    if (!questionId || !UUID_RE.test(questionId)) {
      return NextResponse.json({ error: 'Invalid or missing questionId' }, { status: 400 });
    }

    // Verify ownership AND that the answer body actually exists before
    // we open public access — sharing a still-streaming or errored row
    // would expose an incomplete artefact.
    const { data: row, error: rowErr } = await supabase
      .from('brihaspati_questions')
      .select('id, user_id, status, answer')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (rowErr) {
      console.error('[brihaspati/share/enable] lookup failed:', rowErr.message);
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
    }
    if (!row) return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    if (row.status !== 'completed' || typeof row.answer !== 'string' || row.answer.length === 0) {
      return NextResponse.json({ error: 'Answer not ready' }, { status: 409 });
    }

    const { error: updateErr } = await supabase
      .from('brihaspati_questions')
      .update({ is_public_share: true })
      .eq('id', questionId)
      .eq('user_id', user.id);
    if (updateErr) {
      console.error('[brihaspati/share/enable] update failed:', updateErr.message);
      return NextResponse.json({ error: 'Failed to enable share' }, { status: 500 });
    }

    return NextResponse.json({
      shareUrl: `${SITE_URL}/${locale}/brihaspati/answer/${questionId}`,
    });
  } catch (err) {
    console.error('[brihaspati/share/enable] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

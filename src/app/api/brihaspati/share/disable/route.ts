/**
 * POST /api/brihaspati/share/disable
 *
 * Inverse of /share/enable — flips `is_public_share = false` on a
 * question the user owns, so the public URL stops resolving and any
 * stale CDN-cached copy expires within an hour (s-maxage on the
 * public GET endpoint).
 *
 * Body: { questionId: string }
 * Returns: { ok: true } on success
 *
 * Idempotent: calling on an already-disabled (or never-shared) row is
 * a no-op and still returns 200. Calling on a question the user
 * doesn't own returns 404 — same shape as enable, no information leak
 * about other users' question IDs.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

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

    let body: { questionId?: unknown };
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

    const questionId = typeof body.questionId === 'string' ? body.questionId : '';
    if (!questionId) return NextResponse.json({ error: 'Missing questionId' }, { status: 400 });

    // Verify ownership before we touch the row. We deliberately don't
    // check is_public_share first — making the disable call idempotent
    // means the client can call it without first racing to read state.
    const { data: row, error: rowErr } = await supabase
      .from('brihaspati_questions')
      .select('id')
      .eq('id', questionId)
      .eq('user_id', user.id)
      .maybeSingle();
    if (rowErr) {
      console.error('[brihaspati/share/disable] lookup failed:', rowErr.message);
      return NextResponse.json({ error: 'Lookup failed' }, { status: 500 });
    }
    if (!row) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    const { error: updateErr } = await supabase
      .from('brihaspati_questions')
      .update({ is_public_share: false })
      .eq('id', questionId)
      .eq('user_id', user.id);
    if (updateErr) {
      console.error('[brihaspati/share/disable] update failed:', updateErr.message);
      return NextResponse.json({ error: 'Failed to disable share' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[brihaspati/share/disable] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

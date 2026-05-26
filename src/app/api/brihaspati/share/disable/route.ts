/**
 * POST /api/brihaspati/share/disable
 *
 * Inverse of /share/enable — flips `is_public_share = false` on a
 * question the user owns, so the public URL stops resolving and any
 * stale CDN-cached copy expires within 60 seconds (s-maxage on the
 * public GET endpoint at /api/brihaspati/share/[id]).
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
    let body: { questionId?: unknown };
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
    if (!questionId || !UUID_RE.test(questionId)) {
      return NextResponse.json({ error: 'Invalid or missing questionId' }, { status: 400 });
    }

    // Atomic ownership-gated update — single round-trip. RLS-equivalent
    // gate via .eq('user_id', user.id) ensures the row only updates if
    // the asker actually owns it. .select('id').maybeSingle() returns
    // the row id when the update matched, null when no row qualified
    // (either the id doesn't exist OR isn't owned by this user). We
    // collapse both into a 404 — same shape as /share/enable; no
    // information leak about other users' question IDs.
    const { data: row, error: updateErr } = await supabase
      .from('brihaspati_questions')
      .update({ is_public_share: false })
      .eq('id', questionId)
      .eq('user_id', user.id)
      .select('id')
      .maybeSingle();
    if (updateErr) {
      console.error('[brihaspati/share/disable] update failed:', updateErr.message);
      return NextResponse.json({ error: 'Failed to disable share' }, { status: 500 });
    }
    if (!row) return NextResponse.json({ error: 'Question not found' }, { status: 404 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[brihaspati/share/disable] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

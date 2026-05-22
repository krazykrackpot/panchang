/**
 * POST /api/brihaspati/rating
 *
 * Records the user's thumbs-up/down on an answer. Feeds the §11
 * training-data flywheel — only rows with rating >= 0 become
 * training_eligible.
 *
 * Body: { questionId: string, rating: -1 | 0 | 1, reason?: string }
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

    let body: { questionId?: unknown; rating?: unknown; reason?: unknown };
    try { body = await req.json(); }
    catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }); }

    const questionId = typeof body.questionId === 'string' ? body.questionId : '';
    const rating = body.rating;
    const reason = typeof body.reason === 'string' ? body.reason.slice(0, 500) : null;

    if (!questionId) return NextResponse.json({ error: 'Missing questionId' }, { status: 400 });
    if (rating !== -1 && rating !== 0 && rating !== 1) {
      return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
    }

    const { error } = await supabase
      .from('brihaspati_questions')
      .update({ user_rating: rating, user_rating_reason: reason })
      .eq('id', questionId)
      .eq('user_id', user.id);

    if (error) {
      console.error('[brihaspati/rating] update failed:', error.message);
      return NextResponse.json({ error: 'Failed to save rating' }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[brihaspati/rating] error:', err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

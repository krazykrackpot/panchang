// src/app/api/user/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user }, error: authError } = await sb.auth.getUser(authHeader.slice(7));
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [{ data: progress, error: pErr }, { data: badges, error: bErr }] = await Promise.all([
      sb.from('user_progress').select('*').eq('user_id', user.id).maybeSingle(),
      sb.from('user_badges').select('badge_slug, earned_at').eq('user_id', user.id),
    ]);
    if (pErr) console.error('[api/user/progress] progress read failed:', pErr);
    if (bErr) console.error('[api/user/progress] badges read failed:', bErr);

    return NextResponse.json({
      progress: progress ?? null,
      badges: badges ?? [],
    });
  } catch (err) {
    console.error('[api/user/progress] error:', err);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}

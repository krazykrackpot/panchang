// src/app/api/user/progress/sign-in/route.ts
// Fired by the client when an authenticated session is first observed.
// Advances the streak (idempotent per IST day) and awards any newly-earned badges.
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { awardProgress } from '@/lib/gamification/award';

export async function POST(req: NextRequest) {
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user }, error: authError } = await sb.auth.getUser(authHeader.slice(7));
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await awardProgress(user.id, { type: 'sign_in' });
  return NextResponse.json({ ok: true });
}

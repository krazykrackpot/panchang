// src/app/api/user/progress/chart-saved/route.ts
//
// Fired by the client after a successful insert into `saved_charts`.
// Triggers awardProgress so the user's level / badges refresh inside the
// current tab without waiting for the next sign-in.
//
// Source-of-truth refactor on 2026-06-06 (PR #475) made the level
// evaluator read counts directly from the `saved_charts` table on every
// awardProgress call, so this endpoint can fire AFTER the insert — even
// if the request races with another save, the next call will see both
// rows. The event itself is just the trigger; correctness lives in the
// underlying read.
//
// Fire-and-forget contract: the client invokes this with `.catch(...)`,
// never `await`. A failed gamification update must not break the save
// the user just performed.

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
  const { data: { user }, error: authError } = await sb.auth.getUser(authHeader.slice(7).trim());
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await awardProgress(user.id, { type: 'chart_saved' });
  return NextResponse.json({ ok: true });
}

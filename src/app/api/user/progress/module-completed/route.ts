// src/app/api/user/progress/module-completed/route.ts
//
// Fired by the client after a learn module's status flips to
// 'mastered' in `learning_progress` — either via the quiz-pass path
// or the standalone-complete path. Triggers awardProgress so the
// user's level / badges refresh in the current tab instead of
// waiting for the next sign-in.
//
// Source-of-truth refactor (PR #475) made awardProgress read
// COUNT(*) FROM learning_progress WHERE status='mastered' on every
// call, so a race between two near-simultaneous completions reads
// both rows. The event itself is just the trigger.
//
// Fire-and-forget contract: clients invoke with `.catch(...)` and
// never `await`. A failed gamification update must not break the
// study session the user just finished.

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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const moduleId = body && typeof body === 'object' ? (body as Record<string, unknown>).module_id : null;
  if (typeof moduleId !== 'string' || moduleId.length === 0 || moduleId.length > 128) {
    return NextResponse.json({ error: 'Invalid module_id' }, { status: 400 });
  }

  await awardProgress(user.id, { type: 'module_completed', module_id: moduleId });
  return NextResponse.json({ ok: true });
}

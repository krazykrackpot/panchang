// src/app/api/user/progress/tool-used/route.ts
//
// Fired by client tool entry points (matching compute, KP system cast,
// prashna throw, etc.) the first time the user runs each tool. The
// `tools_used` array on user_progress is a set — duplicate fires are
// no-ops at the awardProgress layer, so callers don't need to dedupe.
//
// Unlike chart-saved / module-completed, this event is NOT backed by a
// source-of-truth table — there's no `tool_usage` log. The array on
// user_progress IS the source. That's why the endpoint hard-validates
// `tool_slug` against COUNTED_TOOLS before forwarding — a bogus slug
// from a buggy caller would pollute the set forever.
//
// Fire-and-forget contract: clients invoke with `.catch(...)` and
// never `await`.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { awardProgress } from '@/lib/gamification/award';
import { COUNTED_TOOLS } from '@/lib/constants/badges';

type CountedTool = (typeof COUNTED_TOOLS)[number];

function isCountedTool(value: unknown): value is CountedTool {
  return typeof value === 'string' && (COUNTED_TOOLS as readonly string[]).includes(value);
}

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

  const toolSlug = (body && typeof body === 'object' ? (body as Record<string, unknown>).tool_slug : null);
  if (!isCountedTool(toolSlug)) {
    return NextResponse.json({ error: 'Invalid tool_slug' }, { status: 400 });
  }

  await awardProgress(user.id, { type: 'tool_used', tool_slug: toolSlug });
  return NextResponse.json({ ok: true });
}

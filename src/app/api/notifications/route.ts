import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// GET /api/notifications  –  fetch user's most recent 20 notifications
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data: notifications, error } = await supabase
      .from('user_notifications')
      .select('id, type, title, body, metadata, read, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      // Migration 005 shipped the user_notifications table long ago, so
      // a generic "table may not exist" fallback is now hiding real
      // failures (RLS misconfig, connection drop, schema drift) as
      // "no notifications" — users silently lose the bell-icon feed.
      // Only swallow the very specific "undefined_table" Postgres code
      // 42P01 to preserve the bootstrap-friendliness; otherwise 500 so
      // the failure surfaces in monitoring. Round 4 audit.
      console.error('[notifications] query error:', error.code, error.message);
      if (error.code === '42P01') {
        return NextResponse.json({ notifications: [], unreadCount: 0 });
      }
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    // Also get unread count
    const { count } = await supabase
      .from('user_notifications')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('read', false);

    return NextResponse.json({ notifications: notifications || [], unreadCount: count || 0 });
  } catch (err) {
    console.error('[notifications] unexpected error:', err);
    return NextResponse.json({ notifications: [], unreadCount: 0 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/notifications  –  mark_read / mark_all_read actions
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7).trim());
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Guard against unparsable bodies — without this, a non-JSON POST
  // throws past the auth check and yields a raw 500, which is both a
  // bad UX and a noisy log entry for any random scanner hitting the
  // endpoint. Audit Round 3.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { action, id } = (body ?? {}) as { action?: string; id?: string };

  if (action === 'mark_read') {
    if (!id) {
      return NextResponse.json({ error: 'Notification id required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      // Audit M14 — don't leak Postgres error detail; log full + return generic.
      console.error('[notifications] mark-read failed:', error.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'mark_all_read') {
    const { error } = await supabase
      .from('user_notifications')
      .update({ read: true })
      .eq('user_id', user.id)
      .eq('read', false);

    if (error) {
      console.error('[notifications] mark-all-read failed:', error.message);
      return NextResponse.json({ error: 'Update failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

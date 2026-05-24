import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabaseAdmin = getServerSupabase();
    if (!supabaseAdmin) {
      console.error('[PushSubscribe] Supabase not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7).trim();
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { subscription } = body as { subscription: { endpoint: string; keys: { p256dh: string; auth: string } } };

    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    const userAgent = request.headers.get('User-Agent') || '';

    const { error } = await supabaseAdmin
      .from('push_subscriptions')
      .upsert({
        user_id: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_agent: userAgent,
      }, { onConflict: 'user_id,endpoint' });

    if (error) {
      console.error('[PushSubscribe] Upsert error:', error.message);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    // P2-25 — sweep out any stale subscriptions for this user from the
    // same User-Agent string but a DIFFERENT endpoint. When a browser
    // invalidates its push endpoint (e.g. after a profile reset or a
    // long offline period), it re-subscribes with a fresh endpoint —
    // leaving the old row orphaned. send-push.ts cleans 410/404 on
    // attempted push, but that's reactive; this is proactive and runs
    // every time the user opts in.
    //
    // Same UA string implies same browser/device — different UA means
    // a different device, which we keep. Failure to prune is non-fatal;
    // worst case is one extra dead row that send-push will eventually
    // catch and delete.
    if (userAgent) {
      const { error: pruneError } = await supabaseAdmin
        .from('push_subscriptions')
        .delete()
        .eq('user_id', user.id)
        .eq('user_agent', userAgent)
        .neq('endpoint', subscription.endpoint);
      if (pruneError) {
        // Log so the next failed-prune accumulates a signal, but don't
        // fail the subscribe.
        console.error('[PushSubscribe] stale-UA prune failed (non-fatal):', pruneError.message);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PushSubscribe] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const supabaseAdmin = getServerSupabase();
    if (!supabaseAdmin) {
      console.error('[PushUnsubscribe] Supabase not configured');
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.slice(7).trim();
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await request.json();
    const { endpoint } = body as { endpoint: string };

    if (!endpoint) {
      return NextResponse.json({ error: 'Missing endpoint' }, { status: 400 });
    }

    await supabaseAdmin
      .from('push_subscriptions')
      .delete()
      .eq('user_id', user.id)
      .eq('endpoint', endpoint);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[PushUnsubscribe] Error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/**
 * /api/seeker/pandit-deliverables
 *
 * GET   — list deliverables pushed to the authenticated user (the client
 *         side of the Pandit-Client link). Newest first. Returns the
 *         pandit's display name alongside each row for the "From your
 *         Pandits" panel.
 *
 * PATCH — mark a deliverable as seen (client_seen_at) or acknowledged
 *         (client_acknowledged_at). Body: { action: 'seen' | 'ack',
 *         deliverable_id: string }.
 *
 * Auth: standard Bearer token of the client (seeker). RLS gates
 * client_user_id = auth.uid() AND visibility = 'client_pushed' via the
 * policy from migration 049 (pandit_deliverables_client_pushed +
 * pandit_deliverables_client_ack).
 *
 * Pandit CRM P7.
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

function bearerToken(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h?.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

function getUserClient(token: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
}

export async function GET(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getUserClient(token);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('[seeker/pandit-deliverables GET] auth failed:', userError?.message);
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    // RLS allows SELECT on pandit_deliverables WHERE client_user_id =
    // auth.uid() AND visibility = 'client_pushed'.
    const { data: deliverables, error } = await supabase
      .from('pandit_deliverables')
      .select(`
        id, client_record_id, pandit_user_id, kind, title, content,
        locale, pushed_at, client_seen_at, client_acknowledged_at,
        created_at
      `)
      .eq('visibility', 'client_pushed')
      .eq('client_user_id', user.id)
      .order('pushed_at', { ascending: false, nullsFirst: false })
      .limit(50);

    if (error) {
      console.error('[seeker/pandit-deliverables GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }

    // Hydrate Pandit display name for each unique pandit_user_id
    const panditIds = Array.from(new Set((deliverables ?? []).map((d) => d.pandit_user_id)));
    let panditMap: Record<string, string> = {};
    if (panditIds.length > 0) {
      const { data: profiles, error: pErr } = await supabase
        .from('user_profiles')
        .select('id, display_name')
        .in('id', panditIds);
      if (pErr) {
        console.error('[seeker/pandit-deliverables GET] pandit profile lookup failed:', pErr.message);
        // Not fatal — fall through with empty map; UI shows "Your Pandit"
      }
      panditMap = Object.fromEntries(
        (profiles ?? []).map((p) => [p.id, p.display_name ?? 'Your Pandit']),
      );
    }

    return NextResponse.json({
      deliverables: (deliverables ?? []).map((d) => ({
        ...d,
        pandit_display_name: panditMap[d.pandit_user_id] ?? 'Your Pandit',
      })),
    });
  } catch (err) {
    console.error('[seeker/pandit-deliverables GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

interface PatchBody {
  deliverable_id?: string;
  action?: 'seen' | 'ack';
}

export async function PATCH(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getUserClient(token);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('[seeker/pandit-deliverables PATCH] auth failed:', userError?.message);
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'body_must_be_object' }, { status: 400 });
    }
    const body = rawBody as PatchBody;
    if (typeof body.deliverable_id !== 'string' || !body.deliverable_id) {
      return NextResponse.json({ error: 'deliverable_id is required' }, { status: 400 });
    }
    if (body.action !== 'seen' && body.action !== 'ack') {
      return NextResponse.json({ error: 'action must be "seen" or "ack"' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const update: Record<string, string> = {};
    if (body.action === 'seen') {
      update.client_seen_at = now;
    } else {
      // Acking also sets seen if not already set, so the Pandit's
      // timeline shows "opened then acknowledged" consistently rather
      // than ever skipping straight to ack without a seen. Comment had
      // promised this; the code only set acknowledged_at — Gemini PR
      // #406 round 9 narrative #4. Fix: write both. Backend-side
      // coalesce via COALESCE isn't available in the JS client's
      // update builder, so we just always set client_seen_at on ack —
      // safe since the column doesn't carry timing semantics that
      // matter to the Pandit beyond "client has opened this at least
      // once."
      update.client_seen_at = now;
      update.client_acknowledged_at = now;
    }

    // RLS pandit_deliverables_client_ack policy gates the UPDATE on
    // client_user_id = auth.uid() AND visibility = 'client_pushed'.
    // No further filter needed here — RLS won't let the client touch
    // anyone else's row.
    const { data, error } = await supabase
      .from('pandit_deliverables')
      .update(update)
      .eq('id', body.deliverable_id)
      .select('id, client_seen_at, client_acknowledged_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[seeker/pandit-deliverables PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, deliverable: data });
  } catch (err) {
    console.error('[seeker/pandit-deliverables PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

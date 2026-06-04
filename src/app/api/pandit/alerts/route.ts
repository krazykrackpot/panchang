/**
 * /api/pandit/alerts
 *
 * GET   — list alerts for the authenticated Pandit. Default filter:
 *         unacked, severity ≥ info, fires_at within ±60 days. Query
 *         params override.
 * PATCH — acknowledge an alert: { alert_id, action: 'ack' }
 *
 * Auth: authenticatePandit. RLS gates pandit_user_id = auth.uid().
 *
 * Pandit CRM P8.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';

interface PatchBody {
  alert_id?: string;
  action?: 'ack';
}

export async function GET(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const url = new URL(req.url);
    const clientId = url.searchParams.get('client_id');
    const includeAcked = url.searchParams.get('include_acked') === '1';

    let query = supabase
      .from('pandit_alerts')
      .select('*')
      .order('fires_at', { ascending: true });

    if (clientId) query = query.eq('client_record_id', clientId);
    if (!includeAcked) query = query.is('acknowledged_at', null);

    const { data, error } = await query;
    if (error) {
      console.error('[pandit/alerts GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }

    // Hydrate client names so the inbox can show "Mrs Sharma" inline.
    const clientIds = Array.from(new Set((data ?? []).map((a) => a.client_record_id)));
    let nameMap: Record<string, string> = {};
    if (clientIds.length > 0) {
      const { data: clients } = await supabase
        .from('pandit_clients')
        .select('id, full_name, display_label')
        .in('id', clientIds);
      nameMap = Object.fromEntries(
        (clients ?? []).map((c) => [c.id, c.display_label ?? c.full_name ?? 'Client']),
      );
    }

    return NextResponse.json({
      alerts: (data ?? []).map((a) => ({
        ...a,
        client_full_name: nameMap[a.client_record_id] ?? 'Client',
      })),
    });
  } catch (err) {
    console.error('[pandit/alerts GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
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
    if (typeof body.alert_id !== 'string' || !body.alert_id) {
      return NextResponse.json({ error: 'alert_id is required' }, { status: 400 });
    }
    if (body.action !== 'ack') {
      return NextResponse.json({ error: 'action must be "ack"' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_alerts')
      .update({ acknowledged_at: new Date().toISOString() })
      .eq('id', body.alert_id)
      .select('id, acknowledged_at')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[pandit/alerts PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed' }, { status: 500 });
    }
    return NextResponse.json({ ok: true, alert: data });
  } catch (err) {
    console.error('[pandit/alerts PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

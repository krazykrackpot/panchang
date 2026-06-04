/**
 * /api/pandit/clients/[id]/deliverables
 *
 * GET   — list deliverables for a client, newest first
 * POST  — create a new deliverable (kundali_report, tippanni,
 *         muhurta_pick, matching_report, consultation_summary,
 *         custom_letter). Visibility defaults to 'pandit_only';
 *         pushing to client's dashboard is P7.
 *
 * Pandit CRM P5 + spec §7.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type { DeliverableKind, PanditDeliverable } from '@/lib/pandit/types';

const VALID_KINDS: DeliverableKind[] = [
  'kundali_report',
  'tippanni',
  'muhurta_pick',
  'matching_report',
  'consultation_summary',
  'custom_letter',
];

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface CreateDeliverableBody {
  kind?: string;
  title?: string;
  content?: unknown;
  locale?: string;
}

export async function GET(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/deliverables GET] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('pandit_deliverables')
      .select('*')
      .eq('client_record_id', id)
      .order('created_at', { ascending: false });
    if (error) {
      console.error('[pandit/deliverables GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    return NextResponse.json({ deliverables: (data ?? []) as PanditDeliverable[] });
  } catch (err) {
    console.error('[pandit/deliverables GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function POST(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase, userId } = auth;

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
    const body = rawBody as CreateDeliverableBody;

    if (typeof body.kind !== 'string' || !VALID_KINDS.includes(body.kind as DeliverableKind)) {
      return NextResponse.json(
        { error: `kind must be one of: ${VALID_KINDS.join(', ')}` },
        { status: 400 },
      );
    }
    if (typeof body.title !== 'string' || !body.title.trim()) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }
    const title = body.title.trim();
    if (title.length > 200) {
      return NextResponse.json({ error: 'title too long (max 200)' }, { status: 400 });
    }
    const locale = typeof body.locale === 'string' && body.locale.trim() ? body.locale.trim() : 'en';

    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/deliverables POST] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('pandit_deliverables')
      .insert({
        client_record_id: id,
        pandit_user_id: userId,
        client_user_id: null, // synced by migration 050 trigger
        kind: body.kind as DeliverableKind,
        title,
        content: body.content ?? null,
        locale,
        visibility: 'pandit_only', // P7 introduces 'client_pushed'
      })
      .select('*')
      .single();

    if (error) {
      console.error('[pandit/deliverables POST] insert failed:', error.message);
      return NextResponse.json({ error: 'insert_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ deliverable: data as PanditDeliverable });
  } catch (err) {
    console.error('[pandit/deliverables POST] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

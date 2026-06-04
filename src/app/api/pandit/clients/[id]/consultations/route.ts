/**
 * /api/pandit/clients/[id]/consultations
 *
 * GET   — list consultations for a client, newest first
 * POST  — log a new consultation
 *
 * Pandit-private notes vs client-visible summary are separate fields;
 * `shared_with_client` toggles whether the summary surfaces on the
 * client's own dashboard (post-P7). The denormalised `client_user_id`
 * column is set by the migration 050 trigger from the parent.
 *
 * Auth: authenticatePandit. RLS gates by pandit_user_id + parent
 * ownership EXISTS clause (migration 051). The
 * update_client_on_consultation trigger maintains
 * pandit_clients.first_consult_at / last_consult_at and flips
 * engagement_state prospect/past → active.
 *
 * Pandit CRM P5 + spec §4 + §18.3 (Consultations tab) + §5.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type { ConsultationChannel, PanditConsultation } from '@/lib/pandit/types';

const VALID_CHANNELS: ConsultationChannel[] = [
  'in_person',
  'phone',
  'video',
  'chat',
  'email',
  'async_note',
];

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface CreateConsultationBody {
  consulted_at?: string;
  channel?: string;
  duration_minutes?: number;
  pandit_private_notes?: string;
  client_visible_summary?: string;
  shared_with_client?: boolean;
  next_followup_at?: string | null;
}

function isIsoTimestamp(s: unknown): s is string {
  if (typeof s !== 'string') return false;
  const t = new Date(s).getTime();
  return Number.isFinite(t);
}

// ─────────────────────────────────────────────────────────────────────
// GET
// ─────────────────────────────────────────────────────────────────────

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
      console.error('[pandit/consultations GET] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('pandit_consultations')
      .select('*')
      .eq('client_record_id', id)
      .order('consulted_at', { ascending: false });
    if (error) {
      console.error('[pandit/consultations GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    return NextResponse.json({ consultations: (data ?? []) as PanditConsultation[] });
  } catch (err) {
    console.error('[pandit/consultations GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────
// POST
// ─────────────────────────────────────────────────────────────────────

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
    const body = rawBody as CreateConsultationBody;

    if (!isIsoTimestamp(body.consulted_at)) {
      return NextResponse.json({ error: 'consulted_at must be a valid ISO timestamp' }, { status: 400 });
    }
    if (body.channel !== undefined && body.channel !== null) {
      if (typeof body.channel !== 'string' || !VALID_CHANNELS.includes(body.channel as ConsultationChannel)) {
        return NextResponse.json(
          { error: `channel must be one of: ${VALID_CHANNELS.join(', ')}` },
          { status: 400 },
        );
      }
    }
    if (body.duration_minutes !== undefined && body.duration_minutes !== null) {
      if (typeof body.duration_minutes !== 'number' || body.duration_minutes < 0 || body.duration_minutes > 1440) {
        return NextResponse.json({ error: 'duration_minutes must be 0-1440' }, { status: 400 });
      }
    }
    if (body.next_followup_at !== undefined && body.next_followup_at !== null) {
      if (!isIsoTimestamp(body.next_followup_at)) {
        return NextResponse.json({ error: 'next_followup_at must be a valid ISO timestamp' }, { status: 400 });
      }
    }
    if (body.pandit_private_notes !== undefined && body.pandit_private_notes !== null && typeof body.pandit_private_notes !== 'string') {
      return NextResponse.json({ error: 'pandit_private_notes must be a string' }, { status: 400 });
    }
    if (body.client_visible_summary !== undefined && body.client_visible_summary !== null && typeof body.client_visible_summary !== 'string') {
      return NextResponse.json({ error: 'client_visible_summary must be a string' }, { status: 400 });
    }

    // Parent check before insert — defence in depth on top of RLS.
    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/consultations POST] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const sharedWithClient = body.shared_with_client === true;

    const { data, error } = await supabase
      .from('pandit_consultations')
      .insert({
        client_record_id: id,
        pandit_user_id: userId,
        // client_user_id is overwritten by the migration 050 sync trigger
        // from the parent's value; don't trust caller-supplied values.
        client_user_id: null,
        consulted_at: body.consulted_at,
        channel: (body.channel as ConsultationChannel | undefined) ?? null,
        duration_minutes: body.duration_minutes ?? null,
        pandit_private_notes:
          typeof body.pandit_private_notes === 'string' ? body.pandit_private_notes.trim() : null,
        client_visible_summary:
          typeof body.client_visible_summary === 'string' ? body.client_visible_summary.trim() : null,
        shared_with_client: sharedWithClient,
        shared_at: sharedWithClient ? new Date().toISOString() : null,
        next_followup_at: body.next_followup_at ?? null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[pandit/consultations POST] insert failed:', error.message);
      return NextResponse.json({ error: 'insert_failed', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ consultation: data as PanditConsultation });
  } catch (err) {
    console.error('[pandit/consultations POST] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

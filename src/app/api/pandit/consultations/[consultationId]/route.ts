/**
 * /api/pandit/consultations/[consultationId]
 *
 * PATCH  — edit a consultation (private notes, client summary, follow-up,
 *          share toggle, duration, channel). Toggling shared_with_client
 *          from false → true sets shared_at to NOW(); true → false
 *          clears shared_at.
 * DELETE — remove a consultation. Does NOT undo the
 *          last_consult_at / first_consult_at denorm on the parent client
 *          (intentional — the rollback would require recomputing from
 *          remaining rows, scope for a P11 cleanup).
 *
 * Auth: authenticatePandit. RLS gates ownership + parent-EXISTS clause.
 *
 * Pandit CRM P5.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type { ConsultationChannel } from '@/lib/pandit/types';

const VALID_CHANNELS: ConsultationChannel[] = [
  'in_person',
  'phone',
  'video',
  'chat',
  'email',
  'async_note',
];

interface RouteParams {
  params: Promise<{ consultationId: string }>;
}

interface PatchBody {
  consulted_at?: string;
  channel?: string | null;
  duration_minutes?: number | null;
  pandit_private_notes?: string | null;
  client_visible_summary?: string | null;
  shared_with_client?: boolean;
  next_followup_at?: string | null;
}

function isIsoTimestamp(s: unknown): s is string {
  if (typeof s !== 'string') return false;
  const t = new Date(s).getTime();
  return Number.isFinite(t);
}

export async function PATCH(req: Request, ctx: RouteParams) {
  const { consultationId } = await ctx.params;
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

    const update: Record<string, unknown> = {};

    if (Object.prototype.hasOwnProperty.call(body, 'consulted_at')) {
      if (!isIsoTimestamp(body.consulted_at)) {
        return NextResponse.json({ error: 'consulted_at must be a valid ISO timestamp' }, { status: 400 });
      }
      update.consulted_at = body.consulted_at;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'channel')) {
      if (body.channel === null) {
        update.channel = null;
      } else if (typeof body.channel !== 'string' || !VALID_CHANNELS.includes(body.channel as ConsultationChannel)) {
        return NextResponse.json(
          { error: `channel must be null or one of: ${VALID_CHANNELS.join(', ')}` },
          { status: 400 },
        );
      } else {
        update.channel = body.channel;
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'duration_minutes')) {
      if (body.duration_minutes === null) {
        update.duration_minutes = null;
      } else {
        // Number.isInteger rejects NaN/Infinity/non-integer numbers AND
        // type-narrows to number in the true branch. Gemini PR #406 round 8
        // narrative #1.
        const d = body.duration_minutes;
        if (!Number.isInteger(d) || (d as number) < 0 || (d as number) > 1440) {
          return NextResponse.json({ error: 'duration_minutes must be 0-1440 or null' }, { status: 400 });
        }
        update.duration_minutes = d;
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'pandit_private_notes')) {
      if (body.pandit_private_notes !== null && typeof body.pandit_private_notes !== 'string') {
        return NextResponse.json({ error: 'pandit_private_notes must be a string or null' }, { status: 400 });
      }
      update.pandit_private_notes =
        typeof body.pandit_private_notes === 'string' ? body.pandit_private_notes.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'client_visible_summary')) {
      if (body.client_visible_summary !== null && typeof body.client_visible_summary !== 'string') {
        return NextResponse.json({ error: 'client_visible_summary must be a string or null' }, { status: 400 });
      }
      update.client_visible_summary =
        typeof body.client_visible_summary === 'string' ? body.client_visible_summary.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'shared_with_client')) {
      if (typeof body.shared_with_client !== 'boolean') {
        return NextResponse.json({ error: 'shared_with_client must be a boolean' }, { status: 400 });
      }
      update.shared_with_client = body.shared_with_client;
      // Auto-maintain shared_at — set to NOW() on flip-to-true, clear on flip-to-false.
      // To know the prior value we need the row; load it.
      const { data: prior } = await supabase
        .from('pandit_consultations')
        .select('shared_with_client')
        .eq('id', consultationId)
        .maybeSingle();
      if (prior?.shared_with_client !== body.shared_with_client) {
        update.shared_at = body.shared_with_client ? new Date().toISOString() : null;
      }
    }
    if (Object.prototype.hasOwnProperty.call(body, 'next_followup_at')) {
      if (body.next_followup_at !== null && !isIsoTimestamp(body.next_followup_at)) {
        return NextResponse.json({ error: 'next_followup_at must be a valid ISO timestamp or null' }, { status: 400 });
      }
      update.next_followup_at = body.next_followup_at ?? null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_consultations')
      .update(update)
      .eq('id', consultationId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[pandit/consultations PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ consultation: data });
  } catch (err) {
    console.error('[pandit/consultations PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: RouteParams) {
  const { consultationId } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { error, count } = await supabase
      .from('pandit_consultations')
      .delete({ count: 'exact' })
      .eq('id', consultationId);
    if (error) {
      console.error('[pandit/consultations DELETE] failed:', error.message);
      return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pandit/consultations DELETE] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

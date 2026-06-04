/**
 * /api/pandit/clients/[id]
 *
 * GET    — fetch a single client by id (RLS ensures ownership)
 * PATCH  — update editable fields (tags, notes, display_label, color,
 *          contact_*, engagement_state including archive/unarchive)
 * DELETE — delete a client. Cascades family/consultations/alerts/
 *          deliverables/invitations rows via FK ON DELETE CASCADE.
 *
 * Auth: Bearer token (Supabase access_token). RLS gates ownership.
 */

import { NextResponse } from 'next/server';
import type { EngagementState } from '@/lib/pandit/types';
import { authenticatePandit } from '@/lib/pandit/auth';

const VALID_ENGAGEMENT: EngagementState[] = ['prospect', 'active', 'past', 'archived'];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { data, error } = await supabase
      .from('pandit_clients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.error('[pandit/clients/[id] GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    if (!data) {
      // Either doesn't exist or RLS filtered it out. Same response either
      // way — don't leak whether the row exists for a different Pandit.
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }

    return NextResponse.json({ client: data });
  } catch (err) {
    console.error('[pandit/clients/[id] GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

interface PatchBody {
  display_label?: string | null;
  tags?: string[];
  pandit_notes?: string | null;
  color?: string | null;
  contact_email?: string | null;
  contact_phone?: string | null;
  contact_address?: string | null;
  engagement_state?: EngagementState;
  full_name?: string;
}

export async function PATCH(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
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
    // Each optional string field: only update if explicitly present in
    // body AND of the right type. typeof guards before .trim() — bare
    // optional-chaining on .toString() would let `null` through (since
    // typeof null === 'object') and crash. Gemini PR #406 round 1 HIGH.
    const asNullable = (v: unknown): string | null =>
      typeof v === 'string' && v.trim() ? v.trim() : null;

    if (Object.prototype.hasOwnProperty.call(body, 'display_label')) {
      if (body.display_label !== null && typeof body.display_label !== 'string') {
        return NextResponse.json({ error: 'display_label must be a string or null' }, { status: 400 });
      }
      update.display_label = asNullable(body.display_label);
    }
    if (Array.isArray(body.tags)) {
      update.tags = body.tags
        .filter((t) => typeof t === 'string' && t.trim())
        .map((t) => t.trim().slice(0, 50))
        .slice(0, 30);
    }
    if (Object.prototype.hasOwnProperty.call(body, 'pandit_notes')) {
      if (body.pandit_notes !== null && typeof body.pandit_notes !== 'string') {
        return NextResponse.json({ error: 'pandit_notes must be a string or null' }, { status: 400 });
      }
      // Store the trimmed string verbatim — including empty string when
      // the Pandit cleared the field. Only explicit `null` becomes null.
      // The previous `|| null` fallback contradicted the comment and
      // auto-nulled whitespace-only drafts. Gemini PR #406 round 2 MED.
      update.pandit_notes =
        typeof body.pandit_notes === 'string' ? body.pandit_notes.trim() : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'color')) {
      if (body.color !== null && typeof body.color !== 'string') {
        return NextResponse.json({ error: 'color must be a string or null' }, { status: 400 });
      }
      update.color = body.color || null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'contact_email')) {
      if (body.contact_email !== null && typeof body.contact_email !== 'string') {
        return NextResponse.json({ error: 'contact_email must be a string or null' }, { status: 400 });
      }
      update.contact_email =
        typeof body.contact_email === 'string' && body.contact_email.trim()
          ? body.contact_email.trim().toLowerCase()
          : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'contact_phone')) {
      if (body.contact_phone !== null && typeof body.contact_phone !== 'string') {
        return NextResponse.json({ error: 'contact_phone must be a string or null' }, { status: 400 });
      }
      update.contact_phone = asNullable(body.contact_phone);
    }
    if (Object.prototype.hasOwnProperty.call(body, 'contact_address')) {
      if (body.contact_address !== null && typeof body.contact_address !== 'string') {
        return NextResponse.json({ error: 'contact_address must be a string or null' }, { status: 400 });
      }
      update.contact_address = asNullable(body.contact_address);
    }
    if (Object.prototype.hasOwnProperty.call(body, 'full_name')) {
      if (typeof body.full_name !== 'string') {
        return NextResponse.json({ error: 'full_name must be a string' }, { status: 400 });
      }
      const fn = body.full_name.trim();
      if (!fn) return NextResponse.json({ error: 'full_name cannot be empty' }, { status: 400 });
      update.full_name = fn;
    }
    if (body.engagement_state) {
      if (!VALID_ENGAGEMENT.includes(body.engagement_state)) {
        return NextResponse.json({ error: 'invalid engagement_state' }, { status: 400 });
      }
      update.engagement_state = body.engagement_state;
      // If archiving, snapshot the prior state for restore. If unarchiving,
      // restoring is handled in a separate endpoint (P11). For the basic
      // flip we just set the field — Pandit can choose "active"/"past" on
      // unarchive themselves.
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_clients')
      .update(update)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[pandit/clients/[id] PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ client: data });
  } catch (err) {
    console.error('[pandit/clients/[id] PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { error, count } = await supabase
      .from('pandit_clients')
      .delete({ count: 'exact' })
      .eq('id', id);

    if (error) {
      console.error('[pandit/clients/[id] DELETE] delete failed:', error.message);
      return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pandit/clients/[id] DELETE] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

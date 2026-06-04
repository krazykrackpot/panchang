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
import { createClient } from '@supabase/supabase-js';
import type { EngagementState } from '@/lib/pandit/types';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

function bearerToken(req: Request): string | null {
  const h = req.headers.get('authorization');
  if (!h?.toLowerCase().startsWith('bearer ')) return null;
  return h.slice(7).trim() || null;
}

function getSupabase(accessToken: string) {
  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
}

const VALID_ENGAGEMENT: EngagementState[] = ['prospect', 'active', 'past', 'archived'];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getSupabase(token);
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
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    let body: PatchBody;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }

    const update: Record<string, unknown> = {};
    if (typeof body.display_label !== 'undefined') {
      update.display_label = body.display_label?.toString().trim() || null;
    }
    if (Array.isArray(body.tags)) {
      update.tags = body.tags
        .filter((t) => typeof t === 'string' && t.trim())
        .map((t) => t.trim().slice(0, 50))
        .slice(0, 30);
    }
    if (typeof body.pandit_notes !== 'undefined') {
      update.pandit_notes = body.pandit_notes?.toString() || null;
    }
    if (typeof body.color !== 'undefined') {
      update.color = body.color || null;
    }
    if (typeof body.contact_email !== 'undefined') {
      update.contact_email = body.contact_email?.toString().trim().toLowerCase() || null;
    }
    if (typeof body.contact_phone !== 'undefined') {
      update.contact_phone = body.contact_phone?.toString().trim() || null;
    }
    if (typeof body.contact_address !== 'undefined') {
      update.contact_address = body.contact_address?.toString().trim() || null;
    }
    if (typeof body.full_name !== 'undefined') {
      const fn = body.full_name.toString().trim();
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

    const supabase = getSupabase(token);
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
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getSupabase(token);
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

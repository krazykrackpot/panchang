/**
 * /api/pandit/family-members/[memberId]
 *
 * PATCH  — update a family member (notes, name, relationship, birth_data)
 * DELETE — delete a family member
 *
 * Auth: authenticatePandit. RLS gates by pandit_user_id + parent ownership
 * EXISTS clause from migration 051.
 *
 * Pandit CRM P4.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type { FamilyRelationship, BirthData } from '@/lib/pandit/types';

const VALID_RELATIONSHIPS: FamilyRelationship[] = [
  'spouse',
  'son',
  'daughter',
  'father',
  'mother',
  'sibling',
  'other',
];

interface RouteParams {
  params: Promise<{ memberId: string }>;
}

interface PatchBody {
  full_name?: string;
  relationship?: string;
  birth_data?: Partial<BirthData> | null;
  notes?: string | null;
}

function validateBirthData(bd: unknown): BirthData | null | { error: string } {
  if (bd === null || bd === undefined) return null;
  if (typeof bd !== 'object' || Array.isArray(bd)) {
    return { error: 'birth_data must be an object or null' };
  }
  const b = bd as Partial<BirthData>;
  if (typeof b.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(b.date)) {
    return { error: 'birth_data.date must be YYYY-MM-DD' };
  }
  if (typeof b.place !== 'string' || !b.place.trim()) {
    return { error: 'birth_data.place is required' };
  }
  if (typeof b.lat !== 'number' || typeof b.lng !== 'number') {
    return { error: 'birth_data.lat and lng are required' };
  }
  if (b.lat < -90 || b.lat > 90) return { error: 'birth_data.lat out of range' };
  if (b.lng < -180 || b.lng > 180) return { error: 'birth_data.lng out of range' };
  if (typeof b.tz !== 'string' || !b.tz.trim()) {
    return { error: 'birth_data.tz is required' };
  }
  return {
    date: b.date,
    time: typeof b.time === 'string' && /^\d{2}:\d{2}$/.test(b.time) ? b.time : '12:00',
    place: b.place.trim(),
    lat: b.lat,
    lng: b.lng,
    tz: b.tz.trim(),
    time_estimated:
      typeof b.time !== 'string' || !/^\d{2}:\d{2}$/.test(b.time) || !!b.time_estimated,
  };
}

export async function PATCH(req: Request, ctx: RouteParams) {
  const { memberId } = await ctx.params;
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
    if (Object.prototype.hasOwnProperty.call(body, 'full_name')) {
      if (typeof body.full_name !== 'string') {
        return NextResponse.json({ error: 'full_name must be a string' }, { status: 400 });
      }
      const fn = body.full_name.trim();
      if (!fn) return NextResponse.json({ error: 'full_name cannot be empty' }, { status: 400 });
      if (fn.length > 200) {
        return NextResponse.json({ error: 'full_name too long (max 200)' }, { status: 400 });
      }
      update.full_name = fn;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'relationship')) {
      if (
        typeof body.relationship !== 'string' ||
        !VALID_RELATIONSHIPS.includes(body.relationship as FamilyRelationship)
      ) {
        return NextResponse.json(
          { error: `relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}` },
          { status: 400 },
        );
      }
      update.relationship = body.relationship;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'birth_data')) {
      const bdResult = validateBirthData(body.birth_data);
      if (bdResult && typeof bdResult === 'object' && 'error' in bdResult) {
        return NextResponse.json({ error: bdResult.error }, { status: 400 });
      }
      update.birth_data = bdResult as BirthData | null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'notes')) {
      if (body.notes !== null && typeof body.notes !== 'string') {
        return NextResponse.json({ error: 'notes must be a string or null' }, { status: 400 });
      }
      update.notes = typeof body.notes === 'string' ? body.notes.trim() : null;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: 'nothing_to_update' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_client_family_members')
      .update(update)
      .eq('id', memberId)
      .select('*')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'not_found' }, { status: 404 });
      }
      console.error('[pandit/family-members PATCH] update failed:', error.message);
      return NextResponse.json({ error: 'update_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ family_member: data });
  } catch (err) {
    console.error('[pandit/family-members PATCH] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request, ctx: RouteParams) {
  const { memberId } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    const { error, count } = await supabase
      .from('pandit_client_family_members')
      .delete({ count: 'exact' })
      .eq('id', memberId);

    if (error) {
      console.error('[pandit/family-members DELETE] failed:', error.message);
      return NextResponse.json({ error: 'delete_failed' }, { status: 500 });
    }
    if (count === 0) {
      return NextResponse.json({ error: 'not_found' }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[pandit/family-members DELETE] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

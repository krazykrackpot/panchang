/**
 * /api/pandit/clients/[id]/family
 *
 * GET   — list family members for a client
 * POST  — add a new family member
 *
 * Auth: authenticatePandit (verifies JWT + account_type='pandit').
 * RLS on pandit_client_family_members gates by (pandit_user_id + parent
 * ownership) per migration 051. We also explicitly verify the parent
 * client belongs to the Pandit before inserting — defence in depth.
 *
 * Pandit CRM P4.
 */

import { NextResponse } from 'next/server';
import { authenticatePandit } from '@/lib/pandit/auth';
import type {
  PanditClientFamilyMember,
  FamilyRelationship,
  BirthData,
} from '@/lib/pandit/types';

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
  params: Promise<{ id: string }>;
}

interface CreateFamilyMemberBody {
  full_name?: string;
  relationship?: string;
  birth_data?: Partial<BirthData>;
  notes?: string;
}

function asTrimmedStringOrNull(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

/** Parse + validate birth_data. Birth data is OPTIONAL on family members
 *  (the Pandit may know the person but not their exact birth details).
 *  When supplied, all required sub-fields must be present and valid. */
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
  // Number.isFinite rejects NaN/Infinity that typeof would pass through.
  // Gemini PR #406 round 8 narrative #1.
  if (!Number.isFinite(b.lat) || !Number.isFinite(b.lng)) {
    return { error: 'birth_data.lat and lng must be finite numbers' };
  }
  if ((b.lat as number) < -90 || (b.lat as number) > 90) {
    return { error: 'birth_data.lat out of range' };
  }
  if ((b.lng as number) < -180 || (b.lng as number) > 180) {
    return { error: 'birth_data.lng out of range' };
  }
  if (typeof b.tz !== 'string' || !b.tz.trim()) {
    return { error: 'birth_data.tz is required' };
  }
  return {
    date: b.date,
    time: typeof b.time === 'string' && /^\d{2}:\d{2}$/.test(b.time) ? b.time : '12:00',
    place: b.place.trim(),
    // Narrowing escape: Number.isFinite is a runtime guard TS doesn't
    // propagate; the early returns above guarantee these are finite numbers.
    lat: b.lat as number,
    lng: b.lng as number,
    tz: b.tz.trim(),
    time_estimated:
      typeof b.time !== 'string' || !/^\d{2}:\d{2}$/.test(b.time) || !!b.time_estimated,
  };
}

// ─────────────────────────────────────────────────────────────────────
// GET — list family members for a client
// ─────────────────────────────────────────────────────────────────────

export async function GET(req: Request, ctx: RouteParams) {
  const { id } = await ctx.params;
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
    // RLS already gates the SELECT (parent-ownership via EXISTS clause
    // from migration 051), but we also explicitly verify the client
    // exists to give a clean 404 for unknown IDs rather than an empty
    // array (better DX for the calling page).
    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/clients/[id]/family GET] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('pandit_client_family_members')
      .select('*')
      .eq('client_record_id', id)
      .order('created_at', { ascending: true });
    if (error) {
      console.error('[pandit/clients/[id]/family GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    return NextResponse.json({ family_members: data ?? [] });
  } catch (err) {
    console.error('[pandit/clients/[id]/family GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────
// POST — add a new family member
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
    const body = rawBody as CreateFamilyMemberBody;

    if (typeof body.full_name !== 'string' || !body.full_name.trim()) {
      return NextResponse.json({ error: 'full_name is required' }, { status: 400 });
    }
    const fullName = body.full_name.trim();
    if (fullName.length > 200) {
      return NextResponse.json({ error: 'full_name too long (max 200)' }, { status: 400 });
    }

    const relationship = body.relationship;
    if (typeof relationship !== 'string' || !VALID_RELATIONSHIPS.includes(relationship as FamilyRelationship)) {
      return NextResponse.json(
        { error: `relationship must be one of: ${VALID_RELATIONSHIPS.join(', ')}` },
        { status: 400 },
      );
    }

    const bdResult = validateBirthData(body.birth_data);
    if (bdResult && typeof bdResult === 'object' && 'error' in bdResult) {
      return NextResponse.json({ error: bdResult.error }, { status: 400 });
    }
    const birthData = bdResult as BirthData | null;

    // Defence in depth: verify parent client belongs to the Pandit
    // before inserting. RLS would catch this too (the child policy uses
    // EXISTS against the parent), but explicit 404 is clearer than a
    // generic RLS rejection.
    const { data: parent, error: parentError } = await supabase
      .from('pandit_clients')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    if (parentError) {
      console.error('[pandit/clients/[id]/family POST] parent check failed:', parentError.message);
      return NextResponse.json({ error: 'parent_check_failed' }, { status: 500 });
    }
    if (!parent) {
      return NextResponse.json({ error: 'client_not_found' }, { status: 404 });
    }

    const { data, error } = await supabase
      .from('pandit_client_family_members')
      .insert({
        client_record_id: id,
        pandit_user_id: userId,
        full_name: fullName,
        relationship: relationship as FamilyRelationship,
        birth_data: birthData,
        notes: asTrimmedStringOrNull(body.notes),
      })
      .select('*')
      .single();

    if (error) {
      console.error('[pandit/clients/[id]/family POST] insert failed:', error.message);
      return NextResponse.json({ error: 'insert_failed', message: error.message }, { status: 500 });
    }
    return NextResponse.json({ family_member: data as PanditClientFamilyMember });
  } catch (err) {
    console.error('[pandit/clients/[id]/family POST] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

/**
 * /api/pandit/clients
 *
 * GET   — list all clients for the authenticated Pandit
 * POST  — create a new client (unlinked-mode onboarding from P2)
 *
 * Auth: Bearer token (Supabase access_token). RLS on pandit_clients
 * gates ownership; this route just enforces the schema contract +
 * normalises the unique-identity fields before insert.
 *
 * Spec: docs/specs/2026-06-04-pandit-crm.md §5.1 (Path B onboarding).
 */

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type {
  PanditClient,
  BirthData,
  EngagementState,
  LinkState,
} from '@/lib/pandit/types';

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();

interface CreateClientBody {
  full_name?: string;
  birth_data?: Partial<BirthData>;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  display_label?: string;
  tags?: string[];
  pandit_notes?: string;
  color?: string;
  engagement_state?: EngagementState;
}

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

/**
 * Validate the minimum required client fields. Pandit-side validation
 * before the DB constraint fires — gives the UI clearer error messages.
 * Spec §3.3 (validation rules).
 *
 * Every optional string field is type-checked before `.trim()` — a JSON
 * body can send `contact_email: 42` or `full_name: null`, and the
 * naive optional-chain `?.trim()` would crash because `?.` only guards
 * null/undefined, not non-string types. Gemini PR #406 round 1.
 */
function asTrimmedStringOrNull(v: unknown): string | null {
  return typeof v === 'string' && v.trim() ? v.trim() : null;
}

function validateCreate(body: CreateClientBody): { ok: true; data: Omit<PanditClient, 'id' | 'pandit_user_id' | 'first_consult_at' | 'last_consult_at' | 'link_state_changed_at' | 'engagement_state_changed_at' | 'created_at' | 'updated_at'> } | { ok: false; error: string } {
  if (typeof body.full_name !== 'string') {
    return { ok: false, error: 'full_name must be a string' };
  }
  const fullName = body.full_name.trim();
  if (!fullName) return { ok: false, error: 'full_name is required' };
  if (fullName.length > 200) return { ok: false, error: 'full_name too long (max 200)' };

  const bd = body.birth_data;
  if (!bd || typeof bd !== 'object') {
    return { ok: false, error: 'birth_data is required' };
  }
  if (typeof bd.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(bd.date)) {
    return { ok: false, error: 'birth_data.date must be YYYY-MM-DD' };
  }
  if (typeof bd.place !== 'string' || !bd.place.trim()) {
    return { ok: false, error: 'birth_data.place is required' };
  }
  if (typeof bd.lat !== 'number' || typeof bd.lng !== 'number') {
    return { ok: false, error: 'birth_data.lat and lng are required' };
  }
  if (bd.lat < -90 || bd.lat > 90) return { ok: false, error: 'birth_data.lat out of range' };
  if (bd.lng < -180 || bd.lng > 180) return { ok: false, error: 'birth_data.lng out of range' };
  if (typeof bd.tz !== 'string' || !bd.tz.trim()) {
    return { ok: false, error: 'birth_data.tz is required' };
  }
  const birthData: BirthData = {
    date: bd.date,
    time: typeof bd.time === 'string' && /^\d{2}:\d{2}$/.test(bd.time) ? bd.time : '12:00',
    place: bd.place.trim(),
    lat: bd.lat,
    lng: bd.lng,
    tz: bd.tz.trim(),
    time_estimated: typeof bd.time !== 'string' || !/^\d{2}:\d{2}$/.test(bd.time) || !!bd.time_estimated,
  };

  const tags = Array.isArray(body.tags)
    ? body.tags.filter((t) => typeof t === 'string' && t.trim()).map((t) => t.trim().slice(0, 50)).slice(0, 30)
    : [];

  const engagementState: EngagementState =
    body.engagement_state === 'active' || body.engagement_state === 'past' || body.engagement_state === 'archived'
      ? body.engagement_state
      : 'prospect';

  return {
    ok: true,
    data: {
      full_name: fullName,
      client_user_id: null,
      birth_data: birthData,
      birth_data_source: 'pandit_entered',
      contact_email:
        typeof body.contact_email === 'string' && body.contact_email.trim()
          ? body.contact_email.trim().toLowerCase()
          : null,
      contact_phone: asTrimmedStringOrNull(body.contact_phone),
      contact_address: asTrimmedStringOrNull(body.contact_address),
      photo_url: null,
      display_label: asTrimmedStringOrNull(body.display_label),
      tags,
      pandit_notes: asTrimmedStringOrNull(body.pandit_notes),
      color: typeof body.color === 'string' && body.color.trim() ? body.color : null,
      link_state: 'unlinked' satisfies LinkState,
      engagement_state: engagementState,
      engagement_state_before_archive: null,
      permissions: null,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────
// GET — list clients for the authenticated Pandit
// ─────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getSupabase(token);
    // In stateless API routes (persistSession: false), getUser() WITHOUT
    // a token returns no user because there's no in-memory session. Pass
    // the token explicitly so the server-side JWT verification fires.
    // Gemini PR #406 round 1 HIGH.
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('[pandit/clients GET] auth failed:', userError?.message);
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    const url = new URL(req.url);
    const engagement = url.searchParams.get('engagement');
    const linkState = url.searchParams.get('link_state');
    const search = url.searchParams.get('q');

    let query = supabase
      .from('pandit_clients')
      .select('*')
      .order('last_consult_at', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false });

    if (engagement) query = query.eq('engagement_state', engagement);
    if (linkState) query = query.eq('link_state', linkState);
    if (search) {
      // PostgREST ilike wildcards are `*`, not `%` — using `%` would
      // search for literal percent signs. Search term is also wrapped in
      // double quotes so commas inside the user input don't get parsed
      // as filter separators by .or(). Gemini PR #406 round 1 HIGH/MED.
      const s = search.trim().toLowerCase().replace(/"/g, '\\"');
      query = query.or(
        `full_name.ilike."*${s}*",display_label.ilike."*${s}*",contact_email.ilike."*${s}*"`,
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error('[pandit/clients GET] query failed:', error.message);
      return NextResponse.json({ error: 'query_failed' }, { status: 500 });
    }
    return NextResponse.json({ clients: data ?? [] });
  } catch (err) {
    console.error('[pandit/clients GET] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

// ─────────────────────────────────────────────────────────────────────
// POST — create a new client (unlinked-mode)
// ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const token = bearerToken(req);
  if (!token) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

  try {
    const supabase = getSupabase(token);
    // In stateless API routes (persistSession: false), getUser() WITHOUT
    // a token returns no user because there's no in-memory session. Pass
    // the token explicitly so the server-side JWT verification fires.
    // Gemini PR #406 round 1 HIGH.
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('[pandit/clients POST] auth failed:', userError?.message);
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }

    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
    }
    // A valid JSON literal like `null`, `42`, `true`, or `[]` would parse
    // but then crash validateCreate. Reject anything that isn't a plain
    // object up front. Gemini PR #406 round 1 MED.
    if (!rawBody || typeof rawBody !== 'object' || Array.isArray(rawBody)) {
      return NextResponse.json({ error: 'body_must_be_object' }, { status: 400 });
    }
    const body = rawBody as CreateClientBody;

    const validated = validateCreate(body);
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('pandit_clients')
      .insert({
        ...validated.data,
        pandit_user_id: user.id,
      })
      .select('*')
      .single();

    if (error) {
      // 23505 = unique_violation — most likely the unique-identity index
      // (same Pandit, same normalised name, same DOB). Idempotency.
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'duplicate', message: 'A client with this name and date of birth already exists' },
          { status: 409 },
        );
      }
      console.error('[pandit/clients POST] insert failed:', error.message);
      return NextResponse.json({ error: 'insert_failed', message: error.message }, { status: 500 });
    }

    return NextResponse.json({ client: data });
  } catch (err) {
    console.error('[pandit/clients POST] uncaught:', err);
    return NextResponse.json({ error: 'internal_error' }, { status: 500 });
  }
}

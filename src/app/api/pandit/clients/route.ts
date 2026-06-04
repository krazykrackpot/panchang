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
import type {
  PanditClient,
  BirthData,
  EngagementState,
  LinkState,
} from '@/lib/pandit/types';
import { authenticatePandit } from '@/lib/pandit/auth';

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
  // Number.isFinite rejects NaN, Infinity, and non-number types — typeof
  // alone passes NaN as 'number'. Gemini PR #406 round 8 narrative #1.
  if (!Number.isFinite(bd.lat) || !Number.isFinite(bd.lng)) {
    return { ok: false, error: 'birth_data.lat and lng must be finite numbers' };
  }
  if ((bd.lat as number) < -90 || (bd.lat as number) > 90) {
    return { ok: false, error: 'birth_data.lat out of range' };
  }
  if ((bd.lng as number) < -180 || (bd.lng as number) > 180) {
    return { ok: false, error: 'birth_data.lng out of range' };
  }
  if (typeof bd.tz !== 'string' || !bd.tz.trim()) {
    return { ok: false, error: 'birth_data.tz is required' };
  }
  // Narrowing escape: Number.isFinite is a runtime guard that TS
  // doesn't propagate, but the early returns above guarantee these
  // are finite numbers at this point.
  const lat = bd.lat as number;
  const lng = bd.lng as number;
  const birthData: BirthData = {
    date: bd.date,
    time: typeof bd.time === 'string' && /^\d{2}:\d{2}$/.test(bd.time) ? bd.time : '12:00',
    place: bd.place.trim(),
    lat,
    lng,
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
  // Combined JWT verify + account_type='pandit' gate. A seeker hitting
  // this endpoint with a valid token gets 403, not 401. Gemini PR #406
  // rounds 1 + 3.
  const auth = await authenticatePandit(req);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }
  const { supabase } = auth;

  try {
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
      // PostgREST escaping rules (verified against postgrest.org/en/stable/
      // references/api/url_grammar.html):
      //   - ilike wildcards are `*`, not `%`
      //   - To embed a literal `"` inside a double-quoted filter value,
      //     DOUBLE it (`""`), SQL-style. Backslash-escape (`\"`) does
      //     NOT work — backslashes have no special meaning in filter
      //     values, so `\\` would be a literal two-character search.
      // Earlier rounds added bogus `\` and `\"` escaping; that was
      // wrong. This is the documented correct form. Gemini PR #406
      // rounds 1 + 2 + 5.
      const s = search.trim().toLowerCase().replace(/"/g, '""');
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
  // Combined JWT verify + account_type='pandit' gate. Spec §16.2 — a
  // seeker creating Pandit-side rows would pollute their account_type
  // semantics; 403 is the right response. Gemini PR #406 rounds 1 + 3.
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
        pandit_user_id: userId,
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
      // Migration 055 cap trigger raises 'pandit_cap_exceeded: ...' on
      // free-tier overflow. Map to 402 Payment Required so the client
      // can pop the paywall modal instead of a generic 500. The literal
      // string prefix is the contract between trigger ↔ route.
      if (error.message?.startsWith('pandit_cap_exceeded:')) {
        return NextResponse.json(
          {
            error: 'cap_exceeded',
            message: 'You\'ve reached the free-tier limit of 5 unlinked clients. Upgrade to Pandit Pro for unlimited clients, or invite an existing client onto the platform — linked clients don\'t count against your cap.',
            hint: error.hint ?? null,
          },
          { status: 402 },
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

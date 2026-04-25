import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildPlanetarySnapshot } from '@/lib/journal/snapshot';
import type { DashaEntry } from '@/types/kundali';

const VALID_EVENT_TYPES = [
  'career', 'health', 'relationship', 'financial', 'spiritual',
  'creative', 'family', 'education', 'travel', 'legal', 'loss', 'other',
] as const;

// ---------------------------------------------------------------------------
// POST /api/life-events — create a life event with auto-captured planetary state
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // --- Parse body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { eventDate, eventType, title, description, significance, tags } = body as {
    eventDate?: unknown;
    eventType?: unknown;
    title?: unknown;
    description?: unknown;
    significance?: unknown;
    tags?: unknown;
  };

  // Validate eventDate: YYYY-MM-DD
  if (typeof eventDate !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) {
    return NextResponse.json({ error: 'eventDate must be a string in YYYY-MM-DD format' }, { status: 400 });
  }
  const [eyear, emonth, eday] = eventDate.split('-').map(Number);
  if (emonth < 1 || emonth > 12 || eday < 1 || eday > 31) {
    return NextResponse.json({ error: 'eventDate has invalid month or day' }, { status: 400 });
  }

  // Validate eventType
  if (typeof eventType !== 'string' || !(VALID_EVENT_TYPES as readonly string[]).includes(eventType)) {
    return NextResponse.json(
      { error: `eventType must be one of: ${VALID_EVENT_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  // Validate title
  if (typeof title !== 'string' || title.trim().length === 0) {
    return NextResponse.json({ error: 'title is required' }, { status: 400 });
  }
  if (title.length > 200) {
    return NextResponse.json({ error: 'title must be 200 characters or fewer' }, { status: 400 });
  }

  // Validate description (optional)
  if (description !== undefined && description !== null) {
    if (typeof description !== 'string') {
      return NextResponse.json({ error: 'description must be a string' }, { status: 400 });
    }
    if (description.length > 1000) {
      return NextResponse.json({ error: 'description must be 1000 characters or fewer' }, { status: 400 });
    }
  }

  // Validate significance (optional, 1-5)
  if (significance !== undefined && significance !== null) {
    if (typeof significance !== 'number' || !Number.isInteger(significance) || significance < 1 || significance > 5) {
      return NextResponse.json({ error: 'significance must be an integer between 1 and 5' }, { status: 400 });
    }
  }

  // Validate tags (optional, string[])
  if (tags !== undefined && tags !== null) {
    if (!Array.isArray(tags)) {
      return NextResponse.json({ error: 'tags must be an array of strings' }, { status: 400 });
    }
    if (tags.length > 10) {
      return NextResponse.json({ error: 'tags must have 10 items or fewer' }, { status: 400 });
    }
    if (!tags.every((t) => typeof t === 'string')) {
      return NextResponse.json({ error: 'each tag must be a string' }, { status: 400 });
    }
  }

  // --- Fetch user's location ---
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('panchang_location, default_location')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[life-events] profile fetch failed:', profileError);
    return NextResponse.json({ error: 'Failed to load user profile' }, { status: 500 });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const panchangLoc = profile?.panchang_location as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaultLoc = profile?.default_location as any;

  let lat: number;
  let lng: number;
  let timezone: string;

  if (panchangLoc?.lat != null && panchangLoc?.lng != null && panchangLoc?.timezone) {
    lat = Number(panchangLoc.lat);
    lng = Number(panchangLoc.lng);
    timezone = String(panchangLoc.timezone);
  } else if (defaultLoc?.lat != null && defaultLoc?.lng != null && defaultLoc?.timezone) {
    lat = Number(defaultLoc.lat);
    lng = Number(defaultLoc.lng);
    timezone = String(defaultLoc.timezone);
  } else {
    return NextResponse.json(
      { error: 'No location configured. Please set your panchang location in profile settings.' },
      { status: 422 },
    );
  }

  // --- Fetch dasha timeline ---
  const { data: snapshot } = await supabase
    .from('kundali_snapshots')
    .select('dasha_timeline, sade_sati')
    .eq('user_id', user.id)
    .single();

  const dashaTimeline = (snapshot?.dasha_timeline ?? null) as DashaEntry[] | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sadeSatiData = snapshot?.sade_sati as any;
  const sadeSatiPhase: string | null =
    typeof sadeSatiData?.phase === 'string' ? sadeSatiData.phase : null;

  // Build snapshot for the event date (noon of that day, user timezone)
  const eventDateObj = new Date(Date.UTC(eyear, emonth - 1, eday, 12, 0, 0));

  let planetaryState;
  let denormalized;
  try {
    const result = buildPlanetarySnapshot(lat, lng, timezone, eventDateObj, dashaTimeline, sadeSatiPhase);
    planetaryState = result.snapshot;
    denormalized = result.denormalized;
  } catch (snapErr) {
    console.error('[life-events] snapshot build failed:', snapErr);
    return NextResponse.json({ error: 'Failed to compute planetary snapshot' }, { status: 500 });
  }

  const row = {
    user_id: user.id,
    event_date: eventDate,
    event_type: eventType,
    title: title.trim(),
    description: typeof description === 'string' ? description.trim() : null,
    significance: typeof significance === 'number' ? significance : null,
    planetary_state: planetaryState,
    maha_dasha: denormalized.maha_dasha,
    antar_dasha: denormalized.antar_dasha,
    tags: Array.isArray(tags) ? tags : [],
    updated_at: new Date().toISOString(),
  };

  const { data: event, error: insertError } = await supabase
    .from('life_events')
    .insert(row)
    .select()
    .single();

  if (insertError) {
    console.error('[life-events] insert failed:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ event }, { status: 201 });
}

// ---------------------------------------------------------------------------
// GET /api/life-events — list events with optional filters
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = req.nextUrl;

  const dateFrom   = searchParams.get('dateFrom')   ?? undefined;
  const dateTo     = searchParams.get('dateTo')      ?? undefined;
  const eventType  = searchParams.get('eventType')   ?? undefined;
  const limit      = Math.min(parseInt(searchParams.get('limit')  ?? '50', 10), 100);
  const offset     = Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0);

  let query = supabase
    .from('life_events')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('event_date', { ascending: false });

  if (dateFrom)   query = query.gte('event_date', dateFrom);
  if (dateTo)     query = query.lte('event_date', dateTo);
  if (eventType)  query = query.eq('event_type', eventType);

  query = query.range(offset, offset + limit - 1);

  const { data: events, error: fetchError, count } = await query;

  if (fetchError) {
    console.error('[life-events] fetch failed:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ events: events ?? [], total: count ?? 0 });
}

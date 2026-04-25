import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildPlanetarySnapshot } from '@/lib/journal/snapshot';
import type { JournalFilters } from '@/types/journal';
import type { DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// POST /api/journal — create or update today's journal entry
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

  // --- Parse and validate body ---
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { mood, energy, note, tags } = body as {
    mood?: unknown;
    energy?: unknown;
    note?: unknown;
    tags?: unknown;
  };

  // mood: 1-5 required
  if (typeof mood !== 'number' || !Number.isInteger(mood) || mood < 1 || mood > 5) {
    return NextResponse.json({ error: 'mood must be an integer between 1 and 5' }, { status: 400 });
  }
  // energy: 1-5 required
  if (typeof energy !== 'number' || !Number.isInteger(energy) || energy < 1 || energy > 5) {
    return NextResponse.json({ error: 'energy must be an integer between 1 and 5' }, { status: 400 });
  }
  // note: optional string max 500 chars
  if (note !== undefined && note !== null) {
    if (typeof note !== 'string') {
      return NextResponse.json({ error: 'note must be a string' }, { status: 400 });
    }
    if (note.length > 500) {
      return NextResponse.json({ error: 'note must be 500 characters or fewer' }, { status: 400 });
    }
  }
  // tags: optional string[] max 10 items
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

  // --- Fetch user's location from user_profiles ---
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('panchang_location, default_location, birth_lat, birth_lng, birth_timezone')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[journal] profile fetch failed:', profileError);
    return NextResponse.json({ error: 'Failed to load user profile' }, { status: 500 });
  }

  // Resolve location: prefer panchang_location, then default_location, then birth coords
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
  } else if (profile?.birth_lat != null && profile?.birth_lng != null && profile?.birth_timezone) {
    lat = Number(profile.birth_lat);
    lng = Number(profile.birth_lng);
    timezone = String(profile.birth_timezone);
  } else {
    return NextResponse.json(
      { error: 'No location configured. Please set your panchang location in profile settings.' },
      { status: 422 },
    );
  }

  // --- Fetch dasha timeline from kundali_snapshots ---
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

  // --- Build planetary snapshot for today ---
  const today = new Date();
  let planetaryState;
  let denormalized;
  try {
    const result = buildPlanetarySnapshot(lat, lng, timezone, today, dashaTimeline, sadeSatiPhase);
    planetaryState = result.snapshot;
    denormalized = result.denormalized;
  } catch (snapErr) {
    console.error('[journal] snapshot build failed:', snapErr);
    return NextResponse.json({ error: 'Failed to compute planetary snapshot' }, { status: 500 });
  }

  // entry_date as YYYY-MM-DD in the user's timezone
  const entryDate = today
    .toLocaleDateString('en-CA', { timeZone: timezone }) // en-CA gives YYYY-MM-DD
    .replace(/\//g, '-');

  // --- Upsert into astro_journal (ON CONFLICT on user_id + entry_date) ---
  const row = {
    user_id: user.id,
    entry_date: entryDate,
    mood,
    energy,
    note: (typeof note === 'string' ? note.trim() : null) ?? null,
    tags: Array.isArray(tags) ? tags : [],
    planetary_state: planetaryState,
    ...denormalized,
    updated_at: new Date().toISOString(),
  };

  const { data: entry, error: upsertError } = await supabase
    .from('astro_journal')
    .upsert(row, { onConflict: 'user_id,entry_date' })
    .select()
    .single();

  if (upsertError) {
    console.error('[journal] upsert failed:', upsertError);
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  return NextResponse.json({ entry }, { status: 200 });
}

// ---------------------------------------------------------------------------
// GET /api/journal — list journal entries with optional filters
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

  // --- Parse query params ---
  const { searchParams } = req.nextUrl;

  const filters: JournalFilters = {
    dateFrom:        searchParams.get('dateFrom')        ?? undefined,
    dateTo:          searchParams.get('dateTo')          ?? undefined,
    mahaDasha:       searchParams.get('mahaDasha')       ?? undefined,
    antarDasha:      searchParams.get('antarDasha')      ?? undefined,
    nakshatraNumber: searchParams.has('nakshatraNumber')
      ? parseInt(searchParams.get('nakshatraNumber')!, 10)
      : undefined,
    tithiNumber:     searchParams.has('tithiNumber')
      ? parseInt(searchParams.get('tithiNumber')!, 10)
      : undefined,
    moodMin:         searchParams.has('moodMin')
      ? parseInt(searchParams.get('moodMin')!, 10)
      : undefined,
    limit:  Math.min(parseInt(searchParams.get('limit')  ?? '30', 10), 100),
    offset: Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0),
  };

  // --- Build query ---
  let query = supabase
    .from('astro_journal')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('entry_date', { ascending: false });

  if (filters.dateFrom)        query = query.gte('entry_date', filters.dateFrom);
  if (filters.dateTo)          query = query.lte('entry_date', filters.dateTo);
  if (filters.mahaDasha)       query = query.eq('maha_dasha', filters.mahaDasha);
  if (filters.antarDasha)      query = query.eq('antar_dasha', filters.antarDasha);
  if (filters.nakshatraNumber) query = query.eq('nakshatra_number', filters.nakshatraNumber);
  if (filters.tithiNumber)     query = query.eq('tithi_number', filters.tithiNumber);
  if (filters.moodMin)         query = query.gte('mood', filters.moodMin);

  query = query.range(
    filters.offset ?? 0,
    (filters.offset ?? 0) + (filters.limit ?? 30) - 1,
  );

  const { data: entries, error: fetchError, count } = await query;

  if (fetchError) {
    console.error('[journal] fetch failed:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ entries: entries ?? [], total: count ?? 0 });
}

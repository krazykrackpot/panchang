import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { buildPlanetarySnapshot } from '@/lib/journal/snapshot';
import type { DashaEntry } from '@/types/kundali';

const VALID_DOMAINS = [
  'career', 'health', 'relationship', 'financial', 'spiritual',
  'family', 'education', 'travel', 'general',
] as const;

// ---------------------------------------------------------------------------
// POST /api/predictions — track a new prediction
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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { predictionText, domain, source, predictedFor } = body as {
    predictionText?: unknown;
    domain?: unknown;
    source?: unknown;
    predictedFor?: unknown;
  };

  // Validate predictionText (required)
  if (typeof predictionText !== 'string' || predictionText.trim().length === 0) {
    return NextResponse.json({ error: 'predictionText is required' }, { status: 400 });
  }
  if (predictionText.length > 1000) {
    return NextResponse.json({ error: 'predictionText must be 1000 characters or fewer' }, { status: 400 });
  }

  // Validate domain (optional)
  if (domain !== undefined && domain !== null) {
    if (typeof domain !== 'string' || !(VALID_DOMAINS as readonly string[]).includes(domain)) {
      return NextResponse.json(
        { error: `domain must be one of: ${VALID_DOMAINS.join(', ')}` },
        { status: 400 },
      );
    }
  }

  // Validate source (optional, free text)
  if (source !== undefined && source !== null) {
    if (typeof source !== 'string') {
      return NextResponse.json({ error: 'source must be a string' }, { status: 400 });
    }
    if (source.length > 100) {
      return NextResponse.json({ error: 'source must be 100 characters or fewer' }, { status: 400 });
    }
  }

  // Validate predictedFor (optional: { start: YYYY-MM-DD, end: YYYY-MM-DD })
  let predictedForRange: string | null = null;
  if (predictedFor !== undefined && predictedFor !== null) {
    if (
      typeof predictedFor !== 'object' ||
      !('start' in (predictedFor as object)) ||
      !('end' in (predictedFor as object))
    ) {
      return NextResponse.json(
        { error: 'predictedFor must be an object with start and end date strings (YYYY-MM-DD)' },
        { status: 400 },
      );
    }
    const pf = predictedFor as { start: unknown; end: unknown };
    if (
      typeof pf.start !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(pf.start) ||
      typeof pf.end   !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(pf.end)
    ) {
      return NextResponse.json(
        { error: 'predictedFor.start and .end must be YYYY-MM-DD strings' },
        { status: 400 },
      );
    }
    // PostgreSQL daterange literal: [start,end]
    predictedForRange = `[${pf.start},${pf.end}]`;
  }

  // --- Fetch user location ---
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('panchang_location, default_location')
    .eq('id', user.id)
    .single();

  if (profileError) {
    console.error('[predictions] profile fetch failed:', profileError);
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

  let planetaryState;
  try {
    const result = buildPlanetarySnapshot(lat, lng, timezone, new Date(), dashaTimeline, sadeSatiPhase);
    planetaryState = result.snapshot;
  } catch (snapErr) {
    console.error('[predictions] snapshot build failed:', snapErr);
    return NextResponse.json({ error: 'Failed to compute planetary snapshot' }, { status: 500 });
  }

  const row = {
    user_id: user.id,
    prediction_text: predictionText.trim(),
    domain: typeof domain === 'string' ? domain : null,
    source: typeof source === 'string' ? source.trim() : null,
    predicted_for: predictedForRange,
    planetary_state: planetaryState,
    outcome: 'pending',
    updated_at: new Date().toISOString(),
  };

  const { data: prediction, error: insertError } = await supabase
    .from('prediction_tracking')
    .insert(row)
    .select()
    .single();

  if (insertError) {
    console.error('[predictions] insert failed:', insertError);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ prediction }, { status: 201 });
}

// ---------------------------------------------------------------------------
// GET /api/predictions — list predictions with optional filter
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

  const outcome = searchParams.get('outcome') ?? undefined; // 'pending' | 'resolved' | undefined
  const domain  = searchParams.get('domain')  ?? undefined;
  const limit   = Math.min(parseInt(searchParams.get('limit')  ?? '50', 10), 100);
  const offset  = Math.max(parseInt(searchParams.get('offset') ?? '0',  10), 0);

  let query = supabase
    .from('prediction_tracking')
    .select('*', { count: 'exact' })
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (outcome === 'pending') {
    query = query.eq('outcome', 'pending');
  } else if (outcome === 'resolved') {
    query = query.neq('outcome', 'pending');
  }

  if (domain) query = query.eq('domain', domain);

  query = query.range(offset, offset + limit - 1);

  const { data: predictions, error: fetchError, count } = await query;

  if (fetchError) {
    console.error('[predictions] fetch failed:', fetchError);
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  return NextResponse.json({ predictions: predictions ?? [], total: count ?? 0 });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

// ---------------------------------------------------------------------------
// GET /api/user/readings — last 12 months of domain reading snapshots
// ---------------------------------------------------------------------------
export async function GET(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7));
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: readings, error } = await supabase
    .from('domain_readings')
    .select('*')
    .eq('user_id', user.id)
    .order('computed_at', { ascending: true })
    .limit(12);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ readings: readings ?? [] });
}

// ---------------------------------------------------------------------------
// POST /api/user/readings — store a new monthly reading snapshot
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(authHeader.slice(7));
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: {
    scores: {
      health: number;
      wealth: number;
      career: number;
      marriage: number;
      children: number;
      family: number;
      spiritual: number;
      education: number;
    };
    mahaDasha?: string;
    antarDasha?: string;
    sadeSatiActive?: boolean;
    overallActivation?: number;
    triggerEvent?: string;
  };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { scores, mahaDasha, antarDasha, sadeSatiActive, overallActivation, triggerEvent } = body;

  if (!scores || typeof scores.health !== 'number' || typeof scores.wealth !== 'number' ||
      typeof scores.career !== 'number' || typeof scores.marriage !== 'number' ||
      typeof scores.children !== 'number' || typeof scores.family !== 'number' ||
      typeof scores.spiritual !== 'number' || typeof scores.education !== 'number') {
    return NextResponse.json({ error: 'Missing or invalid scores object — all 8 domain scores required' }, { status: 400 });
  }

  // Upsert: reading_month column enables simple ON CONFLICT
  const now = new Date();
  const readingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;

  const row = {
    user_id: user.id,
    computed_at: now.toISOString(),
    reading_month: readingMonth,
    health: scores.health,
    wealth: scores.wealth,
    career: scores.career,
    marriage: scores.marriage,
    children: scores.children,
    family: scores.family,
    spiritual: scores.spiritual,
    education: scores.education,
    maha_dasha: mahaDasha ?? null,
    antar_dasha: antarDasha ?? null,
    sade_sati_active: sadeSatiActive ?? false,
    overall_activation: overallActivation ?? null,
    trigger_event: triggerEvent ?? null,
  };

  // Try INSERT first
  const { data: inserted, error: insertError } = await supabase
    .from('domain_readings')
    .insert(row)
    .select('id, computed_at')
    .single();

  if (insertError) {
    // Unique violation (same user + month) → update existing row
    if (insertError.code === '23505') {
      const { data: updated, error: updateError } = await supabase
        .from('domain_readings')
        .update({ ...row, computed_at: now.toISOString() })
        .eq('user_id', user.id)
        .eq('reading_month', readingMonth)
        .select('id, computed_at')
        .single();

      if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });
      return NextResponse.json({ id: updated?.id, computed_at: updated?.computed_at });
    }
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ id: inserted?.id, computed_at: inserted?.computed_at });
}

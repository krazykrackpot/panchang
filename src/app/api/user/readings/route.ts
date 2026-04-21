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

  // Use raw SQL for the upsert because the UNIQUE constraint uses an expression
  // (date_trunc('month', computed_at)) which Supabase client can't target directly.
  const { data, error } = await supabase.rpc('upsert_domain_reading' as string, {
    p_user_id: user.id,
    p_health: scores.health,
    p_wealth: scores.wealth,
    p_career: scores.career,
    p_marriage: scores.marriage,
    p_children: scores.children,
    p_family: scores.family,
    p_spiritual: scores.spiritual,
    p_education: scores.education,
    p_maha_dasha: mahaDasha ?? null,
    p_antar_dasha: antarDasha ?? null,
    p_sade_sati_active: sadeSatiActive ?? false,
    p_overall_activation: overallActivation ?? null,
    p_trigger_event: triggerEvent ?? null,
  });

  // If the RPC doesn't exist yet, fall back to direct insert + catch unique violation
  if (error?.message?.includes('upsert_domain_reading')) {
    // Fallback: try INSERT, on unique violation do UPDATE
    const now = new Date().toISOString();
    const insertRow = {
      user_id: user.id,
      computed_at: now,
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

    const { data: inserted, error: insertError } = await supabase
      .from('domain_readings')
      .insert(insertRow)
      .select('id, computed_at')
      .single();

    if (insertError) {
      // Unique violation — update existing row for this month
      if (insertError.code === '23505') {
        const { data: updated, error: updateError } = await supabase
          .from('domain_readings')
          .update({
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
            computed_at: now,
          })
          .eq('user_id', user.id)
          // Match within the current month
          .gte('computed_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
          .lt('computed_at', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toISOString())
          .select('id, computed_at')
          .single();

        if (updateError) {
          return NextResponse.json({ error: updateError.message }, { status: 500 });
        }
        return NextResponse.json({ id: updated?.id, computed_at: updated?.computed_at });
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ id: inserted?.id, computed_at: inserted?.computed_at });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // RPC succeeded — extract result
  const result = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ id: result?.id, computed_at: result?.computed_at });
}

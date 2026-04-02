import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { getNakshatraNumber, getNakshatraPada } from '@/lib/ephem/astronomical';

// ---------------------------------------------------------------------------
// GET /api/user/profile — fetch profile + snapshot summary
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

  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return NextResponse.json({ error: profileError.message }, { status: 500 });
  }

  const { data: snapshot } = await supabase
    .from('kundali_snapshots')
    .select('ascendant_sign, moon_sign, moon_nakshatra, moon_nakshatra_pada, sun_sign, computed_at')
    .eq('user_id', user.id)
    .single();

  return NextResponse.json({ profile, snapshot: snapshot || null });
}

// ---------------------------------------------------------------------------
// POST /api/user/profile — save birth data + compute kundali snapshot
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

  const body = await req.json();
  const {
    name,
    dateOfBirth,
    timeOfBirth,
    birthTimeKnown,
    birthPlace,
    birthLat,
    birthLng,
    birthTimezone,
  } = body as {
    name?: string;
    dateOfBirth: string;
    timeOfBirth?: string;
    birthTimeKnown?: boolean;
    birthPlace: string;
    birthLat: number;
    birthLng: number;
    birthTimezone: string;
  };

  if (!dateOfBirth || !birthPlace || birthLat == null || birthLng == null || !birthTimezone) {
    return NextResponse.json({ error: 'Missing required birth data fields' }, { status: 400 });
  }

  // 1. Update user_profiles with birth data
  const profileUpdate: Record<string, unknown> = {
    date_of_birth: dateOfBirth,
    time_of_birth: timeOfBirth || '12:00',
    birth_time_known: birthTimeKnown ?? !!timeOfBirth,
    birth_place: birthPlace,
    birth_lat: birthLat,
    birth_lng: birthLng,
    birth_timezone: birthTimezone,
    updated_at: new Date().toISOString(),
  };
  if (name) profileUpdate.display_name = name.trim();

  const { error: updateError } = await supabase
    .from('user_profiles')
    .update(profileUpdate)
    .eq('id', user.id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  // 2. Generate kundali chart
  let kundali;
  try {
    kundali = generateKundali({
      name: name || 'User',
      date: dateOfBirth,
      time: timeOfBirth || '12:00',
      place: birthPlace,
      lat: birthLat,
      lng: birthLng,
      timezone: birthTimezone,
      ayanamsha: 'lahiri',
    });
  } catch (calcError) {
    console.error('Kundali computation failed:', calcError);
    return NextResponse.json({ error: 'Kundali computation failed' }, { status: 500 });
  }

  // 3. Extract key positions for indexed columns
  const moonPlanet = kundali.planets.find((p) => p.planet.id === 1);
  const sunPlanet = kundali.planets.find((p) => p.planet.id === 0);

  const moonLong = moonPlanet?.longitude ?? 0;

  const snapshotRow = {
    user_id: user.id,
    ascendant_sign: kundali.ascendant.sign,
    moon_sign: moonPlanet?.sign || 1,
    moon_nakshatra: getNakshatraNumber(moonLong),
    moon_nakshatra_pada: getNakshatraPada(moonLong),
    sun_sign: sunPlanet?.sign || 1,
    planet_positions: kundali.planets,
    house_cusps: kundali.houses,
    chart_data: kundali.chart,
    navamsha_chart: kundali.navamshaChart,
    dasha_timeline: kundali.dashas,
    yogas: kundali.yogasComplete || [],
    shadbala: kundali.fullShadbala || kundali.shadbala,
    sade_sati: kundali.sadeSati || {},
    full_kundali: kundali,
    computed_at: new Date().toISOString(),
  };

  const { error: upsertError } = await supabase
    .from('kundali_snapshots')
    .upsert(snapshotRow, { onConflict: 'user_id' });

  if (upsertError) {
    console.error('Snapshot upsert failed:', upsertError);
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // 4. Return summary
  return NextResponse.json({
    profile: { ...profileUpdate, id: user.id },
    snapshot: {
      ascendant_sign: snapshotRow.ascendant_sign,
      moon_sign: snapshotRow.moon_sign,
      moon_nakshatra: snapshotRow.moon_nakshatra,
      moon_nakshatra_pada: snapshotRow.moon_nakshatra_pada,
      sun_sign: snapshotRow.sun_sign,
      computed_at: snapshotRow.computed_at,
    },
  });
}

// ---------------------------------------------------------------------------
// DELETE /api/user/profile — delete account and all associated data
// ---------------------------------------------------------------------------
export async function DELETE(req: NextRequest) {
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

  const userId = user.id;

  // Delete all user data from related tables
  // Tables with 'user_id' column
  for (const table of ['kundali_snapshots', 'saved_charts', 'daily_usage', 'subscriptions']) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId);
    if (error && !error.message.includes('does not exist')) {
      console.warn(`Failed to delete from ${table}:`, error.message);
    }
  }
  // user_profiles uses 'id' as the primary key matching user id
  {
    const { error } = await supabase.from('user_profiles').delete().eq('id', userId);
    if (error && !error.message.includes('does not exist')) {
      console.warn('Failed to delete from user_profiles:', error.message);
    }
  }

  // Delete the auth user via admin API (requires service role key)
  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(userId);
  if (deleteUserError) {
    console.error('Failed to delete auth user:', deleteUserError.message);
    return NextResponse.json({ error: 'Failed to delete auth user' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

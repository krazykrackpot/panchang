import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { getNakshatraNumber, getNakshatraPada, getMasa, dateToJD, sunLongitude, toSidereal, calculateTithi, calculateYoga, MASA_NAMES } from '@/lib/ephem/astronomical';
import { RASHIS } from '@/lib/constants/rashis';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';

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
    .select('ascendant_sign, moon_sign, moon_nakshatra, moon_nakshatra_pada, sun_sign, chart_data, sade_sati, dasha_timeline, computed_at')
    .eq('user_id', user.id)
    .single();

  // Compute birth panchang from profile birth data
  let birthPanchang = null;
  if (profile?.date_of_birth && profile?.birth_timezone) {
    try {
      // date_of_birth is DATE (YYYY-MM-DD), time_of_birth is TIME (HH:MM or HH:MM:SS)
      const dobStr = String(profile.date_of_birth);
      const tobStr = String(profile.time_of_birth || '12:00');
      const dateParts = dobStr.split('-').map(Number);
      const timeParts = tobStr.split(':').map(Number);
      const year = dateParts[0], month = dateParts[1], day = dateParts[2];
      const hour = timeParts[0] || 0, minute = timeParts[1] || 0;

      // Resolve timezone offset from IANA name
      // Use a fixed reference date to get the offset for the birth timezone
      const refDate = new Date(year, month - 1, day, hour, minute);
      let tzOffsetHours = 0;
      try {
        const tzFormatter = new Intl.DateTimeFormat('en-US', {
          timeZone: profile.birth_timezone,
          timeZoneName: 'longOffset',
        });
        const formatted = tzFormatter.format(refDate);
        // Output like "4/2/2026, GMT+05:30" or "4/2/2026, GMT-08:00"
        const gmtMatch = formatted.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
        if (gmtMatch) {
          const sign = gmtMatch[1] === '-' ? -1 : 1;
          const hrs = parseInt(gmtMatch[2], 10);
          const mins = parseInt(gmtMatch[3] || '0', 10);
          tzOffsetHours = sign * (hrs + mins / 60);
        }
      } catch {
        // Fallback: try to get offset from JS Date
        const localDate = new Date(refDate.toLocaleString('en-US', { timeZone: profile.birth_timezone }));
        const utcDate = new Date(refDate.toLocaleString('en-US', { timeZone: 'UTC' }));
        tzOffsetHours = (localDate.getTime() - utcDate.getTime()) / 3600000;
      }

      const utHour = hour + minute / 60 - tzOffsetHours;
      const jd = dateToJD(year, month, day, utHour);

      const tithiResult = calculateTithi(jd);
      const yogaNum = calculateYoga(jd);
      const sunSid = toSidereal(sunLongitude(jd), jd);
      const masaIndex = getMasa(sunSid);

      const tithiData = TITHIS[tithiResult.number - 1];
      const yogaData = YOGAS[yogaNum - 1];
      const masaData = MASA_NAMES[masaIndex];

      birthPanchang = {
        tithi: { number: tithiResult.number, name: tithiData?.name, paksha: tithiData?.paksha },
        yoga: { number: yogaNum, name: yogaData?.name, meaning: yogaData?.meaning },
        masa: { index: masaIndex, name: masaData },
      };
    } catch (err) {
      console.error('Birth panchang computation failed:', err);
    }
  }

  // Resolve trilingual names for snapshot fields
  let snapshotEnriched = null;
  if (snapshot) {
    const moonRashi = RASHIS[snapshot.moon_sign - 1];
    const sunRashi = RASHIS[snapshot.sun_sign - 1];
    const lagnaRashi = RASHIS[snapshot.ascendant_sign - 1];
    const moonNak = NAKSHATRAS[snapshot.moon_nakshatra - 1];

    // Find current running dasha
    let currentDasha = null;
    if (snapshot.dasha_timeline && Array.isArray(snapshot.dasha_timeline)) {
      const now = new Date().toISOString();
      const mahaDasha = (snapshot.dasha_timeline as { startDate: string; endDate: string; planetName?: { en: string; hi: string; sa: string }; planet?: string; subPeriods?: { startDate: string; endDate: string; planetName?: { en: string; hi: string; sa: string }; planet?: string }[] }[])
        .find(d => d.startDate <= now && d.endDate >= now);
      if (mahaDasha) {
        const antarDasha = mahaDasha.subPeriods?.find(s => s.startDate <= now && s.endDate >= now);
        currentDasha = {
          maha: { planet: mahaDasha.planet, planetName: mahaDasha.planetName, startDate: mahaDasha.startDate, endDate: mahaDasha.endDate },
          antar: antarDasha ? { planet: antarDasha.planet, planetName: antarDasha.planetName, startDate: antarDasha.startDate, endDate: antarDasha.endDate } : null,
        };
      }
    }

    snapshotEnriched = {
      ...snapshot,
      moonRashiName: moonRashi?.name,
      sunRashiName: sunRashi?.name,
      lagnaRashiName: lagnaRashi?.name,
      moonNakshatraName: moonNak?.name,
      moonNakshatraRuler: moonNak?.rulerName,
      currentDasha,
    };
  }

  return NextResponse.json({ profile, snapshot: snapshotEnriched, birthPanchang });
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

  // 4. Send welcome email (best-effort, don't block response)
  try {
    const { sendEmail } = await import('@/lib/email/resend-client');
    const { welcomeEmail } = await import('@/lib/email/templates/welcome');
    if (user.email) {
      const moonRashi = RASHIS[snapshotRow.moon_sign - 1]?.name?.en || '';
      const nakshatra = NAKSHATRAS[snapshotRow.moon_nakshatra - 1]?.name?.en || '';
      const ascendant = RASHIS[snapshotRow.ascendant_sign - 1]?.name?.en || '';
      const email = welcomeEmail({ name: name || 'Friend', moonSign: moonRashi, nakshatra, ascendant });
      sendEmail({ to: user.email, ...email }).catch(() => {}); // fire and forget
    }
  } catch { /* email is best-effort */ }

  // 5. Return summary
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

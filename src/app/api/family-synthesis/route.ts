import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { computeFamilyReading } from '@/lib/kundali/family-synthesis';
import { computePanchang } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { FamilyContext } from '@/lib/kundali/family-synthesis/types';
import type { BirthData, PlanetPosition } from '@/types/kundali';

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  // Auth
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const forceRecompute = body?.forceRecompute === true;

  try {
    // 1. Get user's primary kundali snapshot
    const { data: snapshot, error: snapError } = await supabase
      .from('kundali_snapshots')
      .select('full_kundali')
      .eq('user_id', user.id)
      .single();

    if (snapError || !snapshot?.full_kundali) {
      return NextResponse.json(
        { error: 'No primary kundali found. Generate your birth chart first.' },
        { status: 404 },
      );
    }

    // 2. Get family charts (spouse + children)
    const { data: familyCharts, error: chartError } = await supabase
      .from('saved_charts')
      .select('id, label, birth_data, relationship')
      .eq('user_id', user.id)
      .in('relationship', ['spouse', 'child'])
      .order('created_at', { ascending: true });

    if (chartError) {
      console.error('[family-synthesis] chart query error:', chartError);
      return NextResponse.json({ error: 'Failed to load family charts' }, { status: 500 });
    }

    if (!familyCharts || familyCharts.length === 0) {
      return NextResponse.json({ familyReading: null, cached: false, chartIds: [] });
    }

    const currentChartIds = familyCharts.map(c => c.id).sort();

    // 3. Cache check — skip if forceRecompute
    if (!forceRecompute) {
      const { data: cached } = await supabase
        .from('family_readings')
        .select('reading_data, computed_at, chart_ids')
        .eq('user_id', user.id)
        .single();

      if (cached) {
        const cachedIds = [...(cached.chart_ids || [])].sort();
        const idsMatch = JSON.stringify(cachedIds) === JSON.stringify(currentChartIds);
        const age = Date.now() - new Date(cached.computed_at).getTime();
        const maxAge = 24 * 60 * 60 * 1000; // 24 hours

        if (idsMatch && age < maxAge) {
          return NextResponse.json({
            familyReading: cached.reading_data,
            cached: true,
            chartIds: currentChartIds,
          });
        }
      }
    }

    // 4. Compute kundalis for family members
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userKundali = snapshot.full_kundali as any;

    // For spouse, pick the most recent one if multiple exist (ordered ASC, so last = newest)
    const spouseCharts = familyCharts.filter(c => c.relationship === 'spouse');
    const spouseChart = spouseCharts[spouseCharts.length - 1];
    if (spouseCharts.length > 1) {
      console.warn(
        `[family-synthesis] User ${user.id} has ${spouseCharts.length} spouse charts, using most recent`,
      );
    }

    const childCharts = familyCharts.filter(c => c.relationship === 'child');

    const familyContext: FamilyContext = { children: [] };

    if (spouseChart) {
      const bd = spouseChart.birth_data as unknown as BirthData;
      const spouseKundali = generateKundali(bd);
      familyContext.spouse = {
        chartId: spouseChart.id,
        kundali: spouseKundali,
        name: bd.name || spouseChart.label || 'Spouse',
      };
    }

    for (let i = 0; i < childCharts.length; i++) {
      const cc = childCharts[i];
      const bd = cc.birth_data as unknown as BirthData;
      const childKundali = generateKundali(bd);
      familyContext.children.push({
        chartId: cc.id,
        kundali: childKundali,
        name: bd.name || cc.label || `Child ${i + 1}`,
        birthOrder: i + 1,
      });
    }

    // 5. Get current transit positions from panchang
    // Resolve timezone offset from the user's birth location (not hardcoded)
    const now = new Date();
    const lat = userKundali.birthData?.lat ?? 0;
    const lng = userKundali.birthData?.lng ?? 0;
    const timezone = userKundali.birthData?.timezone ?? 'UTC';
    const tzOffset = getUTCOffsetForDate(
      now.getFullYear(), now.getMonth() + 1, now.getDate(), timezone,
    );

    const panchang = computePanchang({
      year: now.getFullYear(),
      month: now.getMonth() + 1,
      day: now.getDate(),
      lat,
      lng,
      tzOffset,
      timezone,
    });

    // Map Graha[] to PlanetPosition-compatible objects for transit analysis
    // Graha uses `rashi` (1-12), PlanetPosition uses `sign` (1-12) — same semantics
    const transitPlanets = (panchang.planets ?? []).map(g => ({
      id: g.id,
      name: g.name,
      longitude: g.longitude ?? 0,
      sign: g.rashi ?? Math.floor((g.longitude ?? 0) / 30) + 1,
      degree: (g.longitude ?? 0) % 30,
      isRetrograde: g.isRetrograde ?? false,
      house: 0, // Not needed for transit analysis — houses require an ascendant
    })) as unknown as PlanetPosition[];

    // 6. Compute family reading
    const familyReading = computeFamilyReading(userKundali, familyContext, transitPlanets);

    // 7. Cache result (upsert by user_id unique constraint)
    const { error: upsertError } = await supabase
      .from('family_readings')
      .upsert({
        user_id: user.id,
        reading_data: familyReading,
        computed_at: new Date().toISOString(),
        chart_ids: currentChartIds,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' });

    if (upsertError) {
      // Non-fatal — we still return the computed result
      console.error('[family-synthesis] cache upsert error:', upsertError);
    }

    return NextResponse.json({
      familyReading,
      cached: false,
      chartIds: currentChartIds,
    });
  } catch (err) {
    console.error('[family-synthesis] computation error:', err);
    return NextResponse.json(
      { error: 'Family synthesis computation failed' },
      { status: 500 },
    );
  }
}

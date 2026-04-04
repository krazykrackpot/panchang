import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateNotifications } from '@/lib/personalization/notification-engine';
import type { UserSnapshot } from '@/lib/personalization/types';
import { scoreFestivalRelevance } from '@/lib/personalization/festival-relevance';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

// ---------------------------------------------------------------------------
// GET /api/cron/generate-notifications
// Called by Vercel Cron daily at 6 AM UTC.
// Generates personalized notifications for all users with snapshots.
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // Fetch all users with snapshots and notification preferences
  const { data: users, error: usersError } = await supabase
    .from('kundali_snapshots')
    .select(`
      user_id,
      moon_sign,
      moon_nakshatra,
      moon_nakshatra_pada,
      sun_sign,
      ascendant_sign: ascendant_sign,
      planet_positions,
      dasha_timeline,
      sade_sati
    `);

  if (usersError || !users) {
    return NextResponse.json({ error: usersError?.message || 'No users found' }, { status: 500 });
  }

  // Fetch notification prefs for all users in one query
  const userIds = users.map((u) => u.user_id);
  const { data: profiles } = await supabase
    .from('user_profiles')
    .select('id, notification_prefs')
    .in('id', userIds);

  const prefsMap = new Map<string, Record<string, boolean>>();
  for (const p of profiles || []) {
    prefsMap.set(p.id, p.notification_prefs || {});
  }

  // Fetch upcoming festivals (next 7 days) — using a simple date range query
  // We'll use a generic list; in production this would come from the calendar API
  const upcomingFestivals = getUpcomingFestivals();

  let totalGenerated = 0;
  let totalUsers = 0;

  for (const row of users) {
    const prefs = prefsMap.get(row.user_id) || {};
    const snapshot: UserSnapshot = {
      moonSign: row.moon_sign,
      moonNakshatra: row.moon_nakshatra,
      moonNakshatraPada: row.moon_nakshatra_pada,
      sunSign: row.sun_sign,
      ascendantSign: row.ascendant_sign,
      planetPositions: row.planet_positions || [],
      dashaTimeline: row.dasha_timeline || [],
      sadeSati: row.sade_sati || {},
    };

    // Score festivals for this user and filter to recommended ones
    const recommendedFestivals = upcomingFestivals
      .map((f) => scoreFestivalRelevance(f.slug, f.category, snapshot))
      .filter((f) => f.isRecommended)
      .map((f) => f.festivalSlug);

    // Generate all potential notifications
    const payloads = generateNotifications(snapshot, recommendedFestivals);

    // Filter by user preferences
    const filtered = payloads.filter((p) => prefs[p.type] !== false);

    if (filtered.length === 0) continue;

    // Deduplicate: check existing notifications from the last 24 hours to avoid duplicates
    const oneDayAgo = new Date(Date.now() - 86_400_000).toISOString();
    const { data: existing } = await supabase
      .from('user_notifications')
      .select('type, metadata')
      .eq('user_id', row.user_id)
      .gte('created_at', oneDayAgo);

    const existingKeys = new Set(
      (existing || []).map((e) => `${e.type}:${JSON.stringify(e.metadata)}`),
    );

    const toInsert = filtered
      .filter((p) => !existingKeys.has(`${p.type}:${JSON.stringify(p.metadata)}`))
      .map((p) => ({
        user_id: row.user_id,
        type: p.type,
        title: p.title,
        body: p.body,
        metadata: p.metadata,
        read: false,
      }));

    if (toInsert.length > 0) {
      const { error: insertError } = await supabase
        .from('user_notifications')
        .insert(toInsert);

      if (!insertError) {
        totalGenerated += toInsert.length;
        totalUsers++;
      }
    }
  }

  return NextResponse.json({
    success: true,
    usersProcessed: users.length,
    usersNotified: totalUsers,
    notificationsGenerated: totalGenerated,
  });
}

// ---------------------------------------------------------------------------
// Upcoming festivals helper — generates the next 7 days of festivals
// using the Hindu calendar engine. Uses a representative India location
// since festival dates are calendar-based and don't vary by region.
// ---------------------------------------------------------------------------

interface FestivalStub {
  slug: string;
  name: string;
  category: string;
  date: string;
}

function getUpcomingFestivals(): FestivalStub[] {
  const now = new Date();
  const cutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().slice(0, 10);
  const cutoffStr = cutoff.toISOString().slice(0, 10);

  // Generate festivals for current year (and next if we're near year-end)
  const years = [now.getFullYear()];
  if (now.getMonth() >= 11) years.push(now.getFullYear() + 1);

  const results: FestivalStub[] = [];
  for (const year of years) {
    // Use Delhi as representative location for Hindu calendar festivals
    const entries = generateFestivalCalendarV2(year, 28.6, 77.2, 'Asia/Kolkata');
    for (const e of entries) {
      if (e.date >= todayStr && e.date <= cutoffStr && e.slug) {
        results.push({
          slug: e.slug,
          name: e.name.en,
          category: e.category,
          date: e.date,
        });
      }
    }
  }
  return results;
}

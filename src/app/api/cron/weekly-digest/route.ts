import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { weeklyDigestEmail } from '@/lib/email/templates/weekly-digest';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { computeTransitAlerts } from '@/lib/personalization/transit-alerts';
import type { UserSnapshot } from '@/lib/personalization/types';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { isSnapshotStale } from '@/lib/supabase/get-fresh-snapshot';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// Runs every Monday at 6 AM UTC
export async function GET(req: Request) {
  try {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  // Fetch all users with snapshots who want weekly digests
  const { data: users } = await supabase
    .from('kundali_snapshots')
    .select('user_id, moon_sign, moon_nakshatra, moon_nakshatra_pada, sun_sign, ascendant_sign, dasha_timeline, sade_sati, computation_version');

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No users with snapshots' });
  }

  let sent = 0;
  let skipped = 0;

  for (const snap of users) {
    if (isSnapshotStale(snap)) {
      console.warn(`[cron/weekly-digest] Stale snapshot for user ${snap.user_id} — skipping (will recompute on next login)`);
      skipped++;
      continue;
    }
    // Get user profile + email + panchang location for festival computation
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, notification_prefs, panchang_lat, panchang_lng, panchang_timezone')
      .eq('id', snap.user_id)
      .maybeSingle();

    // Check if weekly digest is enabled
    const prefs = (profile?.notification_prefs as Record<string, boolean>) || {};
    if (prefs.weekly_digest === false) { skipped++; continue; }

    // Get user email from auth
    const { data: { user: authUser } } = await supabase.auth.admin.getUserById(snap.user_id);
    if (!authUser?.email) { skipped++; continue; }

    const snapshot: UserSnapshot = {
      moonSign: snap.moon_sign,
      moonNakshatra: snap.moon_nakshatra,
      moonNakshatraPada: snap.moon_nakshatra_pada || 1,
      sunSign: snap.sun_sign || 1,
      ascendantSign: snap.ascendant_sign,
      planetPositions: [],
      dashaTimeline: (snap.dasha_timeline as unknown[]) || [],
      sadeSati: snap.sade_sati || {},
    };

    // Compute 3-day forecast (limited to 3 days because the nakshatra/sign
    // approximation below drifts ±1 nakshatra beyond day 3 — the Moon's actual
    // speed varies 11.8–15.2°/day so a fixed +1 nak/day is unreliable past 72h)
    const days: { date: string; quality: string; taraName: string }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 3; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Approximate nakshatra/moon sign (shifts ~1 nak per day, ~2.5 days per sign).
      // NOTE: This is a crude linear approximation. Moon speed varies significantly
      // (11.8–15.2°/day), so results beyond day 2 may be off by ±1 nakshatra.
      const approxNak = ((snap.moon_nakshatra + i) % 27) || 27;
      const approxMoonSign = ((snap.moon_sign - 1 + Math.floor(i / 2.5)) % 12) + 1;

      const pd = computePersonalizedDay(snapshot, approxNak, approxMoonSign);
      const qualityMap: Record<string, string> = {
        excellent: 'Excellent', good: 'Good', neutral: 'Neutral', caution: 'Caution', challenging: 'Challenging',
      };
      days.push({
        date: `${dayNames[d.getDay()]}, ${monthNames[d.getMonth()]} ${d.getDate()}`,
        quality: qualityMap[pd.dayQuality] || 'Neutral',
        taraName: pd.taraBala.taraName.en,
      });
    }

    // Current dasha info
    const now = new Date();
    const dashaTimeline = (snap.dasha_timeline as { planet: string; startDate: string; endDate: string; subPeriods?: { planet: string; startDate: string; endDate: string }[] }[]) || [];
    const currentMaha = dashaTimeline.find(d => new Date(d.startDate) <= now && now <= new Date(d.endDate));
    const currentAntar = currentMaha?.subPeriods?.find(s => new Date(s.startDate) <= now && now <= new Date(s.endDate));
    const dashaInfo = currentMaha
      ? `${currentMaha.planet} Mahadasha${currentAntar ? ` / ${currentAntar.planet} Antardasha` : ''}`
      : 'Unknown';

    // Transit alerts
    const alerts = computeTransitAlerts(snapshot);
    const transitAlerts = alerts.map(a => a.description.en);

    // Sade sati
    const sadeSatiActive = !!(snap.sade_sati as { isActive?: boolean })?.isActive;

    // Upcoming 7-day festivals — use user's stored panchang location if available,
    // otherwise fall back to Delhi as a representative location for festival dates
    // (festival dates vary by ~1 day across India due to timezone/sunrise differences)
    const thisYear = now.getFullYear();
    const festLat = profile?.panchang_lat ?? 28.6;
    const festLng = profile?.panchang_lng ?? 77.2;
    const festTz = profile?.panchang_timezone ?? 'Asia/Kolkata';
    const festEntries = generateFestivalCalendarV2(thisYear, festLat, festLng, festTz);
    const weekCutoff = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const todayStr = now.toISOString().slice(0, 10);
    const upcomingFestivals = festEntries
      .filter(f => f.date >= todayStr && f.date <= weekCutoff)
      .map(f => f.name.en);

    const email = weeklyDigestEmail({
      name: profile?.display_name || 'Friend',
      dashaInfo,
      days: days.map(d => ({ ...d, color: '' })),
      festivals: upcomingFestivals,
      transitAlerts,
      sadeSatiActive,
    });

    const result = await sendEmail({ to: authUser.email, ...email });
    if (result.success) sent++;
  }

  return NextResponse.json({ sent, skipped, total: users.length });
  } catch (err) {
    console.error('[weekly-digest] error:', err);
    return NextResponse.json({ error: 'Failed to process weekly digest' }, { status: 500 });
  }
}

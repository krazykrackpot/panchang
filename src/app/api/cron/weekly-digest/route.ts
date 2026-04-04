import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { weeklyDigestEmail } from '@/lib/email/templates/weekly-digest';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { computeTransitAlerts } from '@/lib/personalization/transit-alerts';
import type { UserSnapshot } from '@/lib/personalization/types';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';

// Runs every Monday at 6 AM UTC
export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  // Fetch all users with snapshots who want weekly digests
  const { data: users } = await supabase
    .from('kundali_snapshots')
    .select('user_id, moon_sign, moon_nakshatra, moon_nakshatra_pada, sun_sign, ascendant_sign, dasha_timeline, sade_sati');

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No users with snapshots' });
  }

  let sent = 0;
  let skipped = 0;

  for (const snap of users) {
    // Get user profile + email
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('display_name, notification_prefs')
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

    // Compute 7-day forecast
    const days: { date: string; quality: string; taraName: string }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      // Approximate today's nakshatra/moon sign (shifts ~1 per day for nakshatra, ~2.5 days for sign)
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

    // Upcoming 7-day festivals (use Delhi as representative location)
    const thisYear = now.getFullYear();
    const festEntries = generateFestivalCalendarV2(thisYear, 28.6, 77.2, 'Asia/Kolkata');
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
}

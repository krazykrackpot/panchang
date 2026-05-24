import { NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { sendEmail } from '@/lib/email/resend-client';
import { weeklyDigestEmail } from '@/lib/email/templates/weekly-digest';
import { computePersonalizedDay } from '@/lib/personalization/personal-panchang';
import { computeTransitAlerts } from '@/lib/personalization/transit-alerts';
import type { UserSnapshot } from '@/lib/personalization/types';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';
import { claimCronEmailSlot, utcWeekStartDate, chunk } from '@/lib/cron/email-sent-anchor';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// Runs every Monday at 6 AM UTC
export async function GET(req: Request) {
  try {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) return NextResponse.json({ error: 'DB not configured' }, { status: 503 });

  // Fetch all users with snapshots who want weekly digests.
  // 500 on DB error so Vercel scheduler marks the run as failed — the
  // previous version returned 200 with {sent: 0} indistinguishable from
  // a healthy "no users yet" state, hiding outages indefinitely.
  // Audit Round 3.
  const { data: users, error: usersErr } = await supabase
    .from('kundali_snapshots')
    .select('user_id, moon_sign, moon_nakshatra, moon_nakshatra_pada, sun_sign, ascendant_sign, dasha_timeline, sade_sati, computation_version');
  if (usersErr) {
    console.error('[cron/weekly-digest] snapshots fetch failed:', usersErr.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!users || users.length === 0) {
    return NextResponse.json({ sent: 0, message: 'No users with snapshots' });
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  // Round 3 R3-IDEM-3 — per-user sent anchor. Week bucket aligns to ISO
  // Monday so a Monday-cron retry (or a manual mid-week re-trigger)
  // collides on the same week's row and the user gets at most one
  // weekly digest per ISO week.
  const runDate = utcWeekStartDate();

  // Round 3 R3-DX-3 — hoist the festival calendar out of the per-user
  // loop. Festival generation walks the full year of tithi-tables and
  // is ~50-200 ms each call; at 100 users that's 5-20 s of pure CPU
  // per cron run. Lat/lng/tz variation barely shifts a 7-day upcoming
  // window's filter result, so a single computation at the Delhi
  // representative location matches what the generate-notifications
  // cron has been doing since Sprint 21.
  // Gemini #168 — if the 7-day window crosses Dec→Jan, fetch both years'
  // festivals so the digest doesn't lose January entries during the last
  // week of December.
  const cronNow = new Date();
  const cronYear = cronNow.getUTCFullYear();
  const weekCutoffDate = new Date(cronNow.getTime() + 7 * 24 * 60 * 60 * 1000);
  const cutoffYear = weekCutoffDate.getUTCFullYear();
  const sharedTodayStr = cronNow.toISOString().slice(0, 10);
  const sharedWeekCutoff = weekCutoffDate.toISOString().slice(0, 10);
  let sharedFestEntries = generateFestivalCalendarV2(cronYear, 28.6, 77.2, 'Asia/Kolkata');
  if (cutoffYear !== cronYear) {
    sharedFestEntries = sharedFestEntries.concat(
      generateFestivalCalendarV2(cutoffYear, 28.6, 77.2, 'Asia/Kolkata'),
    );
  }
  const sharedUpcomingFestivals = sharedFestEntries
    .filter(f => f.date >= sharedTodayStr && f.date <= sharedWeekCutoff)
    .map(f => f.name.en);

  // Round 3 R3-DX-2 — batched profile + auth lookups. Previously this
  // ran two queries (user_profiles + auth.admin.getUserById) per user,
  // a 3-query N+1 pattern that overran the 30s cron budget around 200
  // users. Batched into one user_profiles SELECT scoped by .in(userIds)
  // plus the paginated auth.admin.listUsers (matching the pattern
  // daily-panchang/route.ts:55-70 already uses).
  // Gemini #168 — chunk the .in() into batches of 100 so the PostgREST
  // URL stays under the ~2-8 KB limit as the user base grows past
  // ~200. Each chunk is its own SELECT but the round-trip count stays
  // O(N/100) instead of O(N).
  const userIds = users.map(u => u.user_id);
  type ProfileRow = {
    id: string;
    display_name?: string | null;
    notification_prefs?: Record<string, boolean> | null;
    panchang_lat?: number | null;
    panchang_lng?: number | null;
    panchang_timezone?: string | null;
  };
  const profileById = new Map<string, ProfileRow>();
  for (const idChunk of chunk(userIds, 100)) {
    const { data: profiles, error: profilesErr } = await supabase
      .from('user_profiles')
      .select('id, display_name, notification_prefs, panchang_lat, panchang_lng, panchang_timezone')
      .in('id', idChunk);
    if (profilesErr) {
      console.error('[weekly-digest] batched profiles SELECT failed:', profilesErr.message);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    for (const p of (profiles ?? []) as ProfileRow[]) profileById.set(p.id, p);
  }

  // Gemini #168 — listUsers improvements:
  //   (1) fail-loud on authErr (was silent break),
  //   (2) only store emails for users we actually need,
  //   (3) early-exit when all requested users found.
  const userIdsSet = new Set(userIds);
  const emailById = new Map<string, string>();
  let page = 1;
  const perPage = 1000;
  while (true) {
    const { data: authPage, error: authErr } = await supabase.auth.admin.listUsers({ page, perPage });
    if (authErr) {
      console.error('[weekly-digest] listUsers page', page, 'failed:', authErr.message);
      return NextResponse.json({ error: 'Auth service error' }, { status: 500 });
    }
    if (!authPage?.users || authPage.users.length === 0) break;
    for (const u of authPage.users) {
      if (u.email && userIdsSet.has(u.id)) emailById.set(u.id, u.email);
    }
    if (emailById.size >= userIdsSet.size) break; // all requested found
    if (authPage.users.length < perPage) break;
    page++;
  }

  for (const snap of users) {
    if (isSnapshotStale(snap)) {
      const fresh = await recomputeSnapshotDirect(supabase, snap.user_id);
      if (!fresh) { console.warn(`[cron/weekly-digest] Could not recompute for ${snap.user_id}`); skipped++; continue; }
      Object.assign(snap, fresh);
    }
    // Round 3 R3-DX-2 — O(1) lookup against the batched profiles map.
    const profile = profileById.get(snap.user_id);

    // Check if weekly digest is enabled
    const prefs = (profile?.notification_prefs as Record<string, boolean>) || {};
    if (prefs.weekly_digest === false) { skipped++; continue; }

    // Round 3 R3-DX-2 — O(1) lookup against the batched emails map.
    const userEmail = emailById.get(snap.user_id);
    if (!userEmail) { skipped++; continue; }
    const authUser = { email: userEmail } as { email: string };

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

    // Round 3 R3-DX-3 — reuse the hoisted festival calendar. Per-user
    // lat/lng variation produces ≤1-day shifts which are below the
    // 7-day upcoming-week filter resolution anyway; the previous
    // per-user generation was wasted CPU.
    const upcomingFestivals = sharedUpcomingFestivals;

    // Claim the (cron, user, week) slot before sending. Retries collide
    // and skip silently. See migration 040 / email-sent-anchor helper.
    const { claimed, error: claimErr } = await claimCronEmailSlot(supabase, {
      cronName: 'weekly-digest',
      userId: snap.user_id,
      runDate,
    });
    if (claimErr) {
      console.error('[weekly-digest] claim failed for', snap.user_id, ':', claimErr.message);
      errors++;
      continue;
    }
    if (!claimed) {
      skipped++;
      continue;
    }

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
    else errors++;
  }

  return NextResponse.json({ sent, skipped, errors, total: users.length });
  } catch (err) {
    console.error('[weekly-digest] error:', err);
    return NextResponse.json({ error: 'Failed to process weekly digest' }, { status: 500 });
  }
}

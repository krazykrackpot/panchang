import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { generateNotifications } from '@/lib/personalization/notification-engine';
import type { UserSnapshot } from '@/lib/personalization/types';
import { scoreFestivalRelevance } from '@/lib/personalization/festival-relevance';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { sendPushToUser } from '@/lib/push/send-push';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';
import { buildNotificationDedupKey, utcDayBucket } from '@/lib/notifications/dedup-key';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// ---------------------------------------------------------------------------
// GET /api/cron/generate-notifications
// Called by Vercel Cron daily at 6 AM UTC.
// Generates personalized notifications for all users with snapshots.
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // Fetch all users with snapshots and notification preferences in ONE
  // query via Supabase's foreign-table embed. Previously we did two
  // queries plus a userIds IN-clause which scaled poorly with user count
  // (PostgREST URL-length cap around ~10k users). Gemini #120 review.
  // foreign key: user_profiles.id → kundali_snapshots.user_id is the
  // implicit join (kundali_snapshots.user_id is a FK to user_profiles.id).
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
      sade_sati,
      computation_version,
      user_profiles ( notification_prefs )
    `);

  if (usersError || !users) {
    console.error('[cron/generate-notifications] users fetch failed:', usersError?.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const prefsMap = new Map<string, Record<string, boolean>>();
  for (const u of users) {
    // Embedded relation arrives as an object (single FK) — PostgREST
    // returns it as the related row or null if missing.
    const embed = (u as unknown as { user_profiles?: { notification_prefs?: Record<string, boolean> } | null }).user_profiles;
    prefsMap.set(u.user_id, embed?.notification_prefs || {});
  }

  // Fetch upcoming festivals (next 7 days)  –  using a simple date range query
  // We'll use a generic list; in production this would come from the calendar API
  const upcomingFestivals = getUpcomingFestivals();

  let totalGenerated = 0;
  let totalUsers = 0;

  for (const row of users) {
    if (isSnapshotStale(row)) {
      const fresh = await recomputeSnapshotDirect(supabase, row.user_id);
      if (!fresh) { console.error(`[cron/generate-notifications] Could not recompute for ${row.user_id}`); continue; }
      Object.assign(row, fresh);
    }
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

    // Round 2 IDEM-8 / SF-14 — DB-side dedup via dedup_key (migration 039).
    // The previous SELECT-then-INSERT pattern had three failure modes:
    //   (1) the SELECT swallowed errors → empty Set → re-fire bombardment,
    //   (2) two cron invocations racing → both insert duplicates,
    //   (3) JSON.stringify(metadata) was non-deterministic on key order.
    // The unique partial index handles all three by construction.
    const bucket = utcDayBucket(); // daily cron — one bucket per UTC day
    const toInsert = filtered.map((p) => ({
      user_id: row.user_id,
      type: p.type,
      title: p.title,
      body: p.body,
      metadata: p.metadata,
      read: false,
      dedup_key: buildNotificationDedupKey({
        userId: row.user_id,
        type: p.type,
        metadata: p.metadata as Record<string, unknown> | undefined,
        bucket,
      }),
    }));

    if (toInsert.length > 0) {
      const { data: inserted, error: insertError } = await supabase
        .from('user_notifications')
        .upsert(toInsert, { onConflict: 'dedup_key', ignoreDuplicates: true })
        .select('id, type, title, body');
      if (insertError) {
        console.error('[generate-notifications] upsert failed for', row.user_id, ':', insertError.message);
        continue;
      }
      const insertedCount = inserted?.length ?? 0;
      if (insertedCount > 0) {
        totalGenerated += insertedCount;
        totalUsers++;
        // Send push for the actual first inserted row (NOT toInsert[0],
        // which may have been dedup'd to nothing). If every row in
        // toInsert was a dedup hit, inserted is empty and we skip push.
        const pushItem = inserted![0];
        try {
          await sendPushToUser(row.user_id, {
            title: pushItem.title as string,
            body: pushItem.body as string,
            url: '/en/dashboard',
            tag: pushItem.type as string,
          });
        } catch (err) {
          // Push delivery is best-effort — don't fail the cron, just log.
          console.error('[generate-notifications] push delivery failed:', err);
        }
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
// Upcoming festivals helper  –  generates the next 7 days of festivals
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

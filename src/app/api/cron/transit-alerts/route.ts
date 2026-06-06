import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { computePersonalTransits, type PersonalTransit } from '@/lib/transit/personal-transits';
import { sendPushToUser } from '@/lib/push/send-push';
import type { DomainType } from '@/lib/kundali/domain-synthesis/types';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';
import { buildNotificationDedupKey, utcWeekBucket } from '@/lib/notifications/dedup-key';
import { chunk } from '@/lib/cron/email-sent-anchor';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// ---------------------------------------------------------------------------
// House → Domain mapping (which Personal Pandit domain each house activates)
// A house can map to multiple domains; listed in priority order.
// ---------------------------------------------------------------------------

const HOUSE_TO_DOMAINS: Record<number, { domain: DomainType; primary: boolean }[]> = {
  1:  [{ domain: 'health', primary: true }],
  2:  [{ domain: 'wealth', primary: true }, { domain: 'career', primary: false }, { domain: 'marriage', primary: false }, { domain: 'family', primary: false }],
  3:  [],
  4:  [{ domain: 'family', primary: true }, { domain: 'education', primary: true }],
  5:  [{ domain: 'children', primary: true }, { domain: 'spiritual', primary: false }, { domain: 'education', primary: false }],
  6:  [{ domain: 'health', primary: false }, { domain: 'career', primary: false }],
  7:  [{ domain: 'marriage', primary: true }],
  8:  [{ domain: 'health', primary: false }],
  9:  [{ domain: 'spiritual', primary: true }, { domain: 'children', primary: false }, { domain: 'family', primary: false }, { domain: 'education', primary: false }],
  10: [{ domain: 'career', primary: true }],
  11: [{ domain: 'wealth', primary: false }],
  12: [{ domain: 'spiritual', primary: false }],
};

const DOMAIN_LABELS: Record<DomainType, string> = {
  currentPeriod: 'current period',
  health: 'health',
  wealth: 'wealth',
  career: 'career',
  marriage: 'marriage',
  children: 'children',
  family: 'family',
  spiritual: 'spiritual',
  education: 'education',
};

const DOMAIN_STRONG_ADVICE: Record<DomainType, string> = {
  currentPeriod: 'A favorable window is opening.',
  health: 'Vitality is strong  –  great time for health initiatives!',
  wealth: 'Financial prospects are favorable  –  consider investments.',
  career: 'Favorable period for professional growth!',
  marriage: 'Harmonious energy for relationships and partnerships.',
  children: 'Positive energy for matters related to children and creativity.',
  family: 'Good time for family bonding and domestic harmony.',
  spiritual: 'Spiritual insights are heightened  –  deepen your practice.',
  education: 'Excellent period for learning and intellectual pursuits.',
};

const DOMAIN_WEAK_ADVICE: Record<DomainType, string> = {
  currentPeriod: 'Navigate this period with mindfulness.',
  health: 'Pay extra attention to wellness and rest.',
  wealth: 'Be cautious with finances  –  avoid impulsive spending.',
  career: 'Patience and communication are key at work.',
  marriage: 'Patience and open communication are key in relationships.',
  children: 'Be attentive to children and creative projects.',
  family: 'Family dynamics may need extra care and attention.',
  spiritual: 'Spiritual challenges may arise  –  stay grounded.',
  education: 'Focus and discipline in studies will be needed.',
};

/**
 * Determine the primary domain affected by a transit, based on the house it occupies.
 */
function getTransitDomain(transit: PersonalTransit): { domain: DomainType; primary: boolean } | null {
  const mappings = HOUSE_TO_DOMAINS[transit.house];
  if (!mappings || mappings.length === 0) return null;
  // Prefer primary mapping
  return mappings.find(m => m.primary) || mappings[0];
}

// ---------------------------------------------------------------------------
// GET /api/cron/transit-alerts
// Called by Vercel Cron weekly (Sunday 6 AM UTC).
// Creates in-app notifications for significant transits with domain context.
// ---------------------------------------------------------------------------

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // Get all users with stored chart data containing SAV table
  const { data: snapshots, error: snapError } = await supabase
    .from('kundali_snapshots')
    .select('user_id, chart_data, ascendant_sign, computation_version');

  if (snapError) {
    console.error('[cron/transit-alerts] snapshots fetch failed:', snapError.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }
  if (!snapshots || snapshots.length === 0) {
    return NextResponse.json({ processed: 0, notified: 0, reason: 'No snapshots' });
  }

  let processed = 0;
  let notified = 0;

  // Round 3 R3-DX-1 — batch dedup SELECT. Previously this ran once per
  // user inside the loop (~50 ms × N queries). At 200 users that's 10s
  // of pure network latency in a 30s cron budget. Now one SELECT scoped
  // to all userIds + an in-memory bucket gives us O(1) dedup per user.
  //
  // Gemini #168 — chunk .in() into batches of 100 so the PostgREST URL
  // stays under the ~2-8 KB limit as the user base grows past ~200.
  const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
  const allUserIds = snapshots.map(s => s.user_id);
  const existingPlanetsByUser = new Map<string, Set<number>>();
  for (const idChunk of chunk(allUserIds, 100)) {
    const { data: allExisting, error: allExistingErr } = await supabase
      .from('user_notifications')
      .select('user_id, metadata')
      .in('user_id', idChunk)
      .eq('type', 'transit_alert')
      .gte('created_at', sevenDaysAgo);
    if (allExistingErr) {
      console.error('[transit-alerts] batched dedup SELECT failed:', allExistingErr.message);
      // Fail-loud — empty Set would re-fire every alert.
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    for (const row of allExisting ?? []) {
      const userId = row.user_id as string;
      const planetId = (row.metadata as { planetId?: number } | null)?.planetId;
      if (planetId === undefined) continue;
      if (!existingPlanetsByUser.has(userId)) existingPlanetsByUser.set(userId, new Set());
      existingPlanetsByUser.get(userId)!.add(planetId);
    }
  }

  for (const snap of snapshots) {
    try {
      if (isSnapshotStale(snap)) {
        const fresh = await recomputeSnapshotDirect(supabase, snap.user_id);
        if (!fresh) { console.error(`[cron/transit-alerts] Could not recompute for ${snap.user_id}`); continue; }
        Object.assign(snap, fresh);
      }
      let chartData;
      try {
        chartData = typeof snap.chart_data === 'string'
          ? JSON.parse(snap.chart_data)
          : snap.chart_data;
      } catch {
        console.error('[transit-alerts] corrupt chart_data for user', snap.user_id);
        continue;
      }

      const savTable = chartData?.ashtakavarga?.savTable;
      const ascSign = chartData?.ascendant?.sign || snap.ascendant_sign;
      if (!savTable || !ascSign) continue;

      processed++;

      // Compute current transits for this user
      const transits = computePersonalTransits(ascSign, savTable);
      const significant = transits.filter(t => t.quality === 'strong' || t.quality === 'weak');

      if (significant.length === 0) continue;

      // Round 3 R3-DX-1 — O(1) lookup against the batched dedup map
      // built before the loop. Replaces the per-user SELECT below.
      const existingPlanets = existingPlanetsByUser.get(snap.user_id) ?? new Set<number>();

      const topTransit = significant.find(t => !existingPlanets.has(t.planetId));
      if (!topTransit) continue;

      // Determine which Personal Pandit domain this transit activates
      const domainMapping = getTransitDomain(topTransit);
      const domainLabel = domainMapping ? DOMAIN_LABELS[domainMapping.domain] : null;

      // Build domain-aware notification body
      let body: string;
      if (domainLabel) {
        const zoneLabel = topTransit.quality === 'strong' ? 'strong zone' : 'weak zone';
        const advice = topTransit.quality === 'strong'
          ? DOMAIN_STRONG_ADVICE[domainMapping!.domain]
          : DOMAIN_WEAK_ADVICE[domainMapping!.domain];
        body = `${topTransit.planetName.en} is transiting your ${ordinal(topTransit.house)} house (${zoneLabel}, ${topTransit.savBindu} bindus). Your **${domainLabel}** domain is ${topTransit.quality === 'strong' ? 'activated' : 'facing pressure'}  –  ${advice}`;
      } else {
        body = `${topTransit.planetName.en} is transiting your ${ordinal(topTransit.house)} house (${topTransit.signName.en}, ${topTransit.savBindu} bindus). ${topTransit.quality === 'strong' ? 'Favorable period  –  take action!' : 'Navigate carefully.'}`;
      }

      const alertTitle = `Transit Alert: ${topTransit.planetName.en} in ${topTransit.signName.en}`;

      // Build push URL  –  link to domain deep dive if domain is known
      const pushUrl = domainMapping
        ? `/en/kundali?domain=${domainMapping.domain}`
        : '/en/kundali';

      // Round 2 IDEM-9 — upsert with weekly dedup_key. Vercel cron retry
      // on 502 + the 7-day lookup window opened a race where a successful
      // first insert was followed by a retry that picked a DIFFERENT
      // planetId from the freshly-inserted-planet-filtered list. The
      // unique constraint on dedup_key makes the second insert a no-op.
      const metadata = {
        planetId: topTransit.planetId,
        sign: topTransit.currentSign,
        house: topTransit.house,
        quality: topTransit.quality,
        savBindu: topTransit.savBindu,
        domain: domainMapping?.domain ?? null,
        domainPrimary: domainMapping?.primary ?? false,
      };
      const dedup_key = buildNotificationDedupKey({
        userId: snap.user_id,
        type: 'transit_alert',
        // Only the planetId determines uniqueness — the body / sign /
        // house / quality / savBindu may shift week-to-week for the same
        // ongoing transit; we don't want to re-fire on those updates.
        metadata: { planetId: topTransit.planetId },
        bucket: utcWeekBucket(),
      });
      const { data: inserted, error: insertErr } = await supabase
        .from('user_notifications')
        .upsert({
          user_id: snap.user_id,
          type: 'transit_alert',
          title: alertTitle,
          body,
          metadata,
          read: false,
          dedup_key,
        }, { onConflict: 'dedup_key', ignoreDuplicates: true })
        .select('id');

      // The notification row is the dedup anchor — the existingPlanets query
      // above checks user_notifications to avoid double-firing. If the upsert
      // failed entirely (RLS / schema drift / network blip), skip the push
      // and let the next cron run retry. If the upsert returned an empty
      // inserted set, the dedup_key collided (we already notified this
      // user about this planet this week) — also skip the push so we don't
      // re-deliver the same alert.
      if (insertErr) {
        console.error(`[transit-alerts] notification upsert failed for ${snap.user_id}:`, insertErr.message);
        continue;
      }
      if (!inserted || inserted.length === 0) {
        // Dedup hit — already notified this user about this planet this week.
        continue;
      }

      // Send web push notification (non-blocking  –  don't fail the cron if push fails)
      try {
        await sendPushToUser(snap.user_id, {
          title: alertTitle,
          body: body.replace(/\*\*/g, ''), // Strip markdown bold for push
          url: pushUrl,
          tag: 'transit-alert',
        });
      } catch (pushErr) {
        console.error(`[TransitAlerts] Push failed for user ${snap.user_id}:`, pushErr);
      }

      notified++;
    } catch (err) {
      console.error('[transit-alerts] user processing failed:', snap.user_id, err);
    }
  }

  return NextResponse.json({
    success: true,
    processed,
    notified,
    timestamp: new Date().toISOString(),
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

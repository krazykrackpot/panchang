import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import { sendPushToUser } from '@/lib/push/send-push';
import type { KundaliData } from '@/types/kundali';
import type { DomainType } from '@/lib/kundali/domain-synthesis/types';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';
import { buildNotificationDedupKey, utcDayBucket } from '@/lib/notifications/dedup-key';

export const maxDuration = 30; // Cron job — email/notification/sync tasks

// ---------------------------------------------------------------------------
// GET /api/cron/domain-activations
// Called by Vercel Cron monthly (1st of each month, 6 AM UTC).
// Detects significant domain score changes and notifies users.
// ---------------------------------------------------------------------------

/** Minimum delta in domain score to trigger a notification. */
const SIGNIFICANT_DELTA = 1.5;

/** Human-readable domain labels for notification text. */
const DOMAIN_NAMES: Record<DomainType, string> = {
  currentPeriod: 'Current Period',
  health: 'Health',
  wealth: 'Wealth',
  career: 'Career',
  marriage: 'Marriage',
  children: 'Children',
  family: 'Family',
  spiritual: 'Spiritual',
  education: 'Education',
};

/** Positive-change advice per domain. */
const IMPROVEMENT_ADVICE: Record<string, string> = {
  health: 'Vitality is rising  –  a great time to build healthy habits.',
  wealth: 'Financial prospects are improving  –  consider your next investment.',
  career: "Jupiter's transit is opening new doors for professional growth.",
  marriage: 'Relationship energy is strengthening  –  nurture your connections.',
  children: 'Positive shifts for matters related to children and creativity.',
  family: 'Family harmony is improving  –  a good period for bonding.',
  spiritual: 'Spiritual clarity is deepening  –  pursue inner growth.',
  education: 'Intellectual energy is peaking  –  take on new learning.',
};

/** Negative-change advice per domain. */
const DECLINE_ADVICE: Record<string, string> = {
  health: 'Focus on the remedies in your Personal Pandit reading.',
  wealth: 'Be conservative with finances and review the recommended remedies.',
  career: 'Patience is key  –  check your reading for targeted guidance.',
  marriage: 'Communication and patience will help. Review your Pandit reading.',
  children: 'Give extra attention to children and creative pursuits.',
  family: 'Family dynamics may need care. Your reading has specific remedies.',
  spiritual: 'Stay grounded through discipline. Your reading offers guidance.',
  education: 'Extra effort in studies will pay off. See your reading for tips.',
};

const SCORED_DOMAINS: DomainType[] = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
];

export async function GET(req: NextRequest) {
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // 1. Fetch users who have a domain_readings entry from last month
  const now = new Date();
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: lastReadings, error: readError } = await supabase
    .from('domain_readings')
    .select('user_id, health, wealth, career, marriage, children, family, spiritual, education')
    .gte('computed_at', lastMonthStart)
    .lt('computed_at', lastMonthEnd);

  if (readError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!lastReadings || lastReadings.length === 0) {
    return NextResponse.json({ success: true, message: 'No previous readings to compare', processed: 0, notified: 0 });
  }

  // Build a map of user_id → last month's scores
  const lastScoresByUser = new Map<string, Record<string, number>>();
  for (const r of lastReadings) {
    lastScoresByUser.set(r.user_id, {
      health: r.health,
      wealth: r.wealth,
      career: r.career,
      marriage: r.marriage,
      children: r.children,
      family: r.family,
      spiritual: r.spiritual,
      education: r.education,
    });
  }

  // 2. Fetch kundali snapshots for these users
  const userIds = Array.from(lastScoresByUser.keys());
  const { data: snapshots, error: snapError } = await supabase
    .from('kundali_snapshots')
    .select('user_id, chart_data, computation_version')
    .in('user_id', userIds);

  if (snapError || !snapshots) {
    // P2-19 — never return error.message to client (table/column names leak).
    console.error('[domain-activations] snapshot fetch failed:', snapError);
    return NextResponse.json(
      { error: 'Snapshot lookup failed' },
      { status: 500 },
    );
  }

  let processed = 0;
  let notified = 0;

  for (const snap of snapshots) {
    try {
      if (isSnapshotStale(snap)) {
        const fresh = await recomputeSnapshotDirect(supabase, snap.user_id);
        if (!fresh) { console.error(`[cron/domain-activations] Could not recompute for ${snap.user_id}`); continue; }
        Object.assign(snap, fresh);
      }
      const lastScores = lastScoresByUser.get(snap.user_id);
      if (!lastScores) continue;

      // Parse chart data
      let kundali: KundaliData;
      try {
        kundali = typeof snap.chart_data === 'string'
          ? JSON.parse(snap.chart_data)
          : snap.chart_data;
      } catch {
        console.error(`[DomainActivations] Failed to parse chart_data for user ${snap.user_id}`);
        continue;
      }

      if (!kundali?.ascendant || !kundali?.planets || !kundali?.dashas) continue;

      processed++;

      // 3. Compute current domain scores via synthesizeReading
      let currentScores: Record<string, number>;
      try {
        const reading = synthesizeReading(kundali);
        currentScores = {};
        for (const domainReading of reading.domains) {
          currentScores[domainReading.domain] = domainReading.overallRating.score;
        }
      } catch (synthErr) {
        console.error(`[DomainActivations] synthesizeReading failed for user ${snap.user_id}:`, synthErr);
        continue;
      }

      // 4. Compare with stored scores  –  find significant deltas
      const changes: { domain: DomainType; delta: number; current: number; previous: number }[] = [];
      for (const domain of SCORED_DOMAINS) {
        const prev = lastScores[domain];
        const curr = currentScores[domain];
        if (prev == null || curr == null) continue;
        const delta = curr - prev;
        if (Math.abs(delta) >= SIGNIFICANT_DELTA) {
          changes.push({ domain, delta, current: curr, previous: prev });
        }
      }

      if (changes.length === 0) continue;

      // Sort by absolute delta (most significant first)
      changes.sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta));
      const topChange = changes[0];

      const improved = topChange.delta > 0;
      const domainName = DOMAIN_NAMES[topChange.domain];
      const deltaAbs = Math.abs(Math.round(topChange.delta * 10) / 10);

      const title = improved
        ? `${domainName} Domain Improved!`
        : `${domainName} Domain Needs Attention`;

      const advice = improved
        ? (IMPROVEMENT_ADVICE[topChange.domain] || 'Check your Personal Pandit reading for details.')
        : (DECLINE_ADVICE[topChange.domain] || 'Check your Personal Pandit reading for guidance.');

      const body = improved
        ? `Your ${domainName.toLowerCase()} domain just improved significantly (+${deltaAbs} points)! ${advice}`
        : `Your ${domainName.toLowerCase()} domain needs attention this month (-${deltaAbs} points). ${advice}`;

      // Round 2 IDEM-7 — INSERT the dedup anchor FIRST, THEN notify.
      // Previously the order was: insert notification → push → insert
      // domain_readings. The dedup anchor for "did we already alert
      // this delta?" is the next month's domain_readings row vs this
      // month's lastScoresByUser snapshot. If the domain_readings
      // insert failed AFTER notification + push, the next cron run
      // saw the same stale baseline and re-fired the alert (push
      // bombardment shape — same family as the May-20 incident).
      //
      // New order: write domain_readings first (the dedup anchor). If
      // that fails, skip notification + push entirely; the next run
      // retries cleanly with no user-visible side-effects yet.
      const newRow = {
        user_id: snap.user_id,
        computed_at: now.toISOString(),
        health: currentScores.health ?? 0,
        wealth: currentScores.wealth ?? 0,
        career: currentScores.career ?? 0,
        marriage: currentScores.marriage ?? 0,
        children: currentScores.children ?? 0,
        family: currentScores.family ?? 0,
        spiritual: currentScores.spiritual ?? 0,
        education: currentScores.education ?? 0,
        trigger_event: `domain_activation_cron_${topChange.domain}`,
      };

      const { error: storeErr } = await supabase
        .from('domain_readings')
        .insert(newRow);
      if (storeErr) {
        console.error(`[DomainActivations] Failed to store reading for user ${snap.user_id}:`, storeErr.message);
        continue; // Skip notification + push — next run retries cleanly.
      }

      // Round 2 IDEM-7 — notification + push only AFTER the dedup
      // anchor lands. Use dedup_key on the notification too so a
      // mid-cron retry doesn't re-deliver the in-app alert.
      const bucket = utcDayBucket();
      const { error: notifErr } = await supabase.from('user_notifications').upsert({
        user_id: snap.user_id,
        type: 'domain_activation',
        title,
        body,
        metadata: {
          domain: topChange.domain,
          delta: topChange.delta,
          currentScore: topChange.current,
          previousScore: topChange.previous,
          allChanges: changes.map(c => ({ domain: c.domain, delta: c.delta })),
        },
        read: false,
        dedup_key: buildNotificationDedupKey({
          userId: snap.user_id,
          type: 'domain_activation',
          metadata: { domain: topChange.domain, deltaSign: Math.sign(topChange.delta) },
          bucket,
        }),
      }, { onConflict: 'dedup_key', ignoreDuplicates: true });
      if (notifErr) {
        console.error(`[DomainActivations] Notification upsert failed for user ${snap.user_id}:`, notifErr.message);
        // Continue to push regardless — the domain_readings row is the
        // authoritative dedup anchor. A missing in-app row is a soft
        // failure compared to the push that's still going out.
      }

      // Send push notification (non-blocking)
      try {
        await sendPushToUser(snap.user_id, {
          title,
          body,
          url: `/en/kundali?domain=${topChange.domain}`,
          tag: 'domain-activation',
        });
      } catch (pushErr) {
        console.error(`[DomainActivations] Push failed for user ${snap.user_id}:`, pushErr);
      }

      notified++;
    } catch (err) {
      console.error('[domain-activations] user processing failed:', snap.user_id, err);
    }
  }

  return NextResponse.json({
    success: true,
    processed,
    notified,
    timestamp: now.toISOString(),
  });
}

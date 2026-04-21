import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { computePersonalTransits, type PersonalTransit } from '@/lib/transit/personal-transits';
import { sendPushToUser } from '@/lib/push/send-push';
import type { DomainType } from '@/lib/kundali/domain-synthesis/types';

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
  health: 'Vitality is strong — great time for health initiatives!',
  wealth: 'Financial prospects are favorable — consider investments.',
  career: 'Favorable period for professional growth!',
  marriage: 'Harmonious energy for relationships and partnerships.',
  children: 'Positive energy for matters related to children and creativity.',
  family: 'Good time for family bonding and domestic harmony.',
  spiritual: 'Spiritual insights are heightened — deepen your practice.',
  education: 'Excellent period for learning and intellectual pursuits.',
};

const DOMAIN_WEAK_ADVICE: Record<DomainType, string> = {
  currentPeriod: 'Navigate this period with mindfulness.',
  health: 'Pay extra attention to wellness and rest.',
  wealth: 'Be cautious with finances — avoid impulsive spending.',
  career: 'Patience and communication are key at work.',
  marriage: 'Patience and open communication are key in relationships.',
  children: 'Be attentive to children and creative projects.',
  family: 'Family dynamics may need extra care and attention.',
  spiritual: 'Spiritual challenges may arise — stay grounded.',
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
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET?.trim()}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // Get all users with stored chart data containing SAV table
  const { data: snapshots, error: snapError } = await supabase
    .from('kundali_snapshots')
    .select('user_id, chart_data, ascendant_sign');

  if (snapError || !snapshots) {
    return NextResponse.json({ error: snapError?.message || 'No snapshots found' }, { status: 500 });
  }

  let processed = 0;
  let notified = 0;

  for (const snap of snapshots) {
    const chartData = typeof snap.chart_data === 'string'
      ? JSON.parse(snap.chart_data)
      : snap.chart_data;

    const savTable = chartData?.ashtakavarga?.savTable;
    const ascSign = chartData?.ascendant?.sign || snap.ascendant_sign;
    if (!savTable || !ascSign) continue;

    processed++;

    // Compute current transits for this user
    const transits = computePersonalTransits(ascSign, savTable);
    const significant = transits.filter(t => t.quality === 'strong' || t.quality === 'weak');

    if (significant.length === 0) continue;

    // Deduplicate: check for transit_alert notifications in the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 86_400_000).toISOString();
    const { data: existing } = await supabase
      .from('user_notifications')
      .select('metadata')
      .eq('user_id', snap.user_id)
      .eq('type', 'transit_alert')
      .gte('created_at', sevenDaysAgo);

    const existingPlanets = new Set(
      (existing || []).map(e => e.metadata?.planetId),
    );

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
      body = `${topTransit.planetName.en} is transiting your ${ordinal(topTransit.house)} house (${zoneLabel}, ${topTransit.savBindu} bindus). Your **${domainLabel}** domain is ${topTransit.quality === 'strong' ? 'activated' : 'facing pressure'} — ${advice}`;
    } else {
      body = `${topTransit.planetName.en} is transiting your ${ordinal(topTransit.house)} house (${topTransit.signName.en}, ${topTransit.savBindu} bindus). ${topTransit.quality === 'strong' ? 'Favorable period — take action!' : 'Navigate carefully.'}`;
    }

    const alertTitle = `Transit Alert: ${topTransit.planetName.en} in ${topTransit.signName.en}`;

    // Build push URL — link to domain deep dive if domain is known
    const pushUrl = domainMapping
      ? `/en/kundali?domain=${domainMapping.domain}`
      : '/en/kundali';

    await supabase.from('user_notifications').insert({
      user_id: snap.user_id,
      type: 'transit_alert',
      title: alertTitle,
      body,
      metadata: {
        planetId: topTransit.planetId,
        sign: topTransit.currentSign,
        house: topTransit.house,
        quality: topTransit.quality,
        savBindu: topTransit.savBindu,
        domain: domainMapping?.domain ?? null,
        domainPrimary: domainMapping?.primary ?? false,
      },
      read: false,
    });

    // Send web push notification (non-blocking — don't fail the cron if push fails)
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

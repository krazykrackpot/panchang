import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { computePersonalTransits } from '@/lib/transit/personal-transits';
import { sendPushToUser } from '@/lib/push/send-push';

// ---------------------------------------------------------------------------
// GET /api/cron/transit-alerts
// Called by Vercel Cron weekly (Sunday 6 AM UTC).
// Creates in-app notifications for significant transits.
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

    const body = `${topTransit.planetName.en} is transiting your ${topTransit.quality === 'strong' ? 'strong' : 'weak'} zone (${topTransit.signName.en}, ${topTransit.savBindu} bindus). ${topTransit.quality === 'strong' ? 'Favorable period — take action!' : 'Navigate carefully.'}`;

    const alertTitle = `Transit Alert: ${topTransit.planetName.en} in ${topTransit.signName.en}`;

    await supabase.from('user_notifications').insert({
      user_id: snap.user_id,
      type: 'transit_alert',
      title: alertTitle,
      body,
      metadata: {
        planetId: topTransit.planetId,
        sign: topTransit.currentSign,
        quality: topTransit.quality,
        savBindu: topTransit.savBindu,
      },
      read: false,
    });

    // Send web push notification (non-blocking — don't fail the cron if push fails)
    try {
      await sendPushToUser(snap.user_id, {
        title: alertTitle,
        body,
        url: '/en/kundali',
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

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import type { KundaliData, DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// GET /api/cron/monthly-readings
// Called by Vercel Cron on the 1st of each month at 2 AM UTC.
// Ensures every user with a kundali snapshot gets a domain_readings row
// for the current month. Users who already have one (e.g. from
// domain-activations cron) are skipped.
// ---------------------------------------------------------------------------

const SCORED_DOMAINS = [
  'health', 'wealth', 'career', 'marriage',
  'children', 'family', 'spiritual', 'education',
] as const;

/**
 * Find the currently active dasha entry at the given level.
 */
function findActiveDasha(
  dashas: DashaEntry[],
  level: 'maha' | 'antar',
  now: Date,
): DashaEntry | undefined {
  const nowMs = now.getTime();
  if (level === 'maha') {
    return dashas.find(
      d => d.level === 'maha' && new Date(d.startDate).getTime() <= nowMs && new Date(d.endDate).getTime() > nowMs,
    );
  }
  // For antar, search within the active maha's subPeriods
  const activeMaha = findActiveDasha(dashas, 'maha', now);
  if (!activeMaha?.subPeriods) return undefined;
  return activeMaha.subPeriods.find(
    d => new Date(d.startDate).getTime() <= nowMs && new Date(d.endDate).getTime() > nowMs,
  );
}

export async function GET(req: NextRequest) {
  // Auth check — same pattern as transit-alerts
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET?.trim()}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // 1. Get all users with chart snapshots
  const { data: snapshots, error: snapError } = await supabase
    .from('kundali_snapshots')
    .select('user_id, chart_data');

  if (snapError) {
    return NextResponse.json({ error: snapError.message }, { status: 500 });
  }

  if (!snapshots?.length) {
    return NextResponse.json({ processed: 0, skipped: 0, errors: 0 });
  }

  // 2. Check which users already have this month's reading
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { data: existingReadings } = await supabase
    .from('domain_readings')
    .select('user_id')
    .gte('computed_at', monthStart);

  const alreadyDone = new Set((existingReadings || []).map(r => r.user_id));

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const snap of snapshots) {
    if (alreadyDone.has(snap.user_id)) {
      skipped++;
      continue;
    }

    try {
      // 3. Parse chart data into KundaliData
      const kundali: KundaliData = typeof snap.chart_data === 'string'
        ? JSON.parse(snap.chart_data)
        : snap.chart_data;

      if (!kundali?.ascendant || !kundali?.planets || !kundali?.dashas) {
        skipped++;
        continue;
      }

      // 4. Synthesize full reading
      const reading = synthesizeReading(kundali);

      // 5. Extract 8 domain scores
      const scores: Record<string, number> = {};
      for (const domainReading of reading.domains) {
        scores[domainReading.domain] = domainReading.natalPromise.rating.score;
      }

      // 6. Extract current dasha info from the kundali data
      const activeMaha = findActiveDasha(kundali.dashas, 'maha', now);
      const activeAntar = findActiveDasha(kundali.dashas, 'antar', now);

      // 7. Determine Sade Sati status
      const sadeSatiObj = kundali.sadeSati as { isActive?: boolean } | undefined;
      const sadeSatiActive = sadeSatiObj?.isActive ?? false;

      // 8. Store the reading (reading_month for unique constraint)
      const readingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
      await supabase.from('domain_readings').insert({
        user_id: snap.user_id,
        computed_at: now.toISOString(),
        reading_month: readingMonth,
        health: scores.health ?? 5,
        wealth: scores.wealth ?? 5,
        career: scores.career ?? 5,
        marriage: scores.marriage ?? 5,
        children: scores.children ?? 5,
        family: scores.family ?? 5,
        spiritual: scores.spiritual ?? 5,
        education: scores.education ?? 5,
        maha_dasha: activeMaha?.planet ?? null,
        antar_dasha: activeAntar?.planet ?? null,
        sade_sati_active: sadeSatiActive,
        overall_activation: reading.currentPeriod.periodScore ?? 5,
        trigger_event: 'monthly_cron',
      });

      processed++;
    } catch (err) {
      console.error(`[MonthlyReadings] Error for user ${snap.user_id}:`, err);
      errors++;
    }
  }

  return NextResponse.json({
    processed,
    skipped,
    errors,
    timestamp: now.toISOString(),
  });
}

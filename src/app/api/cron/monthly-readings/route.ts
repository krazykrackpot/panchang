import { NextRequest, NextResponse } from 'next/server';
import { verifyCronAuth } from '@/lib/api/cron-auth';
import { getServerSupabase } from '@/lib/supabase/server';
import { synthesizeReading } from '@/lib/kundali/domain-synthesis/synthesizer';
import type { KundaliData, DashaEntry } from '@/types/kundali';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';

// Synthesises domain readings per user — O(N). At ~50 users 60s is fine.
// If this starts timing out: chunk into batches or move to Hetzner cron.
export const maxDuration = 60;

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
  const authError = verifyCronAuth(req);
  if (authError) return authError;

  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 });
  }

  // 1. Get all users with chart snapshots
  const { data: snapshots, error: snapError } = await supabase
    .from('kundali_snapshots')
    .select('user_id, chart_data, computation_version');

  if (snapError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  if (!snapshots?.length) {
    return NextResponse.json({ processed: 0, skipped: 0, errors: 0 });
  }

  // 2. Check which users already have this month's reading.
  // If this query fails, alreadyDone is empty and we'd duplicate every
  // user's reading on the next cron retry (idempotency broken). Surface
  // the failure as 500 so the scheduler doesn't silently churn dupes.
  //
  // SCALABILITY (Gemini #120 review): we pull the full month's domain_readings
  // user_id list into memory and then iterate snapshots in step 3. At the
  // current user base (~hundreds) this is bounded and fine; at 100k+ users
  // we'd want a server-side anti-join (RPC: `SELECT s.user_id FROM
  // kundali_snapshots s WHERE NOT EXISTS (SELECT 1 FROM domain_readings r
  // WHERE r.user_id = s.user_id AND r.computed_at >= $monthStart)`).
  // Tracked as future-refactor; per-row payload here is just the uuid so
  // bytes-over-the-wire stay small until the user count balloons.
  const now = new Date();
  // Date.UTC so the month-start boundary is consistent regardless of
  // server local TZ (CLAUDE.md Lesson L).
  const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();

  const { data: existingReadings, error: existingErr } = await supabase
    .from('domain_readings')
    .select('user_id')
    .gte('computed_at', monthStart);
  if (existingErr) {
    console.error('[cron/monthly-readings] existingReadings fetch failed:', existingErr.message);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const alreadyDone = new Set((existingReadings || []).map(r => r.user_id));

  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const snap of snapshots) {
    if (alreadyDone.has(snap.user_id)) {
      skipped++;
      continue;
    }

    if (isSnapshotStale(snap)) {
      const fresh = await recomputeSnapshotDirect(supabase, snap.user_id);
      if (!fresh) { console.error(`[cron/monthly-readings] Could not recompute for ${snap.user_id}`); skipped++; continue; }
      Object.assign(snap, fresh);
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
        scores[domainReading.domain] = domainReading.overallRating.score;
      }

      // 6. Extract current dasha info from the kundali data
      const activeMaha = findActiveDasha(kundali.dashas, 'maha', now);
      const activeAntar = findActiveDasha(kundali.dashas, 'antar', now);

      // 7. Determine Sade Sati status
      const sadeSatiObj = kundali.sadeSati as { isActive?: boolean } | undefined;
      const sadeSatiActive = sadeSatiObj?.isActive ?? false;

      // Round 2 SF-9 / IDEM-6 — capture { error } AND upsert. The
      // previous .insert() returned its error in { error } (it does NOT
      // throw), so the surrounding try/catch was dead for DB failures.
      // On a Vercel cron retry (502 on first attempt), the same loop
      // ran again; every insert hit the unique violation on
      // (user_id, reading_month), `error` was silently set, the row
      // wasn't written, but `processed++` ran anyway → stats lied and
      // next month's delta comparison ran against a stale baseline.
      //
      // Use upsert with onConflict='user_id,reading_month' so retries
      // become idempotent and capture the error to surface real DB
      // failures.
      // Round 2 SF-10 — use UTC for reading_month, matching the cron's
      // UTC schedule. Local-tz month math would shift the boundary by
      // up to a day on a non-UTC host.
      const readingMonth = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, '0')}-01`;
      const { error: insertErr } = await supabase.from('domain_readings').upsert({
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
      }, { onConflict: 'user_id,reading_month', ignoreDuplicates: true });
      if (insertErr) {
        console.error('[MonthlyReadings] upsert failed for', snap.user_id, ':', insertErr.message);
        errors++;
        continue;
      }

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

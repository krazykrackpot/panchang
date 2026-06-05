/**
 * Load the kundali for the subject of a Brihaspati question.
 *
 * Three paths:
 *
 *   1. subject_saved_chart_id IS NULL → the asker's own chart.
 *      Read from kundali_snapshots (the existing pipeline). This is the
 *      default and matches all rows that existed before migration 029.
 *
 *   2. subject_saved_chart_id IS NOT NULL → a family member's chart.
 *      Read saved_charts.chart_data if present. If it's null (the user
 *      saved a label but never opened the chart page that computes it),
 *      generate it on-demand from birth_data and cache it back to
 *      saved_charts.chart_data so the next ask is fast.
 *
 *   3. subject_saved_chart_id was set but the row is missing or has no
 *      birth_data → return null + reason. The route surfaces a clean
 *      error rather than narrating about a blank chart.
 *
 * The returned shape is the same one normaliseSnapshot() accepts on both
 * branches — `full_kundali` always wins when present, `chart_data` is
 * the fallback for legacy snapshots. We deliberately don't try to merge
 * the two: generateKundali() output IS the `full_kundali` shape (see
 * family-synthesis/route.ts which uses the same call).
 */
import type { SupabaseClient } from '@supabase/supabase-js';
import { generateKundali } from '@/lib/ephem/kundali-calc';
import { isSnapshotStale, recomputeSnapshotDirect } from '@/lib/supabase/get-fresh-snapshot';
import type { BirthData } from '@/types/kundali';

export type LoadResult =
  | {
      ok: true;
      // Inputs the normaliser accepts. Either full_kundali OR chart_data
      // (or both) will be populated.
      full_kundali: unknown;
      chart_data: unknown;
      computation_version: string | undefined;
      // Display name for the subject. Drives the LLM "your daughter's
      // chart shows…" framing.
      subjectName: string | null;
      // 'self' or 'family' — for telemetry and prompt framing.
      kind: 'self' | 'family';
    }
  | {
      ok: false;
      reason:
        | 'no_self_snapshot'           // user has no kundali_snapshots row
        | 'chart_not_found'            // subject_saved_chart_id doesn't belong to user
        | 'chart_missing_birth_data';  // saved_chart row exists but birth_data is null
    };

interface Args {
  supabase: SupabaseClient;
  userId: string;
  subjectChartId: string | null;
}

export async function loadSubjectKundali({
  supabase,
  userId,
  subjectChartId,
}: Args): Promise<LoadResult> {
  // ── Self (no subject chart) ─────────────────────────────────────────
  if (!subjectChartId) {
    const { data: snapshot, error } = await supabase
      .from('kundali_snapshots')
      .select('chart_data, full_kundali, computation_version')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) {
      console.error('[brihaspati/load-subject] self snapshot read failed:', error.message);
      return { ok: false, reason: 'no_self_snapshot' };
    }
    if (!snapshot) {
      return { ok: false, reason: 'no_self_snapshot' };
    }

    // Staleness gate — Brihaspati AI narrates as if speaking in the user's
    // present moment. Serving a chart computed against an older engine
    // means hallucinated transits, wrong dasha periods, or stale yoga
    // detection. Recompute via the direct service-role path (no
    // /api/user/profile fetch round-trip from inside this loader).
    if (isSnapshotStale(snapshot)) {
      const fresh = await recomputeSnapshotDirect(supabase, userId);
      if (fresh) {
        return {
          ok: true,
          full_kundali: fresh.full_kundali ?? null,
          chart_data: fresh.chart_data ?? null,
          computation_version: fresh.computation_version,
          subjectName: null,
          kind: 'self',
        };
      }
      // Recompute failed (no birth data, RLS edge case). Fall through to
      // returning the stale snapshot — narration is still safer than
      // refusing the question, and the staleness will surface via the
      // engine_version field on the response.
      console.warn('[brihaspati/load-subject] recompute of stale self snapshot failed, returning stale');
    }

    return {
      ok: true,
      full_kundali: snapshot.full_kundali ?? null,
      chart_data: snapshot.chart_data ?? null,
      computation_version: typeof snapshot.computation_version === 'string' ? snapshot.computation_version : undefined,
      subjectName: null,
      kind: 'self',
    };
  }

  // ── Family member ──────────────────────────────────────────────────
  const { data: chart, error } = await supabase
    .from('saved_charts')
    .select('id, label, birth_data, chart_data, relationship')
    .eq('id', subjectChartId)
    .eq('user_id', userId) // belt-and-braces; the order route already validated
    .maybeSingle();
  if (error) {
    console.error('[brihaspati/load-subject] saved chart read failed:', error.message);
    return { ok: false, reason: 'chart_not_found' };
  }
  if (!chart) {
    return { ok: false, reason: 'chart_not_found' };
  }

  const birthData = chart.birth_data as BirthData | null;
  const subjectName = (birthData?.name && String(birthData.name).trim())
    || (chart.label && String(chart.label).trim())
    || null;

  // Cached chart_data short-circuit
  if (chart.chart_data) {
    return {
      ok: true,
      full_kundali: chart.chart_data, // saved_charts.chart_data IS the full kundali (see family-synthesis)
      chart_data: chart.chart_data,
      computation_version: undefined,
      subjectName,
      kind: 'family',
    };
  }

  if (!birthData) {
    return { ok: false, reason: 'chart_missing_birth_data' };
  }

  // Compute on-demand. generateKundali() emits the `full_kundali` shape.
  const kundali = generateKundali(birthData);

  // Cache back so the next ask is instant. Non-fatal on failure — the
  // narration can proceed from the in-memory object even if the write
  // fails (e.g. RLS edge case, transient DB hiccup).
  void supabase
    .from('saved_charts')
    .update({ chart_data: kundali })
    .eq('id', chart.id)
    .eq('user_id', userId)
    .then(({ error: updErr }) => {
      if (updErr) {
        console.error('[brihaspati/load-subject] chart_data cache write failed:', updErr.message);
      }
    });

  return {
    ok: true,
    full_kundali: kundali,
    chart_data: kundali,
    computation_version: undefined,
    subjectName,
    kind: 'family',
  };
}

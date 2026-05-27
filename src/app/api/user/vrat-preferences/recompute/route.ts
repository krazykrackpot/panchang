/**
 * POST /api/user/vrat-preferences/recompute
 *
 * Recomputes and persists next_reminder_due_at for one or more vrat
 * preference rows owned by the authenticated user.
 *
 * Called immediately after any client-side upsert to user_vrat_preferences
 * (VratTracker.tsx, dashboard/vrats/page.tsx) so the cron's early-exit
 * check always sees an up-to-date timestamp rather than a NULL/stale value.
 *
 * Body: { vrat_types?: string[] }
 *   - Omit or pass [] to recompute ALL enabled rows for the user.
 *   - Pass specific slugs to recompute only those rows.
 *
 * Response: { updated: number, skipped: number }
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 1
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import {
  recomputeNextReminderDueAt,
  NEXT_REMINDER_INFINITY,
  type VratPrefMinimal,
} from '@/lib/vrat/next-reminder';
import type { VratTradition } from '@/lib/vrat/generator';

export const maxDuration = 10;

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'DB not configured' }, { status: 503 });
  }

  // Auth: Bearer token from the client.
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const token = authHeader.slice(7).trim();
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: { vrat_types?: unknown } = {};
  try {
    body = await req.json();
  } catch {
    // Empty body is fine — recompute all.
  }
  const rawTypes = Array.isArray(body.vrat_types) ? body.vrat_types : [];
  const targetTypes = rawTypes.filter((t): t is string => typeof t === 'string');

  // Fetch the user's profile for location context.
  const { data: prof, error: profErr } = await supabase
    .from('user_profiles')
    .select('vrat_tradition, vrat_location_lat, vrat_location_lng, vrat_location_tz, parana_reminder_offset_minutes')
    .eq('id', user.id)
    .maybeSingle();

  if (profErr) {
    console.error('[vrat-prefs/recompute] profile fetch failed:', profErr.message);
    return NextResponse.json({ error: 'Profile fetch failed' }, { status: 500 });
  }

  // If the user has no location yet, we can't compute sunrise-based timing.
  // Return success with 0 updated — the cron's IS NULL fallback self-heals.
  if (!prof?.vrat_location_lat || !prof?.vrat_location_lng || !prof?.vrat_location_tz) {
    return NextResponse.json({ updated: 0, skipped: 0, reason: 'no_location' });
  }

  const userCtx = {
    lat: Number(prof.vrat_location_lat),
    lng: Number(prof.vrat_location_lng),
    tz: prof.vrat_location_tz as string,
    tradition: ((prof.vrat_tradition ?? 'smarta') as VratTradition),
    paranaOffsetMin: (prof.parana_reminder_offset_minutes as number) ?? 30,
  };

  // Fetch the pref rows to recompute.
  let prefsQuery = supabase
    .from('user_vrat_preferences')
    .select(
      'user_id, vrat_type, enabled, email_reminders, remind_day_before, remind_parana, start_date, end_date, last_day_before_reminder_date, last_parana_reminder_date',
    )
    .eq('user_id', user.id)
    .eq('email_reminders', true);

  if (targetTypes.length > 0) {
    prefsQuery = prefsQuery.in('vrat_type', targetTypes);
  }

  const { data: prefs, error: prefsErr } = await prefsQuery;
  if (prefsErr) {
    console.error('[vrat-prefs/recompute] prefs fetch failed:', prefsErr.message);
    return NextResponse.json({ error: 'Prefs fetch failed' }, { status: 500 });
  }
  if (!prefs || prefs.length === 0) {
    return NextResponse.json({ updated: 0, skipped: 0 });
  }

  let updated = 0;
  let skipped = 0;

  for (const row of prefs as VratPrefMinimal[]) {
    let nextDue: Date | typeof NEXT_REMINDER_INFINITY | null;
    try {
      nextDue = recomputeNextReminderDueAt(row, userCtx);
    } catch (err) {
      console.error('[vrat-prefs/recompute] recompute threw for', user.id, row.vrat_type, ':', err);
      skipped++;
      continue;
    }

    if (nextDue === null) {
      // Cannot compute (missing context) — skip; leave existing value.
      skipped++;
      continue;
    }

    const isoOrInfinity = nextDue === NEXT_REMINDER_INFINITY
      ? 'infinity'
      : (nextDue as Date).toISOString();

    const { error: updateErr } = await supabase
      .from('user_vrat_preferences')
      .update({ next_reminder_due_at: isoOrInfinity })
      .eq('user_id', user.id)
      .eq('vrat_type', row.vrat_type);

    if (updateErr) {
      console.error('[vrat-prefs/recompute] update failed for', user.id, row.vrat_type, ':', updateErr.message);
      skipped++;
      continue;
    }

    updated++;
  }

  return NextResponse.json({ updated, skipped });
}

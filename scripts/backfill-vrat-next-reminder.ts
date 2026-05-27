#!/usr/bin/env npx tsx
/**
 * scripts/backfill-vrat-next-reminder.ts
 *
 * One-time, idempotent backfill: compute next_reminder_due_at for every
 * enabled vrat-preference row that is still NULL (i.e. rows that existed
 * before migration 045 was applied).
 *
 * Idempotent: rows that already have a non-NULL next_reminder_due_at are
 * skipped — re-running the script is safe.
 *
 * Usage:
 *   npx tsx scripts/backfill-vrat-next-reminder.ts
 *
 * Requires: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in the env.
 *
 * Spec: docs/superpowers/specs/2026-05-27-vercel-cost-reduction-design.md §2 Fix 1 + §3
 */

import { getServerSupabase } from '../src/lib/supabase/server';
import {
  recomputeNextReminderDueAt,
  NEXT_REMINDER_INFINITY,
  type VratPrefMinimal,
} from '../src/lib/vrat/next-reminder';
import type { VratTradition } from '../src/lib/vrat/generator';

async function main() {
  const sb = getServerSupabase();
  if (!sb) {
    console.error('[backfill-vrat-next-reminder] No Supabase — check env vars');
    process.exit(1);
  }

  // Fetch all enabled rows where next_reminder_due_at IS NULL (unmigrated).
  // Rows that already have a value (including 'infinity') are skipped.
  const { data: rows, error: fetchErr } = await sb
    .from('user_vrat_preferences')
    .select(
      'user_id, vrat_type, enabled, email_reminders, remind_day_before, remind_parana, start_date, end_date, last_day_before_reminder_date, last_parana_reminder_date',
    )
    .eq('enabled', true)
    .is('next_reminder_due_at', null);

  if (fetchErr) {
    console.error('[backfill-vrat-next-reminder] fetch failed:', fetchErr.message);
    process.exit(1);
  }
  if (!rows || rows.length === 0) {
    console.log('[backfill-vrat-next-reminder] No NULL rows to backfill. Done.');
    return;
  }

  console.log(`[backfill-vrat-next-reminder] ${rows.length} NULL rows to backfill`);

  // Collect unique user IDs so we can fetch profiles in one round-trip.
  const userIds = Array.from(new Set(rows.map((r) => r.user_id)));

  const { data: profiles, error: profErr } = await sb
    .from('user_profiles')
    .select('id, vrat_tradition, vrat_location_lat, vrat_location_lng, vrat_location_tz, parana_reminder_offset_minutes')
    .in('id', userIds);

  if (profErr) {
    console.error('[backfill-vrat-next-reminder] profiles fetch failed:', profErr.message);
    process.exit(1);
  }

  interface Profile {
    id: string;
    vrat_tradition: string | null;
    vrat_location_lat: number | null;
    vrat_location_lng: number | null;
    vrat_location_tz: string | null;
    parana_reminder_offset_minutes: number | null;
  }

  const profileMap = new Map<string, Profile>();
  for (const p of (profiles ?? []) as Profile[]) {
    profileMap.set(p.id, p);
  }

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const row of rows as VratPrefMinimal[]) {
    const prof = profileMap.get(row.user_id);
    if (!prof || prof.vrat_location_lat == null || prof.vrat_location_lng == null || !prof.vrat_location_tz) {
      // No location set — skip; the cron's IS NULL fallback will handle
      // retrying when the user eventually sets their location.
      skipped++;
      continue;
    }

    const userCtx = {
      lat: Number(prof.vrat_location_lat),
      lng: Number(prof.vrat_location_lng),
      tz: prof.vrat_location_tz,
      tradition: (prof.vrat_tradition ?? 'smarta') as VratTradition,
      paranaOffsetMin: prof.parana_reminder_offset_minutes ?? 30,
    };

    let nextDue: Date | typeof NEXT_REMINDER_INFINITY | null;
    try {
      nextDue = recomputeNextReminderDueAt(row, userCtx);
    } catch (err) {
      console.error('[backfill-vrat-next-reminder] recompute threw for', row.user_id, row.vrat_type, ':', err);
      failed++;
      continue;
    }

    if (nextDue === null) {
      // Cannot compute — leave NULL; cron will self-heal when possible.
      skipped++;
      continue;
    }

    const isoOrInfinity = nextDue === NEXT_REMINDER_INFINITY
      ? 'infinity'
      : (nextDue as Date).toISOString();

    const { error: updateErr } = await sb
      .from('user_vrat_preferences')
      .update({ next_reminder_due_at: isoOrInfinity })
      .eq('user_id', row.user_id)
      .eq('vrat_type', row.vrat_type)
      .is('next_reminder_due_at', null); // guard: only update if still NULL (idempotency)

    if (updateErr) {
      console.error('[backfill-vrat-next-reminder] update failed for', row.user_id, row.vrat_type, ':', updateErr.message);
      failed++;
      continue;
    }

    console.log(`  ✓ ${row.user_id} / ${row.vrat_type} → ${isoOrInfinity}`);
    updated++;
  }

  console.log(`\n[backfill-vrat-next-reminder] Done. Updated: ${updated}, Skipped: ${skipped}, Failed: ${failed}`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error('[backfill-vrat-next-reminder] Unhandled error:', err);
  process.exit(1);
});

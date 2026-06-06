#!/usr/bin/env tsx
/**
 * One-shot backfill: rebuild every `user_progress` row from source-of-truth
 * tables (`saved_charts`, `learning_progress`, `user_profiles`).
 *
 * Why this exists
 * ---------------
 * Before the 2026-06-06 award.ts refactor, the gamification counters
 * (charts_saved, modules_done, level_unlocked_at) were event-driven: every
 * place that wrote to `saved_charts` was supposed to call
 * `awardProgress({type:'chart_saved'})`. Almost none of them did. Result:
 * users with 5+ saved charts and an 8-module learning streak were still
 * showing as Shishya (level 1) because their `user_progress.charts_saved`
 * counter was stuck at 0.
 *
 * This script reads the real tables and upserts a corrected row. After the
 * refactor, awardProgress() re-reads on every call, so the next sign-in
 * keeps the row fresh. This backfill is to close the historical gap.
 *
 * What it does
 * ------------
 *   For every user_progress row (and every user_profiles row without one):
 *     1. COUNT(*) FROM saved_charts WHERE user_id = $1
 *     2. COUNT(*) FROM learning_progress WHERE user_id = $1 AND status = 'mastered'
 *     3. Read profile fields (dob, tob, place, name)
 *     4. Run computeLevel() with the same inputs awardProgress now uses
 *     5. Upsert the row with fresh counters and the newly-unlocked levels
 *        in level_unlocked_at (one-way promotion — never decrease)
 *
 * It does NOT touch:
 *   - streak_days / streak_last_visit (event-driven; backfill would be wrong)
 *   - tools_used (no source-of-truth table)
 *   - referrals_count (no source-of-truth table)
 *
 * Idempotent. Safe to run multiple times.
 *
 * Usage
 * -----
 *   npx tsx scripts/backfill-user-progress.ts                 # report only
 *   npx tsx scripts/backfill-user-progress.ts --apply         # actually upsert
 *   npx tsx scripts/backfill-user-progress.ts --user <uuid>   # one user
 *
 * Env vars used:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js';
import { computeLevel } from '../src/lib/gamification/level-compute';

const args = process.argv.slice(2);
const APPLY = args.includes('--apply');
const ONLY_USER = (() => {
  const i = args.indexOf('--user');
  return i >= 0 && args[i + 1] ? args[i + 1] : null;
})();

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !key) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
const sb = createClient(url, key, { auth: { persistSession: false } });

interface ProgressRow {
  user_id: string;
  current_level: number;
  level_unlocked_at: Record<string, string>;
  streak_days: number;
  tools_used: string[];
  charts_saved: number;
  modules_done: number;
  referrals_count: number;
}

async function recomputeUser(userId: string): Promise<{
  before: ProgressRow | null;
  after: ProgressRow;
  changed: boolean;
}> {
  const [progressRes, chartsRes, modulesRes, profileRes] = await Promise.all([
    sb.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
    sb.from('saved_charts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
    sb.from('learning_progress').select('user_id', { count: 'exact', head: true })
      .eq('user_id', userId).eq('status', 'mastered'),
    sb.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_place, display_name')
      .eq('id', userId).maybeSingle(),
  ]);

  const before: ProgressRow | null = progressRes.data as ProgressRow | null;
  const profile = profileRes.data;

  const chartsSaved = chartsRes.count ?? 0;
  const modulesDone = modulesRes.count ?? 0;

  const profileFieldsComplete =
    !!profile?.date_of_birth &&
    !!profile?.time_of_birth &&
    !!profile?.birth_place &&
    !!profile?.display_name;

  // Preserve existing event-driven state (streak, tools_used, referrals_count,
  // and level_unlocked_at promotions already earned).
  const existingUnlocks = before?.level_unlocked_at ?? {};
  const toolsUsed = before?.tools_used ?? [];
  const referralsCount = before?.referrals_count ?? 0;

  const profileComplete =
    profileFieldsComplete
    || !!existingUnlocks['2']
    || chartsSaved >= 1;

  const hasFirstAction =
    chartsSaved >= 1
    || modulesDone >= 1
    || !!existingUnlocks['3'];

  const acharyaUnlocked = !!existingUnlocks['6'];

  const newLevel = computeLevel({
    profileComplete,
    hasFirstAction,
    streakDays: before?.streak_days ?? 0,
    modulesDone,
    toolsUsedCount: toolsUsed.length,
    acharyaUnlocked,
    chartsSaved,
  });

  // Merge level_unlocked_at: keep all existing timestamps, add any new ones
  // for levels we just promoted past.
  const newUnlocks = { ...existingUnlocks };
  const nowIso = new Date().toISOString();
  for (let l = 2; l <= newLevel; l++) {
    if (!newUnlocks[String(l)]) newUnlocks[String(l)] = nowIso;
  }

  // current_level is one-way (max of old + new) to honour the promotion-only
  // contract.
  const currentLevel = Math.max(before?.current_level ?? 1, newLevel);

  const after: ProgressRow = {
    user_id: userId,
    current_level: currentLevel,
    level_unlocked_at: newUnlocks,
    streak_days: before?.streak_days ?? 0,
    tools_used: toolsUsed,
    charts_saved: chartsSaved,
    modules_done: modulesDone,
    referrals_count: referralsCount,
  };

  const changed =
    !before
    || before.current_level !== after.current_level
    || before.charts_saved !== after.charts_saved
    || before.modules_done !== after.modules_done
    || JSON.stringify(before.level_unlocked_at ?? {}) !== JSON.stringify(after.level_unlocked_at);

  return { before, after, changed };
}

async function listUserIds(): Promise<string[]> {
  if (ONLY_USER) return [ONLY_USER];
  // Cover every user that has EITHER a user_progress row OR a profile —
  // a user with a profile but no progress row should also get one created.
  const [progressRes, profileRes] = await Promise.all([
    sb.from('user_progress').select('user_id'),
    sb.from('user_profiles').select('id'),
  ]);
  const ids = new Set<string>();
  for (const r of progressRes.data ?? []) ids.add(r.user_id);
  for (const r of profileRes.data ?? []) ids.add(r.id);
  return [...ids];
}

async function main() {
  console.log(`Backfill user_progress — ${APPLY ? 'APPLY' : 'DRY RUN'}${ONLY_USER ? ` (user ${ONLY_USER})` : ''}`);
  const ids = await listUserIds();
  console.log(`Found ${ids.length} candidate user(s)`);

  let changedCount = 0;
  let upsertErrs = 0;
  for (const id of ids) {
    try {
      const { before, after, changed } = await recomputeUser(id);
      if (!changed) continue;
      changedCount += 1;
      console.log(
        `  ${id}: lvl ${before?.current_level ?? '∅'} → ${after.current_level} ` +
          `| charts ${before?.charts_saved ?? '∅'} → ${after.charts_saved} ` +
          `| modules ${before?.modules_done ?? '∅'} → ${after.modules_done}`,
      );
      if (APPLY) {
        const { error } = await sb.from('user_progress').upsert({
          user_id: after.user_id,
          current_level: after.current_level,
          level_unlocked_at: after.level_unlocked_at,
          streak_days: after.streak_days,
          tools_used: after.tools_used,
          charts_saved: after.charts_saved,
          modules_done: after.modules_done,
          referrals_count: after.referrals_count,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' });
        if (error) {
          console.error(`    upsert failed: ${error.message}`);
          upsertErrs += 1;
        }
      }
    } catch (err) {
      console.error(`  ${id}: ${err instanceof Error ? err.message : err}`);
      upsertErrs += 1;
    }
  }

  console.log('');
  console.log(`Summary: ${changedCount}/${ids.length} changed${APPLY ? '' : ' (dry run)'}` +
              (upsertErrs ? `, ${upsertErrs} error(s)` : ''));
  if (!APPLY && changedCount > 0) {
    console.log('Re-run with --apply to write the changes.');
  }
}

main().catch((err) => {
  console.error('Fatal:', err);
  process.exit(1);
});

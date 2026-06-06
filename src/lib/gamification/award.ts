// src/lib/gamification/award.ts
import { getServerSupabase } from '@/lib/supabase/server';
import { computeStreakAfterVisit } from './streak';
import { computeLevel } from './level-compute';
import { computeEarnedBadges } from './badge-compute';
import { todayIst } from './ist-day';
import { COUNTED_TOOLS } from '@/lib/constants/badges';
import type { GamificationEvent, AwardResult, UserProgress } from './types';

/**
 * Single entry point. Logs but does NOT throw on DB failure — gamification is
 * non-critical; the main action (chart save etc.) must still succeed.
 *
 * Source-of-truth counters (refactored 2026-06-06):
 *   - `charts_saved`  = COUNT(*) FROM saved_charts WHERE user_id = $1
 *   - `modules_done`  = COUNT(*) FROM learning_progress WHERE user_id = $1 AND status = 'mastered'
 *   - `profileComplete` = user_profiles fields populated (dob + tob + place + name)
 *
 * Every awardProgress() call freshly reads these from the source tables, so a
 * chart save that bypassed this entry point (e.g. `stores/charts-store.ts`
 * writing to `saved_charts` directly) is still picked up on the next sign-in.
 * Previously these counters were fragile event-driven increments — every
 * caller had to invoke awardProgress exactly once per event, and most didn't,
 * which is how a user with 5 saved charts could be stuck at level 1 forever.
 *
 * Streak / tools_used / referrals_count REMAIN event-driven:
 *   - `streak_days` is stateful (depends on previous visits) — not derivable.
 *   - `tools_used` has no source-of-truth table; the array on user_progress
 *     IS the source. Callers must fire `tool_used` events.
 *   - `referrals_count` similarly has no separate source-of-truth table.
 *
 * Idempotency boundary:
 *   - DB writes are idempotent (badge inserts dedupe on PK, level_unlocked_at
 *     only sets a level's timestamp on its first unlock).
 *   - Source-of-truth counter reads are by construction idempotent.
 *   - tools_used / referrals_count still rely on callers firing events at most
 *     once per real event.
 */
export async function awardProgress(
  userId: string,
  event: GamificationEvent
): Promise<AwardResult | null> {
  const sb = getServerSupabase();
  if (!sb) {
    console.error('[gamification] award failed: no server supabase (env missing)');
    return null;
  }

  try {
    // Parallelize all reads — they're independent.
    const [progressRes, badgesRes, chartsRes, modulesRes, profileRes] = await Promise.all([
      sb.from('user_progress').select('*').eq('user_id', userId).maybeSingle(),
      sb.from('user_badges').select('badge_slug').eq('user_id', userId),
      sb.from('saved_charts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
      sb.from('learning_progress').select('user_id', { count: 'exact', head: true })
        .eq('user_id', userId).eq('status', 'mastered'),
      sb.from('user_profiles')
        .select('date_of_birth, time_of_birth, birth_place, display_name')
        .eq('id', userId).maybeSingle(),
    ]);
    const { data: existing, error: readErr } = progressRes;
    const { data: existingBadges } = badgesRes;

    if (readErr) {
      console.error('[gamification] read user_progress failed:', readErr);
      return null;
    }
    if (chartsRes.error) console.error('[gamification] charts count read failed:', chartsRes.error);
    if (modulesRes.error) console.error('[gamification] modules count read failed:', modulesRes.error);
    if (profileRes.error) console.error('[gamification] profile read failed:', profileRes.error);

    let row: UserProgress = existing ?? {
      user_id: userId,
      current_level: 1,
      level_unlocked_at: {},
      streak_days: 0,
      streak_last_visit: null,
      streak_freeze_used_at: null,
      tools_used: [],
      modules_done: 0,
      charts_saved: 0,
      referrals_count: 0,
      updated_at: new Date().toISOString(),
    };

    row = applyEvent(row, event);

    // Source-of-truth counter overrides — these are authoritative regardless
    // of whether the event-driven counters fired. The previous numbers on the
    // row are discarded.
    row.charts_saved = chartsRes.count ?? row.charts_saved;
    row.modules_done = modulesRes.count ?? row.modules_done;

    const profile = profileRes.data;
    const profileFieldsComplete =
      !!profile?.date_of_birth &&
      !!profile?.time_of_birth &&
      !!profile?.birth_place &&
      !!profile?.display_name;
    const profileComplete =
      profileFieldsComplete
      || !!row.level_unlocked_at['2']
      || event.type === 'profile_completed'
      || row.charts_saved >= 1;

    const hasFirstAction =
      row.charts_saved >= 1
      || row.modules_done >= 1
      || !!row.level_unlocked_at['3'];
    const acharyaUnlocked = !!row.level_unlocked_at['6'];

    const newLevel = computeLevel({
      profileComplete,
      hasFirstAction,
      streakDays: row.streak_days,
      modulesDone: row.modules_done,
      toolsUsedCount: row.tools_used.length,
      acharyaUnlocked,
      chartsSaved: row.charts_saved,
    });

    let levelChanged = false;
    if (newLevel > row.current_level) {
      row.current_level = newLevel;
      const nowIso = new Date().toISOString();
      for (let l = 2; l <= newLevel; l++) {
        if (!row.level_unlocked_at[String(l)]) {
          row.level_unlocked_at[String(l)] = nowIso;
          levelChanged = true;
        }
      }
    }

    const existingSlugs = new Set((existingBadges ?? []).map(b => b.badge_slug));

    const earned = computeEarnedBadges({
      profileComplete,
      chartsSaved: row.charts_saved,
      modulesDone: row.modules_done,
      nakshatraModulesDone: 0,
      toolsUsedCount: row.tools_used.length,
      streakDays: row.streak_days,
      visitedOnBirthday: false,
      visitedBeforeSixAmIst: false,
      visitedOnFestival: false,
    });

    const newBadges: string[] = [];
    for (const slug of earned) {
      if (!existingSlugs.has(slug)) newBadges.push(slug);
    }

    row.updated_at = new Date().toISOString();

    const { error: upsertErr } = await sb
      .from('user_progress')
      .upsert(row, { onConflict: 'user_id' });
    if (upsertErr) {
      console.error('[gamification] upsert user_progress failed:', upsertErr);
      return null;
    }

    if (newBadges.length > 0) {
      const rows = newBadges.map(slug => ({ user_id: userId, badge_slug: slug }));
      const { error: insertErr } = await sb
        .from('user_badges')
        .upsert(rows, { onConflict: 'user_id,badge_slug', ignoreDuplicates: true });
      if (insertErr) {
        console.error('[gamification] insert badges failed:', insertErr);
      }
    }

    return { levelChanged, newBadges, progress: row };
  } catch (err) {
    console.error('[gamification] award failed:', err);
    return null;
  }
}

/**
 * Pure: returns a new UserProgress with the event applied.
 *
 * For events whose state lives on a source-of-truth table (`chart_saved`,
 * `module_completed`, `profile_completed`) this is a no-op — the caller
 * (`awardProgress`) re-reads the count after applyEvent and overwrites
 * the field. Those event branches are kept so the union remains
 * exhaustive and callers can still fire the event for analytics/badge
 * purposes without an `unknown event type` error.
 */
function applyEvent(row: UserProgress, event: GamificationEvent): UserProgress {
  const next: UserProgress = {
    ...row,
    tools_used: [...row.tools_used],
    level_unlocked_at: { ...row.level_unlocked_at },
  };
  switch (event.type) {
    case 'sign_in': {
      const r = computeStreakAfterVisit({
        streakDays: next.streak_days,
        lastVisit: next.streak_last_visit,
        freezeUsedAt: next.streak_freeze_used_at,
        today: todayIst(),
      });
      next.streak_days = r.streakDays;
      next.streak_last_visit = r.lastVisit;
      next.streak_freeze_used_at = r.freezeUsedAt;
      return next;
    }
    // Source-of-truth events — counter is set by awardProgress() after this
    // function returns. No-op here.
    case 'profile_completed':
    case 'chart_saved':
    case 'module_completed':
      return next;
    case 'tool_used':
      if (COUNTED_TOOLS.includes(event.tool_slug as typeof COUNTED_TOOLS[number])
          && !next.tools_used.includes(event.tool_slug)) {
        next.tools_used.push(event.tool_slug);
      }
      return next;
    case 'muhurta_saved':
      if (!next.level_unlocked_at['3']) {
        next.level_unlocked_at['3'] = new Date().toISOString();
      }
      return next;
    case 'referral_signup':
      next.referrals_count += 1;
      if (next.referrals_count >= 3 && !next.level_unlocked_at['6']) {
        next.level_unlocked_at['6'] = new Date().toISOString();
      }
      return next;
    case 'translation_accepted':
      if (!next.level_unlocked_at['6']) {
        next.level_unlocked_at['6'] = new Date().toISOString();
      }
      return next;
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}

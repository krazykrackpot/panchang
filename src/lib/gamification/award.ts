// src/lib/gamification/award.ts
import { getServerSupabase } from '@/lib/supabase/server';
import { computeStreakAfterVisit } from './streak';
import { computeLevel } from './level-compute';
import { computeEarnedBadges } from './badge-compute';
import { todayIst } from './ist-day';
import { COUNTED_TOOLS } from '@/lib/constants/badges';
import type { GamificationEvent, AwardResult, UserProgress } from './types';

/**
 * Single entry point. Idempotent — callers may invoke for the same event repeatedly.
 * Logs but does NOT throw on DB failure — gamification is non-critical; the main
 * action (chart save etc.) must still succeed.
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
    const { data: existing, error: readErr } = await sb
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (readErr) {
      console.error('[gamification] read user_progress failed:', readErr);
      return null;
    }

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

    const profileComplete =
      !!row.level_unlocked_at['2']
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

    const { data: existingBadges } = await sb
      .from('user_badges')
      .select('badge_slug')
      .eq('user_id', userId);
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
      const { error: insertErr } = await sb.from('user_badges').insert(rows);
      if (insertErr && !String(insertErr.message).includes('duplicate')) {
        console.error('[gamification] insert badges failed:', insertErr);
      }
    }

    return { levelChanged, newBadges, progress: row };
  } catch (err) {
    console.error('[gamification] award failed:', err);
    return null;
  }
}

/** Pure: returns a new UserProgress with the event applied. */
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
    case 'profile_completed':
      return next;
    case 'chart_saved':
      next.charts_saved += 1;
      return next;
    case 'module_completed':
      next.modules_done += 1;
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

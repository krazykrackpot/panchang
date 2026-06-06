/**
 * Source-of-truth recompute in awardProgress() — pins the contract that
 * fixes the "user with 5 saved charts stuck at Shishya" bug.
 *
 * Pre-refactor, awardProgress relied on event-driven counter increments;
 * any chart-save site that bypassed it (e.g. stores/charts-store.ts) left
 * the row's counters stale forever. Post-refactor, every call freshly
 * reads `saved_charts`, `learning_progress`, and `user_profiles` and
 * derives the level from those.
 *
 * We mock the supabase client surface awardProgress() actually touches
 * (six parallel reads + two upserts) so the test is deterministic and
 * doesn't require a live DB.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

const TEST_USER_ID = '00000000-0000-0000-0000-000000000abc';

interface SupabaseRow {
  user_progress?: Record<string, unknown> | null;
  user_badges?: Array<{ badge_slug: string }>;
  saved_charts_count?: number;
  modules_done_count?: number;
  profile?: {
    date_of_birth: string | null;
    time_of_birth: string | null;
    birth_place: string | null;
    display_name: string | null;
  } | null;
}

/**
 * Build a mock supabase client that mirrors the per-table query shapes
 * awardProgress() actually uses (see award.ts: the 5 parallel reads).
 * Captures the upsert payload for assertions.
 */
function buildMockSupabase(fixture: SupabaseRow) {
  const upserts: Array<{ table: string; payload: unknown }> = [];

  const mockFrom = (table: string) => {
    if (table === 'user_progress') {
      // .select('*').eq('user_id', x).maybeSingle()
      // OR .upsert(payload, { onConflict: 'user_id' })
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: () =>
              Promise.resolve({ data: fixture.user_progress ?? null, error: null }),
          }),
        }),
        upsert: (payload: unknown) => {
          upserts.push({ table, payload });
          return Promise.resolve({ error: null });
        },
      };
    }
    if (table === 'user_badges') {
      // .select('badge_slug').eq('user_id', x)  → array data
      // OR .upsert(rows, ...)
      return {
        select: () => ({
          eq: () => Promise.resolve({ data: fixture.user_badges ?? [], error: null }),
        }),
        upsert: (payload: unknown) => {
          upserts.push({ table, payload });
          return Promise.resolve({ error: null });
        },
      };
    }
    if (table === 'saved_charts') {
      // .select('id', { count: 'exact', head: true }).eq('user_id', x) → {count}
      return {
        select: () => ({
          eq: () =>
            Promise.resolve({ count: fixture.saved_charts_count ?? null, error: null }),
        }),
      };
    }
    if (table === 'learning_progress') {
      // .select('user_id', { count: 'exact', head: true }).eq('user_id', x).eq('status', y) → {count}
      return {
        select: () => ({
          eq: () => ({
            eq: () =>
              Promise.resolve({ count: fixture.modules_done_count ?? null, error: null }),
          }),
        }),
      };
    }
    if (table === 'user_profiles') {
      // .select(fields).eq('id', x).maybeSingle()
      return {
        select: () => ({
          eq: () => ({
            maybeSingle: () =>
              Promise.resolve({ data: fixture.profile ?? null, error: null }),
          }),
        }),
      };
    }
    throw new Error(`unmocked table: ${table}`);
  };

  return {
    client: { from: mockFrom },
    upserts,
  };
}

vi.mock('@/lib/supabase/server', () => ({
  getServerSupabase: vi.fn(),
}));

import { getServerSupabase } from '@/lib/supabase/server';
import { awardProgress } from '../award';
import { todayIst } from '../ist-day';

// For sign_in tests, set lastVisit = today so the streak doesn't reset to 1.
const TODAY_IST = todayIst();

describe('awardProgress — source-of-truth counters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reads charts_saved from saved_charts table, not the row counter', async () => {
    // The bug we are fixing: row.charts_saved = 0 but the user has 5 actual
    // saved_charts. Pre-refactor the level evaluator would see 0 and stick
    // the user at Shishya. Post-refactor, charts_saved is sourced from the
    // saved_charts COUNT, so the level evaluator sees 5.
    const { client, upserts } = buildMockSupabase({
      user_progress: {
        user_id: TEST_USER_ID,
        current_level: 1,
        level_unlocked_at: {},
        streak_days: 15,
        streak_last_visit: TODAY_IST,
        streak_freeze_used_at: null,
        tools_used: [],
        modules_done: 0, // row says 0 …
        charts_saved: 0, // … row says 0 …
        referrals_count: 0,
        updated_at: '2026-06-06T00:00:00Z',
      },
      saved_charts_count: 5,    // … but table says 5
      modules_done_count: 8,    // … and table says 8 mastered modules
      profile: {
        date_of_birth: '1980-09-23',
        time_of_birth: '10:30',
        birth_place: 'Delhi',
        display_name: 'Test User',
      },
    });
    (getServerSupabase as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const result = await awardProgress(TEST_USER_ID, { type: 'sign_in' });

    expect(result).not.toBeNull();
    expect(result?.progress.charts_saved).toBe(5);
    expect(result?.progress.modules_done).toBe(8);
    // With profile complete + 5 charts + 15-day streak + 0 tools used,
    // the level evaluator should land at Vidvan (4).
    expect(result?.progress.current_level).toBe(4);
    expect(upserts[0].table).toBe('user_progress');
  });

  it('derives profileComplete from user_profiles fields (no event needed)', async () => {
    const { client } = buildMockSupabase({
      user_progress: null, // no prior row
      saved_charts_count: 0,
      modules_done_count: 0,
      profile: {
        date_of_birth: '1980-09-23',
        time_of_birth: '10:30',
        birth_place: 'Delhi',
        display_name: 'Test User',
      },
    });
    (getServerSupabase as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const result = await awardProgress(TEST_USER_ID, { type: 'sign_in' });

    // Profile complete + no first action → level 2 (Sadhaka), not 1 (Shishya).
    expect(result?.progress.current_level).toBe(2);
    expect(result?.progress.level_unlocked_at['2']).toBeTruthy();
  });

  it('stays at Shishya when profile fields are missing', async () => {
    const { client } = buildMockSupabase({
      user_progress: null,
      saved_charts_count: 0,
      modules_done_count: 0,
      profile: {
        date_of_birth: null,
        time_of_birth: null,
        birth_place: null,
        display_name: null,
      },
    });
    (getServerSupabase as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const result = await awardProgress(TEST_USER_ID, { type: 'sign_in' });

    expect(result?.progress.current_level).toBe(1);
  });

  it('promotes to Vidvan on 7+ day streak when profile + charts present', async () => {
    const { client } = buildMockSupabase({
      user_progress: {
        user_id: TEST_USER_ID,
        current_level: 1,
        level_unlocked_at: {},
        streak_days: 7,
        streak_last_visit: TODAY_IST,
        streak_freeze_used_at: null,
        tools_used: [],
        modules_done: 0,
        charts_saved: 0,
        referrals_count: 0,
        updated_at: '2026-06-06T00:00:00Z',
      },
      saved_charts_count: 1,
      modules_done_count: 0,
      profile: {
        date_of_birth: '1980-09-23',
        time_of_birth: '10:30',
        birth_place: 'Delhi',
        display_name: 'Test User',
      },
    });
    (getServerSupabase as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const result = await awardProgress(TEST_USER_ID, { type: 'sign_in' });

    expect(result?.progress.current_level).toBe(4);
    expect(result?.progress.level_unlocked_at['2']).toBeTruthy();
    expect(result?.progress.level_unlocked_at['3']).toBeTruthy();
    expect(result?.progress.level_unlocked_at['4']).toBeTruthy();
  });

  it('never regresses current_level even if source-of-truth shrinks', async () => {
    // User was at Vidvan; some charts got deleted → charts_saved=0 in DB.
    // computeLevel would say level 2 (no first action). The promotion
    // contract holds: current_level stays at 4.
    const { client } = buildMockSupabase({
      user_progress: {
        user_id: TEST_USER_ID,
        current_level: 4,
        level_unlocked_at: { '2': '2026-01-01T00:00:00Z', '3': '2026-01-02T00:00:00Z', '4': '2026-01-03T00:00:00Z' },
        streak_days: 0,
        streak_last_visit: TODAY_IST,
        streak_freeze_used_at: null,
        tools_used: [],
        modules_done: 0,
        charts_saved: 0,
        referrals_count: 0,
        updated_at: '2026-06-06T00:00:00Z',
      },
      saved_charts_count: 0,
      modules_done_count: 0,
      profile: {
        date_of_birth: '1980-09-23',
        time_of_birth: '10:30',
        birth_place: 'Delhi',
        display_name: 'Test User',
      },
    });
    (getServerSupabase as ReturnType<typeof vi.fn>).mockReturnValue(client);

    const result = await awardProgress(TEST_USER_ID, { type: 'sign_in' });

    expect(result?.progress.current_level).toBe(4);
  });
});

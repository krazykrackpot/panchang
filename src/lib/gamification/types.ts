// src/lib/gamification/types.ts
import type { Trilingual } from '@/types/panchang';

export type LevelSlug =
  | 'shishya' | 'sadhaka' | 'jignasu' | 'vidvan' | 'jyotishi' | 'acharya' | 'rishi';

export type BadgeCategory = 'profile' | 'charts' | 'learning' | 'tools' | 'streak' | 'special';

export interface Level {
  /** 1-based ordinal. Persisted as user_progress.current_level. */
  ordinal: number;
  slug: LevelSlug;
  name: Trilingual;
  /** Short human-readable criteria for the UI. */
  criteria: Trilingual;
  /** Path under /public, served as next/image source. */
  image: `/sadhaka-path/${LevelSlug}.webp`;
}

export interface Badge {
  slug: string;
  name: Trilingual;
  description: Trilingual;
  category: BadgeCategory;
  /** Component key — looked up in BadgeIcons.tsx by slug. */
  iconKey: string;
}

/** Row mirror of public.user_progress. */
export interface UserProgress {
  user_id: string;
  current_level: number; // 1..7
  level_unlocked_at: Record<string, string>; // { "2": "2026-05-21T…", … }
  streak_days: number;
  streak_last_visit: string | null; // YYYY-MM-DD (IST)
  streak_freeze_used_at: string | null; // YYYY-MM-DD (IST)
  tools_used: string[];
  modules_done: number;
  charts_saved: number;
  referrals_count: number;
  updated_at: string;
}

export type GamificationEvent =
  | { type: 'sign_in' }
  | { type: 'profile_completed' }
  | { type: 'chart_saved'; relationship?: string }
  | { type: 'module_completed'; module_id: string }
  | { type: 'tool_used'; tool_slug: string }
  | { type: 'muhurta_saved' }
  | { type: 'referral_signup' }
  | { type: 'translation_accepted' };

export interface AwardResult {
  /** True if any of these triggered a new entry in user_progress.level_unlocked_at. */
  levelChanged: boolean;
  /** Slugs of any badges newly written into user_badges by this call. */
  newBadges: string[];
  /** Resulting progress row (post-mutation). */
  progress: UserProgress;
}

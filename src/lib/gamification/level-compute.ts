// src/lib/gamification/level-compute.ts

export interface LevelInputs {
  profileComplete: boolean;
  hasFirstAction: boolean;
  streakDays: number;
  modulesDone: number;
  toolsUsedCount: number;
  acharyaUnlocked: boolean;
  chartsSaved: number;
}

/**
 * Pure: returns the highest level (1..7) the inputs satisfy.
 * No state — caller stores `level_unlocked_at` to prevent regression in the DB.
 */
export function computeLevel(i: LevelInputs): number {
  if (!i.profileComplete) return 1;
  if (!i.hasFirstAction) return 2;
  if (i.streakDays < 7 && i.modulesDone < 5) return 3;
  if (i.toolsUsedCount < 5) return 4;
  if (!i.acharyaUnlocked) return 5;
  if (i.streakDays >= 30 && i.chartsSaved >= 10 && i.modulesDone >= 10) return 7;
  return 6;
}

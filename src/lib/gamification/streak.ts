// src/lib/gamification/streak.ts
import { daysBetweenIst, isMondayIst, lastMondayIst } from './ist-day';

export interface StreakInput {
  streakDays: number;
  lastVisit: string | null;
  freezeUsedAt: string | null;
  today: string; // IST YYYY-MM-DD
}
export interface StreakOutput {
  streakDays: number;
  lastVisit: string;
  freezeUsedAt: string | null;
  levelChanged: false; // placeholder — level recompute lives elsewhere
}

/**
 * Pure: given the user's existing streak state + today's IST date,
 * return the new state. Encapsulates the Monday-freeze rule.
 */
export function computeStreakAfterVisit(input: StreakInput): StreakOutput {
  const { streakDays, lastVisit, freezeUsedAt, today } = input;

  if (!lastVisit) {
    return { streakDays: 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  const gap = daysBetweenIst(lastVisit, today);

  if (gap === 0) {
    return { streakDays, lastVisit, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  if (gap === 1) {
    return { streakDays: streakDays + 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  // Gap >= 2: single-Monday freeze can save us if today is Tuesday and freeze unused
  if (gap === 2) {
    const thisMonday = lastMondayIst(today);
    const missedDay = lastMondayIst(today);
    const tuesdayCheck = !isMondayIst(today) && daysBetweenIst(thisMonday, today) === 1;
    const freezeAvailable = freezeUsedAt == null || freezeUsedAt < thisMonday;
    if (tuesdayCheck && freezeAvailable) {
      return {
        streakDays: streakDays + 1,
        lastVisit: today,
        freezeUsedAt: missedDay,
        levelChanged: false,
      };
    }
  }

  return { streakDays: 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
}

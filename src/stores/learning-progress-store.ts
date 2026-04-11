'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/auth-store';
import { MODULE_SEQUENCE, getPhaseModules } from '@/lib/learn/module-sequence';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ModuleProgress {
  moduleId: string;
  status: 'in_progress' | 'mastered';
  quizScore: number | null;
  quizPassedAt: string | null;
  lastPageRead: number;
  lastAccessedAt: string;
}

export interface StreakData {
  streakDays: number;
  lastActiveDate: string;       // YYYY-MM-DD
  longestStreak: number;
  streakFreezeAvailable: boolean;
  lastFreezeUsed: string | null; // YYYY-MM-DD or null
}

interface LearningProgressStore {
  progress: Record<string, ModuleProgress>;
  streak: StreakData;
  sidebarExpanded: boolean;
  hydrated: boolean;

  hydrateFromStorage: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
  markPageRead: (moduleId: string, pageIndex: number) => void;
  markQuizPassed: (moduleId: string, score: number) => void;
  checkAndUpdateStreak: () => void;
  toggleSidebar: () => void;

  getModuleStatus: (moduleId: string) => 'not_started' | 'in_progress' | 'mastered';
  getNextModule: () => string | null;
  getPhaseProgress: (phase: number) => { mastered: number; total: number; percent: number };
  getOverallProgress: () => { mastered: number; total: number; percent: number };
  isActiveToday: () => boolean;
}

// ── localStorage keys ─────────────────────────────────────────────────────────

const PROGRESS_KEY = 'dekho-panchang-learn-progress';
const SIDEBAR_KEY = 'dekho-panchang-sidebar-state';
const STREAK_KEY = 'dekho-panchang-learn-streak';

// ── Default streak ────────────────────────────────────────────────────────────

const DEFAULT_STREAK: StreakData = {
  streakDays: 0,
  lastActiveDate: '',
  longestStreak: 0,
  streakFreezeAvailable: true,
  lastFreezeUsed: null,
};

// ── Merge helpers ─────────────────────────────────────────────────────────────

/** Returns the "higher" of two statuses: mastered > in_progress */
function mergeStatus(
  a: ModuleProgress['status'],
  b: ModuleProgress['status'],
): ModuleProgress['status'] {
  if (a === 'mastered' || b === 'mastered') return 'mastered';
  return 'in_progress';
}

/** Merge two ModuleProgress records using "highest state wins" rule */
function mergeModuleProgress(local: ModuleProgress, remote: ModuleProgress): ModuleProgress {
  const status = mergeStatus(local.status, remote.status);
  const quizScore =
    local.quizScore !== null && remote.quizScore !== null
      ? Math.max(local.quizScore, remote.quizScore)
      : (local.quizScore ?? remote.quizScore);
  const quizPassedAt =
    local.quizPassedAt && remote.quizPassedAt
      ? local.quizPassedAt > remote.quizPassedAt
        ? local.quizPassedAt
        : remote.quizPassedAt
      : (local.quizPassedAt ?? remote.quizPassedAt);
  const lastPageRead = Math.max(local.lastPageRead, remote.lastPageRead);
  const lastAccessedAt =
    local.lastAccessedAt > remote.lastAccessedAt
      ? local.lastAccessedAt
      : remote.lastAccessedAt;

  return {
    moduleId: local.moduleId,
    status,
    quizScore,
    quizPassedAt,
    lastPageRead,
    lastAccessedAt,
  };
}

// ── localStorage helpers ───────────────────────────────────────────────────────

function readProgressFromStorage(): Record<string, ModuleProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ModuleProgress>) : {};
  } catch {
    return {};
  }
}

function writeProgressToStorage(progress: Record<string, ModuleProgress>): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

function readSidebarFromStorage(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const raw = window.localStorage.getItem(SIDEBAR_KEY);
    return raw === null ? true : raw === 'true';
  } catch {
    return true;
  }
}

function writeSidebarToStorage(expanded: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(SIDEBAR_KEY, String(expanded));
  } catch {
    // ignore
  }
}

function readStreakFromStorage(): StreakData {
  if (typeof window === 'undefined') return { ...DEFAULT_STREAK };
  try {
    const raw = window.localStorage.getItem(STREAK_KEY);
    return raw ? { ...DEFAULT_STREAK, ...(JSON.parse(raw) as Partial<StreakData>) } : { ...DEFAULT_STREAK };
  } catch {
    return { ...DEFAULT_STREAK };
  }
}

function writeStreakToStorage(streak: StreakData): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STREAK_KEY, JSON.stringify(streak));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

/** Get today's date string in YYYY-MM-DD (local time) */
function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Get date N days ago in YYYY-MM-DD (local time) */
function getDaysAgoStr(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Check if today is Monday (for weekly freeze reset) */
function isTodayMonday(): boolean {
  return new Date().getDay() === 1;
}

// ── Real-time Supabase upsert (fire-and-forget for logged-in users) ───────────

function upsertToSupabase(entry: ModuleProgress): void {
  const userId = useAuthStore.getState().user?.id;
  if (!userId) return;
  const supabase = getSupabase();
  if (!supabase) return;

  supabase
    .from('learning_progress')
    .upsert({
      user_id: userId,
      module_id: entry.moduleId,
      status: entry.status,
      quiz_score: entry.quizScore,
      quiz_passed_at: entry.quizPassedAt,
      last_page_read: entry.lastPageRead,
      last_accessed_at: entry.lastAccessedAt,
    }, { onConflict: 'user_id,module_id' })
    .then(({ error }) => {
      if (error) console.warn('[LearningProgress] Upsert error:', error.message);
    });
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useLearningProgressStore = create<LearningProgressStore>((set, get) => ({
  progress: {},
  streak: { ...DEFAULT_STREAK },
  sidebarExpanded: true,
  hydrated: false,

  // ── Hydration ───────────────────────────────────────────────────────────────

  hydrateFromStorage: () => {
    const progress = readProgressFromStorage();
    const sidebarExpanded = readSidebarFromStorage();
    let streak = readStreakFromStorage();

    // Reset freeze availability every Monday
    if (isTodayMonday() && !streak.streakFreezeAvailable) {
      // Only reset if the last freeze wasn't used today
      if (streak.lastFreezeUsed !== getTodayStr()) {
        streak = { ...streak, streakFreezeAvailable: true };
        writeStreakToStorage(streak);
      }
    }

    set({ progress, streak, sidebarExpanded, hydrated: true });
  },

  // ── Supabase sync ────────────────────────────────────────────────────────────

  syncWithSupabase: async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('learning_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        console.error('[LearningProgress] Supabase fetch error:', error.message);
        return;
      }

      const local = get().progress;
      const merged: Record<string, ModuleProgress> = { ...local };

      if (data) {
        for (const row of data) {
          const remoteEntry: ModuleProgress = {
            moduleId: row.module_id as string,
            status: row.status as ModuleProgress['status'],
            quizScore: row.quiz_score as number | null,
            quizPassedAt: row.quiz_passed_at as string | null,
            lastPageRead: (row.last_page_read as number) ?? 0,
            lastAccessedAt: row.last_accessed_at as string,
          };

          const existing = merged[remoteEntry.moduleId];
          merged[remoteEntry.moduleId] = existing
            ? mergeModuleProgress(existing, remoteEntry)
            : remoteEntry;
        }
      }

      // Write merged state back to localStorage and memory
      set({ progress: merged });
      writeProgressToStorage(merged);

      // Upsert merged rows to DB
      const rows = Object.values(merged).map((p) => ({
        user_id: userId,
        module_id: p.moduleId,
        status: p.status,
        quiz_score: p.quizScore,
        quiz_passed_at: p.quizPassedAt,
        last_page_read: p.lastPageRead,
        last_accessed_at: p.lastAccessedAt,
      }));

      if (rows.length > 0) {
        const { error: upsertError } = await supabase
          .from('learning_progress')
          .upsert(rows, { onConflict: 'user_id,module_id' });

        if (upsertError) {
          console.error('[LearningProgress] Supabase upsert error:', upsertError.message);
        }
      }
    } catch (err) {
      console.error('[LearningProgress] Unexpected sync error:', err);
    }
  },

  // ── Progress mutations ───────────────────────────────────────────────────────

  markPageRead: (moduleId: string, pageIndex: number) => {
    const current = get().progress;
    const existing = current[moduleId];

    // Don't downgrade a mastered module
    if (existing?.status === 'mastered') return;

    const updated: ModuleProgress = {
      moduleId,
      status: 'in_progress',
      quizScore: existing?.quizScore ?? null,
      quizPassedAt: existing?.quizPassedAt ?? null,
      lastPageRead: Math.max(existing?.lastPageRead ?? 0, pageIndex),
      lastAccessedAt: new Date().toISOString(),
    };

    const next = { ...current, [moduleId]: updated };
    set({ progress: next });
    writeProgressToStorage(next);
    upsertToSupabase(updated);
    get().checkAndUpdateStreak();
  },

  markQuizPassed: (moduleId: string, score: number) => {
    const current = get().progress;
    const existing = current[moduleId];

    const bestScore =
      existing?.quizScore !== null && existing?.quizScore !== undefined
        ? Math.max(existing.quizScore, score)
        : score;

    const updated: ModuleProgress = {
      moduleId,
      status: 'mastered',
      quizScore: bestScore,
      quizPassedAt: existing?.quizPassedAt ?? new Date().toISOString(),
      lastPageRead: existing?.lastPageRead ?? 0,
      lastAccessedAt: new Date().toISOString(),
    };

    const next = { ...current, [moduleId]: updated };
    set({ progress: next });
    writeProgressToStorage(next);
    upsertToSupabase(updated);
    get().checkAndUpdateStreak();
  },

  checkAndUpdateStreak: () => {
    const current = get().streak;
    const today = getTodayStr();
    const yesterday = getDaysAgoStr(1);
    const twoDaysAgo = getDaysAgoStr(2);

    // Already active today — no change needed
    if (current.lastActiveDate === today) return;

    let newStreak: StreakData;

    if (current.lastActiveDate === yesterday) {
      // Consecutive day — increment streak
      const newDays = current.streakDays + 1;
      newStreak = {
        ...current,
        streakDays: newDays,
        lastActiveDate: today,
        longestStreak: Math.max(current.longestStreak, newDays),
      };
    } else if (current.lastActiveDate === twoDaysAgo && current.streakFreezeAvailable) {
      // Missed one day but freeze is available — use freeze, keep streak
      const newDays = current.streakDays + 1;
      newStreak = {
        ...current,
        streakDays: newDays,
        lastActiveDate: today,
        longestStreak: Math.max(current.longestStreak, newDays),
        streakFreezeAvailable: false,
        lastFreezeUsed: yesterday,
      };
    } else if (current.lastActiveDate === '') {
      // First ever activity
      newStreak = {
        ...current,
        streakDays: 1,
        lastActiveDate: today,
        longestStreak: Math.max(current.longestStreak, 1),
      };
    } else {
      // Streak broken — reset to 1
      newStreak = {
        ...current,
        streakDays: 1,
        lastActiveDate: today,
        longestStreak: Math.max(current.longestStreak, 1),
      };
    }

    set({ streak: newStreak });
    writeStreakToStorage(newStreak);
  },

  // ── Sidebar ──────────────────────────────────────────────────────────────────

  toggleSidebar: () => {
    const next = !get().sidebarExpanded;
    set({ sidebarExpanded: next });
    writeSidebarToStorage(next);
  },

  // ── Computed ─────────────────────────────────────────────────────────────────

  getModuleStatus: (moduleId: string) => {
    const entry = get().progress[moduleId];
    if (!entry) return 'not_started';
    return entry.status;
  },

  getNextModule: () => {
    const { progress } = get();
    for (const mod of MODULE_SEQUENCE) {
      if (progress[mod.id]?.status !== 'mastered') {
        return mod.id;
      }
    }
    return null;
  },

  getPhaseProgress: (phase: number) => {
    const { progress } = get();
    const modules = getPhaseModules(phase);
    const total = modules.length;
    const mastered = modules.filter((m) => progress[m.id]?.status === 'mastered').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { mastered, total, percent };
  },

  getOverallProgress: () => {
    const { progress } = get();
    const total = MODULE_SEQUENCE.length;
    const mastered = MODULE_SEQUENCE.filter((m) => progress[m.id]?.status === 'mastered').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { mastered, total, percent };
  },

  isActiveToday: () => {
    return get().streak.lastActiveDate === getTodayStr();
  },
}));

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

interface LearningProgressStore {
  progress: Record<string, ModuleProgress>;
  sidebarExpanded: boolean;
  hydrated: boolean;

  hydrateFromStorage: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
  markPageRead: (moduleId: string, pageIndex: number) => void;
  markQuizPassed: (moduleId: string, score: number) => void;
  toggleSidebar: () => void;

  getModuleStatus: (moduleId: string) => 'not_started' | 'in_progress' | 'mastered';
  getNextModule: () => string | null;
  getPhaseProgress: (phase: number) => { mastered: number; total: number; percent: number };
  getOverallProgress: () => { mastered: number; total: number; percent: number };
}

// ── localStorage keys ─────────────────────────────────────────────────────────

const PROGRESS_KEY = 'dekho-panchang-learn-progress';
const SIDEBAR_KEY = 'dekho-panchang-sidebar-state';

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
  sidebarExpanded: true,
  hydrated: false,

  // ── Hydration ───────────────────────────────────────────────────────────────

  hydrateFromStorage: () => {
    const progress = readProgressFromStorage();
    const sidebarExpanded = readSidebarFromStorage();
    set({ progress, sidebarExpanded, hydrated: true });
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
}));

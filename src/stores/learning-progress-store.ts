'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import { MODULE_SEQUENCE, CURRICULUM_MODULES, getPhaseModules } from '@/lib/learn/module-sequence';
import { fireModuleCompleted } from '@/lib/gamification/client-events';

// NOTE: do NOT import useAuthStore here. auth-store imports this store
// to call reset() on sign-out; importing useAuthStore back would create
// a circular dep that can leave one of the stores `undefined` at module-
// evaluation time. Resolve the current user via supabase.auth.getSession()
// instead (localStorage read, no network, no nav-lock contention).
// Module-scope in-flight dedupe for syncWithSupabase. LearnSidebar and
// LearnSidebarMobile both mount on responsive tablet layouts and each
// fires its own sync on user.id change — without dedupe, two concurrent
// select+upsert round-trips can race and the later upsert overwrites
// the merged result of the first. Same canonical pattern as
// subscription-store's per-user-id key.
let inFlightSync: Promise<void> | null = null;
let inFlightSyncKey: string | null = null;

async function getCurrentUserId(): Promise<string | null> {
  const supabase = getSupabase();
  if (!supabase) return null;
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id ?? null;
}

// ── Types ─────────────────────────────────────────────────────────────────────

export interface ReviewItem {
  moduleId: string;
  question: string;       // en text of the question
  questionHi: string;     // hi text of the question
  options: string[];      // en option texts (for mcq)
  optionsHi: string[];    // hi option texts (for mcq)
  correctIndex: number;   // correct answer index
  explanation: string;    // en explanation
  explanationHi: string;  // hi explanation
  nextReviewDate: string; // ISO date (YYYY-MM-DD)  –  when to show again
  interval: number;       // days until next review (starts at 1, doubles on correct)
  easeFactor: number;     // SM-2 ease factor (starts at 2.5)
}

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
  reviewQueue: ReviewItem[];
  sidebarExpanded: boolean;
  hydrated: boolean;

  /**
   * Last upsert failure message — null when the most recent fire-and-forget
   * write to `learning_progress` succeeded (or never ran for a signed-out
   * user). Surfaced to the dashboard banner so users see "your progress
   * isn't syncing" instead of silently losing writes (the fire-and-forget
   * upserts previously only logged to console). Cleared on next successful
   * upsert or via `clearSyncError()`.
   */
  lastSyncError: string | null;

  hydrateFromStorage: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
  markPageRead: (moduleId: string, pageIndex: number) => void;
  markQuizPassed: (moduleId: string, score: number) => void;
  /** Mark a standalone page (no quiz) as mastered — used by pages without ModuleContainer */
  markComplete: (moduleId: string) => void;
  checkAndUpdateStreak: () => void;
  toggleSidebar: () => void;
  /** User-acknowledged the sync error banner. Doesn't retry — just hides
   *  the warning until the next upsert failure. */
  clearSyncError: () => void;

  // Spaced repetition review
  addToReview: (item: Omit<ReviewItem, 'nextReviewDate' | 'interval' | 'easeFactor'>) => void;
  updateReview: (moduleId: string, question: string, correct: boolean) => void;
  getReviewDue: () => ReviewItem[];

  getModuleStatus: (moduleId: string) => 'not_started' | 'in_progress' | 'mastered';
  getNextModule: () => string | null;
  getPhaseProgress: (phase: number) => { mastered: number; total: number; percent: number };
  getOverallProgress: () => { mastered: number; total: number; percent: number };
  isActiveToday: () => boolean;

  /** Reset in-memory state — called from auth-store.signOut so user A's
   *  progress/streak/review queue don't bleed into user B's session.
   *  localStorage keys are cleared by auth-store.signOut itself. */
  reset: () => void;
}

// ── localStorage keys ─────────────────────────────────────────────────────────

/**
 * Module pages use `mod_0_1` IDs, MODULE_SEQUENCE uses `0-1`.
 * This normaliser checks both forms when looking up progress.
 */
function progressForModule(progress: Record<string, ModuleProgress>, seqId: string): ModuleProgress | undefined {
  // Direct match first (standalone pages write bare IDs like 'grahas')
  if (progress[seqId]) return progress[seqId];
  // Module pages write with mod_ prefix and underscores: '0-1' → 'mod_0_1'
  const modKey = `mod_${seqId.replace(/-/g, '_')}`;
  if (progress[modKey]) return progress[modKey];
  return undefined;
}

const PROGRESS_KEY = 'dekho-panchang-learn-progress';
const SIDEBAR_KEY = 'dekho-panchang-sidebar-state';
const STREAK_KEY = 'dekho-panchang-learn-streak';
const REVIEW_KEY = 'dekho-panchang-learn-review';

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
    // Storage quota exceeded  –  silently ignore
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
    // Storage quota exceeded  –  silently ignore
  }
}

function readReviewFromStorage(): ReviewItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(REVIEW_KEY);
    return raw ? (JSON.parse(raw) as ReviewItem[]) : [];
  } catch {
    return [];
  }
}

function writeReviewToStorage(queue: ReviewItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(REVIEW_KEY, JSON.stringify(queue));
  } catch {
    // Storage quota exceeded  –  silently ignore
  }
}

// Round 3 R3-TZ-7 / R3-SF-10 — streak math now runs in the user's
// panchang-location timezone, not browser-local. Previously a user
// travelling east→west across midnight would have their streak reset
// at the wrong moment, and DST transitions silently shifted weekly-
// freeze Monday by one day. We resolve tz from useLocationStore at
// call time; fallback is UTC (safer than browser-local which biases
// to whichever client first loads the store).
function getUserTimezone(): string {
  if (typeof window === 'undefined') return 'UTC';
  try {
    // Read panchang location directly from localStorage to avoid coupling
    // learning-progress-store to location-store at module-load time
    // (location-store doesn't import this file, but a future graph cycle
    // would surface here first). The storage key + shape are the
    // location-store's persistence contract.
    const stored = window.localStorage.getItem('panchang_location');
    if (stored) {
      const parsed = JSON.parse(stored) as { timezone?: string | null };
      if (parsed?.timezone) return parsed.timezone;
    }
  } catch {
    // Fall through to UTC.
  }
  return 'UTC';
}

function fmtYMDInTz(date: Date, timezone: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).formatToParts(date);
    const y = parts.find((p) => p.type === 'year')?.value ?? '0000';
    const m = parts.find((p) => p.type === 'month')?.value ?? '01';
    const d = parts.find((p) => p.type === 'day')?.value ?? '01';
    return `${y}-${m}-${d}`;
  } catch {
    // Invalid timezone — graceful UTC fallback.
    return date.toISOString().slice(0, 10);
  }
}

/** Date N days from now in YYYY-MM-DD, in the user's panchang timezone. */
function getFutureDateStr(days: number): string {
  const tz = getUserTimezone();
  const ms = Date.now() + days * 86_400_000;
  return fmtYMDInTz(new Date(ms), tz);
}

/** Today's date in YYYY-MM-DD, in the user's panchang timezone. */
function getTodayStr(): string {
  return fmtYMDInTz(new Date(), getUserTimezone());
}

/** Date N days ago in YYYY-MM-DD, in the user's panchang timezone. */
function getDaysAgoStr(n: number): string {
  const tz = getUserTimezone();
  const ms = Date.now() - n * 86_400_000;
  return fmtYMDInTz(new Date(ms), tz);
}

/** Is today Monday in the user's panchang timezone? */
function isTodayMonday(): boolean {
  const tz = getUserTimezone();
  try {
    const weekdayName = new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      weekday: 'short',
    }).format(new Date());
    return weekdayName === 'Mon';
  } catch {
    return new Date().getUTCDay() === 1;
  }
}

// ── Real-time Supabase upsert (fire-and-forget for logged-in users) ───────────

/**
 * Monotonically-increasing request id for `upsertToSupabase`. Used to
 * ensure that only the LATEST upsert's outcome determines `lastSyncError`
 * — fixes a race where two concurrent quiz-pass writes can finish
 * out-of-order and the older one's outcome overwrites the newer one's
 * (Gemini PR #473 MEDIUM). Module-scope counter is safe because zustand
 * stores are singletons per page; concurrent calls are serialised
 * through this synchronous increment.
 */
let upsertReqSeq = 0;

function upsertToSupabase(entry: ModuleProgress): void {
  // Fire-and-forget. Resolves the session id via getSession() to avoid
  // a circular import on auth-store (which imports THIS store to call
  // reset() on sign-out). Async wrapper so callers stay synchronous.
  const myReqId = ++upsertReqSeq;
  void (async () => {
    const userId = await getCurrentUserId();
    if (!userId) return;
    const supabase = getSupabase();
    if (!supabase) return;

    const { error } = await supabase
      .from('learning_progress')
      .upsert({
        user_id: userId,
        module_id: entry.moduleId,
        status: entry.status,
        quiz_score: entry.quizScore,
        quiz_passed_at: entry.quizPassedAt,
        last_page_read: entry.lastPageRead,
        last_accessed_at: entry.lastAccessedAt,
      }, { onConflict: 'user_id,module_id' });

    // Only the LATEST initiated upsert's outcome wins. If a newer request
    // already finished (or is in flight), don't let our older outcome
    // overwrite the current state. This prevents the "older failure
    // resolves after newer success" race that would re-show the banner
    // after the actual most-recent attempt succeeded.
    if (myReqId !== upsertReqSeq) {
      if (error) console.error('[LearningProgress] Stale upsert error (newer request in flight):', error.message);
      return;
    }

    if (error) {
      // Surface to the dashboard banner via lastSyncError — users see
      // "your progress isn't syncing" instead of silently losing the
      // write. console.error so Sentry / Vercel logs filter "error"
      // severity catches sustained failures.
      console.error('[LearningProgress] Upsert error:', error.message);
      useLearningProgressStore.setState({ lastSyncError: error.message });
    } else {
      // Clear any previous error on success — once one upsert succeeds we
      // assume connectivity is back. The banner hides automatically.
      const current = useLearningProgressStore.getState().lastSyncError;
      if (current !== null) {
        useLearningProgressStore.setState({ lastSyncError: null });
      }
    }
  })();
}

// ── Store ─────────────────────────────────────────────────────────────────────

export const useLearningProgressStore = create<LearningProgressStore>((set, get) => ({
  progress: {},
  streak: { ...DEFAULT_STREAK },
  reviewQueue: [],
  sidebarExpanded: true,
  hydrated: false,
  lastSyncError: null,

  clearSyncError: () => set({ lastSyncError: null }),

  // ── Hydration ───────────────────────────────────────────────────────────────

  hydrateFromStorage: () => {
    const progress = readProgressFromStorage();
    const sidebarExpanded = readSidebarFromStorage();
    let streak = readStreakFromStorage();
    const reviewQueue = readReviewFromStorage();

    // Reset freeze availability every Monday
    if (isTodayMonday() && !streak.streakFreezeAvailable) {
      // Only reset if the last freeze wasn't used today
      if (streak.lastFreezeUsed !== getTodayStr()) {
        streak = { ...streak, streakFreezeAvailable: true };
        writeStreakToStorage(streak);
      }
    }

    set({ progress, streak, reviewQueue, sidebarExpanded, hydrated: true });
  },

  // ── Supabase sync ────────────────────────────────────────────────────────────

  syncWithSupabase: async (userId: string) => {
    if (inFlightSync && inFlightSyncKey === userId) return inFlightSync;
    const supabase = getSupabase();
    if (!supabase) return;

    inFlightSyncKey = userId;
    inFlightSync = (async () => {
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
    } finally {
      // Guarded clear — only release the slot if it still belongs to
      // this userId; a sign-in switch mid-flight could have re-assigned
      // it to a different user.
      if (inFlightSyncKey === userId) {
        inFlightSync = null;
        inFlightSyncKey = null;
      }
    }
    })();
    return inFlightSync;
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
    // Capture whether this is the first transition to 'mastered' — used
    // below to fire the gamification event exactly once per module.
    // Re-passes of the quiz (better score on an already-mastered module)
    // don't move the mastered counter and shouldn't ping the award route.
    const isFirstMastery = existing?.status !== 'mastered';

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
    if (isFirstMastery) fireModuleCompleted(moduleId);
  },

  markComplete: (moduleId: string) => {
    const current = get().progress;
    if (current[moduleId]?.status === 'mastered') return;

    const updated: ModuleProgress = {
      moduleId,
      status: 'mastered',
      quizScore: null,
      quizPassedAt: new Date().toISOString(),
      lastPageRead: 0,
      lastAccessedAt: new Date().toISOString(),
    };

    const next = { ...current, [moduleId]: updated };
    set({ progress: next });
    writeProgressToStorage(next);
    upsertToSupabase(updated);
    get().checkAndUpdateStreak();
    // markComplete already early-returns above if the module is mastered,
    // so reaching here means this is a genuine first transition.
    fireModuleCompleted(moduleId);
  },

  checkAndUpdateStreak: () => {
    const current = get().streak;
    const today = getTodayStr();
    const yesterday = getDaysAgoStr(1);
    const twoDaysAgo = getDaysAgoStr(2);

    // Already active today  –  no change needed
    if (current.lastActiveDate === today) return;

    let newStreak: StreakData;

    if (current.lastActiveDate === yesterday) {
      // Consecutive day  –  increment streak
      const newDays = current.streakDays + 1;
      newStreak = {
        ...current,
        streakDays: newDays,
        lastActiveDate: today,
        longestStreak: Math.max(current.longestStreak, newDays),
      };
    } else if (current.lastActiveDate === twoDaysAgo && current.streakFreezeAvailable) {
      // Missed one day but freeze is available  –  use freeze, keep streak
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
      // Streak broken  –  reset to 1
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

  // ── Spaced Repetition Review ─────────────────────────────────────────────────

  addToReview: (item: Omit<ReviewItem, 'nextReviewDate' | 'interval' | 'easeFactor'>) => {
    const queue = get().reviewQueue;
    // Deduplicate by moduleId + question text (trimmed, lowercased)
    const key = `${item.moduleId}::${item.question.trim().toLowerCase()}`;
    const exists = queue.some(
      (r) => `${r.moduleId}::${r.question.trim().toLowerCase()}` === key,
    );
    if (exists) return;

    const newItem: ReviewItem = {
      ...item,
      nextReviewDate: getFutureDateStr(1), // review tomorrow
      interval: 1,
      easeFactor: 2.5,
    };
    const next = [...queue, newItem];
    set({ reviewQueue: next });
    writeReviewToStorage(next);
  },

  updateReview: (moduleId: string, question: string, correct: boolean) => {
    const queue = get().reviewQueue;
    const key = `${moduleId}::${question.trim().toLowerCase()}`;
    const next = queue.map((r) => {
      if (`${r.moduleId}::${r.question.trim().toLowerCase()}` !== key) return r;

      if (correct) {
        // SM-2: increase interval by ease factor
        const newInterval = Math.round(r.interval * r.easeFactor);
        return {
          ...r,
          interval: newInterval,
          nextReviewDate: getFutureDateStr(newInterval),
          // Ease factor stays the same or slightly increases on correct
          easeFactor: Math.min(3.0, r.easeFactor + 0.1),
        };
      } else {
        // Wrong: reset interval to 1 day, decrease ease factor
        return {
          ...r,
          interval: 1,
          nextReviewDate: getFutureDateStr(1),
          easeFactor: Math.max(1.3, r.easeFactor - 0.2),
        };
      }
    });
    set({ reviewQueue: next });
    writeReviewToStorage(next);
  },

  getReviewDue: () => {
    const today = getTodayStr();
    return get().reviewQueue.filter((r) => r.nextReviewDate <= today);
  },

  // ── Computed ─────────────────────────────────────────────────────────────────

  getModuleStatus: (moduleId: string) => {
    const entry = progressForModule(get().progress, moduleId);
    if (!entry) return 'not_started';
    return entry.status;
  },

  getNextModule: () => {
    const { progress } = get();
    // Only curriculum modules (not ref: articles) count for progression
    for (const mod of CURRICULUM_MODULES) {
      if (progressForModule(progress, mod.id)?.status !== 'mastered') {
        return mod.id;
      }
    }
    return null;
  },

  getPhaseProgress: (phase: number) => {
    const { progress } = get();
    // Only curriculum modules count toward phase progress
    const modules = getPhaseModules(phase).filter(m => !m.id.startsWith('ref:'));
    const total = modules.length;
    const mastered = modules.filter((m) => progressForModule(progress, m.id)?.status === 'mastered').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { mastered, total, percent };
  },

  getOverallProgress: () => {
    const { progress } = get();
    const total = CURRICULUM_MODULES.length;
    const mastered = CURRICULUM_MODULES.filter((m) => progressForModule(progress, m.id)?.status === 'mastered').length;
    const percent = total > 0 ? Math.round((mastered / total) * 100) : 0;
    return { mastered, total, percent };
  },

  isActiveToday: () => {
    return get().streak.lastActiveDate === getTodayStr();
  },

  reset: () => {
    set({
      progress: {},
      streak: { ...DEFAULT_STREAK },
      reviewQueue: [],
      hydrated: false,
      lastSyncError: null,
      // sidebarExpanded is a UI preference, not user data — leave it alone.
    });
  },
}));

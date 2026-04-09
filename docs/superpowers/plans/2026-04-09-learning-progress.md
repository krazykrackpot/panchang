# Learning Progress & Journey System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add persistent learning progress tracking with a collapsible sidebar, post-quiz advancement, and visual progress indicators across the learn section.

**Architecture:** Zustand store backed by localStorage (all users) + Supabase sync (logged-in users). Collapsible sidebar component injected via LearnLayoutShell. ModuleContainer enhanced with progress tracking and post-quiz "Next Module" flow. Module sequence derived from existing PHASES constant.

**Tech Stack:** Zustand, localStorage, Supabase (RLS), Framer Motion, Tailwind CSS, next-intl

---

### Task 1: Module Sequence Utility

**Files:**
- Create: `src/lib/learn/module-sequence.ts`

This extracts the canonical module order from PHASES and provides helper functions used by everything else.

- [ ] **Step 1: Create the module sequence file**

```typescript
// src/lib/learn/module-sequence.ts

/** Canonical module sequence — single source of truth derived from PHASES on the modules index page. */

export interface ModuleRef {
  id: string;       // e.g. "1-1"
  phase: number;
  topic: string;
  title: { en: string; hi: string };
}

// Flat sequence of all 50 modules in learning order
export const MODULE_SEQUENCE: ModuleRef[] = [
  // Phase 0: Pre-Foundation
  { id: '0-1', phase: 0, topic: 'Getting Started', title: { en: 'What is Jyotish?', hi: 'ज्योतिष क्या है?' } },
  { id: '0-2', phase: 0, topic: 'Getting Started', title: { en: 'The Hindu Calendar', hi: 'हिन्दू पंचांग' } },
  { id: '0-3', phase: 0, topic: 'Getting Started', title: { en: 'Your Cosmic Address', hi: 'आपका ब्रह्माण्डीय पता' } },
  { id: '0-4', phase: 0, topic: 'Getting Started', title: { en: "Reading Today's Panchang", hi: 'आज का पंचांग पढ़ना' } },
  { id: '0-5', phase: 0, topic: 'Getting Started', title: { en: 'What is a Kundali?', hi: 'कुण्डली क्या है?' } },
  // Phase 1: The Sky
  { id: '1-1', phase: 1, topic: 'Foundations', title: { en: 'The Night Sky & Ecliptic', hi: 'रात्रि आकाश एवं क्रान्तिवृत्त' } },
  { id: '1-2', phase: 1, topic: 'Foundations', title: { en: 'Measuring the Sky', hi: 'आकाश मापन' } },
  { id: '1-3', phase: 1, topic: 'Foundations', title: { en: 'The Zodiac Belt', hi: 'राशिचक्र पट्टी' } },
  { id: '2-1', phase: 1, topic: 'Grahas', title: { en: 'The Nine Grahas', hi: 'नवग्रह' } },
  { id: '2-2', phase: 1, topic: 'Grahas', title: { en: 'Planetary Relationships', hi: 'ग्रह संबंध' } },
  { id: '2-3', phase: 1, topic: 'Grahas', title: { en: 'Dignities', hi: 'ग्रह गरिमा' } },
  { id: '2-4', phase: 1, topic: 'Grahas', title: { en: 'Retrograde, Combustion & War', hi: 'वक्री, अस्त एवं ग्रह युद्ध' } },
  { id: '3-1', phase: 1, topic: 'Rashis', title: { en: 'The 12 Rashis', hi: '12 राशियाँ' } },
  { id: '3-2', phase: 1, topic: 'Rashis', title: { en: 'Sign Qualities', hi: 'राशि गुण' } },
  { id: '3-3', phase: 1, topic: 'Rashis', title: { en: 'Sign Lordship', hi: 'राशि स्वामित्व' } },
  { id: '4-1', phase: 1, topic: 'Ayanamsha', title: { en: 'Earth Wobble', hi: 'अयनगति भौतिकी' } },
  { id: '4-2', phase: 1, topic: 'Ayanamsha', title: { en: 'Two Zodiacs', hi: 'दो राशिचक्र' } },
  { id: '4-3', phase: 1, topic: 'Ayanamsha', title: { en: 'Ayanamsha Systems', hi: 'अयनांश पद्धतियाँ' } },
  // Phase 2: Pancha Anga
  { id: '5-1', phase: 2, topic: 'Tithi', title: { en: 'What Is a Tithi?', hi: 'तिथि क्या है?' } },
  { id: '5-2', phase: 2, topic: 'Tithi', title: { en: 'Shukla & Krishna Paksha', hi: 'शुक्ल एवं कृष्ण पक्ष' } },
  { id: '5-3', phase: 2, topic: 'Tithi', title: { en: 'Special Tithis & Vrat', hi: 'विशेष तिथियाँ' } },
  { id: '6-1', phase: 2, topic: 'Nakshatra', title: { en: 'The 27 Nakshatras', hi: '27 नक्षत्र' } },
  { id: '6-2', phase: 2, topic: 'Nakshatra', title: { en: 'Padas & Navamsha', hi: 'पाद एवं नवांश' } },
  { id: '6-3', phase: 2, topic: 'Nakshatra', title: { en: 'Nakshatra Dasha Lords', hi: 'दशा स्वामी' } },
  { id: '6-4', phase: 2, topic: 'Nakshatra', title: { en: 'Gana, Yoni, Nadi', hi: 'गण, योनि, नाडी' } },
  { id: '7-1', phase: 2, topic: 'Yoga, Karana & Vara', title: { en: 'Panchang Yoga', hi: 'पंचांग योग' } },
  { id: '7-2', phase: 2, topic: 'Yoga, Karana & Vara', title: { en: 'Karana', hi: 'करण' } },
  { id: '7-3', phase: 2, topic: 'Yoga, Karana & Vara', title: { en: 'Vara & Hora', hi: 'वार एवं होरा' } },
  { id: '8-1', phase: 2, topic: 'Muhurta', title: { en: '30 Muhurtas Per Day', hi: '30 मुहूर्त' } },
  // Phase 3: The Chart
  { id: '9-1', phase: 3, topic: 'Kundali', title: { en: 'What Is a Birth Chart?', hi: 'जन्म कुण्डली' } },
  { id: '9-2', phase: 3, topic: 'Kundali', title: { en: 'Computing the Lagna', hi: 'लग्न गणना' } },
  { id: '9-3', phase: 3, topic: 'Kundali', title: { en: 'Placing Planets', hi: 'ग्रह स्थापन' } },
  { id: '9-4', phase: 3, topic: 'Kundali', title: { en: 'Reading a Chart', hi: 'कुण्डली पठन' } },
  { id: '10-1', phase: 3, topic: 'Bhavas', title: { en: '12 Houses', hi: '12 भाव' } },
  { id: '10-2', phase: 3, topic: 'Bhavas', title: { en: 'Kendra, Trikona, Dusthana', hi: 'केंद्र, त्रिकोण, दुःस्थान' } },
  { id: '10-3', phase: 3, topic: 'Bhavas', title: { en: 'House Lords', hi: 'भावेश' } },
  { id: '11-1', phase: 3, topic: 'Vargas', title: { en: 'Why Divisional Charts?', hi: 'विभागीय चार्ट' } },
  { id: '11-2', phase: 3, topic: 'Vargas', title: { en: 'Navamsha (D9)', hi: 'नवांश' } },
  { id: '11-3', phase: 3, topic: 'Vargas', title: { en: 'Key Vargas D2-D60', hi: 'प्रमुख वर्ग' } },
  { id: '12-1', phase: 3, topic: 'Dashas', title: { en: 'Vimshottari', hi: 'विंशोत्तरी' } },
  { id: '12-2', phase: 3, topic: 'Dashas', title: { en: 'Reading Dasha Periods', hi: 'दशा पठन' } },
  { id: '12-3', phase: 3, topic: 'Dashas', title: { en: 'Timing Events', hi: 'घटना समय' } },
  { id: '13-1', phase: 3, topic: 'Transits', title: { en: 'How Transits Work', hi: 'गोचर' } },
  { id: '13-2', phase: 3, topic: 'Transits', title: { en: 'Sade Sati', hi: 'साढ़े साती' } },
  { id: '13-3', phase: 3, topic: 'Transits', title: { en: 'Ashtakavarga Transit Scoring', hi: 'अष्टकवर्ग गोचर' } },
  // Phase 4: Applied Jyotish
  { id: '14-1', phase: 4, topic: 'Compatibility', title: { en: 'Ashta Kuta', hi: 'अष्ट कूट' } },
  { id: '14-2', phase: 4, topic: 'Compatibility', title: { en: 'Key Kutas & Doshas', hi: 'प्रमुख कूट' } },
  { id: '14-3', phase: 4, topic: 'Compatibility', title: { en: 'Beyond Kuta', hi: 'कूट से परे' } },
  { id: '15-1', phase: 4, topic: 'Yogas & Doshas', title: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष' } },
  { id: '15-2', phase: 4, topic: 'Yogas & Doshas', title: { en: 'Raja & Dhana Yogas', hi: 'राज एवं धन योग' } },
  { id: '15-3', phase: 4, topic: 'Yogas & Doshas', title: { en: 'Common Doshas', hi: 'प्रमुख दोष' } },
  { id: '15-4', phase: 4, topic: 'Yogas & Doshas', title: { en: 'Remedial Measures', hi: 'उपाय' } },
  // Phase 5: Classical Knowledge
  { id: '16-1', phase: 5, topic: 'Classical Texts', title: { en: 'Astronomical Texts', hi: 'खगोलशास्त्रीय' } },
  { id: '16-2', phase: 5, topic: 'Classical Texts', title: { en: 'Hora Texts', hi: 'होरा ग्रंथ' } },
  { id: '16-3', phase: 5, topic: 'Classical Texts', title: { en: "India's Contributions", hi: 'भारत का योगदान' } },
];

export const TOTAL_MODULES = MODULE_SEQUENCE.length;

/** Phase boundaries — how many modules in each phase */
export const PHASE_INFO: { phase: number; label: { en: string; hi: string }; count: number }[] = [
  { phase: 0, label: { en: 'Pre-Foundation', hi: 'पूर्व-आधार' }, count: MODULE_SEQUENCE.filter(m => m.phase === 0).length },
  { phase: 1, label: { en: 'The Sky', hi: 'आकाश' }, count: MODULE_SEQUENCE.filter(m => m.phase === 1).length },
  { phase: 2, label: { en: 'Pancha Anga', hi: 'पंच अंग' }, count: MODULE_SEQUENCE.filter(m => m.phase === 2).length },
  { phase: 3, label: { en: 'The Chart', hi: 'कुण्डली' }, count: MODULE_SEQUENCE.filter(m => m.phase === 3).length },
  { phase: 4, label: { en: 'Applied Jyotish', hi: 'प्रयुक्त ज्योतिष' }, count: MODULE_SEQUENCE.filter(m => m.phase === 4).length },
  { phase: 5, label: { en: 'Classical Knowledge', hi: 'शास्त्रीय ज्ञान' }, count: MODULE_SEQUENCE.filter(m => m.phase === 5).length },
];

/** Get the module that comes after the given one in canonical order. Returns null if last. */
export function getNextModuleId(currentId: string): string | null {
  const idx = MODULE_SEQUENCE.findIndex(m => m.id === currentId);
  if (idx === -1 || idx === MODULE_SEQUENCE.length - 1) return null;
  return MODULE_SEQUENCE[idx + 1].id;
}

/** Get the module that comes before the given one. Returns null if first. */
export function getPrevModuleId(currentId: string): string | null {
  const idx = MODULE_SEQUENCE.findIndex(m => m.id === currentId);
  if (idx <= 0) return null;
  return MODULE_SEQUENCE[idx - 1].id;
}

/** Look up a module by ID */
export function getModuleRef(id: string): ModuleRef | undefined {
  return MODULE_SEQUENCE.find(m => m.id === id);
}

/** Get all modules for a given phase */
export function getPhaseModules(phase: number): ModuleRef[] {
  return MODULE_SEQUENCE.filter(m => m.phase === phase);
}

/** Check if a module is the last in its phase */
export function isLastInPhase(id: string): boolean {
  const mod = getModuleRef(id);
  if (!mod) return false;
  const phaseModules = getPhaseModules(mod.phase);
  return phaseModules[phaseModules.length - 1].id === id;
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep module-sequence`
Expected: No output (no errors in this file)

- [ ] **Step 3: Commit**

```bash
git add src/lib/learn/module-sequence.ts
git commit -m "feat(learn): add module sequence utility with canonical order and helpers"
```

---

### Task 2: Learning Progress Zustand Store

**Files:**
- Create: `src/stores/learning-progress-store.ts`

- [ ] **Step 1: Create the store**

```typescript
// src/stores/learning-progress-store.ts
'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import { MODULE_SEQUENCE, TOTAL_MODULES, getPhaseModules, PHASE_INFO } from '@/lib/learn/module-sequence';

export interface ModuleProgress {
  moduleId: string;
  status: 'in_progress' | 'mastered';
  quizScore: number | null;
  quizPassedAt: string | null;
  lastPageRead: number;
  lastAccessedAt: string;
}

const STORAGE_KEY = 'dekho-panchang-learn-progress';
const SIDEBAR_KEY = 'dekho-panchang-sidebar-state';

function loadFromLocalStorage(): Record<string, ModuleProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveToLocalStorage(progress: Record<string, ModuleProgress>) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); } catch {}
}

function loadSidebarState(): boolean {
  if (typeof window === 'undefined') return true;
  try { return localStorage.getItem(SIDEBAR_KEY) !== 'collapsed'; } catch { return true; }
}

/** Merge two progress records — highest state wins */
function mergeProgress(a: ModuleProgress | undefined, b: ModuleProgress | undefined): ModuleProgress | undefined {
  if (!a) return b;
  if (!b) return a;
  const statusRank = { in_progress: 1, mastered: 2 };
  const winner = statusRank[a.status] >= statusRank[b.status] ? a : b;
  return {
    ...winner,
    quizScore: Math.max(a.quizScore ?? 0, b.quizScore ?? 0) || null,
    lastPageRead: Math.max(a.lastPageRead, b.lastPageRead),
    lastAccessedAt: a.lastAccessedAt > b.lastAccessedAt ? a.lastAccessedAt : b.lastAccessedAt,
    quizPassedAt: a.quizPassedAt && b.quizPassedAt
      ? (a.quizPassedAt > b.quizPassedAt ? a.quizPassedAt : b.quizPassedAt)
      : a.quizPassedAt || b.quizPassedAt,
  };
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

export const useLearningProgressStore = create<LearningProgressStore>((set, get) => ({
  progress: {},
  sidebarExpanded: true,
  hydrated: false,

  hydrateFromStorage: () => {
    const progress = loadFromLocalStorage();
    const sidebarExpanded = loadSidebarState();
    set({ progress, sidebarExpanded, hydrated: true });
  },

  syncWithSupabase: async (userId: string) => {
    const supabase = getSupabase();
    if (!supabase) return;

    // Fetch DB rows
    const { data: rows } = await supabase
      .from('learning_progress')
      .select('*')
      .eq('user_id', userId);

    const dbProgress: Record<string, ModuleProgress> = {};
    if (rows) {
      for (const row of rows) {
        dbProgress[row.module_id] = {
          moduleId: row.module_id,
          status: row.status,
          quizScore: row.quiz_score,
          quizPassedAt: row.quiz_passed_at,
          lastPageRead: row.last_page_read,
          lastAccessedAt: row.last_accessed_at,
        };
      }
    }

    // Merge: highest state wins
    const local = get().progress;
    const allKeys = new Set([...Object.keys(local), ...Object.keys(dbProgress)]);
    const merged: Record<string, ModuleProgress> = {};
    for (const key of allKeys) {
      const m = mergeProgress(local[key], dbProgress[key]);
      if (m) merged[key] = m;
    }

    // Write merged back to both
    set({ progress: merged });
    saveToLocalStorage(merged);

    // Upsert to Supabase
    const upserts = Object.values(merged).map(p => ({
      user_id: userId,
      module_id: p.moduleId,
      status: p.status,
      quiz_score: p.quizScore,
      quiz_passed_at: p.quizPassedAt,
      last_page_read: p.lastPageRead,
      last_accessed_at: p.lastAccessedAt,
    }));
    if (upserts.length > 0) {
      await supabase.from('learning_progress').upsert(upserts, { onConflict: 'user_id,module_id' });
    }
  },

  markPageRead: (moduleId: string, pageIndex: number) => {
    const current = get().progress[moduleId];
    if (current?.status === 'mastered') {
      // Already mastered — just update lastAccessedAt
      const updated = { ...current, lastAccessedAt: new Date().toISOString(), lastPageRead: Math.max(current.lastPageRead, pageIndex) };
      const progress = { ...get().progress, [moduleId]: updated };
      set({ progress });
      saveToLocalStorage(progress);
      return;
    }

    const entry: ModuleProgress = {
      moduleId,
      status: 'in_progress',
      quizScore: current?.quizScore ?? null,
      quizPassedAt: current?.quizPassedAt ?? null,
      lastPageRead: Math.max(current?.lastPageRead ?? 0, pageIndex),
      lastAccessedAt: new Date().toISOString(),
    };
    const progress = { ...get().progress, [moduleId]: entry };
    set({ progress });
    saveToLocalStorage(progress);
  },

  markQuizPassed: (moduleId: string, score: number) => {
    const current = get().progress[moduleId];
    const entry: ModuleProgress = {
      moduleId,
      status: 'mastered',
      quizScore: Math.max(score, current?.quizScore ?? 0),
      quizPassedAt: new Date().toISOString(),
      lastPageRead: current?.lastPageRead ?? 0,
      lastAccessedAt: new Date().toISOString(),
    };
    const progress = { ...get().progress, [moduleId]: entry };
    set({ progress });
    saveToLocalStorage(progress);
  },

  toggleSidebar: () => {
    const next = !get().sidebarExpanded;
    set({ sidebarExpanded: next });
    if (typeof window !== 'undefined') {
      localStorage.setItem(SIDEBAR_KEY, next ? 'expanded' : 'collapsed');
    }
  },

  getModuleStatus: (moduleId: string) => {
    return get().progress[moduleId]?.status ?? 'not_started';
  },

  getNextModule: () => {
    const progress = get().progress;
    for (const mod of MODULE_SEQUENCE) {
      if (progress[mod.id]?.status !== 'mastered') return mod.id;
    }
    return null; // all mastered
  },

  getPhaseProgress: (phase: number) => {
    const modules = getPhaseModules(phase);
    const total = modules.length;
    const mastered = modules.filter(m => get().progress[m.id]?.status === 'mastered').length;
    return { mastered, total, percent: total > 0 ? Math.round((mastered / total) * 100) : 0 };
  },

  getOverallProgress: () => {
    const mastered = Object.values(get().progress).filter(p => p.status === 'mastered').length;
    return { mastered, total: TOTAL_MODULES, percent: Math.round((mastered / TOTAL_MODULES) * 100) };
  },
}));
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep learning-progress`
Expected: No output (no errors)

- [ ] **Step 3: Commit**

```bash
git add src/stores/learning-progress-store.ts
git commit -m "feat(learn): add learning progress Zustand store with localStorage + Supabase sync"
```

---

### Task 3: Supabase Migration

**Files:**
- Create: `supabase/migrations/007_learning_progress.sql`

- [ ] **Step 1: Create migration file**

```sql
-- 007_learning_progress.sql
-- Learning progress tracking per user per module

CREATE TABLE IF NOT EXISTS learning_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'mastered')),
  quiz_score INT,
  quiz_passed_at TIMESTAMPTZ,
  last_page_read INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

-- RLS: users read/write own data only
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own learning progress"
  ON learning_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Index for fast user lookups
CREATE INDEX IF NOT EXISTS idx_learning_progress_user
  ON learning_progress(user_id);
```

- [ ] **Step 2: Apply migration to live DB**

Run: `npx supabase db query --linked "$(cat supabase/migrations/007_learning_progress.sql)"`
Expected: Success, no errors

- [ ] **Step 3: Verify table exists**

Run: `npx supabase db query --linked "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'learning_progress' ORDER BY ordinal_position;"`
Expected: 7 rows (user_id, module_id, status, quiz_score, quiz_passed_at, last_page_read, last_accessed_at)

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/007_learning_progress.sql
git commit -m "feat(db): add learning_progress table with RLS"
```

---

### Task 4: Progress Indicator Component

**Files:**
- Create: `src/components/learn/ProgressIndicator.tsx`

Small reusable dot/ring/check component used in sidebar and module index.

- [ ] **Step 1: Create the component**

```typescript
// src/components/learn/ProgressIndicator.tsx
'use client';

import { CheckCircle } from 'lucide-react';

interface ProgressIndicatorProps {
  status: 'not_started' | 'in_progress' | 'mastered';
  size?: number; // px, default 16
}

export default function ProgressIndicator({ status, size = 16 }: ProgressIndicatorProps) {
  if (status === 'mastered') {
    return (
      <div
        className="rounded-full bg-emerald-500 flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <CheckCircle className="text-[#0a0e27]" style={{ width: size * 0.65, height: size * 0.65 }} />
      </div>
    );
  }

  if (status === 'in_progress') {
    return (
      <div
        className="rounded-full border-2 border-gold-primary shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }

  // not_started
  return (
    <div
      className="rounded-full border border-white/15 shrink-0"
      style={{ width: size, height: size }}
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/learn/ProgressIndicator.tsx
git commit -m "feat(learn): add ProgressIndicator dot/ring/check component"
```

---

### Task 5: Collapsible Sidebar Component

**Files:**
- Create: `src/components/learn/LearnSidebar.tsx`

- [ ] **Step 1: Create the sidebar component**

```typescript
// src/components/learn/LearnSidebar.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { useAuthStore } from '@/stores/auth-store';
import { MODULE_SEQUENCE, PHASE_INFO, getPhaseModules, getModuleRef } from '@/lib/learn/module-sequence';
import ProgressIndicator from './ProgressIndicator';
import type { Locale } from '@/types/panchang';

export default function LearnSidebar() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const {
    sidebarExpanded, toggleSidebar, hydrated, hydrateFromStorage, syncWithSupabase,
    getOverallProgress, getPhaseProgress, getNextModule, getModuleStatus, progress,
  } = useLearningProgressStore();

  const { user } = useAuthStore();
  const [expandedPhase, setExpandedPhase] = useState<number | null>(null);

  // Hydrate on mount
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  // Sync with Supabase when user logs in
  useEffect(() => {
    if (user?.id && hydrated) { syncWithSupabase(user.id); }
  }, [user?.id, hydrated, syncWithSupabase]);

  // Auto-expand the phase of the next module
  useEffect(() => {
    if (!hydrated) return;
    const nextId = getNextModule();
    if (nextId) {
      const mod = getModuleRef(nextId);
      if (mod) setExpandedPhase(mod.phase);
    }
  }, [hydrated, getNextModule]);

  if (!hydrated) return null;

  const overall = getOverallProgress();
  const nextModuleId = getNextModule();
  const nextModule = nextModuleId ? getModuleRef(nextModuleId) : null;
  const nextModuleProgress = nextModuleId ? progress[nextModuleId] : undefined;

  // ─── Collapsed Rail (64px) ───
  if (!sidebarExpanded) {
    return (
      <div className="w-16 shrink-0 bg-bg-secondary/80 border-r border-gold-primary/10 flex flex-col items-center py-4 gap-2">
        {/* Overall % */}
        <div className="w-9 h-9 rounded-full border-2 border-gold-primary flex items-center justify-center text-[10px] text-gold-light font-bold mb-2">
          {overall.percent}%
        </div>

        {/* Phase dots */}
        {PHASE_INFO.map(pi => {
          const pp = getPhaseProgress(pi.phase);
          const isComplete = pp.mastered === pp.total && pp.total > 0;
          const isActive = pp.mastered > 0 && !isComplete;
          return (
            <div key={pi.phase} className="text-center w-full px-1">
              <div className={`w-2.5 h-2.5 rounded-full mx-auto mb-0.5 ${
                isComplete ? 'bg-emerald-500' :
                isActive ? 'border-2 border-gold-primary' :
                'border border-white/15'
              }`} />
              <div className="text-[8px] text-text-secondary/50 leading-none">P{pi.phase}</div>
              <div className="text-[7px] text-text-secondary/30 leading-none">{pp.mastered}/{pp.total}</div>
            </div>
          );
        })}

        <div className="flex-1" />

        {/* Expand button */}
        <button onClick={toggleSidebar} className="p-1.5 rounded-lg hover:bg-gold-primary/10 transition-colors" aria-label="Expand sidebar">
          <ChevronRight className="w-4 h-4 text-text-secondary/50" />
        </button>
      </div>
    );
  }

  // ─── Expanded Sidebar (~260px) ───
  return (
    <div className="w-[260px] shrink-0 bg-bg-secondary/80 border-r border-gold-primary/10 flex flex-col overflow-y-auto">
      {/* Header with collapse button */}
      <div className="flex items-center justify-between p-4 pb-2">
        <span className="text-gold-dark text-[10px] uppercase tracking-widest font-bold">{isHi ? 'आपकी यात्रा' : 'Your Journey'}</span>
        <button onClick={toggleSidebar} className="p-1 rounded-lg hover:bg-gold-primary/10 transition-colors" aria-label="Collapse sidebar">
          <ChevronLeft className="w-4 h-4 text-text-secondary/50" />
        </button>
      </div>

      {/* Overall % */}
      <div className="text-center px-4 pb-3 border-b border-gold-primary/10">
        <div className="text-3xl font-bold text-gold-light">{overall.percent}%</div>
        <div className="text-[10px] text-text-secondary/50">
          {overall.mastered}/{overall.total} {isHi ? 'मॉड्यूल पूर्ण' : 'modules mastered'}
        </div>
      </div>

      {/* Continue card */}
      {nextModule && (
        <Link href={`/learn/modules/${nextModule.id}`} className="block m-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20 hover:bg-emerald-500/15 transition-colors">
          <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-bold">{isHi ? 'जारी रखें' : 'Continue'}</div>
          <div className="text-sm text-emerald-300 font-semibold mt-0.5" style={bf}>
            {nextModule.id.replace('-', '.')} {isHi ? nextModule.title.hi : nextModule.title.en}
          </div>
          {nextModuleProgress && nextModuleProgress.status === 'in_progress' && (
            <div className="mt-2 h-1 bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '50%' }} />
            </div>
          )}
        </Link>
      )}

      {/* 100% completion */}
      {overall.percent === 100 && (
        <div className="m-3 p-3 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-center">
          <div className="text-lg font-bold text-gold-light" style={hf}>{isHi ? 'पाठ्यक्रम पूर्ण!' : 'Curriculum Complete!'}</div>
          <div className="text-xs text-text-secondary/60 mt-1">{isHi ? 'सभी 50 मॉड्यूल पूर्ण' : 'All 50 modules mastered'}</div>
        </div>
      )}

      {/* Phase list */}
      <div className="px-3 pt-2 pb-1">
        <div className="text-[10px] text-gold-dark/50 uppercase tracking-widest font-bold">{isHi ? 'चरण' : 'Phases'}</div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5">
        {PHASE_INFO.map(pi => {
          const pp = getPhaseProgress(pi.phase);
          const isComplete = pp.mastered === pp.total && pp.total > 0;
          const isExpanded = expandedPhase === pi.phase;
          const phaseModules = getPhaseModules(pi.phase);

          return (
            <div key={pi.phase}>
              <button
                onClick={() => setExpandedPhase(isExpanded ? null : pi.phase)}
                className="w-full rounded-lg p-2 text-left hover:bg-gold-primary/5 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-semibold ${isComplete ? 'text-emerald-400' : pp.mastered > 0 ? 'text-gold-light' : 'text-text-secondary/50'}`} style={bf}>
                    {pi.phase}. {isHi ? pi.label.hi : pi.label.en}
                  </span>
                  <span className={`text-[10px] ${isComplete ? 'text-emerald-400' : 'text-text-secondary/40'}`}>
                    {pp.mastered}/{pp.total}
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-gold-primary to-gold-light'}`}
                    style={{ width: `${pp.percent}%` }}
                  />
                </div>
              </button>

              {/* Expanded module list */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pl-2 py-1 space-y-0.5">
                      {phaseModules.map(mod => {
                        const st = getModuleStatus(mod.id);
                        const isCurrent = mod.id === nextModuleId;
                        return (
                          <Link
                            key={mod.id}
                            href={`/learn/modules/${mod.id}`}
                            className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
                              isCurrent ? 'bg-gold-primary/8' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <ProgressIndicator status={st} size={14} />
                            <span className={`${isCurrent ? 'text-gold-light font-semibold' : st === 'mastered' ? 'text-text-secondary/70' : 'text-text-secondary/40'}`} style={bf}>
                              {mod.id.replace('-', '.')} {isHi ? mod.title.hi : mod.title.en}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Sign-in nudge (logged out only) */}
      {!user && Object.keys(progress).length > 0 && (
        <div className="px-4 py-3 border-t border-gold-primary/10 text-center">
          <p className="text-text-secondary/40 text-[10px]">
            {isHi ? 'प्रगति सभी उपकरणों में सहेजने के लिए साइन इन करें' : 'Sign in to save progress across devices'}
          </p>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep LearnSidebar`
Expected: No output

- [ ] **Step 3: Commit**

```bash
git add src/components/learn/LearnSidebar.tsx
git commit -m "feat(learn): add collapsible sidebar with phase progress and module list"
```

---

### Task 6: Mobile Sidebar (Floating Pill + Bottom Sheet)

**Files:**
- Create: `src/components/learn/LearnSidebarMobile.tsx`

- [ ] **Step 1: Create the mobile component**

```typescript
// src/components/learn/LearnSidebarMobile.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { useAuthStore } from '@/stores/auth-store';
import { PHASE_INFO, getPhaseModules, getModuleRef } from '@/lib/learn/module-sequence';
import ProgressIndicator from './ProgressIndicator';
import type { Locale } from '@/types/panchang';

export default function LearnSidebarMobile() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const bf = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const { hydrated, hydrateFromStorage, syncWithSupabase, getOverallProgress, getPhaseProgress, getNextModule, getModuleStatus, progress } = useLearningProgressStore();
  const { user } = useAuthStore();
  const [open, setOpen] = useState(false);

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);
  useEffect(() => { if (user?.id && hydrated) syncWithSupabase(user.id); }, [user?.id, hydrated, syncWithSupabase]);

  if (!hydrated) return null;

  const overall = getOverallProgress();
  const nextModuleId = getNextModule();
  const nextModule = nextModuleId ? getModuleRef(nextModuleId) : null;

  // Current phase for pill label
  const currentPhase = nextModule?.phase ?? 0;

  return (
    <>
      {/* Floating pill — bottom-left */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 lg:hidden flex items-center gap-2 px-3 py-2 rounded-full bg-bg-secondary/95 border border-gold-primary/20 shadow-lg shadow-black/30 backdrop-blur-sm"
      >
        <span className="text-xs font-bold text-gold-light">{overall.percent}%</span>
        <span className="text-[10px] text-text-secondary/60">P{currentPhase}</span>
      </button>

      {/* Bottom sheet overlay */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 lg:hidden"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 lg:hidden max-h-[80vh] overflow-y-auto rounded-t-2xl bg-bg-secondary border-t border-gold-primary/15"
            >
              {/* Handle + close */}
              <div className="flex items-center justify-between p-4 border-b border-gold-primary/10 sticky top-0 bg-bg-secondary z-10">
                <div>
                  <div className="text-2xl font-bold text-gold-light">{overall.percent}%</div>
                  <div className="text-[10px] text-text-secondary/50">
                    {overall.mastered}/{overall.total} {isHi ? 'मॉड्यूल पूर्ण' : 'modules mastered'}
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-gold-primary/10">
                  <X className="w-5 h-5 text-text-secondary/50" />
                </button>
              </div>

              {/* Continue card */}
              {nextModule && (
                <Link href={`/learn/modules/${nextModule.id}`} onClick={() => setOpen(false)}
                  className="block m-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
                  <div className="text-[10px] text-emerald-400/70 uppercase tracking-wider font-bold">{isHi ? 'जारी रखें' : 'Continue'}</div>
                  <div className="text-sm text-emerald-300 font-semibold mt-0.5" style={bf}>
                    {nextModule.id.replace('-', '.')} {isHi ? nextModule.title.hi : nextModule.title.en}
                  </div>
                </Link>
              )}

              {/* Phase list */}
              <div className="px-4 pb-6 space-y-3">
                {PHASE_INFO.map(pi => {
                  const pp = getPhaseProgress(pi.phase);
                  const phaseModules = getPhaseModules(pi.phase);
                  const isComplete = pp.mastered === pp.total && pp.total > 0;
                  return (
                    <div key={pi.phase}>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-xs font-semibold ${isComplete ? 'text-emerald-400' : pp.mastered > 0 ? 'text-gold-light' : 'text-text-secondary/50'}`} style={bf}>
                          {pi.phase}. {isHi ? pi.label.hi : pi.label.en}
                        </span>
                        <span className="text-[10px] text-text-secondary/40">{pp.mastered}/{pp.total}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${isComplete ? 'bg-emerald-500' : 'bg-gradient-to-r from-gold-primary to-gold-light'}`}
                          style={{ width: `${pp.percent}%` }} />
                      </div>
                      <div className="space-y-0.5 pl-1">
                        {phaseModules.map(mod => (
                          <Link key={mod.id} href={`/learn/modules/${mod.id}`} onClick={() => setOpen(false)}
                            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs hover:bg-white/[0.03]">
                            <ProgressIndicator status={getModuleStatus(mod.id)} size={12} />
                            <span className="text-text-secondary/60" style={bf}>{mod.id.replace('-', '.')} {isHi ? mod.title.hi : mod.title.en}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/learn/LearnSidebarMobile.tsx
git commit -m "feat(learn): add mobile bottom sheet with floating pill trigger"
```

---

### Task 7: Integrate Sidebar into Learn Layout

**Files:**
- Modify: `src/components/learn/LearnLayoutShell.tsx`

- [ ] **Step 1: Update LearnLayoutShell to include sidebar**

Replace the entire content of `src/components/learn/LearnLayoutShell.tsx` with:

```typescript
// src/components/learn/LearnLayoutShell.tsx
'use client';

import LearnSidebar from './LearnSidebar';
import LearnSidebarMobile from './LearnSidebarMobile';

export default function LearnLayoutShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden lg:block sticky top-20 h-[calc(100vh-80px)] overflow-hidden">
        <LearnSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </div>

      {/* Mobile bottom sheet */}
      <LearnSidebarMobile />
    </div>
  );
}
```

- [ ] **Step 2: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep LearnLayoutShell`
Expected: No output

- [ ] **Step 3: Commit**

```bash
git add src/components/learn/LearnLayoutShell.tsx
git commit -m "feat(learn): integrate sidebar into LearnLayoutShell with desktop/mobile split"
```

---

### Task 8: Enhance ModuleContainer with Progress Tracking + Post-Quiz Flow

**Files:**
- Modify: `src/components/learn/ModuleContainer.tsx`

This is the most critical task — wires up page-read tracking and replaces the post-quiz results screen.

- [ ] **Step 1: Add imports at the top of ModuleContainer.tsx**

After the existing imports (line 6), add:

```typescript
import { Link } from '@/lib/i18n/navigation';
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import { getNextModuleId, getModuleRef, isLastInPhase } from '@/lib/learn/module-sequence';
```

- [ ] **Step 2: Add progress tracking hooks inside the component**

Inside the `ModuleContainer` function, after `const passThreshold = ...` (line 121), add:

```typescript
  const { markPageRead, markQuizPassed, getPhaseProgress, hydrateFromStorage, hydrated } = useLearningProgressStore();

  // Hydrate store on mount
  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  // Track page reads
  useEffect(() => {
    if (hydrated) {
      markPageRead(meta.id, currentPage);
    }
  }, [currentPage, meta.id, hydrated, markPageRead]);

  // Track quiz pass
  useEffect(() => {
    if (quizComplete && passed && hydrated) {
      markQuizPassed(meta.id, score);
    }
  }, [quizComplete, passed, score, meta.id, hydrated, markQuizPassed]);

  // Next module info for post-quiz flow
  const nextId = getNextModuleId(meta.id);
  const nextRef = nextId ? getModuleRef(nextId) : null;
  const phaseProgress = hydrated ? getPhaseProgress(meta.phase) : null;
  const lastInPhase = isLastInPhase(meta.id);
```

- [ ] **Step 3: Replace the results screen**

Replace lines 269-298 (the existing results `motion.div`) with the new post-quiz completion flow:

```typescript
          <motion.div key="results"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border rounded-2xl p-8 text-center ${passed ? 'border-emerald-500/30' : 'border-red-500/30'}`}>
              {passed ? (
                <>
                  {/* Mastered celebration */}
                  <div className="text-5xl mb-3">🎉</div>
                  <h3 className="text-2xl font-bold text-emerald-400 mb-1" style={hf}>
                    {isHi ? 'उत्तीर्ण!' : 'Mastered!'}
                  </h3>
                  <p className="text-text-secondary text-lg font-mono mb-4">{score}/{quizQuestions.length}</p>

                  {/* Phase progress */}
                  {phaseProgress && (
                    <div className="max-w-xs mx-auto mb-6">
                      {lastInPhase && phaseProgress.mastered === phaseProgress.total ? (
                        <div className="text-sm text-gold-light font-semibold mb-2" style={hf}>
                          {isHi ? `चरण ${meta.phase} पूर्ण!` : `Phase ${meta.phase} Complete!`}
                        </div>
                      ) : null}
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
                        <motion.div
                          initial={{ width: `${Math.max(0, ((phaseProgress.mastered - 1) / phaseProgress.total) * 100)}%` }}
                          animate={{ width: `${phaseProgress.percent}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                        />
                      </div>
                      <p className="text-text-secondary/60 text-xs">
                        {isHi
                          ? `चरण ${meta.phase} — ${phaseProgress.mastered}/${phaseProgress.total} पूर्ण`
                          : `Phase ${meta.phase} — ${phaseProgress.mastered}/${phaseProgress.total} mastered`}
                      </p>
                    </div>
                  )}

                  {/* Next Module CTA */}
                  <div className="flex flex-col items-center gap-3">
                    {nextRef ? (
                      <Link href={`/learn/modules/${nextRef.id}`}
                        className="inline-flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-500/15 border-2 border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/25 transition-colors"
                        style={hf}>
                        {isHi ? 'अगला:' : 'Next:'} {nextRef.id.replace('-', '.')} {isHi ? nextRef.title.hi : nextRef.title.en} →
                      </Link>
                    ) : (
                      <div className="px-8 py-3 rounded-xl bg-gold-primary/15 border-2 border-gold-primary/30 text-gold-light font-bold text-sm" style={hf}>
                        {isHi ? 'सम्पूर्ण पाठ्यक्रम पूर्ण!' : 'Entire Curriculum Complete!'}
                      </div>
                    )}
                    <div className="flex gap-3">
                      <button onClick={() => { setShowQuiz(false); setCurrentPage(0); }}
                        className="px-4 py-2 rounded-xl border border-gold-primary/15 text-text-secondary text-xs hover:text-text-primary transition-colors">
                        {isHi ? 'सामग्री समीक्षा' : 'Review Content'}
                      </button>
                      <Link href="/learn/modules"
                        className="px-4 py-2 rounded-xl border border-gold-primary/15 text-text-secondary text-xs hover:text-text-primary transition-colors">
                        {isHi ? 'सभी मॉड्यूल' : 'All Modules'}
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Failed — keep current flow */}
                  <div className="text-5xl mb-4">📚</div>
                  <h3 className="text-2xl font-bold text-red-400 mb-2" style={hf}>
                    {isHi ? 'पुनः प्रयास करें' : 'Try Again'}
                  </h3>
                  <p className="text-text-secondary text-lg font-mono mb-2">{score}/{quizQuestions.length}</p>
                  <p className="text-text-secondary text-sm mb-6">
                    {isHi
                      ? `उत्तीर्ण के लिए ${passThreshold}/${quizQuestions.length} आवश्यक। सामग्री की समीक्षा करें और पुनः प्रयास करें।`
                      : `Need ${passThreshold}/${quizQuestions.length} to pass. Review the content and try again.`}
                  </p>
                  <div className="flex justify-center gap-3">
                    <button onClick={handleRetry}
                      className="px-6 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/25 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors">
                      {isHi ? 'पुनः प्रयास' : 'Retry Quiz'}
                    </button>
                    <button onClick={() => { setShowQuiz(false); setCurrentPage(0); }}
                      className="px-6 py-2.5 rounded-xl border border-gold-primary/15 text-text-secondary text-sm hover:text-text-primary transition-colors">
                      {isHi ? 'सामग्री पर वापस' : 'Back to Content'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
```

- [ ] **Step 4: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep ModuleContainer`
Expected: No output

- [ ] **Step 5: Commit**

```bash
git add src/components/learn/ModuleContainer.tsx
git commit -m "feat(learn): add progress tracking + post-quiz Next Module flow"
```

---

### Task 9: Enhance Module Index with Progress Indicators

**Files:**
- Modify: `src/app/[locale]/learn/modules/page.tsx`

- [ ] **Step 1: Add imports**

Add after the existing imports (after line 7):

```typescript
import { useLearningProgressStore } from '@/stores/learning-progress-store';
import ProgressIndicator from '@/components/learn/ProgressIndicator';
import { Link } from '@/lib/i18n/navigation';
```

Remove the existing `import { Link } from '@/lib/i18n/navigation';` if it's already there (line 5) to avoid duplication.

- [ ] **Step 2: Add progress hooks inside ModuleIndexPage component**

Inside `ModuleIndexPage` function, after the existing `const` declarations (after line 119), add:

```typescript
  const { hydrated, hydrateFromStorage, getModuleStatus, getPhaseProgress, getOverallProgress, getNextModule } = useLearningProgressStore();

  useEffect(() => { hydrateFromStorage(); }, [hydrateFromStorage]);

  const overall = hydrated ? getOverallProgress() : null;
  const nextModuleId = hydrated ? getNextModule() : null;
```

- [ ] **Step 3: Add overall progress summary before the "Start Learning" card**

After the opening `<div>` with title/description (after line 132), insert:

```typescript
      {/* Overall progress */}
      {hydrated && overall && overall.mastered > 0 && (
        <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gold-light font-bold text-lg" style={hf}>
              {isHi ? 'आपकी प्रगति' : 'Your Progress'}
            </span>
            <span className="text-gold-primary text-sm font-mono">{overall.mastered}/{overall.total}</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full" style={{ width: `${overall.percent}%` }} />
          </div>
          <p className="text-text-secondary/60 text-xs">
            {isHi ? `${overall.percent}% पूर्ण` : `${overall.percent}% complete`}
          </p>
        </div>
      )}
```

- [ ] **Step 4: Add progress indicators to each module row**

In the module row (around line 161-172), update the `Link` content to include the indicator. Replace the existing module row rendering:

Find the `<div className="flex items-center gap-3">` inside the module map and update it to:

```typescript
                        <div className="flex items-center gap-3">
                          {hydrated && <ProgressIndicator status={getModuleStatus(mod.id)} size={14} />}
                          <span className="text-text-tertiary text-xs font-mono w-8">{mod.id.replace('-', '.')}</span>
                          <span className={`text-sm group-hover:text-gold-light transition-colors ${
                            hydrated && getModuleStatus(mod.id) === 'mastered' ? 'text-text-secondary/60' : 'text-text-primary'
                          }`} style={isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                            {isHi ? mod.title.hi : mod.title.en}
                          </span>
                          {mod.id === nextModuleId && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/20 font-bold">
                              {isHi ? 'अगला' : 'NEXT'}
                            </span>
                          )}
                        </div>
```

- [ ] **Step 5: Add phase progress bars to phase headers**

In the phase header section (around line 148-151), after the phase label `<h3>`, add:

```typescript
            {hydrated && (() => {
              const pp = getPhaseProgress(phase.phase);
              return pp.mastered > 0 ? (
                <div className="flex items-center gap-2 ml-auto">
                  <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pp.mastered === pp.total ? 'bg-emerald-500' : 'bg-gold-primary'}`}
                      style={{ width: `${pp.percent}%` }} />
                  </div>
                  <span className="text-[10px] text-text-secondary/40">{pp.mastered}/{pp.total}</span>
                </div>
              ) : null;
            })()}
```

- [ ] **Step 6: Verify no TypeScript errors**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | grep modules/page`
Expected: No output

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/learn/modules/page.tsx
git commit -m "feat(learn): add progress indicators and phase bars to module index"
```

---

### Task 10: Build Verification & Manual Testing

**Files:** None (verification only)

- [ ] **Step 1: Run TypeScript check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: Only the pre-existing `learn/birth-chart/page.tsx` error (not from our changes)

- [ ] **Step 2: Run production build**

Run: `npx next build`
Expected: Build succeeds, 0 new errors

- [ ] **Step 3: Manual testing checklist**

Start dev server: `npx next dev --turbopack`

Test in browser:
1. Navigate to `/learn/modules` — sidebar should appear on left (expanded by default)
2. Click collapse chevron — sidebar shrinks to 64px rail with phase dots
3. Click expand — sidebar returns to full width
4. Navigate to `/learn/modules/1-1` — read through pages. Sidebar should show 1-1 as "in progress" (gold ring)
5. Take quiz and pass — should see "Mastered!" with phase progress bar and "Next: 1.2" button
6. Click "Next: 1.2" — should navigate to module 1-2
7. Go back to `/learn/modules` — module 1-1 should have green checkmark, 1-2 should have "NEXT" badge
8. Resize to mobile width (<1024px) — sidebar should disappear, floating pill should appear at bottom-left
9. Tap pill — bottom sheet should slide up with full progress
10. Reload page — progress should persist (localStorage)

- [ ] **Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix(learn): address any issues found during manual testing"
```

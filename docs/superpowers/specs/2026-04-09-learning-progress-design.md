# Learning Progress & Journey System — Design Spec

**Date:** 2026-04-09
**Status:** Approved

---

## Problem

1. After passing a quiz, users are dumped back to content with no path to the next module
2. No progress tracking — quiz scores, completion status, and learning journey are ephemeral
3. Users have no sense of where they are in the 50-module curriculum

## Solution Overview

A learning progress system with:
- **Three-tier module states**: Not Started → In Progress → Mastered
- **Persistent storage**: localStorage for all users, Supabase sync for logged-in users
- **Collapsible sidebar** on all learn module pages showing progress, phases, and "Continue" CTA
- **Post-quiz "Next Module" flow** that celebrates mastery and advances the user
- **Enhanced module index** with visual progress indicators

---

## 1. Data Model

### Module Progress States

| State | Trigger | Visual |
|-------|---------|--------|
| **Not Started** | Default | Gray dot |
| **In Progress** | User reads any content page | Gold ring |
| **Mastered** | User passes quiz (4/5+) | Green checkmark |

### Per-Module Record

```typescript
interface ModuleProgress {
  moduleId: string;        // e.g. "1-1"
  status: 'in_progress' | 'mastered';
  quizScore: number | null;      // highest score achieved (0-5)
  quizPassedAt: string | null;   // ISO timestamp
  lastPageRead: number;          // 0-indexed page number
  lastAccessedAt: string;        // ISO timestamp
}
```

Modules with no record are "Not Started".

### Derived Metrics (computed, not stored)

- **Overall %**: mastered count / 50 total modules
- **Phase %**: mastered in phase / total in phase
- **Current module**: first non-mastered module in canonical sequence
- **Phase status**: "complete" (all mastered), "in_progress" (any started), "not_started"

### Canonical Module Sequence

Derived from the existing `PHASES` constant in `/src/app/[locale]/learn/modules/page.tsx`. This is the single source of truth. The sequence flattens all phases/topics/modules into a linear order:

```
0-1, 0-2, 0-3, 0-4, 0-5,
1-1, 1-2, 1-3, 2-1, 2-2, 2-3, 2-4, 3-1, 3-2, 3-3, 4-1, 4-2, 4-3,
5-1, 5-2, 5-3, 6-1, 6-2, 6-3, 6-4, 7-1, 7-2, 7-3, 8-1,
9-1, 9-2, 9-3, 10-1, 10-2, 10-3, 11-1, 11-2, 11-3, 12-1, 12-2, 13-1, 13-2, 13-3,
14-1, 14-2, 14-3, 15-1, 15-2, 15-3, 15-4,
16-1, 16-2, 16-3
```

**Free exploration** — all modules accessible at any time, no locking. The sidebar and "Next Module" button suggest canonical order but don't enforce it.

**"Continue" logic**: First module in canonical sequence that isn't mastered. If user jumps around, "Continue" always points to the earliest gap.

---

## 2. Storage Strategy

### localStorage (all users)

- Key: `dekho-panchang-learn-progress`
- Value: `Record<string, ModuleProgress>` serialized as JSON
- Updated immediately on every page read and quiz pass
- Namespaced to avoid collisions

### Supabase (logged-in users)

New table `learning_progress`:

```sql
CREATE TABLE learning_progress (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,               -- e.g. "1-1"
  status TEXT NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress', 'mastered')),
  quiz_score INT,                        -- highest score (0-5)
  quiz_passed_at TIMESTAMPTZ,
  last_page_read INT NOT NULL DEFAULT 0,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, module_id)
);

-- RLS: users read/write own data only
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own progress"
  ON learning_progress FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Sync & Merge Rules

- **On page load (logged in)**: Fetch DB progress, merge with localStorage, write merged result to both
- **On quiz pass / page read (logged in)**: Write to both localStorage and DB simultaneously
- **On login/signup**: Merge localStorage into DB

**Merge rule — highest state wins:**
- `mastered > in_progress > not_started`
- If localStorage says "mastered" and DB says "in_progress", result is "mastered"
- Quiz score: keep the **highest** score, not the latest
- `lastPageRead`: keep the **highest** page number
- `lastAccessedAt`: keep the **most recent** timestamp

**On logout**: localStorage preserved (anonymous progress continues)

### "Sign in to save" nudge

When progress exists in localStorage but user is not logged in, show a subtle message in the sidebar: "Sign in to save progress across devices". Not blocking, not a modal — just a text link in the sidebar footer.

---

## 3. Collapsible Sidebar

### Where it renders

- All module pages: `/learn/modules/*`
- Learn landing page: `/learn`
- Module index: `/learn/modules`
- **NOT** on reference pages (`/learn/nakshatras`, etc.) — those keep current layout. Revisit in v2.

### Expanded State (~260px)

From top to bottom:
1. **Overall progress**: Large "42%" with "21/50 modules mastered" subtitle
2. **Continue card**: Green-bordered card with next module title + page progress bar within that module
3. **Phase list**: Each phase shows:
   - Phase name + progress fraction (e.g. "3/10")
   - Progress bar
   - **Current phase**: expanded by default showing module list
     - Green checkmark = mastered
     - Gold ring = in progress
     - Gray dot = not started
     - Current module highlighted with bold text
   - **Other phases**: collapsed (click to expand)
4. **Footer** (logged out only): "Sign in to save across devices" link

### Collapsed State (64px rail)

- **% circle** (36px) at top with overall percentage
- **Phase dots** with abbreviated labels (P0, P1, ..., P5) and progress fraction
  - Green filled = phase complete
  - Gold border = phase in progress
  - Gray border = not started
- **Expand arrow** (chevron) at bottom

### Toggle behavior

- Chevron button toggles expanded ↔ collapsed
- State persisted in localStorage key `dekho-panchang-sidebar-state` ("expanded" | "collapsed")
- Default: expanded on first visit
- Animation: CSS `transition: width 200ms ease` on sidebar, `margin-left` transition on content area. No flex-based resize.

### Mobile (<1024px)

- Sidebar hidden entirely
- **Floating pill** at bottom-left: shows "42% · P1" in a small rounded capsule
- Tap pill → **bottom sheet** slides up with full expanded sidebar content
- Swipe down or tap overlay to dismiss

---

## 4. Post-Quiz Completion Flow

### On Pass (4/5+)

Replace current results screen with:

1. **"Mastered!" heading** with green checkmark animation
2. **Score**: "4/5"
3. **Phase progress bar**: updated count ("Phase 1: The Sky — 4/10 mastered")
4. **Primary CTA**: Large green "Next: 1.3 Zodiac Belt →" button
5. **Secondary links**: "Review Content" | "All Modules"

Progress saved immediately (localStorage + Supabase if logged in).

**Edge case — last module in curriculum (16-3):**
- Replace "Next Module" with "You've completed the entire curriculum!" celebration
- Show overall 100% badge
- CTA: "View Your Journey" → module index

**Edge case — last module in a phase:**
- Show "Phase 1 Complete!" mini-celebration before the Next Module button
- Next Module button points to first module of next phase

### On Fail (<4/5)

Current flow preserved:
- "Try Again" heading with score
- "Retry Quiz" button (reshuffles questions)
- "Back to Content" button
- No progress state change (stays at current status)

---

## 5. Module Index Page Enhancements

### Per-module indicators

Each module row in the phase list gets:
- **Green checkmark** (mastered) | **Gold ring** (in progress) | **Gray dot** (not started)
- Mastered modules show quiz score as small badge: "5/5" or "4/5"

### Phase headers

Each phase section header shows:
- Phase name
- Progress bar
- "X/Y mastered" count
- If phase complete: green "Complete" badge

### Top summary

Above the phase list:
- Overall progress: "21/50 modules mastered (42%)"
- Progress bar
- "Continue: 1.2 Measuring the Sky →" button (same as sidebar)

### 100% completion

When all 50 modules mastered:
- Golden banner at top: "Curriculum Complete — You've mastered all 50 modules"
- Replace "Continue" with celebration graphic

---

## 6. Zustand Store

New file: `src/stores/learning-progress-store.ts`

```typescript
interface LearningProgressStore {
  progress: Record<string, ModuleProgress>;
  sidebarExpanded: boolean;
  hydrated: boolean;

  // Actions
  hydrateFromStorage: () => void;
  syncWithSupabase: (userId: string) => Promise<void>;
  markPageRead: (moduleId: string, pageIndex: number) => void;
  markQuizPassed: (moduleId: string, score: number) => void;
  toggleSidebar: () => void;

  // Computed (as functions, not selectors — Zustand pattern)
  getModuleStatus: (moduleId: string) => 'not_started' | 'in_progress' | 'mastered';
  getNextModule: () => string | null;
  getPhaseProgress: (phase: number) => { mastered: number; total: number; percent: number };
  getOverallProgress: () => { mastered: number; total: number; percent: number };
}
```

- Hydrates from localStorage on mount (client-side only)
- `markPageRead`: sets status to "in_progress" if currently "not_started". Updates `lastPageRead` if higher. Writes to localStorage. If authed, also writes to Supabase.
- `markQuizPassed`: sets status to "mastered", stores highest score. Writes to both.
- `syncWithSupabase`: fetches DB rows, merges with local (highest state wins), writes merged result to both.

---

## 7. Implementation Scope

### New files
- `src/stores/learning-progress-store.ts` — Zustand store
- `src/components/learn/LearnSidebar.tsx` — collapsible sidebar component
- `src/components/learn/LearnSidebarMobile.tsx` — floating pill + bottom sheet
- `src/components/learn/ProgressIndicator.tsx` — small dot/check/ring component
- `src/lib/learn/module-sequence.ts` — canonical sequence derived from PHASES + helper functions
- `supabase/migrations/007_learning_progress.sql` — DB migration

### Modified files
- `src/components/learn/ModuleContainer.tsx` — post-quiz flow, progress tracking on page read
- `src/components/learn/LearnLayoutShell.tsx` — integrate sidebar
- `src/app/[locale]/learn/modules/page.tsx` — progress indicators on module index
- `src/app/[locale]/learn/page.tsx` — progress summary on learn landing
- `src/app/[locale]/learn/layout.tsx` — sidebar wrapper

### Not in scope (v1)
- Reference page sidebar (44 pages, separate layouts — v2)
- Streaks / daily learning goals
- Leaderboards
- Certificate / badge sharing
- Spaced repetition / review scheduling

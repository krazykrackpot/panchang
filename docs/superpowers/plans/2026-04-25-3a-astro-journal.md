# 3A Astro Journal — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a daily journal that auto-tags entries with planetary state, enabling users to do 30-second check-ins and later query their personal dataset by dasha, nakshatra, tithi, or planetary period.

**Architecture:** Three new Supabase tables (`astro_journal`, `prediction_tracking`, `life_events`) with RLS. Two new API routes (`/api/journal` for CRUD, `/api/journal/[id]` for delete). A reusable `JournalCheckinCard` component embedded on the dashboard, plus a dedicated `/dashboard/journal` browse page with calendar heatmap and filters. Planetary state is computed server-side at entry creation time using existing `computePanchang()` and stored as JSONB.

**Tech Stack:** Next.js 16 (App Router), Supabase PostgreSQL with RLS, Tailwind CSS v4 (dark theme), Zustand, existing `computePanchang()` + `calculateDashas()`

**Spec reference:** `docs/superpowers/specs/2026-04-25-direction3-data-over-time.md` § 3A

---

## File Structure

```
supabase/migrations/
  014_astro_journal.sql              <- NEW: 3 tables + RLS + indexes

src/types/
  journal.ts                         <- NEW: TypeScript interfaces

src/lib/
  journal/
    snapshot.ts                      <- NEW: Planetary state snapshot builder
  __tests__/
    journal-snapshot.test.ts         <- NEW: Tests

src/stores/
  journal-store.ts                   <- NEW: Zustand store

src/app/api/journal/
  route.ts                           <- NEW: POST + GET
  [id]/route.ts                      <- NEW: DELETE

src/app/[locale]/dashboard/
  page.tsx                           <- MODIFY: Add JournalCheckinCard
  journal/
    page.tsx                         <- NEW: Browse page
    layout.tsx                       <- NEW: Metadata

src/components/journal/
  JournalCheckinCard.tsx             <- NEW: Dashboard check-in widget
  JournalCalendarHeatmap.tsx         <- NEW: 90-day heatmap
  JournalEntryList.tsx               <- NEW: Entry list
  JournalFilters.tsx                 <- NEW: Filter bar
  MoodEnergyDisplay.tsx              <- NEW: Reusable display
```

---

## Dependency Graph

```
Task 1 (Migration) ──┐
Task 2 (Types) ───────┼──> Task 3 (Snapshot) ──> Task 4 (POST/GET API) ──> Task 6 (Store) ──> Task 8 (CheckinCard) ──> Task 9 (Dashboard)
                      │                          Task 5 (DELETE API) ──────┘                    Task 7 (MoodEnergy) ──┘
                      │
Task 10 (Heatmap) ────┤
Task 11 (EntryList) ──┼──> Task 13 (Browse page)
Task 12 (Filters) ────┘
Task 14 (Delete cascade) — independent
Task 15 (Tests) — after 3-5
Task 16 (Browser verify) — after all
```

---

### Task 1: Database Migration

**File:** Create `supabase/migrations/014_astro_journal.sql`

Create 3 tables: `astro_journal`, `prediction_tracking`, `life_events`. Each with uuid PK, user_id FK to auth.users with ON DELETE CASCADE, RLS enabled with "users read own" + "service role manages all" policies. Denormalized columns on astro_journal for fast filtering (tithi_number, nakshatra_number, maha_dasha, antar_dasha, moon_sign, sade_sati_phase, weekday). UNIQUE constraint on (user_id, entry_date) for upsert.

### Task 2: TypeScript Types

**File:** Create `src/types/journal.ts`

Interfaces: `PlanetarySnapshot` (tithi/nakshatra/yoga/karana/vara/planets/dasha/sadeSati), `JournalEntry` (mirrors DB row), `JournalCreateInput` (mood/energy/note/tags), `JournalFilters` (dateFrom/dateTo/mahaDasha/nakshatraNumber/tithiNumber/mood/limit/offset).

### Task 3: Planetary State Snapshot Builder (TDD)

**Files:** `src/lib/journal/snapshot.ts`, `src/lib/__tests__/journal-snapshot.test.ts`

`buildPlanetarySnapshot(lat, lng, timezone, date, dashaTimeline?, sadeSati?)` → calls `computePanchang()`, extracts 9 planet positions, finds current dasha from timeline. Returns `{ snapshot, denormalized }`.

### Task 4: API Route — POST + GET /api/journal

**File:** `src/app/api/journal/route.ts`

POST: Auth check, Zod validation, fetch user profile for location, call `buildPlanetarySnapshot()`, upsert into astro_journal. GET: Auth check, build filtered query from params, return `{ entries, total }`.

### Task 5: API Route — DELETE /api/journal/[id]

**File:** `src/app/api/journal/[id]/route.ts`

DELETE: Auth check, delete where id = param AND user_id = auth user.

### Task 6: Zustand Store

**File:** `src/stores/journal-store.ts`

State: entries, todayEntry, loading, filters, total. Actions: submitCheckin, fetchEntries, fetchTodayEntry, deleteEntry, setFilters.

### Task 7: Mood/Energy Display Component

**File:** `src/components/journal/MoodEnergyDisplay.tsx`

Small reusable: mood (1-5 → red/orange/yellow/lime/emerald circles), energy (1-5 → dim to bright lightning). Props: mood, energy, size.

### Task 8: Journal Check-in Card

**File:** `src/components/journal/JournalCheckinCard.tsx`

Dashboard widget. Two states: form (mood buttons, energy buttons, note input, tag chips, submit) and summary (today's entry with edit option). Gold gradient card styling.

### Task 9: Dashboard Integration

**File:** Modify `src/app/[locale]/dashboard/page.tsx`

Import JournalCheckinCard, render after MorningBriefing when hasBirthData is true.

### Task 10: Calendar Heatmap

**File:** `src/components/journal/JournalCalendarHeatmap.tsx`

GitHub-style 90-day heatmap. Cells colored by mood (dim to bright gold). Hover tooltip with date + mood + nakshatra. Click to select date.

### Task 11: Entry List

**File:** `src/components/journal/JournalEntryList.tsx`

Scrollable list of entries. Each card: date, mood/energy display, note, tags, planetary badges (tithi, nakshatra, dasha).

### Task 12: Filters Component

**File:** `src/components/journal/JournalFilters.tsx`

Horizontal filter bar: date range, dasha dropdown, nakshatra dropdown, tithi dropdown, mood min, reset button.

### Task 13: Journal Browse Page

**Files:** `src/app/[locale]/dashboard/journal/page.tsx`, `layout.tsx`

Full browse page: heatmap at top, filters below, entry list with pagination. Layout with trilingual metadata.

### Task 14: Account Deletion Cascade

**File:** Modify `src/app/api/user/profile/route.ts`

Add `astro_journal`, `prediction_tracking`, `life_events` to the delete cascade list.

### Task 15: Tests

**File:** `src/lib/__tests__/journal-snapshot.test.ts`

Verify snapshot builder with real dates, denormalized field consistency, 9-planet positions, dasha extraction.

### Task 16: Browser Verification

Verify: check-in card renders on dashboard, submit saves to DB with planetary_state, journal browse page renders heatmap + list + filters, upsert works, delete works. EN + HI locales. Zero console errors.

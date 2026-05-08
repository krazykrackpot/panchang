# Unified Muhurta Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `/muhurat` (calendar) and `/muhurta-ai` (scanner) into one unified page at `/muhurta-ai`, then redirect `/muhurat` → `/muhurta-ai`. Drop "AI" branding (there is no AI). Align on 120-min overview windows and 15-min drilldown — one scoring model, one page, zero contradictions.

**Architecture:** The unified page combines the calendar's browsing UX (month grid, restriction notices, factor verdicts) with the scanner's precision (15-min drilldown, heatmap, score breakdown, share). The API is unified into a single POST endpoint that supports both overview and detail resolution. The monolithic 1105-line `/muhurat/page.tsx` is replaced by a modular client component reusing the scanner's component architecture.

**Tech Stack:** Next.js App Router, React 19, Framer Motion, Zustand (location/birth stores), existing `scanDateRangeV2` engine (unchanged), `html-to-image` for share.

**URL decision:** Keep `/muhurta-ai` as the URL path despite dropping "AI" branding. Reason: `/muhurta` conflicts with the existing `/muhurta/[type]` dynamic route (12+ static SEO pages like `/muhurta/wedding`, `/muhurta/griha-pravesh`). Renaming would require restructuring the type pages. The URL is a technical detail — user-visible branding (titles, headings) says "Shubh Muhurta Finder", not "AI".

---

## Critical Design Decisions

1. **Calendar view auto-fetches on mount and month change** (like the old page). Heatmap view requires clicking "Scan" (like the scanner). This matches user expectations for each metaphor — calendar = browse, heatmap = analyse.

2. **Activity picker uses the rich SVG icons** from the old `/muhurat` page's `ActivityIcon` component (10 activities with custom icons, fallback star for the rest). The scanner's `ScanControls` dropdown is replaced with the tarot-style card grid.

3. **API stays POST** but the calendar view fires it automatically on mount with sensible defaults (current month, marriage activity, user's location from store).

4. **Type imports:** All shared types (`DaySummary`, `FactorVerdict`, `RestrictionNotice`) live in `src/types/muhurta-ai.ts` — the canonical location. Components import from there, not local `./types`.

5. **Message files:** Keep `src/messages/pages/muhurta-ai.json` as the single message file. Port any missing translations from `src/messages/pages/muhurat.json` into it, then delete `muhurat.json`.

6. **Scanner labels:** `src/app/[locale]/muhurta-ai/scanner-labels.ts` is kept as-is — it provides locale-specific labels for the scanner UI.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/types/muhurta-ai.ts` | Add DaySummary, FactorVerdict, RestrictionNotice types |
| **Modify** | `src/app/api/muhurta-scan/route.ts` | Add restriction checks, factor verdicts, day grouping from old API |
| **Create** | `src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx` | Month calendar grid with quality dots + month nav |
| **Create** | `src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx` | Combustion, chaturmas, adhika masa notices |
| **Create** | `src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx` | Tithi/nakshatra/yoga/karana/lagna verdicts with citations |
| **Create** | `src/app/[locale]/muhurta-ai/components/NextBestCard.tsx` | Hero card showing next auspicious date |
| **Modify** | `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx` | Add calendar view, auto-fetch, restrictions, verdicts, next-best card |
| **Modify** | `src/app/[locale]/muhurta-ai/components/ScanControls.tsx` | Add calendar/heatmap view toggle |
| **Modify** | `src/app/[locale]/muhurta-ai/page.tsx` | Drop "AI" branding, add methodology, remove NL dead code |
| **Modify** | `src/app/[locale]/muhurta-ai/layout.tsx` | Update metadata title/description |
| **Modify** | `src/lib/seo/metadata.ts` | Update `/muhurta-ai` meta (drop "AI") |
| **Replace** | `src/app/[locale]/muhurat/page.tsx` | 1105-line page → simple redirect to `/muhurta-ai` |
| **Delete** | `src/app/api/muhurat/scan/route.ts` | Old calendar API (368 lines) — replaced |
| **Delete** | `src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx` | Dead code (imported but never rendered) |
| **Delete** | `src/app/[locale]/muhurta-ai/components/NLResultCards.tsx` | Dead code (imported but never rendered) |
| **Modify** | `src/app/sitemap.ts` | Remove `/muhurat` route |
| **Modify** | Navbar, Footer, cross-links, `/muhurta/[type]` pages | Update all `/muhurat` links → `/muhurta-ai` |
| **Delete** | `src/messages/pages/muhurat.json` | Merge any missing keys into `muhurta-ai.json`, then delete |

---

## Task 0: Add shared types for the unified page

**Files:**
- Modify: `src/types/muhurta-ai.ts`

- [ ] **Step 1: Add DaySummary, FactorVerdict, and RestrictionNotice types**

Add to `src/types/muhurta-ai.ts` (after existing types):

```typescript
export interface FactorVerdict {
  factor: string;       // 'Tithi', 'Nakshatra', 'Yoga', 'Karana', 'Lagna'
  value: string;        // e.g. 'Dwitiya', 'Rohini'
  verdict: 'good' | 'neutral' | 'bad';
  reason: string;       // classical citation, e.g. 'Auspicious for marriage — MC Ch. 6'
}

export interface DaySummary {
  date: string;         // YYYY-MM-DD
  bestScore: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  windowCount: number;
  bestWindow?: { startTime: string; endTime: string; score: number };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  tithi?: string;
  nakshatra?: string;
  vara?: string;
  factors?: FactorVerdict[];
}

export interface RestrictionNotice {
  type: string;
  label: { en: string; hi: string };
}
```

- [ ] **Step 2: Verify compilation**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 3: Commit**

```bash
git add src/types/muhurta-ai.ts
git commit -m "feat: add DaySummary, FactorVerdict, RestrictionNotice types"
```

---

## Task 1: Unify the API — add restrictions, verdicts, and day grouping

Port the restriction checks and factor verdict logic from the old `/api/muhurat/scan` (GET, 368 lines) into the unified `/api/muhurta-scan` (POST, 155 lines). The old API will be deleted in Task 6 — read it now as reference.

**Files:**
- Modify: `src/app/api/muhurta-scan/route.ts`
- Reference (read-only): `src/app/api/muhurat/scan/route.ts`

- [ ] **Step 1: Read the old API's restriction logic**

Read `src/app/api/muhurat/scan/route.ts` lines 180-368 completely. It imports:
```typescript
import { checkVivahCombustion } from '@/lib/muhurta/combustion';
import { isAdhikaMasa, checkChaturmas, isProhibitedSolarMonth, checkShishutva, isDakshinayana } from '@/lib/muhurta/vedic-restrictions';
import { checkHolashtak } from '@/lib/calendar/festival-generator';
import { getLunarMasaForDate } from '@/lib/calendar/tithi-table';
```

The restriction logic is tiered by activity type:
- **Marriage/griha-pravesh:** Check all 7 restrictions (combustion, adhika masa, chaturmas, kharmas, shishutva, holashtak, dakshinayana)
- **Other activities:** Check combustion + adhika masa only

Each restriction produces a `{ type: string, label: { en: string, hi: string } }` with classical citation in the label.

- [ ] **Step 2: Read the old API's factor verdict logic**

Read `src/app/api/muhurat/scan/route.ts` lines 120-175. The `buildFactorVerdicts` function takes a scored window and the activity's rules, and returns an array of `FactorVerdict[]`:
- For each factor (Tithi, Nakshatra, Yoga, Karana, Lagna), it checks whether the current value is in `goodTithis`/`avoidTithis`/etc. from the activity rules
- Returns `verdict: 'good'` if in the good list, `'bad'` if in the avoid list, `'neutral'` otherwise
- The `reason` field includes the classical text reference

- [ ] **Step 3: Add restriction + verdict + day-grouping logic to unified API**

In `src/app/api/muhurta-scan/route.ts`:

1. Add the restriction imports (from step 1)
2. Add the `buildFactorVerdicts` helper function (from step 2)
3. After `scanDateRangeV2()` returns windows, when `resolution === 'overview'`:
   - Compute restrictions for the date range (call each restriction checker)
   - Group windows by date into `DaySummary[]` (best window per day, quality tier, factor verdicts)
   - Add `restrictions` and `days` to the response JSON
4. Import and use the `DaySummary`, `FactorVerdict`, `RestrictionNotice` types from `@/types/muhurta-ai`

The response shape for overview mode becomes:
```typescript
{
  windows: HeatmapCell[],       // existing — raw 120-min window scores
  days: DaySummary[],           // NEW — day-level summaries with verdicts
  restrictions: RestrictionNotice[], // NEW — active restrictions for this period
  meta: { ... }                 // existing
}
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: zero errors

- [ ] **Step 5: Commit**

```bash
git add src/app/api/muhurta-scan/route.ts
git commit -m "feat: unified muhurta API — restrictions, verdicts, day grouping"
```

---

## Task 2: Create CalendarGrid, RestrictionNotices, FactorVerdicts, NextBestCard components

All four are presentation components extracted from the old `/muhurat/page.tsx`. All import types from `@/types/muhurta-ai`.

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/NextBestCard.tsx`
- Reference (read-only): `src/app/[locale]/muhurat/page.tsx`

- [ ] **Step 1: Create CalendarGrid**

Read old page lines 600-800 for the calendar grid rendering. Create `CalendarGrid.tsx`:

```typescript
'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DaySummary } from '@/types/muhurta-ai';

interface CalendarGridProps {
  year: number;
  month: number;
  days: DaySummary[];
  onMonthChange: (delta: number) => void;
  onDaySelect: (day: DaySummary) => void;
  selectedDate?: string;
  locale: string;
}
```

Must include:
- 7-column grid with weekday headers (Sun-Sat)
- `useMemo` to compute grid cells (first-day-of-month offset, days-in-month, map to DaySummary)
- Quality dot colour coding: green for excellent (>=72), amber for good (>=58), grey for fair (>=50), no dot for poor
- Click handler calls `onDaySelect`
- Selected day gets a gold border highlight
- Month navigation arrows call `onMonthChange(+1)` / `onMonthChange(-1)`
- Purple mega card gradient background per project styling rules

Also include the `ShuddhiDots` inline sub-component (from old page line 340): 5 small dots showing panchanga shuddhi level (0-5), green=filled, grey=empty.

- [ ] **Step 2: Create RestrictionNotices**

Read old page lines 480-540. Create `RestrictionNotices.tsx`:

```typescript
'use client';
import { AlertTriangle } from 'lucide-react';
import type { RestrictionNotice } from '@/types/muhurta-ai';

interface RestrictionNoticesProps {
  restrictions: RestrictionNotice[];
  locale: string;
}
```

Renders amber/red banners for active restrictions. Each banner shows the restriction type icon + label text (locale-aware). Use `bg-amber-500/10 border border-amber-500/20` for styling.

- [ ] **Step 3: Create FactorVerdicts**

Read old page lines 830-940. Create `FactorVerdicts.tsx`:

```typescript
'use client';
import type { FactorVerdict } from '@/types/muhurta-ai';

interface FactorVerdictsProps {
  factors: FactorVerdict[];
  locale: string;
}
```

Table/list showing each factor's value and verdict. Good = green dot + text, neutral = grey, bad = red. Reason text shown in smaller secondary colour. Use the project's purple mega card gradient for the container.

- [ ] **Step 4: Create NextBestCard**

Read old page lines 540-600. Create `NextBestCard.tsx`:

```typescript
'use client';
import { Sparkles, ArrowRight } from 'lucide-react';
import type { DaySummary } from '@/types/muhurta-ai';

interface NextBestCardProps {
  day: DaySummary;
  activityLabel: string;
  onSelect: () => void;
  locale: string;
}
```

Hero card with gold accent showing: date, score, quality badge, best window time range, tithi + nakshatra names, "View details →" CTA button. Include ShuddhiDots if factors are available.

- [ ] **Step 5: Verify all four compile**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx \
        src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx \
        src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx \
        src/app/[locale]/muhurta-ai/components/NextBestCard.tsx
git commit -m "feat: CalendarGrid, RestrictionNotices, FactorVerdicts, NextBestCard components"
```

---

## Task 3: Wire new components into MuhurtaScannerClient

This is the core integration task. The scanner client gains a calendar view mode, auto-fetch behaviour, and renders the new components.

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx` (438 lines)
- Modify: `src/app/[locale]/muhurta-ai/components/ScanControls.tsx`

- [ ] **Step 1: Add new state variables and imports**

In `MuhurtaScannerClient.tsx`, add:

```typescript
import { CalendarGrid } from './components/CalendarGrid';
import { RestrictionNotices } from './components/RestrictionNotices';
import { FactorVerdicts } from './components/FactorVerdicts';
import { NextBestCard } from './components/NextBestCard';
import type { DaySummary, RestrictionNotice } from '@/types/muhurta-ai';

// New state:
const [viewMode, setViewMode] = useState<'calendar' | 'heatmap'>('calendar');
const [daySummaries, setDaySummaries] = useState<DaySummary[]>([]);
const [restrictions, setRestrictions] = useState<RestrictionNotice[]>([]);
```

- [ ] **Step 2: Change default activity to 'marriage'**

Change the activity state initialiser from `'property'` to `'marriage'`.

- [ ] **Step 3: Add auto-fetch for calendar view**

Add a `useEffect` that fires when `viewMode === 'calendar'` and when year/month/activity/location changes:

```typescript
useEffect(() => {
  if (viewMode !== 'calendar') return;
  // Auto-fetch overview for the current month
  handleScan(); // reuse existing scan function
}, [viewMode, startDate, endDate, activity, /* location deps */]);
```

This gives the calendar view the browse-on-mount behaviour users expect from a calendar. The heatmap view keeps the manual "Scan" button.

- [ ] **Step 4: Parse new API response fields**

In the `handleScan` callback, after parsing the overview response, extract the new fields:

```typescript
const data = await res.json();
setOverviewCells(data.windows || []);
setDaySummaries(data.days || []);      // NEW
setRestrictions(data.restrictions || []); // NEW
```

- [ ] **Step 5: Render calendar grid vs heatmap based on viewMode**

Replace the current unconditional `<MonthHeatmap>` render with:

```typescript
{viewMode === 'calendar' ? (
  <>
    <RestrictionNotices restrictions={restrictions} locale={locale} />
    {nextBestDay && (
      <NextBestCard day={nextBestDay} activityLabel={...} onSelect={...} locale={locale} />
    )}
    <CalendarGrid
      year={year} month={month} days={daySummaries}
      onMonthChange={handleMonthChange} onDaySelect={handleDaySelect}
      selectedDate={selectedDate} locale={locale}
    />
  </>
) : (
  <>
    {/* Desktop */}
    <MonthHeatmap ... />
    {/* Mobile */}
    <MobileMonthView ... />
  </>
)}
```

The day detail panel (DayDrilldown + FactorVerdicts + ScoreBreakdown) renders below either view when a day is selected.

- [ ] **Step 6: Add FactorVerdicts to day detail panel**

When a day is selected and drilldown data is loaded, show FactorVerdicts alongside ScoreBreakdown:

```typescript
{selectedDate && daySummaries.find(d => d.date === selectedDate)?.factors && (
  <FactorVerdicts
    factors={daySummaries.find(d => d.date === selectedDate)!.factors!}
    locale={locale}
  />
)}
```

- [ ] **Step 7: Add view toggle to ScanControls**

In `ScanControls.tsx`, add a `viewMode` / `onViewModeChange` prop and render a segmented toggle:

```typescript
interface ScanControlsProps {
  // ... existing props
  viewMode: 'calendar' | 'heatmap';
  onViewModeChange: (mode: 'calendar' | 'heatmap') => void;
}
```

Render two toggle buttons (Calendar icon | Grid icon) styled like the old page's calendar/list toggle.

- [ ] **Step 8: Verify compilation and test in browser**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

Start dev server: `npx next dev --webpack`
Test at `http://localhost:3000/en/muhurta-ai`:
- Calendar grid renders with quality dots on first load (auto-fetch)
- Month navigation works (changes month, re-fetches)
- Toggle to heatmap works
- Day click shows factor verdicts + score breakdown
- Restriction notices appear when applicable

- [ ] **Step 9: Commit**

```bash
git add src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx \
        src/app/[locale]/muhurta-ai/components/ScanControls.tsx
git commit -m "feat: unified muhurta page — calendar view, auto-fetch, restrictions, verdicts"
```

---

## Task 4: Drop "AI" branding, add methodology, clean dead code

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/page.tsx` (158 lines)
- Modify: `src/app/[locale]/muhurta-ai/layout.tsx` (31 lines)
- Modify: `src/lib/seo/metadata.ts`
- Delete: `src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx` (dead code)
- Delete: `src/app/[locale]/muhurta-ai/components/NLResultCards.tsx` (dead code)

- [ ] **Step 1: Remove NL dead code**

In `page.tsx`, remove the `NLSearchBar` and `NLResultCards` imports. Delete both files:
- `src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx` (2,720 bytes)
- `src/app/[locale]/muhurta-ai/components/NLResultCards.tsx` (10,656 bytes)

- [ ] **Step 2: Update page editorial content**

In `page.tsx`:
- Replace "AI Muhurta Scanner" headings with "Shubh Muhurta Finder" / "शुभ मुहूर्त खोजक"
- Update the 4 editorial cards — replace "AI Scoring" card with "Classical 36-Rule Engine" card
- Port the "How We Calculate" methodology section from old `/muhurat/page.tsx` lines 950-1100. This is ~150 lines of educational content explaining the 5-tier scoring system, 36 rules, classical citations. Place it after the editorial cards.

- [ ] **Step 3: Update layout metadata**

In `src/lib/seo/metadata.ts`, find the `/muhurta-ai` entry and update:

```typescript
'/muhurta-ai': {
  title: {
    en: 'Shubh Muhurta Finder — Auspicious Dates & Times for 20 Activities',
    hi: 'शुभ मुहूर्त खोजक — 20 कार्यों के लिए शुभ तिथि एवं समय',
    sa: 'शुभमुहूर्तान्वेषकम् — 20 कार्याणां कृते शुभतिथिसमयौ',
  },
  description: {
    en: 'Find the most auspicious date and time for marriage, griha pravesh, business, and 18 more activities. 36-rule Vedic scoring with 15-minute precision. Free.',
    hi: 'विवाह, गृह प्रवेश, व्यापार और 18 अन्य कार्यों के लिए सबसे शुभ तिथि और समय। 36-नियम वैदिक स्कोरिंग, 15 मिनट की सटीकता।',
    sa: 'विवाहगृहप्रवेशव्यापारादि 20 कार्याणां कृते शुभतिथिसमयम्। 36-नियमवैदिकमूल्याङ्कनम्।',
  },
  keywords: ['muhurta finder', 'auspicious date', 'shubh muhurat', 'vivah muhurat', 'wedding date'],
},
```

Update `layout.tsx` — no code change needed since it already calls `getPageMetadata('/muhurta-ai', locale)`.

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 5: Commit**

```bash
git rm src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx \
       src/app/[locale]/muhurta-ai/components/NLResultCards.tsx
git add src/app/[locale]/muhurta-ai/page.tsx \
        src/app/[locale]/muhurta-ai/layout.tsx \
        src/lib/seo/metadata.ts
git commit -m "feat: drop AI branding → Shubh Muhurta Finder, add methodology, kill dead code"
```

---

## Task 5: Redirect `/muhurat` → `/muhurta-ai`, delete old code, update all links

**Files:**
- Replace: `src/app/[locale]/muhurat/page.tsx` (1105 lines → redirect)
- Delete: `src/app/api/muhurat/scan/route.ts` (368 lines)
- Delete: `src/messages/pages/muhurat.json` (after merging any missing keys)
- Modify: `src/app/sitemap.ts`
- Modify: All files linking to `/muhurat`

- [ ] **Step 1: Replace old page with redirect**

Replace the 1105-line `src/app/[locale]/muhurat/page.tsx` with:

```typescript
import { redirect } from 'next/navigation';

export default async function MuhuratRedirect({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/muhurta-ai`);
}
```

- [ ] **Step 2: Delete old API route**

```bash
rm src/app/api/muhurat/scan/route.ts
```

- [ ] **Step 3: Merge message files and delete old one**

Read `src/messages/pages/muhurat.json` and `src/messages/pages/muhurta-ai.json`. Copy any keys from muhurat.json that don't exist in muhurta-ai.json. Then delete muhurat.json.

- [ ] **Step 4: Remove `/muhurat` from sitemap**

In `src/app/sitemap.ts`, find the `'/muhurat'` entry in the routes array and remove it. `/muhurta-ai` is already listed.

- [ ] **Step 5: Update all internal links from `/muhurat` to `/muhurta-ai`**

Run: `grep -rn '"/muhurat"' src/ --include="*.tsx" --include="*.ts" | grep -v muhurta-ai | grep -v node_modules`

Expected files to update:
- `src/components/layout/Navbar.tsx` — nav link
- `src/components/layout/Footer.tsx` — footer link
- `src/lib/seo/cross-links.ts` — cross-link definitions
- `src/app/[locale]/muhurta/[type]/page.tsx` — CTA buttons ("Find your date →")
- `src/app/[locale]/panchang/muhurta/page.tsx` — if it links to the calendar
- Any other pages with muhurat cross-references

Also grep for `'/muhurat/'` (with trailing slash) and `muhurat/scan` (API references in client code) — these should also be updated.

**CRITICAL: The `/muhurta/[type]` pages (12+ static SEO pages) have CTA buttons linking to `/muhurat`. Update ALL of them to `/muhurta-ai`.**

- [ ] **Step 6: Verify build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Run: `npx vitest run`

- [ ] **Step 7: Commit**

```bash
git rm src/app/api/muhurat/scan/route.ts src/messages/pages/muhurat.json
git add src/app/[locale]/muhurat/page.tsx src/app/sitemap.ts \
        src/lib/seo/cross-links.ts src/components/layout/Navbar.tsx \
        src/components/layout/Footer.tsx
# Also add any muhurta/[type] pages that were updated
git add src/app/[locale]/muhurta/
git commit -m "feat: redirect /muhurat → /muhurta-ai, delete old API + page, update all links"
```

---

## Task 6: Final verification and push

- [ ] **Step 1: Full test suite**

```bash
npx vitest run
```
Expected: all ~3075 tests pass (scoring engine is unchanged)

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Test in browser**

Start dev server: `npx next dev --webpack`

Verify ALL of these:
1. `/en/muhurta-ai` loads with calendar grid, marriage activity selected, current month auto-fetched
2. Activity picker shows 20 activities with rich SVG icons
3. Month navigation arrows work — data re-fetches automatically
4. Calendar grid shows quality dots (green/amber/grey) for scored days
5. Click a day → below the grid, factor verdicts appear (Tithi: good/neutral/bad with reason) + score breakdown + 15-min drilldown
6. Toggle to heatmap view → 2D heatmap renders correctly
7. In heatmap view, "Scan" button is required (no auto-fetch)
8. Restriction notices appear when viewing a month with active restrictions (e.g., check Adhika Masa months)
9. "Next best date" card appears above the grid with score and time range
10. Share button generates PNG
11. Personalization (birth nakshatra/rashi) affects scores
12. `/en/muhurat` redirects to `/en/muhurta-ai` (HTTP 307/308)
13. No console errors
14. Hindi locale works: `/hi/muhurta-ai` with Hindi labels
15. Mobile responsive: calendar grid adapts, no horizontal overflow

- [ ] **Step 4: Push**

```bash
git push origin main
```

- [ ] **Step 5: Verify Vercel deployment**

```bash
npx vercel ls  # confirm Ready status
```

Check live:
- `https://dekhopanchang.com/en/muhurta-ai` — unified page works
- `https://dekhopanchang.com/en/muhurat` — redirects to muhurta-ai
- `https://dekhopanchang.com/en/muhurta/wedding` — CTA links to muhurta-ai (not old muhurat)

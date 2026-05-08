# Unified Muhurta Page — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Merge `/muhurat` (calendar) and `/muhurta-ai` (scanner) into one unified page at `/muhurta-ai`, then redirect `/muhurat` → `/muhurta-ai`. Drop "AI" branding (there is no AI). Align on 120-min overview windows and 15-min drilldown — one scoring model, one page, zero contradictions.

**Architecture:** The unified page combines the calendar's browsing UX (month grid, restriction notices, factor verdicts) with the scanner's precision (15-min drilldown, heatmap, score breakdown, share). The API is unified into a single POST endpoint that supports both overview and detail resolution. The monolithic 1105-line `/muhurat/page.tsx` is replaced by a modular client component reusing the scanner's component architecture.

**Tech Stack:** Next.js App Router, React 19, Framer Motion, Zustand (location/birth stores), existing `scanDateRangeV2` engine (unchanged), `html-to-image` for share.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| **Modify** | `src/app/api/muhurta-scan/route.ts` | Add restriction checks, factor verdicts, day grouping from old API |
| **Delete** | `src/app/api/muhurat/scan/route.ts` | Old calendar API — replaced by unified endpoint |
| **Modify** | `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx` | Add calendar grid view, restriction notices, factor verdicts, "next best" card |
| **Create** | `src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx` | Month calendar grid with quality dots (from old page) |
| **Create** | `src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx` | Combustion, chaturmas, adhika masa notices |
| **Create** | `src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx` | Tithi/nakshatra/yoga/karana/lagna verdicts with classical citations |
| **Create** | `src/app/[locale]/muhurta-ai/components/NextBestCard.tsx` | Hero card showing next auspicious date |
| **Modify** | `src/app/[locale]/muhurta-ai/components/ScanControls.tsx` | Add calendar/heatmap view toggle |
| **Modify** | `src/app/[locale]/muhurta-ai/page.tsx` | Update editorial content, remove "AI" branding, add methodology section |
| **Modify** | `src/app/[locale]/muhurta-ai/layout.tsx` | Update metadata — remove "AI" from title/description |
| **Delete** | `src/app/[locale]/muhurat/page.tsx` | Old calendar page — replaced |
| **Modify** | `src/app/[locale]/muhurat/layout.tsx` | Convert to redirect → `/muhurta-ai` |
| **Delete** | `src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx` | Dead code |
| **Delete** | `src/app/[locale]/muhurta-ai/components/NLResultCards.tsx` | Dead code |
| **Modify** | `src/lib/seo/metadata.ts` | Update `/muhurta-ai` meta title/description (drop "AI") |
| **Modify** | `src/app/sitemap.ts` | Remove `/muhurat` route, keep `/muhurta-ai` |
| **Modify** | Navbar/footer/cross-links | Update all internal links from `/muhurat` → `/muhurta-ai` |

---

## Task 0: Add shared types for the unified page

**Files:**
- Modify: `src/types/muhurta-ai.ts`

- [ ] **Step 1: Add DaySummary and FactorVerdict types**

Add to `src/types/muhurta-ai.ts`:

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

## Task 1: Unify the API — add restrictions + verdicts to `/api/muhurta-scan`

The old `/api/muhurat/scan` had restriction checks and factor verdicts that `/api/muhurta-scan` lacks. Port them over.

**Files:**
- Modify: `src/app/api/muhurta-scan/route.ts`
- Reference: `src/app/api/muhurat/scan/route.ts` (lines 180-368 for restriction logic)

- [ ] **Step 1: Read the restriction logic from the old API**

The old API imports and calls these restriction checkers (from `src/app/api/muhurat/scan/route.ts`):
```typescript
import { checkVivahCombustion } from '@/lib/muhurta/combustion';
import { isAdhikaMasa, checkChaturmas, isProhibitedSolarMonth, checkShishutva, isDakshinayana } from '@/lib/muhurta/vedic-restrictions';
import { checkHolashtak } from '@/lib/calendar/festival-generator';
```

These produce a `restrictions[]` array of `{ type: string, label: LocaleText }`. Copy this logic.

- [ ] **Step 2: Add restriction imports and logic to the unified API**

Add to `src/app/api/muhurta-scan/route.ts` after the existing `scanDateRangeV2` call:

```typescript
import { checkVivahCombustion } from '@/lib/muhurta/combustion';
import { isAdhikaMasa, checkChaturmas, isProhibitedSolarMonth, checkShishutva, isDakshinayana } from '@/lib/muhurta/vedic-restrictions';
import { checkHolashtak } from '@/lib/calendar/festival-generator';
import { dateToJD, calculateTithi } from '@/lib/ephem/astronomical';
import { getLunarMasaForDate } from '@/lib/calendar/tithi-table';

// After computing windows, add restriction notices for overview mode:
if (resolution === 'overview') {
  const restrictions: Array<{ type: string; label: { en: string; hi: string } }> = [];
  // Port the tiered restriction logic from the old API (lines 230-340)
  // Check: combustion, adhika masa, chaturmas, kharmas, shishutva, holashtak, dakshinayana
  // Filter by activity type (marriage gets all, general gets fewer)
  response.restrictions = restrictions;
}
```

- [ ] **Step 3: Add day-level grouping and factor verdicts for overview mode**

For overview responses, group windows by date and compute best-window-per-day summaries with factor verdicts:

```typescript
if (resolution === 'overview') {
  const dayMap = new Map<string, ScanV2Window[]>();
  for (const w of windows) {
    const list = dayMap.get(w.date) || [];
    list.push(w);
    dayMap.set(w.date, list);
  }
  const days = [...dayMap.entries()].map(([date, ws]) => {
    const best = ws.reduce((a, b) => a.score > b.score ? a : b);
    const quality = best.score >= 72 ? 'excellent' : best.score >= 58 ? 'good' : best.score >= 50 ? 'fair' : 'poor';
    return {
      date, bestScore: best.score, quality, windowCount: ws.length,
      bestWindow: { startTime: best.startTime, endTime: best.endTime, score: best.score },
      tithi: best.panchangContext?.tithiName,
      nakshatra: best.panchangContext?.nakshatraName,
      vara: best.panchangContext?.varaName,
      taraBala: best.taraBala,
      chandraBala: best.chandraBala,
      factors: buildFactorVerdicts(best, activityRules),
    };
  });
  response.days = days;
}
```

The `buildFactorVerdicts` function extracts tithi/nakshatra/yoga/karana/lagna verdicts from the window's breakdown and activity rules. Port from old API lines 120-175.

- [ ] **Step 4: Verify the unified API returns both old and new data**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: zero errors

- [ ] **Step 5: Commit**

```bash
git add src/app/api/muhurta-scan/route.ts
git commit -m "feat: unified muhurta API — add restrictions, verdicts, day grouping"
```

---

## Task 2: Create calendar grid component

Extract the calendar grid UI from the old `/muhurat/page.tsx` (lines 600-800) into a standalone component.

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx`
- Reference: `src/app/[locale]/muhurat/page.tsx` (lines 600-800)

- [ ] **Step 1: Create CalendarGrid component**

```typescript
'use client';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DaySummary } from './types';

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

Port the calendar grid rendering from old page lines 600-800: 7-column grid, weekday headers, quality-dot color coding (green=excellent, amber=good, grey=fair), click handler to select a day. Include the ShuddhiDots component inline (5-dot panchanga shuddhi indicator from old page line 340).

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/CalendarGrid.tsx
git commit -m "feat: CalendarGrid component extracted from old muhurat page"
```

---

## Task 3: Create restriction notices + factor verdicts + next-best-card components

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/NextBestCard.tsx`

- [ ] **Step 1: Create RestrictionNotices**

Port from old page lines 480-540. Displays amber/red banners for active restrictions (combustion, chaturmas, adhika masa, kharmas, holashtak, dakshinayana) with classical citations.

```typescript
interface RestrictionNoticesProps {
  restrictions: Array<{ type: string; label: { en: string; hi: string } }>;
  locale: string;
}
```

- [ ] **Step 2: Create FactorVerdicts**

Port from old page lines 830-940. Table showing tithi/nakshatra/yoga/karana/lagna verdicts with good/neutral/bad badges and reason text.

```typescript
interface FactorVerdictsProps {
  factors: Array<{ factor: string; value: string; verdict: 'good' | 'neutral' | 'bad'; reason: string }>;
  locale: string;
}
```

- [ ] **Step 3: Create NextBestCard**

Port from old page lines 540-600. Hero card showing the next excellent/good date with score, shuddhi dots, and "View details" CTA.

```typescript
interface NextBestCardProps {
  day: DaySummary;
  activityLabel: string;
  onSelect: () => void;
  locale: string;
}
```

- [ ] **Step 4: Verify compilation**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/RestrictionNotices.tsx \
        src/app/[locale]/muhurta-ai/components/FactorVerdicts.tsx \
        src/app/[locale]/muhurta-ai/components/NextBestCard.tsx
git commit -m "feat: restriction notices, factor verdicts, next-best-card components"
```

---

## Task 4: Update MuhurtaScannerClient — add calendar view + wire new components

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx`
- Modify: `src/app/[locale]/muhurta-ai/components/ScanControls.tsx`

- [ ] **Step 1: Add view toggle state and calendar grid**

Add to MuhurtaScannerClient:
- `viewMode` state: `'heatmap' | 'calendar'` (default `'calendar'`)
- Import and render `CalendarGrid` when `viewMode === 'calendar'`
- Import and render `MonthHeatmap` when `viewMode === 'heatmap'`
- Wire `RestrictionNotices` above the grid (from API response)
- Wire `NextBestCard` above the grid
- Wire `FactorVerdicts` into the day detail panel (alongside existing `ScoreBreakdown`)

- [ ] **Step 2: Add view toggle to ScanControls**

Add a segmented toggle (Calendar | Heatmap) to `ScanControls.tsx`, similar to the old page's `view` toggle (calendar/list). Pass `viewMode` and `onViewModeChange` props.

- [ ] **Step 3: Change default activity from 'property' to 'marriage'**

In `MuhurtaScannerClient.tsx` line where `activity` state is initialised, change default from `'property'` to `'marriage'`.

- [ ] **Step 4: Update API call to request restrictions + days**

The overview API call in `handleScan` already sends `resolution: 'overview'`. After Task 1, the response will include `restrictions` and `days`. Store them in state:

```typescript
const [restrictions, setRestrictions] = useState<Array<{ type: string; label: { en: string; hi: string } }>>([]);
const [daySummaries, setDaySummaries] = useState<DaySummary[]>([]);
```

- [ ] **Step 5: Verify compilation and test in browser**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Start dev server: `npx next dev --webpack`
Open `http://localhost:3000/en/muhurta-ai` — verify:
- Calendar grid renders with quality dots
- Heatmap toggle switches view
- Day click shows factor verdicts + score breakdown
- Restriction notices appear when relevant

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx \
        src/app/[locale]/muhurta-ai/components/ScanControls.tsx
git commit -m "feat: unified muhurta page — calendar view, restrictions, verdicts"
```

---

## Task 5: Update page wrapper — drop "AI" branding, add methodology

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/page.tsx`
- Modify: `src/app/[locale]/muhurta-ai/layout.tsx`
- Modify: `src/lib/seo/metadata.ts`
- Delete: `src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx`
- Delete: `src/app/[locale]/muhurta-ai/components/NLResultCards.tsx`

- [ ] **Step 1: Remove NL dead code imports from page.tsx**

Remove the `NLSearchBar` and `NLResultCards` imports from `page.tsx`. Delete both component files.

- [ ] **Step 2: Update editorial content — drop "AI" branding**

Replace "AI Muhurta Scanner" headings with "Muhurta Scanner" or "Shubh Muhurta Finder". Update the 4 editorial cards to remove AI references. Add the methodology section from the old `/muhurat` page (lines 950-1100) — the "How We Calculate" section explaining the 36-rule, 5-tier scoring system.

- [ ] **Step 3: Update layout metadata**

In `layout.tsx`, update `getPageMetadata('/muhurta-ai', locale)` — the metadata in `metadata.ts` needs title/description changes:

```typescript
// In metadata.ts, update the /muhurta-ai entry:
'/muhurta-ai': {
  title: { en: 'Shubh Muhurta Finder — Auspicious Dates & Times', ... },
  description: { en: 'Find the most auspicious date and time for marriage, griha pravesh, business, and 18 more activities. 36-rule Vedic scoring with 15-minute precision.', ... },
}
```

- [ ] **Step 4: Verify**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta-ai/page.tsx \
        src/app/[locale]/muhurta-ai/layout.tsx \
        src/lib/seo/metadata.ts
git rm src/app/[locale]/muhurta-ai/components/NLSearchBar.tsx \
       src/app/[locale]/muhurta-ai/components/NLResultCards.tsx
git commit -m "feat: drop AI branding, add methodology section, remove NL dead code"
```

---

## Task 6: Redirect `/muhurat` → `/muhurta-ai` and clean up links

**Files:**
- Modify: `src/app/[locale]/muhurat/layout.tsx` — redirect
- Delete: `src/app/[locale]/muhurat/page.tsx`
- Delete: `src/app/api/muhurat/scan/route.ts`
- Modify: `src/app/sitemap.ts` — remove `/muhurat` route
- Modify: navbar, footer, cross-links — update all `/muhurat` references

- [ ] **Step 1: Convert `/muhurat` to a redirect page**

Replace `src/app/[locale]/muhurat/page.tsx` with a simple redirect:

```typescript
import { redirect } from 'next/navigation';

export default async function MuhuratPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  redirect(`/${locale}/muhurta-ai`);
}
```

Or use Next.js middleware / `layout.tsx` redirect. Keep the layout.tsx for the redirect; delete the old 1105-line page.

- [ ] **Step 2: Delete old API route**

Delete `src/app/api/muhurat/scan/route.ts` (368 lines). The unified `/api/muhurta-scan` now handles everything.

- [ ] **Step 3: Update sitemap**

In `src/app/sitemap.ts`, remove `/muhurat` from the routes array. `/muhurta-ai` is already there.

- [ ] **Step 4: Update all internal links**

Grep for `/muhurat` across the codebase and update to `/muhurta-ai`:
- Navbar links
- Footer links
- Cross-links in `src/lib/seo/cross-links.ts`
- Any `<Link href="...muhurat...">` in other pages
- The `/muhurta/[type]/page.tsx` pages that link to the calendar

Command: `grep -rn '"/muhurat"' src/ --include="*.tsx" --include="*.ts" | grep -v muhurta-ai | grep -v node_modules`

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Run: `npx vitest run`
Run: `npx next build` (with increased heap: `NODE_OPTIONS='--max-old-space-size=8192'`)

- [ ] **Step 6: Commit**

```bash
git rm src/app/[locale]/muhurat/page.tsx src/app/api/muhurat/scan/route.ts
git add src/app/[locale]/muhurat/ src/app/sitemap.ts src/lib/seo/cross-links.ts \
        src/components/layout/Navbar.tsx src/components/layout/Footer.tsx
git commit -m "feat: redirect /muhurat → /muhurta-ai, delete old API, update all links"
```

---

## Task 7: Final verification and push

- [ ] **Step 1: Run full test suite**

```bash
npx vitest run
```
Expected: all tests pass (no muhurta-specific tests should break since the engine is unchanged)

- [ ] **Step 2: Run type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Test in browser**

Start dev server and verify:
1. `/en/muhurta-ai` loads with calendar grid view by default
2. Activity picker works (20 activities with icons)
3. Month navigation works
4. Calendar grid shows quality dots for auspicious days
5. Click a day → factor verdicts + score breakdown + 15-min drilldown
6. Toggle to heatmap view → 2D heatmap renders
7. Restriction notices appear (if applicable for current month)
8. "Next best date" card shows correctly
9. Share button generates PNG
10. `/en/muhurat` redirects to `/en/muhurta-ai`
11. No console errors

- [ ] **Step 4: Push**

```bash
git push origin main
```

- [ ] **Step 5: Verify Vercel deployment**

```bash
npx vercel ls  # confirm Ready
```

Check live site: `https://dekhopanchang.com/en/muhurta-ai` and `https://dekhopanchang.com/en/muhurat` (should redirect).

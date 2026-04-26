# Muhurta Scanner — Decision Heatmap

**Date:** 2026-04-26
**Status:** Draft
**Route:** `/[locale]/muhurta-ai` (replaces existing page)
**Mockup:** `.superpowers/brainstorm/69354-1777208883/content/decision-heatmap.html`

---

## Problem

The current muhurta-ai page produces a ranked list of scored time windows. Users must scroll through results and mentally map them to their schedule. There is no visual overview of "which days are good vs bad this month," no personalization beyond Tara/Chandra Bala, and no way to drill into a specific day at fine resolution.

Competitors (Prokerala, Shubh Panchang) show generic muhurta tables for everyone. None integrate the user's running dasha period into the scoring.

## Solution

A two-pass Muhurta Scanner that produces a month-view **heatmap** (Pass 1, coarse) and a per-day **sparkline drill-down** (Pass 2, fine), with personalized scoring that factors in the user's birth nakshatra, rashi, and running antardasha.

---

## Architecture

### API

**Single endpoint:** `POST /api/muhurta-scan`

```ts
// Request
interface MuhurtaScanRequest {
  activity: ExtendedActivityId;
  startDate: string;        // YYYY-MM-DD
  endDate: string;           // YYYY-MM-DD
  lat: number;
  lng: number;
  timezone: string;          // IANA (e.g. "Europe/Zurich"), resolved from lat/lng
  resolution: 'overview' | 'detail';
  // Optional personalization
  birthNakshatra?: number;   // 1-27
  birthRashi?: number;       // 1-12
  dashaLords?: {             // from saved kundali
    maha: number;            // planet ID 0-8
    antar: number;
    pratyantar: number;
  };
  // For detail mode only
  detailDate?: string;       // YYYY-MM-DD (required when resolution='detail')
}

// Response
interface MuhurtaScanResponse {
  windows: HeatmapCell[] | DetailWindow[];
  meta: {
    activity: ExtendedActivityId;
    dateRange: [string, string];
    resolution: 'overview' | 'detail';
    personalFactorsUsed: ('taraBala' | 'chandraBala' | 'dashaHarmony')[];
    computeTimeMs: number;
  };
}
```

**Pass 1 (overview):** 2-hour windows from sunrise-2h to sunset+3h for each day in the date range. Returns `HeatmapCell[]`:

```ts
interface HeatmapCell {
  date: string;           // YYYY-MM-DD
  timeSlot: number;       // 0-based index of the 2h window
  startTime: string;      // HH:MM
  endTime: string;        // HH:MM
  score: number;          // 0-100 (normalized)
  rawScore: number;       // Internal score before normalization
}
```

Estimated compute: ~8 windows/day x 30 days = 240 calls to scoring functions. At ~50ms each = ~12 seconds. Acceptable with a skeleton loading state.

**Pass 2 (detail):** 15-minute windows across a single day. Returns `DetailWindow[]`:

```ts
interface DetailWindow {
  date: string;
  startTime: string;
  endTime: string;
  score: number;             // 0-100
  breakdown: {
    tithi: number;           // 0-20
    nakshatra: number;       // 0-20
    yoga: number;            // 0-20
    karana: number;          // 0-10
    taraBala: number;        // 0-10 (0 if no birth data)
    chandraBala: number;     // 0-10 (0 if no birth data)
    dashaHarmony: number;    // 0-10 (0 if no dasha data)
    inauspicious: number;    // 0-10 (subtractive)
  };
  inauspiciousPeriods: {
    name: string;            // 'Rahu Kaal', 'Varjyam', 'Yamaganda', 'Vishti', 'Panchaka'
    active: boolean;
  }[];
  panchangContext: {
    tithiName: string;
    nakshatraName: string;
    yogaName: string;
    karanaName: string;
    paksha: 'shukla' | 'krishna';
  };
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
}
```

Estimated compute: ~56 windows x 50ms = ~2.8 seconds.

### Score Normalization

Internal scoring uses the existing `ai-recommender.ts` weights (max ~75 from panchang+transit+timing). Personal factors add up to 30 more (Tara 10, Chandra 10, Dasha 10). Max theoretical raw score = ~105.

**Display score:** `Math.round((rawScore / maxPossible) * 100)` where `maxPossible` is 75 (no personalization), 85 (nakshatra+rashi only), or 105 (full kundali). This way a score of 80/100 means the same thing whether personalized or not.

### Dasha Harmony Scoring

Uses the existing `goodHoras` field from `activity-rules-extended.ts` as a proxy for which planets are benefic for an activity. The `goodHoras` array lists planet IDs (0=Sun through 6=Saturn) that are favorable.

```
if activity.goodHoras.includes(dashaLords.antar) → +10
else if activity.goodHoras.includes(dashaLords.maha) → +5
else if malefic planet (Saturn/Mars/Rahu/Ketu) as antar lord → -5 (floor 0)
else → +3 (neutral)
```

The antardasha lord is weighted higher than mahadasha because it governs the current sub-period (months, not years). Pratyantardasha is not scored separately — it changes too frequently to meaningfully affect a monthly scan.

### Chart Source Resolution

When the user is authenticated, resolve their birth data in this priority order:

1. Saved chart with `relationship = 'self'`
2. Most recently created saved chart
3. Quick Personalize inputs (localStorage)
4. No personalization (generic scan)

Show a small "Scanning for: [chart name]" indicator with a dropdown to switch charts. If using localStorage fallback, show "Using quick inputs — save a full chart for dasha scoring."

---

## Page Structure

### Route: `/[locale]/muhurta-ai`

Replaces the existing page. Existing page is at `src/app/[locale]/muhurta-ai/page.tsx`.

```
src/app/[locale]/muhurta-ai/
  page.tsx                      # Server component — metadata, activity list, initial shell
  MuhurtaScannerClient.tsx      # Client orchestrator — state, API calls, layout
  components/
    ScanControls.tsx            # Activity select, date range, location, "Scan" button
    QuickPersonalize.tsx        # Inline nakshatra + rashi dropdowns for anonymous users
    DashaBanner.tsx             # Purple banner showing running dasha + activity relevance
    MonthHeatmap.tsx            # Pass 1 grid — rows=time slots, cols=days
    DayDrilldown.tsx            # Pass 2 sparkline bars + inauspicious period markers
    PeakCards.tsx               # Top 3 recommendation cards with factor breakdown
    ScoreBreakdown.tsx          # Horizontal bar chart of factor contributions
    MobileMonthView.tsx         # Vertical day-list for <768px screens
```

### Component Details

**ScanControls.tsx**
- Activity: dropdown of all 20 `ExtendedActivityId` values, labels from `activity-rules-extended.ts`
- Date range: defaults to current month, max 31 days
- Location: reads from location store, editable
- "Scan Month" button triggers Pass 1 API call

**QuickPersonalize.tsx** (shown when no saved kundali)
- Two dropdowns: birth nakshatra (1-27), birth rashi (1-12)
- Saves to `localStorage('muhurta-quick-personalize')`
- Small CTA: "Generate a full chart for dasha-personalized results"

**DashaBanner.tsx** (shown when saved kundali exists)
- Displays: Mahadasha / Antardasha / Pratyantardasha lords
- Antardasha end date
- One-line relevance note: "Favourable for property transactions" or "Caution — Saturn antardasha suppresses marriage timing"
- Relevance derived from: does `activity.goodHoras` include the antardasha lord?

**MonthHeatmap.tsx**
- CSS Grid: first column = time labels, remaining 28-31 columns = day cells
- Rows: one per 2-hour window from sunrise-2h to sunset+3h (~8-9 rows)
- Pre-sunrise and post-sunset rows collapsed by default, expandable via toggle
- Cell color: 7-stop scale (empty/red/dark-amber/amber/light-green/green/bright-green) matching `score-0` through `score-6`
- Today's cell gets a gold outline
- Clicking a cell triggers Pass 2 API call for that date
- Month navigation arrows (prev/next month) re-trigger Pass 1
- Desktop only (>768px)

**MobileMonthView.tsx** (<768px)
- Vertical list of days, each showing: date, weekday, mini inline sparkline (8 colored dots for 2h windows), best-score badge
- Tapping a day expands DayDrilldown inline below it (accordion-style)
- No horizontal scrolling

**DayDrilldown.tsx**
- Sparkline bar chart: 56 bars (15-min windows), height = score, color = score bracket
- Red overlay zones for active inauspicious periods (Rahu Kaal, Varjyam, Yamaganda)
- Gold vertical "NOW" line at current time (only on today's date)
- Time axis labels: every 2 hours
- Warning chips below the chart listing inauspicious periods with time ranges

**PeakCards.tsx**
- Top 3 windows from the entire scanned range (cross-day, not just the selected day)
- Each card shows: rank badge, time window, date + panchang context, factor rows (Panchang Score, Tara Bala, Chandra Bala, Dasha Harmony, Inauspicious)
- Factor values color-coded: green (good), amber (caution), red (bad)
- Clicking a card selects that date in the heatmap and scrolls to DayDrilldown

**ScoreBreakdown.tsx**
- Shown when a specific window is selected (click on a sparkline bar or peak card)
- Horizontal bar chart with 8 rows: Tithi, Nakshatra, Yoga, Karana, Tara Bala, Chandra Bala, Dasha Harmony, Inauspicious Check
- Bar fill color matches score (green/amber/red)
- Total score at bottom with /100 display

---

## State Management

Single `useState` / `useReducer` in `MuhurtaScannerClient.tsx`:

```ts
interface ScannerState {
  // Inputs
  activity: ExtendedActivityId;
  startDate: string;
  endDate: string;
  lat: number;
  lng: number;
  timezone: string;
  // Personalization
  birthNakshatra: number | null;
  birthRashi: number | null;
  dashaLords: { maha: number; antar: number; pratyantar: number } | null;
  chartSource: 'saved' | 'quick' | 'none';
  chartName: string | null;
  // Results
  overviewData: HeatmapCell[] | null;
  detailData: DetailWindow[] | null;
  selectedDate: string | null;
  selectedWindow: DetailWindow | null;
  // Top 3 peaks (derived from overviewData — pick highest-scoring cells, then run detail on those 3 dates)
  peaks: DetailWindow[] | null;
  // Loading
  overviewLoading: boolean;
  detailLoading: boolean;
  peaksLoading: boolean;
}
```

No Zustand store — this is page-local state. The location store is read for initial lat/lng/tz values.

---

## Loading UX

**Pass 1 (overview):** Show the heatmap grid skeleton immediately (correct number of rows/cols based on date range). Cells are empty (`score-0` color). After API returns (~12s), cells fill in with a brief stagger animation (CSS `animation-delay` per column, ~50ms apart). Progress text: "Scanning May 2026... analyzing 240 windows"

**Pass 2 (detail):** Show the sparkline container at full width with placeholder bars. After API returns (~3s), bars animate up from zero. This is fast enough that a simple fade-in is fine.

**Peak resolution:** After Pass 1 completes, automatically trigger Pass 2 for the top 3 scoring days (3 parallel API calls). Peak cards show skeleton until all 3 resolve.

---

## Inauspicious Period Handling

The existing `scoreTimingFactors` already checks Rahu Kaal. The scanner needs to additionally check:

| Period | Check | Penalty |
|--------|-------|---------|
| Rahu Kaal | Existing in `scoreTimingFactors` | -5 (existing) |
| Yamaganda | Similar to Rahu Kaal — fixed order per weekday, 1/8 of daytime | -4 (new) |
| Gulika Kaal | Fixed order per weekday, 1/8 of daytime | -3 (new) |
| Varjyam | From nakshatra ghati offset, filtered to day bounds | -5 (new) |
| Vishti/Bhadra Karana | Already in `scorePanchangFactors` (karana === 7) | -5 (existing) |
| Panchaka | Already in `scorePanchangFactors` (nakshatra 23-27) | -5 (existing) |
| Sthira Karanas | Already in `scorePanchangFactors` (karanas 8-10) | -3 (existing) |
| Abhijit on Wednesday | Abhijit Muhurta (local noon +-24min) is void on Wednesdays | 0 bonus instead of +5 |

The `inauspiciousPeriods` array in `DetailWindow` lists which of these are active during that 15-minute window, so the UI can render warning chips.

---

## Modifications to Existing Engine

### `time-window-scanner.ts` — Refactor

The existing `scorePanchangFactors()` returns a single 0-25 score. The new breakdown UI needs per-element scores (tithi, nakshatra, yoga, karana separately). Refactor to return `{ tithi: number; nakshatra: number; yoga: number; karana: number; total: number }` instead of a flat `score`. All existing consumers use `.score` or `.total` — update them.

The existing `scanDateRange()` uses 3 fixed windows per day and returns top-20. Refactor to support:

1. Configurable window size (2h for overview, 15min for detail)
2. Configurable time range (sunrise-2h to sunset+3h instead of sunrise-to-sunset)
3. Return ALL windows (not top-20 filtered), since the heatmap needs every cell
4. Accept `dashaLords` for dasha harmony scoring
5. Remove the `totalScore >= 40` filter (the heatmap shows all scores including bad ones)

The existing function signature changes from:
```ts
function scanDateRange(options: ScanOptions): ScoredTimeWindow[]
```
to:
```ts
function scanDateRange(options: ScanOptionsV2): ScoredTimeWindow[]
```

Where `ScanOptionsV2` extends `ScanOptions` with `windowMinutes`, `prePostSunrise`, and `dashaLords`. The old `ScanOptions` interface is preserved for backward compatibility (the existing muhurta-ai page may still use it during transition).

### `ai-recommender.ts` — Add Yamaganda, Gulika, Varjyam

Add three new checks to `scoreTimingFactors()`:

- **Yamaganda:** Weekday lookup table (similar to Rahu Kaal), -4 penalty
- **Gulika:** Weekday lookup table, -3 penalty
- **Varjyam:** Compute from nakshatra ghati offset using existing `calculateVarjyam()` from panchang-calc if available, or implement the ghati offset table

These checks also return structured `inauspiciousPeriods` data for the UI.

### New: `dasha-harmony.ts`

Small module (~40 lines):

```ts
function scoreDashaHarmony(
  dashaLords: { maha: number; antar: number; pratyantar: number },
  activity: ExtendedActivity
): { score: number; label: string; favorable: boolean }
```

Uses `activity.goodHoras` as the benefic planet list for the activity. Returns 0-10 score.

---

## Mobile Responsiveness

| Breakpoint | Layout |
|------------|--------|
| >= 1024px | Full heatmap grid + side-by-side peak cards |
| 768-1023px | Full heatmap grid (scrollable) + stacked peak cards |
| < 768px | MobileMonthView (vertical day list) + inline drill-down |

The MonthHeatmap is hidden on mobile; MobileMonthView is hidden on desktop. Use Tailwind responsive classes, no JS media queries.

---

## Accessibility

- Heatmap cells have `aria-label` with date, time slot, and score: "May 8, 8-10 AM, score 92"
- Color is not the only indicator — hover/focus tooltip shows numeric score
- Keyboard navigation: arrow keys move between cells, Enter selects
- Sparkline bars are `role="img"` with `aria-label` describing the score pattern
- Peak cards are focusable and activatable with Enter/Space

---

## i18n

All user-facing strings go through `useTranslations('pages.muhurtaScanner')`. New namespace added to all 4 active locale files (en, hi, ta, bn).

Activity labels already have Trilingual support in `activity-rules-extended.ts`. Panchang element names (tithi, nakshatra, yoga, karana) use existing constants from `src/lib/constants/`.

Factor labels in the score breakdown (e.g., "Tara Bala", "Chandra Bala") need trilingual entries — add to the new namespace.

---

## Verification Plan

Before shipping, verify against Prokerala/Shubh Panchang for 3 test cases:

1. **Known good muhurta:** Pick a date Prokerala marks as "Excellent for Griha Pravesh." Run the scanner for that month. That date's morning windows must score in the top 5.

2. **Known bad muhurta:** Pick a date during Rahu Kaal + Vishti Karana. Score must be < 30/100 during that overlap.

3. **Dasha suppression:** Construct a test case where a universally good muhurta day falls during a malefic antardasha for the selected activity. The personalized score should be meaningfully lower (>15 points) than the generic score.

Also: spot-check that inauspicious period times (Rahu Kaal, Yamaganda) match Prokerala for Corseaux, Switzerland on 3 dates.

---

## Out of Scope (V1)

- Streaming/progressive loading (optimize later if 12s is too slow)
- Saving/exporting scan results
- Comparing two activities side-by-side
- Notification for upcoming peak windows
- Abhijit Muhurta special handling (beyond Wednesday exclusion)
- Integration with calendar apps (Google Calendar export)

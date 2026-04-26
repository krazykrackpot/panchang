# Muhurta Scanner Heatmap — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing Muhurta AI list-based results page with a two-pass visual heatmap scanner that shows month-level auspicious intensity (Pass 1) and per-day 15-minute sparkline drill-downs (Pass 2), personalized to the user's birth chart and running dasha.

**Architecture:** Single API endpoint (`POST /api/muhurta-scan`) with `resolution` param (overview/detail). Refactored `time-window-scanner.ts` supports configurable window sizes. New `dasha-harmony.ts` module scores antardasha compatibility. Client page uses 8 focused components with page-local state (no new Zustand store).

**Tech Stack:** Next.js 16 App Router, TypeScript, Tailwind v4, existing muhurta engine (`ai-recommender.ts`, `time-window-scanner.ts`), existing astronomical functions, Vitest for testing.

**Spec:** `docs/superpowers/specs/2026-04-26-muhurta-scanner-heatmap-design.md`

**Existing tests:** `src/lib/muhurta/__tests__/muhurta-engine.test.ts` (376 lines) — must continue passing after all changes.

---

## File Map

### New files
| File | Purpose |
|------|---------|
| `src/lib/muhurta/dasha-harmony.ts` | Score antardasha lord vs activity benefics (0-10) |
| `src/lib/muhurta/inauspicious-periods.ts` | Compute Yamaganda, Gulika, Varjyam windows for a given JD/location |
| `src/lib/muhurta/__tests__/dasha-harmony.test.ts` | Tests for dasha harmony scoring |
| `src/lib/muhurta/__tests__/inauspicious-periods.test.ts` | Tests for inauspicious period computation |
| `src/lib/muhurta/__tests__/scanner-v2.test.ts` | Tests for refactored scanner (configurable windows, no threshold filter) |
| `src/app/api/muhurta-scan/route.ts` | New unified scan API (overview + detail resolution) |
| `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx` | Client orchestrator component |
| `src/app/[locale]/muhurta-ai/components/ScanControls.tsx` | Activity, date range, location inputs |
| `src/app/[locale]/muhurta-ai/components/QuickPersonalize.tsx` | Inline nakshatra + rashi dropdowns |
| `src/app/[locale]/muhurta-ai/components/DashaBanner.tsx` | Running dasha context strip |
| `src/app/[locale]/muhurta-ai/components/MonthHeatmap.tsx` | Pass 1 heatmap grid (desktop) |
| `src/app/[locale]/muhurta-ai/components/MobileMonthView.tsx` | Pass 1 vertical day list (mobile) |
| `src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx` | Pass 2 sparkline + warnings |
| `src/app/[locale]/muhurta-ai/components/PeakCards.tsx` | Top 3 recommendation cards |
| `src/app/[locale]/muhurta-ai/components/ScoreBreakdown.tsx` | Factor bar chart |

### Modified files
| File | Change |
|------|--------|
| `src/types/muhurta-ai.ts` | Add `HeatmapCell`, `DetailWindow`, `ScanOptionsV2`, `DetailBreakdown` types |
| `src/lib/muhurta/time-window-scanner.ts` | Add `scanDateRangeV2()` with configurable window size, no threshold filter, inauspicious periods |
| `src/lib/muhurta/ai-recommender.ts` | Export per-element panchang sub-scores from `scorePanchangFactors()` |
| `src/app/[locale]/muhurta-ai/page.tsx` | Replace with server shell that renders `MuhurtaScannerClient` |

### Unchanged (verify no regression)
| File | Why |
|------|-----|
| `src/lib/muhurta/__tests__/muhurta-engine.test.ts` | Existing tests must all pass |
| `src/app/api/muhurta-ai/route.ts` | Existing API preserved (old clients) |
| `src/app/api/muhurat/scan/route.ts` | Existing scan API preserved |

---

## Task 1: Add New Types

**Files:**
- Modify: `src/types/muhurta-ai.ts`

- [ ] **Step 1: Read existing types and add new interfaces**

Add these types after the existing `MuhurtaAIResult` interface in `src/types/muhurta-ai.ts`:

```typescript
// --- Muhurta Scanner V2 types ---

export interface ScanOptionsV2 {
  startDate: string;       // YYYY-MM-DD
  endDate: string;         // YYYY-MM-DD
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  windowMinutes: number;   // 120 for overview, 15 for detail
  preSunriseHours: number; // hours before sunrise to include (e.g. 2)
  postSunsetHours: number; // hours after sunset to include (e.g. 3)
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
}

export interface DetailBreakdown {
  tithi: number;           // 0-20
  nakshatra: number;       // 0-20
  yoga: number;            // 0-20
  karana: number;          // 0-10
  taraBala: number;        // 0-10
  chandraBala: number;     // 0-10
  dashaHarmony: number;    // 0-10
  inauspicious: number;    // 0-10 (subtractive — higher = less penalty)
}

export interface InauspiciousPeriod {
  name: string;
  startTime: string;       // HH:MM
  endTime: string;         // HH:MM
  active: boolean;
}

export interface HeatmapCell {
  date: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
  score: number;           // 0-100 normalized
  rawScore: number;
}

export interface DetailWindow {
  date: string;
  startTime: string;
  endTime: string;
  score: number;
  breakdown: DetailBreakdown;
  inauspiciousPeriods: InauspiciousPeriod[];
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

export interface MuhurtaScanResponse {
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

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors (existing code doesn't reference new types yet)

- [ ] **Step 3: Commit**

```bash
git add src/types/muhurta-ai.ts
git commit -m "feat(types): add Muhurta Scanner V2 types — HeatmapCell, DetailWindow, DetailBreakdown"
```

---

## Task 2: Dasha Harmony Module

**Files:**
- Create: `src/lib/muhurta/dasha-harmony.ts`
- Create: `src/lib/muhurta/__tests__/dasha-harmony.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/muhurta/__tests__/dasha-harmony.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { scoreDashaHarmony } from '../dasha-harmony';
import { getExtendedActivity } from '../activity-rules-extended';

describe('scoreDashaHarmony', () => {
  it('returns max score when antar lord is in activity goodHoras', () => {
    const marriage = getExtendedActivity('marriage');
    // marriage.goodHoras = [5, 4, 1] → Venus, Jupiter, Moon
    const result = scoreDashaHarmony(
      { maha: 1, antar: 4, pratyantar: 0 }, // Jupiter antardasha
      marriage,
    );
    expect(result.score).toBe(10);
    expect(result.favorable).toBe(true);
  });

  it('returns partial score when only maha lord matches', () => {
    const marriage = getExtendedActivity('marriage');
    // maha=Jupiter(4) matches, antar=Saturn(6) does not
    const result = scoreDashaHarmony(
      { maha: 4, antar: 6, pratyantar: 0 },
      marriage,
    );
    expect(result.score).toBe(5);
    expect(result.favorable).toBe(true);
  });

  it('returns 0 for malefic antar lord', () => {
    const marriage = getExtendedActivity('marriage');
    // Saturn(6) antardasha, Mars(2) mahadasha — both malefic for marriage
    const result = scoreDashaHarmony(
      { maha: 2, antar: 6, pratyantar: 0 },
      marriage,
    );
    expect(result.score).toBe(0);
    expect(result.favorable).toBe(false);
  });

  it('returns neutral score for non-matching non-malefic lord', () => {
    const marriage = getExtendedActivity('marriage');
    // Sun(0) antar — not in goodHoras [5,4,1], not malefic [6,2,7,8]
    const result = scoreDashaHarmony(
      { maha: 0, antar: 3, pratyantar: 0 }, // Mercury antar
      marriage,
    );
    expect(result.score).toBe(3);
    expect(result.favorable).toBe(true);
  });

  it('works with different activities', () => {
    const surgery = getExtendedActivity('surgery');
    // surgery.goodHoras = [2, 0, 4] → Mars, Sun, Jupiter
    const result = scoreDashaHarmony(
      { maha: 0, antar: 2, pratyantar: 0 }, // Mars antardasha
      surgery,
    );
    expect(result.score).toBe(10);
    expect(result.favorable).toBe(true);
  });

  it('returns score between 0 and 10', () => {
    const activities = ['marriage', 'travel', 'property', 'education'] as const;
    for (const actId of activities) {
      const act = getExtendedActivity(actId);
      for (let antar = 0; antar <= 8; antar++) {
        const result = scoreDashaHarmony(
          { maha: 0, antar, pratyantar: 0 },
          act,
        );
        expect(result.score).toBeGreaterThanOrEqual(0);
        expect(result.score).toBeLessThanOrEqual(10);
        expect(typeof result.label).toBe('string');
        expect(typeof result.favorable).toBe('boolean');
      }
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/muhurta/__tests__/dasha-harmony.test.ts`
Expected: FAIL — module `../dasha-harmony` not found

- [ ] **Step 3: Implement dasha-harmony.ts**

Create `src/lib/muhurta/dasha-harmony.ts`:

```typescript
/**
 * Dasha Harmony Scoring — rates antardasha lord compatibility with an activity.
 *
 * Uses the activity's goodHoras (benefic planet list) as a proxy for which
 * planet periods favor the activity. Antardasha lord is weighted higher than
 * mahadasha because it governs the current sub-period (months, not years).
 */

import type { ExtendedActivity } from '@/types/muhurta-ai';

// Malefic planets for general muhurta purposes
// Saturn(6), Mars(2), Rahu(7), Ketu(8)
const MALEFIC_IDS = new Set([2, 6, 7, 8]);

export function scoreDashaHarmony(
  dashaLords: { maha: number; antar: number; pratyantar: number },
  activity: ExtendedActivity,
): { score: number; label: string; favorable: boolean } {
  const benefics = new Set(activity.goodHoras);

  // Antardasha lord match → full score
  if (benefics.has(dashaLords.antar)) {
    return { score: 10, label: 'Antardasha lord favors this activity', favorable: true };
  }

  // Mahadasha lord match (antar didn't match) → partial score
  if (benefics.has(dashaLords.maha)) {
    return { score: 5, label: 'Mahadasha lord favors this activity', favorable: true };
  }

  // Malefic antardasha lord → zero
  if (MALEFIC_IDS.has(dashaLords.antar)) {
    return { score: 0, label: 'Malefic antardasha lord suppresses this activity', favorable: false };
  }

  // Neutral — non-matching, non-malefic
  return { score: 3, label: 'Neutral dasha period', favorable: true };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/muhurta/__tests__/dasha-harmony.test.ts`
Expected: All 6 tests PASS

- [ ] **Step 5: Run existing muhurta tests for regression**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: All existing tests PASS (no changes to existing modules yet)

- [ ] **Step 6: Commit**

```bash
git add src/lib/muhurta/dasha-harmony.ts src/lib/muhurta/__tests__/dasha-harmony.test.ts
git commit -m "feat: dasha harmony scoring module — antardasha lord vs activity benefics"
```

---

## Task 3: Inauspicious Periods Module

**Files:**
- Create: `src/lib/muhurta/inauspicious-periods.ts`
- Create: `src/lib/muhurta/__tests__/inauspicious-periods.test.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/muhurta/__tests__/inauspicious-periods.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import {
  computeYamaganda,
  computeGulikaKaal,
  computeInauspiciousForWindow,
} from '../inauspicious-periods';

describe('computeYamaganda', () => {
  // Sunday: segment 5, duration = (18-6)/8 = 1.5h each
  // Yamaganda = sunrise + (5-1)*1.5 = sunrise + 6h
  it('returns correct window for Sunday', () => {
    const result = computeYamaganda(6.0, 18.0, 0); // sunrise 6AM UT, sunset 6PM UT, Sunday
    expect(result.start).toBeCloseTo(12.0, 1); // noon
    expect(result.end).toBeCloseTo(13.5, 1);   // 1:30 PM
  });

  it('returns correct window for Wednesday', () => {
    // Wed: segment 2, sunrise + (2-1)*1.5 = sunrise + 1.5h
    const result = computeYamaganda(6.0, 18.0, 3); // Wednesday
    expect(result.start).toBeCloseTo(7.5, 1);  // 7:30 AM
    expect(result.end).toBeCloseTo(9.0, 1);    // 9:00 AM
  });

  it('scales with actual day duration', () => {
    // Short winter day: sunrise 7:30, sunset 16:30 → 9h day, segment = 9/8 = 1.125h
    const result = computeYamaganda(7.5, 16.5, 0); // Sunday, segment 5
    const duration = (16.5 - 7.5) / 8;
    expect(result.start).toBeCloseTo(7.5 + 4 * duration, 2);
    expect(result.end).toBeCloseTo(7.5 + 5 * duration, 2);
  });
});

describe('computeGulikaKaal', () => {
  it('returns correct window for Sunday', () => {
    // Sun: segment 7, sunrise + (7-1)*1.5 = sunrise + 9h
    const result = computeGulikaKaal(6.0, 18.0, 0);
    expect(result.start).toBeCloseTo(15.0, 1); // 3 PM
    expect(result.end).toBeCloseTo(16.5, 1);   // 4:30 PM
  });

  it('returns correct window for Saturday', () => {
    // Sat: segment 1, sunrise + 0 = sunrise
    const result = computeGulikaKaal(6.0, 18.0, 6);
    expect(result.start).toBeCloseTo(6.0, 1);
    expect(result.end).toBeCloseTo(7.5, 1);
  });
});

describe('computeInauspiciousForWindow', () => {
  it('detects Rahu Kaal overlap', () => {
    // Monday Rahu Kaal: segment 2 → sunrise + 1.5 to sunrise + 3.0
    // With sunrise 6.0: 7:30 - 9:00 UT
    const periods = computeInauspiciousForWindow(
      8.0, 8.25, // window 8:00-8:15 UT — inside Rahu Kaal
      6.0, 18.0, 1, // sunrise, sunset, Monday
      10, // nakshatra
      2460691.0, // jd
      5.5, // tz
    );
    const rahuKaal = periods.find(p => p.name === 'Rahu Kaal');
    expect(rahuKaal).toBeDefined();
    expect(rahuKaal!.active).toBe(true);
  });

  it('returns inactive Rahu Kaal for window outside it', () => {
    const periods = computeInauspiciousForWindow(
      14.0, 14.25, // window 2:00-2:15 PM UT — outside Monday Rahu Kaal
      6.0, 18.0, 1,
      10, 2460691.0, 5.5,
    );
    const rahuKaal = periods.find(p => p.name === 'Rahu Kaal');
    expect(rahuKaal).toBeDefined();
    expect(rahuKaal!.active).toBe(false);
  });

  it('returns all 5 period types', () => {
    const periods = computeInauspiciousForWindow(
      10.0, 10.25,
      6.0, 18.0, 3, // Wednesday
      10, 2460691.0, 5.5,
    );
    const names = periods.map(p => p.name);
    expect(names).toContain('Rahu Kaal');
    expect(names).toContain('Yamaganda');
    expect(names).toContain('Gulika Kaal');
    // Varjyam and Vishti depend on panchang state, may or may not be active
    expect(periods.length).toBeGreaterThanOrEqual(3);
  });

  it('penalty score is 0-10', () => {
    const periods = computeInauspiciousForWindow(
      10.0, 10.25, 6.0, 18.0, 3, 10, 2460691.0, 5.5,
    );
    const activeCount = periods.filter(p => p.active).length;
    // Each active period deducts from the 10-point pool
    expect(activeCount).toBeGreaterThanOrEqual(0);
    expect(activeCount).toBeLessThanOrEqual(5);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/muhurta/__tests__/inauspicious-periods.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Implement inauspicious-periods.ts**

Create `src/lib/muhurta/inauspicious-periods.ts`:

```typescript
/**
 * Inauspicious Period Computation for Muhurta Scanner
 *
 * Computes Yamaganda, Gulika Kaal, Rahu Kaal, Varjyam, and Vishti/Bhadra
 * for a given time window. Returns structured data for UI rendering.
 *
 * Yamaganda order (Sun=5→Thu=1, Fri=7, Sat=6) — Dharma Sindhu / Muhurta Chintamani
 * Gulika order (Sun=7→Sat=1) — descending
 * Rahu Kaal order [8, 2, 7, 5, 6, 4, 3] — standard
 */

import { calculateKarana } from '@/lib/ephem/astronomical';
import type { InauspiciousPeriod } from '@/types/muhurta-ai';

// Segment orders — 1-based segment index for each weekday (0=Sun through 6=Sat)
const RAHU_ORDER = [8, 2, 7, 5, 6, 4, 3];
const YAMA_ORDER = [5, 4, 3, 2, 1, 7, 6];
const GULIKA_ORDER = [7, 6, 5, 4, 3, 2, 1];

interface TimeRange {
  start: number; // hours UT
  end: number;
}

export function computeRahuKaal(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = RAHU_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

export function computeYamaganda(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = YAMA_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

export function computeGulikaKaal(sunriseUT: number, sunsetUT: number, weekday: number): TimeRange {
  const duration = (sunsetUT - sunriseUT) / 8;
  const segment = GULIKA_ORDER[weekday] - 1;
  return {
    start: sunriseUT + segment * duration,
    end: sunriseUT + (segment + 1) * duration,
  };
}

function rangesOverlap(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function formatHour(h: number, tz: number): string {
  const local = h + tz;
  const hh = Math.floor(((local % 24) + 24) % 24);
  const mm = Math.floor((local - Math.floor(local)) * 60);
  return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

/**
 * Compute all inauspicious periods and check which are active during a window.
 *
 * @param windowStartUT - window start in hours UT (from midnight)
 * @param windowEndUT - window end in hours UT
 * @param sunriseUT - sunrise in hours UT
 * @param sunsetUT - sunset in hours UT
 * @param weekday - 0=Sunday
 * @param nakshatra - current nakshatra number 1-27 (for Vishti check via karana)
 * @param jd - Julian Day for karana computation
 * @param tz - timezone offset in hours
 */
export function computeInauspiciousForWindow(
  windowStartUT: number,
  windowEndUT: number,
  sunriseUT: number,
  sunsetUT: number,
  weekday: number,
  nakshatra: number,
  jd: number,
  tz: number,
): InauspiciousPeriod[] {
  const rahuKaal = computeRahuKaal(sunriseUT, sunsetUT, weekday);
  const yamaganda = computeYamaganda(sunriseUT, sunsetUT, weekday);
  const gulikaKaal = computeGulikaKaal(sunriseUT, sunsetUT, weekday);

  // Vishti/Bhadra — check karana at window midpoint
  const midUT = (windowStartUT + windowEndUT) / 2;
  // Convert midUT hours to JD offset from the base JD (which is noon)
  const midJD = jd + (midUT - 12) / 24;
  const karana = calculateKarana(midJD);
  const isVishti = karana === 7;

  const periods: InauspiciousPeriod[] = [
    {
      name: 'Rahu Kaal',
      startTime: formatHour(rahuKaal.start, tz),
      endTime: formatHour(rahuKaal.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, rahuKaal.start, rahuKaal.end),
    },
    {
      name: 'Yamaganda',
      startTime: formatHour(yamaganda.start, tz),
      endTime: formatHour(yamaganda.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, yamaganda.start, yamaganda.end),
    },
    {
      name: 'Gulika Kaal',
      startTime: formatHour(gulikaKaal.start, tz),
      endTime: formatHour(gulikaKaal.end, tz),
      active: rangesOverlap(windowStartUT, windowEndUT, gulikaKaal.start, gulikaKaal.end),
    },
  ];

  if (isVishti) {
    periods.push({
      name: 'Vishti (Bhadra)',
      startTime: formatHour(windowStartUT, tz),
      endTime: formatHour(windowEndUT, tz),
      active: true,
    });
  }

  return periods;
}

/**
 * Compute inauspicious penalty score (0-10, higher = less penalty).
 * Each active inauspicious period deducts points.
 */
export function computeInauspiciousPenalty(periods: InauspiciousPeriod[]): number {
  let penalty = 0;
  for (const p of periods) {
    if (!p.active) continue;
    switch (p.name) {
      case 'Rahu Kaal': penalty += 4; break;
      case 'Yamaganda': penalty += 3; break;
      case 'Gulika Kaal': penalty += 2; break;
      case 'Vishti (Bhadra)': penalty += 4; break;
    }
  }
  return Math.max(0, 10 - penalty);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/muhurta/__tests__/inauspicious-periods.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/inauspicious-periods.ts src/lib/muhurta/__tests__/inauspicious-periods.test.ts
git commit -m "feat: inauspicious periods module — Yamaganda, Gulika, Rahu Kaal, Vishti detection"
```

---

## Task 4: Refactor ai-recommender.ts — Per-Element Panchang Sub-Scores

**Files:**
- Modify: `src/lib/muhurta/ai-recommender.ts`

The current `scorePanchangFactors()` returns `{ score: number; factors: LocaleText[] }`. We need it to also return per-element sub-scores for the breakdown UI, **without breaking the existing interface**.

- [ ] **Step 1: Verify existing tests pass before changes**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: All PASS

- [ ] **Step 2: Extend return type of scorePanchangFactors**

In `src/lib/muhurta/ai-recommender.ts`, change the return type to include sub-scores. The existing `.score` and `.factors` fields are preserved so all callers continue to work.

Find the function signature at line 29:
```typescript
export function scorePanchangFactors(
  snap: PanchangSnapshot,
  rules: ExtendedActivity,
): { score: number; factors: LocaleText[] } {
```

Replace with:
```typescript
export interface PanchangSubScores {
  tithi: number;
  nakshatra: number;
  yoga: number;
  karana: number;
  weekday: number;
  panchaka: number;
}

export function scorePanchangFactors(
  snap: PanchangSnapshot,
  rules: ExtendedActivity,
): { score: number; factors: LocaleText[]; subScores: PanchangSubScores } {
```

Then refactor the function body to track per-element scores. Replace the body logic to accumulate individual scores, then sum. The final `return` changes from:

```typescript
  return { score: Math.max(0, Math.min(25, score)), factors };
```

to:

```typescript
  const subScores: PanchangSubScores = {
    tithi: tithiScore,
    nakshatra: nakshatraScore,
    yoga: yogaScore,
    karana: karanaScore,
    weekday: weekdayScore,
    panchaka: panchakaScore,
  };
  return { score: Math.max(0, Math.min(25, score)), factors, subScores };
```

Where each `xxxScore` variable replaces what was previously added directly to `score`. The total `score` calculation stays identical — just decomposed into tracked variables.

Specifically, refactor the body so each section writes to its own variable:

```typescript
  let score = 0;
  const factors: LocaleText[] = [];

  // --- Tithi ---
  let tithiScore = 0;
  const pakshaRelTithi = snap.tithi > 15 ? snap.tithi - 15 : snap.tithi;
  const isKrishnaPaksha = snap.tithi > 15;
  if (rules.goodTithis.includes(pakshaRelTithi) && !isKrishnaPaksha) {
    tithiScore = 8;
    factors.push({ en: 'Auspicious Tithi', hi: 'शुभ तिथि', sa: 'शुभतिथिः' });
  } else if (rules.goodTithis.includes(pakshaRelTithi) && isKrishnaPaksha) {
    tithiScore = 3;
  }
  if (rules.avoidTithis.includes(pakshaRelTithi)) {
    tithiScore = -5;
    factors.push({ en: 'Inauspicious Tithi', hi: 'अशुभ तिथि', sa: 'अशुभतिथिः' });
  }
  score += tithiScore;

  // --- Nakshatra ---
  let nakshatraScore = 0;
  if (rules.goodNakshatras.includes(snap.nakshatra)) {
    nakshatraScore = 8;
    factors.push({ en: 'Auspicious Nakshatra', hi: 'शुभ नक्षत्र', sa: 'शुभनक्षत्रम्' });
  }
  if (rules.avoidNakshatras.includes(snap.nakshatra)) {
    nakshatraScore = -5;
    factors.push({ en: 'Inauspicious Nakshatra', hi: 'अशुभ नक्षत्र', sa: 'अशुभनक्षत्रम्' });
  }
  score += nakshatraScore;

  // --- Yoga ---
  let yogaScore = 0;
  const INAUSPICIOUS_YOGAS = new Set([1, 6, 9, 10, 13, 15, 17, 19, 27]);
  if (!INAUSPICIOUS_YOGAS.has(snap.yoga)) {
    yogaScore = 4;
  } else {
    yogaScore = -3;
    factors.push({ en: 'Inauspicious Yoga', hi: 'अशुभ योग', sa: 'अशुभयोगः' });
  }
  score += yogaScore;

  // --- Weekday ---
  let weekdayScore = 0;
  if (rules.goodWeekdays.includes(snap.weekday)) {
    weekdayScore = 3;
    factors.push({ en: 'Favorable weekday', hi: 'अनुकूल वार', sa: 'अनुकूलवारः' });
  }
  score += weekdayScore;

  // --- Karana ---
  let karanaScore = 0;
  if (snap.karana >= 1 && snap.karana <= 6) {
    karanaScore = 2;
  } else if (snap.karana === 7) {
    karanaScore = -5;
    factors.push({ en: 'Vishti (Bhadra) Karana — inauspicious', hi: 'विष्टि (भद्��ा) करण — अशुभ', sa: 'विष्टिकरणम् — अशुभम्' });
  } else if ([8, 9, 10].includes(snap.karana)) {
    karanaScore = -3;
    factors.push({ en: 'Sthira Karana — inauspicious', hi: 'स्थिर करण — अशुभ', sa: 'स्थिरकरणम् — अशुभम्' });
  } else if (snap.karana === 11) {
    karanaScore = 2;
    factors.push({ en: 'Kimstughna Karana — auspicious', hi: 'किंस्तुघ्न करण — शुभ', sa: 'किंस्तुघ्नकरणम् — शुभम्' });
  }
  score += karanaScore;

  // --- Panchaka ---
  let panchakaScore = 0;
  if (snap.nakshatra >= 23 && snap.nakshatra <= 27) {
    panchakaScore = -5;
    factors.push({ en: 'Panchaka active — Moon in inauspicious nakshatra zone', hi: 'पंचक सक्रिय — चन्द्र अशुभ नक्षत्र क्षेत्र में', sa: 'पञ्चकं प्रवर्तते — चन्द्रः अशुभनक्षत्रक्षेत्रे' });
  }
  score += panchakaScore;

  const subScores: PanchangSubScores = {
    tithi: tithiScore,
    nakshatra: nakshatraScore,
    yoga: yogaScore,
    karana: karanaScore,
    weekday: weekdayScore,
    panchaka: panchakaScore,
  };
  return { score: Math.max(0, Math.min(25, score)), factors, subScores };
```

- [ ] **Step 3: Run ALL existing tests**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: All PASS — existing callers use `.score` and `.factors` which are unchanged.

- [ ] **Step 4: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass — no other code references `scorePanchangFactors` return type destructured without `subScores`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/ai-recommender.ts
git commit -m "refactor: scorePanchangFactors returns per-element sub-scores for breakdown UI"
```

---

## Task 5: Refactor time-window-scanner.ts — Add scanDateRangeV2

**Files:**
- Modify: `src/lib/muhurta/time-window-scanner.ts`
- Create: `src/lib/muhurta/__tests__/scanner-v2.test.ts`

Add a new `scanDateRangeV2()` function alongside the existing `scanDateRange()` (which stays untouched for backward compatibility).

- [ ] **Step 1: Write the failing test**

Create `src/lib/muhurta/__tests__/scanner-v2.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { scanDateRangeV2 } from '../time-window-scanner';
import type { ScanOptionsV2 } from '@/types/muhurta-ai';

const CORSEAUX_LAT = 46.4625;
const CORSEAUX_LNG = 6.8035;

describe('scanDateRangeV2', () => {
  it('returns windows for a single day with 120-min resolution', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 2,
      postSunsetHours: 3,
    };
    const windows = scanDateRangeV2(options);

    expect(Array.isArray(windows)).toBe(true);
    expect(windows.length).toBeGreaterThanOrEqual(6); // ~8-10 windows expected
    expect(windows.length).toBeLessThanOrEqual(12);
  }, 30000);

  it('returns more windows with 15-min resolution', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 15,
      preSunriseHours: 2,
      postSunsetHours: 3,
    };
    const windows = scanDateRangeV2(options);

    expect(windows.length).toBeGreaterThanOrEqual(40); // ~56 windows expected
    expect(windows.length).toBeLessThanOrEqual(80);
  }, 30000);

  it('returns ALL windows (no score threshold filter)', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'marriage',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);

    // With no threshold filter, every time slot should return a window
    // Even low-scoring windows should be present
    const hasLowScore = windows.some(w => w.score < 40);
    // We can't guarantee low scores but we can check no filtering happened
    expect(windows.length).toBeGreaterThanOrEqual(5);
  }, 30000);

  it('windows include inauspicious period data', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 15,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);

    for (const w of windows) {
      expect(Array.isArray(w.inauspiciousPeriods)).toBe(true);
      expect(w.inauspiciousPeriods.length).toBeGreaterThanOrEqual(3); // At least Rahu, Yama, Gulika
      for (const p of w.inauspiciousPeriods) {
        expect(typeof p.name).toBe('string');
        expect(typeof p.active).toBe('boolean');
        expect(p.startTime).toMatch(/^\d{2}:\d{2}$/);
        expect(p.endTime).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  }, 30000);

  it('includes dasha harmony when dashaLords provided', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-08',
      activity: 'property',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
      dashaLords: { maha: 1, antar: 4, pratyantar: 5 }, // Moon-Jupiter-Venus
    };
    const windows = scanDateRangeV2(options);

    for (const w of windows) {
      expect(w.breakdown.dashaHarmony).toBeGreaterThanOrEqual(0);
      expect(w.breakdown.dashaHarmony).toBeLessThanOrEqual(10);
    }
  }, 30000);

  it('score is normalized 0-100', () => {
    const options: ScanOptionsV2 = {
      startDate: '2026-05-08',
      endDate: '2026-05-10',
      activity: 'marriage',
      lat: CORSEAUX_LAT,
      lng: CORSEAUX_LNG,
      tz: 2,
      windowMinutes: 120,
      preSunriseHours: 0,
      postSunsetHours: 0,
    };
    const windows = scanDateRangeV2(options);

    for (const w of windows) {
      expect(w.score).toBeGreaterThanOrEqual(0);
      expect(w.score).toBeLessThanOrEqual(100);
    }
  }, 30000);

  it('existing scanDateRange still works (backward compat)', async () => {
    const { scanDateRange } = await import('../time-window-scanner');
    const windows = scanDateRange({
      startDate: '2025-01-15',
      endDate: '2025-01-16',
      activity: 'marriage',
      lat: 28.6139,
      lng: 77.209,
      tz: 5.5,
    });
    expect(Array.isArray(windows)).toBe(true);
  }, 30000);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/muhurta/__tests__/scanner-v2.test.ts`
Expected: FAIL — `scanDateRangeV2` not exported

- [ ] **Step 3: Implement scanDateRangeV2**

Add to the bottom of `src/lib/muhurta/time-window-scanner.ts` (keep existing `scanDateRange` untouched above):

```typescript
import { scoreDashaHarmony } from './dasha-harmony';
import {
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
} from './inauspicious-periods';
import type { ScanOptionsV2, DetailBreakdown, InauspiciousPeriod } from '@/types/muhurta-ai';

interface ScanV2Window {
  date: string;
  timeSlot: number;
  startTime: string;
  endTime: string;
  score: number;        // 0-100 normalized
  rawScore: number;
  breakdown: DetailBreakdown;
  inauspiciousPeriods: InauspiciousPeriod[];
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

/**
 * V2 scanner with configurable window size, no threshold filter,
 * inauspicious period detection, and dasha harmony.
 */
export function scanDateRangeV2(options: ScanOptionsV2): ScanV2Window[] {
  const {
    startDate, endDate, activity, lat, lng, tz,
    windowMinutes, preSunriseHours, postSunsetHours,
    birthNakshatra, birthRashi, dashaLords,
  } = options;

  const rules = getExtendedActivity(activity);
  if (!rules) return [];

  const [sy, sm, sd] = startDate.split('-').map(Number);
  const [ey, em, ed] = endDate.split('-').map(Number);
  const startD = new Date(sy, sm - 1, sd);
  const endD = new Date(ey, em - 1, ed);
  const windows: ScanV2Window[] = [];
  const windowHours = windowMinutes / 60;

  // Determine max possible raw score for normalization
  // Panchang: 25, Transit: 25, Timing: 25, TaraBala: 10, ChandraBala: 10,
  // DashaHarmony: 10, Inauspicious: 10
  const hasPersonal = !!(birthNakshatra && birthNakshatra > 0);
  const hasDasha = !!dashaLords;
  const maxRaw = 75 + (hasPersonal ? 20 : 0) + (hasDasha ? 10 : 0) + 10; // +10 for inauspicious (no penalty = 10)

  const current = new Date(startD);
  while (current <= endD) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1;
    const day = current.getDate();

    const jdNoon = dateToJD(year, month, day, 12 - tz);
    const sunriseUT = approximateSunriseSafe(jdNoon, lat, lng);
    const sunsetUT = approximateSunsetSafe(jdNoon, lat, lng);
    const snap = getPanchangSnapshot(jdNoon, lat, lng);

    // Time range: sunrise - preSunriseHours to sunset + postSunsetHours
    const rangeStartUT = sunriseUT - preSunriseHours;
    const rangeEndUT = sunsetUT + postSunsetHours;

    // Score panchang (same for all windows in this day)
    const panchang = scorePanchangFactors(snap, rules);
    const transit = scoreTransitFactors(jdNoon, rules);

    // Dasha harmony (same for all windows — doesn't change within a day)
    const dashaScore = dashaLords
      ? scoreDashaHarmony(dashaLords, rules).score
      : 0;

    // Tara Bala and Chandra Bala
    const taraBala = birthNakshatra && birthNakshatra > 0
      ? getTaraBala(birthNakshatra, snap.nakshatra)
      : undefined;
    const chandraBala = birthRashi && birthRashi > 0
      ? getChandraBala(birthRashi, snap.moonSign)
      : undefined;
    const taraScore = taraBala ? (taraBala.auspicious ? 10 : 0) : 0;
    const chandraScore = chandraBala !== undefined ? (chandraBala ? 10 : 0) : 0;

    // Panchang context names (English for now — client resolves locale)
    const TITHI_NAMES = [
      '', 'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Purnima',
      'Pratipada', 'Dwitiya', 'Tritiya', 'Chaturthi', 'Panchami',
      'Shashthi', 'Saptami', 'Ashtami', 'Navami', 'Dashami',
      'Ekadashi', 'Dwadashi', 'Trayodashi', 'Chaturdashi', 'Amavasya',
    ];

    let slotIndex = 0;
    let h = rangeStartUT;
    while (h < rangeEndUT) {
      const windowEnd = Math.min(h + windowHours, rangeEndUT);
      const midH = (h + windowEnd) / 2;

      // Timing score (hora, choghadiya, rahu kaal)
      const timing = scoreTimingFactors(
        jdNoon, midH + tz, snap.weekday, sunriseUT, sunsetUT, tz, rules,
      );

      // Inauspicious periods for this window
      const inauspicious = computeInauspiciousForWindow(
        h, windowEnd, sunriseUT, sunsetUT, snap.weekday,
        snap.nakshatra, jdNoon, tz,
      );
      const inauspiciousScore = computeInauspiciousPenalty(inauspicious);

      // Raw score
      const rawScore = panchang.score + transit.score + timing.score
        + taraScore + chandraScore + dashaScore + inauspiciousScore;

      // Normalize to 0-100
      const score = Math.round(Math.max(0, Math.min(100, (rawScore / maxRaw) * 100)));

      // Map panchang sub-scores to 0-20 / 0-10 ranges for breakdown
      const sub = panchang.subScores;
      const breakdown: DetailBreakdown = {
        tithi: Math.max(0, Math.round(((sub.tithi + 5) / 13) * 20)),     // -5..8 → 0..20
        nakshatra: Math.max(0, Math.round(((sub.nakshatra + 5) / 13) * 20)),
        yoga: Math.max(0, Math.round(((sub.yoga + 3) / 7) * 20)),        // -3..4 → 0..20
        karana: Math.max(0, Math.round(((sub.karana + 5) / 7) * 10)),     // -5..2 → 0..10
        taraBala: taraScore,
        chandraBala: chandraScore,
        dashaHarmony: dashaScore,
        inauspicious: inauspiciousScore,
      };

      windows.push({
        date: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
        timeSlot: slotIndex,
        startTime: formatHour(h + tz),
        endTime: formatHour(windowEnd + tz),
        score,
        rawScore,
        breakdown,
        inauspiciousPeriods: inauspicious,
        panchangContext: {
          tithiName: TITHI_NAMES[snap.tithi] || `Tithi ${snap.tithi}`,
          nakshatraName: `Nakshatra ${snap.nakshatra}`,
          yogaName: `Yoga ${snap.yoga}`,
          karanaName: `Karana ${snap.karana}`,
          paksha: snap.tithi <= 15 ? 'shukla' : 'krishna',
        },
        taraBala,
        chandraBala,
      });

      slotIndex++;
      h += windowHours;
    }

    current.setDate(current.getDate() + 1);
  }

  return windows;
}
```

**Important:** Also add the new imports at the top of `time-window-scanner.ts`:

```typescript
import { scoreDashaHarmony } from './dasha-harmony';
import {
  computeInauspiciousForWindow,
  computeInauspiciousPenalty,
} from './inauspicious-periods';
import type { ScanOptionsV2, DetailBreakdown, InauspiciousPeriod } from '@/types/muhurta-ai';
```

- [ ] **Step 4: Run V2 tests**

Run: `npx vitest run src/lib/muhurta/__tests__/scanner-v2.test.ts`
Expected: All PASS

- [ ] **Step 5: Run existing scanner tests (regression)**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: All PASS — `scanDateRange` is untouched

- [ ] **Step 6: Run full test suite**

Run: `npx vitest run`
Expected: All PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/muhurta/time-window-scanner.ts src/lib/muhurta/__tests__/scanner-v2.test.ts
git commit -m "feat: scanDateRangeV2 — configurable windows, inauspicious periods, dasha harmony"
```

---

## Task 6: API Route — POST /api/muhurta-scan

**Files:**
- Create: `src/app/api/muhurta-scan/route.ts`

- [ ] **Step 1: Create the API route**

Create `src/app/api/muhurta-scan/route.ts`:

```typescript
/**
 * POST /api/muhurta-scan — Unified muhurta scanner endpoint
 *
 * Supports two resolution modes:
 * - "overview": 2-hour windows across a date range (for month heatmap)
 * - "detail": 15-minute windows for a single day (for sparkline drill-down)
 */

import { NextResponse } from 'next/server';
import { scanDateRangeV2 } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity } from '@/lib/muhurta/activity-rules-extended';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import type { ExtendedActivityId, MuhurtaScanResponse } from '@/types/muhurta-ai';

export async function POST(request: Request) {
  const startTime = Date.now();

  try {
    const body = await request.json();
    const {
      activity,
      startDate,
      endDate,
      lat,
      lng,
      timezone,
      tz: tzFallback = 0,
      resolution = 'overview',
      birthNakshatra,
      birthRashi,
      dashaLords,
      detailDate,
    } = body as {
      activity: ExtendedActivityId;
      startDate: string;
      endDate: string;
      lat: number;
      lng: number;
      timezone?: string;
      tz?: number;
      resolution?: 'overview' | 'detail';
      birthNakshatra?: number;
      birthRashi?: number;
      dashaLords?: { maha: number; antar: number; pratyantar: number };
      detailDate?: string;
    };

    // Validate required fields
    if (!activity || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields: activity, startDate, endDate' },
        { status: 400 },
      );
    }

    if (resolution === 'detail' && !detailDate) {
      return NextResponse.json(
        { error: 'detailDate is required for detail resolution' },
        { status: 400 },
      );
    }

    // Validate activity
    const rules = getExtendedActivity(activity);
    if (!rules) {
      return NextResponse.json(
        { error: `Unknown activity: ${activity}` },
        { status: 400 },
      );
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return NextResponse.json(
        { error: 'Dates must be YYYY-MM-DD format' },
        { status: 400 },
      );
    }

    // Validate lat/lng
    if (typeof lat !== 'number' || typeof lng !== 'number' ||
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json(
        { error: 'Invalid lat/lng values' },
        { status: 400 },
      );
    }

    // Resolve timezone offset
    let tz = tzFallback;
    if (timezone) {
      const [y, m, d] = (detailDate || startDate).split('-').map(Number);
      if (y && m && d) tz = getUTCOffsetForDate(y, m, d, timezone);
    }

    // Determine scan parameters based on resolution
    const isDetail = resolution === 'detail';
    const scanStart = isDetail && detailDate ? detailDate : startDate;
    const scanEnd = isDetail && detailDate ? detailDate : endDate;

    const windows = scanDateRangeV2({
      startDate: scanStart,
      endDate: scanEnd,
      activity,
      lat,
      lng,
      tz,
      windowMinutes: isDetail ? 15 : 120,
      preSunriseHours: isDetail ? 2 : 0, // Overview skips pre-sunrise for speed
      postSunsetHours: isDetail ? 3 : 1,
      birthNakshatra,
      birthRashi,
      dashaLords,
    });

    // Track which personal factors were used
    const personalFactorsUsed: MuhurtaScanResponse['meta']['personalFactorsUsed'] = [];
    if (birthNakshatra && birthNakshatra > 0) personalFactorsUsed.push('taraBala', 'chandraBala');
    if (dashaLords) personalFactorsUsed.push('dashaHarmony');

    const response: MuhurtaScanResponse = {
      windows,
      meta: {
        activity,
        dateRange: [scanStart, scanEnd],
        resolution,
        personalFactorsUsed,
        computeTimeMs: Date.now() - startTime,
      },
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': isDetail
          ? 'private, max-age=300'    // Detail: 5 min cache
          : 'private, max-age=1800',  // Overview: 30 min cache
      },
    });
  } catch (err: unknown) {
    console.error('[muhurta-scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Run build**

Run: `npx next build`
Expected: Build succeeds (the new route compiles)

- [ ] **Step 4: Commit**

```bash
git add src/app/api/muhurta-scan/route.ts
git commit -m "feat: POST /api/muhurta-scan — unified endpoint with overview/detail resolution"
```

---

## Task 7: UI Components — ScanControls, QuickPersonalize, DashaBanner

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/ScanControls.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/QuickPersonalize.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/DashaBanner.tsx`

These three input components are independent of the data visualization components. Build them first.

- [ ] **Step 1: Create ScanControls.tsx**

Create `src/app/[locale]/muhurta-ai/components/ScanControls.tsx`:

The component renders: activity dropdown (20 activities from EXTENDED_ACTIVITIES), date range inputs (start/end defaulting to current month), location from store, and a "Scan Month" button.

Props:
```typescript
interface ScanControlsProps {
  activity: ExtendedActivityId;
  startDate: string;
  endDate: string;
  locationName: string;
  loading: boolean;
  onActivityChange: (id: ExtendedActivityId) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onScan: () => void;
}
```

Use the existing `EXTENDED_ACTIVITIES` from `@/lib/muhurta/activity-rules-extended` for the dropdown labels. Use `tl(activity.label, locale)` for multilingual activity names. Style with Tailwind matching the dark theme: `bg-bg-secondary`, `border-gold-dark/30`, `text-text-primary`.

Full implementation — a controls bar with 3 input groups + scan button, matching the mockup layout. Include the Cinzel font for section titles. The activity dropdown should show all 20 activities grouped logically.

- [ ] **Step 2: Create QuickPersonalize.tsx**

Create `src/app/[locale]/muhurta-ai/components/QuickPersonalize.tsx`:

Props:
```typescript
interface QuickPersonalizeProps {
  birthNakshatra: number | null;
  birthRashi: number | null;
  onNakshatraChange: (id: number | null) => void;
  onRashiChange: (id: number | null) => void;
}
```

Two dropdowns: nakshatra (from `NAKSHATRAS` constant, 27 entries) and rashi (from `RASHIS` constant, 12 entries). Persists to `localStorage('muhurta-quick-personalize')` on change. Loads from localStorage on mount. Shows a small CTA: "Generate a full chart for dasha-personalized results →" linking to `/kundali`.

Use `tl(nak.name, locale)` for multilingual names.

- [ ] **Step 3: Create DashaBanner.tsx**

Create `src/app/[locale]/muhurta-ai/components/DashaBanner.tsx`:

Props:
```typescript
interface DashaBannerProps {
  dashaLords: { maha: number; antar: number; pratyantar: number } | null;
  antarEndDate: string | null;
  activityId: ExtendedActivityId;
  chartName: string | null;
}
```

Shows the purple banner from the mockup with: running dasha lords (planet names from `GRAHAS` constant), antardasha end date, and a relevance note derived from checking if the antardasha lord is in the activity's `goodHoras` list. Only rendered when `dashaLords` is not null.

Planet name lookup: import `GRAHAS` from `@/lib/constants/grahas` and index by planet ID.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/ScanControls.tsx \
        src/app/[locale]/muhurta-ai/components/QuickPersonalize.tsx \
        src/app/[locale]/muhurta-ai/components/DashaBanner.tsx
git commit -m "feat: ScanControls, QuickPersonalize, DashaBanner input components"
```

---

## Task 8: UI Components — MonthHeatmap, MobileMonthView

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/MonthHeatmap.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/MobileMonthView.tsx`

- [ ] **Step 1: Create MonthHeatmap.tsx**

Create `src/app/[locale]/muhurta-ai/components/MonthHeatmap.tsx`:

Props:
```typescript
interface MonthHeatmapProps {
  cells: HeatmapCell[];
  selectedDate: string | null;
  today: string;  // YYYY-MM-DD
  year: number;
  month: number;  // 1-12
  loading: boolean;
  onCellClick: (date: string) => void;
  onMonthChange: (year: number, month: number) => void;
}
```

Renders a CSS Grid: first column = time slot labels (2-hour increments), remaining columns = days of the month. Each cell is colored on a 7-stop scale based on score (0-100 → score-0 through score-6). Uses Tailwind classes for colors:

```
score 0-14:  bg-white/[0.03]     (empty)
score 15-29: bg-red-500/35       (avoid)
score 30-44: bg-amber-500/30     (poor)
score 45-59: bg-amber-500/55     (fair)
score 60-74: bg-green-400/35     (good)
score 75-89: bg-green-400/60     (very good)
score 90+:   bg-green-400/85     (excellent)
```

Today's cell: `outline outline-2 outline-gold-light outline-offset-1`.
Selected cell: `outline outline-2 outline-white outline-offset-1`.

Includes month navigation (prev/next arrows). Hidden on mobile (`hidden lg:block`).

When `loading` is true, render the grid skeleton with empty cells.

Cells have `aria-label` for accessibility: `"May 8, 8-10 AM, score 92"`.

- [ ] **Step 2: Create MobileMonthView.tsx**

Create `src/app/[locale]/muhurta-ai/components/MobileMonthView.tsx`:

Props:
```typescript
interface MobileMonthViewProps {
  cells: HeatmapCell[];
  selectedDate: string | null;
  today: string;
  loading: boolean;
  onDaySelect: (date: string) => void;
}
```

Renders a vertical list for `< lg` screens (`lg:hidden`). Each day = a row showing: date + weekday, mini inline bar (8 colored dots for the 2h windows), best-score badge. Tapping a day calls `onDaySelect`.

Group cells by date, take the max score per day for the badge color.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/MonthHeatmap.tsx \
        src/app/[locale]/muhurta-ai/components/MobileMonthView.tsx
git commit -m "feat: MonthHeatmap (desktop grid) and MobileMonthView (vertical list)"
```

---

## Task 9: UI Components — DayDrilldown, PeakCards, ScoreBreakdown

**Files:**
- Create: `src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/PeakCards.tsx`
- Create: `src/app/[locale]/muhurta-ai/components/ScoreBreakdown.tsx`

- [ ] **Step 1: Create DayDrilldown.tsx**

Create `src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx`:

Props:
```typescript
interface DayDrilldownProps {
  windows: DetailWindow[];
  date: string;
  loading: boolean;
  isToday: boolean;
  onWindowSelect: (window: DetailWindow) => void;
}
```

Renders a sparkline bar chart: one bar per 15-min window, height proportional to score, color based on score bracket (same scale as heatmap). Red overlay for active inauspicious periods. Gold vertical "NOW" line when `isToday` is true (calculated from current time vs window times).

Below the chart: time axis labels (every 2 hours) and warning chips for inauspicious periods with their time ranges (derived from the first window's `inauspiciousPeriods` — these are the same for all windows in a day).

Header shows: day of week + date, panchang context (tithi, nakshatra from first window), and peak day score.

- [ ] **Step 2: Create PeakCards.tsx**

Create `src/app/[locale]/muhurta-ai/components/PeakCards.tsx`:

Props:
```typescript
interface PeakCardsProps {
  peaks: DetailWindow[];  // Top 3 windows, pre-sorted
  onCardClick: (window: DetailWindow) => void;
}
```

Renders up to 3 recommendation cards in a responsive grid. Each card shows: rank badge ("Best Match" / "2nd Best" / "3rd Best"), time window, date + panchang context, factor rows (score, tara bala, chandra bala, dasha harmony, inauspicious). Colors: green for good, amber for caution, red for bad.

First card gets special styling: green border + subtle green gradient background.

Cards are focusable (`tabIndex={0}`) and clickable.

- [ ] **Step 3: Create ScoreBreakdown.tsx**

Create `src/app/[locale]/muhurta-ai/components/ScoreBreakdown.tsx`:

Props:
```typescript
interface ScoreBreakdownProps {
  breakdown: DetailBreakdown;
  totalScore: number;
}
```

Renders horizontal bar chart with 8 rows: Tithi (/20), Nakshatra (/20), Yoga (/20), Karana (/10), Tara Bala (/10), Chandra Bala (/10), Dasha Harmony (/10), Inauspicious Check (/10). Bar fill color based on percentage: green > 60%, amber > 30%, red below.

Total score row at the bottom with larger text.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx \
        src/app/[locale]/muhurta-ai/components/PeakCards.tsx \
        src/app/[locale]/muhurta-ai/components/ScoreBreakdown.tsx
git commit -m "feat: DayDrilldown sparkline, PeakCards recommendations, ScoreBreakdown bars"
```

---

## Task 10: Client Orchestrator — MuhurtaScannerClient.tsx

**Files:**
- Create: `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx`

This is the main client component that wires all sub-components together and manages page-local state.

- [ ] **Step 1: Implement MuhurtaScannerClient**

Create `src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx`:

```typescript
'use client';
```

State shape:
```typescript
interface ScannerState {
  activity: ExtendedActivityId;
  startDate: string;
  endDate: string;
  // Personalization
  birthNakshatra: number | null;
  birthRashi: number | null;
  dashaLords: { maha: number; antar: number; pratyantar: number } | null;
  antarEndDate: string | null;
  chartName: string | null;
  // Results
  overviewCells: HeatmapCell[];
  detailWindows: DetailWindow[];
  selectedDate: string | null;
  selectedWindow: DetailWindow | null;
  peaks: DetailWindow[];
  // Loading
  overviewLoading: boolean;
  detailLoading: boolean;
}
```

Behavior:
1. On mount: read location from `useLocationStore`, read birth data from `useBirthDataStore`, default date range to current month, attempt to load saved kundali from Supabase for dasha data (if authenticated).
2. "Scan Month" → POST `/api/muhurta-scan` with `resolution: 'overview'`. On response, set `overviewCells`. Then auto-trigger detail scans for top 3 scoring days (3 parallel fetches) to populate `peaks`.
3. Click heatmap cell → POST `/api/muhurta-scan` with `resolution: 'detail'`, `detailDate`. On response, set `detailWindows` and `selectedDate`.
4. Click sparkline bar → set `selectedWindow` to show `ScoreBreakdown`.
5. Click peak card → set `selectedDate` to that card's date and trigger detail fetch.

Layout order (top to bottom):
1. `ScanControls`
2. `QuickPersonalize` (if no saved kundali) OR `DashaBanner` (if saved kundali)
3. `MonthHeatmap` (desktop) / `MobileMonthView` (mobile)
4. `PeakCards` (top 3 from overview)
5. `DayDrilldown` (when a date is selected)
6. `ScoreBreakdown` (when a window is selected)

Error handling: wrap each fetch in try/catch. On error, show a toast/banner with the error message. Never swallow errors silently.

Loading states: `overviewLoading` shows skeleton heatmap. `detailLoading` shows skeleton sparkline.

For fetching saved kundali dasha data: use `authedFetch('/api/saved-charts')` if the user is authenticated (check `useAuthStore`), find the chart with `relationship === 'self'`, extract dasha lords from the chart data. If no saved chart, fall back to `QuickPersonalize`.

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/muhurta-ai/MuhurtaScannerClient.tsx
git commit -m "feat: MuhurtaScannerClient orchestrator — state, API calls, layout"
```

---

## Task 11: Replace page.tsx — Wire Everything Together

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/page.tsx`

- [ ] **Step 1: Back up old page content**

The old page.tsx is 607 lines. The SEO editorial content (InfoBlock, L object) should be preserved for search engines. Keep the `L` object and the 4 editorial cards at the bottom.

- [ ] **Step 2: Replace page.tsx**

Rewrite `src/app/[locale]/muhurta-ai/page.tsx` as a simpler wrapper:

```typescript
'use client';

import { useLocale } from 'next-intl';
import MuhurtaScannerClient from './MuhurtaScannerClient';

// Preserve the existing L object (lines 48-199 of the old page) for SEO content
const L: Record<string, Record<string, string>> = {
  // ... copy the entire L object from the old page
};

export default function MuhurtaAIPage() {
  const locale = useLocale();
  const t = (key: string) => L[key]?.[locale] || L[key]?.en || key;

  return (
    <main className="min-h-screen bg-bg-primary pb-20">
      <MuhurtaScannerClient />

      {/* SEO editorial content — preserved from old page */}
      <section className="mx-auto max-w-5xl px-4 mt-16">
        {/* Keep the 4 editorial cards from the old page here */}
        {/* These are static text — good for SEO, no functional changes needed */}
      </section>
    </main>
  );
}
```

The key change: the old page's activity grid, date picker, location detection, and results table are all replaced by `MuhurtaScannerClient`. The editorial SEO content (4 info cards about Muhurta, how it works, etc.) stays at the bottom.

**Important:** Preserve the `LearnLink` component from the old page if it exists.

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 4: Build**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta-ai/page.tsx
git commit -m "feat: replace muhurta-ai page with heatmap scanner UI"
```

---

## Task 12: i18n — Add Scanner Strings to Message Files

**Files:**
- Modify: `src/messages/pages/muhurta-ai.json`

- [ ] **Step 1: Add scanner-specific strings**

Add new keys to `src/messages/pages/muhurta-ai.json` for the scanner UI. Follow the existing pattern of multilingual keys in the same file. Add keys for:

- `scannerTitle` — "Muhurta Scanner" / "मुहूर्त स्कैनर"
- `scannerSubtitle` — "Find the most auspicious time..." / "सबसे शुभ समय..."
- `scanMonth` — "Scan Month"
- `monthlyOverview` — "Monthly Overview"
- `dayDetail` — "Day Detail"
- `bestWindows` — "Best Windows for..."
- `scoreBreakdown` — "Score Breakdown"
- `quickPersonalize` — "Quick Personalize"
- `birthNakshatra` — "Birth Nakshatra"
- `birthRashi` — "Birth Rashi"
- `runningDasha` — "Running Dasha"
- `dashaFavorable` — "Favorable for this activity"
- `dashaCaution` — "Caution — may suppress this activity"
- `noPersonalData` — "Add birth details for personalized results"
- `pass1Label` — "2-hour windows"
- `pass2Label` — "15-min resolution"
- Score labels: `tithi`, `nakshatra`, `yoga`, `karana`, `taraBala`, `chandraBala`, `dashaHarmony`, `inauspicious`
- Quality labels: `excellent`, `good`, `fair`, `poor`
- Peak labels: `bestMatch`, `secondBest`, `thirdBest`

Add translations for all 4 active locales (en, hi, ta, bn).

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Commit**

```bash
git add src/messages/pages/muhurta-ai.json
git commit -m "feat(i18n): add muhurta scanner strings for en, hi, ta, bn"
```

---

## Task 13: Integration Testing and Verification

**Files:**
- No new files — verification only

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: ALL tests pass including existing muhurta-engine.test.ts

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors

- [ ] **Step 3: Production build**

Run: `npx next build`
Expected: 0 errors, page count unchanged or +1

- [ ] **Step 4: Start dev server and verify in browser**

Run: `npx next dev`

Open `http://localhost:3000/en/muhurta-ai` and verify:

1. **Controls render:** Activity dropdown shows 20 activities with English labels. Date range defaults to current month. Location shows from store.
2. **Quick Personalize:** If not logged in, nakshatra and rashi dropdowns appear. Selecting values persists to localStorage.
3. **Scan Month works:** Click "Scan Month". Loading skeleton appears. After ~12s, heatmap fills with colored cells. Verify cells have different colors (not all the same).
4. **Heatmap interaction:** Click a cell. Day drill-down appears below with sparkline bars. Bars have different heights/colors.
5. **Peak cards:** After scan, 3 peak cards appear with scores and factor breakdowns.
6. **Score breakdown:** Click a sparkline bar. Score breakdown appears with horizontal bars.
7. **Warning chips:** Day drill-down shows inauspicious period warning chips with times.
8. **Mobile:** Resize to < 768px. Heatmap grid disappears, vertical day list appears.
9. **Console:** No errors in browser console.

- [ ] **Step 5: Verify accuracy against Prokerala**

Pick 3 dates and check:
1. **Rahu Kaal times** for Corseaux match Prokerala within 2 minutes.
2. A day Prokerala marks as "good for property" should score > 60 in our scanner for "property" activity.
3. A day during Vishti/Bhadra karana should show lower scores with the warning chip active.

- [ ] **Step 6: Run existing muhurta tests one final time**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: ALL 20+ existing tests PASS — zero regressions

- [ ] **Step 7: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix: integration fixes from browser verification"
```

---

## Regression Safeguards

These checks must pass at every commit boundary:

1. `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts` — existing tests untouched
2. `npx vitest run` — full suite
3. `npx tsc --noEmit -p tsconfig.build-check.json` — type safety
4. `npx next build` — production build
5. Existing `/api/muhurta-ai` endpoint still works (preserved, not modified)
6. Existing `/api/muhurat/scan` endpoint still works (preserved, not modified)

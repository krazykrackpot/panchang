# Muhurta Engine — Plan B: Unified Scanner + Adapters + Wiring

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace 3 fragmented scanners with a single unified scanner powered by the muhurta engine (Plan A), wire it to all 7 production callers via backward-compatible adapters.

**Architecture:** The unified scanner iterates windows across a date range, builds RuleContext per window, evaluates via the engine, and returns `ScoredWindow[]`. Three thin adapters map `ScoredWindow` to the legacy formats expected by V1, V2, and SmartSearch callers. Two-pass mode (coarse→fine) for large date ranges.

**Tech Stack:** TypeScript, Vitest

**Spec:** `docs/superpowers/specs/2026-05-05-muhurta-scanner-unification-design.md`
**Depends on:** Plan A (engine core) — already complete.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/muhurta/engine/scanner.ts` | Unified scanner: date iteration, window generation, two-pass |
| Create | `src/lib/muhurta/engine/adapters.ts` | V1/V2/SmartSearch format converters |
| Modify | `src/lib/muhurta/time-window-scanner.ts` | Replace body of scanDateRange + scanDateRangeV2 with adapter calls |
| Modify | `src/lib/muhurta/smart-search.ts` | Replace smartMuhurtaSearch with adapter call |
| Create | `src/lib/__tests__/muhurta-scanner-unified.test.ts` | Scanner + adapter tests |

---

## Task 1: Unified Scanner

**Files:**
- Create: `src/lib/muhurta/engine/scanner.ts`

- [ ] **Step 1: Create the unified scanner**

The scanner function:
```typescript
export function unifiedScan(options: UnifiedScanOptions): ScoredWindow[]
```

It must:
1. Parse start/end dates, iterate each day
2. For each day, call `buildDayContext()` (cached per day)
3. Run day-level rules via `evaluateWindow()` with a dummy window context — if vetoed, skip the day entirely
4. Generate windows based on `windowMinutes` (default 90), `preSunriseHours`, `postSunsetHours`
5. For each window, call `buildWindowContext()` then `evaluateWindow()`
6. Optionally generate verdicts when `includeVerdicts: true`
7. Filter by `minScore`, sort by score descending, limit by `maxResults`
8. Return `ScoredWindow[]`

Two-pass mode (`twoPass: true`):
- Pass 1: sample 6 points per day, run only panchanga rules (register temporarily), keep top N days
- Pass 2: full evaluation on promoted days only

The `ScoredWindow` interface (from the spec):
```typescript
export interface ScoredWindow {
  date: string;
  startTime: string;
  endTime: string;
  timeSlot: number;
  score: number;
  rawScore: number;
  grade: MuhurtaGrade;
  breakdown: WindowBreakdown;
  panchangContext: {
    tithiName: string;
    nakshatraName: string;
    yogaName: string;
    karanaName: string;
    paksha: 'shukla' | 'krishna';
    lagnaSign?: string;
    horaLord?: string;
  };
  factors: ResolvedAssessment[];
  cancellations: Cancellation[];
  inauspiciousPeriods: InauspiciousPeriod[];
  specialYogas: string[];
  taraBala?: { tara: number; name: string; auspicious: boolean };
  chandraBala?: boolean;
  verdict?: MuhurtaVerdict;
  dayVetoes?: RuleAssessment[];
}

export interface UnifiedScanOptions {
  startDate: string;
  endDate: string;
  activity: ExtendedActivityId;
  lat: number;
  lng: number;
  tz: number;
  windowMinutes: number;
  preSunriseHours?: number;
  postSunsetHours?: number;
  birthNakshatra?: number;
  birthRashi?: number;
  dashaLords?: { maha: number; antar: number; pratyantar: number };
  maxResults?: number;
  minScore?: number;
  twoPass?: boolean;
  twoPassTopDays?: number;
  includeVerdicts?: boolean;
}
```

For `panchangContext` names: import `TITHIS` from `@/lib/constants/tithis`, `NAKSHATRAS` from `@/lib/constants/nakshatras`, `YOGAS` from `@/lib/constants/yogas`, `KARANAS` from `@/lib/constants/karanas`, `RASHIS` from `@/lib/constants/rashis`. Use `.name.en` for string values.

For `inauspiciousPeriods`: call `computeInauspiciousForWindow()` from `@/lib/muhurta/inauspicious-periods` for display data (this is separate from the rule-based scoring — the display data shows times, the rules produce scores).

For `taraBala` and `chandraBala`: extract from the rule assessments (find assessments with ruleId `'tara-bala'` and `'chandra-bala'`).

Format time strings as `HH:MM` from UT hours: `const hh = Math.floor(((h + tz) % 24 + 24) % 24); const mm = Math.floor(((h + tz) - Math.floor(h + tz)) * 60);`

- [ ] **Step 2: Write scanner tests**

Create `src/lib/__tests__/muhurta-scanner-unified.test.ts`:
- Test 1: scan a single day, verify windows are returned with valid scores
- Test 2: scan with minScore=50, verify filtered
- Test 3: scan with maxResults=3, verify limited
- Test 4: verify day-level veto (combust date) returns no windows
- Test 5: verify panchangContext has non-empty names

- [ ] **Step 3: Run tests**

```bash
npx vitest run src/lib/__tests__/muhurta-scanner-unified.test.ts
npx vitest run
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/engine/scanner.ts src/lib/__tests__/muhurta-scanner-unified.test.ts
git commit -m "feat(muhurta-engine): unified scanner with two-pass support

Single scan function replaces 3 legacy scanners. Uses the engine's
rule registry + evaluator for scoring. Two-pass mode for large date
ranges (coarse panchanga scan → fine full evaluation on top days).
Optional verdict generation. 5 integration tests."
```

---

## Task 2: Adapters

**Files:**
- Create: `src/lib/muhurta/engine/adapters.ts`

- [ ] **Step 1: Create adapter functions**

Three adapter functions that convert `ScoredWindow[]` to legacy formats:

```typescript
// For /api/muhurta-ai (V1 caller)
export function adaptToV1(windows: ScoredWindow[]): ScoredTimeWindow[]

// For /api/muhurta-scan, /api/muhurat/scan, SSR pages, collectiveMuhurta (V2 callers)
export function adaptToV2(windows: ScoredWindow[]): ScanV2Window[]

// For /api/muhurta-search, /api/chart-chat (SmartSearch callers)
export function adaptToSmartSearch(windows: ScoredWindow[]): MuhurtaWindow[]
```

**V1 format** (`ScoredTimeWindow` from `@/types/muhurta-ai`):
- `totalScore` = `window.score` (V1 used raw, but callers just sort by it)
- `breakdown` = `{ panchangScore, transitScore, timingScore, personalScore }` — map from `WindowBreakdown`
- `keyFactors` = top 5 positive factors as `LocaleText[]`
- `panchangaShuddhi` = count of positive panchanga assessments (0-5)

**V2 format** (`ScanV2Window` — currently defined inline in `time-window-scanner.ts`):
- `score` = normalized 0-100
- `rawScore`
- `breakdown: DetailBreakdown` — map the 9 fields from assessments
- `inauspiciousPeriods`
- `panchangContext`
- `taraBala`, `chandraBala`
- `timeSlot`

**SmartSearch format** (`MuhurtaWindow` from `smart-search.ts`):
- `score` = window.score
- `breakdown` = `{ panchang, lagna, hora, personal }` (4 buckets of 0-25)
- `proof` = structured evidence object

Read the existing types in `src/types/muhurta-ai.ts` and `src/lib/muhurta/smart-search.ts` to match the exact shapes.

- [ ] **Step 2: Write adapter tests**

Add to `src/lib/__tests__/muhurta-scanner-unified.test.ts`:
- Test: adaptToV1 produces ScoredTimeWindow[] with correct fields
- Test: adaptToV2 produces windows with DetailBreakdown
- Test: adaptToSmartSearch produces MuhurtaWindow[] with proof

- [ ] **Step 3: Run tests and commit**

---

## Task 3: Wire Adapters to Legacy Scanners

**Files:**
- Modify: `src/lib/muhurta/time-window-scanner.ts`
- Modify: `src/lib/muhurta/smart-search.ts`

- [ ] **Step 1: Replace scanDateRange (V1) body**

In `time-window-scanner.ts`, replace the body of `scanDateRange()` with:
```typescript
export function scanDateRange(options: ScanOptions): ScoredTimeWindow[] {
  // Import engine
  require('@/lib/muhurta/engine'); // ensure rules registered
  const { unifiedScan } = require('@/lib/muhurta/engine/scanner');
  const { adaptToV1 } = require('@/lib/muhurta/engine/adapters');
  
  const windows = unifiedScan({
    ...options,
    windowMinutes: 180, // V1 used daylight/3 ≈ 3-4 hours
    maxResults: 20,
    minScore: 40,
  });
  return adaptToV1(windows);
}
```

Keep the original function signature intact.

- [ ] **Step 2: Replace scanDateRangeV2 body**

```typescript
export function scanDateRangeV2(options: ScanOptionsV2): ScanV2Window[] {
  require('@/lib/muhurta/engine');
  const { unifiedScan } = require('@/lib/muhurta/engine/scanner');
  const { adaptToV2 } = require('@/lib/muhurta/engine/adapters');
  
  const windows = unifiedScan({
    startDate: options.startDate,
    endDate: options.endDate,
    activity: options.activity,
    lat: options.lat,
    lng: options.lng,
    tz: options.tz,
    windowMinutes: options.windowMinutes,
    preSunriseHours: options.preSunriseHours,
    postSunsetHours: options.postSunsetHours,
    birthNakshatra: options.birthNakshatra,
    birthRashi: options.birthRashi,
    dashaLords: options.dashaLords,
  });
  return adaptToV2(windows);
}
```

- [ ] **Step 3: Replace smartMuhurtaSearch body**

In `smart-search.ts`, replace the body of `smartMuhurtaSearch()` with:
```typescript
export function smartMuhurtaSearch(params: SearchParams, user?: UserSnapshot): MuhurtaWindow[] {
  require('@/lib/muhurta/engine');
  const { unifiedScan } = require('@/lib/muhurta/engine/scanner');
  const { adaptToSmartSearch } = require('@/lib/muhurta/engine/adapters');
  
  const windows = unifiedScan({
    startDate: params.startDate,
    endDate: params.endDate,
    activity: params.activity,
    lat: params.lat,
    lng: params.lng,
    tz: params.tzOffset,
    windowMinutes: 15,
    twoPass: true,
    twoPassTopDays: 5,
    maxResults: 3,
    includeVerdicts: true,
    birthNakshatra: user?.birthData ? /* extract */ : undefined,
    birthRashi: user?.birthData ? /* extract */ : undefined,
  });
  return adaptToSmartSearch(windows);
}
```

- [ ] **Step 4: Run ALL tests**

```bash
npx vitest run
npx tsc --noEmit -p tsconfig.build-check.json
```

This is the critical step — existing tests for the V1, V2, and SmartSearch scanners must still pass with the new implementation underneath.

- [ ] **Step 5: Commit**

```bash
git commit -m "feat(muhurta-engine): wire unified scanner to all legacy callers

scanDateRange (V1), scanDateRangeV2 (V2), and smartMuhurtaSearch
now delegate to unifiedScan() + adapters. Zero breaking changes
for API routes and UI components."
```

---

## Task 4: Final Verification

- [ ] **Step 1: Full test suite**
```bash
npx vitest run && npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 2: Build**
```bash
NODE_OPTIONS="--max-old-space-size=8192" npx next build 2>&1 | grep -E "✓|✗|Error"
```

- [ ] **Step 3: Cross-check V2 output**
```bash
npx tsx -e "
const { scanDateRangeV2 } = require('./src/lib/muhurta/time-window-scanner');
const results = scanDateRangeV2({
  startDate: '2026-05-10', endDate: '2026-05-10',
  activity: 'marriage', lat: 46.46, lng: 6.80, tz: 2,
  windowMinutes: 120, preSunriseHours: 0, postSunsetHours: 0,
});
for (const w of results.slice(0, 3)) {
  console.log(w.startTime, '-', w.endTime, 'score:', w.score);
}
"
```

- [ ] **Step 4: Cross-check SmartSearch output**
```bash
npx tsx -e "
const { smartMuhurtaSearch } = require('./src/lib/muhurta/smart-search');
const results = smartMuhurtaSearch({ activity: 'marriage', startDate: '2026-06-01', endDate: '2026-06-30', lat: 46.46, lng: 6.80, tzOffset: 2 });
console.log('Results:', results.length);
for (const w of results) {
  console.log(w.date, w.startTime, '-', w.endTime, 'score:', w.score);
}
"
```

- [ ] **Step 5: Commit and push**

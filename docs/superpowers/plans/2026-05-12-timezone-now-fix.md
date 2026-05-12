# Timezone NOW Fix — Eliminate All Browser-vs-Panchang Timezone Mismatches

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Every "NOW" marker, `isCurrent` check, and time-range comparison across the entire app must use the panchang location's timezone, never the browser's local time. Plus: detect VPN/timezone mismatches and prompt the user to confirm their location.

**Architecture:** One shared utility (`nowInTimezone`) replaces all `new Date().getHours() * 60 + now.getMinutes()` calls. A `TimezoneMismatchBanner` component detects browser-tz ≠ location-tz and prompts. Sweep across all 12 affected files.

**Tech Stack:** `Intl.DateTimeFormat` for timezone-aware time, Zustand location store, React client components.

---

## The Bug

Every file that shows "NOW" or highlights the current time slot uses browser-local time:
```typescript
const now = new Date();
return now.getHours() * 60 + now.getMinutes(); // ← BROWSER timezone, not panchang timezone
```

If the panchang is computed for Mumbai (IST, UTC+5:30) but the browser is in Zurich (CEST, UTC+2), the NOW marker is 3.5 hours off. This happens with VPNs, travel, or manual city selection.

## All 12 Affected Locations

| # | File | Line(s) | What it does |
|---|------|---------|-------------|
| 1 | `src/components/panchang/BestWindowsCard.tsx` | 80-82, 123, 162 | NOW marker on verdict bar + slot highlighting |
| 2 | `src/components/panchang/DayTimeline.tsx` | 8-10, 19-20, 292 | NOW badge on timeline entries |
| 3 | `src/app/[locale]/panchang/PanchangClient.tsx` | 94 | NOW minutes for panchang page features |
| 4 | `src/app/[locale]/hora/Client.tsx` | 140, 146 | NOW marker on hora chart |
| 5 | `src/app/[locale]/dinacharya/page.tsx` | 69-71, 79-80, 89, 174, 563, 624, 871 | NOW on daily routine timeline (7 call sites!) |
| 6 | `src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx` | 42 | NOW on muhurta AI drilldown |
| 7 | `src/app/[locale]/dashboard/page.tsx` | 1262, 1285, 1322 | NOW for dashboard cosmic weather + hora display |
| 8 | `src/app/[locale]/panchang/auspicious/page.tsx` | 488 | NOW on auspicious timings page |

---

### Task 1: Create Shared Timezone-Aware NOW Utility

**Files:**
- Create: `src/lib/utils/now-in-timezone.ts`
- Create: `src/lib/__tests__/now-in-timezone.test.ts`

This is the single replacement for every `new Date().getHours() * 60 + now.getMinutes()` in the codebase.

- [ ] **Step 1: Write tests**

```typescript
// src/lib/__tests__/now-in-timezone.test.ts
import { describe, it, expect, vi, afterEach } from 'vitest';
import { nowMinutesInTimezone, isTimeRangeActive, formatCurrentTime12h } from '../utils/now-in-timezone';

describe('nowMinutesInTimezone', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('returns minutes in the specified IANA timezone', () => {
    // Fix time to 2026-05-12T12:00:00Z (UTC noon)
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-12T12:00:00Z'));

    // UTC noon = 17:30 IST (UTC+5:30)
    const istMinutes = nowMinutesInTimezone('Asia/Kolkata');
    expect(istMinutes).toBe(17 * 60 + 30); // 1050

    // UTC noon = 14:00 CEST (UTC+2)
    const cestMinutes = nowMinutesInTimezone('Europe/Zurich');
    expect(cestMinutes).toBe(14 * 60); // 840
  });

  it('falls back to browser time when timezone is null/undefined', () => {
    const result = nowMinutesInTimezone(null);
    // Should return something reasonable (0-1440)
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1440);
  });

  it('falls back to browser time for invalid timezone', () => {
    const result = nowMinutesInTimezone('Invalid/Timezone');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(1440);
  });
});

describe('isTimeRangeActive', () => {
  afterEach(() => { vi.useRealTimers(); });

  it('returns true when current time is within range', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-12T12:00:00Z')); // 17:30 IST
    // Range 17:00-18:00 IST — should be active
    expect(isTimeRangeActive('17:00', '18:00', 'Asia/Kolkata')).toBe(true);
  });

  it('returns false when current time is outside range', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-12T12:00:00Z')); // 17:30 IST
    // Range 09:00-10:30 IST — should NOT be active
    expect(isTimeRangeActive('09:00', '10:30', 'Asia/Kolkata')).toBe(false);
  });

  it('handles midnight-crossing ranges (Lesson R)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-12T19:00:00Z')); // 00:30 IST (next day)
    // Range 23:00-01:00 IST — should be active at 00:30
    expect(isTimeRangeActive('23:00', '01:00', 'Asia/Kolkata')).toBe(true);
  });

  it('uses panchang timezone, not browser timezone', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-12T12:00:00Z'));
    // Browser might think it's 14:00 (Zurich) but panchang is IST
    // Range 17:00-18:00 IST — active at UTC noon (17:30 IST)
    expect(isTimeRangeActive('17:00', '18:00', 'Asia/Kolkata')).toBe(true);
    // Same range but checking with Zurich TZ — NOT active (14:00 Zurich)
    expect(isTimeRangeActive('17:00', '18:00', 'Europe/Zurich')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/__tests__/now-in-timezone.test.ts
```

- [ ] **Step 3: Implement the utility**

```typescript
// src/lib/utils/now-in-timezone.ts
//
// Timezone-aware "now" utility for all time comparisons.
// REPLACES every `new Date().getHours() * 60 + now.getMinutes()` in the codebase.
// Uses Intl.DateTimeFormat to get the current time in the PANCHANG's timezone,
// not the browser's local time. This prevents VPN/travel mismatches.

/**
 * Get current minutes-since-midnight in a specific IANA timezone.
 *
 * @param timezone IANA timezone string (e.g., "Asia/Kolkata") or null for browser fallback
 * @returns minutes since midnight in that timezone (0-1439)
 *
 * Example: If it's 12:00 UTC and timezone is "Asia/Kolkata" (UTC+5:30),
 * returns 17*60+30 = 1050 (5:30 PM IST).
 */
export function nowMinutesInTimezone(timezone: string | null | undefined): number {
  const now = new Date();

  if (timezone) {
    try {
      const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      }).formatToParts(now);

      const h = parseInt(parts.find(p => p.type === 'hour')?.value ?? '0', 10);
      const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10);
      // Intl returns hour=24 for midnight in some locales — normalise
      return (h % 24) * 60 + m;
    } catch {
      // Invalid timezone — fall through to browser time
      console.error(`[nowMinutesInTimezone] Invalid timezone: ${timezone}`);
    }
  }

  // Fallback: browser local time (only when timezone is null/invalid)
  return now.getHours() * 60 + now.getMinutes();
}

/**
 * Check if a time range (HH:MM – HH:MM) is currently active in the given timezone.
 * Handles midnight-crossing ranges per Lesson R.
 */
export function isTimeRangeActive(
  startTime: string,
  endTime: string,
  timezone: string | null | undefined
): boolean {
  const now = nowMinutesInTimezone(timezone);
  const [sh, sm] = startTime.split(':').map(Number);
  const [eh, em] = endTime.split(':').map(Number);
  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  // Midnight-crossing range (e.g., 23:00 – 01:00)
  if (end < start) return now >= start || now < end;
  return now >= start && now < end;
}

/**
 * Get current time formatted as "3:30 PM" in the given timezone.
 * Useful for "Right now: 3:30 PM" displays.
 */
export function formatCurrentTime12h(timezone: string | null | undefined): string {
  const now = new Date();
  if (timezone) {
    try {
      return new Intl.DateTimeFormat('en-US', {
        timeZone: timezone,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(now);
    } catch {
      // fallthrough
    }
  }
  const h = now.getHours();
  const m = now.getMinutes();
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${String(m).padStart(2, '0')} ${suffix}`;
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/lib/__tests__/now-in-timezone.test.ts
```

All tests must pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utils/now-in-timezone.ts src/lib/__tests__/now-in-timezone.test.ts
git commit -m "feat: timezone-aware NOW utility — replaces all browser-local time checks"
```

---

### Task 2: Fix BestWindowsCard + DayTimeline (Components)

**Files:**
- Modify: `src/components/panchang/BestWindowsCard.tsx`
- Modify: `src/components/panchang/DayTimeline.tsx`

Both components need: (a) accept a `timezone` prop, (b) replace `currentMinutes()` with `nowMinutesInTimezone(timezone)`, (c) replace `isInTimeRange()` with `isTimeRangeActive()`.

- [ ] **Step 1: Fix BestWindowsCard.tsx**

1. Add `timezone?: string` to the `BestWindowsCardProps` interface
2. Replace the `currentMinutes()` function definition (lines 80-83) with an import:
   ```typescript
   import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';
   ```
3. Replace every `currentMinutes()` call with `nowMinutesInTimezone(timezone)`:
   - Line 123 in `keySlots` useMemo: `const now = nowMinutesInTimezone(timezone);`
   - Line 162: `const nowMin = nowMinutesInTimezone(timezone);`
4. Delete the local `currentMinutes()` function entirely (lines 80-83)

- [ ] **Step 2: Fix DayTimeline.tsx**

1. Add `timezone?: string` to the `DayTimelineProps` interface (alongside existing `locale?`)
2. Replace the local `currentMinutes()` and `isInTimeRange()` functions with imports:
   ```typescript
   import { nowMinutesInTimezone, isTimeRangeActive } from '@/lib/utils/now-in-timezone';
   ```
3. In the component body, replace:
   - `isInTimeRange(w.startTime, w.endTime)` → `isTimeRangeActive(w.startTime, w.endTime, timezone)`
4. Delete the local `currentMinutes()` and `isInTimeRange()` functions

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Commit**

```bash
git add src/components/panchang/BestWindowsCard.tsx src/components/panchang/DayTimeline.tsx
git commit -m "fix: BestWindowsCard + DayTimeline use panchang timezone for NOW markers"
```

---

### Task 3: Fix PanchangClient — Pass Timezone to Components

**Files:**
- Modify: `src/app/[locale]/panchang/PanchangClient.tsx`

PanchangClient has `location.ianaTimezone` available. It needs to pass this as `timezone` prop to `<BestWindowsCard>` and `<DayTimeline>`, and fix its own `nowMinutes` computation.

- [ ] **Step 1: Add import**

```typescript
import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';
```

- [ ] **Step 2: Fix the local nowMinutes computation (line ~94)**

Find `const nowMinutes = now.getHours() * 60 + now.getMinutes();` and replace with:
```typescript
const nowMinutes = nowMinutesInTimezone(location.ianaTimezone);
```

- [ ] **Step 3: Pass timezone to components**

Find `<BestWindowsCard panchang={panchang} locale={locale} />` and add timezone:
```typescript
<BestWindowsCard panchang={panchang} locale={locale} timezone={location.ianaTimezone} />
```

Find `<DayTimeline` and add timezone:
```typescript
<DayTimeline panchang={panchang} sunrise={panchang.sunrise} sunset={panchang.sunset} timezone={location.ianaTimezone} compact />
```

- [ ] **Step 4: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add 'src/app/[locale]/panchang/PanchangClient.tsx'
git commit -m "fix: PanchangClient passes timezone to all time-aware components"
```

---

### Task 4: Fix Hora Client

**Files:**
- Modify: `src/app/[locale]/hora/Client.tsx`

- [ ] **Step 1: Add import and fix**

```typescript
import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';
```

Find the `timezone` or `tz` variable — it uses `useLocationStore()` which has `timezone` field.

Replace line 140 (`return now.getHours() * 60 + now.getMinutes();`) and line 146 (`setNowMinutes(now.getHours() * 60 + now.getMinutes());`) with:
```typescript
// Line 140 (getCurrentMinutes function or equivalent):
return nowMinutesInTimezone(timezone);

// Line 146 (setInterval update):
setNowMinutes(nowMinutesInTimezone(timezone));
```

The `timezone` variable is available from `useLocationStore()` at line 129: `const { ..., timezone, ... } = useLocationStore();`

- [ ] **Step 2: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add 'src/app/[locale]/hora/Client.tsx'
git commit -m "fix: hora page uses location timezone for NOW markers"
```

---

### Task 5: Fix Dinacharya Page (7 call sites)

**Files:**
- Modify: `src/app/[locale]/dinacharya/page.tsx`

This page has the MOST call sites (7). It uses `useLocationStore()` for timezone.

- [ ] **Step 1: Add import**

```typescript
import { nowMinutesInTimezone, isTimeRangeActive } from '@/lib/utils/now-in-timezone';
```

- [ ] **Step 2: Get timezone from location store**

The page already imports `useLocationStore` (line 6). Find where `locationStore` is used and extract `timezone`:
```typescript
const { timezone } = useLocationStore();
// or if it destructures differently, find the pattern
```

- [ ] **Step 3: Replace ALL 7 call sites**

Delete the local `currentMinutes()` function (lines 69-72) and `isInTimeRange()` function (lines 79-85).

Replace every usage:
- Line 89: `const now = currentMinutes();` → `const now = nowMinutesInTimezone(timezone);`
- Line 174: `const nowMinutes = currentMinutes();` → `const nowMinutes = nowMinutesInTimezone(timezone);`
- Line 179: `isCurrent: isInTimeRange(h.startTime, h.endTime)` → `isCurrent: isTimeRangeActive(h.startTime, h.endTime, timezone)`
- Line 563: `const nowMins = currentMinutes();` → `const nowMins = nowMinutesInTimezone(timezone);`
- Line 624: `const isCurrent = isInTimeRange(phase.startTime, phase.endTime);` → `const isCurrent = isTimeRangeActive(phase.startTime, phase.endTime, timezone);`
- Line 871: `const isActive = isInTimeRange(zone.startTime, zone.endTime);` → `const isActive = isTimeRangeActive(zone.startTime, zone.endTime, timezone);`

- [ ] **Step 4: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add 'src/app/[locale]/dinacharya/page.tsx'
git commit -m "fix: dinacharya page uses location timezone for all 7 NOW checks"
```

---

### Task 6: Fix Dashboard + Muhurta AI + Auspicious Page

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx` (3 call sites)
- Modify: `src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx` (1 call site)
- Modify: `src/app/[locale]/panchang/auspicious/page.tsx` (1 call site)

- [ ] **Step 1: Fix dashboard/page.tsx**

Add import:
```typescript
import { nowMinutesInTimezone } from '@/lib/utils/now-in-timezone';
```

The dashboard already has `useLocationStore` — find the timezone. There is a variable tracking panchang location. Replace:
- Line 1262: `const nowMin = new Date().getHours() * 60 + new Date().getMinutes();` → `const nowMin = nowMinutesInTimezone(locStore.timezone);` (where `locStore` is from `useLocationStore.getState()` — check exact variable name)
- Line 1285: same pattern
- Line 1322: `const n = now.getHours() * 60 + now.getMinutes();` → `const n = nowMinutesInTimezone(locStore.timezone);`

Also pass `timezone` prop to `<BestWindowsCard>` if not already done:
```typescript
<BestWindowsCard panchang={panchangData} locale={locale} timezone={locStore.timezone ?? undefined} />
```

- [ ] **Step 2: Fix muhurta-ai DayDrilldown.tsx**

Add import. The component likely receives timezone as a prop or has access to location store. Replace line 42:
```typescript
const nowMin = nowMinutesInTimezone(timezone);
```

- [ ] **Step 3: Fix panchang/auspicious/page.tsx**

Add import. Replace line 488:
```typescript
const nm = nowMinutesInTimezone(timezone);
```

This page needs access to the location timezone. Check if it uses `useLocationStore` — if not, add it.

- [ ] **Step 4: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add 'src/app/[locale]/dashboard/page.tsx' 'src/app/[locale]/muhurta-ai/components/DayDrilldown.tsx' 'src/app/[locale]/panchang/auspicious/page.tsx'
git commit -m "fix: dashboard + muhurta-ai + auspicious page use location timezone for NOW"
```

---

### Task 7: VPN/Timezone Mismatch Detection + Prompt

**Files:**
- Create: `src/components/location/TimezoneMismatchBanner.tsx`
- Modify: `src/components/layout/ClientShell.tsx` (wire in)

- [ ] **Step 1: Create TimezoneMismatchBanner**

```typescript
// src/components/location/TimezoneMismatchBanner.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocationStore } from '@/stores/location-store';
import { MapPin, AlertTriangle, X } from 'lucide-react';

const SESSION_KEY = 'dp-tz-mismatch-dismissed';

/**
 * Detects when the browser's timezone differs from the panchang location's timezone.
 * This happens with VPNs, travel, or when the user manually selected a distant city.
 *
 * Shows a non-blocking banner:
 *   "Your device is in Europe/Zurich but showing panchang for Mumbai (Asia/Kolkata).
 *    [Use my device location]  [Continue with Mumbai]"
 *
 * Rules:
 * - Only shows when location was auto-detected (not manually selected)
 * - Dismisses for the session (sessionStorage)
 * - "Use my device location" triggers re-detection
 * - "Continue with Mumbai" dismisses + stores preference
 */
export default function TimezoneMismatchBanner() {
  const { timezone: locationTz, name: locationName, confirmed, detect } = useLocationStore();
  const [browserTz, setBrowserTz] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Get browser timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      setBrowserTz(tz);
    } catch {
      // Can't detect — don't show banner
      return;
    }
  }, []);

  useEffect(() => {
    if (!browserTz || !locationTz) return;

    // Don't show if user manually confirmed location (city picker, URL params)
    if (confirmed) return;

    // Don't show if already dismissed this session
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch { /* proceed */ }

    // Compare timezones — if they match, no problem
    if (browserTz === locationTz) return;

    // Check if they're in the same UTC offset right now (handles aliases like Europe/Berlin = Europe/Zurich)
    try {
      const now = new Date();
      const browserOffset = new Intl.DateTimeFormat('en-US', { timeZone: browserTz, timeZoneName: 'shortOffset' })
        .formatToParts(now).find(p => p.type === 'timeZoneName')?.value;
      const locationOffset = new Intl.DateTimeFormat('en-US', { timeZone: locationTz, timeZoneName: 'shortOffset' })
        .formatToParts(now).find(p => p.type === 'timeZoneName')?.value;
      if (browserOffset === locationOffset) return; // Same offset — close enough
    } catch { /* proceed with mismatch */ }

    setShow(true);
  }, [browserTz, locationTz, confirmed]);

  const dismiss = () => {
    setShow(false);
    try { sessionStorage.setItem(SESSION_KEY, '1'); } catch { /* ignore */ }
  };

  const useDeviceLocation = () => {
    dismiss();
    detect(); // Triggers geolocation re-detection in location store
  };

  if (!show || !browserTz || !locationTz) return null;

  // Human-readable timezone names
  const browserCity = browserTz.replace(/_/g, ' ').split('/').pop() || browserTz;
  const locationCity = locationName || locationTz.replace(/_/g, ' ').split('/').pop() || locationTz;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50
      bg-gradient-to-br from-[#2d1b69]/90 via-[#1a1040]/95 to-[#0a0e27]/95
      border border-amber-500/30 rounded-xl p-4 shadow-xl backdrop-blur-sm">
      <button
        onClick={dismiss}
        className="absolute top-2 right-2 text-text-secondary hover:text-text-primary p-1"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-2">
          <p className="text-text-primary text-sm leading-snug">
            Your device is in <strong className="text-gold-light">{browserCity}</strong> but
            showing panchang for <strong className="text-gold-light">{locationCity}</strong> ({locationTz}).
          </p>
          <p className="text-text-secondary text-xs">
            This can happen with a VPN or when travelling. Times shown are for {locationCity}.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <button
              onClick={useDeviceLocation}
              className="flex items-center gap-1.5 text-xs font-medium text-gold-primary hover:text-gold-light transition-colors"
            >
              <MapPin className="w-3.5 h-3.5" />
              Use my actual location
            </button>
            <button
              onClick={dismiss}
              className="text-xs text-text-secondary hover:text-text-primary transition-colors"
            >
              Continue with {locationCity}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Wire into ClientShell.tsx**

In `src/components/layout/ClientShell.tsx`, add:
```typescript
const TimezoneMismatchBanner = dynamic(() => import('@/components/location/TimezoneMismatchBanner'), { ssr: false });
```

And render it in the JSX:
```typescript
<TimezoneMismatchBanner />
```

- [ ] **Step 3: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/components/location/TimezoneMismatchBanner.tsx src/components/layout/ClientShell.tsx
git commit -m "feat: VPN/timezone mismatch detection — prompts user to confirm location"
```

---

### Task 8: Grep Verification — Zero Remaining Browser-Time Leaks

**Files:** None — verification only.

- [ ] **Step 1: Grep for remaining browser-time patterns**

```bash
# These patterns should return ZERO matches in app/component code (excluding the utility itself):
grep -rn "getHours().*60\|getHours() \* 60" src/app/ src/components/ --include="*.tsx" --include="*.ts" | grep -v now-in-timezone | grep -v node_modules
```

Expected: 0 matches. If any remain, they are bugs — fix them.

- [ ] **Step 2: Grep for local currentMinutes/isInTimeRange definitions**

```bash
grep -rn "function currentMinutes\|function isInTimeRange" src/ --include="*.tsx" --include="*.ts" | grep -v now-in-timezone | grep -v node_modules | grep -v __tests__
```

Expected: 0 matches. All local definitions should have been replaced by the shared utility.

- [ ] **Step 3: Run full test suite**

```bash
npx vitest run
```

All tests must pass.

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 5: Build**

```bash
NODE_OPTIONS="--max-old-space-size=8192" npx next build
```

- [ ] **Step 6: Browser test with timezone mismatch**

Start dev server. Change your system timezone (or use the browser devtools timezone override) to a different timezone than your panchang location. Verify:
1. NOW markers on panchang page show the PANCHANG location's time, not browser time
2. The TimezoneMismatchBanner appears (bottom-right)
3. Clicking "Use my actual location" triggers re-detection
4. Clicking "Continue with {city}" dismisses for the session
5. NOW markers on hora, dinacharya, dashboard all use panchang timezone

- [ ] **Step 7: Commit verification**

```bash
git log --oneline -8
```

Should show 7 clean commits from this plan.

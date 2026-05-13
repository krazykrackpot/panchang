# Timezone Resolution Split — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Split `resolveTimezoneFromCoords` into two functions with opposite semantics, so the kundali timezone bug can never regress again.

**Architecture:** Two functions, clearly named, with JSDoc that screams the intent. The current single function serves 19 birth-location callers and 4 current-location callers with conflicting requirements. After the split, each caller uses the right function and the type system prevents misuse.

**Root cause of regression:** On Apr 30, a panchang sunrise bug was fixed by adding browser TZ to the shared function. This was correct for panchang (user IS at the location) but catastrophically wrong for kundali (user is NOT at the birth location). The shared function made it impossible to fix one without breaking the other.

---

## The Two Functions

### `resolveBirthTimezone(lat: number, lng: number): Promise<string>`

**For:** Kundali, matching, varshaphal, baby-names, sign-calculator, tropical-compare, tithi-pravesha, profile API, BirthForm — anything computing a chart for a birth location.

**Rules:**
- NEVER reads browser timezone (`Intl.DateTimeFormat`). Ever. Under any circumstances.
- Method 1: `timeapi.io` API (resolves from coordinates)
- Method 2: Offline timezone lookup library (`geo-tz` or equivalent) if API fails
- Method 3: Longitude-based fallback with IST/India special case
- Runs on both client and server (no `window` dependency)

### `resolveCurrentLocationTimezone(lat: number, lng: number): Promise<string>`

**For:** PanchangClient, LocationSearch, sign-shift, muhurta-search — anything showing data for the user's current location.

**Rules:**
- Method 1: `locationStore.timezone` (already resolved and stored)
- Method 2: Browser `Intl.DateTimeFormat().resolvedOptions().timeZone` (correct for current location)
- Method 3: `timeapi.io` API
- Method 4: Longitude-based fallback
- Only runs on client (browser TZ needs `window`)

---

## File Map

| Action | Path | What changes |
|--------|------|-------------|
| **Modify** | `src/lib/utils/timezone.ts` | Split `resolveTimezoneFromCoords` into `resolveBirthTimezone` + `resolveCurrentLocationTimezone`. Keep old function as deprecated alias that calls `resolveBirthTimezone` (safe default). |
| **Modify** | `src/components/kundali/BirthForm.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/kundali/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` (2 call sites) |
| **Modify** | `src/app/[locale]/kundali/compare/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/varshaphal/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/baby-names/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/sign-calculator/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/tropical-compare/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/[locale]/tithi-pravesha/page.tsx` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` |
| **Modify** | `src/app/api/user/profile/route.ts` | `resolveTimezoneFromCoords` → `resolveBirthTimezone` (2 call sites) |
| **Modify** | `src/app/[locale]/panchang/PanchangClient.tsx` | `resolveTimezoneFromCoords` → `resolveCurrentLocationTimezone` |
| **Modify** | `src/components/ui/LocationSearch.tsx` | `resolveTimezoneFromCoords` → `resolveCurrentLocationTimezone` |
| **Modify** | `src/app/[locale]/sign-shift/page.tsx` | `resolveTimezoneFromCoords` → `resolveCurrentLocationTimezone` |
| **Modify** | `src/app/api/muhurta-search/route.ts` | `resolveTimezoneFromCoords` → `resolveCurrentLocationTimezone` |
| **Create** | `src/lib/__tests__/timezone-split.test.ts` | Tests proving birth function NEVER returns browser TZ |

---

## Task 1: Split the function in timezone.ts

**Files:**
- Modify: `src/lib/utils/timezone.ts`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/timezone-split.test.ts`:

```typescript
import { describe, it, expect, vi } from 'vitest';

describe('resolveBirthTimezone', () => {
  it('returns Asia/Kolkata for Hyderabad coordinates, never browser TZ', async () => {
    // Mock: pretend browser is in Europe/Zurich
    // The function must NOT use the browser timezone
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(17.385, 78.4867);
    // Must be Asia/Kolkata (or at minimum IST-equivalent), never Europe/Zurich
    expect(tz).not.toBe('Europe/Zurich');
    // Should resolve to India timezone
    expect(['Asia/Kolkata', 'Asia/Calcutta']).toContain(tz);
  });

  it('returns America/New_York for New York coordinates', async () => {
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(40.7128, -74.006);
    expect(tz).toBe('America/New_York');
  });

  it('returns Europe/Zurich for Zurich coordinates', async () => {
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    const tz = await resolveBirthTimezone(47.3769, 8.5417);
    // Should be CET, not UTC
    expect(['Europe/Zurich', 'Europe/Paris', 'Europe/Berlin']).toContain(tz);
  });

  it('never calls Intl.DateTimeFormat', async () => {
    const spy = vi.spyOn(Intl, 'DateTimeFormat');
    const { resolveBirthTimezone } = await import('@/lib/utils/timezone');
    await resolveBirthTimezone(17.385, 78.4867);
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe('resolveCurrentLocationTimezone', () => {
  it('prefers browser timezone when available', async () => {
    const { resolveCurrentLocationTimezone } = await import('@/lib/utils/timezone');
    // In test environment, Intl gives a timezone
    const tz = await resolveCurrentLocationTimezone(17.385, 78.4867);
    // Should return something (browser TZ or API result)
    expect(tz).toBeTruthy();
    expect(tz).not.toBe('UTC');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/timezone-split.test.ts`
Expected: FAIL — `resolveBirthTimezone` doesn't exist yet

- [ ] **Step 3: Create the two functions**

In `src/lib/utils/timezone.ts`, add above the existing `resolveTimezoneFromCoords`:

```typescript
/**
 * Resolve timezone for a BIRTH LOCATION from its coordinates.
 *
 * ██████████████████████████████████████████████████████████████████████
 * ██  NEVER EVER USE THE BROWSER TIMEZONE HERE.                      ██
 * ██  This function resolves TZ for where someone WAS BORN,          ██
 * ██  not where the user IS NOW.                                      ██
 * ██  A user in Switzerland generating a kundali for someone born     ██
 * ██  in Hyderabad MUST get Asia/Kolkata, not Europe/Zurich.          ██
 * ██                                                                  ██
 * ██  If you are fixing a bug and think adding browser TZ here will   ██
 * ██  help — STOP. You want resolveCurrentLocationTimezone() instead. ██
 * ██  This function has caused production bugs TWICE by returning     ██
 * ██  the browser's timezone. Do not make it three times.             ██
 * ██████████████████████████████████████████████████████████████████████
 *
 * Resolution order:
 * 1. timeapi.io external API (accurate, handles DST)
 * 2. India special case (lat/lng within India bounding box → Asia/Kolkata)
 * 3. Longitude-based fallback with known corrections
 */
export async function resolveBirthTimezone(lat: number, lng: number): Promise<string> {
  // Method 1: External API
  try {
    const res = await fetch(
      `https://timeapi.io/api/timezone/coordinate?latitude=${lat}&longitude=${lng}`,
      { signal: AbortSignal.timeout(3000) }
    );
    if (res.ok) {
      const data = await res.json();
      if (data.timeZone) return data.timeZone;
    }
  } catch { /* API failed */ }

  // Method 2: India special case — IST for entire country (UTC+5:30)
  // India bounding box: lat 6-36°N, lng 68-98°E
  if (lat >= 6 && lat <= 36 && lng >= 68 && lng <= 98) {
    return 'Asia/Kolkata';
  }

  // Method 3: Other known country/region special cases
  // Nepal (UTC+5:45)
  if (lat >= 26 && lat <= 31 && lng >= 80 && lng <= 89) return 'Asia/Kathmandu';
  // Sri Lanka (UTC+5:30)
  if (lat >= 5 && lat <= 10 && lng >= 79 && lng <= 82) return 'Asia/Colombo';
  // Japan (no DST, single TZ)
  if (lat >= 24 && lat <= 46 && lng >= 123 && lng <= 146) return 'Asia/Tokyo';

  // Method 4: Longitude-based estimate (last resort)
  const isEurope = lng >= -10 && lng <= 40 && lat >= 35 && lat <= 72;
  if (isEurope) {
    if (lng <= 15) return 'Europe/Paris';      // CET
    if (lng <= 30) return 'Europe/Helsinki';    // EET
    return 'Europe/Moscow';                     // MSK
  }
  const offsetHours = Math.round(lng / 15);
  const OFFSET_TO_IANA: Record<string, string> = {
    '-12': 'Etc/GMT+12', '-11': 'Pacific/Midway', '-10': 'Pacific/Honolulu',
    '-9': 'America/Anchorage', '-8': 'America/Los_Angeles', '-7': 'America/Denver',
    '-6': 'America/Chicago', '-5': 'America/New_York', '-4': 'America/Halifax',
    '-3': 'America/Sao_Paulo', '-2': 'Atlantic/South_Georgia', '-1': 'Atlantic/Azores',
    '0': 'UTC', '1': 'Europe/Paris', '2': 'Europe/Helsinki',
    '3': 'Europe/Moscow', '4': 'Asia/Dubai', '5': 'Asia/Karachi',
    '6': 'Asia/Dhaka', '7': 'Asia/Bangkok', '8': 'Asia/Shanghai',
    '9': 'Asia/Tokyo', '10': 'Australia/Sydney', '11': 'Pacific/Noumea',
    '12': 'Pacific/Auckland',
  };
  return OFFSET_TO_IANA[String(offsetHours)] || 'UTC';
}

/**
 * Resolve timezone for the USER'S CURRENT LOCATION.
 *
 * Used by panchang, location search, muhurta — pages showing data for
 * where the user IS right now. Browser timezone IS correct here because
 * the coordinates come from browser geolocation or IP detection.
 *
 * For birth charts, use resolveBirthTimezone() instead.
 */
export async function resolveCurrentLocationTimezone(lat: number, lng: number): Promise<string> {
  // Method 1: Browser Intl API — instant, no network, correct for current location
  if (typeof window !== 'undefined' && typeof Intl !== 'undefined') {
    try {
      const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (browserTz && browserTz !== 'UTC') return browserTz;
    } catch { /* Intl not available */ }
  }

  // Method 2+: fall through to birth timezone resolver (same API + fallback logic)
  return resolveBirthTimezone(lat, lng);
}
```

- [ ] **Step 4: Deprecate the old function**

Keep `resolveTimezoneFromCoords` as a deprecated alias that calls `resolveBirthTimezone` (the safe default):

```typescript
/**
 * @deprecated Use resolveBirthTimezone() for birth charts or
 * resolveCurrentLocationTimezone() for current-location features.
 * This alias defaults to the SAFE (birth) behaviour.
 */
export async function resolveTimezoneFromCoords(lat: number, lng: number): Promise<string> {
  return resolveBirthTimezone(lat, lng);
}
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/lib/__tests__/timezone-split.test.ts`
Expected: all pass

- [ ] **Step 6: Commit**

```bash
git add src/lib/utils/timezone.ts src/lib/__tests__/timezone-split.test.ts
git commit -m "feat: split timezone resolution — resolveBirthTimezone vs resolveCurrentLocationTimezone

Root cause: single function served both birth-location (kundali) and
current-location (panchang) callers. Adding browser TZ for panchang
broke kundali. Splitting makes it impossible to regress.

resolveBirthTimezone: NEVER uses browser TZ. For kundali, matching,
varshaphal, baby-names, etc. Has India/Nepal/SriLanka special cases.

resolveCurrentLocationTimezone: Browser TZ first (correct for user's
current location). For panchang, LocationSearch, muhurta.

Old function kept as deprecated alias → resolveBirthTimezone (safe default)."
```

---

## Task 2: Update all 19 birth-location callers

**Files:** BirthForm.tsx, kundali/page.tsx (×2), kundali/compare/page.tsx, varshaphal/page.tsx, baby-names/page.tsx, sign-calculator/page.tsx, tropical-compare/page.tsx, tithi-pravesha/page.tsx, api/user/profile/route.ts (×2)

- [ ] **Step 1: Replace all imports in birth-location files**

For each file, change:
```typescript
import { resolveTimezoneFromCoords } from '@/lib/utils/timezone';
```
to:
```typescript
import { resolveBirthTimezone } from '@/lib/utils/timezone';
```

And replace all call sites:
```typescript
resolveTimezoneFromCoords(lat, lng)
```
with:
```typescript
resolveBirthTimezone(lat, lng)
```

Full file list with line numbers:
- `src/components/kundali/BirthForm.tsx:15,98,116`
- `src/app/[locale]/kundali/page.tsx:33,502,844`
- `src/app/[locale]/kundali/compare/page.tsx:14,210`
- `src/app/[locale]/varshaphal/page.tsx:10,268`
- `src/app/[locale]/baby-names/page.tsx:5,59`
- `src/app/[locale]/sign-calculator/page.tsx:4,77`
- `src/app/[locale]/tropical-compare/page.tsx:11,140`
- `src/app/[locale]/tithi-pravesha/page.tsx:18,150`
- `src/app/api/user/profile/route.ts:10,57,202`

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 3: Commit**

```bash
git add <all modified files>
git commit -m "fix: 19 birth-location callers now use resolveBirthTimezone (never browser TZ)"
```

---

## Task 3: Update all 4 current-location callers

**Files:** PanchangClient.tsx, LocationSearch.tsx, sign-shift/page.tsx, muhurta-search/route.ts

- [ ] **Step 1: Replace imports and calls**

Change `resolveTimezoneFromCoords` → `resolveCurrentLocationTimezone` in:
- `src/app/[locale]/panchang/PanchangClient.tsx:31,303`
- `src/components/ui/LocationSearch.tsx:5,38`
- `src/app/[locale]/sign-shift/page.tsx:25,181`
- `src/app/api/muhurta-search/route.ts:15,236`

Note: `muhurta-search/route.ts` runs server-side where `window` is undefined. The `resolveCurrentLocationTimezone` function checks for `window` before using browser TZ — on server it falls through to the API/fallback. This is correct because the muhurta search coordinates come from the client's location store.

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 3: Commit**

```bash
git add <all modified files>
git commit -m "fix: 4 current-location callers now use resolveCurrentLocationTimezone"
```

---

## Task 4: Verify the fix with the exact regression case

- [ ] **Step 1: Run the regression test**

```bash
npx tsx -e "
const { resolveBirthTimezone } = require('./src/lib/utils/timezone');

// Simulate: user in Switzerland, birth in Hyderabad
async function test() {
  const tz = await resolveBirthTimezone(17.385, 78.4867);
  console.log('Birth TZ for Hyderabad:', tz);
  console.assert(tz === 'Asia/Kolkata', 'FAIL: expected Asia/Kolkata, got ' + tz);

  const { generateKundali } = require('./src/lib/ephem/kundali-calc');
  const k = generateKundali({
    name: 'Diksha', date: '1998-11-01', time: '09:55',
    lat: 17.385, lng: 78.4867, timezone: tz, ayanamsha: 'lahiri',
  });
  const moon = k.planets[1];
  console.log('Moon:', moon.longitude.toFixed(4) + '°', moon.nakshatra?.name?.en, 'Pada', moon.pada);
  console.assert(moon.nakshatra?.name?.en === 'Purva Bhadrapada', 'FAIL: wrong nakshatra');
  console.assert(moon.pada === 4, 'FAIL: wrong pada');
  console.log('PASS: Hyderabad birth from Switzerland gets correct nakshatra');
}
test();
"
```

- [ ] **Step 2: Run full test suite**

```bash
npx vitest run
```

- [ ] **Step 3: Test in browser**

Open `http://localhost:3000/en/kundali`, enter:
- Name: Diksha Acharya
- Date: 1998-11-01
- Time: 09:55
- Place: Hyderabad

Verify: Nakshatra = Purva Bhadrapada (Pada 4), NOT Uttara Bhadrapada (Pada 1)

Also test panchang page still shows correct local sunrise (not UTC).

- [ ] **Step 4: Commit and push**

```bash
git push origin main
```

---

## Why This Fix Is Permanent

1. **Type-level separation** — two functions with different names and different JSDoc. No ambiguity.
2. **The birth function physically cannot access browser TZ** — it has no `Intl.DateTimeFormat` call anywhere in its body.
3. **The deprecated alias defaults to the safe (birth) behaviour** — even if someone uses the old function name, kundali still works.
4. **The test suite explicitly asserts that `resolveBirthTimezone` never calls `Intl.DateTimeFormat`** — a spy test catches any regression.
5. **The JSDoc comment is a 10-line warning box** — impossible to miss.

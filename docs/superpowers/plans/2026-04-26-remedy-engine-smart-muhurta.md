# Remedy Engine + Smart Muhurta Search — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add personalized remedy prescriptions with timed hora windows and a natural-language muhurta search with two-pass scanning and calculation proof cards.

**Architecture:** Hora engine (pure math) → Prescription engine (hora + chart weakness → timed prescriptions) → Contextual UI surfaces (panchang/kundali/dashboard) → Smart search (NL → LLM extraction → two-pass scan → proof cards)

**Tech Stack:** TypeScript, React 19, Next.js 16, Vitest, existing Jyotish constants (BPHS gemstone/mantra data)

---

## File Structure

| File | Purpose |
|------|---------|
| `src/lib/panchang/hora-engine.ts` | **NEW** — Hora computation: Chaldean sequence, day/night durations, activities |
| `src/lib/ephem/astronomical.ts` | **MODIFY** — Extract `calcAscendant()` as exported function |
| `src/lib/remedies/prescription-engine.ts` | **NEW** — Daily prescription generator: weakness + hora + chart context |
| `src/lib/remedies/vara-remedies.ts` | **NEW** — Generic vara-based remedies for logged-out users |
| `src/lib/muhurta/smart-search.ts` | **NEW** — Two-pass muhurta scan with lagna shuddhi + scoring |
| `src/app/api/muhurta-search/route.ts` | **NEW** — API route: LLM extraction + smart search |
| `src/app/[locale]/panchang/PanchangClient.tsx` | **MODIFY** — Add hora activities to existing hora section, add remedy cards |
| `src/components/kundali/RemediesTab.tsx` | **MODIFY** — Add timing + full prescription cards |
| `src/app/[locale]/muhurta-ai/page.tsx` | **MODIFY** — Add NL search bar + proof cards |
| `src/lib/__tests__/hora-engine.test.ts` | **NEW** — Hora tests |
| `src/lib/__tests__/prescription-engine.test.ts` | **NEW** — Prescription tests |
| `src/lib/__tests__/smart-search.test.ts` | **NEW** — Smart search tests |

---

### Task 1: Hora Engine + Tests

**Files:**
- Create: `src/lib/panchang/hora-engine.ts`
- Create: `src/lib/__tests__/hora-engine.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/hora-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeHoraTable, HORA_PLANET_ACTIVITIES } from '../panchang/hora-engine';

describe('computeHoraTable', () => {
  // Sunday (varaDay=0) starts with Sun
  it('returns 24 hora slots', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    expect(slots).toHaveLength(24);
  });

  it('first slot on Sunday is Sun hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    expect(slots[0].planetId).toBe(0); // Sun
    expect(slots[0].isDay).toBe(true);
  });

  it('first slot on Monday is Moon hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 1);
    expect(slots[0].planetId).toBe(1); // Moon
  });

  it('first slot on Saturday is Saturn hora', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 6);
    expect(slots[0].planetId).toBe(6); // Saturn
  });

  it('day horas have correct duration (12 equal parts)', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    const daySlots = slots.filter(s => s.isDay);
    expect(daySlots).toHaveLength(12);
    // 12 hours / 12 = 1 hour each = 60 minutes
    expect(daySlots[0].startTime).toBe('06:00');
    expect(daySlots[0].endTime).toBe('07:00');
    expect(daySlots[11].endTime).toBe('18:00');
  });

  it('night horas handle midnight crossing', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    const nightSlots = slots.filter(s => !s.isDay);
    expect(nightSlots).toHaveLength(12);
    // Night = 18:00 to 06:00 = 12 hours, each slot = 60 min
    expect(nightSlots[0].startTime).toBe('18:00');
    expect(nightSlots[0].endTime).toBe('19:00');
    // Last night slot wraps to next day
    expect(nightSlots[11].endTime).toBe('06:00');
  });

  it('follows Chaldean sequence: Sun→Ven→Mer→Moon→Sat→Jup→Mars', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0); // Sunday
    // Chaldean from Sun: Sun(0), Venus(5), Mercury(3), Moon(1), Saturn(6), Jupiter(4), Mars(2), repeat
    expect(slots[0].planetId).toBe(0);  // Sun
    expect(slots[1].planetId).toBe(5);  // Venus
    expect(slots[2].planetId).toBe(3);  // Mercury
    expect(slots[3].planetId).toBe(1);  // Moon
    expect(slots[4].planetId).toBe(6);  // Saturn
    expect(slots[5].planetId).toBe(4);  // Jupiter
    expect(slots[6].planetId).toBe(2);  // Mars
    expect(slots[7].planetId).toBe(0);  // Sun again
  });

  it('each slot has activities text', () => {
    const slots = computeHoraTable('06:00', '18:00', '06:00', 0);
    for (const s of slots) {
      expect(s.activities.en).toBeTruthy();
      expect(s.activities.hi).toBeTruthy();
    }
  });

  it('handles unequal day/night durations', () => {
    // Sunrise 05:30, sunset 20:30 = 15h day, 9h night
    const slots = computeHoraTable('05:30', '20:30', '05:30', 3); // Wednesday
    const daySlots = slots.filter(s => s.isDay);
    const nightSlots = slots.filter(s => !s.isDay);
    // Day: 15h / 12 = 75 min each
    expect(daySlots[0].startTime).toBe('05:30');
    expect(daySlots[0].endTime).toBe('06:45');
    // Night: 9h / 12 = 45 min each
    expect(nightSlots[0].startTime).toBe('20:30');
    expect(nightSlots[0].endTime).toBe('21:15');
  });
});

describe('HORA_PLANET_ACTIVITIES', () => {
  it('has entries for all 7 planets', () => {
    for (let i = 0; i <= 6; i++) {
      expect(HORA_PLANET_ACTIVITIES[i]).toBeDefined();
      expect(HORA_PLANET_ACTIVITIES[i].en).toBeTruthy();
    }
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/hora-engine.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create hora-engine.ts**

Create `src/lib/panchang/hora-engine.ts`:

```typescript
/**
 * Hora Engine — Planetary Hour Computation
 *
 * Computes 24 planetary hours (12 day + 12 night) using the Chaldean sequence.
 * Day horas: sunrise to sunset divided into 12 equal parts.
 * Night horas: sunset to next sunrise divided into 12 equal parts.
 *
 * The Chaldean order: Sun(0) → Venus(5) → Mercury(3) → Moon(1) → Saturn(6) → Jupiter(4) → Mars(2)
 * Each weekday starts from its ruling planet and follows this cycle.
 */

export interface HoraSlot {
  planetId: number;       // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  startTime: string;      // "HH:MM"
  endTime: string;        // "HH:MM"
  isDay: boolean;
  activities: { en: string; hi: string };
}

// Chaldean sequence: Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars
const CHALDEAN_ORDER = [0, 5, 3, 1, 6, 4, 2];

// Starting planet for each vara day (0=Sunday)
const VARA_START_PLANET = [0, 1, 2, 3, 4, 5, 6];

export const HORA_PLANET_ACTIVITIES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Government work, authority, health, father', hi: 'सरकारी कार्य, अधिकार, स्वास्थ्य, पिता' },
  1: { en: 'Travel, liquids, public relations, mother', hi: 'यात्रा, तरल पदार्थ, जनसंपर्क, माता' },
  2: { en: 'Property, machinery, legal battles, surgery', hi: 'संपत्ति, मशीनरी, कानूनी कार्य, शल्यचिकित्सा' },
  3: { en: 'Communication, trade, learning, writing', hi: 'संचार, व्यापार, शिक्षा, लेखन' },
  4: { en: 'Education, finance, spiritual practice, children', hi: 'शिक्षा, वित्त, आध्यात्मिक साधना, संतान' },
  5: { en: 'Romance, arts, luxury, marriage', hi: 'प्रेम, कला, विलासिता, विवाह' },
  6: { en: 'Labor, discipline, mining, iron work, service', hi: 'श्रम, अनुशासन, खनन, लोहा कार्य, सेवा' },
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(mins: number): string {
  const wrapped = ((mins % 1440) + 1440) % 1440; // wrap to 0-1439
  const h = Math.floor(wrapped / 60);
  const m = Math.round(wrapped % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

/**
 * Get the Chaldean sequence starting from a specific planet.
 * Returns an infinite-length generator-like array of 24 planet IDs.
 */
function getChaldeanSequence(startPlanetId: number): number[] {
  const startIdx = CHALDEAN_ORDER.indexOf(startPlanetId);
  if (startIdx === -1) return Array(24).fill(0);
  const seq: number[] = [];
  for (let i = 0; i < 24; i++) {
    seq.push(CHALDEAN_ORDER[(startIdx + i) % 7]);
  }
  return seq;
}

export function computeHoraTable(
  sunrise: string,
  sunset: string,
  nextSunrise: string,
  varaDay: number // 0=Sunday per JD convention
): HoraSlot[] {
  const sunriseMin = timeToMinutes(sunrise);
  let sunsetMin = timeToMinutes(sunset);
  let nextSunriseMin = timeToMinutes(nextSunrise);

  // Handle midnight crossing
  if (sunsetMin <= sunriseMin) sunsetMin += 1440;
  if (nextSunriseMin <= sunsetMin) nextSunriseMin += 1440;

  const dayDuration = (sunsetMin - sunriseMin) / 12;
  const nightDuration = (nextSunriseMin - sunsetMin) / 12;

  const startPlanet = VARA_START_PLANET[varaDay % 7];
  const sequence = getChaldeanSequence(startPlanet);

  const slots: HoraSlot[] = [];

  // 12 day horas
  for (let i = 0; i < 12; i++) {
    const start = sunriseMin + i * dayDuration;
    const end = sunriseMin + (i + 1) * dayDuration;
    slots.push({
      planetId: sequence[i],
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      isDay: true,
      activities: HORA_PLANET_ACTIVITIES[sequence[i]],
    });
  }

  // 12 night horas
  for (let i = 0; i < 12; i++) {
    const start = sunsetMin + i * nightDuration;
    const end = sunsetMin + (i + 1) * nightDuration;
    slots.push({
      planetId: sequence[12 + i],
      startTime: minutesToTime(start),
      endTime: minutesToTime(end),
      isDay: false,
      activities: HORA_PLANET_ACTIVITIES[sequence[12 + i]],
    });
  }

  return slots;
}

/**
 * Find the currently active hora slot given the current time.
 */
export function getCurrentHora(horaTable: HoraSlot[], nowTime: string): HoraSlot | null {
  const now = timeToMinutes(nowTime);
  for (const slot of horaTable) {
    const start = timeToMinutes(slot.startTime);
    let end = timeToMinutes(slot.endTime);
    // Handle midnight crossing
    if (end <= start) {
      if (now >= start || now < end) return slot;
    } else {
      if (now >= start && now < end) return slot;
    }
  }
  return null;
}

/**
 * Get all hora windows for a specific planet today.
 */
export function getHoraWindowsForPlanet(horaTable: HoraSlot[], planetId: number): HoraSlot[] {
  return horaTable.filter(s => s.planetId === planetId);
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/hora-engine.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Run tsc**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: No new errors

- [ ] **Step 6: Commit**

```bash
git add src/lib/panchang/hora-engine.ts src/lib/__tests__/hora-engine.test.ts
git commit -m "feat: add Hora engine with Chaldean sequence computation"
```

---

### Task 2: Export calcAscendant from astronomical.ts

**Files:**
- Modify: `src/lib/ephem/astronomical.ts`

The `calcAscendant()` function is currently a closure inside `computePanchang()` in panchang-calc.ts. The smart search needs it as a standalone export. Extract it to astronomical.ts.

- [ ] **Step 1: Add exported calcAscendant to astronomical.ts**

Add at the end of `src/lib/ephem/astronomical.ts`:

```typescript
/**
 * Compute the ascendant (lagna) degree for a given JD and geographic coordinates.
 * Returns tropical longitude of the ascending point (0-360).
 * To get sidereal: subtract lahiriAyanamsha(jd).
 */
export function calcAscendant(jd: number, lat: number, lng: number): number {
  const T2 = (jd - 2451545.0) / 36525.0;
  const gmst = 280.46061837 + 360.98564736629 * (jd - 2451545.0)
    + 0.000387933 * T2 * T2 - T2 * T2 * T2 / 38710000;
  const lst = normalizeDeg(gmst + lng);
  const eps = 23.4393 - 0.013 * T2;
  const epsRad = eps * Math.PI / 180;
  const latRad = lat * Math.PI / 180;
  const lstRad = lst * Math.PI / 180;
  const y = -Math.cos(lstRad);
  const x = Math.sin(epsRad) * Math.tan(latRad) + Math.cos(epsRad) * Math.sin(lstRad);
  return normalizeDeg(Math.atan2(y, x) * 180 / Math.PI);
}
```

Note: `normalizeDeg` is already defined in astronomical.ts — no new imports needed.

- [ ] **Step 2: Verify tsc passes**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`

- [ ] **Step 3: Commit**

```bash
git add src/lib/ephem/astronomical.ts
git commit -m "feat: export calcAscendant() from astronomical.ts for standalone use"
```

---

### Task 3: Prescription Engine + Tests

**Files:**
- Create: `src/lib/remedies/prescription-engine.ts`
- Create: `src/lib/__tests__/prescription-engine.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/prescription-engine.test.ts`. Tests should verify:
- `generateDailyPrescription()` returns an array of `RemedyPrescription`
- Maximum 3 prescriptions per day
- Dosha-linked planets get `urgency: 'critical'`
- Each prescription has non-empty mantra, charity, and reason
- Planets with no weakness are excluded
- Hora windows are correctly matched to planets

Read the existing test pattern from `src/lib/__tests__/vedic-profile.test.ts` for `makeKundali()` helper and use the same pattern.

Build a mock kundali with a debilitated Saturn in house 7 and check that Saturn remedy appears with `urgency: 'critical'`.

Build a mock horaTable with Saturn hora at 14:15-15:10 and check it appears in `optimalWindows`.

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/prescription-engine.test.ts`

- [ ] **Step 3: Create prescription-engine.ts**

Create `src/lib/remedies/prescription-engine.ts`. The engine should:

1. Import `generateGemstoneRecommendations` from `./gemstone-engine` to get planet weakness scores
2. Import `PLANET_REMEDIES_FULL` from `@/lib/tippanni/remedies-enhanced` for mantra/charity/gemstone data
3. Import `getHoraWindowsForPlanet` from `@/lib/panchang/hora-engine`
4. Import types from `@/types/kundali` and `@/types/panchang`

Core logic:
- Score each planet 0-100 for need (from gemstone-engine)
- Filter planets with score > 20 (need remediation)
- For each: find today's hora windows, check vara match, pull remedy data
- Generate reason from chart context (house, dignity, dasha relevance)
- Sort by urgency, cap at 3
- Return `RemedyPrescription[]`

Also export `getVaraRemedies()` for logged-out users — thin wrapper that returns the vara lord's remedy data with hora windows.

Define the `RemedyPrescription` and `VaraRemedy` interfaces as specified in the design spec.

- [ ] **Step 4: Run tests to verify they pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/remedies/prescription-engine.ts src/lib/__tests__/prescription-engine.test.ts
git commit -m "feat: add Remedy Prescription engine with timed hora windows"
```

---

### Task 4: Smart Muhurta Search Engine + Tests

**Files:**
- Create: `src/lib/muhurta/smart-search.ts`
- Create: `src/lib/__tests__/smart-search.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/__tests__/smart-search.test.ts`. Tests:
- `coarseScan()` returns ranked days with scores
- `fineScan()` returns time windows within a day
- Windows are merged when consecutive slices score above threshold
- Lagna Shuddhi filtering removes windows with malefics in 1/7/8
- Top 3 windows returned sorted by score
- Each window has complete proof breakdown

- [ ] **Step 2: Run tests to verify they fail**

- [ ] **Step 3: Create smart-search.ts**

Create `src/lib/muhurta/smart-search.ts`. The engine should:

1. Export `smartMuhurtaSearch(params, userSnapshot?)` — the main entry point
2. Export `coarseScan(params)` — Pass 1: scan date range in 4-hour chunks, return top 5 days
3. Export `fineScan(date, params, userSnapshot?)` — Pass 2: scan one day in 15-min slices
4. Import `scorePanchangFactors` from `./ai-recommender` for panchang scoring
5. Import `calcAscendant` from `@/lib/ephem/astronomical` for lagna computation
6. Import `computeHoraTable` from `@/lib/panchang/hora-engine` for hora matching
7. Import `computePanchang` from `@/lib/ephem/panchang-calc` for per-slice panchang data
8. Import activity rules from `./activity-rules-extended` for lagna shuddhi rules

Define `MuhurtaWindow` interface with score, breakdown (panchang/lagna/hora/personal), and proof object as specified in the design spec.

Pass 1 logic:
- For each day in range, compute panchang at sunrise, +4h, +8h, noon, +4h, sunset
- Score each chunk with `scorePanchangFactors()`
- Rank days by peak score, return top 5

Pass 2 logic:
- For each 15-min slice from sunrise to next sunrise:
  - Panchang score from factors
  - Lagna: `calcAscendant(jd, lat, lng)` → sidereal sign → check no malefics in 1/7/8
  - Hora: match against activity's `goodHoras`
  - Personal (if snapshot): tarabalam + chandrabalam + dasha harmony
  - Composite = weighted sum (25 each)
- Merge consecutive high-scoring slices into windows
- Return top 3

- [ ] **Step 4: Run tests to verify they pass**

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/smart-search.ts src/lib/__tests__/smart-search.test.ts
git commit -m "feat: add two-pass Smart Muhurta Search engine with lagna shuddhi"
```

---

### Task 5: Smart Muhurta Search API Route

**Files:**
- Create: `src/app/api/muhurta-search/route.ts`

- [ ] **Step 1: Create API route**

The route accepts POST with `{ query: string, lat?: number, lng?: number, birthData?: {...} }`.

1. Send user query to Claude for parameter extraction (activity, dates, location)
2. Validate extracted params against EXTENDED_ACTIVITIES keys
3. Call `smartMuhurtaSearch()` with extracted params
4. If birthData provided, build UserSnapshot for personalized scoring
5. Return `{ windows: MuhurtaWindow[], extractedParams: {...} }`

Use the existing `authedFetch` pattern from other API routes. Use `ANTHROPIC_API_KEY` env var for Claude calls (or the AI SDK if already configured).

Handle errors: invalid activity → suggest closest match, missing dates → default to next 30 days, missing location → return error asking for location.

- [ ] **Step 2: Verify tsc passes**

- [ ] **Step 3: Commit**

```bash
git add src/app/api/muhurta-search/route.ts
git commit -m "feat: add muhurta-search API route with LLM parameter extraction"
```

---

### Task 6: Enhance Panchang Page — Hora Activities + Remedy Cards

**Files:**
- Modify: `src/app/[locale]/panchang/PanchangClient.tsx`

- [ ] **Step 1: Add activities column to existing Hora section**

The panchang page already has a Hora section at line ~2429 using `panchang.hora`. Enhance each hora card to show the activity text from `HORA_PLANET_ACTIVITIES`. Import the constant from hora-engine.

- [ ] **Step 2: Add remedy section**

After the Hora section (before Planetary Positions), add a new "Today's Remedies" section:
- Add `id="sec-remedies"` and add "Remedies" to the sticky nav
- If user is logged in and has saved chart data (from `useBirthDataStore()`):
  - Compute hora table from panchang sunrise/sunset
  - Call `generateDailyPrescription(kundali, horaTable, panchang, locale)`
  - Render up to 3 full prescription cards
- If not logged in:
  - Call `getVaraRemedies(panchang.vara.day, horaTable, locale)`
  - Render single vara remedy card

Each prescription card shows: planet icon, urgency badge, optimal hora window, mantra (beej + vedic), charity with direction, gemstone info, color, "why this remedy" explanation.

- [ ] **Step 3: Verify tsc + test in browser**

- [ ] **Step 4: Commit**

```bash
git add 'src/app/[locale]/panchang/PanchangClient.tsx'
git commit -m "feat: add hora activities + personalized remedy cards to panchang page"
```

---

### Task 7: Enhance Kundali RemediesTab

**Files:**
- Modify: `src/components/kundali/RemediesTab.tsx`

- [ ] **Step 1: Add timing and full prescription to each gemstone card**

For each gemstone recommendation:
- Add "Today's Window" showing the planet's hora times
- Add mantra section (beej + repetition count)
- Add charity section (item, recipient, direction)
- Add color of the day
- Add "Best Day" indicator
- Add "Why" explanation from chart context

Import `computeHoraTable`, `getHoraWindowsForPlanet`, `HORA_PLANET_ACTIVITIES` from hora-engine.
Import `PLANET_REMEDIES_FULL` from tippanni/remedies-enhanced.
Compute hora table from the panchang data available via the kundali page's panchang state (or compute inline from sunrise/sunset if needed).

- [ ] **Step 2: Verify tsc + test in browser**

- [ ] **Step 3: Commit**

```bash
git add src/components/kundali/RemediesTab.tsx
git commit -m "feat: enhance RemediesTab with timed prescriptions and full remedy cards"
```

---

### Task 8: Muhurta AI Page — NL Search Bar + Proof Cards

**Files:**
- Modify: `src/app/[locale]/muhurta-ai/page.tsx`

- [ ] **Step 1: Add search bar above activity grid**

Add a text input with:
- Placeholder: "Ask: 'Best time for a wedding in Delhi, Oct 10-25'"
- Submit button
- Loading state: "Scanning [N] time windows..."
- Error state for failed extraction

- [ ] **Step 2: Add proof cards for results**

When results return, render Top 3 window cards:
- Date and time range prominently displayed
- Score gauge (0-100 with color: green > 70, amber > 40, red < 40)
- Breakdown bars: Panchang / Lagna / Hora / Personal (each 0-25)
- Expandable "Calculation Proof" section:
  - Tithi name + quality
  - Nakshatra name + quality
  - Yoga name + quality
  - Lagna sign + quality (Sthira/Chara/Dvisvabhava)
  - Hora planet + match status
  - Special yogas (Amrita Siddhi, etc.)
  - Dasha harmony (if logged in)
- "Why this is good" plain-language summary (2-3 sentences)

- [ ] **Step 3: Wire to API**

On submit, POST to `/api/muhurta-search` with `{ query, lat, lng, birthData }`.
Location from the location store. Birth data from auth store if logged in.

- [ ] **Step 4: Verify tsc + test in browser**

- [ ] **Step 5: Commit**

```bash
git add 'src/app/[locale]/muhurta-ai/page.tsx'
git commit -m "feat: add natural language Muhurta search with proof cards"
```

---

### Task 9: Full Test Suite + Build Verification

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass (existing + new hora/prescription/smart-search tests)

- [ ] **Step 2: Run tsc**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: Zero errors

- [ ] **Step 3: Run build**

Run: `npx next build`
Expected: Build succeeds

- [ ] **Step 4: Commit any fixes**

- [ ] **Step 5: Push**

```bash
git push origin main
```

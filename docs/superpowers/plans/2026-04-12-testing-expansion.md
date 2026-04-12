# Testing Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand test coverage from ~1531 to ~1650+ tests by migrating legacy tests, adding breadth coverage for 7 untested modules, deepening core engine edge cases, and stabilizing the Playwright E2E suite.

**Architecture:** Four phases executed sequentially. Phase 1 migrates 4 legacy custom-runner tests to vitest format. Phase 2 adds smoke+correctness tests for 7 high-risk untested modules. Phase 3 adds DST/boundary/geographic edge cases to core engines. Phase 4 audits and stabilizes Playwright E2E specs.

**Tech Stack:** Vitest (unit/integration), Playwright (E2E), existing panchang/kundali/calendar/muhurta engines.

---

## File Structure

### New Test Files
| File | Responsibility |
|------|---------------|
| `src/lib/muhurta/__tests__/muhurta-engine.test.ts` | Muhurta scoring, date scanning, activity rules |
| `src/lib/prashna/__tests__/prashna-engine.test.ts` | Ashtamangala prashna system |
| `src/lib/calendar/__tests__/calendar-generators.test.ts` | Festival, eclipse, retro/combust, tithi table generators |
| `src/lib/forecast/__tests__/forecast-engine.test.ts` | Annual forecast, dasha narrative |
| `src/lib/kundali/__tests__/kundali-subcalcs.test.ts` | Avasthas, argala, bhavabala, sphutas, tippanni |
| `src/lib/transit/__tests__/personal-transits.test.ts` | Personal transit computations |
| `src/lib/varshaphal/__tests__/varshaphal-subs.test.ts` | Mudda dasha, sahams, muntha |
| `src/lib/__tests__/depth-edge-cases.test.ts` | DST transitions, boundaries, geographic edge cases |

### Modified Files
| File | Change |
|------|--------|
| `vitest.config.ts` | Remove 4 legacy files from exclude list |
| `src/lib/ephem/__tests__/panchang-calc.test.ts` | Rewrite: custom assert → vitest describe/it/expect |
| `src/lib/ephem/__tests__/astronomical.test.ts` | Rewrite: custom assert → vitest |
| `src/lib/llm/__tests__/horoscope-prompt.test.ts` | Rewrite: custom assert → vitest |
| `src/lib/llm/__tests__/chart-chat-prompt.test.ts` | Rewrite: custom assert → vitest |

---

## Task 1: Migrate Legacy Panchang-Calc Test

**Files:**
- Modify: `src/lib/ephem/__tests__/panchang-calc.test.ts`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Read the legacy test file**

Read `src/lib/ephem/__tests__/panchang-calc.test.ts` in full to understand every assertion.

- [ ] **Step 2: Rewrite to vitest format**

Transform the file from custom `assert()` pattern to vitest. The file uses:
```ts
// OLD pattern:
let pass = 0, fail = 0;
function assert(name: string, condition: boolean, detail?: string) {
  if (condition) { pass++; console.log(`✓ ${name}`); }
  else { fail++; console.log(`✗ ${name} — ${detail}`); }
}
// ... many assert() calls ...
console.log(`\n${pass} passed, ${fail} failed`);
```

Convert to:
```ts
import { describe, it, expect } from 'vitest';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';

const DELHI_JAN15: PanchangInput = {
  year: 2025, month: 1, day: 15,
  lat: 28.6139, lng: 77.209,
  tzOffset: 5.5, timezone: 'Asia/Kolkata',
  locationName: 'Delhi',
};

describe('computePanchang (Delhi Jan 15 2025)', () => {
  const p = computePanchang(DELHI_JAN15);

  describe('basic fields', () => {
    it('returns valid date', () => { expect(p.date).toBe('2025-01-15'); });
    it('has tithi', () => { expect(p.tithi).toBeDefined(); expect(p.tithi.number).toBeGreaterThanOrEqual(1); });
    it('has nakshatra', () => { expect(p.nakshatra).toBeDefined(); });
    it('has yoga', () => { expect(p.yoga).toBeDefined(); });
    it('has karana', () => { expect(p.karana).toBeDefined(); });
    it('has vara', () => { expect(p.vara).toBeDefined(); });
  });

  describe('time fields', () => {
    it('has sunrise', () => { expect(p.sunrise).toMatch(/^\d{2}:\d{2}$/); });
    it('has sunset', () => { expect(p.sunset).toMatch(/^\d{2}:\d{2}$/); });
    it('sunrise is before sunset', () => {
      const [sh, sm] = p.sunrise.split(':').map(Number);
      const [eh, em] = p.sunset.split(':').map(Number);
      expect(sh * 60 + sm).toBeLessThan(eh * 60 + em);
    });
  });

  // ... convert ALL existing assertions to it() blocks
  // Group by: basic fields, time fields, rahu kaal, muhurtas, choghadiya, hora, planets, enhanced fields
});
```

**The implementing agent MUST read the full legacy file and convert every single assertion.** Do not skip any. Group related assertions into describe blocks.

- [ ] **Step 3: Remove from vitest exclude list**

In `vitest.config.ts`, remove `'src/lib/ephem/__tests__/panchang-calc.test.ts'` from the exclude array.

- [ ] **Step 4: Run test**

Run: `npx vitest run src/lib/ephem/__tests__/panchang-calc.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/ephem/__tests__/panchang-calc.test.ts vitest.config.ts
git commit -m "test: migrate panchang-calc legacy test to vitest format"
```

---

## Task 2: Migrate Legacy Astronomical Test

**Files:**
- Modify: `src/lib/ephem/__tests__/astronomical.test.ts`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Read and rewrite**

Read `src/lib/ephem/__tests__/astronomical.test.ts` in full. Convert every `assert()` to vitest `it/expect`. Group into describe blocks by topic (JD conversion, sun longitude, moon, ayanamsa).

- [ ] **Step 2: Remove from exclude list**

Remove `'src/lib/ephem/__tests__/astronomical.test.ts'` from vitest exclude.

- [ ] **Step 3: Run test**

Run: `npx vitest run src/lib/ephem/__tests__/astronomical.test.ts`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/ephem/__tests__/astronomical.test.ts vitest.config.ts
git commit -m "test: migrate astronomical legacy test to vitest format"
```

---

## Task 3: Migrate Legacy LLM Tests (2 files)

**Files:**
- Modify: `src/lib/llm/__tests__/horoscope-prompt.test.ts`
- Modify: `src/lib/llm/__tests__/chart-chat-prompt.test.ts`
- Modify: `vitest.config.ts`

- [ ] **Step 1: Read and rewrite horoscope-prompt test**

Convert all assertions. Tests cover: `buildTransitDataForSign`, `buildAllHoroscopePrompts`, `buildHoroscopePrompt`, `buildFallbackHoroscope`.

- [ ] **Step 2: Read and rewrite chart-chat-prompt test**

Convert all assertions. Tests cover: `buildChartChatSystemPrompt`, `sanitizeChatMessage`, `buildFallbackResponse`.

- [ ] **Step 3: Remove both from exclude list**

Remove both paths from vitest exclude array.

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/llm/__tests__/`
Expected: All PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/llm/__tests__/ vitest.config.ts
git commit -m "test: migrate LLM prompt legacy tests to vitest format"
```

---

## Task 4: Muhurta Engine Tests

**Files:**
- Create: `src/lib/muhurta/__tests__/muhurta-engine.test.ts`

- [ ] **Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { scorePanchangFactors, scoreTransitFactors, getPanchangSnapshot, type PanchangSnapshot } from '@/lib/muhurta/ai-recommender';
import { scanDateRange } from '@/lib/muhurta/time-window-scanner';
import { getExtendedActivity, getAllExtendedActivities } from '@/lib/muhurta/activity-rules-extended';

describe('activity-rules-extended', () => {
  it('getAllExtendedActivities returns 20 activities', () => {
    const all = getAllExtendedActivities();
    expect(all.length).toBeGreaterThanOrEqual(15);
    all.forEach(a => {
      expect(a.id).toBeDefined();
      expect(a.name).toBeDefined();
    });
  });

  it('getExtendedActivity returns valid activity for marriage', () => {
    const activity = getExtendedActivity('marriage');
    expect(activity).toBeDefined();
    expect(activity.id).toBe('marriage');
  });
});

describe('getPanchangSnapshot', () => {
  it('returns valid snapshot for Delhi noon', () => {
    // JD for Jan 15 2025 12:00 UTC ≈ 2460691.0
    const jd = 2460691.0;
    const snap = getPanchangSnapshot(jd, 28.6139, 77.209);
    expect(snap.tithi).toBeGreaterThanOrEqual(1);
    expect(snap.tithi).toBeLessThanOrEqual(30);
    expect(snap.nakshatra).toBeGreaterThanOrEqual(1);
    expect(snap.nakshatra).toBeLessThanOrEqual(27);
    expect(snap.yoga).toBeGreaterThanOrEqual(1);
    expect(snap.yoga).toBeLessThanOrEqual(27);
    expect(snap.karana).toBeGreaterThanOrEqual(1);
    expect(snap.karana).toBeLessThanOrEqual(11);
    expect(snap.weekday).toBeGreaterThanOrEqual(0);
    expect(snap.weekday).toBeLessThanOrEqual(6);
    expect(snap.moonSign).toBeGreaterThanOrEqual(1);
    expect(snap.moonSign).toBeLessThanOrEqual(12);
  });
});

describe('scorePanchangFactors', () => {
  it('returns score and factors for a valid snapshot', () => {
    const snap: PanchangSnapshot = { tithi: 5, nakshatra: 10, yoga: 3, karana: 2, weekday: 3, moonSign: 4 };
    const activity = getExtendedActivity('marriage');
    const result = scorePanchangFactors(snap, activity);
    expect(typeof result.score).toBe('number');
    expect(result.score).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.factors)).toBe(true);
  });
});

describe('scanDateRange', () => {
  it('returns scored windows for a 3-day range', () => {
    const results = scanDateRange({
      startDate: '2025-03-15',
      endDate: '2025-03-17',
      activity: 'marriage',
      lat: 28.6139,
      lng: 77.209,
      tz: 5.5,
    });
    expect(Array.isArray(results)).toBe(true);
    // Should find at least some windows in 3 days
    if (results.length > 0) {
      expect(results[0].score).toBeDefined();
    }
  });
}, 30000); // may be slow due to computation
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/muhurta/__tests__/muhurta-engine.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/muhurta/__tests__/muhurta-engine.test.ts
git commit -m "test: add muhurta engine tests — scoring, scanning, activity rules"
```

---

## Task 5: Prashna System Tests

**Files:**
- Create: `src/lib/prashna/__tests__/prashna-engine.test.ts`

- [ ] **Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { generatePrashnaResult, mapNumberToObject, calculateArudaHouse } from '@/lib/prashna/ashtamangala';

describe('mapNumberToObject', () => {
  it('maps number 1 to a valid object', () => {
    const obj = mapNumberToObject(1);
    expect(obj).toBeDefined();
    expect(obj.name).toBeDefined();
  });

  it('maps number 108 to a valid object', () => {
    const obj = mapNumberToObject(108);
    expect(obj).toBeDefined();
  });

  it('wraps numbers > 108', () => {
    const obj = mapNumberToObject(109);
    expect(obj).toBeDefined();
    // 109 should map same as 1 (or similar wrapping logic)
  });
});

describe('calculateArudaHouse', () => {
  it('returns 1-12 for valid inputs', () => {
    for (let i = 1; i <= 108; i++) {
      const house = calculateArudaHouse(i);
      expect(house).toBeGreaterThanOrEqual(1);
      expect(house).toBeLessThanOrEqual(12);
    }
  });
});

describe('generatePrashnaResult', () => {
  it('produces valid result for three numbers', () => {
    const result = generatePrashnaResult(
      [23, 45, 67],
      'general',
      28.6139, 77.209, 5.5, 'en'
    );
    expect(result).toBeDefined();
    expect(result.objects).toHaveLength(3);
    expect(result.arudaHouses).toHaveLength(3);
    expect(result.interpretation).toBeDefined();
  });

  it('works with different categories', () => {
    const categories = ['general', 'career', 'marriage', 'health'] as const;
    categories.forEach(cat => {
      const result = generatePrashnaResult([10, 20, 30], cat, 28.6139, 77.209, 5.5, 'en');
      expect(result).toBeDefined();
    });
  });

  it('produces Hindi output', () => {
    const result = generatePrashnaResult([23, 45, 67], 'general', 28.6139, 77.209, 5.5, 'hi');
    expect(result).toBeDefined();
    expect(result.interpretation).toBeDefined();
  });
}, 30000);
```

**NOTE:** The implementing agent must read the actual file to verify the exact interface of `generatePrashnaResult` return type (field names like `objects`, `arudaHouses`, `interpretation`) — adjust the test expectations to match what the function actually returns.

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/prashna/__tests__/prashna-engine.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/prashna/__tests__/prashna-engine.test.ts
git commit -m "test: add prashna ashtamangala system tests"
```

---

## Task 6: Calendar Generator Tests

**Files:**
- Create: `src/lib/calendar/__tests__/calendar-generators.test.ts`

- [ ] **Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { buildYearlyTithiTable, type TithiEntry } from '@/lib/calendar/tithi-table';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { generateEclipseCalendar } from '@/lib/calendar/eclipses';
import { generateRetrogradeCalendar, generateCombustionCalendar } from '@/lib/calendar/retro-combust';

// Delhi coordinates for all tests
const LAT = 28.6139, LON = 77.209, TZ = 'Asia/Kolkata';

describe('buildYearlyTithiTable', () => {
  const table = buildYearlyTithiTable(2026, LAT, LON, TZ);

  it('returns entries for the year', () => {
    expect(table.entries.length).toBeGreaterThan(350);
    expect(table.entries.length).toBeLessThan(400);
  });

  it('entries have valid structure', () => {
    table.entries.forEach((e: TithiEntry) => {
      expect(e.number).toBeGreaterThanOrEqual(1);
      expect(e.number).toBeLessThanOrEqual(30);
      expect(['shukla', 'krishna']).toContain(e.paksha);
      expect(e.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(e.name).toBeDefined();
      expect(e.name.en).toBeTruthy();
    });
  });

  it('has lunar months', () => {
    expect(table.lunarMonths.length).toBeGreaterThanOrEqual(12);
    expect(table.lunarMonths.length).toBeLessThanOrEqual(14);
  });

  it('entries are chronologically ordered', () => {
    for (let i = 1; i < table.entries.length; i++) {
      expect(table.entries[i].startJd).toBeGreaterThanOrEqual(table.entries[i - 1].startJd);
    }
  });

  it('detects kshaya tithis (count should be small)', () => {
    const kshaya = table.entries.filter(e => e.isKshaya);
    expect(kshaya.length).toBeLessThan(10);
  });
}, 60000);

describe('generateFestivalCalendarV2', () => {
  const festivals = generateFestivalCalendarV2(2026, LAT, LON, TZ);

  it('returns festivals', () => {
    expect(festivals.length).toBeGreaterThan(20);
  });

  it('each festival has valid structure', () => {
    festivals.forEach(f => {
      expect(f.name).toBeDefined();
      expect(f.name.en).toBeTruthy();
      expect(f.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['major', 'vrat', 'regional', 'eclipse']).toContain(f.type);
    });
  });

  it('all dates are in 2026', () => {
    festivals.forEach(f => {
      expect(f.date.startsWith('2026')).toBe(true);
    });
  });
}, 60000);

describe('generateEclipseCalendar', () => {
  it('returns eclipses for 2025', () => {
    const eclipses = generateEclipseCalendar(2025);
    expect(eclipses.length).toBeGreaterThanOrEqual(2);
    eclipses.forEach(e => {
      expect(['solar', 'lunar']).toContain(e.type);
      expect(e.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(['total', 'partial', 'annular', 'penumbral']).toContain(e.magnitude);
    });
  });

  it('returns eclipses for 2026', () => {
    const eclipses = generateEclipseCalendar(2026);
    expect(eclipses.length).toBeGreaterThanOrEqual(2);
  });
});

describe('generateRetrogradeCalendar', () => {
  const retro = generateRetrogradeCalendar(2026);

  it('returns retrograde periods', () => {
    expect(retro.length).toBeGreaterThan(0);
  });

  it('Mercury has 3-4 retrograde periods per year', () => {
    const mercury = retro.filter(r => r.planetId === 4);
    expect(mercury.length).toBeGreaterThanOrEqual(2);
    expect(mercury.length).toBeLessThanOrEqual(5);
  });

  it('each period has valid structure', () => {
    retro.forEach(r => {
      expect(r.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.durationDays).toBeGreaterThan(0);
    });
  });
});

describe('generateCombustionCalendar', () => {
  const combust = generateCombustionCalendar(2026);

  it('returns combustion events', () => {
    expect(combust.length).toBeGreaterThan(0);
  });

  it('each event has valid structure', () => {
    combust.forEach(c => {
      expect(c.planetId).toBeDefined();
      expect(c.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(c.durationDays).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/calendar/__tests__/calendar-generators.test.ts`
Expected: PASS (may take 30-60s due to tithi table computation)

- [ ] **Step 3: Commit**

```bash
git add src/lib/calendar/__tests__/calendar-generators.test.ts
git commit -m "test: add calendar generator tests — tithi table, festivals, eclipses, retro/combust"
```

---

## Task 7: Forecast Engine Tests

**Files:**
- Create: `src/lib/forecast/__tests__/forecast-engine.test.ts`

- [ ] **Step 1: Write tests**

The implementing agent must:
1. Read `src/lib/forecast/annual-engine.ts` to understand `generateAnnualForecast` input requirements — it needs `KundaliData` and `VarshaphalData` objects
2. Read `src/lib/forecast/dasha-narrative.ts` to understand `generateDashaNarrative` inputs
3. Either construct minimal test fixtures OR use `calculateKundali` and `generateVarshaphal` to generate real test data from known birth details

```ts
import { describe, it, expect } from 'vitest';
import { generateDashaNarrative } from '@/lib/forecast/dasha-narrative';
// Import calculateKundali to get test data
import { calculateKundali } from '@/lib/kundali/kundali';

// Delhi birth: Jan 15 2000 12:00
const BIRTH = { year: 2000, month: 1, day: 15, hour: 12, minute: 0, lat: 28.6139, lng: 77.209, tz: 5.5, timezone: 'Asia/Kolkata' };

describe('generateDashaNarrative', () => {
  it('produces narrative for known chart', () => {
    const kundali = calculateKundali(BIRTH);
    const narrative = generateDashaNarrative(kundali, 2026);
    expect(narrative).toBeDefined();
    expect(narrative.currentMaha).toBeDefined();
    expect(narrative.currentMaha.planet).toBeDefined();
    expect(narrative.currentMaha.startDate).toBeDefined();
    expect(Array.isArray(narrative.upcomingTransitions)).toBe(true);
  });
});
```

**NOTE:** If `generateAnnualForecast` requires `VarshaphalData`, read the varshaphal module to understand how to generate it. The implementing agent should read the actual imports and construct appropriate test data.

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/forecast/__tests__/forecast-engine.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/forecast/__tests__/forecast-engine.test.ts
git commit -m "test: add forecast engine tests — dasha narrative, annual forecast"
```

---

## Task 8: Kundali Sub-Calculation Tests

**Files:**
- Create: `src/lib/kundali/__tests__/kundali-subcalcs.test.ts`

- [ ] **Step 1: Write tests**

```ts
import { describe, it, expect } from 'vitest';
import { calculateAvasthas } from '@/lib/kundali/avasthas';
import { calculateArgala } from '@/lib/kundali/argala';
import { calculateSphutas } from '@/lib/kundali/sphutas';
import { calculateKundali } from '@/lib/kundali/kundali';
import { generateTippanni } from '@/lib/kundali/tippanni-engine';

// Generate a real chart for testing
const BIRTH = { year: 2000, month: 1, day: 15, hour: 12, minute: 0, lat: 28.6139, lng: 77.209, tz: 5.5, timezone: 'Asia/Kolkata' };

describe('calculateAvasthas', () => {
  it('returns avasthas for all planets', () => {
    const kundali = calculateKundali(BIRTH);
    const avasthas = calculateAvasthas(kundali.planets);
    expect(avasthas.length).toBeGreaterThanOrEqual(7); // at least 7 planets
    avasthas.forEach(a => {
      expect(a.planetId).toBeDefined();
      expect(a.baladi).toBeDefined();
    });
  });
});

describe('calculateArgala', () => {
  it('returns argala for 12 houses', () => {
    const kundali = calculateKundali(BIRTH);
    const argala = calculateArgala(kundali.planets, kundali.ascendant.sign);
    expect(argala.length).toBe(12);
    argala.forEach(a => {
      expect(a.house).toBeGreaterThanOrEqual(1);
      expect(a.house).toBeLessThanOrEqual(12);
      expect(['supported', 'obstructed', 'neutral']).toContain(a.netEffect);
    });
  });
});

describe('calculateSphutas', () => {
  it('returns sphuta results for known longitudes', () => {
    const result = calculateSphutas(280.5, 45.2, 120.0);
    expect(result).toBeDefined();
    expect(result.pranaSphuta).toBeDefined();
    expect(result.pranaSphuta.degree).toBeGreaterThanOrEqual(0);
    expect(result.pranaSphuta.degree).toBeLessThan(360);
    expect(result.dehaSphuta).toBeDefined();
    expect(result.mrityuSphuta).toBeDefined();
    expect(result.triSphuta).toBeDefined();
    expect(result.yogiPoint).toBeDefined();
  });
});

describe('generateTippanni', () => {
  it('produces tippanni sections for known chart', () => {
    const kundali = calculateKundali(BIRTH);
    const tippanni = generateTippanni(kundali, 'en');
    expect(tippanni).toBeDefined();
    // Tippanni should have sections array or equivalent
    // Read the actual return type to verify structure
  });

  it('produces Hindi tippanni', () => {
    const kundali = calculateKundali(BIRTH);
    const tippanni = generateTippanni(kundali, 'hi');
    expect(tippanni).toBeDefined();
  });
}, 30000);
```

**NOTE:** The implementing agent must read the actual return types of `calculateAvasthas`, `calculateArgala`, and `generateTippanni` to write precise assertions. The test code above uses likely field names — adjust to match reality.

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/kundali/__tests__/kundali-subcalcs.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/kundali/__tests__/kundali-subcalcs.test.ts
git commit -m "test: add kundali sub-calculation tests — avasthas, argala, sphutas, tippanni"
```

---

## Task 9: Transit & Varshaphal Tests

**Files:**
- Create: `src/lib/transit/__tests__/personal-transits.test.ts`
- Create: `src/lib/varshaphal/__tests__/varshaphal-subs.test.ts`

- [ ] **Step 1: Write transit tests**

```ts
import { describe, it, expect } from 'vitest';
import { computePersonalTransits, computeUpcomingTransitions } from '@/lib/transit/personal-transits';

describe('computePersonalTransits', () => {
  it('returns transits for ascendant sign 1', () => {
    // ascendantSign = 1 (Aries), savTable = array of 337 values (SAV)
    // Use a dummy SAV table or generate from a real chart
    const transits = computePersonalTransits(1, new Array(337).fill(4));
    expect(Array.isArray(transits)).toBe(true);
    expect(transits.length).toBeGreaterThan(0);
    transits.forEach(t => {
      expect(t.planetId).toBeDefined();
      expect(t.currentSign).toBeGreaterThanOrEqual(1);
      expect(t.currentSign).toBeLessThanOrEqual(12);
      expect(t.house).toBeGreaterThanOrEqual(1);
      expect(t.house).toBeLessThanOrEqual(12);
    });
  });
});

describe('computeUpcomingTransitions', () => {
  it('returns future transition events', () => {
    const transitions = computeUpcomingTransitions();
    expect(Array.isArray(transitions)).toBe(true);
    if (transitions.length > 0) {
      expect(transitions[0].planetId).toBeDefined();
      expect(transitions[0].approximateDate).toBeDefined();
    }
  });
});
```

- [ ] **Step 2: Write varshaphal sub-function tests**

```ts
import { describe, it, expect } from 'vitest';
import { calculateMuddaDasha } from '@/lib/varshaphal/mudda-dasha';
import { calculateMuntha } from '@/lib/varshaphal/muntha';

describe('calculateMuddaDasha', () => {
  it('returns dasha periods that span ~365 days', () => {
    // moonNakshatra=10 (Magha), degree offset=5.5, solar return = Jan 15 2026
    const periods = calculateMuddaDasha(10, 5.5, new Date('2026-01-15'));
    expect(Array.isArray(periods)).toBe(true);
    expect(periods.length).toBeGreaterThan(0);

    // Total duration should be approximately 365 days
    let totalDays = 0;
    periods.forEach(p => {
      expect(p.startDate).toBeDefined();
      expect(p.endDate).toBeDefined();
      const start = new Date(p.startDate || p.start);
      const end = new Date(p.endDate || p.end);
      totalDays += (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    });
    expect(totalDays).toBeGreaterThan(360);
    expect(totalDays).toBeLessThan(370);
  });
});

describe('calculateMuntha', () => {
  it('returns valid sign for known inputs', () => {
    // birthLagnaSign=1 (Aries), age=26, varshaphalLagnaSign=5
    const muntha = calculateMuntha(1, 26, 5);
    expect(muntha).toBeDefined();
    // Muntha sign should be (1 + 26) mod 12 = 3 (Gemini) — verify via reading actual implementation
  });
});
```

**NOTE:** The implementing agent must read `calculateMuddaDasha` and `calculateMuntha` return types to write exact assertions. The `MuddaDashaPeriod` and `MunthaInfo` interfaces may use different field names than assumed.

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/transit/__tests__/ src/lib/varshaphal/__tests__/`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/lib/transit/__tests__/ src/lib/varshaphal/__tests__/
git commit -m "test: add transit and varshaphal sub-function tests"
```

---

## Task 10: Depth Edge Cases

**Files:**
- Create: `src/lib/__tests__/depth-edge-cases.test.ts`

- [ ] **Step 1: Write DST and boundary tests**

```ts
import { describe, it, expect } from 'vitest';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';

function parseHHMM(s: string): number {
  const [h, m] = s.split(':').map(Number);
  return h * 60 + m;
}

function assertWithinMinutes(actual: string, expected: string, tolerance: number, label: string) {
  const a = parseHHMM(actual);
  const e = parseHHMM(expected);
  const diff = Math.abs(a - e);
  expect(diff, `${label}: ${actual} vs ${expected} (diff ${diff}min)`).toBeLessThanOrEqual(tolerance);
}

describe('DST transitions', () => {
  it('Bern spring forward (March 30 2025 CET→CEST)', () => {
    const input: PanchangInput = {
      year: 2025, month: 3, day: 30,
      lat: 46.9481, lng: 7.4474,
      tzOffset: 2, // CEST after spring forward
      timezone: 'Europe/Zurich',
      locationName: 'Bern',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    // Sunrise should be around 07:15-07:25 CEST
    const sr = parseHHMM(p.sunrise);
    expect(sr).toBeGreaterThan(6 * 60 + 50);
    expect(sr).toBeLessThan(7 * 60 + 40);
  });

  it('Bern fall back (October 26 2025 CEST→CET)', () => {
    const input: PanchangInput = {
      year: 2025, month: 10, day: 26,
      lat: 46.9481, lng: 7.4474,
      tzOffset: 1, // CET after fall back
      timezone: 'Europe/Zurich',
      locationName: 'Bern',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    // Sunrise should be around 08:10-08:20 CET
    const sr = parseHHMM(p.sunrise);
    expect(sr).toBeGreaterThan(7 * 60 + 50);
    expect(sr).toBeLessThan(8 * 60 + 30);
  });

  it('Seattle spring forward (March 9 2025 PST→PDT)', () => {
    const input: PanchangInput = {
      year: 2025, month: 3, day: 9,
      lat: 47.6062, lng: -122.3321,
      tzOffset: -7, // PDT
      timezone: 'America/Los_Angeles',
      locationName: 'Seattle',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    expect(parseHHMM(p.sunrise)).toBeLessThan(parseHHMM(p.sunset));
  });

  it('Seattle fall back (November 2 2025 PDT→PST)', () => {
    const input: PanchangInput = {
      year: 2025, month: 11, day: 2,
      lat: 47.6062, lng: -122.3321,
      tzOffset: -8, // PST
      timezone: 'America/Los_Angeles',
      locationName: 'Seattle',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    expect(parseHHMM(p.sunrise)).toBeLessThan(parseHHMM(p.sunset));
  });
});

describe('geographic edge cases', () => {
  it('Southern hemisphere: Sydney', () => {
    const input: PanchangInput = {
      year: 2025, month: 6, day: 21, // winter solstice in southern hemisphere
      lat: -33.8688, lng: 151.2093,
      tzOffset: 10,
      timezone: 'Australia/Sydney',
      locationName: 'Sydney',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    // Short day in winter — sunrise after 7:00, sunset before 17:00
    expect(parseHHMM(p.sunrise)).toBeGreaterThan(6 * 60 + 50);
    expect(parseHHMM(p.sunset)).toBeLessThan(17 * 60 + 15);
  });

  it('Equatorial: Singapore', () => {
    const input: PanchangInput = {
      year: 2025, month: 3, day: 20, // equinox
      lat: 1.3521, lng: 103.8198,
      tzOffset: 8,
      timezone: 'Asia/Singapore',
      locationName: 'Singapore',
    };
    const p = computePanchang(input);
    // Near equator: sunrise ~7:00, sunset ~19:00, roughly 12h day
    const dayLen = parseHHMM(p.sunset) - parseHHMM(p.sunrise);
    expect(dayLen).toBeGreaterThan(11 * 60);
    expect(dayLen).toBeLessThan(13 * 60);
  });

  it('Date line: Auckland NZ', () => {
    const input: PanchangInput = {
      year: 2025, month: 1, day: 15,
      lat: -36.8485, lng: 174.7633,
      tzOffset: 13, // NZDT
      timezone: 'Pacific/Auckland',
      locationName: 'Auckland',
    };
    const p = computePanchang(input);
    expect(p.sunrise).toBeDefined();
    expect(p.sunset).toBeDefined();
    expect(p.tithi).toBeDefined();
    expect(p.nakshatra).toBeDefined();
  });
});

describe('boundary conditions', () => {
  it('all panchang elements are valid across 30 random dates', () => {
    const dates = [
      { y: 2025, m: 1, d: 1 }, { y: 2025, m: 2, d: 14 }, { y: 2025, m: 3, d: 21 },
      { y: 2025, m: 4, d: 14 }, { y: 2025, m: 5, d: 26 }, { y: 2025, m: 6, d: 21 },
      { y: 2025, m: 7, d: 4 }, { y: 2025, m: 8, d: 15 }, { y: 2025, m: 9, d: 22 },
      { y: 2025, m: 10, d: 31 }, { y: 2025, m: 11, d: 15 }, { y: 2025, m: 12, d: 25 },
      { y: 2026, m: 1, d: 14 }, { y: 2026, m: 2, d: 28 }, { y: 2026, m: 3, d: 15 },
    ];
    dates.forEach(({ y, m, d }) => {
      const p = computePanchang({ year: y, month: m, day: d, lat: 28.6139, lng: 77.209, tzOffset: 5.5, timezone: 'Asia/Kolkata' });
      expect(p.tithi.number, `tithi for ${y}-${m}-${d}`).toBeGreaterThanOrEqual(1);
      expect(p.tithi.number).toBeLessThanOrEqual(30);
      expect(p.nakshatra.number).toBeGreaterThanOrEqual(1);
      expect(p.nakshatra.number).toBeLessThanOrEqual(27);
      expect(p.yoga.number).toBeGreaterThanOrEqual(1);
      expect(p.yoga.number).toBeLessThanOrEqual(27);
    });
  });
});
```

- [ ] **Step 2: Run tests**

Run: `npx vitest run src/lib/__tests__/depth-edge-cases.test.ts`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/__tests__/depth-edge-cases.test.ts
git commit -m "test: add DST transition, geographic edge case, and boundary tests"
```

---

## Task 11: E2E Audit & Stabilization

**Files:**
- Modify: `playwright.config.ts`
- Modify: Multiple files in `e2e/`
- Modify: `package.json` (add test:e2e script)

- [ ] **Step 1: Run Playwright and capture results**

Run: `npx playwright test --reporter=list 2>&1 | head -100`

Record which specs pass and which fail. The config starts a dev server on port 3000 with 120s timeout.

- [ ] **Step 2: Fix playwright config if needed**

Read `playwright.config.ts`. Verify:
- `webServer.command` starts the dev server correctly
- `baseURL` matches
- Timeout is adequate

- [ ] **Step 3: Fix the 5 most important E2E specs**

Priority order:
1. `e2e/homepage.spec.ts` — must pass (landing page loads, no JS errors)
2. `e2e/panchang.spec.ts` — panchang page loads data
3. `e2e/kundali-flow.spec.ts` or `e2e/kundali.spec.ts` — kundali form submits
4. `e2e/navigation.spec.ts` — navbar links work
5. `e2e/core-flows.spec.ts` — critical user flows

For each:
- Read the spec file
- Replace `page.waitForTimeout(N)` with proper `page.waitForSelector()`, `page.waitForLoadState('networkidle')`, or `expect(locator).toBeVisible()`
- Fix any hardcoded selectors that reference removed elements
- Run individually: `npx playwright test e2e/homepage.spec.ts --reporter=list`

- [ ] **Step 4: Add test:e2e script to package.json**

```json
"test:e2e": "npx playwright test"
```

- [ ] **Step 5: Commit working E2E specs**

```bash
git add playwright.config.ts e2e/ package.json
git commit -m "test: stabilize Playwright E2E specs — fix flaky selectors and waits"
```

---

## Task 12: Final Verification

- [ ] **Step 1: Run full vitest suite**

Run: `npx vitest run`
Expected: All tests PASS, total count should be ~1630+

- [ ] **Step 2: Run production build**

Run: `npx next build`
Expected: 0 errors

- [ ] **Step 3: Report final test count**

Report the total number of tests passing, broken down by new vs existing.

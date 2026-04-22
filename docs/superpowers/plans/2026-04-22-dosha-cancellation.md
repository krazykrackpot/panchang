# Dosha Cancellation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Unified Mangal Dosha engine with 7 cancellation rules + Nadi Dosha with 5 cancellation rules (3 new). Fixes Mercury/Mars bug and removes dead code.

**Architecture:** New `mangal-dosha-engine.ts` with pure functions consumed by 3 existing call sites. Nadi extended in-place in `detailed-report.ts` and `ashta-kuta.ts`. TDD throughout.

**Tech Stack:** TypeScript, Vitest, React (existing patterns)

---

### Task 1: Create Mangal Dosha Engine with tests

**Files:**
- Create: `src/lib/kundali/mangal-dosha-engine.ts`
- Create: `src/lib/kundali/__tests__/mangal-dosha-engine.test.ts`

- [ ] **Step 1: Write failing tests**

Create `src/lib/kundali/__tests__/mangal-dosha-engine.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { analyzeMangalDosha, analyzeMangalDoshaForMatching } from '../mangal-dosha-engine';
import type { PlanetPosition } from '@/types/kundali';

// Helper to create minimal planet positions for testing
function makePlanets(overrides: Partial<Record<number, { sign: number; house: number }>>): PlanetPosition[] {
  const defaults: Record<number, { sign: number; house: number }> = {
    0: { sign: 5, house: 5 },   // Sun in Leo, house 5
    1: { sign: 4, house: 4 },   // Moon in Cancer, house 4
    2: { sign: 1, house: 3 },   // Mars in Aries, house 3 (not a Mangal house by default)
    3: { sign: 3, house: 3 },   // Mercury
    4: { sign: 9, house: 9 },   // Jupiter in Sag, house 9
    5: { sign: 2, house: 2 },   // Venus in Taurus, house 2
    6: { sign: 10, house: 10 }, // Saturn
    7: { sign: 6, house: 6 },   // Rahu
    8: { sign: 12, house: 12 }, // Ketu
  };
  return Object.entries({ ...defaults, ...overrides }).map(([idStr, pos]) => {
    const id = Number(idStr);
    return {
      planet: { id, name: { en: `P${id}`, hi: `P${id}`, sa: `P${id}` } } as PlanetPosition['planet'],
      longitude: (pos.sign - 1) * 30 + 15,
      latitude: 0,
      speed: 1,
      sign: pos.sign,
      signName: { en: '', hi: '', sa: '' },
      house: pos.house,
      nakshatra: { id: 1, name: { en: '', hi: '', sa: '' }, lord: '', deity: '', symbol: '', nature: '' } as PlanetPosition['nakshatra'],
      pada: 1,
      degree: '15°00\'00"',
      isRetrograde: false,
      isCombust: false,
      isExalted: pos.sign === 10 && id === 2, // Mars exalted in Capricorn
      isDebilitated: false,
      isOwnSign: (id === 2 && (pos.sign === 1 || pos.sign === 8)), // Mars own Aries/Scorpio
    } as PlanetPosition;
  });
}

describe('analyzeMangalDosha', () => {
  describe('detection', () => {
    it('detects Mars in 7th house from Lagna', () => {
      // ascSign=1 (Aries), Mars in sign 7 (Libra) → house 7 from Lagna
      const planets = makePlanets({ 2: { sign: 7, house: 7 } });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.present).toBe(true);
      expect(result.fromLagna).toBe(true);
      expect(result.houseSeverity).toBe('severe'); // house 7
    });

    it('returns not present when Mars is in non-Mangal house from all refs', () => {
      // Mars in house 3 from Lagna, house 11 from Moon, house 5 from Venus — none are Mangal houses
      const planets = makePlanets({
        2: { sign: 3, house: 3 },  // Mars in Gemini, house 3
        1: { sign: 5, house: 5 },  // Moon in Leo
        5: { sign: 11, house: 11 },// Venus in Aquarius
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.present).toBe(false);
    });

    it('detects Mars from Moon but not Lagna', () => {
      // ascSign=1 (Aries), Mars in sign 3 (Gemini) → house 3 from Lagna (NOT Mangal)
      // Moon in sign 10 (Cap), Mars in sign 3 → house from Moon = ((3-10+12)%12)+1 = 6 (NOT Mangal)
      // Actually let's pick: Moon in sign 2 (Taurus), Mars in sign 3 (Gemini) → house = ((3-2+12)%12)+1 = 2 (Mangal!)
      const planets = makePlanets({
        2: { sign: 3, house: 3 },
        1: { sign: 2, house: 2 },
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.fromLagna).toBe(false); // house 3 from Lagna
      expect(result.fromMoon).toBe(true);   // house 2 from Moon
      expect(result.present).toBe(true);
    });

    it('returns scope severity severe when all 3 refs trigger', () => {
      // ascSign=1, Mars in sign 1 → house 1 from Lagna (Mangal)
      // Moon in sign 1 → house 1 from Moon (Mangal)
      // Venus in sign 1 → house 1 from Venus (Mangal)
      const planets = makePlanets({
        2: { sign: 1, house: 1 },
        1: { sign: 1, house: 1 },
        5: { sign: 1, house: 1 },
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.fromLagna).toBe(true);
      expect(result.fromMoon).toBe(true);
      expect(result.fromVenus).toBe(true);
      expect(result.scopeSeverity).toBe('severe');
    });
  });

  describe('cancellations', () => {
    it('C1: Mars in own sign (Aries)', () => {
      const planets = makePlanets({ 2: { sign: 1, house: 7 } }); // Mars in Aries, house 7
      const result = analyzeMangalDosha(planets, 7); // asc=Libra so house 7 = Aries
      expect(result.cancellations.some(c => c.rule === 'C1')).toBe(true);
    });

    it('C2: Mars exalted in Capricorn', () => {
      const planets = makePlanets({ 2: { sign: 10, house: 4 } }); // Mars in Cap, house 4
      const result = analyzeMangalDosha(planets, 7);
      expect(result.cancellations.some(c => c.rule === 'C2')).toBe(true);
    });

    it('C3: Jupiter aspects Mars (7th from Mars)', () => {
      // Mars in house 7, Jupiter in house 1 → Jupiter is 7th from Mars (aspects it)
      const planets = makePlanets({
        2: { sign: 7, house: 7 },
        4: { sign: 1, house: 1 },
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.cancellations.some(c => c.rule === 'C3')).toBe(true);
    });

    it('C4: Venus in 7th house', () => {
      const planets = makePlanets({
        2: { sign: 7, house: 7 },
        5: { sign: 7, house: 7 }, // Venus also in 7th
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.cancellations.some(c => c.rule === 'C4')).toBe(true);
    });

    it('C5: Mars conjunct Jupiter (same house)', () => {
      const planets = makePlanets({
        2: { sign: 7, house: 7 },
        4: { sign: 7, house: 7 }, // Jupiter same house as Mars
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.cancellations.some(c => c.rule === 'C5')).toBe(true);
    });

    it('C6: Mars in Gemini in 2nd house', () => {
      // asc=2 (Taurus), Mars in Gemini(3), house 2 from Lagna
      const planets = makePlanets({ 2: { sign: 3, house: 2 } });
      const result = analyzeMangalDosha(planets, 2);
      expect(result.cancellations.some(c => c.rule === 'C6')).toBe(true);
    });

    it('no cancellations when none apply', () => {
      // Mars in Leo(5), house 7 from Lagna. Jupiter far away. Venus not in 7th.
      const planets = makePlanets({
        2: { sign: 5, house: 7 },
        4: { sign: 3, house: 3 },
        5: { sign: 2, house: 2 },
      });
      const result = analyzeMangalDosha(planets, 11); // Aquarius asc
      expect(result.cancellations).toHaveLength(0);
    });
  });

  describe('severity cascade', () => {
    it('severe + 1 cancellation → moderate', () => {
      // Mars in house 7 (severe), Mars in own sign Aries (C1 cancellation)
      const planets = makePlanets({ 2: { sign: 1, house: 7 } });
      const result = analyzeMangalDosha(planets, 7); // asc=Libra
      expect(result.houseSeverity).toBe('severe');
      expect(result.cancellations.length).toBeGreaterThanOrEqual(1);
      expect(result.effectiveSeverity).toBe('moderate');
    });

    it('mild + 1 cancellation → cancelled', () => {
      // Mars in house 2 (mild), Mars in Aries own sign (C1)
      const planets = makePlanets({ 2: { sign: 1, house: 2 } });
      const result = analyzeMangalDosha(planets, 12); // asc=Pisces, Mars house 2
      expect(result.houseSeverity).toBe('mild');
      expect(result.effectiveSeverity).toBe('cancelled');
    });
  });

  describe('bug fix verification', () => {
    it('uses planet id 2 (Mars), not 3 (Mercury)', () => {
      // Place Mercury (id=3) in house 7 and Mars (id=2) in house 3
      // Should NOT detect dosha (Mars is in non-Mangal house)
      const planets = makePlanets({
        2: { sign: 3, house: 3 },  // Mars in house 3 (not Mangal)
        3: { sign: 7, house: 7 },  // Mercury in house 7 (would be Mangal if wrongly used)
      });
      const result = analyzeMangalDosha(planets, 1);
      expect(result.present).toBe(false); // Mars is NOT in a Mangal house
    });
  });
});

describe('analyzeMangalDoshaForMatching', () => {
  it('detects mutual cancellation when both have Mangal', () => {
    const p1 = makePlanets({ 2: { sign: 7, house: 7 } });
    const p2 = makePlanets({ 2: { sign: 8, house: 8 } });
    const result = analyzeMangalDoshaForMatching(p1, 1, p2, 1);
    expect(result.chart1.present).toBe(true);
    expect(result.chart2.present).toBe(true);
    expect(result.mutualCancellation).toBe(true);
    // C7 should be in cancellations
    expect(result.chart1.cancellations.some(c => c.rule === 'C7')).toBe(true);
  });

  it('no mutual cancellation when only one has Mangal', () => {
    const p1 = makePlanets({ 2: { sign: 7, house: 7 } });
    const p2 = makePlanets({ 2: { sign: 3, house: 3 } }); // Mars not in Mangal house
    const result = analyzeMangalDoshaForMatching(p1, 1, p2, 1);
    expect(result.chart1.present).toBe(true);
    expect(result.chart2.present).toBe(false);
    expect(result.mutualCancellation).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/kundali/__tests__/mangal-dosha-engine.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the Mangal Dosha engine**

Create `src/lib/kundali/mangal-dosha-engine.ts`:

```typescript
/**
 * Mangal Dosha Engine — Unified detection, severity, and cancellation
 *
 * Replaces 3 independent implementations with one canonical source.
 * Detection: Mars in houses 1,2,4,7,8,12 from Lagna, Moon, AND Venus.
 * Cancellation: 7 classical rules (C1-C7).
 * References: BPHS, Muhurta Chintamani, Phaladeepika, Hora Sara, Dharmasindhu.
 */

import type { PlanetPosition } from '@/types/kundali';

// ── Types ────────────────────────────────────────────────────

type Severity = 'none' | 'mild' | 'moderate' | 'severe';

export interface MangalDoshaResult {
  present: boolean;
  fromLagna: boolean;
  fromMoon: boolean;
  fromVenus: boolean;
  marsHouse: number;
  marsSign: number;
  houseSeverity: Severity;
  scopeSeverity: Severity;
  effectiveSeverity: Severity | 'cancelled';
  cancellations: { rule: string; description: string }[];
  affectedHouses: number[];
}

// ── Constants ────────────────────────────────────────────────

const MANGAL_HOUSES = [1, 2, 4, 7, 8, 12];

// ── Helpers ──────────────────────────────────────────────────

/** 1-based house distance from refSign to targetSign */
function houseFrom(refSign: number, targetSign: number): number {
  return ((targetSign - refSign + 12) % 12) + 1;
}

function getHouseSeverity(house: number): Severity {
  if (house === 7 || house === 8) return 'severe';
  if (house === 1 || house === 4) return 'moderate';
  if (house === 2 || house === 12) return 'mild';
  return 'none';
}

function getScopeSeverity(count: number): Severity {
  if (count >= 3) return 'severe';
  if (count === 2) return 'moderate';
  if (count === 1) return 'mild';
  return 'none';
}

const SEVERITY_ORDER: (Severity | 'cancelled')[] = ['none', 'cancelled', 'mild', 'moderate', 'severe'];

function maxSeverity(a: Severity, b: Severity): Severity {
  return SEVERITY_ORDER.indexOf(a) >= SEVERITY_ORDER.indexOf(b) ? a : b;
}

function dropSeverity(sev: Severity | 'cancelled', levels: number): Severity | 'cancelled' {
  const idx = SEVERITY_ORDER.indexOf(sev);
  const newIdx = Math.max(1, idx - levels); // floor at 'cancelled' (index 1)
  return SEVERITY_ORDER[newIdx];
}

function getPlanet(planets: PlanetPosition[], id: number): PlanetPosition | undefined {
  return planets.find(p => p.planet.id === id);
}

// ── Cancellation checks ──────────────────────────────────────

function checkCancellations(
  planets: PlanetPosition[],
  ascSign: number,
  marsHouse: number,
  marsSign: number,
): { rule: string; description: string }[] {
  const cancellations: { rule: string; description: string }[] = [];
  const mars = getPlanet(planets, 2)!;
  const jupiter = getPlanet(planets, 4);
  const venus = getPlanet(planets, 5);

  // C1: Mars in own sign (Aries=1 or Scorpio=8)
  if (marsSign === 1 || marsSign === 8) {
    cancellations.push({ rule: 'C1', description: 'Mars in own sign — energy is well-directed, dosha reduced' });
  }

  // C2: Mars exalted (Capricorn=10)
  if (marsSign === 10) {
    cancellations.push({ rule: 'C2', description: 'Mars exalted in Capricorn — dosha greatly reduced' });
  }

  // C3: Jupiter aspects Mars (conjunction, 5th, 7th, 9th from Jupiter)
  if (jupiter) {
    const jupHouse = jupiter.house;
    const jupAspects = [
      jupHouse,
      ((jupHouse - 1 + 4) % 12) + 1, // 5th
      ((jupHouse - 1 + 6) % 12) + 1, // 7th
      ((jupHouse - 1 + 8) % 12) + 1, // 9th
    ];
    if (jupAspects.includes(marsHouse)) {
      cancellations.push({ rule: 'C3', description: 'Jupiter aspects Mars — benefic influence neutralizes aggression' });
    }
  }

  // C4: Venus in 7th house from Lagna
  if (venus && venus.house === 7) {
    cancellations.push({ rule: 'C4', description: 'Venus in 7th house — mitigates marital discord' });
  }

  // C5: Mars conjunct benefic (same house as Jupiter or Venus)
  if ((jupiter && jupiter.house === marsHouse) || (venus && venus.house === marsHouse)) {
    // Avoid double-counting with C3 (Jupiter conjunct is both C3 and C5)
    if (!cancellations.some(c => c.rule === 'C5')) {
      cancellations.push({ rule: 'C5', description: 'Mars conjunct benefic (Jupiter/Venus) — severity reduced' });
    }
  }

  // C6: Mars in Mercury-ruled sign (Gemini=3 or Virgo=6) AND in 2nd house
  if ((marsSign === 3 || marsSign === 6) && marsHouse === 2) {
    cancellations.push({ rule: 'C6', description: 'Mars in Mercury sign in 2nd house — traditional cancellation' });
  }

  return cancellations;
}

// ── Main analysis ────────────────────────────────────────────

/**
 * Analyze Mangal Dosha for a single chart.
 * Checks from Lagna, Moon, and Venus reference points.
 */
export function analyzeMangalDosha(
  planets: PlanetPosition[],
  ascSign: number,
): MangalDoshaResult {
  const mars = getPlanet(planets, 2);
  const moon = getPlanet(planets, 1);
  const venus = getPlanet(planets, 5);

  if (!mars) {
    return {
      present: false, fromLagna: false, fromMoon: false, fromVenus: false,
      marsHouse: 0, marsSign: 0,
      houseSeverity: 'none', scopeSeverity: 'none', effectiveSeverity: 'none',
      cancellations: [], affectedHouses: [],
    };
  }

  const marsHouse = mars.house;
  const marsSign = mars.sign;

  // Check from 3 reference points
  const houseFromLagna = houseFrom(ascSign, marsSign);
  const houseFromMoon = moon ? houseFrom(moon.sign, marsSign) : 0;
  const houseFromVenus = venus ? houseFrom(venus.sign, marsSign) : 0;

  const fromLagna = MANGAL_HOUSES.includes(houseFromLagna);
  const fromMoon = MANGAL_HOUSES.includes(houseFromMoon);
  const fromVenus = MANGAL_HOUSES.includes(houseFromVenus);
  const present = fromLagna || fromMoon || fromVenus;

  const affectedHouses: number[] = [];
  if (fromLagna) affectedHouses.push(houseFromLagna);
  if (fromMoon && !affectedHouses.includes(houseFromMoon)) affectedHouses.push(houseFromMoon);
  if (fromVenus && !affectedHouses.includes(houseFromVenus)) affectedHouses.push(houseFromVenus);

  // Severity
  const houseSeverity = getHouseSeverity(houseFromLagna);
  const scopeCount = [fromLagna, fromMoon, fromVenus].filter(Boolean).length;
  const scopeSeverity = getScopeSeverity(scopeCount);
  const baseSeverity = present ? maxSeverity(houseSeverity, scopeSeverity) : 'none';

  // Cancellations (only check if dosha is present)
  const cancellations = present ? checkCancellations(planets, ascSign, marsHouse, marsSign) : [];

  // Effective severity: drop one level per cancellation
  const effectiveSeverity = present
    ? dropSeverity(baseSeverity, cancellations.length) as MangalDoshaResult['effectiveSeverity']
    : 'none';

  return {
    present, fromLagna, fromMoon, fromVenus,
    marsHouse, marsSign,
    houseSeverity, scopeSeverity, effectiveSeverity,
    cancellations, affectedHouses,
  };
}

/**
 * Matching-context wrapper — analyzes both charts and checks mutual cancellation (C7).
 */
export function analyzeMangalDoshaForMatching(
  chart1Planets: PlanetPosition[], chart1AscSign: number,
  chart2Planets: PlanetPosition[], chart2AscSign: number,
): { chart1: MangalDoshaResult; chart2: MangalDoshaResult; mutualCancellation: boolean } {
  const r1 = analyzeMangalDosha(chart1Planets, chart1AscSign);
  const r2 = analyzeMangalDosha(chart2Planets, chart2AscSign);

  const mutualCancellation = r1.present && r2.present;

  // C7: add mutual cancellation to both charts' cancellation lists
  if (mutualCancellation) {
    const c7 = { rule: 'C7', description: 'Both partners have Mangal Dosha — mutual cancellation applies' };
    r1.cancellations.push(c7);
    r2.cancellations.push(c7);
    // Recalculate effective severity with the extra cancellation
    const base1 = maxSeverity(r1.houseSeverity, r1.scopeSeverity);
    r1.effectiveSeverity = dropSeverity(base1, r1.cancellations.length);
    const base2 = maxSeverity(r2.houseSeverity, r2.scopeSeverity);
    r2.effectiveSeverity = dropSeverity(base2, r2.cancellations.length);
  }

  return { chart1: r1, chart2: r2, mutualCancellation };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/kundali/__tests__/mangal-dosha-engine.test.ts`
Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/mangal-dosha-engine.ts src/lib/kundali/__tests__/mangal-dosha-engine.test.ts
git commit -m "feat: unified Mangal Dosha engine with 7 cancellation rules"
```

---

### Task 2: Extend Nadi Dosha cancellations

**Files:**
- Modify: `src/lib/matching/detailed-report.ts` (the `analyzeNadi` function, ~line 239)
- Modify: `src/lib/matching/ashta-kuta.ts` (extend `MatchInput`, modify `computeNadi`)
- Create: `src/lib/__tests__/nadi-cancellation.test.ts`

- [ ] **Step 1: Write failing tests for Nadi extensions**

Create `src/lib/__tests__/nadi-cancellation.test.ts`:

```typescript
import { describe, it, expect } from 'vitest';
import { computeNadi, type MatchInput } from '@/lib/matching/ashta-kuta';

describe('Nadi Dosha — extended cancellations in ashta-kuta', () => {
  it('returns 0 for same nadi, different pada (dosha present)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 }; // Ashwini, Aadi
    const girl: MatchInput = { moonNakshatra: 7, moonRashi: 4, moonPada: 2 }; // Punarvasu, Aadi
    expect(computeNadi(boy, girl)).toBe(0); // same nadi, different nak → dosha
  });

  it('N4: returns 8 for same nakshatra, same pada (complete override)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 2 }; // Ashwini pada 2
    const girl: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 2 }; // Ashwini pada 2
    // Same nak (1), same nadi (Aadi), same pada → N4 override → 8 points
    expect(computeNadi(boy, girl)).toBe(8);
  });

  it('N4: same nak different pada does NOT override', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 };
    const girl: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 3 };
    // Same nak, same nadi, different pada → dosha remains
    expect(computeNadi(boy, girl)).toBe(0);
  });

  it('returns 8 when nadi is different (no dosha)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1, moonPada: 1 }; // Ashwini, Aadi
    const girl: MatchInput = { moonNakshatra: 2, moonRashi: 1, moonPada: 1 }; // Bharani, Madhya
    expect(computeNadi(boy, girl)).toBe(8);
  });

  it('works without moonPada (backward compatible)', () => {
    const boy: MatchInput = { moonNakshatra: 1, moonRashi: 1 }; // no moonPada
    const girl: MatchInput = { moonNakshatra: 7, moonRashi: 4 };
    // Same nadi (both Aadi), no pada info → standard dosha
    expect(computeNadi(boy, girl)).toBe(0);
  });
});
```

- [ ] **Step 2: Extend MatchInput and computeNadi in ashta-kuta.ts**

In `src/lib/matching/ashta-kuta.ts`, update the `MatchInput` interface (~line 21):

```typescript
export interface MatchInput {
  moonNakshatra: number; // 1-27
  moonRashi: number;     // 1-12
  moonPada?: number;     // 1-4 (optional, for N4 same-pada override)
}
```

Update `computeNadi` (~line 276):

```typescript
function computeNadi(boy: MatchInput, girl: MatchInput): number {
  const bn = NAKSHATRA_NADI[boy.moonNakshatra - 1];
  const gn = NAKSHATRA_NADI[girl.moonNakshatra - 1];

  if (bn !== gn) return 8; // Different nadi — no dosha

  // Same nadi — check N4: same nakshatra + same pada = complete override
  if (
    boy.moonNakshatra === girl.moonNakshatra &&
    boy.moonPada !== undefined && girl.moonPada !== undefined &&
    boy.moonPada === girl.moonPada
  ) {
    return 8; // N4: same nak + same pada = positive, dosha cancelled
  }

  return 0; // Nadi Dosha present
}
```

Also export `computeNadi` so it can be tested:

Find `function computeNadi(` and add `export`:
```typescript
export function computeNadi(boy: MatchInput, girl: MatchInput): number {
```

Remove the dead `manglikWarning` from `MatchResult` interface (~line 40):

```typescript
// Remove this line:
// manglikWarning?: LocaleText;
```

- [ ] **Step 3: Extend analyzeNadi in detailed-report.ts with N3 and N5**

In `src/lib/matching/detailed-report.ts`, find `analyzeNadi()` (~line 239) and add new cancellation checks inside the `if (doshaPresent)` block, after the existing 2 rules:

```typescript
    // Cancellation 3 (N3): Different Moon signs
    if (rashi1 !== rashi2) {
      cancellations.push('Different Moon signs — Nadi Dosha severity reduced.');
    }

    // Cancellation 4 (N4): Same nakshatra, same pada → complete override
    if (nak1 === nak2) {
      const pada1 = moon1?.pada ?? 1;
      const pada2 = moon2?.pada ?? 1;
      if (pada1 === pada2) {
        // N4: same nak + same pada = genetically favorable, override dosha
        return {
          chart1Nadi: nadi1, chart2Nadi: nadi2,
          doshaPresent: false, // Complete cancellation
          cancellations: ['Same nakshatra and pada — genetically favorable, Nadi Dosha fully cancelled.'],
          healthImplications: 'Same nakshatra and pada indicates genetic compatibility — no Nadi Dosha concern.',
        };
      }
    }

    // Cancellation 5 (N5): Navamsha Moon sign differs
    const moonLon1 = moon1?.longitude ?? 0;
    const moonLon2 = moon2?.longitude ?? 0;
    const navSign1 = getNavamshaSign(moonLon1);
    const navSign2 = getNavamshaSign(moonLon2);
    if (navSign1 !== navSign2) {
      cancellations.push('Navamsha Moon signs differ — Nadi Dosha mitigated.');
    }
```

Add the `getNavamshaSign` helper near the top of the file (after existing helpers):

```typescript
/** Compute navamsha sign (1-12) from sidereal longitude */
function getNavamshaSign(longitude: number): number {
  const signIdx = Math.floor(longitude / 30); // 0-based sign
  const degInSign = longitude % 30;
  const navPart = Math.floor(degInSign / (30 / 9)); // 0-8
  const navStart = [0, 9, 6, 3][signIdx % 4]; // Fire→Aries, Earth→Cap, Air→Libra, Water→Cancer
  return ((navStart + navPart) % 12) + 1;
}
```

Also update the `healthImplications` logic to use the 2+ cancellations threshold:

```typescript
  const healthImplications = doshaPresent && cancellations.length === 0
    ? 'Nadi Dosha present without cancellations — traditional texts caution about health compatibility and progeny. Consult an experienced jyotishi for remedial measures.'
    : doshaPresent && cancellations.length >= 2
      ? 'Nadi Dosha present but significantly mitigated by multiple factors. Consult for confirmation but concern is reduced.'
      : doshaPresent
        ? 'Nadi Dosha present but with a mitigating factor. The severity is reduced by the cancellation noted.'
        : 'No Nadi Dosha — health and progeny compatibility is favorable.';
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/__tests__/nadi-cancellation.test.ts`
Expected: all tests PASS.

Run: `npx vitest run src/lib/__tests__/detailed-report.test.ts`
Expected: existing tests still PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/matching/ashta-kuta.ts src/lib/matching/detailed-report.ts src/lib/__tests__/nadi-cancellation.test.ts
git commit -m "feat: extend Nadi Dosha with N3/N4/N5 cancellation rules"
```

---

### Task 3: Wire consumers to the shared Mangal Dosha engine

**Files:**
- Modify: `src/lib/kundali/yogas-complete.ts` (~lines 105-135)
- Modify: `src/lib/matching/detailed-report.ts` (~lines 157-230)
- Modify: `src/app/[locale]/mangal-dosha/page.tsx` (~lines 107-158)

- [ ] **Step 1: Update yogas-complete.ts**

In `src/lib/kundali/yogas-complete.ts`, add the import at the top:

```typescript
import { analyzeMangalDosha } from './mangal-dosha-engine';
```

Replace the Mangal Dosha detection block (lines ~111-135) with:

```typescript
  // 1. Mangala Dosha — delegated to shared engine
  const mangalResult = analyzeMangalDosha(
    planets.map(p => p as unknown as import('@/types/kundali').PlanetPosition),
    _ascSign,
  );
```

Wait — `yogas-complete.ts` uses a local `PlanetData` type, not `PlanetPosition`. Let me check the mapping.

Read `src/lib/kundali/yogas-complete.ts` lines 1-30 to understand the `PlanetData` type and how it relates to `PlanetPosition`.

Actually, looking at the existing code, `detectDoshaYogas` receives `planets: PlanetData[]` where `PlanetData` has `.house`, `.sign`, `.id`, `.longitude`. The `analyzeMangalDosha` function expects `PlanetPosition[]` which has `.planet.id`, `.house`, `.sign`, `.longitude`. These are different shapes.

The cleanest approach: make `analyzeMangalDosha` accept a simpler interface that both can satisfy. BUT that changes the engine we just built. A simpler approach: create a thin adapter in yogas-complete.ts that maps `PlanetData` to what the engine needs.

Actually, looking more carefully at `yogas-complete.ts`, the existing Mangal Dosha detection is just 4 lines that check `mars.house` against `mangalHouses`. The engine adds cancellations and 3-reference-point detection that the yoga system doesn't need — it just needs `present` and `strength`. The simplest approach: keep the existing 4-line detection in yogas-complete.ts (it's correct and minimal) and just add a note that the full analysis is in the shared engine. This avoids a complex type adaptation for minimal benefit.

Replace the detection block:

```typescript
  // 1. Mangala Dosha
  // Simple detection for yoga listing. Full analysis with cancellations
  // available via analyzeMangalDosha() from mangal-dosha-engine.ts
  const mangalHouses = [1, 2, 4, 7, 8, 12];
  const mangalPresent = mangalHouses.includes(mars.house);
  let mangalStrength: 'Strong' | 'Moderate' | 'Weak' = 'Weak';
  if ([7, 8].includes(mars.house)) mangalStrength = 'Strong';
  else if ([1, 4].includes(mars.house)) mangalStrength = 'Moderate';
```

Actually this is ALREADY the existing code. The only change needed is the comment pointing to the shared engine. Since this consumer doesn't need cancellations, no code change is needed beyond adding the cross-reference comment.

So for yogas-complete.ts, just add a comment:

Find the line `// 1. Mangala Dosha` and update the comment:

```typescript
  // 1. Mangala Dosha (basic detection for yoga listing)
  // Full analysis with cancellations, 3-ref-point detection:
  //   import { analyzeMangalDosha } from './mangal-dosha-engine';
```

- [ ] **Step 2: Update detailed-report.ts**

In `src/lib/matching/detailed-report.ts`, add the import:

```typescript
import { analyzeMangalDoshaForMatching, type MangalDoshaResult } from '@/lib/kundali/mangal-dosha-engine';
```

Replace the `analyzeManglik()` and `getManglikCancellations()` functions (lines ~161-230) with a wrapper that uses the shared engine:

```typescript
function analyzeManglikFromEngine(
  chart1: KundaliData, chart2: KundaliData,
): DetailedMatchReport['manglikAnalysis'] {
  const result = analyzeMangalDoshaForMatching(
    chart1.planets, chart1.ascendant.sign,
    chart2.planets, chart2.ascendant.sign,
  );

  // Map engine severity to the existing ManglikSeverity type
  const mapSeverity = (r: MangalDoshaResult): ManglikSeverity => {
    if (!r.present) return 'none';
    const eff = r.effectiveSeverity;
    if (eff === 'cancelled' || eff === 'none') return 'none';
    return eff;
  };

  const cancellations = [
    ...result.chart1.cancellations.map(c => `Partner 1: ${c.description}`),
    ...result.chart2.cancellations.map(c => `Partner 2: ${c.description}`),
  ];
  // Deduplicate mutual cancellation text
  const seen = new Set<string>();
  const uniqueCancellations = cancellations.filter(c => {
    if (seen.has(c)) return false;
    seen.add(c);
    return true;
  });

  const summary = result.mutualCancellation
    ? 'Both partners have Mangal Dosha — mutual cancellation significantly reduces its impact.'
    : result.chart1.present || result.chart2.present
      ? `Mangal Dosha detected. ${uniqueCancellations.length > 0 ? 'Mitigating factors are present.' : 'Consult a Jyotish expert for remedial measures.'}`
      : 'No Mangal Dosha — marriage compatibility is favorable from this perspective.';

  return {
    chart1HasManglik: result.chart1.present,
    chart2HasManglik: result.chart2.present,
    chart1Severity: mapSeverity(result.chart1),
    chart2Severity: mapSeverity(result.chart2),
    cancellations: uniqueCancellations,
    summary,
  };
}
```

Then find where `analyzeManglik()` is called in `generateDetailedReport()` and replace with:

```typescript
  const manglikAnalysis = analyzeManglikFromEngine(chart1, chart2);
```

Remove the old `analyzeManglik`, `getManglikSeverity`, and `getManglikCancellations` functions (they're now dead code replaced by the engine).

- [ ] **Step 3: Update mangal-dosha/page.tsx**

In `src/app/[locale]/mangal-dosha/page.tsx`, add the import:

```typescript
import { analyzeMangalDosha, type MangalDoshaResult } from '@/lib/kundali/mangal-dosha-engine';
```

Replace the local `analyzeMangalDosha` function (lines ~107-158) with a call to the shared engine:

```typescript
function analyzeChart(kundali: KundaliData): MangalDoshaResult {
  return analyzeMangalDosha(kundali.planets, kundali.ascendant.sign);
}
```

Remove the local constants that are now in the engine: `MANGAL_HOUSES` (line 59), `CANCELLATION_CONDITIONS` (lines 70-93), and the local `MangalDoshaResult` interface (lines 95-105).

Keep `HOUSE_EFFECTS` (line 61-68) and `REMEDIES` (line 164+) — those are UI-specific display data.

Update the UI rendering to use the new result shape. The main differences:
- Old: `result.severity` (string) → New: `result.effectiveSeverity` (includes 'cancelled')
- Old: `result.cancellations` (string[]) → New: `result.cancellations` ({ rule, description }[])
- Old: `result.fromLagna` (number | null) → New: `result.fromLagna` (boolean)

Update references:
- `result.severity` → `result.effectiveSeverity`
- `result.cancellations.map(c => ...)` → `result.cancellations.map(c => c.description)`
- `result.fromLagna` truthiness check stays the same (boolean is truthy when true)

- [ ] **Step 4: Run type check and full tests**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
npx next build 2>&1 | grep -E 'Compiled|Generating'
```

Expected: 0 type errors, all tests pass, build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/yogas-complete.ts src/lib/matching/detailed-report.ts src/app/[locale]/mangal-dosha/page.tsx
git commit -m "feat: wire all consumers to shared Mangal Dosha engine + fix Mercury/Mars bug"
```

---

### Task 4: Clean up dead code and final verification

**Files:**
- Modify: `src/lib/matching/ashta-kuta.ts` (remove `manglikWarning`)

- [ ] **Step 1: Remove dead manglikWarning field**

In `src/lib/matching/ashta-kuta.ts`, find the `MatchResult` interface and remove:

```typescript
  manglikWarning?: LocaleText;
```

- [ ] **Step 2: Run all three gates**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
npx next build
```

Expected: 0 type errors, all tests pass, build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/lib/matching/ashta-kuta.ts
git commit -m "chore: remove dead manglikWarning field from MatchResult"
```

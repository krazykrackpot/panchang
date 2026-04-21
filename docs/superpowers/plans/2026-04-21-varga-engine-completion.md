# Varga Engine Completion — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the existing deep analysis engine into varga-tippanni.ts, add 405 domain-specific planet-in-house entries, build a 7-paragraph narrative composer, and add combustion/retro analysis — so that every divisional chart produces unique, deeply personalized interpretation instead of the current generic template.

**Architecture:** The deep analysis functions (20 exports in varga-deep-analysis.ts) and classical checks (Pushkara, Gandanta, Varga Visesha) already exist but are NOT called from varga-tippanni.ts. This plan wires them in, adds the missing interpretive text layer, and replaces the thin `overallCommentary` with a rich 7-paragraph narrative.

**Tech Stack:** TypeScript, Vitest, existing engines (functional-nature.ts, argala.ts, yogas-complete.ts, interpretations.ts)

**Active locales:** EN, HI only (TA/BN via tl() fallback)

---

### Task 1: Planet-in-House Interpretations — D9 Marriage Domain (108 entries)

**Files:**
- Create: `src/lib/tippanni/varga-planet-interpretations.ts`
- Test: `src/lib/__tests__/varga-planet-interpretations.test.ts`

The most impactful content: what each planet means in each house of D9 (Navamsha = marriage/dharma).

- [ ] **Step 1: Create the file with type + D9 entries**

```typescript
// src/lib/tippanni/varga-planet-interpretations.ts
import type { VargaDomain } from './varga-tippanni-types-v2';

interface DomainPlacement {
  en: string;
  hi: string;
}

// Keyed by domain → planetId → house → interpretation
export const VARGA_PLANET_TEXT: Record<string, Record<number, Record<number, DomainPlacement>>> = {
  marriage: {
    0: { // Sun
      1: { en: 'Strong ego in marriage...', hi: '...' },
      2: { en: '...', hi: '...' },
      // ... all 12 houses
    },
    // ... all 9 planets (0-8)
  },
};

export function getVargaPlanetText(
  domain: VargaDomain,
  planetId: number,
  house: number,
): DomainPlacement | null {
  return VARGA_PLANET_TEXT[domain]?.[planetId]?.[house] ?? null;
}
```

Write ALL 108 entries for the marriage domain (9 planets × 12 houses). Each entry is 1-2 sentences, marriage-contextualized. Reference: D9 house significations from the spec.

Key placements to get right:
- Sun in 1H: ego in marriage, partner respects independence
- Sun in 7H: dominant spouse or authority figure as partner
- Moon in 4H: emotional contentment through marriage, strong domestic life
- Moon in 7H: nurturing partner, emotional bond is primary
- Mars in 7H: passionate but potentially argumentative spouse
- Mars in 8H: intense sexual chemistry, transformative marriage
- Mercury in 3H: communicative spouse, intellectual companionship
- Jupiter in 5H: blessed children from marriage, dharmic creativity
- Jupiter in 7H: wise, generous spouse; one of best placements
- Jupiter in 9H: spouse brings fortune and higher purpose
- Venus in 1H: attractive self-presentation in marriage
- Venus in 7H: harmonious, aesthetically refined partnership
- Venus in 12H: expenses on luxuries, foreign spouse possible
- Saturn in 7H: delayed but durable marriage, karmic partner
- Saturn in 8H: deep karmic bond, challenges that mature the union
- Rahu in 7H: unconventional spouse, foreign or cross-cultural marriage
- Rahu in 12H: foreign residence after marriage
- Ketu in 1H: detachment from self in marriage, spiritual approach
- Ketu in 7H: past-life spouse connection, possible separation or renunciation

- [ ] **Step 2: Write test verifying lookup works**

```typescript
// src/lib/__tests__/varga-planet-interpretations.test.ts
import { describe, it, expect } from 'vitest';
import { getVargaPlanetText, VARGA_PLANET_TEXT } from '../tippanni/varga-planet-interpretations';

describe('varga-planet-interpretations', () => {
  it('returns D9 marriage text for Venus in 7th', () => {
    const result = getVargaPlanetText('marriage', 5, 7);
    expect(result).not.toBeNull();
    expect(result!.en.length).toBeGreaterThan(20);
    expect(result!.hi.length).toBeGreaterThan(10);
  });

  it('returns null for missing domain', () => {
    expect(getVargaPlanetText('nonexistent' as any, 0, 1)).toBeNull();
  });

  it('D9 marriage has all 108 entries (9 planets × 12 houses)', () => {
    let count = 0;
    const marriage = VARGA_PLANET_TEXT.marriage;
    for (let pid = 0; pid <= 8; pid++) {
      for (let h = 1; h <= 12; h++) {
        if (marriage?.[pid]?.[h]) count++;
      }
    }
    expect(count).toBe(108);
  });
});
```

- [ ] **Step 3: Run test, verify pass**

Run: `npx vitest run src/lib/__tests__/varga-planet-interpretations.test.ts`

- [ ] **Step 4: Commit**

```bash
git add src/lib/tippanni/varga-planet-interpretations.ts src/lib/__tests__/varga-planet-interpretations.test.ts
git commit -m "feat(varga): D9 marriage planet-in-house interpretations (108 entries)"
```

---

### Task 2: Planet-in-House Interpretations — D10 Career Domain (108 entries)

**Files:**
- Modify: `src/lib/tippanni/varga-planet-interpretations.ts`
- Modify: `src/lib/__tests__/varga-planet-interpretations.test.ts`

- [ ] **Step 1: Add career domain entries**

Add `career: { ... }` to `VARGA_PLANET_TEXT` with all 108 entries (9 planets × 12 houses). Career-contextualized.

Key placements:
- Sun in 10H: born for leadership, government/executive roles
- Sun in 1H: career IS identity, self-made professional
- Moon in 10H: public-facing career, popularity-driven success
- Mars in 10H: aggressive career drive, engineering/military/surgery
- Mercury in 3H: communication-based career, multiple income streams
- Mercury in 10H: analytical/intellectual profession
- Jupiter in 9H: career in education, law, philosophy
- Jupiter in 10H: ethical leadership, respected authority
- Venus in 7H: career through partnerships, diplomacy, art
- Saturn in 10H: slow but unstoppable career rise, institutional authority
- Saturn in 1H: career defines the person, late bloomer
- Rahu in 10H: unconventional career path, technology, foreign companies
- Ketu in 12H: career in spiritual/charitable organizations

- [ ] **Step 2: Add test for career domain**

```typescript
it('D10 career has all 108 entries', () => {
  let count = 0;
  const career = VARGA_PLANET_TEXT.career;
  for (let pid = 0; pid <= 8; pid++) {
    for (let h = 1; h <= 12; h++) {
      if (career?.[pid]?.[h]) count++;
    }
  }
  expect(count).toBe(108);
});
```

- [ ] **Step 3: Run tests, verify pass**
- [ ] **Step 4: Commit**

---

### Task 3: Planet-in-House Interpretations — Remaining 4 Domains

**Files:**
- Modify: `src/lib/tippanni/varga-planet-interpretations.ts`
- Modify: `src/lib/__tests__/varga-planet-interpretations.test.ts`

Add entries for:
- `children` (D7): 63 entries (9 planets × houses 1,2,4,5,7,9,11)
- `wealth` (D2/D4): 54 entries (9 planets × houses 1,2,4,5,9,11)
- `spiritual` (D20/D60): 36 entries (9 planets × houses 1,5,9,12)
- `health` (D30): 36 entries (9 planets × houses 1,6,8,12)

Total: 189 entries across 4 domains.

- [ ] **Step 1: Add all 4 domains to VARGA_PLANET_TEXT**

Each domain focuses on the houses most relevant to its life area. Each entry is 1-2 sentences.

- [ ] **Step 2: Add tests for each domain entry count**

```typescript
it.each([
  ['children', 63],
  ['wealth', 54],
  ['spiritual', 36],
  ['health', 36],
])('%s domain has %d entries', (domain, expected) => {
  let count = 0;
  const data = VARGA_PLANET_TEXT[domain];
  if (!data) { expect(count).toBe(expected); return; }
  for (let pid = 0; pid <= 8; pid++) {
    for (let h = 1; h <= 12; h++) {
      if (data[pid]?.[h]) count++;
    }
  }
  expect(count).toBe(expected);
});
```

- [ ] **Step 3: Run tests, verify pass**
- [ ] **Step 4: Commit**

---

### Task 4: Combustion / Retrogression / War Analysis

**Files:**
- Modify: `src/lib/tippanni/varga-deep-analysis.ts`
- Test: `src/lib/__tests__/varga-deep-analysis.test.ts` (add cases)

Add 3 new analysis functions that check planet conditions in divisional chart context:

- [ ] **Step 1: Write failing tests**

```typescript
describe('combustion/retro/war in Dxx', () => {
  it('detects combust Venus in D9', () => {
    // Venus within 8° of Sun in natal chart carries combustion into D9
    const result = computeCombustionInDxx(mockPlanets, 'D9');
    expect(result.some(c => c.planetId === 5 && c.isCombust)).toBe(true);
  });

  it('detects retrograde Saturn in D10', () => {
    const result = computeRetroInDxx(mockPlanets, 'D10');
    expect(result.some(r => r.planetId === 6 && r.isRetrograde)).toBe(true);
  });
});
```

- [ ] **Step 2: Implement functions**

```typescript
export function computeCombustionInDxx(
  planets: PlanetPosition[],
  chartId: string,
): { planetId: number; isCombust: boolean; narrative: { en: string; hi: string } }[] {
  // Combustion is a natal condition (proximity to Sun) that carries
  // into ALL divisional charts. Check natal isComubust flag.
  return planets
    .filter(p => p.isCombust && p.planet.id !== 0) // Sun can't be combust
    .map(p => ({
      planetId: p.planet.id,
      isCombust: true,
      narrative: {
        en: `${p.planet.name.en} is combust (within ${COMBUST_ORBS[p.planet.id] ?? 8}° of Sun) — its significations in this chart are overshadowed by ego and self-assertion. Awareness of this pattern is the first step.`,
        hi: `${p.planet.name.hi} अस्त है (सूर्य से ${COMBUST_ORBS[p.planet.id] ?? 8}° के भीतर) — इस चार्ट में इसके कारकत्व अहंकार से ढके हैं।`,
      },
    }));
}

export function computeRetroInDxx(
  planets: PlanetPosition[],
  chartId: string,
): { planetId: number; isRetrograde: boolean; narrative: { en: string; hi: string } }[] {
  return planets
    .filter(p => p.isRetrograde && p.planet.id >= 2 && p.planet.id <= 6) // Mars-Saturn only
    .map(p => ({
      planetId: p.planet.id,
      isRetrograde: true,
      narrative: RETRO_NARRATIVES[p.planet.id] ?? { en: 'Retrograde — unconventional expression.', hi: 'वक्री — अपरंपरागत अभिव्यक्ति।' },
    }));
}
```

Include `COMBUST_ORBS` (Sun=0, Moon=12, Mars=17, Mercury=12/14, Jupiter=11, Venus=9/10, Saturn=15) and `RETRO_NARRATIVES` per planet with domain-aware text.

- [ ] **Step 3: Run tests, verify pass**
- [ ] **Step 4: Commit**

---

### Task 5: Narrative Builder (7-paragraph composer)

**Files:**
- Create: `src/lib/tippanni/varga-narrative.ts`
- Test: `src/lib/__tests__/varga-narrative.test.ts`

This is the core compositional layer that takes all the cross-correlation data and produces a coherent multi-paragraph reading.

- [ ] **Step 1: Create varga-narrative.ts**

```typescript
import type { DeepVargaResult } from './varga-tippanni-types-v2';
import type { VargaDomain } from './varga-tippanni-types-v2';
import { getVargaPlanetText } from './varga-planet-interpretations';

export function buildVargaNarrative(
  result: DeepVargaResult,
  locale: string,
): { en: string; hi: string } {
  const cc = result.crossCorrelation;
  const pd = result.promiseDelivery;
  const paragraphs: string[] = [];
  const paragraphsHi: string[] = [];

  // P1: Chart Identity
  paragraphs.push(buildChartIdentity(result, 'en'));
  paragraphsHi.push(buildChartIdentity(result, 'hi'));

  // P2: D1↔Dxx Comparison (dignity shifts)
  paragraphs.push(buildDignityShiftNarrative(cc, 'en'));
  paragraphsHi.push(buildDignityShiftNarrative(cc, 'hi'));

  // P3: Key House & Lordship
  paragraphs.push(buildKeyHouseNarrative(cc, 'en'));
  paragraphsHi.push(buildKeyHouseNarrative(cc, 'hi'));

  // P4: Yogas & Strengths
  paragraphs.push(buildYogaStrengthNarrative(cc, 'en'));
  paragraphsHi.push(buildYogaStrengthNarrative(cc, 'hi'));

  // P5: Promise vs Delivery
  paragraphs.push(buildPromiseDeliveryNarrative(pd, 'en'));
  paragraphsHi.push(buildPromiseDeliveryNarrative(pd, 'hi'));

  // P6: Timing & Dasha
  paragraphs.push(buildTimingNarrative(cc, 'en'));
  paragraphsHi.push(buildTimingNarrative(cc, 'hi'));

  // P7: Practical Guidance
  paragraphs.push(buildGuidanceNarrative(result, 'en'));
  paragraphsHi.push(buildGuidanceNarrative(result, 'hi'));

  return {
    en: paragraphs.filter(Boolean).join('\n\n'),
    hi: paragraphsHi.filter(Boolean).join('\n\n'),
  };
}
```

Each `build*` function is a pure function producing 2-4 sentences by composing data from the CrossCorrelation and PromiseDeliveryScore objects.

Key composition rules:
- P1 uses: ascendant sign + lagna lord placement + functional nature + dispositor chain
- P2 uses: dignityShifts (top 3-4 most significant) + vargottama flags + Pushkara/Gandanta
- P3 uses: keyHouseLords + argalaOnKeyHouses + jaiminiKarakas + parivartanas
- P4 uses: yogasInChart + vargaVisesha + savOverlay
- P5 uses: promiseScore + deliveryScore + verdictKey + verdictText
- P6 uses: dashaLordPlacement + combustion/retro flags
- P7 uses: top 3 focus areas derived from all above

- [ ] **Step 2: Write tests**

```typescript
describe('buildVargaNarrative', () => {
  it('produces non-empty en and hi text', () => {
    const result = buildVargaNarrative(mockDeepVargaResult, 'en');
    expect(result.en.length).toBeGreaterThan(200);
    expect(result.hi.length).toBeGreaterThan(100);
  });

  it('contains 7 paragraphs (separated by double newline)', () => {
    const result = buildVargaNarrative(mockDeepVargaResult, 'en');
    const paragraphs = result.en.split('\n\n').filter(Boolean);
    expect(paragraphs.length).toBeGreaterThanOrEqual(5); // some may be empty if data missing
  });

  it('D9 narrative differs from D10 narrative for same kundali', () => {
    const d9 = buildVargaNarrative(mockD9Result, 'en');
    const d10 = buildVargaNarrative(mockD10Result, 'en');
    expect(d9.en).not.toBe(d10.en);
  });
});
```

- [ ] **Step 3: Run tests, verify pass**
- [ ] **Step 4: Commit**

---

### Task 6: Wire Everything into varga-tippanni.ts

**Files:**
- Modify: `src/lib/tippanni/varga-tippanni.ts`
- Test: existing tests must still pass + new integration test

This is where the existing `analyzeChart()` function gets enhanced to call the deep analysis engine and narrative builder.

- [ ] **Step 1: Add imports to varga-tippanni.ts**

```typescript
import {
  computeDignityShifts,
  computeFunctionalNatureForDxx,
  detectVargottama,
  traceKeyHouseLords,
  computeJaiminiKarakas,
  computeArgalaOnKeyHouses,
  computeSavOverlay,
  computeDashaLordPlacement,
  detectYogasInDxx,
  computeAspectsOnKeyHouses,
  detectParivartana,
  buildDispositorChain,
  computeCombustionInDxx,
  computeRetroInDxx,
} from './varga-deep-analysis';
import { computePushkaraChecks, computeGandantaChecks } from './varga-classical-checks';
import { scorePromise, scoreDelivery, getVerdict } from './varga-promise-delivery';
import { buildVargaNarrative } from './varga-narrative';
import { getVargaPlanetText } from './varga-planet-interpretations';
```

- [ ] **Step 2: Enhance `analyzeChart()` to build DeepVargaResult**

Inside `analyzeChart()`, after the existing structural analysis, add:

```typescript
// Deep analysis (new)
const deepResult: DeepVargaResult = {
  chartId: chartKey,
  domain: CHART_DOMAIN_MAP[chartKey]?.[0] ?? 'marriage',
  crossCorrelation: {
    dignityShifts: computeDignityShifts(kundali.planets, divChart, ascSign),
    functionalNature: computeFunctionalNatureForDxx(divChart),
    vargottama: detectVargottama(kundali.planets, divChart),
    // ... wire all 15 factors
  },
  promiseDelivery: {
    promiseScore: scorePromise(kundali, chartKey),
    deliveryScore: scoreDelivery(divChart, chartKey),
    // ... verdict
  },
  narrative: buildVargaNarrative(deepResult, locale),
};
```

Replace the thin `overallCommentary` with the narrative builder output.

- [ ] **Step 3: Update VargaChartTippanni to include deep result**

Add `deepAnalysis?: DeepVargaResult` field to `VargaChartTippanni` interface so the UI can access the full analysis.

- [ ] **Step 4: Run all existing tests**

```bash
npx vitest run src/lib/__tests__/varga-*.test.ts
```

All must pass — the existing output shape is extended, not replaced.

- [ ] **Step 5: Write integration test**

```typescript
describe('varga-tippanni integration', () => {
  it('D9 and D10 produce different narratives for the same chart', () => {
    const synthesis = generateVargaTippanni(mockKundali, 'en');
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    const d10 = synthesis.vargaInsights.find(v => v.chart === 'D10');
    expect(d9?.deepAnalysis?.narrative.en).not.toBe(d10?.deepAnalysis?.narrative.en);
  });

  it('deep analysis includes all 15 cross-correlation factors', () => {
    const synthesis = generateVargaTippanni(mockKundali, 'en');
    const d9 = synthesis.vargaInsights.find(v => v.chart === 'D9');
    const cc = d9?.deepAnalysis?.crossCorrelation;
    expect(cc?.dignityShifts).toBeDefined();
    expect(cc?.vargottama).toBeDefined();
    expect(cc?.keyHouseLords).toBeDefined();
    expect(cc?.yogasInChart).toBeDefined();
    expect(cc?.dispositorChain).toBeDefined();
  });
});
```

- [ ] **Step 6: Run full test suite**

```bash
npx vitest run
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 7: Commit**

```bash
git add src/lib/tippanni/varga-tippanni.ts src/lib/__tests__/varga-integration.test.ts
git commit -m "feat(varga): wire deep analysis + narrative into varga-tippanni engine"
```

---

### Task 7: Final Verification + Push

- [ ] **Step 1: Run full verification**

```bash
npx tsc --noEmit -p tsconfig.build-check.json  # 0 errors
npx vitest run                                   # all pass
```

- [ ] **Step 2: Browser verification**

Generate a kundali → Vargas tab → select D9 → verify:
- Commentary paragraph below header is specific to D9 marriage domain
- Planet placements show domain-specific brief text (from Task 1)
- Overall commentary is the 7-paragraph narrative (not old generic template)
- Select D10 → verify content is DIFFERENT from D9

- [ ] **Step 3: Push**

```bash
git push origin main
```

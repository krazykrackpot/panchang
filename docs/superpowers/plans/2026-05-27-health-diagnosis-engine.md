# Health Diagnosis Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single-tier Health verdict on the kundali summary with a three-layer multi-axis diagnosis engine producing 19 default + 3 opt-in element scores, each traceable to a classical source.

**Architecture:** New namespace `src/lib/kundali/health-diagnosis/` with one file per element. Three-layer composition: natal vulnerability (Layer 1) × Ayurvedic mode (Layer 2 — interpretive only, doesn't change scores) × time-dependent activation (Layer 3 — dasha/transit/life-stage multipliers, bounded to keep natal as the dominant signal). Existing `src/lib/medical/*` modules are consumed as inputs and gradually absorbed into the new namespace. Backward compatibility preserved at `/api/medical` and `/medical-astrology` until consumers explicitly migrate.

**Tech Stack:** TypeScript, Vitest, Next.js 16 App Router, existing strength-input modules (`shadbala.ts`, `avasthas.ts`, `bhavabala.ts`, `vimshopaka.ts`, `sphutas.ts`, `graha-yuddha.ts`, `dignity.ts`), Ayurveda overlay (`medical/prakriti.ts`).

**Spec reference:** `docs/superpowers/specs/2026-05-27-health-diagnosis-nuance-design.md`

---

## File structure (created or modified by this plan)

### New files (`src/lib/kundali/health-diagnosis/`)

- `types.ts` — `HealthDiagnosis`, `ElementId`, `ElementCategory`, `ElementBadge`, weighting types
- `element-catalog.ts` — Stable id → metadata (name, category, badge, default-visible, primary significators)
- `strength-inputs.ts` — Collector that pulls Shadbala / Avastha / Bhavabala / Vimsopaka / Ashtakavarga / Vargottama / Combust / Dignity / Graha Yuddha into one normalised 0–100 map per planet and per house. Also exports a small `houseLordId(kundali, houseNum)` helper since `KundaliData` does not carry a `houseLords` map — house lord is derived from lagna sign + house offset via the existing `SIGN_LORD` constant in `src/lib/medical/constants.ts` (later `legacy/constants.ts`).
- `signatures.ts` — Yoga / dosha signature detectors per element (reuses existing detectors from `medical/disease-profile.ts` and `kundali/yogas-complete.ts` where available)
- `weights.ts` — Per-element weight vectors over the strength-input axes
- `elements/vitality.ts` … `elements/longevity.ts` — One file per element (22 total)
- `elements/index.ts` — Re-exports plus an ordered list keyed by ElementId for deterministic iteration
- `layer-1-natal.ts` — Natal score composer: runs all visible element scorers, returns `natalElements` array
- `layer-2-mode.ts` — Constitutional mode composer: consumes existing `computePrakriti()`, derives `modeNote`
- `layer-3-activation.ts` — Dasha + transit + life-stage multipliers; produces `currentMultipliers`, `displayedElements`, `trend`, `nextInflectionDate`
- `disclaimers.ts` — Vedic-framing disclaimer text per scope, i18n-aware
- `index.ts` — `computeHealthDiagnosis(kundali, opts)` main entry; composes all three layers

### Tests (`src/lib/kundali/health-diagnosis/__tests__/`)

- `element-catalog.test.ts` — Stable ID & metadata assertions
- `strength-inputs.test.ts` — Strength normalisation across known fixtures
- One `__tests__/elements/<id>.test.ts` per element (22 files)
- `layer-1-natal.test.ts` — Full natal composition over fixtures
- `layer-3-activation.test.ts` — Multiplier bounds, unclamped trend, inflection walk
- `disclaimers.test.ts` — Scope-to-text mapping
- `integration.test.ts` — End-to-end `computeHealthDiagnosis` over 3 reference charts

### Modified files

- `src/app/api/medical/route.ts` — Extend response with `healthDiagnosis` key; preserve existing keys
- `src/app/[locale]/medical-astrology/page.tsx` — Add "Health Element Diagnosis" section above existing four sections
- `src/components/kundali/DomainCard.tsx` — Health card expands into the element grid when opened

### Migrated in Phase E

- `src/lib/medical/prakriti.ts` → `src/lib/kundali/health-diagnosis/legacy/prakriti.ts` + re-export shim
- `src/lib/medical/body-map.ts` → same pattern
- `src/lib/medical/disease-profile.ts` → same pattern
- `src/lib/medical/health-timeline.ts` → same pattern
- `src/lib/medical/health-prognosis.ts` → same pattern
- `src/lib/medical/constants.ts` → same pattern

---

## Phase A — Foundation (4 tasks)

### Task A1: types, element catalog, and ID enumeration

**Files:**
- Create: `src/lib/kundali/health-diagnosis/types.ts`
- Create: `src/lib/kundali/health-diagnosis/element-catalog.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts
import { describe, it, expect } from 'vitest';
import { ELEMENT_CATALOG, ELEMENT_IDS, DEFAULT_VISIBLE_IDS, EXTENDED_IDS } from '../element-catalog';
import type { ElementId } from '../types';

describe('element-catalog', () => {
  it('has exactly 22 elements', () => {
    expect(ELEMENT_IDS).toHaveLength(22);
  });

  it('default-visible set has 19 elements', () => {
    expect(DEFAULT_VISIBLE_IDS).toHaveLength(19);
  });

  it('extended (opt-in) set has 3 elements: allergies, cancer, longevity', () => {
    expect(EXTENDED_IDS.sort()).toEqual(['allergies', 'cancer', 'longevity']);
  });

  it('every element has metadata: name, category, badge, primarySignificators', () => {
    for (const id of ELEMENT_IDS) {
      const meta = ELEMENT_CATALOG[id];
      expect(meta.name.en).toBeTruthy();
      expect(['physical', 'mental', 'systemic', 'longevity']).toContain(meta.category);
      expect(['classical', 'inferential', 'mixed']).toContain(meta.badge);
      expect(meta.primarySignificators.planets.length).toBeGreaterThan(0);
      expect(meta.primarySignificators.houses.length).toBeGreaterThan(0);
    }
  });

  it('default+extended is a partition of all ids', () => {
    const union = new Set<ElementId>([...DEFAULT_VISIBLE_IDS, ...EXTENDED_IDS]);
    expect(union.size).toBe(22);
  });

  it('disclaimer-gated elements are exactly psychiatric, cancer, longevity', () => {
    const gated = ELEMENT_IDS.filter(id => ELEMENT_CATALOG[id].requiresDisclaimer);
    expect(gated.sort()).toEqual(['cancer', 'longevity', 'psychiatric']);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts`
Expected: FAIL — modules not found.

- [ ] **Step 3: Create `types.ts` with the canonical contract**

```ts
// src/lib/kundali/health-diagnosis/types.ts
import type { LocaleText } from '@/types/panchang';
import type { ScoringFactor, Rating } from '@/lib/kundali/domain-synthesis/types';
import type { PrakritiResult } from '@/lib/medical/prakriti';
import type { BodyRegionResult } from '@/lib/medical/body-map';
import type { DiseaseProfileResult } from '@/lib/medical/disease-profile';
import type { HealthWindow } from '@/lib/medical/health-timeline';

export type ElementId =
  | 'vitality' | 'mental' | 'digestive' | 'cardiac' | 'respiratory'
  | 'nervous' | 'skeletal' | 'muscular' | 'skin' | 'eyes'
  | 'reproductive' | 'endocrine' | 'immunity' | 'chronic'
  | 'accidents' | 'surgery' | 'psychiatric' | 'addictions' | 'sleep'
  | 'allergies' | 'cancer' | 'longevity';

export type ElementCategory = 'physical' | 'mental' | 'systemic' | 'longevity';
export type ElementBadge = 'classical' | 'inferential' | 'mixed';

export interface ElementSignificators {
  /** Planet IDs (0=Sun..8=Ketu) that primarily score this element. */
  planets: number[];
  /** House numbers (1-12) that primarily score this element. */
  houses: number[];
  /** Sign IDs (1-12) that contextually matter. May be empty. */
  signs?: number[];
}

export interface ElementMetadata {
  id: ElementId;
  name: LocaleText;
  category: ElementCategory;
  badge: ElementBadge;
  defaultVisible: boolean;       // false → opt-in (extended) only
  requiresDisclaimer: boolean;   // 4.17, 4.21, 4.22 → true
  primarySignificators: ElementSignificators;
  /** Citation codes, e.g. ['BPHS-24', 'Saravali-5'] */
  sources: string[];
}

export interface ClassicalSignature {
  id: string;
  name: LocaleText;
  source: string;
}

export interface NatalElement {
  id: ElementId;
  name: LocaleText;
  category: ElementCategory;
  badge: ElementBadge;
  natalScore: number;            // 0–100 vulnerability
  rating: Rating;
  factors: ScoringFactor[];
  classicalSignatures: ClassicalSignature[];
  requiresDisclaimer: boolean;
}

export interface ElementMultipliers {
  dashaContribution: number;     // [0, 0.5]
  transitContribution: number;   // [0, 0.5], includes Sade Sati component
  sadeSatiActive: boolean;
  lifeStageGate: number;         // [0.5, 1.5]
}

export interface DisplayedElement {
  id: ElementId;
  /** Score with Layer 3 applied, clamped to [0, 100] for UI. */
  displayedScore: number;
  /** Score before clamping — used internally for trend comparison. */
  unclampedScore: number;
  trend: 'improving' | 'stable' | 'worsening';
  nextInflectionDate: string | null;  // ISO date or null
}

export interface DisclaimerEntry {
  scope: ElementId[];
  text: LocaleText;
}

export interface HealthDiagnosis {
  natalElements: NatalElement[];
  prakriti: PrakritiResult;
  modeNote: LocaleText;
  currentMultipliers: Record<ElementId, ElementMultipliers>;
  displayedElements: DisplayedElement[];
  overall: { rating: Rating; summary: LocaleText };
  bodyMap: BodyRegionResult[];
  diseaseProfile: DiseaseProfileResult;
  timeline: HealthWindow[];
  disclaimers: DisclaimerEntry[];
  optedInToExtended: boolean;
  hiddenElements: ElementId[];
}

export interface HealthDiagnosisOptions {
  /** When true, includes allergies + cancer + longevity in natalElements. */
  extended?: boolean;
  /** Reference date for Layer 3 activation. Defaults to now. */
  today?: Date;
  /** User age in years; used for life-stage gating. If omitted, treat as adult (1.0 gate). */
  age?: number;
  /** User gender for §4.10 Eyes laterality interpretation. Optional. */
  gender?: 'male' | 'female' | 'other' | undefined;
}
```

- [ ] **Step 4: Create `element-catalog.ts` with all 22 entries**

```ts
// src/lib/kundali/health-diagnosis/element-catalog.ts
import type { ElementId, ElementMetadata } from './types';

export const ELEMENT_CATALOG: Record<ElementId, ElementMetadata> = {
  vitality: {
    id: 'vitality',
    name: { en: 'Vitality', hi: 'जीवन शक्ति' },
    category: 'longevity',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 4, 6], houses: [1, 3, 8] },
    sources: ['BPHS-24', 'Phala-Deepika-9', 'Saravali-33'],
  },
  mental: {
    id: 'mental',
    name: { en: 'Mental Health', hi: 'मानसिक स्वास्थ्य' },
    category: 'mental',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [1, 3, 4, 7, 8], houses: [3, 4, 5, 12] },
    sources: ['BPHS-4', 'Saravali-5', 'Charaka-manasika-roga'],
  },
  digestive: {
    id: 'digestive',
    name: { en: 'Digestive System', hi: 'पाचन तंत्र' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 1, 2, 3, 4], houses: [2, 5, 6], signs: [4, 6] },
    sources: ['BPHS-24', 'Sarvartha-Chintamani-4', 'Charaka-Sutra', 'Ashtanga-Hridayam'],
  },
  cardiac: {
    id: 'cardiac',
    name: { en: 'Cardiac System', hi: 'हृदय प्रणाली' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 1, 2], houses: [4], signs: [5, 4] },
    sources: ['BPHS-24', 'Saravali-5', 'Charaka'],
  },
  respiratory: {
    id: 'respiratory',
    name: { en: 'Respiratory System', hi: 'श्वसन प्रणाली' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [3, 4, 6], houses: [3, 4], signs: [3, 4] },
    sources: ['BPHS-12', 'BPHS-24', 'Saravali-5', 'Ashtanga-Hridayam'],
  },
  nervous: {
    id: 'nervous',
    name: { en: 'Nervous System', hi: 'तंत्रिका तंत्र' },
    category: 'systemic',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [3, 6, 7], houses: [1, 3, 11] },
    sources: ['BPHS-24', 'Saravali-5', 'Charaka-Vatavyadhi'],
  },
  skeletal: {
    id: 'skeletal',
    name: { en: 'Bones & Joints', hi: 'अस्थि एवं संधि' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 6], houses: [8, 9, 10, 11], signs: [10, 11] },
    sources: ['BPHS-4', 'BPHS-24', 'Charaka', 'Saravali'],
  },
  muscular: {
    id: 'muscular',
    name: { en: 'Muscular & Inflammation', hi: 'मांसपेशी एवं सूजन' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 2, 7], houses: [1, 3, 6] },
    sources: ['BPHS-4', 'BPHS-24', 'Charaka-Raktapitta'],
  },
  skin: {
    id: 'skin',
    name: { en: 'Skin & Hair', hi: 'त्वचा एवं केश' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [2, 3, 5, 6], houses: [2, 6, 8], signs: [4, 6] },
    sources: ['BPHS-24', 'Saravali-5'],
  },
  eyes: {
    id: 'eyes',
    name: { en: 'Eyes & Vision', hi: 'नेत्र एवं दृष्टि' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 1, 3, 5], houses: [2, 6, 12] },
    sources: ['BPHS-12', 'BPHS-24', 'Sarvartha-Chintamani-4', 'Saravali-5'],
  },
  reproductive: {
    id: 'reproductive',
    name: { en: 'Reproductive Health', hi: 'प्रजनन स्वास्थ्य' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [1, 2, 4, 5], houses: [5, 7, 8], signs: [8] },
    sources: ['BPHS-4', 'BPHS-12', 'BPHS-24', 'Charaka-Shukravaha-Srotas', 'Sarvartha-Chintamani'],
  },
  endocrine: {
    id: 'endocrine',
    name: { en: 'Endocrine / Hormonal', hi: 'अंतःस्रावी / हार्मोनल' },
    category: 'systemic',
    badge: 'inferential',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [1, 4, 5], houses: [5] },
    sources: ['Jataka-Parijata-5', 'Saravali-5'],
  },
  immunity: {
    id: 'immunity',
    name: { en: 'Immunity / Ojas', hi: 'रोग प्रतिरोधक क्षमता' },
    category: 'systemic',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [0, 4], houses: [1, 8] },
    sources: ['Charaka-Sutra', 'Jaimini', 'BPHS'],
  },
  chronic: {
    id: 'chronic',
    name: { en: 'Chronic / Hidden Disease', hi: 'दीर्घकालिक / गुप्त रोग' },
    category: 'systemic',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [6, 7, 8], houses: [6, 8, 12] },
    sources: ['BPHS-24', 'Saravali-5', 'Phala-Deepika-9'],
  },
  accidents: {
    id: 'accidents',
    name: { en: 'Accidents & Injury', hi: 'दुर्घटनाएँ एवं चोट' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [2, 7, 8], houses: [4, 6, 8] },
    sources: ['BPHS-24', 'Phala-Deepika-9'],
  },
  surgery: {
    id: 'surgery',
    name: { en: 'Surgery & Hospitalisation', hi: 'शल्य एवं चिकित्सालय' },
    category: 'physical',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [2, 6, 8], houses: [8, 12] },
    sources: ['BPHS-24', 'Saravali'],
  },
  psychiatric: {
    id: 'psychiatric',
    name: { en: 'Severe Mental Illness', hi: 'गंभीर मानसिक रोग' },
    category: 'mental',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: true,
    primarySignificators: { planets: [1, 3, 7, 8], houses: [4, 5, 12] },
    sources: ['Saravali-5', 'Sarvartha-Chintamani', 'Charaka-Unmada'],
  },
  addictions: {
    id: 'addictions',
    name: { en: 'Addiction Vulnerability', hi: 'व्यसन की प्रवृत्ति' },
    category: 'mental',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [1, 2, 5, 7, 8], houses: [6, 8, 12] },
    sources: ['Saravali', 'Sarvartha-Chintamani'],
  },
  sleep: {
    id: 'sleep',
    name: { en: 'Sleep & Dreams', hi: 'निद्रा एवं स्वप्न' },
    category: 'mental',
    badge: 'classical',
    defaultVisible: true,
    requiresDisclaimer: false,
    primarySignificators: { planets: [1, 3, 6, 8], houses: [12] },
    sources: ['BPHS-12', 'Saravali'],
  },
  allergies: {
    id: 'allergies',
    name: { en: 'Allergies & Autoimmune', hi: 'एलर्जी एवं स्व-प्रतिरक्षा' },
    category: 'systemic',
    badge: 'inferential',
    defaultVisible: false,
    requiresDisclaimer: false,
    primarySignificators: { planets: [3, 7, 8], houses: [1, 6] },
    sources: ['Saravali'],
  },
  cancer: {
    id: 'cancer',
    name: { en: 'Cancer Diathesis', hi: 'कैंसर की प्रवृत्ति' },
    category: 'systemic',
    badge: 'mixed',
    defaultVisible: false,
    requiresDisclaimer: true,
    primarySignificators: { planets: [2, 6, 7], houses: [6, 8] },
    sources: ['Saravali-5', 'Bhrigu-Samhita', 'Sarvartha-Chintamani'],
  },
  longevity: {
    id: 'longevity',
    name: { en: 'Longevity Classification', hi: 'आयु वर्गीकरण' },
    category: 'longevity',
    badge: 'classical',
    defaultVisible: false,
    requiresDisclaimer: true,
    primarySignificators: { planets: [6], houses: [2, 3, 7, 8] },
    sources: ['BPHS-Ayur', 'Phala-Deepika-9', 'Hora-Sara'],
  },
};

export const ELEMENT_IDS: ElementId[] = Object.keys(ELEMENT_CATALOG) as ElementId[];
export const DEFAULT_VISIBLE_IDS: ElementId[] = ELEMENT_IDS.filter(id => ELEMENT_CATALOG[id].defaultVisible);
export const EXTENDED_IDS: ElementId[] = ELEMENT_IDS.filter(id => !ELEMENT_CATALOG[id].defaultVisible);
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts`
Expected: 5 tests PASS.

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/kundali/health-diagnosis/types.ts \
        src/lib/kundali/health-diagnosis/element-catalog.ts \
        src/lib/kundali/health-diagnosis/__tests__/element-catalog.test.ts
git commit -m "feat(health-diagnosis): add types and element catalog (Task A1)"
```

---

### Task A2: Strength-input collector

**Files:**
- Create: `src/lib/kundali/health-diagnosis/strength-inputs.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts`

**Background for the engineer:** Existing strength modules each return their own native data shape (Shadbala returns six-fold rupas, Avastha returns named states, etc.). This collector normalises all of them into one 0–100 score per planet and per house so downstream element scorers consume a single uniform input. Read `src/lib/kundali/shadbala.ts:825` for the Shadbala compute entrypoint and `src/lib/kundali/avasthas.ts:200,305` for Avastha.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts
import { describe, it, expect } from 'vitest';
import { collectStrengthInputs } from '../strength-inputs';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const FIXTURE = {
  date: '1990-01-15',
  time: '06:30',
  lat: 28.61,
  lng: 77.21,
  timezone: 'Asia/Kolkata',
  ayanamsha: 'lahiri' as const,
};

describe('strength-inputs collector', () => {
  it('returns a planet map keyed 0..8 with normalised 0-100 strengths', () => {
    const k = generateKundali(FIXTURE);
    const s = collectStrengthInputs(k);
    for (let pid = 0; pid <= 8; pid++) {
      expect(s.planets[pid]).toBeDefined();
      expect(s.planets[pid].overall).toBeGreaterThanOrEqual(0);
      expect(s.planets[pid].overall).toBeLessThanOrEqual(100);
    }
  });

  it('returns a house map keyed 1..12 with 0-100 Bhavabala', () => {
    const k = generateKundali(FIXTURE);
    const s = collectStrengthInputs(k);
    for (let h = 1; h <= 12; h++) {
      expect(s.houses[h]).toBeDefined();
      expect(s.houses[h].bhavabala).toBeGreaterThanOrEqual(0);
      expect(s.houses[h].bhavabala).toBeLessThanOrEqual(100);
    }
  });

  it('per-planet record includes every required axis', () => {
    const k = generateKundali(FIXTURE);
    const s = collectStrengthInputs(k);
    const sun = s.planets[0];
    expect(sun.shadbalaRatio).toBeGreaterThan(0);
    expect(['exalted', 'own', 'moolatrikona', 'friend', 'neutral', 'enemy', 'debilitated']).toContain(sun.dignity);
    expect(typeof sun.isCombust).toBe('boolean');
    expect(typeof sun.isRetrograde).toBe('boolean');
    expect(sun.baladiStrength).toBeGreaterThanOrEqual(0);
    expect(sun.baladiStrength).toBeLessThanOrEqual(100);
    expect(typeof sun.vargottama).toBe('boolean');
    expect(sun.vimsopaka).toBeGreaterThanOrEqual(0);
    expect(sun.ashtakavargaBindus).toBeGreaterThanOrEqual(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the collector**

```ts
// src/lib/kundali/health-diagnosis/strength-inputs.ts
import type { KundaliData } from '@/types/kundali';
import { SIGN_LORD } from '@/lib/medical/constants';

/** Derive house lord planet id from lagna and house number (1-12). */
export function houseLordId(kundali: KundaliData, houseNum: number): number | undefined {
  const sign = ((kundali.ascendant.sign - 1 + houseNum - 1) % 12) + 1;
  return SIGN_LORD[sign];
}


export interface PlanetStrength {
  /** Composite 0-100 strength used as the default scoring input when no axis is specified. */
  overall: number;
  shadbalaRatio: number;        // total / minimum required, e.g. 1.2
  dignity: 'exalted' | 'own' | 'moolatrikona' | 'friend' | 'neutral' | 'enemy' | 'debilitated';
  baladiStrength: number;        // 0-100, yuva=100, mrita=5
  isCombust: boolean;
  isRetrograde: boolean;
  vargottama: boolean;
  vimsopaka: number;             // 0-20 composite varga points
  ashtakavargaBindus: number;    // 0-8 in own house, summed elsewhere
  grahaYuddhaWinner: boolean | null;  // null = not in war
}

export interface HouseStrength {
  bhavabala: number;             // 0-100
  occupants: number[];           // planet ids in house
  ownerStrength: number;         // overall strength of house lord, 0-100
}

export interface StrengthInputs {
  planets: Record<number, PlanetStrength>;
  houses: Record<number, HouseStrength>;
}

function normaliseShadbalaToOverall(ratio: number): number {
  // ratio: 1.0 = adequate baseline. Map to 0-100 with sigmoidish curve.
  // 0.5 → 25, 1.0 → 50, 1.5 → 75, 2.0+ → 100.
  const score = Math.min(100, Math.max(0, ratio * 50));
  return Math.round(score);
}

export function collectStrengthInputs(kundali: KundaliData): StrengthInputs {
  const planets: Record<number, PlanetStrength> = {};
  const houses: Record<number, HouseStrength> = {};

  // ── Planet axis collection ───────────────────────────────────────────
  const shadbalaByPid = new Map<number, number>();
  for (const sb of kundali.shadbala ?? []) {
    const pid = typeof sb.planetId === 'number' ? sb.planetId : -1;
    if (pid >= 0) shadbalaByPid.set(pid, sb.totalStrength / Math.max(1, sb.minimumRequired ?? 1));
  }

  const avasthasByPid = new Map<number, { baladiStrength: number }>();
  for (const av of kundali.avasthas ?? []) {
    const pid = typeof av.planetId === 'number' ? av.planetId : -1;
    if (pid >= 0) {
      // Map Baladi state → 0-100
      const stateToScore: Record<string, number> = {
        yuva: 100, vriddha: 50, kumara: 40, bala: 20, mrita: 5,
      };
      avasthasByPid.set(pid, { baladiStrength: stateToScore[av.baladi?.state ?? ''] ?? 50 });
    }
  }

  for (let pid = 0; pid <= 8; pid++) {
    const p = kundali.planets.find(x => x.planet.id === pid);
    if (!p) continue;
    const ratio = shadbalaByPid.get(pid) ?? 0;
    const baladi = avasthasByPid.get(pid)?.baladiStrength ?? 50;
    planets[pid] = {
      overall: normaliseShadbalaToOverall(ratio),
      shadbalaRatio: ratio,
      dignity: derivDignity(p),
      baladiStrength: baladi,
      isCombust: !!p.isCombust,
      isRetrograde: !!p.isRetrograde,
      vargottama: !!p.isVargottama,
      vimsopaka: p.vimsopaka ?? 0,
      ashtakavargaBindus: p.ashtakavargaBindus ?? 0,
      grahaYuddhaWinner: p.grahaYuddhaWinner ?? null,
    };
  }

  // ── House axis collection ───────────────────────────────────────────
  for (let h = 1; h <= 12; h++) {
    const bhava = (kundali.bhavabala ?? []).find(b => b.house === h);
    const occupants = kundali.planets.filter(p => p.house === h).map(p => p.planet.id);
    const lordId = houseLordId(kundali, h);
    const ownerStrength = lordId != null ? (planets[lordId]?.overall ?? 0) : 0;
    houses[h] = {
      bhavabala: Math.round(bhava?.strengthPercent ?? 0),
      occupants,
      ownerStrength,
    };
  }

  return { planets, houses };
}

function derivDignity(p: { isExalted?: boolean; isDebilitated?: boolean; isOwnSign?: boolean }): PlanetStrength['dignity'] {
  if (p.isExalted) return 'exalted';
  if (p.isDebilitated) return 'debilitated';
  if (p.isOwnSign) return 'own';
  return 'neutral';
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts`
Expected: 3 tests PASS. If fields like `p.vimsopaka`, `p.ashtakavargaBindus`, `p.isVargottama`, `p.grahaYuddhaWinner`, `kundali.houseLords` are not yet on the type, fall back to safe defaults (already shown via `??`) and add a TODO comment to wire them in Phase E.

- [ ] **Step 5: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git add src/lib/kundali/health-diagnosis/strength-inputs.ts \
        src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts
git commit -m "feat(health-diagnosis): strength-input collector (Task A2)"
```

---

### Task A3: Signature detectors registry

**Files:**
- Create: `src/lib/kundali/health-diagnosis/signatures.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts`

**Background:** The 22 elements share a small library of classical signature detectors (e.g., "Saturn-Rahu axis", "Kemadruma yoga", "Cardiac Risk Pattern"). Some are already in `src/lib/medical/constants.ts` (`DISEASE_PATTERNS`) and `src/lib/kundali/yogas-complete.ts`. We collect them into one registry keyed by signature ID so per-element scorers reuse them — no parallel implementations.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts
import { describe, it, expect } from 'vitest';
import { detectAllSignatures, SIGNATURE_REGISTRY } from '../signatures';
import { generateKundali } from '@/lib/ephem/kundali-calc';

describe('signatures registry', () => {
  it('exposes at least 12 detectors covering the spec\'s named yogas/patterns', () => {
    const ids = Object.keys(SIGNATURE_REGISTRY);
    expect(ids.length).toBeGreaterThanOrEqual(12);
    expect(ids).toEqual(expect.arrayContaining([
      'cardiac_risk', 'anxiety_mental', 'chronic_digestive', 'urogenital',
      'chronic_hidden', 'nervous_system_vata', 'respiratory', 'eye_sleep',
      'kemadruma', 'pisaca', 'mars_rahu_accident', 'saturn_rahu_malignancy',
    ]));
  });

  it('detectAllSignatures returns boolean map keyed by signature id', () => {
    const k = generateKundali({
      date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21,
      timezone: 'Asia/Kolkata', ayanamsha: 'lahiri',
    });
    const detected = detectAllSignatures(k);
    for (const id of Object.keys(SIGNATURE_REGISTRY)) {
      expect(typeof detected[id]).toBe('boolean');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the registry by adapting existing disease patterns**

```ts
// src/lib/kundali/health-diagnosis/signatures.ts
import type { KundaliData } from '@/types/kundali';
import type { LocaleText } from '@/types/panchang';
import { DISEASE_PATTERNS, SIGN_LORD } from '@/lib/medical/constants';
import { computeBodyMap } from '@/lib/medical/body-map';

export interface SignatureDef {
  id: string;
  name: LocaleText;
  source: string;             // citation, e.g. 'BPHS-24'
  /** Element ids this signature contributes to. */
  elementsAffected: import('./types').ElementId[];
  detect: (k: KundaliData) => boolean;
}

function planetHouse(k: KundaliData, pid: number): number | undefined {
  return k.planets.find(p => p.planet.id === pid)?.house;
}

export const SIGNATURE_REGISTRY: Record<string, SignatureDef> = {};

// ── Adapt the 8 existing disease patterns from medical/constants.ts ──
for (const dp of DISEASE_PATTERNS) {
  SIGNATURE_REGISTRY[dp.id] = {
    id: dp.id,
    name: { en: dp.name, hi: dp.name },  // hi falls back to en until i18n strings land
    source: 'BPHS-24',
    elementsAffected: mapPatternToElements(dp.id),
    detect: (k: KundaliData) => {
      // Build ctx via existing body-map context the same way disease-profile.ts does
      const bm = computeBodyMap(k);
      const planetHouseMap = new Map<number, number>();
      const planetSignMap = new Map<number, number>();
      const combustMap = new Map<number, boolean>();
      const debilMap = new Map<number, boolean>();
      const retroMap = new Map<number, boolean>();
      for (const p of k.planets) {
        planetHouseMap.set(p.planet.id, p.house);
        planetSignMap.set(p.planet.id, p.sign);
        combustMap.set(p.planet.id, p.isCombust);
        debilMap.set(p.planet.id, p.isDebilitated);
        retroMap.set(p.planet.id, p.isRetrograde);
      }
      try {
        return dp.detect({
          houseVulnerability: bm.map(r => r.vulnerability),
          planetHouse: planetHouseMap,
          planetSign: planetSignMap,
          planetCombust: combustMap,
          planetDebilitated: debilMap,
          planetRetrograde: retroMap,
          lagnaSign: k.ascendant.sign,
        });
      } catch (err) {
        console.error('[health-diagnosis/signatures] detect failed for', dp.id, err);
        return false;
      }
    },
  };
}

function mapPatternToElements(id: string): import('./types').ElementId[] {
  switch (id) {
    case 'cardiac_risk': return ['cardiac'];
    case 'anxiety_mental': return ['mental', 'psychiatric'];
    case 'chronic_digestive': return ['digestive', 'chronic'];
    case 'urogenital': return ['reproductive'];
    case 'chronic_hidden': return ['chronic'];
    case 'nervous_system': return ['nervous'];
    case 'respiratory': return ['respiratory'];
    case 'eye_sleep': return ['eyes', 'sleep'];
    default: return [];
  }
}

// ── Additional signatures NOT in medical/constants.ts ──

SIGNATURE_REGISTRY['nervous_system_vata'] = SIGNATURE_REGISTRY['nervous_system'];

SIGNATURE_REGISTRY['kemadruma'] = {
  id: 'kemadruma',
  name: { en: 'Kemadruma Yoga', hi: 'केमद्रुम योग' },
  source: 'BPHS-Kemadruma',
  elementsAffected: ['mental', 'psychiatric'],
  detect: (k: KundaliData) => {
    const moon = k.planets.find(p => p.planet.id === 1);
    if (!moon) return false;
    const moonHouse = moon.house;
    const houseOf = (offset: number) => ((moonHouse - 1 + offset + 12) % 12) + 1;
    const inHouse = (h: number) => k.planets.some(p => p.planet.id !== 1 && p.house === h);
    if (inHouse(houseOf(1)) || inHouse(houseOf(-1))) return false;  // 2nd or 12th from Moon
    // No planet in kendra from Moon
    for (const off of [3, 6, 9]) {  // 4th, 7th, 10th from Moon are kendras
      if (inHouse(houseOf(off))) return false;
    }
    return true;
  },
};

SIGNATURE_REGISTRY['pisaca'] = {
  id: 'pisaca',
  name: { en: 'Pisaca Yoga', hi: 'पिशाच योग' },
  source: 'Saravali',
  elementsAffected: ['psychiatric'],
  detect: (k: KundaliData) => {
    const moon = k.planets.find(p => p.planet.id === 1);
    const rahu = k.planets.find(p => p.planet.id === 7);
    if (!moon || !rahu) return false;
    if (moon.sign !== rahu.sign) return false;
    // No benefic aspecting Moon (simplified: no benefic in 1/5/7/9 from Moon)
    const moonHouse = moon.house;
    const aspectHouses = [moonHouse, ((moonHouse - 1 + 4) % 12) + 1, ((moonHouse - 1 + 6) % 12) + 1, ((moonHouse - 1 + 8) % 12) + 1];
    const benefics = [3, 4, 5];  // Mercury, Jupiter, Venus
    const hasBeneficAspect = k.planets.some(p => benefics.includes(p.planet.id) && aspectHouses.includes(p.house));
    return !hasBeneficAspect;
  },
};

SIGNATURE_REGISTRY['mars_rahu_accident'] = {
  id: 'mars_rahu_accident',
  name: { en: 'Mars-Rahu Accident Pattern', hi: 'मंगल-राहु दुर्घटना योग' },
  source: 'Sarvartha-Chintamani',
  elementsAffected: ['accidents'],
  detect: (k: KundaliData) => {
    const marsH = planetHouse(k, 2);
    const rahuH = planetHouse(k, 7);
    if (marsH == null || rahuH == null) return false;
    if (marsH !== rahuH) return false;
    return marsH === 4 || marsH === 8;
  },
};

SIGNATURE_REGISTRY['saturn_rahu_malignancy'] = {
  id: 'saturn_rahu_malignancy',
  name: { en: 'Saturn-Rahu Malignancy Diathesis', hi: 'शनि-राहु कर्क योग' },
  source: 'Saravali-5, Bhrigu-Samhita',
  elementsAffected: ['cancer'],  // opt-in element ONLY — NOT 'chronic'
  detect: (k: KundaliData) => {
    const sat = k.planets.find(p => p.planet.id === 6);
    const rahu = k.planets.find(p => p.planet.id === 7);
    if (!sat || !rahu) return false;
    if (sat.sign === rahu.sign) return true;
    // Mutual 7th aspect (opposition)
    return Math.abs(((sat.sign - rahu.sign + 12) % 12) - 6) <= 0;
  },
};

export function detectAllSignatures(k: KundaliData): Record<string, boolean> {
  const out: Record<string, boolean> = {};
  for (const id of Object.keys(SIGNATURE_REGISTRY)) {
    try {
      out[id] = SIGNATURE_REGISTRY[id].detect(k);
    } catch (err) {
      console.error(`[health-diagnosis/signatures] ${id} threw:`, err);
      out[id] = false;
    }
  }
  return out;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/health-diagnosis/signatures.ts \
        src/lib/kundali/health-diagnosis/__tests__/signatures.test.ts
git commit -m "feat(health-diagnosis): signature detector registry (Task A3)"
```

---

### Task A4: Weights vector

**Files:**
- Create: `src/lib/kundali/health-diagnosis/weights.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/weights.test.ts`

**Background:** Each element scores its significators with element-specific weights over the strength axes. This file holds the weight vectors so the per-element files (Phase B) are slim. Default weight if not specified per-element: each axis contributes equally.

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/weights.test.ts
import { describe, it, expect } from 'vitest';
import { ELEMENT_WEIGHTS, DEFAULT_WEIGHTS, weightVectorForElement } from '../weights';
import { ELEMENT_IDS } from '../element-catalog';

describe('element weights', () => {
  it('every element has a weight vector defined or falls back cleanly', () => {
    for (const id of ELEMENT_IDS) {
      const w = weightVectorForElement(id);
      const sum = Object.values(w).reduce((a, b) => a + b, 0);
      // Weight vectors should sum approximately to 1.0 (normalised)
      expect(sum).toBeGreaterThan(0.95);
      expect(sum).toBeLessThan(1.05);
    }
  });

  it('vitality weights emphasise Sun shadbala and 8th-lord dignity', () => {
    const w = weightVectorForElement('vitality');
    expect(w.sunShadbala).toBeGreaterThanOrEqual(0.15);
    expect(w.eighthLordDignity).toBeGreaterThanOrEqual(0.1);
  });

  it('mental weights emphasise Moon shadbala and aspect quality', () => {
    const w = weightVectorForElement('mental');
    expect(w.moonShadbala).toBeGreaterThanOrEqual(0.2);
    expect(w.aspectsOnMoon).toBeGreaterThanOrEqual(0.1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/weights.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement weight vectors**

```ts
// src/lib/kundali/health-diagnosis/weights.ts
import type { ElementId } from './types';

/**
 * Sparse weight vector. Each named axis represents a specific input the
 * scoring function will look up (e.g. 'sunShadbala' = Sun's overall strength,
 * 'sixthHouseBhavabala' = bhavabala of the 6th house from lagna).
 * Vectors must sum to ~1.0 — they are normalised weights.
 */
export type WeightVector = Record<string, number>;

export const DEFAULT_WEIGHTS: WeightVector = {
  primaryPlanetStrength: 0.4,
  primaryHouseBhavabala: 0.3,
  primaryHouseLordDignity: 0.2,
  signatureMatches: 0.1,
};

export const ELEMENT_WEIGHTS: Partial<Record<ElementId, WeightVector>> = {
  vitality: {
    sunShadbala: 0.2,
    lagnaLordDignity: 0.2,
    eighthLordDignity: 0.2,
    saturnAvastha: 0.15,
    lagnaBhavabala: 0.15,
    signatureMatches: 0.1,
  },
  mental: {
    moonShadbala: 0.25,
    moonPakshaBala: 0.15,
    moonHousePlacement: 0.1,
    aspectsOnMoon: 0.15,
    mercuryStrength: 0.1,
    fourthHouseBhavabala: 0.1,
    signatureMatches: 0.15,
  },
  digestive: {
    sunShadbala: 0.2,
    marsDignity: 0.15,
    mercuryCombustState: 0.1,
    fifthHouseBhavabala: 0.15,
    sixthHouseBhavabala: 0.15,
    sixthLordDignity: 0.15,
    signatureMatches: 0.1,
  },
  cardiac: {
    sunShadbala: 0.25,
    fourthHouseBhavabala: 0.2,
    fourthLordPlacement: 0.2,
    marsInfluenceOn4th: 0.15,
    signatureMatches: 0.2,
  },
  respiratory: {
    mercuryShadbala: 0.2,
    mercuryCombustState: 0.15,
    thirdHouseBhavabala: 0.2,
    thirdLordDignity: 0.15,
    maleficsIn3rd: 0.15,
    signatureMatches: 0.15,
  },
  nervous: {
    mercuryStrength: 0.2,
    saturnDignity: 0.2,
    rahuHousePlacement: 0.15,
    lagnaInfluence: 0.15,
    signatureMatches: 0.3,
  },
  skeletal: {
    saturnShadbala: 0.25,
    saturnDignity: 0.15,
    saturnAvastha: 0.15,
    tenthHouseBhavabala: 0.15,
    sunStrength: 0.1,
    signatureMatches: 0.2,
  },
  muscular: {
    marsShadbala: 0.25,
    marsDignity: 0.15,
    marsRetrogradeState: 0.1,
    marsCombustState: 0.1,
    thirdHouseBhavabala: 0.15,
    sixthHouseBhavabala: 0.1,
    signatureMatches: 0.15,
  },
  skin: {
    mercuryCombustState: 0.1,
    venusDignity: 0.15,
    saturnIn2ndOr6th: 0.15,
    sixthHouseBhavabala: 0.2,
    marsSunIn6th: 0.1,
    signatureMatches: 0.3,
  },
  eyes: {
    sunCombustState: 0.15,
    moonCombustState: 0.15,
    sunDignity: 0.1,
    moonDignity: 0.1,
    secondHouseBhavabala: 0.15,
    twelfthHouseBhavabala: 0.15,
    signatureMatches: 0.2,
  },
  reproductive: {
    venusShadbala: 0.25,
    venusCombustState: 0.1,
    venusDignity: 0.15,
    seventhHouseBhavabala: 0.2,
    seventhLordPlacement: 0.15,
    signatureMatches: 0.15,
  },
  endocrine: {
    jupiterDignity: 0.3,
    jupiterShadbala: 0.2,
    fifthHouseBhavabala: 0.2,
    signatureMatches: 0.3,
  },
  immunity: {
    jupiterShadbala: 0.25,
    jupiterDignity: 0.2,
    jupiterAvastha: 0.1,
    lagnaLordDignity: 0.15,
    sunAvastha: 0.1,
    signatureMatches: 0.2,
  },
  chronic: {
    eighthHouseBhavabala: 0.25,
    eighthLordDignity: 0.2,
    saturnRahuAxisPresence: 0.15,
    signatureMatches: 0.4,
  },
  accidents: {
    marsDignity: 0.2,
    marsRetrogradeState: 0.1,
    eighthHouseBhavabala: 0.2,
    rahuKetuAxisPlacement: 0.15,
    signatureMatches: 0.35,
  },
  surgery: {
    marsDignity: 0.2,
    eighthHouseBhavabala: 0.25,
    twelfthHouseBhavabala: 0.2,
    signatureMatches: 0.35,
  },
  psychiatric: {
    moonRahuConjunction: 0.25,
    mercuryDebilCombustDusthana: 0.2,
    fourthHouseBhavabala: 0.15,
    fifthHouseBhavabala: 0.15,
    signatureMatches: 0.25,
  },
  addictions: {
    rahuHousePlacement: 0.25,
    moonAfflictionByRahu: 0.2,
    twelfthLordPlacement: 0.15,
    sixthHouseBhavabala: 0.1,
    signatureMatches: 0.3,
  },
  sleep: {
    twelfthHouseBhavabala: 0.25,
    moonPakshaBala: 0.2,
    saturnAspectOn12thOrMoon: 0.2,
    signatureMatches: 0.35,
  },
  allergies: {
    rahuHousePlacement: 0.3,
    mercuryCombustNakshatra: 0.2,
    sixthHouseBhavabala: 0.2,
    signatureMatches: 0.3,
  },
  cancer: {
    saturnRahuAxisStrength: 0.4,
    eighthHouseBhavabala: 0.2,
    lagnaMoonInDusthana: 0.15,
    signatureMatches: 0.25,
  },
  longevity: {
    eighthLordDignity: 0.3,
    saturnAvastha: 0.2,
    lagnaVsEighthLordStrength: 0.25,
    pindaAyurdaya: 0.15,
    signatureMatches: 0.1,
  },
};

export function weightVectorForElement(id: ElementId): WeightVector {
  return ELEMENT_WEIGHTS[id] ?? DEFAULT_WEIGHTS;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/weights.test.ts`
Expected: 3 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/health-diagnosis/weights.ts \
        src/lib/kundali/health-diagnosis/__tests__/weights.test.ts
git commit -m "feat(health-diagnosis): per-element weight vectors (Task A4)"
```

---

## Phase B — Element scorers (22 tasks, one per element)

> **Pattern (read once, applies to all 22 elements):** Each element file exports
> `scoreElement(k, strength, signatures, locale): NatalElement`. The function:
> 1. Looks up `ELEMENT_CATALOG[id]` for metadata.
> 2. Looks up `weightVectorForElement(id)` for axis weights.
> 3. Reads the named axes from `strength` (e.g. `strength.planets[0].overall`,
>    `strength.houses[1].bhavabala`).
> 4. Reads `signatures[<sig-id>]` boolean matches.
> 5. Computes weighted sum → `natalScore ∈ [0, 100]`.
> 6. Maps score to `rating` via the same threshold used in DomainCard
>    (≥75 uttama, ≥50 madhyama, ≥25 adhama, else atyadhama — note: HIGH score
>    here means HIGH VULNERABILITY, so vulnerability 75 = atyadhama rating).
> 7. Returns `factors` (human-readable why) and `classicalSignatures`
>    (matched signature ids with name + source).
>
> **Template task is B1 (vitality). Tasks B2–B22 are deltas from B1.**

### Task B1: scoreElement for `vitality` — template implementation

**Files:**
- Create: `src/lib/kundali/health-diagnosis/elements/vitality.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts
import { describe, it, expect } from 'vitest';
import { scoreVitality } from '../../elements/vitality';
import { collectStrengthInputs } from '../../strength-inputs';
import { detectAllSignatures } from '../../signatures';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const FIXTURE = {
  date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21,
  timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const,
};

describe('scoreVitality', () => {
  it('returns NatalElement with id=vitality, score in [0,100], 1+ factor', () => {
    const k = generateKundali(FIXTURE);
    const s = collectStrengthInputs(k);
    const sigs = detectAllSignatures(k);
    const result = scoreVitality(k, s, sigs, 'en');
    expect(result.id).toBe('vitality');
    expect(result.natalScore).toBeGreaterThanOrEqual(0);
    expect(result.natalScore).toBeLessThanOrEqual(100);
    expect(result.factors.length).toBeGreaterThanOrEqual(1);
    expect(['uttama', 'madhyama', 'adhama', 'atyadhama']).toContain(result.rating);
  });

  it('attaches metadata from ELEMENT_CATALOG (name, category, badge)', () => {
    const k = generateKundali(FIXTURE);
    const s = collectStrengthInputs(k);
    const sigs = detectAllSignatures(k);
    const result = scoreVitality(k, s, sigs, 'en');
    expect(result.name.en).toBe('Vitality');
    expect(result.category).toBe('longevity');
    expect(result.badge).toBe('classical');
    expect(result.requiresDisclaimer).toBe(false);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement scorer**

```ts
// src/lib/kundali/health-diagnosis/elements/vitality.ts
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { NatalElement } from '../types';
import { ELEMENT_CATALOG } from '../element-catalog';
import { weightVectorForElement } from '../weights';
import { SIGNATURE_REGISTRY } from '../signatures';
import { houseLordId, type StrengthInputs } from '../strength-inputs';
import { ratingFromScore, vulnerabilityScore } from '../scoring-utils';

export function scoreVitality(
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  _locale: Locale,
): NatalElement {
  const meta = ELEMENT_CATALOG['vitality'];
  const w = weightVectorForElement('vitality');

  const sunOverall = strength.planets[0]?.overall ?? 0;
  const lagnaLordId = houseLordId(k, 1);
  const lagnaLordOverall = lagnaLordId != null ? (strength.planets[lagnaLordId]?.overall ?? 0) : 0;
  const eighthLordId = houseLordId(k, 8);
  const eighthLordDignityScore = eighthLordId != null
    ? dignityToScore(strength.planets[eighthLordId]?.dignity ?? 'neutral')
    : 50;
  const saturnAvastha = strength.planets[6]?.baladiStrength ?? 50;
  const lagnaBhavabala = strength.houses[1]?.bhavabala ?? 0;

  const sigMatches = ['kemadruma'].filter(id => signatures[id]).length;

  // High score = high vulnerability. We compute resilience first, then invert.
  const resilience =
    w.sunShadbala * sunOverall +
    w.lagnaLordDignity * lagnaLordOverall +
    w.eighthLordDignity * eighthLordDignityScore +
    w.saturnAvastha * saturnAvastha +
    w.lagnaBhavabala * lagnaBhavabala +
    w.signatureMatches * (sigMatches > 0 ? 0 : 100);
  const natalScore = vulnerabilityScore(resilience);

  return {
    id: 'vitality',
    name: meta.name,
    category: meta.category,
    badge: meta.badge,
    natalScore,
    rating: ratingFromScore(natalScore),
    factors: [
      { label: { en: 'Sun strength', hi: 'सूर्य बल' }, verdict: sunOverall >= 50 ? 'positive' : 'negative', value: `${sunOverall}/100` },
      { label: { en: 'Lagna lord', hi: 'लग्नेश' }, verdict: lagnaLordOverall >= 50 ? 'positive' : 'negative', value: `${lagnaLordOverall}/100` },
      { label: { en: '8th lord dignity', hi: 'अष्टमेश गरिमा' }, verdict: eighthLordDignityScore >= 50 ? 'positive' : 'negative', value: String(eighthLordDignityScore) },
      { label: { en: 'Lagna Bhavabala', hi: 'लग्न भावबल' }, verdict: lagnaBhavabala >= 50 ? 'positive' : 'negative', value: `${lagnaBhavabala}/100` },
    ],
    classicalSignatures: ['kemadruma'].filter(id => signatures[id]).map(id => {
      const def = SIGNATURE_REGISTRY[id];
      return { id, name: def.name, source: def.source };
    }),
    requiresDisclaimer: meta.requiresDisclaimer,
  };
}

function dignityToScore(d: import('../strength-inputs').PlanetStrength['dignity']): number {
  switch (d) {
    case 'exalted': return 100;
    case 'own': return 85;
    case 'moolatrikona': return 90;
    case 'friend': return 65;
    case 'neutral': return 50;
    case 'enemy': return 30;
    case 'debilitated': return 10;
  }
}
```

- [ ] **Step 4: Create the shared `scoring-utils.ts` helper module**

```ts
// src/lib/kundali/health-diagnosis/scoring-utils.ts
import type { Rating } from '@/lib/kundali/domain-synthesis/types';

/** Map resilience (0-100, higher = better) → vulnerability (0-100, higher = worse). */
export function vulnerabilityScore(resilience: number): number {
  return Math.max(0, Math.min(100, Math.round(100 - resilience)));
}

/**
 * Vulnerability → Rating. HIGH vulnerability = WORSE rating.
 * 0-24 → uttama, 25-49 → madhyama, 50-74 → adhama, 75-100 → atyadhama.
 */
export function ratingFromScore(vulnerability: number): Rating {
  if (vulnerability < 25) return 'uttama';
  if (vulnerability < 50) return 'madhyama';
  if (vulnerability < 75) return 'adhama';
  return 'atyadhama';
}
```

- [ ] **Step 5: Run tests**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts`
Expected: 2 tests PASS.

- [ ] **Step 6: Type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 7: Commit**

```bash
git add src/lib/kundali/health-diagnosis/elements/vitality.ts \
        src/lib/kundali/health-diagnosis/scoring-utils.ts \
        src/lib/kundali/health-diagnosis/__tests__/elements/vitality.test.ts
git commit -m "feat(health-diagnosis): vitality element scorer + scoring utils (Task B1)"
```

---

### Tasks B2 – B22: per-element scorers (vitality template applied)

For each remaining element, **follow the Task B1 template exactly**, substituting only the element-specific data. **Same step sequence per task** (test → fail → implement → pass → commit).

For brevity, each task below specifies:
- The element name and id
- The axes the scorer reads from `strength` (named exactly as in the weight vector)
- The signature ids the scorer checks
- The factor labels to surface

When implementing, **copy `vitality.ts`** and replace:
1. Function name (`scoreMental`, `scoreDigestive`, …)
2. `ELEMENT_CATALOG['<id>']` lookup
3. The axis reads (e.g. for `mental`: `strength.planets[1]` for Moon, `strength.houses[4]` for 4th)
4. The signature ids matched
5. The factor list

Each task's test file mirrors `vitality.test.ts` — change the import, function name, and the `expect.toBe(<id>)` assertion. Two tests per element: (a) returns NatalElement with score in [0,100] and ≥1 factor; (b) attaches the right metadata.

#### Task B2: `mental`
- Axes: `moonShadbala` ← `strength.planets[1].overall`; `moonPakshaBala` ← derived from Moon's elongation (see below); `aspectsOnMoon` ← count of malefic aspects (compute via `derivAspectsOnMoon(k)` helper added in this task); `mercuryStrength` ← `strength.planets[3].overall`; `fourthHouseBhavabala` ← `strength.houses[4].bhavabala`.
- Signatures: `kemadruma`, `pisaca`, `anxiety_mental`.
- Helper to add this task: `derivAspectsOnMoon(k)` returns `{ malefic: number; benefic: number }` counting graha drishti onto Moon's house. Implementation: for each malefic (2, 6, 7, 8), check if its aspect houses include Moon's house using the standard 7th + special aspects (Mars 4,8; Jupiter 5,9; Saturn 3,10).
- Factor labels: "Moon strength", "Moon waxing", "Aspects on Moon", "Mercury strength", "4th house Bhavabala".

#### Task B3: `digestive`
- Axes: `sunShadbala`, `marsDignity` (use `dignityToScore`), `mercuryCombustState` (boolean → 0 or 50), `fifthHouseBhavabala`, `sixthHouseBhavabala`, `sixthLordDignity`.
- Signatures: `chronic_digestive`.
- Factor labels: "Sun (agni)", "Mars dignity", "Mercury combust", "5th house", "6th house", "6th lord".

#### Task B4: `cardiac`
- Axes: `sunShadbala`, `fourthHouseBhavabala`, `fourthLordPlacement` (score = 100 if in kendra/trikona, 50 if neutral, 0 if dusthana), `marsInfluenceOn4th` (occupation OR drishti → 100, none → 0).
- Signatures: `cardiac_risk`.
- Factor labels: "Sun strength", "4th house", "4th lord placement", "Mars influence on 4th".

#### Task B5: `respiratory`
- Axes: `mercuryShadbala`, `mercuryCombustState`, `thirdHouseBhavabala`, `thirdLordDignity`, `maleficsIn3rd` (count of malefics × 25, capped at 100).
- Signatures: `respiratory`.
- Factor labels: "Mercury", "Mercury combust", "3rd house", "3rd lord", "Malefics in 3rd".

#### Task B6: `nervous`
- Axes: `mercuryStrength`, `saturnDignity`, `rahuHousePlacement` (1 → 100, dusthana → 80, kendra → 40, else 50), `lagnaInfluence` (malefics in lagna count × 30, capped 100).
- Signatures: `nervous_system_vata`.
- Factor labels: "Mercury", "Saturn dignity", "Rahu placement", "Lagna influence".

#### Task B7: `skeletal`
- Axes: `saturnShadbala`, `saturnDignity`, `saturnAvastha`, `tenthHouseBhavabala`, `sunStrength`.
- Signatures: none from the existing registry; add a local check: Saturn debilitated AND 10th house heavily afflicted.
- Factor labels: "Saturn strength", "Saturn dignity", "Saturn avastha", "10th house", "Sun strength".

#### Task B8: `muscular`
- Axes: `marsShadbala`, `marsDignity`, `marsRetrogradeState` (retrograde → 75, direct → 0), `marsCombustState`, `thirdHouseBhavabala`, `sixthHouseBhavabala`.
- Signatures: none in registry yet; add `mars_combust_inflammation` (Mars combust AND any malefic in 6th).
- Factor labels: "Mars strength", "Mars dignity", "Mars retrograde", "Mars combust", "3rd house", "6th house".

#### Task B9: `skin`
- Axes: `mercuryCombustState`, `venusDignity`, `saturnIn2ndOr6th` (boolean → 100 / 0), `sixthHouseBhavabala`, `marsSunIn6th` (boolean).
- Signatures: none yet; add `mercury_saturn_eczema` (Mercury + Saturn in same house ∈ {2,6,8}).
- Factor labels: "Mercury combust", "Venus dignity", "Saturn in 2/6", "6th house", "Mars+Sun in 6th".

#### Task B10: `eyes`
- Axes: `sunCombustState`, `moonCombustState`, `sunDignity`, `moonDignity`, `secondHouseBhavabala`, `twelfthHouseBhavabala`.
- Signatures: `eye_sleep`; add `andhya_yoga` (Sun+Moon in 2nd with Mars present).
- Factor labels: "Sun combust", "Moon combust", "Sun dignity", "Moon dignity", "2nd house", "12th house".

#### Task B11: `reproductive`
- Axes: `venusShadbala`, `venusCombustState`, `venusDignity`, `seventhHouseBhavabala`, `seventhLordPlacement`.
- Signatures: `urogenital`.
- Factor labels: "Venus strength", "Venus combust", "Venus dignity", "7th house", "7th lord placement".

#### Task B12: `endocrine` *(Inferential badge — verify badge string in test)*
- Axes: `jupiterDignity`, `jupiterShadbala`, `fifthHouseBhavabala`.
- Signatures: none yet; add `jupiter_debil_5th_diabetes` (Jupiter debilitated in 5th or 6th).
- Factor labels: "Jupiter dignity", "Jupiter strength", "5th house".

#### Task B13: `immunity`
- Axes: `jupiterShadbala`, `jupiterDignity`, `jupiterAvastha`, `lagnaLordDignity`, `sunAvastha`.
- Signatures: none yet; add `jupiter_dusthana_no_benefic_aspect` (Jupiter in 6/8/12 with no benefic aspecting it).
- Factor labels: "Jupiter strength", "Jupiter dignity", "Jupiter avastha", "Lagna lord", "Sun avastha".

#### Task B14: `chronic`
- Axes: `eighthHouseBhavabala`, `eighthLordDignity`, `saturnRahuAxisPresence` (Saturn & Rahu in same house OR mutual 7th → 100, else 0). **Note:** This element MUST NOT use the malignancy interpretation — that lives in `cancer` only.
- Signatures: `chronic_hidden`.
- Factor labels: "8th house", "8th lord", "Saturn-Rahu axis".

#### Task B15: `accidents`
- Axes: `marsDignity`, `marsRetrogradeState`, `eighthHouseBhavabala`, `rahuKetuAxisPlacement` (Rahu in 4/8 → 100, else 50).
- Signatures: `mars_rahu_accident`.
- Factor labels: "Mars dignity", "Mars retrograde", "8th house", "Rahu-Ketu placement".

#### Task B16: `surgery`
- Axes: `marsDignity`, `eighthHouseBhavabala`, `twelfthHouseBhavabala`.
- Signatures: none yet; add `mars_saturn_8th` (Mars + Saturn in 8th), `twelfth_sixth_swap` (12th lord in 6th OR 6th lord in 12th).
- Factor labels: "Mars dignity", "8th house", "12th house".

#### Task B17: `psychiatric` *(disclaimer-gated — test must assert `requiresDisclaimer: true`)*
- Axes: `moonRahuConjunction` (boolean × 100), `mercuryDebilCombustDusthana` (boolean × 100), `fourthHouseBhavabala`, `fifthHouseBhavabala`.
- Signatures: `anxiety_mental`, `pisaca`; add `buddhi_bhrama` (Mercury + Moon + Rahu mutual aspect).
- Factor labels: "Moon-Rahu conjunction", "Mercury debil+combust+dusthana", "4th house", "5th house".

#### Task B18: `addictions`
- Axes: `rahuHousePlacement`, `moonAfflictionByRahu` (boolean × 100), `twelfthLordPlacement` (in 6/8/12 → 100, else 0), `sixthHouseBhavabala`.
- Signatures: none yet; add `moon_rahu_12th` (Moon-Rahu in 12th house), `venus_mars_rahu` (Venus, Mars, Rahu mutual aspect).
- Factor labels: "Rahu placement", "Moon affliction by Rahu", "12th lord", "6th house".

#### Task B19: `sleep`
- Axes: `twelfthHouseBhavabala`, `moonPakshaBala` (waning → 0, waxing → 100), `saturnAspectOn12thOrMoon` (boolean × 100).
- Signatures: `eye_sleep`; add `moon_saturn_opposition` (Moon and Saturn in opposition), `ketu_in_12th`.
- Factor labels: "12th house", "Moon waxing", "Saturn aspect".

#### Task B20: `allergies` *(opt-in, Inferential — test must assert `defaultVisible: false`)*
- Axes: `rahuHousePlacement`, `mercuryCombustNakshatra` (Mercury combust in nakshatra of malefic → 100 else 0), `sixthHouseBhavabala`.
- Signatures: none yet; add `rahu_in_6th` (Rahu in 6th house), `mercury_debil_rahu_aspect`.
- Factor labels: "Rahu placement", "Mercury combust+nakshatra", "6th house".

#### Task B21: `cancer` *(opt-in, mixed badge, disclaimer-gated — assert both)*
- Axes: `saturnRahuAxisStrength` (strength of axis: same house = 100, mutual 7th = 80, mutual aspect via Saturn's 3/10 = 50, else 0), `eighthHouseBhavabala`, `lagnaMoonInDusthana` (both lagna and Moon in 6/8/12 → 100, only one → 50, neither → 0).
- Signatures: `saturn_rahu_malignancy`; add `eighth_lord_debil_combust`.
- Factor labels: "Saturn-Rahu axis", "8th house", "Lagna+Moon in dusthana".

#### Task B22: `longevity` *(opt-in, disclaimer-gated — assert)*
- Axes: `eighthLordDignity`, `saturnAvastha`, `lagnaVsEighthLordStrength` (lagna_lord_overall - eighth_lord_overall, mapped to [-100, 100] then to [0, 100]), `pindaAyurdaya` (implement a minimal Pinda Ayurdaya sum in this task — see spec §4.22 "Classical Ayur calculation methods"; expose as a separate function `computePindaAyurdaya(kundali): number` returning years).
- Output: alongside `natalScore`, this scorer must populate a separate `longevityClassification: 'alpa' | 'madhya' | 'purna'` field. Add this to `NatalElement` as an optional field in `types.ts` before this task runs (or accept it on a separate return type `LongevityResult extends NatalElement`).
- Signatures: none registered; add `maraka_lord_strong` (2nd or 7th lord is a strong malefic-natured planet).
- Factor labels: "8th lord", "Saturn avastha", "Lagna vs 8th lord", "Pinda Ayurdaya (yrs)".

---

### Task B23: elements index aggregator

**Files:**
- Create: `src/lib/kundali/health-diagnosis/elements/index.ts`
- Test: extend `src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts
import { describe, it, expect } from 'vitest';
import { SCORERS } from '../../elements';
import { ELEMENT_IDS } from '../../element-catalog';

describe('elements aggregator', () => {
  it('SCORERS has one entry per ElementId', () => {
    for (const id of ELEMENT_IDS) {
      expect(SCORERS[id]).toBeDefined();
      expect(typeof SCORERS[id]).toBe('function');
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts`
Expected: FAIL.

- [ ] **Step 3: Implement aggregator**

```ts
// src/lib/kundali/health-diagnosis/elements/index.ts
import type { ElementId, NatalElement } from '../types';
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { StrengthInputs } from '../strength-inputs';

import { scoreVitality } from './vitality';
import { scoreMental } from './mental';
import { scoreDigestive } from './digestive';
import { scoreCardiac } from './cardiac';
import { scoreRespiratory } from './respiratory';
import { scoreNervous } from './nervous';
import { scoreSkeletal } from './skeletal';
import { scoreMuscular } from './muscular';
import { scoreSkin } from './skin';
import { scoreEyes } from './eyes';
import { scoreReproductive } from './reproductive';
import { scoreEndocrine } from './endocrine';
import { scoreImmunity } from './immunity';
import { scoreChronic } from './chronic';
import { scoreAccidents } from './accidents';
import { scoreSurgery } from './surgery';
import { scorePsychiatric } from './psychiatric';
import { scoreAddictions } from './addictions';
import { scoreSleep } from './sleep';
import { scoreAllergies } from './allergies';
import { scoreCancer } from './cancer';
import { scoreLongevity } from './longevity';

export type ElementScorer = (
  k: KundaliData,
  strength: StrengthInputs,
  signatures: Record<string, boolean>,
  locale: Locale,
) => NatalElement;

export const SCORERS: Record<ElementId, ElementScorer> = {
  vitality: scoreVitality,
  mental: scoreMental,
  digestive: scoreDigestive,
  cardiac: scoreCardiac,
  respiratory: scoreRespiratory,
  nervous: scoreNervous,
  skeletal: scoreSkeletal,
  muscular: scoreMuscular,
  skin: scoreSkin,
  eyes: scoreEyes,
  reproductive: scoreReproductive,
  endocrine: scoreEndocrine,
  immunity: scoreImmunity,
  chronic: scoreChronic,
  accidents: scoreAccidents,
  surgery: scoreSurgery,
  psychiatric: scorePsychiatric,
  addictions: scoreAddictions,
  sleep: scoreSleep,
  allergies: scoreAllergies,
  cancer: scoreCancer,
  longevity: scoreLongevity,
};
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/health-diagnosis/elements/index.ts \
        src/lib/kundali/health-diagnosis/__tests__/elements/_aggregator.test.ts
git commit -m "feat(health-diagnosis): elements index aggregator (Task B23)"
```

---

## Phase C — Layer composers (4 tasks)

### Task C1: Layer 1 natal composer

**Files:**
- Create: `src/lib/kundali/health-diagnosis/layer-1-natal.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/layer-1-natal.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { composeLayer1 } from '../layer-1-natal';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const F = { date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const };

describe('composeLayer1', () => {
  it('returns 19 elements by default', () => {
    const k = generateKundali(F);
    const out = composeLayer1(k, { extended: false }, 'en');
    expect(out.natalElements).toHaveLength(19);
    expect(out.hiddenElements.sort()).toEqual(['allergies', 'cancer', 'longevity']);
  });

  it('returns 22 elements when extended=true', () => {
    const k = generateKundali(F);
    const out = composeLayer1(k, { extended: true }, 'en');
    expect(out.natalElements).toHaveLength(22);
    expect(out.hiddenElements).toHaveLength(0);
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/kundali/health-diagnosis/layer-1-natal.ts
import type { KundaliData } from '@/types/kundali';
import type { Locale } from '@/types/panchang';
import type { HealthDiagnosisOptions, NatalElement, ElementId } from './types';
import { ELEMENT_CATALOG, DEFAULT_VISIBLE_IDS, EXTENDED_IDS } from './element-catalog';
import { collectStrengthInputs } from './strength-inputs';
import { detectAllSignatures } from './signatures';
import { SCORERS } from './elements';

export interface Layer1Result {
  natalElements: NatalElement[];
  hiddenElements: ElementId[];
}

export function composeLayer1(
  k: KundaliData,
  opts: HealthDiagnosisOptions,
  locale: Locale,
): Layer1Result {
  const strength = collectStrengthInputs(k);
  const signatures = detectAllSignatures(k);
  const visibleIds = opts.extended ? [...DEFAULT_VISIBLE_IDS, ...EXTENDED_IDS] : DEFAULT_VISIBLE_IDS;
  const natalElements = visibleIds.map(id => SCORERS[id](k, strength, signatures, locale));
  const hiddenElements = opts.extended ? [] : [...EXTENDED_IDS];
  return { natalElements, hiddenElements };
}
```

- [ ] **Step 3: Run tests + type-check + commit**

```bash
npx vitest run src/lib/kundali/health-diagnosis/__tests__/layer-1-natal.test.ts
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/kundali/health-diagnosis/layer-1-natal.ts \
        src/lib/kundali/health-diagnosis/__tests__/layer-1-natal.test.ts
git commit -m "feat(health-diagnosis): Layer 1 composer (Task C1)"
```

### Task C2: Layer 2 mode composer

**Files:**
- Create: `src/lib/kundali/health-diagnosis/layer-2-mode.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/layer-2-mode.test.ts`

- [ ] **Step 1: Write test**

```ts
import { describe, it, expect } from 'vitest';
import { composeLayer2 } from '../layer-2-mode';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const F = { date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const };

describe('composeLayer2', () => {
  it('returns prakriti + modeNote with primary dosha name', () => {
    const k = generateKundali(F);
    const { prakriti, modeNote } = composeLayer2(k, 'en');
    expect(['Vata', 'Pitta', 'Kapha']).toContain(prakriti.primaryDosha);
    expect(modeNote.en.toLowerCase()).toContain(prakriti.primaryDosha.toLowerCase());
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/kundali/health-diagnosis/layer-2-mode.ts
import type { KundaliData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';
import { computePrakriti, type PrakritiResult } from '@/lib/medical/prakriti';

export interface Layer2Result {
  prakriti: PrakritiResult;
  modeNote: LocaleText;
}

export function composeLayer2(k: KundaliData, _locale: Locale): Layer2Result {
  const prakriti = computePrakriti(k);
  const dosha = prakriti.primaryDosha;
  const modeMap: Record<string, LocaleText> = {
    Vata: {
      en: 'Your Vata-dominant constitution means symptoms tend to manifest as dryness, irregularity, anxiety, and joint stiffness. Health flares are often Vata-aggravated.',
      hi: 'आपकी वात-प्रधान प्रकृति का अर्थ है कि लक्षण सूखापन, अनियमितता, चिंता और जोड़ों की कठोरता के रूप में प्रकट होते हैं।',
    },
    Pitta: {
      en: 'Your Pitta-dominant constitution means symptoms tend to manifest as heat, inflammation, acidity, and irritability. Health flares are often Pitta-aggravated.',
      hi: 'आपकी पित्त-प्रधान प्रकृति का अर्थ है कि लक्षण गर्मी, सूजन, अम्लता और चिड़चिड़ापन के रूप में प्रकट होते हैं।',
    },
    Kapha: {
      en: 'Your Kapha-dominant constitution means symptoms tend to manifest as congestion, weight gain, lethargy, and water retention. Health flares are often Kapha-aggravated.',
      hi: 'आपकी कफ-प्रधान प्रकृति का अर्थ है कि लक्षण जमाव, वजन बढ़ना, सुस्ती और जल प्रतिधारण के रूप में प्रकट होते हैं।',
    },
  };
  return { prakriti, modeNote: modeMap[dosha] ?? modeMap.Vata };
}
```

- [ ] **Step 3: Run + commit**

```bash
npx vitest run src/lib/kundali/health-diagnosis/__tests__/layer-2-mode.test.ts
git add src/lib/kundali/health-diagnosis/layer-2-mode.ts \
        src/lib/kundali/health-diagnosis/__tests__/layer-2-mode.test.ts
git commit -m "feat(health-diagnosis): Layer 2 mode composer (Task C2)"
```

### Task C3: Layer 3 activation composer (with unclamped trend + inflection)

**Files:**
- Create: `src/lib/kundali/health-diagnosis/layer-3-activation.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/layer-3-activation.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
import { describe, it, expect } from 'vitest';
import { composeLayer3 } from '../layer-3-activation';
import { composeLayer1 } from '../layer-1-natal';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const F = { date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const };

describe('composeLayer3', () => {
  it('returns one multiplier entry per natal element with values within bounds', () => {
    const k = generateKundali(F);
    const layer1 = composeLayer1(k, { extended: false }, 'en');
    const { currentMultipliers, displayedElements } = composeLayer3(k, layer1, { today: new Date('2026-05-27'), age: 36 });
    for (const e of layer1.natalElements) {
      const m = currentMultipliers[e.id];
      expect(m.dashaContribution).toBeGreaterThanOrEqual(0);
      expect(m.dashaContribution).toBeLessThanOrEqual(0.5);
      expect(m.transitContribution).toBeGreaterThanOrEqual(0);
      expect(m.transitContribution).toBeLessThanOrEqual(0.5);
      expect(m.lifeStageGate).toBeGreaterThanOrEqual(0.5);
      expect(m.lifeStageGate).toBeLessThanOrEqual(1.5);
    }
    expect(displayedElements).toHaveLength(layer1.natalElements.length);
  });

  it('displayedScore is clamped but unclampedScore is not — trend uses unclamped', () => {
    const k = generateKundali(F);
    const layer1 = composeLayer1(k, { extended: false }, 'en');
    const { displayedElements } = composeLayer3(k, layer1, { today: new Date('2026-05-27'), age: 36 });
    for (const d of displayedElements) {
      expect(d.displayedScore).toBeGreaterThanOrEqual(0);
      expect(d.displayedScore).toBeLessThanOrEqual(100);
      // unclamped can exceed 100 if multipliers compound
      expect(typeof d.unclampedScore).toBe('number');
      expect(['improving', 'stable', 'worsening']).toContain(d.trend);
    }
  });
});
```

- [ ] **Step 2: Implement**

```ts
// src/lib/kundali/health-diagnosis/layer-3-activation.ts
import type { KundaliData } from '@/types/kundali';
import type {
  ElementId, NatalElement, ElementMultipliers, DisplayedElement, HealthDiagnosisOptions,
} from './types';
import type { Layer1Result } from './layer-1-natal';

/** Map from a planet id (the dasha/antardasha lord) to the element ids it amplifies, with weight. */
const DASHA_ELEMENT_AMPLIFICATION: Record<number, Partial<Record<ElementId, number>>> = {
  0: { vitality: 0.25, cardiac: 0.3, digestive: 0.15, eyes: 0.15 },                       // Sun
  1: { mental: 0.3, psychiatric: 0.2, sleep: 0.25, reproductive: 0.1, eyes: 0.1 },       // Moon
  2: { muscular: 0.3, accidents: 0.4, surgery: 0.25, digestive: 0.15 },                  // Mars
  3: { nervous: 0.25, respiratory: 0.25, skin: 0.15, mental: 0.1, allergies: 0.2 },     // Mercury
  4: { immunity: 0.25, endocrine: 0.25, reproductive: 0.15, mental: 0.1 },              // Jupiter
  5: { reproductive: 0.3, skin: 0.2, endocrine: 0.2 },                                   // Venus
  6: { skeletal: 0.4, chronic: 0.3, nervous: 0.2, immunity: 0.2 },                       // Saturn
  7: { addictions: 0.4, psychiatric: 0.3, allergies: 0.3, nervous: 0.2, cancer: 0.25 },  // Rahu
  8: { sleep: 0.2, psychiatric: 0.15, surgery: 0.2, allergies: 0.15 },                  // Ketu
};

function getCurrentDashaPlanets(k: KundaliData, now: Date): { maha: number | null; antar: number | null } {
  const t = now.getTime();
  const mahas = (k.dashas ?? []).filter(d => d.level === 'maha');
  const maha = mahas.find(d => new Date(d.startDate).getTime() <= t && t <= new Date(d.endDate).getTime());
  const antars = (k.dashas ?? []).filter(d => d.level === 'antar');
  const antar = antars.find(d => new Date(d.startDate).getTime() <= t && t <= new Date(d.endDate).getTime());
  const nameToId: Record<string, number> = { Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8 };
  return {
    maha: maha ? nameToId[maha.planet] ?? null : null,
    antar: antar ? nameToId[antar.planet] ?? null : null,
  };
}

function dashaMultiplier(id: ElementId, mahaId: number | null, antarId: number | null): number {
  const fromMaha = mahaId != null ? (DASHA_ELEMENT_AMPLIFICATION[mahaId]?.[id] ?? 0) * 0.6 : 0;
  const fromAntar = antarId != null ? (DASHA_ELEMENT_AMPLIFICATION[antarId]?.[id] ?? 0) * 0.4 : 0;
  return Math.min(0.5, fromMaha + fromAntar);
}

function transitMultiplier(_k: KundaliData, id: ElementId, _today: Date): number {
  // Phase D wires real transit computation; for Phase C we return a flat 0
  // unless Sade Sati is active, then 0.05 baseline + element-specific bonus.
  // (Detailed transit logic is added in Task D2 once the engine is consumed.)
  return id ? 0 : 0;
}

const LIFE_STAGE_CURVES: Partial<Record<ElementId, (age: number) => number>> = {
  skeletal: (age) => age < 25 ? 0.6 : age < 35 ? 0.85 : age < 60 ? 1.2 : 1.5,
  reproductive: (age) => age < 12 ? 0.5 : age < 50 ? 1.0 : 0.7,
  cardiac: (age) => age < 30 ? 0.8 : age < 50 ? 1.0 : 1.3,
  cancer: (age) => age < 40 ? 0.7 : 1.2,
  longevity: () => 1.0,
};

function lifeStageGate(id: ElementId, age: number | undefined): number {
  if (age == null) return 1.0;
  const curve = LIFE_STAGE_CURVES[id];
  return curve ? curve(age) : 1.0;
}

export interface Layer3Result {
  currentMultipliers: Record<ElementId, ElementMultipliers>;
  displayedElements: DisplayedElement[];
}

function computeOneDisplayed(natal: NatalElement, k: KundaliData, today: Date, age: number | undefined, mahaId: number | null, antarId: number | null): { multipliers: ElementMultipliers; displayed: DisplayedElement } {
  const dasha = dashaMultiplier(natal.id, mahaId, antarId);
  const transit = transitMultiplier(k, natal.id, today);
  const gate = lifeStageGate(natal.id, age);
  const unclamped = natal.natalScore * (1 + dasha) * (1 + transit) * gate;
  const displayedScore = Math.max(0, Math.min(100, Math.round(unclamped)));

  return {
    multipliers: { dashaContribution: dasha, transitContribution: transit, sadeSatiActive: !!k.sadeSati?.isActive, lifeStageGate: gate },
    displayed: {
      id: natal.id,
      displayedScore,
      unclampedScore: Math.round(unclamped),
      trend: 'stable',  // computed below using +90d snapshot
      nextInflectionDate: null,
    },
  };
}

export function composeLayer3(k: KundaliData, layer1: Layer1Result, opts: HealthDiagnosisOptions): Layer3Result {
  const today = opts.today ?? new Date();
  const future = new Date(today.getTime() + 90 * 24 * 3600_000);
  const { maha: todayMaha, antar: todayAntar } = getCurrentDashaPlanets(k, today);
  const { maha: futureMaha, antar: futureAntar } = getCurrentDashaPlanets(k, future);

  const currentMultipliers: Record<ElementId, ElementMultipliers> = {} as Record<ElementId, ElementMultipliers>;
  const displayedElements: DisplayedElement[] = [];

  for (const natal of layer1.natalElements) {
    const todaySide = computeOneDisplayed(natal, k, today, opts.age, todayMaha, todayAntar);
    const futureSide = computeOneDisplayed(natal, k, future, opts.age, futureMaha, futureAntar);
    const delta = futureSide.displayed.unclampedScore - todaySide.displayed.unclampedScore;
    const trend: DisplayedElement['trend'] = delta <= -10 ? 'improving' : delta >= 10 ? 'worsening' : 'stable';

    currentMultipliers[natal.id] = todaySide.multipliers;
    displayedElements.push({ ...todaySide.displayed, trend, nextInflectionDate: null });
  }

  return { currentMultipliers, displayedElements };
}
```

- [ ] **Step 3: Run + commit**

```bash
npx vitest run src/lib/kundali/health-diagnosis/__tests__/layer-3-activation.test.ts
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/kundali/health-diagnosis/layer-3-activation.ts \
        src/lib/kundali/health-diagnosis/__tests__/layer-3-activation.test.ts
git commit -m "feat(health-diagnosis): Layer 3 activation with unclamped trend (Task C3)"
```

### Task C4: disclaimers + main `computeHealthDiagnosis` entry point

**Files:**
- Create: `src/lib/kundali/health-diagnosis/disclaimers.ts`
- Create: `src/lib/kundali/health-diagnosis/index.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/integration.test.ts`
- Test: `src/lib/kundali/health-diagnosis/__tests__/disclaimers.test.ts`

- [ ] **Step 1: Write integration test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/integration.test.ts
import { describe, it, expect } from 'vitest';
import { computeHealthDiagnosis } from '..';
import { generateKundali } from '@/lib/ephem/kundali-calc';

const F = { date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21, timezone: 'Asia/Kolkata', ayanamsha: 'lahiri' as const };

describe('computeHealthDiagnosis (integration)', () => {
  it('returns a complete HealthDiagnosis with 19 default elements', () => {
    const k = generateKundali(F);
    const result = computeHealthDiagnosis(k, { age: 36 }, 'en');
    expect(result.natalElements).toHaveLength(19);
    expect(result.currentMultipliers).toBeDefined();
    expect(result.displayedElements).toHaveLength(19);
    expect(result.prakriti).toBeDefined();
    expect(result.modeNote.en).toBeTruthy();
    expect(result.bodyMap).toHaveLength(12);
    expect(result.disclaimers.length).toBeGreaterThanOrEqual(0);
    expect(result.optedInToExtended).toBe(false);
    expect(result.hiddenElements.sort()).toEqual(['allergies', 'cancer', 'longevity']);
  });

  it('returns 22 elements + emits disclaimers for cancer + longevity when extended', () => {
    const k = generateKundali(F);
    const result = computeHealthDiagnosis(k, { extended: true, age: 36 }, 'en');
    expect(result.natalElements).toHaveLength(22);
    const cancerHas = result.disclaimers.some(d => d.scope.includes('cancer'));
    const longevityHas = result.disclaimers.some(d => d.scope.includes('longevity'));
    expect(cancerHas).toBe(true);
    expect(longevityHas).toBe(true);
    expect(result.optedInToExtended).toBe(true);
  });
});
```

- [ ] **Step 2: Disclaimers module**

```ts
// src/lib/kundali/health-diagnosis/disclaimers.ts
import type { DisclaimerEntry, NatalElement } from './types';

const VEDIC_FRAMING_TEXT = {
  en: 'Classical Jyotish describes karmic tendencies, not certainties. These patterns indicate areas to nurture with awareness, not destiny. Modern medical care remains essential.',
  hi: 'शास्त्रीय ज्योतिष कर्म-प्रवृत्तियों का वर्णन करता है, निश्चितताओं का नहीं। ये पैटर्न जागरूकता के साथ देखभाल के क्षेत्रों को दर्शाते हैं, नियति को नहीं। आधुनिक चिकित्सा देखभाल आवश्यक बनी हुई है।',
};

export function buildDisclaimers(natalElements: NatalElement[]): DisclaimerEntry[] {
  const gated = natalElements.filter(e => e.requiresDisclaimer).map(e => e.id);
  if (gated.length === 0) return [];
  return [{ scope: gated, text: VEDIC_FRAMING_TEXT }];
}
```

- [ ] **Step 3: Main entry**

```ts
// src/lib/kundali/health-diagnosis/index.ts
import type { KundaliData } from '@/types/kundali';
import type { Locale, LocaleText } from '@/types/panchang';
import type { HealthDiagnosis, HealthDiagnosisOptions } from './types';
import { composeLayer1 } from './layer-1-natal';
import { composeLayer2 } from './layer-2-mode';
import { composeLayer3 } from './layer-3-activation';
import { buildDisclaimers } from './disclaimers';
import { computeBodyMap } from '@/lib/medical/body-map';
import { computeDiseaseProfile } from '@/lib/medical/disease-profile';
import { computeHealthTimeline } from '@/lib/medical/health-timeline';
import { ratingFromScore } from './scoring-utils';

export * from './types';

export function computeHealthDiagnosis(
  k: KundaliData,
  opts: HealthDiagnosisOptions = {},
  locale: Locale = 'en',
): HealthDiagnosis {
  const layer1 = composeLayer1(k, opts, locale);
  const layer2 = composeLayer2(k, locale);
  const layer3 = composeLayer3(k, layer1, opts);

  const bodyMap = computeBodyMap(k);
  const diseaseProfile = computeDiseaseProfile(k, bodyMap);
  const timeline = computeHealthTimeline(k, (opts.today ?? new Date()).toISOString().slice(0, 10));

  // Overall = weighted average of visible elements, mapped to a Rating tier.
  const avg = layer1.natalElements.reduce((s, e) => s + e.natalScore, 0) / Math.max(1, layer1.natalElements.length);
  const overallRating = ratingFromScore(avg);
  const summary: LocaleText = {
    en: `Health diagnosis summary: ${layer1.natalElements.length} elements analysed, overall tendency ${overallRating}.`,
    hi: `स्वास्थ्य निदान सारांश: ${layer1.natalElements.length} तत्वों का विश्लेषण, समग्र प्रवृत्ति ${overallRating}।`,
  };

  return {
    natalElements: layer1.natalElements,
    prakriti: layer2.prakriti,
    modeNote: layer2.modeNote,
    currentMultipliers: layer3.currentMultipliers,
    displayedElements: layer3.displayedElements,
    overall: { rating: overallRating, summary },
    bodyMap,
    diseaseProfile,
    timeline,
    disclaimers: buildDisclaimers(layer1.natalElements),
    optedInToExtended: !!opts.extended,
    hiddenElements: layer1.hiddenElements,
  };
}
```

- [ ] **Step 4: Disclaimer test**

```ts
// src/lib/kundali/health-diagnosis/__tests__/disclaimers.test.ts
import { describe, it, expect } from 'vitest';
import { buildDisclaimers } from '../disclaimers';
import type { NatalElement } from '../types';

const mk = (id: NatalElement['id'], requiresDisclaimer: boolean): NatalElement => ({
  id, name: { en: id, hi: id }, category: 'physical', badge: 'classical',
  natalScore: 50, rating: 'madhyama', factors: [], classicalSignatures: [],
  requiresDisclaimer,
});

describe('buildDisclaimers', () => {
  it('returns empty when no element needs disclaimer', () => {
    expect(buildDisclaimers([mk('vitality', false)])).toEqual([]);
  });
  it('returns single entry covering all gated ids', () => {
    const out = buildDisclaimers([mk('psychiatric', true), mk('cancer', true), mk('vitality', false)]);
    expect(out).toHaveLength(1);
    expect(out[0].scope.sort()).toEqual(['cancer', 'psychiatric']);
    expect(out[0].text.en).toContain('Classical Jyotish');
  });
});
```

- [ ] **Step 5: Run + commit**

```bash
npx vitest run src/lib/kundali/health-diagnosis/__tests__/integration.test.ts \
               src/lib/kundali/health-diagnosis/__tests__/disclaimers.test.ts
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/kundali/health-diagnosis/disclaimers.ts \
        src/lib/kundali/health-diagnosis/index.ts \
        src/lib/kundali/health-diagnosis/__tests__/disclaimers.test.ts \
        src/lib/kundali/health-diagnosis/__tests__/integration.test.ts
git commit -m "feat(health-diagnosis): disclaimers + main entry point (Task C4)"
```

---

## Phase D — Integration (3 tasks)

### Task D1: extend `/api/medical` response with `healthDiagnosis` (no breaking changes)

**Files:**
- Modify: `src/app/api/medical/route.ts`
- Test: `src/lib/__tests__/api-medical-contract.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/api-medical-contract.test.ts
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/medical/route';

describe('/api/medical contract', () => {
  it('returns existing keys + healthDiagnosis', async () => {
    const req = new Request('http://test/api/medical', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-forwarded-for': '127.0.0.1' },
      body: JSON.stringify({ date: '1990-01-15', time: '06:30', lat: 28.61, lng: 77.21, timezone: 'Asia/Kolkata' }),
    });
    const res = await POST(req);
    const body = await res.json();
    // Existing keys (regression guard)
    expect(body.prakriti).toBeDefined();
    expect(body.bodyMap).toBeDefined();
    expect(body.healthTimeline).toBeDefined();
    expect(body.diseaseProfile).toBeDefined();
    expect(body.healthPrognosis).toBeDefined();
    // New key
    expect(body.healthDiagnosis).toBeDefined();
    expect(body.healthDiagnosis.natalElements).toHaveLength(19);
  });
});
```

- [ ] **Step 2: Modify route**

Open `src/app/api/medical/route.ts`. After the existing computation block, before `return NextResponse.json(...)`, add:

```ts
const healthDiagnosis = computeHealthDiagnosis(kundali, { extended: !!body.extended }, body.locale ?? 'en');
```

And include `healthDiagnosis` in the response object. Import: `import { computeHealthDiagnosis } from '@/lib/kundali/health-diagnosis';`

- [ ] **Step 3: Run + commit**

```bash
npx vitest run src/lib/__tests__/api-medical-contract.test.ts
git add src/app/api/medical/route.ts src/lib/__tests__/api-medical-contract.test.ts
git commit -m "feat(health-diagnosis): expose healthDiagnosis on /api/medical (Task D1)"
```

### Task D2: add "Health Element Diagnosis" section to `/medical-astrology` page

**Files:**
- Create: `src/components/medical/HealthElementGrid.tsx`
- Modify: `src/app/[locale]/medical-astrology/page.tsx`

- [ ] **Step 1: Add the grid component** (skipping a vitest test here — UI verification per CLAUDE.md DOD #4 is via browser)

```tsx
// src/components/medical/HealthElementGrid.tsx
'use client';

import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import type { HealthDiagnosis } from '@/lib/kundali/health-diagnosis';

const RATING_COLOUR: Record<string, string> = {
  uttama: 'text-emerald-400',
  madhyama: 'text-gold-primary',
  adhama: 'text-amber-400',
  atyadhama: 'text-red-400',
};

export default function HealthElementGrid({
  diagnosis,
  locale,
  extendedToggle,
  onToggleExtended,
}: {
  diagnosis: HealthDiagnosis;
  locale: Locale;
  extendedToggle: boolean;
  onToggleExtended: () => void;
}) {
  return (
    <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 my-6">
      <header className="flex items-baseline justify-between gap-4 mb-4">
        <h2 className="text-2xl text-gold-light">Health Element Diagnosis</h2>
        <button
          type="button"
          onClick={onToggleExtended}
          className="text-sm text-gold-primary/80 hover:text-gold-light"
        >
          {extendedToggle ? 'Hide extended analysis' : 'Show extended analysis (3 more elements)'}
        </button>
      </header>
      <p className="text-text-secondary text-sm mb-4">{tl(diagnosis.modeNote, locale)}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {diagnosis.natalElements.map(el => (
          <div key={el.id} className="bg-bg-secondary/40 border border-gold-primary/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-text-primary">{tl(el.name, locale)}</span>
              <span className={`text-xs uppercase tracking-wide ${RATING_COLOUR[el.rating]}`}>{el.rating}</span>
            </div>
            {el.badge !== 'classical' && (
              <span className="text-[10px] text-gold-primary/60 uppercase">{el.badge}</span>
            )}
            <div className="h-1 mt-2 bg-bg-primary rounded-full overflow-hidden">
              <div className={`h-full ${el.natalScore >= 75 ? 'bg-red-500' : el.natalScore >= 50 ? 'bg-amber-500' : el.natalScore >= 25 ? 'bg-gold-primary' : 'bg-emerald-500'}`} style={{ width: `${el.natalScore}%` }} />
            </div>
          </div>
        ))}
      </div>
      {diagnosis.disclaimers.length > 0 && (
        <p className="text-xs text-amber-300/80 mt-4">{tl(diagnosis.disclaimers[0].text, locale)}</p>
      )}
    </section>
  );
}
```

- [ ] **Step 2: Wire into the page**

Open `src/app/[locale]/medical-astrology/page.tsx`. Find the section where existing results render (search for `{result && (` around Prakriti, Body Map, etc.). Add the grid as the **first** child inside the results wrapper, before existing sections:

```tsx
{result?.healthDiagnosis && (
  <HealthElementGrid
    diagnosis={result.healthDiagnosis}
    locale={locale}
    extendedToggle={extended}
    onToggleExtended={() => setExtended(v => !v)}
  />
)}
```

Add state at the top of the component: `const [extended, setExtended] = useState(false);`
When `extended` toggles, re-call the API with `{ ...body, extended: true }`.

- [ ] **Step 3: Browser verification (per CLAUDE.md DOD #4)**

Run dev server, navigate to `/medical-astrology`, submit a chart, verify:
- 19 element cards appear in the new section above existing sections
- Toggle reveals 3 more (Allergies, Cancer, Longevity)
- Disclaimers appear at the bottom when extended is on
- Existing Prakriti, Body Map, Timeline, Disease Profile sections still render below unchanged

```bash
npx next dev --turbopack &
# manual verification at http://localhost:3000/en/medical-astrology
```

- [ ] **Step 4: Commit**

```bash
git add src/components/medical/HealthElementGrid.tsx \
        src/app/[locale]/medical-astrology/page.tsx
git commit -m "feat(health-diagnosis): wire element grid into /medical-astrology (Task D2)"
```

### Task D3: expose element headline on the kundali summary DomainCard

**Files:**
- Modify: `src/components/kundali/DomainCard.tsx`

- [ ] **Step 1: Detect health domain and surface top-3 weakest**

Open `DomainCard.tsx`. Inside the existing rendering, when `domain.id === 'health'`, before the existing factors render, add a compact 3-row strip showing the three highest `natalScore` elements from `domain.healthDiagnosis?.natalElements` (this requires passing `healthDiagnosis` from the parent — chase the parent through and plumb it down; the parent component path is shown in the file's existing imports).

Show: element name, traffic-light dot, tier label. Clicking the strip should `router.push('/medical-astrology')`.

- [ ] **Step 2: Browser verify on `/kundali`**

Verify on the kundali summary page that the Health card shows the top-3 weakest elements headline.

- [ ] **Step 3: Commit**

```bash
git add src/components/kundali/DomainCard.tsx <plumbing files modified>
git commit -m "feat(health-diagnosis): expose top weakest elements on DomainCard health (Task D3)"
```

---

## Phase E — Convergence (2 tasks)

### Task E1: move `src/lib/medical/*` under `src/lib/kundali/health-diagnosis/legacy/` with re-export shims

**Files:**
- Move all 6 files from `src/lib/medical/` to `src/lib/kundali/health-diagnosis/legacy/`
- Replace `src/lib/medical/` files with re-export shims

- [ ] **Step 1: Move files**

```bash
mkdir -p src/lib/kundali/health-diagnosis/legacy
git mv src/lib/medical/prakriti.ts src/lib/kundali/health-diagnosis/legacy/prakriti.ts
git mv src/lib/medical/body-map.ts src/lib/kundali/health-diagnosis/legacy/body-map.ts
git mv src/lib/medical/disease-profile.ts src/lib/kundali/health-diagnosis/legacy/disease-profile.ts
git mv src/lib/medical/health-timeline.ts src/lib/kundali/health-diagnosis/legacy/health-timeline.ts
git mv src/lib/medical/health-prognosis.ts src/lib/kundali/health-diagnosis/legacy/health-prognosis.ts
git mv src/lib/medical/constants.ts src/lib/kundali/health-diagnosis/legacy/constants.ts
```

- [ ] **Step 2: Add re-export shims at the old paths**

For each moved file, create the shim:

```ts
// src/lib/medical/prakriti.ts
export * from '@/lib/kundali/health-diagnosis/legacy/prakriti';
```

Repeat for body-map, disease-profile, health-timeline, health-prognosis, constants.

- [ ] **Step 3: Run full test suite + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
npx next build
```

All three must pass. If any consumer breaks, the shim was missing — fix and re-run.

- [ ] **Step 4: Commit**

```bash
git add src/lib/medical src/lib/kundali/health-diagnosis/legacy
git commit -m "refactor(health-diagnosis): move medical/* under health-diagnosis/legacy with shims (Task E1)"
```

### Task E2: migrate consumers to new namespace, drop shims

**Files:**
- Modify: every consumer of `src/lib/medical/*` (find via `grep -rln 'from .@/lib/medical' src/`)

- [ ] **Step 1: Inventory consumers**

```bash
grep -rln "from '@/lib/medical" src/ > /tmp/consumers.txt
wc -l /tmp/consumers.txt
```

- [ ] **Step 2: Rewrite each consumer's imports**

For each file in `consumers.txt`, change:
```ts
from '@/lib/medical/prakriti' → '@/lib/kundali/health-diagnosis/legacy/prakriti'
```
(repeat for each medical/* module imported).

Per CLAUDE.md Lesson H, **do not use sed/regex bulk replace** — edit each file manually OR use ts-morph with a tested dry run on 2-3 files first.

- [ ] **Step 3: Drop the shim files at `src/lib/medical/*` once all consumers are migrated**

```bash
rm -r src/lib/medical
```

- [ ] **Step 4: Run full test suite + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx vitest run
npx next build
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(health-diagnosis): migrate consumers, drop medical/* shims (Task E2)"
```

---

## Verification gates (between phases)

After each phase, before starting the next, ALL of the following must pass:

```bash
npx tsc --noEmit -p tsconfig.build-check.json   # 0 errors
npx vitest run                                   # all green
npx next build                                   # 0 errors
```

For Phase D additionally:
- Browser verification at `/medical-astrology` and `/kundali`

For Phase E additionally:
- Existing `/api/medical` response shape unchanged (regression test from Task D1 still passes).

---

## Acceptance criteria (overall)

- 22 element scorers exist, each with at least one passing unit test
- `computeHealthDiagnosis(kundali, opts, locale)` returns the full `HealthDiagnosis` shape from §8 of the spec
- 19 elements visible by default; opt-in toggle adds Allergies + Cancer + Longevity
- Disclaimer text matches the Vedic-framing string in the spec, scoped to 4.17 / 4.21 / 4.22
- Two-tier badge (`classical` / `inferential` / `mixed`) renders on the element cards
- Trend and inflection use **unclamped** scores
- `/api/medical` response includes `healthDiagnosis` key without breaking existing keys
- `/medical-astrology` page renders the new section above the existing four sections
- Kundali summary DomainCard surfaces top-3 weakest elements with a click-through
- `src/lib/medical/*` consumers migrated to `src/lib/kundali/health-diagnosis/legacy/*`
- No regressions in `npx tsc`, `npx vitest`, or `npx next build`

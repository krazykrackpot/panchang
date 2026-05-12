# Best Windows & Verdict Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a "Best Windows Today" card with verdict bar and conflict resolution to the panchang page + dashboard, implementing Level 1 of the Unified Time Verdict spec.

**Architecture:** A pure synthesis engine (`computeDayVerdict`) consumes existing PanchangData fields (rahuKaal, abhijitMuhurta, amritKalam, varjyam, choghadiya, specialYogas, bhadra, etc.) and outputs rated 30-minute time slots with conflict explanations. A `BestWindowsCard` component renders the top result + verdict bar. Choghadiya shown as a separate indicator, never mixed into the classical verdict.

**Tech Stack:** TypeScript engine (pure functions, no new computation), React client component (Framer Motion for verdict bar), existing PanchangData type.

**Spec:** `docs/superpowers/specs/2026-05-12-unified-time-verdict-design.md` (Appendix A: Final Precedence Table)

---

## File Structure

```
src/lib/muhurta/
├── verdict-config.ts        # Hierarchy constants, negative/positive rankings, conflict rules
├── verdict-types.ts         # TimeSlot, ActiveFactor, VerdictResult interfaces
├── verdict-engine.ts        # computeDayVerdict() — main engine, pure function
└── conflict-matrix.ts       # Pairwise conflict resolutions (Abhijit+RahuKaal → CAUTION, etc.)

src/components/panchang/
├── BestWindowsCard.tsx      # "Best Windows Today" card + verdict bar + conflict explainers
└── DayTimeline.tsx          # EXISTING — no changes needed (it shows raw windows; we show verdicts)

src/app/[locale]/panchang/
└── PanchangClient.tsx       # MODIFY — add <BestWindowsCard> after DayTimeline section

src/app/[locale]/dashboard/
└── page.tsx                 # MODIFY — add <BestWindowsCard> in Today tab

src/lib/__tests__/
└── verdict-engine.test.ts   # Tests for the precedence engine
```

---

### Task 1: Define Types and Config

**Files:**
- Create: `src/lib/muhurta/verdict-types.ts`
- Create: `src/lib/muhurta/verdict-config.ts`

- [ ] **Step 1: Create verdict-types.ts**

```typescript
// src/lib/muhurta/verdict-types.ts

export type VerdictRating = 'avoid' | 'caution' | 'good' | 'very_good' | 'excellent' | 'exceptional';

export interface ActiveFactor {
  id: string;                // 'rahu_kaal', 'abhijit', 'sarvartha_siddhi', etc.
  name: string;              // Display name: "Rahu Kaal"
  nameHi: string;            // Hindi: "राहु काल"
  type: 'hard_block' | 'conditional_block' | 'positive' | 'context';
  rank: string;              // 'N1'...'N10' or 'P1'...'P13' from precedence table
  source: string;            // "Muhurta Chintamani" or "South Indian tradition"
  effect: string;            // "Blocks all new beginnings"
  effectHi: string;          // Hindi version
}

export interface ConflictExplanation {
  positive: string;          // "Abhijit Muhurta"
  negative: string;          // "Rahu Kaal"
  verdict: VerdictRating;
  explanation: string;       // "Abhijit claims 'sarva doshagnam' but Rahu Kaal is a hard block..."
  explanationHi: string;
  rule: string;              // "N4 vs P6 — CAUTION (debated)"
}

export interface TimeSlot {
  start: string;             // "HH:MM"
  end: string;               // "HH:MM"
  verdict: VerdictRating;
  label: string;             // "Abhijit Muhurta + Amrit Kalam"
  labelHi: string;
  explanation: string;       // Why this rating
  explanationHi: string;
  hardBlocks: ActiveFactor[];
  conditionalBlocks: ActiveFactor[];
  positives: ActiveFactor[];
  conflicts: ConflictExplanation[];
  choghadiya?: {             // Shown separately
    name: string;
    nameHi: string;
    type: string;            // 'shubh', 'labh', 'rog', etc.
    nature: 'auspicious' | 'inauspicious' | 'neutral';
  };
}

export interface DayVerdict {
  slots: TimeSlot[];                // 30-min slots from sunrise to sunset
  bestWindow: TimeSlot | null;      // Highest-rated slot
  secondBest: TimeSlot | null;      // Runner-up
  avoidWindows: TimeSlot[];         // All red slots (for summary)
  dayLevelYogas: ActiveFactor[];    // Active day-level yogas (P1-P5)
  hasDayLevelDosha: boolean;        // Vishti/Vyatipata/Vaidhriti active at some point
}
```

- [ ] **Step 2: Create verdict-config.ts**

```typescript
// src/lib/muhurta/verdict-config.ts
//
// Configurable hierarchy from spec Appendix A.
// To change any precedence rule, edit THIS file only.

import type { ActiveFactor } from './verdict-types';

// ═══ HARD BLOCKS (N1-N6) — always 🔴 AVOID ═══

export const HARD_BLOCKS: Record<string, Omit<ActiveFactor, 'id'>> = {
  vishti: {
    name: 'Vishti (Bhadra)', nameHi: 'विष्टि (भद्रा)',
    type: 'hard_block', rank: 'N1',
    source: 'Rajmartanda, Muhurta Chintamani',
    effect: 'Destroys even Amrita Yoga — avoid all auspicious activities',
    effectHi: 'अमृत योग को भी नष्ट करता है — सभी शुभ कार्य वर्जित',
  },
  vyatipata: {
    name: 'Vyatipata Yoga', nameHi: 'व्यतीपात योग',
    type: 'hard_block', rank: 'N2',
    source: 'Rajmartanda, Muhurta Chintamani',
    effect: 'Universally inauspicious — all new beginnings blocked',
    effectHi: 'सर्वथा अशुभ — सभी नए कार्य वर्जित',
  },
  vaidhriti: {
    name: 'Vaidhriti Yoga', nameHi: 'वैधृति योग',
    type: 'hard_block', rank: 'N3',
    source: 'Rajmartanda, Muhurta Chintamani',
    effect: 'Universally inauspicious — all new beginnings blocked',
    effectHi: 'सर्वथा अशुभ — सभी नए कार्य वर्जित',
  },
  rahu_kaal: {
    name: 'Rahu Kaal', nameHi: 'राहु काल',
    type: 'hard_block', rank: 'N4',
    source: 'South Indian tradition, Muhurta Chintamani (later editions)',
    effect: 'Avoid starting new ventures during this period',
    effectHi: 'इस अवधि में नए कार्य आरंभ न करें',
  },
  yamaganda: {
    name: 'Yamaganda', nameHi: 'यमगण्ड',
    type: 'hard_block', rank: 'N5',
    source: 'South Indian tradition',
    effect: 'Period of Yama — avoid new beginnings',
    effectHi: 'यम काल — नए कार्य वर्जित',
  },
  gulika_kaal: {
    name: 'Gulika Kaal', nameHi: 'गुलिक काल',
    type: 'hard_block', rank: 'N6',
    source: 'BPHS (upagraha)',
    effect: 'Unfavourable for auspicious activities',
    effectHi: 'शुभ कार्यों के लिए अनुकूल नहीं',
  },
};

// ═══ CONDITIONAL BLOCKS (N7-N11) — activity-dependent 🟡 CAUTION ═══

export const CONDITIONAL_BLOCKS: Record<string, Omit<ActiveFactor, 'id'>> = {
  varjyam: {
    name: 'Varjyam', nameHi: 'वर्ज्यम्',
    type: 'conditional_block', rank: 'N7',
    source: 'Muhurta Chintamani (nakshatra tables)',
    effect: 'Avoid new starts, purchases, contracts. Continuation OK.',
    effectHi: 'नए कार्य, खरीदारी, अनुबंध वर्जित। जारी कार्य ठीक।',
  },
  durmuhurta: {
    name: 'Dur Muhurta', nameHi: 'दुर्मुहूर्त',
    type: 'conditional_block', rank: 'N8',
    source: 'Muhurta Chintamani',
    effect: 'Avoid most new starts. Meditation and charity OK.',
    effectHi: 'अधिकांश नए कार्य वर्जित। ध्यान और दान ठीक।',
  },
  visha_ghatika: {
    name: 'Visha Ghatika', nameHi: 'विष घटिका',
    type: 'conditional_block', rank: 'N8',
    source: 'Muhurta Chintamani',
    effect: 'Toxic sub-period — avoid important decisions',
    effectHi: 'विषैला उप-काल — महत्वपूर्ण निर्णय टालें',
  },
};

// ═══ POSITIVE FACTORS (P1-P13) — ranked by amplifying power ═══

export const POSITIVES: Record<string, Omit<ActiveFactor, 'id'> & { strength: number }> = {
  guru_pushya: {
    name: 'Guru Pushya Yoga', nameHi: 'गुरु पुष्य योग',
    type: 'positive', rank: 'P1', strength: 100,
    source: 'Classical (multiple texts)',
    effect: 'Supreme — king of yogas. Best for purchases, gold, investment.',
    effectHi: 'सर्वश्रेष्ठ — योगों का राजा। खरीदारी, सोना, निवेश के लिए उत्तम।',
  },
  ravi_pushya: {
    name: 'Ravi Pushya Yoga', nameHi: 'रवि पुष्य योग',
    type: 'positive', rank: 'P2', strength: 95,
    source: 'Classical',
    effect: 'Supreme — authority, government matters, health.',
    effectHi: 'सर्वश्रेष्ठ — अधिकार, सरकारी कार्य, स्वास्थ्य।',
  },
  amrit_siddhi: {
    name: 'Amrit Siddhi Yoga', nameHi: 'अमृत सिद्धि योग',
    type: 'positive', rank: 'P3', strength: 90,
    source: 'Muhurtha Ch.6 (B.V. Raman)',
    effect: 'Highest grade — accomplishment for perpetuity.',
    effectHi: 'सर्वोच्च श्रेणी — स्थायी सिद्धि।',
  },
  sarvartha_siddhi: {
    name: 'Sarvartha Siddhi Yoga', nameHi: 'सर्वार्थ सिद्धि योग',
    type: 'positive', rank: 'P4', strength: 85,
    source: 'Muhurta Chintamani',
    effect: 'All purposes accomplished. Can negate Mrityu Yoga.',
    effectHi: 'सभी कार्य सिद्ध। मृत्यु योग को निष्प्रभ कर सकता है।',
  },
  siddha_yoga: {
    name: 'Siddha Yoga', nameHi: 'सिद्ध योग',
    type: 'positive', rank: 'P5', strength: 70,
    source: 'Muhurtha Ch.6',
    effect: 'Vara+tithi+nakshatra alignment — favourable for all activities.',
    effectHi: 'वार+तिथि+नक्षत्र संयोग — सभी कार्यों के लिए अनुकूल।',
  },
  abhijit: {
    name: 'Abhijit Muhurta', nameHi: 'अभिजित मुहूर्त',
    type: 'positive', rank: 'P6', strength: 88,
    source: 'Muhurta Chintamani',
    effect: '"Sarva doshagnam" — destroyer of all doshas. ~48 min around noon.',
    effectHi: '"सर्व दोषघ्नम्" — सभी दोषों का नाशक। मध्याह्न के ~48 मिनट।',
  },
  amrit_kalam: {
    name: 'Amrit Kalam', nameHi: 'अमृत काल',
    type: 'positive', rank: 'P7', strength: 75,
    source: 'Muhurta Chintamani (ghati tables)',
    effect: 'Nectar period — highly auspicious for initiations.',
    effectHi: 'अमृत काल — दीक्षा के लिए अत्यंत शुभ।',
  },
  brahma_muhurta: {
    name: 'Brahma Muhurta', nameHi: 'ब्रह्म मुहूर्त',
    type: 'positive', rank: 'P8', strength: 72,
    source: 'BPHS, Dharmasindhu',
    effect: 'Pre-dawn — spiritual activities only (meditation, japa, study).',
    effectHi: 'प्रातःकाल — केवल आध्यात्मिक कार्य (ध्यान, जप, अध्ययन)।',
  },
  vijaya_muhurta: {
    name: 'Vijaya Muhurta', nameHi: 'विजय मुहूर्त',
    type: 'positive', rank: 'P8', strength: 68,
    source: 'Muhurta Chintamani',
    effect: 'Victory window — favourable for success and triumph.',
    effectHi: 'विजय काल — सफलता के लिए अनुकूल।',
  },
  godhuli: {
    name: 'Godhuli Lagna', nameHi: 'गोधूलि लग्न',
    type: 'positive', rank: 'P9', strength: 60,
    source: 'Classical',
    effect: 'Sacred twilight — favourable for ceremonies.',
    effectHi: 'पवित्र गोधूलि — संस्कारों के लिए अनुकूल।',
  },
};

// ═══ ABHIJIT EXCEPTION CONFIG ═══
// When Abhijit overlaps with a hard block, what verdict do we give?
// This is the most debated point — configurable here.

export const ABHIJIT_DURING_HARD_BLOCK: 'caution' | 'avoid' | 'good' = 'caution';

// When Abhijit falls on Wednesday — weakened per Muhurta Martand
export const ABHIJIT_WEDNESDAY_VERDICT: 'caution' | 'good' = 'caution';
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/muhurta/verdict-types.ts src/lib/muhurta/verdict-config.ts
git commit -m "feat: verdict engine types + configurable precedence hierarchy"
```

---

### Task 2: Build the Conflict Matrix

**Files:**
- Create: `src/lib/muhurta/conflict-matrix.ts`

- [ ] **Step 1: Create conflict-matrix.ts**

```typescript
// src/lib/muhurta/conflict-matrix.ts
//
// Pairwise conflict resolutions from spec §4.
// When a positive factor overlaps with a negative, this determines the verdict.

import type { VerdictRating } from './verdict-types';
import { ABHIJIT_DURING_HARD_BLOCK } from './verdict-config';

interface ConflictRule {
  verdict: VerdictRating;
  explanation: string;
  explanationHi: string;
  rule: string;
}

/**
 * Resolve a conflict between a positive and negative factor.
 * Returns null if no special rule applies (default: negative wins → 'avoid').
 */
export function resolveConflict(positiveId: string, negativeId: string): ConflictRule | null {
  const key = `${positiveId}+${negativeId}`;

  // Abhijit vs hard blocks (N1-N6) — the "sarva doshagnam" debate
  if (positiveId === 'abhijit') {
    if (['vishti', 'vyatipata', 'vaidhriti'].includes(negativeId)) {
      return {
        verdict: ABHIJIT_DURING_HARD_BLOCK,
        explanation: `Abhijit Muhurta is described as "sarva doshagnam" (destroyer of all doshas) in Muhurta Chintamani. However, Rajmartanda says ${negativeId === 'vishti' ? 'Vishti Karana' : negativeId === 'vyatipata' ? 'Vyatipata' : 'Vaidhriti'} "destroys even Amrita Yoga." Most scholars consider this a genuine standoff. If another window exists today, prefer it.`,
        explanationHi: `अभिजित मुहूर्त को मुहूर्त चिंतामणि में "सर्व दोषघ्नम्" (सभी दोषों का नाशक) कहा गया है। परन्तु राजमार्तण्ड के अनुसार ${negativeId === 'vishti' ? 'विष्टि करण' : negativeId === 'vyatipata' ? 'व्यतीपात' : 'वैधृति'} "अमृत योग को भी नष्ट करता है।" यदि आज कोई अन्य शुभ समय उपलब्ध है, तो उसे प्राथमिकता दें।`,
        rule: `${negativeId.toUpperCase()} vs P6 — ${ABHIJIT_DURING_HARD_BLOCK.toUpperCase()} (debated)`,
      };
    }
    if (['rahu_kaal', 'yamaganda', 'gulika_kaal'].includes(negativeId)) {
      return {
        verdict: ABHIJIT_DURING_HARD_BLOCK,
        explanation: `Abhijit Muhurta claims "sarva doshagnam" (destroyer of all doshas). However, ${negativeId === 'rahu_kaal' ? 'Rahu Kaal' : negativeId === 'yamaganda' ? 'Yamaganda' : 'Gulika Kaal'} is universally observed as a hard block by modern practitioners. If possible, choose a different window.`,
        explanationHi: `अभिजित मुहूर्त "सर्व दोषघ्नम्" का दावा करता है। परन्तु ${negativeId === 'rahu_kaal' ? 'राहु काल' : negativeId === 'yamaganda' ? 'यमगण्ड' : 'गुलिक काल'} को आधुनिक ज्योतिषी कठोर वर्जना मानते हैं। यदि संभव हो, अन्य समय चुनें।`,
        rule: `${negativeId.toUpperCase()} vs P6 — ${ABHIJIT_DURING_HARD_BLOCK.toUpperCase()} (debated)`,
      };
    }
  }

  // Shubh Choghadiya vs hard blocks — choghadiya always loses
  // (Not needed here — choghadiya is separate and never enters the classical verdict)

  // Default: no special rule → negative wins
  return null;
}
```

- [ ] **Step 2: Type check + Commit**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
git add src/lib/muhurta/conflict-matrix.ts
git commit -m "feat: conflict resolution matrix — Abhijit vs hard blocks = configurable CAUTION"
```

---

### Task 3: Build the Verdict Engine

**Files:**
- Create: `src/lib/muhurta/verdict-engine.ts`
- Create: `src/lib/__tests__/verdict-engine.test.ts`

This is the core engine. Pure function: takes PanchangData, returns DayVerdict.

- [ ] **Step 1: Write tests first**

```typescript
// src/lib/__tests__/verdict-engine.test.ts
import { describe, it, expect } from 'vitest';
import { computeDayVerdict } from '../muhurta/verdict-engine';
import type { PanchangData } from '@/types/panchang';

// Minimal panchang fixture with known windows
function makePanchang(overrides: Partial<PanchangData> = {}): PanchangData {
  return {
    sunrise: '06:00',
    sunset: '18:00',
    rahuKaal: { start: '09:00', end: '10:30' },
    yamaganda: { start: '15:00', end: '16:30' },
    gulikaKaal: { start: '06:00', end: '07:30' },
    abhijitMuhurta: { start: '11:52', end: '12:40', available: true },
    amritKalamAll: [{ start: '11:30', end: '13:06' }],
    varjyamAll: [{ start: '17:15', end: '18:51' }],
    durMuhurtam: [{ start: '08:24', end: '09:12' }],
    bhadraAll: [],
    choghadiya: [],
    hora: [],
    specialYogas: [],
    // Panchang yoga (not dosha)
    yoga: { name: { en: 'Shobhana', hi: 'शोभन', sa: 'शोभनम्' }, number: 4 },
    tithi: { name: { en: 'Shukla Dwitiya', hi: 'शुक्ल द्वितीया', sa: 'शुक्लद्वितीया' }, number: 2 },
    nakshatra: { name: { en: 'Pushya', hi: 'पुष्य', sa: 'पुष्यम्' }, number: 8 },
    vara: { name: { en: 'Thursday', hi: 'गुरुवार', sa: 'गुरुवासरः' }, number: 4 },
    karana: { name: { en: 'Balava', hi: 'बालव', sa: 'बालवम्' }, number: 2 },
    ...overrides,
  } as PanchangData;
}

describe('computeDayVerdict', () => {
  it('marks Rahu Kaal slots as AVOID', () => {
    const result = computeDayVerdict(makePanchang());
    const rkSlot = result.slots.find(s => s.start === '09:00');
    expect(rkSlot?.verdict).toBe('avoid');
    expect(rkSlot?.hardBlocks.some(b => b.id === 'rahu_kaal')).toBe(true);
  });

  it('marks Abhijit + Amrit Kalam overlap as EXCELLENT when no blocks', () => {
    const result = computeDayVerdict(makePanchang());
    const abhijitSlot = result.slots.find(s => s.start === '12:00');
    expect(abhijitSlot?.verdict).toBe('excellent');
    expect(abhijitSlot?.positives.length).toBeGreaterThanOrEqual(2);
  });

  it('detects Guru Pushya Yoga on Thursday + Pushya', () => {
    const result = computeDayVerdict(makePanchang());
    expect(result.dayLevelYogas.some(y => y.id === 'guru_pushya')).toBe(true);
  });

  it('gives CAUTION when Abhijit overlaps with Rahu Kaal', () => {
    const p = makePanchang({
      rahuKaal: { start: '11:30', end: '13:00' }, // overlaps Abhijit
    });
    const result = computeDayVerdict(p);
    const slot = result.slots.find(s => s.start === '12:00');
    expect(slot?.verdict).toBe('caution');
    expect(slot?.conflicts.length).toBeGreaterThan(0);
  });

  it('marks Vishti (Bhadra) as AVOID even with Amrit Kalam', () => {
    const p = makePanchang({
      bhadraAll: [{ start: '11:00', end: '17:00' }], // Vishti covers Amrit Kalam
    });
    const result = computeDayVerdict(p);
    const slot = result.slots.find(s => s.start === '12:00');
    expect(slot?.verdict).toBe('caution'); // Abhijit + Vishti = CAUTION (debated)
  });

  it('marks Varjyam as conditional (caution), not hard block', () => {
    const result = computeDayVerdict(makePanchang());
    const slot = result.slots.find(s => s.start === '17:30');
    expect(slot?.verdict).toBe('caution');
    expect(slot?.conditionalBlocks.some(b => b.id === 'varjyam')).toBe(true);
  });

  it('identifies bestWindow as the highest-rated slot', () => {
    const result = computeDayVerdict(makePanchang());
    expect(result.bestWindow).not.toBeNull();
    expect(['excellent', 'exceptional']).toContain(result.bestWindow!.verdict);
  });

  it('shows choghadiya as separate indicator, not affecting verdict', () => {
    const p = makePanchang({
      choghadiya: [{
        name: { en: 'Labh', hi: 'लाभ' } as any,
        type: 'labh',
        nature: 'auspicious',
        startTime: '09:00',
        endTime: '10:30',
        period: 'day' as const,
      }],
    });
    const result = computeDayVerdict(p);
    const rkSlot = result.slots.find(s => s.start === '09:00');
    // Verdict is still AVOID (Rahu Kaal) despite Labh Choghadiya
    expect(rkSlot?.verdict).toBe('avoid');
    // But choghadiya is shown as secondary indicator
    expect(rkSlot?.choghadiya?.type).toBe('labh');
  });

  it('returns slots covering sunrise to sunset in 30-min increments', () => {
    const result = computeDayVerdict(makePanchang());
    expect(result.slots.length).toBe(24); // 06:00-18:00 = 12h = 24 slots
    expect(result.slots[0].start).toBe('06:00');
    expect(result.slots[result.slots.length - 1].start).toBe('17:30');
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npx vitest run src/lib/__tests__/verdict-engine.test.ts
```

Expected: FAIL — `verdict-engine.ts` doesn't exist yet.

- [ ] **Step 3: Implement verdict-engine.ts**

```typescript
// src/lib/muhurta/verdict-engine.ts

import type { PanchangData } from '@/types/panchang';
import type { TimeSlot, ActiveFactor, ConflictExplanation, DayVerdict, VerdictRating } from './verdict-types';
import { HARD_BLOCKS, CONDITIONAL_BLOCKS, POSITIVES, ABHIJIT_WEDNESDAY_VERDICT } from './verdict-config';
import { resolveConflict } from './conflict-matrix';

// ── Helpers ──

function parseHHMM(hhmm: string): number {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

function fmtHHMM(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function rangeOverlaps(aStart: number, aEnd: number, bStart: number, bEnd: number): boolean {
  return aStart < bEnd && bStart < aEnd;
}

function makeFactor(id: string, source: Record<string, Omit<ActiveFactor, 'id'>>): ActiveFactor {
  const f = source[id];
  if (!f) throw new Error(`Unknown factor: ${id}`);
  return { id, ...f };
}

// ── Detect day-level yogas from PanchangData ──

function detectDayLevelYogas(p: PanchangData): ActiveFactor[] {
  const yogas: ActiveFactor[] = [];

  // Check specialYogas array from panchang computation
  const specials = p.specialYogas ?? [];
  for (const sy of specials) {
    if (!sy.isActive) continue;
    const nameEn = typeof sy.name === 'string' ? sy.name : sy.name?.en || '';
    const nameHi = typeof sy.name === 'string' ? sy.name : sy.name?.hi || nameEn;

    if (nameEn.toLowerCase().includes('guru push')) {
      yogas.push({ id: 'guru_pushya', ...POSITIVES.guru_pushya });
    } else if (nameEn.toLowerCase().includes('ravi push') || nameEn.toLowerCase().includes('ravi yoga')) {
      yogas.push({ id: 'ravi_pushya', ...POSITIVES.ravi_pushya });
    } else if (nameEn.toLowerCase().includes('amrit siddhi') || nameEn.toLowerCase().includes('amrita siddhi')) {
      yogas.push({ id: 'amrit_siddhi', ...POSITIVES.amrit_siddhi });
    } else if (nameEn.toLowerCase().includes('sarvartha') || nameEn.toLowerCase().includes('sarvaartha')) {
      yogas.push({ id: 'sarvartha_siddhi', ...POSITIVES.sarvartha_siddhi });
    }
  }

  // Also check boolean flags
  if (p.amritSiddhiYoga && !yogas.some(y => y.id === 'amrit_siddhi')) {
    yogas.push({ id: 'amrit_siddhi', ...POSITIVES.amrit_siddhi });
  }
  if (p.sarvarthaSiddhi && !yogas.some(y => y.id === 'sarvartha_siddhi')) {
    yogas.push({ id: 'sarvartha_siddhi', ...POSITIVES.sarvartha_siddhi });
  }

  return yogas;
}

// ── Check panchang-level doshas (yoga/karana) ──

function getPanchangDoshas(p: PanchangData): { vishtiActive: { start: string; end: string }[], yogaDosha: string | null } {
  // Vishti (Bhadra) — from bhadraAll or bhadra
  const vishtiWindows = p.bhadraAll ?? (p.bhadra ? [p.bhadra] : []);

  // Vyatipata (#17) or Vaidhriti (#27) from the current yoga
  const yogaNum = p.yoga?.number;
  const yogaDosha = yogaNum === 17 ? 'vyatipata' : yogaNum === 27 ? 'vaidhriti' : null;

  return { vishtiActive: vishtiWindows as { start: string; end: string }[], yogaDosha };
}

// ── Main engine ──

export function computeDayVerdict(p: PanchangData): DayVerdict {
  const sunriseMin = parseHHMM(p.sunrise);
  const sunsetMin = parseHHMM(p.sunset);
  const slotSize = 30; // minutes

  const dayLevelYogas = detectDayLevelYogas(p);
  const { vishtiActive, yogaDosha } = getPanchangDoshas(p);
  const weekday = p.vara?.number ?? new Date().getDay(); // 0=Sun per JS
  // Abhijit on Wednesday check (weekday 3 in JS = Wednesday)
  const isWednesday = weekday === 3;

  // Build time ranges for all factors
  const hardBlockRanges: { id: string; start: number; end: number }[] = [];

  // N1: Vishti
  for (const w of vishtiActive) {
    hardBlockRanges.push({ id: 'vishti', start: parseHHMM(w.start), end: parseHHMM(w.end) });
  }

  // N2/N3: Vyatipata/Vaidhriti — these are day-level (yoga spans entire day or tithi duration)
  // We represent them as full-day blocks when active
  if (yogaDosha) {
    hardBlockRanges.push({ id: yogaDosha, start: sunriseMin, end: sunsetMin });
  }

  // N4-N6: Rahu Kaal, Yamaganda, Gulika
  if (p.rahuKaal) hardBlockRanges.push({ id: 'rahu_kaal', start: parseHHMM(p.rahuKaal.start), end: parseHHMM(p.rahuKaal.end) });
  if (p.yamaganda) hardBlockRanges.push({ id: 'yamaganda', start: parseHHMM(p.yamaganda.start), end: parseHHMM(p.yamaganda.end) });
  if (p.gulikaKaal) hardBlockRanges.push({ id: 'gulika_kaal', start: parseHHMM(p.gulikaKaal.start), end: parseHHMM(p.gulikaKaal.end) });

  // Conditional blocks
  const condBlockRanges: { id: string; start: number; end: number }[] = [];
  const varjyamWindows = p.varjyamAll ?? (p.varjyam ? [p.varjyam] : []);
  for (const w of varjyamWindows) {
    condBlockRanges.push({ id: 'varjyam', start: parseHHMM(w.start), end: parseHHMM(w.end) });
  }
  if (p.durMuhurtam) {
    for (const w of p.durMuhurtam) {
      condBlockRanges.push({ id: 'durmuhurta', start: parseHHMM(w.start), end: parseHHMM(w.end) });
    }
  }
  if (p.vishaGhatika) {
    condBlockRanges.push({ id: 'visha_ghatika', start: parseHHMM(p.vishaGhatika.start), end: parseHHMM(p.vishaGhatika.end) });
  }

  // Positive time windows
  const positiveRanges: { id: string; start: number; end: number }[] = [];
  if (p.abhijitMuhurta && p.abhijitMuhurta.available !== false) {
    positiveRanges.push({ id: 'abhijit', start: parseHHMM(p.abhijitMuhurta.start), end: parseHHMM(p.abhijitMuhurta.end) });
  }
  const amritWindows = p.amritKalamAll ?? (p.amritKalam ? [p.amritKalam] : []);
  for (const w of amritWindows) {
    positiveRanges.push({ id: 'amrit_kalam', start: parseHHMM(w.start), end: parseHHMM(w.end) });
  }
  if (p.brahmaMuhurta) {
    positiveRanges.push({ id: 'brahma_muhurta', start: parseHHMM(p.brahmaMuhurta.start), end: parseHHMM(p.brahmaMuhurta.end) });
  }
  if (p.vijayaMuhurta) {
    positiveRanges.push({ id: 'vijaya_muhurta', start: parseHHMM(p.vijayaMuhurta.start), end: parseHHMM(p.vijayaMuhurta.end) });
  }
  if (p.godhuli) {
    positiveRanges.push({ id: 'godhuli', start: parseHHMM(p.godhuli.start), end: parseHHMM(p.godhuli.end) });
  }

  // Choghadiya (separate — for display only, never enters verdict)
  const choghadiyaSlots = p.choghadiya ?? [];

  // ── Generate 30-minute slots ──
  const slots: TimeSlot[] = [];

  for (let min = sunriseMin; min < sunsetMin; min += slotSize) {
    const slotStart = min;
    const slotEnd = Math.min(min + slotSize, sunsetMin);
    const startStr = fmtHHMM(slotStart);
    const endStr = fmtHHMM(slotEnd);

    // Collect active hard blocks for this slot
    const activeHardBlocks: ActiveFactor[] = [];
    for (const r of hardBlockRanges) {
      if (rangeOverlaps(slotStart, slotEnd, r.start, r.end)) {
        activeHardBlocks.push(makeFactor(r.id, HARD_BLOCKS));
      }
    }

    // Collect active conditional blocks
    const activeCondBlocks: ActiveFactor[] = [];
    for (const r of condBlockRanges) {
      if (rangeOverlaps(slotStart, slotEnd, r.start, r.end)) {
        activeCondBlocks.push(makeFactor(r.id, CONDITIONAL_BLOCKS));
      }
    }

    // Collect active positives (time-window)
    const activePositives: ActiveFactor[] = [];
    for (const r of positiveRanges) {
      if (rangeOverlaps(slotStart, slotEnd, r.start, r.end)) {
        activePositives.push({ id: r.id, ...POSITIVES[r.id] });
      }
    }
    // Add day-level yogas (always active for every slot)
    for (const yoga of dayLevelYogas) {
      activePositives.push(yoga);
    }

    // Abhijit on Wednesday — downgrade
    if (isWednesday && activePositives.some(p => p.id === 'abhijit')) {
      // Keep it in positives but mark as weakened (handled in verdict logic)
    }

    // Find choghadiya for this slot (display only)
    const chog = choghadiyaSlots.find(c =>
      rangeOverlaps(slotStart, slotEnd, parseHHMM(c.startTime), parseHHMM(c.endTime))
    );

    // ── Determine verdict ──
    const conflicts: ConflictExplanation[] = [];
    let verdict: VerdictRating;
    let label = '';
    let labelHi = '';
    let explanation = '';
    let explanationHi = '';

    if (activeHardBlocks.length > 0) {
      // Check for Abhijit exception
      const hasAbhijit = activePositives.some(p => p.id === 'abhijit');
      if (hasAbhijit) {
        // Abhijit + hard block = check conflict matrix
        for (const block of activeHardBlocks) {
          const resolution = resolveConflict('abhijit', block.id);
          if (resolution) {
            conflicts.push({
              positive: 'Abhijit Muhurta',
              negative: block.name,
              verdict: resolution.verdict,
              explanation: resolution.explanation,
              explanationHi: resolution.explanationHi,
              rule: resolution.rule,
            });
          }
        }
        // Use the conflict verdict (CAUTION by default)
        verdict = conflicts[0]?.verdict ?? 'avoid';
        const blockNames = activeHardBlocks.map(b => b.name).join(' + ');
        label = `Abhijit Muhurta during ${blockNames}`;
        labelHi = `अभिजित मुहूर्त ${activeHardBlocks.map(b => b.nameHi).join(' + ')} के दौरान`;
        explanation = conflicts[0]?.explanation ?? `${blockNames} active — avoid new beginnings`;
        explanationHi = conflicts[0]?.explanationHi ?? `${activeHardBlocks.map(b => b.nameHi).join(' + ')} सक्रिय — नए कार्य टालें`;
      } else {
        verdict = 'avoid';
        const blockNames = activeHardBlocks.map(b => b.name);
        label = blockNames.join(' + ');
        labelHi = activeHardBlocks.map(b => b.nameHi).join(' + ');
        explanation = `${blockNames[0]} active — avoid all new beginnings`;
        explanationHi = `${activeHardBlocks[0].nameHi} सक्रिय — सभी नए कार्य वर्जित`;
      }
    } else if (activeCondBlocks.length > 0) {
      verdict = 'caution';
      label = activeCondBlocks.map(b => b.name).join(' + ');
      labelHi = activeCondBlocks.map(b => b.nameHi).join(' + ');
      explanation = activeCondBlocks[0].effect;
      explanationHi = activeCondBlocks[0].effectHi;
    } else {
      // No blocks — rate by positive strength
      const timePositives = activePositives.filter(p => POSITIVES[p.id]); // Only ranked ones
      const maxStrength = Math.max(0, ...timePositives.map(p => POSITIVES[p.id]?.strength ?? 0));
      const positiveCount = timePositives.length;

      if (positiveCount === 0) {
        verdict = 'good';
        label = 'Clear window';
        labelHi = 'शुभ समय';
        explanation = 'No doshas active — suitable for general activities';
        explanationHi = 'कोई दोष सक्रिय नहीं — सामान्य कार्यों के लिए उपयुक्त';
      } else if (maxStrength >= 90 || positiveCount >= 3) {
        verdict = positiveCount >= 3 && maxStrength >= 85 ? 'exceptional' : 'excellent';
        const names = timePositives.map(p => p.name);
        label = names.join(' + ');
        labelHi = timePositives.map(p => p.nameHi).join(' + ');
        explanation = `${names.length} auspicious factors stacking — prime window`;
        explanationHi = `${names.length} शुभ कारक एक साथ — सर्वोत्तम समय`;
      } else if (positiveCount >= 2 || maxStrength >= 70) {
        verdict = 'very_good';
        const names = timePositives.map(p => p.name);
        label = names.join(' + ');
        labelHi = timePositives.map(p => p.nameHi).join(' + ');
        explanation = `Multiple auspicious factors — very favourable`;
        explanationHi = `कई शुभ कारक — अत्यंत अनुकूल`;
      } else {
        verdict = 'good';
        label = timePositives[0]?.name ?? 'Clear window';
        labelHi = timePositives[0]?.nameHi ?? 'शुभ समय';
        explanation = timePositives[0]?.effect ?? 'No doshas active';
        explanationHi = timePositives[0]?.effectHi ?? 'कोई दोष नहीं';
      }
    }

    slots.push({
      start: startStr,
      end: endStr,
      verdict,
      label, labelHi,
      explanation, explanationHi,
      hardBlocks: activeHardBlocks,
      conditionalBlocks: activeCondBlocks,
      positives: activePositives,
      conflicts,
      choghadiya: chog ? {
        name: typeof chog.name === 'string' ? chog.name : chog.name?.en || chog.type,
        nameHi: typeof chog.name === 'string' ? chog.name : chog.name?.hi || chog.type,
        type: chog.type,
        nature: chog.nature,
      } : undefined,
    });
  }

  // Identify best/second-best windows
  const ratingOrder: VerdictRating[] = ['exceptional', 'excellent', 'very_good', 'good', 'caution', 'avoid'];
  const sorted = [...slots].sort((a, b) => ratingOrder.indexOf(a.verdict) - ratingOrder.indexOf(b.verdict));
  const bestWindow = sorted[0]?.verdict !== 'avoid' && sorted[0]?.verdict !== 'caution' ? sorted[0] : null;
  const secondBest = sorted[1]?.verdict !== 'avoid' && sorted[1]?.verdict !== 'caution' && sorted[1] !== bestWindow ? sorted[1] : null;

  return {
    slots,
    bestWindow,
    secondBest,
    avoidWindows: slots.filter(s => s.verdict === 'avoid'),
    dayLevelYogas,
    hasDayLevelDosha: vishtiActive.length > 0 || yogaDosha !== null,
  };
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/lib/__tests__/verdict-engine.test.ts
```

Expected: All tests pass. If type errors, fix the PanchangData mock to match the actual type.

- [ ] **Step 5: Commit**

```bash
git add src/lib/muhurta/verdict-engine.ts src/lib/__tests__/verdict-engine.test.ts
git commit -m "feat: verdict engine — computes day slots with precedence-based conflict resolution"
```

---

### Task 4: Build BestWindowsCard Component

**Files:**
- Create: `src/components/panchang/BestWindowsCard.tsx`

This is the main UI component: "Best Windows Today" card with verdict bar, expandable slot details, and conflict explanations.

- [ ] **Step 1: Create the component**

The component receives `PanchangData` and renders:
1. A "Best Window" callout card (gold highlight)
2. A horizontal verdict bar (sunrise→sunset, colour-coded segments)
3. A "Right now" indicator
4. Expandable slot list with conflict explanations
5. Choghadiya as a separate muted indicator

Key implementation details:
- Use `computeDayVerdict()` via `useMemo`
- Verdict bar: horizontal `<div>` with flex children, each slot coloured by verdict
- NOW marker: gold vertical line positioned by `(currentMinutes - sunrise) / (sunset - sunrise) * 100%`
- Colour map: avoid=`bg-red-500/25`, caution=`bg-amber-500/25`, good=`bg-emerald-500/15`, very_good=`bg-emerald-500/25`, excellent=`bg-gold-primary/25`, exceptional=`bg-gold-primary/40`
- Conflict badges (⚡) on slots where `conflicts.length > 0`
- Expandable detail: tap a slot → shows all active factors + conflict explanation
- Mobile: verdict bar is full-width thin strip; slots render as a scrollable card list below
- Locale: use `isDevanagariLocale(locale)` for Hindi labels vs English
- Purple mega card gradient for the overall container

The component is ~250-300 lines. The implementer should read the existing `DayTimeline.tsx` for pattern reference (same time helpers, same purple gradient, same NOW badge pattern), but NOT copy it — this component shows VERDICTS (synthesised), not raw windows.

Key prop interface:
```typescript
interface BestWindowsCardProps {
  panchang: PanchangData;
  locale: string;
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Commit**

```bash
git add src/components/panchang/BestWindowsCard.tsx
git commit -m "feat: BestWindowsCard — verdict bar + best window callout + conflict explainers"
```

---

### Task 5: Wire BestWindowsCard into Panchang Page

**Files:**
- Modify: `src/app/[locale]/panchang/PanchangClient.tsx`

- [ ] **Step 1: Import and add the component**

In `PanchangClient.tsx`, add the import:
```typescript
import BestWindowsCard from '@/components/panchang/BestWindowsCard';
```

Place `<BestWindowsCard panchang={panchang} locale={locale} />` after the existing `DayTimeline` section (around line 1750) and before the `specialYogas` block. Wrap in a `<div className="my-8">`.

The existing `DayTimeline` shows raw windows (auspicious vs inauspicious list). The new `BestWindowsCard` shows the synthesised verdict with conflict resolution. They complement each other — DayTimeline is the "data" view, BestWindowsCard is the "verdict" view.

- [ ] **Step 2: Verify in browser**

Open `http://localhost:3000/en/panchang`. The BestWindowsCard should render below the DayTimeline with:
- A gold-highlighted "Best Window" callout
- A coloured verdict bar
- Expandable slot cards

- [ ] **Step 3: Commit**

```bash
git add 'src/app/[locale]/panchang/PanchangClient.tsx'
git commit -m "feat: wire BestWindowsCard into panchang page — after DayTimeline section"
```

---

### Task 6: Wire BestWindowsCard into Dashboard

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Import and add the component**

In `dashboard/page.tsx`, add the import:
```typescript
import BestWindowsCard from '@/components/panchang/BestWindowsCard';
```

Place the component in the Today tab, after the `DailyPanchangInsightCard` and before `AtAGlance` (around line 1460). Only render when `panchangData` is available:

```typescript
{panchangData && (
  <div className="mt-6">
    <BestWindowsCard panchang={panchangData} locale={locale} />
  </div>
)}
```

This replaces the existing `todayMuhurtaWindows` chip display in the hero with a richer, precedence-aware version. Keep the hero chips as-is (they're a quick glance) — the BestWindowsCard below provides the full breakdown.

- [ ] **Step 2: Verify in browser**

Log in, navigate to `/en/dashboard`. The Today tab should show BestWindowsCard below the insight card.

- [ ] **Step 3: Commit**

```bash
git add 'src/app/[locale]/dashboard/page.tsx'
git commit -m "feat: add BestWindowsCard to dashboard Today tab"
```

---

### Task 7: End-to-End Verification

**Files:** None — verification only.

- [ ] **Step 1: Run tests**

```bash
npx vitest run
```

All 3178+ tests must pass (including new verdict engine tests).

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Build**

```bash
NODE_OPTIONS="--max-old-space-size=8192" npx next build
```

- [ ] **Step 4: Browser verification — Panchang page**

Navigate to `http://localhost:3000/en/panchang`:
- BestWindowsCard visible below DayTimeline
- Verdict bar shows coloured segments
- "Best Window" callout shows top-rated slot with time + factors
- NOW marker visible at current time
- Tapping a slot shows factor breakdown + any conflict explanations
- Rahu Kaal slot shows 🔴 AVOID
- Abhijit slot shows 🟢🟢 EXCELLENT (or EXCEPTIONAL if day-level yoga stacking)
- Choghadiya shown as muted separate indicator, NOT affecting verdict colour

- [ ] **Step 5: Browser verification — Dashboard**

Log in, navigate to `/en/dashboard`:
- BestWindowsCard visible in Today tab
- Uses the same panchang data as the hero muhurta chips
- No duplicate or contradictory information

- [ ] **Step 6: Mobile verification**

Open panchang page at 375px width:
- Verdict bar is readable
- Slot cards scroll properly
- No horizontal overflow

---

## Deferred (not in this plan)

- **Activity-aware mode** (dropdown: Travel, Purchase, Marriage, etc.) — Level 2, separate plan
- **Personal Tarabala overlay** (birth nakshatra) — Level 3, separate plan
- **Standalone `/muhurta/today` page** with full lane view — Level 2, after panchang integration proves the concept

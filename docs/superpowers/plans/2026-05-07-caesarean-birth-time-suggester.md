# Caesarean Birth Time Suggester — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a tool that ranks time slots within a hospital-given date range to find the best possible birth chart for a C-section delivery, scored by classical Jyotish birth-election principles.

**Architecture:** A new scoring engine (`src/lib/caesarean/`) evaluates candidate birth moments by generating a lightweight kundali for each slot and scoring it across 5 classical pillars: lagna strength, Moon strength, benefic/malefic distribution, structural defects (vetoes), and dasha trajectory. An API route scans date ranges at 15-minute resolution and returns ranked slots. A dedicated page (`/caesarean-muhurta`) renders the ranked list with detailed breakdowns. A learn page (`/learn/caesarean-muhurta`) documents all classical rules.

**Tech Stack:** Next.js App Router, existing `kundali-calc.ts` engine (lightweight mode), existing muhurta `context-builder.ts` for panchang snapshots, Framer Motion for UI, Tailwind v4, `next-intl` for i18n.

---

## File Structure

### New files

| File | Responsibility |
|---|---|
| `src/lib/caesarean/types.ts` | All types for the caesarean scorer |
| `src/lib/caesarean/scorer.ts` | The 5-pillar scoring engine |
| `src/lib/caesarean/constants.ts` | Classical birth-election constants (nakshatra doshas, lagna preferences, etc.) |
| `src/lib/caesarean/scanner.ts` | Date-range scanner that generates slots and calls scorer |
| `src/lib/caesarean/index.ts` | Barrel re-export |
| `src/lib/__tests__/caesarean-scorer.test.ts` | Unit tests for the scorer |
| `src/lib/__tests__/caesarean-scanner.test.ts` | Integration tests for the scanner |
| `src/app/api/caesarean-scan/route.ts` | API endpoint |
| `src/app/[locale]/caesarean-muhurta/page.tsx` | Tool page (client component with scanner UI) |
| `src/app/[locale]/caesarean-muhurta/layout.tsx` | SEO metadata + JSON-LD |
| `src/app/[locale]/caesarean-muhurta/components/SlotCard.tsx` | Individual ranked slot display |
| `src/app/[locale]/caesarean-muhurta/components/ScanForm.tsx` | Input form (date range, location, operating hours) |
| `src/app/[locale]/caesarean-muhurta/components/ClassicalTips.tsx` | Collapsible tips section |
| `src/app/[locale]/learn/caesarean-muhurta/page.tsx` | Learn page documenting all rules |
| `src/messages/pages/caesarean-muhurta.json` | i18n strings for the tool page |
| `src/messages/learn/caesarean-muhurta.json` | i18n strings for the learn page |

### Modified files

| File | Change |
|---|---|
| `src/lib/seo/metadata.ts` | Add `PAGE_META` entries for `/caesarean-muhurta` and `/learn/caesarean-muhurta` |
| `src/app/sitemap.ts` | Add both routes |
| `src/lib/seo/faq-data.ts` | Add FAQs for `/caesarean-muhurta` |
| `src/lib/seo/cross-links.ts` | Cross-link from muhurta-ai, learn/muhurtas, kundali |

---

## Classical Scoring Framework

### The 5 Pillars (100 points total)

The scoring follows one coherent principle: **a good birth chart has a strong lagna, a strong Moon, benefics where they help, malefics where they're contained, and no structural defects.**

| Pillar | Max | Classical basis |
|---|---|---|
| **1. Lagna Strength** | 30 | BPHS Ch.6-7 (Lagna Shuddhi) |
| **2. Moon Strength** | 25 | Muhurta Chintamani, BPHS Ch.24 |
| **3. Benefic/Malefic Distribution** | 20 | Prasna Marga Ch.9, BPHS Ch.11 |
| **4. Dasha Trajectory** | 15 | BPHS Dasha chapters, practitioner consensus |
| **5. Structural Defects** | 10 (penalty) | Multiple sources — vetoes and deductions |

**Total: 90 base + 10 that can only be lost via defects = effective 0–100 range.**

### Pillar 1: Lagna Strength (30 pts)

| Factor | Points | Rule | Source |
|---|---|---|---|
| Lagna lord dignity | 0–10 | Exalted=10, Own=8, Moolatrikona=9, Friend=6, Neutral=4, Enemy=2, Debilitated=0 | BPHS Ch.3-4 |
| Lagna lord in kendra/trikona | 0–5 | Kendra(1,4,7,10)=5, Trikona(5,9)=4, 11th=3, 2nd=2, Dusthana(6,8,12)=0 | BPHS Ch.6 |
| Benefic in lagna | 0–5 | Jupiter=5, Venus=4, Mercury(unafflicted)=3, Moon(waxing)=2 | Prasna Marga Ch.9 |
| No malefic in lagna (without benefic aspect) | 0–4 | Saturn/Mars/Rahu/Ketu in lagna without Jupiter/Venus aspect = -4 | Prasna Marga Ch.9 |
| Pushkar Navamsha lagna | 0–3 | Lagna falls in a Pushkar Navamsha division | Saravali |
| Sandhi lagna buffer | 0–3 | Lagna > 2° from sign boundary on both sides = 3; 1–2° = 1; < 1° = 0 (unstable) | Practitioner consensus |

### Pillar 2: Moon Strength (25 pts)

| Factor | Points | Rule | Source |
|---|---|---|---|
| Moon's house from lagna | 0–8 | Kendra(1,4,7,10)=8, Trikona(5,9)=7, 2nd/11th=5, 3rd=3, Dusthana(6,8,12)=0 | Muhurta Chintamani |
| Paksha Bala (lunar phase) | 0–5 | Shukla Dwitiya–Dashami=5, Shukla Ekadashi–Purnima=4, Krishna Pratipada–Panchami=3, Krishna Shashthi–Dashami=1, Krishna Ekadashi–Amavasya=0 | BPHS Ch.27 |
| Nakshatra quality | 0–5 | Deva gana nakshatras=5, Manushya=3, Rakshasa=1; Gandanta zone=0 | Muhurta Chintamani |
| No Janma Nakshatra Dosha | 0–4 | No dosha=4, Dosha present but not in problematic pada=2, Problematic pada=0 | Muhurta Chintamani |
| Jupiter aspecting Moon | 0–3 | Jupiter aspects Moon (houses 5/7/9 from Jupiter)=3 | Prasna Marga Ch.9 |

**Janma Nakshatra Dosha table:**

| Nakshatra | ID | Problematic Pada | Classical harm |
|---|---|---|---|
| Ashlesha | 9 | 4th pada | Mother |
| Magha | 10 | 1st pada | Father |
| Moola | 19 | 1st pada | Father/family |
| Jyeshtha | 18 | 4th pada | Elder brother |
| Ashwini | 1 | — | Mild, generally safe |
| Revati | 27 | — | Only if in Gandanta zone (last 3°20') |

### Pillar 3: Benefic/Malefic Distribution (20 pts)

| Factor | Points | Rule | Source |
|---|---|---|---|
| Benefics in kendras (1,4,7,10) | 0–8 | +2.5 per benefic (Jupiter, Venus, Mercury, Moon-waxing) in any kendra, max 8 | BPHS Ch.11 |
| Benefics in trikonas (5,9) | 0–4 | +2 per benefic in trikona, max 4 | BPHS Ch.11 |
| Malefics in upachaya (3,6,11) | 0–4 | +2 per malefic (Saturn, Mars, Rahu, Ketu) in 3/6/11, max 4 | BPHS Ch.11 |
| 8th house clean | 0–4 | Empty=4, Only benefic=2, Malefic present=0 | Muhurta Chintamani |

### Pillar 4: Dasha Trajectory (15 pts)

The child enters the Vimshottari maha dasha of the Moon's nakshatra lord at birth. Both the **lord** and the **remaining balance** matter.

| Starting Maha Dasha | Base Score | Source |
|---|---|---|
| Jupiter (16 yr) | 10 | Best: benefic, expansive, long |
| Venus (20 yr) | 9 | Excellent: benefic, longest period |
| Mercury (17 yr) | 8 | Good: intellectual, adaptable |
| Moon (10 yr) | 7 | Good but short |
| Sun (6 yr) | 6 | Decent but very short |
| Mars (7 yr) | 4 | Aggressive energy for a child |
| Saturn (19 yr) | 3 | Difficult childhood, builds resilience |
| Rahu (18 yr) | 2 | Directionless, confusion |
| Ketu (7 yr) | 1 | Detached, spiritual but difficult for child |

**Balance multiplier:** `min(1.0, remainingYears / (totalYears * 0.5))` — full score only if at least half the dasha remains. Starting Jupiter with 1 year left is nearly worthless; you immediately transition to Saturn.

**Final dasha score = `baseScore × balanceMultiplier × 1.5` (capped at 15).**

### Pillar 5: Structural Defects (deductions from a base of 10)

Start with 10 points. Deduct for each defect found:

| Defect | Deduction | Veto? | Source |
|---|---|---|---|
| Gandanta Moon (last 3°20' water / first 3°20' fire sign) | -10 | **YES — hard veto, slot score = 0** | Muhurta Chintamani |
| Kaal Sarpa (all planets between Rahu-Ketu axis) | -8 | No | Multiple |
| Lagna lord combust (within Sun's orb) | -6 | No | BPHS Ch.3 |
| Rahu or Ketu in lagna | -5 | No | Prasna Marga |
| Rahu or Ketu in 7th house | -4 | No | Prasna Marga |
| Saturn in lagna without Jupiter aspect | -5 | No | Prasna Marga Ch.9 |
| Vishti (Bhadra) karana active | -3 | No | Kalaprakashika |
| Vyatipata or Vaidhriti yoga active | -3 | No | Kalaprakashika |
| Rahu Kaal / Gulika Kaal active | -3 | No | Kalaprakashika |
| Badhakesh in lagna or aspecting lagna | -3 | No | Practitioner tradition |
| Mars in 8th house | -2 | No | General |

**Floor: 0 (defect score cannot go negative — any defect-laden chart will score 0 in this pillar).**

**Hard vetoes:** Gandanta Moon sets the *entire slot score* to 0 and flags it as "Avoid." No amount of lagna strength compensates for a Gandanta birth.

### Slot Grading

| Grade | Score Range | Label |
|---|---|---|
| Excellent | ≥ 75 | "Highly Auspicious" |
| Good | ≥ 60 | "Auspicious" |
| Fair | ≥ 45 | "Acceptable" |
| Marginal | ≥ 30 | "Weak — proceed with caution" |
| Poor | < 30 | "Not recommended" |
| Vetoed | 0 | "Avoid" |

---

## Task Breakdown

### Task 1: Types and Constants

**Files:**
- Create: `src/lib/caesarean/types.ts`
- Create: `src/lib/caesarean/constants.ts`

- [ ] **Step 1: Create types.ts**

```ts
// src/lib/caesarean/types.ts

import type { LocaleText } from '@/types/panchang';

/** Slot grade based on total score */
export type SlotGrade = 'excellent' | 'good' | 'fair' | 'marginal' | 'poor' | 'vetoed';

/** Per-pillar breakdown */
export interface PillarBreakdown {
  lagna: number;       // 0-30
  moon: number;        // 0-25
  distribution: number; // 0-20
  dasha: number;       // 0-15
  defects: number;     // 0-10 (starts at 10, deducted)
}

/** A defect found in the chart */
export interface ChartDefect {
  id: string;
  label: LocaleText;
  deduction: number;
  isVeto: boolean;
  source: string;      // Classical text reference
}

/** A positive factor found in the chart */
export interface ChartStrength {
  id: string;
  label: LocaleText;
  points: number;
  pillar: keyof PillarBreakdown;
  source: string;
}

/** Dasha info for the birth moment */
export interface BirthDashaInfo {
  lord: string;         // 'Jupiter', 'Venus', etc.
  lordId: number;       // Planet ID (0-8)
  totalYears: number;
  remainingYears: number;
  score: number;        // 0-15 final dasha pillar score
}

/** Complete scored slot */
export interface ScoredBirthSlot {
  date: string;          // YYYY-MM-DD
  time: string;          // HH:MM
  endTime: string;       // HH:MM (end of 15-min window)
  score: number;         // 0-100
  grade: SlotGrade;
  pillarBreakdown: PillarBreakdown;
  strengths: ChartStrength[];
  defects: ChartDefect[];
  dashaInfo: BirthDashaInfo;
  lagnaSign: number;     // 1-12
  lagnaSignName: LocaleText;
  lagnaLordId: number;   // 0-8
  moonSign: number;      // 1-12
  moonNakshatra: number; // 1-27
  moonNakshatraName: LocaleText;
  yogas: { name: LocaleText; isAuspicious: boolean }[];
  panchang: {
    tithi: LocaleText;
    nakshatra: LocaleText;
    yoga: LocaleText;
    karana: LocaleText;
  };
  isVetoed: boolean;
  vetoReason?: LocaleText;
}

/** Scanner input */
export interface CaesareanScanInput {
  startDate: string;     // YYYY-MM-DD
  endDate: string;       // YYYY-MM-DD
  lat: number;
  lng: number;
  timezone: string;      // IANA string
  /** Operating hours constraint (24h format) */
  opStart: number;       // e.g. 8 for 8:00 AM
  opEnd: number;         // e.g. 17 for 5:00 PM
  /** Resolution in minutes */
  windowMinutes?: number; // default 15
  /** Max results to return */
  maxResults?: number;    // default 20
}

/** Scanner output */
export interface CaesareanScanResult {
  slots: ScoredBirthSlot[];
  meta: {
    dateRange: { start: string; end: string };
    location: { lat: number; lng: number };
    operatingHours: { start: number; end: number };
    totalSlotsEvaluated: number;
    computeTimeMs: number;
  };
}
```

- [ ] **Step 2: Create constants.ts**

```ts
// src/lib/caesarean/constants.ts

/**
 * Classical birth-election constants.
 * Sources: BPHS Ch.3-7, Muhurta Chintamani, Prasna Marga Ch.9,
 * Kalaprakashika, Saravali, practitioner consensus.
 *
 * ALL constants defined here — NEVER duplicate in other files (Lesson Q).
 */

import type { LocaleText } from '@/types/panchang';

// ─── Dasha Lord Scores ──────────────────────────────────────────────────────

/** Base desirability score for starting a maha dasha at birth (0-10). */
export const DASHA_LORD_BIRTH_SCORE: Record<string, number> = {
  Jupiter: 10,
  Venus: 9,
  Mercury: 8,
  Moon: 7,
  Sun: 6,
  Mars: 4,
  Saturn: 3,
  Rahu: 2,
  Ketu: 1,
};

// ─── Janma Nakshatra Doshas ─────────────────────────────────────────────────

export interface JanmaNakshatraDosha {
  nakshatraId: number;
  problematicPada: number | null; // null = all padas mildly affected
  severity: 'severe' | 'moderate' | 'mild';
  harm: LocaleText;
}

export const JANMA_NAKSHATRA_DOSHAS: JanmaNakshatraDosha[] = [
  { nakshatraId: 9,  problematicPada: 4,    severity: 'severe',   harm: { en: 'Ashlesha 4th pada — harm to mother', hi: 'आश्लेषा चतुर्थ चरण — माता को हानि' } },
  { nakshatraId: 10, problematicPada: 1,    severity: 'severe',   harm: { en: 'Magha 1st pada — harm to father', hi: 'मघा प्रथम चरण — पिता को हानि' } },
  { nakshatraId: 18, problematicPada: 4,    severity: 'severe',   harm: { en: 'Jyeshtha 4th pada — harm to elder sibling', hi: 'ज्येष्ठा चतुर्थ चरण — बड़े भाई/बहन को हानि' } },
  { nakshatraId: 19, problematicPada: 1,    severity: 'severe',   harm: { en: 'Moola 1st pada — harm to father/family', hi: 'मूल प्रथम चरण — पिता/परिवार को हानि' } },
  { nakshatraId: 9,  problematicPada: null, severity: 'moderate', harm: { en: 'Ashlesha — general caution', hi: 'आश्लेषा — सामान्य सावधानी' } },
  { nakshatraId: 19, problematicPada: null, severity: 'moderate', harm: { en: 'Moola — general caution', hi: 'मूल — सामान्य सावधानी' } },
];

// ─── Gandanta Zones ─────────────────────────────────────────────────────────

/**
 * Gandanta = last 3°20' of a water sign → first 3°20' of a fire sign.
 * Water signs: Cancer (4), Scorpio (8), Pisces (12)
 * Fire signs:  Leo (5), Sagittarius (9), Aries (1)
 * Junctions: Cancer→Leo, Scorpio→Sagittarius, Pisces→Aries
 *
 * In sidereal degrees:
 *   Cancer ends at 120°,  Leo starts at 120°  → zone: 116.667° – 123.333°
 *   Scorpio ends at 240°, Sagittarius at 240° → zone: 236.667° – 243.333°
 *   Pisces ends at 360°,  Aries starts at 0°  → zone: 356.667° – 3.333°
 */
export const GANDANTA_ZONES: Array<{ startDeg: number; endDeg: number; wraps: boolean }> = [
  { startDeg: 116.667, endDeg: 123.333, wraps: false },
  { startDeg: 236.667, endDeg: 243.333, wraps: false },
  { startDeg: 356.667, endDeg: 3.333,   wraps: true },
];

export function isInGandanta(moonSidDeg: number): boolean {
  for (const zone of GANDANTA_ZONES) {
    if (zone.wraps) {
      if (moonSidDeg >= zone.startDeg || moonSidDeg <= zone.endDeg) return true;
    } else {
      if (moonSidDeg >= zone.startDeg && moonSidDeg <= zone.endDeg) return true;
    }
  }
  return false;
}

// ─── Moon House Scores ──────────────────────────────────────────────────────

/** Moon's house from lagna → score (Muhurta Chintamani) */
export const MOON_HOUSE_SCORE: Record<number, number> = {
  1: 8, 2: 5, 3: 3, 4: 8, 5: 7, 6: 0,
  7: 8, 8: 0, 9: 7, 10: 8, 11: 5, 12: 0,
};

// ─── Lagna Lord House Placement Scores ──────────────────────────────────────

/** Lagna lord's house → placement score (BPHS Ch.6) */
export const LAGNA_LORD_HOUSE_SCORE: Record<number, number> = {
  1: 5, 2: 2, 3: 1, 4: 5, 5: 4, 6: 0,
  7: 5, 8: 0, 9: 4, 10: 5, 11: 3, 12: 0,
};

// ─── Nakshatra Gana (temperament group) ─────────────────────────────────────

/** Nakshatra ID (1-27) → Gana. Deva = divine, Manushya = human, Rakshasa = demon */
export const NAKSHATRA_GANA: Record<number, 'deva' | 'manushya' | 'rakshasa'> = {
  1: 'deva',     // Ashwini
  2: 'manushya', // Bharani
  3: 'rakshasa', // Krittika
  4: 'deva',     // Rohini
  5: 'deva',     // Mrigashira
  6: 'manushya', // Ardra
  7: 'deva',     // Punarvasu
  8: 'deva',     // Pushya
  9: 'rakshasa', // Ashlesha
  10: 'rakshasa',// Magha
  11: 'manushya',// Purva Phalguni
  12: 'manushya',// Uttara Phalguni
  13: 'deva',    // Hasta
  14: 'rakshasa',// Chitra
  15: 'deva',    // Swati
  16: 'rakshasa',// Vishakha
  17: 'deva',    // Anuradha
  18: 'rakshasa',// Jyeshtha
  19: 'rakshasa',// Moola
  20: 'manushya',// Purva Ashadha
  21: 'manushya',// Uttara Ashadha
  22: 'deva',     // Shravana
  23: 'rakshasa', // Dhanishta
  24: 'rakshasa', // Shatabhisha
  25: 'manushya', // Purva Bhadrapada
  26: 'manushya', // Uttara Bhadrapada
  27: 'deva',     // Revati
};

// ─── Benefic/Malefic Classification ─────────────────────────────────────────

/** Natural benefics: Jupiter(4), Venus(5), Mercury(3), Moon(1) when waxing */
export const NATURAL_BENEFICS = new Set([4, 5, 3]); // Moon handled separately
/** Natural malefics: Sun(0), Mars(2), Saturn(6), Rahu(7), Ketu(8) */
export const NATURAL_MALEFICS = new Set([0, 2, 6, 7, 8]);

// ─── Pushkar Navamsha Lagnas ────────────────────────────────────────────────

/**
 * Pushkar Navamsha: specific navamsha divisions considered highly auspicious.
 * Each sign has certain degree ranges where the navamsha falls in a Pushkar division.
 * Stored as [signId, startDegInSign, endDegInSign] tuples.
 * From Saravali / Jataka Parijata.
 */
export const PUSHKAR_NAVAMSHA_RANGES: Array<{ sign: number; startDeg: number; endDeg: number }> = [
  // Aries: 20°00' – 23°20' (Libra navamsha)
  { sign: 1, startDeg: 20, endDeg: 23.333 },
  // Taurus: 6°40' – 10°00' (Virgo navamsha), 20°00' – 23°20' (Pisces navamsha)
  { sign: 2, startDeg: 6.667, endDeg: 10 },
  { sign: 2, startDeg: 20, endDeg: 23.333 },
  // Gemini: 16°40' – 20°00' (Sagittarius navamsha)
  { sign: 3, startDeg: 16.667, endDeg: 20 },
  // Cancer: 0°00' – 3°20' (Cancer navamsha), 13°20' – 16°40' (Pisces navamsha)
  { sign: 4, startDeg: 0, endDeg: 3.333 },
  { sign: 4, startDeg: 13.333, endDeg: 16.667 },
  // Leo: 6°40' – 10°00' (Libra navamsha), 26°40' – 30°00' (Pisces navamsha)
  { sign: 5, startDeg: 6.667, endDeg: 10 },
  { sign: 5, startDeg: 26.667, endDeg: 30 },
  // Virgo: 16°40' – 20°00' (Pisces navamsha)
  { sign: 6, startDeg: 16.667, endDeg: 20 },
  // Libra: 0°00' – 3°20' (Libra navamsha), 20°00' – 23°20' (Aries navamsha)
  { sign: 7, startDeg: 0, endDeg: 3.333 },
  { sign: 7, startDeg: 20, endDeg: 23.333 },
  // Scorpio: 6°40' – 10°00' (Pisces navamsha), 26°40' – 30°00' (Cancer navamsha)
  { sign: 8, startDeg: 6.667, endDeg: 10 },
  { sign: 8, startDeg: 26.667, endDeg: 30 },
  // Sagittarius: 16°40' – 20°00' (Aries navamsha)
  { sign: 9, startDeg: 16.667, endDeg: 20 },
  // Capricorn: 0°00' – 3°20' (Capricorn navamsha), 13°20' – 16°40' (Pisces navamsha)
  { sign: 10, startDeg: 0, endDeg: 3.333 },
  { sign: 10, startDeg: 13.333, endDeg: 16.667 },
  // Aquarius: 6°40' – 10°00' (Aries navamsha), 26°40' – 30°00' (Libra navamsha)
  { sign: 11, startDeg: 6.667, endDeg: 10 },
  { sign: 11, startDeg: 26.667, endDeg: 30 },
  // Pisces: 16°40' – 20°00' (Cancer navamsha)
  { sign: 12, startDeg: 16.667, endDeg: 20 },
];

// ─── Badhaka Lords ──────────────────────────────────────────────────────────

/**
 * Badhakesh (obstruction lord) by lagna sign.
 * Movable signs (1,4,7,10): 11th lord is badhaka
 * Fixed signs (2,5,8,11): 9th lord is badhaka
 * Dual signs (3,6,9,12): 7th lord is badhaka
 */
export function getBadhakeshPlanet(lagnaSign: number, signLords: Record<number, number>): number {
  // signLords passed in to avoid circular dependency — caller imports SIGN_LORDS
  const modality = getSignModality(lagnaSign);
  const badhakHouse = modality === 'movable' ? 11 : modality === 'fixed' ? 9 : 7;
  const badhakSign = ((lagnaSign - 1 + badhakHouse - 1) % 12) + 1;
  return signLords[badhakSign];
}

function getSignModality(sign: number): 'movable' | 'fixed' | 'dual' {
  const mod = ((sign - 1) % 3);
  return mod === 0 ? 'movable' : mod === 1 ? 'fixed' : 'dual';
}

// ─── Combustion Orbs (BPHS Ch.3) ───────────────────────────────────────────

/** Planet ID → combustion orb in degrees. Lagna lord combustion check uses this. */
export const COMBUSTION_ORBS: Record<number, number> = {
  1: 12, // Moon
  2: 17, // Mars
  3: 14, // Mercury (12 if retrograde — handled in scorer)
  4: 11, // Jupiter
  5: 10, // Venus (8 if retrograde — handled in scorer)
  6: 15, // Saturn
};
```

- [ ] **Step 3: Create barrel index**

```ts
// src/lib/caesarean/index.ts
export { scoreBirthSlot } from './scorer';
export { scanCaesareanSlots } from './scanner';
export type {
  ScoredBirthSlot, CaesareanScanInput, CaesareanScanResult,
  PillarBreakdown, ChartDefect, ChartStrength, BirthDashaInfo, SlotGrade,
} from './types';
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/caesarean/types.ts src/lib/caesarean/constants.ts src/lib/caesarean/index.ts
git commit -m "feat(caesarean): add types and classical birth-election constants"
```

---

### Task 2: Scoring Engine

**Files:**
- Create: `src/lib/caesarean/scorer.ts`
- Test: `src/lib/__tests__/caesarean-scorer.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/__tests__/caesarean-scorer.test.ts
import { describe, it, expect } from 'vitest';
import { scoreBirthSlot } from '@/lib/caesarean/scorer';

// We need a helper to create a mock "lightweight kundali" for testing.
// The scorer will accept pre-computed chart data, not raw BirthData.

describe('scoreBirthSlot', () => {
  it('returns score 0 (vetoed) for Gandanta Moon', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 4, moonHouse: 4, moonSidDeg: 119.5, // Gandanta zone (Cancer end)
      moonNakshatraId: 9, moonNakshatraPada: 3,
      planets: [], tithiNumber: 5, yogaNumber: 1, karanaNumber: 1,
      sunSidDeg: 50,
    });
    expect(result.isVetoed).toBe(true);
    expect(result.score).toBe(0);
  });

  it('scores Jupiter in lagna highly in lagna pillar', () => {
    const result = scoreBirthSlot({
      lagnaSign: 9, lagnaDegreesInSign: 15, lagnaLordId: 4, // Sagittarius, lord = Jupiter
      lagnaLordSign: 9, lagnaLordHouse: 1, // Jupiter in own sign in lagna
      moonSign: 2, moonHouse: 5, moonSidDeg: 40, // Taurus, trikona
      moonNakshatraId: 4, moonNakshatraPada: 2, // Rohini — Deva gana, no dosha
      planets: [
        { id: 4, sign: 9, house: 1, longitude: 260, isRetrograde: false }, // Jupiter in 1st
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    expect(result.pillarBreakdown.lagna).toBeGreaterThanOrEqual(20);
    expect(result.score).toBeGreaterThanOrEqual(60);
  });

  it('penalises Saturn in lagna without Jupiter aspect', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 10, lagnaLordHouse: 10,
      moonSign: 2, moonHouse: 2, moonSidDeg: 35,
      moonNakshatraId: 3, moonNakshatraPada: 2,
      planets: [
        { id: 6, sign: 1, house: 1, longitude: 5, isRetrograde: false }, // Saturn in 1st
      ],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 200,
    });
    // Should have Saturn-in-lagna defect
    expect(result.defects.some(d => d.id === 'saturn_in_lagna')).toBe(true);
  });

  it('scores Jupiter dasha with high remaining years at max', () => {
    const result = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 7, moonHouse: 7, moonSidDeg: 187, // Early Swati — Punarvasu nakshatra lord = Jupiter
      moonNakshatraId: 15, moonNakshatraPada: 1, // Swati (lord = Rahu)
      planets: [],
      tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    // Swati nakshatra lord = Rahu → low dasha score
    expect(result.dashaInfo.lord).toBe('Rahu');
    expect(result.pillarBreakdown.dasha).toBeLessThanOrEqual(5);
  });

  it('gives full nakshatra score for Deva gana, deducts for Rakshasa', () => {
    // Pushya (8) = Deva gana
    const deva = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 4, moonHouse: 4, moonSidDeg: 100,
      moonNakshatraId: 8, moonNakshatraPada: 2,
      planets: [], tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    // Moola (19) = Rakshasa gana
    const rakshasa = scoreBirthSlot({
      lagnaSign: 1, lagnaDegreesInSign: 15, lagnaLordId: 2,
      lagnaLordSign: 1, lagnaLordHouse: 1,
      moonSign: 9, moonHouse: 9, moonSidDeg: 247,
      moonNakshatraId: 19, moonNakshatraPada: 2,
      planets: [], tithiNumber: 5, yogaNumber: 4, karanaNumber: 2, sunSidDeg: 50,
    });
    expect(deva.pillarBreakdown.moon).toBeGreaterThan(rakshasa.pillarBreakdown.moon);
  });
});
```

- [ ] **Step 2: Run tests — expect failures**

```bash
npx vitest run src/lib/__tests__/caesarean-scorer.test.ts
```

Expected: FAIL — `scoreBirthSlot` not found.

- [ ] **Step 3: Implement scorer.ts**

```ts
// src/lib/caesarean/scorer.ts

/**
 * Caesarean Birth Time Scorer — 5-Pillar Classical Framework
 *
 * Evaluates a candidate birth moment across:
 *   1. Lagna Strength (30 pts) — BPHS Ch.6-7
 *   2. Moon Strength (25 pts) — Muhurta Chintamani
 *   3. Benefic/Malefic Distribution (20 pts) — Prasna Marga Ch.9
 *   4. Dasha Trajectory (15 pts) — BPHS dasha chapters
 *   5. Structural Defects (10 pts base, deducted) — multiple sources
 *
 * Input: pre-computed chart snapshot (not raw BirthData — the scanner handles
 * the expensive kundali computation and passes the relevant data here).
 *
 * This scorer is a PURE FUNCTION — no side effects, no I/O.
 */

import type { LocaleText } from '@/types/panchang';
import type {
  ScoredBirthSlot, PillarBreakdown, ChartDefect, ChartStrength,
  BirthDashaInfo, SlotGrade,
} from './types';
import {
  isInGandanta, MOON_HOUSE_SCORE, LAGNA_LORD_HOUSE_SCORE,
  NAKSHATRA_GANA, NATURAL_BENEFICS, NATURAL_MALEFICS,
  DASHA_LORD_BIRTH_SCORE, JANMA_NAKSHATRA_DOSHAS,
  PUSHKAR_NAVAMSHA_RANGES, COMBUSTION_ORBS, getBadhakeshPlanet,
} from './constants';
import { SIGN_LORDS, isExalted, isDebilitated, isOwnSign, MOOLATRIKONA } from '@/lib/constants/dignities';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';

// ─── Scorer Input ───────────────────────────────────────────────────────────

/** Lightweight chart snapshot — the minimum data needed to score a slot */
export interface ChartSnapshot {
  lagnaSign: number;           // 1-12
  lagnaDegreesInSign: number;  // 0-30 degrees within sign
  lagnaLordId: number;         // 0-8 planet ID
  lagnaLordSign: number;       // 1-12 sign the lord is in
  lagnaLordHouse: number;      // 1-12 house from lagna (whole-sign)
  moonSign: number;            // 1-12
  moonHouse: number;           // 1-12 from lagna
  moonSidDeg: number;          // 0-360 sidereal longitude
  moonNakshatraId: number;     // 1-27
  moonNakshatraPada: number;   // 1-4
  planets: Array<{
    id: number;                // 0=Sun..8=Ketu
    sign: number;              // 1-12
    house: number;             // 1-12
    longitude: number;         // sidereal degrees
    isRetrograde: boolean;
  }>;
  tithiNumber: number;         // 1-30
  yogaNumber: number;          // 1-27
  karanaNumber: number;        // 1-11
  sunSidDeg: number;           // Sun's sidereal longitude (for combustion checks)
}

// ─── Vimshottari Dasha Data ─────────────────────────────────────────────────

const NAKSHATRA_LORDS = [
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
  'Ketu', 'Venus', 'Sun', 'Moon', 'Mars', 'Rahu', 'Jupiter', 'Saturn', 'Mercury',
];

const DASHA_TOTAL_YEARS: Record<string, number> = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};

const LORD_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4, Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

// ─── Main Scorer ────────────────────────────────────────────────────────────

export function scoreBirthSlot(snap: ChartSnapshot): ScoredBirthSlot {
  const strengths: ChartStrength[] = [];
  const defects: ChartDefect[] = [];

  // ── Pillar 5 first: check for hard vetoes ──
  const { defectScore, isVetoed, vetoReason } = scoreDefects(snap, defects);
  if (isVetoed) {
    return buildVetoedSlot(snap, defects, vetoReason!);
  }

  // ── Pillar 1: Lagna Strength (0-30) ──
  const lagnaScore = scoreLagnaPillar(snap, strengths, defects);

  // ── Pillar 2: Moon Strength (0-25) ──
  const moonScore = scoreMoonPillar(snap, strengths);

  // ── Pillar 3: Benefic/Malefic Distribution (0-20) ──
  const distScore = scoreDistribution(snap, strengths);

  // ── Pillar 4: Dasha Trajectory (0-15) ──
  const { dashaScore, dashaInfo } = scoreDasha(snap, strengths);

  const breakdown: PillarBreakdown = {
    lagna: lagnaScore,
    moon: moonScore,
    distribution: distScore,
    dasha: dashaScore,
    defects: defectScore,
  };

  const total = lagnaScore + moonScore + distScore + dashaScore + defectScore;
  const score = Math.max(0, Math.min(100, Math.round(total)));

  return {
    date: '', time: '', endTime: '', // filled by scanner
    score,
    grade: getGrade(score),
    pillarBreakdown: breakdown,
    strengths,
    defects,
    dashaInfo,
    lagnaSign: snap.lagnaSign,
    lagnaSignName: RASHIS[snap.lagnaSign - 1]?.name ?? { en: '?', hi: '?' },
    lagnaLordId: snap.lagnaLordId,
    moonSign: snap.moonSign,
    moonNakshatra: snap.moonNakshatraId,
    moonNakshatraName: NAKSHATRAS[snap.moonNakshatraId - 1]?.name ?? { en: '?', hi: '?' },
    yogas: [], // filled by scanner if full kundali available
    panchang: { tithi: { en: '', hi: '' }, nakshatra: { en: '', hi: '' }, yoga: { en: '', hi: '' }, karana: { en: '', hi: '' } }, // filled by scanner
    isVetoed: false,
  };
}

// ─── Pillar Scorers ─────────────────────────────────────────────────────────

function scoreLagnaPillar(snap: ChartSnapshot, strengths: ChartStrength[], defects: ChartDefect[]): number {
  let score = 0;

  // 1. Lagna lord dignity (0-10)
  const dignity = getDignityScore(snap.lagnaLordId, snap.lagnaLordSign);
  score += dignity;
  if (dignity >= 8) strengths.push({ id: 'lagna_lord_strong', label: { en: 'Lagna lord in strong dignity', hi: 'लग्नेश बलवान गरिमा में' }, points: dignity, pillar: 'lagna', source: 'BPHS Ch.3-4' });

  // 2. Lagna lord house placement (0-5)
  const houseScore = LAGNA_LORD_HOUSE_SCORE[snap.lagnaLordHouse] ?? 0;
  score += houseScore;
  if (houseScore >= 4) strengths.push({ id: 'lagna_lord_kendra_trikona', label: { en: `Lagna lord in ${ordinal(snap.lagnaLordHouse)} house`, hi: `लग्नेश ${snap.lagnaLordHouse}वें भाव में` }, points: houseScore, pillar: 'lagna', source: 'BPHS Ch.6' });

  // 3. Benefic in lagna (0-5)
  const beneficInLagna = snap.planets.filter(p => p.house === 1 && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && isWaxingMoon(snap.tithiNumber))));
  if (beneficInLagna.length > 0) {
    const best = beneficInLagna[0];
    const pts = best.id === 4 ? 5 : best.id === 5 ? 4 : best.id === 3 ? 3 : 2;
    score += pts;
    strengths.push({ id: 'benefic_in_lagna', label: { en: 'Benefic planet in ascendant', hi: 'शुभ ग्रह लग्न में' }, points: pts, pillar: 'lagna', source: 'Prasna Marga Ch.9' });
  }

  // 4. Malefic in lagna penalty (0 or -4)
  const maleficInLagna = snap.planets.filter(p => p.house === 1 && NATURAL_MALEFICS.has(p.id));
  if (maleficInLagna.length > 0 && beneficInLagna.length === 0) {
    // Check if Jupiter aspects lagna (houses 5,7,9 from Jupiter)
    const jupiterAspectsLagna = snap.planets.some(p => p.id === 4 && planetAspectsHouse(4, p.house, 1));
    if (!jupiterAspectsLagna) {
      score -= 4;
      defects.push({ id: 'malefic_in_lagna', label: { en: 'Malefic in ascendant without benefic aspect', hi: 'शुभ दृष्टि के बिना अशुभ ग्रह लग्न में' }, deduction: 4, isVeto: false, source: 'Prasna Marga Ch.9' });
    }
  }

  // 5. Pushkar Navamsha lagna (0-3)
  if (isInPushkarNavamsha(snap.lagnaSign, snap.lagnaDegreesInSign)) {
    score += 3;
    strengths.push({ id: 'pushkar_lagna', label: { en: 'Ascendant in Pushkar Navamsha', hi: 'लग्न पुष्कर नवांश में' }, points: 3, pillar: 'lagna', source: 'Saravali' });
  }

  // 6. Sandhi lagna buffer (0-3)
  const distFromBoundary = Math.min(snap.lagnaDegreesInSign, 30 - snap.lagnaDegreesInSign);
  const sandhiScore = distFromBoundary >= 2 ? 3 : distFromBoundary >= 1 ? 1 : 0;
  score += sandhiScore;
  if (sandhiScore === 0) {
    defects.push({ id: 'sandhi_lagna', label: { en: 'Ascendant too close to sign boundary (sandhi)', hi: 'लग्न राशि संधि के बहुत करीब' }, deduction: 3, isVeto: false, source: 'Practitioner consensus' });
  }

  return Math.max(0, Math.min(30, score));
}

function scoreMoonPillar(snap: ChartSnapshot, strengths: ChartStrength[]): number {
  let score = 0;

  // 1. Moon's house from lagna (0-8)
  const houseScore = MOON_HOUSE_SCORE[snap.moonHouse] ?? 0;
  score += houseScore;
  if (houseScore >= 7) strengths.push({ id: 'moon_good_house', label: { en: `Moon in ${ordinal(snap.moonHouse)} house`, hi: `चन्द्र ${snap.moonHouse}वें भाव में` }, points: houseScore, pillar: 'moon', source: 'Muhurta Chintamani' });

  // 2. Paksha Bala (0-5)
  const pakshaScore = getPakshaScore(snap.tithiNumber);
  score += pakshaScore;

  // 3. Nakshatra gana quality (0-5)
  const gana = NAKSHATRA_GANA[snap.moonNakshatraId] ?? 'manushya';
  const ganaScore = gana === 'deva' ? 5 : gana === 'manushya' ? 3 : 1;
  score += ganaScore;

  // 4. Janma Nakshatra Dosha (0-4)
  const doshaEntry = JANMA_NAKSHATRA_DOSHAS.find(d =>
    d.nakshatraId === snap.moonNakshatraId &&
    (d.problematicPada === null || d.problematicPada === snap.moonNakshatraPada)
  );
  if (!doshaEntry) {
    score += 4; // No dosha — full points
  } else if (doshaEntry.severity === 'severe') {
    score += 0; // Problematic pada
  } else {
    score += 2; // Moderate — dosha present but not in worst pada
  }

  // 5. Jupiter aspecting Moon (0-3)
  const jupiterAspectsMoon = snap.planets.some(p => p.id === 4 && planetAspectsHouse(4, p.house, snap.moonHouse));
  if (jupiterAspectsMoon) {
    score += 3;
    strengths.push({ id: 'jupiter_aspects_moon', label: { en: 'Jupiter aspects Moon', hi: 'बृहस्पति की चन्द्र पर दृष्टि' }, points: 3, pillar: 'moon', source: 'Prasna Marga Ch.9' });
  }

  return Math.max(0, Math.min(25, score));
}

function scoreDistribution(snap: ChartSnapshot, strengths: ChartStrength[]): number {
  let score = 0;
  const waxing = isWaxingMoon(snap.tithiNumber);

  // 1. Benefics in kendras (0-8)
  const kendras = [1, 4, 7, 10];
  const beneficsInKendras = snap.planets.filter(p =>
    kendras.includes(p.house) && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && waxing))
  ).length;
  const kendraScore = Math.min(8, beneficsInKendras * 2.5);
  score += kendraScore;
  if (kendraScore >= 5) strengths.push({ id: 'benefics_kendras', label: { en: `${beneficsInKendras} benefic(s) in kendras`, hi: `केन्द्र में ${beneficsInKendras} शुभ ग्रह` }, points: Math.round(kendraScore), pillar: 'distribution', source: 'BPHS Ch.11' });

  // 2. Benefics in trikonas (0-4)
  const trikonas = [5, 9];
  const beneficsInTrikonas = snap.planets.filter(p =>
    trikonas.includes(p.house) && (NATURAL_BENEFICS.has(p.id) || (p.id === 1 && waxing))
  ).length;
  const trikonaScore = Math.min(4, beneficsInTrikonas * 2);
  score += trikonaScore;

  // 3. Malefics in upachaya (0-4)
  const upachaya = [3, 6, 11];
  const maleficsInUpachaya = snap.planets.filter(p =>
    upachaya.includes(p.house) && NATURAL_MALEFICS.has(p.id)
  ).length;
  const upachayaScore = Math.min(4, maleficsInUpachaya * 2);
  score += upachayaScore;

  // 4. 8th house clean (0-4)
  const in8th = snap.planets.filter(p => p.house === 8);
  const eighth = in8th.length === 0 ? 4 : in8th.every(p => NATURAL_BENEFICS.has(p.id)) ? 2 : 0;
  score += eighth;
  if (eighth === 4) strengths.push({ id: 'clean_8th', label: { en: 'Empty 8th house', hi: 'खाली अष्टम भाव' }, points: 4, pillar: 'distribution', source: 'Muhurta Chintamani' });

  return Math.max(0, Math.min(20, score));
}

function scoreDasha(snap: ChartSnapshot, strengths: ChartStrength[]): { dashaScore: number; dashaInfo: BirthDashaInfo } {
  // Determine nakshatra lord = maha dasha lord at birth
  const nakshatraIdx = snap.moonNakshatraId - 1; // 0-indexed
  const lord = NAKSHATRA_LORDS[nakshatraIdx];
  const totalYears = DASHA_TOTAL_YEARS[lord];

  // Remaining dasha = totalYears × (1 - fraction of nakshatra traversed)
  const nakshatraSpan = 360 / 27;
  const posInNakshatra = (snap.moonSidDeg % nakshatraSpan) / nakshatraSpan;
  const remainingYears = totalYears * (1 - posInNakshatra);

  // Base score from lord quality
  const baseScore = DASHA_LORD_BIRTH_SCORE[lord] ?? 3;

  // Balance multiplier: full score only if ≥50% of dasha remains
  const balanceMult = Math.min(1.0, remainingYears / (totalYears * 0.5));

  const dashaScore = Math.min(15, Math.round(baseScore * balanceMult * 1.5));

  if (dashaScore >= 10) {
    strengths.push({ id: 'strong_dasha', label: { en: `Starts in ${lord} Mahadasha (${remainingYears.toFixed(1)} yrs)`, hi: `${lord} महादशा से प्रारम्भ (${remainingYears.toFixed(1)} वर्ष)` }, points: dashaScore, pillar: 'dasha', source: 'BPHS Dasha chapters' });
  }

  return {
    dashaScore,
    dashaInfo: {
      lord,
      lordId: LORD_NAME_TO_ID[lord] ?? 0,
      totalYears,
      remainingYears: Math.round(remainingYears * 10) / 10,
      score: dashaScore,
    },
  };
}

function scoreDefects(snap: ChartSnapshot, defects: ChartDefect[]): { defectScore: number; isVetoed: boolean; vetoReason?: LocaleText } {
  let base = 10;

  // ── Hard veto: Gandanta Moon ──
  if (isInGandanta(snap.moonSidDeg)) {
    defects.push({ id: 'gandanta_moon', label: { en: 'Moon in Gandanta zone — avoid', hi: 'चन्द्र गंडान्त क्षेत्र में — टालें' }, deduction: 10, isVeto: true, source: 'Muhurta Chintamani' });
    return { defectScore: 0, isVetoed: true, vetoReason: { en: 'Moon in Gandanta — birth at water-fire sign junction is classically prohibited', hi: 'चन्द्र गंडान्त में — जल-अग्नि राशि संधि पर जन्म शास्त्रीय रूप से निषिद्ध' } };
  }

  // ── Kaal Sarpa check ──
  const rahuKetu = snap.planets.filter(p => p.id === 7 || p.id === 8);
  if (rahuKetu.length === 2) {
    const rahu = rahuKetu.find(p => p.id === 7)!;
    const ketu = rahuKetu.find(p => p.id === 8)!;
    const otherPlanets = snap.planets.filter(p => p.id !== 7 && p.id !== 8);
    if (otherPlanets.length > 0 && isKaalSarpa(rahu.longitude, ketu.longitude, otherPlanets)) {
      base -= 8;
      defects.push({ id: 'kaal_sarpa', label: { en: 'Kaal Sarpa Yoga — all planets between Rahu-Ketu axis', hi: 'काल सर्प योग — सभी ग्रह राहु-केतु अक्ष के बीच' }, deduction: 8, isVeto: false, source: 'Multiple classical sources' });
    }
  }

  // ── Lagna lord combust ──
  const lagnaLordPlanet = snap.planets.find(p => p.id === snap.lagnaLordId);
  if (lagnaLordPlanet && snap.lagnaLordId !== 0 && snap.lagnaLordId !== 7 && snap.lagnaLordId !== 8) {
    const orb = COMBUSTION_ORBS[snap.lagnaLordId] ?? 12;
    const adjustedOrb = (snap.lagnaLordId === 3 || snap.lagnaLordId === 5) && lagnaLordPlanet.isRetrograde ? orb - 2 : orb;
    const dist = Math.abs(lagnaLordPlanet.longitude - snap.sunSidDeg);
    const angDist = dist > 180 ? 360 - dist : dist;
    if (angDist < adjustedOrb) {
      base -= 6;
      defects.push({ id: 'lagna_lord_combust', label: { en: 'Lagna lord combust by Sun', hi: 'लग्नेश सूर्य से अस्त' }, deduction: 6, isVeto: false, source: 'BPHS Ch.3' });
    }
  }

  // ── Rahu/Ketu in lagna or 7th ──
  const rahuKetuInLagna = snap.planets.filter(p => (p.id === 7 || p.id === 8) && p.house === 1);
  if (rahuKetuInLagna.length > 0) {
    base -= 5;
    defects.push({ id: 'rahu_ketu_lagna', label: { en: 'Rahu/Ketu in ascendant', hi: 'राहु/केतु लग्न में' }, deduction: 5, isVeto: false, source: 'Prasna Marga' });
  }
  const rahuKetuIn7 = snap.planets.filter(p => (p.id === 7 || p.id === 8) && p.house === 7);
  if (rahuKetuIn7.length > 0) {
    base -= 4;
    defects.push({ id: 'rahu_ketu_7th', label: { en: 'Rahu/Ketu in 7th house', hi: 'राहु/केतु सप्तम भाव में' }, deduction: 4, isVeto: false, source: 'Prasna Marga' });
  }

  // ── Saturn in lagna without Jupiter aspect ──
  const saturnInLagna = snap.planets.some(p => p.id === 6 && p.house === 1);
  if (saturnInLagna) {
    const jupAspects = snap.planets.some(p => p.id === 4 && planetAspectsHouse(4, p.house, 1));
    if (!jupAspects) {
      base -= 5;
      defects.push({ id: 'saturn_in_lagna', label: { en: 'Saturn in ascendant without Jupiter\'s aspect', hi: 'बृहस्पति दृष्टि के बिना शनि लग्न में' }, deduction: 5, isVeto: false, source: 'Prasna Marga Ch.9' });
    }
  }

  // ── Vishti (Bhadra) karana ──
  // Karana 7 = Vishti/Bhadra (repeats every 7 in the 60-karana cycle)
  if (snap.karanaNumber === 7) {
    base -= 3;
    defects.push({ id: 'vishti_karana', label: { en: 'Vishti (Bhadra) karana active', hi: 'विष्टि (भद्रा) करण सक्रिय' }, deduction: 3, isVeto: false, source: 'Kalaprakashika' });
  }

  // ── Vyatipata (17) or Vaidhriti (27) yoga ──
  if (snap.yogaNumber === 17 || snap.yogaNumber === 27) {
    base -= 3;
    defects.push({ id: 'inauspicious_yoga', label: { en: 'Vyatipata/Vaidhriti yoga active', hi: 'व्यतिपात/वैधृति योग सक्रिय' }, deduction: 3, isVeto: false, source: 'Kalaprakashika' });
  }

  // ── Badhakesh in lagna ──
  try {
    const badhakPlanet = getBadhakeshPlanet(snap.lagnaSign);
    const badhakInLagna = snap.planets.some(p => p.id === badhakPlanet && (p.house === 1 || aspectsHouse(p.house, 1)));
    if (badhakInLagna) {
      base -= 3;
      defects.push({ id: 'badhakesh_lagna', label: { en: 'Badhakesh (obstruction lord) influences ascendant', hi: 'बाधकेश लग्न को प्रभावित करता है' }, deduction: 3, isVeto: false, source: 'Practitioner tradition' });
    }
  } catch {
    // Skip if dignities not available
  }

  // ── Mars in 8th ──
  if (snap.planets.some(p => p.id === 2 && p.house === 8)) {
    base -= 2;
    defects.push({ id: 'mars_in_8th', label: { en: 'Mars in 8th house', hi: 'मंगल अष्टम भाव में' }, deduction: 2, isVeto: false, source: 'General classical' });
  }

  return { defectScore: Math.max(0, base), isVetoed: false };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getDignityScore(planetId: number, sign: number): number {
  if (isExalted(planetId, sign)) return 10;
  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === sign) return 9;
  if (isOwnSign(planetId, sign)) return 8;
  // Friend/neutral/enemy requires full friendship table — approximate:
  // For the lagna lord, own/exalted/moolatrikona are the key differentiators.
  // Neutral = 4, everything else = 2
  if (isDebilitated(planetId, sign)) return 0;
  return 4; // Neutral fallback
}

function isWaxingMoon(tithiNumber: number): boolean {
  return tithiNumber >= 1 && tithiNumber <= 15; // Shukla Paksha
}

function getPakshaScore(tithiNumber: number): number {
  if (tithiNumber >= 2 && tithiNumber <= 10) return 5;   // Shukla Dwitiya-Dashami
  if (tithiNumber >= 11 && tithiNumber <= 15) return 4;  // Shukla Ekadashi-Purnima
  if (tithiNumber >= 16 && tithiNumber <= 20) return 3;  // Krishna Pratipada-Panchami
  if (tithiNumber >= 21 && tithiNumber <= 25) return 1;  // Krishna Shashthi-Dashami
  return 0; // Krishna Ekadashi-Amavasya or Pratipada
}

/** Full Vedic aspects including Mars (4,8), Jupiter (5,9), Saturn (3,10) special aspects.
 *  CRITICAL: Jupiter's 5th and 9th aspects are essential for birth-election scoring —
 *  a simplified 7th-only check would miss Jupiter aspecting lagna from houses 5 and 9. */
function planetAspectsHouse(planetId: number, planetHouse: number, targetHouse: number): boolean {
  const offset = ((targetHouse - planetHouse + 12) % 12) || 12;
  if (offset === 7) return true; // All planets aspect 7th
  if (planetId === 2 && (offset === 4 || offset === 8)) return true; // Mars
  if (planetId === 4 && (offset === 5 || offset === 9)) return true; // Jupiter
  if (planetId === 6 && (offset === 3 || offset === 10)) return true; // Saturn
  return false;
}

function isInPushkarNavamsha(sign: number, degInSign: number): boolean {
  return PUSHKAR_NAVAMSHA_RANGES.some(r => r.sign === sign && degInSign >= r.startDeg && degInSign < r.endDeg);
}

function isKaalSarpa(rahuLong: number, ketuLong: number, others: Array<{ longitude: number }>): boolean {
  // Check if all planets are on one side of the Rahu-Ketu axis
  const allOnOneSide = others.every(p => isLongitudeBetween(p.longitude, rahuLong, ketuLong))
    || others.every(p => isLongitudeBetween(p.longitude, ketuLong, rahuLong));
  return allOnOneSide;
}

function isLongitudeBetween(deg: number, start: number, end: number): boolean {
  if (start < end) return deg >= start && deg <= end;
  return deg >= start || deg <= end; // Wraps around 0°
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
}

function getGrade(score: number): SlotGrade {
  if (score >= 75) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 45) return 'fair';
  if (score >= 30) return 'marginal';
  return 'poor';
}

function buildVetoedSlot(snap: ChartSnapshot, defects: ChartDefect[], vetoReason: LocaleText): ScoredBirthSlot {
  return {
    date: '', time: '', endTime: '',
    score: 0,
    grade: 'vetoed',
    pillarBreakdown: { lagna: 0, moon: 0, distribution: 0, dasha: 0, defects: 0 },
    strengths: [],
    defects,
    dashaInfo: { lord: '', lordId: 0, totalYears: 0, remainingYears: 0, score: 0 },
    lagnaSign: snap.lagnaSign,
    lagnaSignName: RASHIS[snap.lagnaSign - 1]?.name ?? { en: '?', hi: '?' },
    lagnaLordId: snap.lagnaLordId,
    moonSign: snap.moonSign,
    moonNakshatra: snap.moonNakshatraId,
    moonNakshatraName: NAKSHATRAS[snap.moonNakshatraId - 1]?.name ?? { en: '?', hi: '?' },
    yogas: [],
    panchang: { tithi: { en: '', hi: '' }, nakshatra: { en: '', hi: '' }, yoga: { en: '', hi: '' }, karana: { en: '', hi: '' } },
    isVetoed: true,
    vetoReason,
  };
}
```

- [ ] **Step 4: Run tests — expect passes**

```bash
npx vitest run src/lib/__tests__/caesarean-scorer.test.ts
```

- [ ] **Step 5: Run type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/caesarean/scorer.ts src/lib/__tests__/caesarean-scorer.test.ts
git commit -m "feat(caesarean): 5-pillar birth chart scoring engine with classical rules"
```

---

### Task 3: Scanner (date range iteration + chart computation)

**Files:**
- Create: `src/lib/caesarean/scanner.ts`
- Test: `src/lib/__tests__/caesarean-scanner.test.ts`

- [ ] **Step 1: Write failing test**

```ts
// src/lib/__tests__/caesarean-scanner.test.ts
import { describe, it, expect } from 'vitest';
import { scanCaesareanSlots } from '@/lib/caesarean/scanner';

describe('scanCaesareanSlots', () => {
  it('returns scored slots within operating hours', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-15', // Single day
      lat: 46.4667,  // Corseaux
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 9,
      opEnd: 15,
      windowMinutes: 60, // 1-hour windows for faster test
      maxResults: 10,
    });
    expect(result.slots.length).toBeGreaterThan(0);
    expect(result.slots.length).toBeLessThanOrEqual(10);
    // All slots within operating hours
    for (const slot of result.slots) {
      const hour = parseInt(slot.time.split(':')[0], 10);
      expect(hour).toBeGreaterThanOrEqual(9);
      expect(hour).toBeLessThan(15);
    }
    // Sorted by score descending
    for (let i = 1; i < result.slots.length; i++) {
      expect(result.slots[i - 1].score).toBeGreaterThanOrEqual(result.slots[i].score);
    }
    // Each slot has a valid grade
    for (const slot of result.slots) {
      expect(['excellent', 'good', 'fair', 'marginal', 'poor', 'vetoed']).toContain(slot.grade);
    }
    // Meta populated
    expect(result.meta.totalSlotsEvaluated).toBeGreaterThan(0);
    expect(result.meta.computeTimeMs).toBeGreaterThanOrEqual(0);
  }, 30000); // Allow up to 30s — chart computation is CPU-heavy

  it('scans a 3-day range and returns ranked results', () => {
    const result = scanCaesareanSlots({
      startDate: '2026-05-15',
      endDate: '2026-05-17',
      lat: 46.4667,
      lng: 6.8333,
      timezone: 'Europe/Zurich',
      opStart: 8,
      opEnd: 17,
      windowMinutes: 60,
      maxResults: 5,
    });
    expect(result.slots.length).toBeLessThanOrEqual(5);
    // Should have slots from multiple days
    const dates = new Set(result.slots.map(s => s.date));
    expect(dates.size).toBeGreaterThanOrEqual(1);
  }, 60000);
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npx vitest run src/lib/__tests__/caesarean-scanner.test.ts
```

- [ ] **Step 3: Implement scanner.ts**

The scanner iterates the date range, generates time windows within operating hours, computes a lightweight chart snapshot for each window midpoint, and passes it to the scorer.

Key design: instead of calling the full `generateKundali()` (which computes dashas, yogas, shadbala, etc. — overkill for scoring), we compute only what the scorer needs:
- Ascendant from `calculateAscendant()` in `kundali-calc.ts`
- Planet positions from `getPlanetaryPositions()` in `astronomical.ts`
- Panchang snapshot from `getPanchangSnapshot()` in `muhurta/panchang-snapshot.ts`
- Moon sidereal position from the planet positions
- Nakshatra/pada from Moon position

```ts
// src/lib/caesarean/scanner.ts

/**
 * Caesarean Birth Time Scanner
 *
 * Iterates a date range within operating-hour constraints, computes a
 * lightweight chart snapshot for each 15-min window, and scores it via
 * the 5-pillar scorer. Returns ranked slots sorted by score descending.
 *
 * Performance: for a 7-day range at 15-min resolution with 8am–5pm hours,
 * that's 7 × 36 = 252 evaluations. Each evaluation computes ascendant +
 * planet positions + panchang snapshot — roughly 2-5ms each on modern
 * hardware, so total scan time is ~0.5-1.2 seconds.
 */

import { calculateAscendant } from '@/lib/ephem/kundali-calc';
import {
  dateToJD,
  getAyanamsha,
  getPlanetaryPositions,
  toSidereal,
  getRashiNumber,
} from '@/lib/ephem/astronomical';
import { getPanchangSnapshot } from '@/lib/muhurta/panchang-snapshot';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { scoreBirthSlot } from './scorer';
import type { ChartSnapshot } from './scorer';
import type { CaesareanScanInput, CaesareanScanResult, ScoredBirthSlot } from './types';
import { SIGN_LORDS } from '@/lib/constants/dignities';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { TITHIS } from '@/lib/constants/tithis';
import { YOGAS } from '@/lib/constants/yogas';
import { KARANAS } from '@/lib/constants/karanas';

export function scanCaesareanSlots(input: CaesareanScanInput): CaesareanScanResult {
  const startTime = Date.now();
  const {
    startDate, endDate, lat, lng, timezone,
    opStart, opEnd,
    windowMinutes = 15,
    maxResults = 20,
  } = input;

  const allSlots: ScoredBirthSlot[] = [];
  let totalEvaluated = 0;

  // Iterate each day in the range
  const start = new Date(startDate);
  const end = new Date(endDate);
  const current = new Date(start);

  while (current <= end) {
    const y = current.getFullYear();
    const m = current.getMonth() + 1;
    const d = current.getDate();
    const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

    // Resolve timezone offset for this specific date (DST-aware)
    const tz = getUTCOffsetForDate(y, m, d, timezone);
    const jdNoon = dateToJD(y, m, d, 12);
    const ayanamsha = getAyanamsha(jdNoon, 'lahiri');

    // Planet positions at noon (sufficient for house placement — planets move slowly)
    const noonPlanets = getPlanetaryPositions(jdNoon);

    // Iterate time windows within operating hours
    for (let hour = opStart; hour < opEnd; hour += windowMinutes / 60) {
      const windowStartHour = hour;
      const windowEndHour = Math.min(hour + windowMinutes / 60, opEnd);
      const midHour = (windowStartHour + windowEndHour) / 2;

      // Convert local time to UT for JD computation
      const midHourUT = midHour - tz;
      const midJD = jdNoon + (midHourUT - 12) / 24;

      // Compute ascendant at midpoint
      const tropicalAsc = calculateAscendant(midJD, lat, lng);
      const sidAsc = toSidereal(tropicalAsc, ayanamsha);
      const lagnaSign = getRashiNumber(sidAsc);
      const lagnaDegreesInSign = sidAsc % 30;
      const lagnaLordId = SIGN_LORDS[lagnaSign];

      // Build planet house placements (whole-sign from lagna)
      const planetSnaps = noonPlanets.map(p => {
        const sidLong = toSidereal(p.longitude, ayanamsha);
        const sign = getRashiNumber(sidLong);
        const house = ((sign - lagnaSign + 12) % 12) + 1;
        return {
          id: p.id,
          sign,
          house,
          longitude: sidLong,
          isRetrograde: p.speed < 0,
        };
      });

      // Moon data (Moon moves ~13°/day, so noon position is ±6.5° — acceptable for 15-min windows
      // when we refine with the snapshot below)
      const moonPlanet = noonPlanets.find(p => p.id === 1);
      // For more accurate Moon, use the panchang snapshot at midpoint
      const snap = getPanchangSnapshot(midJD, lat, lng);
      const moonSidDeg = snap.moonSid;
      const moonSign = snap.moonSign;
      const moonHouse = ((moonSign - lagnaSign + 12) % 12) + 1;
      const moonNakshatraId = Math.floor(moonSidDeg / (360 / 27)) + 1;
      const moonPadaFraction = (moonSidDeg % (360 / 27)) / (360 / 27 / 4);
      const moonNakshatraPada = Math.floor(moonPadaFraction) + 1;

      // Lagna lord placement
      const lagnaLordSnap = planetSnaps.find(p => p.id === lagnaLordId);
      const lagnaLordSign = lagnaLordSnap?.sign ?? lagnaSign;
      const lagnaLordHouse = lagnaLordSnap?.house ?? 1;

      // Sun position for combustion check
      const sunPlanet = planetSnaps.find(p => p.id === 0);
      const sunSidDeg = sunPlanet?.longitude ?? 0;

      const chartSnap: ChartSnapshot = {
        lagnaSign,
        lagnaDegreesInSign,
        lagnaLordId,
        lagnaLordSign,
        lagnaLordHouse,
        moonSign,
        moonHouse,
        moonSidDeg,
        moonNakshatraId: Math.max(1, Math.min(27, moonNakshatraId)),
        moonNakshatraPada: Math.max(1, Math.min(4, moonNakshatraPada)),
        planets: planetSnaps,
        tithiNumber: snap.tithi,
        yogaNumber: snap.yoga,
        karanaNumber: snap.karana,
        sunSidDeg,
      };

      const scored = scoreBirthSlot(chartSnap);

      // Fill in time data
      scored.date = dateStr;
      scored.time = formatTime(windowStartHour);
      scored.endTime = formatTime(windowEndHour);

      // Fill in panchang display names
      scored.panchang = {
        tithi: TITHIS[snap.tithi - 1]?.name ?? { en: `Tithi ${snap.tithi}`, hi: `तिथि ${snap.tithi}` },
        nakshatra: NAKSHATRAS[moonNakshatraId - 1]?.name ?? { en: `Nakshatra ${moonNakshatraId}`, hi: `नक्षत्र ${moonNakshatraId}` },
        yoga: YOGAS[snap.yoga - 1]?.name ?? { en: `Yoga ${snap.yoga}`, hi: `योग ${snap.yoga}` },
        karana: KARANAS[snap.karana - 1]?.name ?? { en: `Karana ${snap.karana}`, hi: `करण ${snap.karana}` },
      };

      allSlots.push(scored);
      totalEvaluated++;
    }

    current.setDate(current.getDate() + 1);
  }

  // Sort by score descending, take top N
  allSlots.sort((a, b) => b.score - a.score);
  const topSlots = allSlots.slice(0, maxResults);

  return {
    slots: topSlots,
    meta: {
      dateRange: { start: startDate, end: endDate },
      location: { lat, lng },
      operatingHours: { start: opStart, end: opEnd },
      totalSlotsEvaluated: totalEvaluated,
      computeTimeMs: Date.now() - startTime,
    },
  };
}

function formatTime(hour: number): string {
  const h = Math.floor(hour);
  const m = Math.round((hour - h) * 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/lib/__tests__/caesarean-scanner.test.ts
```

- [ ] **Step 5: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/caesarean/scanner.ts src/lib/__tests__/caesarean-scanner.test.ts
git commit -m "feat(caesarean): date-range scanner with lightweight chart computation"
```

---

### Task 4: API Route

**Files:**
- Create: `src/app/api/caesarean-scan/route.ts`

- [ ] **Step 1: Implement API route**

```ts
// src/app/api/caesarean-scan/route.ts

import { NextResponse } from 'next/server';
import { scanCaesareanSlots } from '@/lib/caesarean';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { startDate, endDate, lat, lng, timezone, opStart, opEnd, maxResults } = body;

    // ── Input validation ──
    if (!startDate || !endDate || !lat || !lng || !timezone) {
      return NextResponse.json({ error: 'Missing required fields: startDate, endDate, lat, lng, timezone' }, { status: 400 });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate) || !/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
      return NextResponse.json({ error: 'Invalid date format. Use YYYY-MM-DD.' }, { status: 400 });
    }
    if (typeof lat !== 'number' || typeof lng !== 'number' || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return NextResponse.json({ error: 'Invalid coordinates.' }, { status: 400 });
    }
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays < 0 || diffDays > 30) {
      return NextResponse.json({ error: 'Date range must be 1-30 days.' }, { status: 400 });
    }
    const opStartHour = typeof opStart === 'number' ? opStart : 8;
    const opEndHour = typeof opEnd === 'number' ? opEnd : 17;
    if (opStartHour < 0 || opStartHour > 23 || opEndHour < 1 || opEndHour > 24 || opStartHour >= opEndHour) {
      return NextResponse.json({ error: 'Invalid operating hours.' }, { status: 400 });
    }

    const result = scanCaesareanSlots({
      startDate,
      endDate,
      lat,
      lng,
      timezone: String(timezone).trim(),
      opStart: opStartHour,
      opEnd: opEndHour,
      windowMinutes: 15,
      maxResults: typeof maxResults === 'number' ? Math.min(maxResults, 50) : 20,
    });

    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'private, max-age=300' },
    });
  } catch (err) {
    console.error('[caesarean-scan] error:', err);
    return NextResponse.json({ error: 'Scan failed. Please try again.' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Commit**

```bash
git add src/app/api/caesarean-scan/route.ts
git commit -m "feat(caesarean): API route for birth time scanning"
```

---

### Task 5: Tool Page (UI)

**Files:**
- Create: `src/app/[locale]/caesarean-muhurta/page.tsx`
- Create: `src/app/[locale]/caesarean-muhurta/layout.tsx`
- Create: `src/app/[locale]/caesarean-muhurta/components/ScanForm.tsx`
- Create: `src/app/[locale]/caesarean-muhurta/components/SlotCard.tsx`
- Create: `src/app/[locale]/caesarean-muhurta/components/ClassicalTips.tsx`
- Create: `src/messages/pages/caesarean-muhurta.json`

This is the largest task. The UI follows the muhurta-ai page pattern: a `ScanForm` at top, results below as ranked `SlotCard` components, and a collapsible `ClassicalTips` section explaining the scoring rules.

- [ ] **Step 1: Create i18n message file**

Create `src/messages/pages/caesarean-muhurta.json` with all UI strings for en and hi (other locales use en fallback). Include: page title, form labels, grade labels, pillar names, tip section headings, and all 12+ classical rule explanations for the collapsible tips.

- [ ] **Step 2: Create ScanForm component**

Inputs: date range picker (start/end), location (reads from `useLocationStore`), operating hours (two dropdowns: start 6am–12pm, end 12pm–8pm), scan button. Calls the API on submit.

- [ ] **Step 3: Create SlotCard component**

Displays one ranked slot: rank number, date/time, score badge (colour-coded by grade), lagna sign with icon, Moon nakshatra with icon, dasha info, 5-pillar bar chart, strengths list (green), defects list (red). Expandable to show full panchang details.

Uses the purple mega card gradient: `bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl`.

- [ ] **Step 4: Create ClassicalTips component**

Collapsible accordion section with 5 groups (one per pillar) + a "Structural Defects" group. Each group has 3-6 expandable items explaining individual rules with classical source citations. Uses framer-motion `AnimatePresence` + `motion.div` with `height: 0 → 'auto'` animation (the standard learn-page pattern — no separate accordion component exists).

- [ ] **Step 5: Create layout.tsx with SEO metadata**

Follow the `muhurta-ai/layout.tsx` pattern: `generateMetadata` from `PAGE_META`, JSON-LD (Tool + Breadcrumb + FAQ).

- [ ] **Step 6: Create page.tsx**

Client component. Orchestrates: `ScanForm` → API call → result state → `SlotCard` list → `ClassicalTips` → editorial SEO section with `InfoBlock` and cross-links to `/learn/caesarean-muhurta`, `/muhurta-ai`, `/charts`.

- [ ] **Step 7: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 8: Add ethical disclaimer**

Add a disclaimer at the top of the page (subtle, below the title, in `text-text-secondary text-sm`):
"This tool provides astrological guidance based on classical Jyotish principles. It is for educational and reference purposes. Always follow your doctor's medical advice for delivery timing."

- [ ] **Step 9: Test in browser**

Start dev server, navigate to `/caesarean-muhurta`. Verify:
- Form renders, location auto-populates from store
- Scan produces ranked results
- Slot cards show all 5 pillars with colour-coded scores
- Classical tips expand/collapse smoothly
- Mobile responsive
- Console has no errors

- [ ] **Step 9: Commit**

```bash
git add src/app/\\[locale\\]/caesarean-muhurta/ src/messages/pages/caesarean-muhurta.json
git commit -m "feat(caesarean): tool page with scan form, slot cards, and classical tips"
```

---

### Task 6: Learn Page

**Files:**
- Create: `src/app/[locale]/learn/caesarean-muhurta/page.tsx`
- Create: `src/messages/learn/caesarean-muhurta.json`

- [ ] **Step 1: Create learn i18n messages**

Full content for the learn page in en and hi. Cover: introduction, the 5 pillars explained in depth, all classical sources cited, the janma nakshatra dosha table, gandanta explanation, dasha trajectory importance, practical guidance for families, and a FAQ-style section.

- [ ] **Step 2: Create learn page**

Follow the `learn/muhurtas/page.tsx` pattern: `'use client'`, `useLocale()`, `lt()` translations, `LessonSection`/`KeyTakeaway`/`WhyItMatters`/`BeginnerNote`/`ClassicalReference` components, Explore Further links grid at the bottom.

Sections:
1. **Introduction** — What is caesarean muhurta? Why families seek it. Ethical note.
2. **The 5 Pillars** — Each pillar as its own `LessonSection` with `ClassicalReference`.
3. **Lagna Strength Deep Dive** — Dignity, house placement, Pushkar Navamsha, sandhi buffer.
4. **Moon's Role at Birth** — House placement, paksha bala, nakshatra gana, gandanta.
5. **Janma Nakshatra Doshas** — Full table with all problematic nakshatras/padas.
6. **Benefic/Malefic Distribution** — The classical ideal chart layout.
7. **Dasha Trajectory** — Why the starting dasha lord and remaining balance matter.
8. **Structural Defects** — Kaal Sarpa, combust lagna lord, Rahu/Ketu in 1/7.
9. **Practical Guidance** — Hospital constraints, ±15min buffer, what to tell the doctor.
10. **Key Takeaways** — `KeyTakeaway` summary.

- [ ] **Step 3: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 4: Test in browser**

Navigate to `/learn/caesarean-muhurta`. Verify all sections render, classical references display correctly, and Explore Further links work.

- [ ] **Step 5: Commit**

```bash
git add src/app/\\[locale\\]/learn/caesarean-muhurta/ src/messages/learn/caesarean-muhurta.json
git commit -m "feat(caesarean): learn page documenting all classical birth-election rules"
```

---

### Task 7: Integration (SEO, sitemap, nav, cross-links)

**Files:**
- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/lib/seo/faq-data.ts`
- Modify: `src/lib/seo/cross-links.ts`

- [ ] **Step 1: Add PAGE_META entries**

Add entries for `/caesarean-muhurta` and `/learn/caesarean-muhurta` to `PAGE_META` in `src/lib/seo/metadata.ts`.

- [ ] **Step 2: Add to sitemap**

Add both routes to the `routes` array in `src/app/sitemap.ts` with priority 0.7 (tool) and 0.6 (learn).

- [ ] **Step 3: Add FAQs**

Add 4-5 FAQs for `/caesarean-muhurta` in `src/lib/seo/faq-data.ts`:
- "What is caesarean muhurta?"
- "How does the birth time scorer work?"
- "Which nakshatras should be avoided for birth?"
- "Why does the starting dasha matter?"
- "How accurate is the 15-minute window?"

- [ ] **Step 4: Add cross-links**

In `src/lib/seo/cross-links.ts`, add cross-links from:
- `/muhurta-ai` → `/caesarean-muhurta`
- `/charts` (kundali) → `/caesarean-muhurta`
- `/learn/muhurtas` → `/learn/caesarean-muhurta`
- `/caesarean-muhurta` → `/muhurta-ai`, `/charts`, `/learn/caesarean-muhurta`

- [ ] **Step 5: Add to Tools hub page**

Add an entry for Caesarean Muhurta in whatever tools index/hub page lists the 12 existing tools (check `src/app/[locale]/tools/` or equivalent). This must be discoverable from the main nav — an unlinked page is a dead page.

- [ ] **Step 6: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 7: Verify integration in browser**

- Check that `/caesarean-muhurta` appears in the rendered sitemap
- Check that cross-links render on muhurta-ai and kundali pages
- Check SEO metadata via View Source on the caesarean-muhurta page

- [ ] **Step 7: Run full test suite**

```bash
npx vitest run
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/seo/metadata.ts src/app/sitemap.ts src/lib/seo/faq-data.ts src/lib/seo/cross-links.ts
git commit -m "feat(caesarean): SEO metadata, sitemap, FAQs, and cross-links"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` — 0 errors
- [ ] `npx vitest run` — all tests pass (including new caesarean tests)
- [ ] `npx next build` — 0 errors
- [ ] Browser: `/caesarean-muhurta` — scan works, slots ranked, tips expand
- [ ] Browser: `/learn/caesarean-muhurta` — all sections render
- [ ] Browser: mobile viewport — responsive layout
- [ ] Spot-check: compare top-ranked slot's lagna and Moon against manual computation
- [ ] Cross-links: visible from muhurta-ai and kundali pages

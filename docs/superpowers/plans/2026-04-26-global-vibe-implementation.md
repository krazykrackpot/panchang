# Global-Vibe Transformation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship 5 features that make Vedic astrology accessible to the global "Modern Mystic" audience without diluting precision — sidereal comparison, progressive vocabulary, cosmic archetypes, compatibility cards, and lunar lifestyle calendar.

**Architecture:** Shared infrastructure first (comparison engine, JyotishTerm component, glossary data), then features cascade: Feature 1 (sidereal comparison) ships with infra, then Features 3-5 build on the foundation. All new pages are server-rendered with client interactivity where needed. Share cards use existing Satori pipeline. No database changes, no new API dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind v4, Framer Motion, D3.js (SVG zodiac), Satori (card generation), Vitest (testing)

**Spec:** `docs/superpowers/specs/2026-04-26-global-vibe-strategy-design.md`

---

## File Map

### New Files (Create)

| File | Responsibility |
|------|---------------|
| `src/lib/ephem/comparison-engine.ts` | Tropical vs Sidereal comparison computation |
| `src/lib/constants/glossary.ts` | ~45 Jyotish term definitions (static data) |
| `src/components/ui/JyotishTerm.tsx` | Inline Sanskrit term tooltip component |
| `src/app/[locale]/tropical-compare/page.tsx` | Deep-dive comparison page |
| `src/app/[locale]/tropical-compare/layout.tsx` | Metadata for comparison page |
| `src/app/[locale]/glossary/page.tsx` | Glossary page |
| `src/app/[locale]/glossary/layout.tsx` | Metadata for glossary page |
| `src/lib/kundali/archetype-engine.ts` | Cosmic Blueprint synthesis from Shadbala/Dasha/Yogas |
| `src/lib/constants/archetype-data.ts` | Archetype definitions, traits, descriptions |
| `src/components/kundali/BlueprintTab.tsx` | Blueprint tab content for kundali page |
| `src/app/[locale]/cosmic-blueprint/page.tsx` | Standalone Blueprint page |
| `src/app/[locale]/cosmic-blueprint/layout.tsx` | Metadata for Blueprint page |
| `src/lib/constants/kuta-insights.ts` | Psychological framing for Ashta Kuta scores |
| `src/lib/constants/panchang-insights.ts` | "Why this matters" for all panchang elements |
| `src/lib/panchang/energy-score.ts` | Daily energy score (0-100) from panchang data |
| `src/app/[locale]/lunar-calendar/page.tsx` | Lunar Lifestyle month-view calendar |
| `src/app/[locale]/lunar-calendar/layout.tsx` | Metadata for lunar calendar page |
| `src/lib/__tests__/comparison-engine.test.ts` | Tests for comparison engine |
| `src/lib/__tests__/archetype-engine.test.ts` | Tests for archetype engine |
| `src/lib/__tests__/energy-score.test.ts` | Tests for energy score engine |
| `src/lib/__tests__/glossary-data.test.ts` | Tests for glossary data integrity |

### Modified Files

| File | Change |
|------|--------|
| `src/lib/shareable/card-base.ts` | Add `'discovery' \| 'blueprint' \| 'compatibility'` to CardType |
| `src/app/api/card/[type]/route.tsx` | Add rendering for 3 new card types |
| `src/app/[locale]/sign-calculator/page.tsx` | Add comparison panel below results |
| `src/app/[locale]/kundali/page.tsx` | Add 'blueprint' to tab union + tab entry + render block |
| `src/app/[locale]/matching/page.tsx` | Add share card button to results |
| `src/app/[locale]/panchang/PanchangClient.tsx` | Add insight blocks to panchang cards |
| `src/components/layout/Navbar.tsx` | Add 3 new tool links |
| `src/app/sitemap.ts` | Add 4 new page routes |
| `src/lib/seo/metadata.ts` | Add PAGE_META entries for 4 new pages |

---

## Phase 1: Foundation + Feature 1 (Sidereal vs Tropical)

### Task 1: Comparison Engine — Core Logic

**Files:**
- Create: `src/lib/ephem/comparison-engine.ts`
- Test: `src/lib/__tests__/comparison-engine.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/__tests__/comparison-engine.test.ts
import { describe, it, expect } from 'vitest';
import { compareTropicalVsSidereal } from '../ephem/comparison-engine';
import { dateToJD } from '../ephem/astronomical';

describe('compareTropicalVsSidereal', () => {
  // April 15, 1990, 10:30 UTC — Sun in late Aries tropical, should shift to Pisces sidereal
  const jd = dateToJD(1990, 4, 15, 10.5);

  it('returns 10 entries (9 planets + ascendant placeholder)', () => {
    const result = compareTropicalVsSidereal(jd);
    // 9 planets from getPlanetaryPositions
    expect(result.planets.length).toBe(9);
  });

  it('computes ayanamsha close to ~23.7° for 1990', () => {
    const result = compareTropicalVsSidereal(jd);
    expect(result.ayanamsha.value).toBeGreaterThan(23.5);
    expect(result.ayanamsha.value).toBeLessThan(24.0);
  });

  it('identifies shifted planets correctly', () => {
    const result = compareTropicalVsSidereal(jd);
    const sun = result.planets.find(p => p.planetId === 0)!;
    // Sun at ~25° Aries tropical minus ~23.7° ayanamsha = ~1.3° Aries sidereal
    // This is borderline — Sun stays in Aries in both systems for this date
    // But Moon (faster moving) is more likely to shift
    expect(typeof sun.isShifted).toBe('boolean');
    expect(sun.tropical.sign).toBeGreaterThanOrEqual(1);
    expect(sun.tropical.sign).toBeLessThanOrEqual(12);
    expect(sun.sidereal.sign).toBeGreaterThanOrEqual(1);
    expect(sun.sidereal.sign).toBeLessThanOrEqual(12);
  });

  it('shiftedCount matches actual shifted planets', () => {
    const result = compareTropicalVsSidereal(jd);
    const actualShifted = result.planets.filter(p => p.isShifted).length;
    expect(result.shiftedCount).toBe(actualShifted);
  });

  it('generates a non-empty hookLine', () => {
    const result = compareTropicalVsSidereal(jd);
    expect(result.hookLine.length).toBeGreaterThan(20);
  });

  it('includes precession data', () => {
    const result = compareTropicalVsSidereal(jd);
    expect(result.precessionData.currentAyanamsha).toBeCloseTo(result.ayanamsha.value, 1);
    expect(result.precessionData.yearlyRate).toBeGreaterThan(0.013); // ~50" per year in degrees
    expect(result.precessionData.yearlyRate).toBeLessThan(0.015);
  });

  // Edge case: planet near sign boundary
  it('handles planet at exact 0° correctly', () => {
    // Use a JD where Sun is near 0° Aries (spring equinox ~March 20)
    const equinoxJd = dateToJD(2026, 3, 20, 12);
    const result = compareTropicalVsSidereal(equinoxJd);
    const sun = result.planets.find(p => p.planetId === 0)!;
    // Tropical should be ~0° Aries, sidereal should be ~6° Pisces
    expect(sun.tropical.sign).toBe(1); // Aries
    expect(sun.sidereal.sign).toBe(12); // Pisces
    expect(sun.isShifted).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/comparison-engine.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the comparison engine**

```ts
// src/lib/ephem/comparison-engine.ts
import {
  getPlanetaryPositions,
  getAyanamsha,
  normalizeDeg,
  getRashiNumber,
  formatDegrees,
  type AyanamshaType,
} from './astronomical';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { RASHIS } from '@/lib/constants/rashis';
import { GRAHAS } from '@/lib/constants/grahas';
import type { LocaleText } from '@/types/panchang';

// --- Types ---

export interface ComparisonPlanet {
  planetId: number;
  planetName: LocaleText;
  tropical: {
    longitude: number;
    sign: number;
    signName: string;
    degreeInSign: number;
  };
  sidereal: {
    longitude: number;
    sign: number;
    signName: LocaleText;
    degreeInSign: number;
    nakshatra?: { id: number; name: LocaleText; pada: number };
  };
  isShifted: boolean;
  shiftDescription: string;
}

export interface FullComparison {
  ayanamsha: { value: number; type: string; formatted: string };
  planets: ComparisonPlanet[];
  shiftedCount: number;
  hookLine: string;
  precessionData: {
    currentAyanamsha: number;
    yearlyRate: number;
    epochYear: number;
  };
}

// --- Constants ---

const WESTERN_SIGN_NAMES = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

// Lahiri ayanamsha was 0° around 285 AD. Rate ~50.3" per year = ~0.01397° per year.
const AYANAMSHA_EPOCH_YEAR = 285;
const AYANAMSHA_YEARLY_RATE = 0.01397; // degrees per year

// --- Helpers ---

function getNakshatraFromLong(siderealLong: number): { id: number; name: LocaleText; pada: number } {
  const normalized = normalizeDeg(siderealLong);
  const nakshatraIndex = Math.floor(normalized / (360 / 27));
  const nakshatraId = nakshatraIndex + 1; // 1-based
  const degInNakshatra = normalized - nakshatraIndex * (360 / 27);
  const pada = Math.floor(degInNakshatra / (360 / 108)) + 1; // 1-4
  const nakshatraData = NAKSHATRAS[nakshatraIndex];
  return {
    id: nakshatraId,
    name: nakshatraData?.name ?? { en: `Nakshatra ${nakshatraId}`, hi: `नक्षत्र ${nakshatraId}`, sa: `नक्षत्र ${nakshatraId}` },
    pada,
  };
}

function degreeInSign(longitude: number): number {
  return normalizeDeg(longitude) % 30;
}

// --- Main ---

export function compareTropicalVsSidereal(
  jd: number,
  ayanamshaType: AyanamshaType = 'lahiri'
): FullComparison {
  const ayanamshaValue = getAyanamsha(jd, ayanamshaType);
  const tropicalPlanets = getPlanetaryPositions(jd);

  const planets: ComparisonPlanet[] = tropicalPlanets.map(p => {
    const tropicalLong = normalizeDeg(p.longitude);
    const siderealLong = normalizeDeg(p.longitude - ayanamshaValue);
    const tropicalSign = getRashiNumber(tropicalLong);
    const siderealSign = getRashiNumber(siderealLong);
    const isShifted = tropicalSign !== siderealSign;

    const rashiData = RASHIS[siderealSign - 1];
    const grahaData = GRAHAS[p.id];

    const result: ComparisonPlanet = {
      planetId: p.id,
      planetName: grahaData?.name ?? { en: `Planet ${p.id}`, hi: `ग्रह ${p.id}`, sa: `ग्रह ${p.id}` },
      tropical: {
        longitude: tropicalLong,
        sign: tropicalSign,
        signName: WESTERN_SIGN_NAMES[tropicalSign - 1],
        degreeInSign: degreeInSign(tropicalLong),
      },
      sidereal: {
        longitude: siderealLong,
        sign: siderealSign,
        signName: rashiData?.name ?? { en: WESTERN_SIGN_NAMES[siderealSign - 1], hi: WESTERN_SIGN_NAMES[siderealSign - 1], sa: WESTERN_SIGN_NAMES[siderealSign - 1] },
        degreeInSign: degreeInSign(siderealLong),
      },
      isShifted,
      shiftDescription: isShifted
        ? `Moved from ${WESTERN_SIGN_NAMES[tropicalSign - 1]} to ${WESTERN_SIGN_NAMES[siderealSign - 1]}`
        : `Remains in ${WESTERN_SIGN_NAMES[tropicalSign - 1]}`,
    };

    // Add nakshatra for Moon (id=1) and Sun (id=0)
    if (p.id === 0 || p.id === 1) {
      result.sidereal.nakshatra = getNakshatraFromLong(siderealLong);
    }

    return result;
  });

  const shiftedCount = planets.filter(p => p.isShifted).length;

  return {
    ayanamsha: {
      value: ayanamshaValue,
      type: ayanamshaType,
      formatted: formatDegrees(ayanamshaValue),
    },
    planets,
    shiftedCount,
    hookLine: generateHookLine(planets),
    precessionData: {
      currentAyanamsha: ayanamshaValue,
      yearlyRate: AYANAMSHA_YEARLY_RATE,
      epochYear: AYANAMSHA_EPOCH_YEAR,
    },
  };
}

function generateHookLine(planets: ComparisonPlanet[]): string {
  const sun = planets.find(p => p.planetId === 0);
  const moon = planets.find(p => p.planetId === 1);

  if (sun?.isShifted) {
    return `You've been reading ${sun.tropical.signName} horoscopes, but the Sun was actually in ${WESTERN_SIGN_NAMES[sun.sidereal.sign - 1]} when you were born.`;
  }

  if (moon?.isShifted) {
    return `Your Sun is ${sun?.tropical.signName} in both systems, but your Moon shifted from ${moon.tropical.signName} to ${WESTERN_SIGN_NAMES[moon.sidereal.sign - 1]}, revealing a different emotional blueprint.`;
  }

  const shiftedCount = planets.filter(p => p.isShifted).length;
  if (shiftedCount > 0) {
    return `${shiftedCount} of your planets are in different signs than Western astrology shows — the constellations have drifted 24° since the Western system was calibrated.`;
  }

  return 'Your key placements align in both systems — but Vedic astrology reveals deeper layers through Nakshatras and Dashas that Western charts cannot see.';
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/comparison-engine.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/ephem/comparison-engine.ts src/lib/__tests__/comparison-engine.test.ts
git commit -m "feat: add tropical vs sidereal comparison engine"
```

---

### Task 2: Glossary Data Store

**Files:**
- Create: `src/lib/constants/glossary.ts`
- Test: `src/lib/__tests__/glossary-data.test.ts`

- [ ] **Step 1: Write the data integrity test**

```ts
// src/lib/__tests__/glossary-data.test.ts
import { describe, it, expect } from 'vitest';
import { GLOSSARY, type GlossaryEntry } from '../constants/glossary';

describe('glossary data integrity', () => {
  it('has at least 40 entries', () => {
    expect(GLOSSARY.length).toBeGreaterThanOrEqual(40);
  });

  it('every entry has all required fields', () => {
    for (const entry of GLOSSARY) {
      expect(entry.id, `${entry.id} missing id`).toBeTruthy();
      expect(entry.term.en, `${entry.id} missing term.en`).toBeTruthy();
      expect(entry.pronunciation, `${entry.id} missing pronunciation`).toBeTruthy();
      expect(entry.shortDef, `${entry.id} missing shortDef`).toBeTruthy();
      expect(entry.fullDef, `${entry.id} missing fullDef`).toBeTruthy();
      expect(entry.category, `${entry.id} missing category`).toBeTruthy();
      expect(['panchang', 'kundali', 'dasha', 'yoga', 'general']).toContain(entry.category);
      expect(Array.isArray(entry.relatedTerms), `${entry.id} relatedTerms not array`).toBe(true);
    }
  });

  it('has no duplicate IDs', () => {
    const ids = GLOSSARY.map(e => e.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('every relatedTerms reference points to an existing term ID', () => {
    const ids = new Set(GLOSSARY.map(e => e.id));
    for (const entry of GLOSSARY) {
      for (const ref of entry.relatedTerms) {
        expect(ids.has(ref), `${entry.id} references non-existent term "${ref}"`).toBe(true);
      }
    }
  });

  it('covers all 5 categories', () => {
    const categories = new Set(GLOSSARY.map(e => e.category));
    expect(categories.has('panchang')).toBe(true);
    expect(categories.has('kundali')).toBe(true);
    expect(categories.has('dasha')).toBe(true);
    expect(categories.has('yoga')).toBe(true);
    expect(categories.has('general')).toBe(true);
  });

  it('shortDef is under 120 chars for tooltip display', () => {
    for (const entry of GLOSSARY) {
      expect(entry.shortDef.length, `${entry.id} shortDef too long: ${entry.shortDef.length}`).toBeLessThanOrEqual(120);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/glossary-data.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the glossary data file**

```ts
// src/lib/constants/glossary.ts
import type { LocaleText } from '@/types/panchang';

export interface GlossaryEntry {
  id: string;
  term: LocaleText;
  pronunciation: string;
  shortDef: string;
  fullDef: string;
  westernEquivalent?: string;
  category: 'panchang' | 'kundali' | 'dasha' | 'yoga' | 'general';
  relatedTerms: string[];
  seeAlso?: string;
}

export const GLOSSARY: GlossaryEntry[] = [
  // --- PANCHANG (12) ---
  {
    id: 'panchang',
    term: { en: 'Panchang', hi: 'पंचांग', sa: 'पञ्चाङ्गम्' },
    pronunciation: 'PUHN-chahng',
    shortDef: 'The five-limbed Vedic almanac: tithi, nakshatra, yoga, karana, and vara.',
    fullDef: 'Panchang literally means "five limbs" (pancha + anga). It is the traditional Vedic calendar and almanac that tracks five astronomical elements daily: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon angular relationship), Karana (half-tithi), and Vara (weekday). Unlike the Gregorian calendar which tracks only solar position, the Panchang integrates both solar and lunar cycles, providing a richer temporal map used for timing important activities.',
    westernEquivalent: 'Almanac / Ephemeris',
    category: 'panchang',
    relatedTerms: ['tithi', 'nakshatra', 'yoga', 'karana', 'vara'],
  },
  {
    id: 'tithi',
    term: { en: 'Tithi', hi: 'तिथि', sa: 'तिथिः' },
    pronunciation: 'TIH-thee',
    shortDef: 'A lunar day — each 12° angular separation between Sun and Moon.',
    fullDef: 'A Tithi is one of 30 divisions of the synodic month, defined by the angular distance between the Sun and Moon. Each tithi spans exactly 12° of separation. Unlike solar days which are fixed at ~24 hours, tithis vary in duration from ~19 to ~26 hours because the Moon\'s orbital speed is not constant. The 30 tithis are split into two pakshas (fortnights): Shukla (waxing, 1-15) and Krishna (waning, 1-15). Each tithi has a distinct energetic quality used in Muhurta timing.',
    westernEquivalent: 'Lunar Day / Lunar Phase Division',
    category: 'panchang',
    relatedTerms: ['paksha', 'amavasya', 'purnima', 'panchang'],
  },
  {
    id: 'nakshatra',
    term: { en: 'Nakshatra', hi: 'नक्षत्र', sa: 'नक्षत्रम्' },
    pronunciation: 'NUHK-shuh-truh',
    shortDef: 'One of 27 lunar mansions — divisions of the Moon\'s orbit mapping emotional patterns.',
    fullDef: 'The 27 Nakshatras divide the ecliptic into 13°20\' segments, each associated with a ruling deity, planet, symbol, and quality. While Western astrology relies solely on 12 zodiac signs (30° each), Vedic astrology adds this 27-fold lunar overlay, providing significantly higher resolution for personality and timing analysis. The Moon\'s nakshatra at birth is considered more important than the Sun sign in Vedic tradition — it determines the starting point of the Vimshottari Dasha cycle and shapes emotional instincts.',
    westernEquivalent: 'Lunar Mansion / Lunar Constellation',
    category: 'panchang',
    relatedTerms: ['rashi', 'panchang', 'dasha', 'vimshottari'],
  },
  {
    id: 'yoga',
    term: { en: 'Yoga (Astronomical)', hi: 'योग', sa: 'योगः' },
    pronunciation: 'YOH-guh',
    shortDef: 'One of 27 Sun-Moon angular combinations indicating daily energy quality.',
    fullDef: 'In the Panchang context, Yoga refers to one of 27 specific angular relationships between the Sun and Moon, calculated by adding their longitudes and dividing by 13°20\'. Each yoga has a name and quality (auspicious, neutral, or inauspicious) that influences the energetic tone of the day. Not to be confused with planetary yogas in Kundali analysis, which are specific combinations of planets in a birth chart.',
    westernEquivalent: 'Sun-Moon Angular Combination',
    category: 'panchang',
    relatedTerms: ['panchang', 'tithi', 'nakshatra'],
  },
  {
    id: 'karana',
    term: { en: 'Karana', hi: 'करण', sa: 'करणम्' },
    pronunciation: 'KUH-ruh-nuh',
    shortDef: 'A half-tithi — one of 11 types that refine the lunar day\'s quality.',
    fullDef: 'A Karana is half of a Tithi, meaning each tithi contains two karanas. There are 11 karanas in total: 7 movable (Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti) that cycle through the month, and 4 fixed (Shakuni, Chatushpada, Naga, Kimstughna) that occur only once per month. Vishti (also called Bhadra) is considered particularly inauspicious. Karanas refine the quality of a tithi for precise Muhurta timing.',
    westernEquivalent: 'Half Lunar Day',
    category: 'panchang',
    relatedTerms: ['tithi', 'panchang', 'muhurta'],
  },
  {
    id: 'vara',
    term: { en: 'Vara', hi: 'वार', sa: 'वारः' },
    pronunciation: 'VAH-ruh',
    shortDef: 'The weekday — each ruled by a planet influencing the day\'s character.',
    fullDef: 'Vara is the weekday component of the Panchang. Each of the 7 days is ruled by a planet: Sunday (Sun), Monday (Moon), Tuesday (Mars), Wednesday (Mercury), Thursday (Jupiter), Friday (Venus), Saturday (Saturn). The ruling planet colors the day\'s energy and is considered in Muhurta (auspicious timing) calculations. The Vara system is one of the oldest astronomical cycles still in daily use.',
    westernEquivalent: 'Weekday',
    category: 'panchang',
    relatedTerms: ['panchang', 'graha', 'muhurta'],
  },
  {
    id: 'masa',
    term: { en: 'Masa', hi: 'मास', sa: 'मासः' },
    pronunciation: 'MAH-suh',
    shortDef: 'A lunar month — from New Moon to New Moon (Amanta) or Full Moon to Full Moon (Purnimanta).',
    fullDef: 'Masa is the Vedic lunar month. Two systems exist: Amanta (month ends on Amavasya/New Moon, used in most of India) and Purnimanta (month ends on Purnima/Full Moon, used in North India). The 12 months are named after nakshatras where the Full Moon falls: Chaitra, Vaishakha, Jyeshtha, Ashadha, Shravana, Bhadrapada, Ashvina, Kartika, Margashirsha, Pausha, Magha, Phalguna. An intercalary month (Adhika Masa) is inserted roughly every 32.5 months to keep lunar and solar calendars aligned.',
    westernEquivalent: 'Lunar Month',
    category: 'panchang',
    relatedTerms: ['paksha', 'purnima', 'amavasya', 'samvatsara'],
  },
  {
    id: 'paksha',
    term: { en: 'Paksha', hi: 'पक्ष', sa: 'पक्षः' },
    pronunciation: 'PUHK-shuh',
    shortDef: 'A lunar fortnight — Shukla (waxing, bright) or Krishna (waning, dark).',
    fullDef: 'Each lunar month is divided into two Pakshas of ~15 days each. Shukla Paksha (bright half) runs from New Moon to Full Moon as the Moon waxes. Krishna Paksha (dark half) runs from Full Moon to New Moon as the Moon wanes. The Paksha determines the numbering of tithis: Shukla Pratipada (1st day of waxing) through Purnima (Full Moon), then Krishna Pratipada through Amavasya (New Moon).',
    westernEquivalent: 'Lunar Fortnight (Waxing / Waning)',
    category: 'panchang',
    relatedTerms: ['tithi', 'masa', 'purnima', 'amavasya'],
  },
  {
    id: 'amavasya',
    term: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावास्या' },
    pronunciation: 'uh-MAH-vus-yah',
    shortDef: 'New Moon — the 30th tithi when Moon is conjunct Sun. A natural reset point.',
    fullDef: 'Amavasya is the New Moon, the last tithi of Krishna Paksha when the Moon is invisible, conjunct with the Sun. In the Amanta calendar system, it marks the end of the lunar month. Traditionally considered a day of introspection, ancestor remembrance (Pitru Tarpana), and setting intentions. The word literally means "dwelling together" (ama + vasya), referring to Sun and Moon occupying the same degree.',
    westernEquivalent: 'New Moon',
    category: 'panchang',
    relatedTerms: ['paksha', 'purnima', 'tithi', 'masa'],
  },
  {
    id: 'purnima',
    term: { en: 'Purnima', hi: 'पूर्णिमा', sa: 'पूर्णिमा' },
    pronunciation: 'POOR-nih-mah',
    shortDef: 'Full Moon — the 15th tithi of Shukla Paksha. Peak lunar energy.',
    fullDef: 'Purnima is the Full Moon, the 15th tithi of Shukla Paksha when the Moon is fully illuminated and exactly opposite the Sun. In the Purnimanta calendar system, it marks the end of the lunar month. Considered the most energetically charged day of the month — emotions, creativity, and social energy peak. Many festivals (Holi, Guru Purnima, Sharad Purnima) fall on Purnima.',
    westernEquivalent: 'Full Moon',
    category: 'panchang',
    relatedTerms: ['paksha', 'amavasya', 'tithi', 'masa'],
  },
  {
    id: 'samvatsara',
    term: { en: 'Samvatsara', hi: 'संवत्सर', sa: 'संवत्सरः' },
    pronunciation: 'suhm-VUHT-suh-ruh',
    shortDef: 'A Vedic year in the 60-year Jupiter cycle — each with a distinct character.',
    fullDef: 'Samvatsara is the Vedic year, part of a 60-year cycle based on Jupiter\'s ~12-year orbital period combined with the 5-year Yuga cycle (12 x 5 = 60). Each Samvatsara has a unique name (Prabhava, Vibhava, Shukla, etc.) and is believed to carry a distinctive quality that influences events during that year. The current cycle began with Prabhava and is tracked in both North Indian (Vikram) and South Indian (Shalivahana) eras.',
    westernEquivalent: 'Jupiter Cycle Year',
    category: 'panchang',
    relatedTerms: ['masa', 'ayana'],
  },
  {
    id: 'ayana',
    term: { en: 'Ayana', hi: 'अयन', sa: 'अयनम्' },
    pronunciation: 'UH-yuh-nuh',
    shortDef: 'A 6-month solar half-year — Uttarayana (northward) or Dakshinayana (southward).',
    fullDef: 'Ayana divides the solar year into two halves based on the Sun\'s apparent north-south movement. Uttarayana (northward journey, ~Jan 14 to Jul 14) begins at Makara Sankranti when the Sun enters Capricorn. Dakshinayana (southward journey, ~Jul 14 to Jan 14) begins when the Sun enters Cancer. Uttarayana is traditionally considered more auspicious for new ventures, while Dakshinayana is associated with inner work and spiritual practice.',
    westernEquivalent: 'Solar Half-Year / Solstice Period',
    category: 'panchang',
    relatedTerms: ['samvatsara', 'panchang'],
  },

  // --- KUNDALI (14) ---
  {
    id: 'kundali',
    term: { en: 'Kundali', hi: 'कुंडली', sa: 'कुण्डली' },
    pronunciation: 'KOON-duh-lee',
    shortDef: 'A Vedic birth chart — the map of planetary positions at the moment of birth.',
    fullDef: 'Kundali (also Janampatri or Janam Kundali) is the Vedic birth chart, a precise map of all planetary positions as seen from the birth location at the exact moment of birth. Unlike Western charts which use the tropical zodiac, Kundali uses the sidereal zodiac corrected by Ayanamsha to align with actual constellation positions. The chart contains 12 houses (Bhavas), 9 planets (Grahas), and forms the basis for all predictive and personality analysis in Jyotish.',
    westernEquivalent: 'Birth Chart / Natal Chart / Horoscope',
    category: 'kundali',
    relatedTerms: ['lagna', 'rashi', 'graha', 'bhava', 'ayanamsha'],
  },
  {
    id: 'lagna',
    term: { en: 'Lagna', hi: 'लग्न', sa: 'लग्नम्' },
    pronunciation: 'LUHG-nuh',
    shortDef: 'The Ascendant — the zodiac sign rising on the eastern horizon at birth.',
    fullDef: 'Lagna is the exact degree of the zodiac rising on the eastern horizon at the moment of birth. It changes approximately every 2 hours, making it the most time-sensitive point in the chart. The Lagna sign becomes the 1st house and determines the entire house layout. It represents the native\'s physical constitution, personality, and how they present to the world. In Vedic astrology, Lagna is considered more important than the Sun sign.',
    westernEquivalent: 'Ascendant / Rising Sign',
    category: 'kundali',
    relatedTerms: ['kundali', 'bhava', 'rashi'],
  },
  {
    id: 'rashi',
    term: { en: 'Rashi', hi: 'राशि', sa: 'राशिः' },
    pronunciation: 'RAH-shee',
    shortDef: 'A zodiac sign — one of 12 sidereal divisions of 30° each along the ecliptic.',
    fullDef: 'Rashi refers to one of the 12 zodiac signs in Vedic astrology. The 12 Rashis are: Mesha (Aries), Vrishabha (Taurus), Mithuna (Gemini), Karka (Cancer), Simha (Leo), Kanya (Virgo), Tula (Libra), Vrishchika (Scorpio), Dhanu (Sagittarius), Makara (Capricorn), Kumbha (Aquarius), Meena (Pisces). Critically, Vedic Rashis use the sidereal zodiac (aligned to actual constellations), not the tropical zodiac used in Western astrology — the two systems are currently offset by ~24°.',
    westernEquivalent: 'Zodiac Sign (Sidereal)',
    category: 'kundali',
    relatedTerms: ['kundali', 'lagna', 'graha', 'ayanamsha'],
  },
  {
    id: 'graha',
    term: { en: 'Graha', hi: 'ग्रह', sa: 'ग्रहः' },
    pronunciation: 'GRUH-huh',
    shortDef: 'A celestial influencer — the 9 Vedic planets including shadow planets Rahu and Ketu.',
    fullDef: 'Graha literally means "seizer" — that which seizes or influences. The 9 Vedic Grahas are: Surya (Sun), Chandra (Moon), Mangal (Mars), Budha (Mercury), Guru (Jupiter), Shukra (Venus), Shani (Saturn), Rahu (North Lunar Node), and Ketu (South Lunar Node). Unlike Western astrology which added Uranus, Neptune, and Pluto, Vedic astrology uses these 9 bodies exclusively. Rahu and Ketu are mathematical points (the Moon\'s orbital nodes) that cause eclipses — they have no physical body but are considered powerful karmic indicators.',
    westernEquivalent: 'Planet (including Lunar Nodes)',
    category: 'kundali',
    relatedTerms: ['kundali', 'rashi', 'bhava', 'dasha'],
  },
  {
    id: 'bhava',
    term: { en: 'Bhava', hi: 'भाव', sa: 'भावः' },
    pronunciation: 'BHAH-vuh',
    shortDef: 'A house — one of 12 life domains in the birth chart (career, relationships, etc.).',
    fullDef: 'Bhava means "state of being" and refers to one of the 12 houses in the Kundali, each governing a specific life domain: 1st (self), 2nd (wealth/speech), 3rd (siblings/courage), 4th (home/mother), 5th (children/creativity), 6th (enemies/health), 7th (spouse/partnerships), 8th (transformation/longevity), 9th (luck/dharma), 10th (career/status), 11th (gains/community), 12th (loss/liberation). The Lagna determines which sign occupies the 1st house, cascading the rest.',
    westernEquivalent: 'House',
    category: 'kundali',
    relatedTerms: ['kundali', 'lagna', 'rashi', 'graha'],
  },
  {
    id: 'navamsha',
    term: { en: 'Navamsha', hi: 'नवांश', sa: 'नवांशः' },
    pronunciation: 'nuh-VAHM-shuh',
    shortDef: 'The D9 divisional chart — reveals marriage potential and the soul\'s deeper purpose.',
    fullDef: 'Navamsha (D9) is the most important divisional chart after the birth chart (D1). Each sign is divided into 9 parts of 3°20\', and each part maps to a sign in the Navamsha chart. It is primarily used to assess marriage/partnership potential and the deeper spiritual nature of the native. A planet strong in D1 but weak in D9 may not deliver its full promise. Many Jyotish practitioners consider a reading incomplete without Navamsha analysis.',
    westernEquivalent: 'Harmonic Chart (9th Harmonic)',
    category: 'kundali',
    relatedTerms: ['kundali', 'varga', 'rashi'],
  },
  {
    id: 'ayanamsha',
    term: { en: 'Ayanamsha', hi: 'अयनांश', sa: 'अयनांशः' },
    pronunciation: 'UH-yuh-NAHM-shuh',
    shortDef: 'The angular offset (~24°) between tropical and sidereal zodiacs due to Earth\'s axial precession.',
    fullDef: 'Ayanamsha is the angular difference between the tropical zodiac (used in Western astrology, anchored to the spring equinox) and the sidereal zodiac (used in Vedic astrology, anchored to fixed stars). Due to the precession of Earth\'s rotational axis, this offset increases by ~50.3 arc-seconds per year. Currently ~24.2° (Lahiri), it means your Vedic sign placements are typically one sign behind your Western placements. Multiple ayanamsha systems exist (Lahiri, Raman, KP) with slightly different reference points.',
    westernEquivalent: 'Precession Offset',
    category: 'kundali',
    relatedTerms: ['rashi', 'kundali', 'sidereal_tropical'],
  },
  {
    id: 'hora',
    term: { en: 'Hora', hi: 'होरा', sa: 'होरा' },
    pronunciation: 'HOH-rah',
    shortDef: 'A planetary hour — each hour of the day ruled by a specific planet.',
    fullDef: 'Hora divides each day into planetary hours, each ruled by one of the 7 visible planets. The sequence follows the Chaldean order: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon. The first hora of each day is ruled by the day\'s lord (Sunday = Sun, Monday = Moon, etc.). Horas are used in Muhurta to fine-tune the timing of activities — a Jupiter hora is favorable for education and spirituality, while a Venus hora suits creative and romantic pursuits.',
    westernEquivalent: 'Planetary Hour',
    category: 'kundali',
    relatedTerms: ['muhurta', 'graha', 'vara'],
  },
  {
    id: 'drekkana',
    term: { en: 'Drekkana', hi: 'द्रेक्काण', sa: 'द्रेक्काणः' },
    pronunciation: 'DREK-kah-nuh',
    shortDef: 'The D3 divisional chart — each sign split into three 10° parts for sibling/courage analysis.',
    fullDef: 'Drekkana (D3) is a divisional chart where each 30° sign is divided into three 10° portions. The 1st decanate maps to the sign itself, the 2nd to the 5th sign from it, and the 3rd to the 9th sign. Traditionally used to analyze siblings, courage, and short journeys. It also provides supplementary information about the native\'s initiative and self-effort.',
    westernEquivalent: 'Decanate / Decan',
    category: 'kundali',
    relatedTerms: ['varga', 'navamsha', 'rashi'],
  },
  {
    id: 'varga',
    term: { en: 'Varga', hi: 'वर्ग', sa: 'वर्गः' },
    pronunciation: 'VUHR-guh',
    shortDef: 'A divisional chart — sub-divisions of signs that reveal specific life areas in detail.',
    fullDef: 'Varga charts (also called Amsha or divisional charts) are derived by subdividing each sign into smaller portions and remapping them. The main birth chart (D1/Rashi) is supplemented by 15 standard Vargas: D2 (Hora/wealth), D3 (Drekkana/siblings), D7 (Saptamsha/children), D9 (Navamsha/marriage), D10 (Dashamsha/career), D12 (Dwadashamsha/parents), and others up to D60. Each provides focused insight into a specific life domain, like zooming into a section of the birth chart.',
    westernEquivalent: 'Harmonic Chart',
    category: 'kundali',
    relatedTerms: ['navamsha', 'drekkana', 'kundali'],
  },
  {
    id: 'sphuta',
    term: { en: 'Sphuta', hi: 'स्फुट', sa: 'स्फुटः' },
    pronunciation: 'SFOO-tuh',
    shortDef: 'A corrected/exact planetary longitude — the precise degree-minute-second position.',
    fullDef: 'Sphuta means "corrected" or "exact" and refers to the precisely computed longitude of a planet after applying all corrections (ayanamsha, equation of center, etc.). In classical Jyotish, various Sphutas are calculated: Graha Sphuta (planet positions), Lagna Sphuta (exact ascendant), Yogi Sphuta (auspicious degree), Avayogi Sphuta (inauspicious degree), and Bhrigu Bindu (midpoint of Rahu and Moon). These exact degrees are crucial for divisional chart computation.',
    westernEquivalent: 'Exact Planetary Position (Longitude)',
    category: 'kundali',
    relatedTerms: ['kundali', 'graha', 'ayanamsha'],
  },
  {
    id: 'ashtakavarga',
    term: { en: 'Ashtakavarga', hi: 'अष्टकवर्ग', sa: 'अष्टकवर्गः' },
    pronunciation: 'uhsh-tuh-kuh-VUHR-guh',
    shortDef: 'An 8-source scoring system rating each sign\'s strength from 0-8 benefic points.',
    fullDef: 'Ashtakavarga is a unique Vedic scoring system where each of the 7 planets and the Lagna contribute benefic (bindus) or malefic (rekhas) points to every sign. Each planet gets a score from 0-8 in each sign. The aggregate (Sarvashtakavarga) shows which signs are generally strong (high points) or weak (low points) in a chart. Transiting planets give better results when passing through signs with higher Ashtakavarga scores. It quantifies planetary support in a way no Western technique replicates.',
    westernEquivalent: 'Benefic Point Scoring System',
    category: 'kundali',
    relatedTerms: ['kundali', 'graha', 'rashi'],
  },
  {
    id: 'bhava_chalit',
    term: { en: 'Bhava Chalit', hi: 'भाव चलित', sa: 'भावचलितम्' },
    pronunciation: 'BHAH-vuh CHAH-lit',
    shortDef: 'The house-shifted chart — adjusts planet placement based on actual house cusps.',
    fullDef: 'Bhava Chalit is a chart where planets are placed according to the actual house cusp boundaries rather than the equal-sign system used in the Rashi chart. Because the Lagna can fall at any degree within a sign, some planets near house boundaries may shift from one house to another in the Bhava Chalit. This chart is considered more accurate for house-based predictions (which house a planet influences), while the Rashi chart is used for sign-based analysis (dignity, aspects).',
    westernEquivalent: 'House-Based Chart (similar to Placidus)',
    category: 'kundali',
    relatedTerms: ['bhava', 'lagna', 'kundali'],
  },
  {
    id: 'divisional_chart',
    term: { en: 'Divisional Chart', hi: 'वर्ग चार्ट', sa: 'वर्गचक्रम्' },
    pronunciation: 'dih-VIH-zhuh-nul chart',
    shortDef: 'A sub-chart derived by dividing signs — zooms into specific life areas.',
    fullDef: 'Divisional charts (Varga charts) are derived charts created by mathematically subdividing each zodiac sign and remapping the portions. The D9 (Navamsha) divides each sign into 9 parts, the D10 (Dashamsha) into 10, and so on up to D60. Each divisional chart focuses on a specific life domain: D9 for marriage, D10 for career, D7 for children, D12 for parents. A planet that is strong in both the birth chart (D1) and the relevant divisional chart is most likely to deliver its promise in that life area.',
    westernEquivalent: 'Harmonic Chart',
    category: 'kundali',
    relatedTerms: ['varga', 'navamsha', 'drekkana'],
  },

  // --- DASHA (6) ---
  {
    id: 'dasha',
    term: { en: 'Dasha', hi: 'दशा', sa: 'दशा' },
    pronunciation: 'DUH-shah',
    shortDef: 'A planetary time period — each planet rules a chapter of your life.',
    fullDef: 'Dasha is Vedic astrology\'s unique timing system where specific planets sequentially govern chapters of a person\'s life. Unlike Western astrology\'s transits (which overlay current sky positions onto the birth chart), Dashas are an unfolding sequence determined at birth by the Moon\'s nakshatra position. During a planet\'s Dasha, that planet\'s themes, house rulerships, and condition in the birth chart become activated. The most widely used system (Vimshottari) spans 120 years across 9 planetary periods.',
    westernEquivalent: 'Planetary Time Period (no Western equivalent)',
    category: 'dasha',
    relatedTerms: ['mahadasha', 'antardasha', 'vimshottari', 'nakshatra'],
  },
  {
    id: 'mahadasha',
    term: { en: 'Mahadasha', hi: 'महादशा', sa: 'महादशा' },
    pronunciation: 'muh-HAH-duh-shah',
    shortDef: 'The major planetary period — the dominant life chapter lasting 6-20 years.',
    fullDef: 'Mahadasha is the major period in the Dasha system. In Vimshottari Dasha, each of the 9 planets rules a Mahadasha of fixed length: Sun (6 years), Moon (10), Mars (7), Rahu (18), Jupiter (16), Saturn (19), Mercury (17), Ketu (7), Venus (20). The Mahadasha lord\'s condition in the birth chart — its sign, house, aspects, and dignity — strongly colors the entire period. Transitions between Mahadashas (Dasha Sandhi) often coincide with significant life shifts.',
    westernEquivalent: 'Major Planetary Period',
    category: 'dasha',
    relatedTerms: ['dasha', 'antardasha', 'vimshottari', 'dasha_sandhi'],
  },
  {
    id: 'antardasha',
    term: { en: 'Antardasha', hi: 'अन्तर्दशा', sa: 'अन्तर्दशा' },
    pronunciation: 'UHN-tuhr-duh-shah',
    shortDef: 'The sub-period within a Mahadasha — a finer timing layer lasting months to years.',
    fullDef: 'Antardasha (also called Bhukti) is the sub-period within a Mahadasha. Each Mahadasha is divided into 9 Antardashas, one for each planet, proportionally distributed. For example, within Jupiter Mahadasha (16 years), the Jupiter-Jupiter Antardasha is ~2.5 years, Jupiter-Saturn is ~2.7 years, etc. The Antardasha lord modifies the Mahadasha theme — Jupiter Mahadasha with Mars Antardasha activates both Jupiter\'s wisdom themes and Mars\'s action/conflict themes simultaneously.',
    westernEquivalent: 'Sub-Period',
    category: 'dasha',
    relatedTerms: ['dasha', 'mahadasha', 'pratyantar'],
  },
  {
    id: 'pratyantar',
    term: { en: 'Pratyantar Dasha', hi: 'प्रत्यन्तर दशा', sa: 'प्रत्यन्तरदशा' },
    pronunciation: 'PRUHT-yuhn-tuhr DUH-shah',
    shortDef: 'The sub-sub-period — a third timing layer lasting weeks to months.',
    fullDef: 'Pratyantar Dasha is the third level of the Dasha hierarchy, subdividing each Antardasha into 9 further periods. At this level, timing becomes very precise — each Pratyantar lasts from a few weeks to a few months. Astrologers use this level to pinpoint specific events within a broader period. For extremely precise timing, even finer levels exist (Sookshma and Prana Dasha), though these are less commonly used.',
    westernEquivalent: 'Sub-Sub-Period',
    category: 'dasha',
    relatedTerms: ['dasha', 'antardasha', 'mahadasha'],
  },
  {
    id: 'vimshottari',
    term: { en: 'Vimshottari', hi: 'विंशोत्तरी', sa: 'विंशोत्तरी' },
    pronunciation: 'vim-SHOHT-uh-ree',
    shortDef: 'The 120-year Dasha system — the most widely used planetary timing cycle.',
    fullDef: 'Vimshottari Dasha is the most commonly used Dasha system, spanning 120 years (vimshottari = "one hundred and twenty"). The starting point is determined by the Moon\'s nakshatra at birth — each of the 27 nakshatras is ruled by one of the 9 planets, and the proportion of nakshatra already traversed by the Moon determines how much of the first Dasha has elapsed at birth. The sequence is fixed: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury.',
    westernEquivalent: '120-Year Planetary Cycle',
    category: 'dasha',
    relatedTerms: ['dasha', 'mahadasha', 'nakshatra'],
  },
  {
    id: 'dasha_sandhi',
    term: { en: 'Dasha Sandhi', hi: 'दशा सन्धि', sa: 'दशासन्धिः' },
    pronunciation: 'DUH-shah SUHN-dhee',
    shortDef: 'The transition zone between two Dashas — a period of change and adjustment.',
    fullDef: 'Dasha Sandhi is the junction period when one Dasha is ending and the next is beginning. Like the transition between seasons, this period (typically spanning a few months around the changeover date) can bring uncertainty, significant life changes, or a noticeable shift in focus and circumstances. The magnitude of the shift depends on how different the two Dasha lords are — a transition from Jupiter to Saturn represents a more dramatic shift than Moon to Mars.',
    westernEquivalent: 'Period Transition',
    category: 'dasha',
    relatedTerms: ['dasha', 'mahadasha'],
  },

  // --- YOGA (7) ---
  {
    id: 'yoga_combination',
    term: { en: 'Yoga (Combination)', hi: 'योग', sa: 'योगः' },
    pronunciation: 'YOH-guh',
    shortDef: 'A specific planetary combination in a birth chart that produces distinct life effects.',
    fullDef: 'In Kundali analysis, Yoga refers to specific combinations of planets, signs, and houses that produce notable effects. Unlike the Panchang Yoga (which is a daily Sun-Moon calculation), chart Yogas are permanent features of a birth chart. Hundreds are catalogued in classical texts. They range from highly auspicious (Raja Yoga = power/authority, Dhana Yoga = wealth) to challenging (Kemadruma = emotional isolation, Daridra = financial difficulty). A chart typically has multiple yogas active simultaneously.',
    westernEquivalent: 'Planetary Configuration / Aspect Pattern',
    category: 'yoga',
    relatedTerms: ['raja_yoga', 'dhana_yoga', 'dosha', 'kundali'],
  },
  {
    id: 'dosha',
    term: { en: 'Dosha', hi: 'दोष', sa: 'दोषः' },
    pronunciation: 'DOH-shuh',
    shortDef: 'A challenging planetary condition in a chart — an area requiring conscious attention.',
    fullDef: 'Dosha means "fault" or "blemish" and refers to challenging planetary configurations in a birth chart. Common Doshas include Manglik/Kuja Dosha (Mars in specific houses affecting marriage), Kaal Sarpa (all planets between Rahu-Ketu axis), and Pitru Dosha (ancestral karma indicators). Important: Doshas are not "curses" — they are areas where extra awareness is needed. Most Doshas have cancellation conditions (Bhanga) that reduce or eliminate their effects.',
    westernEquivalent: 'Challenging Aspect / Hard Configuration',
    category: 'yoga',
    relatedTerms: ['yoga_combination', 'manglik', 'kundali'],
  },
  {
    id: 'raja_yoga',
    term: { en: 'Raja Yoga', hi: 'राज योग', sa: 'राजयोगः' },
    pronunciation: 'RAH-juh YOH-guh',
    shortDef: 'A "royal combination" — planetary placements indicating authority, success, or leadership.',
    fullDef: 'Raja Yoga ("royal combination") forms when lords of Kendra houses (1, 4, 7, 10) and Trikona houses (1, 5, 9) are connected through conjunction, mutual aspect, or exchange. The combination of angular power (Kendra) and fortune (Trikona) produces exceptional results in career, authority, and social status. The strength depends on the specific houses involved, the dignity of the planets, and whether they are activated by the current Dasha period.',
    westernEquivalent: 'Grand Trine / Angular Configurations',
    category: 'yoga',
    relatedTerms: ['yoga_combination', 'kundali', 'dasha'],
  },
  {
    id: 'dhana_yoga',
    term: { en: 'Dhana Yoga', hi: 'धन योग', sa: 'धनयोगः' },
    pronunciation: 'DHUH-nuh YOH-guh',
    shortDef: 'A wealth combination — planetary connections indicating financial prosperity.',
    fullDef: 'Dhana Yoga forms through connections between lords of wealth houses (2nd = accumulated wealth, 11th = gains) and supporting houses (1st = self, 5th = speculative gains, 9th = fortune). Multiple Dhana Yogas in a chart amplify wealth potential. However, the timing of wealth manifestation depends on the Dasha — a strong Dhana Yoga may only produce results during the Dasha of the involved planet.',
    westernEquivalent: 'Wealth Configuration',
    category: 'yoga',
    relatedTerms: ['yoga_combination', 'raja_yoga', 'kundali'],
  },
  {
    id: 'manglik',
    term: { en: 'Manglik Dosha', hi: 'मांगलिक दोष', sa: 'माङ्गलिकदोषः' },
    pronunciation: 'MAHNG-lik DOH-shuh',
    shortDef: 'Mars in houses 1, 2, 4, 7, 8, or 12 — traditionally affects marriage compatibility.',
    fullDef: 'Manglik Dosha (also Kuja Dosha) occurs when Mars occupies the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus. Mars\'s aggressive energy in these partnership-sensitive houses is traditionally believed to create friction in marriage. However, many cancellation conditions exist: both partners being Manglik cancels the effect, Mars in its own sign or exaltation reduces severity, and age past 28 is traditionally said to reduce the dosha. It is one of the most checked factors in Kundali matching.',
    westernEquivalent: 'Mars affliction to partnership houses',
    category: 'yoga',
    relatedTerms: ['dosha', 'ashta_kuta', 'kundali'],
  },
  {
    id: 'sade_sati',
    term: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साडेसाति' },
    pronunciation: 'SAH-day SAH-tee',
    shortDef: 'Saturn\'s 7.5-year transit over your Moon sign — a period of deep transformation.',
    fullDef: 'Sade Sati is the 7.5-year period when Saturn transits through the sign before, the sign of, and the sign after your natal Moon. Since Saturn takes ~2.5 years per sign, the total duration is ~7.5 years (sade sati = "seven and a half"). It occurs 2-3 times in a lifetime and is associated with emotional challenges, responsibility, and deep personal growth. The second pass (12th house phase) is considered most intense. Despite its reputation, Sade Sati often produces lasting positive transformation through pressure.',
    westernEquivalent: 'Saturn Conjunct Moon Transit (extended)',
    category: 'yoga',
    relatedTerms: ['graha', 'rashi', 'kundali'],
  },
  {
    id: 'pancha_mahapurusha',
    term: { en: 'Pancha Mahapurusha', hi: 'पंच महापुरुष', sa: 'पञ्चमहापुरुषः' },
    pronunciation: 'PUHN-chuh muh-HAH-poo-roo-shuh',
    shortDef: 'Five "great person" yogas — formed when Mars, Mercury, Jupiter, Venus, or Saturn is in its own/exalted sign in a Kendra.',
    fullDef: 'Pancha Mahapurusha Yogas are five powerful combinations where a non-luminary planet (Mars, Mercury, Jupiter, Venus, or Saturn) is in its own sign or exaltation sign AND placed in a Kendra house (1, 4, 7, or 10). The five yogas are: Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), and Shasha (Saturn). Each grants distinctive qualities related to the planet — Hamsa gives wisdom and spiritual inclination, Ruchaka gives physical strength and leadership.',
    westernEquivalent: 'Planet in Dignity in Angular House',
    category: 'yoga',
    relatedTerms: ['yoga_combination', 'raja_yoga', 'graha'],
  },

  // --- GENERAL (6) ---
  {
    id: 'jyotish',
    term: { en: 'Jyotish', hi: 'ज्योतिष', sa: 'ज्योतिषम्' },
    pronunciation: 'JOH-tish',
    shortDef: 'Vedic astrology — the ancient Indian system of astronomical observation and interpretation.',
    fullDef: 'Jyotish (from jyoti = "light" + isha = "lord") is the traditional Hindu system of astrology, one of the six Vedangas (limbs of the Vedas). It encompasses three branches: Siddhanta (astronomical computation), Samhita (mundane astrology, weather, omens), and Hora (predictive astrology, birth charts). Jyotish uses the sidereal zodiac, the Dasha timing system, and 27 Nakshatras — features absent from Western astrology — providing what practitioners consider a higher-resolution framework for understanding time and personality.',
    westernEquivalent: 'Vedic / Hindu / Indian Astrology',
    category: 'general',
    relatedTerms: ['kundali', 'panchang', 'nakshatra', 'dasha'],
  },
  {
    id: 'muhurta',
    term: { en: 'Muhurta', hi: 'मुहूर्त', sa: 'मुहूर्तः' },
    pronunciation: 'moo-HOOR-tuh',
    shortDef: 'Electional astrology — finding the ideal time to begin important activities.',
    fullDef: 'Muhurta is the branch of Jyotish concerned with selecting auspicious moments for important activities: starting a business, marriage ceremony, house construction, travel, etc. It evaluates multiple factors simultaneously: tithi, nakshatra, yoga, karana, planetary hora, Rahu Kaal, Yamaganda, and the specific activity\'s requirements. A "Muhurta" is also a Vedic time unit (~48 minutes), and 30 Muhurtas make up a full day from sunrise to sunrise.',
    westernEquivalent: 'Electional Astrology / Auspicious Timing',
    category: 'general',
    relatedTerms: ['panchang', 'tithi', 'nakshatra', 'hora'],
  },
  {
    id: 'guna_milan',
    term: { en: 'Guna Milan', hi: 'गुण मिलान', sa: 'गुणमिलनम्' },
    pronunciation: 'GOO-nuh mee-LAHN',
    shortDef: 'The 36-point compatibility scoring system used in Vedic marriage matching.',
    fullDef: 'Guna Milan (also called Kundali Milan) is the Vedic compatibility assessment for marriage, scoring up to 36 points across 8 factors (Ashta Kuta). The assessment is based primarily on the Moon\'s nakshatra and rashi in both charts. Scores above 18 are considered acceptable, above 24 good, and above 28 excellent. While the numerical score provides a quick assessment, experienced practitioners also examine planetary aspects, Dasha alignment, and specific Doshas for a complete compatibility picture.',
    westernEquivalent: 'Synastry / Compatibility Analysis',
    category: 'general',
    relatedTerms: ['ashta_kuta', 'nakshatra', 'rashi', 'manglik'],
  },
  {
    id: 'ashta_kuta',
    term: { en: 'Ashta Kuta', hi: 'अष्ट कूट', sa: 'अष्टकूटम्' },
    pronunciation: 'UHSH-tuh KOO-tuh',
    shortDef: 'The 8 compatibility factors in Guna Milan — from temperament to vital energy.',
    fullDef: 'Ashta Kuta ("eight peaks") is the framework of 8 specific factors evaluated in Guna Milan: Varna (spiritual compatibility, 1 point), Vashya (mutual attraction, 2 points), Tara (birth star harmony, 3 points), Yoni (instinctive compatibility, 4 points), Graha Maitri (planetary friendship, 5 points), Gana (temperament match, 6 points), Bhakoot (emotional compatibility, 7 points), and Nadi (vital energy compatibility, 8 points). Each factor tests a different dimension of relationship compatibility, totaling 36 points maximum.',
    westernEquivalent: 'Eight-Factor Compatibility Assessment',
    category: 'general',
    relatedTerms: ['guna_milan', 'nakshatra', 'rashi'],
  },
  {
    id: 'vedic',
    term: { en: 'Vedic', hi: 'वैदिक', sa: 'वैदिकम्' },
    pronunciation: 'VAY-dik',
    shortDef: 'Relating to the Vedas — the foundational texts of Indian knowledge systems.',
    fullDef: 'Vedic refers to anything derived from or related to the Vedas, the oldest layer of Sanskrit literature and the foundational scriptures of Hinduism. The four Vedas (Rig, Yajur, Sama, Atharva) were composed between 1500-500 BCE and contain hymns, philosophy, and practical knowledge including astronomy and mathematics. "Vedic astrology" (Jyotish) is one of six Vedangas — auxiliary disciplines considered essential for understanding the Vedas. The term positions this knowledge system as one of the world\'s oldest continuous intellectual traditions.',
    westernEquivalent: 'Classical Indian / Ancient Sanskrit',
    category: 'general',
    relatedTerms: ['jyotish'],
  },
  {
    id: 'sidereal_tropical',
    term: { en: 'Sidereal vs Tropical', hi: 'निरयन बनाम सायन', sa: 'निरयनं सायनं च' },
    pronunciation: 'sy-DEER-ee-ul / TROP-ih-kul',
    shortDef: 'Two zodiac systems — sidereal (fixed stars, Vedic) vs tropical (equinox-anchored, Western).',
    fullDef: 'The sidereal zodiac aligns signs with their namesake constellations using fixed star references. The tropical zodiac anchors 0° Aries to the spring equinox point, which precesses westward through the constellations over a ~26,000-year cycle. When the systems were designed (~285 AD), they were aligned. Today, the tropical zodiac is ~24° ahead of the sidereal, meaning most people\'s Western sign placements are one sign ahead of their Vedic placements. Neither system is "wrong" — they measure different things. Sidereal tracks your relationship to the fixed stars; tropical tracks your relationship to Earth\'s seasonal cycle.',
    westernEquivalent: 'Fixed-Star vs Equinox-Based Zodiac',
    category: 'general',
    relatedTerms: ['ayanamsha', 'rashi', 'jyotish'],
  },
];

// Lookup helpers
export function getGlossaryEntry(id: string): GlossaryEntry | undefined {
  return GLOSSARY.find(e => e.id === id);
}

export function getGlossaryByCategory(category: GlossaryEntry['category']): GlossaryEntry[] {
  return GLOSSARY.filter(e => e.category === category);
}

export function searchGlossary(query: string): GlossaryEntry[] {
  const q = query.toLowerCase();
  return GLOSSARY.filter(e =>
    e.id.includes(q) ||
    e.term.en.toLowerCase().includes(q) ||
    e.shortDef.toLowerCase().includes(q)
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/glossary-data.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/glossary.ts src/lib/__tests__/glossary-data.test.ts
git commit -m "feat: add glossary data store with 45 Jyotish term definitions"
```

---

### Task 3: JyotishTerm Component

**Files:**
- Create: `src/components/ui/JyotishTerm.tsx`

- [ ] **Step 1: Create the JyotishTerm component**

```tsx
// src/components/ui/JyotishTerm.tsx
'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import { getGlossaryEntry } from '@/lib/constants/glossary';
import { useLocale } from 'next-intl';
import { tl } from '@/lib/utils/trilingual';
import Link from 'next/link';

interface JyotishTermProps {
  term: string;
  children?: ReactNode;
  showOnce?: boolean;
}

const STORAGE_KEY = 'jyotish-terms-seen';

function getSeenTerms(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function markTermSeen(termId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const seen = getSeenTerms();
    seen.add(termId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
  } catch {
    // localStorage full or unavailable — silent, non-critical
  }
}

export default function JyotishTerm({ term, children, showOnce = false }: JyotishTermProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [position, setPosition] = useState<'above' | 'below'>('below');
  const triggerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();

  const entry = getGlossaryEntry(term);

  useEffect(() => {
    if (showOnce) {
      const seen = getSeenTerms();
      if (seen.has(term)) {
        setDismissed(true);
      }
    }
  }, [term, showOnce]);

  useEffect(() => {
    if (showTooltip && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setPosition(spaceBelow < 200 ? 'above' : 'below');

      if (showOnce) {
        markTermSeen(term);
      }
    }
  }, [showTooltip, term, showOnce]);

  // Close tooltip on outside click
  useEffect(() => {
    if (!showTooltip) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current && !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current && !tooltipRef.current.contains(e.target as Node)
      ) {
        setShowTooltip(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showTooltip]);

  if (!entry) {
    return <span>{children ?? term}</span>;
  }

  if (dismissed) {
    return <span>{children ?? tl(entry.term, locale)}</span>;
  }

  const displayText = children ?? tl(entry.term, locale);

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        className="border-b border-dotted border-gold-primary/40 cursor-help"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(prev => !prev)}
        role="button"
        tabIndex={0}
        aria-describedby={showTooltip ? `tooltip-${term}` : undefined}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowTooltip(prev => !prev); }}
      >
        {displayText}
      </span>

      {showTooltip && (
        <div
          ref={tooltipRef}
          id={`tooltip-${term}`}
          role="tooltip"
          className={`absolute z-50 w-72 p-3 rounded-lg bg-bg-secondary border border-gold-primary/20 shadow-lg shadow-black/40 text-sm ${
            position === 'above' ? 'bottom-full mb-2' : 'top-full mt-2'
          } left-1/2 -translate-x-1/2`}
        >
          <div className="font-semibold text-gold-light mb-1">
            {tl(entry.term, locale)}
            {entry.pronunciation && (
              <span className="text-text-secondary font-normal ml-2 text-xs">
                ({entry.pronunciation})
              </span>
            )}
          </div>
          <p className="text-text-primary text-xs leading-relaxed mb-2">
            {entry.shortDef}
          </p>
          {entry.westernEquivalent && (
            <p className="text-text-secondary text-xs mb-2">
              Western equivalent: {entry.westernEquivalent}
            </p>
          )}
          <Link
            href={`/glossary#${term}`}
            className="text-gold-primary text-xs hover:text-gold-light transition-colors"
            onClick={() => setShowTooltip(false)}
          >
            Full glossary entry &rarr;
          </Link>
        </div>
      )}
    </span>
  );
}
```

- [ ] **Step 2: Verify component compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -20`
Expected: No errors related to JyotishTerm

- [ ] **Step 3: Test in browser**

Start dev server if not running: `npx next dev`
Import and use `<JyotishTerm term="nakshatra" />` temporarily in any existing page. Verify:
- Gold dotted underline renders
- Hover shows tooltip with definition
- "Full glossary entry" link present
- Tooltip positions above when near bottom of viewport
- Remove temporary usage after verification

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/JyotishTerm.tsx
git commit -m "feat: add JyotishTerm inline tooltip component"
```

---

### Task 4: Glossary Page

**Files:**
- Create: `src/app/[locale]/glossary/page.tsx`
- Create: `src/app/[locale]/glossary/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` — add PAGE_META entry
- Modify: `src/app/sitemap.ts` — add route

- [ ] **Step 1: Add SEO metadata**

In `src/lib/seo/metadata.ts`, add to the `PAGE_META` object (around line 22-1140, find alphabetical position):

```ts
'/glossary': {
  title: { en: 'Vedic Astrology Glossary — 50+ Terms Explained', hi: 'वैदिक ज्योतिष शब्दावली — 50+ शब्दों की व्याख्या', sa: 'वैदिकज्योतिषशब्दकोशः' },
  description: { en: 'Comprehensive glossary of Vedic astrology terms with pronunciations, definitions, and Western equivalents. Learn what Nakshatra, Dasha, Kundali, and 45+ more terms mean.', hi: 'वैदिक ज्योतिष शब्दों की व्यापक शब्दावली', sa: 'वैदिकज्योतिषशब्दानां व्याख्या' },
  keywords: ['vedic astrology glossary', 'jyotish terms', 'what is nakshatra', 'what is dasha', 'vedic astrology definitions'],
},
```

- [ ] **Step 2: Add to sitemap**

In `src/app/sitemap.ts`, add `'/glossary'` to the `routes` array (around lines 27-222, find alphabetical position).

- [ ] **Step 3: Create layout with metadata**

```tsx
// src/app/[locale]/glossary/layout.tsx
import { getPageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/glossary', locale);
}

export default function GlossaryLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 4: Create the glossary page**

```tsx
// src/app/[locale]/glossary/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { GLOSSARY, type GlossaryEntry } from '@/lib/constants/glossary';
import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'panchang', label: 'Panchang' },
  { key: 'kundali', label: 'Kundali' },
  { key: 'dasha', label: 'Dasha' },
  { key: 'yoga', label: 'Yoga' },
  { key: 'general', label: 'General' },
] as const;

export default function GlossaryPage() {
  const locale = useLocale();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = useMemo(() => {
    let entries = [...GLOSSARY];

    if (activeCategory !== 'all') {
      entries = entries.filter(e => e.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      entries = entries.filter(e =>
        e.term.en.toLowerCase().includes(q) ||
        (e.term.hi && e.term.hi.includes(q)) ||
        e.shortDef.toLowerCase().includes(q) ||
        e.fullDef.toLowerCase().includes(q) ||
        (e.westernEquivalent && e.westernEquivalent.toLowerCase().includes(q))
      );
    }

    return entries.sort((a, b) => a.term.en.localeCompare(b.term.en));
  }, [activeCategory, searchQuery]);

  // Group by first letter
  const grouped = useMemo(() => {
    const groups: Record<string, GlossaryEntry[]> = {};
    for (const entry of filtered) {
      const letter = entry.term.en[0].toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(entry);
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filtered]);

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light mb-2">
          Vedic Astrology Glossary
        </h1>
        <p className="text-text-secondary mb-8">
          {GLOSSARY.length} terms with definitions, pronunciations, and Western equivalents.
        </p>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-bg-secondary border border-gold-primary/20 rounded-lg text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-gold-primary/40"
          />
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat.key
                  ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40'
                  : 'bg-bg-secondary text-text-secondary border border-transparent hover:border-gold-primary/20'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="text-text-secondary text-sm mb-6">
          {filtered.length} term{filtered.length !== 1 ? 's' : ''}
          {searchQuery.trim() ? ` matching "${searchQuery}"` : ''}
          {activeCategory !== 'all' ? ` in ${activeCategory}` : ''}
        </p>

        {/* Glossary entries */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeCategory}-${searchQuery}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {grouped.map(([letter, entries]) => (
              <div key={letter} className="mb-8">
                <h2 className="text-xl font-bold text-gold-primary mb-4 border-b border-gold-primary/20 pb-2">
                  {letter}
                </h2>
                <div className="space-y-6">
                  {entries.map(entry => (
                    <GlossaryEntryCard key={entry.id} entry={entry} locale={locale} />
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="text-center py-16 text-text-secondary">
                No terms found. Try a different search or category.
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'DefinedTermSet',
              name: 'Vedic Astrology Glossary',
              description: 'Comprehensive glossary of Vedic astrology (Jyotish) terms',
              url: 'https://dekhopanchang.com/en/glossary',
              hasDefinedTerm: GLOSSARY.map(entry => ({
                '@type': 'DefinedTerm',
                name: entry.term.en,
                description: entry.shortDef,
                inDefinedTermSet: 'https://dekhopanchang.com/en/glossary',
              })),
            }),
          }}
        />
      </div>
    </div>
  );
}

function GlossaryEntryCard({ entry, locale }: { entry: GlossaryEntry; locale: string }) {
  return (
    <div id={entry.id} className="scroll-mt-24">
      <div className="flex items-baseline gap-3 mb-1">
        <h3 className="text-lg font-semibold text-gold-light">
          {tl(entry.term, locale)}
        </h3>
        <span className="text-text-secondary text-sm">
          ({entry.pronunciation})
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-primary border border-gold-primary/20">
          {entry.category}
        </span>
      </div>

      {entry.term.hi && locale !== 'hi' && (
        <p className="text-text-secondary text-sm mb-2">
          {entry.term.hi}
          {entry.term.sa && entry.term.sa !== entry.term.hi && ` · ${entry.term.sa}`}
        </p>
      )}

      <p className="text-text-primary text-sm leading-relaxed mb-2">
        {entry.fullDef}
      </p>

      {entry.westernEquivalent && (
        <p className="text-text-secondary text-sm mb-2">
          <span className="text-gold-primary/70">Western equivalent:</span>{' '}
          {entry.westernEquivalent}
        </p>
      )}

      {entry.relatedTerms.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-text-secondary text-xs">Related:</span>
          {entry.relatedTerms.map(refId => {
            const ref = GLOSSARY.find(e => e.id === refId);
            return (
              <a
                key={refId}
                href={`#${refId}`}
                className="text-xs text-gold-primary hover:text-gold-light transition-colors"
              >
                {ref?.term.en ?? refId}
              </a>
            );
          })}
        </div>
      )}

      {entry.seeAlso && (
        <a
          href={entry.seeAlso}
          className="inline-block mt-2 text-xs text-gold-primary hover:text-gold-light transition-colors"
        >
          Learn more &rarr;
        </a>
      )}
    </div>
  );
}
```

- [ ] **Step 5: Build check**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds, glossary page listed in output

- [ ] **Step 6: Verify in browser**

Navigate to `http://localhost:3000/en/glossary`. Verify:
- All 45 terms render, grouped alphabetically
- Category filter tabs work
- Search filters terms in real-time
- Anchor links (#nakshatra) scroll to correct term
- JSON-LD visible in page source
- Related term links navigate within the page
- Responsive layout on mobile/tablet/desktop

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/glossary/ src/lib/seo/metadata.ts src/app/sitemap.ts
git commit -m "feat: add glossary page with 45 Vedic astrology term definitions"
```

---

### Task 5: Sign Calculator — Comparison Panel

**Files:**
- Modify: `src/app/[locale]/sign-calculator/page.tsx`

- [ ] **Step 1: Read the current sign calculator page**

Read: `src/app/[locale]/sign-calculator/page.tsx`
Identify: where results render (after birth data computation), where to insert comparison panel.

- [ ] **Step 2: Add comparison import and state**

At the top of the file, add imports:

```ts
import { compareTropicalVsSidereal, type ComparisonPlanet } from '@/lib/ephem/comparison-engine';
import { dateToJD } from '@/lib/ephem/astronomical';
import JyotishTerm from '@/components/ui/JyotishTerm';
```

Add state variable alongside existing `result` state:

```ts
const [comparison, setComparison] = useState<{
  planets: ComparisonPlanet[];
  shiftedCount: number;
  hookLine: string;
  ayanamshaFormatted: string;
} | null>(null);
```

- [ ] **Step 3: Compute comparison when birth data is available**

Inside the existing `useEffect` that calls `computeBirthSignsAction` (around line 91), after the result is set, add:

```ts
// Compute tropical vs sidereal comparison
try {
  const [year, month, day] = dateStr.split('-').map(Number);
  const [hour, minute] = timeStr.split(':').map(Number);
  const hourDecimal = hour + minute / 60;
  const jd = dateToJD(year, month, day, hourDecimal);
  const comp = compareTropicalVsSidereal(jd);
  setComparison({
    planets: comp.planets.filter(p => p.planetId === 0 || p.planetId === 1), // Sun and Moon only
    shiftedCount: comp.planets.filter(p => p.planetId <= 1 && p.isShifted).length,
    hookLine: comp.hookLine,
    ayanamshaFormatted: comp.ayanamsha.formatted,
  });
} catch (err) {
  console.error('[sign-calculator] comparison failed:', err);
}
```

- [ ] **Step 4: Add comparison panel below existing results**

After the existing results section (after the Nakshatra card area), insert:

```tsx
{/* Tropical vs Sidereal Comparison */}
{comparison && comparison.planets.length > 0 && (
  <div className="mt-8 p-6 rounded-xl bg-bg-secondary border border-gold-primary/20">
    <h3 className="text-xl font-bold text-gold-light mb-2">
      The 24° Shift — Why Your Western Sign Is Different
    </h3>
    <p className="text-text-secondary text-sm mb-4">
      Due to the{' '}
      <JyotishTerm term="ayanamsha">precession of Earth&apos;s axis</JyotishTerm>,
      the constellations have drifted ~{comparison.ayanamshaFormatted} from where
      Western astrology places them. Here&apos;s what shifted for you:
    </p>

    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-text-secondary border-b border-gold-primary/10">
            <th className="text-left py-2 pr-4">Planet</th>
            <th className="text-left py-2 pr-4">Western (Tropical)</th>
            <th className="text-left py-2 pr-4">Vedic (Sidereal)</th>
            <th className="text-left py-2">Shifted</th>
          </tr>
        </thead>
        <tbody>
          {comparison.planets.map(p => (
            <tr
              key={p.planetId}
              className={`border-b border-gold-primary/5 ${p.isShifted ? 'text-gold-light' : 'text-text-secondary'}`}
            >
              <td className="py-2 pr-4 font-medium">
                {p.planetId === 0 ? '☉' : '☽'} {p.tropical.signName === p.tropical.signName ? (p.planetId === 0 ? 'Sun' : 'Moon') : ''}
                {p.planetId === 0 ? ' Sun' : ' Moon'}
              </td>
              <td className="py-2 pr-4">{p.tropical.signName}</td>
              <td className="py-2 pr-4">{p.sidereal.signName && typeof p.sidereal.signName === 'object' ? (p.sidereal.signName as { en: string }).en : String(p.sidereal.signName)}</td>
              <td className="py-2">
                {p.isShifted ? (
                  <span className="text-gold-primary font-semibold">✦ YES</span>
                ) : (
                  <span className="text-text-secondary">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {comparison.shiftedCount > 0 && (
      <div className="p-4 rounded-lg bg-gold-primary/5 border border-gold-primary/10 mb-4">
        <p className="text-text-primary text-sm italic">
          &ldquo;{comparison.hookLine}&rdquo;
        </p>
      </div>
    )}

    <div className="flex flex-wrap gap-3">
      <a
        href="/tropical-compare"
        className="px-4 py-2 rounded-lg bg-gold-primary/15 text-gold-light text-sm font-medium hover:bg-gold-primary/25 transition-colors"
      >
        See Full Comparison &rarr;
      </a>
    </div>
  </div>
)}
```

- [ ] **Step 5: Build check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -20`
Expected: No errors

- [ ] **Step 6: Verify in browser**

Navigate to sign calculator, enter birth data. Verify:
- Existing sign results still render correctly (no regression)
- Comparison panel appears below results
- Table shows Sun and Moon with tropical vs sidereal signs
- Shifted planets are gold highlighted
- Hook line renders in quote block
- "See Full Comparison" link present
- Responsive on mobile

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/sign-calculator/page.tsx
git commit -m "feat: add tropical vs sidereal comparison panel to sign calculator"
```

---

### Task 6: Deep-Dive Tropical Compare Page

**Files:**
- Create: `src/app/[locale]/tropical-compare/page.tsx`
- Create: `src/app/[locale]/tropical-compare/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` — add PAGE_META entry
- Modify: `src/app/sitemap.ts` — add route

This is a large page with 3 sections. The implementor should read the spec section 3.2 carefully and build section-by-section, testing each in the browser before moving to the next.

- [ ] **Step 1: Add SEO metadata and sitemap**

In `src/lib/seo/metadata.ts`, add to PAGE_META:

```ts
'/tropical-compare': {
  title: { en: 'Sidereal vs Tropical — Your Real Star Signs', hi: 'सायन बनाम निरयन — आपकी असली राशि', sa: 'सायनं निरयनं च' },
  description: { en: 'Discover why your Vedic signs differ from Western astrology. Interactive precession slider shows the 24° astronomical shift. See all 9 planets compared.', hi: 'जानें क्यों वैदिक राशि पश्चिमी ज्योतिष से भिन्न है', sa: 'वैदिकराशिपाश्चात्यज्योतिषयोर्भेदः' },
  keywords: ['sidereal vs tropical', 'vedic vs western astrology', 'precession of equinoxes', 'real zodiac sign', 'ayanamsha'],
},
```

In `src/app/sitemap.ts`, add `'/tropical-compare'` to the routes array.

- [ ] **Step 2: Create layout**

```tsx
// src/app/[locale]/tropical-compare/layout.tsx
import { getPageMetadata } from '@/lib/seo/metadata';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return getPageMetadata('/tropical-compare', locale);
}

export default function TropicalCompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 3: Create the page — Section 1 (Identity Reveal) + Section 3 (What This Means)**

Build the page with BirthForm entry, full 9-planet comparison table, hook line, and interpretive text. The precession slider (Section 2) is complex and will be added in Task 7.

```tsx
// src/app/[locale]/tropical-compare/page.tsx
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { compareTropicalVsSidereal, type FullComparison, type ComparisonPlanet } from '@/lib/ephem/comparison-engine';
import { dateToJD } from '@/lib/ephem/astronomical';
import { tl } from '@/lib/utils/trilingual';
import JyotishTerm from '@/components/ui/JyotishTerm';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const PLANET_SYMBOLS = ['☉', '☽', '♂', '☿', '♃', '♀', '♄', '☊', '☋'];

export default function TropicalComparePage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const [comparison, setComparison] = useState<FullComparison | null>(null);
  const [birthInfo, setBirthInfo] = useState<{ name: string; date: string; time: string; location: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple inline form — not the full BirthForm (that's for kundali)
  const [formData, setFormData] = useState({
    name: searchParams.get('n') ?? '',
    date: searchParams.get('d') ?? '',
    time: searchParams.get('t') ?? '12:00',
    lat: searchParams.get('lat') ?? '',
    lng: searchParams.get('lng') ?? '',
    location: searchParams.get('loc') ?? '',
  });

  const handleCompute = () => {
    if (!formData.date || !formData.lat || !formData.lng) {
      setError('Please fill in date and location.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [year, month, day] = formData.date.split('-').map(Number);
      const [hour, minute] = formData.time.split(':').map(Number);
      const hourDecimal = hour + (minute || 0) / 60;
      const jd = dateToJD(year, month, day, hourDecimal);
      const result = compareTropicalVsSidereal(jd);

      setComparison(result);
      setBirthInfo({
        name: formData.name || 'Your',
        date: formData.date,
        time: formData.time,
        location: formData.location || `${formData.lat}, ${formData.lng}`,
      });
    } catch (err) {
      console.error('[tropical-compare] computation failed:', err);
      setError('Computation failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <h1 className="text-3xl md:text-4xl font-bold text-gold-light mb-2">
          Your Astronomical Truth
        </h1>
        <p className="text-text-secondary mb-8">
          See how the{' '}
          <JyotishTerm term="ayanamsha">precession of the equinoxes</JyotishTerm>{' '}
          shifts your planetary positions between Western (tropical) and Vedic (sidereal) zodiacs.
        </p>

        {/* Birth Data Form */}
        {!comparison && (
          <div className="p-6 rounded-xl bg-bg-secondary border border-gold-primary/20 mb-8">
            <h2 className="text-lg font-semibold text-gold-light mb-4">Enter Birth Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-text-secondary text-sm mb-1">Name (optional)</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Date of Birth *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={e => setFormData(p => ({ ...p, date: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Time of Birth</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Location *</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                  placeholder="City name"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Latitude *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lat}
                  onChange={e => setFormData(p => ({ ...p, lat: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                  placeholder="46.4602"
                />
              </div>
              <div>
                <label className="block text-text-secondary text-sm mb-1">Longitude *</label>
                <input
                  type="number"
                  step="any"
                  value={formData.lng}
                  onChange={e => setFormData(p => ({ ...p, lng: e.target.value }))}
                  className="w-full px-3 py-2 bg-bg-primary border border-gold-primary/20 rounded-lg text-text-primary focus:outline-none focus:border-gold-primary/40"
                  placeholder="6.8421"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            <button
              onClick={handleCompute}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-gold-primary/20 text-gold-light font-medium hover:bg-gold-primary/30 transition-colors disabled:opacity-50"
            >
              {loading ? 'Computing...' : 'Reveal My Astronomical Truth'}
            </button>
          </div>
        )}

        {/* Results */}
        <AnimatePresence mode="wait">
          {comparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Reset button */}
              <button
                onClick={() => { setComparison(null); setBirthInfo(null); }}
                className="text-text-secondary text-sm mb-6 hover:text-gold-light transition-colors"
              >
                &larr; Enter different birth data
              </button>

              {/* Section 1: Identity Reveal */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gold-light mb-2">
                  {birthInfo?.name ? `${birthInfo.name}'s` : 'Your'} Signs — Two Systems Compared
                </h2>
                <p className="text-text-secondary text-sm mb-6">
                  <JyotishTerm term="ayanamsha">Ayanamsha</JyotishTerm>: {comparison.ayanamsha.formatted} ({comparison.ayanamsha.type})
                </p>

                {/* Comparison table */}
                <div className="overflow-x-auto rounded-xl border border-gold-primary/20">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-bg-secondary text-text-secondary border-b border-gold-primary/10">
                        <th className="text-left py-3 px-4">Planet</th>
                        <th className="text-left py-3 px-4">Western (Tropical)</th>
                        <th className="text-left py-3 px-4">Vedic (Sidereal)</th>
                        <th className="text-left py-3 px-4">Nakshatra</th>
                        <th className="text-center py-3 px-4">Shifted</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.planets.map((p, i) => (
                        <tr
                          key={p.planetId}
                          className={`border-b border-gold-primary/5 transition-colors ${
                            p.isShifted ? 'bg-gold-primary/5' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-medium text-text-primary">
                            <span className="mr-2">{PLANET_SYMBOLS[p.planetId]}</span>
                            {tl(p.planetName, locale)}
                          </td>
                          <td className={`py-3 px-4 ${p.isShifted ? 'text-text-secondary line-through' : 'text-text-primary'}`}>
                            {p.tropical.signName}
                            <span className="text-text-secondary ml-1 text-xs">
                              {p.tropical.degreeInSign.toFixed(1)}°
                            </span>
                          </td>
                          <td className={`py-3 px-4 ${p.isShifted ? 'text-gold-light font-semibold' : 'text-text-primary'}`}>
                            {tl(p.sidereal.signName, locale)}
                            <span className="text-text-secondary ml-1 text-xs">
                              {p.sidereal.degreeInSign.toFixed(1)}°
                            </span>
                          </td>
                          <td className="py-3 px-4 text-text-secondary">
                            {p.sidereal.nakshatra ? (
                              <JyotishTerm term="nakshatra">
                                {tl(p.sidereal.nakshatra.name, locale)} (Pada {p.sidereal.nakshatra.pada})
                              </JyotishTerm>
                            ) : '—'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            {p.isShifted ? (
                              <span className="text-gold-primary font-bold">✦</span>
                            ) : (
                              <span className="text-text-secondary">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary */}
                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span className="text-gold-light font-semibold">
                    {comparison.shiftedCount} of {comparison.planets.length} planets shifted sign
                  </span>
                </div>

                {/* Hook line */}
                <div className="mt-6 p-5 rounded-xl bg-gold-primary/5 border border-gold-primary/10">
                  <p className="text-text-primary italic text-lg leading-relaxed">
                    &ldquo;{comparison.hookLine}&rdquo;
                  </p>
                </div>
              </div>

              {/* Section 2: Precession Slider — placeholder for Task 7 */}
              <div className="mb-12 p-8 rounded-xl bg-bg-secondary border border-gold-primary/20">
                <h2 className="text-2xl font-bold text-gold-light mb-4">
                  The Precession of the Equinoxes
                </h2>
                <p className="text-text-secondary mb-4">
                  In {comparison.precessionData.epochYear} AD, the tropical and sidereal zodiacs were aligned.
                  Since then, Earth&apos;s axial wobble has shifted them apart by ~{comparison.ayanamsha.formatted}.
                </p>
                <p className="text-text-secondary text-sm italic">
                  Interactive precession slider — drag to see the drift over 1,700 years.
                </p>
                {/* PrecessionSlider component will be added in Task 7 */}
              </div>

              {/* Section 3: What This Means */}
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gold-light mb-6">
                  What the Vedic View Reveals
                </h2>

                {comparison.planets.filter(p => p.isShifted).slice(0, 3).map(p => (
                  <div key={p.planetId} className="mb-6 p-5 rounded-xl bg-bg-secondary border border-gold-primary/10">
                    <h3 className="text-lg font-semibold text-gold-light mb-2">
                      {PLANET_SYMBOLS[p.planetId]} {tl(p.planetName, locale)} — {p.shiftDescription}
                    </h3>
                    <p className="text-text-primary text-sm leading-relaxed">
                      Western astrology places your {tl(p.planetName, locale).toLowerCase()} in {p.tropical.signName},
                      but the actual constellation position is {tl(p.sidereal.signName, locale)}.
                      {p.sidereal.nakshatra && (
                        <span>
                          {' '}Your <JyotishTerm term="nakshatra">Nakshatra</JyotishTerm> is{' '}
                          {tl(p.sidereal.nakshatra.name, locale)} (Pada {p.sidereal.nakshatra.pada}) — a level of precision
                          that Western astrology cannot provide.
                        </span>
                      )}
                    </p>
                  </div>
                ))}

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 mt-8">
                  <Link
                    href={`/kundali${birthInfo ? `?n=${encodeURIComponent(birthInfo.name)}&d=${birthInfo.date}&t=${birthInfo.time}` : ''}`}
                    className="px-6 py-3 rounded-lg bg-gold-primary/20 text-gold-light font-medium hover:bg-gold-primary/30 transition-colors"
                  >
                    Generate Full Birth Chart &rarr;
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Build check**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds

- [ ] **Step 5: Verify in browser**

Navigate to `/en/tropical-compare`. Verify:
- Form renders, accepts input
- Results show after computation
- 9-planet comparison table renders
- Shifted planets highlighted
- Hook line displays
- Interpretive text for shifted planets
- "Generate Full Birth Chart" link works
- Responsive on mobile
- No console errors

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/tropical-compare/ src/lib/seo/metadata.ts src/app/sitemap.ts
git commit -m "feat: add tropical vs sidereal deep-dive comparison page"
```

---

### Task 7: Precession Slider (Interactive SVG)

**Files:**
- Modify: `src/app/[locale]/tropical-compare/page.tsx` — replace slider placeholder

This is the most visually complex component. The implementor should reference the spec's Section 2 (Precession Slider) for the interaction design.

- [ ] **Step 1: Create PrecessionSlider component inline or extracted**

Add a `PrecessionSlider` component (can be inline in the page file or extracted to `src/components/comparison/PrecessionSlider.tsx`). Key requirements:

- SVG with two concentric rings (inner = fixed sidereal, outer = rotating tropical)
- Slider input (HTML range) from epoch year (285 AD) to 2026
- As slider moves, outer ring rotates by `ayanamshaAtYear * 1` degrees
- Planet dots on inner ring at their sidereal positions
- Dynamic text showing current year + ayanamsha offset

The implementor should build this iteratively: first get the slider + text working, then add the SVG rings, then the planet dots. Test each step in the browser.

- [ ] **Step 2: Replace placeholder in page.tsx**

Replace the "Interactive precession slider" placeholder div with the actual component.

- [ ] **Step 3: Verify in browser**

- Slider drags smoothly
- Year and ayanamsha text updates in real-time
- SVG rings rotate visually
- Planet dots visible on inner ring
- At epoch year (285), rings are aligned
- At 2026, offset matches computed ayanamsha
- No performance issues (60fps drag)
- Works on mobile (touch drag)

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/tropical-compare/page.tsx
# (or also src/components/comparison/PrecessionSlider.tsx if extracted)
git commit -m "feat: add interactive precession slider to tropical comparison page"
```

---

### Task 8: Discovery Share Card

**Files:**
- Modify: `src/lib/shareable/card-base.ts` — add 'discovery' to CardType
- Modify: `src/app/api/card/[type]/route.tsx` — add discovery card rendering
- Modify: `src/app/[locale]/tropical-compare/page.tsx` — add share button

- [ ] **Step 1: Extend CardType**

In `src/lib/shareable/card-base.ts`, update the CardType union (line 16):

```ts
export type CardType = 'birth-poster' | 'daily-vibe' | 'yoga-badge' | 'discovery' | 'blueprint' | 'compatibility';
```

Update `isValidCardType` function (line 151) to include the new types.

- [ ] **Step 2: Add discovery card rendering to API route**

In `src/app/api/card/[type]/route.tsx`, add a rendering branch for `type === 'discovery'`. The card should accept query params: `tropicalSign`, `siderealSign`, `shiftedCount`, `totalPlanets`, `hookLine`, `ayanamsha`.

Render using Satori's JSX: navy background, split layout, signs in large text, hook line, QR code placeholder, watermark.

- [ ] **Step 3: Add "Share Discovery Card" button to tropical-compare page**

Import `ShareCardButton` and `CardPreviewModal`. Add state for card modal. Wire the button to generate the card URL with query params from the comparison data.

- [ ] **Step 4: Verify in browser**

- Click "Share Discovery Card"
- Preview modal opens with card image
- Share/download buttons work
- Card renders correctly in all formats

- [ ] **Step 5: Commit**

```bash
git add src/lib/shareable/card-base.ts src/app/api/card/[type]/route.tsx src/app/[locale]/tropical-compare/page.tsx
git commit -m "feat: add discovery share card for tropical vs sidereal comparison"
```

---

### Task 9: Navigation Integration (Phase 1)

**Files:**
- Modify: `src/components/layout/Navbar.tsx` — add Tropical Compare + Glossary links

- [ ] **Step 1: Add links to navbar**

In `src/components/layout/Navbar.tsx`, add to the Tools dropdown children array (around lines 142-162):

```ts
{ href: '/tropical-compare', label: t('tropicalCompare') ?? 'Sidereal vs Tropical' },
```

Add Glossary to the footer links (or a suitable location — check existing footer component).

- [ ] **Step 2: Add translation keys**

Add `tropicalCompare` to the navbar translation namespace in `src/messages/en/components.json` (or wherever navbar translations live). Add for all active locales.

- [ ] **Step 3: Build check + verify**

Run: `npx next build`
Verify in browser: new link appears in Tools dropdown, navigates correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/messages/
git commit -m "feat: add tropical compare and glossary to navigation"
```

---

### Task 10: Phase 1 Integration Test + Full Build

- [ ] **Step 1: Run all existing tests**

Run: `npx vitest run`
Expected: All tests pass (no regressions)

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: No errors

- [ ] **Step 3: Run production build**

Run: `npx next build`
Expected: Build succeeds, new pages listed

- [ ] **Step 4: Full browser verification**

Check each new page/feature:
1. `/en/glossary` — search, filter, anchor links, responsive
2. `/en/tropical-compare` — full flow from form to results to share
3. Sign calculator — comparison panel renders, no regression
4. Navbar — new links work
5. JyotishTerm tooltips — hover/tap on any page using them
6. No console errors on any page

- [ ] **Step 5: Commit checkpoint**

```bash
git commit --allow-empty -m "chore: Phase 1 complete — Foundation + Sidereal Comparison verified"
```

---

## Phase 2: Feature 3 — The Cosmic Blueprint

### Task 11: Archetype Data

**Files:**
- Create: `src/lib/constants/archetype-data.ts`

- [ ] **Step 1: Create archetype definitions**

```ts
// src/lib/constants/archetype-data.ts
import type { LocaleText } from '@/types/panchang';

export type ArchetypeId = 'sovereign' | 'empath' | 'warrior' | 'analyst' | 'visionary' | 'harmonizer' | 'architect' | 'maverick' | 'mystic';

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: LocaleText;
  planetId: number;
  coreDescription: string;
  traits: string[];
  blindSpot: string;
  shadowDescription: string;
  growthArea: string;
  chapterDescription: string;
  chapterThemes: string[];
}

// Maps planet ID to archetype
export const ARCHETYPES: Record<number, ArchetypeDefinition> = {
  0: {
    id: 'sovereign',
    name: { en: 'The Sovereign', hi: 'सम्राट', sa: 'सम्राट्' },
    planetId: 0,
    coreDescription: 'Your identity is anchored in purpose and authority. You process the world through a lens of significance — everything connects to your core mission. You naturally command attention and create order from chaos. Your strength is clarity of vision.',
    traits: ['purpose-driven', 'authoritative', 'decisive', 'dignified'],
    blindSpot: 'Need for recognition can overshadow collaborative instincts. You may struggle to lead without needing to be seen leading.',
    shadowDescription: 'When the Sun is your weakest influence, identity feels unstable. You seek external validation instead of generating your own sense of purpose.',
    growthArea: 'Building an internal sense of worth that doesn\'t depend on title, role, or others\' acknowledgment.',
    chapterDescription: 'A Sun chapter brings questions of identity, authority, and purpose to the forefront. Career visibility peaks. You\'re drawn to lead, to define yourself through achievement. Father/authority figures become important.',
    chapterThemes: ['leadership', 'career visibility', 'father figures', 'self-definition', 'authority'],
  },
  1: {
    id: 'empath',
    name: { en: 'The Empath', hi: 'सहानुभूतिशील', sa: 'सहानुभूतिवान्' },
    planetId: 1,
    coreDescription: 'Your mind leads with emotional intelligence. You absorb and process the feelings of those around you before logic kicks in. Your instinct is to nurture, protect, and create safety. Creativity flows from emotional depth.',
    traits: ['emotionally intelligent', 'nurturing', 'intuitive', 'receptive'],
    blindSpot: 'Absorbing others\' emotions can blur the boundary between your feelings and theirs. Decision-making suffers when everything feels personal.',
    shadowDescription: 'When the Moon is your weakest influence, emotional navigation feels unreliable. You may intellectualize feelings rather than processing them, leading to sudden emotional floods.',
    growthArea: 'Developing healthy emotional boundaries without shutting down sensitivity entirely.',
    chapterDescription: 'A Moon chapter amplifies emotional life, domestic matters, and inner world exploration. Relationships with women and mother figures intensify. Mental health awareness peaks. Travel and changes of residence are common.',
    chapterThemes: ['emotional growth', 'home/family', 'mother figures', 'mental health', 'travel'],
  },
  2: {
    id: 'warrior',
    name: { en: 'The Warrior', hi: 'योद्धा', sa: 'योद्धा' },
    planetId: 2,
    coreDescription: 'Action is your language. You process the world through what can be done, fixed, built, or fought for. Courage comes naturally — you advance where others hesitate. Physical vitality and competitive drive define your approach.',
    traits: ['action-oriented', 'courageous', 'competitive', 'direct'],
    blindSpot: 'Impatience with process. You may push through obstacles that required patience, not force. Relationships suffer when everything becomes a competition.',
    shadowDescription: 'When Mars is your weakest influence, assertiveness feels foreign. You avoid confrontation even when it\'s necessary, leading to passive resentment.',
    growthArea: 'Learning to assert needs directly without aggression or avoidance — finding the middle ground.',
    chapterDescription: 'A Mars chapter brings energy, ambition, and conflict to the surface. Property matters, sibling dynamics, and technical skills become prominent. Physical vitality peaks but so do risks of injury or surgery.',
    chapterThemes: ['ambition', 'property', 'siblings', 'physical energy', 'technical skill', 'surgery risk'],
  },
  3: {
    id: 'analyst',
    name: { en: 'The Analyst', hi: 'विश्लेषक', sa: 'विश्लेषकः' },
    planetId: 3,
    coreDescription: 'Your mind is your primary instrument. You process the world through pattern recognition, communication, and logical frameworks. Adaptability is your superpower — you shift between domains with ease. Learning is compulsive, not optional.',
    traits: ['analytical', 'adaptable', 'articulate', 'curious'],
    blindSpot: 'Overthinking paralysis. You can analyze a situation from 12 angles and still feel unprepared to act. Communication substitutes for connection.',
    shadowDescription: 'When Mercury is your weakest influence, clear thinking feels effortful. You may struggle with focus, misread social cues, or find written/verbal expression frustrating.',
    growthArea: 'Trusting intuition alongside analysis. Not every decision needs a framework.',
    chapterDescription: 'A Mercury chapter emphasizes communication, commerce, education, and intellectual growth. Writing, teaching, and technology projects thrive. Social networks expand. Nervous energy increases.',
    chapterThemes: ['communication', 'education', 'commerce', 'writing', 'technology', 'social networking'],
  },
  4: {
    id: 'visionary',
    name: { en: 'The Visionary', hi: 'दूरदर्शी', sa: 'दूरदर्शी' },
    planetId: 4,
    coreDescription: 'Meaning is your currency. You process the world through a lens of purpose, ethics, and expansion. Teaching, mentoring, and philosophical exploration come naturally. Generosity of spirit defines your presence.',
    traits: ['wise', 'expansive', 'optimistic', 'principled'],
    blindSpot: 'Over-commitment and blind optimism. You say yes to everything that sounds meaningful, spreading yourself impossibly thin. Advice-giving can become unsolicited.',
    shadowDescription: 'When Jupiter is your weakest influence, life feels purposeless. Cynicism replaces faith. You may struggle to see the bigger picture or find meaning in daily routines.',
    growthArea: 'Accepting that not everything needs meaning to be valuable. Learning to rest without purpose.',
    chapterDescription: 'A Jupiter chapter brings expansion through wisdom, travel, education, and spiritual growth. Children, teachers, and mentors become central figures. Financial growth through ethical means. Foreign connections flourish.',
    chapterThemes: ['expansion', 'teaching', 'foreign travel', 'higher learning', 'children', 'spirituality'],
  },
  5: {
    id: 'harmonizer',
    name: { en: 'The Harmonizer', hi: 'सामंजस्यकारी', sa: 'सामञ्जस्यकारी' },
    planetId: 5,
    coreDescription: 'Beauty and connection are your compass. You process the world through aesthetics, relationships, and sensory experience. Creating harmony — in environments, relationships, and art — is your instinct. Diplomacy comes naturally.',
    traits: ['aesthetic', 'diplomatic', 'sensual', 'relational'],
    blindSpot: 'Conflict avoidance masquerading as diplomacy. You may sacrifice your truth to keep the peace, then resent the cost. Comfort can become a trap.',
    shadowDescription: 'When Venus is your weakest influence, pleasure feels guilt-inducing. Relationships lack depth or feel transactional. Creative expression stalls.',
    growthArea: 'Embracing necessary conflict as a form of intimacy, not a failure of diplomacy.',
    chapterDescription: 'A Venus chapter brings love, luxury, creativity, and partnerships to the foreground. Marriage/relationship themes intensify. Artistic expression flourishes. Financial comfort improves through partnerships or creative ventures.',
    chapterThemes: ['love', 'marriage', 'creativity', 'luxury', 'partnerships', 'artistic expression'],
  },
  6: {
    id: 'architect',
    name: { en: 'The Architect', hi: 'वास्तुकार', sa: 'वास्तुकारः' },
    planetId: 6,
    coreDescription: 'Structure is your safety net and your art. You process the world through systems, long-term planning, and endurance. Discipline isn\'t imposed on you — it\'s how you think. You build things that last because you cannot tolerate fragility.',
    traits: ['disciplined', 'structured', 'enduring', 'methodical'],
    blindSpot: 'Rigidity disguised as thoroughness. You may resist change even when the structure is no longer serving its purpose. Isolation feels productive but becomes habitual.',
    shadowDescription: 'When Saturn is your weakest influence, structure feels oppressive rather than supportive. You may rebel against responsibility or struggle with chronic procrastination.',
    growthArea: 'Learning that flexibility is not weakness, and that some structures need to be dismantled to build better ones.',
    chapterDescription: 'A Saturn chapter demands discipline, responsibility, and maturation. Career advancement through persistent effort. Delays test patience but build character. Authority figures and legal matters feature prominently.',
    chapterThemes: ['discipline', 'career building', 'responsibility', 'delays/patience', 'legal matters', 'maturation'],
  },
  7: {
    id: 'maverick',
    name: { en: 'The Maverick', hi: 'विद्रोही', sa: 'विद्रोही' },
    planetId: 7,
    coreDescription: 'Disruption is your talent and your curse. You process the world through what\'s missing, what\'s broken, what could be radically different. Conventional paths feel suffocating. You\'re drawn to the unconventional, the foreign, the taboo.',
    traits: ['ambitious', 'unconventional', 'obsessive', 'disruptive'],
    blindSpot: 'Compulsive striving without clear purpose. The hunger for "more" never has a finish line. Identity can fragment when you chase too many possibilities.',
    shadowDescription: 'When Rahu is your weakest influence, ambition feels directionless. You may cling to convention out of fear rather than choice, or feel perpetually out of place.',
    growthArea: 'Distinguishing between genuine calling and compulsive craving. Learning when "enough" is enough.',
    chapterDescription: 'A Rahu chapter brings obsessive ambition, foreign connections, and unconventional pursuits. Technology, media, and cross-cultural experiences dominate. Material gains come through unusual means. Identity undergoes radical transformation.',
    chapterThemes: ['obsessive ambition', 'foreign travel', 'technology', 'unconventional paths', 'material gains', 'identity transformation'],
  },
  8: {
    id: 'mystic',
    name: { en: 'The Mystic', hi: 'रहस्यवादी', sa: 'रहस्यवादी' },
    planetId: 8,
    coreDescription: 'Detachment is your gift. You process the world through intuition and subtraction — what can be released, simplified, transcended. Spiritual insight comes naturally. You see through surfaces to underlying patterns others miss.',
    traits: ['intuitive', 'detached', 'perceptive', 'spiritual'],
    blindSpot: 'Disconnection masquerading as transcendence. You may check out of practical reality or relationships under the guise of being "above it all." Apathy and escapism are close neighbors of detachment.',
    shadowDescription: 'When Ketu is your weakest influence, spiritual life feels empty or performative. You may cling to material security with unusual intensity, fearing the loss you sense is inevitable.',
    growthArea: 'Engaging with the world fully while maintaining awareness. Detachment that includes, rather than excludes.',
    chapterDescription: 'A Ketu chapter brings spiritual awakening, loss that leads to liberation, and detachment from material concerns. Past life patterns surface. Meditation and introspection deepen. Sudden insights and unexpected separations.',
    chapterThemes: ['spiritual awakening', 'liberation through loss', 'meditation', 'past patterns', 'sudden insights', 'detachment'],
  },
};

// Yoga psychological interpretations (top yogas that commonly appear)
export const YOGA_PSYCH_INSIGHTS: Record<string, string> = {
  gajakesari: 'Your emotional intelligence amplifies your wisdom drive. You teach through empathy, not authority.',
  budhaditya: 'Sun-Mercury conjunction gives your analytical nature executive presence. People listen when you speak.',
  chandra_mangala: 'Moon-Mars conjunction creates emotional intensity. You feel passionately and act on instinct.',
  hamsa: 'Jupiter in a Kendra in its own/exalted sign gives natural wisdom and spiritual magnetism.',
  malavya: 'Venus in a Kendra in its own/exalted sign brings artistic talent and relationship grace.',
  ruchaka: 'Mars in a Kendra in its own/exalted sign gives physical dynamism and leadership courage.',
  shasha: 'Saturn in a Kendra in its own/exalted sign provides structured discipline and endurance.',
  bhadra: 'Mercury in a Kendra in its own/exalted sign sharpens communication and intellectual precision.',
  viparita_raja: 'Challenge becomes fuel. Hardship in specific life areas paradoxically unlocks authority and growth.',
  neecha_bhanga: 'A debilitated planet with cancellation — what looks like weakness becomes your unexpected strength.',
  kemadruma: 'Moon without planetary support. Emotional self-reliance is your path — you learned early to be your own anchor.',
  sade_sati: 'Saturn\'s 7.5-year transit over your Moon. A period of pressure that forges emotional maturity and resilience.',
};

// Lagna modifier descriptions
export const LAGNA_MODIFIERS: Record<number, string> = {
  1: 'through Aries\'s direct, pioneering energy — you lead with action, not deliberation',
  2: 'through Taurus\'s grounded, sensory lens — you build steadily, valuing tangible results',
  3: 'through Gemini\'s curious, communicative style — you adapt quickly and connect widely',
  4: 'through Cancer\'s protective, nurturing instinct — you create safety for yourself and others',
  5: 'through Leo\'s dignified, expressive nature — you command attention naturally',
  6: 'through Virgo\'s precise, service-oriented approach — you improve everything you touch',
  7: 'through Libra\'s diplomatic, harmony-seeking lens — you mediate, balance, and beautify',
  8: 'through Scorpio\'s intense, investigative depth — you see beneath surfaces instinctively',
  9: 'through Sagittarius\'s expansive, philosophical vision — you seek meaning in everything',
  10: 'through Capricorn\'s disciplined, ambitious structure — you build for the long term',
  11: 'through Aquarius\'s innovative, community-minded perspective — you think systemically',
  12: 'through Pisces\'s intuitive, compassionate awareness — you absorb the world\'s feelings',
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/archetype-data.ts
git commit -m "feat: add archetype definitions, yoga insights, and lagna modifiers"
```

---

### Task 12: Archetype Engine

**Files:**
- Create: `src/lib/kundali/archetype-engine.ts`
- Test: `src/lib/__tests__/archetype-engine.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/__tests__/archetype-engine.test.ts
import { describe, it, expect } from 'vitest';
import { generateCosmicBlueprint, type CosmicBlueprint } from '../kundali/archetype-engine';
import type { ShadBalaComplete } from '../kundali/shadbala';

// Mock minimal ShadBala data — Mercury strongest, Venus weakest
const mockShadbala: ShadBalaComplete[] = [
  { planetId: 0, planet: 'Sun', strengthRatio: 1.2, rupas: 390, totalPinda: 390, minRequired: 390, rank: 3, sthanaBala: 100, digBala: 60, kalaBala: 100, cheshtaBala: 60, naisargikaBala: 60, drikBala: 10, ishtaPhala: 30, kashtaPhala: 20, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 1, planet: 'Moon', strengthRatio: 1.0, rupas: 360, totalPinda: 360, minRequired: 360, rank: 5, sthanaBala: 90, digBala: 50, kalaBala: 90, cheshtaBala: 60, naisargikaBala: 50, drikBala: 20, ishtaPhala: 25, kashtaPhala: 25, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 2, planet: 'Mars', strengthRatio: 1.1, rupas: 300, totalPinda: 300, minRequired: 300, rank: 4, sthanaBala: 80, digBala: 40, kalaBala: 80, cheshtaBala: 50, naisargikaBala: 40, drikBala: 10, ishtaPhala: 20, kashtaPhala: 20, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 3, planet: 'Mercury', strengthRatio: 1.8, rupas: 540, totalPinda: 540, minRequired: 300, rank: 1, sthanaBala: 130, digBala: 70, kalaBala: 130, cheshtaBala: 80, naisargikaBala: 70, drikBala: 60, ishtaPhala: 40, kashtaPhala: 10, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 4, planet: 'Jupiter', strengthRatio: 1.3, rupas: 520, totalPinda: 520, minRequired: 390, rank: 2, sthanaBala: 120, digBala: 65, kalaBala: 120, cheshtaBala: 80, naisargikaBala: 75, drikBala: 60, ishtaPhala: 35, kashtaPhala: 15, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 5, planet: 'Venus', strengthRatio: 0.6, rupas: 210, totalPinda: 210, minRequired: 330, rank: 7, sthanaBala: 50, digBala: 30, kalaBala: 50, cheshtaBala: 30, naisargikaBala: 40, drikBala: 10, ishtaPhala: 10, kashtaPhala: 30, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
  { planetId: 6, planet: 'Saturn', strengthRatio: 0.9, rupas: 270, totalPinda: 270, minRequired: 300, rank: 6, sthanaBala: 70, digBala: 30, kalaBala: 70, cheshtaBala: 50, naisargikaBala: 30, drikBala: 20, ishtaPhala: 15, kashtaPhala: 25, sthanaBreakdown: {} as any, kalaBreakdown: {} as any },
];

// Mock dashas — Jupiter current, Saturn next
const mockDashas = [
  { planet: 'Jupiter', startDate: new Date('2019-06-15'), endDate: new Date('2035-06-15'), years: 16, subPeriods: [] },
  { planet: 'Saturn', startDate: new Date('2035-06-15'), endDate: new Date('2054-06-15'), years: 19, subPeriods: [] },
];

// Mock yogas
const mockYogas = [
  { id: 'gajakesari', name: { en: 'Gajakesari' }, present: true, strength: 'Strong' as const, isAuspicious: true, category: 'moon_based' as const, formationRule: { en: '' }, description: { en: '' } },
  { id: 'budhaditya', name: { en: 'Budhaditya' }, present: true, strength: 'Moderate' as const, isAuspicious: true, category: 'sun_based' as const, formationRule: { en: '' }, description: { en: '' } },
];

describe('generateCosmicBlueprint', () => {
  const blueprint = generateCosmicBlueprint({
    shadbala: mockShadbala,
    dashas: mockDashas,
    yogas: mockYogas,
    ascendantSign: 4, // Cancer
    planets: [],
  });

  it('selects Mercury (highest strengthRatio) as primary archetype', () => {
    expect(blueprint.primary.planet).toBe(3);
    expect(blueprint.primary.archetype).toBe('analyst');
  });

  it('selects Venus (lowest strengthRatio) as shadow archetype', () => {
    expect(blueprint.shadow.planet).toBe(5);
    expect(blueprint.shadow.archetype).toBe('harmonizer');
  });

  it('maps current dasha (Jupiter) to Visionary chapter', () => {
    expect(blueprint.currentChapter.dashaLord).toBe(4);
    expect(blueprint.currentChapter.archetype).toBe('visionary');
  });

  it('maps next dasha (Saturn) to Architect chapter', () => {
    expect(blueprint.nextChapter.dashaLord).toBe(6);
    expect(blueprint.nextChapter.archetype).toBe('architect');
  });

  it('generates a non-empty headline', () => {
    expect(blueprint.headline.length).toBeGreaterThan(20);
    expect(blueprint.headline).toContain('Analyst');
  });

  it('includes persona modifier for Cancer lagna', () => {
    expect(blueprint.persona.lagnaSign).toBe(4);
    expect(blueprint.persona.expression.length).toBeGreaterThan(10);
  });

  it('includes active yoga influences', () => {
    expect(blueprint.activeYogas.length).toBeGreaterThan(0);
    const gk = blueprint.activeYogas.find(y => y.name.en === 'Gajakesari');
    expect(gk).toBeTruthy();
    expect(gk!.influence.length).toBeGreaterThan(10);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/archetype-engine.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the archetype engine**

```ts
// src/lib/kundali/archetype-engine.ts
import { ARCHETYPES, YOGA_PSYCH_INSIGHTS, LAGNA_MODIFIERS, type ArchetypeId } from '@/lib/constants/archetype-data';
import type { ShadBalaComplete } from './shadbala';
import type { LocaleText } from '@/types/panchang';

// Planet name -> ID mapping
const PLANET_NAME_TO_ID: Record<string, number> = {
  Sun: 0, Moon: 1, Mars: 2, Mercury: 3, Jupiter: 4,
  Venus: 5, Saturn: 6, Rahu: 7, Ketu: 8,
};

export interface CosmicBlueprint {
  primary: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    traits: string[];
    blindSpot: string;
  };
  shadow: {
    archetype: ArchetypeId;
    name: LocaleText;
    planet: number;
    strength: number;
    description: string;
    growthArea: string;
  };
  currentChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    endDate: Date;
    yearsRemaining: number;
    description: string;
    themes: string[];
  };
  nextChapter: {
    archetype: ArchetypeId;
    name: LocaleText;
    dashaLord: number;
    startDate: Date;
    transitionNote: string;
  };
  persona: {
    lagnaSign: number;
    expression: string;
  };
  activeYogas: {
    name: LocaleText;
    influence: string;
  }[];
  headline: string;
}

interface BlueprintInput {
  shadbala: ShadBalaComplete[];
  dashas: { planet: string; startDate: Date; endDate: Date; years: number }[];
  yogas: { id: string; name: LocaleText; present: boolean; strength: string; isAuspicious: boolean }[];
  ascendantSign: number;
  planets: { id: number; longitude: number }[];
  rahuLongitude?: number;
  ketuLongitude?: number;
  lagnaLordId?: number;
  moonLongitude?: number;
}

function getPlanetArchetype(planetId: number) {
  return ARCHETYPES[planetId];
}

function findCurrentDasha(dashas: BlueprintInput['dashas'], now: Date) {
  return dashas.find(d => now >= d.startDate && now < d.endDate);
}

function findNextDasha(dashas: BlueprintInput['dashas'], now: Date) {
  const currentIdx = dashas.findIndex(d => now >= d.startDate && now < d.endDate);
  if (currentIdx >= 0 && currentIdx < dashas.length - 1) {
    return dashas[currentIdx + 1];
  }
  return null;
}

function shouldRahuKetuOverride(input: BlueprintInput): number | null {
  // Check if Rahu or Ketu are conjunct lagna lord or Moon (within 10°)
  if (!input.rahuLongitude || !input.ketuLongitude) return null;
  if (!input.lagnaLordId && !input.moonLongitude) return null;

  const lagnaLordPlanet = input.planets.find(p => p.id === input.lagnaLordId);
  const checkConjunction = (nodeLong: number, targetLong: number) => {
    const diff = Math.abs(nodeLong - targetLong);
    const normalized = diff > 180 ? 360 - diff : diff;
    return normalized <= 10;
  };

  // Check Rahu first (takes precedence per spec)
  if (lagnaLordPlanet && checkConjunction(input.rahuLongitude, lagnaLordPlanet.longitude)) return 7;
  if (input.moonLongitude !== undefined && checkConjunction(input.rahuLongitude, input.moonLongitude)) return 7;

  // Then Ketu
  if (lagnaLordPlanet && checkConjunction(input.ketuLongitude, lagnaLordPlanet.longitude)) return 8;
  if (input.moonLongitude !== undefined && checkConjunction(input.ketuLongitude, input.moonLongitude)) return 8;

  return null;
}

export function generateCosmicBlueprint(input: BlueprintInput): CosmicBlueprint {
  const now = new Date();

  // --- Primary archetype ---
  // Check Rahu/Ketu override first
  const nodeOverride = shouldRahuKetuOverride(input);

  let primaryPlanetId: number;
  let primaryStrength: number;

  if (nodeOverride !== null) {
    primaryPlanetId = nodeOverride;
    primaryStrength = 0; // Nodes don't have Shadbala
  } else {
    // Highest strengthRatio from Sun-Saturn (IDs 0-6)
    const sorted = [...input.shadbala].filter(s => s.planetId <= 6).sort((a, b) => b.strengthRatio - a.strengthRatio);
    primaryPlanetId = sorted[0]?.planetId ?? 0;
    primaryStrength = sorted[0]?.strengthRatio ?? 0;
  }

  const primaryDef = getPlanetArchetype(primaryPlanetId);

  // --- Shadow archetype ---
  const sortedAsc = [...input.shadbala].filter(s => s.planetId <= 6).sort((a, b) => a.strengthRatio - b.strengthRatio);
  const shadowPlanetId = sortedAsc[0]?.planetId ?? 6;
  const shadowStrength = sortedAsc[0]?.strengthRatio ?? 0;
  const shadowDef = getPlanetArchetype(shadowPlanetId);

  // --- Current chapter (dasha) ---
  const currentDasha = findCurrentDasha(input.dashas, now);
  const currentDashaLordId = currentDasha ? (PLANET_NAME_TO_ID[currentDasha.planet] ?? 0) : 0;
  const currentChapterDef = getPlanetArchetype(currentDashaLordId);
  const yearsRemaining = currentDasha
    ? Math.max(0, (currentDasha.endDate.getTime() - now.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
    : 0;

  // --- Next chapter ---
  const nextDasha = findNextDasha(input.dashas, now);
  const nextDashaLordId = nextDasha ? (PLANET_NAME_TO_ID[nextDasha.planet] ?? 0) : 0;
  const nextChapterDef = getPlanetArchetype(nextDashaLordId);

  // --- Persona modifier ---
  const lagnaModifier = LAGNA_MODIFIERS[input.ascendantSign] ?? '';

  // --- Yoga influences ---
  const presentYogas = input.yogas.filter(y => y.present);
  const activeYogas = presentYogas
    .map(y => {
      const insight = YOGA_PSYCH_INSIGHTS[y.id];
      if (!insight) return null;
      return { name: y.name, influence: insight };
    })
    .filter((y): y is { name: LocaleText; influence: string } => y !== null)
    .slice(0, 3);

  // --- Headline ---
  const headline = `${primaryDef.name.en} soul in a ${currentChapterDef.name.en} phase${
    nextDasha ? `, approaching a ${nextChapterDef.name.en} shift in ${nextDasha.startDate.getFullYear()}` : ''
  }`;

  return {
    primary: {
      archetype: primaryDef.id,
      name: primaryDef.name,
      planet: primaryPlanetId,
      strength: primaryStrength,
      description: primaryDef.coreDescription,
      traits: primaryDef.traits,
      blindSpot: primaryDef.blindSpot,
    },
    shadow: {
      archetype: shadowDef.id,
      name: shadowDef.name,
      planet: shadowPlanetId,
      strength: shadowStrength,
      description: shadowDef.shadowDescription,
      growthArea: shadowDef.growthArea,
    },
    currentChapter: {
      archetype: currentChapterDef.id,
      name: currentChapterDef.name,
      dashaLord: currentDashaLordId,
      startDate: currentDasha?.startDate ?? now,
      endDate: currentDasha?.endDate ?? now,
      yearsRemaining: Math.round(yearsRemaining * 10) / 10,
      description: currentChapterDef.chapterDescription,
      themes: currentChapterDef.chapterThemes,
    },
    nextChapter: {
      archetype: nextChapterDef.id,
      name: nextChapterDef.name,
      dashaLord: nextDashaLordId,
      startDate: nextDasha?.startDate ?? now,
      transitionNote: `Shifting from ${currentChapterDef.name.en.replace('The ', '').toLowerCase()} to ${nextChapterDef.name.en.replace('The ', '').toLowerCase()} — ${
        currentChapterDef.chapterThemes[0]} gives way to ${nextChapterDef.chapterThemes[0]}.`,
    },
    persona: {
      lagnaSign: input.ascendantSign,
      expression: `Your ${primaryDef.name.en} nature expresses ${lagnaModifier}`,
    },
    activeYogas,
    headline,
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/archetype-engine.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/kundali/archetype-engine.ts src/lib/__tests__/archetype-engine.test.ts
git commit -m "feat: add Cosmic Blueprint archetype engine"
```

---

### Task 13: Blueprint Tab in Kundali Page

**Files:**
- Create: `src/components/kundali/BlueprintTab.tsx`
- Modify: `src/app/[locale]/kundali/page.tsx` — add tab

This task modifies the large kundali page. The implementor should:
1. Read the tab union type and tab array to understand the pattern
2. Add 'blueprint' to the union
3. Add the tab entry
4. Add the lazy-loaded render block

- [ ] **Step 1: Create BlueprintTab component**

Build `src/components/kundali/BlueprintTab.tsx` as a client component that accepts the computed `CosmicBlueprint` as a prop and renders the full layout from spec section 5.2: headline, primary/shadow cards, timeline bar, current/next chapter, yoga influences, share CTA.

The component should be ~200-300 lines. Use the archetype data for content. Use `<JyotishTerm>` for all Sanskrit terms.

- [ ] **Step 2: Add blueprint tab to kundali page**

In `src/app/[locale]/kundali/page.tsx`:
- Add `'blueprint'` to the tab state union type (line 435)
- Add `{ key: 'blueprint' as const, label: 'Blueprint' }` to the tab array (lines 1178-1199)
- Add lazy import: `const BlueprintTab = dynamic(() => import('@/components/kundali/BlueprintTab'), { ssr: false });`
- Add render block: `{activeTab === 'blueprint' && kundaliData?.fullShadbala && (<BlueprintTab ... />)}`

- [ ] **Step 3: Compute blueprint from existing kundali data**

Wire `generateCosmicBlueprint()` using the already-computed `fullShadbala`, `dashas`, `yogasComplete`, and `ascendant` from `kundaliData`.

- [ ] **Step 4: Build check + verify in browser**

Generate a kundali chart, click the Blueprint tab. Verify:
- Primary/shadow archetypes render with descriptions
- Timeline bar shows correct dasha periods
- Current chapter themes display
- Yoga influences appear
- All JyotishTerm tooltips work
- No console errors
- Responsive on mobile

- [ ] **Step 5: Commit**

```bash
git add src/components/kundali/BlueprintTab.tsx src/app/[locale]/kundali/page.tsx
git commit -m "feat: add Cosmic Blueprint tab to kundali page"
```

---

### Task 14: Standalone Cosmic Blueprint Page

**Files:**
- Create: `src/app/[locale]/cosmic-blueprint/page.tsx`
- Create: `src/app/[locale]/cosmic-blueprint/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` — add PAGE_META entry
- Modify: `src/app/sitemap.ts` — add route

- [ ] **Step 1: Add SEO metadata and sitemap**

Add PAGE_META entry for `/cosmic-blueprint` and add to sitemap routes array.

- [ ] **Step 2: Create layout with metadata**

Standard layout with `generateMetadata` using `getPageMetadata('/cosmic-blueprint', locale)`.

- [ ] **Step 3: Create the page**

Client page with BirthForm. On submit, computes full kundali (reuse the existing computation pipeline from the kundali page), then runs `generateCosmicBlueprint()` and renders the same `BlueprintTab` component.

Include CTA: "See your complete birth chart" linking to `/kundali` with URL params.

Include JSON-LD: `Quiz` schema.

- [ ] **Step 4: Build + verify in browser**

Full flow: enter birth data, see Blueprint results, verify all sections render, CTA links work.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/cosmic-blueprint/ src/lib/seo/metadata.ts src/app/sitemap.ts
git commit -m "feat: add standalone Cosmic Blueprint page"
```

---

### Task 15: Blueprint Share Card

**Files:**
- Modify: `src/app/api/card/[type]/route.tsx` — add blueprint card rendering

- [ ] **Step 1: Add blueprint card rendering**

Add rendering branch for `type === 'blueprint'`. Accept query params: `name`, `archetype`, `planet`, `currentChapter`, `currentDashaYears`, `nextChapter`, `nextDashaStart`, `headline`.

Render: navy background, planet symbol, archetype name large, current/next chapter, headline, QR code, watermark.

- [ ] **Step 2: Wire share button into BlueprintTab and cosmic-blueprint page**

Add `ShareCardButton` and `CardPreviewModal` to both locations.

- [ ] **Step 3: Verify card generation in browser**

- [ ] **Step 4: Commit**

```bash
git add src/app/api/card/[type]/route.tsx src/components/kundali/BlueprintTab.tsx src/app/[locale]/cosmic-blueprint/page.tsx
git commit -m "feat: add Blueprint share card"
```

---

## Phase 3: Feature 4 — Compatibility Cards

### Task 16: Kuta Insight Data

**Files:**
- Create: `src/lib/constants/kuta-insights.ts`

- [ ] **Step 1: Create kuta insight lookup table**

```ts
// src/lib/constants/kuta-insights.ts

export interface KutaInsight {
  kutaName: string;
  scoreThreshold: 'full' | 'zero' | 'high' | 'low';
  maxScore: number;
  insight: string;
}

// Lookup: kutaName -> scoreThreshold -> insight
export const KUTA_INSIGHTS: KutaInsight[] = [
  // Nadi (8 points)
  { kutaName: 'Nadi', scoreThreshold: 'full', maxScore: 8, insight: 'Complementary vital energies — strong natural bond' },
  { kutaName: 'Nadi', scoreThreshold: 'zero', maxScore: 8, insight: 'Your vital energies are identical — powerful but needs conscious balancing' },
  // Bhakoot (7 points)
  { kutaName: 'Bhakoot', scoreThreshold: 'full', maxScore: 7, insight: 'Emotional wavelengths are naturally harmonized' },
  { kutaName: 'Bhakoot', scoreThreshold: 'zero', maxScore: 7, insight: 'Emotional wavelengths create productive tension — growth through difference' },
  // Gana (6 points)
  { kutaName: 'Gana', scoreThreshold: 'full', maxScore: 6, insight: 'Temperamental match — you operate at the same speed' },
  { kutaName: 'Gana', scoreThreshold: 'zero', maxScore: 6, insight: 'Fire meets grace — passionate but requires mutual respect' },
  // Graha Maitri (5 points)
  { kutaName: 'Graha Maitri', scoreThreshold: 'full', maxScore: 5, insight: 'Your ruling planets are natural allies — deep mutual understanding' },
  { kutaName: 'Graha Maitri', scoreThreshold: 'zero', maxScore: 5, insight: 'Different planetary rulers create complementary perspectives' },
  // Yoni (4 points)
  { kutaName: 'Yoni', scoreThreshold: 'full', maxScore: 4, insight: 'Deep instinctive understanding — you read each other without words' },
  { kutaName: 'Yoni', scoreThreshold: 'zero', maxScore: 4, insight: 'Instinctive patterns differ — learning each other\'s rhythm takes patience' },
  // Tara (3 points)
  { kutaName: 'Tara', scoreThreshold: 'full', maxScore: 3, insight: 'Your lunar rhythms are naturally synchronized' },
  { kutaName: 'Tara', scoreThreshold: 'zero', maxScore: 3, insight: 'Lunar cycles create periodic friction — awareness smooths the pattern' },
  // Vashya (2 points)
  { kutaName: 'Vashya', scoreThreshold: 'full', maxScore: 2, insight: 'Natural mutual attraction — magnetic compatibility' },
  { kutaName: 'Vashya', scoreThreshold: 'zero', maxScore: 2, insight: 'Attraction requires conscious cultivation rather than instant chemistry' },
  // Varna (1 point)
  { kutaName: 'Varna', scoreThreshold: 'full', maxScore: 1, insight: 'Spiritual temperaments are aligned' },
  { kutaName: 'Varna', scoreThreshold: 'zero', maxScore: 1, insight: 'Different spiritual orientations — enriching if respected' },
];

export function getKutaInsight(kutaName: string, score: number, maxScore: number): string {
  const threshold: KutaInsight['scoreThreshold'] = score === maxScore ? 'full' : score === 0 ? 'zero' : score > maxScore / 2 ? 'high' : 'low';
  const match = KUTA_INSIGHTS.find(k => k.kutaName === kutaName && k.scoreThreshold === threshold);
  if (match) return match.insight;

  // Fallback for high/low thresholds not explicitly defined
  const fullMatch = KUTA_INSIGHTS.find(k => k.kutaName === kutaName && k.scoreThreshold === 'full');
  const zeroMatch = KUTA_INSIGHTS.find(k => k.kutaName === kutaName && k.scoreThreshold === 'zero');
  return threshold === 'high' ? (fullMatch?.insight ?? '') : (zeroMatch?.insight ?? '');
}

// Select top 3 most narratively interesting kutas for card display
export function selectHighlightKutas(
  kutas: { name: string; score: number; maxScore: number }[]
): { name: string; score: number; maxScore: number; insight: string }[] {
  // Priority: Nadi first (if extreme), Bhakoot second, then most extreme remaining
  const sorted = [...kutas].sort((a, b) => {
    // Nadi always first
    if (a.name === 'Nadi') return -1;
    if (b.name === 'Nadi') return 1;
    // Bhakoot second
    if (a.name === 'Bhakoot') return -1;
    if (b.name === 'Bhakoot') return 1;
    // Then by extremity (distance from midpoint)
    const aExtremity = Math.abs(a.score - a.maxScore / 2);
    const bExtremity = Math.abs(b.score - b.maxScore / 2);
    return bExtremity - aExtremity;
  });

  return sorted.slice(0, 3).map(k => ({
    ...k,
    insight: getKutaInsight(k.name, k.score, k.maxScore),
  }));
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/kuta-insights.ts
git commit -m "feat: add kuta psychological insight data and selection logic"
```

---

### Task 17: Compatibility Card + Matching Page Integration

**Files:**
- Modify: `src/app/api/card/[type]/route.tsx` — add compatibility card rendering
- Modify: `src/app/[locale]/matching/page.tsx` — add share button

- [ ] **Step 1: Add compatibility card rendering to API route**

Add rendering branch for `type === 'compatibility'`. Accept query params for both persons' names, signs, score, verdict, and 3 highlighted kutas with insights.

- [ ] **Step 2: Add share button to matching page**

Import `ShareCardButton`, `CardPreviewModal`, and `selectHighlightKutas`. After results are computed, add "Share Compatibility Card" button at line ~607 (alongside existing WhatsApp/Print buttons). Wire modal and card URL generation.

- [ ] **Step 3: Build + verify in browser**

Run matching, verify share button appears, card preview modal works, card renders correctly.

- [ ] **Step 4: Commit**

```bash
git add src/app/api/card/[type]/route.tsx src/app/[locale]/matching/page.tsx
git commit -m "feat: add shareable compatibility cards to matching page"
```

---

## Phase 4: Feature 5 — Lunar Lifestyle

### Task 18: Panchang Insights Data

**Files:**
- Create: `src/lib/constants/panchang-insights.ts`

- [ ] **Step 1: Create insights for all panchang elements**

Build the full data file with ~102 entries covering:
- 30 tithis (15 Shukla + 15 Krishna, each with headline, explanation, bestFor, avoid)
- 27 nakshatras (each with headline, explanation, bestFor, avoid)
- 27 yogas (each with headline, explanation, bestFor, avoid)
- 11 karanas (each with headline, explanation, bestFor, avoid)
- 7 varas (each with headline, explanation, bestFor, avoid)

Each entry follows the `PanchangInsight` interface from the spec. Use observational/scientific framing, not religious prescription.

This is a large data file (~800-1000 lines). The implementor should write it methodically, category by category, and verify the type compiles after each category.

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/panchang-insights.ts
git commit -m "feat: add panchang insight data — 102 entries for all elements"
```

---

### Task 19: Panchang Page Insight Blocks

**Files:**
- Modify: `src/app/[locale]/panchang/PanchangClient.tsx`

- [ ] **Step 1: Read PanchangClient.tsx to find card render locations**

Identify where each panchang card (tithi, nakshatra, yoga, karana) renders.

- [ ] **Step 2: Add collapsible insight blocks**

Import panchang insights data. After each card, add a collapsible block:

```tsx
<InsightBlock
  type="tithi"
  id={`${panchang.tithi.paksha}_${panchang.tithi.name.en.toLowerCase()}`}
/>
```

The `InsightBlock` component renders the headline, explanation, bestFor/avoid from the insight data. Collapsed by default on mobile, with a "What does this mean?" toggle.

- [ ] **Step 3: Verify in browser**

Check panchang page: insight blocks appear below each card, collapse/expand works, no layout shifts, responsive.

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/panchang/PanchangClient.tsx
git commit -m "feat: add contextual insight blocks to panchang page cards"
```

---

### Task 20: Energy Score Engine

**Files:**
- Create: `src/lib/panchang/energy-score.ts`
- Test: `src/lib/__tests__/energy-score.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
// src/lib/__tests__/energy-score.test.ts
import { describe, it, expect } from 'vitest';
import { computeDailyEnergy, type DailyEnergy } from '../panchang/energy-score';
import { computePanchang } from '../ephem/panchang-calc';

describe('computeDailyEnergy', () => {
  // Full Moon day — should score high
  it('scores > 80 for a Full Moon day', () => {
    // Use a known Full Moon: April 13, 2025 (Chaitra Purnima)
    // Bern, Switzerland
    const panchang = computePanchang({
      year: 2025, month: 4, day: 13,
      lat: 46.95, lng: 7.45, tzOffset: 2,
      timezone: 'Europe/Zurich',
    });
    const energy = computeDailyEnergy(panchang);
    expect(energy.score).toBeGreaterThanOrEqual(75);
    expect(energy.label).toBe('High');
  });

  // New Moon day — should score lower but not zero
  it('scores between 20-50 for a New Moon day', () => {
    // Use a known New Moon: April 27, 2025 (Vaishakha Amavasya)
    const panchang = computePanchang({
      year: 2025, month: 4, day: 27,
      lat: 46.95, lng: 7.45, tzOffset: 2,
      timezone: 'Europe/Zurich',
    });
    const energy = computeDailyEnergy(panchang);
    expect(energy.score).toBeGreaterThanOrEqual(15);
    expect(energy.score).toBeLessThanOrEqual(55);
  });

  // Score is always 0-100
  it('returns score in 0-100 range for any date', () => {
    for (let day = 1; day <= 28; day++) {
      const panchang = computePanchang({
        year: 2026, month: 4, day,
        lat: 46.95, lng: 7.45, tzOffset: 2,
        timezone: 'Europe/Zurich',
      });
      const energy = computeDailyEnergy(panchang);
      expect(energy.score).toBeGreaterThanOrEqual(0);
      expect(energy.score).toBeLessThanOrEqual(100);
      expect(['High', 'Moderate', 'Low']).toContain(energy.label);
      expect(energy.bestFor.length).toBeGreaterThan(0);
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/energy-score.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Write the energy score engine**

Build `src/lib/panchang/energy-score.ts` implementing the scoring formula from the spec:
- Moon phase (40%): derive from tithi number (1-30, peak at 15/Purnima)
- Nakshatra quality (30%): base rating per nakshatra from existing constant data
- Yoga quality (15%): auspicious/inauspicious classification
- Karana quality (10%): movable vs fixed classification
- Vara (5%): planetary ruler bonus/penalty

Return `DailyEnergy` with score, label, dominantFactor, bestFor, avoid.

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run src/lib/__tests__/energy-score.test.ts`
Expected: All tests PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/panchang/energy-score.ts src/lib/__tests__/energy-score.test.ts
git commit -m "feat: add daily energy score engine for lunar calendar"
```

---

### Task 21: Lunar Calendar Page

**Files:**
- Create: `src/app/[locale]/lunar-calendar/page.tsx`
- Create: `src/app/[locale]/lunar-calendar/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` — add PAGE_META entry
- Modify: `src/app/sitemap.ts` — add route

This is the largest new page. The implementor should build it section by section:
1. First: layout, metadata, sitemap, basic page shell
2. Second: Section 1 (Current Lunar Phase Hero) with energy score
3. Third: Section 2 (Month Calendar Grid) with day cells
4. Fourth: Day expansion panel with detail content
5. Fifth: Section 3 (Lunar Rhythm Guide — static content)
6. Last: JSON-LD for lunar events

- [ ] **Step 1: Add SEO metadata, sitemap, layout**

Standard pattern: PAGE_META entry, sitemap route, layout with `generateMetadata`.

- [ ] **Step 2: Build page section by section**

Follow the spec section 7.2 carefully. The month calendar computes panchang data for each day of the month. Use `computePanchang` + `computeDailyEnergy` for each day.

**Performance note:** Computing panchang for 30 days is expensive. Compute on client-side, show a loading state, and cache in state. Consider computing lazily (visible days first, then filling in).

- [ ] **Step 3: Add JSON-LD for lunar events**

`Event` entries for Full Moon and New Moon dates in the displayed month.

- [ ] **Step 4: Build + verify in browser**

Full page verification:
- Hero section shows today's lunar phase and energy
- Month grid renders with moon phase icons and energy scores
- Day click expands detail panel (only one at a time)
- Navigation between months works
- "See Full Panchang" links work
- Responsive on mobile
- No performance issues (page loads in <3s)
- JSON-LD in page source

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/lunar-calendar/ src/lib/seo/metadata.ts src/app/sitemap.ts
git commit -m "feat: add Lunar Lifestyle calendar page with month view and energy scores"
```

---

## Phase 5: Integration & Polish

### Task 22: Navigation — All New Pages

**Files:**
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Add remaining tool links**

Add to Tools dropdown:
- "Cosmic Blueprint" -> `/cosmic-blueprint`
- "Lunar Calendar" -> `/lunar-calendar`

(Tropical Compare was added in Task 9. Glossary goes in footer.)

- [ ] **Step 2: Add translation keys for all active locales**

- [ ] **Step 3: Verify in browser**

All links render, navigate correctly, mobile accordion works.

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx src/messages/
git commit -m "feat: add all Global-Vibe pages to navigation"
```

---

### Task 23: Cross-Linking

**Files:** Multiple pages (modify each)

- [ ] **Step 1: Add cross-links per the spec table**

Implement all cross-page CTAs from spec section 11.2:
- Sign calculator: "See Full Comparison" -> `/tropical-compare`
- Tropical compare: "Generate Full Birth Chart" -> `/kundali`
- Kundali Blueprint tab: "Full Dasha Timeline" -> Dasha tab
- Cosmic blueprint: "See complete birth chart" -> `/kundali`
- Matching: share button (already done in Task 17)
- Lunar calendar day detail: "See Full Panchang" -> `/panchang?date=`
- Lunar calendar rhythm guide: "Explore Full Vedic Calendar" -> `/calendar`
- Panchang insight blocks: "See Lunar View" -> `/lunar-calendar`

- [ ] **Step 2: Verify each link in browser**

Click every cross-link, confirm destination loads correctly with any passed params.

- [ ] **Step 3: Commit**

```bash
git add -A  # Multiple files
git commit -m "feat: add cross-linking between all Global-Vibe pages"
```

---

### Task 24: Full Test Suite

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass including new tests from Tasks 1, 2, 12, 20

- [ ] **Step 2: Run type check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: No errors

- [ ] **Step 3: Run production build**

Run: `npx next build`
Expected: Build succeeds, all new pages listed, page count increased by 4 (per locale)

- [ ] **Step 4: Commit**

```bash
git commit --allow-empty -m "chore: all tests pass, build clean — Global-Vibe complete"
```

---

### Task 25: Full Browser Verification

This is the final manual verification. Every page, every interaction.

- [ ] **Step 1: Verify each new page**

| Page | Check |
|------|-------|
| `/en/glossary` | Search, filter, anchor links, JSON-LD in source |
| `/en/tropical-compare` | Form -> results -> slider -> share card -> kundali link |
| `/en/cosmic-blueprint` | Form -> blueprint -> share card -> kundali link |
| `/en/lunar-calendar` | Hero, month grid, day expansion, month nav, panchang links |

- [ ] **Step 2: Verify enhanced existing pages**

| Page | Check |
|------|-------|
| Sign calculator | Comparison panel renders below results |
| Kundali (Blueprint tab) | Tab renders, content matches standalone |
| Matching | Share card button works |
| Panchang | Insight blocks appear, collapse/expand |

- [ ] **Step 3: Verify navigation**

- All 3 new tools in navbar dropdown
- Glossary in footer
- All cross-links work
- Mobile nav accordion includes new items

- [ ] **Step 4: Verify SEO**

- All 4 new pages in sitemap (check `/sitemap.xml`)
- All have correct `<title>` and `<meta description>`
- JSON-LD present on glossary, tropical-compare, cosmic-blueprint, lunar-calendar
- OG images generate (visit `/api/card/discovery?...`)

- [ ] **Step 5: Regression check**

- Existing sign calculator still works end-to-end
- Existing matching still works end-to-end
- Existing kundali still works end-to-end (all existing tabs)
- Existing panchang still works end-to-end
- No console errors on any page

- [ ] **Step 6: Responsive check**

Test all new pages at 375px, 768px, 1280px widths.

---

### Task 26: Final Commit + Summary

- [ ] **Step 1: Verify clean state**

Run: `git status` — no untracked files that should be committed
Run: `npx vitest run` — all pass
Run: `npx next build` — clean build

- [ ] **Step 2: Summary**

Report to the user:
- Number of new pages added
- Number of new engines/data files
- Number of share card types added
- Test count
- Build page count
- Any issues found and fixed during verification

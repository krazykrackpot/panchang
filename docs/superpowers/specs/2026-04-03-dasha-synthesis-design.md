# Dasha Period Synthesis Engine — Design Spec

**Date:** 2026-04-03
**Status:** Approved
**Goal:** Replace the generic single-period tippanni dasha section with a granular, period-by-period synthesis that combines yogas, doshas, transits, divisional charts, and life area forecasts across three levels: Mahadasha → Antardasha → Pratyantardasha.

---

## 1. Overview

The current tippanni generates a single analysis for the currently running Mahadasha/Antardasha pair. Users need:

1. **Lifetime summary** — one paragraph per Mahadasha from birth to end of life, highlighting key themes
2. **Current Mahadasha deep dive** — full synthesis with all 9 antardashas analyzed
3. **Each antardasha** — yogas/doshas activated, houses triggered, transits overlaid, divisional chart insights (D1/D9/D10/D2), life area forecasts, net assessment, actionable advice
4. **Each pratyantardasha** — light treatment (theme + assessment + advice), expanded for "critical" ones

---

## 2. Data Types

### Top-Level Output

```typescript
interface DashaSynthesis {
  lifetimeSummary: MahadashaOverview[];
  currentMaha: MahadashaSynthesis;
}
```

### Lifetime Summary (1 entry per Mahadasha)

```typescript
interface MahadashaOverview {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  years: number;
  isCurrent: boolean;
  isPast: boolean;
  theme: string;  // 1-2 sentence summary of this period's life theme
}
```

### Current Mahadasha Deep Dive

```typescript
interface MahadashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  years: number;
  overview: string;               // Lord analysis + overall theme (2-3 paragraphs)
  yogasActivated: { name: string; type: string; effect: string }[];
  doshasActivated: { name: string; severity: string; effect: string }[];
  divisionalInsights: {
    D1: string;   // Rashi — overall life
    D9: string;   // Navamsha — marriage/dharma
    D10: string;  // Dasamsha — career
    D2: string;   // Hora — wealth
  };
  antardashas: AntardashaSynthesis[];
}
```

### Antardasha Synthesis (9 per Mahadasha)

```typescript
interface AntardashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  durationMonths: number;
  isCurrent: boolean;

  lordAnalysis: string;           // Dignity + house + strength of antardasha lord
  interaction: string;            // Maha-Antar lord relationship (friend/enemy/neutral)
  yogasTriggered: string[];       // Names of chart yogas that activate
  doshasTriggered: string[];      // Names of doshas that intensify
  housesActivated: { house: number; theme: string }[];  // Houses owned/occupied by antar lord
  transitContext: string;         // Major Saturn/Jupiter transits during this sub-period

  lifeAreas: {
    career: string;
    relationships: string;
    health: string;
    finance: string;
    spirituality: string;
  };

  divisionalInsights: {
    D1: string;
    D9: string;
    D10: string;
    D2: string;
  };

  netAssessment: 'very_favorable' | 'favorable' | 'mixed' | 'challenging' | 'difficult';
  summary: string;                // 2-3 sentence overall synthesis
  advice: string;                 // Actionable: what to do / avoid
  keyDates: string[];             // Transit ingresses within this period

  pratyantardashas: PratyantardashaSynthesis[];
}
```

### Pratyantardasha Synthesis (9 per Antardasha = 81 per Mahadasha)

```typescript
interface PratyantardashaSynthesis {
  planet: string;
  planetName: Trilingual;
  startDate: string;
  endDate: string;
  durationDays: number;
  isCritical: boolean;            // Flagged for expanded analysis

  netAssessment: 'very_favorable' | 'favorable' | 'mixed' | 'challenging' | 'difficult';
  keyTheme: string;               // 1 sentence
  advice: string;                 // 1 sentence

  // Only for critical pratyantardashas:
  expanded?: {
    lordAnalysis: string;
    divisionalInsights: { D1: string; D9?: string; D10?: string };
    warning?: string;
  };
}
```

### Criticality Criteria for Pratyantardasha Expansion

A pratyantardasha is "critical" if any of:
- Pratyantardasha lord is debilitated in natal chart
- Pratyantardasha lord is in 6th, 8th, or 12th house
- Pratyantardasha lord is combust
- Pratyantardasha lord is the same as a dosha-triggering planet (Mangal Dosha Mars, Sade Sati Saturn)
- The Maha-Antar-Pratyantar lords form a mutual enemy configuration
- Pratyantardasha lord owns the 8th or 12th house from the Mahadasha lord

---

## 3. Computation Logic

### 3.1 Lifetime Summary

For each Mahadasha in `kundali.dashas`:
1. Get the dasha lord's natal position (house, sign, dignity)
2. Check which houses the lord owns (from ascendant)
3. Generate a 1-2 sentence theme based on planet nature + house ownership + dignity

Template: "{Planet} Mahadasha ({startYear}-{endYear}): {theme based on lord's house/sign/dignity}"

Example: "Jupiter Mahadasha (2024-2040): Period of expansion, wisdom, and fortune. Jupiter as 5th and 8th lord from your ascendant brings creativity and transformative spiritual growth, tempered by sudden changes."

### 3.2 Current Mahadasha Overview

1. Call existing `getDashaLordAnalysis()` for full dignity/house/retrograde analysis
2. Scan all yogas in the chart → identify which ones have the Mahadasha lord as a participant
3. Scan all doshas → identify which are connected to the Mahadasha lord
4. Call `generateDashaPrognosis()` for D1, D9, D10, D2 divisional charts

### 3.3 Antardasha Synthesis

For each of the 9 antardashas within the current Mahadasha:

**Step 1 — Lord Analysis:**
- Get antardasha lord's natal position (house, sign, dignity, retrograde, combust)
- Get shadbala strength percentage if available
- Determine house ownership from ascendant

**Step 2 — Interaction:**
- Call `getAntardashaInteraction()` for Maha-Antar lord relationship
- Determine natural friendship/enmity

**Step 3 — Yoga Activation:**
- For each present yoga in the chart, check if the antardasha lord is one of the participating planets
- If yes, the yoga "activates" during this period
- Generate effect text: "{YogaName} activates — {lord} as {role} triggers {yoga effect}"

**Step 4 — Dosha Activation:**
- For each present dosha, check if the antardasha lord intensifies it
- Mangal Dosha: Mars antardasha intensifies
- Sade Sati: Saturn antardasha during Sade Sati = peak intensity
- Kaal Sarpa: Rahu/Ketu antardasha intensifies

**Step 5 — House Activation:**
- The antardasha lord owns 2 houses (or 1 for Sun/Moon) from the ascendant
- The lord occupies 1 house
- These 2-3 houses become "activated" — their themes dominate this period
- Use house signification mapping (1=self, 2=wealth/family, 3=siblings, etc.)

**Step 6 — Transit Context:**
- Compute Jupiter and Saturn positions at the start and end of this antardasha period
- Determine which houses (from natal Moon) they transit during this period
- Note any sign ingresses (transit changes) within the period
- Flag if Sade Sati is active during this period

**Step 7 — Divisional Chart Insights:**
- Call `generateDashaPrognosis()` for D1, D9, D10, D2 with this antardasha's lord
- This gives domain-specific insight (marriage for D9, career for D10, wealth for D2)

**Step 8 — Life Area Forecast:**
Synthesize all the above into 5 life areas:
- **Career:** D10 insight + 10th house activation + Saturn/Jupiter transit to 10th
- **Relationships:** D9 insight + 7th house activation + Venus/Jupiter context
- **Health:** 6th/8th house activation + Mars/Saturn context + debilitation flags
- **Finance:** D2 insight + 2nd/11th house activation + Dhana yoga activation
- **Spirituality:** 12th house activation + Ketu context + D20 if relevant

**Step 9 — Net Assessment:**
Score based on:
- Lord dignity (exalted=+2, own=+1, friendly=+0.5, neutral=0, enemy=-0.5, debilitated=-1)
- Maha-Antar interaction (friend=+1, neutral=0, enemy=-1)
- House placement (kendra/trikona=+1, dusthana=-1)
- Yoga activation count (+0.5 per activated auspicious yoga, -0.5 per arishta)
- Transit support (Jupiter in favorable house=+1, Saturn in unfavorable=-1)

Map total score to assessment:
- ≥ 3: very_favorable
- 1.5 to 3: favorable
- 0 to 1.5: mixed
- -1.5 to 0: challenging
- < -1.5: difficult

**Step 10 — Summary + Advice:**
Generate 2-3 sentence summary combining the net assessment with the dominant themes.
Generate advice: "Maximize" areas for favorable periods, "Caution" for challenging ones, specific remedial suggestions for difficult ones.

### 3.4 Pratyantardasha Synthesis

For each of 9 pratyantardashas within each antardasha:

**Light treatment (all):**
1. Get pratyantar lord's natal position
2. Check Maha-Antar-Pratyantar triple interaction
3. Assess: dignity score + house quality + interaction
4. Generate: netAssessment, keyTheme (1 sentence), advice (1 sentence)

**Expanded treatment (critical only):**
1. Full lord analysis (like antardasha Step 1)
2. D1 divisional insight + D9/D10 if relevant
3. Warning text if debilitated or in dusthana

---

## 4. Transit Computation

For transit context, we need Jupiter and Saturn positions at arbitrary future dates. The existing `getPlanetaryPositions()` in `src/lib/ephem/astronomical.ts` computes positions for any Julian Day.

For each antardasha period:
1. Compute JD at period start date
2. Get Jupiter sidereal longitude → determine sign (1-12) → determine house from natal Moon
3. Get Saturn sidereal longitude → same
4. Compute JD at period end date, repeat
5. If sign changes between start and end → note the ingress as a key date

No new astronomical functions needed — reuse existing `sunLongitude()`, `getPlanetaryPositions()`, `toSidereal()`.

---

## 5. Yoga/Dosha Activation Logic

### Yoga Activation

For each yoga detected as `present: true` in the tippanni:
- The yoga has participating planets (the planets whose placement creates it)
- When the dasha/antardasha lord IS one of those planets, the yoga "activates"

We need a mapping: yoga name → participating planet IDs. This can be derived from the yoga detection logic in `src/lib/kundali/yogas-complete.ts`.

Approach: In the synthesis engine, for each yoga in `tip.yogas` where `present === true`, check if the current period's lord (by planet ID) matches any planet involved. The yogas-complete module already evaluates conditions like "lord of 5th in kendra" — we can reverse-engineer which planet created each yoga by checking the detection conditions.

Simpler approach: When generating yogas in the tippanni engine, also store `participatingPlanetIds: number[]` on each `YogaInsight`. This requires a small addition to the yoga detection code.

### Dosha Activation

Simpler — direct mapping:
- Mangal Dosha → activates during Mars (id=2) periods
- Sade Sati → activates during Saturn (id=6) periods (intensifies)
- Kaal Sarpa → activates during Rahu (id=7) or Ketu (id=8) periods
- Grahan Dosha → activates during Rahu/Ketu periods
- Guru Chandal → activates during Jupiter (id=4) or Rahu (id=7) periods
- Kemdrum Dosha → activates during Moon (id=1) periods

---

## 6. House Signification Map

```typescript
const HOUSE_THEMES: Record<number, { en: string; hi: string }> = {
  1:  { en: 'Self, personality, health, new beginnings', hi: 'स्वयं, व्यक्तित्व, स्वास्थ्य' },
  2:  { en: 'Wealth, family, speech, food', hi: 'धन, परिवार, वाणी, भोजन' },
  3:  { en: 'Siblings, courage, communication, short travel', hi: 'भाई-बहन, साहस, संवाद' },
  4:  { en: 'Mother, home, property, vehicles, inner peace', hi: 'माता, घर, सम्पत्ति, वाहन' },
  5:  { en: 'Children, creativity, education, romance, speculation', hi: 'सन्तान, सृजनात्मकता, शिक्षा' },
  6:  { en: 'Enemies, disease, debts, service, daily work', hi: 'शत्रु, रोग, ऋण, सेवा' },
  7:  { en: 'Marriage, partnerships, business, public dealings', hi: 'विवाह, साझेदारी, व्यापार' },
  8:  { en: 'Longevity, transformation, occult, inheritance', hi: 'आयु, परिवर्तन, गुप्त विद्या' },
  9:  { en: 'Father, dharma, fortune, higher education, travel', hi: 'पिता, धर्म, भाग्य, उच्च शिक्षा' },
  10: { en: 'Career, authority, reputation, public life', hi: 'कैरियर, अधिकार, प्रतिष्ठा' },
  11: { en: 'Gains, income, elder siblings, social circle', hi: 'लाभ, आय, बड़े भाई-बहन' },
  12: { en: 'Loss, expenses, foreign lands, moksha, sleep', hi: 'हानि, व्यय, विदेश, मोक्ष' },
};
```

---

## 7. File Structure

```
src/lib/tippanni/
├── dasha-synthesis.ts          ← NEW: Main synthesis engine
├── dasha-synthesis-types.ts    ← NEW: Type definitions
├── dasha-effects-enhanced.ts   ← EXISTS: getDashaLordAnalysis, getAntardashaInteraction (reused)
├── dasha-prognosis.ts          ← EXISTS: generateDashaPrognosis (reused)
├── year-predictions.ts         ← EXISTS (untouched)
└── ...other modules

src/lib/kundali/
├── tippanni-types.ts           ← MODIFY: Add DashaSynthesis to TippanniContent
├── tippanni-engine.ts          ← MODIFY: Call generateDashaSynthesis, add to output
└── yogas-complete.ts           ← MODIFY: Add participatingPlanetIds to YogaInsight
```

### New Files

| File | Responsibility | ~Lines |
|------|---------------|--------|
| `dasha-synthesis-types.ts` | All type definitions from Section 2 | ~120 |
| `dasha-synthesis.ts` | Main `generateDashaSynthesis()` function | ~500 |

### Modified Files

| File | Change |
|------|--------|
| `tippanni-types.ts` | Add `dashaSynthesis?: DashaSynthesis` to `TippanniContent` |
| `tippanni-engine.ts` | Call `generateDashaSynthesis()` and include in output |
| `yogas-complete.ts` | Add `participatingPlanetIds: number[]` to detected yogas |
| `kundali/page.tsx` | Render the new synthesis in the Tippanni tab |

---

## 8. UI Rendering

### Tippanni Tab — New "Dasha Forecast" Section

Replace the current single-card dasha section with:

**8.1 Lifetime Timeline** — Horizontal scrollable bar showing all Mahadashas:
```
[Sun 1990-1996] [Moon 1996-2006] [Mars 2006-2013] ▶[Jupiter 2013-2029]◀ [Saturn 2029-2048] ...
```
Current period highlighted gold. Past periods dimmed. Each clickable to show the theme paragraph.

**8.2 Current Mahadasha Card** — Glass card with:
- Planet icon + name + dates
- Overview paragraphs
- Yogas/Doshas activated (badges)
- Divisional insights (D1/D9/D10/D2 as tabs or accordion)

**8.3 Antardasha Timeline** — 9 cards in a vertical stack:
```
┌─────────────────────────────────────────────┐
│ ● Jupiter/Jupiter (Apr 2024 - Jun 2026)     │
│   Net: Favorable ██████████░░ 7.5/10        │
│   Career ↑  Finance ↑  Health ─  Rel ↑      │
│   "Period of expansion and..."               │
│   [Expand for full details]                  │
│   └─ Pratyantardashas (9)                   │
│      Ju/Ju/Ju ██ fav  |  Ju/Ju/Sa ░░ mix   │
│      ...                                     │
└─────────────────────────────────────────────┘
```

Each antardasha card:
- Collapsed: net assessment bar + life area indicators + 1-line summary
- Expanded: full synthesis (lord analysis, yogas, doshas, transits, life areas, divisional insights, advice)
- Pratyantardasha mini-row: 9 small colored blocks (green/amber/red) with tooltips

**8.4 Color Coding**

| Assessment | Color | Bar |
|-----------|-------|-----|
| very_favorable | emerald | ██████████ |
| favorable | green | ████████░░ |
| mixed | amber | █████░░░░░ |
| challenging | orange | ███░░░░░░░ |
| difficult | rose | █░░░░░░░░░ |

---

## 9. Performance

The synthesis computes:
- 1 lifetime summary (~10 Mahadashas)
- 1 Mahadasha overview
- 9 Antardasha syntheses (each with transit computation)
- 81 Pratyantardasha assessments

Total: ~100 computations. Each is simple arithmetic + string lookup. Expected: <200ms on modern hardware. No API calls. All synchronous.

The transit computation (2 planets × ~90 dates) is the heaviest part. Using existing `getPlanetaryPositions()` which is already fast (~1ms per JD).

---

## 10. What This Does NOT Include

- LLM/AI-generated text (all rule-based)
- Transits beyond Jupiter/Saturn (Rahu/Ketu transits could be added later)
- Compatibility with other people's charts
- Remedial puja scheduling (already handled by the graha shanti system)
- PDF export of the synthesis (can be added later)

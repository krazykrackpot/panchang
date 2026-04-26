# Remedy Engine + Smart Muhurta Search — Design Spec

**Date:** 2026-04-26
**Scope:** Hora Engine, Remedy Prescription Engine, Contextual Remedy Surfaces, Smart Muhurta Search
**Architecture:** Pure computation (hora/remedy) + LLM extraction (muhurta search) + UI enhancements

---

## Problem

The app computes accurate Jyotish data but stops at diagnosis. Drik Panchang does the same — tells you "Shani Dhaiya is active" but never says what to do about it, when to do it, or how. Users must independently research remedies, figure out optimal timing, and assemble their own practice.

The gap: **actionable, timed, personalized remediation** — the "astrological prescription."

Additionally, Muhurta search requires users to know Jyotish terminology and manually scan calendars. A natural language interface that converts "best time for a wedding in Delhi next month" into precision-scored windows would be a category-defining feature.

---

## Part 1: Hora Engine

### Purpose
Compute the 24 planetary hours (12 day + 12 night) for any date/location. This is the timing backbone for remedy scheduling and a visible panchang feature.

### File: `src/lib/panchang/hora-engine.ts`

### Core Function
```typescript
interface HoraSlot {
  planetId: number;       // 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn
  startTime: string;      // "HH:MM"
  endTime: string;        // "HH:MM"
  isDay: boolean;
  activities: { en: string; hi: string };  // Best activities for this hora
}

function computeHoraTable(
  sunrise: string,    // "HH:MM"
  sunset: string,     // "HH:MM"
  nextSunrise: string, // "HH:MM" (next day)
  varaDay: number     // 0=Sunday per JD convention
): HoraSlot[]
```

### Algorithm
1. Parse sunrise/sunset/nextSunrise to minutes
2. Day hora duration = (sunset - sunrise) / 12
3. Night hora duration = (nextSunrise - sunset) / 12 (handles midnight crossing)
4. Chaldean sequence starting from vara lord:
   - Sunday → Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, repeat
   - Monday → Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, repeat
   - etc. (each day starts from its lord, follows: planet → skip 2 → next)
5. Generate 12 day slots + 12 night slots
6. Each slot gets `activities` from `HORA_PLANET_ACTIVITIES` constant

### Hora Planet Activities
```typescript
const HORA_PLANET_ACTIVITIES: Record<number, { en: string; hi: string }> = {
  0: { en: 'Government work, authority, health, father', hi: 'सरकारी कार्य, अधिकार, स्वास्थ्य, पिता' },
  1: { en: 'Travel, liquids, public relations, mother', hi: 'यात्रा, तरल पदार्थ, जनसंपर्क, माता' },
  2: { en: 'Property, machinery, legal battles, surgery', hi: 'संपत्ति, मशीनरी, कानूनी कार्य, शल्यचिकित्सा' },
  3: { en: 'Communication, trade, learning, writing', hi: 'संचार, व्यापार, शिक्षा, लेखन' },
  4: { en: 'Education, finance, spiritual practice, children', hi: 'शिक्षा, वित्त, आध्यात्मिक साधना, संतान' },
  5: { en: 'Romance, arts, luxury, marriage', hi: 'प्रेम, कला, विलासिता, विवाह' },
  6: { en: 'Labor, discipline, mining, iron work, service', hi: 'श्रम, अनुशासन, खनन, लोहा कार्य, सेवा' },
};
```

### Panchang Page Integration
- The panchang page already has a `{/* ═══ HORA (PLANETARY HOURS) ═══ */}` section (~line 2217 in PanchangClient.tsx). Enhance it to use the new `computeHoraTable()` engine instead of the existing static hora data from panchang-calc.
- Ensure the section is in the sticky section nav (may already be under "Choghadiya" — verify)
- 24-row table: Time | Planet (with GrahaIcon) | Day/Night | Best Activities
- Current hora highlighted with "NOW" badge (midnight-wrap-aware using `if (end < start) return now >= start || now < end`)
- The existing `panchang.hora` array from panchang-calc can be used as-is if it already provides planetId + startTime + endTime — just add the activities column

### Chaldean Sequence (all 7 days)
Starting planet for each vara, then follow Sun→Venus→Mercury→Moon→Saturn→Jupiter→Mars cycle:
- 0 Sunday: Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn
- 1 Monday: Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun
- 2 Tuesday: Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon
- 3 Wednesday: Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars
- 4 Thursday: Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury
- 5 Friday: Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter
- 6 Saturday: Saturn, Jupiter, Mars, Sun, Venus, Mercury, Moon, Saturn, Jupiter, Mars, Sun, Venus

The cycle is: from starting planet, follow the sequence by skipping 2 planets in the natural order (Sun Moon Mars Mercury Jupiter Venus Saturn) each step.

### Validation
- Cross-check with Drik Panchang's hora table for same date/location
- Verify the Chaldean sequence is correct for all 7 vara days
- Test midnight-crossing night horas

---

## Part 2: Remedy Prescription Engine

### Purpose
Generate personalized, timed remedy prescriptions by combining chart weakness analysis with today's hora windows.

### File: `src/lib/remedies/prescription-engine.ts`

### Core Types
```typescript
interface RemedyPrescription {
  planetId: number;
  planetName: { en: string; hi: string };
  urgency: 'critical' | 'recommended' | 'supportive';
  reason: { en: string; hi: string };     // "Saturn debilitated in 7H — partnerships need strengthening"

  // Timing
  optimalWindows: {
    horaStart: string;    // "14:15"
    horaEnd: string;      // "15:10"
    isToday: boolean;     // true if today matches planet's vara or has hora window
    nextBestDay: string;  // "Saturday" if today isn't optimal
  }[];

  // Full prescription
  gemstone: {
    name: { en: string; hi: string };
    carat: string;
    metal: string;
    finger: string;
    startDay: string;       // Best day to start wearing
  } | null;
  mantra: {
    beej: string;           // "Om Sham Shanaishcharaya Namah"
    vedic: string;          // Full Vedic mantra
    count: number;          // 108, 1008, etc.
  };
  charity: {
    item: { en: string; hi: string };
    recipient: { en: string; hi: string };
    direction: { en: string; hi: string };  // "Face West"
  };
  color: { en: string; hi: string };        // "Black / Dark Blue"
  foodToAvoid: { en: string; hi: string };   // "Non-veg, alcohol"

  // Chart context
  chartContext: {
    house: number;
    dignity: string;       // "Debilitated", "Own Sign", etc.
    shadbalaPercent: number;
    dashaRelevance: string; // "Current Mahadasha lord" / "Antardasha lord" / ""
  };
}
```

### Core Function
```typescript
function generateDailyPrescription(
  kundali: KundaliData,
  horaTable: HoraSlot[],
  panchang: PanchangData,
  locale: string
): RemedyPrescription[]
```

### Algorithm
1. Get planet weakness scores from `generateGemstoneRecommendations(kundali)` — each planet scored 0-100
2. Get active doshas from kundali (Mangal, Sade Sati, etc.)
3. Get current Maha/Antar dasha lords
4. For each planet needing remediation (score > threshold):
   a. Find today's hora windows for that planet from `horaTable`
   b. Check if today's vara matches the planet's day (bonus)
   c. Pull full remedy data from `PLANET_REMEDIES_FULL`
   d. Generate `reason` from chart context (house, dignity, dasha relevance)
   e. Assemble the full prescription card
5. Sort by urgency: active dosha remedies → dasha lord weakness → debilitated planets → transit pressure
6. Cap at 3 prescriptions per day

### Priority Rules
- Dosha-linked planet (e.g., Mars for Mangal Dosha) → critical
- Current Mahadasha lord if weak → critical
- Current Antardasha lord if weak → recommended
- Any debilitated planet → recommended
- Low shadbala planet → supportive

---

## Part 3: Vara-Based Remedies (Logged-Out Fallback)

### File: `src/lib/remedies/vara-remedies.ts`

### Purpose
Generic remedy cards based on today's weekday ruler — no birth chart needed.

### Core Function
```typescript
function getVaraRemedies(
  varaDay: number,       // 0=Sunday
  horaTable: HoraSlot[], // today's hora windows
  locale: string
): VaraRemedy
```

### Returns
```typescript
interface VaraRemedy {
  planet: { id: number; name: { en: string; hi: string } };
  message: { en: string; hi: string };  // "Saturday: Saturn remedies are effective today"
  horaWindows: { start: string; end: string }[];  // All hora slots for the vara lord
  mantra: { beej: string; count: number };
  charity: { item: { en: string; hi: string }; direction: { en: string; hi: string } };
  color: { en: string; hi: string };
  gemstone: { en: string; hi: string };
}
```

This is a thin lookup from existing `PLANET_REMEDIES_FULL` data, filtered to the vara lord, with hora windows attached.

---

## Part 4: Contextual Remedy Surfaces

### 4a. Panchang Page

**Location:** New section between Choghadiya and Planetary Positions, added to sticky nav as "Remedies"

**Logged out:** Single card showing vara-based remedy with hora windows
**Logged in + saved chart:** Up to 3 full prescription cards from `generateDailyPrescription()`

**Implementation:** In PanchangClient.tsx:
- Import `computeHoraTable` from hora-engine
- Import `generateDailyPrescription` and `getVaraRemedies`
- If user is logged in and has saved chart data (from birth-data-store), compute full prescriptions
- Otherwise, show vara remedies
- Each card uses the full prescription layout: planet icon, timing, mantra, charity, gemstone, direction, color, "why" explanation

### 4b. Kundali RemediesTab Enhancement

**Current state:** Shows gemstone recommendations sorted by need level with color swatches
**Enhancement:**
- Each gemstone card gets a "Today's Window" sub-section: planet's hora times for today
- Add full prescription fields: mantra, charity, direction, color, food
- Add "Best Day" indicator if today isn't the planet's vara
- Add "Weekly Schedule" toggle: 7-day grid showing which planets have vara+hora alignment

### 4c. Dashboard Remedies Page Enhancement

**Current state:** Prioritized remedies from `computePersonalRemedies()`
**Enhancement:**
- Each remedy card expanded to full prescription format with today's timing
- "This Week" calendar strip at top — dots on days with high-priority remedy windows
- Optional check-off: "I performed this remedy today" (stored in localStorage, synced to Supabase if logged in)

---

## Part 5: Smart Muhurta Search

### Purpose
Natural language muhurta queries → precision-scored time windows with calculation proof.

### 5a. LLM Parameter Extraction

**File:** `src/app/api/muhurta-search/route.ts`

Takes user query, sends to Claude with extraction prompt:

```
Extract muhurta search parameters from this query: "{userQuery}"

Map the activity to one of these exact keys: marriage, griha_pravesh, mundan, vehicle_purchase, travel, property_purchase, business_start, education_start, medical_procedure, naming_ceremony, engagement, gold_purchase, debt_repayment, court_case, sowing, harvest, construction, interview, investment, general_auspicious

Return JSON: { activity, startDate, endDate, location, lat, lng }
If dates are relative ("next month"), resolve against today: 2026-04-26.
If location is missing, return null for lat/lng.
```

If activity doesn't match any key, return the closest match with a confidence score. If confidence < 0.7, ask the user to clarify.

### 5b. Two-Pass Scan Engine

**File:** `src/lib/muhurta/smart-search.ts`

```typescript
interface MuhurtaWindow {
  date: string;          // "2026-10-14"
  startTime: string;     // "18:15"
  endTime: string;       // "19:30"
  score: number;         // 0-100
  breakdown: {
    panchang: number;    // 0-25
    lagna: number;       // 0-25
    hora: number;        // 0-25
    personal: number;    // 0-25 (0 if not logged in)
  };
  proof: {
    tithi: { name: string; quality: string };
    nakshatra: { name: string; quality: string };
    yoga: { name: string; quality: string };
    lagna: { sign: string; quality: string };  // "Vrishabha (Sthira) — stable"
    hora: { planet: string; match: boolean };
    specialYogas: string[];   // ["Amrita Siddhi", "Sarvartha Siddhi"]
    dashaHarmony?: string;    // "Venus Mahadasha matches marriage"
  };
}

async function smartMuhurtaSearch(
  params: { activity: string; startDate: string; endDate: string; lat: number; lng: number },
  userSnapshot?: UserSnapshot  // null if logged out
): Promise<MuhurtaWindow[]>
```

**Pass 1 (Coarse — 4-hour chunks):**
1. For each day in range, compute panchang at 4 hour intervals (sunrise, +4h, +8h, noon, +4h, sunset)
2. Score each chunk using `scorePanchangFactors()` from existing ai-recommender
3. Rank days by peak chunk score
4. Take Top 5 days

**Pass 2 (Fine — 15-minute slices):**
1. For each Top 5 day, scan from sunrise to next sunrise in 15-min increments
2. For each slice compute:
   - Panchang score (tithi, nakshatra, yoga, karana, weekday from activity rules)
   - Lagna at that moment — use `computeAscendant(jd, lat, lng)` from `src/lib/ephem/astronomical.ts` (verify this function exists; if not, extract from kundali-calc). Check Lagna Shuddhi rules.
   - Hora lord (from hora-engine) — bonus if in activity's `goodHoras`
   - Special yogas: Amrita Siddhi, Sarvartha Siddhi, Ravi Yoga detection
   - If userSnapshot: Tarabalam + Chandrabalam + Dasha Harmony
3. Composite score = weighted sum (panchang 25 + lagna 25 + hora 25 + personal 25)
4. Group consecutive high-scoring slices into windows (merge if gap < 15 min)
5. Return Top 3 windows sorted by score

**Lagna Shuddhi rules (from Muhurta Chintamani):**
- Lagna sign must be a fixed (sthira) or dual (dvisvabhava) sign for marriage, griha_pravesh, construction
- Lagna sign must be movable (chara) for travel, vehicle
- No malefics (Mars, Saturn, Rahu, Ketu) in houses 1, 7, 8 from Muhurta Lagna
- Activity's significator planet strong in the Muhurta chart is a bonus

### 5c. UI — Search Bar on Muhurta AI Page

**Location:** Above the existing activity grid on `/muhurta-ai`

- Text input with placeholder: "Ask: 'Best time for a wedding in Delhi, Oct 10-25'"
- Submit → loading state with "Scanning [N] time windows..."
- Results: Top 3 window cards, each with:
  - Date and time range
  - Score gauge (0-100) with color
  - Breakdown bars (Panchang / Lagna / Hora / Personal)
  - "Calculation Proof" expandable section with full technical justification
  - "Why this is good" plain-language summary

### 5d. Files

| File | Action |
|------|--------|
| `src/lib/muhurta/smart-search.ts` | **NEW** — two-pass scan, lagna computation, result synthesis |
| `src/app/api/muhurta-search/route.ts` | **NEW** — API route with LLM extraction + scan |
| `src/app/[locale]/muhurta-ai/page.tsx` | **MODIFY** — add NL search bar above activity grid, proof cards |
| `src/lib/__tests__/smart-search.test.ts` | **NEW** — tests for two-pass scan, lagna shuddhi, scoring |

---

## Part 6: Testing Strategy

### Unit Tests
- `hora-engine.test.ts` — verify Chaldean sequence for all 7 days, midnight crossing, duration math
- `prescription-engine.test.ts` — priority sorting, max 3 cap, dosha-linked urgency, vara matching
- `smart-search.test.ts` — pass 1 day ranking, pass 2 window merging, lagna shuddhi filtering

### Validation
- Hora table cross-checked against Drik Panchang for Corseaux, Apr 26 2026
- Remedy prescriptions verified: correct mantra/gemstone/charity per BPHS
- Smart search results compared with existing muhurta-ai scores for same activity/date

### Regression
- Full `npx vitest run` must pass
- `npx tsc --noEmit` must pass
- `npx next build` must succeed
- Existing muhurta-ai functionality unchanged (search bar is additive)
- Existing RemediesTab functionality preserved (enhancements are additive)

---

## Implementation Order

1. **Hora Engine** — foundation, no dependencies, testable in isolation
2. **Hora Panchang UI** — visible table on panchang page, validates engine
3. **Prescription Engine** — depends on hora engine + existing gemstone/remedy data
4. **Vara Remedies** — thin wrapper, depends on hora engine
5. **Panchang Remedy Cards** — depends on prescription + vara engines
6. **RemediesTab Enhancement** — depends on prescription engine
7. **Dashboard Remedies Enhancement** — depends on prescription engine
8. **Smart Search Engine** — depends on hora engine + existing muhurta scanners
9. **Smart Search API Route** — depends on smart search engine
10. **Muhurta AI Page Enhancement** — depends on API route

Steps 1-4 can be parallelized (engine layer).
Steps 5-7 can be parallelized (UI layer).
Steps 8-10 are sequential.

---

## What This Is NOT

- Not a replacement for existing muhurta-ai (additive search bar)
- Not a replacement for existing RemediesTab (additive enhancement)
- Not an AI-generated remedy system (all remedies from classical BPHS/Phaladeepika data)
- Not a medical/health recommendation system
- The LLM is used ONLY for parameter extraction in smart search, not for generating astrological content

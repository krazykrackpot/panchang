# Feature Spec 14: Nadi Amsha (D-150 Division)

**Tier:** 3 — Deep classical (niche but respected)
**Priority:** 1st in custom order (build first after Tier 1)
**Status:** Spec Complete

---

## What It Does

Computes the Nadi Amsha — the 150th divisional chart (D-150). Each sign is divided into 150 equal parts of 0.2° (12 arc-minutes). This is the most precise divisional chart in Vedic astrology, used in the Nadi tradition (palm-leaf manuscripts) for ultra-specific predictions about life events, timing, and karmic patterns.

## Why It Matters

- **Ultra-niche, deeply respected.** Nadi astrology is considered the most precise system. The 150th division is the foundation.
- **No digital implementation exists.** This would be the first interactive Nadi Amsha tool online.
- **SEO:** "nadi amsha calculator" has zero competition. The Nadi astrology community is small but extremely engaged and vocal.
- **Scholarly credibility:** offering D-150 alongside D-60 positions the app as the most comprehensive Vedic tool available.

---

## Classical Foundation

### Nadi Amsha Division

Each rashi (30°) is divided into 150 parts → each Nadi Amsha spans 0.2° (12 arc-minutes).

The 150 Nadi Amshas cycle through the 12 rashis:
- Amsha 1-12.5: cycle through Aries → Pisces (for odd signs) or Pisces → Aries (for even signs)
- Each amsha has a specific name from the classical Nadi texts

**Classical names (150 Nadi Amshas per sign):**

The naming follows a complex pattern from Chandra Kala Nadi and Dhruva Nadi texts. Each amsha has:
1. A rashi assignment (which of the 12 signs this amsha maps to)
2. A deity/energy name (from the 150-name list)
3. A sound syllable (for name matching in Nadi traditions)

### Computation

For any planet at longitude L:
```
signIndex = floor(L / 30)                    // 0-11
degreeInSign = L - (signIndex * 30)          // 0-30
nadiAmshaNumber = floor(degreeInSign / 0.2) + 1  // 1-150
nadiAmshaSign = computeNadiSign(signIndex, nadiAmshaNumber)
```

For odd signs (Aries, Gemini, Leo, Libra, Sagittarius, Aquarius):
- Amshas cycle Aries → Pisces repeatedly (12.5 cycles of 12)

For even signs (Taurus, Cancer, Virgo, Scorpio, Capricorn, Pisces):
- Amshas cycle Pisces → Aries (reverse order)

### What Nadi Amsha Reveals

1. **Exact life events:** the 0.2° precision means planets that appear conjunct in D1 may be in different Nadi Amshas → different karmic imprints
2. **Nadi Dosha precision:** in marriage matching, Nadi Dosha checked at the amsha level is far more precise than nakshatra-level
3. **Past-life karmic patterns:** classical texts associate each of the 150 amshas with specific karmic storylines
4. **Timing refinement:** used alongside D-60 for pinpointing event timing within dasha periods

---

## Architecture

### Engine: `src/lib/kundali/nadi-amsha.ts` (NEW)

```typescript
interface NadiAmshaPosition {
  planetId: number;           // 0-8
  planetName: Trilingual;
  longitude: number;          // exact longitude
  signIndex: number;          // 0-11 (rashi in D1)
  nadiAmshaNumber: number;    // 1-150
  nadiAmshaSign: number;      // 1-12 (rashi in D-150)
  nadiAmshaSignName: Trilingual;
  nadiAmshaName: string;      // classical name of this specific amsha
  deityName: Trilingual;      // presiding deity
  soundSyllable: string;      // associated sound (for name matching)
  
  // Interpretation
  karmicTheme: string;        // brief karmic indication
  lifeAreaFocus: string[];    // ['career transformation', 'foreign residence']
}

interface NadiAmshaChart {
  positions: NadiAmshaPosition[];
  ascendantNadiAmsha: NadiAmshaPosition;
  
  // D-150 chart (which sign each planet lands in)
  chart: ChartData;
  
  // Special yogas visible only at Nadi Amsha precision
  nadiYogas: NadiYoga[];
  
  // Nadi Dosha analysis (amsha-level precision)
  nadiDoshaAnalysis?: {
    type: 'aadi' | 'madhya' | 'antya';
    severity: 'none' | 'mild' | 'moderate' | 'severe';
    cancellations: string[];
    amshaLevelMatch: boolean;  // true if exact same Nadi Amsha
  };
}

interface NadiYoga {
  name: string;
  planets: number[];
  description: string;
  effect: string;
}

function calculateNadiAmsha(chart: KundaliData, locale: string): NadiAmshaChart;
```

### Data: `src/lib/constants/nadi-amsha-names.ts` (NEW)

The 150 classical Nadi Amsha names with deity associations and karmic themes. This is a large data file (~150 entries) sourced from:
- Chandra Kala Nadi
- Dhruva Nadi  
- Nadi Jyotisha (R. Santhanam translation)

---

## UI Integration

### 1. Kundali Page — "Nadi" Tab

```
┌──────────────────────────────────────────────────────┐
│  ... | Vargas | Nadi Amsha                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                        │
│  NADI AMSHA (D-150) — Ultra-Precise Karmic Map         │
│                                                        │
│  ┌────────────────────────────────────────────────┐    │
│  │ Planet    │ D1 Sign  │ Nadi Amsha # │ D150 Sign│    │
│  │───────────│──────────│─────────────│──────────│    │
│  │ ☉ Sun     │ Aries    │ 47          │ Scorpio  │    │
│  │ ☽ Moon    │ Cancer   │ 112         │ Leo      │    │
│  │ ♂ Mars    │ Aries    │ 49          │ Sagittar │    │
│  │ ☿ Mercury │ Pisces   │ 83          │ Taurus   │    │
│  │ ♃ Jupiter │ Taurus   │ 21          │ Virgo    │    │
│  │ ♀ Venus   │ Pisces   │ 91          │ Gemini   │    │
│  │ ♄ Saturn  │ Aquarius │ 134         │ Pisces   │    │
│  │ ☊ Rahu    │ Leo      │ 66          │ Cancer   │    │
│  │ ☋ Ketu    │ Aquarius │ 138         │ Aries    │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  KARMIC THEMES                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ ☉ Sun in Nadi Amsha 47 (Scorpio):              │    │
│  │ "Transformative leadership. Past-life authority  │    │
│  │ that was misused — this life requires ethical    │    │
│  │ power. Career in healing, investigation, or     │    │
│  │ research yields the deepest fulfillment."       │    │
│  │                                                  │    │
│  │ ☽ Moon in Nadi Amsha 112 (Leo):                 │    │
│  │ "Royal emotional nature. Past-life connection    │    │
│  │ to creative expression and children. Emotional   │    │
│  │ fulfillment through performance, teaching, or   │    │
│  │ mentoring."                                      │    │
│  └────────────────────────────────────────────────┘    │
│                                                        │
│  NADI YOGAS (visible only at D-150 precision)          │
│  ┌────────────────────────────────────────────────┐    │
│  │ Sun and Mars in adjacent Nadi Amshas (47, 49): │    │
│  │ "Warrior-King Yoga — combines authority with    │    │
│  │ martial energy in tightly linked karmic amshas" │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────┘
```

### 2. Matching Enhancement

When two charts are compared on `/matching`, add a "Nadi Amsha Compatibility" section:
- Check if both partners' Moon Nadi Amshas are in compatible signs
- Far more precise than nakshatra-level Nadi Dosha check
- Show cancellation conditions at amsha level

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/kundali/nadi-amsha.ts` | **NEW** | D-150 computation engine |
| `src/lib/constants/nadi-amsha-names.ts` | **NEW** | 150 amsha names + deities + themes |
| `src/components/kundali/NadiAmshaTab.tsx` | **NEW** | Tab component |
| `src/app/[locale]/kundali/page.tsx` | **EDIT** | Add Nadi tab |
| `src/lib/__tests__/nadi-amsha.test.ts` | **NEW** | Unit tests |
| `e2e/nadi-amsha.spec.ts` | **NEW** | E2E tests |

---

## Learning Page: `/learn/advanced/nadi-amsha`

### Content Sections

1. **What is Nadi Astrology?**
   - The palm-leaf manuscript tradition of South India
   - How Nadi differs from Parashari and Jaimini systems
   - The legend: sages wrote every person's destiny on palm leaves
   - Modern Nadi astrology centers (Vaitheeswaran Koil, Chidambaram)

2. **Understanding D-150 (Nadi Amsha)**
   - Why 150 divisions? The mathematical basis (12 × 12.5)
   - Comparison with D-60 (60th division) — why even finer precision matters
   - The odd/even sign reversal rule
   - Each amsha spans just 12 arc-minutes of sky — the precision required in birth time

3. **Karmic Themes of the Nadi Amshas**
   - How each of the 150 amshas carries a specific karmic imprint
   - The deity associations and their significance
   - Sound syllables and the Nadi naming tradition

4. **Practical Interpretation**
   - Reading the D-150 chart: which sign each planet lands in
   - Nadi Yogas: combinations visible only at this precision level
   - Why two people with the same D1 chart can have very different D-150 charts
   - Birth time sensitivity: ±2 minutes can change Nadi Amsha positions

5. **Nadi Dosha at Amsha Precision**
   - Traditional Nadi Dosha: same Nadi type (Aadi/Madhya/Antya)
   - Amsha-level check: same exact Nadi Amsha (much rarer, much more significant)
   - Cancellation conditions at the amsha level

6. **Cautions**
   - Birth time accuracy is critical — D-150 amplifies timing errors by 150×
   - Use alongside D1 and D9, never in isolation
   - Classical texts disagree on exact amsha assignments — we follow Chandra Kala Nadi

---

## Edge Cases

- **Birth time uncertainty:** D-150 is meaningless if birth time is off by >2 minutes. Show a warning if the user hasn't confirmed their birth time is accurate.
- **Same Nadi Amsha for multiple planets:** rare at D-150 precision but possible — note the conjunction significance.
- **Rahu/Ketu in Nadi Amsha:** nodes move slowly — many births on the same day share node Nadi Amshas. Note this in interpretation.

---

## Effort Estimate

- Computation engine: 3 hours (mathematical, well-defined)
- 150-name data file: 4 hours (research + data entry from classical texts)
- Karmic theme interpretations: 4 hours (9 planets × 12 sign positions = 108 interpretations)
- UI component: 4 hours
- Tests: 2 hours
- Learning page: 3 hours
- **Total: ~2.5-3 days**

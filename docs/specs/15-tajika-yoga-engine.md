# Feature Spec 15: Tajika Yoga Engine (Full 16 Yogas)

**Tier:** 3 — Deep classical
**Priority:** 2nd in custom order (after 14)
**Status:** Spec Complete

---

## What It Does

Completes the Varshaphal (Solar Return) page by implementing all 16 classical Tajika Yogas with strength assessment. The existing `tajika-aspects.ts` detects 7 yogas (Ithasala, Ishrafa, Nakta, Yamaya, Manau, Khallasara, Dutthottha). This adds the remaining 9 and enhances all 16 with strength scoring and detailed interpretation.

## Why It Matters

- **Makes the varshaphal page the deepest solar-return tool online.** No web app implements all 16 Tajika Yogas.
- **Existing infra:** `src/lib/varshaphal/tajika-aspects.ts` already has the orb calculation, aspect detection, and multilingual interpretation framework. Extending it is natural.
- **Scholarly credibility:** Tajika Yogas are the heart of Varshaphal analysis. Without all 16, the page is incomplete.

---

## The 16 Tajika Yogas

### Already Implemented (7)
1. **Ithasala** — applying aspect (faster planet approaching slower) → success
2. **Ishrafa** — separating aspect → missed opportunity
3. **Nakta** — transfer of light (mediating planet bridges two non-aspecting planets)
4. **Yamaya** — similar to Nakta but with specific conditions
5. **Manau** — weak Ithasala (planet in fall/combustion)
6. **Khallasara** — broken Ithasala (retrograde disruption)
7. **Dutthottha** — a planet in its own sign assists despite combustion

### To Implement (9)
8. **Ikkabal** (Ikkabala)** — a planet in its exaltation, moolatrikona, or own sign is strong enough to produce results alone, without needing an aspect from another planet
9. **Induvara (Indu-Vara)** — when none of the first 7 yogas are found, planets in kendras/trikonas from each other can still produce results (a "safety net" yoga)
10. **Tambira** — a planet that has separated from one and is now applying to another; the second connection fulfills what the first started
11. **Kuttha** — two planets applying to aspect but both are in cadent houses (weak — promises but can't deliver)
12. **Durupha (Duraphaa)** — slower planet applies to faster → desire exists but action is delayed; eventual success through persistence
13. **Radda (Raddha)** — cancellation of a negative yoga by a strong benefic's intervention; rescue/recovery
14. **Muthashila variants** — refinements of Ithasala for specific speed ratios and dignity combinations
15. **Gairi-Kamboola (Gairi)** — Moon applies to Ithasala with a planet that is not the lord of the ascendant; results come through others, not self-effort
16. **Kamboola** — Moon applies to Ithasala with the Lagna lord; results come through self-effort

---

## Architecture

### Enhanced Engine: `src/lib/varshaphal/tajika-aspects.ts` (EDIT)

```typescript
// Add to existing TajikaYoga interface
interface TajikaYoga {
  name: string;
  nameHi: string;
  nameSa: string;
  type: 'positive' | 'negative' | 'neutral' | 'rescue';
  
  // NEW fields
  strength: number;           // 0-100 strength score
  strengthLabel: 'strong' | 'moderate' | 'weak';
  planets: {
    planet1: number;
    planet2: number;
    mediator?: number;        // for Nakta/Yamaya/Radda
  };
  aspectType: string;         // 'conjunction' | 'sextile' | 'square' | 'trine' | 'opposition'
  orb: number;                // actual orb in degrees
  
  // Interpretation
  interpretation: {
    general: Trilingual;      // what this yoga means in general
    forYear: string;          // context-specific to the varshaphal year
    planets: string;          // specific to the two planets involved
    advice: string;           // practical guidance
  };
}

// NEW function
function detectAllTajikaYogas(
  varshaphalChart: ChartData,
  natalChart: ChartData,
  planets: PlanetPosition[],
  lagnaSign: number,
  locale: string
): TajikaYoga[];
```

### Strength Scoring

Each Tajika Yoga's strength depends on:
- **Dignity of participating planets:** exalted (+20), own sign (+15), friend (+10), neutral (0), enemy (-10), debilitated (-20)
- **House placement:** kendra (+15), trikona (+10), upachaya (+5), cadent (-5), dusthana (-10)
- **Orb tightness:** within 1° (+20), within 3° (+10), within 5° (0), within 8° (-10)
- **Retrograde:** if either planet is retrograde, -10 (uncertainty)
- **Speed ratio:** faster planet applying → +10; separating → -10

---

## UI Enhancement: Varshaphal Page

### Current State
The varshaphal page shows a basic list of detected Tajika Yogas.

### Enhanced State

```
┌──────────────────────────────────────────────────┐
│  TAJIKA YOGAS — Year 2026-2027                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│                                                    │
│  Found: 5 of 16 possible yogas                     │
│                                                    │
│  ✓ POSITIVE YOGAS                                  │
│  ┌────────────────────────────────────────────┐    │
│  │ Ithasala — Jupiter ↔ Venus (trine, 2.3°)   │    │
│  │ Strength: ████████░░ 82/100 (Strong)        │    │
│  │                                            │    │
│  │ Jupiter (exalted, in 9th) applies trine to │    │
│  │ Venus (own sign, in 5th). This is the most │    │
│  │ favorable Tajika Yoga — what you desire     │    │
│  │ this year will come to fruition. Education, │    │
│  │ creativity, and spiritual growth are        │    │
│  │ strongly supported.                         │    │
│  │                                            │    │
│  │ Advice: initiate creative projects and      │    │
│  │ educational pursuits in the first half of   │    │
│  │ the solar return year.                      │    │
│  └────────────────────────────────────────────┘    │
│                                                    │
│  │ Kamboola — Moon ↔ Lagna Lord (sextile)      │    │
│  │ Strength: ██████░░░░ 64/100 (Moderate)      │    │
│  │ Results come through your own efforts...     │    │
│                                                    │
│  ✗ CHALLENGING YOGAS                               │
│  │ Khallasara — Mars ↔ Saturn (square, R)      │    │
│  │ Retrograde Mars disrupts the forming aspect │    │
│  │ with Saturn. Plans related to property and  │    │
│  │ career may face unexpected reversals...      │    │
│                                                    │
│  ○ NOT FOUND THIS YEAR                             │
│  Ishrafa, Manau, Kuttha, Durupha, Radda, ...      │
│  (collapsed list with brief definitions)           │
└──────────────────────────────────────────────────┘
```

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/varshaphal/tajika-aspects.ts` | **EDIT** | Add 9 new yogas + strength scoring |
| `src/lib/varshaphal/tajika-interpretations.ts` | **NEW** | Planet-pair interpretation matrix for all 16 yogas |
| `src/components/varshaphal/TajikaYogaCard.tsx` | **NEW** | Enhanced yoga display with strength bar |
| `src/app/[locale]/varshaphal/page.tsx` | **EDIT** | Use new TajikaYogaCard component |
| `src/lib/__tests__/tajika-yogas.test.ts` | **NEW** | Unit tests for all 16 yogas |
| `e2e/tajika-yogas.spec.ts` | **NEW** | E2E tests |

---

## Learning Page: `/learn/advanced/tajika-yogas`

### Content Sections

1. **What is the Tajika System?**
   - Origin: Greco-Arabic-Persian influence on Indian astrology (~12th century)
   - How Tajika differs from Parashari: aspects by degree (not sign), applying/separating distinction
   - Why Tajika is specifically used for Varshaphal (annual charts)

2. **The 16 Tajika Yogas — Complete Reference**
   - Each yoga with definition, conditions, and practical meaning
   - Categorized: positive (Ithasala, Kamboola, Ikkabal, Dutthottha, Radda), negative (Ishrafa, Khallasara, Kuttha), neutral (Nakta, Yamaya, Induvara, Durupha), special (Manau, Tambira, Gairi-Kamboola, Muthashila)

3. **Reading Strength Scores**
   - What dignity, house, orb, and speed contribute to yoga strength
   - Strong vs. weak Ithasala — same yoga, vastly different outcomes
   - Why retrograde planets weaken yogas

4. **Practical Annual Predictions**
   - Using Tajika Yogas alongside Muntha and Varsheshvara
   - Cross-referencing with Vimshottari Dasha for timing confirmation
   - The Sahams (sensitive points) as supplementary indicators

5. **Historical Context**
   - Tajika Neelakanthi (the primary text)
   - The synthesis of Greek horary techniques with Indian astrology
   - Why Tajika survived in India while fading in its countries of origin

---

## Edge Cases

- **No Tajika Yogas found:** rare but possible (all planets in cadent houses with wide orbs). Show: "No classical Tajika Yogas are active this year — Induvara (safety net) conditions should be checked."
- **Conflicting yogas:** Ithasala and Khallasara for the same pair (applying then retrograde disruption) — show both with explanation of the conflict.
- **Three-planet yogas:** Nakta/Yamaya involve a mediator — ensure the UI clearly shows all three planets and the transfer-of-light mechanism.

---

## Effort Estimate

- 9 new yoga detection algorithms: 6 hours
- Strength scoring system: 2 hours
- Interpretation data (16 yogas × planet pairs): 4 hours
- UI enhancements (TajikaYogaCard, strength bar): 3 hours
- Tests: 3 hours
- Learning page: 2 hours
- **Total: ~2.5 days**

# Feature Spec 03: Gemstone & Mantra Recommendations

**Tier:** 1 — High-value, unique, buildable in 1–2 days
**Priority:** 2
**Status:** Spec Complete

---

## What It Does

Analyzes the user's birth chart to identify weak, afflicted, or debilitated planets, then recommends specific gemstones, mantras, and wearing rituals based on classical Jyotish remedial texts (Brihat Parashara Hora Shastra, Phaladeepika, Jataka Parijata).

## Why It Matters

- **#1 asked question** after seeing a birth chart: "What gemstone should I wear?"
- Every competitor charges for this. We give it free with interpretive depth.
- The data is well-defined and formulaic — planet → gemstone mapping is classical and unambiguous.
- Natural cross-sell to the existing kundali page and remedies section.

---

## User Stories

1. **User generates kundali** → new "Remedies" tab shows gemstone + mantra recommendations ranked by need.
2. **Dashboard** shows a summary card: "Your weakest planet is Saturn (Shadbala: 0.72 Rupas). Recommended: Blue Sapphire (Neelam) on middle finger, Saturday morning."
3. **Learn page** explains the classical basis for each recommendation so users understand WHY, not just WHAT.

---

## Architecture

### Engine: `src/lib/remedies/gemstone-engine.ts` (NEW)

```typescript
interface GemstoneRecommendation {
  planet: PlanetPosition;
  planetId: number;                // 0-8
  planetName: Trilingual;
  needLevel: 'critical' | 'recommended' | 'optional' | 'not_needed';
  needScore: number;               // 0-100, higher = more needed
  reasons: string[];               // ["Debilitated in Libra", "Combust within 3° of Sun", "Low Shadbala (0.72 Rupas)"]
  
  gemstone: {
    primary: GemstoneData;         // main gemstone
    alternatives: GemstoneData[];  // budget-friendly alternatives (uparatna)
  };
  
  mantra: {
    vedic: string;                 // Sanskrit mantra text
    beejMantra: string;            // seed syllable
    recitationCount: number;       // traditional japa count (e.g., 19000 for Saturn)
    bestDay: string;               // weekday for mantra sadhana
    bestTime: string;              // "Brahma Muhurta" or "sunrise"
  };
  
  wearingRules: {
    finger: string;                // "middle finger" / "ring finger" etc.
    hand: 'right' | 'left';
    metal: string;                 // "gold" / "silver" / "panchdhatu"
    minimumCarat: number;
    bestDay: string;               // weekday to first wear
    bestNakshatra: string[];       // auspicious nakshatras for wearing
    bestMuhurta: string;           // "Shukla Paksha, Thursday, Pushya Nakshatra"
    activationMantra: string;      // mantra to recite while wearing
  };
  
  donation: {
    items: string[];               // traditional donation items
    bestDay: string;
    direction: string;             // "donate facing east"
  };
  
  cautions: string[];              // "Do NOT wear if Saturn is your 8th lord and functional malefic"
}

interface GemstoneData {
  name: Trilingual;                // { en: 'Blue Sapphire', hi: 'नीलम', sa: 'नीलमणिः' }
  sanskritName: string;
  color: string;
  associatedPlanet: number;
  caratRange: string;              // "3-6 carats"
  priceRange: string;              // "moderate to expensive"
}

function generateGemstoneRecommendations(
  chart: KundaliData,
  locale: string
): GemstoneRecommendation[];
```

### Need-Level Scoring Algorithm

```
For each planet (Sun through Ketu):

Score starts at 0 (no need)

+30  if debilitated
+25  if combust (Sun conjunction < combust threshold)
+20  if in enemy sign
+15  if retrograde AND in dusthana (6/8/12)
+15  if Shadbala < minimum required Rupas
+10  if in Mrityubhaga
+10  if lord of dusthana (6/8/12)
+10  if afflicted by malefic aspect (Saturn/Mars/Rahu)
- 20  if exalted
- 15  if in own sign
- 10  if vargottama
- 10  if Shadbala > 1.5× minimum

Functional nature adjustment:
  If planet is functional benefic for lagna: need stays
  If planet is functional malefic for lagna: add CAUTION "strengthening a malefic may increase its harmful effects"

Need level:
  score >= 50: critical
  score >= 30: recommended  
  score >= 15: optional
  score < 15:  not_needed
```

### Gemstone Mapping (Classical)

| Planet | Primary Gemstone | Uparatna (Alternatives) | Metal | Finger | Day |
|--------|-----------------|------------------------|-------|--------|-----|
| Sun (0) | Ruby (Manikya) | Red Garnet, Red Spinel, Sunstone | Gold | Ring finger | Sunday |
| Moon (1) | Pearl (Moti) | Moonstone, White Coral | Silver | Little finger | Monday |
| Mars (2) | Red Coral (Moonga) | Carnelian, Red Jasper | Gold/Copper | Ring finger | Tuesday |
| Mercury (3) | Emerald (Panna) | Green Tourmaline, Peridot, Tsavorite | Gold | Little finger | Wednesday |
| Jupiter (4) | Yellow Sapphire (Pukhraj) | Citrine, Yellow Topaz, Yellow Beryl | Gold | Index finger | Thursday |
| Venus (5) | Diamond (Heera) | White Sapphire, White Zircon, White Topaz | Platinum/Silver | Middle finger | Friday |
| Saturn (6) | Blue Sapphire (Neelam) | Amethyst, Lapis Lazuli, Iolite | Panchdhatu/Silver | Middle finger | Saturday |
| Rahu (7) | Hessonite (Gomed) | Orange Zircon, Spessartite | Panchdhatu | Middle finger | Saturday |
| Ketu (8) | Cat's Eye (Lehsuniya) | Chrysoberyl, Tiger's Eye | Panchdhatu | Middle finger | Tuesday |

### Mantra Data (Classical)

| Planet | Beej Mantra | Vedic Mantra (opening) | Japa Count |
|--------|------------|----------------------|------------|
| Sun | ॐ ह्रां ह्रीं ह्रौं सः सूर्याय नमः | ॐ मित्राय नमः... | 7,000 |
| Moon | ॐ श्रां श्रीं श्रौं सः चन्द्राय नमः | ॐ ऐं क्लीं सोमाय नमः... | 11,000 |
| Mars | ॐ क्रां क्रीं क्रौं सः भौमाय नमः | ॐ अङ्गारकाय नमः... | 10,000 |
| Mercury | ॐ ब्रां ब्रीं ब्रौं सः बुधाय नमः | ॐ बुधाय नमः... | 9,000 |
| Jupiter | ॐ ग्रां ग्रीं ग्रौं सः गुरवे नमः | ॐ बृहस्पतये नमः... | 19,000 |
| Venus | ॐ द्रां द्रीं द्रौं सः शुक्राय नमः | ॐ शुक्राय नमः... | 16,000 |
| Saturn | ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः | ॐ शं शनैश्चराय नमः... | 23,000 |
| Rahu | ॐ भ्रां भ्रीं भ्रौं सः राहवे नमः | ॐ राहवे नमः... | 18,000 |
| Ketu | ॐ स्रां स्रीं स्रौं सः केतवे नमः | ॐ केतवे नमः... | 17,000 |

---

## UI Integration

### 1. Kundali Page — New "Remedies" Tab

```
┌──────────────────────────────────────────────────┐
│  Patrika | Dashas | Yogas | Remedies | ...       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                    │
│  ◆ CRITICAL                                        │
│  ┌────────────────────────────────────────────┐    │
│  │ ♄ Saturn — Score: 72/100                   │    │
│  │ Debilitated in Aries • Low Shadbala (0.72) │    │
│  │                                            │    │
│  │ Gemstone: Blue Sapphire (Neelam)           │    │
│  │ Alt: Amethyst, Lapis Lazuli                │    │
│  │ Wear: Middle finger, left hand, Saturday   │    │
│  │ Metal: Panchdhatu, 3-6 carats              │    │
│  │                                            │    │
│  │ Mantra: ॐ प्रां प्रीं प्रौं सः शनैश्चराय   │    │
│  │ Japa: 23,000 times over 40 days            │    │
│  │                                            │    │
│  │ ⚠ Saturn is 8th lord — consult a jyotishi  │    │
│  │   before wearing Blue Sapphire             │    │
│  │                                            │    │
│  │ [Learn more about Saturn remedies →]        │    │
│  └────────────────────────────────────────────┘    │
│                                                    │
│  ◆ RECOMMENDED                                     │
│  ┌────────────────────────────────────────────┐    │
│  │ ☿ Mercury — Score: 38/100                  │    │
│  │ Combust • Enemy sign                       │    │
│  │ ...                                        │    │
│  └────────────────────────────────────────────┘    │
│                                                    │
│  ◇ NOT NEEDED                                      │
│  ♃ Jupiter (Exalted, strong) • ♀ Venus (Own sign)  │
└──────────────────────────────────────────────────┘
```

### 2. Dashboard Card: "Remedy Spotlight"

```
┌──────────────────────────────────────────────────┐
│  ✦ Your Top Remedy                                │
│                                                    │
│  Saturn needs strengthening (Score: 72)            │
│  Gemstone: Blue Sapphire on middle finger          │
│  Mantra: ॐ प्रां प्रीं प्रौं सः शनैश्चराय नमः     │
│                                                    │
│  [View All Remedies →]                             │
└──────────────────────────────────────────────────┘
```

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/remedies/gemstone-engine.ts` | **NEW** | Core recommendation engine |
| `src/lib/remedies/gemstone-data.ts` | **NEW** | Gemstone + mantra + wearing rules data |
| `src/lib/remedies/types.ts` | **NEW** | TypeScript interfaces |
| `src/components/kundali/RemediesTab.tsx` | **NEW** | Kundali tab component |
| `src/components/remedies/GemstoneCard.tsx` | **NEW** | Individual gemstone recommendation card |
| `src/components/remedies/RemedySpotlight.tsx` | **NEW** | Dashboard summary card |
| `src/app/[locale]/kundali/page.tsx` | **EDIT** | Add Remedies tab |
| `src/app/[locale]/dashboard/page.tsx` | **EDIT** | Add RemedySpotlight |
| `src/lib/__tests__/gemstone-engine.test.ts` | **NEW** | Unit tests |
| `e2e/gemstone-remedies.spec.ts` | **NEW** | E2E tests |

---

## Learning Page: `/learn/remedies/gemstones`

### Content Sections

1. **The Science of Jyotish Remedies**
   - Ratna Shastra: the classical study of gemstones
   - How gemstones channel planetary energy (classical theory)
   - The difference between strengthening a planet vs. pacifying it
   - Why not every weak planet needs a gemstone

2. **Reading Your Recommendation**
   - Need score explained: what makes a planet "weak"
   - Shadbala: the six-fold strength system behind the scoring
   - Debilitation, combustion, enemy sign — what each means
   - Functional benefic vs. malefic: why lagna matters

3. **The Nine Gemstones (Navaratna)**
   - Each gemstone with its planet, properties, and significance
   - Primary vs. alternative gemstones (uparatna) — why both work
   - How carat weight affects potency (classical view)
   - Metal significance: gold, silver, copper, panchdhatu

4. **Wearing Rules & Activation**
   - Finger significance (index = Jupiter, ring = Sun/Mars, etc.)
   - Why specific days and nakshatras matter for first wearing
   - The activation ritual (prana-pratishtha): washing, mantra, wearing
   - When to remove a gemstone (cracked, chipped, or if effects are adverse)

5. **Mantras as Remedies**
   - Beej (seed) mantras: concentrated planetary energy
   - Vedic mantras: full invocations with deeper resonance
   - Japa discipline: count, mala, time of day, direction to face
   - The 40-day sadhana tradition

6. **Cautions & Ethics**
   - Never wear a gemstone for a strong functional malefic without expert guidance
   - The "trial period" approach: wear for 3 days, observe dreams and events
   - Why this tool is guidance, not prescription — always consult a qualified jyotishi for major decisions

---

## Edge Cases

- **No saved chart:** disable Remedies tab, show "Generate your chart first"
- **All planets strong:** show "Your chart has no planets requiring gemstone remedies — a rare and fortunate placement" with optional mantra suggestions for general well-being
- **Functional malefic with low shadbala:** show CAUTION prominently — strengthening a malefic can amplify its harmful significations
- **Rahu/Ketu remedies:** these are always shadow planets — note that gemstone effects are subtler and more controversial among authorities
- **Multiple critical planets:** rank by score, show top 2-3 with note "focus on one remedy at a time"

---

## Effort Estimate

- Gemstone engine + data: 4 hours
- UI components (RemediesTab, GemstoneCard, RemedySpotlight): 4 hours
- Integration into kundali + dashboard: 2 hours
- Tests: 2 hours
- Learning page: 2 hours
- **Total: ~1.5-2 days**

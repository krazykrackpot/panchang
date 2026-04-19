# Feature Spec 02: Eclipse Impact on Your Chart

**Tier:** 1 — High-value, unique, buildable in 2 days
**Priority:** 3
**Status:** Spec Complete

---

## What It Does

Cross-references upcoming/past eclipses with the user's birth chart to show which house the eclipse activates, which planets are affected, and what it means for their life areas. Displays as a personalized card on the dashboard and an expanded analysis on the eclipse page.

## Why It Matters

- **#1 Googled astrology event:** eclipses drive massive search spikes. Personalized impact is the killer hook.
- **Existing infra:** we have eclipse computation (`eclipse-compute.ts`, data through 2035) and kundali engine. This just bridges them.
- **Engagement spike:** eclipse articles go viral. "See how this eclipse affects YOUR chart" is the call-to-action that converts visitors to users.

---

## User Stories

1. **Logged-in user with saved chart** sees on `/dashboard`: "Upcoming: Total Lunar Eclipse on Sep 7, 2026 — falls in your 4th house (Pisces). Expect changes around home, mother, emotional security."
2. **User on `/eclipses`** sees a personalized column next to each eclipse: house activated, planets aspected, life-area impact, remedial suggestions.
3. **Anonymous user** sees generic eclipse data. A CTA says "Save your birth chart to see how this eclipse affects you."

---

## Architecture

### Engine: `src/lib/eclipse/eclipse-impact.ts` (NEW)

```typescript
interface EclipseImpact {
  eclipse: EclipseData;
  houseActivated: number;          // 1-12
  signActivated: number;           // rashi ID 1-12
  signName: Trilingual;
  houseSignification: string[];    // ['home', 'mother', 'emotional security']
  planetsInHouse: PlanetPosition[]; // natal planets in the eclipsed house
  planetsAspected: PlanetPosition[]; // natal planets receiving aspect from eclipse point
  conjunctNatal: PlanetPosition[];  // natal planets within 10° of eclipse
  isNatalNodeAxis: boolean;        // eclipse near natal Rahu/Ketu axis
  intensity: 'high' | 'moderate' | 'low';
  interpretation: {
    summary: string;               // 2-3 sentences
    lifAreas: string[];            // affected life domains
    advice: string;                // what to do / avoid
    duration: string;              // "effects felt 1 month before to 6 months after"
    remedies: string[];            // relevant mantras/donations
  };
}

function analyzeEclipseImpact(
  eclipse: EclipseData,
  chart: KundaliData,
  locale: string
): EclipseImpact;

function analyzeAllEclipses(
  year: number,
  chart: KundaliData,
  locale: string
): EclipseImpact[];
```

### Interpretation Engine

**Intensity scoring:**
- **High:** eclipse conjunct a natal planet (within 10°), OR in 1st/7th/10th house, OR on natal Rahu/Ketu axis
- **Moderate:** eclipse in angular houses (1/4/7/10) without conjunction, OR aspecting natal benefics
- **Low:** eclipse in cadent houses (3/6/9/12) without major aspects

**House significations (12 houses × 2 eclipse types):**

| House | Solar Eclipse Impact | Lunar Eclipse Impact |
|-------|---------------------|---------------------|
| 1 | Identity transformation, health focus | Emotional reset, self-image shifts |
| 2 | Financial changes, family dynamics | Values reassessment, speech patterns |
| 3 | Communication breakthroughs, sibling matters | Courage tested, short travel changes |
| 4 | Home/property changes, mother's health | Deep emotional processing, comfort zone disruption |
| 5 | Creative rebirth, children matters | Romance intensity, speculative gains/losses |
| 6 | Health breakthrough, enemy defeat | Service orientation, debt resolution |
| 7 | Partnership transformation, contracts | Relationship revelations, public dealings |
| 8 | Occult awakening, inheritance | Psychological depth, joint finances |
| 9 | Dharma shift, guru connection | Belief system questioned, long travel |
| 10 | Career turning point, authority figures | Public reputation, professional emotions |
| 11 | Network transformation, goal achievement | Friendship dynamics, income changes |
| 12 | Spiritual awakening, foreign connections | Subconscious release, expenditure patterns |

**Remedies by eclipse type + house:**
- Solar eclipse: Surya mantras, ruby wearing advice, Aditya Hridayam recitation
- Lunar eclipse: Chandra mantras, pearl guidance, specific donations (per house)
- Node-axis involvement: Rahu/Ketu specific mantras and remedies

---

## Data Flow

```
User's saved chart (KundaliData)
       │
       ▼
Eclipse data (2024-2035) from eclipse-data.ts
       │
       ▼
For each eclipse:
  1. Compute eclipse longitude (Sun position for solar, Moon position for lunar)
  2. Find which natal house contains that longitude
  3. Check aspects to natal planets (conjunction, opposition, trine, square)
  4. Check proximity to natal Rahu/Ketu
  5. Score intensity
  6. Generate interpretation from house × eclipse-type matrix
  7. Add planet-specific modifications if conjunct
       │
       ▼
EclipseImpact[] ready for UI
```

---

## UI Integration

### 1. Dashboard Card: "Eclipse Watch"

```
┌──────────────────────────────────────────────────┐
│  ◐ Eclipse Watch                                  │
│                                                    │
│  NEXT: Total Lunar Eclipse — Sep 7, 2026          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━      │
│                                                    │
│  Activates your 4th House (Pisces) ●●●○           │
│  Intensity: HIGH — Moon conjunct natal Jupiter     │
│                                                    │
│  Home and emotional security undergo a deep        │
│  transformation. Expect significant changes in     │
│  your living situation or relationship with mother. │
│                                                    │
│  [View Full Eclipse Analysis →]                    │
└──────────────────────────────────────────────────┘
```

### 2. Eclipse Page: Personalized Column

Each eclipse row gets a collapsible "Your Impact" section:

```
┌──────────────────────────────────────────────────┐
│  🌑 Total Solar Eclipse — Mar 29, 2026            │
│  ┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄      │
│  Location: ...  Visibility: ...  Sutak: ...       │
│                                                    │
│  ▼ YOUR CHART IMPACT                               │
│  ┌────────────────────────────────────────────┐    │
│  │ House: 10th (Capricorn)  Intensity: HIGH   │    │
│  │                                            │    │
│  │ Career turning point. Eclipse conjunct     │    │
│  │ your natal Saturn (within 3°). Authority   │    │
│  │ structures in your life are being rebuilt.  │    │
│  │                                            │    │
│  │ Affected areas: Career, reputation, father │    │
│  │                                            │    │
│  │ Remedies:                                  │    │
│  │ • Recite Shani Stotra during Sutak period  │    │
│  │ • Donate black sesame seeds on Saturday    │    │
│  │ • Avoid major career decisions for 2 weeks │    │
│  └────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────┘
```

### 3. Kundali Page: Eclipse Overlay (optional enhancement)

On the kundali chart, optionally show eclipse positions as special markers (distinct from transit planets).

---

## Implementation Files

| File | Action | Description |
|------|--------|-------------|
| `src/lib/eclipse/eclipse-impact.ts` | **NEW** | Core impact analysis engine |
| `src/lib/eclipse/eclipse-interpretations.ts` | **NEW** | 12×2 interpretation matrix + remedy data |
| `src/components/eclipse/EclipseImpactCard.tsx` | **NEW** | Dashboard card component |
| `src/components/eclipse/EclipsePersonalImpact.tsx` | **NEW** | Inline impact for eclipse page |
| `src/app/[locale]/eclipses/page.tsx` | **EDIT** | Add personal impact sections |
| `src/app/[locale]/dashboard/page.tsx` | **EDIT** | Add EclipseImpactCard |
| `src/lib/__tests__/eclipse-impact.test.ts` | **NEW** | Unit tests |
| `e2e/eclipse-impact.spec.ts` | **NEW** | E2E tests |

---

## Learning Page: `/learn/eclipses/personal-impact`

### Content Sections

1. **Eclipses in Vedic Astrology**
   - Rahu and Ketu as eclipse causers (mythological and astronomical)
   - Why eclipses are considered transformative, not merely "bad"
   - The 18-year Saros cycle and its astrological significance

2. **How Eclipses Affect Your Chart**
   - Eclipse longitude falls in a specific house of your birth chart
   - The house activated determines which life area is transformed
   - Conjunction with natal planets intensifies the effect
   - The Rahu/Ketu axis connection: why eclipses near your natal nodes are the most powerful

3. **Solar vs. Lunar Eclipse Differences**
   - Solar: external changes, new beginnings, identity-level shifts
   - Lunar: internal processing, emotional revelations, completions
   - Why solar eclipses in your 1st house differ from lunar eclipses in the same house

4. **Intensity Levels Explained**
   - High: when the eclipse directly touches your chart (conjunction, node axis)
   - Moderate: angular house activation without direct contact
   - Low: cadent houses, no major aspects
   - Duration of effects (typically 6 months, up to 18 months for node-axis)

5. **Traditional Remedies & Sutak**
   - Sutak period: classical observances during eclipse
   - House-specific remedies (mantras, donations, fasting)
   - The difference between fear-based and wisdom-based approaches

6. **Personalization: Your Eclipse History**
   - How to review past eclipses and correlate with life events
   - Using the eclipse impact tool to prepare for upcoming ones

---

## Edge Cases

- **No saved chart:** show generic eclipse data with CTA "Save your chart to see personal impact"
- **Eclipse not visible locally:** still show chart impact (astronomical events affect regardless of visibility per classical texts — note this in the interpretation)
- **Multiple eclipses in same house:** compound effect — note in interpretation
- **Eclipse exactly on house cusp:** assign to the house it's entering (within 1° use both)
- **Ketu eclipse (south node):** always 180° from Rahu eclipse point — check both houses

---

## Effort Estimate

- Eclipse impact engine + interpretations: 6 hours
- Dashboard card + eclipse page integration: 4 hours
- Tests (unit + E2E): 3 hours
- Learning page: 2 hours
- **Total: ~2 days**

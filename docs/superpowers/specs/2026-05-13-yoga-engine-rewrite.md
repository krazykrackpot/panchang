# Yoga Detection Engine — Comprehensive Rewrite Spec

**Date:** 2026-05-13
**Status:** Draft
**Current state:** 147 yogas in `yogas-complete.ts` (3700+ line monolith). 46 categorised as 'other'. Inconsistent detection logic, missing classical grounding, no domain mapping.

---

## 1. Problem

The current yoga detection is a single 3700-line file (`src/lib/kundali/yogas-complete.ts`) with 30+ detection functions that grew organically. Issues:

- **46 yogas in 'other' category** — a meaningless catch-all
- **No domain mapping** — yogas don't feed into life domain scoring except through category matching
- **Duplicate detections** — e.g. `amala` appears twice, `budhaditya` detected in two places
- **Incorrect classifications** — Graha Sanghata was classified as 'Lagna Mallika' and 'inauspicious'
- **No first/last planet analysis** for pattern yogas (Malika, Nabhasa)
- **No cancellation conditions** — classical texts specify when yogas are cancelled (e.g. Gajakesari cancelled if Jupiter is combust)
- **Missing yogas** — many classical yogas from BPHS Ch.34-40 not implemented
- **No strength gradation** — just 'Strong'/'Moderate'/'Weak' without clear criteria

## 2. Classical Sources

### Primary Texts
- **BPHS (Brihat Parashara Hora Shastra)** Ch.34-40 — the primary source for Parashari yogas
- **Phaladeepika** (Mantreshwara) Ch.6-7 — Chandra yogas, Nabhasa yogas
- **Saravali** (Kalyana Varma) — additional combinations
- **Jataka Parijata** — Raja yogas, Dhana yogas

### Yoga Classification (Classical)

#### A. Nabhasa Yogas (32 types per Phaladeepika)
Formed by planetary distribution across houses/signs. Four sub-groups:

| Sub-group | Count | Basis |
|-----------|-------|-------|
| **Aashray** (Position) | 3 | Planets in movable/fixed/dual signs |
| **Dala** (Split) | 2 | Planets in kendras vs panaparas |
| **Akriti** (Shape) | 20 | Geometric patterns (Gola, Yuga, Shoola, Kedara, Pasha, etc.) |
| **Sankhya** (Number) | 7 | Number of houses occupied (1-7) |

#### B. Chandra (Lunar) Yogas
Based on Moon's position relative to other planets:
- Sunapha, Anapha, Durdhara, Kemadruma (planets 2nd/12th from Moon)
- Gajakesari (Jupiter in kendra from Moon)
- Chandra-Mangala (Moon-Mars conjunction)
- Shakata (Moon 6th/8th from Jupiter)
- Adhi Yoga (benefics in 6/7/8 from Moon)

#### C. Surya (Solar) Yogas
Based on Sun's position:
- Budhaditya (Sun-Mercury conjunction, not combust)
- Veshi (planet in 2nd from Sun)
- Vasi (planet in 12th from Sun)
- Obhayachari (planets on both sides of Sun)

#### D. Pancha Mahapurusha Yogas
Five yogas from Mars/Mercury/Jupiter/Venus/Saturn in kendra + own/exalted sign:
- Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Shasha (Saturn)

#### E. Raja Yogas
Kendra-Trikona connections:
- Dharma-Karmadhipati (9th+10th lords conjunction/exchange)
- Kendra-Trikona Raja (lord of kendra + lord of trikona in conjunction/mutual aspect)
- Viparita Raja (6th/8th/12th lords in each other's houses)
- Neechabhanga Raja (debilitation cancelled)
- Specific per-lagna Raja Yogas (different for each ascendant)

#### F. Dhana Yogas
Wealth combinations:
- 2nd+11th lord connection
- 5th+9th lord in kendra
- Lakshmi Yoga (9th lord strong + Venus in own/exalted in kendra)
- Kubera, Kalanidhi, Mahalakshmi, etc.

#### G. Dosha (Afflictions)
- Mangal Dosha (Mars in 1/2/4/7/8/12 from Lagna/Moon/Venus)
- Kaal Sarpa (all planets between Rahu-Ketu)
- Pitru Dosha (Sun-Rahu in 9th)
- Shrapit Dosha (Saturn-Rahu conjunction)
- Guru Chandal (Jupiter-Rahu conjunction)
- Kendradhipati Dosha (benefic lording a kendra)
- Grahan Yoga (Sun/Moon with Rahu/Ketu)

#### H. Arishta Yogas (Longevity/Health)
- Balarishta (Moon in dusthana without benefic aspect)
- Alpayu (short life indicators)
- Madhyayu (medium life)
- Deerghayu (long life)

#### I. Malika Yogas (Garland)
- 12 variants named by starting house (Lagna, Dhana, Vikrama, ... Vyaya)
- First planet = approach, last planet = manifestation
- Graha Sanghata = all planets in narrow band (separate from Malika)

#### J. Parivartana Yogas (Exchange)
- Maha Parivartana (exchange between kendra/trikona lords)
- Dainya Parivartana (exchange involving dusthana lord)
- Khala Parivartana (exchange involving 3rd lord)

#### K. Sannyasa / Spiritual Yogas
- Pravrajya (4+ planets in one house)
- Moksha Yoga (12th lord strong, Ketu in 12th)
- Tapasvi Yoga (Saturn-Moon in specific configurations)

## 3. New Architecture

### 3.1 Declarative Yoga Rule Engine

Replace the 3700-line procedural file with a declarative rule system:

```typescript
interface YogaRule {
  id: string;
  name: LocaleText & { sa: string };
  group: YogaGroup;            // 'nabhasa' | 'chandra' | 'surya' | 'mahapurusha' | 'raja' | 'dhana' | 'dosha' | 'arishta' | 'malika' | 'parivartana' | 'sannyasa'
  subGroup?: string;           // e.g. 'akriti', 'sankhya', 'dala' for Nabhasa
  isAuspicious: boolean;
  
  // Detection
  detect: (ctx: YogaContext) => YogaDetectionResult;
  
  // Cancellation conditions (BPHS-specified)
  cancellations?: (ctx: YogaContext) => CancellationResult[];
  
  // Domain impact mapping
  affectedDomains: DomainType[] | 'all';   // which life domains this yoga influences
  domainWeight: number;                     // 0-3: how strongly it affects domain scoring
  
  // Interpretation
  classicalRef: string;        // "BPHS Ch.34 v.3" or "Phaladeepika Ch.6 v.1"
  involvedPlanets?: (ctx: YogaContext) => number[];   // for first/last analysis
  
  // Description templates
  presentDescription: (ctx: YogaContext, result: YogaDetectionResult) => LocaleText;
  absentDescription?: LocaleText;
}

interface YogaContext {
  planets: PlanetData[];
  ascendantSign: number;
  houses: { house: number; sign: number }[];
  // Precomputed helpers
  planetInHouse: (planetId: number) => number;
  houseLord: (house: number) => number;
  houseSign: (house: number) => number;
  isInKendra: (house: number) => boolean;
  isInTrikona: (house: number) => boolean;
  isDusthana: (house: number) => boolean;
  dignity: (planetId: number) => DignityLevel;
  arePlanetsConjunct: (id1: number, id2: number) => boolean;
  doesAspect: (fromId: number, toHouse: number) => boolean;
}

interface YogaDetectionResult {
  present: boolean;
  strength: 'Strong' | 'Moderate' | 'Weak';
  involvedPlanets: number[];
  startHouse?: number;        // for Malika/pattern yogas
  endHouse?: number;
  chainLength?: number;       // for Malika
  firstPlanet?: number;       // for interpretation
  lastPlanet?: number;
  customData?: Record<string, unknown>;  // yoga-specific extra data
}

interface CancellationResult {
  cancelled: boolean;
  reason: LocaleText;
}
```

### 3.2 File Structure

```
src/lib/kundali/yoga-engine/
├── types.ts                  # YogaRule, YogaContext, YogaDetectionResult
├── context.ts                # buildYogaContext() — precomputes helpers
├── engine.ts                 # evaluateAllYogas() — runs all rules
├── rules/
│   ├── mahapurusha.ts        # 5 Pancha Mahapurusha yogas
│   ├── chandra.ts            # ~12 Moon-based yogas
│   ├── surya.ts              # ~4 Sun-based yogas
│   ├── raja.ts               # ~20 Raja yogas (including per-lagna)
│   ├── dhana.ts              # ~15 Wealth yogas
│   ├── dosha.ts              # ~10 Doshas
│   ├── nabhasa-akriti.ts     # 20 Akriti (shape) Nabhasa yogas
│   ├── nabhasa-sankhya.ts    # 7 Sankhya (number) yogas
│   ├── nabhasa-other.ts      # 5 Aashray + Dala yogas
│   ├── malika.ts             # 12 Malika variants + Graha Sanghata
│   ├── parivartana.ts        # 3 exchange yoga types
│   ├── arishta.ts            # ~8 longevity yogas
│   ├── sannyasa.ts           # ~6 spiritual/renunciation yogas
│   └── conjunction.ts        # Planet conjunction yogas (Guru-Shukra, etc.)
├── cancellations.ts          # Shared cancellation logic
├── domain-mapping.ts         # Which yogas map to which life domains
└── __tests__/
    ├── mahapurusha.test.ts
    ├── chandra.test.ts
    ├── raja.test.ts
    └── malika.test.ts         # Each rule file gets a test file
```

### 3.3 Category → Group Migration

| Old Category | New Group | Count |
|---|---|---|
| `mahapurusha` | `mahapurusha` | 5 |
| `moon_based` | `chandra` | 12 |
| `sun_based` | `surya` | 4 |
| `raja` | `raja` | 26 |
| `wealth` | `dhana` | 14 |
| `dosha` | `dosha` | 7 |
| `inauspicious` | Split into `dosha` / `arishta` / specific groups | 33 |
| `other` | Split properly across groups | 46 |

The 46 `other` yogas need individual classification:
- Nabhasa yogas (Shoola, Kedara, Pasha, etc.) → `nabhasa`
- Conjunction yogas (Guru-Shukra, Mars-Saturn) → `conjunction`
- Navamsha yogas (D9 exalt/debil) → `navamsha`
- Malika/Sanghata → `malika`
- Sannyasa yogas → `sannyasa`
- Nipuna, Varchasvi, etc. → reclassify to proper group

### 3.4 Domain Mapping

Each yoga rule specifies which life domains it affects:

| Yoga | Affected Domains |
|---|---|
| Gajakesari | children, education, wealth, spiritual |
| Mangal Dosha | marriage, health |
| Budhaditya | education, career |
| Raja Yoga | career, wealth |
| Dhana Yoga | wealth |
| Kaal Sarpa | all |
| Graha Malika | depends on starting house |
| Balarishta | health, children |
| Pravrajya | spiritual |
| Parivartana | depends on exchanging houses |

### 3.5 Cancellation Conditions

Classical texts specify when yogas are cancelled. Examples:

| Yoga | Cancellation |
|---|---|
| Gajakesari | Jupiter combust, or Jupiter in enemy sign |
| Kemadruma | Cancelled if planets aspect Moon, or Moon in kendra |
| Mangal Dosha | Mars in own/exalted sign; partner also Manglik; Jupiter aspects Mars |
| Neechabhanga | (This IS a cancellation — debilitation cancelled by specific conditions) |
| Kaal Sarpa | Cancelled if any planet is outside the Rahu-Ketu axis |

## 4. Implementation Plan

### Phase 1: Foundation (engine + types + context)
- Create `src/lib/kundali/yoga-engine/` directory
- Define `YogaRule`, `YogaContext`, `YogaDetectionResult` types
- Build `YogaContext` factory from `KundaliData`
- Build `evaluateAllYogas()` engine that runs all rules and collects results
- Adapter: convert new engine output to existing `YogaComplete[]` format for backward compatibility

### Phase 2: Migrate existing yogas (rule by rule)
- Start with Mahapurusha (simplest, most well-defined)
- Then Chandra yogas (well-documented)
- Then Surya yogas
- Then Doshas
- Then Raja yogas
- Each migration: write rule → write test → verify against known charts → remove from old file

### Phase 3: Add missing yogas
- Per-lagna Raja yogas (different for each ascendant)
- Complete Nabhasa set (32 types)
- Malika variants with first/last planet analysis
- Parivartana with house-pair interpretation

### Phase 4: Domain integration
- Each yoga rule specifies affected domains
- The holistic domain scorer reads yoga results directly (not through category matching)
- Yogas become first-class factors in the domain factor breakdown

### Phase 5: Interpretation engine
- First/last planet analysis for pattern yogas
- Cancellation condition reporting ("Gajakesari present but weakened by combustion")
- Strength based on classical criteria (dignity of involved planets, house placement)
- Generate context-aware descriptions per domain

## 5. Testing Strategy

- Each yoga rule gets its own test file
- Test cases: at least 2 charts where the yoga IS present, 2 where it's NOT
- Verify against Prokerala/Jagannatha Hora for known charts
- Regression: ensure the new engine produces the same `present` flags as the old code for a set of reference charts

## 6. Migration Strategy

The old `yogas-complete.ts` stays functional during migration. The new engine runs in parallel:

```typescript
// During migration
const oldYogas = computeYogasComplete(planets, ascendantSign, ...);
const newYogas = evaluateAllYogas(yogaContext);
// Compare and log discrepancies
```

Once all yogas are migrated and verified, the old file is deleted.

## 7. Open Questions

1. **Rahu/Ketu in yogas**: Classical texts differ on whether to include nodes. BPHS excludes them from Pancha Mahapurusha. Some modern texts include them in Raja yogas. Our approach: follow BPHS strictly, note modern variants in descriptions.

2. **Functional benefic/malefic**: Some yogas depend on functional (lagna-specific) benefic/malefic status, not natural. The engine needs both natural and functional benefic/malefic helpers.

3. **Navamsha yogas**: Currently 18 D9 yogas (exalted/debilitated in navamsha). Should these be in the yoga engine or remain separate? Recommendation: include them with group `navamsha`.

4. **Per-lagna Raja yogas**: There are 12 × ~5 = ~60 per-lagna Raja yogas. Generating all of them is complex but very valuable. Priority: Phase 3.

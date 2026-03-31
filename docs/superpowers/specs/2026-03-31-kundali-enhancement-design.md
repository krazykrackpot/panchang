# Kundali Enhancement: Graha, Yogas, Shadbala, Bhavabala

**Date:** 2026-03-31
**Status:** Approved
**Reference:** https://www.drikpanchang.com/jyotisha/kundali/kundali.html

---

## 1. Overview

Add 4 new tabs to the kundali page — Graha, Yogas, Shadbala, Bhavabala — with proper astronomical calculations for planetary coordinates, a complete yoga library (50+), full classical Shadbala (all 6 components with sub-components), and Bhavabala. Also update the existing yoga display across the dashboard.

---

## 2. New Tabs

Added alongside existing tabs (Chart, Planets, Dasha, Ashtakavarga, Tippanni, Jaimini):

| Tab | Content |
|-----|---------|
| **Graha** | Full planetary data table + upagraha positions |
| **Yogas** | 50+ yogas with auspicious/inauspicious badges, info tooltips |
| **Shadbala** | Classical 6-component strength table with Rupas, Ishta/Kashta |
| **Bhavabala** | House strength with component breakdown |

---

## 3. Graha Tab

### 3.1 Graha Table

A single comprehensive table with one row per planet (Sun through Ketu = 9 rows).

**Columns:**

| Column | Description | Source |
|--------|-------------|--------|
| Graha | Planet name (trilingual) + icon | Existing |
| R | Retrograde flag (R badge if speed < 0) | Existing speed data |
| C | Combust flag (C badge if within combustion orb of Sun) | New: compute from angular distance to Sun |
| Longitude | Sign + degree (e.g. "Aries 15°23'45"") | Existing, reformat |
| Nakshatra/Swami | Nakshatra name + lord planet | Existing nakshatra data |
| Raw Longitude | 0-360° decimal | Existing |
| Latitude | Ecliptic latitude in degrees | **New calculation** |
| Right Ascension | RA in degrees | **New calculation** |
| Declination/Kranti | Declination in degrees | **New calculation** |
| Speed (deg/day) | Daily motion | Existing |

**Combustion orbs** (angular distance from Sun below which planet is combust):
- Moon: 12°
- Mars: 17°
- Mercury: 14° (12° if retrograde)
- Jupiter: 11°
- Venus: 10° (8° if retrograde)
- Saturn: 15°
- Rahu/Ketu: never combust

### 3.2 Upagraha Section

Below the graha table, show upagraha positions. Currently computed on a separate page — integrate into kundali using birth chart Sun position instead of current-date Sun.

**Upagrahas to show:**
1. Dhuma = Sun + 133°20'
2. Vyatipata = 360° - Dhuma
3. Parivesha = Vyatipata + 180°
4. Chapa (Indra Dhanus) = 360° - Parivesha
5. Upaketu = Chapa + 16°40'
6. Gulika/Mandi = Saturn's portion of day/night (weekday-based)

Each upagraha shows: Name, Sign, Degree, Nakshatra.

### 3.3 Coordinate Calculations — `src/lib/ephem/coordinates.ts`

**Ecliptic Latitude** (perturbation terms per planet):
- Moon: Full 6-term latitude series (max ±5.15°)
- Mercury: max ±7°, Venus: max ±3.4°, Mars: max ±1.85°
- Jupiter: max ±1.3°, Saturn: max ±2.5°
- Sun: always 0° (by definition)
- Rahu/Ketu: derive from Moon's node geometry

**Ecliptic to Equatorial transform** (for RA and Declination):
```
obliquity ε = 23.4393° - 0.013° × T  (T in Julian centuries from J2000)
declination δ = arcsin(sin(β)cos(ε) + cos(β)sin(ε)sin(λ))
RA α = atan2(sin(λ)cos(ε) - tan(β)sin(ε), cos(λ))
```
Where λ = ecliptic longitude, β = ecliptic latitude.

**Exports:**
```typescript
interface PlanetCoordinates {
  latitude: number;       // ecliptic latitude in degrees
  rightAscension: number; // RA in degrees (0-360)
  declination: number;    // declination in degrees (-90 to +90)
}

function computePlanetLatitude(planetId: number, jd: number): number;
function eclipticToEquatorial(longitude: number, latitude: number, jd: number): { ra: number; dec: number };
function computeFullCoordinates(planetId: number, longitude: number, jd: number): PlanetCoordinates;
```

---

## 4. Yogas Tab

### 4.1 Complete Yoga Library — `src/lib/kundali/yogas-complete.ts`

50+ yogas organized into categories. Each yoga has:
- Detection function
- Auspicious/Inauspicious classification
- Formation rules (for info tooltip)
- Trilingual name + description

**Full Yoga List:**

#### Dosha Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 1 | Mangala Dosha | Inauspicious | Mars in houses 1, 2, 4, 7, 8, or 12 |
| 2 | Kala Sarpa | Inauspicious | All 7 planets between Rahu-Ketu axis |

#### Pancha Mahapurusha Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 3 | Hansa | Auspicious | Jupiter in own/exalted sign in Kendra (1,4,7,10) |
| 4 | Malavya | Auspicious | Venus in own/exalted sign in Kendra |
| 5 | Shasha | Auspicious | Saturn in own/exalted sign in Kendra |
| 6 | Ruchaka | Auspicious | Mars in own/exalted sign in Kendra |
| 7 | Bhadra | Auspicious | Mercury in own/exalted sign in Kendra |

#### Moon-Based Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 8 | Gajakesari | Auspicious | Jupiter in Kendra from Moon |
| 9 | Sunapha | Auspicious | Planet(s) in 2nd from Moon (not Sun/Rahu/Ketu) |
| 10 | Anapha | Auspicious | Planet(s) in 12th from Moon (not Sun/Rahu/Ketu) |
| 11 | Durdhara | Auspicious | Planets in both 2nd and 12th from Moon |
| 12 | Kemadruma | Inauspicious | No planets in 2nd or 12th from Moon |
| 13 | Chandra Mangala | Auspicious | Moon-Mars conjunction |
| 14 | Shakata | Inauspicious | Jupiter in 6th or 8th from Moon |

#### Sun-Based Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 15 | Budhaditya | Auspicious | Sun-Mercury conjunction in same sign |
| 16 | Veshi | Auspicious | Planet in 2nd from Sun (not Moon/Rahu/Ketu) |
| 17 | Vasi | Auspicious | Planet in 12th from Sun (not Moon/Rahu/Ketu) |
| 18 | Obhayachari | Auspicious | Planets in both 2nd and 12th from Sun |

#### Raja Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 19 | Adhi | Auspicious | Benefics in 6th, 7th, 8th from Moon |
| 20 | Chatussagara | Auspicious | All 4 Kendras occupied by planets |
| 21 | Vasumati | Auspicious | Benefics in Upachaya houses (3,6,10,11) from Moon |
| 22 | Rajalakshana | Auspicious | Lagna lord + 9th lord in mutual Kendra/Trikona |
| 23 | Amala | Auspicious | Only benefics in 10th from Lagna or Moon |
| 24 | Parvata | Auspicious | Benefics in Kendra + no malefics in Kendra |
| 25 | Kahala | Auspicious | 4th lord + 9th lord in mutual Kendra + Lagna lord strong |
| 26 | Lakshmi | Auspicious | 9th lord in own/exalted in Kendra/Trikona + strong Lagna lord |
| 27 | Gauri | Auspicious | Moon in own/exalted + aspected by Jupiter + in Kendra |
| 28 | Bharati | Auspicious | 2nd lord in Kendra + Jupiter in 2nd or aspecting 2nd |
| 29 | Shrinatha | Auspicious | 7th lord exalted + 10th lord in Kendra with Lagna lord |
| 30 | Shankha | Auspicious | 5th + 6th lords in mutual Kendra + strong Lagna lord |
| 31 | Bheri | Auspicious | 9th lord strong + all planets in Kendra from Lagna lord |
| 32 | Mahabhagya | Auspicious | Male: day birth + Sun/Moon/Lagna in odd signs; Female: night birth + all in even |
| 33 | Pushkala | Auspicious | Lagna lord + Moon in Kendra + aspected by/conjunct friendly planet |

#### Wealth & Status Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 34 | Chapa | Auspicious | Lagna lord exalted + 4th & 10th lords exchange signs |
| 35 | Parijata | Auspicious | Lagna lord's dispositor's dispositor in Kendra/Trikona in own/exalted |

#### Inauspicious/Negative Yogas
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 36 | Vanchana Chora Bheeti | Inauspicious | Lagna lord + malefic in Trikasthana (6/8/12) |
| 37 | Lagna Mallika | Depends on context | All planets clustered in houses starting from Lagna |

#### Additional Yogas (existing + new)
| # | Yoga | Classification | Detection Rule |
|---|------|---------------|----------------|
| 38 | Raja Yoga | Auspicious | Kendra + Trikona lord conjunction/exchange |
| 39 | Dhana Yoga | Auspicious | 2nd/11th lord strong + connected to Kendra lord |
| 40 | Viparita Raja | Auspicious | 6th/8th/12th lords in each other's houses |
| 41 | Neechabhanga Raja | Auspicious | Debilitated planet's debilitation cancelled |
| 42 | Dharma-Karmadhipati | Auspicious | 9th + 10th lords conjunct or in mutual Kendra |
| 43 | Saraswati | Auspicious | Jupiter+Venus+Mercury in Kendra/Trikona/2nd |
| 44 | Parivartana | Auspicious | Two planets exchange signs |
| 45 | Guru Chandal | Inauspicious | Jupiter conjunct Rahu |
| 46 | Grahan Yoga | Inauspicious | Sun/Moon conjunct Rahu/Ketu |
| 47 | Daridra | Inauspicious | 11th lord in Trikasthana |
| 48 | Pravrajya | Contextual | 4+ planets in one house |
| 49 | Shakata (extended) | Inauspicious | Jupiter in 6/8/12 from Moon, not cancelled |
| 50 | Kendradhipati Dosha | Inauspicious | Natural benefic owns Kendra |

### 4.2 Yoga Tab UI

- Grouped by category with section headers
- Each yoga row shows: Name (trilingual), Present/Absent badge, Auspicious (green)/Inauspicious (red) badge
- Info icon (i) with tooltip explaining formation rules
- Present yogas highlighted with gold border, absent ones muted
- Filter buttons: All / Present Only / Auspicious / Inauspicious

### 4.3 Existing Dashboard Update

Update the existing yoga display in the Tippanni tab and any other yoga references:
- Add auspicious/inauspicious badge to all existing yoga displays
- Use the new `yogas-complete.ts` as the single source of truth
- Replace `yogas.ts` + `yogas-extended.ts` usage with the unified library
- Ensure the Planets tab and Tippanni tab reflect the complete yoga list

---

## 5. Shadbala Tab — `src/lib/kundali/shadbala.ts`

### 5.1 Full Classical Shadbala

Replace the simplified placeholder implementation with proper Shadbala per B.V. Raman's "Graha & Bhava Balas."

**6 Main Components with Sub-Components:**

#### I. Sthana Bala (Positional Strength) — max ~300 points
1. **Uchcha Bala** — Exaltation strength: `(180 - |planet° - exaltation°|) / 3` (0-60 units)
2. **Saptavargaja Bala** — Strength from 7 divisional charts (Rashi, Hora, Drekkana, Saptamsha, Navamsha, Dwadasamsha, Trimshamsha). Each chart: Moolatrikona=45, Own=30, Friend=22.5, Neutral=15, Enemy=7.5, Great Enemy=3.75. Sum / 7.
3. **Ojhayugma Rashi Bala** — Odd/Even sign strength: Moon & Venus get 15 in even signs; Sun, Mars, Jupiter, Mercury, Saturn get 15 in odd signs
4. **Ojhayugma Navamsha Bala** — Same as above but from Navamsha sign
5. **Kendradi Bala** — Kendra house=60, Panapara=30, Apoklima=15
6. **Drekkana Bala** — First decanate: male planets get 15; Second: neutral planets; Third: female planets

#### II. Dig Bala (Directional Strength) — max 60 points
Based on planet's house position relative to its direction of strength:
- Jupiter & Mercury: strongest in 1st house (East) → `(180 - distance_from_1st × 30) / 3`
- Sun & Mars: strongest in 10th house (South)
- Saturn: strongest in 7th house (West)
- Moon & Venus: strongest in 4th house (North)

Formula: `max(0, (180 - |planet_house_degrees - strength_direction_degrees|)) / 3`

#### III. Kala Bala (Temporal Strength) — max ~300 points
1. **Natonnata Bala** — Diurnal/Nocturnal: Sun, Jupiter, Venus strong by day (60 pts day, 0 night); Moon, Mars, Saturn strong by night. Mercury always 60.
2. **Paksha Bala** — Lunar phase: Benefics (Jupiter, Venus, Mercury, Moon) strong in Shukla Paksha; Malefics in Krishna. Formula: `tithi_angle / 3` for benefics, `(180 - tithi_angle) / 3` for malefics.
3. **Tribhaga Bala** — Day/Night third: Mercury=1st third of day, Sun=2nd, Saturn=3rd; Moon=1st third of night, Venus=2nd, Mars=3rd; Jupiter always. 60 points when active.
4. **Abda Bala** — Lord of the year: 15 points to the weekday lord of the year start
5. **Masa Bala** — Lord of the month: 30 points
6. **Vara Bala** — Lord of the weekday: 45 points
7. **Hora Bala** — Lord of the hora (planetary hour): 60 points
8. **Ayana Bala** — Declination-based: `(24 + declination) × 60 / 48` for Sun etc. Adjusted per planet.
9. **Yuddha Bala** — Planetary war: when two planets within 1°, winner gets loser's strength difference.

#### IV. Chesta Bala (Motional Strength) — max 60 points
Based on planet's apparent motion:
- Vakra (retrograde): 60
- Anuvakra (just turned retrograde): 30
- Vikala (stationary): 15
- Manda (slow): 15
- Mandatara (very slow): 7.5
- Sama (average): 30
- Chara (fast): 45
- Atichara (very fast): 30

For Sun & Moon: Chesta Bala = Ayana Bala.

#### V. Naisargika Bala (Natural Strength) — fixed values
| Planet | Value |
|--------|-------|
| Sun | 60.00 |
| Moon | 51.43 |
| Mars | 17.14 |
| Mercury | 25.71 |
| Jupiter | 34.29 |
| Venus | 42.86 |
| Saturn | 8.57 |

#### VI. Drik Bala (Aspectual Strength) — variable
Based on aspects received from benefics (+) and malefics (-):
- Full aspect strength from aspecting planet's Shadbala
- Benefic aspects add strength, malefic aspects subtract
- Jupiter aspects: 5th, 7th, 9th houses (full)
- Saturn aspects: 3rd, 7th, 10th houses (full)
- Mars aspects: 4th, 7th, 8th houses (full)
- Others: 7th house only

### 5.2 Derived Values

| Value | Formula |
|-------|---------|
| **Total (Shashtiamsha/Pinda)** | Sum of all 6 components |
| **Rupas** | Total / 60 |
| **Minimum Required Rupas** | Sun=5.0, Moon=6.0, Mars=5.0, Mercury=7.0, Jupiter=6.5, Venus=5.5, Saturn=5.0 |
| **Strength Ratio** | Rupas / Minimum Required |
| **Relative Rank** | 1-7 ranking by total strength |
| **Ishta Phala** | `(Uchcha Bala × Chesta Bala)^0.5` |
| **Kashta Phala** | `(60 - Uchcha Bala) × (60 - Chesta Bala))^0.5` |

### 5.3 Shadbala Tab UI

**Main Table** — 7 columns (Sun through Saturn), rows for each component:

```
               Sun    Moon   Mars   Merc   Jup    Ven    Sat
Relative Rank   1      3      2      7      5      4      6
─────────────────────────────────────────────────────────────
Sthana        224.72 190.04 231.68 239.25 186.76 206.69 146.04
Disha          45.33  39.50  39.31   3.77  44.57   7.91  48.85
Kala          174.72 188.44  97.96 105.44 225.87 136.58 117.44
Chesta         33.63  65.84   7.86  33.61  33.35  45.30   0.65
Naisargika     60.00  51.43  17.14  25.71  34.29  42.86   8.57
Drishti       +17.17 -36.26 +28.83 +25.29 -27.54  +8.84 +18.52
─────────────────────────────────────────────────────────────
Total Pinda   555.57 498.97 422.79 433.08 497.29 448.18 340.07
Rupas           9.26   8.32   7.05   7.22   8.29   7.47   5.67
Min. Require    5.00   6.00   5.00   7.00   6.50   5.50   5.00
Strength Ratio 1.85   1.39   1.41   1.03   1.28   1.36   1.13
─────────────────────────────────────────────────────────────
Ishta Phala    41.90  37.43  19.79  17.02  43.02  50.68   2.90
Kashta Phala   14.33   0.00  23.05  36.82  10.94   6.97  52.86
```

Color coding:
- Strength Ratio >= 1.5: green (strong)
- Strength Ratio >= 1.0: gold (adequate)
- Strength Ratio < 1.0: red (weak)

---

## 6. Bhavabala Tab — `src/lib/kundali/bhavabala.ts`

### 6.1 Components

| Component | Description | Max |
|-----------|-------------|-----|
| **Bhavadhipati Bala** | Shadbala of house lord | Variable |
| **Bhava Dig Bala** | Directional strength of house (1,4,7,10 strongest) | 60 |
| **Bhava Drishti Bala** | Aspects on house from benefics (+) / malefics (-) | Variable |

### 6.2 Bhavabala Tab UI

Table with 12 rows (one per house/bhava):

```
Bhava  Lord  Bhavadhipati  Dig Bala  Drishti  Total  Strength%
  1    Mars     422.79      60.00    +12.50   495.29    128%
  2    Venus    448.18      30.00     -5.30   472.88    112%
 ...
```

Bar chart visualization showing relative house strengths.

---

## 7. Panchangam Integration

The existing Panchang data (tithi, nakshatra, yoga, karana, vara) for the birth moment is already computed. Display it in the Graha tab as a summary card above the graha table:

| Element | Value |
|---------|-------|
| Tithi | Shukla Chaturthi |
| Nakshatra | Ashwini Pada 2 |
| Yoga | Shubha |
| Karana | Baalava |
| Vara | Somavar |

---

## 8. Type Definitions — `src/types/kundali.ts` additions

```typescript
interface GrahaDetail {
  planetId: number;
  planetName: Trilingual;
  isRetrograde: boolean;
  isCombust: boolean;
  longitude: number;          // 0-360
  signDegree: string;         // "15°23'45""
  sign: number;               // 1-12
  signName: Trilingual;
  nakshatra: number;          // 1-27
  nakshatraName: Trilingual;
  nakshatraLord: Trilingual;
  nakshatraPada: number;      // 1-4
  latitude: number;           // ecliptic latitude
  rightAscension: number;     // RA in degrees
  declination: number;        // declination in degrees
  speed: number;              // deg/day
}

interface UpagrahaPosition {
  name: Trilingual;
  longitude: number;
  sign: number;
  signName: Trilingual;
  degree: string;
  nakshatra: Trilingual;
}

interface ShadBalaComplete {
  planet: string;
  planetId: number;
  sthanaBala: number;         // sum of 6 sub-components
  digBala: number;
  kalaBala: number;           // sum of 9 sub-components
  cheshtaBala: number;
  naisargikaBala: number;
  drikBala: number;
  totalPinda: number;
  rupas: number;
  minRequired: number;
  strengthRatio: number;
  rank: number;               // 1-7
  ishtaPhala: number;
  kashtaPhala: number;
  // Sub-component breakdowns
  sthanaBreakdown: { ucchaBala: number; saptavargaja: number; ojhayugmaRashi: number; ojhayugmaNavamsha: number; kendradiBala: number; drekkanaBala: number };
  kalaBreakdown: { natonnataBala: number; pakshaBala: number; tribhagaBala: number; abdaBala: number; masaBala: number; varaBala: number; horaBala: number; ayanaBala: number; yuddhaBala: number };
}

interface BhavaBalaResult {
  bhava: number;              // 1-12
  lord: number;               // planet id
  lordName: Trilingual;
  bhavadhipatiBala: number;
  bhavaDigBala: number;
  bhavaDrishtiBala: number;
  total: number;
  strengthPercent: number;
}

interface YogaComplete {
  id: string;
  name: Trilingual;
  category: 'dosha' | 'mahapurusha' | 'moon_based' | 'sun_based' | 'raja' | 'wealth' | 'inauspicious' | 'other';
  isAuspicious: boolean;
  present: boolean;
  strength: 'Strong' | 'Moderate' | 'Weak';
  formationRule: Trilingual;  // tooltip text
  description: Trilingual;
}
```

---

## 9. File Plan

### New Files
| File | Lines (est.) | Purpose |
|------|-------------|---------|
| `src/lib/ephem/coordinates.ts` | ~250 | Planetary latitude, RA, declination |
| `src/lib/kundali/shadbala.ts` | ~600 | Full classical Shadbala |
| `src/lib/kundali/bhavabala.ts` | ~150 | House strength |
| `src/lib/kundali/yogas-complete.ts` | ~800 | Complete yoga library + detection |

### Modified Files
| File | Changes |
|------|---------|
| `src/types/kundali.ts` | Add GrahaDetail, ShadBalaComplete, BhavaBalaResult, YogaComplete, UpagrahaPosition |
| `src/lib/ephem/kundali-calc.ts` | Call new coordinate functions, new shadbala, integrate yogas-complete, compute upagrahas, compute combust status |
| `src/app/[locale]/kundali/page.tsx` | Add 4 new tabs with UI components |
| `src/app/api/kundali/route.ts` | Return extended data (graha details, yogas, shadbala, bhavabala) |

### Deprecated (replaced by yogas-complete.ts)
| File | Action |
|------|--------|
| `src/lib/kundali/yogas.ts` | Keep file but import from yogas-complete internally |
| `src/lib/tippanni/yogas-extended.ts` | Keep file but import from yogas-complete internally |

---

## 10. Trilingual Support

All new labels, yoga names, formation rules, and descriptions must support `{ en, hi, sa }` format consistent with existing codebase patterns. Use inline LABELS objects per the project convention for page-specific content.

---

## 11. UI Design

Follow existing kundali page patterns:
- Glass-card containers with `border-gold-primary/10`
- Gold gradient headings
- Expandable detail sections
- Responsive tables (horizontal scroll on mobile)
- Devanagari font switching for hi/sa locales
- Color coding: green=strong/auspicious, red=weak/inauspicious, gold=neutral
- Info tooltips using a simple hover/click popover (no external tooltip library)

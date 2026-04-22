# Kundali System Architecture

> Authoritative technical reference for the Jyotish computation layer of Dekho Panchang.
> Covers astronomical foundations, chart generation, strength analysis, timing systems,
> compatibility matching, transit overlays, and specialized subsystems.
>
> Last updated: 2026-04-22

---

## Table of Contents

1. [Astronomical Foundation](#part-1-astronomical-foundation)
2. [Birth Chart Generation](#part-2-birth-chart-generation)
3. [Planetary Strength](#part-3-planetary-strength)
4. [Yoga and Dosha Detection](#part-4-yoga-and-dosha-detection)
5. [Dasha Systems](#part-5-dasha-systems)
6. [Matching (Compatibility)](#part-6-matching-compatibility)
7. [Transit (Gochara) System](#part-7-transit-gochara-system)
8. [Specialized Systems](#part-8-specialized-systems)
9. [Interpretation and Narrative](#part-9-interpretation-and-narrative)
10. [Upagrahas](#part-10-upagrahas)
11. [Calendar and Panchang](#part-11-calendar-and-panchang)
12. [Data Constants](#part-12-data-constants)
13. [Quality Assurance](#part-13-quality-assurance)

---

## Part 1: Astronomical Foundation

### Overview

All planetary positions in this application are computed locally --- no external astrology API is called. There are two computation paths: Swiss Ephemeris (server-side, sub-arcsecond accuracy) and Meeus algorithms (client-safe fallback, moderate accuracy). Every position request first checks whether Swiss Ephemeris is available and transparently falls back to Meeus if it is not.

### Swiss Ephemeris Integration

**What it is:** Swiss Ephemeris is a high-precision astronomical library (derived from JPL DE431 data) that computes planetary positions to sub-arcsecond accuracy across the time range 5400 BC to 5400 AD.

**Implementation:** `src/lib/ephem/swiss-ephemeris.ts`

The native Node.js binding (`sweph` npm package) is loaded at runtime via a dynamic `eval('require')` call to prevent Turbopack from trying to bundle the native module. It is only loaded on the server (`typeof window !== 'undefined'` guard). A boolean check `isSwissEphAvailable()` lets every caller know which path to use.

Key functions:

| Function | Purpose |
|---|---|
| `swissJulDay()` | Gregorian date to Julian Day via Swiss Ephemeris |
| `swissPlanetLongitude(jd, planetId)` | Tropical longitude, latitude, distance, speed for one planet |
| `swissSiderealLongitude(jd, planetId)` | Sidereal longitude (tropical minus ayanamsha) |
| `swissAllPlanets(jd)` | All 9 grahas in one call (single ayanamsha computation) |
| `swissAyanamsha(jd, sidMode?)` | Ayanamsha value for 11 supported systems |
| `swissSunrise(jd, lat, lng)` | Sunrise UT via `rise_trans` (refraction-corrected) |
| `swissSunset(jd, lat, lng)` | Sunset UT via `rise_trans` |

**Memoization:** Three LRU-style caches (`planetCache`, `allPlanetsCache`, `ayanamshaCache`) keyed on JD rounded to 6 decimals (approximately 0.1-second precision). Cache maximum is 500 entries; when exceeded, the oldest half is evicted.

**Planet ID mapping to Swiss Eph constants:**

| Vedic ID | Planet | Swiss Eph Constant |
|---|---|---|
| 0 | Sun | `SE_SUN` |
| 1 | Moon | `SE_MOON` |
| 2 | Mars | `SE_MARS` |
| 3 | Mercury | `SE_MERCURY` |
| 4 | Jupiter | `SE_JUPITER` |
| 5 | Venus | `SE_VENUS` |
| 6 | Saturn | `SE_SATURN` |
| 7 | Rahu | `SE_MEAN_NODE` |
| 8 | Ketu | `SE_MEAN_NODE` + 180 degrees |

### Meeus Fallback

**What it is:** Jean Meeus's "Astronomical Algorithms" provides truncated series expansions for Sun and Moon positions that can run in any JavaScript environment (browser or server). Accuracy: Sun approximately 0.01 degrees, Moon approximately 0.5 degrees, outer planets up to 22 degrees error for Mars.

**Implementation:** `src/lib/ephem/astronomical.ts`

The `sunLongitude(jd)` and `moonLongitude(jd)` functions check `isSwissEphAvailable()` first and call the private `_meesusSunLongitude` / `_meeusMoonLongitude` functions only as fallback.

The Meeus Moon longitude implementation uses the full Chapront ELP-2000 fundamental arguments (Lp, D, M, Mp, F) with the principal periodic terms from Meeus Table 47.A.

**Limitation:** The Meeus path does not compute Mars through Saturn or Rahu/Ketu. Those planets are only available when Swiss Ephemeris is loaded. On the client side, planetary positions come from pre-computed server data passed via props or API response.

### Ayanamsha Systems

**What it is:** Ayanamsha is the angular difference between the tropical (Western) and sidereal (Vedic) zodiacs. It accounts for the precession of the equinoxes. Every sidereal longitude in the app is computed as `tropical - ayanamsha`.

**Supported systems (11):**

| System | Swiss Eph Constant | Notes |
|---|---|---|
| Lahiri (default) | `SE_SIDM_LAHIRI` | IAE standard, Chitrapaksha. Used by most Indian astrologers. |
| True Chitra | `SE_SIDM_TRUE_CITRA` | Tracks Spica's actual current position |
| True Revati | `SE_SIDM_TRUE_REVATI` | Zeta Piscium at 0 degrees Aries |
| KP (Krishnamurti) | `SE_SIDM_LAHIRI - 0.094 deg` | Lahiri with approximately 6 arcmin offset |
| Raman (BV Raman) | `SE_SIDM_RAMAN` | Popular in South India |
| Yukteshwar | `SE_SIDM_YUKTESHWAR` | From "The Holy Science" |
| JN Bhasin | `SE_SIDM_JN_BHASIN` | |
| Fagan-Bradley | `SE_SIDM_FAGAN_BRADLEY` | Western sidereal standard |
| True Pushya | `SE_SIDM_TRUE_PUSHYA` | Delta Cancri fixed |
| Galactic Center | `SE_SIDM_GALCENT_0SAG` | GC at 0 degrees Sagittarius |

**Implementation detail:** KP has no dedicated Swiss Ephemeris constant. We use Lahiri and subtract 0.09444 degrees (approximately 6 arcminutes). After every non-Lahiri ayanamsha call, Swiss Ephemeris is reset to Lahiri mode since other SwEph calls assume Lahiri.

**Meeus fallback ayanamsha:** `src/lib/astronomy/ayanamsa.ts` provides polynomial approximations for Lahiri, Krishnamurti, and Raman. These are within plus or minus 1 arcsecond for 1900-2100 dates.

### Delta T Correction

**What it is:** Delta T is the difference between terrestrial dynamical time (TT) and universal time (UT). It matters for historical dates where UT diverges from TT by minutes or hours. For modern dates (post-1972) it is under 70 seconds.

**Our approach:** Swiss Ephemeris handles Delta T internally when using `calc_ut` (the UT-based calculation function). The Meeus path does not apply Delta T correction --- this is acceptable because the Meeus path is only used for approximate browser-side calculations on recent dates where the error is negligible.

### Sunrise and Sunset

**What it is:** Sunrise and sunset times are critical in Vedic astrology because the panchang day runs sunrise-to-sunrise, and many timing calculations (Rahu Kaal, Choghadiya, Hora, Gulika) depend on the day/night duration.

**Primary path (Swiss Ephemeris):** `src/lib/ephem/swiss-ephemeris.ts` --- `swissSunrise()` and `swissSunset()` use `rise_trans()` with standard atmospheric refraction (1013.25 mbar, 15 degrees C). Sub-minute accuracy.

**Fallback path:** `src/lib/astronomy/sunrise.ts` --- 2-pass algorithm from Meeus Chapter 15:

1. First pass: compute hour angle at noon using solar declination and the standard refraction altitude of -0.8333 degrees. This gives initial sunrise/sunset estimates.
2. Second pass: recalculate using solar position at the estimated rise/set times. This corrects for the Sun's declination change during the day.

Civil twilight (dawn/dusk) uses -6 degrees altitude threshold with a single pass.

**Classical authority:** Surya Siddhanta defines the astrological day as beginning at sunrise. The -0.8333 degrees refraction correction (34 arcminutes refraction + 16 arcminutes solar semidiameter) matches the moment the Sun's upper limb appears at the geometric horizon.

---

## Part 2: Birth Chart Generation

### Overview

A birth chart (Kundali/Janam Kundali) is a map of the sky at the exact moment and place of birth. It records which zodiac sign was rising on the eastern horizon (the Ascendant/Lagna), which signs the planets occupied, and how those signs map to the 12 houses of life experience.

**Entry point:** `src/lib/ephem/kundali-calc.ts` --- `generateKundali(birthData)` is the master orchestrator. It accepts birth date, time, latitude, longitude, and timezone, then returns a complete `KundaliData` object containing planets, houses, dashas, divisional charts, yogas, strengths, and all derived data.

### Ascendant Calculation

**What it is:** The Ascendant (Lagna) is the zodiac degree rising on the eastern horizon at the moment of birth. It determines the first house and anchors the entire chart.

**Algorithm:** `calculateAscendant(jd, lat, lng)` in `kundali-calc.ts`

```
1. Compute GMST (Greenwich Mean Sidereal Time):
   GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + higher-order terms

2. Convert to LST (Local Sidereal Time):
   LST = normalize(GMST + longitude)

3. Compute obliquity of the ecliptic:
   eps = 23.4393 - 0.013 * T

4. Apply the Ascendant formula:
   y = -cos(LST)
   x = sin(eps) * tan(lat) + cos(eps) * sin(LST)
   Asc = atan2(y, x) + 180 degrees
```

The result is the tropical Ascendant degree. It is then converted to sidereal by subtracting the ayanamsha.

**Classical authority:** This is the standard spherical astronomy formula for the ecliptic degree at the eastern horizon. It appears in slightly different forms in Surya Siddhanta and modern computational astronomy texts.

### House Systems

**What it is:** Houses divide the ecliptic into 12 sectors representing different areas of life (self, wealth, siblings, home, etc.). Different traditions compute house boundaries differently.

**Implementation:** `src/lib/kundali/house-systems.ts`

| System | Method | Usage |
|---|---|---|
| Whole Sign (default) | Entire sign containing Ascendant = House 1 | Primary display chart |
| Equal House | Each house = 30 degrees starting from Ascendant degree | Used in `kundali-calc.ts` main path |
| Sripati | Midpoint between Equal House cusps | Bhav Chalit chart (Maharashtra tradition) |
| Placidus | Time-based trisection | KP System only (via `src/lib/kp/placidus.ts`) |

**Whole Sign:** Each cusp starts at 0 degrees of the sign. `calculateWholeSignCusps(ascDeg)` computes `signIndex * 30` for each of the 12 houses.

**Sripati:** Each house boundary = midpoint between adjacent Equal House midpoints. Used for Bhav Chalit analysis where planets may shift houses relative to the Rasi chart. Handles the 360-degree wraparound edge case.

**Design choice:** The default display uses Whole Sign because it matches the most widespread North Indian tradition. Sripati is computed alongside for the Bhav Chalit overlay. Placidus is only used by the KP system module.

### Planet Placement

**9 grahas:** Sun (0), Moon (1), Mars (2), Mercury (3), Jupiter (4), Venus (5), Saturn (6), Rahu (7), Ketu (8).

For each planet, we store:
- Sidereal longitude (0-360 degrees)
- Rashi (sign 1-12, derived as `floor(longitude / 30) + 1`)
- Nakshatra (1-27, derived as `floor(longitude / (360/27)) + 1`)
- Nakshatra Pada (1-4, derived from degree within nakshatra)
- House (1-12, from house cusp system)
- Speed (degrees/day)
- Retrograde status
- Dignity (exalted, own sign, debilitated, friend, enemy, neutral)

**Dignity constants:**

| Planet | Exalted Sign | Debilitated Sign | Own Signs |
|---|---|---|---|
| Sun | Aries (1) | Libra (7) | Leo (5) |
| Moon | Taurus (2) | Scorpio (8) | Cancer (4) |
| Mars | Capricorn (10) | Cancer (4) | Aries (1), Scorpio (8) |
| Mercury | Virgo (6) | Pisces (12) | Gemini (3), Virgo (6) |
| Jupiter | Cancer (4) | Capricorn (10) | Sagittarius (9), Pisces (12) |
| Venus | Pisces (12) | Virgo (6) | Taurus (2), Libra (7) |
| Saturn | Libra (7) | Aries (1) | Capricorn (10), Aquarius (11) |

### Rahu: Mean Node vs. True Node

**Design choice:** We use the **mean node** (`SE_MEAN_NODE`) for Rahu, not the true (osculating) node. Ketu is always Rahu + 180 degrees.

**Rationale:**
- The mean node is a smoothly-varying average of the Moon's orbital node. The true node oscillates with a period of approximately 18.6 days and an amplitude of about 1.5 degrees.
- Most traditional Indian astrologers (Parashari, KP) use the mean node. The true node is a modern astronomical refinement that classical texts did not anticipate.
- For Vimshottari Dasha balance calculation, the mean node gives more consistent results because the dasha starting point depends on the Moon's exact nakshatra position, and the smooth mean node avoids sudden 1.5-degree jumps.

**Limitation:** Some modern practitioners and certain South Indian traditions prefer the true node. A future configuration option could expose this choice.

### Divisional Charts (Varga)

**What it is:** Divisional charts subdivide each 30-degree sign into smaller portions and remap them to signs, creating specialized charts for different life areas. D9 (Navamsha) for marriage, D10 (Dasamsha) for career, D60 (Shashtiamsha) for past-life karma, etc.

**Implementation:** `getDivisionalSign(sidLong, division)` in `kundali-calc.ts` --- a single function handling all divisions via a switch statement with chart-specific rules.

**Supported divisions:**

| Chart | Division | Classical Name | Formula Type |
|---|---|---|---|
| D1 | 1 | Rasi | Identity (natal chart) |
| D2 | 2 | Hora | Sun/Moon (Leo/Cancer) alternating by odd/even sign |
| D3 | 3 | Drekkana | Trinal offset (0, 4, 8 signs) |
| D4 | 4 | Chaturthamsha | Movable/Fixed/Dual starting offset |
| D5 | 5 | Panchamsha | Cyclic from same sign |
| D6 | 6 | Shashthamsha | Odd from Aries, even from Libra |
| D7 | 7 | Saptamsha | Odd from same, even from 7th |
| D8 | 8 | Ashtamsha | Movable/Fixed/Dual starting offset |
| D9 | 9 | Navamsha | Element-based start: Fire=Aries, Earth=Capricorn, Air=Libra, Water=Cancer |
| D10 | 10 | Dasamsha | Odd from same, even from 9th |
| D12 | 12 | Dwadasamsha | From same sign (cyclic) |
| D16 | 16 | Shodasamsha | Movable=Aries, Fixed=Leo, Dual=Sagittarius |
| D20 | 20 | Vimshamsha | Movable=Aries, Fixed=Sagittarius, Dual=Leo |
| D24 | 24 | Chaturvimshamsha | Odd from Leo, even from Cancer |
| D27 | 27 | Nakshatramsha | Element-based (Fire=Ar, Earth=Cn, Air=Li, Water=Cp) |
| D30 | 30 | Trimshamsha | Unequal parts (5,5,8,7,5 degrees), mapped to specific signs by odd/even |
| D40 | 40 | Khavedamsha | Odd from Aries, even from Libra |
| D45 | 45 | Akshavedamsha | Movable=Aries, Fixed=Leo, Dual=Sagittarius |
| D60 | 60 | Shashtiamsha | Odd from same sign, even from 7th |
| D150 | 150 | Nadi Amsha | `src/lib/kundali/nadi-amsha.ts` --- 0.2 degree parts, forward/reverse by odd/even |

**Classical authority:** All varga division formulas follow Brihat Parashara Hora Shastra (BPHS) Chapters 6-7. D30 (Trimshamsha) uses the unequal-parts rule unique to this chart.

**D150 (Nadi Amsha):** Requires extremely precise birth time. A 2-minute error changes positions. Implementation in `src/lib/kundali/nadi-amsha.ts` uses `Math.floor(degreeInSign * 5 + 1e-9) + 1` to avoid floating-point issues with 0.2-degree division.

**Vargottama detection:** A planet is Vargottama when it occupies the same sign in D1 and D9. The code maps D9 house offsets back to absolute signs: `actualD9SignIdx = (navAscSign - 1 + houseOffset) % 12`. Historical bug: previously compared house offsets directly to D1 signs, which only worked when D9 Ascendant was Aries.

---

## Part 3: Planetary Strength

### Shadbala (Six-fold Strength)

**What it is:** Shadbala quantifies how powerful each planet is in a specific chart by evaluating six independent dimensions. A planet needs a minimum Shadbala to deliver its promised results. Think of it as a 6-component "power rating" for each planet.

**Classical authority:** BPHS Chapters 27-28, Graha & Bhava Balas.

**Implementation:** `src/lib/kundali/shadbala.ts` (759 lines) --- `calculateFullShadbala()` is the comprehensive engine. There is also a simplified version in `kundali-calc.ts` for quick display.

**The six components:**

| Component | What it Measures | Key Sub-components |
|---|---|---|
| **Sthana Bala** (Positional) | Dignity based on where the planet sits | Uccha Bala (exaltation distance), Saptavargaja (dignity across 7 vargas), Ojhayugma (odd/even sign+navamsha), Kendradi (angular/succedent/cadent), Drekkana |
| **Dig Bala** (Directional) | Whether the planet is in its preferred direction/house | Sun/Mars strong in 10th (south), Moon/Venus in 4th (north), Jupiter/Mercury in 1st (east), Saturn in 7th (west) |
| **Kala Bala** (Temporal) | Strength from time-related factors | Natonnata (day/night birth), Paksha (waxing/waning Moon), Tribhaga (3-part day/night), Abda/Masa/Vara/Hora (year/month/weekday/hour lord), Ayana (declination), Yuddha (planetary war) |
| **Cheshta Bala** (Motional) | Strength from planetary motion | Derived from speed and retrograde status. Maximum when retrograde (planet appears to "try harder"). |
| **Naisargika Bala** (Natural) | Inherent strength of the planet | Fixed values: Sun=60, Moon=51, Venus=42, Jupiter=34, Mercury=25, Mars=17, Saturn=8. Invariant across charts. |
| **Drik Bala** (Aspectual) | Strength from aspects received | Benefic aspects increase, malefic aspects decrease. Computed from aspect relationships. |

**Output:** Total Pinda (virupas), Rupas (pinda/60), minimum required strength per planet, strength ratio, rank, and Ishta/Kashta Phala (benefic/malefic potential).

**Minimum required strengths (in Rupas):** Sun=5.0, Moon=6.0, Mars=5.0, Mercury=7.0, Jupiter=6.5, Venus=5.5, Saturn=5.0. A planet scoring below its minimum is considered weak and may need remedies.

### Bhava Bala (House Strength)

**What it is:** Measures how strong each house is, independent of which planets occupy it. A strong house delivers its significations (wealth, marriage, career, etc.) more effectively.

**Implementation:** `src/lib/kundali/bhavabala.ts`

Components: Bhavadhipati Bala (lord's strength), Bhava Drishti Bala (aspects to the house), Bhava Dig Bala (directional).

### Vimshopaka Bala (16-Chart Dignity Score)

**What it is:** Evaluates a planet's dignity across all 16 Shodashavarga divisional charts, weighted by importance. Maximum score is 20 points per planet. A planet scoring 18+ is "Poorna" (full strength); below 5 is "Ati-Alpa" (extremely weak).

**Classical authority:** BPHS Chapter 16.

**Implementation:** `src/lib/kundali/vimshopaka.ts` (130 lines)

**Dignity scoring per varga:**

| Dignity | Points |
|---|---|
| Exalted | 20 |
| Moolatrikona | 18 |
| Own Sign | 16 |
| Friend's Sign | 12 |
| Neutral Sign | 8 |
| Enemy's Sign | 4 |
| Debilitated | 2 |
| Rahu/Ketu (any) | 10 (neutral) |

**Varga weights:** D1=3.5, D9=3, D60=4, D16=2, D30=1, others 0.5 or 1.0. These weights reflect the classical importance hierarchy: D1 (life overview), D9 (dharma/marriage), D60 (past-life karma) carry the most weight.

**Historical bug (fixed):** The ENEMIES table was missing. Without it, the dignity function could not distinguish "neutral" from "enemy" signs, inflating Vimshopaka totals. Fixed by adding explicit `ENEMIES` records per planet following BPHS Chapter 3.

### Ashtakavarga (Transit Strength Grid)

**What it is:** A binary (0/1) scoring system where each planet's position in each of the 12 signs is evaluated from 8 reference points (7 planets + Ascendant). The result is a 7x12 matrix of benefic points (BAV = Bhinnashtakavarga). The column sums give SAV (Sarvashtakavarga) scores for each sign.

**Classical authority:** BPHS Chapters 66-69.

**Implementation:**
- BAV/SAV computation: within `kundali-calc.ts`
- Shodhana reductions: `src/lib/kundali/ashtakavarga-shodhana.ts`
- Dasha predictions: `src/lib/kundali/ashtakavarga-dasha.ts`

**Shodhana (reduction) process:**

1. **Trikona Shodhana:** For each planet's 12-sign row, group signs by element (Fire: Aries/Leo/Sagittarius; Earth: Taurus/Virgo/Capricorn; Air: Gemini/Libra/Aquarius; Water: Cancer/Scorpio/Pisces). Find the minimum value in each group and subtract it from all three signs. This removes the "base level" of each element.

2. **Ekadhipatya Shodhana:** For dual-ruled sign pairs (Aries-Scorpio by Mars, Taurus-Libra by Venus, etc.), compare the values in both signs. The higher value is reduced to the difference; the lower becomes 0. Sun (Leo) and Moon (Cancer) are mono-ruled and skipped.

3. **Pinda Ashtakavarga:** Multiply each reduced cell by Rashi Guna (Fire=7, Earth=5, Air=6, Water=8) and Graha Guna (Sun=5, Moon=5, Mars=8, Mercury=5, Jupiter=10, Venus=7, Saturn=5), then sum to get a single Pinda value per planet.

**Dasha prediction thresholds:** BAV total 40+ = highly favorable, 30-39 = favorable, 20-29 = moderate, under 20 = challenging. Rahu uses Saturn's BAV row; Ketu uses Mars's BAV row (classical convention).

---

## Part 4: Yoga and Dosha Detection

### Overview

**What yogas are:** Yogas are specific planetary combinations (configurations) that indicate particular life outcomes --- wealth, fame, suffering, spiritual growth, etc. They are the "pattern matching" layer of Jyotish. A birth chart is read primarily through its yogas.

**What doshas are:** Doshas are negative yogas that indicate specific afflictions. They often have cancellation rules that negate the dosha under certain conditions.

### Yoga Detection Engine

**Implementation:** Two files serve complementary roles:

- `src/lib/kundali/yogas-complete.ts` (2,410 lines) --- comprehensive library with 150+ yogas across 26 detection functions. This is the primary engine called by `generateKundali()`.
- `src/lib/kundali/yogas.ts` --- simpler subset used for quick checks and display contexts where full detection is unnecessary.

**Yoga categories and detection functions:**

| Category | Examples | Detection Function |
|---|---|---|
| Dosha | Mangal Dosha, Kala Sarpa, Grahan Yoga | `detectDoshaYogas()` |
| Mahapurusha | Ruchaka, Bhadra, Hamsa, Malavya, Sasa | `detectMahapurushaYogas()` |
| Moon-based | Sunaphaa, Anaphaa, Dhurdhura, Kemdrum | `detectMoonBasedYogas()`, `detectExtendedMoonYogas()` |
| Sun-based | Veshi, Voshi, Ubhayachari | `detectSunBasedYogas()` |
| Raja | Kendra-Trikona lord conjunction, Dharma-Karmadhipati | `detectRajaYogas()`, `detectExpandedRajaYogas()` |
| Wealth (Dhana) | Lakshmi, Dhana, Chandra-Mangal | `detectWealthYogas()`, `detectMoreDhanaYogas()` |
| Inauspicious | Kemadruma, Shakata, Daridra | `detectInauspiciousYogas()`, `detectDaridraYogas()` |
| Sankhya | Yuga, Gola, Dama, etc. (pattern-based) | `detectSankhyaYogas()` |
| Nabhasa | Rajju, Musala, Nala, etc. (shape-based) | `detectNabhasaYogas()` |
| Kartari | Shubha/Papa Kartari (hemming) | `detectKartariYogas()` |
| Parivartana | Mutual sign exchange between house lords | `detectParivartanaYogas()` |
| Conjunction | Specific multi-planet conjunctions | `detectConjunctionYogas()` |
| Retrograde | Effects of retrograde planets in specific positions | `detectRetroYogas()` |
| Arishta | Balarishta, longevity afflictions | `detectArishtaYogas()`, `detectMoreArishtaYogas()` |
| Graha Malika | Planet chain across consecutive houses | `detectGrahaMalikaYogas()` |
| Classical | Viparita Raja, Neechabhanga | `detectClassicalPlanetYogas()` |

Each yoga result includes: id, trilingual name, category, auspicious flag, present flag, strength (Strong/Moderate/Weak), formation rule, and description --- all trilingual.

**Key house classifications used throughout:**

```
KENDRA = [1, 4, 7, 10]      // Angular houses (strongest)
TRIKONA = [1, 5, 9]          // Trinal houses (auspicious)
DUSTHANA = [6, 8, 12]        // Difficult houses
UPACHAYA = [3, 6, 10, 11]    // Growth houses
```

### Mangal Dosha (Mars Affliction)

**What it is:** When Mars occupies houses 1, 2, 4, 7, 8, or 12 from the Lagna, Moon, or Venus, it is said to create Mangal (Kuja) Dosha, affecting marriage prospects and partnership harmony.

**Classical authority:** Brihat Parashara Hora Shastra, standard Parashari rules.

**Implementation:** `src/lib/kundali/mangal-dosha-engine.ts` (292 lines)

**Three reference points:** The dosha is checked from Lagna sign, Moon sign, and Venus sign. The more reference points triggered, the more severe the dosha.

**House-based severity:**
- Houses 7, 8 = severe
- Houses 1, 4 = moderate
- Houses 2, 12 = mild

**Scope severity:**
- Triggered from 3/3 references = severe
- Triggered from 2/3 = moderate
- Triggered from 1/3 = mild

**Effective severity** = max(house severity, scope severity), then reduced by cancellation steps.

**8 cancellation rules (each drops severity by 1 step):**

1. Mars in own sign (Aries or Scorpio)
2. Mars in exaltation (Capricorn)
3. Mars conjunct or aspected by Jupiter (benefic influence)
4. Mars conjunct or aspected by benefic Moon (waxing, speed > 0)
5. Venus in a Kendra from Lagna
6. Mars aspected by Saturn (malefic-on-malefic neutralization)
7. Mars in Leo 7th house (Sun's sign)
8. Mars in Aquarius or Pisces 12th house (Jupiter/Saturn signs)

If cancellations reduce severity to 0 or below, effective severity becomes "cancelled."

### Kala Sarpa Yoga

**What it is:** When all seven visible planets (Sun through Saturn) are hemmed between Rahu and Ketu (i.e., all fall on one side of the Rahu-Ketu axis), a Kala Sarpa Yoga forms. Traditionally considered powerful but challenging.

**12 sub-types** named for different serpents, determined by which house Rahu occupies (Ananta, Kulika, Vasuki, Shankhapala, Padma, Mahapadma, Takshaka, Karkotaka, Shankhachuda, Paataka, Vishakta, Sheshanaga).

### Neechabhanga Raja Yoga

**What it is:** Cancellation of debilitation (Neecha Bhanga). When a debilitated planet has its debilitation "cancelled" by specific supporting conditions, the negative placement transforms into a powerful Raja Yoga.

**5 cancellation rules:** Lord of the debilitation sign in a kendra from Lagna or Moon; exaltation lord of the debilitated planet in a kendra; debilitated planet conjunct or aspected by the sign lord; debilitated planet in exchange with the sign lord; debilitated planet aspected by another debilitated planet that has cancellation.

---

## Part 5: Dasha Systems

### Overview

**What dashas are:** Dashas are planetary period systems that divide a person's life into time segments, each ruled by a specific planet (or sign). They are the primary timing mechanism in Vedic astrology --- they answer "when" things happen.

### Vimshottari Dasha (Primary)

**What it is:** A 120-year cycle divided among 9 planets in a fixed order, with each planet ruling a specific number of years. The starting position in the cycle is determined by the Moon's nakshatra at birth.

**Classical authority:** BPHS Chapter 17.

**Implementation:** Two parallel implementations:
- `src/lib/ephem/kundali-calc.ts` --- `calculateVimshottariDasha()` (inline in the kundali generator)
- `src/lib/kundali/dasha.ts` --- standalone module `calculateDashas()` with full sub-period computation

**Dasha order and periods:**

| Planet | Years | Cumulative |
|---|---|---|
| Ketu | 7 | 7 |
| Venus | 20 | 27 |
| Sun | 6 | 33 |
| Moon | 10 | 43 |
| Mars | 7 | 50 |
| Rahu | 18 | 68 |
| Jupiter | 16 | 84 |
| Saturn | 19 | 103 |
| Mercury | 17 | 120 |

**Nakshatra-to-lord mapping:** The 27 nakshatras cycle through these 9 lords in order: Ashwini=Ketu, Bharani=Venus, Krittika=Sun, ..., Revati=Mercury. Each nakshatra maps to index `nakshatraIndex % 9`.

**Balance computation algorithm:**

```
1. Determine Moon's nakshatra at birth (0-26)
2. Look up the nakshatra's lord and its total dasha years
3. Compute fraction elapsed: moonDegreeInNakshatra / (360/27)
4. Remaining years of first dasha = totalYears * (1 - fractionElapsed)
5. Subsequent dashas follow in full-period order from the next lord
```

**Sub-periods (Antardasha):** Each Maha Dasha is subdivided into 9 Antar Dasha periods, proportional to the same year ratios. The Antar Dasha sequence starts from the Maha Dasha lord itself. Duration: `mahaYears * antarYears / 120`.

**Pratyantara Dasha (sub-sub-periods):** Same proportional subdivision applied to each Antar Dasha. Implemented but displayed only on detailed view.

### Additional Dasha Systems (25+)

**Implementation:** `src/lib/kundali/additional-dashas.ts` (695 lines) plus dedicated files for Ashtottari and Yogini.

**Grouped by type:**

**Nakshatra-based (like Vimshottari, but different cycle lengths and lord sequences):**

| System | Cycle | File |
|---|---|---|
| Ashtottari | 108 years | `ashtottari-dasha.ts` |
| Yogini | 36 years | `yogini-dasha.ts` |
| Shodashottari | 116 years | `additional-dashas.ts` |
| Dwadasottari | 112 years | `additional-dashas.ts` |
| Panchottari | 105 years | `additional-dashas.ts` |
| Satabdika | 100 years | `additional-dashas.ts` |
| Chaturaaseethisama | 84 years | `additional-dashas.ts` |
| Shashtihayani | 60 years | `additional-dashas.ts` |
| Moola Dasha | Custom periods | `additional-dashas.ts` |
| Tara Dasha | Custom periods | `additional-dashas.ts` |
| Tithi Ashtottari | 108 years (tithi-based) | `additional-dashas.ts` |
| Yoga Vimsottari | 120 years (yoga-based) | `additional-dashas.ts` |
| Buddhi Gathi | Custom | `additional-dashas.ts` |
| Naisargika | Fixed per planet | `additional-dashas.ts` |

**Sign-based (Rasi Dashas --- duration based on sign lord's position):**

| System | Authority | Notes |
|---|---|---|
| Narayana | BPHS Ch.19 | Most important rasi dasha. Duration = sign lord distance. Odd signs forward, even signs reverse. |
| Shoola | BPHS | For timing death and suffering. Fixed duration based on trinal groups. |
| Sthira | BPHS | Fixed years per sign (7/8/9 cycle). |
| Kalachakra | BPHS | Based on Moon's nakshatra pada. Complex savya/apsavya alternation. |
| Mandooka | Jaimini | "Frog" dasha --- jumps through signs in a leaping pattern. |
| Drig | Jaimini | Duration from sign-lord to aspecting planet distance. |
| Navamsha | Combined | Duration from D9 sign with D1 lord position. |

**Sudarshana Dasha:** A three-chart overlay (Lagna, Sun, Moon as ascendant) where all three charts progress simultaneously, one sign per year.

### Dasha Sandhi (Transition Analysis)

**What it is:** The period when one Maha Dasha ends and the next begins. The transition energy depends on the friendship/enmity between the outgoing and incoming lords.

**Implementation:** `src/lib/kundali/dasha-sandhi.ts`

**Intensity classification:**
- Mild: outgoing and incoming lords are natural friends
- Moderate: neutral relationship
- Intense: natural enemies

**Duration:** Approximately 6 months to 1 year around the exact transition date, proportional to the dasha periods involved.

### Ashtakavarga-Based Dasha Predictions

**What it is:** Uses the Ashtakavarga BAV scores of the dasha lord to predict the quality of the entire dasha period. A planet with high BAV scores across signs will deliver better results during its period.

**Implementation:** `src/lib/kundali/ashtakavarga-dasha.ts`

**Thresholds:** BAV total 40+ = highly favorable, 30-39 = favorable, 20-29 = moderate, under 20 = challenging. Signs where BAV >= 4 are "strong signs" for that planet's dasha; signs where BAV <= 1 are "weak signs."

---

## Part 6: Matching (Compatibility)

### Ashta Kuta (36-Point System)

**What it is:** The traditional compatibility scoring system comparing the Moon's nakshatra and rashi between two charts across 8 factors (Kutas). Maximum 36 points. Used universally in Indian arranged marriages.

**Classical authority:** Muhurta Chintamani, Jyotish Tattva.

**Implementation:** `src/lib/matching/ashta-kuta.ts`

**The 8 Kutas:**

| Kuta | Max | What it Measures | Algorithm |
|---|---|---|---|
| **Varna** | 1 | Spiritual compatibility (caste/nature) | Rashi mapped to Brahmin(3)/Kshatriya(2)/Vaishya(1)/Shudra(0). Boy >= Girl = 1 pt. |
| **Vashya** | 2 | Dominance/attraction | Rashi mapped to 5 groups: Chatushpada, Manava, Jalachara, Vanachara, Keeta. Same group = 2. |
| **Tara** | 3 | Birth star harmony | Count from boy's nak to girl's (mod 27), then mod 9. Taras 2,4,6,8,9 = favorable. |
| **Yoni** | 4 | Sexual/physical compatibility | Each nakshatra has an animal type and gender. Same animal = 4, friendly = 3, neutral = 2, enemy = 1, worst enemy = 0. |
| **Graha Maitri** | 5 | Mental/intellectual | Lords of the two Moon signs compared: mutual friends = 5, one-way = 3, enemies = 0. |
| **Gana** | 6 | Temperament | Nakshatra mapped to Deva(god)/Manushya(human)/Rakshasa(demon). Same = 6. |
| **Bhakoot** | 7 | Financial/family prosperity | Sign-to-sign relationship. 2/12 or 6/8 = 0 pts (problematic). Others = 7. |
| **Nadi** | 8 | Health/genetic compatibility | Nakshatra mapped to Aadi/Madhya/Antya. Same nadi = 0 pts (dosha). Different = 8. |

**Tara computation historical bug (fixed):** The formula originally used `(diff + 27) % 9` which skipped the intermediate `% 27` step. The correct formula is `((girlNak - boyNak + 27) % 27) % 9 + 1`. The two-step modulo is critical: first mod 27 maps the difference to one nakshatra cycle, then mod 9 maps to the Tara group.

**Verdict thresholds:** 28+ = excellent, 24-27 = good, 18-23 = average, 14-17 = below average, under 14 = not recommended.

### Nadi Dosha with Cancellations

**What it is:** When both partners have the same Nadi (Aadi, Madhya, or Antya), it is considered a genetic/health risk. However, several conditions cancel this dosha.

**5 cancellation rules:**
1. Same nakshatra but different pada (same genetic lineage but different expression)
2. Same rashi but different nakshatra
3. Boy's nakshatra lord is a friend of girl's
4. Both nakshatras ruled by the same planet
5. Same nakshatra AND same pada (N4 override --- paradoxically, identical genetic markers = compatible)

### Rajju Dosha (South Indian)

**What it is:** A Tamil/South Indian compatibility check based on "cord" (Rajju) assignment of nakshatras. Each nakshatra belongs to a body part (feet, hip, navel, neck, head). Same Rajju = dosha.

**Implementation:** `src/lib/matching/rajju-dosha.ts`

### Detailed Report

**What it is:** Beyond the 36-point score, a comprehensive compatibility analysis including Manglik matching, Nadi deep analysis, cross-chart aspects, 7th house comparison, and Venus compatibility.

**Implementation:** `src/lib/matching/detailed-report.ts`

Components:
- **Manglik matching:** Both charts analyzed for Mangal Dosha severity and cancellations. One Manglik + one non-Manglik is flagged.
- **Cross-chart aspects:** Planets in one chart aspecting key houses (1, 5, 7, 9) in the other chart.
- **7th house analysis:** Lord, occupants, and aspects to each person's marriage house.
- **Venus analysis:** Venus sign and house in both charts --- compatible Venus placements improve romantic harmony.

### Dasha Comparison

**Implementation:** `src/lib/matching/dasha-comparison.ts`

Compares the current and upcoming dasha periods of both partners to assess timing compatibility.

---

## Part 7: Transit (Gochara) System

### Overview

**What transits (Gochara) are:** The current positions of planets as they move through the zodiac, evaluated against a person's natal chart. Transits show how current celestial events activate natal promises.

### Gochar Engine

**Implementation:** `src/lib/personalization/gochar.ts`

Computes current planetary positions, determines which natal house each transiting planet falls in, and provides trilingual effect descriptions for all 12 house positions.

### Classical Vedha Table

**What it is:** Vedha is an obstruction mechanism from Phaladeepika. When a planet is transiting a favorable house, a Vedha point (another planet in a specific house) can block the good results.

**Example:** Jupiter transiting the 2nd house from Moon is favorable for wealth, but if any planet is in the 12th house, it creates Vedha and neutralizes the benefit.

### Double Transit Theory

**What it is:** A predictive technique where both Jupiter and Saturn must simultaneously aspect (by transit) a house or its lord for the house's significations to manifest. Developed from classical Parashari principles.

**Application:** Used in the Domain Synthesis engine to determine which life areas are currently "activated" by transit support.

### BAV-Based Transit Quality

Transiting planets through signs with high SAV (Sarvashtakavarga) scores produce better results. A planet transiting a sign where it has 4+ BAV points is in a strong transit; 0-1 BAV points indicate a weak transit.

### Kakshya Sub-Transit Timing

**What it is:** Each sign is divided into 8 Kakshyas (segments of 3.75 degrees), each ruled by one of the 8 contributors to Ashtakavarga. The quality of a transit shifts as the planet moves through different Kakshyas within a sign.

### Sade Sati Analysis

**What it is:** The 7.5-year period when Saturn transits through the 12th, 1st, and 2nd houses from the natal Moon. Considered one of the most significant transit periods.

**Implementation:** `src/lib/kundali/sade-sati-analysis.ts`

Detects current Sade Sati phase (rising = 12th house, peak = 1st house, setting = 2nd house), small panoti (Saturn in 4th or 8th from Moon), and provides severity ratings based on Saturn's dignity and aspects.

---

## Part 8: Specialized Systems

### Varshaphal / Tajika (Solar Return)

**What it is:** The annual horoscope cast for the exact moment the Sun returns to its natal sidereal longitude each year. It is the Vedic equivalent of a "solar return" chart, but uses the Tajika (Persianate) yoga and aspect system rather than standard Parashari rules.

**Classical authority:** Tajika Neelakanthi, Varsha Phala Deepika.

**Implementation:** `src/lib/varshaphal/`

| Module | Purpose |
|---|---|
| `index.ts` | Orchestrator: `generateVarshaphal(birthData, year)` |
| `solar-return.ts` | Binary search for the exact JD when Sun returns to natal longitude |
| `muntha.ts` | Progressed sign (natal Ascendant + age, counted through signs) |
| `varsheshvara.ts` | Year Lord determination from solar return weekday |
| `sahams.ts` | Arabic Parts (Punya, Vidya, Yasas, etc.) calculated from Asc+planet-planet formulas, with day/night formula reversal |
| `tajika-aspects.ts` | 16 Tajika Yogas (Ikbala, Induvara, Ithasala, Ishrafa, Nakta, Yamaya, etc.) based on applying/separating aspects |
| `mudda-dasha.ts` | Compressed dasha for one year (proportional to Vimshottari, 365.25 days total) |

**Solar return finder algorithm:** Iterative Newton-Raphson approach: start from approximate anniversary date, compute current Sun longitude, compare with target, adjust JD by `(target - current) / Sun's daily motion`, repeat until convergence within 0.001 degrees.

### KP System (Krishnamurti Paddhati)

**What it is:** A modern predictive system developed by Prof. K.S. Krishnamurti that uses Placidus houses, sub-lord theory, and Vimshottari dasha proportional subdivision of nakshatras. It is particularly popular for horary (Prashna) questions with precise timing.

**Implementation:** `src/lib/kp/`

| Module | Purpose |
|---|---|
| `sub-lords.ts` | Pre-computed sub-lord boundary table: 27 nakshatras x 9 star-lords x 9 sub-lords = 2,187 entries spanning 360 degrees |
| `placidus.ts` | Placidus house cusp calculation |
| `significators.ts` | KP significator chain: planet -> star-lord -> sub-lord -> house significations |
| `ruling-planets.ts` | Current ruling planets (Ascendant sign lord, star lord, sub lord + Moon equivalents + day lord) for validating predictions |
| `kp-chart.ts` | KP chart generator integrating all modules |

**Sub-lord table construction:**

```
For each of 27 nakshatras (13.333 degrees each):
  For each of 9 star-lord portions (proportional to dasha years):
    For each of 9 sub-lord portions (same proportional split):
      Record: start degree, end degree, sign lord, star lord, sub lord, sub-sub lord
```

The sub-lord of a house cusp is the definitive significator in KP. "The sub-lord decides whether a planet will give the results of its star-lord or not."

### Prashna (Horary Astrology)

**What it is:** Answering specific questions by casting a chart for the moment the question is asked, rather than using the birth chart.

**Implementation:** `src/lib/prashna/`

**Ashtamangala Prashna (Kerala tradition):**

| Module | Purpose |
|---|---|
| `ashtamangala.ts` | Core engine: 8 sacred objects (Mirror, Vessel, Fish, Lamp, Throne, Bull, Flag, Fan), number-to-object mapping, Aruda house calculation |
| `prashna-yogas.ts` | Special yogas active in the question chart |
| `interpretation.ts` | Question-category-specific interpretations |
| `question-categories.ts` | Supported question types |

The querent provides a number (1-108), which maps to one of the 8 Ashtamangala objects. The object's planetary ruler, combined with the current sky chart, determines the answer.

**Pancha Pakshi:** `src/lib/prashna/pancha-pakshi.ts` --- A Kerala-specific system using 5 birds (Vulture, Owl, Crow, Cock, Peacock) assigned by birth nakshatra, with activity cycles (eating, walking, ruling, sleeping, dying) rotating through the day.

### Muhurta (Electional Astrology)

**What it is:** Selecting auspicious times for specific activities. Rather than reading an existing chart, Muhurta works forward --- scanning future time windows and scoring them.

**Implementation:** `src/lib/muhurta/`

| Module | Purpose |
|---|---|
| `time-window-scanner.ts` | Scans date ranges, scores each window |
| `ai-recommender.ts` | Panchanga scoring, transit scoring, timing scoring |
| `activity-rules-extended.ts` | 20 activity types with specific auspiciousness rules |
| `personal-compatibility.ts` | Personalizes scores using birth nakshatra (Tara Bala) and birth rashi (Chandra Bala) |

**20 supported activities:** Marriage, Griha Pravesh, Vehicle Purchase, Business Start, Travel, Medical Procedure, Education, Job Joining, Property Purchase, Naming Ceremony, Annaprashan, Upanayana, Engagement, Mundan, Gold Purchase, Loan, Court Case, Surgery, Temple Visit, Puja.

**Scoring factors:**

1. **Panchanga factors:** Tithi suitability, Nakshatra suitability, Yoga suitability, Karana suitability, Vara (weekday) suitability.
2. **Transit factors:** Current planetary positions relative to the activity's karaka (significator) planet.
3. **Timing factors:** Rahu Kaal avoidance, Gulika Kaal avoidance, Abhijit Muhurta bonus.
4. **Personal factors (if birth data provided):** Tara Bala (nakshatra harmony: taras 3, 5, 7 are inauspicious), Chandra Bala (Moon sign position: houses 1, 3, 6, 7, 10, 11 are favorable).

---

## Part 9: Interpretation and Narrative

### Tippanni Engine (Master Synthesis)

**What it is:** Tippanni (literally "commentary") is the master interpretation engine that transforms raw chart data into human-readable insights. It synthesizes planet placements, yogas, doshas, dashas, and life-area analyses into a structured narrative.

**Implementation:** `src/lib/kundali/tippanni-engine.ts` --- `generateTippanni(kundali, locale)` is the entry point.

**Output structure (TippanniContent):**

| Section | Content |
|---|---|
| Year Predictions | Sade Sati status, Jupiter transit, Rahu-Ketu axis, dasha transitions, quarterly outlook |
| Personality | Lagna-based core identity, Moon sign emotional nature, key planet influences |
| Planet Insights | Each planet's house placement, sign placement, dignity, and interpretation |
| Yoga Insights | Present yogas with formation rules and life impact descriptions |
| Dosha Insights | Active doshas with severity, cancellations, and remedial suggestions |
| Life Areas | Career, Wealth, Marriage, Health, Education --- each analyzed from relevant houses and lords |
| Dasha Insight | Current Maha/Antar dasha lords, their natal positions, and expected effects |
| Strength | Shadbala-based planet ranking |
| Remedies | Gemstones, mantras, charities, and lifestyle recommendations for weak planets |

**Enhanced modules called by tippanni-engine:**

- `planet-in-sign.ts` --- Sign-specific planet expressions
- `planet-in-house-enhanced.ts` --- House-specific planet effects with dignity modifiers
- `aspects.ts` --- Full aspect analysis (Parashari + Jaimini Rashi Drishti)
- `yogas-extended.ts` --- Additional yoga patterns not in yogas-complete
- `doshas-extended.ts` --- Extended dosha analysis
- `dasha-effects-enhanced.ts` --- Dasha lord analysis with Antar Dasha interactions
- `remedies-enhanced.ts` --- Targeted remedies based on weakness patterns
- `life-areas-enhanced.ts` --- Career, wealth, marriage, health, education deep analysis
- `year-predictions.ts` --- Transit-based annual forecast

### Domain Synthesis ("Personal Pandit")

**What it is:** A second-generation interpretation system that produces a structured "Personal Reading" organized by life domains (career, relationships, health, wealth, spirituality, education). Each domain gets a natal promise score, current activation score, timeline, and remedies.

**Implementation:** `src/lib/kundali/domain-synthesis/`

| Module | Purpose |
|---|---|
| `synthesizer.ts` | Main orchestrator: `synthesizeReading(kundali)` |
| `config.ts` | Domain definitions (karaka houses, karaka planets, relevant yogas) |
| `scorer.ts` | Computes domain scores from house lord dignity, occupants, aspects, BAV |
| `narrator.ts` | Generates narrative text for each scoring factor |
| `timeline.ts` | Projects domain activation across dasha periods |
| `remedies.ts` | Domain-specific remedy selection |
| `current-period.ts` | Current dasha + transit activation analysis |
| `life-overview.ts` | Cross-domain life narrative |
| `cross-domain.ts` | Detects links between domains (e.g., career wealth flowing from 10th-2nd lord connection) |
| `transit-activation.ts` | Current planetary transits overlaid on domain houses |
| `daily-insights.ts` | Daily personalized transit insights |
| `key-dates.ts` | Upcoming significant transit dates |
| `narrator-v2.ts` | Enhanced narrative with emotional/motivational tone |
| `trajectory.ts` | Long-term life trajectory analysis |

### VedicProfile (Pattern-Based Narrative)

**What it is:** A lighter-weight profile generator that detects chart patterns (stelliums, Kala Sarpa, Raja Yogas, Mahapurusha, dignified Lagna lord, etc.) and assembles a readable narrative using template strings.

**Implementation:** `src/lib/kundali/vedic-profile.ts`

Detects 11 pattern types:
- `stellium` --- 3+ planets in one house
- `kaalSarpa` --- All planets between Rahu-Ketu
- `rajaYoga` --- Kendra-Trikona lord combination
- `mahapurusha` --- Classical Mahapurusha yoga
- `dignifiedLagnaLord` --- Lagna lord exalted or in own sign
- `debilitatedKey` --- Key planet debilitated
- `sameLagnaMoon` --- Lagna and Moon in same sign
- `contrastingElements` --- Fire/Water or Earth/Air dominant
- `sadeSati` --- Currently under Saturn's 7.5-year transit
- `lunarYoga` --- Moon-based yoga active
- `retrogradeKendra` --- Retrograde planet in angular house

Uses template strings from `vedic-profile-templates.ts` for the narrative hook, core identity description, and standout observations.

### Varga Deep Analysis

**What it is:** Cross-correlates the D1 (Rasi) chart with any divisional chart using a 15-factor analysis. Each factor is independently testable.

**Implementation:** `src/lib/tippanni/varga-deep-analysis.ts`

Factors include: dignity shift (planet changes from exalted in D1 to debilitated in Dx or vice versa), Pushkara Navamsha/Bhaga checks, Gandanta detection, Varga Visesha (special dignities), dispositor chain analysis, and Parivartana (mutual exchange) detection.

### Varga Promise/Delivery Scoring

**What it is:** The D1 chart shows "promise" (what life has in store); divisional charts show "delivery" (how well the promise manifests). A 4x4 matrix of promise vs. delivery tiers yields 16 distinct verdicts.

**Implementation:** `src/lib/tippanni/varga-promise-delivery.ts`

Promise score inputs: benefic/malefic occupants, lord position (Kendra/Trikona/Dusthana), lord dignity, aspects, karaka Shadbala, SAV score. Delivery score adds: yoga count, Vargottama count, Pushkara count, Gandanta count.

---

## Part 10: Upagrahas

### Overview

**What upagrahas are:** Sub-planetary points calculated from the positions of the Sun and other bodies. They are not physical objects but mathematically derived sensitive points used in chart interpretation.

### 5 Sun-derived Upagrahas

**Implementation:** Within `src/lib/ephem/kundali-calc.ts` (upagraha calculation section)

| Upagraha | Formula | Significance |
|---|---|---|
| **Dhuma** | Sun + 133 degrees 20 min | Inauspicious point, indicates smoke/obstacles |
| **Vyatipata** | 360 - Dhuma | Extremely inauspicious, indicates calamity |
| **Parivesha** | Vyatipata + 180 | Halo of the Sun, related to dignity |
| **Chapa** (Indrachapa) | 360 - Parivesha | Bow of Indra |
| **Upaketu** | Chapa + 16 deg 40 min | Minor Ketu-like point |

### Gulika/Mandi

**What it is:** The most important upagraha. Gulika is the ascendant degree at the start of Saturn's segment in the planetary hour scheme. Mandi is often treated as synonymous, though some texts distinguish them.

**Day formula:** Divide the day duration (sunrise to sunset) into 8 equal parts. Saturn rules the segment corresponding to the weekday (Sunday=8th/none, Monday=7th, Tuesday=6th, etc.). The ascendant at the start of Saturn's segment is Gulika.

**Night formula:** Same principle applied to the night duration (sunset to next sunrise) with a different segment ordering.

---

## Part 11: Calendar and Panchang

### Daily Panchang Computation

**What it is:** The Panchang ("five limbs") is the Vedic almanac listing 5 fundamental daily elements plus 20+ derived timing elements. It is the foundation of Hindu timekeeping and auspiciousness assessment.

**Implementation:** `src/lib/ephem/panchang-calc.ts` --- `calculatePanchang(input)` is the main function.

**The 5 Angas (limbs):**

| Anga | What it is | How computed |
|---|---|---|
| **Tithi** | Lunar day (1-30) | Angular separation of Moon from Sun, divided by 12 degrees. Each 12 degrees = one tithi. |
| **Nakshatra** | Lunar mansion (1-27) | Moon's sidereal longitude divided by 13.333 degrees. |
| **Yoga** | Sun-Moon combination (1-27) | Sum of Sun and Moon sidereal longitudes, divided by 13.333 degrees. |
| **Karana** | Half-tithi (1-11) | Half of a tithi. 11 named karanas cycling through 60 half-tithis per month. |
| **Vara** | Weekday (1-7) | Standard astronomical day of week. |

**Derived elements computed:**

- Transition times (exact start/end) for tithi, nakshatra, yoga, karana --- found via binary search (30 iterations = sub-second precision)
- Rahu Kaal, Yamagandam, Gulika Kaal (inauspicious time windows)
- Choghadiya (8 x 1.5-hour quality slots per day/night)
- Hora (24 planetary hour slots)
- Disha Shool (directional restriction based on weekday)
- Abhijit Muhurta (the most auspicious 48-minute window around solar noon)
- 30 named Muhurtas of the day
- Varjyam and Amrit Kalam windows (from nakshatra ghati offsets)
- Masa (lunar month), Ritu (season), Ayana (solstice half), Samvatsara (60-year cycle)

**Transition detection algorithm:** For each element, scan forward from sunrise in 30-minute steps until the value changes, then binary search between the last matching and first non-matching JDs for 30 iterations.

### Kshaya and Vriddhi Tithi Detection

**What it is:** A Kshaya tithi is one that begins and ends between two consecutive sunrises (no sunrise falls within it). A Vriddhi tithi spans more than one sunrise (two sunrises fall within it). Both are rare and ritually significant.

**Implementation:** `src/lib/calendar/tithi-table.ts` --- the `isKshaya` and `isVriddhi` flags on each `TithiEntry`.

**Detection:** Compare `sunriseDate` counts. If a tithi entry has 0 sunrises within its span (it is entirely contained between two adjacent sunrises), it is Kshaya. If it spans 2+ sunrises, it is Vriddhi.

**Verification:** Kshaya/Vriddhi dates cross-verified against Drik Panchang for the same location.

### Festival Engine

**What it is:** A declarative rules-based system that determines festival/vrat dates from the pre-computed tithi table.

**Implementation:**
- `src/lib/calendar/festival-defs.ts` --- Declarative definitions: each festival is a `{ masa, paksha, tithi }` tuple (e.g., Diwali = Kartika/Krishna/Amavasya)
- `src/lib/calendar/festival-generator.ts` --- V2 generator that looks up matching tithis from the yearly table

**Dwi-tithi rule:** When a tithi spans two days (two sunrises), which day gets the festival? Classical rule: Ekadashi and vrats go to the second day; all others go to the first day.

### Tithi Table

**What it is:** A pre-computed table of all approximately 370 tithi transitions for an entire year, storing precise start/end JDs, local times, dual masa assignment (Amanta and Purnimanta), Kshaya/Vriddhi flags, and sunrise dates.

**Implementation:** `src/lib/calendar/tithi-table.ts`

**Algorithm:** Coarse scan (stepping by approximately 0.4 JD) to find approximate tithi boundaries, followed by binary search for exact transition JDs. Each entry includes both Amanta (Amavasya-to-Amavasya month boundaries) and Purnimanta (Purnima-to-Purnima) month names.

### Eclipse Computation

**What it is:** Computes local eclipse circumstances (contact times, magnitude, visibility, duration) from pre-tabulated eclipse data, plus Sutak (ritual impurity period) timing per 3 classical traditions.

**Implementation:** `src/lib/calendar/eclipse-compute.ts`

**Lunar eclipses:** Contact times are universal (same for all observers). Converted from UTC to local time and checked against Moon altitude.

**Solar eclipses:** Greatest-eclipse parameters plus simplified geometric model for local contact time approximation. Magnitude varies by location.

**Sutak traditions:**
- Nirnaya Sindhu: Fixed 12 hours before solar eclipse, 9 hours before lunar
- Dharma Sindhu: Variable prahar-based calculation
- Muhurta Chintamani: From previous sunrise

---

## Part 12: Data Constants

### Overview

All astronomical and astrological constants are defined in `src/lib/constants/` as TypeScript objects with the `Trilingual` type: `{ en: string; hi: string; sa: string }` (English, Hindi, Sanskrit).

### Constant Files

| File | Contents | Count |
|---|---|---|
| `nakshatras.ts` | 27 nakshatras with name, deity, ruler, symbol, pada details | 27 entries |
| `nakshatra-details.ts` | Extended nakshatra data: qualities, characteristics, syllables | 27 entries |
| `nakshatra-syllables.ts` | First syllable by pada for baby naming | 108 entries (27x4) |
| `rashis.ts` | 12 rashis with name, lord, element, quality, symbol | 12 entries |
| `rashi-details.ts` | Extended rashi characteristics | 12 entries |
| `rashi-compatibility.ts` | Inter-rashi compatibility scores | 144 pairs |
| `grahas.ts` | 9 grahas with name, nature, element, exaltation, debilitation, friends, enemies + Vara data | 9 entries + 7 weekdays |
| `tithis.ts` | 30 tithis with name, paksha, deity, nature | 30 entries |
| `yogas.ts` | 27 yogas with name, nature, meaning | 27 entries |
| `karanas.ts` | 11 karanas (7 recurring + 4 fixed) with name, nature | 11 entries |
| `muhurtas.ts` | 30 named muhurtas of the day with deity and nature | 30 entries |
| `muhurta-types.ts` | Activity-specific muhurta rules | 20 activities |
| `festival-details.ts` | Festival detail entries with descriptions and traditions | 21+ entries |
| `cities.ts` | Major cities with coordinates for quick location selection | Multiple entries |
| `nakshatra-activities.ts` | Recommended/avoided activities per nakshatra | 27 entries |

### Verification

201 data points cross-verified against three sources:
- **Drik Panchang** (now Prokerala/Shubh): tithi times, nakshatra transitions, festival dates
- **BPHS (Brihat Parashara Hora Shastra):** Planetary dignities, friendship tables, dasha periods, house significations, Ashtakavarga rules
- **Muhurta Chintamani:** Muhurta classifications, Vashya groups, Yoni assignments

### ID Conventions

- **Rashi IDs:** 1-based (1=Aries through 12=Pisces)
- **Planet IDs:** 0-based (0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn, 7=Rahu, 8=Ketu)
- **Nakshatra IDs:** 1-based (1=Ashwini through 27=Revati)
- **Tithi numbers:** 1-30 (1-15=Shukla, 16-30=Krishna)

---

## Part 13: Quality Assurance

### Test Suite

**Framework:** Vitest

**Scope:** 103 test files across the `src/lib/` directory, with 24,561 total lines of test code.

**Key test areas:**

| Area | Test File(s) | What is Verified |
|---|---|---|
| Kundali subcalculations | `kundali/__tests__/kundali-subcalcs.test.ts` | Ascendant, house placement, dignity detection, dasha balance |
| Kundali integration | `kundali/__tests__/kundali.test.ts` | Full chart generation end-to-end |
| Ashtakavarga Shodhana | `kundali/__tests__/ashtakavarga-shodhana.test.ts` | Trikona, Ekadhipatya reductions, Pinda computation |
| Ashtakavarga Dasha | `kundali/__tests__/ashtakavarga-dasha.test.ts` | BAV-to-prediction classification |
| Dasha Sandhi | `kundali/__tests__/dasha-sandhi.test.ts` | Transition intensity detection |
| Mangal Dosha | `kundali/__tests__/mangal-dosha-engine.test.ts` | All 8 cancellation rules, severity computation |
| Rashi Drishti | `kundali/__tests__/rashi-drishti.test.ts` | Jaimini aspect correctness |
| Shadbala | `kundali/shadbala.test.ts` | Component calculations against known values |
| Yogas | `kundali/yogas-complete.test.ts` | Detection accuracy for 150+ yogas |
| Functional Nature | `kundali/functional-nature.test.ts` | Benefic/malefic classification by Lagna |
| Panchang | `ephem/__tests__/panchang-calc.test.ts` | Tithi, nakshatra, yoga accuracy vs. reference |
| Astronomical | `ephem/__tests__/astronomical.test.ts` | Sun/Moon longitude, JD conversion, ayanamsha |
| Coordinates | `ephem/coordinates.test.ts` | Ecliptic latitude, combustion detection |
| Divisional charts | `ephem/__tests__/divisional-charts.test.ts` | Varga sign computation for all supported divisions |
| Kundali validation | `ephem/__tests__/kundali-validation.test.ts` | Known charts compared against published references |
| Convergence engine | `tippanni/convergence/__tests__/*.test.ts` | Scoring, evaluation, utility functions |
| Sade Sati | `kundali/sade-sati-analysis.test.ts` | Phase detection, Saturn position classification |

### 4-Round Audit Methodology

The codebase underwent a 4-round systematic audit:

1. **Round 1: Algorithm correctness** --- Every formula compared against the classical text source (BPHS, Phaladeepika, Muhurta Chintamani). 18 bugs found (incorrect Tara formula, missing ENEMIES table in Vimshopaka, wrong Ghati Lagna rate, etc.).

2. **Round 2: Edge cases** --- Boundary conditions tested: 0/360 degree wraparound, midnight births, polar latitudes, historical dates, Kshaya tithi detection. 11 bugs found.

3. **Round 3: Integration** --- End-to-end flows tested: birth form submission -> chart generation -> interpretation display. Data flow between modules verified. 7 bugs found (Vargottama detection using house offset instead of absolute sign, D9 ascendant ignored in mapping).

4. **Round 4: Cross-validation** --- Results compared against Prokerala and Shubh Panchang for 3 reference locations (Bern Switzerland, Delhi India, Seattle USA) across multiple dates. Tithi times within 0-1 minutes. Nakshatra transitions within 1-2 minutes. 5 bugs found.

**Total: 41 bugs found and fixed across 4 audit rounds.**

### Continuous Verification Gates

Every code change must pass all 4 gates before being considered complete:

```bash
# Gate 1: Type checking
npx tsc --noEmit -p tsconfig.build-check.json

# Gate 2: Test suite
npx vitest run

# Gate 3: Production build
npx next build

# Gate 4: Browser verification (manual)
# Click every button, fill every form, watch the UI respond
```

The pre-push git hook runs Gate 1 automatically. Gates 2-3 are enforced by convention. Gate 4 is required for any UI-touching change.

### Cross-Validation Reference Points

**Panchang accuracy targets:**
- Tithi start/end times: within 2 minutes of Prokerala/Shubh Panchang
- Nakshatra transitions: within 2 minutes
- Yoga transitions: within 2 minutes
- Sunrise/sunset: within 1 minute (Swiss Eph path), within 3 minutes (Meeus path)

**Kundali accuracy:**
- Planet longitudes: within 0.001 degrees (Swiss Eph), within 0.01 degrees Sun / 0.5 degrees Moon (Meeus)
- Ascendant: within 0.01 degrees (validated against known chart examples)
- Divisional chart signs: verified for all supported divisions against published D-chart tables

**Test locations used:**
- Corseaux, Switzerland (46.46N, 6.78E, Europe/Zurich) --- CET/CEST DST transitions
- Delhi, India (28.61N, 77.21E, Asia/Kolkata) --- IST, no DST
- Seattle, USA (47.61N, -122.33W, America/Los_Angeles) --- PST/PDT DST transitions

---

## Appendix A: File Index

### Core Astronomical Layer

| File | Lines | Purpose |
|---|---|---|
| `src/lib/ephem/swiss-ephemeris.ts` | 277 | Swiss Ephemeris integration, memoization |
| `src/lib/ephem/astronomical.ts` | ~500 | Meeus algorithms, unified API facade |
| `src/lib/ephem/coordinates.ts` | ~200 | Ecliptic latitude, equatorial transforms, combustion |
| `src/lib/ephem/kundali-calc.ts` | ~800 | Master kundali generator |
| `src/lib/ephem/panchang-calc.ts` | ~600 | Daily panchang computation |
| `src/lib/astronomy/ayanamsa.ts` | 46 | Meeus-based ayanamsha (3 systems) |
| `src/lib/astronomy/sunrise.ts` | ~150 | 2-pass Meeus sunrise/sunset |
| `src/lib/astronomy/julian.ts` | ~60 | Julian Day utilities |
| `src/lib/astronomy/solar.ts` | ~100 | Solar position, equation of time |
| `src/lib/astronomy/lunar.ts` | ~100 | Lunar position calculations |
| `src/lib/astronomy/planets.ts` | ~200 | Outer planet positions (Meeus) |

### Kundali Analysis Modules

| File | Lines | Purpose |
|---|---|---|
| `src/lib/kundali/shadbala.ts` | 759 | Full 6-fold strength with sub-breakdowns |
| `src/lib/kundali/bhavabala.ts` | ~200 | House strength computation |
| `src/lib/kundali/vimshopaka.ts` | 130 | 16-chart dignity scoring |
| `src/lib/kundali/yogas-complete.ts` | 2,410 | 150+ yoga detection (26 functions) |
| `src/lib/kundali/yogas.ts` | ~300 | Simplified yoga detection |
| `src/lib/kundali/mangal-dosha-engine.ts` | 292 | Mangal Dosha with 8 cancellation rules |
| `src/lib/kundali/dasha.ts` | ~150 | Vimshottari Dasha standalone |
| `src/lib/kundali/additional-dashas.ts` | 695 | 20+ alternative dasha systems |
| `src/lib/kundali/ashtottari-dasha.ts` | ~150 | Ashtottari 108-year dasha |
| `src/lib/kundali/yogini-dasha.ts` | ~150 | Yogini 36-year dasha |
| `src/lib/kundali/dasha-sandhi.ts` | ~100 | Dasha transition analysis |
| `src/lib/kundali/ashtakavarga-shodhana.ts` | ~200 | BAV reductions (Trikona + Ekadhipatya + Pinda) |
| `src/lib/kundali/ashtakavarga-dasha.ts` | ~100 | BAV-based dasha quality prediction |
| `src/lib/kundali/house-systems.ts` | ~80 | Whole Sign, Sripati, Equal, Placidus |
| `src/lib/kundali/sphutas.ts` | ~150 | Sensitive points (Prana, Deha, Mrityu, Yogi, Avayogi) |
| `src/lib/kundali/special-lagnas.ts` | ~120 | Hora, Ghati, Sree, Indu, Pranapada, Varnada Lagnas |
| `src/lib/kundali/avasthas.ts` | ~200 | 5 planetary state systems |
| `src/lib/kundali/argala.ts` | ~150 | Jaimini Argala (intervention) system |
| `src/lib/kundali/graha-yuddha.ts` | ~100 | Planetary war detection |
| `src/lib/kundali/functional-nature.ts` | ~100 | Lagna-specific benefic/malefic classification |
| `src/lib/kundali/rashi-drishti.ts` | ~80 | Jaimini sign-based aspects |
| `src/lib/kundali/nadi-amsha.ts` | ~100 | D-150 Nadi Amsha chart |
| `src/lib/kundali/sade-sati-analysis.ts` | ~150 | Saturn 7.5-year transit analysis |
| `src/lib/kundali/sudarshana.ts` | ~100 | Sudarshana Chakra (3-chart overlay) |
| `src/lib/kundali/chakra-systems.ts` | ~150 | Additional chakra computations |
| `src/lib/kundali/tithi-pravesha.ts` | ~150 | Tithi Pravesha (birthday tithi return) |
| `src/lib/kundali/vedic-profile.ts` | ~300 | Pattern detection and narrative generation |
| `src/lib/kundali/vedic-profile-templates.ts` | ~200 | Template strings for profile narratives |

### Interpretation Layer

| File | Purpose |
|---|---|
| `src/lib/kundali/tippanni-engine.ts` | Master synthesis orchestrator |
| `src/lib/kundali/tippanni-lagna.ts` | Lagna-specific deep interpretations |
| `src/lib/kundali/tippanni-planets.ts` | Planet-in-house depth, dignity effects, dasha effects |
| `src/lib/kundali/tippanni-types.ts` | TypeScript interfaces for tippanni output |
| `src/lib/tippanni/planet-in-sign.ts` | Planet expression by sign |
| `src/lib/tippanni/planet-in-house-enhanced.ts` | Enhanced house placement analysis |
| `src/lib/tippanni/aspects.ts` | Full aspect computation |
| `src/lib/tippanni/yogas-extended.ts` | Additional yoga patterns |
| `src/lib/tippanni/doshas-extended.ts` | Extended dosha analysis |
| `src/lib/tippanni/dasha-effects-enhanced.ts` | Dasha lord + Antar interactions |
| `src/lib/tippanni/dasha-synthesis.ts` | Dasha period narrative synthesis |
| `src/lib/tippanni/dasha-prognosis.ts` | Forward-looking dasha predictions |
| `src/lib/tippanni/remedies-enhanced.ts` | Targeted remedy recommendations |
| `src/lib/tippanni/life-areas-enhanced.ts` | 5 life areas: career, wealth, marriage, health, education |
| `src/lib/tippanni/year-predictions.ts` | Annual predictions from transits |
| `src/lib/tippanni/varga-deep-analysis.ts` | 15-factor cross-chart correlation |
| `src/lib/tippanni/varga-promise-delivery.ts` | Promise vs. delivery scoring |
| `src/lib/tippanni/varga-narrative.ts` | Varga analysis narrative output |
| `src/lib/tippanni/varga-tippanni.ts` | Varga-specific tippanni generation |
| `src/lib/tippanni/dignity.ts` | Dignity classification utilities |
| `src/lib/tippanni/convergence/engine.ts` | Multi-source convergence analysis |
| `src/lib/tippanni/convergence/scoring.ts` | Convergence scoring model |

### Domain Synthesis

| File | Purpose |
|---|---|
| `src/lib/kundali/domain-synthesis/synthesizer.ts` | Main orchestrator |
| `src/lib/kundali/domain-synthesis/config.ts` | Domain definitions |
| `src/lib/kundali/domain-synthesis/scorer.ts` | Domain scoring |
| `src/lib/kundali/domain-synthesis/narrator.ts` | Narrative generation |
| `src/lib/kundali/domain-synthesis/timeline.ts` | Domain activation timeline |
| `src/lib/kundali/domain-synthesis/remedies.ts` | Domain-specific remedies |
| `src/lib/kundali/domain-synthesis/cross-domain.ts` | Inter-domain links |
| `src/lib/kundali/domain-synthesis/transit-activation.ts` | Current transit overlay |
| `src/lib/kundali/domain-synthesis/daily-insights.ts` | Daily personalized insights |
| `src/lib/kundali/domain-synthesis/trajectory.ts` | Life trajectory projection |

### Specialized Systems

| Directory | Purpose |
|---|---|
| `src/lib/varshaphal/` | Solar return (Tajika) system (7 modules) |
| `src/lib/kp/` | KP System (5 modules) |
| `src/lib/prashna/` | Horary astrology (6 modules) |
| `src/lib/muhurta/` | Electional astrology (4 modules) |
| `src/lib/matching/` | Compatibility matching (4 modules) |
| `src/lib/calendar/` | Festival engine, tithi table, eclipses, transits (10 modules) |
| `src/lib/personalization/` | Transit alerts, personal panchang, remedies (8 modules) |
| `src/lib/jaimini/` | Jaimini system calculations |
| `src/lib/chakra/` | Sarvatobhadra Chakra |
| `src/lib/forecast/` | Annual/monthly forecast engines |

---

## Appendix B: Known Limitations

1. **Meeus outer planet accuracy:** Mars can be off by up to 22 degrees via Meeus. Always prefer Swiss Ephemeris path for chart generation. Meeus is only acceptable for Sun and Moon in browser-side approximations.

2. **Mean node vs. true node:** We use mean node for Rahu/Ketu. Some practitioners prefer true node. This is a design choice, not a bug.

3. **D150 sensitivity:** Nadi Amsha (D-150) requires birth time accurate to within 2 minutes. Most birth times are recorded to 5-15 minute precision, making D-150 unreliable for most users. A birth time accuracy warning should be displayed.

4. **House system limitation:** Placidus houses are only available when Swiss Ephemeris is loaded (server-side). Client-side KP chart generation is not supported.

5. **Eclipse local circumstances:** Solar eclipse local contact times use a simplified geometric model, not full Besselian elements. Magnitude estimates for locations far from the central path may have errors of up to 0.1 magnitude.

6. **Tajika Yogas:** The 16 Tajika yogas use applying/separating aspect theory with standard orbs. Some texts specify different orb tolerances; our implementation uses a consistent 12-degree orb for all aspects.

7. **Conditional Dashas:** Some nakshatra-based dashas (Ashtottari, Shodashottari, etc.) are classically only applicable when specific conditions are met (e.g., Ashtottari only when Rahu is in a kendra). We compute all systems unconditionally and note the applicability condition in the UI.

8. **Sutak computation:** Three different traditions give three different Sutak start times. We display all three and recommend the most conservative (earliest).

---

## Appendix C: Classical Text References

| Text | Abbreviation | Chapters Referenced |
|---|---|---|
| Brihat Parashara Hora Shastra | BPHS | Ch.3 (friendships), Ch.4-5 (special lagnas), Ch.6-7 (vargas), Ch.10 (sphutas), Ch.16 (vimshopaka), Ch.17 (vimshottari), Ch.19-21 (rasi dashas), Ch.27-28 (shadbala), Ch.31 (argala), Ch.44-45 (avasthas), Ch.66-69 (ashtakavarga) |
| Phaladeepika | PD | Ch.8 (sphutas), Ch.15 (avasthas), Transit Vedha tables |
| Jaimini Sutras | JS | Rashi drishti, Narayana Dasha, Argala, Chara Karakas |
| Muhurta Chintamani | MC | Muhurta classification, Vashya groups, Yoni table, Tara rules |
| Tajika Neelakanthi | TN | 16 Tajika Yogas, Sahams, Muntha |
| Surya Siddhanta | SS | Sunrise definition, astronomical day boundaries |
| Saravali | SAR | Ch.5 (Avasthas), planetary combinations |
| Varsha Phala Deepika | VPD | Solar return methodology |

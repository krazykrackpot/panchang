# Jyotish Implementation Audit Report
**Date:** 2026-04-22  
**Auditor:** Senior Astronomy/Jyotish Engineer  
**Scope:** Complete codebase — astronomical engine, panchang, kundali, dashas, yogas, matching, muhurta, KP, varshaphal, prashna, calendar, constants  
**References:** BPHS (Brihat Parashara Hora Shastra), Surya Siddhanta, Muhurta Chintamani, Brihat Samhita, Dharmasindhu, Kalaprakashika, Phaladeepika, Saravali, Jataka Parijata, Tajika Neelakanthi, Prasna Marga, Meeus "Astronomical Algorithms"

---

## Executive Summary

This is an **impressively comprehensive** Vedic astrology engine — 25+ dasha systems, 150+ yogas, complete Shadbala, 17+ divisional charts, Ashtakavarga, Jaimini subsystems, KP system, Varshaphal/Tajika, Prashna, and a robust panchang engine with Swiss Ephemeris integration. The core constants (exaltation degrees, dasha periods, nakshatra lords, friendship tables) are verified correct against BPHS. The codebase shows active quality improvement with documented historical bug fixes.

However, the audit uncovered **7 confirmed bugs**, **12 significant implementation gaps**, **6 data errors**, and **15+ enhancement opportunities** that would bring this to parity with professional Jyotish software (Jagannatha Hora, Parashara's Light, Astrosage).

---

## PART 1: CONFIRMED BUGS (Must Fix)

### BUG-1: Karana Mapping Error for Last 3 Fixed Karanas
**File:** `src/lib/ephem/astronomical.ts` (line ~304-307)  
**Also:** `src/lib/panchang/calculator.ts`  
**Severity:** HIGH — affects daily panchang display

The code maps karana index 57 to `KARANAS[8]` (Chatushpada), but the classical sequence is:
- Index 57 = **Shakuni** (should map to KARANAS[7])
- Index 58 = **Chatushpada** (should map to KARANAS[8])
- Index 59 = **Naga** (should map to KARANAS[9])

Current: `[8, 9, 10][karanaIndex - 57]`  
Should be: `[7, 8, 9][karanaIndex - 57]`

This means the first half of Krishna Chaturdashi (index 57) displays Chatushpada instead of Shakuni. The error propagates to all three fixed karanas. Per Surya Siddhanta Ch.2, v.69-70, the sequence is Shakuni → Chatushpada → Naga.

### BUG-2: Yamaganda Period Order Inconsistency
**Files:** `src/lib/ephem/astronomical.ts` vs `src/lib/panchang/calculator.ts`  
**Severity:** MEDIUM — two engines give different inauspicious periods

The `astronomical.ts` uses `[5, 4, 3, 2, 1, 7, 6]` while `panchang-calc.ts` uses `[5, 4, 3, 7, 2, 1, 6]` (citing Dharma Sindhu). These differ for **Wednesday (index 3)**, **Thursday (index 4)**, and **Friday (index 5)**. The `panchang-calc.ts` version with the documented Dharma Sindhu citation is likely correct, but the inconsistency means users could see different Yamaganda times depending on which engine renders the page.

### BUG-3: Ashtottari Dasha Uses Ketu Instead of Rahu
**File:** `src/lib/kundali/additional-dashas.ts` (Ashtottari)  
**Severity:** MEDIUM — affects dasha predictions

BPHS Ashtottari sequence: Sun(6), Moon(15), Mars(8), Mercury(17), **Saturn(10)**, Jupiter(19), **Rahu(12)**, Venus(21) = 108 years.

The code has **Ketu(12) instead of Rahu(12)** and comments "excludes Rahu." Per mainstream BPHS editions and all commercial software (JHora, PL), the excluded planet is **Ketu**, not Rahu. Some marginal traditions swap this, but the mainstream reading is clear.

### BUG-4: Duplicate Astronomy Modules with Inconsistent Constants
**Files:** `src/lib/astronomy/ayanamsa.ts` vs `src/lib/ephem/astronomical.ts`  
**Severity:** MEDIUM — subtle inconsistencies between panchang and kundali pages

Two independent implementations of Lahiri ayanamsha:
- `astronomy/ayanamsa.ts`: `23.853765 + 1.3970294T + 0.0001722T²`
- `ephem/astronomical.ts`: `23.85306 + 1.39722T + 0.00018T² - 0.000005T³`

Difference: ~0.001° at J2000.0, diverging over decades. Similarly, BV Raman ayanamsha constants differ by ~0.08° between the two modules. The panchang page could show a different nakshatra than the kundali page near nakshatra boundaries.

### BUG-5: Graha Maitri Table — Moon-Jupiter Friendship
**File:** `src/lib/matching/ashta-kuta.ts` (line ~183)  
**Severity:** MEDIUM — affects Ashta Kuta matching scores

Moon's friendship table codes Jupiter as `4: 1` (neutral). Per BPHS Ch.3 (Naisargika Maitri): Moon considers Jupiter a **friend**, not neutral. This affects Graha Maitri kuta scores for Cancer-Sagittarius and Cancer-Pisces rashi pairs, potentially under-scoring compatible couples by 1-2 points.

### BUG-6: Meeus Planetary Fallback — No Helio-to-Geo Conversion
**File:** `src/lib/ephem/astronomical.ts` (lines ~420-503)  
**Severity:** HIGH when Swiss Eph unavailable — planets can be in wrong rashi

The `_meeusPlanetaryPositions` function computes mean heliocentric longitudes with simplified equation of center but **does NOT convert to geocentric**. For Mars near opposition, errors can reach **15-20 degrees** — enough to place a planet in the wrong rashi. Code comment itself notes "Mars ~22 degree error." This means **any client-side kundali calculation without Swiss Ephemeris is unreliable for Mars, Mercury, and Venus**.

### BUG-7: Moola Dasha Total = 121 Years (Should Be 120)
**File:** `src/lib/kundali/additional-dashas.ts`  
**Severity:** LOW — Venus gets 21 years instead of 20

Standard Moola Dasha per BPHS matches Vimshottari periods (total 120). The code gives Venus 21 years, making the total 121. While some obscure texts may cite 121, the mainstream reading is 120.

---

## PART 2: DATA ERRORS (Should Fix)

### DATA-1: Vajra Yoga (#15) Nature
**File:** `src/lib/constants/yogas.ts` (line ~18)  
Marked "neutral" but per Brihat Samhita, Vajra is **inauspicious** (ashubha). Should be changed to "inauspicious."

### DATA-2: Karana "Nagava" Should Be "Naga"
**File:** `src/lib/constants/karanas.ts` (line ~13)  
The standard name is "Naga" (नाग), not "Nagava" (नागव). The "-va" suffix is a nominative ending not used in Jyotish terminology.

### DATA-3: Kimstughna Karana Type
**File:** `src/lib/constants/karanas.ts` (line ~14)  
Typed as "sthira" but should be "special" (the interface already defines this type). Kimstughna occurs exactly once per lunar month (first half of Shukla Pratipada), making it uniquely "special" per Surya Siddhanta, distinct from the 3 sthira karanas.

### DATA-4: Uttara Bhadrapada Pada 4 Syllable
**File:** `src/lib/constants/nakshatra-syllables.ts` (line ~198)  
English transliteration "Da" does not match the Devanagari "ञ" (Nya/Gya). Should be "Gna" or "Jna."

### DATA-5: Marriage Muhurta Nakshatra Misclassification
**Files:** `src/lib/muhurta/activity-rules-extended.ts`, `src/lib/calendar/muhurat-calendar.ts`  
Per Muhurta Chintamani, these nakshatras are **auspicious for marriage** but are either in the avoid list or missing:
- **Mrigashira (#5)** — in avoidNakshatras (should be good)
- **Swati (#15)** — in avoidNakshatras (should be good)
- **Anuradha (#17)** — not in good list (should be good)
- **Uttara Bhadrapada (#26)** — in avoidNakshatras (should be good)

### DATA-6: Yoni Kuta Scoring Oversimplification
**File:** `src/lib/matching/ashta-kuta.ts` (lines ~126-170)  
Only three scores: 0 (enemy), 2 (neutral/friendly), 4 (same). Classical texts distinguish "friendly" (3 pts) from "neutral" (2 pts). This collapses scoring for ~40% of pairs.

---

## PART 3: SIGNIFICANT IMPLEMENTATION GAPS

### GAP-1: Ashtakavarga Trikona/Ekadhipatya Shodhana (CRITICAL)
**Source:** BPHS Ch.66-68  
**Impact:** Required for proper transit predictions

The app computes Bhinnashtakavarga and Sarvashtakavarga correctly but is **missing the two reduction methods** (Trikona Shodhana and Ekadhipatya Shodhana) that are essential for predicting events during planetary transits. Without reductions, the BAV scores are raw and unsuitable for timing analysis. Pinda Ashtakavarga (BPHS Ch.69) is also absent.

**What competitors have:** JHora, Parashara's Light, and Astrosage all provide Shodhana-reduced Ashtakavarga with transit overlays.

### GAP-2: Mangal Dosha Cancellation Rules (HIGH)
**Source:** Multiple texts — BPHS, Phaladeepika, various commentaries  
**Impact:** Users see Mangal Dosha without knowing it may be cancelled

Cancellation conditions not implemented:
1. Mars in own sign (Aries/Scorpio) or exalted (Capricorn)
2. Mars aspected by Jupiter
3. Mars in Kendra (1/4/7/10) from Jupiter or Venus
4. Mars in Sagittarius or Pisces in 7th/8th
5. Matching partner also has Mangal Dosha (mutual cancellation)
6. After age 28 (mature Mars)

### GAP-3: Nadi Dosha Cancellation Rules (HIGH)
**Source:** Muhurta Chintamani  
**Impact:** False Nadi Dosha alarms in matching

Cancellations not implemented:
1. Same nakshatra but different rashi
2. Same rashi but different nakshatra
3. Same nakshatra same pada (overrides to positive)

### GAP-4: Partial Aspect Strengths (MEDIUM)
**Source:** BPHS Ch.26  
**Impact:** Affects Drik Bala accuracy in Shadbala

All aspects are treated as full (100%) strength. BPHS prescribes fractional aspects:
- 3rd/10th house: 1/4 strength (except Saturn = full)
- 4th/8th house: 3/4 strength (except Mars = full)
- 5th/9th house: 1/2 strength (except Jupiter = full)
- 7th house: full for all

### GAP-5: D60 (Shashtiamsha) Proper Lookup Table (MEDIUM)
**Source:** BPHS Ch.6  
**Impact:** D60 carries highest Vimshopaka weight (4.0 of 20)

Currently uses a simple cyclic formula. BPHS defines 60 named divisions (Ghora, Rakshasa, Deva, Kubera, Yaksha, Kinnara, etc.) with specific sign assignments requiring a 720-entry table. Since D60 has the highest Vimshopaka Bala weight, this approximation affects the overall dignity score.

### GAP-6: Gulika/Mandi Calculation (MEDIUM)
**Source:** BPHS Ch.25, Prasna Marga  
**Impact:** Missing a fundamental upagraha used in muhurta and natal

Gulika and Mandi are computed as sons of Saturn based on weekday-specific time slots. They are critical for:
- Muhurta (Gulika kalam is an inauspicious period)
- Natal analysis (Gulika in house shows area of karmic suffering)
- Prasna (Gulika position is diagnostic)

The `UpagrahaPosition` interface exists but Gulika/Mandi are absent from the computed upagrahas (only Dhuma, Vyatipata, Parivesha, Chapa, Upaketu are present).

### GAP-7: Abhijit Muhurta Period (MEDIUM)
**Source:** Surya Siddhanta, Muhurta Chintamani  
**Impact:** Missing the single most commonly sought daily auspicious window

Abhijit Muhurta (the ~48 min window centered on local noon) is the most universally auspicious daily time period. It's referenced in the muhurta constants (muhurta #8 = "Vidhi/Abhijit") but not computed or displayed as a standalone feature on the panchang page.

### GAP-8: Delta T (TT-UT) Correction (LOW-MEDIUM)
**Source:** Meeus Ch.10  
**Impact:** ~69 seconds error in current epoch, growing; affects Moon position by ~0.5 arcmin

No correction applied for the difference between Terrestrial Time and Universal Time. For current dates this is approximately 69 seconds. For historical charts (e.g., 1900), Delta T was ~-3 seconds; for dates around 1600, it was ~120 seconds. This mostly matters for precise timing of tithi/nakshatra transitions and for historical chart rectification.

### GAP-9: Rashi Drishti (Jaimini Sign Aspects) as Standalone (LOW-MEDIUM)
**Source:** Jaimini Sutras  
**Impact:** Missing a parallel aspect system important for Jaimini analysis

Jaimini's sign-based aspects (movable signs aspect fixed except adjacent; fixed signs aspect movable except adjacent; dual signs aspect each other) are used partially in argala calculations but not exposed as a standalone analysis. JHora prominently shows Rashi Drishti alongside Graha Drishti.

### GAP-10: Dasha Sandhi (Junction Period Analysis) (LOW)
**Source:** BPHS, Phaladeepika  
**Impact:** Users don't see warnings about turbulent dasha transition periods

The junction between two Maha Dasha lords is a critical transition period (typically 6-12 months around the changeover). Most commercial software highlights these periods with special interpretation.

### GAP-11: Gochara (Transit) Analysis Beyond Sade Sati (MEDIUM)
**Source:** BPHS, Phaladeepika Ch.26  
**Impact:** No systematic transit prediction framework

While Sade Sati analysis is comprehensive, there's no general-purpose transit analysis that shows:
- Which houses each transiting planet activates
- Vedha (obstruction) points for transiting planets
- Ashtakavarga-based transit strength (requires GAP-1 first)
- Double transit theory (Jupiter + Saturn jointly activating a house)

### GAP-12: Rajju Dosha (South Indian Matching) (LOW)
**Source:** Tamil/South Indian traditions  
**Impact:** Incomplete matching for South Indian users

Not part of North Indian Ashta Kuta but essential for Tamil/South Indian users. The five Rajju categories (Pada/Kati/Nabhi/Kantha/Shiro) assess longevity compatibility. Given the app serves Tamil users (ta locale), this is relevant.

---

## PART 4: ENHANCEMENT OPPORTUNITIES

### ENH-1: True Node Option for Rahu/Ketu
Currently only Mean Node. Most professional software offers both. True Node oscillates ~1.5° around Mean Node, which can change Rahu/Ketu's rashi near sign boundaries. **Prokerala and JHora both offer this toggle.**

### ENH-2: KP Ayanamsha (Instead of Lahiri)
The KP system uses a specific ayanamsha (KP Old or KP New) that differs from Lahiri by ~6 arcminutes. For sub-lord calculations where a few arcminutes matter, this could change the sub-lord assignment near boundaries.

### ENH-3: Vimshottari Sub-Sub-Sub Level (Sookshma/Prana Dasha)
Currently computes Maha → Antar → Pratyantar. Adding Sookshma (4th level) and Prana (5th level) would enable fine-grained timing. JHora computes up to Prana level.

### ENH-4: Centralized Planet Dignities Constant
Exaltation, debilitation, moolatrikona, own signs, and friendships live only in `shadbala.ts` as module-local constants. A shared `PLANET_DIGNITIES` in `src/lib/constants/` would enable cleaner reuse across yogas, tippanni, display components, and matching.

### ENH-5: Rahu/Ketu Dignity Assignment
Per some Jyotish texts (though debated): Rahu exalted in Taurus/Gemini, Ketu exalted in Scorpio/Sagittarius. Many users expect to see these, especially for Kala Sarpa Yoga strength assessment.

### ENH-6: Dagdha Rashi and Dagdha Tithi in Muhurta
These are standard Muhurta-specific inauspicious combinations (certain tithis + weekdays = dagdha tithi; certain signs on certain weekdays = dagdha rashi). Present in the `PanchangData` interface (`dagdhaTithi`) but not fully integrated into the muhurta scoring engine.

### ENH-7: Panchanga Shuddhi Explicit Check
A formal check that all 5 panchangas (Tithi, Nakshatra, Yoga, Karana, Weekday) are simultaneously favorable. The muhurta scoring approximates this but doesn't name it explicitly, which users expect.

### ENH-8: Vimsottari Dasha Balance at Birth — Show Elapsed/Remaining
Show both elapsed portion and remaining balance of the birth dasha, not just the remaining. Users often want to understand "how much of Moon Maha Dasha did the person experience in early childhood."

### ENH-9: Chara Dasha (Jaimini) — Full Implementation
Narayana Dasha is simplified (starts from Lagna without strength comparison of Lagna vs 7th). Per BPHS/Jaimini Sutras, the stronger of Lagna and 7th house determines starting sign and direction. K.N. Rao's school emphasizes this distinction.

### ENH-10: Sarvatobhadra Chakra — Full Implementation
Currently simplified. The full SBC is a 9x9 grid used for transit analysis, mapping nakshatras/vowels/weekdays/tithis with vedha arrows. It's a powerful transit tool used by serious practitioners.

### ENH-11: Polar Region Handling
Sunrise/sunset at high latitudes returns fallback values (6:00/18:00) during polar night/midnight sun. Should display an explicit message: "No sunrise/sunset at this latitude on this date" rather than false times.

### ENH-12: Pre-Gregorian Date Handling
`dateToJD` always applies Gregorian correction, making pre-1582 dates incorrect. Historical charts (ancient kings, religious figures) would be affected. The fix is simple: check if date is before Oct 15, 1582 and skip the B correction term.

### ENH-13: Combustion — Direct vs Retrograde Orbs
Mercury and Venus have different combustion orbs when direct vs retrograde (Mercury: 12° direct / 14° retrograde; Venus: 8° direct / 10° retrograde per some BPHS editions). Currently uses single values.

### ENH-14: Bhrigu Bindu Interpretation
The `bhriguBindu` field exists in the types but interpretation text showing which house/nakshatra the Bhrigu Bindu falls in and its transit triggers would add practical value.

### ENH-15: Hora Lord for Current Time
Display the current Hora lord (planetary hour) on the panchang page. The data structure supports it but it's not prominently featured.

---

## PART 5: VERIFICATION OF CONSTANTS (Detailed)

### Nakshatras (27) — ALL CORRECT
Names, rulers (Vimshottari sequence), deities, degree spans (13.333°), and natures verified against BPHS and Muhurta Chintamani. All 10 language translations present.

### Rashis (12) — ALL CORRECT
Lords, elements, qualities verified against BPHS. No outer planet co-rulerships (deliberate classical choice).

### Grahas (9) — ALL CORRECT
Natural friendships/enmities in `shadbala.ts` verified against BPHS Ch.3. Exaltation/debilitation degrees all correct. Moolatrikona ranges correct (Venus 0-10° debatable but Laghu Parashari supported).

### Tithis (30) — ALL CORRECT
15 Shukla + 15 Krishna, all deities match Dharmasindhu.

### Yogas (27) — ONE ISSUE
All names and sequence correct. Vajra (#15) should be inauspicious, not neutral (see DATA-1).

### Karanas (11) — TWO ISSUES
Names and cyclic pattern correct except Nagava → Naga (DATA-2) and Kimstughna type (DATA-3).

### Muhurtas (30) — ALL CORRECT
15 day + 15 night, correct auspicious/inauspicious assignments per Surya Siddhanta.

### Nakshatra Syllables — ONE ISSUE
Spot-checked against traditional sources, all correct except U.Bhadrapada pada 4 (DATA-4).

### Dasha Periods — ALL CORRECT
Vimshottari (120yr), Yogini (36yr), Ashtottari (108yr — except BUG-3) all verified. Vimshottari sequence: Ketu=7, Venus=20, Sun=6, Moon=10, Mars=7, Rahu=18, Jupiter=16, Saturn=19, Mercury=17. Matches BPHS exactly.

### Shadbala Constants — ALL CORRECT
All 6 components verified: Sthana, Dig, Kala (9 sub-components), Chesta, Naisargika, Drik. Min required Rupas (Sun=5, Moon=6, Mars=5, Mercury=7, Jupiter=6.5, Venus=5.5, Saturn=5) correct per BPHS.

### Combustion Orbs — CORRECT
Moon=12°, Mars=17°, Mercury=14°, Jupiter=11°, Venus=10°, Saturn=15°. Match BPHS values.

### Tajika/Varshaphal — CORRECT
16 Tajika Yogas, Muntha advancing 1 sign/year, 16 Sahams with day/night formulas, Mudda Dasha proportional compression to 365.25 days.

### KP Sub-Lord Table — CORRECT
249 boundary entries built from Vimshottari proportions. Lord sequence matches. 4-level significator system (star-lord of occupant → occupant → star-lord of owner → owner) correct per KP Reader.

### Ashtamangala Prashna — CORRECT
8 objects with correct planetary rulers per Prasna Marga tradition.

### Eclipse Detection — FUNCTIONAL
Latitude-threshold method with speed-based scaling + NASA table cross-validation. Not Besselian elements, but adequate for date-level accuracy.

---

## PART 6: ARCHITECTURAL CONCERNS

### ARCH-1: Two Parallel Astronomy Engines
`src/lib/astronomy/` and `src/lib/ephem/astronomical.ts` both implement Julian Day, Sun/Moon longitude, and ayanamsha with slightly different constants. The panchang page uses one; the kundali page uses the other. **Recommend: consolidate to a single engine**, preferring the `ephem/` layer which has Swiss Ephemeris integration.

### ARCH-2: Swiss Eph Server-Only Limitation
Swiss Ephemeris bindings only work server-side (Node.js). Any client-side calculation (if attempted) falls back to the crude Meeus planetary approximations. **Ensure all kundali calculations route through API endpoints**, never client-side, to guarantee Swiss Eph accuracy.

### ARCH-3: Nutation Simplification
Only the dominant nutation term (17.2″ sin Ω) is used. The full IAU 1980 theory has 106 terms. For Jyotish purposes (where ayanamsha correction dominates) this is usually acceptable, but it means "apparent longitude" is approximate by up to ~1 arcsecond.

---

## PART 7: COMPETITIVE COMPARISON

| Feature | This App | JHora (PVR Rao) | Parashara's Light | Astrosage |
|---------|----------|-----------------|-------------------|-----------|
| Dasha Systems | 25+ | 40+ | 20+ | 5 |
| Yoga Detection | 150+ | 300+ | 200+ | 50+ |
| Shadbala | Complete (6/6) | Complete | Complete | Basic |
| Ashtakavarga | BAV+SAV only | Full + Shodhana | Full + Shodhana | BAV+SAV |
| Divisional Charts | D1-D60, D150 | D1-D150 | D1-D60 | D1-D12 |
| KP System | Full with SSS | Full | Full | Basic |
| Varshaphal | Full Tajika | Full | Full | None |
| Prashna | Ashtamangala + Horary | Multiple methods | Basic | None |
| Matching | 8 Kuta (no cancellation) | 8 Kuta + cancellation | Full + Rajju | 8 Kuta |
| Transit Analysis | Sade Sati only | Full Gochara + BAV | Full | Basic |
| Muhurta | 20 activities + AI | Comprehensive | Comprehensive | Basic |
| Multilingual | 10 languages | 1-2 | 2-3 | 2 |
| Web/Mobile | Yes (PWA) | Desktop only | Desktop only | Yes |
| Price | Free | Free | $199-$299 | Freemium |

**This app's competitive advantages:** Web-based, 10-language, free, modern UI, AI muhurta recommendations, Pancha Pakshi, D150 Nadi Amsha. **Main gaps vs JHora:** Ashtakavarga reductions, partial aspects, Gochara framework, dosha cancellation rules.

---

## PART 8: PRIORITY RECOMMENDATIONS

### P0 (Fix immediately — affects accuracy)
1. BUG-1: Karana fixed mapping (Shakuni/Chatushpada/Naga off by one)
2. BUG-5: Moon-Jupiter friendship in Ashta Kuta
3. BUG-6: Ensure all kundali calculations go through Swiss Eph (never client-side fallback for birth charts)

### P1 (Fix soon — user-facing correctness)
4. BUG-2: Yamaganda consistency between engines
5. BUG-3: Ashtottari Dasha Rahu/Ketu swap
6. DATA-1 through DATA-5: Constant data corrections
7. GAP-2: Mangal Dosha cancellation rules
8. GAP-3: Nadi Dosha cancellation rules

### P2 (Important enhancements)
9. GAP-1: Ashtakavarga Trikona/Ekadhipatya Shodhana
10. GAP-6: Gulika/Mandi calculation
11. GAP-7: Abhijit Muhurta display
12. GAP-11: General transit (Gochara) framework
13. BUG-4: Consolidate dual astronomy engines

### P3 (Nice to have)
14. GAP-4: Partial aspect strengths
15. GAP-5: D60 proper lookup table
16. GAP-8: Delta T correction
17. ENH-1 through ENH-15

---

*End of audit. This report should be reviewed against live calculations for the test dates documented in the test suite (Bern, Delhi, Seattle) to confirm which bugs manifest in practice vs are theoretical.*

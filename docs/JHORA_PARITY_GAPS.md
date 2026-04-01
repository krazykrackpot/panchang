# JHora Parity Gap Analysis — Complete Feature Inventory

**Date:** 2026-04-01
**Benchmark:** Jagannatha Hora 8.0 (PVR Narasimha Rao)
**Our Current State:** 361 pages, 50+ yogas, 9 dashas, Swiss Ephemeris accuracy (0.0000° match)

---

## CRITICAL (Must have — these are expected by any serious Jyotish practitioner)

### C1: Avasthas — Planetary States (5 Systems)
**JHora:** Full 5 Avastha systems | **Us:** None
**Impact:** Avasthas determine HOW a planet expresses its energy. Without them, we can say WHERE a planet is but not HOW it behaves. Every traditional chart reading references these.

**Systems needed:**
1. **Baladi Avasthas** (Age-based): Bala (infant), Kumara (youth), Yuva (adult), Vriddha (old), Mrita (dead) — based on degree within sign. Even degrees = different sequence for odd/even signs.
2. **Jagradadi Avasthas** (Wakefulness): Jagrat (awake), Swapna (dreaming), Sushupta (deep sleep) — based on own sign, friend's sign, enemy's sign.
3. **Deeptadi Avasthas** (Luminosity): Deepta (blazing/exalted), Swastha (own sign), Mudita (friend's sign), Shanta (benefic varga), Shakta (retrograde), Dina (combust/enemy), Vikala (conjunct malefic), Khala (debilitated), Bhita (in planetary war)
4. **Lajjitadi Avasthas** (Emotional/BPHS Ch.45): Lajjita (ashamed), Garvita (proud), Kshudita (hungry), Trushita (thirsty), Mudita (delighted) — based on house + conjunction combinations
5. **Shayanadi Avasthas** (Activity/BPHS Ch.45): Shayana (lying down), Upavesha (sitting), Netrapani (looking), Prakash (illuminating), Gamana (moving), Agamana (returning), Sabha (in assembly), Agama (arriving), Bhojana (eating), Nritya (dancing), Kautuka (curious), Nidraa (sleeping)

**BPHS Reference:** Ch.44-45

### C2: Argala — Planetary Intervention
**JHora:** Full Argala + Virodha Argala | **Us:** None
**Impact:** Argala is Jaimini's system for determining which planets actively intervene in a house's affairs. Without it, Jaimini chart reading is incomplete.

**Implementation needed:**
- Primary Argala: planets in 2nd, 4th, 11th from a sign create Argala (support/obstruction)
- Virodha Argala (counter): planets in 12th, 10th, 3rd can counter the Argala
- Special Argala: Rahu/Ketu create Argala from 2nd/4th
- Per-house Argala analysis showing which planets support/obstruct each house
- Used heavily in Narayana Dasha interpretation

**BPHS Reference:** Ch.31

### C3: Prastarashtakavarga — Full 8×12 Grid Display
**JHora:** Full Prastara grid with Shodhana | **Us:** BAV + SAV summary only
**Impact:** Practitioners use the Prastara grid to visually assess transit quality. It's the primary tool for timing predictions with transits.

**Implementation needed:**
- Full 8×12 bindu allocation table per planet (7 planets + Lagna)
- Bindu contribution breakdown: WHO contributes each point (Sun, Moon, Mars... and Lagna)
- Shodhana (reduction) process:
  - Trikona Shodhana (sum of trikona signs must follow rules)
  - Ekadhipatya Shodhana (same lord reductions)
- Sodhita SAV (reduced Sarvashtakavarga)
- Transit scoring: when planet transits a sign, its BAV score predicts quality
- Kakshya system: 8 subdivisions within each sign for micro-timing

**BPHS Reference:** Ch.69-72

### C4: Sphuta Calculations — Sensitive Points
**JHora:** Tri-sphuta, Prana-sphuta, Deha-sphuta, Mrityu-sphuta | **Us:** None
**Impact:** Sphutas are sensitive degrees used for health, longevity, and vitality predictions. Missing them means incomplete Ayurdaya (longevity) analysis.

**Needed:**
- **Prana Sphuta** = (Lagna + Moon + Sun) / 3 — vitality point
- **Deha Sphuta** = (Moon × 5 + Lagna × 8 + Sun) / 14 — body point (normalized)
- **Mrityu Sphuta** = (Moon × 8 + Lagna + Sun × 7) / 16 — death point (normalized)
- **Tri Sphuta** = average of above 3 — composite sensitive point
- **Yogi Point** = Sun + Moon + 93°20' — most beneficial degree
- **Yogi Planet** = lord of Yogi Point's nakshatra
- **Avayogi Point** = Yogi + 186°40'
- **Avayogi Planet** = lord of Avayogi's nakshatra
- **Sahama/Sahams** — we have some in Varshaphal but need them in natal chart too

**BPHS Reference:** Ch.10, Phaladeepika Ch.8

---

## HIGH (Expected by intermediate practitioners — significant gap in chart analysis)

### H1: Expand Yogas from 50 to 150+
**JHora:** 184 yogas | **Us:** 50
**What's missing:**
- **More Nabhasa Yogas** (we have 13, need ~20 more subtypes)
- **Sankhya Yogas** (7): planets in 1/2/3/4/5/6/7 signs
- **Dala Yogas** (2): Maala, Sarpa
- **Askriti Yogas** (20): geometric patterns
- **More Dhana Yogas** (6-10): specific wealth combinations beyond basic 2nd/11th lord
- **Daridra Yogas** (5+): poverty-indicating combinations
- **Arishta Yogas** (10+): health/danger indicators for longevity
- **More Parivartana variants**: currently detect exchange but not all 3 types (Maha/Khala/Dainya) separately with sub-classification
- **Kala Amrita Yoga**: all planets between Moon/Sun axis
- **Graha Malika Yoga**: planets in consecutive houses
- **Akhanda Samrajya Yoga**: unbroken empire yoga
- **Chaturmukha Yoga**: benefics in all 4 kendras

### H2: More Dasha Systems (expand from 9 to 20+)
**JHora:** 40+ | **Us:** 9
**Priority additions (11 systems):**

**Graha (Nakshatra-based) — 6 more:**
1. **Shodasottari** (116-year cycle)
2. **Dwadasottari** (112-year cycle)
3. **Panchottari** (105-year cycle)
4. **Satabdika** (100-year cycle)
5. **Chaturaaseethi Sama** (84-year cycle)
6. **Shashtihayani** (60-year cycle)

**Rasi (Sign-based) — 5 more:**
7. **Mandooka Dasha** (Frog dasha — jumps between signs)
8. **Drig Dasha** (Aspect-based, from Jaimini)
9. **Moola Dasha** (Root dasha)
10. **Navamsha Dasha** (based on D9 signs)
11. **Brahma Dasha** (rare, from BPHS)

### H3: More House Systems
**JHora:** 15+ systems | **Us:** Equal + Placidus (KP only)
**Needed:**
1. **Sripati** (most widely used after Equal in India) — midpoint between Equal and Placidus
2. **Whole Sign** (rising sign = 1st house, widely used by beginners)
3. **Koch** (popular in Europe)
4. **Regiomontanus** (historical significance)
5. **Campanus** (used by some Western Vedic practitioners)

### H4: Extended Dosha Detection with Cancellation
**Current:** We have Mangal, Kala Sarpa, Ganda Moola, Pitra, Shrapit, Kalathra, Marana Karaka, Badhaka, Guru Chandal, Kemadruma, Daridra, Kendradhipati in yogas-complete.ts.
**Missing:** Proper cancellation criteria display and remedial prescription per dosha.

**Enhancement needed:**
- For each dosha: list ALL cancellation conditions (not just presence/absence)
- Show which cancellation conditions are met in THIS chart
- Severity scoring (full/partial/cancelled)
- Specific remedies per dosha (gemstone, mantra, charity, deity)
- Connection to dasha periods (when will this dosha activate?)

### H5: Graha Arudhas
**JHora:** All planet-based arudhas | **Us:** Only Bhava Arudhas (A1-A12)
**Needed:**
- Graha Arudhas for each of 9 planets
- These show the "projected image" of each planet as perceived by the world
- Used in Jaimini predictive astrology
- Formula: count from planet to its sign lord, then same distance from lord

---

## MEDIUM (Advanced/specialized features — differentiation opportunities)

### M1: Mundane Astrology
**JHora:** Solar ingress charts, eclipse charts, conjunction tracking | **Us:** None
**Implementation:** Generate charts for Mesha Sankranti (annual national chart), eclipse moments, major conjunctions. Used for political/economic predictions.

### M2: Conception Chart Estimation
**JHora:** Nisheka (conception) time estimation | **Us:** None
**Method:** Work backward from birth time using Adhana Lagna rules (BPHS Ch.5). The Moon at conception becomes the Lagna at birth (approximately).

### M3: Pancha Pakshi Sastra
**JHora:** Full bird-based energy system | **Us:** None
**What it is:** Tamil Shaivite system — 5 birds (Vulture, Owl, Crow, Cock, Peacock) assigned based on birth nakshatra. Each bird has 5 activities (Ruling, Eating, Walking, Sleeping, Dying) cycling through the day. Used for day-by-day activity optimization.

### M4: More Chakra Systems (functional)
**JHora:** 10+ chakra visualizations | **Us:** 3 (Sudarsana, Sarvatobhadra, Kota — basic)
**Needed:**
- **Tripataki Chakra** — triple-fork for death timing
- **Shoola Chakra** — directional danger from transit
- **Surya Kalanala / Chandra Kalanala** — Sun/Moon-based fire diagrams
- Make existing Sarvatobhadra actually functional for transit analysis (currently layout-only)

### M5: Surya Siddhanta Mode
**JHora:** Can toggle between modern ephemeris and traditional SS calculations | **Us:** Swiss Ephemeris only
**What it is:** An educational/research toggle that computes using the traditional Surya Siddhanta algorithms alongside modern values, showing the difference. Useful for scholars studying the accuracy of ancient methods.

### M6: Multiple Ayanamsha per Chart
**JHora:** Can display chart in multiple ayanamshas simultaneously | **Us:** One at a time (Lahiri default, 6 available)
**Enhancement:** Show a comparison table: "Your Sun in Lahiri vs KP vs Raman" for planets near sign boundaries.

### M7: Hora Chart Variants
**JHora:** Multiple D2 (Hora) calculation methods — Parashari, Jagannath, Kashinath | **Us:** One method
**What it is:** D2 (Hora) chart has different traditions on how to assign the hora. JHora allows switching between methods.

### M8: Custom Divisional Charts
**JHora:** Any D-N from D1 to D300 | **Us:** Fixed set of 19
**What it is:** User can compute any arbitrary division (D81, D108, D144, etc.) for research purposes.

### M9: Annual Dashas (Varsha-specific)
**JHora:** Patyayini, Varsha Vimsottari, Varsha Narayana | **Us:** Only Mudda Dasha in Varshaphal
**Needed:** Additional annual-chart-specific timing systems for yearly prediction.

### M10: Progression Charts
**JHora:** Progressed charts from Yogini, Kalachakra, Sudarsana Chakra dashas | **Us:** None
**What it is:** Generate a chart for a specific dasha period start to analyze that period. Like a transit chart but for dasha timing.

---

## LOW (Niche/research features — nice to have but not expected)

### L1: Tajika Aspects (16 Yogas)
Full Tajika system for annual charts — 16 named Tajika aspect yogas (Ithasala, Ishrapha, etc.). We have basic Tajika in Varshaphal but not the full 16.

### L2: Naadi Astrology Integration
Pre-written destiny based on thumb impression + nakshatra. Very specialized Tamil tradition.

### L3: Prasna Marga System
Kerala-specific horary astrology system (different from Ashtamangala Prashna). We have Ashtamangala but not the broader Prasna Marga.

### L4: Dagdha Rashi / Dagdha Tithi
"Burnt" signs/tithis — combinations that render certain signs/tithis inauspicious. Currently not computed.

### L5: User-Overridable Strength
JHora allows manual override of any strength determination for research. We don't have this.

---

## IMPLEMENTATION PRIORITY ORDER

```
SPRINT 1 (Critical):
  C1: Avasthas (5 systems)
  C2: Argala (Jaimini intervention)
  C3: Prastarashtakavarga (full grid)
  C4: Sphuta calculations (7 sensitive points)

SPRINT 2 (High):
  H1: Expand yogas (50 → 150+)
  H2: More dasha systems (9 → 20+)
  H3: More house systems (2 → 5+)
  H4: Dosha cancellation + remedies
  H5: Graha Arudhas

SPRINT 3 (Medium):
  M1: Mundane astrology
  M2: Conception chart
  M3: Pancha Pakshi
  M4: Functional chakra systems
  M5-M10: Remaining medium items

SPRINT 4 (Low):
  L1-L5: Niche features
```

---

## METRICS

| Category | Count | JHora Equivalent | Parity % |
|----------|-------|-----------------|----------|
| Yogas | 50 | 184 | 27% |
| Doshas | 12 | 15+ | 80% |
| Dasha Systems | 9 | 40+ | 23% |
| House Systems | 2 | 15+ | 13% |
| Special Lagnas | 6 | 6 | 100% |
| Divisional Charts | 19 | 23+ | 83% |
| Avasthas | 0 | 5 systems | 0% |
| Argala | 0 | Full | 0% |
| Sphutas | 0 | 7+ | 0% |
| Chakra Systems | 3 | 10+ | 30% |
| Ashtakavarga | Summary | Full Prastara | 40% |
| Calculation Accuracy | Perfect (SwEph) | Perfect (SwEph) | 100% |

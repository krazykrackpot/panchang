# Technical Architecture — Jyotish Panchang

## Swiss Ephemeris Integration

### Overview

The Swiss Ephemeris (SwEph) is a high-precision astronomical calculation library developed by Astrodienst AG (astro.com), based on NASA JPL's DE431 planetary ephemeris. It provides sub-arcsecond accuracy for planetary positions spanning 5400 BC to 5400 AD.

### Why We Switched from Meeus

Our original engine used Jean Meeus's "Astronomical Algorithms" — simplified polynomial approximations for planetary positions. While elegant and dependency-free, validation revealed critical flaws:

**Meeus Accuracy Issues:**
- **Sun:** ~0.01° average error — acceptable for most purposes
- **Moon:** ~0.5° average, up to 13° maximum — caused nakshatra mismatches in ~20% of charts
- **Mars:** ~22° average error — FUNDAMENTALLY BROKEN. Planet in wrong sign 33% of the time
- **Jupiter:** ~8° average — wrong sign 40% of the time
- **Saturn:** ~3° average — wrong sign 13% of the time

These aren't theoretical issues. A chart with Mars in the wrong sign produces:
- Wrong house lordship analysis
- Wrong yoga detection (Ruchaka Yoga requires Mars in specific signs)
- Wrong Mangal Dosha assessment
- Wrong career/property predictions (Mars karakatva)

### Implementation Architecture

```
sunLongitude(jd)
  ├── if sweph available → swissPlanetLongitude(jd, SE_SUN)  [0.001° accuracy]
  └── else → _meesusSunLongitude(jd)                         [0.01° accuracy]

moonLongitude(jd)
  ├── if sweph available → swissPlanetLongitude(jd, SE_MOON) [0.001° accuracy]
  └── else → _meeusMoonLongitude(jd)                         [0.5° accuracy]

getPlanetaryPositions(jd)
  ├── if sweph available → swissAllPlanets(jd)               [0.001° all 9]
  └── else → _meeusPlanetaryPositions(jd)                    [varies]

lahiriAyanamsha(jd)
  ├── if sweph available → swissAyanamsha(jd)                [exact IAE match]
  └── else → _meeeusLahiriAyanamsha(jd)                     [0.004° polynomial]

approximateSunrise(jd, lat, lng)
  ├── if sweph available → swissSunrise(jd, lat, lng)        [SwEph Sun position]
  └── else → _meeusSunrise(jd, lat, lng)                    [Meeus Sun position]
```

### Key Design Decisions

1. **eval('require')('sweph')** — Prevents Turbopack from trying to bundle the native C++ addon. The dynamic require is only executed at runtime on the server.

2. **typeof window check** — SwEph is a native Node.js addon and cannot run in the browser. The `isSwissEphAvailable()` function returns false on the client side.

3. **Lazy singleton** — SwEph is loaded once on first use, then cached. The `set_sid_mode(SE_SIDM_LAHIRI)` call happens during initialization.

4. **Ketu = Rahu + 180°** — SwEph provides the mean lunar node (Rahu). Ketu is computed as the anti-node.

5. **Sunrise uses Sun declination** — SwEph's `rise_trans` function had issues in the `sweph` npm binding, so we compute sunrise using the standard hour angle formula with SwEph-precise Sun declination instead.

### Validation Methodology

The validation script (`scripts/validate-against-pyjhora.py`) computes positions using both:
1. Our engine (via `npx tsx` subprocess calling `computePanchang`)
2. pyswisseph (Python Swiss Ephemeris binding)

Both use the **same JD** (computed from identical sunrise formula) to ensure apples-to-apples comparison.

**15 test cases** cover:
- Multiple years (1990, 2000, 2024, 2025, 2026, 2030)
- Multiple locations (Delhi, Corseaux, New York, Chennai, Mumbai, London)
- Edge cases (solstices, equinoxes, year boundaries)

### Licensing

Swiss Ephemeris is dual-licensed:
- **AGPL-3.0** for open-source use (our case)
- **Commercial license** ($800 one-time) for proprietary software

Since our project is AGPL-3.0 compatible, we use the open-source license.

---

## Avastha System

### What Avasthas Are

Avasthas (planetary states) answer the question: "HOW does this planet express its energy?" While dignity tells you WHETHER a planet is strong, avasthas tell you the MANNER of its expression.

### Five Systems (BPHS Ch.44-45)

**1. Baladi (Age-based)**
Based on degree within sign (0-30°), divided into 5 sectors of 6° each:
- Bala (Infant, 0-6°): immature expression, 20% strength
- Kumara (Youth, 6-12°): developing, 40% strength
- Yuva (Adult, 12-18°): peak expression, 100% strength
- Vriddha (Old, 18-24°): declining, 50% strength
- Mrita (Dead, 24-30°): exhausted, 5% strength

For even signs, the order reverses (Mrita first, Bala last).

**2. Jagradadi (Wakefulness)**
Based on sign dignity:
- Jagrat (Awake): planet in own sign or exalted — full power
- Swapna (Dreaming): planet in friend's sign — half power
- Sushupta (Deep Sleep): planet in enemy/neutral/debilitated sign — quarter power

**3. Deeptadi (Luminosity)**
9 states based on multiple factors:
- Deepta (Blazing): exalted planet
- Swastha (Healthy): own sign
- Mudita (Joyful): friend's sign
- Shanta (Peaceful): in benefic vargas
- Shakta (Powerful): retrograde (closer to Earth)
- Dina (Weak): combust or enemy sign
- Vikala (Afflicted): conjunct malefic
- Khala (Wicked): debilitated
- Bhita (Frightened): in planetary war

**4. Lajjitadi (Emotional)**
Based on house position + conjunctions (BPHS Ch.45):
- Lajjita (Ashamed): in 5th with Rahu/Ketu/Saturn
- Garvita (Proud): exalted or own sign
- Kshudita (Hungry): enemy sign with enemy planet
- Trushita (Thirsty): in water sign
- Mudita (Delighted): default/good placement

**5. Shayanadi (Activity)**
12 activity states based on degree (2.5° sectors):
Shayana (resting), Upavesha (sitting), Netrapani (gazing), Prakash (shining), Gamana (moving), Agamana (arriving), Sabha (in assembly), Agama (approaching), Bhojana (eating), Nritya (dancing), Kautuka (curious), Nidraa (sleeping)

---

## Argala System

### What Argala Is

Argala (अर्गला = bolt/intervention) is Jaimini's system for determining which planets actively INTERVENE in a house's affairs — either supporting or obstructing it.

### Rules (BPHS Ch.31)

**Primary Argala (Support):**
- Planets in 2nd from a sign → create Argala
- Planets in 4th from a sign → create Argala
- Planets in 11th from a sign → create Argala

**Virodha Argala (Counter):**
- Planets in 12th → counter the 2nd's Argala
- Planets in 10th → counter the 4th's Argala
- Planets in 3rd → counter the 11th's Argala

**Secondary:** 5th creates, 9th counters
**Special:** Malefics in 3rd also create Argala

**Net Effect:** If counter planets outnumber or overpower Argala planets, the Argala is neutralized.

---

## Sphuta System

### Sensitive Points

Sphutas are computed degrees in the chart that indicate vulnerability or strength for specific life areas.

**Yogi/Avayogi Points** — Most important sphutas:
- Yogi Point = Sun° + Moon° + 93°20'
- Yogi Planet = nakshatra lord of Yogi Point → most benefic planet for the native
- Avayogi Point = Yogi + 186°40'
- Avayogi Planet = most challenging planet

**Practical use:** During the Yogi Planet's dasha or when Moon transits the Yogi Point, maximum good fortune occurs. Conversely, Avayogi periods bring obstacles.

**Health Sphutas:**
- Prana Sphuta (vitality): Lagna + Moon + Sun
- Deha Sphuta (body): weighted Moon + Lagna
- Mrityu Sphuta (longevity): weighted combination

Saturn or Rahu transiting over Mrityu Sphuta can trigger health crises.

**Fertility Sphutas:**
- Bija Sphuta (male): Sun + Venus + Jupiter
- Kshetra Sphuta (female): Moon + Mars + Jupiter

Both in odd signs = favorable for progeny.

---

## Prastarashtakavarga

### The Bindu Grid

Ashtakavarga assigns 0-8 "bindu" (benefic points) to each planet in each sign from 8 contributing sources (7 planets + Lagna).

**Bhinnashtakavarga (BAV):** Individual planet's bindu per sign
- 4+ bindus = GOOD transit through that sign
- 0-3 bindus = POOR transit

**Sarvashtakavarga (SAV):** Sum of all 7 planets' BAV per sign
- 28+ = strong sign (above average of 28)
- <22 = weak sign

Our implementation:
- Full 7×12 BAV table rendered with color coding
- SAV total row with strength indicators
- Per-cell color: green (≥5), red (≤2), default for middle values
- Grand total displayed

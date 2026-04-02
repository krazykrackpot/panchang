# Advanced Learning Modules — Implementation Plan

**Date:** April 2026
**Current:** 50 modules (1-1 through 17-4)
**Target:** 83 modules (+ 33 new) across 10 phases

---

## Overview

Every new module is backed by an existing calculation engine in the codebase. The modules teach the theory, then the user can apply it immediately using our tools.

Each module follows the established pattern:
- `ModuleContainer` with META, 2-3 Pages, 10 bilingual Questions (en/hi)
- Glass-card sections: Classical Origin (gold), Worked Examples (emerald), Misconceptions (red), Modern Relevance (blue)
- Cross-references to related modules and app tools
- ~250-300 lines per module

---

## Phase 5: Strength & Dignity (Modules 18-1 to 18-5)

**Engine files:** `shadbala.ts`, `bhavabala.ts`, `avasthas.ts`, `vimshopaka.ts`, kundali-calc (ashtakavarga)

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 18-1 | Shadbala — 6-Fold Planetary Strength | षड्बल — छह प्रकार का ग्रह बल | `shadbala.ts` | 15 |
| 18-2 | Bhavabala — House Strength | भावबल — भाव की शक्ति | `bhavabala.ts` | 12 |
| 18-3 | Ashtakavarga — The Bindu Scoring System | अष्टकवर्ग — बिन्दु अंक पद्धति | kundali-calc | 15 |
| 18-4 | Avasthas — Planetary States & Moods | अवस्थाएँ — ग्रह की दशाएँ | `avasthas.ts` | 13 |
| 18-5 | Vimshopaka — 20-Point Varga Strength | विंशोपक बल | `vimshopaka.ts` | 12 |

### Content Detail

**18-1 Shadbala:**
- Page 1: What is Shadbala? Six strengths: Sthana (positional), Dig (directional), Kala (temporal), Cheshta (motional), Naisargika (natural), Drig (aspectual). Why a planet in exaltation can still be weak (low Dig bala). Minimum threshold: 1.0 rupa.
- Page 2: Each strength calculated — Sthana bala (5 sub-components: Uccha, Saptavarga, Ojha-Yugma, Kendradi, Drekkana). Dig bala (Jupiter/Mercury strong in East, Sun/Mars in South, Saturn in West, Moon/Venus in North). Worked example for Mars.
- Page 3: Interpreting Shadbala output — strongest planet = natural leader in chart. Weakest = area needing remedies. Our app shows Shadbala in the kundali "Strength" tab. How Shadbala resolves contradictions (exalted but combust, own sign but in dusthana).

**18-2 Bhavabala:**
- Page 1: House strength ≠ planet strength. A house is strong when: its lord is strong (Shadbala), benefics aspect it, no malefics occupy it, its lord is well-placed. Bhavabala = Bhavadhipati bala + Bhava Dig bala + Bhava Drishti bala.
- Page 2: Calculating each component — lord's contribution, aspectual strength from all planets, positional strength from bhava madhya (house midpoint). Why the 10th house might be stronger than the 1st even with fewer planets.
- Page 3: Practical application — strongest bhava = life area where success comes most easily. Weakest = area requiring conscious effort. Comparing Shadbala (planet) with Bhavabala (house) for holistic assessment.

**18-3 Ashtakavarga:**
- Page 1: Each of the 7 planets (excluding Rahu/Ketu) contributes bindus (points, 0-8) to each of the 12 signs from 8 sources (7 planets + lagna). Total possible per planet: 337. Sarvashtakavarga (SAV) = sum of all 7 BAV tables.
- Page 2: Reading the BAV — a planet transiting a sign where it has 4+ bindus = favorable transit. Below 4 = challenging. SAV interpretation: sign with 28+ total = strong sign overall. The Kaksha (8 sub-divisions per sign) for fine timing.
- Page 3: Worked example — Saturn in your chart has 5 bindus in Aries, 2 in Taurus, 6 in Gemini. When Saturn transits Gemini = good (6 bindus). Transit through Taurus = difficult (2 bindus). Reconciling Ashtakavarga with dasha for prediction accuracy.

**18-4 Avasthas:**
- Page 1: Planets have "moods" based on their condition. Bala-Panchaka (5 age states): Bala (infant, 0-6°), Kumara (youth, 6-12°), Yuva (prime, 12-18°), Vriddha (old, 18-24°), Mrita (dead, 24-30°). Yuva = strongest results.
- Page 2: Deeptadi Avasthas (9 states based on relationships): Deepta (exalted), Swastha (own sign), Mudita (friend's sign), Shanta (benefic varga), Shakta (retrograde), Dina (enemy sign), Vikala (combust), Khala (debilitated), Bhita (in war).
- Page 3: Lajjitadi Avasthas (6 shame-based states) and how they modify dasha predictions. A planet in Lajjita (ashamed) avastha gives results with delay and embarrassment. Our engine computes all three avastha systems per planet.

**18-5 Vimshopaka:**
- Page 1: Each planet's dignity is checked across multiple divisional charts (D1 through D60). The Shodasvarga (16 vargas) system assigns weights: D1=3.5, D2=0.5, D3=1, D9=3, D12=0.5, etc. Total = 20 points maximum.
- Page 2: Scoring — Exalted in a varga = full weight. Own sign = 3/4 weight. Friend = 1/2. Neutral = 1/4. Enemy = 1/8. Debilitated = 0. Sum across all 16 vargas. A planet with 15+ Vimshopaka = powerful. Below 5 = very weak.
- Page 3: Vimshopaka vs Shadbala — Vimshopaka measures "dignity quality" across vargas. Shadbala measures "functional power" in the rashi chart. Both are needed. A planet can have high Vimshopaka (dignified across vargas) but low Shadbala (poorly placed in rashi chart).

---

## Phase 6: Jaimini System (Modules 19-1 to 19-4)

**Engine files:** `jaimini-calc.ts`, `argala.ts`, `special-lagnas.ts`

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 19-1 | Chara Karakas — 7 Variable Significators | चर कारक — 7 परिवर्तनशील कारक | `jaimini-calc.ts` | 14 |
| 19-2 | Rashi Drishti — Sign-Based Aspects | राशि दृष्टि — राशि आधारित दृष्टि | `jaimini-calc.ts` | 12 |
| 19-3 | Argala — Planetary Intervention System | अर्गला — ग्रह हस्तक्षेप पद्धति | `argala.ts` | 13 |
| 19-4 | Special Lagnas — Hora, Ghati, Varnada | विशेष लग्न — होरा, घटी, वर्णद | `special-lagnas.ts` | 13 |

---

## Phase 7: KP System Deep Dive (Modules 20-1 to 20-4)

**Engine files:** `placidus.ts`, `sub-lords.ts`, `significators.ts`, `ruling-planets.ts`

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 20-1 | Placidus Houses — Why KP Uses Unequal Houses | प्लेसिडस भाव — KP में असमान भाव क्यों | `placidus.ts` | 13 |
| 20-2 | The 249 Sub-Lord Table | 249 उप-स्वामी तालिका | `sub-lords.ts` | 15 |
| 20-3 | Significators — 4-Level House Connection | कारक — चतुर्स्तरीय भाव सम्बन्ध | `significators.ts` | 14 |
| 20-4 | Ruling Planets — KP Timing Method | शासक ग्रह — KP समय निर्धारण | `ruling-planets.ts` | 13 |

---

## Phase 8: Varshaphal & Tajika Deep Dive (Modules 21-1 to 21-4)

**Engine files:** `tajika-aspects.ts`, `sahams.ts`, `mudda-dasha.ts`, `tithi-pravesha.ts`

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 21-1 | Tajika Aspects — Ithasala, Easarapha, Nakta | ताजिक दृष्टि — इत्थशाल, ईसराफ, नक्त | `tajika-aspects.ts` | 14 |
| 21-2 | Sahams — Sensitive Points (Punya, Vidya, Karma) | सहम — संवेदनशील बिन्दु | `sahams.ts` | 12 |
| 21-3 | Mudda Dasha — Compressed Annual Dasha | मुद्दा दशा — संक्षिप्त वार्षिक दशा | `mudda-dasha.ts` | 13 |
| 21-4 | Tithi Pravesha — The Birthday Chart | तिथि प्रवेश — जन्मदिन कुण्डली | `tithi-pravesha.ts` | 12 |

---

## Phase 9: Computational Astronomy (Modules 22-1 to 22-6)

**Engine files:** `astronomical.ts`, `sunrise.ts`, `panchang-calc.ts`, `solar.ts`

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 22-1 | Julian Day — The Universal Clock | जूलियन दिन — सार्वभौमिक घड़ी | `dateToJD()` | 12 |
| 22-2 | Finding the Sun — Meeus Algorithm Step by Step | सूर्य खोज — Meeus गणित चरणबद्ध | `sunLongitude()` | 15 |
| 22-3 | Finding the Moon — 60 Sine Terms | चन्द्र खोज — 60 ज्या पद | `moonLongitude()` | 15 |
| 22-4 | Sunrise — 2-Pass Hour Angle Method | सूर्योदय — द्विचरणीय गणना | `getSunTimes()` | 14 |
| 22-5 | Moonrise — Parallax, Latitude & Binary Search | चन्द्रोदय — लम्बन, अक्षांश एवं द्विभाजन | `calculateMoonriseUT()` | 14 |
| 22-6 | Equation of Time — Why Clocks Disagree With Sundials | समय समीकरण — घड़ी और धूपघड़ी में अंतर | `getEquationOfTime()` | 12 |

---

## Phase 10: Predictive Techniques (Modules 23-1 to 23-5)

**Engine files:** `eclipses.ts`, `retro-combust.ts`, `chakra-systems.ts`, `sphutas.ts`, `prashna-yogas.ts`

| Module | Title (EN) | Title (HI) | Engine | Minutes |
|--------|-----------|-----------|--------|---------|
| 23-1 | Eclipse Prediction — When Sun, Moon & Nodes Align | ग्रहण — सूर्य, चन्द्र एवं राहु-केतु | `eclipses.ts` | 14 |
| 23-2 | Retrograde & Combustion Windows | वक्री एवं अस्त काल | `retro-combust.ts` | 13 |
| 23-3 | Chakra Systems — Sarvatobhadra & Kota | चक्र पद्धतियाँ — सर्वतोभद्र एवं कोट | `chakra-systems.ts` | 14 |
| 23-4 | Sphutas — Yogi, Avayogi & Sensitive Points | स्फुट — योगी, अवयोगी एवं संवेदनशील बिन्दु | `sphutas.ts` | 12 |
| 23-5 | Prashna Yogas — Horary Combinations | प्रश्न योग — होरारी संयोजन | `prashna-yogas.ts` | 13 |

---

## Execution Order

| Batch | Phases | Modules | Estimated Lines |
|-------|--------|---------|----------------|
| 1 | Phase 5 (Strength) | 18-1 to 18-5 (5 modules) | ~1,400 |
| 2 | Phase 6 (Jaimini) | 19-1 to 19-4 (4 modules) | ~1,100 |
| 3 | Phase 7 (KP) | 20-1 to 20-4 (4 modules) | ~1,100 |
| 4 | Phase 8 (Varshaphal) | 21-1 to 21-4 (4 modules) | ~1,100 |
| 5 | Phase 9 (Astronomy) | 22-1 to 22-6 (6 modules) | ~1,700 |
| 6 | Phase 10 (Predictive) | 23-1 to 23-5 (5 modules) | ~1,400 |
| **Total** | **6 new phases** | **33 modules** | **~7,800 lines** |

After creation:
- Update the learn landing page curriculum to include phases 5-10
- Update the modules index page
- Update stats (50 → 83 modules, 500 → 830 questions, ~650 → ~1080 minutes)

---

## File Structure

All new modules follow: `src/app/[locale]/learn/modules/{id}/page.tsx`

```
src/app/[locale]/learn/modules/
├── 18-1/page.tsx   (Shadbala)
├── 18-2/page.tsx   (Bhavabala)
├── 18-3/page.tsx   (Ashtakavarga)
├── 18-4/page.tsx   (Avasthas)
├── 18-5/page.tsx   (Vimshopaka)
├── 19-1/page.tsx   (Chara Karakas)
├── 19-2/page.tsx   (Rashi Drishti)
├── 19-3/page.tsx   (Argala)
├── 19-4/page.tsx   (Special Lagnas)
├── 20-1/page.tsx   (Placidus Houses)
├── 20-2/page.tsx   (249 Sub-Lords)
├── 20-3/page.tsx   (KP Significators)
├── 20-4/page.tsx   (Ruling Planets)
├── 21-1/page.tsx   (Tajika Aspects)
├── 21-2/page.tsx   (Sahams)
├── 21-3/page.tsx   (Mudda Dasha)
├── 21-4/page.tsx   (Tithi Pravesha)
├── 22-1/page.tsx   (Julian Day)
├── 22-2/page.tsx   (Sun Position)
├── 22-3/page.tsx   (Moon Position)
├── 22-4/page.tsx   (Sunrise Algorithm)
├── 22-5/page.tsx   (Moonrise Algorithm)
├── 22-6/page.tsx   (Equation of Time)
├── 23-1/page.tsx   (Eclipse Prediction)
├── 23-2/page.tsx   (Retrograde/Combustion)
├── 23-3/page.tsx   (Chakra Systems)
├── 23-4/page.tsx   (Sphutas)
└── 23-5/page.tsx   (Prashna Yogas)
```

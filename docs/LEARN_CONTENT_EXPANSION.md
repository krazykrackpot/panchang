# Learn Jyotish — Content Expansion Plan

**Date:** April 3, 2026
**Current state:** 126 learn pages, 89 modules, 5 labs, 31 reference pages
**Target:** Complete Jyotish Shastra coverage — every concept a beginner through advanced practitioner needs

---

## Design Principles

1. **Visual first** — charts, diagrams, SVG illustrations, color-coded tables before text
2. **Zero prior knowledge** — every page starts with "what is this?" in plain language
3. **Mathematical rigour** — show formulas, worked calculations, degree values where relevant
4. **Actionable** — every concept ends with "what to do about it" (remedies, timing, practical use)
5. **Bilingual** — all content in EN + HI via locale ternaries
6. **Linked** — every page connects to the kundali tool, related modules, and other reference pages

---

## Phase A: Critical Practitioner References (Items 1-3)

### A1. Planet-in-House Interpretations
**File:** `/learn/planet-in-house/page.tsx`
**Lines:** ~800+
**Priority:** Critical — the #1 most-consulted reference in Jyotish

Content:
- **Visual:** Interactive grid (9 planets × 12 houses) — click any cell to see the interpretation
- **For each of the 108 combinations:**
  - 2-3 line interpretation covering personality effect, life area impact, and career/relationship implication
  - Strength indicator (natural benefic in kendra = strong, malefic in dusthana = challenging)
  - Classical reference (BPHS chapter)
- **Per-planet section with SVG diagram:**
  - Sun through the 12 houses (with house wheel highlighting current house)
  - Moon through the 12 houses
  - Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
- **Special combinations:** planets in mutual kendras, planets in 6-8 relationship, planets exchanging houses

### A2. Planetary Aspects — Detailed Effects
**File:** `/learn/aspects/page.tsx`
**Lines:** ~500
**Priority:** Critical

Content:
- **Visual:** SVG aspect diagram — show each planet's aspect lines on a chart wheel
  - Jupiter: 5th, 7th, 9th aspects (trine + opposition)
  - Mars: 4th, 7th, 8th aspects (square + opposition + quincunx)
  - Saturn: 3rd, 7th, 10th aspects
  - Others: 7th aspect only
- **Aspect strength:** Full (100%), Three-quarter (75%), Half (50%), Quarter (25%)
- **Aspect-on-planet meanings:**
  - Jupiter aspecting Venus = expanded love/luxury
  - Saturn aspecting Moon = emotional restriction/maturity
  - Mars aspecting Mercury = sharp but aggressive communication
  - etc. for key combinations
- **Aspect-on-house meanings:** What happens when Jupiter aspects your 7th house vs Saturn aspecting it
- **Mathematical note:** Aspect degrees and orbs — how our engine computes aspects

### A3. Complete Remedial Reference
**File:** `/learn/remedies/page.tsx`
**Lines:** ~600
**Priority:** Critical

Content:
- **Visual:** Planet remedy cards with color coding matching each graha's color
- **Per planet (9 sections), each with:**
  - Gemstone: primary + substitute + weight + metal + wearing finger + day to start
  - Beej Mantra: in Devanagari + IAST + meaning + japa count
  - Gayatri Mantra: full text
  - Stotras/Kavach: names of key protective texts
  - Deity: which god to worship
  - Day: fasting day + puja day
  - Color: what to wear/avoid
  - Charity: specific items + recipient + day + time
  - Food: what to eat/avoid during remedy period
  - Direction: which direction to face during mantra/puja
- **Remedy selection flowchart:** SVG decision tree — "Is the planet functional benefic?" → "Is it weak or afflicted?" → "Strengthen or pacify?"
- **When NOT to wear a gemstone:** functional malefic concept explained with examples
- **Mathematical note:** How gemstone weight relates to planet strength (1 carat per Rupa deficit, traditional rule)

---

## Phase B: Practical Prediction Guides (Items 4-8)

### B1. Career Prediction Guide
**File:** `/learn/career/page.tsx`
**Lines:** ~400

- **Visual:** House wheel highlighting 10th house + D10 overlay
- The 5-step career analysis: 10th house sign → 10th lord placement → planets in 10th → D10 analysis → Amatyakaraka
- Career per 10th house sign (Aries 10th = entrepreneurial, Taurus = finance/luxury, etc.)
- Career per planet in 10th (Sun = government, Moon = public service, Mars = engineering/military, etc.)
- D10 Dasamsha reading guide
- Timing: career peaks during 10th lord dasha, Saturn transit over 10th
- Worked example with a real chart

### B2. Marriage Prediction Guide
**File:** `/learn/marriage/page.tsx`
**Lines:** ~400

- **Visual:** Chart with 7th house + D9 Navamsha side by side
- The marriage analysis framework: 7th house → 7th lord → Venus → D9 → Darakaraka → Upapada Lagna
- Spouse personality from 7th house sign
- Timing: Venus/7th lord dasha + Jupiter-Saturn double transit on 7th
- Delay indicators: Saturn aspect, Rahu in 7th, 7th lord in dusthana
- Mangal Dosha assessment with cancellation conditions
- Navamsha compatibility for married couples

### B3. Wealth Prediction Guide
**File:** `/learn/wealth/page.tsx`
**Lines:** ~350

- **Visual:** Wealth triangle diagram (2nd-5th-9th-11th houses highlighted)
- Dhana Yoga identification (2nd+11th lords, Lakshmi Yoga, etc.)
- Income sources per 2nd/11th house sign
- Timing: wealth peaks during 2nd/11th lord dashas
- Ashtakavarga and wealth: SAV in 11th sign
- Poverty indicators and remedies

### B4. Health & Medical Astrology
**File:** `/learn/health/page.tsx`
**Lines:** ~400

- **Visual:** SVG human body with zodiac sign overlays (Aries=head, Taurus=throat, etc.)
- Planet-body part mapping table
- 6th house (disease), 8th house (chronic/surgery), 12th house (hospitalization)
- Health per lagna sign
- Timing of health events: 6th/8th lord dasha periods
- Ayurvedic constitution from chart (Vata/Pitta/Kapha based on dominant elements)

### B5. Children Prediction Guide
**File:** `/learn/children/page.tsx`
**Lines:** ~300

- **Visual:** 5th house + D7 Saptamsha
- Jupiter (Putrakaraka) analysis
- Timing: 5th lord dasha + Jupiter transit over 5th
- Number of children indicators
- Fertility sphutas (Bija/Kshetra) interpretation
- Adoption indicators

---

## Phase C: Planet Behavior Deep Dives (Items 9-11)

### C1. Retrograde Effects Per Planet
**File:** `/learn/retrograde-effects/page.tsx`
**Lines:** ~400

- **Visual:** Orbital diagram showing WHY retrograde happens (Earth overtaking)
- Per planet retrograde meaning:
  - Mercury retrograde (3-4×/year): communication, technology, travel disruptions
  - Venus retrograde (every 18 months): relationship reassessment, ex returns
  - Mars retrograde (every 26 months): stalled projects, revisiting old conflicts
  - Jupiter retrograde (4 months/year): internal wisdom, spiritual re-evaluation
  - Saturn retrograde (4.5 months/year): karmic review, delayed but deeper results
- **Mathematical note:** Retrograde detection algorithm — when planet's daily motion becomes negative
- Cheshta Bala: retrograde planets gain motional strength in Shadbala

### C2. Combustion Effects Per Planet
**File:** `/learn/combustion/page.tsx`
**Lines:** ~300

- **Visual:** Sun with concentric circles showing combustion distances for each planet
- Combustion distances: Moon 12°, Mars 17°, Mercury 14°(12° retro), Jupiter 11°, Venus 10°(8° retro), Saturn 15°
- Effects per planet when combust:
  - Mercury combust: communication unclear, decision-making clouded
  - Venus combust: relationship confusion, lack of aesthetic sense
  - Mars combust: courage suppressed, blood/heat issues
  - Jupiter combust: poor judgment, advisor-less period
  - Saturn combust: discipline breaks, structural collapse
- Remedies for each combust planet

### C3. Transit House-by-House Guide
**File:** `/learn/transit-guide/page.tsx`
**Lines:** ~500

- **Visual:** Animated transit wheel showing Saturn/Jupiter moving through signs
- Saturn transit through each of 12 houses from Moon (with duration ~2.5 years):
  - Saturn in 1st from Moon: self-pressure, health watch
  - Saturn in 7th: relationship tests, partnership changes
  - Saturn in 10th: career peak OR career crisis
  - etc.
- Jupiter transit through each house (duration ~1 year):
  - Jupiter in 5th: children, education, creativity blessed
  - Jupiter in 9th: fortune, travel, spiritual growth
  - etc.
- Rahu-Ketu axis effects (1-7, 2-8, 3-9, etc.)
- Double transit theory: when Jupiter AND Saturn both activate a house → event manifests

---

## Phase D: Advanced & Supporting Content (Items 12-15)

### D1. Hora Guide
**File:** `/learn/hora/page.tsx` — 300 lines
- Planetary hour system, which hora for which activity

### D2. Marana Karaka / Badhaka / Maraka
**File:** `/learn/advanced-houses/page.tsx` — 350 lines
- MKS positions, Badhakesh, 2nd/7th lord as Maraka

### D3. 27 Individual Nakshatra Pages
**Files:** `/learn/nakshatra/[id]/page.tsx` (dynamic) — 300 lines each
- Full personality, career, health, compatibility, deity, gemstone, syllables per nakshatra

### D4. Advanced Compatibility
**File:** `/learn/compatibility/page.tsx` — 400 lines
- Beyond Ashta Kuta: chart-level analysis, Venus comparison, D9 matching

---

## Illustration Strategy

Every page must include at least 2 of these visual elements:

1. **SVG Chart Wheels** — house highlighting, aspect lines, planet placement
2. **Color-coded Tables** — green/amber/red for strong/mixed/weak
3. **Grid Selectors** — click planet × house to see interpretation
4. **Flowchart Diagrams** — decision trees for remedy selection, prediction methodology
5. **Bar Charts** — strength comparisons (Shadbala bars, Ashtakavarga bindus)
6. **Body Maps** — zodiac sign → body part mapping for medical astrology
7. **Timeline Visuals** — dasha periods, transit windows, Sade Sati phases
8. **Orbital Diagrams** — retrograde explanation, combustion distances, aspect geometry

---

## Execution Order

| Batch | Pages | Est. Lines | Priority |
|-------|-------|-----------|----------|
| 1 | A1 (Planet-in-House), A2 (Aspects), A3 (Remedies) | 1,900 | Critical |
| 2 | B1 (Career), B2 (Marriage), B3 (Wealth) | 1,150 | High |
| 3 | B4 (Health), B5 (Children), C1 (Retrograde) | 1,100 | High |
| 4 | C2 (Combustion), C3 (Transit Guide), D1 (Hora) | 1,100 | High |
| 5 | D2 (Advanced Houses), D4 (Compatibility) | 750 | Medium |
| 6 | D3 (27 Nakshatra individual pages) | 8,100 | Medium |
| **Total** | **15 new pages + 27 nakshatra pages** | **~14,100** | |

After completion: **~170 learn pages, 89 modules, 5 labs, 42+ reference pages**

---

## SEO Checklist (per new page)
- [ ] Add to `src/app/sitemap.ts`
- [ ] Add `PAGE_META` entry in `src/lib/seo/metadata.ts`
- [ ] Create `layout.tsx` with `generateMetadata`
- [ ] Verify in build output

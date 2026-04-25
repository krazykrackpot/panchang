# Direction 5: New Computation Verticals — Deep Dive

**Date**: 2026-04-25
**Status**: Deep dive brainstorm
**Priority order**: 5B → 5A → 5D → 5C → 5F

---

## 5B. Medical Astrology & Ayurvedic Correlations

### Classical Foundation

Medical astrology is one of the oldest branches of Jyotish, codified in BPHS Ch.3, Prasna Marga, and Phaladeepika. It maps the natal chart to the physical body through three interlocking systems:

**Planet → Body System (BPHS Ch.3)**
| Planet | Body Systems | Dhatu (Tissue) | Dosha |
|--------|-------------|-----------------|-------|
| Sun | Bones, heart, right eye, stomach, head | Asthi (bone) | Pitta |
| Moon | Blood, mind, left eye, fluids, lungs | Rakta (blood) | Kapha |
| Mars | Marrow, muscles, bile, wounds, genitals | Majja (marrow) | Pitta |
| Mercury | Skin, nervous system, speech, thyroid | Rasa (plasma) | Tridosha (adapts) |
| Jupiter | Fat, liver, ears, pancreas, immune system | Meda (fat) | Kapha |
| Venus | Reproductive, kidneys, throat, hormones | Shukra (reproductive) | Kapha |
| Saturn | Nerves, chronic conditions, teeth, joints, spleen | Asthi (bone) | Vata |
| Rahu | Epidemics, poison, mysterious diseases, allergies | — | Vata |
| Ketu | Sudden ailments, wounds, infections, viruses, skin | — | Pitta |

**House → Body Part (Kaal Purusha)**
| House | Body Region | Disease Domain |
|-------|------------|----------------|
| 1st | Head, brain, general vitality | Constitution, innate health |
| 2nd | Face, right eye, mouth, throat | ENT, dental, speech disorders |
| 3rd | Arms, shoulders, right ear, lungs | Respiratory, upper limb injuries |
| 4th | Chest, heart, breasts, stomach | Cardiac, digestive, emotional |
| 5th | Upper abdomen, mind, stomach | Mental health, digestive, fertility |
| 6th | Lower abdomen, intestines, kidneys | Acute disease, immune response |
| 7th | Reproductive organs, lower back, kidneys | Urogenital, STDs, kidney |
| 8th | Chronic conditions, genitals, anus | Chronic disease, surgeries, death |
| 9th | Hips, thighs | Sciatica, arterial, liver |
| 10th | Knees, joints, spine | Orthopedic, spinal, arthritis |
| 11th | Calves, ankles, left ear | Circulatory, left-side issues |
| 12th | Feet, left eye, sleep | Insomnia, hospitalization, feet |

**Ayurvedic Prakriti Derivation**
- **Vata** (air+ether): Saturn, Mercury (when with Vata planets), Rahu
- **Pitta** (fire+water): Sun, Mars, Ketu
- **Kapha** (earth+water): Moon, Jupiter, Venus

Prakriti is derived from: (1) Lagna sign element, (2) Moon sign element, (3) dominant planet by Shadbala, (4) planets in Lagna, (5) Lagna lord's sign. Weight each factor, compute Vata/Pitta/Kapha percentages.

### Features to Build

#### 5B-1. Prakriti Calculator
**Input**: Existing KundaliData (already computed)
**Computation**:
- Score each dosha (V/P/K) from 5 factors: lagna element, Moon element, strongest planet's dosha, planets in 1st house doshas, lagna lord's sign element
- Weight: Lagna (30%), Moon (25%), Shadbala dominant (20%), planets in 1st (15%), Lagna lord (10%)
- Output: Prakriti type (e.g., "Vata-Pitta" or "Kapha dominant") with percentage breakdown
- Secondary: Vikriti (current imbalance) from transiting malefics over 6th/8th + current dasha lord's dosha

**Display**: Dosha triangle visualization (equilateral triangle with V/P/K at vertices, user's position plotted inside). Ayurvedic constitution card with diet/lifestyle recommendations per dosha type.

#### 5B-2. Body Vulnerability Map
**Input**: KundaliData
**Computation**:
- For each of the 12 houses: check if the house lord is (a) debilitated, (b) combust, (c) in 6/8/12, (d) afflicted by malefics, (e) in Rahu/Ketu axis
- Score vulnerability 0-100 for each body region
- Identify the 2-3 most vulnerable systems
- Cross-reference with planet → body system mapping (afflicted Mars = marrow/muscle risk)

**Display**: Stylized human body silhouette (SVG) with heat zones. Red = high vulnerability, gold = moderate, green = strong. Click a zone → see which planets/houses create the vulnerability and what the classical texts say.

#### 5B-3. Health Timeline
**Input**: KundaliData + transit data
**Computation**:
- 6th lord dasha/antardasha periods = elevated general health risk
- 8th lord dasha periods = chronic condition risk / surgery potential
- Badhaka lord periods = mysterious or hard-to-diagnose ailments
- Transit Saturn over natal 6th/8th = chronic flare-ups
- Transit Rahu over natal Moon = mental health vulnerability windows
- Sade Sati phases = Saturn-related health (joints, chronic, depression)
- Eclipse falling on natal 6th/8th lord = acute health event window

**Display**: Horizontal timeline (next 5-10 years) with colored vulnerability bands. Hover over a band → see which dasha + transit combination creates the risk, and which body system is affected. Health "weather" score per month.

#### 5B-4. Ayurvedic Remedy Engine
**Input**: Prakriti + vulnerability map + current dasha
**Output**: Personalized Ayurvedic recommendations:
- **Diet**: Foods to favor/avoid based on dosha and current imbalance (e.g., "During Mars antardasha with Pitta imbalance: cooling foods, avoid spicy, favor bitter greens")
- **Herbs**: Classical Ayurvedic herbs mapped to planetary afflictions (e.g., Saturn affliction → Ashwagandha for Vata; Mars affliction → Aloe Vera for Pitta)
- **Lifestyle**: Daily routine (Dinacharya) adjustments per current planetary period
- **Yoga Asanas**: Specific asanas for vulnerable body regions (e.g., 10th house vulnerability → knee/spine asanas)
- **Gemstone + Mantra**: Already exists in remedies engine — cross-reference here

**Disclaimer**: Prominent disclaimer that this is traditional knowledge, not medical advice. "Consult a qualified Ayurvedic practitioner and modern physician."

#### 5B-5. Disease Susceptibility Profile
**Input**: KundaliData
**Computation**: Aggregate analysis across all systems:
- Rank body systems by vulnerability score
- Identify "signature diseases" from classical combinations:
  - Mars + Saturn afflicting 4th = cardiac risk
  - Rahu in 5th with afflicted Mercury = anxiety/mental health
  - Saturn in 6th + 6th lord debilitated = chronic digestive
  - Venus afflicted + 7th house problems = urogenital
- Compare with Drekkana (D-3) for disease confirmation (classical technique)

**Display**: Summary card with top 3-5 health focus areas, severity rating, and preventive recommendations. NOT a diagnosis — a "focus your wellness attention here" guide.

### Architecture
- New lib module: `src/lib/medical/`
  - `prakriti.ts` — Dosha calculator
  - `body-map.ts` — House → body region vulnerability scoring
  - `health-timeline.ts` — Dasha + transit health windows
  - `ayurvedic-remedies.ts` — Remedy recommendation engine
  - `disease-profile.ts` — Susceptibility aggregation
  - `constants.ts` — Planet/house/body mapping tables
- New page: `/medical-astrology` (or `/health` or `/ayurveda`)
- New API route: `POST /api/medical` — takes birth data, returns full medical profile
- Dashboard integration: Health card on main dashboard showing current vulnerability score + top recommendation

### Verification Strategy
- Cross-check Prakriti derivation against 5 known charts with known Ayurvedic constitutions
- Verify house → body part mapping against Phaladeepika Ch.26 and Prasna Marga Ch.12
- Consult Ayurvedic practitioner for remedy accuracy (or reference Lad's "Textbook of Ayurveda")

---

## 5A. Mundane Astrology

### Classical Foundation

Mundane astrology predicts events affecting nations, cities, and the collective. Classical sources: Brihat Samhita (Varahamihira), Medini Jyotish texts, and modern mundane astrology (K.N. Rao's "Mundane Astrology").

**Key techniques**:
1. **National Charts**: Cast for the moment a nation gained independence or was founded
2. **Mesha Sankranti (Vernal Ingress)**: Chart for the exact moment Sun enters Aries, cast for a nation's capital. Governs the year ahead for that nation.
3. **Eclipse Charts**: Solar/lunar eclipse charts cast for a capital city predict national events
4. **Jupiter-Saturn Conjunctions**: ~20-year Great Conjunction cycle marking major geopolitical shifts. Classified by element (fire/earth/air/water) based on the sign of conjunction.
5. **Samvatsara Pravesha**: Hindu New Year chart (Chaitra Shukla Pratipada) for a specific location

**House meanings in Mundane context**:
| House | Mundane Signification |
|-------|----------------------|
| 1st | Nation's general condition, people's mood |
| 2nd | National wealth, treasury, economic health |
| 3rd | Communications, transport, neighbors, media |
| 4th | Agriculture, land, real estate, opposition party |
| 5th | Speculation, sports, children/birth rate, entertainment |
| 6th | Public health, military, labor, service sector |
| 7th | Foreign relations, war/peace, treaties, trade partners |
| 8th | Death rate, taxes, debt, occult events, natural disasters |
| 9th | Judiciary, religion, higher education, foreign travel |
| 10th | Government, ruling party, prime minister/president, national prestige |
| 11th | Parliament/legislature, allies, gains, income |
| 12th | Espionage, prisons, hospitals, foreign expenditure, hidden enemies |

### Features to Build

#### 5A-1. Nation Chart Database
**Scope**: 25-30 nations with verified foundation/independence charts:
- **South Asia**: India (Aug 15, 1947, 00:00 IST, Delhi), Pakistan, Sri Lanka, Nepal, Bangladesh
- **Major powers**: USA (Jul 4, 1776, various times debated — offer multiple rectifications), UK, China (Oct 1, 1949), Russia (multiple: 1991 dissolution, 1917 revolution), France, Germany (reunification 1990)
- **Other significant**: Israel, Japan (postwar constitution), Australia, Canada, Brazil, South Africa, EU (Maastricht treaty)
- **Swiss focus**: Switzerland (Aug 1, 1291 — traditional date) — user is Swiss-based

Each entry: date, time (with source/debate notes), coordinates, source reference. Allow users to submit nation charts with citations.

#### 5A-2. Mesha Sankranti Ingress Engine
**Computation**:
- Find exact JD when Sun's sidereal longitude crosses 0° Aries (Lahiri ayanamsha)
- Already have `findSankranti()` in `astronomical.ts` — extend to return precise JD
- Cast a full kundali for that moment at the user's selected capital city
- Generate tippanni-style interpretation using mundane house significations

**Output**: Annual national forecast chart with:
- Lagna (rising sign) = national mood for the year
- 10th house = government stability
- 7th house = foreign relations
- 2nd/11th = economic outlook
- 6th = public health forecast
- 8th = crisis/disaster potential

#### 5A-3. Eclipse Impact on Nations
**Computation**:
- Already have eclipse calendar with local visibility
- For each eclipse: cast a chart for the eclipse moment at a nation's capital
- Determine which natal houses (of the nation chart) are activated
- Classical rule: eclipse in the sign of a nation's natal Moon/Sun = major impact
- Duration of effect: solar eclipse = months (1 month per hour of eclipse), lunar = weeks

**Display**: World map showing eclipse path + nation charts affected. Click a nation → see the eclipse chart overlaid on the national chart with interpretation.

#### 5A-4. Great Conjunction Tracker
**Computation**:
- Jupiter-Saturn conjunction cycle: find all conjunctions from 1800-2100
- Already have Jupiter/Saturn longitudes — iterate to find conjunctions (longitude difference < 1°)
- Classify by element: Fire (Aries/Leo/Sag), Earth (Tau/Vir/Cap), Air (Gem/Lib/Aqu), Water (Can/Sco/Pis)
- ~200-year "Great Mutation" when conjunctions shift elements = civilizational shift

**Display**: Timeline of conjunctions with element color coding. Current conjunction highlighted. Historical annotations: "1842 Earth cycle began → Industrial Revolution. 2020 Air cycle began → Information/AI age."

#### 5A-5. Current Affairs Analyzer
**Input**: User selects a nation + date range
**Computation**:
- Transit planets over the nation's natal chart
- Dasha of the nation (if Vimshottari applicable — debated in mundane, but commonly used)
- Current Mesha Sankranti chart aspects
- Any eclipses activating national chart houses

**Output**: "State of [Nation] — April 2026" report with per-domain analysis (economy, government, foreign relations, public health, etc.)

### Architecture
- New lib module: `src/lib/mundane/`
  - `nation-charts.ts` — Database of 25-30 verified national charts
  - `ingress.ts` — Mesha Sankranti chart generator (wraps existing Sankranti finder + kundali-calc)
  - `eclipse-mundane.ts` — Eclipse impact on nation charts
  - `great-conjunctions.ts` — Jupiter-Saturn conjunction finder + classifier
  - `mundane-interpretation.ts` — Mundane house signification texts + scoring
  - `national-forecast.ts` — Orchestrator: ingress + transits + eclipses → annual report
- New pages: `/mundane` (hub), `/mundane/nations`, `/mundane/[nation]`, `/mundane/ingress`, `/mundane/conjunctions`
- New API route: `GET /api/mundane/forecast?nation=india&year=2026`

### Verification
- Compare India's Mesha Sankranti chart interpretation with K.N. Rao's annual predictions
- Verify Great Conjunction dates against NASA's conjunction tables
- Cross-reference eclipse national impact with historical events (retrospective validation)

---

## 5D. Financial Astrology (Hora Shastra)

### Classical Foundation

Financial astrology draws from Hora Shastra, Dhana Yoga analysis, and modern correlations:

**Wealth Houses**: 2nd (savings, accumulated wealth), 5th (speculation, stocks, luck), 8th (unearned income, inheritance, insurance), 9th (fortune, windfall), 11th (gains, profits)

**Dhana Yogas** (already detected in `yogas.ts`): Lords of 1st, 2nd, 5th, 9th, 11th in mutual relation. But currently detected as static — not timed to activation.

**Planetary Commodity Rulers (Hora Shastra)**:
| Planet | Commodity/Sector |
|--------|-----------------|
| Sun | Gold, government bonds, energy, pharma |
| Moon | Silver, dairy, water, hospitality, liquids |
| Mars | Real estate, metals, defense, surgery, iron/steel |
| Mercury | Communication, tech, media, trading, textiles |
| Jupiter | Finance, banking, education, religion, consulting |
| Venus | Luxury goods, entertainment, automobiles, beauty, diamonds |
| Saturn | Agriculture, mining, oil, infrastructure, labor |
| Rahu | Foreign currency, crypto, airlines, unconventional |
| Ketu | Spirituality sector, recycling, hidden resources |

### Features to Build

#### 5D-1. Wealth Yoga Activation Timeline
**Input**: KundaliData (Dhana Yogas already detected)
**Computation**:
- For each detected Dhana Yoga: identify the yoga-forming planets
- A yoga "activates" when: (a) dasha/antardasha of one of its planets is running, AND (b) transit Jupiter or Saturn aspects one of its planets or their signs
- Score activation intensity: both conditions met = strong, one condition = moderate
- Map to timeline: next 10 years of activation windows

**Display**: Timeline with Dhana Yoga activation bands. Green = strong activation, amber = moderate. Click → see which yoga, which planets, and recommended action ("This is a favorable period for long-term investments involving [sector]").

#### 5D-2. Personal Financial Windows
**Input**: KundaliData + current transits
**Computation**:
- Best periods for: investment (5th/11th activation), property (4th lord + Mars activation), business launch (10th + 7th activation), salary negotiation (10th + 2nd), debt repayment (6th lord transit)
- Score each month of the next year on a 1-10 scale per activity
- Factor in: Mercury retrograde (avoid new contracts), Jupiter transit (expansion windows), Saturn transit (consolidation periods)

**Display**: 12-month financial calendar with color-coded scores per activity. Drill into any month for detailed explanation.

#### 5D-3. Hora-Based Activity Guide
**Input**: Current location + date
**Computation**: Already have Hora calculator — extend with financial meaning:
- Sun Hora: government dealings, gold transactions
- Moon Hora: silver, real estate viewings
- Mars Hora: property decisions, stock selling (assertive action)
- Mercury Hora: signing contracts, tech purchases, trading
- Jupiter Hora: banking, financial planning, investments
- Venus Hora: luxury purchases, art, entertainment investments
- Saturn Hora: insurance, long-term bonds, agriculture

**Display**: Today's Hora table with financial annotation per hour. "Current Hora: Jupiter (14:30-15:30) — Favorable for banking and financial planning."

#### 5D-4. Mercury Retrograde Financial Calendar
**Input**: Retrograde calendar (already computed)
**Computation**:
- Mercury retrograde periods marked with financial warnings
- Pre-retrograde shadow + post-retrograde shadow periods
- Personal impact: which natal house does Mercury retrograde transit through in the user's chart?
- Specific guidance: "Mercury retrogrades through your 2nd house (May 12-Jun 4) — avoid major financial commitments, review existing contracts"

**Display**: Annual calendar view with retrograde zones shaded. Personal impact overlay.

#### 5D-5. Annual Financial Forecast
**Input**: KundaliData + Varshaphal
**Computation**:
- Month-by-month financial outlook combining:
  - Transits over 2nd/5th/8th/11th houses (from existing Gochara engine)
  - Dasha lord's relationship to wealth houses
  - Varshaphal Sahams: Punya Saham, Karma Saham placement
  - Tajika yogas involving 2nd/5th/11th lords
- Overall year financial rating: "Accumulation year" / "Consolidation year" / "Cautious year"

**Display**: 12-month financial dashboard with trend line, per-month drill-down, and actionable guidance.

### Architecture
- New lib module: `src/lib/financial/`
  - `dhana-activation.ts` — Yoga activation timing engine
  - `financial-windows.ts` — Monthly financial scoring
  - `hora-finance.ts` — Hora + commodity mapping
  - `retrograde-finance.ts` — Mercury retrograde financial impact
  - `annual-financial.ts` — Orchestrator for year forecast
  - `constants.ts` — Planet-commodity mappings, wealth house definitions
- New pages: `/financial-astrology` (hub), `/financial-astrology/calendar`, `/financial-astrology/forecast`
- Dashboard integration: "Financial Outlook" card with current month score + top recommendation

### Verification
- Backtest: apply Dhana Yoga activation rules to 5 known charts with known financial event dates
- Compare Mercury retrograde periods with actual market volatility data (publicly available)
- Spot-check Hora times against existing Hora page output

---

## 5C. Nadi Jyotish (Bhrigu Nandi Nadi)

### Classical Foundation

Bhrigu Nandi Nadi (BNN) is a planet-in-sign predictive system attributed to Sage Bhrigu. Unlike Parashari Jyotish which emphasizes house lordship, BNN reads planets' sign placements directly and chains modifiers. The key texts: R.G. Rao's "Bhrigu Nandi Nadi" and C.S. Patel's compilations.

**Core principle**: Each planet in each of the 12 signs has a base prediction. This is modified by:
1. Which planets aspect the planet (Parashari drishti)
2. Which planets are conjunct
3. The sign placement of the dispositor (sign lord)
4. Retrograde status

**Example BNN reading chain**:
- "Jupiter in Aries" → base prediction (leadership, teaching, independent spirit)
- + "aspected by Saturn" → delays in fortune, late success, disciplined teacher
- + "Mercury in 3rd from Jupiter" → writing ability, communication of spiritual knowledge
- + "dispositor Mars in Leo" → courage in action, military or sports connection
- = Combined prediction unique to this specific configuration

**Past life indicators** (unique to Nadi):
- Ketu's sign + house = past life karma carried forward
- 5th house/lord = Purva Punya (past life merit)
- 9th house/lord = past life dharma
- D-60 (Shashtiamsha) = most detailed past-life indicator

### Features to Build

#### 5C-1. BNN Rule Engine
**Architecture**: A rule database, not hardcoded logic.
- 9 planets × 12 signs = 108 base predictions
- Each base prediction has modifier chains: +aspect from each planet (9 modifiers), +conjunction with each planet (8 modifiers), +dispositor in each sign (12 modifiers), +retrograde variant
- Total rule space: ~108 base + ~10,000+ modifier combinations
- Implementation: JSON rule database with layered evaluation — base → aspects → conjunctions → dispositor → retrograde

**Computation**:
```
For each planet:
  1. Look up base BNN prediction for planet-in-sign
  2. Check aspects → layer modifier predictions
  3. Check conjunctions → layer modifier predictions  
  4. Check dispositor sign → layer modifier prediction
  5. Check retrograde → layer modifier prediction
  6. Synthesize into a narrative paragraph
```

#### 5C-2. Karmic Profile (Past Life Reading)
**Input**: KundaliData
**Computation**:
- Ketu's sign + house = primary past-life indicator
- 5th lord placement = Purva Punya theme
- 9th lord placement = dharmic inheritance
- Planets in 5th/9th = karmic talents carried forward
- D-60 (already computed via nadi-amsha.ts) = detailed karma type
- BNN rules for Ketu specifically (Ketu in each sign = specific past-life story)

**Output**: "Your Karmic Story" — a narrative reading that connects past life themes to present life patterns. Not fortune-telling but self-reflection tool.

#### 5C-3. BNN Predictive Sequences
**Input**: KundaliData
**Computation**:
- For each of the 9 planets: generate the full BNN reading with all modifier chains
- Identify convergence patterns: when multiple BNN readings point to the same life theme
- Time activation: BNN predictions activate during the dasha/antardasha of the involved planets

**Display**: Planet-by-planet BNN readings, with a "Life Themes" summary showing where multiple planets' readings converge (e.g., "3 of your 9 planet readings indicate a strong connection to education/teaching").

#### 5C-4. Parashari vs BNN Comparison
**Display**: Side-by-side view:
- Left: Traditional Parashari interpretation (from existing tippanni)
- Right: BNN interpretation
- Highlight agreements and divergences
- "Both systems agree that Mercury's placement indicates [X]" / "Parashari sees Jupiter as 5th lord (children), while BNN reads Jupiter in Virgo as analytical spiritual practice"

### Architecture
- New lib module: `src/lib/nadi/`
  - `bnn-rules.ts` — Base prediction database (108 entries)
  - `bnn-modifiers.ts` — Aspect/conjunction/dispositor modifier database
  - `bnn-engine.ts` — Chain evaluation engine
  - `karmic-profile.ts` — Past life computation
  - `bnn-synthesis.ts` — Narrative generator from raw BNN data
- Rule data: `src/lib/constants/bnn-predictions.ts` — large JSON dataset (108 base × modifiers)
- New page: `/nadi-jyotish` (or extend kundali page as a new tab)
- This could also be a premium/Jyotishi-tier feature given its depth

### Verification
- Compare BNN readings against R.G. Rao's published example charts
- Cross-reference 5 charts with known life events to check if BNN predictions match retrospectively
- Have a Nadi practitioner review 3-5 sample outputs

---

## 5F. Tajika Expansion (Maasaphal, Dinaphal, Varshesha Dasha)

### Classical Foundation

The existing Varshaphal implementation covers the annual chart completely. What's missing is the sub-periodic analysis that Tajika provides:

**Maasaphal (Monthly Chart)**: For each lunar month within the Varshaphal year, a chart is cast when the Sun returns to the same degree it held at the annual solar return. This gives month-level predictions within the year context.

**Dinaphal (Daily Chart)**: Theoretically, a chart for each day when the Moon returns to its annual-chart degree. In practice, this is used only for very specific questions ("Is today good for X?") within the Varshaphal context.

**Varshesha Dasha**: An alternative to Mudda Dasha. Computed from the Year Lord (Varsheshvara, already computed). Divides the year into planetary periods based on the year lord's relationship to other planets. Some practitioners prefer this to Mudda.

**Patyayini Dasha**: Another Tajika dasha. Computed from the number of degrees each planet has traversed in its sign in the annual chart. Each planet gets a period proportional to its traversed degrees.

**Full 16 Yogas in Monthly Context**: The 16 Tajika yogas (Ithhasala, Ishrafa, Nakta, Yamaya, etc.) already detected in the annual chart — apply them to each Maasaphal chart for month-level yoga analysis.

### Features to Build

#### 5F-1. Maasaphal Engine
**Computation**:
- From the Varshaphal solar return moment, find 12 subsequent moments when the Sun returns to the same sidereal degree (approximately every ~30.44 days, but must be computed precisely)
- For each moment: cast a full chart at the birth location
- Apply all 16 Tajika yogas to each monthly chart
- Compute Muntha progression for the month
- Generate month-level predictions: which houses are activated, which yogas form

**Display**: 12-month Maasaphal grid. Click any month → see the monthly chart, yogas, and interpretation. Integrate with the existing Annual Forecast page for a layered view (annual → monthly → daily).

#### 5F-2. Varshesha Dasha
**Computation**:
- Year Lord already computed in `varsheshvara.ts`
- Divide the 365-day year into planetary periods based on Varshesha Dasha rules:
  - The Year Lord gets the largest period
  - Remaining planets get periods proportional to their relationship to the Year Lord (friend/neutral/enemy) and their dignity in the annual chart
- Each period gets an interpretation based on the dasha lord's house placement in the Varshaphal chart

**Display**: Timeline visualization alongside Mudda Dasha. User can toggle between the two systems. Interpretation for the current period.

#### 5F-3. Patyayini Dasha
**Computation**:
- For each planet in the Varshaphal chart: compute degrees traversed in current sign (longitude % 30)
- Total traversed degrees across all planets = denominator
- Each planet's period = (its traversed degrees / total) × 365.25 days
- Order: by traversed degrees, highest first

**Display**: Alongside Mudda and Varshesha. Three dasha systems for the same year — practitioners can compare.

#### 5F-4. Dinaphal (Daily Tajika)
**Computation**:
- For any specific date: find the moment Moon returns to its Varshaphal-chart degree
- Cast chart for that moment at birth location
- Apply Tajika yogas
- Generate one-paragraph daily prediction within the Varshaphal year context

**Display**: Calendar integration — click any day in the Maasaphal month view → see Dinaphal. Not pre-computed for all 365 days (too heavy) — computed on demand.

### Architecture
- Extend `src/lib/varshaphal/`:
  - `maasaphal.ts` — Monthly chart computation
  - `varshesha-dasha.ts` — Varshesha Dasha calculation
  - `patyayini-dasha.ts` — Patyayini Dasha calculation
  - `dinaphal.ts` — Daily chart computation
- Extend Varshaphal page with tabbed view: Annual → Monthly → Daily
- Extend existing API: `POST /api/varshaphal` returns monthly charts when `?detail=monthly` is passed

### Verification
- Cross-check Maasaphal Sun-return moments against Jagannatha Hora software (free, widely used by Tajika practitioners)
- Verify Varshesha/Patyayini dasha periods against K.K. Pathak's "Tajika Neelakanthi" reference calculations
- Spot-check monthly Tajika yogas: if Ithhasala forms in month 3, verify the planet longitudes manually

---

## Implementation Order Recommendation

### Phase 1: Medical Astrology (5B) — 2-3 weeks
Highest impact, broadest audience. Builds on existing KundaliData. No new astronomical computations needed — purely interpretation + scoring over existing data. Ship as a standalone page + dashboard card.

### Phase 2: Financial Astrology (5D) — 2 weeks
Second broadest appeal. Mostly scoring/interpretation over existing Dhana Yogas + Gochara + Hora. The Dhana Yoga activation timeline is the hero feature. Ship as a standalone page + dashboard card.

### Phase 3: Mundane Astrology (5A) — 3-4 weeks
Requires building the nation chart database (research-heavy). Ingress engine is a thin wrapper around existing computation. Great Conjunction tracker is straightforward. Ship as a new section with its own nav entry.

### Phase 4: Tajika Expansion (5F) — 2 weeks
Extends existing Varshaphal infrastructure. Maasaphal is the main engineering work (finding precise Sun-return moments for each month). Varshesha and Patyayini dashas are formula implementations. Ship as tabs within the existing Varshaphal page.

### Phase 5: Nadi Jyotish (5C) — 4-6 weeks
Largest content effort — the BNN rule database (108 base predictions × modifiers) requires careful research and writing. Engine is straightforward but the data is the bottleneck. Ship as a new kundali tab or standalone page.

---

## Cross-Cutting Concerns

**i18n**: All new features need translations in EN, HI, TA, BN (4 active locales). Medical/Ayurvedic terms have excellent Sanskrit roots that translate naturally.

**Disclaimers**: Medical astrology and financial astrology MUST have prominent disclaimers. "This is traditional Vedic knowledge for self-awareness, not medical/financial advice."

**Premium gating**: Consider making some features premium (Jyotishi tier):
- Full BNN reading (free: summary, paid: full chain analysis)
- Annual financial forecast (free: overview, paid: monthly detail)
- Mundane nation analysis (free: ingress chart, paid: full national forecast)

**Testing**: Each new computation module needs Vitest tests comparing output against published reference charts. Minimum 3 charts per module verified against classical text examples or Jagannatha Hora.

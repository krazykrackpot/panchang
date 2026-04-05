# Classical Jyotish Texts — Gap Analysis & Implementation Roadmap

*Last updated: 2026-04-05*

This document surveys every major classical Vedic astrology text, maps each technique to the current application state, and defines a prioritised implementation backlog. The goal is to ensure the application faithfully represents the full classical canon — not just the most popular 20% of techniques.

---

## How to Read This Document

- **Status: ✅ Done** — fully implemented with UI
- **Status: ⚡ Partial** — calculated but no dedicated UI or interpretation
- **Status: ❌ Missing** — not implemented at all
- **Priority: P1** — high user value, common in practice
- **Priority: P2** — medium value, specialist use
- **Priority: P3** — niche / academic

---

## 1. BRIHAT PARASHARA HORA SHASTRA (BPHS)

The foundational text. 97 chapters. Everything in Parashari Jyotish traces to here.

### 1.1 Chart Construction (Ch. 1–11)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| D1 Rashi Chart | Basic natal chart | ✅ Done | — |
| Saptavarga (7 charts) | D1, D2, D3, D7, D9, D12, D30 | ✅ Done | — |
| Shodasavarga (16 charts) | Full set D1–D60 | ✅ Done (17 charts) | — |
| Vimshopaka Bala | 20-point divisional strength | ✅ Done | — |
| Bhava Chalit | True house cusps vs rashi | ✅ Done | — |
| Equal House system | Standard house division | ✅ Done | — |
| **Sudarshana Chakra** | Triple-wheel: Lagna + Moon + Sun superimposed. Each ring is read independently for personality (Lagna), mind (Moon), soul (Sun). Predictions require agreement from ≥2 rings. | ❌ Missing | P1 |
| **Mrityu Bhaga** | "Death degree" — one specific degree in each sign for each planet. When a planet transits or is natally placed there, it is severely weakened. 108 values (9 planets × 12 signs) from Narada Purana. | ❌ Missing | P1 |
| **Hora Chart Interpretation** | D2 is calculated but not interpreted. Odd hora = Solar (male, father, right side of body, wealth from self). Even hora = Lunar (female, mother, left side). Planet in own hora gives full results of that bhava. | ⚡ Partial | P1 |
| **Drekkana Faces** | Each drekkana (10° arc) has a pictorial "face" (human, serpent, dog, etc.) from Brihat Samhita/BPHS. Decanate interpretation affects physique and temperament. | ❌ Missing | P2 |

### 1.2 Graha Properties (Ch. 3–4)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Natural dignities | Exaltation, debilitation, own sign | ✅ Done | — |
| Combustion (Astangata) | Planet within orb of Sun | ✅ Done | — |
| **Graha Yuddha (Planetary War)** | When two planets are within 1° of each other. The planet with lower ecliptic latitude "wins". Losing planet loses up to 25% of Shadbala. Current implementation notes war in Kala Bala but does not show a dedicated war analysis or winner/loser determination with functional effects. | ⚡ Partial | P1 |
| **Retrogression effects by planet** | Different planets retrograde differently: Mars retro = revisited aggression/property; Mercury retro = communication/contracts; Venus retro = relationships revisited; Saturn retro = karma accelerated. Currently just marked "retro" with no planet-specific interpretation. | ⚡ Partial | P1 |
| **Vargottama** | Planet in same sign in D1 and D9. Immensely strengthened — acts as if doubly exalted. Should be prominently flagged in chart display and in tippanni. | ⚡ Partial | P1 |
| **Pushkar Navamsha** | Specific Navamsha positions (2 per sign × 12 = 24 positions) considered most auspicious. Planet here is greatly benefited. From Saravali/BPHS. | ❌ Missing | P2 |
| **Pushkar Bhaga** | The specific degree within each sign that is most auspicious. One degree per sign = 12 degrees total. Useful for muhurta (place Moon on Pushkar Bhaga) and chart analysis. | ❌ Missing | P2 |

### 1.3 Strengths (Ch. 26–33)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Shadbala (6 components) | Full 6-part strength | ✅ Done | — |
| Bhava Bala | House strength | ✅ Done | — |
| **Ishta/Kashta Phala** | Beneficial vs harmful potential from Shadbala. Ishta = square root of (Uccha Bala × Cheshta Bala). Kashta = inverse. Calculated but not displayed or interpreted. | ⚡ Partial | P1 |
| **Graha Avastha — Jagrit/Swapna/Sushupti** | Awake/Dream/Sleep states based on house position. Planet in angle = awake (full results), succedent = dreaming (half results), cadent = sleeping (quarter results). Already partially in avasthas but not shown as a simple "delivery percentage". | ⚡ Partial | P1 |
| **Dik Bala direction display** | Sun/Jupiter strong in East (1H), Moon/Venus in North (4H), Saturn in West (7H), Mars/Mercury in South (10H). A compass diagram showing each planet's directional strength would make this tangible. | ⚡ Partial | P2 |

### 1.4 House Results (Ch. 12–25)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Planet-in-house tippanni | All 9×12 combinations | ✅ Done | — |
| Planet-in-sign tippanni | All 9×12 combinations | ✅ Done | — |
| **Bhava + Planet lord + Occupant combined** | Classical prediction: evaluate (1) bhava itself, (2) lord of bhava, (3) occupants of bhava, (4) aspects on bhava. App does these separately but never synthesises into a single "house reading" paragraph. | ⚡ Partial | P1 |
| **Argala & Virodha** | Done but only shown as raw table. Needs interpretive summary: "Your 7th house has strong Argala from Jupiter — marriage is actively supported." | ⚡ Partial | P1 |

### 1.5 Yoga Combinations (Ch. 34–41)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| 127 yogas detected | Raja, Dhana, Daridra, etc. | ✅ Done | — |
| **Nabhas Yogas (32 types)** | Based on distribution of planets across house types (Ashraya, Dala, Akriti yogas). All 32 are in the text. Sankhya yogas (Gola, Yuga, Shoola, Kedara, Pasha, Dama, Veena) count planets in 1, 2, 3, 4, 5, 6, 7 signs. | ⚡ Partial | P2 |
| **Nabhasa Yoga interpretations** | The distribution yogas above are detected but without life-quality interpretation. "Kedara Yoga (planets in 4 signs): native earns living through agriculture or land" — these classical meanings are missing. | ❌ Missing | P2 |

### 1.6 Dasha Systems (Ch. 42–50)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Vimshottari (3 levels) | Maha/Antar/Pratyantar | ✅ Done | — |
| 20 additional dashas | Yogini, Kalachakra, etc. | ✅ Done | — |
| **Sookshma Dasha (Level 4)** | 4th level of Vimshottari subdivision. Calculated from Pratyantar further divided proportionally. Extremely precise event timing. | ❌ Missing | P2 |
| **Prana Dasha (Level 5)** | 5th level. Days-level precision. Used for exact date of events. | ❌ Missing | P3 |
| **Dasha Sandhi (junction period)** | 3–6 months before/after Mahadasha change are unstable. Should be flagged in the timeline as "transition zone — avoid major decisions". | ❌ Missing | P1 |
| **Antardasha compatibility** | When the Mahadasha lord and Antardasha lord are mutual friends → excellent period; enemies → difficult. Currently calculated but not surfaced as a compatibility score. | ⚡ Partial | P1 |
| **Dasha Bhukti activation** | Which houses does the current Dasha/Bhukti activate? Lord of Maha rules certain houses; Lord of Antar rules others. The houses activated define what life areas are triggered. | ⚡ Partial | P1 |

### 1.7 Ashtakavarga (Ch. 66)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Ashtakavarga display | 7-planet bindu scores | ✅ Done | — |
| **Sarvashtakavarga total** | Sum of all 7 bindus per sign. 25+ = strong, below 20 = weak. Transit Jupiter through a sign with 30+ bindus = exceptional year. | ⚡ Partial | P1 |
| **Ashtakavarga transit timing** | When a planet transits a sign, count its own bindus in that sign. 4+ = good transit, 0–2 = difficult. This should be shown on the transit calendar. | ⚡ Partial | P1 |
| **Trikona Shodhana** | Subtract weakest of 3 trikona values from all three. Then Ekadhipatya Shodhana (single-lord signs). Reduces Ashtakavarga to its essential signal. | ❌ Missing | P2 |
| **Ashtakavarga Dasha activation** | During a planet's Mahadasha, its bindus in the sign it transits predict the quality of that sub-period. | ❌ Missing | P2 |

### 1.8 Longevity (Ch. 41–45)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Pindayu** | Longevity from planetary degrees in D1. Sun contributes up to 19 years, Moon 25 years, Mars 15 years, Mercury 12 years, Jupiter 15 years, Venus 21 years, Saturn 20 years. Total adjusted by combustion/retrogression/aspects. | ❌ Missing | P2 |
| **Amsayu** | Longevity from Navamsha positions — each planet contributes years based on its Navamsha sign lord's strength. | ❌ Missing | P2 |
| **Nisargayu** | Natural lifespan baseline (Sun = 20y, Moon = 1y, Mars = 2y, Mercury = 9y, Jupiter = 18y, Venus = 20y, Saturn = 50y). Sum = 120 years (Vimshottari period). | ❌ Missing | P3 |
| **Maraka Planets** | 2nd and 7th lord are Marakas (death-inflicting). Planets in 2nd and 7th reinforce this. Planets associated with Marakas in dasha can indicate health crises. Critical for medical astrology. | ❌ Missing | P1 |

### 1.9 Remedies (Ch. 87–97)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Basic remedies (gems, mantras) | Per-planet remedies | ✅ Done | — |
| **Mantra prescription by affliction type** | Different afflictions need different mantras: Rahu affliction → Durga Saptashati, not just Rahu Beej mantra. Saturn in 7th for marriage → Shani Stotra + Parvati worship. Contextual, not generic. | ❌ Missing | P2 |
| **Dana (charity) by planet and day** | Specific items to donate: Sun → wheat/jaggery on Sunday; Moon → rice/white cloth on Monday, etc. With charitable organisations or priests. | ❌ Missing | P2 |
| **Graha Shanti Puja** | Full puja procedure for each planet with specific materials, mantras, number of repetitions (Sun = 7000 repetitions of Gayatri). | ❌ Missing | P3 |

---

## 2. JAIMINI SUTRAS

Jaimini's system differs fundamentally from Parashara. It uses sign aspects (not planetary aspects), Chara Karakas, and rasi dashas.

### 2.1 Jaimini Aspects (Rashi Drishti)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Chara Karakas (AK–DK) | 7 planet-based significators | ✅ Done | — |
| Karakamsha analysis | AK's Navamsha sign | ✅ Done (basic) | — |
| Arudha Padas A1–A12 | House reflection points | ✅ Done | — |
| Chara Dasha | Sign-based periods | ✅ Done | — |
| **Rashi Drishti (Sign aspects)** | Fixed movable signs aspect all fixed signs and vice versa; dual signs aspect each other. Completely different from Parashari aspects. Crucial for Jaimini — the entire system runs on rashi drishti, not graha drishti. Currently not computed separately. | ❌ Missing | P1 |
| **Jaimini Rajayogas** | From Karakamsha: AK+AmK in kendra/trikona = Rajayoga; 5H from AK having certain planets = specific career outcomes. More than 20 distinct Jaimini Rajayogas. | ⚡ Partial | P1 |
| **Upapada Lagna (UL) analysis** | A7 — Arudha of 12th house. Shows the spouse you will attract (vs. Navamsha which shows marriage quality). UL lord's placement = spouse's profession, nature. 7th from UL = the relationship's public image. | ⚡ Partial | P1 |
| **Darapada (A7) vs Upapada** | A7 (Darapada) and UL (Upapada = A12) are distinct: Darapada = desire for spouse, Upapada = actual marriage. App conflates these. | ❌ Missing | P1 |
| **Narayana Dasha interpretation** | Calculated but interpretation is generic. Jaimini prescribes: count from Narayana Dasha sign to various lords to predict specific outcomes. The 9th sign from Dasha sign shows father; 5th shows children. | ⚡ Partial | P2 |
| **Pada Lagna (AL) predictions** | Arudha Lagna (A1) shows your public image/reputation. If AL lord is in 2H from AL = wealthy public image. If malefics in AL = reputation suffers. App calculates A1 but doesn't give dedicated "reputation analysis" from AL. | ⚡ Partial | P1 |
| **Shoola Dasha interpretation** | Shoola Dasha from trikona signs, used for longevity and death-related timing. Calculated but no interpretation. | ⚡ Partial | P2 |
| **Brahma, Rudra, Maheshwara planets** | Three special longevity planets in Jaimini. Brahma (from 6H/8H/12H lording), Rudra (from 8H), Maheshwara (strongest planet). Used for timing life crises. | ❌ Missing | P2 |
| **Pada compatibility in matching** | Compare A7 of groom with Moon of bride, and vice versa. More accurate than standard Guna Milan for actual attraction. | ❌ Missing | P2 |
| **Swamsha (Karakamsha lagna) detailed** | Full Jaimini predictions from Swamsha: Ketu in Swamsha = moksha tendency; Venus in Swamsha = artistic career; Mars + Rahu in Swamsha = weapons/surgery; Mercury + Ketu = mathematics/occult. 50+ combinations. | ⚡ Partial | P1 |

---

## 3. BRIHAT JATAKA (VARAHAMIHIRA)

Written ~550 CE. More systematic than BPHS in some areas; differs in hora interpretation and yogas.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Drekkana Decans (Faces)** | Each 10° section of the zodiac has a specific pictorial description that affects physical appearance and life events. 36 faces × 3 categories (rising, culminating, setting). | ❌ Missing | P3 |
| **Hora (D2) gender analysis** | Varahamihira is more explicit: odd signs have masculine hora (Sun-ruled); even signs have feminine hora (Moon-ruled). Planet in its own-gender hora delivers results of its house fully. Planet in opposite-gender hora delivers 50% results. | ⚡ Partial | P1 |
| **Panchavargeya Bala** | 5-chart dignity score (different from Saptavargaja). Uses D1, D2, D3, D9, D12. Each chart gives a score from 0–5. Total 0–25 indicates planet quality. | ❌ Missing | P2 |
| **Outer planet aspect strength decay** | Varahamihira specifies that Mars's 4H/8H aspect = 75% strength; Jupiter's 5H/9H = 75%; Saturn's 3H/10H = 50%. App applies full-strength aspects for all. | ⚡ Partial | P2 |
| **Planetary physique contributions** | Varahamihira gives body characteristics from planets: Sun = honey-coloured eyes, bilious constitution; Moon = round body, pale; Saturn = tall, lean, dark. Can be surfaced in personality/physical description. | ❌ Missing | P3 |

---

## 4. PHALADEEPIKA (MANTRESHWARA)

Written ~1100 CE. Practical and accessible. Adds unique techniques for reading results.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Functional malefic/benefic per lagna** | Laghu Parashari concept formalised here: for Aries lagna, Mercury is malefic; for Taurus lagna, Venus is both lagna lord + 6th lord (mixed). Functional nature governs yoga strength. | ⚡ Partial | P1 |
| **Yoga Karaka identification** | A planet that owns both a kendra and a trikona = Yoga Karaka (most powerful benefic). For Taurus lagna, Saturn owns 9H + 10H = supreme Yoga Karaka. App detects some of these in yogas but not systematically per lagna. | ⚡ Partial | P1 |
| **Vosi/Vasi/Ubhayachari Solar Yogas** | Planets (except Moon) in the 2nd from Sun = Vosi Yoga; in 12th from Sun = Vasi Yoga; in both = Ubhayachari Yoga. Each gives wealth/intelligence. | ⚡ Partial | P2 |
| **Sunafa/Anafa/Durudhura Lunar Yogas** | Planets in 2nd from Moon = Sunafa (wealth); 12th from Moon = Anafa (fame); both = Durudhura (prosperity). Kemadruma = no planet in 2nd/12th from Moon (poverty of mind). | ✅ Done | — |
| **Sakata Yoga** | Moon in 6/8/12 from Jupiter. Financial ups and downs, wheel of fortune. Already detected but interpretation can be richer. | ✅ Done | — |
| **Kalasarpa Yoga** | All planets between Rahu and Ketu. Detected. Needs sub-type: Anant (Rahu in 1H), Kulika (2H), Vasuki (3H)... 12 sub-types, each with distinct implications. | ⚡ Partial | P1 |
| **Graha Dristi percentage** | Phaladeepika gives precise aspect percentages: full (100%), 3/4 (75%), 1/2 (50%), 1/4 (25%). Only full aspects currently shown. | ⚡ Partial | P2 |

---

## 5. SARAVALI (KALYANA VARMA)

~800 CE. Extremely detailed on individual planet-in-sign and planet-in-house results. Also covers Drekkana results.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Drekkana chart results** | Saravali gives specific results for each planet in each of the 36 drekkanas. "Sun in 1st drekkana of Aries = fearless, proud, commanding." 9 × 36 = 324 combinations. | ❌ Missing | P2 |
| **Planetary combinations (2-planet)** | Saravali lists results for every pair of planets in conjunction for each sign: "Sun + Moon in Aries = short-lived but ambitious." 9C2 × 12 = 540 combinations. | ❌ Missing | P2 |
| **Hora results in detail** | More granular than BPHS: Saravali gives wealth manifestation, timing of gains, body side affected by disease based on hora. | ⚡ Partial | P3 |
| **Varga results for specific divisions** | D4 (Chaturthamsha): planetary position predicts vehicle type, home ownership timing. D7 (Saptamsha): specific child prediction (1st planet in 5H = 1st child's nature). | ❌ Missing | P2 |

---

## 6. UTTARA KALAMRITA (KALIDASA)

~12th century. Introduces several unique techniques not in earlier texts.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Bhrigu Bindu** | Midpoint between Rahu and Moon (add longitudes, divide by 2). A highly sensitive point. Transiting Jupiter over Bhrigu Bindu = major positive event. Saturn over it = crisis. Used for timing. | ❌ Missing | P1 |
| **Bhrigu Chakra Paddhati (BCP)** | Jupiter's annual transit counted from birth Jupiter position activates specific houses each year (1st year = house of natal Jupiter, 2nd year = next house, etc.). Gives year-by-year house activation. | ❌ Missing | P1 |
| **Kalidasa's house significators** | Extended Karakatwas for houses beyond BPHS: 3H also governs "editing, short writing"; 5H includes "past life merits" (Poorva Punya); 8H includes "tantric knowledge". | ❌ Missing | P3 |
| **Extended Rahu/Ketu significations** | Kalidasa gives Rahu = paternal grandfather, foreign lands, outcasts, computers (modern interpreters); Ketu = maternal grandfather, moksha, surgeons, engineers. | ⚡ Partial | P2 |

---

## 7. PRASNA MARGA (KERALA TRADITION)

The definitive horary text. Written ~1649 CE. Goes far beyond standard Prashna.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Ashtamangala Prashna | 8-element horary | ✅ Done | — |
| **Kerala Prashna Chakra** | At the moment of query, examine the Lagna, Moon, and the planet the querent touches/mentions first. Cross-reference with 12 house significations. Unique Kerala methodology. | ❌ Missing | P2 |
| **Pancha Pakshi Shastra (5-bird system)** | Five birds (Vulture, Owl, Crow, Cock, Peacock) govern 5-day cycles. Each bird has 5 sub-activities (ruling, eating, walking, sleeping, dying). The sub-activity at a given moment determines outcome of any action. Entirely separate from nakshatra system. Input: birth nakshatra (determines bird), query date/time/location. | ❌ Missing | P1 |
| **Prashna Arudha** | Derive Arudha from Prashna chart (not natal). The Prashna Arudha shows the current public reality of the question. | ❌ Missing | P2 |
| **Nimitta interpretation** | Omens at time of query: direction querent faces, sounds heard, people/animals encountered. The text gives interpretive tables. Relevant for a modern app as "enter what you observed". | ❌ Missing | P3 |
| **Sudarshana Chakra for Prashna** | Apply triple-ring (Lagna + Moon + Sun) analysis to the Prashna chart. Event occurs when all three rings agree. | ❌ Missing | P2 |

---

## 8. MUHURTA CHINTAMANI + MUHURTA DEEPIKA

These texts specify muhurta calculation far more precisely than current implementation.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| 20-activity muhurta finder | Basic muhurta | ✅ Done | — |
| **Tara Bala for muhurta** | Count from birth nakshatra to muhurta nakshatra. Positions 1 (Janma), 3 (Vipat), 5 (Pratyari), 7 (Naidhana) = avoid. Positions 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Atimitra) = good. Must be calculated for any muhurta. | ❌ Missing | P1 |
| **Chandra Bala for muhurta** | Moon should be 1, 3, 6, 7, 10, or 11 signs from birth Moon sign. Other positions = Chandra Bala deficiency. Must be checked for every muhurta. | ❌ Missing | P1 |
| **Panchanga Shuddhi** | All 5 panchanga elements (Tithi, Vara, Nakshatra, Yoga, Karana) should be individually auspicious for the activity. A 5/5 pure panchanga is extremely rare but powerful. App checks elements separately; doesn't compute Panchanga Shuddhi score. | ⚡ Partial | P1 |
| **Dagdha Tithi (Burnt Tithis)** | Specific Tithi + Vara combinations are "burnt" and inauspicious for new activities: Chaturthi + Sunday, Panchami + Monday, etc. 7 such combinations. | ❌ Missing | P1 |
| **Visha Ghatika** | The 25th Ghatika (24 minutes × 25 = 600 minutes after sunrise) of any day is poisonous — all activities fail. Needs to be marked on muhurta calendar. | ❌ Missing | P1 |
| **Panchaka Days** | When Moon is in Aquarius or Pisces (signs 11 and 12 of the zodiac), a 5-day Panchaka period begins. Travel south, bed purchase, roof work, cremation are prohibited. | ⚡ Partial | P1 |
| **Amrit Siddhi Yoga** | Specific Vara + Nakshatra combinations that make any activity supremely auspicious. 7 combinations: Sunday + Hasta, Monday + Mrigashira, Tuesday + Ashwini, etc. | ❌ Missing | P1 |
| **Siddhi Yoga (muhurta type)** | Specific Tithi + Vara combinations: Pratipad + Sunday, Dvitiya + Monday, etc. Different from Amrit Siddhi. | ❌ Missing | P2 |
| **Dur Muhurta** | Two inauspicious 48-minute windows per day. Already in panchang but not overlaid on muhurta finder results as a disqualifier. | ⚡ Partial | P1 |
| **Yamaghanta** | Inauspicious period in some regional traditions (especially South India). Different calculation from Yamaganda. | ❌ Missing | P3 |
| **Vidhura/Vishti Karana extension** | Vishti (Bhadra) Karana affects specific activities differently from other karanas. App marks it but doesn't apply activity-specific rules (e.g., Vishti + travel = dangerous). | ⚡ Partial | P2 |
| **Muhurta Lagna quality** | The rising sign at the muhurta moment should be free of malefics, not 8H of person, not owner of 8H. Currently not computed. | ❌ Missing | P1 |

---

## 9. BRIHAT SAMHITA (VARAHAMIHIRA) — Mundane Astrology

An encyclopaedia of omens, meteorology, and world events. Largely unimplemented — represents a major content expansion.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Mesha Sankranti Chart (Solar Ingress)** | Chart for exact moment Sun enters Aries. Valid for the entire year globally. Planet in 1H = world theme for the year; 10H = governments; 7H = wars/alliances. | ❌ Missing | P1 |
| **Jupiter-Saturn Conjunction cycle** | Every ~20 years, Jupiter and Saturn conjunct. The sign of conjunction defines a 20-year world-era theme: fire signs = political upheaval; earth signs = economic focus. | ❌ Missing | P2 |
| **Eclipse effects on regions** | BPHS Ch. 23 and Brihat Samhita Ch. 5: eclipse in specific nakshatras affects specific countries and commodities. Solar eclipses in Rohini = drought in India; in Jyestha = flood in specific regions. | ⚡ Partial | P2 |
| **Planetary ingress effects** | Jupiter entering Taurus = good agriculture, financial markets rise. Saturn entering Pisces = hospitals, spirituality, foreign affairs dominate. Monthly column content. | ❌ Missing | P2 |
| **Grahayuddha (Planetary Wars) world effects** | When Mars wins a war against Jupiter (planetary war), it predicts drought or famine. Saturn vs. Venus = disruptions to women's welfare, arts, luxury goods. World-level predictions. | ❌ Missing | P3 |
| **Vastu + Astrology integration** | Brihat Samhita covers both Vastu and Jyotish. The 8 directions map to planets: East = Sun, SE = Venus, South = Mars, SW = Rahu, West = Saturn, NW = Moon, North = Mercury, NE = Jupiter. Planet afflictions create Vastu-like problems in corresponding directions of the home. | ❌ Missing | P3 |

---

## 10. TAJIKA NILAKANTHI (VARSHAPHAL ANNUAL CHARTS)

The standard reference for Varshaphal / Solar Return astrology.

### Currently Implemented
- Solar return moment calculation ✅
- Muntha ✅
- Varsheshvara (Year Lord) ✅
- Sahams (Arabic Parts) ✅
- Basic Tajika aspects ✅
- Mudda Dasha ✅

### Missing from Tajika Nilakanthi

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Ithasala Yoga** | An approaching (applying) aspect between two planets in the annual chart, where the faster planet's degree is less than the slower's. Indicates the matter signified will be accomplished. The most important Tajika yoga. | ❌ Missing | P1 |
| **Ishrafa Yoga** | A separating aspect — the faster planet has already passed the slower. Indicates the matter has already been decided, or an opportunity missed. | ❌ Missing | P1 |
| **Nakta Yoga** | No direct aspect, but a third planet aspects both and transfers influence. Indirect accomplishment through an intermediary. | ❌ Missing | P1 |
| **Yamaya Yoga** | Two planets in opposition — contention and obstruction. | ❌ Missing | P1 |
| **Manau Yoga** | Faster planet aspects slower but slower planet is in debilitation or combustion — effort made but results denied. | ❌ Missing | P1 |
| **Khallasara Yoga** | Faster planet forms Ithasala with a planet that itself forms Ithasala with a third — chain of transfer. | ❌ Missing | P2 |
| **Dutthottha Yoga** | Already separated (Ishrafa) but the faster planet is still in close orb — some residual results remain. | ❌ Missing | P2 |
| **Tajika strength of year lord** | The Varsheshvara's strength in the annual chart is assessed by its house, aspects, and Tajika yogas. This gives the "headline" of the year. | ⚡ Partial | P1 |
| **16-portion Antardasha in Varshaphal** | The solar year divided into 16 portions (not 12), each ruled by a planet from the annual chart. Used for month-by-month prediction. | ❌ Missing | P2 |
| **Sahams in detail** | 50 Arabic Parts (Sahams) in Varshaphal, each governing a specific topic (Saham of Marriage, of Death, of Travel, of Children). Currently only ~10 are implemented. | ⚡ Partial | P2 |

---

## 11. NADI ASTROLOGY TECHNIQUES

Multiple Nadi traditions (Brighu Nadi, Saptarishi Nadi, Dhruva Nadi) share some algorithmic techniques.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Bhrigu Chakra Paddhati (BCP)** | See Uttara Kalamrita section. Jupiter's transiting house from birth position determines the year's theme. Completely different from Vimshottari. | ❌ Missing | P1 |
| **Planetary pair readings** | Nadi texts make predictions from pairs: "If Sun and Saturn are in same/opposite/trine positions, the father suffered losses at age X." Each pair generates specific life events. | ❌ Missing | P3 |
| **Transit trigger theory** | An event (birth of child, marriage, death) occurs only when (a) natal promise exists, (b) Dasha activates, and (c) transiting trigger planet confirms. Triple confirmation required. App shows these separately, never synthesises. | ⚡ Partial | P1 |

---

## 12. KRISHNAMURTI PADDHATI (KP) — Advanced

KP is partially implemented. Key missing elements:

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Sub-lords calculated | For each cusp | ✅ Done | — |
| Ruling planets | At query moment | ✅ Done | — |
| **Sub-sub lords** | Each sub is further divided into sub-sub. The sub-sub lord at the cusp gives extreme precision for event timing. ~300 divisions per sign. | ❌ Missing | P2 |
| **Cuspal sub-lord analysis** | The sub-lord of a cusp determines whether the house matters materialise. Sub-lord of 7H cusp in stellar position of 6H = marriage repeatedly delayed. App calculates cusps but doesn't do sub-lord signification analysis. | ⚡ Partial | P1 |
| **KP Significator strength ranking** | Planets are ranked as: 1. Occupant of house 2. Lord of occupant 3. Aspecting planet 4. Lord of house. App identifies significators but doesn't rank them in KP order. | ⚡ Partial | P1 |
| **Star lord (Nakshatra lord) primary significance** | In KP, the nakshatra lord of a planet's degree is MORE important than the sign lord. "Sub-period is felt as nakshatra lord, not sign lord." App uses Parashari nakshatra lords but doesn't apply KP star-lord primacy. | ⚡ Partial | P2 |
| **Event timing via transit in KP** | Event occurs when (a) Dasha allows, (b) Transit confirms cuspal sub-lord's house, (c) Moon transits a relevant nakshatra. Precision to days. | ❌ Missing | P2 |

---

## 13. NAKSHATRA JYOTISH (STAR-BASED TECHNIQUES)

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Nakshatra Pada analysis** | Each nakshatra has 4 quarters (padas). Pada 1 → Aries navamsha, Pada 2 → Taurus, etc. Planet in specific pada modifies its expression: Mercury in Ashwini Pada 1 (Aries) = entrepreneurial intellect; Pada 3 (Gemini) = communicative genius. 27 × 4 × 9 = 972 combinations. | ❌ Missing | P1 |
| **Nakshatra compatibility table** | Beyond Guna Milan: which nakshatra pairs are naturally friendly? Mrigashira-Rohini = excellent compatibility; Bharani-Krittika = destructive. Used for relationship analysis beyond Ashta Kuta. | ❌ Missing | P2 |
| **Nakshatra Veda (arrows)** | Pairs of nakshatras that "arrow" each other: Rohini/Mrigashira, Ardra/Punarvasu, etc. When both partners have nakshatras in a Veda pair = one partner dominates the other. | ❌ Missing | P2 |
| **Ganda Moola remedies** | Birth in last pada of Jyestha, Ashlesha, Revati, or first pada of Moola, Magha, Ashwini = Ganda Moola. App marks this but doesn't give the mandatory shanti puja procedure (must be done within 27 days, then annually). | ⚡ Partial | P1 |
| **Tarabala (daily) in panchang** | Each day's nakshatra counted from birth nakshatra: Janma (1), Sampat (2), Vipat (3), Kshema (4), Pratyari (5), Sadhana (6), Naidhana (7), Mitra (8), Atimitra (9), then repeats. App computes panchang nakshatra but doesn't tell the user "today's nakshatra is Sampat for you — good day for financial activities". | ❌ Missing | P1 |
| **Chandra Bala (daily)** | Moon's position from birth Moon: 1, 3, 6, 7, 10, 11 = Chandra Bala present (good day). App shows transits but doesn't give daily Chandra Bala score. | ❌ Missing | P1 |

---

## 14. LAGHU PARASHARI / JATAKA CHANDRIKA

Short but critical text. Formalises the functional nature system.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| **Functional nature table per lagna** | For each of 12 lagnas: which planets are functional benefics, functional malefics, neutral, Yoga Karakas? E.g. For Scorpio lagna: Moon is most malefic (lord of 9H but also 6H counted differently — actually Moon rules 9H = benefic. Correct: for Scorpio, Sun rules 10H = Yoga Karaka). This table has been subject of scholarly debate. When correctly implemented, it transforms yoga interpretation — a "Raja Yoga" formed by functional malefics is actually a Viparita Raja Yoga. | ⚡ Partial | P1 |
| **Maraka lords and their sub-periods** | 2nd lord and 7th lord are Marakas. In their Mahadasha or Antardasha, health crises occur if supported by transits. App doesn't identify or flag Maraka dashas. | ❌ Missing | P1 |
| **Badhak planets** | For movable lagnas (Aries, Cancer, Libra, Capricorn): 11th lord is Badhak (obstructor); fixed lagnas: 9th lord; dual lagnas: 7th lord. Badhak creates chronic unsolvable problems. | ❌ Missing | P2 |

---

## 15. GOCHAR (TRANSIT) SYSTEM — Underimplemented

Transits are displayed but not interpreted with classical depth.

| Technique | What it does | Status | Priority |
|-----------|-------------|--------|----------|
| Current transits display | Basic planetary positions | ✅ Done | — |
| **Jupiter transit effects (Vedha system)** | Jupiter's transit through a sign can be blocked (Vedha) by Saturn's position. 12 Vedha pairs that neutralise Jupiter's beneficial transit. | ❌ Missing | P1 |
| **Saturn's Ashtama Shani** | Saturn transiting 8H from birth Moon = Ashtama Shani. 2.5-year period of extreme difficulty. Different from Sade Sati (which is 7.5 years covering 12H, 1H, 2H from birth Moon). | ❌ Missing | P1 |
| **Transit through natal houses (Phala)** | Jupiter transiting 2H from birth Moon = wealth; 5H = children/education; 9H = fortune; 11H = gains. Saturn transiting 1H = hardship; 5H = children challenges; 9H = father issues. Systematic table of all planet × house transit results. | ⚡ Partial | P1 |
| **Ashtakavarga transit scoring** | For each transit, look up the bindu score of the transiting planet in that sign. 0-1 = very bad transit; 5-8 = excellent transit. This changes the interpretation of every transit. | ⚡ Partial | P1 |
| **Double transit (Jupiter + Saturn)** | When Jupiter and Saturn simultaneously aspect a natal planet or house, that house gets activated strongly — for good (if both benefic to that house) or ill. Gajakesari in transit (Jupiter trine Moon in transit) = excellent period. | ❌ Missing | P1 |
| **Transit activation of natal promise** | A natal Raja Yoga only fires when the Dasha AND the transit both confirm it. When Jupiter transits the Yoga Karaka's natal position, or when transit Yoga Karaka aspects the natal raja yoga planets, the yoga manifests. | ❌ Missing | P1 |

---

## PRIORITY SUMMARY — Implementation Backlog

### P1: High Value (Implement First)

1. **Sudarshana Chakra** — Triple-ring chart (Lagna + Moon + Sun). Dramatic visual, high astrological credibility.
2. **Mrityu Bhaga** — 108 dangerous degree values. Flag these in chart display.
3. **Dasha Sandhi** — Flag transition periods in dasha timeline (already shown, needs warning zone).
4. **Tara Bala + Chandra Bala (daily)** — Personal lucky/unlucky day indicator on panchang.
5. **Tarabala in panchang** — "Today is Sampat nakshatra for you — auspicious for wealth activities."
6. **Tara Bala + Chandra Bala in muhurta** — Missing qualification check in muhurta finder.
7. **Dagdha Tithi (7 burnt combinations)** — Muhurta disqualifier.
8. **Visha Ghatika** — Daily 24-minute poison window. Mark on muhurta calendar.
9. **Amrit Siddhi Yoga** — 7 supremely auspicious Vara+Nakshatra combos for muhurta.
10. **Ithasala/Ishrafa Tajika Yogas** — Core of Varshaphal annual reading.
11. **Rashi Drishti (Jaimini sign aspects)** — Required for accurate Jaimini interpretation.
12. **Bhrigu Bindu** — Rahu-Moon midpoint. Transit trigger point.
13. **Bhrigu Chakra Paddhati** — Annual house activation from Jupiter's transit.
14. **Pancha Pakshi Shastra** — Kerala 5-bird timing system (unique product differentiator).
15. **Maraka identification** — 2H and 7H lords. Flag their dashas.
16. **Kalasarpa sub-types** (12 types by Rahu house) — Currently generic.
17. **Nakshatra Pada profiles** — 108 pada descriptions (star quarter profiles).
18. **Graha Yuddha detailed** — Winner/loser, strength reduction, life effects.
19. **Vargottama prominent display** — Major strength indicator, not clearly shown.
20. **Functional malefics per lagna** — Transforms yoga interpretation quality.
21. **Mesha Sankranti (Annual Solar Ingress) chart** — Yearly world forecast.
22. **Saturn Ashtama Shani** — 2.5-year 8H Saturn transit (worse than Sade Sati for many).
23. **Jupiter Vedha table** — Transit blocking system.
24. **Upapada Lagna dedicated analysis** — Spouse attraction indicators.

### P2: Specialist Value

25. **Longevity (Pindayu + Amsayu)** — Significant for traditional practitioners.
26. **Pushkar Navamsha + Pushkar Bhaga** — Auspicious degree markers.
27. **Badhak planets per lagna** — Chronic obstruction identification.
28. **Shoola Dasha interpretation** — Death-related timing.
29. **Narayana Dasha detailed interpretation** — House-based predictions.
30. **Brahma, Rudra, Maheshwara** — Jaimini longevity significators.
31. **Swamsha detailed profiles** — 50+ Karakamsha sign combinations.
32. **Saptarishi Nadi transit theory** — Triple confirmation for events.
33. **KP Cuspal sub-lord analysis** — Whether house matters materialise.
34. **Sub-sub lords (KP)** — Ultra-precise event timing.
35. **Trikona Shodhana (Ashtakavarga refinement)** — Refined bindu scores.
36. **Nakshatra Veda pairs** — Compatibility arrows between star pairs.
37. **Tajika 16-portion antardasha** — Monthly Varshaphal timing.
38. **Drekkana (D3) interpretation** — Sibling and servant analysis.
39. **Ganda Moola shanti procedure** — Full ritual prescription.
40. **Sarpa Drekkana** — Serpent decanate warning positions.

### P3: Academic / Completeness

41. **Drekkana Faces** — Visual drekkana descriptions from Varahamihira.
42. **Longevity (Nisargayu)** — Natural lifespan baseline.
43. **Graha Shanti puja procedures** — Detailed ritual texts.
44. **Planetary physique descriptions** — Body characteristics from planets.
45. **Prana Dasha (Level 5)** — Days-level dasha precision.
46. **Vastu-Jyotish integration** — Directional planetary afflictions.
47. **Brihat Samhita omens** — Historical interest only in app context.
48. **Nimitta (omens at query time)** — For Prashna only.

---

## QUICK WINS (1–2 Days Each)

These require no new calculation engines — just surface existing data differently:

1. **Vargottama badge** — Check if D1 sign = D9 sign for each planet. Display prominently.
2. **Dasha Sandhi warning** — Flag ±3 months around Mahadasha transitions in timeline.
3. **Kalasarpa sub-types** — 12 sub-types based on Rahu's house. Just a lookup table.
4. **Dagdha Tithi check** — 7 Vara+Tithi combos. Add as muhurta disqualifier.
5. **Mrityu Bhaga** — 108 values from Narada Purana. Display as "⚠ dangerous degree" in chart.
6. **Amrit Siddhi Yoga** — 7 Vara+Nakshatra combos. Add to muhurta output.
7. **Panchanga Shuddhi score** — Count how many of 5 elements are clean. Show as 4/5 or 5/5.
8. **Tarabala daily indicator** — Count from birth nakshatra to today's nakshatra. Show on dashboard.
9. **Chandra Bala daily indicator** — Moon's sign from birth Moon. Show on dashboard.
10. **Bhrigu Bindu calculation** — (Rahu longitude + Moon longitude) / 2. Display as chart point.
11. **Ithasala/Ishrafa** — Check applying vs separating aspects in Varshaphal. Already have aspect orbs.
12. **Saturn Ashtama Shani** — Is Saturn currently in 8H from birth Moon? One condition.

---

## CONCLUSION

The application has exceptional coverage of the core Parashari system (charts, Shadbala, Vimshottari, yogas, panchang) and good coverage of Jaimini, KP, Varshaphal, and Prashna. The most significant gaps cluster in four areas:

1. **Muhurta depth** — Tara Bala, Chandra Bala, Dagdha Tithi, Visha Ghatika, Amrit Siddhi Yoga, Muhurta Lagna analysis. These are checked by every traditional astrologer for every muhurta.

2. **Transit (Gochar) intelligence** — Jupiter Vedha, Saturn Ashtama Shani, Ashtakavarga transit scoring, Nakshatra-based daily personal indicators (Tarabala, Chandra Bala). These transform transits from an observational tool into a predictive one.

3. **Tajika yogas** — Ithasala and Ishrafa are the backbone of Varshaphal reading. Without them, the annual chart is structurally incomplete.

4. **Jaimini completeness** — Rashi Drishti, full Swamsha profiles, Upapada Lagna analysis. The system is built but missing its own distinct aspect framework.

The "Quick Wins" list above (12 items) can be implemented in days and would immediately make the application noticeably more complete to any practicing traditional astrologer.

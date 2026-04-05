# Dekho Panchang — Master Product Roadmap

**Last updated:** 2026-04-05
**Reference:** See `docs/CLASSICAL_JYOTISH_GAP_ANALYSIS.md` for full classical text analysis.

---

## ✅ Completed

### Platform Core
- [x] Daily Panchang — location-aware, 90+ fields, DST-safe
- [x] Kundali generator — 17 divisional charts, 17 tabs
- [x] 10-page PDF export
- [x] Trilingual support (EN / HI / SA) — 205 pages across 3 locales
- [x] Global location store — auto-detect, no Delhi fallback
- [x] Timezone handling — IANA per-date with DST awareness

### Calculations Implemented
- [x] Shadbala — all 6 components + Ishta/Kashta Phala
- [x] Bhava Bala (house strength)
- [x] Vimshopaka Bala (20-point divisional strength)
- [x] 127 yoga detections (Raja, Dhana, Daridra, Parivartana, Nabhasa, etc.)
- [x] Vimshottari Dasha — Maha / Antar / Pratyantar (3 levels)
- [x] 20 additional dasha systems (Yogini, Narayana, Kalachakra, Shoola, Sthira, KP, etc.)
- [x] Jaimini system — Chara Karakas, Karakamsha, Arudha Padas A1–A12, Chara Dasha, Graha Arudhas
- [x] Avasthas — 50+ planetary states (Baladi, Varna, Raja-Rajya, Naisargika, Dina, Paksha, Tribhaga)
- [x] Argala & Virodha Argala (raw table)
- [x] Sphutas (planetary sums and differences)
- [x] Ashtakavarga — 7-planet bindu grid + SAV
- [x] Special Lagnas — Hora Lagna, Ghatika Lagna, Mrityu Lagna, Sarvottama Lagna
- [x] KP System — Placidus houses, sub-lords, significators, ruling planets
- [x] Varshaphal — solar return, Muntha, Varsheshvara, Sahams (~10), Tajika aspects (basic), Mudda Dasha
- [x] Prashna Horary — 8 categories + Ashtamangala Prashna
- [x] Sade Sati — full 7.5-year cycle with sub-phases, psychological mapping, remedies

### Tippanni (Interpretation Engine)
- [x] Planet-in-sign profiles (9 × 12 = 108)
- [x] Planet-in-house profiles (9 × 12 = 108)
- [x] Yoga interpretations (127 yogas with classical formation rules)
- [x] Dosha analysis (Manglik, Nadi, Kala Sarpa)
- [x] Dasha synthesis — current + next 3 periods
- [x] Year predictions — 12-month transit forecast
- [x] Life area readings — Career, Wealth, Marriage, Health, Education
- [x] Shadbala synthesis — dasha timeline, current period forecast, turning points
- [x] Varga tippanni — per-divisional-chart commentary

### Panchang
- [x] 5 Panchangas (Tithi, Nakshatra, Yoga, Karana, Vara) with precise transition times
- [x] Rahu Kaal, Yamaganda, Gulika Kaal
- [x] Abhijit Muhurta, Brahma Muhurta
- [x] Hora (planetary hours), Choghadiya (8 day/night windows)
- [x] Disha Shool, Sarvartha Siddhi, Vijaya Muhurta, Dur Muhurtam, Ganda Moola flag
- [x] Kali Ahargana, Kaliyuga year, Panchaka flag, Shiva/Agni/Chandra/Rahu Vaas

### Muhurta
- [x] 20-activity muhurta finder (Marriage, Griha Pravesh, Mundan, Vehicle, Travel, etc.)
- [x] Panchanga element checks per activity

### Matching
- [x] 36-point Ashta Kuta Guna Milan (all 8 Kutas)
- [x] Mangal Dosha, Nadi Dosha warnings

### Calendar & Festivals
- [x] Festival calendar — 100+ festivals with puja muhurtas
- [x] ICS export (festivals, Ekadashi, Purnima, Amavasya)
- [x] Eclipse predictions — solar & lunar
- [x] Retrograde & combustion calendar
- [x] Transit calendar

### Auth, Personalisation & Monetization
- [x] Google OAuth + Supabase, onboarding, saved charts
- [x] Dashboard — day quality, current dasha, transit alerts
- [x] In-app notification system with daily cron
- [x] 3-tier subscription (Free / Pro / Jyotishi) — Stripe LIVE
- [x] Pricing page (INR / USD toggle)
- [x] PaywallGate + UpgradePrompt components
- [x] Settings page — profile CRUD, kundali recompute

### Learn
- [x] 80+ module structured course (Phases 0–5, Classical texts)
- [x] Interactive labs (Dasha, KP, Moon, Panchang, Shadbala)
- [x] Deep-dive pages — Nakshatras, Yogataras, Ayanamsha, Planetary Cycles

---

## 🔴 IMMEDIATE — Classical Quick Wins (1–3 days each)

These require **no new calculation engines** — mostly lookup tables and small UI additions. Each one visibly improves depth for practising astrologers.

### QW-1: Vargottama Badge ⭐
**Source:** BPHS | **Effort:** 0.5 days
Planet in same sign in D1 and D9. Flag prominently in chart display and planets table.
- Check `planets[i].rashi === divisionalCharts.D9.planets[i].rashi`
- Show `🌟 Vargottama` badge in planet row and tooltip: "Strength equal to double exaltation"
- Reference in tippanni for any Vargottama planet

### QW-2: Dasha Sandhi Warning
**Source:** BPHS | **Effort:** 0.5 days
Flag ±3 months around every Mahadasha boundary in the dasha timeline.
- Highlight transition zone in amber on the timeline bar
- Tooltip: "Sandhi — dasha junction. Unstable 3-6 months. Avoid major commitments."

### QW-3: Kalasarpa Sub-types (12 types)
**Source:** BPHS, Phaladeepika | **Effort:** 0.5 days
Kalasarpa is currently generic. 12 sub-types based on Rahu's natal house:
- Anant (Rahu 1H), Kulika (2H), Vasuki (3H), Shankhapala (4H), Padma (5H), Mahapadma (6H), Takshaka (7H), Karkotak (8H), Shankhachood (9H), Ghatak (10H), Vishdhar (11H), Sheshnag (12H)
- Each has a specific life theme. Add to yoga detection + tippanni.

### QW-4: Dagdha Tithi (7 Burnt Combinations)
**Source:** Muhurta Chintamani | **Effort:** 0.5 days
7 Tithi + Vara combos that are "burnt" (Dagdha) — inauspicious for new ventures:
Chaturthi+Sunday, Panchami+Monday, Saptami+Tuesday, Ashtami+Wednesday, Tritiya+Thursday, Shashthi+Friday, Dvadashi+Saturday.
- Add as a muhurta disqualifier
- Show on Panchang page when applicable: "Dagdha Tithi — avoid new beginnings"

### QW-5: Visha Ghatika
**Source:** Muhurta Chintamani | **Effort:** 0.5 days
The 25th Ghatika of every day (24 × 25 = 600 minutes after sunrise = ~10 hours) is the "poison period" — all new activities fail.
- Mark as a 24-minute window on the muhurta calendar
- Block muhurta recommendations in this window

### QW-6: Amrit Siddhi Yoga (7 Supreme Muhurtas)
**Source:** Muhurta Deepika | **Effort:** 0.5 days
7 Vara + Nakshatra combos that make any activity supremely auspicious:
Sunday+Hasta, Monday+Mrigashira, Tuesday+Ashwini, Wednesday+Anuradha, Thursday+Pushya, Friday+Revati, Saturday+Rohini.
- Add as a positive muhurta flag: "✨ Amrit Siddhi Yoga — supremely auspicious"
- Highlight on muhurta finder and panchang

### QW-7: Panchanga Shuddhi Score
**Source:** Muhurta Chintamani | **Effort:** 0.5 days
Count how many of the 5 panchanga elements (Tithi, Vara, Nakshatra, Yoga, Karana) are individually clean for the given activity. Show as score: "4/5 Panchanga Shuddhi" on muhurta output.
- 5/5 = rare, extremely auspicious, highlight in gold
- 3/5 = acceptable, proceed with awareness
- 1-2/5 = avoid

### QW-8: Tarabala Daily Indicator
**Source:** Muhurta Chintamani | **Effort:** 0.5 days
Count from birth nakshatra to today's panchang nakshatra. Position determines quality:
- 1 (Janma), 3 (Vipat), 5 (Pratyari), 7 (Naidhana) = avoid initiating activities
- 2 (Sampat), 4 (Kshema), 6 (Sadhana), 8 (Mitra), 9 (Atimitra) = auspicious
Show on dashboard and panchang: "Today is Kshema Tara for you — good for financial activities."

### QW-9: Chandra Bala Daily Indicator
**Source:** Muhurta Chintamani | **Effort:** 0.5 days
Moon's sign counted from birth Moon sign. Positions 1, 3, 6, 7, 10, 11 = Chandra Bala present (good day). Others = Chandra Bala absent (avoid major actions).
Show on dashboard and panchang: "Chandra Bala ✓ — Moon is favourable for you today."

### QW-10: Bhrigu Bindu
**Source:** Uttara Kalamrita | **Effort:** 0.5 days
Midpoint between natal Rahu and Moon: `(Rahu_long + Moon_long) / 2` (handling 0°/360° wrap).
- Display as a sensitive chart point (◆ symbol)
- In transit view: flag when Jupiter or Saturn transits within 5° of Bhrigu Bindu
- Jupiter transit = major positive event approaching; Saturn transit = challenge period

### QW-11: Ithasala & Ishrafa Yogas in Varshaphal
**Source:** Tajika Nilakanthi | **Effort:** 1 day
For each pair of planets in the annual chart with an aspect (conjunction, trine, square, sextile, opposition):
- **Ithasala** = faster planet's degree < slower planet's degree (applying) → the matter indicated will be accomplished
- **Ishrafa** = faster planet's degree > slower planet's degree (separating) → the matter is past or denied
- Display in Varshaphal tab: "Jupiter–Venus Ithasala in 5H: Children, creativity, education indicated this year."

### QW-12: Saturn Ashtama Shani Detection
**Source:** Gochar texts | **Effort:** 0.5 days
Saturn transiting the 8th house from natal Moon = Ashtama Shani. 2.5-year period of extreme difficulty (often worse than individual Sade Sati phases).
- Detect in real-time transit calculation
- Flag on dashboard + sade-sati page: "Ashtama Shani active — Saturn in 8th from Moon until [date]."

### QW-13: Mrityu Bhaga (Dangerous Degrees)
**Source:** Narada Purana / BPHS tradition | **Effort:** 1 day
One specific degree per sign for each planet where the planet is severely weakened. 108 values total.
Standard Mrityu Bhaga degrees (Sun: Aries 16°, Taurus 6°, ... etc.)
- Mark on chart if any natal planet is within 1° of its Mrityu Bhaga: "⚠ Sun at Mrityu Bhaga — weakened"
- Include in Shadbala reduction (optional — advanced)

### QW-14: Pushkar Navamsha & Pushkar Bhaga Markers
**Source:** Saravali / BPHS tradition | **Effort:** 1 day
- **Pushkar Navamsha:** 24 specific Navamsha positions considered supremely auspicious. Mark planets in Pushkar Navamsha in the D9 chart with ✨
- **Pushkar Bhaga:** 12 specific degrees (one per sign) most auspicious. Show as marker on D1 chart for muhurta use.

---

## 🟠 HIGH PRIORITY — Classical Jyotish Completeness (P1)

### JYOTISH-01: Sudarshana Chakra
**Source:** BPHS Ch. 22 | **Effort:** 3–4 days

Three concentric rings — Lagna ring, Moon ring, Sun ring — each showing 12 houses counted from their respective ascendant. The same event is confirmed only when ≥2 rings agree.

**Implementation:**
- Compute: Lagna house positions, Moon-sign as 1H (count from Moon), Sun-sign as 1H (count from Sun)
- Render as SVG concentric circles (3 rings × 12 cells each)
- During dasha analysis: show how the current Mahadasha activates houses in all 3 rings
- In transit: show when a transit planet aspects all 3 rings simultaneously (powerful event timing)
- New tab in Kundali: "Sudarshana Chakra"

### JYOTISH-02: Muhurta Completeness — Tara Bala + Chandra Bala + Lagna Check
**Source:** Muhurta Chintamani | **Effort:** 2 days

Add to the muhurta finder's qualification checklist (currently only checks panchanga elements):

1. **Tara Bala:** Birth nakshatra to muhurta nakshatra — positions 3, 5, 7 = disqualify. Positions 2, 4, 6, 8, 9 = qualify.
2. **Chandra Bala:** Moon's sign from birth Moon — positions 1, 3, 6, 7, 10, 11 qualify; others = reduced score.
3. **Muhurta Lagna quality:** Muhurta rising sign should be: (a) not the natal 8H sign, (b) not occupied by malefics in the muhurta chart, (c) not having 8H lord in lagna.
4. Show all three as checkboxes in the muhurta result: ✓ Tara Bala ✓ Chandra Bala ✓ Lagna Clean

### JYOTISH-03: Graha Yuddha (Planetary War) Full Analysis
**Source:** BPHS Ch. 3 | **Effort:** 1.5 days

When two planets are within 1° of each other:
- Determine winner: planet with lower ecliptic latitude wins
- Loser loses 25% of their Shadbala
- Show a dedicated "Planetary Wars" section in the Planets tab
- Tippanni: "Mars and Mercury are in Planetary War. Mercury loses — business communication and logic are compromised. Mars wins — aggression and physical energy are amplified."

### JYOTISH-04: Rashi Drishti (Jaimini Sign Aspects)
**Source:** Jaimini Sutras Ch. 1 | **Effort:** 2 days

Completely different from Parashari planetary aspects:
- **Movable signs** (Aries, Cancer, Libra, Capricorn) aspect all **fixed signs** (Taurus, Leo, Scorpio, Aquarius) except the adjacent one
- **Fixed signs** aspect all **movable signs** except the adjacent one
- **Dual signs** (Gemini, Virgo, Sagittarius, Pisces) aspect each other except the adjacent one

This is the foundational aspect system for the entire Jaimini interpretation. Without it:
- Jaimini Rajayogas are incorrectly evaluated
- Karakamsha predictions are inaccurate
- Arudha Pada interactions are missed

**Implementation:**
- `src/lib/jaimini/rashi-drishti.ts` — returns Map<sign, sign[]> of which signs aspect which
- Replace all Jaimini aspect lookups to use rashi drishti instead of graha drishti
- Display: Jaimini tab → "Sign Aspects" sub-section

### JYOTISH-05: Jaimini Rajayogas from Karakamsha
**Source:** Jaimini Sutras Ch. 2 | **Effort:** 2 days

20+ distinct Rajayogas from the Karakamsha Lagna:
- AK + AmK in mutual kendra/trikona = Rajayoga
- Exalted planet in Karakamsha = specific career (Sun = govt, Moon = agriculture, etc.)
- Ketu in Karakamsha = moksha tendency, spiritual attainment
- Venus in Karakamsha = arts, luxury, vehicles (50+ planetary combinations in Swamsha)

**Implementation:** Extend `jaimini-calc.ts` to evaluate Karakamsha-based yogas. Add to Jaimini tab interpretation.

### JYOTISH-06: Upapada Lagna — Full Analysis
**Source:** Jaimini Sutras | **Effort:** 1.5 days

Separate Upapada (A12 = Arudha of 12th house) from Darapada (A7 = Arudha of 7th house):
- **Darapada (A7):** What you desire in a spouse — attraction, libido, ideal type
- **Upapada (UL = A12):** The actual marriage — public reality of your partnership
- **7th from UL:** Nature of spouse (sign = character)
- **2nd from UL:** Stability/longevity of marriage; malefic here = separation
- **UL lord's placement:** Spouse's profession and nature

Currently conflated — needs clear separation with dedicated interpretation section.

### JYOTISH-07: Maraka Planets Identification
**Source:** BPHS, Laghu Parashari | **Effort:** 1.5 days

The 2nd and 7th house lords are Marakas (death-inflicting planets). Planets occupying the 2nd and 7th also participate.

**Implementation:**
- Identify Maraka lords and occupants for the natal chart
- Flag their Mahadasha and Antardasha periods in the dasha timeline: "⚠ Maraka period — Monitor health. Avoid risky activities."
- Do NOT predict death — instead frame as: "Health-sensitive period requiring extra care"
- Add Maraka section to the Planets tab interpretation

### JYOTISH-08: Functional Malefics/Benefics per Lagna
**Source:** Laghu Parashari | **Effort:** 2 days

For each of 12 lagnas, classify each planet as: Yoga Karaka / Functional Benefic / Neutral / Functional Malefic / Maraka.

Example for Capricorn lagna:
- Venus (5H+10H) = supreme Yoga Karaka
- Mercury (6H+9H) = benefic (9H) but also 6H lord = mixed
- Sun (8H) = functional malefic
- Mars (4H+11H) = neutral-good

This classification transforms yoga interpretation:
- A "Raja Yoga" formed by functional malefics = actually Viparita Raja Yoga
- A "Dhana Yoga" formed by 6H lord = actually Viparita Dhana Yoga (gains through obstacles)

**Implementation:**
- `src/lib/kundali/functional-nature.ts` — 12-lagna lookup table
- Apply in yoga detection to adjust yoga quality assessments
- Display in chart tab: "Functional Chart Captain" = strongest functional benefic (not just highest Shadbala)

### JYOTISH-09: Badhak Planet per Lagna
**Source:** BPHS, Jataka Parijata | **Effort:** 0.5 days

The "obstructor" planet whose Mahadasha/Antardasha creates chronic unsolvable problems:
- Movable lagnas (Aries, Cancer, Libra, Capricorn): 11th lord = Badhak
- Fixed lagnas (Taurus, Leo, Scorpio, Aquarius): 9th lord = Badhak
- Dual lagnas (Gemini, Virgo, Sagittarius, Pisces): 7th lord = Badhak

**Implementation:** Identify Badhak in chart. Flag its dashas. Add to Planets tab: "Saturn is your Badhak — its periods bring irresolvable obstacles. Specific remedies required."

### JYOTISH-10: Nakshatra Pada Analysis (108 Profiles)
**Source:** Nakshatra Jyotish | **Effort:** 4 days

Each nakshatra has 4 padas (quarters), each mapping to a navamsha sign (Pada 1 = Aries navamsha for the nakshatra's first pada, etc., following the navamsha sequence).

**108 key pada interpretations needed** — for Moon's pada most importantly, then Lagna nakshatra pada:
- Moon in Ashwini Pada 1 (Aries nav) = pioneering spirit, independence
- Moon in Ashwini Pada 2 (Taurus nav) = material comforts, stubborn
- Moon in Ashwini Pada 3 (Gemini nav) = communicative, quick mind
- Moon in Ashwini Pada 4 (Cancer nav) = nurturing, emotional healer

**Implementation:** Content file `src/lib/constants/nakshatra-padas.ts` + surface in Planets tab under Moon.

### JYOTISH-11: Pancha Pakshi Shastra (5-Bird System)
**Source:** Prasna Marga — Kerala tradition | **Effort:** 4 days

An independent timing system from the Kerala tradition. Five birds (Vulture, Owl, Crow, Cock, Peacock) cycle through 5 activities (Ruling, Eating, Walking, Sleeping, Dying) throughout the day and night.

**Inputs:** Birth nakshatra (determines your ruling bird), query date/time, location (sunrise)
**Output:** What each bird is doing at this moment. Your bird's activity determines outcome:
- Ruling = excellent for any action
- Eating = good for food, nurturing activities
- Walking = good for travel, movement
- Sleeping = neutral/dormant
- Dying = avoid all important actions

**Implementation:**
- `src/lib/prashna/pancha-pakshi.ts` — calculate bird + activity for any moment
- New Prashna sub-section or standalone tool
- "Is now a good time to [action]?" — simple yes/no with bird activity explanation
- Product differentiator: **no other mainstream web app has this**

### JYOTISH-12: Jupiter Vedha in Transits
**Source:** Gochar classics | **Effort:** 1 day

Jupiter's transit through a sign can be blocked (Vedha) by Saturn's position in specific houses. 12 Vedha pairs:
- Jupiter in Aries → blocked by Saturn in Taurus
- Jupiter in Taurus → blocked by Saturn in Gemini, etc.

When Vedha is active: Jupiter's transit benefits are reduced or negated.
**Implementation:** Check in real-time transit calculation. Show: "⚠ Jupiter transit in Gemini is Vedha-blocked by Saturn in Pisces — Jupiter's benefits reduced this year."

### JYOTISH-13: Bhrigu Chakra Paddhati (Annual House Activation)
**Source:** Uttara Kalamrita / Nadi tradition | **Effort:** 1.5 days

Jupiter's transiting house from natal Jupiter's position determines the life theme for each year of life:
- Age 1: Jupiter in 1H from natal Jupiter — self, personality
- Age 2: Jupiter in 2H from natal Jupiter — wealth, family
- Age 12: Jupiter returns to natal — "Jupiter return" = major life milestone

**Implementation:**
- Calculate Jupiter's annual transit house from natal Jupiter
- Show on dashboard as "This Year's BCP Theme: Jupiter activates your 3H — siblings, courage, writing"
- Timeline: show past + upcoming 10 years of BCP activation

### JYOTISH-14: Sarvashtakavarga Full Analysis
**Source:** BPHS Ch. 66 | **Effort:** 1.5 days

Currently: individual planet bindu grids are shown. Missing:
- **Sarvashtakavarga (SAV):** Sum of all 7 planets' bindus per sign. Displayed as a 12-sign bar chart.
- **SAV interpretation:** 25+ = strong sign (beneficial transits), below 20 = weak sign (difficult transits)
- **Transit scoring:** "Jupiter transiting Gemini (SAV = 31) — very favourable transit this year"
- **Trikona Shodhana:** Subtract the minimum of each trikona group (1-5-9, 2-6-10, 3-7-11, 4-8-12) then apply Ekadhipatya Shodhana (for single-lord signs). This refines the bindu scores to their essential signal.

### JYOTISH-15: Mesha Sankranti (Annual Solar Ingress Chart)
**Source:** Brihat Samhita | **Effort:** 2 days

Chart for the exact moment Sun enters Aries each year. Valid for the entire solar year for the whole world. Classical mundane astrology.

**Implementation:**
- Calculate precise moment of Mesha Sankranti (Sun 0° Aries sidereal) for current year
- Generate a chart for that moment (with user's location for house cusps)
- Interpret houses: 1H = world theme, 4H = agriculture/crops, 7H = wars/alliances, 10H = governments, 11H = gains for nations
- New page: `/en/learn/mesha-sankranti` or section on Transits page
- Annual world forecast content — good for SEO (yearly update)

### JYOTISH-16: Transit Activation of Natal Promise
**Source:** Nadi tradition, BPHS transit chapters | **Effort:** 2 days

An event occurs when THREE conditions align simultaneously:
1. **Natal promise:** The relevant yoga exists in the birth chart
2. **Dasha activation:** The current Dasha/Bhukti lord owns or occupies the relevant house
3. **Transit confirmation:** A relevant transit planet aspects or occupies the relevant house/lord

**Implementation:**
- For each major life event area (marriage, career, children, relocation), check all 3 conditions
- Show on dashboard: "Marriage indicators: Natal promise ✓ | Dasha confirms (Venus period) ✓ | Transit Jupiter on 7H ✓ → High probability period 2026–2027"
- This transforms transits from observational to predictive

---

## 🟡 MEDIUM PRIORITY — P2 Classical Techniques

### P2-01: Longevity Calculation (Pindayu + Amsayu)
**Source:** BPHS Ch. 44–45

**Pindayu:** Each planet contributes years based on its degree in D1 (Sun max 19y, Moon 25y, Mars 15y, Mercury 12y, Jupiter 15y, Venus 21y, Saturn 20y). Reduce for combustion, retrogression, debilitation.
**Amsayu:** Each planet contributes years based on its Navamsha sign lord's strength.
**Output:** Estimated lifespan range — display cautiously as "constitutional longevity indicators" not death prediction.

### P2-02: Drekkana (D3) Detailed Interpretation
**Source:** Saravali, BPHS Ch. 6

Each of the 36 drekkanas has specific results for planets placed there. 9 planets × 36 drekkanas = 324 combinations. The D3 chart governs siblings, servants, servants, and arm/shoulder health.
- Add full D3 interpretation tab in Varga section
- Drekkana Dasha (sign-based, related to D3) timing

### P2-03: Nakshatra Veda Pairs (Compatibility)
**Source:** Nakshatra compatibility texts

12 nakshatra pairs that "arrow" each other in compatibility analysis:
Rohini/Mrigashira, Ardra/Punarvasu, Pushya/Ashlesha, Purva/Uttara Phalguni, Hasta/Chitra, Swati/Vishakha, Anuradha/Jyestha, Purvashadha/Uttarashadha, Shravana/Dhanishtha, Shatabhisha/Purva Bhadrapada, Uttara Bhadrapada/Revati.
When Veda pair partners → one partner dominates the other.
Add to matching page as additional compatibility insight.

### P2-04: Tajika — Full 7-Yoga System
**Source:** Tajika Nilakanthi

Beyond Ithasala/Ishrafa (QW-11), implement remaining 5 Tajika yogas:
- **Nakta Yoga:** Indirect application via a third planet
- **Yamaya Yoga:** Two planets in opposition — contention
- **Manau Yoga:** Faster planet in aspect but slower planet combust/debilitated — denied
- **Khallasara:** Chain transfer through 3 planets
- **Dutthottha:** Recently separated but within close orb — residual results
Also add: **16-portion Tajika Antardasha** for month-by-month Varshaphal timing.

### P2-05: KP Sub-sub Lords + Cuspal Sub-lord Analysis
**Source:** Krishnamurti Paddhati

- **Sub-sub lords:** Further divide each sub into sub-sub (results in ~300 divisions per sign). Ultra-precise event timing.
- **Cuspal sub-lord signification:** The sub-lord of each cusp governs whether that house's matters materialise. Sub-lord of 7H cusp in stellar position of 6H = marriage repeatedly delayed. This is the core predictive tool in KP — currently missing.
- **KP Significator ranking:** 4-tier order (Occupant → Lord of occupant → Aspecting planet → Lord of house)

### P2-06: Swamsha (Karakamsha) Full Profile Library
**Source:** Jaimini Sutras Ch. 2

50+ specific planetary combinations in Karakamsha Lagna with their classical meanings:
- Ketu in Swamsha = moksha tendency, occult, liberation
- Venus + Mercury in Swamsha = eloquent writer, poet, performer
- Mars + Rahu in Swamsha = surgeon, weapons engineer, butcher (aggressive profession)
- Saturn in Swamsha = labour, agriculture, oil, iron industry
Build a content library for all major combinations.

### P2-07: Narayana Dasha Full Interpretation
**Source:** Jaimini Sutras | Currently: calculated, not interpreted

Classical Narayana Dasha prediction rules:
- 9th sign from Dasha sign shows father's condition that year
- 5th sign shows children
- 7th shows spouse
- 4th shows mother/home
- 10th shows career
Map these for each annual Narayana Dasha period and surface in Dasha tab.

### P2-08: Shoola Dasha Interpretation + Brahma/Rudra/Maheshwara
**Source:** Jaimini Sutras

- **Shoola Dasha:** Used specifically for longevity and death-related timing. Requires special interpretation framing (health crises, major endings).
- **Brahma, Rudra, Maheshwara:** Three Jaimini longevity significators. Brahma = identified from 6H/8H/12H lords; Rudra = identified from 8H; Maheshwara = strongest chart planet. Their periods are critical for health and transformation events.

### P2-09: Hora Chart (D2) Full Interpretation
**Source:** Brihat Jataka, BPHS Ch. 6

D2 is currently calculated but not interpreted. Classical rules:
- Planet in Sun's hora (odd signs) → delivers masculine/paternal results fully
- Planet in Moon's hora (even signs) → delivers feminine/maternal results fully
- Planet in own-gender hora → amplified results of its house
- Wealth timing: planet with most planets in its hora rules the main income phase
- Body: Sun hora = right side, Moon hora = left side (medical use)

### P2-10: Ganda Moola Full Procedure
**Source:** Muhurta Chintamani, regional traditions

Birth in last pada of Jyestha, Ashlesha, Revati, or first pada of Moola, Magha, Ashwini = Ganda Moola. Currently just flagged. Needs:
- Identification of which specific Ganda Moola (6 types, each with different implications)
- Mandatory shanti procedure: must be done within 27 days of birth, then annually on birthday nakshatra
- Shanti timing: when Moon transits birth nakshatra
- Who is affected: child, father (Moola), mother (Ashlesha, Jyestha, Revati), family (Magha, Ashwini, Krittikas)
- Dedicated section on birth nakshatra page + flag in Kundali

### P2-11: Pushkar Navamsha + Pushkar Bhaga Details
**Source:** Saravali tradition

- 24 Pushkar Navamsha positions — planet here is greatly strengthened, especially for muhurta
- 12 Pushkar Bhaga degrees — the single most auspicious degree in each sign
- Both should be used in muhurta finder: "Moon is at Pushkar Bhaga in Taurus — excellent muhurta strength"

---

## 🟢 PRODUCT FEATURES (Non-Classical)

### PROD-01: Email Notifications (Resend)
**Priority:** High | **Impact:** Retention, re-engagement

**Transactional:**
- Welcome email with birth chart summary after signup
- Subscription confirmation / upgrade receipt
- Password reset (if email auth)

**Weekly Digest (Monday 6 AM, personalised):**
- Day quality forecast for the week (Tarabala + Chandra Bala per day — from QW-8/9)
- Current dasha period with one-paragraph interpretation
- Upcoming festivals with personal relevance score
- 3 transit alerts for the week

**Event Alerts:**
- Dasha transition warning — 30 days before Antardasha change
- Sade Sati onset / phase change
- Festival reminders — 3 days before relevant festivals

**Technical:**
- `src/lib/email/templates/` — React Email templates (welcome, digest, alert)
- `src/app/api/cron/weekly-digest/route.ts`
- `src/app/api/cron/email-alerts/route.ts`
- Unsubscribe per category via existing notification_prefs JSONB
- Rate limit: max 3 emails/user/week

### PROD-02: PWA — Offline + Push Notifications
**Priority:** High | **Impact:** Mobile retention

- Service worker — cache app shell, fonts, icons, learn content
- Offline mode for: Learn, Puja Vidhi, About (static content)
- Cached panchang for last-viewed date
- Web Push: festival reminders, dasha transitions
- Custom install prompt (after 2nd visit)
- Proper app icons (192×192, 512×512) in gold/navy
- Shortcuts: "Today's Panchang", "My Dashboard", "Generate Kundali"

### PROD-03: Razorpay Activation (India)
**Priority:** High | **Impact:** Revenue from India (80% of audience)
Code is written. Needs: Razorpay account + API keys + 4 Plan IDs.

### PROD-04: SEO + Structured Data
**Priority:** High | **Impact:** Organic traffic

- JSON-LD per page type (HowTo for pujas, Event for festivals, FAQPage for learn)
- Dynamic OG images per page (festival, chart, nakshatra)
- Google Search Console setup
- Core Web Vitals monitoring
- Custom analytics events: kundali_generated, chart_exported, subscription_started
- Update sitemap.xml with all 205 pages and correct priorities

### PROD-05: Kundali Comparison
**Priority:** Medium | **Impact:** Professional users, engagement

Beyond Guna Milan: side-by-side dual D1 display, planet position overlay, dasha compatibility matrix (whose dasha supports the relationship), composite chart midpoint analysis, PDF comparison report.

### PROD-06: Birth Time Rectification
**Priority:** Medium | **Impact:** Professional users

Input life events with known dates → algorithm tests ascendants at 10-minute intervals → scores each candidate lagna against events → suggests most likely birth time with confidence score.

### PROD-07: Astrologer Marketplace
**Priority:** Low (Future)

Verified Vedic astrologer profiles, booking (video/chat/written report), review system, 15–20% revenue share. Requires significant ops work.

### PROD-08: Graha Shanti Puja Vidhi (9 Planets)
**Source:** BPHS Ch. 87–97 | **Priority:** Medium | **Impact:** Content depth + SEO

Full puja procedure for each planet: specific materials, mantras with repetition count (Sun = 7000 Gayatri repetitions), auspicious timing (which day, hora), deity, homa items. Link from the Remedies section and from each weak-planet detection.

### PROD-09: Contextual Remedy Engine
**Source:** BPHS Ch. 87–97 | **Priority:** Medium

Current remedies are generic per-planet. Upgrade to contextual:
- Rahu afflicting 7H → Durga Saptashati + marriage mantra, not just "chant Rahu beej"
- Saturn in 8H → Mahamrityunjaya + Hanuman Chalisa specifically
- Weak Mercury in chart of student → Saraswati puja before exams on Panchami
Map affliction type → specific remedy combination.

### PROD-10: Muhurta Panchanga — Graphic Annual View
**Priority:** Medium | **Impact:** Planning tool, SEO

Monthly/annual view of all muhurtas:
- Rows = activity types, Columns = days
- Color-coded cells: gold = excellent muhurta, green = good, grey = neutral, red = avoid
- Filter by activity (show only Marriage muhurtas for 2026)
- ICS export for selected muhurta windows

---

## 📊 P3 — Academic / Completeness

These add scholarly depth but have lower user-facing impact:

- [ ] **Drekkana Faces** — 36 pictorial decanate descriptions (Varahamihira)
- [ ] **Sookshma Dasha (Level 4)** — 4th Vimshottari subdivision for precise event timing
- [ ] **Prana Dasha (Level 5)** — Days-level precision
- [ ] **Pindayu + Nisargayu longevity** — Natural lifespan baseline
- [ ] **Panchavargeya Bala** — Varahamihira's 5-chart dignity score
- [ ] **Planetary physique descriptions** — Body characteristics from planets (Varahamihira)
- [ ] **Vastu-Jyotish integration** — 8-direction planetary mapping
- [ ] **Prashna Nimitta** — Omen interpretation at query time
- [ ] **Jupiter-Saturn conjunction world-era analysis** — 20-year cycle themes
- [ ] **Planetary ingress effects** — Sign-by-sign world forecast as Jupiter/Saturn change signs
- [ ] **Sarpa Drekkana** — Serpent decanate warning positions
- [ ] **Classical text search** — Vector search across BPHS, Phaladeepika, Saravali verses

---

## 🏆 Competitive Gap Tracker

**Jagannatha Hora (JHora):** Free desktop app, 40+ dasha systems, 184 yogas, research-grade calculations.
**Parashara's Light (PL):** $300–700 desktop, 1000+ yogas, 4 searchable classical texts, professional reports.

| Feature | JHora | PL | Our App |
|---------|-------|----|---------|
| Web-based, zero install | ✗ | ✗ | ✅ |
| Mobile-first design | ✗ | ✗ | ✅ |
| LLM chart chat | ✗ | ✗ | ✅ |
| Trilingual (EN/HI/SA) | Partial | Partial | ✅ |
| Divisional charts | ✅ | ✅ | ✅ (17) |
| Vimshottari Dasha | ✅ | ✅ | ✅ |
| Dasha systems | 40+ | 30+ | 21 |
| Yoga detection | 184 | 1000+ | 127 |
| Shadbala | ✅ | ✅ | ✅ |
| Sudarshana Chakra | ✅ | ✅ | ❌ → Roadmap |
| Muhurta (full) | ✅ | ✅ | ⚡ → Roadmap |
| Pancha Pakshi | ✅ | ✗ | ❌ → Roadmap |
| Jaimini (full) | ✅ | ✅ | ⚡ → Roadmap |
| Birth time rectification | ✅ | ✅ | ❌ → Roadmap |
| Subscription model | ✗ | ✗ | ✅ |
| Location auto-detect | ✗ | ✗ | ✅ |
| Festival calendar | ✗ | ✗ | ✅ |
| PDF export | ✗ | ✅ | ✅ |

---

## Implementation Sequence

```
Immediate (2–4 weeks):
  QW-1 through QW-14 (Quick Wins — 1-3 days each)
  JYOTISH-02 (Muhurta completeness)
  JYOTISH-04 (Rashi Drishti — critical for Jaimini)
  PROD-01 (Email notifications)
  PROD-03 (Razorpay)

Short term (1–3 months):
  JYOTISH-01 (Sudarshana Chakra)
  JYOTISH-05 (Jaimini Rajayogas)
  JYOTISH-07 (Maraka identification)
  JYOTISH-08 (Functional malefics)
  JYOTISH-10 (Nakshatra Padas)
  JYOTISH-11 (Pancha Pakshi) — differentiator
  JYOTISH-14 (Sarvashtakavarga)
  JYOTISH-16 (Transit activation)
  PROD-02 (PWA)
  PROD-04 (SEO)

Medium term (3–6 months):
  P2-01 through P2-11 (specialist classical techniques)
  PROD-05 (Kundali comparison)
  PROD-06 (Birth time rectification)
  PROD-08 (Graha Shanti pujas)
  PROD-09 (Contextual remedies)
  PROD-10 (Muhurta annual view)

Long term:
  P3 academic completeness
  PROD-07 (Astrologer marketplace)
  Full classical text search
```

---

*For the full classical text analysis, technique descriptions, and source references, see `docs/CLASSICAL_JYOTISH_GAP_ANALYSIS.md`.*

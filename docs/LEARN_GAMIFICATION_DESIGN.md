# Learn Jyotish — Modular Learning & Knowledge Assessment Design

## Philosophy

Progress should be **earned through demonstrated understanding**, not clicks. Each topic is broken into digestible modules with a knowledge check at the end. You can't advance to the next module until you pass the current one. This creates genuine learning progression.

---

## 1. Content Structure

### Hierarchy

```
Phase (e.g., "The Sky")
  └── Topic (e.g., "Grahas")
        └── Module 1: "What Are Grahas?"
              └── Content (text, diagrams, examples)
              └── Knowledge Check (3-5 questions)
        └── Module 2: "Planetary Friendships & Enmities"
              └── Content
              └── Knowledge Check
        └── Module 3: "Dignities — Exaltation, Debilitation, Own Sign"
              └── Content
              └── Knowledge Check
        └── Topic Assessment (cumulative, unlocks next topic)
```

### Module Size
- Each module = **10-15 minutes of study** (~2,000-3,500 words + 3-5 visuals/diagrams + worked examples)
- Each topic = **3-6 modules**
- Each phase = **3-5 topics**
- Total = ~50 substantial modules across 5 phases (~8-12 hours total curriculum)

### Module Content Structure (mandatory for every module)
Each module must include ALL of the following:
1. **Conceptual Introduction** (~400 words) — What is this concept, why does it matter, where it fits in the larger system
2. **Classical Origin** (~300 words) — Which text introduced it (BPHS chapter, Phaladeepika verse), the original Sanskrit term and its etymology, historical context
3. **Detailed Explanation** (~800 words) — Deep dive with sub-sections, formulas where applicable, edge cases, exceptions, nuances that most resources skip
4. **Visual Diagram(s)** (2-3 per module) — SVG interactive diagrams, comparison tables, classification charts. Not decorative — every visual must teach a concept that is hard to convey in text alone
5. **Worked Examples** (~400 words) — At least 2 real-world examples with step-by-step calculation or chart reading. Use actual birth data or panchang data to demonstrate
6. **Common Misconceptions** (~200 words) — What beginners get wrong, what popular astrology apps get wrong, what even some practitioners misunderstand
7. **Modern Relevance** (~200 words) — Is this concept still scientifically valid? Has it been superseded? How do modern tools handle it differently?
8. **Cross-References** — Links to related modules ("This connects to Module 6.2 on Nakshatra Padas" / "See also: Divisional Charts module for how this applies in D9")

### Navigation
- User sees **one module at a time** (paginated, not one long scroll)
- "Next" button appears only after content is read (time-gated or scroll-complete)
- Knowledge Check appears after the content
- Module marked complete only when check is passed (≥70%)
- Topic Assessment unlocks after all modules in that topic are complete

---

## 2. Knowledge Check Design

### Question Types

#### Type A: Multiple Choice (most common)
```
Q: Which planet is exalted in Cancer?
  ○ Venus
  ○ Mars
  ● Jupiter    ← correct
  ○ Saturn

[Explanation if wrong]: Jupiter is exalted in Cancer (4th sign).
  This is one of the Pancha Mahapurusha conditions — Jupiter in
  Cancer in a kendra forms Hamsa Yoga. (BPHS Ch.34)
```

#### Type B: Match the Pairs (drag or tap)
```
Match each planet to its exaltation sign:

  Sun     →  [Aries]
  Moon    →  [Taurus]
  Mars    →  [Capricorn]
  Jupiter →  [Cancer]
```

#### Type C: True/False with Explanation
```
T/F: The sidereal zodiac is tied to the seasons.

  ● False

[Explanation]: The TROPICAL zodiac is tied to seasons (equinoxes).
  The SIDEREAL zodiac is tied to fixed stars. The difference between
  them is the Ayanamsha (~24° in 2026).
```

#### Type D: Fill in the Blank (numeric)
```
Q: A Tithi is defined as every __° of Moon-Sun elongation.

  Answer: [12]

[Explanation]: Tithi = floor((Moon° - Sun°) / 12°) + 1.
  360° ÷ 12° = 30 Tithis per lunar month.
```

#### Type E: Visual Identification (for charts)
```
[Image: North Indian chart with planets placed]

Q: In this chart, which house is Jupiter in?
  ○ 4th
  ● 7th     ← correct
  ○ 10th
  ○ 1st
```

#### Type F: Calculation (advanced modules)
```
Q: If the Sun is at 45° tropical longitude and Lahiri
   Ayanamsha is 24.2°, what is the sidereal longitude?

  Answer: [20.8]°

  In which sign does this fall?
  ○ Aries
  ● Taurus    ← correct (20.8° is in Taurus: 0-30°→Aries, but
                 actually 45-24.2=20.8 which is in Aries since
                 Aries=0-30°... let me fix:
                 45° tropical = Taurus (30-60°)
                 45 - 24.2 = 20.8° sidereal = Aries (0-30°))
  ○ Gemini
```

### Scoring
- Each Knowledge Check: 3-5 questions
- Pass threshold: **≥70%** (e.g., 3/4 or 4/5)
- Failed? → Review content, retake (questions shuffled)
- No penalty for retakes — learning, not testing

### Question Pool
- Each module has a pool of **8-12 questions**
- Each attempt draws **4-5 randomly** from the pool
- Prevents memorization of specific question order
- Questions tagged by difficulty: Easy (1pt), Medium (2pt), Hard (3pt)

---

## 3. Module Map for Each Topic

Each module below is a **10-15 minute study unit** with ~2,500-3,500 words, 3-5 visuals, worked examples, classical references, misconception alerts, and a 5-question knowledge check.

---

### Phase 1: The Sky (~4 hours total)

#### Topic: Foundations (3 modules, ~40 min)

| Module | Title | Content Outline | Visuals | Worked Examples | Check Focus |
|--------|-------|----------------|---------|-----------------|-------------|
| 1.1 | **The Night Sky & The Ecliptic** | What ancient Indians saw when they looked up. The celestial sphere concept. Why planets appear only along a narrow band (ecliptic). Earth's 23.5° axial tilt and its consequences (seasons, ayana). The ecliptic as the Sun's apparent annual path. How the Moon and planets deviate ±5-8° from the ecliptic. Etymology: "Kranti-vritta" (क्रान्तिवृत्त) — the circle of inclination. How this was known to Surya Siddhanta authors without telescopes (naked-eye observation over decades). | Animated ecliptic diagram with Earth orbit. Celestial sphere with equator vs ecliptic. Planetary latitude scatter plot showing why all planets cluster near ecliptic. | Track the Sun's position over 12 months — show how it moves through signs. Demonstrate why planets are NEVER found in Ursa Major (because it's far from the ecliptic). | Identify the ecliptic. Calculate the Sun's approximate position for a given month. Distinguish ecliptic from celestial equator. |
| 1.2 | **Measuring the Sky — Degrees, Signs & Nakshatras** | The 360° circle and its Indian origin (possibly Babylonian via trade). Degree (अंश), Minute (कला), Second (विकला). Why 360? (divisible by 2,3,4,5,6,8,9,10,12,15,18,20,24,30,36,40,45,60,72,90,120,180). The dual grid: 12 rashis × 30° AND 27 nakshatras × 13°20'. Why both grids exist (Solar vs Lunar measurement). The mathematical relationship: LCM of 12 and 27 = 108 (sacred number). Each nakshatra = 4 padas of 3°20', and 12 × 9 padas = 108 navamshas. Conversion formulas. Parashara's definition from BPHS Ch.1. | Circular zodiac with both sign and nakshatra boundaries overlaid. Degree-to-sign-to-nakshatra conversion table. The 108 connection visual. | Given 247.5° sidereal longitude: which sign? (Sagittarius, 247.5÷30=8.25, 9th sign). Which nakshatra? (247.5÷13.33=18.56, 19th=Moola). Which pada? | Convert degrees to sign+nakshatra+pada. Explain why 108 is sacred in this context. |
| 1.3 | **The Zodiac Belt — Fixed Stars vs Moving Planets** | The zodiac as a 16°-wide highway in the sky. Fixed stars (nakshatras) as mile markers vs planets as travelers. How ancient Indians identified 27 yogataras (junction stars) — one per nakshatra. The identification problem: which star is which yogtara? Disputes and the Lahiri committee's resolution (1956). The constellation vs sign distinction (constellations are unequal, signs are exactly 30° each). Why the 12-sign system uses EQUAL divisions even though constellations are unequal. Varahamihira's discussion of this in Pancha Siddhantika. | Star map showing the 27 yogataras. Constellation boundaries (IAU) vs Jyotish sign boundaries. Table of all 27 yogataras with modern star names (Aldebaran = Rohini, Spica = Chitra, etc.). | Identify Rohini yogtara (Aldebaran) in the night sky. Show the physical star Chitra (Spica) and why it anchors the Lahiri ayanamsha at 180°. | Name the yogtara for 3 given nakshatras. Explain why signs are 30° even though constellations aren't. |

#### Topic: Grahas — The Nine Planets (4 modules, ~55 min)

| Module | Title | Content Outline | Visuals | Check Focus |
|--------|-------|----------------|---------|-------------|
| 2.1 | **The Nine Grahas — Nature & Karakatva** | Etymology: "Graha" = that which grasps/seizes (not just "planet"). Why Rahu/Ketu are grahas but not planets. Each graha's core nature (Sattvic/Rajasic/Tamasic), gender, element, direction, body part, color, taste, metal, gem, grain, day. Karakatva (natural signification) — Sun = father/authority/soul, Moon = mother/mind/emotions, etc. Complete for all 9. How karakatva differs from house signification. BPHS Ch.3 discussion. Why the outer planets (Uranus/Neptune/Pluto) are NOT used in Jyotish and why. | 9-planet karakatva comparison chart. Graha nature classification wheel (Sattvic/Rajasic/Tamasic). Planet-attribute matrix (color, metal, gem, day, direction for each). | Identify planet's karakatva from a life event scenario. Match planets to their natural attributes. |
| 2.2 | **Planetary Friendships — The Relationship Matrix** | Naisargika (natural/permanent) friends, enemies, neutrals — the full 9×9 matrix. How Parashara derived these (BPHS Ch.3 v.55): lord of 2nd, 4th, 5th, 8th, 9th, 12th from moolatrikona = friend. Tatkalika (temporary) friendship: planets in 2nd, 3rd, 4th, 10th, 11th, 12th from each other = temporary friend. Compound relationship: natural friend + temporary friend = Adhimitra (great friend), natural enemy + temporary friend = Sama (neutral), etc. The 5-level compound system: Adhimitra → Mitra → Sama → Shatru → Adhishatru. Why this matters: planet in a friend's sign is strong, enemy's sign is weak. Practical impact on dignity assessment. | Full 9×9 friendship matrix (color-coded). Compound relationship derivation table. Visual showing how temporary friendship changes with chart. | Derive the compound relationship between 2 given planets in a given chart. Explain why Sun and Saturn are enemies. |
| 2.3 | **Dignities — Where Planets Thrive & Suffer** | The 7-level dignity hierarchy: Exalted (उच्च) → Moolatrikona (मूलत्रिकोण) → Own Sign (स्वक्षेत्र) → Friend's Sign (मित्रक्षेत्र) → Neutral (समक्षेत्र) → Enemy's Sign (शत्रुक्षेत्र) → Debilitated (नीच). Exact exaltation degrees (Sun at 10° Aries, Moon at 3° Taurus, etc.) vs just exaltation signs. Moolatrikona degree ranges (Sun: Leo 0-20°, Moon: Taurus 4-30°, etc.). Why debilitation is NOT always bad — Neecha Bhanga Raja Yoga. The 4 classical cancellation conditions. Parashara's metaphor: "A king in his kingdom vs a king in exile." Vargottama: when a planet is in the same sign in both D1 and D9 — why this strengthens the planet. | Dignity hierarchy tower visual. Exaltation/debilitation/moolatrikona degree table. Neecha Bhanga flowchart (4 conditions). | Given a planet+sign+degree, determine full dignity. Identify Neecha Bhanga conditions in a sample chart. |
| 2.4 | **Retrograde, Combustion & Planetary War** | Retrograde (Vakri): astronomical cause (inner planet overtaking, Earth overtaking outer planet). Which planets can be retrograde (not Sun/Moon/Rahu/Ketu — Rahu/Ketu are always retrograde by nature). How many days each planet is retrograde per year. The paradox: retrograde planets are actually CLOSER to Earth and BRIGHTER — so Jyotish considers them stronger in some ways. Vakri = "crooked" — the energy is internalized, intensified. Combustion (Asta): planet within X° of Sun becomes invisible — "burnt." Exact orbs per planet (Moon 12°, Mars 17°, Mercury 14°/12° if retrograde, Jupiter 11°, Venus 10°/8° retrograde, Saturn 15°). Combust planet = weakened karakatva. Planetary War (Graha Yuddha): when two planets are within 1° — the brighter/northern one wins. Effects on the loser. | Retrograde motion diagram (Earth-Mars opposition showing apparent backward motion). Combustion orb comparison chart. Retro frequency table (Mercury ~3x/year, Saturn ~1x/year). | Determine if a planet is retrograde/combust given positions. Calculate combustion from Sun-planet distance. |

#### Topic: Rashis — The 12 Signs (3 modules, ~40 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 3.1 | **The 12 Rashis — Parashara's Description** | Each sign described as Parashara described it (BPHS Ch.4): physical form, direction it faces, where it lives, caste, varna, limb of Kalapurusha. The 12 signs as limbs of the Cosmic Person (Kalapurusha): Aries=head, Taurus=face, Gemini=arms... Pisces=feet. Why the order matters — it follows the body from head to feet. Each sign's full profile: ruling planet, element, quality, gender, day/night sign, fruitful/barren, biped/quadruped/insect/water creature. | Kalapurusha body diagram with signs mapped. Complete sign-attribute matrix. |  Match signs to Kalapurusha limbs. Classify signs by quality+element+gender. |
| 3.2 | **Sign Qualities — Chara, Sthira, Dwiswabhava** | Movable (Cardinal) signs: Aries, Cancer, Libra, Capricorn — initiate, start. Fixed signs: Taurus, Leo, Scorpio, Aquarius — sustain, hold. Dual signs: Gemini, Virgo, Sagittarius, Pisces — adapt, transition. Elements: Fire (Aries/Leo/Sag), Earth (Tau/Vir/Cap), Air (Gem/Lib/Aqu), Water (Can/Sco/Pis). Why this matters for house classification: movable sign houses are cardinal directions (1,4,7,10 = Kendras when lagna is movable). Odd signs = male, Even signs = female. Diurnal (day-strong) vs Nocturnal (night-strong) signs. Shirshodaya (rising head-first) vs Prishtodaya (rising back-first) — affects prediction timing. | 4-element wheel with 3 signs each. Quality-element combination grid (12 cells). Rising-type classification. | Given a sign, list all 6 classifications (quality, element, gender, day/night, rising type, Kalapurusha limb). |
| 3.3 | **Sign Lordship & the Luminaries' Special Status** | Which planet rules which sign. The symmetric pattern: Sun→Leo, Moon→Cancer, then outward pairs: Mercury→Gemini/Virgo, Venus→Taurus/Libra, Mars→Aries/Scorpio, Jupiter→Sagittarius/Pisces, Saturn→Capricorn/Aquarius. Why Rahu/Ketu don't rule signs (they are shadow planets). The debate: do Rahu/Ketu co-rule Aquarius/Scorpio? (Some modern practitioners say yes, traditional Parashara says no.) The significance of lordship: the lord "manages" the affairs of its sign. When a house lord is strong vs weak — what it means for that house's significations. Dig Bala (directional strength): each planet strongest in a specific house (Sun in 10th, Moon in 4th, etc.). | Sign-lordship circular diagram. Dig Bala assignment table. Symmetric lordship pattern visual. | Given any sign, name its lord. Explain why Sun rules only one sign. Identify Dig Bala for each planet. |

#### Topic: Ayanamsha — Precession (3 modules, ~40 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 4.1 | **Earth's Wobble — The Physics of Precession** | The spinning top analogy in full detail. What causes it: Sun and Moon's gravitational pull on Earth's equatorial bulge. The 25,772-year cycle. How the pole star changes: Polaris (now) → Vega (~14,000 CE) → Thuban (was pole star when pyramids were built, ~2700 BCE). Historical discovery: Hipparchus (~150 BCE) in Greece AND independently in India (Surya Siddhanta). The Surya Siddhanta's error: trepidation model (oscillation) vs reality (steady increase). How this was corrected by later Indian astronomers. Rate: 50.3"/year = 1° every 71.6 years = 30° (one full sign) every 2,148 years. | Precession cone SVG animation. Pole star migration map over 26,000 years. Precession rate over centuries chart. | Calculate how many degrees precession shifts over N years. Explain why pyramids were aligned to Thuban, not Polaris. |
| 4.2 | **Two Zodiacs — Tropical vs Sidereal in Depth** | The fundamental fork: do you measure from the moving equinox point (tropical) or from fixed stars (sidereal)? When they were aligned (~285 CE by most estimates, ~500 BCE by some). Today's gap: ~24.2°. Practical consequence: ~80% of people have a different Western sign than Vedic sign. Detailed conversion with 5 worked examples for different longitudes. Why Western astrology chose tropical (Ptolemy's influence, seasonal relevance). Why Indian astrology chose sidereal (nakshatra system requires fixed stars, Surya Siddhanta tradition). The philosophical difference: tropical = seasonal energy, sidereal = cosmic position. Neither is "wrong" — they measure different things. | Two-ring zodiac diagram with offset. 5 worked examples with visual. Historical timeline of divergence. | Convert 5 tropical positions to sidereal. Explain why your Western horoscope sign may differ from your Vedic sign. |
| 4.3 | **Ayanamsha Systems — Lahiri, KP, and the Great Debate** | Why multiple systems exist: the "zero point" problem. Lahiri (Chitrapaksha): Spica/Chitra at exactly 180° sidereal. Adopted by Indian government (1956, Meghnad Saha committee). KP (Krishnamurti): Krishnamurti's calibration, ~6' difference from Lahiri. When it matters (planets near sign boundaries). Raman: BV Raman's calibration, ~1.4° less than Lahiri. Yukteshwar: based on his yuga theory, significantly different. Fagan-Bradley: Western sidereal, Aldebaran at 15° Taurus. The Lahiri formula: polynomial coefficients, worked calculation for 2026. Why the choice MATTERS: a planet at 29°50' of one sign in Lahiri might be in the NEXT sign using Raman. This changes the entire chart. Our app's default: Lahiri, with 6 systems available. | Ayanamsha comparison chart (2026 values). Worked calculation step-by-step. Historical committee photo/context. | Compute Lahiri ayanamsha for a given year. Identify which planets would change signs between Lahiri and Raman for a sample chart. |

---

### Phase 2: Pancha Anga (~3.5 hours total)

#### Topic: Tithi — The Lunar Day (3 modules, ~40 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 5.1 | **What Is a Tithi? — The Moon-Sun Dance** | Etymology and BPHS definition. The formula: Tithi = floor((Moon° - Sun°) / 12°) + 1. Why 12°? Because 360° ÷ 30 tithis = 12° per tithi. The physical meaning: Moon gains ~12° on the Sun per day, so ~1 tithi per day. But tithis are UNEQUAL in duration (ranging from ~19 to ~26 hours) because the Moon's speed varies (perigee vs apogee). Why this matters for muhurta — a tithi that ends before sunrise was never "active" on that day. Tithi at sunrise = the tithi of the day. Kshaya tithi (skipped) and Adhika tithi (repeated) — why they happen and their significance. Detailed calculation with 3 worked examples using actual Moon/Sun positions. | Moon-Sun angular separation diagram. Tithi duration variation chart (19-26 hours). Kshaya/Adhika explanation visual. | Calculate tithi from given Moon and Sun longitudes. Explain why tithis have unequal duration. Identify if a tithi is Kshaya or Adhika. |
| 5.2 | **Shukla & Krishna Paksha — The Waxing and Waning Halves** | Shukla Paksha (bright half): Pratipada (1) to Purnima (15). Krishna Paksha (dark half): Pratipada (1) to Amavasya (15/30). The 30-tithi system vs the 15+15 system. Why Purnima and Amavasya are special — astronomical (full/new moon) and astrological significance. Purnimant vs Amant month systems — North India counts months ending on Purnima, South India counts ending on Amavasya. Tithi deities: each of the 30 tithis has a presiding deity (BPHS). Nanda, Bhadra, Jaya, Rikta, Purna — the 5-tithi classification cycle that repeats. Which tithis are auspicious for which activities. | Lunar phase circle with all 30 tithis mapped. Paksha comparison diagram. Tithi-deity table. 5-classification cycle visual. | Identify paksha and tithi number from Moon-Sun elongation. Name the 5-group classification for any given tithi. |
| 5.3 | **Special Tithis & Vrat Calendar** | Ekadashi (11th): why fasting on Ekadashi is prescribed (Padma Purana connection, digestive rhythm, spiritual significance). The 24 named Ekadashis of the year. Parana rules (when to break the fast — Hari Vasara calculation). Amavasya: Pitra Tarpan, Sarva Pitri Amavasya (Mahalaya). Purnima: Satyanarayan Puja, Guru Purnima, Sharad Purnima. Chaturthi: Ganesh Chaturthi (Shukla), Sankashti Chaturthi (Krishna). Trayodashi: Pradosh Vrat (Shiva worship). How our app calculates Ekadashi Parana times (Dwadashi start + 1/4 duration). | Annual Ekadashi calendar with names. Parana calculation flowchart. Festival-tithi mapping table. | Name the tithi for 5 given festivals. Calculate approximate Parana time from Dwadashi start/end. |

#### Topic: Nakshatra — The 27 Lunar Mansions (4 modules, ~55 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 6.1 | **The 27 Nakshatras — India's Star Clock** | Why 27? The Moon takes ~27.3 days for one sidereal revolution — approximately 1 nakshatra per day. Formula: Nakshatra = floor(Moon° / 13.333°) + 1. Each nakshatra's span: 13°20'. The yogtara (junction star) for each nakshatra. 27 nakshatras as 27 wives of Chandra (Daksha's daughters) — mythology and its astronomical encoding. Complete list with Sanskrit name, meaning, yogtara (modern star name), symbol, deity, shakti (power). The 28th nakshatra controversy: Abhijit (part of Uttarashada-Shravana) — when it's used and when it's not. | Nakshatra wheel with star positions. Full 27-nakshatra reference table. Abhijit location visual. | Compute nakshatra from Moon longitude. Name the yogtara, deity, and shakti for any given nakshatra. |
| 6.2 | **Padas — The Navamsha Connection** | Each nakshatra = 4 padas of 3°20' each. Total: 27 × 4 = 108 padas = 108 navamshas. The pada-navamsha-sign mapping: Ashwini Pada 1 = Aries navamsha, Pada 2 = Taurus, Pada 3 = Gemini, Pada 4 = Cancer. The element cycle: fire signs start nakshatras 1,10,19; earth signs start 2,11,20; etc. Why pada matters: baby naming syllables come from the pada. The first syllable of a name should match the pada syllable. Complete pada-syllable table for all 108 padas. Pada and Navamsha chart construction — how knowing the pada gives you the D9 sign directly. | Pada-syllable master table. Pada→Navamsha element cycle diagram. Baby name selection flowchart. | Given Moon's exact degree, compute nakshatra + pada + baby name syllable + navamsha sign. |
| 6.3 | **Nakshatra Lords & the Vimshottari Connection** | The Vimshottari Dasha sequence: Ketu(7) → Venus(20) → Sun(6) → Moon(10) → Mars(7) → Rahu(18) → Jupiter(16) → Saturn(19) → Mercury(17) = 120 years total. Each nakshatra ruled by one of these 9 planets, repeating 3 times: Ashwini=Ketu, Bharani=Venus... Magha=Ketu (10th, restart), etc. How birth nakshatra determines the starting dasha and remaining period. Worked example: Moon at 47° = Krittika (3rd nakshatra, lord = Sun). Position within nakshatra determines how much of Sun dasha remains at birth. This single calculation determines the entire dasha timeline for life. Why Vimshottari was chosen as the "default" system (Moon in Shravana at the start of Kali Yuga). | Nakshatra-lord mapping wheel (3 cycles of 9). Dasha-balance calculation worked example. 120-year timeline visual. | Calculate starting dasha and balance from Moon's exact position. Map any nakshatra to its Vimshottari lord. |
| 6.4 | **Gana, Yoni, Nadi & Compatibility Factors** | Three gana classifications: Deva (divine temperament — gentle, sattvic), Manushya (human — balanced, rajasic), Rakshasa (fierce — intense, tamasic). Which nakshatras belong to which gana. The 14 Yoni (animal symbols) used in compatibility: Horse, Elephant, Sheep, Serpent, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion. Natural friends and enemies among yonis. Nadi: Aadi (Vata), Madhya (Pitta), Antya (Kapha) — Ayurvedic constitution connection. Why Nadi match carries the highest weight (8 points) in Ashta Kuta matching. The Stree-Dirgha rule. Detailed compatibility scoring worked example between two nakshatras. | Gana classification chart (27 nakshatras grouped into 3). Yoni compatibility matrix (14×14). Nadi assignment table. | Score the compatibility between two given nakshatras across Gana, Yoni, and Nadi factors. |

#### Topic: Yoga, Karana & Vara (3 modules, ~40 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 7.1 | **Panchang Yoga — The Sun-Moon Sum** | Formula: Yoga = floor((Sun° + Moon°) / 13.333°) + 1. Why the SUM (not difference like Tithi)? Tithi measures the Moon-Sun gap (phase), Yoga measures their combined energy. 27 Yogas with names, meanings, and nature (auspicious/inauspicious/neutral). The 9 auspicious yogas: which activities they support. The 9 inauspicious yogas: what to avoid. Vishkambha (1st) through Vaidhriti (27th) — complete list with practical guidance. Yoga transitions happen ~daily. How to check today's yoga on our app. Connection to Muhurta — certain yogas cancel inauspicious tithis and vice versa. | All 27 yogas reference card with color-coded nature. Yoga transition timing diagram. Yoga-Tithi interaction table. | Calculate yoga from given Sun+Moon positions. Identify which of the 27 yogas is auspicious/inauspicious. |
| 7.2 | **Karana — The Half-Tithi System** | Formula: Karana = floor((Moon° - Sun°) / 6°) + 1. Each tithi = 2 karanas. 11 total karanas: 7 Chara (movable, repeat 8 times = 56) + 4 Sthira (fixed, appear once each = 4). 56 + 4 = 60 karanas per lunar month. The 7 Chara: Bava, Balava, Kaulava, Taitila, Gara, Vanija, Vishti. The 4 Sthira: Shakuni, Chatushpad, Naga, Kimstughna. Vishti (Bhadra) — the one everyone fears. When Bhadra falls and why activities should be avoided. Bhadra's mouth direction (above/below Earth) and why some Bhadra periods are worse than others. Practical karana selection for muhurta. | Karana-in-tithi mapping table (which karana in which half). Vishti/Bhadra occurrence pattern. Chara vs Sthira visual. | Calculate karana from Moon-Sun elongation. Identify Vishti Karana periods. Explain why there are 60 karanas per month. |
| 7.3 | **Vara — The Weekday Order & Hora System** | India's contribution: the 7-day week derives from the Hora system. Orbital speed order: Saturn→Jupiter→Mars→Sun→Venus→Mercury→Moon. 24 horas per day, cycling through this order. 24 mod 7 = 3 — skip 3 in the orbital order to get the weekday sequence. Full derivation with visual proof. Cross-cultural evidence: Latin, English, Japanese all name days after the same 7 planets. Each day's ruling planet, deity, Disha Shool direction, favorable/unfavorable activities. The Hora table: how to find the ruling planet for any hour of any day. Practical application: choosing the right hora for activities. | Hora derivation "skip-3" visual. Cross-cultural day-name comparison table. Hora calculation table. | Derive the weekday order from the hora system. Identify the ruling hora for a given day and hour. |

---

### Phase 3: The Chart (~4 hours total)

#### Topic: Kundali Construction (4 modules, ~55 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 9.1 | **What Is a Birth Chart?** | A birth chart (Kundali/Janma Patri/Janam Kundali) is a map of the sky at the exact moment and place of birth. What it captures: the rising sign (Lagna), positions of 9 planets in 12 houses, and the mathematical relationships between them. Why birth TIME matters (Lagna changes every ~2 hours). Why birth PLACE matters (latitude affects house calculations, longitude affects time correction). The concept of "freezing the sky" at one moment. North Indian vs South Indian chart styles — structural differences. Reading a North Indian chart: which house is where. Reading a South Indian chart: signs are fixed, houses rotate. Why some regions prefer one style. | Annotated North Indian chart with house numbers. Annotated South Indian chart. Side-by-side comparison. | Identify houses in both chart styles. Explain why birth time accuracy matters. |
| 9.2 | **Computing the Lagna (Ascendant)** | The Lagna is the sign rising on the Eastern horizon at the moment of birth. It changes every ~2 hours (12 signs × 2 hours ≈ 24 hours). But signs don't rise at equal speeds — at the equator, each sign takes exactly 2 hours. At higher latitudes, some signs rise faster (signs of short ascension) and some slower (signs of long ascension). The oblique ascension problem. Computing Local Sidereal Time from birth time + longitude. The Lagna formula: LST → Ascendant degree using spherical trigonometry. Why traditional panchangs list Udaya Lagna windows — and how our app computes them. | Ascendant through the day diagram (12 windows). Oblique vs right ascension visual. LST computation walkthrough. | Estimate the Lagna sign for a given birth time. Explain why signs of short ascension rise faster. |
| 9.3 | **Placing the Planets — From Longitude to House** | The full pipeline: Birth datetime → Julian Day → Planetary longitudes (tropical) → Apply Ayanamsha → Sidereal longitudes → Determine sign → Determine house. For each of the 9 planets: compute tropical longitude using Meeus algorithms (our approach) or Swiss Ephemeris (professional approach). Apply Lahiri correction. Map to sign and house. Equal House system: each house = 30° from Lagna. Why Equal House is standard in Jyotish (vs Placidus in Western). Bhav Chalit: mid-cusp system where Lagna is the MIDPOINT of the 1st house. When planets shift houses between D1 and Bhav Chalit. | Full computation pipeline diagram. Equal House vs Bhav Chalit comparison. Planet-shifting example. | Determine which house a planet falls in given its longitude and the Lagna degree. Explain the difference between D1 and Bhav Chalit placement. |
| 9.4 | **Reading a Chart — Putting It All Together** | A complete worked example: August 15, 1947, 00:00 IST, New Delhi (India's independence chart). Step-by-step: compute Lagna (Taurus rising at ~3°), place Sun (Cancer), Moon (Cancer), Mars (Gemini), etc. Read the chart: Taurus Lagna = Venus is Lagna lord, placed in Cancer (3rd house) — diplomatic, communicative nation. 1st house: empty but lord Venus strong. 7th house (partnerships/foreign relations): Scorpio with Saturn+Ketu. 10th house (governance): Aquarius with Mars — strong governance but combative. The independence chart's Raja Yoga: 9th lord Saturn in 7th aspecting Lagna. Each house reading. Why this chart "works" for understanding India's trajectory. | Full Independence Day chart (North Indian style). House-by-house reading annotations. | Read a sample chart: identify Lagna lord, strongest planet, most afflicted house. Identify one yoga in a given chart. |

#### Topic: Bhavas — The 12 Houses (3 modules, ~40 min)

| Module | Title | Content Outline | Check Focus |
|--------|-------|----------------|-------------|
| 10.1 | **The 12 Houses — Complete Significations** | Each house governs specific life areas. 1st (Tanu Bhava): self, body, personality, health, general fortune. 2nd (Dhana): wealth, family, speech, food. 3rd (Sahaja): siblings, courage, communication, short travel. Through 12th (Vyaya): losses, foreign lands, moksha, expenditure. BPHS significations vs Phaladeepika significations — complete comparison. Body parts associated with each house. Directions governed. "Upachaya" concept: houses 3,6,10,11 where malefics actually do well. | Complete house signification reference card (all 12, with body parts, directions, Kalapurusha mapping). Upachaya explanation. | Given a life event, identify which house(s) it relates to. Name 5 significations of any given house. |
| 10.2 | **House Classifications — Kendra, Trikona, Dusthana** | Kendras (1,4,7,10): the pillars of the chart. Vishnu Sthanas — houses of sustenance. Kendra lords are strong but can cause Kendradhipati Dosha if benefic. Trikonas (1,5,9): Lakshmi Sthanas — houses of fortune. Trikona lords are always beneficial. Kendra + Trikona lord connection = Raja Yoga (the most important principle in predictive astrology). Dusthanas (6,8,12): Trik Bhavas — houses of difficulty. 6th = enemies/disease, 8th = death/transformation, 12th = losses/liberation. Paradox: malefics in dusthanas can be protective (Viparita Raja Yoga). Upachayas (3,6,10,11): houses of growth — malefics improve here with age. Marakasthanas (2,7): death-inflicting houses. | Classification wheel showing all 5 types. Raja Yoga formation diagram (Kendra × Trikona lords). Viparita Raja Yoga conditions. | Classify all 12 houses into their types. Identify potential Raja Yogas from Kendra-Trikona lord combinations for a given Lagna. |
| 10.3 | **House Lords — The Engine of Prediction** | "The lord of a house carries the house's energy wherever it goes." Lord of 7th in 6th = marital discord. Lord of 10th in 5th = career through creativity. The full matrix: each house lord in each of the 12 houses = 144 possible combinations (Phaladeepika covers all). Exchange of lords (Parivartana Yoga): two houses deeply linked. Retrograde lord: internalized house energy. Combust lord: weakened house signification. Lord in own house: very strong for that house. Lord in exaltation: extremely favorable. Lord in debilitation: challenging but remediable. Complete lordship table for all 12 Lagnas. | Lordship-by-Lagna matrix (12×12). House lord placement effect quick-reference. Parivartana visual. | Determine all house lords for a given Lagna. Predict the general effect of a given lord in a given house. |

#### Topic: Divisional Charts, Dashas, Transits (6 modules covered in existing detailed pages)

*Modules 11.1-11.3 (Divisional Charts), 12.1-12.3 (Dashas), 13.1-13.3 (Transits) follow the same deep format as above. Content for these already exists in our learn pages at /learn/vargas, /learn/dashas, /learn/gochar — to be modularized.*

---

### Phase 4: Applied Jyotish (~3 hours total)

*Modules 14.1-14.3 (Compatibility), 15.1-15.4 (Yogas & Doshas) follow the same format. Content exists at /learn/matching, /learn/yogas, /learn/doshas — to be modularized and deepened.*

---

### Phase 5: Classical Knowledge (~2 hours total)

*Modules 16.1-16.3 (Classical Texts) follow the same format. Content exists at /learn/classical-texts — to be modularized.*

---

**Total: ~50 substantial modules × 10-15 min each = ~8-12 hours of deep curriculum**
**Total question bank: ~50 modules × 10 questions = ~500 questions**

---

## 4. Progress Tracking

### Data Model
```typescript
interface UserProgress {
  modules: Record<string, ModuleProgress>;  // moduleId → progress
  topics: Record<string, TopicProgress>;
  phases: Record<string, PhaseProgress>;
  totalXP: number;
  level: number;          // 1-10
  streak: number;         // consecutive days
  lastActiveDate: string;
}

interface ModuleProgress {
  moduleId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  contentRead: boolean;       // true when reached end of content
  checkAttempts: number;
  checkPassed: boolean;
  bestScore: number;          // 0-100%
  completedAt?: string;
  timeSpentSeconds: number;
}

interface TopicProgress {
  topicId: string;
  modulesCompleted: number;
  modulesTotal: number;
  assessmentPassed: boolean;
  assessmentScore?: number;
}
```

### Unlock Logic
```
Module N+1 unlocks when Module N's knowledge check is passed (≥70%)
Topic Assessment unlocks when ALL modules in that topic are complete
Next Topic unlocks when current Topic Assessment is passed
Next Phase unlocks when ALL topics in current phase are complete
```

### XP System
```
Module content read:        +20 XP
Knowledge check passed:     +30 XP (first attempt)
                           +15 XP (subsequent attempts)
Perfect score (100%):       +20 XP bonus
Topic Assessment passed:    +100 XP
Phase completed:            +500 XP
Daily streak bonus:         +10 XP per day

Level thresholds:
  Level 1: 0 XP      (Beginner / आरम्भिक)
  Level 2: 200 XP    (Student / छात्र)
  Level 3: 500 XP    (Learner / शिक्षार्थी)
  Level 4: 1000 XP   (Knowledgeable / ज्ञानी)
  Level 5: 1800 XP   (Practitioner / अभ्यासी)
  Level 6: 2800 XP   (Scholar / विद्वान)
  Level 7: 4000 XP   (Expert / विशेषज्ञ)
  Level 8: 5500 XP   (Master / आचार्य)
  Level 9: 7500 XP   (Guru / गुरु)
  Level 10: 10000 XP (Jyotish Acharya / ज्योतिष आचार्य)
```

---

## 5. UI Design

### Module Page Layout
```
┌──────────────────────────────────────────────────┐
│  Phase 1 > Grahas > Module 2 of 4                │
│  ████████████░░░░░░░░ 50% complete               │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─ Module Content ─────────────────────────┐    │
│  │                                          │    │
│  │  [Paginated content — text + diagrams]   │    │
│  │                                          │    │
│  │  Page 2 of 3         [← Prev] [Next →]   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
│  ─── or after content is complete: ───           │
│                                                  │
│  ┌─ Knowledge Check ───────────────────────┐    │
│  │                                          │    │
│  │  Question 2 of 4                         │    │
│  │                                          │    │
│  │  Which planet is exalted in Cancer?      │    │
│  │                                          │    │
│  │  ○ Venus                                 │    │
│  │  ○ Mars                                  │    │
│  │  ● Jupiter                               │    │
│  │  ○ Saturn                                │    │
│  │                                          │    │
│  │                          [Check Answer]   │    │
│  └──────────────────────────────────────────┘    │
│                                                  │
├──────────────────────────────────────────────────┤
│  ⚡ 450 XP  │  Level 4: Knowledgeable  │  🔥 3d  │
└──────────────────────────────────────────────────┘
```

### Topic Overview Page
```
┌──────────────────────────────────────────────────┐
│  Grahas (Planets)                     Phase 1    │
│                                                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │Module 1│ │Module 2│ │Module 3│ │Module 4│   │
│  │  ✓     │ │  ✓     │ │ 🔓 cur │ │  🔒    │   │
│  │The Nine│ │Relation│ │Dignit- │ │Retro & │   │
│  │Grahas  │ │ships   │ │ies     │ │Combust │   │
│  │ 100%   │ │  85%   │ │  0%    │ │ locked │   │
│  └────────┘ └────────┘ └────────┘ └────────┘   │
│                                                  │
│  [Topic Assessment — unlocks after all modules]  │
└──────────────────────────────────────────────────┘
```

### Sidebar Enhancement
```
① The Sky
   ✅ Foundations        (3/3 modules)
   ✅ Grahas             (4/4 modules)
   🔵 Rashis             (1/3 modules)  ← in progress
   🔒 Ayanamsha          (locked)
```

---

## 6. Question Bank Structure

```typescript
interface Question {
  id: string;
  moduleId: string;
  type: 'mcq' | 'match' | 'true_false' | 'fill_blank' | 'visual';
  difficulty: 'easy' | 'medium' | 'hard';
  question: { en: string; hi: string };
  options?: { en: string; hi: string }[];     // for MCQ
  correctAnswer: number | string | boolean;    // index, value, or T/F
  explanation: { en: string; hi: string };     // shown after answering
  classicalRef?: string;                       // "BPHS Ch.34 v.7"
  relatedVisual?: string;                      // component name for visual questions
}
```

### Example Question Pool for Module 2.3 (Dignities)

```json
[
  {
    "id": "dig_01",
    "type": "mcq",
    "difficulty": "easy",
    "question": "In which sign is the Sun exalted?",
    "options": ["Taurus", "Aries", "Leo", "Libra"],
    "correctAnswer": 1,
    "explanation": "Sun is exalted in Aries (Mesha) at 10°. It is debilitated in Libra.",
    "classicalRef": "BPHS Ch.3 v.18"
  },
  {
    "id": "dig_02",
    "type": "mcq",
    "difficulty": "medium",
    "question": "A planet in its Moolatrikona sign is considered:",
    "options": ["Stronger than exaltation", "Equal to own sign", "Stronger than own sign but weaker than exaltation", "Weakest placement"],
    "correctAnswer": 2,
    "explanation": "Moolatrikona is a special portion of a planet's own sign where it is extra strong. Hierarchy: Exalted > Moolatrikona > Own Sign > Friendly > Neutral > Enemy > Debilitated."
  },
  {
    "id": "dig_03",
    "type": "match",
    "difficulty": "medium",
    "question": "Match each planet to its debilitation sign:",
    "pairs": [
      ["Sun", "Libra"],
      ["Moon", "Scorpio"],
      ["Mars", "Cancer"],
      ["Jupiter", "Capricorn"]
    ]
  },
  {
    "id": "dig_04",
    "type": "true_false",
    "difficulty": "easy",
    "question": "Saturn is exalted in Capricorn.",
    "correctAnswer": false,
    "explanation": "Saturn is exalted in LIBRA (Tula), not Capricorn. Capricorn is Saturn's OWN sign (Moolatrikona is Aquarius)."
  },
  {
    "id": "dig_05",
    "type": "fill_blank",
    "difficulty": "hard",
    "question": "The dignity hierarchy from strongest to weakest: Exalted → ___ → Own Sign → Friendly → Neutral → Enemy → Debilitated",
    "correctAnswer": "Moolatrikona",
    "explanation": "Moolatrikona falls between exaltation and own sign in the strength hierarchy."
  }
]
```

---

## 7. Storage Strategy

### Phase 1 (MVP): localStorage
- All progress stored client-side in localStorage
- Works without authentication
- Lost on browser clear / device change
- Sufficient for initial launch

### Phase 2: Supabase (authenticated users)
```sql
CREATE TABLE learn_progress (
  user_id UUID REFERENCES auth.users,
  module_id TEXT NOT NULL,
  status TEXT DEFAULT 'available',
  content_read BOOLEAN DEFAULT false,
  check_passed BOOLEAN DEFAULT false,
  best_score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, module_id)
);

CREATE TABLE learn_check_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  module_id TEXT NOT NULL,
  questions JSONB,       -- questions drawn for this attempt
  answers JSONB,         -- user's answers
  score INTEGER,
  passed BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Sync Strategy
- localStorage is primary (instant, offline)
- On login: merge localStorage progress with server
- Conflict resolution: take the more advanced state
- On new device login: pull from server → populate localStorage

---

## 8. Implementation Phases

### Impl Phase 1: Content Modularization
- Break existing learn pages into module components
- Each module is a React component with `moduleId` prop
- Content paginated within modules (2-3 pages per module)
- "Next" button advances pages or transitions to knowledge check

### Impl Phase 2: Question Bank
- Create JSON question bank per module
- Build `KnowledgeCheck` component (renders questions, scores, shows explanations)
- Randomized question selection from pool
- Pass/fail logic with retry

### Impl Phase 3: Progress Store
- Zustand store with localStorage persistence
- Unlock logic (module → topic → phase cascading)
- XP calculation and level system

### Impl Phase 4: UI Integration
- Topic overview pages showing module cards with status
- Sidebar showing completion badges per topic
- Progress bar in layout
- Level badge display

### Impl Phase 5: Supabase Sync
- Server-side progress tables
- Auth-gated sync
- Cross-device progress

---

## 9. Content Migration Strategy

Current learn pages are monolithic (single long page per topic). Migration:

1. **Identify natural break points** in each existing page
2. **Extract into module components** (e.g., `GrahasModule1.tsx`, `GrahasModule2.tsx`)
3. **Write question pools** for each module (8-12 questions per module)
4. **Add module wrapper** that handles pagination + knowledge check rendering
5. **Preserve all existing content** — no content loss, just restructuring

### Example: Current Grahas page (133 lines) → 4 modules
```
Current single page:
  - Planet list section        → Module 2.1: "The Nine Grahas"
  - Friendship matrix section  → Module 2.2: "Planetary Relationships"
  - Dignity explanation        → Module 2.3: "Dignities"
  - Orbital data              → Module 2.4: "Retrograde & Combustion"
```

Each module gets its own question pool. Total content INCREASES (questions + explanations add depth).

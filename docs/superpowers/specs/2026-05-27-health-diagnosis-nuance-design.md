# Nuanced Health Diagnosis — Design Spec

**Date:** 2026-05-27
**Author:** brainstorm session
**Status:** Draft — awaiting user review

---

## 1. Problem

The kundali summary today renders a single Health verdict — one of four Sanskrit tiers
(Uttama / Madhyama / Adhama / Atyadhama) — computed from houses 1, 6, 8 and the four
karaka planets (Sun, Moon, Mars, Saturn). This collapses an entire diagnostic picture
into one label and loses the practical signal classical Jyotish actually carries:

> "Your Sun is well-placed (vitality good), but Saturn is debilitated in the 6th and your
> 5th-lord is combust — so your overall verdict can be Madhyama while your *digestive*
> system is Atyadhama and your *bones* are Uttama."

In parallel, the `/medical-astrology` page already computes Prakriti, a 12-region body
map, a 10-year health timeline, and a current prognosis — but those modules are not
wired into the summary card and don't expose the strength-of-significator detail the
classical texts actually weigh.

**Goal of this spec:** Replace the single Health tier with a multi-axis diagnosis where
every meaningful health element has its own score derived from a defined matrix of
planetary, house, sign, dignity, strength, dasha, and transit factors — each
traceable to a classical source. The user sees both the overall picture *and* which
specific subsystem is the weakest link.

---

## 2. Classical sources consulted

We treat the following as authoritative — health interpretations in the matrix below
cite them by short code in square brackets, e.g. `[BPHS-24]`.

### Jyotish primary sources
- **`[BPHS]` Brihat Parashara Hora Shastra** — Ch. 24 (Roga Adhyaya / disease houses),
  Ch. 4 (planetary nature and dignities), Ch. 27 (Ashtakavarga), Ch. 45–47
  (Vimshottari dasha phala on health).
- **`[Saravali]` Saravali (Kalyana Varma)** — Ch. 5 (planetary diseases), Ch. 33
  (combinations producing illness).
- **`[Phala-Deepika]` Phala Deepika (Mantreswara)** — Ch. 8 (Roga adhyaya), Ch. 9
  (Maraka and Ayur — death-inflicting / longevity).
- **`[Jataka-Parijata]` Jataka Parijata (Vaidyanatha Dikshita)** — Ch. 5 house
  significations including health, Ch. 7 disease yogas.
- **`[Sarvartha-Chintamani]` Sarvartha Chintamani (Venkatesha)** — Ch. 4 disease yogas
  (Mahadosha, Andhya, Badhira, etc.), Ch. 10 prognosis.
- **`[Hora-Sara]` Hora Sara (Prithuyasas)** — Disease windows in Vimshottari periods.
- **`[Bhrigu-Samhita]`** — Disease-specific yogas (used cautiously; many recensions).
- **`[Jaimini]` Jaimini Sutras** — Karaka theory (especially `GK` Gnati Karaka /
  diseases, `AmK` Amatya Karaka / immunity).

### Ayurveda primary sources
- **`[Charaka]` Charaka Samhita** — Tridosha theory, Prakriti determination, Sutrasthana
  on rasa-rakta-mamsa-medas-asthi-majja-shukra dhatus, ojas as immunity substrate.
- **`[Sushruta]` Sushruta Samhita** — Surgical / anatomical correspondences, marma
  points (cross-walked to house-region map).
- **`[Ashtanga-Hridayam]` Ashtanga Hridayam (Vagbhata)** — Synthesis text used for
  body-region ↔ house correspondences where Charaka and Sushruta diverge.

### Specialised systems
- **`[KP]` Krishnamurti Paddhati** — Sub-lord theory for timing health events (only
  used in the dasha/transit activation layer, not the natal baseline).
- **`[Lal-Kitab]`** — Cited only for remedy suggestions, never for diagnosis itself
  (its disease attributions diverge from classical BPHS).

### Modern cross-references (validation, not authority)
- Modern Vedic medical astrology compilations are used only to *cross-check* that the
  matrix below isn't introducing novel claims unsupported by the primary sources.

---

## 3. Architecture of the diagnosis

Health is not one number. It is a stack of three layers:

```
┌──────────────────────────────────────────────────────────────┐
│ Layer 3: Time-dependent activation                           │
│   - Current mahadasha + antardasha health implication        │
│   - Current transits through health houses                   │
│   - Sade Sati / Dhaiya / 8th-house transit pressure          │
│   → Modifies Layer 1 scores up or down for *this period*     │
├──────────────────────────────────────────────────────────────┤
│ Layer 2: Constitutional baseline (Ayurveda overlay)          │
│   - Prakriti (Vata / Pitta / Kapha balance)                  │
│   - Dhatu strength (rasa → shukra) via planet-tissue map     │
│   → Sets the diathesis — which dosha is naturally elevated    │
├──────────────────────────────────────────────────────────────┤
│ Layer 1: Natal vulnerability per health element              │
│   - For each of N health elements, score from the matrix     │
│     below using house, lord, occupant, aspect, dignity,      │
│     shadbala, avastha, varga, yoga/dosha inputs              │
│   → Static for life. The "what tends to go wrong" baseline.  │
└──────────────────────────────────────────────────────────────┘
```

A user-facing element score = `Layer 1` × (1 + `Layer 3 multiplier`),
with `Layer 2` interpreted as the **mode** (how it manifests) rather than the
magnitude.

**Hard boundary** (§10 Q6): Jyotish texts govern Layer 1 only — *which*
planet/house/sign contributes. Ayurveda texts govern Layer 2 only — the
*mode* of expression. The two streams never cross-contaminate the scoring.

Example: A 45/100 natal vulnerability for "digestive" with Mars antardasha
running and Saturn currently transiting the 6th becomes ~70/100 for the next
~14 months — and the Ayurvedic mode says "expect Pitta-aggravated heartburn /
acidity, not Vata-driven constipation" because the user is Pitta-dominant.

---

## 4. The Health Element Matrix

This is the spec's centrepiece. **22 elements total: 19 visible by default + 3
opt-in.** For each: what it covers, the significators classical texts assign to
it, the strength inputs that modulate the score, the signature yogas/doshas that
flag elevated risk, and the activating factors that bring it forward in time.

**Element badges** (per §10 Q3) appear in the element header:
- *(Classical)* — direct grounding in BPHS / Saravali / Charaka / etc.
- *(Inferential)* — modern Jyotish synthesis with weaker classical grounding.
- *(opt-in)* — gated behind extended-analysis toggle (4.20, 4.21, 4.22).
- *(disclaimer-gated)* — Vedic-framing disclaimer required (4.17, 4.21, 4.22).
Elements without an explicit badge are Classical and default-visible.

### Notation
- **Planet IDs:** 0=Sun, 1=Moon, 2=Mars, 3=Mercury, 4=Jupiter, 5=Venus, 6=Saturn,
  7=Rahu, 8=Ketu.
- **Strength inputs** referenced everywhere mean the *standard* set:
  - `Shadbala` — six-fold strength (Sthana, Dig, Kala, Cheshta, Naisargika, Drik)
  - `Avastha` — Baladi (Bala/Kumara/Yuva/Vriddha/Mrita) + Lajjitadi (humiliated etc.)
  - `Dignity` — Exalted / Own / Moolatrikona / Friend / Neutral / Enemy / Debilitated
  - `Vargottama` — same sign in D1 and D9
  - `Combust` — within combustion orb (Mercury and Venus get reduced orbs if retrograde — see Lesson X)
  - `Retrograde` — direction of motion
  - `Vimsopaka` — composite varga strength
  - `Ashtakavarga bindus` — points in the relevant house
  - `Bhavabala` — strength of the relevant bhava itself
- **House role** for any planet is either *lord* (rules the sign on the cusp),
  *occupant* (sits in the house), or *aspecting* (drishti).

---

### 4.1 Vitality / Lifespan (Ayushya)

- **Covers:** General life force, recovery capacity, energy reserves, longevity
  potential.
- **Primary significators:**
  - Planets: Sun `[BPHS-4]` (atma karaka in the natural zodiac, jiva-shakti),
    Jupiter (jiva karaka, recovery), Saturn (Ayur karaka — paradoxically, because
    he is also the longevity granter when strong; `[Phala-Deepika-9]`).
  - Houses: 1st (sharira / body), 8th (Ayur Sthana — actual longevity house),
    3rd (parakrama / stamina — short-life support `[BPHS-24]`).
  - Signs: Lagna sign (vitality archetype).
- **Strength inputs (weighted):**
  - Sun's Shadbala ratio (≥1.0 baseline strong)
  - Lagna lord's dignity + Shadbala
  - 8th-lord dignity (strong 8th lord = long life; debilitated 8th lord = short)
  - Saturn's avastha (yuva = grants long life; mrita = does not)
  - Lagna's Bhavabala
- **Signature yogas / doshas:**
  - **Positive:** Atmakaraka exalted in D9, Lagna lord in own/exalted, Jupiter
    aspecting Lagna `[Jataka-Parijata-5]`.
  - **Negative:** Balarishta yogas (early-life mortality threats —
    `[BPHS-Balarishta]`), Lagna and Moon both in dusthana (6/8/12), Maraka
    planets (lords of 2 and 7) strongly placed when malefic-natured.
- **Activating factors:**
  - Maha/antar of 8th-lord, Maraka-period sandhis, Sun transit over natal 8th
    cusp, Saturn return.
- **Source:** `[BPHS-24]`, `[Phala-Deepika-9]`, `[Saravali-33]`.

---

### 4.2 Mental Health / Cognitive Stability (Manas)

- **Covers:** Emotional regulation, anxiety/depression tendency, clarity of mind,
  psychiatric vulnerability.
- **Primary significators:**
  - Planets: **Moon** (manas karaka — the single most important factor
    `[BPHS-4]`), Mercury (cognition, nervous system signal transmission),
    Jupiter (wisdom, optimism), Rahu (mental disturbance / addictive patterns),
    Ketu (dissociation, detachment).
  - Houses: 4th (chitta / settledness of mind), 5th (buddhi / discernment), 3rd
    (mental courage), 12th (sleep, subconscious).
  - Nakshatra of Moon — Gandanta Moon (last 3°20' of water sign before fire) is
    classically high-risk `[Saravali-5]`.
- **Strength inputs:**
  - Moon's Shadbala, Paksha bala (waxing strong, waning weak), avastha
  - Moon's house placement (4th/9th excellent; 6th/8th/12th vulnerable)
  - Mercury combust → cognitive fog signal
  - Aspects on Moon — Saturn aspect = depression; Mars aspect = irritability;
    Rahu conjunction = anxiety/addiction risk; Ketu conjunction = detachment.
- **Signature yogas / doshas:**
  - **Kemadruma yoga** — Moon with no planet in 2nd or 12th from it, and no
    planet in kendra from Moon. Classically a major mental-isolation/loneliness
    indicator `[BPHS-Kemadruma]`.
  - **Adhi yoga** — benefics in 6/7/8 from Moon → mental stability and
    leadership `[BPHS]`.
  - **Chandra-Mangala yoga** — Moon-Mars conjunction; emotional volatility.
  - **Grahan dosha** — Moon eclipsed by Rahu/Ketu axis.
  - **Pisaca yoga** — Moon with Rahu unaspected by benefic → psychiatric
    risk `[Saravali]`.
- **Activating factors:**
  - Moon, Mercury, Rahu mahadashas / antardashas.
  - Saturn transit over natal Moon (Sade Sati — 7.5 yrs) — stress, depression.
  - Eclipses on natal Moon's sign or nakshatra.
- **Source:** `[BPHS-4]`, `[Saravali-5]`, `[Charaka — manasika roga]`.

---

### 4.3 Digestive System (Jatharagni / Annavaha Srotas)

- **Covers:** Stomach acidity, gastritis, IBS, food sensitivities, appetite,
  metabolic fire (agni).
- **Primary significators:**
  - Planets: **Sun** (jatharagni — the digestive fire itself, `[Charaka-Sutra]`),
    Mars (pitta-agni / acid), Mercury (intestines specifically),
    Jupiter (liver and pancreas), Moon (stomach fluids, mucous lining).
  - Houses: 5th (stomach / upper GI), 6th (intestines / lower GI / disease),
    2nd (mouth and oesophagus — entry of food).
  - Sign: Cancer (stomach), Virgo (intestines).
- **Strength inputs:**
  - Sun's Shadbala (strong Sun = good agni)
  - Sun in own/exalted sign vs debilitated in Libra (weakens agni)
  - Mars dignity (strong pitta-Mars = sharp acid; debil Mars = sluggish digestion)
  - Mercury combust → mal-absorption signal
  - 5th and 6th house Bhavabala; their lords' dignity and placement
- **Signature yogas / doshas:**
  - **Chronic Digestive Pattern:** Saturn in 6th house OR 6th-lord debilitated
    `[Sarvartha-Chintamani-4]`.
  - **Mahodara yoga** — Jupiter afflicted in 5th, swelling/IBS tendency.
  - **Sun-Mercury combust in 5th** — chronic gastritis pattern `[Saravali]`.
  - **Pitta dosha (Ayurvedic, Layer 2):** elevated when Sun and Mars dominate.
- **Activating factors:**
  - Saturn transit through 5th or 6th
  - Mars antardasha (acute episodes)
  - 6th-lord dasha periods (digestive flare windows)
- **Source:** `[BPHS-24]`, `[Sarvartha-Chintamani-4]`, `[Charaka-Sutra]`,
  `[Ashtanga-Hridayam]`.

---

### 4.4 Cardiac / Circulatory System (Hridaya, Rasavaha Srotas)

- **Covers:** Heart conditions, blood pressure, palpitations, circulation.
- **Primary significators:**
  - Planets: **Sun** (the heart itself — the Sun rules the heart in classical
    medical Jyotish, `[BPHS-4]`, `[Charaka-Sutra]`), Mars (blood pressure),
    Moon (blood plasma / rasa dhatu).
  - Houses: 4th house (the heart, literally "hridaya" in the 4th's
    significations `[BPHS-12]`), Leo (Sun's own sign — chest/heart region).
  - Signs: Leo (chest cavity), Cancer (rasa / blood plasma).
- **Strength inputs:**
  - Sun's Shadbala and dignity
  - 4th house Bhavabala
  - 4th lord's placement (in dusthana → cardiac vulnerability)
  - Mars influences on 4th (aspect or occupancy)
- **Signature yogas / doshas:**
  - **Cardiac Risk Pattern:** Mars or Saturn in 4th or 10th (opposition),
    AND 4th house heavily afflicted `[BPHS-24]`.
  - **Sun debilitated with malefic in 4th** — congenital heart issue indicator
    `[Saravali-5]`.
  - **Pitta-dominant Prakriti + Mars in 4th** — hypertension signal (Ayurvedic).
- **Activating factors:**
  - Saturn transit over 4th, Sun, or natal 4th-lord
  - Mars dasha/antardasha with malefic transit support
  - Eclipses on Leo or 4th cusp
- **Source:** `[BPHS-24]`, `[Saravali-5]`, `[Charaka]`.

---

### 4.5 Respiratory System (Pranavaha Srotas)

- **Covers:** Lungs, bronchi, asthma, bronchitis, allergies of the airway.
- **Primary significators:**
  - Planets: **Mercury** (the lungs and bronchi — Mercury rules pulmonary
    vessels in classical correspondence `[Saravali-5]`), Saturn (chronic
    obstructive conditions, asthma onset later in life), Jupiter (immunity,
    protects when strong).
  - Houses: 3rd (chest, arms, lungs — explicit per `[BPHS-12]` — house of
    "vakshasthala", chest), 4th (chest cavity / pleural).
  - Sign: Gemini (lungs/arms), Cancer (chest cavity).
- **Strength inputs:**
  - Mercury's Shadbala, dignity, combust state
  - 3rd house Bhavabala and lord dignity
  - Malefics in 3rd or 4th
- **Signature yogas / doshas:**
  - **Respiratory Pattern:** Multiple malefics in 3rd OR 3rd lord debilitated
    AND afflicted by malefics `[Saravali]`.
  - **Saturn in 3rd or 4th aspecting Mercury** — chronic asthma indicator
    `[Sarvartha-Chintamani]`.
  - **Kapha dosha excess (Layer 2)** — mucus, bronchitis tendency.
- **Activating factors:**
  - Mercury combustion periods (esp. when Mercury is also natal-weak)
  - Saturn transit through 3rd / 4th
  - Mercury and Saturn dasha overlaps
- **Source:** `[BPHS-12, 24]`, `[Saravali-5]`, `[Ashtanga-Hridayam]`.

---

### 4.6 Nervous System (Manovaha Srotas + Vata)

- **Covers:** Anxiety, tremors, neuropathy, Parkinson's-type degeneration,
  vertigo, sciatica (overlaps with bones for sciatica).
- **Primary significators:**
  - Planets: **Mercury** (nervous signal — Mercury rules the nervous system
    explicitly per `[Saravali]`), **Saturn** (Vata aggravation, degeneration),
    **Rahu** (uncontrolled nervous responses, panic).
  - Houses: 1st (overall nervous tone), 3rd (peripheral nerves of arms),
    11th (peripheral nerves of legs/ankles — calves).
- **Strength inputs:**
  - Mercury's dignity + Shadbala
  - Saturn's dignity (vata aggravation is worse when Saturn is also debilitated
    or in nakshatra of malefic)
  - Rahu's house placement
- **Signature yogas / doshas:**
  - **Nervous System / Vata Pattern:** Rahu or Saturn in Lagna AND Moon
    debilitated/combust `[BPHS-24]`.
  - **Mercury-Saturn conjunction in Lagna** — chronic anxiety / OCD
    signal `[Saravali]`.
  - **Vata dosha excess (Layer 2)** — Saturn-dominant + Rahu prominent.
- **Activating factors:**
  - Saturn or Rahu dasha; Mercury antardasha when Mercury is afflicted
  - Saturn return (~age 29-30, ~58-60)
- **Source:** `[BPHS-24]`, `[Saravali-5]`, `[Charaka — Vatavyadhi]`.

---

### 4.7 Bones / Joints / Skeletal (Asthi Dhatu)

- **Covers:** Arthritis, osteoporosis, fractures, spinal issues, joint pain.
- **Primary significators:**
  - Planets: **Saturn** (the asthi karaka — Saturn rules bones, `[BPHS-4]`,
    `[Charaka-Sutra]`), Sun (skeletal frame's vitality, calcium absorption).
  - Houses: 10th (knees and spine — `[BPHS-12]`), 8th (chronic joint issues),
    11th (ankles), 9th (hips and thighs).
  - Sign: Capricorn (knees), Aquarius (calves and ankles).
- **Strength inputs:**
  - Saturn's Shadbala, dignity, avastha
  - 10th house Bhavabala
  - Sun's strength (vitality of frame)
- **Signature yogas / doshas:**
  - **Saturn debilitated in Aries with afflicted 10th** — chronic spine/joint
    issues `[Saravali-5]`.
  - **Sade Sati active** — joint pain and chronic fatigue flare windows
    `[BPHS-46]`.
  - **Mangal-Shani conjunction (Mars-Saturn) in 10th** — fracture risk
    `[Phala-Deepika]`.
- **Activating factors:**
  - Saturn mahadasha (esp. after age 45)
  - Sade Sati phases (peak phase = Saturn over natal Moon)
  - Saturn transit over 10th, 8th
- **Source:** `[BPHS-24, 4]`, `[Charaka]`, `[Saravali]`.

---

### 4.8 Muscular / Inflammation / Blood Pressure (Mamsa Dhatu + Rakta)

- **Covers:** Muscle cramps, inflammation (arthritis-flare type), hypertension,
  rage-driven cardiovascular events.
- **Primary significators:**
  - Planets: **Mars** (mamsa karaka — Mars rules muscle and red blood
    `[BPHS-4]`, `[Charaka-Sutra]`), Sun (heat / vitality), Rahu (unexplained
    inflammation).
  - Houses: 3rd (arms, muscular strength), 6th (acute inflammation /
    "shotha"-type disease), Lagna (overall muscle tone).
- **Strength inputs:**
  - Mars Shadbala, dignity, retrograde state, combust state
  - 3rd house Bhavabala
- **Signature yogas / doshas:**
  - **Mars combust + 6th house malefic** — acute inflammation episodes
    `[Saravali]`.
  - **Mars-Rahu conjunction** — uncontrolled hypertension, anger-driven blood
    pressure `[Sarvartha-Chintamani]`.
- **Activating factors:**
  - Mars dasha or antardasha
  - Mars retrograde transits (esp. through 6th, 8th)
- **Source:** `[BPHS-4, 24]`, `[Charaka — Raktapitta]`.

---

### 4.9 Skin / Hair / Outer Appearance (Twak Dhatu)

- **Covers:** Eczema, psoriasis, acne, vitiligo, baldness, premature greying,
  rashes, allergies of the skin.
- **Primary significators:**
  - Planets: **Mercury** (skin texture and sensitivity — Mercury is twak karaka
    in many recensions `[Saravali-5]`), **Venus** (skin lustre, hair
    quality, complexion), **Saturn** (chronic skin disease, vitiligo, dry skin),
    **Mars** (acne, boils, eruptions when over-active).
  - Houses: 6th (skin diseases generally `[BPHS-24]`), 2nd (face / facial
    skin), 8th (chronic skin disease).
  - Sign: Cancer (water content / hydration), Virgo (skin's microbiome /
    detoxification).
- **Strength inputs:**
  - Mercury combust → sensitivity / contact dermatitis signal
  - Venus debilitated or in 6th → complexion issues, hair loss
  - Saturn in 2nd or 6th → chronic / vitiligo-type concerns
- **Signature yogas / doshas:**
  - **Mercury + Saturn in 6th** — chronic eczema signature `[Saravali]`.
  - **Mars + Sun in 2nd or 6th** — acne / rosacea (pitta).
  - **Rahu in 6th** — alien-substance reactions / autoimmune skin disease (modern
    cross-reference, supported by `[Bhrigu-Samhita]` patterns).
- **Activating factors:**
  - Mercury or Venus dasha — Mercury antar for sensitivity flares
  - Saturn transit through 6th
- **Source:** `[BPHS-24]`, `[Saravali-5]`.

---

### 4.10 Eyes / Vision

- **Covers:** Refractive error, cataracts, glaucoma, retinal issues, dry-eye
  syndrome.
- **Primary significators:**
  - Planets: **Sun** (right eye in males, left eye in females — explicit gender
    mapping per `[BPHS-12]`), **Moon** (the opposite — left in males, right in
    females), Venus (lustre of the eye), Mercury (the optic nerve).
  - Houses: 2nd (right eye — `[BPHS-12]`), 12th (left eye), 6th (eye diseases
    generally).
  - Sign: Pisces is classically associated with feet but also rules sleep/eyes
    in `[Phala-Deepika]` due to its 12th-house affinity.
- **Strength inputs:**
  - Sun and Moon combust state
  - Sun and Moon dignity
  - 2nd and 12th house Bhavabala, lord placements
- **Signature yogas / doshas:**
  - **Andhya yoga** — Sun + Moon in 2nd, with Mars present →
    blindness/severe-vision signal `[Sarvartha-Chintamani-4]`.
  - **Sun in 12th or 2nd with malefic** — astigmatism / chronic eye strain.
  - **Eye / Sleep Pattern:** 12th house afflicted AND Sun OR Moon debilitated
    (current code matches this).
- **Activating factors:**
  - Sun and Moon dashas
  - Eclipses on Sun or Moon's natal nakshatra
  - Saturn transit through 2nd or 12th
- **Source:** `[BPHS-12, 24]`, `[Sarvartha-Chintamani-4]`, `[Saravali-5]`.

---

### 4.11 Reproductive / Sexual Health (Shukra Dhatu)

- **Covers:** Fertility, libido, hormonal balance, menstrual issues, prostate /
  uterine health, sexually transmitted conditions.
- **Primary significators:**
  - Planets: **Venus** (shukra karaka — Venus literally is "shukra" in Sanskrit
    and rules reproductive fluid, `[BPHS-4]`, `[Charaka-Sutra]`), Mars
    (menstruation in women, vigour in men), Moon (cyclical / hormonal — strong
    feminine-cycle signal for women), Jupiter (fertility — putra-karaka,
    relevant to conception).
  - Houses: **7th** (genitals — `[BPHS-12]` — Madhya pradesha is the literal
    word used: "private region"), 8th (chronic reproductive disease),
    5th (conception / progeny).
  - Sign: Scorpio (genitals, sexual organs).
- **Strength inputs:**
  - Venus's Shadbala, dignity, combust state, retrograde
  - 7th house Bhavabala and lord placement
  - For fertility specifically: Jupiter + 5th lord dignity
- **Signature yogas / doshas:**
  - **Urogenital Pattern:** Venus combust or debilitated AND 7th house
    afflicted (current code matches this — `[Sarvartha-Chintamani]`).
  - **Venus in 6th** — chronic urogenital concerns.
  - **Mars in 7th** — Mangal Dosha (relevant for marriage but also a
    reproductive-discomfort signal in women — menstrual cramps, painful
    intercourse).
- **Activating factors:**
  - Venus dasha, Jupiter dasha for fertility windows
  - 7th-lord dasha periods
- **Source:** `[BPHS-4, 12, 24]`, `[Charaka — Shukravaha Srotas]`,
  `[Sarvartha-Chintamani]`.

---

### 4.12 Endocrine / Hormonal *(Inferential)*

- **Covers:** Thyroid, diabetes, adrenal fatigue, pituitary issues.
- **Primary significators:**
  - Planets: **Jupiter** (pancreas — Jupiter's medha karaka role and its
    rulership of liver-pancreas system; diabetes signal `[Jataka-Parijata-5]`),
    Venus (hormonal balance generally), Moon (cyclical hormones).
  - Houses: 5th (pancreas — Jupiter's natural house, classically tied to
    medha/intelligence which Charaka ties to pancreatic ojas).
- **Strength inputs:**
  - Jupiter dignity and Shadbala (Jupiter debilitated in Capricorn → diabetes
    diathesis classical signal)
  - 5th house Bhavabala
- **Signature yogas / doshas:**
  - **Jupiter debilitated in 5th or 6th** — diabetes signal `[Saravali]`.
  - **Jupiter-Venus mutual aspect with Saturn affliction** — hormonal imbalance.
- **Activating factors:**
  - Jupiter mahadasha (esp. with debility activation)
  - Saturn transit over natal Jupiter
- **Source:** `[Jataka-Parijata-5]`, `[Saravali-5]`. **Note:** Endocrine
  diagnosis in Jyotish is more inferential than in BPHS — modern correspondences
  carry less classical weight than items 4.1–4.11.

---

### 4.13 Immunity / Ojas (Resistance to disease)

- **Covers:** General immune competence, recovery speed, susceptibility to
  infections.
- **Primary significators:**
  - Planets: **Jupiter** (ojas karaka — Jupiter's strength correlates with
    "satva" and "bala", `[Charaka-Sutra]`), Sun (vitality / agni indirectly
    feeds ojas), Lagna lord (overall sharira-bala).
  - Houses: 1st (sharira / body's defence frame), 8th (depletion of vitality
    if afflicted).
  - Karaka: Jaimini's **Amatya Karaka** is sometimes tied to immune-system
    response in modern medical-Jyotish synthesis `[Jaimini]`.
- **Strength inputs:**
  - Jupiter's Shadbala, dignity, avastha
  - Lagna lord dignity and placement
  - Sun's avastha
- **Signature yogas / doshas:**
  - **Jupiter in dusthana (6/8/12) with no aspect from benefic** — low immunity
    signal.
  - **Sade Sati active** — ojas depletion period `[BPHS-46]`.
- **Activating factors:**
  - Jupiter return (~12 yrs)
  - Saturn transit over natal Jupiter
  - 6th-lord antardasha periods
- **Source:** `[Charaka-Sutra]`, `[Jaimini]`, `[BPHS]`.

---

### 4.14 Chronic / Hidden Disease (Gupta Roga)

- **Covers:** Auto-immune disorders, slow-onset chronic diseases, hard-to-diagnose
  conditions, tumours, cancer diathesis.
- **Primary significators:**
  - Planets: **Saturn** (chronicity itself — Saturn IS chronic, `[BPHS-4]`),
    **Rahu** (mysterious / undiagnosable diseases), **Ketu** (hidden,
    psychosomatic, sudden — appendicitis-type), Mars (sudden surgical
    interventions).
  - Houses: **8th** (gupta roga sthana — the literal hidden-disease house
    `[BPHS-24]`), 12th (hospitalisation), 6th (acute disease — feeds into 8th
    when sustained).
- **Strength inputs:**
  - 8th house Bhavabala (strong 8th = good resistance to chronic disease
    paradoxically; **weak** 8th = vulnerability)
  - 8th lord dignity
  - Saturn-Rahu axis placement
- **Signature yogas / doshas:**
  - **Chronic Hidden Disease Pattern:** 8th house heavily afflicted (vulnerability
    > 55, current code matches).
  - **Saturn + Rahu in same house** — classical cancer/tumour signature
    `[Bhrigu-Samhita]` (used cautiously).
  - **Ketu in 8th aspected by Mars** — sudden surgical events.
- **Activating factors:**
  - Saturn or Rahu dasha
  - 8th-lord dasha periods (high risk)
  - Saturn-Rahu conjunction transits
- **Source:** `[BPHS-24]`, `[Saravali-5]`, `[Phala-Deepika-9]`.

---

### 4.15 Accidents / Injuries / Trauma

- **Covers:** Vehicle accidents, falls, burns, cuts, surgical trauma, violence.
- **Primary significators:**
  - Planets: **Mars** (the karaka for accidents, weapons, blood, sudden
    injury — `[BPHS-4]`, `[Phala-Deepika-9]`), Rahu (vehicular accidents
    specifically, electric/chemical), Ketu (sudden falls, mystery injury).
  - Houses: 8th (sudden trauma), 4th (vehicles), 6th (accidents at work).
- **Strength inputs:**
  - Mars dignity, retrograde state, conjunctions
  - 8th house affliction
- **Signature yogas / doshas:**
  - **Mars + Rahu conjunction in 8th or 4th** — vehicular accident risk
    `[Sarvartha-Chintamani]`.
  - **Mars-Saturn opposition** — fracture / surgical injury risk.
  - **Sade Sati phase + Mars antardasha** — peak accident-watch window.
- **Activating factors:**
  - Mars dasha/antardasha
  - Mars transit retrograde (esp. through 8th)
  - 8th-lord dasha periods
- **Source:** `[BPHS-24]`, `[Phala-Deepika-9]`.

---

### 4.16 Surgery / Hospitalisation

- **Covers:** Likelihood of major surgery, length of hospital stays.
- **Primary significators:**
  - Planets: Mars (the surgeon, the knife), Saturn (chronic hospitalisation,
    long stays), Ketu (sudden surgery, often without prior diagnosis).
  - Houses: 8th (surgical event itself), 12th (hospitalisation / confinement).
- **Strength inputs:**
  - Mars dignity, 8th house affliction
  - 12th house affliction (separate from 8th)
- **Signature yogas / doshas:**
  - **Mars-Saturn in 8th** — surgical intervention strong signal.
  - **12th lord in 6th OR 6th lord in 12th** — hospitalisation pattern
    `[Saravali]`.
- **Activating factors:**
  - 8th-lord dasha activating surgical-need windows
  - Saturn transit on natal Mars
- **Source:** `[BPHS-24]`, `[Saravali]`.

---

### 4.17 Psychiatric / Severe Mental Illness *(Classical, disclaimer-gated)*

- **Covers:** Bipolar disorder, schizophrenia, psychosis, severe depression
  requiring intervention. Distinct from 4.2 (which is everyday mental health).
- **Primary significators:**
  - Planets: Moon afflicted heavily, Rahu (delusions / paranoia), Mercury
    afflicted (cognitive break), Ketu (dissociation).
  - Houses: 4th (chitta), 5th (intellect — buddhi-bhrama / confusion of
    intellect), 12th (subconscious imbalance).
- **Strength inputs:**
  - Moon-Rahu conjunction in dusthana
  - Mercury debilitated AND combust AND in dusthana
- **Signature yogas / doshas:**
  - **Anxiety / Mental Health Pattern:** Rahu in 5th + Mercury debilitated or
    combust `[Sarvartha-Chintamani]` (current code matches).
  - **Pisaca yoga** — Moon-Rahu with no benefic aspect `[Saravali]`.
  - **Buddhi-bhrama yoga** — Mercury, Moon, Rahu mutual aspect.
- **Activating factors:**
  - Moon, Rahu, Ketu mahadasha overlaps
  - Eclipses on natal Moon's degree
- **Source:** `[Saravali-5]`, `[Sarvartha-Chintamani]`, `[Charaka — Unmada]`.

---

### 4.18 Addictions / Substance Vulnerability

- **Covers:** Alcohol, drugs, gambling addiction, behavioural addictions.
- **Primary significators:**
  - Planets: **Rahu** (the primary addiction karaka — Rahu = unnatural craving,
    `[Saravali]`), Moon (emotional eating, sentiment-driven addiction), Mars
    (impulsive addiction), Venus (pleasure-seeking addictions),
    Ketu (renunciation when strong — but obsessive isolation when afflicted).
  - Houses: 12th (foreign substances, escapism), 6th (vices), 8th (hidden
    addictions).
- **Strength inputs:**
  - Rahu's house and aspects
  - Moon's affliction by Rahu
  - 12th-lord placement
- **Signature yogas / doshas:**
  - **Moon-Rahu in 12th** — substance addiction signal `[Saravali-5]`.
  - **Venus-Mars-Rahu mutual aspect** — pleasure-driven addiction.
- **Activating factors:**
  - Rahu dasha/antardasha
  - Lunar nodal returns
- **Source:** `[Saravali]`, `[Sarvartha-Chintamani]`, modern Jyotish synthesis.

---

### 4.19 Sleep / Dreams / Sub-conscious

- **Covers:** Insomnia, nightmares, sleep apnea, REM disturbances.
- **Primary significators:**
  - Planets: Moon (sleep itself), Saturn (sleep disruption / late-night
    patterns), Ketu (dream activity / nightmares), Mercury (mental chatter
    blocking sleep).
  - Houses: **12th** (shayya sukha — bed comfort / sleep — `[BPHS-12]`).
- **Strength inputs:**
  - 12th house Bhavabala
  - Moon's Paksha bala (waning Moon = sleep difficulty)
  - Saturn aspect on 12th or Moon
- **Signature yogas / doshas:**
  - **Moon-Saturn opposition** — chronic insomnia `[Saravali]`.
  - **Ketu in 12th** — nightmare-prone, vivid dream-state.
- **Activating factors:**
  - Saturn transit through 12th
  - Moon's monthly nakshatra transit (acute episodes around natal Moon's day)
- **Source:** `[BPHS-12]`, `[Saravali]`.

---

### 4.20 Allergies / Autoimmune / Hypersensitivity *(opt-in, Inferential)*

- **Covers:** Hay fever, food allergies, autoimmune diseases.
- **Primary significators:**
  - Planets: **Rahu** (the foreign-substance reaction karaka — Rahu's "alien"
    nature classically corresponds to immune misfires), Mercury (sensitivity
    of skin and nerves), Ketu (autoimmune detachment — the body attacking
    itself).
  - Houses: 6th (immune disease), 1st (overall sensitivity tone).
- **Strength inputs:**
  - Rahu's house placement (especially Rahu in 6th → autoimmune)
  - Mercury combust + nakshatra of malefic
- **Signature yogas / doshas:**
  - **Rahu in 6th** — autoimmune signal (modern medical-Jyotish synthesis;
    cross-referenced with `[Bhrigu-Samhita]` patterns).
  - **Mercury debilitated with Rahu aspect** — multiple chemical sensitivity.
- **Activating factors:**
  - Rahu dasha, Mercury antar within Rahu maha
- **Source:** `[Saravali]`, modern Jyotish synthesis (clearly flagged as
  inferential, not literal in BPHS).

---

### 4.21 Cancer / Tumour / Malignancy (Arbuda) *(opt-in, mixed Classical + Inferential)*

- **Covers:** Cancer diathesis. **This element is the most caveated — Jyotish
  identifies a vulnerability pattern, not a diagnosis.**
- **Primary significators:**
  - Planets: **Saturn + Rahu axis** (the classical malignancy signature —
    Saturn for chronic-cellular-degeneration plus Rahu for unnatural growth,
    `[Bhrigu-Samhita]`, `[Saravali]`), Mars when joined with this axis (acute
    transition).
  - Houses: 8th (malignancy house), 6th (the disease itself), sign-specific:
    Cancer (the sign) afflicted has folk-correlation to breast/lymph
    (cautiously cited).
- **Strength inputs:**
  - Strong Saturn-Rahu mutual aspect or conjunction
  - 8th house Bhavabala very low
  - Lagna and Moon both in dusthana
- **Signature yogas / doshas:**
  - **Saturn + Rahu in same house OR mutual 7th aspect** — primary
    malignancy-diathesis pattern `[Saravali]`, `[Bhrigu-Samhita]`.
  - **8th lord debilitated and combust** — cancer-vulnerability flag.
- **Activating factors:**
  - Saturn/Rahu dasha overlaps
  - 8th lord activating period
- **Source:** `[Saravali-5]`, `[Bhrigu-Samhita]`, `[Sarvartha-Chintamani]`.
- **Opt-in gated** (per §10 Q1). Hidden by default; revealed only when user
  toggles "show extended analysis."
- **Disclaimer required** (per §10 Q7, Vedic-framing tone). Surfaced
  prominently on first display.
- **Inferential badge** (per §10 Q3) — modern-medical framings within this
  element are flagged Inferential.

---

### 4.22 Aging / Longevity Specifics (Markesha, Maraka windows) *(opt-in, Classical)*

- **Covers:** Identifying specific life-stage windows of elevated mortality risk
  (Bala / Madhya / Vridha Arishta — 0–8, 8–32, 32+ year windows per BPHS).
- **Primary significators:**
  - Planets: Saturn (Ayur karaka — longevity granter), 8th lord, Maraka lords
    (2nd and 7th lords — `[Phala-Deepika-9]`).
  - Houses: 8th (Ayur sthana), 3rd (parakrama — vitality reserve), 2nd and 7th
    (Maraka houses).
- **Strength inputs:**
  - 8th lord dignity and Shadbala
  - Saturn's avastha
  - Lagna lord vs 8th lord strength comparison
- **Classical Ayur calculation methods:**
  - **Pinda Ayurdaya** (`[BPHS-Ayur]`) — planet-life years summed by strength
  - **Amsha Ayurdaya** — same but weighted by nakshatra position
  - **Naisargika Ayurdaya** — natural lifespan by Saturn's dignity
  - Three methods triangulated; the consensus output is the longevity
    classification: Alpa (short, <32), Madhya (middle, 32–70), Purna (long, >70).
- **Activating factors:**
  - Maraka dasha periods
  - 8th lord dasha onset
  - Saturn transit over natal Lagna and 8th cusp
- **Source:** `[BPHS-Ayur]`, `[Phala-Deepika-9]`, `[Hora-Sara]`.
- **Opt-in gated** (per §10 Q1). Hidden by default.
- **Display rule** (per §10 Q2): Classification (Alpa / Madhya / Purna)
  PLUS risk windows framed as "periods of extra care" derived from Maraka
  dasha onsets and 8th-lord activations. **Never** a numeric year of death
  or a year range.
- **Disclaimer required** (per §10 Q7, Vedic-framing tone).

---

## 5. Strength-input subsystem (the "planetary strength" layer the user emphasised)

For every element above, the same set of planetary strength inputs is consulted.
This is a single shared subsystem, not 22 separate copies:

| Strength axis | Source file | Already exists? | Notes |
|---|---|---|---|
| Shadbala (six-fold) | `src/lib/kundali/shadbala.ts` | yes | use total strength + ratio |
| Ashtakavarga bindus | `src/lib/kundali/yoga-engine/` (and ashtakavarga modules) | yes | per-house bindus available |
| Avastha (Baladi) | `src/lib/kundali/avasthas.ts` | yes | use as 0–100 strength |
| Avastha (Lajjitadi) | `src/lib/kundali/avasthas.ts` | check | needs verification |
| Dignity | `src/lib/tippanni/dignity.ts` | yes | exalted/own/etc. |
| Vargottama | `src/lib/kundali/sphutas.ts` (D1+D9 compare) | yes | derived |
| Combust | `src/lib/kundali/...` (combust function) | yes | with retrograde-orb correction |
| Vimsopaka | `src/lib/kundali/vimshopaka.ts` | yes | composite varga strength |
| Bhavabala | `src/lib/kundali/bhavabala.ts` | yes | per-house |
| Graha Yuddha | `src/lib/kundali/graha-yuddha.ts` | yes | winner-takes-precedence |

**Output of strength layer for each planet:** a normalised 0–100 score.
**Output of strength layer for each house:** a normalised 0–100 score.

These feed Layer 1 of the diagnosis. **No duplication** — every element uses the
*same* canonical strength numbers, just weighted differently per element.

---

## 6. Constitutional layer (Ayurveda overlay — Layer 2)

Already implemented in `src/lib/medical/prakriti.ts`. Output: Vata/Pitta/Kapha
percentages, primary + secondary dosha, prakriti type.

**How this modulates Layer 1:**

- Doesn't change Layer 1 scores. Layer 2 changes the **mode** — what kind of
  symptom shows up.
- Example: User has 60/100 digestive vulnerability and is Pitta-dominant →
  expect heartburn, ulcers, acid reflux. Same 60/100 in a Vata-dominant person
  → constipation, bloating, IBS.
- Surfaces as a side panel: "Your constitutional bias means digestive issues
  tend to manifest as Pitta-aggravated symptoms (heat, acidity)."

---

## 7. Activation layer (Layer 3 — time-dependent)

Already partially implemented in `src/lib/medical/health-prognosis.ts` and
`src/lib/medical/health-timeline.ts`. Needed extensions:

- **Current dasha/antardasha multiplier** per element. If user is in Mars
  antardasha, all Mars-significated elements (digestive Pitta, accidents,
  inflammation) get a +30% multiplier for this period.
- **Current transit multiplier** per element. Saturn transit through user's 4th
  → cardiac element gets +25%, sleep element gets +15%, etc.
- **Sade Sati phase multiplier** — universal across all elements during peak
  phase (Saturn over natal Moon).
- **Life-stage gate** — some elements only "activate" at certain life stages.
  E.g., element 4.7 (bones/joints) ramps up after age 35 regardless of natal
  score.

**Engine math:**

```
displayedScore(element, today) =
    natalScore(element)
    × (1 + dashaMultiplier(element, today))
    × (1 + transitMultiplier(element, today))
    × lifeStageGate(element, age)
```

Clamped to 0–100.

---

## 8. Output shape (the data contract — UI is downstream)

```ts
interface HealthDiagnosis {
  // Layer 1 — natal baseline
  natalElements: Array<{
    id: string;                      // e.g. 'digestive', 'cardiac'
    name: LocaleText;                // e.g. {en: 'Digestive System', hi: ...}
    category: 'physical' | 'mental' | 'systemic' | 'longevity';
    natalScore: number;              // 0–100 vulnerability
    rating: Rating;                  // uttama / madhyama / adhama / atyadhama
    factors: Array<ScoringFactor>;   // human-readable why
    classicalSignatures: Array<{     // which yogas / doshas matched
      id: string;
      name: LocaleText;
      source: string;                // citation, e.g. '[BPHS-24]'
    }>;
  }>;

  // Layer 2 — constitutional overlay
  prakriti: PrakritiResult;          // reuse existing
  modeNote: LocaleText;              // "Pitta-dominant → expect heat-type symptoms"

  // Layer 3 — current activation
  currentMultipliers: Record<string, {
    dashaContribution: number;
    transitContribution: number;
    sadeSatiActive: boolean;
    lifeStageGate: number;
  }>;

  // Combined display score per element (Layer 1 × Layer 3 multipliers)
  displayedElements: Array<{
    id: string;
    displayedScore: number;
    trend: 'improving' | 'stable' | 'worsening';
    nextInflectionDate: string | null;  // when does the next dasha/transit shift this?
  }>;

  // Overall — kept for backward-compatibility with the existing single tier
  overall: {
    rating: Rating;
    summary: LocaleText;
  };

  // Cross-references already-existing modules
  bodyMap: BodyRegionResult[];
  diseaseProfile: DiseaseProfileResult;
  timeline: HealthWindow[];

  // Disclaimers
  disclaimers: Array<{ scope: string; text: LocaleText }>;  // esp. for 4.21, 4.22
}
```

---

## 9. UI surface (this spec doesn't design the UI, just data flow)

The diagnosis above can drive multiple surfaces:

- **Kundali summary card** — keep one Health tier, but make it expandable into
  the 22-element grid with each element's own tier + traffic-light colour. Show
  top 3 weakest elements as headline.
- **`/medical-astrology` page** — becomes the deep-dive that consumes the full
  `HealthDiagnosis` object. Body map (already exists) gets cross-linked to
  the matrix elements (e.g., clicking "Stomach" on the body map jumps to the
  Digestive element card).
- **Dashboard** — top-of-page "current health pressure" widget surfaces the 3
  elements with the highest *current* displayed score (Layer 3 activation),
  with next-inflection date.

The UI changes are out of scope for this spec — they belong in a follow-up
once the data contract here is approved.

---

## 10. Resolved decisions (user input 2026-05-27)

1. **Element count → 19 default + 3 gated.** Default surface shows the 19
   elements with strong classical grounding. Three elements require explicit
   user opt-in before they appear:
   - 4.20 Allergies / Autoimmune
   - 4.21 Cancer / Tumour
   - 4.22 Longevity
   Opt-in is a single toggle ("show extended analysis") that reveals all
   three at once. Strong disclaimer attached.

2. **Longevity surfacing → classification + risk windows, no fixed age.**
   Internally compute Pinda + Amsha + Naisargika Ayurdaya. Surface to the
   opted-in user as:
   - Classification (Alpa / Madhya / Purna)
   - Risk windows framed as periods of *extra care* (e.g. "the dasha period
     2032–2034 calls for extra vigilance") — derived from Maraka dasha
     onsets and 8th-lord activations.
   Never display a numeric year-of-death or even a year range. The framing
   is always *windows of care*, never *life expectancy*.

3. **Modern correspondences → two-tier badge.** Every element gets a small
   badge in the UI:
   - **"Classical"** — significators sourced directly from BPHS, Saravali,
     Phala Deepika, Charaka, Sushruta, etc.
   - **"Inferential"** — modern Jyotish synthesis. Currently applies to
     4.12 Endocrine, 4.20 Allergies/Autoimmune, and the modern-medical
     framings within 4.21 Cancer.
   Badge is honest about confidence level without hiding the element.

4. **Consolidation strategy → existing modules become inputs; converge to a
   unified engine; no parallel paths or breakage.**
   - Phase A: New engine consumes outputs of existing `medical/prakriti.ts`,
     `body-map.ts`, `health-timeline.ts`, `disease-profile.ts`,
     `health-prognosis.ts`. Nothing in `medical/*` is touched.
   - Phase B: New engine layers the 19-element matrix on top and exposes
     `computeHealthDiagnosis(kundali)`.
   - Phase C: `/api/medical` route and `/medical-astrology` page both call
     the new engine; existing modules still run under the hood as
     dependencies of the new engine.
   - Phase D: Once consumers are migrated and tests are green, the
     `src/lib/medical/*` directory is reorganised into the new engine's
     namespace (`src/lib/kundali/health-diagnosis/` or similar). Old
     export paths re-exported during migration; old API contract preserved.
   - **Hard rule: no regression in `/api/medical` response shape or
     `/medical-astrology` page behaviour until consumers are explicitly
     migrated.**

5. **`/medical-astrology` page → add matrix as new section, keep existing
   four sections.** No rewrite. The 19-element matrix appears as a new
   "Health Element Diagnosis" section. Prakriti, Body Map, Timeline, and
   Disease Profile remain in their current positions. The new section
   becomes the headline (top of page); existing sections become supporting
   detail.

6. **Source priority → hard Jyotish/Ayurveda boundary.**
   - Jyotish texts govern *which* planet/house/sign contributes to an
     element's score (Layer 1). Ayurveda texts (Charaka, Sushruta,
     Ashtanga Hridayam) inform *how* symptoms manifest — the constitutional
     mode (Layer 2 — vata vs pitta vs kapha colouring).
   - Within Jyotish, when texts disagree: **BPHS first**, then Saravali,
     then Phala Deepika, then Sarvartha Chintamani, then Jataka Parijata,
     then Hora Sara, then Bhrigu Samhita (cautiously).
   - Within Ayurveda: Charaka first for dosha and prakriti; Sushruta for
     anatomy and marma; Ashtanga Hridayam as synthesis tiebreaker.

7. **Disclaimer wording → Vedic-framing tone.** Single disclaimer string
   attached to the three high-stakes elements (4.17 Psychiatric, 4.21
   Cancer, 4.22 Longevity):

   > *"Classical Jyotish describes karmic tendencies, not certainties.
   > These patterns indicate areas to nurture with awareness, not destiny.
   > Modern medical care remains essential."*

   Translated into all 9 active locales. Surfaced prominently (not
   collapsed) on first display of each high-stakes element.

---

## 11. What this spec deliberately does NOT include

- **Implementation order / phasing.** That belongs in the writing-plans step.
- **UI mockups / component design.** Out of scope here.
- **Database schema changes.** No schema work appears needed — everything is
  computed.
- **Remedy mapping.** Remedies for each element are a separate spec
  (`/lib/remedies/contextual-remedies.ts` exists; matrix needs to map element
  IDs to existing remedies).
- **Backwards compatibility decisions.** The existing single Health tier in
  DomainCard stays for now — the new engine outputs `overall.rating` to keep
  it working. Whether to deprecate the old surface is a UX decision deferred
  to implementation planning.

---

## 12. Definition of done (for this spec, not implementation)

This spec is *complete* when:

- ✅ Every element catalogued has primary significators, strength inputs,
  classical signatures, activation factors, and source citations.
- ✅ The three-layer architecture is unambiguous (natal × constitutional ×
  current).
- ✅ The strength-input subsystem is identified as a single shared module —
  no duplication.
- ✅ Output data shape is concrete enough that implementation can begin
  without further design questions.
- ✅ All 7 design questions resolved (§10).

**Status: complete.** Ready for `writing-plans` once user signs off on the
updated spec.

# Unified Time Verdict — Conflict Resolution for Overlapping Auspicious/Inauspicious Periods

**Date:** 2026-05-12  
**Status:** Draft  
**Problem:** Users see contradictory signals across muhurta, choghadiya, hora, rahu kaal, and panchang — no guidance on which takes precedence when they overlap.

---

## 1. The User's Problem

At 9:15 AM on a Tuesday, our site simultaneously tells the user:
- Choghadiya: "Labh" (gain — auspicious)
- Rahu Kaal: Active (inauspicious)
- Hora: Venus (auspicious for purchases)
- Nakshatra: Pushya (excellent for purchases)

Four signals, two positive, one strongly negative, one context-dependent. The user has no way to resolve this. They came for a simple answer — "is now a good time?" — and got a research project.

**No competitor solves this.** Drik Panchang, Prokerala, and AstroSage show each system on separate pages. None provides a unified verdict with conflict resolution.

---

## 2. Source Authority Analysis

Before defining a hierarchy, we must acknowledge that these systems come from **different textual traditions** with different levels of classical authority. This matters because a purely classical approach and a modern practitioner approach give different answers.

### 2.1 Classical Panchang Elements (Highest Authority)

These five elements form the core of Muhurta Shastra as defined in Muhurta Chintamani (Rama Daivagnya, c. 16th century), Brihat Samhita (Varahamihira, 6th century), and BPHS:

| Element | What | Inauspicious Markers |
|---------|------|---------------------|
| **Tithi** | Lunar day (1-30) | Rikta tithis (4, 9, 14) — avoid for auspicious ceremonies. Amavasya — avoid for beginnings. |
| **Nakshatra** | Lunar mansion (1-27) | Activity-specific. No nakshatra is universally bad — each has activities it favours and ones it doesn't. |
| **Yoga** | Sun-Moon angular relationship (1-27) | **Vyatipata** (#17) and **Vaidhriti** (#27) — universally inauspicious. Rajmartanda says they can destroy even Amrita Yoga. |
| **Karana** | Half-tithi (1-11) | **Vishti (Bhadra)** — the single most cited inauspicious karana. Rajmartanda: "capable of destroying even Amrita Yoga." |
| **Vara** | Weekday | Activity-specific. No weekday is universally bad, but some activities have preferred/avoided days. |

**Classical standing:** These are the five limbs (pancha-anga) of the panchang. Every classical muhurta text treats them as primary. Any muhurta analysis that ignores them is incomplete.

### 2.2 Classical Muhurta Windows

| Window | Source | What |
|--------|--------|------|
| **Abhijit Muhurta** | Muhurta Chintamani, BPHS | The 8th muhurta of the day (~48 min around solar noon). Described as "sarva doshagnam" — destroyer of all doshas. **Wednesday exception:** Muhurta Martand says Abhijit loses potency on Wednesdays, especially for southward travel. Scholarly debate on whether this is full or partial nullification. |
| **Brahma Muhurta** | Dharmasindhu, BPHS | Pre-dawn (~1h36m before sunrise). Exclusively for spiritual activities — study, meditation, japa. Not for material beginnings. |
| **Amrit Kalam** | Muhurta Chintamani (ghati tables) | Nakshatra-specific auspicious time windows. Strong positive. |
| **Varjyam** | Muhurta Chintamani (ghati tables) | Nakshatra-specific inauspicious time windows. Opposite of Amrit Kalam. |
| **Durmuhurta** | Muhurta Chintamani | Specific inauspicious windows. Two per day. |

**Classical standing:** Fully attested in the core muhurta texts. Abhijit is particularly interesting because of the "sarva doshagnam" claim — more on this in Section 3.

### 2.3 Regional/Medieval Traditions

| System | Origin | Classical Status |
|--------|--------|-----------------|
| **Rahu Kaal** | South Indian tradition, popularised through Tamil/Kannada panchangams. Calculation formula (sunrise-based, weekday-rotated) appears in later medieval texts including Muhurta Chintamani. | **Debated.** Widely practised and referenced in later classical works, but NOT in Varahamihira's Brihat Samhita or the earliest BPHS manuscripts. The concept of Rahu's temporal lordship is classical, but the specific "Rahu Kaal" time-slot formula is medieval South Indian. |
| **Yamaganda** | Same tradition as Rahu Kaal. Time slot associated with Yama (death god). | **Same as Rahu Kaal** — medieval, widely practised, not in the oldest texts. |
| **Gulika Kaal** | Gulika/Mandi IS mentioned in BPHS as an upagraha. But the specific time-slot formula varies between texts. | **Partially classical.** The upagraha is classical; the time-slot formula is regional. |
| **Choghadiya** | Gujarati/Rajasthani tradition. Etymology: "chatur ghadi" (four ghadi = 96 minutes). Based on planetary hora system but simplified into 8 named slots. | **Folk tradition.** Not in any major classical text (BPHS, Muhurta Chintamani, Brihat Samhita). Derived from hora principles but is a regional simplification. Extremely popular in western India's business community. |
| **Hora** | Hellenistic astrology, adopted into Jyotish. Each hour ruled by a planet. | **Classical.** Hora is well-attested, though the specific "planetary hour" system is Greco-Indian hybrid. |
| **Panchaka** | Based on Moon's transit through nakshatras 23-27 (Dhanishtha to Revati). | **Classical.** Referenced in multiple texts. But scope varies regionally — stricter in South India. |

### 2.4 The Authority Problem

This creates a genuine tension:

- **Pure classical approach:** Panchang elements (tithi, nakshatra, yoga, karana, vara) + Abhijit/Amrit/Varjyam/Durmuhurta are primary. Rahu Kaal/Yamaganda are secondary regional additions.
- **Modern practitioner approach:** Rahu Kaal is treated as the #1 hard block by virtually every modern pandit, regardless of its later classical origin. Choghadiya is deeply embedded in Gujarati business culture.
- **Our users' expectation:** They expect ALL of these systems to be considered. They won't accept "Rahu Kaal doesn't count because Varahamihira didn't mention it."

**Our resolution:** We use a **dual-authority system**. The hierarchy below reflects both classical and practitioner consensus, with honest attribution. When a conflict has genuine scholarly disagreement, we present the conservative view as default and explain the debate.

---

## 3. The Hierarchy

### 3.0 Design Principle: Negative Overrides Positive

Classical muhurta shastra follows a **disqualification model**: the entire day starts as potentially usable; inauspicious factors **subtract** from it. What survives all filters is your window.

A positive factor (Abhijit, Amrit Kalam, Shubh Choghadiya) does not "cancel" a negative factor. It may mitigate it (reduce severity), but in our system the conservative default is: **if any block applies, the slot is blocked.**

The one explicit exception in the texts is Abhijit Muhurta, which claims "sarva doshagnam" status — addressed below.

### 3.1 Layer 1: Hard Blocks

These are active at specific times and block ALL auspicious activities when present. No positive factor overrides them (with one debated exception — see 3.5).

| # | Factor | Duration | Source | Blocks |
|---|--------|----------|--------|--------|
| 1a | **Vishti (Bhadra) Karana** | ~6 hours per occurrence, 4× per lunar month | Muhurta Chintamani, Rajmartanda, Brihat Samhita | All auspicious activities. Rajmartanda explicitly says it destroys even Amrita Yoga — this is the strongest textual claim of any negative factor. |
| 1b | **Vyatipata Yoga** | Variable duration (yoga #17 of 27) | Muhurta Chintamani, Brihat Samhita, Rajmartanda | All auspicious activities. Classified alongside Vishti as "destroyers of Amrita." |
| 1c | **Vaidhriti Yoga** | Variable duration (yoga #27 of 27) | Same as above | Same as Vyatipata. |
| 1d | **Rahu Kaal** | ~90 min daily, weekday-rotated from sunrise | Medieval South Indian, Muhurta Chintamani (later editions) | All new beginnings. Modern practitioner consensus: hard block. |
| 1e | **Yamaganda** | ~90 min daily, weekday-rotated from sunrise | Same tradition as Rahu Kaal | All new beginnings. |
| 1f | **Gulika Kaal** | ~90 min daily | BPHS (upagraha), regional time-slot formulas | All new beginnings. |

**Note on ordering:** Within Layer 1, Vishti and Vyatipata/Vaidhriti have the strongest classical backing (Rajmartanda explicitly ranks them). Rahu Kaal has the strongest modern practitioner backing. For the user, this distinction doesn't matter — all are red.

### 3.2 Layer 2: Conditional Blocks

These block specific activities, not all activities. The system must know what the user is planning.

| # | Factor | What it blocks | What it does NOT block |
|---|--------|---------------|----------------------|
| 2a | **Varjyam** | New beginnings, first-time activities, purchases, signing contracts | Continuation of existing work, routine activities, spiritual practice |
| 2b | **Durmuhurta** | Most new starts, auspicious ceremonies | Meditation, charity, study |
| 2c | **Panchaka** (Moon in nakshatras 23-27) | Southward travel, construction, thatching, collecting fuel/wood, funerals | Other activities unaffected. Scope varies by regional tradition. |
| 2d | **Rikta Tithi** (4th, 9th, 14th) | Auspicious ceremonies, marriages, purchases | Destructive activities (demolition, surgery, ending things). Rikta tithis are actually good for Rahu-related remedies. |
| 2e | **Abhijit on Wednesday** | Abhijit Muhurta loses potency (weakened or fully nullified per Muhurta Martand). Specifically dangerous for southward travel. | All other time factors on Wednesday are unaffected. Only Abhijit is impacted. |

**Rule:** When a Layer 2 block applies to the user's chosen activity → amber/caution. When it doesn't apply → no effect.

### 3.3 Layer 3: Positive Boosters

These ONLY count when no Layer 1 or applicable Layer 2 block is active. Multiple positives stack to create stronger windows.

| # | Factor | Strength | Notes |
|---|--------|----------|-------|
| 3a | **Abhijit Muhurta** | Very Strong | ~48 min around solar noon. "Sarva doshagnam" — see debate in 3.5. NOT valid on Wednesdays (Layer 2e). |
| 3b | **Amrit Kalam** | Strong | Nakshatra-specific auspicious ghati windows. |
| 3c | **Shubh/Amrit/Labh Choghadiya** | Moderate | Folk tradition but deeply trusted by users. ~96 min each. |
| 3d | **Benefic Hora** (Jupiter, Venus, Mercury, Moon) | Moderate | Activity-dependent. Jupiter hora good for education/ceremony; Venus for marriage/luxury; Mercury for business/travel; Moon for nurturing activities. |
| 3e | **Good Nakshatra** for the specific activity | Strong | Pushya for purchases, Rohini/Uttara Phalguni for marriage, Ashwini for travel, etc. |
| 3f | **Good Tithi** for the activity | Moderate | 2nd, 3rd, 5th, 7th, 10th, 11th, 13th (Shukla) are generally auspicious. |
| 3g | **Brahma Muhurta** (for spiritual activities only) | Very Strong | Pre-dawn. Purpose-specific — showing this as "excellent" for someone planning a business deal would be wrong. |

**Stacking rule:** More simultaneous positives = stronger window.
- 1 positive = 🟢 Good
- 2 positives = 🟢🟢 Very Good
- 3+ positives = 🟢🟢🟢 Excellent

### 3.4 Layer 4: Background Context (tie-breakers)

When two time slots both survive Layer 1-3 filtering and have equal positive strength, these factors break the tie:

| Factor | Role |
|--------|------|
| Panchang Yoga (non-dosha, 25 of 27) | Some yogas mildly boost or reduce. Siddha, Amrita, Sarvarthasiddhi are positive. |
| Karana (non-Vishti, 10 of 11) | Bava, Balava good for beginnings; Kaulava good for friendship/alliance; etc. |
| Vara lord alignment | Tuesday for courage/surgery; Thursday for education/spirituality; Friday for marriage/beauty. |
| Moon sign transit | General emotional backdrop for the day. |
| **Tarabala** (personal) | Depends on user's birth nakshatra. Creates personal good/bad windows. Only available for logged-in users with birth data. |

---

## 3.5 The Abhijit Debate: "Sarva Doshagnam"

This is the single most contested conflict in muhurta shastra and deserves explicit treatment.

**The claim:** Abhijit Muhurta is described as "Abhijit sarva doshagnam" — destroyer of all doshas. Taken literally, this means Abhijit overrides every negative factor, including Rahu Kaal and Vishti.

**Arguments FOR Abhijit overriding negatives:**
- The Muhurta Chintamani verse is explicit: "sarva" means all, not "some."
- Abhijit is presided over by Lord Vishnu with Sudarshana Chakra — the mythological framing positions it above mortal-plane doshas.
- Some South Indian practitioners (particularly in Karnataka) hold that Abhijit during Rahu Kaal IS usable.

**Arguments AGAINST:**
- Rajmartanda explicitly says Vishti Karana and Vyatipata/Vaidhriti "destroy even Amrita Yoga." If these doshas can destroy the most auspicious yoga, their power is not negated by Abhijit.
- The "sarva dosha" claim may be hyperbolic (alamkara) — a common feature of Sanskrit shastric literature where each element is praised in superlative terms within its own chapter.
- Majority modern practitioner consensus: Rahu Kaal is a hard block regardless. No pandit will recommend scheduling a wedding during Rahu Kaal even if Abhijit is active.
- Pragmatic argument: if a user follows our advice to use Abhijit during Rahu Kaal, and things go wrong, they blame us. The conservative path is safer.

**Our position (configurable):**

We take the **conservative-with-explanation** approach:

- **Default:** Abhijit during a Layer 1 block = 🟡 CAUTION (not green, not red).
- **Explanation shown:** "Abhijit Muhurta is active and is described as 'sarva doshagnam' (destroyer of all doshas) in Muhurta Chintamani. However, Rahu Kaal is also active. Most practitioners advise avoiding new beginnings during Rahu Kaal regardless. If possible, choose a different window."
- **The user can make an informed choice.** We don't hide either factor.

This is the one case where we deviate from "negative always wins" — because the classical source explicitly makes a counter-claim. We respect both positions.

**Implementation note:** This is a configurable constant in the verdict engine. If scholarship or user feedback shifts, we can change Abhijit-during-Layer1 from CAUTION to BLOCKED or GOOD without restructuring.

---

## 4. Conflict Resolution Matrix

The complete conflict resolution for all pairwise overlaps:

| Positive Factor | Overlapping Negative | Verdict | Reasoning |
|----------------|---------------------|---------|-----------|
| Abhijit Muhurta | Rahu Kaal | 🟡 CAUTION | Debated — see §3.5. Conservative default. |
| Abhijit Muhurta | Vishti Karana | 🟡 CAUTION | Same logic. Rajmartanda says Vishti destroys even Amrita, but Abhijit claims sarva doshagnam. |
| Abhijit Muhurta | Vyatipata/Vaidhriti | 🟡 CAUTION | Same. |
| Abhijit Muhurta | Wednesday | 🟡 CAUTION | Muhurta Martand: Abhijit weakened on Wednesdays. Not a hard block on other activities. |
| Abhijit Muhurta | Varjyam | 🟡 CAUTION | Varjyam blocks new starts; Abhijit is specifically for new starts. Genuine conflict. |
| Amrit Kalam | Rahu Kaal | 🔴 AVOID | Amrit Kalam does NOT have the "sarva doshagnam" claim. Layer 1 wins cleanly. |
| Amrit Kalam | Vishti Karana | 🔴 AVOID | Same — Rajmartanda explicitly: Vishti destroys Amrita. |
| Amrit Kalam | Yamaganda | 🔴 AVOID | Layer 1 wins. |
| Shubh Choghadiya | Rahu Kaal | 🔴 AVOID | Choghadiya is a folk simplification; Rahu Kaal is more precise. Layer 1 wins. |
| Shubh Choghadiya | Vishti Karana | 🔴 AVOID | Classical Karana > folk Choghadiya. |
| Shubh Choghadiya | Varjyam | 🟡 CAUTION | Varjyam blocks new starts but not continuation. Activity-dependent. |
| Benefic Hora | Rahu Kaal | 🔴 AVOID | Hora is a refinement, not an override. Layer 1 wins. |
| Benefic Hora | Rog Choghadiya | 🟡 MIXED | Hora is more precise than Choghadiya (1h planet-specific vs 96min generalised). Hora takes precedence but user should know. |
| Brahma Muhurta | Material activity | 🟡 CAUTION | Brahma Muhurta is purpose-specific. Excellent for spiritual, inappropriate for material. |
| Good Nakshatra | Vishti Karana | 🔴 AVOID | Karana operates at a different timescale. Vishti poisons the entire ~6h window regardless of nakshatra. |
| Good Tithi | Rikta Tithi | N/A | These are mutually exclusive — a tithi is either rikta or it isn't. |
| Amrit Kalam | Shubh Choghadiya | 🟢🟢 EXCELLENT | Positives stack. No conflict. |
| Abhijit | Amrit Kalam | 🟢🟢🟢 EXCEPTIONAL | Rare overlap. Extremely auspicious per both traditions. |

---

## 5. Product Design

### 5.1 Level 1: "Best Windows" Summary Card

**Where:** Top of the panchang page, below the hero.  
**Effort:** Low — synthesises existing data.  
**What it shows:**

```
┌─────────────────────────────────────────────────┐
│  🟢 Best Windows Today                          │
│                                                  │
│  10:30 AM – 12:18 PM  ★★★ Excellent             │
│  Abhijit Muhurta + Shubh Choghadiya             │
│  No doshas active                                │
│                                                  │
│  2:00 PM – 3:30 PM  ★★ Very Good                │
│  Amrit Kalam + Jupiter Hora                      │
│  No doshas active                                │
│                                                  │
│  ⚠ Avoid: 9:00–10:30 AM (Rahu Kaal)             │
│  ⚠ Avoid: 6:30–7:15 PM (Vishti Karana begins)   │
│                                                  │
│  [See full timeline →]                           │
└─────────────────────────────────────────────────┘
```

**Data flow:** `computeBestWindows(panchang, rahuKaal, choghadiya, hora)` → returns `{ excellent: TimeSlot[], good: TimeSlot[], avoid: TimeSlot[] }`.

### 5.2 Level 2: Unified Day Timeline

**Where:** Standalone section on panchang page, or linked `/muhurta/today` route.  
**Effort:** Medium.  
**What it shows:**

A horizontal or vertical timeline from sunrise to sunset. Each 30-minute slot gets a traffic light:

🔴 **AVOID** — Any Layer 1 block active  
🟡 **CAUTION** — Layer 2 block for the selected activity, OR Abhijit-during-Layer1 debate  
🟢 **GOOD** — No blocks, at least one Layer 3 positive  
🟢🟢 **EXCELLENT** — No blocks, 2+ positives stacking  

Each slot is tappable/expandable to show:
- All active factors (choghadiya, hora, nakshatra, tithi, yoga, karana, rahu kaal, etc.)
- Which factor determined the verdict
- Classical citation for why (one sentence)

### 5.3 Level 3: Activity-Aware Personal Muhurta

**Where:** Activity dropdown on the timeline.  
**Effort:** Higher — needs activity-specific rules.

Activities (initial set — 12):
1. General new beginning (default)
2. Travel
3. Purchase / Gold / Vehicle
4. Marriage / Engagement
5. Business / Contract / Partnership
6. Spiritual practice / Meditation
7. Medical / Surgery
8. Construction / Griha Pravesh
9. Education / Study / Exam
10. Mundan / Annaprashan (samskaras)
11. Starting a job / New position
12. Filing legal matters

Each activity has:
- Preferred nakshatras (Pushya for purchase, Rohini for marriage, etc.)
- Preferred weekdays (Thursday for education, Friday for marriage, etc.)
- Specific blocks (Panchaka for southward travel, Rikta for ceremonies, etc.)

When the user selects an activity, the timeline re-evaluates every slot with activity-specific rules. A slot that's green for "spiritual practice" might be amber for "travel" due to Panchaka.

### 5.4 Level 4 (Future): Personal Tarabala

For logged-in users with birth data: overlay Tarabala (personal nakshatra compatibility) on the timeline. This creates truly personalised "your best windows today" that differ from person to person.

---

## 6. Architecture

### 6.1 Core Engine: `computeTimeVerdict()`

```typescript
interface TimeSlot {
  start: string;          // HH:MM
  end: string;            // HH:MM
  verdict: 'avoid' | 'caution' | 'good' | 'excellent' | 'exceptional';
  label: string;          // "Rahu Kaal — overrides Shubh Choghadiya"
  explanation: string;    // Classical citation / reasoning
  factors: {
    layer1: ActiveFactor[];  // Hard blocks
    layer2: ActiveFactor[];  // Conditional blocks (if any apply to selected activity)
    layer3: ActiveFactor[];  // Positive boosters
    layer4: ActiveFactor[];  // Background context
  };
  activity?: string;       // If activity-aware mode is active
}

interface ActiveFactor {
  name: string;           // "Rahu Kaal", "Abhijit Muhurta", "Shubh Choghadiya"
  type: 'block' | 'conditional' | 'positive' | 'context';
  source: string;         // "Muhurta Chintamani", "South Indian tradition", "Gujarati folk"
  effect: string;         // "Blocks all new beginnings"
}
```

### 6.2 File Structure

```
src/lib/muhurta/
├── time-verdict.ts          # computeTimeVerdict() — main engine
├── verdict-config.ts        # Configurable hierarchy, conflict resolution rules
├── activity-rules.ts        # Per-activity nakshatra/tithi/weekday preferences + blocks
├── conflict-matrix.ts       # Pairwise conflict resolutions (the table from §4)
└── verdict-types.ts         # TypeScript interfaces
```

**Separation of concerns:**
- `verdict-config.ts` — the hierarchy itself. If a scholar says "move Rahu Kaal to Layer 2", change this file only.
- `conflict-matrix.ts` — the 15+ pairwise resolutions. If the Abhijit debate resolves, change this file only.
- `activity-rules.ts` — which nakshatras/tithis/weekdays are good/bad for each activity. Extensible.
- `time-verdict.ts` — the engine that reads the config and produces verdicts. Pure function, no opinion.

### 6.3 Inputs (already computed elsewhere)

All inputs already exist in our panchang computation pipeline:

| Input | Source |
|-------|--------|
| Rahu Kaal start/end | `calculateRahuKaal()` in `src/lib/ephem/astronomical.ts` |
| Yamaganda, Gulika | Same module |
| Choghadiya slots | `calculateChoghadiya()` in `src/lib/choghadiya/` |
| Hora slots | `calculateHoras()` in `src/lib/hora/hora-calculator.ts` |
| Abhijit Muhurta start/end | Already in panchang data |
| Amrit Kalam, Varjyam | Already in panchang data (nakshatra ghati computation) |
| Durmuhurta | Already in panchang data |
| Tithi, Nakshatra, Yoga, Karana | Core panchang elements |
| Panchaka | Derivable from current nakshatra |

No new astronomical computation needed. This is purely a **synthesis layer** over existing data.

---

## 7. Implementation Phases

### Phase 1: Engine + Best Windows Card
- Build `computeTimeVerdict()` engine with Layer 1-3
- Build `computeBestWindows()` — top 2-3 green slots + avoid list
- Render "Best Windows Today" card on panchang page
- No activity-aware mode yet — general new-beginning rules only

### Phase 2: Unified Day Timeline
- Build timeline component (30-min slots, sunrise to sunset)
- Each slot expandable with factor breakdown
- Explanations for all conflicts

### Phase 3: Activity-Aware Mode
- Activity dropdown with 12 initial activities
- Activity-specific rules applied to timeline
- Layer 2 conditional blocks activated per activity

### Phase 4: Personal Tarabala
- Birth nakshatra input (from saved kundali or manual entry)
- Personal good/bad windows overlaid on timeline

---

## 8. Critical Review

Issues I identified while writing this spec:

### 8.1 Corrections from Research

1. **Choghadiya is NOT classical.** My earlier proposal treated it alongside Rahu Kaal as a peer system. Research confirms it's a Gujarati folk tradition derived from hora but not in any major classical text. In the hierarchy, Choghadiya is now correctly placed as Layer 3 (positive booster) — below all classical elements. When Choghadiya conflicts with hora, hora takes precedence as the more authoritative system.

2. **Rahu Kaal's classical status is weaker than assumed.** It's NOT in Varahamihira's Brihat Samhita or the earliest BPHS manuscripts. It appears in later South Indian panchangams and later editions of Muhurta Chintamani. However, modern practitioner consensus is so strong that downgrading it would be irresponsible. We keep it in Layer 1 but note its medieval (not ancient) origin in the explanations.

3. **The Abhijit "sarva doshagnam" claim is real and textually supported.** I initially dismissed it as "conservative view wins." But the Muhurta Chintamani verse is explicit, and some practicing traditions do use Abhijit during Rahu Kaal. Our system must honour this by giving CAUTION (not AVOID) and explaining the debate, rather than silently blocking it.

4. **Rajmartanda explicitly ranks Vishti + Vyatipata/Vaidhriti as the strongest negatives.** The statement "capable of destroying even Amrita Yoga" gives these three the strongest classical support of any negative factor. If any Layer 1 element should override Abhijit's "sarva doshagnam" claim, it's these three — not Rahu Kaal.

### 8.2 Honest Limitations

5. **We cannot resolve all scholarly debates.** The Abhijit-on-Wednesday question (full nullification vs partial weakening vs only-for-southward-travel) is genuinely unresolved across traditions. The spec picks "caution" but this is our editorial choice, not a classical consensus.

6. **Regional variation is real.** Panchaka is strictly observed in South India and loosely in the North. Choghadiya is essential in Gujarat and irrelevant in Tamil Nadu. A user from Ahmedabad and a user from Chennai have different expectations. The spec currently uses a pan-Indian approach. Future work could add regional presets.

7. **Activity-specific rules are complex.** "Good nakshatra for marriage" alone is a topic with entire chapters in Muhurta Chintamani. The initial 12-activity list will necessarily be simplified. We should cite sources and acknowledge that a human pandit would consider more factors.

8. **Tarabala is personal and changes the entire calculus.** A slot that's "green" by general rules might be "red" for a specific person based on their birth nakshatra. Level 4 (personal mode) is the most valuable but also the most complex. It should clearly label personal vs general verdicts.

### 8.3 What This Spec Does NOT Cover

- Changes to the existing muhurta AI engine or muhurta scanner
- Changes to existing choghadiya, hora, or rahu kaal pages (those stay as-is)
- Monetisation (this is a free feature — it builds trust and differentiation)
- Push notifications ("your best window starts in 15 minutes") — future consideration

---

## 9. Sources

Classical texts referenced:
- **Muhurta Chintamani** by Rama Daivagnya (c. 16th century) — primary authority for muhurta selection
- **Brihat Samhita** by Varahamihira (6th century) — foundational Jyotish encyclopaedia
- **BPHS** (Brihat Parashara Hora Shastra) — foundational hora text
- **Rajmartanda** — commentary text; source of "Vishti/Vyatipata destroy even Amrita Yoga"
- **Muhurta Martand** — source for Abhijit-on-Wednesday and southward-travel restrictions
- **Dharmasindhu** and **Nirnayasindhu** — Dharmashastra texts codifying practice
- **Kalaprakashika** — South Indian muhurta manual

Web references:
- [VedicTime: Vishti Karana](https://vedictime.com/en/library/panchanga/karana/vishti)
- [VedicTime: Vyatipata](https://vedictime.com/en/library/panchanga/nityayoga/vyatipat)
- [VedicTime: Vaidhriti](https://vedictime.com/en/library/panchanga/nityayoga/vaidhriti)
- [Ernst Wilhelm: Classical Muhurta](https://storage.yandexcloud.net/j108/library/o28vzqko/Ernst_Wilhelm_-_Classical_Muhurta.pdf)
- [Hindutva: What Is Abhijit Muhurat](https://hindutva.online/what-is-abhijit-muhurat-most-auspicious-time/)
- [Choghadiya Wikipedia](https://en.wikipedia.org/wiki/Choghadiya)
- [Drik Panchang: Rahu Kalam](https://www.drikpanchang.com/tutorials/panchang-utilities/rahu-kalam.html)
- [Bejan Daruwalla: Abhijit Muhurta](https://bejandaruwalla.com/blogs/astrology/abhijit-muhurta)

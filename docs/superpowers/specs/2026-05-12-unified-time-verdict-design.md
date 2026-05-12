# Unified Time Verdict — Conflict Resolution for Overlapping Auspicious/Inauspicious Periods

**Date:** 2026-05-12  
**Status:** Draft → **Rev 2** (same day — added complete precedence table, separated Choghadiya, added Sarvarthasiddhi/Amrit Siddhi/Siddha/Guru Pushya yogas)  
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
- [VedAstro: Muhurtha Chapter 6 — Siddha Yoga & Amrita Siddha Yoga](https://vedastro.org/blog/Muhurtha-Chapter-6-On-Certain-Special-Yogas.html)
- [Hindutva: What Is Abhijit Muhurat](https://hindutva.online/what-is-abhijit-muhurat-most-auspicious-time/)
- [Choghadiya Wikipedia](https://en.wikipedia.org/wiki/Choghadiya)
- [Drik Panchang: Rahu Kalam](https://www.drikpanchang.com/tutorials/panchang-utilities/rahu-kalam.html)
- [Bejan Daruwalla: Abhijit Muhurta](https://bejandaruwalla.com/blogs/astrology/abhijit-muhurta)
- [Astrodevam: Sarvartha Siddhi Yoga](https://www.astrodevam.com/sarvarth-siddhi-yoga.html)
- [Ernst Wilhelm: Muhurta Yogas PDF](https://www.vedic-astrology.net/articles/muhurta-yogas.pdf)

---

## APPENDIX A: Final Precedence Table (Rev 2)

This is the definitive, implementation-ready precedence table. It separates two independent systems — the **Classical Muhurta System** (textually attested) and the **Choghadiya System** (folk/regional). They are displayed side-by-side to the user but never mixed in the verdict engine.

### A.1 Design Principle

B.V. Raman (commentary on Muhurtha, Ch.6): *"Eliminate adverse yogas first before seeking Siddha combinations."*

This confirms the classical approach: **filter out negatives first, then rank remaining windows by positive strength.** A positive yoga does not cancel a negative dosha — it makes the non-blocked portions of the day stronger.

The one textual exception: Abhijit Muhurta ("sarva doshagnam") — handled as CAUTION, not override.

### A.2 System 1: Classical Muhurta (Panchang-Based)

Two axes: **NEGATIVES** (subtract from usable time) and **POSITIVES** (rank surviving windows).

#### A.2.1 Negatives — Ranked by Disqualifying Power

```
RANK  FACTOR                    SCOPE             DURATION        SOURCE                      OVERRIDE BY POSITIVE?
─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
N1    Vishti (Bhadra) Karana    All auspicious     ~6h/cycle       Muhurta Chintamani,         NO. Rajmartanda: "destroys
                                activities         (4× per month)  Rajmartanda, Brihat         even Amrita Yoga." Strongest
                                                                   Samhita                     textual claim of any negative.

N2    Vyatipata Yoga (#17)      All auspicious     Variable        Muhurta Chintamani,         NO. Same Rajmartanda citation
                                activities         (yoga duration)  Rajmartanda                 as Vishti — peer-ranked.

N3    Vaidhriti Yoga (#27)      All auspicious     Variable        Same as above               NO. Same authority as N2.
                                activities         (yoga duration)

N4    Rahu Kaal                 All new            ~90 min/day     Medieval South Indian;       Debated. Abhijit claims
                                beginnings                          later Muhurta Chintamani    "sarva doshagnam" but
                                                                    editions                    practitioner consensus: NO.
                                                                                                Verdict: CAUTION if Abhijit
                                                                                                overlaps, else AVOID.

N5    Yamaganda                 All new            ~90 min/day     Same tradition as            NO.
                                beginnings                          Rahu Kaal

N6    Gulika Kaal               All new            ~90 min/day     BPHS (upagraha);            NO.
                                beginnings                          regional time formulas

N7    Varjyam                   New starts,        Ghati-specific  Muhurta Chintamani          NO for new starts.
                                purchases,          (~96 min)       (nakshatra tables)          Continuation OK.
                                contracts

N8    Durmuhurta                Most new           ~48 min         Muhurta Chintamani          NO for new starts.
                                starts              (2× per day)                                Charity/meditation OK.

N9    Panchaka                  Southward travel,  Entire          Classical; scope varies      Activity-dependent only.
      (Moon in nak 23-27)       construction,       nakshatra       regionally                  Other activities unaffected.
                                funerals            duration

N10   Rikta Tithi (4,9,14)     Auspicious         Full tithi      Classical                   Activity-dependent.
                                ceremonies                                                      Good for destruction/
                                                                                                endings.
```

#### A.2.2 Positives — Ranked by Amplifying Power

```
RANK  FACTOR                     TYPE              FREQUENCY       SOURCE                      SPECIAL RULES
──────────────────────────────────────────────────────────────────────────────────────────────────────────────────
P1    Guru Pushya Yoga           Day-level         ~1×/month       Classical (multiple texts)   Thursday + Pushya nakshatra.
      (Thursday + Pushya)        (vara+nakshatra)                                               "King among yogas." Best
                                                                                                for purchases, gold,
                                                                                                investment. DOES NOT
                                                                                                override N1-N6 but makes
                                                                                                surviving windows supreme.

P2    Ravi Pushya Yoga           Day-level         ~1×/month       Classical                   Sunday + Pushya. Peer of
      (Sunday + Pushya)          (vara+nakshatra)                                               Guru Pushya for different
                                                                                                activities (authority,
                                                                                                government, health).

P3    Amrit Siddhi Yoga          Day-level         ~1×/week        Muhurtha Ch.6 (B.V. Raman)  7 specific vara+nakshatra
                                 (vara+nakshatra)                                               pairs (Sun+Hasta, Mon+
                                                                                                Sravana, Tue+Aswini,
                                                                                                Wed+Anuradha, Thu+Pushya,
                                                                                                Fri+Revati, Sat+Rohini).
                                                                                                "Highest grade" per Raman.

P4    Sarvarthasiddhi Yoga       Day-level         ~2-3×/week      Muhurta Chintamani          Vara+nakshatra combinations
                                 (vara+nakshatra)                                               (see table A.3). "All
                                                                                                purposes accomplished."
                                                                                                Can negate Mrityu Yoga
                                                                                                (per Astrodevam) but NOT
                                                                                                Vishti/Vyatipata.
                                                                                                CAUTION: becomes "Visha
                                                                                                Yoga" (toxic) with certain
                                                                                                tithis — must check.

P5    Siddha Yoga                Day-level         Frequent        Muhurtha Ch.6               Vara+tithi+nakshatra
                                 (vara+tithi+                                                   triple alignment. Less
                                 nakshatra)                                                     powerful than P3-P4 but
                                                                                                more frequent.

P6    Abhijit Muhurta            Time-window       Daily           Muhurta Chintamani          ~48 min around solar noon.
                                 (~48 min)                                                      "Sarva doshagnam." Claims
                                                                                                to override all doshas.
                                                                                                NOT valid on Wednesdays
                                                                                                (Muhurta Martand).
                                                                                                Our verdict: CAUTION
                                                                                                during N1-N3, usable
                                                                                                during N4-N10.

P7    Amrit Kalam                Time-window       Daily           Muhurta Chintamani          Nakshatra-specific ghati
                                 (~96 min)                          (ghati tables)              windows. Strong but does
                                                                                                NOT claim dosha-override
                                                                                                power like Abhijit.

P8    Brahma Muhurta             Time-window       Daily           BPHS, Dharmasindhu          ~1h36m before sunrise.
                                 (~96 min)                                                      Spiritual activities ONLY.
                                                                                                Showing as "excellent" for
                                                                                                material activity = wrong.

P9    Benefic Hora               Time-window       Rotating        Hellenistic + Jyotish       Jupiter/Venus/Mercury/Moon
                                 (~60 min)          hourly                                      hours. Activity-specific.

P10   Good Nakshatra             Day-level         Activity-       Classical (all texts)        Pushya for purchase, Rohini
      (for specific activity)                       dependent                                   for marriage, Ashwini for
                                                                                                travel, etc.

P11   Good Tithi                 Day-level         Activity-       Classical                   Nanda/Bhadra/Jaya/Purna
      (for specific activity)                       dependent                                   tithi groups.
```

#### A.2.3 How Positives Interact with Negatives

```
SCENARIO                                              VERDICT         RATIONALE
───────────────────────────────────────────────────────────────────────────────────────────────────
Any P1-P11 during N1 (Vishti)                         🔴 AVOID        Rajmartanda: "destroys even Amrita."
                                                                       Exception: Abhijit (P6) → 🟡 CAUTION
                                                                       with explanation of the debate.

Any P1-P11 during N2-N3 (Vyatipata/Vaidhriti)        🔴 AVOID        Same Rajmartanda authority. Same
                                                                       Abhijit exception → CAUTION.

P6 (Abhijit) during N4-N6 (Rahu/Yama/Gulika)         🟡 CAUTION      "Sarva doshagnam" vs practitioner
                                                                       consensus. Show both sides.

Any other positive during N4-N6                        🔴 AVOID        Only Abhijit has the override claim.

P1-P5 (day-level yoga) + N4-N6 active                🔴 for that      Day-level yoga makes the rest of
                                                       90-min slot;    the day excellent — but doesn't
                                                       🟢🟢 for rest   save the blocked slot.

P1-P5 (day-level yoga) + N7-N8 (Varjyam/Durmuhurta) 🟡 CAUTION      Varjyam blocks new starts specifically.
                                                                       Continuation during a Sarvarthasiddhi
                                                                       day is fine.

P6 (Abhijit) + Wednesday                              🟡 CAUTION      Muhurta Martand: weakened. Not a
                                                                       hard block on other factors.

P1 (Guru Pushya) + N4 (Rahu Kaal) same day            🔴 during RK;   Guru Pushya elevates the day but
                                                       🟢🟢🟢 outside   the 90-min RK window is still blocked.

P6 (Abhijit) + P7 (Amrit Kalam) no negatives          🟢🟢🟢          Exceptional — two strong time-windows
                                                       EXCEPTIONAL     overlapping with no blocks.

P3 (Amrit Siddhi) + P6 (Abhijit) no negatives         🟢🟢🟢          Day-level + time-window stacking.
                                                       EXCEPTIONAL     Among the best possible moments.

Multiple day-level yogas (P3+P4+P5) stacking           🟢🟢           Rare but possible. Stacking amplifies
                                                       EXCELLENT       but doesn't change the rating ceiling.

No positives, no negatives                              🟢 GOOD        Neutral — usable for most activities.

No positives, N9-N10 (conditional) but activity         🟢 GOOD        Conditional blocks only apply to
doesn't match                                                          matched activities.
```

### A.3 Sarvartha Siddhi Yoga — Vara+Nakshatra Combinations

| Weekday | Nakshatras |
|---------|-----------|
| **Sunday** | Hasta, Moola, Uttarashadha, Uttara Phalguni, Uttarabhadra, Ashwini, Pushya |
| **Monday** | Sravana, Rohini, Mrigasira, Pushya, Anuradha |
| **Tuesday** | Ashwini, Uttarabhadra, Krittika, Ashlesha |
| **Wednesday** | Rohini, Anuradha, Hasta, Krittika, Mrigasira |
| **Thursday** | Revati, Anuradha, Ashwini, Punarvasu, Pushya |
| **Friday** | Revati, Anuradha, Ashwini, Punarvasu, Sravana |
| **Saturday** | Sravana, Rohini, Swati |

Source: Muhurta Chintamani via Astrodevam.

**CAUTION:** Sarvarthasiddhi becomes "Visha Yoga" (toxic) when combined with certain tithis. The engine must check for this.

### A.4 Amrit Siddhi Yoga — Vara+Nakshatra Combinations

| Weekday | Nakshatra |
|---------|-----------|
| **Sunday** | Hasta |
| **Monday** | Sravana |
| **Tuesday** | Ashwini |
| **Wednesday** | Anuradha |
| **Thursday** | Pushya |
| **Friday** | Revati |
| **Saturday** | Rohini |

Source: Muhurtha Ch.6 (B.V. Raman commentary). Note: Thursday+Pushya is simultaneously Amrit Siddhi AND Guru Pushya — the two most auspicious yogas stacking.

### A.5 System 2: Choghadiya (Separate — Folk/Regional)

Choghadiya is a Gujarati/Rajasthani folk system derived from planetary hora but simplified into 8 named slots (~96 min each). It is NOT in any major classical text (BPHS, Muhurta Chintamani, Brihat Samhita).

**We display Choghadiya as a PARALLEL indicator, never mixed into the classical verdict.**

```
DISPLAY MODEL:

  Classical Verdict          Choghadiya
  ──────────────────         ──────────────
  🔴 AVOID (Rahu Kaal)      Labh (Gain)
  
  Shows: "🔴 AVOID — Rahu Kaal active.  Choghadiya says Labh but Rahu Kaal
          takes precedence in the classical system."
```

Choghadiya ratings:
| Choghadiya | Quality | Planet |
|------------|---------|--------|
| Amrit | Excellent | Moon |
| Shubh | Good | Jupiter |
| Labh | Good (gains) | Mercury |
| Char | Neutral (movement OK) | Venus |
| Rog | Inauspicious (illness) | Mars |
| Kaal | Inauspicious (death) | Saturn |
| Udveg | Inauspicious (anxiety) | Sun |

**When Choghadiya disagrees with Classical Verdict:**
- Classical verdict takes precedence in the main traffic light
- Choghadiya is shown as a secondary indicator with a note
- Users who specifically follow Choghadiya tradition can see it, but the system doesn't let it override classical doshas

### A.6 The Final One-Page Precedence Summary

```
╔═══════════════════════════════════════════════════════════════════════════╗
║                    MUHURTA PRECEDENCE TABLE                             ║
║                    (Implementation-Ready)                               ║
╠═══════════════════════════════════════════════════════════════════════════╣
║                                                                         ║
║  STEP 1: CHECK HARD BLOCKS (if any active → slot is 🔴 AVOID)          ║
║  ┌──────────────────────────────────────────────────────────────┐       ║
║  │  N1  Vishti (Bhadra) Karana        ~6h    [Rajmartanda]     │       ║
║  │  N2  Vyatipata Yoga                var    [Rajmartanda]     │       ║
║  │  N3  Vaidhriti Yoga                var    [Rajmartanda]     │       ║
║  │  N4  Rahu Kaal                     ~90m   [S.Indian/MC]    │       ║
║  │  N5  Yamaganda                     ~90m   [S.Indian/MC]    │       ║
║  │  N6  Gulika Kaal                   ~90m   [BPHS/regional]  │       ║
║  └──────────────────────────────────────────────────────────────┘       ║
║  Exception: Abhijit (P6) during N4-N6 → 🟡 CAUTION (not avoid)        ║
║  Exception: Abhijit (P6) during N1-N3 → 🟡 CAUTION (debated)          ║
║                                                                         ║
║  STEP 2: CHECK CONDITIONAL BLOCKS (activity-dependent → 🟡 CAUTION)    ║
║  ┌──────────────────────────────────────────────────────────────┐       ║
║  │  N7   Varjyam           blocks new starts (not continuation) │       ║
║  │  N8   Durmuhurta        blocks most new starts               │       ║
║  │  N9   Panchaka          blocks travel south, construction    │       ║
║  │  N10  Rikta Tithi       blocks auspicious ceremonies         │       ║
║  │  N11  Abhijit+Wednesday  Abhijit weakened (not other factors)│       ║
║  └──────────────────────────────────────────────────────────────┘       ║
║                                                                         ║
║  STEP 3: RANK SURVIVING WINDOWS BY POSITIVE STRENGTH                    ║
║  ┌──────────────────────────────────────────────────────────────┐       ║
║  │  DAY-LEVEL YOGAS (apply to entire day, not specific times):  │       ║
║  │                                                               │       ║
║  │  P1  Guru Pushya Yoga     Thu+Pushya    ~1×/month  SUPREME  │       ║
║  │  P2  Ravi Pushya Yoga     Sun+Pushya    ~1×/month  SUPREME  │       ║
║  │  P3  Amrit Siddhi Yoga    7 vara+nak    ~1×/week   HIGHEST  │       ║
║  │  P4  Sarvarthasiddhi      vara+nak      ~2-3×/wk   HIGH     │       ║
║  │  P5  Siddha Yoga          vara+tithi+   frequent   GOOD     │       ║
║  │                            nakshatra                          │       ║
║  │                                                               │       ║
║  │  TIME-WINDOW BOOSTERS (apply to specific time ranges):        │       ║
║  │                                                               │       ║
║  │  P6  Abhijit Muhurta      ~48 min noon  daily     VERY HIGH │       ║
║  │  P7  Amrit Kalam          ~96 min       daily     HIGH      │       ║
║  │  P8  Brahma Muhurta       ~96 min dawn  daily     HIGH*     │       ║
║  │      (* spiritual only)                                       │       ║
║  │  P9  Benefic Hora         ~60 min       rotating  MODERATE  │       ║
║  │                                                               │       ║
║  │  BACKGROUND (tie-breakers):                                   │       ║
║  │                                                               │       ║
║  │  P10 Good Nakshatra (for activity)                MODERATE  │       ║
║  │  P11 Good Tithi (for activity)                    MODERATE  │       ║
║  │  P12 Favourable Panchang Yoga (non-dosha)         MINOR    │       ║
║  │  P13 Favourable Karana (non-Vishti)               MINOR    │       ║
║  └──────────────────────────────────────────────────────────────┘       ║
║                                                                         ║
║  STACKING:                                                              ║
║  • 0 positives, no negatives         → 🟢   GOOD (neutral usable)     ║
║  • 1 positive (any rank)              → 🟢   GOOD                      ║
║  • 2 positives (at least 1 ≥ P5)     → 🟢🟢  VERY GOOD                ║
║  • 3+ positives OR any P1-P3         → 🟢🟢🟢 EXCELLENT               ║
║  • P1/P2 + P6 + no negatives         → ★★★  EXCEPTIONAL (rare)       ║
║                                                                         ║
║  CHOGHADIYA: shown as separate indicator, never overrides above.        ║
║                                                                         ║
╚═══════════════════════════════════════════════════════════════════════════╝
```

### A.7 Worked Example: Tuesday 13 May 2026

Suppose:
- Nakshatra: Ashwini (starts 06:15, ends 08:30), then Bharani
- Tithi: Shukla Dwitiya (2nd)
- Yoga: Shobhana (auspicious, not dosha)
- Karana: Balava (auspicious)
- Rahu Kaal: 3:00 PM – 4:30 PM
- Yamaganda: 9:00 AM – 10:30 AM
- Abhijit: 11:52 AM – 12:40 PM
- Amrit Kalam: 7:00 AM – 8:36 AM
- Varjyam: 5:15 PM – 6:51 PM
- Tuesday + Ashwini = **Sarvarthasiddhi Yoga** (P4) AND **Amrit Siddhi Yoga** (P3) active while Ashwini is present

```
TIME          NEGATIVES           POSITIVES                        VERDICT
──────────────────────────────────────────────────────────────────────────────
06:15-07:00   None                P3 Amrit Siddhi + P4 Sarvartha  🟢🟢🟢 EXCELLENT
07:00-08:30   None                P3 + P4 + P7 Amrit Kalam        ★★★ EXCEPTIONAL
08:30-09:00   None                (Ashwini ends, yogas end)         🟢 GOOD
09:00-10:30   N5 Yamaganda        —                                 🔴 AVOID
10:30-11:52   None                (neutral)                         🟢 GOOD
11:52-12:40   None                P6 Abhijit                        🟢🟢 VERY GOOD
12:40-15:00   None                (neutral)                         🟢 GOOD
15:00-16:30   N4 Rahu Kaal        —                                 🔴 AVOID
16:30-17:15   None                (neutral)                         🟢 GOOD
17:15-18:51   N7 Varjyam          —                                 🟡 CAUTION (new starts)
                                                                     🟢 GOOD (continuation)
```

**Best Window:** 07:00–08:30 AM — three positives stacking (Amrit Siddhi + Sarvarthasiddhi + Amrit Kalam) with zero negatives. This is exceptional and would be highlighted as the day's prime window.

### A.8 Open Questions for Implementation

1. **Sarvarthasiddhi + Visha Yoga check:** When does Sarvarthasiddhi become toxic? Need the specific tithi combinations to implement the guard. Without this, we risk recommending a "Visha Yoga" window as excellent.

2. **Gulika Kaal calculation variance:** Different texts give different formulas. Which do we use? Suggest: same formula as Drik Panchang for consistency with user expectations.

3. **Regional Choghadiya display:** Should we show Choghadiya only to users whose location is in Gujarat/Rajasthan/Maharashtra? Or always show with a "folk tradition" label? Suggest: always show, label as "Choghadiya (Gujarati tradition)."

4. **Tarabala (personal):** Deferred to Level 4. When implemented, it adds a personal negative/positive overlay. A slot that's green generally might be red personally. The UI must clearly separate "general" from "personal" verdicts.

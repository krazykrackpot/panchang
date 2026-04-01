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
- Each module = **3-5 minutes of reading** (~500-800 words + 1-2 visuals)
- Each topic = **3-6 modules**
- Each phase = **3-5 topics**
- Total = ~80-100 modules across 5 phases

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

### Phase 1: The Sky

#### Topic: Foundations
| Module | Title | Key Concepts | Check Focus |
|--------|-------|-------------|-------------|
| 1.1 | The Night Sky & Ecliptic | Celestial sphere, ecliptic plane, 23.5° tilt | Identify ecliptic, why planets appear on it |
| 1.2 | Measuring the Sky | Degrees, minutes, seconds, 360° circle | Convert between degree formats |
| 1.3 | The Zodiac Belt | 12 signs × 30° = 360°, 27 nakshatras × 13°20' | Calculate sign from degree |

#### Topic: Grahas (Planets)
| Module | Title | Key Concepts | Check Focus |
|--------|-------|-------------|-------------|
| 2.1 | The Nine Grahas | 7 planets + Rahu/Ketu, what each represents | Identify planet karakatvas |
| 2.2 | Planetary Relationships | Natural friends, enemies, neutrals, temporary | Given 2 planets, identify relationship |
| 2.3 | Dignities | Exaltation, debilitation, own sign, moolatrikona | Given planet+sign, identify dignity |
| 2.4 | Retrograde & Combustion | What causes retrograde, combustion orbs | Identify retrograde effects |

#### Topic: Rashis (Signs)
| Module | Title | Key Concepts | Check Focus |
|--------|-------|-------------|-------------|
| 3.1 | The 12 Signs | Names, symbols, sequence | Sign from degree |
| 3.2 | Sign Qualities | Movable/Fixed/Dual, elements (Fire/Earth/Air/Water) | Classify signs by quality+element |
| 3.3 | Sign Lordship | Which planet rules which sign | Given sign, name lord |

#### Topic: Ayanamsha
| Module | Title | Key Concepts | Check Focus |
|--------|-------|-------------|-------------|
| 4.1 | Precession of Equinoxes | Earth's wobble, 25,772-year cycle | Why tropical ≠ sidereal |
| 4.2 | Two Zodiacs | Tropical vs sidereal, which India uses and why | Convert tropical → sidereal |
| 4.3 | Ayanamsha Systems | Lahiri, KP, Raman — differences | Which is India's official standard |

### Phase 2: Pancha Anga

#### Topic: Tithi
| Module | Title | Check Focus |
|--------|-------|-------------|
| 5.1 | What Is a Tithi? | Formula: (Moon-Sun)/12° |
| 5.2 | Shukla & Krishna Paksha | Identify paksha from tithi number |
| 5.3 | Special Tithis | Ekadashi, Amavasya, Purnima significance |

#### Topic: Nakshatra
| Module | Title | Check Focus |
|--------|-------|-------------|
| 6.1 | The 27 Nakshatras | Formula: Moon°/13.33° |
| 6.2 | Padas & Navamsha Connection | 4 padas per nakshatra, pada → navamsha sign |
| 6.3 | Nakshatra Dasha Lords | Vimshottari sequence: Ketu→Venus→Sun→... |
| 6.4 | Gana & Compatibility | Deva/Manushya/Rakshasa classification |

#### Topic: Yoga & Karana
| Module | Title | Check Focus |
|--------|-------|-------------|
| 7.1 | Panchang Yoga | Formula: (Sun+Moon)/13.33° |
| 7.2 | Karana | Formula: (Moon-Sun)/6°, Chara vs Sthira |

#### Topic: Vara
| Module | Title | Check Focus |
|--------|-------|-------------|
| 8.1 | The Hora Derivation | Why weekdays are in this order |
| 8.2 | Day Activities | Which activities suit which day |

### Phase 3: The Chart

#### Topic: Kundali Construction
| Module | Title | Check Focus |
|--------|-------|-------------|
| 9.1 | What Is a Birth Chart? | Lagna, 12 houses, snapshot of sky |
| 9.2 | Computing the Lagna | Sidereal time → ascendant degree |
| 9.3 | Placing Planets | Longitude → sign → house |
| 9.4 | Reading a North Indian Chart | Identify houses, planets from diagram |

#### Topic: Bhavas (Houses)
| Module | Title | Check Focus |
|--------|-------|-------------|
| 10.1 | 12 Houses & Significations | What each house represents |
| 10.2 | Kendra, Trikona, Dusthana | Classify houses by type |
| 10.3 | House Lords | Lord of 7th for Aries lagna = ? |

#### Topic: Divisional Charts
| Module | Title | Check Focus |
|--------|-------|-------------|
| 11.1 | Why Divisional Charts? | D1 = general, D9 = marriage, D10 = career |
| 11.2 | Navamsha (D9) | How D9 is calculated, what it reveals |
| 11.3 | Key Vargas | D2 (wealth), D7 (children), D10 (career) |

#### Topic: Dashas
| Module | Title | Check Focus |
|--------|-------|-------------|
| 12.1 | Vimshottari System | 120-year cycle, 9 planets, nakshatra-based |
| 12.2 | Reading Dasha Periods | Mahadasha → Antardasha → Pratyantar |
| 12.3 | Timing Events | Which dasha activates which house |

#### Topic: Transits
| Module | Title | Check Focus |
|--------|-------|-------------|
| 13.1 | How Transits Work | Current sky vs birth chart |
| 13.2 | Sade Sati | Saturn's 7.5-year transit over Moon |
| 13.3 | Ashtakavarga Transit | SAV scoring for transit quality |

### Phase 4: Applied Jyotish

#### Topic: Compatibility
| Module | Title | Check Focus |
|--------|-------|-------------|
| 14.1 | Ashta Kuta System | 8 factors, 36 points |
| 14.2 | Key Kutas | Nadi (8pts), Bhakut (7pts), Gana (6pts) |
| 14.3 | Doshas in Matching | Nadi Dosha, Bhakut Dosha |

#### Topic: Yogas & Doshas
| Module | Title | Check Focus |
|--------|-------|-------------|
| 15.1 | Pancha Mahapurusha | 5 yogas: which planet + which condition |
| 15.2 | Raja & Dhana Yogas | Kendra-Trikona lord connection |
| 15.3 | Common Doshas | Mangal, Kala Sarpa — formation + cancellation |
| 15.4 | Remedial Measures | Gemstones, mantras, charity per planet |

### Phase 5: Classical Knowledge

#### Topic: Classical Texts
| Module | Title | Check Focus |
|--------|-------|-------------|
| 16.1 | Astronomical Texts | Surya Siddhanta, Aryabhatiya — what's still valid |
| 16.2 | Hora Texts | BPHS, Phaladeepika, Brihat Jataka — key contributions |
| 16.3 | India's Contributions | Sine function, weekday order, Earth rotation |

**Total: ~50 modules across 16 topics across 5 phases**

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

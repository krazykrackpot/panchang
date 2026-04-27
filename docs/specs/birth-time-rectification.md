# Birth Time Rectification — Technical Specification

> Status: Design complete. Ready for implementation.
> Priority: High | Unique differentiator — no free web tool does this.

---

## The Problem

Many users don't know their exact birth time. Hospital records in India often round to the nearest 15-30 minutes, and older births (pre-1990) may only have "morning" or "around 3 PM." A 15-minute error in birth time can shift the Lagna by 7-8 degrees, potentially changing the rising sign entirely. This invalidates:
- All house-based predictions (which planet rules which house)
- Dasha timing (starting balance depends on Moon's exact position)
- Yoga detection (some yogas require planets in specific houses)

## The Solution

**Input**: User provides:
1. Known birth date (required)
2. Approximate birth time (optional — "between 8 AM and 12 PM", or "around 10:30 AM")
3. Birth location (required)
4. 5-10 significant life events with dates:
   - Marriage date
   - Birth of first child
   - Major career change / promotion
   - Serious illness / surgery
   - Parent's death
   - Major relocation / foreign travel
   - Major financial gain / loss

**Output**: 
- Top 3 most likely birth times (ranked by score)
- For each: the Lagna sign, degree, and a confidence score (0-100%)
- "Why this time?" — which life events matched which dasha/transit predictions

## Algorithm

### Phase 1: Candidate Generation
1. Define search window: if user says "around 10:30 AM", scan 9:00 AM to 12:00 PM in 2-minute steps (90 candidates). If "morning", scan 6 AM to 12 PM (180 candidates). If unknown, scan full 24h (720 candidates).
2. For each candidate time, compute:
   - Ascendant degree and sign
   - Full planet positions (same for all — only Lagna changes significantly over hours)
   - Vimshottari Dasha timeline (Moon position is nearly constant within ±3h, but Lagna changes dasha balance slightly)

### Phase 2: Event Matching
For each life event, check classical signifiers against the candidate chart:

**Marriage**:
- Was the Dasha lord connected to the 7th house (lord, occupant, or aspect)?
- Was Jupiter transiting the 7th from Moon or Lagna?
- Was the Antar Dasha lord a natural significator of marriage (Venus, Jupiter)?
- Score: 0-10 per event

**Children**:
- Was the Dasha lord connected to the 5th house?
- Was Jupiter transiting the 5th or 9th from Moon?
- Score: 0-10

**Career Change**:
- Was the Dasha lord connected to the 10th house?
- Was Saturn transiting the 10th or making aspects to the 10th?
- Score: 0-10

**Illness**:
- Was the Dasha lord connected to the 6th/8th house?
- Was the Antar Dasha of a malefic (Mars, Saturn, Rahu, Ketu)?
- Score: 0-10

**Parent's Death**:
- 4th house (mother) or 9th house (father) activated?
- Maraka dasha periods (2nd/7th lord from relevant house)?
- Score: 0-10

**Financial Gain/Loss**:
- 2nd/11th house activation for gains, 12th for losses?
- Score: 0-10

### Phase 3: Scoring & Ranking
1. For each candidate time, sum all event match scores
2. Normalize to 0-100% confidence
3. Apply Lagna-sign clustering: candidates within the same Lagna sign get their scores averaged (prevents noisy per-minute fluctuations)
4. Return top 3 Lagna candidates with:
   - Best birth time within that Lagna window
   - Confidence score
   - Event-by-event breakdown ("Marriage 2015 matched Moon-Venus dasha + Jupiter transit 7th = 8/10")

### Phase 4: Validation
- If the top candidate scores >70% and the second scores <40%, the rectification is "strong"
- If top 2 are within 10% of each other, the rectification is "ambiguous — provide both charts"
- If no candidate scores >40%, the events don't discriminate the Lagna — more events needed

## Technical Architecture

```
src/lib/rectification/
├── candidate-generator.ts    # Phase 1: generate birth time candidates
├── event-matcher.ts          # Phase 2: match events to chart signifiers
├── scorer.ts                 # Phase 3: score and rank candidates
├── types.ts                  # Input/output types
└── rectification-engine.ts   # Main orchestrator
```

**API**: `POST /api/rectification` — accepts birth data + events, returns ranked candidates.
Computation budget: ~720 candidates × lightweight chart = ~5-10 seconds on Vercel.

**UI**: `/rectification` page with:
1. Step 1: Birth date + location + approximate time range
2. Step 2: Life events form (date picker + event type dropdown + optional description)
3. Step 3: "Analyzing..." progress indicator
4. Step 4: Results — top 3 candidates as cards, expandable event matching breakdown

## Data Model

```typescript
interface LifeEvent {
  type: 'marriage' | 'child_birth' | 'career_change' | 'illness' | 'parent_death' | 'relocation' | 'financial_gain' | 'financial_loss' | 'education';
  date: string;        // YYYY-MM-DD
  description?: string; // Optional user note
}

interface RectificationInput {
  birthDate: string;    // YYYY-MM-DD
  birthLat: number;
  birthLng: number;
  birthTimezone: number;
  approximateTime?: string;  // "10:30" or null for unknown
  timeRange?: { from: string; to: string }; // "08:00" to "12:00"
  events: LifeEvent[];
}

interface RectificationCandidate {
  birthTime: string;     // "10:22"
  lagnaSign: number;     // 1-12
  lagnaSignName: string;
  lagnaDegree: number;
  confidence: number;    // 0-100
  totalScore: number;
  eventMatches: {
    event: LifeEvent;
    score: number;       // 0-10
    reason: string;      // "Moon-Venus dasha + Jupiter 7th transit"
  }[];
}

interface RectificationResult {
  candidates: RectificationCandidate[]; // Top 3
  searchWindow: { from: string; to: string };
  candidatesEvaluated: number;
  strength: 'strong' | 'moderate' | 'ambiguous' | 'insufficient';
}
```

## Competitive Analysis
- **Jagannatha Hora** (desktop): Has rectification but requires technical knowledge to use
- **AstroSage**: No rectification feature
- **Prokerala**: No rectification feature
- **Drik Panchang**: No rectification feature
- **Our edge**: First free web-based rectification tool with plain-language event input

## Dependencies
- `generateKundali` — for computing charts at candidate times (already exists)
- `computeKeyDates` — for checking dasha/transit activations (already exists)
- Vimshottari Dasha — for dasha period lookups (already exists)

## Estimated Effort
- Engine: 3-4 files, ~500-700 lines
- API route: 1 file, ~100 lines
- UI page: 1 file, ~400 lines
- Total: ~1,200 lines, 2-3 hours

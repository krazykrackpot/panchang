# Direction 3: Data-Over-Time Intelligence — Deep Dive

**Date**: 2026-04-25
**Status**: Deep dive brainstorm

---

## Core Thesis

Every astrology app computes a snapshot: "Here's your chart. Here's what the planets are doing today." None of them ask: "Was yesterday's prediction accurate?" or "What patterns emerge across your last 6 months of experience?"

Direction 3 turns the app from a calculator into a **personal astrological intelligence system** — one that learns from the user's actual experience and improves its relevance over time.

This is the moat. Computation can be copied. A personal dataset of 500 journal entries correlated with planetary positions cannot.

---

## Data Model Foundation

All Direction 3 features share a common data substrate: **user experience records correlated with planetary state**.

### Core Table: `astro_journal`
```sql
CREATE TABLE astro_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  entry_date DATE NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN (
    'daily_checkin', 'life_event', 'reflection', 'prediction_review', 'dasha_boundary'
  )),
  
  -- User input
  mood_score SMALLINT CHECK (mood_score BETWEEN 1 AND 5),
  energy_score SMALLINT CHECK (energy_score BETWEEN 1 AND 5),
  content TEXT,                    -- Free-form journal text
  tags TEXT[] DEFAULT '{}',        -- User-defined tags
  event_category TEXT,             -- career, health, relationship, financial, spiritual, creative, family, education
  event_significance SMALLINT CHECK (event_significance BETWEEN 1 AND 5),  -- 1=minor, 5=life-changing
  
  -- Auto-captured planetary state (snapshot at entry time)
  planetary_state JSONB NOT NULL,  -- { sun: { sign, nakshatra, degree, speed, retrograde }, moon: { ... }, ... }
  tithi TEXT,
  nakshatra TEXT,
  yoga TEXT,
  karana TEXT,
  weekday SMALLINT,               -- 0=Sun, 6=Sat
  
  -- Auto-captured personal state (from user's natal chart)
  current_mahadasha TEXT,          -- Planet name
  current_antardasha TEXT,
  current_pratyantardasha TEXT,
  transit_aspects JSONB,           -- Significant transit-to-natal aspects active on this date
  sade_sati_phase TEXT,            -- NULL, 'rising', 'peak', 'setting'
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, entry_date, entry_type)  -- One entry per type per day
);

-- Index for time-range queries
CREATE INDEX idx_journal_user_date ON astro_journal(user_id, entry_date DESC);
-- Index for planetary correlation queries
CREATE INDEX idx_journal_nakshatra ON astro_journal(user_id, nakshatra);
CREATE INDEX idx_journal_dasha ON astro_journal(user_id, current_mahadasha, current_antardasha);
```

### Core Table: `prediction_tracking`
```sql
CREATE TABLE prediction_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  
  -- What was predicted
  prediction_source TEXT NOT NULL CHECK (prediction_source IN (
    'annual_forecast', 'transit_alert', 'dasha_narrative', 'muhurta_ai',
    'horoscope_daily', 'horoscope_weekly', 'horoscope_monthly',
    'medical_timeline', 'financial_forecast'
  )),
  prediction_text TEXT NOT NULL,
  prediction_domain TEXT,          -- career, health, relationship, financial, spiritual, general
  prediction_date DATE NOT NULL,   -- When the prediction was made
  target_start DATE,               -- When the predicted event window starts
  target_end DATE,                 -- When it ends
  
  -- Planetary basis
  planetary_basis JSONB,           -- { type: 'transit', planet: 'Jupiter', natal_house: 7, ... }
  
  -- User evaluation (filled in later)
  accuracy_rating SMALLINT CHECK (accuracy_rating BETWEEN 1 AND 5),  -- 1=completely wrong, 5=spot on
  user_notes TEXT,
  evaluated_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_predictions_user ON prediction_tracking(user_id, target_start);
CREATE INDEX idx_predictions_unevaluated ON prediction_tracking(user_id, evaluated_at) WHERE evaluated_at IS NULL;
```

### Core Table: `life_events`
```sql
CREATE TABLE life_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  
  event_date DATE NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_category TEXT NOT NULL CHECK (event_category IN (
    'career', 'health', 'relationship', 'financial', 'spiritual',
    'creative', 'family', 'education', 'travel', 'legal', 'loss'
  )),
  event_valence SMALLINT CHECK (event_valence BETWEEN -2 AND 2),  -- -2=very negative, 0=neutral, 2=very positive
  significance SMALLINT CHECK (significance BETWEEN 1 AND 5),
  
  -- Auto-captured planetary state (same structure as journal)
  planetary_state JSONB NOT NULL,
  current_mahadasha TEXT,
  current_antardasha TEXT,
  transit_aspects JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_date ON life_events(user_id, event_date DESC);
CREATE INDEX idx_events_category ON life_events(user_id, event_category);
```

### RLS Policies (all tables)
```sql
-- Users can only see/edit their own data
ALTER TABLE astro_journal ENABLE ROW LEVEL SECURITY;
CREATE POLICY journal_user_policy ON astro_journal
  FOR ALL USING (auth.uid() = user_id);
-- Same pattern for prediction_tracking and life_events
```

---

## 3A. Astro Journal

### Concept
A daily journal that auto-tags entries with the current planetary state. Over time, it builds a personal dataset that can be queried by planetary period, nakshatra, tithi, or dasha — revealing patterns the user would never notice manually.

### Features

#### Daily Check-in (30 seconds)
A lightweight daily prompt:
- **Mood**: 5-point scale (visual: moon phases from new to full)
- **Energy**: 5-point scale (visual: sun intensity from dim to bright)
- **One-line note** (optional): "Good meeting with client" or "Felt anxious all day"
- **Tags** (optional): Quick-tap from recent tags or create new

Behind the scenes, the system auto-captures:
- Current tithi, nakshatra, yoga, karana, weekday
- All 9 planetary positions (sign, nakshatra, degree, speed, retrograde)
- User's current Mahadasha/Antardasha/Pratyantardasha
- Active transit-to-natal aspects (from Gochara engine)
- Sade Sati phase (if active)

This creates one `astro_journal` row of type `daily_checkin`.

#### Free-form Journal Entry
For users who want to write more:
- Rich text entry (markdown supported)
- Event category selector (career, health, relationship, etc.)
- Significance rating (1-5)
- Same auto-capture of planetary state

#### Browse & Search
- **Calendar view**: Month grid with mood color dots. Heatmap of energy/mood over time.
- **List view**: Chronological feed of entries with planetary sidebar (what was happening in the sky that day)
- **Search**: Full-text search across journal entries
- **Filter by planetary period**: "Show me all entries from my Jupiter Antardasha" → filters by `current_antardasha = 'Jupiter'`
- **Filter by nakshatra**: "Show me all entries when Moon was in Rohini" → filters by `nakshatra = 'Rohini'`
- **Filter by tithi**: "Show me all Ekadashi entries" → reveals fasting-day patterns

### Architecture
- Page: `/dashboard/journal` — main journal page
- Components: `JournalCheckin.tsx`, `JournalEntry.tsx`, `JournalCalendar.tsx`, `JournalFilters.tsx`
- API: `POST /api/journal` (create entry), `GET /api/journal` (list with filters)
- The planetary state snapshot is computed server-side at entry creation time using existing `getPanchangData()` + `getDashaState()`

---

## 3B. Prediction Scorecard

### Concept
The app already generates dozens of predictions per user: annual forecasts, transit alerts, dasha narratives, daily horoscopes, muhurta recommendations. Start tracking them. Let users rate accuracy. Build a personal model of which prediction types work best for this user.

### Features

#### Prediction Capture (Automatic)
Every time the system generates a prediction, it creates a `prediction_tracking` row:
- Annual forecast monthly predictions → 12 predictions per year
- Transit alerts ("Jupiter entering your 7th house — relationship opportunities") → 4-6 per year
- Dasha transition narratives → 2-3 per year
- Daily horoscope → 365 per year (optional tracking — too noisy by default, opt-in)

Each prediction stores: the text, the planetary basis, the predicted time window.

#### Review Queue
A periodic prompt (weekly or monthly):
- "You have 3 predictions to review from the past month"
- Show the prediction text + what was predicted + the time window
- User rates: 1 (completely wrong) to 5 (spot on)
- Optional note: "I didn't get a new relationship, but I did deepen an existing friendship"

#### Accuracy Dashboard
After 3+ months of data:
- **Overall accuracy**: Average rating across all reviewed predictions
- **By source**: "Transit alerts: 3.8/5, Annual forecast: 3.2/5, Daily horoscope: 2.6/5"
- **By domain**: "Career predictions: 4.1/5, Relationship: 2.9/5, Health: 3.5/5"
- **By planetary basis**: "Jupiter transit predictions: 4.0/5, Saturn transit: 3.1/5, Dasha-based: 3.6/5"
- **Trend line**: Is accuracy improving over time? (As the system learns the user's life context)

#### Personalized Weighting (Long-term)
After 50+ rated predictions:
- The system can weight prediction sources differently per user
- "For this user, transit-based predictions are 1.5x more accurate than dasha-based"
- Future predictions display with a confidence indicator based on the user's historical accuracy for that prediction type
- This is the machine learning component — but it starts as simple averaging, not deep learning

### Architecture
- Prediction capture: Hook into existing forecast/alert/horoscope generation code. Each generator calls `trackPrediction()` which inserts a row.
- Review: `/dashboard/predictions` page with review queue
- API: `POST /api/predictions/review` (rate a prediction), `GET /api/predictions/stats` (accuracy dashboard)
- The accuracy computation is a SQL aggregation — no ML needed initially

---

## 3C. Life Event Timeline

### Concept
Major life events plotted on a timeline overlaid with dasha periods, transits, and eclipses. The visualization reveals correlations between planetary periods and life events — patterns that are the core claim of Vedic astrology, made tangible and personal.

### Features

#### Event Entry
Users log major life events:
- Date, title, description
- Category (career, health, relationship, financial, spiritual, creative, family, education, travel, legal, loss)
- Valence: very positive / positive / neutral / negative / very negative
- Significance: 1-5

The system auto-snapshots the planetary state at the event date (or computes it retroactively if the event is in the past).

#### Timeline Visualization
A horizontal timeline (builds on 6B Dasha Timeline) with three layers:
1. **Top**: Dasha bands (Mahadasha/Antardasha) — colored by planet
2. **Middle**: Life events as vertical pins — colored by category, sized by significance, upward for positive valence, downward for negative
3. **Bottom**: Transit bands — Saturn sign changes, Jupiter sign changes, Rahu-Ketu axis shifts, eclipses, retrograde periods

Zoom in/out to see different time scales. Pan across years.

#### Correlation Analysis
After 10+ events, the system identifies patterns:

**Dasha correlations**:
- "3 of your 4 career events occurred during Mercury periods (Mercury rules your 10th house)"
- "All 3 health events were during Saturn dasha/antardasha"
- "Your most positive events cluster in Jupiter periods"

**Transit correlations**:
- "Your last 3 job changes all coincided with Jupiter transiting your 10th house"
- "Relationship events correlate with Venus transits through your 7th house"
- "Financial setbacks align with Saturn transiting your 2nd house"

**Eclipse correlations**:
- "The eclipse in October 2024 was in your 6th house — you logged a health event within 2 months"

**Nakshatra/Tithi patterns**:
- "4 of your 6 positive career events happened during Pushya nakshatra days"
- "Financial events tend to cluster around Purnima (full moon)"

The system presents these as "Discoveries" — cards that appear once enough data supports the pattern (minimum 3 occurrences).

#### Retrospective Analysis
"What was happening in the sky when [event] occurred?"
- User picks any past event → system computes full planetary state for that date
- Shows: chart of the sky, transit-to-natal aspects, dasha period, active eclipses
- Interpretation: "On the day you got married, Jupiter was transiting your 7th house (relationship), and you were in Venus Mahadasha (marriage). Venus was in its exaltation sign."

### Architecture
- Page: `/dashboard/timeline` — timeline visualization page
- Components: `LifeTimeline.tsx` (extends DashaTimeline from 6B), `EventEntry.tsx`, `CorrelationPanel.tsx`, `RetrospectiveModal.tsx`
- API: `POST /api/events` (log event), `GET /api/events` (list), `GET /api/events/correlations` (compute patterns)
- Correlation engine: `src/lib/personalization/correlation-engine.ts` — runs pattern detection across events + planetary state

### Correlation Engine Design
```
function computeCorrelations(events: LifeEvent[], natalChart: KundaliData): Correlation[] {
  // Group events by category
  // For each category:
  //   Count occurrences per Mahadasha lord
  //   Count occurrences per transiting planet in each natal house
  //   Count occurrences per nakshatra
  //   Count occurrences per tithi phase (Shukla/Krishna)
  //   Count occurrences within 60 days of an eclipse
  // 
  // Statistical test: is this count significantly above random?
  //   Random baseline: if 7 events in 10 years, and Jupiter spends ~1 year per sign,
  //   expected events per Jupiter-in-any-house = 7/12 ≈ 0.58
  //   If 3 events occurred with Jupiter in 10th house, that's 5x baseline → significant
  //
  // Minimum threshold: 3 occurrences of the same pattern
  // Report patterns that exceed 2x the random baseline
}
```

This is not machine learning — it's counting and ratio analysis. Simple, explainable, and honest about its statistical basis.

---

## 3D. Transit Replay ("Time Machine")

### Concept
Pick any past date → see the full sky state + how it aspected the user's natal chart. A "time machine" for astrological retrospection. Scrub through months/years watching transits move across houses.

### Features

#### Date Picker Mode
- Select any date (past or future)
- System computes: all 9 planetary positions, house placements relative to natal chart, active aspects, dasha period active on that date
- Display: split view — natal chart (fixed) + transit overlay (for selected date)
- Side panel: "What was active on this date" — transit aspects, dasha, nakshatra, tithi

#### Scrub Mode
- Horizontal time scrubber (day/week/month/year granularity)
- As user scrubs, transit planets animate across the natal chart
- Aspect lines appear/disappear
- Dasha indicator updates
- Events from the Life Event Timeline (3C) appear as markers: "You logged 'Got promotion' on this date"
- Journal entries from 3A appear as mood/energy dots

#### "What Was Special About This Date?"
- Quick analysis: compute all notable planetary conditions for the selected date
- "Saturn was stationary (about to go retrograde) in your 10th house"
- "You were in a Rahu/Jupiter antardasha transition"
- "There was a lunar eclipse 3 days ago in your 6th house"
- "Moon was in Pushya nakshatra — your birth nakshatra"

### Architecture
- Component: `src/components/transit/TransitReplay.tsx` — extends the existing chart with time controls
- Computation: `getPlanetaryPositions(jd)` for any date + `analyzGochara()` from existing transit engine
- Page: `/dashboard/transit-replay` or a mode toggle on `/dashboard/transits`
- Integration: Link from Life Event Timeline: "See sky on this date" button on each event

---

## 3E. Dasha Diary

### Concept
Structured reflection at each dasha/antardasha boundary. The system generates a journaling prompt based on the incoming dasha lord's significations, then at the period's end, the user reviews what actually happened. Over time, this builds the most personal astrological dataset possible.

### Features

#### Incoming Dasha Prompt
When a new Antardasha begins (detected by comparing current date with dasha timeline):
- System generates a reflection prompt based on the dasha lord:
  - Lord's natal house lordship → predicted life areas
  - Lord's natal sign/nakshatra → predicted quality/style
  - Lord's dignity → predicted intensity (exalted = intense, debilitated = challenging)
- Example: "Mars Antardasha begins today. Mars rules your 3rd (communication, siblings, short travel) and 10th (career, public reputation) houses. Mars is in Capricorn (exalted) in your 5th house. This period may bring energetic creative pursuits, competitive career moves, and assertive communication. What are you noticing?"

#### End-of-Period Review
When the Antardasha ends:
- Show the original prompt alongside any journal entries from the period
- Ask: "Looking back at the past [X months] of Mars Antardasha, what themes emerged?"
- Structured reflection: rate accuracy of the initial prompt (1-5), note what actually happened
- This feeds into the Prediction Scorecard (3B)

#### Dasha Diary View
- Chronological list of all dasha transitions with their prompts and reviews
- Filter by planet: "Show me all my Jupiter period reflections"
- Pattern view: "Across your 3 Saturn antardasha periods, you consistently reported [theme]"

### Architecture
- Auto-detection: Cron job or dashboard load hook that checks if a dasha transition occurred since last check
- Prompt generation: `src/lib/personalization/dasha-prompts.ts` — generates prompts from dasha lord + natal placement
- Page: `/dashboard/dasha-diary` — chronological diary view
- Notification: Push/email when a new dasha period begins: "Your Mars Antardasha begins today. Check your Dasha Diary for a reflection prompt."

---

## 3F. Personalized Almanac ("Your Year in the Stars")

### Concept
Auto-generated annual retrospective that synthesizes journal entries, life events, prediction accuracy, and planetary positions into a beautiful, personal document. The user's year told through the lens of the stars.

### Features

#### Annual Report Generation
At year-end (or on demand for any completed year):
- **Month-by-month narrative**: For each month, pull journal entries, life events, and active dasha/transits. Synthesize into a paragraph: "March was marked by Jupiter transiting your 7th house — you logged 4 relationship-related entries, including meeting [partner/client]. Your mood averaged 4.2/5, your highest month."
- **Dasha transitions**: "You transitioned from Saturn/Venus to Saturn/Sun in July. Your journal tone shifted from [contemplative] to [assertive]."
- **Prediction accuracy summary**: "Of 14 predictions made for 2026, you rated 9 — average accuracy 3.6/5. Transit-based predictions performed best (4.1/5)."
- **Life events mapped**: Timeline visualization of the year with events + dashas + transits
- **Personal discoveries**: Top correlations found during the year ("Your energy is consistently higher during Shukla Paksha")
- **Top 3 planetary influences**: Which planets most impacted your year and how

#### Output Formats
- **Web**: Beautiful scrollable page with charts and visualizations
- **PDF**: Exportable, printable annual report (extends existing PDF infrastructure)
- **Email**: Summary version sent as a year-end email

#### LLM Enhancement (Optional, Premium)
For premium users, the monthly narratives can be enhanced by Claude:
- Feed journal entries + planetary state → Claude generates a cohesive narrative
- "March's Jupiter transit through your 7th house coincided with three entries about deepening professional partnerships. The transit's theme of expansion and opportunity aligns with your experience of..."
- Rate-limited: 1 almanac generation per year per user

### Architecture
- Engine: `src/lib/personalization/almanac-engine.ts` — pulls from all Direction 3 tables, generates structured report data
- LLM: Optional Claude call for narrative enhancement (uses existing `llm-client.ts`)
- Page: `/dashboard/almanac/[year]`
- PDF: Extend `src/lib/export/pdf-almanac.ts`
- Cron: January 1 → generate almanacs for all users with sufficient data (50+ journal entries in the year)

---

## Implementation Priority

### Phase 1: Data Foundation + Journal (Weeks 1-3)
- Database migrations: `astro_journal`, `prediction_tracking`, `life_events` tables
- API routes: CRUD for journal entries
- Journal UI: daily check-in widget + journal page
- Auto-capture: planetary state snapshot on each entry

This is the foundation everything else depends on. Without journal data, there's nothing to analyze.

### Phase 2: Life Events + Transit Replay (Weeks 4-6)
- Life event entry UI + API
- Transit Replay component (depends on Direction 6's transit infrastructure)
- Life Timeline visualization (depends on Direction 6's Dasha Timeline)
- Retrospective analysis: "What was the sky on this date?"

### Phase 3: Prediction Tracking + Correlation (Weeks 7-9)
- Hook prediction capture into existing forecast/alert generators
- Review queue UI
- Accuracy dashboard
- Correlation engine: basic counting + ratio analysis

### Phase 4: Dasha Diary + Almanac (Weeks 10-12)
- Dasha transition detection + prompt generation
- Dasha Diary page
- Almanac engine + page + PDF export
- LLM narrative enhancement (premium)

### Total estimate: ~12 weeks

---

## Cross-Cutting Concerns

**Privacy**: This is the most personal data in the app. All tables have strict RLS (user can only see their own data). No admin access without explicit user consent. Journal content is never used for training, shared with other users, or exposed to any API except the user's own dashboard.

**Data portability**: Users must be able to export all their journal/event/prediction data as JSON or CSV. GDPR-style "download my data" and "delete my data" flows.

**Minimum data thresholds**: Don't show correlation analysis until there's enough data to be meaningful:
- Correlations: minimum 10 events across 6+ months
- Prediction accuracy: minimum 10 rated predictions
- Almanac: minimum 50 journal entries in the year
- Before threshold: show a progress bar ("Log 3 more events to unlock pattern analysis")

**Performance**: Journal entries are write-heavy, read-moderate. Index on (user_id, entry_date). Correlation computation can be expensive — cache results and recompute weekly (not on every page load).

**Integration with Direction 6**: The Life Event Timeline (3C) overlays on the Dasha Timeline (6B). Transit Replay (3D) uses the same chart + time controls as the Transit Playground (6C). Design these as shared components from the start.

**Integration with Direction 5**: Medical Astrology health timeline predictions (5B-3) feed into the Prediction Scorecard (3B). Financial forecast predictions (5D-5) do the same. Every prediction-generating feature becomes a data source for accuracy tracking.

---

## The Flywheel

This is why Direction 3 is the moat:

```
User logs daily check-in (30 seconds)
  → System captures planetary state automatically
    → After 3 months: patterns emerge ("Your energy peaks during Pushya")
      → User trusts the system more, logs more consistently
        → After 6 months: prediction accuracy becomes meaningful
          → System adjusts prediction confidence per user
            → Predictions become more relevant
              → User engagement increases
                → More data → better patterns → more trust → loop
```

No competitor can replicate a user's 6 months of journal data. This is defensible by nature.

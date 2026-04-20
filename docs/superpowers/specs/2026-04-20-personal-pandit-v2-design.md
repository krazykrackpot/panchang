# Personal Pandit v2 — Living Daily Companion

> **Goal:** Transform Personal Pandit from a static snapshot into a living, breathing daily companion that evolves with the user's life and the moving sky.

---

## Executive Summary

The current engine (v1) computes a one-time reading from natal data. V2 adds:
1. **Real transit computation** (accuracy fix — the engine currently lies)
2. **Daily cadence layer** ("Today for You" per domain)
3. **Key Dates list** (5-10 upcoming significant periods on dashboard + kundali)
4. **Priority ranking** (lead with what matters NOW)
5. **Emotional intelligence** (progressive disclosure, celebration, actionable guidance)
6. **User context** (question-driven entry point)
7. **Reading trajectory** (monthly score persistence + sparkline trends)
8. **Notification integration** (push alerts on domain activation changes)

---

## Tier 1: Accuracy Fixes

### 1.1 Wire Real Transit Positions

**Problem:** `synthesizer.ts` uses natal planet positions as "current activation" data (lines 430-448). When it says "Jupiter is activating your career house," it means Jupiter was there AT BIRTH, not today.

**Fix:**
- Add `currentTransits?: TransitData` parameter to `synthesizeReading()`
- Compute current slow-planet positions (Ju, Sa, Ra, Ke) via `computeCurrentTransits()` utility
- Use sidereal longitudes from ephemeris for the current date
- Map each planet to current house (relative to natal ascendant)
- Replace the natal-position-based activation logic

**Files to modify:**
- `src/lib/kundali/domain-synthesis/synthesizer.ts` — accept + use transit data
- `src/lib/kundali/domain-synthesis/types.ts` — add TransitData to input type
- Create: `src/lib/kundali/domain-synthesis/transit-activation.ts` — compute current transits

### 1.2 Wire Varga Delivery Scores

**Problem:** Line 372 in scorer.ts: `const vargaDeliveryScore = 50;` — hardcoded neutral.

**Fix:**
- Import varga promise/delivery analysis from existing `varga-deep-analysis.ts`
- Compute per-domain varga confirmation score based on relevant divisional charts
- Replace hardcoded 50 with computed value

**Files to modify:**
- `src/lib/kundali/domain-synthesis/scorer.ts` — wire varga engine output

### 1.3 Integrate Sade Sati into Domain Scoring

**Problem:** `CurrentPeriodInput` has `sadeSatiStatus` but it's not used in domain ratings.

**Fix:**
- When Sade Sati is active, apply penalty to domains governed by Moon-linked houses (4th house = family, 7th = marriage, mental health aspects of 1st)
- Add Sade Sati phase info to `CurrentPeriodReading` display
- Mention phase in narrator output when active

---

## Tier 2: Living Daily Companion

### 2.1 "Today for You" Layer

A daily micro-reading per domain synthesizing:
- Today's panchang (tithi auspiciousness, nakshatra compatibility with natal Moon)
- Current transiting Moon house (activates that house's domains)
- Active hora windows (planetary hours → domain opportunities)
- Varjyam/Amrit Kalam relevance to domains
- Rahu Kaal/Yamaganda caution windows

**Output per domain:**
```typescript
interface DailyDomainInsight {
  domain: DomainType;
  todayScore: number; // 0-10 — how supportive is today for this domain
  headline: LocaleText; // "Good day for career moves — Jupiter hora at 2pm"
  bestWindow?: { start: string; end: string; reason: LocaleText };
  caution?: { start: string; end: string; reason: LocaleText };
  tip: LocaleText; // One actionable sentence
}
```

**Integration:**
- New function: `computeDailyInsights(personalReading, todayPanchang, currentTransits)`
- Shows as a collapsible "Today" section above the domain cards
- Refreshes daily (computed server-side via user profile birth data + today's panchang)

### 2.2 Key Dates / Upcoming Significant Periods

**5-10 most important upcoming dates for this native**, prominently displayed on:
- Kundali main page (after chart generation)
- User dashboard (always visible for logged-in users with birth data)

**Sources for key dates:**
1. **Dasha transitions** — Mahadasha, Antardasha, Pratyantardasha changes (next 12 months)
2. **Slow planet ingresses** — Jupiter/Saturn changing signs (relative to natal houses)
3. **Eclipses near natal points** — Solar/lunar eclipses within 5° of natal Sun/Moon/Ascendant
4. **Sade Sati phase changes** — Entry, peak, exit dates
5. **Birthday return (Varshaphal)** — Annual solar return date
6. **Retrograde stations on natal planets** — Saturn/Jupiter stationing within 3° of a natal planet
7. **Rahu-Ketu axis transit over ascendant or Moon** — Major karmic activation
8. **Favorable muhurta windows** — Best dates for the user's most-activated domain

**Output:**
```typescript
interface KeyDate {
  date: string; // ISO date
  type: 'dasha' | 'transit' | 'eclipse' | 'sadeSati' | 'varshaphal' | 'retroStation' | 'muhurta';
  title: LocaleText;
  description: LocaleText;
  domain?: DomainType; // which life area is most affected
  impact: 'positive' | 'challenging' | 'transformative' | 'neutral';
  icon: string; // planet/event icon identifier
}
```

**UI Component:** `KeyDatesTimeline` — vertical timeline with color-coded dots, date, title, and 1-line description. Expandable for full context.

### 2.3 Domain Priority Ranking

**Problem:** 8 equal cards hide what matters most.

**Fix:**
- Compute `activationPressure` per domain = f(current transit hits, dasha relevance, approaching timeline triggers)
- Sort domains by `activationPressure` descending
- Top 2-3 get "spotlight" treatment (larger cards, expanded headline)
- Remaining 5-6 shown in compact grid below

**Visual:** Hero section shows the 2-3 "active" domains as full-width stacked cards, then a 3-column grid for the rest.

### 2.4 Question-Driven Entry Point

A "What's on your mind?" interaction before showing the full dashboard:

```
┌─────────────────────────────────────────────┐
│  What would you like guidance on today?     │
│                                             │
│  💼 Career & Finance    💕 Relationships     │
│  🏥 Health & Wellness   📚 Education         │
│  👶 Children & Family   🕉 Spiritual Path   │
│  ✨ Show me everything                      │
└─────────────────────────────────────────────┘
```

Selecting a domain → opens directly into that domain's deep dive with extra context. "Show me everything" → standard dashboard.

Persisted in localStorage so returning users skip it (but can change via settings).

---

## Tier 3: Emotional Intelligence

### 3.1 Progressive Disclosure for Difficult Readings

When a domain scores `adhama` or `atyadhama`:

**Framework (5-step delivery):**
1. **Acknowledge strength** — Find ONE positive factor in the domain (even if minor)
2. **Name the challenge** — State it clearly but without catastrophizing
3. **Time context** — "This intensifies until [date] when [planet] moves" or "This is the [phase] of a cycle"
4. **Concrete remedy** — One specific, actionable practice
5. **Hope/perspective** — What comes after, or how others have navigated this

**Implementation:** New narrator function `narrateWithEmpathy(domainReading, severity)` that wraps existing narrative blocks in the 5-step framework when severity is high.

### 3.2 Celebration Language

When a domain scores `uttama`:

- Use validating language: "exceptionally supported", "rare alignment", "make the most of"
- Suggest how to AMPLIFY (not just maintain): "This is your window for bold moves in [domain]"
- Connect to timing: "This favorable period extends until [date] — plan accordingly"

### 3.3 "What You Can DO" — Modern Practical Guidance

Beyond traditional remedies (gemstone/mantra/charity), add:

```typescript
interface PracticalGuidance {
  lifestyle: LocaleText; // "Focus on skill-building, not promotions"
  bestDays: string[]; // Muhurta-aware dates for domain activity
  avoid: LocaleText; // "Avoid major financial commitments until [date]"
  affirmation: LocaleText; // Positive framing for daily practice
}
```

Each domain's deep dive ends with a "Your Action Plan" section combining traditional remedies + modern guidance.

---

## Tier 4: Memory & Trajectory

### 4.1 Reading Persistence + Sparkline Trends

**Database:**
```sql
CREATE TABLE domain_readings (
  id uuid DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  computed_at timestamptz DEFAULT now(),
  domains jsonb, -- { health: 7.2, wealth: 5.4, career: 8.1, ... }
  current_period jsonb,
  top_insight text,
  PRIMARY KEY (id)
);
CREATE INDEX idx_domain_readings_user ON domain_readings(user_id, computed_at DESC);
```

**Logic:**
- Store a reading snapshot monthly (or on significant transit events)
- On dashboard, show sparkline per domain (last 6 months)
- Narrate trajectory: "Career has improved steadily over 3 months (+2.6 points)"

### 4.2 Push Notification Integration

Connect to existing `/api/cron/transit-alerts` pipeline:

- When a slow planet ingresses into a natal house, compute which domains activate
- Send personalized push: "Jupiter enters your 10th house tomorrow — career opportunities opening up"
- When Sade Sati starts/ends: domain-aware alert
- When dasha transitions: "Your Antardasha changes to Venus on [date] — marriage and wealth domains activate"

---

## Tier 5: Key Dates Implementation Detail

### Component: `KeyDatesTimeline`

**Location:** `src/components/kundali/KeyDatesTimeline.tsx`

**Placement:**
1. **Kundali page** — After chart generation, between the birth chart display and the domain dashboard. Full-width prominent section.
2. **Dashboard** — Top section after profile banner, before learning/transit widgets.

**Data flow:**
- `computeKeyDates(kundaliData, currentDate): KeyDate[]`
- Sorts by date ascending
- Limits to next 10 significant events
- Groups by month for visual clarity

**Visual design:**
- Vertical timeline with gold connecting line
- Each event: colored dot (green/gold/orange/red by impact) + date badge + title + one-line desc
- Expand on click for full context + relevant domain card
- Compact mode on dashboard (shows 3, "View all →" link to kundali page)

### Function: `computeKeyDates`

**Location:** `src/lib/kundali/domain-synthesis/key-dates.ts`

**Algorithm:**
1. Get current Vimshottari dasha timeline → find next 3 transitions
2. Compute Jupiter transit ingress dates for next 12 months
3. Compute Saturn transit ingress dates for next 12 months
4. Check eclipse dates (from eclipse engine) against natal sensitive points (Sun ±5°, Moon ±5°, Asc ±5°)
5. Check Sade Sati phase boundaries
6. Compute solar return date (birthday in sidereal terms)
7. Check if Saturn/Jupiter station retrograde/direct within 3° of any natal planet
8. Find next Rahu-Ketu transit over Ascendant or natal Moon
9. Sort all by date, deduplicate same-day events, take top 10

---

## Addendum: Enhancing Further

### A. Relationship Mode

When two users connect (matching feature), merge their Personal Pandit readings:
- Shared domain compatibility (your career + their career — synergies?)
- Combined timeline showing events affecting both
- Relationship-specific domains (7th house interactions, Venus-Mars dynamics)

### B. Predictive Accuracy Tracking

After a key date passes, ask the user: "Did this manifest? Rate 1-5."
Over time, build a personal accuracy score that calibrates which signals matter most for THIS native.

### C. Voice/Audio Readings

The narrator output is prose-ready. Add TTS (Text-to-Speech) option for each domain reading. Users can listen to their daily guidance like a podcast episode.

### D. Annual Report (PDF)

At Varshaphal (birthday), generate a comprehensive annual report:
- Year overview across all domains
- Monthly predictions
- Key dates for the year ahead
- Personalized remedy schedule
- Export as styled PDF (reuse existing PDF engine)

### E. Gemini/Multi-chart View

For users with saved family charts, show a "Family Dashboard" — how today's transits affect the whole family differently. Useful for parents checking children's education domain or career guidance for family business.

---

## Implementation Order

| Phase | Tasks | Effort | Impact |
|-------|-------|--------|--------|
| **Phase 1** | 1.1 Real transits + 1.2 Varga scores + 1.3 Sade Sati | Medium | Accuracy (MUST DO) |
| **Phase 2** | 2.2 Key Dates + UI component | Medium | High visibility feature |
| **Phase 3** | 2.1 Daily layer + 2.3 Priority ranking | Medium | Daily engagement |
| **Phase 4** | 3.1-3.3 Emotional intelligence | Low-Medium | Quality of experience |
| **Phase 5** | 2.4 Question entry + 4.1 Trajectory | Medium | Personalization depth |
| **Phase 6** | 4.2 Push notifications | Low | Retention/engagement |

**Start with Phase 1 + 2 — these fix the biggest accuracy gap and deliver the most visible new feature (Key Dates).**

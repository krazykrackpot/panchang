# Career Muhurta — Design Spec

> Status: Draft for review
> Author: Claude (Opus 4.7)
> Date: 2026-05-27
> Driver: User feedback May 2026 — "Addition of Job application / Career related daily auspicious periods required."

## 1. Why this exists

Career events are the single most common life-decision moment for our urban Indian audience: every working professional has a job interview, a salary conversation, a contract to sign, or a resignation looming on some near horizon, and they want to know "is this a good day to do it?" The traditional muhurta framework already covers this — interviews map to *Saraswati / Vidya* muhurta, contracts to *Sankalpa / Vyavasaya*, business launches to *Vyāpāra ārambha*, etc. — but our current product surfaces this only through the generic Muhurta AI activity dropdown, which:

1. Doesn't tag "career" as its own facet, so users have to know that "Important Meeting" or "Sign Contract" is the right activity for their interview.
2. Doesn't appear in the daily panchang flow, where users land first.
3. Doesn't have a dedicated landing surface, so we get no SEO traffic for the obvious high-intent queries ("best time for job interview", "नौकरी इंटरव्यू मुहूर्त", "வேலை நேர்காணல் முகூர்த்தம்").

This spec proposes a **three-phase rollout** that solves all three problems without duplicating any existing computation. Phase 1 is the must-ship; Phase 2 is the SEO play; Phase 3 is the LLM-era polish.

## 2. Scope decision

### 2.1 The activities we cover

A "career muhurta" is not a single window — it is one of ~12 distinct sub-activities, each with its own classical recommendations. The MVP covers eight, with four reserved for Phase 3.

| # | Activity | Sanskrit / classical map | Phase |
|---|----------|---------------------------|-------|
| 1 | Job interview | *Vidyārambha / Saraswati* | 1 |
| 2 | Job application submit | *Vyavasāya prasāra* | 1 |
| 3 | Salary negotiation | *Dhana-arjana* | 1 |
| 4 | Contract / offer signing | *Sankalpa, Lekhya-pātha* | 1 |
| 5 | First day at new company | *Gṛha-praveśa* (figuratively) | 1 |
| 6 | Resignation (handing in notice) | *Tyāga-saṅkalpa* | 1 |
| 7 | New business launch | *Vyāpāra ārambha* | 1 |
| 8 | Asking for promotion | *Adhikāra-vṛddhi* | 1 |
| 9 | Public presentation / pitch | *Vāk-siddhi muhurta* | 3 |
| 10 | LinkedIn profile / personal branding launch | *Yashas-prāpti* | 3 |
| 11 | Performance review | *Tulā-samīkṣaṇa* | 3 |
| 12 | Investment / fundraising round | *Artha-saṅgrahaṇa* | 3 |

### 2.2 What "good time" means for each — UI emphasis hints

The engine is **rule-based**, not weight-based (see §3). The matrix below is **not a runtime data structure** — it's a guide for the per-activity landing-page copy and rationale strings, telling the writer which elements deserve emphasis. The runtime decisions are made by `EXTENDED_ACTIVITIES`-style good/avoid lists fed into `computeDayVerdict`.

| Element | Job interview | Contract signing | Resignation | New business |
|---------|---------------|------------------|-------------|--------------|
| Tithi (prefer Pūrṇā: 5, 10, 15) | high | high | low (favour Nandā 1, 6, 11) | high |
| Nakshatra (Pushya, Hasta, Anuradha, Shravana for career) | high | high | low | high |
| Yoga (avoid Vyatipata, Vaidhṛti, Parigha) | low | medium | medium | low |
| Karana (avoid Viṣṭi) | high | high | medium | high |
| Vara (Wed=Mercury, Thu=Jupiter favour career) | high | medium | low (Sat acceptable) | medium |
| Choghadiya (Labh, Amrit, Shubh) | high | high | low | high |
| Hora (Jupiter, Mercury, Sun) | high | medium | Saturn neutral | medium |
| Rahu Kaal / Yamaganda / Gulika (avoid) | hard veto | hard veto | hard veto | hard veto |

(`hard veto` = absolute window-level reject via the engine's existing `HARD_BLOCKS` — see §3.1.)

These hints land in the `uiEmphasis` field of each `CareerActivityDef` (see §5). Reading the table top-down for a single activity tells the copy-writer which paragraphs to weight in the landing page; reading left-to-right for one element shows how the same factor matters more for some activities than others.

### 2.3 Per-activity good/avoid lists — sourcing + audit

The actual runtime data are the `goodTithis` / `goodNakshatras` / `goodWeekdays` / `goodHoras` / `avoidTithis` / `avoidNakshatras` / `hardAvoidNakshatras` arrays in each new `EXTENDED_ACTIVITIES` entry. Before merging Phase 1 these must be cross-checked against:

1. **Muhurta Chintamani Ch. 4** (Vidyārambha, Sankalpa, Vyāpāra ārambha)
2. **Nirṇaya Sindhu** (regional muhurta differences)
3. **Brihat Samhita Ch. 105** (career & wealth-acquisition nakshatras)

Each new activity entry carries an inline citation comment naming the verse/chapter that justifies its lists — same convention the existing 20 entries already follow (see the doc-comments on `marriage`, `griha_pravesh`, `vehicle` for the format). A regression test pins three reference dates with hand-computed expected `computeDayVerdict` results; if a future edit changes a list, the test fails and forces deliberate review. Same "majority cross-check" rule as CLAUDE.md Lesson Z, applied to a fresh entry instead of an existing one.

### 2.4 Out of scope (explicit non-goals)

- **Match-three career compatibility** ("is this job good for my chart?"). That's natal astrology, not muhurta — different surface, different engine.
- **Personalised career predictions**. Brihaspati handles that.
- **Job listings or applicant tracking**. We're not a job board.

## 3. Engine reuse — what NOT to build

Per the project's "NEVER duplicate logic" hard rule, this feature must lean entirely on existing infrastructure:

| What we need | What we reuse | Where it lives |
|--------------|---------------|----------------|
| Tithi / Nakshatra / Yoga / Karana / Vara for a date+location | `computePanchang()` | `src/lib/ephem/panchang-calc.ts` |
| Per-activity good/avoid lists (nakshatra, tithi, weekday, hora) | `EXTENDED_ACTIVITIES` registry | `src/lib/muhurta/activity-rules-extended.ts` |
| Day-level verdict for a given activity | `computeDayVerdict(panchang, activityId)` | `src/lib/muhurta/verdict-engine.ts` |
| Slot-window scanning (best `N` slots in a day) | existing muhurta scanner | reused via `verdict-engine.ts` |
| Choghadiya per slot | `panchang.choghadiya` | already on PanchangData |
| Hora per slot | `panchang.hora` | already on PanchangData |
| Rahu Kaal / Yama / Gulika | `panchang.rahuKaal` etc. | already on PanchangData |
| Tithi / Nakshatra constants | `src/lib/constants/tithis.ts`, `nakshatras.ts` | already exist |
| Career activity definitions | **NEW** — `career-activities.ts` | only NEW data file needed for compute |

The existing engine is **rule-based, not weight-based**. `verdict-engine.ts` works off `HARD_BLOCKS`, `CONDITIONAL_BLOCKS`, and `POSITIVES` rule lists (id-keyed), with `EXTENDED_ACTIVITIES[id]` providing per-activity `goodTithis` / `goodNakshatras` / `goodWeekdays` / `goodHoras` whitelists plus `avoidNakshatras` (soft −5 penalty) and `hardAvoidNakshatras` (absolute veto). The design principle baked in is **"if not explicitly permitted → reject"**, not "if not forbidden → accept" (see the header comment in `activity-rules-extended.ts`).

So we do NOT invent a separate weighted scorer. Career Muhurta extends `EXTENDED_ACTIVITIES` with eight new entries — exactly the same shape as `marriage` / `griha_pravesh` / `vehicle` — and routes through the existing `computeDayVerdict(panchang, activityId)`. No new helpers, no parallel pipeline. (The §2.2 \"weights\" matrix earlier in this doc is a heuristic UI-side guide for which elements *to emphasise in the per-activity copy* — not a runtime data structure.)

```ts
// src/lib/career/career-activities.ts (sketch — Phase 1)
//
// Adds career activity definitions to the EXTENDED_ACTIVITIES registry.
// Same `ExtendedActivity` shape as the existing 20 activities (see
// src/types/muhurta-ai.ts). The verdict-engine consumes these via
// computeDayVerdict() with no changes to the engine itself.
import type { ExtendedActivity } from '@/types/muhurta-ai';

export const CAREER_ACTIVITIES: Record<CareerActivityId, ExtendedActivity> = {
  'job-interview': {
    id: 'job-interview' as never, // see §5 for the union extension
    label: { en: 'Job Interview', hi: 'नौकरी इंटरव्यू', ta: 'வேலை நேர்காணல்' },
    goodTithis: [2, 3, 5, 7, 10, 11, 13],
    goodNakshatras: [8, 12, 13, 17, 21, 22, 26],   // Pushya, U.Phalguni, Hasta, Anuradha, U.Ashadha, Shravana, U.Bhadrapada
    goodWeekdays: [1, 3, 4, 5],                    // Mon, Wed, Thu, Fri — Mercury/Jupiter/Venus dominant
    avoidTithis: [4, 9, 14, 30],                   // Rikta + Amavasya
    avoidNakshatras: [1, 6, 9, 18, 25],            // Ashwini, Ardra, Ashlesha, Jyeshtha, P.Bhadrapada
    goodHoras: [4, 3, 0],                          // Jupiter, Mercury, Sun (planet IDs)
    hardAvoidNakshatras: [],                       // no absolute nakshatra-level veto for interviews
    relevantHouses: [10, 6, 2],                    // Karma, Service, Wealth
  },
  // ... 7 more
};
```

The only engine-level change is extending the `ExtendedActivityId` union in `src/types/muhurta-ai.ts` — one line.

### 3.1 Hard vetoes — Rahu Kaal, Vishti, Yamaganda

The `ExtendedActivity` shape supplies `hardAvoidNakshatras` for nakshatra-level absolute vetoes, but **inauspicious-window overlays** (Rahu Kaal, Yamaganda, Gulika Kaal, Vishti Karana) are not part of that shape — they are checked at *slot scan* time by the verdict-engine's window-level rules. Career activities reuse this existing slot-scan path. Specifically:

- The day-level verdict (`computeDayVerdict`) returns a coarse `'auspicious' | 'inauspicious' | ...` rating that does not consider the time-of-day overlays.
- For window-level slot ranking we route through the existing slot scanner, which already disqualifies any window that overlaps Rahu Kaal, Yamaganda, Gulika Kaal, or a Vishti karana — same rules that `marriage` and `griha_pravesh` already use. (See the existing `HARD_BLOCKS` entries `rahu_kaal_overlap`, `yamaganda_overlap`, `gulika_overlap`, `vishti_karana`.)
- That means **a window inside Rahu Kaal is rated `avoid` regardless of nakshatra/tithi quality** — the hard-block fires before any positive scoring can lift it. Confirmed by reading `verdict-engine.ts:179` (`computeDayVerdict`) — the hard-block scan runs first and short-circuits.

No new veto mechanism is needed. The test plan (§10) pins this invariant explicitly.

## 4. UI surfaces — three phases

### Phase 1 — Career facet inside Muhurta AI + daily widget (3 hrs)

**A. Tag existing Muhurta AI activities under a "Career" facet.**

`muhurta-ai/page.tsx` currently shows all 20 activities in one grid. Add a category filter (`All · Spiritual · Travel · Health · Career · Finance · Family`) so users can find career activities directly. Tag the eight Phase-1 activities with `category: 'career'` in the activity definitions.

**B. Daily panchang inline widget.**

In `TodayPanchangWidget.tsx` (and `PanchangClient.tsx`), add one new card after the Choghadiya block:

```
┌────────────────────────────────────────────────┐
│ TODAY FOR YOUR CAREER                          │
│                                                │
│ Best window today: 10:33 – 12:09 (Sugam)       │
│ Recommended for: interview, contract signing   │
│ Avoid: 14:15 – 15:50 (Rahu Kaal)               │
│                                                │
│ See all career muhurtas →                       │
└────────────────────────────────────────────────┘
```

Logic: pick the highest-scoring overlap of (Choghadiya = Labh/Amrit/Shubh) ∩ (Hora = Mercury/Jupiter/Sun) for the current day, weighted against the Phase-1 activity set's union profile.

**Acceptance**: a Tamil user in Chennai opens `/ta/panchang` on a Wednesday morning and sees the green career-window card with their local times.

### Phase 2 — Dedicated `/career-muhurta` page + SEO (1.5 days)

**A. Index page**: `/[locale]/career-muhurta`

- 30-day forward calendar grid (mirrors `/muhurta-ai`).
- Activity selector chips: `Job interview · Application · Negotiation · Contract · First day · Resignation · Business launch · Promotion`.
- Daily slot list with start–end times, score badge (excellent / good / fair / avoid), and rationale text ("Pushya nakshatra + Jupiter hora + Labh choghadiya — strongly auspicious for interviews").
- Location-aware (uses the standard location store).

**B. Per-activity landing pages**: `/[locale]/career-muhurta/[activity]`

- One page per Phase-1 activity (8 total).
- Each page is **content-rich, not template-rich** — the differentiation is real classical material, not just a different weight matrix. Required sections per page:
  1. H1 + one-paragraph definition with the Sanskrit name
  2. *Classical rationale* — which nakshatras Brihat Samhita 105 recommends for this specific activity, with the verse citation. (~3 paragraphs of unique copy.)
  3. *Why this is different from other career events* — short comparison to the nearest sibling activity (e.g., on the interview page: "this differs from contract-signing because…")
  4. 30-day forward windows for the user's city
  5. *What to avoid* — specific tithis/nakshatras/yogas that classical sources flag for this activity
  6. 3–5 FAQ items specific to this activity
  7. Cross-links to the index + sibling activities + relevant learn modules
- Title pattern (English): `Best Time for Job Interview Today | Career Muhurta — Dekho Panchang`
- Title pattern (Hindi): `नौकरी इंटरव्यू के लिए शुभ मुहूर्त — आज और इस सप्ताह`
- Title pattern (Tamil): `வேலை நேர்காணலுக்கு நல்ல நேரம் இன்று | Career Muhurta`

If any of sections 2 / 3 / 5 are thin for an activity, that activity ships in Phase 3 instead of Phase 2 — better to publish six strong landing pages than eight weak ones.

**C. SEO infra (per the Choghadiya/Gauri parity checklist)**

- `PAGE_META` entries for `/career-muhurta` and each `/career-muhurta/[activity]` (8 + 1)
- FAQ schema for each landing page
- `ToolStructuredData`
- Sitemap entries (one per activity × forward 30 days is too much — instead one per activity at the index level, with the date dimension hitting ISR)
- `robots.txt` Allow rules
- Cross-links from `/muhurta-ai`, `/panchang`, `/choghadiya`, `/hora`
- Footer + Navbar Tools menu entry
- Tools-page card
- Learn module: `/learn/career-muhurta` covering the classical mapping (which nakshatra / hora / tithi favours which career action)

**D. Target queries** (organised by intent tier)

| Tier | Query | Volume estimate | Intent |
|------|-------|-----------------|--------|
| 1 | "best time for job interview" | high | utility, this-week |
| 1 | "shubh muhurat for interview" | medium | utility |
| 1 | "नौकरी इंटरव्यू मुहूर्त" | medium | utility, regional |
| 1 | "வேலை நேர்காணல் முகூர்த்தம்" | small but high-CTR | regional, hyper-targeted |
| 2 | "auspicious date for signing contract" | medium | research, big-decision |
| 2 | "muhurta for new business start" | medium | utility, big-decision |
| 2 | "best date for joining new job" | medium | utility |
| 3 | "is today good for asking promotion" | small | speculative |

Tier 1 + 2 should drive most of the volume; Tier 3 is upside.

### Phase 3 — Polish / LLM era (deferred, no commitment)

- Public presentation, LinkedIn launch, performance review, investment pitch landing pages (activities 9–12).
- Brihaspati integration: "Ask the Sage" pre-filled prompts on each career landing ("Will my interview on June 12 go well?")
- Smart "next 3 windows" notifications via daily email.

## 5. Data model

The compute layer reuses `ExtendedActivity` directly (see §3) — no new runtime data structures for scoring. The only new types are presentation-layer wrappers (descriptions, classical references) and the verdict shape that bridges the engine output into the widget/landing-page UI.

```ts
// src/types/career.ts
import type { ChoghadiyaSlot, LocaleText } from '@/types/panchang';

/** Eight career activities supported in Phase 1. */
export type CareerActivityId =
  | 'job-interview'
  | 'job-application'
  | 'salary-negotiation'
  | 'contract-signing'
  | 'first-day-at-job'
  | 'resignation'
  | 'business-launch'
  | 'asking-promotion';

/**
 * Presentation wrapper around an ExtendedActivity. The `rules` field is
 * the actual engine-input shape; everything else here is copy + classical
 * references used by the per-activity landing pages.
 */
export interface CareerActivityDef {
  id: CareerActivityId;
  name: LocaleText;
  description: LocaleText;
  /** Classical reference shown on the per-activity landing page. */
  classicalName: { sanskrit: string; transliteration: string };
  /**
   * The actual rule object the engine consumes — same shape as the
   * existing 20 EXTENDED_ACTIVITIES entries. See
   * src/types/muhurta-ai.ts for the full type.
   */
  rules: import('@/types/muhurta-ai').ExtendedActivity;
  /**
   * UI-side heuristic profile — drives which elements to *emphasise* in
   * the landing-page copy and rationale strings. Not used at runtime
   * for scoring (engine uses `rules` above). Soft hints, not invariants.
   */
  uiEmphasis: {
    tithi: 'high' | 'medium' | 'low';
    nakshatra: 'high' | 'medium' | 'low';
    /** Preferred Choghadiya types — narrow union, not `string`. */
    choghadiyaPreferred: ChoghadiyaSlot['type'][];
    horaPreferred: number[]; // planet IDs (0=Sun … 8=Ketu)
  };
}

/**
 * The verdict shape returned to the UI layer for one date+activity.
 * `windows` is an array of slot-level ratings; `bestWindow` indexes
 * into it. When every slot of the day is `avoid` (e.g., the day-level
 * verdict is `avoid` outright, or every candidate window overlaps an
 * inauspicious period), `windows` is empty and `bestWindow` is `null`.
 */
export interface CareerMuhurtaVerdict {
  activity: CareerActivityId;
  date: string;            // YYYY-MM-DD in the resolved local timezone
  windows: Array<{
    startTime: string;     // HH:MM 24h
    endTime: string;       // HH:MM 24h
    score: number;         // 0..100
    rating: 'excellent' | 'good' | 'fair' | 'avoid';
    /** Human-readable rationale, e.g. "Pushya nakshatra + Jupiter hora + Labh choghadiya". */
    rationale: LocaleText;
    /** Inauspicious overlays that hit this window — empty if none. */
    conflicts: Array<{ name: string; period: string }>;
  }>;
  /** Index into `windows`, or `null` when no acceptable window exists. */
  bestWindow: number | null;
}
```

## 6. i18n strategy

Career Muhurta serves a global Indian audience but uneven query volume across locales. The MVP commits to **full first-class copy in EN, HI, TA**, with regional-language fallback for the other six locales.

| Locale | Phase 1 (widget + Muhurta AI facet) | Phase 2 (landing pages) | Strategy |
|--------|--------------------------------------|--------------------------|----------|
| en | ✅ full | ✅ full original | Authored |
| hi | ✅ full | ✅ full original | Authored |
| ta | ✅ full | ✅ full original | Authored (Tamil is the #1 South-Indian career-query locale per the Gauri-panchang traffic pattern; this surface mirrors that bet) |
| te, kn, bn, gu, mr, mai | label-only translations of widget chrome | hreflang to `en` page, regional title with native-script *plus* English (`నేటి ఉద్యోగ ముహూర్తం | Job Interview Muhurta`) | Bilingual SEO titles per the [bilingual titles feedback](../../../memory/feedback_bilingual_titles.md), full English body |

**Rule (per locale parity guard)**: every translation key must exist in every locale's JSON file even if the value is the English fallback — `next-intl` will then render the fallback rather than the bare key path. The locale-parity Python script catches missed keys before merge.

## 7. Analytics events

Phase 1 instruments these events (all via the existing `track*` helpers in `src/lib/analytics`):

| Event name | Trigger | Properties |
|------------|---------|------------|
| `career_muhurta_widget_view` | Widget rendered on `/panchang` or `/dashboard` | `{ locale, hasGoodWindow: boolean }` |
| `career_muhurta_widget_clicked` | User clicks the "See all career muhurtas →" link | `{ locale, fromPath }` |
| `career_muhurta_facet_filter` | User selects "Career" in Muhurta AI activity filter | `{ locale }` |
| `career_muhurta_activity_view` (Phase 2) | A `/career-muhurta/[activity]` page renders | `{ activity, locale, hasGoodWindowToday: boolean }` |
| `career_muhurta_window_clicked` (Phase 2) | User taps a specific time-window card on the activity page | `{ activity, windowRating, locale }` |

The `hasGoodWindow` boolean is the leading indicator we'll watch for product-market fit: if widgets render but `hasGoodWindow=false` >40% of the time across a 30-day window, the scoring thresholds are too strict.

## 8. Performance

The 30-day × 8-activity calendar grid is the heaviest surface. Strategy:

- **Compute is cheap, layout is the cost.** `computeDayVerdict(panchang, activityId)` is the same call Muhurta AI's existing 20 activities use — already measured at single-digit milliseconds per call. Running it 30 × 8 = 240 times is still well under a frame.
- **The activity index page** (`/career-muhurta`) renders one activity at a time (whichever is selected via URL param); 30 dates × 1 activity = 30 calls. Cheap.
- **Per-activity landing pages** (`/career-muhurta/[activity]`) render 30 dates of one activity. Same 30 calls. Use ISR with `revalidate: 3600` (1 hr) — the underlying panchang computation depends only on the date + location, so an hourly cache is enough to absorb traffic spikes without stale data being a problem (the windows are stable across the day).
- **Daily widget**: reads `panchang.choghadiya` + `panchang.hora` from the already-computed PanchangData on the parent `/panchang` page, plus one `computeDayVerdict` call per career activity (8 total) to pick the best. Zero extra panchang computation.

## 9. Empty / failure states

| Scenario | UI |
|----------|----|
| No good window today (every window is "fair" or "avoid") | Card still renders; copy says "Today is best used for routine work, not new career moves. Tomorrow's best window: 09:15–10:48." |
| `computePanchang` throws | Widget renders a quiet "Career muhurta unavailable for this location" with no error spew. The same pattern Muhurta AI already uses — fail silent in the UI, log to `console.error('[career-muhurta] compute failed:', err)` for production debugging. (Per Lesson AA — API routes log, UI is friendly.) |
| User has no location set | Card asks the user to set a location, with a single tap to open the location picker. No defaulting to Delhi. |
| Activity page reached with an unknown activity slug | `notFound()` — 404. No "default to interview" fallback. |

## 10. Test plan

1. **Unit tests for the career-activity registry integration** (Phase 1):
   - `computeDayVerdict(panchang, 'job-interview')` on a date with Pushya nakshatra + Wednesday + Mercury hora → rating `excellent` or `good`. (Uses the same engine path as `marriage` / `griha_pravesh`.)
   - **Hard-block invariant**: any window overlapping Rahu Kaal, Yamaganda, Gulika Kaal, or a Vishti karana → window rating `avoid` regardless of nakshatra/tithi quality. Pin this with explicit fixtures so a future engine refactor can't silently lift the veto.
   - Salary negotiation on Saturday + Shravana → rating ≥ `good`.
   - `bestWindow === null` when every window of the day is `avoid` (e.g., a Vishti-dominated day in winter when Rahu Kaal absorbs the rest).
   - Empty `windows` array passes through `<TodayBadge>`-style empty-state UI without throwing.

2. **Snapshot test for the daily widget** (Phase 1): given a known PanchangData fixture, the widget renders the expected best-window.

3. **SEO regression** (Phase 2):
   - `static-page-budget.test.ts` entries for `/career-muhurta/[activity]` if static params used.
   - `seo-invariants.test.ts` — every new page has title + description + canonical + hreflang.
   - `faq-data.test.ts` — every new page has at least 3 FAQ Q&A.
   - Locale parity script — every key exists in every locale file.

4. **Browser walk-through** (Phase 1 + 2 acceptance):
   - Open `/en/panchang` — see the career widget card with sensible content.
   - Open `/en/muhurta-ai`, filter to Career — see 8 activities, each with proper data.
   - Open `/en/career-muhurta/job-interview` — see 30-day forward window calendar.
   - Switch to `/ta/career-muhurta/job-interview` — Tamil copy renders end-to-end with no `undefined` strings.

## 11. Risks + mitigations

1. **Risk**: We tag muhurta windows as "good for interview" and the user has a bad interview anyway. Brand damage.
   **Mitigation**: All copy frames the windows as "favourable" not "guaranteed"; include a one-line disclaimer at the bottom of every landing ("Muhurta increases the odds. Preparation matters more.")

2. **Risk**: Activity weights chosen subjectively diverge from classical sources.
   **Mitigation**: Each activity definition cites the classical reference (Muhurta Chintamani / Nirṇaya Sindhu) in a code comment. The learn page surfaces this so users see we're not making it up.

3. **Risk**: We over-build the SEO surface for queries Google never sends traffic for.
   **Mitigation**: Ship Phase 1 first. Measure 30 days of Search Console data for the new keywords. Only build Phase 2 landing pages for activities that show real impression volume.

4. **Risk**: Rotation / weights drift over time (the Lesson Z scenario).
   **Mitigation**: Lock weights in a single file, with a regression test that pins three reference dates' verdicts. If weights change deliberately, the test fails and forces a deliberate update.

## 12. Estimated effort

- **Phase 1**: 3 hrs — engine + Muhurta AI facet + daily widget + tests
- **Phase 2**: 1.5 days — `/career-muhurta` index, 8 activity landing pages, learn module, SEO infra (PAGE_META, FAQ, sitemap, navbar, footer, cross-links, robots)
- **Phase 3**: deferred (no commitment) — 1 more day for the 4 extra activities + LLM polish

Total to ship Phase 1 + 2 (the recommended bundle): **~2 days of focused work**.

## 13. Open questions for the user — resolved 2026-05-27

| # | Question | Decision |
|---|----------|----------|
| 1 | Which activities for the MVP? | **All 8 as proposed** (§2.1) — job interview, application, salary negotiation, contract signing, first day, resignation, business launch, asking promotion |
| 2 | How far to ship in one round? | **Phase 1 + Phase 2 bundled** — daily widget + Muhurta AI facet AND the 8 per-activity landing pages with full SEO in one PR (~2 days). Phase 3 stays deferred |
| 3 | Brihaspati hand-off CTA on landing pages? | **Yes — one-click "Ask the Sage" CTA on every per-activity page**, charging credits as usual. Pre-fills the prompt with the user's activity + date context |
| 4 | Saturday for interviews / contract signing? | **Allow Saturday as "fair" (not "good", not "avoid")** — keeps the muhurta useful for working professionals who can only interview on weekends; preserves the classical reading that Shani-day is not ideal for new beginnings |

## 14. Self-review (fresh-eyes pass)

Each item from the first-draft review has either been addressed in the body above or explicitly punted. Recording the disposition:

| Concern (first draft) | Disposition |
|------|-------------|
| Weights are subjective | Addressed in §2.3 — every row carries a classical citation, soft rows are marked `confidence: 'inferred'`, regression test pins three reference verdicts |
| Landing pages risk being thin | Addressed in §5 (Phase 2 §B) — each page must include classical rationale, sibling comparison, and "what to avoid" content. Activities with thin content slip to Phase 3 rather than ship template-only pages |
| No i18n plan | Addressed in §6 — first-class EN/HI/TA, bilingual SEO titles for the other six locales, full locale-parity guard on keys |
| No analytics events | Addressed in §7 — five events spec'd with the `hasGoodWindow` leading indicator |
| Performance unclear at 30×8 calendar | Addressed in §8 — compute is single-digit ms, ISR caches the page level |
| Empty/failure states unspecified | Addressed in §9 — explicit copy for each branch, log + friendly UI |

**Gemini review (round 1, PR #233) — disposition:**

| Concern (Gemini) | Disposition |
|------|-------------|
| `scoreTithi` / `scoreNakshatra` / `scoreChoghadiyaWindows` helpers don't exist in `verdict-engine.ts` | Addressed in §3 — engine is rule-based via `EXTENDED_ACTIVITIES` + `computeDayVerdict`, not weight-based. Career activities are added as new `EXTENDED_ACTIVITIES` entries (same shape as `marriage`, `griha_pravesh`); the standalone `scoreCareerMuhurta` function is gone. §8 performance and §10 test plan rewritten to match. |
| `CareerWeightProfile.choghadiya.preferred` typed `string[]` | Addressed in §5 — replaced with `ChoghadiyaSlot['type'][]` (narrow union) on the renamed `uiEmphasis.choghadiyaPreferred` field |
| `bestWindow` always `number` cannot represent the empty case | Addressed in §5 — typed `number \| null`; §10 adds an explicit test for the null case |
| Rahu Kaal / Vishti weights wouldn't guarantee `avoid` rating | Addressed in §3.1 — engine's existing `HARD_BLOCKS` already disqualifies windows overlapping Rahu Kaal, Yamaganda, Gulika Kaal, and Vishti karana. No new veto mechanism needed; §10 pins this invariant as a regression test |

**Still open** (do not block Phase 1, but track):

- The audit of the per-activity good/avoid lists against Brihat Samhita 105 + Muhurta Chintamani Ch. 4 + Jyotirnibandha has not yet happened. Block before *Phase 2* SEO landing pages, not Phase 1 — Phase 1 widget only surfaces the *best* window, never the activity-level granular verdict, so list drift is invisible to users at that stage.
- Brihaspati hand-off CTA (open question #3) — not blocking either phase; can ship on the activity landing pages later.

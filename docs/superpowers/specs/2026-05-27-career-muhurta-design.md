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

### 2.2 What "good time" means for each

Every career activity is scored against the same five panchang elements + Choghadiya + Hora — but with **different weight matrices**. The same rules used by `verdict-engine.ts` for Muhurta AI, just with a career-specific profile per activity.

| Element | Job interview | Contract signing | Resignation | New business |
|---------|---------------|------------------|-------------|--------------|
| Tithi (prefer Pūrṇā: 5, 10, 15) | ★★★★ | ★★★★★ | ★★ (favour Nandā 1, 6, 11) | ★★★★★ |
| Nakshatra (Pushya, Hasta, Anuradha, Shravana for career) | ★★★★★ | ★★★★ | ★★ | ★★★★★ |
| Yoga (avoid Vyatipata, Vaidhṛti, Parigha) | ★★ | ★★★ | ★★★ | ★★ |
| Karana (avoid Viṣṭi) | ★★★★ | ★★★★★ | ★★★ | ★★★★★ |
| Vara (Wed=Mercury, Thu=Jupiter favour career) | ★★★★★ | ★★★ | ★ (Sat acceptable) | ★★★ |
| Choghadiya (Labh, Amrit, Shubh) | ★★★★ | ★★★★★ | ★★ | ★★★★★ |
| Hora (Jupiter, Mercury, Sun) | ★★★★★ | ★★★ | Saturn neutral | ★★★ |
| Rahu Kaal / Yamaganda / Gulika (avoid) | ★★★★★ | ★★★★★ | ★★★★ | ★★★★★ |

(Five stars = high weight, one star = barely matters.)

The full matrix lives in `src/lib/career/career-activity-weights.ts` (Phase 1). Each row is a single object literal so it's trivial to audit and tweak.

### 2.3 Activity weights — sourcing + audit process

The matrix in §2.2 is the *starting* allocation, not the final word. Before merging Phase 1 the matrix must be cross-checked against:

1. **Muhurta Chintamani Ch. 4** (Vidyārambha, Sankalpa, Vyāpāra ārambha)
2. **Nirṇaya Sindhu** (regional muhurta differences)
3. **Brihat Samhita Ch. 105** (career & wealth-acquisition nakshatras)

Each row in `CAREER_ACTIVITY_WEIGHTS` carries an inline citation comment naming the verse/chapter that justifies it — same convention the existing dosha tables use. The rotation regression test pins three reference dates with hand-computed expected verdicts; if a future audit changes a weight, the test fails and forces a deliberate review. This is the same "majority cross-check" rule from CLAUDE.md Lesson Z applied to a fresh table instead of an existing one.

If no classical source clearly mandates a value, mark the row `confidence: 'inferred'` so future me / a reviewer can find the soft spots.

### 2.4 Out of scope (explicit non-goals)

- **Match-three career compatibility** ("is this job good for my chart?"). That's natal astrology, not muhurta — different surface, different engine.
- **Personalised career predictions**. Brihaspati handles that.
- **Job listings or applicant tracking**. We're not a job board.

## 3. Engine reuse — what NOT to build

Per the project's "NEVER duplicate logic" hard rule, this feature must lean entirely on existing infrastructure:

| What we need | What we reuse | Where it lives |
|--------------|---------------|----------------|
| Tithi / Nakshatra / Yoga / Karana / Vara for a date+location | `computePanchang()` | `src/lib/ephem/panchang-calc.ts` |
| Auspicious-window detection | `verdict-engine.ts` | `src/lib/muhurta/verdict-engine.ts` |
| Choghadiya per slot | `panchang.choghadiya` | already on PanchangData |
| Hora per slot | `panchang.hora` | already on PanchangData |
| Rahu Kaal / Yama / Gulika | `panchang.rahuKaal` etc. | already on PanchangData |
| Tithi/Nakshatra preference data | `src/lib/constants/tithis.ts`, `nakshatras.ts` | already exist |
| Activity weights matrix | NEW — `career-activity-weights.ts` | only NEW file needed for compute |

The only **new** compute artefact is the weights matrix. The scoring function itself is a 30-line composition of existing primitives.

```ts
// src/lib/career/score-career-muhurta.ts (sketch — Phase 1)
export function scoreCareerMuhurta(
  activity: CareerActivity,
  panchang: PanchangData,
  // Optional: limit to a sub-window of the day
  windowStart?: string, windowEnd?: string,
): CareerMuhurtaVerdict {
  const weights = CAREER_ACTIVITY_WEIGHTS[activity];
  const tithiScore   = scoreTithi(panchang.tithi, weights.tithi);
  const nakScore     = scoreNakshatra(panchang.nakshatra, weights.nakshatra);
  const choghaScore  = scoreChoghadiyaWindows(panchang.choghadiya, weights.choghadiya);
  // ... etc — each helper already exists in verdict-engine.ts
  return composeVerdict([tithiScore, nakScore, choghaScore, ...]);
}
```

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

```ts
// src/types/career.ts
export type CareerActivity =
  | 'job-interview'
  | 'job-application'
  | 'salary-negotiation'
  | 'contract-signing'
  | 'first-day-at-job'
  | 'resignation'
  | 'business-launch'
  | 'asking-promotion';

export interface CareerActivityDef {
  id: CareerActivity;
  name: LocaleText;
  description: LocaleText;
  // Classical reference for SEO and learn module
  classicalName: { sanskrit: string; transliteration: string };
  // Weight profile — feeds scoreCareerMuhurta
  weights: CareerWeightProfile;
}

export interface CareerWeightProfile {
  tithi: { preferred: number[]; avoid: number[]; weight: number };
  nakshatra: { preferred: number[]; avoid: number[]; weight: number };
  yoga: { avoid: number[]; weight: number };  // 1-indexed yoga numbers
  karana: { avoidVishti: boolean; weight: number };
  vara: { preferred: number[]; weight: number };  // 0=Sun..6=Sat
  choghadiya: { preferred: string[]; weight: number };  // ['amrit','shubh','labh']
  hora: { preferred: number[]; weight: number };  // planet IDs
  inauspiciousOverlay: { rahuKaal: boolean; yamaganda: boolean; gulika: boolean; weight: number };
}

export interface CareerMuhurtaVerdict {
  activity: CareerActivity;
  date: string;
  windows: Array<{
    startTime: string;
    endTime: string;
    score: number;          // 0..100
    rating: 'excellent' | 'good' | 'fair' | 'avoid';
    rationale: LocaleText;  // "Pushya nakshatra + Jupiter hora + Labh choghadiya"
    conflicts: Array<{ name: string; period: string }>;  // overlay warnings
  }>;
  bestWindow: number;       // index into windows[]
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

- **Compute is cheap, layout is the cost.** `scoreCareerMuhurta` is O(slots) for one date — running it 30 × 8 = 240 times is single-digit milliseconds. No caching needed at the function level.
- **The activity index page** (`/career-muhurta`) renders one activity at a time (whichever is selected via URL param); 30 dates × 1 activity = 30 calls. Cheap.
- **Per-activity landing pages** (`/career-muhurta/[activity]`) render 30 dates of one activity. Same 30 calls. Use ISR with `revalidate: 3600` (1 hr) — the underlying panchang computation depends only on the date + location, so an hourly cache is enough to absorb traffic spikes without stale data being a problem (the windows are stable across the day).
- **Daily widget**: computed at SSR for the user's location. The panchang data is already being computed for the parent `/panchang` page; we just read `panchang.choghadiya` + `panchang.hora` + the weights matrix. Zero extra cost.

## 9. Empty / failure states

| Scenario | UI |
|----------|----|
| No good window today (every window is "fair" or "avoid") | Card still renders; copy says "Today is best used for routine work, not new career moves. Tomorrow's best window: 09:15–10:48." |
| `computePanchang` throws | Widget renders a quiet "Career muhurta unavailable for this location" with no error spew. The same pattern Muhurta AI already uses — fail silent in the UI, log to `console.error('[career-muhurta] compute failed:', err)` for production debugging. (Per Lesson AA — API routes log, UI is friendly.) |
| User has no location set | Card asks the user to set a location, with a single tap to open the location picker. No defaulting to Delhi. |
| Activity page reached with an unknown activity slug | `notFound()` — 404. No "default to interview" fallback. |

## 10. Test plan

1. **Unit tests for `scoreCareerMuhurta`** (Phase 1):
   - For Job-Interview activity on a date with Pushya nakshatra + Wednesday + Mercury hora → score ≥ 80.
   - Same activity during Rahu Kaal → "avoid" rating regardless of other factors.
   - Vishti karana on a contract-signing day → "avoid".
   - Salary negotiation on Saturday + Shravana → ≥ 70.

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

## 13. Open questions for the user

1. **Which 8 activities?** The MVP set above is my best guess. Confirm or swap any.
2. **Phase 2 dedicated pages or skip straight to Phase 1 only?** Phase 1 is genuinely useful on its own; Phase 2 is for SEO acquisition.
3. **Brihaspati hand-off?** Should each career landing page have a one-click "Ask the Sage about your specific situation" CTA, charging credits as usual?
4. **Stricter rule against Saturday for interviews?** Some traditions reject Saturdays absolutely. Current weights treat it as "fair" not "avoid". User preference?

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

**Still open** (do not block Phase 1, but track):

- The audit of the weights matrix against Brihat Samhita 105 + Muhurta Chintamani Ch. 4 has not yet happened. Block before *Phase 2* SEO landing pages, not Phase 1 — Phase 1 widget only surfaces the *best* window, never the activity-level granular verdict, so weight drift is invisible to users at that stage.
- Brihaspati hand-off CTA (open question #3) — not blocking either phase; can ship on the activity landing pages later.

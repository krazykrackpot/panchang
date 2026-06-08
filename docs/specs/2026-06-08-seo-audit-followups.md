# SEO audit follow-ups — post recovery work (2026-06-08)

This doc is the **canonical tracker** for the SEO recovery effort.
It records:

1. The remediation work that's **already shipped** (Phase A, Phase B, city
   cut, date-content Passes 1-4, GSC cron expansion).
2. The **remaining follow-up items** identified in the 2026-06-08 deep audit,
   with severity, scope and the proposed fix.
3. The **priority order** in which they're being resolved.

Background: the May 31 / June 1 2026 algorithmic demotion (Google Helpful
Content / Core Update signals) collapsed impressions site-wide. Root-cause
analysis identified four duplicate-content vectors plus several quality
signals. The bulk of the recovery work is done; this doc captures what's
left.

---

## Already shipped

### Phase A — Maithili Hindi pass-through (PR #509)

Replaced ~5,200 string leaves across 238 JSON message files where the `mai`
locale value was a literal copy of `hi`. Translations via Gemini 2.5 Flash
with a Maithili-register prompt (-क genitive, -ओ conjunction, के लेल,
छी/अछि forms, अहांक).

Audit impact:

| Surface | Before | After |
|---|---:|---:|
| Namespace JSON `mai === hi` | 49.8% | 10.8% (−78%) |
| Top-level `mai.json` `mai === hi` | 51.3% | 20.0% (−61%) |
| Unique Maithili leaves | 2,428 | 10,581 (+4.4×) |

Tooling: `scripts/audit-mai-parity.mjs`, `scripts/translate-mai-from-en.py`.

### Phase B — Inline LABELS for 7 locales (PR #516)

Added `mai`/`mr`/`ta`/`te`/`bn`/`gu`/`kn` blocks to inline `LABELS` objects
in 28 TSX page components. Previously these locales fell through to
`LABELS.en` and rendered English chrome on top of Hindi data.

Impact: TSX files with `mai:` block went from 8 / 47 (17%) to 35 / 48 (73%).

Tooling: `scripts/translate-tsx-labels.mjs` (ts-morph + Gemini + prettier).

### City panchang cut — 177 → 44 cities (PR #497)

Reduced the indexable city set from ~177 cities to 44. Dropped slugs now
`noindex, follow`; sitemap no longer fans them out; `getNearbyCities` was
replaced with `getNearbyCitiesIndexable` so internal-link equity stays
within the keep-list.

Tooling: `scripts/audit-mai-parity.mjs` (also audits Surface 3 of cities).

### Date-content Pass 1 — tithi observance + next festival (PR #521)

Server-rendered "Today's Significance" section on `/choghadiya/[date]`,
`/panchang/date/[date]`, `/gauri-panchang/[date]`. Two stacked blocks:

1. Tithi-observance intro (~60-90 words; 30-way variance × 9 locales).
2. "Next major festival" callout with days-away phrasing.

Tooling: `scripts/generate-tithi-observances.py`.

### Date-content Pass 2 — Weekday character (PR #523)

Added a third block: weekday character paragraph (~70-100 words covering
ruling planet + general auspiciousness + one traditional observance per
weekday). 7-way variance × 9 locales.

Tooling: `scripts/generate-weekday-significance.py`.

### Date-content Pass 3 — Upcoming Festivals & Vrats list (PR #524)

Expanded the single next-festival line into a 5-entry bulleted list
(major + regional + eclipse + vrat) with categorical tags. New helper:
`getUpcomingFestivals(fromDate, lat, lng, timezone, { count, includeVrat })`.

### Date-content Pass 4 — Deeper tithi observance prose (PR #527)

Added a deeper paragraph (~110-160 words) per tithi covering: specific
DOS, specific DON'TS, traditional MANTRA (named), typical DĀNA (donation
practice). Renders below the Pass 1 intro inside the same tithi card.

Tooling: `scripts/generate-tithi-deeper-observance.py`.

### GSC indexing cron expansion (PR #529)

Cron URL pool grew from 40 → 117 URLs. Added `/gauri-panchang/<date>` as
a 3rd date route; added `ta`/`te`/`bn`/`gu`/`kn` at low weight so all 9
locales × 3 date routes × 7-day window participate in the daily
priority-crawl rotation. `mr` (40) and `mai` (30) stay top-of-queue.

---

## Remaining follow-up items

These are the 2026-06-08 deep-audit findings, by priority.

### #1 — 🔴 Vector 4: chrome density (sitewide)

**Severity**: HIGH — affects every template.

**Symptom**: `/festivals/diwali` vs `/festivals/holi` Jaccard ≈ 55%
despite completely different bodies, because page chrome (nav + footer
+ cross-sells + "learn concepts" + breadcrumbs + CTA banners) dominates
the literal-text ratio.

**Fix candidates**:

- Lighter chrome on long-tail templates (`learn/modules/*`,
  `learn/nakshatra-pada/*`, etc.) — fewer footer cross-sells, smaller
  "see also" block.
- Per-page chrome variation — rotate the "related learn concepts" block
  to a topical subset rather than a static list of 6.
- Slim breadcrumb / CTA real-estate on body-heavy pages.

**Status**: ✅ Resolved in PR _(updated when shipped)_.

### #2 — 🔴 City panchang body differentiation

**Severity**: HIGH — textbook "city-name-swap" pattern, recognisable
algorithmically.

**Symptom**: same date, Delhi vs Mumbai →
`tithi/nakshatra/yoga/karana` ALL identical; sun-times differ by
~30–90 min; daily article body identical character-for-character except
for the city name substitution.

**Fix candidates**:

- Per-city descriptor data: known temples, local festival traditions,
  regional fast/feast practices, climate-season notes (Chennai's
  sunrise interpretation differs from Srinagar's), pilgrimage hooks.
- Render this as a city-specific section above the daily article.
- For diaspora cities: NRI-specific observance notes (sunrise often
  in the local pre-dawn, festivals shift days, fast-window adjustments).

**Status**: Pending.

### #3 — 🟡 Nakshatra-pada profiles thin (56 words avg)

**Severity**: MEDIUM — 216 URLs at 56 words each; differentiation is
strong (3-8% Jaccard) but body length is below the practical
thin-content threshold (~150-200 words).

**Fix**: Gemini-expand each pada profile to ≥150 words. 108 entries ×
+100 words ≈ small Gemini job. Output merges into
`src/lib/constants/nakshatra-pada-profiles.ts`.

**Status**: Pending.

### #4 — 🟡 Daily horoscope page Jaccard via chrome

**Severity**: MEDIUM — engine output Jaccard 40% (good); rendered
page Jaccard estimated 60-75% once chrome is added.

**Fix**: Apply Pass 1-4 style `TodaySignificanceSection` to
`/horoscope/<rashi>/<date>` — currently absent. Tithi observance +
weekday character + festival proximity will move the per-page body
significantly off-template.

**Status**: Pending.

### #5 — 🟡 Festival year-variants borderline

**Severity**: MEDIUM — 900 URLs (20 festivals × 5 years × 9 locales).
Year-specific dynamic content (date, muhurat, 12-rashi readings) ≈ 35%
of body; static prose (history, mythology, significance, puja vidhi)
shared across years.

**Fix**: per-year historical / cultural callout ("In 2026 Diwali falls
on a Sunday — second time in this decade"), weekday-significance per
year (already partially differentiable from Pass 2 data), lunar
calendar notes per year. Or canonical the older years to a stable
"festival overview" page if user demand for year-pages is low.

**Status**: Pending.

### #6 — 🟡 E-E-A-T signals weak

**Severity**: MEDIUM — Helpful Content Update favours expertise and
authoritativeness signals.

**Symptoms**:

- No author bylines on prose-heavy pages.
- BPHS / Phaladeepika / Mantreshwara citations exist in the data
  (`PLANET_HOUSE_VERSES.source`) but are not surfaced in the rendered
  UI.
- `/about` is minimal — no founder bio, no methodology block, no
  sources/credits.
- No "translation reviewed by native speaker" markers (relevant given
  the volume of Gemini-translated content).

**Fix**:

- Surface the `.source` field in `PLANET_HOUSE_VERSES` (and parallel
  data files) as a small "Source" footer per page.
- Add a real author byline on `/learn/*`, `/festivals/*`, `/calendar/*`
  prose-heavy templates.
- Expand `/about` with founder bio + computation methodology +
  Sources block (BPHS / Surya Siddhanta / Meeus / etc.).

**Status**: Pending.

### #7 — 🟡 /horoscope/<rashi>/weekly + /monthly thin

**Severity**: UNKNOWN — needs sampling. Page files are 71 + 63 lines
(daily is 469), suggesting minimal rendered body.

**Fix**: First sample the rendered output. If thin, add weekly/monthly-
specific content blocks: predicted theme for the period (already in
the engine?), notable transits within the window, festivals falling
in the window.

**Status**: Pending.

### Out-of-scope flags (worth documenting but not on the immediate list)

- **AI-generated content disclosure**: optional footer line reframing
  AI translations as a scaffolding aid that gets native-speaker review.
  No clear evidence Google penalises this for our volume; nice-to-have.
- **Core Web Vitals**: `tithi-observances.json` is 729KB; combined
  date-content data could affect bundle / hydration cost. Lighthouse
  pass would tell.
- **Schema.org enrichment**: opportunity to add `HowTo` for puja vidhi
  pages (already partially there), `Event` for festival pages,
  `Article` with author + dateModified for prose pages.

---

## Resolution order

The remaining items will be shipped in this order (per the 2026-06-08
plan):

1. **Vector 4 — chrome density** (sitewide leverage) — task #53.
2. **City panchang differentiation** — task #60.
3. **Nakshatra-pada expansion** — task #61.
4. **Daily horoscope content** — task #62.
5. **Festival year-variants** — task #63.
6. **E-E-A-T plumbing** — task #64.
7. **Weekly/monthly horoscope** — task #65.

Each resolution lands as its own PR; this doc gets updated with the PR
reference and status when the item ships.

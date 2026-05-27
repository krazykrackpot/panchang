# SEO: Panchang + Kundali content expansion

**Status**: spec — open for review
**Author**: Aditya (with Claude)
**Date**: 2026-05-27
**Related**: prior sitemap pruning (2026-04-16), traffic baseline (May 2026)

---

## 1. Why this spec exists

GSC data (28 days ending 2026-05-27) shows two of our flagship surfaces are under-performing:

| Surface | Pages indexed | Impressions | Clicks | CTR | Avg position |
|---|---|---|---|---|---|
| Kundali (`/kundali*` family) | 19 | 131 | **0** | 0% | ~7 |
| Daily panchang (`/panchang*` excl. cities) | 827 | 9,006 | 99 | 1.10% | varies; root at **16.7** |
| Choghadiya (`/choghadiya/[date]`) | hundreds | tens of thousands | ~6k/mo | ~5% | 4–6 |
| Bengali calendar (`/calendar/regional/bengali`) | 1 | 9,506 | 148 | 1.56% | 7.8 |

Choghadiya wins because **the URL itself matches the long-tail query** (`27 may 2026 choghadiya`). Panchang and kundali have no such pattern: `/kundali` is an interactive tool with almost no indexable content, and `/panchang` is a generic landing page that loses to Drik/Prokerala on `aaj ka panchang` (we rank at position 68.7 with 0 clicks).

This spec covers three changes, ordered cheapest-to-most-expensive, each with a measurable CTR/clicks delta we can attribute.

---

## 2. Three changes

### 2.1 Title + meta description rewrites (cheapest)

**Why this is the highest ROI item**: we already have impressions on queries where we rank at position 11–20. Moving one rank via a better title is the only SEO lever that compounds without writing new content.

**Gold-mine queries** (28d, pos 11–20, impressions ≥ 50, mostly 0 clicks):

| Query | Imps | Pos | Clicks |
|---|---|---|---|
| `diwali puja 2026` | 877 | 11.7 | 1 |
| `hanuman jayanti 2027 date` | 552 | 11.4 | 0 |
| `diwali 2028 date` | 397 | 11.4 | 0 |
| `bengali calendar` | 363 | 11.3 | 10 |
| `hanuman jayanti 2026 date in telangana` | 357 | 12.1 | 0 |
| `dhanteras 2026` | 217 | 11.5 | 0 |
| `govardhan puja 2026` | 137 | 11.1 | 0 |
| `ganesh puja 2026` | 120 | 11.2 | 0 |
| `ganesh chaturthi 2026` | 100 | 16.5 | 1 |

Top six alone: ~2,700 impressions and 12 clicks. A title-only change typically lifts CTR 2-3× when you already rank on page 1–2.

**Concrete edits** (all in `src/lib/seo/metadata.ts` + a couple of `generateMetadata` functions):

| Route | Current title (EN) | Proposed title (EN) |
|---|---|---|
| `/kundali` | "Free Kundali — Vedic Birth Chart for Beginners & Experts" | "Free Janma Kundali Online — Vedic Birth Chart with Dasha, Yogas" |
| `/panchang` | "Today's Panchang — Tithi, Nakshatra, Rahu Kaal & Muhurta Times" | **Dynamic**: "Today's Panchang — {City}, {Date} — Tithi, Nakshatra, Rahu Kaal" (city resolved via Vercel geo header, same pattern as existing server-side panchang) |
| `/festivals/[slug]/[year]` | Generic | "{Festival} {Year} Date in {Country} — Puja Muhurat, Timings, Significance" |
| `/muhurta/[type]/[year]/[month]/[city]` | Generic | Add "{Date} muhurta", "shubh muhurat 2026" etc. into the templated title |

**HI mirror**: `/kundali` → "निःशुल्क जन्म कुण्डली ऑनलाइन — दशा, योग सहित"; `/panchang` → "आज का पंचांग — {शहर}, {दिनांक} — तिथि, नक्षत्र, राहु काल"

**Effort**: ~3-4 hours, one PR, metadata-only. Fully testable via `view-source:` on the Vercel preview.

**Risk**: none on indexing (titles update on next Google crawl, 1-3 days). One title may already be near-optimal — verify each `view-source:` before changing.

**Measurement**: re-pull GSC for the same six queries after 14 days. Expect CTR for `diwali puja 2026`-shape queries to move from ~0.1% to ~2-4%.

---

### 2.2 `/panchang/[date]` — date-keyed panchang pages (medium)

**Why this works**: `/choghadiya/[date]` is the property's #1 traffic driver because the URL matches the search query exactly. Panchang has the same query shape (`aaj ka panchang`, `1 june 2026 panchang`, `panchang 27 may 2026`) but no matching URL.

**Sizing**: choghadiya `/[date]` family alone does ~6,000 clicks/month. Even half that yield on panchang would 50× current panchang-family clicks (currently 99/month).

**Build (single PR, mirrors `choghadiya/[date]` shape)**:

- New files:
  - `src/app/[locale]/panchang/[date]/page.tsx`
  - `src/app/[locale]/panchang/[date]/Client.tsx`
  - `src/app/[locale]/panchang/[date]/layout.tsx`
  - `src/app/[locale]/panchang/[date]/opengraph-image.tsx`
- **`generateStaticParams` must return `[]`** — date space is infinite; ISR handles cold pages (this is the must-be-empty-routes rule from CLAUDE.md §"Static Page Budget")
- **URL shape**: `/[locale]/panchang/2026-06-01` (ISO date, matches the choghadiya convention)
- **Title template**: `"1 June 2026 Panchang — Tithi, Nakshatra, Sunrise & Muhurta"` (EN); `"1 जून 2026 पंचांग — तिथि, नक्षत्र, सूर्योदय, मुहूर्त"` (HI)
- **Body structure** (above-the-fold for SEO):
  1. H1: `"{Date} Panchang"` (with year + locale-specific date format)
  2. Five-card grid (tithi/nakshatra/yoga/karana/vara) — reuse `TodayPanchangWidget` cards
  3. Sunrise/sunset, rahu kaal, abhijit muhurta — inline text (not just cards)
  4. **Inline `<a>` to tomorrow + yesterday** (`/panchang/2026-06-02`, `/panchang/2026-05-31`) — Google's crawler walks every date this way
  5. Festival/vrat callout if the date matches one (links to `/festivals/[slug]/[year]`)
- **Sitemap**: dynamic range, today ± 60 days (240 fresh URLs in sitemap at any time; well under budget)
- **JSON-LD**: structured-data `Event` for any festival on the date

**Routing precedence note** (CLAUDE.md Lesson C): document at the page header that the date param is parsed from the URL — never fall back to "today" silently if parsing fails. Return 404 instead.

**Effort**: 4-6 hours, one PR. The pattern is fully proven.

**Risk**:
- `generateStaticParams: []` regression — three prior PRs have re-introduced params and broken the build. Post-merge grep check required.
- Cold-start performance on ISR for distant dates — accepted; the same is true of choghadiya today and Vercel's caching handles it.

**Measurement**: 14 days after deploy, GSC `aaj ka panchang` position should move from 68 to < 30. `1 june 2026 panchang`-shape queries should start surfacing impressions (currently zero).

---

### 2.3 Kundali content hub (largest)

**Scope locked to EN + HI** for the first cut. ~62 pages instead of ~620. Expand to other locales once the pattern shows GSC traction.

**Why this is harder than 2.1/2.2**: `/kundali` is a tool — almost zero indexable content. GSC confirms: 131 impressions, 0 clicks, 19 indexed pages, all of it from `/learn/kundali` (low-volume curriculum pages, not user-intent searches).

We can't fix the tool page directly; it has to stay interactive. The win is **content pages around the tool** that bring traffic and link inward.

**Sizing**: true kundali-intent queries: 5 impressions in 28 days. But yoga/lagna subqueries DO have traffic individually small (~30 imps each) across 477 distinct queries — a long-tail aggregate that adds up.

#### Surface A: `/kundali/lagna/[sign]` — 12 ascendant landing pages

- URL: `/en/kundali/lagna/leo`, `/hi/kundali/lagna/simha`
- Total: 12 signs × 2 locales = **24 pages**
- Title: `"Leo Ascendant (Simha Lagna) — Personality, Career, Marriage in Vedic Astrology"`
- Content: 1,500-word interpretive guide pulled from existing `src/lib/kundali/tippanni-lagna.ts` (already 40 KB of content per lagna, currently used only inside the dynamic tippanni report — no SEO surface)
- Sections per page: ruling planet & nature, classical strengths/weaknesses, exalted & debilitated planets for this lagna, three most common yogas, life areas (career/marriage/health) bullet summary
- Bottom CTA: "Generate your full kundali" → `/kundali`
- Internal linking: every page links to all 11 sibling lagna pages (sidebar) + to relevant yoga pages

#### Surface B: `/kundali/yoga/[slug]` — yoga catalogue

- URL: `/en/kundali/yoga/gajakesari`, `/en/kundali/yoga/kemadruma`, etc.
- Title: `"Gajakesari Yoga — Meaning, Effects & How to Check in Your Kundali"`
- Content: definition, classical Sanskrit conditions, what it means for life areas, examples from public charts, link to "generate your kundali to check if you have this yoga"
- First batch: **10 highest-priority yogas** (EN + HI = 20 pages):
  - Gajakesari, Kemadruma, Chandra-Mangala, Mahabhagya, Vasumati, Gauri, Shankha, Bheri, Kedara, Chatussagara
- Each yoga page detects from the existing engine — at the bottom we render: "Generate your kundali to check"
- Total: **20 pages** in PR-1

**Total scope of 2.3 first cut**: 24 lagna pages + 20 yoga pages = **44 pages** (EN + HI), or 32 page-shells × 2 locales — well within the static-page budget (~7752 / 9000 today).

**Build (3 PRs)**:

1. **PR-1 (~6h)**: route scaffolding (`/[locale]/kundali/lagna/[sign]`, `/[locale]/kundali/yoga/[slug]`), extraction helpers that pull from `tippanni-lagna.ts` / `tippanni-engine.ts` into renderable React, layout + metadata. Ship all 12 lagna pages (EN only) as the proof.
2. **PR-2 (~6h)**: HI translations of lagna pages + first 10 yoga pages (EN). Sitemap additions, JSON-LD `Article` schema, internal-linking spine.
3. **PR-3 (~6h)**: HI translations of yoga pages, plus final QA pass — check none of the existing computation files (`tippanni-engine.ts`) were duplicated (Lesson Q hard rule).

**Risk**:
- Static-page budget: 44 new pages is fine (~7800 / 9000). Track post-merge.
- Translation quality: HI lagna content already exists in `tippanni-lagna.ts`; HI yoga content needs to be written. Falling back to EN only on a yoga page with no HI translation is acceptable (per memory `feedback_four_locales`).
- Tippanni constants duplication: any new page MUST import dignities/yogas from `src/lib/kundali/tippanni-engine.ts` and `src/lib/constants/`. Never inline.

**Measurement**: 30 days after deploy, GSC kundali-intent impressions should rise from 5 → 200+. Yoga-specific queries (`gajakesari yoga`, `shankha yoga`) should show clicks on the new pages.

---

## 3. Sequencing (locked)

| Order | Item | Effort | PR count | When |
|---|---|---|---|---|
| 1 | **#2.1** title rewrites | 3-4h | 1 PR | This week |
| 2 | **#2.2** `/panchang/[date]` | 4-6h | 1 PR | Next week |
| 3 | **#2.3** kundali content hub | ~18h | 3 PRs | Following 2 weeks |

Each shipped step gives 14-day measurement before the next step to attribute deltas cleanly.

---

## 4. Acceptance criteria

For each step, the PR description must include:

1. **Before metric** from GSC (query / page / impressions / clicks / position)
2. **What changed** (title / route / content)
3. **Test plan** specific to this change (e.g., `view-source:` confirmation for titles; ISR sniff for date route; sitemap diff for content hub)
4. **Measurement plan**: which GSC slice to pull at +14d and what threshold = success

---

## 5. Side observation (not in scope, flagged for awareness)

The biggest immediate opportunity isn't actually panchang OR kundali — it's **festival-date pages** (`diwali puja 2026`: 877 imps at pos 11.7, 1 click). Step 2.1 covers this incidentally via festival-page title rewrites. If post-2.1 measurement confirms the festival lift, that surface deserves its own deeper investment (festival-date hub: deity, regional variants, year-specific muhurat). Tracked as future work, not in this spec.

---

## 6. Open questions for review

None. Scope locked above. Gemini and human reviewers — please flag any of the following if you see them:

- A query I've sized that I'm reading wrong (e.g., wrong CTR baseline assumption)
- A route that would break the 9k static-page budget
- A title proposal that conflicts with brand voice (we don't currently have a brand-voice doc — gut-check welcome)
- A duplicated-content risk (e.g., yoga page text that overlaps `/learn` modules and triggers a thin-content flag)

# Backlink Acquisition Strategy

**Date**: 2026-06-01 (revised 2026-06-02)
**Status**: Strategy spec
**Owner**: Aditya
**Constraints chosen by Aditya 2026-06-02**:
- 10 hours/week of focused effort
- Brand-only positioning (no personal-expert face on outreach)
- Engaged on Wikipedia/Wikidata work
- **Calculation engine stays closed source** — no open-source workstream

**Context**: Post-Core-Update demotion analysis identified weak backlink graph as the largest structural gap vs Drik / Prokerala. This doc maps a 12-month plan to close it.

## The math

| Reference | Current state |
|---|---|
| Estimated current backlinks | 10-30 (dev.to article + organic mentions) |
| Drik Panchang backlinks | 8,000-15,000 (estimated) |
| Prokerala backlinks | 12,000-20,000 (estimated) |
| Trust threshold inflection (guess) | ~500-1,000 quality backlinks from relevant sources |

We don't need to match Drik. We need enough relevant-source backlinks to cross Google's site-trust threshold so templated content stops getting reclassified as scaled-content abuse.

**Realistic 12-month target**: 200-500 high-quality backlinks.

## Why the work matters

Trust signals are how Google decides templated content is "useful daily-updating reference" (weather, stocks, sports) vs "scaled content abuse" (programmatic spam). Same shape, opposite treatment. We need to demonstrate authority before the templated content surfaces it.

## Six workstreams, prioritized by ROI

### Workstream 1 — Embed-able widget productization ★★★ Highest single ROI

Build a free panchang / festival widget any Hindu temple, diaspora organisation, or community site can embed:

```html
<iframe src="https://dekhopanchang.com/embed/panchang?city=delhi&theme=light"
        width="320" height="480"></iframe>
```

Each embed comes with attribution: "Powered by Dekho Panchang" linking back. Each embed = 1 backlink + every visitor sees the brand forever.

We already have `/embed/panchang`. Need to:
1. Polish the embed UI (small, lightweight, themable)
2. Add a clean "Embed on your site" button on main panchang + festival pages
3. Build `/embed/builder` — self-serve UI where temples pick location + theme + dimensions → copy-paste iframe
4. Generate copy-pasteable iframe code with attribution baked in
5. Outreach to workstream-4 targets specifically offering the embed

**Expected backlinks**: 20-100 over 6 months. Compounds because each embed is permanent.

### Workstream 2 — Wikipedia / Wikidata enhancement ★★★ High ROI given engagement

You're willing to do this — that's a huge unlock.

We already have a Wikidata entity (Q139054863 — referenced in our Organization JSON-LD). Build it out:

1. **Wikidata entity**: expand Q139054863. Add properties for `instance of`, `inception`, `country`, `founder`, `industry`, `URL`. Link to relevant Wikidata items (Hindu calendar, Vedic astrology, Panchang). Each strong Wikidata entity reinforces Google's Knowledge Graph trust.

2. **Wikipedia contributions** where we have substantive value:
   - "Hindu Calendar" — methodology section, regional variations
   - "Panchanga" — explanation of the five elements
   - Individual festival articles — date references and observance details
   - Specific tithi articles (Ekadashi, Amavasya, Purnima)
   - Specific nakshatra articles
   - Regional calendar articles: "Bengali calendar", "Tamil calendar"
   - "Brihat Parashara Hora Shastra" — modern computational implementations
   - "Surya Siddhanta" — modern implementations

   Wikipedia rules: WP:RS, WP:V, WP:COI. Don't self-cite spam. Contribute substantive content where our methodology page is genuinely the best available source.

3. **Wikisource Sanskrit projects** — if you can contribute OCR/translations of classical Jyotish texts, "Dekho Panchang" becomes a known contributor.

**Effort**: 2-4 hours per Wikipedia edit. Slow but compounds. Each Wikipedia citation is among the highest-quality backlinks possible.

**Expected backlinks**: 5-20 in 12 months. Disproportionately valuable.

### Workstream 3 — Technical content marketing (brand-voice) ★★ High ROI per unit effort

The dev.to article worked (per memory `reference_devto_article`). Multiply this, but write as brand voice ("Dekho Panchang Editorial") rather than as Aditya personally.

Channels:
1. dev.to (engineering audience, long-form friendly)
2. Hacker News submissions (risky but viral)
3. Indian engineering blogs: Inc42, YourStory
4. Subreddits: r/programming, r/learnastronomy, r/IndianHistory, r/AskHistorians
5. Personal Dekho Panchang blog with proper byline

Topics that drive engineer/researcher interest **without releasing engine source**:
- "How we verified our tithi calculations match NASA JPL Horizons over 100 years" (publish comparison DATA — charts/tables — not source)
- "Why two Vedic almanac calculators can disagree on tomorrow's tithi" (neutral references per `feedback_no_competitor_references` — "competing references", not "Drik/Prokerala")
- "The Bengali calendar's leap-month rule, computed three ways"
- "Surya Siddhanta as Renaissance-era astronomy: a comparison"
- "Computing Diwali from first principles — 5 algorithms, 5 different dates"
- "Implementing Kerala-school continued fractions"
- "Why Vedic astronomy ≠ astrology"

**Critical workaround for not open-sourcing**: lean heavily on **published comparison data** as the credibility builder. Tables, charts, accuracy benchmarks, JSON exports — proves rigour without revealing source. This is the substitute for the open-source E-E-A-T signal.

Frequency: 1-2 long-form posts per month, syndicated aggressively.

**Expected backlinks**: 5-20 per post. 60-200 over 12 months.

### Workstream 4 — Religious / cultural site outreach ★★ Medium-high ROI, slow

Target sites that link to panchangs/calendars/festivals because their visitors need them:
- ISKCON temple sites (iskcon.org, iskcondelhi.com, iskconmumbai.com, iskconbangalore.org)
- Major Hindu temple websites (Tirumala Tirupati, Vaishno Devi, Shirdi Sai, Jagannath Puri, Somnath, Kashi Vishwanath, Meenakshi Madurai)
- Diaspora Hindu organisations:
  - Hindu American Foundation (hinduamerican.org)
  - VHP chapters (UK, USA, Canada, Australia)
  - BAPS Swaminarayan
- Devotional content sites: bhagavadgitatrust.org, geetapress.org
- Authority sites: Art of Living, Isha Foundation, Mata Amritanandamayi

Outreach approach (brand-to-brand):
1. Find their existing "calendar" or "festivals" page
2. Email their webmaster from `hello@dekhopanchang.com`: "Saw you link to X for tithi data. We've published a free panchang with transparent methodology, no ads, no paywalls. Free embed widget available if useful for your visitors."
3. Lead with the embed (workstream 1)
4. Don't ask for backlinks — ask if useful for their visitors

Volume: 5-10 personalised emails per week. Response rate ~5-15%. So ~1-2 quality links per month.

**Expected backlinks**: 10-30 over 12 months. Higher conversion after the embed builder ships.

### Workstream 5 — Public free API with rate limits ★★ Replaces some open-source benefit

Since the engine stays closed, expose a controlled subset via a public, free, rate-limited API:

```
GET https://api.dekhopanchang.com/v1/panchang?date=2026-06-02&lat=28.6&lng=77.2
→ JSON: tithi, nakshatra, yoga, karana, sunrise, sunset
```

Why this matters:
- Developers can integrate panchang into their apps without seeing the source
- Each developer who uses the API becomes brand-aware
- Many give voluntary attribution (footer linking to dekhopanchang.com)
- We control the contract; nobody forks our engine

Build:
1. Define a small public API surface (~5-10 endpoints): /panchang, /choghadiya, /festival-of-day, /muhurta/{activity}
2. Rate-limit per IP (e.g. 100 calls/day free)
3. Require a free signup for higher limits (collects emails → newsletter list)
4. Document on `/api-docs` with code examples (Python, JS, curl)
5. Submit to API directories: rapidapi.com, public-apis.io, programmableweb

**Expected backlinks**: 5-20 from API directories alone, plus uncountable attribution mentions.

**Effort**: 1-2 weeks for the public API surface (the route handlers exist privately; just need a public wrapper + auth + rate-limit).

### Workstream 6 — Indian-language community engagement (brand voice) ★ Medium ROI

Bengali calendar gets 47% of evergreen traffic per §1.3. Engage authentically as the brand:
- Bengali subreddits: r/bangladesh, r/kolkata, r/Westbengal
- r/AskIndia, r/india, r/IndiaSpeaks for festival questions
- Maithili: r/Bihar, r/Mithila (our #1 traffic-driver locale)
- Telugu / Tamil / Kannada language subreddits
- Facebook groups for Bengali culture, Hindu festivals, Indian diaspora

Engagement model (brand voice — harder than personal voice but possible):
- Answer real questions thoughtfully through the official account
- Where genuinely relevant, link to specific dated/festival pages
- Build karma + reputation first, mention occasionally
- Get on moderator radar as useful contributor
- Don't be promotional — be genuinely helpful

Reddit links are nofollow but this builds **brand search demand** — people search "dekho panchang" after seeing the URL, which Google reads as brand validation.

**Expected indirect impact**: brand search volume +200-500/month over 6-12 months.

## Sprint plan — first 30 days (~10 hr/week, no open-source)

### Week 1 — Embed widget productization (10 hours)
- [ ] Audit + polish `/embed/panchang` (small, fast, themable, no auth)
- [ ] Build `/embed/festivals` for upcoming festivals (top SEO surface)
- [ ] Build `/embed/builder` — self-serve UI for location/theme/dimensions → copy-paste iframe
- [ ] First technical blog post: "Verifying our tithi calculations against NASA JPL Horizons" (publishes comparison data, not source)

### Week 2 — Wikidata + first outreach batch (10 hours)
- [ ] Build out Wikidata Q139054863 (workstream 2)
- [ ] Identify + email 10 ISKCON / temple webmasters offering the embed (workstream 4)
- [ ] Submit `/embed/panchang` to public-apis.io + 2 other directories

### Week 3 — Wikipedia contributions + content (10 hours)
- [ ] First substantive Wikipedia contribution to "Hindu Calendar" methodology section
- [ ] Second technical post: "Why two panchangs sometimes disagree"
- [ ] 5 more temple webmaster emails

### Week 4 — Community + API + measure (10 hours)
- [ ] Bengali community engagement: 3 thoughtful Reddit answers from official account
- [ ] Maithili: 2 contributions
- [ ] Build out public API surface (workstream 5) — spec + first 2 endpoints behind rate-limit
- [ ] Pull baseline backlink count from Ahrefs free / Ubersuggest
- [ ] Retrospective: what landed, adjust month 2

## Tracking + measuring

### KPIs to watch monthly

| Metric | Where | Target by Month 3 | Target by Month 12 |
|---|---|---|---|
| Total referring domains | Ahrefs free / Ubersuggest | 30 → 80 | 200+ |
| .edu / .ac.in backlinks | Manual count | 0 → 2 | 10+ |
| Brand search volume ("dekho panchang") | GSC | <100/mo → 300/mo | 2000+/mo |
| Embeds in the wild | search `site:* "dekhopanchang.com/embed"` | 0 → 10 | 100+ |
| Wikipedia citations | Manual audit | 0 → 3 | 20+ |
| API calls/day | API logs | 0 → 100 | 5000+ |
| Wikidata entity strength (claims count on Q139054863) | wikidata.org | 5 → 15 | 30+ |

### Anti-patterns to avoid

- Paid link schemes (Indian "guest post networks" specifically)
- Astrology forum link spam (most are low-quality classified)
- Reciprocal directory listings (e.g., "best astrology sites" listicles)
- Buying backlinks via Fiverr / SEOClerk
- Excessive interlinking from minor properties (PBN signal)

## Honest expectation-setting

Even with disciplined execution:
- **Months 1-3**: GSC impressions stay near zero. Hardest phase psychologically.
- **Months 4-6**: First embeds in the wild, first Wikipedia citations, first temple mentions. 10-30 backlinks accumulated.
- **Months 7-12**: Trust signal accumulates enough for Google's next quality-classifier refresh to potentially reclassify the property upward. NOT guaranteed.

Sites demoted in a Core Update typically don't fully recover until ANOTHER Core Update reverses the classification. The backlink work makes us a better candidate; the algorithm window opens on Google's schedule.

## What's deliberately NOT in this plan

- **Open-sourcing the calc engine** — per `feedback_engine_closed_source` (2026-06-02 decision)
- **Aditya as named public expert** — per his "brand-only" preference
- **Academic relationship outreach** — needs personal-expert positioning
- **Paid PR / press services** — premature
- **Conference speaking** — premature
- **YouTube** — parked separate strategy
- **Podcast appearances** — possible once accuracy benchmarks are published

## Open questions (lower priority than month-1 execution)

1. Brand-account voice on Reddit — is there a designated person who'll write the responses, or will I draft them for your review?
2. Wikipedia editing — should I draft contribution language for you to review and post, or do you want to handle directly?
3. Email outreach (workstream 4) — drafts from me to send via `hello@dekhopanchang.com`, or will you do this end-to-end?
4. Public API rate-limit floor — 100 calls/day free, or higher/lower? 100 covers genuine integrations without abuse.

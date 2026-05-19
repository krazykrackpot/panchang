# Growth Strategy: UTM Tracking, SEO, Content, and dev.to Article

**Date:** 2026-05-18
**Status:** Draft

---

## Part 1: UTM Parameter Tracking (Approach B — Supabase table)

### What
Capture `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term` from inbound URLs. Persist in a cookie for the session. Log to a Supabase `utm_visits` table on key conversion events. Attach UTM params to existing Vercel Analytics `track()` calls.

### Schema

```sql
create table public.utm_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references auth.users(id),  -- null for anonymous
  session_id text not null,                 -- random ID per visit
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,                        -- the URL path they landed on
  referrer text,                            -- document.referrer
  event text not null,                      -- 'page_view', 'kundali_generated', 'signup', 'checkout_started'
  event_metadata jsonb                      -- optional extra data per event
);

-- RLS: service_role inserts, no public read
alter table public.utm_visits enable row level security;
create policy "service_role_only" on public.utm_visits for all using (false);
```

### Implementation

1. **Client-side UTM capture** — `src/lib/utm.ts`:
   - On first page load, parse `window.location.search` for UTM params
   - If any UTM param found, write to a cookie `dp_utm` (JSON, 30-day expiry, SameSite=Lax)
   - Generate a `session_id` (crypto.randomUUID) and store in sessionStorage
   - Export `getUtmParams()` that reads the cookie + session_id

2. **Track wrapper update** — `src/lib/analytics.ts`:
   - Import `getUtmParams()`
   - Every existing `track()` call gets UTM params appended as custom properties
   - Add a new `trackUtmEvent(event, metadata?)` that POSTs to `/api/track-utm`

3. **API route** — `src/app/api/track-utm/route.ts`:
   - Accepts `{ event, metadata, utm, sessionId, landingPage, referrer }`
   - Inserts into `utm_visits` via service role client
   - Returns 204 No Content
   - Rate limit: 20 events per session_id per minute (simple in-memory map)

4. **Key events to track**:
   - `page_view` — on first landing only (when UTM params are present)
   - `kundali_generated`, `matching_computed`, `signup`, `checkout_started`, `checkout_completed`

### Querying

```sql
-- Which source drives the most kundali generations?
select utm_source, utm_campaign, count(*)
from utm_visits
where event = 'kundali_generated'
group by utm_source, utm_campaign
order by count desc;

-- Conversion funnel from dev.to article
select event, count(*)
from utm_visits
where utm_source = 'devto' and utm_campaign = 'vedic-astronomy-pt2'
group by event;
```

---

## Part 2: SEO Optimisation (Google organic — currently 93 visitors)

The SEO infrastructure is already mature (241 PAGE_META, 32 OG images, FAQ schema on 30 routes, IndexNow, structured data). Optimisation at this stage is about content and signals, not technical gaps.

### Actions

1. **Internal linking density** — cross-link between tools and learn pages more aggressively. The `src/lib/seo/cross-links.ts` map exists but may be underleveraged in actual page content. Audit 5 high-traffic pages and add 2-3 contextual internal links each.

2. **Long-tail programmatic pages** — the city panchang pages (`/panchang/[city]`) and rashi compatibility pages (`/matching/[r1]-[r2]`) are the programmatic SEO play. Verify they're being indexed (check GSC Coverage report for these URL patterns).

3. **Content freshness signals** — the daily horoscope pages and transit articles should have `dateModified` in their Article JSON-LD. If they're computed daily, this signals freshness to Google.

4. **Backlinks from dev.to articles** — each article links to dekhopanchang.com with relevant anchor text. dev.to has DA 85+. Three articles = three high-quality backlinks.

5. **Google Discover** — the `/learn/contributions/*` pages are optimised for Discover (large images, curiosity-gap titles). Monitor GSC Discover tab for impressions. The `max-image-preview:large` meta is already set.

---

## Part 3: Content Strategy for ChatGPT Referrals (currently 10 visitors)

ChatGPT is sending users to dekhopanchang.com without any deliberate effort. This is happening because:
- `llms.txt` exists and describes the site's capabilities
- `robots.txt` allows GPTBot selective access to tool pages and learn paths
- Structured data (FAQ, Article, WebApplication) gives AI models rich context

### Actions to grow this channel

1. **Expand llms.txt** — add specific tool descriptions with example queries. "To compute a Vedic birth chart for any date and location, visit dekhopanchang.com/en/kundali". Make it easy for ChatGPT to recommend the right page.

2. **FAQ schema expansion** — add FAQ entries to tool pages that don't have them yet. AI models love FAQ schema because it directly answers user questions.

3. **"How to" content** — pages titled "How to calculate your Vedic birth chart" or "How to find today's tithi" match the question patterns people ask ChatGPT. These pages serve double duty: Google featured snippets + AI citations.

4. **Monitor and measure** — once UTM tracking is live, add `?utm_source=chatgpt` detection (ChatGPT referrals come with a `chatgpt.com` referrer, no UTM params — capture the referrer in the `utm_visits` table for this).

---

## Part 4: dev.to Article — "Vedic Astronomy in the Browser, Part 2"

### Title

**"370 Tithis, 4 Eclipses, and One Bug That Moved Dussehra by 11 Days"**

Subtitle: *Computing the entire Hindu calendar in TypeScript — from lunar phase geometry to festival date resolution.*

### Series

"Vedic Astronomy in the Browser" — Part 2 of 4.
Part 1: "How I Built a Vedic Panchang Engine in TypeScript" (published)

### Voice and style

- First person, conversational. Written like a developer talking to other developers over coffee.
- British English (honour, colour, generalise).
- Short paragraphs. White space between ideas.
- No AI tells:
  - No em-dashes for dramatic pauses
  - No "it's not X — it's Y" inversions
  - No "not many people know" / "you might think" / "let's dive in" / "in this article we will"
  - No "the beauty of" / "elegantly" / "surprisingly" / "interestingly"
  - No filler transitions ("now that we've covered X, let's move on to Y")
- War stories and mistakes are first-class content. They go up front, not in footnotes.
- Code is explained in prose, not left to speak for itself.

### Structure and word budget

Target: 3,800–4,200 words total. 5–6 code snippets, 10–30 lines each.

---

#### Intro (~200 words)

Context paragraph: Part 1 covered the five limbs of the panchang — tithi, nakshatra, yoga, karana, vara. That engine tells you the astronomical state of a single moment. But a calendar needs more. You need every tithi in the year. You need to know when eclipses fall. And you need to map all of that onto the festivals and fasts that 1.2 billion people actually observe.

This article covers the three hardest problems I solved building Dekho Panchang's calendar engine: pre-computing 370+ tithis for any year, predicting eclipses from lunar node geometry, and a festival lookup engine that took three attempts to get right.

Link to Part 1 and to dekhopanchang.com (with UTM params).

---

#### Section 1: The Tithi Table (~1,200 words, 2 code snippets)

**Opening:** A tithi is not a fixed-length day. The Sun-Moon elongation grows at a variable rate because the Moon's orbit is elliptical. A tithi can last 19 hours or 26 hours. You cannot divide a lunar month into 30 equal slots.

**The problem:** For the festival engine, I need every tithi boundary for the entire year — start time, end time, which lunar month it belongs to, and whether it's a special case (kshaya or vriddhi).

**The approach — binary search:**
For each of the 30 tithi boundaries per lunar month (0°, 12°, 24°, ..., 348° of Sun-Moon elongation), find the exact Julian Day when the elongation crosses that threshold.

- Coarse scan: 2-hour steps forward from the last known boundary, checking if the elongation crossed the target
- Fine search: 20-iteration binary search narrowing the window to ~5 seconds

**Code snippet 1:** The binary search function that finds a tithi boundary. Simplified from the production `findTithiEndJd` — show the coarse scan + binary search core, omitting cache and error handling. ~20 lines.

**Kshaya and Vriddhi tithis:**
- Kshaya: a tithi that starts after one sunrise and ends before the next. No sunrise falls within it. The day "skips" that tithi entirely. Happens a few times per year.
- Vriddhi (dwi-tithi): a tithi that spans two sunrises. The festival engine needs to decide which day "owns" it.
- The Smarta Ekadashi rule: for Ekadashi (tithi 11 and 26), the second day is used. For everything else, the first day. This matters for fasting — the rules are specific about when you start and break the fast.

**Dual masa assignment:**
Every tithi gets two month labels: amanta (New Moon to New Moon) and purnimanta (Full Moon to Full Moon). Half of India uses one system, half uses the other. The engine computes both independently.

**Code snippet 2:** The Adhika (intercalary) month detection logic. Two consecutive New Moons → compute the Sun's sidereal longitude at each → if both are in the same sign, no solar ingress happened → the month is Adhika. ~15 lines.

**Output:** ~370 entries per year. Each entry: tithi number, paksha, start/end JD with local times, sunrise date, kshaya/vriddhi flags, dual masa labels, duration in hours.

---

#### Section 2: Eclipse Prediction (~1,000 words, 2 code snippets)

**Opening:** Rahu and Ketu. In the mythology, a demon who swallowed the Sun and Moon. In the geometry, the two points where the Moon's orbital plane crosses the ecliptic. The ascending node (Rahu) and the descending node (Ketu) are always exactly 180° apart, and they drift westward at about 0.053° per day — one full cycle every 18.6 years.

**The condition for an eclipse:**
A solar eclipse happens at New Moon. A lunar eclipse happens at Full Moon. But not every New Moon or Full Moon produces an eclipse. The Moon's orbit is tilted about 5° to the ecliptic. An eclipse only occurs when the New/Full Moon happens close enough to a node — close enough that the Moon's ecliptic latitude is small.

**The algorithm:**
1. Pull every Amavasya (New Moon, tithi 30) and Purnima (Full Moon, tithi 15) from the tithi table we just built
2. At each one, read the Moon's ecliptic latitude from Swiss Ephemeris
3. Compare against threshold values that depend on the Moon's speed (a proxy for its distance — faster means closer means larger apparent disc)

**Code snippet 3:** The eclipse detection core — iterate New/Full Moons, check latitude against speed-scaled thresholds, classify as total/annular/partial/penumbral. ~25 lines. Show the actual threshold formulas with the physical reasoning in comments.

**Why speed matters for classification:**
- A fast Moon is closer to Earth, so its apparent disc is larger
- Solar: if the Moon's disc is larger than the Sun's → total. Smaller → annular.
- The speed threshold is 13.0°/day — above that, total is possible. Below, annular.

**Rahu or Ketu?**
After confirming an eclipse, compute the angular distance from the eclipse point to both nodes. The closer node gets the label. Solar eclipses near Rahu mean the Moon is crossing northward. Near Ketu, southward. This affects the Sutak (ritual pollution period) calculation in Hindu tradition.

**Code snippet 4:** The hybrid validation — cross-check computed eclipses against a NASA reference table (2024-2035). Discard false positives the engine found that NASA didn't. Inject NASA entries the engine missed. ~15 lines.

**Accuracy note:** The Meeus fallback doesn't return Moon latitude (it returns 0), so eclipse detection only works reliably with Swiss Ephemeris loaded. The engine logs a warning when running in fallback mode.

---

#### Section 3: The Festival Engine (~1,200 words, 1-2 code snippets)

**Opening with the war story:**
Dussehra 2026 was 11 days early on the site. Diwali was 30 days early. Users wrote in. The computation was mathematically correct. The bug was one word.

**The problem:**
Hindu festivals are defined by coordinates in the lunar calendar: a month name, a paksha (bright or dark fortnight), and a tithi number. Dussehra is Ashvina Shukla Dashami. Diwali is Kartika Krishna Amavasya. The engine needs to convert these coordinates into Gregorian dates.

**The declarative approach:**
Each festival is a simple definition object:

```typescript
{ masa: 'Ashvina', paksha: 'shukla', tithi: 10, slug: 'dussehra', type: 'major' }
```

The engine scans the tithi table, finds entries matching the masa + paksha + tithi, and returns the Gregorian date. Clean, simple, wrong.

**The amanta/purnimanta bug:**
Festival definitions use month names from the Purnimant convention. Every reference — printed panchangs, temple calendars, government holiday lists — uses Purnimant month names. The tithi table stores both Amant and Purnimant labels.

The lookup code matched against `.amanta`.

During Shukla Paksha (bright fortnight), both systems agree: Ashvina is Ashvina. During Krishna Paksha (dark fortnight), Purnimant is one month ahead of Amant. Purnimant Kartika Krishna = Amant Ashvina Krishna.

So Diwali (Kartika Krishna Amavasya in Purnimant) was being searched in Amant Kartika, which is actually Purnimant Margashirsha. The engine found the Amavasya in the wrong month entirely.

The fix: for Krishna Paksha festivals, match `getNextHinduMonth(entry.masa.amanta) === def.masa`. One function call. Three weeks of confused users.

**Code snippet 5:** The festival lookup function showing the Shukla/Krishna branching. ~20 lines.

**The Kala-Vyapti system:**
Finding the right tithi isn't enough. Some festivals have specific timing windows within the day. Ram Navami is observed during Madhyahna (the middle fifth of daytime). Diwali during Pradosh (the first 96 minutes after sunset). Shivaratri during Nishita (the 8th muhurta of the night, around midnight).

When a tithi spans two days, the engine computes how much of the tithi overlaps with the prescribed time window on each day, and picks the day with the greater overlap. Night-time observances (Pradosh, Nishita) prefer the earlier day when overlap is equal.

**Code snippet 6 (optional):** The dwi-tithi decision logic — Ekadashi takes the second day, everything else takes the first. ~10 lines.

**Closing the section:** The festival engine today handles 150+ festivals, 24 named Ekadashis with Parana (fast-breaking) calculations, 12 solar Sankrantis, and conditional vrats like Somvati Amavasya (Amavasya on a Monday). Every entry includes a muhurta window and a trilingual description. The entire thing runs on the tithi table from Section 1.

---

#### Outro (~200 words)

What's left to cover in this series: muhurta scoring (combining Rahu Kaal, Vishti Karana, planetary hora, and Panchaka into a single auspiciousness score), the KP system (Placidus houses on a sidereal zodiac), and transit prediction.

All of this runs at [dekhopanchang.com](https://dekhopanchang.com?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2) — free, no account required for the panchang and calendar tools.

If you have questions about the astronomical algorithms or the Hindu calendar system, I'm happy to answer in the comments.

---

### Tags

`typescript`, `astronomy`, `javascript`, `webdev`

### Cover image

Screenshot of the Dekho Panchang calendar page showing the festival calendar with coloured festival entries, or a diagram showing the Sun-Moon elongation geometry.

### UTM links

All links to dekhopanchang.com in the article use:
`?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2`

### Cross-promotion

- Link to Part 1 at the top
- Mention Part 3 (B: sitemap article) and Part 4 (A: ChatGPT referrals) at the bottom as "coming next"

---

## Implementation order

1. **UTM tracking** — implement first so the article links are tracked from day one
2. **Write the dev.to article** — using real code from the codebase, simplified for readability
3. **SEO actions** — internal linking audit, JSON-LD freshness signals
4. **ChatGPT referral optimisation** — expand llms.txt, add FAQ schema to remaining tool pages

---

## Success metrics (check at 30 days post-publish)

- dev.to article: 1,000+ views, 20+ reactions, 3+ referral visits (up from 1)
- UTM tracking: functioning end-to-end, queryable in Supabase
- Google organic: stable or growing from 93 baseline
- ChatGPT referrals: stable or growing from 10 baseline

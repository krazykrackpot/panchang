# Widget Outreach — Workstream 2

**Date opened**: 2026-06-02
**Owner**: Aditya Jha
**Goal**: Land 5 quality embeds of the Dekho Panchang widget in the first 30 days. Each embed is a permanent backlink + a steady trickle of qualified visitors.

## Why this matters

The widget code shipped in PR #360 (`/embed/panchang`, `/embed/festivals`, `/widget` builder). The code is the easy half. The value comes from getting it embedded — every embed is:

- a permanent, hard-coded backlink (`href` attribute, not just a profile-link)
- a daily visitor stream from the host site's own traffic
- an attribution `?ref=` tag that lets us measure which outreach actually moves the needle
- credibility-by-association when the host is reputable

Five embeds at ~50 daily impressions each = ~7,500 monthly impressions we don't pay for. Within a year that's a meaningful share of recovery from the May 2026 Core Update demotion.

## Target list — 30 outreach targets

We need volume because cold-outreach response rates are 5-15%. Five embeds = ~30-50 pitches sent.

### Tier 1 — Temple websites with active admins (12 targets)

Pick temples with maintained websites (recent updates), modest tech sophistication (they can paste an iframe), and a daily-panchang-relevant audience.

- Indian temples with their own panchang page already
- Diaspora temples (US, UK, Canada, Australia, Singapore, UAE) — their congregations are already looking up panchang for ceremonies and they're more likely to embed a free tool than build one
- Smaller / community-run temples — less bureaucratic decision-making

Tactic: pitch the FESTIVAL widget (not panchang) — temples care more about Janmashtami / Navratri / Diwali dates than daily tithi.

### Tier 2 — Hindu diaspora cultural sites (10 targets)

Sites like:
- Hindu Students Council chapters (university-affiliated)
- Regional cultural associations (Marathi mandals, Bengali sammelans, Tamil sangams, etc.)
- Hindu temple federation websites
- Diaspora newspaper / community-bulletin sites

Tactic: pitch the REGIONAL CALENDAR widget — they care about the festival cycle in their tradition.

### Tier 3 — Hindu lifestyle bloggers + content creators (8 targets)

Bloggers who write about Hindu practices, vrats, festivals, parenting in Hindu households. Find them via:
- Top-ranking Hindu lifestyle blogs in Google (search "ekadashi vrat blog", "navratri recipes blog", etc.)
- YouTubers who post panchang readings (find their website, pitch them)
- Instagram accounts focused on Hindu festivals (DM the website link)

Tactic: pitch as an "embedded widget so your readers don't leave your site to check the date".

## Pitch templates

- `2026-06-02-widget-pitch-temples.md` — for temple websites (formal tone)
- `2026-06-02-widget-pitch-diaspora.md` — for diaspora community sites (warmer, community-framing)
- `2026-06-02-widget-pitch-bloggers.md` — for lifestyle bloggers (peer-to-peer, less formal)

## Dev.to follow-up post

- `2026-06-02-devto-widget-launch-post.md` — technical launch post in the existing dev.to article style, announcing the embed. Publishing this on dev.to gives us a backlink + may attract developer-curious temple/site admins.

## Tracking

Each outreach email uses a unique `?ref=<slug>` UTM tag so we can attribute installs back to the specific pitch that landed. Track in this directory:

- `outreach-log.csv` — date, target, channel, status, ref-tag, outcome
- After 30 days, audit: which channels converted, which subject lines opened, what's worth doubling down on

## Hard rules

- **Never mention competitors by name** (no Prokerala / Drik / Shubh in the pitches). Lead with our own capabilities.
- **The widget is free, forever** — make this unambiguous upfront. Some recipients will assume "free trial" or "freemium upsell" and walk away. Be explicit: no paywall, no upsell, no analytics scraping.
- **The widget is noindex** — explain this so admins understand it won't compete with their own site's rankings.
- **Attribution is the deal** — the small "Powered by Dekho Panchang" footer link is the ONLY price. Be upfront. Some sites won't take it; that's fine.
- **Don't volume-blast** — personalised, hand-targeted outreach beats bulk every time. Quality > quantity.

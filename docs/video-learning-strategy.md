# Video Learning Modules — Strategy & Production Plan

**Date:** 2026-05-02
**Goal:** Convert 225+ learn pages into engaging video modules with viral potential, at low per-video cost.

---

## The Vision

Transform Dekho Panchang from a website into a **Vedic astrology learning platform with video** — the Khan Academy of Jyotish. No one is doing this. Drik has zero video content. Astrology YouTube is full of generic predictions — no one teaches the SYSTEM.

---

## Content Tiers (3 formats, different lengths)

### Tier 1: YouTube Shorts / Instagram Reels (30-60 seconds)
**Purpose:** Virality, brand awareness, top-of-funnel
**Volume:** 100+ videos (one per concept)
**Style:** Fast-paced, text-on-screen, dramatic music, one fact per video

**Examples:**
- "Did you know your Vedic Sun sign is different from your Western one? Here's why..." (30s)
- "Rahu Kaal explained in 45 seconds" (45s)
- "What is Sade Sati? Saturn's 7.5-year test" (60s)
- "Your Moon sign reveals your REAL personality" (45s)
- "Why Pushya Nakshatra is the BEST for buying gold" (30s)

**Template:**
```
[0-3s]  Hook — dramatic text + sound effect
[3-20s] Core explanation — animated graphics from our SVGs
[20-25s] "Mind blown" moment — the surprising takeaway
[25-30s] CTA — "Learn more at dekhopanchang.com" + follow prompt
```

### Tier 2: Medium-form Explainers (3-8 minutes)
**Purpose:** Education, YouTube SEO, subscriber growth
**Volume:** 50+ videos (one per learn topic)
**Style:** Narrated explainer with animated graphics, like Kurzgesagt-lite

**Examples:**
- "The 27 Nakshatras — Your Cosmic DNA Explained" (7 min)
- "How to Read a North Indian Kundali" (5 min)
- "Vimshottari Dasha — Understanding Your Life's Planetary Periods" (6 min)
- "Ashta Kuta Matching — What the 36 Points Really Mean" (8 min)
- "Jupiter in Cancer 2026 — What It Means for YOUR Sign" (5 min)

**Template:**
```
[0-15s]   Hook + title card with celestial background
[15s-1m]  Introduction — why this matters to YOU
[1m-5m]   Core teaching — animated diagrams, charts, examples
[5m-6m]   Practical application — "Here's how to use this"
[6m-7m]   Summary + CTA — "Generate your chart free at dekhopanchang.com"
```

### Tier 3: Deep-dive Courses (15-30 minutes)
**Purpose:** Authority, long watch time, ad revenue
**Volume:** 25 videos (one per curriculum module)
**Style:** Lecture-style with rich visuals, like a university course

**Examples:**
- "Complete Panchang Course — Module 1: The Five Elements of Time" (20 min)
- "Understanding Dashas — From Birth to Life's End" (25 min)
- "Yoga Detection Masterclass — 150 Yogas Explained" (30 min)

---

## Production Pipeline (Automated, Low Cost)

### Architecture: HTML → Video

We already have the content (learn pages) and the graphics (SVG icons, charts). The pipeline:

```
Learn Page Content (text)
    ↓
Script Generator (AI formats text into narration script)
    ↓
┌─────────────────────┐  ┌──────────────────────┐
│  Voiceover (AI TTS)  │  │  Visual Frames (HTML) │
│  - Hindi (primary)   │  │  - Our SVG icons      │
│  - English           │  │  - Animated charts    │
│  - Sanskrit (mantras)│  │  - Text overlays      │
└─────────────────────┘  └──────────────────────┘
    ↓                         ↓
    └─────────┬───────────────┘
              ↓
    Remotion / FFmpeg (compose video)
              ↓
    Background Music (royalty-free)
              ↓
    Final MP4 (1080x1920 vertical for Shorts, 1920x1080 horizontal for YouTube)
```

### Tech Stack

| Component | Tool | Cost |
|---|---|---|
| **Script** | Our learn page content → AI reformats into narration | Free (content exists) |
| **Voiceover** | ElevenLabs API (Hindi/English) or Google Cloud TTS | ~$0.30/min |
| **Visuals** | Remotion (React → video) — reuse our existing components | Free (OSS) |
| **Music** | Pixabay, Uppbeat, YouTube Audio Library | Free |
| **Composition** | FFmpeg for final render | Free |
| **Hosting** | YouTube, Instagram, dekhopanchang.com | Free |

**Estimated cost per video:**
- Tier 1 (30-60s): ~$0.50 (voiceover only)
- Tier 2 (5-8 min): ~$3-5 (voiceover + longer render)
- Tier 3 (20-30 min): ~$10-15 (voiceover + complex visuals)

### Visual Style Guide

**Color palette:** Same as the website — navy #0a0e27, gold #d4a853/#f0d48a
**Typography:** Cinzel for titles, Inter for body, Noto Devanagari for Hindi
**Graphics:**
- Our existing SVG icons animated (planet dots orbiting, zodiac wheel rotating)
- North Indian diamond chart with planets appearing one by one
- Gold particle effects for "auspicious" moments
- Red warning effects for "inauspicious" topics
- Smooth zoom transitions between concepts

**Music by topic:**
- Panchang/Calendar: Soft sitar + tabla rhythm
- Kundali/Charts: Mysterious veena + ambient pads
- Doshas/Warnings: Dramatic dhol + tension strings
- Remedies/Mantras: Peaceful flute + singing bowls
- Festivals: Celebratory shehnai + dhol
- Transit predictions: Cosmic synthesizer + gentle rhythm

---

## Virality Framework

### What makes astrology videos go viral on Indian social media:

1. **Personal relevance** — "Your Moon sign says THIS about you" (people share when they feel seen)
2. **Controversy/surprise** — "Your zodiac sign is WRONG — here's the real one" (Vedic vs Western hook)
3. **Timing** — post transit videos 2-3 weeks BEFORE the transit (people searching)
4. **Emotional hooks** — Sade Sati fear, Mangal Dosha marriage anxiety, Rahu Kaal warnings
5. **Festival content** — "Ganesh Chaturthi 2027 exact muhurta" posted 4 weeks before
6. **Listicles** — "Top 5 most powerful nakshatras" / "3 yogas that make you wealthy"
7. **Before/After** — "What happens when Jupiter enters YOUR sign"

### Viral video templates:

**"Did You Know" (Shorts)**
```
[Visual: Dramatic zoom on zodiac wheel]
[Text: "DID YOU KNOW?"]
[Narration: "Your Western zodiac sign... is probably WRONG."]
[Visual: Tropical vs Sidereal comparison animation]
[Narration: "Vedic astrology uses the sidereal zodiac — fixed to actual star positions. Western astrology drifted 24 degrees over 1,700 years. So if you're a Taurus in Western... you're likely an Aries in Vedic."]
[Text: "Check your REAL sign → link in bio"]
[Music: Building dramatic reveal]
```

**"Your Sign Says" Carousel (Reels)**
```
[Each sign gets 4-5 seconds]
[Visual: Rashi icon appears with glow]
[Text: "ARIES: The warrior. You lead, or you leave."]
[Quick transition to next sign]
[12 signs in 60 seconds]
[End: "Which one is you? Comment below 👇"]
```

**"Today's Panchang" Daily (Shorts)**
```
[Visual: Animated panchang card — our Instagram template]
[Narration: "Today is Shukla Chaturdashi. Tithi: auspicious. Nakshatra: Hasta — excellent for business. Watch out for Rahu Kaal from 10 to 11:30."]
[Music: Gentle morning raga]
[Text: "Full panchang → dekhopanchang.com"]
```

---

## Content Calendar (First 30 Days)

### Week 1: Foundation (5 Shorts + 1 Explainer)
| Day | Type | Topic | Platform |
|---|---|---|---|
| Mon | Short | "Your Vedic sign is different from Western" | YT Shorts, Reels |
| Tue | Short | "What is Rahu Kaal? 45 seconds" | YT Shorts, Reels |
| Wed | Short | "The 5 elements of Panchang" | YT Shorts, Reels |
| Thu | Explainer | "Introduction to Vedic Astrology — Why It's Different" (5 min) | YouTube |
| Fri | Short | "Pushya Nakshatra — best day for gold" | YT Shorts, Reels |
| Sat | Short | "Sade Sati — Saturn's 7.5 year test" | YT Shorts, Reels |

### Week 2: Kundali Series (5 Shorts + 1 Explainer)
| Day | Type | Topic |
|---|---|---|
| Mon | Short | "What is a Kundali? 30 seconds" |
| Tue | Short | "The 12 houses and what they mean" |
| Wed | Short | "Mangal Dosha — does Mars really affect marriage?" |
| Thu | Explainer | "How to Read Your Birth Chart" (7 min) |
| Fri | Short | "What your Ascendant reveals about you" |
| Sat | Short | "Yogas — when planets create magic" |

### Week 3: Transit Series (5 Shorts + 1 Explainer)
### Week 4: Festival/Muhurta Series (5 Shorts + 1 Explainer)

**Monthly total: 20 Shorts + 4 Explainers = 24 videos**
**Monthly cost: ~$30-40 (voiceover only)**

---

## Implementation Phases

### Phase 1: Manual Pilot (Week 1-2)
- Write 5 Short scripts manually from learn pages
- Generate voiceover with ElevenLabs
- Create visuals using Canva/Figma with our SVG icons
- Edit in CapCut (free)
- Post to YouTube Shorts + Instagram Reels
- **Measure: views, engagement, follower growth**
- **Goal: validate which topics get traction**

### Phase 2: Semi-Automated Pipeline (Week 3-6)
- Build Remotion project for automated visual generation
- Create reusable visual templates (zodiac wheel, chart, text overlay)
- Script generator: learn page → narration script (Claude API)
- Batch generate 5 Shorts per day
- **Goal: 50 Shorts + 10 Explainers published**

### Phase 3: Fully Automated Factory (Month 2+)
- API endpoint: `POST /api/video/generate { topic, type, language }`
- Automated daily panchang video (like our daily tweet but video)
- Automated transit prediction videos before major transits
- Festival countdown videos auto-generated 4 weeks before each festival
- **Goal: 1 video/day on autopilot**

---

## Revenue Model

1. **YouTube AdSense** — eligible after 1,000 subscribers + 4,000 watch hours
2. **YouTube Shorts Fund** — pays creators for popular Shorts
3. **Traffic to website** — every video drives panchang/kundali traffic → ad revenue on site
4. **Course sales (future)** — premium deep-dive courses on Udemy/own platform
5. **Sponsored content (future)** — astrology app promotions, gemstone sellers

---

## Competitive Landscape

| Creator | Content | Weakness |
|---|---|---|
| AstroSage TV | Generic predictions | No teaching, no system |
| Drik Panchang | Zero video content | No video at all |
| Random astrologers | Personal predictions | Not systematic, not verifiable |
| **Dekho Panchang** | **Systematic Jyotish education** | **No competition in this space** |

We would be the FIRST to offer systematic, visually stunning Vedic astrology education on video. No one else is doing this.

---

## Music & Sound Design

### Royalty-free sources:
- **Pixabay Music** — free, no attribution needed
- **YouTube Audio Library** — free for YouTube videos
- **Uppbeat** — free tier with attribution
- **Artlist** — $16/mo unlimited (for scaling)

### Sound categories needed:
1. **Intro jingle** — 3-5 second branded sound (sitar + bell + "Dekho Panchang")
2. **Background ambient** — soft drone for narration sections
3. **Transition swoosh** — for scene changes
4. **Reveal hit** — dramatic moment when showing a key insight
5. **Outro** — gentle wind-down with CTA

### Genre mapping:
- Panchang/daily: Morning raga (Bhairav/Bilawal)
- Kundali/charts: Evening raga (Yaman/Durga)
- Doshas: Dramatic (Malkauns — night raga associated with intensity)
- Festivals: Celebratory (Kedar/Des — associated with joy)
- Meditation/mantras: Peaceful (Bhimpalasi — afternoon serenity)

---

## KPIs

| Metric | Month 1 Target | Month 3 Target | Month 6 Target |
|---|---|---|---|
| Shorts published | 20 | 100 | 300 |
| Explainers published | 4 | 20 | 50 |
| YouTube subscribers | 500 | 5,000 | 25,000 |
| Total views | 50,000 | 500,000 | 2,000,000 |
| Website traffic from video | 500 visits | 5,000 visits | 20,000 visits |
| YouTube monetization | Not eligible | Eligible (1K subs) | $100-500/mo |

---

## Next Steps

1. **Validate:** Create 3 Shorts manually this week, post to YouTube/Instagram, measure engagement
2. **Voice:** Set up ElevenLabs account, test Hindi + English voices, pick the one that sounds like a knowledgeable pandit
3. **Visuals:** Create 5 reusable Remotion templates (zodiac wheel, chart reveal, text-on-screen, sign carousel, before/after)
4. **Music:** Curate 10 background tracks (2 per category)
5. **Script:** Write first 10 Short scripts from our learn pages (the agent can help)

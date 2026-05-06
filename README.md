# Dekho Panchang — Vedic Astrology Platform

> The most comprehensive Vedic astrology web application. Swiss Ephemeris accuracy, 127+ learning modules, 36-rule classical muhurta engine, and 17,000+ pages across 10 languages.

**Live at [dekhopanchang.com](https://dekhopanchang.com)**

---

## What Is This?

A full-featured Vedic astrology (Jyotish) web application that performs all astronomical calculations locally — no external astrology APIs. Every planetary position, dasha period, yoga detection, and muhurta evaluation is computed from first principles using the Swiss Ephemeris engine (NASA JPL DE441 precision).

**Core capabilities:**
- Daily Panchang with 90+ fields, location-aware for any city on Earth
- Birth chart (Kundali) with 19 divisional charts, 15 dasha systems, 75+ yogas
- 36-rule classical muhurta engine with 5-tier cancellation hierarchy for 20 activity types
- Ashta Kuta (36-point) compatibility matching
- 127+ learning modules covering all of Jyotish Shastra
- 21 individual graha + rashi deep-dive reference pages
- AI-powered chart interpretation (Claude integration)
- 10 languages: English, Hindi, Tamil, Telugu, Bengali, Kannada, Marathi, Gujarati, Maithili, Sanskrit
- PWA with offline support, daily panchang email notifications

---

## Architecture

```
BROWSER (Client)
  Next.js 16 App Router | React 19 | Tailwind CSS v4
  Framer Motion | D3.js Charts | Zustand State
                    |
                 API Routes (14)
                    |
SERVER (Node.js on Vercel)
  Swiss Ephemeris (sweph) ── 0.0000° accuracy
  Meeus Algorithms ──────── fallback engine
  Claude API (optional) ─── Chart chat, horoscope
                    |
  CALCULATION ENGINE (~35,000 LOC)
    astronomical.ts ── Swiss Eph wrapper + Meeus fallback
    panchang-calc.ts ── Tithi, Nakshatra, Yoga, Karana
    kundali-calc.ts ── Charts, Dashas, Yogas, Avasthas
    jaimini-calc.ts ── Chara Karakas, Arudhas, Argala
    shadbala.ts ── 6-fold planetary strength
    yogas-complete.ts ── 75+ yoga detection
    muhurta engine/ ── 36-rule constraint system
    tippanni-engine.ts ── Interpretive commentary
                    |
  SUPABASE (PostgreSQL + Auth)
    User profiles | Saved charts | RLS policies
```

### Key Design Principles

1. **Swiss Ephemeris primary, Meeus fallback** — Sub-arcsecond when sweph installed, graceful degradation otherwise
2. **All computation server-side** — No external astrology API calls
3. **Classical constraint-based** — Muhurta engine rejects on fatal flaws first, then scores
4. **10-locale i18n** — next-intl with per-locale message files and Indic script fonts

---

## Muhurta Engine (36-Rule Classical Constraint System)

The muhurta engine is the most architecturally significant subsystem. Unlike scoring-only systems that average positives and negatives, it follows classical logic: **reject on fatal flaws first, then score the rest**.

```
INPUT: Activity + Date range + Location + (optional) Birth data
  ↓
LAYER 1: Period vetoes (Tier 0)
  Venus/Jupiter combustion, Adhika Masa, Chaturmas, Kharmas
  → If any fire: ENTIRE DAY REJECTED
  ↓
LAYER 2: Window evaluation (36 rules across 9 categories)
  Panchanga (8 rules): tithi, nakshatra, yoga, karana, vara, panchaka, dagdha tithi, gandanta
  Kaala (7): hora, choghadiya, abhijit, rahu kaal, yamaganda, gulika, dur muhurtam, varjyam
  Lagna (5): sign quality, navamsha shuddhi, benefics in ascendant, 8th house, krishna adjustment
  Graha (2): transit strength, pushkar navamsha/bhaga
  Special (3): sarvartha siddhi, amrit siddhi, godhuli lagna
  Personal (3): tara bala (3-cycle), chandra bala, dasha harmony
  Periods (6): combustion, adhika masa, chaturmas, kharmas, dakshinayana, shishutva
  Gandanthara (1): tithi junction dosha
  Varjyam (1): nakshatra-specific poison window
  ↓
LAYER 3: 5-tier cancellation hierarchy
  Tier 0: Absolute veto (nothing cancels)
  Tier 1: Supreme positive (Godhuli) — cancels everything except Tier 0
  Tier 2: Strong (lagna, abhijit) — cancels Tier 4
  Tier 3: Standard (most panchanga factors)
  Tier 4: Cancellable negatives (rahu kaal, weak vara)
  ↓
SCORE CAP: Inauspicious yoga limits maximum score regardless of other factors
  Hard inauspicious (Ganda/Vyatipata/Vaidhriti): max 55 (Fair)
  Moderate inauspicious: max 70 (Good)
  ↓
OUTPUT: 0-100 score + grade + pandit-style reasoning with classical citations
```

20 activity types with classically verified nakshatra whitelists (not permissive "everything not forbidden" lists). Each activity's allowed nakshatras are sourced from Muhurta Chintamani, B.V. Raman, and Jyotirnibandha.

---

## Swiss Ephemeris Accuracy

| Planet | Meeus Error | Swiss Eph Error | Improvement |
|--------|------------|-----------------|-------------|
| Sun | 0.21° avg | 0.0000° | Perfect |
| Moon | 2.78° avg, 13° max | 0.0001° | 27,800x |
| Mars | 22.63° (broken) | 0.0000° | Was broken, now perfect |
| Jupiter | 8.24° (broken) | 0.0000° | Was broken, now perfect |
| Saturn | 3.19° (broken) | 0.0000° | Was broken, now perfect |
| Tithi match | 80% | 100% | Perfect |

---

## Kundali Analysis — 18 Tabs

| Tab | Contents |
|-----|----------|
| Chart | North/South Indian, Navamsha, Bhav Chalit, 19 divisional charts |
| Planets | Graha details, Upagrahas, Pushkara, Mrityu Bhaga |
| Dasha | 15 systems: Vimshottari, Yogini, Ashtottari, Chara, Narayana, Kalachakra + 9 more |
| Ashtakavarga | BPI (7 planets × 12 signs) + SAV heat map |
| Tippanni | Personality, yogas, doshas, life areas, dasha insight, year predictions |
| Jaimini | Chara Karakas, Karakamsha, Arudhas, Argala, Chara Dasha, Rashi Drishti |
| Yogas | 75+ detection with strength ratings |
| Shadbala | 6-fold: Sthana, Dig, Kala, Cheshta, Naisargika, Drik |
| Bhavabala | House strength with component breakdown |
| Avasthas | 5 systems: Baladi, Jagradadi, Deeptadi, Lajjitadi, Shayanadi |
| Sade Sati | Phase breakdown, intensity chart, all cycles |
| Life Timeline | 90-year synthesis on scrollable canvas |
| Chat | AI chat about the chart using Claude |

---

## Content & Pages

17,000+ pages generated across 10 locales:

| Section | Description |
|---------|-------------|
| Core tools | Panchang, Kundali, Matching, Muhurta AI |
| Learn (127+ modules) | Foundations through advanced Jyotish, interactive quizzes |
| Individual references | 9 Graha pages (Surya-Ketu) + 12 Rashi pages (Mesha-Meena) + 7 Yoga pages |
| Calendars (6) | Festival, Transit, Retrograde, Eclipse, Muhurat, Lunar |
| Specialized tools (12) | Sign Calculator, Sade Sati, Prashna, Baby Names, Varshaphal, KP System, etc. |
| City panchang (250+) | Location-specific timings for cities worldwide |
| Horoscope | Daily/weekly/monthly for all 12 rashis |
| Devotional | Puja vidhi, Sankalpa, Rudraksha guide |

---

## SEO

Comprehensive SEO implementation documented in [`docs/SEO-GUIDE.md`](docs/SEO-GUIDE.md):

- 241 PAGE_META entries with multilingual titles/descriptions
- 11 JSON-LD schema types (Organization, WebSite, Article, FAQPage, Event, HowTo, etc.)
- 30 dynamic OpenGraph images
- 89 FAQ questions across 30 routes
- 20,000+ URL sitemap with full hreflang
- Cross-linking system (tool↔learn bidirectional)
- AI crawler management (llms.txt + selective robots.txt)
- AdSense integration with Consent Mode v2

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Charts**: D3.js + custom SVG
- **Animation**: Framer Motion
- **Ephemeris**: Swiss Ephemeris via sweph (AGPL-3.0)
- **AI**: Anthropic Claude API (optional)
- **Auth/DB**: Supabase (PostgreSQL + RLS)
- **Payments**: Stripe (USD) + Razorpay (INR)
- **Email**: Resend (transactional + daily panchang)
- **i18n**: next-intl (10 locales)
- **Validation**: Zod
- **Tests**: 3,000+ tests across 128 suites
- **Deployment**: Vercel (auto-deploy from main)
- **PWA**: Service worker with CacheFirst/SWR/NetworkFirst

---

## Getting Started

### Installation

```bash
git clone https://github.com/krazykrackpot/panchang.git
cd panchang
npm install
npm install sweph  # Swiss Ephemeris (recommended for production accuracy)
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
# Required for auth + saved charts
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional: AI features
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Payments
STRIPE_SECRET_KEY=sk_...
RAZORPAY_KEY_ID=rzp_...

# Optional: Email
RESEND_API_KEY=re_...
```

### Development

```bash
npx next dev --turbopack    # Fast dev (may loop on large projects)
npx next dev                # Webpack fallback if Turbopack loops
```

### Build & Test

```bash
npx tsc --noEmit -p tsconfig.build-check.json   # Type check
npx vitest run                                    # 3,000+ tests
npx next build                                    # Production build (17,000+ pages)
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [`docs/SEO-GUIDE.md`](docs/SEO-GUIDE.md) | Complete SEO reference (18 sections) |
| [`docs/muhurta-nakshatra-audit.md`](docs/muhurta-nakshatra-audit.md) | Classical nakshatra audit for 20 activities |
| [`CLAUDE.md`](CLAUDE.md) | AI coding assistant instructions + lessons learned |

---

## License

AGPL-3.0 (due to Swiss Ephemeris sweph dependency).

Swiss Ephemeris is copyright Astrodienst AG.
All calculation engine, UI, and educational content is original work.

---

*Built with precision, guided by tradition.*

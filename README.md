# Jyotish Panchang — Vedic Astrology Platform

> The most comprehensive open-source Vedic astrology web application. Swiss Ephemeris accuracy, 50-module learning curriculum, AI-powered chart interpretation, and 612 pages across 3 languages.

---

## What Is This?

A full-featured Vedic astrology (Jyotish) web application that performs all astronomical calculations locally — no external astrology APIs. Every planetary position, dasha period, yoga detection, and chart analysis is computed from first principles using the Swiss Ephemeris engine (NASA JPL DE431 precision).

**Live features:**
- Daily Panchang with 90+ fields, location-aware
- Birth chart (Kundali) generation with 19 divisional charts (D1-D60)
- 75+ yoga detection, 15 dasha systems, 5 avastha systems
- Life Timeline — 90-year synthesis of all kundali elements on one scrollable canvas
- AI-powered chart chat (Claude integration)
- 50-module interactive learning curriculum with quizzes
- Trilingual: English, Hindi, Sanskrit

---

## Architecture

```
BROWSER (Client)
  Next.js 16 App Router | React 19 | Tailwind CSS v4
  Framer Motion | D3.js Charts | Zustand State
                    |
                 API Routes
                    |
SERVER (Node.js)
  Swiss Ephemeris (sweph npm) ── 0.0000° accuracy
  Meeus Algorithms ──────────── fallback
  Claude API (optional) ─────── Chart chat, horoscope
                    |
  CALCULATION ENGINE (~30,000 LOC)
    astronomical.ts ── Swiss Eph wrapper + Meeus
    panchang-calc.ts ── Tithi, Nakshatra, Yoga, Karana
    kundali-calc.ts ── Charts, Dashas, Yogas, Avasthas
    jaimini-calc.ts ── Chara Karakas, Arudhas, Argala, Rashi Drishti
    shadbala.ts ── 6-fold planetary strength
    yogas-complete.ts ── 75+ yoga detection engine
    graha-yuddha.ts ── Planetary war detection
    tippanni-engine.ts ── AI commentary synthesis
                    |
  SUPABASE (optional)
    Auth | Saved Charts | Classical Text Vectors (RAG)
```

### Key Design Principles

1. **Swiss Ephemeris primary, Meeus fallback** — Sub-arcsecond accuracy when sweph is installed, graceful degradation otherwise
2. **All computation server-side** — No external astrology API calls
3. **Progressive enhancement** — Core features work without Claude API or Supabase
4. **Trilingual from day one** — Every user-facing string in EN/HI/SA

---

## Swiss Ephemeris Integration

### Why Swiss Ephemeris?

We validated our original Meeus-based engine against Swiss Ephemeris (NASA JPL DE431) and found critical accuracy gaps:

| Planet | Meeus Error | Swiss Eph Error | Improvement |
|--------|------------|-----------------|-------------|
| Sun | avg 0.21 degrees | 0.0000 degrees | Perfect |
| Moon | avg 2.78 degrees, max 13 degrees | 0.0001 degrees | 27,800x |
| Mars | avg 22.63 degrees (BROKEN) | 0.0000 degrees | Was broken, now perfect |
| Jupiter | avg 8.24 degrees (BROKEN) | 0.0000 degrees | Was broken, now perfect |
| Saturn | avg 3.19 degrees (BROKEN) | 0.0000 degrees | Was broken, now perfect |
| Ayanamsha | avg 0.004 degrees | 0.0000 degrees (exact) | Perfect |
| Tithi match | 80% | 100% | Perfect |

Mars, Jupiter, and Saturn were fundamentally broken with Meeus — producing wrong signs in 30-40% of charts.

### How It Works

Every astronomical function follows the pattern: Swiss Ephemeris primary, Meeus fallback:
- sunLongitude() — Swiss Eph primary, Meeus fallback
- moonLongitude() — Swiss Eph primary, Meeus fallback
- lahiriAyanamsha() — Swiss Eph primary, polynomial fallback
- getPlanetaryPositions() — Swiss Eph for all 9 planets
- approximateSunrise() — Swiss Eph Sun declination, Meeus fallback

Install sweph for production: npm install sweph

---

## Calculation Engine

### Panchang (Daily Calendar)

90+ fields including all 5 Pancha Anga elements (Tithi, Nakshatra, Yoga, Karana, Vara).
All transitions computed via binary search with 30 iterations for sub-second precision.

### Kundali (Birth Chart) — 18 Analysis Tabs

| Tab | Contents |
|-----|----------|
| Chart | North/South Indian chart, Navamsha, Bhav Chalit |
| Planets | Graha details, Upagrahas, Pushkara, Mrityu Bhaga |
| Dasha | 15 systems: Vimshottari, Yogini, Ashtottari, Chara, Narayana, Kalachakra, Shoola, Sthira, Sudarsana + 6 more |
| Ashtakavarga | Bhinnashtakavarga (7 planets × 12 signs) + Sarvashtakavarga |
| Tippanni | AI synthesis: personality, yogas, doshas, life areas, dasha insight, year predictions |
| Varga Charts | 19 divisional charts D1–D60 with meanings |
| Jaimini | Chara Karakas, Karakamsha, Bhava Arudhas, Graha Arudhas, Argala, Chara Dasha, Rashi Drishti |
| Graha | Declination, right ascension, latitude, full positional detail |
| Yogas | 75+ yoga detection with strength ratings and interpretations |
| Shadbala | 6-fold strength: Sthana, Dig, Kala, Cheshta, Naisargika, Drik |
| Bhavabala | House strength: Bhavadhipati, Dig, Drishti, Graha Sambandha |
| Avasthas | 5 avastha systems: Baladi, Jagradadi, Deeptadi, Lajjitadi, Shayanadi |
| Argala | Interventions and obstruction analysis for all houses |
| Sphutas | 8 sensitive points: Prana, Deha, Mrityu, Tri, Yogi, Avayogi, Bija, Kshetra |
| Sade Sati | Saturn transit analysis with phase breakdown and intensity chart |
| Life Timeline | 90-year synthesis: all dashas, Sade Sati, Jupiter/Saturn transits, yoga activation, synthesis score |
| Patrika | Printable birth certificate with full chart |
| Chat | AI chat about the chart using Claude |

**Additional calculations:**
- 6 special lagnas (Hora, Ghati, Sree, Indu, Pranapada, Varnada)
- 4 house systems (Equal, Sripati, Whole Sign, Placidus)
- Graha Yuddha (planetary war) detection
- Vimshopaka Bala (20-point divisional strength)

### Specialized Systems

- **KP (Krishnamurti)** — Placidus cusps, sub-lords, significators, ruling planets
- **Varshaphal (Tajika)** — Solar return, Muntha, Sahams, Tajika aspects, Mudda Dasha
- **Prashna (Horary)** — Ashtamangala, horary analysis, question classification
- **Matching** — Ashta Kuta (36 points), Manglik check, Nadi Dosha
- **Muhurta AI** — Multi-factor electional scoring for 20 activity types
- **Sade Sati Calculator** — Standalone tool with historical and future cycles

---

## Pages

204 locale pages × 3 languages = 612 total pages:

| Section | Pages | Description |
|---------|-------|-------------|
| Core | Home, Panchang, Kundali, Matching, About | Primary features |
| Deep Dives | Tithi, Nakshatra, Yoga, Karana, Muhurta, Eclipse, Rashi, Masa, Samvatsara | Element-level content |
| Learn | 9 curriculum areas | Foundations through advanced |
| Calendars | Festival, Transit, Retrograde, Eclipse, Muhurat, Regional | 6 calendar views |
| Tools | Sign Calculator, Sade Sati, Prashna, Baby Names, Shraddha, Vedic Time, Upagraha, Devotional, Varshaphal, KP System, Ashtamangala Prashna, Muhurta AI | 12 specialized tools |
| Specialized | Horoscope, Kaal Nirnaya, Nivas Shool, Sankalpa, Puja | Classical practices |

---

## Tech Stack

- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Charts**: D3.js + custom SVG
- **Animation**: Framer Motion
- **Ephemeris**: Swiss Ephemeris via sweph npm (AGPL-3.0)
- **AI**: Anthropic Claude API (optional)
- **Auth/DB**: Supabase (optional)
- **Payments**: Stripe + Razorpay
- **Email**: Resend
- **i18n**: next-intl (EN/HI/SA)
- **Validation**: Zod
- **Tests**: 886 tests across 21 suites

---

## Getting Started

### Installation

```
git clone https://github.com/krazykrackpot/panchang.git
cd panchang
npm install
npm install sweph  # For Swiss Ephemeris accuracy (recommended)
```

### Environment Variables

Copy .env.example to .env.local:

```
# Optional: AI features
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Database + Auth
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# Optional: Payments
STRIPE_SECRET_KEY=sk_...
RAZORPAY_KEY_ID=rzp_...
```

### Development

```
npm run dev    # Start at http://localhost:3000
```

### Build

```
npx next build  # 612 pages across 3 locales
```

### Tests

```
npx vitest run                          # 886 tests across 21 suites
npx vitest run src/lib/__tests__/       # Core calculation suites
python3 scripts/validate-against-pyjhora.py  # Swiss Eph validation
```

---

## Documentation

| Document | Description |
|----------|-------------|
| docs/ROADMAP.md | Product roadmap |
| docs/JHORA_PARITY_GAPS.md | Detailed JHora feature comparison |
| docs/LLM_FEATURES_DESIGN.md | AI feature architecture |
| docs/LEARN_GAMIFICATION_DESIGN.md | Modular learning system design |
| docs/LEARN_CONTENT_PLAN.md | 50-module curriculum content plan |

---

## License

AGPL-3.0 (due to Swiss Ephemeris sweph dependency).

Swiss Ephemeris is copyright Astrodienst AG.
All calculation engine, UI, and educational content is original work.

---

Built with precision, guided by tradition.

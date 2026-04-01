# Jyotish Panchang — Vedic Astrology Platform

> The most comprehensive open-source Vedic astrology web application. Swiss Ephemeris accuracy, 50-module learning curriculum, AI-powered chart interpretation, and 363 pages across 3 languages.

---

## What Is This?

A full-featured Vedic astrology (Jyotish) web application that performs all astronomical calculations locally — no external astrology APIs. Every planetary position, dasha period, yoga detection, and chart analysis is computed from first principles using the Swiss Ephemeris engine (NASA JPL DE431 precision).

**Live features:**
- Daily Panchang with 90+ fields, location-aware
- Birth chart (Kundali) generation with 19 divisional charts (D1-D60)
- 75+ yoga detection, 15 dasha systems, 5 avastha systems
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
  CALCULATION ENGINE (~25,000 LOC)
    astronomical.ts ── Swiss Eph wrapper + Meeus
    panchang-calc.ts ── Tithi, Nakshatra, Yoga, Karana
    kundali-calc.ts ── Charts, Dashas, Yogas, Avasthas
    jaimini-calc.ts ── Chara Karakas, Arudhas, Argala
    shadbala.ts ── 6-fold planetary strength
    yogas-complete.ts ── 75+ yoga detection engine
    varga-tippanni.ts ── Per-chart AI commentary
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

### Kundali (Birth Chart)

- 19 divisional charts (D1 through D60 + Bhav Chalit)
- 15 dasha systems (Vimshottari, Yogini, Ashtottari, Chara, Narayana, Kalachakra, Shoola, Sthira, Sudarsana + 6 more)
- 75+ yogas (Raja, Dhana, Mahapurusha, Nabhasa, Sankhya, Parivartana, Chandra, Surya, Graha Malika, Arishta + more)
- 5 Avastha systems (Baladi, Jagradadi, Deeptadi, Lajjitadi, Shayanadi)
- 3 strength systems (Shadbala 6-fold, Bhavabala, Vimshopaka)
- 8 Sphuta sensitive points (Prana, Deha, Mrityu, Tri, Yogi, Avayogi, Bija, Kshetra)
- 6 special lagnas (Hora, Ghati, Sree, Indu, Pranapada, Varnada)
- 4 house systems (Equal, Sripati, Whole Sign, Placidus)
- Full Jaimini system (Chara Karakas, Karakamsha, Bhava Arudhas, Graha Arudhas, Argala, Chara Dasha)

### Specialized Systems

- KP (Krishnamurti) — Placidus cusps, sub-lords, significators, ruling planets
- Varshaphal (Tajika) — Solar return, Muntha, Sahams, Tajika aspects, Mudda Dasha
- Prashna (Horary) — Ashtamangala, horary analysis, question classification
- Matching — Ashta Kuta (36 points), Manglik check, Nadi Dosha

---

## Tech Stack

- Framework: Next.js 16 (App Router, React 19, TypeScript)
- Styling: Tailwind CSS v4
- State: Zustand
- Charts: D3.js + custom SVG
- Animation: Framer Motion
- Ephemeris: Swiss Ephemeris via sweph npm (AGPL-3.0)
- AI: Anthropic Claude API (optional)
- Database: Supabase (optional)
- i18n: next-intl (EN/HI/SA)
- Validation: Zod
- PDF: jsPDF
- Tests: 105 tests across 4 suites

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

# Optional: Database
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Development

```
npm run dev    # Start at http://localhost:3000
```

### Build

```
npx next build  # 363 pages across 3 locales
```

### Tests

```
npx tsx src/lib/ephem/__tests__/astronomical.test.ts    # 24 tests
npx tsx src/lib/ephem/__tests__/panchang-calc.test.ts   # 39 tests
python3 scripts/validate-against-pyjhora.py             # Swiss Eph validation
```

---

## Documentation

| Document | Description |
|----------|-------------|
| docs/ROADMAP.md | Product roadmap with 10 phases |
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

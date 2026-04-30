# Dekho Panchang — Master Product Roadmap

**Last updated:** 2026-04-30 — ROADMAP COMPLETE. Only manual actions and infrastructure decisions remain.
**Reference:** See `docs/CLASSICAL_JYOTISH_GAP_ANALYSIS.md` for full classical text analysis.

---

## ✅ Completed — Everything Shipped

### Platform Core
- [x] Daily Panchang — location-aware, 90+ fields, DST-safe
- [x] Kundali generator — 19 divisional charts, 18 tabs
- [x] 10-page PDF export
- [x] 7-locale support (EN / HI / TA / TE / BN / GU / KN) — 600+ pages
- [x] Global location store — auto-detect, no Delhi fallback
- [x] Timezone handling — IANA per-date with DST awareness + India WWII correction
- [x] Life Timeline — 90-year synthesis of all kundali elements
- [x] ELI5 Panel — plain-language kundali explanations (eli5-engine.ts + ELI5Panel.tsx)

### Calculations (Comprehensive)
- [x] Shadbala (6 components + Ishta/Kashta), Bhava Bala, Vimshopaka Bala
- [x] 127 yoga detections (Raja, Dhana, Daridra, Parivartana, Nabhasa, etc.)
- [x] 22 dasha systems (Vimshottari 3-level, Yogini, Narayana, Kalachakra, Shoola, Sthira, KP, etc.)
- [x] Jaimini system — Chara Karakas, Karakamsha, Arudha Padas, Chara Dasha, Graha Arudhas, Rashi Drishti, Swamsha profiles
- [x] Avasthas — 50+ planetary states (Baladi, Varna, Raja-Rajya, Naisargika, etc.)
- [x] Argala, Sphutas, Ashtakavarga (7-planet bindu + SAV), Special Lagnas
- [x] KP System — Placidus houses, sub-lords, sub-sub lords, significators, cuspal analysis
- [x] Varshaphal — Tajika aspects (full 7-yoga system), Muntha, Sahams, Mudda Dasha
- [x] Prashna Horary — 8 categories + Ashtamangala Prashna
- [x] Sade Sati (full cycle + sub-phases), Graha Yuddha, Badhak/Maraka planets
- [x] Sudarshana Chakra, Bhrigu Chakra Paddhati, Mesha Sankranti
- [x] Pancha Pakshi Shastra, Jupiter Vedha, Longevity (Pindayu + Amsayu)
- [x] Bhava Chalit Chart — Sripati system with planet shifting
- [x] Shoola Dasha + Brahma/Rudra/Maheshwara lords
- [x] Narayana Dasha with sign-level interpretations
- [x] Drekkana (D3) 36 faces with interpretation
- [x] Birth Time Rectification engine (candidate generator + event matcher + scorer)

### Classical Quick Wins (All 14 complete)
- [x] Vargottama, Dasha Sandhi, Kala Sarpa 12 types, Dagdha Tithi, Visha Ghatika
- [x] Amrit Siddhi Yoga, Panchanga Shuddhi, Tarabala, Chandra Bala, Bhrigu Bindu
- [x] Ithasala & Ishrafa, Ashtama Shani, Mrityu Bhaga, Pushkar Navamsha/Bhaga

### Tippanni (Interpretation Engine)
- [x] Planet-in-sign (108), Planet-in-house (108), 127 yoga interpretations
- [x] Dosha analysis (Manglik, Nadi, Kala Sarpa), Dasha synthesis, Year predictions
- [x] Life areas (Career, Wealth, Marriage, Health, Education), Shadbala synthesis
- [x] Varga tippanni, Convergence engine with transit overlay

### Panchang
- [x] 5 Panchangas with transition times, Rahu Kaal/Yamaganda/Gulika
- [x] All muhurta windows (Abhijit, Brahma, Godhuli, Sandhya, Nishita, Chandrodaya)
- [x] Hora, Choghadiya, Disha Shool, Muhurta completeness checks
- [x] 6 Special Panchang Yogas — Dwipushkar, Tripushkar, Sarvartha Siddhi, Amrit Siddhi, Ravi Yoga, Guru Pushya
- [x] Daily article generation per city (deterministic prose, not LLM)
- [x] Calculation Proof toggle on interactive + city + festival pages
- [x] Locale-aware card reordering (Tamil: nakshatra-first, Hindi: choghadiya-first)

### Muhurta
- [x] 20-activity muhurta finder with Panchanga element checks
- [x] Muhurta AI scanner — 30-day scanning with ranked results
- [x] Month Heatmap (color-coded grid, MonthHeatmap.tsx + MobileMonthView.tsx)
- [x] Chandrodaya rule — moonrise case in getKalaWindow (Karwa Chauth, Sankashti Chaturthi)
- [x] Tara Bala + Chandra Bala + Lagna integration

### Matching
- [x] 36-point Ashta Kuta Guna Milan (North Indian)
- [x] 10-point Dashakoota (South Indian) — dasha-koota.ts + matching page tab toggle
- [x] Mangal Dosha, Nadi Dosha, Rajju Dosha warnings

### Calendar & Festivals
- [x] Festival calendar — 100+ festivals with puja muhurtas
- [x] Smarta vs Vaishnava divergence tooltips on festival pages
- [x] ICS export, Eclipse predictions, Retrograde/combustion calendar, Transit calendar
- [x] Kala-Vyapti system — 9 muhurta rules (including chandrodaya)
- [x] Astronomical Adhika detection, Makar Sankranti, Varjyam corrections

### Puja Vidhi
- [x] 44+ puja vidhis (festivals + vrats + graha shanti)
- [x] Graha Shanti Puja Vidhi — all 9 planets with samagri, mantras, vidhi steps, phala
- [x] Affliction detector — maps kundali afflictions to specific graha shanti remedies
- [x] Contextual Remedy Engine — affliction → multi-remedy protocols

### Auth, Personalization & Monetization
- [x] Google OAuth + Supabase, onboarding, saved charts
- [x] Dashboard — day quality, current dasha, transit alerts, morning briefing, week ahead
- [x] Astrological Journal — mood/energy logging, pattern engine, life events, prediction tracking
- [x] Notification system with daily cron + email (Resend, 4 templates)
- [x] 3-tier subscription (Stripe LIVE), settings page

### Learn
- [x] 106+ module structured course (Phases 0–12)
- [x] Interactive labs (Dasha, KP, Moon, Panchang, Shadbala, Yoga Animator)
- [x] Smarta & Vaishnava systems (learn page + module 27-3)
- [x] Planet-in-House SEO pages (84 URLs with BPHS verses)
- [x] Nakshatra Pada Analysis (108 profiles, dedicated pages)
- [x] Deep-dive pages — Nakshatras, Ayanamsha, Planetary Cycles, Bhava Chalit, etc.

### SEO & Growth
- [x] Cross-link infrastructure — RelatedLinks component, 35+ tool↔learn mappings
- [x] VS comparison page (/vs/drik-panchang)
- [x] Schema.org — Organization, Article, FAQ, HowTo, Event, Expertise signals on dosha pages
- [x] Festival × City × Year programmatic SEO (3,000+ URLs)
- [x] IndexNow daily URL submission, OG images, hreflang verification

### PWA & Infrastructure
- [x] Service worker (sw.js v4, multi-strategy caching)
- [x] Manifest with shortcuts, icons, screenshots
- [x] Push notifications (send-push.ts + PushPermission.tsx)
- [x] Edge caching (~90% CPU reduction)
- [x] Swiss Ephemeris integration (sweph@2.10.3)

### Test Coverage
- [x] 3000+ tests across 123 suites
- [x] Prokerala/Shubh validation, kundali accuracy across 3 locations

---

## ✅ Remaining Items — All Complete (Apr 30, 2026)

### Content Depth
- [x] **Pushkar Navamsha detailed interpretation** — 9 planet-specific profiles in pushkar-bhaga.ts + varga-narrative.ts
- [x] **Swamsha profiles expansion** — 84 planet-in-sign modifiers (7 planets × 12 signs) per Jaimini Sutras
- [x] **CM-4: Inline constant cleanup** — RASHI_NAMES in additional-dashas.ts replaced with canonical RASHIS import

### Product Features
- [x] **Muhurta Panchanga Annual View** — /muhurta-ai/annual, 12-month color-coded grid, 8 activity types, year nav
- [ ] **Astrologer Marketplace** — verified profiles, booking, reviews. Significant ops work. Low priority / future.
- ~~**Razorpay**~~ — Parked. Not India-registered yet.

### P3 — Academic / Completeness
- [x] **Sookshma Dasha (Level 4) + Prana Dasha (Level 5)** — recursive calculateSubPeriods() in dasha.ts, depth 5, >1 day threshold
- [x] **Panchavargeya Bala** — panchavargeya-bala.ts, 5-chart dignity score with friendship multipliers
- [x] **Planetary physique descriptions** — planetary-physique.ts, BPHS Ch.3 body characteristics (9 planets, en/hi)
- [x] **Jupiter-Saturn conjunction world-era analysis** — great-conjunctions.ts (1800-2100) + /mundane page
- [x] **Classical text search** — full RAG pipeline (embeddings, retriever, synthesizer) + /learn/library + /learn/classical-texts

---

## 🏆 Competitive Gap Tracker

**Jagannatha Hora (JHora):** Free desktop app, 40+ dasha systems, 184 yogas, research-grade calculations.
**Parashara's Light (PL):** $300–700 desktop, 1000+ yogas, 4 searchable classical texts, professional reports.

| Feature | JHora | PL | Dekho Panchang |
|---------|-------|----|----------------|
| Web-based, zero install | ✗ | ✗ | ✅ |
| Mobile-first design | ✗ | ✗ | ✅ |
| LLM chart chat | ✗ | ✗ | ✅ |
| 7+ languages | Partial | Partial | ✅ (7 locales) |
| Divisional charts | ✅ | ✅ | ✅ (19) |
| Vimshottari Dasha | ✅ | ✅ | ✅ |
| Dasha systems | 40+ | 30+ | 22 |
| Yoga detection | 184 | 1000+ | 127 |
| Shadbala | ✅ | ✅ | ✅ |
| Sudarshana Chakra | ✅ | ✅ | ✅ |
| Jaimini (full) | ✅ | ✅ | ✅ |
| Muhurta (full) | ✅ | ✅ | ✅ |
| Pancha Pakshi | ✅ | ✗ | ✅ |
| Life Timeline synthesis | ✗ | ✗ | ✅ |
| Email digest | ✗ | ✗ | ✅ |
| Kundali comparison | ✗ | ✅ | ✅ |
| Birth time rectification | ✅ | ✅ | ✅ |
| Subscription model | ✗ | ✗ | ✅ |
| Location auto-detect | ✗ | ✗ | ✅ |
| Festival calendar | ✗ | ✗ | ✅ |
| PDF export | ✗ | ✅ | ✅ |
| Astrological Journal | ✗ | ✗ | ✅ |
| PWA (installable) | ✗ | ✗ | ✅ |
| ELI5 Mode | ✗ | ✗ | ✅ |
| Graha Shanti Puja Vidhi | ✗ | ✗ | ✅ (9 planets) |

---

## Manual Actions (Non-Code)

- [ ] Create Twitter/X account @dekhopanchang → add API keys to env vars
- [ ] Create Instagram business account @dekhopanchang
- [ ] Create Facebook Page
- [ ] Create YouTube channel (authority signal)
- [ ] Submit to 6 directories (Google Business, Product Hunt, AlternativeTo, etc.)
- [ ] Reddit/Quora participation (genuine answers with links)
- [ ] Temple website outreach for backlink widgets

## Infrastructure Decisions (Pending)

- [ ] **Hetzner + Coolify migration** — decide after May 2026 CPU monitoring
- [ ] **GSC Performance review** — revisit ~2026-05-28 with 6 weeks of data
- [ ] **Native app** — NOT YET (wait for 10K MAU); PWA sufficient for now

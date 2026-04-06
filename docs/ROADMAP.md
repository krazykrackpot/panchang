# Dekho Panchang — Master Product Roadmap

**Last updated:** 2026-04-06
**Reference:** See `docs/CLASSICAL_JYOTISH_GAP_ANALYSIS.md` for full classical text analysis.

---

## ✅ Completed

### Platform Core
- [x] Daily Panchang — location-aware, 90+ fields, DST-safe
- [x] Kundali generator — 19 divisional charts, 18 tabs
- [x] 10-page PDF export
- [x] Trilingual support (EN / HI / SA) — 612 pages across 3 locales
- [x] Global location store — auto-detect, no Delhi fallback
- [x] Timezone handling — IANA per-date with DST awareness
- [x] Life Timeline — 90-year synthesis of all kundali elements

### Calculations Implemented
- [x] Shadbala — all 6 components + Ishta/Kashta Phala
- [x] Bhava Bala (house strength)
- [x] Vimshopaka Bala (20-point divisional strength)
- [x] 127 yoga detections (Raja, Dhana, Daridra, Parivartana, Nabhasa, etc.)
- [x] Vimshottari Dasha — Maha / Antar / Pratyantar (3 levels)
- [x] 21 additional dasha systems (Yogini, Narayana, Kalachakra, Shoola, Sthira, KP, etc.)
- [x] Jaimini system — Chara Karakas, Karakamsha, Arudha Padas A1–A12, Chara Dasha, Graha Arudhas, Rashi Drishti, Rajayogas
- [x] Avasthas — 50+ planetary states (Baladi, Varna, Raja-Rajya, Naisargika, Dina, Paksha, Tribhaga)
- [x] Argala & Virodha Argala
- [x] Sphutas (Prana, Deha, Mrityu, Tri, Yogi, Avayogi, Bija, Kshetra)
- [x] Ashtakavarga — 7-planet bindu grid + SAV full analysis
- [x] Special Lagnas — Hora, Ghati, Sree, Indu, Pranapada, Varnada
- [x] KP System — Placidus houses, sub-lords, significators, ruling planets
- [x] Varshaphal — solar return, Muntha, Varsheshvara, Sahams, Tajika aspects, Mudda Dasha, Ithasala/Ishrafa
- [x] Prashna Horary — 8 categories + Ashtamangala Prashna
- [x] Sade Sati — full 7.5-year cycle with sub-phases, Ashtama Shani detection
- [x] Graha Yuddha (Planetary War) detection
- [x] Functional Malefics/Benefics per Lagna (Laghu Parashari)
- [x] Badhak planet per Lagna
- [x] Maraka planet identification
- [x] Sudarshana Chakra (3-ring concentric chart)
- [x] Upapada Lagna full analysis (A12 vs A7 separated)
- [x] Bhrigu Chakra Paddhati (annual house activation)
- [x] Mesha Sankranti (annual solar ingress chart)
- [x] Transit activation of natal promise
- [x] Pancha Pakshi Shastra (5-bird system)
- [x] Jupiter Vedha in transits
- [x] Longevity — Pindayu + Amsayu
- [x] Nakshatra Veda pairs (compatibility)
- [x] Narayana Dasha interpretation
- [x] Hora Chart (D2) interpretation
- [x] Ganda Moola full procedure

### Classical Quick Wins (All 14 complete)
- [x] QW-1: Vargottama badge + tippanni reference
- [x] QW-2: Dasha Sandhi warning (±3 months at Mahadasha boundaries)
- [x] QW-3: Kala Sarpa sub-types (12 named types)
- [x] QW-4: Dagdha Tithi (7 burnt combinations)
- [x] QW-5: Visha Ghatika (poison period)
- [x] QW-6: Amrit Siddhi Yoga (7 supreme muhurtas)
- [x] QW-7: Panchanga Shuddhi Score (0–5 muhurta quality)
- [x] QW-8: Tarabala daily indicator
- [x] QW-9: Chandra Bala daily indicator
- [x] QW-10: Bhrigu Bindu (midpoint Rahu–Moon)
- [x] QW-11: Ithasala & Ishrafa in Varshaphal
- [x] QW-12: Saturn Ashtama Shani detection
- [x] QW-13: Mrityu Bhaga (dangerous degrees)
- [x] QW-14: Pushkar Navamsha + Pushkar Bhaga markers

### Tippanni (Interpretation Engine)
- [x] Planet-in-sign profiles (9 × 12 = 108)
- [x] Planet-in-house profiles (9 × 12 = 108)
- [x] Yoga interpretations (127 yogas with classical formation rules)
- [x] Dosha analysis (Manglik, Nadi, Kala Sarpa)
- [x] Dasha synthesis — current + next 3 periods
- [x] Year predictions — 12-month transit forecast
- [x] Life area readings — Career, Wealth, Marriage, Health, Education
- [x] Shadbala synthesis — dasha timeline, current period forecast, turning points
- [x] Varga tippanni — per-divisional-chart commentary

### Panchang
- [x] 5 Panchangas (Tithi, Nakshatra, Yoga, Karana, Vara) with precise transition times
- [x] Rahu Kaal, Yamaganda, Gulika Kaal
- [x] Abhijit Muhurta, Brahma Muhurta, Godhuli, Sandhya Kaal, Nishita Kaal
- [x] Hora (planetary hours), Choghadiya (8 day/night windows)
- [x] Disha Shool, Sarvartha Siddhi, Vijaya Muhurta, Dur Muhurtam, Ganda Moola flag
- [x] Kali Ahargana, Kaliyuga year, Panchaka flag, Shiva/Agni/Chandra/Rahu Vaas
- [x] Amrit Kalam, Varjyam, Anandadi Yoga, Ravi Yoga, Amrit Siddhi Yoga
- [x] Muhurta completeness — Tara Bala + Chandra Bala + Lagna check in muhurta finder

### Muhurta
- [x] 20-activity muhurta finder (Marriage, Griha Pravesh, Mundan, Vehicle, Travel, etc.)
- [x] Panchanga element checks per activity
- [x] Tara Bala + Chandra Bala integration

### Matching
- [x] 36-point Ashta Kuta Guna Milan (all 8 Kutas)
- [x] Mangal Dosha, Nadi Dosha warnings

### Calendar & Festivals
- [x] Festival calendar — 100+ festivals with puja muhurtas
- [x] ICS export (festivals, Ekadashi, Purnima, Amavasya)
- [x] Eclipse predictions — solar & lunar
- [x] Retrograde & combustion calendar
- [x] Transit calendar

### Auth, Personalisation & Monetization
- [x] Google OAuth + Supabase, onboarding, saved charts
- [x] Dashboard — day quality, current dasha, transit alerts
- [x] In-app notification system with daily cron
- [x] 3-tier subscription (Free / Pro / Jyotishi) — Stripe LIVE
- [x] Pricing page (INR / USD toggle)
- [x] PaywallGate + UpgradePrompt components
- [x] Settings page — profile CRUD, kundali recompute

### Learn
- [x] 80+ module structured course (Phases 0–5, Classical texts)
- [x] Interactive labs (Dasha, KP, Moon, Panchang, Shadbala)
- [x] Deep-dive pages — Nakshatras, Yogataras, Ayanamsha, Planetary Cycles

### Test Coverage
- [x] 886 tests across 21 suites
- [x] Drik Panchang validation — now tests Swiss Eph engine (computePanchang)
- [x] Kundali accuracy across 3 locations

---

## 🔴 NOW — High Impact, Medium Effort

These are the next three items in execution order.

### PROD-04: SEO + Structured Data ← START HERE
**Priority:** Critical | **Impact:** Organic discovery — 612 pages with zero JSON-LD

- JSON-LD per page type:
  - `HowTo` for puja vidhi pages
  - `Event` for festival pages
  - `FAQPage` for learn pages
  - `SoftwareApplication` on home
  - `BreadcrumbList` on all deep pages
- Dynamic OG images via `opengraph-image.tsx` (festival, chart, nakshatra — currently generic)
- `sitemap.xml` — update with all 612 pages, correct `changefreq` + `priority`
- Google Search Console setup instructions
- Core Web Vitals — ensure LCP < 2.5s, CLS < 0.1 on key pages
- Analytics events: `kundali_generated`, `chart_exported`, `subscription_started`, `tab_viewed`

### PROD-01: Email Notifications (Resend)
**Priority:** High | **Impact:** Retention — users who sign up but never return

**Transactional:**
- Welcome email with birth chart summary after signup
- Subscription confirmation / upgrade receipt

**Weekly Digest (Monday 6 AM, personalised):**
- Day quality forecast for the week (Tarabala + Chandra Bala per day)
- Current dasha period with one-paragraph interpretation
- Upcoming festivals with personal relevance
- 3 transit alerts for the week

**Event Alerts:**
- Dasha transition warning — 30 days before Antardasha change
- Sade Sati onset / phase change
- Festival reminders — 3 days before relevant festivals

**Technical:**
- `src/lib/email/templates/` — React Email templates
- `src/app/api/cron/weekly-digest/route.ts`
- `src/app/api/cron/email-alerts/route.ts`
- Unsubscribe per category via existing notification_prefs JSONB
- Rate limit: max 3 emails/user/week

### PROD-05: Kundali Comparison (Synastry)
**Priority:** Medium | **Impact:** Professional users, couples, parent–child

- Side-by-side D1 dual display (both charts rendered together)
- Planet position overlay — see where Person B's planets fall in Person A's chart
- Dasha compatibility matrix — whose dasha supports the relationship right now
- Composite chart midpoint analysis
- Compatibility score beyond Guna Milan (house overlays, nakshatra synastry)
- PDF comparison report

---

## 🟡 PARKED — High Impact, Low Effort
*Deferred to keep focus. Pick up after NOW items are shipped.*

- **JYOTISH-10: Nakshatra Pada Analysis** — 108 profiles (4 padas × 27 nakshatras). Pure content work, no new engine.
- **P2-04: Tajika Full 7-Yoga System** — Easarapha, Nakta, Yamaya, Manahoo, Khallasara, Dutthottha (Ithasala done). Varshaphal tab extension.
- **P2-05: KP Sub-sub Lords + Cuspal Analysis** — KP page exists but is shallow. Needs sub-sub lord table and cuspal significator depth.
- **P2-06: Swamsha (Karakamsha) Full Profile Library** — 50+ planetary combinations in D9 Karakamsha from Jaimini Sutras.
- ~~**PROD-03: Razorpay**~~ — Parked. Not India-registered yet.

---

## 🟠 MEDIUM PRIORITY — Remaining Classical Techniques

- **P2-02: Drekkana (D3) Detailed Interpretation** — 36 Drekkana faces (Varahamihira)
- **P2-07: Narayana Dasha Interpretation** — engine done, interpretation thin
- **P2-08: Shoola Dasha + Brahma/Rudra/Maheshwara** — Jaimini-based timing system
- **P2-11: Pushkar Navamsha Details** — calculation done, dedicated interpretation needed

---

## 🟢 PRODUCT FEATURES (Non-Classical)

### PROD-02: PWA — Offline + Push Notifications
**Priority:** High | **Impact:** Mobile retention
- Service worker — cache app shell, fonts, icons, learn content
- Offline mode for: Learn, Puja Vidhi, About (static content)
- Web Push: festival reminders, dasha transitions
- Custom install prompt (after 2nd visit)
- App icons (192×192, 512×512)
- Shortcuts: "Today's Panchang", "My Dashboard", "Generate Kundali"

### PROD-06: Birth Time Rectification
**Priority:** Medium
Input life events → test ascendants at 10-minute intervals → score each lagna → suggest most likely birth time.

### PROD-07: Astrologer Marketplace
**Priority:** Low (Future)
Verified Vedic astrologer profiles, booking, review system, 15–20% revenue share. Significant ops work.

### PROD-08: Graha Shanti Puja Vidhi (9 Planets)
**Priority:** Medium | **Impact:** Content depth + SEO
Full puja procedure per planet: materials, mantras with counts, auspicious timing, deity, homa items.

### PROD-09: Contextual Remedy Engine
**Priority:** Medium
Map specific affliction → specific remedy combination (not generic per-planet).

### PROD-10: Muhurta Panchanga — Graphic Annual View
**Priority:** Medium | **Impact:** Planning tool, SEO
Monthly/annual grid: rows = activity types, columns = days, color-coded cells.

---

## 📊 P3 — Academic / Completeness

- [ ] **Drekkana Faces** — 36 pictorial decanate descriptions (Varahamihira)
- [ ] **Sookshma Dasha (Level 4)** — 4th Vimshottari subdivision
- [ ] **Prana Dasha (Level 5)** — Days-level precision
- [ ] **Panchavargeya Bala** — Varahamihira's 5-chart dignity score
- [ ] **Planetary physique descriptions** — Body characteristics from planets
- [ ] **Jupiter-Saturn conjunction world-era analysis** — 20-year cycle themes
- [ ] **Classical text search** — Vector search across BPHS, Phaladeepika, Saravali verses

---

## 🏆 Competitive Gap Tracker

**Jagannatha Hora (JHora):** Free desktop app, 40+ dasha systems, 184 yogas, research-grade calculations.
**Parashara's Light (PL):** $300–700 desktop, 1000+ yogas, 4 searchable classical texts, professional reports.

| Feature | JHora | PL | Dekho Panchang |
|---------|-------|----|----------------|
| Web-based, zero install | ✗ | ✗ | ✅ |
| Mobile-first design | ✗ | ✗ | ✅ |
| LLM chart chat | ✗ | ✗ | ✅ |
| Trilingual (EN/HI/SA) | Partial | Partial | ✅ |
| Divisional charts | ✅ | ✅ | ✅ (19) |
| Vimshottari Dasha | ✅ | ✅ | ✅ |
| Dasha systems | 40+ | 30+ | 21 |
| Yoga detection | 184 | 1000+ | 127 |
| Shadbala | ✅ | ✅ | ✅ |
| Sudarshana Chakra | ✅ | ✅ | ✅ |
| Jaimini (full) | ✅ | ✅ | ✅ |
| Muhurta (full) | ✅ | ✅ | ✅ |
| Pancha Pakshi | ✅ | ✗ | ✅ |
| Life Timeline synthesis | ✗ | ✗ | ✅ |
| Email digest | ✗ | ✗ | → Roadmap |
| Kundali comparison | ✗ | ✅ | → Roadmap |
| Birth time rectification | ✅ | ✅ | → Roadmap |
| Subscription model | ✗ | ✗ | ✅ |
| Location auto-detect | ✗ | ✗ | ✅ |
| Festival calendar | ✗ | ✗ | ✅ |
| PDF export | ✗ | ✅ | ✅ |

---

## Execution Sequence

```
NOW (active):
  PROD-04 — SEO + Structured Data        ← current
  PROD-01 — Email Notifications
  PROD-05 — Kundali Comparison

PARKED (pick up after NOW):
  JYOTISH-10 — Nakshatra Pada Analysis
  P2-04      — Tajika Full 7-Yoga System
  P2-05      — KP Sub-sub Lords
  P2-06      — Swamsha Profile Library

NEXT WAVE:
  PROD-02 — PWA
  P2-02   — Drekkana interpretation
  P2-08   — Shoola Dasha
  PROD-06 — Birth Time Rectification
```

# Dekho Panchang — Master Product Roadmap

**Last updated:** 2026-04-27
**Reference:** See `docs/CLASSICAL_JYOTISH_GAP_ANALYSIS.md` for full classical text analysis.

---

## ✅ Completed

### Audit & Hardening (2026-04-26/27 Session)
- [x] Festival masa regression fix — 20/20 exact match vs Prokerala 2026
- [x] Kala-Vyapti engine — 9 muhurta rules (madhyahna, pradosh, nishita, arunodaya, aparahna, chandrodaya, pratah, sunrise), getKalaWindow + getOverlap, Dharmasindhu tie-breaking
- [x] Astronomical Adhika detection — decoupled NM scan, sunrise alignment, isAdhika from Amant only. Verified: 2026 Jyeshtha, 2027 none, 2029 Chaitra.
- [x] Adhika naming — classical map (Mesha→Vaishakha, Meena→Chaitra), sign1-based
- [x] Makar Sankranti — binary search + Punya Kala sunset rule
- [x] Varjyam ghati table — 4 values corrected (Ardra, Punarvasu, Pushya, U.Phalguni)
- [x] Combustion retrograde orbs — Mercury 14→12°, Venus 10→8° per BPHS
- [x] API + client error logging — 8 silent catches fixed
- [x] Graduated Cheshta Bala mode — configurable BPHS strict vs graduated
- [x] India WWII historical timezone — 1941-1945 UTC+6:30 auto-applied
- [x] Festival × City × Year programmatic SEO — 3,000+ URLs with JSON-LD (Event + FAQ + Breadcrumb)
- [x] Calculation Proof toggle — transparent audit trail on /panchang/[city] and festival pages
- [x] Planet-in-House verse data — 84 BPHS-cited entries with en/hi
- [x] 6 missing FESTIVAL_DETAILS entries (holika-dahan, durga-ashtami, maha-navami, hartalika-teej, chhath-puja, tulsi-vivah)
- [x] Learn pages 27-1 (Festival Timing Rules) + 27-2 (Adhika Masa) + standalone topic pages
- [x] Learn nav dropdown with direct topic access, no sequential locking
- [x] Competitor references removed from all user-facing content
- [x] Dashboard TransitCountdown empty state fix
- [x] Samvat year boundary correction
- [x] Moonrise parallax verified (already implemented, ±2 min of IMD/timeanddate)

### Platform Core
- [x] Daily Panchang — location-aware, 90+ fields, DST-safe
- [x] Kundali generator — 19 divisional charts, 18 tabs
- [x] 10-page PDF export
- [x] Trilingual support (EN / HI / SA) — 612 pages across 3 locales
- [x] Global location store — auto-detect, no Delhi fallback
- [x] Timezone handling — IANA per-date with DST awareness + India WWII correction
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

## 🔴 NOW — Current Sprint (Execute in Order)

### NOW-1: Smarta vs Vaishnava System
**Priority:** Critical | **Impact:** Eliminates ±1 day festival disagreements + educational authority
- Learn page explaining the difference (Smarta = Udaya Tithi default, Vaishnava = Viddha rejection + Parana stricter)
- Tooltips on festival pages where the two systems disagree (e.g., Janmashtami, Ekadashi)
- Dedicated `/learn/smarta-vaishnava` standalone page + curriculum module 27-3
- Eventually: settings toggle to switch between systems

### NOW-2: Technical Breakdown on Main Panchang Page
**Priority:** High | **Impact:** Trust builder on #1 traffic page
- Expandable "Calculation Proof" on interactive `/panchang` page (already done on /panchang/[city] and festival pages)
- Show coordinates, ayanamsha, tithi formula, binary search precision, Rahu Kaal derivation

### NOW-3: Planet-in-House SEO Pages (84 URLs)
**Priority:** High | **Impact:** Evergreen traffic for "Sun in 10th house" queries
- Data file ready (`src/lib/constants/planet-in-house-verses.ts` — 84 BPHS-cited entries)
- Create `/learn/[planet]-in-[house]` pages with classical verse, modern interpretation, "View Source" shloka
- JSON-LD Article schema per page

### NOW-4: Regional Specialization (Locale-Aware UX)
**Priority:** High | **Impact:** Differentiation — Prokerala can't do this
- Tamil locale: elevate Pancha-Pakshi, Gowri Panchangam to primary view
- Hindi locale: prioritize Choghadiya, Vrat details
- Reorder panchang widgets per locale

### NOW-5: Astrological Journal
**Priority:** High | **Impact:** #1 retention feature — creates daily habit
- Daily mood/event logging correlated with transits
- Pattern detection after 3-6 months ("You feel anxious when Moon transits 8th house")
- Schema exists at `src/lib/journal/snapshot.ts`

---

## 🟡 NEXT — Differentiation Sprint

### NEXT-1: Dasha-Transit Unified Timeline
- Single scrollable timeline: current dasha + transits overlaid
- "You're in Moon-Mars dasha and Saturn is transiting your 8th house"

### NEXT-2: "Explain Like I'm 5" Mode
- Toggle converting kundali analysis into plain-language narrative
- 106 learn modules linked contextually to chart features

### NEXT-3: Chandrodaya muhurtaRule
- Add moonrise case to getKalaWindow. Apply to Karwa Chauth, Sankashti Chaturthi.
- Moonrise computation already exists. Small effort.

### NEXT-4: Muhurta Month Calendar (Color-Coded Grid)
- Month-view grid color-coded by auspiciousness per activity (20 types)
- Drik has shubh dates for marriage only; we do 20 activities

### NEXT-5: Composite/Synastry Charts ✅
- Overlay two charts. Conjunctions, aspects, house overlaps.
- Beyond 36-point Ashta Kuta score.

### NEXT-6: Email Notifications ✅ (Already built)
- 8 cron routes, 4 email templates, Vercel crons configured

### NEXT-6: Email Notifications (Resend)
- Welcome email, weekly digest, dasha transition alerts, festival reminders
- `src/lib/email/templates/` + cron routes
- Rate limit: max 3 emails/user/week

---

## 🟠 CONTENT MOAT — Ongoing

### CM-1: Panchang City Article Enrichment
- Add `generateDailyArticle` prose to `/panchang/[city]` pages (currently data-only)
- Unique narrative per city per day prevents thin-content penalty

### CM-2: Special Panchang Yogas
- Dwipushkar, Tripushkar, Sarvartha Siddhi, Amrit Siddhi, Ravi Yoga, Guru Pushya Yoga
- Drik Panchang shows these daily — our panchang is incomplete without them

### CM-3: Bhava Chalit Chart
- Show planets in Bhava houses (may differ from Rashi houses)
- Table-stakes feature — every competitor has this

### CM-4: Duplicate Constants Consolidation
- 17 files with exaltation tables, all currently consistent
- Canonical source at `tippanni/dignity.ts`. AST-based migration needed.

### CM-5: Dashakoota (10-Point Matching) — IN PROGRESS
- South Indian matching system. Tamil users expect this.
- Bhakut Dosha exceptions also missing.
- dasha-koota.ts engine + matching page tab toggle

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

# Dekho Panchang — Product Roadmap

**Last updated:** 2026-04-03

---

## Completed

### Core Platform
- [x] Daily Panchang with location-aware calculations (no hardcoded defaults)
- [x] Kundali generator with 11 tabs (Chart, Planets, Dasha, Ashtakavarga, Tippanni, Varga, Jaimini, Graha, Yogas, Shadbala/Bhavabala, Sade Sati)
- [x] 10+ page comprehensive PDF export
- [x] 50+ pages across 3 locales (EN/HI/SA)
- [x] 20 complete Puja Vidhis with mantras (Devanagari + IAST), aartis, samagri lists
- [x] Festival detail pages with inline puja vidhi
- [x] ICS calendar exports (festivals, ekadashi, purnima, amavasya)
- [x] Advanced tools: Varshaphal, KP System, Prashna, Muhurta AI, Sade Sati, Baby Names, Shraddha
- [x] Homepage with Style A illustrated gradient cards
- [x] Global location store (auto-detect + override, no Delhi fallback)
- [x] Timezone handling with DST awareness

### Personalization System (Phases 1-5)
- [x] Phase 1: Google OAuth + Supabase auth + onboarding + kundali snapshot storage
- [x] Phase 2: Dashboard (Your Day, Tara/Chandra Bala, day quality, current dasha)
- [x] Phase 3: Gochar engine, transit alerts, festival relevance scoring, panchang overlay
- [x] Phase 4: Personal muhurta, remedies, saved charts, dasha timeline
- [x] Phase 5: In-app notification system with daily cron

### Monetization
- [x] 3-tier system (Free/Pro/Jyotishi) with usage gating
- [x] PaywallGate + UpgradePrompt components
- [x] Pricing page with INR/USD toggle
- [x] Stripe checkout + webhook handlers (LIVE)
- [x] Google AdSense integration (component ready, needs account)

### Infrastructure
- [x] Supabase (auth, profiles, snapshots, subscriptions, usage, notifications)
- [x] Automated migrations (supabase db push on every Vercel deploy)
- [x] 231 tests (136 unit Vitest + 95 E2E Playwright)
- [x] Settings page with full profile CRUD + kundali recompute

---

## Next Up

### 1. Email Notifications (Resend) — NEXT
**Priority:** High | **Impact:** Retention + re-engagement

Transactional and engagement emails via Resend:

**Transactional:**
- Welcome email after signup (with birth chart summary)
- Subscription confirmation / upgrade
- Password reset (if email auth used)

**Engagement:**
- Weekly personalized digest every Monday 6 AM:
  - This week's day quality forecast (Tara Bala for each day)
  - Current dasha period with interpretation
  - Upcoming festivals with personal relevance
  - Transit alerts for the week
- Dasha transition alerts (30 days before antardasha change)
- Sade Sati onset/phase change notification
- Festival reminders (3 days before personally relevant festivals)

**Technical:**
- Resend SDK for email delivery
- React Email templates (branded, responsive, dark theme matching app)
- Unsubscribe per category (uses existing notification_prefs JSONB)
- Cron job: weekly digest on Mondays, daily check for dasha/festival alerts
- Rate limiting: max 3 emails/user/week
- Email preference management in Settings page

**Files:**
- `src/lib/email/resend-client.ts` — Resend SDK wrapper
- `src/lib/email/templates/` — React Email templates (welcome, digest, alert)
- `src/app/api/cron/weekly-digest/route.ts` — Weekly cron
- `src/app/api/cron/email-alerts/route.ts` — Daily dasha/festival email check
- Update Settings page with email preferences

**Env vars:** `RESEND_API_KEY`, `EMAIL_FROM=noreply@dekhopanchang.com`

---

### 2. PWA Improvements — AFTER EMAIL
**Priority:** High | **Impact:** Mobile engagement, app-like experience

**Install Experience:**
- Custom install prompt (not browser default) — appears after 2nd visit
- "Add to Home Screen" banner with app icon + description
- Splash screen with Dekho Panchang branding

**Offline Support:**
- Service worker caches: app shell, fonts, static assets, icons
- Offline-first for pages that don't need live data: Learn, About, Puja Vidhi content
- Cached panchang data for last viewed date
- Offline indicator banner when network is down
- Background sync: queue actions when offline, sync when back

**Push Notifications (Web Push):**
- Browser push permission prompt
- Push for: festival reminders, dasha transitions, significant transits
- Uses existing notification_prefs for opt-in/out
- Service worker handles push events

**App Manifest:**
- Proper icons (192x192, 512x512) in gold/navy theme
- Screenshots for app store listing
- Shortcuts: "Today's Panchang", "My Dashboard", "Generate Kundali"

---

### 3. Razorpay Activation (India Payments)
**Priority:** High | **Impact:** Revenue from India (80% of audience)

Enable UPI, net banking, wallets for Indian users. Code already written — just needs Razorpay account + API keys.

**Env vars needed:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, 4 plan IDs.

---

### 4. SEO + Analytics
**Priority:** High | **Impact:** Organic traffic growth

- JSON-LD structured data per page type (HowTo for puja, Event for festivals)
- Dynamic OG images per page
- Google Search Console setup
- Custom analytics events (kundali generated, chart exported, subscription started)
- Funnel tracking: visit → sign up → onboarding → paid

---

### 5. More Puja Vidhis
**Priority:** Medium | **Impact:** Content depth, SEO

**Tier 3 Monthly Vrats (5):** Amavasya Tarpan, Somvar Vrat, Mangalvar Vrat, Masik Shivaratri, Purnima Satyanarayan

**Regional Variants:** Navaratri (Gujarat/Bengal/South), Ganesh Chaturthi (Maharashtra/TN), Chhath (Bihar), Onam (Kerala)

**Graha Shanti Pujas (9):** One per planet, linked from remedies page

---

### 6. Kundali Comparison
**Priority:** Medium | **Impact:** User engagement

Side-by-side chart comparison beyond Guna matching: dual D1 display, aspect overlay, dasha compatibility, composite chart, PDF comparison report.

---

### 7. Birth Time Rectification
**Priority:** Low | **Impact:** Professional users

For unknown birth times: input life events → algorithm tests different times → suggests most likely birth time with confidence scoring.

---

### 8. Astrologer Marketplace
**Priority:** Low (Future) | **Impact:** New revenue stream

Connect users with verified Vedic astrologers: profiles, booking (video/chat/written), reviews, revenue share (15-20%).

---

## Competitive Landscape

Benchmarked against **Jagannatha Hora** (free, 40+ dasha systems, 184 yogas, research-grade) and **Parashara's Light** (paid, 1000+ yogas, 4 searchable classical texts, professional reports).

### Our Unique Differentiators
- **Web-based, zero install** — works on any device, mobile-first
- **LLM-powered chart chat** — conversational Q&A with your kundali
- **Per-varga commentary + dasha prognosis** — AI-generated interpretive text per divisional chart
- **Daily horoscope from real transits** — not generic, based on actual computePanchang() data
- **Trilingual (EN/HI/SA)** — deepest language support in any Vedic astrology tool
- **Free + open source** — PL costs $300-700
- **Location-aware auto-detection** — both competitors require manual city entry
- **Light/dark theme, responsive design** — modern web UX

---

## Phase 1: Yoga Detection Engine [HIGH PRIORITY]

**Gap**: We detect ~5 yogas. JHora detects 184. PL detects 1000+.

### Target: 50+ Named Yogas with Classical References

| Category | Yogas | Count |
|----------|-------|-------|
| **Pancha Mahapurusha** | Ruchaka (Mars), Bhadra (Mercury), Hamsa (Jupiter), Malavya (Venus), Shasha (Saturn) | 5 |
| **Raja Yogas** | Dharma-Karma Adhipati, Lagna-Kendra lords conjunction, Trikona-Kendra exchange | 8+ |
| **Dhana Yogas** | 2nd/11th lord combos, Lakshmi Yoga, Kubera Yoga | 6+ |
| **Parivartana Yoga** | Maha Parivartana, Dainya Parivartana, Khala Parivartana | 3 |
| **Neecha Bhanga Raja** | Debilitation cancellation (4 classical conditions) | 1 |
| **Viparita Raja** | 6th/8th/12th lords in other dusthanas | 3 |
| **Gajakesari** | Jupiter-Moon kendra relationship | 1 |
| **Budhaditya** | Sun-Mercury conjunction | 1 |
| **Chandra Yogas** | Sunafa, Anafa, Durudhara, Kemadruma, Voshi, Veshi, Ubhayachari | 7 |
| **Surya Yogas** | Voshi, Veshi, Ubhayachari (Sun-based) | 3 |
| **Nabhasa Yogas** | Rajju, Musala, Nala, Mala, Sarpa, Gada, Shakata, Shringataka, Hala, Vajra, Yava, Kamala, Vapi | 13+ |
| **Sannyasa Yoga** | 4+ planets in a kendra | 1 |
| **Saraswati Yoga** | Jupiter, Venus, Mercury in kendra/trikona | 1 |
| **Amala Yoga** | Benefic in 10th from Moon/Lagna | 1 |

### Implementation Plan
- `src/lib/kundali/yoga-detection.ts` — Core detection engine
- Each yoga: name (EN/HI/SA), conditions, classical reference (BPHS chapter), strength score
- Integration into KundaliData type + Tippanni tab + Varga Analysis

---

## Phase 2: Dosha Expansion [HIGH PRIORITY]

**Gap**: We detect Mangal Dosha, Kala Sarpa, Ganda Moola. Need 10+ more.

### Target Doshas

| Dosha | Detection Logic | Cancellation Criteria |
|-------|----------------|----------------------|
| **Pitra Dosha** | Sun with Rahu/Ketu, 9th house affliction | Jupiter aspect, benefic in 9th |
| **Guru Chandala** | Jupiter-Rahu conjunction | Sign of Jupiter, aspect of benefic |
| **Kalathra Dosha** | 7th house/lord affliction | Venus strength, benefic aspect on 7th |
| **Shrapit Dosha** | Saturn-Rahu conjunction | Jupiter aspect |
| **Marana Karaka Sthana** | Planet in its death-like house (Sun in 12th, Moon in 8th, etc.) | Dignity, aspects |
| **Badhaka** | Badhakesh in Lagna or aspecting Lagna | Benefic association |
| **Kemdrum Dosha** | No planet in 2nd/12th from Moon | Cancellation conditions |
| **Grahan Dosha** | Sun/Moon with Rahu/Ketu | Sign, dignity |
| **Daridra Yoga** | 11th lord in 6th/8th/12th | Benefic aspect |
| **Arishta Yoga** | Multiple malefics in kendras without benefic aspect | Benefic intervention |

---

## Phase 3: Special Lagnas [HIGH PRIORITY]

**Gap**: We only compute standard Lagna. JHora and PL compute 6+ special lagnas.

### Target Lagnas

| Lagna | Formula | Significance |
|-------|---------|-------------|
| **Hora Lagna (HL)** | Based on hours from sunrise × 1 sign/2.5 hours | Wealth, finances |
| **Ghati Lagna (GL)** | Based on ghatis from sunrise | Power, authority |
| **Sree Lagna (SL)** | Based on Moon longitude + (Lagna - Sun) | Lakshmi's blessing, prosperity |
| **Indu Lagna (IL)** | 9th lords of Lagna & Moon, weighted sum | Financial prosperity indicator |
| **Pranapada Lagna (PL)** | Based on exact birth time in vighatis | Life force, vitality |
| **Varnada Lagna (VL)** | Derived from Lagna and Hora Lagna | Caste/varna, social standing |

### Implementation
- Compute in `kundali-calc.ts`, add to `KundaliData`
- Display on chart tab as toggleable overlay markers
- Reference in Tippanni: "Your Hora Lagna falls in the 2nd house, strengthening wealth indicators"

---

## Phase 4: Additional Dasha Systems [HIGH PRIORITY]

**Gap**: We have 3 (Vimshottari, Yogini, Ashtottari) + Chara. JHora has 40+.

### Target: 6 More Systems

| Dasha | Type | Duration | Significance |
|-------|------|----------|-------------|
| **Narayana** | Rasi-based | Variable (1-12 years per sign) | Most important rasi dasha (PVR Narasimha Rao) |
| **Kalachakra** | Nakshatra-based | 83-year cycle | Time-wheel, directional movement |
| **Shoola** | Rasi-based | Variable | Danger/death timing |
| **Sthira** | Rasi-based | 7/8/9 years | Fixed period per sign type |
| **Drig** | Rasi-based | Variable | Aspect-based timing |
| **Sudarsana Chakra** | Triple-reference | 1 year per house | Lagna + Moon + Sun simultaneous |

---

## Phase 5: Prastarashtakavarga [MEDIUM PRIORITY]

**Gap**: We show BAV + SAV summary. Need full 8×12 Prastara grid per planet.

### Implementation
- Full bindu contribution table: which planets contribute points to which signs
- Shodhana (reduction) process visualization
- Per-planet 12-sign Prastara grid
- Transit SAV scoring for prediction

---

## Phase 6: Vimshopaka Bala [MEDIUM PRIORITY]

**Gap**: We compute basic Shadbala. Need Vimshopaka (dignity across vargas).

### Implementation
- Compute planet dignity in each varga (D1-D60)
- Weight by Shadvarga (6), Saptavarga (7), Dashavarga (10), Shodashavarga (16) groups
- Display as strength percentage + category (Poorna/Paripurna/etc.)

---

## Phase 7: Classical Text Search [MEDIUM PRIORITY]

**Gap**: Our RAG pipeline has the infrastructure but needs content.

### Implementation
- Ingest BPHS, Phaladeepika, Saravali chapters into Supabase vector store
- Build search UI: keyword search across classical verses
- Highlight relevant verses for current chart (like PL's red highlighting)
- Tag each verse with graha/bhava/rashi/yoga metadata

---

## Phase 8: Graphic Transit Calendar [MEDIUM PRIORITY]

### Implementation
- Monthly view: rows = planets, columns = days, cells = sign
- Highlight: retrograde stations, sign ingresses, conjunctions
- Yearly view: 12-month strip per planet
- Interactive: click date to see full panchang

---

## Phase 9: Tithi Pravesha [LOW PRIORITY]

### Implementation
- Calculate exact moment when Sun returns to birth tithi longitude
- Generate chart for that moment
- Tajika yogas for the annual chart
- Compare with Varshaphal (solar return)

---

## Phase 10: Chakra Systems [LOW PRIORITY]

### Target
- **Sudarsana Chakra**: 3-ring concentric chart (Lagna/Moon/Sun)
- **Sarvatobhadra Chakra**: 9×9 grid with nakshatras, vowels, consonants
- **Kota Chakra**: Fortress diagram for transit analysis
- **Kaala Chakra**: Time-wheel for dasha analysis

---

## Current Status (Completed)

- 180 pages across 3 locales
- 19 divisional charts (D1, BC, D9, D2-D60) with per-chart commentary
- 4 dasha systems (Vimshottari, Yogini, Ashtottari, Chara)
- 6 ayanamsha systems
- Jaimini system (Chara Karakas, Karakamsha, Arudha Padas)
- Full panchang with 90+ fields, location-aware
- LLM chat with chart + daily horoscope
- 105 tests across 4 suites
- Light/dark theme, PWA, PDF export, notifications

---

## Timeline Estimate

| Phase | Scope | Status |
|-------|-------|--------|
| Phase 1 | 50+ Yogas | Next |
| Phase 2 | 10+ Doshas | Next |
| Phase 3 | 6 Special Lagnas | Next |
| Phase 4 | 6 Dasha Systems | Next |
| Phase 5 | Prastarashtakavarga | Planned |
| Phase 6 | Vimshopaka Bala | Planned |
| Phase 7 | Classical Text Search | Planned |
| Phase 8 | Graphic Transit Calendar | Planned |
| Phase 9 | Tithi Pravesha | Backlog |
| Phase 10 | Chakra Systems | Backlog |

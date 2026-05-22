# Tithi Calendar — "Better Than Drik" Redesign Plan

User feedback (2026-05-22): `/en/calendars/tithi` is "too dark and lacks the vibrancy and details of drikpanchang.com/panchang/month-panchang.html."

Decisions confirmed (Q2/Q3/Q4 from prior draft):

- **Mobile**: separate **list view**, not horizontal-scroll grid.
- **Festival iconography**: specific SVGs per festival, but **user must approve a mockup before icons land in the icon library**.
- **Drik fidelity bar**: "way better than Drik — not a single gap." This document treats Drik feature-parity as the floor, not the ceiling.

---

## 1. The 86-data-point Drik daily inventory

A single Drik day-panchang page shows **86 distinct astronomical / liturgical data points**, grouped:

**Core panchanga** — Tithi (+ end time), Nakshatra (+ end time + 4-pada quarters with times), Yoga (+ end time), Karana (+ multiple transitions per day), Vara, Paksha.

**Calendar systems (10)** — Hindu Purnimanta + Amanta with Adhika markers, Vikram Samvat (with samvatsara name like "Siddharthi"), Shaka Samvat (with year-lord like "Parabhava"), Gujarati Samvat, Brihaspati Samvatsara, Kali Ahargana (years + days), National Civil Date, National Nirayana Date, Julian Day / Rata Die / Modified JD.

**Seasonal (4)** — Drik Ritu, Vedic Ritu, Ayana, Drik Ayana / Vedic Ayana.

**Solar (5)** — Sunrise, Sunset, Dinamana (HMS), Ratrimana, Madhyahna.

**Lunar (4)** — Moonrise, Moonset, Moon Sign (with transit time), Nakshatra Pada (4 quarters with times).

**Solar zodiac (3)** — Sun sign, Surya Nakshatra, Surya Pada.

**Auspicious timings (9)** — Brahma Muhurta, Pratah Sandhya, Abhijit Muhurta, Madhyahna Sandhya, Vijaya Muhurta, Godhuli Muhurta, Sayahna Sandhya, Amrit Kalam, Nishita Muhurta.

**Inauspicious timings (8)** — Rahu Kalam, Yamaganda, Gulika Kalam (often 2 segments), Dur Muhurta, Varjyam, Aadal Yoga, Bhadra (when Vishti karana), Ganda Moola.

**Complex yogas (3)** — Anandadi Yoga, Tamil Yoga, Tamil Yoga subcategories.

**Directional (8)** — Homahuti, Disha Shool, Agnivasa, Chandra Vasa, Bhadravasa, Rahu Vasa, Shivavasa, Kumbha Chakra.

**Panchaka Rahita Muhurta (6)** — Good windows + 5 defect classes (Chora / Roga / Mrityu / Agni / Raja Panchaka).

**Udaya Lagna (12)** — All 12 ascendant rise windows.

**Chandrabalam (3 segments)** — Personalised list of favourable Moon-house rashis for the user's natal Moon.

**Tarabalam (3 segments)** — Personalised favourable nakshatras keyed to user's janma nakshatra.

**Astrological constants (1)** — Lahiri Ayanamsha to 6 decimal places.

**Mantri Mandala (10 ruling officers)** — Raja, Senadhipati, Mantri, Dhanyadhipati, Sasyadhipati, Meghadhipati, Dhanadhipati, Nirasadhipati, Rasadhipati, Phaladhipati — all derived from Vikram Samvat year.

**Special observances** — Purushottam Maas marker, Ganda Moola indicator, Bhadra/Vishti karana presence.

**Total: 86 data points on a single day's page.**

We currently render **8 of those 86 per cell** (tithi, paksha, nakshatra, moon rashi, yoga, sunrise, sunset, festivals). Yoga is in our type but never rendered. Masa is in our type but never rendered.

## 2. Engine readiness — what we already compute

Confirmed via grep:

| Drik element | Our engine | Status |
|---|---|---|
| Tithi + ending time | `src/lib/ephem/astronomical.ts::calculateTithi` | ✅ Ready (end time computable from elongation) |
| Nakshatra + 4 padas + end time | `src/lib/ephem/astronomical.ts::getNakshatraNumber` | ✅ Ready |
| Yoga + end time | `src/lib/ephem/astronomical.ts::calculateYoga` | ✅ Ready |
| Karana + transitions | `src/lib/ephem/astronomical.ts` | ✅ Ready (4 karanas per tithi) |
| Vara | trivial weekday math | ✅ |
| Masa Amanta + Purnimanta | `src/lib/calendar/tithi-table.ts` (precomputed) | ✅ |
| Vikram Samvat + Brihaspati Samvatsara | `src/lib/calendar/hindu-months.ts` | ✅ (need to verify samvatsara name table) |
| Shaka Samvat | `src/lib/calendar/hindu-months.ts` | ✅ |
| Ritu + Ayana | `src/lib/calendar/hindu-months.ts` | ✅ |
| Sunrise / Sunset | `src/lib/astronomy/sunrise.ts` | ✅ |
| Moonrise / Moonset | `src/lib/astronomy` | ✅ (computed in panchang-calc) |
| Dinamana / Ratrimana | derive from sunrise/sunset | ✅ |
| Sun rashi + Surya Nakshatra | `src/lib/ephem/astronomical.ts` | ✅ |
| Brahma Muhurta | `src/lib/muhurta/inauspicious-periods.ts` etc. | ✅ |
| Abhijit Muhurta | `src/lib/muhurta/engine/rules/kaala.ts` | ✅ (handle Wednesday exclusion) |
| Vijaya / Godhuli / Amrit / Nishita | `src/lib/muhurta` + `src/lib/panchang/daily-narrative.ts` | ✅ Ready |
| Rahu Kalam | `src/lib/ephem/astronomical.ts::calculateRahuKaal` | ✅ |
| Yamaganda + Gulika | `src/lib/muhurta/inauspicious-periods.ts` | ✅ |
| Dur Muhurta | `src/lib/muhurta` engine | ✅ |
| Varjyam | `src/lib/muhurta/engine/rules/varjyam.ts` | ✅ |
| Choghadiya (24 slots) | `src/lib/ephem/panchang-calc.ts` + own engine | ✅ |
| Hora (24 planetary hours) | `src/lib/panchang/hora-engine.ts` | ✅ |
| Panchaka windows | `src/lib/panchang/panchak.ts` | ✅ |
| Ganda Moola | `src/lib/calendar/ganda-mool.ts` | ✅ |
| Holashtak | `src/lib/panchang/holashtak.ts` | ✅ |
| Chandra Darshan | `src/lib/panchang/chandra-darshan.ts` | ✅ |
| **Tarabalam** (personalised) | `src/lib/panchang/balam.ts::TARA_NAMES + FAVORABLE_TARAS` | ✅ Ready, needs user kundali |
| **Chandrabalam** (personalised) | `src/lib/panchang/balam.ts::FAVORABLE_HOUSES` | ✅ Ready, needs user kundali |
| Eclipses | `src/lib/calendar/eclipse-compute.ts` | ✅ |
| Energy score | `src/lib/panchang/energy-score.ts` | ✅ |

**Things we do NOT yet have:**

- Lagna rise windows per day (Udaya Lagna 12 segments) — we have lagna for a single moment but not the 12-segment table.
- Anandadi Yoga + Tamil Yoga (Tamil-tradition yogas distinct from the standard 27).
- Directional shools (Disha / Rahu / Chandra / Shivavasa / Agnivasa / Bhadravasa / Kumbha Chakra) — derived from weekday + tithi tables, ~half-day of work.
- Mantri Mandala (10 officers for the year) — derived from Vikram Samvat year-lord (Siddharthi → table → 10 planet assignments).

These are the only blanks. **The astronomical work is essentially done — this redesign is a plumbing + design exercise, not an engine rebuild.**

## 3. "Way better than Drik" — what they can't do

Drik is a jQuery-era multi-page application. They have **none** of the following:

1. **Personalised Tarabalam** — they list all 14 favourable nakshatras; we know yours and can mark it.
2. **Personalised Chandrabalam** — same; they list favourable rashis, we highlight yours.
3. **Personalised "Ashtama Chandra" warning** — when the day is 8th from your natal moon, we show a dedicated alert.
4. **Live "now" indicator** — current choghadiya, current hora, current muhurta, where we are inside Rahu Kaal, all live-updating.
5. **Click any day → slide-in detail panel** with full 86-point panchang, no navigation away.
6. **Animated moon-phase progression** — moon icons tween across the month so the cycle is visually obvious.
7. **Vrat tracker integration** — we have `VratTracker` on the dashboard; calendar can show streak status (gold for completed Ekadashi etc.).
8. **Brihaspati "Ask about today"** button on any day — context-aware Vedic-astrologer Q&A grounded in that day's panchang.
9. **Activity filter chips** — "marriage muhurtas this month" / "house-warming muhurtas" / "vehicle purchase" — colour-codes the calendar accordingly using `src/lib/muhurta/engine`.
10. **Year heatmap** — annual overview of favourable / inauspicious days as a 365-day strip, like a GitHub contribution graph but for muhurtas.
11. **Saved kundali support** — overlay Tarabalam/Chandrabalam for any saved family-member chart, not just the logged-in user.
12. **Cmd+K festival search** — jump to any festival across years.
13. **Shareable cards** — generate beautiful PNG of any day for social sharing (Diwali / Holi / etc.) — leverages our `og-image` infrastructure.
14. **PDF export** — printable monthly panchang in their style for elders who prefer paper.
15. **Notifications** — opt-in alerts before Ekadashi / favourable muhurta windows / Sade Sati landmarks. We have `src/lib/email` + Vercel Cron.
16. **Multilingual depth** — 8 active locales (en/hi/ta/te/bn/gu/kn/mai) with real translations; Drik is mostly English+Devanagari.
17. **Compare-to-previous-month delta** — small "↑ +2 ekadashis" badge if the new month is richer.
18. **iCal subscription** — `src/lib/calendar/ical-generator.ts` exists; surface it as `https://dekhopanchang.com/calendars/tithi/feed.ics?location=X` so users add it to Apple Calendar / Google Calendar.
19. **Past-day greying** with one-tap "go to today" pulse — gentle nudge for users who navigate forward and lose their bearings.
20. **Energy score** — `src/lib/panchang/energy-score.ts` outputs a 0-100 daily energy reading; visualise as a sparkline along the month.
21. **Festival deep-link previews** — hovering a festival opens a mini-card with date / fasting time / mantra / brief description, pulled from the festival deep-dive pages.

## 4. The "vibrant dark" visual identity

CLAUDE.md hard rule: no light theme, no theme toggle. So we cannot copy Drik's cream-paper aesthetic. The brief is **"vibrant dark"** — and that needs a clear, single-sentence visual identity, not a vague vibe:

> Each special day **glows from within** like a deepa against night; regular days are **clearly readable charcoal cards** with gold accents; the calendar surface is **lighter** than the page background, so it feels like a surface, not a void.

Implementing rules:

- **Cell surface baseline**: the established purple mega-card gradient `from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]` — same as 30+ other elevated cards in the app.
- **Critical text**: 80–90% opacity, never below 70%.
- **Special-day gradients**: 30–40% alpha minimum (not the current 5–15%).
- **Outer glow** on Purnima, Amavasya major-festival, eclipse cells via `shadow-[0_0_24px_rgba(...,0.35)]`.
- **Today**: full-opacity gold ring + 35% gold glow + larger date circle. Unmistakable.
- **Animations**: ONLY two — a one-second pulse on "TODAY" pill, and a slow 4s opacity oscillation on Purnima glow. No motion elsewhere; resist the slot-machine temptation.
- **WCAG AA minimum** for body text against the new cell backgrounds (4.5:1 for normal text, 3:1 for large). I'll measure during Phase 1.

## 5. Mobile list view design

Below `~640px` the grid view is replaced entirely with a vertical scroll list.

```
┌─────────────────────────────────────────────┐
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │  ← sticky month header (May 2026)
│ ◀  Vaishakha · Krishna Paksha             ▶ │     subtitle: current masa/paksha
├─────────────────────────────────────────────┤
│ ║ 22 │ 🌓  Saptami           06:14 ↗ 21:04 │  ← regular day row (~76px)
│ ║ Fri│      Magha → 22:18                   │
├─────────────────────────────────────────────┤
│ ┃ 23 │ 🌔  Ashtami          06:14 ↗ 21:05 │  ← left edge bar = paksha colour
│ ┃ Sat│      Magha → 22:55  Karka → Simha   │
│ ┃    │  ▓▓▓ Vrat day ▓▓▓                   │  ← vrat ribbon (full-width)
├─────────────────────────────────────────────┤
│ ★ 24 │ 🌕  Purnima          06:13 ↗ 21:06 │  ← Purnima row: elevated, glow,
│ Sun│       ⟡ FULL MOON ⟡                  │     bigger moon icon, brighter
│      │       Magha · Simha                  │
│      │  ━━━ Vat Savitri Vrat ━━━            │  ← festival ribbon
│      │  ━━━ Vaishakha Purnima ━━━           │
├─────────────────────────────────────────────┤
│ ║ 25 │ 🌖  Pratipada        06:13 ↗ 21:07 │
│ ║ Mon│      Purva Phalguni → 02:30          │
├─────────────────────────────────────────────┤
│              [Tap any row for details]      │
└─────────────────────────────────────────────┘
```

**Mechanics:**

- **One row per day** — 76px for regular, 100–140px for special / festival days (auto-expanded).
- **Sticky month/year + masa-paksha label** at top — updates as you scroll past paksha boundaries.
- **Section dividers** between paksha changes ("Krishna Paksha begins").
- **Tap any row** → slide-up sheet (70% screen height) with the full 86-point panchang for that day. Reuses the day-detail panel from Phase 3.
- **Today**: pulsing TODAY pill + full-bleed coloured row. Auto-scroll to today on load.
- **Pull-to-refresh** re-fetches current month.
- **Past days greyed** to ~50% opacity from today onward in a single sweep — emphasises "today and ahead."

## 6. Festival SVG plan — process before icons

User explicitly asked to see mockup before finalising. The process:

### 6.1 Inventory

From `src/lib/calendar/festival-defs.ts` (partial grep above), we render approximately:

- **24 Ekadashi** (Kamada, Papamochani, Mohini, Varuthini, Apara, Devshayani, Yogini, Putrada, Aja, Parivartini, Indira, Papankusha, Rama, Devuthana, Utpanna, Mokshada, Saphala, Pausha Putrada, Shattila, Jaya, Vijaya, Amalaki, Kamika, Pavitra).
- **~40 Major festivals**: Vasant Panchami, Ratha Saptami, Bhishma Ashtami, Maha Shivaratri, Holika Dahan, Holi, Chaitra Navratri, Ram Navami, Hanuman Jayanti, Akshaya Tritiya, Parashurama Jayanti, Narasimha Jayanti, Buddha Purnima, Ganga Dussehra, Vat Savitri Vrat, Jagannath Rath Yatra, Guru Purnima, Varalakshmi Vratam, Raksha Bandhan, Hariyali Teej, Nag Panchami, Janmashtami, Hartalika Teej, Ganesh Chaturthi, Onam, Anant Chaturdashi, Navaratri, Durga Ashtami, Maha Navami, Dussehra, Sharad Purnima, Karwa Chauth, Dhanteras, Narak Chaturdashi, Diwali, Govardhan Puja, Bhai Dooj, Chhath Puja, Tulsi Vivah, Kartik Purnima.
- **~6 Sankranti**: Makar / Mesh / Karka / Tula etc.
- **~4 Eclipse types**: Surya Grahan (total/partial/annular), Chandra Grahan.

**Total: ~74 unique festival types.**

### 6.2 Iconographic strategy

- **Style baseline**: matches our existing `AshtamangalaIcons.tsx` family — gold-gradient strokes (`#f0d48a → #d4a853 → #8a6d2b`) with subtle glow filter. Bold but readable at 16px.
- **Specific, not generic**: Diwali = clustered diyas; Holi = pichkari + colour-splash; Janmashtami = matki; Maha Shivaratri = trishul + bilva leaf; Ekadashi = tulsi sprig; Eclipse = solar/lunar disk with corona; Sankranti = sun crossing a horizon line.
- **Two sizes per icon**: 16×16 for cell ribbons and 40×40 for slide-in detail panel header.
- **Always-symmetric** so they look stable in any size; never use right-bias text inside the icon.

### 6.3 Approval flow

1. I author `docs/tithi-festival-icons-mockup.html` — a standalone HTML file (no React) that renders all ~74 icons in a grid, grouped by category, against the actual dark calendar background.
2. User opens that file in a browser locally and reviews.
3. User flags icons to redo / approve.
4. **Only after approval** do icons land in `src/components/icons/FestivalIcons.tsx`.

This avoids the trap of committing 74 icons and then having to redo them per feedback.

---

## 7. Phasing

Each phase is independently shippable behind no flag — they're vertical slices.

### Phase 1 — Vibrancy + currently-hidden data (P0 — ships today)

Direct response to "too dark, lacks details." No new API. Single file changes.

- **1A**: Cell vibrancy uplift (see §4 visual identity rules).
- **1B**: Render Yoga + Masa (data already on TithiDayData).
- **1C**: Locale audit — migrate `en/hi` binary to all 8 locales via `useTranslations('pages.tithi')`; Maithili is the #1 traffic driver and currently falls back to English.
- **1D**: Playwright verification — screenshots, no console errors, no rapid `/api/tithi-grid` duplicates.

**Risk**: minimal. CSS + locale plumbing. Single-file scope.

### Phase 2 — Density + festival icons (P1)

- **2A**: Extend `/api/tithi-grid` to include karana, tithi/nakshatra/yoga end times, moon rashi transit, Rahu Kaal, Sun rashi, dinamana, masa context. All from existing engines.
- **2B**: Add three-line secondary panchang strip to each cell (see prior draft §2.2).
- **2C**: Festival ribbon system: major festivals get a full-width bottom ribbon; vrat days get a left edge bar; eclipse days get a distinct ring + animated pulse.
- **2D**: Festival SVG icons land **after user mockup approval** (§6).
- **2E**: Ornamental kalash corner on auspicious days, subtle deepak in day-name header.

**Risk**: medium. API extension touches the same surface that powers other pages — need to keep response shape backwards-compatible (add fields, don't remove).

### Phase 3 — Personalisation + delight (P1.5)

- **3A**: Sticky today-panchang header — full panchang of `now` at the top of the page; live indicator inside Rahu Kaal / current Choghadiya / current Hora.
- **3B**: Monthly context strip — Samvatsara name, Masa (both Amanta + Purnimanta if they diverge), Ritu, Ayana, Ayanamsha value, "festivals this month" list.
- **3C**: Click-any-day **slide-in detail panel** (right rail, 480px) showing all 86 data points for that day, organised in Drik's grouping. No navigation away.
- **3D**: **Personalisation**: if user has saved kundali → Tarabalam highlighted to their janma nakshatra, Chandrabalam highlighted to their natal moon, Ashtama Chandra warning when applicable.
- **3E**: **Live "now"** indicators — current choghadiya colour-coded; current hora planet; "we are 38% through Rahu Kaal" progress bar.
- **3F**: **Energy sparkline** along the month — uses `energy-score.ts`.

**Risk**: medium-high. Real product surface. Need to handle "no kundali" state gracefully (fall back to general view, prompt to add birth details).

### Phase 4 — Mobile list view (P2)

Separate component `TithiMonthList.tsx`, rendered below `~640px`. Design in §5.

- **4A**: Component scaffold + auto-scroll to today.
- **4B**: Sticky paksha header + section dividers.
- **4C**: Tap → slide-up bottom sheet with day detail (same content as Phase 3C side panel).
- **4D**: Pull-to-refresh.

**Risk**: low. Greenfield component, no existing surface to regress.

### Phase 5 — Reach extensions (P2)

- **5A**: Cmd+K festival search across years.
- **5B**: Year heatmap view — annual energy / favourable-day map.
- **5C**: Activity filter chips ("marriage muhurta" colourisation).
- **5D**: Shareable PNG card per day (uses `og-image` infrastructure).
- **5E**: PDF export (monthly).
- **5F**: iCal subscription endpoint `/calendars/tithi/feed.ics`.
- **5G**: Brihaspati "Ask about today" button → context-aware Vedic-astrologer Q&A.
- **5H**: Notification opt-in for Ekadashi / favourable muhurtas / Sade Sati.

**Risk**: each item is independent; ship one a week post-launch.

### Phase 6 — Drik feature-parity finish (P3)

The remaining items they have that we don't yet compute:

- **6A**: Udaya Lagna 12-segment table — needs lagna-over-time computation per day. Half day of work.
- **6B**: Anandadi Yoga (28 names cycle by nakshatra×weekday) — pure table lookup, ~1 hour.
- **6C**: Tamil Yoga + subcategories — pure table lookup, ~2 hours including authoring tables.
- **6D**: Directional shools (Disha / Rahu / Chandra / Shivavasa / Agnivasa / Bhadravasa / Kumbha Chakra) — derived from tithi/weekday tables, ~half day.
- **6E**: Mantri Mandala (10 officers from Vikram Samvat year-lord) — table lookup tied to Brihaspati Samvatsara, ~2 hours.

**Risk**: low. Adding data; nothing replacing.

---

## 8. Self-critique of the prior draft (resolved here)

| Concern | How this draft addresses it |
|---|---|
| "Don't animate everything" — no specifics | §4 spec: only TODAY pulse + Purnima glow. Two animations total. |
| Visual mockup before commit | §6.3 explicit approval flow for icons; Playwright screenshots in 1D. |
| Engine-readiness assumed, not verified | §2 grep-verified table; nearly everything exists. |
| Festival icon count hand-wavy | §6.1 explicit inventory of ~74. |
| Mobile list undesigned | §5 full design with ASCII mock. |
| Locale enumeration vague | §1C explicit migration; Maithili is the #1 traffic driver |
| "Vibrant dark" undefined | §4 single-sentence identity + concrete CSS rules. |
| WCAG not addressed | §4 commits to AA minimum measured during Phase 1. |
| Click → navigate away | §3.5 / 3C: slide-in panel, no navigation. |
| No personalisation strategy | §3 + Phase 3D: Tarabalam / Chandrabalam keyed to user kundali. |
| Empty cells "void" | Phase 1A: dim previous/next month tithis at 40% rather than rendering as voids. |

## 9. Open questions remaining

1. **Width budget** — extend `max-w-7xl` → `max-w-[1500px]` for desktop? Phase 2 density needs the extra room. _Default plan: yes, but only on `≥xl` breakpoint._
2. **Notifications opt-in mechanism** — global notification preference or per-event opt-in? _Default plan: per-event in Phase 5H spec._
3. **Personalisation fallback when no kundali** — show "Add birth details to see your favourable days" CTA in the Tarabalam / Chandrabalam blocks. Or hide them entirely. _Default plan: show CTA — drives activation, aligns with the OnboardingModal fix from yesterday._
4. **Brihaspati integration timing** — wire on calendar day-panel as a Phase 5G or earlier? _Default plan: 5G — keep this redesign focused; Brihaspati integration is its own product surface._

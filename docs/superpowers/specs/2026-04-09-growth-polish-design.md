# Growth, Content, Transit Alerts & Polish — Design Spec

**Date:** 2026-04-09
**Goal:** Drive user growth through SEO, add transit alert system, fill content gaps, and polish the entire app to production quality.

---

## 1. Email Transit Alerts + In-App Transit Radar

### 1A. Weekly Transit Email Alerts

- New cron endpoint: `/api/cron/transit-alerts` — runs weekly (Sunday 6AM UTC)
- For each user with saved birth data (`user_profiles` with `birth_lat`, `birth_lng`, `date_of_birth`):
  - Compute current slow-planet positions (Saturn, Jupiter, Rahu/Ketu) via `getPlanetaryPositions`
  - Compare against their ashtakavarga SAV table (from stored `chart_data` snapshot)
  - Trigger alert when a slow planet enters or is within 7 days of entering a strong (SAV ≥ 28) or weak (SAV < 22) sign
- Email via Resend using existing `alert.ts` template, personalized with:
  - Planet name, sign, bindu score
  - Favorable or challenging badge
  - One-line interpretation
  - CTA: "View your full transit analysis →" linking to kundali page
- Respects `notification_prefs.email_transit_alerts` (new preference field, default: true)
- Timezone for the user: ALWAYS resolved from birth coordinates (never stored value)
- In-app notification also created (existing `user_notifications` table)

### 1B. In-App Transit Radar (Kundali Page)

- New section in tippanni area: "Transit Radar — What's Activating Your Chart"
- Shows current positions of Saturn (id=6), Jupiter (id=4), Rahu (id=7), Ketu (id=8) mapped to user's houses
- Each transit row:
  - Planet icon (GrahaIconById)
  - Current sign + house number relative to user's ascendant
  - SAV bindu score for that sign
  - Color-coded badge: green (≥28 bindu), amber (22-27), red (<22)
  - One-line meaning: "Jupiter in your 9th house (strong) — expansion in wisdom, travel, and fortune"
- Upcoming transitions (next 3 months): compact list showing "Saturn enters Pisces on Mar 2028"
- Computed client-side from `kundali.ashtakavarga` + `getPlanetaryPositions()` — no new API

### 1C. Homepage Transit Widget

- Compact "Your Transit Forecast" card below the TodayPanchangWidget
- Only renders for logged-in users with a saved kundali snapshot
- Shows top 2 most significant current transits (highest absolute SAV deviation from mean)
- Each: planet icon + one-liner + favorable/challenging indicator
- "View full analysis →" links to kundali page
- Falls back to generic "Generate your birth chart to see personalized transits" CTA if no snapshot

---

## 2. SEO + Dynamic OG Images + Content

### 2A. Dynamic OG Images

All images: 1200x630px, dark navy (#0a0e27) background, gold (#d4a853) accents, Geist font.

| Route | Content | Revalidation |
|-------|---------|-------------|
| Default fallback (`/opengraph-image.tsx`) | Logo + "Vedic Astrology — Panchang, Kundali, Muhurta" | Static |
| `/panchang/opengraph-image.tsx` | "Today's Panchang — [Date]" + tithi, nakshatra, yoga, sunrise | 1 hour |
| `/kundali/opengraph-image.tsx` | "Generate Your Vedic Birth Chart" + rashi wheel graphic | Static |
| `/learn/.../opengraph-image.tsx` | Module title + category-specific visual (5-6 templates by topic) | Static |
| `/calendar/festivals/[slug]/opengraph-image.tsx` | Festival name + year + date + puja muhurat time | 24 hours |

Twitter card metadata (`twitter:card = summary_large_image`, `twitter:image`) added to all layouts alongside OG.

### 2B. Structured Data (JSON-LD)

| Schema | Pages | Content |
|--------|-------|---------|
| BreadcrumbList | All pages | Auto-generated with display name mapping (not raw route segments) |
| HowTo | Puja Vidhi pages (40+) | Steps extracted from puja procedure content |
| Event | Festival pages | Festival name, date, type: VirtualEvent |
| FAQPage | Learn module pages | Q&A pairs from module content |
| SoftwareApplication | Root layout | Enhanced with rating, offers, operating system |

### 2C. Metadata & Hreflang

- Audit all 206 pages — any page not in `PAGE_META` gets auto-generated title/description from route + parent layout
- Add `alternates.canonical` to all pages
- Add `hreflang` link tags in page `<head>` (`en`, `hi`, `sa`, `x-default`) alongside sitemap alternates
- Ensure no thin pages indexed — `noindex` pages with <100 words of content

### 2D. Content Additions

**New Festival Puja Vidhi (prioritized by search volume):**
1. Chhath Puja (very high volume — Bihar/UP/Jharkhand)
2. Pongal (high volume — Tamil Nadu)
3. Baisakhi (high volume — Punjab)
4. Ugadi (medium — Andhra/Karnataka)
5. Bihu (medium — Assam)

**Regional Calendar Pages (2 solid pages, not stubs):**
1. Tamil Calendar (Panchangam) — Tamil month names, regional festivals, Aadi/Margazhi significance
2. Bengali Calendar (Panjika) — Bengali months, Durga Puja timing, Poila Boishakh

Each page: 800+ words, trilingual, with structured data, proper metadata, internal links to related puja vidhi.

---

## 3. Polish — Responsive, Loading, Error, Accessibility

### 3A. Responsive Fixes

**Approach:** Fix by component (10-15 shared components), then spot-check 10 unique page layouts.

**Components to fix (3 breakpoints: 375px, 768px, 1440px):**

| Component | Issue | Fix |
|-----------|-------|-----|
| ChartNorth/ChartSouth | Fixed `size={500}` prop | Use responsive container width, viewBox scaling |
| Shadbala breakdown table | Horizontal overflow | Horizontal scroll wrapper on mobile |
| Ashtakavarga grid | 12-column grid overflows | 4-col on mobile, 6 on tablet, 12 on desktop |
| Transit timeline Gantt | Overflows on mobile | Horizontal scroll with gradient fade indicators |
| Dasha timeline pills | Overflow horizontal | Scroll with snap |
| House strength bars | Labels truncate | Abbreviate labels on mobile, full on desktop |
| Matching page forms | Side-by-side overflow | Stack vertically on mobile |
| Life area radar/cards | Cards too wide | Full-width cards on mobile |
| Navbar mega-dropdown | Touch targets | Verify ≥ 44px tap targets |
| Footer link columns | 4-col too narrow | 2-col on mobile |

**Page-specific spot-checks (10 pages):**
Homepage, Panchang, Kundali, Matching, Calendar, Sign Calculator, Learn module, Varshaphal, KP System, Prashna Ashtamangala.

### 3B. Loading States

**8 loading.tsx skeletons matching each distinct layout pattern:**

| Route Group | Skeleton Pattern |
|-------------|-----------------|
| `/panchang/` | Pulsing cards: tithi, nakshatra, yoga row + sunrise/sunset |
| `/kundali/` | Form outline + chart placeholder circle + tab bar |
| `/learn/` | Sidebar nav skeleton + content area with heading + paragraphs |
| `/matching/` | Two-column form skeletons |
| `/calendar/` | Month grid skeleton with cells |
| `/sign-calculator/`, `/baby-names/`, `/sade-sati/` | Form + result card |
| `/kp-system/`, `/varshaphal/`, `/prashna-ashtamangala/` | Form + chart + table |
| `/muhurta-ai/` | Form + recommendations grid |

All skeletons use dark theme: `bg-bg-secondary` pulsing blocks, `bg-gold-primary/10` accent lines. No white flashes.

### 3C. Error Boundaries

**error.tsx for every major route group** with:
- Friendly message in user's locale (EN/HI/SA)
- "Try again" button calling `reset()`
- "Go home" link
- Dark-themed (bg-primary, gold text)
- Error logged to console with route context
- Same 8 route groups as loading states

### 3D. Accessibility

| Area | Action |
|------|--------|
| Interactive elements | Replace all `<div onClick>` with `<button>` (audit found only modal backdrops — acceptable) |
| Icon-only buttons | Add `aria-label` to all Lucide icon buttons |
| Chart SVGs | `role="img"` + `aria-label` on ChartNorth/ChartSouth root `<svg>` |
| Focus indicators | `focus-visible:ring-2 ring-gold-primary/50` on all interactive elements |
| Skip-to-content | Hidden link at top of layout, visible on focus |
| Scroll-to-top | Ensure App Router scrolls to top on client navigation |
| Print styles | `@media print` overrides: white background, dark text, hide nav/footer |

---

## Implementation Order

1. **Polish first** — responsive + loading + error (foundation quality)
2. **SEO + OG images** — immediate growth impact
3. **Content additions** — feeds SEO
4. **Transit Radar** (kundali page + homepage widget) — engagement
5. **Transit email alerts** — retention

This order ensures each wave builds on the previous: polish makes the app ready for new visitors, SEO brings them in, content gives them reasons to stay, and transit features keep them coming back.

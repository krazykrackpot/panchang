# Viral Shareable Cards — Design Spec

**Date:** 2026-04-26
**Scope:** Astro Birth Poster, Daily Energy Weather, Yoga Achievement Badges, Sharing Infrastructure
**Goal:** Turn deep Jyotish data into visual identity assets that users share on Instagram/WhatsApp/X, making each share a user acquisition event.

---

## Problem

The app has 142 pages of powerful Jyotish computation, but nothing users can screenshot and post. Drik Panchang has the same problem — it's a reference tool, not a brand. Users don't share data tables; they share things that reflect their identity and current vibe.

## Solution

Three shareable card types built on a shared image generation infrastructure. Every card is dark-luxe (navy + gold), watermarked with URL + QR, and optimized for Instagram Stories (1080x1920) and square (1080x1080) formats.

---

## Part 1: Sharing Infrastructure

### 1a. Image Generation

**Dual pipeline:**
- **Server-side:** Satori (Vercel's SVG-to-image) on an API route → PNG. Used for OG meta images and shareable URLs.
- **Client-side:** `html-to-image` (or `html2canvas`) for instant "Save to Gallery" from the browser. Falls back to server if client generation fails.

**API Route:** `src/app/api/card/[type]/route.ts`
- `GET /api/card/birth-poster?chartId=abc123&format=og` → 1200x630 PNG (OG)
- `GET /api/card/birth-poster?chartId=abc123&format=story` → 1080x1920 PNG (Story)
- `GET /api/card/birth-poster?chartId=abc123&format=square` → 1080x1080 PNG (Square)
- `GET /api/card/daily-vibe?date=2026-04-26&lat=46.47&lng=6.84` → Daily vibe card
- `GET /api/card/yoga-badge?yogaName=Gajakesari&chartId=abc123` → Yoga badge

### 1b. Shareable URLs

Each card gets a public URL that:
- Renders the card as a full page (dark background, centered)
- Serves OG meta tags with the card image for link previews
- Has a CTA below: "Generate your own chart at Dekho Panchang"

**Route:** `src/app/[locale]/card/[type]/page.tsx`
- `/card/birth-poster/abc123` — shows the poster + "Create yours" CTA
- `/card/daily-vibe/2026-04-26` — today's vibe + "Check your daily vibe" CTA

### 1c. Watermark

Every generated card includes:
- **Bottom-left:** `dekhopanchang.com` in small gold text (opacity 60%)
- **Bottom-right:** QR code (48x48px, gold on transparent) linking to the card's shareable URL
- Both rendered as part of the card composition, not overlaid after

### 1d. Web Share API

**Component:** `src/components/ui/ShareCardButton.tsx`

```typescript
interface ShareCardButtonProps {
  cardUrl: string;        // shareable URL
  imageBlob?: Blob;       // client-generated image (for native share)
  title: string;          // "My Vedic Birth Chart"
  text: string;           // "Aries Rising · Moon in Scorpio · 70% Fire"
}
```

Behavior:
- On mobile: uses `navigator.share()` with image file for native share sheet (Instagram, WhatsApp, etc.)
- On desktop: copies shareable URL to clipboard + shows "Link copied!" toast
- Falls back gracefully if Web Share API unavailable

### 1e. Card Design System

All cards share a base aesthetic:
- Background: `#0a0e27` (navy) with subtle radial gradient
- Accent: gold gradient `#f0d48a → #d4a853 → #8a6d2b`
- Typography: heading font (Cinzel/serif) for names, mono for data
- Subtle star field or constellation pattern in background (CSS, not heavy)
- Border: 1px gold at 10% opacity, 24px border-radius
- Padding: 48px on all sides

---

## Part 2: Astro-Aesthetic Birth Poster

The "Spotify Wrapped for Jyotish" — a museum-quality birth chart card.

### Content Layout (Story format 1080x1920)

```
┌─────────────────────────────────┐
│                                 │
│        ✦ VEDIC BIRTH CHART ✦   │  <- tiny gold label
│                                 │
│         [Person Name]           │  <- large, Cinzel font
│    15 August 1990 · 14:30      │  <- birth data in mono
│      Corseaux, Switzerland      │
│                                 │
│  ┌───────────────────────────┐  │
│  │                           │  │
│  │   [Geometric Pattern]     │  │  <- generated from house placements
│  │   (abstract, not a chart) │  │     12 concentric segments, colored
│  │                           │  │     by element of each house lord
│  └──────────��────────────────┘  │
│                                 │
│   ARIES RISING                  │  <- lagna, large
│   Moon in Scorpio · Jyeshtha    │  <- moon sign + nakshatra
│   Sun in Cancer                 │  <- sun sign
│                                 │
│  ┌─────────────────────────┐    │
│  │  🔥 70% FIRE            │    │  <- dominant element bar
│  │  ████████████████░░░░░  │    │     (computed from planet elements)
│  │  "The Catalyst"          │    │  <- element archetype label
│  └─────────────────────────┘    │
│                                 │
│   Saturn Mahadasha              │  <- current dasha
│   Venus Yogakaraka              │  <- standout planet
│                                 │
│  dekhopanchang.com    [QR]      │  <- watermark
└──────────────���──────────────────┘
```

### Element Computation

Count planets (Sun through Saturn, 7 total) by their sign's element:
- Fire (Aries, Leo, Sagittarius): count → percentage
- Earth (Taurus, Virgo, Capricorn): count
- Air (Gemini, Libra, Aquarius): count
- Water (Cancer, Scorpio, Pisces): count

Dominant element → archetype label:
- Fire dominant: "The Catalyst" / "अग्नि प्रेरक"
- Earth dominant: "The Builder" / "भूमि निर्माता"
- Air dominant: "The Connector" / "वायु संयोजक"
- Water dominant: "The Intuitive" / "जल अन्तर्ज्ञानी"
- Tie: "The Balanced" / "संतुलित"

### Geometric Pattern

A 12-segment radial pattern where each segment represents a house:
- Segment color: element color of the house lord (Fire=amber, Earth=emerald, Air=sky, Water=indigo)
- Segment intensity: brighter if house has planets, dimmer if empty
- Central point: lagna degree as a gold dot
- This is NOT a traditional chart — it's abstract art derived from the chart

### Data Source

All data comes from `KundaliData`:
- `ascendant.sign` → rising sign name
- `planets[1].sign` → moon sign, `planets[1].nakshatra` → moon nakshatra
- `planets[0].sign` → sun sign
- `dashas[0]` → current mahadasha
- Planet-in-sign → element counting
- `yogasComplete` → find yogakaraka or strongest yoga

### Entry Point

- "Create Birth Poster" button on the kundali page (below the chart, above tabs)
- Opens a modal/overlay showing the poster preview
- Buttons: "Save Image" (client-side) · "Share" (Web Share) · "Copy Link" (shareable URL)

---

## Part 3: Daily Energy Weather Card

The "Daily Vibe Check" — shareable every morning.

### Content Layout (Square 1080x1080)

```
┌───���─────────────────────────────┐
│                                 │
│    ✦ TODAY'S ENERGY WEATHER ✦   │
│       26 April 2026             │
│                                 │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │   "Creative Chaos"      │   │  <- vibe title (large, gold)
│   │                         ���   │
│   └─────────────────────────┘   │
│                                 │
│   Moon in Rohini (Exalted)      │  <- key transit
��   Rahu Aspect Active            │  <- secondary influence
│                                 │
│   ✓ BEST FOR                    │
│   First dates · Brainstorming   │  <- green text
│   Art projects                  │
│                                 │
│   ✗ AVOID                       │
│   Signing contracts             │  <- red text
│   Major purchases               │
│                                 │
│   Energy: ████████░░ 78%        │  <- overall day score
│                                 │
│  dekhopanchang.com    [QR]      │
└───────��─────────────────────────┘
```

### Vibe Generation Logic

**File:** `src/lib/shareable/daily-vibe.ts`

Inputs: today's `PanchangData` (tithi, nakshatra, yoga, hora, transits)

1. **Vibe Title** — derived from dominant energy:
   - Moon exalted + good yoga → "Creative Abundance"
   - Rahu aspect + sharp nakshatra → "Creative Chaos"
   - Saturn hora dominant + Shani vara → "Deep Focus"
   - Multiple auspicious yogas → "Golden Window"
   - Varjyam/Rahu Kaal dominant → "Navigate Carefully"
   - Map ~20 vibe titles to combinations of nakshatra nature + yoga quality + transit energy

2. **Best For / Avoid** — derived from:
   - Nakshatra activity guide (existing `getNakshatraActivity()`)
   - Inauspicious period warnings (Rahu Kaal, Varjyam active)
   - Choghadiya quality for current period

3. **Energy Score** — simplified panchang quality 0-100:
   - Good tithi (+15), good nakshatra (+20), good yoga (+15), good karana (+10)
   - Sarvartha Siddhi active (+20), Amrit Kalam (+10)
   - Rahu Kaal penalty (-10), Varjyam penalty (-10)

### Entry Point

- "Share Today's Vibe" button on the panchang page (near the top, after five elements)
- Also auto-generated and cached for the home page widget
- No login required — works for everyone based on location

---

## Part 4: Yoga Achievement Badges

The "Rare Achievement Unlocked" moment during kundali generation.

### Trigger

After chart generation, scan `yogasComplete` for rare yogas. If found, show an achievement animation before the chart renders.

### Rarity Classification

```typescript
interface YogaBadge {
  yogaName: string;
  rarity: 'legendary' | 'rare' | 'uncommon';
  percentage: string;   // "~5% of charts"
  quality: string;      // "Venusian Excellence"
  description: string;  // 1 sentence
}
```

Rarity mapping (from `yogasComplete` categories):
- **Legendary (<3%):** Pancha Mahapurusha (Hamsa, Malavya, Ruchaka, Bhadra, Shasha), Kaal Sarpa full
- **Rare (3-10%):** Gajakesari, Budhaditya, Viparita Raja Yoga, Neecha Bhanga Raja Yoga
- **Uncommon (10-20%):** Chandra-Mangala, Lakshmi Yoga, Saraswati Yoga, Dhana Yogas

### Card Layout (Square 1080x1080)

```
┌─────────────────────────────────┐
│                                 │
│   ★ RARE ACHIEVEMENT UNLOCKED  │  <- gold animation
│                                 │
│   ┌─────────────────────────┐   │
│   │                         │   │
│   │   [Yoga Symbol/Glyph]  │   │  <- abstract geometric
│   │                         │   │
│   └─────────────���───────────┘   │
│                                 │
│      GAJAKESARI YOGA            │  <- large, gold
│    "Wisdom & Prosperity"        │  <- quality subtitle
│                                 │
│   Jupiter in kendra from Moon   │  <- formation rule
│   Found in ~8% of charts        │  <- rarity stat
│                                 │
│   [Person Name]'s Birth Chart   │  <- personalization
│                                 │
│  dekhopanchang.com    [QR]      │
└─────────────────��───────────────┘
```

### Animation

On the kundali page, when a rare yoga is detected:
- Brief overlay (2 seconds): dark backdrop + gold particle effect + badge card slides in
- "Share This" button on the badge
- Dismissible — the chart loads normally behind it

CSS-only animation (no Framer Motion for this — keep it lightweight):
- `@keyframes badge-reveal` — scale from 0.8 to 1.0 with opacity fade
- Gold shimmer effect on the border using `background-position` animation

### Entry Point

- Auto-triggered after kundali generation (if rare yoga found)
- Also accessible from RemediesTab/YogasTab: "Share your [Yoga Name]" button
- Shareable URL: `/card/yoga-badge/abc123?yoga=gajakesari`

---

## Part 5: File Structure

| File | Purpose |
|------|---------|
| `src/lib/shareable/card-base.ts` | **NEW** — shared types, element computation, watermark data |
| `src/lib/shareable/birth-poster.ts` | **NEW** — birth poster data assembly |
| `src/lib/shareable/daily-vibe.ts` | **NEW** — vibe title generation, energy scoring |
| `src/lib/shareable/yoga-badges.ts` | **NEW** — rarity classification, badge data |
| `src/app/api/card/[type]/route.ts` | **NEW** — server-side image generation via Satori |
| `src/app/[locale]/card/[type]/[id]/page.tsx` | **NEW** — shareable card page with OG meta |
| `src/components/shareable/BirthPosterCard.tsx` | **NEW** — React component (renders as SVG for Satori) |
| `src/components/shareable/DailyVibeCard.tsx` | **NEW** — daily vibe card component |
| `src/components/shareable/YogaBadgeCard.tsx` | **NEW** — yoga badge component |
| `src/components/shareable/ShareCardButton.tsx` | **NEW** — Web Share API + save + copy link |
| `src/components/shareable/CardPreviewModal.tsx` | **NEW** — modal overlay for card preview + share actions |
| `src/app/[locale]/kundali/page.tsx` | **MODIFY** — add "Create Birth Poster" button + yoga badge trigger |
| `src/app/[locale]/panchang/PanchangClient.tsx` | **MODIFY** — add "Share Today's Vibe" button |

---

## Part 6: Technical Considerations

### Satori Constraints
- Satori renders a subset of CSS (flexbox only, no grid)
- Font files must be loaded as ArrayBuffer — use the app's existing Google Font files
- Images (QR code) must be base64-encoded
- Test each card template in Satori before building the full pipeline

### QR Code Generation
- Use `qrcode` npm package (lightweight, server-side)
- Generate as SVG string → embed in Satori composition
- QR links to the card's shareable URL

### Caching
- Daily vibe cards: cache for 24 hours per location (same panchang = same vibe)
- Birth poster: cache indefinitely per chartId (birth data doesn't change)
- Yoga badges: cache per chartId + yoga name

### Performance
- Server-side generation takes 200-500ms per card (Satori + PNG encoding)
- Client-side html-to-image takes 100-300ms
- Shareable URLs use ISR or on-demand generation with Edge caching

---

## What This Is NOT

- Not AI-generated content (vibe titles are from a deterministic mapping, not LLM)
- Not a social network (no feeds, no follows, no comments)
- Not changing any existing functionality (all additive)
- Not requiring login for daily vibe cards (location-based, open to all)
- Birth poster and yoga badges require a generated kundali (login optional — works with one-time generation)

---

## Implementation Order

1. Sharing infrastructure (card-base, ShareCardButton, Satori API route)
2. Birth Poster (data assembly + card component + kundali page button)
3. Daily Vibe (vibe engine + card component + panchang page button)
4. Yoga Badges (rarity engine + card component + kundali page trigger)
5. Shareable URL pages with OG meta

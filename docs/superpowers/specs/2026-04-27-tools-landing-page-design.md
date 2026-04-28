# Tools Landing Page — Design Spec

**Date:** 2026-04-27
**Status:** Approved

## Overview

Create a `/[locale]/tools` landing page displaying 20 Jyotish tools as a 4×5 tarot card grid. Uses the existing `TarotCard` component (`size="full"`) with bold multi-layered SVG icons matching the panchang mega card style.

## Layout

- **Route:** `/[locale]/tools/page.tsx` (client component)
- **Hero:** "Jyotish Tools" h1 with gold gradient, one-line subtitle
- **Grid:** 4 rows × 5 cards, each row preceded by a subtle gold uppercase label
- **Grid classes:** `grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 auto-rows-fr`
- **Row spacing:** `-mt-4` between rows (tight like panchang)
- **Footer:** ShareRow + AuthorByline + AdUnit

## The 20 Cards

### Row 1 — Daily Timing
| # | Title | Subtitle | href | glowColor |
|---|-------|----------|------|-----------|
| 1 | Rahu Kaal | Inauspicious Period | `/rahu-kaal` | `#ef4444` |
| 2 | Choghadiya | 8-fold Day & Night | `/choghadiya` | `#d4a853` |
| 3 | Hora | Planetary Hours | `/hora` | `#8b5cf6` |
| 4 | Dinacharya | Ayurvedic Routine | `/dinacharya` | `#22d3ee` |
| 5 | Vedic Time | Ghati · Pala · Vipala | `/vedic-time` | `#fb923c` |

### Row 2 — Chart & Doshas
| # | Title | Subtitle | href | glowColor |
|---|-------|----------|------|-----------|
| 6 | Rashi Calculator | Sign · Tropical · Shift | `/sign-calculator` | `#d4a853` |
| 7 | Sade Sati | Saturn's 7½ Year Transit | `/sade-sati` | `#60a5fa` |
| 8 | Kaal Sarpa | Rahu-Ketu Axis Dosha | `/kaal-sarp` | `#f43f5e` |
| 9 | Mangal Dosha | Mars Affliction Check | `/mangal-dosha` | `#f43f5e` |
| 10 | Cosmic Blueprint | Your Celestial Signature | `/cosmic-blueprint` | `#6366f1` |

### Row 3 — Divination & Specialized
| # | Title | Subtitle | href | glowColor |
|---|-------|----------|------|-----------|
| 11 | Prashna | Horary + Ashtamangala | `/prashna` | `#8b5cf6` |
| 12 | Sarvatobhadra | 28-Nakshatra Chakra | `/sarvatobhadra` | `#2dd4bf` |
| 13 | Medical Jyotish | Body · Planet · Disease | `/medical-astrology` | `#ec4899` |
| 14 | Financial Jyotish | Markets & Planetary Cycles | `/financial-astrology` | `#34d399` |
| 15 | Mundane Jyotish | Nations · Weather · Fate | `/mundane` | `#fb923c` |

### Row 4 — Life Events & Sky
| # | Title | Subtitle | href | glowColor |
|---|-------|----------|------|-----------|
| 16 | Baby Names | Nakshatra Syllables | `/baby-names` | `#d4a853` |
| 17 | Kaal Nirnaya | Right Time for Everything | `/kaal-nirnaya` | `#8b5cf6` |
| 18 | Nadi Jyotish | Palm-Leaf Traditions | `/nadi-jyotish` | `#2dd4bf` |
| 19 | Lunar Calendar | Moon Phase Panchang | `/lunar-calendar` | `#d4a853` |
| 20 | Live Sky | Real-time Graha Positions | `/sky` | `#38bdf8` |

## SVG Icons

Each card gets a unique 128×128 bold SVG icon with:
- `radialGradient` colored glow matching `glowColor`
- `linearGradient` gold gradient (`#f0d48a` → `#d4a853` → `#8a6d2b`)
- Multi-layered geometric shapes with 2-2.5px strokes
- Scattered star dots at various opacities
- Filled shapes at low opacity for depth

**Sade Sati:** Reuse the existing SVG from the homepage (`src/app/[locale]/page.tsx`).

Mockup reference: `.superpowers/brainstorm/11902-1777293106/content/tools-grid-v2.html`

## Navbar Update

Update the Tools dropdown in `Navbar.tsx` to:
1. Add a "View All Tools →" link at top pointing to `/tools`
2. Group the 20 items under 4 section headers matching the row labels
3. Remove items that were absorbed (nivas-shool → absorbed into kaal-nirnaya, upagraha → absorbed into kundali page, sign-shift + tropical-compare → covered by sign-calculator)

## Integration Checklist

- [ ] Add to sitemap (`/app/sitemap.ts`) with multilingual alternates
- [ ] Add SEO metadata via `layout.tsx` + `getPageMetadata()`
- [ ] i18n: inline LABELS object (en/hi/ta/bn), no locale file needed
- [ ] Add to footer "Tools" column
- [ ] Cross-link from dashboard

## Absorbed/Removed Tools

These are NOT cards but are still accessible via their existing routes:
- `/tropical-compare` — tab within Rashi Calculator
- `/sign-shift` — tab within Rashi Calculator  
- `/nivas-shool` — section within Kaal Nirnaya
- `/upagraha` — section within Kundali page
- `/prashna-ashtamangala` — tab within Prashna

## Not In Scope

- Dosha tool pages (Kaal Sarpa sub-types, Mangal Dosha checker) — separate workstream
- Learn pages for doshas — separate workstream
- Shraddha, Devotional, Muhurta AI — remain under Rituals dropdown, not in Tools

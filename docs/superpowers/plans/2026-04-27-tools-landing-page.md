# Tools Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create a `/[locale]/tools` landing page with 20 Jyotish tools displayed as a 4×5 tarot card grid, update the navbar Tools dropdown, and add to sitemap.

**Architecture:** Single client-side page component using the existing `TarotCard` component with inline SVG icons. Each of the 20 cards links to its existing tool page. Navbar gets trimmed from 23 flat items to 20 grouped items with a "View All Tools" link.

**Tech Stack:** Next.js App Router, TarotCard component, Framer Motion, next-intl (inline LABELS)

**Spec:** `docs/superpowers/specs/2026-04-27-tools-landing-page-design.md`
**Mockup:** `.superpowers/brainstorm/11902-1777293106/content/tools-grid-v2.html`

---

### Task 1: Create the Tools Landing Page

**Files:**
- Create: `src/app/[locale]/tools/page.tsx`
- Create: `src/app/[locale]/tools/layout.tsx`

- [ ] **Step 1: Create the layout with SEO metadata**

Create `src/app/[locale]/tools/layout.tsx`:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Jyotish Tools — 20 Vedic Astrology Calculators | Dekho Panchang',
  description: 'Free Vedic astrology tools: Rahu Kaal, Choghadiya, Hora, Sade Sati, Kaal Sarpa Dosha, Mangal Dosha, Prashna, Sarvatobhadra Chakra, and more.',
  alternates: {
    languages: {
      en: '/en/tools',
      hi: '/hi/tools',
      ta: '/ta/tools',
      bn: '/bn/tools',
    },
  },
};

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
```

- [ ] **Step 2: Create the page component with all 20 cards**

Create `src/app/[locale]/tools/page.tsx`. This is a large file — it contains:
1. The `'use client'` directive and imports
2. 20 inline SVG icon functions (matching panchang card intensity)
3. The `TOOLS_GRID` data array (4 rows of 5 cards)
4. The page component rendering a hero + 4 grid rows of TarotCards

Key implementation details:

**Imports needed:**
```tsx
'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import TarotCard from '@/components/ui/TarotCard';
import { ShareRow } from '@/components/ui/ShareButton';
import AuthorByline from '@/components/ui/AuthorByline';
import AdUnit from '@/components/ads/AdUnit';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
```

**The TOOLS_GRID structure** — an array of 4 row objects, each with a label and 5 card entries:
```tsx
interface ToolCard {
  href: string;
  title: string;
  subtitle: string;
  description: string;
  glowColor: string;
  svg: React.ReactNode;
}

interface ToolRow {
  label: string;
  cards: ToolCard[];
}
```

**Row labels** (use inline `isDevanagari` ternary, not locale files):
- Row 1: "Daily Timing" / "दैनिक समय"
- Row 2: "Chart & Doshas" / "कुण्डली एवं दोष"
- Row 3: "Divination & Specialized" / "प्रश्न एवं विशेष"
- Row 4: "Life Events & Sky" / "जीवन एवं आकाश"

**Page title:** "Jyotish Tools" with gold gradient (same pattern as learn page h1)

**Grid rendering pattern** (repeat for each row):
```tsx
<div className="max-w-6xl mx-auto px-4">
  {ROWS.map((row, rowIdx) => (
    <div key={rowIdx}>
      <div className="text-gold-dark text-[11px] uppercase tracking-[3px] font-semibold mt-8 mb-3 ml-1">
        {row.label}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 sm:gap-5 auto-rows-fr mb-2">
        {row.cards.map((card) => (
          <TarotCard
            key={card.href}
            size="full"
            href={card.href}
            subtitle={card.subtitle}
            icon={card.svg}
            title={card.title}
            description={card.description}
            glowColor={card.glowColor}
          />
        ))}
      </div>
    </div>
  ))}
</div>
```

**SVG icons:** Each of the 20 cards needs a unique bold SVG. Source them as follows:
- **Rahu Kaal, Choghadiya, Hora:** Copy from `src/app/[locale]/panchang/PanchangClient.tsx` lines 1288, 1298, 1308 (the `tc1`, `tc2`, `tc3` SVGs — they're the exact same tools)
- **Sade Sati:** Copy the `SadeSatiSVG` function from `src/app/[locale]/page.tsx` line 296-317
- **Remaining 16 cards:** Create new bold SVGs matching the mockup in `.superpowers/brainstorm/11902-1777293106/content/tools-grid-v2.html`. Each SVG must:
  - Use `viewBox="0 0 64 64"` with `width={128} height={128}`
  - Include a `radialGradient` background glow matching the card's `glowColor`
  - Include the standard gold `linearGradient` (`#f0d48a` → `#d4a853` → `#8a6d2b`)
  - Use 2-2.5px strokes, multiple concentric shapes, scattered star dots
  - Use unique gradient IDs (prefix with tool abbreviation, e.g. `rk1`, `ch1`, `ho1`)

**Important:** Each SVG must use unique gradient IDs. Since all 20 SVGs render on the same page, ID collisions will cause wrong colors. Use a 2-3 letter prefix per card (e.g., `rk` for Rahu Kaal, `ch` for Choghadiya, `ss` for Sade Sati).

The 20 card entries with their `href`, `title`, `subtitle`, `description`, `glowColor`:

| href | title | subtitle | description | glowColor |
|------|-------|----------|-------------|-----------|
| `/rahu-kaal` | Rahu Kaal | Inauspicious Period | Daily inauspicious window | `#ef4444` |
| `/choghadiya` | Choghadiya | 8-fold Day & Night | Shubh · Labh · Amrit | `#d4a853` |
| `/hora` | Hora | Planetary Hours | 24-hour planetary cycle | `#8b5cf6` |
| `/dinacharya` | Dinacharya | Ayurvedic Routine | Dosha · Prahara · Routine | `#22d3ee` |
| `/vedic-time` | Vedic Time | Ancient Time Units | Ghati · Pala · Vipala | `#fb923c` |
| `/sign-calculator` | Rashi Calculator | Sign · Tropical · Shift | Find your Vedic sign | `#d4a853` |
| `/sade-sati` | Sade Sati | Saturn's 7½ Year Transit | Saturn over your Moon | `#60a5fa` |
| `/kaal-sarp` | Kaal Sarpa | Rahu-Ketu Axis Dosha | 12 serpent formations | `#f43f5e` |
| `/mangal-dosha` | Mangal Dosha | Mars Affliction | Marriage compatibility check | `#f43f5e` |
| `/cosmic-blueprint` | Cosmic Blueprint | Celestial Signature | Your celestial DNA | `#6366f1` |
| `/prashna` | Prashna | Horary + Ashtamangala | Ask the stars a question | `#8b5cf6` |
| `/sarvatobhadra` | Sarvatobhadra | 28-Nakshatra Chakra | Vedic transit analysis | `#2dd4bf` |
| `/medical-astrology` | Medical Jyotish | Health & Planets | Body · Planet · Disease links | `#ec4899` |
| `/financial-astrology` | Financial Jyotish | Markets & Cycles | Planetary market cycles | `#34d399` |
| `/mundane` | Mundane Jyotish | World Events | Nations · Weather · Fate | `#fb923c` |
| `/baby-names` | Baby Names | Nakshatra Syllables | Names by birth nakshatra | `#d4a853` |
| `/kaal-nirnaya` | Kaal Nirnaya | Auspicious Timing | Right time for everything | `#8b5cf6` |
| `/nadi-jyotish` | Nadi Jyotish | Palm-Leaf Traditions | Ancient leaf inscriptions | `#2dd4bf` |
| `/lunar-calendar` | Lunar Calendar | Tithi · Masa · Paksha | Moon phase panchang | `#d4a853` |
| `/sky` | Live Sky | Real-time Positions | Graha positions now | `#38bdf8` |

- [ ] **Step 3: Verify the page renders**

Run: `npx next dev --turbopack`
Open: `http://localhost:3000/en/tools`
Check: All 20 cards render, hover animations work, clicking a card navigates to the tool page.

- [ ] **Step 4: Run build**

Run: `npx next build`
Expected: 0 errors

- [ ] **Step 5: Commit**

```bash
git add src/app/\[locale\]/tools/
git commit -m "feat: tools landing page — 20 Jyotish tools as 4×5 tarot card grid"
```

---

### Task 2: Update Navbar Tools Dropdown

**Files:**
- Modify: `src/components/layout/Navbar.tsx` (lines ~142-169)

- [ ] **Step 1: Replace the flat tools list with grouped items**

In `Navbar.tsx`, replace the current `children` array for the tools menu (lines 144-168) with:

1. A "View All Tools →" link at the top: `{ href: '/tools', label: t('allTools') }`
2. The 20 items grouped into sections. The navbar dropdown rendering may need a `section` separator — check how it currently renders `children` and decide if section headers fit the existing pattern, or just reorder the items to match the 4 rows.

Remove these items that are absorbed:
- `/tropical-compare` (covered by sign-calculator)
- `/sign-shift` (covered by sign-calculator)
- `/prashna-ashtamangala` (covered by prashna)
- `/nivas-shool` (absorbed into kaal-nirnaya)
- `/upagraha` (absorbed into kundali)
- `/sky-map` (merged into sky)

Add these items that were missing:
- `/sade-sati` (was under Kundali)
- `/kaal-sarp` (new)
- `/mangal-dosha` (new)

Add the translation key `allTools` to the navbar's LABELS/translations object:
```
allTools: { en: 'All Tools →', hi: 'सभी उपकरण →', ... }
```

- [ ] **Step 2: Verify navbar renders correctly**

Open: `http://localhost:3000/en/panchang`
Hover: "Tools" dropdown
Check: "View All Tools →" at top, 20 items below, no absorbed items visible

- [ ] **Step 3: Build check**

Run: `npx next build`
Expected: 0 errors

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Navbar.tsx
git commit -m "feat: update tools navbar — grouped 20 items, 'View All Tools' link"
```

---

### Task 3: Add to Sitemap and Footer

**Files:**
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add `/tools` to sitemap**

In `src/app/sitemap.ts`, add `/tools` to the routes array near the existing tools section (around line 145):

```tsx
  // Tools
  '/tools',
  '/medical-astrology',
  ...
```

Also add `/kaal-sarp` and `/mangal-dosha` if not already present.

- [ ] **Step 2: Build check**

Run: `npx next build`
Expected: 0 errors, `/tools` appears in the build output routes

- [ ] **Step 3: Commit**

```bash
git add src/app/sitemap.ts
git commit -m "feat: add /tools to sitemap"
```

---

### Task 4: Browser Verification

- [ ] **Step 1: Full page test**

Start: `npx next dev --turbopack`
Navigate to: `http://localhost:3000/en/tools`

Check:
- [ ] Hero renders with "Jyotish Tools" gold gradient title
- [ ] 4 row labels visible (Daily Timing, Chart & Doshas, etc.)
- [ ] 20 tarot cards render in a 5-column grid on desktop
- [ ] Each card has: subtitle, star dots, bold SVG icon, divider, title, description
- [ ] Hover animation works (scale 1.05, lift -8px)
- [ ] Click any card → navigates to the correct tool page
- [ ] Responsive: 3 columns on tablet, 2 on mobile
- [ ] No console errors

- [ ] **Step 2: Navbar test**

- [ ] "Tools" dropdown shows "View All Tools →" at top
- [ ] Click "View All Tools →" navigates to `/en/tools`
- [ ] Absorbed items (tropical-compare, sign-shift, etc.) are gone

- [ ] **Step 3: Hindi locale test**

Navigate to: `http://localhost:3000/hi/tools`
Check: Row labels and card titles render in Hindi/Devanagari

- [ ] **Step 4: Final build**

Run: `npx next build`
Expected: 0 errors

- [ ] **Step 5: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix: tools page polish after browser verification"
```

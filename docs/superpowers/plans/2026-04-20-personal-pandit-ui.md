# Personal Pandit — UI Implementation Plan (Phase 2-5)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the 3-layer UI for the Personal Pandit experience — dashboard (Layer 1), domain deep dives (Layer 2), and technical details toggle (Layer 3).

**Architecture:** New components consume `synthesizeReading()` from the domain synthesis engine (already built). The kundali page is restructured: dashboard is the default view, existing 21 tabs move behind a toggle.

**Tech Stack:** React 19, Next.js App Router, Tailwind CSS v4, Framer Motion (sparingly), custom SVG icons.

**Spec:** `docs/superpowers/specs/2026-04-20-personal-pandit-design.md` sections "Visual Language" + "The 9 Domain Cards" + "Domain Deep Dive Structure" + addenda A1-A14.

---

## Task 1: Domain SVG Illustrations (8 icons)

**Files:**
- Create: `src/components/icons/DomainIcons.tsx`

8 custom SVG illustrations following the existing icon system (NakshatraIcons, GrahaIcons):
- Style: abstract/geometric, gold gradient (f0d48a → d4a853 → 8a6d2b), glow filters
- ViewBox: 120×80, scalable
- Stroke width 1.5px, corner radius 2px

Icons: HealthIcon, WealthIcon, CareerIcon, MarriageIcon, ChildrenIcon, FamilyIcon, SpiritualIcon, EducationIcon

Each is a named export. Use the gold gradient defs pattern from GrahaIcons.tsx.

---

## Task 2: Domain Card Component

**Files:**
- Create: `src/components/kundali/DomainCard.tsx`

Props: `{ reading: DomainReading, locale: string, onClick: () => void }`

Renders:
- SVG illustration from DomainIcons at top
- Domain name (heading font) + Vedic name (devanagari font)
- Traffic-light rating bar along left edge (full height)
- Dual rating (addendum A2): natal bar (left edge) + current activation dot (top-right)
- Headline text (1-2 lines)
- Activation badge
- Hover: lift + glow matching rating color (CSS transition, not Framer)

Rating colors: uttama=#34d399, madhyama=#d4a853, adhama=#f59e0b, atyadhama=#ef4444

---

## Task 3: Current Period Card Component

**Files:**
- Create: `src/components/kundali/CurrentPeriodCard.tsx`

Props: `{ period: CurrentPeriodReading, locale: string }`

Renders:
- Full-width dark gradient background
- Left: large pulsing traffic-light dot + dasha period name
- Right: mini progress bar (% through antardasha)
- Bottom: upcoming dates as pill badges
- Interaction theme text
- Guidance text
- CSS orbital animation (subtle, not Framer)

---

## Task 4: Life Reading Dashboard (Layer 1)

**Files:**
- Create: `src/components/kundali/LifeReadingDashboard.tsx`

Props: `{ reading: PersonalReading, locale: string, onDomainClick: (domain: DomainType) => void, onToggleTechnical: () => void }`

Renders:
- Life overview text (addendum A1) at the very top — 2-3 sentence elevator pitch
- CurrentPeriodCard (full-width)
- 8 DomainCards in 2×4 grid (desktop) / single column (mobile)
- Cross-domain links section (addendum A3) below the grid — 3-5 connections
- "Advanced: Technical Chart Data ▾" toggle bar at bottom

---

## Task 5: Forward Timeline Component

**Files:**
- Create: `src/components/kundali/ForwardTimeline.tsx`

Props: `{ triggers: TimelineTrigger[], locale: string }`

Renders:
- Horizontal scrollable track
- Colored nodes at each trigger (green/gold/amber/red based on ratingImpact)
- "You are here" pulsing dot at current date
- Date above each node, headline below
- Connecting line that shifts color
- Green highlighted zones for favorable windows

---

## Task 6: Domain Deep Dive Component (Layer 2)

**Files:**
- Create: `src/components/kundali/DomainDeepDive.tsx`

Props: `{ reading: DomainReading, kundali: KundaliData, locale: string, nativeAge?: number, onBack: () => void }`

Renders 5 sections:
A. **Natal Promise** — house analysis prose, yoga/dosha pills, strength bars
B. **Current Activation** — dasha context, transit info, current rating
C. **Forward Timeline** — ForwardTimeline component
D. **Remedies** — gemstone swatches, mantras in Devanagari, practices
E. **"Consult Your Personal Pandit"** — premium button (fixed bottom)

Back button returns to dashboard.

---

## Task 7: Kundali Page Integration

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx`

Restructure the page:
1. After chart generation, call `synthesizeReading(kundali)` 
2. Default view = LifeReadingDashboard (Layer 1)
3. Domain click → show DomainDeepDive (Layer 2) with slide transition
4. "Advanced" toggle → reveal existing tab strip (Layer 3)
5. State: `view: 'dashboard' | 'deepDive' | 'technical'` + `activeDomain: DomainType | null`
6. Lazy compute per addendum A8: dashboard cards on initial render, deep dive on demand

This is the biggest task — carefully preserve all 21 existing tab functionality behind the toggle.

---

## Task 8: Polish + Responsive + Accessibility

**Files:**
- Modify: all new components

- Mobile: grid collapses to single column, timeline scrolls horizontally
- Accessibility: ARIA grid on dashboard, rating aria-labels, keyboard nav (Tab/Enter/Escape)
- Colorblind: text labels alongside rating colors (U/M/A/X)
- Focus management: deep dive traps focus, closing returns to card
- Print: domain deep dive has print-optimized layout

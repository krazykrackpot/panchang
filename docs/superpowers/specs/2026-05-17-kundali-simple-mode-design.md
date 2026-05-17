# Kundali Simple Mode — Design Spec

> **Status:** FINALISED
> **Date:** 2026-05-17
> **Guiding criteria:** Engagement (time on page, return visits) + Shareability (screenshot/share rate)

---

## 1. Problem

The kundali page has 23 tabs, 3,680 lines, and 45 dynamic imports. It serves Jyotish practitioners well but overwhelms the 60-70% of users who are complete beginners. These users want to know "what does my chart say about ME?" — not navigate Shadbala tables.

The current progressive disclosure (Summary → Domain Dive → Technical) helps but the Summary View itself is still dense with domain cards, tippanni text, and cross-domain links. Beginners need something simpler, more visual, and more emotionally resonant.

---

## 2. Solution

Two modes with a persistent toggle:

- **Simple Mode** (default for new users) — a new `KundaliSimple.tsx` component. Identity-first, visual, plain language, shareable. No chart diagram, no tabs, no Sanskrit terminology.
- **Expert Mode** — the existing `Client.tsx`, completely unchanged. Zero modifications. Zero risk.

The parent page conditionally renders one or the other based on `localStorage.getItem('kundali-view-mode')`. Default: `'simple'`.

---

## 3. Simple Mode — Section by Section

### 3.1 Mode Toggle

A pill at the top-right: **Simple ◆ | Expert**. Persisted in localStorage. Clicking Expert loads the existing Client.tsx. Clicking Simple loads KundaliSimple.tsx. Both receive the same `KundaliData` + `locale` props.

### 3.2 Cosmic Identity — Synthesis Hero Card

A full-width TarotCard-style card (ornate gold borders, corner flourishes, celestial noise texture, radial glow — matching the existing `TarotCard.tsx` quality bar).

**Content:**
- New `ArchetypeIcon` SVG component — bold, multi-layered, tarot-style. 9 icons, one per archetype (Sovereign, Empath, Warrior, Analyst, Visionary, Harmonizer, Architect, Maverick, Mystic). Same gold gradient (#f0d48a → #d4a853 → #8a6d2b) + glow filter style as RashiIcons/NakshatraIcons.
- Archetype name from `generateCosmicBlueprint()` (existing archetype-engine.ts)
- Rising / Moon / Star one-line summary below the name
- Poetic italic description (2-3 sentences) from archetype `coreDescription`
- Guiding planet (strongest by Shadbala) with exaltation/dignity note

**Shareability:** This card is designed to be screenshotted. The archetype name ("The Pioneering Sage") becomes the user's identity anchor — shareable on WhatsApp/Instagram stories. The `/api/card/blueprint` endpoint already generates a PNG version of this.

**Data source:** `generateCosmicBlueprint(kundali)` — already computed, currently shown only in the Blueprint tab. Requires `kundali.fullShadbala` for strength-based archetype selection. If `fullShadbala` is unavailable (simplified chart), falls back to dignity-based archetype (exalted planet → primary archetype).

### 3.3 Three Individual Tarot Cards — "Your Three Faces"

Three side-by-side TarotCard-style cards, laid out horizontally. The Moon card (centre) is slightly elevated — it's the most important in Vedic astrology.

| Card | Label | Icon Source | Archetype | Colour Glow |
|---|---|---|---|---|
| Left | "Your Mask" (Rising) | `RashiIconById` (existing, 12 SVGs) | Lagna sign archetype | Red-orange |
| Centre | "Your Heart" (Moon) | `RashiIconById` (existing) | Moon sign archetype | Green |
| Right | "Your Star" (Nakshatra) | `NakshatraIconById` (existing, 27 SVGs) | Nakshatra archetype | Gold |

Each card shows:
- Label ("Your Mask" / "Your Heart" / "Your Star")
- Star dots decorative divider
- Bold SVG icon (existing, not emoji)
- Sign/Nakshatra name
- Archetype sub-name (e.g., "The Warrior", "The Builder", "The Creator")
- Poetic one-liner in italic

**Archetype sub-names:** Derived from sign characteristics. A lookup table of 12 rashi archetypes + 27 nakshatra archetypes. Not computed — static data, curated for emotional resonance.

**Shareability:** Three-card spread is inherently shareable. Users photograph this layout for Instagram stories. The visual hierarchy (elevated centre card) draws the eye.

**Mobile layout:** On screens <480px, the three cards use a horizontal scroll (swipeable carousel) with snap points — each card snaps to centre. Moon card is the initial scroll position. On desktop, all three are visible side-by-side with the Moon card elevated. The cards must be at least 140px wide (matching existing TarotCard minimum) to remain readable.

### 3.4 Ashram Stage

A card showing the user's current life stage based on age (derived from birth date in `KundaliData.birthData.date`).

| Age Range | Ashram | Sanskrit | Focus Areas |
|---|---|---|---|
| 0–25 | Brahmacharya | ब्रह्मचर्य | Learning, discipline, foundation-building |
| 25–50 | Grihastha | गृहस्थ | Career, family, wealth creation, dharmic service |
| 50–75 | Vanaprastha | वानप्रस्थ | Mentoring, giving back, spiritual deepening |
| 75+ | Sannyasa | संन्यास | Moksha, inner peace, legacy |

**Content:** Ashram name (English + Sanskrit), one-sentence description, 3-4 focus area pills. The focus areas are contextualised by the chart — e.g., a Grihastha with strong 10th house gets "Career Leadership" instead of generic "Career Growth".

**Why this matters for engagement:** It tells the user "here's what you should focus on NOW" — actionable, personal, age-appropriate. Every user's ashram is different (or feels different), which makes it feel personalised.

### 3.5 Life Domain Rings — Three-Ring System

Four domain cards (Career, Relationships, Health, Wealth), each with three concentric rings:

- **Outer (green/amber/red):** Overall blended verdict
- **Middle (blue):** Natal promise — what the birth chart says (permanent)
- **Inner (amber/red):** Current activation — how dasha/transits are energising it now

Below the rings: domain name, verdict label, and a 3-line explanation:
- `●` Natal: one-line birth chart observation
- `●` Current: one-line dasha/transit observation
- `●` Overall: one-line synthesis

**Data source:** Domain verdicts computed on mount via `buildDomainVerdicts()` from the AI Pandit context builder (already proven on raw `KundaliData` — no `PersonalReading` dependency). Falls back to the lightweight scorer if the full domain synthesis is unavailable. NOTE: `synthesizePersonalReading()` is NOT available on `KundaliData` — it's computed separately in the dashboard. Simple mode must NOT depend on it.

**Tap interaction:** Tapping a domain card expands it to show the full domain reading (headline, narrative, remedies) inline — no page navigation. This is a lightweight version of the existing Domain Deep Dive.

**Ring legend:** A small footer: `● Overall · ● Birth Chart · ● Current Period`

### 3.6 Life Timeline

A simplified dasha timeline showing:
- A horizontal progress bar (past periods in grey, current period in colour, future transparent)
- Current Mahadasha: planet symbol, name, date range, plain-language description
- Current Antardasha: indented below with same format

**Plain language:** "Saturn Period (2023–2042) — A long phase of discipline, structure, and earned rewards. Career builds slowly but solidly." NOT "Shani Mahadasha — शनि महादशा."

**Data source:** `kundali.dashas[]` — find active maha/antar by date. Descriptions from archetype engine's `chapterDescription` field.

### 3.7 Key Strengths (Yogas Translated)

3-5 bullet points translating detected auspicious yogas into plain language:
- "✦ **Wisdom & Public Recognition** — Jupiter and Moon in powerful positions bring natural wisdom"
- "✦ **Sharp Intellect** — Sun-Mercury combination gives analytical brilliance"

**Data source:** `kundali.evaluatedYogas` filtered to `present && isAuspicious`, top 3-5 by strength. Yoga `name.en` mapped to a plain-language equivalent via a lookup table (e.g., "Gajakesari Yoga" → "Wisdom & Public Recognition").

### 3.8 Areas for Growth (Doshas Reframed)

Doshas presented as gentle growth opportunities, not alarming warnings:
- "**Relationships need patience** — A karmic pattern suggests delayed but ultimately stable partnerships. Remedies can smooth the path."

NO red banners. NO "Kaal Sarpa Dosha — ACTIVE" alarms. The word "dosha" does not appear in Simple mode. Remedies are mentioned as available, with a link to the Remedies section in Expert mode.

**Data source:** `kundali.evaluatedYogas` filtered to `present && !isAuspicious`, mapped to gentle language via a lookup table.

### 3.9 Actions Footer

Two prominent buttons + escape hatch:
- **📤 Share My Chart** — triggers the birth poster share (existing `ShareBirthPosterButton`)
- **📊 Full Report (PDF)** — triggers the PDF download (existing `DownloadReportButton`)
- **"Want the full technical chart? Switch to Expert Mode →"** — dashed border, subtle, always visible

---

## 4. What Simple Mode Does NOT Show

- No chart diagram (North/South Indian diamond) — beginners can't read it
- No 23 technical tabs
- No Sanskrit terminology (except Ashram names, which are culturally resonant)
- No dosha banners (Manglik, Kaal Sarpa, Ganda Mula)
- No InfoBlock educational text
- No Ashtakavarga, Shadbala, Bhavabala, Avasthas, Argala, Sphutas tables
- No Jaimini, KP, Sudarshana, Nadi Amsha tabs

All of this remains available in Expert mode — one toggle away.

---

## 5. Expert Mode

**The existing `Client.tsx` is the Expert mode. Zero modifications.**

The only change to `Client.tsx`: none. The parent page (`page.tsx` or a wrapper) handles the toggle and conditionally renders `<KundaliSimple>` or `<KundaliClient>`.

---

## 6. New Components

| Component | File | Purpose | Lines (est.) |
|---|---|---|---|
| `KundaliSimple` | `src/components/kundali/KundaliSimple.tsx` | Main Simple mode container | ~400 |
| `CosmicIdentityCard` | `src/components/kundali/simple/CosmicIdentityCard.tsx` | Synthesis hero + three tarot cards | ~250 |
| `AshramStage` | `src/components/kundali/simple/AshramStage.tsx` | Life stage card | ~80 |
| `DomainRingsCard` | `src/components/kundali/simple/DomainRingsCard.tsx` | Three-ring domain card (reusable × 4) | ~120 |
| `SimpleTimeline` | `src/components/kundali/simple/SimpleTimeline.tsx` | Simplified dasha timeline | ~100 |
| `StrengthsList` | `src/components/kundali/simple/StrengthsList.tsx` | Yogas in plain language | ~60 |
| `GrowthAreas` | `src/components/kundali/simple/GrowthAreas.tsx` | Doshas reframed gently | ~60 |
| `ArchetypeIcons` | `src/components/icons/ArchetypeIcons.tsx` | 9 bold SVG archetype icons | ~350 |
| `ViewModeToggle` | `src/components/kundali/simple/ViewModeToggle.tsx` | Simple/Expert pill toggle | ~30 |

**Data files (new):**
| File | Purpose |
|---|---|
| `src/lib/constants/rashi-archetypes.ts` | 12 rashi archetype names + one-liners |
| `src/lib/constants/nakshatra-archetypes.ts` | 27 nakshatra archetype names + one-liners |
| `src/lib/constants/yoga-plain-names.ts` | Top ~30 yoga name → plain language mapping. Remaining 180+ use generic pattern: yoga description first sentence. |
| `src/lib/constants/dosha-gentle-text.ts` | Dosha → gentle growth-area text |
| `src/lib/constants/ashram-data.ts` | 4 ashrams with descriptions + focus areas |

**Total new code:** ~1,450 lines across ~14 files. No existing files modified except the parent page wrapper.

---

## 7. Integration

The kundali page (`src/app/[locale]/kundali/page.tsx` or `Client.tsx` wrapper) adds:

```typescript
const viewMode = typeof window !== 'undefined'
  ? localStorage.getItem('kundali-view-mode') ?? 'simple'
  : 'simple';

return viewMode === 'simple'
  ? <KundaliSimple kundali={kundali} locale={locale} onSwitchToExpert={() => { localStorage.setItem('kundali-view-mode', 'expert'); router.refresh(); }} />
  : <KundaliClient {...existingProps} />;
```

This is the ONLY change to the existing code path. `KundaliClient` is never touched.

---

## 8. Shareability Optimisation

Every section is designed with sharing in mind:

| Section | Share Mechanism | Viral Potential |
|---|---|---|
| Synthesis Hero Card | Screenshot + `/api/card/blueprint` PNG | High — "I'm a Pioneering Sage!" identity anchoring |
| Three Tarot Cards | Screenshot (designed for Instagram story aspect ratio) | Very high — three-card spread is visually striking |
| Domain Rings | Screenshot | Medium — "My career is 8.5/10!" |
| Archetype Name | Text share via existing ShareButton | High — becomes the user's identity label |

The synthesis card and three-card spread are sized for mobile screenshot (full-width, vertical). The gold-on-dark aesthetic photographs well on OLED screens (the dominant Indian mobile display type).

---

## 9. Engagement Metrics

**Success criteria (measurable after 2 weeks):**

| Metric | Current (est.) | Target |
|---|---|---|
| Time on kundali page (new users) | ~45s (bounce after confusion) | 2+ minutes |
| Share rate (kundali page) | ~2% (existing share button) | 8-10% |
| Expert mode toggle rate | N/A | 15-20% (meaning 80% are happy with Simple) |
| Return visits to kundali page | ~10% next-day return | 20% |

---

## 10. Scope Boundary

**In scope:**
- All 9 new components listed in §6
- All 5 data files
- Parent page wrapper for conditional rendering
- 9 new ArchetypeIcon SVGs
- localStorage toggle

**Out of scope:**
- Dashboard Simple mode (separate spec)
- Modifications to existing Client.tsx
- New API routes
- Database changes
- i18n message files (Simple mode uses inline LABELS pattern)

---

## 11. Loading State

Simple mode computes `generateCosmicBlueprint()` and `buildDomainVerdicts()` on mount (~50-100ms on mobile). During computation, render a skeleton shimmer matching the card layout — gold-gradient pulse on dark background. The shimmer layout mirrors the final layout (hero card shape, three card shapes, four ring shapes) so there's no layout shift when data arrives.

---

## 12. Self-Review

1. **Placeholder scan:** No TBDs. All sections fully specified. Data sources identified for every component.
2. **Internal consistency:** Simple mode renders from `KundaliData` (same as Expert). Domain verdicts use `buildDomainVerdicts()` from AI Pandit context builder — does NOT depend on `PersonalReading` (which is dashboard-only). Archetype uses `generateCosmicBlueprint()` with `fullShadbala` fallback documented.
3. **Scope check:** Focused on Simple mode only. Dashboard is explicitly deferred. Expert mode is explicitly untouched.
4. **Ambiguity check:**
   - "Archetype sub-names for rashis/nakshatras" — static curated strings in lookup tables, not computed. Clear.
   - "Plain language yoga names" — top 30 mapped explicitly, rest use first sentence of description. Clear.
   - "Age-based ashram" — simple arithmetic from birth date. Clear.
   - "Three-card mobile layout" — swipeable carousel on <480px, side-by-side on desktop. Clear.
5. **Risk check:** The only modification to existing code is the conditional render in the parent page. If Simple mode has bugs, toggling to Expert gives the user the full working page immediately. Zero regression risk.
6. **Engagement check:** Every section has a clear engagement purpose — identity anchoring (hero card), emotional resonance (three cards), actionable guidance (ashram), visual comprehension (rings), temporal orientation (timeline), positive reinforcement (strengths), and growth framing (not-scary doshas).
7. **Shareability check:** The hero card and three-card spread are explicitly designed for mobile screenshot sharing. Gold-on-dark aesthetic is OLED-optimised. Archetype names are identity labels users will adopt ("I'm a Pioneering Sage").
8. **Loading state:** Skeleton shimmer specified (§11) — prevents layout shift, matches final card shapes.
9. **Data dependency check:** No dependency on `PersonalReading`, `synthesizePersonalReading()`, or any dashboard-only computation. Simple mode works with raw `KundaliData` from `generateKundali()` alone.

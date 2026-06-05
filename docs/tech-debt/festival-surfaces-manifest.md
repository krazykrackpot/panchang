# Festival surfaces — refutation manifest (Audit 2026-06-05 #26)

The 2026-06-05 audit flagged #26 as "Festival cards drift across 5+
surfaces … extract a `FestivalCard` (or `FestivalCardCompact` variant)".

After surveying the actual code in Phase 5h, the recommendation does
not fit. This doc records the analysis so a future audit doesn't
re-raise the same item.

## What the audit counted

The audit's "5+ surfaces" enumerated:

1. `src/app/[locale]/calendar/Client.tsx:640-757` — calendar browse row
2. `src/components/dashboard/FestivalCountdown.tsx:243` — dashboard widget
3. `src/app/embed/festivals/page.tsx` — embeddable iframe
4. Five distinct files in `src/components/festivals/`

Total: 8 surfaces.

## What they actually are

Each surface implements a **fundamentally different UX shape** with
its own design-spec section
(`docs/superpowers/specs/2026-05-28-festival-deep-dive-pages-design.md`).

| # | File | UX shape | Spec |
|---|------|----------|------|
| 1 | `calendar/Client.tsx` | Calendar-browse row: large date badge + name + category pill, type-based border tint, hover scale | calendar browse page |
| 2 | `dashboard/FestivalCountdown.tsx` | Compact countdown widget: Calendar icon + name + days-until ring (red when ≤1 day) | dashboard widget |
| 3 | `embed/festivals/page.tsx` | Embeddable iframe widget: theme switching, locale switching, ref attribution | external embed |
| 4 | `FestivalClusterTimeline.tsx` | Horizontal scrolling day-cards for multi-day festivals (Diwali 5-day, Navratri 9-day, Pitru Paksha 15-day) | §4F |
| 5 | `FestivalHistoricalArchive.tsx` | 2020-2030 historical dates table with JSON-LD ItemList for SEO | §4G |
| 6 | `FestivalObservanceCards.tsx` | Two side-by-side cards: green ✓ Do, amber ✗ Don't, with classical source tooltips | §4C |
| 7 | `FestivalPersonalizedAccordion.tsx` | 12-rashi collapsible accordion for personalised reading | §4A |
| 8 | `FestivalWishesCarousel.tsx` | 3 shareable greetings as carousel/grid with copy-to-clipboard + Web Share API | §4B |

Each has **unique props, interactions, hover states, and design
tokens**. They are not 8 copies of a card; they are 8 different UI
systems that happen to all involve festivals.

## Why a single `FestivalCard` extraction would harm

Forcing 8 surfaces through one component would:

1. **Couple unrelated UI concerns** — the countdown widget's red
   ring for ≤1-day-away has nothing to do with the historical
   archive's text rows for 2020-2025.
2. **Add prop-explosion** — variants for `compact | row | widget |
   carousel-card | timeline-card | observance-tick | archive-text |
   accordion-row | embed` is not a sensible API.
3. **Block independent spec evolution** — design tweaks to §4F's
   cluster timeline shouldn't risk regressions in §4B's wishes
   carousel.
4. **Repeat the Phase 3 #7 mistake** — the same audit also flagged
   the 5 panchang cards as drift; Phase 3 refuted that one for the
   same reason (cards-look-similar ≠ cards-have-same-purpose).
   The user explicitly endorsed leaving the 5-card variant as such
   *("be careful with 5-card extraction. i think there was a valid
   reason for leaving it as such")*.

## What WAS extracted

Phase 5h kept the audit's spirit (single source of truth) by
extracting the only piece that genuinely drifted:

- **`src/lib/constants/festival-category-colors.ts`** — the
  category → colour mapping. Before this, `calendar/Client.tsx`
  and `dashboard/FestivalCountdown.tsx` had 5 of 8 categories
  coloured differently (users saw ekadashi as blue on one page,
  emerald on another — visible silent drift). Both consumers now
  route through `getFestivalCategoryColor`.

## Drift-guard test

`src/lib/__tests__/audit-phase5h-festival-category-colors.test.ts`
locks in:

- The canonical colour values per category (a change must be
  intentional, not silent).
- Both consumers import from canonical.
- All 8 surfaces still exist (this manifest is self-updating — if
  a future PR consolidates two surfaces, the test fails and the
  manifest must be updated).

## When to revisit

This refutation should be re-examined if:

- The design spec is re-drafted to unify multiple surfaces around
  a shared component (then extract per the new spec).
- A user-visible drift bug is reported across surfaces that wasn't
  caught by the category-colour canonical.
- More than 2 surfaces share an identical visual shape that needs
  to track the same design token.

Until then, the audit item is **REFUTED** with the canonical
category-colour extraction satisfying the underlying single-source-
of-truth concern.

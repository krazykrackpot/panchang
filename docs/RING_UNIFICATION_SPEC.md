# Ring Unification Spec (v3 — final)

## Problem
Simple and Expert modes use different data sources, colour schemes, and ring meanings. They disagree on every domain.

## Mental model: How a Jyotishi reads

Three temporal layers, read in order:
1. **Natal** — what does the birth chart promise? Fixed for life.
2. **Temporal** — what dasha period are you in? Medium-term (years/months).
3. **Now** — what transits are active? Short-term (weeks/months).

These are distinct signals. Never blend them into an "overall" — that hides the story.

## Three rings

| Ring | Layer | Data source | Colour | Fill logic |
|------|-------|------------|--------|------------|
| Outer (thickest) | Natal Promise | `overallRating.rating` → `TIER_SCORES_MAP` | Rating-based: uttama=#22c55e, madhyama=#60a5fa, adhama=#f59e0b, atyadhama=#ef4444 | `TIER_SCORES_MAP[rating] / 10` (8.5→85%, 6→60%, 3.5→35%, 1.5→15%) |
| Middle | Life Phase (Dasha) | `currentActivation.dashaActivationScore` | #3b82f6 (blue) | `dashaActivationScore / 10` (0-8 scale, maha=5 + antar=3) |
| Inner (thinnest) | Right Now (Transits) | `currentActivation.transitInfluences.length` | #f59e0b (amber) | `min(1, transitCount / 4)` — 0 transits = empty, 4+ = full |

### Labels (accessible, no jargon)
- English: "Your Chart" / "Life Phase" / "Right Now"
- Hindi: "आपकी कुण्डली" / "जीवन चरण" / "अभी"

### Why not "overall"?
If natal is Uttama (8.5) but dasha doesn't activate (2.0), an "overall" blend shows ~6.5 (Madhyama). User thinks "meh." But the truth is: "your chart is excellent — it's just not the active chapter." Three separate rings preserve this nuance.

## Single data source: `personalReading.domains[]`

Both Simple and Expert consume `DomainReading` from `synthesizeReading()`. Delete `deriveDomainScores()` entirely.

```
DomainReading
  ├─ overallRating.rating        → outer ring colour + fill
  ├─ currentActivation
  │    ├─ dashaActivationScore   → middle ring fill (0-10)
  │    └─ transitInfluences[]    → inner ring fill (count/4)
  └─ (all other fields for expert: factors, remedies, etc.)
```

## Unified component: `DomainRings.tsx`

```typescript
interface DomainRingsProps {
  natalRating: Rating;              // outer ring colour + fill
  dashaScore: number;               // 0-10, middle ring fill
  transitCount: number;             // 0+, inner ring fill = min(1, count/4)
  icon?: ReactNode;                 // centre icon (Expert only)
  size?: number;                    // px — 80 for Simple, 120 for Expert
}
```

Ring geometry: viewBox 100×100, centre 50,50
- Outer: radius 44, strokeWidth 8
- Middle: radius 34, strokeWidth 6
- Inner: radius 24, strokeWidth 5
- Track: rgba(255, 255, 255, 0.10)

Fill animation: spring transition, staggered 0.15s per ring.

## Simple mode (KundaliSimple)

- Accepts `personalReading` prop from Client.tsx
- Shows 4 domains: career, marriage, health, wealth (filter from `personalReading.domains[]`)
- Each card: `DomainRings` (size=80, no icon) + domain name + rating label + legend
- Legend: 3 dots with labels — "Your Chart" (rating colour), "Life Phase" (blue), "Right Now" (amber)
- If `personalReading` is null: hide "Your Life Domains" section entirely

## Expert mode (SummaryDomainCard)

- Shows all 8 domains from `personalReading.domains[]`
- Each card: `DomainRings` (size=120, with Lucide icon) + LayeredCommentary + triggers + remedies
- Same ring component, same data extraction

## Files to change

1. **`src/components/kundali/DomainRings.tsx`** — rewrite: new props (natalRating, dashaScore, transitCount), Simple colour scheme, score-proportional fills, configurable size
2. **`src/components/kundali/simple/DomainRingsCard.tsx`** — consume `DomainReading`, pass to unified `DomainRings`
3. **`src/components/kundali/KundaliSimple.tsx`** — accept `personalReading` prop, delete `deriveDomainScores()`, filter to 4 domains
4. **`src/app/[locale]/kundali/Client.tsx`** — pass `personalReading` to KundaliSimple
5. **`src/components/kundali/SummaryDomainCard.tsx`** — update DomainRings call to unified props

## What does NOT change
- `synthesizer.ts` — data source is correct
- `LayeredCommentary.tsx` — Expert-only, unaffected
- `LifeDomainsOverview.tsx` — the 8-ring mini overview, separate component

## Fallback
If `personalReading` is null, KundaliSimple hides domains. No bhavabala fallback — wrong data is worse than no data.

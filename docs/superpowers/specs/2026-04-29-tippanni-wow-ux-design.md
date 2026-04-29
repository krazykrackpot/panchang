# Tippanni "Wow" UX Elevation — Design Spec

**Date:** 2026-04-29
**Status:** Ready to implement
**File:** `src/components/kundali/TippanniTab.tsx` (1244 lines)

## Current State

Dense report-style layout. Sections: Year Predictions, Personality, Planet Placements, Yogas, Doshas, Life Areas, Dasha Analysis, Strength, Remedies, Convergence Summary. All fully expanded, all same visual weight. Reads like a wall of text.

## Changes

### 1. Hero Summary Card (top of tab)

"Your Chart at a Glance" — prominent card with:
- Archetype headline: composed from lagna sign + element + dasha lord
- One-line personality synthesis from `tip.personality.summary`
- 4 key metrics: dominant element %, strongest planet, yogas active count, current dasha period
- Background glow effect, gold gradient

Data sources: `tip.personality`, `tip.yogas.filter(y => y.present).length`, `tip.dashaInsight`, `tip.strength`

### 2. "For You Right Now" Callout

Amber-highlighted box with pulsing dot:
- Single most actionable insight for today
- Source: `tip.yearPredictions.keyAdvice[0]` or `tip.dashaInsight` current period

### 3. Collapsible Detail Sections

These sections show summary + expandable detail:
- **Planet Placements**: "7 of 9 well-placed. Jupiter/Venus strongest." → expand for all 9
- **Yogas**: Count + top 3 listed → expand for full list
- **Life Areas**: Top insight → expand for all 5
- **Strength**: Strongest/weakest → expand for full table

Keep fully visible: Year Predictions, Personality, Doshas, Dasha Analysis, Remedies

### 4. Visual Section Dividers

Gold gradient line with section number between major sections:
```tsx
<div className="flex items-center gap-4 my-8">
  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
  <span className="text-gold-primary/30 text-xs font-bold">{n}</span>
  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-primary/20 to-transparent" />
</div>
```

### 5. Action Plan Summary (bottom)

Emerald-bordered card aggregating:
- Top 3 prioritized remedies from `tip.remedies`
- Key timing windows from `tip.yearPredictions`
- Most important dosha to address (if any present)
- Numbered action items (1, 2, 3...)

## Implementation Notes

- Keep ALL existing content — just wrap some in collapsible toggles
- Read `src/lib/kundali/tippanni-types.ts` for TippanniContent type
- Tab receives `{ kundali, locale }` props
- Use `isDevanagariLocale(locale)` for bilingual
- Don't break AI Reading button or ConvergenceSummary
- GoldDivider component exists at `src/components/ui/GoldDivider.tsx`

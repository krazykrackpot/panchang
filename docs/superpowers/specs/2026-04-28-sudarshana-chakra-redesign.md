# Sudarshana Chakra Visual Redesign — Design Spec

**Date:** 2026-04-28
**Status:** Approved

## Overview

Redesign the existing Sudarshana Chakra visualization in `src/components/kundali/SudarshanaTab.tsx` to be bigger, bolder, with full sign names, full planet names in bold, colored planet dots with glow halos (Planisphere-inspired), and more dramatic ring styling.

## Current State

- SVG size: 440×440
- Sign labels: 2-letter abbreviations (Ar, Ta, Ge...)
- Planet labels: 2-letter abbreviations (Ju, Sa, Ma...) at 6px, not bold
- Planet dots: tiny (r~3-4), no color coding, no glow
- Ring radii: outer=195, mid=145, inner=95, center=45
- Ring borders: 1px thin strokes
- No planet color differentiation

## Target State

- SVG size: **900×900** (responsive via `max-w-full h-auto`)
- Sign labels: **Full names** (Aries, Taurus... or Hindi/Tamil/Bengali equivalents) at 13-15px, bold for active house
- Planet labels: **Full names** (Jupiter, Saturn... or localized) at 13-14px, **bold**
- Planet dots: **Large colored circles** (r=8-12) with glow halos (r=15-22), inner bright core
- Ring radii: outer=400, mid=300, inner=200, center=100
- Ring borders: **2.5-3px** with ring-specific colors (gold/silver/amber)
- Planet colors matching Planisphere: Sun=#e67e22, Moon=#c0c0c0, Mars=#e74c3c, Mercury=#2ecc71, Jupiter=#f1c40f, Venus=#e91e9f, Saturn=#95a5a6, Rahu=#3498db, Ketu=#9b59b6

## Mockup Reference

`.superpowers/brainstorm/5117-1777367551/content/sudarshana-v4.html`

## Changes Required

### File: `src/components/kundali/SudarshanaTab.tsx`

**Constants to update:**
```
SVG_SIZE: 440 → 900
OUTER_R: 195 → 400
MID_R: 145 → 300
INNER_R: 95 → 200
CENTER_R: 45 → 100
CX/CY: 220 → 450
```

**Sign labels (in `RingLabels` component):**
- Replace `SIGN_ABBR` (2-letter) with full names
- Add locale support: English full names for en, Hindi for hi, Tamil for ta, Bengali for bn
- Font size: 13px normal, 15px bold for active house (was 7.5/9)

**Planet rendering (in `RingLabels` component):**
- Add `PLANET_COLORS` constant matching Planisphere colors
- Each planet rendered as: outer glow circle (r=18, opacity 0.12, blur filter) + colored dot (r=9-12) + optional inner bright core + bold full name below
- Full planet names (locale-aware): Sun/सूर्य/சூரியன்/সূর্য, Moon/चन्द्र/சந்திரன்/চন্দ্র, etc.
- Font: 13-14px bold, color matching planet color

**Ring borders:**
- Lagna (outer): `stroke="rgba(212,168,83,0.5)" strokeWidth={3}` (gold)
- Chandra (middle): `stroke="rgba(236,240,241,0.35)" strokeWidth={2.5}` (silver)
- Surya (inner): `stroke="rgba(230,126,34,0.4)" strokeWidth={2.5}` (amber)
- Center: `stroke="rgba(212,168,83,0.2)" strokeWidth={1.5}`

**Segment dividers:**
- Width: 0.7-1px (was 0.5px)
- Cardinal lines (H1/H4/H7/H10) slightly thicker at 1px

**Active house highlights:**
- Larger fill areas with ring-specific colors (gold/silver/amber)
- Stroke on active segments: 1.2px

**SVG filters (add to `<defs>`):**
- `planet-glow` — `feGaussianBlur stdDeviation="8"` for planet halos
- Existing `glow-gold` — increase stdDeviation from 2 → 3

**Center label:**
- "SUDARSHANA" at 18px bold, letter-spacing 4
- "CHAKRA" at 12px, letter-spacing 4
- Age + year at 11px

**House numbers:**
- H1, H4, H7, H10 at cardinal positions outside the outer ring
- 13px bold, rgba(212,168,83,0.35)

**Ring labels:**
- "LAGNA" / "CHANDRA" / "SURYA" text inside each band near the top
- 10px bold, letter-spacing 3, ring-specific color at 40-50% opacity

### No changes needed to:
- `src/lib/kundali/sudarshana.ts` (computation engine)
- `src/lib/kundali/sudarshana-interpretation.ts` (interpretation logic)
- `SudarshanaTab` outer layout (age slider, interpretation panels, educational context)

## Planet Color Map

```ts
const PLANET_COLORS: Record<number, string> = {
  0: '#e67e22', // Sun — orange
  1: '#c0c0c0', // Moon — silver
  2: '#e74c3c', // Mars — red
  3: '#2ecc71', // Mercury — green
  4: '#f1c40f', // Jupiter — yellow
  5: '#e91e9f', // Venus — pink
  6: '#95a5a6', // Saturn — grey
  7: '#3498db', // Rahu — blue
  8: '#9b59b6', // Ketu — purple
};
```

Same map as `src/components/sky/Planisphere.tsx` line 18.

## Full Sign Names (locale-aware)

```ts
const SIGN_NAMES: Record<number, Record<string, string>> = {
  1:  { en: 'Aries',   hi: 'मेष',    ta: 'மேஷம்',   bn: 'মেষ' },
  2:  { en: 'Taurus',  hi: 'वृषभ',   ta: 'ரிஷபம்',  bn: 'বৃষ' },
  3:  { en: 'Gemini',  hi: 'मिथुन',  ta: 'மிதுனம்',  bn: 'মিথুন' },
  4:  { en: 'Cancer',  hi: 'कर्क',   ta: 'கடகம்',   bn: 'কর্কট' },
  5:  { en: 'Leo',     hi: 'सिंह',   ta: 'சிம்மம்',  bn: 'সিংহ' },
  6:  { en: 'Virgo',   hi: 'कन्या',  ta: 'கன்னி',   bn: 'কন্যা' },
  7:  { en: 'Libra',   hi: 'तुला',   ta: 'துலாம்',   bn: 'তুলা' },
  8:  { en: 'Scorpio', hi: 'वृश्चिक', ta: 'விருச்சிகம்', bn: 'বৃশ্চিক' },
  9:  { en: 'Sagitt.', hi: 'धनु',    ta: 'தனுசு',   bn: 'ধনু' },
  10: { en: 'Capri.',  hi: 'मकर',    ta: 'மகரம்',   bn: 'মকর' },
  11: { en: 'Aquarius',hi: 'कुम्भ',  ta: 'கும்பம்',  bn: 'কুম্ভ' },
  12: { en: 'Pisces',  hi: 'मीन',    ta: 'மீனம்',   bn: 'মীன' },
};
```

## Full Planet Names (locale-aware)

```ts
const PLANET_NAMES: Record<number, Record<string, string>> = {
  0: { en: 'Sun',     hi: 'सूर्य',    ta: 'சூரியன்',  bn: 'সূর্য' },
  1: { en: 'Moon',    hi: 'चन्द्र',   ta: 'சந்திரன்', bn: 'চন্দ্র' },
  2: { en: 'Mars',    hi: 'मंगल',    ta: 'செவ்வாய்', bn: 'মঙ্গল' },
  3: { en: 'Mercury', hi: 'बुध',     ta: 'புதன்',   bn: 'বুধ' },
  4: { en: 'Jupiter', hi: 'बृहस्पति', ta: 'வியாழன்', bn: 'বৃহস্পতি' },
  5: { en: 'Venus',   hi: 'शुक्र',   ta: 'சுக்கிரன்', bn: 'শুক্র' },
  6: { en: 'Saturn',  hi: 'शनि',    ta: 'சனி',     bn: 'শনি' },
  7: { en: 'Rahu',    hi: 'राहु',    ta: 'ராகு',    bn: 'রাহু' },
  8: { en: 'Ketu',    hi: 'केतु',    ta: 'கேது',    bn: 'কেতু' },
};
```

## Responsive Behavior

The SVG uses `viewBox="0 0 900 900"` with `className="max-w-full h-auto"`. On mobile it scales down naturally. The larger base size means labels remain readable even at 50% scale (450px on a phone).

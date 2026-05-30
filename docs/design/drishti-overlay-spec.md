# Planet Drishti (Aspect) Overlay — Design Spec

**Status:** Design — not yet implemented (Phase 2).
**Owner:** Aditya
**Reference prototype:** [`drishti-mockups.html`](./drishti-mockups.html) (open in browser; shows the four candidate treatments side-by-side).
**Chosen treatment:** **Option 4 — Comet trails + dimmed-back chart + golden boundary on aspected houses.**

## 1. Problem

The birth chart shows where each of the nine grahas sits, but a key piece of Jyotish reading — **which houses does this planet *aspect* (Sanskrit: drishti, "look upon")** — is invisible. A user who clicks Saturn has no way to see that it's aspecting houses 3, 7, and 10. We want direct, intuitive, clickable drishti visualisation right on the chart, working identically on both North Indian (diamond) and South Indian (rectangular grid) layouts.

## 2. Goals & non-goals

**Goals**
- Click a planet → a visual layer reveals every house that planet aspects.
- Aspect strength differentiated where it matters (7th-aspect is full drishti for every planet; specials are 75% for Mars / Jupiter / Saturn).
- Same overlay component for both `ChartNorth` and `ChartSouth` — only house-centroid coordinates differ.
- Click empty space or the same planet again → overlay dismisses.
- Respects `prefers-reduced-motion`.

**Non-goals**
- Not computing rashi-drishti (sign-on-sign aspects used in Jaimini).
- Not computing aspect *strength* numerically (Drishti Bala already lives in `bhavabala.ts` and surfaces in Tippanni).
- Not building a "compare two planets' aspects" view in this PR.

## 3. Aspect rules (graha drishti)

Every graha aspects the 7th house from itself with full strength. In addition:

| Planet | Special aspects |
|---|---|
| Mars (Mangala) | 4th, 8th |
| Jupiter (Guru) | 5th, 9th |
| Saturn (Shani) | 3rd, 10th |
| Rahu | 5th, 9th (per BPHS; some Tajika schools differ — flagged in code comments) |
| Ketu | 5th, 9th |
| Sun, Moon, Mercury, Venus | none beyond the 7th |

Houses are counted inclusive of the planet's own house as 1. Indexing wraps mod 12 (house 0 → house 12).

## 4. Visual treatment (Option 4)

A staggered three-step reveal when a planet is clicked:

1. **Dim back the chart** (300 ms). Outer square, inner diamond, diagonals drop to 25–30% stroke opacity. Inactive house numbers drop to 32%.
2. **Light up aspected houses** (staggered 0 s, 350 ms, 700 ms). Each aspected house's polygon fills with soft gold (10% opacity), a 2 px gold boundary draws around its perimeter with a drop-shadow glow, and that house's number stays at full gold-light + bold weight.
3. **Comets fly out** (staggered 0 s, 400 ms, 800 ms). A small gold dot traces along a 1.7 px dashed gold guide path (70% opacity) from the planet to each aspected house. On landing, a persistent pulsing gold star + expanding ring stays at the destination.

Saturn (the selected planet) keeps a soft gold drop-shadow throughout so the source remains anchored.

### Why Option 4

- **Option 1 (cyan beams)** — reads instantly as "energy shines on this house" but the cyan against gold felt sci-fi.
- **Option 2 (constellation threads)** — most beautiful, most restrained, but bezier filaments get lost on a phone-width chart.
- **Option 3 (halos + sigil echoes)** — most information-rich, but the ghost ♄ inside the aspected house competes with any *actual* planets sitting there.
- **Option 4 (comets + dim + house highlight)** — best at three things at once: (a) the source planet is obviously the actor, (b) the destination houses are obviously the targets, (c) the path between them is visible without overloading the chart.

The chart dim + highlight is what makes Option 4 win — it removes ambiguity about *which* houses are aspected by removing the rest from the visual hierarchy.

## 5. Interaction

| Trigger | Behaviour |
|---|---|
| Click any planet glyph | Overlay shows for that planet's aspects. If another planet was already selected, switch. |
| Click the same planet again | Dismiss. |
| Click empty chart space | Dismiss. |
| Press <kbd>Esc</kbd> | Dismiss when overlay is mounted. |
| Tab to planet + Enter / Space | Same as click. |
| `prefers-reduced-motion: reduce` | Static reveal — comet flight and house-glow-in animations skipped, end state shown immediately. Persistent pulse on landed stars + house ring is disabled. |

## 6. Architecture

### 6.1 Aspect calculation

New file: `src/lib/kundali/graha-drishti.ts`.

```ts
/** Special aspects beyond the universal 7th. Planet ID → house offsets. */
const SPECIAL_ASPECTS: Record<number, readonly number[]> = {
  // Sun (0), Moon (1), Mercury (3), Venus (5) — no specials beyond 7th.
  2: [4, 8],   // Mars
  4: [5, 9],   // Jupiter
  6: [3, 10],  // Saturn
  7: [5, 9],   // Rahu (per BPHS; Tajika differs)
  8: [5, 9],   // Ketu
};

/** Returns the houses (1–12) that a planet aspects from its current house. */
export function getPlanetAspects(planetId: number, planetHouse: number): number[] {
  const offsets = [7, ...(SPECIAL_ASPECTS[planetId] ?? [])];
  return offsets.map(n => ((planetHouse - 1 + n - 1) % 12) + 1);
}
```

Unit tests: Sun in House 1 → [7]; Mars in House 1 → [7, 4, 8]; Jupiter in House 6 → [12, 10, 2]; Saturn in House 11 → [5, 1, 8] (wrap check); Rahu in House 4 → [10, 8, 12].

### 6.2 Overlay component

New file: `src/components/kundali/DrishtiOverlay.tsx`. Pure presentation; geometry comes from props:

```tsx
interface DrishtiOverlayProps {
  /** SVG path-`d` string for each house, in the chart's coordinate space.
      ChartNorth.tsx already exposes its house geometry as path strings
      (HOUSE_PATHS), so the overlay can re-use them verbatim via
      `<path d={path}/>` instead of converting them to polygon points. */
  housePaths: Record<number, string>;
  /** Centroid of each house (where the number sits + comet target). */
  houseCentroids: Record<number, [number, number]>;
  /** Coordinates of the selected planet glyph. */
  planetXY: [number, number];
  /** Houses this planet aspects (from getPlanetAspects). */
  aspectedHouses: number[];
  /** Reduced-motion preference; computed by caller from window.matchMedia. */
  reduceMotion: boolean;
}
```

The component renders the overlay layer into the same SVG coordinate space as the chart. It knows nothing about which chart style is being used.

Animations run via CSS classes + SVG `<animateMotion>` for the comet path. When `reduceMotion === true`, the wrapper gets `data-reduce-motion="true"` and CSS disables `animation` properties on every descendant.

### 6.3 Chart integration

`ChartNorth.tsx` and `ChartSouth.tsx` already define their house geometry. Minimal changes per file:

1. Export the per-house path strings and centroids as a module-level constant (most are already implicit — pull them into a named map).
2. Add `selectedPlanetId: number | null` (state or controlled prop).
3. Add `onClick` on each planet glyph that toggles selection.
4. Add `onClick` on the SVG background that clears selection (with `e.stopPropagation()` on glyphs).
5. When a planet is selected, render `<DrishtiOverlay …>` inside the same SVG.

The caller computes `aspectedHouses` once per selection change:

```ts
const aspectedHouses = useMemo(
  () => selectedPlanetId == null ? [] : getPlanetAspects(selectedPlanetId, planetHouseMap[selectedPlanetId]),
  [selectedPlanetId, planetHouseMap]
);
```

### 6.4 Accessibility

- Visually-hidden `<div role="status" aria-live="polite">` announces *"Saturn aspects houses 3, 7, and 10"* (localised) when selection changes.
- Each planet glyph is `<g role="button" tabindex="0" aria-label="…">` with Enter / Space key handlers.
- Colour contrast: gold-light + soft-gold-fill highlight passes WCAG AA on the navy background (≈ 5.4:1 measured for the 2 px boundary stroke, 4.6:1 for the house number).

### 6.5 Performance

- Overlay is **unmounted** when no planet is selected — no idle DOM, no idle animations.
- CSS animations use `transform` and `opacity` only (compositor-cheap).
- The persistent landed-glow + ring auto-quiet after 8 s to spare battery on long-open charts.
- No JS animation loops, no framer-motion.

## 7. Phasing

| Phase | What | Where |
|---|---|---|
| 1 | Design docs + production dignity bug fix (this PR) | here |
| 2 | `graha-drishti.ts` + tests + `DrishtiOverlay.tsx` + `ChartNorth` wiring + `PlanetGlyph` halo for dignity | next PR |
| 3 | `ChartSouth` wiring (same overlay, different geometry) | follow-up |
| 4 (optional) | Aspect-strength encoding (Drishti Bala) | future |

---

## 8. Self-review

### 8.1 What I'd push back on (and resolutions)

- **Aspect counting convention.** Section 3 uses "inclusive of the planet's own house as 1". Will assert this in the unit-test fixture against Parashara's commentary on Mars aspects in particular.
- **Rahu / Ketu aspects are contested.** Encoded as overridable constant. The default follows BPHS; a future "configure aspect school" preference can override the special-aspects table.
- **Persistent pulse battery cost.** Three concurrent CSS animations × max 3 destinations = nine animations while overlay is open. Auto-quiet after 8 s.
- **Touch target size on mobile.** Current planet glyphs are ~14 px. WCAG minimum is 44 × 44 px. Phase 2 work item: add an invisible 44 × 44 hit-test area around each glyph.

### 8.2 What I'm avoiding

- Multi-planet selection (different feature).
- Aspect cancellation by retrograde / combust (encoding presence, not quality).
- Animated trail BEHIND the comet (tried it — too noisy with three concurrent paths).
- South Indian house-numbering convention (Pisces top-left, not Aries top-centre). Drishti logic is layout-independent; only the geometric overlay coordinates change. Phase 3.

### 8.3 What I haven't validated

- **Comet origin when multiple planets share a house.** If three planets sit in House 1 and the user clicks Saturn, the comet should emanate from Saturn's glyph specifically, not the house centroid. Need to anchor at the glyph position.
- **Self-aspect when planet is mid-chart** (sits in a house whose 7th lands on the diagonals). Need to test, possibly thicken the path to 2 px in that case.

### 8.4 Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Aspect rules dispute (Rahu / Ketu) | Medium | Overridable constant, future preference toggle |
| Touch target too small | Medium | 44 × 44 invisible hit-test area in Phase 2 |
| Battery / animation cost | Low | Auto-quiet persistent pulses after 8 s |
| South Indian centroid mismatch | Low | Phase 3 — separate map |

### 8.5 What success looks like

A first-time visitor who's never read Vedic astrology can click any planet, watch three comets fly out, and say *"oh, so Saturn affects those three houses"* without reading documentation. The same houses are also called out in the Tippanni text. Two surfaces, one story.

---

## 9. Cross-reference

- [`planet-dignity-indicator.md`](./planet-dignity-indicator.md) — companion design for the passive dignity halo + flame badge. Composes with this overlay.

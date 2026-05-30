# Planet Drishti (Aspect) Overlay — Design Spec

**Status:** Design — not yet implemented
**Owner:** Aditya
**Approved on:** _pending_
**Reference prototype:** [`drishti-mockups.html`](./drishti-mockups.html) (open in browser; shows all four candidate treatments side-by-side)
**Chosen treatment:** **Option 4 — Comet trails + dimmed-back chart + highlighted aspected houses**

## 1. Problem

The birth chart shows where each of the nine grahas (planets) sits, but a key piece of Jyotish reading — **which houses does this planet *aspect* (Sanskrit: drishti, "look upon")** — is invisible. A user who clicks on Saturn in their chart has no way to see at a glance that it's aspecting houses 3, 7, and 10 from its position. They have to either know the rules by heart, mentally count signs around the wheel, or open a separate Tippanni section and cross-reference.

We want **direct, intuitive, clickable** drishti visualisation right on the chart, working identically on both North Indian (diamond) and South Indian (rectangular grid) layouts.

## 2. Goal & non-goals

**Goals**
- Click a planet → a clear visual layer reveals every house that planet aspects.
- Aspect strength differentiated where it matters (7th-aspect is "full drishti" for every planet; specials are 75% for Mars/Jupiter/Saturn).
- Works identically on `ChartNorth` and `ChartSouth` with the same overlay component — only house-centroid coordinates differ.
- Click empty space or the same planet again → overlay dismisses.
- Respects `prefers-reduced-motion` — skips the animation and shows the result statically.

**Non-goals**
- We are **not** computing rashi-drishti (sign-on-sign aspects used in Jaimini), just graha-drishti.
- We are **not** computing parashari aspect *strength* numerically (the Vimshopaka / Drishti Bala already lives in `bhavabala.ts` and surfaces in Tippanni — out of scope here).
- We are **not** building a "compare two planets' aspects" view in this PR; one selection at a time.

## 3. Aspect rules (graha drishti)

Every graha aspects the 7th house from itself with full strength. In addition:

| Planet | Special aspects |
|---|---|
| Mars (Mangala) | 4th, 8th |
| Jupiter (Guru) | 5th, 9th |
| Saturn (Shani) | 3rd, 10th |
| Rahu | 5th, 9th (per BPHS reading; some Tajika schools differ — flag in code comments) |
| Ketu | 5th, 9th |
| Sun, Moon, Mercury, Venus | none beyond the 7th |

Houses are counted **inclusive of the planet's own house as 1**. So a planet in house 5 with 3rd aspect → 5 + 3 − 1 = house 7. Indexing wraps mod 12 (house 0 → house 12).

## 4. Visual treatment (Option 4)

A staggered three-step reveal when a planet is clicked:

1. **Dim back the chart** (300ms ease). Outer square, inner diamond, diagonals drop to 25–30% stroke opacity. House numbers drop to 32% opacity.
2. **Light up aspected houses** (staggered 0s, 350ms, 700ms). Each aspected house's polygon fills with soft gold (10% opacity), a bright gold (2 px) boundary draws around its perimeter with a drop-shadow glow, and the house number for that region brightens to gold-light + 14 px + bold.
3. **Comets fly out** (staggered 0s, 400ms, 800ms). A small gold dot with a drop-shadow halo traces along a dashed gold guide path (1.7 px, 4-5 dash, 70% opacity) from the planet to each aspected house. On landing, a persistent pulsing gold star + expanding ring stays at the destination as the residue of "this house has been aspected."

Saturn / the selected planet keeps a soft gold drop-shadow throughout so the source remains anchored.

### Why Option 4

Considered alternatives (rendered in the prototype):

- **Option 1 — Glowing cyan beams.** Read instantly as "energy shines on this house" but the cyan against gold felt sci-fi, not Vedic; aurora pulse competes for attention even when the user is reading something else.
- **Option 2 — Constellation threads.** Most beautiful, most restrained — but bezier filaments at small sizes get visually lost on a phone-width chart; aspect labels (3RD/7TH/10TH) struggle for room.
- **Option 3 — Halos + sigil echoes.** Most information-rich (aspect strength encoded in halo brightness) but the ghost ♄ inside the aspected house competes with any *actual* planets sitting there.
- **Option 4 — Comet trails + dim + house highlight.** Best at three things at once: (a) the source planet is obviously the actor, (b) the destination houses are obviously the targets, (c) the path from one to the other is visible without overloading the chart with crossing lines.

The chart dim+highlight is what makes Option 4 win — it removes ambiguity about *which* houses are aspected by removing the rest from the visual hierarchy.

## 5. Interaction

| Trigger | Behaviour |
|---|---|
| Click any planet glyph | Overlay shows for that planet's aspects. If a different planet was already selected, switch — no overlap. |
| Click the same planet again | Overlay dismisses. |
| Click empty chart space | Overlay dismisses. |
| Press <kbd>Esc</kbd> | Overlay dismisses (when overlay is mounted). |
| Tab to planet glyph + Enter / Space | Same as click — keyboard parity. |
| `prefers-reduced-motion: reduce` | Static reveal — comets and house-glow-in animations skipped, end state shown immediately. Persistent pulse on landed stars + house glow ring is also disabled. |

## 6. Architecture

### 6.1 Aspect calculation (pure, server-safe)

New file: `src/lib/kundali/graha-drishti.ts`

```ts
import { GRAHAS } from '@/lib/constants/grahas';

/** Special aspects beyond the universal 7th. Planet ID → house offsets. */
const SPECIAL_ASPECTS: Record<number, readonly number[]> = {
  // Sun, Moon, Mercury, Venus — no specials
  2: [4, 8],  // Mars
  4: [5, 9],  // Jupiter
  6: [3, 10], // Saturn
  7: [5, 9],  // Rahu (per BPHS; Tajika differs — flagged in code)
  8: [5, 9],  // Ketu
};

/**
 * Returns the houses (1-12) that a planet aspects.
 * `planetHouse` is the house that the planet currently occupies.
 * The 7th-aspect is universal; specials are added for Mars/Jupiter/Saturn/Rahu/Ketu.
 */
export function getPlanetAspects(planetId: number, planetHouse: number): number[] {
  const offsets = [7, ...(SPECIAL_ASPECTS[planetId] ?? [])];
  // Offset is "n-th from self, counting the planet's own house as 1".
  // Convert to a 1-12 house index with proper wrap.
  return offsets.map(n => ((planetHouse - 1 + n - 1) % 12) + 1);
}
```

**Test plan** (`graha-drishti.test.ts`):
- Sun in house 1 → [7]
- Mars in house 1 → [7, 4, 8]
- Jupiter in house 6 → [12, 10, 2]
- Saturn in house 1 → [7, 3, 10]
- Saturn in house 11 → [5, 1, 8] (wrap check)
- Rahu in house 4 → [10, 8, 12]

### 6.2 Overlay component (presentational)

New file: `src/components/kundali/DrishtiOverlay.tsx`

```tsx
'use client';

interface DrishtiOverlayProps {
  /** Polygons for each house in chart-pixel coordinates. */
  housePolygons: Record<number, string>; // SVG points string, e.g. "20,20 90,90 20,160"
  /** Centroid of each house (where number sits + comet target). */
  houseCentroids: Record<number, [number, number]>;
  /** Coordinates of the selected planet glyph. */
  planetXY: [number, number];
  /** Houses this planet aspects (from getPlanetAspects). */
  aspectedHouses: number[];
  /** Reduced motion preference; computed by caller from window.matchMedia. */
  reduceMotion: boolean;
}
```

The component is pure presentation. It receives geometry (polygons + centroids) from the parent chart and renders the overlay layer. It knows nothing about which chart style is being used; it just draws into the same SVG coordinate space.

Animations run via CSS classes + `<animateMotion>` (SVG SMIL) for the comet path. When `reduceMotion` is true, the wrapper element gets a `data-reduce-motion="true"` attribute and CSS uses `[data-reduce-motion="true"] *` selectors to disable `animation` properties.

### 6.3 Chart integration

Both `ChartNorth.tsx` and `ChartSouth.tsx` already lay out their houses with known coordinates. The minimum needed change to each:

1. Export the per-house polygon-points strings + centroids as a module-level constant (they're already implicit in the current rendering — pull them into a named map).
2. Add `selectedPlanetId: number | null` state (or accept it as a controlled prop from `Client.tsx` if the user wants kundali-page-wide selection state).
3. Add `onClick` handlers on each planet glyph that toggles `selectedPlanetId`.
4. Add `onClick` on the SVG background (with `e.stopPropagation()` on glyphs) that clears selection.
5. When a planet is selected, render `<DrishtiOverlay …>` inside the same SVG, passing the polygons/centroids/aspects.

Caller (probably `KundaliClient.tsx`) computes `aspectedHouses` once per selection change:

```ts
const aspectedHouses = useMemo(
  () => selectedPlanetId == null ? [] : getPlanetAspects(selectedPlanetId, planetHouseMap[selectedPlanetId]),
  [selectedPlanetId, planetHouseMap]
);
```

### 6.4 Styles

A new CSS module: `src/components/kundali/DrishtiOverlay.module.css`.

(No Tailwind for the animations — the chart already mixes SVG + inline CSS, and animation timing is clearer in a dedicated stylesheet. Tailwind arbitrary-value classes for the dim factors would work for the static parts but would clutter the SVG.)

### 6.5 Accessibility

- A visually hidden `<div role="status" aria-live="polite">` next to the chart announces *"Saturn aspects houses 3, 7, and 10"* (or the localised form) when selection changes. Re-announced on every change. Cleared on dismiss.
- Each planet glyph is `<g role="button" tabindex="0" aria-label="Select Saturn — aspects houses …">` with key handlers for Enter/Space.
- The overlay's house highlights have an `aria-label` summarising the state for screen readers but no individual focusable elements (the chart is a visualization, not a form).
- Colour contrast: the gold-light on the navy + soft-gold-fill highlight passes WCAG AA (5.4:1 measured for boundary stroke, 4.6:1 for house number).

### 6.6 Performance

- The overlay is **unmounted** when no planet is selected — no idle DOM, no idle animations.
- CSS animations use `transform` and `opacity` only (compositor-cheap).
- The expanding-ring + landed-pulse on a comet's destination is a single keyframed animation, not JS-driven.
- No `setInterval`, no `requestAnimationFrame` loops, no framer-motion (this is the wrong tool — pure CSS is lighter).
- Reduce-motion path bypasses all animations and renders the resting state immediately.

## 7. Phasing

1. **Phase 1 (this PR — design only):** spec, mockups, dignity follow-up doc. No production code touched.
2. **Phase 2 (next PR):** `graha-drishti.ts` + tests + `DrishtiOverlay.tsx` + `ChartNorth` integration. Ship behind a flag if needed.
3. **Phase 3:** `ChartSouth` integration (same overlay, different geometry).
4. **Phase 4 (optional):** Aspect-strength encoded in stroke intensity — pulls Drishti Bala numbers from the existing `bhavabala.ts` engine.

---

## 8. Self-review (critical)

Reading this back with fresh eyes — what's wrong, what's missing, what's risky:

### 8.1 Things I'd push back on

- **Aspect counting convention is implicit, not asserted.** Section 3 says "inclusive of the planet's own house as 1" — but BPHS itself uses both conventions in different chapters depending on whether you read "rashi-anugata" or "graha-anugata". The implementation needs a single test fixture for every classical example I can find (Parashara's commentary on Mars aspects in particular is the easiest place to get this wrong) before the calc helper is trusted. **Add to test plan in §6.1.**
- **Rahu / Ketu aspects are contested.** I wrote "per BPHS; Tajika differs". Reality is that the BPHS reading of Rahu aspecting 5/9 is actually a minority position — most modern Parashari astrologers either give Rahu no aspect or the same as the lord of the sign Rahu is in. **Risk:** ship a default that ~40% of Vedic readers will dispute. **Mitigation:** make the special-aspects table a CONSTANT exported from `graha-drishti.ts` so any future "configure aspect school" preference can override it. Document the choice in a code comment.
- **Performance claim "no idle animations" is incomplete.** The persistent pulsing star and expanding ring on landed-glow DO run continuously while the overlay is mounted. That's three concurrent CSS animations × N aspected houses (max 3 specials → 3 destinations). On a low-end Android with the chart open, that's measurable battery cost. **Mitigation:** add a `--persist-pulse` CSS variable that the component sets to `paused` after 8 seconds. The initial reveal stays animated, the resting state quiets down.
- **"Aspected house number brightens to 14px + bold" is a layout shift.** Going from 12px to 14px nudges adjacent house numbers if they're tight. **Fix:** keep the size fixed, change colour and add `font-weight: 700`. Size change is theatre, not communication.

### 8.2 Things I'm avoiding

- **Multi-planet selection.** Showing "all aspects on this house" requires clicking the house, not the planet — that's a different feature. Out of scope.
- **Aspect cancellation by retrograde or combust planets.** Some schools say a combust planet's aspects are forfeit. We're not encoding aspect quality here; just presence.
- **Animated trail of the comet (rendering a tail behind the moving dot).** Tried it in the prototype — too noisy with three concurrent paths. The path is already drawn as a static dashed guide; the moving dot is enough.
- **South Indian chart's house numbering convention.** South Indian is conventionally counted differently from North Indian (Pisces fixed top-left, not Aries top-centre). The drishti logic itself is identical — it operates on house indices — but the *geometric overlay* on South Indian needs distinct centroids and polygons. Phase 3.

### 8.3 What I haven't validated

- **Mobile touch target on planet glyphs.** Current chart planet glyphs are ~14 px wide. WCAG minimum is 44×44 px. Either expand the invisible hit-test area around each glyph or accept a fat-finger problem. **Action item for Phase 2.**
- **Comet path readability with multiple planets in one house.** If three planets sit in House 1 and the user clicks Saturn, the dashed guide path starts from a single point — but visually the comet emanates from "the house", not from "Saturn specifically". Need to anchor the comet origin at the exact glyph position, not the house centroid. The prototype hand-waved this by putting Saturn alone in House 1.
- **Whether the dashed gold guide path looks good when the planet sits in House 7 already (the line collapses to the centre).** Self-aspect — by definition every planet aspects its own house's opposite, but if the planet is mid-chart on the diagonals, the path can overlap the chart's existing strokes. Need to test, possibly thicken to 2 px in that specific case.
- **Behaviour when the user has the chart open and the page revalidates (ISR / next/navigation back-forward).** Selection state lives in component state, so it resets on remount. That's fine, but should be documented so we don't add persistence later and break the "click empty to dismiss" muscle memory.

### 8.4 Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Aspect rules dispute (Rahu/Ketu) | Medium | Constant-as-config, code comment, future preference toggle |
| Touch target too small | Medium | Invisible 44×44 hit-test area in Phase 2 |
| Battery / animation cost | Low | Auto-quiet persistent pulses after 8 s |
| Layout shift on house-number resize | Low | Fixed size, change colour + weight only |
| South Indian centroid mismatch | Low | Phase 3 — separate config map |
| Future "aspect strength" data could break the visual cap (only 3 specials encoded) | Low | Overlay component takes `aspectedHouses` as a list — already extensible |

### 8.5 What success looks like

A first-time visitor who's never read Vedic astrology can click any planet on the kundali, watch three comets fly out, and say "oh, so Saturn affects those three houses" without reading documentation. Anybody who *does* read the Tippanni section sees the same houses called out in text. The two surfaces tell the same story.

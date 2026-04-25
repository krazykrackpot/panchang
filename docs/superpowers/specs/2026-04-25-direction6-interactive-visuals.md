# Direction 6: Interactive & Visual Experiences — Deep Dive

**Date**: 2026-04-25
**Status**: Deep dive brainstorm
**Selected features**: All 8 (A through H)

---

## Technology Strategy

The app currently has zero 3D/WebGL and minimal D3 usage. Adding interactive visualizations means choosing a rendering stack:

**Recommendation: Layered approach**
- **D3.js** (already installed) for 2D data visualizations: Sky Map, Dasha Timeline, Strength Radar
- **Three.js / React Three Fiber** (new dependency) for 3D: Celestial Sphere, Eclipse Simulator
- **SVG + Framer Motion** (already installed) for chart-based animations: Transit Playground, Yoga Animator
- **Canvas 2D** for physics-based animation: Retrograde Visualizer

This avoids a single massive dependency and uses the right tool per feature.

**Bundle impact**: Three.js is ~150KB gzipped. React Three Fiber adds ~40KB. These would only load on the 3D feature pages via `next/dynamic` with `ssr: false`. D3 is already in the bundle. Net impact on other pages: zero.

**Performance guardrails**:
- All interactive features must be lazy-loaded (`next/dynamic`)
- 3D scenes: max 60fps on M1 Mac, graceful fallback to 2D on low-power devices
- Mobile: touch gestures for all interactions (pinch-zoom, swipe-scrub, tap-select)
- Accessibility: every interactive visualization must have an equivalent text/table view toggle

---

## 6A. Live Sky Map

### Concept
A real-time polar projection of the ecliptic showing all 9 grahas at their current sidereal positions. The outer ring shows 27 nakshatras, the next ring shows 12 rashis, and planets sit at their precise longitude within. The ascendant (lagna) for the user's location is marked as a rotating indicator (it moves ~1° every 4 minutes).

### Design

**Visual structure** (inside out):
1. **Center**: Earth glyph or Om symbol
2. **Inner ring**: 12 rashi divisions, colored by element (fire=red-gold, earth=green-gold, air=silver-blue, water=deep-blue). Each labeled with rashi symbol (from existing RashiIcons).
3. **Planet track**: 9 grahas positioned by sidereal longitude. Each planet rendered as its custom SVG icon (from GrahaIcons) with a glow effect. Retrograde planets pulse with a red tint.
4. **Outer ring**: 27 nakshatra divisions, each labeled with its name. Current Moon nakshatra highlighted.
5. **Ascendant line**: A golden line from center to the current ascendant degree, rotating in real time.
6. **Aspect lines**: Optional toggle — show current aspects between planets as colored arcs (trine=green, square=red, opposition=orange, conjunction=gold).

**Interactions**:
- **Hover planet**: Tooltip showing name, exact longitude (DD°MM'SS"), speed, dignity (exalted/own/debilitated/friend/enemy), nakshatra pada, retrograde status
- **Click planet**: Side panel with full detail — current transit house (from user's natal chart if available), dasha relevance, recent sign change, upcoming sign change
- **Time scrubber**: Bottom bar — drag to scrub forward/backward in time. Planets animate to new positions. Range: ±1 year from today.
- **Speed controls**: Play/pause, 1x (real-time), 60x (1 min = 1 hour), 1440x (1 min = 1 day), 43200x (1 min = 1 month)
- **Natal overlay toggle**: If the user has a saved chart, show natal planet positions as faded dots. Transit-to-natal aspects become visible.

**Data source**: `getPlanetaryPositions(jd)` from `astronomical.ts` — called once per frame at real-time speed, or per step at accelerated speed. At 60fps real-time, planet positions change imperceptibly per frame — update every 60 seconds at 1x speed, every frame at higher speeds.

### Architecture
- Component: `src/components/sky-map/LiveSkyMap.tsx` — main D3 polar projection
- Sub-components: `PlanetMarker.tsx`, `NakshatraRing.tsx`, `RashiRing.tsx`, `AspectOverlay.tsx`, `TimeScrubber.tsx`
- Hook: `usePlanetaryPositions(jd)` — calls API or computes client-side
- Page: `/sky` or `/live-sky` — full-page immersive view
- Also embeddable as a widget on the home page (smaller, non-interactive version)

### Technical Notes
- D3 polar projection: `d3.scaleLinear().domain([0, 360]).range([0, 2 * Math.PI])` for longitude → angle mapping
- Planet positions need sidereal longitude, which the existing `toSidereal()` function provides
- The ascendant computation requires `approximateSunrise()` and local sidereal time — already available
- Performance: D3 SVG can handle 9 planets + rings at 60fps easily. Canvas fallback if the aspect lines get too complex.

### Implementation Estimate: 1.5–2 weeks

---

## 6B. Animated Dasha Timeline

### Concept
Your entire life rendered as a scrubable horizontal timeline. The Vimshottari Mahadasha (120-year cycle) forms the outermost band. Each Mahadasha contains its Antardashas as nested bands. Each Antardasha contains Pratyantardashas as the innermost bands. The current moment is marked with a vertical pulsing line.

### Design

**Visual structure**:
```
|<-- Ketu MD -->|<-------- Venus MD -------->|<--- Sun MD --->|<-- Moon MD -->| ...
                |Ven/Ven|Ven/Sun|Ven/Moon|Ven/Mars|Ven/Rah|...|
                         |S/S|S/Mo|S/Ma|S/Ra|S/Ju|...|
```

Three nested horizontal bands:
1. **Mahadasha** (top, tallest): 9 colored segments spanning the full 120-year cycle
2. **Antardasha** (middle): Sub-segments within the current or selected Mahadasha
3. **Pratyantardasha** (bottom, thinnest): Sub-sub-segments within the current or selected Antardasha

**Color coding by planet** (consistent with existing graha colors):
| Planet | Color |
|--------|-------|
| Sun | #FF6B35 (burnt orange) |
| Moon | #C0C0C0 (silver) |
| Mars | #DC143C (crimson) |
| Mercury | #50C878 (emerald) |
| Jupiter | #FFD700 (gold) |
| Venus | #FF69B4 (pink) |
| Saturn | #4169E1 (royal blue) |
| Rahu | #8B4513 (dark brown) |
| Ketu | #808080 (gray) |

**Interactions**:
- **Zoom**: Mouse wheel / pinch to zoom into any time range. At maximum zoom, individual days are visible within Pratyantardasha.
- **Pan**: Click-drag to scroll through time.
- **Current moment**: Pulsing vertical gold line with "NOW" label. Always visible, snaps back on double-click.
- **Click any segment**: Interpretation panel slides in from the right with:
  - Period name ("Venus Mahadasha / Sun Antardasha / Moon Pratyantardasha")
  - Date range
  - Dasha lord's natal placement and dignity
  - Key themes and interpretation (from existing tippanni engine)
  - "How this period relates to your chart" (house lordship, yogas involving the dasha lord)
- **Life event markers**: Vertical pins on the timeline (from Direction 3's journal, if available). Click → see the event + which dasha it fell in.
- **Dasha transition alerts**: Upcoming transitions highlighted with a subtle glow. "Mars Antardasha begins in 47 days."

**Contextual views**:
- **Full life view** (default): Birth to 120 years. Mahadashas are the primary visual.
- **Decade view**: 10-year window. Antardashas become the primary visual.
- **Year view**: 1-year window. Pratyantardashas are fully visible.
- **Month view**: 1-month window. Daily resolution.

### Architecture
- Component: `src/components/dasha/DashaTimeline.tsx` — main D3 horizontal timeline
- Sub-components: `DashaSegment.tsx`, `TimelineZoomControls.tsx`, `DashaDetailPanel.tsx`, `LifeEventPin.tsx`
- Hook: `useDashaTimeline(dashaData)` — transforms dasha array into D3-renderable segments
- Integration: New tab on `/kundali` page ("Timeline" tab) + standalone at `/dashboard/timeline`
- Data: Already fully computed in `dasha.ts` — Mahadasha, Antardasha, Pratyantardasha with exact start/end dates

### Technical Notes
- D3 `scaleTime()` for the x-axis. `d3.zoom()` for pan/zoom behavior.
- Nested bands: three `<g>` layers with `<rect>` elements per segment.
- Performance: Even the full 120-year timeline with all 3 levels = ~1000-2000 rect elements. D3 handles this trivially.
- The tricky part is the zoom interaction — snapping to meaningful levels (decade/year/month) as the user zooms.

### Implementation Estimate: 1.5 weeks

---

## 6C. Transit Playground

### Concept
An interactive sandbox where the user's natal chart is fixed and transit planets can be dragged to any position. As planets move, aspects light up, yogas form/dissolve, and house activation scores change in real time. A "what if" tool for learning and prediction.

### Design

**Layout**: Split view
- **Left (60%)**: North Indian diamond chart with natal planets in their fixed positions (filled dots). Transit planets rendered as outlined/hollow dots that can be dragged.
- **Right (40%)**: Real-time analysis panel showing:
  - Active aspects (with strength)
  - Yogas currently formed
  - House activation scores (from Ashtakavarga)
  - Gochara quality for each house

**Drag behavior**:
- Grab any transit planet → drag it around the chart
- Planet snaps to the nearest degree within the house it's dragged to
- As it moves across a house boundary, the house it's entering highlights
- Aspect lines appear/disappear dynamically:
  - Gold line = conjunction (same house)
  - Green arc = trine (5th/9th)
  - Red arc = opposition (7th)
  - Blue arc = square (4th/10th)
  - Dashed = partial aspect (Jupiter 5/7/9, Saturn 3/7/10, Mars 4/7/8)

**Presets**:
- "Current transits" — load real planetary positions for today
- "Next month" / "3 months" / "6 months" / "1 year" — jump forward
- "Custom date" — date picker → load positions for that date
- "Saturn in each house" — cycle Saturn through all 12 houses to see the effect
- "Double transit finder" — highlight houses where both Jupiter and Saturn have influence

**Analysis panel updates in real time**:
```
Aspects Active:
  Transit Jupiter ☌ Natal Venus (7th house) — Benefic conjunction
  Transit Saturn △ Natal Moon (trine from 3rd) — Stabilizing

Yogas Formed:
  ✓ Gajakesari — Transit Jupiter in kendra from natal Moon
  ✗ Sade Sati — Saturn not in 12th/1st/2nd from Moon

House Activation (Ashtakavarga):
  1st: ●●●●○○○○ (4/8)  7th: ●●●●●●○○ (6/8)
  2nd: ●●○○○○○○ (2/8)  8th: ●●●○○○○○ (3/8)
  ...
```

### Architecture
- Component: `src/components/transit/TransitPlayground.tsx`
- Sub-components: `DraggablePlanet.tsx`, `AspectOverlay.tsx`, `TransitAnalysisPanel.tsx`, `PresetSelector.tsx`
- Hooks: `useTransitAnalysis(natalChart, transitPositions)` — real-time aspect + yoga computation
- Page: New tab on `/kundali` page ("Transit Playground") or standalone at `/tools/transit-playground`
- Data: Natal chart from existing KundaliData, transit positions from drag state or `getPlanetaryPositions(jd)`

### Technical Notes
- SVG drag: use `onMouseDown/Move/Up` handlers or a library like `@dnd-kit/core`
- Real-time yoga detection: the existing `detectYogas()` function works on planet positions — can be called on every drag event (debounced to 16ms = 60fps)
- Aspect computation is lightweight — just house offset calculations
- The chart must be the existing `ChartNorth` component extended with draggable transit overlays, NOT a new chart component (Rule ZA: one component for one truth)

### Implementation Estimate: 2 weeks

---

## 6D. 3D Celestial Sphere

### Concept
A Three.js 3D visualization of the celestial sphere as seen from Earth. The ecliptic plane is tilted at 23.4° to the celestial equator. Planets sit on the ecliptic as glowing orbs. Nakshatra star patterns are rendered as point clouds. The horizon for the user's location creates a visible "above/below" division. Time-scrub to watch planets orbit.

### Design

**Scene elements**:
1. **Celestial sphere**: Transparent dark blue sphere with a subtle star-field texture
2. **Ecliptic ring**: Golden ring tilted at 23.4° to the equatorial plane. Divided into 12 rashi segments with color-coded arcs.
3. **Celestial equator**: Faint white ring at 0° declination
4. **Planets**: 9 glowing orbs on the ecliptic. Size proportional to brightness (Jupiter largest, Ketu smallest). Custom shader: inner glow + outer halo in planet color.
5. **Nakshatra markers**: 27 labeled points on the ecliptic at nakshatra start degrees. Optional: actual star positions for the associated constellation.
6. **Horizon plane**: Semi-transparent disk at the observer's latitude. Stars/planets below the horizon are dimmed.
7. **House cusps**: 12 lines from the center through the ecliptic, showing house boundaries for the user's birth location. Only shown if natal data is available.

**Camera controls**:
- **Orbit**: Click-drag to rotate around the sphere
- **Zoom**: Scroll to zoom in/out
- **Preset views**: "From North Pole" (top-down, classical chart view), "From horizon" (as you'd see the sky), "Ecliptic plane" (edge-on view showing planetary latitudes)
- **Auto-rotate**: Slow rotation option for ambient display

**Time controls**:
- Same scrubber as Sky Map: play/pause, speed controls (1x to 43200x)
- At high speed, watch planets orbit — inner planets whip around, outer planets barely move
- Retrograde periods visible as planets backing up against the star field

**Toggle views**:
- **Geocentric** (default): Earth at center, everything orbits Earth (Jyotish perspective)
- **Heliocentric**: Sun at center, planets in correct orbits (astronomical perspective)
- Smooth animated transition between the two views

**Interactions**:
- **Click planet**: Info card appears in 3D space near the planet (or in a 2D overlay panel)
- **Click nakshatra**: Highlights the nakshatra span on the ecliptic, shows associated deity, ruling planet, and qualities
- **Toggle layers**: Show/hide ecliptic, equator, horizon, house cusps, aspect lines, nakshatras independently

### Architecture
- Component: `src/components/3d/CelestialSphere.tsx` — React Three Fiber scene
- Sub-components: `EclipticRing.tsx`, `PlanetOrb.tsx`, `NakshatraField.tsx`, `HorizonPlane.tsx`, `HouseCusps.tsx`, `CameraControls.tsx`, `TimeController.tsx`
- Shaders: `planet-glow.glsl` — custom shader for planet rendering
- Page: `/sky/3d` or a toggle on the Sky Map page ("2D / 3D" switch)
- Dependencies: `three`, `@react-three/fiber`, `@react-three/drei` (helpers for orbit controls, text, etc.)

### Technical Notes
- React Three Fiber is the idiomatic way to use Three.js in React/Next.js
- `@react-three/drei` provides `OrbitControls`, `Text`, `Stars` (star field), `Billboard` (labels that face camera)
- Must be wrapped in `next/dynamic` with `ssr: false` — Three.js cannot run on the server
- Performance budget: target 60fps on M1 Mac, 30fps on mid-range mobile. The scene is simple (< 100 meshes) so this should be comfortable.
- Fallback: If WebGL is not available (rare), show the 2D Sky Map instead with a message

### Implementation Estimate: 3–4 weeks (most complex feature)

---

## 6E. Retrograde Loop Visualizer

### Concept
An animated 2D visualization that explains retrograde motion. Shows Earth and an outer planet (user-selectable) orbiting the Sun. A sight-line from Earth through the planet projects onto the "background stars" (a fixed circle). As Earth overtakes the outer planet, the projected position traces a retrograde loop.

### Design

**Two views (toggle)**:

**View 1: "From Above" (Heliocentric)**
- Sun at center, Earth and selected planet orbiting in circles
- Earth's orbit smaller, faster. Planet's orbit larger, slower.
- A dotted sight-line extends from Earth through the planet to the outer "star field" circle
- The projected point on the star field traces a path — forward, then backward (retrograde), then forward again
- The retrograde portion is highlighted in red

**View 2: "From Earth" (Geocentric)**
- Earth is fixed at center
- The planet appears to move against a horizontal star field
- Normally moves left-to-right (direct motion)
- During retrograde: planet slows, stops (station), reverses (retrograde), stops again (station), resumes
- The retrograde loop is clearly visible as a looping path

**Controls**:
- **Planet selector**: Mercury, Venus, Mars, Jupiter, Saturn (each has different loop characteristics)
- **Speed**: 1x (real orbital speed scaled), 10x, 100x
- **Play/Pause/Step**: Step forward one day at a time
- **Current retrograde**: Button to jump to the next real retrograde of the selected planet
- **Labels**: Show current date, planet's ecliptic longitude, speed in °/day, "DIRECT" / "STATIONARY" / "RETROGRADE" status

**Educational annotations**:
- Text callouts that appear at key moments: "Earth is now overtaking Mars — Mars appears to slow down"
- "Station point: Mars appears to stop before reversing"
- "Retrograde: Mars appears to move backward against the stars"
- These can be toggled off for clean viewing

### Architecture
- Component: `src/components/learn/RetrogradeVisualizer.tsx` — Canvas 2D animation
- Sub-components: `OrbitView.tsx` (heliocentric), `GeocentricView.tsx`, `RetrogradeControls.tsx`
- Page: Embed in `/learn/retrograde-effects` and link from `/retrograde`
- Data: Orbital periods from constants (no API call needed — this is a geometric demonstration, not real ephemeris)

### Technical Notes
- Canvas 2D is the right choice — this is a physics simulation, not a data visualization
- `requestAnimationFrame` loop with time-step integration
- Orbital mechanics: simple circular orbits with correct period ratios (Earth: 1 year, Mars: 1.88 years, Jupiter: 11.86 years, etc.)
- The sight-line projection is basic trigonometry: `atan2(planet.y - earth.y, planet.x - earth.x)`

### Implementation Estimate: 1 week

---

## 6F. Eclipse Simulator

### Concept
A visual simulation of solar and lunar eclipses. For solar eclipses: shows the Moon's shadow cone sweeping across Earth's surface. For lunar eclipses: shows Earth's shadow engulfing the Moon. The user's location is marked, showing local visibility and timing.

### Design

**Solar Eclipse View**:
- 3D scene: Sun (large, off-screen left), Moon (passing in front), Earth (globe, right)
- Moon's umbra and penumbra cones rendered as semi-transparent volumes
- Shadow path traced on Earth's surface as a dark band
- User's location marked with a pin: "You will see: 72% partial eclipse, starting 14:23, maximum 15:47"
- Time scrubber: watch the shadow sweep across Earth over 2-3 hours

**Lunar Eclipse View**:
- 3D scene: Sun (off-screen), Earth (casting shadow), Moon (passing through shadow)
- Earth's umbra (full shadow) and penumbra (partial shadow) as concentric circles
- Moon's disk gradually darkens as it enters the shadow
- Color shift: Moon turns red-copper during totality (Rayleigh scattering simulation)
- Timeline showing penumbral → partial → total → partial → penumbral phases

**Eclipse Calendar Integration**:
- List of upcoming eclipses (from existing eclipse engine)
- Click any eclipse → loads the simulator for that specific eclipse
- Past eclipses also available (educational)

**Jyotish Overlay (unique feature)**:
- Which rashi/nakshatra the eclipse falls in
- Which natal house it activates for the user
- Classical interpretation: "Solar eclipse in Ashlesha nakshatra, your 4th house — domestic changes, emotional introspection"
- Graha Yuddha / combustion status during the eclipse

### Architecture
- Component: `src/components/eclipses/EclipseSimulator.tsx` — Three.js scene
- Sub-components: `SolarEclipseScene.tsx`, `LunarEclipseScene.tsx`, `EclipseTimeline.tsx`, `JyotishOverlay.tsx`
- Page: Embed in `/eclipses` page as a visual mode toggle ("List view / Simulator view")
- Data: Eclipse data already computed in `lib/eclipse/` — need to add shadow cone geometry (Besselian elements) for precise simulation

### Technical Notes
- Share the Three.js dependency with the Celestial Sphere (6D)
- Shadow cone geometry: simplified model using lunar distance and apparent diameters (already computed in eclipse engine)
- Earth globe texture: use a dark-themed globe texture (NASA Blue Marble, darkened to match the app theme)
- The Rayleigh scattering effect (red Moon) can be a simple color-shift shader based on shadow penetration depth

### Implementation Estimate: 2–3 weeks

---

## 6G. Planetary Strength Radar

### Concept
An interactive radar (spider) chart showing the 6 components of Shadbala for each planet. Users can select individual planets or overlay multiple planets for comparison. Click into any component to see the sub-breakdown.

### Design

**Radar chart**:
- 6 axes: Sthanabala (positional), Digbala (directional), Kalabala (temporal), Chestabala (motional), Naisargikabala (natural), Drikbala (aspectual)
- Each axis scaled 0-100 (normalized from Shadbala rupas)
- Planet's strength plotted as a filled polygon on the radar
- Multiple planets can be overlaid with different colors and opacity

**Interactions**:
- **Planet selector**: 9 toggle buttons (Sun through Ketu). Click to show/hide each planet's radar
- **Hover axis**: Tooltip explaining what this Bala measures
- **Click axis**: Drill-down panel showing sub-components:
  - Sthanabala → Uchcha (exaltation), Saptavargaja (7-division), Ojhayugma (odd-even), Kendra (angle), Drekkana
  - Digbala → Direction vs natural directional strength
  - Kalabala → Natonnata (day/night), Paksha (lunar phase), Tribhaga, Abda, Masa, Vara, Hora, Ayana
  - Chestabala → Speed-based strength (retrograde, combust, direct)
  - Naisargikabala → Fixed natural strength ranking
  - Drikbala → Strength from aspects received
- **Compare mode**: Select two saved charts → overlay both users' planet radars in different color schemes
- **Total Shadbala bar**: Below the radar, horizontal bar chart showing total Shadbala for all 9 planets, sorted strongest to weakest

**Visual style**:
- Dark background matching the app theme
- Radar grid lines in gold-dark (#8a6d2b)
- Planet polygon fills: semi-transparent planet color
- Polygon borders: solid planet color
- Axis labels in text-secondary color
- Active planet polygon: brighter, with glow effect

### Architecture
- Component: `src/components/kundali/ShadbalaRadar.tsx` — D3.js radar chart
- Sub-components: `RadarAxis.tsx`, `PlanetPolygon.tsx`, `BalaBreakdownPanel.tsx`, `PlanetSelector.tsx`
- Integration: New section in the kundali page (Sphuta tab or its own "Strengths" tab)
- Data: Shadbala already fully computed in `shadbala.ts` — just needs normalization for radar display

### Technical Notes
- D3 radar charts: compute polygon vertices using `d3.lineRadial()` with `d3.scaleLinear()` for each axis
- The normalization is important: Naisargikabala has a much smaller range than Sthanabala. Normalize each axis independently (0 = minimum possible for this bala, 100 = maximum possible).
- Animation: use Framer Motion's `motion.path` for smooth polygon transitions when toggling planets
- Responsive: on mobile, the radar fills the full width with the breakdown panel below instead of beside

### Implementation Estimate: 1 week

---

## 6H. Yoga Formation Animator

### Concept
Select any yoga from a catalog. Watch an animated chart diagram show how the yoga forms — planets animate from a neutral position to their required placements, aspect lines draw themselves, and condition text highlights which rules are satisfied. Then toggle to "your chart" to see if/how the yoga appears in the user's actual horoscope.

### Design

**Two modes**:

**Mode 1: "Textbook" — How this yoga forms**
- Start with an empty North Indian chart
- Planets involved in the yoga animate from the center to their required positions
- House labels highlight as planets land ("Jupiter enters a Kendra from Moon")
- Aspect lines draw themselves as relevant aspects form
- Condition checklist appears on the right, items tick green as each condition is met:
  ```
  ✓ Jupiter in Kendra (1/4/7/10) from Moon
  ✓ Jupiter not debilitated
  ✓ Jupiter not combust
  = Gajakesari Yoga formed!
  ```
- Final state: all planets in position, all conditions met, yoga name glows

**Mode 2: "Your Chart" — Does this yoga exist in your horoscope?**
- Show the user's actual chart with all planets
- Highlight the planets involved in this yoga
- Run the same condition checklist against actual positions
- If the yoga exists: green glow, "Gajakesari Yoga is present in your chart"
- If not: red X on the failing condition, "Jupiter is in the 6th from Moon — Gajakesari does not form"
- If partially formed: amber, "Gajakesari conditions partially met — Jupiter is in Kendra but is combust"

**Yoga catalog** (grouped by type):
- **Pancha Mahapurusha** (5): Hamsa, Malavya, Ruchaka, Bhadra, Shasha
- **Lunar Yogas** (6): Gajakesari, Chandra-Mangala, Sunaphaa, Anaphaa, Durudhara, Kemadruma
- **Raja Yogas** (8): Kendra-Trikona, Dharma-Karmadhipati, Viparita, etc.
- **Dhana Yogas** (5): 2nd/5th/9th/11th lord combinations
- **Dosha Yogas** (4): Kaal Sarp, Mangal, Pitra, Grahan
- **Other** (10+): Budhaditya, Vasumati, Amala, Saraswati, etc.

Total: 30-40 animated yogas covering the most important formations.

**Interactions**:
- **Yoga selector**: Searchable dropdown or grid of yoga cards
- **Play/Pause/Reset**: Control the animation
- **Step-by-step**: Advance one condition at a time (for teaching)
- **Speed control**: Slow (for learning), fast (for browsing)
- **Share**: "Share this yoga formation" — generates a static image or link

### Architecture
- Component: `src/components/learn/YogaAnimator.tsx` — SVG chart with Framer Motion
- Sub-components: `AnimatedChart.tsx`, `ConditionChecklist.tsx`, `YogaCatalog.tsx`, `YogaModeToggle.tsx`
- Data: Yoga definitions from existing `yogas.ts` and `yogas-complete.ts` — need to add animation metadata (which planets, which positions, which conditions)
- New data file: `src/lib/constants/yoga-animations.ts` — animation scripts for each yoga
- Page: `/learn/yogas/animator` or embed in each yoga's detail page
- Integration: Link from the kundali "Yogas" section — "See how this yoga forms" button next to each detected yoga

### Technical Notes
- Framer Motion `variants` and `animate` for orchestrated multi-element animations
- Each yoga needs an "animation script": an ordered list of steps (planet appears, moves to position, aspect line draws, condition ticks)
- The chart component should be the existing `ChartNorth` with an animation layer on top — NOT a new chart (Rule ZA)
- For "Your Chart" mode: reuse the exact same yoga detection functions from `yogas.ts` — just visualize the intermediate state

### Implementation Estimate: 2 weeks

---

## Implementation Priority & Phasing

### Phase 1: Foundation (Week 1-2)
- **6G. Strength Radar** — Simplest, uses only D3 + existing Shadbala data. Ships fast, proves the interactive visualization pattern.
- **6B. Dasha Timeline** — D3 horizontal timeline. High user value, builds on existing dasha data.

### Phase 2: Sky & Motion (Week 3-5)
- **6A. Live Sky Map** — D3 polar projection. The daily-engagement feature. Most visible on the home page.
- **6E. Retrograde Visualizer** — Canvas 2D animation. Perfect for the /learn section. Standalone, no dependencies on other features.

### Phase 3: Interaction (Week 6-8)
- **6C. Transit Playground** — SVG drag interactions. Builds on the chart component. Most educationally valuable.
- **6H. Yoga Animator** — SVG + Framer Motion. Builds on yoga detection + chart component.

### Phase 4: 3D (Week 9-13)
- **6D. 3D Celestial Sphere** — Three.js. The "wow" feature. Most technically complex.
- **6F. Eclipse Simulator** — Three.js. Shares 3D infrastructure with the sphere. Natural extension.

### Total estimate: ~13 weeks for all 8 features

---

## Cross-Cutting Concerns

**Shared infrastructure**:
- `src/components/visualization/` — shared hooks and utilities (time scrubber, speed controls, planet color map)
- `src/hooks/usePlanetPositions.ts` — shared hook for real-time or historical planetary positions
- `src/hooks/useAnimationLoop.ts` — shared requestAnimationFrame loop with time control

**Mobile**:
- All features must work on touch devices
- 3D features (6D, 6F): reduce quality on mobile (fewer particles, lower resolution textures)
- Drag features (6C): touch drag with visual feedback
- Timeline features (6B): horizontal swipe for panning

**Dark theme**:
- All visualizations use the app's existing dark color palette
- Gold accents on dark navy backgrounds
- Planet colors as defined in the graha color table above
- No white backgrounds, no light-mode fallbacks

**Accessibility**:
- Every visualization has a "Table view" toggle showing the same data in tabular form
- Screen reader descriptions for all interactive elements
- Keyboard navigation: arrow keys for time scrubbing, tab for planet selection
- Color-blind safe: planet identification uses icons + labels, not just color

**Performance**:
- All visualization pages: `next/dynamic` with `ssr: false`
- Three.js loaded only on 3D pages (~190KB gzipped, split-loaded)
- D3 already in bundle, minimal additional impact
- Canvas animations: auto-pause when tab is not visible (`document.hidden`)
- Frame budget: aim for 60fps, degrade gracefully on low-power devices (reduce particle counts, disable glow effects)

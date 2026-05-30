# Planet Dignity Indicator on the Birth Chart — Deep Dive

**Status:** Design — answered, ready for implementation
**Owner:** Aditya
**Reference:** companion to [`drishti-overlay-spec.md`](./drishti-overlay-spec.md); same chart, different layer

## 0. Decisions locked in (2026-05-30)

1. **Deep exaltation (parama-ucha) ships in Phase 1** — 8 tiers, not 7. Adds a small flame badge above the planet glyph when longitude is within ±1° of `EXALTATION_DEGREES[planet]`. See §5.5.
2. **Natural friendship only** — temporal / combined friendship is a future refinement, not blocking this design.
3. **Locale labels reuse the existing tippanni vocabulary** where present. Inventory: `exalted` / `debilitated` / `own` / `moolatrikona` / `friendly` (≡ Mitra) / `neutral` (≡ Sama) / `enemy` (≡ Shatru) are all already used across the codebase. New term `parama-ucha` is coined for deep exaltation since we've never tracked it before. See §5.6.

## 1. The problem

Vedic astrology cares enormously about *where* a planet sits — not just which house, but **which sign**, because each sign is "owned" by a planet, and a planet behaves wildly differently depending on whether it's at home, hosted by a friend, or in enemy territory. A user looking at their chart sees ♄ in Capricorn and ♄ in Cancer rendered identically — but one is Saturn at full power in its own sign and the other is Saturn crippled in its sign of debilitation. That difference is the entire reading.

We want a **passive visual** on the chart that lets the user know, at a glance, the dignity tier of every planet — without any clicks or tooltips.

## 2. The eight dignities

A strict hierarchy of eight dignity states, defined classically in BPHS (Brihat Parashara Hora Shastra) Ch.3–4. Ordered most beneficial to most harmful:

| # | State | Sanskrit | Definition | Visual weight |
|---|---|---|---|---|
| 1 | **Deep exaltation** | Parama Uchcha | Planet within ±1° of its exact exaltation degree | Strongest — exalted halo + flame badge |
| 2 | **Exalted (in sign)** | Uchcha | Planet anywhere else in its exaltation sign | Strongest halo |
| 3 | **Moolatrikona** | Mūlatrikoṇa | Specific sign + degree range; planet on its "throne" | Very prominent |
| 4 | **Own sign** | Svakṣetra | Planet in a sign it owns (Sun in Leo, Mars in Aries or Scorpio, etc.) | Prominent |
| 5 | **Friend's sign** | Mitra | Sign owned by a planet that is this planet's natural friend | Subtle positive |
| 6 | **Neutral sign** | Sama | Sign owned by a planet that is this planet's natural neutral | Neutral / default |
| 7 | **Enemy's sign** | Śatru | Sign owned by a planet that is this planet's natural enemy | Subtle negative |
| 8 | **Debilitated** | Nīca | Specific sign + degree (180° from exaltation); weakest | Most "dimmed" |

Adhi-Mitra / Param Mitra (great friend / arch-enemy) — combined natural + temporal friendship — is **not** in this design; ships in a future revision per decision §0.2.

## 3. The canonical data (already in the codebase)

| What | Where | Status |
|---|---|---|
| Exaltation **sign + degree** | `src/lib/constants/dignities.ts` — `EXALTATION_SIGNS`, `EXALTATION_DEGREES` | ✅ verified vs BPHS Ch.4 |
| Debilitation sign | `dignities.ts` — `DEBILITATION_SIGNS` (exactly 180° from exaltation) | ✅ |
| Moolatrikona ranges | `dignities.ts` — `MOOLATRIKONA: { sign, startDeg, endDeg }` | ✅ verified Apr 2026 per CLAUDE.md Lesson U |
| Own signs | `dignities.ts` — `OWN_SIGNS` (each planet → list of signs) | ✅ |
| Sign lords | `dignities.ts` — `SIGN_LORDS: { signId → planetId }` | ✅ |
| Friendship (natural) | `src/lib/constants/friendships.ts` — `PLANET_FRIENDSHIPS`, `friendsAsSet`, `enemiesAsSet` | ✅ verified Apr 2026 per CLAUDE.md Lesson S (after 16-file audit) |
| Helpers | `isOwnSign`, `isExalted`, `isDebilitated`, `getSignLord` | ✅ in `dignities.ts` |

**What's missing:** a single function that takes `(planetId, signId, longitude)` and returns the dignity tier. That's the piece this PR specs.

## 4. The dignity resolver

```ts
// src/lib/kundali/dignity.ts

import { EXALTATION_SIGNS, EXALTATION_DEGREES, DEBILITATION_SIGNS,
         MOOLATRIKONA, OWN_SIGNS, SIGN_LORDS, isOwnSign,
         isExalted, isDebilitated } from '@/lib/constants/dignities';
import { friendsAsSet, enemiesAsSet } from '@/lib/constants/friendships';

export type DignityTier =
  | 'parama-ucha'   // deep exaltation — within ±1° of exact degree
  | 'exalted'        // anywhere in the exaltation sign
  | 'moolatrikona'
  | 'own'
  | 'friend'
  | 'neutral'
  | 'enemy'
  | 'debilitated';

/**
 * Resolve the dignity tier for a planet at a given sidereal longitude.
 *
 * Order of checks is hierarchical and stops at the first match:
 *   1. Exalted (sign matches AND within ±1° of exact degree)?
 *      Note: many systems consider "in exaltation sign" enough; we encode
 *      the strict "within 1° of the deep exaltation point" as a separate
 *      tier-1+ stage. For the visual chart we use exaltation-sign as tier 1.
 *   2. Moolatrikona (sign matches AND longitude within range)?
 *   3. Own sign?
 *   4. Debilitated sign? (we check this BEFORE friend/enemy so debilitation
 *      isn't masked by friendship of the sign-lord — e.g. Saturn in Aries
 *      is debilitated, even though Mars (sign-lord) is Saturn's neutral.)
 *   5. Friend, neutral, or enemy based on sign-lord vs planet's friendship.
 *
 * Rahu and Ketu use their assigned exaltation/debilitation per BPHS (Rahu
 * exalted in Taurus, debilitated in Scorpio; Ketu reverse). Their friendship
 * is handled by `friendsAsSet`/`enemiesAsSet` from friendships.ts.
 */
const PARAMA_UCHCHA_ORB_DEG = 1; // ±1° around the exact exaltation degree

export function getDignity(
  planetId: number,
  signId: number,         // 1-12
  longitude: number,      // sidereal degrees within the sign, 0-30
): DignityTier {
  if (isExalted(planetId, signId)) {
    const peak = EXALTATION_DEGREES[planetId];
    if (peak != null && Math.abs(longitude - peak) <= PARAMA_UCHCHA_ORB_DEG) {
      return 'parama-ucha';
    }
    return 'exalted';
  }

  const mt = MOOLATRIKONA[planetId];
  if (mt && mt.sign === signId && longitude >= mt.startDeg && longitude < mt.endDeg) {
    return 'moolatrikona';
  }

  if (isOwnSign(planetId, signId)) return 'own';
  if (isDebilitated(planetId, signId)) return 'debilitated';

  const signLord = SIGN_LORDS[signId];
  if (friendsAsSet(planetId).has(signLord)) return 'friend';
  if (enemiesAsSet(planetId).has(signLord)) return 'enemy';
  return 'neutral';
}
```

### Edge cases I've thought about

- **Cusp degrees of moolatrikona vs own sign.** Sun's MT is Leo 0–20°. From 20° to 30° of Leo, Sun is still in its own sign — falls through to tier 3 correctly. ✅
- **Sun at exactly Aries 10°00'00".** Exaltation deep point. We don't currently encode "deep exaltation" as a separate visual tier; flagged as a future refinement (a small flame icon next to the symbol if longitude is within 0.1° of `EXALTATION_DEGREES[planet]`).
- **Saturn at Aries 0–0.99°.** Saturn's debilitation is Aries; Mars rules Aries; Mars is Saturn's neutral per the verified Apr-2026 table. By the order of checks, Saturn returns 'debilitated' (correct). ✅
- **Mercury at Virgo 16–20°.** This is Mercury's MT, *also* Virgo is Mercury's own sign. MT wins (tier 2 > tier 3). ✅
- **Rahu in Taurus 0–30°.** BPHS exaltation Taurus → tier 1. But some Tajika sources say Gemini. Same disclaimer as the drishti spec — exposed via the constant, can be overridden by a future preference toggle.

## 5. Visual design

Three candidate treatments. All work for both North Indian and South Indian; all encode the same 7-tier system but at different visual intensities.

### 5.1 Option A — Coloured halo behind the planet glyph (recommended)

A small soft halo (radial gradient) sits behind each planet symbol, coloured by dignity. Multi-planet houses just stack haloes.

```
       ╭──── soft halo (10 px radius)
       │     in dignity colour
       │
   ╭──────╮
   │  ♄   │ ← planet symbol unchanged
   ╰──────╯
```

**Colour map:**

| Tier | Halo colour | Halo opacity | Extra | Visual weight |
|---|---|---|---|---|
| Parama-ucha (deep exalted) | `#fbbf24` (amber-400) | 0.65 | Flame badge `🜂` above glyph | Strongest, slow pulse |
| Exalted (in sign) | `#fbbf24` (amber-400) | 0.55 | — | Strong, slow pulse |
| Moolatrikona | `#facc15` (yellow-400) | 0.45 | — | Strong, gentle pulse |
| Own | `#a3e635` (lime-400) | 0.35 | — | Steady, no pulse |
| Friend | `#86efac` (green-300) | 0.25 | — | Quiet |
| Neutral | `transparent` | 0 | — | No halo (default) |
| Enemy | `#fda4af` (rose-300) | 0.25 | — | Quiet, dim |
| Debilitated | `#f87171` (red-400) | 0.50 | — | Strong "warning" with slow pulse |

**Why this:**
- Doesn't change the existing planet glyph or its position — the entire current chart code keeps working.
- Multi-planet houses don't compete; haloes layer cleanly with `mix-blend-mode: screen` against the dark chart background.
- The colour mapping is intuitive: warm gold = strong, green = positive, red = warning, transparent = average.
- The "strongest at top + strongest at bottom" symmetry (exalted and debilitated both get the most halo intensity) matches Vedic intuition — both are *exceptional states* that the user must pay attention to.

**Implementation:**
```tsx
const tier = getDignity(planet.id, planet.sign, planet.longitude);
const halo = DIGNITY_HALOS[tier]; // { color, opacity, pulse }
return (
  <g className="planet-with-halo">
    {halo.opacity > 0 && (
      <circle
        cx={x} cy={y} r={11}
        fill={`url(#halo-${tier})`}
        opacity={halo.opacity}
        className={halo.pulse ? styles.dignityPulse : undefined}
      />
    )}
    <text x={x} y={y} className="planet-glyph">{symbol}</text>
  </g>
);
```

### 5.2 Option B — Tier badge under the planet glyph

A tiny pill or letter badge sits just below the planet, encoding the tier:

```
   ♄
  ─UC─    ← UC = Uchcha (exalted) | MT | OWN | FR | NT | EN | DB
```

**Pros:** Explicit; learnable; no ambiguity.
**Cons:** Adds visual noise to every planet, every chart. Multi-planet houses get cluttered fast.

### 5.3 Option C — Glyph colour itself (NOT recommended)

Tint the planet symbol itself by dignity (gold = exalted, red = debilitated, etc.).

**Pros:** No extra DOM.
**Cons:** Breaks the existing gold-on-navy chart aesthetic. Conflates "this planet is strong" with "this planet is selected/active". Accessibility risk if a user is colourblind — they lose the dignity signal entirely with no fallback.

### 5.4 The recommendation

**Option A (halo)** for the chart. Combined with an optional Option B (tier badge) only in the planet-positions side table where space allows — same data, two surfaces, both readable.

### 5.5 Parama-ucha flame badge

When a planet returns `'parama-ucha'`, render a small flame glyph immediately above the planet symbol, in the same amber as the halo:

```
   ◆     ← flame badge (5×6 px, amber, soft drop-shadow)
   ♄     ← planet glyph
   ─     ← halo (already there for any exalted tier)
```

SVG (sketch):
```tsx
{dignity === 'parama-ucha' && (
  <g transform={`translate(${x}, ${y - 14})`} className={styles.paramaUchchaBadge}>
    <path d="M0,4 C-2,2 -2,-1 0,-4 C2,-1 2,2 0,4 Z" fill="#fbbf24"/>
    <circle cx="0" cy="-1" r="1.2" fill="#fef3c7"/>
  </g>
)}
```

The flame badge's `drop-shadow` matches the halo's amber glow so the two read as one composition. On a chart with no parama-ucha planets, no flames render — zero overhead.

### 5.6 Locale strings

Tier names map to the existing tippanni vocabulary where it exists. Inventory:

| Internal key | Existing string in codebase | Use |
|---|---|---|
| `parama-ucha` | (new) | Coin "Parama Uchcha" — explained in the planet-positions tooltip |
| `exalted` | "Exalted" (`Uchcha` in `hi`/`sa`/`mai`/`mr`) — present in `tippanni-engine`, `bhavabala`, `shadbala` | Use as-is |
| `moolatrikona` | "Moolatrikona" — present in `tippanni-content`, `dignities` references | Use as-is |
| `own` | "Own sign" / "Swakshetra" — present in 6+ files | Use as-is |
| `friend` / `friendly` | "Friendly" / "Mitra" — present in multiple tippanni files | Use as-is |
| `neutral` / `sama` | "Neutral" / "Sama" — present | Use as-is |
| `enemy` / `shatru` | "Enemy" / "Shatru" — present | Use as-is |
| `debilitated` | "Debilitated" / "Neecha" — present in 25+ files | Use as-is |

For locales without explicit tippanni strings, fall back to English via the `tl()` helper (already standard project practice).

A single new constant in `dignity.ts` holds the trilingual labels:

```ts
export const DIGNITY_LABELS: Record<DignityTier, LocaleText> = {
  'parama-ucha': { en: 'Parama Uchcha', hi: 'परम उच्च', sa: 'परम उच्चः', /* … */ },
  exalted:       { en: 'Exalted',       hi: 'उच्च',       sa: 'उच्चः',      /* … */ },
  moolatrikona:  { en: 'Moolatrikona',  hi: 'मूलत्रिकोण',  sa: 'मूलत्रिकोणम्', /* … */ },
  own:           { en: 'Own sign',      hi: 'स्वक्षेत्र',   sa: 'स्वक्षेत्रम्',  /* … */ },
  friend:        { en: 'Friendly',      hi: 'मित्र',       sa: 'मित्रम्',     /* … */ },
  neutral:       { en: 'Neutral',       hi: 'सम',          sa: 'समम्',       /* … */ },
  enemy:         { en: 'Enemy',         hi: 'शत्रु',       sa: 'शत्रुम्',     /* … */ },
  debilitated:   { en: 'Debilitated',   hi: 'नीच',         sa: 'नीचम्',       /* … */ },
};
```

Tamil / Telugu / Bengali / Gujarati / Kannada / Marathi / Maithili strings fall back to English at the `tl()` boundary on first ship; we can fill in script-correct translations in a follow-up i18n pass once the visual is locked.

## 6. Interaction with drishti overlay (the other doc)

When the drishti overlay activates (chart dims back, aspected houses light up), the dignity haloes should:

- **Stay visible** on the selected planet — it's the source, the user needs to see its strength.
- **Dim to 40% of normal opacity** on every other planet — they're not the focus.
- **Stay at full opacity** in houses that are being aspected — these are the *destinations*, and the dignity of any planet sitting there is now suddenly relevant ("Saturn aspects a debilitated Mars in 7th — that's hard").

That last point makes the two visual layers compose meaningfully: dignity tells you *quality*, drishti tells you *relationship*, together they tell a story.

## 7. Implementation order

1. **`src/lib/kundali/dignity.ts`** — the resolver + unit tests against every classical example I can verify (Sun in Aries / Cancer / Leo / Libra; Saturn in Aries / Capricorn / Libra; Mars in Cancer / Aries; etc.).
2. **`src/components/kundali/PlanetGlyph.tsx`** — extract the existing planet rendering into a small component that accepts a `dignity` prop and renders the halo behind.
3. **`ChartNorth.tsx` + `ChartSouth.tsx`** — use `PlanetGlyph` instead of inline `<text>` for planet rendering. Compute dignity once per render from the kundali data.
4. **Side-panel tier badge** — in the planet-positions table (already present in Tippanni / sign positions UI), add the tier name in the locale-translated form.

---

## 8. Self-review (critical)

### 8.1 What I'm uncertain about

- **The hierarchical resolver collapses information.** A planet that's *both* in its own sign and in its MT range (Mercury 16–20° Virgo) loses the "also own sign" signal — we return MT only. For a casual user that's fine, but the planet-position table should still show "MT (also own sign)" in the verbose label.
- **"Exalted" is a SIGN-level state in the resolver, but classical Jyotish distinguishes "exalted at peak degree" (parama-ucha) from "merely in exaltation sign".** I noted this in §4 but the resolver doesn't expose it. A future tier "deep exaltation" (halo + tiny flame badge) is the natural extension; not in this design to avoid a 9-tier system.
- **Friendship is "natural" only in this design.** Real readings use *combined friendship* (natural friendship modulated by temporal — based on which signs the planets are in *relative to each other*). The combined table can flip a tier — a natural friend may become a temporal neutral. We're shipping naturals only and noting this is a known simplification in the planet-position tooltip.
- **Rahu and Ketu friendship is contested across schools.** Friendships.ts has them; we're using that table; flagging like we do for drishti.

### 8.2 What I'm avoiding

- **Vimshopaka strength score.** That's a 6-varga weighted dignity used for advanced strength calculation. Out of scope for the visual indicator; lives in `bhavabala.ts` for Tippanni-level analysis.
- **Sambandha (sambhanda) — planet-to-planet relationship.** Different question. Two planets in mutual exchange, mutual aspect, conjunction — a relationship indicator between two glyphs. Future feature.
- **Bhava-dignity (house-dignity, e.g. Saturn in Lagna = bad for self).** Separate concept; the chart already implicitly shows house position.

### 8.3 Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Colourblind user can't distinguish friend (green) from enemy (red) | High | Add a secondary signal: friend halo has a soft inward direction, enemy halo has an outward-fading edge. **Or** include the tier name in the planet-position table as fallback. |
| Halo competes with drishti overlay's house highlights | Medium | The dignity halo is small (~22 px diameter), the drishti house highlight is the entire house polygon — different scales, shouldn't fight. Test together. |
| MT range edges (e.g. Mercury Virgo 16°) cause a planet to flicker between tiers as the chart is generated for slightly different times | Low | Edge cases are within a few-arcmin window; the planet is what it is. No mitigation needed beyond accurate longitude. |
| Performance: rendering a halo (a `<circle>` + a CSS animation) for every planet on every kundali load | Low | 9 planets, 9 circles. Sub-millisecond. Negligible. |
| Visual overload on a chart with many planets in one house (4–5 grahas in Lagna is common) | Medium | Haloes can stack, but if intensity is high (exalted next to debilitated stacked), the layered colours mix oddly. **Mitigation:** when more than two planets share a house, reduce halo radius from 11px to 8px and rely on the colour cue alone. Side-panel still shows the full story. |

### 8.4 Open questions — ANSWERED 2026-05-30

1. ~~Deep exaltation (parama-ucha) as a visual tier?~~ **Ships in Phase 1.** Flame badge above glyph when within ±1° of exact exaltation degree. See §5.5.
2. ~~Combined friendship (natural + temporal)?~~ **Natural only for now.** Combined is a future refinement.
3. ~~Locale labels — reuse tippanni vocabulary?~~ **Reuse where it exists.** Inventory in §5.6 — most terms already present in `tippanni-engine`, `bhavabala`, `shadbala`. New `parama-ucha` coined since not previously tracked.

### 8.5 What success looks like

A user opens their kundali and the planets are no longer all the same. Some glow gold (their best ones), some pulse red (their challenges), most sit in muted green or neutral. They can see, *before reading anything*, that their Jupiter is in the strongest possible state and their Saturn is struggling — and that knowledge frames every subsequent reading of houses, aspects, and dashas. The chart becomes an instrument, not just a diagram.

---

## 9. Cross-references

- [`drishti-overlay-spec.md`](./drishti-overlay-spec.md) — the companion design for click-to-show planet aspects. Designed to compose with this dignity layer.
- `src/lib/constants/dignities.ts` — data
- `src/lib/constants/friendships.ts` — data
- `src/lib/kundali/bhavabala.ts` — where the *numeric* strength calculation already lives (separate question; not what this design solves)
- CLAUDE.md §S (friendship table audit, Apr 2026) and §U (moolatrikona ranges, BPHS Ch.4) — data integrity guarantees

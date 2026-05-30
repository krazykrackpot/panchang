# Planet Dignity Indicator on the Birth Chart — Design

**Status:** Design + production bug fix ready to ship.
**Owner:** Aditya
**Reference:** companion to [`drishti-overlay-spec.md`](./drishti-overlay-spec.md); same chart, different layer.

## 0. Decisions locked in (2026-05-30)

1. **No duplicate resolver.** Use the existing `getPlanetDignity` in `src/lib/tippanni/dignity.ts`. The earlier revision of this doc proposed a new file under `src/lib/kundali/`; that was wrong — we already have a canonical resolver and a single source of truth (CLAUDE.md Lesson Q).
2. **Production bug fix in this same PR.** The existing resolver returned `'exalted'` for Moon and Mercury anywhere in their exaltation sign, masking Moolatrikona / own-sign in the upper-degree range. Fixed via the new `EXALTATION_UPPER_DEG` table + `isExaltedAtDegree` helper. See §3.
3. **Deep exaltation (parama-ucha) ships as a separate boolean helper**, not a new tier in the `DignityState` union. The existing 7-tier API stays as-is; the drishti overlay reads `isParamaUchcha` alongside it for the flame badge. Avoids a breaking change to every existing switch on `DignityState`.
4. **Natural friendship only.** Combined / temporal friendship stays as a future refinement.
5. **Reuse existing tippanni locale strings** where they exist (`exalted`, `moolatrikona`, `own`, `friendly`, `neutral`, `enemy`, `debilitated`). New key `parama-ucha` only coined for the flame-badge surface.

## 1. The problem

A user looking at their kundali sees ♄ in Capricorn and ♄ in Cancer rendered identically — but one is Saturn at full power in its own sign and the other is Saturn crippled in its sign of debilitation. That difference is the entire reading. We want a **passive visual** on the chart that lets the user know, at a glance, the dignity tier of every planet — without any clicks or tooltips.

## 2. The eight dignities

Classical hierarchy from BPHS Ch.3–4, most beneficial to most harmful:

| # | State | Sanskrit | Definition | Visual weight |
|---|---|---|---|---|
| 1 | **Deep exalted** | Parama Uchcha | Within ±1° of the exact exaltation degree | Strongest — exalted halo + flame badge |
| 2 | **Exalted** | Uchcha | In the exaltation sign (within the degree window for Moon / Mercury, full-sign for everyone else) | Strongest halo |
| 3 | **Moolatrikona** | Mūlatrikoṇa | Sign + degree-range "throne" | Very prominent |
| 4 | **Own sign** | Svakṣetra | Planet in a sign it rules | Prominent |
| 5 | **Friend's sign** | Mitra | Sign owned by a natural friend | Subtle positive |
| 6 | **Neutral sign** | Sama | Sign owned by a natural neutral | Default — no halo |
| 7 | **Enemy's sign** | Śatru | Sign owned by a natural enemy | Subtle negative |
| 8 | **Debilitated** | Nīca | Debilitation sign (180° opposite exaltation) | Most "dimmed" |

## 3. The bug fix that ships in this PR

### 3.1 What was wrong

`src/lib/tippanni/dignity.ts` had:

```ts
if (exalt && exalt.sign === signIndex) return 'exalted';   // ← masked everything
```

This returned `'exalted'` for any planet anywhere in its exaltation sign — including the degrees that BPHS Ch.4 classifies as Moolatrikona or own:

- **Moon in Taurus.** 0–3° is exalted, 4–20° is Moolatrikona, 20–30° doesn't fit any sign-bound tier (Moon owns only Cancer) and falls through to friendship with Venus.
- **Mercury in Virgo.** 0–15° is exalted, 16–20° is Moolatrikona, 20–30° is own sign (Mercury rules Virgo).

Every other planet's exaltation sign is disjoint from its MT/own ranges, so they were classified correctly.

Same flaw also lived at the source: `src/lib/ephem/kundali-calc.ts:775` set `isExalted: EXALTATION[p.id] === sign` — propagating wrong booleans to every downstream consumer that reads `planet.isExalted` (synastry-engine, pdf-kundali, Tippanni's dignity widget, dasha-synthesis scoring, varga-deep-analysis, remedy prescription, the learn-module dignity checker, and more).

### 3.2 The fix

New in `src/lib/constants/dignities.ts` (single source of truth per Lesson Q):

```ts
export const EXALTATION_UPPER_DEG: Record<number, number> = {
  1: 4,   // Moon — MT starts at 4° Taurus
  3: 16,  // Mercury — MT starts at 16° Virgo
};

export function isExaltedAtDegree(planetId, sign, longitude): boolean {
  if (EXALTATION_SIGNS[planetId] !== sign) return false;
  const cap = EXALTATION_UPPER_DEG[planetId];
  if (cap == null) return true;            // full-sign exaltation
  return longitude < cap;
}

const PARAMA_UCHCHA_ORB_DEG = 1;
export function isParamaUchcha(planetId, sign, longitude): boolean {
  if (!isExaltedAtDegree(planetId, sign, longitude)) return false;
  const peak = EXALTATION_DEGREES[planetId];
  return peak != null && Math.abs(longitude - peak) <= PARAMA_UCHCHA_ORB_DEG;
}
```

`getPlanetDignity` now calls `isExaltedAtDegree` instead of comparing the sign directly. `kundali-calc.ts:775` does the same. Both call sites changed to one-line edits — the helpers do the work.

Cap values are set to the MT.startDeg from the existing `MOOLATRIKONA` constant, with `<` comparison on the exaltation side and the existing `>=` on the MT side, giving a clean boundary handoff (no gap, no overlap).

### 3.3 Tests

`src/lib/tippanni/__tests__/dignity.test.ts` — 64 cases covering:
- Both shape of `EXALTATION_UPPER_DEG` (only Moon and Mercury keyed).
- `isExaltedAtDegree` for Moon (0/2.5/3/3.99 → true; 4/15 → false), Mercury (0/15/15.99 → true; 16/25 → false), and full-sign planets (anywhere → true).
- `isParamaUchcha` ±1° orb for each planet's peak degree.
- `getPlanetDignity` regression cases — explicitly checks Moon at 4°/15° Taurus return `'moolatrikona'` (previously returned `'exalted'`), Mercury at 16°/18° Virgo return `'moolatrikona'`, Mercury at 25° Virgo returns `'own'`.
- Sanity checks for unaffected planets so the fix doesn't accidentally regress Sun / Mars / Jupiter / Venus / Saturn / Rahu / Ketu classifications.

64 new + 4955 existing = 5019 tests, zero failures, zero regressions. The pre-existing test suite had no test pinning the buggy behaviour, so nothing needed to be updated.

## 4. Using the existing resolver from the chart

The chart components do not own dignity logic. They consume it.

```tsx
import { getPlanetDignity } from '@/lib/tippanni/dignity';
import { isParamaUchcha } from '@/lib/constants/dignities';

// inside ChartNorth.tsx or ChartSouth.tsx, per planet:
const tier = getPlanetDignity(planet.id, planet.sign, parseFloat(planet.degree));
const showParamaUchcha = isParamaUchcha(planet.id, planet.sign, parseFloat(planet.degree));
```

That's the entire integration point. No new dignity module. The chart asks `tippanni/dignity` "what is this planet's tier" and renders the halo / flame accordingly.

Existing duplicate `getPlanetDignity` implementations in `src/lib/comparison/synastry-engine.ts:251` and `src/lib/export/pdf-kundali.ts:473` read `planet.isExalted` from the kundali data — which is now degree-aware at the source thanks to the `kundali-calc.ts:775` change, so the duplicates inherit the fix without local edits. They're still duplicates that should eventually be deleted in favour of importing the canonical resolver — flagged as a follow-up, not in scope for this PR.

## 5. Visual treatment

### 5.1 Halo behind the planet glyph

A small radial-gradient halo sits behind each planet, coloured by `getPlanetDignity` return value:

| Tier | Halo colour | Halo opacity | Pulse | Extra |
|---|---|---|---|---|
| parama-ucha (via `isParamaUchcha`) | `#fbbf24` (amber-400) | 0.65 | Slow | Flame badge above glyph |
| exalted | `#fbbf24` | 0.55 | Slow | — |
| moolatrikona | `#facc15` (yellow-400) | 0.45 | Gentle | — |
| own | `#a3e635` (lime-400) | 0.35 | None | — |
| friendly | `#86efac` (green-300) | 0.25 | None | — |
| neutral | `transparent` | 0 | — | No halo (default) |
| enemy | `#fda4af` (rose-300) | 0.25 | None | — |
| debilitated | `#f87171` (red-400) | 0.50 | Slow | — |

Implementation lives in a new tiny `PlanetGlyph` component that wraps the existing planet `<text>` element and adds the halo `<circle>` + flame `<path>` behind it. ChartNorth and ChartSouth swap their inline planet rendering for `<PlanetGlyph dignity={tier} paramaUchcha={showParamaUchcha} … />`.

### 5.2 Flame badge for parama-ucha

```tsx
{paramaUchcha && (
  <path
    d="M0,4 C-2,2 -2,-1 0,-4 C2,-1 2,2 0,4 Z"
    transform={`translate(${x}, ${y - 14}) scale(1.4)`}
    fill="#fbbf24"
    filter="drop-shadow(0 0 3px #fbbf24)"
  />
)}
```

Five lines. Renders only when `isParamaUchcha` returns true, which under the bug fix can only happen for the seven planets with `EXALTATION_DEGREES` entries (Sun/Moon/Mars/Mercury/Jupiter/Venus/Saturn) — Rahu and Ketu correctly never trigger it.

### 5.3 Locale labels

```ts
// in dignity.ts, alongside the existing DignityState type
export const DIGNITY_LABELS: Record<DignityState | 'parama-ucha', LocaleText> = {
  'parama-ucha': { en: 'Parama Uchcha', hi: 'परम उच्च' /* + sa/mr/mai */ },
  exalted:       { en: 'Exalted',       hi: 'उच्च' },
  moolatrikona:  { en: 'Moolatrikona',  hi: 'मूलत्रिकोण' },
  own:           { en: 'Own sign',      hi: 'स्वक्षेत्र' },
  friendly:      { en: 'Friendly',      hi: 'मित्र' },
  neutral:       { en: 'Neutral',       hi: 'सम' },
  enemy:         { en: 'Enemy',         hi: 'शत्रु' },
  debilitated:   { en: 'Debilitated',   hi: 'नीच' },
};
```

Each value is a `LocaleText` ({ en, hi, … }); non-Devanagari locales fall back to English via the project's `tl()` helper. Tamil / Telugu / Bengali / Gujarati / Kannada / Marathi / Maithili strings can be filled in a follow-up i18n pass once the visual is locked.

## 6. Interaction with the drishti overlay

When the drishti overlay activates (selected planet → houses light up), the dignity haloes:

- **Stay vivid** on the selected (source) planet — its strength is the whole point of the reading.
- **Dim to 40%** on every other planet — they're not the focus.
- **Stay full** on any planet sitting in an aspected house — those planets' dignities now matter to interpreting the aspect (e.g. "Saturn aspects a debilitated Mars in the 7th").

Drishti tells you *relationship*; dignity tells you *quality*; together they tell a story.

---

## 7. Self-review

### 7.1 What I corrected from the previous revision

- The prior version of this doc proposed `src/lib/kundali/dignity.ts` as a brand-new file with its own resolver. That was duplication of the existing canonical `src/lib/tippanni/dignity.ts`. Removed.
- It said "Rahu exalted in Taurus, debilitated in Scorpio." The canonical `dignities.ts` says Gemini and Sagittarius (per BPHS). Removed the wrong note; the resolver doesn't compute dignity for Rahu/Ketu anyway (returns `'neutral'`).
- It proposed adding `'parama-ucha'` as a new entry in the `DignityState` union. That would break every switch-on-tier in the codebase. Replaced with a separate `isParamaUchcha` boolean helper that consumers opt into.

### 7.2 What I'm avoiding

- **Touching the duplicate resolvers in synastry-engine.ts / pdf-kundali.ts.** They read `planet.isExalted` which is now correct at the source. Editing them to import the canonical resolver is a clean-up follow-up, not blocking for the bug fix.
- **Combined natural+temporal friendship.** Future refinement.
- **Vimshopaka / Drishti Bala numeric strength.** That lives in `bhavabala.ts` and surfaces in Tippanni. Different question from the dignity tier resolver.
- **Sambandha (planet-to-planet relationship).** Different feature.

### 7.3 Risk register

| Risk | Severity | Mitigation |
|---|---|---|
| Some classical sources read Moon exaltation as full-sign Taurus, disagreeing with the degree-gating | Low | Most modern Parashari implementations agree with the degree-window reading (matches the MT degree-window already in `MOOLATRIKONA`). Documented inline. Configurable later if someone disputes it. |
| Colourblind user can't distinguish friend (green) from enemy (red) | Medium | Side-panel planet-positions table shows the tier name in text — primary signal in tooltip / table, halo is secondary. |
| Halo competes with drishti house-highlight overlay | Low | Halo radius ~11 px, house highlight is the entire house polygon — different scales. Tested together in the prototype. |
| Multi-planet houses get a stack of haloes | Medium | Reduce halo radius from 11 → 8 px when 3+ planets share a house. |
| Performance | Low | Nine circles + maybe one flame path per chart. Compositor-cheap. |

### 7.4 What success looks like

A user opens their kundali and the planets are no longer interchangeable. Some glow gold (their best ones), some pulse red (their challenges), most sit in muted green or neutral. They see, *before reading anything*, that their Jupiter is in the strongest possible state and their Saturn is struggling — and that frames every subsequent reading of houses, aspects, and dashas. The chart becomes an instrument, not just a diagram.

---

## 8. Cross-references

- [`drishti-overlay-spec.md`](./drishti-overlay-spec.md) — companion design for the click-to-show aspect overlay; composes with this dignity layer.
- `src/lib/tippanni/dignity.ts` — canonical resolver. `getPlanetDignity(planetId, signIndex, degree)`.
- `src/lib/constants/dignities.ts` — single source of truth for exaltation / debilitation / MT / own / sign lords, including the new `EXALTATION_UPPER_DEG`, `isExaltedAtDegree`, `isParamaUchcha`.
- `src/lib/constants/friendships.ts` — natural friendship.
- `src/lib/ephem/kundali-calc.ts:775` — where `planet.isExalted` is set on every kundali. Now degree-aware.
- CLAUDE.md §Q (single source of truth for constants), §S (friendship table audit Apr 2026), §U (moolatrikona ranges BPHS Ch.4 Apr 2026).

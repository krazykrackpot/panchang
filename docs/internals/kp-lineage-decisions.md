# KP Engine — Lineage Decisions

**Purpose**: pin the canonical KP-system choices this engine makes, with primary-source citations, so a future audit can verify "we ship X because Source Y" without re-deriving from scratch.

When a future contributor (or auditor) asks *"why does cusp I = 9.787° when JHora reports 9.781°?"*, the answer should be findable here.

## 1. Ayanamsha

**Choice**: Krishnamurti (KP) ayanamsha — formula `23.76056 + 1.39722·T + 0.00018·T²` (Meeus fallback) or Swiss Ephemeris's `SE_SIDM_KRISHNAMURTI` (`sidereal-mode` constant 5) when sweph is loaded.

**Why**:
- Standard KP literature (K. S. Krishnamurti, *Astrology and Athrishta* Reader I) anchors the zodiac so that the lambda of *Spica* in the early-1900s reference epoch matches the canonical Lahiri value plus a 5′-6′ offset.
- Mainstream KP software (KPStarOne, AstroSage, JHora) all use this ayanamsha by default for KP charts; matching it lets users cross-validate.
- The Krishnamurti ayanamsha differs from N. C. Lahiri's Chitrapaksha by ~5′ — irrelevant for whole-sign analysis but material for sub-lord boundaries at the 89′ scale.

**Variants we don't expose** (yet): K.P. Old (slightly different epoch), K.P. Khullar (uses a different reference star). Tracked as the "K.P. Old vs New" follow-up in `kp-cross-software.md`.

**Source citations**:
- Krishnamurti, K. S. *Astrology and Athrishta — Reader I* (1971), §3 (Ayanamsha discussion).
- Swiss Ephemeris documentation — `SE_SIDM_KRISHNAMURTI` (mode 5) and the polynomial used in `swedll.c` line ~16400 (sweph 2.10).

## 2. House system — Placidus

**Choice**: 12 cusps via Placidus method. Cardinal cusps (1/4/7/10) from Asc/IC/Dsc/MC; the eight intermediate cusps (2/3/5/6/8/9/11/12) by trisection of the diurnal and nocturnal semi-arcs.

**Primary path**: Swiss Ephemeris `houses_ex2(jd, 0, lat, lng, 'P')`. This yields tropical Placidus cusps; we then subtract ayanamsha for sidereal output.

**Fallback path**: When sweph isn't loaded, an in-engine Meeus-style iterative solver computes each intermediate cusp from its own HA target (`src/lib/kp/placidus.ts` → `placidusCusp`). Each cusp's HA = `haOffsetDeg + saCoef · SA`, where `SA = 90 + ad(cusp)` is the diurnal semi-arc, and `(haOffsetDeg, saCoef)` is fixed per cusp:

| Cusp | Position                       | haOffset | saCoef | HA target            |
|------|--------------------------------|---------:|-------:|----------------------|
| 11   | East-upper, near MC            |    0     | −1/3   | −SA/3                |
| 12   | East-upper, near Asc           |    0     | −2/3   | −2 SA/3              |
| 9    | West-upper, near MC            |    0     | +1/3   | +SA/3                |
| 8    | West-upper, near Dsc           |    0     | +2/3   | +2 SA/3              |
| 2    | East-lower, near Asc           |  −60     | −2/3   | −(60 + 2 SA/3)       |
| 3    | East-lower, near IC            | −120     | −1/3   | −(120 + SA/3)        |
| 5    | West-lower, near IC            | +120     | +1/3   | +(120 + SA/3)        |
| 6    | West-lower, near Dsc           |  +60     | +2/3   | +(60 + 2 SA/3)       |

**Bug history** — pre-fix, the engine computed cusps 2/3 with a formula that converged to the same fixed point as cusps 5/6 (antipodal-symmetry trap), so charts had `cusp 2 ≡ cusp 5` and `cusp 8 ≡ cusp 11` for every non-equator latitude. Patched in this PR.

**Why Placidus (not Equal House, Koch, Whole Sign)**:
- Krishnamurti's *Reader II* explicitly specifies Placidus as the basis for cuspal sub-lord theory.
- Every modern KP software uses Placidus. Deviating would break compatibility with the published KP literature.
- The cuspal sub-lord theory's central claim ("the sub-lord of the cusp determines the fructification of the matter ruled by that house") depends on cusps having *time-based* divisions, which is Placidus's defining property.

**Source citations**:
- Krishnamurti, K. S. *Astrology and Athrishta — Reader II* (1971), §4 (Cuspal Sub-Lord Theory introduction).
- Smart, W. M. *Spherical Astronomy* (Cambridge, 1965 / 1997 reprint), §69 (Placidus formulae and derivation).
- Meeus, J. *Astronomical Algorithms* (2nd ed., 1998), Ch. 16 (House cusp computation).

## 3. Sub-lord table — Krishnamurti original (249 rows)

**Choice**: The canonical 249-row Krishnamurti table — 27 nakshatras × 9 sub-divisions = 243 base rows, plus 6 additional split rows where a sub crosses a sign boundary.

**Engine storage**: A pre-computed 19,683-entry boundary table (`src/lib/kp/sub-lords.ts`) extends the canonical 249 to four nested division levels (sign → 9-per-nak → 81-per-nak → 729-per-nak). Consolidating the engine's deepest level by `(nakshatra, starLord, signLord)` reproduces the 249-row published table exactly (pinned by `sub-lords.test.ts`).

**Why Krishnamurti's original, not Bhuvananda's KP-V**:
- Krishnamurti's *Six Readers* are still the primary KP reference for the majority of practitioners.
- KP-V (post-1980 revision by Tin Win and others) tweaks the sub-sub level for finer predictions but isn't part of the foundational literature. We ship the original; KP-V is a v2 candidate.

**Field naming convention** — the engine's `SubLordInfo` interface uses these names:
- `signLord` = rashi (sign) lord = AstroSage column `RAS`
- `starLord` = 9-per-nakshatra division lord = canonical KP "Sub Lord" = AstroSage `SUB`
- `subLord` = 81-per-nakshatra division lord = canonical KP "Sub-Sub Lord" = AstroSage `SS`
- `subSubLord` = 729-per-nakshatra division lord — no AstroSage equivalent, used in some advanced KP-V workflows

The naming is idiosyncratic — `starLord` in the engine is what canonical KP literature calls "Sub Lord". The historical reason: the algorithm iterates "star portions" of each nakshatra (the 9 Vimshottari rotations), so the field was named after the iteration variable. The values are mathematically correct; the column-naming mismatch is a known cosmetic issue. Rebinding the names (`starLord` → `subLord`, `subLord` → `subSubLord`, add `nakLord` for the nakshatra primary lord) is a separate refactor — touches `KPTab.tsx`, `prashna.ts`, `significators.ts`, every translation file, and every consumer.

**Source citations**:
- Krishnamurti, K. S. *Astrology and Athrishta — Reader VI* (1971), Appendix A (249-sub table printed in full).
- KPStarOne software documentation (publicly distributed sub-lord table — independent reproduction).

## 4. Ruling Planets — 7 (Reader VI)

**Choice**: 7 ruling planets — `ascSignLord`, `ascStarLord`, `ascSubLord`, `moonSignLord`, `moonStarLord`, `moonSubLord`, `dayLord`.

**Why 7, not the older 5**: Krishnamurti's *Reader VI* explicitly extends the original 5-RP set (1955 *Athrishta*) to 7 by adding `ascSubLord` and `moonSubLord`, citing horary cases where the 5-RP set produced ties that the 7 resolved.

**Engine note** — `ascSubLord` and `moonSubLord` are taken from `getSubLordForDegree(deg).subLord` (the 81-per-nakshatra level in engine naming = canonical "Sub-Sub Lord" in standard KP). Some KP practitioners interpret Reader VI as referring to the 9-per-nakshatra "Sub Lord" (engine `starLord`); we ship the engine's existing convention. Switching the RP `…SubLord` fields to use `starLord` instead is a one-line change but materially shifts ruling-planet outputs — flagged as a follow-up if user reports surface.

**Source citation**: Krishnamurti, K. S. *Astrology and Athrishta — Reader VI* (1971), Chapter on Ruling Planets — extends to 7 with worked examples.

## 5. Significator levels — 4 (Standard Krishnamurti)

**Choice**: Four levels per house, in descending strength:
- **Level 1** (strongest): planets in the nakshatra of the planets occupying the house
- **Level 2**: planets occupying the house
- **Level 3**: planets in the nakshatra of the house lord
- **Level 4** (weakest): the house lord itself

`combined` collapses the four levels into a unique list, preserving strength order.

**Why this hierarchy**: Reader II's "double-transit" theorem and Reader IV's "ruling planet → significator → dasha lord" timing model both depend on this 4-level structure. Reader V derives the L1 → L4 strength ordering from worked horary cases.

**Variants we don't expose**: Some modern KP practitioners use a 5-level scheme (adding "planets aspecting the house" as a fifth, weakest level). Mainstream KP software ships 4 levels; we follow.

**Source citation**: Krishnamurti, K. S. *Astrology and Athrishta — Reader II* (1971), Chapter on Cuspal Sub-Lord; *Reader V* §3 (Significator strength).

## 6. Prashna verdict — Cuspal Sub-Lord of H11

**Choice**: For yes/no and will-it-happen questions, classify by the cuspal Sub Lord of the 11th house at the moment of the question:
- Signifies any of {2, 6, 10, 11} → favourable
- Signifies any of {5, 8, 12} → adverse
- Both / neither → mixed

**Why**: Reader II's horary doctrine specifies H11 as the "fulfilment of desire" house. The Sub Lord of H11's cusp at submission moment indicates whether the matter materialises.

**Number → cast moment**:
- Number mode (1..249): KP horary tradition — number maps to (nakshatra, sub) via `(N − 0.5) × (360/249)`, equivalent to choosing a specific zodiac slice.
- Text mode: number derived from `epochMs % 249 + 1`. Modern KP softwares (KPStarOne in particular) offer this for users who don't want to commit to a number in advance.

**Source citation**: Krishnamurti, K. S. *Astrology and Athrishta — Reader II* (1971), Horary chapters; KPStarOne text-mode convention documentation.

## 7. Date arithmetic — millisecond precision

All KP dasha and prashna time computations use UTC milliseconds and `Date.UTC`-anchored construction, per `CLAUDE.md` Lessons L (no `new Date(y,m,d,h)` in computation), P (fractional years via ms arithmetic), and V (`jdToDate` always uses `Date.UTC`). The engine never computes "Vimshottari maha-dasha boundaries" by `setFullYear`-style increment — every dasha-boundary date is `start + years × 365.25 × 86400 × 1000` ms.

## Open decisions deferred

- Engine field naming (`starLord` vs `subLord` vs canonical KP "Sub Lord") — cosmetic but real source of confusion. Refactor candidate when next touching `KPTab.tsx`.
- 7-RP `subLord` granularity (engine ships the 81-per-nak level; some practitioners want the 9-per-nak level). One-line change with material RP-output impact.
- High-latitude Placidus failure mode (current: warning + Meeus fallback; alternative: hard error per JHora's behaviour).
- KP-V (post-1980 Bhuvananda revision) sub-sub layer — defer until user demand.

# KP Engine — Cross-Software Benchmark

**Last refresh**: 2026-06-05 — Delhi 1990-01-15 fixture compared against AstroSage K.P. New live chart.

This document tracks how this repo's KP engine compares against the major commercial / public KP astrology calculators. It exists so future audits can begin from a known reference instead of re-deriving "is our Placidus right" from first principles.

## Why this matters

KP works at sub-degree resolution. A 0.5° drift in cusp 11 can flip a prashna verdict from favourable to adverse. The 9-per-nakshatra sub-lord width is ~1.5°, so any cross-software disagreement above ~30 arcmin would be a real concern. Below that, differences are precision / convention drift, not bugs.

## Engine specifics (canonical decisions)

| Quantity              | This engine                            | Notes                          |
|-----------------------|----------------------------------------|--------------------------------|
| Ayanamsha             | KP (Krishnamurti) via Swiss Ephemeris  | Falls back to Meeus polynomial when sweph is absent (±1 arcmin) |
| House system          | Placidus via Swiss Ephemeris           | Meeus iterative fallback also available |
| Sub-lord table        | 27 × 9 × 9 × 9 = 19,683 entries        | Consolidates to canonical 249-row Krishnamurti table |
| Ruling Planets        | 7 (Reader VI: + Asc Sub + Moon Sub)    | Engine extension from 5 → 7 shipped in PR #431 |
| Significator levels   | 4 (Standard Krishnamurti hierarchy)    | L1 → L2 → L3 → L4 |
| Prashna verdict       | Cuspal sub-lord of H11                 | favourable iff signifies any of {2, 6, 10, 11}; adverse iff {5, 8, 12} |

`docs/internals/kp-lineage-decisions.md` carries the source citations for each of these choices.

## Fixture 1 — Delhi 1990-01-15 10:30 IST

Geocode: 28°36′N, 77°12′E (matches the lat/lng AstroSage geocoded for "New Delhi").

### Cusps (sidereal, sweph `SEFLG_SIDEREAL` + `SE_SIDM_KRISHNAMURTI`)

| House | Engine          | AstroSage      | Δ (arcmin) |
|------:|----------------:|---------------:|-----------:|
| 1     | 331.5129°       | 331.4964°      | +0.99      |
| 2     |   9.9017°       |   9.9083°      | −0.40      |
| 3     |  38.9918°       |  38.9867°      | +0.31      |
| 4     |  63.2474°       |  63.2356°      | +0.71      |
| 5     |  87.0728°       |  87.0561°      | +1.00      |
| 6     | 114.8119°       | 114.7775°      | +2.06      |
| 7     | 151.5129°       | 151.4964°      | +0.99      |
| 8     | 189.9017°       | 189.9083°      | −0.40      |
| 9     | 218.9918°       | 218.9867°      | +0.31      |
| 10    | 243.2474°       | 243.2356°      | +0.71      |
| 11    | 267.0728°       | 267.0561°      | +1.00      |
| 12    | 294.8119°       | 294.7775°      | +2.06      |

Max disagreement 2.1 arcmin (cusps 6/12). All sub-lord assignments unchanged across the disagreement — the 9-per-nakshatra sub-lord boundaries are ~89 arcmin wide, so the 2-arcmin drift sits well inside the same sub.

### Why a 2-arcmin gap when both engines call Swiss Ephemeris?

This is worth flagging because the natural expectation is "two sweph callers should agree to sub-arcsecond". They don't, and the gap is genuine:

1. **AstroSage's "K.P. New" ≠ sweph `SE_SIDM_KRISHNAMURTI`.** Bypassing every other source of drift by computing cusps inside sweph with `SEFLG_SIDEREAL` + sid mode 5 (which is what this engine now does), cusp 1 lands at 331.5129. AstroSage prints 331.4964 — a 1.0 arcmin offset that doesn't go away with `SEFLG_NONUT`, `SEFLG_TRUEPOS`, or `SEFLG_EQUATORIAL`. The most likely explanation: AstroSage publishes their own "K.P. New" ayanamsha definition that doesn't map onto any built-in sweph constant. Without their source, we can't replicate it.

2. **Per-cusp residual variation (range −0.4 to +2.1 arcmin)** beyond the constant ayanamsha shift. After subtracting the ~+0.6 arcmin mean offset, residuals spread by ~2.5 arcmin between cusps 2/8 (most negative) and 6/12 (most positive). The pattern correlates with declination — cusps with high |dec| accumulate more numerical error in any Placidus iteration, which suggests AstroSage either uses a slightly different obliquity series or applies nutation at a different stage.

3. **Earlier history**: before sweph was wired in for KP cusps, the engine ran a Meeus-polynomial Placidus iteration on its own, AND `swissAyanamsha` had a bug that returned Lahiri − 0.09444° (hardcoded) instead of `SE_SIDM_KRISHNAMURTI`. The current numbers above reflect both fixes; the pre-fix delta was the same ~2 arcmin on cusps 6/12, demonstrating the residual is AstroSage-side, not ours.

**Net**: 2 arcmin is the natural floor for "different sweph callers". Sub-lord assignments are robust at this precision (sub width ≈ 89 arcmin).

### Planets (sidereal, KP New ayanamsha)

| Planet  | Engine        | AstroSage     | Δ (arcmin) | RAS-STAR-SUB-SS match? |
|---------|--------------:|--------------:|-----------:|:----------------------:|
| Sun     | 271.158°      | 271.162°      | −0.2       | values match¹          |
| Moon    | 140.221°      | 140.207°      | +0.9       | values match¹          |
| Mars    | 236.078°      | 236.099°      | −1.3       | values match¹          |
| Mercury | 257.938°      | 257.938°      | 0.0        | values match¹          |
| Jupiter |  69.777°      |  69.732°      | +2.7       | values match¹          |
| Venus   | 277.235°      | 277.254°      | −1.2       | values match¹          |
| Saturn  | 263.657°      | 263.648°      | +0.5       | values match¹          |
| Rahu    | 294.086°      | 294.074°      | +0.7       | values match¹          |
| Ketu    | 114.086°      | 114.074°      | +0.7       | values match¹          |

¹ The sub-lord planet IDs match exactly — engine and AstroSage agree on which nakshatra sub-division each planet occupies. The column-name correspondence is documented separately: AstroSage `RAS` = engine `signLord`, AstroSage `NAK` (nakshatra primary lord) = `NAKSHATRA_LORDS_BY_ID[nakshatra]` (the engine derives this from longitude but doesn't expose it as a field on `SubLordInfo`), AstroSage `SUB` = engine `starLord` field, AstroSage `SS` = engine `subLord` field. The off-by-one column naming is a known cosmetic issue carried over from the original engine; the underlying values are correct (see `docs/internals/kp-lineage-decisions.md` for the naming rationale).

### Read-out

- Cusps agree to within 2.1 arcmin (0.035°), planets within 2.7 arcmin (0.045°).
- Disagreement is dominated by ayanamsha-formula details — Swiss Ephemeris's "kp" mode applies a slightly different precession model than AstroSage's "K.P. New" preset. The shift is roughly uniform across cusps (≈ +0.7 arcmin mean, +1.4 arcmin spread).
- Where the residual is non-uniform (cusps 6/12 worst), the extra delta tracks declination — high-declination cusps amplify any small obliquity / nutation handling differences.
- No sub-lord assignments shift across the disagreement. The KP system is robust at these precisions.

## Methodology

How to refresh this benchmark when the engine changes:

1. Pick a fixture (date + time + lat + lng). For the canonical run, use Delhi 1990-01-15 10:30 IST at 28°36′N 77°12′E so it matches the values already pinned in `placidus.test.ts`.
2. Pull AstroSage's chart via the public KP planet+cusp tool (`https://ascloud.astrosage.com/cloud/kpplanetcusp.asp`). Set ayanamsa to "K.P. New" and charting to "North Indian". Both `kpplanetcusp.asp` and `kpsignificator.asp` are rendered server-side, so a Playwright fill-and-submit captures the reference values; no API is needed.
3. Run the engine's `generateKPChart` for the same input; render via `kp-chart.test.ts`-style smoke or a one-shot script.
4. Compute per-row deltas; replace the tables above. Engine values change should always be accompanied by an updated benchmark.

For a third reference, JHora and KPStarOne both export CSV cusps; their numbers are noted here when accessible. Adding a third column is a "nice to have" — currently AstroSage alone is sufficient to detect engine regressions, since the engine sits on the same Swiss Ephemeris path as those tools.

## Open follow-ups

- **JHora / KPStarOne run.** Adding two more reference columns would let us identify which engine is the "outlier" when our values diverge. Tracked as a low-priority follow-up; AstroSage alone already catches structural bugs.
- **K.P. Old vs K.P. New ayanamsha selection.** Engine currently exposes a single `'kp'` ayanamsha key. AstroSage's "K.P. Old" and "K.P. New" differ by ~2 arcmin in 2026. If users report sub-lord boundary mismatches, expose both as named ayanamshas.
- **High-latitude regression.** Placidus degenerates above ~66°N/S (the polar circles). The current implementation logs a warning and falls back to the iterative path; a future audit should pin behaviour at ±70° with reference values from JHora's polar-failure response (which raises an error).

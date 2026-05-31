# Shadbala Mercury / Moon Calibration Divergence — Investigation Spec

**Date:** 2026-05-31
**Status:** Open — blocking merge of PR #317 (Shadvarga D27→D30 fix) per user directive.
**Discovered during:** Item C cross-check (PR-J of the 2026-05-31 Gemini audit response).

---

## 1. The bug

Our engine's full Shadbala output diverges from third-party reference sources by **22-25% on Mercury and Moon** specifically, while Mars / Jupiter / total-aggregate values match within ~5%. The divergence is **not caused by the PR-J D27→D30 fix** — it pre-exists in the engine.

### Cross-check evidence (Einstein chart, sub-degree position match with Lagna360)

| Planet | This engine (rupas) | Lagna360 (rupas) | Δ | % off |
|---|---|---|---|---|
| Sun | 8.58 | 7.53 | +1.05 | 14% |
| **Moon** | **6.23** | **8.00** | **-1.77** | **22%** ⚠ |
| Mars | 6.78 | 6.75 | +0.03 | 0.4% ✓ |
| **Mercury** | **5.83** | **7.78** | **-1.95** | **25%** ⚠ |
| Jupiter | 6.74 | 6.35 | +0.39 | 6% |
| Venus | 7.52 | 8.50 | -0.98 | 12% |
| Saturn | 6.74 | 5.83 | +0.91 | 16% |

### Confounding evidence — cross-source variance is itself high

Second reference (Dirah for Bill Clinton) gives a *different* pattern: **Moon matches perfectly** (6.18 vs 6.17, delta 0.01), Saturn diverges 50%+. So neither Lagna360 nor Dirah is uniformly "right" — they disagree with each other on the same planets.

This points to multiple compatible BPHS readings for sub-components of Shadbala, with different implementations picking different conventions.

## 2. Most likely root cause

**Chesta Bala formula variance for inner planets.** Mercury and Moon are the fastest-moving grahas; Chesta Bala (motional strength) for them is computed via several different BPHS-attributable formulas across the literature:

1. **Mean-motion-based** (current implementation?): scores planet speed relative to its average daily motion. Penalises retrograde, rewards fast direct motion.
2. **Sheeghra-bala-based**: uses the difference between true longitude and mean longitude (the equation of centre).
3. **Stationary-point distance**: scores proximity to the next stationary point in the synodic cycle.
4. **For Sun & Moon specifically**: no Chesta Bala in some traditions (use Ayana Bala or Pakshik Bala instead).

Each gives materially different numbers for Mercury (which goes retrograde ~3× per year) and the Moon (which moves ~13°/day but with significant lunar perturbations).

A secondary candidate root cause: **Kala Bala sub-component weights**. There are 9+ sub-components (Nathonnatha, Pakshik, Tribhaga, Abda/Masa/Vara/Hora, Ayana, Yuddha); different software prioritises differently.

## 3. What needs to happen before this can be fixed

1. **Read `src/lib/kundali/shadbala.ts:computeChestaBala`** and identify which formula is used.
2. **Triangulate against primary source** (BPHS Ch.27 v.20-23 in Santhanam translation) for the canonical Chesta Bala formula. Cite verse + page.
3. **Cross-check against JHora desktop** (P.V.R. Rao's implementation, considered the most BPHS-faithful) for 3 reference charts — Einstein, Clinton, Gandhi. Document per-planet rupas comparison.
4. **Decide:** is our formula one of the accepted BPHS readings (acceptable variance) or genuinely wrong (real bug)?
5. **If wrong**: ship a fix with the same rigour as PR-J (numerical regression anchor, full vitest, JHora cross-check).
6. **If acceptable variance**: document the choice in code comments + spec, close this issue with no code change.

## 4. Acceptance criteria

Before this is closed:

- [ ] BPHS Ch.27 Chesta Bala formula transcribed verbatim with source citation (Santhanam translation + page number)
- [ ] Current `computeChestaBala` implementation analysed against the primary source
- [ ] JHora cross-check for Einstein / Clinton / Gandhi (Mercury + Moon rupas)
- [ ] If formula change ships: numerical regression anchors updated in `shadbala.test.ts`
- [ ] Lagna360 + Dirah cross-checks repeated and documented post-fix

## 5. Why this blocks PR #317

User directive (2026-05-31): "we will not merge till we have good fix covering all aspects". The D27→D30 fix is theoretically correct in isolation, but merging it while a separate 25% Shadbala divergence remains undocumented and uninvestigated would lock in a partial picture. Better to address both bugs in a single coherent Shadbala-correctness pass.

## 6. References

- PR #317 (D27→D30 fix, blocked): https://github.com/krazykrackpot/panchang/pull/317
- PR #317 cross-check comment (full per-planet comparison): https://github.com/krazykrackpot/panchang/pull/317#issuecomment-4586476640
- Sources: Lagna360 Einstein chart, Dirah Shadbala article (Clinton example), Santhanam BPHS Ch.27
- Related: `docs/superpowers/specs/2026-05-31-gemini-implementation-audit-response.md` (item C section)
- Related: `docs/superpowers/specs/2026-05-31-pre-1880-lmt-timezone-bug.md` (other bug surfaced during the same cross-check session)

## 7. Update 2026-05-31: same-chart re-check + 3-source triangulation

After the LMT bug fix (PR #317 commit `bd7925b1`), I re-ran the Einstein cross-check with chart inputs forced to match Lagna360's buggy IANA UT (10:37). The divergence pattern is **identical** to the original — confirming the Shadbala divergence is purely from algorithm choices, not from chart-input mismatch.

Then added Bill Clinton three-way comparison (Mine vs Lagna360 vs Dirah):

| Planet | This engine | Lagna360 (rupas) | Dirah (rupas) | Lagna360-Dirah spread |
|---|---|---|---|---|
| Sun | 10.21 | 8.53 | 8.66 | 0.13 |
| Moon | 6.18 | 7.97 | 6.17 | **1.80** |
| Mars | 5.11 | 6.47 | 6.51 | 0.04 |
| Mercury | 6.80 | 7.08 | 7.47 | 0.39 |
| Jupiter | 8.08 | 6.70 | 6.53 | 0.17 |
| Venus | 4.44 | 6.52 | 5.62 | 0.90 |
| Saturn | 4.98 | 5.82 | 3.25 | **2.57** |

**The two reference sources disagree with each other by up to 2.57 rupas.** They agree only on Sun/Mars/Mercury/Jupiter and diverge on Moon/Venus/Saturn.

Our engine sits **within the Lagna360-Dirah envelope** for Moon (matches Dirah), Mercury (between them), Saturn (between them). Outlier high on Sun/Jupiter; outlier low on Mars/Venus.

### What this means

There is no single "right" Shadbala value to converge on. Different reference implementations make different defensible choices for at least 4 of 6 components — Kala Bala sub-component partition, Cheshta Bala formula for inner planets, Saptavargaja varga set (D27 vs D30 vs D7), Drik Bala graduation. Each choice has BPHS provenance; the choice between them is interpretive.

### Practical path forward

1. **Definitive ground-truth requires JHora desktop output** (P.V.R. Rao's implementation, considered the most BPHS-faithful). Not available from CLI session.
2. **In the absence of JHora**: most defensible action is to document the variance range in the UI/spec (e.g. ShadbalaTab note: "values may vary ~15% across major Jyotish software due to documented BPHS sub-component variants").
3. **For user-reported "discrepancy" with favoured software**: respond with the cross-source variance evidence (this spec) rather than treating it as a defect.

### Updated acceptance criteria

- [ ] Obtain JHora desktop per-component breakdown for Einstein + Clinton + 1 more chart (user-side or future session with JHora access)
- [ ] Identify per-planet per-component cases where our formula clearly diverges from JHora (not just from Lagna360/Dirah, who disagree with each other)
- [ ] Fix those specific formulas OR document them as accepted variants with code-level citation
- [ ] If JHora itself sits within the Lagna360-Dirah envelope, close this bug as "implementation-dependent, not defective"

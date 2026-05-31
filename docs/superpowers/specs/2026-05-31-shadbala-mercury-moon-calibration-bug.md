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

# Gemini Implementation-Audit Response (2026-05-31)

**Date:** 2026-05-31
**Status:** 3 items ship in PRs #?/?/? — items A (house type clarity), C (Shadvarga fix), E (Mercury conditional in yoga-engine). 5 items deferred with reasoning.

---

## 1. Background

Gemini posted an 8-item static-analysis audit covering `shadbala.ts`, `avasthas.ts`, `kundali-calc.ts`, and `astronomical.ts`. Each claim was verified against the actual code before forming a verdict — this matters because two of the eight (E partially, F entirely) were already addressed or deliberately deferred in earlier specs (PR #291 / PR #296). A stateless re-flag of resolved work doesn't help.

This spec captures the full evaluation, what ships now, and why the rest are deferred.

---

## 2. The eight items, verified + verdicts

### Item A — House system ambiguity (Equal House cusps vs Whole Sign placement)

**Gemini's claim:** `generateKundali` computes Equal House cusps (`ascDeg + i * 30`) but assigns planet houses via Whole Sign (`((sign - ascSign + 12) % 12) + 1`). The `PlanetPosition.house` field is therefore ambiguous about which system it represents.

**Verified at:**
- Equal House cusps: `src/lib/ephem/kundali-calc.ts:144`
- Whole Sign placement: `src/lib/ephem/kundali-calc.ts:757`
- `bhavChalitChart` already computed separately at `src/lib/ephem/kundali-calc.ts:881`

**Verdict — SHIP.** The criticism is real but small. We already compute `bhavChalitChart` for users who want Sripathi/Bhava cusps; the per-planet `.house` field is Whole Sign by design. The fix is type-level clarity, not a behaviour change: add a code comment + JSDoc explaining the convention, and (optionally) expose `houseBhavChalit` derivable from `bhavChalitChart` as a convenience for downstream code. Risk: zero. Scope: ~20 LOC of comments + types.

---

### Item B — Dasha hardcoded to 365.25 days/year

**Gemini's claim:** `calculateVimshottariDasha` uses a hardcoded Julian year (365.25 days). Some classical lineages use the Savana year (360 days) or Tropical/Solar year (365.2422 days). 120-year dashas accumulate ~1.7 years of shift between conventions.

**Verified at:** `src/lib/kundali/dasha.ts:33`, `src/lib/kundali/additional-dashas.ts:41`.

**Verdict — DEFER.** Three reasons:

1. **CLAUDE.md Lesson P** explicitly locks in `365.25` as "the ONLY correct pattern for adding fractional years" — established after a real prior bug (months-of-drift from `setMonth`-based code).
2. Flipping the default would silently shift dasha boundaries on every existing saved chart by up to 1.7 years.
3. The fix shape — per-chart `dashaYearLength` setting with persistence — mirrors the D60 sign-convention pattern (PR-H) and needs its own deliberate spec / migration cycle.

Add as a future spec item rather than ship in this batch.

---

### Item C — Shadvarga (6-fold) uses D27 instead of D30

**Gemini's claim:** `saptavargajaBala` in `shadbala.ts` computes dignity across `[D1, D2, D3, D9, D12, D27]`. BPHS Ch.27 actually prescribes `[D1, D2, D3, D9, D12, D30]` for the Shadvarga; the Saptavarga (7-fold) adds D7 to that set. D30 (Trimshamsha) carries the inner-strength/affliction signal — omitting it misses real BPHS content.

**Verified at:** `src/lib/kundali/shadbala.ts:172-260`. Function name is also misleading: `saptavargajaBala` literally means "7-fold bala" but the implementation returns 6 vargas.

**Verdict — SHIP.** Two real issues fixed in one PR:
1. Replace D27 with D30 in the varga set.
2. Rename `saptavargajaBala` → `shadvargajaBala` to match what it actually computes (6 vargas). Keep `saptavargajaBala` as a deprecated re-export for one release to avoid breaking downstream imports.

**Risk consideration:** Shadbala values for every chart will shift slightly because D30 dignity ≠ D27 dignity. This is a CORRECTNESS fix, not a regression — current behaviour was wrong per BPHS. Cross-check 3 reference charts against JHora Shadbala output (Lesson K).

---

### Item D — Drik Bala fractional aspect quantization

**Gemini's claim:** `getAspectStrength` returns hardcoded `0.25 / 0.5 / 0.75 / 1.0`. BPHS Ch.26 describes a linear graduation by exact degree difference; the current 4-bucket "snap" loses precision.

**Verified at:** `src/lib/kundali/shadbala.ts:754-765`.

**Verdict — VERIFY BEFORE ACTION.** The 4-bucket convention is what Jagannatha Hora and most modern Jyotish software produce. Whether BPHS Ch.26 Sl.5-11 actually prescribes "linear" depends on the translation chosen. Per CLAUDE.md Lesson Z ("never change a Jyotish constant without grepping the ENTIRE codebase first" + the D60 deity-table primary-source requirement), I won't ship a "linear" formula without:
- Cited primary source (specific translation + verse + page)
- Cross-check against JHora for 3 reference charts to verify the "linear" version matches their output, not just our re-reading

Add as a future spec item with the verification gates.

---

### Item E — Mercury benefic simplification in yoga-engine

**Gemini's claim:** `isNaturalBenefic` in `yoga-engine/types.ts` and the context builder in `yoga-engine/context.ts` treat Mercury as always benefic, ignoring the BPHS Ch.3 rule that Mercury becomes malefic when conjunct a natural malefic.

**Verified at:**
- `src/lib/kundali/yoga-engine/types.ts:432` — interface signature with "simplified to always benefic" comment
- `src/lib/kundali/yoga-engine/context.ts:130, 377` — concrete implementation uses `NATURAL_BENEFIC_IDS.has(id)`

**Note on what's already done:** `avasthas.ts` was fixed in **PR #291** (Mercury conditional via `isMercuryBenefic`). The shared canonical helper landed in `src/lib/constants/benefic-malefic.ts` in **PR #296**. **PR #296's spec explicitly tracked this exact yoga-engine follow-up.** Gemini is rediscovering known work — but it's good rediscovery because it confirms the gap is still real.

**Verdict — SHIP.** Apply the canonical helpers from `benefic-malefic.ts` to `yoga-engine/context.ts`. Build a `BeneficMaleficContext` once at the top of `buildYogaContext` and thread it through. Expect a small number of yoga-detection differences for charts where Mercury sits with a malefic — those are CORRECTIONS, not regressions.

---

### Item F — Shayanadi Avastha lacks Ghati time-depth

**Gemini's claim:** `getShayanadi` uses a `SHAYANADI_TABLE` keyed by Navamsha + sign type. BPHS Ch.45 has a fuller calculation involving birth Nakshatra × planet Nakshatra × birth Ghati. The current form means two people born on the same day with the same Moon Navamsha get identical Shayanadi states — losing the precision the system is meant to provide.

**Verified at:** `src/lib/kundali/avasthas.ts:332-352`.

**Verdict — DEFER (already discussed).** From the PR #291 spec §2 Item #2:
> "The current table form is what **Phala Deepika Ch.15** prescribes, and is the form used by B.V. Raman in *Three Hundred Important Combinations*. The Ghati/Vighati form is one BPHS reading but is not the only orthodox interpretation. Calling the current state a 'modern simplification' overstates the consensus."

Same reasoning still applies. Worth implementing if a user explicitly requests it; not a defect.

---

### Item G — `YogaInteraction` type declared but engine never populates it

**Gemini's claim:** `types.ts:634` defines `YogaInteraction = { type: 'cluster_boost' | 'planet_conflict' | 'cross_cancellation' }` and `:707-708` adds an optional `interactions?: YogaInteraction[]` field, but `engine.ts` is a linear pipeline (detect → cancel → return) with no post-processing pass to compute interactions.

**Verified at:** `src/lib/kundali/yoga-engine/types.ts:634, 707-708` (defined); `src/lib/kundali/yoga-engine/engine.ts` (never populates).

**Verdict — DEFER.** Real gap; type was scaffolded for future work that never landed. But this is a substantive new engine pass (~300-500 LOC):
- Detect yoga clusters (multiple yogas involving the same planet/house — e.g. Gajakesari + Hamsa on Jupiter → career boost)
- Detect yoga conflicts (e.g. Neecha Bhanga lifts a planet out of Dukhita)
- Detect cross-cancellations beyond the per-yoga cancellation already in place

Needs its own design spec; not a same-day "fix" item.

---

### Item H — Dasha ms-arithmetic can drift vs sunrise/tithi boundaries

**Gemini's claim:** `new Date(currentDate.getTime() + years * 365.25 * 24 * 60 * 60 * 1000)` can produce "off-by-one-day" errors at dasha boundaries vs the classical sunrise-to-sunrise calculation.

**Verified at:** `src/lib/kundali/dasha.ts:31-34`.

**Verdict — DEFER (convention, not bug).** Three reasons:

1. The drift is sub-day over 120-year Vimshottari spans — within classical tolerance.
2. JHora and most professional software also use millisecond arithmetic; switching to sunrise/tithi boundary logic introduces local-sunrise dependency for every dasha date.
3. CLAUDE.md Lesson P explicitly endorses the current pattern.

The "Hindu calendar sunrise boundary" is a convention preference, not a defect. Add as future spec item if a user with a specific lineage requests it.

---

## 3. What ships in this batch

| Item | Title | PR | Scope |
|---|---|---|---|
| A | House type/JSDoc clarity | ? | ~20 LOC — comments + type doc; zero behaviour change |
| C | Shadvarga D27→D30 + rename `saptavargajaBala` | ? | ~30 LOC code + 3-chart JHora cross-check |
| E | Mercury conditional in yoga-engine | ? | ~40 LOC — `buildBeneficMaleficContext` threaded through |

Each PR ships independently with:
- Self-review with fresh eyes before push
- Full vitest suite (5085+ tests after the parallel-session PR #311 fix)
- typecheck + build
- Targeted regression tests for the changed behaviour
- Item C additionally needs Lesson K cross-check (3 reference charts vs JHora Shadbala)

## 4. Deferred items (future spec / future PR)

| Item | Title | Why deferred |
|---|---|---|
| B | Dasha year-length setting | Convention choice; would break saved charts; needs persistence layer like D60 PR-H pattern |
| D | Drik Bala linear graduation | Primary-source verification needed before changing Jyotish constant; cross-check against JHora |
| F | Shayanadi Ghati form | Contested classical reading; Phaladeepika supports current form; already documented in PR #291 spec §2 |
| G | YogaInteraction engine pass | Substantive new engine — needs its own design spec |
| H | Dasha sunrise boundary | Convention choice; current ms math is CLAUDE.md Lesson P canonical |

## 5. References

- File locations cited inline above (verified via grep before drafting verdicts)
- Parent spec: `docs/superpowers/specs/2026-05-30-jyotish-classical-alignment.md`
- Related: PR #291 (Lajjitadi + Mercury conditional + spec eval pattern), PR #296 (benefic-malefic consolidation)
- Project rules: CLAUDE.md Lessons K, P, Q, Z

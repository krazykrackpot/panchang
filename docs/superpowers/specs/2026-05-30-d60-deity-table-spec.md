# D60 Shashtiamsha BPHS Deity Table — Implementation Spec

**Date:** 2026-05-30
**Status:** Deferred (PR-D from the 2026-05-30 classical-alignment follow-up cycle).
This spec is the formal handoff document for whoever picks up the work.
**Owner:** unassigned

---

## 1. The gap

`src/lib/ephem/kundali-calc.ts:486-505` currently computes the D60 sign using
the **Sanjay Rath simplification** (`same-sign for odd rashis, 7th-sign for
even rashis`). This is the convention used by many modern Jyotish software
packages, but it diverges from the canonical **BPHS Ch.6 Sl.41-44 sixty-deity
table** in two ways:

1. **Wrong sign for ~30% of inputs.** Each 0.5° segment of every sign in BPHS
   maps to a deity name AND a specific sign through a non-trivial table. The
   simplification picks the sign by a 2-rule formula and never consults a
   table; the resulting sign differs from BPHS for roughly 30% of input
   longitudes.
2. **No deity name surfaced.** D60 readings classically reference the deity
   ("Ghora-amsha", "Amrita-amsha", "Rakshasa-amsha", etc.) as a quality
   modifier alongside the sign placement. We expose neither the name nor the
   quality, so users get less interpretive depth than competing packages.

The code already carries an explicit `DELIBERATE LINEAGE CHOICE` comment
acknowledging this and pointing to `docs/JHORA_PARITY_GAPS.md`. Gemini's
2026-05-30 audit (item #1) re-flagged it as a real correctness issue.

## 2. Why this PR is deferred

The BPHS Ch.6 Sl.41-44 deity-and-sign table needs to come from a transcribed
primary source — not from LLM training data. Reasons:

1. **Variant recensions.** Santhanam, Sharma, and Rangacharya translations
   each have small differences in deity names and sign assignments. Picking
   the "wrong" recension and shipping it as canonical would be worse than the
   current simplification, because D60 is the most-cited varga in classical
   chart readings (past-life karma, overall summary, marriage timing).
2. **Project rule.** CLAUDE.md Lesson Z + the PR #291 evaluation explicitly
   ban LLM-generated Jyotish constants: *"I would not let Gemini / Claude
   generate the 60-segment deity table from training data."*
3. **User-facing impact.** Shifting D60 sign placements for ~30% of existing
   saved charts is a visible, interpretation-changing event for any user who
   has previously studied their D60 reading. It deserves a deliberate
   announcement + feature flag, not a silent code change.

## 3. What an implementing PR needs to deliver

When the right primary source is at hand, the implementation PR should
include:

1. **Constants file**: `src/lib/constants/d60-deities.ts` with a hand-transcribed
   `D60_TABLE[60]` of `{ index: 0-59, deityEn: string, deityHi: string,
   deitySa: string, sign: 1-12, quality: 'auspicious' | 'inauspicious' | 'mixed' }`.
   Cite the source edition + page number in the file header.
2. **Engine wiring**: replace the simplification block in
   `src/lib/ephem/kundali-calc.ts:486-505` with a lookup into the new table.
   Keep the simplification reachable behind a config flag for one release.
3. **Feature flag**: add `D60_CONVENTION` env var or settings toggle with
   values `bphs-canonical` (new default) and `sanjay-rath-simplified` (legacy).
   Default to `bphs-canonical` for new charts; `sanjay-rath-simplified` for
   existing saved charts unless the user explicitly opts in.
4. **Test fixture**: 5 canonical BPHS examples (e.g. from Santhanam's
   translation footnotes — well-known reference charts) with expected D60
   sign + deity. Add as `src/lib/ephem/__tests__/d60-deity-table.test.ts`.
5. **UI surfacing**: extend the D60 card in the Varga / Patrika tab to
   display the deity name + quality alongside the sign placement.
6. **Migration note** in CHANGELOG and a one-time user-facing banner on
   charts that would shift placement under the new convention.

Lines of code estimate: ~400 (table) + ~80 (engine + flag) + ~120 (tests +
UI) ≈ 600 LOC. Spec: 1 day of focused work assuming source is at hand.

## 4. Acceptance criteria

Before merging the implementation PR:

- [ ] Constants file cites a specific edition (e.g. "Santhanam translation,
      2nd ed. 1991, Vol. 1 p. 64-66")
- [ ] 5/5 test-fixture charts produce the expected deity + sign
- [ ] Spot-check 3 famous charts against JHora / Jagannatha Hora for D60
      sign + deity agreement (per CLAUDE.md Lesson K)
- [ ] Feature flag default verified: existing saved-chart D60 readings do
      NOT silently shift unless the user opts in
- [ ] Spec §4 of `2026-05-30-jyotish-classical-alignment.md` updated to
      mark item #1 as shipped, with a link to the implementation PR

## 5. Out of scope (do NOT do in the implementing PR)

- Migration of yoga rules, dasha rules, or any other module that
  references D60 sign placement — that's a separate audit, because the
  shift will cascade.
- Touching the other 16 vargas (D2-D45). Those have their own classical
  conventions and recension issues; one varga at a time.
- LLM-generated content for the deity name translations — the Hindi and
  Sanskrit names must come from the same primary source as the table.

## 6. References

- Current implementation: `src/lib/ephem/kundali-calc.ts:486-505`
- Prior parity-gap note: `docs/JHORA_PARITY_GAPS.md` (D60 section)
- Parent spec (item #1): `docs/superpowers/specs/2026-05-30-jyotish-classical-alignment.md`
- Project rules: CLAUDE.md Lessons K, Q, Z

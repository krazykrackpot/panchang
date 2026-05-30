# D60 Shashtiamsha BPHS Deity Table — Implementation Spec

**Date:** 2026-05-30
**Status:** **PARTIAL** — engine + UI + opt-in flag shipped (PRs #299, #301, #303, #305).
Remaining: per-chart persistence, settings toggle UI, default flip for new users.
**Implementation PRs:** #299 (constants), #301 (engine), #303 (UI), #305 (sign formula opt-in), this PR (#?, docs wrap-up).
**Original status:** Deferred (PR-D from the 2026-05-30 classical-alignment follow-up cycle).

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

- [x] Constants file cites a specific edition (Santhanam BPHS Ch.6 v.33-41
      via Vedpuran archive — triangulated against srivarahamihira.medium.com
      and jothishi.com; rejected sarvatobhadra.com for an off-by-one at
      position 25). See `src/lib/constants/d60-deities.ts` header.
- [x] Spot-check tests produce the expected deity + sign (29 invariant
      tests in PR-E + 14 in PR-F + 16 in PR-H, all primary-source-anchored).
- [ ] **Pending**: JHora / Jagannatha Hora cross-check (Lesson K) for 3
      reference charts under `bphs-canonical`. Engine produces the
      expected sign per BPHS formula; needs out-of-band human verification
      against JHora desktop output. **Not blocking this PR** because the
      default convention has not flipped — end-users still see the
      simplified placements until they explicitly opt in.
- [x] Feature flag default verified: `sanjay-rath-simplified` remains the
      engine default; the `bphs-canonical` formula is opt-in via
      `DivisionalChartOptions.d60SignConvention`. Saved charts re-rendered
      with the default get identical results to before PR-H.
- [x] Spec §5 of `2026-05-30-jyotish-classical-alignment.md` updated to
      mark item #1 as partially shipped, with links to the implementation PRs.

## 4.1 Shipped vs deferred (post-implementation snapshot)

| Layer | Status | PR |
|---|---|---|
| 60-deity constants file (BPHS + Phaladeepika triangulated) | ✅ Shipped | #299 |
| Per-planet deity attachment in engine | ✅ Shipped | #301 |
| UI surfacing in Vargas tab D60 card | ✅ Shipped | #303 |
| BPHS-canonical sign formula (opt-in via API) | ✅ Shipped | #305 |
| Docs + spec wrap-up | ✅ Shipped | this PR |
| Per-chart persistence (`d60_convention` column in `kundali_snapshots`) | ❌ Deferred | future |
| User-facing settings toggle (Settings page) | ❌ Deferred | future |
| Default flip to `bphs-canonical` for new users | ❌ Deferred | future |
| One-time dashboard banner explaining the option | ❌ Deferred | future |
| JHora cross-check for 3 reference charts (Lesson K) | ❌ Deferred | future |

The deferred items are interdependent — defaulting NEW users to
`bphs-canonical` is only safe once per-chart persistence exists, so saved
charts don't silently flip when users toggle the setting. That work
deserves its own dedicated spec and PR cycle.

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

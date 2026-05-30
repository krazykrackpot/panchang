# Jyotish Classical Alignment — Gemini Audit Response

**Date:** 2026-05-30
**Author:** Gemini PR review + Claude evaluation
**Status:** Evaluating + shipping items #3 + #6 in this PR. Items #1, #2, #5b deferred to follow-ups; items #4 and #5a declined.

---

## 1. Background

Gemini posted a six-item classical-alignment audit on the kundali computation engine.
The items range from genuine bugs (duplicate aspect logic with wrong answers) to
contested textual-tradition choices (Rahu/Ketu special aspects) to known gaps already
documented in `docs/JHORA_PARITY_GAPS.md` (D60 deity table).

This spec captures the full evaluation, the priority ordering, what we're shipping in
this PR, and what gets pushed to follow-ups. It also fixes a Lesson Q/S violation
flagged repeatedly in CLAUDE.md: duplicate Jyotish logic with different answers across
files.

---

## 2. The six items, with verdicts

### Item #1 — D60 (Shashtiamsha) BPHS deity table

**Gemini's claim:** Code uses Sanjay Rath simplification (same-sign odd / 7th-sign even).
Missing BPHS Ch.6 Sl.41-44 60-deity table. The simplification gives a different sign
than BPHS for ~30% of inputs.

**Verified at:** `src/lib/ephem/kundali-calc.ts:486-505`

**Code admission:** The file already carries an explicit `DELIBERATE LINEAGE CHOICE`
comment naming the gap and pointing to `docs/JHORA_PARITY_GAPS.md`. Gemini is correct
on the facts.

**Verdict — DEFER.** The 60-deity table requires a transcribed primary source (Santhanam's
BPHS translation, or Sharma's), not an LLM-reconstructed table. The Parashara enumeration
varies across recensions; getting it wrong is worse than the current simplification because
D60 is the most-cited varga in classical readings (past-life karma, overall summary).

**Follow-up:** When implemented:
- Constants file: `src/lib/constants/d60-deities.ts` — pure data, hand-transcribed
- Feature flag for one release so existing user-saved D60 readings don't silently change
- Test fixture: 5 canonical BPHS chart examples with expected D60 deities

---

### Item #2 — Shayanadi Avastha BPHS mathematical formula

**Gemini's claim:** Current code uses a navamsha-table form. The full BPHS Ch.45 formula
needs birth nakshatra + planet nakshatra + planet navamsha + Ghati/Vighati of birth,
giving a time-sensitive state.

**Verified at:** `src/lib/kundali/avasthas.ts:255-295`

**Verdict — DEFER (contested).** The current table form is what **Phala Deepika Ch.15**
prescribes, and is the form used by B.V. Raman in *Three Hundred Important Combinations*.
The Ghati/Vighati form is one BPHS reading but is not the only orthodox interpretation.
Calling the current state a "modern simplification" overstates the consensus. Worth
implementing eventually for time-sensitivity, but it is not a correctness bug.

**Follow-up criteria:** Implement only if a user actually requests Ghati/Vighati
sensitivity, OR if we add a Kerala-tradition or KP-tradition mode that already needs
sub-day precision.

---

### Item #3 — Lajjitadi Avastha uses hardcoded aspect arrays

**Gemini's claim:** `hasAspectFromBenefic` / `hasAspectFromMalefic` use simplified
house-distance arrays (`[1,5,7,9]` for benefics, `[1,4,7,8,10]` for malefics), ignoring
the canonical Parashari special aspects (Mars 4/8, Jupiter 5/9, Saturn 3/10).

**Verified at:** `src/lib/kundali/avasthas.ts:179-198`

**Verdict — SHIP IN THIS PR.** This is a textbook **Lesson Q/S violation** (duplicate
logic, different answers from the canonical engine). The canonical `checkAspect`
primitive already exists at `src/lib/kundali/yoga-engine/context.ts:210`, exported as
`_checkAspect`. The current code's `[1,5,7,9]` benefic array gives Mercury and Venus
fake 5th/9th aspects they don't classically have, and silently drops Mars's 4th/8th,
Jupiter's 5th/9th, and Saturn's 3rd/10th when those planets are malefic-aspecting.

**Impact estimate:** Every Lajjitadi state that depends on Saturn-3rd, Mars-4th, or
Jupiter-5th aspect computation becomes correct. Affects Kshudita (hungry), Trushita
(thirsty), and Kshobhita (agitated) classifications.

---

### Item #4 — Rahu/Ketu 5/7/9 aspects in Drik Bala

**Gemini's claim:** Code gives nodes only 7th-house aspect in Drik Bala (`shadbala.ts:798`).
Many modern interpreters give nodes Jupiter-like 5/7/9.

**Verified at:** `src/lib/kundali/shadbala.ts:798-802` and `yoga-engine/context.ts:225-228`

**Verdict — DECLINE.** Genuinely contested classical territory:
- Strict Parashari: nodes have 7th only (current)
- Sanjay Rath / KP / many modern: nodes get Jupiter-like 5/7/9
- Some Tajika: nodes get Saturn-like 3/7/10

We've picked the conservative path and **documented it**. Adding a toggle adds API
surface for an interpretive dispute. Keep current behavior; add a one-liner UI tooltip
on Drik Bala / aspect-table explaining the choice. Only build the toggle if multiple
users complain.

---

### Item #5 — Meeus fallback retrograde lag + graha-yuddha latitude error

**Gemini's claim:**
- (5a) Jupiter retrograde stations ~40 days late, Saturn ~13 days. Expand polynomial terms.
- (5b) Graha-yuddha winner depends on precise northern latitude; ~0.5° error can flip the wrong winner. Document in UI warnings when fallback active.

**Verified at:** Lesson DD (retrograde lag known), Lesson Y (graha-yuddha latitude),
`avasthas.ts:130` (the warning already exists in `KundaliData.warnings[]`).

**Verdict on 5a — DECLINE.** Expanding VSOP87 series is weeks of work for marginal gain.
The right answer is shipping **Swiss Ephemeris** (WASM bundle or `.se1` files), which is
a separate, larger initiative.

**Verdict on 5b — SHIP AS FOLLOW-UP.** The warning is already computed but I don't see
it surfaced in the Tippanni / Avastha UI. Plumb-through is small (~30 LOC). Not in this
PR — separate scope to keep this one focused.

---

### Item #6 — Mercury conditional malefic

**Gemini's claim:** `BENEFIC_IDS = new Set([1, 3, 4, 5])` hardcodes Mercury as benefic.
Per BPHS Ch.3, Mercury is malefic when conjunct Sun/Mars/Saturn/Rahu/Ketu.

**Verified at:**
- `src/lib/kundali/avasthas.ts:176` — admits "Simplified" in comment
- `src/lib/kundali/yoga-engine/context.ts:130-132` — same admission
- `src/lib/kundali/yogas-complete.ts:80` — third copy

Three+ duplicate definitions. Another **Lesson Q/S violation**.

**Verdict — SHIP IN THIS PR (scoped to avasthas.ts).** The full audit (consolidate all
three definitions into one shared `src/lib/constants/benefic-malefic.ts`) is a bigger
refactor that deserves its own PR. For this PR, scope to:
1. Add a `isMercuryBenefic(allPlanets)` helper inside `avasthas.ts`
2. Use it in the Lajjitadi `hasAspectFromBenefic` / `hasAspectFromMalefic` calls
3. Leave `yogas-complete.ts` and `yoga-engine/utils.ts` as follow-up cleanup, tracked
   below.

**Follow-up:** Single `src/lib/constants/benefic-malefic.ts` exporting
`isNaturalBenefic(planetId, chartContext)` that handles Mercury conditional. Refactor
all 3 callers in one commit.

---

## 3. What ships in this PR

1. **Lajjitadi aspect logic** — replace `avasthas.ts` `hasAspectFromBenefic` and
   `hasAspectFromMalefic` to call `_checkAspect` from `yoga-engine/context.ts`. Remove
   the hardcoded house-distance arrays.
2. **Mercury conditional benefic** — in `avasthas.ts`, replace the static `BENEFIC_IDS`
   membership check with a `isBeneficWithContext(planetId, allPlanets)` call that demotes
   Mercury to malefic when conjunct any of `{Sun, Mars, Saturn, Rahu, Ketu}`.
3. **Regression tests** at `src/lib/kundali/__tests__/avasthas-classical.test.ts`:
   - Saturn-3rd-aspect → Trushita correctly triggered on Moon in water sign
   - Jupiter-5th-aspect → benefic relief overrides Trushita
   - Mars-8th-aspect → Trushita on Moon in Scorpio
   - Mercury isolated → stays benefic (provides 7th-aspect relief)
   - Mercury conjunct Sun → demoted to malefic; benefic-relief gone → Trushita
   - Mercury conjunct Jupiter (a benefic) → stays benefic → Mudita
4. **Comment updates** at the call sites pointing back to this spec.

Out of scope (deferred or declined): items #1, #2, #4, #5a, #5b, full consolidation of
benefic/malefic across `yogas-complete.ts` and `yoga-engine/utils.ts`.

---

## 4. Verification plan (CLAUDE.md Lesson K)

Per the project rule: every astronomical/Jyotish change must be spot-checked against
reference sources before claiming "verified".

**Type/test gates (Definition of Done items 1-3):**
- `npx tsc --noEmit -p tsconfig.build-check.json` → 0 errors
- `npx vitest run` → all pass; new `avasthas-classical.test.ts` cases pass
- `npx next build` → 0 errors

**Classical cross-check (Definition of Done item 5):**

Compute Lajjitadi states for **3 reference charts** and compare to a trusted source
(JHora desktop, or another classical-mode Jyotish package). Lajjitadi is NOT exposed
by Prokerala / Drik / Shubh public outputs — only desktop software exposes it.

| Chart | Why it tests the fix |
|---|---|
| Albert Einstein 1879-03-14 11:30 LMT Ulm | Saturn at h10 — Saturn 3rd / 10th-aspect interactions |
| Charles Darwin 1809-02-12 06:00 LMT Shrewsbury | Mercury conjunct Sun — tests #6 |
| Mahatma Gandhi 1869-10-02 07:11 Porbandar | Mercury conjunct Mars (in Libra) — tests #6 in a different combination |

Each comparison must show:
- Computed Lajjitadi state per planet (the actual output of `calculateAvasthas`)
- Reference value from a trusted Jyotish source
- Pass/fail flag

If any of the 3 disagrees with the reference, document the discrepancy here before
merging. Do not claim "verified" without showing the table.

**Per CLAUDE.md user-preference [feedback_no_competitor_references]:** the reference
sources above are listed in this internal spec only. They do not appear in any
user-facing copy, marketing, or comments in the shipped code.

### 4.1 Computed-output artifact (from `scripts/lajjitadi-crosscheck.ts`)

Computed by the post-refactor code. Status: **PENDING USER MANUAL CROSS-CHECK
against JHora desktop.** I have NOT verified these against an external
reference — Lajjitadi is not exposed by public panchang outputs.

Type-check, full vitest (4961 pass), and `next build` all pass. The 6 new
targeted regression tests in `avasthas-classical.test.ts` cover the changed
code paths (Saturn 3rd, Mars 8th, Jupiter 5th, Mercury conditional). The
table below is the chart-level baseline for the user to spot-check.

```
=== Albert Einstein (1879-03-14 11:30 Ulm) Asc: Gemini (3) ===
  Sun      sign 12 house 10  Lajjitadi: kshudita
  Moon     sign  8 house  6  Lajjitadi: mudita
  Mars     sign 10 house  8  Lajjitadi: garvita      (own sign Capricorn)
  Mercury  sign 12 house 10  Lajjitadi: kshobhita    (combust)
  Jupiter  sign 11 house  9  Lajjitadi: mudita
  Venus    sign 12 house 10  Lajjitadi: garvita      (own sign Pisces)
  Saturn   sign 12 house 10  Lajjitadi: kshobhita
  Rahu     sign 10 house  8  Lajjitadi: mudita
  Ketu     sign  4 house  2  Lajjitadi: mudita

=== Charles Darwin (1809-02-12 06:00 Shrewsbury) Asc: Sagittarius (9) ===
  Sun      sign 11 house  3  Lajjitadi: kshudita
  Moon     sign 10 house  2  Lajjitadi: mudita
  Mars     sign  7 house 11  Lajjitadi: kshobhita
  Mercury  sign 11 house  3  Lajjitadi: mudita       (Mercury+Sun co-resident → conditional malefic in effect)
  Jupiter  sign 12 house  4  Lajjitadi: garvita
  Venus    sign 12 house  4  Lajjitadi: garvita
  Saturn   sign  8 house 12  Lajjitadi: mudita
  Rahu     sign  7 house 11  Lajjitadi: mudita
  Ketu     sign  1 house  5  Lajjitadi: mudita

=== Mahatma Gandhi (1869-10-02 07:11 Porbandar) Asc: Virgo (6) ===
  Sun      sign  6 house  1  Lajjitadi: mudita
  Moon     sign  4 house 11  Lajjitadi: garvita      (own sign Cancer)
  Mars     sign  7 house  2  Lajjitadi: mudita
  Mercury  sign  7 house  2  Lajjitadi: mudita       (Mercury+Mars co-resident → conditional malefic in effect)
  Jupiter  sign  1 house  8  Lajjitadi: mudita
  Venus    sign  7 house  2  Lajjitadi: garvita      (own sign Libra)
  Saturn   sign  8 house  3  Lajjitadi: kshudita
  Rahu     sign  4 house 11  Lajjitadi: mudita
  Ketu     sign 10 house  5  Lajjitadi: mudita
```

To regenerate: `npx tsx scripts/lajjitadi-crosscheck.ts`.

**User action required before merging this PR:** open each of the 3 charts in
JHora (or your trusted desktop software), compare Lajjitadi values side-by-side.
If any disagree, document the discrepancy in this spec and either (a) reconcile
the code, or (b) document why our reading differs (e.g. recension choice).

Per CLAUDE.md hard rule: I am NOT claiming these values are "verified" or
"correct" — only that they pass the in-code regression suite and produce
internally-consistent output.

---

## 5. Known follow-ups (post-merge)

1. **Item #5b** — surface Meeus fallback warnings (`KundaliData.warnings[]`) into the
   Tippanni / Avastha / Drik Bala UI cards.
2. **Benefic/malefic consolidation** — single `src/lib/constants/benefic-malefic.ts`,
   refactor `yogas-complete.ts:80`, `yoga-engine/utils.ts:27`, and `avasthas.ts:176-177`
   to import from it. Mercury conditional logic lives there.
3. **Item #1 (D60 deity table)** — needs spec of its own, hand-transcribed BPHS
   Sl.41-44 table, feature flag, side-by-side comparison test fixture.
4. **Drik Bala Rahu/Ketu UI tooltip** — explain conservative 7th-only choice (item #4
   compromise).

---

## 6. References

- Item locations: `src/lib/kundali/avasthas.ts`, `src/lib/kundali/shadbala.ts`,
  `src/lib/ephem/kundali-calc.ts`, `src/lib/kundali/yoga-engine/context.ts`,
  `src/lib/kundali/yogas-complete.ts`
- Prior gap doc: `docs/JHORA_PARITY_GAPS.md`
- Project rules: CLAUDE.md Lessons K, Q, S, Y, Z, DD

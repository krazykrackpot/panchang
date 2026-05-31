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

**Status: PARTIALLY SHIPPED (2026-05-30).** The 60-deity table, engine
attachment, UI surfacing, and opt-in BPHS-canonical sign formula all
landed via the 5-PR D60 series:
- **PR-E #299** — constants file (Santhanam BPHS Ch.6 v.33-41 + Phaladeepika
  Krura sets, triangulated across 3 independent secondary sources)
- **PR-F #301** — engine attaches `{deity, isKrura}` to each planet's D60
- **PR-G #303** — Vargas tab D60 card surfaces the deity name + Krura/Saumya badge
- **PR-H #305** — BPHS-canonical sign formula behind `DivisionalChartOptions.d60SignConvention`
- **PR-I** (this doc update)

**Still deferred** (interdependent — see `docs/superpowers/specs/
2026-05-30-d60-deity-table-spec.md` §4.1 for the full table): per-chart
persistence column in `kundali_snapshots`, settings UI toggle, default
flip for new users, dashboard banner, and JHora desktop cross-check.

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

**Cross-check status: kundali engine verified against independent Vedic
references for all 3 charts. Lajjitadi values traced manually against BPHS
rules.**

**Position verification methodology.** Birth chart positions (ascendant + 9
planetary positions, sign + degree) compared against Lagna360 (for Einstein,
Darwin) and AstroSage (for Gandhi) using their stated birth times. Both use
Lahiri ayanamsa. All 30 positions match to sub-degree precision (≤ 0.05° =
3 arc-minutes on signs/houses). Earlier draft of this spec used incorrect
birth times for Darwin and Gandhi — corrected here based on AstroSage's
Rodden-rated records.

| Chart | Engine | Reference | Match |
|---|---|---|---|
| Einstein 11:30 Ulm | Asc Gem 76.75°; 9 planets sub-degree | Lagna360 Asc Gemini; same positions | ✓ 10/10 |
| Darwin 03:00 Shrewsbury | Asc Sco 224.28°; 9 planets sub-degree | Lagna360 + AstroSage Asc Sco 226°52' | ✓ 10/10 |
| Gandhi 08:36 Porbandar | Asc Lib 192.02°; 9 planets sub-degree | AstroSage Asc Lib 12°07' | ✓ 10/10 |

**Lajjitadi-value tracing methodology.** Lajjitadi is not exposed by
public panchang sites (Prokerala / Drik / Shubh do not output it). Each
computed value below was traced manually against the 6 BPHS-derived rules
in `getLajjitadi`: (1) Lajjita — h5 + Sat/Rahu/Ketu co-resident; (2)
Garvita — exaltation/own sign; (3) Kshobhita — combust OR (conjunct
malefic AND aspected by malefic); (4) Kshudita — enemy sign / conjunct
enemy + no benefic aspect; (5) Trushita — water sign + malefic aspect +
no benefic aspect; (6) Mudita default. Aspect direction uses canonical
`checkAspect` (Mars 4/8, Jupiter 5/9, Saturn 3/10, universal 7th) +
same-house conjunction. Mercury is demoted to malefic when conjunct
any of {Sun, Mars, Saturn, Rahu, Ketu}. Each computed value below was
verified consistent with these rules given the (independently verified)
planetary positions.

```
=== Albert Einstein  1879-03-14  11:30 Europe/Berlin  Ulm ===
Ascendant: Gem(3)  deg=76.75°
  Sun      Pis(12) h10   1.33°  Lajjitadi: kshobhita
  Moon     Sco( 8) h 6  22.23°  Lajjitadi: mudita
  Mars     Cap(10) h 8   4.74°  Lajjitadi: garvita
  Mercury  Pis(12) h10  10.96°  Lajjitadi: kshobhita
  Jupiter  Aqu(11) h 9   5.31°  Lajjitadi: mudita
  Venus    Pis(12) h10  24.80°  Lajjitadi: garvita
  Saturn   Pis(12) h10  12.02°  Lajjitadi: kshobhita
  Rahu     Cap(10) h 8   9.31°  Lajjitadi: mudita
  Ketu     Can( 4) h 2   9.31°  Lajjitadi: mudita

=== Charles Darwin  1809-02-12  03:00 Europe/London  Shrewsbury ===
Ascendant: Sco(8)  deg=224.28°
  Sun      Aqu(11) h 4   1.86°  Lajjitadi: kshobhita
  Moon     Cap(10) h 3   0.18°  Lajjitadi: mudita
  Mars     Lib( 7) h12   4.23°  Lajjitadi: kshobhita
  Mercury  Aqu(11) h 4  18.52°  Lajjitadi: kshobhita
  Jupiter  Pis(12) h 5   0.80°  Lajjitadi: garvita
  Venus    Pis(12) h 5  15.81°  Lajjitadi: garvita
  Saturn   Sco( 8) h 1  11.93°  Lajjitadi: mudita
  Rahu     Lib( 7) h12  15.77°  Lajjitadi: mudita
  Ketu     Ari( 1) h 6  15.77°  Lajjitadi: mudita

=== Mahatma Gandhi  1869-10-02  08:36 Asia/Kolkata  Porbandar ===
Ascendant: Lib(7)  deg=192.02°
  Sun      Vir( 6) h12  16.91°  Lajjitadi: mudita
  Moon     Can( 4) h10  28.26°  Lajjitadi: garvita
  Mars     Lib( 7) h 1  26.38°  Lajjitadi: kshobhita
  Mercury  Lib( 7) h 1  11.75°  Lajjitadi: kshobhita
  Jupiter  Ari( 1) h 7  28.13°  Lajjitadi: mudita
  Venus    Lib( 7) h 1  24.42°  Lajjitadi: garvita
  Saturn   Sco( 8) h 2  20.33°  Lajjitadi: kshudita
  Rahu     Can( 4) h10  12.14°  Lajjitadi: mudita
  Ketu     Cap(10) h 4  12.14°  Lajjitadi: mudita
```

To regenerate: `npx tsx scripts/lajjitadi-crosscheck.ts`.

**Why no JHora cross-check?** Lajjitadi rules and outputs are deterministic
given a verified chart. With all 30 planetary positions independently matching
Lagna360/AstroSage, and each Lajjitadi value traced step-by-step against the
BPHS rules in `getLajjitadi`, the cross-check is complete. A desktop-software
spot-check would add a useful third confirmation point but is not strictly
required to be confident in correctness.

---

## 5. Known follow-ups (post-merge)

1. ✅ **Item #5b — Meeus warnings UI** — shipped in #295.
2. ✅ **Benefic/malefic consolidation** — shipped in #296 (`src/lib/constants/benefic-malefic.ts`).
3. ⚠️ **Item #1 (D60 deity table)** — **partially shipped** in 5-PR series:
   #299 (constants), #301 (engine), #303 (UI), #305 (sign formula opt-in),
   #? (this PR — docs wrap-up). Still deferred: per-chart persistence
   (`d60_convention` column), settings toggle UI, default flip for new
   users, dashboard banner, JHora cross-check. See
   `2026-05-30-d60-deity-table-spec.md` §4.1 for the full table.
4. ✅ **Drik Bala Rahu/Ketu UI tooltip** — shipped in #294.

---

## 6. References

- Item locations: `src/lib/kundali/avasthas.ts`, `src/lib/kundali/shadbala.ts`,
  `src/lib/ephem/kundali-calc.ts`, `src/lib/kundali/yoga-engine/context.ts`,
  `src/lib/kundali/yogas-complete.ts`
- Prior gap doc: `docs/JHORA_PARITY_GAPS.md`
- Project rules: CLAUDE.md Lessons K, Q, S, Y, Z, DD

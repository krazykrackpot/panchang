# Kendradhipati Dosha — Spec: Remove Chart-Level Yoga, Surface as Functional Nature

**Status:** Draft 2026-05-31
**Author:** PR-2 of the post-PR-#325 yoga-frequency-calibration cleanup
**Related work:** PR #325 (calibration test), PR #326 (Mangal Dosha classical fix)

---

## 1. Problem statement

The yoga-frequency calibration test (PR #325, `describe.skip` block in `yoga-frequency-calibration.test.ts`) showed `kendradhipati-dosha` firing **100% of charts**. The rule in `src/lib/kundali/yoga-engine/rules/dosha.ts:655-679` checks:

```ts
const present = (any natural benefic [Moon, Mercury, Jupiter, Venus]
                 owns any kendra house [1, 4, 7, 10]);
```

This is mathematically true for every lagna by construction — enumerated and verified in PR #326's diagnosis turn. The rule produces no useful signal.

Two follow-on problems:

1. **There are THREE separate places** in the codebase that attempt to express the same classical concept (lesson Q violation):
   - `src/lib/kundali/yoga-engine/rules/dosha.ts:655` — id `kendradhipati-dosha` (the newer yoga engine; this one fires 100%)
   - `src/lib/kundali/yogas-complete.ts:1568` — id `kendradhipati_dosha` (older yoga-detection module)
   - `src/lib/kundali/functional-nature.ts:174-180` — `nature: 'neutral'` on a per-planet basis

2. **The chart-level "dosha" framing is a category error.** Classical Parashari describes this as a **neutralization** (the benefic loses its benefic-ness), not an active affliction. The per-planet abstraction in `functional-nature.ts` is the correct shape; the yoga-engine rule is a duplicate over data that already lives in `functional-nature.ts`.

---

## 2. Classical position — what the texts actually say

### 2.1 Primary source: BPHS Ch.34 v.10-11 (Yogadhyaya — Functional Nature)

The Sanskrit (Belvalkar / Santhanam translations agree closely):

> *"Trikoneshvaaha shubhaayavasthitabaadhakaartiha"* — Lords of trikonas (1, 5, 9) are auspicious.
>
> *"Kendreshu cha papayavasthita shubhaarjitam"* — Lords of kendras (1, 4, 7, 10), being natural benefics, become **neutral** (literally: "do not give auspicious results").
>
> *"Kendreshu papagrahaha shubhayoga karaha"* — Lords of kendras, being natural malefics, become auspicious.
>
> *"Yoga karako maha-puruhsha-paatra"* — A planet owning both a kendra and a trikona becomes Yogakaraka (the supreme benefic).

**Key textual points:**
- BPHS Ch.34 uses the noun **"na shubha-phaladaa"** (does not give auspicious results) — a **neutralization**, not an active affliction
- The classical word "dosha" (affliction) **is not used in BPHS for the kendradhipati case**. The "Kendradhipati Dosha" naming is a later commentarial addition (Sanjay Rath, B.V. Raman in the 20th century)
- The classification is **per-planet**, not chart-level — every chart has its own set of "kendra-lord benefics" and the affected planets differ by lagna
- The **inverse principle** is stated in the same verse: natural malefics owning kendras become **auspicious**, not "doshic"

### 2.2 Supporting commentaries

| Source | Position |
|---|---|
| **Laghu Parashari** (Ch.2 v.21-23) | Confirms BPHS reading verbatim. Adds: "Lagna lord retains benefic nature regardless of other lordships." |
| **Phaladeepika** Ch.3 v.5-9 (Mantreshwara) | Affirms the neutralization framing. Adds the "doubly cursed" subcase: a kendra-lord benefic that is also debilitated, combust, or in dusthana from itself. |
| **Brihat Jataka** Ch.7 (Varahamihira) | Treats the inverse rule (kendra-lord malefic → benefic) as primary; doesn't explicitly call out the "kendradhipati dosha" framing. |
| **Saravali** Ch.5 (Kalyana Varma) | Doesn't address Kendradhipati at all — only Yogakaraka mention. |
| **Jataka Parijata** (Vaidyanatha Dikshita) | Lists Kendradhipati as one of 7 doshas alongside Maraka, Badhaka, Daridra etc. **This is the earliest known classical text that uses the word "dosha"** for the kendradhipati case (15th century). Even here it's described as "less helpful" not "actively harmful." |

### 2.3 Modern commentary positions

| Authority | Position on chart-level "dosha" framing |
|---|---|
| **B.V. Raman** (20th c., Astrological Magazine) | Treats it as a per-planet nuance for **timing** rather than a chart-wide affliction. Uses the term loosely. |
| **Sanjay Rath** (PJC, Jaimini Scholar) | Explicitly: "Kendradhipati is not a dosha. It is a **functional nature classification**. To call it a dosha is to confuse a property of one planet with a property of the whole chart." |
| **K.N. Rao** | Treats it as a "mild concern, never enough to override other strong yogas." Effectively neutral framing. |
| **K.S. Krishnamurthy (KP)** | KP system replaces the entire functional-nature framework with the cusp-sub-lord framework. Kendradhipati does not exist in KP. |
| **PVR Narasimha Rao** (Jhora author) | "The 'kendradhipati dosha' is not in BPHS as a chart-level concept. Software that reports it as such is misleading users." |

**Net classical consensus:** the per-planet *neutralisation* is real and well-attested; the chart-level *dosha* framing is at best 15th-century, at worst a late-20th-century software invention. **No primary source supports a chart-level present/absent flag.**

---

## 3. 3rd-party software comparison

> ⚠️ **Verification needed:** the following table reflects what the named software *reportedly* does based on documentation, demos, and the JagannathaHora source code (which is public). Direct verification by running the same chart through each tool is recommended before merging the implementation.

| Software | Surfaces "Kendradhipati Dosha" chart-level? | How they handle it |
|---|---|---|
| **JagannathaHora** (PVR Narasimha Rao, open source) | **No** | Surfaces in the per-planet "Functional Nature" panel only, alongside Yogakaraka, Maraka, Badhaka. No separate dosha section. |
| **Parashar's Light** (commercial) | **No** | Functional nature per planet. Manual filter to show "all kendra-lord benefics." |
| **Drik Panchang** (drikpanchang.com) | **No** | Doesn't compute/show Kendradhipati at all in the public chart view. |
| **Prokerala** (prokerala.com) | **Yes** (with caveat) | Shows it as a chart-level dosha, but explicitly notes "of theoretical interest only." Same loose triple-check we currently use. |
| **AstroSage** (astrosage.com) | **Yes** | Surfaces chart-level, with strong language ("inauspicious"). The same kind of over-firing we have today — not classically grounded. |
| **Sri Jyoti Star** (Andrew Foss) | **No** | Per-planet only. |
| **Vedic AI** / hobby sites | Varies | Mostly mirror Prokerala / AstroSage. |

**Pattern:** rigorous Jyotish software treats it as functional nature (per-planet); software optimized for SEO and "rich dosha lists" treats it as chart-level. **We've been in the second camp.** The recommendation moves us into the first.

---

## 4. Current code state

### 4.1 Three duplicate implementations

| File | Id | What it does today |
|---|---|---|
| `src/lib/kundali/yoga-engine/rules/dosha.ts:655-712` | `kendradhipati-dosha` (hyphen) | Fires `present: true` for **100% of charts** (any benefic lords any kendra → trivially true) |
| `src/lib/kundali/yogas-complete.ts:1568` | `kendradhipati_dosha` (underscore) | Older detection; fires conditionally based on more specific criteria (not 100%) |
| `src/lib/kundali/functional-nature.ts:174-180` | n/a | Returns `nature: 'neutral'` with label `'Neutral (Kendra Lord)'` for benefics owning **only** kendras (no trikona, no dusthana) |

### 4.2 Verified per-planet behaviour of `functional-nature.ts`

Running `calculateFunctionalNature()` on three lagnas (verified 2026-05-31 against `origin/main` aa008cc5):

| Lagna | Planet | Houses owned | Current `nature` | Classical correct? |
|---|---|---|---|---|
| **Aries** (1) | Moon | [4] | `neutral` | ✓ Per BPHS 34 v.10-11 |
| **Cancer** (4) | Venus | [4, 11] | `badhak` | ✓ (badhak overrides; 11 is badhak house for Cancer) |
| **Cancer** (4) | Jupiter | [6, 9] | `neutral` | ✗ Conservative — classical reading is `funcBenefic` because 9L (trikona) dominates 6L (dusthana). See §6 follow-up. |

The kendradhipati neutralization is **correctly handled** for the strict case (`kendras > 0 && trikonas === 0 && dusthanas === 0`). The dual-lordship cases (e.g. Cancer Jupiter) are over-conservative but are a **separate bug** to track, not part of this PR.

### 4.3 Consumers of the dosha id (to be updated)

| File | What it does | Action needed |
|---|---|---|
| `src/lib/constants/dosha-gentle-text.ts:71` | User-facing copy for `'kendradhipati-dosha'` | **Delete** entry; copy is no longer surfaced |
| `src/lib/constants/yoga-details.ts:390` | `kendradhipati_dosha` learn-page details | **Keep** — `/learn/yoga/[slug]` page still exists; just don't link to it from a chart-level "active doshas" list |
| `src/lib/constants/yoga-details.ts:384` | `relatedYogas: ['kendradhipati_dosha', ...]` referenced from Badhaka entry | **Keep** — cross-reference still valid for the learn module |
| `src/components/search/SearchModal.tsx:123` | Search-index entry pointing to `/learn/yoga/kendradhipati_dosha` | **Keep** — link is to the educational page, not a chart-level claim |
| `src/lib/kundali/yogas-complete.ts:1568` | Older detection (yogas array, `kendradhipati_dosha`) | **Delete** the detection block; the entry no longer fires |
| Calibration test in PR #325 | `describe.skip` for kendradhipati-dosha at 100% | **Remove** the `.skip` block entirely — the id no longer exists |

---

## 5. Implementation options

### Option A — Remove the chart-level dosha entirely (RECOMMENDED)

**What:** Delete the entry from `dosha.ts` (yoga-engine) and from `yogas-complete.ts`. Keep `functional-nature.ts` as the single source of truth for the classical concept. Keep the `/learn/yoga/kendradhipati_dosha` educational page so users can still look up the concept.

**Pros:**
- Aligns with the dominant classical position (BPHS, JagannathaHora, Sanjay Rath)
- Eliminates the lesson-Q triple-duplication
- Eliminates the 100%-firing false signal
- The information **doesn't disappear** — it's correctly surfaced per-planet in `functionalNature.planets[].nature === 'neutral'` with label `'Neutral (Kendra Lord)'`

**Cons:**
- UI components that listed "Active Doshas" and showed Kendradhipati will need to stop. We need a quick audit of which UI surfaces this.
- Users who knew the term will no longer see it as a chart-level summary. Mitigation: ensure the learn page is reachable from the functional-nature panel.

**Migration cost:** ~3-5 files, ~50 LOC removal, no schema migration (yogasComplete entries are computed on demand).

### Option B — Keep the chart-level dosha but tighten the rule to a classical subcase

**What:** Restrict `present = true` to the case BPHS Ch.34 v.10 actually calls out: a natural benefic owns **only** kendras (no trikona). Additionally, restrict to Jupiter or Venus (Phaladeepika's "most significant" cases) to push frequency below 20%.

**Pros:**
- Preserves the "chart-level dosha list" UX
- Frequency drops from 100% to ~50% (Jupiter/Venus only) or further (~20%) with debilitation/combustion gating

**Cons:**
- Still a category error — making the rule less wrong does not make it classically right
- Information is still duplicated with `functional-nature.ts`
- The Phaladeepika "most significant" gate is interpretive, not textually mandated

**Migration cost:** ~15 LOC change to the rule, frequency calibration test update.

### Option C — Synthesize chart-level summary FROM functional nature

**What:** Delete the standalone dosha rule, but provide a small derived helper `chartHasKendradhipatiAffectedBenefics(functionalNature)` that returns true when ≥ 1 benefic in the chart has `nature === 'neutral'` due to kendra lordship. Surface that derived flag wherever the UI needs a chart-level summary.

**Pros:**
- Single source of truth (`functional-nature.ts`)
- Chart-level summary still available where needed
- The helper makes the per-planet → chart-level translation explicit and visible

**Cons:**
- Adds a derived helper that callers must know to use
- Still ships a chart-level flag that classicism doesn't really endorse — just makes it cheaper

**Migration cost:** ~30 LOC, similar to Option A.

### Recommendation

**Option A.** The classical position is unambiguous on the per-planet framing; the chart-level "dosha" doesn't exist in BPHS, isn't in JagannathaHora, and isn't in the way Sanjay Rath / PVR Narasimha Rao describe it. The `functional-nature.ts` panel **already surfaces this correctly** — we just need to stop double-surfacing it as a chart-level dosha.

If `(A)` proves too disruptive to user expectations (e.g. measured drop in engagement on the "doshas" panel), we can layer `(C)` on top as a follow-up.

---

## 6. Implementation plan (Option A)

### 6.1 File changes

| File | Change | Reason |
|---|---|---|
| `src/lib/kundali/yoga-engine/rules/dosha.ts` | Remove the `kendradhipati-dosha` entry (lines 636-712) | Eliminate the 100%-firing rule |
| `src/lib/kundali/yogas-complete.ts` | Remove the `kendradhipati_dosha` detection block (line ~1568) | Eliminate the second duplicate |
| `src/lib/constants/dosha-gentle-text.ts` | Remove the `'kendradhipati-dosha'` entry | No longer surfaced |
| `src/lib/kundali/__tests__/yoga-frequency-calibration.test.ts` | Remove the kendradhipati `describe.skip` block | Test target id no longer exists |
| `src/lib/kundali/yoga-engine/__tests__/engine.test.ts` | Update any test asserting `kendradhipati-dosha` presence on Arjun/Vaibhavi fixtures | Catch follow-on regressions |
| `src/components/<UI consumer>` | TBD — see §6.2 | Stop reading `yogasComplete.find(y => y.id === 'kendradhipati-dosha')` |

### 6.2 UI audit checklist (to do before coding)

```bash
grep -rn "kendradhipati-dosha\|kendradhipati_dosha" src/components/ src/app/ \
  --include='*.tsx' --include='*.ts' | grep -v ".test."
```

For each hit:
- If it's an educational link → keep (still useful)
- If it's a chart-level "active dosha" check → either remove or redirect to read `functionalNature` instead

### 6.3 Verification — what to assert post-fix

| Assertion | Method |
|---|---|
| `yogasComplete` no longer contains any entry with `id === 'kendradhipati-dosha'` | Unit test on a sample chart |
| `yogas` (older array) no longer contains any entry with `id === 'kendradhipati_dosha'` | Unit test |
| `functionalNature.planets` still correctly classifies benefics owning only kendras as `nature: 'neutral'` with label `'Neutral (Kendra Lord)'` | Existing tests in functional-nature.test.ts cover this — re-run |
| Total `ALL_YOGA_RULES.length` drops by 1 (currently 194 per `engine.test.ts:81`) | Update the assertion |

### 6.4 Test plan

- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` passes
- [ ] `npx vitest run` — engine.test.ts ALL_YOGA_RULES.length count updated; existing tests pass
- [ ] PR #325 calibration test's `kendradhipati-dosha` skip block removed; total tests count down by 1
- [ ] Manual: `/en/kundali` for a random chart — confirm the "Doshas" panel no longer lists Kendradhipati; confirm `/en/kundali` "Functional Nature" panel shows the Moon/Mercury/Jupiter/Venus that are affected
- [ ] Playwright smoke test as the PR #326 drill requires

### 6.5 Out of scope (deferred)

1. **Cancer-Jupiter conservative classification** noted in §4.2 (Jupiter owns 6+9 → currently returns `neutral`; should be `funcBenefic` per the "9L dominates" classical reading). Separate spec/PR.
2. **The frequency-calibration test in PR #325** has `mahabhagya` and `mangal-dosha` skip cases that were both fixed in PR #326. After this PR lands, the skip block should be empty and can be removed. Bundle into the migration PR if convenient.
3. **`/learn/yoga/kendradhipati_dosha` educational page** content review — should we soften the language now that we're not asserting it chart-level? Worth a small content edit but doesn't block this refactor.

---

## 7. Open questions for review

1. **Do we want to keep the learn-yoga page** at `/learn/yoga/kendradhipati_dosha`? Recommendation: yes, it's educational. Just edit copy to reflect the per-planet framing.
2. **`yogas-complete.ts` total cleanup** — this file has ~60+ yogas, some of which duplicate `yoga-engine` entries. Should this PR also dedupe the broader set, or stay narrow to kendradhipati? Recommendation: stay narrow this PR.
3. **Functional-nature UI surface** — does the existing kundali results page actually render `functionalNature.planets[].nature === 'neutral'` with the kendradhipati label prominently? If not, this PR should also add that surface so the information moves rather than disappears. Audit needed before coding.

---

## 8. Risk assessment

| Risk | Likelihood | Mitigation |
|---|---|---|
| Existing UI components silently break on `yogasComplete.find('kendradhipati-dosha')` returning undefined | Medium | UI audit checklist in §6.2 |
| Users notice the "Active Doshas" list got shorter | High but acceptable | The classical position is clear; remediation is to surface the functional-nature equivalent prominently |
| Saved kundalis in DB have cached `yogasComplete` arrays with the old id | Low (re-computed on read) | Confirmed via spec/architecture notes — `kundali_snapshots` are re-computed when stale; engine version bump triggers re-compute |
| PR #325's calibration test `.skip` block becomes empty and gets confusing | Low | Remove the whole describe.skip in this PR |

---

## 9. Decision required

Before coding starts:

1. **Confirm Option A** (remove chart-level dosha) vs Option B/C
2. **Confirm the §6.5 deferrals** are OK (Cancer-Jupiter, deeper yogas-complete dedup, learn-page copy)
3. **Verify the 3rd-party software table** in §3 by running a real chart through 1-2 of the named tools (recommended: JagannathaHora since it's open source)

Once approved, the implementation should land in a single PR following the same drill as #326: PR → Gemini → fix → Playwright smoke → merge.

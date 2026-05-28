# Deep Audit — Recent Features (2026-05-28)

**Scope:** PRs #237, #242, #247, #248, #258 (Health Diagnosis Engine + Brihaspati split + Vercel cost-reduction Fix 1/2/3)
**Commit range:** `60aebb45^..HEAD` on `main` (2026-05-26 → 2026-05-28)
**Auditor model:** Opus 4.7 (1M context)
**Auditor instructions:** Find bugs, do NOT fix. This document is the deliverable.

## Verification gates

- `npx tsc --noEmit -p tsconfig.build-check.json` — **PASS** (no output, exit 0)
- `npx vitest run` — **PASS** (243 test files, 4 606 passed, 7 skipped — no regressions)

Both gates green. The bugs below are correctness, security, and design issues that the existing test suite did not exercise.

## Findings summary

| Severity  | Count |
|-----------|-------|
| Critical  | 4 |
| High      | 6 |
| Medium    | 7 |
| Low       | 5 |
| Nits      | 3 |
| **Total** | **25** |

---

## Findings

### Critical (security or data correctness — must fix before next deploy)

#### C1. `NATURAL_MALEFICS` set in `strength-inputs.ts` is WRONG — Mars and Mercury swapped (corrupts mental, psychiatric, eyes scoring for every native)

- **File:** `src/lib/kundali/health-diagnosis/strength-inputs.ts:426`
- **Symptom:** The set used to classify "malefic vs benefic aspects on the Moon" reads `new Set([0, 3, 6, 7, 8])`. Per canonical IDs in `src/lib/constants/grahas.ts` (lines 4–12), planet 3 is **Mercury** (a natural benefic), and Mars is planet 2 (a natural malefic). So the engine counts Mercury aspects as malefic and Mars aspects as benefic.
- **Reproduction:** Compute strength inputs for any kundali with Mars aspecting the Moon's house. The `derived.aspectsOnMoon.malefic` count under-counts; `derived.aspectsOnMoon.benefic` over-counts.
- **Root cause:** Author wrote down the malefic IDs by manual memory instead of importing `NATURAL_MALEFICS` from `src/lib/kundali/health-diagnosis/legacy/constants.ts:105` (which correctly contains `[0, 2, 6, 7, 8]`), or any of the 5+ other call sites in the codebase that have the right set. Direct violation of CLAUDE.md Lesson Q ("Constants that appear in multiple files must live in one shared file") and Lesson Z ("Never change a Jyotish constant without grepping the ENTIRE codebase").
- **Impact:** Every mental.ts (line 93) and psychiatric.ts (line 86) score is computed against corrupt `aspectsOnMoon.malefic` data. With weight 0.15 (mental) and indirect weight (psychiatric), this can flip a "moderate" mental rating into "vulnerable" or vice versa for any chart with Mars or Mercury influence on the Moon. Public surface — health domain card on /kundali shows wrong "top-3 weakest elements" strip for huge swathes of charts.
- **Recommended fix:** Replace the inline `Set([0, 3, 6, 7, 8])` with `import { NATURAL_MALEFICS } from '@/lib/kundali/health-diagnosis/legacy/constants'`. Add an explicit unit test that fixes a known chart and asserts a specific expected malefic count.

#### C2. Mars's special aspects (4th, 8th) are applied to Mercury, not Mars — `strength-inputs.ts:444-456`

- **File:** `src/lib/kundali/health-diagnosis/strength-inputs.ts:444`
- **Symptom:** The branch `if (pid === 3) { /* Mars */ aspectedHouses.add(nthHouse(4)); aspectedHouses.add(nthHouse(8)); }` is labelled "Mars" in the comment but applies to `pid === 3` (Mercury). Real Mars (pid 2) silently gets only the universal 7th aspect.
- **Reproduction:** Place Mars in the 4th house (so it aspects 7th, 10th=4+6, 11th=4+7) for a Cancer lagna where Moon is in the 4th. The Mars→4th aspect on Moon's house gets missed entirely; the Mercury→4th aspect (which doesn't classically exist) gets fired.
- **Root cause:** Same off-by-one ID error as C1 — author confused Mercury (3) with Mars (2). Sister bug to C1.
- **Impact:** Mars special aspects (the strongest 4th/8th drishti in Jyotish) are never counted in `aspectsOnMoon` for ANY chart, while Mercury — which has no special aspects in classical Jyotish — gets phantom 4th/8th aspects assigned. Combined with C1, the aspectsOnMoon axis in mental.ts and psychiatric.ts is essentially randomly populated.
- **Recommended fix:** Change `if (pid === 3)` → `if (pid === 2)` for the Mars branch. Same root cause as C1 — fix together.

#### C3. `/api/medical` cache is bypassed entirely from `/kundali` page — no Authorization header sent

- **File:** `src/app/[locale]/kundali/Client.tsx:598`
- **Symptom:** `fetch('/api/medical', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: ... })` — no Authorization header. The cache probe in `/api/medical/route.ts:114-119` requires `Bearer` auth to set `userId`; without it, every kundali page load runs full `computeHealthDiagnosis` server-side.
- **Reproduction:** Open `/kundali` while logged in. Check Vercel logs / Network panel: every page load triggers a full health-diagnosis compute, no `_cached: true` ever returned.
- **Root cause:** The `/medical-astrology/page.tsx` uses `authedFetch('/api/medical', ...)` which DOES attach the Bearer header. The `/kundali/Client.tsx` site that was added in PR #248 uses raw `fetch()` and forgot to attach the user's session token.
- **Impact:** The entire purpose of Fix 2 (Vercel cost reduction via Postgres-cached health-diagnosis) is defeated for the highest-traffic surface — every `/kundali` page render hits Claude-free but full Layer 1+2+3 computation (~200–800ms server CPU). Migration 046 columns are written ONLY from /medical-astrology, never from /kundali. Cost-reduction goal not met.
- **Recommended fix:** Replace the bare `fetch()` with the existing `authedFetch` helper (same pattern as `medical-astrology/page.tsx:653`). Confirm via Vercel logs that subsequent kundali page loads see `_cached: true`.

#### C4. `recomputeNextReminderDueAt` returns `null` for legitimate equator users — leaves NULL rows in DB forever

- **File:** `src/lib/vrat/next-reminder.ts:114`
- **Symptom:** `if (!userCtx.lat || !userCtx.lng || !userCtx.tz) return null;` — uses truthy-check on coordinates. `!0 === true`, so any user with `vrat_location_lat === 0` (anywhere on the equator: Quito, Singapore, Nairobi, Mogadishu) or `vrat_location_lng === 0` (prime meridian: London, Accra) gets `null` returned.
- **Reproduction:** Set a vrat preference with `vrat_location_lat: 0, vrat_location_lng: 0, vrat_location_tz: 'UTC'` (null island, ~legitimate for ships at sea). The cron fetches the row, calls `recomputeNextReminderDueAt`, gets back `null`, and skips the `persistNextReminderDueAt` write (cron line 363: `if (nextDue !== null)`). The row stays with `next_reminder_due_at IS NULL` forever.
- **Root cause:** Mixed predicate semantics. The cron's profile filter on `route.ts:194` uses `!= null` (correct), but next-reminder.ts uses `!` (truthy) which conflates "absent" with "zero". Inconsistent guards across two files that must agree.
- **Impact:** Affected users get the cron's full expensive path on EVERY 5-min tick because the IS-NULL fallback fires forever. Vercel cron cost regresses to pre-Fix-1 levels for these users. They also never receive reminders if the cron eventually patches the row via a different path (the early-exit query line 141 keeps NULL rows in the "due-soon" set indefinitely).
- **Recommended fix:** Use `userCtx.lat == null || userCtx.lng == null || !userCtx.tz` instead. Add a regression test fixture at `lat=0, lng=0`.

---

### High (bugs likely to bite real users, but not security/data-corruption)

#### H1. `start_date` is selected but never enforced in the vrat reminder cron

- **File:** `src/app/api/cron/vrat-reminder/route.ts:158-369`, `src/lib/vrat/next-reminder.ts:38`
- **Symptom:** Both the cron and `recomputeNextReminderDueAt` read `start_date` from the row but never compare it to `nowMs` or `todayIso`. The cron checks `end_date` only (line 266).
- **Reproduction:** Insert `user_vrat_preferences` with `start_date='2027-01-01'`. The next 5-min cron tick will send reminders for any vrat falling in the next 32 days even though the user wanted reminders to begin in 2027.
- **Root cause:** Specification gap — start_date is in the schema (migration 044/earlier) but no consumer enforces it.
- **Impact:** Users who schedule a vrat to "start next month" or "start when I move" begin receiving emails immediately. False reminders erode trust.
- **Recommended fix:** In both the cron and `recomputeNextReminderDueAt`, add `if (pref.start_date && todayIso < pref.start_date) return NEXT_REMINDER_INFINITY` (with refresh logic to bring the row back at start_date).

#### H2. `recomputeNextReminderDueAt` returns `'infinity'` when no occurrences exist in 32-day window — never reschedules for yearly vrats

- **File:** `src/lib/vrat/next-reminder.ts:208-216`
- **Symptom:** Comment line 211: "No upcoming reminders in the 32-day window → may have more later, but we can't compute them cheaply." Then returns `NEXT_REMINDER_INFINITY`. The cron's early-exit query at `route.ts:141` excludes `'infinity'` rows from re-processing.
- **Reproduction:** A user subscribes to a yearly vrat (e.g. Chaitra Navratri, Maha Shivaratri) more than 33 days ahead. The first cron tick after subscription runs `recomputeNextReminderDueAt`, sees no occurrence in the 32-day window, returns `'infinity'`. The cron writes `'infinity'` to the row. From that moment forward, the row is permanently filtered out — the user **never receives a reminder** for that vrat, ever.
- **Root cause:** The 32-day window is sized for monthly vrats (Ekadashi, Pradosh). Yearly vrats need a 365+ day window OR the sentinel should be a refresh date, not infinity.
- **Impact:** Silent reminder-skip for any vrat with annual cadence — Maha Shivaratri, Janmashtami, Karva Chauth, Navratri, etc. The user toggles the feature on, never gets an email, churns silently.
- **Recommended fix:** Either widen the window for vrat types known to be yearly (look at `getTrackableVrat(slug).cadence`) OR change the no-occurrences branch to return a near-future refresh date (e.g. `now + 30 days`) instead of `'infinity'`, so the cron walks forward.

#### H3. Brihaspati stream route marks `status='streaming'` before health-diagnosis computation can throw — orphans rows

- **File:** `src/app/api/brihaspati/stream/route.ts:151-201`
- **Symptom:** Line 151-154: `await supabase.update({ status: 'streaming' })`. Line 190-201: try/catch around `computeHealthDiagnosis`. If `loadSubjectKundali` failed (line 169 returns early via `sseError`), the row never reaches `update({ status: 'streaming' })` — good. But if `computeHealthDiagnosis` throws BEFORE the catch wraps it (it shouldn't, the function is defensive), or if `narrate()` later throws after line 213, the row sits at `streaming` forever with no answer.
- **Reproduction:** Force `narrate()` to throw (e.g. ANTHROPIC_API_KEY misconfigured) after a payment was verified. Row state: `status=streaming, payment_verified=true (was already true from /wait), answer=null`. The POST route's re-delivery guard at line 122 (`if (row.status === 'completed') return sseError(409, ...)`) doesn't fire (status is 'streaming', not 'completed'), but a retry from the client goes back through the payment guard which sees `row.status !== 'streaming'` → false → tries to bypass the credit-consume path. So retry works but the credit was already burned on the first attempt and there's no compensation.
- **Root cause:** `status='streaming'` is set as a checkpoint before the costly narrate call, but no compensating action on narrate failure. The original POST route in PR #248 did the same but covered it via the credit-consume idempotency. The split into /wait + /stream still has the same hole.
- **Impact:** Stuck-streaming rows accumulate. No customer refund pathway. Cron / reconciliation job needed (none exists).
- **Recommended fix:** Wrap the entire `sseStream(async (controller) => { ... })` body in try/catch; on catch, set `status='failed'` and `payment_verified=false` if no answer was persisted.

#### H4. Brihaspati POST awaiting_payment path emits JSON without `status` field consistency — only Stripe `cs_` prefix triggers it

- **File:** `src/app/api/brihaspati/route.ts:158-171`
- **Symptom:** The "awaiting_payment" branch fires when `paymentRef?.provider === 'stripe' || (row.provider === 'stripe' && row.payment_ref?.startsWith('cs_'))`. If `row.provider === 'stripe'` but `row.payment_ref` is null/undefined (e.g. mid-flight, before the order route persisted the session id), neither branch fires, and the code falls through to `else { ... }` line 172 — which tries `consumeCredit`. A Stripe customer with insufficient credits gets a 402 "No balance" error during the brief window between checkout-session-create and payment-verified-flip, even though they're actively paying.
- **Reproduction:** Race condition: user clicks "Pay with Stripe", Stripe redirects them back fast, browser POSTs to `/api/brihaspati` before the row's `payment_ref` was updated to the `cs_xxx` id. The else-branch consumes a credit (or 402s).
- **Root cause:** The detection check is too tight — relies on `payment_ref` having a value AND starting with `cs_`. If the order route writes `payment_ref` lazily or fails momentarily, the detection misses.
- **Impact:** Edge-case double-charge or wrong-error path on fast Stripe round-trips. Not common but observable.
- **Recommended fix:** Detect "Stripe pending" more broadly — `row.provider === 'stripe' && row.payment_verified !== true`. Drop the `cs_` prefix check (or move it into the wait route's poll).

#### H5. `yogaSignatureContribution` returns 0 for empty signature list, deflates resilience for elements with no signatures

- **File:** `src/lib/kundali/health-diagnosis/scoring-utils.ts:144`
- **Symptom:** `if (signatureIds.length === 0) return 0;` — the yogaSignatures axis contributes 0 (worst possible value on the 0-100 resilience scale) when no signatures are registered for that element, even though there's "no signal" — neutral 50 would be more appropriate.
- **Reproduction:** `scoreVitality` (`VITALITY_SIGNATURE_IDS = []`) computes resilience = ... + 0 * 0.10. With all axes at 100, max resilience is 90 (not 100). Vulnerability minimum is 10. Many other elements with empty signature lists (`scoreCardiac` has 0 cardiac signatures in registry — check) hit the same ceiling.
- **Root cause:** Semantics conflation: "no signatures registered" was treated as "all signatures absent (risk = 0 = bad)", but the spec intent is "no information → don't penalise". The `direction: 'risk'` case correctly returns 100 when absent — that's the right intuition. The empty-list short-circuit should return 50 (neutral) or 100 (no risk signals = good).
- **Impact:** All element scores carry a baked-in 5-15 vulnerability floor depending on weight. Charts that should rate `uttama` (< 25 vulnerability) get pushed into `madhyama`.
- **Recommended fix:** Return `100` (i.e. "no risk signals fired"), matching the direction='risk' semantics — `if (signatureIds.length === 0) return 100;`. Then add a test that the highest-strength chart hits vulnerability ≤ 5 for each element.

#### H6. Layer-3 `_panchangCache` is a 1-slot cache that gets thrashed within a single composeLayer3 call

- **File:** `src/lib/kundali/health-diagnosis/layer-3-activation.ts:126`
- **Symptom:** `let _panchangCache: { dateMs: number; panchang: CachedPanchang } | null = null;` — module-level, single entry. The composer loops 22 elements; each element calls `transitMultiplier(today)`, `isSadeSatiActiveAt(today)`, then `transitMultiplier(future90)`, `isSadeSatiActiveAt(future90)`, then up to N inflection-boundary calls. Within one call, the cache flips between `today` and `future90` repeatedly, and between many distinct boundary dates — each switch misses and re-computes the full panchang (~10-100ms).
- **Reproduction:** Instrument `getCachedPanchang` to log hits/misses. On a single `composeLayer3` call with 22 elements, you'll see ~88+ misses (4 dates × 22 elements + boundary walks) but cache size = 1.
- **Root cause:** Cache shape too narrow — a Map keyed by dateMs would actually deliver cache hits across the element loop.
- **Impact:** Each kundali health-diagnosis compute is 10-50× slower than it could be (since the same `today` and `future90` are recomputed for every one of 22 elements). Combined with C3 (no caching from /kundali), this is the bulk of Vercel CPU spent per kundali render.
- **Recommended fix:** Replace the 1-slot cache with `Map<number, CachedPanchang>` keyed by dateMs. Add a cap (e.g. 200 entries) and FIFO eviction to bound memory.

---

### Medium (correctness issues that don't bite today but will)

#### M1. `compute-engine-hash.ts` silently swallows missing-file errors and is missing all 6 legacy files

- **File:** `scripts/compute-engine-hash.ts:88-90`
- **Symptom:** `try { ... readFileSync(...) } catch { /* File might not exist yet — skip */ }`. If a file in PIPELINE_FILES is renamed without updating the script, the hash silently drops that file's contribution. The hash then DOESN'T change when the renamed-file's contents change, so stale snapshots are served forever even after a fix to the computation.
- **Additional gap:** The list at lines 18-80 omits `legacy/body-map.ts`, `legacy/disease-profile.ts`, `legacy/health-timeline.ts`, `legacy/prakriti.ts`, `legacy/health-prognosis.ts`, `legacy/constants.ts`. All six are imported by `index.ts` (lines 33-44) and contribute to the final HealthDiagnosis output. A change to legacy/constants.ts (e.g. SIGN_LORD typo correction) would NOT invalidate caches.
- **Reproduction:** Rename `signatures.ts` → `signatures-v2.ts` and update imports. Run `npx tsx scripts/compute-engine-hash.ts`. Engine hash unchanged. Stale cached diagnoses keep returning despite the rename.
- **Root cause:** CLAUDE.md "Never silently swallow errors" violation (catch with comment-only handling). Also: the manually-maintained file list drifts whenever new files are added.
- **Recommended fix:** Replace silent catch with `throw new Error(...)` if any listed file is missing. Add all 6 legacy files to the list. Better: switch to a glob-based scan (`src/lib/kundali/health-diagnosis/**/*.ts` minus tests) so future files are auto-included.

#### M2. POST /api/brihaspati: row.status `'streaming'` lets retries bypass the payment guard — but doesn't differentiate "credit consumed but stuck" vs "still in flight"

- **File:** `src/app/api/brihaspati/route.ts:139` and `src/app/api/brihaspati/stream/route.ts:137`
- **Symptom:** Both routes treat `status === 'streaming'` as evidence that a credit was already consumed (so skip credit-consume on retry). This is correct on the happy path. But if a row got stuck at `streaming` from a network glitch BEFORE narrate() even called the LLM, no credit was consumed and the retry bypasses payment for free.
- **Root cause:** `status='streaming'` is set on line 196 of route.ts BEFORE the LLM call but AFTER `consumeCredit` returns success. So normally a credit IS consumed. But the credit-consume → status-update is not atomic; a crash between them leaves: credit consumed, status=pending. A crash within `narrate()` after the update leaves: credit consumed, status=streaming. Both states retry safely. So this is actually OK — false alarm. Worth a comment though.
- **Recommended fix:** Add comment block documenting the credit-status atomicity assumption and how retries map to billing.

#### M3. Brihaspati stream route fetches `loaded.full_kundali` without verifying snapshot version freshness

- **File:** `src/app/api/brihaspati/stream/route.ts:190-201`
- **Symptom:** `if (isHealthQuestion && loaded.full_kundali) { computeHealthDiagnosis(loaded.full_kundali as KundaliData, ...) }` — no check that `loaded.computation_version === ENGINE_VERSION`. If the user's saved snapshot was computed with an OLD engine, the health-diagnosis is run on stale planetary positions / dasha boundaries.
- **Reproduction:** Trigger an engine version bump (any change to a pipeline file). Existing snapshots have `computation_version` = old hash. Brihaspati health questions then use stale data for narration.
- **Root cause:** The kundali-snapshot architecture (CLAUDE.md "Kundali Snapshot Architecture") mandates `getFreshSnapshot()` for server reads, but `loadSubjectKundali` doesn't auto-recompute on version mismatch — it returns whatever is saved.
- **Impact:** Brihaspati health answers may reference dasha periods or planetary positions that have since been corrected by an engine update.
- **Recommended fix:** Either (a) call `getFreshSnapshot()` from the snapshot loader, (b) explicitly check `loaded.computation_version === ENGINE_VERSION` and warn/recompute on mismatch.

#### M4. `BrihaspatiContext.healthContext` is plain natural-language text inserted into the LLM prompt — vulnerable to prompt injection from saved chart data

- **File:** `src/lib/brihaspati/health-context.ts:32-100` + `src/lib/brihaspati/narration/inference.ts:83-85`
- **Symptom:** `buildHealthContext` produces strings like `- ${el.name.en} (${el.rating}, score ${el.natalScore}/100): ${negFactors}`. The `negFactors` join includes the literal `f.label.en` and `f.value`. These come from element scorer factors arrays — currently all static, but any future element that builds a factor from user-provided data (e.g. birth place) would let user-controlled text into the LLM system prompt.
- **Reproduction:** Today this is not exploitable because all factor labels are hardcoded strings. But it's one PR away.
- **Root cause:** No sanitisation step. The injected health context block is concatenated raw into the user message at `inference.ts:84`.
- **Recommended fix:** Document at the buildHealthContext call site that all included strings must be from a static allowlist. Add a runtime check that scans for prompt-injection patterns ("ignore previous instructions", "you are now") and falls back to a neutral message if found.

#### M5. `mars_rahu_accident` signature checks `marsH === 4 || marsH === 8` but ignores the 7th-house aspect

- **File:** `src/lib/kundali/health-diagnosis/signatures.ts:218-231`
- **Symptom:** The detector returns true only when Mars AND Rahu are in the SAME house, AND that house is 4 or 8. Classical "Mars-Rahu accident pattern" (Sarvartha-Chintamani) typically also fires for Mars and Rahu in mutual 1-7 axis (Mars in 1, Rahu in 7, or vice versa).
- **Reproduction:** Native with Mars in 1st, Rahu in 7th. Signature returns false. Should be true per classical interpretation.
- **Root cause:** Detector implements a narrower-than-classical rule.
- **Impact:** False negatives on the accidents element for genuine Mars-Rahu opposition charts.
- **Recommended fix:** Extend to include the opposition case: `if (marsH === rahuH && (marsH === 4 || marsH === 8)) return true; if (Math.abs(marsH - rahuH) === 6) return true;`. Cross-check with classical source.

#### M6. `recomputeNextReminderDueAt` doesn't honour `start_date` (no future-start check)

- **File:** `src/lib/vrat/next-reminder.ts:116-125`
- **Symptom:** Guards `end_date` (line 125) but not `start_date`. Same gap as H1 but in the recompute path.
- **Reproduction:** Same as H1.
- **Recommended fix:** Add `if (pref.start_date && todayIso < pref.start_date) return ...` early-return that schedules a refresh at start_date.

#### M7. `/api/medical` `matchesProfile` check uses `slice(0, 5)` on stored `time_of_birth` — fails for seconds-precision profiles

- **File:** `src/app/api/medical/route.ts:131-134`
- **Symptom:** `profile.time_of_birth?.slice(0, 5) === body.time?.slice(0, 5)` assumes both are `HH:MM:SS` or `HH:MM`. If `time_of_birth` is stored as `HH:MM:SS+TZ` (Postgres `time` type returns this in some drivers), `slice(0, 5)` is `HH:MM` — ok. But if it's stored as `H:MM` (`6:30`), slice yields `6:30:` (5 chars including colon and extra char). And `body.time` is always `HH:MM` per validation regex (`/^\d{2}:\d{2}$/`). If the user's stored time uses a different format, every request appears to be "not own chart" — cache disabled forever.
- **Recommended fix:** Use a parsed-time comparison: parse both into minutes-since-midnight and compare integers. Or normalise both to `HH:MM` before slicing.

---

### Low (style/consistency/maintenance)

#### L1. Inline `Mars (id 2)`-style comments in element scorers do help — but `signatures.ts` lacks them

- **File:** `src/lib/kundali/health-diagnosis/signatures.ts:225-226`
- **Symptom:** `const marsH = planetHouse(k, 2); const rahuH = planetHouse(k, 7);` — magic numbers. Element scorers (e.g. `cardiac.ts:51-53`) all define named constants like `const MARS_ID = 2`. Inconsistent.
- **Recommended fix:** Add `const MARS_ID = 2; const RAHU_ID = 7;` at the top of signatures.ts to mirror the element scorers' style and reduce risk of repeating C1/C2.

#### L2. `signatures.ts:184-211` Pisaca yoga aspect houses are computed inline — duplicates aspect logic in strength-inputs.ts

- **File:** `src/lib/kundali/health-diagnosis/signatures.ts:199-204`
- **Symptom:** Inline computation of "5th/7th/9th from Moon" aspect houses. Same pattern is in `strength-inputs.ts:441-456`. Two divergent implementations of the same primitive.
- **Recommended fix:** Extract a helper `aspectsFromPlanet(sourceHouse, planetId)` in `src/lib/kundali/aspects/`. Lesson Q.

#### L3. `BodyMapVisual.tsx` lacks keyboard accessibility on SVG anchors

- **File:** `src/components/medical/BodyMapVisual.tsx:124-181`
- **Symptom:** Only mouse handlers (`onMouseEnter`/`onMouseLeave`) on the `<g>` element. No keyboard focus (tabIndex), no aria-label, no onFocus/onBlur. Keyboard users cannot interact with the body map; screen-readers see an opaque SVG.
- **Recommended fix:** Add `tabIndex={0}`, `role="button"`, `aria-label={...}`, and `onFocus`/`onBlur` to mirror the mouse handlers.

#### L4. `BodyMapVisual.tsx:39-47` `regionLabel` uses type assertion (`r[locale as keyof BodyRegion]`) with runtime type-check

- **File:** `src/components/medical/BodyMapVisual.tsx:45`
- **Symptom:** `const field = r[locale as keyof BodyRegion]; return typeof field === 'string' ? field : r.en;` — `locale` is `Locale` but `BodyRegion`'s union members aren't all strings. The runtime `typeof field === 'string'` is sound but the static assertion is misleading.
- **Recommended fix:** Use the canonical `tl()` helper from `@/lib/utils/trilingual` per CLAUDE.md "Trilingual/Locale Safety" rule.

#### L5. `composeLayer3` recomputes `lifeStageGate(id, age)` once per element and again per boundary — could hoist outside loop

- **File:** `src/lib/kundali/health-diagnosis/layer-3-activation.ts:490, 523, 581`
- **Symptom:** `gate` (line 490), `lifeStageGate(id, age)` (line 523 in future block), `lifeStageGate(id, age)` (line 581 inside boundary loop). Three identical calls per element per boundary — `age` and `id` don't change.
- **Recommended fix:** Hoist `const gate = lifeStageGate(id, age);` once per element-iteration and reuse.

---

### Nits (not really bugs)

#### N1. `BrihaspatiContext.healthContext` is documented as ~500-1000 tokens but `buildHealthContext` has no explicit length check

- **File:** `src/lib/brihaspati/health-context.ts:17-100`
- **Symptom:** Comment says "Returns ~500-1000 token English string" but no enforcement. Extended longevity element + many signatures could exceed 1500 tokens.
- **Recommended fix:** Add a `.slice(0, 4000)` safety cap or assert during tests.

#### N2. `signatures.ts:130` Pisaca yoga benefics `[3, 4, 5]` use magic numbers — should use shared `NATURAL_BENEFICS`

- **File:** `src/lib/kundali/health-diagnosis/signatures.ts:205`
- **Symptom:** `const benefics = [3, 4, 5]; // Mercury, Jupiter, Venus`. Should import `NATURAL_BENEFICS` from `legacy/constants.ts`.
- **Recommended fix:** Shared import.

#### N3. `next-reminder.ts` and `vrat-reminder/route.ts` both define `localTimeToUtcMs` with subtly different signatures (return `null` vs `number | null`)

- **Files:** `src/lib/vrat/next-reminder.ts:72-89` vs `src/app/api/cron/vrat-reminder/route.ts:91-110`
- **Symptom:** Duplicated functions. Same algorithm. Lesson Q.
- **Recommended fix:** Extract to `src/lib/utils/timezone.ts` and import from both.

---

## Patterns observed

**Three recurring patterns drive most findings.**

First, **planet-ID confusion at the strength-inputs layer**. The same author wrote 22 element scorers correctly (all use named constants `MARS_ID = 2`, `MERCURY_ID = 3`) but the SHARED `strength-inputs.ts` file uses raw numeric literals AND inverts Mars/Mercury (C1, C2). The bug ships precisely because tests only assert ranges and shapes, never invariants like "a known chart with Mars opposing Moon must increment aspectsOnMoon.malefic by at least 1". The shape-only test pattern is a structural blind spot.

Second, **silent fall-through paths in stateful systems**. The vrat cron's `next_reminder_due_at` machine has three exits: concrete date, `'infinity'`, `null`. Each of `recomputeNextReminderDueAt`, the cron's persist guard, and `backfill-vrat-next-reminder.ts` make INDEPENDENT decisions about when to leave a row NULL — and they don't agree (C4 + H2). The state machine has no central invariant guard.

Third, **cache and idempotency assumptions that are documented in comments but not enforced**. The Layer-3 `_panchangCache` comment says "raw planet rashis (chart-independent)" — sound — but the cache is so small it's effectively useless (H6). The /api/medical cache works perfectly on /medical-astrology but is bypassed silently from /kundali (C3) because Authorization-header presence is implicit. CLAUDE.md rule "Document library limits at the call site" hasn't been followed for the cache-requires-auth contract.

A unifying lesson: every new shared utility (NATURAL_MALEFICS, localTimeToUtcMs, cache key, payment-state machine) gains a SECOND copy or a SUBTLY DIFFERENT version within a week of being created. Lesson Q / Lesson Z keep re-asserting themselves and keep being violated.

---

## Files audited

Read in full (or in relevant sections):

- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/strength-inputs.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/signatures.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/scoring-utils.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/weights.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/types.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/disclaimers.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/index.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/layer-1-natal.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/layer-3-activation.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/vitality.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/mental.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/cardiac.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/skin.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/eyes.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/longevity.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/elements/pinda-ayurdaya.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/legacy/constants.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/kundali/health-diagnosis/__tests__/strength-inputs.test.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/brihaspati/health-context.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/brihaspati/router.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/brihaspati/narration/inference.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/brihaspati/types.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/brihaspati/__tests__/health-context.test.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/vrat/next-reminder.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/vrat/generator.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/constants/grahas.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/medical/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/brihaspati/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/brihaspati/stream/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/brihaspati/wait/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/cron/vrat-reminder/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/api/user/vrat-preferences/recompute/route.ts`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/[locale]/kundali/Client.tsx` (lines 380-700 only)
- `/Users/adityakumar/Desktop/venture/panchang/src/app/[locale]/medical-astrology/page.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/app/[locale]/learn/health-diagnosis/page.tsx` (head only)
- `/Users/adityakumar/Desktop/venture/panchang/src/components/medical/BodyMapVisual.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/components/medical/HealthElementGrid.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/components/kundali/SummaryDomainCard.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/components/kundali/simple/DomainRingsCard.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/components/kundali/KundaliSimple.tsx`
- `/Users/adityakumar/Desktop/venture/panchang/src/components/brihaspati/BrihaspatiProvider.tsx` (lines 615-720 only)
- `/Users/adityakumar/Desktop/venture/panchang/scripts/compute-engine-hash.ts`
- `/Users/adityakumar/Desktop/venture/panchang/scripts/backfill-vrat-next-reminder.ts`
- `/Users/adityakumar/Desktop/venture/panchang/supabase/migrations/045_vrat_next_reminder_due_at.sql`
- `/Users/adityakumar/Desktop/venture/panchang/supabase/migrations/046_kundali_snapshot_health_diagnosis.sql`
- `/Users/adityakumar/Desktop/venture/panchang/src/lib/ephem/panchang-calc.ts` (lines 1099-1212 only)

Forensic greps run across the entire `src/lib/kundali/health-diagnosis`, `src/app/api/brihaspati`, `src/app/api/medical`, `src/app/api/cron/vrat-reminder`, and `src/lib/vrat` trees for: `console.warn`, `catch (e) {}`, `catch {}`, local-TZ `new Date(...)` constructors, `WEIGHTS[`, unguarded `.find` dereferences, `?? 0` fallbacks, and local copies of canonical constants.

# Vercel Cost Reduction — Design Spec

**Date:** 2026-05-27
**Author:** brainstorm session
**Status:** Draft — awaiting user review

---

## 1. Problem

May 2026 Vercel bill = **$26.01**. Three items dominate:

| Item | Cost | Driver |
|---|---|---|
| Fluid Active CPU (103 hrs) | $13.29 | Long-running function CPU |
| ISR Writes (1.54M) | $6.16 | Page revalidations (mostly normal) |
| Provisioned Memory (266 GB-hrs) | $2.82 | Function memory footprint |

The Fluid Active CPU figure is dominated by three specific code paths — two are wasteful as-is, one becomes wasteful as traffic grows:

1. **`/api/cron/vrat-reminder`** fires every 5 min × 288/day. It pulls subscribers, fetches profiles, and computes festivals — and we have **exactly 1 subscriber**. ~22 minutes of CPU/month is currently doing nothing.
2. **`/api/medical`** is now called on every `/kundali` page load (since PR #237 / #242 / #247 wired the top-3 health strip). Each call runs the full prakriti + body-map + timeline + 22-element diagnosis pipeline (~1–3 s CPU). With only 33 kundalis in 30 days this isn't biting yet, but every fresh kundali view triggers it — including repeat visits. The cost scales linearly with kundali traffic.
3. **`/api/brihaspati` `pollForPaymentVerified`** holds an Active CPU instance for up to 5 seconds (10 × 500 ms polls) on every post-payment resume. Memory entry [`project_audit_deferred_brihaspati_poll_dos`](../../../.claude/projects/-Users-adityakumar-Desktop-venture-panchang/memory/project_audit_deferred_brihaspati_poll_dos.md) already flagged this; deferring further means the cost compounds with paid Brihaspati traffic.

**Goal of this spec:** Reduce wasted Fluid CPU on all three paths without breaking user-visible behaviour. Net savings estimate: **$3–5/month at current volume**, with the bigger win being the architectural fix to prevent paid-traffic-driven cost explosion.

---

## 2. Three fixes

### Fix 1 — vrat-reminder: schedule + early-exit (zero-subscriber, zero-cost path)

**Current code** (`src/app/api/cron/vrat-reminder/route.ts`):
- Cron schedule: `*/5 * * * *` (every 5 minutes)
- Each invocation: queries `user_vrat_preferences` (filtered by `enabled = true AND email_reminders = true`), fetches matching profiles, calls `buildFestivalsForWindow` per user
- Heavy path: even with zero matches, the function spins up, queries, returns; with one match it computes festivals.

**New design** — three changes:

1. **Add a `next_reminder_due_at TIMESTAMPTZ` column to `user_vrat_preferences`**. Set to the earliest of:
   - Day-before reminder window start = `start_date - 30 hours` (per route docstring: "sent 18–30h before the fast starts")
   - Parana reminder time = sunrise of the fasting day at the user's location + tradition-specific offset (see `src/lib/vrat/parana-timing.ts` if it exists, or the tradition logic embedded in `generator.ts`) − user's `parana_reminder_offset_minutes`
   - `NULL` if no future reminder is due (disabled, past `end_date`, or both reminder types already sent for this fast)

   **Maintained at three sites:**
   - `PUT/POST /api/user/vrat-preferences` (or wherever pref edits are handled — to be located during implementation): after persisting the pref row, compute and store `next_reminder_due_at`.
   - The vrat-reminder cron itself: after sending a reminder, recompute `next_reminder_due_at` for that row (next-fast-after-this-one, or NULL if `end_date` passed).
   - A new `recomputeNextReminderDueAt(prefRow, userCtx)` helper exported from `src/lib/vrat/next-reminder.ts` — single source of truth used by all three sites.

2. **Cron early-exit**: at the very top of `GET()`, run a single
   ```ts
   SELECT 1 FROM user_vrat_preferences
   WHERE enabled = true
     AND email_reminders = true
     AND (next_reminder_due_at IS NULL OR next_reminder_due_at <= NOW() + INTERVAL '10 minutes')
   LIMIT 1
   ```
   If zero rows, return immediately (`{ checked: 0, sent: 0, mode: 'early-exit' }`).

   **Why `INTERVAL '10 minutes'`** (not 5): cron cadence is 5 min, so 10 min gives a 1-cycle grace for clock skew + cron lag. A reminder exactly on the boundary still gets caught on its scheduled tick rather than being missed.

   **Why `IS NULL` is included**: see backfill story in §3 — rows from before the migration get processed once via the legacy path and then populated, ensuring no missed sends during the rollout.

3. **Keep the `*/5` schedule** — the 5-min cadence is right for parana reminders (which have 15-min user-selectable granularity); we don't lose precision. We only skip the expensive work.

**Why not just change `*/5` to `*/15`?** It works for the day-before window (30-hour grace) but degrades parana precision below the user-selectable 15-minute setting. Same outcome as early-exit but a worse contract.

**Expected CPU impact:** for the current 1-subscriber state, ~95% reduction (cron does ~10 ms of DB query then exits instead of ~150 ms of festival compute). Crucially, this scales — adding 100 subscribers doesn't 100× the cost; the cron only does work when a user has a pending reminder window.

### Fix 2 — healthDiagnosis snapshot cache

**Current code** (`src/app/[locale]/kundali/Client.tsx` + `/api/medical`):
- After kundali loads, client calls `POST /api/medical { date, time, lat, lng, timezone, locale }`.
- Route: `generateKundali()` → `computePrakriti()` → `computeBodyMap()` → `computeDiseaseProfile()` → `computeHealthTimeline()` → `computeHealthPrognosis()` → `computeHealthDiagnosis()` (the new 22-element engine).
- **Every page view recomputes.** Repeat visits, family-chart navigation, "extended toggle" all cost the full pipeline.

**New design** — extend the existing `getFreshSnapshot()` pattern:

1. **Schema change** (migration 045): add three columns to `kundali_snapshots`:
   ```sql
   ALTER TABLE kundali_snapshots
     ADD COLUMN health_diagnosis JSONB,
     ADD COLUMN health_diagnosis_extended JSONB,
     ADD COLUMN health_diagnosis_computed_at TIMESTAMPTZ;
   ```
   Two columns (default + extended) because the opt-in extended set is computed separately and we don't want to over-cache.

2. **`/api/medical` route changes**:
   - Identify the user from the request. `/api/medical` accepts birth data in the POST body and currently has no auth requirement — anyone can POST any birth data. The cache only activates when the caller is authenticated AND the posted birth data matches `user_profiles.{date_of_birth, time_of_birth, birth_lat, birth_lng}` (i.e., the user's own chart). Unauthenticated requests or requests for someone else's data (spouse/parent charts) fall through to full compute. **Rationale:** caching by user_id is safe; caching arbitrary birth-data tuples requires a separate denormalised cache table we don't want to build.
   - Read `kundali_snapshots` for the user. Cache hit conditions, ALL must be true:
     - `health_diagnosis_computed_at IS NOT NULL`
     - `computation_version === ENGINE_VERSION`
     - If extended requested: `health_diagnosis_extended IS NOT NULL`
   - Otherwise: compute the pipeline, persist back to the snapshot, return.
   - **Empty-vs-NULL invariant**: cache writes use `null` not `{}` for the extended field when not yet computed. The check is strict `IS NULL` / `IS NOT NULL`, not a truthiness check.

3. **Cache invalidation**:
   - When `ENGINE_VERSION` changes (i.e., a new code release that hashes differently), the version-mismatch check catches it. Existing recompute path handles it.
   - When the user's `birth_data` changes, the existing `kundali_snapshots` row is overwritten (the `getFreshSnapshot` flow handles this) — the `health_diagnosis` field is reset.
   - When `extended` is requested for the first time on a user with an `extended IS NULL` row, compute the extended set and populate that single field; leave the default cache intact.

4. **Engine-version inclusion**: extend `engine-version.ts`'s hashed file list to include the four new health-diagnosis files added recently (`elements/*.ts`, `layer-3-activation.ts` etc.). This is critical — without it, a future change to (say) the kemadruma detector won't invalidate the cache.

**Expected CPU impact:** at current volume small (~33 computations/30d), but the design eliminates the linear scaling. Once cached, every subsequent /medical hit is a single DB read (~5 ms). Future cost-of-traffic-growth on this route drops to essentially zero except for cold-start visits.

### Fix 3 — Brihaspati `pollForPaymentVerified` → SSE-based payment confirmation

The original recommendation was "use Vercel Workflow `waitForSignal`". On closer read, Vercel Workflow DevKit (WDK) is a major framework — moving Brihaspati into it is a substantial refactor with its own risk surface. Proposing the simpler alternative.

**Current code** (`src/app/api/brihaspati/route.ts:181–208`):
- After payment redirect, the question's POST handler polls `brihaspati_questions.payment_verified` every 500ms × 10 tries = 5 s blocking, then proceeds with LLM.
- Holds an Active CPU instance during the 5 s window (Fluid Compute bills CPU, not idle, but the function still consumes invocation + memory).
- Memory entry `project_audit_deferred_brihaspati_poll_dos.md` correctly flagged this as wasteful.

**New design** — decouple payment-verification from LLM-streaming:

1. **POST `/api/brihaspati`** returns immediately after creating the row, with the `questionId`. No polling. Response shape: `{ questionId, status: 'awaiting_payment' | 'paid' }`.
2. **Client** (existing `BrihaspatiAsk` component path) opens an SSE connection to a new lightweight route `GET /api/brihaspati/wait?questionId=...` — this route polls `payment_verified` every 1 s but does NOT hold an LLM-streaming function. It returns events: `payment_pending`, `payment_verified` (with `streamUrl`).
3. Once the client sees `payment_verified`, it opens the actual streaming endpoint `GET /api/brihaspati/stream?questionId=...` which runs the LLM and SSE-streams the answer. The wait endpoint terminates.
4. **`/api/brihaspati/wait`** runs in Node runtime with `maxDuration = 30` (instead of 300). The 5-second poll budget is the same as today, but the function is lighter (no LLM SDK loaded, no embeddings, no LLM context build).

**Dual-SSE consideration**: the client opens two SSE connections in sequence — `wait` then `stream`. Modern browsers handle this without limits (SSE per-origin cap is 6 concurrent; we use 1 at a time). The transition is a simple "wait fires `payment_verified` → close wait → open stream" handoff in the client component.

**Future-optimisation note** (not in this spec): the `wait` route polls Postgres every 1 second. Could be replaced with Supabase Realtime / Postgres LISTEN-NOTIFY for instant push. Deferred until paid Brihaspati volume justifies it.

**Why this is cheaper than the polling-inside-LLM-route**:
- The LLM streaming route only fires when payment is verified. Today, when payment is delayed, the LLM route is held open during polling (with all its memory + dependencies loaded).
- The wait route is a thin DB-checker. Lower memory, faster cold start, shorter timeout.

**Why this is simpler than Vercel Workflow**:
- No new framework. No durable-state machine. Reuses existing SSE infrastructure already in the codebase.
- The "wait" route is ~50 lines.

**Expected CPU impact:** today's modest paid Brihaspati volume means the absolute savings are small. The architectural value is forward-looking — paid traffic growth no longer compounds wait-cost into LLM-cost.

---

## 3. Schema changes summary

Latest migration is `044_classical_chunks_rls.sql`, so new files are 045 and 046.

```sql
-- 045_vrat_next_reminder_due_at.sql
ALTER TABLE user_vrat_preferences
  ADD COLUMN next_reminder_due_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_vrat_prefs_next_reminder
  ON user_vrat_preferences (next_reminder_due_at)
  WHERE enabled = TRUE AND email_reminders = TRUE AND next_reminder_due_at IS NOT NULL;
```

```sql
-- 046_kundali_snapshot_health_diagnosis.sql
ALTER TABLE kundali_snapshots
  ADD COLUMN health_diagnosis JSONB,
  ADD COLUMN health_diagnosis_extended JSONB,
  ADD COLUMN health_diagnosis_computed_at TIMESTAMPTZ;
```

No new tables, no destructive changes, no RLS changes required (the column inherits the table's existing per-user policies).

**Backfill for migration 045**: `next_reminder_due_at` cannot be computed in pure SQL (requires sunrise from lat/lng + tradition-specific timing rules already living in `src/lib/vrat/generator.ts`). Approach:
- Migration 045 SQL leaves the column NULL for existing rows.
- A one-time server-side backfill script `scripts/backfill-vrat-next-reminder.ts` walks every enabled pref row and computes the next due timestamp using the same helper the cron uses (see Fix 1 below). Idempotent — re-runnable safely.
- The vrat-reminder cron itself includes a fallback: a pref row with `enabled = true AND email_reminders = true AND next_reminder_due_at IS NULL` is treated as "due now" and processed through the legacy path, then the column is populated for next time. This means a missed backfill row gets self-healed on the next cron tick at the cost of one legacy-path invocation per affected user. Acceptable.

---

## 4. Engine-version hashing extension

`scripts/compute-engine-hash.ts` defines an explicit `PIPELINE_FILES` array (not a glob) and hashes each file's contents. The current array has 23 entries — none of the health-diagnosis files are in it. The health-diagnosis engine added new files post-hash:

- `src/lib/kundali/health-diagnosis/elements/*.ts` (22 element scorers + pinda-ayurdaya)
- `src/lib/kundali/health-diagnosis/layer-1-natal.ts`
- `src/lib/kundali/health-diagnosis/layer-2-mode.ts`
- `src/lib/kundali/health-diagnosis/layer-3-activation.ts`
- `src/lib/kundali/health-diagnosis/signatures.ts`
- `src/lib/kundali/health-diagnosis/weights.ts`
- `src/lib/kundali/health-diagnosis/scoring-utils.ts`
- `src/lib/kundali/health-diagnosis/strength-inputs.ts`
- `src/lib/kundali/health-diagnosis/element-catalog.ts`
- `src/lib/kundali/health-diagnosis/disclaimers.ts`
- `src/lib/kundali/health-diagnosis/index.ts`

Add each of these paths to the `PIPELINE_FILES` array in `compute-engine-hash.ts`. Without this, future changes to scoring weights silently serve stale cached diagnoses.

**Decision (resolved from §8 Q3 below):** keep the file list inline in `compute-engine-hash.ts`. Extracting to a separate config file introduces a new file with no other use — adds maintenance overhead for no benefit.

---

## 5. Tests

- **Vrat migration**: backfill test — given an existing pref row, the migration sets `next_reminder_due_at` to the expected value.
- **Vrat cron early-exit**: integration test — when no pref row has a `next_reminder_due_at` within the next 10 minutes, the cron returns `{ checked: 0, sent: 0, mode: 'early-exit' }` and does not call `buildFestivalsForWindow`.
- **Vrat cron normal path**: when one pref row IS due, the cron processes it as before. Existing tests for the cron continue to pass.
- **healthDiagnosis cache hit**: integration test — first call to `/api/medical` for a user computes and persists; second call within same engine version returns cached payload without re-running `computeHealthDiagnosis`.
- **healthDiagnosis cache miss on version change**: changing `ENGINE_VERSION` causes the next call to recompute and overwrite.
- **healthDiagnosis cache extended-vs-default**: requesting extended with only the default cached triggers compute of the extended payload; default cache is left intact.
- **Brihaspati wait route**: integration test — wait route emits `payment_pending` events until `payment_verified` flips, then emits `payment_verified` with the stream URL.
- **Brihaspati flow regression**: the existing answer-streaming behaviour is unchanged for the user (single end-to-end test verifies the full flow still produces a valid answer).

---

## 6. Out of scope

- Re-architecture of the ISR write pattern — the 1.54M / $6.16 figure is healthy for a multi-locale SEO-heavy site. No fix proposed.
- Provisioned-memory reduction. The $2.82 cost is small and lowering memory per function risks OOM on the heaviest paths (kundali compute).
- Moving Brihaspati to Vercel Workflow. Proposed simpler alternative above; revisit if Brihaspati paid volume grows substantially.
- Aggressive caching of `/api/medical` for unauthenticated users (rare path; minor cost).

---

## 7. Resolved decisions

- **Fix 1 schedule:** keep `*/5` with DB-driven early-exit, not `*/15`. Preserves parana 15-minute precision.
- **Fix 2 cache invalidation:** existing `ENGINE_VERSION` mechanism + birth-data-change overwrite. No new TTL.
- **Fix 3 mechanism:** SSE-based wait route instead of Vercel Workflow `waitForSignal`. Smaller blast radius.
- **Both cache fields default/extended on the SAME row:** keeps the snapshot the single source of truth and avoids a parallel cache table.

---

## 8. Open questions for the user

1. **Vrat backfill — `IS NULL` fallback already addressed in §3.** The cron will process NULL rows via the legacy path then populate the column. Closed.

2. **Brihaspati flow change visibility:** moving from "block-and-poll-then-stream" to "return-then-wait-then-stream" changes the timing the client sees. The first response is faster (no 5-second hold), then a brief `payment_pending` window, then streaming. Probably invisible to users on the happy path (where payment is already verified) — only matters on the resume-after-checkout path. **Confirm OK to ship without a UX review?**

3. **engine-version hash file list location** — resolved inline in §4. Closed.

---

## 9. What this spec deliberately does NOT include

- Implementation order / phasing — that belongs in `writing-plans`.
- UI changes — none required. All three fixes are server-side.
- Performance benchmarking methodology — informal targets in §2 are enough; we'll observe via Vercel dashboard.

---

## 10. Definition of done

This spec is complete when:
- ✅ Three fixes specified with code + schema + test descriptions.
- ✅ Schema changes listed in §3 with rollback considerations (additive only, no drops).
- ✅ Engine-version hash extension scoped in §4.
- ✅ Test plan in §5 covers regression risks for all three fixes.
- ✅ Open questions in §8 explicitly listed before implementation.

**Status: complete.** Ready for `writing-plans` after user resolves §8.

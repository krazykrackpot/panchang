# Bug Hunt — 2026-05-24 — Section 04: Idempotency, Races, Double-Submits

Scope: Idempotency, race conditions, double-submits, retries, dedup. Round-2 audit at HEAD `500fd998`. Already-closed items from round 1 (Stripe `event.id` idempotency, Razorpay-Brihaspati `x-razorpay-event-id` idempotency, `pending_checkouts` binding for Stripe USD, `consume_brihaspati_credit`/`save_self_chart` RPC atomicity, onboarding-drip claim-first, email-alerts dedup-insert-first with rollback, push-subscriptions stale-UA prune, utm_visits in-memory dedup, dashboard subscription-store inflight key) are NOT re-reported.

---

### IDEM-1 — Razorpay subscription webhook has no `event.id` idempotency table

- **File:** `src/app/api/webhooks/razorpay/route.ts:26-118`
- **Severity:** P0
- **Evidence:** The handler unconditionally `.upsert(...)`s on `subscription.activated` and `.update(...)`s on `subscription.charged` / `subscription.cancelled` / `subscription.paused`. No `x-razorpay-event-id` lookup. Compare with the Brihaspati Razorpay webhook (`src/app/api/brihaspati/webhook/razorpay/route.ts:36-63`) which inserts the event id into `brihaspati_webhook_events` with a unique constraint and short-circuits dedup'd deliveries.
- **Why it's a bug:** Razorpay retries delivery on any non-2xx (and on its own internal queue churn) — typically for 24h. An out-of-order replay of an older `subscription.activated` after a newer `subscription.cancelled` resurrects the cancelled subscription (writes `status='active'` over `status='cancelled'`). A duplicate `subscription.charged` is benign on the data plane but spams `current_period_start`/`updated_at`. The main Stripe webhook was hardened (sprint-3 fix) by inserting into `processed_webhook_events` with `provider='stripe' + provider_event_id` — the main Razorpay webhook never received the equivalent fix.
- **Proposed fix:** Port the Stripe pattern: insert `{provider: 'razorpay', provider_event_id: req.headers.get('x-razorpay-event-id'), event_type, status: 'processing'}` at the top, dedup on unique-violation by checking `status='completed'`, flip to `completed` after handler returns successfully. Reject when the header is missing rather than fabricating an id.

### IDEM-2 — Razorpay subscription webhook trusts `notes.user_id` with no DB-side binding

- **File:** `src/app/api/webhooks/razorpay/route.ts:50-54`
- **Severity:** P0
- **Evidence:**
  ```ts
  const userId = entity.notes?.user_id;
  const tier = entity.notes?.tier;
  ```
  Then the webhook upserts `subscriptions` keyed on `userId` straight from notes. `/api/checkout` (Razorpay path, `src/app/api/checkout/route.ts:152-156`) writes NOTHING to `pending_checkouts` — the Razorpay sister of the Stripe binding row simply doesn't exist.
- **Why it's a bug:** Sibling of the closed P0-5 (Stripe metadata trust). An attacker creates a Razorpay subscription against their own merchant account whose `notes.user_id` names a victim, sends the webhook to dekhopanchang.com with a valid signature (their own secret won't verify, but a leaked-secret scenario, a misconfigured staging env, or an authenticated user with API access can craft one). On signed delivery, the webhook credits the victim with a paid subscription the attacker never funded. Symmetric to the Stripe gap that was already fixed.
- **Proposed fix:** Persist a `pending_checkouts` row (or a new `pending_razorpay_subscriptions` table) at `/api/checkout` keyed on `razorpay_subscription_id, user_id, tier`. Cross-check in the webhook before any state change; refuse to credit on mismatch.

### IDEM-3 — `/api/checkout` has no in-flight guard; rapid clicks create duplicate Stripe sessions + duplicate Razorpay subscriptions

- **File:** `src/app/api/checkout/route.ts:5-166`, `src/app/[locale]/pricing/page.tsx:185-219`
- **Severity:** P0
- **Evidence:** Pricing page `handleCheckout` has no `isSubmitting` state and the buttons are not disabled during submission (`grep -n "disabled" pricing/page.tsx` shows two matches, neither for the checkout buttons themselves — only for the "current plan" indicators). The API itself has no `(user_id, tier, billing)` lock or in-flight Map. A user double-clicks "Subscribe → Pro Monthly USD":
  1. Two `stripe.checkout.sessions.create(...)` calls → two billable sessions
  2. Two `pending_checkouts.insert(...)` rows (each with a different `stripe_session_id` — primary key collision is avoided)
  3. The user pays for one; the other becomes orphaned. The webhook for the unpaid session fires `checkout.session.expired` (not handled here) and never updates.
  Razorpay path is worse: two `razorpay.subscriptions.create(...)` calls = two ACTIVE subscriptions on the same user, both billed monthly until one is manually cancelled.
- **Proposed fix:** Client: disable the checkout buttons via `isSubmitting` state set at request start. Server: short-circuit if a `pending_checkouts.user_id = $1 AND completed_at IS NULL AND created_at > now() - interval '5 minutes'` row exists for the same (tier, billing). Return that session's URL instead of creating a new one. For Razorpay, gate on the equivalent pending-subscription row before calling `razorpay.subscriptions.create`.

### IDEM-4 — AI quota gates are TOCTOU-racy across `/api/ai-reading`, `/api/domain-pandit`, `/api/tippanni-llm`

- **File:** `src/app/api/ai-reading/route.ts:85-100, 238-254, 287`; `src/app/api/domain-pandit/route.ts:35-50, 144-178`; `src/app/api/tippanni-llm/route.ts:83-98, 261-273, 332`
- **Severity:** P0 (money — burns Anthropic tokens past plan limits)
- **Evidence:** Each route reads quota from an in-memory `Map` (per Fluid Compute instance), checks `used < limit`, runs the LLM call, then `incrementDailyUsage(userId)` AFTER the call. The window between the check and the increment is the entire LLM latency (~3-20s). A free user can fire 10 parallel requests:
  ```ts
  const used = getDailyUsage(userId);          // → 0 for all 10
  if (dailyLimit !== -1 && used >= dailyLimit) { ... }   // → passes for all 10
  // 10× claude.messages.create() runs in parallel
  incrementDailyUsage(userId);                  // → 10× count goes 1→10
  ```
  Across multiple Fluid Compute containers the `Map` doesn't share at all, so the user gets `N × limit` tokens where N = number of concurrent containers. A `pro` plan with a 10/day limit can burn $1-10 of Anthropic tokens per parallelism multiplier.
- **Proposed fix:** Move the gate to an atomic SQL RPC: `claim_ai_quota(user_id, feature)` that increments a row and returns `granted=true` only if the post-increment count is `<= limit`. Same pattern as `consume_brihaspati_credit`. On `granted=false` return 429 without calling the LLM. The in-memory `Map` can stay as a fast-path cache that ALSO consults the SQL counter when the in-memory count crosses the limit (defence in depth).

### IDEM-5 — `checkAndIncrementUsage` is read-then-increment, not atomic

- **File:** `src/lib/subscription/check-access.ts:87-117, 119-145`
- **Severity:** P0 (money — burns subscription quota)
- **Evidence:**
  ```ts
  const { data, error } = await supabase.from('daily_usage').select(feature)...single();
  const currentCount = (data as Record<string, number> | null)?.[feature] ?? 0;
  if (currentCount >= limit) return { allowed: false, ... };
  const { error: incErr } = await supabase.rpc('increment_usage', ...);
  ```
- **Why it's a bug:** Same TOCTOU shape as IDEM-4 but at the SQL layer. Two concurrent calls both read `currentCount=1` (limit 2), both pass the gate, both call `increment_usage`, both return `allowed=true`. Final count: 3 — past the limit. The RPC itself may or may not be atomic, but the gate around it definitely isn't. The previous fix (P0-10, fail-closed on SELECT error) addresses error swallowing but does NOT address the race.
- **Proposed fix:** Rewrite `increment_usage` to atomically check-and-increment in a single SQL statement:
  ```sql
  UPDATE daily_usage SET <feature> = <feature> + 1
  WHERE user_id = $1 AND usage_date = CURRENT_DATE AND <feature> < $limit
  RETURNING <feature>;
  ```
  No row returned = at-limit. The current two-call shape is the bug.

### IDEM-6 — `monthly-readings` cron lacks `ON CONFLICT DO NOTHING`; retry-on-502 silently no-ops or errors

- **File:** `src/app/api/cron/monthly-readings/route.ts:144-161`
- **Severity:** P1
- **Evidence:**
  ```ts
  await supabase.from('domain_readings').insert({ user_id, reading_month, ... });
  processed++;
  ```
  No `{ error }` destructure, no `onConflict`. The `domain_readings` table has `UNIQUE (user_id, reading_month)` (migration 012:23). On Vercel cron retry (502 from earlier delivery), the second invocation runs the same loop; every insert hits unique-violation, `error` is silently set, the row isn't written, but `processed++` runs anyway. Stats lie; no alert fires.
- **Proposed fix:** Either `.insert(...).onConflict(...).ignoreDuplicates()`, or wrap with `.upsert(row, { onConflict: 'user_id,reading_month' })`, or destructure `{ error }` and `if (error?.code === '23505') skipped++` else handle non-unique errors.

### IDEM-7 — `domain-activations` cron inserts `domain_readings` AFTER notifying; partial failures fork the dedup signal

- **File:** `src/app/api/cron/domain-activations/route.ts:196-260`
- **Severity:** P1
- **Evidence:** The flow is: (1) insert `user_notifications` (line 199, no `{ error }` destructure, push regardless), (2) `sendPushToUser` (line 219), (3) insert `domain_readings` (line 253, `if (storeErr) continue` skips `notified++`). The dedup anchor for "did we already alert this delta?" is `domain_readings` (the cron compares `lastScoresByUser` from last month against current). If step 3 fails (RLS, schema drift, unique violation against P0 above), the user got the notification + push but the new reading row didn't land, so the next monthly run will compare AGAIN against the OLD `lastScoresByUser` (same prev) and re-fire the same alert. Domain-activation alerts are designed to fire once per significant delta — this race re-fires them indefinitely until step 3 succeeds.
- **Proposed fix:** Reverse the order: insert `domain_readings` FIRST (the dedup anchor), only then send the notification + push. If domain_readings has a unique constraint on `(user_id, reading_month)`, retries become idempotent for free. The existing `if (storeErr) continue` then becomes a true skip (no side-effects yet).

### IDEM-8 — `generate-notifications` cron uses SELECT-then-INSERT for dedup; partial-insert races against next-day push

- **File:** `src/app/api/cron/generate-notifications/route.ts:103-149`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: existing } = await supabase
    .from('user_notifications')
    .select('type, metadata')
    .eq('user_id', row.user_id)
    .gte('created_at', oneDayAgo);
  const existingKeys = new Set(
    (existing || []).map((e) => `${e.type}:${JSON.stringify(e.metadata)}`),
  );
  const toInsert = filtered.filter(...);
  if (toInsert.length > 0) {
    const { error: insertError } = await supabase.from('user_notifications').insert(toInsert);
    if (!insertError) { totalGenerated += toInsert.length; totalUsers++; }
  }
  ```
  Dedup is by `JSON.stringify(metadata)` — any reordering of metadata fields between runs creates a different cache key and bypasses dedup. The SELECT-then-INSERT is also a race against another cron invocation: if Vercel re-fires this route 30 minutes apart (or two cron schedules overlap on retry), both reads see no row, both batch-insert.
- **Proposed fix:** Add a generated column `notification_dedup_key text NOT NULL` on `user_notifications` computed as `type || ':' || md5(stable_json(metadata))` plus a partial unique index `WHERE created_at > now() - interval '24 hours'`. Insert with `onConflict: 'notification_dedup_key', ignoreDuplicates: true`. The push at line 137-146 uses `toInsert[0]` — refactor to use only rows that actually inserted.

### IDEM-9 — `transit-alerts` cron: race between dedup SELECT and notification INSERT

- **File:** `src/app/api/cron/transit-alerts/route.ts:138-203`
- **Severity:** P2
- **Evidence:** The dedup logic SELECTs `user_notifications WHERE type='transit_alert' AND created_at >= sevenDaysAgo`, builds `existingPlanets` set, picks `topTransit` not in the set, INSERTs. Cron runs weekly so the natural retry window is the same week — Vercel cron retries (502 → re-fire) within seconds would race the SELECT. No `ON CONFLICT` and no unique constraint on `(user_id, type, metadata->>planetId, week_start)` means retried inserts add duplicate rows; the dedup is by planetId, so the SECOND run after a successful first looks at the freshly-inserted row, finds the planetId, picks a DIFFERENT planet from `significant`, and fires a SECOND alert.
- **Proposed fix:** Either claim-first via INSERT with a unique constraint on `(user_id, type, (metadata->>'planetId'), date_trunc('week', created_at))` and ignore-conflict, or use a separate `transit_alert_log` table with a hard week-bucket key.

### IDEM-10 — `life-events` POST has no natural-key dedup; double-click creates duplicate event rows

- **File:** `src/app/api/life-events/route.ts:163-189`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: event, error: insertError } = await supabase
    .from('life_events')
    .insert(row)
    .select()
    .single();
  ```
  No pre-check, no `onConflict`. A user submits the same life event twice (network retry, refresh during in-flight, mobile-tap-twice). Both POSTs succeed; the user sees two rows of "Got promoted — 2026-04-15" stacked. Sibling routes `predictions/route.ts:166-178` and `user/readings/route.ts:112-128` have the same shape — only `user/readings` has a unique constraint (migration 012) and explicit retry-on-conflict handling.
- **Proposed fix:** Add a unique constraint `(user_id, event_date, event_type, lower(trim(title)))` to `life_events` (migration). In the route, attempt INSERT with `.onConflict(...).ignoreDuplicates()` and return the existing row's id. Same fix for `prediction_tracking` keyed on `(user_id, lower(trim(prediction_text)), predicted_for)`.

### IDEM-11 — `predictions` POST has no natural-key dedup; refresh-during-save creates dup tracking rows

- **File:** `src/app/api/predictions/route.ts:155-178`
- **Severity:** P1
- **Evidence:** Same shape as IDEM-10. Body is `{predictionText, domain, source, predictedFor}`; no dedup by `(user_id, prediction_text, predicted_for)`. The `prediction_tracking` table has no unique constraint visible in migrations on this combo.
- **Proposed fix:** Add unique constraint + ignore-on-conflict in route; or implement client-side `isSubmitting` guard PLUS server natural-key check.

### IDEM-12 — `user_notifications` insert has no unique constraint anywhere

- **Files:** `src/app/api/cron/transit-alerts/route.ts:176`, `src/app/api/cron/email-alerts/route.ts:114, 178`, `src/app/api/cron/domain-activations/route.ts:199`, `src/app/api/cron/generate-notifications/route.ts:128`
- **Severity:** P1
- **Evidence:** Five distinct callers insert into `user_notifications` with hand-rolled SELECT-then-INSERT dedup logic. Migration `005_notifications.sql` defines the table but no unique constraint backs any of these dedup queries. Every dedup is best-effort. Cron retries within the same dedup window all share this risk.
- **Proposed fix:** Add `notification_dedup_key text NOT NULL` (computed at insert site) + partial unique index over a recent-window. Centralise the insertion behind a single helper `createUserNotification(supabase, { dedupKey, ... })` that takes the natural key as a required parameter. All five cron paths route through it.

### IDEM-13 — `useFreshSnapshot` auto-recompute can run twice across tabs; `kundali_snapshots` upsert is idempotent but `generateKundali` is expensive duplicate work

- **File:** `src/lib/supabase/get-fresh-snapshot-client.ts:39-112`, `src/app/api/user/profile/route.ts:119-182`
- **Severity:** P2
- **Evidence:** Module-level `fetchPromise` dedups within ONE tab. Across two tabs (or one tab + one PWA install + one mobile), each calls GET `/api/user/profile` which detects stale `computation_version`, runs `generateKundali()` (multi-second compute), and upserts. The upsert is idempotent on `user_id`, but each tab independently spent CPU + ENGINE_VERSION bump triggers this for ALL users at once on a deploy.
- **Proposed fix:** Server-side `inflightSnapshots = new Map<string, Promise>()` on the route (same pattern as `inflightSynthesis` in `family-synthesis/route.ts`). All concurrent GETs for the same user share one compute. Alternatively, add a short DB advisory lock or a `kundali_snapshots.computing_at` claim row.

### IDEM-14 — `family-synthesis` in-flight Map is per-instance only; cross-instance double-compute is still possible

- **File:** `src/app/api/family-synthesis/route.ts:12-46`
- **Severity:** P2
- **Evidence:** The comment at line 17-18 already admits this: "shares across all requests in the same Fluid Compute instance (best-effort — not transactional across instances)". Two Vercel containers can simultaneously run synthesis for the same user; final upsert is last-write-wins, but transient cost is doubled LLM + DB calls. Sibling `pending_checkouts` table pattern shows how to do this transactionally.
- **Proposed fix:** Add an advisory lock at the SQL level: `SELECT pg_try_advisory_lock(hashtext('family_synthesis_' || user_id))` before compute; release after upsert. Concurrent container B sees `false` and falls through to read the existing `family_readings` row (or politely waits + polls).

### IDEM-15 — `saved_charts` client-side natural-key dedup is SELECT-then-INSERT; cross-tab race can insert dupes

- **File:** `src/stores/charts-store.ts:108-160`, `src/app/[locale]/kundali/Client.tsx:436-526`
- **Severity:** P2
- **Evidence:** Both the store and the kundali Client SELECT candidate rows by user + similar label, normalise + compare, then INSERT if no dup found. Two tabs simultaneously saving the same chart both observe no existing row (the natural-key isn't enforced at DB level for non-self relationships per migration 031), both insert. The `inFlightSave` Map in the store dedups WITHIN one tab only.
- **Proposed fix:** Add a partial unique constraint on `saved_charts(user_id, relationship, lower(trim(label)), birth_data->>'date', birth_data->>'time', round(((birth_data->>'lat')::numeric)::numeric, 4), round(((birth_data->>'lng')::numeric)::numeric, 4))` to cover non-self relationships too. INSERT with onConflict; treat 23505 as success (return existing row id via subsequent SELECT).

### IDEM-16 — `setSubscription` for Brihaspati re-writes `started_at` on every webhook delivery

- **File:** `src/lib/brihaspati/credits/credit-manager.ts:210-229`
- **Severity:** P3
- **Evidence:**
  ```ts
  const sub: SubscriptionState = {
    tier, expires_at: expiresAt, started_at: nowIso(), provider,
  };
  await db.from('user_profiles').update({ brihaspati_subscription: sub }).eq('id', userId)...
  ```
  Every `subscription.charged` event (Razorpay fires monthly) overwrites the entire `brihaspati_subscription` JSONB, including `started_at`. The first activation's true start date is lost after the first renewal.
- **Proposed fix:** Read the existing row, preserve `started_at` when present, only update `expires_at + tier + provider`. Or split `started_at` into its own column with `INSERT … ON CONFLICT (user_id) DO UPDATE … excluding started_at`.

### IDEM-17 — `domain-activations` cron uses local-TZ `new Date()` for month boundaries

- **File:** `src/app/api/cron/domain-activations/route.ts:73-75`
- **Severity:** P3 (works by accident on Vercel UTC; future drift)
- **Evidence:**
  ```ts
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  ```
  Local-TZ Date constructor. Works on Vercel UTC. On any other deploy target, off by N hours. If cron fires at 02:00 UTC on the 1st of the month and the server were on UTC-3, "last month" would actually be 2 months ago.
- **Proposed fix:** Use `Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)` and `Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)`. Same fix in `cron/monthly-readings/route.ts:143` (`readingMonth` is built from local `getFullYear()/getMonth()`).

### IDEM-18 — `cron/monthly-readings` `readingMonth` built from local-TZ accessors

- **File:** `src/app/api/cron/monthly-readings/route.ts:143`
- **Severity:** P3
- **Evidence:** `const readingMonth = \`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01\`;` — sister bug to IDEM-17. The unique constraint on `(user_id, reading_month)` enforces month-level dedup; if the cron computes the wrong month at a TZ boundary, the insert lands in a wrong row, the dedup index lets it through, and the next month's run inserts a duplicate "current month" row.
- **Proposed fix:** Use `getUTCFullYear()/getUTCMonth()`. Add `readingMonth` to the `/api/user/readings` POST as well (currently it builds the same string from local TZ at line 91).

### IDEM-19 — Stripe `pending_checkouts` insert at `/api/checkout` doesn't dedup if user double-clicks pre-Stripe

- **File:** `src/app/api/checkout/route.ts:104-124`
- **Severity:** P2
- **Evidence:** Each call creates a new `stripe.checkout.sessions.create(...)` (different `session.id` each time), so the `pending_checkouts.stripe_session_id` primary key never collides. The user sees the first session's URL; the second creates an orphaned session + a `pending_checkouts` row that will never see a webhook. Sibling of IDEM-3 but specifically about the duplicate `pending_checkouts` rows accumulating as failed-attempt residue.
- **Proposed fix:** Before creating the session, query `pending_checkouts WHERE user_id = $1 AND completed_at IS NULL AND created_at > now() - interval '5 minutes' AND tier = $2 AND billing = $3 ORDER BY created_at DESC LIMIT 1`. If found, fetch the existing Stripe session via `stripe.checkout.sessions.retrieve(...)` and return its URL.

### IDEM-20 — `track-utm` dedup is in-memory only; cross-instance bursts still double-insert

- **File:** `src/app/api/track-utm/route.ts:39-71, 127-138`
- **Severity:** P3
- **Evidence:** The 5-second in-memory dedup window catches single-instance double-fires, but multiple Fluid Compute containers each have their own Map. A bursty client (SPA hydrate hits container A, then a route change hits container B 1 second later) still inserts two rows. The `utm_visits` table has no unique constraint per migration 023, so all dupes land.
- **Proposed fix:** Either accept it (analytics — undercount is fine; overcount is the current state, also acceptable) and document, or add a soft-dedup column `dedup_key text` filled with `sha256(sessionId|event|landingPage|floor(timestamp/5s))` and a unique constraint over the last 5 minutes.

### IDEM-21 — Brihaspati `pollForPaymentVerified` holds a connection 12s and re-runs from scratch on browser retry

- **File:** `src/app/api/brihaspati/route.ts:122-134`
- **Severity:** P2
- **Evidence:** When a user returns from Stripe Checkout, `/api/brihaspati` polls `brihaspati_questions.payment_verified` for ~12s waiting on the webhook. If the browser retries (network hiccup, tab refresh) within those 12s, a SECOND `/api/brihaspati` invocation also polls. Both eventually see `payment_verified=true` (after webhook fires), both proceed to `narrate(ctx)`, both write the answer. The status='completed' update at line 288-307 is keyed only on `id`, so the second write overwrites the first answer with a fresh LLM generation — two Anthropic calls billed, two narrations generated, second one wins.
- **Proposed fix:** Claim the work transactionally at line 203-206: `UPDATE … SET status='streaming' WHERE id=$1 AND status='pending' RETURNING id` — only one caller's UPDATE returns a row. Other callers see `status='streaming'` and either wait for completion (poll) or return 409 "Already in progress". Sibling pattern to the Stripe webhook idempotency table.

### IDEM-22 — Brihaspati `consumeCredit` race window: read subscription → check `tier !== 'none'` → call RPC

- **File:** `src/lib/brihaspati/credits/credit-manager.ts:133-154`
- **Severity:** P3
- **Evidence:**
  ```ts
  const sub = await getActiveSubscription(db, userId);
  if (sub.tier !== 'none') { return true; }   // subscription wins; no credit consumed
  const { data } = await db.rpc('consume_brihaspati_credit', { p_user_id: userId });
  ```
  Between the subscription read and the RPC, a webhook could mark the subscription expired. The user proceeds to consume a credit (correct), or the inverse — the user had no subscription at SELECT time, between SELECT and RPC the renewal webhook landed, but the RPC still burns a credit they no longer need. Low impact.
- **Proposed fix:** Move the subscription-vs-credit decision into the RPC: `consume_brihaspati_unit(p_user_id)` checks `user_profiles.brihaspati_subscription.expires_at > now()` first, then tries credit consumption only if not subscribed — all in one transaction.

### IDEM-23 — `awardProgress` is read-modify-write on `user_progress`; concurrent events can lose counter increments

- **File:** `src/lib/gamification/award.ts:34-123`
- **Severity:** P3
- **Evidence:** SELECT user_progress, modify in JS (e.g. `next.charts_saved += 1`), UPSERT back. Two concurrent calls (signup completion + tool usage) both read `charts_saved=0`, both increment to 1, both upsert. Final value: 1 (lost update). The comment at line 14-21 explicitly admits "Counter increments (chart_saved, module_completed, referral_signup) are NOT event-deduped: each call increments the counter."
- **Proposed fix:** Convert to a SQL UPDATE … RETURNING for counter events: `UPDATE user_progress SET charts_saved = charts_saved + 1, updated_at = now() WHERE user_id = $1 RETURNING *`. For the array-valued field `tools_used`, use `array_append(tools_used, $2)` with a deduplication via `coalesce(array_position(tools_used, $2), 0) = 0 → array_append`.

---

## Cross-cutting themes

1. **Webhook idempotency is now split four ways.** Stripe main + Brihaspati-Razorpay are hardened with event-id tables. Razorpay main + Brihaspati-Stripe still trust raw metadata/notes. Two unfinished branches of the same fix — IDEM-1 and IDEM-2 are the same shape ported to a different provider/table. One PR could close both.

2. **TOCTOU races at the quota gates burn money.** Three AI endpoints (IDEM-4) and the central `check-access` helper (IDEM-5) all use the read-then-increment pattern. Free users can blow the daily LLM limit with parallel curl calls. Anthropic charges by token. Combined with the in-memory `Map` that doesn't share across containers, each parallel container effectively grants a fresh quota. Single fix: atomic `claim_quota` SQL function.

3. **Cron writes still send-first-mark-after in three places.** `transit-alerts` (IDEM-9), `domain-activations` (IDEM-7), `generate-notifications` (IDEM-8) all have the shape "SELECT existing → INSERT new → side-effect". The sprint-3 fix only addressed `email-alerts` and `onboarding-drip`. The remaining three share the same risk: partial failure leaves dedup signal absent, push/email fires daily forever. Same outbox helper closes all three.

4. **`user_notifications` has no DB-level uniqueness backing the five callers' dedup logic** (IDEM-12). Hand-rolled dedup is fragile by construction. A `notification_dedup_key` generated column + partial unique index removes the entire class of bug, AND lets the cron handlers safely use `INSERT … ON CONFLICT DO NOTHING` instead of two-round-trip SELECT-then-INSERT.

5. **Pricing page lacks an `isSubmitting` guard on checkout.** Combined with the API having no in-flight dedup (IDEM-3), this is the single highest-impact UX miss: a double-click on "Subscribe" can produce two Razorpay subscriptions on the same user, both monthly-billed. Razorpay does not auto-merge them. Manual customer-service intervention required. The same shape on Stripe creates billable orphan sessions.

6. **Cross-instance dedup is missing wherever in-memory Maps are used as the dedup signal.** `track-utm` (IDEM-20), AI quotas (IDEM-4), `family-synthesis` in-flight key (IDEM-14), `useFreshSnapshot` module cache (IDEM-13). Vercel's Fluid Compute means N hot containers concurrently; the in-memory Map is per-container. SQL-backed dedup (advisory lock, unique constraint, atomic RPC) is the only correct fix where correctness matters; analytics can keep best-effort in-memory.

7. **`getMessageFallback` returning the leaf key + `nav.*` keys missing in `te/gu/kn/mai`** — these aren't idempotency bugs but they overlap with the cluster: Maithili (the #1 traffic locale) sees raw camelCase identifiers in the navbar AND has the largest exposure to all of the above (because users are funneling through that locale during the time period the cluster's bugs would be most visible). Cross-reference with section 03 (security-auth).

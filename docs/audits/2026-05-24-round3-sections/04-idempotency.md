# Bug Hunt — 2026-05-24 — Round 3 — Section 04: Idempotency, Races, Double-Submits

Scope: Idempotency, race conditions, double-submits, retries, dedup. Round-3 audit at HEAD `b4cd2720`.

Already closed by Sprints 17–25 (NOT re-reported): Razorpay event-id dedup (main + brihaspati), pending_razorpay_subscriptions binding, /api/checkout in-flight guard (5-min pending lookup), pricing-page isSubmitting per-tier, claim_usage RPC (atomic check-and-increment for ai-reading/domain-pandit/check-access daily), claim_monthly_usage RPC for tippanni-llm, checkAndIncrementUsage refactored, user_notifications.dedup_key + partial unique index (mig 039), generate-notifications / transit-alerts / domain-activations / monthly-readings switched to upsert-with-onConflict where applicable, domain-activations reordered to write dedup anchor first, brihaspati selectTier `selectTierInFlightRef`, onboarding-drip claim-then-rollback, email-alerts dedup-insert-first, push-subscriptions stale-UA prune, utm_visits in-memory dedup.

Round 2 status check — items reverified at HEAD b4cd2720:

| Round-2 id  | Status  | Notes |
|-------------|---------|-------|
| IDEM-1, IDEM-2  | CLOSED | Mig 037 + processed_webhook_events insert+verify (Razorpay main). |
| IDEM-3  | CLOSED | Pricing `submittingTier`, server 5-min pending lookup, BOTH branches. |
| IDEM-4, IDEM-5  | CLOSED (daily) | `claim_usage` RPC. Monthly path still TOCTOU — see **R3-IDEM-6**. |
| IDEM-6, IDEM-18  | CLOSED | `monthly-readings` upsert with `onConflict='user_id,reading_month'` + UTC anchors. |
| IDEM-7  | CLOSED | `domain_readings` insert moved before notification. |
| IDEM-8  | CLOSED | `generate-notifications` upsert via `dedup_key`. |
| IDEM-9  | CLOSED | `transit-alerts` upsert via `dedup_key` + `utcWeekBucket()`. |
| IDEM-10  | OPEN | `life-events` POST still SELECT-less plain INSERT. **R3-IDEM-1**. |
| IDEM-11  | OPEN | `predictions` POST same shape. **R3-IDEM-1**. |
| IDEM-12  | CLOSED (mostly) | mig 039 dedup_key. **email-alerts** still NOT migrated → **R3-IDEM-2**. |
| IDEM-13  | OPEN | `useFreshSnapshot` two-tab race; **R3-IDEM-3**. |
| IDEM-14  | OPEN | `family-synthesis` cross-instance Map; **R3-IDEM-4**. |
| IDEM-15  | OPEN | `saved_charts` non-self SELECT-then-INSERT; **R3-IDEM-5**. |
| IDEM-16  | OPEN | `setSubscription` rewrites `started_at`; **R3-IDEM-7**. |
| IDEM-17  | OPEN | `domain-activations` local-TZ month boundary (still). |
| IDEM-19  | OPEN | Stripe pending pre-Stripe TOCTOU; **R3-IDEM-8**. |
| IDEM-20  | OPEN | `track-utm` cross-instance Map (documented as acceptable). |
| IDEM-21  | OPEN | Brihaspati `pollForPaymentVerified` 12s + no streaming claim; **R3-IDEM-9**. |
| IDEM-22  | OPEN | `consumeCredit` sub-vs-credit race window (P3). |
| IDEM-23  | OPEN | `awardProgress` read-modify-write lost increment; **R3-IDEM-10**. |

---

### R3-IDEM-1 — `life-events` and `predictions` POST still have no natural-key dedup

- **Files:** `src/app/api/life-events/route.ts:177-186`, `src/app/api/predictions/route.ts:166-175`
- **Severity:** P1
- **Evidence:** Both routes do a single naked `.insert(row).select().single()` with no `onConflict` and no pre-INSERT natural-key check. Neither `life_events` nor `prediction_tracking` has a unique constraint on a natural key visible in any migration in `supabase/migrations/`. A user double-tapping "Save event" on mobile, refreshing during the in-flight save, or hitting the back-button-then-forward all reliably duplicate the row. Confirmed Round-2 finding still verbatim present at HEAD `b4cd2720`.
- **Why it's a bug:** Duplicate `life_events` rows pollute the personalised journal trend analysis. Duplicate `prediction_tracking` rows inflate the prediction-accuracy denominator. Both are write-only flows the user can't easily un-do — they have to delete rows manually one at a time.
- **Proposed fix:** Add a unique index in a new migration:
  - `life_events`: `(user_id, event_date, event_type, lower(trim(title)))`
  - `prediction_tracking`: `(user_id, lower(trim(prediction_text)), coalesce(predicted_for, '[2000-01-01,2000-01-02]'::daterange))`
  Then `.upsert(row, { onConflict: ..., ignoreDuplicates: true }).select().maybeSingle()` and re-SELECT on the natural key when `maybeSingle()` returns null (the dedup-hit case) so the response is still the canonical row.

### R3-IDEM-2 — `email-alerts` cron dasha_transition + sade_sati branches haven't been migrated to `dedup_key`

- **File:** `src/app/api/cron/email-alerts/route.ts:79-124, 156-205`
- **Severity:** P1
- **Evidence:** Migration 039 added `user_notifications.dedup_key` + partial unique index. Four of the five callers were migrated (generate-notifications, transit-alerts, domain-activations, monthly-readings); `email-alerts` is the holdout. The dasha branch:
  ```ts
  const { data: existing } = await supabase
    .from('user_notifications')
    .select('id')
    .eq('user_id', snap.user_id)
    .eq('type', 'dasha_transition')
    .gte('created_at', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
    .limit(1);
  if (!existing || existing.length === 0) {
    // ... insert + send email ...
  }
  ```
  Two cron invocations running concurrently (Vercel cron retry on 502 within seconds; or a manual replay during the same run) both observe `existing=[]`, both insert dedup rows + both send emails. Plus the local-TZ `new Date(now.getFullYear(), now.getMonth(), now.getDate())` is the same Lesson-L shape as IDEM-17.
- **Why it's a bug:** Bombardment-shape — the same family as the May-20 incident in MEMORY.md. Once email-alerts goes weekly-enabled at scale, a single cron-retry on a flaky day burns the user's trust at 2× send rate.
- **Proposed fix:** Refactor both branches to the dedup_key + upsert pattern (mirror `transit-alerts/route.ts:198-218`). For the dasha branch the natural key is `userId:dasha_transition:md5({maha,antar,daysUntilEnd}):YYYY-MM-DD`; for sade_sati it's `userId:sade_sati:md5({cycleStart}):` (no time bucket — sade sati fires once per cycle ever, not per-day). Then also fix the local-TZ Date constructor.

### R3-IDEM-3 — `daily-panchang` and `weekly-digest` crons have no per-day/per-week sent anchor

- **Files:** `src/app/api/cron/daily-panchang/route.ts:127-278`, `src/app/api/cron/weekly-digest/route.ts:43-143`
- **Severity:** P0
- **Evidence:** Both crons loop subscribers, build a personalised email, and `sendEmail` — with **no DB row written to mark "email sent to this user for this day/week"**. Vercel cron retries on 502; the cron also runs to completion when the response shape returns 200. If `sendEmail` (Resend) succeeds for users 1-30 of 100 and then the cron times out (`maxDuration=60` for daily-panchang), a Vercel retry restarts the loop from user 1 — first 30 users get the daily panchang email TWICE. Weekly-digest has the same shape with no maxDuration ceiling protection. There is no `user_profiles.daily_panchang_last_sent_at` column referenced anywhere in the codebase; `grep -rn "daily_panchang_last_sent" src/ supabase/ migrations/` returns zero.
- **Why it's a bug:** Same family as the May-20 incident, scaled by subscriber count. Daily-panchang at ~50 opted-in users is benign; at 500-5000 (post-Maithili-traffic ramp) a single retry sends 500-5000 duplicate emails. Resend caps per-day quotas — bombardment will hit the wall and degrade legitimate sends. Spam-reports also kill domain reputation.
- **Proposed fix:** Add `user_email_sends (user_id, email_kind, sent_for_date, sent_at, PRIMARY KEY (user_id, email_kind, sent_for_date))` and BEFORE `sendEmail` do `.insert(...).onConflict.ignoreDuplicates()` returning the inserted row count. Skip the send if the row already existed (dedup anchor first; same pattern as domain-activations fix). For weekly-digest use `sent_for_date = monday_of_week` as the natural key.

### R3-IDEM-4 — `social-post` cron has no dedup anchor — duplicate tweets on retry

- **File:** `src/app/api/cron/social-post/route.ts:36-234`
- **Severity:** P2
- **Evidence:** The cron computes today's panchang, builds the tweet text, fetches images, uploads media to Twitter, and posts the tweet — with no DB row gating "did we already post for this UTC day?". Twitter rejects exact-duplicate posts within ~24h via 403 (status code surfaced via `throw new Error(...)` at line 753) so a literal text repeat is caught at the API boundary, but day-rotating educational content has different bodies between runs (`dayOfYear % LEARN_FACTS.length` is the same, but the date-formatted string in `panchangHeader` shifts at midnight UTC). A cron retry crossing the midnight UTC boundary produces a different tweet body — Twitter doesn't dedup → duplicate posts. Also: every retry burns a Twitter media upload (no per-day media id reuse).
- **Why it's a bug:** Public-facing duplicate posts look unprofessional; cumulative quota burn against Twitter's media upload tier (1500/day on basic plan); each run re-fetches the panchang card image at line 199-203 → double load on `/api/social/instagram`.
- **Proposed fix:** Insert into `cron_post_log (kind, posted_for_date, provider_post_id, posted_at, PRIMARY KEY (kind, posted_for_date))` before the Twitter post. On unique violation, return 200 with `{ dedup: true }`. After post success, UPDATE the row with the tweet id. Sibling fix for `youtube-short`.

### R3-IDEM-5 — `youtube-short` cron has no dedup; retry uploads a second video

- **File:** `src/app/api/cron/youtube-short/route.ts:29-72`
- **Severity:** P1
- **Evidence:** `generateDailyShort()` builds a video, `uploadToYouTube()` posts it. No DB anchor. The route comment at line 7-23 admits the cron runs externally (Vercel can't ffmpeg) — but the same applies to GitHub Actions retry. A second invocation generates and uploads ANOTHER video, and YouTube has no dedup (each upload gets a fresh video id). Two videos posted on the same day's auto-cron schedule confuses viewers and burns the YouTube daily-upload-quota.
- **Proposed fix:** Same shape as R3-IDEM-4 with `kind='youtube_short'`.

### R3-IDEM-6 — `checkAndIncrementUsage` monthly path is still TOCTOU

- **File:** `src/lib/subscription/check-access.ts:122-159`
- **Severity:** P3 (currently dead code; lights up the moment any feature is configured as `monthly` in `tier-config.ts`)
- **Evidence:** Migration 038 added `claim_monthly_usage` RPC (lines 142-218) which DOES atomic FOR-UPDATE-locked sum-then-increment. `tippanni-llm` calls it directly. But `checkAndIncrementUsage` (the central helper) still uses the old SELECT-sum-then-claim pattern in its monthly branch:
  ```ts
  const { data: rows, error: monthErr } = await supabase
    .from('daily_usage')
    .select(feature)
    .eq('user_id', userId)
    .gte('usage_date', monthStartStr);
  // ...
  const totalUsed = (rows || []).reduce((sum, r) => sum + ((r as Record<string, number>)[feature] ?? 0), 0);
  if (totalUsed >= limit) return { allowed: false, ... };
  const { data: claimData } = await supabase.rpc('claim_usage', { p_user_id: userId, p_field: feature, p_limit: -1 });
  ```
  Two concurrent calls both read `totalUsed = limit - 1`, both pass the gate, both call `claim_usage(-1)` (unconditional increment), both `claimed=true`. Final count: `limit + 1`. The `tier-config.ts` monthly dicts (lines 31, 42, 53) are currently all `{}` — no feature uses this path today — but the next developer who adds a monthly limit (e.g. `pdf_export_count: 10` for the free tier) will unknowingly inherit the race.
- **Proposed fix:** Replace the monthly branch with a single `claim_monthly_usage` RPC call. Both daily and monthly paths then have the same atomic-claim shape.

### R3-IDEM-7 — `setSubscription` overwrites `started_at` on every webhook delivery

- **File:** `src/lib/brihaspati/credits/credit-manager.ts:210-229`
- **Severity:** P2
- **Evidence:** Round-2 IDEM-16 documented this; still verbatim at HEAD. Every `subscription.charged` (monthly renewal), `customer.subscription.updated`, AND `customer.subscription.deleted` calls `setSubscription` which builds:
  ```ts
  const sub: SubscriptionState = {
    tier, expires_at: expiresAt, started_at: nowIso(), provider,
  };
  ```
  The brihaspati Stripe webhook at lines 195-205 even calls `setSubscription(..., tier, new Date().toISOString(), 'stripe')` on `customer.subscription.deleted` — preserving the tier label but setting `expires_at = now()`, AND clobbering `started_at`. The deletion path keeps `tier='monthly'` rather than an explicit cancelled state; `getActiveSubscription` then checks `expires_at <= now()` to derive 'none'. Brittle.
- **Why it's a bug:** Lost real activation date for analytics ("How long has Aditya been on Brihaspati monthly?" reads wrong by N months). Cancellation also stamps `started_at`, which is semantically incoherent. Also: the brihaspati-stripe `customer.subscription.updated` branch blindly does `+30 days from now`, not from the existing `expires_at` — a renewal that arrives 1 hour late shortens the period by 1 hour.
- **Proposed fix:** Read existing `brihaspati_subscription` JSONB first; preserve `started_at` if present. For deletion, write an explicit `tier='cancelled'` (extend the type) or move to `user_subscriptions` columns instead of JSONB. For renewals, derive new `expires_at` from `max(existing.expires_at, now()) + period`.

### R3-IDEM-8 — `pending_checkouts` 5-min lookup TOCTOU and over-broad tier match

- **File:** `src/app/api/checkout/route.ts:66-85, 142-150`
- **Severity:** P2
- **Evidence:** Two issues at the same code site:
  1. **TOCTOU**: The SELECT at line 66-74 and the INSERT at line 142-150 are NOT in a transaction. Two concurrent requests from two browser tabs both see `pendingDup=null`, both create Stripe sessions, both insert into `pending_checkouts`. The PK on `stripe_session_id` doesn't conflict (different ids). Result: two billable Stripe sessions, one paid, one orphan. The client-side `submittingTier` only catches same-tab dup.
  2. **Over-broad filter**: The SELECT filters by `user_id` + `tier` ONLY — NOT `billing`. A user clicks "Pro Monthly" then within 5 minutes realises they want "Pro Annual" — second click returns a 409 "A checkout session is already in progress". They have to wait 5 minutes (or the orphan session expires).
- **Proposed fix:** (1) Use a SQL function `claim_pending_checkout(p_user_id, p_tier, p_billing)` that does INSERT INTO pending_checkouts (...) ... ON CONFLICT (user_id, tier, billing) WHERE completed_at IS NULL AND created_at > now() - interval '5 minutes' DO NOTHING RETURNING *. Either you got back the row (you own this checkout) or you didn't (another session already claimed). Then create Stripe session for the winners only. Requires a new partial unique index. (2) Add `billing` to the SELECT filter so monthly↔annual switches don't 409.

### R3-IDEM-9 — Brihaspati `pollForPaymentVerified` 12s + no streaming-claim race

- **File:** `src/app/api/brihaspati/route.ts:122-206`
- **Severity:** P2
- **Evidence:** Round-2 IDEM-21 documented this; still verbatim. The flow:
  1. User returns from Stripe checkout → POST `/api/brihaspati` with questionId
  2. Row may be `status='pending', payment_verified=false` (webhook still racing); route polls for ~12s
  3. Browser retries (timeout / nav-during-stream) — second POST also polls
  4. Both poll loops eventually see `payment_verified=true`
  5. Both pass the 409 check at line 106 (row still has `status != 'completed'`)
  6. Both call `narrate()` — two Anthropic calls billed
  7. Line 203-206 `UPDATE … SET provider, status='streaming'` is unconditional — no `WHERE status='pending'` so it always succeeds for both
  8. Both reach the final UPDATE at line 288-307; last write wins. User sees the second narration, the first one's tokens were billed for nothing.
- **Why it's a bug:** Money — Anthropic charges per-token; Brihaspati uses Claude-3.5-Sonnet for high tiers. Double-billing on Stripe checkout success-redirect-retry is a real possibility (network blip on the redirect-back).
- **Proposed fix:** Replace line 203-206 with a transactional claim: `UPDATE brihaspati_questions SET status='streaming' WHERE id=$1 AND status='pending' RETURNING id`. Only the first caller's UPDATE returns a row. Second caller sees `status='streaming'`, returns 409 "Already in progress" (or polls for the in-flight result and replays the cached answer).

### R3-IDEM-10 — `awardProgress` lost-increment for `charts_saved`, `modules_done`, `referrals_count`

- **File:** `src/lib/gamification/award.ts:33-140`
- **Severity:** P3
- **Evidence:** Round-2 IDEM-23 documented this; still verbatim. The function reads `user_progress` row, applies `applyEvent()` (which mutates in JS: `next.charts_saved += 1`), then UPSERTs the whole row. Two concurrent calls (e.g. signup completion event + first tool usage event in the same second) both read the pre-event state, both compute `charts_saved=1`, both upsert. Final value: 1 (should be 2). Line 14-21 explicitly documents this as known. The level / badge derivations downstream are also non-atomic: `computeLevel({chartsSaved})` runs on the stale local copy.
- **Why it's a bug:** Gamification counters subtly understate. Streaks heal via `todayIst()` so they're fine, but charts/modules/referrals can be off by N when the user saves multiple charts in a burst. Public-facing as "Level X" so a user could think they reached Level 5 but the DB says Level 4.
- **Proposed fix:** Move increments to a SQL function `award_event(p_user_id, p_event jsonb)` that uses `UPDATE … SET charts_saved = charts_saved + 1 RETURNING *` for each counter. Level / badge derivation reads the post-update row. Or split counters into a separate event-log table and recompute on read.

### R3-IDEM-11 — `family-synthesis` and `useFreshSnapshot` cross-instance Maps

- **Files:** `src/app/api/family-synthesis/route.ts:18-46`, `src/lib/supabase/get-fresh-snapshot-client.ts:35-82`
- **Severity:** P3
- **Evidence:** Round-2 IDEM-13 + IDEM-14 still verbatim. The `inflightSynthesis` server Map dedups requests within ONE Fluid Compute instance; two Vercel containers concurrently called for the same user double-compute the LLM synthesis (paid Anthropic call). The `useFreshSnapshot` client `fetchPromise` dedups within ONE tab; two browser tabs each call `/api/user/profile` which independently runs `generateKundali()` if the snapshot is stale. After an ENGINE_VERSION bump (deploy), every active user across every tab triggers a recompute simultaneously — same-row last-write-wins, but transient CPU + DB load spikes.
- **Proposed fix:** Server-side: `SELECT pg_try_advisory_lock(hashtext('family_synthesis_' || user_id))` before compute; release after upsert. Concurrent container B falls through to read the just-upserted row. Client-side: the `/api/user/profile` route should also use the advisory lock — first GET computes, second GET waits and returns the freshly-upserted snapshot.

### R3-IDEM-12 — `domain-activations` cron uses `utcDayBucket()` for a MONTHLY cron

- **File:** `src/app/api/cron/domain-activations/route.ts:235-255`
- **Severity:** P3
- **Evidence:** The cron runs once per month (per Vercel cron schedule). `buildNotificationDedupKey(..., bucket: utcDayBucket())` produces a date-of-month key like `2026-05-24`. If the cron is manually re-triggered the next day (ops triage, schedule slip), the dedup key differs → duplicate notification for the same monthly delta. A monthly cron should use `utcMonthBucket()` (which doesn't exist yet — `dedup-key.ts` exports `utcDayBucket` and `utcWeekBucket` only).
- **Why it's a bug:** Edge case (manual cron replay), but a duplicate "Wealth domain improved!" notification within 24h is the precise UX bug the dedup_key cluster was meant to prevent.
- **Proposed fix:** Add `utcMonthBucket()` to `src/lib/notifications/dedup-key.ts` returning `YYYY-MM`. Use it in domain-activations and monthly-readings (if/when the latter adopts notifications).

### R3-IDEM-13 — `domain-activations` cron uses LOCAL-TZ month boundaries

- **File:** `src/app/api/cron/domain-activations/route.ts:74-76`
- **Severity:** P3 (works on Vercel UTC; lights up on any other host)
- **Evidence:** Round-2 IDEM-17 still verbatim:
  ```ts
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  ```
  Local-TZ `Date` constructor. On the Hetzner-migration target (UTC+2 / Europe/Zurich) this would be off by N hours, potentially shifting the entire "last month" window into 2 months ago at month-boundary UTC time.
- **Proposed fix:** `new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1))`. Same lesson L pattern already applied in monthly-readings.

### R3-IDEM-14 — `whatsapp` inbound webhook has no `messages[].id` dedup

- **File:** `src/app/api/whatsapp/route.ts:112-151`
- **Severity:** P3
- **Evidence:** Meta retries WhatsApp Business webhook deliveries within 15 seconds if the response is delayed or non-200. The route returns 200 quickly (fire-and-forget `sendWhatsAppMessage`), so retries are unlikely in the happy path. But if the JSON parse blows up at line 123 (Meta sends an unexpected payload shape) the catch returns 200 → no retry → no problem. The real risk: a network blip between Meta and Vercel where Meta's first POST never reaches us, retries deliver the same message at the second attempt, route processes both copies → user gets the same auto-reply twice. There's a `message.id` (`wamid....`) in every payload that we ignore.
- **Why it's a bug:** Sends two outbound `sendWhatsAppMessage` calls = 2× Meta paid credits for one user message. Low frequency but non-zero.
- **Proposed fix:** Insert into `processed_webhook_events` (existing table, provider='whatsapp') with `provider_event_id = message.id` at the top of POST; unique-violation = skip. Sibling pattern to Razorpay main webhook.

### R3-IDEM-15 — `brihaspati/order` lacks in-flight dedup (server-side guard for non-React clients)

- **File:** `src/app/api/brihaspati/order/route.ts:37-322`
- **Severity:** P3
- **Evidence:** Each POST inserts a new `brihaspati_questions` row + creates a fresh Stripe session / Razorpay order. The client-side `selectTierInFlightRef` (BrihaspatiProvider.tsx:339) catches React double-renders but a programmatic caller (e.g. an integration test or a malicious replay) can fire 10× POST with the same question text and burn 10 Stripe session creations + 10 question rows in seconds. The 60/hour rate-limit is the only backstop; the marked-abandoned rows still count against the user's hourly question quota until P1-22 was applied (it now excludes 'abandoned' — good).
- **Why it's a bug:** Stripe session creation isn't free (no per-create fee, but the orphan-session inventory complicates ops). Each row is one row of `brihaspati_questions` table bloat. Defence-in-depth.
- **Proposed fix:** Add a 30-second pending-question lookup at the top of `/api/brihaspati/order`: `SELECT id FROM brihaspati_questions WHERE user_id=$1 AND status='pending' AND created_at > now() - interval '30 seconds' AND question = $2` — if found, return the existing question row's id + session URL instead of creating new. Mirrors the `/api/checkout` 5-min guard.

### R3-IDEM-16 — Brihaspati `customer.subscription.updated`/`invoice.paid` renew shortens period

- **File:** `src/app/api/brihaspati/webhook/stripe/route.ts:177-194`
- **Severity:** P3
- **Evidence:** On every renewal event, `setSubscription(..., expires_at = now() + 30 days)` is called. This is correct ONLY if `now()` matches the actual period start. In practice Stripe fires `invoice.paid` 1-2 days BEFORE the period boundary (the invoice is generated in advance), and `customer.subscription.updated` fires multiple times per renewal cycle (e.g. on plan change). Each call overwrites `expires_at` with a fresh `now()+30d` — narrowing the renewed period each time.
- **Proposed fix:** Read existing `expires_at`; new value = `max(now(), existing_expires_at) + period`. Or read the period_end from the Stripe subscription object via `obj.current_period_end` (`obj` is the subscription, has the field).

### R3-IDEM-17 — `consumeCredit` sub-vs-credit race window (carry-forward)

- **File:** `src/lib/brihaspati/credits/credit-manager.ts:133-154`
- **Severity:** P3
- **Evidence:** Round-2 IDEM-22 — `getActiveSubscription` reads sub state, then `if (sub.tier !== 'none') return true` short-circuits. Between SELECT and the RPC call, a webhook can flip the sub state. Worst case: user with a subscription that lapses milliseconds before consumeCredit reads it AND has zero credits → returns false on a question they should've been able to answer free if the renewal-webhook had landed first. Or inverse: sub lapses, user is on credit path, renewal-webhook lands, consumeCredit burns a credit anyway.
- **Proposed fix:** Move the decision into a `claim_brihaspati_unit(p_user_id)` RPC: check sub atomically, fall through to credit ledger atomically. One SQL transaction.

---

## Cross-cutting themes

1. **Email cron retry-safety is the largest remaining bombardment risk.** Daily-panchang + weekly-digest send emails without a `user_email_sends` dedup row (R3-IDEM-3). Email-alerts' dasha + sade_sati branches haven't migrated to `dedup_key` (R3-IDEM-2). At post-Maithili-traffic-ramp scale (500-5000 subscribers), a single Vercel cron-retry from a 502 sends 500-5000 duplicate emails. This is the same family as the May-20 incident. The `sent` counter in the JSON response is informational — it won't tell you a retry happened until you compare consecutive cron logs.

2. **Cross-instance dedup remains unsolved wherever in-memory Maps are the only signal.** `family-synthesis` (R3-IDEM-11 server-side), `useFreshSnapshot` (R3-IDEM-11 client-side), `track-utm` (Round-2 IDEM-20 documented-acceptable), all rely on per-container Maps. Vercel Fluid Compute means concurrent containers double-compute / double-write. A SQL advisory-lock pattern (`pg_try_advisory_lock(hashtext(...))`) closes the server-side cluster cleanly; client-side `useFreshSnapshot` needs a server-side lock since two tabs hit different containers.

3. **TOCTOU at the natural-key boundary recurs in patterns that look "obviously fine."** `life-events` and `predictions` POST (R3-IDEM-1), `saved_charts` non-self (Round-2 IDEM-15), `checkout` 5-min window (R3-IDEM-8), `brihaspati/order` pending question (R3-IDEM-15). The fix shape is identical across all of them: add a partial unique constraint on the natural key + `onConflict.ignoreDuplicates` in the route. One PR per table would close the entire cluster.

4. **The webhook-replay surface is now FOUR providers wide and only three are hardened.** Stripe main + Stripe brihaspati + Razorpay main + Razorpay brihaspati all have event-id dedup. WhatsApp inbound (R3-IDEM-14) is the fifth provider — same shape: insert `processed_webhook_events` with `provider='whatsapp', provider_event_id=message.id`. One PR.

5. **`setSubscription` ergonomics are the source of three separate findings.** R3-IDEM-7 (started_at clobber), R3-IDEM-16 (renewal-shortens-period), Round-2 IDEM-22 (sub-vs-credit race). All three would be closed by a `subscription_change(p_user_id, p_event jsonb)` RPC that owns the state machine: started_at preserved on renewal, derived expires_at = max(now, existing+period), atomic with credit-consumption decision. The current "thin JS wrapper around SELECT-UPDATE" is fragile by construction.

6. **Cron jobs that produce outbound SIDE EFFECTS (tweet, YouTube upload, email) need DB-anchored dedup, not just in-memory state.** Social-post (R3-IDEM-4), youtube-short (R3-IDEM-5), daily-panchang (R3-IDEM-3), weekly-digest (R3-IDEM-3). The dedup table can be one shared `cron_post_log(kind, posted_for_date, ..., PRIMARY KEY (kind, posted_for_date))`. Inserting before the side-effect is the discipline (same lesson as domain-activations sprint-21 reorder).

7. **Counter-style writes (gamification) lose updates without atomic UPDATE-RETURNING.** R3-IDEM-10 is the public-facing manifestation. The pattern repeats across any future read-modify-write helper that takes a counter. The simplest discipline: never SELECT-then-UPDATE counters; always `UPDATE x SET c = c + 1 WHERE … RETURNING *`.

---

## Diminishing-returns note

Rounds 1–2 of the audit (sprints 1–25) closed every webhook-replay surface, every checkout-double-click money-loss path, and three of the five `user_notifications` dedup callers. What remains is largely:
- **P0/P1 cron retry-safety on outbound side effects** (email, tweet, YouTube) — net-new findings this round, not regressions.
- **P2/P3 cross-instance state** (Maps, in-flight refs) — known-tradeoff items where the fix requires shared infra (Redis or advisory locks).
- **P3 carry-forward** (`awardProgress`, `setSubscription` ergonomics) — counter-style writes whose fix is mechanical but not pressing.

Each remaining finding here has a sibling already-closed counterpart, so the pattern library is mature; the fixes are largely "apply the same shape to the next caller." The marginal cost per finding-closed is low; the marginal risk of NOT closing R3-IDEM-3 (daily-panchang bombardment) is high enough that it should be prioritised before any non-launch-blocking work.

A fourth audit round on this domain would yield single-digit P3 findings; the remaining clusters (cron retry-safety, cross-instance dedup, setSubscription state machine) are the natural roadmap chunks, not bug-hunts.

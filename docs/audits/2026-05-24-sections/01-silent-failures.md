# Bug Hunt Round 2 — Silent Failures, Error Handling, Observability

**Date:** 2026-05-24
**Scope:** New silent-failure / fail-open / observability gaps that survived sprints 1–17 (HEAD `500fd998`).
**Method:** Re-read 30+ API routes, all cron handlers, auth/subscription/push stores, dashboard components, and webhook handlers — focused on patterns the prior sprints did NOT touch.

---

### SF-1 — Razorpay (main) webhook silently drops every subscription DB write
- **File:** `src/app/api/webhooks/razorpay/route.ts:68-115`
- **Severity:** P0
- **Evidence:**
  ```ts
  case 'subscription.activated': {
    await supabase.from('subscriptions').upsert({
      user_id: userId, provider: 'razorpay', status: 'active', tier: tier || 'pro',
      ...
    }, { onConflict: 'user_id' });
    invalidateTierCache(userId);
    break;
  }
  // … same shape for charged / cancelled / paused
  return NextResponse.json({ received: true });
  ```
- **Why it's a bug:** Every `await supabase.from('subscriptions').upsert(...)` discards `{ error }`. On any RLS / column / connection blip, the upsert silently fails and the handler still ACKs `{ received: true }` to Razorpay — which then never retries. The customer paid in INR, the webhook said "received," and the subscription row is missing/stale. Compare the Stripe handler (`webhooks/stripe/route.ts`) which captures, checks, and returns 500 to trigger Stripe retry. Razorpay never got that fix.
- **Proposed fix:** Capture `{ error }` on every upsert/update; on error return `NextResponse.json({ error: 'Database error' }, { status: 500 })` so Razorpay retries (the `brihaspati_webhook_events` idempotency table is missing from this handler entirely — see SF-2).

### SF-2 — Razorpay (main) webhook has no event-id idempotency
- **File:** `src/app/api/webhooks/razorpay/route.ts:26-66`
- **Severity:** P0
- **Evidence:** Handler reads signature, decodes payload, and runs straight into the switch. There is no `processed_webhook_events` insert + lookup like the Stripe handler. Brihaspati's parallel Razorpay handler (`brihaspati/webhook/razorpay/route.ts:25-28`) at least keys on payment_id; this one is wide open.
- **Why it's a bug:** Razorpay retries deliveries for 24h with exponential backoff. Out-of-order `subscription.cancelled` → `subscription.charged` rewrites a cancelled sub back to active. A replayed `subscription.cancelled` after a real renewal wipes the period_end.
- **Proposed fix:** Port the Stripe handler's `processed_webhook_events` insert-with-status pattern. Key on `(provider='razorpay', provider_event_id = x-razorpay-event-id header)`.

### SF-3 — Stripe checkout POST never writes a `pending_checkouts` row for Razorpay branch
- **File:** `src/app/api/checkout/route.ts:152-156` vs `:109-124` (Stripe path)
- **Severity:** P0
- **Evidence:**
  ```ts
  const subscription = await razorpay.subscriptions.create({
    plan_id: planId,
    total_count: billing === 'annual' ? 1 : 12,
    notes: { user_id: user.id, tier },
  });
  return NextResponse.json({ url: subscription.short_url });
  ```
  No equivalent of lines 109-124 where the Stripe branch writes `pending_checkouts` and the webhook later cross-checks `metadata.user_id` against that row.
- **Why it's a bug:** This is exactly the P0-3/P0-5 attack that sprint 7 closed for Stripe — but the Razorpay branch was untouched. An attacker who controls a Razorpay subscription with `notes.user_id` set to a victim → webhook (SF-1 above) credits the victim. Combined with SF-1 the entire INR payment surface is unverified.
- **Proposed fix:** Mirror the Stripe pattern — INSERT into `pending_checkouts` (or a sibling `pending_razorpay_subscriptions`) keyed on `razorpay_subscription_id`, then verify in the webhook before crediting.

### SF-4 — Brihaspati Stripe webhook silently drops `payment_verified` flip
- **File:** `src/app/api/brihaspati/webhook/stripe/route.ts:55-60`
- **Severity:** P0
- **Evidence:**
  ```ts
  if (questionId) {
    await supabase
      .from('brihaspati_questions')
      .update({ payment_verified: true, provider: 'stripe' })
      .eq('id', questionId);
  }
  ```
- **Why it's a bug:** The update result is discarded. If this DB write fails (RLS, schema drift, transient), the webhook still ACKs 200 to Stripe. The brihaspati answer endpoint (`/api/brihaspati`) polls `payment_verified` for 12 seconds (`pollForPaymentVerified`); the user paid, the webhook returned success, but the flag never flipped → user sees "Awaiting payment confirmation" indefinitely AND Stripe will not retry. Money charged, no answer.
- **Proposed fix:** `const { error: flipErr } = await supabase.from('brihaspati_questions').update({...}).eq('id', questionId); if (flipErr) { console.error(...); return NextResponse.json({ error: 'Internal error' }, { status: 500 }); }` so Stripe retries.

### SF-5 — Brihaspati main answer endpoint loses status update + final write errors
- **File:** `src/app/api/brihaspati/route.ts:203-206`, `:288-307`
- **Severity:** P0
- **Evidence:**
  ```ts
  await supabase
    .from('brihaspati_questions')
    .update({ provider: providerUsed, status: 'streaming' })
    .eq('id', questionId);
  // … later …
  await supabase
    .from('brihaspati_questions')
    .update({
      answer: answer.narration.text, ..., payment_verified: true,
      status: 'completed', completed_at: new Date().toISOString(),
    })
    .eq('id', questionId);
  ```
- **Why it's a bug:** The final write at line 288 is the **only place** that flips `payment_verified=true` (sprint defers the verify-til-done per P2-16). If this update fails, the user got the streamed answer but the row stays `status='streaming'`, `payment_verified=false` → reconciliation jobs flag it for refund AND the user can't reopen the question. Silent because the controller has already enqueued `{ type: 'done' }` to the SSE stream — the client thinks it succeeded.
- **Proposed fix:** Capture both update errors. On the final write, if it fails, also enqueue an SSE `{ type: 'error', code: 'persistence_failed' }` event so the client knows the answer didn't durably save. Log loudly.

### SF-6 — Brihaspati `pollForPaymentVerified` ignores DB read error
- **File:** `src/app/api/brihaspati/route.ts:123-134`
- **Severity:** P1
- **Evidence:**
  ```ts
  async function pollForPaymentVerified(): Promise<boolean> {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const { data: fresh } = await db
        .from('brihaspati_questions')
        .select('payment_verified, provider')
        .eq('id', questionId)
        .single();
      if (fresh?.payment_verified === true) return true;
    }
    return false;
  }
  ```
- **Why it's a bug:** No `error` capture. If the DB read errors on every poll (network blip, RLS regression), every iteration sees `fresh === null` → loop ends, returns `false` → user gets bogus "Awaiting payment confirmation" 402 right after paying. No diagnostic.
- **Proposed fix:** Destructure `{ data, error }`; log on `error`; if errors persist for 3+ iterations, bail with a distinct error code so the client surfaces a real message.

### SF-7 — Brihaspati credit-manager `cancelSubscription` drops read error → silent no-op
- **File:** `src/lib/brihaspati/credits/credit-manager.ts:232-247`
- **Severity:** P1
- **Evidence:**
  ```ts
  export async function cancelSubscription(db: SupabaseLike, userId: string): Promise<void> {
    const { data } = await db
      .from('user_profiles')
      .select('brihaspati_subscription')
      .eq('id', userId)
      .maybeSingle();
    const cur = data?.brihaspati_subscription as SubscriptionState | null | undefined;
    if (!cur) return;
    // … update path …
  }
  ```
- **Why it's a bug:** Read failure → `data === null` → `cur === null` → silent early return. The downstream "subscription cancelled" UI message lies; the row was never touched. User keeps getting billed.
- **Proposed fix:** Destructure `{ data, error }`; throw on `error` so the API route returns 500 and the UI shows a real message.

### SF-8 — Brihaspati order route discards every payment_ref update error
- **File:** `src/app/api/brihaspati/order/route.ts:267-270`, `:290-293`
- **Severity:** P1
- **Evidence:**
  ```ts
  await supabase
    .from('brihaspati_questions')
    .update({ payment_ref: order.id })
    .eq('id', questionId);
  return NextResponse.json({ … });
  ```
- **Why it's a bug:** If this update fails, the question row has no `payment_ref` → the webhook handler can't find the binding row when payment lands → falls through to "no questionId" path silently. User pays, no answer is generated, no row is consumed. Mirrors SF-4.
- **Proposed fix:** Destructure `{ error }`; on error, refund/cancel the provider session (Razorpay subscription / Stripe Checkout) and return 500 to the client.

### SF-9 — Monthly-readings cron's insert discards error → loop reports success
- **File:** `src/app/api/cron/monthly-readings/route.ts:144-163`
- **Severity:** P1
- **Evidence:**
  ```ts
  await supabase.from('domain_readings').insert({ … });
  processed++;
  ```
- **Why it's a bug:** Supabase `.insert()` returns `{ error }` and does NOT throw — the surrounding `try/catch` is dead for DB failures. On a failed insert, `processed++` runs anyway. Next month's `domain-activations` cron compares this month's nonexistent reading with the previous one → no delta → no alert. Identical shape to the now-fixed `domain-activations` P0-14, missed in sprint 2 for the sibling cron.
- **Proposed fix:** `const { error } = await supabase…insert(…); if (error) { console.error('[monthly-readings] insert failed for', snap.user_id, error.message); errors++; continue; }`.

### SF-10 — Monthly-readings + life-events + user/readings use local-TZ month math
- **File:** `src/app/api/cron/monthly-readings/route.ts:143`, `src/app/api/user/readings/route.ts:91`
- **Severity:** P1
- **Evidence:**
  ```ts
  const readingMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
  ```
  Note line 85 of the cron correctly uses `now.getUTCFullYear()/getUTCMonth()` for the SELECT boundary — but line 143 uses local-TZ accessors for the INSERT key. The two will disagree at the month-end boundary on any non-UTC server (and Vercel does not contract UTC).
- **Why it's a bug:** Two-codepath drift (Lesson M). On Apr 30 23:59 UTC in a UTC+2 server, line 85 selects May 1 rows (UTC May 1 already started in local time as May 1 02:00) but line 143 writes `2026-05-01` … actually inverse — line 85 reads `2026-05` while local-TZ line 143 still says `2026-04`. Result: duplicate inserts (unique constraint violation → upsert fails on `(user_id, reading_month)`).
- **Proposed fix:** Use `now.getUTCFullYear()` + `now.getUTCMonth()` in line 143; same for `user/readings/route.ts:91`.

### SF-11 — `domain-activations` cron uses local-TZ month boundaries
- **File:** `src/app/api/cron/domain-activations/route.ts:74-75`
- **Severity:** P1
- **Evidence:**
  ```ts
  const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
  const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
  ```
- **Why it's a bug:** Lesson L. On a non-UTC server, the "last month" window slides by the server's UTC offset. The Vercel scheduler runs in UTC today but no contract guarantees that. At 00:30 UTC on the 1st of the month (when this cron triggers monthly), a UTC-4 server would still see `getMonth()` as the previous month → query reads the wrong month entirely.
- **Proposed fix:** Construct via `Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1)`.

### SF-12 — `email-alerts` cron uses local-TZ "today" boundary for dedup
- **File:** `src/app/api/cron/email-alerts/route.ts:84`
- **Severity:** P1
- **Evidence:**
  ```ts
  .gte('created_at', new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString())
  ```
- **Why it's a bug:** Local-TZ "start of today" used for a dedup query against `user_notifications.created_at` (timestamptz). On non-UTC servers the window can extend across midnight UTC, causing yesterday's notification to be missed by the dedup → duplicate "Antardasha ends in 30 days" email next day. Bombardment shape (May-20 incident).
- **Proposed fix:** `Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())`.

### SF-13 — `email-alerts` cron parses `cycleStart` ambiguously
- **File:** `src/app/api/cron/email-alerts/route.ts:152`
- **Severity:** P2
- **Evidence:** `const cycleStart = new Date(sadeSati.cycleStart + '-01-01');`
- **Why it's a bug:** `new Date('2024-01-01')` is parsed as UTC (ISO format), but `new Date('2024' + '-01-01')` — the same string — is also ISO. Confusingly OK, but if `cycleStart` is ever stored as `'24'` (2-digit year) or as `'YYYY-MM'` shape the parse changes silently. Brittle. Tag with a comment or build via `Date.UTC(year, 0, 1)`.
- **Proposed fix:** Explicit construction: `Date.UTC(Number(sadeSati.cycleStart), 0, 1)`.

### SF-14 — `generate-notifications` cron ignores existing-fetch error → dedup goes empty
- **File:** `src/app/api/cron/generate-notifications/route.ts:104-112`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: existing } = await supabase
    .from('user_notifications')
    .select('type, metadata')
    .eq('user_id', row.user_id)
    .gte('created_at', oneDayAgo);

  const existingKeys = new Set((existing || []).map(...));
  ```
- **Why it's a bug:** No `error` capture. On DB read failure, `existing` is `null`, `existingKeys` is empty → every potential notification re-inserts → cron re-pushes the same notifications + push every run = bombardment shape.
- **Proposed fix:** Destructure `{ data, error }`; on `error`, skip this user (`continue`) with a tagged log — better to miss one user's notifications than to re-push everyone.

### SF-15 — `transit-alerts` cron ignores existing-fetch error (same shape)
- **File:** `src/app/api/cron/transit-alerts/route.ts:139-144`
- **Severity:** P1
- **Evidence:** `const { data: existing } = await supabase.from('user_notifications').select('metadata').eq('user_id', snap.user_id).eq('type', 'transit_alert').gte('created_at', sevenDaysAgo);`
- **Why it's a bug:** Same fail-open dedup shape as SF-14. On any read failure → no dedup → weekly transit alert re-fires next run → push spam.
- **Proposed fix:** Same — destructure error, skip on error, log.

### SF-16 — `generate-notifications` cron's insert `if (!insertError)` swallows the alternative
- **File:** `src/app/api/cron/generate-notifications/route.ts:126-148`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { error: insertError } = await supabase.from('user_notifications').insert(toInsert);
  if (!insertError) {
    totalGenerated += toInsert.length;
    totalUsers++;
    // … push
  }
  // implicit else: no log, no skip flag, loop continues
  ```
- **Why it's a bug:** When `insertError` is set, the handler silently drops it — no log, no counter, no error response. Ops sees a successful run with low `usersNotified` but no signal that the DB rejected writes. Combined with SF-14 above, this cron can be silently dead for days.
- **Proposed fix:** `if (insertError) { console.error('[generate-notifications] insert failed for', row.user_id, ':', insertError.message); continue; }`.

### SF-17 — `daily-panchang` cron logs nothing on individual email send failure
- **File:** `src/app/api/cron/daily-panchang/route.ts:272-273`
- **Severity:** P2
- **Evidence:**
  ```ts
  const result = await sendEmail({ to: email, subject, html });
  if (result.success) sent++;
  else errors++;
  ```
- **Why it's a bug:** `result.error` is never read. The cron tallies `errors` but the only path to diagnose the underlying Resend failure (rate limit, invalid domain, bounce) is to crash an entire run with an exception. Hard outages get hidden as "we sent 3, errored 12 — why?"
- **Proposed fix:** `else { console.error('[daily-panchang] sendEmail failed for', email, ':', result.error); errors++; }`.

### SF-18 — `social-post` cron uses local-TZ for day-of-year computation
- **File:** `src/app/api/cron/social-post/route.ts:564`
- **Severity:** P2
- **Evidence:**
  ```ts
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  ```
- **Why it's a bug:** The `new Date(year, 0, 0)` constructor returns Dec 31 of previous year in **server-local TZ**. On non-UTC servers the resulting `dayOfYear` is off by ±1 → rotates the hashtag pool by a day → wrong content branch (English/Hindi swap at year-end). The public tweet goes out with the wrong fact for the day.
- **Proposed fix:** `Date.UTC(year, 0, 0)`.

### SF-19 — `family-synthesis` route uses local-TZ for "today" panchang
- **File:** `src/app/api/family-synthesis/route.ts:152-163`
- **Severity:** P1
- **Evidence:**
  ```ts
  const now = new Date();
  …
  const tzOffset = getUTCOffsetForDate(now.getFullYear(), now.getMonth() + 1, now.getDate(), timezone);
  const panchang = computePanchang({
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    …
  });
  ```
- **Why it's a bug:** The synthesizer needs the panchang **at the user's birth location** for the user's calendar day. Pulling year/month/day from server-local Date means: (a) a user querying late on May 23 in IST (UTC+5:30, server UTC) gets the May 23 UTC panchang while the user is in May 24 IST; (b) for a user in PST (server UTC), late May 22 PST gives the May 23 UTC panchang. Family transit overlays render against the wrong day.
- **Proposed fix:** Compute year/month/day from `now` formatted in the user's timezone via `Intl.DateTimeFormat(..., { timeZone: timezone })` (pattern already used in `daily-panchang` cron).

### SF-20 — `subscription-store.fetchSubscription` + `fetchUsage` ignore Supabase errors
- **File:** `src/stores/subscription-store.ts:71`, `:84-88`, `:131`, `:147-152`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: { session } } = await supabase.auth.getSession();   // line 71 / 131
  // …
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*').eq('user_id', user.id).maybeSingle();   // line 84-88
  if (!sub) { set({ tier: 'free', … }); return; }
  ```
- **Why it's a bug:** Symmetric to P0-9. On the server we now fail-loud (sprint 2), but the **client store** still demotes a paying user to `free` on any DB blip. The PaywallGate, AdUnit, pricing badge, and Brihaspati panel all read from this store → Pro user briefly sees ads + paywall + Brihaspati credit count of 0.
- **Proposed fix:** Destructure `{ data, error }`; on `error` keep the previous tier (don't overwrite), log with a tag.

### SF-21 — `auth-store.initialize` discards `getSession` error
- **File:** `src/stores/auth-store.ts:144-149`
- **Severity:** P1
- **Evidence:** `const { data } = await supabase.auth.getSession(); set({ session: data.session, user: data.session?.user ?? null, initialized: true });`
- **Why it's a bug:** No `error` capture. If `getSession()` fails (network blip, JWT decode error), the user is treated as signed-out → every UserMenu / dashboard / saved-charts page hides their data. No log, no retry signal. Silent sign-out indistinguishable from real sign-out.
- **Proposed fix:** `const { data, error } = await supabase.auth.getSession(); if (error) console.error('[auth-store] getSession failed:', error.message);` — keep `initialized: true` to terminate loading but consider not clearing user state on error.

### SF-22 — `auth-store.signOut` discards Supabase signOut error
- **File:** `src/stores/auth-store.ts:223`
- **Severity:** P2
- **Evidence:** `if (supabase) await supabase.auth.signOut();`
- **Why it's a bug:** No error capture. If signOut fails (network), the in-memory state still clears via the line below — but the session cookie/localStorage may still be valid on the server. Next page reload re-hydrates the previous user. User clicks "sign out," tab refreshes, still signed in.
- **Proposed fix:** Capture + log; on error, attempt to clear the auth storage key manually (`localStorage.removeItem('dekho-panchang-auth')`).

### SF-23 — Auth callback double-tap silent failures + Lesson E setTimeout
- **File:** `src/app/[locale]/auth/callback/page.tsx:29`, `:31`, `:51`
- **Severity:** P2
- **Evidence:**
  ```ts
  await new Promise(r => setTimeout(r, 500));
  const { data } = await supabase.auth.getSession();    // line 31, no error capture
  …
  supabase.auth.getSession().then(({ data }) => {       // line 51, same
    if (data.session) handleAuth();
  });
  ```
- **Why it's a bug:** Three defects in one effect: (a) hardcoded 500ms wait substitutes for a real readiness signal (P1-16 from prior audit; setTimeout was kept), (b) `getSession()` ignores error on both call sites — a failed session lookup is indistinguishable from "no session" → user sees "Something went wrong" 8s later with no diagnostic, (c) the `.then()` without `.catch()` on line 51-53 → any thrown rejection becomes an unhandled-rejection event.
- **Proposed fix:** Replace setTimeout with awaiting the `onAuthStateChange` SIGNED_IN event (already registered above). Destructure error on both `getSession()` calls.

### SF-24 — Push subscription DELETE ignores Supabase error → "success" without delete
- **File:** `src/app/api/push/subscribe/route.ts:106-110`
- **Severity:** P2
- **Evidence:**
  ```ts
  await supabaseAdmin
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint);
  return NextResponse.json({ success: true });
  ```
- **Why it's a bug:** The delete result is discarded. On RLS denial or transient failure, response says `success: true` but the row stays → device keeps receiving pushes the user thinks they unsubscribed from. The send-push reactive cleanup (`send-push.ts:96-101`) only fires on 410/404; for a subscription the user actively rejected, that doesn't trigger.
- **Proposed fix:** `const { error } = await … delete(…); if (error) { console.error(…); return NextResponse.json({ error: 'Unsubscribe failed' }, { status: 500 }); }`.

### SF-25 — `send-push.ts` swallows non-410/404 errors AND the cleanup delete
- **File:** `src/lib/push/send-push.ts:66-69`, `:92-101`, `:121-128`
- **Severity:** P2
- **Evidence:**
  ```ts
  const { data: subscriptions } = await supabaseAdmin
    .from('push_subscriptions').select(...)
    .eq('user_id', userId);
  // …
  } catch (err: unknown) {
    failed++;
    const statusCode = (err as { statusCode?: number })?.statusCode;
    if (statusCode === 410 || statusCode === 404) {
      await supabaseAdmin.from('push_subscriptions').delete().eq('id', sub.id);
      // ↑ delete error ignored
    }
    // ↑ all non-410/404 errors (e.g. WebPushError 400, network, payload-too-big)
    //   are logged only via `failed++` — no console.error
  }
  ```
  Line 121: `await Promise.all(batch.map(uid => sendPushToUser(uid, payload)))` — if any user's send rejects, the entire batch breaks.
- **Why it's a bug:** Three sub-defects: (a) subscription read error is silent → "no subscriptions" returned, push never sent; (b) catch block runs for every non-cleanup error path without `console.error` — observability blind spot; (c) `Promise.all` should be `Promise.allSettled` so one user's failure doesn't take down the whole batch.
- **Proposed fix:** Destructure subscriptions read error; add `else { console.error('[send-push] send failed for', sub.endpoint, ':', err); }` after the 410/404 branch; swap `Promise.all` → `Promise.allSettled` in the batch path.

### SF-26 — Notifications GET `unreadCount` query ignores error
- **File:** `src/app/api/notifications/route.ts:45-51`
- **Severity:** P2
- **Evidence:**
  ```ts
  const { count } = await supabase
    .from('user_notifications')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('read', false);
  return NextResponse.json({ notifications: notifications || [], unreadCount: count || 0 });
  ```
- **Why it's a bug:** No `error` capture. If this query errors after the first one succeeded, `count` is undefined → returned as 0 → the bell-icon badge disappears even when unread notifications exist. Notification list renders correctly, but the visual signal that pulls users into the bell is gone.
- **Proposed fix:** `const { count, error } = …; if (error) console.error('[notifications] count failed:', error.message);` and keep the prior value or return 500.

### SF-27 — `NotificationBell` swallows fetch errors completely
- **File:** `src/components/notifications/NotificationBell.tsx:76`, `:80-82`
- **Severity:** P2
- **Evidence:**
  ```ts
  if (!res.ok) return;
  // …
  } catch {
    // Silently fail  –  non-critical UI feature
  }
  ```
- **Why it's a bug:** Notifications are the only path for transit alerts, dasha transitions, sade-sati onset reminders. "Non-critical UI feature" is the wrong framing — if the bell is silently broken for a paid user, they lose the entire push-equivalent in-app channel. No log either: ops cannot detect when notifications are broken across the user base.
- **Proposed fix:** Add `console.error('[NotificationBell] /api/notifications', res.status)` on `!res.ok`; tagged `console.error` in the catch.

### SF-28 — `user/profile` GET swallows snapshot fetch error
- **File:** `src/app/api/user/profile/route.ts:41-45`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: snapshot } = await supabase
    .from('kundali_snapshots')
    .select(...)
    .eq('user_id', user.id)
    .single();
  ```
- **Why it's a bug:** No `error` capture. A signed-in user with a valid kundali sees a blank dashboard because the snapshot fetch hit a blip → returns `snapshot: null` → frontend renders "no birth chart yet" with a CTA to compute (which the user already did). PII / data confusion shape.
- **Proposed fix:** Destructure error; on error other than PGRST116, return 500 so the client shows a real error message instead of empty state.

### SF-29 — `user/profile` auto-recompute upsert + re-fetch errors silently lost
- **File:** `src/app/api/user/profile/route.ts:145-163`, `:166-170`
- **Severity:** P1
- **Evidence:**
  ```ts
  await supabase.from('kundali_snapshots').upsert({…}, { onConflict: 'user_id' });
  const { data: freshSnap } = await supabase.from('kundali_snapshots').select(…).single();
  if (freshSnap) return NextResponse.json({ profile, snapshot: freshSnap, …, recomputed: true });
  ```
- **Why it's a bug:** The upsert error is discarded entirely. The re-fetch error is also discarded. If either fails, the response either returns the stale snapshot tagged `recomputed: true` (a lie) OR falls through to the bottom of GET and returns the stale `snapshotEnriched`. The client trusts `recomputed: true` to bust its cache and now renders confidently wrong data.
- **Proposed fix:** Capture both errors. On upsert error, log and skip the re-fetch — return stale with `recomputed: false`. On re-fetch error, log and return stale.

### SF-30 — `user/profile` POST fire-and-forget welcomeEmail loses delivery
- **File:** `src/app/api/user/profile/route.ts:382-386`
- **Severity:** P2
- **Evidence:**
  ```ts
  sendEmail({ to: user.email, ...email }).catch((err) => {
    console.error('[user/profile] welcome email send failed (claim already set):', err);
  });
  ```
- **Why it's a bug:** No `await`. On Vercel Functions, fire-and-forget promises after the response returns can be killed before the network call completes. The `welcome_email_sent_at` claim is committed (line 366-371) *before* the fire-and-forget — so when the email never goes out, there's no retry, and ops see only an intermittent `.catch` log when the function happened to live long enough. Welcome email is part of the activation funnel.
- **Proposed fix:** Either `await` the send (delays the response by ~300ms — acceptable) or use `waitUntil(sendEmail(...))` from `@vercel/functions` so the runtime keeps the function alive until completion.

### SF-31 — `DailyEmailOptIn` overwrites notification_prefs with `{}` on existing-fetch error
- **File:** `src/components/dashboard/DailyEmailOptIn.tsx:81-89`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: existing } = await supabase.from('user_profiles')
    .select('notification_prefs').eq('id', user.id).single();
  const currentPrefs = (existing?.notification_prefs as Record<string, boolean> | null) ?? {};
  const { error } = await supabase
    .from('user_profiles')
    .update({
      daily_panchang_email: true,
      notification_prefs: { ...currentPrefs, daily_panchang: true },
    })
    .eq('id', user.id);
  ```
- **Why it's a bug:** No error capture on the read. On a DB blip, `existing === null` → `currentPrefs = {}` → the update overwrites the entire `notification_prefs` jsonb column with `{ daily_panchang: true }` — wiping the user's preferences for weekly digest, sade-sati alerts, dasha transition emails, transit alerts etc. Silent destruction of preferences. The user opted in to ONE thing and lost all their other settings.
- **Proposed fix:** Destructure error; on error abort the update with a toast — never proceed with a destructive write when the prerequisite read failed.

### SF-32 — `UserMenu` profile-check treats any error as "no profile" → re-opens onboarding modal
- **File:** `src/components/auth/UserMenu.tsx:40-53`
- **Severity:** P2
- **Evidence:**
  ```ts
  supabase.from('user_profiles')
    .select('date_of_birth, onboarding_completed')
    .eq('id', user.id)
    .maybeSingle()
    .then(({ data, error }) => {
      setProfileChecked(true);
      if (error || !data) {
        setShowOnboarding(true);
      } else if (!data.date_of_birth && !data.onboarding_completed) {
        setShowOnboarding(true);
      }
    });
  ```
- **Why it's a bug:** A user with a complete profile, on a transient DB error, sees the full OnboardingModal pop up — looks like a regression to them. No log, no retry. The `.then(…)` without `.catch()` means a thrown network rejection becomes an unhandled-rejection event.
- **Proposed fix:** On `error`, log and don't change `showOnboarding`. Treat error as "we don't know" not "no profile."

### SF-33 — `OnboardingModal` skip-save discards upsert error → onComplete() runs anyway
- **File:** `src/components/auth/OnboardingModal.tsx:391-396`, `:403`
- **Severity:** P2
- **Evidence:**
  ```ts
  await supabase.from('user_profiles').upsert({
    id: user.id, display_name: fullName.trim(),
    experience_level: experienceLevel, onboarding_completed: false,
  }, { onConflict: 'id' });
  …
  onComplete();
  ```
- **Why it's a bug:** Supabase doesn't throw on DB error — the surrounding try/catch only catches getSupabase() / await throws, not the DB write. If the upsert fails (RLS, schema drift), the modal still closes via `onComplete()` and the user thinks their name + experience level saved. On next session the modal re-appears with blank fields.
- **Proposed fix:** Destructure `{ error }`; if error, surface a toast and don't call `onComplete()`.

### SF-34 — `FestivalCountdown` swallows fetch errors → empty state with no diagnostic
- **File:** `src/components/dashboard/FestivalCountdown.tsx:170`, `:173-175`
- **Severity:** P2
- **Evidence:**
  ```ts
  const res = await fetch(`/api/calendar?${params}`);
  if (!res.ok) return [];
  …
  } catch {
    return [];
  }
  ```
- **Why it's a bug:** When `/api/calendar` breaks, the dashboard FestivalCountdown shows "no upcoming festivals." That's identical to the legitimate "user is in a quiet stretch" state — ops cannot distinguish. The user just thinks Diwali isn't happening.
- **Proposed fix:** Tagged log on both branches; render a small "Festivals unavailable" pill when the fetch fails so the user sees a signal.

### SF-35 — `panchang/yearly` empty `.catch(() => {})` per-day fetch
- **File:** `src/app/[locale]/panchang/yearly/page.tsx:57`
- **Severity:** P2
- **Evidence:**
  ```ts
  batch.push(
    fetch(`/api/panchang?date=${dateStr}`).then(r => r.json()).then(p => {
      data[dateStr] = { date: dateStr, tithi: p.tithi, nakshatra: p.nakshatra };
    }).catch(() => {})
  );
  ```
- **Why it's a bug:** Banned pattern (rule §1). If 3 of 31 days fail, the grid shows those days with blank cells and no indication. Likely root cause is silent already (rate-limit kicks in on yearly view), making it look like "those days have no data."
- **Proposed fix:** `.catch(err => console.error('[yearly] day fetch failed:', dateStr, err))`.

### SF-36 — `calendar/[slug]` empty arrow catch on lookupEkadashiAction
- **File:** `src/app/[locale]/calendar/[slug]/page.tsx:168`
- **Severity:** P3
- **Evidence:** `).catch(() => {});`
- **Why it's a bug:** Banned pattern. If the dynamic import or the action throws (network blip, server-action 500), the parana date silently stays null and the Ekadashi detail page renders without parana times. No log.
- **Proposed fix:** `.catch(err => console.error('[calendar] lookupEkadashiAction failed:', err))`.

### SF-37 — `matching/Client.tsx` empty catch on action call
- **File:** `src/app/[locale]/matching/Client.tsx:88`
- **Severity:** P2
- **Evidence:** `} catch { return null; }`
- **Why it's a bug:** Banned pattern. `computeBirthSignsAction` failure (network, action 500) returns null silently → the partner's chart shows blank without an error message. User thinks the partner's data is invalid when it's actually the server.
- **Proposed fix:** `catch (err) { console.error('[matching] computeBirthSignsAction failed:', err); return null; }` plus surface a toast in the consumer.

### SF-38 — `personalized-horoscope` falls back to server-local date when client omits date
- **File:** `src/app/api/horoscope/personalized/route.ts:132-137`
- **Severity:** P2
- **Evidence:**
  ```ts
  } else {
    const now = new Date();
    year = now.getFullYear();
    month = now.getMonth() + 1;
    day = now.getDate();
  }
  ```
- **Why it's a bug:** Lesson L. Client may omit `date` and rely on "today" — but "today" should be the user's calendar day at their timezone, not the server's. A user at 23:30 IST gets the next day's horoscope on a UTC server.
- **Proposed fix:** Use `Intl.DateTimeFormat('en-CA', { timeZone: timezone })` with the request's timezone to compute the date components.

### SF-39 — `getFreshSnapshot.recomputeSnapshotDirect` swallows profile-fetch error
- **File:** `src/lib/supabase/get-fresh-snapshot.ts:99-107`
- **Severity:** P1
- **Evidence:**
  ```ts
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('date_of_birth, time_of_birth, birth_place, birth_lat, birth_lng')
    .eq('id', userId).single();
  if (!profile?.date_of_birth || profile?.birth_lat == null || profile?.birth_lng == null) {
    return null; // No birth data — can't recompute
  }
  ```
- **Why it's a bug:** No `error` capture. On DB blip → `profile === null` → falsy → returns null silently → caller logs `'Could not recompute for ${userId}'` (which means "no birth data") even though the user has birth data and it was a transient error. After an engine version bump, every cron that touches stale snapshots will misreport this until the blip clears.
- **Proposed fix:** Destructure `{ data, error }`; distinguish "no birth data" from "couldn't read profile" — return distinct sentinel + log.

### SF-40 — `auth-store.signInWithEmail` doesn't `finally { setLoading(false) }`
- **File:** `src/stores/auth-store.ts:152-159`
- **Severity:** P2 (regression check — P1-8 from prior audit may have been missed)
- **Evidence:**
  ```ts
  signInWithEmail: async (email, password) => {
    const supabase = getSupabase();
    if (!supabase) return { error: 'Auth not configured' };
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });
    return error ? { error: error.message } : {};
  }
  ```
- **Why it's a bug:** If `signInWithPassword` throws (network, JSON parse on opaque error), `loading: false` is never reached → button stays spinning until the user navigates away. Prior audit (P1-8) flagged this — not visibly fixed.
- **Proposed fix:** Wrap in try/finally. (Note: `signInWithPassword` doesn't throw on auth failure, but it can throw on network — that's the path that hangs the button.)

---

## Cross-cutting themes

1. **Razorpay was left behind by every webhook hardening sprint.** P0-3, P0-4, P0-5, P0-6 all closed the Stripe holes; the Razorpay analogues (SF-1, SF-2, SF-3) survived. Whoever ports next must do a side-by-side diff of `webhooks/stripe/route.ts` and `webhooks/razorpay/route.ts` and bring every defensive pattern across. INR-paying users are second-class citizens for payment integrity today.

2. **Supabase `.upsert/.update/.delete/.insert` returning `{ error }` (not throwing) is the most common silent-failure shape.** SF-1, SF-4, SF-5, SF-8, SF-9, SF-24, SF-29, SF-31, SF-33 are all this pattern. The codebase needs a lint rule or a wrapper helper `supabaseExec(query)` that throws on `{ error }` so the existing try/catch blocks actually catch DB failures.

3. **`{ data } = await supabase…` without `{ error }` lives in the client stores AND many API routes that didn't get prior-audit attention.** Sprint 2 fixed `getUserTier`, `checkAndIncrementUsage`, `api-gate.extractUserId` — the subscription-store, auth-store, profile-check effects, send-push admin reads, and the welcome-email opt-in still drop errors. Symmetric to P0-9 but client-side.

4. **Lesson L (`new Date(year, m, d).getMonth()`) is still pervasive in cron handlers.** SF-10, SF-11, SF-12, SF-13, SF-18, SF-19, SF-38 all derive month/day boundaries from local-TZ Date accessors. Sprint 14 fixed the `lib/` libraries but the route handlers still leak server TZ. Highest-impact instance is SF-12 because dedup-anchor drift IS the May-20 bombardment shape.

5. **Dedup-anchor reads fail open in three crons.** `generate-notifications` (SF-14), `transit-alerts` (SF-15), and analogous shape in `email-alerts` line 79 all build a dedup `Set` from a query whose error is silently swallowed → empty set → every potential alert re-fires next run. This is the structural cousin of the welcome-email bombardment: read the dedup anchor, fall open on error, re-act. A single helper `readDedupAnchor(query)` that throws on error would close all three.

6. **Fire-and-forget after-response in Vercel Functions is unreliable.** SF-30 (`sendEmail(...).catch(...)`) commits a side effect (the claim row) before launching the email. Anywhere we depend on a post-response async, we need either `await` or `waitUntil`. Worth grepping `\)\.catch\(.*=>.*console` post-response for similar patterns.

7. **"Non-critical UI feature" framing in NotificationBell + FestivalCountdown is wrong.** When the only signal that something is broken is "the user reports they didn't see X," ops cannot detect failures. Even non-critical features need tagged logs. SF-27 + SF-34 are the visible instances; the rule applies to every component that fetches.

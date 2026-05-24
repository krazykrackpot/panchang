# Bug Hunt — 2026-05-24 — Section 03: Security & Auth

Scope: Auth, security, RLS, secrets, input validation, surface area. Round-2 audit at HEAD `500fd998`. Already-closed items from round 1 (domain_readings RLS, SW per-user keying, Stripe pending_checkouts binding, CSRF gate, IP rate-limit rightmost-hop, OAuth client pin, replay-safe `auth.users` triggers, /api/tippanni auth + server snapshot, /api/llm chart from server snapshot) are NOT re-reported.

---

### SEC-1 — Brihaspati Stripe webhook trusts attacker-influenceable `metadata.user_id`
- **File:** `src/app/api/brihaspati/webhook/stripe/route.ts:46-69`
- **Severity:** P0
- **Evidence:**
  ```ts
  const userId = obj.metadata.user_id;
  const questionId = obj.metadata.question_id;
  const tier = obj.metadata.tier;
  if (!userId || !tier) { return NextResponse.json({ received: true }); }
  switch (event.type) {
    case 'checkout.session.completed': {
      if (questionId) {
        await supabase.from('brihaspati_questions')
          .update({ payment_verified: true, provider: 'stripe' })
          .eq('id', questionId); // ← no .eq('user_id', userId)
      }
      if (tier === 'pack_5' && obj.id) { await grantCredits(... userId ...); }
      if (tier === 'monthly' || tier === 'annual') { await setSubscription(... userId ...); }
  ```
- **Why it's a bug:** Identical shape to the main-webhook P0-5 that was already hardened with `pending_checkouts`. The Brihaspati flow never received the same fix — `userId` and `questionId` come straight from session metadata, with no DB-bound `pending_checkouts` row or cross-check against `brihaspati_questions.user_id`. An attacker who controls a Stripe customer can create a session whose metadata names a victim's `user_id` + a victim's `question_id`, and the webhook silently credits the victim's subscription / flips their question to `payment_verified=true` (allowing the attacker — or the victim, mis-attributed — to consume the answer). Webhook signature alone doesn't help: the attacker signs their own request to their own Stripe account.
- **Proposed fix:** Mirror the main webhook: persist a `pending_brihaspati_orders` row at `/api/brihaspati/order` bound to `(session_id, user_id, question_id, tier)`, and require an exact match in the webhook before crediting. Belt-and-braces: also `.eq('user_id', userId)` on the question update.

### SEC-2 — Brihaspati Razorpay webhook trusts `notes.user_id`, no pending-row binding
- **File:** `src/app/api/brihaspati/webhook/razorpay/route.ts:65-95`
- **Severity:** P0
- **Evidence:**
  ```ts
  case 'payment.captured': {
    const ent = event.payload?.payment?.entity;
    const userId = ent.notes?.user_id;
    const questionId = ent.notes?.question_id;
    const tier = ent.notes?.tier;
    ...
    await supabase.from('brihaspati_questions')
      .update({ payment_verified: true, provider: 'razorpay' })
      .eq('id', questionId);
    if (tier === 'pack_5') { await grantCredits(... userId ...); }
  ```
- **Why it's a bug:** Same defect as SEC-1, applied to Razorpay. `notes.user_id`, `notes.question_id`, `notes.tier` flow into ledger writes and credit grants with no cross-check that they originated from this user's order. Razorpay webhook signature only proves "this came from Razorpay" — it does not bind the captured payment to any particular Panchang user.
- **Proposed fix:** Same pattern — bind at `/api/brihaspati/order` and verify the binding in the webhook.

### SEC-3 — Main Razorpay webhook trusts `notes.user_id`, no event-id idempotency
- **File:** `src/app/api/webhooks/razorpay/route.ts:50-117`
- **Severity:** P0
- **Evidence:**
  ```ts
  const entity = data.payload.subscription.entity;
  const userId = entity.notes?.user_id;
  const tier = entity.notes?.tier;
  ...
  case 'subscription.activated': {
    await supabase.from('subscriptions').upsert({
      user_id: userId, tier: tier || 'pro', ...
    }, { onConflict: 'user_id' });
  ```
  No `brihaspati_webhook_events`/`processed_webhook_events` insert, no `x-razorpay-event-id` dedup. No timestamp window check on the signature.
- **Why it's a bug:** Twin of SEC-1/SEC-2 plus replay vulnerability. Same user_id spoofing surface; plus replayed `subscription.activated` (3-day Razorpay retry window) can resurrect a cancelled subscription because there's no event-id ledger like the main Stripe handler now has. The audit's P0-6 originally targeted brihaspati's razorpay webhook, but the main `/api/webhooks/razorpay/route.ts` was overlooked and remains unguarded.
- **Proposed fix:** Reuse `processed_webhook_events` with `provider='razorpay'`; key dedup on `x-razorpay-event-id`. Add `pending_checkouts`-style binding written by `/api/checkout`'s INR branch (currently the INR branch creates the subscription with notes but does NOT write a binding row).

### SEC-4 — `/api/checkout` INR (Razorpay) branch never writes `pending_checkouts`
- **File:** `src/app/api/checkout/route.ts:129-159`
- **Severity:** P0
- **Evidence:**
  ```ts
  if (currency === 'INR') {
    ...
    const subscription = await razorpay.subscriptions.create({
      plan_id: planId, total_count: ..., notes: { user_id: user.id, tier },
    });
    return NextResponse.json({ url: subscription.short_url });
    // No pending_checkouts insert. The USD branch above writes a binding row;
    // this one returns without persisting any audit/binding.
  }
  ```
- **Why it's a bug:** The USD/Stripe branch was hardened (P0-5) with a `pending_checkouts` row that the main Stripe webhook now requires. The INR/Razorpay branch was not — so even after porting the verification logic into the main Razorpay webhook (SEC-3), there's no binding row to check against. The metadata-spoof attack stays open until both ends are wired.
- **Proposed fix:** Persist a `pending_checkouts` row with `provider='razorpay'`, `provider_subscription_id=subscription.id`, `user_id`, `tier` at INR checkout-create time. Extend the table or add a sibling.

### SEC-5 — User can self-write arbitrary domain scores via POST /api/user/readings
- **File:** `src/app/api/user/readings/route.ts:42-137`
- **Severity:** P1
- **Evidence:** The route accepts a free-form `{ scores: { health: number, wealth: number, ... } }` and upserts into `domain_readings` with `user_id = auth.uid()`. No range validation (`scores.health` could be `-999` or `1e9`), no enum check on `triggerEvent`, no rate-limit. Intended writers are the cron `monthly-readings` + `domain-activations` jobs.
- **Why it's a bug:** Not cross-user (the user_id is auth-bound), but a user can poison their OWN history with arbitrary "improvement" or "regression" rows, which feed into downstream "improved since last reading" deltas in cron `domain-activations` and the `/api/user/readings` GET that drives the dashboard timeline. Worse: combined with the cron's "notify on +N change" logic, an attacker can mint synthetic deltas to trigger their own push notifications (engagement-spam at no cost, push-quota burn, support volume). Severity rises if these scores ever surface in any aggregate or comparative UI.
- **Proposed fix:** Clamp every score to `[0, 100]`; reject if cron-only (require service-role / cron path); validate `triggerEvent` against a whitelist; tag client-written rows with `source='user'` so the cron can differentiate.

### SEC-6 — `/api/calendar/export` leaks `String(err)` to client
- **File:** `src/app/api/calendar/export/route.ts:184-186`
- **Severity:** P2
- **Evidence:**
  ```ts
  return NextResponse.json(
    { error: 'Failed to generate calendar export: ' + String(err) },
    { status: 500 }
  );
  ```
- **Why it's a bug:** `String(err)` on a typical Node Error renders `Error: <message>\n  at <file>:<line>` — leaking source paths, function names, and downstream DB error text. The sibling routes were hardened during sprint-12 (P2-19); this one was missed despite being on the listed targets.
- **Proposed fix:** Replace with `'Failed to generate calendar export'`. Keep the detail in `console.error` only.

### SEC-7 — `/api/muhurta-scan` and `/api/caesarean-scan` leak `err.message` to client
- **File:** `src/app/api/muhurta-scan/route.ts:449-453` and `src/app/api/caesarean-scan/route.ts:191-195`
- **Severity:** P2
- **Evidence:**
  ```ts
  } catch (err: unknown) {
    console.error('[muhurta-scan] Scan failed:', err);
    const message = err instanceof Error ? err.message : 'Muhurta scan failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
  ```
  Identical shape in caesarean-scan.
- **Why it's a bug:** Same class as SEC-6. `err.message` from `generateKundali` / panchang code reveals coordinate math, file references, and module-internal validation strings. Audit P2-37 / P2-38 listed both for hardening; only the catch-and-log half landed.
- **Proposed fix:** Return a constant string; preserve detail in `console.error`.

### SEC-8 — `/api/festival-compare` accepts arbitrary year/lat/lon, no rate limit, no auth
- **File:** `src/app/api/festival-compare/route.ts:9-62`
- **Severity:** P2
- **Evidence:** GET handler with no `checkRateLimit`, no auth. Runs `generateFestivalCalendar(year, lat, lon, tz)` + V2 — both year-scale loops with panchang/Astronomy compute inside. Any year integer accepted (no range gate). No `Cache-Control: private` because `lat`/`lon`/`timezone` are user-supplied so caching at the edge could leak across users.
- **Why it's a bug:** Unauthenticated CPU-burn DoS vector parallel to the one fixed in `/api/transit-replay` (sprint commit `6b56f8b8`). A bot looping `year=99999&lat=0&lon=0&timezone=UTC` melts a Vercel function instance for free. Existence-check this against the transit-replay precedent.
- **Proposed fix:** Add IP rate-limit (e.g. 10/min); validate `year` ∈ [1900, 2100]; clamp `lat`/`lon` to canonical ranges; require a valid IANA timezone.

### SEC-9 — `/api/ganda-mool`, `/api/mundane/conjunctions` lack rate-limit
- **File:** `src/app/api/ganda-mool/route.ts:4-29`, `src/app/api/mundane/conjunctions/route.ts:12-40`
- **Severity:** P3
- **Evidence:** Both export unauth GET handlers with no `checkRateLimit`. `ganda-mool` computes a full-year panchang scan inside `computeGandaMoolDates`; `mundane/conjunctions` is cheap (precomputed table) but still a public endpoint.
- **Why it's a bug:** Lower-cost than SEC-8 but identical pattern. `ganda-mool` will keep the Lambda warm under sustained probing; mundane/conjunctions is mostly informational. Defense-in-depth — all unauth API GETs should be rate-limited by default.
- **Proposed fix:** Add `checkRateLimit(getClientIP(req), { maxRequests: 30, windowMs: 60000 })` at the top of each.

### SEC-10 — `/api/checkout` returns the Stripe session URL with no `Cache-Control: private, no-store`
- **File:** `src/app/api/checkout/route.ts:90-127`
- **Severity:** P2
- **Evidence:** `return NextResponse.json({ url: session.url });` — no cache headers set. Service worker's AUTH_PREFIXES includes `/api/checkout` (already P0-3 fixed), but no upstream CDN/edge cache-bypass header is asserted on the response.
- **Why it's a bug:** Defense-in-depth. If any CDN/proxy is added between Vercel and the browser (Cloudflare worker, hardware appliance, shared mobile cache), a missing `Cache-Control` could let a second user see the previous user's `session.url` — a one-time-use checkout URL but pre-payment it's still a session lifetime window. Same class for `/api/brihaspati/order`'s 200 response and similar.
- **Proposed fix:** Add `headers: { 'Cache-Control': 'private, no-store' }` to every authenticated state-changing JSON response.

### SEC-11 — Service worker doesn't wipe `CA` cache on sign-out
- **File:** `public/sw.js:23-37, 220-260` (no `SIGNED_OUT` / message handler that clears `CA`)
- **Severity:** P2
- **Evidence:** The SW now bypasses cache for `AUTH_PREFIXES` (P0-3 fixed), but `/api/notifications` etc. were previously cached by previous SW versions, and the existing `CA` cache name is not wiped on a sign-out signal. The auth-store's `clearPersistedUserData` clears `localStorage` but never `postMessage`s the SW to drop `caches.delete('dp-v6-api')`.
- **Why it's a bug:** Latent — only matters for users who upgraded from a pre-P0-3 SW (v4/v5) and still have stale cross-user API responses in their `dp-v6-api` cache. The `activate` event prunes caches whose name doesn't match the current version set, so `dp-v5-api` will be deleted on v6 activate — but if a user signs out without reloading (rare), the current-version `CA` cache could still hold their pre-sign-out data when the next user signs in.
- **Proposed fix:** From `signOut`, `postMessage` the SW with `{ type: 'CLEAR_AUTH_CACHE' }`; SW handles by deleting `caches.delete(CA)`. Also wipe `CA` on every `userChanged` transition in the auth-store callback.

### SEC-12 — WhatsApp GET verify_token comparison uses `===` (not constant-time)
- **File:** `src/app/api/whatsapp/route.ts:74-86`
- **Severity:** P2
- **Evidence:**
  ```ts
  export async function GET(request: Request) {
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');
    if (mode === 'subscribe' && token === VERIFY_TOKEN) { ... }
  ```
- **Why it's a bug:** Compares the verify-token via JavaScript `===`. Native string equality short-circuits on first mismatch, leaking the prefix length through timing analysis. Used only at webhook-registration time (so the attack surface is bounded to a setup window), but it's the same class of bug as everything else in this codebase already uses `timingSafeEqual` for (Stripe webhook, cron auth, Razorpay payment signature). Inconsistent posture is itself a smell.
- **Proposed fix:** SHA-256 both sides → `timingSafeEqual(authHash, expectedHash)` (mirror `verifyCronAuth`).

### SEC-13 — `getClientIP` no longer trims hops or filters obvious garbage
- **File:** `src/lib/api/rate-limit.ts:77-86`
- **Severity:** P2
- **Evidence:**
  ```ts
  export function getClientIP(request: Request): string {
    const realIp = request.headers.get('x-real-ip')?.trim();
    if (realIp) return realIp;
    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) {
      const hops = forwarded.split(',').map(h => h.trim()).filter(Boolean);
      if (hops.length > 0) return hops[hops.length - 1];
    }
    return '127.0.0.1';
  }
  ```
- **Why it's a bug:** `x-real-ip` on Vercel is server-set and trusted, but on any non-Vercel proxy (Coolify/Hetzner per the migration plan), `x-real-ip` is whatever the immediate hop sets — and a single misconfigured upstream lets a client forge it. The fallback rightmost `x-forwarded-for` hop is correct on Vercel, but the function returns `x-real-ip` unconditionally first. The audit comment in the file says "Vercel-set" — but the function will be reused as-is when Hetzner ships and quietly become spoofable. Also no preference for `x-vercel-forwarded-for` (the Vercel-specific trusted header).
- **Proposed fix:** Prefer `x-vercel-forwarded-for` (rightmost hop) when present; only then `x-real-ip`; document the proxy assumption at the call site. Reject obviously-malformed IPs (length cap, basic regex).

### SEC-14 — User profile DELETE uses error-message string matching to skip non-existent tables
- **File:** `src/app/api/user/profile/route.ts:440-454`
- **Severity:** P2
- **Evidence:**
  ```ts
  for (const table of [...]) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId);
    if (error && !error.message.includes('does not exist')) {
      failedTables.push(table);
    }
  }
  ```
- **Why it's a bug:** Relies on PostgreSQL error message text — not the error code. If Supabase / PostgREST changes the wording (e.g. "relation … does not exist" → "table … not found") the deletion silently fails: the GDPR-mandated row deletion would NOT happen but the code would log success because it caught the "missing table" path with the wrong fingerprint. Code-string matching against natural-language error messages is brittle.
- **Proposed fix:** Switch to `error.code === '42P01'` (undefined_table). Better: maintain a static manifest of guaranteed-present tables and treat any error as fatal.

### SEC-15 — Subscription POST cancel: provider call failure leaves DB row in inconsistent state
- **File:** `src/app/api/subscription/route.ts:83-122`
- **Severity:** P2
- **Evidence:**
  ```ts
  await supabase.from('subscriptions').update({ cancel_at_period_end: true, ... });
  // ... then ...
  if (subscription.provider === 'stripe' ...) {
    try { await stripe.subscriptions.update(... { cancel_at_period_end: true }); }
    catch (providerErr) { console.error('Failed to cancel with Stripe:', providerErr); }
  }
  ```
  Same pattern for Razorpay.
- **Why it's a bug:** The DB is marked `cancel_at_period_end=true` BEFORE the provider call. If the Stripe/Razorpay call fails (rate-limit, transient), the DB shows the user as cancelling but the provider keeps billing them next period — and the next webhook (`invoice.paid`) re-activates the row to `status='active'`, ping-ponging. Worse, the user sees "your subscription will cancel at period end" in the UI but is still being charged. Order should be: provider first, DB on success.
- **Proposed fix:** Call provider first; on success, update DB; on provider failure return a user-visible error and DO NOT change DB. Or: write to DB last (still race-y, but matches the eventual webhook).

### SEC-16 — Anon `/api/kundali` POST accepts unauthenticated state-changing-feel POST with weak coordinate validation
- **File:** `src/app/api/kundali/route.ts:18-72`
- **Severity:** P2
- **Evidence:**
  ```ts
  if (!body.date || !body.time || !body.lat || !body.lng || !body.timezone) { ... }
  if (Math.abs(body.lat) > 90 || Math.abs(body.lng) > 180) { ... }
  ```
  `!body.lat` is falsy on the legitimate equator value `0` — silently rejects valid input at lat=0. Route is unauthenticated, IP-rate-limited at 100/day (dev bypass enabled).
- **Why it's a bug:** Minor input bug (lat=0 / lng=0 = "Null Island" rejected), but also: the route is unauth + CPU-heavy + locale-trusted. Per audit DD it should add a `warnings[]` field when Meeus is in fallback. The dev-mode bypass (`isDev ? { allowed: true } : checkRateLimit(...)`) means local-fuzz testing won't catch rate-limit regressions. Lower severity because the surface was triaged in round 1 — kept as defense-in-depth.
- **Proposed fix:** `body.lat == null` instead of `!body.lat`; `body.lng == null`. Tighten `timezone` to IANA-known list via `Intl.DateTimeFormat` round-trip.

### SEC-17 — Brihaspati main route polls DB every 600ms for up to 12s on payment-resume
- **File:** `src/app/api/brihaspati/route.ts:122-180`
- **Severity:** P2
- **Evidence:**
  ```ts
  async function pollForPaymentVerified(): Promise<boolean> {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const { data: fresh } = await db.from('brihaspati_questions')
        .select('payment_verified, provider').eq('id', questionId).single();
      if (fresh?.payment_verified === true) return true;
    }
    return false;
  }
  ```
- **Why it's a bug:** Slowloris / function-cost amplification — a single authenticated user holds a Lambda for 12s while doing 20 DB reads. N concurrent attackers tie up N function instances each costing 12s of compute. Memory deferred-issue documented but still in code. Mitigates as long as the user is authenticated and rate-limited (60/hr at order-create), but a paid attacker can chain 60 holds = 12 minutes of function time.
- **Proposed fix:** Use Vercel Workflow `waitForSignal` keyed on the webhook event, or webhook-pushed pub/sub. Document this in the polling block.

### SEC-18 — `/api/user/profile` POST DELETE leaks the failing-table count via timing
- **File:** `src/app/api/user/profile/route.ts:439-468`
- **Severity:** P3
- **Evidence:** The delete loop iterates 14 tables sequentially; each failure adds another network round-trip before the function returns. Total wall time scales with `O(failedTables)`.
- **Why it's a bug:** A user who supplies a token + spams DELETE can observe the response time to estimate how many tables fail. Information disclosure is bounded (it's the user's OWN data and metadata), but it's a side-channel reveal of internal schema health.
- **Proposed fix:** Parallelise the deletes with `Promise.allSettled`; constant-time response. Practically also faster.

### SEC-19 — `signInWithGoogle` preserves attacker-supplied `pathname + search` in redirectTo
- **File:** `src/stores/auth-store.ts:194-219`
- **Severity:** P3
- **Evidence:**
  ```ts
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');
  const returnPath = window.location.pathname + window.location.search;
  ...
  options: { redirectTo: `${baseUrl}${returnPath}` },
  ```
- **Why it's a bug:** Host is pinned (good), but if an attacker tricks the user to visit `https://dekhopanchang.com/<malicious-page-they-control-via-SSRF-or-XSS-or-an-orphan-test-page>?<attacker-data>` before clicking "Sign in with Google", the OAuth round-trip preserves that path. Not a true open-redirect (host is safe), and the path goes through Next.js routing (404 protects), but it does mean any reflective XSS or content-injection on an orphan path gets the user's fresh OAuth token. Low severity because it requires another vuln to chain.
- **Proposed fix:** Strip query-string; whitelist the `pathname` to a known set (`/dashboard`, `/settings`, current locale page); fall back to `/dashboard` otherwise.

### SEC-20 — Auth `Authorization` parsing varies across routes (some don't check `Bearer ` prefix)
- **File:** `src/app/api/subscription/route.ts:11-13, 55-57` (sample); also `src/app/api/family-synthesis/route.ts:27-31` uses `replace('Bearer ', '')`
- **Severity:** P3
- **Evidence:**
  ```ts
  // subscription/route.ts
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.slice(7).trim();
  if (!token) { return NextResponse.json({ error: 'Unauthorized' }, { status: 401 }); }
  ```
  No `startsWith('Bearer ')` check — `authHeader = "Basic xxx"` would extract `xxx` and try to validate it.
- **Why it's a bug:** Defense-in-depth. `supabase.auth.getUser(token)` will reject malformed tokens, so no real exploit — but the inconsistency makes the parsing brittle (other auth schemes accidentally accepted as Bearer). Audit hygiene.
- **Proposed fix:** Adopt one helper `extractBearerToken(req): string | null` and use it in every route. Reject if not `Bearer ` prefixed.

### SEC-21 — Brihaspati webhook's idempotency uses string matching `/duplicate key|unique constraint/i` instead of `PG_UNIQUE_VIOLATION` code
- **File:** `src/app/api/brihaspati/webhook/stripe/route.ts:38` and `src/app/api/brihaspati/webhook/razorpay/route.ts:56`
- **Severity:** P3
- **Evidence:**
  ```ts
  if (idemErr && !/duplicate key|unique constraint/i.test(idemErr.message)) { ... }
  ```
- **Why it's a bug:** The main Stripe webhook now uses `PG_UNIQUE_VIOLATION = '23505'` (sprint-1 fix). The brihaspati webhooks were not updated — same string-matching fragility as SEC-14. If Supabase changes the error wording or wraps it, the dedup path silently inverts.
- **Proposed fix:** Match on `(err as { code?: string }).code === '23505'` in both webhook handlers.

### SEC-22 — `getInternalBaseUrl` returns raw `VERCEL_URL` without origin validation
- **File:** `src/lib/utils/base-url.ts:10-24`
- **Severity:** P3
- **Evidence:** When `NEXT_PUBLIC_SITE_URL` isn't set (preview deploys), the function returns `https://${VERCEL_URL}` — and `VERCEL_URL` is e.g. `panchang-git-feature-x-aditya.vercel.app`. Server-side `fetch()` calls from `/api/family-synthesis` and similar use this as the base URL.
- **Why it's a bug:** Per `getInternalBaseUrl`, all internal API-to-API calls flow through this. On preview deploys the value is a `*.vercel.app` host with Vercel deployment protection — but the bearer-token forwarded from the caller passes that protection, so an internal route on a preview deploy can call back to itself or to a sibling. Not exploitable from outside, but during a preview the inner call chain is exposed without the cookie-based gate that prod has.
- **Proposed fix:** When `NEXT_PUBLIC_SITE_URL` is missing in production, throw. Allow `VERCEL_URL` only when `process.env.VERCEL_ENV === 'preview' || === 'development'`.

### SEC-23 — Brihaspati `subscription.cancelled` is a no-op (silent acceptance of unhandled state)
- **File:** `src/app/api/brihaspati/webhook/razorpay/route.ts:98-102`
- **Severity:** P3
- **Evidence:**
  ```ts
  case 'subscription.cancelled': {
    // Handled by getActiveSubscription's expires_at check; nothing
    // to do here unless we want immediate cancellation.
    break;
  }
  ```
- **Why it's a bug:** A user who cancels mid-period keeps an active subscription until `expires_at`. That's a billing posture choice, but `getActiveSubscription`'s `expires_at` check is based on the value set at `subscription.activated` — which was a 30/365-day calculation. If Razorpay had a partial-period or refund, the local `expires_at` doesn't reflect it. The user can be paying nothing while still showing as active until the original 30-day window elapses.
- **Proposed fix:** On `subscription.cancelled`, set `expires_at = entity.current_end` (last billed end) or `NOW()` if `current_end` is in the past. At minimum, log the cancellation with the user_id for ops visibility.

---

## Cross-cutting themes

1. **Payment-binding posture is split-brain across four webhooks.** The main Stripe webhook now has the gold-standard pattern (event-id ledger + `pending_checkouts` binding + metadata cross-check + atomic completion stamp). Brihaspati Stripe + Brihaspati Razorpay + main Razorpay still trust attacker-influenceable metadata/notes for `user_id`. SEC-1–SEC-4 should ship in one PR — port the proven `pending_checkouts` + `processed_webhook_events` pattern to all three.

2. **String-matching against natural-language error messages keeps reappearing.** SEC-14 (table-not-exist by message), SEC-21 (unique-violation by regex), the cron-deletion path — all fragile to upstream wording changes. The codebase already has `PG_UNIQUE_VIOLATION = '23505'` in one place. Adopt a small `pgErrorCode(err): string | undefined` helper and grep-replace.

3. **Unauthenticated CPU-burn endpoints are the next class to harden.** Round 1 closed `/api/transit-replay`; this round opens `/api/festival-compare` (no rate-limit, no validation, no auth, year-scale loops) and ganda-mool. A blanket `defaultRateLimit` middleware that every GET handler has to opt out of (rather than opt-in) would catch the next instance automatically.

4. **`String(err)` / `err.message` leakage is still trickling.** The sprint-12 cleanup hit several routes, but `/api/calendar/export`, `/api/muhurta-scan`, `/api/caesarean-scan` still ship the bare exception text. A lint rule (`/return.*NextResponse.*error.*err\.message/`) would catch every future regression.

5. **Inconsistent auth-header parsing across routes is process drift.** Three patterns coexist: `startsWith('Bearer ')` + `slice(7).trim()` (most), bare `slice(7).trim()` (subscription), and `replace('Bearer ', '')` (family-synthesis). One `extractBearerToken(req)` helper used everywhere prevents the next round's audit finding.

6. **The constant-time-compare campaign is 90% done — the last 10% matters.** Stripe, Razorpay, cron-secret, brihaspati-payment-signature all use `timingSafeEqual`. WhatsApp's GET verify_token (SEC-12) is the holdout. Finish the sweep.

— end —

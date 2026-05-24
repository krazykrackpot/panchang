# Bug Hunt — Round 3 — 2026-05-24 — Section 03: Security & Auth

Scope: Auth, RLS, secrets, input validation, webhook posture, surface area. Round-3 audit at HEAD `b4cd2720` after sprints 17–25 closed the bulk of Round 2.

Already-closed and NOT re-reported: SEC-1 (brihaspati Stripe binding via `brihaspati_questions.user_id` cross-check), SEC-2 (brihaspati Razorpay binding), SEC-3 (main Razorpay binding via `pending_razorpay_subscriptions` — migration 037), SEC-4 (`/api/checkout` INR branch writes the pending row), SEC-6 (`/api/calendar/export` constant error string), SEC-7 (`/api/muhurta-scan` + `/api/caesarean-scan` constant strings), SEC-8 (`/api/festival-compare` rate-limit + input validation), SEC-9 (`/api/ganda-mool` + `/api/mundane/conjunctions` rate-limit), SEC-12 (WhatsApp `verify_token` via `timingSafeEqual`), SEC-21 (brihaspati webhook unique-violation via PG code `23505` instead of message regex).

Deferred-but-still-open Round 2 items are re-confirmed below as R3-SEC-1 through R3-SEC-9 (severity re-ranked given Sprint 17–25 context). Then new findings R3-SEC-10 onward.

---

### R3-SEC-1 — `domain_readings` POST accepts unbounded user-supplied scores (re-confirm SEC-5)
- **File:** `src/app/api/user/readings/route.ts:42-137`
- **Severity:** P2
- **Evidence:**
  ```ts
  if (!scores || typeof scores.health !== 'number' || ...) {
    return NextResponse.json({ error: '...' }, { status: 400 });
  }
  const row = { user_id: user.id, health: scores.health, wealth: scores.wealth, ... };
  ```
  No range gate, no clamp, no `triggerEvent` whitelist, no auth-source tagging. Body just needs `typeof scores.X === 'number'` — `-1e9`, `1e9`, `NaN`, `Infinity` all pass.
- **Why it still matters:** Confirmed surviving on `b4cd2720`. With the sprint-21 cron-dedup work, `user_notifications` is now constrained by `dedup_key`, but the cron `domain-activations` still computes "improved since last reading" from `domain_readings.*` deltas without bound-checking. A user can mint synthetic +N deltas to fire their own push notifications (engagement spam) or skew their own "domain activation" UI. Same-user-only impact keeps it at P2, but the lack of clamps is a defense-in-depth gap that survived the audit cycle.
- **Proposed fix:** Clamp every score with `Math.max(0, Math.min(100, scores.X))`; reject `NaN`/`Infinity` via `Number.isFinite`; tag the row `source='user'` so cron can ignore them in delta calcs; OR (simpler) revoke client POST access entirely and route through a dedicated `/api/user/readings/compute` that derives scores from the canonical engine.

### R3-SEC-2 — `/api/checkout` JSON 200 still lacks `Cache-Control: private, no-store` (re-confirm SEC-10)
- **File:** `src/app/api/checkout/route.ts:159, 240`
- **Severity:** P3
- **Evidence:** Both branches `return NextResponse.json({ url: ... })` without headers. The Stripe success URL (`session.url`) and Razorpay subscription `short_url` are sensitive one-time-use redirects.
- **Why it still matters:** Vercel's edge does not cache 200s without explicit `s-maxage`, so this is defense-in-depth and the SW already excludes `/api/checkout` from `CA` cache (P0-3). Risk surfaces only if a future CDN/Cloudflare worker is inserted (Hetzner migration in project memory) — at which point a shared bucket could expose user A's `session.url` to user B. Same class for `/api/brihaspati/order`'s response (also no Cache-Control).
- **Proposed fix:** Add `{ headers: { 'Cache-Control': 'private, no-store' } }` to both 200 returns in `/api/checkout` and `/api/brihaspati/order`. One-line change.

### R3-SEC-3 — Service worker never wipes the `dp-v6-api` cache on sign-out (re-confirm SEC-11)
- **File:** `public/sw.js` (no `CLEAR_AUTH_CACHE` message handler, no `caches.delete(CA)` from auth-store)
- **Severity:** P2
- **Evidence:** SW v6 bypasses `AUTH_PREFIXES` from caching, but no postMessage handler exists to drop the existing `CA` cache when the user signs out. `clearPersistedUserData` in the auth-store clears `localStorage` but never asks the SW to drop its cache. The activate handler only deletes caches not in the current name set.
- **Why it still matters:** Latent. Two scenarios where it bites: (1) a user upgrading from a pre-v6 SW that did cache an auth endpoint, signs out without a reload, then a different user signs in on the same device — the next request reads from `CA`. (2) Future endpoint added to `AUTH_PREFIXES` after a stale response was cached. The cleanest fix has been deferred 3 sprints.
- **Proposed fix:** Add `self.addEventListener('message')` branch for `{ type: 'CLEAR_AUTH_CACHE' }` that `caches.delete(CA)`. Call it from `signOut` and any `userChanged` transition. Five lines total.

### R3-SEC-4 — `getClientIP` still trusts `x-real-ip` unconditionally, no IP regex (re-confirm SEC-13)
- **File:** `src/lib/api/rate-limit.ts:77-86`
- **Severity:** P2
- **Evidence:**
  ```ts
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp;
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) { const hops = forwarded.split(',').map(h => h.trim()).filter(Boolean);
    if (hops.length > 0) return hops[hops.length - 1]; }
  return '127.0.0.1';
  ```
- **Why it still matters:** Behaviour is correct on Vercel today, but: (a) no preference for the Vercel-specific `x-vercel-forwarded-for`; (b) no rejection of obviously malformed values (length cap, IP-shape regex); (c) the comment in the file says "Vercel-set" — but the function is the only IP source for `/api/checkout`, `/api/track-utm`, `/api/client-error`, `/api/festival-compare`, `/api/kundali`, and the AI gate. The moment this code runs behind a non-Vercel proxy (Hetzner/Coolify per the migration plan in MEMORY.md), `x-real-ip` is whatever the immediate hop sets — and a single mis-configured edge lets a client forge it. The "Hetzner migration" page explicitly notes this is the next infra step. Locking the helper to `x-vercel-forwarded-for` first (and a documented assumption when not on Vercel) is one PR.
- **Proposed fix:** Prefer `x-vercel-forwarded-for` (rightmost token) when present; only then `x-real-ip`; cap length to 64; reject if it doesn't match `/^[0-9a-fA-F.:]+$/`; document the proxy assumption.

### R3-SEC-5 — `/api/user/profile` DELETE still matches PostgREST error message text (re-confirm SEC-14)
- **File:** `src/app/api/user/profile/route.ts:440-454`
- **Severity:** P2
- **Evidence:**
  ```ts
  for (const table of [...]) {
    const { error } = await supabase.from(table).delete().eq('user_id', userId);
    if (error && !error.message.includes('does not exist')) { failedTables.push(table); }
  }
  ```
- **Why it still matters:** GDPR right-to-erasure — silent regression here is a compliance failure, not just a code smell. The codebase elsewhere uses `error.code === '23505'` (PG unique violation) for the canonical pattern; this loop should use `error.code === '42P01'` (undefined_table). Sprint 18 introduced PG-code dedup in webhooks (SEC-21 fix); the same hygiene is owed here.
- **Proposed fix:** `if (error && error.code !== '42P01')` instead of message matching. Better still: maintain a static manifest of guaranteed-present tables in `src/lib/gdpr/deletable-tables.ts` and treat any error as fatal.

### R3-SEC-6 — Subscription cancel writes DB before provider call, can re-resurrect via webhook (re-confirm SEC-15)
- **File:** `src/app/api/subscription/route.ts:83-122`
- **Severity:** P2
- **Evidence:**
  ```ts
  await supabase.from('subscriptions').update({ cancel_at_period_end: true, ... });
  if (subscription.provider === 'stripe' && ...) {
    try { await stripe.subscriptions.update(...); }
    catch (providerErr) { console.error('Failed to cancel with Stripe:', providerErr); }
  }
  ```
- **Why it still matters:** Order of operations unchanged in 5 sprints. If the provider call fails (rate-limit, transient), DB shows the user as cancelling but Stripe/Razorpay continues billing. Next `invoice.paid` webhook re-stamps `status='active'` (via `customer.subscription.updated` mapping `cancel_at_period_end` to status), so the user oscillates between "cancelling" and "active" silently — and never actually unsubscribes. Combine this with R3-SEC-13 below and the user has no UI clarity that the cancel never took.
- **Proposed fix:** Provider first; on provider success write DB; on provider failure return a user-visible 5xx and DO NOT change DB.

### R3-SEC-7 — `/api/kundali` POST validation: `!body.lat` rejects equator, no IANA tz round-trip (re-confirm SEC-16)
- **File:** `src/app/api/kundali/route.ts:18-72`
- **Severity:** P3
- **Evidence:**
  ```ts
  if (!body.date || !body.time || !body.lat || !body.lng || !body.timezone) { ... }
  ```
  Plus `timezone` accepted as any string with no IANA round-trip check.
- **Why it still matters:** Same as Round 2 — falsy guard rejects the equator (lat=0) and prime meridian (lng=0). Edge case but a real "Null Island" or equatorial-Africa user gets a 400. The `timezone` ingest is also unvalidated: a malformed string passes through to `computePanchang` and downstream `Intl.DateTimeFormat` constructors throw with a stack trace that reaches the catch block — which logs the raw error. After Sprint 25 most error catchers return a constant string, but `[API/kundali] Generation failed:` logs the raw `err` server-side; if any future refactor surfaces `err.message` to the client (regression risk), the user-supplied timezone would echo back.
- **Proposed fix:** `body.lat == null || body.lng == null` instead of `!body.lat`; validate timezone with `try { new Intl.DateTimeFormat('en', { timeZone: body.timezone }); } catch { return 400 }`.

### R3-SEC-8 — Brihaspati main route still polls DB up to 12s on payment-resume (re-confirm SEC-17)
- **File:** `src/app/api/brihaspati/route.ts:122-180` (`pollForPaymentVerified`)
- **Severity:** P2
- **Evidence:**
  ```ts
  async function pollForPaymentVerified(): Promise<boolean> {
    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 600));
      const { data: fresh } = await db.from('brihaspati_questions')... ;
      if (fresh?.payment_verified === true) return true;
    }
    return false;
  }
  ```
  Two call sites (lines 152, 162).
- **Why it still matters:** Function-cost amplification persists. A single authenticated user holds a Lambda instance for 12 seconds while doing up to 20 DB reads. At the brihaspati `/order` rate-limit of 60/hr, an attacker who already passed `payment_verified` can chain 60 holds = 720s of function time per hour, per IP — and per Fluid Compute fan-out this could cost. Project memory has tracked this since `project_audit_deferred_brihaspati_poll_dos`. Not exploitable without a paying account, but the cost surface is real.
- **Proposed fix:** Vercel Workflow `waitForSignal` keyed on the webhook event; or webhook-pushed pub/sub via `pg_notify`. Document the poll-loop in the code (currently no "tracked tech debt" comment at the function).

### R3-SEC-9 — `signInWithGoogle` preserves user-controlled `pathname + search` in redirectTo (re-confirm SEC-19)
- **File:** `src/stores/auth-store.ts:201-219`
- **Severity:** P3
- **Evidence:**
  ```ts
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim().replace(/\/$/, '');
  const returnPath = window.location.pathname + window.location.search;
  options: { redirectTo: `${baseUrl}${returnPath}` },
  ```
- **Why it still matters:** Host is pinned (good), so this is not an open-redirect. But the `?search` portion is preserved verbatim — meaning if any future page renders a query param into the DOM unsafely (and only ONE such regression is enough), the OAuth round-trip preserves the malicious query and hands the user back to it with a fresh session. Surface is bounded but not zero; coupling-risk against any future XSS regression.
- **Proposed fix:** `const returnPath = window.location.pathname;` (drop `search`); whitelist `pathname` to a known set of post-login destinations, fall back to `/dashboard`.

### R3-SEC-10 — `getInternalBaseUrl` falls through to raw `VERCEL_URL` in production preview deploys (re-confirm SEC-22, escalated)
- **File:** `src/lib/utils/base-url.ts:10-24`
- **Severity:** P2 (was P3 in Round 2 — raised because `getFreshSnapshot` and `/api/family-synthesis` propagate this URL through bearer-forwarded internal fetches)
- **Evidence:**
  ```ts
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) { ... return ...; }
  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;
  return 'http://localhost:3000';
  ```
  No check that `VERCEL_ENV === 'preview' | 'development'` before accepting `VERCEL_URL`.
- **Why it matters:** Family-synthesis internally calls `${getInternalBaseUrl()}/api/...` with the caller's bearer token forwarded. If `NEXT_PUBLIC_SITE_URL` is ever unset in a production deploy (env-var typo, env-promote miss), the route silently switches to the `*.vercel.app` host. Vercel deployment protection still gates it, but the bearer-forwarded request passes that gate, so the route effectively bypasses the cookie-gate posture that production has. Worse: any logs of `getInternalBaseUrl()` output then contain the `*.vercel.app` hostname which can be cross-referenced against Vercel's project-naming pattern to enumerate deploy URLs.
- **Proposed fix:** Throw when `NEXT_PUBLIC_SITE_URL` is missing AND `VERCEL_ENV === 'production'`. Allow `VERCEL_URL` only for `preview`/`development`.

### R3-SEC-11 — Brihaspati Razorpay `subscription.cancelled` is still a no-op (re-confirm SEC-23)
- **File:** `src/app/api/brihaspati/webhook/razorpay/route.ts:208-212`
- **Severity:** P3
- **Evidence:**
  ```ts
  case 'subscription.cancelled': {
    // Handled by getActiveSubscription's expires_at check; nothing
    // to do here unless we want immediate cancellation.
    break;
  }
  ```
- **Why it still matters:** Conscious posture choice, but ops visibility is zero. A cancellation mid-period silently drops on the floor; if Razorpay later refunds the partial period the user keeps `is_subscribed=true` until the locally-computed `expires_at`. At minimum the event should be logged so support can correlate refund tickets with cancellations. The audit `subscription.cancelled` handler in the MAIN Razorpay webhook (post-SEC-3 fix) DOES update `status='cancelled'`; the brihaspati twin does not.
- **Proposed fix:** At minimum, `console.log('[brihaspati/webhook/razorpay] subscription cancelled', { userId, subscriptionId })`. Ideally also `setSubscription(supabase, userId, tier, new Date().toISOString(), 'razorpay')` to mark immediate expiry — the customer can re-subscribe instead of dangling in a credit-window mismatch.

---

### R3-SEC-12 — `/api/track-utm` `metadata` field still allows arbitrary JSON shapes
- **File:** `src/app/api/track-utm/route.ts:91-100, 127-138`
- **Severity:** P3
- **Evidence:** Round 2 added a 2KB serialised cap, but the field is passed as `event_metadata: metadata || null` to a `jsonb` column without any schema. Nested arrays, deeply-nested objects, or strings with control characters are all accepted.
- **Why it matters:** `utm_visits` is service-role-only on the read side, but it's queried by an internal analytics page that may render values inline. The 2KB cap blocks the storage-bloat angle (Round 2 fix), but a deliberately-crafted Unicode payload (RTL override, BIDI tricks, U+FEFF zero-width) survives and shows up in any future ops dashboard. Defense-in-depth: validate the shape with Zod (`record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.null()]))`) and reject anything that's not a flat string-keyed object.
- **Proposed fix:** Zod schema on `metadata`; reject keys longer than 64 chars; strip control chars from string values.

### R3-SEC-13 — `customer.subscription.updated` in main Stripe webhook never re-stamps `cancel_at_period_end`
- **File:** `src/app/api/webhooks/stripe/route.ts:187-230`
- **Severity:** P2
- **Evidence:** The handler computes `status = subscription.cancel_at_period_end ? 'cancelling' : subscription.status;` but only writes the resulting `status` string — the underlying boolean column `subscriptions.cancel_at_period_end` is never re-stamped from the webhook. Compare to `/api/subscription/route.ts` POST cancel, which DOES write the boolean directly.
- **Why it matters:** Two write paths to the same row. If the user cancels via the in-app POST (`/api/subscription` writes `cancel_at_period_end=true`), then Stripe later sends a `customer.subscription.updated` with `cancel_at_period_end=false` (user un-cancelled in the Stripe portal), the webhook updates `status='active'` but leaves `cancel_at_period_end=true` from the prior in-app write. The UI then shows "your subscription will cancel at period end" while the subscription is actually live again. The dashboard banner is wrong and the user could re-cancel by mistake, double-billing.
- **Proposed fix:** Include `cancel_at_period_end: subscription.cancel_at_period_end ?? false` in `updateData` so the webhook is authoritative.

### R3-SEC-14 — `pending_checkouts` allows multiple un-completed rows per (user, tier); no UNIQUE on the deduplication key
- **File:** `supabase/migrations/035_pending_checkouts.sql:19-46`
- **Severity:** P3
- **Evidence:** Primary key is `stripe_session_id`, but the 5-min-window dup check in `/api/checkout` (lines 66-85) is enforced only at the application layer. If two parallel server instances each enter the `select … completed_at is null … limit 1` window simultaneously and neither sees the other's row yet (insert races), both proceed to create Stripe sessions.
- **Why it matters:** The `pending_dup` short-circuit was added Sprint 19 to stop double-clicks (IDEM-3), but the race is left for the app — no DB-level constraint like `UNIQUE(user_id, tier) WHERE completed_at IS NULL`. Two concurrent createCheckoutSession calls = two Stripe sessions = two valid checkout URLs floating until one expires. Lower probability than a single-tab double-click; raised by the realistic case of the user hitting "Subscribe" right when Vercel cold-starts another container that processes a retry from a flaky network.
- **Proposed fix:** Partial unique index `CREATE UNIQUE INDEX ON pending_checkouts(user_id, tier) WHERE completed_at IS NULL` — same for `pending_razorpay_subscriptions`. The second concurrent INSERT then fails with `23505` and the existing PG-code dedup branch handles it cleanly.

### R3-SEC-15 — `claim_usage` RPC uses `format(%I, p_field)` plus a whitelist, but the whitelist drifts from the actual column list silently
- **File:** `supabase/migrations/038_atomic_quota_claim.sql:60-77, 155-163`
- **Severity:** P3
- **Evidence:** The function's `v_allowed_fields` is a static `CONSTANT TEXT[]`. The set is duplicated across `claim_usage` and `claim_monthly_usage`. There's no test that the array stays in sync with the actual `daily_usage` table columns, so a future migration that adds a column needs to update the function manually.
- **Why it matters:** Functionally safe today — `format(%I, ...)` quotes the identifier and a non-whitelisted field gets rejected with `claimed=false, new_count=-1`. The risk is the opposite: a NEW column gets added (say `journal_entry_count`) without updating the whitelist, and the AI endpoint that tries to claim against it silently returns `claimed=false`. Quota gate that always fails is the same as no quota.
- **Proposed fix:** Either (1) replace the whitelist with `SELECT column_name FROM information_schema.columns WHERE table_name='daily_usage' AND data_type='integer'`, (2) DRY the whitelist into a single source-of-truth (a separate `_quota_columns` table the function joins on), or (3) add a migration-test that asserts the array matches the actual columns.

### R3-SEC-16 — Razorpay webhook handler doesn't validate `current_start`/`current_end` are sane numbers
- **File:** `src/app/api/webhooks/razorpay/route.ts:228-265`
- **Severity:** P3
- **Evidence:**
  ```ts
  current_period_start: entity.current_start ? new Date(entity.current_start * 1000).toISOString() : null,
  current_period_end: entity.current_end ? new Date(entity.current_end * 1000).toISOString() : null,
  ```
- **Why it matters:** `notes.user_id` is now properly verified against `pending_razorpay_subscriptions` (Sprint 18 closed SEC-3), but `current_start/end` come from the same webhook payload and are NOT cross-checked against anything. An attacker who controls a Razorpay merchant account and crafts a subscription with `current_end: 99999999999` (year 5138) sets the user's `current_period_end` to an absurd future date. The webhook accepts because the binding check passes on user_id, but the user gets a subscription that doesn't expire until 5138 — until any reconciliation cron catches up. Same shape applied to the main Razorpay webhook AND brihaspati Razorpay's subscription expiry computation (which uses `sub.current_end` for `expires_at`).
- **Proposed fix:** Clamp `current_end` to `now + 2 years`; reject the event if `current_end < current_start` or either is negative. A simple `MAX_REASONABLE_EXPIRY = Date.now() + 365*86400*2*1000` check.

### R3-SEC-17 — `/api/family-synthesis` uses `replace('Bearer ', '')` instead of `startsWith('Bearer ') + slice(7)`
- **File:** `src/app/api/family-synthesis/route.ts:27-31`
- **Severity:** P3
- **Evidence:**
  ```ts
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '').trim();
  if (!token) { return NextResponse.json({ error: 'Authentication required' }, { status: 401 }); }
  ```
- **Why it matters:** Three styles coexist now: (1) `startsWith('Bearer ') + slice(7).trim()` (most routes), (2) bare `slice(7).trim()` (subscription), (3) `replace('Bearer ', '')` (family-synthesis only). The replace variant accepts `xxxBearer xxx` and substring-replaces; `supabase.auth.getUser` rejects malformed tokens so no real exploit, but it's drift that the audit campaign hasn't normalised. Inconsistent posture is the same class of bug that yielded SEC-20 in Round 2. A single `extractBearerToken(req): string | null` helper would close this once.
- **Proposed fix:** Add `src/lib/api/extract-bearer.ts` exporting `extractBearerToken`; replace all three styles across the codebase.

### R3-SEC-18 — `/api/subscription` GET/POST still accepts `Authorization` without `Bearer ` prefix check (re-confirm SEC-20)
- **File:** `src/app/api/subscription/route.ts:11-13, 55-57`
- **Severity:** P3
- **Evidence:**
  ```ts
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.slice(7).trim();
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  ```
  `authHeader?.slice(7)` returns `undefined` if `authHeader` is missing — that's fine. But if `authHeader === 'Basic deadbeef'`, `slice(7)` returns `'deadbeef'` (or whatever bytes after position 7), and the route attempts to validate THAT against Supabase. `supabase.auth.getUser` rejects, so no real exploit, but inconsistent posture (same class as R3-SEC-17).
- **Proposed fix:** Use the same `extractBearerToken` helper.

### R3-SEC-19 — `dasha-diary`, `tippanni`, `domain-pandit` GET handlers fall back to free tier on transient auth error without surfacing
- **File:** `src/app/api/ai-reading/route.ts:87-99` (and twins)
- **Severity:** P2
- **Evidence:**
  ```ts
  if (authHeader?.startsWith('Bearer ')) {
    const { data, error: authError } = await supabase.auth.getUser(...);
    if (authError) { console.error('[ai-reading] bearer auth failed:', authError.message); }
    userId = data.user?.id ?? null;
  }
  if (!userId) return { userId: null, tier: 'free' };
  ```
- **Why it matters:** If Supabase auth has a transient outage (`authError` set, `data.user` null), a paying Pro/Jyotishi user is silently downgraded to `tier: 'free'` and gates against `DAILY_LIMITS[tier]` which is 2/day. The error IS logged but the user sees "quota exceeded" instead of an auth error. Worse: the cached-reading short-circuit (line 178-198) READS without `userId` being correctly resolved — actually that path returns early before tier matters, but the structural cache uses the wrong fingerprint when userId comes back null after a transient failure. Same shape applies to `tippanni-llm` and `domain-pandit`.
- **Proposed fix:** When `authError` is set AND `Bearer` header was present, return 503 (`Service unavailable, try again`) instead of falling through to anonymous tier. The CSRF-gate intent (no cookie fallback) is preserved.

### R3-SEC-20 — `/api/whatsapp` POST has no event-id dedup; replays of a single signed payload re-trigger outbound Meta credits
- **File:** `src/app/api/whatsapp/route.ts:112-151`
- **Severity:** P2
- **Evidence:** The handler verifies `x-hub-signature-256` (correctly, with `timingSafeEqual` — Round 4 hardening) and then unconditionally dispatches a reply via `sendWhatsAppMessage`. There's no `WHATSAPP_MESSAGE_ID` ledger / dedup. Meta retries non-2xx for ~7 days and CAN duplicate-deliver on flaky network.
- **Why it matters:** Each duplicate delivery spends another Meta credit and posts another outbound message to the user. A user pinging the bot once can see the same reply 2–3× if Meta's delivery retries land before the bot's 200 is ACK'd. Worse, an attacker who captures one signed payload (via SSL termination at a logging proxy, or a leaked transcript) can re-POST it later — the signature is over the body alone with no timestamp, so the replay verifies and the bot spams the target number on our dime. WhatsApp Business API documents this risk in their webhook security guide.
- **Proposed fix:** Insert `message.id` into a `whatsapp_processed_messages` table with a unique constraint; short-circuit on PG_UNIQUE_VIOLATION. Mirror `processed_webhook_events`. Two-line addition.

### R3-SEC-21 — Embed `?name=` query param flows into HTML widget without explicit length cap
- **File:** `src/app/embed/panchang/page.tsx:46-56, 118`
- **Severity:** P3
- **Evidence:** `locationName = params.name || ...` then `<div className="widget-location">{locationName}</div>`. React JSX escapes so this is NOT an XSS vector. But there's no length cap — a 1MB `?name=` payload becomes a 1MB embedded widget rendered server-side, all bytes shipped to the browser AND to any consumer who iframed the widget with `X-Frame-Options: ALLOWALL` (per `next.config.ts:128-132`).
- **Why it matters:** The widget is explicitly designed for cross-origin embedding (`frame-ancestors *`). A malicious site can host an iframe with `?name=<1MB string>` and force the user's browser to fetch and render 1MB on every visit — server-side cost amplification keyed on attacker-supplied query, no auth gate. Compounded by the route running `computePanchang` + `generateFestivalCalendarV2` per request (year-scale loop). No rate-limit on this route — the festival-compare rate-limit fix (SEC-8 closed) didn't extend to `/embed/*`.
- **Proposed fix:** Cap `params.name` to 64 chars (`params.name?.slice(0, 64)`); add IP rate-limit at top of the page; clamp `lat/lng` validation already exists.

### R3-SEC-22 — `pending_razorpay_subscriptions` has no FK ON DELETE behaviour distinct from cascade — orphan rows on quick user delete
- **File:** `supabase/migrations/037_razorpay_parity.sql:31`
- **Severity:** P3
- **Evidence:** `user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE` — same shape as `pending_checkouts` (035). On user account deletion, all `pending_*` rows are wiped via cascade.
- **Why it matters:** Compliance angle: a user who initiates checkout then immediately deletes their account leaves NO audit trail of "this user was about to subscribe via Razorpay" — the pending row cascades away before the webhook arrives, the subscription gets created at Razorpay (real money charged), and the now-deleted user_id can't be re-bound (no row, no FK target). The webhook will then `console.error('[razorpay-webhook] SECURITY: no pending row and no existing subscription'` and refuse to credit — but the customer paid. Compare to `pending_checkouts` which has the same issue. Stripe-side this is partially mitigated by the Stripe customer object holding the original email; Razorpay's `notes.user_id` is gone.
- **Proposed fix:** `ON DELETE SET NULL` on user_id, keep the row for ops; or move to a soft-delete pattern with `deleted_at` for the pending tables. At minimum, log the orphan-pending case to a dedicated `payment_orphans` table on user-deletion via a trigger.

### R3-SEC-23 — `/api/financial`, `/api/medical`, `/api/nadi` spread `body` into `generateKundali` without explicit field allow-list
- **File:** `src/app/api/financial/route.ts:84`, `src/app/api/medical/route.ts:78`, `src/app/api/nadi/route.ts:80`
- **Severity:** P3
- **Evidence:**
  ```ts
  const kundali = generateKundali({ ...body, ayanamsha: body.ayanamsha || 'lahiri' });
  ```
- **Why it matters:** Not a mass-assignment vulnerability against the DB (no DB write happens here), but `generateKundali` consumes a `BirthData` shape that includes computation flags (e.g. ayanamsha selector). A future addition to `BirthData` that includes a privileged option (e.g. `skipValidation: boolean`) would be silently honoured by client input. The pattern is "trust the body shape" — fine when the body type is closed, but typescript types don't gate runtime. A Zod schema with `.strict()` would close this. Three files, identical shape.
- **Proposed fix:** Define `BirthDataSchema` (Zod) once in `src/types/kundali.ts`; `safeParse` and reject unknowns. Stop using `...body` spread.

### R3-SEC-24 — RLS on `pending_checkouts` + `pending_razorpay_subscriptions`: missing user SELECT path for "your pending session"
- **File:** `supabase/migrations/035_pending_checkouts.sql:42-45`, `037_razorpay_parity.sql:49-53`
- **Severity:** P3 (informational)
- **Evidence:** Both tables are `Service role manages` with no user-facing SELECT policy.
- **Why it matters:** A user who closed their tab mid-checkout has no way to see "you have a pending Stripe session" — they have to wait 5 minutes for the IDEM-3 dup-window to expire before retrying. Today's UX masks this with the 409 "duplicate" error, but it's a UX dead-end (the prior Stripe session URL is gone). Less a security concern than a feature gap — bookkeeping the user-facing visibility is owed by the binding-row design.
- **Proposed fix:** Add `CREATE POLICY "Users read own pending" ON pending_checkouts FOR SELECT USING (auth.uid() = user_id)`. Same for `pending_razorpay_subscriptions`. Then expose a `/api/checkout/pending` route that returns the open session URL for resume.

---

## Cross-cutting themes

1. **The webhook posture is consistent now — but consumer-side hygiene lags.** Sprints 17–25 closed the metadata-spoofing surface across all four webhooks (Stripe main + Brihaspati Stripe + Razorpay main + Brihaspati Razorpay). The next layer — making consumers of webhook-derived data (subscription cancel, expires_at clamping, status flip ordering) defensive — is mostly open (R3-SEC-6, R3-SEC-11, R3-SEC-13, R3-SEC-16). Address as a sub-cluster: "webhook writes must be authoritative AND complete".

2. **Identity-extraction shape drift across routes is still a process problem.** Three styles of `Authorization` parsing coexist (R3-SEC-17, R3-SEC-18). Round 2's SEC-20 didn't unify them. A single `extractBearerToken(req)` helper used everywhere closes the next audit's first finding.

3. **Defense-in-depth around `getInternalBaseUrl` and `getClientIP` is leaning on Vercel-only behaviour.** The Hetzner migration plan in MEMORY.md will activate the latent bugs in both helpers (R3-SEC-4, R3-SEC-10). Pre-migration cleanup is one PR of work.

4. **Pending tables (`pending_checkouts`, `pending_razorpay_subscriptions`) need DB-level uniqueness + a user-facing read path.** Application-layer dup-windows (5 min) + service-role-only RLS leaves both a race-condition window (R3-SEC-14) and a UX dead-end (R3-SEC-24).

5. **GDPR right-to-erasure is still fragile (R3-SEC-5).** Message-text-matching for `does not exist` against PostgREST should be the last regex against natural-language error strings in the codebase. Sprint 18's PG-code dedup pattern (`error.code === '23505'`) is the canonical fix; apply to the delete loop too.

6. **AI quota gates use atomic claim correctly, but the auth-error → free-tier fall-through (R3-SEC-19) silently downgrades paying users.** Distinguishing "no Bearer" from "Bearer rejected by Supabase" matters — failing closed in the latter case keeps the gate posture honest.

---

## Diminishing-returns note

Round 2 left 11 deferred SEC items; Round 3 confirms 9 still open (R3-SEC-1 through R3-SEC-11) plus 13 new findings, most of them P2/P3 defense-in-depth. The P0/P1 attack surface has been substantially closed — there is no remaining exploitable-today issue in this section (R3-SEC-1 through R3-SEC-24 are all P2 or below). Further audit rounds in this domain will surface increasingly speculative findings; the next high-value security work is operational: secret-rotation rehearsal, the Hetzner migration's IP-trust review, and a one-shot pass to normalise auth-header parsing across all 38 POST routes.

— end —

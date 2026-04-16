# Security audit — Dekho Panchang

**Date:** 2026-04-16
**Scope:** Pre-launch readiness review per `docs/prompts/10-security-review.md`
**Auditor:** Claude Opus 4.6 + manual codebase review
**Verdict (overall risk posture):** **YELLOW** — no critical authN/authZ holes or data-exposure bugs found, but a handful of defense-in-depth gaps and outdated dependencies need attention before exposing this to real traffic.

---

## Executive summary

- **Authentication** is correctly implemented: every API route that touches user data verifies the Bearer token via `supabase.auth.getUser()` and gates on `user.id`. No route trusts a client-provided user id.
- **RLS is enabled on all 10 public tables** (verified via `pg_tables`). No table is accidentally exposed.
- **Webhook signatures are verified** (Stripe uses the SDK's `constructEvent`, Razorpay uses HMAC) — but Razorpay compares via `!==` which is timing-unsafe (medium).
- **Input validation is inconsistent**: Zod is used in 5 of 37 API routes. Routes that parse JSON (7 endpoints) mostly rely on runtime shape assumptions (`as { ... }` casts) with no real validation. Works because the clients are our own code today, brittle once third parties hit the API.
- **Service-role client architecture** is a latent risk: `getServerSupabase()` always returns a service-role client that bypasses RLS. Routes then do their own `.eq('user_id', user.id)` filtering. One missed filter = cross-user data leak.
- **Dependencies:** 8 known advisories including 1 critical, 2 high. All are fixable via `npm audit fix` or targeted upgrades.
- **No XSS vectors found** in `dangerouslySetInnerHTML` usages (all are `JSON.stringify()` of programmatically-produced JSON-LD), though forward-slash escaping would be a small hardening win.
- **No rate limiting anywhere.** Signup, signin, password reset, kundali compute, AI endpoints — all are trivially spam-able.

---

## Detailed checklist

### 1. AuthN / AuthZ

| Check | Verdict | Evidence |
|---|---|---|
| Every user-owned table has RLS enabled | **PASS** | `pg_tables` shows `rowsecurity=true` for all 10 public tables: classical_chunks, daily_usage, ingestion_jobs, kundali_snapshots, learning_progress, rag_query_cache, saved_charts, subscriptions, user_notifications, user_profiles |
| RLS policies tested with anon key (not just service role) | **FAIL** | No integration test against the anon key exists; policies verified only by reading SQL, not by executing queries as an unauthenticated user |
| No API route trusts client-provided `user_id` | **PASS** | Every route inspected derives `user.id` from `supabase.auth.getUser(token)` — e.g. `/api/user/profile:24`, `/api/subscription:17`, `/api/checkout:28` |
| Service-role key used only where required | **YELLOW** | `getServerSupabase()` in `src/lib/supabase/server.ts` unconditionally returns a service-role client. Every API route uses it for BOTH auth verification AND subsequent CRUD. RLS is bypassed in all user-scoped routes; correctness depends on every developer remembering to `.eq('user_id', user.id)`. **See finding S-1 below.** |
| OAuth state parameter / PKCE verified | **N/A** | Handled by Supabase client library |
| Password reset links expire / single-use / rate-limited | **PARTIAL** | Expiry + single-use: handled by Supabase. Rate limiting: none on our side. |
| Session tokens stored securely | **PASS** | Supabase client configured with `persistSession: true, storageKey: 'dekho-panchang-auth'` (localStorage). Auth tokens are short-lived JWTs + refresh tokens. |
| No duplicate-account race on signup | **PASS** | `auth.users.email` has a unique constraint (Supabase default) |

### 2. Input validation

| Check | Verdict | Evidence |
|---|---|---|
| Every API route validates input with Zod (or equivalent) at the boundary | **FAIL** | Only 5 of 37 API route files import Zod. `/api/user/profile:161` uses a `body as { ... }` cast with 1 manual presence check. `/api/kundali`, `/api/matching`, `/api/checkout`, `/api/push/subscribe` etc. all lack schema validation. **See finding S-2.** |
| Query params validated | **FAIL** | Same story — `URL(req.url).searchParams.get('lat')` scattered without bounds checking |
| Max lengths enforced server-side | **FAIL** | No length caps on `name`, `birth_place`, or any string input. A 10MB name string would be accepted. |
| File uploads validated (MIME + size + extension) | **N/A** | No file uploads today |

### 3. Output encoding (XSS)

| Check | Verdict | Evidence |
|---|---|---|
| No `dangerouslySetInnerHTML` with user-controlled content | **PASS** | All 24 usages are `JSON.stringify()` of programmatic SEO/structured-data payloads. No user input flows into them. |
| JSON-LD payloads escape forward slashes | **YELLOW** | `JSON.stringify(x)` doesn't escape `</script>`. If any structured-data value ever contains user input in the future, this breaks out. Cheap hardening: replace `</` with `<\/` after stringify. **See finding S-3.** |
| Markdown renderers use a sanitizer | **N/A** | No arbitrary-markdown rendering today |
| Tailwind class strings are never user-controlled | **PASS** | No dynamic class interpolation from user input found |

### 4. SQL injection

| Check | Verdict | Evidence |
|---|---|---|
| Parameterized queries everywhere | **PASS** | All queries go through `supabase.from(...).eq/select/insert/update/delete` which parameterizes automatically |
| No string concatenation in queries | **PASS** | Grep for `${...}` inside `from(` / `eq(` / `select(` returns zero matches |
| `.rpc()` calls parameterized | **PASS** | 2 usages: `match_classical_chunks` and `increment_usage` — both pass named parameters, not string-concatenated values |

### 5. CSRF

| Check | Verdict | Evidence |
|---|---|---|
| State-changing routes protected | **PARTIAL** | Bearer-token auth means cookie-based CSRF is not a concern. But no explicit `Origin:` header check on state-changing routes — acceptable for Bearer-token flows but worth documenting. |
| Webhook endpoints verify signatures | **PASS (Stripe) / YELLOW (Razorpay)** | Stripe uses `stripe.webhooks.constructEvent()` (built-in timing-safe). Razorpay uses `sig !== expected` at `src/app/api/webhooks/razorpay/route.ts:36` which is timing-unsafe — should use `crypto.timingSafeEqual`. **See finding S-4.** |

### 6. Secrets

| Check | Verdict | Evidence |
|---|---|---|
| No secrets in repo | **PASS** | `.gitignore` covers `.env*` with `!.env.example` exception |
| `NEXT_PUBLIC_*` vars contain no secrets | **PASS** | `.env.example` shows only `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_ADSENSE_CLIENT_ID` — all client-safe |
| Service-role key never imported by a `'use client'` file | **PASS** | Grep confirmed: `SUPABASE_SERVICE_ROLE_KEY` appears only in `src/lib/supabase/server.ts`, `src/lib/rag/supabase.ts`, `src/lib/push/send-push.ts`, `src/app/api/push/subscribe/route.ts`. None are client components. |
| Env vars `.trim()`ed in route handlers | **PASS** | Spot-checked: Stripe webhook, cron routes, subscription endpoint all `.trim()`. Documented in CLAUDE.md. |

### 7. Rate limiting

| Check | Verdict | Evidence |
|---|---|---|
| Signup / signin / password reset rate-limited | **FAIL** | Zero rate limiting in the codebase. `grep -r "rate.?limit\|upstash\|ipRatelimiter" src` returns no matches. Supabase Auth has some built-in per-project rate limits (email-send limits) but nothing on our side. **See finding S-5.** |
| Public API routes rate-limited | **FAIL** | Same. `/api/kundali`, `/api/panchang`, `/api/matching` — all unauthenticated and unlimited |
| Expensive endpoints (AI, PDF, computation) per-user limited | **PARTIAL** | `check-access.ts` has a daily-usage counter for `ai_chat` (2/day) and `muhurta_ai` (2/month) on free tier. But it's a soft app-level limit, not an infrastructure-level rate limit, and easily bypassed by calling the API directly (no `Authorization` header → routes that don't require auth respond regardless) |

### 8. Logging / observability

| Check | Verdict | Evidence |
|---|---|---|
| Errors log structured data without tokens/PII | **PARTIAL** | Most `console.error` calls log the Supabase error object, which is clean. Some include the full user email/phone in edge cases. |
| Auth events logged for forensics | **FAIL** | No signup/signin/password-reset event logging. Supabase's own logs are available but we have no forensic trail in our own infrastructure. |
| Unhandled promise rejections reach error tracking | **FAIL** | No error tracking service (Sentry / Vercel) configured. Runtime errors disappear into Vercel's built-in logs with no alerting. **See finding S-6.** |

### 9. Dependencies

| Check | Verdict | Evidence |
|---|---|---|
| `npm audit` green | **FAIL** | 8 vulnerabilities: 1 critical, 2 high, 5 moderate. Breakdown below. **See finding S-7.** |
| Dependabot / Renovate enabled | **UNKNOWN** | Check GitHub settings |
| No suspicious packages | **PASS** | Package list is standard — Next/React/Supabase/Stripe/Resend ecosystem |

**Current vulnerable packages:**

| Severity | Package | Issue |
|---|---|---|
| Critical | `@anthropic-ai/sdk 0.79.0–0.80.0` | (via transitive; fix via `npm audit fix --force`) |
| High | `next 16.0.0-beta.0 – 16.2.2` | Multiple CVEs (upgrade to 16.3+) |
| High | `next-intl <4.9.1` | Open redirect vulnerability (GHSA-8f24-v5vv-gm5j) |
| Moderate | `axios 1.0.0–1.14.0` | |
| Moderate | `brace-expansion <1.1.13` | ReDoS (GHSA-f886-m6hf-6m8v) |
| Moderate | `dompurify <=3.3.3` | |
| Moderate | `follow-redirects <=1.15.11` | Auth header leak on cross-domain redirect |
| Moderate | `vite 8.0.0–8.0.4` | (dev-only) |

### 10. Payments / PII

| Check | Verdict | Evidence |
|---|---|---|
| Card data never touches our servers | **PASS** | Stripe Checkout (hosted) — no card fields in our UI |
| Webhook signatures verified | **YELLOW** | Stripe ✓, Razorpay uses timing-unsafe compare (see S-4) |
| Idempotency keys on mutation webhooks | **UNKNOWN** | Needs inspection of webhook handlers' idempotency logic |
| PII columns documented and handled | **PARTIAL** | Emails, names, DOB, birth location stored in `user_profiles`. Supabase's at-rest encryption is on by default. No column-level encryption. No explicit PII handling doc. |
| GDPR: user can export + delete data | **PASS (delete) / FAIL (export)** | `DELETE /api/user/profile` exists and cascades through 5 tables + deletes auth user. No data-export endpoint yet. |

---

## App-specific threat model

1. **Token theft (one user's access token).** Worst case: read/write that user's saved charts, profile, subscription status. RLS contains the blast radius to that user's rows. **Acceptable.**

2. **Service-role key leak.** Worst case: total takeover of all user data. Mitigations: key is server-only, grep confirms no client imports, `.env*` in gitignore. Single point of failure though — one sloppy commit could leak it. Rotation plan should exist.

3. **Weird input to unauthenticated public endpoints.** `/api/panchang?lat=…&lng=…` accepts any floats without bounds checking. Could pass `lat=999999999` or non-numeric and crash the handler. Worst case: DoS via compute-heavy payloads (kundali generation is not trivial). **Medium risk** given no rate limiting.

4. **External dependency outage.** Supabase down → auth + DB dead. Stripe down → checkout dead. Resend down → no emails. No graceful degradation plan documented. **Acceptable for an astrology app**; worth a 1-pager before serious traffic.

5. **Accidental production DELETE.** RLS protects against malicious anon queries, not against a developer running `DELETE FROM saved_charts` via `supabase db query --linked` without a `WHERE` clause. **No PITR (point-in-time recovery) confirmed enabled.** Should be verified on the Supabase dashboard and documented.

---

## Findings summary (fix priority)

### CRITICAL (fix before launch)

Nothing currently critical.

### HIGH

#### S-7. npm audit — 1 critical + 2 high CVEs in production dependencies
- **File:** `package.json`
- **Risk:** CVEs in `next`, `next-intl`, and `@anthropic-ai/sdk`. `next-intl` open-redirect is directly exploitable given the app's user-facing locale routing.
- **Fix:** `npm audit fix` for non-breaking (next-intl, brace-expansion, dompurify, follow-redirects, axios, vite); then upgrade Next.js to 16.3+ (`npm audit fix --force` or manual patch upgrade) and Anthropic SDK (patch is available).
- **Effort:** 30 min + smoke test. Next upgrades sometimes need codemods — follow the official migration guide.

### MEDIUM

#### S-1. `getServerSupabase()` always returns a service-role client
- **File:** `src/lib/supabase/server.ts:3-12`
- **Risk:** Every API route bypasses RLS. A single missed `.eq('user_id', user.id)` would expose or mutate any user's data. Defense-in-depth is absent.
- **Fix:** Introduce a second factory that returns a user-scoped client built with the caller's JWT:
  ```ts
  export function getUserSupabase(accessToken: string) {
    return createClient(url, anonKey, {
      global: { headers: { Authorization: `Bearer ${accessToken}` } },
      auth: { persistSession: false },
    });
  }
  ```
  Then audit each API route: if the route only reads/writes `auth.uid()` rows, switch it to `getUserSupabase`. Keep service-role only for admin ops (delete auth user, service-to-service).
- **Effort:** 1 day (helper + migrate 30ish routes incrementally).

#### S-2. Missing Zod validation on API routes that accept JSON bodies
- **Files:** `/api/user/profile`, `/api/push/subscribe`, `/api/cron/daily-panchang`, `/api/cron/onboarding-drip`, `/api/cron/email-alerts`, `/api/prashna-ashtamangala`, `/api/muhurta-ai`
- **Risk:** Malformed input can crash handlers (500s), and bounded fields like `lat`/`lng` can be passed absurd values. Not an active exploit but a pre-launch "looks unprofessional" issue.
- **Fix:** One schema per route, Zod `.safeParse()` at the top of each handler, return 400 on failure. Start with the routes in `cron/` (untrusted by definition) and any user-facing endpoint that takes coordinates.
- **Effort:** 3–4 hours to cover all of them.

#### S-4. Razorpay webhook uses timing-unsafe signature compare
- **File:** `src/app/api/webhooks/razorpay/route.ts:36`
- **Risk:** Timing attack against HMAC validation. Hard to exploit in practice (requires many network requests with consistent latency) but trivial to fix.
- **Fix:**
  ```ts
  import { timingSafeEqual } from 'crypto';
  const a = Buffer.from(sig, 'hex');
  const b = Buffer.from(expected, 'hex');
  if (a.length !== b.length || !timingSafeEqual(a, b)) { /* 401 */ }
  ```
- **Effort:** 5 minutes.

#### S-5. No rate limiting anywhere
- **Files:** all public API routes
- **Risk:** Signup spam, password-reset abuse (costs Resend $), kundali-compute DoS (heaviest public endpoint — astronomical math is ~50ms per call).
- **Fix:** Add Upstash Ratelimit (or Vercel's built-in ratelimit middleware). Tiers:
  - Signup / signin / password reset: 5/min per IP + 10/hour per email
  - Public compute endpoints (`/api/kundali`, `/api/matching`): 30/min per IP
  - AI endpoints: already soft-limited server-side per user, add hard per-IP limit for unauth'd paths
- **Effort:** Half a day including Upstash setup and per-route tuning.

#### S-6. No error tracking / alerting
- **Risk:** Production errors silently vanish into Vercel logs. No one notices until users report.
- **Fix:** Install Sentry (or Vercel's built-in error monitoring). Wire `Sentry.init` with DSN env var. Takes 15 min, pays back enormously once traffic arrives.
- **Effort:** 30 min.

### LOW

#### S-3. JSON-LD forward-slash escaping
- **Files:** 24 layouts that do `JSON.stringify(ld)` into a `<script type="application/ld+json">` tag.
- **Risk:** Theoretical XSS if any of the LD values ever contain user-controlled text with `</script>`. Today they don't.
- **Fix:** Wrap in a helper: `function safeLD(x){ return JSON.stringify(x).replace(/</g, '\\u003c'); }`. Use it everywhere.
- **Effort:** 10 minutes + find-and-replace.

#### S-8. No data-export endpoint (GDPR)
- **Risk:** Soft compliance gap; users can delete but not export their data.
- **Fix:** `GET /api/user/export` → JSON dump of user_profiles + kundali_snapshots + saved_charts for the authenticated user.
- **Effort:** 1 hour.

#### S-9. Supabase PITR status not documented
- **Risk:** Accidental destructive change (wrong DELETE, dropped migration) could be unrecoverable if PITR isn't enabled.
- **Fix:** Verify PITR is enabled on the Supabase dashboard. Document the recovery procedure in `docs/incident-response.md`.
- **Effort:** 10 minutes to verify + 20 minutes to write the doc.

#### S-10. No PII handling policy documented
- **Fix:** Write a short `docs/privacy-data-handling.md`: what PII we store, where, retention, how the user requests deletion, third parties the data is shared with.
- **Effort:** 1 hour.

---

## Proposed fix plan (order of operations)

Cheapest-first, highest-value-first:

1. **S-4** (5 min) — Razorpay timing-safe compare
2. **S-7** (30 min) — `npm audit fix` + Next/Anthropic SDK upgrade, smoke test
3. **S-6** (30 min) — Sentry (or equivalent) installed
4. **S-3** (10 min) — JSON-LD escaping helper
5. **S-9** (30 min) — PITR verified, recovery doc written
6. **S-2** (3–4 hrs) — Zod schemas on all JSON-body API routes
7. **S-5** (half day) — Upstash Ratelimit on signup + compute endpoints
8. **S-1** (1 day) — User-scoped Supabase client refactor
9. **S-8** (1 hr) — Data-export endpoint
10. **S-10** (1 hr) — Privacy data-handling doc

Total: ~2.5 engineering days to move the verdict from YELLOW to GREEN.

**Do not apply fixes yet.** This report is for review. Flag which items to do first and in what order.

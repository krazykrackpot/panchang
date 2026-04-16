# 10 — Security review

Use this before any production launch, and then quarterly. Covers OWASP
top 10 as applied to a typical Supabase/Next.js full-stack app, plus
app-specific threat modeling.

---

I want a security review of `<PROJECT NAME>` before `<milestone — public
launch / handling payments / accepting user-generated content>`.

## Tech surface

- Framework: Next.js App Router, TypeScript
- Auth: `<Supabase Auth / Clerk / NextAuth>`
- DB: Postgres with RLS
- Payments (if any): `<Stripe / Razorpay / none>`
- File uploads (if any): `<Supabase Storage / S3 / none>`
- Third-party scripts: `<list>`
- Public-facing forms: `<list>`
- External webhooks: `<Stripe, email providers, etc.>`

## OWASP-ish checklist (work through in order, don't skip)

### 1. AuthN / AuthZ
- [ ] Every user-owned table has **RLS enabled** with policies tested
      against a real anon-key client (not just service role).
- [ ] No API route trusts a client-provided `user_id`. Always derive from
      the verified Bearer token.
- [ ] No API route uses `SUPABASE_SERVICE_ROLE_KEY` to do work that
      should require a user token. Service role bypasses RLS — audit every
      use.
- [ ] Session tokens: HTTP-only cookies where possible, correct `SameSite`,
      `Secure` in production.
- [ ] OAuth state parameter verified (CSRF protection).
- [ ] Password reset links expire, single-use, rate-limited.
- [ ] No signup race can create duplicate accounts with the same email
      (checked at DB level with a unique constraint).

### 2. Input validation
- [ ] Every API route validates input with Zod (or equivalent) at the
      boundary. Never trust `req.body`.
- [ ] Query params validated too.
- [ ] Max lengths enforced server-side (not just client-side).
- [ ] File uploads: MIME + size + extension verified server-side.

### 3. Output encoding (XSS)
- [ ] No `dangerouslySetInnerHTML` with user-controlled content. If used
      for trusted static content, document what's in it.
- [ ] No user input rendered into `<script>`, `href`, `src`, or `on*`
      handlers without encoding.
- [ ] Any markdown rendering uses a sanitizer (DOMPurify, remark-rehype
      with sanitize).

### 4. SQL injection
- [ ] All queries use parameterized statements (Supabase client does this
      by default; raw SQL paths audited).
- [ ] No string concatenation to build queries.

### 5. CSRF
- [ ] State-changing API routes are protected. For cookie-auth: CSRF
      token or `SameSite=Strict`. For Bearer-token auth: origin check
      on state-changing routes.

### 6. Secrets
- [ ] No secrets in the repo (`.env*` in `.gitignore`, verified).
- [ ] Secrets rotated after any incident / offboarding / public leak scan.
- [ ] `NEXT_PUBLIC_*` env vars contain NO secrets. They ship to the client.
- [ ] Service-role keys only on server. Verify none are imported by a
      `'use client'` file.

### 7. Rate limiting
- [ ] Signup, signin, password reset — rate-limited per IP AND per email.
- [ ] Public API routes: sensible per-IP limits.
- [ ] Expensive endpoints (AI, PDF gen, kundali compute) — per-user limits.

### 8. Logging / observability
- [ ] Errors log structured data with a tagged prefix, never user tokens,
      passwords, PII.
- [ ] Auth events (signup, signin, password reset) logged for forensic use.
- [ ] Unhandled promise rejections reach error tracking (Sentry / Vercel).

### 9. Dependencies
- [ ] `npm audit` (or equivalent) runs green — or every exception
      documented with a risk assessment.
- [ ] Dependabot / Renovate enabled; security updates auto-PR'd.
- [ ] No suspicious packages (typosquats, single-maintainer hobby projects
      holding critical paths).

### 10. Payment / PII specifics (if applicable)
- [ ] Card data NEVER touches our servers — Stripe Elements / Checkout / Razorpay
      hosted fields only.
- [ ] Webhook signatures verified server-side with the shared secret.
- [ ] Idempotency keys on mutation webhook handlers.
- [ ] PII columns (email, name, DOB, location) — encrypted at rest via the
      provider or column encryption, documented where.
- [ ] GDPR / data export + deletion — user can request both, manually if
      not automated.

## App-specific threat model

Answer these concretely:

1. **What's the worst thing an attacker could do if they got one user's
   access token?** (answer should not include "read every user's data")
2. **What's the worst thing they could do with the service role key?**
   (answer: total takeover — which is why it must never leak)
3. **What's the weirdest input someone could send to `<ANY USER-FACING
   ENDPOINT>`?** Have you tested it?
4. **What happens if Stripe / your email provider / Supabase is down for
   30 minutes?** Graceful degradation, or cascade failure?
5. **What's the blast radius of an accidental `DELETE` in production?**
   Do you have PITR (point-in-time recovery) enabled?

## What I want back

1. A report file at `docs/security-audit-<date>.md` with each checklist
   item marked `[x]` / `[ ]` / `[n/a]` plus a 1-line justification.
2. Specific issues found, ranked by severity (Critical / High / Medium / Low).
3. For each issue: file + line + remediation.
4. A 2-sentence "overall risk posture" summary — green / yellow / red.
5. A prioritized fix plan, cheapest-first. Don't fix anything yet — wait
   for my approval.

## What I do NOT want

- A generic OWASP listicle. I want claims about *this* codebase with file
  evidence.
- "Looks fine" verdicts. If you haven't opened the file, say so.
- A parade of low-severity nits obscuring the actual risks.
- Fixes applied without approval — the point of this pass is visibility.

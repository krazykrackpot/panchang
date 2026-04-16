# 11 — Launch checklist

Use this in the final days before public launch. Each item is small, but
skipping any of them tends to produce embarrassing Day-1 bug reports.

---

I want to do a pre-launch pass for `<PROJECT NAME>`. Launch date:
`<YYYY-MM-DD>`. Launch surface: `<Product Hunt / Twitter / HN / invite-only
beta>`. Expected Day-1 traffic: `<rough order of magnitude>`.

## Walk through every item. Each gets a concrete verdict + evidence.

### Reliability

- [ ] `npx next build` passes with zero warnings in changed areas
- [ ] `npx vitest run` passes all suites; recent flakes investigated
- [ ] Playwright E2E covers the critical user journeys (signup → first
      value → return visit)
- [ ] Every API route returns a meaningful error on bad input (not `500`)
- [ ] Every client-side fetch surfaces errors to the user, not silently
- [ ] Service worker / PWA cache versioned (so old clients invalidate)
- [ ] No `console.log` / `console.error` for expected control flow
- [ ] All `TODO` / `FIXME` comments in critical paths reviewed
- [ ] Error tracking installed (Sentry / Vercel / equivalent) and verified
      by triggering a test error in production

### Performance

- [ ] Lighthouse mobile: LCP ≤ `<target>`, CLS ≤ 0.1, INP ≤ 200ms
- [ ] Bundle analyzer: no surprises in the top 10; heavy libs lazy-loaded
- [ ] Fonts: `display: 'swap'`, only needed subsets loaded
- [ ] Images: all via `next/image` with explicit dimensions
- [ ] Slow routes (> 500ms p95): EXPLAIN plan reviewed, indexes in place
- [ ] Above-the-fold content renders without client-side fetch waterfall

### Security

- [ ] `docs/security-audit-<date>.md` complete; all Critical + High fixed
- [ ] No secrets in repo; `NEXT_PUBLIC_*` vars audited
- [ ] RLS on every user-owned table; verified with anon key
- [ ] Rate limits on signup / signin / password reset
- [ ] Webhook signatures verified
- [ ] `npm audit` — no high or critical unresolved

### Observability

- [ ] Error tracking active in production
- [ ] Vercel Analytics / Speed Insights / field-data vitals enabled
- [ ] Key custom events tracked (signup, first-value action, conversion)
- [ ] Auth events logged for forensics (signup, signin, password reset,
      signout) with timestamp + IP
- [ ] Uptime monitoring pointed at `/api/health` (create it if missing)
- [ ] Database backups configured + tested (PITR on Supabase, or a
      restore drill)

### SEO / metadata

- [ ] Every public page has unique `<title>` + `<meta description>`
- [ ] Open Graph + Twitter card image for every shareable URL
- [ ] JSON-LD structured data where applicable (Organization, Product,
      WebSite, BreadcrumbList, specific schemas)
- [ ] `sitemap.xml` present, includes every public page, hreflang for
      each locale
- [ ] `robots.txt` disallows dashboard/admin/embed/private routes
- [ ] Canonical URLs set
- [ ] OG image preview tested via [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Locale detection does NOT confuse search crawlers (default locale
      served at both `/` and `/<default>/`)

### Accessibility

- [ ] axe-core / Lighthouse accessibility score ≥ 95
- [ ] Every interactive element keyboard-accessible with visible focus
- [ ] Every image has `alt` (decorative → `alt=""`)
- [ ] Every form control has a labeled input
- [ ] Color contrast ≥ WCAG AA for body text
- [ ] Skip-to-content link at top of page
- [ ] Tested with VoiceOver or NVDA on at least the main flow

### Internationalization

- [ ] `scripts/check-locale-parity.ts` passes — every key present in
      every locale
- [ ] Each supported locale: smoke-tested on main flow (home, signup,
      primary feature)
- [ ] No raw `pages.*` / `components.*` key paths in rendered HTML
      (run the i18n Playwright spec)
- [ ] Fonts load correctly for each script
- [ ] Date/number formatting uses locale-aware APIs
- [ ] RTL layout tested if any RTL locales shipped

### Legal / policy

- [ ] Privacy policy published, accessible, mentions data retention +
      third parties
- [ ] Terms of service if users sign up
- [ ] Cookie banner if applicable (GDPR / CCPA)
- [ ] Contact / support email published
- [ ] Company/product entity, refund policy (if payments)

### Operational

- [ ] Domain: DNS propagated, HTTPS certificate valid, `www` ↔ apex
      redirect decided
- [ ] Deploys auto-trigger from `main` and production URL tested
- [ ] Rollback plan documented: "if prod breaks, I promote previous
      deployment via `vercel promote <id>`"
- [ ] One person other than you has the credentials to roll back
- [ ] CDN / caching behavior understood (what's cached where, for how long)
- [ ] First-24-hour plan: who watches metrics, who responds to incidents

### Launch-day logistics

- [ ] Launch content prepared: tweet, PH listing, screenshot set, demo GIF
- [ ] 3 friends/users already know launch day + will try it live
- [ ] Support channel set up (email, Discord, Intercom — pick ONE)
- [ ] Canned responses for expected questions
- [ ] You have eaten and slept. Seriously. The single most common cause
      of Day-1 incident escalation is a founder who hasn't.

## Deliverable

For each bucket above: `[PASS / FAIL / N/A]` with 1-line evidence.

If any item is FAIL: file + action + estimated cost in hours.

If the overall verdict is anything other than "launch-ready," write the
specific blockers and propose whether to delay launch or ship with known
gaps + post-launch fix plan.

## What NOT to do

- Do not merge a "fix" to a checklist item without verifying the fix
- Do not mark items complete based on "I think we have that" — open the
  file, run the command, show the output
- Do not launch with a critical or high security finding outstanding
- Do not launch to full traffic without a staged rollout plan for anything
  user-data-destructive

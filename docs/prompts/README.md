# Web-app prompt library

A curated set of prompts for building full-stack web applications with Claude
Code. Each prompt encodes the hard-won rules from ~220 commits across several
production apps — visible errors, single source of truth, idempotent writes,
URL-over-cache precedence, no bulk-regex, and so on.

Use them by **copying the file content into a Claude Code message**, then
replacing every `<BRACKETED>` placeholder with your specifics. The longer the
prompt, the more leverage you get — front-loaded precision prevents hours of
retroactive rework.

## The library

| Phase | File | When to use |
|---|---|---|
| Discovery | [`00-brainstorm-product.md`](00-brainstorm-product.md) | Before you know what you're building — explore the problem, user, and shape |
| Day 0 | [`01-day-zero-architecture.md`](01-day-zero-architecture.md) | First session of a new project — stack, folders, principles, first PRs |
| Day 0 | [`02-database-schema.md`](02-database-schema.md) | Designing tables, relationships, RLS policies, and migrations |
| Day 0 | [`03-auth-flow.md`](03-auth-flow.md) | Wiring signup, signin, OAuth, session, and RLS |
| Day 0 | [`04-design-system.md`](04-design-system.md) | Design tokens, primitive components, Tailwind/CSS setup |
| Day 0 | [`05-i18n-setup.md`](05-i18n-setup.md) | Multi-locale support wired correctly from commit #1 |
| Daily | [`06-feature-delivery.md`](06-feature-delivery.md) | **Most-used.** Template for adding any new feature to an existing app |
| Daily | [`07-bug-report.md`](07-bug-report.md) | Reporting a bug precisely enough that Claude fixes the right thing |
| Weekly | [`08-refactor-safely.md`](08-refactor-safely.md) | Non-trivial refactor with guardrails against regression |
| Weekly | [`09-performance-audit.md`](09-performance-audit.md) | Systematic perf pass — LCP, bundle, DB, caching |
| Pre-launch | [`10-security-review.md`](10-security-review.md) | OWASP-ish checklist + app-specific threat model |
| Pre-launch | [`11-launch-checklist.md`](11-launch-checklist.md) | Production-readiness gate before first public release |

## The 10 universal principles (encoded into every prompt)

These are baked into every prompt below. They cost ~0 to follow and hours to
violate:

1. **Single source of truth** — shared data has ONE loader
2. **Errors are visible** — no silent catches, no ignored `error` fields
3. **Features integrate the moment they ship** — new page → main nav, same commit
4. **Writes are idempotent** — dedupe by natural key before every insert
5. **Loading state always terminates** — every branch flips loading to false
6. **URL > local state > cache** — mount effects check URL first, precedence documented
7. **Library limits documented at call sites** — no "I'll remember"
8. **No `setTimeout` as event substitute** — use real readiness signals
9. **No bulk regex on TypeScript/class names** — AST tools or nothing
10. **All locales required, always** — every key lands in every locale on the same commit

Each prompt restates only the principles relevant to its scope, so you don't
have to re-paste them. But the principles are the spine — they show up
throughout.

## How to use this library well

1. **Don't skip the brainstorm.** `00-brainstorm-product.md` feels slow but
   saves weeks. If you can't answer "who is this for and what's out of scope"
   cleanly, don't write code yet.

2. **Do Day 0 once, right.** The five Day-0 prompts (01–05) are one-time
   scaffolding. Spend real time on them at the start. Iterate the responses
   at least twice before committing to an approach.

3. **Make `06-feature-delivery.md` muscle memory.** This is the one you'll
   use most — every new feature goes through it. The discipline is what
   keeps quality consistent across 200+ commits.

4. **When in doubt, write a bug report.** `07-bug-report.md` forces clarity.
   Even if you're the one reading it, writing the bug report is often how
   you find the bug.

5. **Run the pre-launch prompts (09–11) before exposing anything to users.**
   Not after.

## Extending the library

When you hit a class of problem that takes >1 hour to solve twice, write a
new prompt for it. Put it here, version control it, use it the third time.

Good candidates not yet in the library:
- AI feature integration (chat, embeddings, tool use)
- Payments integration (Stripe/Razorpay patterns)
- Email/notification system (transactional + marketing)
- Background jobs / cron / queue design
- Observability (logs, metrics, tracing, error tracking)
- Data migration (production schema changes with zero downtime)

Add them when you next encounter the problem — fresh pain produces better
prompts than remembered pain.

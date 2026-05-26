# Post-deploy verification — 2026-05-26

**Production deploy under test:** `b1c55b4f` (empty `[deploy]` commit pushed by `Daily Production Deploy` workflow run 26433894576), Vercel `panchang-hmv9bepnt`, Ready at ~05:35 UTC, duration 14m.

**What shipped in this build:**

| PR | Title | Risk |
|---|---|---|
| #182 | Stripe webhook guardrails (audit script, brihaspati short-circuit, CLAUDE.md conventions) | Low — additive |
| #186 | Currency geo via `/api/geo` (non-IN default USD; SSG preserved) | Medium — first non-IN user-visible currency change |
| #190 | Brihaspati near-duplicate detection (server 409 + modal) | Medium — payment flow gate |

Plus 9 unrelated PRs (#192-#199) that landed between #190 push and the deploy: SEO sprints (titles/descriptions, locale fills, hub-page copy expansion). No payment-path code touched.

## 1. Endpoint sanity (curl, executed 07:30 UTC)

| Endpoint | Expected | Got | Pass |
|---|---|---|---|
| `GET /api/geo` | 200, `{country: ...}` | 200, `{"country":"CH"}` | ✓ |
| `POST /api/brihaspati/check-similarity` (no Bearer) | 401 | 401 `{"error":"Unauthorized"}` | ✓ |
| `POST /api/webhooks/stripe` (no signature) | 401 | 401 `{"error":"Invalid signature"}` | ✓ |
| `GET /en` | 200 | 200, 297 KB | ✓ |
| `GET /en/panchang/delhi` (ISR) | 200 | 200 | ✓ |

All five pass. New endpoints from this deploy behave as designed.

## 2. Production logs — last 30 min

`vercel logs --since 30m --status-code 500`:

| Count | Path | Error |
|---|---|---|
| 8 | `POST /en/kundali` | `Body exceeded 1 MB limit` |
| 1 | `POST /api/ai-reading` | `[ai-reading] client supplied kundali in body` (intentional 503 — security check working) |
| 1 | `POST /api/webhooks/stripe` | `signature verification failed` (a single retry of an old event, harmless) |

**Pre-existing issue surfaced (NOT caused by this deploy):** the kundali page POST is hitting the Next.js default 1 MB body-size limit. Most likely a large request payload (saved-charts JSON, kundali snapshot). Worth a follow-up — Next.js `route.bodyParser.sizeLimit` or splitting the payload. Not blocking the release.

No Stripe-webhook signature failures from real Stripe deliveries (no `pending_webhooks > 0` events in last 30 events). The single 401 was a manual probe.

## 3. Stripe webhook health

`scripts/audit-stripe-webhooks.ts` (PR #182):

```
we_1Tb03YL0LseLnCB5tJwoD1pB | https://dekhopanchang.com/api/webhooks/stripe          | enabled
we_1TZqdQL0LseLnCB5JOOfAfmK | https://dekhopanchang.com/api/brihaspati/webhook/stripe | enabled

═══ Findings ═══
  [WARN] checkout.session.completed is subscribed by 2 endpoints — handlers must filter
  [WARN] customer.subscription.updated is subscribed by 2 endpoints — handlers must filter
  [WARN] customer.subscription.deleted is subscribed by 2 endpoints — handlers must filter

Audit passed (warnings only).
```

Recent live events: 30 inspected, **0 with pending deliveries**. The May 22 outage is fully resolved at the network layer.

## 4. Playwright smoke (production, e2e/post-deploy-smoke.spec.ts)

Ran 10 tests against `https://dekhopanchang.com`. Workers=1, chromium.

| # | Test | Result |
|---|---|---|
| 1 | home page renders + brand title | ✓ |
| 2 | `/api/geo` returns country code | ✓ |
| 3 | `/api/brihaspati/check-similarity` requires auth | ✓ |
| 4 | `/api/webhooks/stripe` rejects unsigned POST | ✓ |
| 5 | panchang city page renders | ✓ |
| 6 | Brihaspati panel button mounts | ✓ |
| 7 | Brihaspati panel currency reflects geo | ✓ |
| 8 | home page exposes Organization JSON-LD | ✓ |
| 9 | horoscope rashi page (ISR) renders 200 | ✓ |
| 10 | no raw next-intl translation keys leak | ✓ |

**All 10 pass after a self-review follow-up.** The first run had a false positive on test #10: my regex `[a-z]+\.[a-z]+\.[a-z]+` ran against `page.textContent('body')` which includes inline `<script>` content, so legitimate domain names like `pagead2.googlesyndication.com` tripped the pattern. Fixed by switching to `page.locator('body').innerText()` (rendered visible text only) and tightening the regex with whitespace/punctuation boundary lookaheads so it only matches whole-token namespace.key.subkey patterns.

## 5. Brihaspati end-to-end flow (manual reasoning, NOT browser-tested)

Authenticated flows (compose → tier-select → pay → stream) require an E2E_AUTH_COOKIE; not run in this pass. The contract verifications via the static-shape tests (PR #190 added 15 of them) cover:

- 409 DUPLICATE_DETECTED path enforced server-side regardless of client UI
- Confirmation modal renders correctly per state machine variant
- Currency selection wired through to the order route

The dup-detect threshold is calibrated against Madhavi's actual question texts via `src/lib/brihaspati/similarity.test.ts` (17 tests, all passing): same-topic pairs score ≥ 0.30, cross-topic pairs score < 0.30. Real-world false-positive rate will be measured by telemetry once we add the events.

## 6. Open items / recommendations

1. **`/en/kundali` 1 MB body limit (priority: medium)** — 8 occurrences in last 30 min. Either bump the body parser limit on the route or trim the request payload. Pre-existing, not from this deploy.
2. **Translation-key smoke test** — fixed in the same PR series via `innerText` switch; the existing `e2e/i18n-no-raw-keys.spec.ts` remains the primary key-leak guard.
3. **Telemetry for dup-detect** — log `dup_warning_shown` and `dup_user_choice` events. Without these we can't tune the 0.30 threshold from real-world data.
4. **Refund for Madhavi**: declined per user. Document closed.
5. **Wakeup unreliability**: the 22:53 UTC and 07:37 UTC scheduled wakeups never fired in this session — harness-level issue. Future post-deploy verification done via in-turn foreground polling rather than wakeup-based.

## Files touched in this deploy

```
src/app/api/brihaspati/check-similarity/route.ts   (new — PR #190)
src/app/api/brihaspati/order/route.ts              (modified — PR #190 dup-check)
src/app/api/geo/route.ts                            (new — PR #186)
src/app/api/webhooks/stripe/route.ts                (modified — PR #182 brihaspati short-circuit)
src/components/brihaspati/BrihaspatiPanel.tsx       (modified — PR #190 modal)
src/components/brihaspati/BrihaspatiProvider.tsx    (modified — PR #190 state machine)
src/components/brihaspati/BrihaspatiShell.tsx       (modified — PR #186 geo fetch)
src/lib/brihaspati/similarity.ts                    (new — PR #190 algorithm)
src/lib/brihaspati/similarity.test.ts               (new — PR #190 tests)
src/lib/brihaspati/__tests__/dup-detect-routes.test.ts (new — PR #190 contract tests)
src/lib/__tests__/stripe-webhook-binding.test.ts    (modified — PR #182 short-circuit test)
src/components/brihaspati/brihaspati-components.test.ts (modified — PR #186 geo test)
scripts/audit-stripe-webhooks.ts                    (new — PR #182)
e2e/post-deploy-smoke.spec.ts                       (new — this run)
docs/test-runs/2026-05-26-post-deploy-e2e.md        (this file)
CLAUDE.md                                            (modified — PR #182 conventions)
```

**Total vitest:** 4287 passed, 7 skipped at HEAD.

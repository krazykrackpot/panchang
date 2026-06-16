# Learnings from 700+ commits

Codified from `CLAUDE.md` (lessons A–DD, post-incident rules), `MEMORY.md` (incident files), `docs/audits/*`, and the change-log of `fix:`/`hotfix:` commits since April 2026.

Severity scale:

| Severity | Meaning |
|---|---|
| **Critical** | Silent failure for days, real revenue/data loss, or production outage. The kind of bug that finds *you* (via Stripe email, GSC drop, or a furious user). |
| **High** | Wrong content rendered on a high-traffic path, Vercel cost spike, or a visible defect on the golden user flow. |
| **Medium** | Wrong content on an edge case, easily-noticed defect, or a near-miss caught in review/audit. |
| **Low** | Style, cosmetic, or extreme-edge bug that didn't ship or shipped invisibly. |

## Master table

| # | Bug / Mistake / Gap | When | Severity | How it could / should have been avoided |
|---|---|---|---|---|
| **Astronomy + domain correctness** ||||
| 1 | Purnimant masa computed as Full Moon - 15 *fixed* days; actual lunar interval is 13.9–15.6 days → months started on Ashtami | Apr 2026 (Lesson K) | **High** | Never apply fixed intervals to lunar phenomena. Spot-check ≥3 computed dates against Prokerala/Shubh before shipping ANY astro computation. |
| 2 | Daily panchang masa came from solar `getMasa()`, festivals used lunar boundaries → users saw different months on different pages; Adhika Masa missing from daily view | Apr 2026 (Lesson M) | **High** | "Same data, same source." Two paths loading the same concept must share one loader. Grep for the concept before adding a second one. |
| 3 | Pushkar Bhaga degree tables existed twice with *different values* | Apr 2026 (Lesson Q) | **High** | All Jyotish constants → `src/lib/constants/`. Grep before creating any new constant file. |
| 4 | Naisargika Maitri (BPHS friendship table) existed in 16 files; 5 had errors → Ashta Kuta matching wrong | Apr 2026 (Lesson S, Z) | **Critical** | When changing ANY Jyotish constant: grep across entire codebase, count files that agree, align ALL in one commit. The majority reading is almost always right; a single outlier is the bug. |
| 5 | Moolatrikona Moon range was Taurus 3–30° in one file, 0–3.33° in another (canonical: 4–20°) | Apr 2026 (Lesson U) | **High** | Pre-ship checklist: BPHS Ch.4 cross-check for every dignity table. Define once, import everywhere. |
| 6 | Yoga detection false positives: Vasumati `.some()` not `.every()` (79% trigger rate); Mahabhagya checked lord's sign instead of ascendant's; Gauri reversed aspect direction (50% false positive); Kemadruma missed conjunction cancellation | Apr 2026 (Lesson T) | **High** | After writing any detector, compute expected frequency on random charts. A "rare" yoga triggering >20% = bug. Document aspect direction explicitly: `houseOffset(FROM, TO)`. |
| 7 | Ketu's speed was negated from Rahu's → UI showed Ketu as non-retrograde + broke downstream speed-sign consumers | Apr 2026 (Lesson W) | **High** | Deriving one body from another: transform position only, not velocity, unless there's a physical reason. |
| 8 | Combustion orbs didn't reduce for retrograde Mercury/Venus (BPHS: Mercury 14°→12°, Venus 10°→8°) | Apr 2026 (Lesson X) | **Medium** | All `computeCombust()` call sites must pass `isRetrograde`. Type-check the signature so missed args break the build. |
| 9 | Graha Yuddha winner used `Math.abs(latitude)` instead of higher NORTHERN latitude → wrong winner | Apr 2026 (Lesson Y) | **Medium** | BPHS Ch.3 + Surya Siddhanta cross-check on every classical rule. The text usually disambiguates. |
| 10 | Festival defs use Amant month names, generator matched against `.purnimanta` → Diwali 30d early, Dussehra 11d early during Krishna Paksha | May 2026 (Lesson ZC) | **Critical** | Festivals always match `.amanta` (Prokerala/Drik convention). Verify any new festival against published panchang before merging. |
| 11 | `panchangDayForJD` uses NM-day attribution; Drik uses tithi-at-sunrise → off-by-one day around Adhika boundaries (2026-05-17, 2026-06-15, 2026-06-30) | Pre-existing, surfaced Jun 2026 | **High** (latent) | Documented in `docs/tech-debt/panchang-day-attribution-bugs.md` with 3 reproducer dates. Fix is its own dedicated PR with 30–50 case Drik parametric tests; trigger conditions for promotion are explicit. |
| 12 | `purnimantMasa` was hand-rolled in panchang-calc with wrong Adhika boundary rule; `/calendars/masa` used the canonical engine → "absolute fuck show" diff | 2026-06-05 (PR #432) | **High** | Same as #2 (Lesson M). The hand-rolled comment even named the wrong boundary. Always go through `getPurnimantMasaForDate` / `getLunarMasaForDate`. |
| 13 | Pre-1880 birth dates used IANA tzdb (zone meridian) instead of longitude-based LMT → Einstein's chart was 13 min UT off, ~3.25° ascendant shift | 2026-05-31 (commit `bd7925b1`) | **Medium** (low traffic) | Standardisation cutoffs are data; engine reads them. Validate any historical-chart feature against Astro-Databank canonical UTs. |
| 14 | Meeus retrograde stations: Jupiter ~40d late, Saturn ~13d late vs Swiss Ephemeris | Apr 2026 (Lesson DD) | **Medium** | When Meeus fallback is active, push a warning to `KundaliData.warnings[]` and surface to users. Don't silently degrade accuracy. |
| **Timezone + date handling** ||||
| 15 | `new Date(y, m-1, d)` constructor interpreted args in the server's TZ → off-by-one on UTC+N runners | Apr 2026 (Lesson L, V) | **High** | Grep `new Date(` in any computation file before shipping. Every instance must be `Date.UTC(...)` or have a justifying comment. `jdToDate` was a single-source case that broke dozens of callers. |
| 16 | Direct browser TZ usage (`Intl.DateTimeFormat().resolvedOptions().timeZone`) → user in Switzerland looking at Varanasi panchang saw Swiss times | May 2026 (commit `ebc3a3a7` + audit completion 2026-05-07) | **High** | Established pattern: `useLocationStore.getState().timezone || browserTz || 'UTC'`. Browser TZ is the fallback, not the default. Audit completed across 7 pages. |
| 17 | Ekadashi parana window across Seattle/NY/Sydney was off by ~12h | PR #498 + PR #634 | **High** | Western-hemisphere city must appear in test coverage when shipping ANY time-window feature. Heuristic-that-works-for-Delhi has shipped twice and broken in Western hemisphere both times. |
| 18 | ISR-cached pages mounting `'use client'` components that read `new Date()` in render → React #418 hydration mismatch → React killed the tree → analytics silently stopped → **80% pageview collapse over 12h** | 2026-05-28 (Lesson ZD) | **Critical** | Two-layer gates now in place: `scripts/audit-isr-hydration.ts` (static + baseline) + `e2e/isr-hydration-crawl.spec.ts` (runtime). Neither gate may be deleted/skipped to make a PR pass. Render-scope `new Date()` is banned in ISR-mounted clients. |
| 19 | TodayPanchangWidget request used browser-local date even when location was in a different TZ → off-by-one panchang day at midnight rolls | 2026-06-14 (PR #701 Gemini round 1) | **High** | Resolve "today" in the target `ianaTimezone` via `toLocaleDateString('en-CA', { timeZone })`. Browser-local is for the browser, not for the location query. |
| **Async / state / hydration** ||||
| 20 | BirthForm `useEffect` overwrote `initialData` with logged-in user's profile → edit mode silently restored the original data | Apr 2026 (Lesson N, CC) | **High** | Trace trigger → state → effects → renders BEFORE fixing. Find useEffects that stomp on the state you're inspecting. Auto-fill effects must check `initialData` and skip if editing. |
| 21 | Welcome email bombardment: `/api/user/profile` POST sent welcome email on every call, a `/dashboard` re-render loop hit profile repeatedly | 2026-05-20 (hotfix `a02a2bbf`) | **Critical** | Per-user idempotency at DB level (`*_sent_at` column or unique constraint), NEVER a client-passed flag like `body.isRecompute`. New `sendEmail` calls require this gate before merge. |
| 22 | Dashboard re-render loop (React #310, hotfix `8591dd9e`) was the multiplier for #21 | 2026-05-21 | **High** | Same lesson: don't reintroduce useEffect dependency chains that re-hit profile POST. |
| 23 | Race condition: rapid location updates in `TodayPanchangWidget` could overwrite fresh panchang with a stale in-flight response | 2026-06-14 (PR #701 Gemini round 3) | **Medium** | `AbortController` cancels prior fetch before launching new one. AbortError swallowed silently. |
| 24 | Fetch error response with `{error: "..."}` body would `setPanchang(data)` and then crash on `panchang.tithi.name` | 2026-06-14 (PR #701 Gemini round 2) | **High** | Check `res.ok` AND `data.error` before setting state. Errors throw into the existing `.catch()` rather than corrupt state. |
| 25 | `useState` initializers reading from Zustand store → hydration mismatch on hora pages | PR #483 | **High** | Drop store-derived `useState` initializers. Use `useEffect` to populate from store after mount. Same pattern as #18 (Lesson ZD). |
| **Same-data-twice / duplication** ||||
| 26 | 5 panchang cards lived as inline JSX in `PanchangClient.tsx` AND a generic loop in `TodayPanchangWidget.tsx` → fixed one, other stayed broken; 3 rounds of user frustration | Apr 2026 (Lesson ZA) | **High** | Extract shared components. After ANY display bug, grep for the pattern app-wide and fix all instances in one commit. |
| 27 | Engine vs page-level Adhika rule duplicated → drift on `/panchang` vs `/calendars/masa` | 2026-06-05 (PR #432) | **High** | See #12. The corrected canonical lives in `src/lib/calendar/hindu-months.ts`. |
| 28 | EXALTATION constants existed in 12+ files; PLANET_NAMES in 40+. Duplicate dosha detection producing different answers for the same chart | Ongoing audit | **High** | Canonical-constants files listed in CLAUDE.md "Never duplicate logic or constants". Grep before creating. Tech debt log: `docs/tech-debt/duplicate-code-audit.md`. |
| **Env var handling (the trailing `\n` plague)** ||||
| 29 | `STRIPE_SECRET_KEY` stored as `"sk_live_...\n"` in Vercel — caught only because `vercel env pull` to a non-trimming script failed (raw Stripe call returned `Invalid API Key`) | 2026-06-12 (audit) | **Medium** (caught) | CLAUDE.md rule: `Always .trim() env vars in API routes`. All 8 in-app call sites already trimmed, so production was safe by luck. Still re-rotated for hygiene. |
| 30 | `PRECOMPUTE_STORAGE` stored as `"blob\n"` — the strict-equality `switch` in `getStorage()` never matched `case 'blob':` → every precompute read threw and fell back to live compute → **entire precompute migration silently bypassed in production for 9 days** | 2026-06-15 (PR #703) | **Critical** | Same rule (#29). Now baked into `storage.ts` + `reader.ts` defensively. Error message now includes `JSON.stringify(resolvedValue)` so the trailing-junk bug is debuggable from the throw alone. |
| 31 | `NPS_TOKEN_SECRET` rotated without setting `NPS_TOKEN_SECRET_PREV` first → 87 in-flight NPS feedback emails silently invalidated, 60 days of feedback collection dropped | 2026-06-06 → 2026-06-10 (PR #666) | **Critical** | Token format v2 has `kid` (sha256 prefix) so verify routes to current vs PREV. Operational rule documented in `project_nps_token_rotation_rule.md`: ALWAYS set PREV before rotating, remove PREV after ~14d. `nps_endpoint_log` audit table now records every click — silent invalidation surfaces in hours, not weeks. |
| 32 | Vercel env values with trailing `\n` are widespread (BLOB_WEBHOOK_PUBLIC_KEY, NEXT_PUBLIC_SUPABASE_*, all Stripe Price IDs, SUPABASE_SERVICE_ROLE_KEY etc) | Latent | **Low** (latent) | All consumers use `.trim()` by convention, so most are safe. But anything that does *strict equality* or passes raw env into a switch is at risk. Audit candidates next time a regression like #30 surfaces. |
| **External integration / library quirks** ||||
| 33 | Stripe webhook URL was changed to `https://www.dekhopanchang.com/...`; Vercel 308-redirects `www.` → apex; Stripe doesn't follow redirects on POST → **3 days of silent webhook failures** | 2026-05-22 → 2026-05-25 | **Critical** | New audit script `scripts/audit-stripe-webhooks.ts` flags `www.`, non-HTTPS, disabled endpoints, duplicate subscriptions. Run before any Stripe-stack change. New CLAUDE.md section codifies the no-`www.` rule. Brihaspati's separate endpoint kept paid traffic flowing — the failure had zero customer impact only by accident. |
| 34 | Stripe USD price was $0.99 while INR was ₹99 — ~16% under-priced in USD (₹99 ≈ $1.18); discovered during yesterday's abandoned-cart audit | 2026-06-12 (PR #691) | **Medium** | New Stripe Price object at $1.30; old archived. `STRIPE_PRICE_BRIHASPATI_SINGLE` env rotated. Display constants updated in 3 places — found by grep, not by tests. |
| 35 | jsPDF Latin-1-only font limitation broke Devanagari PDF generation | PR # multiple | **Medium** | CLAUDE.md "Document and guard external library limits" rule: comment quirk at the call site OR guard with a degradation path. Don't trust "I'll remember." |
| 36 | `sweph` native binary was built for macOS arm64 (laptop) but Vercel runs Linux amd64/arm64 — `vercel deploy --prebuilt` shipped the wrong binary | 2026-06-13 (PR #698) | **High** | `scripts/build-sweph-linux-arm64.sh` is now part of the `deploy` npm script. Local arm64 binary is restored after deploy. |
| 37 | Setting `cache: 'no-store'` on internal fetch in `VercelBlobStorage.get` made the calling route opt-in to dynamic rendering → bypassed Vercel edge cache on every request → ISR Writes spike | PR #505/#507 | **High** | Use `cache: 'force-cache'` + `next: { tags: [...] }` for Blob fetches inside ISR pages. Documented at length in `src/lib/precompute/storage.ts:215`. |
| **Idempotency + retries** ||||
| 38 | User writes (saved charts, brihaspati questions) were not idempotent by natural key → double-clicks created duplicates | Various | **High** | CLAUDE.md universal rule: dedupe by natural key (trimmed lowercase name + date + time + lat/lng rounded to 4dp), OR enforce uniqueness at DB level. Brihaspati abandoned-cart cron uses `claim_marker` first-then-send pattern; same approach in `nps-feedback`. |
| 39 | `auth.users` triggers without `EXCEPTION WHEN OTHERS THEN RETURN NEW` block signups when they throw | Various | **Critical** if shipped | All `auth.users` triggers must: `SECURITY DEFINER`, `SET search_path = public`, `EXCEPTION WHEN OTHERS THEN RETURN NEW`. INSERT triggers: `ON CONFLICT ... DO NOTHING`. Verify signup via `curl -X POST .../auth/v1/signup` after trigger changes. |
| **Silent failures** ||||
| 40 | API routes had `catch {}` returning error JSON without logging → undebuggable in production | Apr 2026 (Lesson AA) | **High** | Universal rule: every catch logs with `console.error('[module] X failed:', err)` BEFORE returning the response. Banned-pattern grep should catch empty `catch {}` in pre-commit. |
| 41 | Brihaspati abandoned-cart sessions sat undetected — no recovery flow existed | 2026-06-12 (PR #691) | **Medium** | New cron `brihaspati-abandoned-recovery` + dedup column `abandoned_recovery_sent_at`. Same claim-first/send-after pattern. |
| 42 | Precompute nightly cron hit `/usr/bin/curl: Argument list too long` on 06-11/12/13 — the revalidate step's bash arg exceeded OS limit. The job exit code 126 was silent — no Slack/email/issue alert | 2026-06-11 → 2026-06-13 | **Critical** | PR #700's `notify-failure` job uses `actions/github-script` + default `GITHUB_TOKEN` to open an issue tagged `cron-failure`/`precompute` on any failure. 06-14 morning audit was the only reason we noticed. |
| 43 | `notify-failure` job uses `if: failure()` which doesn't fire when downstream `revalidate` runs with `if: always()` and succeeds — the chain's terminal state is "ok" even when an upstream job failed | 2026-06-15 (outstanding) | **High** | Correct trigger: `if: contains(needs.*.result, 'failure')`. GitHub Actions evaluates the `if` field as an expression already, so the `${{ }}` wrapper is redundant. Fix pending. |
| 44 | June ISR Writes line item went $6 → $44 in two weeks with no alert until I happened to check `vercel usage`. Same window: 9-day silent precompute bypass (#30) | 2026-06 (PR #702) | **Critical** | `scripts/snapshot-vercel-usage.ts` runs weekly, diffs per-line-item vs last snapshot, fails-loud on >50% week-over-week swings. `docs/vercel-cost-log.md` is the human-readable change-log per PR. |
| **Bulk operations / find-replace** ||||
| 45 | Bracket double-escape `bg-[#xxx]` in Tailwind regex broke 128 files | Various (Lesson H) | **High** | Tailwind v4 arbitrary classes are everywhere. Never sed/regex across them. Use ts-morph/jscodeshift, OR dry-run 2-3 files + `npx next build` gate. If you MUST regex: print match count + 5 samples + get user confirmation. |
| 46 | `tl(` → `t(` regex broke 3,343 non-translation call sites | Various (Lesson H) | **Critical** | Same as #45. The user prompt to "rename function" should never invoke sed without AST awareness. |
| **i18n + locale** ||||
| 47 | Translation migration verified keys in en/hi but not other locales → raw key paths shipping in UI | (Lesson I, J) | **High** | After ANY i18n change: grep new keys against EVERY locale JSON; configure `next-intl onError` to log missing keys; never render `undefined` — always English fallback. |
| 48 | Embed routes used `tl()` instead of `tlScript()` for city names → Devanagari surfaces leaked English when Hindi locale was rendered with a Latin-script fallback chain | PRs #652, #653 | **High** | `tlScript()` for any surface that mixes script-sensitive copy. CLAUDE.md has the matrix of `LocaleText` vs `Trilingual` usage. |
| 49 | New 9-locale data tables (PLANET_THEMES, PLANET_REMEDIES, NamedWindow labels) shipped initially as `{en, hi}` + ternaries → 7 locales saw English bleeding through | PRs #571/574/576/578 | **High** | CLAUDE.md rule: user-visible data tables ALWAYS use `LocaleText`, never `{x, xHi}` pairs. Scaffolding script `scripts/scaffold-locale-table.py` enforces the shape. |
| **Static page budget / SEO** ||||
| 50 | Routes added back to `generateStaticParams` returning non-empty → broke the 9k page budget multiple times | Repeatedly | **High** | CLAUDE.md "Static page budget" section lists must-be-empty routes. Build will fail (out-of-memory) if any PR re-introduces params. Re-check on every merge. |
| 51 | Sitemap pulled NFT tracer through whole project → 342MB bundle | PR #485 | **Medium** | Sitemap routes use plain handlers + gzip response, not Next metadata route. |
| 52 | Next 16 ISR + cookie poisoning across locale tree → silent soft-404 surge across multiple cohorts | PRs #494, #500, #503, #505, #622, #625, #626, #632 | **Critical** | Edge-gate (proxy.ts) for any dynamic-segment route eligible for crawl-budget exhaustion. `audit-isr-hydration` + `e2e/isr-hydration-crawl` gates kept these from re-shipping. |
| **Operational / observability gaps** ||||
| 53 | No automated Vercel cost monitoring → June ISR Writes 7× spike caught only when bill arrived | Until 2026-06-14 (PR #702) | **Critical** | See #44. The May 27 cost-reduction spec sat unimplemented because no signal forced prioritisation. |
| 54 | No cron failure alerting → 3 days of `Argument list too long`, then 9 days of `PRECOMPUTE_STORAGE not set` | Until 2026-06-14 (PR #702) | **Critical** | See #42. Now an issue gets filed. |
| 55 | Auto-invalidation of engine-version precompute Blobs is untested end-to-end in production | Latent | **Medium** | `docs/runbooks/engine-version-smoke-test.md` documents the manual procedure. Unit tests cover path-generation. Trigger manually when in doubt. |

## Cross-cutting patterns

Reading the above linearly is exhausting. The repeating shapes:

1. **"Same data, two implementations"** — Lessons B, M, Q, S, Z, ZA, plus rows 2, 3, 4, 5, 12, 26, 27, 28. Root cause behind the largest cluster of bugs. *Mitigation*: grep before creating; canonical-constants files; banned-pattern scan for likely duplicates.
2. **"Trailing `\n` in env values"** — Rows 29, 30, 32. Two of the three were silent for days. *Mitigation*: defensive `.trim()` in consumers; never put strict equality on raw env values.
3. **"Silent failure with no signal"** — Rows 21, 30, 33, 42, 43, 44, 52, 53, 54. The class that loses the most money and trust. *Mitigation*: monitor every external integration health (Stripe audit, GH issue on cron failure, Vercel usage diff); log every catch.
4. **"Off-by-one date / day-boundary"** — Rows 11, 15, 16, 17, 18, 19. The hydration / midnight class is the worst because it's invisible at audit and only shows up at production load. *Mitigation*: two-layer gates (static + runtime crawl); never compute "today" in render scope; resolve "today" in the target TZ.
5. **"Idempotency missing"** — Rows 21, 31, 38. Anything that ships an email or a write can be retried. *Mitigation*: DB-level natural-key dedupe or claim-marker pattern (now used by 3+ crons).

## Architectural gaps still open

- **No automated end-to-end engine-version smoke test.** Unit tests verify the path-generation; production behaviour is manual-only. Risk if a future engine bump silently doesn't propagate.
- **No per-PR cost projection.** Cost movement attribution is post-hoc via `docs/vercel-cost-log.md` Δ column. Vercel doesn't expose pre-merge projections for ISR Writes / Fluid CPU.
- **No reverse-lookup safety for `findNearestPrecomputedCity`.** Returns the closest city within tolerance, but doesn't check whether the matched city's Blob was *actually written this cycle*. A city whose precompute job timed out (`muhurta-month` 06-15) silently falls back to live compute with no visible signal.
- **`feat/pandit-crm` long-lived branch model has no automated drift detection.** P1-P11 merged big-bang; future feature work of similar scale should split into smaller staged merges with feature flags.
- **`vercel env` audit is manual.** No CI step verifies that every consumer of an env var has either `.trim()` or a comment justifying its absence. The 9-day precompute bypass is the latest reminder.
- **No production deploy signal in the `precompute-nightly` workflow.** A code change that merges to main but isn't deployed (current `npm run deploy` policy) means precompute Blob format changes don't propagate to functions until the user remembers to deploy.

## Process additions adopted (and the bug that triggered each)

| Process | Triggered by |
|---|---|
| Pre-commit + pre-push: `tsc --noEmit`; pre-commit also: banned-pattern scan + locale-key parity + ISR-hydration audit (on touched files) | Locale ternaries + duplicate constants + empty catches + Lesson ZD |
| Pre-commit: `audit-isr-hydration` baseline gate | Lesson ZD (80% pageview collapse) |
| CI: `e2e/isr-hydration-crawl` runtime Playwright | Same |
| `scripts/audit-stripe-webhooks.ts` | 3-day silent Stripe webhook failure |
| `scripts/audit-parana-vs-references.ts` (pre-commit on calendar/ephem/yoga/panchang edits) | Multiple Adhika/parana drift incidents |
| `nps_endpoint_log` audit table | Silent NPS token invalidation |
| `notify-failure` issue-opener job on `precompute-nightly` | 3-day silent cron failure |
| `scripts/snapshot-vercel-usage.ts` + `docs/vercel-cost-log.md` | June ISR Writes 7× spike + 9-day silent migration bypass |
| `docs/runbooks/engine-version-smoke-test.md` | Engine-version auto-invalidation infra never exercised in prod |
| `scripts/precompute/cleanup-old-prefixes.ts` | Orphan Blobs accumulating after engine bumps |
| `feedback_*` memory files (~50 entries) | Repeated mistakes; codified once, applied across sessions |

## Honest assessment of recurring failure modes

The same mistakes keep finding new surfaces:

- **Trusting one audit.** Lesson Z: "If audit claims X but 11 files say otherwise, the audit is wrong." But row 30 (precompute env trim) shipped because no one audited the env value vs what the consumer code expected.
- **Forgetting to verify deploy actually landed the change.** Rows 30, 36, plus the current pending state where PR #701 was merged 2026-06-14 but couldn't possibly have changed Vercel costs because it wasn't deployed.
- **Skipping the manual production verification step.** CLAUDE.md "Definition of Done" requires browser-verification for UI; precompute migration shipped without a `vercel logs | grep "precompute"` spot-check. That one command would have surfaced row 30 on day 1 instead of day 9.

The cost of the 9-day precompute bypass alone (#30) probably exceeds $50–$100 in unnecessary Fluid CPU + ISR Writes. The cost of running `vercel logs | grep precompute` after merging PR #694 would have been 30 seconds.

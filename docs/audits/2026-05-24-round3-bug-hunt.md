# Bug Hunt — Round 3 — 2026-05-24

Seven parallel audits run at HEAD `b4cd2720` (after Sprint 25 / PR #163 merged). Audits read both prior reports so they wouldn't re-report fixed items.

**Total: 153 findings across 7 domains.**

| Domain | File | Findings | P0 | P1 | P2 | P3 |
|---|---|---:|---:|---:|---:|---:|
| Silent failures | `round3-sections/01-silent-failures.md` | 30 | 2 | 6 | 21 | 1 |
| Time / timezone | `round3-sections/02-time-timezone.md` | 27 | 0 | 5 | 13 | 9 |
| Security / auth | `round3-sections/03-security-auth.md` | 24 | 0 | 0 | 10 | 14 |
| Idempotency | `round3-sections/04-idempotency.md` | 17 | 1 | 3 | 4 | 9 |
| Computation | `round3-sections/05-computation.md` | 15 | 1 | 4 | 7 | 3 |
| UI wiring | `round3-sections/06-ui-wiring.md` | 18 | 1 | 6 | 9 | 2 |
| Perf / DX | `round3-sections/07-perf-dx.md` | 22 | 0 | 8 | 11 | 3 |
| **Total** | | **153** | **5** | **32** | **75** | **41** |

Companion: `2026-05-24-bug-hunt.md` (Round 2, 152 findings → 8 sprints landed). Round 1: `2026-05-23-bug-hunt.md` (130+ findings → 17 sprints).

---

## Diminishing-returns note

Multiple agents called this out explicitly:

> **Perf/DX agent:** "No new P0s; remaining P1s are scale-bound (bite at 100+ users); P2s are hygiene. Recommend one consolidated cleanup sprint then return to feature work — no 7th audit round needed."
>
> **Security agent:** "All P2/P3 — no live P0/P1 surviving. Diminishing returns: further security rounds will be increasingly speculative."
>
> **Computation agent:** "Rate of 'wrong value shipped' findings dropped 5→2→1 per round; Round 3 should be the last full-domain pass."

The pattern across rounds:
- Round 1: 130+ findings, ~30 P0 — broad surface, foundational.
- Round 2: 152 findings, 22 P0 — secondary surface, follow-on of Round 1 patterns.
- Round 3: 153 findings, **5 P0** — mostly P2/P3, lots of re-confirmed Round 2 deferrals.

**This is the final full-domain audit cycle. Round 4 would be speculative.**

---

## Cross-cutting themes

1. **Round 2 deferrals dominate Round 3.** Roughly half the security findings, a third of UI findings, a quarter of idempotency findings are explicit re-confirmations of items Round 2 catalogued but didn't ship. Sprint planning below should knock these out in clusters.

2. **Cron handlers are still the bombardment-shape risk surface.** `daily-panchang`, `weekly-digest`, `social-post`, `youtube-short` lack per-day/per-week sent anchors. Vercel cron retries on 502 re-send everything. Same family as the May-20 incident — the rest of the cron cluster was hardened in Sprint 21 but these were not in scope.

3. **Local-TZ Date constructor still leaks into ancillary paths.** `learning-progress`, `gamification/ist-day`, `chakra-systems`, `mangal-dosha-engine`, `subscription-store.fetchUsage`. Sprint 20 closed the panchang compute pipeline; this is the residual.

4. **Drik Bala formula `((p.house - other.house + 12) % 12) || 12` is wrong.** The `|| 12` coerces 0 → 12 silently, turning the "same house" case into "12th house". Two engines (shadbala + tajika) disagree with the yoga engine on house distance.

5. **Bundle weight is the only new attack surface.** Four `'use client'` components statically import ~1.5 MB of constants (FESTIVAL_DETAILS, NAKSHATRA_DETAILS, YOGA_DETAIL_DATA, MUHURTA_DATA), shipped wholesale on every panchang/calendar/kundali load.

---

## Top 10 to fix (highest impact P0/P1)

| # | Severity | Finding | Audit |
|---|---|---|---|
| 1 | P0 | Subscription cancel: DB update discards error → UI says cancelled but DB unchanged | R3-SF-1 |
| 2 | P0 | Subscription cancel: provider failure leaves DB cancelled but provider still billing | R3-SF-2 |
| 3 | P0 | `daily-panchang` + `weekly-digest` crons no per-day sent anchor (bombardment on 502 retry) | R3-IDEM-3 |
| 4 | P0 | Drik Bala house-distance off-by-one — every Shadbala/Tajika aspect fires one house off | R3-COMP-1 |
| 5 | P0 | Kundali "Talk to Brihaspati" CTA is a dead click (unimported `open`) | R3-UI-1 |
| 6 | P1 | WhatsApp `sendWhatsAppMessage(...).catch(...)` after response — Vercel kills function | R3-SF-3 |
| 7 | P1 | `learning-progress-store` streak in browser-local TZ (cross-tz/DST silently breaks) | R3-SF-10 / R3-TZ-7 |
| 8 | P1 | `gamification/ist-day.ts` hardcodes IST for streak day-keys (project rule violation) | R3-TZ-18 |
| 9 | P1 | `varshaphal/solar-return.ts` `jdToDateObj` year-overflow on tzOffset wraparound | R3-TZ-1 |
| 10 | P1 | `festivals.ts` tithi/Ekadashi scanners DST-drift on `setDate(getDate()+offset)` | R3-TZ-2 |

Plus 4 bundle/perf P1s (R3-DX-2/3/5) that scale-bound matter.

---

## Sprint plan (5 sprints — Round 3 final)

Given the diminishing-returns posture, this is a more compact plan than Round 2's 8 sprints. The grouping clusters re-confirmed Round 2 deferrals with new Round 3 findings of the same shape.

### Sprint 26 — P0 cluster (subscription + crons + Drik Bala + dead CTA)

The 5 P0 items, each independent.

- **R3-SF-1 / R3-SF-2** — subscription cancel atomicity: capture { error } on both DB and provider calls; on partial failure, roll back the DB change OR mark `status='cancel_pending'` and have a reconciliation cron retry. Status state machine documented.
- **R3-IDEM-3** — add a per-cron sent-anchor table OR a `processed_cron_runs` row keyed on `(cron_name, YYYY-MM-DD)` with a unique index. `daily-panchang` and `weekly-digest` check it before fanout.
- **R3-COMP-1** — fix `((p.house - other.house + 12) % 12) || 12` → `(((p.house - other.house) % 12) + 12) % 12 + 1` (inclusive 1-12) in shadbala.ts and tajika-aspects.ts. Update tests.
- **R3-UI-1** — `ChartChatTab.tsx:76` imports the actual handler instead of relying on a global `open`. Verify the CTA opens the Brihaspati flow.

### Sprint 27 — Time/TZ residual cluster

Deferred Round 2 + new Round 3 TZ findings.

- **R3-TZ-1** — `varshaphal/solar-return.ts` `jdToDateObj` returns `{ jd, year, month, day, hour, minute, weekday }` instead of a sentinel Date; update consumers.
- **R3-TZ-2** — `festivals.ts` tithi scanners iterate via JD (existing `dateToJD` pattern) instead of local-TZ `setDate`.
- **R3-TZ-3** — `vedic-time/Client.tsx` switches to `getUTCOffsetForDate` + `todayInTimezone`.
- **R3-TZ-4** — `puja/[slug]/page.tsx` same migration + replace bare-catch with tagged `console.error`.
- **R3-TZ-7** / **R3-SF-10** — `learning-progress-store` streak uses `todayInTimezone(userTimezone)` (or accepts tz param).
- **R3-TZ-18** — `gamification/ist-day.ts` accepts tz param; default to user's panchang location, not IST.
- **R3-TZ-8** — `chakra-systems` + `mangal-dosha-engine` age via `getUTCFullYear()`.

### Sprint 28 — Idempotency + observability residual

- **R3-SF-3** — WhatsApp `sendWhatsAppMessage` via `waitUntil` (or sync await before response).
- **R3-SF-4** — WhatsApp panchang reply uses city tz, not server-local.
- **R3-SF-5/6/7** — onboarding-drip, weekly-digest profile/email-lookup/send error capture.
- **R3-SF-8/9** — `social-post` + `generate-notifications.getUpcomingFestivals` local-TZ year.
- **R3-IDEM-2** — `email-alerts` dasha_transition + sade_sati branches migrate to `dedup_key`.
- **R3-IDEM-4** — `social-post` cron dedup anchor.
- **R3-IDEM-5** — `youtube-short` cron dedup anchor (don't re-upload).
- **R3-IDEM-10** — `awardProgress` switches to RPC for atomic increment on charts_saved / modules_done / referrals_count.
- **R3-SEC-16** — Razorpay webhook validates `current_start/current_end` ∈ reasonable range.

### Sprint 29 — UI chrome + locale residual

- **R3-UI-2 → R3-UI-10** — error.tsx boundaries / Dashboard blank / 5 silent-Supabase pages / matching alert / kundali alert / PanchangClient / Profile fetch / LocaleSwitcher params / modal autoFocus.
- **R3-UI-13** — UserMenu chrome localised (Sign In / Sign Out / My Profile + aria-labels).

### Sprint 30 — Bundle slim + cron-perf (final)

- **R3-DX-5** — Convert 4 client-imported constants files to dynamic-import / route-handler fetch on demand. Saves ~1.5 MB on every page.
- **R3-DX-2** — `email-alerts` + `weekly-digest` batch profile + getUserById + dedup into one query per page.
- **R3-DX-3** — `weekly-digest` hoists `generateFestivalCalendarV2` out of the per-user loop.
- **R3-DX-1** — `transit-alerts` cron dedup SELECT lifted to single batch query.
- **R3-DX-4** — `/api/tippanni` synthesizer runs 3 sections in `Promise.all` instead of serial.
- **R3-COMP-2/3/4** — D27, D30, D8 vargas: either fix to BPHS canonical OR add Lesson-S deliberate-choice comments documenting the divergence.
- Address remaining R3-DX cleanup items: duplicate migration number 032 (R3-DX-7), force-dynamic conflicts (R3-DX-8), BASE_URL inlining (R3-DX-9/10).

---

## Notes on sequencing

- Sprint 26 ships first because all 5 P0s are independent — one PR closes them.
- Sprints 27 + 28 are concurrent in scope but sequential in merge order (avoid migration conflicts).
- Sprint 29 is purely UX/locale and can ship without DB or cron concerns.
- Sprint 30 is the closure sprint — bundle slim + perf wrap + doctrinal-comment vargas. After this, return to feature work.

— end —

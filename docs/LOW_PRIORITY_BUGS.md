# Low Priority Bug Tracker

> Items identified during bug hunts that are safe to defer. Not user-facing, not computation-affecting.
> Review quarterly or when touching these files.

Last updated: 2026-04-27

---

## Silent Catches in Non-Critical UI Paths

These are `catch {}` blocks without `console.error` logging. All are provably safe to silently degrade (localStorage quota, clipboard permissions, share API cancellation, SSR guards). Adding logging would be noise in production.

| # | File | Line | Context | Why Safe |
|---|------|------|---------|----------|
| 1 | `NotificationBell.tsx` | 80 | `fetchNotifications` network failure | UI degrades gracefully (empty bell) |
| 2 | `NotificationBell.tsx` | 123 | `markRead` failure | Has optimistic revert |
| 3 | `NotificationBell.tsx` | 148 | `markAllRead` failure | Has optimistic revert |
| 4 | `panchang/route.ts` | 88 | Tithi table enrichment | Optional data, core response unaffected |
| 5 | `panchang/route.ts` | 109 | Festival enrichment | Optional data, core response unaffected |
| 6 | `subscription-store.ts` | 110 | Usage fetch failure | Defaults to 0 (safe) |
| 7 | `panchang-alerts.ts` | 48 | Notification constructor | Browser compat guard |
| 8 | `OnboardingModal.tsx` | 190 | Snapshot save | Best-effort, onboarding continues |
| 9 | `OnboardingModal.tsx` | 201 | Redirect | Best-effort |
| 10 | `OnboardingModal.tsx` | 321 | Skip button | Best-effort |
| 11 | `PersonalizedHoroscope.tsx` | 170 | sessionStorage parse | SSR guard |
| 12 | `PersonalEclipseInsight.tsx` | 270, 300 | sessionStorage | SSR guard |
| 13 | `SankalpaDisplay.tsx` | 115, 126 | Silent catches | Non-critical display |
| 14 | `SamagriList.tsx` | 65, 72, 117, 124 | localStorage | Storage quota guard |
| 15 | `MantraCard.tsx` | 79 | Clipboard failure | Browser compat |
| 16 | `StoryViewer.tsx` | 99 | Share cancellation | User-initiated cancel |
| 17 | `kp/kp-chart.ts` | 93 | Invalid timezone | Fallback exists |
| 18 | `swiss-ephemeris.ts` | 49 | Module load | Expected on non-native platforms |
| 19 | `learn/badges.ts` | 250, 260 | Badge computation | Non-critical gamification |
| 20 | `AdUnit.tsx` | 53 | AdSense not loaded | Expected when ads blocked |
| 21 | `AuthModal.tsx` | 63 | Auth service failure | Shows user error message |

## Computation Path Silent Catches (FIXED in Round 2)

These were the higher-risk ones — all fixed on 2026-04-27:
- ~~`generate-notifications/route.ts:133`~~ → now logs
- ~~`maasaphal.ts:108`~~ → now logs
- ~~`convergence/engine.ts:196`~~ → now logs
- ~~`festival-generator.ts:680`~~ → now logs
- ~~`send-push.ts:24`~~ → now logs

## Other Deferred Items

| # | File | Issue | Why Deferred |
|---|------|-------|-------------|
| 22 | `VedicProfile.tsx:169` | `markdownBold` doesn't escape HTML — latent XSS if upstream ever includes user text | Currently server-generated strings only. Add escaping when user text is introduced. |
| 23 | `panchang-calc.ts:900` | `new Date(y,m,d)` for weekday — safe but undocumented assumption | Add comment on next touch |
| 24 | `daily-engine.ts:216` | Same pattern as #23 | Add comment on next touch |
| 25 | `year-predictions.ts:212-213` | Year boundaries in local time — edge case for dasha transitions near Dec 31/Jan 1 | Use Date.UTC on next touch |
| 26 | `dates/[category]/page.tsx:316-318` | Falls back to Delhi when location store empty | Show "Set location" prompt instead |
| 27 | `dasha-koota.ts` + `ashta-kuta.ts` | Duplicated NAKSHATRA_GANA, YONI, YONI_ENEMIES arrays | Consolidate to shared constants (CM-4) |

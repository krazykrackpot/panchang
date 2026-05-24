# UI Wiring Audit — Round 3 — 2026-05-24

Frontend / wiring lens, third pass. Sourced from inline reads of the worktree at HEAD `b4cd2720` (after Sprint 18–25 closed).

Hunt domains: dead clicks, unlinked pages, loading state termination, locale fallback (Lesson J), useEffect stomp (Lesson CC), mock data, dead links, accessibility, error boundaries, modal a11y, hardcoded counts.

Round 2 closures confirmed via inline reads (not re-reported): /path 301 → /sadhaka-path, /embed-demo 301 → /widget (`next.config.ts:89-100`), footer wires /vrat-calendar /daily /widget (`Footer.tsx:45,46,165`), BirthForm prefill guard now includes relationship/date/lat (`BirthForm.tsx:90-95`), pricing currency derives from coords with India bbox + `useLocationStore` hook (`pricing/page.tsx:184-209`), not-found.tsx localised across visible locales, AuthModal localised across 8 visible locales (`AuthModal.tsx:51-244`), profile Tamil-in-EN fix, OnboardingModal Escape close (`OnboardingModal.tsx:134-141`), ArchetypeRevealModal Escape close (`ArchetypeRevealModal.tsx:31-38`).

**Total: 18 findings — P0: 1 · P1: 6 · P2: 9 · P3: 2.**

---

## P0 findings

### R3-UI-1 — Kundali "Talk to Brihaspati" CTA is a dead click (calls global `window.open` with a bogus URL)

- **File:** `src/components/kundali/ChartChatTab.tsx:74-86`
- **Severity:** P0 (Lesson A + dead click — feature broken in production)
- **Evidence:**
  ```tsx
  <button
    type="button"
    onClick={() => open('kundali_tab')}     // ← no `open` import; falls through to window.open
    className="..."
  >
    {t('tab.cta')}
  </button>
  ```
  `grep -rn "const open\|function open\|let open"` in this file: **zero matches**. The file's prose comment (L34-39) literally documents that `useBrihaspati()` cannot be called here and that the event-bus pattern must be used — yet only the *prompt* buttons below (L100 `onClick={() => fireWith(prompt)}`) use the bus; the headline CTA reverts to `open(...)` which resolves to the global `window.open`.
- **Why it's a bug:** Clicking the primary "Talk to Brihaspati" button on the kundali tab calls `window.open('kundali_tab', undefined, undefined)` — i.e. opens a popup at the URL `kundali_tab` (resolved relative to the current page, e.g. `https://dekhopanchang.com/en/kundali/kundali_tab`). All modern browsers block this as an un-prompted popup; in the rare case it does open, the user lands on a 404. **The conversion CTA on the Kundali tab is silently broken on every chart.** Two sibling buttons (`BrihaspatiButton.tsx:20` and `BrihaspatiBanner.tsx:94`) correctly destructure `open` from `useBrihaspati()`; this third caller was copied without the hook import. Same audit-shape as the May "Ask Your Chart" 5-round bug — once again, not grepping the full codebase for the pattern.
- **Proposed fix:** Replace `onClick={() => open('kundali_tab')}` with the same event-bus pattern the prompt buttons use:
  ```tsx
  onClick={() => fireWith(t('tab.openPrompt' as never) || '')}
  ```
  Or fire the bus with no question so Brihaspati opens at its default state.

---

## P1 findings

### R3-UI-2 — UI-8 (deferred): error boundaries are English-only across 9 routes

- **File:** `src/components/ui/RouteError.tsx:57-78` (shared) + 8 route-specific wrappers (matching/learn/calendar/sign-calculator/kundali/kp-system/muhurta-ai/panchang)
- **Severity:** P1 (Lesson J — STILL OPEN from Round 2)
- **Evidence:** `RouteError.tsx:57` — `<h2>{title || 'Something went wrong'}</h2>`, `L66` — "An error occurred while loading this page. Please try again.", `L73` — "Try Again", `L76` — "Go Home". All hardcoded English. Every wrapper passes a different English `title` ("Panchang Error", "Matching Error", etc.). Plus `src/app/[locale]/error.tsx:36-47` — "Something Went Wrong" / "A celestial disturbance has occurred..." / "Try Again" — hardcoded English.
- **Why it's a bug:** Same shape as the Sprint-23 AuthModal fix. Every render-failure boundary, on the 142-page surface, shows English to Maithili/Tamil/Bengali/Telugu/Gujarati/Kannada users.
- **Proposed fix:** RouteError → `useTranslations('common.error')` for title/message/tryAgain/goHome. Add `common.error` keys to all 8 locale JSONs.

### R3-UI-3 — UI-9 (deferred): Dashboard returns blank when `personalizedDay` is null

- **File:** `src/app/[locale]/dashboard/page.tsx:1345-1346`
- **Severity:** P1 (Lesson F — STILL OPEN from Round 2)
- **Evidence:**
  ```tsx
  const pd = personalizedDay;
  if (!pd) return null;
  ```
  `computePersonalizedDay(userSnapshot, todayNakshatra, todayMoonSign)` at L1067 can throw on malformed snapshots (try block at L1066–1067 has no error handler — see surrounding code). The state stays null, loading is already false, and the dashboard renders **nothing** above the footer.
- **Why it's a bug:** Returning user with corrupted snapshot or partial migration state sees a navbar + blank body + footer. No fallback CTA, no console-visible explanation, no retry. UI-9 was deferred to Sprint 25 but not addressed.
- **Proposed fix:** Render an empty-state card with "We couldn't compute today's reading. [Recompute] / [Update birth data]" and console.error the root cause.

### R3-UI-4 — UI-10 (deferred): five client pages use `.then(({ data }) => …)` and swallow Supabase errors

- **Files:**
  - `src/app/[locale]/settings/page.tsx:497`
  - `src/app/[locale]/horoscope/HubClient.tsx:286`
  - `src/app/[locale]/sign-calculator/page.tsx:66`
  - `src/app/[locale]/baby-names/page.tsx:50`
  - `src/app/[locale]/dashboard/saved-charts/page.tsx:52`
- **Severity:** P1 (Lesson A — STILL OPEN from Round 2)
- **Evidence:** `grep -rn '\.then(({\s*data\s*})' src/app/[locale]/` confirms all five callers are unchanged from Round 2. Sprint 23 closed only the navbar/AuthModal/dead pages — these silent-fail patterns are still live.
- **Why it's a bug:** Each fails the global CLAUDE.md `.then(({ data }))` ban. RLS-denied SELECTs on stale tokens render as "no data yet" empty states instead of an actionable session-expired banner. Saved-charts shows zero charts when the user has 12 (the SELECT just failed).
- **Proposed fix:** `\.then(({ data, error }) => { if (error) { console.error(...); setError(...); return; } ... })` everywhere, and surface a banner. Add a lint rule for the bare destructure.

### R3-UI-5 — UI-15 (deferred): matching error message is a 3-locale ternary; 7 locales fall back to Hindi

- **File:** `src/app/[locale]/matching/Client.tsx:186`
- **Severity:** P1 (Lesson J — STILL OPEN from Round 2)
- **Evidence:** Single inline ternary `isTamil ? '…ta…' : locale === 'en' ? '…en…' : '…hi…'`. Bengali, Telugu, Kannada, Marathi, Gujarati, Maithili users see the Hindi devnāgrī string.
- **Why it's a bug:** Identical shape to the matching success-side polish that's already fully localised. One ternary undoes 9 locale's UX on the failure path.
- **Proposed fix:** Replace with `tl({ en, hi, ta, te, bn, kn, mr, gu, mai }, locale)`.

### R3-UI-6 — UI-16 (deferred): Kundali alert is 2-locale ternary + `alert()` instead of inline banner

- **File:** `src/app/[locale]/kundali/Client.tsx:942, 967`
- **Severity:** P1 (Lesson J — STILL OPEN from Round 2)
- **Evidence:**
  ```tsx
  alert(locale === 'hi' ? 'कुण्डली बनाने में त्रुटि। …' : 'Failed to generate chart. …');
  ```
  Two call sites (chart generation failures). All 8 non-Hindi locales get English.
- **Why it's a bug:** Failure path of the *primary* feature. Plus `alert()` is a poor UX shape that this page already replaced elsewhere with an inline error banner.
- **Proposed fix:** `tl()` + inline banner.

### R3-UI-7 — UI-17 (deferred): PanchangClient fetch failure is silent (no banner / no retry)

- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:421-424`
- **Severity:** P1 (Lesson A — STILL OPEN from Round 2)
- **Evidence:**
  ```tsx
  .catch((err) => {
    console.error('[PanchangClient] fetch failed:', err);
    setLoading(false);
  });
  ```
  No `setFetchError` or visible feedback. When `/api/panchang` 5xx's the panchang page shows the previous state (or null cards) silently.
- **Proposed fix:** Add `fetchError` state + top banner with "Retry" CTA.

---

## P2 findings

### R3-UI-8 — UI-18 (deferred): Profile page hides fetch failure, shows misleading "add birth data" CTA

- **File:** `src/app/[locale]/profile/page.tsx:455-476`
- **Severity:** P2 (Lesson A — STILL OPEN from Round 2)
- **Evidence:** `if (res.ok) { … }` — when not ok (401 stale token, 5xx) the function exits without setting any error state. `hasData = snapshot && profileInfo?.date_of_birth` evaluates falsy → user lands on the new-user empty state at L705-720.
- **Proposed fix:** Distinguish "fetch failed" from "user has no birth data"; show retry CTA on the former.

### R3-UI-9 — UI-19 (deferred): LocaleSwitcher loses URL search params

- **File:** `src/components/layout/LocaleSwitcher.tsx:20`
- **Severity:** P2 (Lesson C — STILL OPEN from Round 2)
- **Evidence:** `router.replace(pathname, { locale });` — `pathname` from `usePathname()` excludes `?…`. Confirmed callers that rely on search params: `kundali/[id]`, `tropical-compare`, `sarvatobhadra`, `calendar/[slug]` (all use `useSearchParams`). A user on `/calendar/diwali?date=2026-10-29` who switches locale lands on `/{newLocale}/calendar/diwali` without the date — UI silently re-derives.
- **Proposed fix:** Read `useSearchParams()` and re-append on switch.

### R3-UI-10 — UI-20 (deferred): Modals lack autoFocus and focus trap

- **Files:** `src/components/auth/AuthModal.tsx`, `src/components/auth/OnboardingModal.tsx`
- **Severity:** P2 (a11y — STILL OPEN from Round 2)
- **Evidence:** `grep -n "autoFocus" AuthModal.tsx OnboardingModal.tsx` → zero matches. Neither modal has a focus trap; Tab leaks back to underlying page elements. AuthModal does have `role="dialog" aria-modal="true"` (L317), but OnboardingModal's container (L266) and ArchetypeRevealModal's container (L53) lack `role`/`aria-modal` entirely.
- **Proposed fix:** Add `autoFocus` to first input, focus-trap helper, `role="dialog" aria-modal="true" aria-labelledby` on the modal container.

### R3-UI-11 — UI-21 (deferred): `transit-playground` only reachable via cross-link sidebar; `sky-map` only via /transits photo

- **Files:** `src/app/[locale]/transit-playground/page.tsx`, `src/app/[locale]/sky-map/page.tsx`
- **Severity:** P2 (Lesson D — STILL OPEN from Round 2)
- **Evidence:** `grep -rn "/transit-playground\|/sky-map" src/` returns no navbar/footer/dashboard entry; `transits/page.tsx:420` adds an `<a href="/sky-map">` photo card but that's the only entry — still no nav. `transit-playground` only appears in `lib/seo/cross-links.ts`.
- **Proposed fix:** Promote both to the `/tools` mega-card grid. Cross-link from `/transits`.

### R3-UI-12 — UI-22 (deferred): SearchModal uses `setTimeout(focus, 50)` instead of useLayoutEffect

- **File:** `src/components/search/SearchModal.tsx:160`
- **Severity:** P2 (Lesson E — STILL OPEN from Round 2)
- **Evidence:** Unchanged from Round 2.

### R3-UI-13 — UserMenu chrome (Sign In / Sign Out / My Profile) is English-only across 8 locales

- **File:** `src/components/auth/UserMenu.tsx:67, 101, 108, 115`
- **Severity:** P2 (Lesson J)
- **Evidence:**
  - L64-67 `aria-label="Sign in"` and visible text `Sign In` — hardcoded English.
  - L101 `isDevanagariLocale(locale) ? (locale === 'sa' ? 'मम कुण्डली' : 'मेरी कुंडली') : 'My Profile'` — Tamil/Telugu/Bengali/Gujarati/Kannada/Maithili all get English.
  - L108 `tl({ en, hi, sa }, locale)` — Tamil/Telugu/Bengali/etc. fall through to `.en` via `tl()` helper.
  - L115 `Sign Out` — hardcoded English.
- **Why it's a bug:** UserMenu is in the navbar on every page — visible 100% of the time for authenticated users. Same conversion-critical surface as AuthModal, but Sprint-23 only fixed the modal. Maithili user (#1 traffic per memory) sees "Sign In" / "Sign Out" / "My Profile" in English on every page.
- **Proposed fix:** Same per-locale `LABELS` map shape AuthModal now uses.

### R3-UI-14 — OnboardingModal labels are en/hi/sa only — Tamil/Bengali/Telugu/etc. fall back to English

- **File:** `src/components/auth/OnboardingModal.tsx:20-99, 103-104`
- **Severity:** P2 (Lesson J)
- **Evidence:** `LABELS` only has keys for `en`, `hi`, `sa`. Line 103: `const labelsKey = isDevanagariLocale(locale) ? (locale === 'sa' ? 'sa' : 'hi') : 'en';` — Tamil, Telugu, Bengali, Kannada, Gujarati, Maithili all map to `'en'`. Also L173 "Authentication not available. Please try again.", L260 "Something went wrong. Please try again." — both hardcoded English regardless. `sa` is retired (middleware 301s).
- **Why it's a bug:** Onboarding fires on every first-time signup. Maithili / Tamil user lands on a fully English 4-field form for the most important first-touch UX. Mai is #1 traffic per project memory.
- **Proposed fix:** Add `ta`, `te`, `bn`, `gu`, `kn`, `mai` keys to LABELS. Localise the two error strings via the same map.

### R3-UI-15 — ArchetypeRevealModal labels are 2-locale ternary

- **File:** `src/components/auth/ArchetypeRevealModal.tsx:104, 162, 180, 186`
- **Severity:** P2 (Lesson J)
- **Evidence:**
  ```tsx
  {isHi ? 'आपका आदर्शरूप' : 'YOUR ARCHETYPE'}
  {isHi ? 'अपनी कुण्डली देखें →' : 'Explore Your Birth Chart →'}
  {isHi ? 'महाशक्ति' : 'Superpower'}
  {isHi ? 'छाया' : 'Shadow'}
  ```
  `isHi = isDevanagariLocale(locale)` — Tamil/Bengali/Telugu/Gujarati/Kannada/Maithili all map to English.
- **Why it's a bug:** Post-signup reveal modal is the *peak engagement* moment. Hindi users get full localisation; everyone else gets English on the headline labels and CTA.
- **Proposed fix:** `tl()` over the 9 visible locales.

### R3-UI-16 — Dashboard "Your Cosmic Identity" heading is 2-locale ternary

- **File:** `src/app/[locale]/dashboard/page.tsx:1555`
- **Severity:** P2 (Lesson J)
- **Evidence:** `{locale === 'hi' ? '▾ आपकी ब्रह्माण्डीय पहचान' : '▾ Your Cosmic Identity'}` — only Hindi gets the localised heading; all other 7 visible locales see English.
- **Proposed fix:** `tl()` over all 9 visible locales (same map as the other dashboard `tl()` calls in the file).

### R3-UI-17 — WidgetConfigurator (`/widget`) is fully English across 8 locales

- **File:** `src/app/[locale]/widget/WidgetConfigurator.tsx:14-15, 65, 86, 90, 118, 138, 158, 173, 179, 181`
- **Severity:** P2 (Lesson J)
- **Evidence:** Hardcoded English strings: "Live Preview" (L65), "Configure Your Widget" (L86), "City" (L90), "Size" (L118), "Language" (L138), "Embed Code" (L158), "Copied!" / "Copy Code" (L173), "Custom location?" / "For locations not in the city list…" (L179-181). Widget locale selector also only offers en/hi (L14-15, L140), even though the embed iframe target supports all 10 site locales.
- **Why it's a bug:** Sprint-23 wired /widget into the footer (UI-3 fix) but never localised the page itself. Sanskrit/Maithili/Tamil/Bengali/etc. users land on an English-only developer page after clicking "Embed" in the footer.
- **Proposed fix:** Pipe `useLocale()` + LABELS map for chrome strings. Expand widget-locale selector to all 9 visible locales.

### R3-UI-18 — Pricing checkout failure alert is English-only across 8 locales

- **File:** `src/app/[locale]/pricing/page.tsx:257`
- **Severity:** P2 (Lesson J)
- **Evidence:** Sprint-23 fixed UI-6's currency derivation and added the `submittingTier` double-click guard, but the catch's `alert('Checkout failed. Please try again.');` (L257) is still hardcoded English. Plus L254 `alert(data.error);` displays whatever the server returns — server-side error strings are EN-only.
- **Proposed fix:** Localise via `msg(...)` (the `tl()` wrapper already used elsewhere in this file).

---

## P3 findings

### R3-UI-19 — Auth callback uses `setTimeout(redirect, 8000)` as readiness guess (Lesson E)

- **File:** `src/app/[locale]/auth/callback/page.tsx:55-60`
- **Severity:** P3 (Lesson E)
- **Evidence:**
  ```tsx
  const timeout = setTimeout(() => {
    if (!handled) {
      setStatus('error');
      window.location.href = `/${locale}`;
    }
  }, 8000);
  ```
- **Why it's a bug:** Lesson E — never use `setTimeout(..., N)` as a substitute for a real readiness signal. On slow networks (e.g. mobile / VPN) the OAuth exchange can take >8s and the user is silently redirected home with an "error" state they never see. Should listen for an explicit `auth-failed` event or wait on the subscription with a longer + visible escalation.
- **Proposed fix:** Replace with a visible "Still authenticating..." state at 5s and only redirect after explicit failure or 30s. Logging should surface session-exchange failures, not silent fallback.

### R3-UI-20 — Calendar/Dates pages still use browser TZ as fallback (Lesson L / project rule)

- **Files:** `src/app/[locale]/dates/[category]/Client.tsx:342, 348`, `src/app/[locale]/calendar/[slug]/page.tsx:148`, `src/app/[locale]/calendars/tithi/page.tsx:130`, `src/app/[locale]/learn/labs/panchang/page.tsx:417`, `src/app/[locale]/learn/labs/moon/page.tsx:243`, `src/components/dashboard/DailyHoroscopeWidget.tsx:92-93`
- **Severity:** P3 (project rule — "Timezone from coordinates only")
- **Evidence:** Six client pages still call `Intl.DateTimeFormat().resolvedOptions().timeZone` as a fallback when the location store is empty. DailyHoroscopeWidget computes "today" using browser-local `new Date().getDate()` rather than the user's location TZ.
- **Why it's a bug:** Sprint 24 closed 12+ files but these stragglers remain. A Switzerland user with VPN to India sees IST tithi grids; an Indian user whose browser is set to UTC sees the wrong day's horoscope. The project rule is "ALWAYS read from the location store … resolve IANA timezone from birth lat/lng". Falling back to `Intl.DateTimeFormat()` violates that.
- **Proposed fix:** Wait for the location store; do not fall back to browser TZ.

---

## Cross-cutting themes

1. **Lesson J (locale fallback) is the gift that keeps giving.** Round 1 closed the navbar; Round 2 closed AuthModal / not-found / footer; Round 3 still finds: UserMenu (R3-UI-13), OnboardingModal (R3-UI-14), ArchetypeRevealModal (R3-UI-15), Dashboard Cosmic Identity (R3-UI-16), WidgetConfigurator (R3-UI-17), Pricing alert (R3-UI-18), error.tsx + RouteError (R3-UI-2), Matching error (R3-UI-5), Kundali alert (R3-UI-6). The pattern is always the same: a 2-locale ternary or an `en/hi[/sa]`-only LABELS map. A project-wide grep `(locale === 'hi' ? |LABELS\[(\?:'en'|'hi')\])` would surface every remaining instance. Recommend a `withLocaleFallback(LABELS, locale)` helper and a build-time invariant: every visible-locale must be a key in every LABELS map.

2. **Lesson A `.then(({ data }) => …)` is still in 5 callers (R3-UI-4).** Round 2 named these. Sprint 23 didn't touch them. The global CLAUDE.md explicitly bans this shape. Recommend an ESLint rule that flags `.then\(\(\{\s*data\s*\}\s*\)` and fails the build.

3. **Modal a11y is fragmented across 3+ implementations.** AuthModal has Escape + `role="dialog"` but no autoFocus / focus-trap. OnboardingModal has Escape but no `role`/`aria-modal`/autoFocus. ArchetypeRevealModal has Escape but no `role`/autoFocus. SearchModal has Escape + setTimeout focus. Each is a hand-rolled subset of the same pattern. Recommend a `<DialogShell>` primitive that owns portal + role=dialog + aria-modal + Escape + backdrop close + focus trap + autoFocus + body scroll lock. Today's 4 separate hand-rolls means every future modal author re-invents one of these slices.

4. **Dead-click regressions are a class.** R3-UI-1 (kundali "Talk to Brihaspati" calls `window.open('kundali_tab')`) is the same shape as the original "Ask Your Chart" 5-round bug. The prior fix grepped only `Client.tsx`; this caller is in `ChartChatTab.tsx` and was not seen. The CLAUDE.md "grep before claiming fixed" rule applies — `grep -rn "onClick={() => open\b" src/` finds all 3 callers in seconds; only the two with the destructured-from-hook `open` are correct. Recommend a lint rule that flags un-imported bare identifiers that share a name with browser globals (`open`, `print`, `name`, etc.) inside JSX event handlers.

5. **Browser TZ leaks survive partial rollouts.** Sprint 24 fixed 12+ files but R3-UI-20 finds 6 more — five client pages plus DailyHoroscopeWidget. Same shape as the constant-drift theme: a "do not use X" rule applied to a subset leaves the rest as future bugs. Recommend a project-wide grep `Intl.DateTimeFormat().resolvedOptions().timeZone` + manual audit.

6. **Sadhaka-path / Brihaspati / Sprint-23 enrichment surfaces are linked from only one place.** `/sadhaka-path` is only reachable from `/brihaspati/page.tsx:127`. No navbar entry, no dashboard surface, no footer. It's the gamification core of the app per memory and the canonical destination of the `/path` 301. It needs a top-level navbar entry alongside Tools / Learn / Dashboard, or at least a Dashboard card.

---

## Diminishing-returns note

After 3 rounds (Round 1 → 17 sprints → Round 2 → 8 sprints → Round 3), the UI-wiring domain is approaching the noise floor for *unlinked pages* (only 2 borderline orphans remain — R3-UI-11 — and one new linkage gap I noted in theme 6). The largest remaining surface is **Lesson J locale fallback** which is structurally a templating problem: every new translatable string is a new entry-point for the same bug shape. One round of work to introduce a `<Localised key="…">` primitive (or a strict-type `LABELS` map) + a CI invariant would close this class for good and free future audits to focus on new domains.

The dead-click class (R3-UI-1) and the un-terminated null-render class (R3-UI-3) are both worth a focused half-sprint each — both can be caught by a runtime smoke test that visits the top 20 pages and clicks every visible CTA, validating that *something* changes in the DOM. Today's verification leans on the developer eyeballing each surface, which has now demonstrably missed at least two production-broken CTAs across two rounds.

— end —

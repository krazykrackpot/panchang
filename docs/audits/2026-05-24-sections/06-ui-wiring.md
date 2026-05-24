# UI Wiring Audit — 2026-05-24 (Round 2)

Frontend / wiring lens. Sourced from inline reads of the worktree at HEAD `d25d4bbf`.

Hunt domains: dead clicks, unlinked pages, loading state termination, locale fallback (Lesson J), useEffect stomp (Lesson CC), mock data, dead links, accessibility, error boundaries, modal a11y, hardcoded counts.

**Total: 22 findings — P0: 0 · P1: 7 · P2: 11 · P3: 4.**

Already-closed (do not re-report): i18n `tl()` bypass in the 5 priority pages from Sprint 17, P2 i18n cleanups from Sprint 16/17, chunk-error route boundary, dashboard subscription single source. Several findings here are companions to issues called out in the 2026-05-23 audit but cover distinct call sites or symptoms — cross-linked where relevant.

---

## P1 findings

### UI-1 — `/path` (Sadhaka Path) is a dead page

- **File:** `src/app/[locale]/path/page.tsx:1-50`
- **Severity:** P1 (Lesson D — unlinked feature)
- **Evidence:** `grep -rn "'/path'\|\"/path\"" src/` returns zero hits anywhere outside the page file itself. The route renders the seven-tier Sadhaka journey grid backed by `/api/user/progress`. A sibling page `/sadhaka-path` exists with overlapping content, linked only from `/brihaspati`.
- **Why it's a bug:** Two near-identical destinations (`/path` and `/sadhaka-path`) — one dead, one barely-linked. Engagement features have no entry point; users only reach `/path` by typing the URL. Lesson D: "an unlinked page is a dead page."
- **Proposed fix:** Pick one canonical slug. Redirect the other (301). Link the canonical one from `/dashboard` (gamification card) and the user menu. Add to the learn / about cluster.

### UI-2 — `/vrat-calendar` orphaned (no consumer link)

- **File:** `src/app/[locale]/vrat-calendar/page.tsx`
- **Severity:** P1 (Lesson D)
- **Evidence:** Only appearances of `'/vrat-calendar'` are in `src/app/sitemap.ts:266` and `src/lib/seo/metadata.ts:435`. Not in navbar, footer, `/calendars` hub, `/calendar` page, learn index, or any other page.
- **Why it's a bug:** Same shape as Round-1's "library / saved kundalis" mistake — page exists, server-renders successfully, but is reachable only by direct URL / Google. Vrat content is high-intent traffic; sitting unlinked drops internal-link signal and hides the feature from authenticated users.
- **Proposed fix:** Add to `/calendars` hub and footer Calendars column. Cross-link from `/ekadashi` and `/calendar` festival pages.

### UI-3 — `/embed-demo` duplicates `/widget`

- **File:** `src/app/[locale]/embed-demo/page.tsx:1-50`, `src/app/[locale]/widget/WidgetConfigurator.tsx:31-40`
- **Severity:** P1 (Lesson D + Lesson B — single source of truth)
- **Evidence:** Both pages generate the identical `${BASE_URL}/embed/panchang?city=...` iframe snippet, with the same city picker. `grep -rn '/embed-demo'` returns only the sitemap and the page itself — no other consumer links to it. Neither `/widget` nor `/embed-demo` is linked from navbar / dashboard / footer.
- **Why it's a bug:** Two routes serve the same purpose; when one is updated (e.g. city list, new size variants) the other will silently drift. Both are unlinked, so users can't find either feature anyway.
- **Proposed fix:** Delete `/embed-demo` (or 301 → `/widget`). Add `/widget` to footer under "Developers / Embed" and to `/about` resources section.

### UI-4 — `/daily` index unlinked

- **File:** `src/app/[locale]/daily/page.tsx:1-50`
- **Severity:** P1 (Lesson D)
- **Evidence:** Renders the last 8 days of `generateDailyArticle(...)` SEO content. No `Link` to `/daily` exists anywhere in `src/components` or `src/app/[locale]/*/page.tsx` (verified via grep). The deeper `/daily/[date]/[city]/layout.tsx` references it only as a canonical, not as a user-visible link.
- **Why it's a bug:** The 8 most recent daily articles are a high-engagement content stream that should drive return visits — but no entry point exists. Same pattern as Round-1's "dead pages drag CTR signal".
- **Proposed fix:** Surface `/daily` from the panchang page's deep-dive sidebar and the `/calendars` hub. Add `<Link href="/daily">Daily Panchang Articles</Link>` to footer Resources column.

### UI-5 — `useEffect` profile pre-fill stomps `initialData` when only `relationship` is set

- **File:** `src/components/kundali/BirthForm.tsx:81-136`
- **Severity:** P1 (Lesson CC — partial-initialData edge case)
- **Evidence:**
  ```tsx
  useEffect(() => {
    if (!user) return;
    if (initialData?.name) return; // ← only guards on .name
    ...
    supabase.from('user_profiles').select(...).then(({ data }) => {
      ...
      setFormData(prev => { /* prev.name === DEFAULT → overwrite from profile */ });
    });
  }, [user]);
  ```
- **Why it's a bug:** "Add spouse chart" flows open BirthForm with `initialData={ relationship: 'spouse' }` but no `name` (the user is about to type it). The guard `initialData?.name` is bypassed, so the effect pre-fills the *logged-in user's* DOB / lat / lng / TZ into a form the user intends to fill with their *spouse's* birth data. The per-field `prev === DEFAULT_FORM_DATA.x` check prevents stomping mid-typing, but the spouse form opens already wrong: a user who clicks "Generate" without noticing the prefilled DOB will compute the wrong chart and save it as their spouse's. This is the same shape as Lesson N (Neelima incident) but for spouse/child editing, not self.
- **Proposed fix:** Strengthen the guard to `if (initialData && (initialData.name || initialData.relationship)) return;` — any non-self relationship should suppress profile prefill entirely.

### UI-6 — Pricing checkout: empty catch + browser-TZ currency derivation + no double-click guard

- **File:** `src/app/[locale]/pricing/page.tsx:177-219`
- **Severity:** P1 (Lessons A, project rule "no browser TZ", idempotency)
- **Evidence:**
  ```tsx
  const [currency, setCurrency] = useState<'INR' | 'USD'>(() => {
    if (typeof window === 'undefined') return 'INR';
    const tz = useLocationStore.getState().timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
    return tz.startsWith('Asia/') ? 'INR' : 'USD';
  });
  ...
  const handleCheckout = async (tier) => {
    ...
    try {
      ...
      const res = await fetch('/api/checkout', ...);
      ...
    } catch {                          // ← swallows network errors silently
      alert('Checkout failed');        // ← English-only across 10 locales
    }
  };
  ```
- **Why it's a bug:**
  1. `Intl.DateTimeFormat().resolvedOptions().timeZone` falls back to the **browser** TZ — violates the project rule "timezone from coordinates only, never browser/OS". A Switzerland-based user with VPN to India is charged INR; an Indian user whose browser is set to Europe/Zurich is charged USD.
  2. `catch { ... }` consumes the actual error — the user gets a generic "Checkout failed" alert (English only) and console-error never fires. No `console.error('[pricing] checkout failed:', err)`.
  3. `handleCheckout` has no `loading` / disabled state on the CTA button. Two clicks during the 800ms before Stripe responds can create two checkout sessions and trigger duplicate `checkout_started` analytics (and potentially duplicate Stripe Customers if the route auto-creates).
- **Proposed fix:** Derive currency from `useLocationStore.country` (coords → country); add `console.error` in catch; add `const [checkingOut, setCheckingOut] = useState(false)` and disable the button during fetch.

### UI-7 — `not-found.tsx` is English-only

- **File:** `src/app/[locale]/not-found.tsx:1-42`
- **Severity:** P1 (Lesson J — non-negotiable locale fallback)
- **Evidence:** "Page Not Found", "The celestial path you seek does not exist...", "Return Home", "View Panchang" — all hardcoded English. The file is `[locale]/not-found.tsx`, so it renders for every locale (en/hi/ta/te/bn/kn/mr/gu/mai/sa).
- **Why it's a bug:** Lesson J: "render English if regional translation is missing — never undefined or key path." Here it's worse: the page renders English **even when a translation exists** because the strings aren't wired through `useTranslations` or `tl()`. A Maithili user landing on a typo URL gets a fully English error screen — same UX failure as the original Sprint-17 i18n bombing.
- **Proposed fix:** Same shape as the matching/error.tsx fix — pull strings from `useTranslations('common.notFound')` or use a local `LABELS` map keyed by locale.

---

## P2 findings

### UI-8 — `error.tsx` boundaries are English-only

- **File:** `src/app/[locale]/error.tsx:32-48` (and 8 route-specific copies under `kp-system/`, `muhurta-ai/`, `panchang/`, `matching/`, `learn/`, `calendar/`, `sign-calculator/`, `kundali/`)
- **Severity:** P2 (Lesson J)
- **Evidence:** All 9 error.tsx files appear to hardcode "Something Went Wrong" / "Try Again" in English.
- **Why it's a bug:** Same shape as UI-7. When a kundali compute throws or the panchang API 500s, every non-EN locale sees an English boundary card.
- **Proposed fix:** Inline `LABELS` or pull from `next-intl` (error boundaries are client components so `useTranslations` works).

### UI-9 — Dashboard returns blank page when `personalizedDay` derivation fails

- **File:** `src/app/[locale]/dashboard/page.tsx:1345-1346`
- **Severity:** P2 (Lesson F — loading state must terminate visibly)
- **Evidence:**
  ```tsx
  const pd = personalizedDay;
  if (!pd) return null;                // ← renders blank page
  ```
- **Why it's a bug:** If `computePersonalizedDay(...)` throws (rare but possible with malformed snapshot), `loading` is already false but `personalizedDay` stays null → page renders nothing. The user sees a navbar, an empty body, and no actionable error or retry. Lesson F: every branch of a fetch / compute must flip loading to a visible end state, not vanish.
- **Proposed fix:** Render a graceful fallback ("We couldn't compute your dashboard today. [Reload] or visit [Settings] to update your birth data.") and `console.error` the underlying reason.

### UI-10 — Settings & 4 sibling pages: `.then(({ data }) => ...)` swallows Supabase error

- **Files:**
  - `src/app/[locale]/settings/page.tsx:497-538`
  - `src/app/[locale]/horoscope/HubClient.tsx:286-298`
  - `src/app/[locale]/sign-calculator/page.tsx:66`
  - `src/app/[locale]/baby-names/page.tsx:50`
  - `src/app/[locale]/dashboard/saved-charts/page.tsx:52-55`
- **Severity:** P2 (Lesson A — never silently swallow errors)
- **Evidence:** All five use the pattern `.then(({ data }) => { if (data) { ... } setLoading(false); })` without destructuring `error`. If Supabase returns `{ data: null, error: ... }`, the page silently shows the empty / unauth state. No `console.error`, no user feedback.
- **Why it's a bug:** When RLS denies a SELECT (e.g. session was just refreshed and access_token is stale), Settings shows the user "no birth data" CTA instead of "your session expired, please sign in". `dashboard/saved-charts` shows an empty list when the user actually has 12 saved charts but the query failed. Lesson A is a universal rule called out explicitly in the global CLAUDE.md.
- **Proposed fix:** Destructure `({ data, error })`; on error path → `console.error('[<module>] X failed:', error)` AND set a visible error banner.

### UI-11 — AuthModal is entirely English (all 10 locales)

- **File:** `src/components/auth/AuthModal.tsx:46-75, 94-203`
- **Severity:** P2 (Lesson J — non-negotiable locale fallback)
- **Evidence:** Hardcoded strings: "Passwords do not match" (L47), "Password reset link sent to your email." (L57), "Check your email for a confirmation link to complete signup." (L69), "Authentication service is not configured. Please try again later." (L75), button labels "Sign In" / "Create Account" / "Reset Password" / "Send Reset Link" / "Loading..." / "Forgot Password?". No `useTranslations`, no `tl()`, no `LABELS` map.
- **Why it's a bug:** AuthModal is the conversion funnel's primary surface — shown to every locale. A Maithili user (#1 traffic driver per memory) sees an entirely English form for the most important action on the site. Round-1 closed the navbar i18n but missed the modal which renders OVER the navbar.
- **Proposed fix:** Add a per-locale LABELS object the way `OnboardingModal.tsx` already does. Pipe `useLocale()` and `getBodyFont()` so the form renders in script-appropriate fonts.

### UI-12 — OnboardingModal cannot be closed by keyboard

- **File:** `src/components/auth/OnboardingModal.tsx:127-136, 248-260`
- **Severity:** P2 (a11y + UX)
- **Evidence:** No `keydown` Escape handler (compare to `AuthModal.tsx:31-38` which has one). Backdrop is `<div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />` with no `onClick={onClose}` (comment at L251: "Backdrop — not dismissable"). A "Skip for now" button exists at L374 but only via mouse. There is no `aria-modal="true"` / `role="dialog"` wrapper either.
- **Why it's a bug:** Keyboard-only users (screen readers, low-vision, motor-impaired) cannot dismiss the modal — the only exit is mouse-clicking "Skip". Lesson 6 of CLAUDE.md ("Test at the real boundary") applies to a11y too: voiceover users get trapped.
- **Proposed fix:** Add a `useEffect` Escape handler that calls the Skip-equivalent action (persist name + level, hide modal). Add `role="dialog" aria-modal="true" aria-labelledby={titleId}` to the modal container.

### UI-13 — ArchetypeRevealModal has no Escape close

- **File:** `src/components/auth/ArchetypeRevealModal.tsx:12-50`
- **Severity:** P2 (a11y)
- **Evidence:** `onClose` prop is wired to backdrop click (L50: `onClick={onClose}`) but there's no `useEffect` keydown listener. No focus trap.
- **Why it's a bug:** Same shape as UI-12 but for the post-signup reveal modal. Tab key navigates underlying page elements; Escape does nothing.
- **Proposed fix:** Add the same `useEffect` keydown listener as AuthModal uses.

### UI-14 — `/profile` English-locale block contains a Tamil string

- **File:** `src/app/[locale]/profile/page.tsx:99`
- **Severity:** P2 (data error — wrong locale value)
- **Evidence:**
  ```tsx
  en: {
    ...
    noBirthData: 'Your Vedic birth profile will appear here once you add your birth details.',
    addBirthData: 'பிறப்பு விவரங்கள் சேர்க்கவும்',   // ← Tamil text inside the `en` block
    notSignedIn: 'Sign in to view your Vedic profile.',
    ...
  },
  ```
  Line 99 inside `L.en` reads `addBirthData: 'பிறப்பு விவரங்கள் சேர்க்கவும்'` — that's the Tamil ("Add birth details"). The Tamil block on line 210 also has its own `addBirthData`, so the Tamil locale is fine, but EN users land on the empty-state CTA with Tamil text.
- **Why it's a bug:** Copy-paste error. English users (en, default locale, ~30% of traffic) see Tamil script on the "Add birth details" call-to-action button. Probably introduced when the Tamil locale was added.
- **Proposed fix:** Replace L99 with `addBirthData: 'Add Birth Details',`.

### UI-15 — Matching error messages 3-locale ternary (8 locales fall back to Hindi)

- **File:** `src/app/[locale]/matching/Client.tsx:186-188`
- **Severity:** P2 (Lesson J)
- **Evidence:**
  ```tsx
  if (!res.ok) {
    setMatchError(isTamil
      ? 'பொருத்தம் தோல்வி...'
      : locale === 'en'
        ? 'Matching failed. Please try again.'
        : 'मिलान विफल। कृपया पुनः प्रयास करें।'   // ← shown for te/bn/kn/mr/gu/mai/sa
    );
  }
  ```
- **Why it's a bug:** Bengali / Telugu / Kannada / Marathi / Gujarati / Maithili / Sanskrit users see a Hindi-script error string. The site otherwise localises matching beautifully, so this single ternary undoes the polish for 7 locales.
- **Proposed fix:** Replace with a `tl({ en, hi, ta, te, bn, kn, mr, gu, mai, sa }, locale)` call.

### UI-16 — Kundali compute alert is 2-locale ternary

- **File:** `src/app/[locale]/kundali/Client.tsx:942, 967, 1051`
- **Severity:** P2 (Lesson J)
- **Evidence:** Three `alert(locale === 'hi' ? '<hindi>' : '<english>')` calls. All 8 other locales get English. Plus `alert()` itself is a poor UX (use the inline error banner pattern already established at L376).
- **Why it's a bug:** Same shape as UI-15 but for the Kundali generation path. Failure surface for the most important feature degrades to native `alert()` in English.
- **Proposed fix:** Replace with the inline banner pattern (already wired) + `tl()` over all 10 locales.

### UI-17 — PanchangClient fetch error is silent (no user feedback)

- **File:** `src/app/[locale]/panchang/PanchangClient.tsx:408-427`
- **Severity:** P2 (Lesson A — surface failures to user)
- **Evidence:**
  ```tsx
  .catch((err) => {
    console.error('[PanchangClient] fetch failed:', err);
    setLoading(false);
  });
  ```
- **Why it's a bug:** When `/api/panchang` 5xx's, loading terminates but `panchang` state stays at the previous value (or null). The page silently shows stale or empty cards with no banner / toast / retry button. Lesson A: "Every failure path must log AND surface to the user."
- **Proposed fix:** Add `const [fetchError, setFetchError] = useState<string | null>(null)` and render a top banner with a retry CTA.

### UI-18 — Profile page hides fetch failures, shows misleading "add birth data" CTA

- **File:** `src/app/[locale]/profile/page.tsx:454-475`
- **Severity:** P2 (Lesson A)
- **Evidence:** `if (res.ok) { ... }` — when not ok (401 stale token, 5xx server), the function exits without setting any error state. `hasData = snapshot && profileInfo?.date_of_birth` evaluates falsy → user lands on "no birth data" CTA at L705-720 even though they DO have birth data and the fetch just failed.
- **Why it's a bug:** Misleading UX. A returning user with saved birth data sees the new-user empty state and may re-enter their data, causing duplicate writes (which the saved_charts dedupe does block, but `user_profiles` upsert just overwrites).
- **Proposed fix:** Distinguish "fetch failed" from "user has no birth data" states. Show a retry button on the former.

---

## P3 findings

### UI-19 — LocaleSwitcher loses URL search params on switch

- **File:** `src/components/layout/LocaleSwitcher.tsx:16-22`
- **Severity:** P3 (polish)
- **Evidence:** `router.replace(pathname, { locale })` — `pathname` from `usePathname()` excludes the search string. A user on `/panchang?date=2026-05-24` who switches locale lands on `/{newLocale}/panchang` without the date param.
- **Why it's a bug:** Minor UX loss. Date / city / form state in the URL is reset on every locale switch.
- **Proposed fix:** Read `useSearchParams()` and re-append: `router.replace(`${pathname}?${searchParams.toString()}`, { locale })`.

### UI-20 — Modals lack `autoFocus` on first interactive element

- **Files:** `src/components/auth/AuthModal.tsx`, `src/components/auth/OnboardingModal.tsx`
- **Severity:** P3 (a11y polish)
- **Evidence:** No `autoFocus` prop on the first `<input>` in either modal, and no `useEffect` ref.focus on mount.
- **Why it's a bug:** Keyboard users need to Tab from outside the modal into the first field on open. The modal isn't focus-trapped either.
- **Proposed fix:** Add `autoFocus` to the email/name field. Add a small focus-trap (loop Tab around the modal's tabbable children).

### UI-21 — `transit-playground` and `sky-map` reachable only via SEO related-links sidebar

- **Files:** `src/app/[locale]/transit-playground/page.tsx`, `src/app/[locale]/sky-map/page.tsx`, `src/lib/seo/cross-links.ts:149,167,293,321,327,332,341`
- **Severity:** P3 (Lesson D — borderline)
- **Evidence:** Neither slug appears in navbar, dashboard, footer, the `/tools` hub, the `/calendars` hub, or the homepage. The only consumer is `cross-links.ts` — surfaced in the `<RelatedLinks>` sidebar of OTHER tool pages.
- **Why it's a bug:** Users who don't already know to visit a related tool will never see these. Not strictly dead (one indirect path exists) but visibility is essentially zero.
- **Proposed fix:** Promote both to the `/tools` mega-card grid alongside `/sky` (already there). Cross-link from `/transits`.

### UI-22 — SearchModal uses `setTimeout(focus, 50)` instead of a ready event

- **File:** `src/components/search/SearchModal.tsx:160`
- **Severity:** P3 (Lesson E)
- **Evidence:** `setTimeout(() => inputRef.current?.focus(), 50);`
- **Why it's a bug:** Lesson E: "Never use `setTimeout(..., N)` as a substitute for a real readiness signal." On slow devices or during heavy main-thread work, 50ms isn't enough; on fast devices it's wasted delay. The portal is mounted synchronously — focus should be called inside a `useLayoutEffect` after `setOpen(true)`.
- **Proposed fix:** Use `useLayoutEffect(() => { if (open) inputRef.current?.focus(); }, [open]);`

---

## Cross-cutting themes

1. **Lesson J (locale fallback) is still bleeding.** Sprint 17 closed the navbar and 5 priority pages, but the entire auth modal (UI-11), the 404 page (UI-7), all 9 error boundaries (UI-8), Matching errors (UI-15), and Kundali compute alerts (UI-16) remain English-only. These are the *exact same shape* as the original Maithili-bombing that triggered Sprint 0. They are also the most-rendered surfaces in the whole app (modal opens on every auth attempt; not-found renders on every typo URL; error boundary renders on every render failure). One pattern fix — a `withFallback(LABELS, locale)` helper — would cover all.

2. **Lesson A `.then(({ data }) => ...)` is repeated in 5+ pages.** Settings, HubClient, sign-calculator, baby-names, dashboard/saved-charts (UI-10) all use the same error-ignoring shape. The global rule explicitly bans this. Recommend a project-wide grep+lint rule: `\.then\(\(\{\s*data\s*\}\)` → CI failure.

3. **Lesson D (unlinked pages) — 5 dead/near-dead pages in this round.** `/path`, `/vrat-calendar`, `/embed-demo`, `/daily`, plus the borderline `/transit-playground` and `/sky-map`. Each represents either a feature that was built but never integrated (Lesson D's exact failure mode) or a duplicate of an existing slug. Recommend a build-time check that every route in `app/[locale]` either appears in nav/footer OR is whitelisted as a deep-link-only SEO page.

4. **Two pages still re-derive the same data instead of importing from a single source (Lesson B).** `/path` ↔ `/sadhaka-path` (gamification levels) and `/widget` ↔ `/embed-demo` (embed iframe builder). Plus the BirthForm useEffect (UI-5) reads `user_profiles` *again* even though Settings has already loaded it into the same Supabase client cache — a third independent prefill path. Recommend extracting a shared `useUserProfile()` hook with stale-while-revalidate caching.

5. **Modal accessibility is inconsistent.** AuthModal has Escape but no focus management. OnboardingModal has neither. ArchetypeRevealModal has neither. SearchModal has Escape + backdrop close but uses a setTimeout focus. Recommend a shared `<Modal>` primitive that owns: portal, role="dialog", aria-modal, Escape close, backdrop close, focus trap, autoFocus, body scroll lock. Today each modal re-implements a subset.

6. **Dashboard's "null-return" pattern is a Lesson F violation in disguise.** UI-9 (`if (!pd) return null`) renders an empty page instead of a graceful fallback. The "loading=false but data=null" branch needs a UI, not silence. Audit for `return null` in any page-level component that has already terminated loading.

— end —

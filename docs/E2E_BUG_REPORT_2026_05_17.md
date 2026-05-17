# E2E Bug Report — 17 May 2026

Deep bug hunt across 4 user flows using Playwright E2E testing.
Agents still running for kundali, homepage, and auth flows — this document will be updated.

---

## LEARN SECTION (6 bugs)

### BUG L1: Sidebar CTA always says "Continue Learning" even with zero mastered modules
- **Severity**: MEDIUM
- **File**: `src/components/learn/LearnSidebar.tsx` (line 371)
- **Steps**: Visit `/en/learn` with fresh localStorage
- **Expected**: "Start Learning" when no modules mastered
- **Actual**: Always "Continue Learning" — hero CTA is correct but sidebar is not
- **Fix**: Add `hasMastered` check matching the hero CTA logic

### BUG L2: Phase subtitles are hardcoded English, never localised
- **Severity**: LOW
- **File**: `src/lib/learn/module-sequence.ts` (lines 341-357)
- **Steps**: View learn page in Hindi
- **Expected**: Translated subtitles
- **Actual**: `subtitle` is `string` not `Record<string, string>` — always English

### BUG L3: Modules index "Begin" button links to wrong module (skips Phase 0)
- **Severity**: HIGH
- **File**: `src/app/[locale]/learn/modules/page.tsx` (line 201)
- **Steps**: Go to `/learn/modules`, click "Begin"
- **Expected**: Links to `/learn/modules/0-1` (Phase 0: "What is Jyotish?")
- **Actual**: Links to `/learn/modules/1-1` (Phase 1) — skips entire Pre-Foundation phase

### BUG L4: Turbopack auto-navigates away from learn pages (dev only)
- **Severity**: HIGH (dev only)
- **Steps**: Navigate to any learn module, wait 2-5 seconds
- **Actual**: Page randomly navigates to `/en/kundali` or other pages ~50% of the time
- **Note**: Turbopack HMR instability. Not a code bug — verify in production.

### BUG L5: LearnSidebar ignores Tamil/Bengali translations
- **Severity**: LOW
- **File**: `src/components/learn/LearnSidebar.tsx` (lines 36-39)
- **Steps**: View sidebar in Tamil
- **Actual**: Binary `isDevanagari ? hi : en` check skips `ta`/`bn` translations that exist in LABELS

### BUG L6: Learn landing inline strings only handle `hi` and `en`
- **Severity**: LOW
- **File**: `src/app/[locale]/learn/page.tsx` (lines 203-205)
- **Steps**: View learn page in Tamil/Bengali
- **Actual**: Falls through to English for `ta`/`bn` on hero tagline and other inline text

---

## KUNDALI FLOW (pending — agent running)

## HOMEPAGE + PANCHANG (6 bugs)

### BUG H1: Double locale prefix in Panchang "By City" SEO links — ALL 50+ city links 404
- **Severity**: CRITICAL
- **File**: `src/app/[locale]/panchang/page.tsx` (lines 320, 340, 354)
- **Steps**: Go to `/en/panchang`, scroll to "Panchang by City" section at bottom
- **Expected**: Links go to `/en/panchang/delhi`
- **Actual**: Links go to `/en/en/panchang/delhi` — doubled locale. ALL city links 404.
- **Root cause**: `Link` from `@/lib/i18n/navigation` auto-prepends locale, but href also includes `/${locale}/`. Should be `/panchang/${city.slug}`.

### BUG H2: Duplicate "| Dekho Panchang" in Tools page title
- **Severity**: MEDIUM
- **File**: `src/app/[locale]/tools/layout.tsx` (line 10)
- **Steps**: Navigate to `/en/tools`
- **Actual**: Title is "...| Dekho Panchang | Dekho Panchang" (doubled suffix)
- **Fix**: Remove `| Dekho Panchang` from the title string — parent template adds it.

### BUG H3: Daily Cosmic Briefing missing on non-Vercel environments
- **Severity**: MEDIUM
- **File**: `src/app/[locale]/page.tsx` (line 629)
- **Steps**: Visit homepage on localhost
- **Expected**: Briefing section with today's narrative
- **Actual**: Section absent — depends on Vercel geo headers, no fallback
- **Impact**: Devs and any non-Vercel deploy never see this section

### BUG H4: Hidden Dashboard/Family navbar links are in accessibility tree
- **Severity**: LOW
- **Steps**: Tab through navbar with keyboard
- **Actual**: Invisible links (width:0) are focusable — no `aria-hidden` or `tabIndex={-1}`

### BUG H5: AdSense CSP violations on every page
- **Severity**: LOW
- **Actual**: `img-src` blocks `pagead2.googlesyndication.com`, `connect-src` blocks `ep1.adtrafficquality.google`
- **Fix**: Add these domains to CSP headers

### BUG H6: Emoji icons used on homepage despite "no emoji" rule
- **Severity**: LOW
- **Actual**: Eclipse card uses 🔮, "New to Vedic Astrology?" uses literal `?` — should be SVG icons

## AUTH + SIGNUP + SAVE (11 bugs)

### BUG A1: Signup prompt page view counter inflates — shows after 1 page instead of 3
- **Severity**: HIGH
- **File**: `src/components/auth/SignupPrompt.tsx` (lines 52-58)
- **Steps**: Clear localStorage, visit any single page
- **Expected**: Modal after 3 page views
- **Actual**: Counter jumps to 4 on a single load — `initialized` changing re-fires the effect, incrementing again. In Strict Mode (dev) it's worse.
- **Fix**: Track prev pathname in a ref, skip increment if unchanged.

### BUG A2: `kundali:generated` event never fires from form-based generation
- **Severity**: HIGH
- **File**: `src/app/[locale]/kundali/Client.tsx`
- **Steps**: Fill birth form, click Generate
- **Expected**: Event dispatches, triggering signup for non-logged-in users
- **Actual**: Event dispatch is only in the URL-param loading path (saved charts). `handleGenerate()` never dispatches it. Most users use the form.

### BUG A3: Orphaned setTimeout in kundali:generated handler
- **Severity**: MEDIUM
- **File**: `src/components/auth/SignupPrompt.tsx` (lines 81-84)
- **Steps**: Generate chart, navigate away within 3s
- **Actual**: 3s timer ID not stored, not cleared in cleanup. Fires after effect re-runs.

### BUG A4: No user-facing error when kundali API fails — dead click
- **Severity**: HIGH
- **File**: `src/app/[locale]/kundali/Client.tsx` (lines 824-828)
- **Steps**: Generate chart when API fails (network error)
- **Expected**: Error message shown to user
- **Actual**: Loading spinner stops, nothing shown. Only console.error. Silent dead click.

### BUG A5: Password reset redirect hardcoded to `/en/settings`
- **Severity**: MEDIUM
- **File**: `src/stores/auth-store.ts` (line 90)
- **Steps**: Reset password from Hindi locale
- **Actual**: Always redirects to `/en/settings` regardless of active locale

### BUG A6: Google OAuth failure silently swallowed
- **Severity**: MEDIUM
- **File**: `src/stores/auth-store.ts` (lines 95-113)
- **Steps**: Click Google sign-in when popup blocked or network fails
- **Actual**: Button appears to do nothing. No error shown. Only console.error.

### BUG A7: AuthModal catch block does not log errors
- **Severity**: LOW
- **File**: `src/components/auth/AuthModal.tsx` (lines 73-75)
- **Actual**: Error shown to user but NOT logged to console. Violates Lesson A.

### BUG A8: Share button shares generic URL, not the actual chart
- **Severity**: MEDIUM
- **File**: `src/app/[locale]/kundali/Client.tsx` (line 1122)
- **Steps**: Generate chart, click Share
- **Expected**: URL includes chart params so recipient sees same chart
- **Actual**: Shares `dekhopanchang.com/en/kundali` — blank generator. Useless link.

### BUG A9: Silent catch blocks in kundali Client.tsx (3 instances)
- **Severity**: LOW
- **File**: `src/app/[locale]/kundali/Client.tsx` (lines 534, 584, 848)
- **Actual**: `catch { /* quota */ }` swallows errors silently. No console.error.

### BUG A10: CSP missing AdSense subdomains (duplicate of H5)
- **Severity**: LOW
- **Actual**: Same as H5 — `ep1.adtrafficquality.google` and `pagead2.googlesyndication.com`

### BUG A11: Save button invisible to logged-out users — missed conversion
- **Severity**: LOW (design gap)
- **File**: `src/app/[locale]/kundali/Client.tsx` (line 1066)
- **Actual**: Save button hidden with `{user && (...)}`. No "Sign in to save" prompt. Users don't know saving exists.

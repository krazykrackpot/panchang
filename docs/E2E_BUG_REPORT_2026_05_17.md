# E2E Bug Report — 17 May 2026 (Round 1 + Round 2)

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

## KUNDALI FLOW (6 bugs)

### BUG K1: Truncated/garbled yoga text in Simple mode (OPEN)
- **Severity**: MEDIUM
- **Steps**: Generate kundali, stay in Simple mode, scroll to "Your Key Strengths"
- **Actual**: "Per- Raja Yoga" (word "lagna" dropped), "(9th+)" truncated, empty parentheses
- **Note**: Only in Simple mode — Expert mode shows full text. Likely CSS truncation or render issue.

### BUG K2: "3th" ordinal instead of "3rd" — FIXED
- **Severity**: LOW
- **File**: `src/lib/kundali/domain-synthesis/current-period.ts` (line 456)
- **Actual**: `${houseLabel}th house` always appends "th" — no ordinal logic
- **Fixed**: Added `ordEn()` helper

### BUG K3: "Mahadasha Mahadasha" in Key Takeaways — FIXED
- **Severity**: LOW
- **File**: `src/components/kundali/SummaryView.tsx`
- **Actual**: `currentMaha` already contains "Moon Mahadasha", code appended "Mahadasha" again
- **Fixed**: Removed extra "Mahadasha" / "महादशा"

### BUG K4: Three fixed bottom elements overlap (Ask button + PWA + Signup) (OPEN)
- **Severity**: MEDIUM
- **Actual**: Ask Your Chart button, PWA install prompt, and signup banner all stack in bottom-right
- **Fix needed**: Z-index management or dismiss one when another appears

### BUG K5: No "Save" button for logged-out users (duplicate of A11) (OPEN)
- **Severity**: MEDIUM

### BUG K6: Sporadic auto-navigation away from pages (dev only) (OPEN)
- **Severity**: HIGH (dev only)
- **Note**: Turbopack HMR instability with accumulated localStorage page views. Not a production bug.

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

---

## ROUND 2 — PANCHANG, TOOLS, CALENDAR (15 bugs)

### SYSTEMIC BUGS

#### BUG S1: Hydration mismatch on ALL location-dependent pages (HIGH)
- **Affected**: /panchang, /choghadiya, /hora, /vedic-time, /upagraha, /sade-sati, /muhurta-ai, /eclipses, /lunar-calendar, /learn (11+ pages)
- **Root cause**: Client reads location from Zustand+localStorage. Server renders with null/default. React re-renders entire tree.
- **Fix**: `suppressHydrationWarning` on location text, or defer location display to client-only pass.

#### BUG S2: Double `<main>` elements on 6+ pages (MEDIUM)
- **Affected**: /rahu-kaal, /choghadiya, /hora, /vedic-time, /upagraha, /lunar-calendar
- **Root cause**: layout.tsx wraps in `<main>`, individual pages ALSO render `<main>`. Nested `<main>` is invalid HTML.
- **Fix**: Replace `<main>` in individual pages with `<div>` or `<section>`.

#### BUG S3: CSP missing ep2.adtrafficquality.google in script-src (LOW)
- **Actual**: H5 fix added connect-src/img-src but script-src also needs `https://ep2.adtrafficquality.google`

### PAGE-SPECIFIC BUGS

#### BUG R1: Calendar location shows browser UTC offset, not location's (MEDIUM)
- **Page**: /en/calendar
- **Actual**: Shows "Mumbai, India UTC+2" — uses browser TZ (Europe/Zurich) not Mumbai's (+5:30)
- **File**: `src/app/[locale]/calendar/Client.tsx` lines 196, 205

#### BUG R2: Sade Sati Saturn degree discrepancy — server 16.7° vs client 11.6° (HIGH)
- **Page**: /en/sade-sati
- **Root cause**: Server uses `getCurrentSaturnSign()` at ISR time (possibly weeks stale). 5.1° gap is impossible for 24h ISR.

#### BUG R3: Makar Sankranti shows 2027 from 2026 calendar (MEDIUM)
- **Page**: /en/calendar/makar-sankranti
- **Root cause**: Detail page calculates NEXT occurrence. Jan 14 2026 passed, so shows 2027. Calendar listed it under 2026.

#### BUG R4: /en/learn/festival-rules is a dead link (MEDIUM)
- **Referenced from**: Festival detail pages
- **Actual**: Slug exists in module-sequence.ts but no page file exists. Silently shows Learn hub.

#### BUG R5: Nakshatra SVG floating-point hydration mismatch (LOW)
- **Page**: /en/panchang/nakshatra
- **Root cause**: `cy` attribute differs by last digit between server/client JS engines

#### BUG R6: Swiss Ephemeris `require()` error in Turbopack (LOW)
- **Pages**: Deep-dive pages calling `computePanchang` in `generateMetadata`
- **Actual**: `ReferenceError: require is not defined`. Falls back to Meeus gracefully.

#### BUG R7: Learn page progress hydration mismatch (MEDIUM)
- **Page**: /en/learn
- **Root cause**: Progress in localStorage unavailable during SSR. LearningPath renders different HTML.

#### BUG R8: Lunar calendar severe structural hydration mismatch (HIGH)
- **Page**: /en/lunar-calendar
- **Root cause**: Completely different element trees based on location availability (server=null, client=stored)

## ROUND 2 — KUNDALI DEEP SECTIONS (6 bugs)

### BUG KD1: Blueprint headline grammar — "in a The Warrior phase" (LOW)
- **File**: `src/lib/kundali/archetype-engine.ts` (line 179-180)
- **Actual**: Template uses `in a ${name} phase` but archetype names already include "The" prefix
- **Fix**: Remove "a" from template or strip "The" from names in headline

### BUG KD2: Duplicate `border` CSS class on planet cards (LOW)
- **File**: `src/app/[locale]/kundali/Client.tsx` (line 2128)
- **Actual**: Two `border` classes — `border-gold-primary/12` always applied even for unselected cards

### BUG KD3: Vedic-time hydration mismatch — same root cause as S1 (MEDIUM)
- **Page**: /en/vedic-time
- **Actual**: Server renders "Europe/Zurich", client renders "Mumbai, India"

### BUG KD4: Silent catch in kundali/[id]/page.tsx (LOW)
- **File**: `src/app/[locale]/kundali/[id]/page.tsx` (line 75)
- **Actual**: `catch { setError(...) }` — no console.error. Violates Lesson A.

### BUG KD5: AdSense CSP script-src missing (duplicate of S3) (LOW)

### BUG KD6: Turbopack HMR random navigation (dev only, duplicate of K6/L4) (DEV ONLY)

### All 23 Expert tabs PASSED — zero application-level JS errors.
### Edge cases PASSED: 1920 date, 2030 date, Reykjavik (64°N).

---

## FULL SUMMARY

| Round | Bugs Found | Fixed | Open |
|-------|-----------|-------|------|
| Round 1 | 29 | 21 | 8 |
| Round 2 — Panchang/Tools | 15 | 0 | 15 |
| Round 2 — Kundali Deep | 6 | 0 | 6 |
| **Total** | **50** | **21** | **29** |

### Priority breakdown of remaining 29 open bugs:

**HIGH (3):**
- S1: Systemic hydration mismatch on 11+ location-dependent pages
- R2: Sade Sati Saturn degree discrepancy (server ISR stale vs client real-time)
- R8: Lunar calendar structural hydration mismatch

**MEDIUM (11):**
- S2: Double `<main>` on 6+ pages
- R1: Calendar shows browser UTC offset instead of location's
- R3: Festival detail shows next year from current year calendar
- R4: /learn/festival-rules dead link
- R7: Learn page progress hydration mismatch
- K1: Truncated yoga text in Simple mode (partially fixed)
- K4: Bottom elements overlap (partially fixed — moved Ask button up)
- KD3: Vedic-time hydration mismatch (same root cause as S1)
- L1: Sidebar CTA always "Continue Learning"
- L2: Phase subtitles hardcoded English
- L6: Learn landing inline strings only hi/en

**LOW (10):**
- S3/KD5: CSP script-src missing ep2.adtrafficquality.google
- R5: Nakshatra SVG floating-point hydration
- R6: Swiss Ephemeris require() in Turbopack
- KD1: Blueprint "in a The Warrior" grammar
- KD2: Duplicate border CSS class
- KD4: Silent catch in kundali/[id]
- H4: Hidden nav links a11y (already fixed in commit)
- L5: Sidebar ta/bn (already fixed in commit)

**DEV ONLY (2):**
- K6/L4/KD6: Turbopack HMR random navigation

**Already fixed in pending commit (3):**
- H4, L5, H6 — included in the 9-bug fix commit

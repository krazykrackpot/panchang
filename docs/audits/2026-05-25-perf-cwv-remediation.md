# Performance + CWV Remediation Plan — 2026-05-25

**Scope:** Detailed remediation for the five high-severity performance findings from the 2026-05-24 SEO deep audit (`docs/audits/2026-05-24-seo-deep-audit.md` section "5. Performance + Core Web Vitals"). **Documentation only — no code changes in this pass.** Each section includes the specific files to touch, the precise diff shape, and a risk/test plan.

**Recommended order:** A → C → B → D → E. A and C are the biggest wins per minute spent. B requires coordinating Supabase project-URL env access. D is small. E is a single number change.

---

## A. Remove global AdSense, restore on-demand loading (HIGHEST IMPACT)

### Finding
`src/app/[locale]/layout.tsx:155-159` ships `adsbygoogle.js` as an async `<script>` on **every page**, despite the comment at line 198 claiming "AdSense script removed from global layout — loaded on-demand by AdUnit." The on-demand loader exists in `src/components/ads/AdUnit.tsx:44-48` but is dead code while the global script is still in `<head>`. Net effect: every ad-free route (dashboard, kundali generator, brihaspati chat, panchang, settings, the entire authenticated surface) carries the AdSense payload.

Per the audit estimate, `~80 KB` and one extra TLS handshake on every page load. On mid-range mobile with cold cache, this is `200–400 ms` of LCP penalty on routes that never render an ad.

### Files to touch
- `src/app/[locale]/layout.tsx` (remove lines 145-159)
- `src/components/ads/AdUnit.tsx` (verify the on-demand loader fires correctly)

### Diff shape

```diff
--- a/src/app/[locale]/layout.tsx
+++ b/src/app/[locale]/layout.tsx
@@ -141,21 +141,8 @@
       </head>
       <body className={...} suppressHydrationWarning>
         <Script id="theme-init" strategy="beforeInteractive">{...}</Script>
-        {/* Google Consent Mode v2 — MUST run before adsbygoogle.js below so
-            consent defaults are set before AdSense initializes. */}
-        <Script id="consent-default" strategy="beforeInteractive">{CONSENT_DEFAULT_SCRIPT}</Script>
-        {/* Google AdSense — loaded as a raw <script>, NOT next/script.
-            next/script tags every injected script with `data-nscript=...`,
-            which AdSense's loader rejects with a console warning:
-              "AdSense head tag doesn't support data-nscript attribute."
-            The warning is cosmetic but pollutes browser console logs.
-            Raw async <script> still loads off the critical path because
-            of the async attribute. */}
-        <script
-          async
-          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4787764488539456"
-          crossOrigin="anonymous"
-        />
+        {/* Consent Mode + AdSense are loaded on-demand by AdUnit.tsx on the
+            specific routes that render ads. Moved out of global layout May 2026
+            to spare ad-free routes ~80 KB + one TLS handshake. */}
         <script
           type="application/ld+json"
```

And inside `AdUnit.tsx`, ensure the loader inserts BOTH the consent script (currently in `CONSENT_DEFAULT_SCRIPT`) **and** the AdSense script, in that order, with consent before adsbygoogle (Google's requirement).

### Risk
- **Ad rendering breakage** on pages that DO show ads. Audit: `grep -rn "<AdUnit" src/` to enumerate ad placements. Spot-check each in a browser after the change.
- **Consent Mode v2 compliance**: AdSense's loader requires consent defaults set BEFORE adsbygoogle.js executes. The on-demand AdUnit must emit consent THEN adsbygoogle, NOT in parallel.

### Test plan
- [ ] `grep -rn "<AdUnit" src/app src/components` → list every ad route
- [ ] For each ad route, load in browser, verify `gtag('consent','default',...)` fires before AdSense network request (DevTools → Network → filter `pagead`)
- [ ] For 3 ad-free routes (`/dashboard`, `/brihaspati`, `/panchang`), confirm zero `pagead2.googlesyndication.com` requests
- [ ] Lighthouse before/after on `/panchang` — expect LCP improvement of 150-300ms

### Estimated effort: 1-2 hours

---

## B. Add resource hints (`preconnect`, `dns-prefetch`) for critical origins

### Finding
`src/app/[locale]/layout.tsx` `<head>` (lines ~120-142) emits zero `preconnect` / `dns-prefetch` hints. Every authenticated page hits Supabase on hydration. Ad-rendering pages hit AdSense. PDF/image-share routes hit Resend / Cloudflare images. Without preconnect, each origin pays the full DNS + TLS handshake cost on first request — `~100-200 ms` per origin.

### Files to touch
- `src/app/[locale]/layout.tsx` (add ~6 lines in `<head>` just before line 142)
- Confirm `NEXT_PUBLIC_SUPABASE_URL` env var format — extract hostname for preconnect

### Diff shape

```diff
--- a/src/app/[locale]/layout.tsx
+++ b/src/app/[locale]/layout.tsx
@@ -138,7 +138,16 @@
       <head>
         <link rel="author" href="/llms.txt" />
         <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLM Full Context" />
+        {/* Preconnect critical third-party origins to shave 200-400ms off LCP.
+            Supabase hits on every authenticated page hydration. AdSense lives
+            here in case the on-demand loader fires during initial render (rare
+            but observed). */}
+        <link rel="preconnect" href={SUPABASE_ORIGIN} crossOrigin="anonymous" />
+        <link rel="dns-prefetch" href={SUPABASE_ORIGIN} />
+        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
+        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
+        <link rel="preconnect" href="https://va.vercel-scripts.com" crossOrigin="anonymous" />
       </head>
```

Where `SUPABASE_ORIGIN` is computed at the top of the file:
```ts
const SUPABASE_ORIGIN = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) return 'https://supabase.co';
  try { return new URL(url).origin; } catch { return 'https://supabase.co'; }
})();
```

### Risk
- **None.** `preconnect` is a hint; browsers ignore unknown origins. Worst case, we waste a TCP slot if the user never reaches the origin (unlikely for our hot paths).
- One caveat: too many `preconnect` hints (more than ~6) can hurt — browsers prioritise the first ones. We have 3, well within budget.

### Test plan
- [ ] `view-source:/en` → confirm `<link rel="preconnect">` tags appear in `<head>`
- [ ] DevTools → Network → reload → confirm Supabase + AdSense DNS lookups happen in the first 100 ms instead of waiting for first request
- [ ] Lighthouse on `/dashboard` (authed, hits Supabase) — expect LCP improvement of 100-250ms

### Estimated effort: 30 minutes

---

## C. Conditionally load Indic fonts by locale

### Finding
`src/app/[locale]/layout.tsx:143` attaches all 9 font CSS variables to `<body>` for every locale:
```tsx
<body className={`${inter.variable} ${cinzel.variable} ${cormorant.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoBengali.variable} ${notoKannada.variable} ${notoGujarati.variable} ...`}>
```

Next.js preloads font assets attached to body. English users preload 6 unused Noto Sans Indic fonts (Devanagari, Tamil, Telugu, Bengali, Kannada, Gujarati) — each is ~30-50 KB woff2. That's `180-300 KB` of font payload that `en` users never render.

### Files to touch
- `src/lib/fonts.ts` (no change — just export a helper)
- `src/app/[locale]/layout.tsx` (replace the long className with a locale-conditional helper)

### Diff shape

```diff
--- a/src/lib/fonts.ts
+++ b/src/lib/fonts.ts
@@ -69,3 +69,30 @@ export const notoGujarati = Noto_Sans_Gujarati({
   variable: '--font-gujarati',
 });
+
+/**
+ * Build the body className font-variable list for a given locale. Only
+ * includes the Indic font(s) actually needed for that locale's script.
+ * Latin fonts (Inter, Cinzel, Cormorant) are always included because the
+ * navbar/footer/CTAs render Latin even on regional locales.
+ */
+export function fontClassesForLocale(locale: string): string {
+  const latin = `${inter.variable} ${cinzel.variable} ${cormorant.variable}`;
+  switch (locale) {
+    case 'hi':
+    case 'mai':
+    case 'mr':
+      return `${latin} ${notoDevanagari.variable}`;
+    case 'ta':
+      return `${latin} ${notoTamil.variable}`;
+    case 'te':
+      return `${latin} ${notoTelugu.variable}`;
+    case 'bn':
+      return `${latin} ${notoBengali.variable}`;
+    case 'kn':
+      return `${latin} ${notoKannada.variable}`;
+    case 'gu':
+      return `${latin} ${notoGujarati.variable}`;
+    case 'en':
+    default:
+      return latin;
+  }
+}
```

```diff
--- a/src/app/[locale]/layout.tsx
+++ b/src/app/[locale]/layout.tsx
@@ -1,5 +1,5 @@
-import { inter, cinzel, cormorant, notoDevanagari, notoTamil, notoTelugu, notoBengali, notoKannada, notoGujarati } from '@/lib/fonts';
+import { fontClassesForLocale } from '@/lib/fonts';
@@ -143,1 +143,1 @@
-      <body className={`${inter.variable} ${cinzel.variable} ${cormorant.variable} ${notoDevanagari.variable} ${notoTamil.variable} ${notoTelugu.variable} ${notoBengali.variable} ${notoKannada.variable} ${notoGujarati.variable} min-h-screen bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
+      <body className={`${fontClassesForLocale(locale)} min-h-screen bg-bg-primary text-text-primary antialiased`} suppressHydrationWarning>
```

### Risk
- **Font-fallback flash** if a page renders mixed scripts. Example: an English page that embeds a Devanagari `Trilingual` value (e.g., "Brihaspati = बृहस्पति"). Without Devanagari font loaded, the browser falls back to system font, which may render Devanagari poorly.
- **Mitigation**: scan `src/components/` for places where mixed-script text appears on Latin-locale pages. Spot-check the navbar, kundali rashi badges, JyotishTerm popovers. If mixed-script is common on `en`, we add Devanagari to the `en` set as a baseline.
- Also check: SSR locale is computed from URL path. Initial render with wrong locale would cause font swap on hydration. Should be impossible with Next.js App Router segment params, but worth a smoke test.

### Test plan
- [ ] Load `/en/panchang` — DevTools → Network → confirm only Inter + Cinzel + Cormorant woff2 requests
- [ ] Load `/hi/panchang` — confirm Inter + Cinzel + Cormorant + Devanagari woff2 only
- [ ] Load `/ta/panchang` — confirm Tamil woff2, no Bengali/Telugu/etc.
- [ ] Spot-check pages with mixed-script content on /en/ (rashi badges, JyotishTerm) — verify Devanagari fallback doesn't look broken
- [ ] Lighthouse on `/en/` — expect Total Bytes reduction of 150-250 KB and possibly LCP improvement

### Estimated effort: 1-1.5 hours

---

## D. Dynamic import `AuthModal` and `OnboardingModal` in `UserMenu` / `SignupBanner`

### Finding
`src/components/auth/UserMenu.tsx:8-9` eagerly imports:
```ts
import AuthModal from './AuthModal';
import OnboardingModal from './OnboardingModal';
```

`src/components/auth/SignupBanner.tsx:6` does the same for `AuthModal`. UserMenu renders on every page (in the navbar). Both modals only mount when the user clicks the auth button. Per audit, this is `~50-100 KB` of JS shipped on every page render that's only used after a user interaction.

### Files to touch
- `src/components/auth/UserMenu.tsx`
- `src/components/auth/SignupBanner.tsx`

### Diff shape

```diff
--- a/src/components/auth/UserMenu.tsx
+++ b/src/components/auth/UserMenu.tsx
@@ -5,8 +5,11 @@
 import { useLocale } from 'next-intl';
 import { useAuthStore } from '@/stores/auth-store';
 import { getSupabase } from '@/lib/supabase/client';
-import AuthModal from './AuthModal';
-import OnboardingModal from './OnboardingModal';
+import dynamic from 'next/dynamic';
+// Modals only mount after a user click; lazy-load to keep the every-page
+// navbar bundle small. ssr: false because both modals are interactivity-only.
+const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });
+const OnboardingModal = dynamic(() => import('./OnboardingModal'), { ssr: false });
```

```diff
--- a/src/components/auth/SignupBanner.tsx
+++ b/src/components/auth/SignupBanner.tsx
@@ -3,7 +3,8 @@
 ...
-import AuthModal from './AuthModal';
+import dynamic from 'next/dynamic';
+const AuthModal = dynamic(() => import('./AuthModal'), { ssr: false });
```

### Risk
- **Imperceptible delay on first modal open.** Next.js will fetch the modal chunk on demand. If the user clicks "Sign In" with a cold cache, they'll see a brief delay (50-200ms) before the modal appears. Acceptable since the modal's first frame is just a backdrop.
- **Type compatibility**: `dynamic(() => import('./AuthModal'), { ssr: false })` returns a `LoadableComponent`. Props inference should hold but worth verifying with `npx tsc`.

### Test plan
- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` — clean
- [ ] Click "Sign In" in navbar (logged-out state) — modal appears < 300ms
- [ ] Submit signup flow (creates account) — OnboardingModal appears
- [ ] Bundle size check: `npx next build` → look at the route's "First Load JS" — should drop ~50-100 KB

### Estimated effort: 30 minutes

---

## E. Tune `/panchang/[city]` `revalidate`

### Finding
`src/app/[locale]/panchang/[city]/page.tsx` sets `revalidate = 3600` (1 hour). Tithi/nakshatra change every ~12 hours; 1-hour revalidate triggers `3-6×` more ISR rebuilds than necessary. The audit suggests `21600` (6 hours) — still well below the 12-hour change rate, halves serverless rebuild cost.

### Files to touch
- `src/app/[locale]/panchang/[city]/page.tsx` (one number change + comment update)

### Diff shape

```diff
--- a/src/app/[locale]/panchang/[city]/page.tsx
+++ b/src/app/[locale]/panchang/[city]/page.tsx
@@ -45,7 +45,9 @@
-export const revalidate = 3600; // 1h — see comment line 38
+// Tithi changes every ~12 hours; 6-hour revalidate stays well under the
+// content-change frequency while halving serverless rebuilds. Was 1h —
+// excessive for the change rate. Audit 2026-05-25 §E.
+export const revalidate = 21600;
```

### Risk
- **Slightly staler content at the edge.** Worst case: a sunset transition happening at hour 5:55 gets reflected at hour 6:00 instead of immediately. Imperceptible to a user; meaningless to Google.
- The "Now" badge and current-tithi indicator on the city panchang page are computed on every render from server time, so they don't depend on revalidate freshness anyway.

### Test plan
- [ ] Deploy + monitor Vercel function invocation count for `/panchang/[city]` over 24h — expect ~50% drop
- [ ] Browser spot-check: `/en/panchang/london` should still render today's tithi

### Estimated effort: 5 minutes

---

## Summary table

| ID | Item | Files touched | Est. impact | Risk | Effort |
|---|---|---|---|---|---|
| A | Remove global AdSense | 1-2 | 150-300ms LCP on ad-free routes; 80 KB savings | Medium (consent ordering) | 1-2 hr |
| B | Resource hints | 1 | 100-250ms LCP on authed routes | Low | 30 min |
| C | Conditional Indic fonts | 2 | 150-250 KB savings on Latin locales | Medium (mixed-script flash) | 1-1.5 hr |
| D | Dynamic AuthModal/Onboarding | 2 | 50-100 KB savings every navbar render | Low | 30 min |
| E | Revalidate tuning | 1 | 50% drop in city-panchang ISR rebuilds | Negligible | 5 min |

**Total estimated work:** 3.5-5 hours for all five.

**Recommended sprint plan:** Ship E + B together as a small PR (10 minutes, zero risk). Ship D as its own PR (30 min, low risk, good signal in bundle size). Ship A and C as separate larger PRs with full Lighthouse before/after evidence (each takes a full focused hour).

---

## Out of scope for this remediation pass

The audit also flagged these performance items at LOW severity — not addressed here, tracked for future:

- `panchang/PanchangClient.tsx:216` `<Image unoptimized />` (single-image thumbnail bypass)
- Service worker precache adding `mai` (Maithili) to the asset cache
- Kundali generation synchronous compute on main thread (would need Server Action or Web Worker — larger refactor)
- The 1.5 MB trilingual constants client-bundle bloat — known R3-DX-5 tech debt, larger architectural change

These deserve their own sprint plans when bandwidth allows.

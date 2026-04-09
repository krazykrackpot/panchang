# Plan 1: Polish — Responsive, Loading, Error, Accessibility

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every page in the app production-quality across all devices, with proper loading skeletons, error boundaries, and accessibility.

**Architecture:** Fix shared components first (charts, tables, navbar), then add route-group loading/error files, then accessibility sweep. Component-level fixes cascade to all pages that use them.

**Tech Stack:** Tailwind CSS responsive utilities, Next.js App Router loading.tsx/error.tsx, ARIA attributes, @media print.

---

### Task 1: Responsive Chart Components

**Files:**
- Modify: `src/components/kundali/ChartNorth.tsx`
- Modify: `src/components/kundali/ChartSouth.tsx`

- [ ] **Step 1:** In ChartNorth.tsx, replace the SVG wrapper CSS class `w-full max-w-[500px]` with `w-full max-w-[320px] sm:max-w-[400px] md:max-w-[500px]`. Remove the `width={size} height={size}` attributes from the `<svg>` element — let CSS control sizing. Keep `viewBox="0 0 500 500"` (SVG scales proportionally).

- [ ] **Step 2:** Same change in ChartSouth.tsx — replace `max-w-[500px]` with responsive breakpoints, remove fixed width/height from `<svg>`, keep viewBox.

- [ ] **Step 3:** Add `role="img"` and `aria-label` to both chart SVGs. ChartNorth: `aria-label="North Indian birth chart showing planets in 12 houses"`. ChartSouth: `aria-label="South Indian birth chart showing planets in 12 houses"`.

- [ ] **Step 4:** Test at 375px, 768px, 1440px — charts should scale fluidly without horizontal overflow.

- [ ] **Step 5:** Commit: `fix: responsive chart SVGs — fluid scaling across all breakpoints`

---

### Task 2: Responsive Tables & Grids

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (BAV table ~line 4174, transit Gantt, house bars)

- [ ] **Step 1:** Find the BAV table container with `min-w-[700px]` (~line 4175). Change to `min-w-[640px]`. Add `text-[10px] sm:text-xs md:text-sm` to the `<table>` for responsive font sizing. The `overflow-x-auto` on the parent already handles scroll.

- [ ] **Step 2:** Find the transit timeline Gantt chart. Wrap it in `<div className="overflow-x-auto">` if not already. Add gradient fade indicators on the edges: `<div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-bg-primary to-transparent" />`.

- [ ] **Step 3:** Find the house strength bar chart. On mobile, the signification labels (`truncate` class) may be too narrow. Change `w-20 sm:w-24` to `w-16 sm:w-24` and ensure `truncate` is on the label span.

- [ ] **Step 4:** Find the Dasha timeline pill buttons (~line 5362). Add `overflow-x-auto scrollbar-thin` to the parent flex container if not already present.

- [ ] **Step 5:** Test the kundali page at 375px — scroll through all sections, verify no horizontal page-level overflow.

- [ ] **Step 6:** Commit: `fix: responsive tables and grids — mobile-friendly overflow handling`

---

### Task 3: Responsive Page Layouts (10-page audit)

**Files:**
- Modify: Various page files as needed

- [ ] **Step 1:** Test **Homepage** (src/app/[locale]/page.tsx) at 375px. Fix any hero text overflow, card grid gaps, CTA button sizing. Common fix: ensure `text-3xl sm:text-4xl md:text-5xl` on headings.

- [ ] **Step 2:** Test **Panchang page** at 375px. The panchang cards grid should stack. Fix any `grid-cols-2` that should be `grid-cols-1 sm:grid-cols-2`.

- [ ] **Step 3:** Test **Matching page** at 375px. The two-person form should stack vertically. If using `grid-cols-2`, change to `grid-cols-1 md:grid-cols-2`.

- [ ] **Step 4:** Test **Calendar page** at 375px. Month grid cells may be too small — ensure minimum touch target of 44px.

- [ ] **Step 5:** Test **Sign Calculator**, **Varshaphal**, **KP System**, **Prashna Ashtamangala**, **Muhurta AI** at 375px. These all follow a form+result pattern — verify form inputs are full-width on mobile and result cards stack.

- [ ] **Step 6:** Test **Learn module pages** — verify sidebar navigation collapses or scrolls on mobile. Text content should have proper `max-w-prose` or equivalent.

- [ ] **Step 7:** Commit all responsive fixes: `fix: responsive layouts — all major pages verified at 375px/768px/1440px`

---

### Task 4: Loading Skeletons (8 route groups)

**Files:**
- Create: `src/app/[locale]/panchang/loading.tsx`
- Create: `src/app/[locale]/kundali/loading.tsx`
- Create: `src/app/[locale]/learn/loading.tsx`
- Create: `src/app/[locale]/matching/loading.tsx`
- Create: `src/app/[locale]/calendar/loading.tsx`
- Create: `src/app/[locale]/sign-calculator/loading.tsx`
- Create: `src/app/[locale]/kp-system/loading.tsx`
- Create: `src/app/[locale]/muhurta-ai/loading.tsx`

Each skeleton follows this pattern (dark theme, pulsing blocks):

- [ ] **Step 1:** Create a shared `Skeleton` utility component at `src/components/ui/Skeleton.tsx`:

```tsx
export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-bg-secondary/60 ${className}`} />;
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`animate-pulse rounded bg-bg-secondary/40 h-3 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
      ))}
    </div>
  );
}
```

- [ ] **Step 2:** Create panchang loading skeleton — pulsing card grid (tithi, nakshatra, yoga row + sunrise/sunset blocks).

- [ ] **Step 3:** Create kundali loading skeleton — form outline placeholder + circular chart placeholder + tab bar.

- [ ] **Step 4:** Create learn loading skeleton — sidebar nav bar + content heading + paragraph lines.

- [ ] **Step 5:** Create matching loading skeleton — two-column form placeholders.

- [ ] **Step 6:** Create calendar, sign-calculator, kp-system, muhurta-ai skeletons — all follow form+result pattern with appropriate card shapes.

- [ ] **Step 7:** Add `aria-label="Loading..."` to the root loading.tsx spinner.

- [ ] **Step 8:** Commit: `feat: add 8 route-specific loading skeletons + shared Skeleton component`

---

### Task 5: Error Boundaries (8 route groups)

**Files:**
- Create: `src/app/[locale]/panchang/error.tsx`
- Create: `src/app/[locale]/kundali/error.tsx`
- Create: `src/app/[locale]/learn/error.tsx`
- Create: `src/app/[locale]/matching/error.tsx`
- Create: `src/app/[locale]/calendar/error.tsx`
- Create: `src/app/[locale]/sign-calculator/error.tsx`
- Create: `src/app/[locale]/kp-system/error.tsx`
- Create: `src/app/[locale]/muhurta-ai/error.tsx`

- [ ] **Step 1:** Create a shared `RouteError` component at `src/components/ui/RouteError.tsx`:

```tsx
'use client';

import { useEffect } from 'react';

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}

export default function RouteError({ error, reset, title }: Props) {
  useEffect(() => { console.error(`[${title || 'Page'}] Error:`, error); }, [error, title]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <span className="text-2xl">⚠</span>
        </div>
        <h2 className="text-xl text-gold-light font-bold mb-2">{title || 'Something went wrong'}</h2>
        <p className="text-text-secondary text-sm mb-6">An error occurred while loading this page. Please try again.</p>
        <div className="flex items-center justify-center gap-3">
          <button onClick={reset} className="px-5 py-2.5 rounded-lg bg-gold-primary/20 text-gold-light border border-gold-primary/30 text-sm font-medium hover:bg-gold-primary/30 transition-colors">
            Try Again
          </button>
          <a href="/" className="px-5 py-2.5 rounded-lg border border-gold-primary/10 text-text-secondary text-sm hover:text-gold-light transition-colors">
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2:** Create all 8 error.tsx files. Each is minimal — imports RouteError with a contextual title:

```tsx
'use client';
import RouteError from '@/components/ui/RouteError';
export default function Error(props: { error: Error & { digest?: string }; reset: () => void }) {
  return <RouteError {...props} title="Kundali Error" />;
}
```

Titles: Panchang Error, Kundali Error, Learning Error, Matching Error, Calendar Error, Sign Calculator Error, KP System Error, Muhurta Error.

- [ ] **Step 3:** Commit: `feat: add 8 route-specific error boundaries + shared RouteError component`

---

### Task 6: Accessibility & Print Styles

**Files:**
- Modify: `src/app/[locale]/layout.tsx` (scroll-to-top)
- Modify: `src/components/kundali/ChartNorth.tsx` (aria — done in Task 1)
- Modify: `src/components/kundali/ChartSouth.tsx` (aria — done in Task 1)
- Create or modify: `src/app/globals.css` (print styles)

- [ ] **Step 1:** Add scroll-to-top on navigation. In `src/app/[locale]/layout.tsx`, add a `ScrollToTop` client component:

```tsx
'use client';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
export function ScrollToTop() {
  const pathname = usePathname();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}
```

Add `<ScrollToTop />` inside the layout before `{children}`.

- [ ] **Step 2:** Add print styles to `src/app/globals.css`:

```css
@media print {
  nav, footer, .no-print, [data-no-print] { display: none !important; }
  body { background: white !important; color: black !important; }
  main { padding-top: 0 !important; }
  * { box-shadow: none !important; }
  @page { margin: 15mm; size: A4; }
}
```

- [ ] **Step 3:** Add `aria-label` to all icon-only buttons in Navbar. Search for `<button` with only a Lucide icon child — add descriptive labels like `aria-label="Open search"`, `aria-label="Toggle menu"`, etc.

- [ ] **Step 4:** Verify focus-visible rings. Tailwind's default `focus-visible:outline` should work. If any custom buttons override it, add `focus-visible:ring-2 focus-visible:ring-gold-primary/50`.

- [ ] **Step 5:** Commit: `feat: scroll-to-top, print styles, aria labels, focus indicators`

---

### Task 7: Build & Verify

- [ ] **Step 1:** Run `npx next build` — must pass with 0 errors.
- [ ] **Step 2:** Run `npx vitest run` — all tests must pass.
- [ ] **Step 3:** Manual spot-check: open the app at 375px width (Chrome DevTools → iPhone SE), navigate through Home → Panchang → Kundali (generate a chart) → Matching → Learn module. Verify no horizontal overflow, loading skeletons appear, error boundary works (test by temporarily throwing in a component).
- [ ] **Step 4:** Push all changes.

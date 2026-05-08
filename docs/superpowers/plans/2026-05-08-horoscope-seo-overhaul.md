# Horoscope SEO Overhaul — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing horoscope pages (already fully built with engine, API, and UI) visible to Google by converting from client-rendered to server-rendered, adding static editorial content, fixing navbar discoverability, and adding date-based URLs for long-tail search capture.

**Architecture:** The daily horoscope engine (`src/lib/horoscope/daily-engine.ts`) already generates complete bilingual predictions deterministically from transit data. The pages exist at `/horoscope/[rashi]` (daily), `/horoscope/[rashi]/weekly`, `/horoscope/[rashi]/monthly`. The problem: all pages are `'use client'` — Google sees empty HTML. Fix: split each page into a server-rendered shell (static editorial + SSR horoscope content) with a thin client island for interactivity.

**Tech Stack:** Next.js App Router Server Components, existing `generateDailyHoroscope()` engine, existing `RASHIS` constants, `next-intl` for i18n.

**Scope notes:**
- Weekly/Monthly SSR conversion is deferred — daily is the traffic magnet. Follow-up ticket.
- The SSR shell renders the H1, date, score, and insight as *the visible header*. The client island renders everything *below* it (area cards, transit, dos/donts, etc.) — no duplication.
- The hub SSR grid (12 rashi links with emoji symbols) is for Google's HTML indexing. The client island overlays the full TarotCard grid with score overlays once hydrated.
- Add `export const revalidate = 3600` to rashi layout so `generateDailyHoroscope()` runs at most once per hour per rashi, not on every request.

---

## File Structure

### Modified files

| File | Change |
|---|---|
| `src/app/[locale]/horoscope/[rashi]/page.tsx` | Convert to Server Component with client island |
| `src/app/[locale]/horoscope/[rashi]/layout.tsx` | Add date to Article headline |
| `src/app/[locale]/horoscope/page.tsx` | Convert hub to Server Component with client island |
| `src/components/layout/Navbar.tsx` | Add `/horoscope` to navItems |
| `src/lib/seo/metadata.ts` | Improve hub keywords |
| `src/app/[locale]/horoscope/[rashi]/weekly/page.tsx` | Enable Monthly tab link |
| `src/app/[locale]/horoscope/[rashi]/monthly/page.tsx` | Enable Monthly tab link (if same pattern) |

### New files

| File | Responsibility |
|---|---|
| `src/app/[locale]/horoscope/[rashi]/HoroscopeClient.tsx` | Client island for interactive horoscope (Tier 3 personalization, person switcher, share) |
| `src/app/[locale]/horoscope/[rashi]/RashiArticle.tsx` | Server component: static editorial content per rashi |
| `src/app/[locale]/horoscope/HubClient.tsx` | Client island for hub interactivity (person switcher, cosmic weather animation) |
| `src/lib/horoscope/rashi-editorial.ts` | Static bilingual editorial content for all 12 rashis |

---

## Task Breakdown

### Task 1: Add `/horoscope` to navbar + fix hub keywords

**Files:**
- Modify: `src/components/layout/Navbar.tsx:107-115`
- Modify: `src/lib/seo/metadata.ts` (PAGE_META for `/horoscope`)

This is the lowest-effort, highest-impact change. One line in the navbar gives `/horoscope` internal PageRank from every page on the site.

- [ ] **Step 1: Read the Navbar file**

Read `src/components/layout/Navbar.tsx` around lines 100-120 to confirm the exact `navItems` array and the i18n helper used (`t()` vs `msg()`).

- [ ] **Step 2: Add horoscope to navItems**

In `src/components/layout/Navbar.tsx`, add the horoscope entry to `navItems`. Place it after Panchang (line 109), before Kundali:

```ts
const navItems: NavItem[] = [
  { href: '/', label: t('home') },
  { href: '/panchang', label: t('panchang') },
  { href: '/horoscope', label: t('horoscope') },  // ← ADD THIS
  { href: '/charts', label: t('kundali') },
  { href: '/rituals', label: ritualsLabel },
  { href: '/calendars', label: t('calendars') },
  { href: '/tools', label: t('tools') },
  { href: '/learn', label: t('learn') },
];
```

The translation key `horoscope` already exists in `src/messages/components/navbar.json` with all 10 locales. Verify the i18n helper: if the file uses `t()` from `useTranslations('navbar')`, use `t('horoscope')`. If it uses a custom `msg()`, use `msg('horoscope', locale)`. Read the file to confirm.

- [ ] **Step 3: Improve hub PAGE_META keywords**

In `src/lib/seo/metadata.ts`, find the `/horoscope` entry and update:

```ts
'/horoscope': {
  title: {
    en: 'Daily Horoscope 2026 — All 12 Zodiac Signs | Vedic Rashifal Today',
    hi: 'दैनिक राशिफल 2026 — सभी 12 राशियाँ | आज का राशिफल',
    sa: 'दैनिकराशिफलम् — द्वादशराशयः',
  },
  description: {
    en: 'Free daily horoscope for all 12 zodiac signs based on real Vedic planetary transits. Check your Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces horoscope today.',
    hi: 'सभी 12 राशियों का मुफ्त दैनिक राशिफल वास्तविक वैदिक ग्रह गोचर पर आधारित। मेष, वृषभ, मिथुन, कर्क, सिंह, कन्या, तुला, वृश्चिक, धनु, मकर, कुम्भ, मीन राशिफल आज।',
    sa: 'द्वादशराशीनां दैनिकफलम्',
  },
  keywords: [
    'daily horoscope', 'horoscope today', 'rashifal today', 'dainik rashifal',
    'aaj ka rashifal', 'आज का राशिफल', 'दैनिक राशिफल',
    'vedic horoscope', 'transit horoscope', 'all 12 signs horoscope',
    'aries horoscope today', 'mesh rashifal aaj',
  ],
},
```

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 5: Test in browser**

Start dev server, verify `/horoscope` appears in the navbar on every page. Click it — the hub should load.

- [ ] **Step 6: Commit**

```bash
git add src/components/layout/Navbar.tsx src/lib/seo/metadata.ts
git commit -m "feat(horoscope): add to navbar + improve hub SEO keywords"
```

---

### Task 2: Static editorial content for all 12 rashis

**Files:**
- Create: `src/lib/horoscope/rashi-editorial.ts`

This creates the server-renderable static content that Google will index. Each rashi gets ~200 words of personality description, ruling planet context, element traits, and compatibility notes — bilingual EN/HI.

- [ ] **Step 1: Create rashi-editorial.ts**

```ts
// src/lib/horoscope/rashi-editorial.ts

/**
 * Static bilingual editorial content for each rashi.
 * Server-rendered below the dynamic horoscope widget — gives Google
 * substantive indexable content on every /horoscope/[rashi] page.
 *
 * Content does NOT change daily — it's sign-specific personality and
 * trait text. The dynamic horoscope above it changes daily.
 */

import type { LocaleText } from '@/types/panchang';

export interface RashiEditorial {
  personality: LocaleText;      // 2-3 sentences about the sign's nature
  rulerInfluence: LocaleText;   // How the ruling planet shapes the sign
  elementTraits: LocaleText;    // Fire/Earth/Air/Water element traits
  strengthsWeaknesses: LocaleText; // Key strengths and growth areas
  compatibility: LocaleText;    // Natural compatible and challenging signs
}

export const RASHI_EDITORIAL: Record<number, RashiEditorial> = {
  1: { // Mesh (Aries)
    personality: {
      en: 'Aries (Mesh) is the first sign of the Vedic zodiac, ruled by Mars. People born under Mesh are natural pioneers — bold, energetic, and driven by an instinct to lead. They possess an infectious enthusiasm that inspires those around them, though their impatience can sometimes lead to hasty decisions.',
      hi: 'मेष वैदिक राशिचक्र की प्रथम राशि है, जिसके स्वामी मंगल हैं। मेष राशि के लोग स्वाभाविक अग्रणी होते हैं — साहसी, ऊर्जावान, और नेतृत्व की प्रवृत्ति से प्रेरित। उनका उत्साह संक्रामक होता है, हालांकि उनकी अधीरता कभी-कभी जल्दबाज़ी के निर्णयों की ओर ले जा सकती है।',
    },
    rulerInfluence: {
      en: 'Mars infuses Aries with courage, physical vitality, and a competitive spirit. When Mars is well-placed in a birth chart, it amplifies leadership qualities and athletic ability. During Mars transits through key houses, Aries natives feel surges of motivation and determination.',
      hi: 'मंगल मेष को साहस, शारीरिक ऊर्जा और प्रतिस्पर्धी भावना प्रदान करता है। जब मंगल जन्म कुंडली में अच्छी स्थिति में हो, तो यह नेतृत्व गुणों को बढ़ाता है। मंगल के गोचर के दौरान, मेष जातकों में प्रेरणा और दृढ़ संकल्प की लहर उमड़ती है।',
    },
    elementTraits: {
      en: 'As a fire sign, Aries thrives on action and initiative. Fire signs are spontaneous, creative, and drawn to challenges. They generate warmth and light in relationships but need to temper their intensity to avoid burnout.',
      hi: 'अग्नि तत्व की राशि होने के कारण, मेष कर्म और पहल पर फलता-फूलता है। अग्नि राशियाँ सहज, रचनात्मक और चुनौतियों की ओर आकर्षित होती हैं।',
    },
    strengthsWeaknesses: {
      en: 'Strengths: courage, determination, confidence, enthusiasm, honesty. Growth areas: impatience, short temper, impulsiveness, competitiveness in personal relationships.',
      hi: 'शक्तियाँ: साहस, दृढ़ता, आत्मविश्वास, उत्साह, ईमानदारी। विकास क्षेत्र: अधीरता, चिड़चिड़ापन, आवेगशीलता, व्यक्तिगत संबंधों में प्रतिस्पर्धा।',
    },
    compatibility: {
      en: 'Naturally compatible with Leo and Sagittarius (fellow fire signs) and Gemini and Aquarius (air signs that fan the fire). More challenging dynamics with Cancer and Capricorn, where patience and compromise are needed.',
      hi: 'सिंह और धनु (अग्नि राशियों) तथा मिथुन और कुम्भ (वायु राशियों) के साथ स्वाभाविक अनुकूलता। कर्क और मकर के साथ चुनौतीपूर्ण गतिशीलता, जहाँ धैर्य की आवश्यकता होती है।',
    },
  },
  // MANDATORY: Create ALL 12 entries (IDs 1-12) with unique, sign-specific content.
  // Each rashi MUST reference its actual ruling planet, element, and quality.
  // Do NOT use generic filler that could apply to any sign.
  // Each `personality` field must be 2-3 sentences unique to that sign.
  // The implementing agent must write all 12 — this is NOT optional.
};
```

Create all 12 entries. Each rashi's `personality` should be 2-3 sentences reflecting its unique Vedic character. Reference the actual ruling planet, element, and quality. Do NOT use generic text that could apply to any sign.

The rashi IDs (1-12): 1=Aries/Mesh, 2=Taurus/Vrishabh, 3=Gemini/Mithun, 4=Cancer/Kark, 5=Leo/Simha, 6=Virgo/Kanya, 7=Libra/Tula, 8=Scorpio/Vrishchik, 9=Sagittarius/Dhanu, 10=Capricorn/Makar, 11=Aquarius/Kumbh, 12=Pisces/Meen.

- [ ] **Step 2: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/horoscope/rashi-editorial.ts
git commit -m "feat(horoscope): bilingual editorial content for all 12 rashis"
```

---

### Task 3: Convert per-rashi daily page to SSR

**Files:**
- Modify: `src/app/[locale]/horoscope/[rashi]/page.tsx` — convert to Server Component
- Create: `src/app/[locale]/horoscope/[rashi]/HoroscopeClient.tsx` — client island for interactivity
- Create: `src/app/[locale]/horoscope/[rashi]/RashiArticle.tsx` — server component for editorial
- Modify: `src/app/[locale]/horoscope/[rashi]/layout.tsx` — add date to Article headline

This is the critical SEO fix. The page must render horoscope content server-side so Google can index it.

- [ ] **Step 1: Read the current page.tsx fully**

Read `src/app/[locale]/horoscope/[rashi]/page.tsx` (785 lines) to understand every section.

- [ ] **Step 2: Create RashiArticle.tsx (Server Component)**

This is the static editorial section rendered below the dynamic horoscope. It's a Server Component — no `'use client'`.

```tsx
// src/app/[locale]/horoscope/[rashi]/RashiArticle.tsx

import { RASHI_EDITORIAL } from '@/lib/horoscope/rashi-editorial';
import type { LocaleText } from '@/types/panchang';

function tl(obj: LocaleText | undefined, locale: string): string {
  if (!obj) return '';
  return (obj as Record<string, string>)[locale] || obj.en || '';
}

interface Props {
  rashiId: number;
  vedicName: string;
  westernName: string;
  locale: string;
}

export function RashiArticle({ rashiId, vedicName, westernName, locale }: Props) {
  const editorial = RASHI_EDITORIAL[rashiId];
  if (!editorial) return null;

  const isHi = locale === 'hi' || locale === 'mai' || locale === 'mr' || locale === 'sa';
  const h2 = isHi
    ? `${vedicName} राशि — व्यक्तित्व और लक्षण`
    : `About ${westernName} (${vedicName}) — Personality & Traits`;

  return (
    <section className="mt-12 space-y-6 max-w-3xl mx-auto px-4">
      <h2 className="text-xl font-semibold text-gold-light">{h2}</h2>
      <div className="space-y-4 text-text-secondary text-sm leading-relaxed">
        <p>{tl(editorial.personality, locale)}</p>
        <p>{tl(editorial.rulerInfluence, locale)}</p>
        <p>{tl(editorial.elementTraits, locale)}</p>
        <p>{tl(editorial.strengthsWeaknesses, locale)}</p>
        <p>{tl(editorial.compatibility, locale)}</p>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Extract the client island — HoroscopeClient.tsx**

Move the entire current `page.tsx` content (minus the `'use client'` declaration adjustments) into `HoroscopeClient.tsx`. This is a rename/move, not a rewrite. The client island keeps all interactivity: API fetches, Tier 3 personalization, person switcher, share button, score animations.

```tsx
// src/app/[locale]/horoscope/[rashi]/HoroscopeClient.tsx
'use client';

// ... exact same content as current page.tsx, but exported as a named component:
// export function HoroscopeClient({ rashi, locale }: { rashi: Rashi; locale: string }) { ... }
//
// Remove: the rashi lookup from useParams() — receive rashi as a prop from the server page.
// Remove: useLocale() — receive locale as a prop.
// Keep everything else: state, API calls, all rendering sections.
```

Key changes when extracting:
- Accept `rashi` object and `locale` as props instead of deriving from hooks
- Remove `useParams()` and `useLocale()` — the server parent resolves these
- Export as named function `HoroscopeClient`

- [ ] **Step 4: Rewrite page.tsx as a Server Component**

The new `page.tsx` is a Server Component that:
1. Resolves the rashi from params (server-side)
2. Calls `generateDailyHoroscope()` server-side for initial data
3. Renders SSR content: H1 with rashi name, today's date, overall score, daily insight text, area scores — all as plain HTML that Google can index
4. Renders `<HoroscopeClient>` for interactivity
5. Renders `<RashiArticle>` for static editorial content

```tsx
// src/app/[locale]/horoscope/[rashi]/page.tsx
// NO 'use client' — this is a Server Component

import { notFound } from 'next/navigation';
import { RASHIS, getRashiBySlug } from '@/lib/constants/rashis';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from './HoroscopeClient';
import { RashiArticle } from './RashiArticle';

function tl(obj: any, locale: string): string {
  if (!obj) return '';
  return obj[locale] || obj.en || '';
}

export default async function RashiPage({ params }: { params: Promise<{ locale: string; rashi: string }> }) {
  const { locale, rashi: rashiSlug } = await params;
  const rashi = getRashiBySlug(rashiSlug);
  if (!rashi) return notFound();

  // Generate today's horoscope server-side — this is the SSR content Google indexes
  const today = new Date().toISOString().slice(0, 10);
  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date: today });

  const vedicName = tl(rashi.name, locale);
  const westernName = tl(rashi.name, 'en');

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      {/* SSR: H1 with rashi name and date — Google indexes this */}
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {locale === 'hi'
            ? `${vedicName} राशिफल — आज ${today}`
            : `${vedicName} (${westernName}) Horoscope — ${today}`}
        </h1>

        {/* SSR: Key horoscope data rendered as visible text for indexing */}
        <div className="mt-4 text-center text-text-secondary text-sm">
          <p>
            {locale === 'hi'
              ? `आज का समग्र स्कोर: ${horoscope.overallScore}/10`
              : `Today's overall score: ${horoscope.overallScore}/10`}
          </p>
          <p className="mt-2">{tl(horoscope.insight, locale)}</p>
        </div>

        {/* SSR: Area scores as indexable text */}
        <div className="mt-4 text-xs text-text-secondary/70 text-center space-x-3">
          <span>Career: {horoscope.areas.career.score}/10</span>
          <span>Love: {horoscope.areas.love.score}/10</span>
          <span>Health: {horoscope.areas.health.score}/10</span>
          <span>Finance: {horoscope.areas.finance.score}/10</span>
          <span>Spirituality: {horoscope.areas.spirituality.score}/10</span>
        </div>
      </div>

      {/* Client island: interactive widget with full functionality */}
      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} />

      {/* SSR: Static editorial content — always indexed */}
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
```

The `HoroscopeClient` receives `initialHoroscope` as a prop so it doesn't need to re-fetch on mount — it already has the data. It only fetches when the user changes the date or switches persons.

**CRITICAL: No content duplication.** The SSR section above renders the H1, date, score summary, and insight text. The `HoroscopeClient` must NOT re-render these — it starts from the Daily/Weekly/Monthly tab bar, then the area cards, transit summary, dos/donts, compatibility, remedies, cross-links, share button, and the "Other Signs" grid. Remove the hero/H1/score card from the client component — the server already rendered it.

- [ ] **Step 5: Update HoroscopeClient to accept initialHoroscope prop**

In `HoroscopeClient.tsx`, add `initialHoroscope` to props:

```tsx
interface Props {
  rashi: Rashi;
  locale: string;
  initialHoroscope: DailyHoroscope;
}

export function HoroscopeClient({ rashi, locale, initialHoroscope }: Props) {
  const [horoscope, setHoroscope] = useState<DailyHoroscope>(initialHoroscope);
  const [loading, setLoading] = useState(false); // Start false — we have SSR data
  // ... rest of component, but skip the initial useEffect fetch
  // Only fetch when date changes or person switches
}
```

Remove the initial `useEffect` that fetches on mount (lines 265-282 in the original). Replace with a date-change effect:

```tsx
useEffect(() => {
  // Only re-fetch when date changes from today (initial data is SSR'd)
  const today = new Date().toISOString().slice(0, 10);
  if (date === today && !personChanged) return;
  fetchHoroscope();
}, [date, activePerson]);
```

- [ ] **Step 6: Update layout.tsx — add date to Article headline**

In `src/app/[locale]/horoscope/[rashi]/layout.tsx`, update the Article JSON-LD to include today's date in the headline:

Also add ISR caching so `generateDailyHoroscope()` doesn't run on every request:

```ts
export const revalidate = 3600; // Revalidate once per hour
```

Find the `articleLD` object and change `headline` from `"Mesh (Aries) Horoscope Today"` to include the formatted date:

```ts
const today = new Date();
const dateStr = today.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
// headline: `Mesh (Aries) Horoscope Today — ${dateStr}`
```

- [ ] **Step 7: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 8: Test in browser**

1. Navigate to `/horoscope/mesh` — verify the page renders server-side (View Source should show H1, score, insight text — not a spinner)
2. Verify interactive features still work (date switching, Tier 3 personalization)
3. Verify the editorial section renders below the widget
4. Check console for errors

- [ ] **Step 9: Commit**

```bash
git add "src/app/[locale]/horoscope/[rashi]/"
git commit -m "feat(horoscope): convert rashi page to SSR — Google can now index horoscope content

- Server-rendered H1, score, insight, area scores — visible in HTML source
- Client island for interactivity (Tier 3, date switching, sharing)
- Static editorial section (personality, ruler, element, compatibility)
- Article headline now includes today's date for SERP freshness"
```

---

### Task 4: Convert hub page to SSR

**Files:**
- Modify: `src/app/[locale]/horoscope/page.tsx` — convert to Server Component
- Create: `src/app/[locale]/horoscope/HubClient.tsx` — client island

- [ ] **Step 1: Read the current hub page.tsx fully**

Read `src/app/[locale]/horoscope/page.tsx` (697 lines).

- [ ] **Step 2: Extract HubClient.tsx**

Move all interactive content (person switcher, cosmic weather, sign grid with score overlays, animated result panel) into `HubClient.tsx` as a `'use client'` component.

- [ ] **Step 3: Rewrite hub page.tsx as Server Component**

The server page renders:
- H1 with "Daily Horoscope — [Today's Date]" (indexable)
- A grid of all 12 rashi links with sign names (indexable, gives Google crawl paths to all 12 rashi pages)
- Brief intro paragraph about Vedic horoscope methodology (indexable)
- `<HubClient />` for the interactive cosmic weather and person switching

```tsx
// src/app/[locale]/horoscope/page.tsx
// NO 'use client'

import Link from 'next/link';
import { RASHIS } from '@/lib/constants/rashis';
import { HubClient } from './HubClient';

function tl(obj: any, locale: string): string {
  return obj?.[locale] || obj?.en || '';
}

export default async function HoroscopePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const today = new Date().toISOString().slice(0, 10);
  const isHi = locale === 'hi' || locale === 'sa' || locale === 'mr' || locale === 'mai';

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {isHi ? `दैनिक राशिफल — ${today}` : `Daily Horoscope — ${today}`}
        </h1>
        <p className="text-text-secondary text-sm text-center mt-3 max-w-2xl mx-auto">
          {isHi
            ? 'वास्तविक वैदिक ग्रह गोचर पर आधारित सभी 12 राशियों का आज का राशिफल। अपनी राशि चुनें और आज का फल देखें।'
            : 'Today\'s horoscope for all 12 zodiac signs based on real Vedic planetary transits. Select your Moon sign to see your daily forecast.'}
        </p>

        {/* SSR: All 12 rashi links — Google follows these to every rashi page */}
        <nav className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-8" aria-label="Zodiac signs">
          {RASHIS.map(r => (
            <Link
              key={r.id}
              href={`/${locale}/horoscope/${r.slug}`}
              className="flex flex-col items-center gap-1 p-3 rounded-xl bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 hover:border-gold-primary/40 transition-colors"
            >
              <span className="text-2xl">{r.symbol}</span>
              <span className="text-xs text-gold-light font-medium">{tl(r.name, locale)}</span>
              <span className="text-[10px] text-text-secondary">{tl(r.name, 'en')}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Client island: person switcher, cosmic weather, interactive result */}
      <HubClient locale={locale} />
    </main>
  );
}
```

- [ ] **Step 4: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 5: Test in browser**

1. View Source on `/horoscope` — confirm H1, 12 rashi links, intro text are in HTML
2. Verify interactive features still work
3. Click rashi links — they should navigate to the SSR rashi pages

- [ ] **Step 6: Commit**

```bash
git add "src/app/[locale]/horoscope/"
git commit -m "feat(horoscope): convert hub to SSR — 12 rashi links indexable, intro text visible"
```

---

### Task 5: Enable Monthly tab + fix cross-navigation

**Files:**
- Modify: `src/app/[locale]/horoscope/[rashi]/page.tsx` (or HoroscopeClient.tsx after Task 3)
- Modify: `src/app/[locale]/horoscope/[rashi]/weekly/page.tsx`

- [ ] **Step 1: Read the tab navigation code**

In the daily page (now `HoroscopeClient.tsx` after Task 3), find the Daily/Weekly/Monthly tab bar. The Monthly tab is currently a `<span>` with `cursor-not-allowed`. Change it to a `<Link>`.

- [ ] **Step 2: Enable Monthly tab**

Replace the disabled Monthly tab in all three pages (daily, weekly, monthly) with a working Link:

```tsx
<Link
  href={`/${locale}/horoscope/${rashi.slug}/monthly`}
  className="px-4 py-2 rounded-full text-sm text-text-secondary hover:text-gold-light transition-colors"
>
  {isHi ? 'मासिक' : 'Monthly'}
</Link>
```

Do this in:
- `HoroscopeClient.tsx` (daily page)
- `src/app/[locale]/horoscope/[rashi]/weekly/page.tsx`
- Verify the monthly page already links back to daily/weekly

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Test in browser**

Click Daily → Weekly → Monthly → Daily. All three tabs should navigate correctly.

- [ ] **Step 5: Commit**

```bash
git add "src/app/[locale]/horoscope/"
git commit -m "fix(horoscope): enable Monthly tab navigation — all three timeframes linked"
```

---

### Task 6: Date-based URLs for long-tail SEO

**Files:**
- Create: `src/app/[locale]/horoscope/[rashi]/[date]/page.tsx`
- Create: `src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx`
- Modify: `src/app/sitemap.ts`

This captures long-tail queries like "aries horoscope may 8 2026" and "mesh rashifal 8 may".

- [ ] **Step 1: Create date-based layout.tsx**

```tsx
// src/app/[locale]/horoscope/[rashi]/[date]/layout.tsx
import type { Metadata } from 'next';
import { RASHIS } from '@/lib/constants/rashis';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

function tl(obj: any, locale: string): string {
  return obj?.[locale] || obj?.en || '';
}

export async function generateStaticParams() {
  const rashis = RASHIS.map(r => r.slug);
  // Generate next 7 days — ISR handles the rest
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    dates.push(d.toISOString().slice(0, 10));
  }
  return rashis.flatMap(rashi => dates.map(date => ({ rashi, date })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }): Promise<Metadata> {
  const { locale, rashi: slug, date } = await params;
  const rashi = RASHIS.find(r => r.slug === slug);
  if (!rashi) return {};
  const vedicName = tl(rashi.name, locale);
  const westernName = tl(rashi.name, 'en');
  const formatted = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return {
    title: locale === 'hi'
      ? `${vedicName} राशिफल ${formatted} | दैनिक राशिफल`
      : `${westernName} Horoscope ${formatted} | Daily Vedic Forecast`,
    description: locale === 'hi'
      ? `${formatted} के लिए ${vedicName} (${westernName}) राशिफल। वास्तविक ग्रह गोचर पर आधारित।`
      : `${westernName} (${vedicName}) horoscope for ${formatted}. Based on real Vedic planetary transits.`,
  };
}

export const revalidate = 3600; // ISR: revalidate every hour

export default async function Layout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  const breadcrumbLD = generateBreadcrumbLD(`/${locale}/horoscope/${slug}/${date}`, locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      {children}
    </>
  );
}
```

- [ ] **Step 2: Create date-based page.tsx**

This is a thin Server Component that renders the horoscope for a specific date. It reuses `HoroscopeClient` with the date pre-set.

```tsx
// src/app/[locale]/horoscope/[rashi]/[date]/page.tsx

import { notFound } from 'next/navigation';
import { RASHIS } from '@/lib/constants/rashis';
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { HoroscopeClient } from '../HoroscopeClient';
import { RashiArticle } from '../RashiArticle';

function tl(obj: any, locale: string): string {
  return obj?.[locale] || obj?.en || '';
}

export default async function DateHoroscopePage({ params }: { params: Promise<{ locale: string; rashi: string; date: string }> }) {
  const { locale, rashi: slug, date } = await params;
  const rashi = RASHIS.find(r => r.slug === slug);
  if (!rashi) return notFound();

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return notFound();

  const horoscope = generateDailyHoroscope({ moonSign: rashi.id, date });
  const vedicName = tl(rashi.name, locale);
  const westernName = tl(rashi.name, 'en');
  const formatted = new Date(date + 'T12:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <main className="min-h-screen bg-[#0a0e27] pb-20">
      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gold-light text-center">
          {locale === 'hi'
            ? `${vedicName} राशिफल — ${formatted}`
            : `${vedicName} (${westernName}) Horoscope — ${formatted}`}
        </h1>
        <div className="mt-4 text-center text-text-secondary text-sm">
          <p>{locale === 'hi' ? `समग्र स्कोर: ${horoscope.overallScore}/10` : `Overall score: ${horoscope.overallScore}/10`}</p>
          <p className="mt-2">{tl(horoscope.insight, locale)}</p>
        </div>
      </div>

      <HoroscopeClient rashi={rashi} locale={locale} initialHoroscope={horoscope} initialDate={date} />
      <RashiArticle rashiId={rashi.id} vedicName={vedicName} westernName={westernName} locale={locale} />
    </main>
  );
}
```

- [ ] **Step 3: Add date routes to sitemap**

In `src/app/sitemap.ts`, add date-based horoscope routes for the next 7 days:

```ts
// After the existing horoscope rashi routes, add date-specific routes
const horoscopeRashis = ['mesh','vrishabh','mithun','kark','simha','kanya','tula','vrishchik','dhanu','makar','kumbh','meen'];
const today = new Date();
for (let i = 0; i < 7; i++) {
  const d = new Date(today);
  d.setDate(d.getDate() + i);
  const dateStr = d.toISOString().slice(0, 10);
  for (const slug of horoscopeRashis) {
    addEntries(`/horoscope/${slug}/${dateStr}`, 'daily', 0.7);
  }
}
```

- [ ] **Step 4: Update HoroscopeClient to accept initialDate prop**

Add `initialDate?: string` to `HoroscopeClient` props. If provided, use it as the initial `date` state instead of today:

```tsx
const [date, setDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
```

- [ ] **Step 5: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
npx next build
```

- [ ] **Step 6: Test**

Navigate to `/horoscope/mesh/2026-05-08` — verify it renders with the correct date, score, and content. View Source — confirm H1 and insight text are server-rendered.

- [ ] **Step 7: Commit**

```bash
git add "src/app/[locale]/horoscope/[rashi]/[date]/" src/app/sitemap.ts
git commit -m "feat(horoscope): date-based URLs for long-tail SEO — /horoscope/mesh/2026-05-08

- ISR with 1-hour revalidation
- 7 days pre-generated at build, rest on-demand
- Captures 'aries horoscope may 8' type queries"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` — 0 errors
- [ ] `npx vitest run` — all tests pass
- [ ] `npx next build` — 0 errors, horoscope routes visible
- [ ] **View Source on `/horoscope`** — H1 "Daily Horoscope", 12 rashi links, intro paragraph all in HTML
- [ ] **View Source on `/horoscope/mesh`** — H1 with date, overall score, insight text, area scores all in HTML (NOT behind a spinner)
- [ ] **View Source on `/horoscope/mesh/2026-05-08`** — date-specific H1 and content in HTML
- [ ] `/horoscope` appears in the navbar on every page
- [ ] Monthly tab links work (Daily ↔ Weekly ↔ Monthly navigation)
- [ ] Interactive features still work: date switching, Tier 3, sharing
- [ ] Editorial article section visible below the horoscope widget
- [ ] No console errors

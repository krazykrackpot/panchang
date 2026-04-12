# SEO Content Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add high-traffic programmatic content pages (rahu kaal, choghadiya, rashi detail, yearly dates, compatibility heatmap), FAQ schema expansion, and multi-city daily articles to drive organic search traffic.

**Architecture:** Three tiers executed sequentially. Tier 1 adds standalone daily-query pages (rahu kaal, choghadiya) and 12 evergreen rashi detail pages. Tier 2 adds yearly date listings and FAQ schema to ~11 existing pages. Tier 3 expands daily articles to 10 cities, adds per-rashi horoscope sections, and builds a 12x12 compatibility heatmap with 78 pair detail pages.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, Framer Motion, D3/SVG for heatmap, existing panchang-calc/daily-engine/ashta-kuta engines, next-intl for i18n.

---

## File Structure

### New Files
| File | Responsibility |
|------|---------------|
| `src/lib/constants/rashi-details.ts` | 12 rashi personality/traits content (en+hi), `RashiDetail` interface |
| `src/lib/constants/rashi-slugs.ts` | Slug↔ID mapping, locale-inferred default city helper |
| `src/lib/constants/rashi-compatibility.ts` | 78 pair content generated from astrological rules |
| `src/lib/seo/faq-data.ts` | Multilingual FAQ data for ~11 routes + `generateFAQLD()` helper |
| `src/app/[locale]/rahu-kaal/page.tsx` | Rahu Kaal Today page |
| `src/app/[locale]/rahu-kaal/layout.tsx` | Metadata + FAQ JSON-LD |
| `src/app/[locale]/choghadiya/page.tsx` | Choghadiya Today page |
| `src/app/[locale]/choghadiya/layout.tsx` | Metadata + FAQ JSON-LD |
| `src/app/[locale]/panchang/rashi/[id]/page.tsx` | Individual rashi detail page |
| `src/app/[locale]/panchang/rashi/[id]/layout.tsx` | Metadata + FAQ JSON-LD |
| `src/app/[locale]/dates/[category]/page.tsx` | Yearly date listing page |
| `src/app/[locale]/dates/[category]/layout.tsx` | Metadata |
| `src/app/[locale]/daily/[date]/[city]/page.tsx` | City-specific daily article |
| `src/app/[locale]/daily/[date]/[city]/layout.tsx` | Metadata |
| `src/app/[locale]/matching/compatibility/page.tsx` | Heatmap index page |
| `src/app/[locale]/matching/compatibility/layout.tsx` | Metadata |
| `src/app/[locale]/matching/[pair]/page.tsx` | Pair detail page |
| `src/app/[locale]/matching/[pair]/layout.tsx` | Metadata + redirect logic |
| `src/lib/__tests__/rashi-details.test.ts` | Tests for rashi data integrity |
| `src/lib/__tests__/faq-data.test.ts` | Tests for FAQ data + JSON-LD generation |
| `src/lib/__tests__/rashi-compatibility.test.ts` | Tests for compatibility content |
| `src/lib/__tests__/seo-content-expansion.test.ts` | Integration tests for new routes in sitemap, metadata |

### Modified Files
| File | Change |
|------|--------|
| `src/lib/seo/metadata.ts` | Add `PAGE_META` entries for all new routes |
| `src/lib/seo/structured-data.ts` | Add display names for breadcrumbs |
| `src/app/sitemap.ts` | Add all new route entries |
| `src/components/layout/Navbar.tsx` | Add rahu-kaal, choghadiya to Tools; dates to Calendars |
| `src/app/[locale]/panchang/rashi/page.tsx` | Link rashi cards to detail pages |
| `src/app/[locale]/horoscope/page.tsx` | Link rashi names to detail pages |
| `src/lib/horoscope/daily-article.ts` | Accept optional city parameter |
| `src/app/[locale]/daily/[date]/page.tsx` | Add per-rashi section + city links |
| `src/lib/constants/rashis.ts` | Add `slug` field to `Rashi` interface |
| ~11 existing layout files | Inject FAQ JSON-LD |

---

## Task 1: Rashi Slugs & Shared Utilities

**Files:**
- Modify: `src/lib/constants/rashis.ts`
- Create: `src/lib/constants/rashi-slugs.ts`
- Test: `src/lib/__tests__/rashi-details.test.ts`

- [ ] **Step 1: Write tests for slug mapping**

```ts
// src/lib/__tests__/rashi-details.test.ts
import { describe, it, expect } from 'vitest';
import { RASHI_SLUGS, getRashiBySlug, getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { RASHIS } from '@/lib/constants/rashis';

describe('Rashi Slugs', () => {
  it('has 12 slug entries matching RASHIS', () => {
    expect(RASHI_SLUGS).toHaveLength(12);
    RASHI_SLUGS.forEach((entry, i) => {
      expect(entry.id).toBe(i + 1);
      expect(entry.slug).toMatch(/^[a-z]+$/);
    });
  });

  it('getRashiBySlug returns correct rashi', () => {
    const mesh = getRashiBySlug('mesh');
    expect(mesh).toBeDefined();
    expect(mesh!.id).toBe(1);
    expect(getRashiBySlug('nonexistent')).toBeUndefined();
  });

  it('getDefaultCityForLocale returns valid cities', () => {
    expect(getDefaultCityForLocale('hi')).toEqual(
      expect.objectContaining({ slug: 'delhi' })
    );
    expect(getDefaultCityForLocale('ta')).toEqual(
      expect.objectContaining({ slug: 'chennai' })
    );
    expect(getDefaultCityForLocale('en')).toEqual(
      expect.objectContaining({ slug: 'delhi' })
    );
  });
});

describe('RASHIS has slug field', () => {
  it('every rashi has a non-empty slug', () => {
    RASHIS.forEach(r => {
      expect(r.slug).toBeDefined();
      expect(r.slug.length).toBeGreaterThan(0);
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/rashi-details.test.ts`
Expected: FAIL — `slug` not on Rashi type, `rashi-slugs` module doesn't exist

- [ ] **Step 3: Add slug field to RASHIS constant**

In `src/lib/constants/rashis.ts`, add `slug: string` to the Rashi interface (in `src/types/panchang.ts` where Rashi is defined) and add slug values to each entry:

```ts
// In src/types/panchang.ts — add to Rashi interface:
slug: string;

// In src/lib/constants/rashis.ts — add slug to each entry:
{ id: 1, slug: 'mesh', name: { en: 'Aries', hi: 'मेष', ... }, ... },
{ id: 2, slug: 'vrishabh', name: { en: 'Taurus', hi: 'वृषभ', ... }, ... },
{ id: 3, slug: 'mithun', name: { en: 'Gemini', hi: 'मिथुन', ... }, ... },
{ id: 4, slug: 'kark', name: { en: 'Cancer', hi: 'कर्क', ... }, ... },
{ id: 5, slug: 'simha', name: { en: 'Leo', hi: 'सिंह', ... }, ... },
{ id: 6, slug: 'kanya', name: { en: 'Virgo', hi: 'कन्या', ... }, ... },
{ id: 7, slug: 'tula', name: { en: 'Libra', hi: 'तुला', ... }, ... },
{ id: 8, slug: 'vrishchik', name: { en: 'Scorpio', hi: 'वृश्चिक', ... }, ... },
{ id: 9, slug: 'dhanu', name: { en: 'Sagittarius', hi: 'धनु', ... }, ... },
{ id: 10, slug: 'makar', name: { en: 'Capricorn', hi: 'मकर', ... }, ... },
{ id: 11, slug: 'kumbh', name: { en: 'Aquarius', hi: 'कुम्भ', ... }, ... },
{ id: 12, slug: 'meen', name: { en: 'Pisces', hi: 'मीन', ... }, ... },
```

- [ ] **Step 4: Create rashi-slugs utility module**

```ts
// src/lib/constants/rashi-slugs.ts
import { RASHIS } from './rashis';
import { CITIES, type CityData } from './cities';

export const RASHI_SLUGS = RASHIS.map(r => ({ id: r.id, slug: r.slug }));

export function getRashiBySlug(slug: string) {
  return RASHIS.find(r => r.slug === slug);
}

export function getRashiSlugById(id: number): string | undefined {
  return RASHIS.find(r => r.id === id)?.slug;
}

/** Returns a canonical pair slug with lower ID first. */
export function canonicalPairSlug(slug1: string, slug2: string): string {
  const r1 = getRashiBySlug(slug1);
  const r2 = getRashiBySlug(slug2);
  if (!r1 || !r2) return `${slug1}-and-${slug2}`;
  return r1.id <= r2.id
    ? `${r1.slug}-and-${r2.slug}`
    : `${r2.slug}-and-${r1.slug}`;
}

/** All 78 unique pair slugs (including same-sign). */
export function getAllPairSlugs(): string[] {
  const pairs: string[] = [];
  for (let i = 0; i < 12; i++) {
    for (let j = i; j < 12; j++) {
      pairs.push(`${RASHIS[i].slug}-and-${RASHIS[j].slug}`);
    }
  }
  return pairs;
}

const LOCALE_CITY_MAP: Record<string, string> = {
  hi: 'delhi',
  ta: 'chennai',
  te: 'hyderabad',
  bn: 'kolkata',
  kn: 'bangalore',
  sa: 'delhi',
  en: 'delhi',
};

export function getDefaultCityForLocale(locale: string): CityData | undefined {
  const slug = LOCALE_CITY_MAP[locale] || 'delhi';
  return CITIES.find(c => c.slug === slug);
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/rashi-details.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/types/panchang.ts src/lib/constants/rashis.ts src/lib/constants/rashi-slugs.ts src/lib/__tests__/rashi-details.test.ts
git commit -m "feat(seo): add rashi slugs and locale-city mapping utilities"
```

---

## Task 2: Rahu Kaal Standalone Page

**Files:**
- Create: `src/app/[locale]/rahu-kaal/page.tsx`
- Create: `src/app/[locale]/rahu-kaal/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` (add PAGE_META entry)
- Modify: `src/lib/seo/structured-data.ts` (add display name)

- [ ] **Step 1: Add PAGE_META entry for rahu-kaal**

In `src/lib/seo/metadata.ts`, add to `PAGE_META`:

```ts
'/rahu-kaal': {
  title: {
    en: 'Rahu Kaal Today — Accurate Rahu Kalam Timings',
    hi: 'आज का राहु काल — सटीक राहु कालम समय',
    sa: 'अद्य राहुकालः — यथार्थ समयः',
  },
  description: {
    en: 'Check today\'s Rahu Kaal timings for your city. Know the exact inauspicious period with Yamaganda and Gulika Kaal. Updated daily.',
    hi: 'अपने शहर के लिए आज का राहु काल समय जानें। यमगण्ड और गुलिक काल के साथ सटीक अशुभ अवधि।',
    sa: 'स्वनगरस्य अद्यतन राहुकालं जानीयात्। यमगण्ड-गुलिककालसहितम् अशुभकालम्।',
  },
  keywords: ['rahu kaal today', 'rahu kalam', 'rahukaal timings', 'inauspicious time today'],
},
```

- [ ] **Step 2: Add display name for breadcrumbs**

In `src/lib/seo/structured-data.ts`, add to `DISPLAY_NAMES`:

```ts
'rahu-kaal': 'Rahu Kaal',
```

- [ ] **Step 3: Create layout.tsx with metadata**

```tsx
// src/app/[locale]/rahu-kaal/layout.tsx
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const meta = getPageMetadata('/rahu-kaal', locale);
  return {
    ...meta,
    alternates: {
      canonical: `${BASE_URL}/${locale}/rahu-kaal`,
      languages: {
        en: `${BASE_URL}/en/rahu-kaal`,
        hi: `${BASE_URL}/hi/rahu-kaal`,
        sa: `${BASE_URL}/sa/rahu-kaal`,
        'x-default': `${BASE_URL}/en/rahu-kaal`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 4: Create page.tsx**

```tsx
// src/app/[locale]/rahu-kaal/page.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Clock, AlertTriangle, MapPin } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { CITIES, type CityData } from '@/lib/constants/cities';
import { getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { computePanchang, type PanchangInput } from '@/lib/ephem/panchang-calc';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { tl } from '@/lib/utils/trilingual';
import type { Locale } from '@/types/panchang';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';

const TOP_CITIES = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata',
  'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'varanasi'];

const LABELS: Record<string, Record<string, string>> = {
  en: {
    title: 'Rahu Kaal Today',
    subtitle: 'Inauspicious Period — Avoid New Beginnings',
    rahuKaal: 'Rahu Kaal',
    yamaganda: 'Yamaganda',
    gulika: 'Gulika Kaal',
    whatIs: 'What is Rahu Kaal?',
    whatIsDesc: 'Rahu Kaal (also spelled Rahu Kalam) is an inauspicious period of approximately 90 minutes that occurs every day. It is ruled by the shadow planet Rahu and is considered unfavorable for starting new ventures, important tasks, or auspicious ceremonies. The timing varies by day of the week and is calculated by dividing the period between sunrise and sunset into 8 equal parts.',
    howCalculated: 'How is it Calculated?',
    howCalculatedDesc: 'The day (sunrise to sunset) is divided into 8 equal segments. Each weekday has a fixed Rahu Kaal segment: Monday (2nd), Saturday (3rd), Friday (4th), Wednesday (5th), Thursday (6th), Tuesday (7th), Sunday (8th). The mnemonic is "Mother Saw Father Wearing The Turban on Sunday".',
    avoidDuring: 'Activities to Avoid',
    avoidList: 'Starting a new business or job, Signing contracts or agreements, Buying property or vehicles, Beginning a journey, Performing auspicious ceremonies, Making important financial decisions',
    selectCity: 'Select City',
    seeAlso: 'See Also',
    choghadiya: 'Choghadiya Today',
    fullPanchang: 'Full Panchang',
    to: 'to',
  },
  hi: {
    title: 'आज का राहु काल',
    subtitle: 'अशुभ काल — नए कार्य आरंभ न करें',
    rahuKaal: 'राहु काल',
    yamaganda: 'यमगण्ड',
    gulika: 'गुलिक काल',
    whatIs: 'राहु काल क्या है?',
    whatIsDesc: 'राहु काल (राहु कालम भी कहा जाता है) लगभग 90 मिनट की एक अशुभ अवधि है जो प्रतिदिन आती है। यह छाया ग्रह राहु द्वारा शासित है और नए कार्य, महत्वपूर्ण कार्य या शुभ समारोह शुरू करने के लिए अनुकूल नहीं माना जाता है। समय सप्ताह के दिन के अनुसार बदलता है और सूर्योदय से सूर्यास्त तक की अवधि को 8 बराबर भागों में विभाजित करके गणना की जाती है।',
    howCalculated: 'गणना कैसे होती है?',
    howCalculatedDesc: 'दिन (सूर्योदय से सूर्यास्त) को 8 बराबर भागों में बाँटा जाता है। प्रत्येक दिन का एक निश्चित राहु काल खंड होता है: सोमवार (2), शनिवार (3), शुक्रवार (4), बुधवार (5), गुरुवार (6), मंगलवार (7), रविवार (8)।',
    avoidDuring: 'इस दौरान क्या न करें',
    avoidList: 'नया व्यापार या नौकरी शुरू करना, अनुबंध या समझौते पर हस्ताक्षर करना, संपत्ति या वाहन खरीदना, यात्रा शुरू करना, शुभ समारोह करना, महत्वपूर्ण वित्तीय निर्णय लेना',
    selectCity: 'शहर चुनें',
    seeAlso: 'यह भी देखें',
    choghadiya: 'आज का चौघड़िया',
    fullPanchang: 'पूर्ण पंचांग',
    to: 'से',
  },
  sa: {
    title: 'अद्य राहुकालः',
    subtitle: 'अशुभकालः — नवकार्यम् मा आरभत',
    rahuKaal: 'राहुकालः',
    yamaganda: 'यमगण्डः',
    gulika: 'गुलिककालः',
    whatIs: 'राहुकालः किम्?',
    whatIsDesc: 'राहुकालः प्रतिदिनं प्रायः नवतिनिमेषाणां अशुभकालः। छायाग्रहराहुशासितः। नवकार्याणां, शुभकार्याणां च आरम्भाय अनुकूलः न मन्यते।',
    howCalculated: 'गणना कथम्?',
    howCalculatedDesc: 'दिनं (सूर्योदयात् सूर्यास्तपर्यन्तम्) अष्टसमभागेषु विभज्यते।',
    avoidDuring: 'वर्जनीयानि कार्याणि',
    avoidList: 'नवव्यापारारम्भः, अनुबन्धहस्ताक्षरम्, सम्पत्तिक्रयणम्, यात्रारम्भः, शुभसमारोहः, वित्तीयनिर्णयः',
    selectCity: 'नगरं चिनुत',
    seeAlso: 'अपि पश्यत',
    choghadiya: 'अद्य चौघड़िया',
    fullPanchang: 'पूर्णपञ्चाङ्गम्',
    to: 'पर्यन्तम्',
  },
};

export default function RahuKaalPage() {
  const locale = useLocale() as Locale;
  const L = LABELS[locale] || LABELS.en;
  const isDevanagari = locale === 'hi' || String(locale) === 'sa';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const defaultCity = getDefaultCityForLocale(locale);
  const [selectedCity, setSelectedCity] = useState<CityData | undefined>(defaultCity);
  const topCities = useMemo(() =>
    TOP_CITIES.map(s => CITIES.find(c => c.slug === s)).filter(Boolean) as CityData[],
  []);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();

  const panchang = useMemo(() => {
    if (!selectedCity) return null;
    const tzOffset = getUTCOffsetForDate(year, month, day, selectedCity.timezone);
    const input: PanchangInput = {
      year, month, day,
      lat: selectedCity.lat, lng: selectedCity.lng,
      tzOffset, timezone: selectedCity.timezone,
      locationName: selectedCity.name.en,
    };
    return computePanchang(input);
  }, [selectedCity, year, month, day]);

  const dateStr = today.toLocaleDateString(locale === 'hi' ? 'hi-IN' : locale === 'sa' ? 'hi-IN' : 'en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // Render: H1, date, city selector bar, time cards for Rahu Kaal / Yamaganda / Gulika,
  // visual timeline, educational content, FAQ section, internal links.
  // Implementation follows the pattern from panchang/[city]/page.tsx with:
  // - motion.div wrappers for cards
  // - GoldDivider between sections
  // - headingFont for h1/h2 tags
  // - ArrowLeft back link to /panchang
  // - Breadcrumb JSON-LD injected via <script type="application/ld+json">
  // Full JSX body should render all the content described in spec section 1A.
  // ...
  // (Full JSX implementation — server renders with default city, city selector swaps client-side)
}
```

**Note:** The full JSX body follows the patterns from the city panchang page — time cards with `motion.div`, educational sections with `GoldDivider`, FAQ accordion. The implementing agent should render:
1. Back link + H1 + date string
2. City selector bar (row of buttons, selected = gold border)
3. Three time cards: Rahu Kaal, Yamaganda, Gulika — each showing start-end time from `panchang.rahuKaal`, `panchang.yamaganda`, `panchang.gulikaKaal`
4. Visual timeline bar (SVG or div-based, sunrise-to-sunset with colored segments)
5. Educational "What is Rahu Kaal?" section
6. "Activities to Avoid" bulleted list
7. FAQ accordion
8. "See Also" links to `/choghadiya` and `/panchang`
9. Breadcrumb JSON-LD `<script>` tag

- [ ] **Step 5: Run build to verify page compiles**

Run: `npx next build`
Expected: Build succeeds (page may warn about missing translations — that's OK)

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/rahu-kaal/ src/lib/seo/metadata.ts src/lib/seo/structured-data.ts
git commit -m "feat(seo): add standalone Rahu Kaal Today page with city selector"
```

---

## Task 3: Choghadiya Standalone Page

**Files:**
- Create: `src/app/[locale]/choghadiya/page.tsx`
- Create: `src/app/[locale]/choghadiya/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` (add PAGE_META entry)
- Modify: `src/lib/seo/structured-data.ts` (add display name)

- [ ] **Step 1: Add PAGE_META entry for choghadiya**

In `src/lib/seo/metadata.ts`, add to `PAGE_META`:

```ts
'/choghadiya': {
  title: {
    en: 'Choghadiya Today — Auspicious & Inauspicious Time Slots',
    hi: 'आज का चौघड़िया — शुभ और अशुभ समय',
    sa: 'अद्य चौघड़िया — शुभाशुभकालः',
  },
  description: {
    en: 'Check today\'s Choghadiya timings — Amrit, Shubh, Labh, Char, Rog, Kaal, Udveg periods. Find the best time for travel, business, and auspicious activities.',
    hi: 'आज का चौघड़िया समय — अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग। यात्रा, व्यापार और शुभ कार्यों के लिए सर्वोत्तम समय।',
    sa: 'अद्यतनचौघड़ियासमयः — अमृत, शुभ, लाभ, चर, रोग, काल, उद्वेग। यात्रायै शुभकार्याय च उत्तमसमयः।',
  },
  keywords: ['choghadiya today', 'choghadiya timings', 'auspicious time today', 'shubh muhurat'],
},
```

- [ ] **Step 2: Add display name for breadcrumbs**

In `src/lib/seo/structured-data.ts`, add to `DISPLAY_NAMES`:

```ts
'choghadiya': 'Choghadiya',
```

- [ ] **Step 3: Create layout.tsx**

Same pattern as rahu-kaal layout — `generateMetadata` with `/choghadiya` route, hreflang alternates.

- [ ] **Step 4: Create page.tsx**

Same structural pattern as Rahu Kaal page but with choghadiya-specific content:
- Uses `panchang.choghadiya` array (type `ChoghadiyaSlot[]`)
- Renders 8 day slots + 8 night slots in a table/card grid
- Each slot shows: name (tl'd), type badge (auspicious=green, inauspicious=red, neutral=amber), start-end time
- Color coding: `amrit`/`shubh`/`labh` = green/gold, `char` = amber, `rog`/`kaal`/`udveg` = red
- Educational section: "What is Choghadiya?", "7 Types Explained", "Best Choghadiya for Travel/Business"
- Same city selector bar, LABELS pattern, FAQ accordion, See Also links

- [ ] **Step 5: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/choghadiya/ src/lib/seo/metadata.ts src/lib/seo/structured-data.ts
git commit -m "feat(seo): add standalone Choghadiya Today page with city selector"
```

---

## Task 4: Rashi Details Content Constant

**Files:**
- Create: `src/lib/constants/rashi-details.ts`
- Test: `src/lib/__tests__/rashi-details.test.ts` (extend)

- [ ] **Step 1: Add data integrity tests**

Append to `src/lib/__tests__/rashi-details.test.ts`:

```ts
import { RASHI_DETAILS, type RashiDetail } from '@/lib/constants/rashi-details';

describe('RASHI_DETAILS', () => {
  it('has exactly 12 entries', () => {
    expect(RASHI_DETAILS).toHaveLength(12);
  });

  it('each entry has id 1-12 matching index', () => {
    RASHI_DETAILS.forEach((rd, i) => {
      expect(rd.id).toBe(i + 1);
    });
  });

  it('each entry has en and hi for all text fields', () => {
    const textFields: (keyof RashiDetail)[] = [
      'personality', 'career', 'health', 'relationships',
      'strengths', 'challenges', 'luckyColors', 'luckyGems',
    ];
    RASHI_DETAILS.forEach(rd => {
      textFields.forEach(field => {
        const val = rd[field] as Record<string, string>;
        expect(val.en).toBeTruthy();
        expect(val.hi).toBeTruthy();
      });
    });
  });

  it('each entry has 3-5 FAQs with en and hi', () => {
    RASHI_DETAILS.forEach(rd => {
      expect(rd.faqs.length).toBeGreaterThanOrEqual(3);
      expect(rd.faqs.length).toBeLessThanOrEqual(5);
      rd.faqs.forEach(faq => {
        expect(faq.question.en).toBeTruthy();
        expect(faq.answer.en).toBeTruthy();
      });
    });
  });

  it('compatibleRashis are valid IDs 1-12', () => {
    RASHI_DETAILS.forEach(rd => {
      expect(rd.compatibleRashis.length).toBeGreaterThan(0);
      rd.compatibleRashis.forEach(id => {
        expect(id).toBeGreaterThanOrEqual(1);
        expect(id).toBeLessThanOrEqual(12);
      });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/rashi-details.test.ts`
Expected: FAIL — module doesn't exist

- [ ] **Step 3: Create rashi-details.ts with all 12 entries**

```ts
// src/lib/constants/rashi-details.ts

type MultilingualText = Record<string, string>;

export interface RashiDetail {
  id: number;
  personality: MultilingualText;
  career: MultilingualText;
  health: MultilingualText;
  relationships: MultilingualText;
  strengths: MultilingualText;
  challenges: MultilingualText;
  luckyNumbers: number[];
  luckyColors: MultilingualText;
  luckyGems: MultilingualText;
  compatibleRashis: number[];
  faqs: Array<{ question: MultilingualText; answer: MultilingualText }>;
}

export const RASHI_DETAILS: RashiDetail[] = [
  {
    id: 1, // Mesh / Aries
    personality: {
      en: 'Aries natives are natural-born leaders with fierce independence and boundless energy. Ruled by Mars, they possess a warrior spirit that drives them to conquer challenges head-on. Their enthusiasm is infectious, often inspiring those around them to take bold action. However, their impulsive nature can sometimes lead to hasty decisions. Aries individuals are pioneers at heart — they thrive when blazing new trails rather than following established paths. Their directness and honesty, while refreshing, can occasionally come across as blunt. In Vedic astrology, Mesh rashi represents the first impulse of creation, the raw energy that initiates all action in the zodiac.',
      hi: 'मेष राशि के जातक जन्मजात नेता होते हैं जिनमें प्रचंड स्वतंत्रता और असीम ऊर्जा होती है। मंगल ग्रह के स्वामित्व में, उनमें एक योद्धा भावना होती है जो उन्हें चुनौतियों का सीधे सामना करने के लिए प्रेरित करती है। उनका उत्साह संक्रामक होता है, जो अक्सर आसपास के लोगों को साहसिक कदम उठाने के लिए प्रेरित करता है। हालाँकि, उनका आवेगी स्वभाव कभी-कभी जल्दबाजी के निर्णयों की ओर ले जा सकता है। वैदिक ज्योतिष में, मेष राशि सृष्टि के प्रथम आवेग का प्रतिनिधित्व करती है।',
    },
    career: {
      en: 'Aries excels in roles demanding leadership, quick decision-making, and physical courage. They make outstanding entrepreneurs, military officers, surgeons, athletes, and emergency responders. Their competitive nature drives them to outperform peers, though they may struggle with routine desk work. Mars gives them mechanical aptitude — engineering, metallurgy, and firefighting are classic Aries professions. They perform best when given autonomy and clear targets.',
      hi: 'मेष राशि नेतृत्व, त्वरित निर्णय और शारीरिक साहस वाली भूमिकाओं में उत्कृष्ट प्रदर्शन करती है। वे उत्कृष्ट उद्यमी, सैन्य अधिकारी, सर्जन, एथलीट और आपातकालीन उत्तरदाता बनते हैं। मंगल उन्हें यांत्रिक योग्यता देता है — इंजीनियरिंग, धातुकर्म और अग्निशमन मेष के शास्त्रीय व्यवसाय हैं।',
    },
    health: {
      en: 'Aries rules the head and face in medical astrology. Natives may be prone to headaches, migraines, sinus issues, and facial injuries. Mars influence can lead to fevers, inflammation, and blood-related conditions. Their high energy and tendency to push limits makes them susceptible to sports injuries and burnout. Regular physical exercise is essential but should be balanced with adequate rest. Cooling foods and practices help balance their inherent fire element.',
      hi: 'मेष राशि चिकित्सा ज्योतिष में सिर और चेहरे पर शासन करती है। जातकों को सिरदर्द, माइग्रेन, साइनस की समस्या और चेहरे की चोटें हो सकती हैं। मंगल का प्रभाव बुखार, सूजन और रक्त संबंधी स्थितियों का कारण बन सकता है।',
    },
    relationships: {
      en: 'In love, Aries is passionate, direct, and fiercely loyal. They pursue partners with the same intensity they bring to everything else. They need a partner who can match their energy without trying to control them. Aries in relationships values independence — they need space to maintain their identity. Their ideal partner is confident, adventurous, and not easily intimidated. They are most compatible with fellow fire signs (Leo, Sagittarius) and air signs (Gemini, Aquarius) that fan their flames.',
      hi: 'प्रेम में, मेष राशि भावुक, प्रत्यक्ष और अत्यंत वफादार होती है। वे उसी तीव्रता के साथ साथी की तलाश करते हैं जो वे हर चीज में लाते हैं। उन्हें ऐसे साथी की आवश्यकता होती है जो उनकी ऊर्जा से मेल खा सके। वे अग्नि राशियों (सिंह, धनु) और वायु राशियों (मिथुन, कुम्भ) के साथ सबसे अधिक संगत हैं।',
    },
    strengths: {
      en: 'Courageous, determined, confident, enthusiastic, optimistic, honest, passionate. Natural ability to take initiative and lead from the front.',
      hi: 'साहसी, दृढ़निश्चयी, आत्मविश्वासी, उत्साही, आशावादी, ईमानदार, भावुक। पहल करने और आगे से नेतृत्व करने की प्राकृतिक क्षमता।',
    },
    challenges: {
      en: 'Impatient, short-tempered, impulsive, aggressive, competitive to a fault. Tendency to start projects with great enthusiasm but lose interest before completion.',
      hi: 'अधीर, चिड़चिड़ा, आवेगी, आक्रामक। बड़े उत्साह के साथ परियोजनाएं शुरू करने लेकिन पूरा होने से पहले रुचि खो देने की प्रवृत्ति।',
    },
    luckyNumbers: [1, 8, 17],
    luckyColors: { en: 'Red, Scarlet, Coral', hi: 'लाल, स्कार्लेट, मूंगा रंग' },
    luckyGems: { en: 'Red Coral (Moonga)', hi: 'लाल मूंगा (मूंगा)' },
    compatibleRashis: [5, 9, 3, 11], // Leo, Sagittarius, Gemini, Aquarius
    faqs: [
      {
        question: { en: 'What planet rules Aries (Mesh) in Vedic astrology?', hi: 'वैदिक ज्योतिष में मेष राशि का स्वामी कौन सा ग्रह है?' },
        answer: { en: 'Mars (Mangal) rules Aries in Vedic astrology. As the planet of energy, courage, and action, Mars gives Aries natives their characteristic drive, physical vitality, and leadership qualities.', hi: 'वैदिक ज्योतिष में मंगल ग्रह मेष राशि का स्वामी है। ऊर्जा, साहस और कर्म के ग्रह के रूप में, मंगल मेष जातकों को उनकी विशिष्ट प्रेरणा, शारीरिक जीवन शक्ति और नेतृत्व गुण प्रदान करता है।' },
      },
      {
        question: { en: 'Which nakshatras fall in Aries (Mesh) rashi?', hi: 'मेष राशि में कौन से नक्षत्र आते हैं?' },
        answer: { en: 'Three nakshatras span Aries: Ashwini (0°-13°20\'), Bharani (13°20\'-26°40\'), and the first pada of Krittika (26°40\'-30°). Each gives a distinct personality flavor to Aries natives born under it.', hi: 'मेष राशि में तीन नक्षत्र आते हैं: अश्विनी (0°-13°20\'), भरणी (13°20\'-26°40\'), और कृत्तिका का पहला चरण (26°40\'-30°)।' },
      },
      {
        question: { en: 'Is Aries compatible with Scorpio in Vedic astrology?', hi: 'क्या वैदिक ज्योतिष में मेष और वृश्चिक राशि संगत हैं?' },
        answer: { en: 'Both are ruled by Mars, creating a powerful but intense combination. They share passion, determination, and courage. However, both are headstrong, which can lead to power struggles. Compatibility depends heavily on Moon nakshatra placement and other chart factors.', hi: 'दोनों मंगल द्वारा शासित हैं, जो एक शक्तिशाली लेकिन तीव्र संयोजन बनाता है। वे जुनून, दृढ़ संकल्प और साहस साझा करते हैं। हालाँकि, दोनों जिद्दी हैं, जिससे सत्ता संघर्ष हो सकता है।' },
      },
    ],
  },
  // ... entries for ids 2-12 follow the same structure
  // Each rashi has unique, astrologically accurate content based on:
  // - Ruling planet characteristics
  // - Element (fire/earth/air/water)
  // - Modality (cardinal/fixed/mutable)
  // - Body part rulership
  // - Traditional Vedic associations
  // The implementing agent must write all 12 entries with genuine astrological content.
];
```

**CRITICAL:** The implementing agent must write all 12 entries. Each must have genuinely different content derived from the rashi's unique astrological properties — not templates with swapped names. Key differentiators per rashi:

| ID | Slug | Ruler | Element | Body | Compatible |
|----|------|-------|---------|------|------------|
| 1 | mesh | Mars | Fire | Head/Face | 5,9,3,11 |
| 2 | vrishabh | Venus | Earth | Throat/Neck | 6,10,4,12 |
| 3 | mithun | Mercury | Air | Arms/Shoulders | 7,11,1,5 |
| 4 | kark | Moon | Water | Chest/Stomach | 8,12,2,6 |
| 5 | simha | Sun | Fire | Heart/Spine | 1,9,3,7 |
| 6 | kanya | Mercury | Earth | Intestines/Digestion | 2,10,4,8 |
| 7 | tula | Venus | Air | Kidneys/Lower Back | 3,11,5,9 |
| 8 | vrishchik | Mars | Water | Reproductive/Excretory | 4,12,6,10 |
| 9 | dhanu | Jupiter | Fire | Thighs/Hips | 1,5,3,7 |
| 10 | makar | Saturn | Earth | Knees/Bones | 2,6,8,12 |
| 11 | kumbh | Saturn | Air | Ankles/Circulation | 3,7,1,9 |
| 12 | meen | Jupiter | Water | Feet/Lymphatic | 4,8,6,10 |

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/__tests__/rashi-details.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/rashi-details.ts src/lib/__tests__/rashi-details.test.ts
git commit -m "feat(seo): add rashi details content constant with 12 entries"
```

---

## Task 5: Rashi Detail Page (12 pages)

**Files:**
- Create: `src/app/[locale]/panchang/rashi/[id]/page.tsx`
- Create: `src/app/[locale]/panchang/rashi/[id]/layout.tsx`
- Modify: `src/lib/seo/metadata.ts` (add per-rashi PAGE_META entries)
- Modify: `src/app/[locale]/panchang/rashi/page.tsx` (link cards to detail pages)

- [ ] **Step 1: Add PAGE_META entries for each rashi**

In `src/lib/seo/metadata.ts`, add entries keyed by `/panchang/rashi/mesh` through `/panchang/rashi/meen`. Each has title like:
```ts
'/panchang/rashi/mesh': {
  title: { en: 'Aries (Mesh) — Personality, Career, Love & Today\'s Horoscope', hi: 'मेष राशि — व्यक्तित्व, करियर, प्रेम और आज का राशिफल', sa: 'मेषराशिः — व्यक्तित्वम्, वृत्तिः, प्रेम, अद्य राशिफलम्' },
  description: { en: '...', hi: '...', sa: '...' },
  keywords: ['aries vedic astrology', 'mesh rashi', 'aries personality', 'aries horoscope today'],
},
```

- [ ] **Step 2: Create layout.tsx**

```tsx
// src/app/[locale]/panchang/rashi/[id]/layout.tsx
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const route = `/panchang/rashi/${id}`;
  const meta = getPageMetadata(route, locale);
  return {
    ...meta,
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: {
        en: `${BASE_URL}/en${route}`,
        hi: `${BASE_URL}/hi${route}`,
        sa: `${BASE_URL}/sa${route}`,
        'x-default': `${BASE_URL}/en${route}`,
      },
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Create page.tsx**

```tsx
// src/app/[locale]/panchang/rashi/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, ArrowRight, Star, Heart, Briefcase, Activity, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { RASHI_DETAILS } from '@/lib/constants/rashi-details';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';

// Page renders:
// 1. Hero with RashiIconById + name + element badge
// 2. Quick info grid (ruler, element, modality, lucky numbers/colors/gems)
// 3. Personality section from RASHI_DETAILS[id-1].personality
// 4. Career section
// 5. Health section
// 6. Relationships section
// 7. Dynamic "Today for {Rashi}" client section — fetches from /api/horoscope?sign={id}&date=today
//    or computes client-side via generateDailyHoroscope({ moonSign: id, date: todayStr })
// 8. Compatible rashis cards linking to /matching/{slug1}-and-{slug2}
// 9. Related nakshatras (filter NAKSHATRAS where startDeg falls in rashi's degree range)
// 10. FAQ accordion + FAQPage JSON-LD script tag
// 11. Prev/next rashi navigation (wraps 1↔12)
// 12. BreadcrumbList JSON-LD script tag

export default function RashiDetailPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const slug = params.id as string;
  const rashi = getRashiBySlug(slug);

  if (!rashi) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary mb-4">Rashi not found</p>
          <Link href="/panchang/rashi" className="text-gold-primary hover:text-gold-light">
            ← Back to Rashis
          </Link>
        </div>
      </div>
    );
  }

  const detail = RASHI_DETAILS[rashi.id - 1];
  const isDevanagari = locale === 'hi' || String(locale) === 'sa';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Related nakshatras: those whose degree range overlaps this rashi
  const relatedNakshatras = NAKSHATRAS.filter(n => {
    const nakStart = (n.id - 1) * (360 / 27);
    return nakStart >= rashi.startDeg && nakStart < rashi.endDeg;
  });

  // Prev/next navigation
  const prevId = rashi.id === 1 ? 12 : rashi.id - 1;
  const nextId = rashi.id === 12 ? 1 : rashi.id + 1;
  const prevRashi = RASHIS[prevId - 1];
  const nextRashi = RASHIS[nextId - 1];

  // Dynamic horoscope state
  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);

  useEffect(() => {
    import('@/lib/horoscope/daily-engine').then(({ generateDailyHoroscope }) => {
      const today = new Date();
      const dateStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;
      setHoroscope(generateDailyHoroscope({ moonSign: rashi.id, date: dateStr }));
    });
  }, [rashi.id]);

  // FAQ JSON-LD
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: detail.faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] || faq.answer.en,
      },
    })),
  };

  // Full render follows patterns from nakshatra/[id]/page.tsx:
  // motion.div sections, GoldDivider between, headingFont on h1/h2,
  // ArrowLeft back to /panchang/rashi, prev/next at bottom
  return (
    // ... Full JSX implementation
  );
}
```

- [ ] **Step 4: Update rashi index page to link to detail pages**

In `src/app/[locale]/panchang/rashi/page.tsx`, change the rashi card grid from `onClick={() => setSelectedRashi(rashi)}` to `<Link href={'/panchang/rashi/' + rashi.slug}>`. Remove the inline `RashiDetailPanel` since detail pages now handle this.

- [ ] **Step 5: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/panchang/rashi/[id]/ src/app/[locale]/panchang/rashi/page.tsx src/lib/seo/metadata.ts
git commit -m "feat(seo): add 12 individual rashi detail pages with today's horoscope"
```

---

## Task 6: Update Sitemap & Navbar for Tier 1

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Add Tier 1 routes to sitemap**

In `src/app/sitemap.ts`, add to the `routes` array:
```ts
'/rahu-kaal',
'/choghadiya',
```

Add rashi detail pages dynamically:
```ts
// After the static routes section, add rashi detail pages
const rashiSlugs = ['mesh', 'vrishabh', 'mithun', 'kark', 'simha', 'kanya',
  'tula', 'vrishchik', 'dhanu', 'makar', 'kumbh', 'meen'];

// In the sitemap generation function, add:
...rashiSlugs.map(slug => ({
  url: `${BASE_URL}/${locale}/panchang/rashi/${slug}`,
  lastModified: new Date(),
  changeFrequency: 'daily' as const,
  priority: 0.7,
  alternates: { languages: Object.fromEntries(locales.map(l => [l, `${BASE_URL}/${l}/panchang/rashi/${slug}`])) },
})),
```

- [ ] **Step 2: Add to Navbar**

In `src/components/layout/Navbar.tsx`, add to the Tools dropdown children array:
```ts
{ href: '/rahu-kaal', label: locale === 'hi' ? 'राहु काल' : locale === 'sa' ? 'राहुकालः' : 'Rahu Kaal' },
{ href: '/choghadiya', label: locale === 'hi' ? 'चौघड़िया' : locale === 'sa' ? 'चौघड़िया' : 'Choghadiya' },
```

- [ ] **Step 3: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/sitemap.ts src/components/layout/Navbar.tsx
git commit -m "feat(seo): add Tier 1 routes to sitemap and navbar"
```

---

## Task 7: FAQ Data & Schema Helper

**Files:**
- Create: `src/lib/seo/faq-data.ts`
- Test: `src/lib/__tests__/faq-data.test.ts`

- [ ] **Step 1: Write tests**

```ts
// src/lib/__tests__/faq-data.test.ts
import { describe, it, expect } from 'vitest';
import { FAQ_DATA, generateFAQLD } from '@/lib/seo/faq-data';

describe('FAQ_DATA', () => {
  it('has entries for all required routes', () => {
    const requiredRoutes = [
      '/panchang', '/panchang/tithi', '/panchang/nakshatra',
      '/panchang/yoga', '/panchang/rashi', '/matching',
      '/horoscope', '/kundali', '/muhurta-ai',
      '/rahu-kaal', '/choghadiya',
    ];
    requiredRoutes.forEach(route => {
      expect(FAQ_DATA[route]).toBeDefined();
      expect(FAQ_DATA[route].length).toBeGreaterThanOrEqual(3);
    });
  });

  it('each FAQ has en text for question and answer', () => {
    Object.values(FAQ_DATA).forEach(faqs => {
      faqs.forEach(faq => {
        expect(faq.question.en).toBeTruthy();
        expect(faq.answer.en).toBeTruthy();
      });
    });
  });
});

describe('generateFAQLD', () => {
  it('returns FAQPage JSON-LD for known routes', () => {
    const ld = generateFAQLD('/panchang', 'en');
    expect(ld).toBeDefined();
    expect(ld!['@type']).toBe('FAQPage');
    expect(ld!.mainEntity.length).toBeGreaterThanOrEqual(3);
  });

  it('returns null for unknown routes', () => {
    expect(generateFAQLD('/nonexistent', 'en')).toBeNull();
  });

  it('uses locale-specific text when available', () => {
    const ldEn = generateFAQLD('/panchang', 'en');
    const ldHi = generateFAQLD('/panchang', 'hi');
    expect(ldEn!.mainEntity[0].name).not.toBe(ldHi!.mainEntity[0].name);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/faq-data.test.ts`
Expected: FAIL

- [ ] **Step 3: Create faq-data.ts**

```ts
// src/lib/seo/faq-data.ts

interface FAQEntry {
  question: Record<string, string>;
  answer: Record<string, string>;
}

export const FAQ_DATA: Record<string, FAQEntry[]> = {
  '/panchang': [
    {
      question: { en: 'What is Panchang?', hi: 'पंचांग क्या है?' },
      answer: { en: 'Panchang is the Hindu calendar and almanac that tracks five key elements (panch = five, ang = limb): Tithi (lunar day), Nakshatra (lunar mansion), Yoga (sun-moon angular relationship), Karana (half of a tithi), and Vara (weekday). It is used to determine auspicious timings for religious ceremonies, personal milestones, and daily activities.', hi: 'पंचांग हिंदू कैलेंडर और पंचांग है जो पाँच प्रमुख तत्वों को ट्रैक करता है: तिथि, नक्षत्र, योग, करण और वार। इसका उपयोग धार्मिक अनुष्ठानों और दैनिक गतिविधियों के लिए शुभ समय निर्धारित करने के लिए किया जाता है।' },
    },
    {
      question: { en: 'Why does Panchang change by location?', hi: 'पंचांग स्थान के अनुसार क्यों बदलता है?' },
      answer: { en: 'Panchang timings are based on the local sunrise and sunset, which vary by geographic location. The tithi, nakshatra, and other elements active at sunrise determine the day\'s Panchang. Two cities with different sunrise times may have different tithis at their respective sunrises.', hi: 'पंचांग का समय स्थानीय सूर्योदय और सूर्यास्त पर आधारित होता है, जो भौगोलिक स्थान के अनुसार भिन्न होता है। सूर्योदय के समय सक्रिय तिथि, नक्षत्र और अन्य तत्व दिन का पंचांग निर्धारित करते हैं।' },
    },
    {
      question: { en: 'How accurate is this Panchang?', hi: 'यह पंचांग कितना सटीक है?' },
      answer: { en: 'Our Panchang is calculated using Meeus astronomical algorithms with Lahiri Ayanamsa. All values are verified to be within 1-2 minutes of established references. The Sun position accuracy is ~0.01° and Moon accuracy is ~0.5°.', hi: 'हमारा पंचांग मीयस खगोलीय एल्गोरिदम और लाहिरी अयनांश का उपयोग करके गणना किया जाता है। सभी मान स्थापित संदर्भों के 1-2 मिनट के भीतर सत्यापित हैं।' },
    },
  ],
  '/panchang/tithi': [
    {
      question: { en: 'What is a Tithi?', hi: 'तिथि क्या है?' },
      answer: { en: 'A Tithi is a lunar day in the Hindu calendar, defined by a 12° increase in the angular distance between the Moon and Sun. There are 30 tithis in a lunar month — 15 in the waxing (Shukla Paksha) and 15 in the waning (Krishna Paksha) phase.', hi: 'तिथि हिंदू कैलेंडर में एक चंद्र दिवस है, जो चंद्रमा और सूर्य के बीच कोणीय दूरी में 12° की वृद्धि से परिभाषित होती है। एक चंद्र मास में 30 तिथियाँ होती हैं।' },
    },
    {
      question: { en: 'What is the difference between Shukla and Krishna Paksha?', hi: 'शुक्ल और कृष्ण पक्ष में क्या अंतर है?' },
      answer: { en: 'Shukla Paksha (bright fortnight) is the 15-day period from New Moon to Full Moon when the Moon is waxing. Krishna Paksha (dark fortnight) is from Full Moon to New Moon when the Moon is waning. Shukla Paksha is generally considered more auspicious for new beginnings.', hi: 'शुक्ल पक्ष (उजला पखवाड़ा) अमावस्या से पूर्णिमा तक की 15 दिनों की अवधि है। कृष्ण पक्ष (अंधेरा पखवाड़ा) पूर्णिमा से अमावस्या तक है। शुक्ल पक्ष को आम तौर पर नई शुरुआत के लिए अधिक शुभ माना जाता है।' },
    },
    {
      question: { en: 'What is Kshaya Tithi?', hi: 'क्षय तिथि क्या है?' },
      answer: { en: 'A Kshaya (depleted) Tithi is one that starts after sunrise on one day and ends before sunrise the next day, meaning it never coincides with a sunrise. Kshaya tithis are rare and have special rules for festival observances — typically the preceding tithi absorbs its observances.', hi: 'क्षय तिथि वह है जो एक दिन सूर्योदय के बाद शुरू होती है और अगले दिन सूर्योदय से पहले समाप्त हो जाती है। क्षय तिथियाँ दुर्लभ हैं और त्योहार मनाने के विशेष नियम हैं।' },
    },
  ],
  '/panchang/nakshatra': [
    {
      question: { en: 'What are Nakshatras?', hi: 'नक्षत्र क्या हैं?' },
      answer: { en: 'Nakshatras are 27 lunar mansions or star clusters along the Moon\'s ecliptic path. Each nakshatra spans 13°20\' of the zodiac. They are fundamental to Vedic astrology for determining personality, compatibility, muhurta (auspicious timing), and dasha systems.', hi: 'नक्षत्र चंद्रमा के पथ पर 27 तारा समूह हैं। प्रत्येक नक्षत्र राशिचक्र के 13°20\' में फैला है। ये वैदिक ज्योतिष में व्यक्तित्व, संगतता, मुहूर्त और दशा प्रणालियों के लिए मौलिक हैं।' },
    },
    {
      question: { en: 'How are Nakshatras different from Rashis?', hi: 'नक्षत्र और राशि में क्या अंतर है?' },
      answer: { en: 'Rashis (zodiac signs) divide the ecliptic into 12 equal 30° segments, while Nakshatras divide it into 27 equal 13°20\' segments. Each rashi contains 2.25 nakshatras. Nakshatras provide finer personality detail and are used for compatibility matching (Ashta Kuta), while rashis give broader life themes.', hi: 'राशियाँ क्रांतिवृत्त को 12 बराबर 30° खंडों में विभाजित करती हैं, जबकि नक्षत्र इसे 27 बराबर 13°20\' खंडों में विभाजित करते हैं। प्रत्येक राशि में 2.25 नक्षत्र होते हैं।' },
    },
    {
      question: { en: 'What is the Nakshatra Pada system?', hi: 'नक्षत्र पद प्रणाली क्या है?' },
      answer: { en: 'Each Nakshatra is divided into 4 Padas (quarters) of 3°20\' each. The 108 total padas (27 × 4) map to the 12 rashis of the Navamsha chart, creating a micro-zodiac. Your birth pada determines your Navamsha sign and baby naming syllable.', hi: 'प्रत्येक नक्षत्र को 3°20\' के 4 पदों (चरणों) में विभाजित किया जाता है। कुल 108 पद (27 × 4) नवांश चार्ट की 12 राशियों से मैप होते हैं।' },
    },
  ],
  '/panchang/yoga': [
    {
      question: { en: 'What is Yoga in Panchang?', hi: 'पंचांग में योग क्या है?' },
      answer: { en: 'Yoga in Panchang is a calculation based on the combined longitude of the Sun and Moon. There are 27 Yogas, each spanning 13°20\' of the combined arc. They indicate the general auspiciousness or inauspiciousness of a time period and are one of the five elements (Panchangas) of the Hindu calendar.', hi: 'पंचांग में योग सूर्य और चंद्रमा की संयुक्त देशांतर पर आधारित गणना है। 27 योग हैं, प्रत्येक संयुक्त चाप के 13°20\' में फैला है।' },
    },
    {
      question: { en: 'Which Yogas are considered auspicious?', hi: 'कौन से योग शुभ माने जाते हैं?' },
      answer: { en: 'The most auspicious Yogas include Siddhi, Amrita, Saubhagya, Shobhana, and Sukarma. Vishkambha is also auspicious for starting new ventures. Vyaghata, Vajra, Vyatipata, Parigha, and Vaidhrti are considered inauspicious and should be avoided for important activities.', hi: 'सबसे शुभ योगों में सिद्धि, अमृत, सौभाग्य, शोभन और सुकर्म शामिल हैं। व्याघात, वज्र, व्यतीपात, परिघ और वैधृति अशुभ माने जाते हैं।' },
    },
    {
      question: { en: 'How many Yogas are there?', hi: 'कितने योग होते हैं?' },
      answer: { en: 'There are 27 Yogas in total, also called Nitya Yogas. They cycle continuously, each lasting approximately one day. The 27 Yogas correspond to the 27 Nakshatras in number but are calculated differently — Yogas use the sum of Sun and Moon longitudes, while Nakshatras use only the Moon\'s longitude.', hi: '27 योग होते हैं, जिन्हें नित्य योग भी कहा जाता है। ये निरंतर चक्रित होते हैं, प्रत्येक लगभग एक दिन चलता है।' },
    },
  ],
  '/panchang/rashi': [
    {
      question: { en: 'What is a Rashi in Vedic astrology?', hi: 'वैदिक ज्योतिष में राशि क्या है?' },
      answer: { en: 'A Rashi is a zodiac sign in Vedic (sidereal) astrology. There are 12 Rashis, each spanning 30° of the ecliptic. Unlike Western astrology which uses the tropical zodiac, Vedic astrology uses the sidereal zodiac adjusted by the Ayanamsa (currently ~24°). This means your Vedic Moon sign may differ from your Western Sun sign.', hi: 'राशि वैदिक (नाक्षत्र) ज्योतिष में एक राशिचक्र चिह्न है। 12 राशियाँ हैं, प्रत्येक क्रांतिवृत्त के 30° में फैली है।' },
    },
    {
      question: { en: 'How is Vedic Moon sign different from Western Sun sign?', hi: 'वैदिक चंद्र राशि और पश्चिमी सूर्य राशि में क्या अंतर है?' },
      answer: { en: 'In Vedic astrology, your primary sign is determined by the Moon\'s sidereal position at birth, while Western astrology uses the Sun\'s tropical position. Due to the ~24° Ayanamsa difference and different reference points (Moon vs Sun), most people have different Vedic and Western signs.', hi: 'वैदिक ज्योतिष में, आपकी प्राथमिक राशि जन्म के समय चंद्रमा की नाक्षत्र स्थिति से निर्धारित होती है, जबकि पश्चिमी ज्योतिष सूर्य की उष्णकटिबंधीय स्थिति का उपयोग करता है।' },
    },
    {
      question: { en: 'How do I find my Rashi?', hi: 'मेरी राशि कैसे जानें?' },
      answer: { en: 'Your Rashi (Moon sign) is determined by the Moon\'s position in the sidereal zodiac at the exact time and place of your birth. You need your precise birth date, time, and location. Use our Sign Calculator tool for an instant calculation, or generate a full Kundali for detailed analysis.', hi: 'आपकी राशि (चंद्र राशि) जन्म के सटीक समय और स्थान पर नाक्षत्र राशिचक्र में चंद्रमा की स्थिति से निर्धारित होती है। हमारे राशि कैलकुलेटर का उपयोग करें।' },
    },
  ],
  '/matching': [
    {
      question: { en: 'What is Ashta Kuta matching?', hi: 'अष्ट कूट मिलान क्या है?' },
      answer: { en: 'Ashta Kuta is the traditional Vedic compatibility system that evaluates 8 factors (kutas) between two birth charts, with a maximum score of 36 points. The 8 factors are: Varna (1), Vashya (2), Tara (3), Yoni (4), Graha Maitri (5), Gana (3), Bhakoot (7), and Nadi (8). A score of 18+ out of 36 is generally considered acceptable for marriage.', hi: 'अष्ट कूट पारंपरिक वैदिक संगतता प्रणाली है जो दो जन्म कुंडलियों के बीच 8 कारकों (कूटों) का मूल्यांकन करती है, अधिकतम 36 अंकों के साथ।' },
    },
    {
      question: { en: 'What is the minimum score for marriage compatibility?', hi: 'विवाह संगतता के लिए न्यूनतम अंक क्या है?' },
      answer: { en: 'Traditionally, 18 out of 36 points (50%) is considered the minimum acceptable score. Scores of 25+ are considered good, and 30+ excellent. However, Nadi Dosha (0 in Nadi kuta) is considered a serious defect regardless of total score, as it traditionally indicates health issues for offspring.', hi: 'परंपरागत रूप से, 36 में से 18 अंक (50%) न्यूनतम स्वीकार्य स्कोर माना जाता है। 25+ अच्छा और 30+ उत्कृष्ट माना जाता है।' },
    },
    {
      question: { en: 'What is Mangal Dosha?', hi: 'मांगलिक दोष क्या है?' },
      answer: { en: 'Mangal Dosha (also called Manglik or Kuja Dosha) occurs when Mars is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon, or Venus. It is believed to cause disharmony in marriage. The dosha is considered neutralized if both partners have it, or after age 28.', hi: 'मांगलिक दोष (कुज दोष) तब होता है जब मंगल लग्न, चंद्र या शुक्र से 1, 2, 4, 7, 8 या 12वें भाव में स्थित होता है।' },
    },
  ],
  '/horoscope': [
    {
      question: { en: 'How is the daily horoscope calculated?', hi: 'दैनिक राशिफल की गणना कैसे होती है?' },
      answer: { en: 'Our daily horoscope uses real astronomical positions: Moon transit through signs (Chandrabala), current tithi quality, active nakshatra nature, yoga auspiciousness, weekday lord compatibility, and slow planet (Jupiter, Saturn, Rahu, Ketu) transit effects on each rashi. No random generation — all predictions are astronomically derived.', hi: 'हमारा दैनिक राशिफल वास्तविक खगोलीय स्थितियों का उपयोग करता है: चंद्रबल, तिथि गुणवत्ता, सक्रिय नक्षत्र, योग शुभता, और धीमे ग्रहों के गोचर प्रभाव।' },
    },
    {
      question: { en: 'Should I check Sun sign or Moon sign horoscope?', hi: 'क्या मुझे सूर्य राशि या चंद्र राशि का राशिफल देखना चाहिए?' },
      answer: { en: 'In Vedic astrology, always check your Moon sign (Chandra Rashi) horoscope. The Moon sign is the primary identifier in Jyotish and determines your mental constitution, emotional responses, and day-to-day experiences. Sun sign horoscopes are a Western astrology convention.', hi: 'वैदिक ज्योतिष में, हमेशा अपनी चंद्र राशि का राशिफल देखें। चंद्र राशि ज्योतिष में प्राथमिक पहचानकर्ता है।' },
    },
    {
      question: { en: 'How often is the horoscope updated?', hi: 'राशिफल कितनी बार अपडेट होता है?' },
      answer: { en: 'The horoscope updates daily at midnight based on the next day\'s astronomical positions. Since predictions are computed from real planetary positions, they change as transits shift. The Moon changes sign every ~2.5 days, creating the most noticeable day-to-day prediction changes.', hi: 'राशिफल अगले दिन की खगोलीय स्थितियों के आधार पर प्रतिदिन मध्यरात्रि को अपडेट होता है।' },
    },
  ],
  '/kundali': [
    {
      question: { en: 'What is a Kundali (birth chart)?', hi: 'कुंडली (जन्म कुंडली) क्या है?' },
      answer: { en: 'A Kundali (also called Janam Patri or birth chart) is a map of the sky at the exact moment and location of your birth. It shows the positions of the Sun, Moon, and planets in the 12 houses and signs of the sidereal zodiac. It is the foundation for all Vedic astrological analysis.', hi: 'कुंडली (जन्म पत्री) आपके जन्म के सटीक क्षण और स्थान पर आकाश का नक्शा है। यह 12 भावों और राशियों में सूर्य, चंद्रमा और ग्रहों की स्थिति दर्शाती है।' },
    },
    {
      question: { en: 'What is the difference between North and South Indian charts?', hi: 'उत्तर भारतीय और दक्षिण भारतीय कुंडली में क्या अंतर है?' },
      answer: { en: 'Both represent the same data differently. The North Indian chart has a fixed house layout (diamond shape) where signs rotate — house 1 is always at the top. The South Indian chart has a fixed sign layout (square grid) where houses rotate — Aries is always in the same position. Neither is more accurate; it is regional preference.', hi: 'दोनों एक ही डेटा को अलग-अलग तरीके से दर्शाती हैं। उत्तर भारतीय कुंडली में भाव स्थिर होते हैं, दक्षिण भारतीय में राशियाँ स्थिर होती हैं।' },
    },
    {
      question: { en: 'Why is exact birth time important?', hi: 'सटीक जन्म समय क्यों महत्वपूर्ण है?' },
      answer: { en: 'The Ascendant (Lagna) changes roughly every 2 hours, and the Moon changes Nakshatra pada every ~3.5 hours. Even a 5-minute difference can shift the Lagna, changing all house placements. For accurate Dasha predictions and divisional charts, birth time should be accurate to within a few minutes.', hi: 'लग्न लगभग हर 2 घंटे में बदलता है, और चंद्रमा हर ~3.5 घंटे में नक्षत्र पद बदलता है। 5 मिनट का अंतर भी लग्न बदल सकता है।' },
    },
  ],
  '/muhurta-ai': [
    {
      question: { en: 'What is Muhurta?', hi: 'मुहूर्त क्या है?' },
      answer: { en: 'Muhurta is the Vedic science of electional astrology — selecting the most auspicious date and time for important activities. It considers tithi, nakshatra, yoga, karana, weekday, lagna, and planetary positions to find windows where cosmic energies support the intended activity.', hi: 'मुहूर्त वैदिक विद्वान ज्योतिष है — महत्वपूर्ण गतिविधियों के लिए सबसे शुभ तिथि और समय का चयन। यह तिथि, नक्षत्र, योग, करण, वार, लग्न और ग्रह स्थितियों पर विचार करता है।' },
    },
    {
      question: { en: 'How does the AI Muhurta finder work?', hi: 'AI मुहूर्त खोजक कैसे काम करता है?' },
      answer: { en: 'Our Muhurta AI scores potential time windows across 20+ factors including Panchang elements, planetary dignity, house strengths, and activity-specific rules. It scans dates in your selected range, computes a composite auspiciousness score, and ranks the top windows. All scoring is deterministic and based on classical Jyotish rules.', hi: 'हमारा मुहूर्त AI 20+ कारकों में संभावित समय खिड़कियों को स्कोर करता है। सभी स्कोरिंग शास्त्रीय ज्योतिष नियमों पर आधारित है।' },
    },
    {
      question: { en: 'Which activities can I find Muhurta for?', hi: 'किन गतिविधियों के लिए मुहूर्त खोज सकते हैं?' },
      answer: { en: 'We support Muhurta for 20 activities including: Marriage, Griha Pravesh (housewarming), Business Launch, Vehicle Purchase, Travel, Medical Procedure, Education Start, Name Ceremony, Upanayana (sacred thread), Property Purchase, Engagement, Job Start, Gold Purchase, Annaprashan (first feeding), and more.', hi: 'हम 20 गतिविधियों के लिए मुहूर्त का समर्थन करते हैं: विवाह, गृह प्रवेश, व्यापार शुभारंभ, वाहन खरीद, यात्रा, और बहुत कुछ।' },
    },
  ],
  '/rahu-kaal': [
    {
      question: { en: 'What is Rahu Kaal?', hi: 'राहु काल क्या है?' },
      answer: { en: 'Rahu Kaal is an inauspicious period of approximately 90 minutes that occurs every day, ruled by the shadow planet Rahu. It is calculated by dividing the day (sunrise to sunset) into 8 equal parts, with a specific segment assigned to each day of the week. Activities started during Rahu Kaal are believed to face obstacles or delays.', hi: 'राहु काल लगभग 90 मिनट की एक अशुभ अवधि है जो प्रतिदिन आती है, छाया ग्रह राहु द्वारा शासित। इस दौरान शुरू किए गए कार्यों में बाधा या देरी मानी जाती है।' },
    },
    {
      question: { en: 'Does Rahu Kaal timing change by city?', hi: 'क्या राहु काल का समय शहर के अनुसार बदलता है?' },
      answer: { en: 'Yes. Rahu Kaal is calculated from local sunrise and sunset times, which vary by geographic location and time of year. A city further east will have earlier sunrise and therefore earlier Rahu Kaal. Always check Rahu Kaal for your specific city.', hi: 'हाँ। राहु काल स्थानीय सूर्योदय और सूर्यास्त से गणना किया जाता है, जो भौगोलिक स्थान और वर्ष के समय के अनुसार भिन्न होता है।' },
    },
    {
      question: { en: 'Is Rahu Kaal the same as Rahu Kalam?', hi: 'क्या राहु काल और राहु कालम एक ही हैं?' },
      answer: { en: 'Yes, Rahu Kaal and Rahu Kalam are the same concept with different regional spellings. "Rahu Kaal" is commonly used in North India, while "Rahu Kalam" is the South Indian (Tamil/Telugu) spelling. The calculation method and significance are identical.', hi: 'हाँ, राहु काल और राहु कालम एक ही अवधारणा है। "राहु काल" उत्तर भारत में और "राहु कालम" दक्षिण भारत में प्रयोग होता है।' },
    },
  ],
  '/choghadiya': [
    {
      question: { en: 'What is Choghadiya?', hi: 'चौघड़िया क्या है?' },
      answer: { en: 'Choghadiya (also Chaughadia) divides each day and night into 8 slots of approximately 90 minutes each, categorized into 7 types by auspiciousness. "Cho" means four and "ghadi" means a period of 24 minutes — so Choghadiya literally means "four ghadis" (96 minutes). It is widely used in Gujarat and Western India for timing daily activities.', hi: 'चौघड़िया प्रत्येक दिन और रात को लगभग 90 मिनट के 8 खंडों में विभाजित करता है, शुभता के अनुसार 7 प्रकारों में वर्गीकृत। यह गुजरात और पश्चिमी भारत में व्यापक रूप से उपयोग किया जाता है।' },
    },
    {
      question: { en: 'Which Choghadiya is best for travel?', hi: 'यात्रा के लिए कौन सा चौघड़िया सबसे अच्छा है?' },
      answer: { en: 'For travel, Labh (Gain), Amrit (Nectar), and Shubh (Auspicious) Choghadiyas are recommended. Char (Moderate) is acceptable for short trips. Avoid Rog (Disease), Kaal (Death), and Udveg (Anxiety) for any travel. Amrit is the best overall, as it is considered the most auspicious for all activities.', hi: 'यात्रा के लिए लाभ, अमृत और शुभ चौघड़िया की सिफारिश की जाती है। रोग, काल और उद्वेग से बचें।' },
    },
    {
      question: { en: 'How many Choghadiyas are there in a day?', hi: 'एक दिन में कितने चौघड़िया होते हैं?' },
      answer: { en: 'There are 16 Choghadiyas in a full day — 8 during daytime (sunrise to sunset) and 8 during nighttime (sunset to next sunrise). The 7 types cycle in a fixed order: Udveg, Char, Labh, Amrit, Kaal, Shubh, Rog. The starting type depends on the day of the week.', hi: 'एक पूरे दिन में 16 चौघड़िया होते हैं — दिन में 8 (सूर्योदय से सूर्यास्त) और रात में 8 (सूर्यास्त से अगले सूर्योदय)।' },
    },
  ],
};

/**
 * Generate FAQPage JSON-LD for a given route and locale.
 * Returns null if no FAQs exist for the route.
 */
export function generateFAQLD(
  route: string,
  locale: string,
): Record<string, unknown> | null {
  const faqs = FAQ_DATA[route];
  if (!faqs || faqs.length === 0) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question[locale] || faq.question.en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer[locale] || faq.answer.en,
      },
    })),
  };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/__tests__/faq-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/faq-data.ts src/lib/__tests__/faq-data.test.ts
git commit -m "feat(seo): add FAQ data for 11 routes with generateFAQLD helper"
```

---

## Task 8: Inject FAQ JSON-LD into Existing Pages

**Files:**
- Modify: ~9 existing layout files to inject FAQ JSON-LD

- [ ] **Step 1: Add FAQ JSON-LD to panchang layout**

In `src/app/[locale]/panchang/layout.tsx`, import and inject:

```tsx
import { generateFAQLD } from '@/lib/seo/faq-data';

// Inside generateMetadata or as a script tag in the layout component:
// Add <script type="application/ld+json">{JSON.stringify(generateFAQLD('/panchang', locale))}</script>
```

The exact injection pattern depends on whether the layout is a server component (can directly embed) or client component (use `<Script>` from next/script). Follow the existing pattern from contribution pages.

- [ ] **Step 2: Repeat for remaining pages**

Add FAQ JSON-LD injection to these layout files:
- `src/app/[locale]/panchang/tithi/layout.tsx` (or page if no layout)
- `src/app/[locale]/panchang/nakshatra/layout.tsx`
- `src/app/[locale]/panchang/yoga/layout.tsx`
- `src/app/[locale]/panchang/rashi/layout.tsx`
- `src/app/[locale]/matching/layout.tsx`
- `src/app/[locale]/horoscope/layout.tsx`
- `src/app/[locale]/kundali/layout.tsx`
- `src/app/[locale]/muhurta-ai/layout.tsx`

If a layout doesn't exist for that route, create one following the nakshatra/[id]/layout.tsx pattern (passthrough with metadata).

- [ ] **Step 3: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/panchang/layout.tsx src/app/[locale]/panchang/tithi/ src/app/[locale]/panchang/nakshatra/layout.tsx src/app/[locale]/panchang/yoga/ src/app/[locale]/panchang/rashi/layout.tsx src/app/[locale]/matching/layout.tsx src/app/[locale]/horoscope/layout.tsx src/app/[locale]/kundali/layout.tsx src/app/[locale]/muhurta-ai/layout.tsx
git commit -m "feat(seo): inject FAQ JSON-LD into 11 existing pages"
```

---

## Task 9: Yearly Date Listing Pages

**Files:**
- Create: `src/app/[locale]/dates/[category]/page.tsx`
- Create: `src/app/[locale]/dates/[category]/layout.tsx`
- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/lib/seo/structured-data.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/layout/Navbar.tsx`

- [ ] **Step 1: Add PAGE_META entries**

Add entries to `PAGE_META` for each category:

```ts
'/dates/ekadashi': {
  title: { en: 'Ekadashi 2026 — All Dates, Timings & Parana Schedule', hi: 'एकादशी 2026 — सभी तिथियाँ, समय और पारण', sa: 'एकादशी 2026 — सर्वतिथयः समयश्च' },
  description: { en: 'Complete list of all Ekadashi dates in 2026 with exact timings, Parana schedule, and fasting guidelines.', hi: '2026 की सभी एकादशी तिथियों की पूरी सूची, सटीक समय और पारण अनुसूची।', sa: '2026 वर्षस्य सर्वएकादशीतिथिसूची।' },
  keywords: ['ekadashi 2026', 'ekadashi dates', 'ekadashi vrat dates', 'ekadashi fasting'],
},
'/dates/purnima': { /* similar for purnima */ },
'/dates/amavasya': { /* similar for amavasya */ },
'/dates/pradosham': { /* similar for pradosham */ },
'/dates/chaturthi': { /* similar for chaturthi */ },
```

- [ ] **Step 2: Add display names for breadcrumbs**

In `src/lib/seo/structured-data.ts`, add:
```ts
'dates': 'Dates',
'ekadashi': 'Ekadashi',
'purnima': 'Purnima',
'amavasya': 'Amavasya',
'pradosham': 'Pradosham',
'chaturthi': 'Chaturthi',
```

- [ ] **Step 3: Create layout.tsx**

```tsx
// src/app/[locale]/dates/[category]/layout.tsx
import type { Metadata } from 'next';
import { getPageMetadata } from '@/lib/seo/metadata';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';
const VALID_CATEGORIES = ['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}): Promise<Metadata> {
  const { locale, category } = await params;
  if (!VALID_CATEGORIES.includes(category)) return {};
  const route = `/dates/${category}`;
  const meta = getPageMetadata(route, locale);
  return {
    ...meta,
    alternates: {
      canonical: `${BASE_URL}/${locale}${route}`,
      languages: Object.fromEntries(
        ['en', 'hi', 'sa'].map(l => [l, `${BASE_URL}/${l}${route}`])
      ),
    },
  };
}

export function generateStaticParams() {
  return VALID_CATEGORIES.map(category => ({ category }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 4: Create page.tsx**

```tsx
// src/app/[locale]/dates/[category]/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { generateYearlyTithiTable } from '@/lib/calendar/tithi-table';
import { tl } from '@/lib/utils/trilingual';
import { generateFAQLD } from '@/lib/seo/faq-data';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';

const CATEGORY_CONFIG: Record<string, { tithiNumbers: number[]; pakshas?: ('shukla' | 'krishna')[] }> = {
  ekadashi: { tithiNumbers: [11] },
  purnima: { tithiNumbers: [15] },
  amavasya: { tithiNumbers: [30] },
  pradosham: { tithiNumbers: [13] },
  chaturthi: { tithiNumbers: [4] },
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
  ekadashi: { en: 'Ekadashi', hi: 'एकादशी', sa: 'एकादशी' },
  purnima: { en: 'Purnima', hi: 'पूर्णिमा', sa: 'पूर्णिमा' },
  amavasya: { en: 'Amavasya', hi: 'अमावस्या', sa: 'अमावस्या' },
  pradosham: { en: 'Pradosham', hi: 'प्रदोषम्', sa: 'प्रदोषम्' },
  chaturthi: { en: 'Chaturthi', hi: 'चतुर्थी', sa: 'चतुर्थी' },
};

// Page renders:
// 1. Back link + H1 ("{Category} {Year} — Complete Dates & Timings")
// 2. Year navigator (<< 2025 | 2026 | 2027 >>)
// 3. Summary stat ("26 Ekadashis in 2026, next one is May 2")
// 4. Monthly sections with anchor links (Jan through Dec)
// 5. Table per month: Date | Day | Name | Start-End | Nakshatra | Vrat/Festival link | Puja link
// 6. For ekadashi: add Parana time column
// 7. FAQ accordion with JSON-LD
// 8. Cross links to calendar page, puja vidhis
// Implementation uses generateYearlyTithiTable() filtered by category config.

export default function DatesPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const category = params.category as string;
  const config = CATEGORY_CONFIG[category];

  if (!config) {
    return <div className="min-h-screen flex items-center justify-center text-text-secondary">Category not found</div>;
  }

  const [year, setYear] = useState(new Date().getFullYear());

  // Compute tithi table for Delhi (default reference city)
  // Filter entries matching the category's tithi numbers
  const entries = useMemo(() => {
    const table = generateYearlyTithiTable({ year, lat: 28.6139, lon: 77.209, timezone: 'Asia/Kolkata' });
    return table.entries.filter(e =>
      config.tithiNumbers.includes(e.number) &&
      (!config.pakshas || config.pakshas.includes(e.paksha))
    );
  }, [year, config]);

  // Group by month
  const byMonth = useMemo(() => {
    const groups: Record<number, typeof entries> = {};
    entries.forEach(e => {
      const m = parseInt(e.sunriseDate.split('-')[1], 10);
      (groups[m] ??= []).push(e);
    });
    return groups;
  }, [entries]);

  const label = CATEGORY_LABELS[category]?.[locale] || CATEGORY_LABELS[category]?.en || category;

  return (
    // ... Full JSX: year nav, monthly tables, FAQ section, cross-links
    // Follow existing page patterns (motion.div, GoldDivider, headingFont)
  );
}
```

- [ ] **Step 5: Add to sitemap and navbar**

In `src/app/sitemap.ts`, add:
```ts
'/dates/ekadashi', '/dates/purnima', '/dates/amavasya', '/dates/pradosham', '/dates/chaturthi',
```

In `src/components/layout/Navbar.tsx`, add to Calendars dropdown:
```ts
{ href: '/dates/ekadashi', label: locale === 'hi' ? 'एकादशी तिथियाँ' : 'Ekadashi Dates' },
{ href: '/dates/purnima', label: locale === 'hi' ? 'पूर्णिमा तिथियाँ' : 'Purnima Dates' },
```

- [ ] **Step 6: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/app/[locale]/dates/ src/lib/seo/metadata.ts src/lib/seo/structured-data.ts src/app/sitemap.ts src/components/layout/Navbar.tsx
git commit -m "feat(seo): add yearly date listing pages for ekadashi, purnima, amavasya, pradosham, chaturthi"
```

---

## Task 10: Multi-City Daily Articles

**Files:**
- Modify: `src/lib/horoscope/daily-article.ts` (accept city param)
- Create: `src/app/[locale]/daily/[date]/[city]/page.tsx`
- Create: `src/app/[locale]/daily/[date]/[city]/layout.tsx`
- Modify: `src/app/[locale]/daily/[date]/page.tsx` (add city links)
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Modify generateDailyArticle to accept city**

In `src/lib/horoscope/daily-article.ts`, change the function signature:

```ts
interface CityConfig {
  name: string;
  nameHi: string;
  lat: number;
  lng: number;
  tzOffset: number;
  timezone: string;
}

const DELHI_DEFAULT: CityConfig = {
  name: 'Delhi', nameHi: 'दिल्ली',
  lat: 28.6139, lng: 77.2090, tzOffset: 5.5, timezone: 'Asia/Kolkata',
};

export function generateDailyArticle(date: Date, city?: CityConfig): DailyArticle {
  const c = city || DELHI_DEFAULT;
  // Use c.lat, c.lng, c.tzOffset instead of hardcoded Delhi values
  // Add city-specific narrative: "In {c.name}, with sunset at {time}..."
  // ...
}
```

This is a backward-compatible change — existing callers without city param still get Delhi.

- [ ] **Step 2: Create city daily article layout**

```tsx
// src/app/[locale]/daily/[date]/[city]/layout.tsx
import type { Metadata } from 'next';
import { getCityBySlug } from '@/lib/constants/cities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; date: string; city: string }>;
}): Promise<Metadata> {
  const { locale, date, city } = await params;
  const cityData = getCityBySlug(city);
  const cityName = cityData?.name[locale === 'hi' ? 'hi' : 'en'] || city;

  return {
    title: locale === 'hi'
      ? `${cityName} पंचांग ${date} — तिथि, नक्षत्र, राहु काल`
      : `${cityName} Panchang ${date} — Tithi, Nakshatra, Rahu Kaal`,
    alternates: {
      canonical: `${BASE_URL}/${locale}/daily/${date}/${city}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 3: Create city daily article page**

The page follows the same pattern as `/daily/[date]/page.tsx` but:
- Resolves city from `params.city` via `getCityBySlug()`
- Passes city config to `generateDailyArticle(date, cityConfig)`
- Adds `contentLocation` to Article JSON-LD
- Shows "View for other cities" links at bottom

- [ ] **Step 4: Add city links to existing daily page**

In `src/app/[locale]/daily/[date]/page.tsx`, add a "View for other cities" section after the article content:

```tsx
const DAILY_CITIES = ['mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
  'pune', 'ahmedabad', 'jaipur', 'lucknow', 'varanasi'];

// Render:
<div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-3">
  {DAILY_CITIES.map(slug => {
    const city = getCityBySlug(slug);
    return city ? (
      <Link key={slug} href={`/daily/${dateStr}/${slug}`} className="...">
        {city.name[locale === 'hi' ? 'hi' : 'en']}
      </Link>
    ) : null;
  })}
</div>
```

- [ ] **Step 5: Add to sitemap**

In `src/app/sitemap.ts`, add daily city entries:

```ts
const dailyCities = ['mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
  'pune', 'ahmedabad', 'jaipur', 'lucknow', 'varanasi'];

// Generate: last 30 days + next 7 days × 10 cities × all locales
// (dynamic, same pattern as existing daily date entries)
```

- [ ] **Step 6: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/horoscope/daily-article.ts src/app/[locale]/daily/[date]/[city]/ src/app/[locale]/daily/[date]/page.tsx src/app/sitemap.ts
git commit -m "feat(seo): add multi-city daily articles for 10 cities"
```

---

## Task 11: Per-Rashi Section in Daily Articles

**Files:**
- Modify: `src/app/[locale]/daily/[date]/page.tsx`
- Modify: `src/app/[locale]/daily/[date]/[city]/page.tsx`

- [ ] **Step 1: Add per-rashi horoscope section to daily article page**

In both `/daily/[date]/page.tsx` and `/daily/[date]/[city]/page.tsx`, add after the main article content:

```tsx
import { generateDailyHoroscope } from '@/lib/horoscope/daily-engine';
import { RASHIS } from '@/lib/constants/rashis';
import { RashiIconById } from '@/components/icons/RashiIcons';

// Compute all 12 horoscopes
const horoscopes = RASHIS.map(r =>
  generateDailyHoroscope({ moonSign: r.id, date: dateStr })
);

// Render "Today's Horoscope by Rashi" section:
// 12 expandable cards in a 2-col or 3-col grid
// Each card: RashiIconById, rashi name (tl'd), overall score as stars/bar,
//   one-line insight, lucky color/number
// Click to expand: career/love/health/finance/spirituality breakdown
// Each card links to /panchang/rashi/{slug}
```

- [ ] **Step 2: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add src/app/[locale]/daily/[date]/page.tsx src/app/[locale]/daily/[date]/[city]/page.tsx
git commit -m "feat(seo): add per-rashi horoscope section to daily articles"
```

---

## Task 12: Rashi Compatibility Content Constant

**Files:**
- Create: `src/lib/constants/rashi-compatibility.ts`
- Test: `src/lib/__tests__/rashi-compatibility.test.ts`

- [ ] **Step 1: Write tests**

```ts
// src/lib/__tests__/rashi-compatibility.test.ts
import { describe, it, expect } from 'vitest';
import { RASHI_PAIR_CONTENT, getPairContent } from '@/lib/constants/rashi-compatibility';

describe('RASHI_PAIR_CONTENT', () => {
  it('has exactly 78 entries', () => {
    expect(RASHI_PAIR_CONTENT).toHaveLength(78);
  });

  it('each pair has rashi1 <= rashi2 (canonical ordering)', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.rashi1).toBeLessThanOrEqual(p.rashi2);
    });
  });

  it('each pair has en content for all narrative fields', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.summary.en).toBeTruthy();
      expect(p.temperament.en).toBeTruthy();
      expect(p.communication.en).toBeTruthy();
      expect(p.romance.en).toBeTruthy();
      expect(p.career.en).toBeTruthy();
      expect(p.challenges.en).toBeTruthy();
      expect(p.remedies.en).toBeTruthy();
    });
  });

  it('score is between 0 and 36', () => {
    RASHI_PAIR_CONTENT.forEach(p => {
      expect(p.score).toBeGreaterThanOrEqual(0);
      expect(p.score).toBeLessThanOrEqual(36);
    });
  });
});

describe('getPairContent', () => {
  it('returns content for valid pair (either order)', () => {
    const p1 = getPairContent(1, 2);
    const p2 = getPairContent(2, 1);
    expect(p1).toBeDefined();
    expect(p1).toEqual(p2);
  });

  it('returns undefined for invalid IDs', () => {
    expect(getPairContent(0, 13)).toBeUndefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/rashi-compatibility.test.ts`
Expected: FAIL

- [ ] **Step 3: Create rashi-compatibility.ts**

This file generates 78 pair entries from astrological rules. Each pair's content is derived from:
- **Element compatibility**: fire+fire, fire+earth, fire+air, fire+water, etc. (6 combos)
- **Lord friendship**: traditional Graha Maitri table (planet friendship/enmity)
- **House relationship**: count signs apart (1=self, 2=wealth, 3=courage, 4=comfort, 5=love, 6=conflict, 7=partnership, 8=transformation, 9=dharma, 10=karma, 11=gain, 12=loss)
- **Ashta Kuta score**: computed from representative MatchInputs (Moon at 15° of each rashi → nakshatra/rashi derived)

```ts
// src/lib/constants/rashi-compatibility.ts
import { RASHIS } from './rashis';
import type { MatchInput } from '@/lib/matching/ashta-kuta';

type ML = Record<string, string>;

export interface RashiPairContent {
  rashi1: number;
  rashi2: number;
  score: number;
  oneLiner: ML;  // tooltip text for heatmap
  summary: ML;
  temperament: ML;
  communication: ML;
  romance: ML;
  career: ML;
  challenges: ML;
  remedies: ML;
}

// Helper to get nakshatra ID from rashi midpoint (15° into sign)
function nakshatraFromRashi(rashiId: number): number {
  const deg = (rashiId - 1) * 30 + 15; // midpoint
  return Math.floor(deg / (360 / 27)) + 1;
}

// Element of each rashi
const ELEMENTS = ['fire', 'earth', 'air', 'water'] as const;
function getElement(rashiId: number): typeof ELEMENTS[number] {
  return ELEMENTS[(rashiId - 1) % 4];
}

// Generate all 78 pairs — the implementing agent must fill in genuine
// astrological content for each element combination × lord relationship.
// This is the core content authoring task of Tier 3.
export const RASHI_PAIR_CONTENT: RashiPairContent[] = generateAllPairs();

function generateAllPairs(): RashiPairContent[] {
  const pairs: RashiPairContent[] = [];
  for (let i = 1; i <= 12; i++) {
    for (let j = i; j <= 12; j++) {
      pairs.push(generatePair(i, j));
    }
  }
  return pairs;
}

function generatePair(r1: number, r2: number): RashiPairContent {
  // Compute element combo, lord friendship, house distance
  // Generate unique narrative from these astrological factors
  // Each pair gets genuinely different content because the underlying
  // astrology is different.
  // ...
  return { rashi1: r1, rashi2: r2, score: 0, /* ... */ } as RashiPairContent;
}

export function getPairContent(id1: number, id2: number): RashiPairContent | undefined {
  const lo = Math.min(id1, id2);
  const hi = Math.max(id1, id2);
  return RASHI_PAIR_CONTENT.find(p => p.rashi1 === lo && p.rashi2 === hi);
}
```

**CRITICAL:** The `generatePair` function must produce unique en + hi content for each pair based on real astrological rules. The implementing agent should build the content generation from:
1. Element compatibility matrix (4x4 = 10 unique combos, each has distinct narrative)
2. Lord relationship from traditional table (Sun-Moon=friend, Sun-Saturn=enemy, etc.)
3. House distance (signs apart modulo 12) — each distance has a meaning
4. These three factors combined produce unique text for each of the 78 pairs

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/__tests__/rashi-compatibility.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/rashi-compatibility.ts src/lib/__tests__/rashi-compatibility.test.ts
git commit -m "feat(seo): add 78 rashi pair compatibility content from astrological rules"
```

---

## Task 13: Compatibility Heatmap Page

**Files:**
- Create: `src/app/[locale]/matching/compatibility/page.tsx`
- Create: `src/app/[locale]/matching/compatibility/layout.tsx`
- Modify: `src/lib/seo/metadata.ts`
- Modify: `src/lib/seo/structured-data.ts`

- [ ] **Step 1: Add PAGE_META**

```ts
'/matching/compatibility': {
  title: {
    en: 'Vedic Rashi Compatibility Chart — All 12 Signs',
    hi: 'वैदिक राशि संगतता चार्ट — सभी 12 राशियाँ',
    sa: 'वैदिकराशिसंगततासारिणी — द्वादशराशयः',
  },
  description: {
    en: 'Interactive 12×12 Vedic compatibility heatmap. Check rashi-to-rashi compatibility scores based on Ashta Kuta matching. Click any pair for detailed analysis.',
    hi: '12×12 वैदिक संगतता हीटमैप। अष्ट कूट मिलान पर आधारित राशि संगतता स्कोर जानें।',
    sa: '12×12 वैदिकसंगततासारिणी। अष्टकूटमिलानाधारितराशिसंगतताङ्कं जानीयात्।',
  },
  keywords: ['rashi compatibility chart', 'vedic zodiac compatibility', 'ashta kuta chart'],
},
```

- [ ] **Step 2: Add display name**

```ts
'compatibility': 'Compatibility Chart',
```

- [ ] **Step 3: Create layout.tsx**

Standard metadata layout (same pattern as other pages).

- [ ] **Step 4: Create heatmap page**

```tsx
// src/app/[locale]/matching/compatibility/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { RASHI_PAIR_CONTENT, getPairContent } from '@/lib/constants/rashi-compatibility';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';

// Color function: score 0-36 → color
function scoreToColor(score: number): string {
  const pct = score / 36;
  if (pct < 0.35) return 'bg-red-500/30 text-red-300';
  if (pct < 0.5) return 'bg-amber-500/25 text-amber-300';
  if (pct < 0.7) return 'bg-gold-primary/25 text-gold-light';
  return 'bg-emerald-500/25 text-emerald-300';
}

export default function CompatibilityHeatmapPage() {
  const locale = useLocale() as Locale;
  const [hoveredPair, setHoveredPair] = useState<{ r1: number; r2: number } | null>(null);

  const isDevanagari = locale === 'hi' || String(locale) === 'sa';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  // Mobile: dropdown picker UI
  const [mobileR1, setMobileR1] = useState(1);
  const [mobileR2, setMobileR2] = useState(2);
  const mobilePair = getPairContent(mobileR1, mobileR2);

  // Page renders:
  // Desktop: 12×12 CSS grid
  //   - Row 0 = column headers (rashi names, rotated 45°)
  //   - Col 0 = row headers (rashi names)
  //   - Each cell: colored by score, shows score number
  //   - Hover: tooltip with oneLiner from pair content
  //   - Click: navigate to /matching/{slug1}-and-{slug2}
  // Mobile (below md breakpoint):
  //   - Two dropdown selects: "Select Rashi 1" and "Select Rashi 2"
  //   - Shows result card with score, summary, and link to detail page
  // Bottom: BreadcrumbList JSON-LD, link to /matching tool

  return (
    // ... Full JSX
  );
}
```

- [ ] **Step 5: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/app/[locale]/matching/compatibility/ src/lib/seo/metadata.ts src/lib/seo/structured-data.ts
git commit -m "feat(seo): add 12×12 rashi compatibility heatmap page"
```

---

## Task 14: Pair Detail Pages (78 pages)

**Files:**
- Create: `src/app/[locale]/matching/[pair]/page.tsx`
- Create: `src/app/[locale]/matching/[pair]/layout.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Create layout.tsx with redirect logic**

```tsx
// src/app/[locale]/matching/[pair]/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { RASHIS } from '@/lib/constants/rashis';
import { canonicalPairSlug, getAllPairSlugs } from '@/lib/constants/rashi-slugs';
import { getPairContent } from '@/lib/constants/rashi-compatibility';
import { tl } from '@/lib/utils/trilingual';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com';

export async function generateStaticParams() {
  return getAllPairSlugs().map(pair => ({ pair }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; pair: string }>;
}): Promise<Metadata> {
  const { locale, pair } = await params;
  const parts = pair.split('-and-');
  if (parts.length !== 2) return {};

  const r1 = RASHIS.find(r => r.slug === parts[0]);
  const r2 = RASHIS.find(r => r.slug === parts[1]);
  if (!r1 || !r2) return {};

  // Redirect non-canonical order
  const canonical = canonicalPairSlug(parts[0], parts[1]);
  if (pair !== canonical) {
    redirect(`/${locale}/matching/${canonical}`);
  }

  const name1 = tl(r1.name, locale);
  const name2 = tl(r2.name, locale);

  return {
    title: locale === 'hi'
      ? `${name1} और ${name2} संगतता — वैदिक ज्योतिष विश्लेषण`
      : `${name1} and ${name2} Compatibility — Vedic Astrology Analysis`,
    description: locale === 'hi'
      ? `${name1} और ${name2} राशि की वैदिक संगतता। अष्ट कूट स्कोर, स्वभाव, प्रेम, करियर संगतता।`
      : `${name1} and ${name2} Vedic compatibility analysis. Ashta Kuta score, temperament, love, career compatibility.`,
    alternates: {
      canonical: `${BASE_URL}/${locale}/matching/${canonical}`,
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create pair detail page**

```tsx
// src/app/[locale]/matching/[pair]/page.tsx
'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft, Heart, Briefcase, MessageCircle, AlertTriangle, Sparkles } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { getPairContent } from '@/lib/constants/rashi-compatibility';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { tl } from '@/lib/utils/trilingual';
import { generateBreadcrumbLD } from '@/lib/seo/structured-data';
import type { Locale } from '@/types/panchang';

// Page renders:
// 1. Back link to /matching/compatibility
// 2. Hero: both rashi icons side by side + names + score badge
// 3. Score visualization (circular gauge or bar, gold gradient)
// 4. Summary section from pairContent.summary
// 5. Sections: Temperament, Communication, Romance, Career, Challenges, Remedies
//    Each with icon + heading + content from pairContent
// 6. "Try Full Matching" CTA linking to /matching
// 7. Links to both rashi detail pages
// 8. BreadcrumbList + FAQPage JSON-LD

export default function PairDetailPage() {
  const params = useParams();
  const locale = useLocale() as Locale;
  const pair = params.pair as string;
  const parts = pair.split('-and-');

  const r1 = getRashiBySlug(parts[0]);
  const r2 = getRashiBySlug(parts[1]);

  if (!r1 || !r2) {
    return (
      <div className="min-h-screen flex items-center justify-center text-text-secondary">
        <Link href="/matching/compatibility">← Back to Compatibility Chart</Link>
      </div>
    );
  }

  const pairContent = getPairContent(r1.id, r2.id);
  if (!pairContent) {
    return <div className="min-h-screen flex items-center justify-center text-text-secondary">Pair not found</div>;
  }

  const isDevanagari = locale === 'hi' || String(locale) === 'sa';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const sections = [
    { icon: Heart, title: locale === 'hi' ? 'स्वभाव' : 'Temperament', content: pairContent.temperament },
    { icon: MessageCircle, title: locale === 'hi' ? 'संवाद' : 'Communication', content: pairContent.communication },
    { icon: Sparkles, title: locale === 'hi' ? 'प्रेम' : 'Romance', content: pairContent.romance },
    { icon: Briefcase, title: locale === 'hi' ? 'करियर साझेदारी' : 'Career Partnership', content: pairContent.career },
    { icon: AlertTriangle, title: locale === 'hi' ? 'चुनौतियाँ' : 'Challenges', content: pairContent.challenges },
  ];

  return (
    // ... Full JSX following project patterns
  );
}
```

- [ ] **Step 3: Add pair pages to sitemap**

In `src/app/sitemap.ts`:

```ts
import { getAllPairSlugs } from '@/lib/constants/rashi-slugs';

// In sitemap function, add:
...getAllPairSlugs().flatMap(pair =>
  locales.map(locale => ({
    url: `${BASE_URL}/${locale}/matching/${pair}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))
),
```

- [ ] **Step 4: Add internal links from rashi detail pages**

In `src/app/[locale]/panchang/rashi/[id]/page.tsx`, the "Compatible Rashis" section should link to pair pages:

```tsx
{detail.compatibleRashis.map(compatId => {
  const compat = RASHIS[compatId - 1];
  const pairSlug = rashi.id <= compatId
    ? `${rashi.slug}-and-${compat.slug}`
    : `${compat.slug}-and-${rashi.slug}`;
  return (
    <Link key={compatId} href={`/matching/${pairSlug}`}>
      {tl(compat.name, locale)}
    </Link>
  );
})}
```

- [ ] **Step 5: Add heatmap link from matching page**

In `src/app/[locale]/matching/page.tsx`, add a link near the top:

```tsx
<Link href="/matching/compatibility" className="text-gold-primary hover:text-gold-light">
  {locale === 'hi' ? 'राशि संगतता चार्ट देखें →' : 'View Rashi Compatibility Chart →'}
</Link>
```

- [ ] **Step 6: Run build**

Run: `npx next build`
Expected: PASS

- [ ] **Step 7: Run full test suite**

Run: `npx vitest run`
Expected: All tests PASS

- [ ] **Step 8: Commit**

```bash
git add src/app/[locale]/matching/[pair]/ src/app/sitemap.ts src/app/[locale]/panchang/rashi/[id]/page.tsx src/app/[locale]/matching/page.tsx
git commit -m "feat(seo): add 78 rashi compatibility pair pages with heatmap linking"
```

---

## Task 15: Final Integration Test & Verification

**Files:**
- Create: `src/lib/__tests__/seo-content-expansion.test.ts`

- [ ] **Step 1: Write integration tests**

```ts
// src/lib/__tests__/seo-content-expansion.test.ts
import { describe, it, expect } from 'vitest';
import { RASHI_SLUGS, getAllPairSlugs, canonicalPairSlug, getDefaultCityForLocale } from '@/lib/constants/rashi-slugs';
import { RASHI_DETAILS } from '@/lib/constants/rashi-details';
import { RASHI_PAIR_CONTENT } from '@/lib/constants/rashi-compatibility';
import { FAQ_DATA, generateFAQLD } from '@/lib/seo/faq-data';
import { PAGE_META } from '@/lib/seo/metadata';
import { RASHIS } from '@/lib/constants/rashis';

describe('SEO Content Expansion Integration', () => {
  it('all rashi slugs have PAGE_META entries', () => {
    RASHIS.forEach(r => {
      expect(PAGE_META[`/panchang/rashi/${r.slug}`]).toBeDefined();
    });
  });

  it('rahu-kaal and choghadiya have PAGE_META entries', () => {
    expect(PAGE_META['/rahu-kaal']).toBeDefined();
    expect(PAGE_META['/choghadiya']).toBeDefined();
  });

  it('date categories have PAGE_META entries', () => {
    ['ekadashi', 'purnima', 'amavasya', 'pradosham', 'chaturthi'].forEach(cat => {
      expect(PAGE_META[`/dates/${cat}`]).toBeDefined();
    });
  });

  it('compatibility heatmap has PAGE_META entry', () => {
    expect(PAGE_META['/matching/compatibility']).toBeDefined();
  });

  it('all 78 pairs exist', () => {
    expect(getAllPairSlugs()).toHaveLength(78);
  });

  it('canonical pair slug normalizes order', () => {
    expect(canonicalPairSlug('vrishabh', 'mesh')).toBe('mesh-and-vrishabh');
    expect(canonicalPairSlug('mesh', 'vrishabh')).toBe('mesh-and-vrishabh');
  });

  it('RASHI_DETAILS count matches RASHIS count', () => {
    expect(RASHI_DETAILS).toHaveLength(RASHIS.length);
  });

  it('FAQ routes all have generateFAQLD output', () => {
    Object.keys(FAQ_DATA).forEach(route => {
      const ld = generateFAQLD(route, 'en');
      expect(ld).toBeDefined();
      expect(ld!['@type']).toBe('FAQPage');
    });
  });

  it('locale city defaults cover all supported locales', () => {
    ['en', 'hi', 'sa', 'ta', 'te', 'bn', 'kn'].forEach(locale => {
      expect(getDefaultCityForLocale(locale)).toBeDefined();
    });
  });
});
```

- [ ] **Step 2: Run all tests**

Run: `npx vitest run`
Expected: All PASS

- [ ] **Step 3: Run production build**

Run: `npx next build`
Expected: 0 errors. Page count should increase by ~100+ (new pages × locales).

- [ ] **Step 4: Commit**

```bash
git add src/lib/__tests__/seo-content-expansion.test.ts
git commit -m "test: add integration tests for SEO content expansion"
```

- [ ] **Step 5: Final push**

Run: `npx vitest run && npx next build`
Expected: All PASS, 0 build errors

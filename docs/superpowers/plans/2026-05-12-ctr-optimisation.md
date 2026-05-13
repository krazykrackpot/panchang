# CTR Optimisation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Raise Google Search CTR from 0.6% to 2%+ by fixing festival cannibalisation, rewriting titles/descriptions, fixing stale dates, and adding structured data.

**Architecture:** Five phases — (1) festival canonical consolidation + stale muhurta date fix, (2) title/description rewrites across all page types, (3) structured data additions, (4) dynamic server-side metadata for daily pages, (5) verification. Each phase produces a standalone commit.

**Tech Stack:** Next.js metadata API, JSON-LD structured data, ISR revalidation, server-side computation

**Spec:** `docs/superpowers/specs/2026-05-12-ctr-optimisation-design.md`

---

## Configuration

All title/description formulas are defined as template functions in a single config file. To change any formula later, edit ONLY this file — no grep-and-replace across page files.

The config file is created in Task 1 and consumed by all subsequent tasks.

---

### Task 1: Create CTR Title/Description Config

**Files:**
- Create: `src/lib/seo/ctr-config.ts`

This file is the **single source of truth** for all title and description formulas. Every page type has a formatter function. To change a formula, edit this file only.

- [ ] **Step 1: Create the config file**

```typescript
// src/lib/seo/ctr-config.ts
//
// CTR Optimisation — Title & Description formulas
// Spec: docs/superpowers/specs/2026-05-12-ctr-optimisation-design.md
//
// CONFIGURABLE: Edit these functions to change SERP appearance.
// All page types consume these — no formulas are hardcoded in page files.

/** Short date: "May 8" */
export function fmtShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}

/** Long date: "May 8, 2027" */
export function fmtLong(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

/** Day of week: "Saturday" */
export function fmtDay(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' });
}

/** Hindi short date: "8 मई" */
export function fmtShortHi(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('hi-IN', { day: 'numeric', month: 'long', timeZone: 'UTC' });
}

/** Hindi day of week: "शनिवार" */
export function fmtDayHi(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d))
    .toLocaleDateString('hi-IN', { weekday: 'long', timeZone: 'UTC' });
}

// ═══════════════════════════════════════════════
// FESTIVAL TITLES — Canonical (no city)
// ═══════════════════════════════════════════════

/** 
 * English: "Ganesh Chaturthi 2027 Date: Sep 4 (Saturday) – Puja Muhurat"
 * ≤60 chars target. Brand suffix added by root layout template.
 */
export function festivalCanonicalTitle(
  name: string, year: string, dateStr: string, hasMuhurat: boolean
): string {
  const short = fmtShort(dateStr);
  const day = fmtDay(dateStr);
  const suffix = hasMuhurat ? 'Puja Muhurat' : 'Date & Muhurat';
  return `${name} ${year} Date: ${short} (${day}) – ${suffix}`;
}

/**
 * Hindi: "गणेश चतुर्थी 2027 तिथि: 4 सितम्बर (शनिवार) – पूजा मुहूर्त"
 */
export function festivalCanonicalTitleHi(
  name: string, year: string, dateStr: string, hasMuhurat: boolean
): string {
  const short = fmtShortHi(dateStr);
  const day = fmtDayHi(dateStr);
  const suffix = hasMuhurat ? 'पूजा मुहूर्त' : 'तिथि व मुहूर्त';
  return `${name} ${year} तिथि: ${short} (${day}) – ${suffix}`;
}

/**
 * English description: "Ganesh Chaturthi is on Sep 4, 2027 (Saturday). Puja muhurat: 11:22 AM–1:52 PM. Complete vidhi, mantras, samagri. City-wise timings for 12+ cities."
 */
export function festivalCanonicalDesc(
  name: string, dateStr: string, pujaTime: string | null, cityCount: number
): string {
  const long = fmtLong(dateStr);
  const day = fmtDay(dateStr);
  const puja = pujaTime ? ` Puja muhurat: ${pujaTime}.` : '';
  return `${name} is on ${long} (${day}).${puja} Complete vidhi, mantras, samagri list. City-wise timings for ${cityCount}+ cities.`.slice(0, 155);
}

// ═══════════════════════════════════════════════
// MUHURTA TITLES
// ═══════════════════════════════════════════════

/**
 * English: "Travel Muhurat 2026: Next May 15 (Friday)"
 * Brand suffix added by root layout template.
 * 
 * IMPORTANT: `nextDateStr` must be the NEXT FUTURE date, not dates2026[0].
 */
export function muhurtaTitle(name: string, year: number, nextDateStr: string | null): string {
  if (!nextDateStr) return `${name} ${year} – Auspicious Dates`;
  const short = fmtShort(nextDateStr);
  const day = fmtDay(nextDateStr);
  return `${name} ${year}: Next ${short} (${day})`;
}

/**
 * Hindi: "यात्रा मुहूर्त 2026: अगला 15 मई (शुक्रवार)"
 */
export function muhurtaTitleHi(name: string, year: number, nextDateStr: string | null): string {
  if (!nextDateStr) return `${name} ${year} – शुभ तिथियाँ`;
  const short = fmtShortHi(nextDateStr);
  const day = fmtDayHi(nextDateStr);
  return `${name} ${year}: अगला ${short} (${day})`;
}

/**
 * Muhurta description: "Next travel muhurat: May 15, 2026 (Friday, Pushya nakshatra). 48+ auspicious dates for 2026. Free, updated daily."
 */
export function muhurtaDesc(
  nameEn: string, year: number, nextDateStr: string | null,
  nakshatra: string | null, totalDates: number
): string {
  if (!nextDateStr) {
    return `${nameEn} ${year}: ${totalDates}+ auspicious dates with nakshatra, tithi & planetary analysis. Free, no signup.`.slice(0, 155);
  }
  const long = fmtLong(nextDateStr);
  const day = fmtDay(nextDateStr);
  const nak = nakshatra ? `, ${nakshatra} nakshatra` : '';
  return `Next ${nameEn.toLowerCase()}: ${long} (${day}${nak}). ${totalDates}+ auspicious dates for ${year}. Free, updated daily.`.slice(0, 155);
}

// ═══════════════════════════════════════════════
// MUHURTA CITY-MONTH TITLES
// ═══════════════════════════════════════════════

/**
 * "Property Muhurat May 2026 Bangalore – 8 Dates"
 */
export function muhurtaCityTitle(
  name: string, month: string, year: number, city: string, dateCount: number
): string {
  return `${name} ${month} ${year} ${city} – ${dateCount} Dates`;
}

export function muhurtaCityDesc(
  nameEn: string, city: string, month: string, year: number,
  nextDateStr: string | null, dateCount: number
): string {
  if (!nextDateStr) {
    return `${dateCount} auspicious ${nameEn.toLowerCase()} dates in ${city} for ${month} ${year}. Tithi, nakshatra & alignment checked. Free.`.slice(0, 155);
  }
  const short = fmtShort(nextDateStr);
  const day = fmtDay(nextDateStr);
  return `${dateCount} auspicious ${nameEn.toLowerCase()} dates in ${city} for ${month} ${year}. Next: ${short} (${day}). Free.`.slice(0, 155);
}

// ═══════════════════════════════════════════════
// HELPER: Find next future date from a sorted array
// ═══════════════════════════════════════════════

/**
 * Given an array of { date: 'YYYY-MM-DD', ... } sorted chronologically,
 * return the first entry whose date is today or later.
 * Falls back to the last entry if all dates are past (shows the most recent).
 */
export function findNextFutureDate<T extends { date: string }>(dates: T[]): T | null {
  if (!dates || dates.length === 0) return null;
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const future = dates.find(d => d.date >= today);
  return future || dates[dates.length - 1];
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/seo/ctr-config.ts
git commit -m "feat(seo): add CTR title/description config — single source of truth for SERP formulas"
```

---

### Task 2: Fix Doubled Brand Suffix in PAGE_META

**Files:**
- Modify: `src/lib/seo/metadata.ts`

Strip `| Dekho Panchang` from all PAGE_META title entries that explicitly include it. The root layout template `%s | Dekho Panchang` handles branding globally.

- [ ] **Step 1: Find all affected entries**

```bash
grep -n "| Dekho Panchang" src/lib/seo/metadata.ts | grep "title"
```

Expected: ~12-15 matches across Tamil Calendar, Bengali Calendar, Gujarati Calendar, Chandra Darshan, Panchak, Holashtak, Panchak Today, Holashtak 2026, Videos, and some regional panchang titles (gu, kn, te, bn variants).

- [ ] **Step 2: Remove the explicit suffix from every match**

For each match, remove ` | Dekho Panchang` from the title string. For example:

```
// BEFORE (line 749):
title: { en: 'Tamil Calendar (தமிழ் நாள்காட்டி) 2026  –  Panchangam & Festivals | Dekho Panchang', ...

// AFTER:
title: { en: 'Tamil Calendar (தமிழ் நாள்காட்டி) 2026  –  Panchangam & Festivals', ...
```

Do this for ALL matches. Also check regional locale variants within the same PAGE_META entry — e.g., the `/panchang` entry has `| Dekho Panchang` in its `gu`, `kn`, `te`, `bn` titles (lines 30-34) but NOT in `en`/`hi`/`sa`.

- [ ] **Step 3: Verify no doubles remain**

```bash
grep -c "| Dekho Panchang" src/lib/seo/metadata.ts
```

Expected: 0 matches in title fields. (The string "Dekho Panchang" may still appear in description fields or the `about` route title where the brand name is part of the page name — those are fine.)

**Exceptions — DO NOT strip from these:**
- `/about` title: `'About Dekho Panchang  –  ...'` — "Dekho Panchang" is the subject, not a suffix
- `/vs/*` comparison titles: `'Dekho Panchang vs ...'` — brand name is part of the comparison
- `/pricing` title: `'Pricing  –  Dekho Panchang Plans'` — brand is the subject

- [ ] **Step 4: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 5: Spot-check titles via curl**

```bash
# Pick a previously-doubled page
curl -s https://localhost:3000/en/learn/panchak | grep -o '<title>.*</title>'
# Should show: "Panchak  –  The 5 Inauspicious Nakshatras | Dekho Panchang"
# NOT: "Panchak  –  The 5 Inauspicious Nakshatras | Dekho Panchang | Dekho Panchang"
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/seo/metadata.ts
git commit -m "fix(seo): remove explicit '| Dekho Panchang' from PAGE_META — root layout template handles branding"
```

---

### Task 3: Fix Stale Muhurta Dates in Titles

**Files:**
- Modify: `src/app/[locale]/muhurta/[type]/layout.tsx`

The current code uses `info.dates2026?.[0]` which always returns the FIRST date (e.g., Apr 26), even when it's past. This means titles show stale dates like "Next: Apr 26" in May.

- [ ] **Step 1: Import the helper and update the date selection**

In `src/app/[locale]/muhurta/[type]/layout.tsx`, replace the current date logic:

```typescript
// BEFORE (lines 22-28):
const nextDate = info.dates2026?.[0];
let dateHint = '';
if (nextDate) {
  const [, m, d] = nextDate.date.split('-').map(Number);
  const dt = new Date(Date.UTC(year, m - 1, d));
  dateHint = dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
}
```

Replace with:

```typescript
// AFTER:
import { findNextFutureDate, muhurtaTitle, muhurtaTitleHi, muhurtaDesc } from '@/lib/seo/ctr-config';

const nextEntry = findNextFutureDate(info.dates2026 ?? []);
const nextDateStr = nextEntry?.date ?? null;
```

- [ ] **Step 2: Replace the title/description construction with config functions**

Replace the title and description construction (lines 31-38) with:

```typescript
const locKey = locale as 'en' | 'hi' | 'sa';
const name = info.name[locKey] || info.name.en;
const nameEn = info.name.en;
const year = new Date().getFullYear();

const title = locKey === 'hi'
  ? muhurtaTitleHi(name, year, nextDateStr)
  : muhurtaTitle(name, year, nextDateStr);

const nakshatraLabel = nextEntry?.label?.en?.match(/,\s*(.+?)(?:\s+Nakshatra)?$/)?.[1] ?? null;
const description = muhurtaDesc(nameEn, year, nextDateStr, nakshatraLabel, info.dates2026?.length ?? 0);
```

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Spot-check**

```bash
# Travel muhurta — should show a future date, not Apr 15/26
curl -s http://localhost:3000/en/muhurta/travel | grep -o '<title>.*</title>'
# Expected: "Travel Muhurat 2026: Next May 18 (Monday) | Dekho Panchang"
# NOT: "Travel Muhurat 2026  –  Next: Apr 15 | Dekho Panchang | Dekho Panchang"
```

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/muhurta/[type]/layout.tsx
git commit -m "fix(seo): muhurta titles show next future date, not first date in list"
```

---

### Task 4: Create Canonical Festival Page

**Files:**
- Create: `src/app/[locale]/festivals/[slug]/[year]/page.tsx`
- Create: `src/app/[locale]/festivals/[slug]/[year]/layout.tsx`

This is a NEW route. The existing `[city]/page.tsx` stays untouched. The canonical page shows festival info with a multi-city muhurat table.

- [ ] **Step 1: Create layout.tsx with canonical metadata**

```typescript
// src/app/[locale]/festivals/[slug]/[year]/layout.tsx
import type { Metadata } from 'next';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { CITIES } from '@/lib/constants/cities';
import { tl } from '@/lib/utils/trilingual';
import { locales } from '@/lib/i18n/config';
import {
  festivalCanonicalTitle,
  festivalCanonicalTitleHi,
  festivalCanonicalDesc,
  fmtShort,
} from '@/lib/seo/ctr-config';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Reference city for computing the national date (Delhi — date is same nationwide)
const REF_CITY = CITIES.find(c => c.slug === 'delhi')!;

type Props = { params: Promise<{ locale: string; slug: string; year: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug, year } = await params;
  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);
  if (!detail || !def) return { title: 'Festival' };

  const nameEn = tl(detail.name, 'en');
  const nameHi = tl(detail.name, 'hi');
  const yearNum = parseInt(year, 10);

  let festivalDate = '';
  let pujaTimeStr: string | null = null;
  try {
    if (yearNum >= 2024 && yearNum <= 2030) {
      const festivals = generateFestivalCalendarV2(yearNum, REF_CITY.lat, REF_CITY.lng, REF_CITY.timezone);
      clearTithiTableCache();
      const entry = festivals.find(f => f.slug === slug);
      if (entry) {
        festivalDate = entry.date;
        if (entry.pujaMuhurat) {
          const fmt12h = (hhmm: string) => {
            const [h, m] = hhmm.split(':').map(Number);
            const ampm = h >= 12 ? 'PM' : 'AM';
            return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${ampm}`;
          };
          pujaTimeStr = `${fmt12h(entry.pujaMuhurat.start)}–${fmt12h(entry.pujaMuhurat.end)}`;
        }
      }
    }
  } catch {
    console.error(`[festival-canonical-meta] Failed for ${slug}/${year}`);
  }

  if (!festivalDate) {
    return { title: `${nameEn} ${year} – Date & Puja Muhurat` };
  }

  const isHi = locale === 'hi';
  const name = isHi ? nameHi : nameEn;
  const title = isHi
    ? festivalCanonicalTitleHi(name, year, festivalDate, !!pujaTimeStr)
    : festivalCanonicalTitle(name, year, festivalDate, !!pujaTimeStr);

  // Count cities we show muhurat for (top 6 in the page)
  const description = festivalCanonicalDesc(nameEn, festivalDate, pujaTimeStr, 12);

  const url = `${BASE_URL}/${locale}/festivals/${slug}/${year}`;
  const languages: Record<string, string> = {};
  for (const alt of locales) {
    languages[alt] = `${BASE_URL}/${alt}/festivals/${slug}/${year}`;
  }
  languages['x-default'] = `${BASE_URL}/en/festivals/${slug}/${year}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: 'Dekho Panchang',
      type: 'article',
    },
    alternates: { canonical: `${BASE_URL}/en/festivals/${slug}/${year}`, languages },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Create page.tsx — canonical festival page with multi-city table**

This page reuses the festival computation from the city page but renders a multi-city muhurat table instead of single-city content. The full component is ~200 lines — structure:

```typescript
// src/app/[locale]/festivals/[slug]/[year]/page.tsx
import { CITIES } from '@/lib/constants/cities';
import { MAJOR_FESTIVALS } from '@/lib/calendar/festival-defs';
import { FESTIVAL_DETAILS } from '@/lib/constants/festival-details';
import { generateFestivalCalendarV2 } from '@/lib/calendar/festival-generator';
import { clearTithiTableCache } from '@/lib/calendar/tithi-table';
import { getSunTimes } from '@/lib/astronomy/sunrise';
import { getUTCOffsetForDate } from '@/lib/utils/timezone';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { getPujaVidhiBySlug } from '@/lib/constants/puja-vidhi';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';

const BASE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://dekhopanchang.com').trim();

// Top 6 cities for the muhurat comparison table
const TABLE_CITIES = ['delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'pune'];
const VALID_YEARS = [2025, 2026, 2027, 2028, 2029];

type Props = { params: Promise<{ locale: string; slug: string; year: string }> };

export default async function FestivalCanonicalPage({ params }: Props) {
  const { locale, slug, year } = await params;
  const yearNum = parseInt(year, 10);
  if (!VALID_YEARS.includes(yearNum)) notFound();

  const detail = FESTIVAL_DETAILS[slug];
  const def = MAJOR_FESTIVALS.find(f => f.slug === slug);
  if (!detail || !def) notFound();

  const isDevanagari = isDevanagariLocale(locale);
  const festivalName = tl(detail.name, locale);
  const festivalNameEn = tl(detail.name, 'en');

  // Compute muhurat for each table city
  const cityData = TABLE_CITIES.map(citySlug => {
    const city = CITIES.find(c => c.slug === citySlug);
    if (!city) return null;
    try {
      const festivals = generateFestivalCalendarV2(yearNum, city.lat, city.lng, city.timezone);
      clearTithiTableCache();
      const entry = festivals.find(f => f.slug === slug);
      if (!entry) return null;
      
      const [fy, fm, fd] = entry.date.split('-').map(Number);
      const tzOff = getUTCOffsetForDate(fy, fm, fd, city.timezone);
      const sun = getSunTimes(fy, fm, fd, city.lat, city.lng, tzOff);
      const fmt12h = (d: Date) => {
        const h = d.getHours(), m = d.getMinutes();
        return `${h % 12 || 12}:${m.toString().padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`;
      };
      
      return {
        slug: citySlug,
        name: tl(city.name, locale),
        nameEn: city.name.en,
        date: entry.date,
        sunrise: fmt12h(sun.sunrise),
        sunset: fmt12h(sun.sunset),
        puja: entry.pujaMuhurat
          ? `${fmt12h(new Date(0,0,0,...entry.pujaMuhurat.start.split(':').map(Number)))}–${fmt12h(new Date(0,0,0,...entry.pujaMuhurat.end.split(':').map(Number)))}`
          : null,
      };
    } catch {
      return null;
    }
  }).filter(Boolean);

  // Use first city's date as the national date (same for all)
  const festivalDate = cityData[0]?.date;
  if (!festivalDate) notFound();

  const vidhi = getPujaVidhiBySlug(slug);

  // JSON-LD: Event
  const eventLD = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: `${festivalNameEn} ${year}`,
    startDate: festivalDate,
    description: tl(detail.description, 'en'),
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: { '@type': 'Country', name: 'India' },
    organizer: { '@type': 'Organization', name: 'Dekho Panchang', url: BASE_URL },
  };

  // JSON-LD: FAQ
  const faqLD = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `When is ${festivalNameEn} ${year}?`,
        acceptedAnswer: { '@type': 'Answer', text: `${festivalNameEn} ${year} falls on ${new Date(festivalDate + 'T00:00:00Z').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}.` },
      },
      {
        '@type': 'Question',
        name: `What is the puja muhurat for ${festivalNameEn} ${year}?`,
        acceptedAnswer: { '@type': 'Answer', text: cityData[0]?.puja ? `The puja muhurat in ${cityData[0].nameEn} is ${cityData[0].puja}. Times vary by city.` : `Puja timing follows the ${festivalNameEn} tithi window. Check city-specific times below.` },
      },
    ],
  };

  // JSON-LD: Breadcrumb
  const breadcrumbLD = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/${locale}` },
      { '@type': 'ListItem', position: 2, name: isDevanagari ? 'त्योहार' : 'Festivals', item: `${BASE_URL}/${locale}/festivals` },
      { '@type': 'ListItem', position: 3, name: `${festivalName} ${year}` },
    ],
  };

  const longDate = new Date(festivalDate + 'T00:00:00Z').toLocaleDateString(
    locale === 'hi' ? 'hi-IN' : 'en-US',
    { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(eventLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbLD) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />

      <article className="space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold text-gold-gradient">
            {festivalName} {year}
          </h1>
          <p className="text-xl text-text-primary flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5 text-gold-primary" />
            {longDate}
          </p>
        </div>

        {/* City Muhurat Table */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h2 className="text-xl font-bold text-gold-light mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {isDevanagari ? 'शहरवार मुहूर्त' : 'City-wise Muhurat Times'}
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gold-primary/20 text-text-secondary">
                  <th className="text-left py-2 pr-4">{isDevanagari ? 'शहर' : 'City'}</th>
                  <th className="text-left py-2 pr-4">{isDevanagari ? 'सूर्योदय' : 'Sunrise'}</th>
                  <th className="text-left py-2 pr-4">{isDevanagari ? 'सूर्यास्त' : 'Sunset'}</th>
                  <th className="text-left py-2">{isDevanagari ? 'पूजा मुहूर्त' : 'Puja Muhurat'}</th>
                </tr>
              </thead>
              <tbody>
                {cityData.map(city => city && (
                  <tr key={city.slug} className="border-b border-white/5 hover:bg-white/5">
                    <td className="py-2 pr-4">
                      <Link href={`/${locale}/festivals/${slug}/${year}/${city.slug}`}
                        className="text-gold-primary hover:text-gold-light transition-colors flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {city.name}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-text-primary">{city.sunrise}</td>
                    <td className="py-2 pr-4 text-text-primary">{city.sunset}</td>
                    <td className="py-2 text-text-primary font-medium">{city.puja || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-text-secondary mt-3">
            <Link href={`/${locale}/festivals/${slug}/${year}/delhi`} className="text-gold-primary hover:underline">
              {isDevanagari ? 'सभी शहर देखें' : 'See all cities'} <ChevronRight className="inline w-3 h-3" />
            </Link>
          </p>
        </div>

        {/* Puja Vidhi (if available) */}
        {vidhi && (
          <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
            <h2 className="text-xl font-bold text-gold-light mb-4">
              {isDevanagari ? 'पूजा विधि' : 'Puja Vidhi'}
            </h2>
            <div className="prose prose-invert prose-gold max-w-none text-text-primary text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: tl(vidhi.steps, locale) }} />
          </div>
        )}

        {/* Significance */}
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 p-6">
          <h2 className="text-xl font-bold text-gold-light mb-4">
            {isDevanagari ? 'महत्त्व' : 'Significance'}
          </h2>
          <p className="text-text-primary text-sm leading-relaxed">
            {tl(detail.description, locale)}
          </p>
        </div>
      </article>
    </div>
  );
}
```

**Note:** The exact city muhurat computation may need adjustment based on the `pujaMuhurat` format in `FestivalEntry`. The `new Date(0,0,0,...split)` pattern is illustrative — use the same `fmt12h` helper from the existing city page.

- [ ] **Step 3: Type check**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 4: Test in browser**

Navigate to `http://localhost:3000/en/festivals/ganesh-chaturthi/2027` — should render the canonical page with multi-city table. Verify JSON-LD in page source.

- [ ] **Step 5: Commit**

```bash
git add 'src/app/[locale]/festivals/[slug]/[year]/page.tsx' 'src/app/[locale]/festivals/[slug]/[year]/layout.tsx'
git commit -m "feat(seo): canonical festival page with multi-city muhurat table — no city in URL"
```

---

### Task 5: Noindex City-Variant Festival Pages + Update Sitemap

**Files:**
- Modify: `src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx`
- Modify: `src/app/sitemap.ts`

- [ ] **Step 1: Add canonical + noindex to city-variant layout**

In `src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx`, update the `return` block of `generateMetadata()` to add canonical pointing to the parent and noindex:

```typescript
// In the return statement (around line 126), change:
alternates: {
  canonical: `${BASE_URL}/en/festivals/${slug}/${year}/${city}`,
  languages,
},

// To:
alternates: {
  canonical: `${BASE_URL}/en/festivals/${slug}/${year}`,  // ← points to canonical (no city)
  languages: Object.fromEntries(
    locales.map(alt => [alt, `${BASE_URL}/${alt}/festivals/${slug}/${year}`])
  ),
},
robots: { index: false, follow: true },  // ← noindex city variants
```

Also update the `languages` object in alternates to point to the canonical URLs (without city) — currently they all include the city.

- [ ] **Step 2: Update sitemap — replace ~2,000 city URLs with ~60 canonical URLs**

In `src/app/sitemap.ts`, replace the festival city loop (lines 527-570) with:

```typescript
// Festival canonical pages (no city) — one URL per festival per year
const festivalSeoSlugs = [
  'diwali', 'janmashtami', 'maha-shivaratri', 'ram-navami', 'ganesh-chaturthi',
  'dussehra', 'holi', 'raksha-bandhan', 'dhanteras', 'narak-chaturdashi',
  'govardhan-puja', 'bhai-dooj', 'hanuman-jayanti', 'akshaya-tritiya',
  'guru-purnima', 'vasant-panchami', 'holika-dahan', 'hartalika-teej',
  'chhath-puja', 'makar-sankranti',
];
const festivalSeoYears = [2026, 2027];
const extendedYearFestivals = new Set([
  'diwali', 'ganesh-chaturthi', 'holi', 'dussehra', 'akshaya-tritiya',
  'raksha-bandhan', 'hanuman-jayanti', 'janmashtami', 'chhath-puja',
]);
const extendedYears = [2028, 2029];

for (const fSlug of festivalSeoSlugs) {
  for (const fYear of festivalSeoYears) {
    addEntries(entries, `/festivals/${fSlug}/${fYear}`, {
      changeFrequency: 'monthly',
      priority: 0.8,  // Boosted from 0.7 — these are now the primary festival pages
    });
  }
  if (extendedYearFestivals.has(fSlug)) {
    for (const fYear of extendedYears) {
      addEntries(entries, `/festivals/${fSlug}/${fYear}`, {
        changeFrequency: 'monthly',
        priority: 0.7,
      });
    }
  }
}
// City-variant pages deliberately excluded from sitemap — canonical consolidation.
// City pages still work for users but Google indexes only the canonical.
```

- [ ] **Step 3: Count sitemap entries before and after**

```bash
# Before (should be ~2000 festival entries)
npx next build 2>&1 | grep "sitemap" || true
# Or check sitemap output size
```

- [ ] **Step 4: Type check + build**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```

- [ ] **Step 5: Commit**

```bash
git add 'src/app/[locale]/festivals/[slug]/[year]/[city]/layout.tsx' src/app/sitemap.ts
git commit -m "feat(seo): noindex festival city variants + sitemap canonical consolidation — ~2000 URLs → ~60"
```

---

### Task 6: Rewrite Muhurta Descriptions in PAGE_META

**Files:**
- Modify: `src/lib/seo/metadata.ts` — the muhurta-related `PAGE_META` description entries

The muhurta TYPE pages (`/muhurta/[type]`) get their metadata from the layout.tsx (Task 3). But the muhurta HUB page (`/muhurat`) and muhurta city-month pages may use PAGE_META descriptions.

- [ ] **Step 1: Update the muhurat hub description**

In `src/lib/seo/metadata.ts`, find the `/muhurat` entry and update its description:

```typescript
// BEFORE:
description: { en: 'Find auspicious dates for...' /* generic */ }

// AFTER:
description: {
  en: 'Auspicious muhurat dates for 20+ activities — wedding, travel, griha pravesh, mundan, annaprashan. Computed from Vedic Panchang with nakshatra, tithi & planetary alignment. Free, no signup.',
  hi: '20+ कार्यों के शुभ मुहूर्त — विवाह, यात्रा, गृह प्रवेश, मुंडन, अन्नप्राशन। नक्षत्र, तिथि व ग्रह स्थिति के अनुसार। निःशुल्क।',
  sa: 'विंशत्यधिककार्याणां शुभमुहूर्ताः — विवाहः यात्रा गृहप्रवेशः मुण्डनं अन्नप्राशनम्। निःशुल्कम्।',
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/seo/metadata.ts
git commit -m "feat(seo): rewrite muhurta hub description — specific activities, not generic"
```

---

### Task 7: Add FAQ Data for Top Impression Pages

**Files:**
- Modify: `src/lib/seo/faq-data.ts` — add FAQ entries for muhurta and rahu kaal routes

The `generateFAQLD()` function already exists and consumes `FAQ_DATA[route]`. We just need to add entries for routes that get high impressions but don't have FAQ data yet.

- [ ] **Step 1: Check which routes already have FAQ data**

```bash
grep "'/muhurta\|'/rahu\|'/panchang\|'/dates" src/lib/seo/faq-data.ts | head -20
```

- [ ] **Step 2: Add FAQ entries for missing high-impression routes**

Add entries to `FAQ_DATA` for routes that don't have them yet. Each entry is `{ question: { en, hi }, answer: { en, hi } }`. Target:

- `/muhurta/travel` — "What is the next auspicious travel date?", "How is travel muhurat calculated?"
- `/rahu-kaal` — "What is Rahu Kaal?", "What time is Rahu Kaal today?", "What should you avoid?"
- `/dates/amavasya` — "When is the next Amavasya?", "What should you do on Amavasya?"

These follow the existing pattern in `faq-data.ts`.

- [ ] **Step 3: Ensure pages emit the FAQ JSON-LD**

Check if the target pages already call `generateFAQLD()`. If not, add the emission in their page component:

```typescript
import { generateFAQLD } from '@/lib/seo/faq-data';
import { safeJsonLd } from '@/lib/seo/safe-jsonld';

// In the component:
const faqLD = generateFAQLD('/muhurta/travel', locale);
// ... in JSX:
{faqLD && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqLD) }} />}
```

- [ ] **Step 4: Validate with Google Rich Results Test**

Copy the JSON-LD output from page source and paste into https://search.google.com/test/rich-results to verify it passes.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/faq-data.ts
# + any page files that were modified to emit FAQ LD
git commit -m "feat(seo): add FAQ structured data for muhurta, rahu kaal, dates pages"
```

---

### Task 8: Verify Everything End-to-End

**Files:** None — verification only.

- [ ] **Step 1: Full build**

```bash
npx next build
```

Must pass with 0 errors.

- [ ] **Step 2: Spot-check titles via curl (6 pages)**

```bash
for path in \
  "/en/festivals/ganesh-chaturthi/2027" \
  "/en/festivals/ganesh-chaturthi/2027/mumbai" \
  "/en/muhurta/travel" \
  "/hi/muhurta/annaprashan" \
  "/en/learn/panchak" \
  "/en/calendar/regional/bengali"; do
  echo "=== $path ==="
  curl -s "http://localhost:3000$path" | grep -oP '<title>\K[^<]+'
  echo
done
```

Expected:
- Festival canonical: `Ganesh Chaturthi 2027 Date: Sep 4 (Saturday) – Puja Muhurat | Dekho Panchang` (brand once)
- Festival city: title unchanged (but has `noindex` in robots meta)
- Muhurta: `Travel Muhurat 2026: Next May 18 (Monday) | Dekho Panchang` (future date, brand once)
- Learn/panchak: `Panchak  –  The 5 Inauspicious Nakshatras | Dekho Panchang` (brand once, not twice)

- [ ] **Step 3: Check for noindex on city pages**

```bash
curl -s "http://localhost:3000/en/festivals/ganesh-chaturthi/2027/mumbai" | grep -i "noindex"
# Should find: <meta name="robots" content="noindex, follow"/>
```

- [ ] **Step 4: Check canonical tags**

```bash
curl -s "http://localhost:3000/en/festivals/ganesh-chaturthi/2027/mumbai" | grep -i "canonical"
# Should point to: /en/festivals/ganesh-chaturthi/2027 (no city)
```

- [ ] **Step 5: Validate JSON-LD on canonical festival page**

```bash
curl -s "http://localhost:3000/en/festivals/ganesh-chaturthi/2027" | grep -o 'application/ld+json.*</script>' | wc -l
# Expected: 3 (Event + Breadcrumb + FAQ)
```

- [ ] **Step 6: Check sitemap size**

```bash
curl -s "http://localhost:3000/sitemap.xml" | grep -c "festivals"
# Should be ~60-80 (canonical only), NOT ~2000+
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run
```

---

## Phase 4 (Deferred): Dynamic Metadata for Daily Pages

**Depends on:** SSR conversion of panchang and rahu-kaal pages (in progress separately).

When SSR conversion lands, add dynamic `generateMetadata()` to:
- `/panchang/page.tsx` — title with today's tithi + nakshatra
- `/rahu-kaal/page.tsx` — title with today's times
- `/horoscope/[sign]/page.tsx` — title with today's date
- `/dates/[type]/page.tsx` — title with next upcoming date

All formulas should be added to `src/lib/seo/ctr-config.ts` when implementing. The config file is designed to be extended — add new formatter functions following the existing patterns.

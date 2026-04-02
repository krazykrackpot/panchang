# Puja Vidhi & Ritual System — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a 6-layer ritual guidance system that makes Drik Panchang's static festival pages obsolete — computed muhurta timing, interactive puja mode, smart samagri with diaspora substitutions, personalized sankalpa, and chart-connected graha shanti remedies.

**Architecture:** Extend the existing `PujaVidhi` type system with backward-compatible optional fields. New computation functions in `src/lib/puja/`. New interactive components in `src/components/puja/`. Redesign the puja detail page with a Drik-inspired hero card (festival name + date + deity + computed timing front-and-center) but surpass them with interactive ritual guidance below.

**Tech Stack:** Next.js 16 (App Router, React 19), TypeScript, Tailwind v4, Framer Motion, existing astronomy engine (`getSunTimes`, `computePanchang`), Zustand (for puja mode state), localStorage (samagri persistence).

**Spec:** `docs/superpowers/specs/2026-04-02-puja-vidhi-design.md`

---

## File Map

### New Files

| File | Responsibility |
|------|---------------|
| `src/lib/puja/muhurta-compute.ts` | Compute puja timing windows from sunrise/sunset |
| `src/lib/puja/parana-compute.ts` | Compute vrat fast-breaking times |
| `src/lib/puja/sankalpa-generator.ts` | Generate personalized sankalpa text |
| `src/lib/puja/affliction-detector.ts` | Detect weak/afflicted planets → suggest remedies |
| `src/lib/constants/puja-vidhi/substitutions.ts` | Shared diaspora substitution database |
| `src/lib/constants/puja-vidhi/graha-shanti/index.ts` | Graha shanti vidhis registry |
| `src/lib/constants/puja-vidhi/graha-shanti/surya.ts` | Sun remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/chandra.ts` | Moon remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/mangal.ts` | Mars remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/budha.ts` | Mercury remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/guru.ts` | Jupiter remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/shukra.ts` | Venus remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/shani.ts` | Saturn remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/rahu.ts` | Rahu remedial puja |
| `src/lib/constants/puja-vidhi/graha-shanti/ketu.ts` | Ketu remedial puja |
| `src/components/puja/HeroCard.tsx` | Festival hero card (name, date, deity, timing) |
| `src/components/puja/MuhurtaCountdown.tsx` | Live countdown to puja window |
| `src/components/puja/SamagriList.tsx` | Enhanced samagri with categories, substitutions, share |
| `src/components/puja/PujaMode.tsx` | Full-screen interactive guided ritual |
| `src/components/puja/JapaCounter.tsx` | Tap-to-count mantra counter |
| `src/components/puja/SankalpaDisplay.tsx` | Personalized sankalpa renderer |
| `src/components/puja/ParanaDisplay.tsx` | Vrat fast-breaking time display |
| `src/lib/constants/puja-vidhi/ekadashi-variants.ts` | 24 named Ekadashi vidhis |
| `src/lib/constants/puja-vidhi/pradosham.ts` | Already exists (orphaned) |
| `src/lib/constants/puja-vidhi/satyanarayan.ts` | Already exists (orphaned) |
| `src/lib/constants/puja-vidhi/sankashti-chaturthi.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/karva-chauth.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/hartalika-teej.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/vat-savitri.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/nag-panchami.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/akshaya-tritiya.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/tulsi-vivah.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/ahoi-ashtami.ts` | New vrat vidhi |
| `src/lib/constants/puja-vidhi/masik-shivaratri.ts` | New monthly vidhi |
| `src/lib/constants/puja-vidhi/somvar-vrat.ts` | New weekly vidhi |
| `src/lib/constants/puja-vidhi/mangalvar-vrat.ts` | New weekly vidhi |
| `src/lib/constants/puja-vidhi/amavasya-tarpan.ts` | New monthly vidhi |

### Modified Files

| File | Changes |
|------|---------|
| `src/lib/constants/puja-vidhi/types.ts` | Add `essential`, `stepType`, `category`, `substitutions`, `parana`, `graha_shanti` |
| `src/lib/constants/puja-vidhi/index.ts` | Wire up orphaned vidhis + new vidhis |
| `src/app/[locale]/puja/[slug]/page.tsx` | Hero card redesign, muhurta countdown, enhanced samagri, puja mode entry |
| `src/app/[locale]/puja/page.tsx` | Add graha shanti category, improve card design |
| `src/components/puja/MantraCard.tsx` | Add japa counter integration |

---

## Phase 1: Foundation — Wire Up + Hero Card Redesign

### Task 1: Wire Up Orphaned Vidhis

**Files:**
- Modify: `src/lib/constants/puja-vidhi/index.ts`

- [ ] **Step 1: Read current index.ts and orphaned files**

Check which files exist but aren't imported:
```bash
ls src/lib/constants/puja-vidhi/*.ts | xargs -I{} basename {} .ts
```
Compare with imports in `index.ts`. The orphaned files are: `ekadashi.ts`, `pradosham.ts`, `satyanarayan.ts`.

- [ ] **Step 2: Add imports and registrations for orphaned vidhis**

Add to `src/lib/constants/puja-vidhi/index.ts`:

```typescript
import { EKADASHI_PUJA } from './ekadashi';
import { PRADOSHAM_PUJA } from './pradosham';
import { SATYANARAYAN_PUJA } from './satyanarayan';
```

And in the `PUJA_VIDHIS` record:
```typescript
'ekadashi': EKADASHI_PUJA,
'pradosham': PRADOSHAM_PUJA,
'satyanarayan-katha': SATYANARAYAN_PUJA,
```

- [ ] **Step 3: Verify exports match expected variable names**

Read each orphaned file's export statement to confirm the variable name:
```bash
grep "^export const" src/lib/constants/puja-vidhi/ekadashi.ts src/lib/constants/puja-vidhi/pradosham.ts src/lib/constants/puja-vidhi/satyanarayan.ts
```

Adjust import names to match actual exports.

- [ ] **Step 4: Build and verify no type errors**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/puja-vidhi/index.ts
git commit -m "feat: wire up 3 orphaned puja vidhis (ekadashi, pradosham, satyanarayan)"
```

---

### Task 2: Extend PujaVidhi Types

**Files:**
- Modify: `src/lib/constants/puja-vidhi/types.ts`

- [ ] **Step 1: Read current types.ts**

Verify the exact current interface definitions.

- [ ] **Step 2: Add new optional fields to existing interfaces**

All new fields are optional (`?`) to maintain backward compatibility:

```typescript
// types.ts — full updated file

export interface Trilingual {
  en: string;
  hi: string;
  sa: string;
}

export interface SamagriItem {
  name: Trilingual;
  quantity?: string;
  note?: Trilingual;
  // New fields
  category?: 'flowers' | 'food' | 'puja_items' | 'clothing' | 'vessels' | 'other';
  essential?: boolean;
  substitutions?: { item: Trilingual; note: Trilingual }[];
  prepNote?: Trilingual;
}

export interface VidhiStep {
  step: number;
  title: Trilingual;
  description: Trilingual;
  mantraRef?: string;
  duration?: string;
  // New fields
  essential?: boolean;
  stepType?: 'preparation' | 'invocation' | 'offering' | 'mantra' | 'meditation' | 'conclusion';
}

export interface MantraDetail {
  id: string;
  name: Trilingual;
  devanagari: string;
  iast: string;
  meaning: Trilingual;
  japaCount?: number;
  usage: Trilingual;
}

export interface StotraReference {
  name: Trilingual;
  text?: string;
  verseCount?: number;
  duration?: string;
  note?: Trilingual;
}

export interface AartiText {
  name: Trilingual;
  devanagari: string;
  iast: string;
}

export interface ParanaRule {
  type: 'sunrise_plus_quarter' | 'moonrise' | 'next_sunrise' | 'tithi_end';
  description: Trilingual;
}

export type MuhurtaWindowType = 'madhyahna' | 'aparahna' | 'pradosh' | 'nishita' | 'brahma_muhurta' | 'abhijit';

export interface PujaVidhi {
  festivalSlug: string;
  category: 'festival' | 'vrat' | 'graha_shanti';
  deity: Trilingual;
  samagri: SamagriItem[];
  muhurtaType: 'computed' | 'fixed';
  muhurtaDescription: Trilingual;
  muhurtaWindow?: { type: MuhurtaWindowType };
  sankalpa: Trilingual;
  vidhiSteps: VidhiStep[];
  mantras: MantraDetail[];
  stotras?: StotraReference[];
  aarti?: AartiText;
  naivedya: Trilingual;
  precautions: Trilingual[];
  phala: Trilingual;
  visarjan?: Trilingual;
  // New fields
  parana?: ParanaRule;
}
```

- [ ] **Step 3: Build and verify no type errors**

All new fields are optional, so existing data files should compile unchanged:

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/puja-vidhi/types.ts
git commit -m "feat: extend PujaVidhi types with essential flags, samagri categories, parana rules"
```

---

### Task 3: Computed Muhurta Engine

**Files:**
- Create: `src/lib/puja/muhurta-compute.ts`

- [ ] **Step 1: Create the muhurta computation function**

This uses `getSunTimes()` from `src/lib/astronomy/sunrise.ts` which returns `{ sunrise: Date, sunset: Date, dayDurationMinutes: number }`.

```typescript
// src/lib/puja/muhurta-compute.ts

import { getSunTimes, type SunTimes } from '@/lib/astronomy/sunrise';
import type { MuhurtaWindowType } from '@/lib/constants/puja-vidhi/types';

export interface ComputedMuhurta {
  start: Date;
  end: Date;
  type: MuhurtaWindowType;
}

/**
 * Compute the puja muhurta window for a given date and location.
 *
 * Window definitions (all derived from sunrise/sunset):
 * - brahma_muhurta: 96 min before sunrise → 48 min before sunrise
 * - abhijit: midday - 24 min → midday + 24 min
 * - madhyahna: 2/5 → 3/5 of daytime after sunrise
 * - aparahna: 3/5 → 4/5 of daytime after sunrise
 * - pradosh: sunset → sunset + 144 min (2h24m)
 * - nishita: midnight - 24 min → midnight + 24 min (local solar midnight)
 */
export function computePujaMuhurta(
  type: MuhurtaWindowType,
  year: number,
  month: number,
  day: number,
  latitude: number,
  longitude: number,
  timezoneOffset: number,
): ComputedMuhurta {
  const sun = getSunTimes(year, month, day, latitude, longitude, timezoneOffset);
  const sunriseMs = sun.sunrise.getTime();
  const sunsetMs = sun.sunset.getTime();
  const dayMs = sunsetMs - sunriseMs;
  const MIN = 60 * 1000;

  let start: Date;
  let end: Date;

  switch (type) {
    case 'brahma_muhurta':
      start = new Date(sunriseMs - 96 * MIN);
      end = new Date(sunriseMs - 48 * MIN);
      break;

    case 'abhijit': {
      const midday = sunriseMs + dayMs / 2;
      start = new Date(midday - 24 * MIN);
      end = new Date(midday + 24 * MIN);
      break;
    }

    case 'madhyahna':
      start = new Date(sunriseMs + (dayMs * 2) / 5);
      end = new Date(sunriseMs + (dayMs * 3) / 5);
      break;

    case 'aparahna':
      start = new Date(sunriseMs + (dayMs * 3) / 5);
      end = new Date(sunriseMs + (dayMs * 4) / 5);
      break;

    case 'pradosh':
      start = new Date(sunsetMs);
      end = new Date(sunsetMs + 144 * MIN);
      break;

    case 'nishita': {
      // Local solar midnight: midpoint between sunset today and sunrise tomorrow
      const nextSun = getSunTimes(year, month, day + 1, latitude, longitude, timezoneOffset);
      const midnight = sunsetMs + (nextSun.sunrise.getTime() - sunsetMs) / 2;
      start = new Date(midnight - 24 * MIN);
      end = new Date(midnight + 24 * MIN);
      break;
    }
  }

  return { start, end, type };
}

/**
 * Format muhurta times for display.
 * Returns strings like "7:42 PM" or "19:42" based on format preference.
 */
export function formatMuhurtaTime(date: Date, use24h: boolean = false): string {
  if (use24h) {
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

/**
 * Compute duration between two dates in minutes.
 */
export function muhurtaDurationMinutes(start: Date, end: Date): number {
  return Math.round((end.getTime() - start.getTime()) / (60 * 1000));
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit src/lib/puja/muhurta-compute.ts 2>&1 | head -10
```

If tsc doesn't support single-file check, just run:
```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/puja/muhurta-compute.ts
git commit -m "feat: add puja muhurta computation engine (6 window types)"
```

---

### Task 4: MuhurtaCountdown Component

**Files:**
- Create: `src/components/puja/MuhurtaCountdown.tsx`

- [ ] **Step 1: Create the countdown component**

```typescript
// src/components/puja/MuhurtaCountdown.tsx
'use client';

import { useState, useEffect } from 'react';
import { Clock, MapPin } from 'lucide-react';
import type { ComputedMuhurta } from '@/lib/puja/muhurta-compute';
import { formatMuhurtaTime, muhurtaDurationMinutes } from '@/lib/puja/muhurta-compute';
import type { Locale } from '@/types/panchang';

interface MuhurtaCountdownProps {
  muhurta: ComputedMuhurta;
  locationName: string;
  timezone: string;
  locale: Locale;
}

const LABELS = {
  en: {
    muhurta: 'Puja Muhurta',
    duration: 'Duration',
    startsIn: 'Starts in',
    happeningNow: 'Happening Now',
    ended: 'Muhurta has passed',
    min: 'min',
    hr: 'hr',
  },
  hi: {
    muhurta: 'पूजा मुहूर्त',
    duration: 'अवधि',
    startsIn: 'शुरू होगा',
    happeningNow: 'अभी चल रहा है',
    ended: 'मुहूर्त समाप्त',
    min: 'मिनट',
    hr: 'घंटा',
  },
  sa: {
    muhurta: 'पूजामुहूर्तम्',
    duration: 'कालः',
    startsIn: 'आरम्भः',
    happeningNow: 'इदानीं प्रवर्तते',
    ended: 'मुहूर्तं समाप्तम्',
    min: 'निमेषाः',
    hr: 'होरा',
  },
};

type MuhurtaStatus = 'upcoming' | 'active' | 'passed';

function getStatus(muhurta: ComputedMuhurta, now: Date): MuhurtaStatus {
  if (now < muhurta.start) return 'upcoming';
  if (now <= muhurta.end) return 'active';
  return 'passed';
}

function formatCountdown(ms: number, l: (typeof LABELS)['en']): string {
  const totalMin = Math.floor(ms / 60000);
  const hours = Math.floor(totalMin / 60);
  const min = totalMin % 60;
  if (hours > 0) return `${hours} ${l.hr} ${min} ${l.min}`;
  return `${min} ${l.min}`;
}

export default function MuhurtaCountdown({ muhurta, locationName, timezone, locale }: MuhurtaCountdownProps) {
  const [now, setNow] = useState(() => new Date());
  const l = LABELS[locale];

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 30_000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const status = getStatus(muhurta, now);
  const durationMin = muhurtaDurationMinutes(muhurta.start, muhurta.end);
  const durationHr = Math.floor(durationMin / 60);
  const durationRemMin = durationMin % 60;

  const statusColors = {
    upcoming: 'border-gold-primary/20 bg-gold-primary/[0.04]',
    active: 'border-emerald-500/30 bg-emerald-500/[0.06]',
    passed: 'border-text-secondary/10 bg-text-secondary/[0.03] opacity-60',
  };

  const statusBadge = {
    upcoming: { text: formatCountdown(muhurta.start.getTime() - now.getTime(), l), label: l.startsIn, color: 'text-gold-primary' },
    active: { text: l.happeningNow, label: '', color: 'text-emerald-400' },
    passed: { text: l.ended, label: '', color: 'text-text-secondary/50' },
  };

  return (
    <div className={`rounded-xl border p-5 ${statusColors[status]}`}>
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-gold-primary" />
        <h3 className="text-sm font-bold text-gold-light">{l.muhurta}</h3>
        {status === 'active' && (
          <span className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-semibold text-emerald-400">{statusBadge.active.text}</span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-black text-gold-light tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatMuhurtaTime(muhurta.start)}
        </span>
        <span className="text-text-secondary/40">—</span>
        <span className="text-2xl font-black text-gold-light tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatMuhurtaTime(muhurta.end)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary/60">
        <span>{l.duration}: {durationHr > 0 ? `${durationHr}h ` : ''}{durationRemMin}m</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" />
          {locationName} ({timezone})
        </span>
      </div>

      {status === 'upcoming' && (
        <div className="mt-3 pt-3 border-t border-gold-primary/10">
          <span className="text-xs text-text-secondary/50">{statusBadge.upcoming.label}: </span>
          <span className={`text-sm font-bold ${statusBadge.upcoming.color}`}>
            {statusBadge.upcoming.text}
          </span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/MuhurtaCountdown.tsx
git commit -m "feat: add MuhurtaCountdown component with live status"
```

---

### Task 5: Hero Card Component (Drik-Inspired, But Better)

**Files:**
- Create: `src/components/puja/HeroCard.tsx`

Drik Panchang shows: festival name (huge), date, weekday, deity illustration, then muhurta time. We do the same but add: live countdown, category badge, and deity SVG from our existing icon system.

- [ ] **Step 1: Create HeroCard component**

```typescript
// src/components/puja/HeroCard.tsx
'use client';

import { motion } from 'framer-motion';
import type { PujaVidhi, MuhurtaWindowType } from '@/lib/constants/puja-vidhi/types';
import type { ComputedMuhurta } from '@/lib/puja/muhurta-compute';
import MuhurtaCountdown from './MuhurtaCountdown';
import type { Locale } from '@/types/panchang';

interface HeroCardProps {
  puja: PujaVidhi;
  locale: Locale;
  computedMuhurta?: ComputedMuhurta;
  festivalDate?: Date;
  locationName?: string;
  timezone?: string;
}

const MUHURTA_LABELS: Record<MuhurtaWindowType, { en: string; hi: string; sa: string }> = {
  madhyahna: { en: 'Madhyahna Kaal', hi: 'मध्याह्न काल', sa: 'मध्याह्नकालः' },
  aparahna: { en: 'Aparahna Kaal', hi: 'अपराह्न काल', sa: 'अपराह्णकालः' },
  pradosh: { en: 'Pradosh Kaal', hi: 'प्रदोष काल', sa: 'प्रदोषकालः' },
  nishita: { en: 'Nishita Kaal', hi: 'निशीथ काल', sa: 'निशीथकालः' },
  brahma_muhurta: { en: 'Brahma Muhurta', hi: 'ब्रह्म मुहूर्त', sa: 'ब्रह्ममुहूर्तम्' },
  abhijit: { en: 'Abhijit Muhurta', hi: 'अभिजित् मुहूर्त', sa: 'अभिजिन्मुहूर्तम्' },
};

const CATEGORY_LABELS = {
  festival: { en: 'Festival', hi: 'त्योहार', sa: 'उत्सवः' },
  vrat: { en: 'Vrat', hi: 'व्रत', sa: 'व्रतम्' },
  graha_shanti: { en: 'Graha Shanti', hi: 'ग्रह शान्ति', sa: 'ग्रहशान्तिः' },
};

export default function HeroCard({
  puja, locale, computedMuhurta, festivalDate, locationName, timezone,
}: HeroCardProps) {
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const categoryBadge = CATEGORY_LABELS[puja.category] || CATEGORY_LABELS.festival;
  const categoryColors = {
    festival: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    vrat: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    graha_shanti: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
      className="glass-card rounded-2xl border border-gold-primary/15 overflow-hidden"
    >
      {/* Top gradient band */}
      <div className="h-1.5 bg-gradient-to-r from-gold-dark via-gold-primary to-gold-light" />

      <div className="p-6 sm:p-8">
        {/* Category badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className={`text-xs px-3 py-1 rounded-full font-semibold border ${categoryColors[puja.category]}`}>
            {categoryBadge[locale]}
          </span>
          {puja.muhurtaWindow && (
            <span className="text-xs text-text-secondary/50">
              {MUHURTA_LABELS[puja.muhurtaWindow.type]?.[locale]}
            </span>
          )}
        </div>

        {/* Deity name — the hero text */}
        <h1
          className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-gold-light via-gold-primary to-gold-dark bg-clip-text text-transparent mb-3 leading-tight"
          style={headingFont}
        >
          {puja.deity[locale]}
        </h1>

        {/* Festival date (if provided) */}
        {festivalDate && (
          <p className="text-lg text-text-secondary/70 mb-1" style={headingFont}>
            {festivalDate.toLocaleDateString(locale === 'sa' ? 'hi-IN' : locale === 'hi' ? 'hi-IN' : 'en-US', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        )}

        {/* Muhurta description (static text, always shown) */}
        <p className="text-sm text-text-secondary/50 max-w-2xl mt-2 mb-5">
          {puja.muhurtaDescription[locale]}
        </p>

        {/* Computed muhurta countdown (when available) */}
        {computedMuhurta && locationName && timezone && (
          <div className="mt-5">
            <MuhurtaCountdown
              muhurta={computedMuhurta}
              locationName={locationName}
              timezone={timezone}
              locale={locale}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/HeroCard.tsx
git commit -m "feat: add HeroCard component — Drik-inspired hero with live muhurta"
```

---

### Task 6: Integrate Hero Card + Muhurta into Puja Detail Page

**Files:**
- Modify: `src/app/[locale]/puja/[slug]/page.tsx`

- [ ] **Step 1: Read the full current page to understand the header section**

Read lines 252-280 (the current header rendering in the return block).

- [ ] **Step 2: Replace the inline header with HeroCard**

Replace the existing header block (the `motion.div` with `text-center mb-8`) with the `HeroCard` component. Add muhurta computation using the user's location (from query params or a default).

Add these imports at the top:
```typescript
import HeroCard from '@/components/puja/HeroCard';
import { computePujaMuhurta } from '@/lib/puja/muhurta-compute';
```

Replace the header section (lines ~256-277) with:
```typescript
{/* Hero Card */}
<HeroCard
  puja={puja}
  locale={locale}
  computedMuhurta={computedMuhurta}
  locationName={locationName}
  timezone={timezone}
/>
```

Add computation logic inside the component body (after the `mantraMap` useMemo):
```typescript
// Compute muhurta if location is available and muhurta is computed type
const computedMuhurta = useMemo(() => {
  if (puja?.muhurtaType !== 'computed' || !puja.muhurtaWindow) return undefined;
  // Default to current date — in production, use the festival date
  const now = new Date();
  // TODO: Get location from user profile or URL params
  // For now, use a sensible default or skip
  try {
    return computePujaMuhurta(
      puja.muhurtaWindow.type,
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
      46.46, // Default: Corseaux lat (will be replaced with user location)
      6.79,  // Default: Corseaux lng
      1,     // CET offset (will be replaced with dynamic timezone)
    );
  } catch {
    return undefined;
  }
}, [puja]);

const locationName = 'Corseaux'; // TODO: from user profile
const timezone = 'CET';          // TODO: from user profile
```

- [ ] **Step 3: Build and verify**

```bash
npx next build 2>&1 | head -40
```

- [ ] **Step 4: Test visually**

```bash
npm run dev
```
Visit `http://localhost:3000/en/puja/ganesh-chaturthi` and verify:
- Hero card shows deity name large
- Category badge shows "Festival"
- Muhurta countdown appears with computed times
- Rest of the page (samagri, steps, mantras) still works

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/puja/[slug]/page.tsx
git commit -m "feat: integrate HeroCard with computed muhurta into puja detail page"
```

---

### Task 7: Persist Samagri Checkmarks in localStorage

**Files:**
- Modify: `src/app/[locale]/puja/[slug]/page.tsx`

- [ ] **Step 1: Add localStorage persistence for samagri state**

Replace the `samagriChecked` useState initialization:

```typescript
// Before:
const [samagriChecked, setSamagriChecked] = useState<boolean[]>(
  () => new Array(puja?.samagri.length ?? 0).fill(false)
);

// After:
const storageKey = `puja-samagri-${slug}-${new Date().getFullYear()}`;

const [samagriChecked, setSamagriChecked] = useState<boolean[]>(() => {
  if (typeof window === 'undefined') return new Array(puja?.samagri.length ?? 0).fill(false);
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length === (puja?.samagri.length ?? 0)) {
        return parsed;
      }
    }
  } catch { /* ignore */ }
  return new Array(puja?.samagri.length ?? 0).fill(false);
});
```

- [ ] **Step 2: Add useEffect to persist changes**

Add after the useState:

```typescript
useEffect(() => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(samagriChecked));
  } catch { /* ignore */ }
}, [samagriChecked, storageKey]);
```

- [ ] **Step 3: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Test manually**

Open a puja page, check some samagri items, refresh — checkmarks should persist.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/puja/[slug]/page.tsx
git commit -m "feat: persist samagri checklist in localStorage (keyed by slug+year)"
```

---

## Phase 2: Interactive Puja Mode

### Task 8: JapaCounter Component

**Files:**
- Create: `src/components/puja/JapaCounter.tsx`

- [ ] **Step 1: Create the japa counter component**

```typescript
// src/components/puja/JapaCounter.tsx
'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

interface JapaCounterProps {
  target: number;     // e.g., 108
  mantraName: string; // Display name
  onComplete?: () => void;
}

export default function JapaCounter({ target, mantraName, onComplete }: JapaCounterProps) {
  const [count, setCount] = useState(0);
  const isComplete = count >= target;
  const progress = Math.min(count / target, 1);

  const increment = useCallback(() => {
    if (isComplete) return;
    const next = count + 1;
    setCount(next);
    // Haptic feedback
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(next >= target ? [100, 50, 100] : 10);
    }
    if (next >= target) onComplete?.();
  }, [count, target, isComplete, onComplete]);

  const reset = () => setCount(0);

  // SVG circle dimensions
  const size = 200;
  const strokeWidth = 6;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Circular progress + tap area */}
      <button
        onClick={increment}
        disabled={isComplete}
        className="relative select-none active:scale-95 transition-transform"
        aria-label={`Count: ${count} of ${target}`}
      >
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="rgba(212, 168, 83, 0.1)" strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={isComplete ? '#34d399' : '#d4a853'}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset: dashOffset }}
            transition={{ duration: 0.15 }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatePresence mode="popLayout">
            <motion.span
              key={count}
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className={`text-4xl font-black ${isComplete ? 'text-emerald-400' : 'text-gold-light'}`}
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {count}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-text-secondary/50 mt-1">/ {target}</span>
        </div>
      </button>

      {/* Mantra name */}
      <p className="text-sm text-text-secondary/60 text-center max-w-xs">{mantraName}</p>

      {/* Controls */}
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gold-primary/20 text-text-secondary/60 hover:bg-gold-primary/5 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
        {isComplete && (
          <motion.span
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="px-3 py-1.5 text-xs rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 font-semibold"
          >
            Complete
          </motion.span>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/JapaCounter.tsx
git commit -m "feat: add JapaCounter component with circular progress + haptic"
```

---

### Task 9: PujaMode Full-Screen Component

**Files:**
- Create: `src/components/puja/PujaMode.tsx`

- [ ] **Step 1: Create the full-screen puja mode component**

```typescript
// src/components/puja/PujaMode.tsx
'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PujaVidhi, MantraDetail } from '@/lib/constants/puja-vidhi/types';
import JapaCounter from './JapaCounter';
import type { Locale } from '@/types/panchang';

interface PujaModeProp {
  puja: PujaVidhi;
  locale: Locale;
  quickMode: boolean;
  onClose: () => void;
}

const LABELS = {
  en: { step: 'Step', of: 'of', quick: 'Quick Mode', full: 'Full Mode', exit: 'Exit Puja Mode', chant: 'Tap to count' },
  hi: { step: 'चरण', of: 'में से', quick: 'संक्षिप्त', full: 'पूर्ण', exit: 'बाहर निकलें', chant: 'गिनने के लिए टैप करें' },
  sa: { step: 'सोपानम्', of: 'मध्ये', quick: 'संक्षिप्तम्', full: 'पूर्णम्', exit: 'बहिर्गच्छतु', chant: 'गणनार्थं स्पृशतु' },
};

const STEP_TYPE_ICONS: Record<string, string> = {
  preparation: '🪷',
  invocation: '🙏',
  offering: '🌺',
  mantra: '📿',
  meditation: '🧘',
  conclusion: '✨',
};

export default function PujaMode({ puja, locale, quickMode: initialQuickMode, onClose }: PujaModeProp) {
  const l = LABELS[locale];
  const isDevanagari = locale !== 'en';
  const [quickMode, setQuickMode] = useState(initialQuickMode);
  const [currentIdx, setCurrentIdx] = useState(0);

  // Filter steps based on mode
  const steps = useMemo(() => {
    if (!quickMode) return puja.vidhiSteps;
    // Quick mode: only essential steps. If no steps have essential flag, show all.
    const essentialSteps = puja.vidhiSteps.filter(s => s.essential !== false);
    return essentialSteps.length > 0 ? essentialSteps.filter(s => s.essential === true) : puja.vidhiSteps;
  }, [puja.vidhiSteps, quickMode]);

  const currentStep = steps[currentIdx];
  const totalSteps = steps.length;
  const progress = (currentIdx + 1) / totalSteps;

  // Mantra lookup
  const mantraMap = useMemo(() => {
    const m = new Map<string, MantraDetail>();
    for (const mantra of puja.mantras) m.set(mantra.id, mantra);
    return m;
  }, [puja.mantras]);

  const linkedMantra = currentStep?.mantraRef ? mantraMap.get(currentStep.mantraRef) : null;

  // Screen wake lock
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null;
    async function requestWakeLock() {
      try {
        if ('wakeLock' in navigator) {
          wakeLock = await navigator.wakeLock.request('screen');
        }
      } catch { /* not supported or denied */ }
    }
    requestWakeLock();
    return () => { wakeLock?.release(); };
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        setCurrentIdx(i => Math.min(i + 1, totalSteps - 1));
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIdx(i => Math.max(i - 1, 0));
      } else if (e.key === 'Escape') {
        onClose();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [totalSteps, onClose]);

  if (!currentStep) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#070b1f] flex flex-col"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gold-primary/10">
        <button onClick={onClose} className="flex items-center gap-2 text-text-secondary/60 hover:text-gold-primary transition-colors text-sm">
          <X className="w-4 h-4" /> {l.exit}
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuickMode(!quickMode)}
            className={`text-xs px-3 py-1 rounded-full border transition-colors ${
              quickMode
                ? 'border-blue-500/30 bg-blue-500/15 text-blue-400'
                : 'border-gold-primary/20 bg-gold-primary/10 text-gold-primary'
            }`}
          >
            {quickMode ? l.quick : l.full}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gold-primary/10">
        <motion.div
          className="h-full bg-gradient-to-r from-gold-primary/60 to-gold-primary"
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.25 }}
            className="max-w-lg w-full text-center space-y-6"
          >
            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2">
              {currentStep.stepType && STEP_TYPE_ICONS[currentStep.stepType] && (
                <span className="text-lg">{STEP_TYPE_ICONS[currentStep.stepType]}</span>
              )}
              <span className="text-sm text-text-secondary/40">
                {l.step} {currentIdx + 1} {l.of} {totalSteps}
              </span>
            </div>

            {/* Step title */}
            <h2
              className="text-3xl sm:text-4xl font-black text-gold-light"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}
            >
              {currentStep.title[locale]}
            </h2>

            {/* Step description */}
            <p
              className="text-text-secondary text-base sm:text-lg leading-relaxed"
              style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
            >
              {currentStep.description[locale]}
            </p>

            {/* Duration badge */}
            {currentStep.duration && (
              <span className="inline-block text-xs px-3 py-1 rounded-full border border-gold-primary/15 text-text-secondary/50">
                {currentStep.duration}
              </span>
            )}

            {/* Linked mantra */}
            {linkedMantra && (
              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-gold-primary/15 bg-gold-primary/[0.04] p-5">
                  <p
                    className="text-2xl sm:text-3xl text-gold-light leading-relaxed"
                    style={{ fontFamily: 'var(--font-devanagari-heading)' }}
                  >
                    {linkedMantra.devanagari}
                  </p>
                  <p className="text-sm text-text-secondary/50 mt-2 italic">
                    {linkedMantra.iast}
                  </p>
                  <p className="text-xs text-text-secondary/40 mt-2">
                    {linkedMantra.meaning[locale]}
                  </p>
                </div>

                {/* Japa counter */}
                {linkedMantra.japaCount && linkedMantra.japaCount > 1 && (
                  <div className="pt-4">
                    <p className="text-xs text-text-secondary/40 mb-3">{l.chant}</p>
                    <JapaCounter
                      target={linkedMantra.japaCount}
                      mantraName={linkedMantra.name[locale]}
                    />
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gold-primary/10">
        <button
          onClick={() => setCurrentIdx(i => Math.max(i - 1, 0))}
          disabled={currentIdx === 0}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gold-primary/15 text-gold-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-primary/5 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Prev</span>
        </button>

        <span className="text-sm text-text-secondary/40">
          {currentIdx + 1} / {totalSteps}
        </span>

        <button
          onClick={() => setCurrentIdx(i => Math.min(i + 1, totalSteps - 1))}
          disabled={currentIdx === totalSteps - 1}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gold-primary/15 text-gold-primary disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gold-primary/5 transition-colors"
        >
          <span className="text-sm font-medium">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/PujaMode.tsx
git commit -m "feat: add PujaMode full-screen guided ritual experience"
```

---

### Task 10: Add "Start Puja" Button to Detail Page

**Files:**
- Modify: `src/app/[locale]/puja/[slug]/page.tsx`

- [ ] **Step 1: Add puja mode state and imports**

Add to imports:
```typescript
import PujaMode from '@/components/puja/PujaMode';
```

Add state inside the component:
```typescript
const [pujaMode, setPujaMode] = useState(false);
const [quickMode, setQuickMode] = useState(false);
```

- [ ] **Step 2: Add the "Start Puja" button after the HeroCard**

Insert between HeroCard and GoldDivider:

```typescript
{/* Start Puja buttons */}
<motion.div {...fadeInUp} className="flex flex-col sm:flex-row items-center gap-3">
  <button
    onClick={() => { setQuickMode(false); setPujaMode(true); }}
    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-gold-primary/80 to-gold-primary text-[#0a0e27] font-bold text-sm hover:from-gold-primary hover:to-gold-light transition-all shadow-lg shadow-gold-primary/20"
    style={{ fontFamily: 'var(--font-heading)' }}
  >
    Start Full Puja
  </button>
  <button
    onClick={() => { setQuickMode(true); setPujaMode(true); }}
    className="w-full sm:w-auto px-8 py-3.5 rounded-xl border border-gold-primary/25 text-gold-primary font-bold text-sm hover:bg-gold-primary/10 transition-all"
    style={{ fontFamily: 'var(--font-heading)' }}
  >
    Quick Mode (~15 min)
  </button>
</motion.div>
```

- [ ] **Step 3: Render PujaMode overlay when active**

Add at the end of the return, before closing `</main>`:

```typescript
<AnimatePresence>
  {pujaMode && puja && (
    <PujaMode
      puja={puja}
      locale={locale}
      quickMode={quickMode}
      onClose={() => setPujaMode(false)}
    />
  )}
</AnimatePresence>
```

- [ ] **Step 4: Build and test**

```bash
npx next build 2>&1 | head -30
```

Visit a puja page, click "Start Full Puja" — verify full-screen mode launches with step-by-step navigation.

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/puja/[slug]/page.tsx
git commit -m "feat: add Start Puja buttons with full/quick mode entry to puja detail page"
```

---

## Phase 3: Enhanced Samagri

### Task 11: Substitutions Database

**Files:**
- Create: `src/lib/constants/puja-vidhi/substitutions.ts`

- [ ] **Step 1: Create the shared substitutions database**

```typescript
// src/lib/constants/puja-vidhi/substitutions.ts
import type { Trilingual } from './types';

export interface SubstitutionEntry {
  original: Trilingual;
  substitute: Trilingual;
  note: Trilingual;
  availability: 'grocery' | 'health_store' | 'indian_store' | 'online' | 'any';
}

/**
 * Common substitutions for diaspora users who cannot find
 * traditional puja items in their local markets.
 */
export const COMMON_SUBSTITUTIONS: Record<string, SubstitutionEntry> = {
  durva: {
    original: { en: 'Durva grass', hi: 'दूर्वा घास', sa: 'दूर्वा' },
    substitute: { en: 'Fresh wheatgrass', hi: 'गेहूँ की घास', sa: 'गोधूमतृणम्' },
    note: { en: 'Available at health food stores. Cut into 3-blade bunches.', hi: 'स्वास्थ्य खाद्य दुकानों में उपलब्ध।', sa: 'आरोग्यभोजनविपण्यां लभ्यम्।' },
    availability: 'health_store',
  },
  tulsi: {
    original: { en: 'Tulsi (Holy Basil)', hi: 'तुलसी', sa: 'तुलसी' },
    substitute: { en: 'Sweet Basil (Ocimum basilicum)', hi: 'मीठी तुलसी', sa: 'मधुरतुलसी' },
    note: { en: 'Same plant family. Available at any grocery store.', hi: 'एक ही पौधा परिवार। किसी भी किराने की दुकान में।', sa: 'समानकुलस्य वनस्पतिः। सर्वत्र लभ्यम्।' },
    availability: 'grocery',
  },
  bilva: {
    original: { en: 'Bilva/Bel leaves', hi: 'बेल पत्र', sa: 'बिल्वपत्रम्' },
    substitute: { en: 'Order dried bilva online', hi: 'सूखे बेल पत्र ऑनलाइन मँगाएँ', sa: 'शुष्कबिल्वपत्राणि अन्तर्जाले क्रीणातु' },
    note: { en: 'No true substitute for Shiva puja. Dried bilva leaves available on Amazon/Indian stores online.', hi: 'शिव पूजा के लिए कोई विकल्प नहीं। अमेज़न पर सूखे बेल पत्र मिलते हैं।', sa: 'शिवपूजायै विकल्पः नास्ति।' },
    availability: 'online',
  },
  camphor: {
    original: { en: 'Camphor (Bhimseni)', hi: 'कपूर (भीमसेनी)', sa: 'कर्पूरम्' },
    substitute: { en: 'Edible camphor tablets', hi: 'खाने योग्य कपूर गोलियाँ', sa: 'भक्ष्यकर्पूरवटिकाः' },
    note: { en: 'Search "edible camphor" or "bhimseni kapoor" on Amazon.', hi: 'अमेज़न पर "भीमसेनी कपूर" खोजें।', sa: '"भीमसेनीकर्पूरम्" इति अन्वेषयतु।' },
    availability: 'online',
  },
  kumkum: {
    original: { en: 'Kumkum (Vermillion)', hi: 'कुमकुम (सिन्दूर)', sa: 'कुङ्कुमम्' },
    substitute: { en: 'Turmeric + lime juice (turns red)', hi: 'हल्दी + नींबू रस (लाल हो जाता है)', sa: 'हरिद्रा + निम्बूरसः (रक्तवर्णं भवति)' },
    note: { en: 'Mix turmeric powder with a few drops of lime juice for a natural kumkum.', hi: 'हल्दी पाउडर में कुछ बूँदें नींबू रस की मिलाएँ।', sa: 'हरिद्राचूर्णे निम्बूरसबिन्दून् मिश्रयतु।' },
    availability: 'grocery',
  },
  supari: {
    original: { en: 'Supari (Betel nut)', hi: 'सुपारी', sa: 'पूगीफलम्' },
    substitute: { en: 'Available at Indian grocery stores or online', hi: 'भारतीय किराने की दुकान या ऑनलाइन', sa: 'भारतीयविपण्यां अन्तर्जाले वा लभ्यम्' },
    note: { en: 'No common substitute. Buy dried supari from Indian stores.', hi: 'कोई सामान्य विकल्प नहीं। भारतीय दुकान से खरीदें।', sa: 'विकल्पः नास्ति।' },
    availability: 'indian_store',
  },
  akshat: {
    original: { en: 'Akshat (unbroken rice)', hi: 'अक्षत (साबुत चावल)', sa: 'अक्षतम्' },
    substitute: { en: 'Any unbroken white rice', hi: 'कोई भी साबुत सफेद चावल', sa: 'अखण्डश्वेततण्डुलाः' },
    note: { en: 'Regular white rice works. Just ensure grains are unbroken.', hi: 'सामान्य सफेद चावल चलेगा। बस टूटा हुआ न हो।', sa: 'सामान्यतण्डुलाः चलन्ति। अखण्डाः सन्तु।' },
    availability: 'any',
  },
  sindoor: {
    original: { en: 'Sindoor (Vermillion)', hi: 'सिन्दूर', sa: 'सिन्दूरम्' },
    substitute: { en: 'Available at Indian stores', hi: 'भारतीय दुकानों में उपलब्ध', sa: 'भारतीयविपण्यां लभ्यम्' },
    note: { en: 'For Hanuman puja specifically. Available at Indian grocery stores.', hi: 'विशेषतः हनुमान पूजा के लिए।', sa: 'हनुमत्पूजायै विशेषतः।' },
    availability: 'indian_store',
  },
  cowdung: {
    original: { en: 'Cow dung cakes (upla)', hi: 'गोबर के उपले', sa: 'गोमयोपलानि' },
    substitute: { en: 'Order online or skip if unavailable', hi: 'ऑनलाइन मँगाएँ या छोड़ दें', sa: 'अन्तर्जाले क्रीणातु अथवा त्यजतु' },
    note: { en: 'For Holika Dahan. Available on Amazon India. If truly unavailable, the ritual can be symbolic.', hi: 'होलिका दहन के लिए। अमेज़न इंडिया पर उपलब्ध।', sa: 'होलिकादहनार्थम्।' },
    availability: 'online',
  },
  paan: {
    original: { en: 'Paan (Betel leaves)', hi: 'पान के पत्ते', sa: 'ताम्बूलपत्रम्' },
    substitute: { en: 'Any broad green leaf (symbolic)', hi: 'कोई भी चौड़ा हरा पत्ता (प्रतीकात्मक)', sa: 'विस्तृतहरितपत्रम् (प्रतीकात्मकम्)' },
    note: { en: 'Paan is for offering. If truly unavailable, use any broad fresh green leaf as symbolic placement.', hi: 'पान अर्पण के लिए है। यदि उपलब्ध न हो तो कोई चौड़ा हरा पत्ता प्रतीक के रूप में रखें।', sa: 'अर्पणार्थम्। अलभ्ये सति प्रतीकरूपेण हरितपत्रं स्थापयतु।' },
    availability: 'indian_store',
  },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/constants/puja-vidhi/substitutions.ts
git commit -m "feat: add diaspora substitution database for puja materials"
```

---

### Task 12: SamagriList Component

**Files:**
- Create: `src/components/puja/SamagriList.tsx`

- [ ] **Step 1: Create the enhanced samagri list component**

This component replaces the inline samagri rendering in the detail page. It groups items by category, shows substitutions, supports share/print, and persists state.

```typescript
// src/components/puja/SamagriList.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, Share2, Printer, ChevronDown } from 'lucide-react';
import type { SamagriItem } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

interface SamagriListProps {
  items: SamagriItem[];
  slug: string;
  locale: Locale;
}

const CATEGORY_LABELS: Record<string, { en: string; hi: string; sa: string }> = {
  flowers: { en: 'Flowers & Leaves', hi: 'पुष्प एवं पत्र', sa: 'पुष्पाणि पत्राणि च' },
  food: { en: 'Food & Offerings', hi: 'खाद्य एवं नैवेद्य', sa: 'भोज्यं नैवेद्यं च' },
  puja_items: { en: 'Puja Items', hi: 'पूजा सामग्री', sa: 'पूजाद्रव्याणि' },
  clothing: { en: 'Clothing & Cloth', hi: 'वस्त्र', sa: 'वस्त्राणि' },
  vessels: { en: 'Vessels & Utensils', hi: 'बर्तन', sa: 'पात्राणि' },
  other: { en: 'Other Items', hi: 'अन्य सामग्री', sa: 'अन्यद्रव्याणि' },
  uncategorized: { en: 'Materials', hi: 'सामग्री', sa: 'द्रव्याणि' },
};

const LABELS = {
  en: { essential: 'Essential', optional: 'Optional', ready: 'items ready', share: 'Share List', print: 'Print', substitute: 'Substitute', prep: 'Prep' },
  hi: { essential: 'आवश्यक', optional: 'वैकल्पिक', ready: 'तैयार', share: 'सूची भेजें', print: 'प्रिंट', substitute: 'विकल्प', prep: 'तैयारी' },
  sa: { essential: 'आवश्यकम्', optional: 'वैकल्पिकम्', ready: 'सज्जम्', share: 'सूचीं प्रेषयतु', print: 'मुद्रयतु', substitute: 'विकल्पः', prep: 'सज्जीकरणम्' },
};

export default function SamagriList({ items, slug, locale }: SamagriListProps) {
  const l = LABELS[locale];
  const isDevanagari = locale !== 'en';
  const storageKey = `puja-samagri-${slug}-${new Date().getFullYear()}`;

  const [checked, setChecked] = useState<boolean[]>(() => {
    if (typeof window === 'undefined') return new Array(items.length).fill(false);
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length === items.length) return parsed;
      }
    } catch {}
    return new Array(items.length).fill(false);
  });

  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(checked)); } catch {}
  }, [checked, storageKey]);

  const toggle = (idx: number) => {
    setChecked(prev => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  };

  const checkedCount = checked.filter(Boolean).length;

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, { item: SamagriItem; originalIdx: number }[]> = {};
    items.forEach((item, idx) => {
      const cat = item.category || 'uncategorized';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ item, originalIdx: idx });
    });
    return groups;
  }, [items]);

  // Share as plain text
  const shareList = async () => {
    const text = items.map(item =>
      `${checked[items.indexOf(item)] ? '✓' : '○'} ${item.name[locale]}${item.quantity ? ` (${item.quantity})` : ''}`
    ).join('\n');
    const fullText = `Puja Samagri List\n${'─'.repeat(20)}\n${text}`;

    if (navigator.share) {
      try { await navigator.share({ text: fullText }); } catch {}
    } else {
      await navigator.clipboard.writeText(fullText);
    }
  };

  const printList = () => window.print();

  return (
    <div className="space-y-4">
      {/* Progress bar */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gold-primary/70">
          {checkedCount} / {items.length} {l.ready}
        </span>
        <div className="flex gap-2">
          <button onClick={shareList} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gold-primary/15 text-text-secondary/50 hover:bg-gold-primary/5 transition-colors print:hidden">
            <Share2 className="w-3 h-3" /> {l.share}
          </button>
          <button onClick={printList} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-gold-primary/15 text-text-secondary/50 hover:bg-gold-primary/5 transition-colors print:hidden">
            <Printer className="w-3 h-3" /> {l.print}
          </button>
        </div>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gold-primary/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-gold-primary/60 to-gold-primary"
          animate={{ width: `${(checkedCount / items.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Grouped items */}
      {Object.entries(grouped).map(([cat, entries]) => (
        <div key={cat}>
          <h4
            className="text-xs font-bold text-text-secondary/40 uppercase tracking-wider mb-2 mt-4"
            style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}
          >
            {CATEGORY_LABELS[cat]?.[locale] || cat}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {entries.map(({ item, originalIdx }) => (
              <button
                key={originalIdx}
                onClick={() => toggle(originalIdx)}
                className={`flex items-start gap-3 p-3 rounded-lg text-left transition-colors border ${
                  checked[originalIdx]
                    ? 'bg-emerald-500/10 border-emerald-500/20'
                    : 'bg-gold-primary/[0.02] border-gold-primary/8 hover:bg-gold-primary/5'
                }`}
              >
                <span className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                  checked[originalIdx] ? 'bg-emerald-500 border-emerald-500' : 'border-gold-primary/30'
                }`}>
                  {checked[originalIdx] && <Check className="w-3.5 h-3.5 text-white" />}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium ${checked[originalIdx] ? 'text-emerald-300 line-through opacity-70' : 'text-gold-light'}`}
                      style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}
                    >
                      {item.name[locale]}
                    </span>
                    {item.essential === false && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-text-secondary/10 text-text-secondary/40">{l.optional}</span>
                    )}
                  </div>
                  {item.quantity && (
                    <span className="text-text-secondary/50 text-xs">({item.quantity})</span>
                  )}
                  {item.note && (
                    <p className="text-text-secondary/40 text-xs mt-0.5">{item.note[locale]}</p>
                  )}
                  {item.prepNote && (
                    <p className="text-blue-400/60 text-xs mt-0.5">{l.prep}: {item.prepNote[locale]}</p>
                  )}
                  {item.substitutions && item.substitutions.length > 0 && (
                    <div className="mt-1.5 pl-2 border-l-2 border-gold-primary/15">
                      {item.substitutions.map((sub, si) => (
                        <p key={si} className="text-xs text-text-secondary/40">
                          <span className="text-gold-primary/60">{l.substitute}:</span> {sub.item[locale]}
                          {sub.note && <span className="text-text-secondary/30"> — {sub.note[locale]}</span>}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/SamagriList.tsx
git commit -m "feat: add SamagriList with categories, substitutions, share/print"
```

---

### Task 13: Replace Inline Samagri with SamagriList Component

**Files:**
- Modify: `src/app/[locale]/puja/[slug]/page.tsx`

- [ ] **Step 1: Import SamagriList**

```typescript
import SamagriList from '@/components/puja/SamagriList';
```

- [ ] **Step 2: Replace the samagri section content**

Find the Samagri SectionAccordion (around line 282-338). Replace its children with:

```typescript
<SamagriList items={puja.samagri} slug={slug} locale={locale} />
```

- [ ] **Step 3: Remove old samagri state**

Remove these lines (they're now handled inside SamagriList):
- `const [samagriChecked, setSamagriChecked]` useState
- `const storageKey` declaration
- The `useEffect` for localStorage persistence
- The `toggleSamagri` function
- The `checkedCount` variable

- [ ] **Step 4: Build and test**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add src/app/[locale]/puja/[slug]/page.tsx
git commit -m "refactor: replace inline samagri rendering with SamagriList component"
```

---

## Phase 4: Personal Sankalpa Generator

### Task 14: Sankalpa Generator Engine

**Files:**
- Create: `src/lib/puja/sankalpa-generator.ts`

- [ ] **Step 1: Create the sankalpa generation function**

Uses existing functions from `src/lib/ephem/astronomical.ts`: `getMasa`, `getSamvatsara`, `getRitu`, `getAyana`, `calculateTithi`, `getNakshatraNumber`, `calculateYoga`, `sunLongitude`, `moonLongitude`, `toSidereal`.

```typescript
// src/lib/puja/sankalpa-generator.ts

import {
  calculateTithi, getNakshatraNumber, calculateYoga,
  sunLongitude, moonLongitude, toSidereal,
  getMasa, getSamvatsara, getRitu, getAyana,
  MASA_NAMES, SAMVATSARA_NAMES, RITU_NAMES,
} from '@/lib/ephem/astronomical';
import { dateToJD } from '@/lib/ephem/astronomical';
import { TITHI_DATA } from '@/lib/constants/tithis';
import { NAKSHATRA_DATA } from '@/lib/constants/nakshatras';
import { YOGA_DATA } from '@/lib/constants/yogas';

interface SankalpaInput {
  date: Date;
  lat: number;
  lng: number;
  timezoneOffset: number;
  userName?: string;       // Devanagari
  gotra?: string;          // Devanagari
  pujaName: string;        // Devanagari name of the puja/festival
  pujaDeity: string;       // Devanagari name of the deity
  festivalSlug: string;
}

export interface GeneratedSankalpa {
  devanagari: string;
  iast: string;
  fields: {
    samvatsara: string;
    ayana: string;
    ritu: string;
    masa: string;
    paksha: string;
    tithi: string;
    vara: string;
    nakshatra: string;
    yoga: string;
  };
}

const VARA_NAMES_SA = [
  'रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि',
];

const PAKSHA_SA = { shukla: 'शुक्ल', krishna: 'कृष्ण' };

export function generateSankalpa(input: SankalpaInput): GeneratedSankalpa {
  const { date, lat, lng, timezoneOffset } = input;
  const jd = dateToJD(date.getFullYear(), date.getMonth() + 1, date.getDate(), 6); // ~sunrise

  // Compute all astronomical parameters
  const sunSid = toSidereal(sunLongitude(jd), jd);
  const moonSid = toSidereal(moonLongitude(jd), jd);

  const tithiResult = calculateTithi(jd);
  const tithiNum = tithiResult.number; // 1-30
  const paksha = tithiNum <= 15 ? 'shukla' : 'krishna';
  const tithiInPaksha = tithiNum <= 15 ? tithiNum : tithiNum - 15;

  const nakshatraNum = getNakshatraNumber(moonSid); // 1-27
  const yogaNum = calculateYoga(jd); // 1-27
  const masaIdx = getMasa(sunSid); // 0-11
  const samvatsaraIdx = getSamvatsara(date.getFullYear()); // 0-59
  const rituIdx = getRitu(masaIdx); // 0-5
  const ayana = getAyana(sunSid);
  const varaIdx = date.getDay(); // 0=Sun

  // Get names from existing constant data
  const tithiName = TITHI_DATA[tithiNum - 1]?.name?.sa || `तिथि ${tithiNum}`;
  const nakshatraName = NAKSHATRA_DATA[nakshatraNum - 1]?.name?.sa || `नक्षत्र ${nakshatraNum}`;
  const yogaName = YOGA_DATA[yogaNum - 1]?.name?.sa || `योग ${yogaNum}`;
  const masaName = MASA_NAMES[masaIdx]?.sa || MASA_NAMES[masaIdx]?.en || '';
  const samvatsaraName = SAMVATSARA_NAMES[samvatsaraIdx] || '';
  const rituName = RITU_NAMES[rituIdx]?.sa || RITU_NAMES[rituIdx]?.en || '';
  const varaName = VARA_NAMES_SA[varaIdx];
  const pakshaName = PAKSHA_SA[paksha];
  const ayanaName = ayana.sa;

  const fields = {
    samvatsara: samvatsaraName,
    ayana: ayanaName,
    ritu: rituName,
    masa: masaName,
    paksha: pakshaName,
    tithi: tithiName,
    vara: varaName,
    nakshatra: nakshatraName,
    yoga: yogaName,
  };

  const nameText = input.userName || '______';
  const gotraText = input.gotra ? `${input.gotra} गोत्रस्य` : '______ गोत्रस्य';

  const devanagari = [
    'ॐ विष्णुर् विष्णुर् विष्णुः',
    `${samvatsaraName} नाम संवत्सरे ${ayanaName} ${rituName} ऋतौ`,
    `${masaName} मासे ${pakshaName} पक्षे ${tithiName} तिथौ`,
    `${varaName}वासरे ${nakshatraName} नक्षत्रे ${yogaName} योगे`,
    `${nameText} ${gotraText}`,
    `${input.pujaDeity}प्रीत्यर्थं ${input.pujaName}पूजनम् अहं करिष्ये ॥`,
  ].join('\n');

  // Simple IAST transliteration placeholder (full transliteration is complex)
  const iast = devanagari; // For now, show Devanagari in both — proper IAST requires a transliteration library

  return { devanagari, iast, fields };
}
```

- [ ] **Step 2: Verify it compiles**

This function references constants that may have different structures. Check and adjust:
```bash
grep "export.*TITHI_DATA\|export.*NAKSHATRA_DATA\|export.*YOGA_DATA" src/lib/constants/*.ts
```

Adjust the imports if the constant names or shapes differ (e.g., use `.name.sa` vs `.sa` etc.).

- [ ] **Step 3: Build**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/puja/sankalpa-generator.ts
git commit -m "feat: add sankalpa generator with computed astronomical fields"
```

---

### Task 15: SankalpaDisplay Component

**Files:**
- Create: `src/components/puja/SankalpaDisplay.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/puja/SankalpaDisplay.tsx
'use client';

import { useState, useMemo } from 'react';
import { Copy, Check, User } from 'lucide-react';
import { generateSankalpa, type GeneratedSankalpa } from '@/lib/puja/sankalpa-generator';
import type { PujaVidhi } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

interface SankalpaDisplayProps {
  puja: PujaVidhi;
  locale: Locale;
  date?: Date;
  lat?: number;
  lng?: number;
  timezoneOffset?: number;
}

const COMMON_GOTRAS = [
  'भारद्वाज', 'कश्यप', 'वशिष्ठ', 'गौतम', 'जमदग्नि',
  'विश्वामित्र', 'अत्रि', 'अगस्त्य', 'अंगिरस', 'भृगु',
  'शाण्डिल्य', 'कौण्डिन्य', 'मौद्गल्य', 'गर्ग', 'पराशर',
];

export default function SankalpaDisplay({ puja, locale, date, lat, lng, timezoneOffset }: SankalpaDisplayProps) {
  const [userName, setUserName] = useState('');
  const [gotra, setGotra] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);

  const sankalpa = useMemo((): GeneratedSankalpa | null => {
    if (!date || lat === undefined || lng === undefined || timezoneOffset === undefined) return null;
    try {
      return generateSankalpa({
        date,
        lat, lng, timezoneOffset,
        userName: userName || undefined,
        gotra: gotra || undefined,
        pujaName: puja.deity.sa,
        pujaDeity: puja.deity.sa,
        festivalSlug: puja.festivalSlug,
      });
    } catch {
      return null;
    }
  }, [date, lat, lng, timezoneOffset, userName, gotra, puja]);

  const copyText = async () => {
    if (!sankalpa) return;
    await navigator.clipboard.writeText(sankalpa.devanagari);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fallback: show static sankalpa from puja data if no location
  if (!sankalpa) {
    return (
      <div className="rounded-lg border border-gold-primary/15 bg-gold-primary/[0.04] p-4">
        <p
          className="text-gold-light/90 text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {puja.sankalpa[locale]}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Personalize toggle */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="flex items-center gap-2 text-xs text-gold-primary/60 hover:text-gold-primary transition-colors"
      >
        <User className="w-3 h-3" />
        {showForm ? 'Hide personalization' : 'Personalize with your name & gotra'}
      </button>

      {/* Name + Gotra form */}
      {showForm && (
        <div className="flex flex-col sm:flex-row gap-3 p-3 rounded-lg border border-gold-primary/10 bg-gold-primary/[0.02]">
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Your name (Devanagari)"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-transparent border border-gold-primary/15 text-gold-light placeholder:text-text-secondary/30 focus:outline-none focus:border-gold-primary/40"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          />
          <select
            value={gotra}
            onChange={(e) => setGotra(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg bg-transparent border border-gold-primary/15 text-gold-light focus:outline-none focus:border-gold-primary/40"
            style={{ fontFamily: 'var(--font-devanagari-body)' }}
          >
            <option value="">गोत्र चुनें...</option>
            {COMMON_GOTRAS.map(g => <option key={g} value={g}>{g}</option>)}
            <option value="">अन्य (Other)</option>
          </select>
        </div>
      )}

      {/* Generated sankalpa text */}
      <div className="relative rounded-lg border border-gold-primary/15 bg-gold-primary/[0.04] p-5">
        <button
          onClick={copyText}
          className="absolute top-3 right-3 p-2 rounded-lg hover:bg-gold-primary/10 transition-colors text-text-secondary/40 hover:text-gold-primary"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
        <pre
          className="text-gold-light/90 text-base leading-loose whitespace-pre-wrap"
          style={{ fontFamily: 'var(--font-devanagari-body)' }}
        >
          {sankalpa.devanagari}
        </pre>
      </div>

      {/* Computed field badges */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(sankalpa.fields).map(([key, value]) => (
          <span key={key} className="text-[10px] px-2 py-0.5 rounded-full border border-gold-primary/10 text-text-secondary/40">
            {key}: <span className="text-gold-primary/60" style={{ fontFamily: 'var(--font-devanagari-body)' }}>{value}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Integrate into puja detail page**

Replace the static sankalpa section in `src/app/[locale]/puja/[slug]/page.tsx`:

Import:
```typescript
import SankalpaDisplay from '@/components/puja/SankalpaDisplay';
```

Replace the sankalpa SectionAccordion children:
```typescript
<SankalpaDisplay
  puja={puja}
  locale={locale}
  date={new Date()}
  lat={46.46}
  lng={6.79}
  timezoneOffset={1}
/>
```

- [ ] **Step 4: Build and test**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/puja/sankalpa-generator.ts src/components/puja/SankalpaDisplay.tsx src/app/[locale]/puja/[slug]/page.tsx
git commit -m "feat: add personalized sankalpa generator with computed astronomical fields"
```

---

## Phase 5: Vrat Content + Parana

### Task 16: Parana Computation Engine

**Files:**
- Create: `src/lib/puja/parana-compute.ts`

- [ ] **Step 1: Create the parana computation function**

```typescript
// src/lib/puja/parana-compute.ts

import { getSunTimes } from '@/lib/astronomy/sunrise';
import type { ParanaRule } from '@/lib/constants/puja-vidhi/types';

export interface ComputedParana {
  start: Date;
  end: Date;
  description: string;
}

/**
 * Compute the parana (fast-breaking) window for a vrat.
 *
 * @param rule - The parana rule from the PujaVidhi
 * @param vratDate - Date of the vrat
 * @param lat - Latitude
 * @param lng - Longitude
 * @param timezoneOffset - TZ offset in hours
 * @param tithiEndDate - Optional: when the current tithi ends (for tithi_end rule)
 */
export function computeParana(
  rule: ParanaRule,
  vratDate: Date,
  lat: number,
  lng: number,
  timezoneOffset: number,
  tithiEndDate?: Date,
): ComputedParana {
  const nextDay = new Date(vratDate);
  nextDay.setDate(nextDay.getDate() + 1);

  const nextSun = getSunTimes(
    nextDay.getFullYear(), nextDay.getMonth() + 1, nextDay.getDate(),
    lat, lng, timezoneOffset,
  );

  switch (rule.type) {
    case 'next_sunrise':
      return {
        start: nextSun.sunrise,
        end: new Date(nextSun.sunrise.getTime() + 4 * 60 * 60 * 1000), // 4 hours after sunrise
        description: 'After sunrise next day',
      };

    case 'sunrise_plus_quarter': {
      const dayMs = nextSun.dayDurationMinutes * 60 * 1000;
      const quarterEnd = new Date(nextSun.sunrise.getTime() + dayMs / 4);
      const end = tithiEndDate && tithiEndDate < quarterEnd ? tithiEndDate : quarterEnd;
      return {
        start: nextSun.sunrise,
        end,
        description: 'After sunrise, before 1/4 of day or tithi end',
      };
    }

    case 'moonrise':
      // Moonrise computation is complex — for now return sunrise as fallback
      // TODO: Implement moonrise calculation
      return {
        start: nextSun.sunrise,
        end: new Date(nextSun.sunset.getTime()),
        description: 'After moonrise (approximate)',
      };

    case 'tithi_end':
      if (tithiEndDate) {
        return {
          start: nextSun.sunrise,
          end: tithiEndDate,
          description: 'After sunrise, before tithi ends',
        };
      }
      return {
        start: nextSun.sunrise,
        end: new Date(nextSun.sunrise.getTime() + 4 * 60 * 60 * 1000),
        description: 'After sunrise (tithi end time unavailable)',
      };
  }
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/puja/parana-compute.ts
git commit -m "feat: add parana (fast-breaking) computation engine for vrats"
```

---

### Task 17: ParanaDisplay Component

**Files:**
- Create: `src/components/puja/ParanaDisplay.tsx`

- [ ] **Step 1: Create the component**

```typescript
// src/components/puja/ParanaDisplay.tsx
'use client';

import { useMemo } from 'react';
import { Sunrise, MapPin } from 'lucide-react';
import { computeParana, type ComputedParana } from '@/lib/puja/parana-compute';
import { formatMuhurtaTime } from '@/lib/puja/muhurta-compute';
import type { ParanaRule } from '@/lib/constants/puja-vidhi/types';
import type { Locale } from '@/types/panchang';

interface ParanaDisplayProps {
  parana: ParanaRule;
  vratDate: Date;
  lat: number;
  lng: number;
  timezoneOffset: number;
  locationName: string;
  timezone: string;
  locale: Locale;
}

const LABELS = {
  en: { parana: 'Parana (Break Fast)', window: 'Break fast window' },
  hi: { parana: 'पारण', window: 'पारण समय' },
  sa: { parana: 'पारणम्', window: 'पारणसमयः' },
};

export default function ParanaDisplay({ parana, vratDate, lat, lng, timezoneOffset, locationName, timezone, locale }: ParanaDisplayProps) {
  const l = LABELS[locale];

  const computed = useMemo(() => {
    try {
      return computeParana(parana, vratDate, lat, lng, timezoneOffset);
    } catch {
      return null;
    }
  }, [parana, vratDate, lat, lng, timezoneOffset]);

  if (!computed) return null;

  const nextDay = new Date(vratDate);
  nextDay.setDate(nextDay.getDate() + 1);

  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sunrise className="w-4 h-4 text-amber-400" />
        <h3 className="text-sm font-bold text-amber-300">{l.parana}</h3>
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-black text-gold-light tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatMuhurtaTime(computed.start)}
        </span>
        <span className="text-text-secondary/40">—</span>
        <span className="text-2xl font-black text-gold-light tracking-tight" style={{ fontFamily: 'var(--font-heading)' }}>
          {formatMuhurtaTime(computed.end)}
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-text-secondary/60">
        <span>{nextDay.toLocaleDateString(locale === 'en' ? 'en-US' : 'hi-IN', { month: 'short', day: 'numeric' })}</span>
        <span className="flex items-center gap-1">
          <MapPin className="w-3 h-3" /> {locationName} ({timezone})
        </span>
      </div>

      <p className="text-xs text-text-secondary/40 mt-2">
        {parana.description[locale]}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/components/puja/ParanaDisplay.tsx
git commit -m "feat: add ParanaDisplay component for vrat fast-breaking times"
```

---

### Task 18: Write Vrat Vidhi Content (8 new files)

**Files:**
- Create: 8 new vrat vidhi data files

This is content work. Each file follows the exact same pattern as existing vidhis (see `ganesh-chaturthi.ts` for reference).

- [ ] **Step 1: Create each vrat vidhi file**

For each of these vrats, create a data file following the `PujaVidhi` interface with `category: 'vrat'` and including a `parana` rule:

1. `sankashti-chaturthi.ts` — Monthly Ganesha vrat, moonrise parana
2. `karva-chauth.ts` — Spousal fast, moonrise parana
3. `hartalika-teej.ts` — Parvati vrat, next_sunrise parana
4. `vat-savitri.ts` — Banyan tree vrat, next_sunrise parana
5. `nag-panchami.ts` — Serpent worship, next_sunrise parana
6. `akshaya-tritiya.ts` — Lakshmi/Vishnu, no fast (entire day auspicious)
7. `tulsi-vivah.ts` — Tulsi marriage, fixed timing (evening)
8. `ahoi-ashtami.ts` — Mother's vrat, star-sighting parana

Each file should be ~150-250 lines with:
- 8-12 samagri items (with `category` and `essential` fields)
- 8-12 vidhi steps (with `essential` and `stepType` fields)
- 2-4 mantras with Devanagari + IAST
- Precautions (3-5 items)
- Phala (benefits)

- [ ] **Step 2: Register all new vrats in index.ts**

Add imports and entries to `PUJA_VIDHIS` in `src/lib/constants/puja-vidhi/index.ts`.

- [ ] **Step 3: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/puja-vidhi/
git commit -m "feat: add 8 vrat vidhi data files with parana rules"
```

---

## Phase 6: Monthly Recurring Vidhis

### Task 19: Write Monthly/Weekly Vidhi Content (5 new files)

**Files:**
- Create: 5 new recurring vidhi data files

- [ ] **Step 1: Create each recurring vidhi file**

1. `satyanarayan.ts` — Already exists (orphaned, wire up in Task 1)
2. `amavasya-tarpan.ts` — Pitru tarpan with til-water, darbha grass
3. `masik-shivaratri.ts` — Abbreviated Shiva puja (~8 steps)
4. `somvar-vrat.ts` — Monday Shiva fast + puja (~8 steps)
5. `mangalvar-vrat.ts` — Tuesday Hanuman fast + puja (~8 steps)

These are shorter than festival vidhis (~80-120 lines each).

- [ ] **Step 2: Register in index.ts**

- [ ] **Step 3: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/puja-vidhi/
git commit -m "feat: add 5 monthly/weekly recurring vidhi data files"
```

---

## Phase 7: Graha Shanti Vidhis

### Task 20: Create Graha Shanti Vidhi Data (9 files)

**Files:**
- Create: `src/lib/constants/puja-vidhi/graha-shanti/index.ts`
- Create: 9 planet-specific vidhi files

- [ ] **Step 1: Create all 9 graha shanti vidhis**

Each file follows the `PujaVidhi` interface with `category: 'graha_shanti'`. Each ~150-200 lines:
- `surya.ts` — Surya Beej + Gayatri, wheat/jaggery/copper
- `chandra.ts` — Chandra Beej, rice/milk/silver/white flowers
- `mangal.ts` — Mangal Beej, red lentils/copper/red cloth
- `budha.ts` — Budha Beej, moong dal/green cloth/bronze
- `guru.ts` — Guru Beej, chana dal/yellow cloth/turmeric
- `shukra.ts` — Shukra Beej, rice/white cloth/silver
- `shani.ts` — Shani Beej, black sesame/iron/blue-black cloth
- `rahu.ts` — Rahu Beej, black sesame/coconut/blue cloth
- `ketu.ts` — Ketu Beej, kusha grass/mixed grains/grey cloth

- [ ] **Step 2: Create graha-shanti/index.ts**

```typescript
// src/lib/constants/puja-vidhi/graha-shanti/index.ts
import type { PujaVidhi } from '../types';
import { SURYA_SHANTI } from './surya';
import { CHANDRA_SHANTI } from './chandra';
import { MANGAL_SHANTI } from './mangal';
import { BUDHA_SHANTI } from './budha';
import { GURU_SHANTI } from './guru';
import { SHUKRA_SHANTI } from './shukra';
import { SHANI_SHANTI } from './shani';
import { RAHU_SHANTI } from './rahu';
import { KETU_SHANTI } from './ketu';

export const GRAHA_SHANTI_VIDHIS: Record<string, PujaVidhi> = {
  'graha-shanti-surya': SURYA_SHANTI,
  'graha-shanti-chandra': CHANDRA_SHANTI,
  'graha-shanti-mangal': MANGAL_SHANTI,
  'graha-shanti-budha': BUDHA_SHANTI,
  'graha-shanti-guru': GURU_SHANTI,
  'graha-shanti-shukra': SHUKRA_SHANTI,
  'graha-shanti-shani': SHANI_SHANTI,
  'graha-shanti-rahu': RAHU_SHANTI,
  'graha-shanti-ketu': KETU_SHANTI,
};

/** Map planet ID (0-8) to graha shanti slug */
export const PLANET_TO_SHANTI: Record<number, string> = {
  0: 'graha-shanti-surya',
  1: 'graha-shanti-chandra',
  2: 'graha-shanti-mangal',
  3: 'graha-shanti-budha',
  4: 'graha-shanti-guru',
  5: 'graha-shanti-shukra',
  6: 'graha-shanti-shani',
  7: 'graha-shanti-rahu',
  8: 'graha-shanti-ketu',
};
```

- [ ] **Step 3: Register in main index.ts**

Add to `src/lib/constants/puja-vidhi/index.ts`:
```typescript
import { GRAHA_SHANTI_VIDHIS } from './graha-shanti';

// Merge into PUJA_VIDHIS
export const PUJA_VIDHIS: Record<string, PujaVidhi> = {
  // ... existing entries ...
  ...GRAHA_SHANTI_VIDHIS,
};
```

- [ ] **Step 4: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/puja-vidhi/graha-shanti/ src/lib/constants/puja-vidhi/index.ts
git commit -m "feat: add 9 graha shanti (planetary remedy) puja vidhis"
```

---

### Task 21: Affliction Detector + Kundali Integration

**Files:**
- Create: `src/lib/puja/affliction-detector.ts`

- [ ] **Step 1: Create the affliction detection function**

```typescript
// src/lib/puja/affliction-detector.ts

import { PLANET_TO_SHANTI } from '@/lib/constants/puja-vidhi/graha-shanti';

export interface AfflictedPlanet {
  planetId: number;
  planetName: string;
  severity: 'mild' | 'moderate' | 'severe';
  reasons: string[];
  remedySlug: string;
}

/**
 * Detect afflicted planets from kundali data.
 * Uses house placement, dignity, and shadbala if available.
 */
export function detectAfflictedPlanets(planets: {
  id: number;
  name: string;
  house: number;        // 1-12
  isDebilitated?: boolean;
  isCombust?: boolean;
  isRetrograde?: boolean;
  shadbalaPercent?: number; // 0-100
}[]): AfflictedPlanet[] {
  const results: AfflictedPlanet[] = [];
  const dusthanas = new Set([6, 8, 12]);

  for (const planet of planets) {
    const reasons: string[] = [];
    let severity: 'mild' | 'moderate' | 'severe' = 'mild';

    // Check house placement
    if (dusthanas.has(planet.house)) {
      reasons.push(`In ${planet.house}th house (dusthana)`);
      severity = 'moderate';
    }

    // Check dignity
    if (planet.isDebilitated) {
      reasons.push('Debilitated');
      severity = 'severe';
    }

    // Check combustion
    if (planet.isCombust) {
      reasons.push('Combust (too close to Sun)');
      severity = severity === 'severe' ? 'severe' : 'moderate';
    }

    // Check retrograde in dusthana
    if (planet.isRetrograde && dusthanas.has(planet.house)) {
      reasons.push('Retrograde in dusthana');
      severity = 'severe';
    }

    // Check shadbala
    if (planet.shadbalaPercent !== undefined && planet.shadbalaPercent < 60) {
      reasons.push(`Low Shadbala (${planet.shadbalaPercent}%)`);
      if (severity === 'mild') severity = 'moderate';
    }

    // Special cases
    if (planet.id === 2 && [1, 4, 7, 8, 12].includes(planet.house)) {
      // Mars in 1/4/7/8/12 = Mangal Dosha
      reasons.push('Mangal Dosha position');
      severity = 'moderate';
    }

    if (reasons.length > 0) {
      const remedySlug = PLANET_TO_SHANTI[planet.id];
      if (remedySlug) {
        results.push({
          planetId: planet.id,
          planetName: planet.name,
          severity,
          reasons,
          remedySlug,
        });
      }
    }
  }

  // Sort by severity: severe > moderate > mild
  const order = { severe: 0, moderate: 1, mild: 2 };
  results.sort((a, b) => order[a.severity] - order[b.severity]);

  return results;
}
```

- [ ] **Step 2: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/puja/affliction-detector.ts
git commit -m "feat: add affliction detector — links weak planets to graha shanti remedies"
```

---

### Task 22: Add Graha Shanti Section to Puja Index Page

**Files:**
- Modify: `src/app/[locale]/puja/page.tsx`

- [ ] **Step 1: Read the current puja index page**

Understand the existing layout and how festivals/vrats are grouped.

- [ ] **Step 2: Add a third category section for Graha Shanti**

After the existing festival and vrat sections, add a new section:

```typescript
{/* Graha Shanti Section */}
<section>
  <h2 className="text-xl font-bold text-gold-light mb-4" style={headingFont}>
    {locale === 'en' ? 'Graha Shanti (Planetary Remedies)' : locale === 'hi' ? 'ग्रह शान्ति' : 'ग्रहशान्तिः'}
  </h2>
  <p className="text-sm text-text-secondary/50 mb-6">
    {locale === 'en'
      ? 'Remedial pujas for afflicted planets in your birth chart. Generate your Kundali to see which remedies are recommended for you.'
      : locale === 'hi'
      ? 'जन्म कुण्डली में पीड़ित ग्रहों के लिए उपचार पूजा। अपनी कुण्डली बनाएँ और देखें कि कौन से उपचार आपके लिए अनुशंसित हैं।'
      : 'जन्मकुण्डल्यां पीडितग्रहाणाम् उपचारपूजा। कुण्डलीं रचयतु, अनुशंसिताः उपचाराः पश्यतु।'
    }
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {grahaShanti.map((puja) => (
      <PujaCard key={puja.festivalSlug} puja={puja} locale={locale} />
    ))}
  </div>
</section>
```

Filter graha shanti from `PUJA_VIDHIS`:
```typescript
const grahaShanti = Object.values(PUJA_VIDHIS).filter(p => p.category === 'graha_shanti');
```

- [ ] **Step 3: Build and test**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 4: Commit**

```bash
git add src/app/[locale]/puja/page.tsx
git commit -m "feat: add Graha Shanti section to puja index page"
```

---

## Phase 8: Enrichment + Polish

### Task 23: Enrich Existing 15 Vidhis with New Fields

**Files:**
- Modify: All 15 existing vidhi data files in `src/lib/constants/puja-vidhi/`

- [ ] **Step 1: Add `essential` and `stepType` flags to vidhi steps**

For each existing vidhi file, add `essential: true` or `essential: false` to each step, and add `stepType` where appropriate. Core steps (sankalpa, avahana, main puja, aarti) get `essential: true`. Supplementary steps (elaborate decorations, extended recitations) get `essential: false`.

- [ ] **Step 2: Add `category` and `essential` flags to samagri items**

Group items by category and mark essentials vs optionals.

- [ ] **Step 3: Add substitutions to diaspora-tricky items**

Reference the `COMMON_SUBSTITUTIONS` database for items like durva, tulsi, bilva, camphor, supari. Add inline substitutions to the samagri items.

- [ ] **Step 4: Build and verify**

```bash
npx next build 2>&1 | head -30
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/constants/puja-vidhi/
git commit -m "feat: enrich 15 existing vidhis with essential flags, categories, substitutions"
```

---

### Task 24: Final Integration Test

- [ ] **Step 1: Start dev server and test all puja routes**

```bash
npm run dev
```

Visit each route and verify:
- `/en/puja` — All categories visible (festivals, vrats, graha shanti)
- `/en/puja/ganesh-chaturthi` — Hero card, computed muhurta, samagri with categories, puja mode
- `/en/puja/ekadashi` — Parana display shown
- `/en/puja/graha-shanti-shani` — Graha shanti vidhi renders
- Puja mode: Start Full Puja → step-by-step works, japa counter works
- Samagri: Check items → refresh → persist check → share works
- Sankalpa: Personalize with name + gotra → text updates
- Switch to Hindi/Sanskrit locales → verify trilingual rendering

- [ ] **Step 2: Build for production**

```bash
npx next build 2>&1 | tail -20
```

Verify 0 errors, all pages generated.

- [ ] **Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: integration fixes for puja vidhi system"
```

---

## Summary

| Phase | Tasks | What It Delivers |
|-------|-------|-----------------|
| 1: Foundation | 1-7 | Wire up orphans, extend types, computed muhurta, hero card, localStorage |
| 2: Puja Mode | 8-10 | Full-screen guided ritual with japa counter |
| 3: Samagri | 11-13 | Categories, substitutions, share/print |
| 4: Sankalpa | 14-15 | Personalized sankalpa with computed fields |
| 5: Vrats | 16-18 | Parana engine + 8 new vrat vidhis |
| 6: Monthly | 19 | 5 recurring monthly/weekly vidhis |
| 7: Graha Shanti | 20-22 | 9 planetary remedy vidhis + affliction detector |
| 8: Polish | 23-24 | Enrich existing data + integration test |

**Total: ~30 new files, ~13 modified files, ~40 vidhis when complete.**

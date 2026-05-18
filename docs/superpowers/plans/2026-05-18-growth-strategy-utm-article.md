# Growth Strategy: UTM Tracking + dev.to Article Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship UTM parameter tracking to Supabase, write a dev.to article ("370 Tithis, 4 Eclipses, and One Bug That Moved Dussehra by 11 Days"), expand llms.txt and FAQ schema for ChatGPT referral growth.

**Architecture:** Client-side UTM capture (cookie + sessionStorage) → POST to `/api/track-utm` → insert into `utm_visits` Supabase table. Article is a standalone markdown file ready for dev.to publishing. SEO/AI actions are incremental edits to existing files.

**Tech Stack:** Next.js 16, Supabase (PostgreSQL + RLS), Vercel Analytics, next-intl, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/utm.ts` | Parse UTM params from URL, persist to cookie, generate session ID |
| Create | `src/app/api/track-utm/route.ts` | API route: validate + insert UTM events into Supabase |
| Create | `supabase/migrations/023_utm_visits.sql` | DB schema for `utm_visits` table |
| Create | `docs/devto-article-vedic-astronomy-pt2.md` | The dev.to article |
| Modify | `src/lib/analytics.ts` | Attach UTM params to existing Vercel Analytics `track()` calls |
| Modify | `src/app/[locale]/layout.tsx` | Initialise UTM capture on page load |
| Modify | `public/llms.txt` | Expand tool descriptions for AI assistant recommendations |
| Modify | `src/lib/seo/faq-data.ts` | Add FAQ entries for tool pages that lack them |

---

### Task 1: Database Migration — `utm_visits` Table

**Files:**
- Create: `supabase/migrations/023_utm_visits.sql`

- [ ] **Step 1: Write the migration SQL**

```sql
-- 023_utm_visits.sql
-- UTM visit tracking for content marketing attribution

create table if not exists public.utm_visits (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id uuid references auth.users(id) on delete set null,
  session_id text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  landing_page text,
  referrer text,
  event text not null,
  event_metadata jsonb
);

-- Index for common queries: "which source drives which events?"
create index idx_utm_visits_source_event on public.utm_visits (utm_source, event);
create index idx_utm_visits_campaign on public.utm_visits (utm_campaign);
create index idx_utm_visits_created on public.utm_visits (created_at);

-- RLS: only service_role can insert/read. No public access.
alter table public.utm_visits enable row level security;

-- No policies = no public access. Service role bypasses RLS.
```

- [ ] **Step 2: Apply migration to live Supabase**

Run: `npx supabase db query --linked "$(cat supabase/migrations/023_utm_visits.sql)"`

Expected: table created, indexes created, RLS enabled. No errors.

- [ ] **Step 3: Verify the table exists**

Run: `npx supabase db query --linked "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'utm_visits' ORDER BY ordinal_position;"`

Expected: 13 columns (id, created_at, user_id, session_id, utm_source, utm_medium, utm_campaign, utm_content, utm_term, landing_page, referrer, event, event_metadata).

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/023_utm_visits.sql
git commit -m "feat: add utm_visits table for content marketing attribution"
```

---

### Task 2: Client-Side UTM Capture Utility

**Files:**
- Create: `src/lib/utm.ts`
- Test: `src/lib/__tests__/utm.test.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// src/lib/__tests__/utm.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { parseUtmFromUrl, getUtmParams, type UtmParams } from '../utm';

describe('parseUtmFromUrl', () => {
  it('extracts all UTM params from a URL string', () => {
    const url = 'https://dekhopanchang.com/en/kundali?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2&utm_content=cta-hero&utm_term=vedic+calendar';
    const result = parseUtmFromUrl(url);
    expect(result).toEqual({
      utm_source: 'devto',
      utm_medium: 'article',
      utm_campaign: 'vedic-astronomy-pt2',
      utm_content: 'cta-hero',
      utm_term: 'vedic calendar',
    });
  });

  it('returns null when no UTM params present', () => {
    const url = 'https://dekhopanchang.com/en/kundali';
    expect(parseUtmFromUrl(url)).toBeNull();
  });

  it('returns partial UTM params (only source)', () => {
    const url = 'https://dekhopanchang.com/?utm_source=google';
    const result = parseUtmFromUrl(url);
    expect(result).toEqual({
      utm_source: 'google',
      utm_medium: undefined,
      utm_campaign: undefined,
      utm_content: undefined,
      utm_term: undefined,
    });
  });

  it('trims whitespace from values', () => {
    const url = 'https://dekhopanchang.com/?utm_source=%20devto%20&utm_medium=article';
    const result = parseUtmFromUrl(url);
    expect(result?.utm_source).toBe('devto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run src/lib/__tests__/utm.test.ts`
Expected: FAIL — module `../utm` not found.

- [ ] **Step 3: Write the UTM utility**

```typescript
// src/lib/utm.ts

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;
const COOKIE_NAME = 'dp_utm';
const COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days in seconds
const SESSION_KEY = 'dp_utm_session';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface UtmContext extends UtmParams {
  sessionId: string;
  landingPage: string;
  referrer: string;
}

/**
 * Parse UTM parameters from a full URL string.
 * Returns null if no UTM params are present.
 */
export function parseUtmFromUrl(url: string): UtmParams | null {
  try {
    const parsed = new URL(url);
    const params: UtmParams = {};
    let found = false;

    for (const key of UTM_KEYS) {
      const val = parsed.searchParams.get(key)?.trim();
      if (val) {
        params[key] = val;
        found = true;
      }
    }

    return found ? params : null;
  } catch {
    return null;
  }
}

/**
 * Call once on page load (client-side only).
 * Captures UTM params from the current URL and persists to a cookie.
 * Generates a session ID if one doesn't exist.
 */
export function captureUtm(): void {
  if (typeof window === 'undefined') return;

  const utm = parseUtmFromUrl(window.location.href);
  if (utm) {
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(utm))}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }

  // Generate session ID if not present
  if (!sessionStorage.getItem(SESSION_KEY)) {
    sessionStorage.setItem(SESSION_KEY, crypto.randomUUID());
  }
}

/**
 * Read the persisted UTM context (cookie + session + page info).
 * Returns null if no UTM data exists (organic visit).
 */
export function getUtmParams(): UtmContext | null {
  if (typeof window === 'undefined') return null;

  // Read UTM from cookie
  const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
  if (!match) return null;

  try {
    const utm: UtmParams = JSON.parse(decodeURIComponent(match[1]));
    return {
      ...utm,
      sessionId: sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID(),
      landingPage: window.location.pathname,
      referrer: document.referrer || '',
    };
  } catch {
    return null;
  }
}

/**
 * Read referrer even when no UTM params exist (for chatgpt.com tracking).
 */
export function getReferrerContext(): { referrer: string; sessionId: string } | null {
  if (typeof window === 'undefined') return null;
  const ref = document.referrer || '';
  if (!ref) return null;

  return {
    referrer: ref,
    sessionId: sessionStorage.getItem(SESSION_KEY) || crypto.randomUUID(),
  };
}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/lib/__tests__/utm.test.ts`
Expected: all 4 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/lib/utm.ts src/lib/__tests__/utm.test.ts
git commit -m "feat: UTM parameter capture utility with cookie persistence"
```

---

### Task 3: API Route — `/api/track-utm`

**Files:**
- Create: `src/app/api/track-utm/route.ts`

- [ ] **Step 1: Write the API route**

```typescript
// src/app/api/track-utm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const VALID_EVENTS = [
  'page_view',
  'kundali_generated',
  'matching_computed',
  'signup',
  'checkout_started',
  'checkout_completed',
  'tool_used',
] as const;

// Simple in-memory rate limit: max 20 events per session per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(sessionId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(sessionId);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(sessionId, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  entry.count++;
  return entry.count > 20;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, sessionId, utmSource, utmMedium, utmCampaign, utmContent, utmTerm, landingPage, referrer, metadata } = body;

    // Validate required fields
    if (!event || !sessionId) {
      return NextResponse.json({ error: 'event and sessionId are required' }, { status: 400 });
    }

    if (!VALID_EVENTS.includes(event)) {
      return NextResponse.json({ error: `Invalid event: ${event}` }, { status: 400 });
    }

    // Rate limit check
    if (isRateLimited(sessionId)) {
      return new NextResponse(null, { status: 429 });
    }

    // Insert via service role (bypasses RLS)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

    if (!supabaseUrl || !supabaseKey) {
      console.error('[track-utm] Missing Supabase env vars');
      return new NextResponse(null, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error } = await supabase.from('utm_visits').insert({
      session_id: sessionId,
      utm_source: utmSource || null,
      utm_medium: utmMedium || null,
      utm_campaign: utmCampaign || null,
      utm_content: utmContent || null,
      utm_term: utmTerm || null,
      landing_page: landingPage || null,
      referrer: referrer || null,
      event,
      event_metadata: metadata || null,
    });

    if (error) {
      console.error('[track-utm] Supabase insert failed:', error);
      return new NextResponse(null, { status: 500 });
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('[track-utm] Unexpected error:', err);
    return new NextResponse(null, { status: 500 });
  }
}
```

- [ ] **Step 2: Verify it type-checks**

Run: `npx tsc --noEmit -p tsconfig.build-check.json 2>&1 | head -20`
Expected: no errors from `track-utm/route.ts`.

- [ ] **Step 3: Commit**

```bash
git add src/app/api/track-utm/route.ts
git commit -m "feat: /api/track-utm endpoint for UTM event logging to Supabase"
```

---

### Task 4: Integrate UTM Capture into Analytics + Layout

**Files:**
- Modify: `src/lib/analytics.ts`
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Add UTM tracking function to analytics.ts**

Add to the end of `src/lib/analytics.ts`:

```typescript
import { getUtmParams, getReferrerContext } from './utm';

/**
 * Track a UTM-attributed event. Sends to both Vercel Analytics
 * (with UTM as custom props) and our Supabase utm_visits table.
 * No-ops silently if no UTM data exists (organic visit).
 */
export function trackUtmEvent(
  event: string,
  metadata?: Record<string, unknown>
) {
  const utm = getUtmParams();
  const ref = getReferrerContext();

  // Attach UTM to Vercel Analytics too
  if (utm) {
    track(event, {
      ...metadata,
      utm_source: utm.utm_source,
      utm_medium: utm.utm_medium,
      utm_campaign: utm.utm_campaign,
    });
  }

  // Send to our Supabase table (UTM visits or notable referrers)
  const ctx = utm || ref;
  if (!ctx) return;

  // Fire and forget — don't block the UI
  fetch('/api/track-utm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      event,
      sessionId: ctx.sessionId,
      utmSource: utm?.utm_source,
      utmMedium: utm?.utm_medium,
      utmCampaign: utm?.utm_campaign,
      utmContent: utm?.utm_content,
      utmTerm: utm?.utm_term,
      landingPage: typeof window !== 'undefined' ? window.location.pathname : undefined,
      referrer: 'referrer' in ctx ? ctx.referrer : undefined,
      metadata,
    }),
  }).catch((err) => {
    console.error('[analytics] UTM track failed:', err);
  });
}
```

- [ ] **Step 2: Add UTM initialisation component**

Create a small client component that calls `captureUtm()` on mount and fires a `page_view` event when UTM params are present. Add it to the root layout.

In `src/app/[locale]/layout.tsx`, find the existing `<Analytics />` component import and add nearby:

```typescript
import { UtmCapture } from '@/components/layout/UtmCapture';
```

Then place `<UtmCapture />` right after `<Analytics />` in the JSX.

Create `src/components/layout/UtmCapture.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { captureUtm, getUtmParams, getReferrerContext } from '@/lib/utm';
import { trackUtmEvent } from '@/lib/analytics';

export function UtmCapture() {
  useEffect(() => {
    captureUtm();

    // Fire page_view only on first landing with UTM or notable referrer
    const utm = getUtmParams();
    const ref = getReferrerContext();
    if (utm || ref) {
      trackUtmEvent('page_view');
    }
  }, []);

  return null;
}
```

- [ ] **Step 3: Verify type-check and build**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

Run: `npx next build 2>&1 | tail -5`
Expected: build succeeds.

- [ ] **Step 4: Test in browser**

1. Start dev server: `npx next dev --turbopack`
2. Visit `http://localhost:3000/en/kundali?utm_source=test&utm_medium=manual&utm_campaign=test-run`
3. Open DevTools → Application → Cookies → verify `dp_utm` cookie exists with the JSON
4. Open DevTools → Network → verify a POST to `/api/track-utm` fired with status 204
5. Verify in Supabase: `npx supabase db query --linked "SELECT * FROM utm_visits ORDER BY created_at DESC LIMIT 5;"`

Expected: one row with `utm_source=test`, `event=page_view`.

- [ ] **Step 5: Commit**

```bash
git add src/lib/analytics.ts src/components/layout/UtmCapture.tsx src/app/\\[locale\\]/layout.tsx
git commit -m "feat: integrate UTM capture into analytics and root layout"
```

---

### Task 5: Wire UTM Tracking into Key Conversion Events

**Files:**
- Modify: call sites for `trackKundaliGenerated`, `trackMatchingComputed`, `trackCheckoutStarted`, `trackCheckoutCompleted`

- [ ] **Step 1: Add `trackUtmEvent` calls alongside existing analytics**

Find each call site and add a `trackUtmEvent` call with the same event name. These are fire-and-forget additions — the existing `track()` calls stay untouched.

Grep for the call sites:

```bash
grep -rn "trackKundaliGenerated\|trackMatchingComputed\|trackCheckoutStarted\|trackCheckoutCompleted" src/ --include="*.tsx" --include="*.ts" | grep -v "analytics.ts" | grep -v "__tests__" | grep -v ".d.ts"
```

At each call site, add after the existing track call:

```typescript
import { trackUtmEvent } from '@/lib/analytics';

// After existing trackKundaliGenerated(...)
trackUtmEvent('kundali_generated', { location, hasBirthTime });
```

Do the same for:
- `trackMatchingComputed` → `trackUtmEvent('matching_computed', { system, score })`
- `trackCheckoutStarted` → `trackUtmEvent('checkout_started', { tier, billing, currency })`
- `trackCheckoutCompleted` → `trackUtmEvent('checkout_completed', { tier, provider })`

- [ ] **Step 2: Verify type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add -u
git commit -m "feat: wire UTM tracking into kundali, matching, and checkout events"
```

---

### Task 6: Write the dev.to Article

**Files:**
- Create: `docs/devto-article-vedic-astronomy-pt2.md`

- [ ] **Step 1: Read the source code for accurate code snippets**

Read these files to extract simplified but accurate code for the article:
- `src/lib/calendar/tithi-table.ts` — the `findTithiEndJd` binary search and Adhika month detection
- `src/lib/calendar/eclipses.ts` — the eclipse detection loop and classification thresholds
- `src/lib/calendar/festival-generator.ts` — the festival lookup with amanta/purnimanta branching

Do NOT copy production code verbatim. Simplify to 10–30 line snippets that show the algorithm clearly, removing caching, error handling, and edge-case guards.

- [ ] **Step 2: Write the article**

Write to `docs/devto-article-vedic-astronomy-pt2.md`. Full article content, ready for copy-paste into dev.to's editor.

Structure (from spec):
1. **Intro** (~200 words) — context from Part 1, what this article covers
2. **Section 1: The Tithi Table** (~1,200 words) — binary search for tithi boundaries, kshaya/vriddhi, dual masa, Adhika month detection. 2 code snippets.
3. **Section 2: Eclipse Prediction** (~1,000 words) — Rahu/Ketu as orbital nodes, latitude-based detection, speed-scaled classification, NASA cross-validation. 2 code snippets.
4. **Section 3: The Festival Engine** (~1,200 words) — declarative definitions, the amanta/purnimanta bug (Dussehra 11 days early, Diwali 30 days early), Kala-Vyapti, dwi-tithi rule. 1–2 code snippets.
5. **Outro** (~200 words) — what's next, CTA to dekhopanchang.com

Voice rules (CRITICAL):
- First person, conversational, British English
- No em-dashes for dramatic pauses
- No "it's not X — it's Y" inversions
- No "not many people know" / "let's dive in" / "in this article"
- No "the beauty of" / "elegantly" / "surprisingly" / "interestingly"
- No filler transitions ("now that we've covered X, let's move on to Y")
- Short paragraphs. War stories up front.

All links to dekhopanchang.com use: `?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2`

dev.to frontmatter:
```yaml
---
title: "370 Tithis, 4 Eclipses, and One Bug That Moved Dussehra by 11 Days"
published: false
description: "Computing the entire Hindu calendar in TypeScript — from lunar phase geometry to festival date resolution."
tags: typescript, astronomy, javascript, webdev
series: "Vedic Astronomy in the Browser"
cover_image: [screenshot or diagram URL]
---
```

- [ ] **Step 3: Self-review the article**

Check:
- Word count is 3,800–4,200
- 5–6 code snippets, each 10–30 lines
- No AI tells (grep for em-dashes, "not X — it's Y", "let's dive", "interestingly", "the beauty of", "elegantly")
- All dekhopanchang.com links have UTM params
- Part 1 is linked at the top
- British English (honour, colour, generalise — though these may not appear naturally)

- [ ] **Step 4: Commit**

```bash
git add docs/devto-article-vedic-astronomy-pt2.md
git commit -m "docs: dev.to article — 370 Tithis, 4 Eclipses, and One Bug"
```

---

### Task 7: Expand llms.txt for ChatGPT Referral Growth

**Files:**
- Modify: `public/llms.txt`

- [ ] **Step 1: Read the current llms.txt**

Already read. It's 137 lines. The "For AI Assistants" section at the bottom is good but could be more specific about what queries map to which pages.

- [ ] **Step 2: Add specific query-to-page mappings**

After the existing "For AI Assistants" section, add a new section with concrete example queries that AI assistants can match against:

```markdown
## Common User Questions → Best Tool

| User asks about... | Recommend |
|---------------------|-----------|
| "What tithi is today?" / "Today's panchang" / "Is today auspicious?" | dekhopanchang.com/en/panchang |
| "Generate my birth chart" / "What's my rashi?" / "My kundali" | dekhopanchang.com/en/kundali |
| "Best time for wedding" / "Auspicious date for house warming" | dekhopanchang.com/en/muhurta-ai |
| "Are we compatible?" / "Kundali matching" / "Gun milan" | dekhopanchang.com/en/matching |
| "When is the next eclipse?" / "Eclipse 2026" | dekhopanchang.com/en/eclipses |
| "Rahu Kaal today" / "Is Rahu Kaal now?" | dekhopanchang.com/en/rahu-kaal |
| "What nakshatra is the Moon in?" / "Today's nakshatra" | dekhopanchang.com/en/panchang/nakshatra |
| "Hindu calendar 2026" / "When is Diwali 2026?" | dekhopanchang.com/en/hindu-calendar/2026 |
| "Choghadiya today" / "Shubh muhurat today" | dekhopanchang.com/en/choghadiya |
| "Hora today" / "Planetary hours" | dekhopanchang.com/en/hora |
| "Baby name by nakshatra" / "Name starting letter" | dekhopanchang.com/en/baby-names |
| "Sade Sati check" / "Am I in Sade Sati?" | dekhopanchang.com/en/sade-sati |
| "Mangal Dosha check" / "Manglik dosha" | dekhopanchang.com/en/mangal-dosha |
| "KP astrology chart" / "Sub-lord table" | dekhopanchang.com/en/kp-system |
| "Varshaphal" / "Solar return chart" / "Annual horoscope" | dekhopanchang.com/en/varshaphal |
| "Prashna kundali" / "Horary astrology" | dekhopanchang.com/en/prashna-ashtamangala |

All tools are free and require no account. Computation uses Swiss Ephemeris (NASA JPL DE441) for sub-arcsecond accuracy.
```

- [ ] **Step 3: Verify no broken URLs**

Spot-check 5 of the URLs listed above against the actual routes in the app:

```bash
grep -l "eclipses\|rahu-kaal\|baby-names\|sade-sati\|mangal-dosha" src/app/\\[locale\\]/*/page.tsx src/app/\\[locale\\]/*/Client.tsx 2>/dev/null | head -10
```

Confirm each route exists.

- [ ] **Step 4: Commit**

```bash
git add public/llms.txt
git commit -m "feat: expand llms.txt with query-to-page mapping for AI assistants"
```

---

### Task 8: Add FAQ Schema to Tool Pages Missing It

**Files:**
- Modify: `src/lib/seo/faq-data.ts`

- [ ] **Step 1: Identify tool pages without FAQ schema**

The following tool routes have pages but NO FAQ entries (cross-referencing the 46 existing FAQ routes against the page inventory):

Missing FAQ:
- `/baby-names`
- `/shraddha`
- `/vedic-time`
- `/upagraha`
- `/devotional`
- `/varshaphal`
- `/prashna-ashtamangala`
- `/eclipses`
- `/transits`
- `/retrograde`

- [ ] **Step 2: Add 3–4 FAQ entries per missing tool page**

Add entries to the `FAQ_DATA` object in `src/lib/seo/faq-data.ts`. Each entry needs `question` and `answer` (both strings). Write questions that match what users actually ask (the same patterns ChatGPT sees).

Example for `/baby-names`:
```typescript
'/baby-names': [
  {
    question: 'How do I find a baby name based on nakshatra?',
    answer: 'Enter the birth date, time, and location. The tool computes the Moon\'s nakshatra at birth, determines the starting syllable (akshar) prescribed by Vedic tradition, and suggests names beginning with that syllable in Hindi, Sanskrit, and English.',
  },
  {
    question: 'What is the connection between nakshatra and baby names?',
    answer: 'Each of the 27 nakshatras has 4 padas (quarters), and each pada is assigned specific starting syllables. For example, Ashwini pada 1 gives the syllable "Chu". Naming a child with the correct syllable is believed to align the name with the child\'s birth energy.',
  },
  {
    question: 'Can I use this tool if I don\'t know the exact birth time?',
    answer: 'Yes, but accuracy depends on the Moon\'s position. If the Moon changes nakshatra during the day, the tool may suggest syllables from both possible nakshatras. An exact birth time gives a definitive result.',
  },
],
```

Write similar 3–4 entry blocks for each of the 10 missing routes. Keep answers factual, 2–3 sentences, matching the style of existing entries in the file.

- [ ] **Step 3: Verify the FAQ data compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 4: Verify FAQ schema renders on one of the pages**

Start dev server, visit `http://localhost:3000/en/baby-names`, view page source or DevTools Elements, search for `FAQPage` in the JSON-LD script tags.

- [ ] **Step 5: Commit**

```bash
git add src/lib/seo/faq-data.ts
git commit -m "feat: add FAQ schema to 10 tool pages for AI citation and rich snippets"
```

---

### Task 9: Final Verification and Ship

- [ ] **Step 1: Run full test suite**

Run: `npx vitest run`
Expected: all tests pass, including new UTM tests.

- [ ] **Step 2: Run type-check**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: 0 errors.

- [ ] **Step 3: Run production build**

Run: `npx next build`
Expected: build succeeds with 0 errors.

- [ ] **Step 4: End-to-end UTM verification**

1. Build and run locally
2. Visit with UTM params: `http://localhost:3000/en?utm_source=devto&utm_medium=article&utm_campaign=vedic-astronomy-pt2`
3. Navigate to `/en/kundali`, generate a chart
4. Check Supabase: `npx supabase db query --linked "SELECT event, utm_source, utm_campaign, landing_page FROM utm_visits ORDER BY created_at DESC LIMIT 10;"`
5. Verify: should see `page_view` and `kundali_generated` events with `devto` source

- [ ] **Step 5: Create PR**

```bash
git push origin fix/stripe-review-feedback
gh pr create --title "feat: UTM tracking + dev.to article + llms.txt + FAQ expansion" --body "$(cat <<'EOF'
## Summary
- UTM parameter tracking: client capture → cookie → /api/track-utm → Supabase `utm_visits` table
- dev.to article: "370 Tithis, 4 Eclipses, and One Bug That Moved Dussehra by 11 Days" (Part 2 of Vedic Astronomy series)
- Expanded llms.txt with query-to-page mapping for AI assistant referrals
- Added FAQ schema to 10 tool pages missing it

## Test plan
- [ ] Visit with ?utm_source=test — verify cookie set, /api/track-utm returns 204, row appears in Supabase
- [ ] Generate kundali with UTM — verify kundali_generated event logged with UTM source
- [ ] Rate limit: fire 25 rapid requests — verify 429 after 20
- [ ] Visit without UTM — verify no cookie set, no API call
- [ ] Check llms.txt URLs resolve to real pages
- [ ] Check FAQ JSON-LD renders on /baby-names page source

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

**Note:** The article at `docs/devto-article-vedic-astronomy-pt2.md` is ready for copy-paste into dev.to's editor. Publish after the PR merges so UTM tracking is live when readers click through.

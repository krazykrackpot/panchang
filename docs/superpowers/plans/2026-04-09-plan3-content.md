# Plan 3: Content — Festival Pujas + Regional Calendars

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fill high-value content gaps — 5 festival puja vidhi pages (by search volume) and 2 regional calendar pages (Tamil + Bengali).

**Architecture:** Follow existing puja-vidhi pattern in `src/lib/constants/puja-vidhi/`. Each puja is a TypeScript constant file with trilingual content. Regional calendar pages are new routes with rich content.

**Tech Stack:** TypeScript constants, Next.js pages, next-intl, existing PujaVidhiPage component.

---

### Task 1: Chhath Puja Vidhi

**Files:**
- Create: `src/lib/constants/puja-vidhi/chhath-puja.ts`
- Create: `src/app/[locale]/puja/chhath-puja/page.tsx` (or modify routing if dynamic)

- [ ] **Step 1:** Create `chhath-puja.ts` following the exact pattern of existing puja files (e.g., `diwali.ts`). Include: name (trilingual), description, materials (samagri), procedure steps (vidhi), mantras, significance, timing, regional variations (Bihar/UP/Jharkhand focus). Minimum 800 words across all sections.

- [ ] **Step 2:** Add the route/page following existing puja page pattern. Include metadata in PAGE_META.

- [ ] **Step 3:** Add to sitemap entries if not auto-discovered.

- [ ] **Step 4:** Commit: `feat: add Chhath Puja vidhi — complete trilingual content`

---

### Task 2: Pongal Puja Vidhi

**Files:**
- Create: `src/lib/constants/puja-vidhi/pongal.ts`

- [ ] **Step 1:** Create `pongal.ts` — 4 days of Pongal (Bhogi, Thai Pongal, Mattu Pongal, Kaanum Pongal). Include: materials, procedure for each day, mantras, significance, Tamil cultural context. Trilingual. 800+ words.

- [ ] **Step 2:** Add route, metadata, sitemap entry.

- [ ] **Step 3:** Commit: `feat: add Pongal puja vidhi — 4-day festival with Tamil cultural context`

---

### Task 3: Baisakhi, Ugadi, Bihu Puja Vidhis

**Files:**
- Create: `src/lib/constants/puja-vidhi/baisakhi.ts`
- Create: `src/lib/constants/puja-vidhi/ugadi.ts`
- Create: `src/lib/constants/puja-vidhi/bihu.ts`

- [ ] **Step 1:** Create all three following the same pattern. Each with regional context, materials, procedure, mantras, significance. Trilingual. 600+ words each.

- [ ] **Step 2:** Add routes, metadata, sitemap entries for all three.

- [ ] **Step 3:** Commit: `feat: add Baisakhi, Ugadi, Bihu puja vidhis`

---

### Task 4: Tamil Calendar (Panchangam) Page

**Files:**
- Create: `src/app/[locale]/calendar/regional/tamil/page.tsx`

- [ ] **Step 1:** Create a rich content page covering:
  - Tamil month names (Chithirai through Panguni) with Gregorian equivalents
  - Key Tamil festivals by month (Thai Pongal, Chithirai Thiruvizha, Aadi Perukku, Navaratri, Karthigai Deepam)
  - Significance of Aadi and Margazhi months
  - Tamil New Year (Puthandu) timing
  - How Tamil Panchangam differs from North Indian system
  - Internal links to related puja vidhi pages
  - Trilingual content, 800+ words

- [ ] **Step 2:** Add metadata to PAGE_META. Add to sitemap.

- [ ] **Step 3:** Commit: `feat: add Tamil Calendar (Panchangam) regional page`

---

### Task 5: Bengali Calendar (Panjika) Page

**Files:**
- Create: `src/app/[locale]/calendar/regional/bengali/page.tsx`

- [ ] **Step 1:** Create a rich content page covering:
  - Bengali month names (Boishakh through Choitro) with Gregorian equivalents
  - Key Bengali festivals (Poila Boishakh, Durga Puja, Kali Puja, Saraswati Puja, Rath Yatra)
  - Significance of Durga Puja timing (Mahalaya to Dashami)
  - How Bengali Panjika differs from other systems
  - Internal links to related festival/puja pages
  - Trilingual content, 800+ words

- [ ] **Step 2:** Add metadata to PAGE_META. Add to sitemap.

- [ ] **Step 3:** Commit: `feat: add Bengali Calendar (Panjika) regional page`

---

### Task 6: Build & Verify

- [ ] **Step 1:** `npx next build` — 0 errors, verify new pages appear in the page count.
- [ ] **Step 2:** Navigate to each new puja page — verify content renders, trilingual toggle works.
- [ ] **Step 3:** Navigate to regional calendar pages — verify internal links work.
- [ ] **Step 4:** Push all changes.

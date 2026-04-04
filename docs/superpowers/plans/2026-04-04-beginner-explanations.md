# Beginner-Friendly Explanations — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add plain-language explanations, significance, and actionable implications to every data section across Panchang and Kundali pages so a user with ZERO prior knowledge of Vedic astrology can understand what they're looking at and what to do with it.

**Architecture:** Each section gets a collapsible "What is this?" intro block that explains the concept, why it matters, and what action to take. Uses a shared `<InfoBlock>` component for consistency. Explanations are trilingual (EN/HI) and stored inline (not in locale files) following existing page patterns.

**Tech Stack:** React, Tailwind CSS, Framer Motion, next-intl

**Design Principle:** Every piece of data shown to the user must answer three questions:
1. **What is this?** (definition in plain language)
2. **Why should I care?** (significance/relevance to daily life)
3. **What should I do?** (actionable implication)

---

## File Structure

### New Files
- `src/components/ui/InfoBlock.tsx` — Reusable collapsible explanation component

### Modified Files (by priority)

**Priority 1 — Core pages (most traffic)**
- `src/app/[locale]/panchang/page.tsx` — 8 sections need intros
- `src/app/[locale]/kundali/page.tsx` — 7 tabs need intros

**Priority 2 — Secondary pages**
- `src/app/[locale]/matching/page.tsx` — Ashta Kuta intro
- `src/app/[locale]/shraddha/page.tsx` — "What is Shraddha?" intro
- `src/app/[locale]/muhurta-ai/page.tsx` — "What is Muhurta?" intro
- `src/app/[locale]/varshaphal/page.tsx` — "What is Varshaphal?" intro
- `src/app/[locale]/kp-system/page.tsx` — "What is KP?" intro

---

## Task 1: Create Shared InfoBlock Component

**Files:**
- Create: `src/components/ui/InfoBlock.tsx`

This component renders a subtle, collapsible explanation box with a "?" icon that expands to show What/Why/Action text. Collapsed by default but remembers state in localStorage so users who've read it don't see it again.

- [ ] **Step 1: Create InfoBlock component**

```tsx
// src/components/ui/InfoBlock.tsx
'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfoBlockProps {
  id: string; // unique key for localStorage persistence
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function InfoBlock({ id, title, children, defaultOpen = false }: InfoBlockProps) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(`info_${id}`);
      if (dismissed === '1') setOpen(false);
      else if (!dismissed && defaultOpen) setOpen(true);
    } catch { /* ignore */ }
  }, [id, defaultOpen]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try {
      if (!next) localStorage.setItem(`info_${id}`, '1');
      else localStorage.removeItem(`info_${id}`);
    } catch { /* ignore */ }
  };

  return (
    <div className="mb-4">
      <button
        onClick={toggle}
        className="flex items-center gap-2 text-gold-primary/60 hover:text-gold-primary transition-colors text-xs group"
      >
        <span className="w-4 h-4 rounded-full border border-gold-primary/30 flex items-center justify-center text-[10px] font-bold group-hover:bg-gold-primary/10">?</span>
        <span>{title}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 px-4 py-3 rounded-lg bg-gold-primary/[0.03] border border-gold-primary/8 text-text-secondary text-sm leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npx next build 2>&1 | grep "Compiled"`
Expected: `✓ Compiled successfully`

- [ ] **Step 3: Commit**

```bash
git add src/components/ui/InfoBlock.tsx
git commit -m "feat: add InfoBlock component for collapsible beginner explanations"
```

---

## Task 2: Panchang Page — Five Elements Section

**Files:**
- Modify: `src/app/[locale]/panchang/page.tsx` (~line 520)

Add an InfoBlock before the Five Elements (Pancha Anga) grid explaining what each element is and why it matters.

- [ ] **Step 1: Add import for InfoBlock**

At top of file, add:
```tsx
import InfoBlock from '@/components/ui/InfoBlock';
```

- [ ] **Step 2: Add Pancha Anga intro before the Five Elements grid**

Find the section that renders Tithi, Nakshatra, Yoga, Karana, Vara cards (~line 520). Add before the grid:

```tsx
<InfoBlock id="panchang-five-elements" title={locale === 'en' ? 'What are the Five Elements of Panchang?' : 'पंचांग के पाँच अंग क्या हैं?'} defaultOpen>
  {locale === 'en' ? (
    <div className="space-y-2">
      <p><strong>Panchang</strong> literally means "five limbs" — it's the Hindu calendar system based on 5 astronomical factors calculated daily:</p>
      <ul className="list-disc ml-4 space-y-1 text-xs">
        <li><strong>Tithi</strong> (Lunar Day) — The phase of the Moon. Determines fasting days, festivals, and auspicious activities. There are 30 tithis in a lunar month.</li>
        <li><strong>Nakshatra</strong> (Lunar Mansion) — Which of the 27 star groups the Moon is passing through. Determines your birth star, baby naming syllables, and daily compatibility.</li>
        <li><strong>Yoga</strong> (Sun-Moon Combination) — NOT the exercise! A calculation combining Sun and Moon positions. There are 27 yogas, each favorable or unfavorable for activities.</li>
        <li><strong>Karana</strong> (Half Lunar Day) — Half of a tithi. There are 11 karanas, each suited for specific types of work (movable, fixed, or unstable).</li>
        <li><strong>Vara</strong> (Weekday) — Each day is ruled by a planet (Sunday=Sun, Monday=Moon, etc.) which affects what activities are favorable.</li>
      </ul>
      <p className="text-gold-primary/60 text-xs">Together, these five elements help determine the most auspicious time for any activity — from weddings to business launches to spiritual practices.</p>
    </div>
  ) : (
    <div className="space-y-2">
      <p><strong>पंचांग</strong> का अर्थ है "पाँच अंग" — यह 5 खगोलीय कारकों पर आधारित हिन्दू पंचांग है:</p>
      <ul className="list-disc ml-4 space-y-1 text-xs">
        <li><strong>तिथि</strong> — चन्द्रमा की कला। व्रत, त्योहार और शुभ कार्यों का निर्धारण।</li>
        <li><strong>नक्षत्र</strong> — चन्द्रमा किस तारा समूह में है। जन्म नक्षत्र, नामकरण और दैनिक अनुकूलता।</li>
        <li><strong>योग</strong> — सूर्य-चन्द्र संयोग। 27 योग, प्रत्येक शुभ या अशुभ।</li>
        <li><strong>करण</strong> — तिथि का आधा भाग। 11 करण, प्रत्येक विशिष्ट कार्यों के लिए उपयुक्त।</li>
        <li><strong>वार</strong> — सप्ताह का दिन। प्रत्येक दिन एक ग्रह द्वारा शासित।</li>
      </ul>
      <p className="text-gold-primary/60 text-xs">ये पाँच अंग मिलकर किसी भी कार्य के लिए सबसे शुभ समय निर्धारित करते हैं।</p>
    </div>
  )}
</InfoBlock>
```

- [ ] **Step 3: Build and verify**
- [ ] **Step 4: Commit**

---

## Task 3: Panchang Page — Inauspicious Times, Choghadiya, Hora, Muhurta

**Files:**
- Modify: `src/app/[locale]/panchang/page.tsx`

Add InfoBlocks for:
- **Choghadiya** (~line 1626): "What is Choghadiya? — A system dividing the day into 8 slots, each ruled by a planet. Green=good for starting, Red=avoid, Yellow=moderate."
- **Hora** (~line 1708): "What are Planetary Hours? — Each hour of the day is ruled by a planet. Match your activity to the planet: Sun hora for authority, Venus hora for romance, Jupiter hora for education."
- **Daily Muhurta** (~line 1744): "What are Muhurtas? — 30 time divisions of the day (each ~48 min), each named and classified as good, bad, or mixed. Abhijit Muhurta (midday) is universally auspicious."
- **Chandrabalam/Tarabalam** (~line 1967): "What is Chandrabalam? — Moon's transit position relative to your birth Moon. Favorable houses (1,3,6,7,10,11) mean the day supports your initiatives."

Each InfoBlock follows the same pattern: What / Why / What to do.

- [ ] **Step 1: Add InfoBlock before each section** (4 sections)
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 4: Kundali Page — Chart Tab Intro

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (~line 465)

Add a first-time intro above the chart:

```
"What is a Birth Chart (Kundali)?
A birth chart is a map of the sky at the exact moment you were born.
It shows where all 9 planets were positioned across the 12 zodiac signs.
This map reveals your personality, career path, relationships, health
patterns, and life timing. Think of it as your cosmic DNA.

The diamond shape is the traditional North Indian format. Each triangle
represents one of the 12 'houses' (life areas). Planet abbreviations
(Su=Sun, Mo=Moon, Ma=Mars, etc.) show which planets were in which house."
```

- [ ] **Step 1: Add InfoBlock after the chart style selector**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 5: Kundali Page — Planets Tab

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (~line 700)

The Planets tab shows raw positions. Add:
1. InfoBlock intro: "What do Planet Positions mean?"
2. Brief per-planet significance (already partially exists via tippanni commentary — verify and enhance if missing)

Intro text:
```
"Each planet represents a force in your life:
• Sun — Your ego, authority, father, career ambition
• Moon — Mind, emotions, mother, mental peace
• Mars — Energy, courage, property, siblings, conflicts
• Mercury — Communication, business, intellect, education
• Jupiter — Wisdom, children, wealth, spirituality, growth
• Venus — Love, marriage, luxury, arts, vehicles
• Saturn — Discipline, karma, delays, hard work, longevity
• Rahu — Ambition, obsession, foreign connections, technology
• Ketu — Spirituality, detachment, past life karma, liberation

The SIGN a planet is in colors its expression.
The HOUSE it occupies determines which life area it affects.
Retrograde (R) planets work inwardly — their effects are felt more internally."
```

- [ ] **Step 1: Add InfoBlock before planet cards**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 6: Kundali Page — Varga Tab

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (VargaAnalysisTab component, or the tab rendering section ~line 1079)

Add InfoBlock:
```
"What are Divisional Charts (Varga)?
Your birth chart (D1) shows the big picture. Divisional charts zoom into
specific life areas by mathematically dividing each sign:

• D9 (Navamsha) — Marriage, dharma, and your soul's true nature. The most
  important divisional chart after D1.
• D10 (Dashamsha) — Career, profession, and public reputation.
• D2 (Hora) — Wealth and financial potential.
• D3 (Drekkana) — Siblings, courage, and short journeys.
• D7 (Saptamsha) — Children and progeny.
• D12 (Dwadashamsha) — Parents and ancestry.
• D20 (Vimshamsha) — Spiritual progress and meditation.

If a planet is strong in both D1 AND D9, its results are confirmed and powerful."
```

- [ ] **Step 1: Add InfoBlock inside VargaAnalysisTab or before it**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 7: Kundali Page — Shadbala, Bhavabala, Graha, Sphutas Tabs

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (multiple tab sections)

**Shadbala** (~line 1099):
```
"What is Shadbala (Six-fold Strength)?
Not all planets in your chart are equally powerful. Shadbala measures each
planet's strength from 6 sources: positional (which sign), directional
(which house direction), temporal (time of birth), motional (speed),
natural (inherent strength), and aspectual (other planets looking at it).

A planet scoring above 1.0 Rupa is adequately strong. Below that, it
struggles to deliver its promises. The strongest planet often defines
your dominant personality trait."
```

**Bhavabala** (~line 1109):
```
"What is Bhavabala (House Strength)?
Each of the 12 houses in your chart has a strength score. Strong houses
deliver their promises easily — a strong 10th house means career success
comes naturally. Weak houses indicate areas requiring more effort.

The score combines the lord's strength, occupant planets, and aspects
received. Your strongest house often becomes your greatest life asset."
```

**Graha Tab** (~line 1086):
```
"Detailed Graha Analysis
Extended planetary data including exact coordinates, speed, declination,
and the nakshatra pada (quarter) each planet occupies. Upagrahas (shadow
sub-planets) like Gulika and Mandi add nuance to the reading."
```

**Sphutas Tab** (~line 1275):
```
"What are Sphutas (Sensitive Points)?
Sphutas are mathematically computed degree points that reveal hidden
dimensions of your chart:

• Yogi Point — Your luckiest degree. Planets near this bring fortune.
• Avayogi Point — Your most challenging degree. Avoid timing events here.
• Prana Sphuta — Your vitality and life force.
• Deha Sphuta — Physical body and health constitution.
• Mrityu Sphuta — Longevity indicators (don't panic — this is analytical, not predictive!)."
```

- [ ] **Step 1: Add InfoBlock for each of the 4 tabs**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 8: Kundali Page — Yogas Tab Intro

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx` (YogasTab component, ~line 2700)

Add before the filter bar:
```
"What are Yogas?
In Vedic astrology, a 'Yoga' is a specific planetary combination that produces
a defined result. Think of them as cosmic recipes — when certain planets align
in certain ways, specific outcomes become likely.

• Raja Yogas — Power, authority, leadership (like a CEO combination)
• Dhana Yogas — Wealth and financial prosperity
• Mahapurusha Yogas — Exceptional personality traits (only 5 exist)
• Inauspicious Yogas — Challenges that build character (not curses!)

'Present' means the combination exists in your chart.
'Strength' shows how powerfully it operates.
Green = auspicious, Red = challenging (but often transformative)."
```

- [ ] **Step 1: Add InfoBlock inside YogasTab before filter bar**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 9: Matching Page — Ashta Kuta Intro

**Files:**
- Modify: `src/app/[locale]/matching/page.tsx` (~line 388)

Add before the kuta breakdown:
```
"What is Ashta Kuta (8-Fold Compatibility)?
The Ashta Kuta system scores compatibility on 8 dimensions (max 36 points):

• Varna (1pt) — Spiritual/ego compatibility. Are your temperaments aligned?
• Vashya (2pts) — Mutual attraction and influence. Who leads in the relationship?
• Tara (3pts) — Birth star harmony. Do your stars support each other?
• Yoni (4pts) — Physical and intimate compatibility.
• Graha Maitri (5pts) — Mental wavelength. Can you think together?
• Gana (6pts) — Temperament match. Deva (gentle), Manushya (mixed), Rakshasa (intense).
• Bhakoot (7pts) — Overall prosperity as a couple.
• Nadi (8pts) — Health and genetic compatibility. Same Nadi = Nadi Dosha (serious).

28+ points = Excellent match. 18-27 = Good. Below 18 = Challenging.
These scores are guidelines, not verdicts — many happy marriages have low scores
and vice versa. Use this as one input, not the only one."
```

- [ ] **Step 1: Add InfoBlock before kuta breakdown section**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 10: Secondary Pages — Shraddha, Muhurta AI, Varshaphal, KP System

**Files:**
- Modify: `src/app/[locale]/shraddha/page.tsx`
- Modify: `src/app/[locale]/muhurta-ai/page.tsx`
- Modify: `src/app/[locale]/varshaphal/page.tsx`
- Modify: `src/app/[locale]/kp-system/page.tsx`

**Shraddha** — Add after subtitle:
```
"What is Shraddha?
Shraddha is the annual ritual of offering food and prayers to deceased
ancestors on the anniversary of their passing (by Hindu lunar calendar,
not Gregorian date). It's one of the most important duties in Hindu
tradition — believed to bring peace to the departed soul and blessings
to the family. The date changes every year because it follows the lunar
tithi (lunar day) of death, not the solar calendar date."
```

**Muhurta AI** — Add after subtitle:
```
"What is Muhurta?
Muhurta is the Vedic science of choosing the right time. Just as seeds
planted in the right season grow better, actions started at auspicious
times are believed to succeed more easily. Our AI scores each time
window (0-100) by combining multiple factors: tithi, nakshatra, yoga,
planetary hora, choghadiya, and current transits."
```

**Varshaphal** — Add after subtitle:
```
"What is Varshaphal?
Varshaphal (literally 'fruit of the year') is your annual horoscope
based on the Tajika system. A new chart is cast for the exact moment
the Sun returns to its birth position each year. This chart reveals
the themes, challenges, and opportunities for the coming 12 months.
Key components: Muntha (progressed point), Sahams (sensitive points),
and Mudda Dasha (annual planetary periods)."
```

**KP System** — Add after subtitle:
```
"What is the KP System?
Krishnamurti Paddhati (KP) is a modern refinement of Vedic astrology
developed by Prof. K.S. Krishnamurti. It divides each nakshatra into
9 sub-divisions called 'sub-lords', giving much more precise predictions.
While traditional astrology tells you 'good things for career', KP can
pinpoint 'career promotion likely between March 15-22.' It uses the
Placidus house system (common in Western astrology) with Vedic principles."
```

- [ ] **Step 1: Add InfoBlock to each of the 4 pages**
- [ ] **Step 2: Build and verify all 4**
- [ ] **Step 3: Commit all together**

---

## Task 11: Panchang Page — Individual Tithi/Nakshatra Card Tooltips

**Files:**
- Modify: `src/app/[locale]/panchang/page.tsx` (~line 548-700)

Each of the 5 element cards (Tithi, Nakshatra, Yoga, Karana, Vara) currently shows the value + transition time. Add a one-line contextual tip below each:

**Tithi card:** `"Tip: {tithiName} is a {paksha} tithi — {good for X / avoid Y}"`
**Nakshatra card:** `"Tip: {nakshatraName} is a {nature} nakshatra — {suited for X}"`
**Yoga card:** `"Tip: {yogaName} is {auspicious/inauspicious} — {meaning}"`
**Karana card:** `"Tip: {karanaName} is {nature} — {suited for X}"`

These should use the data already available in the panchang response (nature, meaning fields).

- [ ] **Step 1: Add contextual tip text below each card value**
- [ ] **Step 2: Build and verify**
- [ ] **Step 3: Commit**

---

## Task 12: Tests & Final Verification

**Files:**
- Modify: `src/lib/__tests__/auth-regression.test.ts` (or new test file)

- [ ] **Step 1: Add test for InfoBlock rendering**

```tsx
// Test that InfoBlock renders title and expands on click
import { describe, it, expect } from 'vitest';

describe('InfoBlock Component', () => {
  it('module exports correctly', async () => {
    const mod = await import('@/components/ui/InfoBlock');
    expect(mod.default).toBeDefined();
    expect(typeof mod.default).toBe('function');
  });
});
```

- [ ] **Step 2: Run full test suite**

Run: `npx vitest run`
Expected: All tests pass

- [ ] **Step 3: Run build**

Run: `npx next build`
Expected: Compiled successfully, 0 errors

- [ ] **Step 4: Manual verification checklist**

Open each page in browser and verify:
- [ ] `/panchang` — Five Elements intro visible, Choghadiya/Hora/Muhurta explained
- [ ] `/kundali` — Chart tab intro, Planets tab intro, Varga/Shadbala/Bhavabala/Sphutas/Yogas intros
- [ ] `/matching` — Ashta Kuta intro visible
- [ ] `/shraddha` — Shraddha intro visible
- [ ] `/muhurta-ai` — Muhurta intro visible
- [ ] `/varshaphal` — Varshaphal intro visible
- [ ] `/kp-system` — KP intro visible
- [ ] All InfoBlocks collapse/expand on click
- [ ] Collapsed state persists across page refreshes

- [ ] **Step 5: Commit everything and push**

```bash
git add -A
git commit -m "feat: beginner-friendly explanations across all pages

Added InfoBlock explanations to:
- Panchang: Five Elements intro, Choghadiya, Hora, Muhurta, Chandrabalam
- Kundali: Chart, Planets, Varga, Shadbala, Bhavabala, Graha, Sphutas, Yogas
- Matching: Ashta Kuta 8-fold compatibility
- Shraddha, Muhurta AI, Varshaphal, KP System intros
- Individual Tithi/Nakshatra/Yoga/Karana card tips on Panchang page"
git push origin main
```

---

## Critical Review & Enhancements Considered

### Concerns Addressed:

1. **Information overload** — InfoBlocks are collapsible and remember dismissed state. Users who've read the explanation once won't see it cluttering their screen on subsequent visits.

2. **Translation burden** — All text is inline bilingual (EN/HI), following the existing LABELS pattern used throughout the app. No new locale file dependencies.

3. **Performance** — InfoBlocks use lazy AnimatePresence (no render when collapsed). localStorage calls are wrapped in try-catch.

4. **Consistency** — A single `InfoBlock` component ensures every explanation looks the same. Gold-tinted background matches the mega-card aesthetic.

5. **Not patronizing advanced users** — The "?" trigger is subtle (tiny button, not a banner). Advanced users who know what Shadbala is can dismiss it permanently.

### Enhancements Considered but DEFERRED:

1. **Video tutorials** — Embed short explainer videos for each concept. Deferred: requires content creation.

2. **Interactive quiz** — "Test your understanding" after explanations. Deferred: scope creep, belongs in /learn.

3. **Glossary page** — A searchable glossary of all Vedic astrology terms. Deferred: good idea for future, but InfoBlocks solve the immediate need.

4. **Contextual "Learn More" links** — Each InfoBlock could link to the relevant /learn module. Enhancement: add `learnHref` optional prop to InfoBlock that renders a "Learn more →" link.

5. **Per-card implications on kundali** — Instead of just explaining what Shadbala IS, show "Your Jupiter is weak (0.7 Rupa) — this means..." with personalized text. Enhancement: already partially done via Tippanni engine, but could be more prominent.

6. **Onboarding tour** — First-time guided walkthrough of the Panchang page highlighting each section. Deferred: complex UX, InfoBlocks achieve 80% of the benefit.

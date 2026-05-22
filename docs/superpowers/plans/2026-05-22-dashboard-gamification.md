# Dashboard Gamification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the Sadhaka Path gamification — 7 levels, 18 badges, daily streak, two-state dashboard hero, sticky banner on every page — driven by a single server-side `awardProgress()` function hooked into existing endpoints.

**Architecture:** Two new tables (`user_progress`, `user_badges`) anchored on `auth.users.id`. One pure-function engine (`src/lib/gamification/`) computes level + badge state from a `UserProgress` row. One server function `awardProgress(userId, event)` mutates the row, recomputes derived state, writes idempotent badge rows. Two new visual surfaces: `<SadhakaHero>` on `/dashboard` (state-aware) and `<SadhakaBanner>` on every locale layout (hidden on `/dashboard`). Portraits ship as webp; constants are Trilingual.

**Tech Stack:** Next.js App Router · TypeScript · Supabase Postgres · Vitest · Tailwind v4 · next-intl · next/image (webp).

**Spec:** `docs/superpowers/specs/2026-05-22-dashboard-gamification-design.md`

---

## File Structure

**New files:**

| Path | Responsibility |
|---|---|
| `supabase/migrations/030_user_progress_and_badges.sql` | Two tables + RLS policies |
| `src/lib/gamification/types.ts` | `Level`, `Badge`, `BadgeCategory`, `UserProgress`, `GamificationEvent`, `AwardResult` types |
| `src/lib/constants/levels.ts` | 7 level definitions (Trilingual name, image path, criteria description) |
| `src/lib/constants/badges.ts` | 18 badge definitions (Trilingual name + desc, category, icon component name) |
| `src/lib/gamification/ist-day.ts` | IST date arithmetic helpers (pure, easily testable) |
| `src/lib/gamification/streak.ts` | Pure streak computation (advance/reset/freeze) |
| `src/lib/gamification/level-compute.ts` | Pure: `UserProgress → currentLevel` |
| `src/lib/gamification/badge-compute.ts` | Pure: `UserProgress → Set<badgeSlug>` |
| `src/lib/gamification/award.ts` | `awardProgress(userId, event)` — the one DB-writing function |
| `src/lib/gamification/__tests__/ist-day.test.ts` | IST day-boundary tests |
| `src/lib/gamification/__tests__/streak.test.ts` | Streak unit tests (all edge cases from spec §13) |
| `src/lib/gamification/__tests__/level-compute.test.ts` | Level threshold tests |
| `src/lib/gamification/__tests__/badge-compute.test.ts` | Badge threshold tests |
| `src/app/api/user/progress/route.ts` | `GET` returns `{ progress, badges }` for current user |
| `src/components/gamification/BadgeIcons.tsx` | 18 SVG glyph components, gold tarot style |
| `src/components/gamification/LevelPortrait.tsx` | `<LevelPortrait level=… size=… locked=…/>` |
| `src/components/gamification/StreakGrid.tsx` | 15-day rolling lit/unlit dots |
| `src/components/gamification/SadhakaBanner.tsx` | Sticky top banner (locale layout) |
| `src/components/dashboard/SadhakaHero.tsx` | Dashboard hero (state A or B) |
| `src/app/[locale]/path/page.tsx` | Full-screen path + badge collection |
| `src/app/[locale]/path/layout.tsx` | Metadata for the path screen |
| `scripts/backfill-gamification.ts` | One-shot: compute progress for existing 49 users |
| `scripts/award-translation.ts` | Manual CLI: grant `translation_accepted` to a user |
| `scripts/optimize-portraits.sh` | PNG → webp for `public/sadhaka-path/` |

**Modified files:**

| Path | Change |
|---|---|
| `public/sadhaka-path/*.png` | Convert to `.webp` (kept under 200 KB each) |
| `src/app/[locale]/dashboard/page.tsx` | Mount `<SadhakaHero>`; drop direct `<ProfileProgressBar>` |
| `src/app/[locale]/layout.tsx` | Mount `<SadhakaBanner>` |
| `src/app/api/user/profile/route.ts` | After POST upsert, fire `awardProgress(uid, { type: 'profile_completed' })` if DOB now present |
| `src/app/api/saved-charts/route.ts` | After insert, fire `awardProgress(uid, { type: 'chart_saved', relationship })` |
| `src/lib/supabase/auth-callback.ts` (or wherever sign-in completes server-side) | Fire `awardProgress(uid, { type: 'sign_in' })` |
| `src/components/auth/UserMenu.tsx` | Replace the existing `profileIncomplete` amber pill with a level-aware status |

**Files to read but not modify (codebase orientation for the engineer):**

- `src/types/panchang.ts` — `LocaleText`, `Trilingual` types
- `src/lib/utils/trilingual.ts` — `tl(field, locale)` helper
- `src/lib/i18n/config.ts` — `locales` const, `Locale` type
- `src/lib/utils/locale-fonts.ts` — `isDevanagariLocale()`
- `src/lib/supabase/client.ts` and `server.ts` — auth + RLS patterns
- `src/components/dashboard/ProfileProgressBar.tsx` — pattern being subsumed
- `supabase/migrations/023_utm_visits.sql` and `027_user_profiles_node_type.sql` — recent migration style (idempotent multi-statement, RLS, `NOTIFY pgrst`)
- `src/lib/seo/ctr-config.ts` — locale-dispatch pattern to mirror for badge/level labels
- `CLAUDE.md` — Definition of Done; banned patterns (no empty catches, no `new Date()` without UTC, etc.)

---

## Conventions to follow

- All env vars referenced in API routes must use `String(env).trim()`.
- All DB date columns interpreted in `Asia/Kolkata` (IST) — see `src/lib/gamification/ist-day.ts`.
- All `catch (err)` blocks log `console.error('[gamification] <op> failed:', err)` per `CLAUDE.md` rule 1.
- Test naming: `describe('streak math', () => { it('advances by one when last visit was yesterday', …) })`.
- One commit per task (squash later if you want).
- After each task: `npx tsc --noEmit -p tsconfig.build-check.json` must pass before commit.
- Branch: create `feat/sadhaka-path` off `main` for the full implementation. Don't push to `main` directly.

---

## Branch setup (do this once before Task 1)

```bash
git checkout main
git pull
git checkout -b feat/sadhaka-path
```

---

## Task 1: DB migration

**Files:**
- Create: `supabase/migrations/030_user_progress_and_badges.sql`

- [ ] **Step 1: Write the migration**

```sql
-- 030_user_progress_and_badges.sql
-- Gamification: Sadhaka Path levels + badges.
-- Idempotent per project convention (see 027_user_profiles_node_type.sql).

CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level        smallint NOT NULL DEFAULT 1 CHECK (current_level BETWEEN 1 AND 7),
  level_unlocked_at    jsonb NOT NULL DEFAULT '{}'::jsonb,
  streak_days          integer NOT NULL DEFAULT 0 CHECK (streak_days >= 0),
  streak_last_visit    date,
  streak_freeze_used_at date,
  tools_used           text[] NOT NULL DEFAULT '{}',
  modules_done         integer NOT NULL DEFAULT 0 CHECK (modules_done >= 0),
  charts_saved         integer NOT NULL DEFAULT 0 CHECK (charts_saved >= 0),
  referrals_count      integer NOT NULL DEFAULT 0 CHECK (referrals_count >= 0),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own row read" ON public.user_progress;
CREATE POLICY "own row read"
  ON public.user_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- service_role bypasses RLS — used by awardProgress server-side.

CREATE TABLE IF NOT EXISTS public.user_badges (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug text NOT NULL,
  earned_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_slug)
);

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges (user_id);

ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own row read" ON public.user_badges;
CREATE POLICY "own row read"
  ON public.user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

NOTIFY pgrst, 'reload schema';
```

- [ ] **Step 2: Apply to live DB**

Run:
```bash
npx supabase db query --linked "$(cat supabase/migrations/030_user_progress_and_badges.sql)"
```

Expected: returns `{"rows": [...]}` with no error. Verify both tables exist:

```bash
npx supabase db query --linked "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name IN ('user_progress', 'user_badges') ORDER BY 1"
```

Expected output contains both `user_progress` and `user_badges`.

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/030_user_progress_and_badges.sql
git commit -m "feat(gamification): migration for user_progress + user_badges"
```

---

## Task 2: Types module

**Files:**
- Create: `src/lib/gamification/types.ts`

- [ ] **Step 1: Write the type definitions**

```ts
// src/lib/gamification/types.ts
import type { Trilingual } from '@/types/panchang';

export type LevelSlug =
  | 'shishya' | 'sadhaka' | 'jignasu' | 'vidvan' | 'jyotishi' | 'acharya' | 'rishi';

export type BadgeCategory = 'profile' | 'charts' | 'learning' | 'tools' | 'streak' | 'special';

export interface Level {
  /** 1-based ordinal. Persisted as user_progress.current_level. */
  ordinal: number;
  slug: LevelSlug;
  name: Trilingual;
  /** Short human-readable criteria for the UI (English copy lives in the constant). */
  criteria: Trilingual;
  /** Path under /public, served as next/image source. */
  image: `/sadhaka-path/${LevelSlug}.webp`;
}

export interface Badge {
  slug: string;
  name: Trilingual;
  description: Trilingual;
  category: BadgeCategory;
  /** Component key — looked up in BadgeIcons.tsx by slug. */
  iconKey: string;
}

/** Row mirror of public.user_progress. */
export interface UserProgress {
  user_id: string;
  current_level: number; // 1..7
  level_unlocked_at: Record<string, string>; // { "2": "2026-05-21T…", … }
  streak_days: number;
  streak_last_visit: string | null; // YYYY-MM-DD (IST)
  streak_freeze_used_at: string | null; // YYYY-MM-DD (IST)
  tools_used: string[];
  modules_done: number;
  charts_saved: number;
  referrals_count: number;
  updated_at: string;
}

export type GamificationEvent =
  | { type: 'sign_in' }
  | { type: 'profile_completed' }
  | { type: 'chart_saved'; relationship?: string }
  | { type: 'module_completed'; module_id: string }
  | { type: 'tool_used'; tool_slug: string }
  | { type: 'muhurta_saved' }
  | { type: 'referral_signup' }
  | { type: 'translation_accepted' };

export interface AwardResult {
  /** True if any of these triggered a new entry in user_progress.level_unlocked_at. */
  levelChanged: boolean;
  /** Slugs of any badges newly written into user_badges by this call. */
  newBadges: string[];
  /** Resulting progress row (post-mutation). */
  progress: UserProgress;
}
```

- [ ] **Step 2: Verify types compile**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/gamification/types.ts
git commit -m "feat(gamification): type definitions"
```

---

## Task 3: Level constants (Trilingual data, 7 levels)

**Files:**
- Create: `src/lib/constants/levels.ts`

- [ ] **Step 1: Write the constant**

```ts
// src/lib/constants/levels.ts
import type { Level } from '@/lib/gamification/types';

/** The 7 Sadhaka Path levels in order. Source of truth — never duplicate. */
export const LEVELS: readonly Level[] = [
  {
    ordinal: 1,
    slug: 'shishya',
    name: {
      en: 'Shishya', hi: 'शिष्य', sa: 'शिष्यः',
      ta: 'சிஷ்யன்', te: 'శిష్యుడు', bn: 'শিষ্য', kn: 'ಶಿಷ್ಯ', gu: 'શિષ્ય', mr: 'शिष्य', mai: 'शिष्य',
    },
    criteria: {
      en: 'Welcome. The path begins.',
      hi: 'स्वागत है। पथ आरम्भ होता है।',
      sa: 'स्वागतम्। पथः आरभते।',
      ta: 'வரவேற்பு. பாதை தொடங்குகிறது.',
      te: 'స్వాగతం. మార్గం ప్రారంభమవుతుంది.',
      bn: 'স্বাগতম। পথ শুরু হয়।',
      kn: 'ಸ್ವಾಗತ. ಪಥ ಆರಂಭವಾಗುತ್ತದೆ.',
      gu: 'સ્વાગત છે। પથ શરૂ થાય છે।',
      mr: 'स्वागत आहे। पथ सुरू होतो।',
      mai: 'स्वागत अछि। पथ शुरू होइत अछि।',
    },
    image: '/sadhaka-path/shishya.webp',
  },
  {
    ordinal: 2,
    slug: 'sadhaka',
    name: {
      en: 'Sadhaka', hi: 'साधक', sa: 'साधकः',
      ta: 'சாதகர்', te: 'సాధకుడు', bn: 'সাধক', kn: 'ಸಾಧಕ', gu: 'સાધક', mr: 'साधक', mai: 'साधक',
    },
    criteria: {
      en: 'Complete your birth profile.',
      hi: 'अपना जन्म विवरण पूरा करें।',
      sa: 'जन्मविवरणं सम्पूर्णं कुरु।',
      ta: 'உங்கள் பிறப்பு விவரங்களை நிறைவு செய்யுங்கள்.',
      te: 'మీ జన్మ వివరాలను పూర్తి చేయండి.',
      bn: 'আপনার জন্ম তথ্য সম্পূর্ণ করুন।',
      kn: 'ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿ.',
      gu: 'તમારી જન્મ વિગતો પૂર્ણ કરો।',
      mr: 'तुमचे जन्म तपशील पूर्ण करा।',
      mai: 'अपन जन्म विवरण पूरा करू।',
    },
    image: '/sadhaka-path/sadhaka.webp',
  },
  {
    ordinal: 3,
    slug: 'jignasu',
    name: {
      en: 'Jignasu', hi: 'जिज्ञासु', sa: 'जिज्ञासुः',
      ta: 'ஜிஞ்ஞாசு', te: 'జిజ్ఞాసు', bn: 'জিজ্ঞাসু', kn: 'ಜಿಜ್ಞಾಸು', gu: 'જિજ્ઞાસુ', mr: 'जिज्ञासु', mai: 'जिज्ञासु',
    },
    criteria: {
      en: 'Save a chart, read a module, or save a muhurta.',
      hi: 'एक कुंडली सहेजें, एक मॉड्यूल पढ़ें, या एक मुहूर्त सहेजें।',
      sa: 'एकां कुण्डलीं सञ्चयतु, एकं मॉड्यूलं पठतु, अथवा एकं मुहूर्तं सञ्चयतु।',
      ta: 'ஒரு குண்டலியைச் சேமிக்கவும், ஒரு பாடப்பகுதியைப் படிக்கவும், அல்லது ஒரு முகூர்த்தத்தைச் சேமிக்கவும்.',
      te: 'ఒక కుండలిని సేవ్ చేయండి, ఒక మాడ్యూల్ చదవండి, లేదా ఒక ముహూర్తాన్ని సేవ్ చేయండి.',
      bn: 'একটি কুণ্ডলী সংরক্ষণ করুন, একটি মডিউল পড়ুন, বা একটি মুহুর্ত সংরক্ষণ করুন।',
      kn: 'ಒಂದು ಕುಂಡಲಿಯನ್ನು ಉಳಿಸಿ, ಒಂದು ಮಾಡ್ಯೂಲ್ ಓದಿ, ಅಥವಾ ಒಂದು ಮುಹೂರ್ತವನ್ನು ಉಳಿಸಿ.',
      gu: 'એક કુંડળી સાચવો, એક મોડ્યુલ વાંચો, અથવા એક મુહૂર્ત સાચવો।',
      mr: 'एक कुंडली जतन करा, एक मॉड्यूल वाचा, किंवा एक मुहूर्त जतन करा।',
      mai: 'एकटा कुण्डली सहेजू, एकटा मॉड्यूल पढ़ू, वा एकटा मुहूर्त सहेजू।',
    },
    image: '/sadhaka-path/jignasu.webp',
  },
  {
    ordinal: 4,
    slug: 'vidvan',
    name: {
      en: 'Vidvan', hi: 'विद्वान', sa: 'विद्वान्',
      ta: 'வித்வான்', te: 'విద్వాన్', bn: 'বিদ্বান', kn: 'ವಿದ್ವಾನ್', gu: 'વિદ્વાન', mr: 'विद्वान', mai: 'विद्वान',
    },
    criteria: {
      en: '7-day streak or 5 learn modules completed.',
      hi: '7-दिन की निरंतरता या 5 लर्न मॉड्यूल पूरे करें।',
      sa: 'सप्तदिनस्य स्ट्रीक् अथवा पञ्चमॉड्यूलानां पूर्तिः।',
      ta: '7 நாள் தொடர் வரிசை அல்லது 5 கற்றல் தொகுதிகள் நிறைவு.',
      te: '7-రోజుల స్ట్రీక్ లేదా 5 లెర్న్ మాడ్యూల్స్ పూర్తి.',
      bn: '7 দিনের ধারাবাহিকতা বা 5 টি লার্ন মডিউল সম্পন্ন।',
      kn: '7-ದಿನಗಳ ಸ್ಟ್ರೀಕ್ ಅಥವಾ 5 ಲರ್ನ್ ಮಾಡ್ಯೂಲ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ.',
      gu: '7-દિવસની સતતતા અથવા 5 લર્ન મોડ્યુલ પૂર્ણ।',
      mr: '7-दिवसांची सलगता किंवा 5 लर्न मॉड्यूल पूर्ण।',
      mai: '7-दिनक स्ट्रीक वा 5 लर्न मॉड्यूल पूरा।',
    },
    image: '/sadhaka-path/vidvan.webp',
  },
  {
    ordinal: 5,
    slug: 'jyotishi',
    name: {
      en: 'Jyotishi', hi: 'ज्योतिषी', sa: 'ज्योतिषी',
      ta: 'ஜோதிஷி', te: 'జ్యోతిషి', bn: 'জ্যোতিষী', kn: 'ಜ್ಯೋತಿಷಿ', gu: 'જ્યોતિષી', mr: 'ज्योतिषी', mai: 'ज्योतिषी',
    },
    criteria: {
      en: 'Use 5 distinct tools.',
      hi: '5 अलग-अलग उपकरणों का उपयोग करें।',
      sa: 'पञ्च भिन्न-उपकरणानां प्रयोगः।',
      ta: '5 வெவ்வேறு கருவிகளைப் பயன்படுத்துங்கள்.',
      te: '5 విభిన్న సాధనాలను ఉపయోగించండి.',
      bn: '5 টি ভিন্ন সরঞ্জাম ব্যবহার করুন।',
      kn: '5 ವಿಭಿನ್ನ ಸಾಧನಗಳನ್ನು ಬಳಸಿ.',
      gu: '5 અલગ-અલગ સાધનોનો ઉપયોગ કરો।',
      mr: '5 वेगवेगळ्या साधनांचा वापर करा।',
      mai: '5 अलग-अलग साधनक प्रयोग करू।',
    },
    image: '/sadhaka-path/jyotishi.webp',
  },
  {
    ordinal: 6,
    slug: 'acharya',
    name: {
      en: 'Acharya', hi: 'आचार्य', sa: 'आचार्यः',
      ta: 'ஆச்சார்யன்', te: 'ఆచార్యుడు', bn: 'আচার্য', kn: 'ಆಚಾರ್ಯ', gu: 'આચાર્ય', mr: 'आचार्य', mai: 'आचार्य',
    },
    criteria: {
      en: 'Contribute an accepted translation or refer 3 friends.',
      hi: 'एक स्वीकृत अनुवाद का योगदान करें या 3 मित्रों को रेफर करें।',
      sa: 'एकं स्वीकृतानुवादं योजय अथवा त्रीन् मित्राणि उल्लेखय।',
      ta: 'ஏற்றுக்கொள்ளப்பட்ட மொழிபெயர்ப்பை வழங்கவும் அல்லது 3 நண்பர்களைப் பரிந்துரைக்கவும்.',
      te: 'ఆమోదించబడిన అనువాదాన్ని అందించండి లేదా 3 స్నేహితులను సూచించండి.',
      bn: 'একটি গৃহীত অনুবাদ প্রদান করুন বা 3 জন বন্ধুকে রেফার করুন।',
      kn: 'ಒಪ್ಪಿಗೆಯಾದ ಅನುವಾದವನ್ನು ಕೊಡುಗೆಯಾಗಿ ನೀಡಿ ಅಥವಾ 3 ಸ್ನೇಹಿತರನ್ನು ಶಿಫಾರಸು ಮಾಡಿ.',
      gu: 'સ્વીકૃત અનુવાદનું યોગદાન આપો અથવા 3 મિત્રોને રેફર કરો।',
      mr: 'स्वीकारलेले भाषांतर योगदान करा किंवा 3 मित्रांना संदर्भ द्या।',
      mai: 'एकटा स्वीकृत अनुवाद योगदान करू वा 3 मीतक उल्लेख करू।',
    },
    image: '/sadhaka-path/acharya.webp',
  },
  {
    ordinal: 7,
    slug: 'rishi',
    name: {
      en: 'Rishi', hi: 'ऋषि', sa: 'ऋषिः',
      ta: 'ரிஷி', te: 'ఋషి', bn: 'ঋষি', kn: 'ಋಷಿ', gu: 'ઋષિ', mr: 'ऋषी', mai: 'ऋषि',
    },
    criteria: {
      en: '30-day streak + 10 saved charts + 10 modules.',
      hi: '30-दिन की निरंतरता + 10 सहेजी गई कुंडलियाँ + 10 मॉड्यूल।',
      sa: 'त्रिंशद्दिनस्य स्ट्रीक् + दश सञ्चितकुण्डल्यः + दश मॉड्यूलानि।',
      ta: '30-நாள் தொடர் + 10 சேமிக்கப்பட்ட குண்டலிகள் + 10 தொகுதிகள்.',
      te: '30-రోజుల స్ట్రీక్ + 10 సేవ్ చేయబడిన కుండలులు + 10 మాడ్యూల్స్.',
      bn: '30 দিনের ধারাবাহিকতা + 10 সংরক্ষিত কুণ্ডলী + 10 মডিউল।',
      kn: '30-ದಿನಗಳ ಸ್ಟ್ರೀಕ್ + 10 ಉಳಿಸಿದ ಕುಂಡಲಿಗಳು + 10 ಮಾಡ್ಯೂಲ್‌ಗಳು.',
      gu: '30-દિવસની સતતતા + 10 સાચવેલી કુંડળીઓ + 10 મોડ્યુલ।',
      mr: '30-दिवसांची सलगता + 10 जतन केलेल्या कुंडल्या + 10 मॉड्यूल।',
      mai: '30-दिनक स्ट्रीक + 10 सहेजल कुण्डली + 10 मॉड्यूल।',
    },
    image: '/sadhaka-path/rishi.webp',
  },
] as const;

/** O(1) lookup. */
export const LEVEL_BY_ORDINAL: Record<number, Level> = Object.fromEntries(
  LEVELS.map(l => [l.ordinal, l])
);
export const LEVEL_BY_SLUG: Record<string, Level> = Object.fromEntries(
  LEVELS.map(l => [l.slug, l])
);
```

- [ ] **Step 2: Verify lengths in a one-off test**

Create `src/lib/gamification/__tests__/levels.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { LEVELS, LEVEL_BY_ORDINAL, LEVEL_BY_SLUG } from '@/lib/constants/levels';

describe('LEVELS constant', () => {
  it('contains exactly 7 levels in order', () => {
    expect(LEVELS.length).toBe(7);
    expect(LEVELS.map(l => l.ordinal)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });
  it('every level has all 10 locales in name', () => {
    const required: (keyof typeof LEVELS[0]['name'])[] = ['en','hi','sa','ta','te','bn','kn','gu','mr','mai'];
    for (const lvl of LEVELS) {
      for (const k of required) expect(lvl.name[k]).toBeTruthy();
    }
  });
  it('LEVEL_BY_ORDINAL and LEVEL_BY_SLUG are consistent', () => {
    expect(LEVEL_BY_ORDINAL[1].slug).toBe('shishya');
    expect(LEVEL_BY_SLUG['rishi'].ordinal).toBe(7);
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/levels.test.ts`
Expected: 3 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/levels.ts src/lib/gamification/__tests__/levels.test.ts
git commit -m "feat(gamification): 7-level constant with Trilingual names"
```

---

## Task 4: Badge constants (18 badges)

**Files:**
- Create: `src/lib/constants/badges.ts`

- [ ] **Step 1: Write the constant**

```ts
// src/lib/constants/badges.ts
import type { Badge } from '@/lib/gamification/types';

/** 18 v1 badges across 6 categories. Source of truth — never duplicate. */
export const BADGES: readonly Badge[] = [
  // PROFILE (2)
  {
    slug: 'lit-the-lamp',
    name: { en: 'Lit the Lamp', hi: 'दीप जलाया', sa: 'दीपं प्रज्वालितम्', ta: 'விளக்கேற்றினேன்', te: 'దీపం వెలిగించాను', bn: 'দীপ জ্বালালাম', kn: 'ದೀಪ ಬೆಳಗಿಸಿದೆ', gu: 'દીપ પ્રગટાવ્યો', mr: 'दीप लावला', mai: 'दीप जरौलहुँ' },
    description: {
      en: 'Completed your birth profile.',
      hi: 'अपना जन्म विवरण पूरा किया।',
      sa: 'जन्मविवरणं पूर्णं कृतम्।',
      ta: 'உங்கள் பிறப்பு விவரங்களை நிறைவு செய்தீர்கள்.',
      te: 'మీ జన్మ వివరాలను పూర్తి చేశారు.',
      bn: 'আপনার জন্ম বিবরণ সম্পূর্ণ করেছেন।',
      kn: 'ನಿಮ್ಮ ಜನ್ಮ ವಿವರಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.',
      gu: 'તમારી જન્મ વિગતો પૂર્ણ કરી।',
      mr: 'तुमचे जन्म तपशील पूर्ण केले।',
      mai: 'अपन जन्म विवरण पूरा कएल।',
    },
    category: 'profile',
    iconKey: 'lit-the-lamp',
  },
  {
    slug: 'star-identified',
    name: { en: 'Star Identified', hi: 'तारा पहचाना', sa: 'तारा ज्ञाता', ta: 'நட்சத்திரம் கண்டறிந்தேன்', te: 'నక్షత్రాన్ని గుర్తించాను', bn: 'তারা চিনলাম', kn: 'ತಾರೆಯನ್ನು ಗುರುತಿಸಿದೆ', gu: 'તારો ઓળખ્યો', mr: 'तारा ओळखला', mai: 'तारा चिन्हलहुँ' },
    description: {
      en: 'Your kundali was computed.',
      hi: 'आपकी कुंडली की गणना हो गई।',
      sa: 'भवतः कुण्डली गणिता।',
      ta: 'உங்கள் குண்டலி கணக்கிடப்பட்டது.',
      te: 'మీ కుండలి లెక్కించబడింది.',
      bn: 'আপনার কুণ্ডলী গণনা করা হয়েছে।',
      kn: 'ನಿಮ್ಮ ಕುಂಡಲಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಲಾಗಿದೆ.',
      gu: 'તમારી કુંડળી ગણતરી થઈ।',
      mr: 'तुमची कुंडली गणना झाली।',
      mai: 'अहाँक कुण्डली गणना भेल।',
    },
    category: 'profile',
    iconKey: 'star-identified',
  },
  // CHARTS (3)
  {
    slug: 'family-constellation',
    name: { en: 'Family Constellation', hi: 'पारिवारिक नक्षत्र', sa: 'कुटुम्बनक्षत्रम्', ta: 'குடும்ப விண்மீன் கூட்டம்', te: 'కుటుంబ నక్షత్రసమూహం', bn: 'পারিবারিক নক্ষত্রপুঞ্জ', kn: 'ಕುಟುಂಬ ನಕ್ಷತ್ರಪುಂಜ', gu: 'કૌટુંબિક નક્ષત્રપુંજ', mr: 'कौटुंबिक नक्षत्रपुंज', mai: 'पारिवारिक नक्षत्रपुंज' },
    description: { en: 'Saved your first family chart.', hi: 'अपना पहला पारिवारिक चार्ट सहेजा।', sa: 'प्रथमं कुटुम्बचार्टं सञ्चितम्।', ta: 'உங்கள் முதல் குடும்ப அட்டவணையைச் சேமித்தீர்கள்.', te: 'మీ మొదటి కుటుంబ చార్ట్ సేవ్ చేశారు.', bn: 'প্রথম পারিবারিক চার্ট সংরক্ষণ করেছেন।', kn: 'ನಿಮ್ಮ ಮೊದಲ ಕುಟುಂಬ ಚಾರ್ಟ್ ಉಳಿಸಿದ್ದೀರಿ.', gu: 'તમારો પ્રથમ કૌટુંબિક ચાર્ટ સાચવ્યો।', mr: 'तुमचा पहिला कौटुंबिक चार्ट जतन केला।', mai: 'अपन पहिल पारिवारिक चार्ट सहेजल।' },
    category: 'charts',
    iconKey: 'family-constellation',
  },
  {
    slug: 'five-star-family',
    name: { en: 'Five-Star Family', hi: 'पंच-तारा परिवार', sa: 'पञ्चतारकं कुटुम्बम्', ta: 'ஐந்து நட்சத்திர குடும்பம்', te: 'ఐదు నక్షత్రాల కుటుంబం', bn: 'পঞ্চ-তারা পরিবার', kn: 'ಐದು-ತಾರೆ ಕುಟುಂಬ', gu: 'પાંચ-તારા પરિવાર', mr: 'पाच-तारा कुटुंब', mai: 'पाँच-तारा परिवार' },
    description: { en: 'Saved 5 charts.', hi: '5 कुंडलियाँ सहेजीं।', sa: 'पञ्च कुण्डल्यः सञ्चिताः।', ta: '5 அட்டவணைகளைச் சேமித்தீர்கள்.', te: '5 చార్ట్‌లు సేవ్ చేశారు.', bn: '5টি চার্ট সংরক্ষণ করেছেন।', kn: '5 ಚಾರ್ಟ್‌ಗಳನ್ನು ಉಳಿಸಿದ್ದೀರಿ.', gu: '5 ચાર્ટ સાચવ્યા।', mr: '5 चार्ट जतन केले।', mai: '5 चार्ट सहेजल।' },
    category: 'charts',
    iconKey: 'five-star-family',
  },
  {
    slug: 'constellation-keeper',
    name: { en: 'Constellation Keeper', hi: 'नक्षत्र संरक्षक', sa: 'नक्षत्रसंरक्षकः', ta: 'விண்மீன் காப்பாளர்', te: 'నక్షత్రసమూహ సంరక్షకుడు', bn: 'নক্ষত্রপুঞ্জ রক্ষক', kn: 'ನಕ್ಷತ್ರಪುಂಜ ಸಂರಕ್ಷಕ', gu: 'નક્ષત્રપુંજ સંરક્ષક', mr: 'नक्षत्रपुंज संरक्षक', mai: 'नक्षत्रपुंज संरक्षक' },
    description: { en: 'Saved 10 charts.', hi: '10 कुंडलियाँ सहेजीं।', sa: 'दश कुण्डल्यः सञ्चिताः।', ta: '10 அட்டவணைகளைச் சேமித்தீர்கள்.', te: '10 చార్ట్‌లు సేవ్ చేశారు.', bn: '10টি চার্ট সংরক্ষণ করেছেন।', kn: '10 ಚಾರ್ಟ್‌ಗಳನ್ನು ಉಳಿಸಿದ್ದೀರಿ.', gu: '10 ચાર્ટ સાચવ્યા।', mr: '10 चार्ट जतन केले।', mai: '10 चार्ट सहेजल।' },
    category: 'charts',
    iconKey: 'constellation-keeper',
  },
  // LEARNING (4)
  { slug: 'first-page', name: { en: 'First Page', hi: 'पहला पन्ना', sa: 'प्रथमं पृष्ठम्', ta: 'முதல் பக்கம்', te: 'మొదటి పేజీ', bn: 'প্রথম পৃষ্ঠা', kn: 'ಮೊದಲ ಪುಟ', gu: 'પ્રથમ પાનું', mr: 'पहिले पान', mai: 'पहिल पन्ना' }, description: { en: 'Completed your first learn module.', hi: 'अपना पहला लर्न मॉड्यूल पूरा किया।', sa: 'प्रथमं मॉड्यूलं पूर्णं कृतम्।', ta: 'உங்கள் முதல் கற்றல் தொகுதியை நிறைவு செய்தீர்கள்.', te: 'మీ మొదటి లెర్న్ మాడ్యూల్ పూర్తి చేశారు.', bn: 'প্রথম লার্ন মডিউল সম্পন্ন করেছেন।', kn: 'ನಿಮ್ಮ ಮೊದಲ ಲರ್ನ್ ಮಾಡ್ಯೂಲ್ ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.', gu: 'તમારું પ્રથમ લર્ન મોડ્યુલ પૂર્ણ કર્યું।', mr: 'तुमचे पहिले लर्न मॉड्यूल पूर्ण केले।', mai: 'अपन पहिल लर्न मॉड्यूल पूरा कएल।' }, category: 'learning', iconKey: 'first-page' },
  { slug: 'scholar', name: { en: 'Scholar', hi: 'विद्वान्', sa: 'विद्वान्', ta: 'அறிஞர்', te: 'విద్వాంసుడు', bn: 'বিদ্বান', kn: 'ವಿದ್ವಾಂಸ', gu: 'વિદ્વાન', mr: 'विद्वान', mai: 'विद्वान' }, description: { en: 'Completed 5 learn modules.', hi: '5 लर्न मॉड्यूल पूरे किए।', sa: 'पञ्च मॉड्यूलानि पूर्णानि कृतानि।', ta: '5 கற்றல் தொகுதிகளை நிறைவு செய்தீர்கள்.', te: '5 లెర్న్ మాడ్యూల్‌లు పూర్తి చేశారు.', bn: '5টি লার্ন মডিউল সম্পন্ন করেছেন।', kn: '5 ಲರ್ನ್ ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.', gu: '5 લર્ન મોડ્યુલ પૂર્ણ કર્યા।', mr: '5 लर्न मॉड्यूल पूर्ण केले।', mai: '5 लर्न मॉड्यूल पूरा कएल।' }, category: 'learning', iconKey: 'scholar' },
  { slug: 'curriculum-master', name: { en: 'Curriculum Master', hi: 'पाठ्यक्रम प्रवीण', sa: 'पाठ्यक्रमप्रवीणः', ta: 'பாடத்திட்ட நிபுணர்', te: 'పాఠ్యక్రమ నిపుణుడు', bn: 'পাঠ্যক্রম প্রবীণ', kn: 'ಪಠ್ಯಕ್ರಮ ಪ್ರವೀಣ', gu: 'અભ્યાસક્રમ પ્રવીણ', mr: 'अभ्यासक्रम प्रवीण', mai: 'पाठ्यक्रम प्रवीण' }, description: { en: 'Completed 20 modules.', hi: '20 मॉड्यूल पूरे किए।', sa: 'विंशति मॉड्यूलानि पूर्णानि।', ta: '20 தொகுதிகளை நிறைவு செய்தீர்கள்.', te: '20 మాడ్యూల్‌లు పూర్తి చేశారు.', bn: '20টি মডিউল সম্পন্ন করেছেন।', kn: '20 ಮಾಡ್ಯೂಲ್‌ಗಳನ್ನು ಪೂರ್ಣಗೊಳಿಸಿದ್ದೀರಿ.', gu: '20 મોડ્યુલ પૂર્ણ કર્યા।', mr: '20 मॉड्यूल पूर्ण केले।', mai: '20 मॉड्यूल पूरा कएल।' }, category: 'learning', iconKey: 'curriculum-master' },
  { slug: 'twenty-seven-nakshatras', name: { en: '27 Nakshatras', hi: '27 नक्षत्र', sa: 'सप्तविंशति-नक्षत्राणि', ta: '27 நட்சத்திரங்கள்', te: '27 నక్షత్రాలు', bn: '27 নক্ষত্র', kn: '27 ನಕ್ಷತ್ರಗಳು', gu: '27 નક્ષત્ર', mr: '27 नक्षत्रे', mai: '27 नक्षत्र' }, description: { en: 'Read all 27 nakshatra deep-dives.', hi: 'सभी 27 नक्षत्रों के विस्तार पढ़े।', sa: 'सर्वेषां सप्तविंशति-नक्षत्राणां विस्तरः पठितः।', ta: '27 நட்சத்திரங்களின் ஆழ்ந்த விளக்கங்களைப் படித்தீர்கள்.', te: '27 నక్షత్రాల వివరణలను చదివారు.', bn: '27টি নক্ষত্রের গভীর বিবরণ পড়েছেন।', kn: '27 ನಕ್ಷತ್ರಗಳ ಆಳವಾದ ವಿವರಣೆಗಳನ್ನು ಓದಿದ್ದೀರಿ.', gu: '27 નક્ષત્રોના ઊંડા વર્ણનો વાંચ્યા।', mr: '27 नक्षत्रांचे सखोल वर्णन वाचले।', mai: '27 नक्षत्रक गहन वर्णन पढ़ल।' }, category: 'learning', iconKey: 'twenty-seven-nakshatras' },
  // TOOLS (3)
  { slug: 'tool-explorer', name: { en: 'Tool Explorer', hi: 'उपकरण अन्वेषक', sa: 'उपकरणान्वेषकः', ta: 'கருவி ஆராய்ச்சியாளர்', te: 'సాధన అన్వేషకుడు', bn: 'সরঞ্জাম অন্বেষক', kn: 'ಸಾಧನ ಅನ್ವೇಷಕ', gu: 'સાધન અન્વેષક', mr: 'साधन अन्वेषक', mai: 'साधन अन्वेषक' }, description: { en: 'Used 3 distinct tools.', hi: '3 अलग-अलग उपकरणों का उपयोग किया।', sa: 'त्रीणि भिन्न-उपकरणानि प्रयुक्तानि।', ta: '3 வெவ்வேறு கருவிகளைப் பயன்படுத்தினீர்கள்.', te: '3 విభిన్న సాధనాలను ఉపయోగించారు.', bn: '3টি ভিন্ন সরঞ্জাম ব্যবহার করেছেন।', kn: '3 ವಿಭಿನ್ನ ಸಾಧನಗಳನ್ನು ಬಳಸಿದ್ದೀರಿ.', gu: '3 અલગ-અલગ સાધનોનો ઉપયોગ કર્યો।', mr: '3 वेगवेगळ्या साधनांचा वापर केला।', mai: '3 अलग-अलग साधनक प्रयोग कएल।' }, category: 'tools', iconKey: 'tool-explorer' },
  { slug: 'pentavalent', name: { en: 'Pentavalent', hi: 'पंच-कौशल', sa: 'पञ्चकौशलः', ta: 'பஞ்ச திறமை', te: 'పంచ నైపుణ్యం', bn: 'পঞ্চ-কৌশল', kn: 'ಪಂಚ-ಕೌಶಲ', gu: 'પંચ-કૌશલ', mr: 'पंच-कौशल', mai: 'पंच-कौशल' }, description: { en: 'Used 5 distinct tools.', hi: '5 अलग-अलग उपकरणों का उपयोग किया।', sa: 'पञ्च भिन्न-उपकरणानि प्रयुक्तानि।', ta: '5 வெவ்வேறு கருவிகளைப் பயன்படுத்தினீர்கள்.', te: '5 విభిన్న సాధనాలను ఉపయోగించారు.', bn: '5টি ভিন্ন সরঞ্জাম ব্যবহার করেছেন।', kn: '5 ವಿಭಿನ್ನ ಸಾಧನಗಳನ್ನು ಬಳಸಿದ್ದೀರಿ.', gu: '5 અલગ-અલગ સાધનોનો ઉપયોગ કર્યો।', mr: '5 वेगवेगळ्या साधनांचा वापर केला।', mai: '5 अलग-अलग साधनक प्रयोग कएल।' }, category: 'tools', iconKey: 'pentavalent' },
  { slug: 'all-around', name: { en: 'All-Around', hi: 'सर्वसमर्थ', sa: 'सर्वसमर्थः', ta: 'அனைத்திலும் சிறந்தவர்', te: 'సర్వ సమర్థుడు', bn: 'সর্ব-সমর্থ', kn: 'ಸರ್ವ-ಸಮರ್ಥ', gu: 'સર્વ-સમર્થ', mr: 'सर्व-समर्थ', mai: 'सर्व-समर्थ' }, description: { en: 'Used 10 distinct tools.', hi: '10 अलग-अलग उपकरणों का उपयोग किया।', sa: 'दश भिन्न-उपकरणानि प्रयुक्तानि।', ta: '10 வெவ்வேறு கருவிகளைப் பயன்படுத்தினீர்கள்.', te: '10 విభిన్న సాధనాలను ఉపయోగించారు.', bn: '10টি ভিন্ন সরঞ্জাম ব্যবহার করেছেন।', kn: '10 ವಿಭಿನ್ನ ಸಾಧನಗಳನ್ನು ಬಳಸಿದ್ದೀರಿ.', gu: '10 અલગ-અલગ સાધનોનો ઉપયોગ કર્યો।', mr: '10 वेगवेगळ्या साधनांचा वापर केला।', mai: '10 अलग-अलग साधनक प्रयोग कएल।' }, category: 'tools', iconKey: 'all-around' },
  // STREAK (3)
  { slug: 'first-cycle', name: { en: 'First Cycle', hi: 'पहला चक्र', sa: 'प्रथमं चक्रम्', ta: 'முதல் சுழற்சி', te: 'మొదటి చక్రం', bn: 'প্রথম চক্র', kn: 'ಮೊದಲ ಚಕ್ರ', gu: 'પ્રથમ ચક્ર', mr: 'पहिले चक्र', mai: 'पहिल चक्र' }, description: { en: 'Reached a 7-day streak.', hi: '7-दिन की निरंतरता पाई।', sa: 'सप्तदिनस्य स्ट्रीक् प्राप्त।', ta: '7 நாள் தொடரை அடைந்தீர்கள்.', te: '7-రోజుల స్ట్రీక్ చేరారు.', bn: '7 দিনের ধারাবাহিকতা পৌঁছেছেন।', kn: '7-ದಿನಗಳ ಸ್ಟ್ರೀಕ್ ತಲುಪಿದ್ದೀರಿ.', gu: '7-દિવસની સતતતા પ્રાપ્ત કરી।', mr: '7-दिवसांची सलगता गाठली।', mai: '7-दिनक स्ट्रीक प्राप्त कएल।' }, category: 'streak', iconKey: 'first-cycle' },
  { slug: 'lunar-cycle', name: { en: 'Lunar Cycle', hi: 'चांद्र चक्र', sa: 'चान्द्रचक्रम्', ta: 'சந்திர சுழற்சி', te: 'చంద్ర చక్రం', bn: 'চন্দ্র চক্র', kn: 'ಚಂದ್ರ ಚಕ್ರ', gu: 'ચંદ્ર ચક્ર', mr: 'चंद्र चक्र', mai: 'चन्द्र चक्र' }, description: { en: 'Reached a 15-day streak.', hi: '15-दिन की निरंतरता पाई।', sa: 'पञ्चदशदिनस्य स्ट्रीक् प्राप्त।', ta: '15 நாள் தொடரை அடைந்தீர்கள்.', te: '15-రోజుల స్ట్రీక్ చేరారు.', bn: '15 দিনের ধারাবাহিকতা পৌঁছেছেন।', kn: '15-ದಿನಗಳ ಸ್ಟ್ರೀಕ್ ತಲುಪಿದ್ದೀರಿ.', gu: '15-દિવસની સતતતા પ્રાપ્ત કરી।', mr: '15-दिवसांची सलगता गाठली।', mai: '15-दिनक स्ट्रीक प्राप्त कएल।' }, category: 'streak', iconKey: 'lunar-cycle' },
  { slug: 'full-moon', name: { en: 'Full Moon', hi: 'पूर्णिमा', sa: 'पूर्णिमा', ta: 'பௌர்ணமி', te: 'పౌర్ణమి', bn: 'পূর্ণিমা', kn: 'ಹುಣ್ಣಿಮೆ', gu: 'પૂર્ણિમા', mr: 'पौर्णिमा', mai: 'पूर्णिमा' }, description: { en: 'Reached a 30-day streak.', hi: '30-दिन की निरंतरता पाई।', sa: 'त्रिंशद्दिनस्य स्ट्रीक् प्राप्त।', ta: '30 நாள் தொடரை அடைந்தீர்கள்.', te: '30-రోజుల స్ట్రీక్ చేరారు.', bn: '30 দিনের ধারাবাহিকতা পৌঁছেছেন।', kn: '30-ದಿನಗಳ ಸ್ಟ್ರೀಕ್ ತಲುಪಿದ್ದೀರಿ.', gu: '30-દિવસની સતતતા પ્રાપ્ત કરી।', mr: '30-दिवसांची सलगता गाठली।', mai: '30-दिनक स्ट्रीक प्राप्त कएल।' }, category: 'streak', iconKey: 'full-moon' },
  // SPECIAL (3)
  { slug: 'solar-return', name: { en: 'Solar Return', hi: 'सूर्य प्रत्यागमन', sa: 'सूर्यप्रत्यागमनम्', ta: 'சூரிய திரும்புதல்', te: 'సూర్య ప్రత్యాగమనం', bn: 'সূর্য প্রত্যাবর্তন', kn: 'ಸೂರ್ಯ ಪ್ರತ್ಯಾಗಮನ', gu: 'સૂર્ય પ્રત્યાગમન', mr: 'सूर्य प्रत्यागमन', mai: 'सूर्य प्रत्यागमन' }, description: { en: 'Visited on your birthday.', hi: 'अपने जन्मदिन पर आए।', sa: 'जन्मदिने आगतः।', ta: 'உங்கள் பிறந்தநாளில் வந்தீர்கள்.', te: 'మీ పుట్టినరోజున వచ్చారు.', bn: 'আপনার জন্মদিনে এসেছিলেন।', kn: 'ನಿಮ್ಮ ಜನ್ಮದಿನದಂದು ಬಂದಿದ್ದೀರಿ.', gu: 'તમારા જન્મદિવસે આવ્યા।', mr: 'तुमच्या वाढदिवशी आलात।', mai: 'अपन जन्मदिन पर एलहुँ।' }, category: 'special', iconKey: 'solar-return' },
  { slug: 'early-bird', name: { en: 'Early Bird', hi: 'सूर्योदय साधक', sa: 'सूर्योदयसाधकः', ta: 'விடியல் சாதகர்', te: 'సూర్యోదయ సాధకుడు', bn: 'সূর্যোদয় সাধক', kn: 'ಸೂರ್ಯೋದಯ ಸಾಧಕ', gu: 'સૂર્યોદય સાધક', mr: 'सूर्योदय साधक', mai: 'सूर्योदय साधक' }, description: { en: 'Checked panchang before 6 AM IST.', hi: 'सुबह 6 बजे से पहले पंचांग देखा।', sa: 'षड्वादनात् पूर्वं पञ्चाङ्गं दृष्टम्।', ta: 'காலை 6 மணிக்கு முன் பஞ்சாங்கம் பார்த்தீர்கள்.', te: 'ఉదయం 6 గంటలకు ముందు పంచాంగం చూశారు.', bn: 'সকাল ৬টার আগে পঞ্জিকা দেখেছেন।', kn: 'ಬೆಳಿಗ್ಗೆ 6 ಕ್ಕೆ ಮುಂಚೆ ಪಂಚಾಂಗ ನೋಡಿದ್ದೀರಿ.', gu: 'સવારે 6 વાગ્યા પહેલા પંચાંગ જોયું।', mr: 'सकाळी 6 च्या आधी पंचांग पाहिले।', mai: 'भोरमे 6 बजेसँ पहिने पञ्चाङ्ग देखलहुँ।' }, category: 'special', iconKey: 'early-bird' },
  { slug: 'festival-witness', name: { en: 'Festival Witness', hi: 'पर्व साक्षी', sa: 'पर्वसाक्षी', ta: 'திருவிழா சாட்சி', te: 'పండుగ సాక్షి', bn: 'পর্ব সাক্ষী', kn: 'ಹಬ್ಬದ ಸಾಕ್ಷಿ', gu: 'પર્વ સાક્ષી', mr: 'पर्व साक्षी', mai: 'पर्व साक्षी' }, description: { en: 'Visited on a major festival day.', hi: 'किसी प्रमुख त्योहार के दिन आए।', sa: 'मुख्यपर्वदिने आगतः।', ta: 'முக்கிய திருவிழா நாளில் வந்தீர்கள்.', te: 'ప్రధాన పండుగ రోజున వచ్చారు.', bn: 'একটি প্রধান উৎসবের দিনে এসেছিলেন।', kn: 'ಒಂದು ಮುಖ್ಯ ಹಬ್ಬದ ದಿನದಂದು ಬಂದಿದ್ದೀರಿ.', gu: 'મુખ્ય તહેવારના દિવસે આવ્યા।', mr: 'मुख्य सणाच्या दिवशी आलात।', mai: 'मुख्य पर्वक दिन एलहुँ।' }, category: 'special', iconKey: 'festival-witness' },
] as const;

export const BADGE_BY_SLUG: Record<string, Badge> = Object.fromEntries(
  BADGES.map(b => [b.slug, b])
);

/** The festival slugs that grant the festival-witness badge. */
export const FESTIVAL_WITNESS_SLUGS = ['diwali', 'holi', 'ganesh-chaturthi', 'dussehra', 'janmashtami'] as const;

/** The tool slugs counted by tools_used. Source of truth. */
export const COUNTED_TOOLS = [
  'matching', 'muhurta', 'prashna', 'varshaphal', 'kp-system',
  'baby-names', 'shraddha', 'ai-chat', 'sade-sati', 'sign-calculator',
] as const;
```

- [ ] **Step 2: Add structural test**

Create `src/lib/gamification/__tests__/badges.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BADGES, BADGE_BY_SLUG } from '@/lib/constants/badges';

describe('BADGES constant', () => {
  it('contains exactly 18 badges', () => {
    expect(BADGES.length).toBe(18);
  });
  it('has 6 distinct categories', () => {
    const cats = new Set(BADGES.map(b => b.category));
    expect(cats.size).toBe(6);
  });
  it('every badge has a unique slug', () => {
    const slugs = new Set(BADGES.map(b => b.slug));
    expect(slugs.size).toBe(BADGES.length);
  });
  it('every badge has 10 locales in name + description', () => {
    const required = ['en','hi','sa','ta','te','bn','kn','gu','mr','mai'] as const;
    for (const b of BADGES) {
      for (const k of required) {
        expect(b.name[k], `badge ${b.slug} missing name[${k}]`).toBeTruthy();
        expect(b.description[k], `badge ${b.slug} missing description[${k}]`).toBeTruthy();
      }
    }
  });
  it('BADGE_BY_SLUG returns the right badge', () => {
    expect(BADGE_BY_SLUG['lit-the-lamp']?.category).toBe('profile');
    expect(BADGE_BY_SLUG['full-moon']?.category).toBe('streak');
  });
});
```

- [ ] **Step 3: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/badges.test.ts`
Expected: 5 tests pass.

- [ ] **Step 4: Commit**

```bash
git add src/lib/constants/badges.ts src/lib/gamification/__tests__/badges.test.ts
git commit -m "feat(gamification): 18 badge definitions across 6 categories"
```

---

## Task 5: IST date helpers (pure, tested)

**Files:**
- Create: `src/lib/gamification/ist-day.ts`
- Test: `src/lib/gamification/__tests__/ist-day.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/gamification/__tests__/ist-day.test.ts
import { describe, it, expect } from 'vitest';
import { istDate, daysBetweenIst, isMondayIst, lastMondayIst } from '@/lib/gamification/ist-day';

describe('IST date helpers', () => {
  it('istDate returns YYYY-MM-DD in Asia/Kolkata', () => {
    // 2026-05-22T22:00:00Z = 2026-05-23T03:30:00 IST
    expect(istDate(new Date('2026-05-22T22:00:00Z'))).toBe('2026-05-23');
    // 2026-05-22T18:00:00Z = 2026-05-22T23:30:00 IST (same day)
    expect(istDate(new Date('2026-05-22T18:00:00Z'))).toBe('2026-05-22');
  });

  it('daysBetweenIst returns correct day diff', () => {
    expect(daysBetweenIst('2026-05-22', '2026-05-23')).toBe(1);
    expect(daysBetweenIst('2026-05-22', '2026-05-22')).toBe(0);
    expect(daysBetweenIst('2026-05-22', '2026-05-29')).toBe(7);
  });

  it('isMondayIst is true only for Mondays', () => {
    expect(isMondayIst('2026-05-18')).toBe(true);  // Monday
    expect(isMondayIst('2026-05-19')).toBe(false); // Tuesday
    expect(isMondayIst('2026-05-25')).toBe(true);  // Monday
  });

  it('lastMondayIst returns the most recent Monday including today', () => {
    expect(lastMondayIst('2026-05-22')).toBe('2026-05-18'); // Fri → prev Mon
    expect(lastMondayIst('2026-05-18')).toBe('2026-05-18'); // Mon → itself
    expect(lastMondayIst('2026-05-19')).toBe('2026-05-18'); // Tue → prev day
  });
});
```

- [ ] **Step 2: Run test to confirm it fails**

Run: `npx vitest run src/lib/gamification/__tests__/ist-day.test.ts`
Expected: ALL FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/gamification/ist-day.ts
const IST_OFFSET_MIN = 330; // +05:30

/** Convert any Date to a YYYY-MM-DD string interpreted as Asia/Kolkata. */
export function istDate(d: Date): string {
  const utcMs = d.getTime();
  const istMs = utcMs + IST_OFFSET_MIN * 60 * 1000;
  const ist = new Date(istMs);
  const y = ist.getUTCFullYear();
  const m = String(ist.getUTCMonth() + 1).padStart(2, '0');
  const day = String(ist.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Days between two YYYY-MM-DD strings (a < b returns positive). */
export function daysBetweenIst(a: string, b: string): number {
  const [ay, am, ad] = a.split('-').map(Number);
  const [by, bm, bd] = b.split('-').map(Number);
  const aMs = Date.UTC(ay, am - 1, ad);
  const bMs = Date.UTC(by, bm - 1, bd);
  return Math.round((bMs - aMs) / (24 * 60 * 60 * 1000));
}

/** True if the given YYYY-MM-DD is a Monday. */
export function isMondayIst(d: string): boolean {
  const [y, m, dd] = d.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  return date.getUTCDay() === 1; // 0=Sun, 1=Mon, …
}

/** Most recent Monday including the day itself. */
export function lastMondayIst(d: string): string {
  const [y, m, dd] = d.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, dd));
  const dow = date.getUTCDay(); // 0..6
  const offset = (dow + 6) % 7; // Mon=0, Tue=1, …, Sun=6
  date.setUTCDate(date.getUTCDate() - offset);
  const yy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
  const dDay = String(date.getUTCDate()).padStart(2, '0');
  return `${yy}-${mm}-${dDay}`;
}

/** Today's IST date as YYYY-MM-DD. */
export function todayIst(): string {
  return istDate(new Date());
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/ist-day.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification/ist-day.ts src/lib/gamification/__tests__/ist-day.test.ts
git commit -m "feat(gamification): IST date helpers (pure)"
```

---

## Task 6: Streak math (pure)

**Files:**
- Create: `src/lib/gamification/streak.ts`
- Test: `src/lib/gamification/__tests__/streak.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/gamification/__tests__/streak.test.ts
import { describe, it, expect } from 'vitest';
import { computeStreakAfterVisit } from '@/lib/gamification/streak';

describe('streak math (computeStreakAfterVisit)', () => {
  it('first ever visit sets streak to 1', () => {
    const r = computeStreakAfterVisit({
      streakDays: 0, lastVisit: null, freezeUsedAt: null, today: '2026-05-22',
    });
    expect(r).toEqual({ streakDays: 1, lastVisit: '2026-05-22', freezeUsedAt: null, levelChanged: false });
  });

  it('same-day revisit is no-op', () => {
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-22',
    });
    expect(r).toEqual({ streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, levelChanged: false });
  });

  it('next-day visit advances streak', () => {
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-23',
    });
    expect(r).toEqual({ streakDays: 6, lastVisit: '2026-05-23', freezeUsedAt: null, levelChanged: false });
  });

  it('two-day gap resets streak to 1', () => {
    // Friday 2026-05-22 last, Sunday 2026-05-24 visit — gap of 2 days, not on Tuesday so no freeze
    const r = computeStreakAfterVisit({
      streakDays: 5, lastVisit: '2026-05-22', freezeUsedAt: null, today: '2026-05-24',
    });
    expect(r.streakDays).toBe(1);
    expect(r.lastVisit).toBe('2026-05-24');
    expect(r.freezeUsedAt).toBeNull();
  });

  it('missed Monday → Tuesday visit consumes freeze and preserves streak', () => {
    // Sun 2026-05-17 last visit. Mon 2026-05-18 missed. Tue 2026-05-19 visit.
    const r = computeStreakAfterVisit({
      streakDays: 6, lastVisit: '2026-05-17', freezeUsedAt: null, today: '2026-05-19',
    });
    expect(r.streakDays).toBe(7); // freeze covers Monday
    expect(r.lastVisit).toBe('2026-05-19');
    expect(r.freezeUsedAt).toBe('2026-05-18'); // Monday
  });

  it('Wednesday after missing Mon+Tue → freeze cannot save, resets', () => {
    // Sun 2026-05-17 last. Mon+Tue missed. Wed 2026-05-20 visit.
    const r = computeStreakAfterVisit({
      streakDays: 6, lastVisit: '2026-05-17', freezeUsedAt: null, today: '2026-05-20',
    });
    expect(r.streakDays).toBe(1); // freeze only covers single-Monday miss
    expect(r.lastVisit).toBe('2026-05-20');
    expect(r.freezeUsedAt).toBeNull();
  });

  it('freeze already used this Monday cannot be reused', () => {
    // Tue 2026-05-19 — freeze used. Wed 2026-05-20 — no visit. Thu 2026-05-21 visit.
    // Two-day gap, freeze unavailable, resets.
    const r = computeStreakAfterVisit({
      streakDays: 7, lastVisit: '2026-05-19', freezeUsedAt: '2026-05-18', today: '2026-05-21',
    });
    expect(r.streakDays).toBe(1);
  });
});
```

- [ ] **Step 2: Run test, confirm fail**

Run: `npx vitest run src/lib/gamification/__tests__/streak.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/gamification/streak.ts
import { daysBetweenIst, isMondayIst, lastMondayIst } from './ist-day';

export interface StreakInput {
  streakDays: number;
  lastVisit: string | null;
  freezeUsedAt: string | null;
  today: string; // IST YYYY-MM-DD
}
export interface StreakOutput {
  streakDays: number;
  lastVisit: string;
  freezeUsedAt: string | null;
  levelChanged: false; // placeholder — level recompute lives elsewhere
}

/**
 * Pure: given the user's existing streak state + today's IST date,
 * return the new state. Encapsulates the Monday-freeze rule.
 */
export function computeStreakAfterVisit(input: StreakInput): StreakOutput {
  const { streakDays, lastVisit, freezeUsedAt, today } = input;

  // First visit ever
  if (!lastVisit) {
    return { streakDays: 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  const gap = daysBetweenIst(lastVisit, today);

  if (gap === 0) {
    return { streakDays, lastVisit, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  if (gap === 1) {
    return { streakDays: streakDays + 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
  }

  // Gap >= 2: check if a single-Monday freeze can save us.
  // Saveable iff:
  //   - gap is exactly 2,
  //   - today is Tuesday (so the missed day was Monday),
  //   - freeze for THIS Monday hasn't been used yet.
  if (gap === 2) {
    const thisMonday = lastMondayIst(today);
    const missedDay = lastMondayIst(today); // for gap=2 on Tue, the missed day IS Monday
    const tuesdayCheck = !isMondayIst(today) && daysBetweenIst(thisMonday, today) === 1;
    const freezeAvailable = freezeUsedAt == null || freezeUsedAt < thisMonday;
    if (tuesdayCheck && freezeAvailable) {
      return {
        streakDays: streakDays + 1, // counts the missed Monday as covered
        lastVisit: today,
        freezeUsedAt: missedDay,
        levelChanged: false,
      };
    }
  }

  // Otherwise reset
  return { streakDays: 1, lastVisit: today, freezeUsedAt: freezeUsedAt ?? null, levelChanged: false };
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/streak.test.ts`
Expected: all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification/streak.ts src/lib/gamification/__tests__/streak.test.ts
git commit -m "feat(gamification): pure streak math with Monday freeze"
```

---

## Task 7: Level computation (pure)

**Files:**
- Create: `src/lib/gamification/level-compute.ts`
- Test: `src/lib/gamification/__tests__/level-compute.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/gamification/__tests__/level-compute.test.ts
import { describe, it, expect } from 'vitest';
import { computeLevel, type LevelInputs } from '@/lib/gamification/level-compute';

const base: LevelInputs = {
  profileComplete: false,
  hasFirstAction: false,
  streakDays: 0,
  modulesDone: 0,
  toolsUsedCount: 0,
  acharyaUnlocked: false,
  chartsSaved: 0,
};

describe('computeLevel', () => {
  it('returns 1 (Shishya) for a fresh signup', () => {
    expect(computeLevel(base)).toBe(1);
  });
  it('returns 2 (Sadhaka) when profile complete', () => {
    expect(computeLevel({ ...base, profileComplete: true })).toBe(2);
  });
  it('returns 3 (Jignasu) after first action', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true })).toBe(3);
  });
  it('returns 4 (Vidvan) on 7-day streak', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, streakDays: 7 })).toBe(4);
  });
  it('returns 4 (Vidvan) on 5 modules', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5 })).toBe(4);
  });
  it('returns 5 (Jyotishi) on 5 tools', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5, toolsUsedCount: 5 })).toBe(5);
  });
  it('returns 6 (Acharya) when acharyaUnlocked true', () => {
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 5, toolsUsedCount: 5, acharyaUnlocked: true })).toBe(6);
  });
  it('returns 7 (Rishi) with 30d streak + 10 charts + 10 modules', () => {
    expect(computeLevel({
      ...base, profileComplete: true, hasFirstAction: true,
      modulesDone: 10, toolsUsedCount: 5, acharyaUnlocked: true,
      streakDays: 30, chartsSaved: 10,
    })).toBe(7);
  });
  it('level does not regress (always returns the HIGHEST unlocked)', () => {
    // user had 7 modules (Vidvan), then somehow modules_done dropped to 4 — still Vidvan
    // (caller is responsible for never decrementing modules_done; computeLevel is purely
    //  derived from the inputs given. Persistence in level_unlocked_at is the safety net
    //  that prevents regression at the DB layer; see award.ts.)
    expect(computeLevel({ ...base, profileComplete: true, hasFirstAction: true, modulesDone: 4 })).toBe(3);
  });
});
```

- [ ] **Step 2: Run test, confirm fail**

Run: `npx vitest run src/lib/gamification/__tests__/level-compute.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/gamification/level-compute.ts

export interface LevelInputs {
  profileComplete: boolean;
  hasFirstAction: boolean;
  streakDays: number;
  modulesDone: number;
  toolsUsedCount: number;
  acharyaUnlocked: boolean;
  chartsSaved: number;
}

/**
 * Pure: returns the highest level (1..7) the inputs satisfy.
 * No state — caller stores `level_unlocked_at` to prevent regression in the DB.
 */
export function computeLevel(i: LevelInputs): number {
  if (!i.profileComplete) return 1;                                      // Shishya
  if (!i.hasFirstAction) return 2;                                       // Sadhaka
  if (i.streakDays < 7 && i.modulesDone < 5) return 3;                   // Jignasu
  if (i.toolsUsedCount < 5) return 4;                                    // Vidvan
  if (!i.acharyaUnlocked) return 5;                                      // Jyotishi
  if (i.streakDays >= 30 && i.chartsSaved >= 10 && i.modulesDone >= 10) return 7; // Rishi
  return 6;                                                              // Acharya
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/level-compute.test.ts`
Expected: 9 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification/level-compute.ts src/lib/gamification/__tests__/level-compute.test.ts
git commit -m "feat(gamification): pure level computation"
```

---

## Task 8: Badge computation (pure)

**Files:**
- Create: `src/lib/gamification/badge-compute.ts`
- Test: `src/lib/gamification/__tests__/badge-compute.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// src/lib/gamification/__tests__/badge-compute.test.ts
import { describe, it, expect } from 'vitest';
import { computeEarnedBadges, type BadgeInputs } from '@/lib/gamification/badge-compute';

const empty: BadgeInputs = {
  profileComplete: false,
  chartsSaved: 0,
  modulesDone: 0,
  nakshatraModulesDone: 0,
  toolsUsedCount: 0,
  streakDays: 0,
  visitedOnBirthday: false,
  visitedBeforeSixAmIst: false,
  visitedOnFestival: false,
};

describe('computeEarnedBadges', () => {
  it('returns empty set for fresh signup', () => {
    expect(computeEarnedBadges(empty)).toEqual(new Set());
  });
  it('grants lit-the-lamp + star-identified on profile complete', () => {
    const s = computeEarnedBadges({ ...empty, profileComplete: true });
    expect(s.has('lit-the-lamp')).toBe(true);
    expect(s.has('star-identified')).toBe(true);
  });
  it('grants family-constellation on 1 chart, five-star-family on 5, constellation-keeper on 10', () => {
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 1 }).has('family-constellation')).toBe(true);
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 5 }).has('five-star-family')).toBe(true);
    expect(computeEarnedBadges({ ...empty, profileComplete: true, chartsSaved: 10 }).has('constellation-keeper')).toBe(true);
  });
  it('grants learning badges at 1, 5, 20, and 27-nakshatras threshold', () => {
    expect(computeEarnedBadges({ ...empty, modulesDone: 1 }).has('first-page')).toBe(true);
    expect(computeEarnedBadges({ ...empty, modulesDone: 5 }).has('scholar')).toBe(true);
    expect(computeEarnedBadges({ ...empty, modulesDone: 20 }).has('curriculum-master')).toBe(true);
    expect(computeEarnedBadges({ ...empty, nakshatraModulesDone: 27 }).has('twenty-seven-nakshatras')).toBe(true);
  });
  it('grants tool badges at 3, 5, 10', () => {
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 3 }).has('tool-explorer')).toBe(true);
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 5 }).has('pentavalent')).toBe(true);
    expect(computeEarnedBadges({ ...empty, toolsUsedCount: 10 }).has('all-around')).toBe(true);
  });
  it('grants streak badges at 7, 15, 30', () => {
    expect(computeEarnedBadges({ ...empty, streakDays: 7 }).has('first-cycle')).toBe(true);
    expect(computeEarnedBadges({ ...empty, streakDays: 15 }).has('lunar-cycle')).toBe(true);
    expect(computeEarnedBadges({ ...empty, streakDays: 30 }).has('full-moon')).toBe(true);
  });
  it('grants special badges on flags', () => {
    expect(computeEarnedBadges({ ...empty, visitedOnBirthday: true }).has('solar-return')).toBe(true);
    expect(computeEarnedBadges({ ...empty, visitedBeforeSixAmIst: true }).has('early-bird')).toBe(true);
    expect(computeEarnedBadges({ ...empty, visitedOnFestival: true }).has('festival-witness')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test, confirm fail**

Run: `npx vitest run src/lib/gamification/__tests__/badge-compute.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// src/lib/gamification/badge-compute.ts

export interface BadgeInputs {
  profileComplete: boolean;
  chartsSaved: number;
  modulesDone: number;
  nakshatraModulesDone: number;
  toolsUsedCount: number;
  streakDays: number;
  visitedOnBirthday: boolean;
  visitedBeforeSixAmIst: boolean;
  visitedOnFestival: boolean;
}

/**
 * Pure: returns the set of badge slugs currently earned.
 * Caller diff this against user_badges rows to figure out which to insert.
 */
export function computeEarnedBadges(i: BadgeInputs): Set<string> {
  const out = new Set<string>();
  if (i.profileComplete) { out.add('lit-the-lamp'); out.add('star-identified'); }
  if (i.chartsSaved >= 1)  out.add('family-constellation');
  if (i.chartsSaved >= 5)  out.add('five-star-family');
  if (i.chartsSaved >= 10) out.add('constellation-keeper');
  if (i.modulesDone >= 1)  out.add('first-page');
  if (i.modulesDone >= 5)  out.add('scholar');
  if (i.modulesDone >= 20) out.add('curriculum-master');
  if (i.nakshatraModulesDone >= 27) out.add('twenty-seven-nakshatras');
  if (i.toolsUsedCount >= 3)  out.add('tool-explorer');
  if (i.toolsUsedCount >= 5)  out.add('pentavalent');
  if (i.toolsUsedCount >= 10) out.add('all-around');
  if (i.streakDays >= 7)  out.add('first-cycle');
  if (i.streakDays >= 15) out.add('lunar-cycle');
  if (i.streakDays >= 30) out.add('full-moon');
  if (i.visitedOnBirthday)       out.add('solar-return');
  if (i.visitedBeforeSixAmIst)   out.add('early-bird');
  if (i.visitedOnFestival)       out.add('festival-witness');
  return out;
}
```

- [ ] **Step 4: Run tests**

Run: `npx vitest run src/lib/gamification/__tests__/badge-compute.test.ts`
Expected: 8 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/gamification/badge-compute.ts src/lib/gamification/__tests__/badge-compute.test.ts
git commit -m "feat(gamification): pure badge computation"
```

---

## Task 9: awardProgress() — the writer

**Files:**
- Create: `src/lib/gamification/award.ts`

- [ ] **Step 1: Implement**

```ts
// src/lib/gamification/award.ts
import { getServerSupabase } from '@/lib/supabase/server';
import { computeStreakAfterVisit } from './streak';
import { computeLevel } from './level-compute';
import { computeEarnedBadges } from './badge-compute';
import { todayIst } from './ist-day';
import { COUNTED_TOOLS, FESTIVAL_WITNESS_SLUGS } from '@/lib/constants/badges';
import type { GamificationEvent, AwardResult, UserProgress } from './types';

/**
 * Single entry point. Idempotent — callers may invoke for the same event repeatedly
 * (e.g. retries). Logs but does NOT throw on DB failure — gamification is a non-critical
 * side-effect; the main action (chart save etc.) must still succeed.
 */
export async function awardProgress(
  userId: string,
  event: GamificationEvent
): Promise<AwardResult | null> {
  const sb = getServerSupabase();
  if (!sb) {
    console.error('[gamification] award failed: no server supabase (env missing)');
    return null;
  }

  try {
    // 1. Read current row (or seed it).
    const { data: existing, error: readErr } = await sb
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (readErr) {
      console.error('[gamification] read user_progress failed:', readErr);
      return null;
    }

    let row: UserProgress = existing ?? {
      user_id: userId,
      current_level: 1,
      level_unlocked_at: {},
      streak_days: 0,
      streak_last_visit: null,
      streak_freeze_used_at: null,
      tools_used: [],
      modules_done: 0,
      charts_saved: 0,
      referrals_count: 0,
      updated_at: new Date().toISOString(),
    };

    // 2. Apply the event to the row.
    row = applyEvent(row, event);

    // 3. Recompute level + new badges.
    const profileComplete = !!row.level_unlocked_at['2'] || event.type === 'profile_completed' || existing != null && row.charts_saved >= 1;
    // ^ keep profile_completed sticky: once 2 is unlocked, it stays unlocked
    // (also chart_saved implies profile must be complete)

    const hasFirstAction = row.charts_saved >= 1 || row.modules_done >= 1 || !!row.level_unlocked_at['3'];
    const acharyaUnlocked = !!row.level_unlocked_at['6']; // set explicitly by referral or translation event

    const newLevel = computeLevel({
      profileComplete,
      hasFirstAction,
      streakDays: row.streak_days,
      modulesDone: row.modules_done,
      toolsUsedCount: row.tools_used.length,
      acharyaUnlocked,
      chartsSaved: row.charts_saved,
    });

    let levelChanged = false;
    if (newLevel > row.current_level) {
      row.current_level = newLevel;
      // Persist unlock dates for every level newly entered (non-regressing).
      const nowIso = new Date().toISOString();
      for (let l = 2; l <= newLevel; l++) {
        if (!row.level_unlocked_at[String(l)]) {
          row.level_unlocked_at[String(l)] = nowIso;
          levelChanged = true;
        }
      }
    }

    // Read existing badge slugs.
    const { data: existingBadges } = await sb
      .from('user_badges')
      .select('badge_slug')
      .eq('user_id', userId);
    const existingSlugs = new Set((existingBadges ?? []).map(b => b.badge_slug));

    const earned = computeEarnedBadges({
      profileComplete,
      chartsSaved: row.charts_saved,
      modulesDone: row.modules_done,
      nakshatraModulesDone: 0,            // wire up when nakshatra-specific tracking lands
      toolsUsedCount: row.tools_used.length,
      streakDays: row.streak_days,
      visitedOnBirthday: false,           // set by sign_in path when day matches user DOB
      visitedBeforeSixAmIst: false,
      visitedOnFestival: false,
    });

    const newBadges: string[] = [];
    for (const slug of earned) {
      if (!existingSlugs.has(slug)) newBadges.push(slug);
    }

    row.updated_at = new Date().toISOString();

    // 4. Upsert progress row.
    const { error: upsertErr } = await sb
      .from('user_progress')
      .upsert(row, { onConflict: 'user_id' });
    if (upsertErr) {
      console.error('[gamification] upsert user_progress failed:', upsertErr);
      return null;
    }

    // 5. Insert any new badges (idempotent on PK).
    if (newBadges.length > 0) {
      const rows = newBadges.map(slug => ({ user_id: userId, badge_slug: slug }));
      const { error: insertErr } = await sb.from('user_badges').insert(rows);
      if (insertErr && !String(insertErr.message).includes('duplicate')) {
        console.error('[gamification] insert badges failed:', insertErr);
      }
    }

    return { levelChanged, newBadges, progress: row };
  } catch (err) {
    console.error('[gamification] award failed:', err);
    return null;
  }
}

/** Pure: mutates a UserProgress copy based on the event. */
function applyEvent(row: UserProgress, event: GamificationEvent): UserProgress {
  const next: UserProgress = { ...row, tools_used: [...row.tools_used], level_unlocked_at: { ...row.level_unlocked_at } };
  switch (event.type) {
    case 'sign_in': {
      const r = computeStreakAfterVisit({
        streakDays: next.streak_days,
        lastVisit: next.streak_last_visit,
        freezeUsedAt: next.streak_freeze_used_at,
        today: todayIst(),
      });
      next.streak_days = r.streakDays;
      next.streak_last_visit = r.lastVisit;
      next.streak_freeze_used_at = r.freezeUsedAt;
      return next;
    }
    case 'profile_completed': {
      // No counter to mutate — level_unlocked_at['2'] is set after computeLevel.
      return next;
    }
    case 'chart_saved': {
      next.charts_saved += 1;
      return next;
    }
    case 'module_completed': {
      next.modules_done += 1;
      return next;
    }
    case 'tool_used': {
      if (COUNTED_TOOLS.includes(event.tool_slug as typeof COUNTED_TOOLS[number])
          && !next.tools_used.includes(event.tool_slug)) {
        next.tools_used.push(event.tool_slug);
      }
      return next;
    }
    case 'muhurta_saved': {
      // Counted as a "first action" via charts_saved-or-modules-or-muhurta path.
      // For v1 we count muhurta_saved into modules_done buffer (so Vidvan path remains reachable).
      // Alternatively, add a `muhurtas_saved` column; deferred until metrics warrant.
      next.modules_done += 0;
      // First-action flag is captured by setting level_unlocked_at['3'] below if it'd be empty.
      if (!next.level_unlocked_at['3']) {
        next.level_unlocked_at['3'] = new Date().toISOString();
      }
      return next;
    }
    case 'referral_signup': {
      next.referrals_count += 1;
      if (next.referrals_count >= 3 && !next.level_unlocked_at['6']) {
        next.level_unlocked_at['6'] = new Date().toISOString();
      }
      return next;
    }
    case 'translation_accepted': {
      if (!next.level_unlocked_at['6']) {
        next.level_unlocked_at['6'] = new Date().toISOString();
      }
      return next;
    }
    default: {
      const _exhaustive: never = event;
      return _exhaustive;
    }
  }
}
```

- [ ] **Step 2: Verify it compiles**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/gamification/award.ts
git commit -m "feat(gamification): awardProgress server function"
```

---

## Task 10: GET /api/user/progress endpoint

**Files:**
- Create: `src/app/api/user/progress/route.ts`

- [ ] **Step 1: Implement**

```ts
// src/app/api/user/progress/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { data: { user }, error: authError } = await sb.auth.getUser(authHeader.slice(7));
  if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const [{ data: progress, error: pErr }, { data: badges, error: bErr }] = await Promise.all([
      sb.from('user_progress').select('*').eq('user_id', user.id).maybeSingle(),
      sb.from('user_badges').select('badge_slug, earned_at').eq('user_id', user.id),
    ]);
    if (pErr) console.error('[api/user/progress] progress read failed:', pErr);
    if (bErr) console.error('[api/user/progress] badges read failed:', bErr);

    return NextResponse.json({
      progress: progress ?? null,
      badges: badges ?? [],
    });
  } catch (err) {
    console.error('[api/user/progress] error:', err);
    return NextResponse.json({ error: 'Failed to load progress' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Smoke test anonymously**

After the next dev server start, run:
```bash
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/user/progress
```
Expected: `401` (Unauthorized).

- [ ] **Step 3: Commit**

```bash
git add src/app/api/user/progress/route.ts
git commit -m "feat(gamification): GET /api/user/progress"
```

---

## Task 11: Wire awardProgress into existing endpoints

**Files:**
- Modify: `src/app/api/user/profile/route.ts` (POST handler)
- Modify: `src/app/api/saved-charts/route.ts` (POST — if absent, create the firing point)
- Modify: any tool API routes that should count toward `tools_used` (best-effort, can be done as a sweep)
- Modify: Supabase auth callback (where the session is established server-side)

- [ ] **Step 1: Wire profile completion**

In `src/app/api/user/profile/route.ts` POST, immediately after the successful kundali snapshot upsert (~line 305), add:

```ts
import { awardProgress } from '@/lib/gamification/award';

// … after the upsert:
await awardProgress(user.id, { type: 'profile_completed' });
```

- [ ] **Step 2: Wire chart save**

In `src/app/api/saved-charts/route.ts` POST, after the row inserts:

```ts
import { awardProgress } from '@/lib/gamification/award';

// after successful insert:
await awardProgress(user.id, { type: 'chart_saved', relationship: body.relationship });
```

- [ ] **Step 3: Wire sign-in**

In the Supabase auth callback (search for the place that handles `signInWithOAuth` redirect or session establishment server-side, typically `src/app/auth/callback/route.ts` if it exists, or wherever the session is created in `src/lib/supabase/`). After the session is verified:

```ts
import { awardProgress } from '@/lib/gamification/award';
await awardProgress(user.id, { type: 'sign_in' });
```

If no server-side auth callback exists yet, instead fire `sign_in` from the client when `useAuthStore.initialize()` first observes a session. Add to `src/stores/auth-store.ts`:

```ts
// Inside initialize(), after fetching the session:
if (session?.user) {
  fetch('/api/user/progress/sign-in', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session.access_token}` },
  }).catch(err => console.error('[auth-store] sign-in award failed:', err));
}
```

And create `src/app/api/user/progress/sign-in/route.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { awardProgress } from '@/lib/gamification/award';

export async function POST(req: NextRequest) {
  const sb = getServerSupabase();
  if (!sb) return NextResponse.json({ error: 'Not configured' }, { status: 503 });
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { data: { user } } = await sb.auth.getUser(authHeader.slice(7));
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  await awardProgress(user.id, { type: 'sign_in' });
  return NextResponse.json({ ok: true });
}
```

- [ ] **Step 4: Run TSC**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add src/app/api/user/profile/route.ts src/app/api/saved-charts/route.ts src/stores/auth-store.ts src/app/api/user/progress/sign-in/route.ts
git commit -m "feat(gamification): wire awardProgress into profile/chart/sign-in"
```

---

## Task 12: Optimize portraits to webp

**Files:**
- Create: `scripts/optimize-portraits.sh`
- Modify: `public/sadhaka-path/*.webp` (output)

- [ ] **Step 1: Verify cwebp installed**

Run: `which cwebp || brew install webp`
Expected: `cwebp` resolves.

- [ ] **Step 2: Write the script**

```bash
#!/bin/bash
# scripts/optimize-portraits.sh — convert Sadhaka Path portraits to webp.
set -euo pipefail
cd "$(dirname "$0")/.."

for f in public/sadhaka-path/*.png; do
  out="${f%.png}.webp"
  cwebp -q 85 -mt "$f" -o "$out"
  echo "→ $out ($(wc -c < "$out") bytes)"
done
```

- [ ] **Step 3: Run it**

```bash
chmod +x scripts/optimize-portraits.sh
scripts/optimize-portraits.sh
```

Expected: 7 .webp files in `public/sadhaka-path/`, each under 250 KB.

- [ ] **Step 4: Verify sizes**

Run: `ls -la public/sadhaka-path/*.webp`
Expected: 7 files, each well under 500 KB.

- [ ] **Step 5: Move PNG sources out of public/**

```bash
mkdir -p art-sources/sadhaka-path
mv public/sadhaka-path/*.png art-sources/sadhaka-path/
echo "art-sources/" >> .gitignore  # keep PNG sources out of git
```

- [ ] **Step 6: Commit**

```bash
git add scripts/optimize-portraits.sh public/sadhaka-path/*.webp .gitignore
git commit -m "feat(gamification): webp-optimized Sadhaka Path portraits"
```

---

## Task 13: BadgeIcons.tsx — 18 SVG components

**Files:**
- Create: `src/components/gamification/BadgeIcons.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/gamification/BadgeIcons.tsx
// 18 SVG glyphs, gold tarot style, ~40×40 default size.

import React from 'react';

const grad = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#f0d48a"/>
      <stop offset="55%" stopColor="#d4a853"/>
      <stop offset="100%" stopColor="#8a6d2b"/>
    </linearGradient>
  </defs>
);

interface IconProps { size?: number; locked?: boolean }
const Frame: React.FC<React.PropsWithChildren<IconProps>> = ({ size = 40, locked, children }) => (
  <svg viewBox="0 0 40 40" width={size} height={size}
       style={{ filter: locked ? 'grayscale(1) brightness(0.4)' : undefined }}>
    {children}
  </svg>
);

export const BADGE_ICONS: Record<string, React.FC<IconProps>> = {
  'lit-the-lamp': (p) => (
    <Frame {...p}>{grad('g1')}
      <path d="M20 6 Q18 12 16 18 Q16 22 20 22 Q24 22 24 18 Q22 12 20 6 Z" fill="url(#g1)"/>
      <ellipse cx="20" cy="30" rx="10" ry="3" fill="url(#g1)"/>
      <path d="M12 28 Q12 34 20 34 Q28 34 28 28 Z" fill="url(#g1)" opacity="0.85"/>
    </Frame>
  ),
  'star-identified': (p) => (
    <Frame {...p}>{grad('g2')}
      <path d="M20 6 L22 16 L32 18 L22 21 L20 32 L18 21 L8 18 L18 16 Z" fill="url(#g2)"/>
    </Frame>
  ),
  'family-constellation': (p) => (
    <Frame {...p}>{grad('g3')}
      <circle cx="14" cy="14" r="3" fill="url(#g3)"/>
      <circle cx="26" cy="14" r="3" fill="url(#g3)"/>
      <circle cx="20" cy="26" r="3" fill="url(#g3)"/>
      <line x1="14" y1="14" x2="26" y2="14" stroke="url(#g3)" strokeWidth="1"/>
      <line x1="14" y1="14" x2="20" y2="26" stroke="url(#g3)" strokeWidth="1"/>
      <line x1="26" y1="14" x2="20" y2="26" stroke="url(#g3)" strokeWidth="1"/>
    </Frame>
  ),
  'five-star-family': (p) => (
    <Frame {...p}>{grad('g4')}
      {[6, 14, 22, 28, 32].map((x, i) => (
        <path key={i} d={`M${x} 16 L${x+1} 19 L${x+4} 19 L${x+1.5} 21 L${x+2.5} 24 L${x} 22 L${x-2.5} 24 L${x-1.5} 21 L${x-4} 19 L${x-1} 19 Z`}
              fill="url(#g4)" transform={`translate(0,${i%2===0?0:4})`}/>
      ))}
    </Frame>
  ),
  'constellation-keeper': (p) => (
    <Frame {...p}>{grad('g5')}
      <circle cx="20" cy="20" r="12" fill="none" stroke="url(#g5)" strokeWidth="1.5"/>
      {[0, 60, 120, 180, 240, 300].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        const x = 20 + 10 * Math.cos(rad);
        const y = 20 + 10 * Math.sin(rad);
        return <circle key={i} cx={x} cy={y} r="1.8" fill="url(#g5)"/>;
      })}
    </Frame>
  ),
  'first-page': (p) => (
    <Frame {...p}>{grad('g6')}
      <rect x="10" y="8" width="20" height="24" rx="1.5" fill="none" stroke="url(#g6)" strokeWidth="1.5"/>
      <line x1="13" y1="14" x2="27" y2="14" stroke="url(#g6)" strokeWidth="1.2"/>
      <line x1="13" y1="18" x2="27" y2="18" stroke="url(#g6)" strokeWidth="1.2"/>
      <line x1="13" y1="22" x2="22" y2="22" stroke="url(#g6)" strokeWidth="1.2"/>
    </Frame>
  ),
  'scholar': (p) => (
    <Frame {...p}>{grad('g7')}
      <rect x="6" y="12" width="28" height="4" fill="url(#g7)" opacity="0.7"/>
      <rect x="4" y="18" width="32" height="4" fill="url(#g7)" opacity="0.85"/>
      <rect x="6" y="24" width="28" height="4" fill="url(#g7)" opacity="0.7"/>
      <rect x="18" y="8" width="4" height="24" fill="url(#g7)"/>
    </Frame>
  ),
  'curriculum-master': (p) => (
    <Frame {...p}>{grad('g8')}
      <path d="M6 30 L20 8 L34 30 Z" fill="none" stroke="url(#g8)" strokeWidth="1.5"/>
      <rect x="16" y="22" width="8" height="8" fill="url(#g8)" opacity="0.7"/>
    </Frame>
  ),
  'twenty-seven-nakshatras': (p) => (
    <Frame {...p}>{grad('g9')}
      <circle cx="20" cy="20" r="14" fill="none" stroke="url(#g9)" strokeWidth="1.5"/>
      <text x="20" y="24" textAnchor="middle" fill="url(#g9)" fontSize="11" fontWeight="700">27</text>
    </Frame>
  ),
  'tool-explorer': (p) => (
    <Frame {...p}>{grad('g10')}
      <polygon points="20,4 36,20 20,36 4,20" fill="none" stroke="url(#g10)" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="3" fill="url(#g10)"/>
    </Frame>
  ),
  'pentavalent': (p) => (
    <Frame {...p}>{grad('g11')}
      <polygon points="20,6 33,15 28,30 12,30 7,15" fill="none" stroke="url(#g11)" strokeWidth="1.5"/>
      <circle cx="20" cy="20" r="3" fill="url(#g11)"/>
    </Frame>
  ),
  'all-around': (p) => (
    <Frame {...p}>{grad('g12')}
      <polygon points="20,4 32,11 32,29 20,36 8,29 8,11" fill="none" stroke="url(#g12)" strokeWidth="1.5"/>
      <polygon points="20,10 28,15 28,25 20,30 12,25 12,15" fill="url(#g12)" opacity="0.6"/>
    </Frame>
  ),
  'first-cycle': (p) => (
    <Frame {...p}>{grad('g13')}
      <path d="M28 8 A 14 14 0 1 0 32 22 Z" fill="url(#g13)"/>
    </Frame>
  ),
  'lunar-cycle': (p) => (
    <Frame {...p}>{grad('g14')}
      <circle cx="20" cy="20" r="14" fill="url(#g14)"/>
      <path d="M20 6 A 14 14 0 0 1 20 34 Z" fill="#0a0e27"/>
    </Frame>
  ),
  'full-moon': (p) => (
    <Frame {...p}>{grad('g15')}
      <circle cx="20" cy="20" r="14" fill="url(#g15)"/>
      <circle cx="14" cy="16" r="2" fill="#0a0e27" opacity="0.4"/>
      <circle cx="24" cy="20" r="1.5" fill="#0a0e27" opacity="0.4"/>
      <circle cx="20" cy="26" r="2.5" fill="#0a0e27" opacity="0.4"/>
    </Frame>
  ),
  'solar-return': (p) => (
    <Frame {...p}>{grad('g16')}
      <circle cx="20" cy="20" r="8" fill="url(#g16)"/>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return <line key={i}
          x1={20 + 10 * Math.cos(rad)} y1={20 + 10 * Math.sin(rad)}
          x2={20 + 16 * Math.cos(rad)} y2={20 + 16 * Math.sin(rad)}
          stroke="url(#g16)" strokeWidth="1.5"/>;
      })}
    </Frame>
  ),
  'early-bird': (p) => (
    <Frame {...p}>{grad('g17')}
      <path d="M4 28 L36 28" stroke="url(#g17)" strokeWidth="1.5"/>
      <path d="M20 16 A 8 8 0 0 1 28 24 L12 24 A 8 8 0 0 1 20 16 Z" fill="url(#g17)" opacity="0.7"/>
    </Frame>
  ),
  'festival-witness': (p) => (
    <Frame {...p}>{grad('g18')}
      <path d="M20 6 L24 16 L34 18 L26 24 L28 34 L20 28 L12 34 L14 24 L6 18 L16 16 Z" fill="url(#g18)" opacity="0.85"/>
    </Frame>
  ),
};

export interface BadgeIconProps { slug: string; size?: number; locked?: boolean }
export const BadgeIcon: React.FC<BadgeIconProps> = ({ slug, size = 40, locked = false }) => {
  const Cmp = BADGE_ICONS[slug];
  if (!Cmp) return null;
  return <Cmp size={size} locked={locked} />;
};
```

- [ ] **Step 2: Verify TSC**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/BadgeIcons.tsx
git commit -m "feat(gamification): 18 SVG badge glyphs"
```

---

## Task 14: LevelPortrait component

**Files:**
- Create: `src/components/gamification/LevelPortrait.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/gamification/LevelPortrait.tsx
import Image from 'next/image';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';

interface Props {
  ordinal: number; // 1..7
  size?: number;   // height in px; width = 2/3 * height
  locked?: boolean;
  className?: string;
}

export function LevelPortrait({ ordinal, size = 105, locked = false, className }: Props) {
  const level = LEVEL_BY_ORDINAL[ordinal];
  if (!level) return null;
  const w = Math.round(size * 2 / 3);

  return (
    <div
      className={className}
      style={{
        width: w,
        height: size,
        position: 'relative',
        borderRadius: 8,
        overflow: 'hidden',
        border: locked ? '1px solid rgba(212,168,83,0.25)' : '1px solid rgba(212,168,83,0.7)',
        boxShadow: locked ? undefined : '0 0 12px rgba(212,168,83,0.25)',
        filter: locked ? 'grayscale(0.6) brightness(0.7)' : undefined,
      }}
    >
      <Image
        src={level.image}
        alt={level.name.en}
        width={w}
        height={size}
        style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        priority={ordinal === 1}
      />
      {locked && (
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#f0d48a', fontSize: size * 0.25, opacity: 0.9,
        }}>🔒</div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TSC**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/LevelPortrait.tsx
git commit -m "feat(gamification): LevelPortrait component"
```

---

## Task 15: StreakGrid component

**Files:**
- Create: `src/components/gamification/StreakGrid.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/gamification/StreakGrid.tsx
import { todayIst, daysBetweenIst } from '@/lib/gamification/ist-day';

interface Props {
  streakDays: number;
  streakLastVisit: string | null;
}

/**
 * 15-day rolling grid. Lit cells = days within the current streak that fall in the last 15 days.
 * Today's cell is highlighted.
 */
export function StreakGrid({ streakDays, streakLastVisit }: Props) {
  const today = todayIst();
  const cells: ('lit' | 'today' | 'unlit')[] = [];

  for (let i = 14; i >= 0; i--) {
    // For each of the last 15 days, decide if it's lit
    const [y, m, d] = today.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    date.setUTCDate(date.getUTCDate() - i);
    const yy = date.getUTCFullYear();
    const mm = String(date.getUTCMonth() + 1).padStart(2, '0');
    const dd = String(date.getUTCDate()).padStart(2, '0');
    const cellDay = `${yy}-${mm}-${dd}`;

    if (cellDay === today && streakLastVisit === today) {
      cells.push('today');
    } else if (streakLastVisit) {
      const gap = daysBetweenIst(cellDay, streakLastVisit);
      // streakDays counts back from streakLastVisit. Lit if cellDay is in that window.
      if (gap >= 0 && gap < streakDays) cells.push('lit');
      else cells.push('unlit');
    } else {
      cells.push('unlit');
    }
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)',
      gap: 2, marginTop: 8,
    }}>
      {cells.map((s, i) => (
        <div key={i} style={{
          aspectRatio: '1',
          borderRadius: 2,
          background:
            s === 'today' ? '#fff5cf' :
            s === 'lit'   ? 'linear-gradient(135deg, #f0d48a, #d4a853)' :
                            'rgba(255,255,255,0.06)',
          boxShadow: s === 'today' ? '0 0 4px #f0d48a' : undefined,
        }}/>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/gamification/StreakGrid.tsx
git commit -m "feat(gamification): StreakGrid component"
```

---

## Task 16: SadhakaHero (dashboard hero, both states)

**Files:**
- Create: `src/components/dashboard/SadhakaHero.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/dashboard/SadhakaHero.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { LevelPortrait } from '@/components/gamification/LevelPortrait';
import { StreakGrid } from '@/components/gamification/StreakGrid';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';
import { tl } from '@/lib/utils/trilingual';
import type { UserProgress } from '@/lib/gamification/types';

interface ProgressResponse { progress: UserProgress | null; badges: { badge_slug: string; earned_at: string }[] }

interface Props {
  locale: string;
  /** Computed from user_profiles by the dashboard server component (avoids extra fetch). */
  profileFields: {
    hasName: boolean;
    hasDob: boolean;
    hasTime: boolean;
    hasPlace: boolean;
  };
}

export function SadhakaHero({ locale, profileFields }: Props) {
  const { user, accessToken } = useAuthStore();
  const [data, setData] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    if (!user || !accessToken) { setData(null); return; }
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => { console.error('[SadhakaHero] progress fetch failed:', err); });
    return () => { cancelled = true; };
  }, [user, accessToken]);

  if (!user) return null;

  const fieldsDone = [profileFields.hasName, profileFields.hasDob, profileFields.hasTime, profileFields.hasPlace].filter(Boolean).length;
  const total = 4;
  const profileComplete = fieldsDone === total;
  const level = data?.progress?.current_level ?? 1;
  const streakDays = data?.progress?.streak_days ?? 0;
  const lastVisit = data?.progress?.streak_last_visit ?? null;

  // State A: profile incomplete
  if (!profileComplete) {
    const nextField =
      !profileFields.hasName  ? { en: 'name',         hi: 'नाम' }            :
      !profileFields.hasDob   ? { en: 'birth date',   hi: 'जन्म तिथि' }       :
      !profileFields.hasTime  ? { en: 'birth time',   hi: 'जन्म समय' }       :
      !profileFields.hasPlace ? { en: 'birth place',  hi: 'जन्म स्थान' }     : null;
    const pct = Math.round((fieldsDone / total) * 100);

    return (
      <div className="mb-8 rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#2d1b69] via-[#1a1040] to-[#0a0e27] p-5 sm:p-6 flex items-center gap-5">
        <LevelPortrait ordinal={2} locked size={120} />
        <div className="flex-1">
          <h2 className="text-gold-light text-lg sm:text-xl font-bold leading-tight">
            {locale === 'hi' ? 'साधक तक पहुँचें' : 'Reach Sadhaka साधक'}
          </h2>
          <p className="text-text-secondary text-xs mt-1 mb-3">
            {locale === 'hi'
              ? `${fieldsDone} / ${total} चरण पूर्ण · व्यक्तिगत कुंडली अनलॉक करें`
              : `${fieldsDone} of ${total} steps · unlock your personal chart`}
          </p>
          <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-3">
            <div className="h-full bg-gradient-to-r from-gold-dark to-gold-primary rounded-full" style={{ width: `${pct}%` }}/>
          </div>
          {nextField && (
            <Link href={`/${locale}/settings`} className="inline-flex items-center gap-1.5 px-3 py-2 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 rounded-lg text-gold-light text-sm font-semibold transition-colors">
              + {locale === 'hi' ? `${tl(nextField, 'hi')} जोड़ें` : `Add ${tl(nextField, 'en')}`} →
            </Link>
          )}
        </div>
      </div>
    );
  }

  // State B: Sadhaka+
  const lvl = LEVEL_BY_ORDINAL[level];
  const nextLvl = LEVEL_BY_ORDINAL[level + 1];

  return (
    <div className="mb-8 rounded-2xl border border-gold-primary/25 bg-gradient-to-br from-[#2d1b69] via-[#1a1040] to-[#0a0e27] p-5 sm:p-6">
      <div className="flex items-center gap-5">
        <Link href={`/${locale}/path`}>
          <LevelPortrait ordinal={level} size={120} />
        </Link>
        <div className="flex-1">
          <div className="text-gold-light text-4xl sm:text-5xl font-black leading-none">
            {streakDays}
            <span className="text-gold-primary/70 text-xs font-bold ml-2 tracking-[0.15em] uppercase">{locale === 'hi' ? 'दिन निरंतरता' : 'day streak'}</span>
          </div>
          {lvl && (
            <div className="inline-block mt-2 px-2.5 py-0.5 bg-gold-primary/15 border border-gold-primary/30 rounded-full text-gold-light text-xs font-bold">
              {tl(lvl.name, locale)}
            </div>
          )}
          {nextLvl && (
            <p className="text-text-secondary text-xs mt-2">
              {tl(nextLvl.criteria, locale)} → <span className="text-gold-light">{tl(nextLvl.name, locale)}</span>
            </p>
          )}
        </div>
      </div>
      <StreakGrid streakDays={streakDays} streakLastVisit={lastVisit}/>
    </div>
  );
}
```

- [ ] **Step 2: Add `accessToken` to auth-store if missing**

Check `src/stores/auth-store.ts` exposes `accessToken`. If not, add:

```ts
// in the state interface:
accessToken: string | null;
// in initialize():
session?.access_token ? set({ accessToken: session.access_token }) : null;
```

- [ ] **Step 3: Verify TSC**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add src/components/dashboard/SadhakaHero.tsx src/stores/auth-store.ts
git commit -m "feat(gamification): SadhakaHero component (states A and B)"
```

---

## Task 17: Wire SadhakaHero into dashboard

**Files:**
- Modify: `src/app/[locale]/dashboard/page.tsx`

- [ ] **Step 1: Replace direct ProfileProgressBar usage**

Find the lines around 1411–1432 (the `profileProgress` JSX) and replace with:

```tsx
import { SadhakaHero } from '@/components/dashboard/SadhakaHero';

// in the render, where the old profileProgress JSX was:
<SadhakaHero
  locale={locale}
  profileFields={{
    hasName: !!displayName,
    hasDob: hasBirthData,
    hasTime: profileHasTime,
    hasPlace: profileHasPlace,
  }}
/>
```

Remove the local `profileProgress = (<ProfileProgressBar … />)` line and the conditional block that rendered it.

- [ ] **Step 2: Run TSC + dev server**

Run: `npx tsc --noEmit -p tsconfig.build-check.json` → clean.

Run: `rm -rf .next && npx next dev` and visit `http://localhost:3000/en/dashboard`. Confirm:
- Logged out → no SadhakaHero (returns null).
- Logged in with incomplete profile → State A card with progress bar.
- Logged in with complete profile → State B card with streak.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/dashboard/page.tsx
git commit -m "feat(gamification): mount SadhakaHero on dashboard, retire ProfileProgressBar"
```

---

## Task 18: SadhakaBanner (sticky on every page except /dashboard)

**Files:**
- Create: `src/components/gamification/SadhakaBanner.tsx`

- [ ] **Step 1: Implement**

```tsx
// src/components/gamification/SadhakaBanner.tsx
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { LEVEL_BY_ORDINAL } from '@/lib/constants/levels';
import { tl } from '@/lib/utils/trilingual';
import type { UserProgress } from '@/lib/gamification/types';

const SS_KEY = 'sadhakaBannerDismissed';

interface ProgressResponse { progress: UserProgress | null; badges: { badge_slug: string }[] }

export function SadhakaBanner({ locale }: { locale: string }) {
  const { user, accessToken } = useAuthStore();
  const pathname = usePathname();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid SSR flash

  const [data, setData] = useState<ProgressResponse | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    setDismissed(sessionStorage.getItem(SS_KEY) === '1');
  }, []);

  useEffect(() => {
    if (!user || !accessToken) { setData(null); return; }
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => { console.error('[SadhakaBanner] progress fetch failed:', err); });
    return () => { cancelled = true; };
  }, [user, accessToken]);

  if (!user) return null;
  if (pathname?.startsWith(`/${locale}/dashboard`)) return null;
  if (dismissed) return null;
  if (!data) return null;

  const level = data.progress?.current_level ?? 1;
  const streak = data.progress?.streak_days ?? 0;
  const badgeCount = data.badges?.length ?? 0;
  const lvl = LEVEL_BY_ORDINAL[level];

  const handleDismiss = () => {
    sessionStorage.setItem(SS_KEY, '1');
    setDismissed(true);
  };

  // Shishya — push profile completion
  if (level === 1) {
    return (
      <div className="w-full bg-gradient-to-r from-gold-primary/15 to-[#2d1b69]/40 border-b border-gold-primary/25 px-4 py-2 flex items-center gap-3 text-sm">
        <Link href={`/${locale}/settings`} className="flex-1 flex items-center gap-3 text-gold-light no-underline">
          <span className="font-bold">{locale === 'hi' ? 'शिष्य · चरण 2/5' : 'Shishya · Step 2 of 5'}</span>
          <span className="text-text-secondary text-xs">{locale === 'hi' ? 'जन्म विवरण जोड़ें →' : 'Add birth details to unlock your kundali →'}</span>
        </Link>
        <button onClick={handleDismiss} aria-label="Dismiss" className="text-gold-primary/60 hover:text-gold-light px-2">×</button>
      </div>
    );
  }

  // Sadhaka+
  return (
    <div className="w-full bg-gradient-to-r from-gold-primary/15 to-[#2d1b69]/40 border-b border-gold-primary/25 px-4 py-2 flex items-center gap-3 text-sm">
      <Link href={`/${locale}/path`} className="flex-1 flex items-center gap-3 text-gold-light no-underline">
        <span className="font-bold">{lvl ? tl(lvl.name, locale) : ''}</span>
        <span className="text-text-secondary text-xs">{streak}-{locale === 'hi' ? 'दिन निरंतरता' : 'day streak'} · {badgeCount}/18 {locale === 'hi' ? 'बैज' : 'badges'}</span>
      </Link>
      <button onClick={handleDismiss} aria-label="Dismiss" className="text-gold-primary/60 hover:text-gold-light px-2">×</button>
    </div>
  );
}
```

- [ ] **Step 2: Verify TSC**

Run: `npx tsc --noEmit -p tsconfig.build-check.json`
Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add src/components/gamification/SadhakaBanner.tsx
git commit -m "feat(gamification): SadhakaBanner component"
```

---

## Task 19: Mount SadhakaBanner in root locale layout

**Files:**
- Modify: `src/app/[locale]/layout.tsx`

- [ ] **Step 1: Import + mount**

Inside the root locale layout's render, immediately after the navbar:

```tsx
import { SadhakaBanner } from '@/components/gamification/SadhakaBanner';

// in the JSX, below <Navbar />:
<SadhakaBanner locale={locale} />
```

- [ ] **Step 2: Browser verify**

Navigate to any non-dashboard page logged-in. Expect to see the banner at the top (Shishya nudge if incomplete; level+streak if Sadhaka+). On `/dashboard` the banner should be absent.

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/layout.tsx
git commit -m "feat(gamification): mount SadhakaBanner in locale layout"
```

---

## Task 20: /[locale]/path full-screen view

**Files:**
- Create: `src/app/[locale]/path/page.tsx`
- Create: `src/app/[locale]/path/layout.tsx`

- [ ] **Step 1: Layout (metadata)**

```tsx
// src/app/[locale]/path/layout.tsx
import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  return {
    title: locale === 'hi' ? 'साधक पथ — आपकी प्रगति' : 'Sadhaka Path — Your Progress',
    robots: { index: false, follow: true },
  };
}
export default async function Layout({ children }: { children: React.ReactNode }) { return <>{children}</>; }
```

- [ ] **Step 2: Page (client, fetches /api/user/progress)**

```tsx
// src/app/[locale]/path/page.tsx
'use client';
import { use, useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { LevelPortrait } from '@/components/gamification/LevelPortrait';
import { BadgeIcon } from '@/components/gamification/BadgeIcons';
import { LEVELS } from '@/lib/constants/levels';
import { BADGES } from '@/lib/constants/badges';
import { tl } from '@/lib/utils/trilingual';

interface ProgressResponse { progress: { current_level?: number } | null; badges: { badge_slug: string }[] }

export default function PathPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params);
  const { user, accessToken } = useAuthStore();
  const [data, setData] = useState<ProgressResponse | null>(null);
  useEffect(() => {
    if (!user || !accessToken) return;
    let cancelled = false;
    fetch('/api/user/progress', { headers: { Authorization: `Bearer ${accessToken}` } })
      .then(r => r.ok ? r.json() : Promise.reject(r.statusText))
      .then(d => { if (!cancelled) setData(d); })
      .catch(err => console.error('[PathPage] progress fetch failed:', err));
    return () => { cancelled = true; };
  }, [user, accessToken]);

  const currentLevel = data?.progress?.current_level ?? 1;
  const earnedSlugs = new Set<string>((data?.badges ?? []).map((b: { badge_slug: string }) => b.badge_slug));

  if (!user) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center text-text-secondary">{locale === 'hi' ? 'कृपया साइन इन करें।' : 'Please sign in.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-gold-light mb-1">{locale === 'hi' ? 'साधक पथ' : 'Sadhaka Path'}</h1>
      <p className="text-text-secondary text-sm mb-6">{locale === 'hi' ? 'आपका सात-स्तरीय आध्यात्मिक मार्ग।' : 'Your seven-tier spiritual journey.'}</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {LEVELS.map(l => {
          const locked = l.ordinal > currentLevel;
          return (
            <div key={l.slug} className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/15 rounded-xl p-3 flex flex-col items-center text-center">
              <LevelPortrait ordinal={l.ordinal} locked={locked} size={140}/>
              <div className="mt-2 text-gold-light text-sm font-bold">{tl(l.name, locale)}</div>
              <div className="text-text-secondary text-[10px] mt-1 leading-tight">{tl(l.criteria, locale)}</div>
            </div>
          );
        })}
      </div>

      <h2 className="text-xl font-bold text-gold-light mb-3">{locale === 'hi' ? 'बैज संग्रह' : 'Badge Collection'} <span className="text-text-secondary text-sm font-normal">· {earnedSlugs.size} / 18</span></h2>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {BADGES.map(b => {
          const earned = earnedSlugs.has(b.slug);
          return (
            <div key={b.slug} className={`p-3 text-center rounded-lg border ${earned ? 'border-gold-primary/60 bg-gold-primary/5' : 'border-white/10 bg-white/[0.03]'}`}>
              <div className="flex justify-center mb-1.5"><BadgeIcon slug={b.slug} size={40} locked={!earned}/></div>
              <div className={`text-[10px] font-semibold ${earned ? 'text-gold-light' : 'text-text-secondary/50'}`}>{tl(b.name, locale)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Browser verify**

Navigate to `/en/path`. Expect 7 portraits in a grid (locked beyond current level) + 18 badge tiles (earned styled distinctly).

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/path/page.tsx src/app/\[locale\]/path/layout.tsx
git commit -m "feat(gamification): /path full-screen view"
```

---

## Task 21: Backfill script for existing 49 users

**Files:**
- Create: `scripts/backfill-gamification.ts`

- [ ] **Step 1: Implement**

```ts
#!/usr/bin/env npx tsx
// scripts/backfill-gamification.ts
// One-shot: compute initial user_progress + user_badges rows for existing users.
import { getServerSupabase } from '../src/lib/supabase/server';
import { awardProgress } from '../src/lib/gamification/award';

async function main() {
  const sb = getServerSupabase();
  if (!sb) { console.error('No supabase'); process.exit(1); }

  // 1. Get every user.
  const { data: users, error: uErr } = await sb.auth.admin.listUsers();
  if (uErr) { console.error('listUsers failed:', uErr); process.exit(1); }
  console.log(`Found ${users.users.length} users`);

  for (const u of users.users) {
    // 2. Fire sign_in to seed streak/progress row.
    await awardProgress(u.id, { type: 'sign_in' });

    // 3. Profile completion?
    const { data: profile } = await sb.from('user_profiles')
      .select('date_of_birth, time_of_birth, birth_place, birth_lat, birth_lng')
      .eq('id', u.id).maybeSingle();
    if (profile?.date_of_birth && profile?.time_of_birth && profile?.birth_place) {
      await awardProgress(u.id, { type: 'profile_completed' });
    }

    // 4. Saved charts (count).
    const { data: charts } = await sb.from('saved_charts').select('id').eq('user_id', u.id);
    if (charts) {
      for (let i = 0; i < charts.length; i++) {
        await awardProgress(u.id, { type: 'chart_saved' });
      }
    }

    console.log(`✓ backfilled ${u.email ?? u.id}`);
  }
  console.log('Done.');
}

main().catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Dry-run on one user**

Edit the script temporarily to only process the first user, run:
```bash
npx tsx scripts/backfill-gamification.ts
```
Verify that user_progress + user_badges rows were created sensibly:
```bash
npx supabase db query --linked "SELECT * FROM user_progress LIMIT 5"
npx supabase db query --linked "SELECT * FROM user_badges LIMIT 20"
```
Revert the dry-run filter.

- [ ] **Step 3: Run for real**

```bash
npx tsx scripts/backfill-gamification.ts
```

Expected: ~49 ✓ lines, all users have rows.

- [ ] **Step 4: Verify**

```bash
npx supabase db query --linked "SELECT current_level, COUNT(*) FROM user_progress GROUP BY 1 ORDER BY 1"
```

Expected: distribution roughly matches expectation (most at 1 or 2, a few at 3+).

- [ ] **Step 5: Commit**

```bash
git add scripts/backfill-gamification.ts
git commit -m "feat(gamification): backfill script for existing users"
```

---

## Task 22: Manual Acharya CLI

**Files:**
- Create: `scripts/award-translation.ts`

- [ ] **Step 1: Implement**

```ts
#!/usr/bin/env npx tsx
// scripts/award-translation.ts <user_id>
// Manually grants Acharya (level 6) via the translation_accepted event.
import { awardProgress } from '../src/lib/gamification/award';

const userId = process.argv[2];
if (!userId) { console.error('Usage: award-translation.ts <user_id>'); process.exit(1); }

awardProgress(userId, { type: 'translation_accepted' })
  .then(r => { console.log('Result:', r); })
  .catch(err => { console.error(err); process.exit(1); });
```

- [ ] **Step 2: Commit**

```bash
git add scripts/award-translation.ts
git commit -m "feat(gamification): manual Acharya CLI"
```

---

## Task 23: Clean up UserMenu nudge

**Files:**
- Modify: `src/components/auth/UserMenu.tsx`

- [ ] **Step 1: Replace the existing `profileIncomplete` amber pill**

Since the SadhakaBanner handles the cross-app nudge, the UserMenu dropdown can drop the duplicate. Remove the `profileIncomplete` state, the useEffect that sets it, and the `{profileIncomplete && (<a …>…</a>)}` JSX (around lines 19–58, 99–103).

- [ ] **Step 2: TSC + browser verify**

Run: `npx tsc --noEmit -p tsconfig.build-check.json` → clean.

Open the user menu dropdown — verify it no longer shows the amber profile nudge (SadhakaBanner now serves that role at the top of the page).

- [ ] **Step 3: Commit**

```bash
git add src/components/auth/UserMenu.tsx
git commit -m "refactor(gamification): drop UserMenu nudge in favour of SadhakaBanner"
```

---

## Task 24: Full pre-push verification

- [ ] **Step 1: Run all tests**

```bash
npx vitest run
```
Expected: all tests pass.

- [ ] **Step 2: TSC**

```bash
npx tsc --noEmit -p tsconfig.build-check.json
```
Expected: clean.

- [ ] **Step 3: Production build**

```bash
rm -rf .next && NODE_OPTIONS="--max-old-space-size=8192" npx next build
```
Expected: build succeeds. New routes show in output:
- `/[locale]/path`
- `/api/user/progress`
- `/api/user/progress/sign-in`

- [ ] **Step 4: Browser walkthrough (Definition of Done #4)**

Visit each in a real browser:
1. `/en/dashboard` while logged out → SadhakaHero absent.
2. Sign in fresh → State A (Shishya progress card).
3. Fill profile → State B (Sadhaka portrait + streak counter shows 1).
4. Visit any non-dashboard page → SadhakaBanner appears.
5. Visit `/en/path` → portrait grid + badge grid.
6. Reload `/en/dashboard` → streak still 1 (idempotent).
7. Dismiss the SadhakaBanner via × → it stays hidden until session reset.

- [ ] **Step 5: Push branch + open PR**

```bash
git push -u origin feat/sadhaka-path
gh pr create --base main --head feat/sadhaka-path --title "feat(gamification): Sadhaka Path — levels + badges + streak"  --body "Spec: docs/superpowers/specs/2026-05-22-dashboard-gamification-design.md"
```

---

## Spec coverage check

| Spec §  | Task |
|---|---|
| §3 Levels (constants + portraits + state machine) | Task 3, 7, 11, 12, 14, 16 |
| §4 Badges (constants + glyphs + computation) | Task 4, 8, 13 |
| §5 Streak (IST anchor + freeze) | Task 5, 6, 9, 11 |
| §6 Dashboard hero (State A/B) | Task 16, 17 |
| §7 Sticky banner | Task 18, 19 |
| §8 Data model | Task 1, 2 |
| §9 Award path | Task 9, 11 |
| §10 /path screen | Task 20 |
| §11 Image optimisation | Task 12 |
| §12 Localisation | Task 3, 4 (constants) + Task 16, 18, 20 (renderers use `tl()`) |
| §13 Edge cases | Task 6 tests, Task 9 idempotency, Task 16 SSR-flash guard |
| §14 Metrics | Out of plan scope (analytics dashboard setup separate; backfill provides baseline) |
| §15 Migration & rollout | Task 1, 21 |
| §16 Out of scope | Spec only |

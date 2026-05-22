# Dashboard Gamification — Sadhaka Path

**Status:** Spec
**Authors:** Aditya Kumar Jha + Claude (brainstorming session)
**Date:** 2026-05-22

## 1. Purpose

49 users have signed up; only 13 (27%) have completed their birth profile. The remaining 36 see the dashboard but bounce before unlocking personal content. There is no system today that nudges them forward or rewards depth of use.

This spec defines a gamification layer that:

1. **In State A** (profile incomplete) — uses a visible, sticky progress mechanic to push users to fill in birth data so they can see their own kundali.
2. **In State B** (profile complete) — switches to a daily-return engine (streak + level progression + badges) to drive habit formation and feature exploration.

## 2. Scope

In scope for v1:

- Seven-level Sadhaka Path with locale-native portrait art and discrete unlock criteria.
- Eighteen badges across six categories.
- A daily streak mechanic with one Monday freeze recovery.
- A new dashboard hero card with two states (incomplete profile / Sadhaka+).
- A sticky progress banner that appears on every page except `/dashboard`.
- One new DB table (`user_progress`) + one new join table (`user_badges`).
- Server-side award function called from existing endpoints.

Out of scope for v1 (call out for v1.1+ if metrics warrant):

- XP totals / point-based progression.
- Daily quests (rotating tasks).
- Leaderboards / social comparison.
- Premium-tier-locked badges.

## 3. Levels (Sadhaka Path)

Seven discrete levels. Each is earned by hitting one specific milestone — there is no XP grind.

| # | Slug | Sanskrit | English | Unlock |
|---|---|---|---|---|
| 1 | `shishya` | शिष्य | Student | Sign up (automatic) |
| 2 | `sadhaka` | साधक | Practitioner | Complete birth profile (DOB + time + place) |
| 3 | `jignasu` | जिज्ञासु | Curious Seeker | First substantive action: save a chart **or** complete a learn module **or** save a muhurta |
| 4 | `vidvan` | विद्वान | Scholar | 7-day return streak **or** 5 learn modules completed |
| 5 | `jyotishi` | ज्योतिषी | Astrologer | Use 5 distinct tools (matching / muhurta / prashna / varshaphal / KP / baby-names / shraddha / AI chat) |
| 6 | `acharya` | आचार्य | Teacher | Refer 3 friends who sign up **or** contribute 1 accepted translation/correction (see §16 — referrals path activates in v1.1; until then, Acharya is granted via the translation/correction path only, awarded manually by running `scripts/award-translation.ts <user_id>`) |
| 7 | `rishi` | ऋषि | Sage | 30-day streak **and** ≥10 saved charts **and** ≥10 modules complete |

Disjunctive criteria (`or`) at middle levels — multiple paths so users with different play styles can advance. Conjunctive (`and`) at the top so Rishi stays rare.

**Portrait art:** seven full-bleed PNGs in `public/sadhaka-path/{slug}.png`. Generated via Gemini using the prompt set in `docs/superpowers/specs/2026-05-22-dashboard-gamification-design.md#appendix-a`. Aspect 2:3, ~1024×1536, ~10MB pre-optimisation. Optimisation step required before merge (see §11).

**Visual differentiation lock-in** (each level has a unique combination):

| # | Robe colour | Age | Setting hook |
|---|---|---|---|
| 1 Shishya | White | ~14 | Outdoor courtyard, peepul tree, empty hands |
| 2 Sadhaka | Saffron | ~25 | Home shrine, akhand diya, padmasana |
| 3 Jignasu | Indigo | ~30 | Stone chamber, lamp held high, scrolls scattered |
| 4 Vidvan | Forest green | ~45 | Library shelves, spectacles, reed pen mid-stroke |
| 5 Jyotishi | Maroon | ~50 | Star-court, crown, kundali + astrolabe |
| 6 Acharya | Ivory + gold | ~70 | Pillared hall, raised dais, students at base, jnana mudra raised |
| 7 Rishi | Bare + saffron | wizened | Himalayan peak, tiger skin, deer + peacock |

## 4. Badges (v1: 18 across 6 categories)

| Category | Slug | Name | Earned when |
|---|---|---|---|
| Profile | `lit-the-lamp` | Lit the Lamp | Birth profile complete (also unlocks Sadhaka level) |
| Profile | `star-identified` | Star Identified | First kundali snapshot computed (auto-fires with `lit-the-lamp`) |
| Charts | `family-constellation` | Family Constellation | First family chart saved |
| Charts | `five-star-family` | Five-Star Family | 5 charts saved |
| Charts | `constellation-keeper` | Constellation Keeper | 10 charts saved (also Rishi requirement) |
| Learning | `first-page` | First Page | First learn module completed |
| Learning | `scholar` | Scholar | 5 modules completed (also Vidvan path) |
| Learning | `curriculum-master` | Curriculum Master | 20 modules completed |
| Learning | `twenty-seven-nakshatras` | 27 Nakshatras | All 27 nakshatra deep-dives read |
| Tools | `tool-explorer` | Tool Explorer | Used 3 distinct tools |
| Tools | `pentavalent` | Pentavalent | Used 5 distinct tools (Jyotishi path) |
| Tools | `all-around` | All-Around | Used 10 distinct tools |
| Streak | `first-cycle` | First Cycle | 7-day streak (Vidvan path) |
| Streak | `lunar-cycle` | Lunar Cycle | 15-day streak |
| Streak | `full-moon` | Full Moon | 30-day streak (Rishi path) |
| Special | `solar-return` | Solar Return | Visited app on user's birthday |
| Special | `early-bird` | Early Bird | Checked panchang before 6 AM IST |
| Special | `festival-witness` | Festival Witness | Opened app on a major festival day (Diwali, Holi, Ganesh Chaturthi, Dussehra, Janmashtami) |

Badge data lives in `src/lib/constants/badges.ts` as a typed array of `BadgeDefinition` objects. Each has `slug`, `name: Trilingual`, `description: Trilingual`, `category`, `icon` (custom SVG component path), `criteria` (free-text for display only — actual logic is in award.ts). Earned instances live in DB.

**Glyph design:** small (40×40) custom SVG glyphs in the same multi-layered gold tarot-card style as the existing icon system. No emoji. Glyphs live in `src/components/icons/BadgeIcons.tsx` and are referenced by slug.

## 5. Streak mechanic

Replaces the existing localStorage-only learning streak with a DB-backed one that spans the whole app.

| Field | Type | Meaning |
|---|---|---|
| `streak_days` | integer | Current consecutive-day count |
| `streak_last_visit` | date (IST) | Most recent day a visit was logged |
| `streak_freeze_used_at` | date | When the most recent Monday freeze was consumed |

Rules:

1. **Increment:** any authenticated page render advances `streak_last_visit` once per IST day; if today is exactly `streak_last_visit + 1 day` then `streak_days++`. If today is `streak_last_visit` no-op.
2. **Reset:** if today is `> streak_last_visit + 1 day` AND freeze is unavailable, set `streak_days = 0`.
3. **Freeze:** if today is `> streak_last_visit + 1 day` AND today is Tuesday (i.e. user missed Monday) AND `streak_freeze_used_at < last_monday`, consume the freeze: set `streak_freeze_used_at = last_monday`, set `streak_last_visit = last_monday`, do NOT reset.
4. **IST anchor:** all date arithmetic uses `Asia/Kolkata`. A user in Switzerland visiting at 11pm CET (3:30am IST next day) lands in the *next* IST day.
5. **Display:** dashboard hero (State B) shows the count + a 15-day rolling lit/unlit grid. Sticky banner shows the count in a compact form.
6. **Badges:** `first-cycle` at 7d, `lunar-cycle` at 15d, `full-moon` at 30d. Streak also contributes to Vidvan and Rishi level unlock criteria.

The existing client-side learning streak in `useLearningProgressStore` is deprecated by this — server-side `user_progress.streak_days` becomes the source of truth. Client store reads from `/api/user/progress` on hydrate.

## 6. Dashboard hero (two states)

A new component `<SadhakaHero>` mounted at the top of `/[locale]/dashboard/page.tsx`, above the existing Cosmic Weather block.

**State A — profile incomplete** (i.e. `current_level === 1` Shishya):
- Greyed/locked Sadhaka portrait on the left.
- Title: `Reach Sadhaka साधक`.
- Progress bar showing N/5 fields complete (display_name, dob, time, place — and "first action" for the Jignasu-step preview).
- Single CTA button pointing to the next missing field (e.g. `+ Add birth time → /settings#birth-time`).
- This replaces the existing `<ProfileProgressBar>` in `src/components/dashboard/ProfileProgressBar.tsx` (which becomes a legacy component used only inside SadhakaHero).

**State B — Sadhaka or higher** (i.e. `current_level >= 2`):
- Active level portrait on the left, gold-bordered, glowing.
- Streak number as the hero typography (e.g. `7` + `day streak` subtitle).
- Level pill: `विद्वान · Vidvan`.
- Next-level nudge: `3 more modules → Jyotishi`.
- 15-day lit/unlit rolling grid below the row.

**On tap of portrait:** opens `/[locale]/path` — a full-screen view of all 7 levels with locked/unlocked states, plus badge collection grid. (New route — see §9.)

## 7. Sticky banner (every page except /dashboard)

A new component `<SadhakaBanner>` mounted in the root locale layout. Visibility logic:

- Hidden if `!user` (anonymous).
- Hidden if current pathname starts with `/[locale]/dashboard` (no double-up).
- Hidden if user dismissed it this session (`sessionStorage['sadhakaBannerDismissed'] === '1'`).
- Otherwise visible — content depends on level:

**Incomplete profile (Shishya):**
- Greyed mini-portrait.
- `Shishya · Step 2 of 5 — Add birth time → /settings`.
- × dismiss.

**Sadhaka+:**
- Active mini-portrait.
- `<level> · <N>-day streak · <X of 18> badges`.
- Tappable → goes to `/[locale]/path`.
- × dismiss.

Banner is 48px tall, full-width, sits below the navbar. Animates in on initial mount; the × persists dismissal for the session only — it comes back next session if still relevant (i.e. still incomplete or still on streak).

## 8. Data model

Two new tables. All RLS policies: user reads own row, service role manages everything.

```sql
CREATE TABLE public.user_progress (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_level        smallint NOT NULL DEFAULT 1,   -- 1..7
  level_unlocked_at    jsonb NOT NULL DEFAULT '{}'::jsonb,  -- {"2":"2026-05-21T…","3":"…"}
  streak_days          integer NOT NULL DEFAULT 0,
  streak_last_visit    date,                          -- IST anchored
  streak_freeze_used_at date,                         -- IST date of consumed Monday freeze
  tools_used           text[] NOT NULL DEFAULT '{}',  -- distinct slugs
  modules_done         integer NOT NULL DEFAULT 0,
  charts_saved         integer NOT NULL DEFAULT 0,    -- saved_charts count
  referrals_count      integer NOT NULL DEFAULT 0,
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own row read" ON public.user_progress FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.user_badges (
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_slug text NOT NULL,
  earned_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, badge_slug)
);
CREATE INDEX ON public.user_badges (user_id);
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own row read" ON public.user_badges FOR SELECT TO authenticated USING (auth.uid() = user_id);
```

No trigger on `auth.users` — `user_progress` rows are created lazily on the first call to the award function (`INSERT … ON CONFLICT DO NOTHING`). This follows the project's "no auth.users triggers" rule per `CLAUDE.md`.

## 9. Award path

Single server-side function in `src/lib/gamification/award.ts`:

```ts
export type GamificationEvent =
  | { type: 'sign_in' }
  | { type: 'profile_completed' }
  | { type: 'chart_saved'; relationship?: string }
  | { type: 'module_completed'; module_id: string }
  | { type: 'tool_used'; tool_slug: string }
  | { type: 'muhurta_saved' }
  | { type: 'referral_signup' }
  | { type: 'translation_accepted' };

export async function awardProgress(userId: string, event: GamificationEvent): Promise<AwardResult>;
```

The function:

1. Upserts the user_progress row if missing.
2. Mutates the relevant counter(s) based on event type.
3. Advances streak if event type is 'sign_in' and IST date != streak_last_visit.
4. Recomputes `current_level` from the new state.
5. Writes any newly-earned badges to `user_badges` with ON CONFLICT DO NOTHING.
6. Returns `{ levelChanged, newBadges }` so callers can show toast notifications.

Callers (existing endpoints that need to be edited):

| Endpoint / event | Event to fire |
|---|---|
| Supabase auth callback (any sign-in) | `sign_in` |
| `POST /api/user/profile` (when DOB present) | `profile_completed` |
| `POST /api/saved-charts` | `chart_saved` |
| Learning module completion (`/api/learn/complete`) | `module_completed` |
| First call to each tool API route | `tool_used` |
| Muhurta save endpoint | `muhurta_saved` |
| Future referral signup endpoint | `referral_signup` |

A read-only endpoint `GET /api/user/progress` returns the user's progress + earned badges (for the dashboard hero, sticky banner, and `/path` page). Cached for 60s in the client.

## 10. The Sadhaka Path screen (new route)

`/[locale]/path/page.tsx` — full-screen view, opened by tapping the dashboard portrait or the sticky banner.

- 7-level vertical path with each portrait gold-bordered if earned, greyed if locked.
- Tapping a level reveals the unlock criteria + progress toward it.
- Below: 18-badge grid (3 per row × 6 rows) showing earned vs locked.
- "Recent earns" timeline at the bottom: last 5 unlocks with timestamps.

Linked from: dashboard portrait, sticky banner, user menu dropdown.

## 11. Image optimisation

The seven generated portraits are 8-15 MB each at source. Required pre-merge step:

```bash
# Drop to ~200KB each with lossy compression; visible quality unchanged at display size
for f in public/sadhaka-path/*.png; do
  cwebp -q 85 "$f" -o "${f%.png}.webp"
done
```

Switch `<Image>` references to `.webp` (Next.js handles both formats but webp is preferred). Keep the source PNGs out of the deployed bundle — move them to `art-sources/sadhaka-path/` and `.gitignore` them (or commit if you want a record; they don't ship to the client either way since Next.js only ships what's referenced in `public/`).

## 12. Localization

Levels and badges have `Trilingual` `name` and `description`. Render via `tl(field, locale)`. Devanagari script for hi/mai/sa; native scripts where translations exist for ta/te/bn/kn/gu; English fallback otherwise. Same pattern as the festival metadata in `src/app/[locale]/festivals/[slug]/[year]/layout.tsx`.

The `/path` page and dashboard hero are fully localised. The 15-day grid labels (day names) come from existing locale-aware weekday formatters.

## 13. Edge cases & failure modes

| Case | Behavior |
|---|---|
| User signs in across multiple timezones | IST anchor — streak doesn't lurch when they travel |
| User signs in twice the same IST day | No-op (streak_last_visit check) |
| User misses Monday, signs in Tuesday | Freeze consumed; streak preserved; `streak_freeze_used_at = this Monday` |
| User misses both Mon and Tue, signs in Wed | Freeze can't save Tuesday → streak resets to 0 |
| `awardProgress` is called twice for the same event | Idempotent (PK conflict on user_badges, deduped state in user_progress) |
| User's `current_level` requirements regress (e.g. they unsave 4 of 5 family charts and drop below the chart_saved threshold) | Level does NOT regress. Once unlocked, always unlocked. Only the displayed "next milestone" reflects current state. |
| Award function throws (DB down) | Endpoint logs `console.error('[gamification] award failed:', err)` and returns success anyway. Progress is a non-critical side-effect of the main action (saving a chart still succeeds even if the badge write fails). Reconcilable via a nightly batch job (out of v1 scope). |
| User dismisses the sticky banner | sessionStorage flag set; banner hidden until next session OR until level changes |
| User signs out then signs back in | Banner reappears (new session) |

## 14. Metrics to track

Post-launch metrics to evaluate whether the system is working:

1. **Profile completion rate** — % of signups that hit Sadhaka within 7 days (baseline: 27% lifetime; target: >50%).
2. **Day-1, Day-7, Day-30 return** — % of signups that come back at those marks (no current baseline; will set after first week).
3. **Level distribution** — what % are at each tier after 30 days.
4. **Badge earn distribution** — which badges are most/least earned (signals what users naturally do).
5. **Sticky banner dismiss rate** — if >70% dismiss it, the message is wrong.
6. **`awardProgress` error rate** — should be < 1%.

## 15. Migration & rollout

1. Migration `028_user_progress_and_badges.sql` adds the two tables.
2. Backfill script `scripts/backfill-gamification.ts` walks existing 49 users and computes their progress from existing data (saved_charts, user_profiles.date_of_birth, learn_progress if any). Awards `lit-the-lamp` to the 13 users with completed profiles. Sets level appropriately.
3. Code changes ship behind no flag — gamification is additive (no existing flow breaks if the new code is absent).
4. Post-launch: monitor metrics for 2 weeks before considering v1.1 additions.

## 16. Out of scope (v1.1 candidates)

- **XP totals.** A point-based progression that runs alongside levels. Worth adding if v1 succeeds but users want a more granular sense of motion.
- **Daily quests.** Three rotating tasks per day (check choghadiya, read a module, save a muhurta) that grant a small streak boost.
- **Leaderboards.** Friends-only or global. Risk: social-comparison can feel off-brand for a spiritual app.
- **Premium-locked badges.** A "Patron" or "Yajaman" tier badge that requires a paid plan.
- **Referral system proper.** Acharya criteria mentions referrals but the referral system itself doesn't exist yet. v1 leaves Acharya unlock to the "accepted translation" path until referrals ship.

## Appendix A — Gemini portrait prompts

Stored in `docs/superpowers/specs/2026-05-22-dashboard-gamification-portrait-prompts.md`. Includes the shared style key plus all 7 subject prompts, with the strong-differentiation revisions baked in (robe colour + age + setting + signature pose per level).

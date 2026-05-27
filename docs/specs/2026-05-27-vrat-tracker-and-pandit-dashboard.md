# Vrat Tracker + Pandit Dashboard — Spec

**Status:** Vrat MVP **scoped + decided**, ready to build. Pandit Dashboard **deferred** (parked after Q7).
**Date:** 2026-05-27
**Author:** Aditya
**Last revised:** 2026-05-27 after the Q1-Q7 decision pass and the infra deep-dive

---

## Pre-amble

Both features were requested together; they will ship in separate PRs.

The original spec assumed we were building both features from scratch. A
deep-dive during the decision pass surfaced **far more existing
infrastructure than initially scoped** — particularly for vrats. The
revised spec below reflects that. The build plan is "extend, don't
recreate."

The Pandit Dashboard section is preserved at the end for future reference
but is parked.

---

# Feature A: Vrat Tracker — REVISED (post-decision)

## 1. Decisions

| # | Question | Decision |
|---|---|---|
| Q1 | Vrat catalogue depth | **All 15+** in MVP. Reuse existing `TRACKABLE_VRATS`; extend with more weekday + single-day festival vrats. |
| Q2 | Reminder cadence default | Day-before default-on; parana opt-in (off by default); no morning-of in MVP. |
| Q3 | Vrat location | **Required at first subscription.** No fallback to birth location — wrong sunrise = wrong parana. |
| Q4 | Location picker UX | **Both** — geolocation button + manual `/api/cities` picker fallback. |
| Q5 | Smarta vs Vaishnava | **Per-user setting**, default Smarta, with in-line explanatory UI helping the 99% who don't know which they follow. Links to `/learn/smarta-vaishnava`. |
| Q6 | First-time tradition prompt | **Auto-prompt only on first tradition-dependent vrat subscription** (Ekadashi, Janmashtami). Editable in `/settings` afterwards. |
| Q7 | Personalised iCal feed | **In MVP** — combined personalised feed via per-user token-auth'd route. Reuses existing `/api/calendar/export` infrastructure. |
| Extra | Parana reminder offset | **User-configurable: 15 / 30 / 60 minutes before parana window opens.** Single user-level preference (per-user, not per-subscription). |
| Extra | Day-before email content | Always includes the **parana date + window times** — so the user has the full schedule from the first notification, not only at the parana reminder moment. |

## 2. Existing infrastructure (reuse — do NOT recreate)

| Already shipped | Where | What it does |
|---|---|---|
| `TRACKABLE_VRATS` const | `src/lib/vrat/trackable-vrats.ts` | 12 vrats with slug, name, calendarSlug, deity, description. **This is the source of truth.** |
| `user_vrat_preferences` table | DB (public schema) | Per-user vrat subscriptions: `(id, user_id, vrat_type, enabled, created_at)`. Will be **extended** with reminder/location/tradition columns. |
| `/api/calendar/export` | `src/app/api/calendar/export/route.ts` | RFC 5545 iCal generator with categories (`ekadashi`, `chaturthi`, `pradosham`, `vrat`, etc.), per-event alarms (1 day before), parana times in localized scripts, webcal:// subscription mode. |
| `generateFestivalCalendarV2()` | `src/lib/calendar/festival-generator.ts` | Emits dated festival entries with parana start/end + sunrise per locale. |
| `generateICal()` | `src/lib/calendar/ical-generator.ts` | RFC 5545 builder with VTIMEZONE-less UTC events. |
| `/learn/smarta-vaishnava` | learn module 27-3 | Full explanation of the two traditions; linked from the picker. |
| `/api/cities` autocomplete | existing | Used by `BirthForm` already; reuse for vrat location picker. |
| Puja-vidhi constants | `src/lib/constants/puja-vidhi/*.ts` | Already exist for mangalvar, somvar, purnima, chaitra-navratri. Link from vrat detail. |
| Onboarding-drip cron pattern | `src/app/api/cron/onboarding-drip/route.ts` | Claim-first / send-after / rollback-on-failure email loop — template for vrat reminder cron. |
| `CalendarSyncCard` | `src/components/dashboard/CalendarSyncCard.tsx` | Already on dashboard. Will get a new section for the personalised vrat feed. |

## 3. Tech debt to clean up while building

- **`VRAT_TYPES`** at `src/lib/constants/vrat-types.ts` is a **duplicate** of `TRACKABLE_VRATS`. Different shape, same data. The project's CLAUDE.md hard rule ("NEVER Duplicate Logic or Constants") forbids this. PR 1 deprecates `VRAT_TYPES`, redirects imports to `TRACKABLE_VRATS`.
- The client-side `vrat-alerts.ts` module reads vrat preferences from localStorage. Server-side email reminders need the same data from the DB — `user_vrat_preferences` is the canonical store, localStorage is a cache.

## 4. Data model (extends existing tables — no new tables for vrat MVP)

```sql
-- 043_vrat_tracker_extension.sql

-- ─── Extend existing user_vrat_preferences ─────────────────────────────
-- Existing columns: id, user_id, vrat_type, enabled, created_at
-- vrat_type already exists as text; no FK constraint to a catalogue
-- table because TRACKABLE_VRATS is a const (deliberately code-owned,
-- not DB-owned, since it ships with locale text + deity icons).

ALTER TABLE public.user_vrat_preferences
  ADD COLUMN IF NOT EXISTS email_reminders bool NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS remind_day_before bool NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS remind_parana bool NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS start_date date NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN IF NOT EXISTS end_date date NULL,
  -- Two scalar columns for dedup (not a jsonb log — that grows unbounded).
  -- Cron checks "did we send today's <type> reminder for this subscription?"
  ADD COLUMN IF NOT EXISTS last_reminder_date date NULL,
  ADD COLUMN IF NOT EXISTS last_reminder_type text NULL,
  ADD CONSTRAINT chk_vrat_date_range
    CHECK (end_date IS NULL OR end_date >= start_date),
  ADD CONSTRAINT chk_last_reminder_type
    CHECK (last_reminder_type IS NULL
           OR last_reminder_type IN ('day_before','parana'));

-- Partial index for the cron's eligibility scan. Bounded by users with
-- reminders on — typically thousands at most, not the full table.
CREATE INDEX IF NOT EXISTS user_vrat_reminders_pending_idx
  ON public.user_vrat_preferences (user_id, vrat_type)
  WHERE enabled = true AND email_reminders = true;

-- ─── Per-user vrat settings on user_profiles ───────────────────────────

ALTER TABLE public.user_profiles
  -- Smarta / Vaishnava. NULL means "not chosen yet" — first prompt fires
  -- when the user subscribes to a tradition-dependent vrat (Ekadashi etc.).
  ADD COLUMN IF NOT EXISTS vrat_tradition text NULL
    CHECK (vrat_tradition IS NULL OR vrat_tradition IN ('smarta','vaishnava')),

  -- Location-of-observance (NOT birth location). Required at first
  -- subscription. tz is the IANA name (e.g. 'Asia/Kolkata').
  ADD COLUMN IF NOT EXISTS vrat_location_city text NULL,
  ADD COLUMN IF NOT EXISTS vrat_location_lat double precision NULL
    CHECK (vrat_location_lat IS NULL OR vrat_location_lat BETWEEN -90 AND 90),
  ADD COLUMN IF NOT EXISTS vrat_location_lng double precision NULL
    CHECK (vrat_location_lng IS NULL OR vrat_location_lng BETWEEN -180 AND 180),
  ADD COLUMN IF NOT EXISTS vrat_location_tz text NULL,

  -- Single user-level pref. 99% will keep the default 30.
  ADD COLUMN IF NOT EXISTS parana_reminder_offset_minutes int NOT NULL DEFAULT 30
    CHECK (parana_reminder_offset_minutes IN (15, 30, 60)),

  -- Per-user random token for the personalised iCal feed.
  -- Lazily generated on first vrat subscription. Rotatable.
  ADD COLUMN IF NOT EXISTS vrat_calendar_token text NULL UNIQUE;
```

## 5. The vrat catalogue — what we ship in MVP

**Existing 12 in `TRACKABLE_VRATS`:** Ekadashi, Pradosham, Sankashti Chaturthi, Vinayaka Chaturthi, Masik Shivaratri, Purnima, Amavasya, Skanda Shashthi, Somvar, Mangalvar, Guruvar, Shanivar.

**Add in PR 1** (so MVP launches with 25+):

| Slug | Category | Day | Deity / theme |
|---|---|---|---|
| `bhanuvar-vrat` | weekday | Sunday | Surya |
| `budhavar-vrat` | weekday | Wednesday | Mercury (Budh) |
| `shukravar-vrat` | weekday | Friday | Lakshmi / Santoshi Maa |
| `maha-shivaratri` | festival | annual | Shiva |
| `ram-navami` | festival | annual | Rama |
| `janmashtami` | festival | annual | Krishna |
| `hanuman-jayanti` | festival | annual | Hanuman |
| `akshaya-tritiya` | festival | annual | Vishnu / Lakshmi |
| `karva-chauth` | festival | annual | Shiva-Parvati / spousal welfare |
| `hartalika-teej` | festival | annual | Shiva-Parvati |
| `vat-savitri` | festival | annual | Savitri / spousal welfare |
| `chaitra-navratri` | festival series (9 days) | annual | Durga |
| `sharad-navratri` | festival series (9 days) | annual | Durga |
| `guru-purnima` | festival | annual | Guru |

For each: `calendarSlug` matches the existing slug in `festival-generator.ts` (we verify per entry; add to generator if missing).

## 6. Vrat occurrence generator

Module: `src/lib/vrat/generator.ts` (new — wraps existing infra).

```ts
generateUpcomingOccurrences(
  vratSlug: string,                     // 'ekadashi' | 'mangalvar-vrat' | …
  fromDate: Date,
  windowDays: number,
  location: { lat: number; lng: number; tz: string },
  tradition: 'smarta' | 'vaishnava',
): VratOccurrence[]
```

`VratOccurrence` shape:
```ts
{
  date: string;                         // YYYY-MM-DD (fast day)
  fastStartLocal: string;               // 'HH:MM' (typically sunrise)
  paranaDate: string;                   // YYYY-MM-DD (typically day after)
  paranaStartLocal: string;             // 'HH:MM' (window open)
  paranaEndLocal: string;               // 'HH:MM' (window close — varies by rule)
  paranaRule: string;                   // 'sunrise_next_day' | 'vaishnava_quarter_dwadashi' | 'moonrise' | 'sunrise_to_tithi_end'
  notes?: string;                       // free-form per-vrat hint
}
```

**Routing logic per category:**
- **Tithi-based** (Ekadashi, Chaturthi, Pradosham, Purnima, Amavasya, Shashthi) → `generateFestivalCalendarV2()` + filter by `calendarSlug`.
- **Weekday** (Somvar, Mangalvar, etc.) → next N occurrences of weekday within window. Parana = sunrise next day. Trivial arithmetic.
- **Festival** (Maha Shivaratri, Ram Navami, etc.) → `generateFestivalCalendarV2()` + filter; entry already has `paranaStart` / `paranaEnd` / `paranaDate` for most.

**Per-vrat parana rule:**
- Most: `sunrise_next_day` (window = sunrise of next day → end of vrat tithi).
- Smarta Ekadashi: `sunrise_to_tithi_end` (window = sunrise of Dwadashi → end of Dwadashi).
- Vaishnava Ekadashi: `vaishnava_quarter_dwadashi` (window = sunrise of Dwadashi → 1/4 of Dwadashi elapsed; falls back to sunrise → Dwadashi-end if 1/4 elapsed before sunrise).
- Sankashti Chaturthi: `moonrise` (parana = moonrise; we already compute moonrise in the panchang engine).

The generator returns `paranaRule` so the UI can label the window correctly.

## 7. UI surface

`/dashboard/vrats` — new top-level dashboard tab. Three sections:

**A. Upcoming (default view)**
- 90-day forward list of the user's subscribed vrats' occurrences.
- Each row: date, day-of-week, vrat name, deity icon, fast-start time, parana window, "Subscribed" toggle.
- Links to `/puja/[slug]` for vrat detail (existing puja-vidhi content).

**B. Browse / Subscribe**
- Vrat picker grouped: **Tithi-based** / **Weekday** / **Festival vrats**.
- Each card: vrat name, frequency, deity, "Subscribe" toggle.
- For tradition-dependent vrats (Ekadashi, Janmashtami) — show a small badge "Smarta/Vaishnava setting affects this".

**C. Settings**
- Tradition picker (Smarta/Vaishnava) — auto-prompted on first tradition-dependent subscription; editable here.
- Vrat location — geolocation button + city autocomplete.
- Parana reminder offset (15/30/60).
- Per-subscription: email reminders on/off, parana reminder on/off, optional end_date.

**Tradition picker modal (auto-shown on first tradition-dependent subscribe):**
- Two cards side-by-side
- "**Smarta** *(recommended for most)*" — "Used by mainstream households and most published panchangs. Pick this if you're not sure."
- "**Vaishnava**" — "Followed by ISKCON and Gaudiya Vaishnava practitioners. Rejects 'viddha' tithi when previous tithi touches sunrise. Differs from Smarta on Ekadashi ~4-6 times a year."
- "Read more" link → `/learn/smarta-vaishnava`.
- Default selection: Smarta.

## 8. Email reminders

**Cron:** `/api/cron/vrat-reminder` daily at **12:00 UTC** (= 17:30 IST evening — the day-before reminder lands when the observer is planning the next day, not after sunrise).

**Query order** (lesson learned from Sprint 20 NPS cron review):
1. Start from `user_vrat_preferences WHERE enabled=true AND email_reminders=true` (hits partial index).
2. Group by user, fetch each user's `vrat_tradition` + `vrat_location_*` + `parana_reminder_offset_minutes` from `user_profiles`.
3. For each (user, vrat) pair, generate the next 48h of occurrences using the user's location + tradition.
4. Decide which reminder type to send:
   - `day_before` if a fast falls in the next 24h AND `remind_day_before=true` AND `(last_reminder_date, last_reminder_type) != (today, 'day_before')`.
   - `parana` if a parana window opens within `parana_reminder_offset_minutes` AND `remind_parana=true` AND `(last_reminder_date, last_reminder_type) != (today, 'parana')`.
5. Atomically claim by writing `(last_reminder_date=today, last_reminder_type=…)` with a conditional WHERE — same pattern as `onboarding-drip`.
6. Send via Resend (`namaste@dekhopanchang.com`).
7. Rollback the claim on send failure.

**Email template** (`src/lib/email/templates/vrat-reminder.ts`):
- **Day-before subject:** `"Tomorrow is {vrat_name} — fast starts at sunrise"`.
- **Day-before body:** vrat name, fast date, fast-start time, parana date, parana window times, deity, link to `/puja/[slug]`, link to `/dashboard/vrats`. The full parana schedule is included in the day-before email — so even users who don't opt into parana reminders have the times in hand.
- **Parana subject:** `"{vrat_name} parana window opens at {time}"`.
- **Parana body:** parana window times, fast-break ritual notes (link to puja-vidhi), link to `/dashboard/vrats`.

## 9. Personalised iCal feed (combined per-user feed)

**Route:** `GET /api/calendar/feed/{token}` (new).

- Token = `user_profiles.vrat_calendar_token` (lazily generated on first subscribe).
- Looks up `user_id` from token; reads all subscribed vrats + tradition + location.
- Generates iCal by iterating subscribed vrats → calls the new vrat generator → maps each occurrence to an `ICalEvent` → passes to existing `generateICal()`.
- Per-event alarm baked in at the user's `parana_reminder_offset_minutes` value (so when a calendar app fires the alarm, it matches the email reminder timing).
- Adds `X-WR-TIMEZONE` from `vrat_location_tz`.
- Webcal subscription mode: respond with `Content-Disposition: inline` when `?subscribe=1`.
- Rate-limited (30/min/IP) — reuses existing `checkRateLimit` from `/api/calendar/export`.

**Token UX:**
- "Subscribe in Calendar" button on `/dashboard/vrats` shows two affordances:
  - "Copy webcal:// URL"
  - "One-click Add to Apple/Google Calendar" (constructs the right launch URL)
- "Regenerate token" button in `/settings` → old URL stops working, user re-subscribes.

**Privacy:**
- Token is 32 bytes URL-safe random. Not derivable from user_id.
- Logged in standard Vercel function logs (same as any URL). Mitigation = rotation.
- Token URL exposes "this user observes these vrats" — minor PII. Documented in `/privacy`.

## 10. Edge cases (from the original spec — still load-bearing)

1. **Adhik Masa** — adds extra Ekadashis. Festival generator already handles it.
2. **Sankashti Chaturthi parana at moonrise** — per-vrat parana-rule table covers this.
3. **User travels mid-vrat** — `vrat_location` is static. Documented; future enhancement.
4. **Time zones** — `vrat_location_tz` is the SOLE timezone used. Browser-detected TZ on dashboard is ignored.
5. **Cron failure** — claim-first / send-after / rollback pattern matches `onboarding-drip`.
6. **Weekly vrats with finite duration** — `start_date`/`end_date` columns; UI offers "perpetual" or "for N weeks" (→ end_date).
7. **DB scalability** — partial index on `user_vrat_preferences WHERE enabled=true AND email_reminders=true` keeps the cron's eligibility scan small.

## 11. Build plan — 3 PRs

### PR 1: Schema + catalogue extension + tech-debt cleanup
- Migration `043_vrat_tracker_extension.sql` (extends `user_vrat_preferences` + `user_profiles` — see §4).
- Extend `TRACKABLE_VRATS` to 25+ entries (see §5). Each entry has `calendarSlug` verified against `festival-generator.ts`; add to generator if any festival is missing.
- Deprecate `VRAT_TYPES` const; redirect imports.
- Add per-vrat `paranaRule` field on `TRACKABLE_VRATS`.
- Apply migration to production.

### PR 2: Dashboard tab + picker UI + occurrence generator + personalised iCal
- New module `src/lib/vrat/generator.ts` — `generateUpcomingOccurrences()`.
- New page `/dashboard/vrats` with Upcoming + Browse + Settings tabs.
- Tradition-picker modal (auto-shown on first tradition-dependent subscribe).
- Vrat location picker (geolocation button + `/api/cities` autocomplete).
- New route `/api/calendar/feed/{token}` — token-auth'd personalised iCal.
- "Subscribe in Calendar" button + "Regenerate token" affordance on the dashboard.

### PR 3: Reminder cron + email template
- New cron `src/app/api/cron/vrat-reminder/route.ts` — claim-first / send-after / rollback pattern.
- New template `src/lib/email/templates/vrat-reminder.ts` (day-before + parana variants).
- Day-before email includes parana schedule (date + window times).
- Parana email respects per-user `parana_reminder_offset_minutes`.
- `vercel.json` cron entry: `0 12 * * *` daily.

---

# Feature B: Pandit Dashboard — PARKED

This section is preserved for future reference. Open questions Q8-Q13
were not answered in the 2026-05-27 decision pass. Pandit work is
paused until the Vrat MVP ships.

## B.1 Critical-review framing: data-protection first

A pandit storing third-party birth data inside our database is a
**legal** problem before it is an engineering problem. We become a data
processor for client PII (name, birth time, location) that we have no
consent relationship with. Three concrete requirements before this can
ship:

1. **DPA in our Terms of Service** — pandit users must accept a Data
   Processing Addendum naming them as controller for their clients'
   data, us as processor.
2. **Pandit-initiated client deletion** must cascade: deleting a pandit
   account purges all their `pandit_clients` rows.
3. **Pandit dormancy purge** — if a pandit doesn't log in for 12 months,
   we email them once, then purge their clients after 30 days more.

Cutting any of those three turns this into a GDPR liability the moment
a client's data subject access request lands.

## B.2 Data model

```sql
-- 044_pandit_dashboard.sql

CREATE TABLE public.pandit_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  dpa_accepted_at timestamptz NOT NULL,
  dpa_version text NOT NULL,
  is_verified bool DEFAULT false,
  last_active_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.pandit_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_id uuid NOT NULL REFERENCES public.pandit_profiles(user_id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NULL,
  birth_data jsonb NOT NULL,
  notes text DEFAULT '',
  tags text[] DEFAULT '{}',
  -- HARD delete on user action; no soft-delete column.
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX pandit_clients_pandit_id_idx
  ON public.pandit_clients (pandit_id);

ALTER TABLE public.pandit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_clients  ENABLE ROW LEVEL SECURITY;

CREATE POLICY pandit_profiles_owner ON public.pandit_profiles
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY pandit_clients_owner ON public.pandit_clients
  FOR ALL USING (pandit_id = auth.uid());
```

## B.3 Open questions (deferred)

Q8 Access gate, Q9 stateless engine refactor, Q10 notes in MVP,
Q11 share-with-client, Q12 DPA authorship, Q13 pricing. Answers when
we un-park.

---

# Review-feedback log

**2026-05-27 — Q1-Q7 decision pass + infra deep-dive**
- Q1 changed from "5 in MVP" (my default) to **all 15+, reuse existing TRACKABLE_VRATS**. The deep-dive surfaced that `user_vrat_preferences`, `TRACKABLE_VRATS`, `/api/calendar/export`, and a 12-vrat catalogue already exist. The new spec extends in place rather than creating parallel structures.
- Q2-Q6 — defaults accepted with minor refinements (no morning-of in MVP; explanatory tradition UI added).
- Q7 changed from "v2" (my default) to **MVP**. Personalised iCal feed via per-user token-auth'd route that reuses the existing iCal generator.
- New: parana reminder offset is **user-configurable 15/30/60 min** (not a hardcoded value).
- New: day-before email **always carries the parana schedule** so users don't depend on the optional parana reminder.

**2026-05-27 — Gemini #223 review**
- Added `CHECK (end_date IS NULL OR end_date >= start_date)`.
- Added `CHECK lat BETWEEN -90 AND 90` / `lng BETWEEN -180 AND 180`.
- Replaced unbounded `jsonb` reminder log with two fixed-size scalar columns (`last_reminder_date`, `last_reminder_type`).
- Removed `archived_at` from `pandit_clients` — soft-delete contradicted the data-protection framing; hard delete on user action.

---

# Next step

PR 1 of the Vrat Tracker MVP — schema migration + catalogue extension +
`VRAT_TYPES` deprecation. Then PR 2 (UI + generator + iCal), then PR 3
(reminder cron).

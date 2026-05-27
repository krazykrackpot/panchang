# Vrat Tracker + Pandit Dashboard — Spec

**Status:** Draft for review
**Date:** 2026-05-27
**Author:** Aditya
**Build order:** Vrat Tracker first, Pandit Dashboard second (rationale at end).

---

## Pre-amble: why this is a *spec* not a *brief*

Both features have non-obvious design tensions where the wrong call now becomes
a multi-PR rewrite later. This document calls those tensions out explicitly
and asks for a decision on each rather than guessing.

The two features do not share infrastructure. They're packaged in one spec
because they were requested together; they will ship in separate PRs.

---

# Feature A: Vrat Tracker

## 1. User story

A user picks one or more vrat series. The dashboard then shows upcoming
observance dates with parana times and (opt-in) sends email reminders. The
goal is to give a serious observer a reliable, location-aware schedule
without them having to compute it themselves.

## 2. Scope — what counts as a "vrat series"

Three categories — each composable into a subscription:

| Category | Examples | Frequency |
|---|---|---|
| Tithi-based recurring | Ekadashi, Pradosh (Trayodashi evening), Sankashti Chaturthi, Vinayaka Chaturthi, Purnima, Amavasya | 2–24/year |
| Weekday recurring | Mangalvar (Hanuman), Shaniwar (Shani), Somvar (Shiva), Guruvar (Vishnu/Brihaspati), Shukravar (Lakshmi) | weekly |
| Single-day festival vrats | Ram Navami, Janmashtami, Maha Shivaratri, Karva Chauth, Hartalika Teej, Vat Savitri, Navratri (9 nights) | 1/year |

**MVP cut:** all three categories supported, but the catalogue can ship with
~15 vrats; we add the rest as JSON later.

**Critical-review note:** The festival generator already produces every entry
in the third category and most of the first. Weekday vrats are trivial
arithmetic. We are not building new astronomy — we are wiring existing
output into a user-subscription model.

## 3. Data model

```sql
-- 043_vrat_subscriptions.sql

CREATE TABLE public.vrat_catalogue (
  vrat_key text PRIMARY KEY,            -- 'ekadashi' | 'mangalvar' | 'ram-navami' …
  category text NOT NULL                -- 'tithi' | 'weekday' | 'festival'
    CHECK (category IN ('tithi','weekday','festival')),
  display_name jsonb NOT NULL,          -- { en: 'Ekadashi', hi: 'एकादशी', … }
  deity text NULL,                      -- 'Vishnu', 'Hanuman', …
  tradition_dependent bool NOT NULL DEFAULT false,  -- true → Ekadashi etc.
  puja_slug text NULL,                  -- links to /puja/[slug] if content exists
  default_reminder_offset_hours int NOT NULL DEFAULT 15,  -- 15h before sunrise = previous evening
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.user_vrat_subscriptions (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  vrat_key text REFERENCES public.vrat_catalogue(vrat_key) ON DELETE RESTRICT,
  email_reminders bool DEFAULT true,
  remind_day_before bool DEFAULT true,
  remind_morning_of bool DEFAULT false,
  remind_parana bool DEFAULT false,
  -- Most weekly vrats are observed for a finite stretch
  -- ("45 Mangalvars to fulfil a sankalp") rather than perpetually.
  -- NULL end_date means "ongoing until I unsubscribe".
  start_date date NOT NULL DEFAULT CURRENT_DATE,
  end_date date NULL,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, vrat_key)
);

CREATE INDEX user_vrat_reminders_idx
  ON public.user_vrat_subscriptions (user_id)
  WHERE email_reminders = true;

-- Tradition is per-user (see open-question Q5), stored on user_profiles.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS vrat_tradition text
    CHECK (vrat_tradition IN ('smarta','vaishnava')) DEFAULT NULL;

ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS vrat_location_city text NULL;
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS vrat_location_lat double precision NULL;
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS vrat_location_lng double precision NULL;
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS vrat_location_tz text NULL;
```

**Notes:**
- `vrat_catalogue` is a server-side allowlist; `vrat_key` on the subscription
  table is a FK so a typo or a deprecated key cannot silently land.
- `vrat_location_*` is a snapshot the cron can read. The browser's
  `location_store` is unreliable server-side (it lives in localStorage), so a
  user-set "vrat location" is needed for accurate sunrise/parana. Default
  prompts to current location at first subscription.
- The `start_date`/`end_date` window covers the "45 Mangalvars for a sankalp"
  pattern that pure perpetual subscriptions miss.

## 4. Vrat occurrence generator

Module: `src/lib/vrat/generator.ts` (new).

```ts
generateUpcomingOccurrences(
  vratKey: string,
  fromDate: Date,
  windowDays: number,
  location: { lat: number; lng: number; tz: string },
  tradition: 'smarta' | 'vaishnava',
): VratOccurrence[]
```

Where `VratOccurrence` is `{ date, fastStartLocal, paranaStartLocal,
paranaEndLocal, paranaRule, notes }`.

**Reuses:**
- `src/lib/calendar/festival-generator.ts` for tithi-based + festival vrats
- `src/lib/astronomy/*` for sunrise per location
- `src/lib/calendar/tithi-table.ts` for tithi end-times

**Parana rules** (per the existing `/learn/smarta-vaishnava` module):
- Smarta Ekadashi: parana = sunrise of Dwadashi → any time before Dwadashi ends.
- Vaishnava Ekadashi: parana = after sunrise of Dwadashi, before 1/4 of Dwadashi has elapsed. If 1/4-elapsed is before sunrise, parana = sunrise to Dwadashi-end (rare edge case).
- Sankashti Chaturthi: parana = moonrise (different! we already compute moonrise for the panchang).
- Most others: parana = sunrise next day.

The generator returns the rule-name as part of `paranaRule` so the UI can
display "Parana before 09:43 IST" or "Parana at moonrise (19:12)" without
the user needing to know which rule applies.

**Critical-review note:** Sankashti Chaturthi parana-at-moonrise is a real
edge case that proves the generic "sunrise next day" assumption is wrong.
Building a parana-rule table per `vrat_key` is essential to MVP.

## 5. UI surface

- **`/dashboard/vrats`** — new top-level tab on the dashboard.
  - Section A: "Subscribed" — upcoming 90-day list with date, day, fast-start,
    parana, deity icon, and a link to `/puja/[slug]` if present.
  - Section B: "Browse" — vrat picker grouped by category. Each card has
    description, frequency, deity, "subscribe" toggle, and (where applicable)
    a tradition selector (Smarta/Vaishnava) defaulting to the user's profile
    setting.
  - Section C: "Settings" — per-subscription reminder preferences, vrat
    location (city picker), tradition.
- **No new top-level routes.** `/vrats` as a public page is out of scope —
  this is a logged-in dashboard feature.

## 6. Email reminders

- New cron `/api/cron/vrat-reminder` at **12:00 UTC daily** (= 17:30 IST,
  early evening — the day-before reminder lands when the observer is
  planning, not at 06:00 UTC when they have already missed sunrise).
- Performance: same query-order lesson as the NPS cron — start from
  `user_vrat_subscriptions WHERE email_reminders = true`, generate the
  user's next-24h occurrences in-process, send if any.
- Email template: `src/lib/email/templates/vrat-reminder.ts`.
  - Day-before subject: "Tomorrow is {vrat_name} — parana at {time}"
  - Morning-of subject: "{vrat_name} today — sunrise {time}, parana {parana}"
  - Parana subject: "{vrat_name} parana window opens at {time}"
- Dedup: `vrat_reminder_sent_at jsonb` on the subscription row, recording
  `{ '2026-05-27': 'day_before', '2026-05-28': 'morning_of' }` so a retry
  cron run doesn't double-send.
- **Opt-in default** per project memory ("no email bombardment"): subscribing
  to a vrat opts you in to day-before reminders only; morning-of and parana
  reminders are opt-in per subscription.

## 7. Edge cases identified during review

1. **Adhik Masa** — adds 1 extra month of Ekadashis (sometimes 2 more
   Ekadashis). The festival generator already handles this; just confirm
   the vrat generator inherits it. 2026 has Jyeshtha Adhika.
2. **Vaishnava-Smarta day-of-Ekadashi divergence** — already-handled by the
   festival engine. The subscription's tradition flag picks the right date.
3. **Sankashti Chaturthi parana at moonrise** — needs per-vrat parana-rule
   table; cannot assume "sunrise next day".
4. **User travels mid-vrat** — vrat_location is static; we use the snapshot.
   Document this; a future enhancement could be auto-update from
   location_store on dashboard visit.
5. **Weekly vrats with finite duration** — start_date / end_date columns
   handle this; UI must let the user choose "perpetual" or "for N weeks"
   (translated to a date).
6. **Time zones** — vrat_location_tz is the SOLE timezone used for the
   user's vrat. Browser-detected TZ on the dashboard is ignored.
7. **Cron failure** — same claim-first / send-after / rollback-on-failure
   pattern as `onboarding-drip` and `nps-feedback`.
8. **iCal export** — the existing iCal feed should add a `/api/feed/vrats`
   path so a user can subscribe in Apple/Google Calendar. Out of MVP
   scope; tracked.

## 8. Open questions for Aditya

| # | Question | Recommended default |
|---|---|---|
| Q1 | Vrat catalogue: ship all 15+ from day 1, or 5 (Ekadashi, Pradosh, Sankashti Chaturthi, Ram Navami, Janmashtami) and add the rest in v2? | **5 in MVP** — fastest signal; add later via vrat_catalogue inserts (no code change). |
| Q2 | Reminder cadence default: just day-before, or also morning-of? | **Just day-before** — opt-in for the other two. |
| Q3 | Vrat location: required at first subscription, or fall back to chart's birth location if missing? | **Required at first subscription** — sunrise must be local-to-observance, not local-to-birth. |
| Q4 | Vrat location precision: free-text city → geocode via existing /api/cities autocomplete? | **Use existing /api/cities** — already wired in BirthForm. |
| Q5 | Smarta/Vaishnava tradition: per-user profile setting (one global choice) or per-subscription? | **Per-user profile** — 99% of observers stick to one tradition. Per-subscription is overengineering. |
| Q6 | First-time prompt for tradition: in vrat onboarding modal, or in /settings? | **Vrat onboarding modal** — only relevant when subscribing. |
| Q7 | iCal export of vrats in MVP or v2? | **v2** — email reminders cover the urgent case. |

---

# Feature B: Pandit Dashboard

## 1. User story

A practicing pandit logs in and sees a list of clients they consult for.
They can add a new client (name, birth data), view that client's full
kundali, keep private notes, and (later) share a read-only chart link with
the client themselves.

## 2. Critical-review framing: data-protection first

A pandit storing third-party birth data inside our database is a **legal**
problem before it is an engineering problem. We become a data processor for
client PII (name, birth time, location) that we have no consent relationship
with. Three concrete requirements before this can ship:

1. **DPA in our Terms of Service** — pandit users must accept a Data
   Processing Addendum that names them as controller for their clients'
   data, and us as processor.
2. **Pandit-initiated client deletion** must cascade: deleting a pandit
   account purges all their `pandit_clients` rows.
3. **Pandit dormancy purge** — if a pandit doesn't log in for 12 months,
   we email them once, then purge their clients after 30 days more. (Same
   pattern as `welcome_email_sent_at` etc.)

Cutting any of those three turns this into a GDPR liability the moment a
client's data subject access request lands.

## 3. Scope — what's in MVP

**In:**
- Pandit profile (display name, languages, bio)
- Client CRUD (name, birth data, free-form notes, tags)
- Per-client kundali view (reuses the existing engine in stateless mode —
  takes `birth_data` directly, doesn't write a `kundali_snapshot`)
- DPA acceptance on first entry into pandit mode

**Out:**
- PDF export (v2)
- Session log / consultation history (v2)
- Payment tracking / invoicing (v3 — paid pandit tier)
- Read-only share link to client by email (v2 — requires consent UX)
- Public pandit directory (v3 — requires verification flow)
- Multi-pandit teams (v3)

## 4. Data model

```sql
-- 044_pandit_dashboard.sql

CREATE TABLE public.pandit_profiles (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  bio text,
  specialties text[] DEFAULT '{}',
  languages text[] DEFAULT '{}',
  dpa_accepted_at timestamptz NOT NULL,         -- never null — gates pandit mode
  dpa_version text NOT NULL,                    -- '2026-05-27' etc.
  is_verified bool DEFAULT false,
  last_active_at timestamptz DEFAULT now(),     -- for dormancy purge
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE public.pandit_clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_id uuid NOT NULL REFERENCES public.pandit_profiles(user_id) ON DELETE CASCADE,
  client_name text NOT NULL,
  client_email text NULL,                       -- v1: stored, NEVER auto-emailed
  birth_data jsonb NOT NULL,                    -- same shape as saved_charts
  notes text DEFAULT '',
  tags text[] DEFAULT '{}',
  archived_at timestamptz NULL,                 -- soft delete; hard delete on cascade
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX pandit_clients_pandit_id_idx
  ON public.pandit_clients (pandit_id)
  WHERE archived_at IS NULL;

-- RLS
ALTER TABLE public.pandit_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pandit_clients  ENABLE ROW LEVEL SECURITY;

CREATE POLICY pandit_profiles_owner ON public.pandit_profiles
  FOR ALL USING (user_id = auth.uid());
CREATE POLICY pandit_clients_owner ON public.pandit_clients
  FOR ALL USING (pandit_id = auth.uid());
```

## 5. Access model

A pandit is just a regular user who has accepted the DPA. There is no
admin step in MVP. Self-declared, opt-in. The `dpa_accepted_at` column is
the only gate.

**Critical-review note:** This is permissive. If we want to gate behind a
paid tier (Jyotishi) or admin approval, we add a check on the entry-point
page, not on the schema. Cheap to bolt on later — keep it open for MVP.

## 6. Reusing the kundali engine

The existing engine reads from `kundali_snapshots`. For pandit clients we
need a stateless variant: take `birth_data` in, compute, return — no row
written.

Refactor:
- `computeKundali(birthData, options)` — pure function in
  `src/lib/kundali/compute.ts`
- `getOrCreateUserKundaliSnapshot(userId)` — wraps the pure function with
  the snapshot read/write cache (the existing path)
- Pandit-client page calls the pure function directly with the client's
  `birth_data`

**Critical-review note:** This refactor is the largest engineering risk.
The current engine probably has implicit dependencies on the snapshot
table (cache lookups, engine-version comparison). The first PR is just
this refactor; the pandit dashboard rides on top.

## 7. UI surface

- `/pandit/onboarding` — gated entry, DPA acceptance, profile fields.
- `/pandit` — client list, search, tag filters.
- `/pandit/clients/new` — birth form (reuses `<BirthForm>`).
- `/pandit/clients/[id]` — kundali viewer, notes panel, tag editor.

Pandit mode is an additive layer on top of normal user mode. The user's own
chart on `/kundali` continues to work; the pandit pages are just additional
routes.

## 8. Edge cases identified during review

1. **DPA versioning** — if we change the DPA, we need a re-acceptance flow
   for existing pandits. The `dpa_version` column allows the page to
   detect a mismatch and prompt re-acceptance before letting them continue.
2. **Client name uniqueness** — none. A pandit may have two "Ramesh Kumar"
   clients. Disambiguate by created_at and notes.
3. **Birth time unknown** — many real-world consultations work from a
   rectified time. Birth-data shape must accept "approximate" / "rectified"
   flags. The existing `BirthForm` supports unknown-time via the time
   bucket; reuse as-is.
4. **Tags freeform** — accept any string; no validation. Power users build
   their own taxonomy.
5. **Notes leakage** — notes are a free-text field. We must NEVER index or
   send them anywhere off-platform. Worth a comment at the column DDL.
6. **Bulk import** — pandits with existing client lists in Excel will ask
   for CSV import. Out of MVP; flagged.
7. **Locale of generated kundali** — the pandit chooses display language
   per client (Sanskrit terms for traditional clients, English for younger
   ones). The existing engine output is locale-aware via `tl()` — works
   for free if the page passes the right locale.

## 9. Open questions for Aditya

| # | Question | Recommended default |
|---|---|---|
| Q8 | Access gate: any logged-in user, or paid Jyotishi tier only? | **Any logged-in user + DPA acceptance** — broadest acquisition; gate later if abuse appears. |
| Q9 | Stateless kundali engine refactor: do as Sprint A pre-work, or accept duplicate snapshots per client (cheap on storage)? | **Refactor** — the engine writes a snapshot per (user, ENGINE_VERSION). Per-client snapshots would multiply by ~50× per active pandit. |
| Q10 | Notes per client in MVP, or strip to clients + charts only? | **Include notes** — that's the entire reason a pandit needs our DB instead of a spreadsheet. |
| Q11 | Share-with-client (email read-only chart link) in MVP or v2? | **v2** — requires a separate consent UX for the client. |
| Q12 | DPA text — who writes it? Aditya draft + legal review, or template from a comparable Indian SaaS? | **Aditya draft** — short, plain-English, India-jurisdiction. ~400 words. |
| Q13 | Pricing: free for MVP, or paid from day 1? | **Free in MVP** — paid tier comes once we have signal on usage. |

---

# Build order

**Sprint 1: Vrat Tracker MVP (3 PRs)**
1. Schema (043 migration) + catalogue seed + tradition / location columns on user_profiles.
2. Generator (`src/lib/vrat/generator.ts`) + dashboard tab UI + picker.
3. Reminder cron + email template + iCal export stub.

**Sprint 2: Pandit Dashboard MVP (4 PRs)**
1. Stateless kundali engine refactor.
2. Schema (044 migration) + RLS + DPA copy + onboarding page.
3. Client CRUD + list view.
4. Per-client kundali viewer + notes editor.

Why Vrat first: smaller surface, reuses existing infra, no legal review
needed. The pandit dashboard's DPA + engine refactor will take longer
than its UI work — better to land a real shipped feature in between.

---

# Decision request

To unblock implementation I need an answer (or a "default is fine") for
each of Q1 through Q13. Once those are settled, the first PR is the Vrat
schema migration.

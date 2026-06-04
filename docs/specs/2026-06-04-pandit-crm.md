# Pandit CRM — full feature spec

**Status:** Locked design, implementation in progress
**Branch:** `feat/pandit-crm` (long-lived, big-bang squash-merge target)
**Author:** Aditya + Claude
**Date:** 2026-06-04

## 1. Purpose

Make Dekho Panchang the workspace a practising Vedic astrologer (Pandit) uses every day to manage clients, generate readings, run consultations, and never miss a client's major astrological event (dasha sandhi, sade sati phase, eclipse impact). Designed as a CRM with the calculation engine wired in, not the other way around.

Two-sided product effect: every Pandit who onboards a client through the email-invitation path *brings that client onto the platform as a user*. Pricing is structured so a Pandit's economic incentive aligns with growing the user base.

## 2. Persona model

`user_profiles.account_type` ∈ `{'seeker', 'pandit'}`, default `'seeker'`. Set during onboarding via a one-question prompt: *"Are you a practising astrologer / pandit?"* — toggleable in Settings later.

- **Seeker** (current consumer experience): `/dashboard` shows `SeekerDashboard` (today's panchang, personalised horoscope, family card, journal, remedies). Unchanged from current behaviour.
- **Pandit** (new): `/dashboard` shows `PanditDashboardHome` — today's alerts, recent activity, upcoming follow-ups, today's panchang strip for the SEO city, client roster shortcut. Pandit retains access to their personal seeker chart via a "My personal chart" link.

A user can flip `account_type` in Settings without data loss. Seeker data stays put; Pandit data (clients, consultations, etc.) is independent storage.

## 3. The two lifecycle axes

A client record has **two orthogonal lifecycle states**, each tracked on a separate column. Cross-product gives 16 valid pairs; UI must show both axes clearly.

### 3.1 Link state — relationship to the app

```sql
pandit_clients.link_state TEXT CHECK (… IN (
  'unlinked',    -- Pandit-only data, no client auth user, no invitation outstanding
  'invited',     -- Email invitation sent, awaiting response (still Pandit-only data)
  'linked',      -- Client accepted; client_user_id set; mutual access active
  'paused',      -- Was linked but client revoked one or more permissions
  'declined'     -- Client declined the invitation (Pandit keeps record in unlinked-equivalent mode)
)) DEFAULT 'unlinked';
```

**Transitions**

| From | Event | To |
|---|---|---|
| `unlinked` | Pandit clicks "Invite to claim" | `invited` |
| `invited` | Client accepts | `linked` |
| `invited` | Client declines | `declined` |
| `invited` | `expires_at` elapses | `unlinked` (invitation moved to history) |
| `linked` | Client revokes `read_birth_data` permission | `paused` |
| `linked` | Pandit revokes link | `unlinked` |
| `linked` | Client deletes their account | `unlinked` (link severed; Pandit keeps record) |
| `paused` | Client restores permissions | `linked` |
| `declined` | Pandit re-invites (30d cooldown) | `invited` |

### 3.2 Engagement state — relationship to the Pandit

```sql
pandit_clients.engagement_state TEXT CHECK (… IN (
  'prospect',   -- Pandit added them as a potential client; no consultation yet
  'active',     -- Currently consulting; recent activity
  'past',       -- Was a client; not currently active (consultations exist but stale)
  'archived'    -- Pandit explicitly archived (cap-relief; can be unarchived)
)) DEFAULT 'prospect';
```

**Transitions**

| From | Event | To |
|---|---|---|
| `prospect` | First consultation logged | `active` (automatic via trigger on `pandit_consultations` insert) |
| `active` | No activity for 12 months (cron) | `past` (automatic, reversible) |
| `past` | New consultation logged | `active` |
| any | Pandit chooses "Archive" | `archived` |
| `archived` | Pandit chooses "Unarchive" | previous state restored |

**Why automatic past/active flip:** Pandits don't manually maintain engagement state. The 12-month threshold is configurable in `pandit_settings.past_threshold_months` (default 12). Archived state, by contrast, is always explicit.

### 3.3 Pair semantics & UI badges

Both badges always show on every client row. Each is a coloured pill with icon + label.

| Link state | Icon | Colour | Pill text |
|---|---|---|---|
| `unlinked` | ✎ | slate | "Unlinked" |
| `invited` | ✉ | amber | "Invited" |
| `linked` | 🔗 | emerald | "Linked" |
| `paused` | ⏸ | rose | "Paused" |
| `declined` | ✕ | grey | "Declined" |

| Engagement state | Icon | Colour | Pill text |
|---|---|---|---|
| `prospect` | ◇ | slate | "Prospect" |
| `active` | ● | emerald | "Active" |
| `past` | ◐ | amber | "Past" |
| `archived` | □ | grey | "Archived" |

Roster default filter: show `engagement_state IN ('active', 'prospect')`. "Past" + "Archived" available via filter chips. Pandit can filter on either axis independently.

### 3.4 Capability matrix per `link_state`

| Capability | unlinked | invited | linked | paused | declined |
|---|---|---|---|---|---|
| Pandit reads `birth_data` | ✓ (Pandit-entered) | ✓ (Pandit-entered) | ✓ (synced from client) | ✓ (last-synced snapshot) | ✓ (Pandit-entered) |
| Pandit generates kundali/tippanni | ✓ | ✓ | ✓ | ✓ (with "data may be stale" warning) | ✓ |
| Pandit downloads PDF | ✓ | ✓ | ✓ | ✓ | ✓ |
| Pandit **pushes** deliverable to client's dashboard | ✗ | ✗ | ✓ | ✗ (paused link blocks push) | ✗ |
| Client receives push + notification | ✗ | ✗ | ✓ | ✗ | ✗ |
| Pandit logs consultation | ✓ | ✓ | ✓ | ✓ | ✓ |
| Client sees `client_visible_summary` of consultations | ✗ | ✗ | ✓ (when `shared_with_client=true`) | ✗ | ✗ |
| Alerts engine runs for this client | ✓ | ✓ | ✓ | ✓ | ✓ |
| Client receives alerts in their dashboard | ✗ | ✗ | ✓ (subset, per permissions) | ✗ | ✗ |
| Counts toward Pandit's free-tier cap | ✓ | ✓ | ✗ (linked is free) | ✗ | ✓ |

**The crucial nudge:** linked clients don't count against the cap. Pandit's economic incentive is to convert unlinked → linked.

## 4. Schema

Single migration: `supabase/migrations/0XX_pandit_crm.sql` (number assigned at implementation time).

```sql
-- account_type on user_profiles (existing table)
ALTER TABLE user_profiles
  ADD COLUMN account_type TEXT NOT NULL DEFAULT 'seeker'
    CHECK (account_type IN ('seeker', 'pandit'));

-- The master client record
CREATE TABLE pandit_clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pandit_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Identity
  full_name TEXT NOT NULL,
  client_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    -- NULL in unlinked/invited/declined; SET NULL when client deletes their account

  -- Pandit's working data — source of truth for the Pandit's UI regardless of mode
  birth_data JSONB NOT NULL,            -- {date, time, lat, lng, tz, place, birth_time_known, time_estimated}
  birth_data_source TEXT NOT NULL CHECK (… IN ('pandit_entered', 'client_synced'))
    DEFAULT 'pandit_entered',
  contact_email TEXT,
  contact_phone TEXT,
  contact_address TEXT,
  photo_url TEXT,

  -- Pandit-private organisation
  display_label TEXT,
  tags TEXT[] NOT NULL DEFAULT '{}',
  pandit_notes TEXT,
  color TEXT,                            -- visual roster organisation

  -- Lifecycle (two axes)
  link_state TEXT NOT NULL CHECK (… IN
    ('unlinked','invited','linked','paused','declined'))
    DEFAULT 'unlinked',
  engagement_state TEXT NOT NULL CHECK (… IN
    ('prospect','active','past','archived'))
    DEFAULT 'prospect',
  engagement_state_before_archive TEXT,  -- snapshot for unarchive

  -- Denormalised for fast roster sorts/filters
  first_consult_at TIMESTAMPTZ,
  last_consult_at TIMESTAMPTZ,
  link_state_changed_at TIMESTAMPTZ,
  engagement_state_changed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Pandit cannot have two active link rows for the same client_user_id.
CREATE UNIQUE INDEX pandit_clients_unique_link
  ON pandit_clients (pandit_user_id, client_user_id)
  WHERE client_user_id IS NOT NULL AND link_state IN ('linked','paused');

-- Idempotency on the unlinked path: same Pandit + same normalised name + same date
-- of birth = same record. Prevents double-click double-creation.
CREATE UNIQUE INDEX pandit_clients_unique_unlinked_identity
  ON pandit_clients (pandit_user_id, lower(trim(full_name)), (birth_data->>'date'))
  WHERE client_user_id IS NULL;

-- Client's family from the Pandit's perspective — always Pandit-owned data.
-- Linked client's own saved_charts is shown supplementally, not synced.
CREATE TABLE pandit_client_family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,         -- denormalised for RLS speed
  full_name TEXT NOT NULL,
  birth_data JSONB,                     -- nullable: known person, uncertain data
  relationship TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Invitation lifecycle (one open invitation per client record at a time)
CREATE TABLE pandit_client_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  invitation_token TEXT NOT NULL UNIQUE,    -- URL-safe random 32B
  invited_email TEXT NOT NULL,              -- normalised lower(trim())
  permissions_requested JSONB NOT NULL,
  pandit_message TEXT,
  status TEXT NOT NULL CHECK (… IN
    ('pending','accepted','declined','expired','revoked'))
    DEFAULT 'pending',
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX pandit_client_invitations_one_pending
  ON pandit_client_invitations (client_record_id)
  WHERE status = 'pending';

-- Consultation log
CREATE TABLE pandit_consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,                       -- denorm for client-side query when linked
  consulted_at TIMESTAMPTZ NOT NULL,
  channel TEXT CHECK (… IN
    ('in_person','phone','video','chat','email','async_note')),
  duration_minutes INT,
  pandit_private_notes TEXT,                 -- never shared
  client_visible_summary TEXT,               -- shown only if shared_with_client=true
  shared_with_client BOOLEAN NOT NULL DEFAULT FALSE,
  shared_at TIMESTAMPTZ,
  attachments JSONB,                         -- [{deliverable_id, label}]
  next_followup_at TIMESTAMPTZ,
  created_at, updated_at
);

-- Alerts surface (idempotent on (client, kind, fires_at))
CREATE TABLE pandit_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,
  kind TEXT NOT NULL,
  fires_at DATE NOT NULL,
  severity TEXT NOT NULL CHECK (… IN ('info','notable','critical')),
  payload JSONB,                            -- {dasha_from, dasha_to, current_pada_lord, etc}
  acknowledged_at TIMESTAMPTZ,              -- Pandit clicked "Noted"
  emailed_at TIMESTAMPTZ,                   -- per-Pandit email timestamp
  client_emailed_at TIMESTAMPTZ,            -- linked client's own email timestamp
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE UNIQUE INDEX pandit_alerts_idempotency
  ON pandit_alerts (client_record_id, kind, fires_at);

-- Generated artifacts the Pandit can keep or push
CREATE TABLE pandit_deliverables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_record_id UUID NOT NULL REFERENCES pandit_clients(id) ON DELETE CASCADE,
  pandit_user_id UUID NOT NULL,
  client_user_id UUID,                      -- denorm; surfaces on client side when linked + pushed
  kind TEXT NOT NULL CHECK (… IN (
    'kundali_report', 'tippanni', 'muhurta_pick', 'matching_report',
    'consultation_summary', 'custom_letter'
  )),
  title TEXT NOT NULL,
  content JSONB,                            -- structured payload, multilingual-ready
  locale TEXT NOT NULL,
  content_pdf_url TEXT,                     -- optional baked PDF in supabase storage
  visibility TEXT NOT NULL CHECK (… IN ('pandit_only','client_pushed'))
    DEFAULT 'pandit_only',
  pushed_at TIMESTAMPTZ,                    -- non-null = pushed to client
  client_seen_at TIMESTAMPTZ,
  client_acknowledged_at TIMESTAMPTZ,
  notification_id UUID,
  created_at, updated_at
);

-- Pandit-level settings (one row per pandit)
CREATE TABLE pandit_settings (
  pandit_user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  letterhead_name TEXT,
  letterhead_subtitle TEXT,
  letterhead_address TEXT,
  logo_url TEXT,
  signature_url TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  default_report_locale TEXT NOT NULL DEFAULT 'en',
  alert_email_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  alert_lookahead_days INT NOT NULL DEFAULT 14,
  past_threshold_months INT NOT NULL DEFAULT 12,
  weekly_digest_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  digest_day TEXT NOT NULL DEFAULT 'monday',
  created_at, updated_at
);

-- RLS — every pandit_* table:
--   SELECT/INSERT/UPDATE/DELETE: pandit_user_id = auth.uid()
-- Cross-tenant access through invitation tokens uses service_role with audit trail.
-- Linked client read access to their deliverables/consultations uses the
-- client_user_id columns (denormalised) with their own RLS policy.
```

**Triggers**

- `pandit_consultations BEFORE INSERT`: update `pandit_clients.last_consult_at`, `first_consult_at` if null, and flip `engagement_state` from `'prospect'` → `'active'`.
- `pandit_clients BEFORE UPDATE`: maintain `link_state_changed_at`, `engagement_state_changed_at` on field change.
- Daily cron job: flip `engagement_state` from `'active'` → `'past'` when `last_consult_at < NOW() - (past_threshold_months × INTERVAL '1 month')`.

## 5. Onboarding flows

### 5.1 Path B (no email) — Pandit-only

```
Pandit on /dashboard/clients → "Add client" button
  Modal with form:
    full_name*          [required]
    birth_date*         [required]
    birth_time          [optional; "time_estimated" checkbox]
    birth_place*        [via LocationSearch — required, gives lat/lng/tz]
    contact_email       [optional; UI: "Want to invite them later? Add email now."]
    contact_phone       [optional]
    tags                [optional, chip input]
    color               [optional, picker]
    pandit_notes        [optional, freeform]
  → POST /api/pandit/clients
  → INSERT pandit_clients(link_state='unlinked', engagement_state='prospect')
  → Roster shows the new client
```

Two required fields. The form is intentionally short — adding a client is ~20 seconds. Birth time can be omitted; `time_estimated` flag carries forward into computations and surfaces an "approximate" badge on every chart.

### 5.2 Path A (invitation) — three sub-flows

The Pandit can fire an invitation at any time after creating an unlinked client:

```
Client detail page → "Invite to claim" CTA
  Modal:
    invited_email*    [required; pre-filled if contact_email is set]
    permissions_requested  [all 6 checked by default; Pandit can un-tick]
    pandit_message    [optional, multi-line; defaults to a friendly template]
  → POST /api/pandit/clients/[id]/invite
  → Server normalises email (lower(trim()))
  → Branch on whether email matches existing auth.users:
```

**Sub-flow A1 — Email matches existing user**

```
INSERT pandit_client_invitations(invited_user_id = matched_user.id, status='pending')
INSERT notifications(user_id = matched_user.id, kind='pandit_link_request',
                     payload={pandit_name, message, permissions, invitation_token})
Resend email → "Pandit X would like to be your astrologer. Tap to review."

UPDATE pandit_clients SET link_state='invited' WHERE id=...

Client side:
  - Bell rings in /dashboard
  - Click → /pandit-invitation/[token] (token from email or from notification)
  - Page shows: Pandit name + photo + message + requested permissions
  - Two buttons: "Accept" / "Decline"
  - Accept: INSERT row in pandit_client_links-equivalent (we use pandit_clients.client_user_id directly), permissions stored on pandit_clients (column or JSON?), link_state='linked'
    - Sync client's birth_data from user_profiles into pandit_clients (birth_data_source='client_synced')
  - Decline: link_state='declined', notify Pandit
```

**Sub-flow A2 — Email does not match any user**

```
INSERT pandit_client_invitations(invited_user_id=NULL, status='pending')
Resend email → "Pandit X invites you to join Dekho Panchang. Tap to sign up and connect."

UPDATE pandit_clients SET link_state='invited' WHERE id=...

Recipient experience:
  - Click email link → /pandit-invitation/[token]
  - Page shows: "Pandit X has invited you to Dekho Panchang"
  - "Sign up to connect" button → /auth/signup?invitation_token=...
  - Signup flow runs, email pre-filled, token persisted in session
  - Post-signup, post-onboarding-modal:
    - Resolve invitation by token
    - UPDATE invitation SET invited_user_id = new_user.id
    - Show final "Connect with Pandit X" confirmation card on /dashboard
    - User taps Accept → link_state='linked', sync birth_data, etc.
```

**Sub-flow A3 — Invitation already pending**

UI prevents firing a second invitation while one is `'pending'`. Pandit can "Resend" (re-fires the same email + notification, doesn't create new row), or "Cancel" (sets `status='revoked'`, frees the slot to invite again).

### 5.3 Permission semantics

Permission booleans on the invitation become the live permission set on link acceptance. Stored as `pandit_clients.permissions JSONB` (single source of truth post-link; the invitation row is historical).

```typescript
type ClientPermission =
  | 'read_birth_data'           // baseline; revoking auto-pauses the link
  | 'read_family_charts'        // Pandit sees client's saved_charts as supplementary
  | 'generate_readings'         // Pandit can compute on client's data
  | 'push_deliverables'         // Pandit can push artifacts to client's dashboard
  | 'send_alerts_to_client'     // Alerts also notify the client (separate from Pandit alerts)
  | 'view_consultation_history'; // Client can see consultation summaries (defaults true)
```

Client can modify any permission at any time from their /dashboard "My Pandits" panel.

## 6. Family handling — strict one-source rule

Each client has *Pandit's working family* (`pandit_client_family_members`) — the canonical source for the Pandit's UI.

If a client is `linked` AND has a `read_family_charts` permission AND has rows in their own `saved_charts`:

- A supplementary read-only panel appears on the client's Family tab: **"Y's family in their account"**.
- One-shot "Import from client's account" button copies entries into `pandit_client_family_members`. After import, subsequent edits stay in Pandit's table.
- No live sync. Lesson B ("single source of truth") prevents the dual-write divergence trap.

Family-synthesis library (`src/lib/kundali/family-synthesis/*`) needs an explicit `anchor` parameter (we audit this in P4 before implementation; refactor if it currently assumes `relationship === 'self'`).

## 7. Sharing & delivery

### 7.1 Deliverables — what they are

Six kinds, all materialised as `pandit_deliverables` rows:

| Kind | Content shape | Example |
|---|---|---|
| `kundali_report` | Full kundali snapshot + narrative | "Aditya's natal chart with planetary analysis" |
| `tippanni` | Structured tippanni JSON (sections, yogas, doshas, remedies) | "Personal tippanni for the year 2026" |
| `muhurta_pick` | A specific muhurta with timing + rationale | "Auspicious time for ground-breaking ceremony" |
| `matching_report` | Two-chart Ashta Kuta with verdict | "Compatibility analysis with Priya" |
| `consultation_summary` | Pandit's freeform written summary | "Notes from our 2026-06-01 session" |
| `custom_letter` | Freeform rich text | "Annual letter on the upcoming Saturn transit" |

### 7.2 Push channels

| Link state | Channels available |
|---|---|
| `unlinked` / `invited` / `declined` | Download PDF (Pandit forwards externally — WhatsApp, email, paper) |
| `linked` | Download PDF + **Push to dashboard** + **Email via Resend** (if `alert_email_enabled` on client side) |
| `paused` | Same as unlinked (push blocked) |

The "push to dashboard" is the killer UX:

```
Pandit clicks "Share with client" on a deliverable
  → UPDATE pandit_deliverables SET visibility='client_pushed', pushed_at=NOW(), client_user_id=resolved_id
  → INSERT notifications(user_id=client_user_id, kind='pandit_deliverable',
                          payload={deliverable_id, pandit_name, title})
  → If pandit_settings.alert_email_enabled AND client opted in:
      Resend email → "Pandit X shared a [kundali_report] with you"

Client side (/dashboard, Seeker variant):
  - Bell badge increments
  - New "From your Pandits" panel highlights the pushed deliverable
  - Click → opens viewer rendering deliverable.content in client's preferred locale
  - "Acknowledge" button → client_acknowledged_at = NOW()
  - Pandit sees the ack on their deliverables tab
```

### 7.3 PDFs

Existing infrastructure (`src/lib/export/pdf-kundali.ts`, `pdf-panchang.ts`) extended with:

- Letterhead block sourced from `pandit_settings.letterhead_*`, logo from storage URL.
- Signature image on final page.
- Multilingual content: Devanagari / Tamil / Telugu / Bengali / Gujarati / Kannada / Marathi / Maithili require font subsetting (per global CLAUDE.md rule 3 — jsPDF is Latin-1-only). Budget 1+ week for font work in P9.
- Per-deliverable locale override; defaults to `pandit_settings.default_report_locale`.

## 8. Alerts engine

### 8.1 What we detect

Daily cron at 02:00 UTC iterates over all `pandit_clients` rows where `engagement_state IN ('active', 'prospect', 'past')` AND `link_state != 'declined'`. For each:

| Kind | Detection | Severity |
|---|---|---|
| `birthday` | 7 days before, day-of | info |
| `maha_dasha_change` | Within `pandit_settings.alert_lookahead_days` | critical |
| `antar_dasha_change` | Within `alert_lookahead_days` | notable |
| `pratyantar_dasha_change` | Day-of only (opt-in via setting; off on free tier — too noisy) | info |
| `sade_sati_entry` | 7-day-of natal moon's 12th-from sign | critical |
| `sade_sati_peak` | When Saturn moves through natal moon's sign | critical |
| `sade_sati_exit` | When Saturn moves to 2nd-from natal moon | notable |
| `jupiter_aspect_natal` | Jupiter in 5th/7th/9th house from a key natal point | notable |
| `saturn_ingress_natal_house` | Saturn changes house relative to natal lagna | notable |
| `rahu_ketu_ingress` | Nodes change rashi (every ~18mo) | notable |
| `eclipse_impact` | Lunar/solar eclipse within 3° orb of natal moon/sun | critical |
| `birthday_solar_return` | Annual solar return date | info |
| `followup_due` | `pandit_consultations.next_followup_at` reaches today | info |

### 8.2 Idempotency + ack

Unique `(client_record_id, kind, fires_at)` index. Cron uses `INSERT … ON CONFLICT DO NOTHING`. Ack is per-alert per-Pandit (the same Saturn-Capricorn-ingress alert generated for 30 clients is 30 distinct rows, acked individually).

### 8.3 Email channel

- Pandit gets immediate email on `critical` alerts (if `pandit_settings.alert_email_enabled`).
- Pandit gets weekly digest of `notable` alerts on `pandit_settings.digest_day` (default Monday 09:00 in `pandit_settings.default_report_locale`'s typical TZ, but anchored to user's profile timezone if known, else IST).
- `info` alerts surface in dashboard only — no email.

### 8.4 Client-side alerts

If `permissions.send_alerts_to_client === true`:
- `critical` alerts also fire a notification + email to client.
- Wording is client-friendly (e.g., "Your Saturn major period is changing — meaningful shifts ahead").
- Client opt-out via "My Pandits" panel.

### 8.5 Compute budget

At ~5 pandits × ~30 clients each = 150 charts daily = ~22s cron runtime. At ~500 pandits × 100 clients = 50,000 charts ≈ 40 min single-threaded — at that point, parallelise per `[Cron scaling plan]` memory.

## 9. Pandit dashboard surfaces

| Route | Component | Purpose |
|---|---|---|
| `/dashboard` (Pandit variant) | `PanditDashboardHome` | Today: alerts inbox preview, follow-ups due, today's panchang strip, recent client activity, "Add client" button |
| `/dashboard/clients` | `ClientRoster` | List + filters (link state, engagement state, tags, search). Counters: "X total · Y linked · Z managed · cap M/N" |
| `/dashboard/clients/new` | `AddClientForm` | Two-required-field form |
| `/dashboard/clients/[id]` | `ClientDetail` shell | Tab strip: Chart / Family / Consultations / Alerts / Deliverables. Sticky header shows name, both lifecycle badges, last consult |
| `/dashboard/clients/[id]/chart` | `ClientChart` | Embeds existing kundali engine on client.birth_data |
| `/dashboard/clients/[id]/family` | `ClientFamilyTab` | Pandit's family rows + (if linked) supplemental "in client's account" panel |
| `/dashboard/clients/[id]/consultations` | `ConsultationTimeline` | Timeline + log new |
| `/dashboard/clients/[id]/alerts` | `ClientAlertsTab` | Per-client alerts; ack inline |
| `/dashboard/clients/[id]/deliverables` | `DeliverablesTab` | List + generate new + push (if linked) + PDF download |
| `/dashboard/alerts` | `AlertsInbox` | Cross-client alerts. Default filter: severity ≥ notable, unacked. |
| `/dashboard/calendar` | `PanditCalendar` | Calendar overlay: birthdays, dasha sandhis, sade sati phases, follow-ups |
| `/dashboard/settings` | `PanditSettings` | Letterhead, alerts, billing, account_type toggle (back to seeker) |
| `/pandit-invitation/[token]` | `InvitationAcceptPage` | Public-ish (token-gated). Renders invitation card; accept/decline |

Seeker side gets:

| Route | Component | Change |
|---|---|---|
| `/dashboard` (Seeker variant) | unchanged + new "From your Pandits" panel | Pushed deliverables surface here |
| `/dashboard/my-pandits` | `MyPanditsPanel` | List of linked pandits; permission toggles per pandit; revoke link |

## 10. Pricing & cap enforcement

### 10.1 Tiers (final names TBD; price TBD per your direction)

| Tier | `unlinked` cap | `linked` cap | Other |
|---|---|---|---|
| Pandit Free | 5 | Unlimited | Maha+Antar dasha alerts only. PDF download only (with "Powered by Dekho Panchang" footer). |
| Pandit Pro | Unlimited | Unlimited | Full alerts including transits. Push to dashboard. Branded PDF (no footer). |
| Pandit Unlimited | Unlimited | Unlimited | Pro + API + custom alert rules |

`pandit_clients` INSERT trigger counts `WHERE pandit_user_id = NEW.pandit_user_id AND client_user_id IS NULL AND engagement_state != 'archived'`. If `(count + 1) > tier.unlinked_cap` and `NEW.client_user_id IS NULL`, raise exception → API surfaces paywall modal.

Inviting an unlinked client never raises the cap (still counts until accepted). Linking does (client_user_id set → not counted).

### 10.2 Stripe

Add env vars `STRIPE_PRICE_PANDIT_PRO_MONTHLY`, `STRIPE_PRICE_PANDIT_PRO_ANNUAL`, `STRIPE_PRICE_PANDIT_UNLIMITED_MONTHLY`, `STRIPE_PRICE_PANDIT_UNLIMITED_ANNUAL`. Wire to existing `subscriptions` table + tier resolution in `src/lib/subscription/tiers.ts`. The legacy `jyotishi` tier remains addressable for back-compat; new Pandit users get the new tier names.

## 11. Migrations & RLS

All `pandit_*` tables use the standard RLS pattern:

```sql
ALTER TABLE pandit_clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY pandit_clients_owner_select ON pandit_clients
  FOR SELECT USING (pandit_user_id = auth.uid());
CREATE POLICY pandit_clients_owner_insert ON pandit_clients
  FOR INSERT WITH CHECK (pandit_user_id = auth.uid());
CREATE POLICY pandit_clients_owner_update ON pandit_clients
  FOR UPDATE USING (pandit_user_id = auth.uid())
                WITH CHECK (pandit_user_id = auth.uid());
CREATE POLICY pandit_clients_owner_delete ON pandit_clients
  FOR DELETE USING (pandit_user_id = auth.uid());

-- Client-side read-only access for linked clients to see their own deliverables
CREATE POLICY pandit_deliverables_client_read ON pandit_deliverables
  FOR SELECT USING (
    client_user_id = auth.uid() AND visibility = 'client_pushed'
  );

-- Same pattern for pandit_consultations.shared_with_client = true subset
-- (client sees only client_visible_summary; pandit_private_notes is column-level hidden via view)
```

A `pandit_deliverables_for_client` VIEW projects only the safe columns to the client side, avoiding column-level RLS complexity.

Per CLAUDE.md: triggers on `auth.users` (none here) would need `SECURITY DEFINER` + `EXCEPTION WHEN OTHERS`. Our triggers on `pandit_*` tables are standard.

## 12. Phases (P1 → P12)

(Tracked as TaskCreate entries #13–#24. Numbers below match the task IDs.)

| # | Phase | Major deliverables |
|---|---|---|
| P1 | Persona toggle + Pandit dashboard scaffold | `account_type` column, Onboarding question, `PanditDashboardHome`, route swap |
| P2 | Client roster (unlinked path only) | Migration, RLS, `AddClientForm`, `ClientRoster`, `ClientDetail` shell, two-axis badges |
| P3 | Chart engine reuse on client | `ClientChart` tab embeds existing kundali UI; estimated-time flag handling |
| P4 | Client family + synthesis | Family CRUD; family-synthesis with explicit anchor |
| P5 | Consultations + deliverables (PDF) | Consultation log + Deliverables tab + basic letterhead PDF |
| P6 | Invitation flow (linking) | Invitations table, Resend, accept/decline page, signup-with-token, mode transitions |
| P7 | Push deliverables to linked clients | Seeker dashboard "From your Pandits", deliverable viewer, ack flow |
| P8 | Alerts engine | Cron, 13 alert kinds, severity tuning, weekly digest |
| P9 | Branded PDF + 9-locale fonts | Letterhead config + multilingual PDF |
| P10 | Pricing + cap enforcement | Stripe Pandit Pro / Unlimited, cap trigger, paywall modal |
| P11 | Polish + GDPR | Calendar, bulk CSV invite, data export, paused-link UX |
| P12 | E2E QA + merge | Playwright journey, DoD gates, squash-merge |

## 13. Risks

| Risk | Mitigation |
|---|---|
| **Mode confusion in UI** | Two badges on every row; mode is also the left-border colour of cards; mode legend in roster header |
| **Stale Pandit-entered birth data** | `time_estimated` flag mandatory on entry; every computed chart from estimated data shows "approximate" badge |
| **Invitation acceptance rate** | Both email + in-app notification; T+7d + T+14d reminder CTAs on Pandit dashboard; allow Pandit to write personal message at invite |
| **Sign-up friction (Branch B)** | Magic-link → signup with email pre-filled → "finish setup" banner approach rather than blocking on birth data immediately |
| **Spam invitations** | Per-Pandit rate limit (free: 3/day, Pro: 25/day); recipient can flag spam; auto-suspend Pandit after N flags |
| **Pandit revocation breaking history** | Past consultations stay (Pandit-authored); chart references mark deleted client as "Archived (data removed)"; `client_user_id` set NULL |
| **Cap loophole (intended)** | Pandit invites everyone → relieves cap → that's the network-effect feature, not a bug |
| **Two pandits per client** | Allowed; client sees both in "My Pandits"; each pandit only sees their own link |
| **Alert noise on first transit ingress** | Conservative severity defaults; weekly digest opt-out; per-kind mute in settings |
| **PDF multilingual fonts** | Budget 1+ week for font subsetting; Lesson 3 (jsPDF Latin-1-only); test on actual paper output |
| **Family-synthesis assumes `'self'` anchor** | Audit in P4; refactor to take explicit anchor before wiring to client family |
| **Brihaspati billing on client's chart** | Defer to P6 design; surface "billed to Pandit" badge if Pandit triggers Brihaspati on client's chart |
| **Client data ownership at deletion** | RLS `ON DELETE CASCADE` from client_user_id → pandit_clients sets client_user_id NULL (record persists); GDPR-compliant client-side hard delete via existing `gdpr_delete` function |

## 14. Open questions (resolved during build)

These can be re-decided as we go; current direction noted.

1. **Account-type toggle UX** — single Settings toggle is the spec; we can revisit if Pandits want a more explicit "upgrade to Pro" flow.
2. **Default invitation permissions** — all 6 requested by default with client able to untick at accept. Captured in `permissions_requested` JSON.
3. **Existing-user disclosure in invitation** — Pandit's "Invite" UI shows the same "Invitation sent" message regardless of whether the email matched. Pandits can't enumerate accounts.
4. **Re-invite cooldown** — 30 days after `declined` before Pandit can re-fire. After `expired`, immediately re-invitable.
5. **Mode badge UI** — icon + label + colour as in §3.3. Final palette tuned in P2 alongside Storybook entries.
6. **Past deliverables visibility on first link** — defaults visible; Pandit prompted at link-accept time with toggle.
7. **Past/active auto-flip threshold** — 12 months default, configurable per-Pandit in `pandit_settings.past_threshold_months`.

## 15. Definition of Done

A phase is "done" when:

1. tsc clean (`tsconfig.build-check.json`)
2. vitest passes; new tests added for the change
3. `npx next build` succeeds
4. Browser-verified end-to-end for the relevant Pandit journey (per CLAUDE.md DoD item 4)
5. For computation changes (alerts engine): values cross-checked against Prokerala / Shubh Panchang for the same chart + date (per CLAUDE.md DoD item 5)

The branch as a whole is "done" and ready for big-bang squash-merge when:

- All 12 phases pass their individual DoD
- E2E Playwright covers: onboard Pandit → add unlinked client → generate tippanni → invite client → client signs up → link → push deliverable → client acknowledges → alert fires → both sides receive
- No `next build` warnings new in this branch
- spec doc reads true (no drift between code and §3–§11)

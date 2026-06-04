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

---

# Part II — Design system, interaction patterns, robustness

The sections above (§1–§15) define WHAT we're building. The sections below define HOW it FEELS to use. The Pandit persona is older (mid-30s to 70s), reverent of tradition, time-constrained between consultations, and often working from a mobile phone on patchy connectivity. Every design choice below is justified against that user.

## 16. Design philosophy

Four principles that override all later choices on conflict.

### 16.1 Reverence as a first-class design value

The seeker dashboard treats Jyotish as personal guidance. The Pandit dashboard treats it as the Pandit's *practice* — their sacred craft and their livelihood. Visual language must honour this. Specifically:

- **Devanagari + Cinzel typography pairing** continues from the existing app, but heavier — Cinzel headings at higher weights for section dividers, Devanagari subtitles in heading positions where they reinforce identity (the Pandit's own name in script on the dashboard hero, classical text references in Sanskrit).
- **Gold accents are earned**, not decorative. Gold marks the Pandit's authored content (their tippanni, their notes, their signature) and the alerts they are responsible for. UI chrome stays in the existing navy palette.
- **No emoji**, no playful illustrations. Custom SVG icons in the existing icon system. The project rule (CLAUDE.md: "User explicitly dislikes emoji icons") carries here.
- **Sanskrit + English bilingual labels** wherever a Pandit thinks in classical terms — "Mahādaśā / Maha Dasha", "Saade-Saatī / Sade Sati" — never just one. Both are present, English is at the same size as the script.

### 16.2 Obvious workflows for the time-poor

A Pandit between two consultations has 4 minutes to log notes from the prior one and look up the chart for the next. Every screen must answer "what do I do next?" without thinking.

Concrete rules:

- **One primary action per screen.** Large, gold, top-right (desktop) or sticky bottom (mobile). Never two.
- **Progressive disclosure** — show 5 fields by default in any form, "Show more" expands to 20. Smart defaults pre-fill the hidden 15.
- **Inline edit beats modals** for low-stakes fields (tags, label, notes). Modals only for destructive or multi-field actions.
- **Predictable column order** in every table, every card: **Name · Last consult · Current dasha · Status · Actions**. Never reordered.
- **Confirmation modals** for: delete client, push deliverable, revoke link, send invitation. Nothing else.
- **Inline help** — every new concept (link state, engagement state, dasha sandhi, etc.) has a `?` icon next to it that opens a 1-sentence explainer + "Learn more" link to /learn.

### 16.3 Information density without clutter

A Pandit roster with 80 clients should fit on one screen. A client detail page should show the chart, the dasha, the alerts, and the last 3 consultations without scrolling on desktop. Achieved via:

- **Compact card grid** for rosters (avatar + name + dasha + last-consult + status) — 4-up on desktop, 1-up on mobile. Toggle to dense table view available.
- **Sticky context strip** on client detail pages: avatar, name, both lifecycle badges, current Maha+Antar dasha, age, "X days since last consult". Always visible while scrolling.
- **Tabs over sub-routes** for tab-strip content — instant switching, no page load.
- **No nested scrolling.** One scrollable region per page.

### 16.4 Trust through restraint

A Pandit needs to trust that what they see is what they get. Visual restraint communicates this.

- **No animations on data appearance.** Charts fade in gracefully but no scaling, no rotation, no celebratory motion when data loads. Animation is reserved for moments of action (push deliverable, accept invitation).
- **Numeric precision visible.** Dasha dates show full date + time; degrees show 3 decimal places by default with "round" toggle. The Pandit can verify against Jagannatha Hora.
- **Source attribution everywhere.** Ayanamsha used (Lahiri / Raman / KP), planetary positions source, classical text cited for every yoga interpretation — visible in a "Source" hover or footer.
- **Audit trail visible to the Pandit** for their own actions on every client — "Birth time edited 2026-06-15 14:30 IST" surfaces in client detail.

## 17. Visual design system

### 17.1 Palette (extending the existing app)

The project already runs on dark navy (`#0a0e27`) + gold (`#d4a853`) per CLAUDE.md. We extend with semantic colors specific to the Pandit lifecycle.

| Token | Hex | Use |
|---|---|---|
| `bg-primary` | `#0a0e27` | Page background (unchanged) |
| `bg-secondary` | `#111633` | Card / surface background (unchanged) |
| `pandit-violet` | `#5a3aa3` | Pandit identity accent — letterhead, signature, "by Panditji" attribution |
| `pandit-violet-light` | `#8c66d9` | Hover states, active links on Pandit-owned content |
| `client-slate` | `#3a4566` | Client-area chrome (so Pandit can visually distinguish self-content vs client-content at a glance) |
| `state-prospect` | `#7a8499` | Engagement state: prospect |
| `state-active` | `#3aa370` | Engagement state: active |
| `state-past` | `#c79a4a` | Engagement state: past |
| `state-archived` | `#5a6480` | Engagement state: archived |
| `link-unlinked` | `#6b7180` | Link state: unlinked |
| `link-invited` | `#d4a853` | Link state: invited (gold, attention-pulling) |
| `link-linked` | `#3aa370` | Link state: linked (green, healthy) |
| `link-paused` | `#c97a4a` | Link state: paused |
| `link-declined` | `#8a4040` | Link state: declined |
| `alert-info` | `#5a8ad9` | Info-severity alert chrome |
| `alert-notable` | `#d4a853` | Notable-severity alert chrome |
| `alert-critical` | `#d44a4a` | Critical-severity alert chrome |
| `text-primary` | `#e6e2d8` | Body text (unchanged) |
| `text-pandit-author` | `#f0d48a` | Pandit-authored content body text (subtly distinct so Pandit knows "this is my voice") |

All new pandit_* colors added as CSS custom properties + Tailwind tokens. Use opacity-based variants per CLAUDE.md (`bg-pandit-violet/15`, `border-pandit-violet/30`) — never `bg-pandit-violet-100`.

### 17.2 Typography

| Token | Family | Weight | Use |
|---|---|---|---|
| `font-cinzel` | Cinzel | 600–900 | Major headings, Pandit name in identity strip, classical text citations |
| `font-cardo` | Cardo (new — serif companion) | 400–700 | Tippanni body text — long-form reading, classical authority |
| `font-inter` | Inter | 400–600 | UI labels, table content, form fields (existing) |
| `font-devanagari-heading` | Mukta (existing) | 600–800 | Devanagari headings |
| `font-devanagari-body` | Noto Sans Devanagari (existing) | 400–500 | Devanagari body |
| `font-tabular` | Inter, `tabular-nums` | 500 | Dates, times, degrees, dasha periods — numerical alignment |

Cardo is new for the tippanni viewer specifically — gives long-form readings a book-like authority distinct from the UI sans-serif. Bundle hit ~30KB subsetted.

### 17.3 Spacing, motion, density

- **8-pixel base grid.** Spacings: 4, 8, 12, 16, 24, 32, 48, 64. No half-pixel values.
- **Compact roster card:** 280×140px on desktop; 100% × 88px on mobile.
- **Motion timing:** 150ms for hover/focus state changes, 250ms for layout shifts, 400ms for moment-of-action (push deliverable, accept invitation). Easing: `cubic-bezier(0.2, 0, 0, 1)` (Material standard, restrained).
- **No motion on data load** (per §16.4).

### 17.4 Iconography

Continues custom SVG system. New icon families for Pandit dashboard:

- **Lifecycle icons** (link state + engagement state): geometric, glyphic, single-stroke. Drawn at 16px and 24px.
- **Action icons** (push, invite, archive, ack alert): line + accent (gold for primary action, slate for secondary).
- **Astrological motif icons** (dasha sandhi, sade sati phase, eclipse, transit, birthday): each unique, evocative of the event. Drawn at 32px for alert cards.
- **No Lucide for Pandit-specific concepts.** Lucide stays for generic UI (search, settings, etc.) per existing project use.

## 18. Detailed screen designs

ASCII wireframes for the seven most-load-bearing screens. Components named so they map to implementation.

### 18.1 Pandit dashboard home — `/dashboard` (Pandit variant)

```
┌──────────────────────────────────────────────────────────────────────┐
│ Navbar (existing, Pandit pill in user menu)                          │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  शुभं प्रभातम्, पंडित अदित्य जी                                       │
│  Good morning, Pandit Aditya ji          Tuesday, 4 June 2026, 09:14│
│                                                                      │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌──────────────┐  │
│  │ TODAY       │ │ ALERTS      │ │ FOLLOW-UPS  │ │ THIS WEEK    │  │
│  │             │ │             │ │             │ │              │  │
│  │ 7 events    │ │ 3 critical  │ │ 2 due       │ │ 14 events    │  │
│  │ 2 critical  │ │ 6 notable   │ │ 1 overdue   │ │ across 9     │  │
│  │             │ │             │ │             │ │ clients      │  │
│  │ → Open      │ │ → Inbox     │ │ → Calendar  │ │ → Calendar   │  │
│  └─────────────┘ └─────────────┘ └─────────────┘ └──────────────┘  │
│                                                                      │
│  ┌── TODAY'S CRITICAL ALERTS ──────────────────────────────────────┐│
│  │                                                                  ││
│  │  ● Mrs. Sharma — Saturn-Mercury dasha sandhi in 4 days          ││
│  │    Maha Saturn → Maha Mercury, 8 June 2026                      ││
│  │    Mrs. Sharma is currently in Saturn AD; this is a 19-yr shift ││
│  │    [Note] [Open chart] [Draft tippanni] [Snooze]                ││
│  │                                                                  ││
│  │  ● Mr. Patel — Sade Sati peak phase starts tomorrow             ││
│  │    Saturn ingress to Aquarius (his natal moon)                  ││
│  │    [Note] [Open chart] [Draft tippanni] [Snooze]                ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌── TODAY'S PANCHANG ─────────────────────────────────────────────┐│
│  │  Tithi: Krishna Saptami        Nakshatra: Mūla → Pūrva Aṣāḍha   ││
│  │  Vara: Mangalvāra              Yoga: Vyaghata → Harṣaṇa         ││
│  │  Karaṇa: Vaṇij → Viṣṭi         Sunrise: 05:23   Sunset: 19:21   ││
│  │  Rahukāla: 15:32 – 17:05 (avoid)                                ││
│  │  Suggested muhurta windows: 06:48–08:21, 10:45–12:14 [Open]    ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌── RECENT CLIENT ACTIVITY ──────────────────────────────────────┐│
│  │  ◐ Mrs. Sharma   Mahā Saturn / AD Mercury   Last: 2 days ago   ││
│  │    [Reviewed dasha transition; she's worried about job change] ││
│  │                                                                  ││
│  │  ● Ananya Kumar  Mahā Venus / AD Sun       Last: today          ││
│  │    [Pushed annual tippanni to her dashboard — opened ✓]         ││
│  │                                                                  ││
│  │  → View all clients (37)                                        ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│                                              [+ Add client] (sticky) │
└──────────────────────────────────────────────────────────────────────┘
```

**Loadbearing details:**
- Hero greeting personalises with Pandit's name in Devanagari + English, today's date in classical + Gregorian.
- Four KPI cards (today / alerts / follow-ups / week) — instant triage.
- Critical alerts surfaced inline with **the action choices a Pandit needs**: Note (one-tap acknowledge), Open chart, Draft tippanni (auto-fills tippanni with the event context), Snooze.
- Today's panchang strip uses the SEO city by default but switches to the Pandit's profile city if set.
- Recent activity is the Pandit's last 5 client touches — not a full feed, just memory aid.
- The `+ Add client` button is sticky (bottom-right on desktop, bottom-centre on mobile) — always reachable.

### 18.2 Client roster — `/dashboard/clients`

**Default view: visual card grid (similar to existing TarotCard system that user loves).**

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Dashboard                          Clients (37 active · 12 past)   │
│                                                                      │
│ Search: [Mrs Sh______] Filter: [All] [Active] [Past] [Linked] [+]   │
│                                                                      │
│ Sort: [Last consulted ▾]   View: [▦ Cards] [≡ List]   [+ Add client]│
│                                                                      │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐│
│ │              │ │              │ │              │ │              ││
│ │      SP      │ │      MP      │ │      AK      │ │      RG      ││
│ │   (avatar    │ │   (avatar    │ │   (avatar    │ │   (avatar    ││
│ │    or init)  │ │    or init)  │ │    or init)  │ │    or init)  ││
│ │              │ │              │ │              │ │              ││
│ │ Mrs Sharma   │ │ Mr Patel     │ │ Ananya K     │ │ Rajiv G      ││
│ │ Pīṭha 5°10'  │ │ Vṛścika 22°4'│ │ Tula 14°2'   │ │ Kanyā 8°50'  ││
│ │              │ │              │ │              │ │              ││
│ │ MD Sani      │ │ MD Budha     │ │ MD Śukra     │ │ MD Maṅgala   ││
│ │ AD Budha     │ │ AD Guru      │ │ AD Sūrya     │ │ AD Kuja      ││
│ │              │ │              │ │              │ │              ││
│ │ 2 days ago   │ │ 1 week ago   │ │ today        │ │ 18 days ago  ││
│ │              │ │              │ │              │ │              ││
│ │ ● ACTIVE     │ │ ● ACTIVE     │ │ ● ACTIVE     │ │ ◐ PAST       ││
│ │ 🔗 LINKED    │ │ ✎ UNLINKED   │ │ 🔗 LINKED    │ │ 🔗 LINKED    ││
│ │              │ │              │ │              │ │              ││
│ │ ⚠ 1 critical │ │              │ │              │ │              ││
│ └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘│
│                                                                      │
│   ... 33 more clients ...                                            │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

**Card structure (top to bottom):**
- Avatar (uploaded photo, or initials in `pandit-violet` background)
- Name (Cinzel, 16px)
- Janma rasi + degree (tabular-nums, 12px text-text-secondary)
- Current Maha + Antar dasha (Devanagari + English, 13px)
- Last consult relative time
- **Two lifecycle pills side-by-side at bottom** — engagement (left) + link (right)
- Optional alert badge in top-right corner if critical alerts pending

**Hover:** card lifts (subtle, 4px translateY, 250ms), border glows gold. Click → client detail.

**Card actions (long-press on mobile, hover-buttons on desktop):**
- Quick-log consultation
- Push last reading
- Mark followup
- Archive

**List view toggle:** dense table — Name · Rasi · Maha dasha · Antar dasha · Last consult · Status badges · Actions. For Pandits with 200+ clients.

### 18.3 Client detail — `/dashboard/clients/[id]`

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Roster                                                             │
│                                                                      │
│ ╔══ STICKY CONTEXT STRIP (always visible) ═══════════════════════╗  │
│ ║                                                                 ║  │
│ ║  ⓐ  Mrs Sharma                          ● ACTIVE  🔗 LINKED   ║  │
│ ║     Born: 12 Mar 1978, 14:30, Mumbai     [≡ menu]              ║  │
│ ║     Age 48 · Tula 5°10' · MD Saturn · AD Mercury · PD Venus    ║  │
│ ║     Last consult: 2 days ago · Next follow-up: in 5 days        ║  │
│ ║                                                                 ║  │
│ ╚════════════════════════════════════════════════════════════════╝  │
│                                                                      │
│  [Chart] [Family] [Consultations] [Alerts ⚠2] [Deliverables] [Notes]│
│  ━━━━━━                                                              │
│                                                                      │
│  (active tab content — Chart shown by default on first visit)        │
│  ...                                                                 │
└──────────────────────────────────────────────────────────────────────┘
```

**The sticky context strip is the single most important UX element on this page.** It anchors the Pandit's mental model. Showing current dasha + age + last-consult means the Pandit can speak knowledgeably about the client without scrolling.

**Tabs are persistent state per client per session** — if Pandit opens the Alerts tab on Mrs Sharma, it stays on Alerts when they come back.

### 18.4 Chart tab — embedded kundali for Pandit consumption

Differs from the seeker kundali view in three ways:

1. **Side-by-side Rāśi + Navāṁśa charts** by default (seeker default is just Rāśi). Pandit thinks in pairs.
2. **Dasha sandhi indicator strip** below the charts: visual horizontal bar showing the current Maha dasha span, with vertical ticks at each Antar transition. Today is a glowing line on this bar.
3. **Key yogas inline** in a "Yogas active in this chart" rail, with classical citations (BPHS chapter:verse). Click → expand for explanation + remedies.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Chart                                                                │
│                                                                      │
│  ┌─ RĀŚI ─────────────┐  ┌─ NAVĀṀŚA ───────────┐                    │
│  │                    │  │                      │                    │
│  │   (north indian    │  │   (north indian      │                    │
│  │    diamond chart)  │  │    diamond chart)    │                    │
│  │                    │  │                      │                    │
│  └────────────────────┘  └──────────────────────┘                    │
│                                                                      │
│  Current dasha context:                                              │
│  ▰▰▰▰▰▰▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱  (visual progress, 6 / 19 yrs)        │
│  Saturn MD: 2020-08-14 → 2039-08-14                                  │
│  ▰▰▰▱▱▱▱▱  (Mercury AD: 2024-02-15 → 2026-10-23, ends in 5 mo)      │
│                                                                      │
│  ┌── KEY YOGAS IN THIS CHART ─────────────────────────────────────┐ │
│  │                                                                  │ │
│  │  ⚜ Mahābhāgya yoga    — daytime birth, all benefics angular    │ │
│  │     BPHS 36.42        [Open in Patrika] [Sloka]                 │ │
│  │                                                                  │ │
│  │  ⚜ Gajakesari yoga    — Jupiter + Moon in kendra               │ │
│  │     Saravali 32.1     [Open in Patrika] [Sloka]                 │ │
│  │                                                                  │ │
│  │  ⚠ Manglik (medium)   — Mars in 4th from lagna                  │ │
│  │     Mantreśvara 6.43  [Cancellation possibilities] [Sloka]      │ │
│  │                                                                  │ │
│  │  → View all 17 yogas                                            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌── QUICK ACTIONS ────────────────────────────────────────────────┐│
│  │  [Generate tippanni] [Generate kundali PDF] [Find muhurta]      ││
│  │  [Run matching] [Open in Expert view]                           ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

The "Open in Expert view" goes to the existing 8-tab deep dive. The Chart tab itself is the Pandit's one-glance view.

### 18.5 Tippanni viewer + editor — the centerpiece

**This is the Pandit's actual product.** Their voice + the engine's analysis. Highest design polish.

Two modes: **Generate** (engine writes a draft) and **Author** (Pandit edits + signs).

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Mrs Sharma's deliverables                                          │
│                                                                      │
│  Tippanni — Annual reading 2026                  Locale: [Hindi ▾]   │
│  ─────────────────────────                                           │
│                                                                      │
│  Draft (auto-generated 4 minutes ago) [Regenerate] [Author mode]    │
│                                                                      │
│  ┌── LETTERHEAD (preview as it will print) ──────────────────────┐  │
│  │                                                                │  │
│  │     PANDIT ADITYA KUMAR JHA                                    │  │
│  │     Jyotish Acharya, Mumbai                                    │  │
│  │     (logo)                          aditya@dekhopanchang.com   │  │
│  │                                                                │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                      │
│  ┌── BODY ──────────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  श्रीमती शर्मा जी,                                                ││
│  │                                                                  ││
│  │  आपका जन्मांश तुला राशि और मूल नक्षत्र...                          ││
│  │                                                                  ││
│  │  [§ 1. Lagna analysis ✓]                                         ││
│  │  [§ 2. Current dasha — Saturn / Mercury ✓]                      ││
│  │  [§ 3. Year ahead — major transits ✓]                           ││
│  │  [§ 4. Saturn dasha sandhi (8 Aug 2032) ✓]                      ││
│  │  [§ 5. Recommended remedies ✓]                                   ││
│  │  [§ 6. Suggested muhurtas for the year ✓]                       ││
│  │  [+ Add custom section]                                          ││
│  │                                                                  ││
│  │  (each section editable in place; cited slokas linked to learn)  ││
│  │                                                                  ││
│  │  Panditji's signature                                            ││
│  │  ____________________                                            ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌── DELIVERY ──────────────────────────────────────────────────────┐│
│  │                                                                  ││
│  │  [Save draft] [Generate PDF] [▮ Push to Mrs Sharma's dashboard] ││
│  │                            ↑ gold, primary, highlighted          ││
│  │                                                                  ││
│  │  Once pushed, Mrs Sharma will see this in her dashboard          ││
│  │  immediately. She'll get an email if she's opted in.             ││
│  └─────────────────────────────────────────────────────────────────┘│
└──────────────────────────────────────────────────────────────────────┘
```

**Loadbearing details:**

- **Letterhead is visible from the start** as it will print. Pandit's identity surfaces here — this builds confidence that the output is *theirs*.
- **Sections are toggleable** (`✓` checkboxes) — the Pandit can quickly include/exclude what's relevant for this client this year.
- **Inline editing of body text** with rich-text controls (bold, classical quote, citation insert). Saves on every keystroke (debounced 500ms).
- **Push button is the moment-of-action animation:** ~400ms — the page subtly pulses; the deliverable card "lifts off" toward an icon in the top-right (representing the client); a toast confirms "Pushed to Mrs Sharma's dashboard."
- **Inline reassurance copy** under the push button: "Mrs Sharma will see this in her dashboard immediately." Non-tech-savvy Pandits need to understand the mechanism.

### 18.6 Alerts inbox — `/dashboard/alerts`

Triage-first design (Linear-inspired). Three vertical lanes by severity.

```
┌──────────────────────────────────────────────────────────────────────┐
│ ← Dashboard                              Alerts (9 unacked)          │
│                                                                      │
│  Filter: [All clients ▾] [All kinds ▾] [Unacked only ✓]              │
│                                                                      │
│  ┌── CRITICAL (3) ────────────────────────────────────────────────┐ │
│  │                                                                  │ │
│  │  TODAY                                                           │ │
│  │  ▮ Mrs Sharma  · Saturn-Mercury dasha sandhi in 4 days          │ │
│  │    The Mercury AD has shaped her last 2 yrs; Ketu AD begins.    │ │
│  │    8 June 2026, 14:32 IST                                       │ │
│  │    [Open chart] [Draft tippanni] [Note ✓] [Snooze ▾]            │ │
│  │                                                                  │ │
│  │  ▮ Mr Patel  · Sade Sati peak begins tomorrow                   │ │
│  │    Saturn ingress to Aquarius (his natal moon)                  │ │
│  │    5 June 2026, 03:18 IST                                       │ │
│  │    [Open chart] [Draft tippanni] [Note ✓] [Snooze ▾]            │ │
│  │                                                                  │ │
│  │  THIS WEEK                                                       │ │
│  │  ▮ Ananya K  · Solar eclipse impacts natal lagna (3° orb)       │ │
│  │    9 June 2026                                                   │ │
│  │    [Open chart] [Draft tippanni] [Note ✓] [Snooze ▾]            │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌── NOTABLE (4) ─────────────────────────────────────────────────┐ │
│  │  ... 4 alerts ...                                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  ┌── INFO (2) ────────────────────────────────────────────────────┐ │
│  │  ... 2 alerts ...                                                │ │
│  └─────────────────────────────────────────────────────────────────┘ │
│                                                                      │
│  [Mark all critical as noted] [Weekly digest settings →]             │
└──────────────────────────────────────────────────────────────────────┘
```

**Each alert card carries everything needed to act:** what (kind), who (client), when (event date), why (1-sentence context), the four actions. No drilling in just to triage.

### 18.7 Onboarding the Pandit (first sign-in)

A 4-step guided experience after `account_type` set to `pandit`. Not a wizard with progress bar — a series of welcoming cards.

**Step 1 — Welcome reveal:** Full-screen card with Devanagari greeting (`पंडितजी का स्वागत है` — "Welcome, Panditji"), gold accent, brief intro. "Continue".

**Step 2 — Letterhead setup:** Form for name, subtitle ("Jyotish Acharya, Mumbai"), logo upload (optional), default locale. Live preview of letterhead renders on the right as Pandit types. "Save & continue".

**Step 3 — Add your first client:** Pre-filled form with sample data showing what a client record looks like ("e.g., Mrs Sharma, born 12 Mar 1978, 14:30, Mumbai"). Pandit can clear and enter their own, or skip. **The form is visually identical to the production AddClient form** — this is muscle-memory training.

**Step 4 — Tour:** 90-second overlay tour of the four main areas (Roster, Client detail, Alerts, Calendar). Each step shows the actual UI with a highlighting spotlight. Dismissible at any step.

The tour is replayable from Settings (`Tour again` button) — Pandits often skip on first use, want to come back.

### 18.8 Add client modal — sacred-act framing

Not a CRM form. A reverent moment.

```
┌──────────────────────────────────────────────────────────────────────┐
│                                                                      │
│  Add a new client                                              [✕]  │
│  ─────────────────                                                   │
│                                                                      │
│  ┌────────────────────────┐  ┌────────────────────────────────────┐ │
│  │                        │  │ Full name *                        │ │
│  │                        │  │ [_________________________]        │ │
│  │   (LIVE CHART          │  │                                    │ │
│  │    PREVIEW — updates   │  │ Date of birth *                    │ │
│  │    as form is filled)  │  │ [DD] / [MM] / [YYYY]               │ │
│  │                        │  │                                    │ │
│  │                        │  │ Time of birth                      │ │
│  │   (north indian        │  │ [HH] : [MM]  [□ approximate]      │ │
│  │    diamond — empty     │  │                                    │ │
│  │    until date          │  │ Place of birth *                   │ │
│  │    entered, then       │  │ [LocationSearch — type city...]   │ │
│  │    fills planet by     │  │                                    │ │
│  │    planet as fields    │  │ ─── Optional ───                  │ │
│  │    complete)           │  │                                    │ │
│  │                        │  │ Email                              │ │
│  │                        │  │ [_________________________]        │ │
│  │                        │  │ (Want to invite them later? Add)   │ │
│  │                        │  │                                    │ │
│  └────────────────────────┘  │ Tags                               │ │
│                              │ [+ Add tag]                        │ │
│                              │                                    │ │
│                              │ Notes                              │ │
│                              │ [_________________________]        │ │
│                              │                                    │ │
│                              │              [Cancel] [Add client] │ │
│                              └────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────┘
```

**The chart preview is the magic.** As the Pandit types the date, lagna calculates and appears in the diamond. As they refine time, the chart shifts in real time. They feel the engine immediately — even before saving, the chart is alive.

If time is "approximate", the chart preview shows a "houses uncertain" overlay — a soft amber edge — until time is exact or the approximate flag is consciously accepted.

## 19. Interaction patterns

### 19.1 Lifecycle badges are interactive

Each badge is a click-target. Click → small menu:

```
   ● ACTIVE  ▾
   ┌──────────────────┐
   │ ● Active         │ ✓ current
   │ ◇ Prospect       │
   │ ◐ Past           │
   │ □ Archived       │
   │ ────────────────│
   │ Why these states?│ →
   └──────────────────┘
```

Same for link state — except `linked` and `paused` cannot be set by Pandit unilaterally; tooltip explains "Client controls this state."

### 19.2 Inline help — the `?` icon

Anywhere a new concept appears, a circled `?` sits adjacent at half-opacity. Hover/tap → tooltip with:

- 1-sentence plain-language explanation
- "What does this affect?" → 1 sentence
- "Learn more →" → link to /learn or to a Pandit-specific deep-dive page

Concepts that get `?`: link state, engagement state, dasha sandhi, sade sati phase, varga, ashtakavarga totals, ayanamsha choice, time_estimated.

### 19.3 Confirmation pattern

```
┌──────────────────────────────────────────┐
│ Push this reading to Mrs Sharma?         │
│                                          │
│ She'll see it in her dashboard within    │
│ seconds. She'll also get an email if     │
│ she's opted in to Pandit notifications.  │
│                                          │
│ Once pushed, she can revoke this any     │
│ time from her "My Pandits" page.         │
│                                          │
│           [Cancel] [Yes, push it]        │
└──────────────────────────────────────────┘
```

Confirmation copy explains **what happens, when, who controls it after.** Non-tech-savvy users need this. Auto-dismisses cleanly on success with a 3-second toast.

### 19.4 Toasts and success states

- **Toast** for transient confirmations: "Tippanni pushed to Mrs Sharma" with `[Undo]` option (5s window).
- **Inline success** for state changes: "Noted" appears next to an alert with a checkmark + colour shift to muted.
- **Page-level success** for major actions: after first client is added, the roster shows a one-time "Your first client! Try generating a kundali →" banner that dismisses on Pandit interaction.

### 19.5 Loading and error states

- **Skeleton loaders** for all data: card-shaped skeleton on the roster, chart-shaped skeleton on chart load. Never blank screen for >100ms.
- **Optimistic UI** for: tagging, archiving, acking alerts. The change appears instantly; rolls back with a toast if the server rejects.
- **Error states** always offer a way out: "Couldn't reach the server. [Retry] [Save to drafts]" — never a dead-end.

### 19.6 Empty states (every list view)

| List | Empty state |
|---|---|
| Roster (0 clients) | Illustration of a tarot card with a "+" — "Add your first client to begin." Primary CTA. |
| Alerts (0 unacked) | "Quiet skies. No major events for your clients this week." With a soft constellation graphic. |
| Consultations (0 logged) | "No consultations logged yet for Mrs Sharma. [Log first session →]" |
| Deliverables (0 generated) | "Generate Mrs Sharma's first tippanni or kundali report. [Generate →]" |
| Calendar (no events this month) | "Nothing on the horizon this month for your clients." |
| Search (0 results) | "No clients match 'Mrs Sh'. [Add Mrs Sh as a new client?]" — the empty state itself offers the next action. |

### 19.7 Micro-celebrations (used sparingly, restrained)

- **First client added:** brief gold ring expands from the new roster card and dissipates (400ms). Toast: "Welcome, your practice begins."
- **First client linked:** the link badge transitions from gold to green with a soft pulse. Toast: "Mrs Sharma joined your practice."
- **First deliverable pushed:** a brief celestial dot trail from the deliverable card to the top-right icon (representing the client). Toast: "Tippanni pushed."
- **100th consultation logged:** banner: "100 consultations. Your practice grows."

No confetti. No emoji. Reverence over revelry.

## 20. Mobile + accessibility

### 20.1 Mobile design (Pandits often work from phones)

- **Bottom navigation** on mobile only: Home · Clients · Alerts · Calendar · You. Avoids tap targets at the top of the screen which are reachable by thumb only on small phones.
- **Roster cards 1-up** on mobile, full-width.
- **Charts** support pinch-zoom and 2-finger pan. Tap a planet → planet detail sheet from the bottom.
- **Sticky context strip** on client detail collapses to a single line on scroll: just "Mrs Sharma · MD Saturn · 2d ago" — still useful, takes 1 line.
- **Pull-to-refresh** on roster + alerts.
- **Swipe actions** on roster cards: swipe-left for archive, swipe-right for "mark followup".
- **Form fields** target 44px minimum tap height.
- **Bottom-sheet modals** (slide from bottom) instead of centered modals on mobile.

### 20.2 Accessibility

- **WCAG 2.1 AA contrast** on all text + state pills + alert chrome. Our existing dark navy + gold passes; new pandit palette tokens must pass too (`pandit-violet` on `bg-secondary` calculated and verified).
- **Keyboard navigation** for every action — `Tab` order matches visual order, `Esc` closes modals, `/` focuses search, `n` adds new client (per power-user §21.4).
- **Screen reader labels** on all icon-only buttons. State badges read as "Active, currently consulting" — not "green dot".
- **Reduced motion** support — `prefers-reduced-motion` disables card lifts, push animations, micro-celebrations. The dashboard remains functional with motion off.
- **i18n for the dashboard UI itself**: Pandit dashboard available in all 9 active locales. Form labels, button text, empty states, micro-copy — all extracted into next-intl message catalogs from day 1.

### 20.3 Offline + connectivity

The Pandit needs to keep working when the connection is patchy.

- **Service worker caches** the dashboard shell + roster data on first load (existing project SW infrastructure extended).
- **IndexedDB** stores recent client data for offline read. Charts compute client-side from cached birth data (engine already runs in-browser).
- **Optimistic mutations** — adding a client, logging a consultation, acking an alert all succeed in UI immediately and replay to the server when connectivity returns.
- **Visible connectivity indicator** — a small status pill in the navbar shows "Online" / "Reconnecting…" / "Offline (changes saved locally)" so the Pandit knows the state.
- **Failed-to-send queue** — pushes that couldn't reach the server queue up and retry. Pandit can see the queue in Settings.

## 21. Robustness additions

### 21.1 Search architecture

A Pandit with 200 clients needs sub-100ms fuzzy search. Strategy:

- **Client-side index** built from cached roster: name, tags, contact email/phone, birth city. Library: [orama](https://github.com/oramasearch/orama) (~12KB, fast, fuzzy + tolerant of typos).
- **Hot-key:** `/` focuses search instantly.
- **Result types:** clients (primary), past consultations (by date or content), deliverables (by title).
- **Recent searches** persisted per-Pandit.
- **Voice search** on mobile via Web Speech API (Pandits typing Devanagari names on phone keyboard is painful).

### 21.2 Audit log

Every mutation on a client record by the Pandit logs to `pandit_audit_log`:

```sql
pandit_audit_log (
  id UUID PK,
  pandit_user_id, client_record_id,
  action TEXT,           -- 'birth_data_edited', 'invitation_sent', 'link_revoked', 'deliverable_pushed', etc
  diff JSONB,            -- before/after values for fields edited
  ip_address INET, user_agent TEXT,
  created_at TIMESTAMPTZ
);
```

Surfaced as a "History" tab on the client detail page. Pandit can see "Birth time edited 2026-06-15 14:30 IST" — supports their own memory + supports any dispute.

### 21.3 Reading versioning

When a Pandit generates a tippanni and pushes it, the rendered content is **frozen** as `pandit_deliverables.content` (snapshot, not live-recomputed). If the engine later changes (e.g., dasha calculation refinement), the Pandit's already-pushed tippanni doesn't silently change. Pandit can choose to regenerate.

Engine version tracked: `pandit_deliverables.engine_version TEXT` references the build hash from `src/lib/kundali/engine-version.ts` at the time of generation.

### 21.4 Power-user affordances

- **Keyboard shortcuts:**
  - `/` focus search
  - `n` new client
  - `g r` go to roster
  - `g a` go to alerts
  - `g c` go to calendar
  - `j/k` next/prev in lists
  - `Enter` open selected
  - `Esc` close modal
  - `Cmd/Ctrl + S` save current form
- **Bulk actions** on roster (select multiple via `Shift+click` or checkbox toggle): bulk archive, bulk tag, bulk generate annual report.
- **CSV import** of clients (P11).
- **Command palette** (`Cmd/Ctrl + K`) — fuzzy find any action across the app.

### 21.5 Data export

- **Per-Pandit GDPR export** (P11): one-click download of all their data as JSON + CSV.
- **Per-client export**: download all data on one client as PDF + JSON.
- **Backup format documented** so Pandits can self-host if they ever leave the platform.

### 21.6 Telemetry (Pandit dashboard only)

To improve the workflow we need to know where Pandits drop off. Privacy-respecting events:

- `pandit_dashboard.viewed` (just the view event — no PII)
- `pandit_client.added` (mode: linked/unlinked)
- `pandit_invitation.sent`, `pandit_invitation.accepted`, `pandit_invitation.declined`
- `pandit_tippanni.generated`, `pandit_tippanni.pushed`
- `pandit_alert.acked`, `pandit_alert.snoozed`

No content, no PII. Per the project's existing privacy posture, opt-out toggle in Settings.

### 21.7 i18n for Pandit dashboard UI

Every UI string in the Pandit dashboard goes through next-intl. New namespaces:

- `pages.dashboard.pandit` — dashboard surfaces
- `components.dashboard.pandit` — components
- `pages.dashboard.pandit.clients` — client management
- `pages.dashboard.pandit.alerts` — alerts
- `pages.dashboard.pandit.tippanni` — tippanni editor

Devanagari + English bilingual labels noted in §16.1 are first-class — keys exist for both `lablel.en` and `label.hi` even within the same locale, because reverential bilingual rendering is a Pandit-dashboard design rule.

## 22. Empty states + micro-copy

The first 10 minutes for a brand-new Pandit user must feel hand-held. Every empty state is a teaching moment.

### 22.1 Sample first-time experience

1. **Sign up, choose Pandit account_type** → land on Pandit dashboard.
2. **Welcome card** (§18.7 Step 1).
3. **Letterhead setup** (Step 2) — already personalising.
4. **Dashboard home** (empty state): "Welcome, Panditji. Your roster will appear here. Start by adding your first client." with the Add Client CTA glowing. A small skeleton showing what the dashboard *will* look like with data sits beneath, semi-transparent.
5. **Add Client modal** (§18.8) — live chart preview teaches the engine's responsiveness.
6. **First client added** — micro-celebration (§19.7), roster shows one card, a guidance overlay: "Tap your client's card to view their chart, family, and history."
7. **Client detail** — empty Consultations tab says: "No consultations logged yet. [Log first session]"
8. **First consultation logged** — toast: "Saved. Mrs Sharma is now an active client."
9. **First tippanni generated** — guided by section toggles + a "first-time" tooltip on Push button: "When you're ready, tap this to share with Mrs Sharma."
10. **Alert appears** — toast notification with educational copy: "Mrs Sharma has a Saturn dasha transition in 28 days. We'll remind you again as it gets closer."

Each step is one click, with clear copy, no jargon, and an obvious next step.

### 22.2 Micro-copy principles

- Address as "Panditji" in greetings, formal but warm.
- Refer to clients by their full name in confirmations ("Push this reading to Mrs Sharma?") — never "the user" or "the recipient".
- Use **classical names** alongside English for astrological events (Sade Sati / साढ़े साती, Dasha Sandhi / दशा संधि).
- Avoid technical jargon (no "ISR", "API", "endpoint"). Replace with everyday verbs.
- **Reversibility is calming** — always tell the Pandit they can undo: "You can revoke this invitation anytime."

## 23. Onboarding the new Pandit account — detailed

In addition to §18.7 above, three reinforcement moments in week 1:

- **Day 2 email digest:** "Welcome to your practice on Dekho Panchang. Tips for getting started: [Add 5 more clients] [Invite your existing clients]"
- **Day 7 email if no clients added:** "Need help getting started? Reply to this email or use the [in-app help]."
- **Day 14 in-app banner:** "You've added 12 clients — beautiful. Did you know you can invite them to claim their accounts? [Tour invitations]"

These nudge without nagging. Off by default in Settings if Pandit prefers silence.

## 24. Component library plan

To keep the Pandit dashboard internally consistent and to keep code reuse high, we build a small set of Pandit-specific components in addition to the existing shared library.

| Component | Purpose | Reuse target |
|---|---|---|
| `PanditCard` | Roster card (avatar + name + dasha + last consult + lifecycle badges) | All roster surfaces |
| `LifecycleBadgePair` | Two pills side-by-side (engagement + link) with click → menu | Roster, client detail header, anywhere a client is referenced |
| `StickyContextStrip` | Always-visible client identity strip with collapsing behaviour | Every client subpage |
| `AlertCard` | Card showing one alert with all 4 actions inline | Alerts inbox, dashboard home, client alerts tab |
| `DashaProgressBar` | Visual horizontal bar of Maha + Antar dasha spans with today marker | Client chart tab, sticky strip, alert cards |
| `TippanniSection` | Toggleable section in tippanni editor with inline rich-text + classical citation | Tippanni editor |
| `LivePreviewChart` | Mini chart that updates as form fields change | Add Client modal, edit birth data form |
| `LetterheadPreview` | Renders Pandit's letterhead as it will appear on PDFs | Settings, tippanni editor, deliverables tab |
| `KpiCard` | Small dashboard tile with number, label, "Open →" link | Pandit dashboard home |
| `EmptyStateCard` | Illustration + heading + body + primary action | Every empty list view |
| `ConfirmModal` | Standardised confirmation pattern (what / when / who controls it after) | All destructive actions, all pushes |
| `InlineHelpTooltip` | `?` icon with structured tooltip (1-sentence explanation + "Learn more →") | Anywhere a new concept appears |
| `ConnectionStatusPill` | Small navbar pill: Online / Reconnecting / Offline | Navbar (Pandit variant only) |

All built in Storybook with isolated stories so the visual design can be reviewed independently of the wiring. Storybook is added to the project at the start of P1 if not already present.

Each component built once, tested in isolation, used everywhere. No bespoke one-off styling per page.

## 25. Updated phases (additions to §12)

The original 12 phases focused on capability. We now layer the design execution explicitly:

| Phase | Addition |
|---|---|
| P1 | + Storybook setup + Pandit design tokens (colours, type scale) + KpiCard, LifecycleBadgePair, EmptyStateCard, InlineHelpTooltip components in Storybook before wiring |
| P2 | + PanditCard, StickyContextStrip components; the Add Client modal with LivePreviewChart |
| P3 | + DashaProgressBar component; Chart tab layout (rasi + navamsa side-by-side, key yogas rail) |
| P4 | + Pandit's family rendering using existing FamilyCard with Pandit-tinted chrome |
| P5 | + TippanniSection + LetterheadPreview; tippanni editor screen |
| P6 | + Invitation acceptance page design (gold reveal moment for new sign-ups) |
| P7 | + AlertCard component; "From your Pandits" panel on seeker dashboard |
| P8 | + AlertsInbox layout (3-lane triage) |
| P9 | + Multilingual PDF layout including letterhead |
| P10 | + Pricing page for Pandit Pro (consumer-facing landing + in-product upsell modal) |
| P11 | + Onboarding the new Pandit (4-step welcome flow) + email digest templates |
| P12 | + Accessibility audit (keyboard navigation + screen reader + reduced-motion + 9-locale render check) |

## 26. Inspirations and references

For implementation polish, here are the products this dashboard borrows from:

- **Linear** — alerts inbox triage, command palette, keyboard shortcuts, restraint
- **Notion** — inline editing, predictable structure, blocks that compose
- **Stripe Dashboard** — confirmation modals that explain what will happen
- **Superhuman** — keyboard-first power-user affordances
- **Apple Mail (iPad)** — swipe actions on list items
- **Things 3** — typography restraint, careful spacing, motion economy
- **The existing Dekho Panchang** — tarot cards, gold-on-navy palette, custom SVG iconography, the trust-by-restraint posture we already have

The end result should feel like a natural extension of the existing app, not a different product bolted on.

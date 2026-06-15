# WhatsApp Daily Panchang — Design Doc

**Status:** Draft, awaiting decisions
**Author:** Aditya Jha (drafted with Claude)
**Date:** 2026-06-15
**Ship target:** ~3 days of focused work after decisions land

---

## 1. Goal & success metrics

**Goal:** Close the retention loop. Today, a user signs up, generates a kundali once, and disappears. WhatsApp daily panchang puts us in their notification tray every morning — the channel they actually open.

**Why WhatsApp over email:**
- Email open rate for Indian audience: 8–12%
- WhatsApp message read rate: 70–98% (Meta's own benchmark, varies by category)
- Indian users on WhatsApp daily; Google Play data shows >500M Indian DAU
- Viral leg: users forward daily-panchang messages to family groups, especially festival days

**Success metrics (90-day window after launch):**

| Metric | Target |
|---|---:|
| Opt-in rate (signed-up users → WhatsApp opt-in) | ≥25% |
| 30-day retention (% still opted-in 30 days after enabling) | ≥80% |
| Click-through to site from WhatsApp links | ≥10% of recipients/day |
| Forwarded count (WhatsApp's own metric) | ≥0.5/message |
| New signups attributed to WhatsApp share links | ≥15/month |

**Anti-goal:** This is NOT marketing/promotional messaging. Strictly **utility** category: today's tithi, nakshatra, festival alerts, auspicious times. Marketing-tier messages would trip Meta's spam classifier and risk the WABA.

---

## 2. User journey

### Persona A: Existing signed-up user (the first cohort, 126 today)
1. Sees a banner on `/dashboard` after next login: "Get your daily panchang on WhatsApp — free"
2. Clicks → flow asks for phone number with country code, locale preference (defaults to UI locale), preferred send-time bucket (sunrise / early morning fixed / evening)
3. We send a WhatsApp template message: "Reply YES to confirm daily panchang from Dekho Panchang"
4. User replies YES → opt-in confirmed, first message scheduled for tomorrow

### Persona B: New signup
- Same opt-in card surfaced in the existing onboarding nudge flow (PR #673 work) as Step 4 after kundali save

### Persona C: Anonymous visitor (out of scope for v1)
- Could be added later: "WhatsApp me today's panchang" without signup, but requires resolving location via geo + adds spam risk

---

## 3. Architecture overview

```
┌────────────────────────────────────────────────────────────────┐
│  Browser / Dashboard                                           │
│    Opt-in UI (React component)                                 │
│      → POST /api/whatsapp/optin {phone, locale, send_time}     │
│      → POST /api/whatsapp/verify {phone, otp}                  │
│      → DELETE /api/whatsapp/optout                             │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Next.js API routes                                            │
│    /api/whatsapp/optin → row in user_whatsapp_subscriptions   │
│      → triggers WhatsApp verification template send            │
│    /api/whatsapp/verify → flips verified_at                    │
│    /api/whatsapp/optout → soft-delete + reply STOP handler     │
│    /api/whatsapp/webhook → inbound replies + delivery receipts │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  Supabase Postgres                                             │
│    user_whatsapp_subscriptions  ← who, when, locale           │
│    whatsapp_send_log            ← idempotency + cost tracking │
│    whatsapp_inbound_log         ← replies (STOP / queries)    │
└────────────────────────────────────────────────────────────────┘
                            ▲
                            │
┌────────────────────────────────────────────────────────────────┐
│  Vercel Cron — hourly                                          │
│    /api/cron/whatsapp-daily-panchang                           │
│      For each subscription whose local send-time matches NOW:  │
│        1. compute panchang for their lat/lng + locale          │
│        2. render WhatsApp template body                        │
│        3. POST to WhatsApp Cloud API                           │
│        4. write whatsapp_send_log row (idempotency key)        │
└────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────────────┐
│  WhatsApp Cloud API (Meta direct) or Aggregator                │
│    Template message delivery                                   │
│    Inbound webhook → /api/whatsapp/webhook                     │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Data model

### Migration: `080_whatsapp_subscriptions.sql`

```sql
CREATE TABLE user_whatsapp_subscriptions (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  phone_e164          TEXT NOT NULL,           -- e.g. "+919876543210"
  locale              TEXT NOT NULL,           -- en/hi/ta/te/bn/gu/kn/mai/mr
  timezone            TEXT NOT NULL,           -- IANA, e.g. "Asia/Kolkata"
  send_time_local     TIME NOT NULL,           -- e.g. "06:00:00" — bucketed to top of hour
  send_at_sunrise     BOOLEAN NOT NULL DEFAULT FALSE,  -- overrides send_time_local
  -- Verification
  verification_code   TEXT,                    -- 6-digit OTP we send
  verification_expires_at TIMESTAMPTZ,
  verified_at         TIMESTAMPTZ,             -- NULL = pending verification
  -- Lifecycle
  opted_in_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  opted_out_at        TIMESTAMPTZ,             -- NULL = active; non-NULL = stopped
  opt_out_reason      TEXT,                    -- 'user_reply_stop' | 'user_dashboard' | 'whatsapp_bounce'
  -- Index hygiene
  CONSTRAINT phone_e164_format CHECK (phone_e164 ~ '^\+[1-9][0-9]{6,14}$'),
  CONSTRAINT one_active_per_user UNIQUE (user_id) WHERE opted_out_at IS NULL,
  CONSTRAINT one_active_per_phone UNIQUE (phone_e164) WHERE opted_out_at IS NULL
);

CREATE INDEX idx_wa_subs_active_by_hour
  ON user_whatsapp_subscriptions (timezone, send_time_local)
  WHERE verified_at IS NOT NULL AND opted_out_at IS NULL;

-- Idempotent send log: one row per (subscription, panchang_date) pair
CREATE TABLE whatsapp_send_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID NOT NULL REFERENCES user_whatsapp_subscriptions(id) ON DELETE CASCADE,
  panchang_date   DATE NOT NULL,
  sent_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  whatsapp_message_id TEXT,                    -- Meta-assigned ID for delivery receipts
  template_name   TEXT NOT NULL,               -- e.g. 'daily_panchang_v1'
  template_lang   TEXT NOT NULL,               -- e.g. 'en' / 'hi'
  status          TEXT NOT NULL DEFAULT 'pending', -- pending/sent/delivered/read/failed
  failure_code    TEXT,
  failure_message TEXT,
  cost_micros     BIGINT,                      -- estimated cost in micro-USD (1e-6 USD)
  CONSTRAINT one_send_per_day UNIQUE (subscription_id, panchang_date)
);

CREATE INDEX idx_wa_log_recent ON whatsapp_send_log (sent_at DESC);

-- Inbound replies (STOP, queries, etc.)
CREATE TABLE whatsapp_inbound_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164      TEXT NOT NULL,
  message_body    TEXT,                        -- redacted/truncated for privacy
  classification  TEXT,                        -- 'stop' | 'help' | 'other'
  received_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS: users can read/write only their own subscription row
ALTER TABLE user_whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY whatsapp_subs_self_read ON user_whatsapp_subscriptions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY whatsapp_subs_self_write ON user_whatsapp_subscriptions
  FOR ALL USING (auth.uid() = user_id);
-- service_role bypasses RLS, so cron + webhook handlers work.
```

### Rationale for design choices

- **`one_active_per_user` unique constraint** — a user can only have one active opt-in at a time. If they want to change phone number, the old one is opted-out, new one added.
- **`one_active_per_phone` unique constraint** — prevents a phone number being subscribed via two different user accounts (spam risk).
- **`one_send_per_day` on send_log** — guarantees idempotency. If cron retries within the same hour, no double-send.
- **`send_time_local` as TIME + `timezone` as TEXT** — natural model for "6 AM in their timezone." Cron picks rows where `(timezone, send_time_local)` hashes to current UTC hour.
- **`send_at_sunrise` boolean** — alternative for users who want it tied to their local sunrise (most relevant astrologically). Requires per-user sunrise computation each day; cron groups these into hourly buckets at ingest time.
- **`cost_micros`** — track per-message cost so we can roll up budget without external billing system. Estimated at send time based on provider's published rates.

---

## 5. Provider selection — **OPEN DECISION #1**

### Option A: WhatsApp Cloud API (Meta direct)
- **Setup**: Free (need Meta Business Verification — 1–3 day approval)
- **Phone number**: Free (or BYO existing number); Meta provides a test number first
- **Pricing model (post-July 2025)**: Per-message, by category × destination market.
  - **Utility messages, India (where most of our users are)**: ~$0.012–0.014 per message (₹1.0–1.2)
  - **Utility messages, US/EU**: ~$0.020–0.040 per message
  - **Authentication (OTP) messages, India**: ~$0.0095 (₹0.8)
  - **Free tier**: 1000 free service conversations per WABA per month (service = user-initiated within 24h; not our use case for outbound daily)
- **Pros**: Lowest per-message cost, direct relationship with Meta, no markup, full webhook fidelity
- **Cons**: More setup paperwork (template approval, WABA verification), no support team
- **Cost at scale**:
  - 100 users × 30 days = 3000 messages → **~$36/mo** (India-heavy)
  - 1000 users × 30 days = 30,000 messages → **~$360/mo**
  - With 95% India / 5% diaspora mix the multiplier is ~1.1×

### Option B: Twilio WhatsApp (wrapper around Meta)
- **Setup**: ~30 min via Twilio Console, but still requires Meta WABA approval underneath
- **Pricing**: Meta cost + Twilio markup (~$0.005/msg) + Twilio monthly fee ($0)
- **Pros**: Better DX, status callbacks normalised, good error messages
- **Cons**: ~30–40% more expensive per message vs Meta direct, dependency on third-party

### Option C: Indian aggregator (AiSensy / Wati / Interakt)
- **Setup**: Easiest — 1-day onboarding, they handle WABA paperwork
- **Pricing**: Flat platform fee (₹999–2,999/mo, ~$12–35) + per-message at near-Meta cost
- **Pros**: Fastest path to live, Indian customer support, often include WhatsApp Catalog / template builder UI
- **Cons**: Vendor lock-in, less flexible webhooks, monthly fee even with 0 messages

### Recommendation

**Start with Option A (Meta Cloud API direct)**:
1. We're engineers, the setup paperwork is one-time
2. Lowest per-message cost matters at our cost ceiling (see §11)
3. No vendor lock-in for the data model — we can move to aggregator later if needed
4. Direct webhook access for inbound replies (critical for STOP handling)

If the WABA verification stalls or template approval drags >7 days, **fall back to AiSensy** (Option C) — they're fastest for Indian market and accept payment in INR.

---

## 6. Cost model — **OPEN DECISION #2**

| Scenario | Active users | Msgs/mo | Est. monthly cost | Annual |
|---|---:|---:|---:|---:|
| Pilot (current cohort × 25% opt-in) | 30 | 900 | **$11–13** | $130 |
| 3-month organic | 200 | 6,000 | **$72–90** | $900 |
| If WhatsApp drives a 2× signup acceleration (likely) | 1,000 | 30,000 | **$360–450** | $4,500 |
| 1-year aggressive | 5,000 | 150,000 | **$1,800–2,250** | $22,000 |

**Hard budget cap (proposed):** $50/mo for first 60 days. If we approach 80% of cap in any day, auto-disable new sends (existing subscribers continue), notify operator (Aditya), and review.

**Implementation:**
- Daily rollup job `/api/cron/whatsapp-cost-rollup` computes month-to-date cost from `whatsapp_send_log.cost_micros`
- If MTD > 80% of cap, set feature-flag `WHATSAPP_DAILY_SENDS_PAUSED=true` in env (or DB column on `feature_flags` table)
- Cron checks flag before each send

---

## 7. Template message designs

### 7.1 Verification (OTP) template — `whatsapp_otp_v1`

```
Hi {{1}}, your Dekho Panchang verification code is *{{2}}*.
Valid for 10 minutes. Reply STOP to opt out.
```

Variables: `{{1}}` = first_name, `{{2}}` = 6-digit code. **Category: authentication.**

### 7.2 Daily panchang template — `daily_panchang_v1`

```
🕉 *{{1}}* — Dekho Panchang

📅 {{2}}    📍 {{3}}
🌅 Sunrise: {{4}}    🌇 Sunset: {{5}}

🌙 Tithi: {{6}}
✨ Nakshatra: {{7}}
🎯 Yoga: {{8}}

{{9}}

🔗 Full details: dekhopanchang.com/{{10}}/panchang

Reply STOP to unsubscribe.
```

Variables:
- `{{1}}` = locale-appropriate "Today" / "आज" / "আজ" etc.
- `{{2}}` = formatted date in user's locale
- `{{3}}` = city name in user's locale
- `{{4}}–{{5}}` = sunrise/sunset times in 24h local format
- `{{6}}–{{8}}` = tithi/nakshatra/yoga with end-times
- `{{9}}` = highlight slot: festival name OR auspicious window OR muhurta OR rahu kaal
- `{{10}}` = locale slug for the deep-link

**Category: utility.**

**Per-locale variants:** submit one template per locale to Meta. They're approved independently. v1 = en + hi (covers ~60% of users); ta/te/bn/gu/kn/mai/mr land in v2.

### 7.3 Localized template body — same structure, translated header line + the "Reply STOP" footer

(See §13 implementation note.)

---

## 8. Scheduling design

### Time-of-day options offered to user

| Option | Behavior | Locale label |
|---|---|---|
| **At sunrise** (default for new opt-ins) | Computed per user per day, rounded to nearest hour bucket | "At sunrise" |
| **6 AM local** | Fixed clock time | "Early morning (6 AM)" |
| **8 AM local** | Fixed clock time | "Morning (8 AM)" |
| **6 PM local** | Fixed clock time | "Evening (6 PM)" |

### Cron schedule

- **Vercel Cron**: `/api/cron/whatsapp-daily-panchang` runs **every hour at :05** (5 min past hour, gives time for upstream panchang precompute)
- Cron logic:
  1. Compute current UTC hour
  2. For each (timezone, send_time_local) bucket whose local-clock matches current UTC hour, fetch subscriptions
  3. For each subscription with `send_at_sunrise=true`, compute today's sunrise in their tz, send if sunrise hour == current hour
  4. Insert into `whatsapp_send_log` with `ON CONFLICT (subscription_id, panchang_date) DO NOTHING` (idempotency)
  5. Send via WhatsApp API
  6. Update `whatsapp_send_log.whatsapp_message_id` + `status` + `cost_micros`

### Rate-limit handling

WhatsApp Cloud API allows ~80 messages/second per phone number for utility tier. Our daily peak is bounded by total subscribers × (1/24h cron spread) — easily under limit until ~6,000 active subscribers.

If we hit limits, the cron uses an in-memory queue with 50 ms between sends.

---

## 9. Compliance & legal

### Required before launch
1. **Privacy policy update**: WhatsApp data processing disclosed (phone number, opt-in timestamp, send log)
2. **Terms of service update**: WhatsApp opt-in section
3. **Meta opt-in proof**: when user opts in, log the source (`dashboard_card` / `onboarding_step_4`) + timestamp + IP. Meta can audit.
4. **Explicit consent UI**: checkbox "I agree to receive a daily WhatsApp message at the time I select" — not pre-checked.
5. **Clear opt-out**: reply STOP works automatically (Meta enforces); also a one-click button in the dashboard.
6. **Indian DPDP Act compliance**: we already handle PII via Supabase RLS; phone number is additional PII to disclose.

### Out-of-scope for v1 (potential later)
- DPDP-required data processing officer (DPO) — only required for large data fiduciaries
- WhatsApp Marketing tier (would require Marketing Opt-in checkbox, which is separate from Utility)

---

## 10. Failure & rate-limit handling

| Failure | Detection | Handling |
|---|---|---|
| Invalid phone number | Meta returns 400 with code 131026 | Set `opted_out_at = now()`, `opt_out_reason = 'invalid_number'`. Notify user via email. |
| User blocked us | Meta returns 400 with code 131047 | Same as above with reason `'blocked'` |
| User-side WhatsApp account deleted | Meta returns 400 with code 131051 | Set `opted_out_at`, reason `'account_deleted'` |
| Template paused by Meta | Meta returns 400 with code 132000 | Operator alert; pause all sends until template re-approved |
| Rate limit (429) | Meta returns 429 | Exponential backoff; retry up to 3× over 60s; if still failing, leave `whatsapp_send_log.status = 'pending'` for next cron tick |
| Cost cap exceeded | Pre-check before send | Skip send; log row with status='skipped_budget'; operator alert |

---

## 11. Cost monitoring & budget cap

Daily rollup query (added to `/api/cron/daily-rollup` or new cron):

```sql
SELECT
  date_trunc('month', sent_at) AS month,
  SUM(cost_micros) / 1e6 AS cost_usd,
  COUNT(*) AS messages,
  COUNT(*) FILTER (WHERE status = 'failed') AS failed
FROM whatsapp_send_log
WHERE sent_at > date_trunc('month', now())
GROUP BY 1;
```

If MTD `cost_usd` > 0.8 × `WHATSAPP_MONTHLY_BUDGET_USD` (env var, default 50):
- Set `feature_flags.whatsapp_daily_sends = false`
- Send operator email via existing `notifyOperator()` infra
- Cron logs row with `status = 'skipped_budget'`

---

## 12. Phased delivery plan

### Phase 0 — Spec + decisions (this doc) — ~½ day
- ✅ This document
- ⏸ Get user input on Open Decisions §1, §2 below
- ⏸ Confirm provider choice; if Meta direct, start WABA verification (user-action, async wait 1–3 days)

### Phase 1 — Foundation — ~1 day
- Migration `080_whatsapp_subscriptions.sql` + types
- WhatsApp API client wrapper `src/lib/whatsapp/client.ts`
- Template definitions `src/lib/whatsapp/templates.ts` (en + hi)
- Privacy policy + terms updates
- Operator-side: WABA setup + template approval submission (manual, async)

### Phase 2 — Opt-in flow — ~1 day
- API routes: `/api/whatsapp/{optin,verify,optout}` + `/api/whatsapp/webhook`
- Dashboard component `<WhatsAppOptInCard />` with phone input, verification step, send-time picker
- Onboarding integration (Step 4 in PR #673 flow)

### Phase 3 — Delivery cron — ~½–1 day
- `/api/cron/whatsapp-daily-panchang` route
- `vercel.json` cron entry `0 * * * *` (hourly)
- Per-locale message renderers `src/lib/whatsapp/render-daily.ts`
- Idempotency + cost logging

### Phase 4 — Cost monitoring + opt-out polish — ~½ day
- `/api/cron/whatsapp-cost-rollup` + budget cap enforcement
- Inbound webhook STOP-keyword detection → opt-out
- Operator alert email
- Dashboard "Manage WhatsApp" section showing opt-in date, change time, opt-out button

### Phase 5 — Launch — ~½ day
- Soft-launch banner to existing 126 users via dashboard
- 7-day monitoring window
- Iterate on send-time defaults, message body, opt-in copy based on first-cohort behavior

**Total committed: ~3.5 days of build + 1–3 days async waiting on Meta approval**

---

## 13. Implementation notes

- **Sunrise computation** — already in `src/lib/ephem/sunrise.ts`. Hourly cron picks subscriptions whose computed sunrise hour matches current UTC hour.
- **Per-locale message strings** — reuse the `tl()` + LocaleText pattern from the regional pages PR #687. Template variable substitution happens in `render-daily.ts`.
- **Phone-number normalization** — use `libphonenumber-js` (existing dep) for E.164 conversion.
- **OTP generation** — `crypto.randomInt(100000, 999999)`; store hash in `verification_code`, not raw.
- **Webhook signature verification** — Meta signs payloads with `X-Hub-Signature-256`; verify against `META_APP_SECRET` before processing.
- **Feature flag** — Reuse existing `feature_flags` table pattern or env var `WHATSAPP_DAILY_SENDS_ENABLED`. Cron checks before each batch.

---

## 14. Open decisions for user input

Before Phase 1 build starts, please confirm:

### Decision #1 — Provider
- [ ] **(A) WhatsApp Cloud API (Meta direct)** — lowest cost, ~30% more setup work, recommended
- [ ] (B) Twilio WhatsApp — 30% markup, slightly better DX
- [ ] (C) AiSensy/Wati/Interakt aggregator — fastest, ₹999+/mo platform fee

### Decision #2 — Monthly budget cap (first 60 days)
- [ ] $50/mo — supports ~4,000 messages (~130/day) — recommended for pilot
- [ ] $100/mo — supports ~8,000 messages
- [ ] $200/mo — supports ~16,000 messages
- [ ] Custom: _____

### Decision #3 — Phone number for WhatsApp Business
- [ ] Use your existing personal/work mobile (fastest, less ideal for brand separation)
- [ ] Buy a dedicated Indian number (≈₹500 setup, segregated, more professional)

### Decision #4 — Soft-launch cohort
- [ ] Open immediately to all signed-up users (~126 today)
- [ ] First 25 users in a closed beta (Aditya hand-picks), then broaden
- [ ] Restrict to one locale initially (e.g. en + hi only, add ta/te/bn/etc in Phase 5+)

---

## 15. Out-of-scope for v1 (parked)

- **Two-way conversational AI in WhatsApp** (e.g. "ask Brihaspati") — separate spec, requires per-conversation pricing model + AI quota integration
- **Push notifications via PWA** — alternative retention channel, address separately
- **Group broadcast** (e.g. family group panchang) — Meta restricts; requires separate Marketing tier
- **Festival-day promotional messages** — Marketing tier, separate consent
- **WhatsApp Catalog / commerce** — for yantra/gemstone sales — separate spec, would need order management
- **Multi-channel preferences** (user picks email + WhatsApp + SMS) — add later if needed

---

## 16. References

- WhatsApp Business Platform pricing: https://developers.facebook.com/docs/whatsapp/pricing/
- WABA setup guide: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- Template message guidelines: https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates
- Meta opt-in best practices: https://www.whatsapp.com/legal/business-policy/

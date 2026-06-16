# WhatsApp Business Account (WABA) Setup — Operator Runbook

**Audience:** Aditya (operator)
**Purpose:** One-time setup of Meta WhatsApp Cloud API for daily-panchang delivery
**Time estimate:** ~2 hours of your active time + 1–3 days async waiting on Meta approvals
**Cost:** ₹500 SIM + ₹150 first recharge ≈ $9 one-time; $0/mo from Meta to start

This runbook is the **prerequisite** for Phase 2 (opt-in UI) and Phase 3 (delivery cron) to work in production. The code can be built and tested with Meta's test number (free, capped at 5 recipient numbers) before the real WABA is approved.

---

## Step 1 — Buy a dedicated Indian SIM (~30 min, do this first)

You can use any Indian carrier; common choices: Airtel, Jio, Vi.

Recommendation: **Airtel Prepaid**, ₹399 unlimited 28-day pack. Walk into any Airtel store with Aadhaar; KYC takes 15 min, SIM active in ~2 hours.

**Critical:** the number must NOT be currently registered as a WhatsApp account. If you reuse a number, you have to first delete its existing WhatsApp account (Settings → Account → Delete account) and wait 30 days. So buy fresh.

Record:
- [ ] Phone number (E.164 format, e.g. +91XXXXXXXXXX) → save in 1Password or similar
- [ ] SIM activation date

---

## Step 2 — Create Meta Business Manager account (~15 min)

If you already have a Meta Business Manager for the Dekho Panchang Facebook/Instagram presence, use that. Otherwise:

1. Go to https://business.facebook.com/overview
2. Click **Create Account**
3. Business name: `Dekho Panchang`
4. Your name: `Aditya Jha`
5. Business email: a dedicated address (suggest `business@dekhopanchang.com` if you have it; otherwise `aditya.kr.jha@gmail.com`)
6. Complete the 5-step business verification:
   - Business legal name (your sole proprietorship / company name)
   - Address (Switzerland address works fine — Meta doesn't require India incorporation for WABA)
   - Business website: `https://dekhopanchang.com`
   - Business phone: the Indian number from Step 1 (or your existing Swiss mobile, doesn't matter much here)

You'll get an email when Business Verification completes. **This step can take 1–5 days.** Meta will request 1–2 documents:
- Personal ID (passport / Aadhaar)
- Business proof (utility bill / bank statement showing the business name OR a domain ownership proof — `dekhopanchang.com` WHOIS works if your name is on it)

---

## Step 3 — Create a Meta App (~10 min)

This is the dev-facing API container that the daily-panchang cron will authenticate against.

1. Go to https://developers.facebook.com/apps
2. Click **Create App** → **Other** (NOT Consumer or Business — counter-intuitive but correct for WABA standalone)
3. App type: **Business**
4. App name: `Dekho Panchang WhatsApp`
5. Business Manager: select the one from Step 2
6. After creation, in left sidebar: **Add Products** → find **WhatsApp** → **Set Up**
7. Meta provisions a **test phone number** for you immediately (looks like +1 555-xxxxxxx) — you can send to up to 5 recipient numbers for free, no template approval needed. This is what we'll use for dev/testing while WABA verification is pending.

Record:
- [ ] App ID
- [ ] App Secret (Settings → Basic → Show App Secret)
- [ ] Test phone number ID (WhatsApp → API Setup)
- [ ] Test phone number (Meta-issued)
- [ ] System User access token (permanent; see Step 4)

---

## Step 4 — Generate a permanent System User access token (~10 min)

The default token Meta hands you on the API Setup page expires in 24 hours — fine for testing, fatal for production cron. Create a System User and grant it permanent access:

1. https://business.facebook.com/settings/system-users
2. Click **Add** → name: `dekhopanchang-cron`, role: `Admin`
3. Click the new user → **Add Assets** → select your WhatsApp Business Account + Meta App
4. Click **Generate New Token**:
   - App: select the App from Step 3
   - Expiration: **Never**
   - Permissions: `whatsapp_business_management`, `whatsapp_business_messaging`
5. **Copy the token immediately** — Meta won't show it again. Save in 1Password / Vercel env vars.

Record:
- [ ] System User permanent access token → goes into `WHATSAPP_ACCESS_TOKEN` env var

---

## Step 5 — Register the dedicated Indian number with WhatsApp Cloud API (~30 min)

This is where the Indian SIM from Step 1 enters the system.

1. In Meta App → WhatsApp → API Setup → click **Add phone number**
2. Enter the Indian E.164 number
3. Verification choices: **SMS** or **Voice call** — SMS works on Indian numbers
4. Enter the 6-digit code Meta sends to your number → number is verified
5. Display name: `Dekho Panchang` (the user-visible profile name)
6. Profile photo: upload the existing logo at `public/icons/icon-512x512.png`

Wait for Meta's display-name approval (typically a few hours, sometimes 1–2 days). Once approved, this is your live production WABA number.

Record:
- [ ] Production phone number ID (different from test number ID)

---

## Step 6 — Submit message templates for approval (~20 min active, 24–48h wait)

We need 2 templates approved before launch:

### Template 1: `whatsapp_otp_v1` (authentication category)
- Language: English (en)
- Category: **Authentication**
- Header: none
- Body:
  ```
  Hi {{1}}, your Dekho Panchang verification code is *{{2}}*.
  Valid for 10 minutes. Reply STOP to opt out.
  ```
- Footer: none
- Buttons: none

### Template 2: `daily_panchang_v1_en` (utility category)
- Language: English (en)
- Category: **Utility**
- Header: none
- Body: see §7.2 of design doc
- Footer: `Reply STOP to unsubscribe`
- Buttons: 1 URL button → `https://dekhopanchang.com/{{1}}/panchang`

### Template 3: `daily_panchang_v1_hi` (utility category)
- Same as #2 but Hindi body

**Submission UI:** Meta App → WhatsApp → Message Templates → Create Template

**Approval window:** Meta's auto-review takes 1–24 hours for utility/authentication; manual review can extend to 48h. Don't submit "promotional" wording — strict utility only, or it'll reject.

Record:
- [ ] All 3 templates approved (status: APPROVED in dashboard)

---

## Step 7 — Webhook configuration (~10 min)

For inbound replies (STOP keyword + delivery receipts) we point Meta's webhook to our `/api/whatsapp/webhook` endpoint.

This step happens AFTER we deploy the webhook handler to production. The handler is part of Phase 2.

When ready:
1. Meta App → WhatsApp → Configuration → Webhooks
2. Callback URL: `https://dekhopanchang.com/api/whatsapp/webhook`
3. Verify token: paste the value from `WHATSAPP_WEBHOOK_VERIFY_TOKEN` env var (we generate a random 32-byte hex; the verify token is the only way to prove ownership)
4. Webhook fields to subscribe to: `messages`, `message_status`

---

## Step 8 — Add credentials to Vercel (~5 min)

Once you have all the values from Steps 3, 4, 5:

```bash
vercel env add WHATSAPP_PHONE_NUMBER_ID production       # from Step 5
vercel env add WHATSAPP_ACCESS_TOKEN production          # from Step 4
vercel env add META_APP_SECRET production                # from Step 3
vercel env add WHATSAPP_WEBHOOK_VERIFY_TOKEN production  # generate: openssl rand -hex 32
vercel env add WHATSAPP_BUSINESS_ACCOUNT_ID production   # from API Setup page
vercel env add WHATSAPP_MONTHLY_BUDGET_USD production    # set to "25"
vercel env add OTP_HMAC_SECRET production                # generate: openssl rand -hex 32
                                                          # used to hash OTPs at-rest;
                                                          # opt-in flow fails at runtime if missing
vercel env add WHATSAPP_BETA_USER_IDS production         # Phase 5 beta gate.
                                                          # Comma-separated UUIDs of allowed users,
                                                          # OR "*" for all, OR unset to fully close.
                                                          # Run scripts/whatsapp-pick-beta-cohort.ts
                                                          # to generate the initial list.
```

Mirror these to `preview` and `development` if you want preview-branch test sending too.

---

## Step 9 — Validate end-to-end with the test number (~15 min)

Before launching to real users, verify the full stack works:

1. From local dev (`npx next dev`), use Meta's test phone number ID
2. Add your own phone number to the "Allowed recipients" list in API Setup (the 5-number whitelist)
3. Trigger the `/api/cron/whatsapp-daily-panchang` route manually with your test subscription row
4. Confirm:
   - Message arrives on your WhatsApp within 5 seconds
   - `whatsapp_send_log` row written with `whatsapp_message_id`
   - Delivery receipt webhook fires (status changes pending → delivered → read)

If all green: swap `WHATSAPP_PHONE_NUMBER_ID` to the production number from Step 5 and ship.

---

## Cost watch

- Steps 1–9: **$9 one-time** (SIM + first recharge), **$0 to Meta**
- Per-message costs only kick in once we send real templates from production number
- Test number sends are always free
- Webhook traffic to our domain: bills under existing Vercel Function quota; negligible

If WABA verification takes >7 days or you hit any blocker, switch to AiSensy/Wati (Plan B from spec §5).

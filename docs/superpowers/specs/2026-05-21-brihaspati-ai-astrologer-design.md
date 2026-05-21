# Brihaspati (बृहस्पति) — AI Astrologer

**Date:** 2026-05-21
**Status:** Final (2026-05-21)
**Supersedes:** `docs/brihaspati/PLAN.md` for any conflicting sections (pricing, locales, currency, model tier).

---

## Product

Brihaspati is the primary monetisation feature for Dekho Panchang. A paid AI astrologer that answers personalised Jyotish questions computed from Swiss Ephemeris and narrated by an LLM, with a **4-layer validation wall** (see §10) ensuring every claim is astronomically correct.

**Name:** Brihaspati (बृहस्पति) — the divine guru, teacher of the gods.

**Pricing (tiered, see §6 for full table):**
- ₹49 / $0.99 per question (one-off)
- ₹199 / $2.99 for a 5-question pack (30-day validity)
- ₹299 / $3.99 monthly unlimited
- ₹1,999 / $24.99 annual unlimited

**Currency:** INR via Razorpay for India, USD via Stripe for everywhere else. Geo-detected from IP at panel open; user can override.

**Languages at launch:** EN, HI, TA, BN (the four active locales — see `feedback_four_locales`). Other locales render the panel UI in their language but answer prose falls back to EN.

**Placement:** Global — floating button + contextual banner on every page.

---

## Global Presence

### Floating Button (every page)

- Bottom-right corner, gold circular button with Brihaspati guru icon (from existing `GrahaIcons` — Jupiter)
- Subtle gold glow animation on first visit, then static
- No price badge on the button itself (looks cheap) — price shown when panel opens
- Click expands the question panel

### Contextual Banner (every page)

- Full-width bar above the floating button, bottom of screen
- Dismissible (X button). Auto-dismisses after 3 page views per session. Returns on new session.
- **Data-driven text per page type**, pulling from Zustand stores:

| Page | Banner Text |
|------|-------------|
| Panchang | "{nakshatra} nakshatra + {tithi} tithi today. How does this affect YOUR chart? Ask Brihaspati — {price}" |
| Horoscope/{rashi} | "{rashi} Moon sign only scratches the surface. What do your 9 planets say? — {price}" |
| Kundali (with chart) | "{yoga_count} yogas detected in your chart. Which ones shape your career? Ask Brihaspati — {price}" |
| Kundali (no chart) | "Birth data not on file yet — Brihaspati will ask for it inline. Pay {price} for your reading." |
| Calendar/Festivals | "Planning around {festival}? Ask Brihaspati for your personal muhurta — {price}" |
| Choghadiya/Hora | "Choghadiya tells you WHEN. Brihaspati tells you WHY it matters for YOU — {price}" |
| Learn pages / Other | "What do the stars say about your next big decision? Ask Brihaspati — {price}" |
| Dashboard | "Your chart is loaded. Ask Brihaspati anything — {price}" |

- `{price}` is the lowest-friction tier in the user's currency: "₹49" or "$0.99". A user with credit/subscription balance sees "Ask Brihaspati — free with your plan".
- `{yoga_count}` reads from the kundali snapshot's detected-yogas array length — never hardcoded.
- Page detection via `usePathname()`. Live data (nakshatra name, rashi name, yoga count, festival name) from existing Zustand stores and snapshot — no inline computation.
- Banner text exists in all four launch locales (EN/HI/TA/BN); other locales fall back to EN.

---

## Question Flow

### Panel UI

- **Mobile:** Slides up from bottom as a sheet (80% viewport height)
- **Desktop:** Right drawer (400px wide) — coexists with main content

Panel contents:
1. **Header:** Brihaspati icon + "बृहस्पति" / "Brihaspati" + "₹49 per question" + close button
2. **Guided prompts:** 3-4 contextual suggestions (change per page type). User taps to select.
3. **Free text input:** "Ask anything about your life, career, relationships, health..."
4. **Previous answers** (if any in this session) shown above the input

### Guided Prompts (per page category)

Prompts live in `src/messages/{locale}/brihaspati.json` under a `prompts` key (one of `panchang | horoscope | kundali | calendar | choghadiya | dashboard | generic`). The component does `useTranslations('brihaspati.prompts.<category>')` — never inline. EN/HI/TA/BN are authored; other locales fall back to EN per next-intl defaults.

Each category supplies 3–4 prompts. Suggested EN seeds (HI/TA/BN translated via the existing `translate-locale` workflow):

- **panchang**: "Is today auspicious for starting a new venture?" / "Should I travel today based on my chart?" / "What should I be careful about today?"
- **horoscope**: "What does my full chart say about this month?" / "When will my current difficult phase end?" / "What career path suits my planetary positions?"
- **kundali**: "Do I have Mangal Dosha? How severe is it?" / "When is the best time for marriage in my chart?" / "What do my current dashas say about the next year?" / "Which gemstone should I wear based on my chart?"
- **generic**: "What do the planets say about my career?" / "Is this year good for buying property?" / "What should I know about my Sade Sati?"

### Flow after question is entered

```
User types/selects question
    │
    ▼
Balance check (server-side via /api/brihaspati/balance)
    │
    ├─ User has credits OR active monthly/annual plan
    │   → No payment. Direct to step "Submit question"
    │
    └─ No balance
        │
        ▼
   Query Classifier (instant, client-side keyword match — Layer 2 of validation wall)
        │
        ├─ GENERAL (no birth data needed)
        │   → "Pay {price}" — defaults to one-off tier in user's currency
        │   → Razorpay or Stripe modal (geo-detected)
        │   → On payment verified server-side → "Submit question"
        │
        └─ PERSONAL (birth data needed)
            │
            ├─ Birth data already saved
            │   → "Brihaspati will read your chart. Pay {price}"
            │   → Payment modal → "Submit question"
            │
            └─ No birth data
                → Inline birth form (date, time, place) — uses existing BirthForm in compact mode
                → "Pay {price} to reveal your personal reading"
                → Payment modal → save birth data → "Submit question"

Submit question
    │
    ▼
POST /api/brihaspati { questionId, paymentId?, signature?, birthData? }
    │
    ▼
Server: verify payment OR deduct credit OR confirm subscription
    │
    ▼
Server: load/refresh kundali snapshot (getFreshSnapshot, auto-recompute if stale)
    │
    ▼
ai-pandit engine: classifier → context builder → LLM → validation wall (§10)
    │
    ▼
Stream SSE response into panel; persist to brihaspati_questions
```

### Pricing Tier Upsell

When a one-off user buys their 3rd question in 30 days, the panel shows a one-line nudge above the payment button: "Save ₹50 — get 5 questions for ₹199". Single click switches the modal to the 5-pack tier. No interstitials, no popups. Tracked as `upsell_shown` / `upsell_taken` for funnel telemetry.

### Authentication Gate

- User must be logged in before payment. Anonymous users cannot pay — there is no way to deliver the answer without an account.
- If not logged in when they click "Pay": Google OAuth modal opens first → on auth success, payment modal opens immediately
- Two clicks total for a new user: Google sign-in → Pay
- The question text typed pre-auth is preserved through the OAuth roundtrip via sessionStorage (key `dp-brihaspati-pending`). The OAuth return handler re-opens the panel with the question populated.

---

## Payment

### Tier Catalogue

| Tier ID | INR | USD | Grants | Validity |
|---------|-----|-----|--------|----------|
| `single` | ₹49 | $0.99 | 1 question | Immediate |
| `pack_5` | ₹199 | $2.99 | 5 question credits | 30 days from purchase |
| `monthly` | ₹299 | $3.99 | Unlimited questions | 30 days |
| `annual` | ₹1,999 | $24.99 | Unlimited + priority queue | 365 days |

All four tiers are sold from launch. Tier IDs are stable contract values used in the DB and analytics.

### Geo + Currency Routing

- Geo-detect on panel open via `request.geo.country` (Vercel Edge) or `Accept-Language` fallback. Cached in cookie `dp-brihaspati-region` for the session.
- India (`IN`) → Razorpay INR. Everywhere else → Stripe USD.
- User can manually override via a small "₹ / $" toggle in the panel header for cross-border edge cases.
- Both providers already wired for subscriptions (`/api/checkout`, `/api/subscription`, `/api/webhooks/razorpay`). Brihaspati adds Brihaspati-specific routes alongside.

### Razorpay Integration

- INR amounts in paise (₹49 = 4900, ₹199 = 19900, ₹299 = 29900, ₹1,999 = 199900)
- Order creation: `/api/brihaspati/order` — creates Razorpay order, returns `{ orderId, amount, currency, keyId }`
- Verification: Razorpay signature check (`crypto.createHmac('sha256', secret).update(orderId + '|' + paymentId)`) — server-side, before any LLM call.
- Env vars needed in Vercel (`production` + `preview`): `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`. Currently only present at code level — must be added before launch (deployment checklist).

### Stripe Integration

- USD amounts in cents (single: 99, pack_5: 299, monthly: 399, annual: 2499)
- Reuse existing `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET`
- Create four new Price IDs in Stripe dashboard: `STRIPE_PRICE_BRIHASPATI_SINGLE`, `_PACK_5`, `_MONTHLY`, `_ANNUAL`. Listed in `tier-config.ts`.
- `single` and `pack_5` are one-off Checkout sessions; `monthly` and `annual` are Stripe Subscriptions with a Brihaspati feature flag on the customer record.

### GST / Tax

- Razorpay handles GST in India automatically per the merchant settings — no additional logic needed. The ₹49 price is GST-inclusive.
- Stripe is configured with Stripe Tax for cross-border VAT (where required). USD prices are tax-inclusive at the display tier.

### Refund Policy

- One-off purchases (`single`, `pack_5`): refundable within 24 hours if the user emails support and we cannot match any of their stated questions to the persisted answer. Validation-wall failures that surface a template fallback DO entitle a refund.
- Subscriptions (`monthly`, `annual`): pro-rated refund within the first 7 days; not refundable thereafter.
- Refunds processed via Razorpay/Stripe dashboard — no in-app self-serve refund button at launch (fast-follow).
- The disclaimer copy in §Answer Display links to `/refunds` which documents the above.

### Payment Failure Handling

- Razorpay / Stripe modals handle internal retries
- User closes modal without paying → question stays in panel, payment button remains
- Payment succeeds, LLM fails → engine retries up to 2× → template fallback → user always gets an answer (and answer is logged with `tier=0` so we can identify hallucination-free fallbacks)
- All retries + template fail (should never happen) → question row marked `status='pending'`, user sees: "Your answer is being prepared. You'll receive it by email shortly." → Vercel Cron job (every 5 min) retries pending rows up to 10 attempts, then alerts via Resend + flags row `status='failed'` so support can manual-refund

---

## Backend

### API Routes

**`GET /api/brihaspati/balance`** — Returns user's current balance
- Auth: Bearer token required
- Returns: `{ credits: number, subscription: 'none' | 'monthly' | 'annual', subscriptionExpiresAt?: string }`
- Used by panel to decide whether to show payment UI or proceed straight to question submission

**`POST /api/brihaspati/order`** — Create payment order
- Auth: Bearer token required
- Body: `{ question: string, locale: string, tier: 'single' | 'pack_5' | 'monthly' | 'annual', currency: 'INR' | 'USD' }`
- Server validates tier × currency combo. Creates Razorpay order or Stripe Checkout session as appropriate.
- Returns: `{ provider: 'razorpay' | 'stripe', orderId | sessionId, amount, currency, keyId | sessionUrl }`
- Creates a pending row in `brihaspati_questions`

**`POST /api/brihaspati`** — Process question after payment / credit deduction
- Auth: Bearer token required
- Body: `{ questionId: string, paymentRef?: { provider, paymentId, signature }, birthData?: BirthData }`
- Server-side flow:
  1. Verify payment signature (Razorpay HMAC or Stripe webhook idempotency) OR confirm user has subscription/credit balance
  2. If `birthData` provided and not on file: save via existing profile flow; trigger snapshot compute
  3. Get or refresh kundali snapshot via `getFreshSnapshot()` (auto-recompute if stale per ENGINE_VERSION)
  4. Run ai-pandit engine (classifier → engine routing → context builder → LLM → validation wall §10)
  5. Stream response back via **Server-Sent Events** (`text/event-stream`) — Vercel Functions support this natively; 300s default timeout is ample
  6. Persist final answer + validation result + tier + token counts to `brihaspati_questions`

**`POST /api/brihaspati/webhook/razorpay`** and **`/api/brihaspati/webhook/stripe`** — Provider webhooks
- Idempotent (key on `provider_event_id`)
- Confirms payment / activates subscription / grants credits
- Independent of the synchronous flow above — the user-visible path verifies signature synchronously; webhooks are the safety net for missed callbacks

### Rate Limiting

- 10 questions per user per hour (abuse prevention only — most users will be well under this)
- Implemented via a DB-backed counter (no Redis on Vercel): `select count(*) from brihaspati_questions where user_id = $1 and created_at > now() - interval '1 hour'`. Cheap with the index on `(user_id, created_at)`.
- Subscribers (`monthly` / `annual`) get a higher cap of 60/hour to avoid limiting power users during heavy sessions.

### Streaming

- Transport: **Server-Sent Events** (`text/event-stream`). Chosen over chunked transfer because: built-in retry, well-supported by `EventSource` on the client, plays nicely with Vercel Fluid Compute streaming.
- Event format: `data: {"type":"token","text":"..."}\n\n` for content; `data: {"type":"done","validation":"passed"}\n\n` to terminate.
- Client-side: native `EventSource` (not `fetch`) so the connection survives Vercel's idle handling and reconnects on transient drops.

### Database

```sql
create table public.brihaspati_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  question text not null,
  answer text,
  locale text default 'en',                  -- 'en' | 'hi' | 'ta' | 'bn' | others fall back
  query_category text,                       -- 'career' | 'marriage' | 'health' | ...
  tier smallint,                             -- 0=template fallback, 1=self-hosted Qwen (fast-follow), 2=Claude API
  model_used text,                           -- e.g. 'claude-sonnet-4-6', 'qwen-3-14b-q4', 'template-v1'
  pricing_tier text,                         -- 'single' | 'pack_5' | 'monthly' | 'annual'
  provider text,                             -- 'razorpay' | 'stripe' | 'credit' | 'subscription'
  payment_ref text,                          -- razorpay payment_id or stripe payment_intent
  payment_verified boolean default false,
  birth_data_used boolean default false,
  validation_passed boolean,                 -- Layer 4 result
  validation_failures jsonb,                 -- which claim-checks failed if any
  retry_count smallint default 0,
  status text default 'pending',             -- 'pending' | 'streaming' | 'completed' | 'failed'
  input_tokens int,
  output_tokens int,
  created_at timestamptz default now(),
  completed_at timestamptz
);

create index brihaspati_questions_user_created on public.brihaspati_questions (user_id, created_at desc);
create index brihaspati_questions_status on public.brihaspati_questions (status) where status in ('pending', 'failed');

alter table public.brihaspati_questions enable row level security;
create policy "users_own_questions" on public.brihaspati_questions
  for select using (auth.uid() = user_id);
-- Writes always go through service_role from API routes; no client-write policy.

-- Credit ledger (5-question pack)
create table public.brihaspati_credits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  granted int not null,                      -- credits granted by this purchase
  consumed int default 0,
  pricing_tier text not null,                -- 'pack_5' typically
  provider text not null,
  payment_ref text,
  expires_at timestamptz not null,           -- 30 days from purchase
  created_at timestamptz default now()
);

create index brihaspati_credits_user_active on public.brihaspati_credits (user_id)
  where consumed < granted and expires_at > now();

alter table public.brihaspati_credits enable row level security;
create policy "users_own_credits" on public.brihaspati_credits
  for select using (auth.uid() = user_id);

-- Subscription state lives on user_profiles.brihaspati_subscription jsonb:
--   { tier: 'monthly' | 'annual', expires_at: timestamptz, provider: 'razorpay' | 'stripe' }
-- Updated by webhook handlers only.
```

Migration file: `supabase/migrations/NNN_brihaspati_questions.sql`. Follows the trigger-safety rules in CLAUDE.md (no triggers on auth.users; if any helper triggers are needed, `SECURITY DEFINER` + `SET search_path = public` + `EXCEPTION WHEN OTHERS THEN RETURN NEW`).

---

## §10. The Four-Layer Validation Wall

This is the marquee positioning claim. Each layer is enforced in code; the layers compose so that an LLM hallucination cannot reach the user.

### Layer 1 — Deterministic Computation (no LLM in the loop)

All planetary positions, dashas, transits, yogas, doshas, festivals, muhurtas, and panchang values are computed **server-side** by the existing Swiss Ephemeris pipeline (NASA JPL DE441, Lahiri ayanamsa, BPHS-grounded yoga detection). The LLM never derives an astrological fact. The kundali snapshot fed to the LLM is hash-versioned via `ENGINE_VERSION` (`src/lib/kundali/engine-version.ts`) and stale snapshots auto-recompute before use.

Enforced by: `getFreshSnapshot()` server-side, called unconditionally before any LLM call (`src/lib/brihaspati/handlers/*.ts`). No path bypasses this.

### Layer 2 — Engine Routing (classifier picks the rules, not the LLM)

A keyword-based question classifier maps the question to a category (`career`, `marriage`, `health`, `finance`, `children`, `education`, `dasha`, `remedies`, `compatibility`, `timing`, `transit`, `general`). The category deterministically selects which existing engines run (`tippanni-engine`, `dasha-prognosis`, `transit-activation`, `domain-synthesis`, etc.) and what subset of the snapshot becomes context. The LLM cannot pick rules or invoke additional engines.

Routing table in `src/lib/brihaspati/router.ts`. Per-category engine list shown in PLAN.md §3 — that table is the implementation contract.

### Layer 3 — Constrained LLM Narration

The LLM receives:
- A system prompt that explicitly forbids inventing astrological facts ("Use only data from the provided JSON. Do not name planets, signs, houses, yogas, or dates that are not in the input.")
- A structured JSON context blob from Layer 2 — never the raw question + chart, always pre-processed analysis
- A list of allowed astrological terms (the union of names appearing in the input JSON)

The LLM's job is purely narrative: turn the structured analysis into 300–500 tokens of personal prose in the user's language. Temperature is capped at 0.4 to reduce embellishment. `max_tokens` is set per response type.

System prompts live in `src/lib/brihaspati/narration/prompts/{locale}.ts` so they are reviewable diffs, not magic strings.

### Layer 4 — Post-Generation Claim Verification

After the LLM emits the answer (or while streaming, on terminal punctuation), a verifier extracts every astrological claim and confirms it against the Layer 2 JSON context:

- Planet positions ("Venus in 7th house", "Saturn in Capricorn") — must match snapshot positions
- Dasha names + dates ("during your Jupiter-Mercury period until 2027-03") — must be in `dashas[]`
- Yoga names ("Gajakesari Yoga", "Mangal Dosha") — must be in `yogas[].detected` or `doshas[].detected`
- Date ranges ("between November 2026 and April 2027") — must fall within transit windows in the context

Mismatch handling: on the first mismatched claim, the response is rejected and the engine retries (up to 2× — Tier 2 LLM → Tier 1 → Tier 0 template) until either a passing response is produced or the template fallback runs. `validation_failures` is persisted on the row so we can audit hallucination rates per model.

Implementation: `src/lib/brihaspati/narration/validator.ts`. The verifier is regex + lookup-table, not another LLM call — fully deterministic and auditable.

> **Launch posture**: Layers 1–3 are mandatory at launch. Layer 4 ships with a permissive ruleset on day 1 (mismatch logs but does not block) — the strict-blocking mode flips on after one week of telemetry confirms low false-positive rate. This is recorded in `brihaspati_questions.validation_passed` from day 1 so we can analyse before flipping.

---

## Answer Display

- **Streamed** token by token via SSE into the panel
- **Structured sections** rendered as headings: "Chart Analysis", "Timing Windows", "Remedies", "Classical Reference" (per PLAN.md §2 output structure)
- **Disclaimer** at bottom (always, locale-aware): "Brihaspati's guidance is based on classical Jyotish principles computed from Swiss Ephemeris (NASA JPL DE441). This is for guidance only — for important life decisions, also consult a qualified Jyotishi. [Refund policy](/refunds)."
- Per `feedback_no_competitor_references`: the disclaimer cites NASA JPL DE441 and BPHS — never Prokerala / Drik / Shubh, even though we validate against them internally.
- **Share button**: WhatsApp share of the question + a 2-sentence summary excerpt (not the full answer — that stays behind the paywall and in the user's history)
- **Email copy**: every completed answer is also emailed to the user via Resend (template: `daily-panchang.ts` peer — new template `brihaspati-answer.ts`). This is the artefact users keep; the panel is ephemeral.

---

## History (at launch)

Path: `/[locale]/brihaspati/history`. Lists all the user's past questions and answers, newest first, paginated 20/page. Each row expands to show the full answer. Linked from the user menu (`UserMenu`) and from the dashboard ("Your Brihaspati questions" card).

This was originally fast-follow in the early draft. Promoted to launch because the tiered pricing (especially `monthly`/`annual`) makes a history view essential — without it, paying subscribers have no way to revisit answers.

---

## Existing Feature Handling

Two existing AI surfaces are **removed** and replaced by Brihaspati:

- The free chart-chat on the kundali page (`ai_chat`, 2/day)
- The Muhurta AI scanner (`muhurta_ai`, 2/month)

`tippanni_full` and `varga_full` remain free (those are deterministic, not LLM). The `ai_chat` and `muhurta_ai` permissions are removed from `src/lib/subscription/tiers.ts` in the launch PR; the corresponding components either delete or become Brihaspati entry points:

- "Ask Your Chart" tab on kundali → renamed to "Ask Brihaspati", uses kundali-specific guided prompts
- Muhurta AI button → becomes "Ask Brihaspati for muhurta guidance" CTA on the muhurta page

No free AI questions remain anywhere in the app post-launch.

---

## Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `BrihaspatiButton` | `src/components/brihaspati/BrihaspatiButton.tsx` | Floating gold button, bottom-right. Hides under banner on mobile when banner is open. |
| `BrihaspatiPanel` | `src/components/brihaspati/BrihaspatiPanel.tsx` | Drawer/sheet with prompts, input, answer display, currency toggle |
| `BrihaspatiBanner` | `src/components/brihaspati/BrihaspatiBanner.tsx` | Contextual bottom banner with data-driven hooks |
| `BrihaspatiProvider` | `src/components/brihaspati/BrihaspatiProvider.tsx` | Global context: panel open/close, question state, payment state, balance |
| `BrihaspatiHistoryPage` | `src/app/[locale]/brihaspati/history/page.tsx` | Past Q&A list |
| Layout integration | `src/app/[locale]/layout.tsx` | `<BrihaspatiProvider>` wraps app; button + banner rendered globally |

### Backend Files

| File | Responsibility |
|------|----------------|
| `src/lib/brihaspati/classifier.ts` | Layer 2: question → category |
| `src/lib/brihaspati/router.ts` | Layer 2: category → engine list |
| `src/lib/brihaspati/handlers/*.ts` | Per-category context builders |
| `src/lib/brihaspati/narration/prompts/{en,hi,ta,bn}.ts` | Locale system prompts |
| `src/lib/brihaspati/narration/inference.ts` | LLM call (Anthropic Claude via existing API key) |
| `src/lib/brihaspati/narration/validator.ts` | Layer 4: claim verifier |
| `src/lib/brihaspati/narration/fallback.ts` | Layer 0: template responses |
| `src/lib/brihaspati/credits/credit-manager.ts` | Balance check/deduct |
| `src/lib/brihaspati/payment/razorpay.ts` | Razorpay order + signature verify |
| `src/lib/brihaspati/payment/stripe.ts` | Stripe Checkout + webhook |

---

## Telemetry

Tracked events (existing analytics provider):

- `brihaspati_banner_shown` (page, locale)
- `brihaspati_banner_dismissed`
- `brihaspati_panel_opened` (entry: button | banner | kundali_tab)
- `brihaspati_prompt_selected` (category, prompt_index)
- `brihaspati_question_typed` (length_bucket, locale)
- `brihaspati_payment_started` (tier, currency)
- `brihaspati_payment_completed` (tier, currency, amount)
- `brihaspati_payment_failed` (tier, error_code)
- `brihaspati_answer_streamed` (category, model, validation_passed, output_tokens, latency_ms)
- `brihaspati_upsell_shown` / `_taken` (from_tier, to_tier)
- `brihaspati_answer_shared` (channel: whatsapp | email)

This enables a clean conversion funnel: banner → panel → question → payment → answer. The `validation_passed` field per answer lets us track Layer 4 effectiveness.

---

## Scope

### Launch (this spec)
- Floating button + contextual banner on all pages, all 4 locales (EN/HI/TA/BN), with EN fallback for the other 4
- Question panel with guided prompts + free text + currency toggle
- Auth gate (Google OAuth), question preserved through OAuth roundtrip
- **Full tiered pricing**: single (₹49/$0.99), pack_5 (₹199/$2.99), monthly (₹299/$3.99), annual (₹1,999/$24.99)
- **Razorpay (INR) + Stripe (USD)** with geo-routing
- `/api/brihaspati/balance`, `/api/brihaspati/order`, `/api/brihaspati`, webhook routes
- Answer streaming via SSE with locale-aware disclaimer + refund link
- Email of every completed answer via Resend
- **Validation Wall Layers 1–4** (Layer 4 in log-only mode for first week)
- Tier 0 (templates) + Tier 2 (Claude API) — self-hosted Qwen comes later
- `brihaspati_questions` + `brihaspati_credits` DB tables; `user_profiles.brihaspati_subscription` jsonb
- Remove existing free chart-chat AND muhurta_ai
- `/brihaspati/history` page
- Telemetry events for conversion funnel
- Razorpay env vars added to Vercel (deployment gate)

### Fast Follow (not this spec)
- Tier 1 self-hosted Qwen 14B on Hetzner (PLAN.md §5)
- Fine-tuning pipeline (PLAN.md §6) once we have ≥500 real Q&A pairs
- RAG over classical Sanskrit texts (BPHS, Phaladeepika, Saravali)
- Additional locales (TE, GU, KN, MR, MAI) — both UI and narration
- Self-serve refund button in `/brihaspati/history`
- Audio narration (TTS) of answers using existing video pipeline voice
- "Ask a follow-up" within a question (multi-turn within one paid question, 5 min window)
- PDF export of long answers ("the reading you can keep")
- Compatibility mode (`compatibility` category needs partner birth data — add a "+ Add partner" flow)

---

## Deployment Checklist (must be green before launch PR merges)

- [ ] `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` set in Vercel `production` + `preview` envs
- [ ] Four Brihaspati Stripe Price IDs created (`STRIPE_PRICE_BRIHASPATI_{SINGLE,PACK_5,MONTHLY,ANNUAL}`) and set in Vercel envs
- [ ] Razorpay webhook URL registered: `https://dekhopanchang.com/api/brihaspati/webhook/razorpay`
- [ ] Stripe webhook endpoint registered: `https://dekhopanchang.com/api/brihaspati/webhook/stripe`
- [ ] `/refunds` page exists and is reachable from disclaimer link
- [ ] Migration applied: `supabase/migrations/NNN_brihaspati_questions.sql` (runs cleanly on staging)
- [ ] All 4 launch locales have `brihaspati.json` prompts + UI strings
- [ ] `npx tsc --noEmit -p tsconfig.build-check.json` passes
- [ ] `npx vitest run` passes, incl. new tests for: classifier (every category), Layer 4 validator (claim verification), payment signature verification, credit ledger deduction
- [ ] `npx next build` succeeds
- [ ] Manual browser smoke test: anonymous user → type question → Google OAuth → pay → receive answer (one round per provider, one per locale)
- [ ] `vercel logs` shows no runtime errors for 24h after deploy
- [ ] Existing `ai_chat` / `muhurta_ai` UI surfaces removed or converted to Brihaspati entry points

---

## Non-Goals (explicit)

To prevent scope creep mid-build, the following are NOT in this spec:

- Voice / audio input
- Image input (photo of palm, face, signature, etc.)
- Real-time chat with a human astrologer
- Predictive notifications ("Brihaspati noticed your dasha changes tomorrow")
- Public sharing of full answers (only summary excerpts)
- Free-tier resurrection or "first answer free" promotions
- Multi-language answers in one response
- Brihaspati API for third-party integrations

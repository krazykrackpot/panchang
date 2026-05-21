# Brihaspati (बृहस्पति) — AI Astrologer

**Date:** 2026-05-21
**Status:** Draft

---

## Product

Brihaspati is the primary monetisation feature for Dekho Panchang. A paid AI astrologer (₹49/question) that answers personalised Jyotish questions computed from Swiss Ephemeris and narrated by an LLM, with a 4-layer validation wall ensuring every claim is astronomically correct.

**Name:** Brihaspati (बृहस्पति) — the divine guru, teacher of the gods.
**Price:** ₹49 per question (~$0.58). No free tier. No subscriptions.
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
| Panchang | "{nakshatra} nakshatra + {tithi} tithi today. How does this affect YOUR chart? Ask Brihaspati — ₹49" |
| Horoscope/{rashi} | "{rashi} Moon sign only scratches the surface. What do your 9 planets say? — ₹49" |
| Kundali (with chart) | "144 yogas detected in your chart. Which ones shape your career? Ask Brihaspati — ₹49" |
| Kundali (no chart) | "Generate your birth chart, then ask Brihaspati anything — ₹49" |
| Calendar/Festivals | "Planning around {festival}? Ask Brihaspati for your personal muhurta — ₹49" |
| Choghadiya/Hora | "Choghadiya tells you WHEN. Brihaspati tells you WHY it matters for YOU — ₹49" |
| Learn pages / Other | "What do the stars say about your next big decision? Ask Brihaspati — ₹49" |
| Dashboard | "Your chart is loaded. Ask Brihaspati anything — ₹49" |

- Page detection via `usePathname()`. Live data (nakshatra name, rashi name) from existing Zustand stores (`useLocationStore`, panchang data).
- Bilingual: Hindi for Devanagari locales, English otherwise.

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

```typescript
const PROMPTS: Record<string, { en: string; hi: string }[]> = {
  panchang: [
    { en: 'Is today auspicious for starting a new venture?', hi: 'क्या आज नया कार्य शुरू करने के लिए शुभ है?' },
    { en: 'Should I travel today based on my chart?', hi: 'क्या मुझे आज यात्रा करनी चाहिए?' },
    { en: 'What should I be careful about today?', hi: 'आज मुझे किस बात का ध्यान रखना चाहिए?' },
  ],
  horoscope: [
    { en: 'What does my full chart say about this month?', hi: 'इस महीने मेरी पूर्ण कुण्डली क्या कहती है?' },
    { en: 'When will my current difficult phase end?', hi: 'मेरा वर्तमान कठिन समय कब समाप्त होगा?' },
    { en: 'What career path suits my planetary positions?', hi: 'कौन सा करियर मेरी ग्रह स्थिति के अनुकूल है?' },
  ],
  kundali: [
    { en: 'Do I have Mangal Dosha? How severe is it?', hi: 'क्या मुझे मंगल दोष है? कितना गम्भीर?' },
    { en: 'When is the best time for marriage in my chart?', hi: 'मेरी कुण्डली में विवाह का सर्वोत्तम समय कब है?' },
    { en: 'What do my current dashas say about the next year?', hi: 'मेरी वर्तमान दशा अगले वर्ष के बारे में क्या कहती है?' },
    { en: 'Which gemstone should I wear based on my chart?', hi: 'मेरी कुण्डली के अनुसार कौन सा रत्न पहनूँ?' },
  ],
  generic: [
    { en: 'What do the planets say about my career?', hi: 'ग्रह मेरे करियर के बारे में क्या कहते हैं?' },
    { en: 'Is this year good for buying property?', hi: 'क्या यह वर्ष सम्पत्ति खरीदने के लिए अच्छा है?' },
    { en: 'What should I know about my Sade Sati?', hi: 'मुझे अपनी साढ़े साती के बारे में क्या जानना चाहिए?' },
  ],
};
```

### Flow after question is entered

```
User types/selects question
    │
    ▼
Query Classifier (instant, client-side keyword match)
    │
    ├─ GENERAL (no birth data needed)
    │   → Show: "Brihaspati is ready to answer. Pay ₹49"
    │   → Razorpay modal (₹49)
    │   → On payment success: POST /api/brihaspati
    │   → Stream answer into panel
    │
    └─ PERSONAL (birth data needed)
        │
        ├─ Birth data already saved (logged-in user with profile)
        │   → Show: "Brihaspati will read your chart. Pay ₹49"
        │   → Razorpay modal
        │   → On payment: POST /api/brihaspati (server computes kundali + LLM)
        │   → Stream answer
        │
        └─ No birth data
            → Show compact inline birth form (date, time, place)
            → User fills
            → "Pay ₹49 to reveal your personal reading"
            → Razorpay modal
            → On payment: POST /api/brihaspati (server computes kundali + LLM in parallel)
            → Stream answer
            → Birth data saved to profile for future questions
```

### Authentication Gate

- User must be logged in before payment
- If not logged in when they click "Pay ₹49": Google OAuth modal opens first → on auth success, Razorpay opens immediately
- Two clicks total for a new user: Google sign-in → Pay

---

## Payment

### Razorpay Integration

- **Currency:** INR only (₹49 = 4900 paise)
- **Order creation:** Server-side via `/api/brihaspati/order` — creates Razorpay order, returns `order_id`
- **Payment verification:** Server-side via Razorpay signature verification before calling LLM. No answer without verified payment.
- **Razorpay key:** existing `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` env vars (already configured for subscriptions)

### Payment failure handling

- Razorpay modal handles retries internally
- If user closes modal without paying → question stays in panel, "Pay ₹49" button remains
- If payment succeeds but LLM fails → engine retries up to 2 times → falls back to template response → user always gets an answer
- If all retries + template fail (should never happen) → question saved as "pending", error shown: "Your answer is being prepared. You'll receive it by email shortly." → background job retries

---

## Backend

### API Routes

**`POST /api/brihaspati/order`** — Create Razorpay order
- Auth: Bearer token required
- Body: `{ question: string, locale: string }`
- Returns: `{ orderId: string, amount: 4900, currency: 'INR' }`
- Creates a pending row in `brihaspati_questions`

**`POST /api/brihaspati`** — Process question after payment
- Auth: Bearer token required
- Body: `{ questionId: string, razorpayPaymentId: string, razorpaySignature: string, birthData?: BirthData }`
- Verifies Razorpay signature
- If birth data provided and not saved: computes kundali, saves to profile
- Runs ai-pandit engine: classifier → context builder → LLM → validation wall
- Streams response (SSE or chunked transfer)
- Updates `brihaspati_questions` row with answer, tier, validation status

### Rate Limiting

- 10 questions per user per hour (abuse prevention only, not a product limit)
- No daily free quota — every question costs ₹49

### Database

```sql
create table public.brihaspati_questions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  question text not null,
  answer text,
  locale text default 'en',
  query_category text,        -- 'career', 'relationship', 'health', etc.
  tier smallint,              -- 0=template, 1=self-hosted, 2=api
  razorpay_order_id text,
  razorpay_payment_id text,
  payment_verified boolean default false,
  birth_data_used boolean default false,
  validation_passed boolean,
  created_at timestamptz default now()
);

alter table public.brihaspati_questions enable row level security;
create policy "users_own_questions" on public.brihaspati_questions
  for select using (auth.uid() = user_id);
```

---

## Answer Display

- **Streamed** token by token (like ChatGPT) into the panel
- **Structured sections:** The answer includes a heading (bold), body narrative, and specific claims highlighted
- **Disclaimer** at bottom (always): "Brihaspati's guidance is based on classical Jyotish principles computed from Swiss Ephemeris (NASA JPL DE441). This is for guidance only — for important life decisions, also consult a qualified Jyotishi."
- **Share button:** WhatsApp share of the question + a summary excerpt (not the full answer — that's behind the paywall)

---

## Existing Feature Handling

The existing free chart-chat on the kundali page (2 AI questions/day) is **removed**. Brihaspati replaces it entirely. The "Ask Your Chart" tab on the kundali page becomes a Brihaspati entry point with kundali-specific guided prompts. No free AI questions anywhere.

---

## Components

| Component | File | Responsibility |
|-----------|------|----------------|
| `BrihaspatiButton` | `src/components/brihaspati/BrihaspatiButton.tsx` | Floating gold button, bottom-right |
| `BrihaspatiPanel` | `src/components/brihaspati/BrihaspatiPanel.tsx` | Drawer/sheet with prompts, input, answer display |
| `BrihaspatiBanner` | `src/components/brihaspati/BrihaspatiBanner.tsx` | Contextual bottom banner with data-driven hooks |
| `BrihaspatiProvider` | `src/components/brihaspati/BrihaspatiProvider.tsx` | Global context: panel open/close state, question state, payment state |
| Layout integration | `src/app/[locale]/layout.tsx` | `<BrihaspatiProvider>` wrapping the app, button + banner rendered globally |

---

## Scope

### Launch (this spec)
- Floating button + contextual banner on all pages
- Question panel with guided prompts + free text
- Auth gate (Google OAuth)
- Razorpay ₹49 payment per question
- `/api/brihaspati/order` + `/api/brihaspati` routes
- Answer streaming with disclaimer
- Tier 0 (templates) + Tier 2 (Claude API) — self-hosted Qwen comes later
- `brihaspati_questions` DB table
- Remove existing free chart-chat
- Bilingual (EN/HI)

### Fast Follow (not this spec)
- Tier 1 self-hosted Qwen 14B on Hetzner
- Credit packs / wallet (₹199 for 5 questions)
- "My Questions" history page
- WhatsApp share of answers
- Fine-tuning pipeline
- RAG over classical texts
- Additional locales (Tamil, Bengali, Telugu)

# External Service Integrations

Complete reference for all third-party services, API keys, environment variables, and configuration used in Dekho Panchang.

**Last updated:** 2026-04-03
**Production domain:** `dekhopanchang.com`

---

## 1. Vercel (Hosting & Deployment)

### Project Details

| Field | Value |
|-------|-------|
| Project Name | `panchang` |
| Project ID | `prj_bEPE7rAPDsDxr2p6W2iQcucDbHe8` |
| Organization ID | `team_6V5K4XYFJ7kuDPB5UQrlRJWf` |
| Production Domain | `dekhopanchang.com` |
| Git Integration | GitHub (`krazykrackpot/panchang`, auto-deploy on push to `main`) |
| Framework | Next.js (auto-detected) |

### Vercel Analytics & Speed Insights

Enabled via packages in `src/app/[locale]/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
// Rendered inside <body>:
<Analytics />
<SpeedInsights />
```

Packages: `@vercel/analytics@^2.0.1`, `@vercel/speed-insights@^2.0.0`

### Cron Jobs

Configured in `vercel.json`:

| Schedule | Path | Purpose |
|----------|------|---------|
| `0 6 * * *` (daily 6AM UTC) | `/api/cron/generate-notifications` | Generate notification records for dasha transitions |
| `0 7 * * *` (daily 7AM UTC) | `/api/cron/email-alerts` | Send email alerts for upcoming dasha changes |
| `0 6 * * 1` (Mondays 6AM UTC) | `/api/cron/weekly-digest` | Send weekly panchang digest emails |

**Security:** All cron routes verify `CRON_SECRET` header.

### Environment Variables on Vercel

All env vars listed in this document should be set in the Vercel dashboard under **Project Settings > Environment Variables**. Vercel auto-injects them at build and runtime.

---

## 2. Supabase (Database & Authentication)

### Project Details

| Field | Value |
|-------|-------|
| Project URL | `https://qtxbbeyjvkhvciseswpr.supabase.co` |
| Project Reference ID | `qtxbbeyjvkhvciseswpr` |
| Region | (check Supabase dashboard) |
| Database | PostgreSQL |

### Environment Variables

| Variable | Type | Where Used |
|----------|------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Client-side Supabase init |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Client-side auth (JWT, RLS-restricted) |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** | Server-side API routes (bypasses RLS) |

### Client Setup

| File | Purpose |
|------|---------|
| `src/lib/supabase/client.ts` | Browser client (anon key, singleton) |
| `src/lib/supabase/server.ts` | Server client (service role key, no session persistence) |

### Database Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `user_profiles` | Display name, locale, default_location (JSONB), birth data | Users read/write own |
| `saved_charts` | Stored kundali charts with birth data + chart JSON | Users manage own |
| `subscriptions` | Tier (free/pro/jyotishi), provider, status, billing cycle, periods | Users read own |
| `daily_usage` | Per-user daily feature usage counters | Users read own |
| `kundali_snapshots` | Dasha timeline + sade sati data for alert generation | Users read own |
| `user_notifications` | Sent notification log (prevents duplicates) | Users read own |

Migrations: `supabase/migrations/`

### Authentication

- **Method:** Supabase Auth (built-in)
- **Providers:** Email/Password + Google OAuth (configured in Supabase dashboard)
- **Session:** JWT tokens via cookies (`sb-qtxbbeyjvkhvciseswpr-auth-token`)
- **Auto-provisioning:** On signup, a trigger creates `user_profiles` row + 7-day pro trial in `subscriptions`
- **Auth store:** `src/stores/auth-store.ts` (Zustand, subscribes to `onAuthStateChange`)

---

## 3. Google OAuth (via Supabase)

### How It Works

Google OAuth is configured **through Supabase Auth**, not directly in the app. Supabase handles the full OAuth flow.

### Configuration (in Supabase Dashboard)

| Setting | Where to Configure |
|---------|-------------------|
| Google Client ID | Supabase Dashboard > Authentication > Providers > Google |
| Google Client Secret | Supabase Dashboard > Authentication > Providers > Google |
| Authorized Redirect URI | `https://qtxbbeyjvkhvciseswpr.supabase.co/auth/v1/callback` |

### Google Cloud Console Setup

| Setting | Value |
|---------|-------|
| OAuth Consent Screen | External, production |
| Authorized JavaScript Origins | `https://www.dekhopanchang.com`, `https://qtxbbeyjvkhvciseswpr.supabase.co` |
| Authorized Redirect URIs | `https://qtxbbeyjvkhvciseswpr.supabase.co/auth/v1/callback` |
| Scopes | `openid`, `email`, `profile` |

### App-Side Code

```typescript
// src/stores/auth-store.ts
signInWithGoogle: async () => {
  const supabase = getSupabase();
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/auth/callback` }
  });
}
```

Auth callback page: `src/app/auth/callback/route.ts` — exchanges code for session.

---

## 4. Stripe (International Payments — USD)

### Account Details

| Field | Value |
|-------|-------|
| API Version | `2025-03-31.basil` |
| Package | `stripe@^21.0.1` |
| Webhook URL | `https://www.dekhopanchang.com/api/webhooks/stripe` |

### Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `STRIPE_SECRET_KEY` | **Secret** | Server-side API calls (`sk_live_...`) |
| `STRIPE_PUBLISHABLE_KEY` | Public | Not currently used in code |
| `STRIPE_WEBHOOK_SECRET` | **Secret** | Webhook signature verification (`whsec_...`) |
| `STRIPE_PRICE_PRO_MONTHLY` | Config | Stripe Price ID for Pro monthly |
| `STRIPE_PRICE_PRO_ANNUAL` | Config | Stripe Price ID for Pro annual |
| `STRIPE_PRICE_JYOTISHI_MONTHLY` | Config | Stripe Price ID for Jyotishi monthly |
| `STRIPE_PRICE_JYOTISHI_ANNUAL` | Config | Stripe Price ID for Jyotishi annual |

### Configured Price IDs

| Plan | Price ID |
|------|----------|
| Pro Monthly | `price_1THilQL0LseLnCB5rcW6jex5` |
| Pro Annual | `price_1THilRL0LseLnCB5ICPhShLU` |
| Jyotishi Monthly | `price_1THilRL0LseLnCB5Juy39vlP` |
| Jyotishi Annual | `price_1THilRL0LseLnCB5ZcpBHCoG` |

### Flow

1. User clicks subscribe on `/pricing`
2. `POST /api/checkout` — creates Stripe Checkout Session (mode: subscription)
3. User completes payment on Stripe-hosted page
4. Stripe redirects to `/pricing?session_id={ID}&status=success`
5. Stripe fires webhook to `/api/webhooks/stripe`
6. Webhook handler updates `subscriptions` table via Supabase

### Webhook Events Handled

| Event | Action |
|-------|--------|
| `checkout.session.completed` | Create/update subscription → `status: 'active'` |
| `customer.subscription.updated` | Update period dates, handle cancellation |
| `customer.subscription.deleted` | Set `status: 'cancelled'` |
| `invoice.payment_failed` | Set `status: 'past_due'` |

### Key Files

| File | Purpose |
|------|---------|
| `src/app/api/checkout/route.ts` | Creates checkout sessions (Stripe + Razorpay) |
| `src/app/api/webhooks/stripe/route.ts` | Webhook handler |
| `src/app/api/subscription/route.ts` | Get/cancel subscription |
| `src/lib/subscription/tiers.ts` | Tier definitions and feature limits |
| `src/lib/subscription/api-gate.ts` | Feature gating middleware |

---

## 5. Razorpay (India Payments — INR)

### Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `RAZORPAY_KEY_ID` | **Secret** | Public API key |
| `RAZORPAY_KEY_SECRET` | **Secret** | Private API key |
| `RAZORPAY_WEBHOOK_SECRET` | **Secret** | HMAC signature verification |
| `RAZORPAY_PLAN_PRO_MONTHLY` | Config | Razorpay Plan ID |
| `RAZORPAY_PLAN_PRO_ANNUAL` | Config | Razorpay Plan ID |
| `RAZORPAY_PLAN_JYOTISHI_MONTHLY` | Config | Razorpay Plan ID |
| `RAZORPAY_PLAN_JYOTISHI_ANNUAL` | Config | Razorpay Plan ID |

**Status:** Not yet configured (INR payments pending Razorpay account setup).

Package: `razorpay@^2.9.6`

### Webhook

| Field | Value |
|-------|-------|
| URL | `https://www.dekhopanchang.com/api/webhooks/razorpay` |
| Auth | HMAC-SHA256 signature in `x-razorpay-signature` header |

### Events Handled

| Event | Action |
|-------|--------|
| `subscription.activated` | Create subscription → `status: 'active'` |
| `subscription.charged` | Update period dates |
| `subscription.cancelled` / `subscription.paused` | Set `status: 'cancelled'` |

---

## 6. Google Ads & Search

### Google AdSense

| Field | Value |
|-------|-------|
| Publisher ID | `pub-4787764488539456` |
| Environment Variable | `NEXT_PUBLIC_ADSENSE_CLIENT_ID` |
| ads.txt | `public/ads.txt` — declares DIRECT relationship |
| Script Loading | Lazy-loaded in layout, only for free-tier users |
| Component | `src/components/ads/AdUnit.tsx` |

The AdSense script is conditionally loaded:
```typescript
// Only loads when env var is set
{process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
  <Script src={`...?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`} strategy="lazyOnload" />
)}
```

Ads are hidden for Pro/Jyotishi subscribers.

### Google Search Console

| Field | Value |
|-------|-------|
| Verification File | `public/googlef2c686aab81d237e.html` |
| Verification Method | HTML file upload |
| Sitemap URL | `https://www.dekhopanchang.com/sitemap.xml` |

### SEO Configuration

| File | Purpose |
|------|---------|
| `public/robots.txt` | Crawl rules, blocks `/api/`, `/_next/`, auth/settings pages, AI bots |
| `src/app/sitemap.xml/route.ts` | Dynamic sitemap generation |
| `src/app/[locale]/layout.tsx` | OpenGraph, Twitter Cards, JSON-LD structured data |
| `src/lib/seo/metadata.ts` | Per-page metadata generation |

**Blocked bots:** GPTBot, ChatGPT-User, CCBot (in robots.txt).

### Google Fonts

Loaded via external stylesheet in layout:
- **Cormorant Garamond** — Headings (Latin)
- **Inter** — Body text (Latin)
- **Tiro Devanagari** — Headings (Devanagari)
- **Noto Sans Devanagari** — Body text (Devanagari)

---

## 7. Anthropic / Claude API (AI Features)

### Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `ANTHROPIC_API_KEY` | **Secret** (optional) | Claude API for chart chat + AI horoscope |

### Configuration

| Setting | Value |
|---------|-------|
| Package | `@anthropic-ai/sdk@^0.80.0` |
| Default Model | `claude-sonnet-4-20250514` |
| Max Chat Message Length | 500 characters |
| Max Chat History | 10 messages |
| Rate Limit | 30 requests per 60 seconds per IP |

### Usage

| Endpoint | Purpose |
|----------|---------|
| `POST /api/chart-chat` | AI-powered kundali analysis chat |
| `POST /api/horoscope` | AI-generated daily horoscope |
| `POST /api/muhurta-ai` | AI muhurta recommendations |

If `ANTHROPIC_API_KEY` is not set, these endpoints return graceful fallback responses.

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/llm/llm-client.ts` | Anthropic SDK client (singleton, null-safe) |
| `src/lib/llm/chart-chat-prompt.ts` | System prompt builder for chart analysis |
| `src/lib/llm/horoscope-prompt.ts` | Horoscope generation prompts |

---

## 8. Resend (Transactional Email)

### Environment Variables

| Variable | Type | Purpose |
|----------|------|---------|
| `RESEND_API_KEY` | **Secret** | Resend API authentication |
| `EMAIL_FROM` | Config (optional) | Sender address (default: `Dekho Panchang <noreply@dekhopanchang.com>`) |

### Configuration

| Setting | Value |
|---------|-------|
| Package | `resend@^6.10.0` |
| Domain | `dekhopanchang.com` (must be verified in Resend dashboard) |

### Email Types

| Email | Trigger | Content |
|-------|---------|---------|
| Dasha transition alert | Cron (daily) | Upcoming antardasha change (30/14/7/1 day warnings) |
| Weekly digest | Cron (Monday) | Weekly panchang summary |

### Key Files

| File | Purpose |
|------|---------|
| `src/lib/email/resend-client.ts` | `sendEmail()` function |
| `src/lib/email/templates/alert.ts` | HTML email template |
| `src/app/api/cron/email-alerts/route.ts` | Cron handler |

---

## 9. Complete Environment Variables Reference

### Required for Core Functionality

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://qtxbbeyjvkhvciseswpr.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<jwt>
SUPABASE_SERVICE_ROLE_KEY=<jwt>

# Site
NEXT_PUBLIC_SITE_URL=https://www.dekhopanchang.com
```

### Required for Payments (Stripe)

```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_1THilQL0LseLnCB5rcW6jex5
STRIPE_PRICE_PRO_ANNUAL=price_1THilRL0LseLnCB5ICPhShLU
STRIPE_PRICE_JYOTISHI_MONTHLY=price_1THilRL0LseLnCB5Juy39vlP
STRIPE_PRICE_JYOTISHI_ANNUAL=price_1THilRL0LseLnCB5ZcpBHCoG
```

### Required for Payments (Razorpay — not yet configured)

```env
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_PLAN_PRO_MONTHLY=
RAZORPAY_PLAN_PRO_ANNUAL=
RAZORPAY_PLAN_JYOTISHI_MONTHLY=
RAZORPAY_PLAN_JYOTISHI_ANNUAL=
```

### Required for Cron Jobs

```env
CRON_SECRET=<strong-random-string-32+chars>
```

### Optional Services

```env
# AI Features
ANTHROPIC_API_KEY=sk-ant-...

# Email Alerts
RESEND_API_KEY=re_...

# Ads
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-4787764488539456
```

---

## 10. Webhook URLs to Register

| Service | URL | Notes |
|---------|-----|-------|
| Stripe | `https://www.dekhopanchang.com/api/webhooks/stripe` | Register in Stripe Dashboard > Developers > Webhooks |
| Razorpay | `https://www.dekhopanchang.com/api/webhooks/razorpay` | Register in Razorpay Dashboard > Settings > Webhooks |

### Stripe Webhook Events to Subscribe

- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_failed`

### Razorpay Webhook Events to Subscribe

- `subscription.activated`
- `subscription.charged`
- `subscription.cancelled`
- `subscription.paused`

---

## 11. Subscription Tiers

| Tier | Price (USD) | Price (INR) | Features |
|------|-------------|-------------|----------|
| Free | $0 | ₹0 | Basic panchang, limited kundali, ads shown |
| Pro | $4.99/mo or $39.99/yr | ₹149/mo or ₹1,199/yr | Full kundali, AI chat, no ads, 7-day free trial |
| Jyotishi | $9.99/mo or $79.99/yr | ₹299/mo or ₹2,399/yr | Everything + priority, unlimited exports |

Feature gating: `src/lib/subscription/api-gate.ts`
Tier definitions: `src/lib/subscription/tiers.ts`

---

## 12. Security Checklist

- [x] `.env.local` in `.gitignore`
- [x] No secrets in version control
- [x] Supabase RLS on all tables
- [x] Webhook signature verification (HMAC)
- [x] Rate limiting on AI endpoints (30/min per IP)
- [x] Cron routes protected by `CRON_SECRET`
- [x] Payment details handled by providers (PCI-DSS)
- [x] AI training bots blocked in `robots.txt`
- [ ] Set up Stripe webhook secret (currently missing)
- [ ] Configure Razorpay credentials
- [ ] Set up Resend API key
- [ ] Generate and set `CRON_SECRET`

---

## 13. Cohere (Vector Embeddings for RAG)

| Field | Value |
|-------|-------|
| **Purpose** | Semantic search embeddings for classical Jyotish text retrieval |
| **Status** | Optional — RAG features degrade gracefully without it |
| **Package** | N/A (REST API via fetch) |
| **Model** | `embed-multilingual-v3.0` (supports Sanskrit, Hindi, English) |
| **Dimensions** | 1024 |
| **Files** | `src/lib/rag/embeddings.ts`, `src/lib/rag/retriever.ts` |

| Variable | Required |
|----------|----------|
| `COHERE_API_KEY` | Optional |
| `EMBEDDING_PROVIDER` | Optional (default: `cohere`, alternative: `openai`) |

---

## 14. OpenAI (Alternative Embedding Provider)

| Field | Value |
|-------|-------|
| **Purpose** | Alternative to Cohere for vector embeddings |
| **Status** | Optional — only if `EMBEDDING_PROVIDER=openai` |
| **Model** | `text-embedding-3-small` |
| **Files** | `src/lib/rag/embeddings.ts` |

| Variable | Required |
|----------|----------|
| `OPENAI_API_KEY` | Optional |

---

## 15. Nominatim / OpenStreetMap (Geocoding)

| Field | Value |
|-------|-------|
| **Purpose** | Forward geocoding (city search → lat/lng) and reverse geocoding (lat/lng → city name) |
| **Endpoints** | `nominatim.openstreetmap.org/search` and `/reverse` |
| **Auth** | None (public API, 1 req/sec policy) |
| **Files** | `src/components/ui/LocationSearch.tsx`, `src/stores/location-store.ts` |

---

## 16. ipapi.co (IP Geolocation Fallback)

| Field | Value |
|-------|-------|
| **Purpose** | Detect user location from IP when browser geolocation denied |
| **Endpoint** | `https://ipapi.co/json/` |
| **Returns** | latitude, longitude, city, country_name, timezone (IANA) |
| **Auth** | None (free tier: 1000 req/day) |
| **Files** | `src/stores/location-store.ts` |

---

## 17. Swiss Ephemeris (Astronomy Engine)

| Field | Value |
|-------|-------|
| **Purpose** | High-precision planetary position calculations |
| **Package** | `sweph@^2.10.3-b-1` (native Node.js binding) |
| **Accuracy** | ~0.001° longitude (vs Meeus fallback ~0.01° Sun, ~0.3° Moon) |
| **Files** | `src/lib/ephem/swiss-ephemeris.ts`, `next.config.ts` (native bundling) |
| **Fallback** | Pure JS Meeus algorithms — app works without SwEph |

---

## 18. Browser APIs Used

| API | Purpose | Files |
|-----|---------|-------|
| `Intl.DateTimeFormat` | DST-aware timezone resolution | `src/lib/utils/timezone.ts` |
| `navigator.geolocation` | GPS location detection | `src/stores/location-store.ts` |
| `Notification API` | Rahu Kaal / festival alerts | `src/lib/notifications/` |
| `Service Worker` | PWA offline support | `public/sw.js` |
| `localStorage` | Location, theme, birth data persistence | Multiple stores |
| `window.print()` | PDF export via browser print | `src/components/ui/PrintButton.tsx` |

---

## 19. Key npm Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.1 | React framework (App Router) |
| `react` | 19.x | UI library |
| `tailwindcss` | 4.x | Utility-first CSS |
| `framer-motion` | ^12.38.0 | Animations |
| `d3` | ^7.9.0 | Data visualization |
| `zustand` | ^5.0.12 | State management |
| `zod` | ^4.3.6 | Schema validation |
| `next-intl` | ^4.8.3 | i18n (en/hi/sa) |
| `jspdf` | ^4.2.1 | PDF generation |
| `lucide-react` | ^0.511.0 | Icon library |
| `sweph` | ^2.10.3-b-1 | Swiss Ephemeris bindings |
| `stripe` | ^21.0.1 | Stripe payments SDK |
| `razorpay` | ^2.9.6 | Razorpay payments SDK |
| `resend` | ^6.10.0 | Email delivery |
| `@anthropic-ai/sdk` | ^0.80.0 | Claude AI SDK |
| `@vercel/analytics` | ^2.0.1 | Analytics |
| `@vercel/speed-insights` | ^2.0.0 | Core Web Vitals |

---

## 20. App Statistics (as of April 3, 2026)

| Metric | Value |
|--------|-------|
| Total pages | 520+ |
| Learn modules | 83 (10 phases) |
| Interactive labs | 5 |
| Puja vidhis | 40 (30 festivals/vrats + 10 new) |
| Graha shanti pujas | 9 |
| Sankalpa generator | 1 (with Amant/Purnimant toggle) |
| API routes | 22 |
| Tests | 73 (kundali + panchang + timezone validation) |
| Locales | 3 (English, Hindi, Sanskrit) |
| Supported timezones | All IANA (DST-aware) |

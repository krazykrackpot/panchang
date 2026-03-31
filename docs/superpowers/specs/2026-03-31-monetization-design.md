# Monetization Design: Panchang Premium

**Date:** 2026-03-31
**Status:** Approved

---

## 1. Overview

Three-tier freemium model (Free / Pro / Jyotishi) with dual payment providers (Razorpay for India, Stripe for international), usage-based gating, Google AdSense on free-tier pages, and a 7-day no-card trial.

---

## 2. Tier Structure

| | **Free** | **Pro** (Rs 149/mo - $5/mo) | **Jyotishi** (Rs 499/mo - $15/mo) |
|---|---|---|---|
| Daily Panchang/Calendar | Yes (with ads) | Ad-free | Ad-free |
| Kundali Generation | 2/day | Unlimited | Unlimited |
| AI Chart Chat | 2/day | 20/day | Unlimited |
| Saved Charts | 3 total | 25 | Unlimited |
| PDF Export | Watermarked | Clean | Clean + custom branding |
| Matching Reports | Score only | Full detailed | Full + comparative |
| Graha/Shadbala/Bhavabala | Summary view | Full tables | Full + CSV export |
| Yogas tab | Present yogas only | All 50 with details | All + export |
| Varshaphal/KP/Prashna | Locked | Full access | Full access |
| Muhurta AI | 2 scans/month | 10 scans/month | Unlimited |
| Tippanni | Basic personality | Full + classical refs | Full + RAG |
| Varga Analysis | D1 + D9 only | All 17 charts | All + export |
| Batch chart processing | No | No | Up to 50 charts |
| API access | No | No | REST API with key |
| Annual discount | - | Rs 1,199/yr (33% off) - $39/yr | Rs 3,999/yr (33% off) - $119/yr |

---

## 3. Payment Infrastructure

### 3.1 Providers
- **India (INR)**: Razorpay — UPI, cards, net banking, wallets
- **International (USD)**: Stripe — cards, Apple Pay, Google Pay
- **Region detection**: IP-based geolocation → show INR or USD pricing. User can toggle manually.

### 3.2 Subscription Flow
1. User clicks "Upgrade" → `/pricing` page
2. Region auto-detected, pricing shown in local currency
3. User selects plan (Pro/Jyotishi) and billing cycle (monthly/annual)
4. Redirect to Razorpay Checkout (India) or Stripe Checkout (international)
5. On success → webhook fires → `subscriptions` table updated → user redirected to app
6. On failure → user stays on pricing page with error message

### 3.3 Trial
- 7-day Pro trial on first signup (no card required)
- Trial users get full Pro features
- At trial end → downgrade to Free automatically
- Only one trial per email/account

### 3.4 Webhook Endpoints
- `POST /api/webhooks/razorpay` — subscription.activated, subscription.charged, subscription.cancelled, subscription.paused
- `POST /api/webhooks/stripe` — checkout.session.completed, customer.subscription.updated, customer.subscription.deleted, invoice.payment_failed

### 3.5 Environment Variables
```
# Razorpay
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=...
RAZORPAY_WEBHOOK_SECRET=...
RAZORPAY_PLAN_PRO_MONTHLY=plan_...
RAZORPAY_PLAN_PRO_ANNUAL=plan_...
RAZORPAY_PLAN_JYOTISHI_MONTHLY=plan_...
RAZORPAY_PLAN_JYOTISHI_ANNUAL=plan_...

# Stripe
STRIPE_SECRET_KEY=sk_...
STRIPE_PUBLISHABLE_KEY=pk_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_JYOTISHI_MONTHLY=price_...
STRIPE_PRICE_JYOTISHI_ANNUAL=price_...
```

---

## 4. Database Schema

### 4.1 Subscriptions Table
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'jyotishi')),
  provider TEXT CHECK (provider IN ('razorpay', 'stripe')),
  provider_subscription_id TEXT,
  provider_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'trialing', 'cancelled', 'past_due', 'expired')),
  billing_cycle TEXT CHECK (billing_cycle IN ('monthly', 'annual')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages subscriptions" ON subscriptions FOR ALL USING (auth.role() = 'service_role');
```

### 4.2 Usage Tracking Table
```sql
CREATE TABLE daily_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  kundali_count INT DEFAULT 0,
  ai_chat_count INT DEFAULT 0,
  muhurta_scan_count INT DEFAULT 0,
  pdf_export_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, usage_date)
);

ALTER TABLE daily_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own usage" ON daily_usage FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role manages usage" ON daily_usage FOR ALL USING (auth.role() = 'service_role');

-- Increment function for atomic usage updates
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_field TEXT)
RETURNS INT AS $$
DECLARE
  current_val INT;
BEGIN
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  EXECUTE format('UPDATE daily_usage SET %I = %I + 1 WHERE user_id = $1 AND usage_date = CURRENT_DATE RETURNING %I', p_field, p_field, p_field)
  INTO current_val USING p_user_id;

  RETURN current_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Gating Architecture

### 5.1 Tier Configuration — `src/lib/subscription/tiers.ts`

```typescript
type Tier = 'free' | 'pro' | 'jyotishi';
type Feature = 'kundali' | 'ai_chat' | 'saved_charts' | 'pdf_export' | 'matching_full'
  | 'shadbala_full' | 'yogas_full' | 'varshaphal' | 'kp_system' | 'prashna'
  | 'muhurta_ai' | 'tippanni_full' | 'varga_full' | 'batch' | 'api_access' | 'ad_free';

interface TierLimits {
  daily: Record<string, number>;   // daily usage caps (-1 = unlimited)
  monthly: Record<string, number>; // monthly usage caps
  total: Record<string, number>;   // lifetime caps (e.g., saved charts)
  features: Set<Feature>;          // boolean feature access
}
```

Exports: `TIER_CONFIG`, `checkFeatureAccess(feature, tier)`, `getUsageLimit(feature, tier)`.

### 5.2 Server-Side Tier Check — `src/lib/subscription/check-access.ts`

```typescript
async function getUserTier(userId: string): Promise<{ tier: Tier; status: string }>
async function checkAndIncrementUsage(userId: string, feature: string): Promise<{ allowed: boolean; remaining: number; limit: number }>
async function requireTier(userId: string, minTier: Tier): Promise<boolean>
```

Uses Supabase service role client. Caches tier in memory for 60 seconds to avoid DB hits on every request.

### 5.3 Client-Side Hook — `src/hooks/useSubscription.ts`

```typescript
function useSubscription(): {
  tier: Tier;
  status: string;
  isLoading: boolean;
  canAccess: (feature: Feature) => boolean;
  usage: Record<string, { used: number; limit: number }>;
  refetchUsage: () => void;
}
```

Reads from Supabase, updates on mount and after actions. Stored in Zustand for cross-component access.

### 5.4 Paywall Gate Component — `src/components/ui/PaywallGate.tsx`

```typescript
<PaywallGate feature="varshaphal" fallback={<UpgradePrompt feature="varshaphal" />}>
  <VarshaphalContent />
</PaywallGate>
```

- For hard-locked features: shows upgrade prompt with feature description and pricing
- For usage-limited features: shows remaining count + upgrade CTA when exhausted
- For content-depth gates: renders partial content with blur overlay + upgrade CTA

### 5.5 API Middleware — `src/lib/subscription/api-gate.ts`

```typescript
async function withTierGate(req: Request, feature: Feature): Promise<{ allowed: boolean; tier: Tier; error?: Response }>
```

Used in API route handlers before processing. Returns 403 with upgrade prompt JSON if not allowed.

---

## 6. Feature Gating Map

### 6.1 Hard Locks (page-level)
| Feature | Free | Pro | Jyotishi |
|---------|------|-----|----------|
| Varshaphal page | Locked | Open | Open |
| KP System page | Locked | Open | Open |
| Prashna page | Locked | Open | Open |
| Batch processing | Locked | Locked | Open |
| API access | Locked | Locked | Open |

Implementation: Check tier in page component, render `<PaywallGate>` wrapper.

### 6.2 Usage Limits (per-action)
| Feature | Free | Pro | Jyotishi |
|---------|------|-----|----------|
| Kundali gen | 2/day | -1 (unlimited) | -1 |
| AI chat | 2/day | 20/day | -1 |
| Muhurta AI scans | 2/month | 10/month | -1 |
| PDF exports | 2/day | -1 | -1 |

Implementation: `checkAndIncrementUsage()` in API routes before computation.

### 6.3 Content Depth (partial rendering)
| Feature | Free | Pro | Jyotishi |
|---------|------|-----|----------|
| Matching report | Guna score only | Full report | Full + comparative |
| Shadbala/Bhavabala | Top 3 planets only | Full 7-planet table | Full + export |
| Yogas | Present yogas only | All 50 | All + export |
| Tippanni | Personality section | All sections + refs | All + RAG |
| Varga analysis | D1 + D9 only | All 17 charts | All + export |

Implementation: Pass `tier` to render components, conditionally render sections with blur overlay on locked parts.

### 6.4 Quality Gates
| Feature | Free | Pro | Jyotishi |
|---------|------|-----|----------|
| PDF export | Watermarked footer | Clean | Custom branding |
| Saved charts | 3 max | 25 max | Unlimited |
| Ad display | Yes (panchang, calendar, learn) | No | No |

---

## 7. Google AdSense Integration

### 7.1 Ad Placement Strategy

**Pages with ads (free tier only):**
- Homepage (`/`)
- Panchang daily view (`/panchang`)
- Calendar (`/calendar`)
- All Learn pages (`/learn/*`)
- Festival/transit/retrograde/eclipse calendars
- About page

**Pages WITHOUT ads (even on free tier):**
- Kundali page (conversion funnel)
- Matching page (conversion funnel)
- Pricing page
- Auth/profile pages
- Any page during active chart interaction

### 7.2 Ad Slots

3 standard placements per eligible page:
1. **Leaderboard** (728x90) — below the page header, above main content
2. **In-content** (300x250 or responsive) — between content sections (e.g., between panchang cards)
3. **Sticky footer** (320x50 mobile / 728x90 desktop) — bottom of viewport, dismissible

### 7.3 Implementation

**Component:** `src/components/ads/AdUnit.tsx`
```typescript
interface AdUnitProps {
  slot: string;        // AdSense slot ID
  format: 'leaderboard' | 'rectangle' | 'sticky-footer';
  className?: string;
}
```

- Only renders if `tier === 'free'`
- Uses `useSubscription()` hook to check tier
- Loads Google AdSense script dynamically (no impact on paid users' bundle)
- Responsive sizing via AdSense auto-format
- Respects `adsbygoogle` queue for SPA navigation

**Layout integration:** Add `<AdUnit>` to page layouts conditionally. Use a wrapper `<AdSlot>` that renders nothing for paid users.

### 7.4 Environment Variables
```
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_LEADERBOARD=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_RECTANGLE=XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_SLOT_FOOTER=XXXXXXXXXX
```

### 7.5 AdSense Setup Steps
1. Apply for Google AdSense account with the domain
2. Add site verification meta tag to layout
3. Create 3 ad units in AdSense dashboard
4. Configure ad categories (block irrelevant categories)
5. Enable Auto ads as fallback for pages without manual placements

---

## 8. Pricing Page — `/[locale]/pricing`

### 8.1 Structure
- Hero: "Unlock the Full Power of Vedic Astrology"
- Toggle: Monthly / Annual (show savings)
- Currency auto-detected (INR/USD), manual toggle available
- 3-column comparison table (Free / Pro / Jyotishi)
- Each plan: feature list, price, CTA button
- FAQ section below
- Trilingual support (EN/HI/SA)

### 8.2 Checkout Flow
1. CTA click → check auth (prompt login if not signed in)
2. Detect region → select provider (Razorpay for India, Stripe for intl)
3. Create checkout session via API (`POST /api/checkout`)
4. Redirect to provider's hosted checkout page
5. Webhook confirms payment → subscription activated
6. Redirect back to `/pricing?success=true` → show confirmation

### 8.3 API Routes
- `POST /api/checkout` — Create checkout session (Razorpay or Stripe based on region)
- `POST /api/webhooks/razorpay` — Handle Razorpay subscription events
- `POST /api/webhooks/stripe` — Handle Stripe subscription events
- `GET /api/subscription` — Get current user's subscription status
- `POST /api/subscription/cancel` — Cancel subscription (end of period)
- `POST /api/subscription/portal` — Redirect to billing portal (Stripe) or manage page (Razorpay)

---

## 9. Subscription Store — `src/stores/subscription-store.ts`

Zustand store synced with Supabase:
```typescript
interface SubscriptionState {
  tier: 'free' | 'pro' | 'jyotishi';
  status: 'active' | 'trialing' | 'cancelled' | 'past_due' | 'expired';
  currentPeriodEnd: string | null;
  isTrialing: boolean;
  trialDaysLeft: number;
  usage: { kundali: number; aiChat: number; muhurtaScan: number; pdfExport: number };
  usageLimits: Record<string, number>;
  isLoading: boolean;
  fetchSubscription: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  incrementUsage: (feature: string) => Promise<{ allowed: boolean; remaining: number }>;
}
```

---

## 10. File Plan

### New Files
| File | Purpose |
|------|---------|
| `src/lib/subscription/tiers.ts` | Tier configuration, limits, feature access |
| `src/lib/subscription/check-access.ts` | Server-side tier + usage checking |
| `src/lib/subscription/api-gate.ts` | API route middleware for tier gating |
| `src/stores/subscription-store.ts` | Client-side subscription state (Zustand) |
| `src/hooks/useSubscription.ts` | React hook wrapping the store |
| `src/components/ui/PaywallGate.tsx` | Feature gating wrapper component |
| `src/components/ui/UpgradePrompt.tsx` | Upgrade CTA with feature highlights |
| `src/components/ads/AdUnit.tsx` | Google AdSense ad component |
| `src/components/ads/AdSlot.tsx` | Tier-aware ad wrapper (renders nothing for paid) |
| `src/app/[locale]/pricing/page.tsx` | Pricing comparison page |
| `src/app/api/checkout/route.ts` | Create checkout session |
| `src/app/api/webhooks/razorpay/route.ts` | Razorpay webhook handler |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler |
| `src/app/api/subscription/route.ts` | Get subscription status |
| `src/app/api/subscription/cancel/route.ts` | Cancel subscription |
| `supabase/migrations/003_subscriptions.sql` | Subscriptions + usage tables |

### Modified Files
| File | Changes |
|------|---------|
| `src/app/api/kundali/route.ts` | Add usage gate |
| `src/app/api/chart-chat/route.ts` | Add usage gate |
| `src/app/api/muhurta-ai/route.ts` | Add usage gate |
| `src/app/api/matching/route.ts` | Add tier gate for full report |
| `src/app/api/varshaphal/route.ts` | Add tier gate (Pro+) |
| `src/app/api/kp-system/route.ts` | Add tier gate (Pro+) |
| `src/app/api/prashna-ashtamangala/route.ts` | Add tier gate (Pro+) |
| `src/app/[locale]/kundali/page.tsx` | Add PaywallGate on depth-gated tabs |
| `src/app/[locale]/panchang/page.tsx` | Add AdSlot placements |
| `src/app/[locale]/calendar/page.tsx` | Add AdSlot placements |
| `src/app/[locale]/layout.tsx` | Load AdSense script for free tier |
| `src/components/kundali/BirthForm.tsx` | Show usage remaining count |
| `package.json` | Add razorpay, stripe dependencies |
| `.env.example` | Add payment + AdSense env vars |

### Dependencies to Add
```
npm install razorpay stripe
```

---

## 11. Implementation Order

1. **Database migration** — subscriptions + usage tables
2. **Tier config + server checks** — tiers.ts, check-access.ts, api-gate.ts
3. **Subscription store + hook** — subscription-store.ts, useSubscription.ts
4. **Paywall components** — PaywallGate.tsx, UpgradePrompt.tsx
5. **Pricing page** — pricing/page.tsx with plan comparison
6. **Checkout API** — checkout/route.ts (Razorpay + Stripe)
7. **Webhook handlers** — razorpay + stripe webhook routes
8. **Subscription management API** — status, cancel, portal
9. **Gate existing APIs** — kundali, chat, muhurta-ai, matching, varshaphal, kp, prashna
10. **Gate existing UI** — kundali tabs, matching page, advanced pages
11. **Ad integration** — AdUnit, AdSlot, placements on free-tier pages
12. **Trial system** — auto-create 7-day trial on signup

# Panchang Premium Monetization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 3-tier freemium system (Free/Pro/Jyotishi) with Razorpay + Stripe payments, usage-based gating, and Google AdSense.

**Architecture:** Supabase stores subscriptions and daily usage. Server-side middleware gates API routes by tier + usage. Client-side Zustand store + `useSubscription` hook drives UI gating. PaywallGate component wraps locked features. Pricing page handles checkout via Razorpay (India) or Stripe (international).

**Tech Stack:** Next.js 16, Supabase (PostgreSQL + Auth), Zustand, Razorpay SDK, Stripe SDK, Google AdSense.

---

## File Map

| File | Responsibility |
|------|---------------|
| `supabase/migrations/003_subscriptions.sql` | DB tables: subscriptions, daily_usage, increment_usage() |
| `src/lib/subscription/tiers.ts` | Tier config, limits, feature access checks (pure data) |
| `src/lib/subscription/check-access.ts` | Server-side tier lookup + usage increment (Supabase service role) |
| `src/lib/subscription/api-gate.ts` | API route middleware — check tier before processing |
| `src/stores/subscription-store.ts` | Client-side Zustand store for tier + usage state |
| `src/hooks/useSubscription.ts` | React hook wrapping the store |
| `src/components/ui/PaywallGate.tsx` | Wraps gated content, shows upgrade prompt or blur |
| `src/components/ui/UpgradePrompt.tsx` | Upgrade CTA card with feature descriptions |
| `src/components/ads/AdUnit.tsx` | Google AdSense ad component |
| `src/app/[locale]/pricing/page.tsx` | Pricing comparison page with checkout |
| `src/app/api/checkout/route.ts` | Create Razorpay/Stripe checkout session |
| `src/app/api/webhooks/razorpay/route.ts` | Razorpay subscription webhook handler |
| `src/app/api/webhooks/stripe/route.ts` | Stripe subscription webhook handler |
| `src/app/api/subscription/route.ts` | GET subscription status + POST cancel |

---

### Task 1: Database Migration

**Files:**
- Create: `supabase/migrations/003_subscriptions.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- 003_subscriptions.sql
-- Subscription tiers and daily usage tracking

CREATE TABLE IF NOT EXISTS subscriptions (
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

CREATE TABLE IF NOT EXISTS daily_usage (
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

CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_field TEXT)
RETURNS INT AS $$
DECLARE
  current_val INT;
BEGIN
  INSERT INTO daily_usage (user_id, usage_date)
  VALUES (p_user_id, CURRENT_DATE)
  ON CONFLICT (user_id, usage_date) DO NOTHING;

  EXECUTE format(
    'UPDATE daily_usage SET %I = %I + 1 WHERE user_id = $1 AND usage_date = CURRENT_DATE RETURNING %I',
    p_field, p_field, p_field
  ) INTO current_val USING p_user_id;

  RETURN current_val;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Auto-create free subscription on user signup
CREATE OR REPLACE FUNCTION create_default_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, tier, status, trial_start, trial_end)
  VALUES (NEW.id, 'pro', 'trialing', NOW(), NOW() + INTERVAL '7 days');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_default_subscription();
```

- [ ] **Step 2: Apply migration to Supabase**

Run the SQL in the Supabase dashboard SQL editor, or via CLI:
```bash
supabase db push
```

- [ ] **Step 3: Commit**

```bash
git add supabase/migrations/003_subscriptions.sql
git commit -m "feat: add subscriptions and usage tracking tables"
```

---

### Task 2: Tier Configuration

**Files:**
- Create: `src/lib/subscription/tiers.ts`

- [ ] **Step 1: Create tier configuration**

```typescript
// src/lib/subscription/tiers.ts
// Pure data — no imports, no async, no side effects

export type Tier = 'free' | 'pro' | 'jyotishi';

export type Feature =
  | 'kundali' | 'ai_chat' | 'saved_charts' | 'pdf_export'
  | 'matching_full' | 'shadbala_full' | 'yogas_full'
  | 'varshaphal' | 'kp_system' | 'prashna'
  | 'muhurta_ai' | 'tippanni_full' | 'varga_full'
  | 'batch' | 'api_access' | 'ad_free';

export type UsageFeature = 'kundali_count' | 'ai_chat_count' | 'muhurta_scan_count' | 'pdf_export_count';

interface TierConfig {
  daily: Partial<Record<UsageFeature, number>>;   // -1 = unlimited
  monthly: Partial<Record<UsageFeature, number>>;
  total: Partial<Record<string, number>>;          // e.g. saved_charts
  features: Set<Feature>;
}

export const TIER_CONFIG: Record<Tier, TierConfig> = {
  free: {
    daily: { kundali_count: 2, ai_chat_count: 2, pdf_export_count: 2 },
    monthly: { muhurta_scan_count: 2 },
    total: { saved_charts: 3 },
    features: new Set<Feature>(['kundali', 'ai_chat', 'pdf_export', 'muhurta_ai']),
  },
  pro: {
    daily: { kundali_count: -1, ai_chat_count: 20, pdf_export_count: -1 },
    monthly: { muhurta_scan_count: 10 },
    total: { saved_charts: 25 },
    features: new Set<Feature>([
      'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
    ]),
  },
  jyotishi: {
    daily: { kundali_count: -1, ai_chat_count: -1, pdf_export_count: -1 },
    monthly: { muhurta_scan_count: -1 },
    total: { saved_charts: -1 },
    features: new Set<Feature>([
      'kundali', 'ai_chat', 'pdf_export', 'muhurta_ai',
      'matching_full', 'shadbala_full', 'yogas_full',
      'varshaphal', 'kp_system', 'prashna',
      'tippanni_full', 'varga_full', 'ad_free',
      'batch', 'api_access',
    ]),
  },
};

export function checkFeatureAccess(feature: Feature, tier: Tier): boolean {
  return TIER_CONFIG[tier].features.has(feature);
}

export function getUsageLimit(feature: UsageFeature, tier: Tier): { limit: number; period: 'daily' | 'monthly' } {
  const config = TIER_CONFIG[tier];
  if (feature in (config.daily || {})) {
    return { limit: config.daily[feature] ?? -1, period: 'daily' };
  }
  if (feature in (config.monthly || {})) {
    return { limit: config.monthly[feature] ?? -1, period: 'monthly' };
  }
  return { limit: -1, period: 'daily' };
}

export function getTotalLimit(key: string, tier: Tier): number {
  return TIER_CONFIG[tier].total[key] ?? -1;
}

// Minimum tier required for a feature
export function minTierForFeature(feature: Feature): Tier {
  if (TIER_CONFIG.free.features.has(feature)) return 'free';
  if (TIER_CONFIG.pro.features.has(feature)) return 'pro';
  return 'jyotishi';
}

// Feature display info for upgrade prompts
export const FEATURE_INFO: Record<Feature, { en: string; hi: string }> = {
  kundali: { en: 'Kundali Generation', hi: 'कुण्डली निर्माण' },
  ai_chat: { en: 'AI Chart Chat', hi: 'AI चार्ट चैट' },
  saved_charts: { en: 'Saved Charts', hi: 'सहेजे गए चार्ट' },
  pdf_export: { en: 'PDF Export', hi: 'PDF निर्यात' },
  matching_full: { en: 'Full Matching Report', hi: 'पूर्ण मिलान रिपोर्ट' },
  shadbala_full: { en: 'Full Shadbala Analysis', hi: 'पूर्ण षड्बल विश्लेषण' },
  yogas_full: { en: 'Complete Yoga Analysis', hi: 'पूर्ण योग विश्लेषण' },
  varshaphal: { en: 'Varshaphal (Annual)', hi: 'वर्षफल' },
  kp_system: { en: 'KP System', hi: 'केपी पद्धति' },
  prashna: { en: 'Prashna Kundali', hi: 'प्रश्न कुण्डली' },
  muhurta_ai: { en: 'Muhurta AI Scanner', hi: 'मुहूर्त AI स्कैनर' },
  tippanni_full: { en: 'Full Interpretations', hi: 'पूर्ण टिप्पणी' },
  varga_full: { en: 'All Divisional Charts', hi: 'सभी विभागीय चार्ट' },
  batch: { en: 'Batch Processing', hi: 'बैच प्रोसेसिंग' },
  api_access: { en: 'API Access', hi: 'API एक्सेस' },
  ad_free: { en: 'Ad-Free Experience', hi: 'विज्ञापन-मुक्त अनुभव' },
};
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/subscription/tiers.ts
git commit -m "feat: add tier configuration with limits and feature access"
```

---

### Task 3: Server-Side Access Checks

**Files:**
- Create: `src/lib/subscription/check-access.ts`

- [ ] **Step 1: Create server-side access checker**

```typescript
// src/lib/subscription/check-access.ts
// Server-side only — uses Supabase service role

import { getServerSupabase } from '@/lib/supabase/server';
import { type Tier, type UsageFeature, getUsageLimit } from './tiers';

interface TierResult {
  tier: Tier;
  status: string;
}

// In-memory tier cache (60s TTL) to avoid DB hits on every request
const tierCache = new Map<string, { data: TierResult; expiry: number }>();

export async function getUserTier(userId: string): Promise<TierResult> {
  // Check cache
  const cached = tierCache.get(userId);
  if (cached && cached.expiry > Date.now()) return cached.data;

  const supabase = getServerSupabase();
  const { data } = await supabase
    .from('subscriptions')
    .select('tier, status, current_period_end, trial_end')
    .eq('user_id', userId)
    .single();

  if (!data) {
    const result: TierResult = { tier: 'free', status: 'active' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  // Check if trial expired
  if (data.status === 'trialing' && data.trial_end && new Date(data.trial_end) < new Date()) {
    await supabase
      .from('subscriptions')
      .update({ tier: 'free', status: 'expired' })
      .eq('user_id', userId);
    const result: TierResult = { tier: 'free', status: 'expired' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  // Check if subscription expired
  if (data.status === 'cancelled' && data.current_period_end && new Date(data.current_period_end) < new Date()) {
    await supabase
      .from('subscriptions')
      .update({ tier: 'free', status: 'expired' })
      .eq('user_id', userId);
    const result: TierResult = { tier: 'free', status: 'expired' };
    tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
    return result;
  }

  const activeTiers: string[] = ['active', 'trialing'];
  const tier: Tier = activeTiers.includes(data.status) ? (data.tier as Tier) : 'free';
  const result: TierResult = { tier, status: data.status };
  tierCache.set(userId, { data: result, expiry: Date.now() + 60000 });
  return result;
}

export async function checkAndIncrementUsage(
  userId: string,
  feature: UsageFeature,
  tier: Tier,
): Promise<{ allowed: boolean; remaining: number; limit: number }> {
  const { limit, period } = getUsageLimit(feature, tier);
  if (limit === -1) return { allowed: true, remaining: -1, limit: -1 };

  const supabase = getServerSupabase();

  if (period === 'daily') {
    // Get today's usage
    const { data } = await supabase
      .from('daily_usage')
      .select(feature)
      .eq('user_id', userId)
      .eq('usage_date', new Date().toISOString().split('T')[0])
      .single();

    const currentCount = data?.[feature] ?? 0;
    if (currentCount >= limit) {
      return { allowed: false, remaining: 0, limit };
    }

    // Increment
    await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
    return { allowed: true, remaining: limit - currentCount - 1, limit };
  }

  // Monthly: check all rows for this month
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const { data: rows } = await supabase
    .from('daily_usage')
    .select(feature)
    .eq('user_id', userId)
    .gte('usage_date', monthStart.toISOString().split('T')[0]);

  const totalUsed = (rows || []).reduce((sum, r) => sum + (r[feature] ?? 0), 0);
  if (totalUsed >= limit) {
    return { allowed: false, remaining: 0, limit };
  }

  await supabase.rpc('increment_usage', { p_user_id: userId, p_field: feature });
  return { allowed: true, remaining: limit - totalUsed - 1, limit };
}

// Invalidate cache when subscription changes (called from webhooks)
export function invalidateTierCache(userId: string): void {
  tierCache.delete(userId);
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/subscription/check-access.ts
git commit -m "feat: add server-side tier and usage checking"
```

---

### Task 4: API Gate Middleware

**Files:**
- Create: `src/lib/subscription/api-gate.ts`

- [ ] **Step 1: Create the API gate**

```typescript
// src/lib/subscription/api-gate.ts
// Middleware for API routes — checks tier + usage before processing

import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase/server';
import { getUserTier, checkAndIncrementUsage } from './check-access';
import { type Feature, type UsageFeature, checkFeatureAccess, minTierForFeature, FEATURE_INFO } from './tiers';

interface GateResult {
  allowed: boolean;
  userId: string;
  tier: 'free' | 'pro' | 'jyotishi';
  error?: NextResponse;
}

// Extract user ID from the request's auth token
async function extractUserId(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice(7);
  const supabase = getServerSupabase();
  const { data } = await supabase.auth.getUser(token);
  return data.user?.id ?? null;
}

// For cookie-based auth (Next.js pages sending fetch from client)
async function extractUserIdFromCookie(req: Request): Promise<string | null> {
  // Try auth header first
  const fromHeader = await extractUserId(req);
  if (fromHeader) return fromHeader;

  // For same-origin requests, check via anon client with cookie forwarding
  // The client sends credentials, so we can check via the service role
  return null;
}

export async function withFeatureGate(req: Request, feature: Feature): Promise<GateResult> {
  const userId = await extractUserIdFromCookie(req);

  // Anonymous users get free tier
  if (!userId) {
    const hasAccess = checkFeatureAccess(feature, 'free');
    if (!hasAccess) {
      const minTier = minTierForFeature(feature);
      return {
        allowed: false,
        userId: '',
        tier: 'free',
        error: NextResponse.json({
          error: 'upgrade_required',
          feature,
          featureName: FEATURE_INFO[feature]?.en || feature,
          requiredTier: minTier,
          message: `This feature requires a ${minTier} subscription.`,
        }, { status: 403 }),
      };
    }
    return { allowed: true, userId: '', tier: 'free' };
  }

  const { tier } = await getUserTier(userId);
  const hasAccess = checkFeatureAccess(feature, tier);

  if (!hasAccess) {
    const minTier = minTierForFeature(feature);
    return {
      allowed: false,
      userId,
      tier,
      error: NextResponse.json({
        error: 'upgrade_required',
        feature,
        featureName: FEATURE_INFO[feature]?.en || feature,
        requiredTier: minTier,
        message: `This feature requires a ${minTier} subscription. You are on the ${tier} plan.`,
      }, { status: 403 }),
    };
  }

  return { allowed: true, userId, tier };
}

export async function withUsageGate(req: Request, feature: Feature, usageField: UsageFeature): Promise<GateResult & { remaining?: number; limit?: number }> {
  const gate = await withFeatureGate(req, feature);
  if (!gate.allowed) return gate;

  // Anonymous users — apply free tier limits without tracking
  if (!gate.userId) {
    return { ...gate, remaining: 0, limit: 2 };
  }

  const usage = await checkAndIncrementUsage(gate.userId, usageField, gate.tier);
  if (!usage.allowed) {
    return {
      allowed: false,
      userId: gate.userId,
      tier: gate.tier,
      remaining: 0,
      limit: usage.limit,
      error: NextResponse.json({
        error: 'usage_limit_reached',
        feature,
        featureName: FEATURE_INFO[feature]?.en || feature,
        limit: usage.limit,
        message: `You have reached your daily limit of ${usage.limit} for this feature. Upgrade for more.`,
      }, { status: 429 }),
    };
  }

  return { ...gate, remaining: usage.remaining, limit: usage.limit };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add src/lib/subscription/api-gate.ts
git commit -m "feat: add API gate middleware for tier and usage checks"
```

---

### Task 5: Subscription Store + Hook

**Files:**
- Create: `src/stores/subscription-store.ts`
- Create: `src/hooks/useSubscription.ts`

- [ ] **Step 1: Create the Zustand store**

```typescript
// src/stores/subscription-store.ts
'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import { type Tier, type Feature, checkFeatureAccess, getUsageLimit, type UsageFeature, TIER_CONFIG } from '@/lib/subscription/tiers';

interface SubscriptionState {
  tier: Tier;
  status: string;
  currentPeriodEnd: string | null;
  isTrialing: boolean;
  trialDaysLeft: number;
  usage: Record<string, number>;
  isLoading: boolean;
  initialized: boolean;

  fetchSubscription: () => Promise<void>;
  fetchUsage: () => Promise<void>;
  canAccess: (feature: Feature) => boolean;
  getRemaining: (feature: UsageFeature) => { used: number; limit: number; remaining: number };
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  tier: 'free',
  status: 'active',
  currentPeriodEnd: null,
  isTrialing: false,
  trialDaysLeft: 0,
  usage: {},
  isLoading: true,
  initialized: false,

  fetchSubscription: async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      set({ tier: 'free', status: 'active', isLoading: false, initialized: true });
      return;
    }

    const { data } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!data) {
      set({ tier: 'free', status: 'active', isLoading: false, initialized: true });
      return;
    }

    const isTrialing = data.status === 'trialing';
    const trialEnd = data.trial_end ? new Date(data.trial_end) : null;
    const trialDaysLeft = trialEnd ? Math.max(0, Math.ceil((trialEnd.getTime() - Date.now()) / 86400000)) : 0;

    // Check if trial/subscription expired
    const activeTiers = ['active', 'trialing'];
    const tier: Tier = activeTiers.includes(data.status) ? (data.tier as Tier) : 'free';

    set({
      tier,
      status: data.status,
      currentPeriodEnd: data.current_period_end,
      isTrialing,
      trialDaysLeft,
      isLoading: false,
      initialized: true,
    });
  },

  fetchUsage: async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('daily_usage')
      .select('*')
      .eq('user_id', user.id)
      .eq('usage_date', today)
      .single();

    set({
      usage: {
        kundali_count: data?.kundali_count ?? 0,
        ai_chat_count: data?.ai_chat_count ?? 0,
        muhurta_scan_count: data?.muhurta_scan_count ?? 0,
        pdf_export_count: data?.pdf_export_count ?? 0,
      },
    });
  },

  canAccess: (feature: Feature) => checkFeatureAccess(feature, get().tier),

  getRemaining: (feature: UsageFeature) => {
    const { tier, usage } = get();
    const { limit } = getUsageLimit(feature, tier);
    const used = usage[feature] ?? 0;
    return {
      used,
      limit,
      remaining: limit === -1 ? -1 : Math.max(0, limit - used),
    };
  },
}));
```

- [ ] **Step 2: Create the React hook**

```typescript
// src/hooks/useSubscription.ts
'use client';

import { useEffect } from 'react';
import { useSubscriptionStore } from '@/stores/subscription-store';
import { useAuthStore } from '@/stores/auth-store';

export function useSubscription() {
  const store = useSubscriptionStore();
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    if (!store.initialized) {
      store.fetchSubscription();
      store.fetchUsage();
    }
  }, [user?.id, store.initialized]);

  // Re-fetch when user changes (login/logout)
  useEffect(() => {
    if (store.initialized) {
      store.fetchSubscription();
      store.fetchUsage();
    }
  }, [user?.id]);

  return store;
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/stores/subscription-store.ts src/hooks/useSubscription.ts
git commit -m "feat: add subscription store and useSubscription hook"
```

---

### Task 6: PaywallGate + UpgradePrompt Components

**Files:**
- Create: `src/components/ui/PaywallGate.tsx`
- Create: `src/components/ui/UpgradePrompt.tsx`

- [ ] **Step 1: Create UpgradePrompt**

```typescript
// src/components/ui/UpgradePrompt.tsx
'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import { type Feature, FEATURE_INFO, minTierForFeature } from '@/lib/subscription/tiers';
import type { Locale } from '@/types/panchang';

const TIER_PRICES: Record<string, { en: string; hi: string }> = {
  pro: { en: 'Pro — Rs 149/mo or $5/mo', hi: 'प्रो — ₹149/माह या $5/माह' },
  jyotishi: { en: 'Jyotishi — Rs 499/mo or $15/mo', hi: 'ज्योतिषी — ₹499/माह या $15/माह' },
};

export default function UpgradePrompt({ feature, compact = false }: { feature: Feature; compact?: boolean }) {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const info = FEATURE_INFO[feature];
  const requiredTier = minTierForFeature(feature);
  const price = TIER_PRICES[requiredTier];

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gold-primary/10 border border-gold-primary/20">
        <Lock className="w-3.5 h-3.5 text-gold-primary" />
        <span className="text-gold-light text-xs">
          {locale === 'en' ? `Upgrade to ${requiredTier}` : `${requiredTier} में अपग्रेड करें`}
        </span>
        <a href={`/${locale}/pricing`} className="text-gold-primary text-xs font-bold hover:underline ml-auto">
          {locale === 'en' ? 'View Plans' : 'योजनाएं देखें'}
        </a>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-2xl p-8 text-center border border-gold-primary/20 bg-gradient-to-br from-gold-primary/5 to-transparent max-w-md mx-auto"
    >
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gold-primary/10 flex items-center justify-center">
        <Lock className="w-8 h-8 text-gold-primary" />
      </div>
      <h3 className="text-gold-light text-xl font-bold mb-2" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' }}>
        {info?.[locale] || info?.en || feature}
      </h3>
      <p className="text-text-secondary text-sm mb-4" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
        {locale === 'en'
          ? `This feature requires a ${requiredTier} plan.`
          : `इस सुविधा के लिए ${requiredTier} योजना आवश्यक है।`}
      </p>
      <p className="text-gold-dark text-xs mb-6">{price?.[locale === 'sa' ? 'hi' : locale] || price?.en}</p>
      <a
        href={`/${locale}/pricing`}
        className="inline-block px-8 py-3 bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border-2 border-gold-primary/40 rounded-xl text-gold-light font-bold hover:bg-gold-primary/30 transition-all"
      >
        {locale === 'en' ? 'Upgrade Now' : 'अभी अपग्रेड करें'}
      </a>
    </motion.div>
  );
}
```

- [ ] **Step 2: Create PaywallGate**

```typescript
// src/components/ui/PaywallGate.tsx
'use client';

import { type ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { type Feature } from '@/lib/subscription/tiers';
import UpgradePrompt from './UpgradePrompt';

interface PaywallGateProps {
  feature: Feature;
  children: ReactNode;
  fallback?: ReactNode;           // Custom fallback instead of default UpgradePrompt
  blurContent?: ReactNode;        // Show this content blurred with upgrade overlay
}

export default function PaywallGate({ feature, children, fallback, blurContent }: PaywallGateProps) {
  const { canAccess, isLoading } = useSubscription();

  if (isLoading) {
    return <div className="animate-pulse h-32 bg-bg-secondary/30 rounded-xl" />;
  }

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  // Blur mode: show content with overlay
  if (blurContent) {
    return (
      <div className="relative">
        <div className="blur-sm pointer-events-none select-none opacity-60">
          {blurContent}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-bg-primary/40 backdrop-blur-[2px] rounded-xl">
          <UpgradePrompt feature={feature} />
        </div>
      </div>
    );
  }

  return <>{fallback || <UpgradePrompt feature={feature} />}</>;
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/PaywallGate.tsx src/components/ui/UpgradePrompt.tsx
git commit -m "feat: add PaywallGate and UpgradePrompt components"
```

---

### Task 7: Pricing Page

**Files:**
- Create: `src/app/[locale]/pricing/page.tsx`

- [ ] **Step 1: Create the pricing page**

This is a large file. Create `src/app/[locale]/pricing/page.tsx` with:
- `'use client'` directive
- Monthly/Annual toggle
- INR/USD currency toggle (auto-detected from browser timezone, Indian timezones default to INR)
- 3-column plan comparison (Free / Pro / Jyotishi)
- Each plan lists features with check/cross icons
- CTA buttons: Free = "Current Plan", Pro/Jyotishi = "Get Started" → links to `/api/checkout`
- Trial badge on Pro: "7-day free trial"
- FAQ section
- Trilingual labels (EN/HI/SA)
- Uses existing glass-card styling, gold gradients, Framer Motion animations
- Responsive: stacks vertically on mobile

Key features to highlight per plan (use checkmark/cross):
- Daily Panchang (all), Ad-free (Pro+), Kundali limits, AI Chat limits, Saved Charts limits
- Full Reports (Pro+), Shadbala/Yogas (Pro+), Varshaphal/KP/Prashna (Pro+)
- Varga Analysis (Pro+), Batch Processing (Jyotishi), API Access (Jyotishi)

CTA should call:
```typescript
const handleCheckout = async (tier: 'pro' | 'jyotishi') => {
  // Check if user is logged in
  if (!user) { openAuthModal(); return; }
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tier, billing: billingCycle, currency }),
  });
  const { url } = await res.json();
  if (url) window.location.href = url;
};
```

- [ ] **Step 2: Verify it compiles and renders**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "src/app/[locale]/pricing/page.tsx"
git commit -m "feat: add pricing page with plan comparison and checkout flow"
```

---

### Task 8: Install Payment Dependencies + Env Setup

**Files:**
- Modify: `package.json`
- Modify: `.env.example`

- [ ] **Step 1: Install Razorpay and Stripe**

```bash
npm install razorpay stripe
```

- [ ] **Step 2: Update .env.example**

Add these lines to `.env.example`:

```
# Payment — Razorpay (India)
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
RAZORPAY_PLAN_PRO_MONTHLY=
RAZORPAY_PLAN_PRO_ANNUAL=
RAZORPAY_PLAN_JYOTISHI_MONTHLY=
RAZORPAY_PLAN_JYOTISHI_ANNUAL=

# Payment — Stripe (International)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_PRO_MONTHLY=
STRIPE_PRICE_PRO_ANNUAL=
STRIPE_PRICE_JYOTISHI_MONTHLY=
STRIPE_PRICE_JYOTISHI_ANNUAL=

# Google AdSense
NEXT_PUBLIC_ADSENSE_CLIENT_ID=
```

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json .env.example
git commit -m "chore: add razorpay, stripe deps and env vars template"
```

---

### Task 9: Checkout + Webhook API Routes

**Files:**
- Create: `src/app/api/checkout/route.ts`
- Create: `src/app/api/webhooks/stripe/route.ts`
- Create: `src/app/api/webhooks/razorpay/route.ts`
- Create: `src/app/api/subscription/route.ts`

- [ ] **Step 1: Create checkout route**

`src/app/api/checkout/route.ts`:
- POST handler accepting `{ tier, billing, currency }`
- If `currency === 'INR'` → create Razorpay subscription using `razorpay.subscriptions.create()`
- If `currency === 'USD'` → create Stripe Checkout Session using `stripe.checkout.sessions.create()`
- Return `{ url }` for redirect
- Requires authenticated user (extract from auth header)

- [ ] **Step 2: Create Stripe webhook route**

`src/app/api/webhooks/stripe/route.ts`:
- Verify webhook signature using `stripe.webhooks.constructEvent()`
- Handle events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
- On `checkout.session.completed`: create/update subscription row in Supabase with tier, provider='stripe', status='active'
- On `customer.subscription.deleted`: set status='cancelled'
- On `invoice.payment_failed`: set status='past_due'
- Call `invalidateTierCache(userId)` after every update
- Export `const config = { api: { bodyParser: false } }` for raw body access

- [ ] **Step 3: Create Razorpay webhook route**

`src/app/api/webhooks/razorpay/route.ts`:
- Verify webhook signature using `crypto.createHmac('sha256', secret)`
- Handle events: `subscription.activated`, `subscription.charged`, `subscription.cancelled`, `subscription.paused`
- Same DB update logic as Stripe webhook
- Call `invalidateTierCache(userId)` after every update

- [ ] **Step 4: Create subscription status + cancel route**

`src/app/api/subscription/route.ts`:
- GET: return current user's subscription from Supabase
- POST with `{ action: 'cancel' }`: set `cancel_at_period_end = true`, call provider's cancel API

- [ ] **Step 5: Verify everything compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 6: Commit**

```bash
git add src/app/api/checkout/route.ts src/app/api/webhooks/ src/app/api/subscription/route.ts
git commit -m "feat: add checkout, webhook, and subscription management API routes"
```

---

### Task 10: Gate Existing API Routes

**Files:**
- Modify: `src/app/api/kundali/route.ts`
- Modify: `src/app/api/muhurta-ai/route.ts`
- Modify: `src/app/api/varshaphal/route.ts`
- Modify: `src/app/api/kp-system/route.ts`
- Modify: `src/app/api/prashna-ashtamangala/route.ts`

- [ ] **Step 1: Add usage gate to kundali API**

In `src/app/api/kundali/route.ts`, add at the top of the POST handler (before `generateKundali`):

```typescript
import { withUsageGate } from '@/lib/subscription/api-gate';

// Inside POST handler, before existing logic:
const gate = await withUsageGate(request, 'kundali', 'kundali_count');
if (!gate.allowed) return gate.error;
```

- [ ] **Step 2: Add usage gate to muhurta-ai API**

Same pattern in `src/app/api/muhurta-ai/route.ts`:

```typescript
import { withUsageGate } from '@/lib/subscription/api-gate';

const gate = await withUsageGate(request, 'muhurta_ai', 'muhurta_scan_count');
if (!gate.allowed) return gate.error;
```

- [ ] **Step 3: Add feature gate to varshaphal, kp-system, prashna APIs**

For each of these, add at the top of the handler:

```typescript
import { withFeatureGate } from '@/lib/subscription/api-gate';

const gate = await withFeatureGate(request, 'varshaphal'); // or 'kp_system' or 'prashna'
if (!gate.allowed) return gate.error;
```

- [ ] **Step 4: Verify everything compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/app/api/kundali/route.ts src/app/api/muhurta-ai/route.ts src/app/api/varshaphal/route.ts src/app/api/kp-system/route.ts src/app/api/prashna-ashtamangala/route.ts
git commit -m "feat: gate existing API routes with tier and usage checks"
```

---

### Task 11: Gate Kundali Page UI (Content Depth)

**Files:**
- Modify: `src/app/[locale]/kundali/page.tsx`

- [ ] **Step 1: Add PaywallGate to depth-gated tabs**

Import and wrap the gated tabs:

```typescript
import PaywallGate from '@/components/ui/PaywallGate';
```

Wrap these tab contents:
- **Shadbala tab**: `<PaywallGate feature="shadbala_full">` around `<ShadbalaTab />`
- **Bhavabala tab**: same with `shadbala_full`
- **Yogas tab**: For free tier, filter to only present yogas. Wrap full list with `<PaywallGate feature="yogas_full">`
- **Varga tab**: For free tier, only show D1+D9 insights. Wrap full list with `<PaywallGate feature="varga_full">`
- **Varshaphal/KP/Prashna pages**: Already gated at API level, but add `<PaywallGate>` wrapper on page for immediate UI feedback

Use the `blurContent` prop to show a teaser:
```tsx
<PaywallGate feature="shadbala_full" blurContent={<ShadbalaTab shadbala={kundali.fullShadbala!} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />}>
  <ShadbalaTab shadbala={kundali.fullShadbala!} locale={locale} isDevanagari={isDevanagari} headingFont={headingFont} />
</PaywallGate>
```

- [ ] **Step 2: Show usage remaining on BirthForm**

In `src/components/kundali/BirthForm.tsx` (or near the generate button on the kundali page), add a small badge showing remaining kundali generations:

```tsx
import { useSubscription } from '@/hooks/useSubscription';

// Near the generate button:
const { getRemaining, tier } = useSubscription();
const kundaliRemaining = getRemaining('kundali_count');

{tier === 'free' && kundaliRemaining.limit > 0 && (
  <p className="text-text-secondary text-xs text-center mt-2">
    {kundaliRemaining.remaining}/{kundaliRemaining.limit} remaining today
  </p>
)}
```

- [ ] **Step 3: Verify it compiles and builds**

```bash
npx tsc --noEmit && npx next build
```

- [ ] **Step 4: Commit**

```bash
git add "src/app/[locale]/kundali/page.tsx"
git commit -m "feat: add paywall gates to kundali tabs and usage display"
```

---

### Task 12: Google AdSense Integration

**Files:**
- Create: `src/components/ads/AdUnit.tsx`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/panchang/page.tsx`

- [ ] **Step 1: Create AdUnit component**

```typescript
// src/components/ads/AdUnit.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/hooks/useSubscription';

interface AdUnitProps {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal';
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const { tier, isLoading } = useSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (isLoading || tier !== 'free' || pushed.current) return;
    if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return;

    try {
      const adsbygoogle = (window as Record<string, unknown>).adsbygoogle as unknown[];
      if (adsbygoogle) {
        adsbygoogle.push({});
        pushed.current = true;
      }
    } catch {
      // AdSense not loaded
    }
  }, [isLoading, tier]);

  // Don't render for paid users or during loading
  if (isLoading || tier !== 'free') return null;
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID) return null;

  return (
    <div className={`ad-container text-center ${className}`} ref={adRef}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot || ''}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
```

- [ ] **Step 2: Add AdSense script to layout**

In `src/app/[locale]/layout.tsx`, add inside `<head>` (conditionally — the script itself is lightweight, the ads only render for free users):

```tsx
{process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID && (
  <script
    async
    src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}`}
    crossOrigin="anonymous"
  />
)}
```

- [ ] **Step 3: Add AdUnit to panchang page**

In `src/app/[locale]/panchang/page.tsx`, add between content sections:

```tsx
import AdUnit from '@/components/ads/AdUnit';

// After the header, before main content:
<AdUnit format="horizontal" className="my-4" />

// Between panchang cards (mid-content):
<AdUnit format="rectangle" className="my-6" />
```

Repeat for calendar page and learn pages.

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ads/AdUnit.tsx "src/app/[locale]/layout.tsx" "src/app/[locale]/panchang/page.tsx"
git commit -m "feat: add Google AdSense integration for free tier pages"
```

---

### Task 13: Add Pricing Link to Navbar + Trial Banner

**Files:**
- Modify: `src/components/Navbar.tsx` (or equivalent navigation component)

- [ ] **Step 1: Add "Upgrade" button to navbar for free users**

Using `useSubscription()`, show a gold "Upgrade" or "Pro" button in the navbar when the user is on free tier:

```tsx
const { tier, isTrialing, trialDaysLeft } = useSubscription();

// In navbar, near the user menu:
{tier === 'free' && (
  <a href={`/${locale}/pricing`} className="px-3 py-1.5 text-xs font-bold bg-gradient-to-r from-gold-primary/20 to-gold-primary/10 border border-gold-primary/40 rounded-lg text-gold-light hover:bg-gold-primary/30">
    Upgrade
  </a>
)}
{isTrialing && (
  <span className="text-gold-dark text-[10px]">Trial: {trialDaysLeft}d left</span>
)}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Navbar.tsx
git commit -m "feat: add upgrade button and trial badge to navbar"
```

---

### Task 14: Full Build Verification

- [ ] **Step 1: Run full type check**

```bash
npx tsc --noEmit
```
Expected: 0 errors.

- [ ] **Step 2: Run full build**

```bash
npx next build
```
Expected: Build succeeds, all pages render.

- [ ] **Step 3: Manual smoke test**

1. Visit `/en/pricing` — verify 3-column layout renders
2. Visit `/en/kundali` — generate a chart, verify new tabs show PaywallGate for free user
3. Visit `/en/panchang` — verify AdUnit renders (or placeholder if no AdSense ID)
4. Check navbar shows "Upgrade" button

- [ ] **Step 4: Final commit + push**

```bash
git add -A
git commit -m "feat: complete monetization system — tiers, payments, gating, ads"
git push origin main
```

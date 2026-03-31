'use client';

import { create } from 'zustand';
import { getSupabase } from '@/lib/supabase/client';
import {
  type Tier,
  type Feature,
  type UsageFeature,
  checkFeatureAccess,
  getUsageLimit,
} from '@/lib/subscription/tiers';

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
  status: 'inactive',
  currentPeriodEnd: null,
  isTrialing: false,
  trialDaysLeft: 0,
  usage: {},
  isLoading: true,
  initialized: false,

  fetchSubscription: async () => {
    const supabase = getSupabase();
    if (!supabase) {
      set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
        return;
      }

      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!sub) {
        set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
        return;
      }

      const isTrialing = sub.status === 'trialing';
      let trialDaysLeft = 0;
      if (isTrialing && sub.trial_end) {
        const diff = new Date(sub.trial_end).getTime() - Date.now();
        trialDaysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
      }

      set({
        tier: sub.tier as Tier,
        status: sub.status,
        currentPeriodEnd: sub.current_period_end ?? null,
        isTrialing,
        trialDaysLeft,
        isLoading: false,
        initialized: true,
      });
    } catch {
      set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
    }
  },

  fetchUsage: async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().slice(0, 10);
      const { data } = await supabase
        .from('daily_usage')
        .select('feature, count')
        .eq('user_id', user.id)
        .eq('date', today);

      if (data) {
        const usage: Record<string, number> = {};
        for (const row of data) {
          usage[row.feature] = row.count;
        }
        set({ usage });
      }
    } catch {
      // silently fail — usage will default to 0
    }
  },

  canAccess: (feature: Feature) => {
    return checkFeatureAccess(feature, get().tier);
  },

  getRemaining: (feature: UsageFeature) => {
    const { tier, usage } = get();
    const { limit } = getUsageLimit(feature, tier);
    const used = usage[feature] ?? 0;
    const remaining = limit === -1 ? Infinity : Math.max(0, limit - used);
    return { used, limit, remaining };
  },
}));

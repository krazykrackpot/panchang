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

// In-flight promise refs at module scope. Every call site (Navbar, AdUnit,
// PaywallGate, AIReadingButton, pricing page) calls useSubscription() which
// fires fetchSubscription + fetchUsage in its own useEffect. Without dedupe
// we end up with N concurrent supabase.auth.* calls per page, each holding
// the @supabase/gotrue-js navigatorLock for the full network RTT — locks
// get stolen after 5s, AbortError cascades, subscription fetch silently
// fails. Sharing one promise per page collapses N calls to 1.
//
// We key the dedupe by user id so that if the user logs out and a different
// user logs in mid-flight, the new caller doesn't get the previous user's
// pending result. user id 'anon' represents the no-session case.
let inFlightSubscription: Promise<void> | null = null;
let inFlightSubscriptionKey: string | null = null;
let inFlightUsage: Promise<void> | null = null;
let inFlightUsageKey: string | null = null;

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

    // Resolve the current user BEFORE checking the in-flight cache so we
    // don't hand back another user's pending fetch (Gemini #104 review).
    // getSession() reads from localStorage — fast, no navigatorLock contention.
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    const key = user?.id ?? 'anon';
    if (inFlightSubscription && inFlightSubscriptionKey === key) return inFlightSubscription;

    inFlightSubscriptionKey = key;
    inFlightSubscription = (async () => {
      try {
        if (!user) {
          set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
          return;
        }

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

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
      } catch (err) {
        console.error('[subscription] fetch failed:', err);
        set({ tier: 'free', status: 'inactive', isLoading: false, initialized: true });
      } finally {
        inFlightSubscription = null;
        inFlightSubscriptionKey = null;
      }
    })();
    return inFlightSubscription;
  },

  fetchUsage: async () => {
    const supabase = getSupabase();
    if (!supabase) return;

    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user ?? null;
    const key = user?.id ?? 'anon';
    if (inFlightUsage && inFlightUsageKey === key) return inFlightUsage;

    inFlightUsageKey = key;
    inFlightUsage = (async () => {
      try {
        if (!user) {
          // Logged out — clear any stale per-user counters so the next
          // logged-in user doesn't see the previous one's numbers.
          set({ usage: {} });
          return;
        }

        const today = new Date().toISOString().slice(0, 10);
        const { data } = await supabase
          .from('daily_usage')
          .select('kundali_count, pdf_export_count')
          .eq('user_id', user.id)
          .eq('usage_date', today)
          .maybeSingle();

        // ai_chat_count and muhurta_scan_count columns are still in the
        // daily_usage table for historical preservation, but no longer
        // tracked in the store because the underlying features were
        // removed in favour of Brihaspati (spec §Existing Feature
        // Handling).
        set({
          usage: {
            kundali_count: data?.kundali_count ?? 0,
            pdf_export_count: data?.pdf_export_count ?? 0,
          },
        });
      } catch (err) {
        console.error('[subscription] usage fetch failed:', err);
        set({ usage: {} });
      } finally {
        inFlightUsage = null;
        inFlightUsageKey = null;
      }
    })();
    return inFlightUsage;
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

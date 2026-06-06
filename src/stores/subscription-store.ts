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
  /** Reset in-memory state — called from auth-store.signOut and
   *  onAuthStateChange userChanged so user A's tier/usage don't bleed
   *  into user B's session. Round 3 audit caught: subscription-store was
   *  missing from resetAllUserStores even though every other per-user
   *  store had reset() wired. Pro user → Free user switch on the same
   *  tab briefly showed Pro entitlements (PaywallGate, AdUnit, pricing). */
  reset: () => void;
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

        // Round 2 SF-20 — surface Supabase errors. The previous version
        // dropped { error } and treated `data: null` as "no subscription"
        // → on RLS / network / transient failure a paying user would be
        // silently demoted to 'free' with no diagnostic in the console.
        const { data: sub, error: subErr } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (subErr) {
          console.error('[subscription] fetchSubscription DB error:', subErr.message, 'userId=', user.id);
          // Leave existing state in place rather than demote to 'free'
          // (which the catch-arm does intentionally for hard errors). A
          // user with a previously-loaded tier keeps it; a first-load
          // failure stays as the default. Setting initialized=true so
          // the UI can stop showing a spinner and surface the existing
          // tier (or default).
          set({ isLoading: false, initialized: true });
          return;
        }

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
        // Guarded clear — if user B signed in mid-flight and started
        // their own fetchSubscription, B's key is set on the module
        // slot. Don't release it on our behalf.
        if (inFlightSubscriptionKey === key) {
          inFlightSubscription = null;
          inFlightSubscriptionKey = null;
        }
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

        // UTC date by design — the server-side `claim_usage` /
        // `claim_monthly_usage` RPCs (migration 038) write rows keyed on
        // `CURRENT_DATE`, which Postgres resolves in the session timezone
        // (UTC on Vercel/Supabase by default). Reading at user-panchang-TZ
        // here would miss the server-side row on day-boundary crossings and
        // double-count the user's quota. Both sides MUST agree.
        //
        // Future: aligning the daily window to the user's vrat_location_tz
        // requires (a) a new claim_usage(uuid, text, int, date) overload,
        // (b) per-call lookup of user_profiles.vrat_location_tz, and
        // (c) backfill semantics for users with no vrat_location_tz set.
        // Tracked separately — not safe in this content-update batch.
        const today = new Date().toISOString().slice(0, 10);
        // Round 2 SF-20 — capture { error } so transient DB failures
        // are visible in logs and we don't silently zero out the user's
        // counters.
        const { data, error: usageErr } = await supabase
          .from('daily_usage')
          .select('kundali_count, pdf_export_count')
          .eq('user_id', user.id)
          .eq('usage_date', today)
          .maybeSingle();

        if (usageErr) {
          console.error('[subscription] fetchUsage DB error:', usageErr.message, 'userId=', user.id);
          // Leave prior usage state intact; next call self-heals.
          return;
        }

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
        // Guarded clear — see fetchSubscription comment.
        if (inFlightUsageKey === key) {
          inFlightUsage = null;
          inFlightUsageKey = null;
        }
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

  reset: () => {
    // Drop in-flight slots too — a stale promise resolving after the
    // reset would otherwise re-apply user A's tier into B's session.
    inFlightSubscription = null;
    inFlightSubscriptionKey = null;
    inFlightUsage = null;
    inFlightUsageKey = null;
    set({
      tier: 'free',
      status: 'inactive',
      currentPeriodEnd: null,
      isTrialing: false,
      trialDaysLeft: 0,
      usage: {},
      isLoading: true,
      initialized: false,
    });
  },
}));

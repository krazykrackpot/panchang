'use client';

/**
 * PanditPricingCard — the subscription panel on /dashboard/settings.
 *
 * Three states:
 *   1. Free tier  — shows usage bar + "Upgrade to Pandit Pro" CTA
 *   2. Paid tier  — shows current plan + "Manage billing" (Stripe portal)
 *                   + "Cancel" handled via the portal
 *   3. Past-due / cancelled — shows banner + "Update payment" via portal
 *
 * Pandit CRM P10.
 */

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';
import {
  FREE_TIER_UNLINKED_CAP,
  type PanditSubscriptionInfo,
  type PanditCapUsage,
} from '@/lib/pandit/subscription';

interface SubscriptionResponse {
  subscription: PanditSubscriptionInfo;
  usage: PanditCapUsage;
}

type Currency = 'USD' | 'INR';

// Display prices — keep in sync with scripts/setup-pandit-stripe-prices.ts.
const PRICE_DISPLAY: Record<'pandit_pro' | 'pandit_unlimited', Record<Currency, Record<'monthly' | 'annual', string>>> = {
  pandit_pro: {
    USD: { monthly: '$9.99', annual: '$99' },
    INR: { monthly: '₹999', annual: '₹9,999' },
  },
  pandit_unlimited: {
    USD: { monthly: '$29.99', annual: '$299' },
    INR: { monthly: '₹2,999', annual: '₹29,999' },
  },
};

export function PanditPricingCard() {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale ?? 'en';
  const [data, setData] = useState<SubscriptionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  // Default to INR if the browser locale suggests an Indian user; the
  // user can flip the toggle either way.
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof navigator !== 'undefined') {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta') return 'INR';
    }
    return 'USD';
  });

  const load = useCallback(async () => {
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) {
        setError('Auth not configured');
        setLoading(false);
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) {
        setError('Not signed in');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/pandit/subscription', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? `HTTP ${res.status}`);
      }
      const json = (await res.json()) as SubscriptionResponse;
      setData(json);
    } catch (e) {
      console.error('[PanditPricingCard] load failed:', e);
      setError(e instanceof Error ? e.message : 'Failed to load subscription');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpgrade(tier: 'pandit_pro' | 'pandit_unlimited') {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error('Not signed in');

      const res = await fetch('/api/pandit/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tier, billing, currency, locale }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'Checkout failed');
      }
      window.location.href = json.url;
    } catch (e) {
      console.error('[PanditPricingCard] upgrade failed:', e);
      setError(e instanceof Error ? e.message : 'Upgrade failed');
      setSubmitting(false);
    }
  }

  async function handleManageBilling() {
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error('Not signed in');

      const res = await fetch('/api/pandit/billing-portal', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ locale }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'Portal unavailable');
      }
      window.location.href = json.url;
    } catch (e) {
      console.error('[PanditPricingCard] manage billing failed:', e);
      setError(e instanceof Error ? e.message : 'Failed to open billing portal');
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
        <div className="animate-pulse text-text-tertiary text-sm">Loading subscription…</div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
        <h2
          className="text-base font-bold text-gold-light mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          Subscription
        </h2>
        <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[13px] text-[color:var(--color-alert-critical)]">
          {error ?? 'Subscription unavailable'}
        </div>
      </section>
    );
  }

  const { subscription, usage } = data;
  const isPaid = subscription.tier === 'pandit_pro' || subscription.tier === 'pandit_unlimited';
  const isPastDue = subscription.status === 'past_due';

  return (
    <section className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1f4e]/40 via-[#111638]/60 to-[#0a0e27] p-5">
      <h2
        className="text-base font-bold text-gold-light mb-1"
        style={{ fontFamily: 'var(--font-heading)' }}
      >
        Subscription
      </h2>
      <p className="text-[12px] text-text-secondary mb-4">
        {isPaid
          ? 'Manage your Pandit subscription.'
          : 'Free tier: up to 5 unlinked clients. Linked clients (those who\'ve joined the platform) don\'t count against your cap.'}
      </p>

      {/* Current-state banner */}
      <div
        className={`rounded-xl border p-3 mb-4 text-[13px] ${
          isPastDue
            ? 'border-[color:var(--color-alert-warning)]/30 bg-[color:var(--color-alert-warning)]/10'
            : 'border-gold-primary/15 bg-bg-primary/30'
        }`}
      >
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="text-gold-light font-medium">
              {subscription.tier === 'pandit_pro' && 'Pandit Pro'}
              {subscription.tier === 'pandit_unlimited' && 'Pandit Unlimited'}
              {subscription.tier === 'free' && 'Free tier'}
            </div>
            {subscription.status !== 'none' && (
              <div className="text-[11px] text-text-secondary mt-0.5">
                Status: {subscription.status}
                {subscription.current_period_end && (
                  <>
                    {' · '}
                    {subscription.status === 'cancelled' ? 'Access until ' : 'Renews '}
                    {new Date(subscription.current_period_end).toLocaleDateString('en-GB', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cap usage bar — free tier only */}
        {!isPaid && (
          <div className="mt-3">
            <div className="flex justify-between text-[11px] text-text-secondary mb-1">
              <span>Unlinked clients</span>
              <span className="font-mono">
                {usage.unlinked_count} / {FREE_TIER_UNLINKED_CAP}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-primary overflow-hidden">
              <div
                className={`h-full transition-all ${
                  usage.unlinked_count >= FREE_TIER_UNLINKED_CAP
                    ? 'bg-[color:var(--color-alert-critical)]'
                    : usage.unlinked_count >= FREE_TIER_UNLINKED_CAP - 1
                      ? 'bg-[color:var(--color-alert-warning)]'
                      : 'bg-gold-primary'
                }`}
                style={{
                  width: `${Math.min(100, (usage.unlinked_count / FREE_TIER_UNLINKED_CAP) * 100)}%`,
                }}
              />
            </div>
            {usage.linked_count > 0 && (
              <div className="mt-2 text-[11px] text-[color:var(--color-state-active)]">
                + {usage.linked_count} linked client{usage.linked_count === 1 ? '' : 's'} (don&apos;t count against cap)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action area */}
      {isPaid ? (
        <button
          type="button"
          onClick={handleManageBilling}
          disabled={submitting}
          className="w-full rounded-xl border border-gold-primary/25 bg-bg-primary/30 text-gold-light py-2.5 text-[13px] hover:border-gold-primary/50 transition disabled:opacity-60"
        >
          {submitting ? 'Opening Stripe…' : 'Manage billing (Stripe portal)'}
        </button>
      ) : (
        <div>
          {/* Currency + billing toggles */}
          <div className="flex flex-wrap gap-2 mb-3">
            <div className="flex gap-1 rounded-xl bg-bg-primary/40 border border-gold-primary/15 p-1 flex-1 min-w-[150px]">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                  currency === 'USD' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
                }`}
              >
                USD ($)
              </button>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                  currency === 'INR' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
                }`}
              >
                INR (₹)
              </button>
            </div>
            <div className="flex gap-1 rounded-xl bg-bg-primary/40 border border-gold-primary/15 p-1 flex-1 min-w-[150px]">
              <button
                type="button"
                onClick={() => setBilling('monthly')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                  billing === 'monthly' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBilling('annual')}
                className={`flex-1 px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${
                  billing === 'annual' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
                }`}
              >
                Annual <span className="text-[10px] opacity-80">(2 mo free)</span>
              </button>
            </div>
          </div>

          {/* Two tier buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleUpgrade('pandit_pro')}
              disabled={submitting}
              className="w-full rounded-xl bg-gradient-to-r from-gold-primary to-gold-light text-bg-primary font-semibold py-2.5 text-[12px] hover:opacity-90 transition disabled:opacity-60"
            >
              {submitting
                ? 'Opening…'
                : `Pandit Pro — ${PRICE_DISPLAY.pandit_pro[currency][billing]}/${billing === 'annual' ? 'yr' : 'mo'}`}
            </button>
            <button
              type="button"
              onClick={() => handleUpgrade('pandit_unlimited')}
              disabled={submitting}
              className="w-full rounded-xl border border-gold-primary/30 text-gold-light font-medium py-2.5 text-[12px] hover:border-gold-primary/60 transition disabled:opacity-60"
            >
              {submitting
                ? 'Opening…'
                : `Unlimited — ${PRICE_DISPLAY.pandit_unlimited[currency][billing]}/${billing === 'annual' ? 'yr' : 'mo'}`}
            </button>
          </div>
          <div className="text-[11px] text-text-secondary mt-2 text-center">
            Cancel anytime via Stripe portal. Linked clients always stay linked.
          </div>
        </div>
      )}
    </section>
  );
}

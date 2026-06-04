'use client';

/**
 * PaywallModal — fires when a Pandit hits the free-tier 5-unlinked-client
 * cap (HTTP 402 `cap_exceeded` from POST /api/pandit/clients).
 *
 * Three tiers shown: Free (current, locked), Pro, Unlimited.
 * Currency toggle: USD or INR. Billing toggle: monthly or annual.
 *
 * Pandit CRM P10 + post-merge pricing-v2 (2026-06-04).
 */

import { useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase/client';
import { FREE_TIER_UNLINKED_CAP } from '@/lib/pandit/subscription';

type PaidTier = 'pandit_pro' | 'pandit_unlimited';
type Billing = 'monthly' | 'annual';
type Currency = 'USD' | 'INR';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  localePrefix?: string;
  usage?: {
    unlinked_count: number;
    linked_count: number;
  };
}

/**
 * Pricing matrix. Keep in sync with scripts/setup-pandit-stripe-prices.ts.
 * Amount is the human-readable display; Stripe holds the authoritative
 * price IDs server-side (no client-side amount used in checkout).
 */
const PRICES: Record<PaidTier, Record<Currency, Record<Billing, string>>> = {
  pandit_pro: {
    USD: { monthly: '$9.99', annual: '$99' },
    INR: { monthly: '₹999', annual: '₹9,999' },
  },
  pandit_unlimited: {
    USD: { monthly: '$29.99', annual: '$299' },
    INR: { monthly: '₹2,999', annual: '₹29,999' },
  },
};

const TIER_FEATURES: Record<PaidTier, string[]> = {
  pandit_pro: [
    'Unlimited clients (no 5-client cap)',
    'Branded PDF letterhead in 9 languages',
    'Birthday + dasha + sade sati alerts',
    'Family charts + GDPR export',
  ],
  pandit_unlimited: [
    'Everything in Pro',
    'Founding pandit recognition',
    'Priority feature requests',
    'Lifetime grandfathered pricing on future features',
  ],
};

export function PaywallModal({ open, onClose, localePrefix = '/en', usage }: PaywallModalProps) {
  const [billing, setBilling] = useState<Billing>('annual');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [submittingTier, setSubmittingTier] = useState<PaidTier | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function handleUpgrade(tier: PaidTier) {
    if (submittingTier) return;
    setSubmittingTier(tier);
    setErr(null);
    try {
      const supabase = getSupabase();
      if (!supabase) throw new Error('Auth not configured');
      const { data: sess } = await supabase.auth.getSession();
      const token = sess.session?.access_token;
      if (!token) throw new Error('Not signed in');

      const locale = localePrefix.replace(/^\//, '') || 'en';
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
      console.error('[PaywallModal] upgrade failed:', e);
      setErr(e instanceof Error ? e.message : 'Upgrade failed. Please try again.');
      setSubmittingTier(null);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div
        className="w-full max-w-3xl my-8 rounded-2xl border border-gold-primary/30 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] p-6 sm:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="paywall-title"
          className="text-xl sm:text-2xl font-bold text-gold-light mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          You&apos;ve reached the free-tier limit
        </h2>
        <p className="text-[13px] text-text-secondary mb-4">
          Free Pandit accounts can manage up to{' '}
          <strong className="text-gold-light">{FREE_TIER_UNLINKED_CAP} unlinked clients</strong>.
          Linked clients (those who&apos;ve joined the platform) don&apos;t count against your cap.
        </p>

        {usage && (
          <div className="rounded-xl border border-gold-primary/15 bg-bg-primary/40 p-3 mb-5 text-[12px] text-text-secondary">
            <div className="flex justify-between mb-1">
              <span>Unlinked clients (count against cap)</span>
              <span className="font-mono text-gold-light">
                {usage.unlinked_count} / {FREE_TIER_UNLINKED_CAP}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Linked clients (don&apos;t count)</span>
              <span className="font-mono text-[color:var(--color-state-active)]">
                {usage.linked_count}
              </span>
            </div>
          </div>
        )}

        {/* Currency + billing toggles */}
        <div className="flex flex-wrap gap-3 mb-5">
          <div className="flex gap-1 rounded-xl bg-bg-primary/40 border border-gold-primary/15 p-1 flex-1 min-w-[180px]">
            <button
              type="button"
              onClick={() => setCurrency('USD')}
              className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
                currency === 'USD' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
              }`}
            >
              USD ($)
            </button>
            <button
              type="button"
              onClick={() => setCurrency('INR')}
              className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
                currency === 'INR' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
              }`}
            >
              INR (₹)
            </button>
          </div>
          <div className="flex gap-1 rounded-xl bg-bg-primary/40 border border-gold-primary/15 p-1 flex-1 min-w-[180px]">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
                billing === 'monthly' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
                billing === 'annual' ? 'bg-gold-primary text-bg-primary' : 'text-text-secondary hover:text-gold-light'
              }`}
            >
              Annual <span className="text-[10px] opacity-80">(2 months free)</span>
            </button>
          </div>
        </div>

        {/* Tier cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <TierCard
            name="Pandit Pro"
            price={PRICES.pandit_pro[currency][billing]}
            cadence={billing === 'annual' ? 'year' : 'month'}
            features={TIER_FEATURES.pandit_pro}
            highlighted
            cta={submittingTier === 'pandit_pro' ? 'Opening checkout…' : 'Upgrade to Pro'}
            disabled={!!submittingTier}
            onClick={() => handleUpgrade('pandit_pro')}
          />
          <TierCard
            name="Pandit Unlimited"
            price={PRICES.pandit_unlimited[currency][billing]}
            cadence={billing === 'annual' ? 'year' : 'month'}
            features={TIER_FEATURES.pandit_unlimited}
            cta={submittingTier === 'pandit_unlimited' ? 'Opening checkout…' : 'Support the project'}
            disabled={!!submittingTier}
            onClick={() => handleUpgrade('pandit_unlimited')}
          />
        </div>

        {err && (
          <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[12px] text-[color:var(--color-alert-critical)] mb-3">
            {err}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link
            href={`${localePrefix}/dashboard/clients`}
            onClick={onClose}
            className="w-full rounded-xl border border-gold-primary/25 bg-bg-primary/30 text-gold-light text-center py-2.5 text-[13px] hover:border-gold-primary/50 transition"
          >
            Or invite an existing client onto the platform instead
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="text-[12px] text-text-secondary hover:text-gold-light mt-1"
          >
            Maybe later
          </button>
        </div>

        <p className="text-[11px] text-text-tertiary mt-4 text-center">
          Linked clients always stay free. Cancel anytime via Stripe portal.
        </p>
      </div>
    </div>
  );
}

function TierCard({
  name,
  price,
  cadence,
  features,
  highlighted,
  cta,
  disabled,
  onClick,
}: {
  name: string;
  price: string;
  cadence: 'month' | 'year';
  features: string[];
  highlighted?: boolean;
  cta: string;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <div
      className={`rounded-xl border p-4 flex flex-col ${
        highlighted
          ? 'border-gold-primary/40 bg-gold-primary/8'
          : 'border-gold-primary/15 bg-bg-primary/30'
      }`}
    >
      <div className="mb-3">
        <div className="text-[14px] font-bold text-gold-light">{name}</div>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-2xl font-bold text-gold-light">{price}</span>
          <span className="text-[11px] text-text-secondary">/ {cadence}</span>
        </div>
      </div>
      <ul className="flex-1 space-y-1.5 mb-4">
        {features.map((f) => (
          <li key={f} className="text-[11px] text-text-secondary flex gap-1.5">
            <span className="text-gold-primary">✓</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className={`w-full rounded-xl py-2.5 text-[12px] font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
          highlighted
            ? 'bg-gradient-to-r from-gold-primary to-gold-light text-bg-primary hover:opacity-90'
            : 'border border-gold-primary/30 text-gold-light hover:border-gold-primary/60'
        }`}
      >
        {cta}
      </button>
    </div>
  );
}

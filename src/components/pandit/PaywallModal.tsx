'use client';

/**
 * PaywallModal — fires when a Pandit hits the free-tier 5-unlinked-client
 * cap (HTTP 402 `cap_exceeded` from POST /api/pandit/clients).
 *
 * Three calls-to-action:
 *   1. Upgrade to Pandit Pro (primary — opens Stripe checkout)
 *   2. Invite a client onto the platform ("linked clients don't count")
 *   3. Dismiss
 *
 * Pandit CRM P10.
 */

import { useState } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase/client';
import { FREE_TIER_UNLINKED_CAP } from '@/lib/pandit/subscription';

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  /**
   * Optional: locale prefix for the "invite an existing client" link.
   * Defaults to current pathname segment if omitted.
   */
  localePrefix?: string;
  /**
   * Optional: current cap-usage snapshot. When provided, the modal
   * shows the exact roster breakdown instead of generic copy.
   */
  usage?: {
    unlinked_count: number;
    linked_count: number;
  };
}

export function PaywallModal({ open, onClose, localePrefix = '/en', usage }: PaywallModalProps) {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');
  const [tier] = useState<'pandit_pro' | 'pandit_unlimited'>('pandit_pro');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleUpgrade() {
    if (submitting) return;
    setSubmitting(true);
    setErr(null);
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
        body: JSON.stringify({ tier, billing }),
      });
      const json = await res.json();
      if (!res.ok || !json.url) {
        throw new Error(json.error ?? 'Checkout failed');
      }
      window.location.href = json.url;
    } catch (e) {
      console.error('[PaywallModal] upgrade failed:', e);
      setErr(e instanceof Error ? e.message : 'Upgrade failed. Please try again.');
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="paywall-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl border border-gold-primary/30 bg-gradient-to-br from-[#2d1b69]/60 via-[#1a1040]/70 to-[#0a0e27] p-6 sm:p-8 shadow-2xl"
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
          Linked clients (those who&apos;ve joined the platform) don&apos;t count.
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

        {/* Billing toggle */}
        <div className="flex gap-1 rounded-xl bg-bg-primary/40 border border-gold-primary/15 p-1 mb-4">
          <button
            type="button"
            onClick={() => setBilling('monthly')}
            className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
              billing === 'monthly'
                ? 'bg-gold-primary text-bg-primary'
                : 'text-text-secondary hover:text-gold-light'
            }`}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling('annual')}
            className={`flex-1 px-3 py-2 rounded-lg text-[12px] font-medium transition ${
              billing === 'annual'
                ? 'bg-gold-primary text-bg-primary'
                : 'text-text-secondary hover:text-gold-light'
            }`}
          >
            Annual <span className="text-[10px] opacity-80">(save 20%)</span>
          </button>
        </div>

        <div className="rounded-xl border border-gold-primary/25 bg-bg-primary/30 p-4 mb-4">
          <div className="flex items-baseline justify-between mb-2">
            <div>
              <div className="text-sm font-bold text-gold-light">Pandit Pro</div>
              <div className="text-[11px] text-text-secondary">Unlimited clients, branded PDFs, alerts</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gold-light">
                {billing === 'annual' ? '$190' : '$19'}
              </div>
              <div className="text-[10px] text-text-secondary">
                per {billing === 'annual' ? 'year' : 'month'}
              </div>
            </div>
          </div>
        </div>

        {err && (
          <div className="rounded-lg border border-[color:var(--color-alert-critical)]/30 bg-[color:var(--color-alert-critical)]/10 p-3 text-[12px] text-[color:var(--color-alert-critical)] mb-3">
            {err}
          </div>
        )}

        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleUpgrade}
            disabled={submitting}
            className="w-full rounded-xl bg-gradient-to-r from-gold-primary to-gold-light text-bg-primary font-semibold py-3 text-[14px] hover:opacity-90 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? 'Opening checkout…' : `Upgrade to Pandit Pro`}
          </button>
          <Link
            href={`${localePrefix}/dashboard/clients`}
            onClick={onClose}
            className="w-full rounded-xl border border-gold-primary/25 bg-bg-primary/30 text-gold-light text-center py-3 text-[13px] hover:border-gold-primary/50 transition"
          >
            Invite an existing client instead
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
          Once a client links their account, they no longer count against your cap.
        </p>
      </div>
    </div>
  );
}

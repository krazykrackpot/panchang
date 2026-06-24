'use client';

/**
 * TippanniPaywall — shown in place of the paid tippanni sections when
 * the user hasn't unlocked the current chart.
 *
 * Two rendering modes (driven by state from useKundaliEntitlement):
 *
 *   1. Not entitled  → Pricing cards (Single ₹299 / Family ₹999). For
 *                      anonymous visitors the buy button routes to
 *                      /?signin=1&intent=buy_<sku>; for signed-in users
 *                      with 0 credits it POSTs /api/kundali/checkout
 *                      and redirects to Stripe. Showing the price tag
 *                      to cold visitors is the single biggest conversion
 *                      lever — they decide on price, not on signup.
 *   2. Signed in,    → "You have N credits — unlock this chart" button
 *      credits > 0     that POSTs /api/kundali/unlock and calls
 *                      onUnlocked() to refresh the parent.
 *
 * The unlock POST sends the birth params; the server computes the
 * fingerprint and either consumes 1 credit or returns the existing
 * entitlement (idempotent). Re-clicking the unlock button never double-
 * charges.
 */

import { useState, useEffect } from 'react';
import { useRouter } from '@/lib/i18n/navigation';
import { Lock, Sparkles } from 'lucide-react';
import { authedFetch } from '@/lib/api/authed-fetch';
import { useAuthStore } from '@/stores/auth-store';
import type { BirthParamsClient } from '@/lib/kundali/useKundaliEntitlement';

interface Props {
  birth: BirthParamsClient;
  displayName?: string | null;
  signedIn: boolean;
  creditsRemaining: number;
  locale: string;
  /** Called after a successful unlock so the parent can refresh entitlement state. */
  onUnlocked: () => void | Promise<void>;
}

const PRICE_LABEL: Record<'INR' | 'USD', { single: string; family: string; symbol: string }> = {
  INR: { single: '₹299', family: '₹999', symbol: '₹' },
  USD: { single: '$4.99', family: '$14.99', symbol: '$' },
};

/** Pick a default currency from the browser locale. India → INR; everyone else → USD. */
function defaultCurrency(): 'INR' | 'USD' {
  if (typeof navigator === 'undefined') return 'INR';
  const lang = navigator.language || 'en-US';
  // Indian browsers, Hindi etc → INR. Adjust to taste; users can switch on the page.
  if (/-IN\b|^hi|^ta|^te|^bn|^gu|^kn|^mr|^mai/i.test(lang)) return 'INR';
  return 'USD';
}

export default function TippanniPaywall({
  birth, displayName, signedIn, creditsRemaining, locale, onUnlocked,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Default to INR for SSR + initial hydration (deterministic), then
  // switch to the browser-derived currency in an effect. Reading
  // navigator.language at initial-state time creates a server/client
  // mismatch (server has no navigator → 'INR'; US browser → 'USD'),
  // breaking hydration per CLAUDE.md lesson ZD.
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
  useEffect(() => { setCurrency(defaultCurrency()); }, []);

  async function buyCredits(sku: 'single' | 'family') {
    // Anonymous users: route to sign-in with intent — once they're back
    // authenticated, the paywall re-renders entitled or with the buy
    // cards still showing. We don't try to POST without auth (the
    // checkout route 401s and Stripe needs the user_id to bind anyway).
    if (!signedIn) {
      router.push(`/?signin=1&intent=buy_${sku}`);
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await authedFetch('/api/kundali/checkout', {
        method: 'POST',
        body: JSON.stringify({ sku, currency, locale }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? `Checkout failed (${res.status})`);
        setBusy(false);
        return;
      }
      const { url } = (await res.json()) as { url?: string };
      if (!url) {
        setError('Stripe returned no checkout URL — try again.');
        setBusy(false);
        return;
      }
      window.location.href = url;
      // Don't reset busy — the navigation away handles it.
    } catch (err) {
      console.error('[TippanniPaywall] checkout failed:', err);
      setError('Network error — please retry.');
      setBusy(false);
    }
  }

  async function unlockChart() {
    setBusy(true);
    setError(null);
    try {
      const res = await authedFetch('/api/kundali/unlock', {
        method: 'POST',
        body: JSON.stringify({ ...birth, displayName: displayName ?? null }),
      });
      const body = (await res.json()) as {
        status?: 'unlocked' | 'already_unlocked' | 'insufficient_credits';
        error?: string;
      };
      if (!res.ok) {
        setError(body.error ?? `Unlock failed (${res.status})`);
        setBusy(false);
        return;
      }
      if (body.status === 'insufficient_credits') {
        setError('Not enough credits. Please purchase a pack first.');
        setBusy(false);
        return;
      }
      // Success (either 'unlocked' or 'already_unlocked'). Trigger parent refresh.
      await onUnlocked();
    } catch (err) {
      console.error('[TippanniPaywall] unlock failed:', err);
      setError('Network error — please retry.');
      setBusy(false);
    }
  }

  // ── Mode 3: has credits, can unlock immediately ─────────────────────
  if (creditsRemaining > 0) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/30 p-8 text-center">
        <Sparkles className="w-10 h-10 mx-auto mb-4 text-gold-primary" />
        <h3 className="text-xl text-gold-light font-semibold mb-2">
          You have {creditsRemaining} unlock credit{creditsRemaining === 1 ? '' : 's'}
        </h3>
        <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto leading-relaxed">
          Spend 1 credit to unlock the full tippanni for this chart. Credits are tied to the chart, not to a session — you can revisit anytime.
        </p>
        <button
          onClick={unlockChart}
          disabled={busy}
          className="px-6 py-3 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors disabled:opacity-50"
        >
          {busy ? 'Unlocking…' : 'Unlock this chart'}
        </button>
        {error && <p className="text-red-400 text-xs mt-4">{error}</p>}
      </div>
    );
  }

  // ── Mode 2: pricing cards. Shown to BOTH anonymous (CTA = "Sign in
  // to pay") and signed-in-with-0-credits (CTA = price → Stripe).
  // Putting the price in front of cold visitors is the single biggest
  // conversion lever — they decide on the price tag, not the sign-up.
  const price = PRICE_LABEL[currency];

  return (
    <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/30 p-6 sm:p-8">
      <div className="text-center mb-6">
        <Lock className="w-10 h-10 mx-auto mb-3 text-gold-primary" />
        <h3 className="text-2xl text-gold-light font-semibold mb-2">Unlock the full tippanni</h3>
        <p className="text-text-secondary text-sm max-w-lg mx-auto leading-relaxed">
          Year Predictions, all 11 yogas, 3 doshas, Life Areas, Dasha Insights, Strength,
          and personalised Remedies — plus all divisional charts (D9–D60) and PDF download.
        </p>
        {!signedIn && (
          <p className="text-gold-primary/80 text-xs mt-3">
            You&apos;ll create a free account at checkout — needed to save your unlocked chart.
          </p>
        )}
      </div>

      {/* Currency toggle */}
      <div className="flex justify-center gap-2 mb-6 text-xs">
        <button
          onClick={() => setCurrency('INR')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currency === 'INR' ? 'bg-gold-primary text-bg-primary' : 'bg-bg-secondary/40 text-text-secondary'
          }`}
        >
          ₹ INR
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`px-3 py-1 rounded-full transition-colors ${
            currency === 'USD' ? 'bg-gold-primary text-bg-primary' : 'bg-bg-secondary/40 text-text-secondary'
          }`}
        >
          $ USD
        </button>
      </div>

      {/* Pricing cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Single */}
        <button
          onClick={() => buyCredits('single')}
          disabled={busy}
          data-testid="paywall-buy-single"
          className="text-left rounded-xl border border-gold-primary/20 hover:border-gold-primary/60 bg-bg-secondary/20 p-5 transition-colors disabled:opacity-50"
        >
          <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">Single Kundali</div>
          <div className="text-3xl font-bold text-gold-light mb-2">{price.single}</div>
          <div className="text-text-secondary text-xs leading-relaxed">
            1 credit — unlocks this chart forever.
          </div>
        </button>

        {/* Family — anchored as the better deal */}
        <button
          onClick={() => buyCredits('family')}
          disabled={busy}
          data-testid="paywall-buy-family"
          className="text-left rounded-xl border-2 border-gold-primary/50 hover:border-gold-primary bg-gold-primary/10 p-5 transition-colors relative disabled:opacity-50"
        >
          <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-gold-primary text-bg-primary text-[10px] font-bold uppercase">
            Best value
          </div>
          <div className="text-gold-dark text-xs uppercase tracking-wider mb-1">Family Pack</div>
          <div className="text-3xl font-bold text-gold-light mb-2">{price.family}</div>
          <div className="text-text-secondary text-xs leading-relaxed">
            4 credits — for a family of 2 adults + 2 children. {price.symbol}{currency === 'INR' ? '250' : '3.75'} per chart.
          </div>
        </button>
      </div>

      <p className="text-text-secondary/60 text-[11px] text-center mt-4 leading-relaxed">
        One-time payment per chart. Brihaspati AI questions are billed separately.
        <br />
        Credits are non-refundable once a chart is unlocked. Pre-unlock refunds within 7 days.
      </p>

      {error && <p className="text-red-400 text-xs mt-4 text-center">{error}</p>}
    </div>
  );
}

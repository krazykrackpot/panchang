'use client';

/**
 * /<locale>/account/credits — kundali credit dashboard.
 *
 * Shows the signed-in user their:
 *   - Current credit balance
 *   - Purchase history
 *   - List of charts they've already unlocked
 *
 * Also handles the post-checkout return: when Stripe redirects with
 * ?session_id=...&status=success the page auto-refreshes the balance
 * (the webhook may need a second to land) and surfaces a confirmation
 * banner.
 *
 * Sign-in required. Anonymous visitors get a sign-in prompt.
 */

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { useAuthStore } from '@/stores/auth-store';
import { authedFetch } from '@/lib/api/authed-fetch';
import { Coins, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';

interface Purchase {
  id: string;
  sku: 'single' | 'family';
  credits_granted: number;
  amount_paid_minor: number;
  currency: 'INR' | 'USD';
  provider: string;
  purchased_at: string;
}
interface Entitlement {
  id: string;
  kundali_fingerprint: string;
  display_name: string | null;
  unlocked_at: string;
  source: string;
}

function formatAmount(minor: number, currency: 'INR' | 'USD'): string {
  const major = minor / 100;
  if (currency === 'INR') return `₹${major.toFixed(0)}`;
  return `$${major.toFixed(2)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function CreditsPage() {
  const locale = useLocale();
  const user = useAuthStore((s) => s.user);
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const status = params.get('status');

  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [totalPurchased, setTotalPurchased] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);

  const fetchCredits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authedFetch('/api/kundali/credits');
      if (!res.ok) {
        console.error('[credits-page] fetch failed:', res.status);
        return;
      }
      const data = await res.json();
      setBalance(data.creditsRemaining ?? 0);
      setTotalPurchased(data.totalPurchased ?? 0);
      setTotalSpent(data.totalSpent ?? 0);
      setPurchases(data.purchases ?? []);
      setEntitlements(data.entitlements ?? []);
    } catch (err) {
      console.error('[credits-page] fetch threw:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load + auto-refresh after Stripe checkout return.
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchCredits();
    // If we just returned from Stripe, the webhook may need a moment to
    // land. Poll a few times then stop.
    if (sessionId && status === 'success') {
      const timers: ReturnType<typeof setTimeout>[] = [];
      for (const delay of [1500, 4000, 8000]) {
        timers.push(setTimeout(fetchCredits, delay));
      }
      return () => timers.forEach(clearTimeout);
    }
  }, [user?.id, sessionId, status, fetchCredits]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user && !loading) {
    return (
      <main className="max-w-3xl mx-auto p-6 sm:p-10">
        <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-10 text-center">
          <h1 className="text-2xl text-gold-light font-semibold mb-3">Sign in to view your credits</h1>
          <p className="text-text-secondary text-sm mb-6">Your kundali unlock credits and purchase history live here.</p>
          <Link href="/" className="px-5 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold hover:bg-gold-light transition-colors">
            Go to homepage to sign in
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-10">
      <h1 className="text-3xl font-bold text-gold-light mb-2">Kundali credits</h1>
      <p className="text-text-secondary text-sm mb-8">
        One credit unlocks the full tippanni for one chart, forever. Credits don't expire.
      </p>

      {/* Post-checkout success banner */}
      {sessionId && status === 'success' && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-4 mb-6 flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="text-emerald-300 font-semibold">Payment received</div>
            <div className="text-text-secondary text-xs mt-0.5">
              Your credits will appear here within a few seconds. If they don't, refresh the page or contact support.
            </div>
          </div>
        </div>
      )}

      {/* Balance card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-gold-primary/15 flex items-center justify-center">
            <Coins className="w-7 h-7 text-gold-primary" />
          </div>
          <div>
            <div className="text-text-secondary text-xs uppercase tracking-wider">Current balance</div>
            <div className="text-3xl font-bold text-gold-light">
              {loading ? '…' : balance} credit{balance === 1 ? '' : 's'}
            </div>
            <div className="text-text-secondary/60 text-xs mt-1">
              {totalPurchased} purchased · {totalSpent} spent
            </div>
          </div>
        </div>
      </div>

      {/* Unlocked charts */}
      <section className="mb-8" data-testid="credits-entitlements">
        <h2 className="text-lg text-gold-light font-semibold mb-3">Unlocked charts ({entitlements.length})</h2>
        {entitlements.length === 0 ? (
          <p className="text-text-secondary text-sm">You haven't unlocked any chart yet.</p>
        ) : (
          <div className="space-y-2">
            {entitlements.map((e) => (
              <div key={e.id} className="rounded-xl bg-bg-secondary/20 border border-gold-primary/10 p-4 flex items-center justify-between">
                <div>
                  <div className="text-gold-light font-medium">{e.display_name ?? 'Unnamed chart'}</div>
                  <div className="text-text-secondary text-xs mt-0.5 font-mono">
                    {e.kundali_fingerprint.slice(0, 12)}…
                  </div>
                </div>
                <div className="text-text-secondary text-xs text-right">
                  Unlocked {formatDate(e.unlocked_at)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Purchase history */}
      <section data-testid="credits-purchases">
        <h2 className="text-lg text-gold-light font-semibold mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-gold-dark" /> Purchase history
        </h2>
        {purchases.length === 0 ? (
          <p className="text-text-secondary text-sm">No purchases yet.</p>
        ) : (
          <div className="space-y-2">
            {purchases.map((p) => (
              <div key={p.id} className="rounded-xl bg-bg-secondary/20 border border-gold-primary/10 p-4 flex items-center justify-between text-sm">
                <div>
                  <div className="text-gold-light font-medium capitalize">
                    {p.sku === 'family' ? 'Family Pack (4 credits)' : 'Single Kundali (1 credit)'}
                  </div>
                  <div className="text-text-secondary text-xs mt-0.5">
                    {formatDate(p.purchased_at)} · via {p.provider}
                  </div>
                </div>
                <div className="text-gold-light font-mono">
                  {formatAmount(p.amount_paid_minor, p.currency)}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <p className="text-text-secondary/60 text-xs mt-10 leading-relaxed">
        Need help? Email <a href="mailto:aditya.kr.jha@gmail.com" className="text-gold-light hover:text-gold-primary">aditya.kr.jha@gmail.com</a>.
        Refunds available on unspent credits within 7 days of purchase.
      </p>
    </main>
  );
}

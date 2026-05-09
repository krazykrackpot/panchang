'use client';

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import AuthModal from '@/components/auth/AuthModal';

interface CrossSellCTAProps {
  /** Headline text */
  headline: string;
  /** Subtext / description */
  subtext: string;
  /** Link destination — if set, renders a link button instead of auth trigger */
  href?: string;
  /** Button label */
  buttonLabel: string;
  /** When true, triggers the auth modal instead of navigating */
  triggerAuth?: boolean;
  /** Only show when NOT logged in (default true) */
  guestOnly?: boolean;
}

/**
 * Subtle cross-sell CTA card using the purple mega card gradient.
 * Used on high-traffic pages (calendar, horoscope, panchang/city) to
 * drive sign-ups or page transitions to dashboard/kundali.
 *
 * By default, only renders for unauthenticated visitors.
 */
export default function CrossSellCTA({
  headline,
  subtext,
  href,
  buttonLabel,
  triggerAuth = false,
  guestOnly = true,
}: CrossSellCTAProps) {
  const { user, initialized, initialize } = useAuthStore();
  const [authOpen, setAuthOpen] = useState(false);

  useEffect(() => { initialize(); }, [initialize]);

  // Wait for auth to initialise before deciding visibility
  if (!initialized) return null;

  // If guestOnly, hide for logged-in users
  if (guestOnly && user) return null;

  const handleClick = () => {
    if (triggerAuth) {
      setAuthOpen(true);
    } else if (href) {
      window.location.href = href;
    }
  };

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/30 transition-colors p-5 sm:p-6">
        <p className="text-gold-light text-sm font-semibold mb-1">{headline}</p>
        <p className="text-text-secondary text-xs mb-4">{subtext}</p>
        {href && !triggerAuth ? (
          <a
            href={href}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/25 hover:bg-gold-primary/25 hover:border-gold-primary/40 transition-all"
          >
            {buttonLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <button
            onClick={handleClick}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-gold-primary/15 text-gold-light border border-gold-primary/25 hover:bg-gold-primary/25 hover:border-gold-primary/40 transition-all"
          >
            {buttonLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      {authOpen && <AuthModal isOpen={true} onClose={() => setAuthOpen(false)} />}
    </>
  );
}

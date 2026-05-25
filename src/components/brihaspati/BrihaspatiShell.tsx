'use client';

/**
 * Client-only shell that mounts the Brihaspati Provider + Button + Panel
 * + Banner globally. Plugs into ClientShell which renders inside the
 * locale layout.
 *
 * Wires getAccessToken to the existing Supabase browser client.
 */
import { useCallback, useEffect, useState } from 'react';
import { BrihaspatiProvider } from './BrihaspatiProvider';
import { BrihaspatiButton } from './BrihaspatiButton';
import { BrihaspatiPanel } from './BrihaspatiPanel';
import { BrihaspatiBanner } from './BrihaspatiBanner';
import { getSupabase } from '@/lib/supabase/client';

interface Props {
  locale?: 'en' | 'hi' | 'ta' | 'bn' | string;
}

type Currency = 'INR' | 'USD';

// USD is the safe default for the global audience. India-located
// visitors get INR after the /api/geo fetch lands (typically within
// 100ms of the panel mounting, well before the user opens it).
//
// Why a client fetch and not server-rendered geo? Reading `headers()`
// in `[locale]/layout.tsx` would opt every route into dynamic rendering,
// killing ISR static pre-rendering — the project's Static Page Budget
// rule (CLAUDE.md) and the vercel-ignore-build.sh policy both rely on
// the layout staying static. The `/api/geo` route handles the dynamic
// header read in isolation.
//
// Why USD as the optimistic default? The May 25 2026 incident (Madhavi:
// jha.madhavi85@gmail.com) was caused by defaulting non-Indian users to
// INR — Stripe Adaptive Pricing then converted ₹99 to a higher USD
// amount on the checkout page with a 2-4% conversion fee + FX markup.
// USD-by-default avoids that for everyone except Indian customers,
// where INR is intentional and uses the INR-native Price object.
const DEFAULT_CURRENCY: Currency = 'USD';

export default function BrihaspatiShell({ locale = 'en' }: Props) {
  const [initialCurrency, setInitialCurrency] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/geo', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { country?: string | null } | null) => {
        if (cancelled || !data) return;
        if (data.country === 'IN') setInitialCurrency('INR');
      })
      .catch((err) => {
        // Network failure or missing endpoint — stay on the USD default.
        // Indian users can still flip via the panel header toggle.
        console.error('[brihaspati] geo lookup failed:', err);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    const supabase = getSupabase();
    if (!supabase) return null;
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[brihaspati] getSession failed:', error.message);
        return null;
      }
      return data.session?.access_token ?? null;
    } catch (err) {
      console.error('[brihaspati] getSession threw:', err);
      return null;
    }
  }, []);

  // Only EN | HI | TA | BN drive Banner copy. Others fall back to EN.
  const localeForBanner: 'en' | 'hi' | 'ta' | 'bn' =
    locale === 'hi' || locale === 'ta' || locale === 'bn' ? locale : 'en';

  return (
    <BrihaspatiProvider getAccessToken={getAccessToken} initialCurrency={initialCurrency}>
      <BrihaspatiButton />
      <BrihaspatiPanel />
      <BrihaspatiBanner locale={localeForBanner} />
    </BrihaspatiProvider>
  );
}

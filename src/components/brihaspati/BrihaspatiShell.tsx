'use client';

/**
 * Client-only shell that mounts the Brihaspati Provider + Button + Panel
 * + Banner globally. Plugs into ClientShell which renders inside the
 * locale layout.
 *
 * Wires getAccessToken to the existing Supabase browser client.
 */
import { useCallback } from 'react';
import { BrihaspatiProvider } from './BrihaspatiProvider';
import { BrihaspatiButton } from './BrihaspatiButton';
import { BrihaspatiPanel } from './BrihaspatiPanel';
import { BrihaspatiBanner } from './BrihaspatiBanner';
import { getSupabase } from '@/lib/supabase/client';

interface Props {
  locale?: 'en' | 'hi' | 'ta' | 'bn' | string;
  /** ISO 3166-1 alpha-2 country code from the server-rendered geo
   *  header (`x-vercel-ip-country`). Used only to pick the initial
   *  panel currency. Users can flip in the panel header at any time. */
  country?: string;
}

export default function BrihaspatiShell({ locale = 'en', country }: Props) {
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

  // Pick the initial currency from the server-derived country code.
  // Only India routes via INR. Everyone else gets USD. The previous
  // INR-for-all default sent non-Indian customers through Stripe's
  // Adaptive Pricing conversion of an INR base price — Stripe applies
  // a 2-4% conversion fee plus FX markup, so a US customer who saw
  // ₹99 on the panel landed on Stripe Checkout displaying ~$1.20-2
  // (the May 25 2026 incident with jha.madhavi85@gmail.com). The
  // panel header still lets the user flip at any time.
  const initialCurrency = country === 'IN' ? 'INR' : 'USD';

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

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
}

export default function BrihaspatiShell({ locale = 'en' }: Props) {
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

  // Geo-detect on the server would be nicer; for now default to INR for
  // backward compatibility — Indian audience is the primary at launch.
  // The panel header lets users flip to $.
  const initialCurrency = 'INR';

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

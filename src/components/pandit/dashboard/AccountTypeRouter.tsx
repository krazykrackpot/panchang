'use client';

/**
 * Account-type router for /dashboard.
 *
 * Reads `user_profiles.account_type` and switches between the existing
 * seeker dashboard and the new Pandit dashboard home. Default 'seeker'
 * (every existing account stays on the consumer dashboard).
 *
 * Lives as a wrapper so the heavy SeekerDashboard component doesn't even
 * mount for Pandit users (avoids fetching personal kundali snapshot,
 * gochar, festivals etc. when the Pandit-side surfaces don't need them).
 *
 * Pandit CRM P1 + spec §2.
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

type AccountType = 'seeker' | 'pandit';

interface Props {
  seekerDashboard: React.ReactNode;
  panditDashboard: React.ReactNode;
}

export default function AccountTypeRouter({ seekerDashboard, panditDashboard }: Props) {
  const { user, initialized } = useAuthStore();
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      // Wait for auth to initialize before deciding — otherwise we may flash
      // the seeker dashboard for a logged-in Pandit during auth restore.
      if (!initialized) return;
      if (!user) {
        // Unauthenticated visitors → existing seeker dashboard renders its
        // own AuthModal / sign-in CTA. Don't override.
        if (!cancelled) {
          setAccountType('seeker');
          setLoading(false);
        }
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        if (!cancelled) {
          setAccountType('seeker');
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('account_type')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.error('[AccountTypeRouter] account_type load failed:', error);
      }
      if (!cancelled) {
        const t = (data?.account_type ?? 'seeker') as AccountType;
        setAccountType(t === 'pandit' ? 'pandit' : 'seeker');
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [user, initialized]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-text-tertiary text-sm">
          Loading your dashboard…
        </div>
      </div>
    );
  }

  return <>{accountType === 'pandit' ? panditDashboard : seekerDashboard}</>;
}

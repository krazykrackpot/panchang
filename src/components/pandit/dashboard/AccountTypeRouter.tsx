'use client';

/**
 * Account-type router for /dashboard.
 *
 * Reads `user_profiles.account_type` and renders:
 *
 *   • Seeker → SeekerDashboardImpl directly (no switcher; seekers have
 *     no client view).
 *   • Pandit → PanditDashboardSwitcher, which surfaces BOTH the CRM
 *     (`clientView`) and the regular seeker dashboard (`personalView`)
 *     for the pandit's own chart + family. A pandit is also a jyotish
 *     practitioner; they need their own dashboard too.
 *
 * Default for unauthenticated visitors and on lookup failure is the
 * seeker dashboard (its own AuthModal handles sign-in).
 *
 * Pandit CRM P1 + spec §2. Personal-view-for-pandit added 2026-06-05.
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { getAccountType } from '@/lib/user/get-profile';
import PanditDashboardSwitcher from './PanditDashboardSwitcher';

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
      const t = await getAccountType(supabase, user.id, 'AccountTypeRouter');
      if (!cancelled) {
        // null (error or no row) → seeker — preserves existing fall-through.
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

  if (accountType === 'pandit') {
    return (
      <PanditDashboardSwitcher
        clientView={panditDashboard}
        personalView={seekerDashboard}
      />
    );
  }
  return <>{seekerDashboard}</>;
}

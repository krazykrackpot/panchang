'use client';

/**
 * Pandit-only guard for /dashboard/alerts. Same pattern as the
 * /dashboard/clients/layout.tsx guard. Redirects non-Pandit users
 * back to /dashboard.
 *
 * Pandit CRM P8.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { getAccountType } from '@/lib/user/get-profile';

export default function PanditAlertsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!initialized) return;
      if (!user) {
        router.replace('/dashboard');
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        router.replace('/dashboard');
        return;
      }
      const accountType = await getAccountType(supabase, user.id, 'PanditAlertsLayout');
      if (cancelled) return;
      if (accountType !== 'pandit') {
        setAuthorized(false);
        router.replace('/dashboard');
        return;
      }
      setAuthorized(true);
    }
    check();
    return () => {
      cancelled = true;
    };
  }, [user, initialized, router]);

  if (authorized === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-pulse text-text-tertiary text-sm">Loading…</div>
      </div>
    );
  }
  if (!authorized) return null;
  return <>{children}</>;
}

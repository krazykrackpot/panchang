'use client';

/**
 * Pandit-only guard for /dashboard/settings. Mirrors the
 * /dashboard/clients/layout and /dashboard/alerts/layout guards.
 *
 * Pandit CRM P9.
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { getAccountType } from '@/lib/user/get-profile';

export default function PanditSettingsLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, initialized } = useAuthStore();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function check() {
      if (!initialized) return;
      if (!user) {
        router.replace('/settings');
        return;
      }
      const supabase = getSupabase();
      if (!supabase) {
        router.replace('/settings');
        return;
      }
      const accountType = await getAccountType(supabase, user.id, 'PanditSettingsLayout');
      if (cancelled) return;
      if (accountType !== 'pandit') {
        // Both error and non-pandit fall through to the seeker
        // settings page (the helper already logged the error).
        setAuthorized(false);
        router.replace('/settings');
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

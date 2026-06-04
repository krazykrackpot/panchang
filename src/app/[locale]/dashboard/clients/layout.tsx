'use client';

/**
 * Pandit-only layout guard for /dashboard/clients/*.
 *
 * AccountTypeRouter only wraps the /dashboard root page. Sub-routes
 * like /dashboard/clients and /dashboard/clients/[id] are reachable
 * via direct URL — a seeker navigating here would have seen the empty
 * Pandit roster + "Add your first client" onboarding, which is
 * confusing UX and a workflow leak. Gemini PR #406 round 3 HIGH.
 *
 * This layout fetches account_type on mount and redirects seekers
 * back to /dashboard (where the AccountTypeRouter will render the
 * correct seeker dashboard for them). Unauthenticated visitors are
 * also redirected — auth is required to see any Pandit-CRM surface.
 *
 * Spec §2 (persona model) + §16.2 (obvious workflows).
 */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';

export default function PanditClientsLayout({ children }: { children: React.ReactNode }) {
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
        // Supabase client failed to initialise — fall through to the
        // seeker dashboard to avoid blocking a logged-in user on a
        // transient infra issue.
        router.replace('/dashboard');
        return;
      }
      const { data, error } = await supabase
        .from('user_profiles')
        .select('account_type')
        .eq('id', user.id)
        .maybeSingle();
      if (error) {
        console.error('[PanditClientsLayout] account_type load failed:', error.message);
        if (!cancelled) setAuthorized(false);
        router.replace('/dashboard');
        return;
      }
      if (data?.account_type !== 'pandit') {
        if (!cancelled) setAuthorized(false);
        router.replace('/dashboard');
        return;
      }
      if (!cancelled) setAuthorized(true);
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

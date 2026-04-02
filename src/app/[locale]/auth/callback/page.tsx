'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';

export default function AuthCallbackPage() {
  const locale = useLocale();
  const [status, setStatus] = useState('Completing sign in...');

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setStatus('Auth not configured');
      setTimeout(() => { window.location.href = `/${locale}`; }, 2000);
      return;
    }

    let handled = false;

    const handleAuth = async () => {
      if (handled) return;
      handled = true;

      // Verify session is actually stored
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      console.log('[Auth Callback] Session after exchange:', user?.email ?? 'NO SESSION');
      console.log('[Auth Callback] localStorage keys:', Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase')));

      setStatus(user ? `Signed in as ${user.email}! Redirecting...` : 'Session exchange failed. Redirecting...');
      setTimeout(() => { window.location.href = `/${locale}`; }, 1000);
    };

    // Listen for the SIGNED_IN event from hash exchange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        handleAuth();
      }
    });

    // Check if session already exists
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        handleAuth();
      }
    });

    // Fallback: redirect after 8 seconds regardless
    const timeout = setTimeout(() => {
      if (!handled) {
        setStatus('Redirecting...');
        window.location.href = `/${locale}`;
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [locale]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent mx-auto mb-4" />
        <p className="text-text-secondary text-sm">{status}</p>
      </div>
    </div>
  );
}

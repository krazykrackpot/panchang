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

      // Wait a moment for Supabase to persist to localStorage
      await new Promise(r => setTimeout(r, 500));

      // Verify session is actually stored
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;
      const lsKeys = Object.keys(localStorage).filter(k => k.includes('sb-') || k.includes('supabase') || k.includes('auth'));
      console.log('[Auth Callback] Session user:', user?.email ?? 'NO SESSION');
      console.log('[Auth Callback] localStorage auth keys:', lsKeys);
      if (lsKeys.length > 0) {
        console.log('[Auth Callback] Token preview:', localStorage.getItem(lsKeys[0])?.substring(0, 80) + '...');
      }

      setStatus(user ? `Signed in as ${user.email}! Redirecting...` : 'Completing authentication...');

      // If we got a session, redirect after a beat
      if (user) {
        setTimeout(() => { window.location.href = `/${locale}`; }, 1000);
      } else {
        // Session not found yet — try once more after 2 seconds
        setTimeout(async () => {
          const { data: retry } = await supabase.auth.getSession();
          console.log('[Auth Callback] Retry session:', retry.session?.user?.email ?? 'STILL NO SESSION');
          setStatus(retry.session?.user ? `Signed in as ${retry.session.user.email}!` : 'Authentication may have failed');
          setTimeout(() => { window.location.href = `/${locale}`; }, 1000);
        }, 2000);
      }
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

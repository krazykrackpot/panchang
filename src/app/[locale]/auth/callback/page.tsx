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

    const handleAuth = () => {
      if (handled) return;
      handled = true;
      setStatus('Signed in! Redirecting...');
      // Use window.location.href for a full page reload — ensures fresh state
      setTimeout(() => { window.location.href = `/${locale}`; }, 500);
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

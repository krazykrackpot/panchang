'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSupabase } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      router.replace('/');
      return;
    }

    // Supabase auto-exchanges the hash fragment for a session
    // We just need to wait for it and then redirect
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Successfully authenticated — go to homepage
        router.replace('/');
      }
    });

    // Also check if session already exists (hash already processed)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace('/');
      }
    });

    // Fallback: if nothing happens in 5 seconds, go home anyway
    const timeout = setTimeout(() => router.replace('/'), 5000);
    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gold-primary border-t-transparent mx-auto mb-4" />
        <p className="text-text-secondary text-sm">Completing sign in...</p>
      </div>
    </div>
  );
}

'use client';

import { tl } from '@/lib/utils/trilingual';
import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase/client';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

export default function AuthCallbackPage() {
  const locale = useLocale();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Track every redirect-timeout we schedule inside this effect so the
    // cleanup return can clear them all on unmount. Without this, a user
    // who navigates away (back button, route change, modal dismiss) within
    // the redirect window would still fire `window.location.href` after
    // they'd already moved on — yanking them to /profile or / unexpectedly.
    // The handleAuth callback also schedules timeouts on the same array.
    // Gemini PR #673 MED.
    const redirectTimeouts: ReturnType<typeof setTimeout>[] = [];
    const scheduleRedirect = (href: string, delayMs: number) => {
      redirectTimeouts.push(setTimeout(() => { window.location.href = href; }, delayMs));
    };

    const supabase = getSupabase();
    if (!supabase) {
      setStatus('error');
      scheduleRedirect(`/${locale}`, 3000);
      return () => {
        for (const t of redirectTimeouts) clearTimeout(t);
      };
    }

    let handled = false;

    const handleAuth = async () => {
      if (handled) return;
      handled = true;

      await new Promise(r => setTimeout(r, 500));

      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      if (user) {
        setUserName(user.user_metadata?.name || user.email?.split('@')[0] || '');
        setStatus('success');

        // No welcome-email fetch fires here. The chart-dependent welcome at
        // /api/user/profile (gated by welcome_email_sent_at) already covers
        // every real signup — it fires the moment the user generates their
        // first kundali. The previous /api/user/signup-welcome fire-and-
        // forget path was dead code in practice: Google OAuth's redirectTo
        // is set to `${baseUrl}${returnPath}` in src/stores/auth-store.ts,
        // so OAuth users come back to the page they signed in from, not to
        // this callback. Observed 2026-06-14 + 2026-06-15: 4 real signups,
        // 0 hits to /api/user/signup-welcome in Vercel logs, all 4 received
        // the chart welcome on schedule.
        //
        // The 7-day onboarding drip cron (independent of this flow) still
        // covers users who sign up but never generate a chart.

        // Redirect to profile after 2 seconds (tracked for cleanup)
        scheduleRedirect(`/${locale}/profile`, 2500);
      } else {
        setStatus('error');
        scheduleRedirect(`/${locale}`, 3000);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        handleAuth();
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) handleAuth();
    });

    const timeout = setTimeout(() => {
      if (!handled) {
        setStatus('error');
        window.location.href = `/${locale}`;
      }
    }, 8000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
      for (const t of redirectTimeouts) clearTimeout(t);
    };
  }, [locale]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-gold-primary border-t-transparent mx-auto mb-6" />
            <p className="text-text-secondary text-lg">
              {tl({ en: 'Completing sign in...', hi: 'साइन इन पूर्ण हो रहा है...', sa: 'साइन इन पूर्ण हो रहा है...' }, locale)}
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-500/15 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gold-light mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl({ en: 'Welcome', hi: 'स्वागतम्', sa: 'स्वागतम्' }, locale)}{userName ? `, ${userName}` : ''}!
            </h2>
            <p className="text-text-secondary">
              {locale === 'en'
                ? 'Your email is verified. Taking you to your profile...'
                : 'आपका ईमेल सत्यापित हो गया। प्रोफ़ाइल पर ले जा रहे हैं...'}
            </p>
            <div className="mt-4 h-1 bg-bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2.5, ease: 'linear' }}
                className="h-full bg-gradient-to-r from-gold-dark to-gold-primary rounded-full"
              />
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/15 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-text-primary mb-2">
              {tl({ en: 'Something went wrong', hi: 'कुछ गलत हो गया', sa: 'कुछ गलत हो गया' }, locale)}
            </h2>
            <p className="text-text-secondary text-sm">
              {tl({ en: 'Redirecting to home page...', hi: 'मुख्य पृष्ठ पर ले जा रहे हैं...', sa: 'मुख्य पृष्ठ पर ले जा रहे हैं...' }, locale)}
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}

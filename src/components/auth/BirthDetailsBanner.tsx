'use client';

/**
 * Persistent prompt for logged-in users who completed onboarding without
 * adding their birth details.
 *
 * Background: the OnboardingModal allows date / time / place to be skipped
 * — the user is marked `onboarding_completed: true` even when those fields
 * are blank. Without birth data the app can't generate a kundali, can't
 * personalise the festival accordion, and can't surface Brihaspati's
 * chart-aware answers. This banner closes that funnel leak by re-prompting
 * the user on every page until they fill it in.
 *
 * Differences from SadhakaBanner:
 *   - Shows on /dashboard (SadhakaBanner explicitly hides there)
 *   - 6-hour cool-down on dismissal (not session-only) — the prompt comes
 *     back so the leak doesn't permanently close behind a single click
 *   - CTA opens the OnboardingModal directly via window event, not a
 *     route to /settings
 *
 * Spec: option 2 in the today's-funnel discussion — "allow skip but show
 * a persistent in-app prompt on dashboard / panchang / festival pages
 * until set."
 */

import { useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useAuthStore } from '@/stores/auth-store';
import { getSupabase } from '@/lib/supabase/client';
import { ONBOARDING_OPEN_EVENT, type OnboardingOpenEventDetail } from './onboarding-events';

const LS_DISMISSED_AT_KEY = 'birthDetailsBannerDismissedAt';
/** Six hours in ms — after which the dismissed banner returns. */
const COOLDOWN_MS = 6 * 60 * 60 * 1000;

interface Props {
  locale: string;
}

export default function BirthDetailsBanner({ locale }: Props) {
  const { user } = useAuthStore();
  const [needsPrompt, setNeedsPrompt] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Read dismiss timestamp from localStorage on mount.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const raw = localStorage.getItem(LS_DISMISSED_AT_KEY);
    setDismissedAt(raw ? Number(raw) || null : null);
  }, []);

  // Check the user's profile state — needs prompt only when they've
  // completed onboarding (so they're not seeing the first-time modal)
  // AND their date_of_birth is null (no chart can be generated).
  useEffect(() => {
    if (!user) {
      setNeedsPrompt(false);
      setLoaded(true);
      return;
    }
    let cancelled = false;
    const supabase = getSupabase();
    if (!supabase) {
      setLoaded(true);
      return;
    }
    supabase
      .from('user_profiles')
      .select('onboarding_completed, date_of_birth')
      .eq('id', user.id)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error('[BirthDetailsBanner] profile fetch failed:', error.message);
          setLoaded(true);
          return;
        }
        const needs = !!data?.onboarding_completed && !data?.date_of_birth;
        setNeedsPrompt(needs);
        setLoaded(true);
      });
    return () => { cancelled = true; };
  }, [user]);

  // Cool-down check: if we have a recent dismiss timestamp, don't re-show.
  const isCooledDown = dismissedAt !== null && (Date.now() - dismissedAt) < COOLDOWN_MS;

  if (!user) return null;
  if (!loaded) return null;
  if (!needsPrompt) return null;
  if (isCooledDown) return null;

  const handleDismiss = () => {
    const now = Date.now();
    try {
      localStorage.setItem(LS_DISMISSED_AT_KEY, String(now));
    } catch (err) {
      console.error('[BirthDetailsBanner] localStorage set failed:', err);
    }
    setDismissedAt(now);
  };

  const handleOpen = () => {
    const detail: OnboardingOpenEventDetail = { source: 'birth-details-banner' };
    window.dispatchEvent(new CustomEvent(ONBOARDING_OPEN_EVENT, { detail }));
  };

  // i18n: en + hi inline (matches the rest of the auth surface)
  const isHi = locale === 'hi';
  const headline = isHi
    ? 'अपने जन्म विवरण जोड़ें — व्यक्तिगत कुण्डली खोलें'
    : 'Add your birth details to unlock your kundali';
  const subtitle = isHi
    ? 'पर्व पाठ, बृहस्पति, और दैनिक पंचांग — सभी आपके चन्द्र राशि के अनुसार। ३० सेकण्ड लगते हैं।'
    : 'Festival reads, Brihaspati, and daily panchang — all tuned to your Moon sign. Takes 30 seconds.';
  const cta = isHi ? 'अभी जोड़ें' : 'Add now';
  const dismissLabel = isHi ? 'बाद में' : 'Maybe later';

  return (
    <div
      role="region"
      aria-label={headline}
      className="w-full bg-gradient-to-r from-amber-900/30 via-[#2d1b69]/40 to-[#1a1040]/50 border-b border-amber-500/40 px-4 py-3"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <Sparkles className="w-5 h-5 text-amber-300 flex-shrink-0 mt-0.5" />
          <div className="min-w-0">
            <p className="text-amber-100 font-semibold text-sm leading-tight">{headline}</p>
            <p className="text-amber-200/80 text-xs leading-snug mt-0.5">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleOpen}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-100 font-semibold text-xs transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {cta}
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            aria-label={dismissLabel}
            className="inline-flex items-center gap-1 px-2 py-1 text-amber-200/60 hover:text-amber-100 text-xs"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

/**
 * /dashboard/life-events — Life Event Timeline page.
 *
 * Layout (top → bottom):
 *   1. Page heading + back link
 *   2. LifeEventEntry form (add new event)
 *   3. LifeEventList (all recorded events)
 *
 * Planetary snapshot is captured server-side at submission time (via API route).
 * Auth: reads session token from useAuthStore.
 * Store: reads/writes via useLifeEventsStore.
 */

import { useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { CalendarDays, Loader2 } from 'lucide-react';
import { ArrowLeft } from 'lucide-react';

import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useLifeEventsStore } from '@/stores/life-events-store';

import LifeEventEntry from '@/components/journal/LifeEventEntry';
import LifeEventList from '@/components/journal/LifeEventList';

import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Life Event Timeline',
    subheading: 'Record milestones and see the cosmos at each moment.',
    back: 'Dashboard',
    loading: 'Loading events…',
    notLoggedIn: 'Sign in to track your life events.',
    signIn: 'Sign In',
    total: (n: number) => `${n} event${n !== 1 ? 's' : ''} recorded`,
    errorPrefix: 'Could not load events:',
  },
  hi: {
    heading: 'जीवन घटना समयरेखा',
    subheading: 'मील के पत्थर दर्ज करें और हर पल का ब्रह्मांड देखें।',
    back: 'डैशबोर्ड',
    loading: 'घटनाएं लोड हो रही हैं…',
    notLoggedIn: 'जीवन घटनाएं ट्रैक करने के लिए साइन इन करें।',
    signIn: 'साइन इन',
    total: (n: number) => `${n} घटनाएं दर्ज`,
    errorPrefix: 'घटनाएं लोड नहीं हो सकीं:',
  },
  ta: {
    heading: 'வாழ்க்கை நிகழ்வு காலவரிசை',
    subheading: 'மைல்கற்களை பதிவு செய்து ஒவ்வொரு தருணத்திலும் விண்மீன்களை பாருங்கள்.',
    back: 'டாஷ்போர்ட்',
    loading: 'நிகழ்வுகள் ஏற்றப்படுகின்றன…',
    notLoggedIn: 'வாழ்க்கை நிகழ்வுகளை கண்காணிக்க உள்நுழையவும்.',
    signIn: 'உள்நுழை',
    total: (n: number) => `${n} நிகழ்வுகள் பதிவு`,
    errorPrefix: 'நிகழ்வுகளை ஏற்ற முடியவில்லை:',
  },
  bn: {
    heading: 'জীবন ঘটনা টাইমলাইন',
    subheading: 'মাইলফলক রেকর্ড করুন এবং প্রতিটি মুহূর্তে মহাকাশ দেখুন।',
    back: 'ড্যাশবোর্ড',
    loading: 'ঘটনা লোড হচ্ছে…',
    notLoggedIn: 'জীবন ঘটনা ট্র্যাক করতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
    total: (n: number) => `${n}টি ঘটনা নথিভুক্ত`,
    errorPrefix: 'ঘটনা লোড হয়নি:',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function LifeEventsPage() {
  const locale = useLocale() as Locale;
  const L = getLabels(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const { session, initialized } = useAuthStore();
  const { events, loading, total, addEvent, fetchEvents, deleteEvent } = useLifeEventsStore();

  // -------------------------------------------------------------------------
  // Initial fetch — wait for auth before fetching (Rule F: all branches terminate loading)
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!initialized) return;
    const token = session?.access_token;
    if (!token) return;

    fetchEvents(token).catch((err) => {
      console.error('[life-events-page] fetchEvents threw:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, session]);

  // -------------------------------------------------------------------------
  // Submit handler — delegates to store, which calls POST /api/life-events
  // -------------------------------------------------------------------------
  const handleSubmit = useCallback(
    async (data: Parameters<typeof addEvent>[1]) => {
      const token = session?.access_token;
      if (!token) return { error: 'Not authenticated' };
      return addEvent(token, data);
    },
    [session, addEvent],
  );

  // -------------------------------------------------------------------------
  // Delete handler
  // -------------------------------------------------------------------------
  const handleDelete = useCallback(
    (id: string) => {
      const token = session?.access_token;
      if (!token) return;
      deleteEvent(token, id).catch((err) => {
        console.error('[life-events-page] deleteEvent threw:', err);
      });
    },
    [session, deleteEvent],
  );

  // -------------------------------------------------------------------------
  // Not authenticated
  // -------------------------------------------------------------------------
  if (initialized && !session) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <CalendarDays className="w-10 h-10 text-gold-primary/40 mx-auto mb-4" />
          <p className="text-text-secondary mb-4">{L.notLoggedIn}</p>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
          >
            {L.signIn}
          </Link>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Loading skeleton (initial)
  // -------------------------------------------------------------------------
  if (!initialized || (loading && events.length === 0)) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold-primary/50 animate-spin" />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-bg-primary px-4 py-8 max-w-3xl mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-gold-light transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {L.back}
      </Link>

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-gold-primary" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold text-gold-light leading-tight"
            style={hf}
          >
            {L.heading}
          </h1>
          <p className="text-xs text-text-secondary mt-0.5">
            {total > 0 ? L.total(total) : L.subheading}
          </p>
        </div>
      </motion.div>

      {/* Entry form */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-6"
      >
        <LifeEventEntry
          locale={locale}
          onSubmit={handleSubmit}
        />
      </motion.div>

      {/* Event list */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        {loading && events.length > 0 && (
          <div className="flex justify-center py-3">
            <Loader2 className="w-4 h-4 text-gold-primary/50 animate-spin" />
          </div>
        )}
        <LifeEventList
          events={events}
          locale={locale}
          onDelete={handleDelete}
        />
      </motion.div>
    </div>
  );
}

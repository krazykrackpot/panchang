'use client';

/**
 * /dashboard/journal — Astro Journal browse page.
 *
 * Layout (top → bottom):
 *   1. Page heading
 *   2. JournalCalendarHeatmap (last 90 days)
 *   3. JournalFiltersBar
 *   4. JournalEntryList
 *   5. "Load more" button when total > entries.length
 *
 * Heatmap date click: sets dateFrom/dateTo to that date and scrolls to entry list.
 *
 * Auth: reads session token from useAuthStore.
 * Store: reads/writes via useJournalStore.
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { BookOpen, Loader2, ChevronDown, Star } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { ArrowLeft } from 'lucide-react';

import { useAuthStore } from '@/stores/auth-store';
import { useJournalStore } from '@/stores/journal-store';

import JournalCalendarHeatmap from '@/components/journal/JournalCalendarHeatmap';
import JournalEntryList from '@/components/journal/JournalEntryList';
import JournalFiltersBar from '@/components/journal/JournalFilters';

import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Your Astro Journal',
    back: 'Dashboard',
    loadMore: 'Load more',
    loading: 'Loading entries…',
    errorPrefix: 'Could not load journal:',
    notLoggedIn: 'Sign in to view your journal.',
    signIn: 'Sign In',
    total: (n: number) => `${n} entries`,
    almanacLink: 'Year in the Stars',
  },
  hi: {
    heading: 'आपकी ज्योतिष डायरी',
    back: 'डैशबोर्ड',
    loadMore: 'और लोड करें',
    loading: 'प्रविष्टियाँ लोड हो रही हैं…',
    errorPrefix: 'जर्नल लोड नहीं हो सका:',
    notLoggedIn: 'अपनी जर्नल देखने के लिए साइन इन करें।',
    signIn: 'साइन इन',
    total: (n: number) => `${n} प्रविष्टियाँ`,
    almanacLink: 'सितारों में वर्ष',
  },
  sa: {
    heading: 'भवतः ज्योतिष-दैनिकी',
    back: 'डैशबोर्ड',
    loadMore: 'अधिकं लोड कुर्वन्तु',
    loading: 'प्रविष्टयः लोड भवन्ति…',
    errorPrefix: 'दैनिकी लोड न जाता:',
    notLoggedIn: 'दैनिकी द्रष्टुं साइन इन कुर्वन्तु।',
    signIn: 'साइन इन',
    total: (n: number) => `${n} प्रविष्टयः`,
    almanacLink: 'सितारों में वर्ष',
  },
  ta: {
    heading: 'உங்கள் ஜோதிட ஜர்னல்',
    back: 'டாஷ்போர்ட்',
    loadMore: 'மேலும் ஏற்று',
    loading: 'பதிவுகள் ஏற்றப்படுகின்றன…',
    errorPrefix: 'ஜர்னல் ஏற்ற முடியவில்லை:',
    notLoggedIn: 'ஜர்னல் பார்க்க உள்நுழையவும்.',
    signIn: 'உள்நுழை',
    total: (n: number) => `${n} பதிவுகள்`,
    almanacLink: 'நட்சத்திரங்களில் ஆண்டு',
  },
  bn: {
    heading: 'আপনার জ্যোতিষ জার্নাল',
    back: 'ড্যাশবোর্ড',
    loadMore: 'আরও লোড করুন',
    loading: 'এন্ট্রি লোড হচ্ছে…',
    errorPrefix: 'জার্নাল লোড হয়নি:',
    notLoggedIn: 'জার্নাল দেখতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
    total: (n: number) => `${n}টি এন্ট্রি`,
    almanacLink: 'তারাদের মধ্যে বছর',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function JournalPage() {
  const locale = useLocale() as Locale;
  const L = getLabels(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };

  const { session, initialized } = useAuthStore();
  const {
    entries,
    loading,
    filters,
    total,
    fetchEntries,
    deleteEntry,
    setFilters,
  } = useJournalStore();

  const entryListRef = useRef<HTMLDivElement>(null);

  // -------------------------------------------------------------------------
  // Initial fetch: wait for auth to be initialized before fetching.
  // Rule F: every branch must terminate loading — fetchEntries handles this.
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!initialized) return;
    const token = session?.access_token;
    if (!token) return;

    fetchEntries(token).catch((err) => {
      console.error('[journal-page] fetchEntries threw:', err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialized, session]);

  // -------------------------------------------------------------------------
  // Filter change: re-fetch with new filters
  // -------------------------------------------------------------------------
  const handleFilterChange = useCallback(
    (newFilters: typeof filters) => {
      const token = session?.access_token;
      if (!token) return;
      setFilters(newFilters);
      fetchEntries(token, { ...newFilters, offset: 0 }).catch((err) => {
        console.error('[journal-page] fetchEntries (filter) threw:', err);
      });
    },
    [session, setFilters, fetchEntries],
  );

  // -------------------------------------------------------------------------
  // Heatmap date click: set date filter and scroll to list
  // -------------------------------------------------------------------------
  const handleDateClick = useCallback(
    (dateStr: string) => {
      const token = session?.access_token;
      if (!token) return;

      const newFilters = { ...filters, dateFrom: dateStr, dateTo: dateStr, offset: 0 };
      setFilters(newFilters);
      fetchEntries(token, newFilters).catch((err) => {
        console.error('[journal-page] fetchEntries (heatmap click) threw:', err);
      });

      // Scroll to entry list
      setTimeout(() => {
        entryListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
    [session, filters, setFilters, fetchEntries],
  );

  // -------------------------------------------------------------------------
  // Load more
  // -------------------------------------------------------------------------
  const handleLoadMore = useCallback(() => {
    const token = session?.access_token;
    if (!token) return;

    const nextOffset = (filters.offset ?? 0) + (filters.limit ?? 30);
    const newFilters = { ...filters, offset: nextOffset };
    setFilters({ offset: nextOffset });

    fetchEntries(token, newFilters).catch((err) => {
      console.error('[journal-page] fetchEntries (load more) threw:', err);
    });
  }, [session, filters, setFilters, fetchEntries]);

  // -------------------------------------------------------------------------
  // Delete handler
  // -------------------------------------------------------------------------
  const handleDelete = useCallback(
    (id: string) => {
      const token = session?.access_token;
      if (!token) return;

      deleteEntry(token, id).catch((err) => {
        console.error('[journal-page] deleteEntry threw:', err);
      });
    },
    [session, deleteEntry],
  );

  // -------------------------------------------------------------------------
  // Not authenticated
  // -------------------------------------------------------------------------
  if (initialized && !session) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
        <div className="text-center">
          <BookOpen className="w-10 h-10 text-gold-primary/40 mx-auto mb-4" />
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
  if (!initialized || (loading && entries.length === 0)) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-gold-primary/50 animate-spin" />
      </div>
    );
  }

  const hasMore = total > entries.length;

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

      {/* Almanac cross-link */}
      <Link
        href="/dashboard/almanac"
        className="inline-flex items-center gap-1.5 text-xs text-gold-primary/70 hover:text-gold-light transition-colors mb-6 ml-4 border border-gold-primary/15 rounded-lg px-3 py-1.5 bg-gold-primary/5 hover:bg-gold-primary/10"
      >
        <Star className="w-3.5 h-3.5" />
        {L.almanacLink}
      </Link>

      {/* Page heading */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3 mb-8"
      >
        <div className="w-10 h-10 rounded-xl bg-gold-primary/10 border border-gold-primary/20 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-gold-primary" />
        </div>
        <div>
          <h1
            className="text-2xl font-bold text-gold-light leading-tight"
            style={hf}
          >
            {L.heading}
          </h1>
          {total > 0 && (
            <p className="text-xs text-text-secondary mt-0.5">{L.total(total)}</p>
          )}
        </div>
      </motion.div>

      {/* Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.05 }}
        className="mb-6 overflow-x-auto"
      >
        <JournalCalendarHeatmap
          entries={entries}
          locale={locale}
          onDateClick={handleDateClick}
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mb-6"
      >
        <JournalFiltersBar
          filters={filters}
          onChange={handleFilterChange}
          locale={locale}
        />
      </motion.div>

      {/* Entry list */}
      <motion.div
        ref={entryListRef}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="mb-6"
      >
        {loading && entries.length > 0 && (
          <div className="flex justify-center py-3">
            <Loader2 className="w-4 h-4 text-gold-primary/50 animate-spin" />
          </div>
        )}
        <JournalEntryList
          entries={entries}
          locale={locale}
          onDelete={handleDelete}
        />
      </motion.div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gold-primary/30 text-gold-primary text-sm font-semibold hover:bg-gold-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {L.loadMore}
          </button>
        </div>
      )}
    </div>
  );
}

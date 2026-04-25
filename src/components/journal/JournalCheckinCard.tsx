'use client';

/**
 * JournalCheckinCard — daily mood / energy check-in widget for the dashboard.
 *
 * Two states:
 *  - Form: mood selector, energy selector, note, tags, submit.
 *  - Summary: shows today's entry with MoodEnergyDisplay, note, tags, edit / view-journal links.
 *
 * Auth: reads session token from useAuthStore().
 * Store: reads/writes via useJournalStore().
 *
 * i18n: inline LABELS object (project convention for page-specific text).
 */

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Pencil, Loader2, ArrowRight, ChevronRight } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useJournalStore } from '@/stores/journal-store';
import MoodEnergyDisplay from './MoodEnergyDisplay';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    heading: 'Daily Check-in',
    moodLabel: 'How do you feel?',
    energyLabel: 'Energy level?',
    noteLabel: 'How\'s your day?',
    notePlaceholder: 'How\'s your day?',
    tagsLabel: 'Tags',
    submit: 'Save Check-in',
    submitting: 'Saving…',
    checkedInTitle: 'Today\'s Check-in',
    editBtn: 'Edit',
    viewJournal: 'View Journal',
    moodNames: ['', 'Low', 'Rough', 'Okay', 'Good', 'Great'],
    errorPrefix: 'Could not save:',
    alreadyCheckedIn: 'You\'ve already checked in today.',
    notLoggedIn: 'Sign in to use the journal.',
  },
  hi: {
    heading: 'दैनिक जाँच',
    moodLabel: 'आप कैसा महसूस कर रहे हैं?',
    energyLabel: 'ऊर्जा स्तर?',
    noteLabel: 'आपका दिन कैसा है?',
    notePlaceholder: 'आपका दिन कैसा है?',
    tagsLabel: 'टैग',
    submit: 'जाँच सहेजें',
    submitting: 'सहेज रहे हैं…',
    checkedInTitle: 'आज की जाँच',
    editBtn: 'संपादित करें',
    viewJournal: 'जर्नल देखें',
    moodNames: ['', 'निम्न', 'कठिन', 'ठीक', 'अच्छा', 'बेहतरीन'],
    errorPrefix: 'सहेज नहीं सका:',
    alreadyCheckedIn: 'आपने आज पहले से जाँच की है।',
    notLoggedIn: 'जर्नल उपयोग के लिए साइन इन करें।',
  },
  sa: {
    heading: 'दैनिकी प्रविष्टिः',
    moodLabel: 'भवान् कथं अनुभवति?',
    energyLabel: 'ऊर्जास्तरः?',
    noteLabel: 'अद्य कथम्?',
    notePlaceholder: 'अद्य कथम्?',
    tagsLabel: 'पटिकाः',
    submit: 'प्रविष्टिं सुरक्षयतु',
    submitting: 'सुरक्षयति…',
    checkedInTitle: 'अद्यतनप्रविष्टिः',
    editBtn: 'सम्पादयतु',
    viewJournal: 'दैनिकीं पश्यतु',
    moodNames: ['', 'न्यून', 'कठिनः', 'साधारण', 'शुभः', 'उत्तमः'],
    errorPrefix: 'सुरक्षण विफलम्:',
    alreadyCheckedIn: 'अद्य भवान् प्रविष्टिम् अकरोत्।',
    notLoggedIn: 'दैनिकी उपयोगार्थं साइन इन कुर्वन्तु।',
  },
  ta: {
    heading: 'தினசரி சரிபார்ப்பு',
    moodLabel: 'எப்படி உணர்கிறீர்கள்?',
    energyLabel: 'ஆற்றல் நிலை?',
    noteLabel: 'உங்கள் நாள் எப்படி?',
    notePlaceholder: 'உங்கள் நாள் எப்படி?',
    tagsLabel: 'குறிச்சொற்கள்',
    submit: 'சேமி',
    submitting: 'சேமிக்கிறது…',
    checkedInTitle: 'இன்றைய சரிபார்ப்பு',
    editBtn: 'திருத்து',
    viewJournal: 'ஜர்னல் காண்',
    moodNames: ['', 'குறைவு', 'கடினம்', 'சரி', 'நல்லது', 'மிகவும் நல்லது'],
    errorPrefix: 'சேமிக்க முடியவில்லை:',
    alreadyCheckedIn: 'இன்று ஏற்கனவே சரிபார்த்தீர்கள்.',
    notLoggedIn: 'ஜர்னல் பயன்படுத்த உள்நுழையவும்.',
  },
  bn: {
    heading: 'দৈনিক চেক-ইন',
    moodLabel: 'কেমন অনুভব করছেন?',
    energyLabel: 'শক্তির মাত্রা?',
    noteLabel: 'আপনার দিন কেমন?',
    notePlaceholder: 'আপনার দিন কেমন?',
    tagsLabel: 'ট্যাগ',
    submit: 'সংরক্ষণ করুন',
    submitting: 'সংরক্ষণ হচ্ছে…',
    checkedInTitle: 'আজকের চেক-ইন',
    editBtn: 'সম্পাদনা',
    viewJournal: 'জার্নাল দেখুন',
    moodNames: ['', 'নিম্ন', 'কঠিন', 'ঠিক আছে', 'ভালো', 'দারুণ'],
    errorPrefix: 'সংরক্ষণ হয়নি:',
    alreadyCheckedIn: 'আপনি আজ ইতিমধ্যে চেক-ইন করেছেন।',
    notLoggedIn: 'জার্নাল ব্যবহারের জন্য সাইন ইন করুন।',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;

function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Predefined tags
// ---------------------------------------------------------------------------
const TAGS = [
  'work', 'health', 'relationship', 'spiritual',
  'travel', 'sleep', 'exercise', 'creative',
] as const;

// ---------------------------------------------------------------------------
// Mood colour helpers (mirrors MoodEnergyDisplay)
// ---------------------------------------------------------------------------
const MOOD_BG = ['', 'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-lime-400', 'bg-emerald-400'] as const;
const MOOD_BORDER = ['', 'border-red-400', 'border-orange-400', 'border-yellow-400', 'border-lime-400', 'border-emerald-400'] as const;
const MOOD_TEXT = ['', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-lime-400', 'text-emerald-400'] as const;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
interface Props {
  locale: string;
}

export default function JournalCheckinCard({ locale }: Props) {
  const L = getLabels(locale);
  const { session, initialized } = useAuthStore();
  const { todayEntry, loading, submitCheckin, fetchTodayEntry } = useJournalStore();

  const [editing, setEditing]   = useState(false);
  const [mood, setMood]         = useState(3);
  const [energy, setEnergy]     = useState(3);
  const [note, setNote]         = useState('');
  const [tags, setTags]         = useState<string[]>([]);
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting]   = useState(false);

  // On mount (after auth initialised): fetch today's entry to determine state.
  // Rule F: wait for initialized before firing; all branches must terminate loading.
  useEffect(() => {
    if (!initialized) return;
    const token = session?.access_token;
    if (!token) return;
    fetchTodayEntry(token).catch((err) => {
      console.error('[JournalCheckinCard] fetchTodayEntry threw:', err);
    });
  }, [initialized, session, fetchTodayEntry]);

  // When entering edit mode, pre-fill form from existing entry.
  const enterEdit = useCallback(() => {
    if (todayEntry) {
      setMood(todayEntry.mood   ?? 3);
      setEnergy(todayEntry.energy ?? 3);
      setNote(todayEntry.note   ?? '');
      setTags(todayEntry.tags   ?? []);
    }
    setSubmitError('');
    setEditing(true);
  }, [todayEntry]);

  const toggleTag = (tag: string) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    const token = session?.access_token;
    if (!token) return;

    setSubmitting(true);
    setSubmitError('');

    const result = await submitCheckin(token, {
      mood,
      energy,
      note: note.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
    });

    // Loading always terminates — submitCheckin flips store.loading; local submitting flag:
    setSubmitting(false);

    if (result.error) {
      console.error('[JournalCheckinCard] submitCheckin failed:', result.error);
      setSubmitError(result.error);
      return;
    }

    setEditing(false);
  };

  // -------------------------------------------------------------------------
  // Not signed in
  // -------------------------------------------------------------------------
  if (initialized && !session) {
    return null; // silently omit — dashboard already handles the unauthenticated state
  }

  // -------------------------------------------------------------------------
  // Loading skeleton (initial fetch)
  // -------------------------------------------------------------------------
  if (!initialized || (loading && !todayEntry && !editing)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-4 h-4 text-gold-primary" />
          <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light">{L.heading}</h3>
        </div>
        <div className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 text-gold-primary/50 animate-spin" />
        </div>
      </motion.div>
    );
  }

  // -------------------------------------------------------------------------
  // Summary state (already checked in today, not editing)
  // -------------------------------------------------------------------------
  if (todayEntry && !editing) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gold-primary" />
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light">{L.checkedInTitle}</h3>
          </div>
          <button
            onClick={enterEdit}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-gold-primary border border-gold-primary/30 hover:bg-gold-primary/10 transition-colors"
          >
            <Pencil className="w-3 h-3" />
            {L.editBtn}
          </button>
        </div>

        {/* Mood + Energy display */}
        {(todayEntry.mood != null && todayEntry.energy != null) && (
          <div className="mb-3">
            <MoodEnergyDisplay
              mood={todayEntry.mood}
              energy={todayEntry.energy}
              size="md"
            />
          </div>
        )}

        {/* Note */}
        {todayEntry.note && (
          <p className="text-text-primary text-sm leading-relaxed mt-2 mb-3 italic">
            &ldquo;{todayEntry.note}&rdquo;
          </p>
        )}

        {/* Tags */}
        {todayEntry.tags && todayEntry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {todayEntry.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-0.5 rounded-full text-xs border border-gold-primary/30 text-gold-primary bg-gold-primary/5"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* View Journal link */}
        <Link
          href="/dashboard/journal"
          className="inline-flex items-center gap-1 text-xs text-text-secondary hover:text-gold-light transition-colors"
        >
          {L.viewJournal}
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </motion.div>
    );
  }

  // -------------------------------------------------------------------------
  // Form state (no entry today, or editing)
  // -------------------------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#1a1040]/40 to-[#0a0e27] p-5"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 h-4 text-gold-primary" />
        <h3 className="text-sm font-bold uppercase tracking-widest text-gold-light">{L.heading}</h3>
      </div>

      {/* Mood selector */}
      <div className="mb-4">
        <p className="text-xs text-text-secondary mb-2">{L.moodLabel}</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((level) => {
            const selected = level === mood;
            return (
              <button
                key={level}
                onClick={() => setMood(level)}
                title={L.moodNames[level]}
                aria-label={`Mood ${L.moodNames[level]}`}
                className={[
                  'flex flex-col items-center gap-1 rounded-xl px-2 py-1.5 border transition-all',
                  selected
                    ? `${MOOD_BG[level]} border-transparent text-bg-primary shadow-md ring-2 ring-gold-primary`
                    : `bg-transparent ${MOOD_BORDER[level]} opacity-50 hover:opacity-80 ${MOOD_TEXT[level]}`,
                ].join(' ')}
              >
                <span className={`w-4 h-4 rounded-full ${selected ? 'bg-bg-primary/30' : MOOD_BG[level]}`} aria-hidden="true" />
                <span className="text-[10px] font-semibold leading-none">
                  {L.moodNames[level]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Energy selector */}
      <div className="mb-4">
        <p className="text-xs text-text-secondary mb-2">{L.energyLabel}</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((level) => {
            const selected = level === energy;
            return (
              <button
                key={level}
                onClick={() => setEnergy(level)}
                aria-label={`Energy ${level}`}
                className={[
                  'flex flex-col items-center gap-1 rounded-xl px-2.5 py-1.5 border transition-all',
                  selected
                    ? 'bg-sky-400 border-transparent text-bg-primary shadow-md ring-2 ring-gold-primary'
                    : 'bg-transparent border-sky-400/40 text-sky-400 opacity-50 hover:opacity-80',
                ].join(' ')}
              >
                {/* Stacked bars as energy icon */}
                <span className="flex items-end gap-0.5 h-4" aria-hidden="true">
                  {[1, 2, 3].map((bar) => (
                    <span
                      key={bar}
                      className={`w-1 rounded-sm ${selected ? 'bg-bg-primary/50' : 'bg-sky-400'}`}
                      style={{ height: `${4 + bar * 3}px` }}
                    />
                  ))}
                </span>
                <span className="text-[10px] font-bold leading-none">{level}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Note */}
      <div className="mb-4">
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value.slice(0, 500))}
          placeholder={L.notePlaceholder}
          maxLength={500}
          className="w-full rounded-xl bg-bg-primary/60 border border-gold-primary/20 px-4 py-2.5 text-sm text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-gold-primary/50 transition-colors"
        />
      </div>

      {/* Tags */}
      <div className="mb-4">
        <p className="text-xs text-text-secondary mb-2">{L.tagsLabel}</p>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((tag) => {
            const active = tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={[
                  'px-3 py-1 rounded-full text-xs font-medium border transition-all',
                  active
                    ? 'bg-gold-primary/10 border-gold-primary text-gold-light'
                    : 'bg-transparent border-text-secondary/20 text-text-secondary hover:border-gold-primary/40 hover:text-text-primary',
                ].join(' ')}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Error message */}
      {submitError && (
        <p className="mb-3 text-xs text-red-400">
          {L.errorPrefix} {submitError}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {L.submitting}
            </>
          ) : (
            <>
              {L.submit}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* If editing, also show View Journal link */}
        {editing && (
          <button
            onClick={() => setEditing(false)}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </motion.div>
  );
}

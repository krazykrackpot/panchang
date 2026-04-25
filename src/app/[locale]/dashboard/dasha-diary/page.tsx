'use client';

/**
 * /dashboard/dasha-diary
 *
 * Structured reflection at dasha/antardasha boundaries.
 *
 * Flow:
 *  1. Require auth (redirect hint if not signed in)
 *  2. GET /api/dasha-diary?locale=XX → current dasha + generated prompt
 *  3. Show prompt in a journal-style textarea
 *  4. Save via POST /api/journal with entry_type='dasha_boundary' in tags
 *  5. Show past dasha reflections filtered from GET /api/journal?tags=dasha_boundary
 *
 * Auth: Bearer token from useAuthStore.session.access_token
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Loader2, Save, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { DashaEntry } from '@/types/kundali';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: 'Dasha Diary',
    subtitle: 'Reflect on your current planetary period',
    back: 'Dashboard',
    loading: 'Loading your dasha…',
    notSignedIn: 'Sign in to access your Dasha Diary.',
    signIn: 'Sign In',
    noDasha: 'No dasha timeline found. Generate your kundali first.',
    generateKundali: 'Generate Kundali',
    currentPeriod: 'Current Period',
    maha: 'Mahadasha',
    antar: 'Antardasha',
    ends: 'Ends',
    reflectionLabel: 'Your Reflection',
    reflectionPlaceholder: 'Write your thoughts on this dasha period…',
    save: 'Save Entry',
    saving: 'Saving…',
    saved: 'Saved!',
    saveError: 'Could not save — try again.',
    pastTitle: 'Past Dasha Reflections',
    pastLoading: 'Loading past entries…',
    noPastEntries: 'No past dasha reflections yet.',
    errorPrefix: 'Error:',
    on: 'on',
    note: 'Note',
  },
  hi: {
    title: 'दशा डायरी',
    subtitle: 'अपने वर्तमान ग्रह दशाकाल पर विचार करें',
    back: 'डैशबोर्ड',
    loading: 'आपकी दशा लोड हो रही है…',
    notSignedIn: 'अपनी दशा डायरी देखने के लिए साइन इन करें।',
    signIn: 'साइन इन',
    noDasha: 'कोई दशा समयरेखा नहीं मिली। पहले अपनी कुण्डली बनाएँ।',
    generateKundali: 'कुण्डली बनाएँ',
    currentPeriod: 'वर्तमान काल',
    maha: 'महादशा',
    antar: 'अंतर्दशा',
    ends: 'समाप्ति',
    reflectionLabel: 'आपका विचार',
    reflectionPlaceholder: 'इस दशाकाल पर अपने विचार लिखें…',
    save: 'सहेजें',
    saving: 'सहेजा जा रहा है…',
    saved: 'सहेज लिया!',
    saveError: 'सहेजा नहीं जा सका — पुनः प्रयास करें।',
    pastTitle: 'पिछले दशा विचार',
    pastLoading: 'पिछली प्रविष्टियाँ लोड हो रही हैं…',
    noPastEntries: 'अभी तक कोई दशा विचार नहीं।',
    errorPrefix: 'त्रुटि:',
    on: 'को',
    note: 'नोट',
  },
  ta: {
    title: 'தசா டைரி',
    subtitle: 'உங்கள் தற்போதைய கிரக தசாகாலத்தை சிந்தியுங்கள்',
    back: 'டாஷ்போர்ட்',
    loading: 'உங்கள் தசா ஏற்றப்படுகிறது…',
    notSignedIn: 'தசா டைரி பார்க்க உள்நுழையவும்.',
    signIn: 'உள்நுழை',
    noDasha: 'தசா காலவரிசை இல்லை. முதலில் ஜாதகம் உருவாக்கவும்.',
    generateKundali: 'ஜாதகம் உருவாக்கு',
    currentPeriod: 'தற்போதைய காலம்',
    maha: 'மகாதசை',
    antar: 'அந்தர்தசை',
    ends: 'முடிவு',
    reflectionLabel: 'உங்கள் சிந்தனை',
    reflectionPlaceholder: 'இந்த தசாகாலத்தில் உங்கள் எண்ணங்களை எழுதுங்கள்…',
    save: 'சேமி',
    saving: 'சேமிக்கிறது…',
    saved: 'சேமிக்கப்பட்டது!',
    saveError: 'சேமிக்க முடியவில்லை — மீண்டும் முயற்சிக்கவும்.',
    pastTitle: 'கடந்த தசா சிந்தனைகள்',
    pastLoading: 'கடந்த பதிவுகள் ஏற்றப்படுகின்றன…',
    noPastEntries: 'இதுவரை தசா சிந்தனைகள் இல்லை.',
    errorPrefix: 'பிழை:',
    on: 'அன்று',
    note: 'குறிப்பு',
  },
  bn: {
    title: 'দশা ডায়েরি',
    subtitle: 'আপনার বর্তমান গ্রহ দশাকাল নিয়ে চিন্তা করুন',
    back: 'ড্যাশবোর্ড',
    loading: 'আপনার দশা লোড হচ্ছে…',
    notSignedIn: 'দশা ডায়েরি দেখতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
    noDasha: 'কোনো দশা সময়রেখা পাওয়া যায়নি। প্রথমে কুণ্ডলী তৈরি করুন।',
    generateKundali: 'কুণ্ডলী তৈরি করুন',
    currentPeriod: 'বর্তমান কাল',
    maha: 'মহাদশা',
    antar: 'অন্তর্দশা',
    ends: 'শেষ',
    reflectionLabel: 'আপনার ভাবনা',
    reflectionPlaceholder: 'এই দশাকালে আপনার চিন্তা লিখুন…',
    save: 'সংরক্ষণ',
    saving: 'সংরক্ষণ হচ্ছে…',
    saved: 'সংরক্ষিত!',
    saveError: 'সংরক্ষণ হয়নি — আবার চেষ্টা করুন।',
    pastTitle: 'আগের দশা ভাবনা',
    pastLoading: 'আগের এন্ট্রি লোড হচ্ছে…',
    noPastEntries: 'এখনো কোনো দশা ভাবনা নেই।',
    errorPrefix: 'ত্রুটি:',
    on: 'তারিখে',
    note: 'নোট',
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getL(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface DashaDiaryInfo {
  currentMaha: DashaEntry;
  currentAntar: DashaEntry | null;
  prompt: string;
  natalPlanetInfo: {
    houseRuled: number[];
    signPlacement: string;
    housePlacement: number;
  };
}

interface PastEntry {
  id: string;
  entry_date: string;
  note: string | null;
  tags: string[];
  maha_dasha: string | null;
  antar_dasha: string | null;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function DashaDiaryPage() {
  const locale = useLocale() as Locale;
  const L = getL(locale);
  const hf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bf = isDevanagariLocale(locale)
    ? { fontFamily: 'var(--font-devanagari-body)' }
    : {};

  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const initialized = useAuthStore((s) => s.initialized);

  const [dashaInfo, setDashaInfo] = useState<DashaDiaryInfo | null>(null);
  const [dashaLoading, setDashaLoading] = useState(true);
  const [dashaError, setDashaError] = useState<string | null>(null);

  const [reflection, setReflection] = useState('');
  const [saveState, setSaveState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const [pastEntries, setPastEntries] = useState<PastEntry[]>([]);
  const [pastLoading, setPastLoading] = useState(false);

  // --- Fetch current dasha info ---
  const fetchDashaInfo = useCallback(async () => {
    if (!session?.access_token) return;
    setDashaLoading(true);
    setDashaError(null);
    try {
      const res = await fetch(`/api/dasha-diary?locale=${encodeURIComponent(locale)}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed to load dasha info');
      setDashaInfo(json as DashaDiaryInfo);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[dasha-diary] fetch dasha info failed:', err);
      setDashaError(msg);
    } finally {
      setDashaLoading(false);
    }
  }, [session?.access_token, locale]);

  // --- Fetch past dasha journal entries ---
  const fetchPastEntries = useCallback(async () => {
    if (!session?.access_token) return;
    setPastLoading(true);
    try {
      const res = await fetch('/api/journal?tags=dasha_boundary&limit=10', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      const json = await res.json();
      if (!res.ok) {
        console.error('[dasha-diary] past entries fetch failed:', json.error);
        return;
      }
      setPastEntries((json.entries ?? []) as PastEntry[]);
    } catch (err) {
      console.error('[dasha-diary] past entries fetch error:', err);
    } finally {
      setPastLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    // Wait for auth to initialize before deciding whether to fetch
    if (!initialized) return;
    if (!user || !session) {
      setDashaLoading(false);
      return;
    }
    fetchDashaInfo();
    fetchPastEntries();
  }, [initialized, user, session, fetchDashaInfo, fetchPastEntries]);

  // --- Save reflection ---
  const handleSave = useCallback(async () => {
    if (!session?.access_token || !reflection.trim()) return;
    setSaveState('saving');
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          mood: 3,      // neutral default — user can update via main journal
          energy: 3,
          note: reflection.trim().slice(0, 500),
          tags: ['dasha_boundary'],
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Save failed');
      setSaveState('saved');
      setReflection('');
      // Refresh past entries
      fetchPastEntries();
      // Reset saved state after 3 s
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err) {
      console.error('[dasha-diary] save failed:', err);
      setSaveState('error');
    }
  }, [session?.access_token, reflection, fetchPastEntries]);

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  if (!initialized || (dashaLoading && user)) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex items-center justify-center" style={bf}>
        <Loader2 className="w-6 h-6 text-gold-primary animate-spin" />
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-[#0a0e27] flex flex-col items-center justify-center gap-4 px-4" style={bf}>
        <BookOpen className="w-10 h-10 text-gold-primary/60" />
        <p className="text-text-secondary text-center">{L.notSignedIn}</p>
        <Link
          href="/auth"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 transition-all"
        >
          {L.signIn}
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0e27] text-text-primary px-4 py-8" style={bf}>
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-text-secondary hover:text-gold-light text-sm transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            {L.back}
          </Link>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-xl bg-gold-primary/15 border border-gold-primary/25">
              <BookOpen className="w-5 h-5 text-gold-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gold-light" style={hf}>{L.title}</h1>
          </div>
          <p className="text-text-secondary text-sm">{L.subtitle}</p>
        </motion.div>

        {/* Error loading dasha */}
        {dashaError && (
          <div className="mb-6 flex items-start gap-2 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium">{L.errorPrefix}</span> {dashaError}
              {dashaError.includes('kundali') && (
                <div className="mt-2">
                  <Link
                    href="/kundali"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gold-primary/20 border border-gold-primary/30 text-gold-light text-xs font-semibold hover:bg-gold-primary/30 transition-all"
                  >
                    {L.generateKundali}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Current period + prompt */}
        {dashaInfo && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-6 mb-10"
          >
            {/* Dasha period badge */}
            <div className="p-5 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
              <h2 className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">
                {L.currentPeriod}
              </h2>
              <div className="flex flex-wrap gap-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-text-secondary uppercase tracking-wide">{L.maha}</span>
                  <span className="text-gold-light font-bold text-lg" style={hf}>
                    {dashaInfo.currentMaha.planet}
                  </span>
                  <span className="text-xs text-text-secondary flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {L.ends} {dashaInfo.currentMaha.endDate}
                  </span>
                </div>
                {dashaInfo.currentAntar && (
                  <>
                    <div className="self-center text-gold-primary/40 text-lg">›</div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-text-secondary uppercase tracking-wide">{L.antar}</span>
                      <span className="text-gold-light font-bold text-lg" style={hf}>
                        {dashaInfo.currentAntar.planet}
                      </span>
                      <span className="text-xs text-text-secondary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {L.ends} {dashaInfo.currentAntar.endDate}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Generated prompt */}
            <div className="p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <p className="text-sm text-text-primary leading-relaxed italic">
                {dashaInfo.prompt}
              </p>
            </div>

            {/* Reflection textarea */}
            <div className="p-5 rounded-2xl border border-gold-primary/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] space-y-3">
              <label className="block text-gold-light text-sm font-semibold" style={hf}>
                {L.reflectionLabel}
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder={L.reflectionPlaceholder}
                maxLength={500}
                rows={6}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0a0e27] border border-gold-primary/20 text-text-primary text-sm resize-none focus:outline-none focus:border-gold-primary/60 transition-colors placeholder:text-text-secondary/40"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-text-secondary/50">{reflection.length}/500</span>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saveState === 'saving' || !reflection.trim()}
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold text-sm hover:brightness-110 disabled:opacity-50 transition-all"
                >
                  {saveState === 'saving' ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />{L.saving}</>
                  ) : saveState === 'saved' ? (
                    <><CheckCircle className="w-4 h-4" />{L.saved}</>
                  ) : (
                    <><Save className="w-4 h-4" />{L.save}</>
                  )}
                </button>
              </div>
              {saveState === 'error' && (
                <p className="text-red-400 text-xs">{L.saveError}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Past entries */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h2 className="text-gold-light font-semibold text-base mb-4" style={hf}>
            {L.pastTitle}
          </h2>

          {pastLoading ? (
            <div className="flex items-center gap-2 text-text-secondary text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              {L.pastLoading}
            </div>
          ) : pastEntries.length === 0 ? (
            <p className="text-text-secondary text-sm">{L.noPastEntries}</p>
          ) : (
            <div className="space-y-4">
              {pastEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/25 via-[#1a1040]/30 to-[#0a0e27]"
                >
                  <div className="flex items-center gap-2 mb-2 text-[11px] text-text-secondary">
                    <Clock className="w-3 h-3" />
                    <span>{entry.entry_date}</span>
                    {entry.maha_dasha && (
                      <>
                        <span className="text-gold-primary/40">·</span>
                        <span className="text-gold-light/70 font-medium">
                          {entry.maha_dasha}
                          {entry.antar_dasha ? ` › ${entry.antar_dasha}` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  {entry.note ? (
                    <p className="text-text-primary text-sm leading-relaxed">{entry.note}</p>
                  ) : (
                    <p className="text-text-secondary/50 text-xs italic">(no note)</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

'use client';

/**
 * /dashboard/almanac — "Year in the Stars" personalised almanac.
 *
 * Sections (when data is sufficient):
 *   1. Header — year selector + entry/event/prediction counts
 *   2. Mood Trend Chart — 12-month SVG line chart
 *   3. Monthly Highlights — 3×4 grid cards
 *   4. Life Events Summary — category breakdown
 *   5. Prediction Accuracy — bar display
 *   6. Personal Discoveries — insight list
 *   7. Nakshatra Affinity — top 3 by frequency + mood
 *   8. Dasha Journey — dasha insight + dominant periods
 *
 * Auth: Bearer token from useAuthStore.
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  Star,
  Calendar,
  TrendingUp,
  ChevronDown,
  Lightbulb,
  Target,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import type { AlmanacReport } from '@/lib/personalization/almanac-engine';
import type { Locale } from '@/types/panchang';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    title: (y: number) => `Your ${y} in the Stars`,
    subtitle: 'Personalised annual almanac',
    back: 'Dashboard',
    loading: 'Generating your almanac…',
    notSignedIn: 'Sign in to view your almanac.',
    signIn: 'Sign In',
    yearLabel: 'Year',
    insufficientTitle: 'Not enough data yet',
    insufficientDesc: (current: number, required: number) =>
      `Log ${required - current} more journal entries to unlock your almanac.`,
    progress: 'Progress',
    totalEntries: 'Journal Entries',
    totalEvents: 'Life Events',
    totalPredictions: 'Predictions',
    moodTrendTitle: 'Mood & Energy Trend',
    moodLabel: 'Mood',
    energyLabel: 'Energy',
    monthlyTitle: 'Monthly Highlights',
    entryCount: (n: number) => `${n} entries`,
    noEntries: 'No entries',
    topEvent: 'Top event',
    dasha: 'Dasha',
    nakshatra: 'Nakshatra',
    lifeEventsTitle: 'Life Events Summary',
    eventCount: (n: number) => `${n} event${n === 1 ? '' : 's'}`,
    avgSignificance: 'Avg significance',
    predAccTitle: 'Prediction Accuracy',
    correct: 'Correct',
    partial: 'Partial',
    incorrect: 'Incorrect',
    pending: 'Pending',
    accuracy: 'Accuracy',
    discoveriesTitle: 'Personal Discoveries',
    nakshatraTitle: 'Nakshatra Affinity',
    dashaTitle: 'Dasha Journey',
    topNakshatras: 'Top Nakshatras',
    countLabel: 'entries',
    mood: 'Mood',
    energy: 'Energy',
    errorPrefix: 'Could not load almanac:',
    noData: 'No almanac data for this year.',
    months: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    ],
    monthsFull: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December',
    ],
  },
  hi: {
    title: (y: number) => `${y} में आपके सितारे`,
    subtitle: 'व्यक्तिगत वार्षिक पंचांग',
    back: 'डैशबोर्ड',
    loading: 'आपका पंचांग बन रहा है…',
    notSignedIn: 'अपना पंचांग देखने के लिए साइन इन करें।',
    signIn: 'साइन इन',
    yearLabel: 'वर्ष',
    insufficientTitle: 'अभी पर्याप्त डेटा नहीं',
    insufficientDesc: (current: number, required: number) =>
      `अपना पंचांग खोलने के लिए ${required - current} और प्रविष्टियाँ जोड़ें।`,
    progress: 'प्रगति',
    totalEntries: 'जर्नल प्रविष्टियाँ',
    totalEvents: 'जीवन घटनाएँ',
    totalPredictions: 'भविष्यवाणियाँ',
    moodTrendTitle: 'मनोदशा और ऊर्जा प्रवृत्ति',
    moodLabel: 'मनोदशा',
    energyLabel: 'ऊर्जा',
    monthlyTitle: 'मासिक मुख्य बातें',
    entryCount: (n: number) => `${n} प्रविष्टियाँ`,
    noEntries: 'कोई प्रविष्टि नहीं',
    topEvent: 'मुख्य घटना',
    dasha: 'दशा',
    nakshatra: 'नक्षत्र',
    lifeEventsTitle: 'जीवन घटना सारांश',
    eventCount: (n: number) => `${n} घटना${n === 1 ? '' : 'एँ'}`,
    avgSignificance: 'औसत महत्व',
    predAccTitle: 'भविष्यवाणी सटीकता',
    correct: 'सही',
    partial: 'आंशिक',
    incorrect: 'गलत',
    pending: 'लंबित',
    accuracy: 'सटीकता',
    discoveriesTitle: 'व्यक्तिगत खोजें',
    nakshatraTitle: 'नक्षत्र समानता',
    dashaTitle: 'दशा यात्रा',
    topNakshatras: 'शीर्ष नक्षत्र',
    countLabel: 'प्रविष्टियाँ',
    mood: 'मनोदशा',
    energy: 'ऊर्जा',
    errorPrefix: 'पंचांग लोड नहीं हो सका:',
    noData: 'इस वर्ष के लिए कोई डेटा नहीं।',
    months: [
      'जन', 'फर', 'मार', 'अप्र', 'मई', 'जून',
      'जुल', 'अग', 'सित', 'अक्ट', 'नव', 'दिस',
    ],
    monthsFull: [
      'जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून',
      'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर',
    ],
  },
  ta: {
    title: (y: number) => `${y} — நட்சத்திரங்களில் உங்கள் ஆண்டு`,
    subtitle: 'தனிப்பட்ட வருடாந்திர பஞ்சாங்கம்',
    back: 'டாஷ்போர்ட்',
    loading: 'உங்கள் பஞ்சாங்கம் உருவாக்கப்படுகிறது…',
    notSignedIn: 'பஞ்சாங்கம் பார்க்க உள்நுழையவும்.',
    signIn: 'உள்நுழை',
    yearLabel: 'ஆண்டு',
    insufficientTitle: 'போதுமான தரவு இல்லை',
    insufficientDesc: (current: number, required: number) =>
      `பஞ்சாங்கம் திறக்க ${required - current} மேலும் பதிவுகள் சேர்க்கவும்.`,
    progress: 'முன்னேற்றம்',
    totalEntries: 'ஜர்னல் பதிவுகள்',
    totalEvents: 'வாழ்க்கை நிகழ்வுகள்',
    totalPredictions: 'கணிப்புகள்',
    moodTrendTitle: 'மனநிலை மற்றும் ஆற்றல் போக்கு',
    moodLabel: 'மனநிலை',
    energyLabel: 'ஆற்றல்',
    monthlyTitle: 'மாதாந்திர சிறப்பம்சங்கள்',
    entryCount: (n: number) => `${n} பதிவுகள்`,
    noEntries: 'பதிவுகள் இல்லை',
    topEvent: 'முதல் நிகழ்வு',
    dasha: 'தசை',
    nakshatra: 'நட்சத்திரம்',
    lifeEventsTitle: 'வாழ்க்கை நிகழ்வு சுருக்கம்',
    eventCount: (n: number) => `${n} நிகழ்வு${n === 1 ? '' : 'கள்'}`,
    avgSignificance: 'சராசரி முக்கியத்துவம்',
    predAccTitle: 'கணிப்பு துல்லியம்',
    correct: 'சரி',
    partial: 'பகுதி',
    incorrect: 'தவறு',
    pending: 'நிலுவை',
    accuracy: 'துல்லியம்',
    discoveriesTitle: 'தனிப்பட்ட கண்டுபிடிப்புகள்',
    nakshatraTitle: 'நட்சத்திர ஈர்ப்பு',
    dashaTitle: 'தசை பயணம்',
    topNakshatras: 'சிறந்த நட்சத்திரங்கள்',
    countLabel: 'பதிவுகள்',
    mood: 'மனநிலை',
    energy: 'ஆற்றல்',
    errorPrefix: 'பஞ்சாங்கம் ஏற்ற முடியவில்லை:',
    noData: 'இந்த ஆண்டிற்கு தரவு இல்லை.',
    months: [
      'ஜன', 'பிப', 'மார்', 'ஏப்', 'மே', 'ஜூன்',
      'ஜூல்', 'ஆக', 'செப்', 'அக்', 'நவ', 'டிச',
    ],
    monthsFull: [
      'ஜனவரி', 'பிப்ரவரி', 'மார்ச்', 'ஏப்ரல்', 'மே', 'ஜூன்',
      'ஜூலை', 'ஆகஸ்ட்', 'செப்டம்பர்', 'அக்டோபர்', 'நவம்பர்', 'டிசம்பர்',
    ],
  },
  bn: {
    title: (y: number) => `${y} — তারাদের মধ্যে আপনার বছর`,
    subtitle: 'ব্যক্তিগতকৃত বার্ষিক পঞ্চাঙ্গ',
    back: 'ড্যাশবোর্ড',
    loading: 'আপনার পঞ্চাঙ্গ তৈরি হচ্ছে…',
    notSignedIn: 'পঞ্চাঙ্গ দেখতে সাইন ইন করুন।',
    signIn: 'সাইন ইন',
    yearLabel: 'বছর',
    insufficientTitle: 'এখনো যথেষ্ট ডেটা নেই',
    insufficientDesc: (current: number, required: number) =>
      `পঞ্চাঙ্গ আনলক করতে আরও ${required - current}টি জার্নাল এন্ট্রি যোগ করুন।`,
    progress: 'অগ্রগতি',
    totalEntries: 'জার্নাল এন্ট্রি',
    totalEvents: 'জীবনের ঘটনা',
    totalPredictions: 'ভবিষ্যদ্বাণী',
    moodTrendTitle: 'মেজাজ ও শক্তির প্রবণতা',
    moodLabel: 'মেজাজ',
    energyLabel: 'শক্তি',
    monthlyTitle: 'মাসিক হাইলাইট',
    entryCount: (n: number) => `${n}টি এন্ট্রি`,
    noEntries: 'কোনো এন্ট্রি নেই',
    topEvent: 'শীর্ষ ঘটনা',
    dasha: 'দশা',
    nakshatra: 'নক্ষত্র',
    lifeEventsTitle: 'জীবনের ঘটনার সারসংক্ষেপ',
    eventCount: (n: number) => `${n}টি ঘটনা`,
    avgSignificance: 'গড় গুরুত্ব',
    predAccTitle: 'ভবিষ্যদ্বাণীর নির্ভুলতা',
    correct: 'সঠিক',
    partial: 'আংশিক',
    incorrect: 'ভুল',
    pending: 'মুলতুবি',
    accuracy: 'নির্ভুলতা',
    discoveriesTitle: 'ব্যক্তিগত আবিষ্কার',
    nakshatraTitle: 'নক্ষত্র আত্মীয়তা',
    dashaTitle: 'দশা যাত্রা',
    topNakshatras: 'শীর্ষ নক্ষত্র',
    countLabel: 'এন্ট্রি',
    mood: 'মেজাজ',
    energy: 'শক্তি',
    errorPrefix: 'পঞ্চাঙ্গ লোড হয়নি:',
    noData: 'এই বছরের জন্য কোনো ডেটা নেই।',
    months: [
      'জান', 'ফেব', 'মার', 'এপ্র', 'মে', 'জুন',
      'জুল', 'আগ', 'সেপ', 'অক্ট', 'নভ', 'ডিস',
    ],
    monthsFull: [
      'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
      'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
    ],
  },
} as const;

type SupportedLocale = keyof typeof LABELS;
function getLabels(locale: string) {
  return LABELS[(locale as SupportedLocale) in LABELS ? (locale as SupportedLocale) : 'en'];
}

// ---------------------------------------------------------------------------
// Mood Trend SVG chart
// ---------------------------------------------------------------------------
function MoodTrendChart({
  data,
  moodLabel,
  energyLabel,
}: {
  data: AlmanacReport['moodTrend'];
  moodLabel: string;
  energyLabel: string;
}) {
  const W = 560;
  const H = 140;
  const PAD_X = 30;
  const PAD_Y = 16;
  const chartW = W - PAD_X * 2;
  const chartH = H - PAD_Y * 2;

  // Only months with data
  const months = data.map((d, i) => ({ ...d, index: i }));

  function xOf(i: number) {
    return PAD_X + (i / 11) * chartW;
  }
  function yOf(val: number) {
    // val: 0-5, higher = top
    return PAD_Y + chartH - ((val / 5) * chartH);
  }

  function polyline(vals: number[], fallback: number) {
    return months
      .map((m) => {
        const v = vals[m.index] ?? fallback;
        return `${xOf(m.index).toFixed(1)},${yOf(v).toFixed(1)}`;
      })
      .join(' ');
  }

  const moodPoints   = polyline(data.map((d) => d.avgMood), 0);
  const energyPoints = polyline(data.map((d) => d.avgEnergy), 0);

  // Grid lines at 1,2,3,4,5
  const gridLines = [1, 2, 3, 4, 5];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      aria-label="Mood and energy trend"
      role="img"
    >
      {/* Grid */}
      {gridLines.map((v) => (
        <line
          key={v}
          x1={PAD_X}
          y1={yOf(v)}
          x2={W - PAD_X}
          y2={yOf(v)}
          stroke="#ffffff10"
          strokeWidth="1"
        />
      ))}

      {/* Energy line (dashed) */}
      <polyline
        points={energyPoints}
        fill="none"
        stroke="#d4a853"
        strokeWidth="1.5"
        strokeDasharray="4 3"
        strokeOpacity="0.6"
      />

      {/* Mood line */}
      <polyline
        points={moodPoints}
        fill="none"
        stroke="#f0d48a"
        strokeWidth="2"
      />

      {/* Mood dots */}
      {data.map((d, i) => (
        d.entryCount > 0 ? (
          <circle
            key={i}
            cx={xOf(i)}
            cy={yOf(d.avgMood)}
            r="3"
            fill="#f0d48a"
          />
        ) : null
      ))}

      {/* Legend */}
      <line x1={PAD_X} y1={H - 4} x2={PAD_X + 14} y2={H - 4} stroke="#f0d48a" strokeWidth="2" />
      <text x={PAD_X + 18} y={H - 1} fontSize="9" fill="#8a8478">{moodLabel}</text>
      <line x1={PAD_X + 80} y1={H - 4} x2={PAD_X + 94} y2={H - 4} stroke="#d4a853" strokeWidth="1.5" strokeDasharray="4 3" strokeOpacity="0.6" />
      <text x={PAD_X + 98} y={H - 1} fontSize="9" fill="#8a8478">{energyLabel}</text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Category label prettifier
// ---------------------------------------------------------------------------
function prettifyCategory(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, ' ');
}

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function AlmanacPage() {
  const locale = useLocale() as Locale;
  const L = getLabels(locale);
  const isDevanagari = isDevanagariLocale(locale);

  const { session, initialized } = useAuthStore();

  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AlmanacReport | null>(null);
  const [insufficientData, setInsufficientData] = useState<{
    entryCount: number;
    required: number;
    message: string;
  } | null>(null);

  const availableYears = Array.from(
    { length: Math.max(1, currentYear - 2025 + 1) },
    (_, i) => 2026 + i,
  ).filter((y) => y <= currentYear);

  const fetchAlmanac = useCallback(
    async (year: number) => {
      if (!session?.access_token) return;

      setLoading(true);
      setError(null);
      setReport(null);
      setInsufficientData(null);

      try {
        const res = await fetch(`/api/almanac?year=${year}`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        const json = await res.json();

        if (!res.ok) {
          if (json.error === 'insufficient_data') {
            setInsufficientData({
              entryCount: json.entryCount ?? 0,
              required: json.required ?? 10,
              message: json.message ?? '',
            });
          } else {
            setError(json.error ?? 'Unknown error');
            console.error('[almanac] fetch error:', json);
          }
          return;
        }

        setReport(json.report);
      } catch (err) {
        console.error('[almanac] network error:', err);
        setError(err instanceof Error ? err.message : 'Network error');
      } finally {
        setLoading(false);
      }
    },
    [session?.access_token],
  );

  useEffect(() => {
    if (!initialized) return;
    if (!session) {
      setLoading(false);
      return;
    }
    fetchAlmanac(selectedYear);
  }, [initialized, session, selectedYear, fetchAlmanac]);

  const fadeUp = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
  };

  const fontClass = isDevanagari ? 'font-devanagari' : '';

  // --- Not signed in ---
  if (initialized && !session) {
    return (
      <main className={`min-h-screen bg-[#0a0e27] flex items-center justify-center ${fontClass}`}>
        <div className="text-center space-y-4 px-4">
          <Star className="w-12 h-12 text-gold-primary mx-auto" />
          <p className="text-text-secondary">{L.notSignedIn}</p>
          <Link
            href="/auth"
            className="inline-block px-6 py-2.5 rounded-xl bg-gold-primary text-[#0a0e27] font-semibold text-sm hover:bg-gold-light transition-colors"
          >
            {L.signIn}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={`min-h-screen bg-[#0a0e27] pb-16 ${fontClass}`}>
      <div className="max-w-4xl mx-auto px-4 pt-8">

        {/* Back nav */}
        <motion.div {...fadeUp} className="mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-gold-light transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {L.back}
          </Link>
        </motion.div>

        {/* Header */}
        <motion.div {...fadeUp} transition={{ delay: 0.05 }} className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gold-light leading-tight">
                {L.title(selectedYear)}
              </h1>
              <p className="text-text-secondary text-sm mt-1">{L.subtitle}</p>
            </div>

            {/* Year selector */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value, 10))}
                className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-gold-primary/20 bg-[#111633] text-text-primary text-sm focus:outline-none focus:border-gold-primary/50 cursor-pointer"
                aria-label={L.yearLabel}
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-secondary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {(!initialized || loading) && (
          <motion.div {...fadeUp} className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-gold-primary animate-spin" />
            <span className="ml-3 text-text-secondary">{L.loading}</span>
          </motion.div>
        )}

        {/* Error */}
        {!loading && error && (
          <motion.div {...fadeUp} className="py-12 text-center">
            <p className="text-red-400 text-sm">{L.errorPrefix} {error}</p>
          </motion.div>
        )}

        {/* Insufficient data */}
        {!loading && insufficientData && (
          <motion.div {...fadeUp} transition={{ delay: 0.1 }}>
            <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] p-8 text-center space-y-4">
              <Star className="w-12 h-12 text-gold-primary/50 mx-auto" />
              <h2 className="text-xl font-semibold text-text-primary">{L.insufficientTitle}</h2>
              <p className="text-text-secondary text-sm max-w-sm mx-auto">
                {L.insufficientDesc(insufficientData.entryCount, insufficientData.required)}
              </p>

              {/* Progress bar */}
              <div className="max-w-xs mx-auto mt-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                  <span>{L.progress}</span>
                  <span>{insufficientData.entryCount} / {insufficientData.required}</span>
                </div>
                <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary transition-all"
                    style={{ width: `${Math.min(100, (insufficientData.entryCount / insufficientData.required) * 100)}%` }}
                  />
                </div>
              </div>

              <Link
                href="/dashboard/journal"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-gold-primary/10 border border-gold-primary/20 text-gold-light text-sm font-medium hover:bg-gold-primary/20 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Open Journal
              </Link>
            </div>
          </motion.div>
        )}

        {/* Full almanac report */}
        {!loading && !error && report && (
          <div className="space-y-8">

            {/* 1. Summary counters */}
            <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="grid grid-cols-3 gap-4">
              {[
                { label: L.totalEntries, value: report.totalJournalEntries, icon: BookOpen },
                { label: L.totalEvents, value: report.totalLifeEvents, icon: Calendar },
                { label: L.totalPredictions, value: report.totalPredictions, icon: Target },
              ].map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="rounded-xl border border-gold-primary/10 bg-gradient-to-br from-[#2d1b69]/30 to-[#0a0e27] p-4 text-center"
                >
                  <Icon className="w-5 h-5 text-gold-primary/70 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gold-light">{value}</p>
                  <p className="text-text-secondary text-xs mt-1">{label}</p>
                </div>
              ))}
            </motion.div>

            {/* 2. Mood Trend Chart */}
            <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
              <SectionCard title={L.moodTrendTitle} icon={TrendingUp}>
                <div className="mb-3">
                  {/* Month labels */}
                  <div className="flex justify-between px-1 mb-1">
                    {L.months.map((m) => (
                      <span key={m} className="text-[9px] text-text-secondary/60 w-[8.33%] text-center">{m}</span>
                    ))}
                  </div>
                  <MoodTrendChart
                    data={report.moodTrend}
                    moodLabel={L.moodLabel}
                    energyLabel={L.energyLabel}
                  />
                </div>
              </SectionCard>
            </motion.div>

            {/* 3. Monthly Highlights */}
            <motion.div {...fadeUp} transition={{ delay: 0.2 }}>
              <SectionCard title={L.monthlyTitle} icon={Calendar}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {report.monthlyHighlights.map((m) => (
                    <div
                      key={m.month}
                      className="rounded-xl border border-gold-primary/10 bg-[#111633]/60 p-3 space-y-1.5"
                    >
                      <p className="text-gold-light text-xs font-semibold">{L.monthsFull[m.month - 1]}</p>
                      {m.entries > 0 ? (
                        <>
                          <p className="text-text-secondary text-[11px]">
                            {L.entryCount(m.entries)}
                          </p>
                          <div className="flex gap-3 text-[10px] text-text-secondary">
                            <span>😊 {m.avgMood.toFixed(1)}</span>
                            <span>⚡ {m.avgEnergy.toFixed(1)}</span>
                          </div>
                          {m.dominantDasha && (
                            <p className="text-[10px] text-gold-primary/70 truncate">
                              {L.dasha}: {m.dominantDasha}
                            </p>
                          )}
                          {m.keyNakshatra && (
                            <p className="text-[10px] text-text-secondary/70 truncate">
                              {L.nakshatra}: {m.keyNakshatra}
                            </p>
                          )}
                          {m.topEvent && (
                            <p className="text-[10px] text-text-secondary/60 truncate" title={m.topEvent}>
                              {L.topEvent}: {m.topEvent}
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="text-text-secondary/40 text-[11px]">{L.noEntries}</p>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
            </motion.div>

            {/* 4. Life Events Summary */}
            {report.lifeEventSummary.length > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.25 }}>
                <SectionCard title={L.lifeEventsTitle} icon={Calendar}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {report.lifeEventSummary.map((ev) => (
                      <div
                        key={ev.category}
                        className="flex items-center justify-between rounded-xl border border-gold-primary/10 bg-[#111633]/60 px-4 py-3"
                      >
                        <div>
                          <p className="text-text-primary text-sm font-medium">{prettifyCategory(ev.category)}</p>
                          <p className="text-text-secondary text-xs">{L.eventCount(ev.count)}</p>
                        </div>
                        {ev.avgSignificance > 0 && (
                          <div className="text-right">
                            <p className="text-gold-primary text-sm font-semibold">{ev.avgSignificance.toFixed(1)}</p>
                            <p className="text-text-secondary/60 text-[10px]">{L.avgSignificance}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* 5. Prediction Accuracy */}
            {report.predictionAccuracy.total > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.3 }}>
                <SectionCard title={L.predAccTitle} icon={Target}>
                  <PredictionAccuracyBar report={report.predictionAccuracy} L={L} />
                </SectionCard>
              </motion.div>
            )}

            {/* 6. Personal Discoveries */}
            {report.personalDiscoveries.length > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.35 }}>
                <SectionCard title={L.discoveriesTitle} icon={Lightbulb}>
                  <ul className="space-y-3">
                    {report.personalDiscoveries.map((d, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Sparkles className="w-4 h-4 text-gold-primary flex-shrink-0 mt-0.5" />
                        <p className="text-text-secondary text-sm leading-relaxed">{d}</p>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              </motion.div>
            )}

            {/* 7. Nakshatra Affinity */}
            {report.topNakshatras.length > 0 && (
              <motion.div {...fadeUp} transition={{ delay: 0.4 }}>
                <SectionCard title={L.nakshatraTitle} icon={Star}>
                  <div className="space-y-3">
                    {report.topNakshatras.slice(0, 5).map((nk) => (
                      <div key={nk.nakshatra} className="flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm font-medium truncate">{nk.nakshatra}</p>
                          <p className="text-text-secondary/60 text-xs">{nk.count} {L.countLabel}</p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary flex-shrink-0">
                          <span>{L.mood}: <span className="text-gold-light">{nk.avgMood.toFixed(1)}</span></span>
                          <span>{L.energy}: <span className="text-gold-primary">{nk.avgEnergy.toFixed(1)}</span></span>
                        </div>
                        {/* Frequency bar */}
                        <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden flex-shrink-0">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-gold-dark to-gold-primary"
                            style={{
                              width: `${Math.min(100, (nk.count / (report.topNakshatras[0]?.count || 1)) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}

            {/* 8. Dasha Journey */}
            {report.topDashaInsight && (
              <motion.div {...fadeUp} transition={{ delay: 0.45 }}>
                <SectionCard title={L.dashaTitle} icon={BookOpen}>
                  <p className="text-text-secondary leading-relaxed">{report.topDashaInsight}</p>
                </SectionCard>
              </motion.div>
            )}

          </div>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Shared section card
// ---------------------------------------------------------------------------
function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gold-primary/15 bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] p-5 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="w-5 h-5 text-gold-primary" />
        <h2 className="text-base font-semibold text-text-primary">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Prediction accuracy bar
// ---------------------------------------------------------------------------
function PredictionAccuracyBar({
  report,
  L,
}: {
  report: AlmanacReport['predictionAccuracy'];
  L: ReturnType<typeof getLabels>;
}) {
  const segments = [
    { key: 'correct',   count: report.correct,   label: L.correct,   color: '#22c55e' },
    { key: 'partial',   count: report.partial,    label: L.partial,   color: '#d4a853' },
    { key: 'incorrect', count: report.incorrect,  label: L.incorrect, color: '#ef4444' },
    { key: 'pending',   count: report.pending,    label: L.pending,   color: '#8a8478' },
  ].filter((s) => s.count > 0);

  const total = report.total;

  return (
    <div className="space-y-4">
      {/* Stacked bar */}
      {total > 0 && (
        <div className="h-5 rounded-full overflow-hidden flex">
          {segments.map((s) => (
            <div
              key={s.key}
              style={{ width: `${(s.count / total) * 100}%`, backgroundColor: s.color }}
              title={`${s.label}: ${s.count}`}
            />
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {segments.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-text-secondary">
            <span
              className="inline-block w-2.5 h-2.5 rounded-sm flex-shrink-0"
              style={{ backgroundColor: s.color }}
            />
            {s.label}: {s.count}
          </div>
        ))}
      </div>

      {/* Accuracy score */}
      {report.accuracy > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-gold-light">{report.accuracy}%</span>
          <span className="text-text-secondary text-sm">{L.accuracy}</span>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Briefcase, Heart, Activity, IndianRupee, Sparkles, ArrowLeft, ChevronRight, Calendar, TrendingUp, TrendingDown, Star } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { Link } from '@/lib/i18n/navigation';
import ShareButton from '@/components/ui/ShareButton';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont, dataLocale } from '@/lib/utils/locale-fonts';
import { trackHoroscopeViewed } from '@/lib/analytics';
import type { Locale } from '@/types/panchang';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    backToAll: 'All Signs',
    monthlyHoroscope: 'Monthly Horoscope',
    subtitle: 'Monthly overview based on actual planetary transits',
    overallScore: 'Monthly Score',
    career: 'Career',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    spirituality: 'Spirituality',
    calendarHeatmap: 'Daily Score Calendar',
    bestWeeks: 'Best Weeks',
    worstWeeks: 'Challenging Weeks',
    keyDates: 'Key Dates',
    highScoreDays: 'High Score Days',
    lowScoreDays: 'Low Score Days',
    monthlyPredictions: 'Monthly Predictions',
    otherSigns: 'Other Signs',
    loading: 'Calculating monthly horoscope...',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    weekLabel: 'Week',
    avgScore: 'Avg',
    trend: 'Trend',
    sun: 'Sun',
    mon: 'Mon',
    tue: 'Tue',
    wed: 'Wed',
    thu: 'Thu',
    fri: 'Fri',
    sat: 'Sat',
  },
  hi: {
    backToAll: 'सभी राशियाँ',
    monthlyHoroscope: 'मासिक राशिफल',
    subtitle: 'वास्तविक ग्रह गोचर पर आधारित मासिक अवलोकन',
    overallScore: 'मासिक स्कोर',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'आध्यात्म',
    calendarHeatmap: 'दैनिक स्कोर कैलेंडर',
    bestWeeks: 'सर्वश्रेष्ठ सप्ताह',
    worstWeeks: 'चुनौतीपूर्ण सप्ताह',
    keyDates: 'मुख्य तिथियाँ',
    highScoreDays: 'उच्च स्कोर दिन',
    lowScoreDays: 'निम्न स्कोर दिन',
    monthlyPredictions: 'मासिक भविष्यवाणी',
    otherSigns: 'अन्य राशियाँ',
    loading: 'मासिक राशिफल की गणना हो रही है...',
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    weekLabel: 'सप्ताह',
    avgScore: 'औसत',
    trend: 'प्रवृत्ति',
    sun: 'रवि',
    mon: 'सोम',
    tue: 'मंगल',
    wed: 'बुध',
    thu: 'गुरु',
    fri: 'शुक्र',
    sat: 'शनि',
  },
};

const AREA_ICONS = {
  career: Briefcase,
  love: Heart,
  health: Activity,
  finance: IndianRupee,
  spirituality: Sparkles,
};

const AREA_COLORS: Record<string, string> = {
  career: 'from-blue-400 to-blue-600',
  love: 'from-pink-400 to-rose-600',
  health: 'from-emerald-400 to-green-600',
  finance: 'from-amber-400 to-yellow-600',
  spirituality: 'from-purple-400 to-violet-600',
};

function scoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 5) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(score: number): string {
  if (score >= 7) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
  if (score >= 5) return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
  return 'bg-red-500/20 text-red-400 border-red-500/30';
}

function barColor(score: number): string {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 5) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreLabel(score: number, locale: string): string {
  if (score >= 8) return tl({ en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्ट' }, locale);
  if (score >= 6.5) return tl({ en: 'Good', hi: 'शुभ', sa: 'शुभ' }, locale);
  if (score >= 5) return tl({ en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित' }, locale);
  return tl({ en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'कठिनः' }, locale);
}

function fmtDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

interface DayData {
  date: number; // day of month
  score: number;
  horoscope: DailyHoroscope | null;
}

interface WeekSummary {
  weekNum: number;
  startDay: number;
  endDay: number;
  avgScore: number;
  days: DayData[];
}

export default function MonthlyHoroscopePage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const rashiSlug = params.rashi as string;

  const rashi = getRashiBySlug(rashiSlug);
  const lk = dataLocale(locale);
  const isHi = lk === 'hi';
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const L = isHi ? LABELS.hi : LABELS.en;

  const [dayData, setDayData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [monthLabel, setMonthLabel] = useState('');

  // Current month info
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun

  useEffect(() => {
    if (!rashi) return;

    const label = new Date(year, month, 1).toLocaleDateString(
      isHi ? 'hi-IN' : 'en-US',
      { month: 'long', year: 'numeric' }
    );
    setMonthLabel(label);

    // Fetch 5 representative days and interpolate the rest
    const sampleDays = [1, 8, 15, 22, daysInMonth];
    const uniqueDays = [...new Set(sampleDays)];

    setLoading(true);

    Promise.all(
      uniqueDays.map(day => {
        const d = new Date(year, month, day);
        const dateStr = fmtDate(d);
        return fetch(`/api/horoscope/daily?moonSign=${rashi.id}&date=${dateStr}`)
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Failed');
          })
          .then((data: DailyHoroscope) => ({ day, data }))
          .catch(() => ({ day, data: null as DailyHoroscope | null }));
      })
    ).then(results => {
      // Build a map of sample day -> horoscope
      const sampleMap = new Map<number, DailyHoroscope | null>();
      for (const r of results) {
        sampleMap.set(r.day, r.data);
      }

      // Interpolate scores for all days
      const allDays: DayData[] = [];
      for (let d = 1; d <= daysInMonth; d++) {
        const sample = sampleMap.get(d);
        if (sample) {
          allDays.push({ date: d, score: sample.overallScore, horoscope: sample });
        } else {
          // Find nearest samples and interpolate
          const sortedSamples = uniqueDays.sort((a, b) => a - b);
          let lower = sortedSamples[0];
          let upper = sortedSamples[sortedSamples.length - 1];
          for (const s of sortedSamples) {
            if (s <= d) lower = s;
            if (s >= d && upper === sortedSamples[sortedSamples.length - 1]) upper = s;
          }
          // Find upper properly
          for (const s of sortedSamples) {
            if (s >= d) { upper = s; break; }
          }
          const lowerScore = sampleMap.get(lower)?.overallScore ?? 5;
          const upperScore = sampleMap.get(upper)?.overallScore ?? 5;
          const range = upper - lower;
          const t = range > 0 ? (d - lower) / range : 0;
          const interpolated = Math.round((lowerScore + (upperScore - lowerScore) * t) * 10) / 10;
          allDays.push({ date: d, score: Math.max(1, Math.min(10, interpolated)), horoscope: null });
        }
      }
      setDayData(allDays);
      trackHoroscopeViewed({ rashi: rashiSlug, period: 'monthly', personalized: false });
    })
    .finally(() => setLoading(false));
  }, [rashi, rashiSlug, year, month, daysInMonth, isHi]);

  // Compute weekly summaries
  const weekSummaries = useMemo((): WeekSummary[] => {
    if (dayData.length === 0) return [];
    const weeks: WeekSummary[] = [];
    let weekNum = 1;
    let weekStart = 1;

    // Group by calendar weeks
    for (let d = 1; d <= daysInMonth; d++) {
      const dayOfWeek = new Date(year, month, d).getDay();
      if (dayOfWeek === 0 && d > 1) {
        // End of previous week
        const weekDays = dayData.filter(dd => dd.date >= weekStart && dd.date < d);
        if (weekDays.length > 0) {
          const avg = Math.round(weekDays.reduce((s, dd) => s + dd.score, 0) / weekDays.length * 10) / 10;
          weeks.push({ weekNum, startDay: weekStart, endDay: d - 1, avgScore: avg, days: weekDays });
          weekNum++;
        }
        weekStart = d;
      }
    }
    // Last week
    const lastWeekDays = dayData.filter(dd => dd.date >= weekStart);
    if (lastWeekDays.length > 0) {
      const avg = Math.round(lastWeekDays.reduce((s, dd) => s + dd.score, 0) / lastWeekDays.length * 10) / 10;
      weeks.push({ weekNum, startDay: weekStart, endDay: daysInMonth, avgScore: avg, days: lastWeekDays });
    }
    return weeks;
  }, [dayData, year, month, daysInMonth]);

  // Monthly aggregations from sample days
  const monthlyAreas = useMemo(() => {
    const samples = dayData.filter(d => d.horoscope !== null).map(d => d.horoscope!);
    if (samples.length === 0) return null;

    const areas = ['career', 'love', 'health', 'finance', 'spirituality'] as const;
    const result: Record<string, { score: number; text: string }> = {};

    for (const area of areas) {
      const scores = samples.map(s => s.areas[area].score);
      const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length * 10) / 10;
      // Use the text from the sample closest to the average
      const closestSample = samples.reduce((prev, curr) => {
        return Math.abs(curr.areas[area].score - avgScore) < Math.abs(prev.areas[area].score - avgScore) ? curr : prev;
      });
      result[area] = { score: avgScore, text: closestSample.areas[area].text[lk] ?? closestSample.areas[area].text.en };
    }
    return result;
  }, [dayData, lk]);

  const overallMonthlyScore = useMemo(() => {
    if (dayData.length === 0) return 0;
    return Math.round(dayData.reduce((s, d) => s + d.score, 0) / dayData.length * 10) / 10;
  }, [dayData]);

  // Key dates: highest and lowest scoring days
  const keyDates = useMemo(() => {
    if (dayData.length === 0) return { high: [] as DayData[], low: [] as DayData[] };
    const sorted = [...dayData].sort((a, b) => b.score - a.score);
    return {
      high: sorted.slice(0, 3),
      low: sorted.slice(-3).reverse(),
    };
  }, [dayData]);

  // Best & worst weeks
  const bestWeek = useMemo(() => weekSummaries.length > 0 ? weekSummaries.reduce((a, b) => a.avgScore > b.avgScore ? a : b) : null, [weekSummaries]);
  const worstWeek = useMemo(() => weekSummaries.length > 0 ? weekSummaries.reduce((a, b) => a.avgScore < b.avgScore ? a : b) : null, [weekSummaries]);

  if (!rashi) {
    return (
      <div className="min-h-screen bg-bg-primary text-text-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-secondary text-lg mb-4">Sign not found</p>
          <Link href="/horoscope" className="text-gold-primary hover:text-gold-light transition-colors">
            {L.backToAll}
          </Link>
        </div>
      </div>
    );
  }

  const vedicName = tl(rashi.name, locale);
  const westernName = rashi.name.en;
  const otherRashis = RASHIS.filter(r => r.id !== rashi.id);
  const DAY_HEADERS = [L.sun, L.mon, L.tue, L.wed, L.thu, L.fri, L.sat];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary">
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">

          {/* Back link */}
          <Link href="/horoscope"
            className="inline-flex items-center gap-1.5 text-gold-primary hover:text-gold-light transition-colors text-sm mb-8">
            <ArrowLeft className="w-4 h-4" />
            <span style={bodyFont}>{L.backToAll}</span>
          </Link>

          {/* Navigation tabs: Daily | Weekly | Monthly */}
          <div className="flex items-center gap-1 mb-6 bg-white/5 rounded-xl p-1 w-fit">
            <Link href={`/horoscope/${rashiSlug}` as '/horoscope'}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              style={bodyFont}>
              {L.daily}
            </Link>
            <Link href={`/horoscope/${rashiSlug}/weekly` as '/horoscope'}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
              style={bodyFont}>
              {L.weekly}
            </Link>
            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gold-primary/15 text-gold-light border border-gold-primary/20" style={bodyFont}>
              {L.monthly}
            </div>
          </div>

          {/* Hero header */}
          <div className="bg-gradient-to-br from-[#2d1b69]/50 via-[#1a1040]/60 to-[#0a0e27] border border-gold-primary/20 rounded-3xl p-8 md:p-10 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 md:w-28 md:h-28 flex items-center justify-center rounded-full bg-gold-primary/10 border border-gold-primary/20">
                  <RashiIconById id={rashi.id} size={64} />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gold-gradient mb-2" style={headingFont}>
                  {vedicName} {westernName !== vedicName && <span className="text-gold-dark text-2xl md:text-3xl">({westernName})</span>}
                </h1>
                <p className="text-gold-light text-lg mb-1" style={headingFont}>
                  {L.monthlyHoroscope}
                </p>
                <p className="text-text-secondary text-sm" style={bodyFont}>{L.subtitle}</p>
                {monthLabel && (
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-4 h-4 text-gold-dark" />
                    <p className="text-gold-dark text-sm font-medium">{monthLabel}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading state */}
          {loading && (
            <div className="text-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-gold-primary mx-auto mb-3" />
              <p className="text-text-secondary text-sm" style={bodyFont}>{L.loading}</p>
            </div>
          )}

          {/* Results */}
          {!loading && dayData.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-6">

              {/* Overall monthly score */}
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{L.overallScore}</p>
                    <p className={`text-4xl font-bold ${scoreColor(overallMonthlyScore)}`}>
                      {overallMonthlyScore}<span className="text-lg text-text-secondary">/10</span>
                    </p>
                    <p className={`text-sm font-medium mt-1 ${scoreColor(overallMonthlyScore)}`}>
                      {scoreLabel(overallMonthlyScore, locale)}
                    </p>
                  </div>
                  {/* Circular gauge */}
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                        className="text-white/5" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none"
                        strokeWidth="6" strokeLinecap="round"
                        className={scoreColor(overallMonthlyScore)}
                        stroke="currentColor"
                        strokeDasharray={`${(overallMonthlyScore / 10) * 213.6} 213.6`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${scoreColor(overallMonthlyScore)}`}>
                        {overallMonthlyScore}
                      </span>
                      <span className="text-[10px] text-text-secondary">/10</span>
                    </div>
                  </div>
                </div>

                {/* Trend description */}
                <div className="bg-gold-primary/5 border border-gold-primary/10 rounded-xl p-4">
                  <p className="text-xs text-gold-dark uppercase tracking-wider mb-1 font-semibold">{L.trend}</p>
                  <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                    {overallMonthlyScore >= 7
                      ? tl({ en: `A favorable month ahead for ${westernName}. Planetary alignments support growth and positive outcomes across most areas of life.`, hi: `${tl(rashi.name, 'hi')} राशि के लिए अनुकूल माह। ग्रहों की स्थिति जीवन के अधिकांश क्षेत्रों में वृद्धि और सकारात्मक परिणाम देती है।`, sa: `${tl(rashi.name, 'hi')} राशि के लिए अनुकूल माह।` }, locale)
                      : overallMonthlyScore >= 5
                      ? tl({ en: `A mixed month for ${westernName}. Some weeks bring opportunities while others require patience. Balance and adaptability are key.`, hi: `${tl(rashi.name, 'hi')} राशि के लिए मिश्रित माह। कुछ सप्ताह अवसर लाते हैं जबकि अन्य में धैर्य आवश्यक है। संतुलन और अनुकूलनशीलता महत्वपूर्ण है।`, sa: `${tl(rashi.name, 'hi')} राशि के लिए मिश्रित माह।` }, locale)
                      : tl({ en: `A challenging month for ${westernName}. Focus on self-care and avoid major decisions during low-energy weeks. Better times follow.`, hi: `${tl(rashi.name, 'hi')} राशि के लिए चुनौतीपूर्ण माह। कम ऊर्जा वाले सप्ताहों में आत्म-देखभाल पर ध्यान दें और बड़े निर्णय टालें।`, sa: `${tl(rashi.name, 'hi')} राशि के लिए चुनौतीपूर्ण माह।` }, locale)
                    }
                  </p>
                </div>
              </div>

              {/* Calendar Heatmap */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-4 flex items-center gap-2" style={headingFont}>
                  <Calendar className="w-5 h-5 text-gold-primary" />
                  {L.calendarHeatmap}
                </h2>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {DAY_HEADERS.map(day => (
                    <div key={day} className="text-center text-[10px] text-text-secondary uppercase tracking-wider font-medium py-1">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells for offset */}
                  {Array.from({ length: firstDayOfWeek }, (_, i) => (
                    <div key={`empty-${i}`} className="w-full aspect-square" />
                  ))}
                  {/* Day cells */}
                  {dayData.map(day => (
                    <div
                      key={day.date}
                      className={`w-full aspect-square rounded-lg flex flex-col items-center justify-center text-xs border ${scoreBg(day.score)} transition-all hover:scale-105 cursor-default`}
                      title={`${monthLabel} ${day.date}: ${day.score}/10`}
                    >
                      <span className="font-bold text-xs leading-none">{day.date}</span>
                      <span className="text-[9px] opacity-70 leading-none mt-0.5">{day.score}</span>
                    </div>
                  ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-center gap-4 mt-4 text-[10px] text-text-secondary">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-emerald-500/20 border border-emerald-500/30" />
                    <span>7+</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-amber-500/20 border border-amber-500/30" />
                    <span>5-7</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
                    <span>&lt;5</span>
                  </div>
                </div>
              </div>

              {/* Best & Worst Weeks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bestWeek && (
                  <div className="bg-gradient-to-br from-emerald-500/10 via-[#1a1040]/40 to-[#0a0e27] border border-emerald-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-5 h-5 text-emerald-400" />
                      <h3 className="text-emerald-400 text-sm font-bold uppercase tracking-wider" style={headingFont}>{L.bestWeeks}</h3>
                    </div>
                    <p className="text-text-primary text-sm" style={bodyFont}>
                      {L.weekLabel} {bestWeek.weekNum}: {monthLabel.split(' ')[0]} {bestWeek.startDay}-{bestWeek.endDay}
                    </p>
                    <p className="text-emerald-400 text-2xl font-bold mt-1">
                      {bestWeek.avgScore}<span className="text-sm text-text-secondary">/10 {L.avgScore}</span>
                    </p>
                  </div>
                )}
                {worstWeek && (
                  <div className="bg-gradient-to-br from-red-500/10 via-[#1a1040]/40 to-[#0a0e27] border border-red-500/20 rounded-2xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingDown className="w-5 h-5 text-red-400" />
                      <h3 className="text-red-400 text-sm font-bold uppercase tracking-wider" style={headingFont}>{L.worstWeeks}</h3>
                    </div>
                    <p className="text-text-primary text-sm" style={bodyFont}>
                      {L.weekLabel} {worstWeek.weekNum}: {monthLabel.split(' ')[0]} {worstWeek.startDay}-{worstWeek.endDay}
                    </p>
                    <p className="text-red-400 text-2xl font-bold mt-1">
                      {worstWeek.avgScore}<span className="text-sm text-text-secondary">/10 {L.avgScore}</span>
                    </p>
                  </div>
                )}
              </div>

              {/* Key Dates */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-4 flex items-center gap-2" style={headingFont}>
                  <Star className="w-5 h-5 text-gold-primary" />
                  {L.keyDates}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* High score days */}
                  <div>
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">{L.highScoreDays}</p>
                    <div className="space-y-2">
                      {keyDates.high.map(d => (
                        <div key={d.date} className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
                          <span className="text-text-primary text-sm" style={bodyFont}>
                            {monthLabel.split(' ')[0]} {d.date}
                          </span>
                          <span className="text-emerald-400 font-bold text-sm">{d.score}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Low score days */}
                  <div>
                    <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">{L.lowScoreDays}</p>
                    <div className="space-y-2">
                      {keyDates.low.map(d => (
                        <div key={d.date} className="flex items-center justify-between bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                          <span className="text-text-primary text-sm" style={bodyFont}>
                            {monthLabel.split(' ')[0]} {d.date}
                          </span>
                          <span className="text-red-400 font-bold text-sm">{d.score}/10</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Monthly Predictions per domain */}
              {monthlyAreas && (
                <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-2xl p-6">
                  <h2 className="text-gold-light text-lg font-bold mb-4" style={headingFont}>
                    {L.monthlyPredictions}
                  </h2>
                  <div className="space-y-4">
                    {(['career', 'love', 'health', 'finance', 'spirituality'] as const).map(area => {
                      const Icon = AREA_ICONS[area];
                      const areaData = monthlyAreas[area];
                      if (!areaData) return null;
                      return (
                        <div key={area}
                          className="bg-gradient-to-br from-[#2d1b69]/20 via-[#1a1040]/30 to-[#0a0e27] border border-gold-primary/8 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${AREA_COLORS[area]} bg-opacity-20`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-text-primary text-sm font-semibold flex-1" style={bodyFont}>
                              {L[area]}
                            </span>
                            <span className={`text-sm font-bold ${scoreColor(areaData.score)}`}>
                              {areaData.score}/10
                            </span>
                          </div>
                          {/* Score bar */}
                          <div className="w-full h-1.5 bg-white/5 rounded-full mb-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${areaData.score * 10}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut' as const }}
                              className={`h-full rounded-full ${barColor(areaData.score)}`}
                            />
                          </div>
                          <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                            {areaData.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="flex justify-center">
                <ShareButton
                  title={`${vedicName} (${westernName}) — ${L.monthlyHoroscope}`}
                  text={`${westernName} Monthly Horoscope — Score: ${overallMonthlyScore}/10 | dekhopanchang.com`}
                  url={`https://dekhopanchang.com/${locale}/horoscope/${rashiSlug}/monthly`}
                  locale={locale}
                />
              </div>
            </motion.div>
          )}

          {/* Other signs grid */}
          <div className="mt-12">
            <h2 className="text-gold-light text-xl font-bold mb-6 text-center" style={headingFont}>
              {L.otherSigns}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {otherRashis.map((r) => (
                <Link key={r.id} href={`/horoscope/${r.slug}/monthly` as '/horoscope'}
                  className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 hover:border-gold-primary/30 rounded-xl p-3 text-center transition-all group">
                  <div className="flex justify-center mb-2">
                    <RashiIconById id={r.id} size={28} />
                  </div>
                  <div className="text-gold-light text-xs font-bold group-hover:text-gold-primary transition-colors" style={headingFont}>
                    {tl(r.name, locale)}
                  </div>
                  <div className="text-text-secondary text-[10px] mt-0.5">{r.name.en}</div>
                  <ChevronRight className="w-3 h-3 text-gold-dark mx-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

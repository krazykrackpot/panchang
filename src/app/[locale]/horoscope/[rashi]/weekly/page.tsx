'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Loader2, Briefcase, Heart, Activity, IndianRupee, Sparkles,
  ArrowLeft, ChevronRight, Star, TrendingUp, TrendingDown, Calendar,
} from 'lucide-react';
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
    weeklyHoroscope: 'Weekly Horoscope',
    subtitle: 'Based on actual planetary transits — not generic predictions',
    weekOverview: 'Week Overview',
    overallScore: 'Average Score',
    bestDay: 'Best Day',
    worstDay: 'Most Challenging',
    dayByDay: 'Day-by-Day Breakdown',
    weeklyDomains: 'Weekly Domain Highlights',
    luckyDays: 'Lucky Days',
    luckyDaysDesc: 'Days scoring above 7 — optimal for important decisions',
    career: 'Career',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    spirituality: 'Spirituality',
    otherSigns: 'Other Signs',
    loading: 'Calculating your weekly horoscope...',
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    noLuckyDays: 'No standout lucky days this week — focus on steady progress.',
    ctaTitle: 'Get personalized horoscope',
    ctaDesc: 'Generate your Kundali to unlock predictions tailored to your exact birth chart.',
    ctaButton: 'Generate Kundali',
    keyDates: 'Key Dates This Week',
    challengingDays: 'Challenging Days',
    strongDays: 'Strong Days',
    dailyLink: 'See Today\'s Horoscope',
    transitOverview: 'Transit Overview',
  },
  hi: {
    backToAll: 'सभी राशियाँ',
    weeklyHoroscope: 'साप्ताहिक राशिफल',
    subtitle: 'वास्तविक ग्रह गोचर पर आधारित — सामान्य राशिफल नहीं',
    weekOverview: 'सप्ताह का अवलोकन',
    overallScore: 'औसत स्कोर',
    bestDay: 'सर्वोत्तम दिन',
    worstDay: 'सबसे चुनौतीपूर्ण',
    dayByDay: 'दैनिक विवरण',
    weeklyDomains: 'साप्ताहिक क्षेत्र विश्लेषण',
    luckyDays: 'शुभ दिन',
    luckyDaysDesc: '7 से अधिक स्कोर वाले दिन — महत्वपूर्ण निर्णयों के लिए उत्तम',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'आध्यात्म',
    otherSigns: 'अन्य राशियाँ',
    loading: 'आपका साप्ताहिक राशिफल गणना हो रहा है...',
    daily: 'दैनिक',
    weekly: 'साप्ताहिक',
    monthly: 'मासिक',
    noLuckyDays: 'इस सप्ताह कोई विशेष शुभ दिन नहीं — स्थिर प्रगति पर ध्यान दें।',
    ctaTitle: 'व्यक्तिगत राशिफल प्राप्त करें',
    ctaDesc: 'अपनी सटीक जन्म कुण्डली के अनुरूप भविष्यवाणी पाने के लिए कुण्डली बनाएँ।',
    ctaButton: 'कुण्डली बनाएँ',
    keyDates: 'इस सप्ताह की प्रमुख तिथियाँ',
    challengingDays: 'चुनौतीपूर्ण दिन',
    strongDays: 'प्रबल दिन',
    dailyLink: 'आज का राशिफल देखें',
    transitOverview: 'गोचर अवलोकन',
  },
};

const AREA_KEYS = ['career', 'love', 'health', 'finance', 'spirituality'] as const;
type AreaKey = typeof AREA_KEYS[number];

const AREA_ICONS: Record<AreaKey, typeof Briefcase> = {
  career: Briefcase,
  love: Heart,
  health: Activity,
  finance: IndianRupee,
  spirituality: Sparkles,
};

const AREA_COLORS: Record<AreaKey, string> = {
  career: 'from-blue-400 to-blue-600',
  love: 'from-pink-400 to-rose-600',
  health: 'from-emerald-400 to-green-600',
  finance: 'from-amber-400 to-yellow-600',
  spirituality: 'from-purple-400 to-violet-600',
};

const DAY_NAMES_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_NAMES_HI = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];
const DAY_ABBR_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_ABBR_HI = ['रवि', 'सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि'];

function getOrdinalSuffix(n: number): string {
  if (n >= 11 && n <= 13) return 'th';
  const lastDigit = n % 10;
  if (lastDigit === 1) return 'st';
  if (lastDigit === 2) return 'nd';
  if (lastDigit === 3) return 'rd';
  return 'th';
}

function scoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

function barColor(score: number): string {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

function barBgColor(score: number): string {
  if (score >= 7) return 'bg-emerald-500/20';
  if (score >= 4) return 'bg-amber-500/20';
  return 'bg-red-500/20';
}

function scoreLabel(score: number, locale: string): string {
  if (score >= 8) return tl({ en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्ट' }, locale);
  if (score >= 6.5) return tl({ en: 'Good', hi: 'शुभ', sa: 'शुभ' }, locale);
  if (score >= 4) return tl({ en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित' }, locale);
  return tl({ en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'कठिनः' }, locale);
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getDayName(dateStr: string, isHi: boolean): string {
  const d = new Date(dateStr + 'T12:00:00');
  return isHi ? DAY_NAMES_HI[d.getDay()] : DAY_NAMES_EN[d.getDay()];
}

function getDayAbbr(dateStr: string, isHi: boolean): string {
  const d = new Date(dateStr + 'T12:00:00');
  return isHi ? DAY_ABBR_HI[d.getDay()] : DAY_ABBR_EN[d.getDay()];
}

function getWeekDates(): string[] {
  const dates: string[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    dates.push(
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    );
  }
  return dates;
}

function getWeekRangeLabel(dates: string[]): string {
  if (dates.length === 0) return '';
  const first = new Date(dates[0] + 'T12:00:00');
  const last = new Date(dates[dates.length - 1] + 'T12:00:00');
  const fmt = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${fmt(first)} - ${fmt(last)}, ${first.getFullYear()}`;
}

// ---------------------------------------------------------------------------
// Aggregation
// ---------------------------------------------------------------------------
interface WeeklyAggregation {
  avgScore: number;
  bestDay: { date: string; score: number };
  worstDay: { date: string; score: number };
  domainAvgs: Record<AreaKey, number>;
  luckyDays: { date: string; score: number }[];
}

function aggregate(horoscopes: DailyHoroscope[]): WeeklyAggregation {
  const scores = horoscopes.map(h => h.overallScore);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;

  let bestIdx = 0;
  let worstIdx = 0;
  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > scores[bestIdx]) bestIdx = i;
    if (scores[i] < scores[worstIdx]) worstIdx = i;
  }

  const domainAvgs = {} as Record<AreaKey, number>;
  for (const area of AREA_KEYS) {
    const areaScores = horoscopes.map(h => h.areas[area].score);
    domainAvgs[area] = Math.round((areaScores.reduce((a, b) => a + b, 0) / areaScores.length) * 10) / 10;
  }

  const luckyDays = horoscopes
    .filter(h => h.overallScore > 7)
    .map(h => ({ date: h.date, score: h.overallScore }));

  return {
    avgScore,
    bestDay: { date: horoscopes[bestIdx].date, score: scores[bestIdx] },
    worstDay: { date: horoscopes[worstIdx].date, score: scores[worstIdx] },
    domainAvgs,
    luckyDays,
  };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function WeeklyHoroscopePage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const rashiSlug = params.rashi as string;

  const rashi = getRashiBySlug(rashiSlug);
  const lk = dataLocale(locale);
  const isHi = lk === 'hi';
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const L = isHi ? LABELS.hi : LABELS.en;

  const [horoscopes, setHoroscopes] = useState<DailyHoroscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [weekDates, setWeekDates] = useState<string[]>([]);

  const fetchWeek = useCallback(async (id: number, slug: string) => {
    const dates = getWeekDates();
    setWeekDates(dates);
    setLoading(true);

    try {
      const results = await Promise.all(
        dates.map(date =>
          fetch(`/api/horoscope/daily?moonSign=${id}&date=${date}`)
            .then(res => {
              if (!res.ok) throw new Error('Failed');
              return res.json() as Promise<DailyHoroscope>;
            })
        )
      );
      setHoroscopes(results);
      trackHoroscopeViewed({ rashi: slug, period: 'weekly', personalized: false });
    } catch (err) {
      console.error('Failed to fetch weekly horoscopes:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!rashi) return;
    fetchWeek(rashi.id, rashiSlug);
  }, [rashi, rashiSlug, fetchWeek]);

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
  const weekLabel = getWeekRangeLabel(weekDates);
  const agg = horoscopes.length === 7 ? aggregate(horoscopes) : null;

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
          <div className="flex items-center gap-1 mb-8 bg-white/5 rounded-xl p-1 w-fit">
            <Link
              href={`/horoscope/${rashiSlug}` as '/horoscope'}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              style={bodyFont}
            >
              {L.daily}
            </Link>
            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gold-primary/15 text-gold-light border border-gold-primary/20" style={bodyFont}>
              {L.weekly}
            </div>
            <span className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary/40 cursor-not-allowed" style={bodyFont}>
              {L.monthly}
            </span>
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
                <p className="text-gold-light text-lg mb-1" style={headingFont}>{L.weeklyHoroscope}</p>
                <p className="text-text-secondary text-sm" style={bodyFont}>{L.subtitle}</p>
                {weekLabel && (
                  <div className="flex items-center gap-2 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-gold-dark" />
                    <p className="text-gold-dark text-xs">{weekLabel}</p>
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

          {/* Weekly content */}
          {agg && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >

              {/* Week overview card */}
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-5" style={headingFont}>{L.weekOverview}</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Average score gauge */}
                  <div className="flex flex-col items-center">
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">{L.overallScore}</p>
                    <div className="relative w-28 h-28">
                      <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                        <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                          className="text-white/5" strokeWidth="6" />
                        <circle cx="40" cy="40" r="34" fill="none"
                          strokeWidth="6" strokeLinecap="round"
                          className={scoreColor(agg.avgScore)}
                          stroke="currentColor"
                          strokeDasharray={`${(agg.avgScore / 10) * 213.6} 213.6`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${scoreColor(agg.avgScore)}`}>
                          {agg.avgScore}
                        </span>
                        <span className="text-[10px] text-text-secondary">/10</span>
                      </div>
                    </div>
                    <p className={`text-sm font-medium mt-2 ${scoreColor(agg.avgScore)}`}>
                      {scoreLabel(agg.avgScore, locale)}
                    </p>
                  </div>

                  {/* Best day */}
                  <div className="bg-emerald-500/8 border border-emerald-500/15 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{L.bestDay}</p>
                    <p className="text-emerald-400 text-xl font-bold">{getDayName(agg.bestDay.date, isHi)}</p>
                    <p className="text-text-secondary text-xs mt-1">{formatDate(agg.bestDay.date)}</p>
                    <p className="text-emerald-400 text-sm font-semibold mt-1">{agg.bestDay.score}/10</p>
                  </div>

                  {/* Worst day */}
                  <div className="bg-red-500/8 border border-red-500/15 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                    <TrendingDown className="w-5 h-5 text-red-400 mb-2" />
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{L.worstDay}</p>
                    <p className="text-red-400 text-xl font-bold">{getDayName(agg.worstDay.date, isHi)}</p>
                    <p className="text-text-secondary text-xs mt-1">{formatDate(agg.worstDay.date)}</p>
                    <p className="text-red-400 text-sm font-semibold mt-1">{agg.worstDay.score}/10</p>
                  </div>
                </div>
              </div>

              {/* Day-by-day breakdown */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-5" style={headingFont}>{L.dayByDay}</h2>
                <div className="space-y-3">
                  {horoscopes.map((h, idx) => (
                    <motion.div
                      key={h.date}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05, ease: 'easeOut' as const }}
                      className={`flex items-center gap-4 p-3 rounded-xl transition-all ${
                        h.date === agg.bestDay.date ? 'bg-emerald-500/8 border border-emerald-500/15' :
                        h.date === agg.worstDay.date ? 'bg-red-500/8 border border-red-500/15' :
                        'bg-white/3 border border-white/5 hover:bg-white/5'
                      }`}
                    >
                      {/* Day abbr */}
                      <div className="w-12 text-center flex-shrink-0">
                        <p className="text-gold-light text-sm font-bold" style={bodyFont}>
                          {getDayAbbr(h.date, isHi)}
                        </p>
                        <p className="text-text-secondary text-[10px]">{formatDate(h.date)}</p>
                      </div>

                      {/* Score + bar */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${h.overallScore * 10}%` }}
                              transition={{ duration: 0.6, delay: idx * 0.05, ease: 'easeOut' as const }}
                              className={`h-full rounded-full ${barColor(h.overallScore)}`}
                            />
                          </div>
                          <span className={`text-sm font-bold min-w-[32px] text-right ${scoreColor(h.overallScore)}`}>
                            {h.overallScore}
                          </span>
                        </div>
                        <p className="text-text-secondary text-xs truncate" style={bodyFont}>
                          {h.insight[lk]}
                        </p>
                      </div>

                      {/* Best/worst badge */}
                      {h.date === agg.bestDay.date && (
                        <Star className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      )}
                      {h.date === agg.worstDay.date && (
                        <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Weekly domain highlights */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-5" style={headingFont}>{L.weeklyDomains}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {AREA_KEYS.map((area) => {
                    const Icon = AREA_ICONS[area];
                    const avg = agg.domainAvgs[area];
                    return (
                      <div key={area} className="bg-white/3 border border-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${AREA_COLORS[area]} bg-opacity-20`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-text-primary text-sm font-semibold flex-1" style={bodyFont}>
                            {L[area]}
                          </span>
                          <span className={`text-sm font-bold ${scoreColor(avg)}`}>
                            {avg}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${avg * 10}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' as const }}
                            className={`h-full rounded-full ${barColor(avg)}`}
                          />
                        </div>
                        <p className={`text-xs mt-2 ${scoreColor(avg)}`}>
                          {scoreLabel(avg, locale)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lucky days */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-1" style={headingFont}>{L.luckyDays}</h2>
                <p className="text-text-secondary text-xs mb-5" style={bodyFont}>{L.luckyDaysDesc}</p>

                {agg.luckyDays.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {agg.luckyDays.map(day => (
                      <div key={day.date}
                        className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 text-center">
                        <p className="text-emerald-400 font-bold text-sm" style={bodyFont}>
                          {getDayName(day.date, isHi)}
                        </p>
                        <p className="text-text-secondary text-xs">{formatDate(day.date)}</p>
                        <p className="text-emerald-400 text-lg font-bold mt-1">{day.score}/10</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-text-secondary text-sm italic" style={bodyFont}>{L.noLuckyDays}</p>
                )}
              </div>

              {/* Key Dates — strong and challenging days with context */}
              <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
                <h2 className="text-gold-light text-lg font-bold mb-4" style={headingFont}>{L.keyDates}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Strong days (score >= 6.5) */}
                  <div>
                    <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">{L.strongDays}</p>
                    <div className="space-y-2">
                      {horoscopes.filter(h => h.overallScore >= 6.5).length > 0 ? (
                        horoscopes.filter(h => h.overallScore >= 6.5).map(h => (
                          <div key={h.date} className="flex items-center gap-2 bg-emerald-500/8 border border-emerald-500/15 rounded-lg px-3 py-2">
                            <TrendingUp className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-gold-light text-xs font-semibold" style={bodyFont}>
                                {getDayName(h.date, isHi)} <span className="text-text-secondary">({formatDate(h.date)})</span>
                              </p>
                              <p className="text-text-secondary text-[10px] truncate" style={bodyFont}>{h.insight[lk]}</p>
                            </div>
                            <span className="text-emerald-400 text-xs font-bold">{h.overallScore}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-secondary text-xs italic" style={bodyFont}>
                          {isHi ? 'कोई विशेष प्रबल दिन नहीं' : 'No standout strong days'}
                        </p>
                      )}
                    </div>
                  </div>
                  {/* Challenging days (score < 4.5) */}
                  <div>
                    <p className="text-red-400 text-xs font-semibold uppercase tracking-wider mb-2">{L.challengingDays}</p>
                    <div className="space-y-2">
                      {horoscopes.filter(h => h.overallScore < 4.5).length > 0 ? (
                        horoscopes.filter(h => h.overallScore < 4.5).map(h => (
                          <div key={h.date} className="flex items-center gap-2 bg-red-500/8 border border-red-500/15 rounded-lg px-3 py-2">
                            <TrendingDown className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-gold-light text-xs font-semibold" style={bodyFont}>
                                {getDayName(h.date, isHi)} <span className="text-text-secondary">({formatDate(h.date)})</span>
                              </p>
                              <p className="text-text-secondary text-[10px] truncate" style={bodyFont}>{h.insight[lk]}</p>
                            </div>
                            <span className="text-red-400 text-xs font-bold">{h.overallScore}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-text-secondary text-xs italic" style={bodyFont}>
                          {isHi ? 'कोई चुनौतीपूर्ण दिन नहीं' : 'No especially challenging days'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transit overview for the week */}
              {horoscopes[0]?.transitSummary && (
                <div className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6">
                  <h2 className="text-gold-light text-lg font-bold mb-3" style={headingFont}>{L.transitOverview}</h2>
                  <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                    {isHi
                      ? `बृहस्पति ${horoscopes[0].transitSummary.jupiterSignName.hi || horoscopes[0].transitSummary.jupiterSignName.en} में आपके ${horoscopes[0].transitSummary.jupiterHouse}वें भाव में गोचर कर रहा है। शनि ${horoscopes[0].transitSummary.saturnSignName.hi || horoscopes[0].transitSummary.saturnSignName.en} में ${horoscopes[0].transitSummary.saturnHouse}वें भाव में स्थित है।`
                      : `Jupiter transits through ${horoscopes[0].transitSummary.jupiterSignName.en} in your ${horoscopes[0].transitSummary.jupiterHouse}${getOrdinalSuffix(horoscopes[0].transitSummary.jupiterHouse)} house. Saturn is in ${horoscopes[0].transitSummary.saturnSignName.en} in your ${horoscopes[0].transitSummary.saturnHouse}${getOrdinalSuffix(horoscopes[0].transitSummary.saturnHouse)} house.`
                    }
                  </p>
                </div>
              )}

              {/* Cross-links */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Link href={`/horoscope/${rashiSlug}` as '/horoscope'}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-gold-primary/15 hover:border-gold-primary/30 text-gold-light text-sm transition-all" style={bodyFont}>
                  <Calendar className="w-4 h-4" />
                  {L.dailyLink}
                </Link>
                <Link href="/kundali"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-gold-primary/15 hover:border-gold-primary/30 text-gold-light text-sm transition-all" style={bodyFont}>
                  <Star className="w-4 h-4" />
                  {L.ctaButton}
                </Link>
              </div>

              {/* Share */}
              <div className="flex justify-center">
                <ShareButton
                  title={`${vedicName} (${westernName}) — ${L.weeklyHoroscope}`}
                  text={`${westernName} Weekly Horoscope — Avg Score: ${agg.avgScore}/10 | dekhopanchang.com`}
                  url={`https://dekhopanchang.com/${locale}/horoscope/${rashiSlug}/weekly`}
                  locale={locale}
                />
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-gold-primary/10 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-2xl p-6 text-center">
                <h3 className="text-gold-light text-lg font-bold mb-2" style={headingFont}>{L.ctaTitle}</h3>
                <p className="text-text-secondary text-sm mb-4" style={bodyFont}>{L.ctaDesc}</p>
                <Link href="/kundali"
                  className="inline-block px-6 py-2.5 bg-gradient-to-r from-gold-primary to-gold-dark text-bg-primary font-semibold rounded-xl hover:brightness-110 transition-all">
                  {L.ctaButton}
                </Link>
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
                <Link key={r.id} href={`/horoscope/${r.slug}/weekly` as '/horoscope'}
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

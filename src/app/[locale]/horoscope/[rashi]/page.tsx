'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, Briefcase, Heart, Activity, IndianRupee, Sparkles, ArrowLeft, ChevronRight } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { RASHIS } from '@/lib/constants/rashis';
import { getRashiBySlug } from '@/lib/constants/rashi-slugs';
import { Link } from '@/lib/i18n/navigation';
import ShareButton from '@/components/ui/ShareButton';
import { tl } from '@/lib/utils/trilingual';
import { isDevanagariLocale, getHeadingFont, getBodyFont, dataLocale } from '@/lib/utils/locale-fonts';
import type { Locale } from '@/types/panchang';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';

// ---------------------------------------------------------------------------
// Labels
// ---------------------------------------------------------------------------
const LABELS = {
  en: {
    backToAll: 'All Signs',
    horoscopeToday: 'Horoscope Today',
    subtitle: 'Based on actual planetary transits — not generic predictions',
    overallScore: 'Overall Score',
    career: 'Career',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    spirituality: 'Spirituality',
    luckyColor: 'Lucky Color',
    luckyNumber: 'Lucky Number',
    luckyTime: 'Lucky Time',
    dailyInsight: 'Daily Insight',
    otherSigns: 'Other Signs',
    ruledBy: 'Ruled by',
    element: 'Element',
    quality: 'Quality',
    ctaTitle: 'Get personalized horoscope',
    ctaDesc: 'Generate your Kundali to unlock daily predictions tailored to your exact birth chart.',
    ctaButton: 'Generate Kundali',
    loading: 'Calculating your horoscope...',
  },
  hi: {
    backToAll: 'सभी राशियाँ',
    horoscopeToday: 'आज का राशिफल',
    subtitle: 'वास्तविक ग्रह गोचर पर आधारित — सामान्य राशिफल नहीं',
    overallScore: 'समग्र स्कोर',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'आध्यात्म',
    luckyColor: 'शुभ रंग',
    luckyNumber: 'शुभ अंक',
    luckyTime: 'शुभ समय',
    dailyInsight: 'दैनिक अंतर्दृष्टि',
    otherSigns: 'अन्य राशियाँ',
    ruledBy: 'स्वामी',
    element: 'तत्त्व',
    quality: 'गुण',
    ctaTitle: 'व्यक्तिगत राशिफल प्राप्त करें',
    ctaDesc: 'अपनी सटीक जन्म कुण्डली के अनुरूप दैनिक भविष्यवाणी पाने के लिए कुण्डली बनाएँ।',
    ctaButton: 'कुण्डली बनाएँ',
    loading: 'आपका राशिफल गणना हो रहा है...',
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
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

function barColor(score: number): string {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

function scoreLabel(score: number, locale: string): string {
  if (score >= 8) return tl({ en: 'Excellent', hi: 'उत्कृष्ट', sa: 'उत्कृष्ट' }, locale);
  if (score >= 6.5) return tl({ en: 'Good', hi: 'शुभ', sa: 'शुभ' }, locale);
  if (score >= 4) return tl({ en: 'Mixed', hi: 'मिश्रित', sa: 'मिश्रित' }, locale);
  return tl({ en: 'Challenging', hi: 'चुनौतीपूर्ण', sa: 'कठिनः' }, locale);
}

export default function RashiHoroscopePage() {
  const locale = useLocale() as Locale;
  const params = useParams();
  const rashiSlug = params.rashi as string;

  const rashi = getRashiBySlug(rashiSlug);
  const lk = dataLocale(locale);
  const isHi = lk === 'hi';
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const L = isHi ? LABELS.hi : LABELS.en;

  const [horoscope, setHoroscope] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  useEffect(() => {
    if (!rashi) return;
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    setDate(today);

    setLoading(true);
    fetch(`/api/horoscope/daily?moonSign=${rashi.id}&date=${today}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed');
      })
      .then((data: DailyHoroscope) => setHoroscope(data))
      .catch(err => console.error('Failed to fetch daily horoscope:', err))
      .finally(() => setLoading(false));
  }, [rashi]);

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
            <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gold-primary/15 text-gold-light border border-gold-primary/20" style={bodyFont}>
              {isHi ? 'दैनिक' : 'Daily'}
            </div>
            <Link
              href={`/horoscope/${rashiSlug}/weekly` as '/horoscope'}
              className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              style={bodyFont}
            >
              {isHi ? 'साप्ताहिक' : 'Weekly'}
            </Link>
            <span className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary/40 cursor-not-allowed" style={bodyFont}>
              {isHi ? 'मासिक' : 'Monthly'}
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
                <p className="text-gold-light text-lg mb-1" style={headingFont}>{L.horoscopeToday}</p>
                <p className="text-text-secondary text-sm" style={bodyFont}>{L.subtitle}</p>
                {date && <p className="text-gold-dark text-xs mt-2">{date}</p>}
              </div>
            </div>

            {/* Rashi quick facts */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.ruledBy}</p>
                <p className="text-gold-light text-sm font-semibold mt-1" style={bodyFont}>
                  {tl(rashi.rulerName, locale)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.element}</p>
                <p className="text-gold-light text-sm font-semibold mt-1" style={bodyFont}>
                  {tl(rashi.element, locale)}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-3 text-center">
                <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.quality}</p>
                <p className="text-gold-light text-sm font-semibold mt-1" style={bodyFont}>
                  {tl(rashi.quality, locale)}
                </p>
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

          {/* Horoscope result */}
          {horoscope && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-6">

              {/* Overall score card */}
              <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/15 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">{L.overallScore}</p>
                    <p className={`text-4xl font-bold ${scoreColor(horoscope.overallScore)}`}>
                      {horoscope.overallScore}<span className="text-lg text-text-secondary">/10</span>
                    </p>
                    <p className={`text-sm font-medium mt-1 ${scoreColor(horoscope.overallScore)}`}>
                      {scoreLabel(horoscope.overallScore, locale)}
                    </p>
                  </div>
                  {/* Circular gauge */}
                  <div className="relative w-24 h-24">
                    <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                      <circle cx="40" cy="40" r="34" fill="none" stroke="currentColor"
                        className="text-white/5" strokeWidth="6" />
                      <circle cx="40" cy="40" r="34" fill="none"
                        strokeWidth="6" strokeLinecap="round"
                        className={scoreColor(horoscope.overallScore)}
                        stroke="currentColor"
                        strokeDasharray={`${(horoscope.overallScore / 10) * 213.6} 213.6`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-2xl font-bold ${scoreColor(horoscope.overallScore)}`}>
                        {horoscope.overallScore}
                      </span>
                      <span className="text-[10px] text-text-secondary">/10</span>
                    </div>
                  </div>
                </div>

                {/* Daily insight */}
                <div className="bg-gold-primary/5 border border-gold-primary/10 rounded-xl p-4 mb-5">
                  <p className="text-xs text-gold-dark uppercase tracking-wider mb-1 font-semibold">{L.dailyInsight}</p>
                  <p className="text-text-primary text-sm leading-relaxed" style={bodyFont}>
                    {horoscope.insight[lk]}
                  </p>
                </div>

                {/* Lucky trio */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyColor}</p>
                    <p className="text-gold-light text-sm font-semibold mt-1" style={bodyFont}>
                      {horoscope.luckyColor[lk]}
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyNumber}</p>
                    <p className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyNumber}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 text-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-wider">{L.luckyTime}</p>
                    <p className="text-gold-light text-sm font-semibold mt-1">{horoscope.luckyTime}</p>
                  </div>
                </div>
              </div>

              {/* Area cards */}
              <div className="space-y-3">
                {(['career', 'love', 'health', 'finance', 'spirituality'] as const).map((area) => {
                  const Icon = AREA_ICONS[area];
                  const areaData = horoscope.areas[area];
                  return (
                    <div key={area}
                      className="bg-gradient-to-br from-[#2d1b69]/30 via-[#1a1040]/40 to-[#0a0e27] border border-gold-primary/10 rounded-xl p-4">
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
                        {areaData.text[lk]}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Share */}
              <div className="flex justify-center">
                <ShareButton
                  title={`${vedicName} (${westernName}) — ${L.horoscopeToday}`}
                  text={`Today's ${westernName} Horoscope — Score: ${horoscope.overallScore}/10 | dekhopanchang.com`}
                  url={`https://dekhopanchang.com/${locale}/horoscope/${rashiSlug}`}
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

          {/* Other signs grid — internal linking */}
          <div className="mt-12">
            <h2 className="text-gold-light text-xl font-bold mb-6 text-center" style={headingFont}>
              {L.otherSigns}
            </h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {otherRashis.map((r) => (
                <Link key={r.id} href={`/horoscope/${r.slug}` as '/horoscope'}
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

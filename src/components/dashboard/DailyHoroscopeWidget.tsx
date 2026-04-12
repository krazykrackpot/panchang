'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Heart, Activity, IndianRupee, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { RashiIconById } from '@/components/icons/RashiIcons';
import { Link } from '@/lib/i18n/navigation';
import type { DailyHoroscope } from '@/lib/horoscope/daily-engine';

// ---------------------------------------------------------------------------
// Props & Labels
// ---------------------------------------------------------------------------
interface DailyHoroscopeWidgetProps {
  moonSign: number;       // 1-12
  nakshatra?: number;     // 1-27
  locale: string;
}

const LABELS = {
  en: {
    title: 'Daily Horoscope',
    career: 'Career',
    love: 'Love',
    health: 'Health',
    finance: 'Finance',
    spirituality: 'Spirituality',
    luckyColor: 'Color',
    luckyNumber: 'Number',
    luckyTime: 'Time',
    viewFull: 'View Full Horoscope',
    loading: 'Reading your stars...',
    error: 'Could not load horoscope',
  },
  hi: {
    title: 'दैनिक राशिफल',
    career: 'करियर',
    love: 'प्रेम',
    health: 'स्वास्थ्य',
    finance: 'वित्त',
    spirituality: 'आध्यात्म',
    luckyColor: 'रंग',
    luckyNumber: 'अंक',
    luckyTime: 'समय',
    viewFull: 'पूर्ण राशिफल देखें',
    loading: 'आपके नक्षत्र पढ़ रहे हैं...',
    error: 'राशिफल लोड नहीं हो सका',
  },
  sa: {
    title: 'दैनिकराशिफलम्',
    career: 'वृत्तिः',
    love: 'प्रेम',
    health: 'स्वास्थ्यम्',
    finance: 'वित्तम्',
    spirituality: 'आध्यात्मम्',
    luckyColor: 'वर्णः',
    luckyNumber: 'सङ्ख्या',
    luckyTime: 'समयः',
    viewFull: 'पूर्णं राशिफलं पश्यन्तु',
    loading: 'भवतः नक्षत्राणि पठ्यन्ते...',
    error: 'राशिफलं लोड् न अभवत्',
  },
};

const AREA_ICONS: Record<string, typeof Briefcase> = {
  career: Briefcase,
  love: Heart,
  health: Activity,
  finance: IndianRupee,
  spirituality: Sparkles,
};

function scoreColor(score: number): string {
  if (score >= 7) return 'text-emerald-400';
  if (score >= 4) return 'text-amber-400';
  return 'text-red-400';
}

function barBg(score: number): string {
  if (score >= 7) return 'bg-emerald-500';
  if (score >= 4) return 'bg-amber-500';
  return 'bg-red-500';
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function DailyHoroscopeWidget({ moonSign, nakshatra, locale }: DailyHoroscopeWidgetProps) {
  const lk = (locale === 'hi' || locale === 'sa') ? 'hi' as const : 'en' as const;
  const L = (LABELS as Record<string, typeof LABELS.en>)[locale] || LABELS.en;
  const isHi = lk === 'hi';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;

  const [data, setData] = useState<DailyHoroscope | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const now = new Date();
    const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const params = new URLSearchParams({ moonSign: String(moonSign), date: today });
    if (nakshatra) params.set('nakshatra', String(nakshatra));

    fetch(`/api/horoscope/daily?${params}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then((d: DailyHoroscope) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, [moonSign, nakshatra]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center">
        <Loader2 className="w-6 h-6 animate-spin text-gold-primary mx-auto mb-2" />
        <p className="text-text-secondary text-xs" style={bodyFont}>{L.loading}</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 text-center">
        <p className="text-text-secondary text-sm" style={bodyFont}>{L.error}</p>
      </div>
    );
  }

  const areas = ['career', 'love', 'health', 'finance', 'spirituality'] as const;

  return (
    <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <RashiIconById id={data.moonSign} size={40} />
        <div className="flex-1">
          <h3 className="text-gold-light text-base font-bold" style={headingFont}>{L.title}</h3>
          <p className="text-text-secondary text-[11px]">{data.moonSignName[lk]} &middot; {data.date}</p>
        </div>
        {/* Mini gauge */}
        <div className="relative w-14 h-14">
          <svg viewBox="0 0 56 56" className="w-full h-full -rotate-90">
            <circle cx="28" cy="28" r="23" fill="none" stroke="currentColor"
              className="text-white/5" strokeWidth="4" />
            <circle cx="28" cy="28" r="23" fill="none"
              strokeWidth="4" strokeLinecap="round"
              className={scoreColor(data.overallScore)}
              stroke="currentColor"
              strokeDasharray={`${(data.overallScore / 10) * 144.5} 144.5`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-sm font-bold ${scoreColor(data.overallScore)}`}>{data.overallScore}</span>
          </div>
        </div>
      </div>

      {/* Insight */}
      <p className="text-text-secondary text-xs leading-relaxed mb-4 px-1" style={bodyFont}>
        {data.insight[lk]}
      </p>

      {/* Area bars */}
      <div className="space-y-2.5 mb-4">
        {areas.map((area) => {
          const Icon = AREA_ICONS[area];
          const aData = data.areas[area];
          return (
            <div key={area} className="flex items-center gap-2">
              <Icon className="w-3.5 h-3.5 text-text-secondary shrink-0" />
              <span className="text-[11px] text-text-secondary w-16 shrink-0" style={bodyFont}>{L[area]}</span>
              <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${aData.score * 10}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' as const }}
                  className={`h-full rounded-full ${barBg(aData.score)}`}
                />
              </div>
              <span className={`text-[11px] font-semibold w-6 text-right ${scoreColor(aData.score)}`}>
                {aData.score}
              </span>
            </div>
          );
        })}
      </div>

      {/* Lucky row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
          <p className="text-[9px] text-text-secondary uppercase tracking-wider">{L.luckyColor}</p>
          <p className="text-gold-light text-[11px] font-semibold" style={bodyFont}>{data.luckyColor[lk]}</p>
        </div>
        <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
          <p className="text-[9px] text-text-secondary uppercase tracking-wider">{L.luckyNumber}</p>
          <p className="text-gold-light text-[11px] font-semibold">{data.luckyNumber}</p>
        </div>
        <div className="bg-white/5 rounded-lg px-2 py-1.5 text-center">
          <p className="text-[9px] text-text-secondary uppercase tracking-wider">{L.luckyTime}</p>
          <p className="text-gold-light text-[11px] font-semibold">{data.luckyTime}</p>
        </div>
      </div>

      {/* Link to full page */}
      <Link href="/horoscope"
        className="flex items-center justify-center gap-1.5 text-gold-primary text-xs font-medium hover:text-gold-light transition-colors">
        {L.viewFull} <ArrowRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}

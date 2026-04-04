'use client';

import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GoldDivider from '@/components/ui/GoldDivider';
import { GrahaIconById } from '@/components/icons/GrahaIcons';
import { RashiIconById } from '@/components/icons/RashiIcons';
import type { Locale } from '@/types/panchang';

interface RetroPeriod {
  planetId: number;
  planetName: { en: string; hi: string; sa: string };
  planetColor: string;
  startDate: string;
  endDate: string;
  startSign: number;
  startSignName: { en: string; hi: string; sa: string };
  endSign: number;
  endSignName: { en: string; hi: string; sa: string };
  durationDays: number;
}

interface CombustEvent {
  planetId: number;
  planetName: { en: string; hi: string; sa: string };
  planetColor: string;
  startDate: string;
  endDate: string;
  durationDays: number;
}

export default function RetrogradePage() {
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';
  const headingFont = isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };

  const [year, setYear] = useState(new Date().getFullYear());
  const [retroPeriods, setRetroPeriods] = useState<RetroPeriod[]>([]);
  const [combustEvents, setCombustEvents] = useState<CombustEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'retrograde' | 'combustion'>('retrograde');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`/api/retrograde?year=${year}`).then(r => r.json()),
      fetch(`/api/combustion?year=${year}`).then(r => r.json()),
    ]).then(([retro, combust]) => {
      setRetroPeriods(retro.periods || []);
      setCombustEvents(combust.events || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [year]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(locale === 'en' ? 'en-IN' : 'hi-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-5xl sm:text-6xl font-bold mb-4" style={headingFont}>
          <span className="text-gold-gradient">
            {locale === 'en' ? 'Retrograde & Combustion Calendar' : 'वक्री एवं अस्त पञ्चाङ्ग'}
          </span>
        </h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Track when planets go retrograde or become combust (too close to the Sun)'
            : 'जानें कब ग्रह वक्री होते हैं या सूर्य के निकट होकर अस्त होते हैं'}
        </p>
      </motion.div>

      {/* Year selector */}
      <div className="flex items-center justify-center gap-6 mb-8">
        <button onClick={() => setYear(y => y - 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronLeft className="w-5 h-5 text-gold-primary" />
        </button>
        <span className="text-4xl font-bold text-gold-gradient" style={headingFont}>{year}</span>
        <button onClick={() => setYear(y => y + 1)} className="p-2 rounded-lg border border-gold-primary/20 hover:bg-gold-primary/10 transition-all">
          <ChevronRight className="w-5 h-5 text-gold-primary" />
        </button>
      </div>

      {/* Tab toggle */}
      <div className="flex justify-center gap-3 mb-10">
        <button
          onClick={() => setTab('retrograde')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'retrograde' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {locale === 'en' ? 'Retrograde' : 'वक्री'}
        </button>
        <button
          onClick={() => setTab('combustion')}
          className={`px-5 py-2 rounded-lg text-sm font-bold transition-all ${
            tab === 'combustion' ? 'bg-gold-primary/20 text-gold-light border border-gold-primary/40' : 'text-text-secondary border border-gold-primary/10 hover:bg-gold-primary/10'
          }`}
        >
          {locale === 'en' ? 'Combustion' : 'अस्त'}
        </button>
      </div>

      <GoldDivider />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gold-primary border-t-transparent" />
        </div>
      ) : tab === 'retrograde' ? (
        <div className="space-y-4 my-10">
          {retroPeriods.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {locale === 'en' ? 'No retrograde periods found.' : 'कोई वक्री अवधि नहीं मिली।'}
            </div>
          ) : retroPeriods.map((p, i) => (
            <motion.div
              key={`${p.startDate}-${p.planetId}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.05, 0.6) }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15 bg-gradient-to-r from-red-500/5 to-transparent"
            >
              <div className="flex items-center gap-4">
                <GrahaIconById id={p.planetId} size={48} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-lg font-bold" style={{ color: p.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                      {p.planetName[locale]}
                    </span>
                    <span className="text-red-400 text-xs font-bold px-2 py-0.5 bg-red-500/15 rounded-full">
                      {locale === 'en' ? 'RETROGRADE' : 'वक्री'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-sm text-text-secondary">
                    <span className="font-mono">{formatDate(p.startDate)}</span>
                    <span className="text-gold-dark">→</span>
                    <span className="font-mono">{formatDate(p.endDate)}</span>
                    <span className="text-text-secondary/50 text-xs">({p.durationDays} {locale === 'en' ? 'days' : 'दिन'})</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 text-xs">
                    <RashiIconById id={p.startSign} size={14} />
                    <span className="text-text-secondary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.startSignName[locale]}</span>
                    <span className="text-gold-dark">→</span>
                    <RashiIconById id={p.endSign} size={14} />
                    <span className="text-text-primary" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>{p.endSignName[locale]}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="text-center text-text-secondary text-sm mt-6">
            {retroPeriods.length} {locale === 'en' ? 'retrograde periods' : 'वक्री अवधियाँ'}
          </div>
        </div>
      ) : (
        <div className="space-y-3 my-10">
          {combustEvents.length === 0 ? (
            <div className="text-center py-12 text-text-secondary">
              {locale === 'en' ? 'No combustion events found.' : 'कोई अस्त घटना नहीं मिली।'}
            </div>
          ) : combustEvents.map((e, i) => (
            <motion.div
              key={`${e.startDate}-${e.planetId}`}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: Math.min(i * 0.03, 0.6) }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 flex items-center gap-4 border border-orange-500/15"
            >
              <GrahaIconById id={e.planetId} size={40} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold" style={{ color: e.planetColor, ...(isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : {}) }}>
                    {e.planetName[locale]}
                  </span>
                  <span className="text-orange-400 text-[10px] font-bold px-2 py-0.5 bg-orange-500/15 rounded-full">
                    {locale === 'en' ? 'COMBUST' : 'अस्त'}
                  </span>
                </div>
                <div className="text-sm text-text-secondary mt-0.5">
                  <span className="font-mono">{formatDate(e.startDate)}</span>
                  <span className="text-gold-dark mx-1">→</span>
                  <span className="font-mono">{formatDate(e.endDate)}</span>
                  <span className="text-text-secondary/50 text-xs ml-2">({e.durationDays} {locale === 'en' ? 'days' : 'दिन'})</span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="text-center text-text-secondary text-sm mt-6">
            {combustEvents.length} {locale === 'en' ? 'combustion events' : 'अस्त घटनाएँ'}
          </div>
        </div>
      )}
    </div>
  );
}

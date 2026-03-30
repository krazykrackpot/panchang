'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ChevronDown } from 'lucide-react';

export default function LearnMuhurtasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const isDevanagari = locale !== 'en';

  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const [expandedNight, setExpandedNight] = useState<number | null>(null);

  const daytime = MUHURTA_DATA.filter(m => m.period === 'day');
  const nighttime = MUHURTA_DATA.filter(m => m.period === 'night');

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400 border-emerald-500/20';
    if (nature === 'inauspicious') return 'text-red-400 border-red-500/20';
    return 'text-amber-400 border-amber-500/20';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('muhurtasTitle')}
        </h2>
        <p className="text-text-secondary">{t('muhurtasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('muhurtasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('muhurtasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Daytime Muhurta = (Sunset - Sunrise) / 15</p>
          <p className="text-gold-light font-mono text-sm mt-1">Nighttime Muhurta = (Next Sunrise - Sunset) / 15</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">Equinox: ~48 min each | Summer day: ~55-60 min | Winter day: ~38-42 min</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <h4 className="text-lg text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Daytime Muhurtas (1-15)' : locale === 'hi' ? 'दिवा मुहूर्त (1-15)' : 'दिवामुहूर्ताः (1-15)'}
        </h4>
        <div className="space-y-3 mb-10">
          {daytime.map((m, i) => {
            const isExpanded = expandedDay === m.number;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card rounded-xl border overflow-hidden ${m.number === 8 ? 'border-gold-primary/40 ring-1 ring-gold-primary/20' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-gold-primary font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                        {m.number === 8 && <span className="ml-2 px-2 py-0.5 bg-gold-primary/30 text-gold-light text-[10px] rounded-full font-bold uppercase">Abhijit</span>}
                        <span className="ml-2 text-text-secondary/50 text-xs">{m.deity[locale]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {m.significance[locale]}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {locale === 'en' ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {m.bestFor[locale]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <h4 className="text-lg text-indigo-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Nighttime Muhurtas (16-30)' : locale === 'hi' ? 'रात्रि मुहूर्त (16-30)' : 'रात्रिमुहूर्ताः (16-30)'}
        </h4>
        <div className="space-y-3">
          {nighttime.map((m, i) => {
            const isExpanded = expandedNight === m.number;
            const isBrahma = m.number === 26 || m.number === 27;
            return (
              <motion.div
                key={m.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card rounded-xl border overflow-hidden ${isBrahma ? 'border-indigo-400/30 ring-1 ring-indigo-400/15' : 'border-gold-primary/10'}`}
              >
                <button
                  onClick={() => setExpandedNight(isExpanded ? null : m.number)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-indigo-300/80 font-bold text-xl w-8">{m.number}</span>
                      <div>
                        <span className="text-gold-light font-bold" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-heading)' } : undefined}>{m.name[locale]}</span>
                        {isBrahma && <span className="ml-2 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-[10px] rounded-full font-bold">{locale === 'en' ? 'BRAHMA' : 'ब्राह्म'}</span>}
                        <span className="ml-2 text-text-secondary/50 text-xs">{m.deity[locale]}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                        {m.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm ml-11 leading-relaxed" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                    {m.significance[locale]}
                  </p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {locale === 'en' ? 'Best Activities' : 'सर्वोत्तम कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm" style={isDevanagari ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                          {m.bestFor[locale]}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/muhurta"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {locale === 'en' ? 'View Muhurta Wheel & Conflict Analysis' : locale === 'hi' ? 'मुहूर्त चक्र और विरोध विश्लेषण देखें' : 'मुहूर्तचक्रं विरोधविश्लेषणं च पश्यतु'}
        </Link>
      </div>
    </div>
  );
}

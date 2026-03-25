'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnNakshatrasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('nakshatrasTitle')}
        </h2>
        <p className="text-text-secondary">{t('nakshatrasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('nakshatrasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('nakshatrasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Nakshatra = floor(Moon_longitude / 13.333°) + 1</p>
          <p className="text-gold-light font-mono text-sm mt-1">Pada = floor((Moon_longitude mod 13.333°) / 3.333°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">Example: Moon at 52° → floor(52/13.333)+1 = 4 → Rohini, Pada = floor((52-40)/3.333)+1 = 4</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-lg p-3 border border-gold-primary/10"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{n.symbol}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-gold-light font-semibold text-sm truncate">
                    {n.id}. {n.name[locale]}
                  </div>
                  {locale !== 'en' && <div className="text-text-secondary/60 text-xs truncate">{n.name.en}</div>}
                </div>
                <span className="text-text-secondary/50 text-[10px] font-mono flex-shrink-0">{n.startDeg.toFixed(1)}°</span>
              </div>
              <div className="flex flex-wrap gap-x-2 text-xs text-text-secondary/70">
                <span>{n.deity[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span>{n.rulerName[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span>{n.nature[locale]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/nakshatra"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

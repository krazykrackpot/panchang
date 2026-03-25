'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { ZodiacBeltDiagram } from '@/components/learn/InteractiveDiagram';
import { RASHIS } from '@/lib/constants/rashis';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const elementColor: Record<string, string> = {
  Fire: 'text-red-400',
  Earth: 'text-emerald-400',
  Air: 'text-sky-400',
  Water: 'text-blue-400',
};

export default function LearnRashisPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('rashisTitle')}
        </h2>
        <p className="text-text-secondary">{t('rashisSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('rashisWhat')}</p>
      </LessonSection>

      <LessonSection title={t('theAstronomy')} illustration={<ZodiacBeltDiagram />}>
        <p>{t('rashisAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Rashi = floor(sidereal_longitude / 30°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Example: Moon at 127° → floor(127/30)+1 = 5 → Leo (Simha)</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {RASHIS.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
              className="glass-card rounded-lg p-4 border border-gold-primary/10"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{r.symbol}</span>
                  <div>
                    <div className="text-gold-light font-semibold">{r.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{r.name.en}</div>}
                  </div>
                </div>
                <span className="text-text-secondary/50 text-xs font-mono">{r.startDeg}°–{r.endDeg}°</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-2 text-xs">
                <span className={elementColor[r.element.en] || 'text-text-secondary'}>{r.element[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span className="text-text-secondary">{r.quality[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span className="text-text-secondary">{r.rulerName[locale]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/rashi"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

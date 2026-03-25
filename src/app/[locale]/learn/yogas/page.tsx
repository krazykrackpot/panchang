'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { YOGAS } from '@/lib/constants/yogas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnYogasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  const natureColor = (nature: string) => {
    if (nature === 'auspicious') return 'text-emerald-400';
    if (nature === 'inauspicious') return 'text-red-400';
    return 'text-amber-400';
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('yogasTitle')}
        </h2>
        <p className="text-text-secondary">{t('yogasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('yogasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('yogasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Yoga = floor((Sun° + Moon°) / 13.333°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Sum increases ~14°/day → ~1 Yoga/day</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">27 Yogas × 13°20&apos; = 360°</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {YOGAS.map((y, i) => (
            <motion.div
              key={y.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-lg p-3 border border-gold-primary/10 flex items-center gap-3"
            >
              <span className="text-gold-primary/60 text-lg font-bold w-8 text-center">{y.number}</span>
              <div className="flex-1 min-w-0">
                <div className="text-gold-light font-semibold text-sm">{y.name[locale]}</div>
                {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{y.name.en}</div>}
              </div>
              <div className="text-right">
                <div className="text-text-secondary text-xs">{y.meaning[locale]}</div>
                <div className={`text-xs ${natureColor(y.nature)}`}>
                  {y.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') :
                   y.nature === 'inauspicious' ? (locale === 'en' ? 'Inauspicious' : 'अशुभ') :
                   (locale === 'en' ? 'Neutral' : 'सम')}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/yoga"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

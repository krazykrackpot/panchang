'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { TithiDiagram } from '@/components/learn/InteractiveDiagram';
import { TITHIS } from '@/lib/constants/tithis';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnTithisPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  const shukla = TITHIS.filter(ti => ti.paksha === 'shukla');
  const krishna = TITHIS.filter(ti => ti.paksha === 'krishna');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('tithisTitle')}
        </h2>
        <p className="text-text-secondary">{t('tithisSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('tithisWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')} illustration={<TithiDiagram />}>
        <p>{t('tithisAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Tithi = floor((Moon° - Sun°) / 12°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">1 Tithi ≈ 1 day (Moon gains ~12° on Sun daily)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Shukla 1-15 (0°-180°) | Krishna 1-15 (180°-360°)</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <h4 className="text-lg text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Shukla Paksha (Waxing Moon)' : locale === 'hi' ? 'शुक्ल पक्ष (बढ़ता चन्द्रमा)' : 'शुक्लपक्षः (वर्धमानचन्द्रः)'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
          {shukla.map((ti, i) => (
            <motion.div
              key={`s-${ti.number}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-lg p-3 text-center border border-gold-primary/10"
            >
              <div className="text-gold-primary text-lg font-bold">{ti.number <= 15 ? ti.number : ti.number - 15}</div>
              <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
              {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{ti.name.en}</div>}
              <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
            </motion.div>
          ))}
        </div>

        <h4 className="text-lg text-indigo-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Krishna Paksha (Waning Moon)' : locale === 'hi' ? 'कृष्ण पक्ष (घटता चन्द्रमा)' : 'कृष्णपक्षः (क्षीयमाणचन्द्रः)'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {krishna.map((ti, i) => (
            <motion.div
              key={`k-${ti.number}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="glass-card rounded-lg p-3 text-center border border-gold-primary/10"
            >
              <div className="text-indigo-300/80 text-lg font-bold">{ti.number - 15}</div>
              <div className="text-gold-light text-sm font-semibold">{ti.name[locale]}</div>
              {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{ti.name.en}</div>}
              <div className="text-text-secondary/70 text-xs mt-1">{ti.deity[locale]}</div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/tithi"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

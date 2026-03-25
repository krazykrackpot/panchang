'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { KARANAS } from '@/lib/constants/karanas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnKaranasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  const chara = KARANAS.filter(k => k.type === 'chara');
  const sthira = KARANAS.filter(k => k.type === 'sthira');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('karanasTitle')}
        </h2>
        <p className="text-text-secondary">{t('karanasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('karanasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('stepByStep')}>
        <p>{t('karanasAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Karana = floor((Moon° - Sun°) / 6°) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">60 Karanas/month = 2 per Tithi × 30 Tithis</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">7 Chara × 8 cycles = 56 + 4 Sthira = 60</p>
        </div>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <h4 className="text-lg text-gold-light mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Chara (Repeating) Karanas' : locale === 'hi' ? 'चर (पुनरावृत्ति) करण' : 'चराणि (पुनरावर्तिनः) करणानि'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {chara.map((k, i) => (
            <motion.div
              key={k.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass-card rounded-lg p-4 text-center border ${k.name.en === 'Vishti' ? 'border-red-500/30 bg-red-500/5' : 'border-gold-primary/10'}`}
            >
              <div className="text-gold-primary text-lg font-bold">{k.number}</div>
              <div className="text-gold-light text-sm font-semibold">{k.name[locale]}</div>
              {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{k.name.en}</div>}
              {k.name.en === 'Vishti' && (
                <div className="text-red-400 text-xs mt-1">{locale === 'en' ? 'Bhadra (Avoid!)' : 'भद्रा (त्याज्यम्!)'}</div>
              )}
            </motion.div>
          ))}
        </div>

        <h4 className="text-lg text-amber-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Sthira (Fixed) Karanas' : locale === 'hi' ? 'स्थिर (नियत) करण' : 'स्थिराणि (नियतानि) करणानि'}
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {sthira.map((k, i) => (
            <motion.div
              key={k.number}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg p-4 text-center border border-amber-500/15"
            >
              <div className="text-amber-400/80 text-lg font-bold">{k.number}</div>
              <div className="text-gold-light text-sm font-semibold">{k.name[locale]}</div>
              {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{k.name.en}</div>}
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/karana"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

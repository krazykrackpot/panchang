'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { MUHURTA_DATA } from '@/lib/constants/muhurtas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnMuhurtasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
          {daytime.map((m, i) => (
            <motion.div
              key={m.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card rounded-lg p-4 border ${m.number === 8 ? 'border-gold-primary/40 ring-1 ring-gold-primary/20' : 'border-gold-primary/10'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-gold-primary font-bold">{m.number}</span>
                  <span className="text-gold-light font-semibold text-sm">{m.name[locale]}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                  {m.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                </span>
              </div>
              <div className="text-text-secondary/70 text-xs mb-1">{m.deity[locale]}</div>
              <div className="text-text-secondary text-xs">{m.significance[locale].slice(0, 100)}...</div>
              {m.number === 8 && (
                <div className="mt-2 text-xs text-gold-primary font-semibold">
                  {locale === 'en' ? '⭐ ABHIJIT MUHURTA — Most Auspicious' : '⭐ अभिजित् मुहूर्त — सर्वाधिक शुभ'}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <h4 className="text-lg text-indigo-300/80 mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Nighttime Muhurtas (16-30)' : locale === 'hi' ? 'रात्रि मुहूर्त (16-30)' : 'रात्रिमुहूर्ताः (16-30)'}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {nighttime.map((m, i) => (
            <motion.div
              key={m.number}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card rounded-lg p-4 border ${(m.number === 26 || m.number === 27) ? 'border-indigo-400/30 ring-1 ring-indigo-400/15' : 'border-gold-primary/10'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-indigo-300/80 font-bold">{m.number}</span>
                  <span className="text-gold-light font-semibold text-sm">{m.name[locale]}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(m.nature)}`}>
                  {m.nature === 'auspicious' ? (locale === 'en' ? 'Auspicious' : 'शुभ') : (locale === 'en' ? 'Inauspicious' : 'अशुभ')}
                </span>
              </div>
              <div className="text-text-secondary/70 text-xs mb-1">{m.deity[locale]}</div>
              <div className="text-text-secondary text-xs">{m.significance[locale].slice(0, 100)}...</div>
              {(m.number === 26 || m.number === 27) && (
                <div className="mt-2 text-xs text-indigo-300 font-semibold">
                  {locale === 'en' ? '🙏 BRAHMA MUHURTA — Sacred Pre-dawn' : '🙏 ब्राह्म मुहूर्त — पवित्र प्रभातपूर्व'}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/panchang/muhurta"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {locale === 'en' ? 'View Detailed Muhurta Page with Conflict Analysis →' : 'विस्तृत मुहूर्त पृष्ठ और विरोध विश्लेषण →'}
        </Link>
      </div>
    </div>
  );
}

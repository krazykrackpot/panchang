'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { GRAHAS } from '@/lib/constants/grahas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnGrahasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('grahasTitle')}
        </h2>
        <p className="text-text-secondary">{t('grahasSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('grahasWhat')}</p>
      </LessonSection>

      <LessonSection title={t('theAstronomy')}>
        <p>{t('grahasAstronomy')}</p>
      </LessonSection>

      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {GRAHAS.map((g, i) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-lg p-4 border border-gold-primary/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl" style={{ color: g.color }}>{g.symbol}</span>
                <div>
                  <div className="text-gold-light font-semibold">{g.name[locale]}</div>
                  {locale !== 'en' && <div className="text-text-secondary/60 text-xs">{g.name.en}</div>}
                </div>
              </div>
              <div className="text-text-secondary text-sm">
                {g.id <= 1 ? (locale === 'en' ? 'Luminary' : 'ज्योतिपिण्ड') :
                 g.id <= 6 ? (locale === 'en' ? 'Planet' : 'ग्रह') :
                 (locale === 'en' ? 'Shadow Planet (Node)' : 'छाया ग्रह (पात)')}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title={t('significanceSection')} variant="highlight">
        <p>
          {locale === 'en'
            ? 'The Navagraha form the foundation of all Jyotish analysis. In a Kundali (birth chart), each Graha occupies a specific Rashi and Nakshatra, creating a unique celestial fingerprint for the moment of birth. The Vimshottari Dasha system uses the Moon\'s Nakshatra lord to unfold a 120-year predictive timeline. The Grahas are not merely astronomical objects — they represent cosmic forces that influence human life according to Vedic tradition.'
            : locale === 'hi'
            ? 'नवग्रह समस्त ज्योतिष विश्लेषण का आधार हैं। कुण्डली में प्रत्येक ग्रह विशिष्ट राशि और नक्षत्र में स्थित होता है, जन्म क्षण की एक अद्वितीय खगोलीय छाप बनाता है। विंशोत्तरी दशा प्रणाली चन्द्र के नक्षत्र स्वामी से 120 वर्ष की भविष्यवाणी समयरेखा प्रस्तुत करती है।'
            : 'नवग्रहाः समस्तज्योतिषविश्लेषणस्य आधारः। कुण्डल्यां प्रत्येकः ग्रहः विशिष्टराश्यां नक्षत्रे च स्थितः, जन्मक्षणस्य अद्वितीयां खगोलीयछापं रचयति।'}
        </p>
        <div className="mt-4 text-center">
          <Link
            href="/panchang"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
          >
            {t('tryIt')}
          </Link>
        </div>
      </LessonSection>
    </div>
  );
}

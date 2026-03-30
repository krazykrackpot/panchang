'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const NAKSHATRA_GROUPS = [
  { name: { en: 'Deva (Divine)', hi: 'देव (दैवी)', sa: 'देवः (दैवीः)' }, nakshatras: 'Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati', count: 9 },
  { name: { en: 'Manushya (Human)', hi: 'मनुष्य (मानवी)', sa: 'मनुष्यः (मानवीः)' }, nakshatras: 'Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadra, U.Bhadra', count: 9 },
  { name: { en: 'Rakshasa (Demonic)', hi: 'राक्षस (आसुरी)', sa: 'राक्षसः (आसुरीः)' }, nakshatras: 'Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha', count: 9 },
];

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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Nakshatra" devanagari="नक्षत्र" transliteration="Nakṣatra" meaning="Star / Lunar mansion" />
        <SanskritTermCard term="Pada" devanagari="पाद" transliteration="Pāda" meaning="Quarter (3°20')" />
        <SanskritTermCard term="Dasha Lord" devanagari="दशा स्वामी" transliteration="Daśā Svāmī" meaning="Period ruler" />
        <SanskritTermCard term="Gana" devanagari="गण" transliteration="Gaṇa" meaning="Temperament group" />
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

      <LessonSection title={locale === 'en' ? 'Dasha Connection — Why Nakshatras Matter' : 'दशा सम्बन्ध — नक्षत्र क्यों महत्वपूर्ण हैं'}>
        <p>
          {locale === 'en'
            ? 'The Nakshatra system is the backbone of the Vimshottari Dasha timing system. Each of the 27 Nakshatras is ruled by one of the 9 planets. The planet ruling your birth Moon\'s Nakshatra determines which Dasha you\'re born into — the starting point of your 120-year planetary period timeline. The 27 Nakshatras divide evenly into 3 sets of 9 (one per planet).'
            : 'नक्षत्र प्रणाली विंशोत्तरी दशा समय प्रणाली की रीढ़ है। 27 नक्षत्रों में से प्रत्येक 9 ग्रहों में से एक द्वारा शासित है। आपके जन्म चन्द्र के नक्षत्र का शासक ग्रह यह निर्धारित करता है कि आप किस दशा में जन्मे हैं।'}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Nakshatra Lords (Vimshottari order):' : 'नक्षत्र स्वामी (विंशोत्तरी क्रम):'}
          </p>
          <div className="grid grid-cols-3 gap-1 text-xs text-gold-light/80 font-mono">
            <div>Ketu: 1, 10, 19</div>
            <div>Venus: 2, 11, 20</div>
            <div>Sun: 3, 12, 21</div>
            <div>Moon: 4, 13, 22</div>
            <div>Mars: 5, 14, 23</div>
            <div>Rahu: 6, 15, 24</div>
            <div>Jupiter: 7, 16, 25</div>
            <div>Saturn: 8, 17, 26</div>
            <div>Mercury: 9, 18, 27</div>
          </div>
        </div>
      </LessonSection>

      <LessonSection title={locale === 'en' ? 'Gana (Temperament) Groups' : 'गण (स्वभाव) समूह'}>
        <p>
          {locale === 'en'
            ? 'Each Nakshatra belongs to one of three Ganas — Deva (divine/gentle), Manushya (human/balanced), or Rakshasa (fierce/independent). This classification is crucial in Kundali matching (Gana Kuta = 6 points). Same Gana partners are most compatible temperamentally.'
            : 'प्रत्येक नक्षत्र तीन गणों में से एक का होता है — देव (दैवी/कोमल), मनुष्य (मानवी/संतुलित), या राक्षस (उग्र/स्वतन्त्र)। यह वर्गीकरण कुण्डली मिलान में महत्वपूर्ण है।'}
        </p>
        <div className="mt-4 space-y-2">
          {NAKSHATRA_GROUPS.map((g) => (
            <div key={g.name.en} className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <span className="text-gold-primary font-semibold text-sm">{g.name[locale]} ({g.count})</span>
              <p className="text-text-secondary/70 text-xs mt-1">{g.nakshatras}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title={locale === 'en' ? 'Padas & Navamsha Connection' : 'पाद और नवमांश सम्बन्ध'}>
        <p>
          {locale === 'en'
            ? 'Each Nakshatra has 4 Padas (quarters) of 3°20\' each. The 108 Padas (27 × 4) map directly to the Navamsha (D9) chart — the most important divisional chart in Jyotish. Pada 1 maps to the Navamsha starting from the sign\'s first Navamsha. Baby naming in traditional astrology uses the first syllable associated with the birth Nakshatra Pada.'
            : 'प्रत्येक नक्षत्र के 4 पाद (चतुर्थांश) 3°20\' के होते हैं। 108 पाद (27 × 4) सीधे नवमांश (D9) कुण्डली से जुड़ते हैं। पारम्परिक ज्योतिष में शिशु का नामकरण जन्म नक्षत्र पाद के प्रथम अक्षर से होता है।'}
        </p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">27 Nakshatras × 4 Padas = 108 divisions</p>
          <p className="text-gold-light font-mono text-sm">12 Rashis × 9 Navamshas = 108 divisions</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {locale === 'en' ? 'This is why 108 is sacred in Hindu tradition — it unifies the Nakshatra and Rashi systems' : 'इसीलिए 108 हिन्दू परम्परा में पवित्र है — यह नक्षत्र और राशि प्रणालियों को एकीकृत करता है'}
          </p>
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

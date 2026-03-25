'use client';

import { useTranslations, useLocale } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

export default function LearnKundaliPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('kundaliTitle')}
        </h2>
        <p className="text-text-secondary">{t('kundaliSubtitle')}</p>
      </div>

      <LessonSection title={t('whatIsIt')}>
        <p>{t('kundaliWhat')}</p>
      </LessonSection>

      <LessonSection title={t('theAstronomy')}>
        <p>{t('kundaliAstronomy')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Lagna = f(Local Sidereal Time, Latitude)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">LST changes ~1° every 4 minutes → Lagna shifts every ~2 hours</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">12 houses × ~2 hours = 24 hours = full rotation</p>
        </div>
      </LessonSection>

      <LessonSection title={locale === 'en' ? 'Key Concepts' : 'प्रमुख अवधारणाएँ'}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <SanskritTermCard term="Lagna" devanagari="लग्न" transliteration="Lagna" meaning="Ascendant (Rising Sign)" />
          <SanskritTermCard term="Bhava" devanagari="भाव" transliteration="Bhāva" meaning="House (Life area)" />
          <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Daśā" meaning="Planetary Period" />
          <SanskritTermCard term="Yoga" devanagari="योग" transliteration="Yoga" meaning="Planetary Combination" />
          <SanskritTermCard term="Dosha" devanagari="दोष" transliteration="Doṣa" meaning="Affliction/Blemish" />
          <SanskritTermCard term="Navamsha" devanagari="नवमांश" transliteration="Navāṃśa" meaning="D9 Divisional Chart" />
          <SanskritTermCard term="Gochar" devanagari="गोचर" transliteration="Gocara" meaning="Transit" />
          <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Aṣṭakavarga" meaning="Eight-division Strength" />
        </div>
      </LessonSection>

      <LessonSection title={locale === 'en' ? 'The 12 Houses' : 'बारह भाव'} variant="highlight">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { num: 1, en: 'Self, appearance, personality', hi: 'स्व, रूप, व्यक्तित्व' },
            { num: 2, en: 'Wealth, family, speech', hi: 'धन, परिवार, वाणी' },
            { num: 3, en: 'Courage, siblings, communication', hi: 'साहस, भाई-बहन, संवाद' },
            { num: 4, en: 'Home, mother, happiness', hi: 'गृह, माता, सुख' },
            { num: 5, en: 'Children, intelligence, creativity', hi: 'सन्तान, बुद्धि, सृजनशीलता' },
            { num: 6, en: 'Enemies, disease, service', hi: 'शत्रु, रोग, सेवा' },
            { num: 7, en: 'Marriage, partnerships, business', hi: 'विवाह, साझेदारी, व्यापार' },
            { num: 8, en: 'Longevity, transformation, occult', hi: 'आयु, परिवर्तन, गूढ़ विद्या' },
            { num: 9, en: 'Fortune, dharma, father, guru', hi: 'भाग्य, धर्म, पिता, गुरु' },
            { num: 10, en: 'Career, status, karma', hi: 'व्यवसाय, प्रतिष्ठा, कर्म' },
            { num: 11, en: 'Gains, income, aspirations', hi: 'लाभ, आय, आकांक्षा' },
            { num: 12, en: 'Loss, moksha, foreign lands', hi: 'हानि, मोक्ष, विदेश' },
          ].map((h) => (
            <div key={h.num} className="glass-card rounded-lg p-3 border border-gold-primary/10 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-gold-primary/10 flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                {h.num}
              </span>
              <span className="text-text-secondary text-sm">{locale === 'en' ? h.en : h.hi}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {locale === 'en' ? 'Generate Your Kundali →' : 'अपनी कुण्डली बनाएं →'}
        </Link>
      </div>
    </div>
  );
}

'use client';

import { useTranslations } from 'next-intl';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { EclipticDiagram, ZodiacBeltDiagram, AyanamshaDiagram } from '@/components/learn/InteractiveDiagram';
import { Link } from '@/lib/i18n/navigation';

export default function LearnFoundationsPage() {
  const t = useTranslations('learn');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('foundationsTitle')}
        </h2>
        <p className="text-text-secondary">{t('foundationsSubtitle')}</p>
      </div>

      {/* Key terms */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Jyotish" devanagari="ज्योतिष" transliteration="Jyotiṣa" meaning="Science of Light / Astronomy" />
        <SanskritTermCard term="Graha" devanagari="ग्रह" transliteration="Graha" meaning="That which grasps (Planet)" />
        <SanskritTermCard term="Rashi" devanagari="राशि" transliteration="Rāśi" meaning="Heap / Zodiac Sign" />
        <SanskritTermCard term="Nakshatra" devanagari="नक्षत्र" transliteration="Nakṣatra" meaning="Star / Lunar Mansion" />
        <SanskritTermCard term="Panchang" devanagari="पञ्चाङ्ग" transliteration="Pañcāṅga" meaning="Five Limbs (Calendar)" />
      </div>

      <LessonSection number={1} title={t('nightSky')}>
        <p>{t('nightSkyContent')}</p>
      </LessonSection>

      <LessonSection number={2} title={t('celestialSphere')}>
        <p>{t('celestialSphereContent')}</p>
      </LessonSection>

      <LessonSection
        number={3}
        title={t('ecliptic')}
        illustration={<EclipticDiagram />}
      >
        <p>{t('eclipticContent')}</p>
      </LessonSection>

      <LessonSection number={4} title={t('degreesMeasurement')}>
        <p>{t('degreesMeasurementContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            360° = 12 Rashis × 30° = 27 Nakshatras × 13°20&apos;
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            1° = 60&apos; (arcminutes) = 3,600&quot; (arcseconds)
          </p>
        </div>
      </LessonSection>

      <LessonSection
        number={5}
        title={t('zodiacBelt')}
        illustration={<ZodiacBeltDiagram />}
      >
        <p>{t('zodiacBeltContent')}</p>
      </LessonSection>

      <LessonSection
        number={6}
        title={t('tropicalVsSidereal')}
        illustration={<AyanamshaDiagram />}
      >
        <p>{t('tropicalVsSiderealContent')}</p>
      </LessonSection>

      <LessonSection number={7} title={t('sunsJourney')}>
        <p>{t('sunsJourneyContent')}</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <SanskritTermCard term="Uttarayana" devanagari="उत्तरायण" transliteration="Uttarāyaṇa" meaning="Northward journey (Jan-Jun)" />
          <SanskritTermCard term="Dakshinayana" devanagari="दक्षिणायन" transliteration="Dakṣiṇāyana" meaning="Southward journey (Jul-Dec)" />
        </div>
      </LessonSection>

      <LessonSection number={8} title={t('moonsJourney')}>
        <p>{t('moonsJourneyContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Sidereal month: ~27.3 days (star-to-star)</p>
          <p className="text-gold-light font-mono text-sm">Synodic month: ~29.5 days (New Moon to New Moon)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Moon speed: ~13.2°/day | Sun speed: ~1°/day</p>
        </div>
      </LessonSection>

      <LessonSection number={9} title={t('fiveLimbs')} variant="highlight">
        <p>{t('fiveLimbsContent')}</p>
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-5 gap-3">
          <SanskritTermCard term="Tithi" devanagari="तिथि" transliteration="Tithi" meaning="Lunar day (Moon−Sun)" />
          <SanskritTermCard term="Nakshatra" devanagari="नक्षत्र" transliteration="Nakṣatra" meaning="Moon's star position" />
          <SanskritTermCard term="Yoga" devanagari="योग" transliteration="Yoga" meaning="Sun + Moon combination" />
          <SanskritTermCard term="Karana" devanagari="करण" transliteration="Karaṇa" meaning="Half-tithi" />
          <SanskritTermCard term="Vara" devanagari="वार" transliteration="Vāra" meaning="Weekday" />
        </div>
        <div className="mt-6 text-center">
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

'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { EclipticDiagram, ZodiacBeltDiagram, AyanamshaDiagram } from '@/components/learn/InteractiveDiagram';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const CURRICULUM = [
  { phase: 1, title: { en: 'The Sky', hi: 'आकाश', sa: 'आकाशः' }, pages: [
    { name: { en: 'Foundations', hi: 'आधार', sa: 'आधारः' }, href: '/learn', desc: { en: 'Night sky, ecliptic, degrees, zodiac, sidereal vs tropical', hi: 'रात्रि आकाश, क्रान्तिवृत्त, अंश, राशिचक्र', sa: 'रात्र्याकाशः, क्रान्तिवृत्तं, अंशाः, राशिचक्रम्' } },
    { name: { en: 'Grahas', hi: 'ग्रह', sa: 'ग्रहाः' }, href: '/learn/grahas', desc: { en: '9 planets, friendships, dignities, orbital periods', hi: '9 ग्रह, मित्रताएँ, गरिमाएँ, कक्षीय अवधियाँ', sa: '9 ग्रहाः, मैत्रयः, गरिमाः, कक्षीयावधयः' } },
    { name: { en: 'Rashis', hi: 'राशियाँ', sa: 'राशयः' }, href: '/learn/rashis', desc: { en: '12 zodiac signs, elements, qualities, rulers', hi: '12 राशियाँ, तत्व, गुण, स्वामी', sa: '12 राशयः, तत्त्वानि, गुणाः, स्वामिनः' } },
    { name: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, href: '/learn/nakshatras', desc: { en: '27 lunar mansions, padas, dasha lords, ganas', hi: '27 नक्षत्र, पाद, दशा स्वामी, गण', sa: '27 नक्षत्राणि, पादाः, दशास्वामिनः, गणाः' } },
  ]},
  { phase: 2, title: { en: 'The Panchang', hi: 'पञ्चाङ्ग', sa: 'पञ्चाङ्गम्' }, pages: [
    { name: { en: 'Tithis', hi: 'तिथियाँ', sa: 'तिथयः' }, href: '/learn/tithis', desc: { en: '30 lunar days, shukla/krishna paksha', hi: '30 चान्द्र दिन, शुक्ल/कृष्ण पक्ष', sa: '30 चान्द्रदिनानि, शुक्ल/कृष्णपक्षौ' } },
    { name: { en: 'Yogas', hi: 'योग', sa: 'योगाः' }, href: '/learn/yogas', desc: { en: '27 sun-moon combinations, auspiciousness', hi: '27 सूर्य-चन्द्र संयोजन', sa: '27 सूर्यचन्द्रसंयोजनानि' } },
    { name: { en: 'Karanas', hi: 'करण', sa: 'करणानि' }, href: '/learn/karanas', desc: { en: '11 half-tithis, chara and sthira types', hi: '11 अर्ध-तिथि, चर और स्थिर प्रकार', sa: '11 अर्धतिथयः, चरस्थिरप्रकाराः' } },
    { name: { en: 'Muhurtas', hi: 'मुहूर्त', sa: 'मुहूर्ताः' }, href: '/learn/muhurtas', desc: { en: '30 time divisions, Abhijit, Brahma Muhurta', hi: '30 समय विभाग, अभिजित, ब्रह्म मुहूर्त', sa: '30 कालविभागाः, अभिजित्, ब्रह्ममुहूर्तः' } },
  ]},
  { phase: 3, title: { en: 'The Chart', hi: 'कुण्डली', sa: 'कुण्डली' }, pages: [
    { name: { en: 'Kundali', hi: 'कुण्डली', sa: 'कुण्डली' }, href: '/learn/kundali', desc: { en: 'Birth chart basics, lagna, key concepts', hi: 'जन्म कुण्डली मूल बातें, लग्न', sa: 'जन्मकुण्डलीमूलतत्त्वानि, लग्नम्' } },
    { name: { en: 'Houses', hi: 'भाव', sa: 'भावाः' }, href: '/learn/bhavas', desc: { en: '12 houses, classifications, significations', hi: '12 भाव, वर्गीकरण, संकेत', sa: '12 भावाः, वर्गीकरणं, सङ्केताः' } },
    { name: { en: 'Vargas', hi: 'वर्ग', sa: 'वर्गाः' }, href: '/learn/vargas', desc: { en: '16 divisional charts, Navamsha, interpretation', hi: '16 विभागीय कुण्डलियाँ, नवांश, व्याख्या', sa: '16 विभागकुण्डल्यः, नवांशः, व्याख्या' } },
    { name: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, href: '/learn/dashas', desc: { en: 'Vimshottari planetary periods, sub-periods', hi: 'विंशोत्तरी ग्रह अवधियाँ, उप-अवधियाँ', sa: 'विंशोत्तरीग्रहकालखण्डाः, उपकालखण्डाः' } },
    { name: { en: 'Transits', hi: 'गोचर', sa: 'गोचरः' }, href: '/learn/gochar', desc: { en: 'Gochar, Sade Sati, Jupiter transit, Balam', hi: 'गोचर, साढ़े साती, गुरु गोचर, बलम', sa: 'गोचरः, साढेसाती, गुरुगोचरः, बलम्' } },
  ]},
  { phase: 4, title: { en: 'Applied Jyotish', hi: 'व्यावहारिक ज्योतिष', sa: 'व्यावहारिकज्योतिषम्' }, pages: [
    { name: { en: 'Matching', hi: 'मिलान', sa: 'मेलनम्' }, href: '/learn/matching', desc: { en: 'Ashta Kuta, 8 compatibility factors, doshas', hi: 'अष्ट कूट, 8 अनुकूलता कारक, दोष', sa: 'अष्टकूटं, 8 अनुकूलताकारकाणि, दोषाः' } },
    { name: { en: 'How We Calculate', hi: 'गणना', sa: 'गणनापद्धतिः' }, href: '/learn/calculations', desc: { en: 'Julian Day, Meeus algorithms, binary search', hi: 'जूलियन दिन, Meeus एल्गोरिथ्म, बाइनरी खोज', sa: 'जूलियनदिनं, Meeus गणितानि, द्विभाजनखोजः' } },
    { name: { en: 'Advanced', hi: 'उन्नत', sa: 'उन्नतम्' }, href: '/learn/advanced', desc: { en: 'Varshaphal, KP, Prashna, Muhurta AI', hi: 'वर्षफल, KP, प्रश्न, मुहूर्त AI', sa: 'वर्षफलं, KP, प्रश्नः, मुहूर्त AI' } },
  ]},
];

export default function LearnFoundationsPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('foundationsTitle')}
        </h2>
        <p className="text-text-secondary">{t('foundationsSubtitle')}</p>
      </div>

      {/* Interactive Course Module CTA */}
      <div className="mb-8 glass-card rounded-2xl p-5 border border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-gold-primary/5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-indigo-400 text-[10px] uppercase tracking-widest font-bold mb-1">{locale === 'en' ? 'Interactive Course' : 'इंटरैक्टिव पाठ्यक्रम'}</div>
            <h3 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
              {locale === 'en' ? 'Learn Jyotish — Module by Module' : 'ज्योतिष सीखें — मॉड्यूल दर मॉड्यूल'}
            </h3>
            <p className="text-text-secondary text-xs mt-1">
              {locale === 'en'
                ? 'Deep 10-15 minute lessons with diagrams, worked examples, and knowledge checks.'
                : 'गहन 10-15 मिनट के पाठ — चित्र, उदाहरण और ज्ञान परीक्षा।'}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[
                { id: '1-1', label: '1.1 Night Sky' },
                { id: '1-2', label: '1.2 Degrees & Signs' },
                { id: '1-3', label: '1.3 Fixed Stars' },
                { id: '2-1', label: '2.1 Nine Grahas' },
                { id: '2-2', label: '2.2 Relationships' },
                { id: '2-3', label: '2.3 Dignities' },
                { id: '2-4', label: '2.4 Retrograde' },
              ].map(m => (
                <Link key={m.id} href={`/learn/modules/${m.id}`}
                  className="text-[10px] px-2 py-1 rounded-lg bg-gold-primary/10 border border-gold-primary/15 text-gold-light hover:bg-gold-primary/20 transition-colors">
                  {m.label}
                </Link>
              ))}
              <span className="text-text-tertiary text-[10px] px-2 py-1">{locale === 'en' ? '+ more coming...' : '+ और आ रहे...'}</span>
            </div>
          </div>
          <Link href="/learn/modules/1-1"
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-primary text-bg-primary font-semibold text-sm hover:bg-gold-light transition-colors">
            {locale === 'en' ? 'Start Module 1.1 →' : 'मॉड्यूल 1.1 →'}
          </Link>
        </div>
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

      {/* Learning Path / Curriculum */}
      <div className="mt-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {locale === 'en' ? 'Your Learning Path' : locale === 'hi' ? 'आपका अध्ययन पथ' : 'भवतः अध्ययनपथः'}
        </h2>
        <p className="text-text-secondary mb-6">
          {locale === 'en'
            ? '16 progressive lessons across 4 phases — from stargazing to advanced predictive techniques'
            : '4 चरणों में 16 क्रमिक पाठ — तारा-दर्शन से उन्नत भविष्यवाणी तकनीकों तक'}
        </p>

        <div className="space-y-8">
          {CURRICULUM.map((phase, pi) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: pi * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="w-10 h-10 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold">
                  {phase.phase}
                </span>
                <h3 className="text-lg font-bold text-gold-light" style={{ fontFamily: 'var(--font-heading)' }}>
                  {phase.title[locale]}
                </h3>
              </div>
              <div className="ml-5 border-l-2 border-gold-primary/10 pl-8 space-y-2">
                {phase.pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="block glass-card rounded-lg p-3 border border-gold-primary/5 hover:border-gold-primary/20 transition-all group"
                  >
                    <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">
                      {page.name[locale]}
                    </div>
                    <p className="text-text-secondary/70 text-xs mt-0.5">{page.desc[locale]}</p>
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

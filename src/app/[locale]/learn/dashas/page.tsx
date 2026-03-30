'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Dashas — Planetary Periods', hi: 'दशा — ग्रह अवधियाँ', sa: 'दशाः — ग्रहकालखण्डाः' },
  subtitle: { en: 'The timing system that unfolds destiny through a 120-year planetary cycle', hi: '120 वर्षों की ग्रह चक्र से भाग्य को प्रकट करने वाली समय प्रणाली', sa: '120 वर्षाणां ग्रहचक्रेण भाग्यं प्रकटयतीति कालप्रणालिः' },
  whatTitle: { en: 'What is a Dasha?', hi: 'दशा क्या है?', sa: 'दशा का?' },
  whatContent: {
    en: 'A Dasha is a planetary period — a span of time ruled by a specific Graha. The Vimshottari Dasha system ("Dasha of 120") is the most widely used timing system in Vedic astrology. It divides an entire lifetime into major periods (Maha Dasha), each governed by one of the nine Grahas. The sequence and starting point are determined by the Moon\'s Nakshatra at birth.',
    hi: 'दशा एक ग्रह अवधि है — एक विशिष्ट ग्रह द्वारा शासित समय का अन्तराल। विंशोत्तरी दशा प्रणाली ("120 की दशा") वैदिक ज्योतिष में सबसे व्यापक रूप से प्रयुक्त समय प्रणाली है। यह सम्पूर्ण जीवनकाल को महादशाओं में विभाजित करती है।',
    sa: 'दशा ग्रहकालखण्डः — विशिष्टग्रहेण शासितः कालान्तरः। विंशोत्तरीदशापद्धतिः वैदिकज्योतिषे सर्वाधिकप्रचलिता कालपद्धतिः।'
  },
  vimshottariTitle: { en: 'The Vimshottari System — 120 Years', hi: 'विंशोत्तरी प्रणाली — 120 वर्ष', sa: 'विंशोत्तरीपद्धतिः — 120 वर्षाणि' },
  vimshottariContent: {
    en: 'The nine Maha Dashas follow a fixed sequence, each lasting a specific number of years. The total cycle spans 120 years. The sequence follows the Nakshatra lords in Vimshottari order: Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury.',
    hi: 'नौ महादशाएँ एक निश्चित क्रम में आती हैं, प्रत्येक निर्धारित वर्षों तक चलती है। कुल चक्र 120 वर्ष का होता है। क्रम विंशोत्तरी क्रम में नक्षत्र स्वामियों का अनुसरण करता है।',
    sa: 'नव महादशाः निश्चितक्रमेण आगच्छन्ति। सम्पूर्णचक्रं 120 वर्षाणि।'
  },
  calcTitle: { en: 'How Dasha is Calculated', hi: 'दशा कैसे निर्धारित होती है', sa: 'दशा कथं निर्धार्यते' },
  calcContent: {
    en: 'Your Dasha starting point depends on the Moon\'s exact position in its Nakshatra at birth. The Nakshatra lord determines which Dasha you\'re born into, and the Moon\'s progress through that Nakshatra determines how much of that Dasha remains.',
    hi: 'आपकी दशा का प्रारम्भ बिन्दु जन्म के समय चन्द्र की नक्षत्र में सटीक स्थिति पर निर्भर करता है। नक्षत्र स्वामी यह निर्धारित करता है कि आप किस दशा में जन्मे हैं।',
    sa: 'दशायाः प्रारम्भबिन्दुः जन्मसमये चन्द्रस्य नक्षत्रे सूक्ष्मस्थित्यां निर्भरम्।'
  },
  subTitle: { en: 'Sub-Periods: Antardasha & Beyond', hi: 'उप-अवधियाँ: अन्तर्दशा और आगे', sa: 'उपकालखण्डाः: अन्तर्दशा च ततः परम्' },
  subContent: {
    en: 'Each Maha Dasha is subdivided into 9 Antardashas (sub-periods), which follow the same Vimshottari sequence starting from the Maha Dasha lord. Each Antardasha is further divided into 9 Pratyantardashas, and so on for even finer timing (Sookshma, Prana). Our software calculates down to the Antardasha level.',
    hi: 'प्रत्येक महादशा 9 अन्तर्दशाओं में विभाजित होती है, जो महादशा स्वामी से प्रारम्भ होकर उसी विंशोत्तरी क्रम में आती हैं। प्रत्येक अन्तर्दशा 9 प्रत्यन्तरदशाओं में विभाजित होती है।',
    sa: 'प्रत्येका महादशा 9 अन्तर्दशासु विभज्यते।'
  },
  interpretTitle: { en: 'How to Interpret Dashas', hi: 'दशा की व्याख्या कैसे करें', sa: 'दशाव्याख्या कथं करणीया' },
  interpretContent: {
    en: 'A Dasha period activates the planet\'s significations based on its placement in your chart. The results depend on: (1) Which houses the Dasha lord owns, (2) Which house it occupies, (3) Which planets it\'s associated with or aspected by, (4) Its strength (exalted, debilitated, combust, etc.), and (5) The Antardasha lord\'s relationship to the Maha Dasha lord.',
    hi: 'दशा काल ग्रह के संकेतों को उसकी कुण्डली में स्थिति के आधार पर सक्रिय करता है। परिणाम निर्भर करते हैं: (1) दशा स्वामी कौन से भाव का स्वामी है, (2) वह किस भाव में बैठा है, (3) कौन से ग्रह उससे सम्बन्धित हैं, (4) उसका बल, और (5) अन्तर्दशा स्वामी का महादशा स्वामी से सम्बन्ध।',
    sa: 'दशाकालः ग्रहस्य सङ्केतान् सक्रियं करोति।'
  },
  tryIt: { en: 'See Your Dasha Periods in Kundali →', hi: 'अपनी दशा अवधियाँ कुण्डली में देखें →', sa: 'स्वदशाकालखण्डान् कुण्डल्यां पश्यतु →' },
};

const DASHA_PERIODS = [
  { planet: 'Ketu', planetHi: 'केतु', years: 7, color: '#9ca3af', nakshatras: 'Ashwini, Magha, Moola' },
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, color: '#ec4899', nakshatras: 'Bharani, P.Phalguni, P.Ashadha' },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, color: '#f59e0b', nakshatras: 'Krittika, U.Phalguni, U.Ashadha' },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, color: '#e2e8f0', nakshatras: 'Rohini, Hasta, Shravana' },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, color: '#ef4444', nakshatras: 'Mrigashira, Chitra, Dhanishta' },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, color: '#6366f1', nakshatras: 'Ardra, Swati, Shatabhisha' },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, color: '#f0d48a', nakshatras: 'Punarvasu, Vishakha, P.Bhadra' },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, color: '#3b82f6', nakshatras: 'Pushya, Anuradha, U.Bhadra' },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, color: '#22c55e', nakshatras: 'Ashlesha, Jyeshtha, Revati' },
];

export default function LearnDashasPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Daśā" meaning="Planetary Period" />
        <SanskritTermCard term="Maha Dasha" devanagari="महादशा" transliteration="Mahādaśā" meaning="Major Period (years)" />
        <SanskritTermCard term="Antardasha" devanagari="अन्तर्दशा" transliteration="Antardaśā" meaning="Sub-period (months)" />
        <SanskritTermCard term="Pratyantara" devanagari="प्रत्यन्तर" transliteration="Pratyantara" meaning="Sub-sub-period (days)" />
        <SanskritTermCard term="Vimshottari" devanagari="विंशोत्तरी" transliteration="Viṃśottarī" meaning="Of 120 (years)" />
      </div>

      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p>{L.whatContent[locale]}</p>
      </LessonSection>

      <LessonSection number={2} title={L.vimshottariTitle[locale]}>
        <p>{L.vimshottariContent[locale]}</p>

        {/* Dasha periods visual */}
        <div className="mt-6 space-y-2">
          {DASHA_PERIODS.map((d, i) => (
            <motion.div
              key={d.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-20 text-right text-sm font-semibold" style={{ color: d.color }}>
                {locale === 'en' ? d.planet : d.planetHi}
              </div>
              <div
                className="h-8 rounded-md flex items-center px-3 text-xs font-mono text-white/80"
                style={{
                  width: `${(d.years / 20) * 100}%`,
                  minWidth: '60px',
                  backgroundColor: `${d.color}33`,
                  border: `1px solid ${d.color}55`,
                }}
              >
                {d.years} {locale === 'en' ? 'yrs' : 'वर्ष'}
              </div>
              <div className="text-text-secondary/60 text-xs hidden sm:block">{d.nakshatras}</div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/50 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {locale === 'en' ? 'years' : 'वर्ष'}
          </div>
        </div>
      </LessonSection>

      <LessonSection number={3} title={L.calcTitle[locale]}>
        <p>{L.calcContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Step-by-Step Calculation:' : 'चरणबद्ध गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {locale === 'en' ? 'Find Moon\'s Nakshatra at birth (e.g., Pushya)' : 'जन्म के समय चन्द्र का नक्षत्र ज्ञात करें (जैसे, पुष्य)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {locale === 'en' ? 'Nakshatra lord = Dasha lord at birth (Pushya lord = Saturn)' : 'नक्षत्र स्वामी = जन्म पर दशा स्वामी (पुष्य स्वामी = शनि)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {locale === 'en' ? 'Moon\'s progress through Nakshatra = elapsed portion of Dasha' : 'नक्षत्र में चन्द्र की प्रगति = दशा का बीता हुआ भाग'}</p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">
            {locale === 'en' ? 'Example: Moon at 10° in Pushya (3°20\' to 16°40\')' : 'उदाहरण: पुष्य में चन्द्र 10° पर (3°20\' से 16°40\')'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' ? 'Progress = (10° - 3.333°) / 13.333° = 50%' : 'प्रगति = (10° - 3.333°) / 13.333° = 50%'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' ? 'Remaining Saturn Dasha = 19 × (1 - 0.50) = 9.5 years' : 'शेष शनि दशा = 19 × (1 - 0.50) = 9.5 वर्ष'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={4} title={L.subTitle[locale]}>
        <p>{L.subContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Antardasha Duration Formula:' : 'अन्तर्दशा अवधि सूत्र:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Antardasha of B in Maha Dasha of A = (Years_A × Years_B) / 120
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Example: Mercury Antardasha in Saturn Maha Dasha = (19 × 17) / 120 = 2.69 years ≈ 2 yrs 8 months 9 days'
              : 'उदाहरण: शनि महादशा में बुध अन्तर्दशा = (19 × 17) / 120 = 2.69 वर्ष ≈ 2 वर्ष 8 माह 9 दिन'}
          </p>
        </div>
      </LessonSection>

      <LessonSection number={5} title={L.interpretTitle[locale]} variant="highlight">
        <p>{L.interpretContent[locale]}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: { en: 'Benefic Dasha Lord in Kendra/Trikona', hi: 'शुभ दशा स्वामी केन्द्र/त्रिकोण में', sa: 'शुभदशास्वामी केन्द्रे/त्रिकोणे' }, result: { en: 'Prosperity, success, good health', hi: 'समृद्धि, सफलता, अच्छा स्वास्थ्य', sa: 'समृद्धिः, सफलता, सुस्वास्थ्यम्' }, color: 'emerald' },
            { label: { en: 'Dasha Lord in Dusthana (6,8,12)', hi: 'दशा स्वामी दुःस्थान (6,8,12) में', sa: 'दशास्वामी दुःस्थाने (6,8,12)' }, result: { en: 'Challenges, health issues, obstacles', hi: 'कठिनाइयाँ, स्वास्थ्य समस्याएँ, बाधाएँ', sa: 'कठिनतायाः, स्वास्थ्यसमस्याः, बाधाः' }, color: 'red' },
            { label: { en: 'Dasha Lord exalted or in own sign', hi: 'दशा स्वामी उच्च या स्वराशि में', sa: 'दशास्वामी उच्चे स्वराशौ वा' }, result: { en: 'Enhanced positive results', hi: 'उन्नत शुभ परिणाम', sa: 'उन्नतशुभफलानि' }, color: 'emerald' },
            { label: { en: 'Dasha Lord debilitated or combust', hi: 'दशा स्वामी नीच या अस्त', sa: 'दशास्वामी नीचे अस्ते वा' }, result: { en: 'Weakened results, delays', hi: 'कमज़ोर परिणाम, देरी', sa: 'दुर्बलफलानि, विलम्बः' }, color: 'amber' },
          ].map((item) => (
            <div key={item.label.en} className={`rounded-lg p-3 border border-${item.color}-400/20 bg-${item.color}-400/5`}>
              <div className={`text-${item.color}-400 text-sm font-semibold mb-1`}>{item.label[locale]}</div>
              <div className="text-text-secondary text-xs">{item.result[locale]}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]}
        </Link>
      </div>
    </div>
  );
}

'use client';


import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/advanced.json';

const TOOLS_GRID = [
  { name: { en: 'Varshaphal', hi: 'वर्षफल', sa: 'वर्षफलम्' }, link: '/varshaphal', desc: { en: 'Annual predictions from solar return', hi: 'सौर प्रत्यावर्तन से वार्षिक भविष्यवाणी', sa: 'सौरप्रत्यावर्तनात् वार्षिकभविष्यवाणी' }, color: '#f59e0b' },
  { name: { en: 'KP System', hi: 'KP प्रणाली', sa: 'KP पद्धतिः' }, link: '/kp-system', desc: { en: 'Sub-lord based precise analysis', hi: 'उप-स्वामी आधारित सटीक विश्लेषण', sa: 'उपस्वामिआधारितसूक्ष्मविश्लेषणम्' }, color: '#3b82f6' },
  { name: { en: 'Prashna', hi: 'प्रश्न', sa: 'प्रश्नः' }, link: '/prashna', desc: { en: 'Horary chart for specific questions', hi: 'विशिष्ट प्रश्नों के लिए होररी कुण्डली', sa: 'विशिष्टप्रश्नानां होररीकुण्डली' }, color: '#8b5cf6' },
  { name: { en: 'Ashtamangala', hi: 'अष्टमंगल', sa: 'अष्टमङ्गलम्' }, link: '/prashna-ashtamangala', desc: { en: 'Kerala divination tradition', hi: 'केरल भविष्यवाणी परम्परा', sa: 'केरलभविष्यवाणीपरम्परा' }, color: '#ec4899' },
  { name: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्त AI' }, link: '/muhurta-ai', desc: { en: 'AI-scored auspicious time finder', hi: 'AI-अंकित शुभ समय खोजक', sa: 'AI-अङ्कितशुभसमयान्वेषकः' }, color: '#22c55e' },
  { name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढेसाती' }, link: '/sade-sati', desc: { en: 'Saturn transit analysis', hi: 'शनि गोचर विश्लेषण', sa: 'शनिगोचरविश्लेषणम्' }, color: '#6366f1' },
];

const MODULE_LINKS = [
  { label: { en: 'Module 15-3: Shadbala Deep Dive', hi: 'मॉड्यूल 15-3: षड्बल विस्तार', sa: 'मॉड्यूल 15-3: षड्बलविस्तारः' }, href: '/learn/modules/15-3' },
  { label: { en: 'Module 15-4: Ashtakavarga Deep Dive', hi: 'मॉड्यूल 15-4: अष्टकवर्ग विस्तार', sa: 'मॉड्यूल 15-4: अष्टकवर्गविस्तारः' }, href: '/learn/modules/15-4' },
];

export default function LearnAdvancedPage() {
  const locale = useLocale();
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Varshaphal" devanagari="वर्षफल" transliteration="Varṣaphala" meaning="Annual result" />
        <SanskritTermCard term="Tajika" devanagari="ताजिक" transliteration="Tājika" meaning="Annual horoscopy system" />
        <SanskritTermCard term="Prashna" devanagari="प्रश्न" transliteration="Praśna" meaning="Question / Horary" />
        <SanskritTermCard term="Muhurta" devanagari="मुहूर्त" transliteration="Muhūrta" meaning="Auspicious moment" />
        <SanskritTermCard term="Shadbala" devanagari="षड्बल" transliteration="Ṣaḍbala" meaning="Six strengths" />
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Aṣṭakavarga" meaning="Eight-source points" />
      </div>

      {/* 1. Varshaphal */}
      <LessonSection number={1} title={t('varshaphalTitle')}>
        <p>{t('varshaphalContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'How our Varshaphal engine works:', hi: 'हमारा वर्षफल इंजन कैसे काम करता है:', sa: 'हमारा वर्षफल इंजन कैसे काम करता है:', ta: 'How our Varshaphal engine works:', te: 'How our Varshaphal engine works:', bn: 'How our Varshaphal engine works:', kn: 'How our Varshaphal engine works:', gu: 'How our Varshaphal engine works:', mai: 'हमारा वर्षफल इंजन कैसे काम करता है:', mr: 'हमारा वर्षफल इंजन कैसे काम करता है:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {tl({ en: 'Find exact JD when Sun returns to birth longitude (binary search)', hi: 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)', sa: 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)', ta: 'Find exact JD when Sun returns to birth longitude (binary search)', te: 'Find exact JD when Sun returns to birth longitude (binary search)', bn: 'Find exact JD when Sun returns to birth longitude (binary search)', kn: 'Find exact JD when Sun returns to birth longitude (binary search)', gu: 'Find exact JD when Sun returns to birth longitude (binary search)', mai: 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)', mr: 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {tl({ en: 'Compute full chart for that moment (all 9 planets + houses)', hi: 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)', sa: 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)', ta: 'Compute full chart for that moment (all 9 planets + houses)', te: 'Compute full chart for that moment (all 9 planets + houses)', bn: 'Compute full chart for that moment (all 9 planets + houses)', kn: 'Compute full chart for that moment (all 9 planets + houses)', gu: 'Compute full chart for that moment (all 9 planets + houses)', mai: 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)', mr: 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {tl({ en: 'Muntha = (Birth Lagna sign + age) mod 12', hi: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12', sa: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12', ta: 'Muntha = (Birth Lagna sign + age) mod 12', te: 'Muntha = (Birth Lagna sign + age) mod 12', bn: 'Muntha = (Birth Lagna sign + age) mod 12', kn: 'Muntha = (Birth Lagna sign + age) mod 12', gu: 'Muntha = (Birth Lagna sign + age) mod 12', mai: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12', mr: 'मुन्था = (जन्म लग्न राशि + आयु) mod 12' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {tl({ en: 'Calculate 16 Sahams (sensitive points for life areas)', hi: '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)', sa: '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)', ta: 'Calculate 16 Sahams (sensitive points for life areas)', te: 'Calculate 16 Sahams (sensitive points for life areas)', bn: 'Calculate 16 Sahams (sensitive points for life areas)', kn: 'Calculate 16 Sahams (sensitive points for life areas)', gu: 'Calculate 16 Sahams (sensitive points for life areas)', mai: '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)', mr: '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {tl({ en: 'Generate Mudda Dasha (year-compressed planetary periods)', hi: 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)', sa: 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)', ta: 'Generate Mudda Dasha (year-compressed planetary periods)', te: 'Generate Mudda Dasha (year-compressed planetary periods)', bn: 'Generate Mudda Dasha (year-compressed planetary periods)', kn: 'Generate Mudda Dasha (year-compressed planetary periods)', gu: 'Generate Mudda Dasha (year-compressed planetary periods)', mai: 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)', mr: 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {tl({ en: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', hi: 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)', sa: 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)', ta: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', te: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', bn: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', kn: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', gu: 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)', mai: 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)', mr: 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)' }, locale)}</p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{t('varshaphalCalc')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {tl({ en: 'Tajika Yogas — Unique to Varshaphal:', hi: 'ताजिक योग — वर्षफल के लिए विशिष्ट:', sa: 'ताजिक योग — वर्षफल के लिए विशिष्ट:', ta: 'Tajika Yogas — Unique to Varshaphal:', te: 'Tajika Yogas — Unique to Varshaphal:', bn: 'Tajika Yogas — Unique to Varshaphal:', kn: 'Tajika Yogas — Unique to Varshaphal:', gu: 'Tajika Yogas — Unique to Varshaphal:', mai: 'ताजिक योग — वर्षफल के लिए विशिष्ट:', mr: 'ताजिक योग — वर्षफल के लिए विशिष्ट:' }, locale)}
          </p>
          <p className="text-amber-200/80 text-xs leading-relaxed">{t('tajikaYogas')}</p>
        </div>
      </LessonSection>

      {/* 2. KP System */}
      <LessonSection number={2} title={t('kpTitle')}>
        <p>{t('kpContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'KP Sub-Lord Division Example:', hi: 'KP उप-स्वामी विभाजन उदाहरण:', sa: 'KP उप-स्वामी विभाजन उदाहरण:', ta: 'KP Sub-Lord Division Example:', te: 'KP Sub-Lord Division Example:', bn: 'KP Sub-Lord Division Example:', kn: 'KP Sub-Lord Division Example:', gu: 'KP Sub-Lord Division Example:', mai: 'KP उप-स्वामी विभाजन उदाहरण:', mr: 'KP उप-स्वामी विभाजन उदाहरण:' }, locale)}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {tl({ en: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, hi: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, sa: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, ta: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, te: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, bn: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, kn: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, gu: `Ashwini Nakshatra (0°00' — 13°20' Aries):`, mai: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):`, mr: `अश्विनी नक्षत्र (0°00' — 13°20' मेष):` }, locale)}
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Star Lord: Ketu (7 years)</p>
          <p className="text-gold-light/60 font-mono text-xs">Sub-divisions (proportional to Dasha years):</p>
          <p className="text-gold-light/60 font-mono text-xs">  Ke-Ke: 0°00&apos;-0°46&apos;40&quot; | Ke-Ve: 0°46&apos;40&quot;-2°53&apos;20&quot; | ...</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Each planet at a specific degree has: Sign lord + Star lord + Sub-lord'
              : 'प्रत्येक विशिष्ट अंश पर ग्रह का: राशि स्वामी + नक्षत्र स्वामी + उप-स्वामी'}
          </p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{t('kpCalc')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-blue-400/15">
          <p className="text-blue-300 font-mono text-sm mb-2">
            {tl({ en: 'The Significator Table — Heart of KP:', hi: 'कारक तालिका — KP का हृदय:', sa: 'कारक तालिका — KP का हृदय:', ta: 'The Significator Table — Heart of KP:', te: 'The Significator Table — Heart of KP:', bn: 'The Significator Table — Heart of KP:', kn: 'The Significator Table — Heart of KP:', gu: 'The Significator Table — Heart of KP:', mai: 'कारक तालिका — KP का हृदय:', mr: 'कारक तालिका — KP का हृदय:' }, locale)}
          </p>
          <p className="text-blue-200/80 text-xs leading-relaxed">{t('kpSignificator')}</p>
        </div>
      </LessonSection>

      {/* 3. Prashna */}
      <LessonSection number={3} title={t('prashnaTitle')}>
        <p>{t('prashnaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-purple-400/20">
          <p className="text-purple-300 font-mono text-sm mb-2">
            {tl({ en: 'Ashtamangala Prashna — Kerala Tradition:', hi: 'अष्टमंगल प्रश्न — केरल परम्परा:', sa: 'अष्टमंगल प्रश्न — केरल परम्परा:', ta: 'Ashtamangala Prashna — Kerala Tradition:', te: 'Ashtamangala Prashna — Kerala Tradition:', bn: 'Ashtamangala Prashna — Kerala Tradition:', kn: 'Ashtamangala Prashna — Kerala Tradition:', gu: 'Ashtamangala Prashna — Kerala Tradition:', mai: 'अष्टमंगल प्रश्न — केरल परम्परा:', mr: 'अष्टमंगल प्रश्न — केरल परम्परा:' }, locale)}
          </p>
          <p className="text-purple-200/80 font-mono text-xs">{t('ashtamangalaContent')}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { item: tl({ en: 'Mirror', hi: 'दर्पण', sa: 'दर्पण', ta: 'Mirror', te: 'Mirror', bn: 'Mirror', kn: 'Mirror', gu: 'Mirror', mai: 'दर्पण', mr: 'दर्पण' }, locale), meaning: tl({ en: 'Self-reflection, clarity', hi: 'आत्मचिन्तन, स्पष्टता', sa: 'आत्मचिन्तन, स्पष्टता', ta: 'Self-reflection, clarity', te: 'Self-reflection, clarity', bn: 'Self-reflection, clarity', kn: 'Self-reflection, clarity', gu: 'Self-reflection, clarity', mai: 'आत्मचिन्तन, स्पष्टता', mr: 'आत्मचिन्तन, स्पष्टता' }, locale) },
            { item: tl({ en: 'Vessel', hi: 'कलश', sa: 'कलश', ta: 'Vessel', te: 'Vessel', bn: 'Vessel', kn: 'Vessel', gu: 'Vessel', mai: 'कलश', mr: 'कलश' }, locale), meaning: tl({ en: 'Abundance, containment', hi: 'प्रचुरता, धारण', sa: 'प्रचुरता, धारण', ta: 'Abundance, containment', te: 'Abundance, containment', bn: 'Abundance, containment', kn: 'Abundance, containment', gu: 'Abundance, containment', mai: 'प्रचुरता, धारण', mr: 'प्रचुरता, धारण' }, locale) },
            { item: tl({ en: 'Gold Fish', hi: 'स्वर्णमीन', sa: 'स्वर्णमीन', ta: 'Gold Fish', te: 'Gold Fish', bn: 'Gold Fish', kn: 'Gold Fish', gu: 'Gold Fish', mai: 'स्वर्णमीन', mr: 'स्वर्णमीन' }, locale), meaning: tl({ en: 'Prosperity, fertility', hi: 'समृद्धि, उर्वरता', sa: 'समृद्धि, उर्वरता', ta: 'Prosperity, fertility', te: 'Prosperity, fertility', bn: 'Prosperity, fertility', kn: 'Prosperity, fertility', gu: 'Prosperity, fertility', mai: 'समृद्धि, उर्वरता', mr: 'समृद्धि, उर्वरता' }, locale) },
            { item: tl({ en: 'Lamp', hi: 'दीप', sa: 'दीप', ta: 'Lamp', te: 'Lamp', bn: 'Lamp', kn: 'Lamp', gu: 'Lamp', mai: 'दीप', mr: 'दीप' }, locale), meaning: tl({ en: 'Wisdom, dispelling darkness', hi: 'ज्ञान, अन्धकार निवारण', sa: 'ज्ञान, अन्धकार निवारण', ta: 'Wisdom, dispelling darkness', te: 'Wisdom, dispelling darkness', bn: 'Wisdom, dispelling darkness', kn: 'Wisdom, dispelling darkness', gu: 'Wisdom, dispelling darkness', mai: 'ज्ञान, अन्धकार निवारण', mr: 'ज्ञान, अन्धकार निवारण' }, locale) },
            { item: tl({ en: 'Throne', hi: 'सिंहासन', sa: 'सिंहासन', ta: 'Throne', te: 'Throne', bn: 'Throne', kn: 'Throne', gu: 'Throne', mai: 'सिंहासन', mr: 'सिंहासन' }, locale), meaning: tl({ en: 'Authority, power', hi: 'अधिकार, शक्ति', sa: 'अधिकार, शक्ति', ta: 'Authority, power', te: 'Authority, power', bn: 'Authority, power', kn: 'Authority, power', gu: 'Authority, power', mai: 'अधिकार, शक्ति', mr: 'अधिकार, शक्ति' }, locale) },
            { item: tl({ en: 'Bull', hi: 'वृषभ', sa: 'वृषभ', ta: 'Bull', te: 'Bull', bn: 'Bull', kn: 'Bull', gu: 'Bull', mai: 'वृषभ', mr: 'वृषभ' }, locale), meaning: tl({ en: 'Strength, dharma', hi: 'बल, धर्म', sa: 'बल, धर्म', ta: 'Strength, dharma', te: 'Strength, dharma', bn: 'Strength, dharma', kn: 'Strength, dharma', gu: 'Strength, dharma', mai: 'बल, धर्म', mr: 'बल, धर्म' }, locale) },
            { item: tl({ en: 'Flag', hi: 'ध्वज', sa: 'ध्वज', ta: 'Flag', te: 'Flag', bn: 'Flag', kn: 'Flag', gu: 'Flag', mai: 'ध्वज', mr: 'ध्वज' }, locale), meaning: tl({ en: 'Victory, announcement', hi: 'विजय, घोषणा', sa: 'विजय, घोषणा', ta: 'Victory, announcement', te: 'Victory, announcement', bn: 'Victory, announcement', kn: 'Victory, announcement', gu: 'Victory, announcement', mai: 'विजय, घोषणा', mr: 'विजय, घोषणा' }, locale) },
            { item: tl({ en: 'Fan', hi: 'व्यजन', sa: 'व्यजन', ta: 'Fan', te: 'Fan', bn: 'Fan', kn: 'Fan', gu: 'Fan', mai: 'व्यजन', mr: 'व्यजन' }, locale), meaning: tl({ en: 'Royal service, comfort', hi: 'राजसेवा, सुविधा', sa: 'राजसेवा, सुविधा', ta: 'Royal service, comfort', te: 'Royal service, comfort', bn: 'Royal service, comfort', kn: 'Royal service, comfort', gu: 'Royal service, comfort', mai: 'राजसेवा, सुविधा', mr: 'राजसेवा, सुविधा' }, locale) },
          ].map((a) => (
            <div key={a.item} className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-purple-400/10">
              <p className="text-purple-300 font-bold text-sm">{a.item}</p>
              <p className="text-text-secondary text-xs mt-1">{a.meaning}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* 4. Muhurta AI */}
      <LessonSection number={4} title={t('muhurtaTitle')}>
        <p>{t('muhurtaContent')}</p>
        <p className="mt-3 text-text-secondary text-sm">{t('muhurtaFactors')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-emerald-400/20">
          <p className="text-emerald-300 font-mono text-sm mb-2">
            {tl({ en: 'Multi-Factor Scoring Example (Marriage):', hi: 'बहु-कारक अंकन उदाहरण (विवाह):', sa: 'बहु-कारक अंकन उदाहरण (विवाह):', ta: 'Multi-Factor Scoring Example (Marriage):', te: 'Multi-Factor Scoring Example (Marriage):', bn: 'Multi-Factor Scoring Example (Marriage):', kn: 'Multi-Factor Scoring Example (Marriage):', gu: 'Multi-Factor Scoring Example (Marriage):', mai: 'बहु-कारक अंकन उदाहरण (विवाह):', mr: 'बहु-कारक अंकन उदाहरण (विवाह):' }, locale)}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Tithi: Dwithiya, Thrithiya, Panchami, Saptami, Dashami → High score'
              : 'तिथि: द्वितीया, तृतीया, पंचमी, सप्तमी, दशमी → उच्च अंक'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Nakshatra: Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta → Excellent'
              : 'नक्षत्र: रोहिणी, मृगशिरा, मघा, उत्तर फाल्गुनी, हस्त → उत्तम'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Must avoid: Rahu Kaal, Varjyam, eclipses, retrograde Venus'
              : 'बचना चाहिए: राहु काल, वर्ज्यम, ग्रहण, वक्री शुक्र'}
          </p>
          <p className="text-emerald-200/80 font-mono text-xs">
            {locale === 'en'
              ? 'Score = Σ(weight_i × factor_i) / max_possible → 0-100%'
              : 'अंक = Σ(भार_i × कारक_i) / अधिकतम_सम्भव → 0-100%'}
          </p>
        </div>
      </LessonSection>

      {/* 5. Shadbala */}
      <LessonSection number={5} title={t('shadbalaTitle')}>
        <p>{t('shadbalaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'The Six Components:', hi: 'छह घटक:', sa: 'छह घटक:', ta: 'The Six Components:', te: 'The Six Components:', bn: 'The Six Components:', kn: 'The Six Components:', gu: 'The Six Components:', mai: 'छह घटक:', mr: 'छह घटक:' }, locale)}
          </p>
          <p className="text-gold-light/80 text-xs leading-relaxed">{t('shadbalaComponents')}</p>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {tl({ en: 'Minimum Shadbala Thresholds (in Rupas):', hi: 'न्यूनतम षड्बल सीमा (रूपों में):', sa: 'न्यूनतम षड्बल सीमा (रूपों में):', ta: 'Minimum Shadbala Thresholds (in Rupas):', te: 'Minimum Shadbala Thresholds (in Rupas):', bn: 'Minimum Shadbala Thresholds (in Rupas):', kn: 'Minimum Shadbala Thresholds (in Rupas):', gu: 'Minimum Shadbala Thresholds (in Rupas):', mai: 'न्यूनतम षड्बल सीमा (रूपों में):', mr: 'न्यूनतम षड्बल सीमा (रूपों में):' }, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { planet: tl({ en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun', mai: 'सूर्य', mr: 'सूर्य' }, locale), threshold: '6.5' },
              { planet: tl({ en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon', mai: 'चन्द्र', mr: 'चन्द्र' }, locale), threshold: '6.0' },
              { planet: tl({ en: 'Mars', hi: 'मंगल', sa: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars', mai: 'मंगल', mr: 'मंगल' }, locale), threshold: '5.0' },
              { planet: tl({ en: 'Mercury', hi: 'बुध', sa: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury', mai: 'बुध', mr: 'बुध' }, locale), threshold: '7.0' },
              { planet: tl({ en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter', mai: 'गुरु', mr: 'गुरु' }, locale), threshold: '6.5' },
              { planet: tl({ en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus', mai: 'शुक्र', mr: 'शुक्र' }, locale), threshold: '5.5' },
              { planet: tl({ en: 'Saturn', hi: 'शनि', sa: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn', mai: 'शनि', mr: 'शनि' }, locale), threshold: '5.0' },
            ].map((p) => (
              <div key={p.planet} className="flex justify-between text-text-secondary">
                <span>{p.planet}</span>
                <span className="text-gold-light font-mono">{p.threshold}</span>
              </div>
            ))}
          </div>
          <p className="text-amber-200/50 text-xs mt-2">
            {locale === 'en'
              ? 'Planets exceeding their threshold can deliver their promises. Below = weak results.'
              : 'सीमा पार करने वाले ग्रह अपने वादे पूरे कर सकते हैं। नीचे = कमज़ोर परिणाम।'}
          </p>
        </div>
      </LessonSection>

      {/* 6. Ashtakavarga */}
      <LessonSection number={6} title={t('ashtakavargaTitle')}>
        <p>{t('ashtakavargaContent')}</p>
        <p className="mt-3 text-text-secondary text-sm">{t('ashtakavargaUse')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-cyan-400/15">
          <p className="text-cyan-300 font-mono text-sm mb-2">
            {tl({ en: 'Sarvashtakavarga Score Interpretation:', hi: 'सर्वाष्टकवर्ग अंक व्याख्या:', sa: 'सर्वाष्टकवर्ग अंक व्याख्या:', ta: 'Sarvashtakavarga Score Interpretation:', te: 'Sarvashtakavarga Score Interpretation:', bn: 'Sarvashtakavarga Score Interpretation:', kn: 'Sarvashtakavarga Score Interpretation:', gu: 'Sarvashtakavarga Score Interpretation:', mai: 'सर्वाष्टकवर्ग अंक व्याख्या:', mr: 'सर्वाष्टकवर्ग अंक व्याख्या:' }, locale)}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-emerald-300 font-mono">30-56 {tl({ en: 'Bindus: Strong sign — favorable transits, strong house', hi: 'बिन्दु: प्रबल राशि — अनुकूल गोचर', sa: 'बिन्दु: प्रबल राशि — अनुकूल गोचर', ta: 'Bindus: Strong sign — favorable transits, strong house', te: 'Bindus: Strong sign — favorable transits, strong house', bn: 'Bindus: Strong sign — favorable transits, strong house', kn: 'Bindus: Strong sign — favorable transits, strong house', gu: 'Bindus: Strong sign — favorable transits, strong house', mai: 'बिन्दु: प्रबल राशि — अनुकूल गोचर', mr: 'बिन्दु: प्रबल राशि — अनुकूल गोचर' }, locale)}</p>
            <p className="text-amber-300 font-mono">25-29 {tl({ en: 'Bindus: Average — mixed results during transits', hi: 'बिन्दु: सामान्य — मिश्रित परिणाम', sa: 'बिन्दु: सामान्य — मिश्रित परिणाम', ta: 'Bindus: Average — mixed results during transits', te: 'Bindus: Average — mixed results during transits', bn: 'Bindus: Average — mixed results during transits', kn: 'Bindus: Average — mixed results during transits', gu: 'Bindus: Average — mixed results during transits', mai: 'बिन्दु: सामान्य — मिश्रित परिणाम', mr: 'बिन्दु: सामान्य — मिश्रित परिणाम' }, locale)}</p>
            <p className="text-red-300 font-mono">0-24  {tl({ en: 'Bindus: Weak sign — challenging transits, weak house', hi: 'बिन्दु: दुर्बल राशि — कठिन गोचर', sa: 'बिन्दु: दुर्बल राशि — कठिन गोचर', ta: 'Bindus: Weak sign — challenging transits, weak house', te: 'Bindus: Weak sign — challenging transits, weak house', bn: 'Bindus: Weak sign — challenging transits, weak house', kn: 'Bindus: Weak sign — challenging transits, weak house', gu: 'Bindus: Weak sign — challenging transits, weak house', mai: 'बिन्दु: दुर्बल राशि — कठिन गोचर', mr: 'बिन्दु: दुर्बल राशि — कठिन गोचर' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* 7. Putting It Together */}
      <LessonSection number={7} title={t('practiceTitle')} variant="highlight">
        <p>{t('practiceContent')}</p>

        <div className="mt-4 mb-6">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {tl({ en: 'Related Learn Modules', hi: 'सम्बन्धित शिक्षा मॉड्यूल', sa: 'सम्बन्धित शिक्षा मॉड्यूल', ta: 'Related Learn Modules', te: 'Related Learn Modules', bn: 'Related Learn Modules', kn: 'Related Learn Modules', gu: 'Related Learn Modules', mai: 'सम्बन्धित शिक्षा मॉड्यूल', mr: 'सम्बन्धित शिक्षा मॉड्यूल' }, locale)}
          </h4>
          <div className="flex flex-wrap gap-2">
            {MODULE_LINKS.map((ml) => (
              <Link
                key={ml.href}
                href={ml.href}
                className="inline-block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg px-3 py-2 border border-blue-500/15 hover:border-blue-500/30 transition-colors text-xs text-blue-300"
              >
                {lt(ml.label as LocaleText, locale)}
              </Link>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {TOOLS_GRID.map((tool, i) => (
            <motion.div
              key={tool.name.en}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={tool.link}
                className="block bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-all"
              >
                <div className="text-sm font-semibold mb-1" style={{ color: tool.color }}>{lt(tool.name as LocaleText, locale)}</div>
                <p className="text-text-secondary text-xs">{lt(tool.desc as LocaleText, locale)}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </LessonSection>
    </div>
  );
}

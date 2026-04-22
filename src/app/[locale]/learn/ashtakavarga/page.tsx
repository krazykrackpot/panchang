'use client';

import { tl } from '@/lib/utils/trilingual';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/ashtakavarga.json';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';


const SIGNS_SHORT = [
  { en: 'Ari', hi: 'मे', sa: 'मे', mai: 'मे', mr: 'मे', ta: 'மே', te: 'మే', bn: 'মে', kn: 'ಮೇ', gu: 'મે' }, { en: 'Tau', hi: 'वृ', sa: 'वृ', mai: 'वृ', mr: 'वृ', ta: 'ரி', te: 'వృ', bn: 'বৃ', kn: 'ವೃ', gu: 'વૃ' }, { en: 'Gem', hi: 'मि', sa: 'मि', mai: 'मि', mr: 'मि', ta: 'மி', te: 'మి', bn: 'মি', kn: 'ಮಿ', gu: 'મિ' },
  { en: 'Can', hi: 'क', sa: 'क', mai: 'क', mr: 'क', ta: 'க', te: 'క', bn: 'ক', kn: 'ಕ', gu: 'ક' }, { en: 'Leo', hi: 'सिं', sa: 'सिं', mai: 'सिं', mr: 'सिं', ta: 'சிं', te: 'సిం', bn: 'সিং', kn: 'ಸಿಂ', gu: 'સિં' }, { en: 'Vir', hi: 'कन्', sa: 'कन्', mai: 'कन्', mr: 'कन्', ta: 'கன்', te: 'కన్', bn: 'কন্', kn: 'ಕನ್', gu: 'કન્' },
  { en: 'Lib', hi: 'तु', sa: 'तु', mai: 'तु', mr: 'तु', ta: 'து', te: 'తు', bn: 'তু', kn: 'ತು', gu: 'તુ' }, { en: 'Sco', hi: 'वृश्', sa: 'वृश्', mai: 'वृश्', mr: 'वृश्', ta: 'விரு', te: 'వృశ్', bn: 'বৃশ্', kn: 'ವೃಶ್', gu: 'વૃશ્' }, { en: 'Sag', hi: 'ध', sa: 'ध', mai: 'ध', mr: 'ध', ta: 'த', te: 'ధ', bn: 'ধ', kn: 'ಧ', gu: 'ધ' },
  { en: 'Cap', hi: 'म', sa: 'म', mai: 'म', mr: 'म', ta: 'ம', te: 'మ', bn: 'ম', kn: 'ಮ', gu: 'મ' }, { en: 'Aqu', hi: 'कुं', sa: 'कुं', mai: 'कुं', mr: 'कुं', ta: 'கும்', te: 'కుం', bn: 'কুম্', kn: 'ಕುಂ', gu: 'કુం' }, { en: 'Pis', hi: 'मी', sa: 'मी', mai: 'मी', mr: 'मी', ta: 'மீ', te: 'మీ', bn: 'মী', kn: 'ಮೀ', gu: 'મી' },
];

const EXAMPLE_BAV = {
  planet: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' },
  color: '#3b82f6',
  scores: [3, 2, 4, 5, 3, 6, 5, 1, 4, 6, 3, 7],
  total: 49,
};

const SAV_EXAMPLE = [30, 24, 29, 32, 26, 35, 31, 22, 28, 33, 27, 20];

const SCORE_MEANINGS = [
  { range: '0-1', en: 'Very difficult transit. Significant obstacles, health concerns, or losses in that planet\'s significations.', hi: 'अत्यन्त कठिन गोचर। उस ग्रह के संकेतों में महत्वपूर्ण बाधाएँ, स्वास्थ्य चिन्ताएँ, या हानि।', sa: 'अत्यन्तकठिनगोचरः। बाधाः, स्वास्थ्यचिन्ताः, हानिश्च।', color: 'text-red-400' },
  { range: '2-3', en: 'Below average. Some challenges; results come with effort and delay. Mixed outcomes.', hi: 'औसत से नीचे। कुछ कठिनाइयाँ; परिणाम प्रयास और देरी से आते हैं।', sa: 'औसतात् न्यूनम्। किञ्चित् कठिनतायाः; फलानि प्रयत्नेन विलम्बेन च।', color: 'text-amber-400' },
  { range: '4', en: 'Neutral/threshold. Average transit, neither strongly positive nor negative.', hi: 'तटस्थ/सीमा। औसत गोचर, न तो प्रबल सकारात्मक न नकारात्मक।', sa: 'तटस्थम्/सीमा। औसतगोचरः।', color: 'text-text-secondary' },
  { range: '5-6', en: 'Good transit. Favourable results, opportunities, smooth progress in that planet\'s areas.', hi: 'अच्छा गोचर। अनुकूल परिणाम, अवसर, उस ग्रह के क्षेत्रों में सुचारू प्रगति।', sa: 'शुभगोचरः। अनुकूलफलानि, अवसराः, सुचारुप्रगतिः।', color: 'text-emerald-400' },
  { range: '7-8', en: 'Excellent transit. Strong positive results, major gains, peak performance in that area.', hi: 'उत्कृष्ट गोचर। प्रबल सकारात्मक परिणाम, प्रमुख लाभ, उस क्षेत्र में शिखर प्रदर्शन।', sa: 'उत्कृष्टगोचरः। प्रबलशुभफलानि, प्रमुखलाभाः।', color: 'text-emerald-300 font-bold' },
];

export default function LearnAshtakavargaPage() {
  const locale = useLocale() as Locale;
  const isHi = isDevanagariLocale(locale);
  const t = (key: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {t('title')}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{t('subtitle')}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Ashtakavarga" devanagari="अष्टकवर्ग" transliteration="Ashtakavarga" meaning="Eight-fold division" />
        <SanskritTermCard term="Bindu" devanagari="बिन्दु" transliteration="Bindu" meaning="Point (benefic dot)" />
        <SanskritTermCard term="Bhinna" devanagari="भिन्न" transliteration="Bhinna" meaning="Individual / separate" />
        <SanskritTermCard term="Sarva" devanagari="सर्व" transliteration="Sarva" meaning="Combined / all" />
        <SanskritTermCard term="Shodhana" devanagari="शोधन" transliteration="Shodhana" meaning="Reduction / purification" />
      </div>

      {/* Section 1: What is Ashtakavarga */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p style={bodyFont}>{t('whatContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent2')}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent3')}</p>

        {/* 8 sources visual */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, color: '#f59e0b' },
            { name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, color: '#e2e8f0' },
            { name: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, color: '#ef4444' },
            { name: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, color: '#22c55e' },
            { name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'குரு', te: 'గురుడు', bn: 'গুরু', kn: 'ಗುರು', gu: 'ગુરુ' }, color: '#f0d48a' },
            { name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, color: '#ec4899' },
            { name: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, color: '#3b82f6' },
            { name: { en: 'Lagna', hi: 'लग्न', sa: 'लग्न', mai: 'लग्न', mr: 'लग्न', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન' }, color: '#a855f7' },
          ].map((src, i) => (
            <motion.div
              key={src.name.en}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="rounded-lg p-2 border border-gold-primary/10 bg-bg-primary/50 text-center"
            >
              <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1" style={{ backgroundColor: src.color }} />
              <span className="text-xs font-medium" style={{ color: src.color }}>
                {isHi ? src.name.hi : src.name.en}
              </span>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 2: How to Read the Table */}
      <LessonSection number={2} title={t('readTitle')}>
        <p style={bodyFont}>{t('readContent')}</p>

        {/* Example BAV table */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {tl({ en: 'Example: Saturn BAV', hi: 'उदाहरण: शनि BAV', sa: 'उदाहरणम्: शनि-BAV' }, locale)}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">{tl({ en: 'Planet', hi: 'ग्रह', sa: 'ग्रहः' }, locale)}</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">{isHi ? s.hi : s.en}</th>
                ))}
                <th className="text-center py-2 px-1 text-gold-dark">{tl({ en: 'Total', hi: 'योग', sa: 'योगः' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 font-medium" style={{ color: EXAMPLE_BAV.color }}>
                  {isHi ? EXAMPLE_BAV.planet.hi : EXAMPLE_BAV.planet.en}
                </td>
                {EXAMPLE_BAV.scores.map((score, i) => (
                  <td key={i} className={`text-center py-2 px-1 font-mono ${score >= 4 ? 'text-emerald-400' : score <= 2 ? 'text-red-400' : 'text-amber-400'}`}>
                    {score}
                  </td>
                ))}
                <td className="text-center py-2 px-1 font-mono text-text-secondary">{EXAMPLE_BAV.total}</td>
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs">
            {tl({ en: 'Green = 4+ (favourable) | Yellow = 3 (mixed) | Red = 0-2 (challenging)', hi: 'हरा = 4+ (शुभ) | पीला = 3 (मध्यम) | लाल = 0-2 (कठिन)', sa: 'हरितः = 4+ (अनुकूलः) | पीतः = 3 (मिश्रितः) | रक्तः = 0-2 (कठिनः)' }, locale)}
          </p>
        </div>

        {/* Score meanings */}
        <div className="mt-4">
          <p className="text-gold-light text-sm font-semibold mb-2" style={headingFont}>
            {tl({ en: 'Bindu Score Meanings', hi: 'बिन्दु स्कोर अर्थ', sa: 'बिन्दु-अङ्क-अर्थाः' }, locale)}
          </p>
          <div className="space-y-2">
            {SCORE_MEANINGS.map((sm) => (
              <div key={sm.range} className="flex gap-3 items-start">
                <div className={`w-12 flex-shrink-0 text-right text-xs font-mono ${sm.color}`}>{sm.range}</div>
                <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                  {!isDevanagariLocale(locale) ? sm.en : isHi ? sm.hi : sm.sa}
                </div>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* Section 2b: Threshold */}
      <LessonSection number={3} title={t('thresholdTitle')}>
        <p style={bodyFont}>{t('thresholdContent')}</p>

        {/* Visual bar */}
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="flex-1 h-10 rounded flex items-center justify-center text-xs font-mono font-bold"
                style={{
                  backgroundColor: n < 4 ? `rgba(239,68,68,${0.1 + n * 0.08})` : `rgba(34,197,94,${0.1 + (n - 4) * 0.1})`,
                  color: n < 4 ? '#ef4444' : '#22c55e',
                  border: n === 4 ? '2px solid #f0d48a' : '1px solid transparent',
                }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1 text-xs">
            <span className="text-red-400">{tl({ en: 'Challenging', hi: 'कठिन', sa: 'कठिनः' }, locale)}</span>
            <span className="text-gold-light">{tl({ en: 'Threshold = 4', hi: 'सीमा = 4', sa: 'सीमा = 4' }, locale)}</span>
            <span className="text-emerald-400">{tl({ en: 'Favourable', hi: 'अनुकूल', sa: 'अनुकूलः' }, locale)}</span>
          </div>
        </div>
      </LessonSection>

      {/* Section 4: SAV */}
      <LessonSection number={4} title={t('savTitle')}>
        <p style={bodyFont}>{t('savContent')}</p>

        {/* SAV example */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {tl({ en: 'Example: Sarvashtakavarga (SAV)', hi: 'उदाहरण: सर्वाष्टकवर्ग (SAV)', sa: 'उदाहरणम्: सर्वाष्टकवर्गः (SAV)' }, locale)}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">SAV</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">{isHi ? s.hi : s.en}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 font-medium text-gold-light">{tl({ en: 'Total', hi: 'योग', sa: 'योगः' }, locale)}</td>
                {SAV_EXAMPLE.map((score, i) => (
                  <td key={i} className={`text-center py-2 px-1 font-mono font-bold ${score >= 28 ? 'text-emerald-400' : score <= 24 ? 'text-red-400' : 'text-amber-400'}`}>
                    {score}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs font-mono">
            {tl({ en: 'Total: 337 | Average per sign: ~28', hi: 'कुल: 337 | औसत प्रति राशि: ~28', sa: 'योगः: 337 | राशि-प्रति-औसतम्: ~28' }, locale)}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Practical worked example */}
      <LessonSection number={5} title={t('practicalTitle')} variant="highlight">
        <p style={bodyFont}>{t('practicalContent')}</p>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3" style={headingFont}>
            {t('workedTitle')}
          </p>
          <div className="space-y-2 text-gold-light/80 font-mono text-xs">
            <p>{tl({ en: 'Situation: Saturn is currently transiting Capricorn', hi: 'स्थिति: शनि वर्तमान में मकर में गोचर कर रहा है', sa: 'स्थितिः: शनिः सम्प्रति मकर-राशौ गोचरं करोति' }, locale)}</p>
            <p>{tl({ en: 'Your Saturn BAV score in Capricorn: 6 bindus', hi: 'आपके BAV में शनि का मकर स्कोर: 6 बिन्दु', sa: 'भवतः मकर-राशौ शनि-BAV-अङ्कः: 6 बिन्दवः' }, locale)}</p>
            <p className="text-emerald-400">{tl({ en: 'Analysis: Saturn transiting its own sign Capricorn with 6 bindus (above 4 threshold).', hi: 'निष्कर्ष: शनि अपनी स्वराशि मकर में 6 बिन्दु (4+ सीमा से ऊपर) के साथ गोचर कर रहा है।', sa: 'विश्लेषणम्: शनिः स्वराशौ मकरे 6 बिन्दुभिः (4-सीमातः उपरि) गोचरं करोति।' }, locale)}</p>
            <p className="text-emerald-400">{tl({ en: 'This transit will bring structured career growth, disciplined success, and steady progress.', hi: 'यह गोचर करियर में संरचित वृद्धि, अनुशासन से सफलता, और स्थिर प्रगति लाएगा।', sa: 'अयं गोचरः संरचित-जीविका-वृद्धिम्, अनुशासित-सफलताम्, स्थिर-प्रगतिं च आनेष्यति।' }, locale)}</p>
            <div className="mt-3 border-t border-gold-primary/10 pt-3">
              <p>{tl({ en: "Compare: Your friend\'s Saturn BAV score in Capricorn: 2 bindus", hi: "तुलना: मित्र की कुण्डली में शनि का मकर स्कोर: 2 बिन्दु", sa: "तुलना: मित्र की कुण्डली में शनि का मकर स्कोर: 2 बिन्दु" }, locale)}</p>
              <p className="text-red-400">{tl({ en: 'During the same Saturn-in-Capricorn transit, your friend will experience obstacles, delays, and pressure.', hi: 'उसी शनि-मकर गोचर में, आपके मित्र को कठिनाइयाँ, देरी और बाधाएँ अनुभव होंगी।', sa: 'तस्मिन्नेव शनि-मकर-गोचरे भवतः मित्रं विघ्नान्, विलम्बान्, दबावं च अनुभविष्यति।' }, locale)}</p>
              <p className="text-amber-400 mt-1">{tl({ en: 'Same transit, two very different experiences — this is the power of Ashtakavarga.', hi: 'एक ही गोचर, दो बहुत अलग अनुभव — यह अष्टकवर्ग की शक्ति है।', sa: 'एकः गोचरः, अत्यन्त-भिन्नौ द्वौ अनुभवौ — एतत् अष्टकवर्गस्य सामर्थ्यम्।' }, locale)}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Trikona Shodhana */}
      <LessonSection number={6} title={t('trikonaTitle')}>
        <p style={bodyFont}>{t('trikonaContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('trikonaContent2')}</p>

        {/* Ekadhipati pairs */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { lord: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, pair: { en: 'Aries & Scorpio', hi: 'मेष & वृश्चिक', sa: 'मेष & वृश्चिक', mai: 'मेष & वृश्चिक', mr: 'मेष & वृश्चिक', ta: 'மேஷ & விருஶ்சிக', te: 'మేష & వృశ్చిక', bn: 'মেষ & বৃশ্চিক', kn: 'ಮೇಷ & ವೃಶ್ಚಿಕ', gu: 'મેષ & વૃશ્ચિક' }, color: '#ef4444' },
            { lord: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'குரு', te: 'గురుడు', bn: 'গুরু', kn: 'ಗುರು', gu: 'ગુરુ' }, pair: { en: 'Sagittarius & Pisces', hi: 'धनु & मीन', sa: 'धनु & मीन', mai: 'धनु & मीन', mr: 'धनु & मीन', ta: 'धநு & மீந', te: 'ధను & మీన', bn: 'ধনু & মীন', kn: 'ಧನು & ಮೀನ', gu: 'ધનુ & મીન' }, color: '#f0d48a' },
            { lord: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, pair: { en: 'Capricorn & Aquarius', hi: 'मकर & कुम्भ', sa: 'मकर & कुम्भ', mai: 'मकर & कुम्भ', mr: 'मकर & कुम्भ', ta: 'மகர & கும்भ', te: 'మకర & కుమ్భ', bn: 'মকর & কুম্ভ', kn: 'ಮಕರ & ಕುಮ್ಭ', gu: 'મકર & કુમ્ભ' }, color: '#3b82f6' },
            { lord: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, pair: { en: 'Gemini & Virgo', hi: 'मिथुन & कन्या', sa: 'मिथुन & कन्या', mai: 'मिथुन & कन्या', mr: 'मिथुन & कन्या', ta: 'மிथுந & கந்யா', te: 'మిథున & కన్యా', bn: 'মিথুন & কন্যা', kn: 'ಮಿಥುನ & ಕನ್ಯಾ', gu: 'મિથુન & કન્યા' }, color: '#22c55e' },
            { lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, pair: { en: 'Taurus & Libra', hi: 'वृषभ & तुला', sa: 'वृषभ & तुला', mai: 'वृषभ & तुला', mr: 'वृषभ & तुला', ta: 'விருஷभ & துலா', te: 'వృషభ & తులా', bn: 'বৃষভ & তুলা', kn: 'ವೃಷಭ & ತುಲಾ', gu: 'વૃષભ & તુલા' }, color: '#ec4899' },
          ].map((item) => (
            <div key={item.lord.en} className="rounded-lg p-3 border border-gold-primary/10 bg-bg-primary/50">
              <div className="text-sm font-bold mb-1" style={{ color: item.color }}>
                {isHi ? item.lord.hi : item.lord.en}
              </div>
              <div className="text-text-secondary text-xs">{isHi ? item.pair.hi : item.pair.en}</div>
            </div>
          ))}
        </div>

        {/* Worked reduction example */}
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {tl({ en: 'Reduction Example (Saturn BAV):', hi: 'शोधन उदाहरण (शनि BAV):', sa: 'शोधन-उदाहरणम् (शनि-BAV):' }, locale)}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>{tl({ en: 'Before: Aries = 3, Scorpio = 1 (Mars pair)', hi: 'शोधन पूर्व: मेष = 3, वृश्चिक = 1 (मंगल जोड़ी)', sa: 'शोधनात् पूर्वम्: मेषः = 3, वृश्चिकः = 1 (मङ्गल-युग्मम्)' }, locale)}</p>
            <p>{tl({ en: 'Minimum = 1, subtract from both', hi: 'न्यूनतम = 1, दोनों से घटाएँ', sa: 'न्यूनतमम् = 1, उभाभ्यां व्यवकलनम्' }, locale)}</p>
            <p className="text-emerald-400">{tl({ en: 'After: Aries = 2, Scorpio = 0', hi: 'शोधन पश्चात: मेष = 2, वृश्चिक = 0', sa: 'शोधनानन्तरम्: मेषः = 2, वृश्चिकः = 0' }, locale)}</p>
            <p className="text-text-tertiary mt-1">{tl({ en: 'Saturn transit through Scorpio now appears ineffective.', hi: 'वृश्चिक में शनि गोचर अब निष्प्रभावी प्रतीत होता है।', sa: 'वृश्चिके शनि-गोचरः साम्प्रतम् अप्रभावी प्रतीयते।' }, locale)}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 7: Kakshya */}
      <LessonSection number={7} title={t('kakshyaTitle')}>
        <p style={bodyFont}>{t('kakshyaContent')}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{tl({ en: 'Kakshya', hi: 'कक्ष्या', sa: 'कक्ष्या' }, locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{tl({ en: 'Ruler', hi: 'स्वामी', sa: 'स्वामी' }, locale)}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{tl({ en: 'Degree Range', hi: 'अंश सीमा', sa: 'अंश-सीमा' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { n: 1, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'சனி', te: 'శని', bn: 'শনি', kn: 'ಶನಿ', gu: 'શનિ' }, range: '0\u00b0 - 3\u00b045\u2032', color: '#3b82f6' },
                { n: 2, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'குரு', te: 'గురుడు', bn: 'গুরু', kn: 'ಗುರು', gu: 'ગુરુ' }, range: '3\u00b045\u2032 - 7\u00b030\u2032', color: '#f0d48a' },
                { n: 3, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'செவ்வாய்', te: 'కుజుడు', bn: 'মঙ্গল', kn: 'ಮಂಗಳ', gu: 'મંગળ' }, range: '7\u00b030\u2032 - 11\u00b015\u2032', color: '#ef4444' },
                { n: 4, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'சூரியன்', te: 'సూర్యుడు', bn: 'সূর্য', kn: 'ಸೂರ್ಯ', gu: 'સૂર્ય' }, range: '11\u00b015\u2032 - 15\u00b0', color: '#f59e0b' },
                { n: 5, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'சுக்கிரன்', te: 'శుక్రుడు', bn: 'শুক্র', kn: 'ಶುಕ್ರ', gu: 'શુક્ર' }, range: '15\u00b0 - 18\u00b045\u2032', color: '#ec4899' },
                { n: 6, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'புதன்', te: 'బుధుడు', bn: 'বুধ', kn: 'ಬುಧ', gu: 'બુધ' }, range: '18\u00b045\u2032 - 22\u00b030\u2032', color: '#22c55e' },
                { n: 7, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'சந்திரன்', te: 'చంద్రుడు', bn: 'চন্দ্র', kn: 'ಚಂದ್ರ', gu: 'ચંદ્ર' }, range: '22\u00b030\u2032 - 26\u00b015\u2032', color: '#e2e8f0' },
                { n: 8, ruler: { en: 'Lagna', hi: 'लग्न', sa: 'लग्न', mai: 'लग्न', mr: 'लग्न', ta: 'லக்னம்', te: 'లగ్నం', bn: 'লগ্ন', kn: 'ಲಗ್ನ', gu: 'લગ્ન' }, range: '26\u00b015\u2032 - 30\u00b0', color: '#a855f7' },
              ].map((k) => (
                <tr key={k.n} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-mono text-text-secondary">{k.n}</td>
                  <td className="py-2 px-2 font-medium" style={{ color: k.color }}>
                    {isHi ? k.ruler.hi : k.ruler.en}
                  </td>
                  <td className="py-2 px-2 text-text-secondary font-mono">{k.range}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 8: Related modules */}
      <LessonSection number={8} title={t('modulesTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/18-3', label: { en: 'Lesson 18-3: Ashtakavarga Applications', hi: 'पाठ 18-3: अष्टकवर्ग अनुप्रयोग', sa: 'पाठः 18-3: अष्टकवर्गानुप्रयोगाः' } },
            { href: '/learn/modules/12-1', label: { en: 'Lesson 12-1: Transit Analysis', hi: 'पाठ 12-1: गोचर विश्लेषण', sa: 'पाठः 12-1: गोचरविश्लेषणम्' } },
            { href: '/learn/gochar', label: { en: 'Reference: Gochar (Transits)', hi: 'सन्दर्भ: गोचर', sa: 'सन्दर्भः: गोचरः' } },
            { href: '/kundali', label: { en: 'Tool: Generate Kundali', hi: 'उपकरण: कुण्डली बनाएँ', sa: 'साधनम्: कुण्डलीजननम्' } },
            { href: '/transits', label: { en: 'Tool: Current Transits', hi: 'उपकरण: वर्तमान गोचर', sa: 'साधनम्: वर्तमानगोचरः' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {lt(mod.label as LocaleText, locale)}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: Shodhana (Reductions) */}
      <LessonSection number={9} title={tl({ en: 'Ashtakavarga Shodhana (Reductions)', hi: 'अष्टकवर्ग शोधन (कटौती)', sa: 'अष्टकवर्गशोधनम्' }, locale)}>
        {/* What is Shodhana */}
        <p style={bodyFont}>
          {tl({
            en: 'Raw Ashtakavarga scores overcount because they include redundant contributions. Two classical reduction methods remove this redundancy: Trikona Shodhana (element-group leveling) and Ekadhipatya Shodhana (dual-lordship reduction). The reduced scores are more accurate for transit prediction.',
            hi: 'कच्चे अष्टकवर्ग अंक अतिरिक्त गणना के कारण अधिक होते हैं। दो शास्त्रीय शोधन विधियाँ इस अनावश्यकता को दूर करती हैं: त्रिकोण शोधन (तत्त्व-समूह समतलन) और एकाधिपत्य शोधन (द्वि-स्वामित्व कटौती)। शोधित अंक गोचर भविष्यवाणी के लिए अधिक सटीक हैं।',
            sa: 'अष्टकवर्गस्य मूलाङ्काः अतिरिक्तगणनया अधिकाः भवन्ति। द्वे शास्त्रीये शोधनविधी अनावश्यकतां दूरयतः: त्रिकोणशोधनम् च एकाधिपत्यशोधनम् च।',
          }, locale)}
        </p>

        {/* Trikona Shodhana */}
        <div className="mt-5 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
            {tl({ en: 'Trikona Shodhana', hi: 'त्रिकोण शोधन', sa: 'त्रिकोणशोधनम्' }, locale)}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-3" style={bodyFont}>
            {tl({
              en: 'Signs of the same element are grouped. The minimum value in each group is subtracted from all three signs, revealing relative strength within the element.',
              hi: 'एक ही तत्त्व की राशियों को समूहित किया जाता है। प्रत्येक समूह में न्यूनतम मान तीनों राशियों से घटाया जाता है, जिससे तत्त्व के भीतर सापेक्ष बल प्रकट होता है।',
              sa: 'एकस्यैव तत्त्वस्य राशयः समूह्यन्ते। प्रत्येकसमूहे न्यूनतममानं त्रिभ्यः राशिभ्यः व्यवकल्यते।',
            }, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { element: { en: 'Fire', hi: 'अग्नि', sa: 'अग्नि' }, signs: { en: 'Aries · Leo · Sag', hi: 'मेष · सिंह · धनु', sa: 'मेषः · सिंहः · धनुः' }, color: '#f59e0b' },
              { element: { en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी' }, signs: { en: 'Taurus · Virgo · Cap', hi: 'वृषभ · कन्या · मकर', sa: 'वृषभः · कन्या · मकरः' }, color: '#22c55e' },
              { element: { en: 'Air', hi: 'वायु', sa: 'वायु' }, signs: { en: 'Gemini · Libra · Aqua', hi: 'मिथुन · तुला · कुम्भ', sa: 'मिथुनः · तुला · कुम्भः' }, color: '#3b82f6' },
              { element: { en: 'Water', hi: 'जल', sa: 'जल' }, signs: { en: 'Cancer · Scorpio · Pisces', hi: 'कर्क · वृश्चिक · मीन', sa: 'कर्कः · वृश्चिकः · मीनः' }, color: '#a78bfa' },
            ].map(item => (
              <div key={item.element.en} className="rounded-lg p-2.5 border border-gold-primary/10 bg-bg-primary/50">
                <div className="text-xs font-bold mb-1" style={{ color: item.color }}>
                  {tl(item.element, locale)}
                </div>
                <div className="text-text-secondary text-[10px] leading-relaxed">{tl(item.signs, locale)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Ekadhipatya Shodhana */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
            {tl({ en: 'Ekadhipatya Shodhana', hi: 'एकाधिपत्य शोधन', sa: 'एकाधिपत्यशोधनम्' }, locale)}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
            {tl({
              en: 'Signs sharing the same lord (e.g., Aries-Scorpio both ruled by Mars) are compared. The weaker sign\'s score is zeroed, keeping only the stronger. Special rules apply when the lord occupies one of the signs, or when Rahu/Ketu is present.',
              hi: 'एक ही स्वामी वाली राशियों (जैसे मेष-वृश्चिक दोनों मंगल की) की तुलना की जाती है। कमज़ोर राशि का अंक शून्य कर दिया जाता है, केवल बलवान राशि का अंक रखा जाता है। विशेष नियम तब लागू होते हैं जब स्वामी उनमें से किसी राशि में हो, या राहु/केतु उपस्थित हो।',
              sa: 'एकस्यैव स्वामिनः राशयः (यथा मेष-वृश्चिकौ मङ्गलस्य) तुल्यन्ते। दुर्बलराशेः अङ्कः शून्यः क्रियते, बलवतः एव अङ्कः स्थाप्यते।',
            }, locale)}
          </p>
        </div>

        {/* Pinda Ashtakavarga */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4">
          <h4 className="text-gold-light text-sm font-bold mb-2" style={headingFont}>
            {tl({ en: 'Pinda Ashtakavarga', hi: 'पिण्ड अष्टकवर्ग', sa: 'पिण्डाष्टकवर्गः' }, locale)}
          </h4>
          <p className="text-text-secondary text-xs leading-relaxed mb-3" style={bodyFont}>
            {tl({
              en: 'After both reductions, each planet\'s scores are weighted by sign element and planet strength to produce a single Pinda number. Higher Pinda = stronger results during that planet\'s dasha and transit periods.',
              hi: 'दोनों शोधनों के बाद, प्रत्येक ग्रह के अंकों को राशि तत्त्व और ग्रह बल के आधार पर भारित करके एक पिण्ड अंक प्राप्त किया जाता है। उच्च पिण्ड = उस ग्रह की दशा और गोचर काल में प्रबल फल।',
              sa: 'उभयशोधनानन्तरं प्रत्येकग्रहस्य अङ्काः राश्यग्नितत्त्वेन ग्रहबलेन च भारिताः एकं पिण्डाङ्कं ददति। उच्चपिण्डः = तत्ग्रहदशागोचरयोः प्रबलफलम्।',
            }, locale)}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { label: { en: 'Fire signs', hi: 'अग्नि राशि', sa: 'अग्निराशयः' }, weight: '7' },
              { label: { en: 'Earth signs', hi: 'पृथ्वी राशि', sa: 'पृथ्वीराशयः' }, weight: '5' },
              { label: { en: 'Air signs', hi: 'वायु राशि', sa: 'वायुराशयः' }, weight: '6' },
              { label: { en: 'Water signs', hi: 'जल राशि', sa: 'जलराशयः' }, weight: '8' },
            ].map(item => (
              <div key={item.weight} className="rounded-lg p-2 border border-gold-primary/10 bg-bg-primary/50 flex items-center justify-between">
                <span className="text-text-secondary text-[10px]">{tl(item.label, locale)}</span>
                <span className="text-gold-light font-mono font-bold text-sm ml-2">×{item.weight}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-text-secondary/70 text-[10px]" style={bodyFont}>
            {tl({
              en: 'Planet weights: Jupiter = 10 (highest) → Saturn = 5 (lowest). Pinda above 200 = high strength; 100–200 = medium; below 100 = low.',
              hi: 'ग्रह भार: गुरु = 10 (सर्वाधिक) → शनि = 5 (न्यूनतम)। पिण्ड 200 से ऊपर = उच्च बल; 100-200 = मध्यम; 100 से नीचे = न्यून।',
              sa: 'ग्रहभारः: गुरुः = 10 → शनिः = 5। पिण्डः 200+ = उच्चबलम्; 100-200 = मध्यमम्; 100 अधः = न्यूनम्।',
            }, locale)}
          </p>
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {t('tryIt')} →
        </Link>
      </div>
    </div>
  );
}

'use client';

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
  { en: 'Ari', hi: 'मे', sa: 'मे', mai: 'मे', mr: 'मे', ta: 'Ari', te: 'Ari', bn: 'Ari', kn: 'Ari', gu: 'Ari' }, { en: 'Tau', hi: 'वृ', sa: 'वृ', mai: 'वृ', mr: 'वृ', ta: 'Tau', te: 'Tau', bn: 'Tau', kn: 'Tau', gu: 'Tau' }, { en: 'Gem', hi: 'मि', sa: 'मि', mai: 'मि', mr: 'मि', ta: 'Gem', te: 'Gem', bn: 'Gem', kn: 'Gem', gu: 'Gem' },
  { en: 'Can', hi: 'क', sa: 'क', mai: 'क', mr: 'क', ta: 'Can', te: 'Can', bn: 'Can', kn: 'Can', gu: 'Can' }, { en: 'Leo', hi: 'सिं', sa: 'सिं', mai: 'सिं', mr: 'सिं', ta: 'Leo', te: 'Leo', bn: 'Leo', kn: 'Leo', gu: 'Leo' }, { en: 'Vir', hi: 'कन्', sa: 'कन्', mai: 'कन्', mr: 'कन्', ta: 'Vir', te: 'Vir', bn: 'Vir', kn: 'Vir', gu: 'Vir' },
  { en: 'Lib', hi: 'तु', sa: 'तु', mai: 'तु', mr: 'तु', ta: 'Lib', te: 'Lib', bn: 'Lib', kn: 'Lib', gu: 'Lib' }, { en: 'Sco', hi: 'वृश्', sa: 'वृश्', mai: 'वृश्', mr: 'वृश्', ta: 'Sco', te: 'Sco', bn: 'Sco', kn: 'Sco', gu: 'Sco' }, { en: 'Sag', hi: 'ध', sa: 'ध', mai: 'ध', mr: 'ध', ta: 'Sag', te: 'Sag', bn: 'Sag', kn: 'Sag', gu: 'Sag' },
  { en: 'Cap', hi: 'म', sa: 'म', mai: 'म', mr: 'म', ta: 'Cap', te: 'Cap', bn: 'Cap', kn: 'Cap', gu: 'Cap' }, { en: 'Aqu', hi: 'कुं', sa: 'कुं', mai: 'कुं', mr: 'कुं', ta: 'Aqu', te: 'Aqu', bn: 'Aqu', kn: 'Aqu', gu: 'Aqu' }, { en: 'Pis', hi: 'मी', sa: 'मी', mai: 'मी', mr: 'मी', ta: 'Pis', te: 'Pis', bn: 'Pis', kn: 'Pis', gu: 'Pis' },
];

const EXAMPLE_BAV = {
  planet: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' },
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
            { name: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' }, color: '#f59e0b' },
            { name: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' }, color: '#e2e8f0' },
            { name: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' }, color: '#ef4444' },
            { name: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' }, color: '#22c55e' },
            { name: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' }, color: '#f0d48a' },
            { name: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' }, color: '#ec4899' },
            { name: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' }, color: '#3b82f6' },
            { name: { en: 'Lagna', hi: 'लग्न', sa: 'लग्न', mai: 'लग्न', mr: 'लग्न', ta: 'Lagna', te: 'Lagna', bn: 'Lagna', kn: 'Lagna', gu: 'Lagna' }, color: '#a855f7' },
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
            {isHi ? 'उदाहरण: शनि BAV' : 'Example: Saturn BAV'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-1 text-gold-dark">{isHi ? 'ग्रह' : 'Planet'}</th>
                {SIGNS_SHORT.map((s, i) => (
                  <th key={i} className="text-center py-2 px-1 text-gold-dark font-mono">{isHi ? s.hi : s.en}</th>
                ))}
                <th className="text-center py-2 px-1 text-gold-dark">{isHi ? 'योग' : 'Total'}</th>
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
            {isHi
              ? 'हरा = 4+ (शुभ) | पीला = 3 (मध्यम) | लाल = 0-2 (कठिन)'
              : 'Green = 4+ (favourable) | Yellow = 3 (mixed) | Red = 0-2 (challenging)'}
          </p>
        </div>

        {/* Score meanings */}
        <div className="mt-4">
          <p className="text-gold-light text-sm font-semibold mb-2" style={headingFont}>
            {isHi ? 'बिन्दु स्कोर अर्थ' : 'Bindu Score Meanings'}
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
            <span className="text-red-400">{isHi ? 'कठिन' : 'Challenging'}</span>
            <span className="text-gold-light">{isHi ? 'सीमा = 4' : 'Threshold = 4'}</span>
            <span className="text-emerald-400">{isHi ? 'अनुकूल' : 'Favourable'}</span>
          </div>
        </div>
      </LessonSection>

      {/* Section 4: SAV */}
      <LessonSection number={4} title={t('savTitle')}>
        <p style={bodyFont}>{t('savContent')}</p>

        {/* SAV example */}
        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {isHi ? 'उदाहरण: सर्वाष्टकवर्ग (SAV)' : 'Example: Sarvashtakavarga (SAV)'}
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
                <td className="py-2 px-1 font-medium text-gold-light">{isHi ? 'योग' : 'Total'}</td>
                {SAV_EXAMPLE.map((score, i) => (
                  <td key={i} className={`text-center py-2 px-1 font-mono font-bold ${score >= 28 ? 'text-emerald-400' : score <= 24 ? 'text-red-400' : 'text-amber-400'}`}>
                    {score}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs font-mono">
            {isHi ? 'कुल: 337 | औसत प्रति राशि: ~28' : 'Total: 337 | Average per sign: ~28'}
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
            <p>{isHi ? 'स्थिति: शनि वर्तमान में मकर में गोचर कर रहा है' : 'Situation: Saturn is currently transiting Capricorn'}</p>
            <p>{isHi ? 'आपके BAV में शनि का मकर स्कोर: 6 बिन्दु' : 'Your Saturn BAV score in Capricorn: 6 bindus'}</p>
            <p className="text-emerald-400">{isHi ? 'निष्कर्ष: शनि अपनी स्वराशि मकर में 6 बिन्दु (4+ सीमा से ऊपर) के साथ गोचर कर रहा है।' : 'Analysis: Saturn transiting its own sign Capricorn with 6 bindus (above 4 threshold).'}</p>
            <p className="text-emerald-400">{isHi ? 'यह गोचर करियर में संरचित वृद्धि, अनुशासन से सफलता, और स्थिर प्रगति लाएगा।' : 'This transit will bring structured career growth, disciplined success, and steady progress.'}</p>
            <div className="mt-3 border-t border-gold-primary/10 pt-3">
              <p>{isHi ? 'तुलना: मित्र की कुण्डली में शनि का मकर स्कोर: 2 बिन्दु' : 'Compare: Your friend\'s Saturn BAV score in Capricorn: 2 bindus'}</p>
              <p className="text-red-400">{isHi ? 'उसी शनि-मकर गोचर में, आपके मित्र को कठिनाइयाँ, देरी और बाधाएँ अनुभव होंगी।' : 'During the same Saturn-in-Capricorn transit, your friend will experience obstacles, delays, and pressure.'}</p>
              <p className="text-amber-400 mt-1">{isHi ? 'एक ही गोचर, दो बहुत अलग अनुभव — यह अष्टकवर्ग की शक्ति है।' : 'Same transit, two very different experiences — this is the power of Ashtakavarga.'}</p>
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
            { lord: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' }, pair: { en: 'Aries & Scorpio', hi: 'मेष & वृश्चिक', sa: 'मेष & वृश्चिक', mai: 'मेष & वृश्चिक', mr: 'मेष & वृश्चिक', ta: 'Aries & Scorpio', te: 'Aries & Scorpio', bn: 'Aries & Scorpio', kn: 'Aries & Scorpio', gu: 'Aries & Scorpio' }, color: '#ef4444' },
            { lord: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' }, pair: { en: 'Sagittarius & Pisces', hi: 'धनु & मीन', sa: 'धनु & मीन', mai: 'धनु & मीन', mr: 'धनु & मीन', ta: 'Sagittarius & Pisces', te: 'Sagittarius & Pisces', bn: 'Sagittarius & Pisces', kn: 'Sagittarius & Pisces', gu: 'Sagittarius & Pisces' }, color: '#f0d48a' },
            { lord: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' }, pair: { en: 'Capricorn & Aquarius', hi: 'मकर & कुम्भ', sa: 'मकर & कुम्भ', mai: 'मकर & कुम्भ', mr: 'मकर & कुम्भ', ta: 'Capricorn & Aquarius', te: 'Capricorn & Aquarius', bn: 'Capricorn & Aquarius', kn: 'Capricorn & Aquarius', gu: 'Capricorn & Aquarius' }, color: '#3b82f6' },
            { lord: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' }, pair: { en: 'Gemini & Virgo', hi: 'मिथुन & कन्या', sa: 'मिथुन & कन्या', mai: 'मिथुन & कन्या', mr: 'मिथुन & कन्या', ta: 'Gemini & Virgo', te: 'Gemini & Virgo', bn: 'Gemini & Virgo', kn: 'Gemini & Virgo', gu: 'Gemini & Virgo' }, color: '#22c55e' },
            { lord: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' }, pair: { en: 'Taurus & Libra', hi: 'वृषभ & तुला', sa: 'वृषभ & तुला', mai: 'वृषभ & तुला', mr: 'वृषभ & तुला', ta: 'Taurus & Libra', te: 'Taurus & Libra', bn: 'Taurus & Libra', kn: 'Taurus & Libra', gu: 'Taurus & Libra' }, color: '#ec4899' },
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
            {isHi ? 'शोधन उदाहरण (शनि BAV):' : 'Reduction Example (Saturn BAV):'}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>{isHi ? 'शोधन पूर्व: मेष = 3, वृश्चिक = 1 (मंगल जोड़ी)' : 'Before: Aries = 3, Scorpio = 1 (Mars pair)'}</p>
            <p>{isHi ? 'न्यूनतम = 1, दोनों से घटाएँ' : 'Minimum = 1, subtract from both'}</p>
            <p className="text-emerald-400">{isHi ? 'शोधन पश्चात: मेष = 2, वृश्चिक = 0' : 'After: Aries = 2, Scorpio = 0'}</p>
            <p className="text-text-tertiary mt-1">{isHi ? 'वृश्चिक में शनि गोचर अब निष्प्रभावी प्रतीत होता है।' : 'Saturn transit through Scorpio now appears ineffective.'}</p>
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
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'कक्ष्या' : 'Kakshya'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'स्वामी' : 'Ruler'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{isHi ? 'अंश सीमा' : 'Degree Range'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {[
                { n: 1, ruler: { en: 'Saturn', hi: 'शनि', sa: 'शनि', mai: 'शनि', mr: 'शनि', ta: 'Saturn', te: 'Saturn', bn: 'Saturn', kn: 'Saturn', gu: 'Saturn' }, range: '0\u00b0 - 3\u00b045\u2032', color: '#3b82f6' },
                { n: 2, ruler: { en: 'Jupiter', hi: 'गुरु', sa: 'गुरु', mai: 'गुरु', mr: 'गुरु', ta: 'Jupiter', te: 'Jupiter', bn: 'Jupiter', kn: 'Jupiter', gu: 'Jupiter' }, range: '3\u00b045\u2032 - 7\u00b030\u2032', color: '#f0d48a' },
                { n: 3, ruler: { en: 'Mars', hi: 'मंगल', sa: 'मंगल', mai: 'मंगल', mr: 'मंगल', ta: 'Mars', te: 'Mars', bn: 'Mars', kn: 'Mars', gu: 'Mars' }, range: '7\u00b030\u2032 - 11\u00b015\u2032', color: '#ef4444' },
                { n: 4, ruler: { en: 'Sun', hi: 'सूर्य', sa: 'सूर्य', mai: 'सूर्य', mr: 'सूर्य', ta: 'Sun', te: 'Sun', bn: 'Sun', kn: 'Sun', gu: 'Sun' }, range: '11\u00b015\u2032 - 15\u00b0', color: '#f59e0b' },
                { n: 5, ruler: { en: 'Venus', hi: 'शुक्र', sa: 'शुक्र', mai: 'शुक्र', mr: 'शुक्र', ta: 'Venus', te: 'Venus', bn: 'Venus', kn: 'Venus', gu: 'Venus' }, range: '15\u00b0 - 18\u00b045\u2032', color: '#ec4899' },
                { n: 6, ruler: { en: 'Mercury', hi: 'बुध', sa: 'बुध', mai: 'बुध', mr: 'बुध', ta: 'Mercury', te: 'Mercury', bn: 'Mercury', kn: 'Mercury', gu: 'Mercury' }, range: '18\u00b045\u2032 - 22\u00b030\u2032', color: '#22c55e' },
                { n: 7, ruler: { en: 'Moon', hi: 'चन्द्र', sa: 'चन्द्र', mai: 'चन्द्र', mr: 'चन्द्र', ta: 'Moon', te: 'Moon', bn: 'Moon', kn: 'Moon', gu: 'Moon' }, range: '22\u00b030\u2032 - 26\u00b015\u2032', color: '#e2e8f0' },
                { n: 8, ruler: { en: 'Lagna', hi: 'लग्न', sa: 'लग्न', mai: 'लग्न', mr: 'लग्न', ta: 'Lagna', te: 'Lagna', bn: 'Lagna', kn: 'Lagna', gu: 'Lagna' }, range: '26\u00b015\u2032 - 30\u00b0', color: '#a855f7' },
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

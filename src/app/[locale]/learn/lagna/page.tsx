'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/lagna.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;

/* ── Inline array data (not in JSON — kept as local constants) ── */
const INLINE_CALCSTEPS = [
  { en: '1. Convert birth time to Universal Time (UT) by subtracting the timezone offset', hi: '1. जन्म समय को UTC में बदलें (समयक्षेत्र घटाकर)' },
  { en: '2. Calculate the Julian Day Number (JD) from the date and UT', hi: '2. तिथि और UT से जूलियन दिवस संख्या (JD) निकालें' },
  { en: '3. Compute the Local Sidereal Time (LST) from JD + geographic longitude', hi: '3. JD + भौगोलिक देशान्तर से स्थानीय नाक्षत्र काल (LST) निकालें' },
  { en: '4. Apply the ascendant formula: tan(Lagna) = cos(LST) / [-sin(LST)*cos(e) + tan(f)*sin(e)]', hi: '4. लग्न सूत्र: tan(लग्न) = cos(LST) / [-sin(LST)*cos(e) + tan(f)*sin(e)]' },
  { en: '5. Subtract the Ayanamsha to convert from tropical to sidereal (Vedic) Lagna', hi: '5. उष्णकटिबन्धीय से सायन (वैदिक) लग्न में बदलने हेतु अयनांश घटाएं' },
];

const INLINE_LAGNAS = [
  { sign: { en: 'Aries (Mesha)', hi: 'मेष' }, lord: { en: 'Mars', hi: 'मंगल' }, traits: { en: 'Pioneer, courageous, impulsive, athletic build, scar on head/face likely, natural leader. Life theme: self-assertion and initiative.', hi: 'अग्रदूत, साहसी, आवेगी, खिलाड़ी शरीर, सिर/चेहरे पर निशान, स्वाभाविक नेता।' } },
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, lord: { en: 'Venus', hi: 'शुक्र' }, traits: { en: 'Steady, artistic, sensual, stocky/solid build, beautiful eyes, loves comfort. Life theme: building security and beauty.', hi: 'स्थिर, कलात्मक, संवेदनशील, मजबूत शरीर, सुन्दर आँखें, सुख-प्रेमी।' } },
  { sign: { en: 'Gemini (Mithuna)', hi: 'मिथुन' }, lord: { en: 'Mercury', hi: 'बुध' }, traits: { en: 'Intellectual, communicative, versatile, slender build, youthful appearance, dual nature. Life theme: learning and connecting.', hi: 'बौद्धिक, संवादकुशल, बहुमुखी, दुबला शरीर, युवा दिखावट, द्विस्वभाव।' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, lord: { en: 'Moon', hi: 'चन्द्र' }, traits: { en: 'Nurturing, emotional, intuitive, round face, love of home and family. Life theme: emotional security and caregiving.', hi: 'पालनकर्ता, भावुक, सहजज्ञानी, गोल चेहरा, गृह और परिवार प्रेमी।' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, lord: { en: 'Sun', hi: 'सूर्य' }, traits: { en: 'Regal, confident, generous, broad chest, prominent forehead, charismatic presence. Life theme: self-expression and leadership.', hi: 'राजसी, आत्मविश्वासी, उदार, चौड़ी छाती, प्रमुख ललाट, आकर्षक उपस्थिति।' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, lord: { en: 'Mercury', hi: 'बुध' }, traits: { en: 'Analytical, perfectionist, health-conscious, slender build, youthful, service-oriented. Life theme: analysis and improvement.', hi: 'विश्लेषणात्मक, पूर्णतावादी, स्वास्थ्य-सजग, दुबला, सेवा-उन्मुख।' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, lord: { en: 'Venus', hi: 'शुक्र' }, traits: { en: 'Diplomatic, aesthetic, partnership-seeking, attractive features, balanced build. Life theme: harmony and relationships.', hi: 'कूटनीतिक, सौन्दर्यप्रेमी, साझेदारी-खोजी, आकर्षक, सन्तुलित।' } },
  { sign: { en: 'Scorpio (Vrishchika)', hi: 'वृश्चिक' }, lord: { en: 'Mars', hi: 'मंगल' }, traits: { en: 'Intense, secretive, transformative, magnetic eyes, muscular build, investigative mind. Life theme: transformation and power.', hi: 'तीव्र, गुप्त, परिवर्तनशील, चुम्बकीय आँखें, पेशीय, अन्वेषी मन।' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, lord: { en: 'Jupiter', hi: 'गुरु' }, traits: { en: 'Philosophical, adventurous, optimistic, tall/large frame, prominent thighs, teacher archetype. Life theme: wisdom and expansion.', hi: 'दार्शनिक, साहसिक, आशावादी, लम्बा/बड़ा शरीर, गुरु स्वरूप।' } },
  { sign: { en: 'Capricorn (Makara)', hi: 'मकर' }, lord: { en: 'Saturn', hi: 'शनि' }, traits: { en: 'Disciplined, ambitious, patient, lean build, prominent bones/knees, ages in reverse. Life theme: achievement through persistence.', hi: 'अनुशासित, महत्वाकांक्षी, धैर्यवान, दुबला, प्रमुख हड्डियाँ, उलटी उम्र।' } },
  { sign: { en: 'Aquarius (Kumbha)', hi: 'कुम्भ' }, lord: { en: 'Saturn', hi: 'शनि' }, traits: { en: 'Humanitarian, eccentric, scientific, tall, prominent calves, detached yet idealistic. Life theme: innovation and social reform.', hi: 'मानवतावादी, विलक्षण, वैज्ञानिक, लम्बा, आदर्शवादी पर विरक्त।' } },
  { sign: { en: 'Pisces (Meena)', hi: 'मीन' }, lord: { en: 'Jupiter', hi: 'गुरु' }, traits: { en: 'Mystical, compassionate, creative, soft features, dreamy eyes, spiritual inclination. Life theme: transcendence and spiritual growth.', hi: 'रहस्यमय, करुणामय, सृजनात्मक, कोमल, स्वप्निल आँखें, आध्यात्मिक।' } },
];

const INLINE_SPECIALLAGNAS = [
  { name: { en: 'Chandra Lagna (Moon Ascendant)', hi: 'चन्द्र लग्न' }, desc: { en: 'Using the Moon\'s sign as the 1st house. Reveals the emotional and mental landscape.', hi: 'चन्द्रमा की राशि को प्रथम भाव मानकर। भावनात्मक और मानसिक परिदृश्य उजागर करता है।' } },
  { name: { en: 'Surya Lagna (Sun Ascendant)', hi: 'सूर्य लग्न' }, desc: { en: 'Using the Sun\'s sign as the 1st house. Illuminates career, authority, and the soul\'s purpose.', hi: 'सूर्य की राशि को प्रथम भाव मानकर। कैरियर, अधिकार और आत्मा का उद्देश्य प्रकाशित करता है।' } },
  { name: { en: 'Hora Lagna', hi: 'होरा लग्न' }, desc: { en: 'Advances at the rate of one sign per hour from sunrise. Reveals wealth potential and financial trajectory.', hi: 'सूर्योदय से प्रति घण्टा एक राशि बढ़ता है। धन क्षमता और वित्तीय गति उजागर करता है।' } },
  { name: { en: 'Ghati Lagna (Ghatika Lagna)', hi: 'घटी लग्न' }, desc: { en: 'Advances at the rate of one sign per ghati (24 minutes). Related to power, authority, and public reputation.', hi: 'प्रति घटी (24 मिनट) एक राशि बढ़ता है। शक्ति, अधिकार और सार्वजनिक प्रतिष्ठा से सम्बन्धित।' } },
  { name: { en: 'Varnada Lagna', hi: 'वर्णद लग्न' }, desc: { en: 'Computed from the interaction of Lagna and Hora Lagna. Used in Jaimini astrology for determining varna and longevity.', hi: 'लग्न और होरा लग्न की अन्तर्क्रिया से गणना। जैमिनी ज्योतिष में वर्ण और दीर्घायु निर्धारण हेतु।' } },
  { name: { en: 'Arudha Lagna (Pada Lagna)', hi: 'आरूढ लग्न (पद लग्न)' }, desc: { en: 'The "image" lagna -- shows how the world perceives you versus who you actually are. Crucial in Jaimini system.', hi: 'प्रतिबिम्ब लग्न -- दिखाता है कि संसार आपको कैसे देखता है बनाम आप वास्तव में कौन हैं।' } },
];

const INLINE_RECTMETHODS = [
  { en: 'Tattwa Shodhana -- checking birth-time against the ruling element of the Lagna', hi: 'तत्त्व शोधन -- लग्न के शासक तत्व से जन्म समय की जाँच' },
  { en: 'Pranapada -- verifying using the Pranapada Lagna position', hi: 'प्राणपद -- प्राणपद लग्न स्थिति से सत्यापन' },
  { en: 'Event-based -- matching major life events to dasha transitions', hi: 'घटना-आधारित -- प्रमुख जीवन घटनाओं को दशा परिवर्तनों से मिलान' },
  { en: 'Navamsha verification -- ensuring D9 chart consistency with marriage and dharmic patterns', hi: 'नवांश सत्यापन -- D9 कुण्डली विवाह और धार्मिक जीवन पैटर्न से सुसंगत है' },
];

const INLINE_COMPARISON = [
  { aspect: { en: 'Lagna (Ascendant)', hi: 'लग्न' }, governs: { en: 'Physical body, appearance, personality, overall life direction, health, longevity', hi: 'शारीरिक शरीर, रूप, व्यक्तित्व, जीवन दिशा, स्वास्थ्य' }, changes: { en: 'Every ~2 hours', hi: 'हर ~2 घण्टे' } },
  { aspect: { en: 'Moon Sign (Rashi)', hi: 'चन्द्र राशि' }, governs: { en: 'Mind, emotions, instincts, habits, comfort zone, mother', hi: 'मन, भावनाएँ, सहज वृत्तियाँ, आदतें, माता' }, changes: { en: 'Every ~2.5 days', hi: 'हर ~2.5 दिन' } },
  { aspect: { en: 'Sun Sign (Rashi)', hi: 'सूर्य राशि' }, governs: { en: 'Soul, ego, authority, father, government, vitality', hi: 'आत्मा, अहंकार, अधिकार, पिता, सरकार' }, changes: { en: 'Every ~30 days', hi: 'हर ~30 दिन' } },
];

const INLINE_MISCONCEPTIONS = [
  { myth: { en: '"My Sun sign is my main sign"', hi: '"मेरी सूर्य राशि मेरी मुख्य राशि है"' }, truth: { en: 'In Vedic astrology, the Lagna and Moon sign are far more important than the Sun sign.', hi: 'वैदिक ज्योतिष में लग्न और चन्द्र राशि सूर्य राशि से कहीं अधिक महत्वपूर्ण हैं।' } },
  { myth: { en: '"The Lagna is just one of 12 houses"', hi: '"लग्न केवल 12 भावों में से एक है"' }, truth: { en: 'The Lagna is the ANCHOR of all 12 houses. Without a correct Lagna, every house analysis is wrong.', hi: 'लग्न सभी 12 भावों का आधार है। सही लग्न के बिना, प्रत्येक भाव विश्लेषण गलत है।' } },
  { myth: { en: '"Birth time doesn\'t matter much"', hi: '"जन्म समय ज्यादा मायने नहीं रखता"' }, truth: { en: 'A 4-minute error shifts Lagna by 1 degree -- enough to change the Navamsha division entirely.', hi: 'जन्म समय में 4 मिनट की त्रुटि लग्न को 1 अंश खिसकाती है -- नवांश बदलने के लिए पर्याप्त।' } },
  { myth: { en: '"Twins have the same chart"', hi: '"जुड़वों की कुण्डली समान होती है"' }, truth: { en: 'Even a few minutes difference can change the Lagna degree, Navamsha, dasha balance, and sub-lord.', hi: 'कुछ मिनटों का अन्तर भी लग्न अंश, नवांश, दशा सन्तुलन बदल सकता है।' } },
];

const INLINE_MUHURTALAGNAS = [
  { sign: { en: 'Taurus (Vrishabha)', hi: 'वृषभ' }, use: { en: 'Lakshmi Puja, wealth rituals, financial ventures -- Venus-ruled', hi: 'लक्ष्मी पूजा, धन अनुष्ठान, वित्तीय उद्यम -- शुक्र-शासित' } },
  { sign: { en: 'Leo (Simha)', hi: 'सिंह' }, use: { en: 'Government work, authority rituals, Surya puja -- Sun-ruled', hi: 'सरकारी कार्य, अधिकार अनुष्ठान, सूर्य पूजा -- सूर्य-शासित' } },
  { sign: { en: 'Sagittarius (Dhanu)', hi: 'धनु' }, use: { en: 'Satyanarayan Katha, educational events, guru puja -- Jupiter-ruled', hi: 'सत्यनारायण कथा, शैक्षिक आयोजन, गुरु पूजा -- गुरु-शासित' } },
  { sign: { en: 'Cancer (Karka)', hi: 'कर्क' }, use: { en: 'Griha Pravesh, domestic rituals -- Moon-ruled', hi: 'गृह प्रवेश, घरेलू अनुष्ठान -- चन्द्र-शासित' } },
  { sign: { en: 'Virgo (Kanya)', hi: 'कन्या' }, use: { en: 'Medical procedures, health rituals -- Mercury-ruled', hi: 'चिकित्सा प्रक्रियाएँ, स्वास्थ्य अनुष्ठान -- बुध-शासित' } },
  { sign: { en: 'Libra (Tula)', hi: 'तुला' }, use: { en: 'Marriage ceremonies, partnerships -- Venus-ruled', hi: 'विवाह संस्कार, साझेदारी -- शुक्र-शासित' } },
];

export default function LagnaPage() {
  const locale = useLocale();
  const headingFont = getHeadingFont(locale);
  const bodyFont = getBodyFont(locale);
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Title */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gold-gradient mb-4" style={headingFont}>{t('title')}</h1>
        <p className="text-text-secondary text-lg max-w-2xl mx-auto" style={bodyFont}>{t('subtitle')}</p>
        <SanskritTermCard term="लग्नम्" transliteration="Lagnam" meaning={t('sanskritMeaning')} />
      </motion.div>

      {/* What is Lagna */}
      <LessonSection title={t('whatTitle')}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whatContent')}</p>
      </LessonSection>

      {/* Why Lagna is Supreme */}
      <LessonSection title={t('whyTitle')}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('whyContent')}</p>
      </LessonSection>

      {/* How Lagna is Calculated */}
      <LessonSection title={t('calcTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('calcContent')}</p>
        <div className="space-y-2 mb-4">
          {INLINE_CALCSTEPS.map((step, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.05 }}
              className="p-3 bg-bg-primary/30 rounded-lg border border-gold-primary/10 text-text-secondary text-sm" style={bodyFont}>
              {tObj(step)}
            </motion.div>
          ))}
        </div>
        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/20">
          <p className="text-gold-primary/80 text-xs" style={bodyFont}>{t('calcNote')}</p>
        </div>
      </LessonSection>

      {/* How Fast Does Lagna Change */}
      <LessonSection title={t('changeTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('changeContent')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-orange-500/5 rounded-lg border border-orange-500/10">
            <p className="text-orange-400 text-sm font-semibold mb-1">{t('longAscLabel')}</p>
            <p className="text-text-secondary text-sm" style={bodyFont}>{t('longAsc')}</p>
          </div>
          <div className="p-4 bg-blue-500/5 rounded-lg border border-blue-500/10">
            <p className="text-blue-400 text-sm font-semibold mb-1">{t('shortAscLabel')}</p>
            <p className="text-text-secondary text-sm" style={bodyFont}>{t('shortAsc')}</p>
          </div>
        </div>
      </LessonSection>

      {/* 12 Lagnas */}
      <LessonSection title={t('twelveLagnaTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {INLINE_LAGNAS.map((lagna, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 + i * 0.03 }}
              className="p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gold-light font-semibold" style={headingFont}>{tObj(lagna.sign)}</span>
                <span className="text-text-tertiary text-xs">{t('lordLabel')}: {tObj(lagna.lord)}</span>
              </div>
              <p className="text-text-secondary text-sm" style={bodyFont}>{tObj(lagna.traits)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Lagna Lord */}
      <LessonSection title={t('lagnaLordTitle')}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('lagnaLordContent')}</p>
      </LessonSection>

      {/* Special Lagnas */}
      <LessonSection title={t('specialTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('specialContent')}</p>
        <div className="space-y-3">
          {INLINE_SPECIALLAGNAS.map((sl, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.45 + i * 0.05 }}
              className="p-4 bg-bg-primary/30 rounded-lg border border-gold-primary/10">
              <h4 className="text-gold-primary font-semibold text-sm mb-1" style={headingFont}>{tObj(sl.name)}</h4>
              <p className="text-text-secondary text-sm" style={bodyFont}>{tObj(sl.desc)}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Birth Time Rectification */}
      <LessonSection title={t('rectTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('rectContent')}</p>
        <div className="space-y-2">
          {INLINE_RECTMETHODS.map((method, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span className="text-gold-primary mt-0.5">&#x2022;</span>
              <span className="text-text-secondary" style={bodyFont}>{tObj(method)}</span>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Lagna in Muhurta / Puja Timing */}
      <LessonSection title={t('muhurtaTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('muhurtaContent')}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {INLINE_MUHURTALAGNAS.map((ml, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.04 }}
              className="p-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl">
              <span className="text-gold-light font-semibold text-sm" style={headingFont}>{tObj(ml.sign)}</span>
              <p className="text-text-secondary text-xs mt-1" style={bodyFont}>{tObj(ml.use)}</p>
            </motion.div>
          ))}
        </div>
        <div className="p-3 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] rounded-lg border border-red-500/10 mb-3">
          <p className="text-red-400/80 text-sm" style={bodyFont}>{t('muhurtaAvoid')}</p>
        </div>
        <div className="p-3 bg-gold-primary/5 rounded-lg border border-gold-primary/20">
          <p className="text-gold-primary/80 text-sm" style={bodyFont}>
            {t('muhurtaOurTool')}{' '}
            <Link href="/panchang" className="text-gold-light underline hover:text-gold-primary">{t('viewLagnaWindows')}</Link>
          </p>
        </div>
      </LessonSection>

      {/* Lagna vs Moon vs Sun */}
      <LessonSection title={t('lagnaVsMoonTitle')}>
        <p className="text-text-secondary leading-relaxed mb-4" style={bodyFont}>{t('lagnaVsMoonContent')}</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gold-primary border-b border-gold-primary/10">
                <th className="text-left py-2 px-3">{t('tableReference')}</th>
                <th className="text-left py-2 px-3">{t('tableGoverns')}</th>
                <th className="text-right py-2 px-3">{t('tableChanges')}</th>
              </tr>
            </thead>
            <tbody>
              {INLINE_COMPARISON.map((row, i) => (
                <tr key={i} className="border-b border-gold-primary/5 text-text-secondary">
                  <td className="py-2 px-3 text-gold-light font-semibold" style={headingFont}>{tObj(row.aspect)}</td>
                  <td className="py-2 px-3" style={bodyFont}>{tObj(row.governs)}</td>
                  <td className="py-2 px-3 text-right text-text-tertiary">{tObj(row.changes)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Misconceptions */}
      <LessonSection title={t('misconceptionsTitle')}>
        <div className="space-y-4">
          {INLINE_MISCONCEPTIONS.map((mc, i) => (
            <div key={i} className="p-4 bg-bg-primary/30 rounded-lg border border-gold-primary/10">
              <p className="text-red-400 text-sm font-semibold mb-1" style={bodyFont}>{tObj(mc.myth)}</p>
              <p className="text-text-secondary text-sm" style={bodyFont}>{tObj(mc.truth)}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Classical References */}
      <LessonSection title={t('classicalTitle')}>
        <p className="text-text-secondary leading-relaxed" style={bodyFont}>{t('classicalContent')}</p>
      </LessonSection>

      {/* Cross-references */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 text-center space-y-3">
        <h3 className="text-gold-gradient text-lg font-bold" style={headingFont}>{t('continueLearning')}</h3>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { href: '/learn/bhavas', label: t('linkBhavas') },
            { href: '/learn/grahas', label: t('linkGrahas') },
            { href: '/learn/kundali', label: t('linkKundali') },
            { href: '/learn/rashis', label: t('linkRashis') },
            { href: '/learn/vargas', label: t('linkVargas') },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="px-4 py-2 rounded-lg border border-gold-primary/20 text-gold-primary text-sm hover:bg-gold-primary/10 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

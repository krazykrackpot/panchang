'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
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
            {!isDevanagariLocale(locale) ? 'How our Varshaphal engine works:' : 'हमारा वर्षफल इंजन कैसे काम करता है:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {!isDevanagariLocale(locale) ? 'Find exact JD when Sun returns to birth longitude (binary search)' : 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {!isDevanagariLocale(locale) ? 'Compute full chart for that moment (all 9 planets + houses)' : 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {!isDevanagariLocale(locale) ? 'Muntha = (Birth Lagna sign + age) mod 12' : 'मुन्था = (जन्म लग्न राशि + आयु) mod 12'}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {!isDevanagariLocale(locale) ? 'Calculate 16 Sahams (sensitive points for life areas)' : '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {!isDevanagariLocale(locale) ? 'Generate Mudda Dasha (year-compressed planetary periods)' : 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {!isDevanagariLocale(locale) ? 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)' : 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)'}</p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{t('varshaphalCalc')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Tajika Yogas — Unique to Varshaphal:' : 'ताजिक योग — वर्षफल के लिए विशिष्ट:'}
          </p>
          <p className="text-amber-200/80 text-xs leading-relaxed">{t('tajikaYogas')}</p>
        </div>
      </LessonSection>

      {/* 2. KP System */}
      <LessonSection number={2} title={t('kpTitle')}>
        <p>{t('kpContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'KP Sub-Lord Division Example:' : 'KP उप-स्वामी विभाजन उदाहरण:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {!isDevanagariLocale(locale) ? 'Ashwini Nakshatra (0°00\' — 13°20\' Aries):' : 'अश्विनी नक्षत्र (0°00\' — 13°20\' मेष):'}
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
            {!isDevanagariLocale(locale) ? 'The Significator Table — Heart of KP:' : 'कारक तालिका — KP का हृदय:'}
          </p>
          <p className="text-blue-200/80 text-xs leading-relaxed">{t('kpSignificator')}</p>
        </div>
      </LessonSection>

      {/* 3. Prashna */}
      <LessonSection number={3} title={t('prashnaTitle')}>
        <p>{t('prashnaContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-purple-400/20">
          <p className="text-purple-300 font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Ashtamangala Prashna — Kerala Tradition:' : 'अष्टमंगल प्रश्न — केरल परम्परा:'}
          </p>
          <p className="text-purple-200/80 font-mono text-xs">{t('ashtamangalaContent')}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { item: !isDevanagariLocale(locale) ? 'Mirror' : 'दर्पण', meaning: !isDevanagariLocale(locale) ? 'Self-reflection, clarity' : 'आत्मचिन्तन, स्पष्टता' },
            { item: !isDevanagariLocale(locale) ? 'Vessel' : 'कलश', meaning: !isDevanagariLocale(locale) ? 'Abundance, containment' : 'प्रचुरता, धारण' },
            { item: !isDevanagariLocale(locale) ? 'Gold Fish' : 'स्वर्णमीन', meaning: !isDevanagariLocale(locale) ? 'Prosperity, fertility' : 'समृद्धि, उर्वरता' },
            { item: !isDevanagariLocale(locale) ? 'Lamp' : 'दीप', meaning: !isDevanagariLocale(locale) ? 'Wisdom, dispelling darkness' : 'ज्ञान, अन्धकार निवारण' },
            { item: !isDevanagariLocale(locale) ? 'Throne' : 'सिंहासन', meaning: !isDevanagariLocale(locale) ? 'Authority, power' : 'अधिकार, शक्ति' },
            { item: !isDevanagariLocale(locale) ? 'Bull' : 'वृषभ', meaning: !isDevanagariLocale(locale) ? 'Strength, dharma' : 'बल, धर्म' },
            { item: !isDevanagariLocale(locale) ? 'Flag' : 'ध्वज', meaning: !isDevanagariLocale(locale) ? 'Victory, announcement' : 'विजय, घोषणा' },
            { item: !isDevanagariLocale(locale) ? 'Fan' : 'व्यजन', meaning: !isDevanagariLocale(locale) ? 'Royal service, comfort' : 'राजसेवा, सुविधा' },
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
            {!isDevanagariLocale(locale) ? 'Multi-Factor Scoring Example (Marriage):' : 'बहु-कारक अंकन उदाहरण (विवाह):'}
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
            {!isDevanagariLocale(locale) ? 'The Six Components:' : 'छह घटक:'}
          </p>
          <p className="text-gold-light/80 text-xs leading-relaxed">{t('shadbalaComponents')}</p>
        </div>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-amber-400/15">
          <p className="text-amber-300 font-mono text-sm mb-2">
            {!isDevanagariLocale(locale) ? 'Minimum Shadbala Thresholds (in Rupas):' : 'न्यूनतम षड्बल सीमा (रूपों में):'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { planet: !isDevanagariLocale(locale) ? 'Sun' : 'सूर्य', threshold: '6.5' },
              { planet: !isDevanagariLocale(locale) ? 'Moon' : 'चन्द्र', threshold: '6.0' },
              { planet: !isDevanagariLocale(locale) ? 'Mars' : 'मंगल', threshold: '5.0' },
              { planet: !isDevanagariLocale(locale) ? 'Mercury' : 'बुध', threshold: '7.0' },
              { planet: !isDevanagariLocale(locale) ? 'Jupiter' : 'गुरु', threshold: '6.5' },
              { planet: !isDevanagariLocale(locale) ? 'Venus' : 'शुक्र', threshold: '5.5' },
              { planet: !isDevanagariLocale(locale) ? 'Saturn' : 'शनि', threshold: '5.0' },
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
            {!isDevanagariLocale(locale) ? 'Sarvashtakavarga Score Interpretation:' : 'सर्वाष्टकवर्ग अंक व्याख्या:'}
          </p>
          <div className="space-y-1 text-xs">
            <p className="text-emerald-300 font-mono">30-56 {!isDevanagariLocale(locale) ? 'Bindus: Strong sign — favorable transits, strong house' : 'बिन्दु: प्रबल राशि — अनुकूल गोचर'}</p>
            <p className="text-amber-300 font-mono">25-29 {!isDevanagariLocale(locale) ? 'Bindus: Average — mixed results during transits' : 'बिन्दु: सामान्य — मिश्रित परिणाम'}</p>
            <p className="text-red-300 font-mono">0-24  {!isDevanagariLocale(locale) ? 'Bindus: Weak sign — challenging transits, weak house' : 'बिन्दु: दुर्बल राशि — कठिन गोचर'}</p>
          </div>
        </div>
      </LessonSection>

      {/* 7. Putting It Together */}
      <LessonSection number={7} title={t('practiceTitle')} variant="highlight">
        <p>{t('practiceContent')}</p>

        <div className="mt-4 mb-6">
          <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
            {!isDevanagariLocale(locale) ? 'Related Learn Modules' : 'सम्बन्धित शिक्षा मॉड्यूल'}
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

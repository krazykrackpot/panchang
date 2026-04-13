'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LJ from '@/messages/learn/dashas.json';
import { getHeadingFont, getBodyFont, isIndicLocale } from '@/lib/utils/locale-fonts';

const t_ = LJ as unknown as Record<string, LocaleText>;



const DASHA_PERIODS = [
  { planet: 'Ketu', planetHi: 'केतु', planetSa: 'केतुः', years: 7, color: '#9ca3af', nakshatras: 'Ashwini, Magha, Moola', nakshatrasHi: 'अश्विनी, मघा, मूल' },
  { planet: 'Venus', planetHi: 'शुक्र', planetSa: 'शुक्रः', years: 20, color: '#ec4899', nakshatras: 'Bharani, P.Phalguni, P.Ashadha', nakshatrasHi: 'भरणी, पू.फाल्गुनी, पू.आषाढ़ा' },
  { planet: 'Sun', planetHi: 'सूर्य', planetSa: 'सूर्यः', years: 6, color: '#f59e0b', nakshatras: 'Krittika, U.Phalguni, U.Ashadha', nakshatrasHi: 'कृत्तिका, उ.फाल्गुनी, उ.आषाढ़ा' },
  { planet: 'Moon', planetHi: 'चन्द्र', planetSa: 'चन्द्रः', years: 10, color: '#e2e8f0', nakshatras: 'Rohini, Hasta, Shravana', nakshatrasHi: 'रोहिणी, हस्त, श्रवण' },
  { planet: 'Mars', planetHi: 'मंगल', planetSa: 'मङ्गलः', years: 7, color: '#ef4444', nakshatras: 'Mrigashira, Chitra, Dhanishta', nakshatrasHi: 'मृगशिरा, चित्रा, धनिष्ठा' },
  { planet: 'Rahu', planetHi: 'राहु', planetSa: 'राहुः', years: 18, color: '#6366f1', nakshatras: 'Ardra, Swati, Shatabhisha', nakshatrasHi: 'आर्द्रा, स्वाती, शतभिषा' },
  { planet: 'Jupiter', planetHi: 'गुरु', planetSa: 'गुरुः', years: 16, color: '#f0d48a', nakshatras: 'Punarvasu, Vishakha, P.Bhadra', nakshatrasHi: 'पुनर्वसु, विशाखा, पू.भाद्रपद' },
  { planet: 'Saturn', planetHi: 'शनि', planetSa: 'शनिः', years: 19, color: '#3b82f6', nakshatras: 'Pushya, Anuradha, U.Bhadra', nakshatrasHi: 'पुष्य, अनुराधा, उ.भाद्रपद' },
  { planet: 'Mercury', planetHi: 'बुध', planetSa: 'बुधः', years: 17, color: '#22c55e', nakshatras: 'Ashlesha, Jyeshtha, Revati', nakshatrasHi: 'आश्लेषा, ज्येष्ठा, रेवती' },
];

const OTHER_DASHA_SYSTEMS = [
  {
    name: { en: 'Yogini Dasha', hi: 'योगिनी दशा', sa: 'योगिनीदशा' },
    cycle: '36 years',
    planets: '8',
    desc: { en: 'Uses 8 Yoginis (Mangala, Pingala, Dhanya, Bhramari, Bhadrika, Ulka, Siddha, Sankata) mapped to planets. Shorter cycle makes it effective for quick-results timing. Popular in North India.', hi: '8 योगिनियों का उपयोग — छोटा चक्र त्वरित फल समय निर्धारण के लिए प्रभावी। उत्तर भारत में लोकप्रिय।', sa: '8 योगिनीनां प्रयोगः — लघुचक्रं त्वरितफलकालनिर्धारणे प्रभावी।' },
    when: { en: 'Quick timing, North Indian tradition, when Vimshottari seems off', hi: 'त्वरित समय, उत्तर भारतीय परम्परा', sa: 'त्वरितकालनिर्धारणम्' },
  },
  {
    name: { en: 'Ashtottari Dasha', hi: 'अष्टोत्तरी दशा', sa: 'अष्टोत्तरीदशा' },
    cycle: '108 years',
    planets: '8 (excludes Ketu)',
    desc: { en: 'A 108-year cycle using 8 planets (Ketu excluded). Prescribed when Rahu is in a Kendra or Trikona from Lagna lord, or when birth is during Krishna Paksha daytime or Shukla Paksha nighttime.', hi: '108 वर्ष का चक्र, 8 ग्रह (केतु छोड़कर)। राहु लग्नेश से केन्द्र या त्रिकोण में हो तब विहित।', sa: '108 वर्षाणां चक्रं, 8 ग्रहाः (केतुः वर्जितः)।' },
    when: { en: 'Rahu in Kendra/Trikona from Lagna lord, specific birth-time conditions', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में', sa: 'राहुः लग्नेशात् केन्द्रे/त्रिकोणे' },
  },
  {
    name: { en: 'Chara Dasha (Jaimini)', hi: 'चर दशा (जैमिनी)', sa: 'चरदशा (जैमिनीया)' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'A sign-based (rashi) dasha from Jaimini system. Each sign runs for a period determined by its lord\'s distance from it. Uses Chara Karakas (variable significators) instead of fixed planetary rulers. Powerful for career and relationship timing.', hi: 'जैमिनी प्रणाली की राशि-आधारित दशा। प्रत्येक राशि उसके स्वामी की दूरी से निर्धारित अवधि तक चलती है। चर कारकों का प्रयोग।', sa: 'जैमिनीपद्धत्याः राश्याधारिता दशा।' },
    when: { en: 'Jaimini astrology, career/relationship predictions, sign-based analysis', hi: 'जैमिनी ज्योतिष, करियर/सम्बन्ध भविष्यवाणी', sa: 'जैमिनीज्योतिषम्, जीविका/सम्बन्धभविष्यवाणी' },
  },
  {
    name: { en: 'Kalachakra Dasha', hi: 'कालचक्र दशा', sa: 'कालचक्रदशा' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'An extremely complex sign-based dasha that moves in a serpentine (savya/apsavya) pattern through the zodiac. Considered highly accurate by scholars but difficult to compute manually. Based on the Moon\'s Navamsa position.', hi: 'अत्यन्त जटिल राशि-आधारित दशा जो सर्पाकार (सव्य/अपसव्य) पैटर्न में चलती है। विद्वानों द्वारा अत्यन्त सटीक माना जाता है।', sa: 'अत्यन्तजटिला राश्याधारिता दशा या सर्पाकारपद्धत्या चलति।' },
    when: { en: 'Advanced practitioners, when other systems give contradictory results', hi: 'उन्नत अभ्यासकर्ता, जब अन्य प्रणालियाँ विरोधाभासी परिणाम दें', sa: 'उन्नतप्रयोक्तारः' },
  },
];

const MAHADASHA_THEMES = [
  { planet: 'Ketu', planetHi: 'केतु', years: 7, color: '#9ca3af', themes: { en: 'Spiritual awakening, detachment, loss and letting go, past-life karma surfacing, sudden changes, isolation, research, occult interests. Often starts life with confusion about direction.', hi: 'आध्यात्मिक जागृति, वैराग्य, हानि, पूर्वजन्म कर्म, अचानक परिवर्तन, एकान्त, शोध, गूढ़ रुचियाँ।' } },
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, color: '#ec4899', themes: { en: 'Romance, marriage, luxury, artistic pursuits, vehicles, comfort, financial gains, beauty, partnerships. The longest Dasha — often defines the prime creative and romantic years.', hi: 'रोमांस, विवाह, विलास, कलात्मक गतिविधियाँ, वाहन, आराम, वित्तीय लाभ, सौन्दर्य। सबसे लम्बी दशा — प्रमुख रचनात्मक और रोमांटिक वर्षों को परिभाषित करती है।' } },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, color: '#f59e0b', themes: { en: 'Career authority, government connections, father-related events, self-confidence, leadership, health vitality, ego development, recognition. Short but impactful.', hi: 'करियर अधिकार, सरकारी सम्पर्क, पिता सम्बन्धित घटनाएँ, आत्मविश्वास, नेतृत्व, स्वास्थ्य, मान्यता। छोटी लेकिन प्रभावशाली।' } },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, color: '#e2e8f0', themes: { en: 'Emotional growth, mother-related events, mental peace (or disturbance if afflicted), travel, public life, nurturing, domestic changes, intuition development.', hi: 'भावनात्मक विकास, माता सम्बन्धित घटनाएँ, मानसिक शान्ति, यात्रा, सार्वजनिक जीवन, पोषण, घरेलू परिवर्तन, अन्तर्ज्ञान।' } },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, color: '#ef4444', themes: { en: 'Property, land, siblings, courage, surgery, competition, physical energy, technical skills, disputes, construction. High-energy period with risk of accidents if afflicted.', hi: 'सम्पत्ति, भूमि, भाई-बहन, साहस, शल्य, प्रतियोगिता, शारीरिक ऊर्जा, तकनीकी कौशल, विवाद। उच्च-ऊर्जा काल।' } },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, color: '#6366f1', themes: { en: 'Foreign connections, unconventional paths, technology, obsessive desires, material ambition, illusions, sudden rise or fall, breaking taboos, innovation. Can give extraordinary worldly success or deep confusion.', hi: 'विदेश सम्पर्क, अपरम्परागत मार्ग, प्रौद्योगिकी, जुनूनी इच्छाएँ, भौतिक महत्वाकांक्षा, माया, अचानक उत्थान या पतन। असाधारण सांसारिक सफलता या गहरा भ्रम।' } },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, color: '#f0d48a', themes: { en: 'Wisdom, children, education, dharma, wealth expansion, marriage (for women), spiritual growth, teaching, legal matters, optimism. Generally the most auspicious period.', hi: 'ज्ञान, संतान, शिक्षा, धर्म, धन विस्तार, विवाह (महिलाओं के लिए), आध्यात्मिक वृद्धि, शिक्षण। सामान्यतः सर्वाधिक शुभ काल।' } },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, color: '#3b82f6', themes: { en: 'Hard work, discipline, career structure, service, longevity, chronic health matters, karma, delays that build character, responsibility, democratic values, justice. Slow but lasting results.', hi: 'कठिन परिश्रम, अनुशासन, करियर संरचना, सेवा, दीर्घायु, दीर्घकालिक स्वास्थ्य, कर्म, चरित्र निर्माण, उत्तरदायित्व। धीमे लेकिन स्थायी परिणाम।' } },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, color: '#22c55e', themes: { en: 'Business, commerce, communication, writing, learning, friendships, intellectual pursuits, adaptability, travel for education, maternal uncle. Period of mental agility and versatility.', hi: 'व्यापार, वाणिज्य, संवाद, लेखन, विद्या, मित्रता, बौद्धिक गतिविधियाँ, अनुकूलनशीलता। मानसिक चपलता और बहुमुखता का काल।' } },
];

const VENUS_ANTARDASHA_EXAMPLE = [
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, duration: '(20x20)/120 = 3y 4m', durationHi: '(20x20)/120 = 3 वर्ष 4 माह' },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, duration: '(20x6)/120 = 1y 0m', durationHi: '(20x6)/120 = 1 वर्ष 0 माह' },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, duration: '(20x10)/120 = 1y 8m', durationHi: '(20x10)/120 = 1 वर्ष 8 माह' },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, duration: '(20x18)/120 = 3y 0m', durationHi: '(20x18)/120 = 3 वर्ष 0 माह' },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, duration: '(20x16)/120 = 2y 8m', durationHi: '(20x16)/120 = 2 वर्ष 8 माह' },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, duration: '(20x19)/120 = 3y 2m', durationHi: '(20x19)/120 = 3 वर्ष 2 माह' },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, duration: '(20x17)/120 = 2y 10m', durationHi: '(20x17)/120 = 2 वर्ष 10 माह' },
  { planet: 'Ketu', planetHi: 'केतु', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
];

const EVENT_TIMING = [
  { event: { en: 'Marriage', hi: 'विवाह' }, dashas: { en: 'Venus Dasha, Jupiter Dasha (for women), 7th lord Dasha, Venus Antardasha in any benefic Dasha', hi: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा' }, color: '#ec4899' },
  { event: { en: 'Career Rise', hi: 'करियर उन्नति' }, dashas: { en: 'Sun Dasha, Saturn Dasha (10th lord), 10th lord Dasha, Yogakaraka Dasha. Saturn-Sun or Sun-Saturn periods for government positions.', hi: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।' }, color: '#f59e0b' },
  { event: { en: 'Children', hi: 'संतान' }, dashas: { en: 'Jupiter Dasha (primary karaka for children), 5th lord Dasha, Venus Antardasha in Jupiter Dasha, Putrakaraka Dasha (Jaimini).', hi: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।' }, color: '#f0d48a' },
  { event: { en: 'Education', hi: 'शिक्षा' }, dashas: { en: 'Mercury Dasha, Jupiter Dasha, 4th/5th/9th lord Dasha. Higher education peaks during Jupiter periods; technical skills during Mercury or Mars.', hi: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।' }, color: '#22c55e' },
  { event: { en: 'Foreign Travel/Settlement', hi: 'विदेश यात्रा/बसना' }, dashas: { en: 'Rahu Dasha (primary), 12th lord Dasha, Moon Dasha (if 12th lord or in 12th), Ketu Dasha for spiritual pilgrimages abroad.', hi: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।' }, color: '#6366f1' },
  { event: { en: 'Health Crisis', hi: 'स्वास्थ्य संकट' }, dashas: { en: 'Dasha of planets in 6th/8th house, Dasha of debilitated planets, Saturn Dasha (chronic conditions), Mars Dasha (surgery, accidents), Ketu Dasha (mysterious ailments).', hi: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।' }, color: '#ef4444' },
];

export default function LearnDashasPage() {
  const t = (key: string) => lt(t_[key], locale);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tObj = (obj: any) => (obj as Record<string, string>)[locale] || obj?.en || '';
  const locale = useLocale();
  const isHi = isIndicLocale(locale);
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
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Dasa" meaning="Planetary Period" />
        <SanskritTermCard term="Maha Dasha" devanagari="महादशा" transliteration="Mahadasa" meaning="Major Period (years)" />
        <SanskritTermCard term="Antardasha" devanagari="अन्तर्दशा" transliteration="Antardasa" meaning="Sub-period (months)" />
        <SanskritTermCard term="Pratyantara" devanagari="प्रत्यन्तर" transliteration="Pratyantara" meaning="Sub-sub-period (days)" />
        <SanskritTermCard term="Vimshottari" devanagari="विंशोत्तरी" transliteration="Vimsottari" meaning="Of 120 (years)" />
      </div>

      {/* Section 1: What is a Dasha */}
      <LessonSection number={1} title={t('whatTitle')}>
        <p style={bodyFont}>{t('whatContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('whatContent2')}</p>
      </LessonSection>

      {/* Section 2: Vimshottari System */}
      <LessonSection number={2} title={t('vimshottariTitle')}>
        <p style={bodyFont}>{t('vimshottariContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('vimshottariContent2')}</p>

        {/* Dasha periods visual bar chart */}
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
                {!isIndicLocale(locale) ? d.planet : d.planetHi}
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
                {d.years} {!isIndicLocale(locale) ? 'yrs' : 'वर्ष'}
              </div>
              <div className="text-text-secondary/75 text-xs hidden sm:block">
                {isHi ? d.nakshatrasHi : d.nakshatras}
              </div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/70 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {!isIndicLocale(locale) ? 'years' : 'वर्ष'}
          </div>
        </div>
      </LessonSection>

      {/* Section 3: Full reference table */}
      <LessonSection number={3} title={t('birthNakshatraTitle')}>
        <p style={bodyFont}>{t('birthNakshatraContent')}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Years' : 'वर्ष'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Ruling Nakshatras (1-9)' : 'शासित नक्षत्र (1-9)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? '(10-18)' : '(10-18)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? '(19-27)' : '(19-27)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {DASHA_PERIODS.map((d) => {
                const naks = d.nakshatras.split(', ');
                return (
                  <tr key={d.planet} className="hover:bg-gold-primary/3">
                    <td className="py-2 px-2 font-medium" style={{ color: d.color }}>
                      {!isIndicLocale(locale) ? d.planet : d.planetHi}
                    </td>
                    <td className="py-2 px-2 text-text-secondary font-mono">{d.years}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[0]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[1]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 4: Calculating Dasha Balance */}
      <LessonSection number={4} title={t('calcTitle')}>
        <p style={bodyFont}>{t('calcContent')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Step-by-Step Calculation:' : 'चरणबद्ध गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {!isIndicLocale(locale) ? 'Find Moon\'s Nakshatra at birth (e.g., Pushya)' : 'जन्म के समय चन्द्र का नक्षत्र ज्ञात करें (जैसे, पुष्य)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {!isIndicLocale(locale) ? 'Nakshatra lord = Dasha lord at birth (Pushya lord = Saturn)' : 'नक्षत्र स्वामी = जन्म पर दशा स्वामी (पुष्य स्वामी = शनि)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {!isIndicLocale(locale) ? 'Moon\'s progress through Nakshatra = elapsed portion of Dasha' : 'नक्षत्र में चन्द्र की प्रगति = दशा का बीता हुआ भाग'}</p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">
            {!isIndicLocale(locale) ? 'Example: Moon at 10° in Pushya (3°20\' to 16°40\')' : 'उदाहरण: पुष्य में चन्द्र 10° पर (3°20\' से 16°40\')'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {!isIndicLocale(locale) ? 'Progress = (10° - 3.333°) / 13.333° = 50%' : 'प्रगति = (10° - 3.333°) / 13.333° = 50%'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {!isIndicLocale(locale) ? 'Remaining Saturn Dasha = 19 × (1 - 0.50) = 9.5 years' : 'शेष शनि दशा = 19 × (1 - 0.50) = 9.5 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Worked example */}
      <LessonSection number={5} title={t('workedExampleTitle')}>
        <p style={bodyFont}>{t('workedExampleContent')}</p>
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <p className="text-gold-light font-mono text-sm mb-3">
              {!isIndicLocale(locale) ? 'Given: Moon at 14°30\' Aries (Mesha)' : 'दिया गया: मेष में चन्द्र 14°30\' पर'}
            </p>
            <div className="space-y-1.5 text-gold-light/80 font-mono text-xs">
              <p>{!isIndicLocale(locale) ? 'Step 1: Identify Nakshatra' : 'चरण 1: नक्षत्र पहचानें'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? '14°30\' Aries falls in Bharani (13°20\' - 26°40\' Aries)' : '14°30\' मेष भरणी में आता है (13°20\' - 26°40\' मेष)'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 2: Nakshatra lord' : 'चरण 2: नक्षत्र स्वामी'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Bharani lord = Venus → Birth Dasha = Venus Maha Dasha' : 'भरणी स्वामी = शुक्र → जन्म दशा = शुक्र महादशा'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 3: Calculate progress through Nakshatra' : 'चरण 3: नक्षत्र में प्रगति गणना'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Moon position within Bharani = 14°30\' - 13°20\' = 1°10\' = 1.167°' : 'भरणी में चन्द्र स्थिति = 14°30\' - 13°20\' = 1°10\' = 1.167°'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Nakshatra span = 13°20\' = 13.333°' : 'नक्षत्र विस्तार = 13°20\' = 13.333°'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Progress = 1.167 / 13.333 = 8.75% elapsed' : 'प्रगति = 1.167 / 13.333 = 8.75% बीता'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 4: Calculate remaining Dasha' : 'चरण 4: शेष दशा गणना'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Venus total = 20 years' : 'शुक्र कुल = 20 वर्ष'}</p>
              <p className="pl-4">{!isIndicLocale(locale) ? 'Remaining = 20 × (1 - 0.0875) = 18.25 years = 18 years 3 months' : 'शेष = 20 × (1 - 0.0875) = 18.25 वर्ष = 18 वर्ष 3 माह'}</p>
              <p className="mt-2">{!isIndicLocale(locale) ? 'Step 5: Sequence after Venus' : 'चरण 5: शुक्र के बाद का क्रम'}</p>
              <p className="pl-4 text-gold-light/60">{locale === 'en'
                ? 'Venus (18y 3m remaining) → Sun (6y) → Moon (10y) → Mars (7y) → Rahu (18y) → Jupiter (16y) → Saturn (19y) → Mercury (17y) → Ketu (7y)'
                : 'शुक्र (18 वर्ष 3 माह शेष) → सूर्य (6) → चन्द्र (10) → मंगल (7) → राहु (18) → गुरु (16) → शनि (19) → बुध (17) → केतु (7)'}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Sub-periods hierarchy */}
      <LessonSection number={6} title={t('subTitle')}>
        <p style={bodyFont}>{t('subContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('subContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'Antardasha Duration Formula:' : 'अन्तर्दशा अवधि सूत्र:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Antardasha of B in Maha Dasha of A = (Years_A x Years_B) / 120
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Example: Mercury Antardasha in Saturn Maha Dasha = (19 x 17) / 120 = 2.69 years ~ 2 yrs 8 months 9 days'
              : 'उदाहरण: शनि महादशा में बुध अन्तर्दशा = (19 x 17) / 120 = 2.69 वर्ष ~ 2 वर्ष 8 माह 9 दिन'}
          </p>
        </div>

        {/* Sub-period hierarchy visual */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { level: { en: 'Maha Dasha', hi: 'महादशा' }, duration: { en: 'Years', hi: 'वर्ष' }, example: { en: 'Saturn: 19 years', hi: 'शनि: 19 वर्ष' }, color: 'border-gold-primary/30 bg-gold-primary/5' },
            { level: { en: 'Antardasha', hi: 'अन्तर्दशा' }, duration: { en: 'Months', hi: 'माह' }, example: { en: 'Sa-Me: 2y 8m', hi: 'शनि-बुध: 2 वर्ष 8 माह' }, color: 'border-blue-400/30 bg-blue-400/5' },
            { level: { en: 'Pratyantara', hi: 'प्रत्यन्तर' }, duration: { en: 'Weeks', hi: 'सप्ताह' }, example: { en: 'Sa-Me-Ve: ~5m', hi: 'शनि-बुध-शुक्र: ~5 माह' }, color: 'border-violet-400/30 bg-violet-400/5' },
            { level: { en: 'Sookshma', hi: 'सूक्ष्म' }, duration: { en: 'Days', hi: 'दिन' }, example: { en: '~2-10 days', hi: '~2-10 दिन' }, color: 'border-emerald-400/30 bg-emerald-400/5' },
            { level: { en: 'Prana', hi: 'प्राण' }, duration: { en: 'Hours', hi: 'घण्टे' }, example: { en: '~hours', hi: '~घण्टे' }, color: 'border-amber-400/30 bg-amber-400/5' },
          ].map((item, i) => (
            <motion.div
              key={item.level.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-lg p-3 border ${item.color}`}
            >
              <div className="text-gold-light text-xs font-bold mb-1" style={headingFont}>{isHi ? item.level.hi : item.level.en}</div>
              <div className="text-text-secondary text-xs font-mono">{isHi ? item.duration.hi : item.duration.en}</div>
              <div className="text-text-tertiary text-xs mt-1">{isHi ? item.example.hi : item.example.en}</div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 7: Other Dasha Systems */}
      <LessonSection number={7} title={t('otherTitle')}>
        <p style={bodyFont}>{t('otherContent')}</p>
        <div className="mt-4 space-y-3">
          {OTHER_DASHA_SYSTEMS.map((sys, i) => (
            <motion.div
              key={sys.name.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-bold text-sm" style={headingFont}>{tObj(sys.name)}</span>
                <span className="text-text-tertiary text-xs font-mono">{sys.cycle} / {sys.planets} {!isIndicLocale(locale) ? 'planets' : 'ग्रह'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{tObj(sys.desc)}</p>
              <div className="mt-2 text-xs text-emerald-400/80 font-mono">
                {!isIndicLocale(locale) ? 'Best used when: ' : 'सर्वोत्तम उपयोग: '}{tObj(sys.when)}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Interpretation */}
      <LessonSection number={8} title={t('interpretTitle')} variant="highlight">
        <p style={bodyFont}>{t('interpretContent')}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: { en: 'Benefic Dasha Lord in Kendra/Trikona', hi: 'शुभ दशा स्वामी केन्द्र/त्रिकोण में', sa: 'शुभदशास्वामी केन्द्रे/त्रिकोणे' }, result: { en: 'Prosperity, success, good health', hi: 'समृद्धि, सफलता, अच्छा स्वास्थ्य', sa: 'समृद्धिः, सफलता, सुस्वास्थ्यम्' }, color: 'emerald' },
            { label: { en: 'Dasha Lord in Dusthana (6,8,12)', hi: 'दशा स्वामी दुःस्थान (6,8,12) में', sa: 'दशास्वामी दुःस्थाने (6,8,12)' }, result: { en: 'Challenges, health issues, obstacles', hi: 'कठिनाइयाँ, स्वास्थ्य समस्याएँ, बाधाएँ', sa: 'कठिनतायाः, स्वास्थ्यसमस्याः, बाधाः' }, color: 'red' },
            { label: { en: 'Dasha Lord exalted or in own sign', hi: 'दशा स्वामी उच्च या स्वराशि में', sa: 'दशास्वामी उच्चे स्वराशौ वा' }, result: { en: 'Enhanced positive results', hi: 'उन्नत शुभ परिणाम', sa: 'उन्नतशुभफलानि' }, color: 'emerald' },
            { label: { en: 'Dasha Lord debilitated or combust', hi: 'दशा स्वामी नीच या अस्त', sa: 'दशास्वामी नीचे अस्ते वा' }, result: { en: 'Weakened results, delays', hi: 'कमज़ोर परिणाम, देरी', sa: 'दुर्बलफलानि, विलम्बः' }, color: 'amber' },
            { label: { en: 'Yogakaraka Dasha (owns Kendra + Trikona)', hi: 'योगकारक दशा (केन्द्र + त्रिकोण स्वामी)', sa: 'योगकारकदशा (केन्द्र + त्रिकोणस्वामी)' }, result: { en: 'Raja Yoga results — power, wealth, status', hi: 'राजयोग फल — शक्ति, धन, प्रतिष्ठा', sa: 'राजयोगफलानि — शक्तिः, धनं, प्रतिष्ठा' }, color: 'emerald' },
            { label: { en: 'Maha Dasha & Antardasha lords are enemies', hi: 'महादशा और अन्तर्दशा स्वामी शत्रु', sa: 'महादशा-अन्तर्दशास्वामिनौ शत्रू' }, result: { en: 'Internal conflict, contradictory events', hi: 'आन्तरिक संघर्ष, विरोधाभासी घटनाएँ', sa: 'आन्तरिकसंघर्षः, विरोधाभासीघटनाः' }, color: 'red' },
          ].map((item) => {
            const colorClasses: Record<string, string> = {
              emerald: 'border-emerald-400/20 bg-emerald-400/5 text-emerald-400',
              amber: 'border-amber-400/20 bg-amber-400/5 text-amber-400',
              red: 'border-red-400/20 bg-red-400/5 text-red-400',
            };
            const cls = colorClasses[item.color] || colorClasses.amber;
            return (
            <div key={item.label.en} className={`rounded-lg p-3 border ${cls.split(' ').slice(0, 2).join(' ')}`}>
              <div className={`${cls.split(' ')[2]} text-sm font-semibold mb-1`} style={headingFont}>{tObj(item.label)}</div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{tObj(item.result)}</div>
            </div>
            );
          })}
        </div>
      </LessonSection>

      {/* Section 9: When to use which system */}
      <LessonSection number={9} title={t('preferenceTitle')}>
        <div className="space-y-3">
          {[
            { system: { en: 'Vimshottari', hi: 'विंशोत्तरी' }, condition: { en: 'Default system for all charts. Use unless specific conditions warrant another system. Works best when Moon is strong and well-placed.', hi: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।' }, color: '#f0d48a' },
            { system: { en: 'Yogini', hi: 'योगिनी' }, condition: { en: 'Cross-verify Vimshottari predictions. Shorter 36-year cycle catches micro-timing that Vimshottari may miss. Use as secondary confirmation.', hi: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।' }, color: '#ec4899' },
            { system: { en: 'Ashtottari', hi: 'अष्टोत्तरी' }, condition: { en: 'When Rahu is in Kendra/Trikona from Lagna lord, or the person is born during Krishna Paksha daytime / Shukla Paksha nighttime.', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।' }, color: '#6366f1' },
            { system: { en: 'Chara (Jaimini)', hi: 'चर (जैमिनी)' }, condition: { en: 'For career/relationship timing and when using Jaimini techniques (Chara Karakas, Padas). Best for event-specific predictions like marriage or job change.', hi: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।' }, color: '#22c55e' },
          ].map((item) => (
            <div key={item.system.en} className="flex gap-3 items-start">
              <div className="w-24 flex-shrink-0 text-sm font-bold text-right pt-0.5" style={{ color: item.color }}>
                {isHi ? item.system.hi : item.system.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? item.condition.hi : item.condition.en}
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 10: Finding Your Current Dasha */}
      <LessonSection number={10} title={t('findYourTitle')}>
        <p style={bodyFont}>{t('findYourContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('findYourContent2')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {!isIndicLocale(locale) ? 'How to find it:' : 'कैसे खोजें:'}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>1. {!isIndicLocale(locale) ? 'Go to /kundali and enter your birth details' : '/kundali पर जाएँ और जन्म विवरण दर्ज करें'}</p>
            <p>2. {!isIndicLocale(locale) ? 'Click on the "Dashas" tab in the results' : 'परिणामों में "दशा" टैब पर क्लिक करें'}</p>
            <p>3. {!isIndicLocale(locale) ? 'The highlighted row is your current Maha Dasha' : 'हाइलाइट पंक्ति आपकी वर्तमान महादशा है'}</p>
            <p>4. {!isIndicLocale(locale) ? 'Expand it to see Antardashas — the highlighted sub-row is your current Antardasha' : 'इसे विस्तार करें अन्तर्दशाएँ देखने के लिए — हाइलाइट उप-पंक्ति आपकी वर्तमान अन्तर्दशा है'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 11: Antardasha Calculation */}
      <LessonSection number={11} title={t('antardashaCalcTitle')}>
        <p style={bodyFont}>{t('antardashaCalcContent')}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {!isIndicLocale(locale) ? 'Venus Maha Dasha (20 years) — All 9 Antardashas' : 'शुक्र महादशा (20 वर्ष) — सभी 9 अन्तर्दशाएँ'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Antardasha' : 'अन्तर्दशा'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{!isIndicLocale(locale) ? 'Calculation' : 'गणना'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {VENUS_ANTARDASHA_EXAMPLE.map((ad) => (
                <tr key={ad.planet} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-medium text-text-secondary">
                    {!isIndicLocale(locale) ? `Venus-${ad.planet}` : `शुक्र-${ad.planetHi}`}
                  </td>
                  <td className="py-2 px-2 text-text-secondary font-mono">
                    {isHi ? ad.durationHi : ad.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-xs font-mono">
            {!isIndicLocale(locale) ? 'Total: 3y4m + 1y + 1y8m + 1y2m + 3y + 2y8m + 3y2m + 2y10m + 1y2m = 20 years' : 'कुल: 3वर्ष4माह + 1वर्ष + 1वर्ष8माह + 1वर्ष2माह + 3वर्ष + 2वर्ष8माह + 3वर्ष2माह + 2वर्ष10माह + 1वर्ष2माह = 20 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 12: Maha Dasha Themes */}
      <LessonSection number={12} title={t('mahadashaThemesTitle')}>
        <p style={bodyFont}>{t('mahadashaThemesContent')}</p>
        <div className="mt-4 space-y-3">
          {MAHADASHA_THEMES.map((md, i) => (
            <motion.div
              key={md.planet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: md.color }} />
                <span className="font-bold text-sm" style={{ color: md.color, ...headingFont }}>
                  {isHi ? md.planetHi : md.planet}
                </span>
                <span className="text-text-tertiary text-xs font-mono">{md.years} {!isIndicLocale(locale) ? 'years' : 'वर्ष'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {isHi ? md.themes.hi : md.themes.en}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 13: Dasha Sandhi */}
      <LessonSection number={13} title={t('sandhiTitle')} variant="highlight">
        <p style={bodyFont}>{t('sandhiContent')}</p>
        <p className="mt-3" style={bodyFont}>{t('sandhiContent2')}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { from: { en: 'Jupiter → Saturn', hi: 'गुरु → शनि' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Expansion → contraction. Optimism to reality check. Career restructuring.', hi: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Venus → Sun', hi: 'शुक्र → सूर्य' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Pleasure → duty. Partnership focus to individual authority. Lifestyle shift.', hi: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Saturn → Mercury', hi: 'शनि → बुध' }, friction: { en: 'Medium', hi: 'मध्यम' }, desc: { en: 'Heavy → light. Slow and deep to fast and versatile. Relief period.', hi: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।' }, color: 'border-amber-400/20 bg-amber-400/5' },
            { from: { en: 'Mercury → Ketu', hi: 'बुध → केतु' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Rational → mystical. Worldly activity to spiritual withdrawal. Confusion possible.', hi: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।' }, color: 'border-red-400/20 bg-red-400/5' },
          ].map((item) => (
            <div key={item.from.en} className={`rounded-lg p-3 border ${item.color}`}>
              <div className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
                {isHi ? item.from.hi : item.from.en}
              </div>
              <div className="text-text-tertiary text-xs font-mono mb-1">
                {!isIndicLocale(locale) ? `Friction: ${item.friction.en}` : `घर्षण: ${item.friction.hi}`}
              </div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{isHi ? item.desc.hi : item.desc.en}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 14: Event Timing */}
      <LessonSection number={14} title={t('eventTimingTitle')}>
        <p style={bodyFont}>{t('eventTimingContent')}</p>
        <div className="mt-4 space-y-3">
          {EVENT_TIMING.map((et, i) => (
            <motion.div
              key={et.event.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 items-start"
            >
              <div className="w-28 flex-shrink-0 text-right text-sm font-bold pt-0.5" style={{ color: et.color, ...headingFont }}>
                {isHi ? et.event.hi : et.event.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? et.dashas.hi : et.dashas.en}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 15: Related modules */}
      <LessonSection number={15} title={t('modulesTitle')}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/11-1', label: { en: 'Lesson 11-1: Vimshottari Dasha System', hi: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली' } },
            { href: '/learn/modules/11-2', label: { en: 'Lesson 11-2: Antardasha & Pratyantardasha', hi: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा' } },
            { href: '/learn/modules/11-3', label: { en: 'Lesson 11-3: Advanced Dasha Interpretation', hi: 'पाठ 11-3: उन्नत दशा व्याख्या' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
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

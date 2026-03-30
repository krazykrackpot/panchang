'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Advanced Jyotish — Predictive Systems', hi: 'उन्नत ज्योतिष — भविष्यवाणी प्रणालियाँ', sa: 'उन्नतज्योतिषम् — भविष्यवाणीपद्धतयः' },
  subtitle: { en: 'Varshaphal, KP System, Prashna, and Muhurta — four powerful predictive methods', hi: 'वर्षफल, KP प्रणाली, प्रश्न और मुहूर्त — चार शक्तिशाली भविष्यवाणी विधियाँ', sa: 'वर्षफलं, KP पद्धतिः, प्रश्नः, मुहूर्तः च — चत्वारः शक्तिशालभविष्यवाणीविधयः' },

  varshaphalTitle: { en: 'Varshaphal — Solar Return Charts', hi: 'वर्षफल — सौर प्रत्यावर्तन कुण्डली', sa: 'वर्षफलम् — सौरप्रत्यावर्तनकुण्डली' },
  varshaphalContent: {
    en: 'Varshaphal (Annual Horoscopy) is a Tajika system that creates a chart for the exact moment the Sun returns to its birth position each year. This "solar return" chart predicts events for the coming year. Key components include: Muntha (a progressed point that moves 1 sign per year), Sahams (sensitive points for specific life topics like marriage, children, fortune), and Mudda Dasha (a compressed planetary period system for the year).',
    hi: 'वर्षफल (वार्षिक ज्योतिष) एक ताजिक प्रणाली है जो प्रत्येक वर्ष सूर्य के अपनी जन्म स्थिति पर लौटने के सटीक क्षण की कुण्डली बनाती है। प्रमुख अवयव: मुन्था (एक प्रगत बिन्दु), सहम (विशिष्ट जीवन विषयों के लिए संवेदनशील बिन्दु), और मुद्दा दशा।',
    sa: 'वर्षफलं ताजिकपद्धतिः या प्रत्येकवर्षं सूर्यस्य जन्मस्थाने प्रत्यागमनस्य सूक्ष्मक्षणस्य कुण्डलीं रचयति।'
  },
  varshaphalCalc: {
    en: 'Our software calculates the exact Julian Day when the Sun\'s tropical longitude matches the birth Sun longitude (to within 0.001°). It then computes a full chart for that moment, determines the Muntha position (birth Lagna sign + years elapsed), calculates all 16 Sahams, and generates a Mudda Dasha timeline for the year.',
    hi: 'हमारा सॉफ़्टवेयर सटीक जूलियन दिन गणना करता है जब सूर्य का उष्णकटिबन्धीय देशान्तर जन्म सूर्य देशान्तर से मेल खाता है (0.001° तक)।',
    sa: 'अस्माकं सॉफ़्टवेयरं सूक्ष्मजूलियनदिनं गणयति यदा सूर्यस्य देशान्तरं जन्मसूर्यदेशान्तरेण मिलति।'
  },

  kpTitle: { en: 'KP System — Krishnamurti Paddhati', hi: 'KP प्रणाली — कृष्णमूर्ति पद्धति', sa: 'KP पद्धतिः — कृष्णमूर्तिपद्धतिः' },
  kpContent: {
    en: 'Developed by K.S. Krishnamurti in the 1960s, the KP System refines traditional Vedic astrology with precise house cusps (using the Placidus system instead of Whole-Sign) and a sub-lord theory. Each zodiac degree is ruled by 3 levels: Sign lord (30° divisions), Star lord (Nakshatra lord, 13°20\' divisions), and Sub-lord (subdivisions proportional to Dasha years). The Sub-lord of a house cusp is the primary determinant of that house\'s results.',
    hi: 'K.S. कृष्णमूर्ति द्वारा 1960 के दशक में विकसित, KP प्रणाली पारम्परिक वैदिक ज्योतिष को सटीक भाव सन्धियों (प्लेसिडस प्रणाली) और उप-स्वामी सिद्धान्त से परिष्कृत करती है।',
    sa: 'K.S. कृष्णमूर्तिना 1960 दशके विकसिता, KP पद्धतिः पारम्परिकवैदिकज्योतिषं सूक्ष्मभावसन्धिभिः उपस्वामिसिद्धान्तेन च परिष्करोति।'
  },
  kpCalc: {
    en: 'Our KP engine calculates Placidus house cusps from the Local Sidereal Time, then determines the Sign lord, Star lord, and Sub-lord for each cusp and planet. The Sub-lord table divides each Nakshatra (13°20\') into 9 unequal parts proportional to the Vimshottari Dasha years. It generates a significator table showing which houses each planet signifies through ownership, occupation, and star-lordship.',
    hi: 'हमारा KP इंजन स्थानीय नाक्षत्रिक समय से प्लेसिडस भाव सन्धियाँ गणना करता है, फिर प्रत्येक सन्धि और ग्रह के लिए राशि स्वामी, नक्षत्र स्वामी और उप-स्वामी निर्धारित करता है।',
    sa: 'अस्माकं KP इंजनं स्थानीयनाक्षत्रिकसमयात् प्लेसिडसभावसन्धीः गणयति।'
  },

  prashnaTitle: { en: 'Prashna — Horary Astrology', hi: 'प्रश्न — होररी ज्योतिष', sa: 'प्रश्नः — होररीज्योतिषम्' },
  prashnaContent: {
    en: 'Prashna (question chart) is cast for the exact moment a question is asked, rather than the birth time. The principle: the cosmos at the moment of sincere inquiry reflects the answer. Two systems exist in our software: (1) Standard Prashna — a regular Kundali for the question moment, analyzed for the relevant house, and (2) Ashtamangala Prashna — a Kerala tradition where the querent chooses numbers and objects to generate a reading.',
    hi: 'प्रश्न कुण्डली प्रश्न पूछने के सटीक क्षण की होती है, न कि जन्म समय की। सिद्धान्त: ईमानदार पूछताछ के क्षण का ब्रह्माण्ड उत्तर प्रतिबिम्बित करता है। हमारे सॉफ़्टवेयर में दो प्रणालियाँ हैं।',
    sa: 'प्रश्नकुण्डली प्रश्नपृच्छासमयस्य भवति, न जन्मसमयस्य। सिद्धान्तः: ईमानदारपृच्छासमये ब्रह्माण्डं उत्तरं प्रतिबिम्बयति।'
  },
  ashtamangalaContent: {
    en: 'In Ashtamangala Prashna (a Kerala Deva Prashna tradition), the querent selects a number (1-108), an Ashtamangala item (Mirror, Vessel, Gold Fish, Lamp, Throne, Bull, Flag, or Fan), and a flower color. From these inputs, the system derives a Rashi, Nakshatra, and specific predictive framework. Our software implements the traditional calculation: the chosen number is mapped to a Nakshatra (number mod 27), and the Ashtamangala item indicates the nature of the divine message.',
    hi: 'अष्टमंगल प्रश्न (केरल देव प्रश्न परम्परा) में, प्रश्नकर्ता एक संख्या (1-108), एक अष्टमंगल वस्तु, और एक फूल का रंग चुनता है। इन इनपुट से, प्रणाली एक राशि, नक्षत्र, और विशिष्ट भविष्यवाणी ढाँचा निकालती है।',
    sa: 'अष्टमङ्गलप्रश्ने प्रश्नकर्ता संख्यां (1-108), अष्टमङ्गलवस्तुं, पुष्पवर्णं च चिनोति।'
  },

  muhurtaTitle: { en: 'Muhurta — Electional Astrology', hi: 'मुहूर्त — शुभ समय चयन', sa: 'मुहूर्तः — शुभसमयचयनम्' },
  muhurtaContent: {
    en: 'Muhurta is the science of selecting the most auspicious time for important activities. Rather than predicting what will happen, Muhurta helps you choose WHEN to act for the best results. Our Muhurta AI engine scores potential time windows by evaluating multiple factors simultaneously.',
    hi: 'मुहूर्त महत्वपूर्ण कार्यों के लिए सबसे शुभ समय चुनने का विज्ञान है। क्या होगा इसकी भविष्यवाणी करने के बजाय, मुहूर्त आपको सर्वोत्तम परिणामों के लिए कब कार्य करना है चुनने में सहायता करता है।',
    sa: 'मुहूर्तः महत्त्वपूर्णकार्याणां शुभतमसमयचयनस्य विज्ञानम्।'
  },
  muhurtaFactors: {
    en: 'Our multi-factor scoring system evaluates 20+ activity types (marriage, travel, business, property, medical, education, etc.) and scores each time window on: Tithi suitability, Nakshatra suitability, Yoga quality, Karana quality, Vara (weekday) match, Choghadiya/Hora, Rahu Kaal avoidance, Chandra Balam, Tara Balam, planetary transits, and retrograde status. Each factor is weighted differently per activity type.',
    hi: 'हमारी बहु-कारक अंकन प्रणाली 20+ गतिविधि प्रकारों का मूल्यांकन करती है और प्रत्येक समय खिड़की को अंकित करती है: तिथि उपयुक्तता, नक्षत्र उपयुक्तता, योग गुणवत्ता, करण गुणवत्ता, वार मिलान, चौघड़िया/होरा, राहु काल परिहार, चन्द्र बलम, तारा बलम।',
    sa: 'अस्माकं बहुकारकाङ्कनपद्धतिः 20+ गतिविधिप्रकारान् मूल्यायति।'
  },

  practiceTitle: { en: 'Putting It All Together', hi: 'सब एक साथ जोड़ना', sa: 'सर्वं एकत्र योजयितुम्' },
  practiceContent: {
    en: 'A skilled Jyotishi uses multiple systems in concert: the birth chart (Kundali) reveals the natal promise — what is possible in your life. Dashas reveal WHEN natal promises activate. Transits (Gochar) provide the immediate cosmic weather. Varshaphal focuses predictions to the current year. Prashna answers specific questions. And Muhurta helps you take action at the optimal moment. Our software provides all these tools for comprehensive analysis.',
    hi: 'एक कुशल ज्योतिषी एक साथ कई प्रणालियों का उपयोग करता है: जन्म कुण्डली जन्मगत प्रतिज्ञा प्रकट करती है। दशाएँ बताती हैं कब प्रतिज्ञाएँ सक्रिय होती हैं। गोचर तत्काल ब्रह्माण्डीय मौसम देता है। वर्षफल वर्तमान वर्ष पर केन्द्रित करता है। प्रश्न विशिष्ट प्रश्नों के उत्तर देता है। मुहूर्त इष्टतम क्षण पर कार्य करने में सहायता करता है।',
    sa: 'कुशलज्योतिषी बहूनि पद्धतीः एकत्र प्रयुङ्क्ते।'
  },
};

const TOOLS_GRID = [
  { name: { en: 'Varshaphal', hi: 'वर्षफल', sa: 'वर्षफलम्' }, link: '/varshaphal', desc: { en: 'Annual predictions from solar return', hi: 'सौर प्रत्यावर्तन से वार्षिक भविष्यवाणी', sa: 'सौरप्रत्यावर्तनात् वार्षिकभविष्यवाणी' }, color: '#f59e0b' },
  { name: { en: 'KP System', hi: 'KP प्रणाली', sa: 'KP पद्धतिः' }, link: '/kp-system', desc: { en: 'Sub-lord based precise analysis', hi: 'उप-स्वामी आधारित सटीक विश्लेषण', sa: 'उपस्वामिआधारितसूक्ष्मविश्लेषणम्' }, color: '#3b82f6' },
  { name: { en: 'Prashna', hi: 'प्रश्न', sa: 'प्रश्नः' }, link: '/prashna', desc: { en: 'Horary chart for specific questions', hi: 'विशिष्ट प्रश्नों के लिए होररी कुण्डली', sa: 'विशिष्टप्रश्नानां होररीकुण्डली' }, color: '#8b5cf6' },
  { name: { en: 'Ashtamangala', hi: 'अष्टमंगल', sa: 'अष्टमङ्गलम्' }, link: '/prashna-ashtamangala', desc: { en: 'Kerala divination tradition', hi: 'केरल भविष्यवाणी परम्परा', sa: 'केरलभविष्यवाणीपरम्परा' }, color: '#ec4899' },
  { name: { en: 'Muhurta AI', hi: 'मुहूर्त AI', sa: 'मुहूर्त AI' }, link: '/muhurta-ai', desc: { en: 'AI-scored auspicious time finder', hi: 'AI-अंकित शुभ समय खोजक', sa: 'AI-अङ्कितशुभसमयान्वेषकः' }, color: '#22c55e' },
  { name: { en: 'Sade Sati', hi: 'साढ़े साती', sa: 'साढेसाती' }, link: '/sade-sati', desc: { en: 'Saturn transit analysis', hi: 'शनि गोचर विश्लेषण', sa: 'शनिगोचरविश्लेषणम्' }, color: '#6366f1' },
];

export default function LearnAdvancedPage() {
  const locale = useLocale() as Locale;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        <SanskritTermCard term="Varshaphal" devanagari="वर्षफल" transliteration="Varṣaphala" meaning="Annual result" />
        <SanskritTermCard term="Tajika" devanagari="ताजिक" transliteration="Tājika" meaning="Annual horoscopy system" />
        <SanskritTermCard term="Prashna" devanagari="प्रश्न" transliteration="Praśna" meaning="Question / Horary" />
        <SanskritTermCard term="Muhurta" devanagari="मुहूर्त" transliteration="Muhūrta" meaning="Auspicious moment" />
        <SanskritTermCard term="Sublord" devanagari="उपस्वामी" transliteration="Upasvāmī" meaning="KP sub-lord" />
        <SanskritTermCard term="Significator" devanagari="कारक" transliteration="Kāraka" meaning="House significator" />
      </div>

      <LessonSection number={1} title={L.varshaphalTitle[locale]}>
        <p>{L.varshaphalContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'How our Varshaphal engine works:' : 'हमारा वर्षफल इंजन कैसे काम करता है:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {locale === 'en' ? 'Find exact JD when Sun returns to birth longitude (binary search)' : 'सटीक JD ज्ञात करें जब सूर्य जन्म देशान्तर पर लौटे (बाइनरी खोज)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {locale === 'en' ? 'Compute full chart for that moment (all 9 planets + houses)' : 'उस क्षण की पूर्ण कुण्डली गणना करें (सभी 9 ग्रह + भाव)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {locale === 'en' ? 'Muntha = (Birth Lagna sign + age) mod 12' : 'मुन्था = (जन्म लग्न राशि + आयु) mod 12'}</p>
          <p className="text-gold-light/80 font-mono text-xs">4. {locale === 'en' ? 'Calculate 16 Sahams (sensitive points for life areas)' : '16 सहम गणना करें (जीवन क्षेत्रों के संवेदनशील बिन्दु)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">5. {locale === 'en' ? 'Generate Mudda Dasha (year-compressed planetary periods)' : 'मुद्दा दशा उत्पन्न करें (वर्ष-संकुचित ग्रह अवधियाँ)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">6. {locale === 'en' ? 'Analyze Tajika Yogas (Ithasala, Easarapha, Nakta, etc.)' : 'ताजिक योगों का विश्लेषण (इत्थशाल, ईसराफ, नक्त, आदि)'}</p>
        </div>
        <p className="mt-3 text-text-secondary text-sm">{L.varshaphalCalc[locale]}</p>
      </LessonSection>

      <LessonSection number={2} title={L.kpTitle[locale]}>
        <p>{L.kpContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'KP Sub-Lord Division Example:' : 'KP उप-स्वामी विभाजन उदाहरण:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' ? 'Ashwini Nakshatra (0°00\' — 13°20\' Aries):' : 'अश्विनी नक्षत्र (0°00\' — 13°20\' मेष):'}
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
        <p className="mt-3 text-text-secondary text-sm">{L.kpCalc[locale]}</p>
      </LessonSection>

      <LessonSection number={3} title={L.prashnaTitle[locale]}>
        <p>{L.prashnaContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-purple-400/20">
          <p className="text-purple-300 font-mono text-sm mb-2">
            {locale === 'en' ? 'Ashtamangala Prashna Method:' : 'अष्टमंगल प्रश्न विधि:'}
          </p>
          <p className="text-purple-200/80 font-mono text-xs">{L.ashtamangalaContent[locale]}</p>
        </div>
      </LessonSection>

      <LessonSection number={4} title={L.muhurtaTitle[locale]}>
        <p>{L.muhurtaContent[locale]}</p>
        <p className="mt-3 text-text-secondary text-sm">{L.muhurtaFactors[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-emerald-400/20">
          <p className="text-emerald-300 font-mono text-sm mb-2">
            {locale === 'en' ? 'Multi-Factor Scoring Example (Marriage):' : 'बहु-कारक अंकन उदाहरण (विवाह):'}
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

      <LessonSection number={5} title={L.practiceTitle[locale]} variant="highlight">
        <p>{L.practiceContent[locale]}</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
                className="block glass-card rounded-lg p-4 border border-gold-primary/10 hover:border-gold-primary/30 transition-all"
              >
                <div className="text-sm font-semibold mb-1" style={{ color: tool.color }}>{tool.name[locale]}</div>
                <p className="text-text-secondary text-xs">{tool.desc[locale]}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </LessonSection>
    </div>
  );
}

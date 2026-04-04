'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { NAKSHATRAS } from '@/lib/constants/nakshatras';
import { NAKSHATRA_SYLLABLES } from '@/lib/constants/nakshatra-syllables';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import RashiNakshatraWheel from '@/components/learn/RashiNakshatraWheel';

/* ───── Inline bilingual labels ───── */
const L = {
  overviewTitle: { en: 'What are the 27 Nakshatras?', hi: 'नक्षत्र क्या हैं?' },
  overviewContent: {
    en: 'The Nakshatras are the 27 lunar mansions of Vedic astrology -- the original star-based coordinate system of Jyotish, predating the 12-sign Rashi system by millennia. While Rashis describe solar energy (the Sun spends ~30 days in each sign), Nakshatras describe lunar energy: the Moon spends roughly one day in each Nakshatra. Because the Moon governs the mind (Manas) in Jyotish, the birth Nakshatra reveals one\'s emotional core, instinctive nature, and deepest psychological patterns -- often more accurately than the Sun sign or even the Moon sign alone.',
    hi: 'नक्षत्र वैदिक ज्योतिष के 27 चान्द्र भवन हैं -- ज्योतिष की मूल तारा-आधारित निर्देशांक प्रणाली, जो 12 राशियों की प्रणाली से सहस्राब्दियों पुरानी है। जहाँ राशियाँ सौर ऊर्जा का वर्णन करती हैं, नक्षत्र चान्द्र ऊर्जा का वर्णन करते हैं: चन्द्रमा प्रत्येक नक्षत्र में लगभग एक दिन व्यतीत करता है। क्योंकि चन्द्र ज्योतिष में मन (मानस) का शासक है, जन्म नक्षत्र व्यक्ति के भावनात्मक केन्द्र, सहज प्रकृति, और गहनतम मनोवैज्ञानिक प्रतिरूपों को प्रकट करता है।'
  },
  spanTitle: { en: 'Why 27 Divisions? The Geometry of 13\u00b020\'', hi: '27 विभाग क्यों? 13\u00b020\' की ज्यामिति' },
  spanContent: {
    en: 'The Moon completes one full orbit (360\u00b0) around the zodiac in approximately 27.3 days -- the sidereal lunar month. The ancient Rishis divided the ecliptic into 27 equal segments of 13\u00b020\' (13.333\u00b0) each, so the Moon traverses roughly one Nakshatra per day. This creates an elegant daily marker system: each night, the Moon "resides" in a different stellar mansion. The 27-fold division is also mathematically harmonious: 27 = 3\u00b3, and 27 \u00d7 4 padas = 108, the sacred number connecting Nakshatras to the Navamsha (D9) chart.',
    hi: 'चन्द्रमा राशिचक्र (360\u00b0) की एक पूर्ण परिक्रमा लगभग 27.3 दिनों में पूर्ण करता है -- नाक्षत्र चान्द्र मास। प्राचीन ऋषियों ने क्रान्तिवृत्त को 13\u00b020\' (13.333\u00b0) के 27 समान खण्डों में विभाजित किया, ताकि चन्द्रमा प्रतिदिन लगभग एक नक्षत्र पार करे। 27-गुना विभाजन गणितीय रूप से भी सुन्दर है: 27 = 3\u00b3, और 27 \u00d7 4 पाद = 108, वह पवित्र संख्या जो नक्षत्र को नवमांश (D9) कुण्डली से जोड़ती है।'
  },
  dashaTitle: { en: 'Nakshatra Lords & the Vimshottari Dasha', hi: 'नक्षत्र स्वामी और विंशोत्तरी दशा' },
  dashaContent: {
    en: 'Each Nakshatra is assigned a planetary lord from the 9 Grahas. These lords repeat in a fixed cycle of 9, governing 3 Nakshatras each. This assignment is the foundation of the Vimshottari Dasha -- the 120-year planetary period system that is the primary predictive timing tool in Jyotish. The planet ruling your birth Moon\'s Nakshatra determines which Maha Dasha you are born into, and the Moon\'s exact progress through that Nakshatra determines how many years of that Dasha remain at birth.',
    hi: 'प्रत्येक नक्षत्र को 9 ग्रहों में से एक ग्रह स्वामी आवण्टित है। ये स्वामी 9 के एक निश्चित चक्र में दोहराते हैं, प्रत्येक 3 नक्षत्रों का शासन करता है। यह आवण्टन विंशोत्तरी दशा का आधार है -- 120 वर्षीय ग्रह अवधि प्रणाली जो ज्योतिष का प्राथमिक भविष्यवाणी समय उपकरण है।'
  },
  padaTitle: { en: 'Nakshatra Padas -- The 108 Quarters', hi: 'नक्षत्र पाद -- 108 चतुर्थांश' },
  padaContent: {
    en: 'Each Nakshatra is further divided into 4 Padas (quarters) of 3\u00b020\' (3.333\u00b0) each. The 108 Padas (27 \u00d7 4) map one-to-one with the 108 Navamsha divisions (12 signs \u00d7 9 Navamshas per sign). This elegant mathematical bridge connects the Nakshatra system to the Navamsha chart (D9), the most important divisional chart for marriage, dharma, and the soul\'s deeper purpose. The Pada determines which Navamsha sign a planet falls in, adding a crucial layer of interpretation beyond the Rashi chart alone.',
    hi: 'प्रत्येक नक्षत्र को 3\u00b020\' (3.333\u00b0) के 4 पादों (चतुर्थांशों) में विभाजित किया गया है। 108 पाद (27 \u00d7 4) 108 नवमांश विभागों (12 राशि \u00d7 9 नवमांश प्रति राशि) से एक-एक मेल खाते हैं। यह सुन्दर गणितीय सेतु नक्षत्र प्रणाली को नवमांश कुण्डली (D9) से जोड़ता है, जो विवाह, धर्म, और आत्मा के गहन उद्देश्य के लिए सबसे महत्वपूर्ण विभागीय कुण्डली है।'
  },
  categoryTitle: { en: 'Nakshatra Categories -- Activity Types', hi: 'नक्षत्र वर्गीकरण -- क्रिया प्रकार' },
  categoryContent: {
    en: 'Beyond the Gana classification, Nakshatras are categorized by activity type (Swabhava), which governs Muhurta (electional) astrology -- choosing the right time for actions. The nature of the prevailing Nakshatra determines what activities are auspicious on a given day.',
    hi: 'गण वर्गीकरण के अतिरिक्त, नक्षत्रों को क्रिया प्रकार (स्वभाव) द्वारा वर्गीकृत किया जाता है, जो मुहूर्त (निर्वाचन) ज्योतिष को नियन्त्रित करता है -- कार्यों के लिए सही समय चुनना।'
  },
  namingTitle: { en: 'Baby Naming -- Nakshatra Akshara', hi: 'शिशु नामकरण -- नक्षत्र अक्षर' },
  namingContent: {
    en: 'One of the most beloved practical applications of Nakshatras is the Namakarana Samskara (naming ceremony). Each Nakshatra Pada has a designated starting syllable (Akshara). Traditionally, a child\'s name begins with the syllable of their birth Moon\'s Nakshatra Pada, creating a phonetic bond between the child and their cosmic birth signature. This practice is mentioned in the Grihya Sutras and remains widely followed today.',
    hi: 'नक्षत्रों का सबसे प्रिय व्यावहारिक अनुप्रयोग नामकरण संस्कार है। प्रत्येक नक्षत्र पाद का एक निर्दिष्ट प्रारम्भिक अक्षर होता है। परम्परागत रूप से, बालक का नाम उसके जन्म चन्द्र के नक्षत्र पाद के अक्षर से प्रारम्भ होता है, जो बालक और उसकी ब्रह्माण्डीय जन्म पहचान के बीच ध्वनि-बन्धन बनाता है।'
  },
  taraTitle: { en: 'Tara Bala -- Star Strength System', hi: 'तारा बल -- नक्षत्र शक्ति प्रणाली' },
  taraContent: {
    en: 'Tara Bala (star strength) is a daily-applicable system that measures the relationship between the Moon\'s current Nakshatra and your birth Nakshatra. By counting from your Janma Nakshatra to the day\'s Nakshatra and dividing by 9, you get a Tara number (1-9). Each Tara produces a specific effect, cycling through the 27 Nakshatras in groups of 9. Taras 2, 4, 6, 8 are generally favorable; Taras 1, 3, 5, 7, 9 need examination (some are good, some challenging).',
    hi: 'तारा बल एक दैनिक-लागू प्रणाली है जो चन्द्रमा के वर्तमान नक्षत्र और आपके जन्म नक्षत्र के बीच सम्बन्ध को मापती है। अपने जन्म नक्षत्र से दिन के नक्षत्र तक गिनकर 9 से भाग देने पर तारा संख्या (1-9) प्राप्त होती है। प्रत्येक तारा एक विशिष्ट प्रभाव उत्पन्न करता है।'
  },
  matchingTitle: { en: 'Nakshatra in Kundali Matching -- Yoni, Gana, Nadi', hi: 'कुण्डली मिलान में नक्षत्र -- योनि, गण, नाडी' },
  matchingContent: {
    en: 'Three of the eight Ashtakoota matching factors are Nakshatra-based, together accounting for 13 out of 36 total points. These three factors assess physical compatibility (Yoni), temperamental harmony (Gana), and physiological-genetic health (Nadi). A minimum of 18/36 points is considered acceptable; 24+ is excellent.',
    hi: 'अष्टकूट मिलान के आठ कारकों में से तीन नक्षत्र-आधारित हैं, जो कुल 36 में से 13 अंकों के लिए जिम्मेदार हैं। ये तीन कारक शारीरिक अनुकूलता (योनि), स्वभाव सामंजस्य (गण), और शारीरिक-आनुवंशिक स्वास्थ्य (नाडी) का मूल्यांकन करते हैं।'
  },
  ganaTitle: { en: 'Gana (Temperament) Groups', hi: 'गण (स्वभाव) समूह' },
  crossRefTitle: { en: 'Continue Your Learning', hi: 'अपना अध्ययन जारी रखें' },
  tryIt: { en: 'Explore Today\'s Nakshatra in Panchang', hi: 'आज का नक्षत्र पंचांग में देखें' },
};

const NAKSHATRA_GROUPS = [
  { name: { en: 'Deva (Divine)', hi: 'देव (दैवी)' }, nakshatras: 'Ashwini, Mrigashira, Punarvasu, Pushya, Hasta, Swati, Anuradha, Shravana, Revati', count: 9 },
  { name: { en: 'Manushya (Human)', hi: 'मनुष्य (मानवी)' }, nakshatras: 'Bharani, Rohini, Ardra, P.Phalguni, U.Phalguni, P.Ashadha, U.Ashadha, P.Bhadra, U.Bhadra', count: 9 },
  { name: { en: 'Rakshasa (Fierce)', hi: 'राक्षस (आसुरी)' }, nakshatras: 'Krittika, Ashlesha, Magha, Chitra, Vishakha, Jyeshtha, Moola, Dhanishta, Shatabhisha', count: 9 },
];

const DASHA_LORDS = [
  { planet: 'Ketu', hi: 'केतु', years: 7, nakshatras: [1, 10, 19], color: '#9ca3af' },
  { planet: 'Venus', hi: 'शुक्र', years: 20, nakshatras: [2, 11, 20], color: '#ec4899' },
  { planet: 'Sun', hi: 'सूर्य', years: 6, nakshatras: [3, 12, 21], color: '#f59e0b' },
  { planet: 'Moon', hi: 'चन्द्र', years: 10, nakshatras: [4, 13, 22], color: '#e2e8f0' },
  { planet: 'Mars', hi: 'मंगल', years: 7, nakshatras: [5, 14, 23], color: '#ef4444' },
  { planet: 'Rahu', hi: 'राहु', years: 18, nakshatras: [6, 15, 24], color: '#6366f1' },
  { planet: 'Jupiter', hi: 'गुरु', years: 16, nakshatras: [7, 16, 25], color: '#f0d48a' },
  { planet: 'Saturn', hi: 'शनि', years: 19, nakshatras: [8, 17, 26], color: '#3b82f6' },
  { planet: 'Mercury', hi: 'बुध', years: 17, nakshatras: [9, 18, 27], color: '#22c55e' },
];

const NAKSHATRA_CATEGORIES = [
  { name: { en: 'Dhruva (Fixed)', hi: 'ध्रुव (स्थिर)' }, color: '#3b82f6', desc: { en: 'Foundation laying, temples, permanent structures, planting trees', hi: 'नींव रखना, मन्दिर, स्थायी संरचनाएँ, वृक्षारोपण' }, nakshatras: 'Rohini, U.Phalguni, U.Ashadha, U.Bhadrapada' },
  { name: { en: 'Chara (Movable)', hi: 'चर (गतिशील)' }, color: '#22c55e', desc: { en: 'Travel, vehicle purchase, moving house, beginning journeys', hi: 'यात्रा, वाहन खरीद, गृह-प्रवेश, यात्रा प्रारम्भ' }, nakshatras: 'Punarvasu, Swati, Shravana, Dhanishta, Shatabhisha' },
  { name: { en: 'Ugra (Fierce)', hi: 'उग्र (प्रचण्ड)' }, color: '#ef4444', desc: { en: 'Battles, surgery, demolition, confrontation, fire rituals', hi: 'युद्ध, शल्यचिकित्सा, ध्वंस, सामना, अग्नि अनुष्ठान' }, nakshatras: 'Bharani, Magha, P.Phalguni, P.Ashadha, P.Bhadrapada' },
  { name: { en: 'Kshipra/Laghu (Swift/Light)', hi: 'क्षिप्र/लघु (शीघ्र)' }, color: '#f0d48a', desc: { en: 'Sports, trade, learning, medicine, quick tasks, travel', hi: 'खेल, व्यापार, अध्ययन, चिकित्सा, त्वरित कार्य' }, nakshatras: 'Ashwini, Pushya, Hasta' },
  { name: { en: 'Mridu (Gentle)', hi: 'मृदु (कोमल)' }, color: '#a78bfa', desc: { en: 'Music, art, romance, friendship, wearing new clothes, celebrations', hi: 'संगीत, कला, प्रेम, मित्रता, नये वस्त्र, उत्सव' }, nakshatras: 'Mrigashira, Chitra, Anuradha, Revati' },
  { name: { en: 'Tikshna/Daruna (Sharp)', hi: 'तीक्ष्ण/दारुण (तीव्र)' }, color: '#f97316', desc: { en: 'Tantra, incantation, poisoning enemies, invoking spirits, black magic', hi: 'तन्त्र, मन्त्र, शत्रु-नाश, आत्मा-आवाहन' }, nakshatras: 'Ardra, Ashlesha, Jyeshtha, Moola' },
  { name: { en: 'Mishra (Mixed)', hi: 'मिश्र (मिश्रित)' }, color: '#64748b', desc: { en: 'Day-to-day activities, routine work, worship, charity', hi: 'दैनिक गतिविधियाँ, नियमित कार्य, पूजा, दान' }, nakshatras: 'Krittika, Vishakha' },
];

const TARA_NAMES = [
  { num: 1, name: { en: 'Janma (Birth)', hi: 'जन्म' }, effect: { en: 'Moderate -- needs care. Physical health sensitive.', hi: 'मध्यम -- सावधानी। शारीरिक स्वास्थ्य संवेदनशील।' }, good: false },
  { num: 2, name: { en: 'Sampat (Wealth)', hi: 'सम्पत्' }, effect: { en: 'Favorable. Financial gains, prosperity.', hi: 'शुभ। वित्तीय लाभ, समृद्धि।' }, good: true },
  { num: 3, name: { en: 'Vipat (Danger)', hi: 'विपत्' }, effect: { en: 'Unfavorable. Obstacles, losses.', hi: 'अशुभ। बाधाएँ, हानि।' }, good: false },
  { num: 4, name: { en: 'Kshema (Well-being)', hi: 'क्षेम' }, effect: { en: 'Favorable. Safety, peace, comfort.', hi: 'शुभ। सुरक्षा, शान्ति, सुख।' }, good: true },
  { num: 5, name: { en: 'Pratyari (Obstacle)', hi: 'प्रत्यरि' }, effect: { en: 'Unfavorable. Opposition, enemies.', hi: 'अशुभ। विरोध, शत्रुता।' }, good: false },
  { num: 6, name: { en: 'Sadhaka (Achievement)', hi: 'साधक' }, effect: { en: 'Favorable. Accomplishment, success.', hi: 'शुभ। उपलब्धि, सफलता।' }, good: true },
  { num: 7, name: { en: 'Vadha (Death)', hi: 'वध' }, effect: { en: 'Unfavorable. Conflict, harm.', hi: 'अशुभ। संघर्ष, हानि।' }, good: false },
  { num: 8, name: { en: 'Mitra (Friend)', hi: 'मित्र' }, effect: { en: 'Favorable. Friendships, alliances.', hi: 'शुभ। मित्रता, सहयोग।' }, good: true },
  { num: 9, name: { en: 'Atimitra (Great friend)', hi: 'अतिमित्र' }, effect: { en: 'Very favorable. Deep support, blessings.', hi: 'अत्यन्त शुभ। गहन सहयोग, आशीर्वाद।' }, good: true },
];

const MATCHING_KUTAS = [
  { name: { en: 'Yoni Kuta (4 pts)', hi: 'योनि कूट (4 अंक)' }, desc: { en: 'Each Nakshatra is mapped to an animal (Yoni): Horse, Elephant, Sheep, Serpent, Dog, Cat, Rat, Cow, Buffalo, Tiger, Deer, Monkey, Mongoose, Lion. Same Yoni = 4 pts. Enemy Yonis (e.g., Cat-Rat, Snake-Mongoose) = 0 pts. This assesses physical and sexual compatibility.', hi: 'प्रत्येक नक्षत्र एक पशु (योनि) से मेल खाता है: अश्व, गज, मेष, सर्प, श्वान, मार्जार, मूषक, गौ, महिष, व्याघ्र, मृग, वानर, नकुल, सिंह। समान योनि = 4 अंक। शत्रु योनियाँ = 0 अंक। यह शारीरिक अनुकूलता का मूल्यांकन करता है।' } },
  { name: { en: 'Gana Kuta (6 pts)', hi: 'गण कूट (6 अंक)' }, desc: { en: 'Deva-Deva = 6, Manushya-Manushya = 6, Rakshasa-Rakshasa = 6. Deva-Manushya = 5. Deva-Rakshasa = 0. Manushya-Rakshasa = 1. Assesses temperamental and social compatibility.', hi: 'देव-देव = 6, मनुष्य-मनुष्य = 6, राक्षस-राक्षस = 6। देव-मनुष्य = 5। देव-राक्षस = 0। मनुष्य-राक्षस = 1। स्वभाव और सामाजिक अनुकूलता का मूल्यांकन करता है।' } },
  { name: { en: 'Nadi Kuta (8 pts)', hi: 'नाडी कूट (8 अंक)' }, desc: { en: 'The highest-weighted factor. Each Nakshatra belongs to one of 3 Nadis: Aadi (Vata), Madhya (Pitta), Antya (Kapha). Same Nadi = 0 (Nadi Dosha -- risk to progeny). Different Nadi = 8. This is the only factor with a binary outcome: full points or zero.', hi: 'सबसे अधिक भार वाला कारक। प्रत्येक नक्षत्र 3 नाडियों में से एक का है: आदि (वात), मध्य (पित्त), अन्त्य (कफ)। समान नाडी = 0 (नाडी दोष)। भिन्न नाडी = 8।' } },
];


export default function LearnNakshatrasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const lo = locale === 'sa' ? 'hi' : locale; // fallback sa -> hi for inline labels

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('nakshatrasTitle')}
        </h2>
        <p className="text-text-secondary">{t('nakshatrasSubtitle')}</p>
      </div>

      {/* ─── Sanskrit Key Terms ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Nakshatra" devanagari="नक्षत्र" transliteration="Nak\u1e63atra" meaning="Star / Lunar mansion" />
        <SanskritTermCard term="Pada" devanagari="पाद" transliteration="P\u0101da" meaning="Quarter (3\u00b020')" />
        <SanskritTermCard term="Dasha Lord" devanagari="दशा स्वामी" transliteration="Da\u015b\u0101 Sv\u0101m\u012b" meaning="Period ruler" />
        <SanskritTermCard term="Gana" devanagari="गण" transliteration="Ga\u1e47a" meaning="Temperament group" />
      </div>

      {/* ─── 1. Overview ─── */}
      <LessonSection number={1} title={L.overviewTitle[lo]}>
        <p>{L.overviewContent[lo]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">
            {lo === 'en' ? 'Key Fact:' : 'मुख्य तथ्य:'} 360\u00b0 \u00f7 27 = 13\u00b020\u2019 per Nakshatra
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {lo === 'en'
              ? 'Moon\'s sidereal period \u2248 27.32 days \u2192 ~1 Nakshatra per day'
              : 'चन्द्र का नाक्षत्र काल \u2248 27.32 दिन \u2192 ~1 नक्षत्र प्रतिदिन'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 2. Span & Geometry ─── */}
      <LessonSection number={2} title={L.spanTitle[lo]}>
        <p>{L.spanContent[lo]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Nakshatra = floor(Moon_longitude / 13.333\u00b0) + 1</p>
          <p className="text-gold-light font-mono text-sm mt-1">Pada = floor((Moon_longitude mod 13.333\u00b0) / 3.333\u00b0) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {lo === 'en'
              ? 'Example: Moon at 52\u00b0 \u2192 floor(52/13.333)+1 = 4 \u2192 Rohini, Pada = floor((52-40)/3.333)+1 = 4'
              : '\u0909\u0926\u093e\u0939\u0930\u0923: \u091a\u0928\u094d\u0926\u094d\u0930 52\u00b0 \u092a\u0930 \u2192 floor(52/13.333)+1 = 4 \u2192 \u0930\u094b\u0939\u093f\u0923\u0940, \u092a\u093e\u0926 = floor((52-40)/3.333)+1 = 4'}
          </p>
          <div className="mt-3 pt-3 border-t border-gold-primary/10">
            <p className="text-gold-light font-mono text-sm">27 Nakshatras \u00d7 4 Padas = 108 divisions</p>
            <p className="text-gold-light font-mono text-sm">12 Rashis \u00d7 9 Navamshas = 108 divisions</p>
            <p className="text-gold-light/60 font-mono text-xs mt-1">
              {lo === 'en'
                ? 'This is why 108 is sacred in Hindu tradition -- it unifies the Nakshatra and Rashi systems'
                : '\u0907\u0938\u0940\u0932\u093f\u090f 108 \u0939\u093f\u0928\u094d\u0926\u0942 \u092a\u0930\u092e\u094d\u092a\u0930\u093e \u092e\u0947\u0902 \u092a\u0935\u093f\u0924\u094d\u0930 \u0939\u0948 -- \u092f\u0939 \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0914\u0930 \u0930\u093e\u0936\u093f \u092a\u094d\u0930\u0923\u093e\u0932\u093f\u092f\u094b\u0902 \u0915\u094b \u090f\u0915\u0940\u0915\u0943\u0924 \u0915\u0930\u0924\u093e \u0939\u0948'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── 3. Nakshatra Lords & Dasha ─── */}
      <LessonSection number={3} title={L.dashaTitle[lo]}>
        <p>{L.dashaContent[lo]}</p>
        <div className="mt-4 rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-sm text-text-secondary leading-relaxed">
          {lo === 'en' ? (
            <>
              <p className="mb-2"><strong className="text-gold-light">How is the mapping done?</strong> The 9 planets are assigned to nakshatras in a fixed repeating cycle: <span className="text-gold-primary">Ketu → Venus → Sun → Moon → Mars → Rahu → Jupiter → Saturn → Mercury</span>, then back to Ketu. This cycle repeats 3 times across 27 nakshatras (9 × 3 = 27), so each planet rules exactly 3 nakshatras.</p>
              <p>This sequence is NOT random — it follows the <strong>Vimshottari Dasha order</strong>, which is based on the planets&apos; orbital periods and their relative influence over human life. The dasha years assigned to each planet (Ketu=7, Venus=20, Sun=6, etc.) total exactly 120 years — the ideal human lifespan according to the Vedas.</p>
            </>
          ) : (
            <>
              <p className="mb-2"><strong className="text-gold-light">यह मैपिंग कैसे होती है?</strong> 9 ग्रह एक निश्चित दोहराव चक्र में नक्षत्रों को सौंपे जाते हैं: <span className="text-gold-primary">केतु → शुक्र → सूर्य → चन्द्र → मंगल → राहु → गुरु → शनि → बुध</span>, फिर वापस केतु। यह चक्र 27 नक्षत्रों में 3 बार दोहराता है (9 × 3 = 27), इसलिए प्रत्येक ग्रह ठीक 3 नक्षत्रों का शासन करता है।</p>
              <p>यह क्रम यादृच्छिक नहीं — यह <strong>विंशोत्तरी दशा क्रम</strong> का अनुसरण करता है। प्रत्येक ग्रह को सौंपे गए दशा वर्ष (केतु=7, शुक्र=20, सूर्य=6 आदि) कुल 120 वर्ष होते हैं — वेदों के अनुसार आदर्श मानव जीवनकाल।</p>
            </>
          )}
        </div>
        <div className="mt-6 space-y-2">
          {DASHA_LORDS.map((d, i) => (
            <motion.div
              key={d.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-20 text-right text-sm font-semibold" style={{ color: d.color }}>
                {lo === 'en' ? d.planet : d.hi}
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
                {d.years} {lo === 'en' ? 'yrs' : '\u0935\u0930\u094d\u0937'}
              </div>
              <div className="text-text-secondary/60 text-xs hidden sm:block" style={lo !== 'en' ? { fontFamily: 'var(--font-devanagari-body)' } : undefined}>
                {d.nakshatras.map((nId: number) => NAKSHATRAS[nId - 1]?.name[lo] || `#${nId}`).join(', ')}
              </div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/50 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {lo === 'en' ? 'years' : '\u0935\u0930\u094d\u0937'}
          </div>
        </div>
      </LessonSection>

      {/* ─── 4. Padas ─── */}
      <LessonSection number={4} title={L.padaTitle[lo]}>
        <p>{L.padaContent[lo]}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gold-primary/80 border-b border-gold-primary/20">
                <th className="py-2 px-2 text-left">{lo === 'en' ? 'Nakshatra' : '\u0928\u0915\u094d\u0937\u0924\u094d\u0930'}</th>
                <th className="py-2 px-1 text-center">P1</th>
                <th className="py-2 px-1 text-center">P2</th>
                <th className="py-2 px-1 text-center">P3</th>
                <th className="py-2 px-1 text-center">P4</th>
                <th className="py-2 px-2 text-right">{lo === 'en' ? 'Navamsha Signs' : '\u0928\u0935\u093e\u0902\u0936 \u0930\u093e\u0936\u093f'}</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((nId) => {
                const n = NAKSHATRAS[nId - 1];
                const syllables = NAKSHATRA_SYLLABLES[nId];
                const navamshaStart = ((nId - 1) * 4) % 12;
                const navSigns = ['Ar', 'Ta', 'Ge', 'Cn', 'Le', 'Vi', 'Li', 'Sc', 'Sg', 'Cp', 'Aq', 'Pi'];
                return (
                  <tr key={nId} className="border-b border-gold-primary/5 text-text-secondary/80">
                    <td className="py-1.5 px-2 text-gold-light/90 font-medium">{n.name[lo === 'hi' ? 'hi' : 'en']}</td>
                    {syllables?.map((s, si) => (
                      <td key={si} className="py-1.5 px-1 text-center font-mono text-gold-light/60">{lo === 'en' ? s.en : s.hi}</td>
                    ))}
                    <td className="py-1.5 px-2 text-right text-text-secondary/50 font-mono">
                      {[0, 1, 2, 3].map((p) => navSigns[(navamshaStart + p) % 12]).join('-')}
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan={6} className="py-2 text-center text-text-secondary/40 text-xs italic">
                  {lo === 'en' ? '...showing first 9 of 27. See baby naming section for complete syllable chart.' : '...27 में से प्रथम 9 दिखा रहे हैं। पूर्ण अक्षर तालिका के लिए नामकरण खण्ड देखें।'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* ─── 5. Categories ─── */}
      <LessonSection number={5} title={L.categoryTitle[lo]}>
        <p>{L.categoryContent[lo]}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {NAKSHATRA_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name.en}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-lg p-4 border"
              style={{ borderColor: `${cat.color}30`, backgroundColor: `${cat.color}08` }}
            >
              <div className="font-semibold text-sm mb-1" style={{ color: cat.color }}>{cat.name[lo]}</div>
              <p className="text-text-secondary/70 text-xs mb-2">{cat.desc[lo]}</p>
              <p className="text-text-secondary/50 text-xs font-mono">{cat.nakshatras}</p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── 6. Gana Groups ─── */}
      <LessonSection number={6} title={L.ganaTitle[lo]}>
        <p>
          {lo === 'en'
            ? 'Each Nakshatra belongs to one of three Ganas -- Deva (divine/gentle), Manushya (human/balanced), or Rakshasa (fierce/independent). This classification is crucial in Kundali matching (Gana Kuta = 6 points). Same Gana partners are most compatible temperamentally. Deva-Rakshasa pairing scores 0 and is considered the most challenging combination.'
            : '\u092a\u094d\u0930\u0924\u094d\u092f\u0947\u0915 \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0924\u0940\u0928 \u0917\u0923\u094b\u0902 \u092e\u0947\u0902 \u0938\u0947 \u090f\u0915 \u0915\u093e \u0939\u094b\u0924\u093e \u0939\u0948 -- \u0926\u0947\u0935 (\u0926\u0948\u0935\u0940/\u0915\u094b\u092e\u0932), \u092e\u0928\u0941\u0937\u094d\u092f (\u092e\u093e\u0928\u0935\u0940/\u0938\u0928\u094d\u0924\u0941\u0932\u093f\u0924), \u092f\u093e \u0930\u093e\u0915\u094d\u0937\u0938 (\u0909\u0917\u094d\u0930/\u0938\u094d\u0935\u0924\u0928\u094d\u0924\u094d\u0930)\u0964 \u092f\u0939 \u0935\u0930\u094d\u0917\u0940\u0915\u0930\u0923 \u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u092e\u093f\u0932\u093e\u0928 \u092e\u0947\u0902 \u092e\u0939\u0924\u094d\u0935\u092a\u0942\u0930\u094d\u0923 \u0939\u0948 (\u0917\u0923 \u0915\u0942\u091f = 6 \u0905\u0902\u0915)\u0964'}
        </p>
        <div className="mt-4 space-y-2">
          {NAKSHATRA_GROUPS.map((g) => (
            <div key={g.name.en} className="p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <span className="text-gold-primary font-semibold text-sm">{g.name[lo]} ({g.count})</span>
              <p className="text-text-secondary/70 text-xs mt-1">{g.nakshatras}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Rashi-Nakshatra Wheel ─── */}
      <LessonSection number={7} title={lo === 'en' ? 'Rashi–Nakshatra Relationship' : 'राशि-नक्षत्र सम्बन्ध'}>
        {lo === 'en' ? (
          <div className="space-y-3">
            <p>The zodiac (360°) is divided <strong>two ways simultaneously</strong> — and understanding both is the key to Vedic astrology:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">12</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Rashis (Signs)</div>
                <div className="text-text-secondary/50 text-xs mt-1">30° each — based on the <strong>Sun&apos;s</strong> annual path. Your &quot;Sun sign&quot; in Western astrology. In Vedic astrology, the <strong>Moon&apos;s</strong> rashi matters more.</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">27</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Nakshatras (Stars)</div>
                <div className="text-text-secondary/50 text-xs mt-1">13°20&apos; each — based on the <strong>Moon&apos;s</strong> daily position among star groups. Each has a deity, ruler, and unique personality. The Moon visits one nakshatra per day.</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">108</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">Padas (Quarters)</div>
                <div className="text-text-secondary/50 text-xs mt-1">3°20&apos; each — 27 × 4 = 108, the sacred number. Each pada maps to one Navamsha (D9) sign. 108 padas ÷ 12 signs = 9 padas per rashi.</div>
              </div>
            </div>
            <p className="text-sm"><strong>The beautiful math:</strong> 12 rashis × 9 padas = 108. 27 nakshatras × 4 padas = 108. This is why 108 is sacred in Hinduism — it&apos;s the meeting point of the solar (rashi) and lunar (nakshatra) systems. A mala has 108 beads for this reason.</p>
            <p className="text-sm">These two systems <strong>overlap</strong> — some nakshatras span two rashis (e.g., Krittika starts in Aries, ends in Taurus). This is why people born in the same nakshatra but different padas can have different rashis. Hover over any segment below to see the relationship.</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p>राशिचक्र (360°) <strong>दो तरीकों से एक साथ</strong> विभाजित है — दोनों को समझना वैदिक ज्योतिष की कुंजी है:</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">12</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">राशियाँ</div>
                <div className="text-text-secondary/50 text-xs mt-1">30° प्रत्येक — <strong>सूर्य</strong> के वार्षिक पथ पर आधारित। वैदिक ज्योतिष में <strong>चन्द्र</strong> की राशि अधिक महत्वपूर्ण।</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">27</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">नक्षत्र</div>
                <div className="text-text-secondary/50 text-xs mt-1">13°20&apos; प्रत्येक — <strong>चन्द्रमा</strong> की दैनिक स्थिति। प्रत्येक का एक देवता, स्वामी और अद्वितीय व्यक्तित्व। चन्द्र प्रतिदिन एक नक्षत्र पार करता है।</div>
              </div>
              <div className="rounded-lg bg-bg-secondary/30 border border-gold-primary/8 p-4 text-center">
                <div className="text-3xl font-bold text-gold-light">108</div>
                <div className="text-gold-primary text-sm font-semibold mt-1">पाद (चतुर्थांश)</div>
                <div className="text-text-secondary/50 text-xs mt-1">3°20&apos; प्रत्येक — 27 × 4 = 108, पवित्र संख्या। प्रत्येक पाद एक नवांश (D9) राशि से जुड़ता है। 108 ÷ 12 = 9 पाद प्रति राशि।</div>
              </div>
            </div>
            <p className="text-sm"><strong>सुन्दर गणित:</strong> 12 राशियाँ × 9 पाद = 108। 27 नक्षत्र × 4 पाद = 108। इसीलिए हिन्दू धर्म में 108 पवित्र है — यह सौर (राशि) और चान्द्र (नक्षत्र) प्रणालियों का मिलन बिन्दु है। माला में 108 मनके इसीलिए होते हैं।</p>
            <p className="text-sm">ये दोनों प्रणालियाँ <strong>ओवरलैप</strong> करती हैं — कुछ नक्षत्र दो राशियों में फैले हैं। इसीलिए एक ही नक्षत्र के भिन्न पादों में जन्मे लोगों की राशि भिन्न हो सकती है।</p>
          </div>
        )}
        <div className="mt-6">
          <RashiNakshatraWheel locale={lo as Locale} />
        </div>
      </LessonSection>

      {/* ─── 8. Baby Naming ─── */}
      <LessonSection number={7} title={L.namingTitle[lo]}>
        <p>{L.namingContent[lo]}</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-gold-primary/80 border-b border-gold-primary/20">
                <th className="py-2 px-2 text-left">{lo === 'en' ? 'Nakshatra' : '\u0928\u0915\u094d\u0937\u0924\u094d\u0930'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 1' : '\u092a\u093e\u0926 1'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 2' : '\u092a\u093e\u0926 2'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 3' : '\u092a\u093e\u0926 3'}</th>
                <th className="py-2 px-1 text-center">{lo === 'en' ? 'Pada 4' : '\u092a\u093e\u0926 4'}</th>
              </tr>
            </thead>
            <tbody>
              {NAKSHATRAS.map((n) => {
                const syllables = NAKSHATRA_SYLLABLES[n.id];
                if (!syllables) return null;
                return (
                  <tr key={n.id} className="border-b border-gold-primary/5 text-text-secondary/80">
                    <td className="py-1.5 px-2 text-gold-light/90 font-medium whitespace-nowrap">
                      <span className="mr-1.5">{n.symbol}</span>
                      {n.name[lo === 'hi' ? 'hi' : 'en']}
                    </td>
                    {syllables.map((s, si) => (
                      <td key={si} className="py-1.5 px-1 text-center">
                        <span className="font-mono text-gold-light/70">{lo === 'en' ? s.en : s.hi}</span>
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs">
            {lo === 'en'
              ? 'Example: A child born with Moon in Rohini Pada 1 (syllable "O") might be named Om, Omkar, or Ojas. For Pushya Pada 4 (syllable "Da"), names like Daksha, Darpan, or Damini are traditional.'
              : '\u0909\u0926\u093e\u0939\u0930\u0923: \u0930\u094b\u0939\u093f\u0923\u0940 \u092a\u093e\u0926 1 (\u0905\u0915\u094d\u0937\u0930 "\u0913") \u092e\u0947\u0902 \u091c\u0928\u094d\u092e\u0947 \u092c\u093e\u0932\u0915 \u0915\u093e \u0928\u093e\u092e \u0913\u092e, \u0913\u092e\u0915\u093e\u0930, \u092f\u093e \u0913\u091c\u0938 \u0939\u094b \u0938\u0915\u0924\u093e \u0939\u0948\u0964 \u092a\u0941\u0937\u094d\u092f \u092a\u093e\u0926 4 (\u0905\u0915\u094d\u0937\u0930 "\u0921\u093e") \u0915\u0947 \u0932\u093f\u090f \u0926\u0915\u094d\u0937, \u0926\u0930\u094d\u092a\u0923, \u0926\u093e\u092e\u093f\u0928\u0940 \u092a\u093e\u0930\u092e\u094d\u092a\u0930\u093f\u0915 \u0939\u0948\u0902\u0964'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 8. Tara Bala ─── */}
      <LessonSection number={8} title={L.taraTitle[lo]}>
        <p>{L.taraContent[lo]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10 mb-4">
          <p className="text-gold-light font-mono text-sm mb-1">
            {lo === 'en' ? 'Formula:' : '\u0938\u0942\u0924\u094d\u0930:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Tara = ((Transit_Nakshatra - Birth_Nakshatra + 27) mod 27) / 3 + 1
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">
            {lo === 'en'
              ? 'If remainder = 0, use Tara 9. Result cycles: 1\u20139, 1\u20139, 1\u20139 across 27 Nakshatras.'
              : '\u092f\u0926\u093f \u0936\u0947\u0937 = 0, \u0924\u093e\u0930\u093e 9 \u0932\u0947\u0902\u0964 \u092a\u0930\u093f\u0923\u093e\u092e \u091a\u0915\u094d\u0930: 27 \u0928\u0915\u094d\u0937\u0924\u094d\u0930\u094b\u0902 \u092e\u0947\u0902 1\u20139, 1\u20139, 1\u20139\u0964'}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {TARA_NAMES.map((tara) => (
            <div
              key={tara.num}
              className={`rounded-lg p-3 border ${tara.good ? 'border-emerald-400/20 bg-emerald-400/5' : 'border-red-400/15 bg-red-400/5'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${tara.good ? 'bg-emerald-400/20 text-emerald-400' : 'bg-red-400/15 text-red-400'}`}>
                  {tara.num}
                </span>
                <span className={`text-sm font-semibold ${tara.good ? 'text-emerald-400' : 'text-red-400'}`}>{tara.name[lo]}</span>
              </div>
              <p className="text-text-secondary/70 text-xs">{tara.effect[lo]}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── 9. Matching: Yoni, Gana, Nadi ─── */}
      <LessonSection number={9} title={L.matchingTitle[lo]} variant="highlight">
        <p>{L.matchingContent[lo]}</p>
        <div className="mt-4 space-y-3">
          {MATCHING_KUTAS.map((kuta) => (
            <div key={kuta.name.en} className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
              <div className="text-gold-primary font-semibold text-sm mb-2">{kuta.name[lo]}</div>
              <p className="text-text-secondary/80 text-xs leading-relaxed">{kuta.desc[lo]}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light/70 text-xs">
            {lo === 'en'
              ? 'Together: Yoni (4) + Gana (6) + Nadi (8) = 18 out of 36 points are Nakshatra-determined. The remaining 18 come from Varna (1), Vasya (2), Tara (3), Graha Maitri (5), and Bhakoot (7).'
              : '\u0915\u0941\u0932 \u092e\u093f\u0932\u093e\u0915\u0930: \u092f\u094b\u0928\u093f (4) + \u0917\u0923 (6) + \u0928\u093e\u0921\u0940 (8) = 36 \u092e\u0947\u0902 \u0938\u0947 18 \u0905\u0902\u0915 \u0928\u0915\u094d\u0937\u0924\u094d\u0930-\u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0939\u0948\u0902\u0964 \u0936\u0947\u0937 18 \u0935\u0930\u094d\u0923 (1), \u0935\u0936\u094d\u092f (2), \u0924\u093e\u0930\u093e (3), \u0917\u094d\u0930\u0939 \u092e\u0948\u0924\u094d\u0930\u0940 (5), \u0914\u0930 \u092d\u0915\u0942\u091f (7) \u0938\u0947 \u0906\u0924\u0947 \u0939\u0948\u0902\u0964'}
          </p>
        </div>
      </LessonSection>

      {/* ─── 10. Complete Nakshatra List ─── */}
      <LessonSection title={t('completeList')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {NAKSHATRAS.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{n.symbol}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-gold-light font-semibold text-sm truncate">
                    {n.id}. {n.name[locale]}
                  </div>
                  {locale !== 'en' && <div className="text-text-secondary/60 text-xs truncate">{n.name.en}</div>}
                </div>
                <span className="text-text-secondary/50 text-xs font-mono flex-shrink-0">{n.startDeg.toFixed(1)}\u00b0</span>
              </div>
              <div className="flex flex-wrap gap-x-2 text-xs text-text-secondary/70">
                <span>{n.deity[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span>{n.rulerName[locale]}</span>
                <span className="text-text-secondary/30">|</span>
                <span>{n.nature[locale]}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Cross-References ─── */}
      <LessonSection title={L.crossRefTitle[lo]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {([
            { href: '/learn/dashas' as const, label: lo === 'en' ? 'Dashas -- How Nakshatras drive the timing system' : '\u0926\u0936\u093e -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0938\u092e\u092f \u092a\u094d\u0930\u0923\u093e\u0932\u0940 \u0915\u0948\u0938\u0947 \u091a\u0932\u093e\u0924\u0947 \u0939\u0948\u0902' },
            { href: '/learn/matching' as const, label: lo === 'en' ? 'Kundali Matching -- Full Ashtakoota system' : '\u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u092e\u093f\u0932\u093e\u0928 -- \u092a\u0942\u0930\u094d\u0923 \u0905\u0937\u094d\u091f\u0915\u0942\u091f \u092a\u094d\u0930\u0923\u093e\u0932\u0940' },
            { href: '/learn/muhurtas' as const, label: lo === 'en' ? 'Muhurtas -- How Nakshatras shape auspicious timing' : '\u092e\u0941\u0939\u0942\u0930\u094d\u0924 -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0936\u0941\u092d \u0938\u092e\u092f \u0915\u0948\u0938\u0947 \u0928\u093f\u0930\u094d\u0927\u093e\u0930\u093f\u0924 \u0915\u0930\u0924\u0947 \u0939\u0948\u0902' },
            { href: '/learn/kundali' as const, label: lo === 'en' ? 'Kundali Foundations -- Birth chart basics' : '\u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u0906\u0927\u093e\u0930 -- \u091c\u0928\u094d\u092e \u0915\u0941\u0923\u094d\u0921\u0932\u0940 \u0915\u0940 \u092e\u0942\u0932 \u092c\u093e\u0924\u0947\u0902' },
            { href: '/baby-names' as const, label: lo === 'en' ? 'Baby Name Finder -- Look up names by Nakshatra' : '\u0936\u093f\u0936\u0941 \u0928\u093e\u092e \u0916\u094b\u091c\u0915 -- \u0928\u0915\u094d\u0937\u0924\u094d\u0930 \u0915\u0947 \u0905\u0928\u0941\u0938\u093e\u0930 \u0928\u093e\u092e \u0916\u094b\u091c\u0947\u0902' },
          ]).map((ref) => (
            <Link
              key={ref.href}
              href={ref.href}
              className="flex items-center gap-2 p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/10 hover:border-gold-primary/30 hover:bg-gold-primary/5 transition-colors text-sm text-gold-light/80 hover:text-gold-light"
            >
              <span className="text-gold-primary">&rarr;</span>
              {ref.label}
            </Link>
          ))}
        </div>
      </LessonSection>

      {/* ─── CTA ─── */}
      <div className="mt-6 text-center">
        <Link
          href="/panchang"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[lo]}
        </Link>
      </div>
    </div>
  );
}

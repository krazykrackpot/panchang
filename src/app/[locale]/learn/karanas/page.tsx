'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion, AnimatePresence } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import { KARANAS } from '@/lib/constants/karanas';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ChevronDown } from 'lucide-react';

/* ─── Inline bilingual labels (en/hi) ─── */
const L = {
  title: { en: 'Karanas — The 11 Half-Tithis', hi: 'करण — 11 अर्ध-तिथि' },
  subtitle: {
    en: 'Each Tithi has two halves, giving 60 Karanas per lunar month from just 11 types',
    hi: 'प्रत्येक तिथि के दो भाग, केवल 11 प्रकारों से प्रति चान्द्रमास 60 करण बनते हैं',
  },
  whatIs: { en: 'What is a Karana?', hi: 'करण क्या है?' },
  whatIsBody: {
    en: 'A Karana is the smallest daily subdivision of the Panchang. It represents half a Tithi — exactly 6 degrees of angular separation between the Moon and the Sun. The word "Karana" derives from the Sanskrit root "kri" (to do), signifying the quality of action during that period. While a Tithi spans roughly one day (12 degrees of Moon-Sun elongation), a Karana covers roughly half a day.',
    hi: 'करण पंचांग का सबसे छोटा दैनिक विभाजन है। यह अर्ध-तिथि है — चन्द्रमा और सूर्य के बीच ठीक 6 अंश का कोणीय अन्तर। "करण" शब्द संस्कृत धातु "कृ" (करना) से बना है, जो उस समयावधि में कार्य की गुणवत्ता को दर्शाता है। जबकि एक तिथि लगभग एक दिन (12 अंश) की होती है, एक करण लगभग आधे दिन का होता है।',
  },
  whatIsBody2: {
    en: 'Karanas are used extensively in Muhurta (electional astrology) to determine the suitability of a time for specific activities. Classical texts like the Surya Siddhanta and Muhurta Chintamani prescribe specific Karanas for ceremonies, travel, agriculture, and commerce.',
    hi: 'करणों का व्यापक उपयोग मुहूर्त (निर्वाचन ज्योतिष) में किया जाता है ताकि किसी विशेष कार्य के लिए समय की उपयुक्तता निर्धारित की जा सके। सूर्य सिद्धान्त और मुहूर्त चिन्तामणि जैसे शास्त्रीय ग्रन्थों में संस्कार, यात्रा, कृषि और वाणिज्य के लिए विशिष्ट करण निर्धारित हैं।',
  },

  elevenTypes: { en: 'The 11 Karana Types', hi: '11 करण प्रकार' },
  elevenBody: {
    en: 'There are only 11 distinct Karana types, yet they fill 60 positions per lunar month. This works because the Karanas are divided into two groups:',
    hi: 'केवल 11 विशिष्ट करण प्रकार हैं, फिर भी वे प्रति चान्द्रमास 60 स्थानों को भरते हैं। यह इसलिए सम्भव है क्योंकि करण दो वर्गों में विभक्त हैं:',
  },
  charaLabel: { en: 'Chara (Movable) Karanas', hi: 'चर (गतिशील) करण' },
  charaDesc: {
    en: '7 types that repeat 8 times each = 56 positions (positions 2 through 57)',
    hi: '7 प्रकार जो 8 बार दोहराए जाते हैं = 56 स्थान (स्थान 2 से 57)',
  },
  sthiraLabel: { en: 'Sthira (Fixed) Karanas', hi: 'स्थिर (नियत) करण' },
  sthiraDesc: {
    en: '4 types that occur only once each = 4 positions (positions 1, 58, 59, 60)',
    hi: '4 प्रकार जो केवल एक बार आते हैं = 4 स्थान (स्थान 1, 58, 59, 60)',
  },
  totalFormula: {
    en: 'Total: 56 (chara) + 4 (sthira) = 60 karanas = 2 per tithi x 30 tithis',
    hi: 'कुल: 56 (चर) + 4 (स्थिर) = 60 करण = 2 प्रति तिथि x 30 तिथि',
  },

  calcTitle: { en: 'Calculation Formula', hi: 'गणना सूत्र' },
  calcBody: {
    en: 'The Karana number (1-60) within a lunar month is derived directly from the Moon-Sun elongation:',
    hi: 'चान्द्रमास में करण संख्या (1-60) चन्द्र-सूर्य अन्तर से सीधे प्राप्त होती है:',
  },
  workedExample: { en: 'Worked Example', hi: 'उदाहरण' },
  workedBody: {
    en: 'Suppose the Moon is at 85.3 degrees and the Sun is at 42.7 degrees.',
    hi: 'मान लीजिए चन्द्रमा 85.3 अंश पर है और सूर्य 42.7 अंश पर है।',
  },
  step1: {
    en: 'Elongation = 85.3 - 42.7 = 42.6 degrees',
    hi: 'अन्तर = 85.3 - 42.7 = 42.6 अंश',
  },
  step2: {
    en: 'Karana position = floor(42.6 / 6) + 1 = floor(7.1) + 1 = 7 + 1 = 8',
    hi: 'करण स्थान = floor(42.6 / 6) + 1 = floor(7.1) + 1 = 7 + 1 = 8',
  },
  step3: {
    en: 'Position 8 falls in the chara cycle (positions 2-57). Offset = (8 - 2) mod 7 = 6, which maps to the 7th chara karana = Vishti (Bhadra).',
    hi: 'स्थान 8 चर चक्र (स्थान 2-57) में आता है। ऑफसेट = (8 - 2) mod 7 = 6, जो 7वें चर करण = विष्टि (भद्रा) को दर्शाता है।',
  },
  step4: {
    en: 'This is Shukla Chaturthi (4th tithi), 2nd half. The elongation 42.6 degrees is between 42 and 48 degrees (7th and 8th karana of the month).',
    hi: 'यह शुक्ल चतुर्थी (चौथी तिथि) का दूसरा भाग है। 42.6 अंश का अन्तर 42 और 48 अंश (मास के 7वें और 8वें करण) के बीच है।',
  },

  deityTitle: { en: 'Deities & Nature of Each Karana', hi: 'प्रत्येक करण के देवता और स्वभाव' },
  deityBody: {
    en: 'Each of the 11 Karanas is presided over by a deity and carries a distinct nature that influences the quality of actions undertaken during its period.',
    hi: 'प्रत्येक 11 करणों पर एक देवता का अधिकार है और उसका एक विशिष्ट स्वभाव है जो उस अवधि में किए गए कार्यों की गुणवत्ता को प्रभावित करता है।',
  },

  auspTitle: { en: 'Auspicious vs Inauspicious Karanas', hi: 'शुभ एवं अशुभ करण' },
  auspBody: {
    en: 'Karanas are broadly classified into three categories based on their suitability for undertaking activities:',
    hi: 'करणों को कार्य आरम्भ के लिए उपयुक्तता के आधार पर तीन श्रेणियों में वर्गीकृत किया जाता है:',
  },
  goodLabel: { en: 'Auspicious (Shubha)', hi: 'शुभ करण' },
  goodKaranas: {
    en: 'Bava, Balava, Kaulava, Taitila, Garaja -- These five chara karanas are considered favorable for most activities including marriage, travel, business, and religious ceremonies.',
    hi: 'बव, बालव, कौलव, तैतिल, गरज -- ये पांच चर करण विवाह, यात्रा, व्यापार और धार्मिक कार्यों सहित अधिकांश गतिविधियों के लिए शुभ माने जाते हैं।',
  },
  neutralLabel: { en: 'Neutral (Mishra)', hi: 'मिश्र करण' },
  neutralKaranas: {
    en: 'Vanija -- Suitable for trade and commerce but not recommended for spiritual or domestic ceremonies. Also favorable for agriculture.',
    hi: 'वणिज -- व्यापार और वाणिज्य के लिए उपयुक्त, किन्तु आध्यात्मिक या गृह संस्कारों के लिए अनुशंसित नहीं। कृषि के लिए भी अनुकूल।',
  },
  badLabel: { en: 'Inauspicious (Ashubha)', hi: 'अशुभ करण' },
  badKaranas: {
    en: 'Vishti (Bhadra) -- The 7th chara karana is considered highly inauspicious. It occurs 8 times per month and is avoided for all new beginnings, journeys, and ceremonies. Only acts of destruction, confrontation, and warfare are prescribed during Vishti.',
    hi: 'विष्टि (भद्रा) -- 7वां चर करण अत्यन्त अशुभ माना जाता है। यह प्रति मास 8 बार आता है और सभी नए कार्यों, यात्राओं और संस्कारों में त्याज्य है। केवल विध्वंस, संघर्ष और युद्ध के कार्य विष्टि में विहित हैं।',
  },

  fixedTitle: { en: 'The 4 Fixed Karanas -- Special Significance', hi: '4 स्थिर करण -- विशेष महत्व' },
  fixedBody: {
    en: 'The four Sthira (fixed) Karanas occupy unique positions at the very beginning and end of the lunar month. They appear only once, making them astronomically and ritually distinct from the repeating cycle.',
    hi: 'चार स्थिर करण चान्द्रमास के प्रारम्भ और अन्त में विशेष स्थानों पर होते हैं। वे केवल एक बार आते हैं, जिससे वे खगोलीय और कर्मकाण्डीय दृष्टि से चर चक्र से भिन्न हैं।',
  },

  muhurtaTitle: { en: 'Karana & Muhurta Selection', hi: 'करण और मुहूर्त चयन' },
  muhurtaBody: {
    en: 'In Muhurta Shastra (electional astrology), the Karana is one of the five limbs (Panchangas) that must be evaluated before fixing an auspicious time. While Tithi and Nakshatra carry more weight, the Karana acts as a fine-tuning element:',
    hi: 'मुहूर्त शास्त्र (निर्वाचन ज्योतिष) में, करण पांच अंगों (पंचांगों) में से एक है जिनका मूल्यांकन शुभ समय निर्धारण से पहले किया जाना चाहिए। जबकि तिथि और नक्षत्र अधिक महत्वपूर्ण हैं, करण सूक्ष्म समायोजन का कार्य करता है:',
  },
  muhurtaRule1: {
    en: 'Always avoid Vishti (Bhadra) Karana for auspicious events. Since Vishti occurs 8 times a month, it eliminates roughly 13% of available time.',
    hi: 'शुभ कार्यों के लिए विष्टि (भद्रा) करण सदैव त्याज्य है। चूंकि विष्टि मास में 8 बार आती है, यह उपलब्ध समय का लगभग 13% समाप्त कर देती है।',
  },
  muhurtaRule2: {
    en: 'Bava and Balava Karanas are especially recommended for marriage (Vivaha), religious initiations (Upanayana), and house construction (Griha Arambha).',
    hi: 'बव और बालव करण विशेष रूप से विवाह, उपनयन और गृहारम्भ के लिए अनुशंसित हैं।',
  },
  muhurtaRule3: {
    en: 'Vanija Karana is preferred for starting new businesses, signing contracts, and agricultural sowing.',
    hi: 'वणिज करण नया व्यापार आरम्भ करने, अनुबन्ध हस्ताक्षर और कृषि बुआई के लिए श्रेष्ठ है।',
  },
  muhurtaRule4: {
    en: 'The Sthira Karanas (Shakuni, Chatushpada, Naga, Kimstughna) at month boundaries are reserved for specific rituals like Shraddha, animal husbandry, and spiritual practices.',
    hi: 'मास की सीमाओं पर स्थिर करण (शकुनि, चतुष्पद, नाग, किंस्तुघ्न) श्राद्ध, पशुपालन और आध्यात्मिक साधना जैसे विशिष्ट अनुष्ठानों के लिए आरक्षित हैं।',
  },

  cycleTitle: { en: 'How Karanas Cycle Through the Lunar Month', hi: 'करण चान्द्रमास में कैसे चक्रित होते हैं' },
  cycleBody: {
    en: 'The 60 Karanas of each lunar month follow a precise pattern. Understanding this cycle is key to predicting which Karana will be active at any point in the month:',
    hi: '60 करणों का प्रत्येक चान्द्रमास में एक सटीक क्रम होता है। इस चक्र को समझना मास के किसी भी बिन्दु पर सक्रिय करण की पूर्वानुमान की कुंजी है:',
  },
  cycleStep1: {
    en: 'Position 1 (Shukla Pratipada, 1st half): Kimstughna (sthira) -- the month begins with the last fixed karana, symbolizing the dissolution of the old cycle.',
    hi: 'स्थान 1 (शुक्ल प्रतिपदा, प्रथम भाग): किंस्तुघ्न (स्थिर) -- मास अन्तिम स्थिर करण से प्रारम्भ होता है, पुराने चक्र के विलय का प्रतीक।',
  },
  cycleStep2: {
    en: 'Positions 2-57 (Shukla Pratipada 2nd half through Krishna Chaturdashi 1st half): The 7 chara karanas cycle 8 times in order: Bava, Balava, Kaulava, Taitila, Garaja, Vanija, Vishti.',
    hi: 'स्थान 2-57 (शुक्ल प्रतिपदा दूसरा भाग से कृष्ण चतुर्दशी प्रथम भाग तक): 7 चर करण क्रमानुसार 8 बार चक्रित: बव, बालव, कौलव, तैतिल, गरज, वणिज, विष्टि।',
  },
  cycleStep3: {
    en: 'Positions 58-60 (Krishna Chaturdashi 2nd half, Amavasya 1st & 2nd half): Shakuni, Chatushpada, Naga (sthira) -- the month ends with three fixed karanas at the darkest phase.',
    hi: 'स्थान 58-60 (कृष्ण चतुर्दशी दूसरा भाग, अमावस्या प्रथम एवं द्वितीय भाग): शकुनि, चतुष्पद, नाग (स्थिर) -- मास तीन स्थिर करणों के साथ अन्धकारमय चरण में समाप्त होता है।',
  },

  crossRefTitle: { en: 'Related Topics', hi: 'सम्बन्धित विषय' },
  crossRefTithi: { en: 'Tithis -- The parent unit (each Tithi = 2 Karanas)', hi: 'तिथि -- मूल इकाई (प्रत्येक तिथि = 2 करण)' },
  crossRefYoga: { en: 'Yogas -- Another Panchang limb from Sun+Moon', hi: 'योग -- सूर्य+चन्द्र से पंचांग का अन्य अंग' },
  crossRefMuhurta: { en: 'Muhurtas -- Time divisions of the day', hi: 'मुहूर्त -- दिन के समय विभाजन' },
  crossRefNakshatra: { en: 'Nakshatras -- Lunar mansions that pair with Karanas in Muhurta', hi: 'नक्षत्र -- चान्द्र भवन जो मुहूर्त में करणों के साथ जुड़ते हैं' },

  viewPanchang: { en: 'View Today\'s Karana in Panchang', hi: 'आज का करण पंचांग में देखें' },
} as const;

/* ─── Karana detailed data (inline, not in constants file) ─── */
const KARANA_DETAILS: Record<string, {
  deity: { en: string; hi: string };
  nature: 'auspicious' | 'neutral' | 'inauspicious';
  meaning: { en: string; hi: string };
  bestFor: { en: string; hi: string };
}> = {
  Bava: {
    deity: { en: 'Indra', hi: 'इन्द्र' },
    nature: 'auspicious',
    meaning: { en: 'Power & authority', hi: 'शक्ति और अधिकार' },
    bestFor: { en: 'Government work, ceremonies, construction, leadership tasks', hi: 'शासकीय कार्य, संस्कार, निर्माण, नेतृत्व कार्य' },
  },
  Balava: {
    deity: { en: 'Brahma', hi: 'ब्रह्मा' },
    nature: 'auspicious',
    meaning: { en: 'Creative energy', hi: 'सृजन ऊर्जा' },
    bestFor: { en: 'Education, marriage, writing, artistic pursuits, worship', hi: 'शिक्षा, विवाह, लेखन, कलात्मक कार्य, पूजा' },
  },
  Kaulava: {
    deity: { en: 'Mitra', hi: 'मित्र' },
    nature: 'auspicious',
    meaning: { en: 'Friendship & harmony', hi: 'मित्रता और सामंजस्य' },
    bestFor: { en: 'Friendships, partnerships, social gatherings, reconciliation', hi: 'मित्रता, साझेदारी, सामाजिक सभा, मेल-मिलाप' },
  },
  Taitila: {
    deity: { en: 'Aryaman', hi: 'अर्यमन्' },
    nature: 'auspicious',
    meaning: { en: 'Wealth & prosperity', hi: 'धन और समृद्धि' },
    bestFor: { en: 'Financial matters, property, jewelry, investments', hi: 'वित्तीय कार्य, सम्पत्ति, आभूषण, निवेश' },
  },
  Garaja: {
    deity: { en: 'Prithvi (Earth)', hi: 'पृथ्वी' },
    nature: 'auspicious',
    meaning: { en: 'Stability & grounding', hi: 'स्थिरता और आधार' },
    bestFor: { en: 'Agriculture, house construction, land purchase, housewarming', hi: 'कृषि, गृह निर्माण, भूमि क्रय, गृहप्रवेश' },
  },
  Vanija: {
    deity: { en: 'Lakshmi', hi: 'लक्ष्मी' },
    nature: 'neutral',
    meaning: { en: 'Commerce & trade', hi: 'वाणिज्य और व्यापार' },
    bestFor: { en: 'Business deals, trade, sales, market activities, sowing crops', hi: 'व्यापारिक सौदे, विक्रय, बाजार गतिविधियां, बुआई' },
  },
  Vishti: {
    deity: { en: 'Yama', hi: 'यम' },
    nature: 'inauspicious',
    meaning: { en: 'Obstruction & destruction', hi: 'बाधा और विनाश' },
    bestFor: { en: 'AVOID for all auspicious work. Only suitable for demolition, confrontation, warfare, or acts of destruction', hi: 'सभी शुभ कार्यों में त्याज्य। केवल ध्वंस, संघर्ष, युद्ध या विनाश के कार्यों में उपयुक्त' },
  },
  Shakuni: {
    deity: { en: 'Garuda', hi: 'गरुड़' },
    nature: 'neutral',
    meaning: { en: 'Omen-reading, divination', hi: 'शकुन-विचार, भविष्यवाणी' },
    bestFor: { en: 'Preparing medicines, poison-related work, divination, tantric practices', hi: 'औषधि निर्माण, विष सम्बन्धी कार्य, भविष्यवाणी, तान्त्रिक साधना' },
  },
  Chatushpada: {
    deity: { en: 'Rudra', hi: 'रुद्र' },
    nature: 'neutral',
    meaning: { en: 'Four-footed, stability', hi: 'चतुष्पद, स्थिरता' },
    bestFor: { en: 'Animal husbandry, cattle purchase, veterinary work, stable foundations', hi: 'पशुपालन, पशु क्रय, पशु चिकित्सा, स्थिर आधार कार्य' },
  },
  Nagava: {
    deity: { en: 'Naga (Serpent)', hi: 'नाग' },
    nature: 'inauspicious',
    meaning: { en: 'Hidden dangers, underworld', hi: 'छिपे हुए संकट, पाताल' },
    bestFor: { en: 'Cruel acts, destructive tasks, underground work. Avoid travel and ceremonies', hi: 'क्रूर कर्म, विध्वंसक कार्य, भूमिगत कार्य। यात्रा और संस्कारों में त्याज्य' },
  },
  Kimstughna: {
    deity: { en: 'Vayu', hi: 'वायु' },
    nature: 'auspicious',
    meaning: { en: 'Destroyer of negativity', hi: 'नकारात्मकता का नाशक' },
    bestFor: { en: 'Charity, spiritual practices, Shraddha, overcoming obstacles. A surprisingly auspicious fixed karana', hi: 'दान, आध्यात्मिक साधना, श्राद्ध, बाधा निवारण। एक आश्चर्यजनक शुभ स्थिर करण' },
  },
};

/* ─── Cycle position map showing all 60 karanas ─── */
const CYCLE_POSITIONS = [
  { pos: 1, name: 'Kimstughna', type: 'sthira' as const, tithi: 'Shukla 1, 1st half' },
  ...Array.from({ length: 56 }, (_, i) => {
    const charaNames = ['Bava', 'Balava', 'Kaulava', 'Taitila', 'Garaja', 'Vanija', 'Vishti'];
    const pos = i + 2;
    const tithiNum = Math.floor(pos / 2) + 1;
    const half = pos % 2 === 0 ? '2nd' : '1st';
    const paksha = tithiNum <= 15 ? 'Shukla' : 'Krishna';
    const tithiInPaksha = tithiNum <= 15 ? tithiNum : tithiNum - 15;
    return {
      pos,
      name: charaNames[i % 7],
      type: 'chara' as const,
      tithi: `${paksha} ${tithiInPaksha}, ${half} half`,
    };
  }),
  { pos: 58, name: 'Shakuni', type: 'sthira' as const, tithi: 'Krishna 14, 2nd half' },
  { pos: 59, name: 'Chatushpada', type: 'sthira' as const, tithi: 'Amavasya, 1st half' },
  { pos: 60, name: 'Naga', type: 'sthira' as const, tithi: 'Amavasya, 2nd half' },
];

const natureColor = (nature: string) => {
  if (nature === 'auspicious') return 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5';
  if (nature === 'neutral') return 'text-amber-400 border-amber-500/20 bg-amber-500/5';
  return 'text-red-400 border-red-500/20 bg-red-500/5';
};

const natureLabel = (nature: string, locale: string) => {
  if (nature === 'auspicious') return locale === 'en' ? 'Shubha' : 'शुभ';
  if (nature === 'neutral') return locale === 'en' ? 'Mishra' : 'मिश्र';
  return locale === 'en' ? 'Ashubha' : 'अशुभ';
};

export default function LearnKaranasPage() {
  const t = useTranslations('learn');
  const locale = useLocale() as Locale;
  const loc = locale === 'sa' ? 'hi' : locale; // fallback sa -> hi for inline labels

  const chara = KARANAS.filter(k => k.type === 'chara');
  const sthira = KARANAS.filter(k => k.type === 'sthira');
  const [expandedKarana, setExpandedKarana] = useState<string | null>(null);
  const [showFullCycle, setShowFullCycle] = useState(false);

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {L.title[loc]}
        </h2>
        <p className="text-text-secondary">{L.subtitle[loc]}</p>
      </div>

      {/* ─── Section 1: What is a Karana? ─── */}
      <LessonSection number={1} title={L.whatIs[loc]}>
        <p>{L.whatIsBody[loc]}</p>
        <p>{L.whatIsBody2[loc]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">1 Karana = 6{'\u00B0'} of Moon-Sun elongation = {'\u00BD'} Tithi</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">1 Tithi = 12{'\u00B0'} = 2 Karanas</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">30 Tithis x 2 = 60 Karanas per lunar month</p>
        </div>
      </LessonSection>

      {/* ─── Section 2: The 11 Types ─── */}
      <LessonSection number={2} title={L.elevenTypes[loc]}>
        <p>{L.elevenBody[loc]}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div className="p-4 rounded-lg border border-gold-primary/20 bg-gold-primary/5">
            <h4 className="text-gold-light font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{L.charaLabel[loc]}</h4>
            <p className="text-text-secondary text-sm">{L.charaDesc[loc]}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {chara.map(k => (
                <span key={k.number} className={`text-xs px-2 py-0.5 rounded-full border ${k.name.en === 'Vishti' ? 'border-red-500/30 text-red-400' : 'border-gold-primary/20 text-gold-light'}`}>
                  {k.name[locale]}
                </span>
              ))}
            </div>
          </div>
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="text-amber-300 font-bold mb-1" style={{ fontFamily: 'var(--font-heading)' }}>{L.sthiraLabel[loc]}</h4>
            <p className="text-text-secondary text-sm">{L.sthiraDesc[loc]}</p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sthira.map(k => (
                <span key={k.number} className="text-xs px-2 py-0.5 rounded-full border border-amber-500/20 text-amber-300">
                  {k.name[locale]}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg border border-gold-primary/10 text-center">
          <p className="text-gold-light font-mono text-sm">{L.totalFormula[loc]}</p>
        </div>
      </LessonSection>

      {/* ─── Section 3: Calculation Formula ─── */}
      <LessonSection number={3} title={L.calcTitle[loc]}>
        <p>{L.calcBody[loc]}</p>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm">Karana Position = floor((Moon{'\u00B0'} - Sun{'\u00B0'}) / 6) + 1</p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">If elongation {'<'} 0, add 360{'\u00B0'} (normalize to 0-360)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Position 1 = Kimstughna (sthira)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Positions 2-57 = Chara cycle: (pos-2) mod 7 maps to Bava(0)...Vishti(6)</p>
          <p className="text-gold-light/60 font-mono text-xs mt-1">Positions 58,59,60 = Shakuni, Chatushpada, Naga (sthira)</p>
        </div>

        <div className="mt-5 p-5 rounded-xl border border-gold-primary/15 bg-gold-primary/5">
          <h4 className="text-gold-light font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{L.workedExample[loc]}</h4>
          <p className="text-text-secondary text-sm mb-3">{L.workedBody[loc]}</p>
          <div className="space-y-2">
            {[L.step1, L.step2, L.step3, L.step4].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold mt-0.5">
                  {i + 1}
                </span>
                <p className="text-text-secondary text-sm">{step[loc]}</p>
              </div>
            ))}
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 4: Deity & Nature (expandable cards) ─── */}
      <LessonSection number={4} title={L.deityTitle[loc]}>
        <p>{L.deityBody[loc]}</p>

        <div className="space-y-3 mt-4">
          {[...chara, ...sthira].map((k, i) => {
            const detail = KARANA_DETAILS[k.name.en];
            if (!detail) return null;
            const isExpanded = expandedKarana === k.name.en;
            return (
              <motion.div
                key={k.number}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card rounded-xl border overflow-hidden ${
                  k.name.en === 'Vishti' ? 'border-red-500/20' :
                  k.type === 'sthira' ? 'border-amber-500/15' :
                  'border-gold-primary/10'
                }`}
              >
                <button
                  onClick={() => setExpandedKarana(isExpanded ? null : k.name.en)}
                  className="w-full text-left p-4 hover:bg-gold-primary/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold text-xl w-8 ${k.type === 'sthira' ? 'text-amber-400' : 'text-gold-primary'}`}>{k.number}</span>
                      <div>
                        <span className="text-gold-light font-bold">{k.name[locale]}</span>
                        {locale !== 'en' && <span className="ml-2 text-text-secondary/50 text-xs">{k.name.en}</span>}
                        <span className="ml-2 text-text-secondary/40 text-xs">({detail.deity[loc]})</span>
                        {k.type === 'sthira' && (
                          <span className="ml-2 px-1.5 py-0.5 bg-amber-500/15 text-amber-300 text-[10px] rounded-full font-bold uppercase">
                            {loc === 'en' ? 'Fixed' : 'स्थिर'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${natureColor(detail.nature)}`}>
                        {natureLabel(detail.nature, loc)}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-text-secondary/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                  <p className="text-text-secondary/70 text-sm ml-11 mt-1">{detail.meaning[loc]}</p>
                </button>
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 ml-11 border-t border-gold-primary/10 pt-3">
                        <h4 className="text-xs font-semibold text-gold-primary/70 uppercase tracking-wider mb-1">
                          {loc === 'en' ? 'Best Activities' : 'उपयुक्त कार्य'}
                        </h4>
                        <p className="text-text-secondary text-sm">{detail.bestFor[loc]}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ─── Section 5: Auspicious vs Inauspicious ─── */}
      <LessonSection number={5} title={L.auspTitle[loc]}>
        <p>{L.auspBody[loc]}</p>

        <div className="space-y-4 mt-4">
          {/* Auspicious */}
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-emerald-400 font-bold mb-2">{L.goodLabel[loc]}</h4>
            <p className="text-text-secondary text-sm">{L.goodKaranas[loc]}</p>
          </div>
          {/* Neutral */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-amber-500/5">
            <h4 className="text-amber-400 font-bold mb-2">{L.neutralLabel[loc]}</h4>
            <p className="text-text-secondary text-sm">{L.neutralKaranas[loc]}</p>
          </div>
          {/* Inauspicious */}
          <div className="p-4 rounded-lg border border-red-500/20 bg-red-500/5">
            <h4 className="text-red-400 font-bold mb-2">{L.badLabel[loc]}</h4>
            <p className="text-text-secondary text-sm">{L.badKaranas[loc]}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── Section 6: Fixed Karanas Deep Dive ─── */}
      <LessonSection number={6} title={L.fixedTitle[loc]}>
        <p>{L.fixedBody[loc]}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {sthira.map((k, i) => {
            const detail = KARANA_DETAILS[k.name.en];
            if (!detail) return null;
            const positions: Record<string, { pos: string; tithi: { en: string; hi: string } }> = {
              Kimstughna: { pos: '1', tithi: { en: 'Shukla Pratipada, 1st half', hi: 'शुक्ल प्रतिपदा, प्रथम भाग' } },
              Shakuni: { pos: '58', tithi: { en: 'Krishna Chaturdashi, 2nd half', hi: 'कृष्ण चतुर्दशी, द्वितीय भाग' } },
              Chatushpada: { pos: '59', tithi: { en: 'Amavasya, 1st half', hi: 'अमावस्या, प्रथम भाग' } },
              Nagava: { pos: '60', tithi: { en: 'Amavasya, 2nd half', hi: 'अमावस्या, द्वितीय भाग' } },
            };
            const posInfo = positions[k.name.en];
            return (
              <motion.div
                key={k.number}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-xl p-5 border border-amber-500/20"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-amber-400 text-2xl font-bold">#{posInfo?.pos}</span>
                  <div>
                    <div className="text-gold-light font-bold text-lg">{k.name[locale]}</div>
                    {locale !== 'en' && <div className="text-text-secondary/50 text-xs">{k.name.en}</div>}
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary/60">{loc === 'en' ? 'Deity' : 'देवता'}</span>
                    <span className="text-gold-light">{detail.deity[loc]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary/60">{loc === 'en' ? 'Nature' : 'स्वभाव'}</span>
                    <span className={natureColor(detail.nature).split(' ')[0]}>{natureLabel(detail.nature, loc)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary/60">{loc === 'en' ? 'Occurs at' : 'स्थान'}</span>
                    <span className="text-text-secondary text-xs text-right">{posInfo?.tithi[loc]}</span>
                  </div>
                  <div className="pt-2 border-t border-gold-primary/10">
                    <p className="text-text-secondary/80 text-xs leading-relaxed">{detail.bestFor[loc]}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ─── Section 7: Karana & Muhurta Selection ─── */}
      <LessonSection number={7} title={L.muhurtaTitle[loc]}>
        <p>{L.muhurtaBody[loc]}</p>

        <div className="space-y-3 mt-4">
          {[L.muhurtaRule1, L.muhurtaRule2, L.muhurtaRule3, L.muhurtaRule4].map((rule, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-text-secondary text-sm">{rule[loc]}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── Section 8: Cycle Through the Lunar Month ─── */}
      <LessonSection number={8} title={L.cycleTitle[loc]}>
        <p>{L.cycleBody[loc]}</p>

        <div className="space-y-3 mt-4">
          {[L.cycleStep1, L.cycleStep2, L.cycleStep3].map((step, i) => (
            <div key={i} className="p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30">
              <p className="text-text-secondary text-sm">{step[loc]}</p>
            </div>
          ))}
        </div>

        {/* Expandable full 60-position table */}
        <div className="mt-5">
          <button
            onClick={() => setShowFullCycle(!showFullCycle)}
            className="flex items-center gap-2 text-gold-light text-sm font-medium hover:text-gold-primary transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${showFullCycle ? 'rotate-180' : ''}`} />
            {loc === 'en' ? 'View all 60 Karana positions' : 'सभी 60 करण स्थान देखें'}
          </button>
          <AnimatePresence>
            {showFullCycle && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-3 max-h-96 overflow-y-auto rounded-lg border border-gold-primary/10">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-bg-primary/95">
                      <tr className="border-b border-gold-primary/20">
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">#</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Karana' : 'करण'}</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Type' : 'प्रकार'}</th>
                        <th className="text-left p-2 text-gold-primary/70 font-semibold">{loc === 'en' ? 'Tithi Position' : 'तिथि स्थान'}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {CYCLE_POSITIONS.map(cp => (
                        <tr
                          key={cp.pos}
                          className={`border-b border-gold-primary/5 ${
                            cp.name === 'Vishti' ? 'bg-red-500/5' :
                            cp.type === 'sthira' ? 'bg-amber-500/5' : ''
                          }`}
                        >
                          <td className="p-2 text-gold-primary/60 font-mono">{cp.pos}</td>
                          <td className={`p-2 font-medium ${cp.name === 'Vishti' ? 'text-red-400' : cp.type === 'sthira' ? 'text-amber-300' : 'text-gold-light'}`}>
                            {cp.name}
                          </td>
                          <td className="p-2 text-text-secondary/50">{cp.type}</td>
                          <td className="p-2 text-text-secondary/60">{cp.tithi}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </LessonSection>

      {/* ─── Section 9: Cross-References ─── */}
      <LessonSection number={9} title={L.crossRefTitle[loc]}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { href: '/learn/tithis' as const, label: L.crossRefTithi },
            { href: '/learn/yogas-detailed' as const, label: L.crossRefYoga },
            { href: '/learn/muhurtas' as const, label: L.crossRefMuhurta },
            { href: '/learn/nakshatras' as const, label: L.crossRefNakshatra },
          ].map((ref, i) => (
            <Link
              key={i}
              href={ref.href}
              className="flex items-center gap-2 p-3 rounded-lg border border-gold-primary/10 bg-bg-primary/30 hover:bg-gold-primary/10 hover:border-gold-primary/30 transition-all text-sm text-text-secondary hover:text-gold-light"
            >
              <span className="text-gold-primary">{'>'}</span>
              {ref.label[loc]}
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
          {L.viewPanchang[loc]}
        </Link>
      </div>
    </div>
  );
}

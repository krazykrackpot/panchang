'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_5_2', phase: 2, topic: 'Tithi', moduleNumber: '5.2',
  title: { en: 'Paksha — The Lunar Fortnight', hi: 'पक्ष — चान्द्र पखवाड़ा' },
  subtitle: {
    en: 'Shukla and Krishna Paksha divide the lunar month into bright and dark halves, shaping rituals and calendars',
    hi: 'शुक्ल और कृष्ण पक्ष चान्द्र मास को उज्ज्वल और अन्धकार अर्धों में विभक्त करते हैं, जो अनुष्ठानों और पंचांगों को आकार देते हैं',
  },
  estimatedMinutes: 13,
  crossRefs: [
    { label: { en: 'Module 5-1: Tithi', hi: 'मॉड्यूल 5-1: तिथि' }, href: '/learn/modules/5-1' },
    { label: { en: 'Module 5-3: Tithi Calculations', hi: 'मॉड्यूल 5-3: तिथि गणना' }, href: '/learn/modules/5-3' },
    { label: { en: 'Festival Calendar', hi: 'त्योहार पंचांग' }, href: '/calendar' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q5_2_01', type: 'mcq',
    question: {
      en: 'Shukla Paksha begins after which tithi?',
      hi: 'शुक्ल पक्ष किस तिथि के पश्चात् आरम्भ होता है?',
    },
    options: [
      { en: 'Purnima (Full Moon)', hi: 'पूर्णिमा' },
      { en: 'Amavasya (New Moon)', hi: 'अमावस्या' },
      { en: 'Ashtami (8th)', hi: 'अष्टमी' },
      { en: 'Ekadashi (11th)', hi: 'एकादशी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shukla Paksha (the bright half) begins immediately after Amavasya (new Moon). The Moon starts waxing from this point, growing brighter each day until Purnima.',
      hi: 'शुक्ल पक्ष (उज्ज्वल अर्ध) अमावस्या के ठीक बाद आरम्भ होता है। इस बिन्दु से चन्द्रमा बढ़ना शुरू करता है और प्रतिदिन उज्ज्वल होता हुआ पूर्णिमा तक पहुँचता है।',
    },
  },
  {
    id: 'q5_2_02', type: 'true_false',
    question: {
      en: 'In the Purnimanta system, the lunar month ends on Purnima (full Moon day).',
      hi: 'पूर्णिमान्त पद्धति में चान्द्र मास पूर्णिमा (पूर्ण चन्द्र दिवस) पर समाप्त होता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In the Purnimanta system (used primarily in North India), the lunar month ends on Purnima. The month begins with Krishna Paksha Pratipada (the day after the previous Purnima) and ends on the next Purnima.',
      hi: 'सत्य। पूर्णिमान्त पद्धति (मुख्यतः उत्तर भारत में प्रचलित) में चान्द्र मास पूर्णिमा पर समाप्त होता है। मास कृष्ण पक्ष प्रतिपदा (पिछली पूर्णिमा के अगले दिन) से आरम्भ होकर अगली पूर्णिमा पर समाप्त होता है।',
    },
  },
  {
    id: 'q5_2_03', type: 'mcq',
    question: {
      en: 'In the Amanta system, the lunar month ends on:',
      hi: 'अमान्त पद्धति में चान्द्र मास किस दिन समाप्त होता है?',
    },
    options: [
      { en: 'Purnima', hi: 'पूर्णिमा' },
      { en: 'Ekadashi', hi: 'एकादशी' },
      { en: 'Amavasya', hi: 'अमावस्या' },
      { en: 'Chaturdashi', hi: 'चतुर्दशी' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'In the Amanta system (used in South India, Maharashtra, Gujarat), the month ends on Amavasya (new Moon). The month begins with Shukla Paksha Pratipada and ends when Amavasya concludes.',
      hi: 'अमान्त पद्धति (दक्षिण भारत, महाराष्ट्र, गुजरात में प्रचलित) में मास अमावस्या पर समाप्त होता है। मास शुक्ल पक्ष प्रतिपदा से आरम्भ होकर अमावस्या के समापन पर समाप्त होता है।',
    },
  },
  {
    id: 'q5_2_04', type: 'mcq',
    question: {
      en: 'Why does the Moon wax during Shukla Paksha?',
      hi: 'शुक्ल पक्ष में चन्द्रमा क्यों बढ़ता है?',
    },
    options: [
      { en: 'The Moon produces its own light that increases cyclically', hi: 'चन्द्रमा अपना प्रकाश स्वयं उत्पन्न करता है जो चक्रीय रूप से बढ़ता है' },
      { en: 'The Sun moves closer to the Moon during this period', hi: 'इस अवधि में सूर्य चन्द्रमा के निकट आता है' },
      { en: 'The Moon-Sun angular separation increases, revealing more of the illuminated surface', hi: 'चन्द्र-सूर्य कोणीय दूरी बढ़ती है, जिससे प्रकाशित सतह अधिक दिखती है' },
      { en: 'Earth\'s shadow gradually recedes from the Moon', hi: 'पृथ्वी की छाया चन्द्रमा से धीरे-धीरे हटती है' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'As the Moon moves ahead of the Sun in its orbit, the elongation (angular separation) increases from 0 to 180 degrees. A larger elongation means we see more of the Moon\'s sunlit hemisphere from Earth, making it appear brighter and fuller.',
      hi: 'जैसे-जैसे चन्द्रमा अपनी कक्षा में सूर्य से आगे बढ़ता है, कोणीय दूरी 0 से 180 अंश तक बढ़ती है। अधिक कोणीय दूरी का अर्थ है कि पृथ्वी से चन्द्रमा का सूर्य-प्रकाशित गोलार्ध अधिक दिखता है, जिससे वह उज्ज्वल और पूर्ण प्रतीत होता है।',
    },
  },
  {
    id: 'q5_2_05', type: 'true_false',
    question: {
      en: 'Chaitra Shukla Pratipada falls in the same Gregorian month in both Amanta and Purnimanta systems.',
      hi: 'चैत्र शुक्ल प्रतिपदा दोनों अमान्त और पूर्णिमान्त पद्धतियों में एक ही ग्रेगोरियन मास में आती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Chaitra Shukla Pratipada (the Hindu New Year in many traditions) refers to the same astronomical day in both systems. The difference between Amanta and Purnimanta only affects which month-name is assigned to the Krishna Paksha portion, not the Shukla Paksha dates.',
      hi: 'सत्य। चैत्र शुक्ल प्रतिपदा (अनेक परम्पराओं में हिन्दू नव वर्ष) दोनों पद्धतियों में एक ही खगोलीय दिन है। अमान्त और पूर्णिमान्त का अन्तर केवल इस बात को प्रभावित करता है कि कृष्ण पक्ष को किस मास-नाम से जाना जाए, शुक्ल पक्ष की तिथियाँ प्रभावित नहीं होतीं।',
    },
  },
  {
    id: 'q5_2_06', type: 'mcq',
    question: {
      en: 'Shraddha (ancestral rites) are traditionally performed during which paksha?',
      hi: 'श्राद्ध (पितृ कर्म) परम्परागत रूप से किस पक्ष में किए जाते हैं?',
    },
    options: [
      { en: 'Shukla Paksha only', hi: 'केवल शुक्ल पक्ष' },
      { en: 'Krishna Paksha, especially in Pitru Paksha', hi: 'कृष्ण पक्ष, विशेषतः पितृ पक्ष में' },
      { en: 'On any Purnima', hi: 'किसी भी पूर्णिमा को' },
      { en: 'Only during eclipses', hi: 'केवल ग्रहण के समय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shraddha rites are primarily associated with Krishna Paksha (the waning/dark fortnight). The most important Shraddha period is Pitru Paksha — the Krishna Paksha of Ashwin month (September-October), when 16 consecutive days are dedicated to ancestral offerings.',
      hi: 'श्राद्ध कर्म मुख्य रूप से कृष्ण पक्ष (ह्रासमान/अन्धकार पखवाड़ा) से जुड़े हैं। सबसे महत्वपूर्ण श्राद्ध काल पितृ पक्ष है — आश्विन मास (सितम्बर-अक्टूबर) का कृष्ण पक्ष, जब लगातार 16 दिन पितृ तर्पण को समर्पित होते हैं।',
    },
  },
  {
    id: 'q5_2_07', type: 'true_false',
    question: {
      en: 'The Krishna Paksha Ekadashi and Shukla Paksha Ekadashi of the same month always have the same religious significance.',
      hi: 'एक ही मास की कृष्ण पक्ष एकादशी और शुक्ल पक्ष एकादशी का धार्मिक महत्त्व सदैव समान होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Each Ekadashi has a unique name and distinct spiritual significance. For example, in Ashwin month, the Krishna Paksha Ekadashi is "Indira Ekadashi" (focused on liberating ancestors from lower realms), while the Shukla Paksha Ekadashi is "Papankusha Ekadashi" (focused on destroying sins).',
      hi: 'असत्य। प्रत्येक एकादशी का एक विशिष्ट नाम और अलग आध्यात्मिक महत्त्व है। उदाहरणार्थ, आश्विन मास में कृष्ण पक्ष एकादशी "इन्दिरा एकादशी" (पितरों की निम्न लोकों से मुक्ति हेतु) है, जबकि शुक्ल पक्ष एकादशी "पापांकुशा एकादशी" (पापों के नाश हेतु) है।',
    },
  },
  {
    id: 'q5_2_08', type: 'mcq',
    question: {
      en: 'In the Purnimanta system, Phalguna Krishna Paksha is equivalent to which month in the Amanta system?',
      hi: 'पूर्णिमान्त पद्धति में फाल्गुन कृष्ण पक्ष अमान्त पद्धति में किस मास के समतुल्य है?',
    },
    options: [
      { en: 'Phalguna', hi: 'फाल्गुन' },
      { en: 'Magha', hi: 'माघ' },
      { en: 'Chaitra', hi: 'चैत्र' },
      { en: 'Pausha', hi: 'पौष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In Purnimanta, Phalguna month starts after Magha Purnima and includes what Amanta calls Magha Krishna Paksha. So Purnimanta\'s Phalguna Krishna Paksha = Amanta\'s Magha Krishna Paksha. The krishna paksha shifts back by one month name in the Purnimanta system.',
      hi: 'पूर्णिमान्त में फाल्गुन मास माघ पूर्णिमा के बाद आरम्भ होता है और जिसे अमान्त में माघ कृष्ण पक्ष कहते हैं, उसे सम्मिलित करता है। अतः पूर्णिमान्त का फाल्गुन कृष्ण पक्ष = अमान्त का माघ कृष्ण पक्ष। पूर्णिमान्त पद्धति में कृष्ण पक्ष एक मास-नाम पीछे खिसक जाता है।',
    },
  },
  {
    id: 'q5_2_09', type: 'mcq',
    question: {
      en: 'Which paksha is considered more favorable for marriage and starting new ventures?',
      hi: 'विवाह और नये कार्यों के आरम्भ हेतु कौन-सा पक्ष अधिक अनुकूल माना जाता है?',
    },
    options: [
      { en: 'Krishna Paksha — the waning Moon brings purification', hi: 'कृष्ण पक्ष — घटता चन्द्रमा शुद्धि लाता है' },
      { en: 'Shukla Paksha — the waxing Moon symbolizes growth', hi: 'शुक्ल पक्ष — बढ़ता चन्द्रमा वृद्धि का प्रतीक है' },
      { en: 'Both are equally favorable', hi: 'दोनों समान रूप से अनुकूल हैं' },
      { en: 'Neither — only nakshatra matters', hi: 'दोनों नहीं — केवल नक्षत्र ही महत्वपूर्ण है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shukla Paksha (waxing Moon) is preferred for growth-oriented activities like marriages, business launches, and new beginnings. The increasing Moon symbolizes expansion, prosperity, and fresh starts.',
      hi: 'शुक्ल पक्ष (बढ़ता चन्द्रमा) वृद्धि-उन्मुख कार्यों जैसे विवाह, व्यापार आरम्भ और नई शुरुआत के लिए श्रेष्ठ है। बढ़ता चन्द्रमा विस्तार, समृद्धि और नवीन आरम्भ का प्रतीक है।',
    },
  },
  {
    id: 'q5_2_10', type: 'true_false',
    question: {
      en: 'Purnima vrats (full Moon fasts) are observed every month in the Hindu calendar, with Kartik Purnima and Guru Purnima being among the most celebrated.',
      hi: 'पूर्णिमा व्रत (पूर्ण चन्द्र उपवास) हिन्दू पंचांग में प्रत्येक मास मनाए जाते हैं, जिनमें कार्तिक पूर्णिमा और गुरु पूर्णिमा सर्वाधिक प्रसिद्ध हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Each Purnima has religious significance and many Hindus observe Purnima vrats monthly. Kartik Purnima (Dev Deepawali) and Guru Purnima (honoring spiritual teachers, in Ashadha month) are especially prominent.',
      hi: 'सत्य। प्रत्येक पूर्णिमा का धार्मिक महत्त्व है और अनेक हिन्दू प्रतिमास पूर्णिमा व्रत रखते हैं। कार्तिक पूर्णिमा (देव दीपावली) और गुरु पूर्णिमा (आषाढ़ मास में गुरुजनों का सम्मान) विशेष रूप से प्रसिद्ध हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'शुक्ल एवं कृष्ण पक्ष' : 'Shukla and Krishna Paksha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'हिन्दू पंचांग में चान्द्र मास दो अर्धों में विभक्त है जिन्हें पक्ष कहते हैं। शुक्ल पक्ष (उज्ज्वल पखवाड़ा) तिथि 1 से 15 तक फैला है — चन्द्रमा अमावस्या की अदृश्यता से बढ़ते हुए पूर्णिमा की पूर्ण दीप्ति तक पहुँचता है। कृष्ण पक्ष (अन्धकार पखवाड़ा) अगली 15 तिथियों में फैला है — चन्द्रमा पूर्णिमा से घटते हुए पुनः अमावस्या तक पहुँचता है। प्रत्येक पक्ष में 15 तिथियाँ होती हैं और दोनों मिलकर लगभग 29.53 सौर दिनों का पूर्ण 30-तिथि चान्द्र चक्र बनाते हैं।'
            : 'The lunar month in the Hindu calendar is divided into two halves called pakshas. Shukla Paksha (the bright fortnight) spans tithis 1 through 15 as the Moon waxes from invisibility at Amavasya to full brilliance at Purnima. Krishna Paksha (the dark fortnight) spans the next 15 tithis as the Moon wanes from Purnima back to Amavasya. Each paksha therefore contains 15 tithis, and together they constitute the complete 30-tithi lunar cycle of approximately 29.53 solar days.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'चन्द्रमा का बढ़ना और घटना भूकेन्द्रीय कोणीय दूरी — पृथ्वी से देखने पर चन्द्रमा और सूर्य के बीच की कोणीय दूरी — में परिवर्तन का परिणाम है। अमावस्या पर चन्द्रमा और सूर्य लगभग एक ही क्रान्तिवृत्तीय भोगांश पर होते हैं (कोणीय दूरी 0 अंश के निकट), अतः चन्द्रमा का प्रकाशित भाग पृथ्वी से विपरीत दिशा में होता है। जैसे-जैसे चन्द्रमा कक्षा में आगे बढ़ता है, कोणीय दूरी बढ़ती है और हम सूर्य-प्रकाशित गोलार्ध का अधिकाधिक भाग देखते हैं। पूर्णिमा पर कोणीय दूरी 180 अंश तक पहुँचती है और सम्पूर्ण दृश्य चक्रिका प्रकाशित होती है। फिर कृष्ण पक्ष में यह प्रक्रिया विपरीत होती है।'
            : 'The waxing and waning of the Moon is a consequence of the changing geocentric elongation — the angular distance between the Moon and Sun as viewed from Earth. At Amavasya, the Moon and Sun are at nearly the same ecliptic longitude (elongation near 0 degrees), so the Moon\u2019s illuminated side faces away from Earth. As the Moon moves ahead in its orbit, the elongation increases and we see progressively more of the sunlit hemisphere. At Purnima, the elongation reaches 180 degrees and the entire visible disc is illuminated. The process then reverses during Krishna Paksha.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'पक्ष की अवधारणा वैदिक साहित्य में गहराई से समाहित है। ऋग्वेद में चन्द्र चक्र के उज्ज्वल और अन्धकार अर्धों का उल्लेख है। कौटिल्य के अर्थशास्त्र (लगभग 300 ई.पू.) में पक्ष को प्रशासनिक समय इकाई के रूप में प्रयुक्त किया गया है। सूर्य सिद्धान्त चन्द्र-सूर्य कोणीय दूरी के सन्दर्भ में शुक्ल और कृष्ण पक्ष को परिभाषित करके खगोलीय आधार प्रदान करता है। द्वि-पक्ष संरचना सम्पूर्ण हिन्दू त्योहार पंचांग की आधारशिला है।'
            : 'The concept of paksha is deeply embedded in Vedic literature. The Rig Veda refers to the bright and dark halves of the Moon\u2019s cycle. The Arthashastra of Kautilya (c. 300 BCE) uses paksha as an administrative time unit. Surya Siddhanta provides the astronomical basis by defining Shukla and Krishna Paksha in terms of Moon-Sun elongation. The dual-paksha structure is the cornerstone upon which the entire Hindu festival calendar rests.'}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अमान्त बनाम पूर्णिमान्त पद्धतियाँ' : 'Amanta vs Purnimanta Calendar Systems'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'भारत में दो समानान्तर चान्द्र पंचांग पद्धतियाँ प्रचलित हैं जो मास की सीमा के स्थान में भिन्न हैं। अमान्त (मुख्य मान) पद्धति दक्षिण भारत, महाराष्ट्र और गुजरात में प्रचलित है और मास अमावस्या पर समाप्त होता है — मास शुक्ल पक्ष प्रतिपदा से आरम्भ होकर अमावस्या पर समाप्त होता है। पूर्णिमान्त (गौण मान) पद्धति उत्तर भारत (उ.प्र., बिहार, म.प्र., राजस्थान) में प्रमुख है और मास पूर्णिमा पर समाप्त होता है — यहाँ मास कृष्ण पक्ष प्रतिपदा (पिछली पूर्णिमा के अगले दिन) से आरम्भ होकर अगली पूर्णिमा पर समाप्त होता है।'
            : 'India uses two parallel lunar calendar systems that differ in where the month boundary falls. The Amanta (also called Mukhya Mana) system, prevalent in South India, Maharashtra, and Gujarat, ends the month at Amavasya. A month begins with Shukla Paksha Pratipada and ends with Amavasya. The Purnimanta (also called Gauna Mana) system, predominant in North India (UP, Bihar, MP, Rajasthan), ends the month at Purnima. Here a month begins with Krishna Paksha Pratipada (the day after the previous Purnima) and concludes at the next Purnima.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'इसका महत्वपूर्ण परिणाम यह है कि कृष्ण पक्ष का प्रत्येक पद्धति में भिन्न मास-नाम होता है। अमान्त में (मान लें) चैत्र के दोनों पक्ष "चैत्र" कहलाते हैं। पूर्णिमान्त में अमान्त का जो कृष्ण अर्ध "चैत्र" कहलाता है, वह "वैशाख" कहलाता है क्योंकि वह चैत्र पूर्णिमा के बाद आता है। अर्थात् वही खगोलीय दिन — मान लें अप्रैल के अन्त में पड़ने वाली कृष्ण पक्ष एकादशी — अमान्त में "चैत्र कृष्ण एकादशी" और पूर्णिमान्त में "वैशाख कृष्ण एकादशी" कहलाती है।'
            : 'The critical consequence is that the Krishna Paksha carries a different month name in each system. In Amanta, both pakshas of (say) Chaitra share the name "Chaitra." In Purnimanta, the Krishna half that Amanta calls "Chaitra" is instead labeled "Vaishakha" because it falls after Chaitra Purnima. This means the same astronomical day — say Krishna Paksha Ekadashi falling in late April — is called "Chaitra Krishna Ekadashi" in Amanta but "Vaishakha Krishna Ekadashi" in Purnimanta.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> महा शिवरात्रि पर विचार करें, जो कृष्ण पक्ष चतुर्दशी (14वीं) को मनाई जाती है। अमान्त में यह माघ मास में आती है। पूर्णिमान्त में वही दिन फाल्गुन मास में आता है (क्योंकि माघ पूर्णिमा के बाद पूर्णिमान्त में फाल्गुन आरम्भ होता है)। खगोलीय घटना — चन्द्रमा और सूर्य की ठीक वही स्थिति — समान है, केवल नाम बदलता है।</> : <><span className="text-gold-light font-medium">Example:</span> Consider Maha Shivaratri, observed on Chaturdashi (14th) of Krishna Paksha. In Amanta, this falls in Magha month. In Purnimanta, the same day falls in Phalguna month (because after Magha Purnima, Purnimanta begins Phalguna). The astronomical event — the exact position of Moon and Sun — is identical. Only the label changes.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">सुझाव:</span> क्षेत्रीय पंचांग पढ़ते समय सदैव जाँचें कि वह अमान्त या पूर्णिमान्त प्रयोग करता है। हमारा अनुप्रयोग दोनों पद्धतियों का समर्थन करता है।</> : <><span className="text-gold-light font-medium">Tip:</span> When reading regional panchangs, always check whether they use Amanta or Purnimanta before mapping festivals to Gregorian dates. Our app supports both systems with a toggle, ensuring correct month labeling regardless of regional convention.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;अमान्त और पूर्णिमान्त में त्योहारों की तिथियाँ भिन्न होती हैं।&quot; शुक्ल पक्ष के त्योहारों के लिए यह असत्य है — चैत्र शुक्ल नवमी (राम नवमी) दोनों पद्धतियों में एक ही ग्रेगोरियन दिन पर और एक ही मास-नाम से आती है। भ्रम केवल कृष्ण पक्ष के अनुष्ठानों में उत्पन्न होता है जहाँ मास-नाम भिन्न होता है, वास्तविक तारीख नहीं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Amanta and Purnimanta give different festival dates.&quot; This is false for Shukla Paksha festivals — Chaitra Shukla Navami (Ram Navami) falls on the same Gregorian day in both systems with the same month name. The confusion arises only for Krishna Paksha observances where the month name differs, not the actual date.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पक्ष का अनुष्ठानिक महत्त्व' : 'Ritual Significance of Paksha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'शुक्ल पक्ष वृद्धि, विस्तार और शुभ आरम्भ का पखवाड़ा है। विवाह, गृह प्रवेश, व्यापार उद्घाटन, उपनयन (यज्ञोपवीत संस्कार) और अधिकांश संस्कार शुक्ल पक्ष में ही आयोजित किये जाते हैं। बढ़ता चन्द्रमा बढ़ती समृद्धि, स्वास्थ्य और आध्यात्मिक पुण्य का प्रतीक है। शुक्ल पक्ष में नवरात्रि उत्सव (चैत्र और आश्विन) दिव्य स्त्री शक्ति की विजय का प्रतीक है।'
            : 'Shukla Paksha is the fortnight of growth, expansion, and auspicious beginnings. Marriages, griha pravesh (housewarming), business inaugurations, upanayana (sacred thread ceremony), and most samskaras (life-cycle rituals) are preferably scheduled in Shukla Paksha. The waxing Moon symbolizes increasing prosperity, health, and spiritual merit. Navratri celebrations during Shukla Paksha (Chaitra and Ashwin) represent the triumph of divine feminine energy.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'इसके विपरीत, कृष्ण पक्ष विसर्जन, अन्तर्दर्शन और मोक्ष का पखवाड़ा है। श्राद्ध (पितृ कर्म), काल भैरव पूजा और तर्पण (पितरों को जलार्पण) मुख्य रूप से इसी काल में किए जाते हैं। पितृ पक्ष (आश्विन/भाद्रपद के कृष्ण पक्ष के 16 दिन) दिवंगत पूर्वजों के सम्मान का सर्वाधिक महत्वपूर्ण वार्षिक काल है। कुछ तान्त्रिक और शक्ति-उन्मुख साधनाएँ भी अन्धकार पखवाड़े में अधिक प्रभावशाली मानी जाती हैं।'
            : 'Krishna Paksha, by contrast, is the fortnight of dissolution, introspection, and release. Shraddha (ancestral rites), Kala Bhairava worship, and tarpan (water offerings to ancestors) are performed primarily during this phase. The Pitru Paksha (16 days of Krishna Paksha in Ashwin/Bhadrapada) is the most important annual period for honoring deceased ancestors. Certain tantric and Shakti-oriented sadhanas are also considered more potent during the dark fortnight.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दोनों पक्षों में एकादशी व्रत' : 'Ekadashi Fasting in Both Pakshas'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'एकादशी (11वीं तिथि) दोनों पक्षों में उपवास दिवस के रूप में मनाई जाती है, जिससे वर्ष में 24 एकादशियाँ (तथा कभी-कभी अधिक मास में अतिरिक्त) होती हैं। शुक्ल पक्ष एकादशियाँ सामान्यतः सकारात्मक आध्यात्मिक वृद्धि और विष्णु पूजा से जुड़ी हैं, जबकि कृष्ण पक्ष एकादशियाँ शुद्धिकरण, तपस्या और पितृ मोक्ष के विषय लिए होती हैं। प्रत्येक 24 एकादशियों का एक विशिष्ट नाम है — निर्जला, वैकुण्ठ, मोक्षदा, देवशयनी आदि — जिनमें विशिष्ट व्रत-कथा और निर्धारित अनुष्ठान हैं।'
            : 'Ekadashi (the 11th tithi) is observed as a fasting day in both pakshas, yielding 24 Ekadashis per year (plus occasionally extra ones in adhika months). Shukla Paksha Ekadashis are generally associated with positive spiritual growth and Vishnu worship, while Krishna Paksha Ekadashis carry themes of purification, penance, and ancestral liberation. Each of the 24 Ekadashis has a unique name — Nirjala, Vaikunta, Mokshada, Devshayani, and so on — with specific vrat-katha (fasting stories) and prescribed rituals.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> चेन्नई (अमान्त) का एक भक्त और वाराणसी (पूर्णिमान्त) का एक भक्त दोनों वैकुण्ठ एकादशी मनाते हैं। खगोलीय एकादशी — वही चन्द्र-सूर्य कोणीय दूरी — दोनों के लिए एक ही ग्रेगोरियन तारीख पर आती है। किन्तु यदि कृष्ण पक्ष का कोई त्योहार हो तो चेन्नई का भक्त उसे &quot;मार्गशीर्ष कृष्ण एकादशी&quot; कहता है जबकि वाराणसी का भक्त उसी दिन को &quot;पौष कृष्ण एकादशी&quot; कहता है। अनुष्ठान और तारीख समान हैं; केवल मास-नाम भिन्न है।</> : <><span className="text-gold-light font-medium">Example:</span> A devotee in Chennai (Amanta) and one in Varanasi (Purnimanta) both observe Vaikunta Ekadashi. The astronomical Ekadashi — the same Moon-Sun elongation — falls on the same Gregorian date for both. But if a Krishna Paksha festival is involved, the Chennai devotee calls it &quot;Margashirsha Krishna Ekadashi&quot; while the Varanasi devotee calls the same day &quot;Pausha Krishna Ekadashi.&quot; The ritual performed and the date are identical; only the month label differs.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;कृष्ण पक्ष पूर्णतया नकारात्मक है और कोई शुभ कार्य नहीं करना चाहिए।&quot; यद्यपि कृष्ण पक्ष वृद्धि-उन्मुख मुहूर्तों के लिए आदर्श नहीं है, वह वास्तव में महत्वपूर्ण आध्यात्मिक साधनाओं का निर्धारित समय है — शनि प्रदोष व्रत, मास शिवरात्रि (चतुर्दशी) और सभी पितृ कर्म। काली और भैरव सहित अनेक शक्तिशाली देवता विशेष रूप से अन्धकार पखवाड़े में पूजित होते हैं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Krishna Paksha is entirely negative and nothing good should be done.&quot; While Krishna Paksha is not ideal for growth-oriented muhurtas, it is actually the prescribed time for important spiritual practices — Shani Pradosh vrat, Masa Shivaratri (Chaturdashi), and all ancestral rites. Many powerful deities including Kali and Bhairava are specifically worshipped during the dark fortnight.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'अमान्त/पूर्णिमान्त भेद को समझना किसी भी अखिल भारतीय डिजिटल पंचांग के लिए आवश्यक है। हमारा अनुप्रयोग दोनों पद्धतियों को उपयोगकर्ता टॉगल के साथ लागू करता है, चयनित पद्धति के अनुसार किसी भी कृष्ण पक्ष तिथि का सही मास-नाम प्रदर्शित करता है। इससे भिन्न क्षेत्रों के उपयोगकर्ताओं को एक ही त्योहार या व्रत देखते समय भ्रम नहीं होता।'
            : 'Understanding the Amanta/Purnimanta distinction is essential for any pan-Indian digital Panchang. Our application implements both systems with a user toggle, computing the correct month name for any given Krishna Paksha date based on the selected convention. This eliminates confusion when users from different regions look up the same festival or vrat.'}
        </p>
      </section>
    </div>
  );
}

export default function Module5_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

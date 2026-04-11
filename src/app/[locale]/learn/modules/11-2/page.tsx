'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_2', phase: 3, topic: 'Dashas', moduleNumber: '11.2',
  title: { en: 'Yogini and Char Dasha — Alternative Systems', hi: 'योगिनी एवं चर दशा — वैकल्पिक पद्धतियाँ' },
  subtitle: {
    en: 'Beyond Vimshottari: the 36-year Yogini cycle and Jaimini\'s sign-based Char Dasha for event confirmation',
    hi: 'विंशोत्तरी से परे: 36 वर्षीय योगिनी चक्र और घटना पुष्टि के लिए जैमिनी की राशि-आधारित चर दशा',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 11-1: Vimshottari Dasha', hi: 'मॉड्यूल 11-1: विंशोत्तरी दशा' }, href: '/learn/modules/11-1' },
    { label: { en: 'Module 11-3: Dasha & Transit Overlay', hi: 'मॉड्यूल 11-3: दशा एवं गोचर आच्छादन' }, href: '/learn/modules/11-3' },
    { label: { en: 'Dashas Deep Dive', hi: 'दशा विस्तार' }, href: '/learn/dashas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q11_2_01', type: 'mcq',
    question: {
      en: 'What is the total cycle length of the Yogini Dasha system?',
      hi: 'योगिनी दशा पद्धति के चक्र की कुल अवधि कितनी है?',
    },
    options: [
      { en: '27 years', hi: '27 वर्ष' },
      { en: '36 years', hi: '36 वर्ष' },
      { en: '60 years', hi: '60 वर्ष' },
      { en: '120 years', hi: '120 वर्ष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Yogini Dasha cycle totals 36 years: Mangala(1) + Pingala(2) + Dhanya(3) + Bhramari(4) + Bhadrika(5) + Ulka(6) + Siddha(7) + Sankata(8) = 36. It repeats multiple times within a lifetime, making it useful for quick confirmation.',
      hi: 'योगिनी दशा चक्र कुल 36 वर्ष है: मंगला(1) + पिंगला(2) + धन्या(3) + भ्रामरी(4) + भद्रिका(5) + उल्का(6) + सिद्धा(7) + संकटा(8) = 36। यह जीवनकाल में कई बार दोहराता है, जिससे यह शीघ्र पुष्टि के लिए उपयोगी है।',
    },
  },
  {
    id: 'q11_2_02', type: 'mcq',
    question: {
      en: 'How many Yoginis are there in the Yogini Dasha system?',
      hi: 'योगिनी दशा पद्धति में कितनी योगिनियाँ हैं?',
    },
    options: [
      { en: '7', hi: '7' },
      { en: '8', hi: '8' },
      { en: '9', hi: '9' },
      { en: '12', hi: '12' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'There are 8 Yoginis: Mangala, Pingala, Dhanya, Bhramari, Bhadrika, Ulka, Siddha, and Sankata. Each is assigned 1 through 8 years respectively, and each is linked to a specific planet.',
      hi: '8 योगिनियाँ हैं: मंगला, पिंगला, धन्या, भ्रामरी, भद्रिका, उल्का, सिद्धा और संकटा। प्रत्येक को क्रमशः 1 से 8 वर्ष आवण्टित हैं, और प्रत्येक एक विशिष्ट ग्रह से जुड़ी है।',
    },
  },
  {
    id: 'q11_2_03', type: 'true_false',
    question: {
      en: 'Char Dasha is a planet-based system like Vimshottari.',
      hi: 'चर दशा विंशोत्तरी की तरह ग्रह-आधारित पद्धति है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Char Dasha (Jaimini) is a sign-based (rashi-based) system. Each of the 12 signs gets a dasha period, unlike Vimshottari which assigns periods to 9 planets. The dasha duration for each sign is calculated based on its lord\'s distance from the sign.',
      hi: 'असत्य। चर दशा (जैमिनी) राशि-आधारित पद्धति है। 12 राशियों में से प्रत्येक को एक दशा काल मिलता है, विंशोत्तरी के विपरीत जो 9 ग्रहों को काल निर्दिष्ट करती है। प्रत्येक राशि की दशा अवधि उसके स्वामी की राशि से दूरी के आधार पर गणित होती है।',
    },
  },
  {
    id: 'q11_2_04', type: 'mcq',
    question: {
      en: 'Which Yogini has the longest dasha period?',
      hi: 'किस योगिनी की दशा अवधि सबसे लम्बी है?',
    },
    options: [
      { en: 'Siddha (7 years)', hi: 'सिद्धा (7 वर्ष)' },
      { en: 'Sankata (8 years)', hi: 'संकटा (8 वर्ष)' },
      { en: 'Ulka (6 years)', hi: 'उल्का (6 वर्ष)' },
      { en: 'Bhadrika (5 years)', hi: 'भद्रिका (5 वर्ष)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sankata has the longest period at 8 years. She is linked to Rahu and governs obstacles and karmic challenges. The Yogini periods ascend: Mangala(1), Pingala(2), Dhanya(3), Bhramari(4), Bhadrika(5), Ulka(6), Siddha(7), Sankata(8).',
      hi: 'संकटा 8 वर्ष की सबसे लम्बी अवधि वाली है। वह राहु से जुड़ी है और बाधाओं तथा कार्मिक चुनौतियों की शासक है। योगिनी अवधियाँ आरोही हैं: मंगला(1), पिंगला(2), धन्या(3), भ्रामरी(4), भद्रिका(5), उल्का(6), सिद्धा(7), संकटा(8)।',
    },
  },
  {
    id: 'q11_2_05', type: 'mcq',
    question: {
      en: 'In Jaimini\'s system, what replaces the traditional Parashari aspects (graha drishti)?',
      hi: 'जैमिनी पद्धति में पारम्परिक पाराशरी दृष्टि (ग्रह दृष्टि) के स्थान पर क्या है?',
    },
    options: [
      { en: 'No aspects are used', hi: 'कोई दृष्टि प्रयुक्त नहीं' },
      { en: 'Rashi Drishti (sign-based aspects)', hi: 'राशि दृष्टि (राशि-आधारित दृष्टि)' },
      { en: 'Only conjunctions matter', hi: 'केवल युति महत्त्वपूर्ण है' },
      { en: 'Western-style orb aspects', hi: 'पाश्चात्य शैली की ओर्ब दृष्टि' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jaimini uses Rashi Drishti (sign aspects) instead of planetary aspects. In this system, all planets in a sign aspect all planets in certain other signs. Movable signs aspect fixed signs (except the adjacent one), fixed signs aspect movable signs, and dual signs aspect each other.',
      hi: 'जैमिनी ग्रह दृष्टि के स्थान पर राशि दृष्टि प्रयोग करते हैं। इस पद्धति में किसी राशि के सभी ग्रह कुछ अन्य राशियों के सभी ग्रहों को देखते हैं। चर राशियाँ स्थिर राशियों को देखती हैं (निकटवर्ती को छोड़कर), स्थिर राशियाँ चर राशियों को, और द्विस्वभाव राशियाँ एक-दूसरे को।',
    },
  },
  {
    id: 'q11_2_06', type: 'true_false',
    question: {
      en: 'Chara Karakas in Jaimini\'s system are determined by planetary degree, not by natural signification.',
      hi: 'जैमिनी पद्धति में चर कारक ग्रह अंश से निर्धारित होते हैं, नैसर्गिक कारकत्व से नहीं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In Jaimini, the planet at the highest degree in any sign becomes the Atmakaraka (soul significator), the next highest becomes Amatyakaraka (career significator), and so on. These "chara" (variable) karakas change from chart to chart, unlike Parashara\'s fixed naisargika karakas.',
      hi: 'सत्य। जैमिनी में, किसी भी राशि में सर्वोच्च अंश वाला ग्रह आत्मकारक बनता है, अगला उच्चतम अमात्यकारक, इत्यादि। ये "चर" (परिवर्तनशील) कारक प्रत्येक कुण्डली में बदलते हैं, पराशर के स्थिर नैसर्गिक कारकों के विपरीत।',
    },
  },
  {
    id: 'q11_2_07', type: 'mcq',
    question: {
      en: 'When should Yogini Dasha be preferred over Vimshottari?',
      hi: 'विंशोत्तरी की अपेक्षा योगिनी दशा को कब प्राथमिकता दी जानी चाहिए?',
    },
    options: [
      { en: 'Always — it is more accurate', hi: 'सदैव — यह अधिक सटीक है' },
      { en: 'Never — only Vimshottari is valid', hi: 'कभी नहीं — केवल विंशोत्तरी वैध है' },
      { en: 'As a secondary confirmation tool alongside Vimshottari', hi: 'विंशोत्तरी के साथ द्वितीयक पुष्टि उपकरण के रूप में' },
      { en: 'Only for female charts', hi: 'केवल स्त्री कुण्डली के लिए' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Yogini Dasha is best used as a secondary confirmation system. Its shorter 36-year cycle allows quick verification: if both Vimshottari and Yogini point to the same event timing, confidence in the prediction increases significantly.',
      hi: 'योगिनी दशा द्वितीयक पुष्टि पद्धति के रूप में सर्वोत्तम है। इसका छोटा 36-वर्षीय चक्र शीघ्र सत्यापन की अनुमति देता है: यदि विंशोत्तरी और योगिनी दोनों एक ही घटना समय की ओर इंगित करें, तो भविष्यवाणी में विश्वास काफी बढ़ जाता है।',
    },
  },
  {
    id: 'q11_2_08', type: 'mcq',
    question: {
      en: 'What principle increases prediction confidence according to this module?',
      hi: 'इस मॉड्यूल के अनुसार भविष्यवाणी में विश्वास बढ़ाने वाला सिद्धान्त कौन-सा है?',
    },
    options: [
      { en: 'Using only one dasha system consistently', hi: 'सदा केवल एक दशा पद्धति का उपयोग' },
      { en: 'If 3 dashas agree, the event is certain', hi: 'यदि 3 दशाएँ सहमत हों, तो घटना निश्चित है' },
      { en: 'Only planetary transits matter', hi: 'केवल ग्रह गोचर महत्त्वपूर्ण हैं' },
      { en: 'Birth time rectification eliminates the need for multiple systems', hi: 'जन्म समय शोधन से बहु-पद्धति की आवश्यकता समाप्त हो जाती है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"If 3 dashas agree, the event is certain" — this is the principle of convergent validation. When Vimshottari, Yogini, and Char Dasha all point to the same event in the same time window, the prediction carries very high confidence.',
      hi: '"यदि 3 दशाएँ सहमत हों, तो घटना निश्चित है" — यह अभिसारी प्रमाणीकरण का सिद्धान्त है। जब विंशोत्तरी, योगिनी और चर दशा सभी एक ही समय-खिड़की में एक ही घटना की ओर इंगित करें, तो भविष्यवाणी अत्यधिक विश्वसनीय होती है।',
    },
  },
  {
    id: 'q11_2_09', type: 'true_false',
    question: {
      en: 'In Char Dasha, the dasha duration for each sign is always the same (10 years per sign).',
      hi: 'चर दशा में प्रत्येक राशि की दशा अवधि सदा समान (10 वर्ष प्रति राशि) होती है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. In Char Dasha, each sign gets a variable duration (1 to 12 years) based on its lord\'s distance from the sign. The calculation involves counting signs from the sign to its lord, applying certain rules for odd and even signs. This makes each chart\'s Char Dasha sequence unique.',
      hi: 'असत्य। चर दशा में प्रत्येक राशि को उसके स्वामी की राशि से दूरी के आधार पर परिवर्तनशील अवधि (1 से 12 वर्ष) मिलती है। गणना में राशि से उसके स्वामी तक राशि गिनना शामिल है, विषम और सम राशियों के लिए विशेष नियम लगाकर। यह प्रत्येक कुण्डली का चर दशा क्रम अद्वितीय बनाता है।',
    },
  },
  {
    id: 'q11_2_10', type: 'mcq',
    question: {
      en: 'Char Dasha is most useful for which type of analysis?',
      hi: 'चर दशा किस प्रकार के विश्लेषण के लिए सर्वाधिक उपयोगी है?',
    },
    options: [
      { en: 'Personality assessment', hi: 'व्यक्तित्व आकलन' },
      { en: 'Event-based prediction and timing', hi: 'घटना-आधारित भविष्यवाणी और समय-निर्धारण' },
      { en: 'Gemstone recommendation', hi: 'रत्न संस्तुति' },
      { en: 'Naming ceremony', hi: 'नामकरण संस्कार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Char Dasha excels at event-based analysis because it activates signs (houses), not individual planets. When a particular sign\'s dasha runs, ALL planets in that sign and the houses it represents become active simultaneously, making it easier to pinpoint concrete life events.',
      hi: 'चर दशा घटना-आधारित विश्लेषण में उत्कृष्ट है क्योंकि यह राशियों (भावों) को सक्रिय करती है, व्यक्तिगत ग्रहों को नहीं। जब किसी विशेष राशि की दशा चलती है, उस राशि के सभी ग्रह और वह जिन भावों का प्रतिनिधित्व करती है, एक साथ सक्रिय हो जाते हैं, जिससे ठोस जीवन घटनाओं का निर्धारण सरल हो जाता है।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'योगिनी दशा — 36 वर्षीय चक्र' : 'Yogini Dasha — The 36-Year Cycle'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जहाँ विंशोत्तरी पाराशरी ज्योतिष की प्राथमिक दशा पद्धति है, वहीं योगिनी दशा नाटकीय रूप से छोटे चक्र वाला एक शक्तिशाली पूरक उपकरण है। आठ योगिनियाँ — ब्रह्माण्डीय स्त्री शक्तियाँ — 36 वर्ष का काल विभाजित करती हैं: मंगला (1 वर्ष, चन्द्र), पिंगला (2 वर्ष, सूर्य), धन्या (3 वर्ष, गुरु), भ्रामरी (4 वर्ष, मंगल), भद्रिका (5 वर्ष, बुध), उल्का (6 वर्ष, शनि), सिद्धा (7 वर्ष, शुक्र), और संकटा (8 वर्ष, राहु)। योग: 1+2+3+4+5+6+7+8 = 36 वर्ष।</> : <>While Vimshottari is the primary dasha system in Parashari Jyotish, the Yogini Dasha offers a powerful complementary tool with a dramatically shorter cycle. Eight Yoginis — cosmic feminine energies — divide a 36-year span: Mangala (1 year, Moon), Pingala (2 years, Sun), Dhanya (3 years, Jupiter), Bhramari (4 years, Mars), Bhadrika (5 years, Mercury), Ulka (6 years, Saturn), Siddha (7 years, Venus), and Sankata (8 years, Rahu). The total: 1+2+3+4+5+6+7+8 = 36 years.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विंशोत्तरी की भाँति, आरम्भिक योगिनी चन्द्रमा के जन्म नक्षत्र से निर्धारित होती है। सूत्र: नक्षत्र संख्या (अश्विनी=1, भरणी=2...) में 3 जोड़ें, 8 से भाग दें — शेषफल आरम्भिक योगिनी बताता है। चूँकि चक्र मात्र 36 वर्ष का है, यह जीवनकाल में 2-3 बार दोहराता है, विंशोत्तरी भविष्यवाणियों के सत्यापन हेतु एक भिन्न &quot;घड़ी&quot; प्रदान करता है। जहाँ विंशोत्तरी व्यापक कथा देती है, वहीं योगिनी शीघ्र, सटीक पुष्टि देती है।</> : <>Like Vimshottari, the starting Yogini is determined by the Moon&apos;s birth nakshatra. The formula: add the nakshatra number (Ashwini=1, Bharani=2...) to 3, divide by 8 — the remainder identifies the starting Yogini. Because the cycle is only 36 years, it repeats 2-3 times in a lifetime, providing a different &quot;clock&quot; against which to verify Vimshottari predictions. Where Vimshottari gives the broad narrative, Yogini gives quick, punchy confirmation.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'आठ योगिनियाँ — त्वरित सन्दर्भ' : 'The Eight Yoginis — Quick Reference'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Mangala</span> (1 yr, Moon) — Auspiciousness, new beginnings, emotional sensitivity.
          <span className="text-gold-light font-medium ml-2">Pingala</span> (2 yr, Sun) — Vitality, authority, father-related events.
          <span className="text-gold-light font-medium ml-2">Dhanya</span> (3 yr, Jupiter) — Prosperity, wisdom, expansion of fortune.
          <span className="text-gold-light font-medium ml-2">Bhramari</span> (4 yr, Mars) — Energy, conflicts, property, courage.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Bhadrika</span> (5 yr, Mercury) — Communication, trade, intelligence.
          <span className="text-gold-light font-medium ml-2">Ulka</span> (6 yr, Saturn) — Meteoric falls, hardship, karmic debts.
          <span className="text-gold-light font-medium ml-2">Siddha</span> (7 yr, Venus) — Accomplishment, relationships, luxury.
          <span className="text-gold-light font-medium ml-2">Sankata</span> (8 yr, Rahu) — Obstacles, obsession, unconventional paths.
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'चर दशा (जैमिनी) — राशि-आधारित समय-निर्धारण' : 'Char Dasha (Jaimini) — Sign-Based Timing'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>महर्षि जैमिनी ने समय-निर्धारण का पूर्णतया भिन्न दृष्टिकोण विकसित किया। ग्रहों को काल निर्दिष्ट करने के बजाय, चर दशा राशियों को काल निर्दिष्ट करती है। सभी 12 राशियों को दशा की बारी मिलती है, और प्रत्येक राशि के काल की अवधि राशि और उसके स्वामी के बीच की दूरी पर निर्भर करती है। विषम राशियों के लिए राशि से स्वामी तक आगे गिनें; सम राशियों के लिए पीछे गिनें। परिणामी संख्या (1-12) उस राशि के दशा वर्ष देती है। यह प्रत्येक कुण्डली के लिए एक अद्वितीय समय-रेखा बनाता है।</> : <>Maharishi Jaimini developed an entirely different approach to timing. Instead of assigning periods to planets, Char Dasha assigns periods to signs (rashis). All 12 signs get a dasha turn, and the duration of each sign&apos;s period depends on the distance between the sign and its lord. For odd signs, count forward from the sign to its lord; for even signs, count backward. The resulting number (1-12) gives the dasha years for that sign. This creates a unique timeline for every chart.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>जब किसी विशेष राशि की चर दशा चल रही हो, पूरी राशि सक्रिय होती है — उस राशि में बैठा प्रत्येक ग्रह, वह राशि जिन भावों का प्रतिनिधित्व करती है, और उससे जुड़ा प्रत्येक जैमिनी कारक। यह चर दशा को घटना भविष्यवाणी में विशेष रूप से शक्तिशाली बनाता है। जैमिनी चर कारक (परिवर्तनशील कारक) का उपयोग करते हैं जो ग्रह अंश से निर्धारित होते हैं: कुण्डली में सर्वोच्च अंश वाला ग्रह आत्मकारक (आत्मा) बनता है, अगला अमात्यकारक (कैरियर), फिर भ्रातृकारक (भाई-बहन), मातृकारक (माता), पुत्रकारक (सन्तान), ज्ञातिकारक (शत्रु/सम्बन्धी), और दारकारक (पति/पत्नी) — न्यूनतम अंश वाला ग्रह।</> : <>When a particular sign&apos;s Char Dasha is running, the entire sign activates — every planet sitting in that sign, every house that sign represents, and every Jaimini karaka connected to it. This makes Char Dasha especially powerful for event prediction. Jaimini uses Chara Karakas (variable significators) determined by planetary degree: the planet at the highest degree in the chart becomes Atmakaraka (soul), the next is Amatyakaraka (career), then Bhratrikaraka (siblings), Matrikaraka (mother), Putrakaraka (children), Gnatikaraka (enemies/relatives), and Darakaraka (spouse) — the planet at the lowest degree.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'राशि दृष्टि — जैमिनी दृष्टि' : 'Rashi Drishti — Jaimini Aspects'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>पराशर की ग्रह दृष्टि (जहाँ शनि 3, 7 और 10वें को देखता है) के विपरीत, जैमिनी राशि-आधारित दृष्टि प्रयोग करते हैं। नियम सुन्दर हैं: चर राशियाँ (मेष, कर्क, तुला, मकर) सभी स्थिर राशियों को देखती हैं सिवाय निकटवर्ती के। स्थिर राशियाँ (वृषभ, सिंह, वृश्चिक, कुम्भ) सभी चर राशियों को देखती हैं सिवाय निकटवर्ती के। द्विस्वभाव राशियाँ (मिथुन, कन्या, धनु, मीन) एक-दूसरे को देखती हैं।</> : <>Unlike Parashara&apos;s planetary aspects (where Saturn aspects the 3rd, 7th, and 10th), Jaimini uses sign-based aspects. The rules are elegant: Movable signs (Aries, Cancer, Libra, Capricorn) aspect all Fixed signs except the one next to them. Fixed signs (Taurus, Leo, Scorpio, Aquarius) aspect all Movable signs except the one next to them. Dual signs (Gemini, Virgo, Sagittarius, Pisces) aspect each other.</>}</p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कौन-सी पद्धति कब प्रयोग करें' : 'When to Use Which System'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>तीन दशा पद्धतियाँ भिन्न उद्देश्यों की पूर्ति करती हैं और संयोजन में सर्वोत्तम कार्य करती हैं। विंशोत्तरी दशा सामान्य जीवन भविष्यवाणी की प्रधान पद्धति है — कैरियर प्रक्षेपवक्र, सम्बन्ध प्रतिरूप, स्वास्थ्य प्रवृत्तियाँ और पूर्ण जीवनकाल में आध्यात्मिक विकास। यह &quot;यह कैसा काल है?&quot; का उत्तर देने में उत्कृष्ट है क्योंकि ग्रह विषय शास्त्रीय साहित्य में समृद्ध रूप से वर्णित हैं। सभी कुण्डली पठन के लिए विंशोत्तरी को प्राथमिक भविष्यवाणी उपकरण के रूप में प्रयोग करें।</> : <>The three dasha systems serve different purposes and work best in combination. Vimshottari Dasha is the master system for general life predictions — career trajectories, relationship patterns, health trends, and spiritual evolution over the full lifespan. It excels at answering &quot;what kind of period is this?&quot; because planetary themes are richly described in classical literature. Use Vimshottari as your primary predictive tool for all chart readings.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>योगिनी दशा शीघ्र पुष्टि का कार्य करती है। इसके 36-वर्षीय चक्र का अर्थ है काल छोटे और अधिक तत्काल हैं। जब विंशोत्तरी कहे &quot;शुक्र काल — अगले 2 वर्षों में विवाह सम्भव&quot; और योगिनी की सिद्धा (शुक्र) अवधि भी उसी खिड़की में आती है, तो विश्वास नाटकीय रूप से बढ़ जाता है। योगिनी उत्तर भारतीय परम्पराओं में विशेष रूप से महत्त्वपूर्ण है और कभी-कभी अपनी कसी हुई समय-सीमाओं के कारण अल्पकालिक भविष्यवाणियों के लिए अधिक सटीक मानी जाती है।</> : <>Yogini Dasha serves as quick confirmation. Its 36-year cycle means periods are shorter and more immediate. When Vimshottari says &quot;Venus period — marriage likely in the next 2 years&quot; and Yogini&apos;s Siddha (Venus) period also falls in the same window, confidence jumps dramatically. Yogini is particularly valued in North Indian traditions and is sometimes considered more accurate for short-term predictions due to its tighter time frames.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Char Dasha excels at event-based analysis — &quot;will this specific event happen?&quot; Because it activates entire signs (with all their occupants), it is powerful for pinpointing concrete happenings: marriage (7th sign dasha), career change (10th sign dasha), foreign travel (12th sign dasha). The principle of convergent validation states: &quot;If 3 dashas agree, the event is certain.&quot; When Vimshottari, Yogini, and Char Dasha all point to the same event in the same time window, the prediction carries the highest confidence.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;केवल विंशोत्तरी प्रामाणिक है; अन्य दशा पद्धतियाँ आधुनिक आविष्कार हैं।&quot; यह पूर्णतया असत्य है। जैमिनी सूत्र (महर्षि जैमिनी, व्यास के शिष्य को समर्पित) अनेक पाराशरी टीकाओं से पूर्ववर्ती हैं। योगिनी दशा मध्यकालीन भारत के तान्त्रिक साहित्य में प्रकट होती है और शाक्त परम्परा में इसकी गहरी जड़ें हैं। तीनों पद्धतियों का प्राचीन वंशक्रम है और ये परस्पर पूरक हैं, प्रतिस्पर्धी नहीं।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Only Vimshottari is authentic; other dasha systems are modern inventions.&quot; This is completely false. Jaimini Sutras (attributed to Maharishi Jaimini, a disciple of Vyasa) predate many Parashari commentaries. Yogini Dasha appears in Tantric literature from medieval India and has deep roots in the Shakta tradition. All three systems have ancient pedigrees and are mutually complementary, not competing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'व्यवहार में अभिसारी प्रमाणीकरण' : 'Convergent Validation in Practice'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">परिदृश्य:</span> एक जातक पूछता है &quot;मेरा विवाह कब होगा?&quot; आप जाँचते हैं: विंशोत्तरी गुरु महादशा में शुक्र अन्तर्दशा जून 2027 से दिखाती है। योगिनी सिद्धा (शुक्र) काल 2026-2033 चल रहा दिखाती है। चर दशा लग्न से 7वीं राशि 2027-2029 में सक्रिय दिखाती है। तीनों पद्धतियाँ 2027-2028 पर विवाह खिड़की के रूप में अभिसरित होती हैं। यह उच्च-विश्वास भविष्यवाणी है।</> : <><span className="text-gold-light font-medium">Scenario:</span> A client asks &quot;When will I get married?&quot; You check: Vimshottari shows Venus Antardasha in Jupiter Mahadasha starting June 2027. Yogini shows Siddha (Venus) period running 2026-2033. Char Dasha shows 7th sign from lagna getting activated in 2027-2029. All three systems converge on 2027-2028 as the marriage window. This is high-confidence prediction.</>}</p>
      </section>
    </div>
  );
}

export default function Module11_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

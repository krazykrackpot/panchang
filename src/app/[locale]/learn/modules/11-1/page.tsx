'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_1', phase: 3, topic: 'Dashas', moduleNumber: '11.1',
  title: { en: 'Vimshottari Dasha — The 120-Year Cycle', hi: 'विंशोत्तरी दशा — 120 वर्षीय चक्र' },
  subtitle: {
    en: 'Nine planets divide a 120-year lifespan into predictive time periods, starting from the birth nakshatra',
    hi: 'नौ ग्रह 120 वर्ष की आयु को भविष्यवाणी काल-खण्डों में विभक्त करते हैं, जन्म नक्षत्र से आरम्भ',
  },
  estimatedMinutes: 16,
  crossRefs: [
    { label: { en: 'Module 11-2: Yogini & Char Dasha', hi: 'मॉड्यूल 11-2: योगिनी एवं चर दशा' }, href: '/learn/modules/11-2' },
    { label: { en: 'Module 11-3: Dasha & Transit Overlay', hi: 'मॉड्यूल 11-3: दशा एवं गोचर आच्छादन' }, href: '/learn/modules/11-3' },
    { label: { en: 'Dashas Deep Dive', hi: 'दशा विस्तार' }, href: '/learn/dashas' },
    { label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q11_1_01', type: 'mcq',
    question: {
      en: 'What is the total duration of the Vimshottari Dasha cycle?',
      hi: 'विंशोत्तरी दशा चक्र की कुल अवधि कितनी है?',
    },
    options: [
      { en: '100 years', hi: '100 वर्ष' },
      { en: '108 years', hi: '108 वर्ष' },
      { en: '120 years', hi: '120 वर्ष' },
      { en: '360 years', hi: '360 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Vimshottari literally means "120" — the system allocates a total of 120 years across 9 planetary periods: Ketu(7) + Venus(20) + Sun(6) + Moon(10) + Mars(7) + Rahu(18) + Jupiter(16) + Saturn(19) + Mercury(17) = 120.',
      hi: 'विंशोत्तरी का शाब्दिक अर्थ "120" है — यह पद्धति 9 ग्रह काल-खण्डों में कुल 120 वर्ष आवण्टित करती है: केतु(7) + शुक्र(20) + सूर्य(6) + चन्द्र(10) + मंगल(7) + राहु(18) + गुरु(16) + शनि(19) + बुध(17) = 120।',
    },
  },
  {
    id: 'q11_1_02', type: 'mcq',
    question: {
      en: 'Which planet has the longest Mahadasha period in Vimshottari?',
      hi: 'विंशोत्तरी में किस ग्रह की महादशा सबसे लम्बी है?',
    },
    options: [
      { en: 'Jupiter — 16 years', hi: 'गुरु — 16 वर्ष' },
      { en: 'Saturn — 19 years', hi: 'शनि — 19 वर्ष' },
      { en: 'Venus — 20 years', hi: 'शुक्र — 20 वर्ष' },
      { en: 'Rahu — 18 years', hi: 'राहु — 18 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Venus (Shukra) rules the longest Mahadasha at 20 years. This makes sense — Venus governs marriage, comforts, and material life, which form a large portion of one\'s earthly experience.',
      hi: 'शुक्र 20 वर्ष की सबसे लम्बी महादशा का स्वामी है। यह तर्कसंगत है — शुक्र विवाह, सुख-सुविधाओं और भौतिक जीवन का कारक है, जो सांसारिक अनुभव का बड़ा भाग है।',
    },
  },
  {
    id: 'q11_1_03', type: 'true_false',
    question: {
      en: 'The starting Mahadasha planet is determined by the Sun\'s nakshatra at birth.',
      hi: 'आरम्भिक महादशा ग्रह जन्म के समय सूर्य के नक्षत्र से निर्धारित होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The starting planet is determined by the Moon\'s nakshatra at birth, not the Sun\'s. Each of the 27 nakshatras is assigned a planetary ruler in the Vimshottari scheme, and the Moon\'s nakshatra at birth determines which planet\'s dasha is running at the time of birth.',
      hi: 'असत्य। आरम्भिक ग्रह जन्म के समय चन्द्रमा के नक्षत्र से निर्धारित होता है, सूर्य के नहीं। 27 नक्षत्रों में से प्रत्येक को विंशोत्तरी योजना में एक ग्रह स्वामी निर्दिष्ट है, और जन्म के समय चन्द्रमा का नक्षत्र बताता है कि कौन-से ग्रह की दशा जन्म पर चल रही है।',
    },
  },
  {
    id: 'q11_1_04', type: 'mcq',
    question: {
      en: 'A person born with Moon in Rohini nakshatra starts with which Mahadasha?',
      hi: 'रोहिणी नक्षत्र में चन्द्रमा वाले व्यक्ति की पहली महादशा कौन-सी है?',
    },
    options: [
      { en: 'Venus (Rohini is ruled by Moon)', hi: 'शुक्र (रोहिणी चन्द्रमा शासित है)' },
      { en: 'Moon (Rohini is ruled by Moon)', hi: 'चन्द्रमा (रोहिणी चन्द्रमा शासित है)' },
      { en: 'Mars (Rohini is ruled by Mars)', hi: 'मंगल (रोहिणी मंगल शासित है)' },
      { en: 'Sun (Rohini is ruled by Sun)', hi: 'सूर्य (रोहिणी सूर्य शासित है)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rohini is ruled by the Moon in the Vimshottari scheme. So a person born with Moon in Rohini starts with Moon Mahadasha (10 years). The balance of dasha at birth depends on how far the Moon has traversed within Rohini.',
      hi: 'विंशोत्तरी योजना में रोहिणी का स्वामी चन्द्रमा है। अतः रोहिणी में चन्द्रमा वाले व्यक्ति की चन्द्र महादशा (10 वर्ष) से शुरुआत होती है। जन्म पर दशा का शेष इस पर निर्भर करता है कि चन्द्रमा रोहिणी में कितना आगे बढ़ चुका है।',
    },
  },
  {
    id: 'q11_1_05', type: 'mcq',
    question: {
      en: 'What is the correct Vimshottari sequence starting from Ketu?',
      hi: 'केतु से आरम्भ होने वाला सही विंशोत्तरी क्रम क्या है?',
    },
    options: [
      { en: 'Ketu, Sun, Moon, Mars, Venus, Rahu, Jupiter, Saturn, Mercury', hi: 'केतु, सूर्य, चन्द्र, मंगल, शुक्र, राहु, गुरु, शनि, बुध' },
      { en: 'Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury', hi: 'केतु, शुक्र, सूर्य, चन्द्र, मंगल, राहु, गुरु, शनि, बुध' },
      { en: 'Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu', hi: 'सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि, राहु, केतु' },
      { en: 'Ketu, Venus, Sun, Moon, Mars, Rahu, Saturn, Jupiter, Mercury', hi: 'केतु, शुक्र, सूर्य, चन्द्र, मंगल, राहु, शनि, गुरु, बुध' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The correct Vimshottari sequence is: Ketu(7) → Venus(20) → Sun(6) → Moon(10) → Mars(7) → Rahu(18) → Jupiter(16) → Saturn(19) → Mercury(17). This sequence is derived from the nakshatra lordship pattern starting from Ashwini (Ketu).',
      hi: 'सही विंशोत्तरी क्रम है: केतु(7) → शुक्र(20) → सूर्य(6) → चन्द्र(10) → मंगल(7) → राहु(18) → गुरु(16) → शनि(19) → बुध(17)। यह क्रम अश्विनी (केतु) से आरम्भ नक्षत्र स्वामित्व क्रम से व्युत्पन्न है।',
    },
  },
  {
    id: 'q11_1_06', type: 'true_false',
    question: {
      en: 'An Antardasha is a sub-period within a Mahadasha, and a Pratyantardasha is a sub-sub-period within an Antardasha.',
      hi: 'अन्तर्दशा महादशा के भीतर एक उप-काल है, और प्रत्यन्तर्दशा अन्तर्दशा के भीतर एक उप-उप-काल है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The three-level hierarchy is: Mahadasha (major period) → Antardasha (sub-period) → Pratyantardasha (sub-sub-period). Each level subdivides the parent period in the same Vimshottari ratio, creating increasingly specific time windows for prediction.',
      hi: 'सत्य। तीन-स्तरीय पदानुक्रम है: महादशा (प्रमुख काल) → अन्तर्दशा (उप-काल) → प्रत्यन्तर्दशा (उप-उप-काल)। प्रत्येक स्तर मूल काल को उसी विंशोत्तरी अनुपात में विभक्त करता है, भविष्यवाणी के लिए उत्तरोत्तर सटीक समय-खिड़कियाँ बनाता है।',
    },
  },
  {
    id: 'q11_1_07', type: 'mcq',
    question: {
      en: 'During Mars Mahadasha / Jupiter Antardasha, what is the interpretive approach?',
      hi: 'मंगल महादशा / गुरु अन्तर्दशा में व्याख्या का दृष्टिकोण क्या है?',
    },
    options: [
      { en: 'Only Jupiter\'s significations matter', hi: 'केवल गुरु के कारकत्व महत्त्वपूर्ण हैं' },
      { en: 'Only Mars\' significations matter', hi: 'केवल मंगल के कारकत्व महत्त्वपूर्ण हैं' },
      { en: 'Mars themes dominate, Jupiter adds its coloring', hi: 'मंगल के विषय प्रधान हैं, गुरु अपना रंग जोड़ता है' },
      { en: 'Average the two planets\' effects equally', hi: 'दोनों ग्रहों के प्रभावों का समान औसत लें' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Mahadasha lord sets the dominant theme — Mars brings energy, courage, conflicts, property matters. The Antardasha lord (Jupiter) modifies and colors that theme — adding wisdom, expansion, or spiritual growth to Mars\' assertive energy. The Mahadasha is the canvas; the Antardasha is the brushstroke.',
      hi: 'महादशा स्वामी प्रधान विषय निर्धारित करता है — मंगल ऊर्जा, साहस, संघर्ष, सम्पत्ति मामले लाता है। अन्तर्दशा स्वामी (गुरु) उस विषय को रूपान्तरित करता है — मंगल की आक्रामक ऊर्जा में ज्ञान, विस्तार या आध्यात्मिक वृद्धि जोड़ता है। महादशा कैनवास है; अन्तर्दशा तूलिका है।',
    },
  },
  {
    id: 'q11_1_08', type: 'mcq',
    question: {
      en: 'For marriage timing, which dasha periods are most commonly examined?',
      hi: 'विवाह समय निर्धारण के लिए कौन-से दशा काल सबसे अधिक परीक्षित होते हैं?',
    },
    options: [
      { en: 'Sun or Mars dasha', hi: 'सूर्य या मंगल दशा' },
      { en: 'Venus dasha or 7th lord dasha', hi: 'शुक्र दशा या सप्तमेश दशा' },
      { en: 'Saturn or Ketu dasha', hi: 'शनि या केतु दशा' },
      { en: 'Rahu dasha exclusively', hi: 'केवल राहु दशा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus is the natural significator (naisargika karaka) of marriage, and the 7th house lord governs partnerships. When either of these planets runs as Mahadasha or Antardasha lord, marriage becomes most likely — provided transit support also exists.',
      hi: 'शुक्र विवाह का नैसर्गिक कारक है, और सप्तम भाव का स्वामी साझेदारी का शासक है। जब इनमें से कोई ग्रह महादशा या अन्तर्दशा स्वामी के रूप में चल रहा हो, विवाह की सम्भावना सर्वाधिक होती है — बशर्ते गोचर का समर्थन भी हो।',
    },
  },
  {
    id: 'q11_1_09', type: 'true_false',
    question: {
      en: 'The "balance of dasha" at birth is calculated based on how far the Moon has traversed within its birth nakshatra.',
      hi: '"जन्म पर दशा शेष" की गणना इस आधार पर होती है कि चन्द्रमा ने अपने जन्म नक्षत्र में कितनी दूरी तय की है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. If the Moon is at the very beginning of a nakshatra, nearly the full Mahadasha period remains. If the Moon is near the end, only a small fraction remains. The proportion of the nakshatra traversed determines the elapsed portion of the starting dasha.',
      hi: 'सत्य। यदि चन्द्रमा नक्षत्र के बिल्कुल आरम्भ में है, तो लगभग पूरी महादशा अवधि शेष रहती है। यदि चन्द्रमा अन्त के निकट है, तो केवल एक छोटा अंश शेष रहता है। नक्षत्र में तय किया गया अनुपात आरम्भिक दशा का व्यतीत भाग निर्धारित करता है।',
    },
  },
  {
    id: 'q11_1_10', type: 'mcq',
    question: {
      en: 'Which life area would you primarily examine during a 6th/8th lord Mahadasha?',
      hi: 'षष्ठेश/अष्टमेश की महादशा में आप मुख्य रूप से किस जीवन क्षेत्र की परीक्षा करेंगे?',
    },
    options: [
      { en: 'Wealth and luxury', hi: 'धन और विलासिता' },
      { en: 'Health issues, debts, and transformative crises', hi: 'स्वास्थ्य समस्याएँ, ऋण और रूपान्तरकारी संकट' },
      { en: 'Romantic relationships', hi: 'प्रेम सम्बन्ध' },
      { en: 'Higher education abroad', hi: 'विदेश में उच्च शिक्षा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 6th house governs enemies, debts, and disease. The 8th house governs sudden events, chronic illness, and transformation. When lords of these houses run as Mahadasha, the native often faces health challenges, debts, or life-altering crises — though the 8th can also bring inheritance and occult knowledge.',
      hi: 'षष्ठ भाव शत्रु, ऋण और रोग का शासक है। अष्टम भाव अकस्मात घटनाओं, दीर्घकालिक रोग और रूपान्तरण का शासक है। जब इन भावों के स्वामी महादशा में चलते हैं, जातक को प्रायः स्वास्थ्य चुनौतियाँ, ऋण या जीवन बदलने वाले संकट आते हैं — यद्यपि अष्टम से विरासत और गूढ़ ज्ञान भी मिल सकता है।',
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
          {isHi ? 'दशा क्या है?' : 'What Is a Dasha?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में दशा एक ग्रह काल-खण्ड है — जीवन का वह कालावधि जिसमें एक ग्रह जातक के अनुभव पर प्रभुत्व रखता है। जहाँ गोचर बताता है कि ग्रह अभी कहाँ हैं, दशा बताती है कि आपके लिए किसी भी समय कौन-सा ग्रह &quot;सक्रिय&quot; है। समान कुण्डली किन्तु भिन्न जन्म नक्षत्र वाले दो व्यक्ति समान ग्रहों को पूर्णतया भिन्न क्रम में अनुभव करेंगे, इसलिए समय-आधारित भविष्यवाणी के लिए दशा विश्लेषण सर्वोपरि है।</> : <>In Vedic astrology, a dasha is a planetary time period — a stretch of life during which one planet dominates the native&apos;s experience. While transits (gochar) show where planets are NOW, dashas reveal which planet is &quot;switched on&quot; for YOU at any given time. Two people with identical charts but different birth nakshatras will experience the same planets in completely different sequences, which is why timing predictions require dasha analysis above all else.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विंशोत्तरी पद्धति पाराशरी ज्योतिष में सर्वाधिक प्रयुक्त दशा प्रणाली है। &quot;विंशोत्तरी&quot; का अर्थ 120 है, जो वर्षों में कुल चक्र लम्बाई दर्शाता है। नौ ग्रहों में से प्रत्येक को निश्चित वर्ष आवण्टित हैं: केतु (7), शुक्र (20), सूर्य (6), चन्द्र (10), मंगल (7), राहु (18), गुरु (16), शनि (19), बुध (17)। इनका योग ठीक 120 वर्ष है। क्रम सदा इसी निश्चित अनुक्रम में चलता है और दोहराता है — बुध समाप्त होने के बाद पुनः केतु आरम्भ होता है।</> : <>The Vimshottari system is the most widely used dasha system in Parashari Jyotish. &quot;Vimshottari&quot; means 120, representing the total cycle length in years. Nine planets are each assigned a fixed number of years: Ketu (7), Venus (20), Sun (6), Moon (10), Mars (7), Rahu (18), Jupiter (16), Saturn (19), Mercury (17). These add up to exactly 120 years. The sequence always runs in this fixed order and repeats — after Mercury ends, Ketu begins again.</>}</p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आरम्भिक दशा कैसे निर्धारित होती है' : 'How Your Starting Dasha Is Determined'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>आपका जन्म नक्षत्र — जन्म के ठीक क्षण में चन्द्रमा जिस नक्षत्र में स्थित है — निर्धारित करता है कि जन्म पर कौन-से ग्रह की महादशा चल रही है। 27 नक्षत्र 3-3 के 9 समूहों में विभक्त हैं, प्रत्येक समूह विंशोत्तरी क्रम में एक ग्रह को निर्दिष्ट है। अश्विनी, मघा और मूल केतु शासित हैं। भरणी, पूर्वा फाल्गुनी और पूर्वाषाढ़ा शुक्र शासित। कृत्तिका, उत्तरा फाल्गुनी और उत्तराषाढ़ा सूर्य शासित। इसी प्रकार सभी 9 ग्रहों तक।</> : <>Your birth nakshatra — the nakshatra occupied by the Moon at the exact moment of birth — determines which planet&apos;s Mahadasha is running when you are born. The 27 nakshatras are divided into 9 groups of 3, each group assigned to one planet in the Vimshottari sequence. Ashwini, Magha, and Mula are ruled by Ketu. Bharani, Purva Phalguni, and Purva Ashadha by Venus. Krittika, Uttara Phalguni, and Uttara Ashadha by Sun. And so on through all 9 planets.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The &quot;balance of dasha&quot; at birth is crucial. If the Moon is at the very start of Rohini (Moon-ruled), you get nearly the full 10-year Moon dasha. If the Moon is at the end of Rohini, perhaps only 6 months of Moon dasha remain, and Mars dasha begins soon. This balance is computed by the proportion of the nakshatra already traversed: (remaining nakshatra degrees / 13°20&apos;) multiplied by the total dasha years of that planet.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय आधार' : 'Classical Foundation'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>विंशोत्तरी पद्धति BPHS (बृहत् पराशर होराशास्त्र, अध्याय 46) में पराशर द्वारा कलियुग की प्राथमिक दशा के रूप में निर्दिष्ट है। पराशर 40 से अधिक दशा पद्धतियों का वर्णन करते हैं, किन्तु सामान्य उपयोग के लिए विशेष रूप से विंशोत्तरी की संस्तुति करते हैं। 120 वर्ष की अवधि वैदिक परम्परा में आदर्श मानव आयु मानी जाती है। नक्षत्र-से-ग्रह मानचित्रण उसी प्रतिरूप का अनुसरण करता है जो नवतारा (9-तारा) पद्धति में प्रयुक्त है, नक्षत्रों, ग्रहों और जीवन-समय को एक एकीकृत ढाँचे में जोड़ता है।</> : <>The Vimshottari system is prescribed by Parashara in BPHS (Brihat Parashara Hora Shastra, Chapter 46) as the primary dasha for Kali Yuga. Parashara describes over 40 dasha systems, but specifically recommends Vimshottari for general use. The 120-year span is considered the ideal human lifespan in Vedic tradition. The nakshatra-to-planet mapping follows the same pattern used in the Navatara (9-star) system, connecting nakshatras, planets, and life timing into one unified framework.</>}</p>
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
          {isHi ? 'तीन स्तर: महादशा, अन्तर्दशा, प्रत्यन्तर्दशा' : 'Three Levels: Mahadasha, Antardasha, Pratyantardasha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>विंशोत्तरी पद्धति की प्रतिभा इसके पुनरावर्ती उपविभाजन में है। महादशा (प्रमुख काल) व्यापक विषय निर्धारित करती है — यदि आप शुक्र महादशा (20 वर्ष) में हैं, तो सम्बन्धों, विलासिता, कला और सुख-सुविधा के शुक्र-विषय उस युग को परिभाषित करते हैं। उन 20 वर्षों के भीतर, नौ अन्तर्दशाएँ क्रमशः चलती हैं, प्रत्येक का स्वामी महादशा स्वामी से आरम्भ मानक विंशोत्तरी क्रम में नौ ग्रहों में से एक है। अतः शुक्र महादशा शुक्र-शुक्र अन्तर्दशा से आरम्भ होती है, फिर शुक्र-सूर्य, शुक्र-चन्द्र, इत्यादि।</> : <>The genius of the Vimshottari system lies in its recursive subdivision. The Mahadasha (major period) sets the broad theme — if you are in Venus Mahadasha (20 years), Venusian themes of relationships, luxury, art, and comfort define the era. Within those 20 years, nine Antardashas (sub-periods) run in sequence, each ruled by one of the nine planets in the standard Vimshottari order starting from the Mahadasha lord itself. So Venus Mahadasha begins with Venus-Venus Antardasha, then Venus-Sun, Venus-Moon, and so on.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>प्रत्येक अन्तर्दशा को उसी अनुपात से नौ प्रत्यन्तर्दशाओं (उप-उप-काल) में पुनः विभक्त किया जाता है। प्रत्येक उप-काल की अवधि अनुपातिक है: अन्तर्दशा की लम्बाई = (अन्तर्दशा ग्रह के वर्ष / 120) गुणा महादशा अवधि। उदाहरणार्थ, मंगल महादशा (7 वर्ष) के भीतर गुरु अन्तर्दशा (16/120) x 7 = 0.933 वर्ष अर्थात् लगभग 11 मास 6 दिन चलती है।</> : <>Each Antardasha is further divided into nine Pratyantardashas (sub-sub-periods) using the same ratio. The duration of each sub-period is proportional: an Antardasha&apos;s length equals (Antardasha planet&apos;s years / 120) multiplied by the Mahadasha duration. For example, within Mars Mahadasha (7 years), Jupiter Antardasha lasts (16/120) x 7 = 0.933 years, roughly 11 months and 6 days.</>}</p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'संयुक्त ग्रह ऊर्जाओं की व्याख्या' : 'Interpreting Combined Planetary Energies'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>व्याख्या की कुंजी स्तर-क्रम है। महादशा स्वामी प्रधान वातावरण प्रदान करता है। अन्तर्दशा स्वामी उस वातावरण में एक विशिष्ट प्रसंग लाता है। मंगल महादशा / गुरु अन्तर्दशा पर विचार करें: मंगल साहस, सम्पत्ति, भाई-बहन, संघर्ष और शल्यक्रिया का शासक है। गुरु ज्ञान, विस्तार, शिक्षण और धर्म जोड़ता है। परिणाम? यह साहसिक शैक्षिक उद्यमों, धार्मिक माध्यमों से सम्पत्ति विस्तार, या साहसिक आध्यात्मिक अन्वेषण का काल हो सकता है। यदि मंगल कुण्डली में दुर्बल स्थित है, तो गुरु अन्तर्दशा ज्ञान से संघर्ष को शमित कर सकती है।</> : <>The interpretive key is layering. The Mahadasha lord provides the dominant environment. The Antardasha lord brings a specific episode within that environment. Consider Mars Mahadasha / Jupiter Antardasha: Mars governs courage, property, siblings, conflict, and surgery. Jupiter adds wisdom, expansion, teaching, and dharma. The result? This could be a period of bold educational pursuits, property expansion through righteous means, or courageous spiritual quests. If Mars is poorly placed in the chart, the Jupiter Antardasha might mitigate conflict with wisdom.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> 15 मार्च 1990 को चन्द्रमा वृषभ 18°40&apos; (रोहिणी नक्षत्र, चन्द्र शासित) पर जन्मा व्यक्ति। रोहिणी वृषभ 10°00&apos; से 23°20&apos; तक फैला है। चन्द्रमा 18°40&apos; पर है, अतः 13°20&apos; में से 8°40&apos; = 65% नक्षत्र पार कर चुका है। अर्थात् चन्द्र दशा (10 वर्ष) का 65% = 6.5 वर्ष व्यतीत। जन्म पर शेष: चन्द्र दशा के 3.5 वर्ष। फिर क्रम: मंगल (लगभग 3.5 वर्ष की आयु से 7 वर्ष), राहु (लगभग 10.5 वर्ष से 18 वर्ष), गुरु (लगभग 28.5 वर्ष से 16 वर्ष), शनि (लगभग 44.5 वर्ष से 19 वर्ष), इत्यादि।</> : <><span className="text-gold-light font-medium">Example:</span> A person born on 15 March 1990 with Moon at 18°40&apos; Taurus (Rohini nakshatra, Moon-ruled). Rohini spans 10°00&apos; to 23°20&apos; Taurus. Moon is at 18°40&apos;, so it has traversed 8°40&apos; of 13°20&apos; = 65% of the nakshatra. This means 65% of Moon dasha (10 years) is elapsed: 6.5 years already gone. Balance at birth: 3.5 years of Moon dasha remain. The sequence then proceeds: Mars (7 years from ~age 3.5), Rahu (18 years from ~age 10.5), Jupiter (16 years from ~age 28.5), Saturn (19 years from ~age 44.5), and so on.</>}</p>
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
          {isHi ? 'व्यावहारिक समय-निर्धारण: दशाओं से जीवन घटनाएँ' : 'Practical Timing: Life Events Through Dashas'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दशा विश्लेषण का मूल वादा समय-निर्धारण है। प्रत्येक प्रमुख जीवन घटना विशिष्ट ग्रह काल-खण्डों से सम्बद्ध है। विवाह सामान्यतः शुक्र महादशा/अन्तर्दशा या सप्तमेश की दशा में होता है। कैरियर में सफलता सूर्य (अधिकार), दशमेश (कर्म भाव), या गुरु (विस्तार) की दशाओं में आती है। स्वास्थ्य संकट षष्ठेश (रोग) या अष्टमेश (दीर्घकालिक रोग/रूपान्तरण) के कालों से सम्बन्धित हैं। सन्तान गुरु (नैसर्गिक पुत्र कारक) या पंचमेश की दशाओं में इंगित होती है। आध्यात्मिक रूपान्तरण केतु दशा में चरम पर होता है, विशेषतः केतु-केतु में।</> : <>The core promise of dasha analysis is timing. Each major life event correlates with specific planetary periods. Marriage typically occurs during Venus Mahadasha/Antardasha or during the dasha of the 7th house lord. Career breakthroughs happen under Sun (authority), 10th lord (career house), or Jupiter (expansion) dashas. Health crises correlate with 6th lord (disease) or 8th lord (chronic illness/transformation) periods. Children are indicated by Jupiter (natural putra karaka) or 5th lord dashas. Spiritual transformation peaks during Ketu dasha, especially Ketu-Ketu.</>}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>महत्त्वपूर्ण सिद्धान्त: एक ग्रह केवल वही फल दे सकता है जो वह जन्म कुण्डली में वचन देता है। यदि शुक्र सप्तमेश है और शुभ स्थित है, तो शुक्र दशा सुखी विवाह लाती है। यदि शुक्र षष्ठेश है और पीड़ित है, तो शुक्र दशा सम्बन्ध संघर्ष या स्वास्थ्य समस्याएँ ला सकती है। दशा जन्मकालीन वचन को सक्रिय करती है — शून्य से परिणाम नहीं रचती। इसलिए शुक्र दशा चलाने वाले दो व्यक्तियों के अनुभव पूर्णतया भिन्न हो सकते हैं।</> : <>The critical principle: a planet can only give results that it promises in the birth chart. If Venus is the 7th lord and well-placed, Venus dasha brings a happy marriage. If Venus is the 6th lord and afflicted, Venus dasha may bring relationship conflicts or health issues instead. The dasha activates the natal promise — it does not create outcomes from nothing. This is why two people running Venus dasha can have vastly different experiences.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;शनि दशा सदा बुरी और शुक्र दशा सदा अच्छी होती है।&quot; यह असत्य है। वृषभ या तुला लग्न के लिए शनि दशा उत्कृष्ट हो सकती है — शनि शुभ भावों (वृषभ के लिए 9/10, तुला के लिए 4/5) का स्वामी है। इसके विपरीत, वृश्चिक लग्न के लिए शुक्र दशा (जहाँ शुक्र 7वें और 12वें का स्वामी है) सम्बन्धों के साथ हानि भी ला सकती है। सदा ग्रह का भावेशत्व, स्थिति और बल देखें — कभी केवल नाम से न आँकें।</> : <><span className="text-gold-light font-medium">Misconception:</span> &quot;Saturn dasha is always bad and Venus dasha is always good.&quot; This is false. Saturn dasha for a Taurus or Libra ascendant can be excellent — Saturn rules benefic houses (9th/10th for Taurus, 4th/5th for Libra). Conversely, Venus dasha for a Scorpio ascendant (where Venus rules 7th and 12th) can bring losses alongside relationships. Always judge the planet&apos;s house lordship, placement, and dignity — never by name alone.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारे ऐप में' : 'In Our App'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारा कुण्डली इंजन जन्म से 120 वर्षों तक की पूर्ण विंशोत्तरी दशा तालिका गणित करता है। यह चन्द्रमा का सटीक निरयन भोगांश गणित करता है, जन्म नक्षत्र पहचानता है, दशा शेष निर्धारित करता है, और सटीक आरम्भ-समाप्ति तिथियों सहित महादशा एवं अन्तर्दशा काल उत्पन्न करता है। टिप्पणी (व्याख्यात्मक भाष्य) खण्ड बताता है कि वर्तमान में कौन-सी दशा चल रही है और आपकी विशिष्ट कुण्डली के लिए उसके सक्रियण का क्या अर्थ है — भावेशत्व, स्थिति और नैसर्गिक कारकत्व का संयोजन करते हुए।</> : <>Our Kundali engine computes the complete Vimshottari dasha table from birth through 120 years. It calculates the Moon&apos;s exact sidereal longitude, identifies the birth nakshatra, determines the balance of dasha, and generates Mahadasha and Antardasha periods with precise start and end dates. The Tippanni (interpretive commentary) section explains which dasha is currently running and what its activation means for your specific chart — combining house lordship, placement, and natural signification.</>}</p>
      </section>
    </div>
  );
}

export default function Module11_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

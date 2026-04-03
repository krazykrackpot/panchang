'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_11_1', phase: 3, topic: 'Dashas', moduleNumber: '11.1',
  title: { en: 'Vimshottari Dasha — The 120-Year Cycle', hi: 'विंशोत्तरी दशा — 120 वर्षीय चक्र' },
  subtitle: {
    en: 'The master timing system of Vedic astrology: nine planets divide a 120-year lifespan into predictive periods, computed from a single data point — the Moon\'s nakshatra at birth',
    hi: 'वैदिक ज्योतिष की प्रमुख समय-निर्धारण प्रणाली: नौ ग्रह 120 वर्ष की आयु को भविष्यवाणी काल-खण्डों में विभक्त करते हैं, एकमात्र डेटा बिन्दु — जन्म नक्षत्र में चन्द्रमा — से गणित',
  },
  estimatedMinutes: 18,
  crossRefs: [
    { label: { en: 'Module 11-2: Yogini & Char Dasha', hi: 'मॉड्यूल 11-2: योगिनी एवं चर दशा' }, href: '/learn/modules/11-2' },
    { label: { en: 'Module 11-3: Dasha & Transit Overlay', hi: 'मॉड्यूल 11-3: दशा एवं गोचर आच्छादन' }, href: '/learn/modules/11-3' },
    { label: { en: 'Dashas Deep Dive', hi: 'दशा विस्तार' }, href: '/learn/dashas' },
    { label: { en: 'Interactive Dasha Lab', hi: 'इंटरैक्टिव दशा प्रयोगशाला' }, href: '/learn/labs/dasha' },
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
      en: 'Vimshottari literally means "120" — the system allocates a total of 120 years across 9 planetary periods: Ketu(7) + Venus(20) + Sun(6) + Moon(10) + Mars(7) + Rahu(18) + Jupiter(16) + Saturn(19) + Mercury(17) = 120. This equals the Vedic "Param Ayush" (maximum ideal human lifespan).',
      hi: 'विंशोत्तरी का शाब्दिक अर्थ "120" है — यह पद्धति 9 ग्रह काल-खण्डों में कुल 120 वर्ष आवण्टित करती है: केतु(7) + शुक्र(20) + सूर्य(6) + चन्द्र(10) + मंगल(7) + राहु(18) + गुरु(16) + शनि(19) + बुध(17) = 120। यह वैदिक "परम आयुष्" (आदर्श अधिकतम मानव आयु) के बराबर है।',
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
      en: 'Venus (Shukra) rules the longest Mahadasha at 20 years. This reflects Venus\'s dominion over marriage, comforts, and material life — which form the largest portion of one\'s earthly experience. The shortest period belongs to the Sun at just 6 years, reflecting how authority and leadership occupy a relatively brief window.',
      hi: 'शुक्र 20 वर्ष की सबसे लम्बी महादशा का स्वामी है। यह विवाह, सुख-सुविधाओं और भौतिक जीवन पर शुक्र के प्रभुत्व को दर्शाता है — जो सांसारिक अनुभव का सबसे बड़ा भाग है। सबसे छोटी अवधि सूर्य की मात्र 6 वर्ष है, जो दर्शाता है कि अधिकार और नेतृत्व अपेक्षाकृत संक्षिप्त काल में आते हैं।',
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
      en: 'False. The starting planet is determined by the MOON\'s nakshatra at birth, not the Sun\'s. The Moon\'s position in one of the 27 nakshatras determines the running Mahadasha lord, and the Moon\'s exact degree within that nakshatra determines the balance (remaining portion) of that dasha at birth.',
      hi: 'असत्य। आरम्भिक ग्रह जन्म के समय चन्द्रमा के नक्षत्र से निर्धारित होता है, सूर्य के नहीं। 27 नक्षत्रों में चन्द्रमा की स्थिति चल रही महादशा के स्वामी को निर्धारित करती है, और उस नक्षत्र में चन्द्रमा का सटीक अंश जन्म पर उस दशा का शेष (बचा हुआ भाग) निर्धारित करता है।',
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
      en: 'Rohini is ruled by the Moon in the Vimshottari scheme. So a person born with Moon in Rohini starts with Moon Mahadasha (10 years). The balance of dasha at birth depends on how far the Moon has traversed within Rohini. If Moon is at the very start, nearly 10 full years remain; if near the end, only months remain before Mars Mahadasha begins.',
      hi: 'विंशोत्तरी योजना में रोहिणी का स्वामी चन्द्रमा है। अतः रोहिणी में चन्द्रमा वाले व्यक्ति की चन्द्र महादशा (10 वर्ष) से शुरुआत होती है। जन्म पर दशा का शेष इस पर निर्भर करता है कि चन्द्रमा रोहिणी में कितना आगे बढ़ चुका है। यदि बिल्कुल आरम्भ में है तो लगभग 10 वर्ष शेष; अन्त के निकट है तो केवल कुछ मास शेष रहते हैं।',
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
      en: 'The correct Vimshottari sequence is: Ketu(7) -> Venus(20) -> Sun(6) -> Moon(10) -> Mars(7) -> Rahu(18) -> Jupiter(16) -> Saturn(19) -> Mercury(17). This sequence is derived from the nakshatra lordship pattern starting from Ashwini (Ketu). It cycles through the 27 nakshatras in groups of 3, each planet ruling exactly 3 nakshatras. After Mercury, the cycle restarts with Ketu.',
      hi: 'सही विंशोत्तरी क्रम है: केतु(7) -> शुक्र(20) -> सूर्य(6) -> चन्द्र(10) -> मंगल(7) -> राहु(18) -> गुरु(16) -> शनि(19) -> बुध(17)। यह क्रम अश्विनी (केतु) से आरम्भ नक्षत्र स्वामित्व प्रतिरूप से व्युत्पन्न है। यह 27 नक्षत्रों में 3-3 के समूहों में चलता है, प्रत्येक ग्रह ठीक 3 नक्षत्रों का स्वामी है। बुध के बाद चक्र केतु से पुनः आरम्भ होता है।',
    },
  },
  {
    id: 'q11_1_06', type: 'mcq',
    question: {
      en: 'In the Vimshottari subdivision hierarchy, how many unique Mahadasha-Antardasha combinations exist?',
      hi: 'विंशोत्तरी उपविभाजन पदानुक्रम में कुल कितने अद्वितीय महादशा-अन्तर्दशा संयोजन होते हैं?',
    },
    options: [
      { en: '27 (9 x 3)', hi: '27 (9 x 3)' },
      { en: '81 (9 x 9)', hi: '81 (9 x 9)' },
      { en: '108 (9 x 12)', hi: '108 (9 x 12)' },
      { en: '729 (9 x 9 x 9)', hi: '729 (9 x 9 x 9)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '9 Mahadasha lords x 9 Antardasha lords = 81 unique combinations. With Pratyantardasha (sub-sub), that becomes 729. With Sookshma Dasha, 6,561. This recursive subdivision creates timing resolution down to individual days — an unparalleled level of temporal granularity in any astrological system worldwide.',
      hi: '9 महादशा स्वामी x 9 अन्तर्दशा स्वामी = 81 अद्वितीय संयोजन। प्रत्यन्तर्दशा (उप-उप) के साथ यह 729 हो जाता है। सूक्ष्म दशा के साथ 6,561। यह पुनरावर्ती उपविभाजन व्यक्तिगत दिनों तक की समय सटीकता उत्पन्न करता है — विश्व की किसी भी ज्योतिष पद्धति में अद्वितीय।',
    },
  },
  {
    id: 'q11_1_07', type: 'mcq',
    question: {
      en: 'During Mars Mahadasha / Jupiter Antardasha, what is the correct interpretive approach?',
      hi: 'मंगल महादशा / गुरु अन्तर्दशा में सही व्याख्या दृष्टिकोण क्या है?',
    },
    options: [
      { en: 'Only Jupiter\'s significations matter', hi: 'केवल गुरु के कारकत्व महत्त्वपूर्ण हैं' },
      { en: 'Only Mars\' significations matter', hi: 'केवल मंगल के कारकत्व महत्त्वपूर्ण हैं' },
      { en: 'Mars themes dominate, Jupiter adds its coloring', hi: 'मंगल के विषय प्रधान हैं, गुरु अपना रंग जोड़ता है' },
      { en: 'Average the two planets\' effects equally', hi: 'दोनों ग्रहों के प्रभावों का समान औसत लें' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Mahadasha lord sets the dominant theme — Mars brings energy, courage, conflicts, property matters. The Antardasha lord (Jupiter) modifies and colors that theme — adding wisdom, expansion, or spiritual growth to Mars\' assertive energy. Think of it as: the Mahadasha is the canvas; the Antardasha is the brushstroke. Result: property expansion, educational achievements through effort, or bold spiritual pursuits.',
      hi: 'महादशा स्वामी प्रधान विषय निर्धारित करता है — मंगल ऊर्जा, साहस, संघर्ष, सम्पत्ति मामले लाता है। अन्तर्दशा स्वामी (गुरु) उस विषय को रूपान्तरित करता है — मंगल की आक्रामक ऊर्जा में ज्ञान, विस्तार या आध्यात्मिक वृद्धि जोड़ता है। इसे ऐसे समझें: महादशा कैनवास है; अन्तर्दशा तूलिका है। परिणाम: सम्पत्ति विस्तार, प्रयास से शैक्षिक उपलब्धियाँ, या साहसिक आध्यात्मिक अन्वेषण।',
    },
  },
  {
    id: 'q11_1_08', type: 'mcq',
    question: {
      en: 'What is "Dasha Sandhi" and when does it occur?',
      hi: '"दशा सन्धि" क्या है और कब होती है?',
    },
    options: [
      { en: 'The midpoint of any Mahadasha', hi: 'किसी महादशा का मध्य बिन्दु' },
      { en: 'The transition zone between two Mahadashas (last ~6 months of outgoing + first ~6 months of incoming)', hi: 'दो महादशाओं के बीच का संक्रमण क्षेत्र (जाती हुई के अन्तिम ~6 मास + आने वाली के प्रथम ~6 मास)' },
      { en: 'A special yoga formed during Rahu dasha', hi: 'राहु दशा में बनने वाला एक विशेष योग' },
      { en: 'The period when two Antardashas overlap', hi: 'वह काल जब दो अन्तर्दशाएँ ओवरलैप करती हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Dasha Sandhi is the turbulent transition zone between two Mahadashas — roughly the last 6 months of the outgoing dasha and the first 6 months of the incoming one. During this period, the native experiences uncertainty, identity shifts, and life restructuring. The greater the contrast between the two planets (e.g., Venus to Sun: luxury to authority), the more disruptive the transition.',
      hi: 'दशा सन्धि दो महादशाओं के बीच का अशान्त संक्रमण क्षेत्र है — जाती हुई दशा के अन्तिम लगभग 6 मास और आने वाली के प्रथम लगभग 6 मास। इस काल में जातक अनिश्चितता, पहचान परिवर्तन और जीवन पुनर्गठन अनुभव करता है। दोनों ग्रहों के बीच जितना अधिक अन्तर (जैसे शुक्र से सूर्य: विलासिता से अधिकार), संक्रमण उतना ही अधिक विघटनकारी।',
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
      en: 'True. Each nakshatra spans 13 degrees 20 minutes (13.333 degrees). The formula is: Remaining Dasha = Total Dasha Years x (1 - degrees traversed / 13.333). If Moon is at the start of a nakshatra, nearly the full period remains. If near the end, only a fraction remains. For example, Moon at 7.3 degrees into Hasta (Moon-ruled): fraction consumed = 7.3/13.333 = 54.75%, so remaining Moon dasha = 10 x (1 - 0.5475) = 4.525 years = 4 years, 6 months, 9 days.',
      hi: 'सत्य। प्रत्येक नक्षत्र 13 अंश 20 कला (13.333 अंश) का होता है। सूत्र: शेष दशा = कुल दशा वर्ष x (1 - तय किए अंश / 13.333)। यदि चन्द्रमा नक्षत्र के आरम्भ में है तो लगभग पूरी अवधि शेष। अन्त के निकट है तो केवल अंश शेष। उदाहरण: हस्त (चन्द्र-शासित) में 7.3 अंश पर चन्द्रमा: व्यतीत अंश = 7.3/13.333 = 54.75%, अतः शेष चन्द्र दशा = 10 x (1 - 0.5475) = 4.525 वर्ष = 4 वर्ष, 6 मास, 9 दिन।',
    },
  },
  {
    id: 'q11_1_10', type: 'mcq',
    question: {
      en: 'Saturn dasha for a Taurus (Vrishabha) ascendant is generally considered:',
      hi: 'वृषभ लग्न के लिए शनि दशा सामान्यतः मानी जाती है:',
    },
    options: [
      { en: 'Always terrible — Saturn is a malefic', hi: 'सदा भयावह — शनि पाप ग्रह है' },
      { en: 'Excellent — Saturn rules the 9th (luck) and 10th (career) houses as a Yogakaraka', hi: 'उत्कृष्ट — शनि योगकारक के रूप में 9वें (भाग्य) और 10वें (कर्म) भावों का स्वामी है' },
      { en: 'Neutral — Saturn has no special role for Taurus', hi: 'तटस्थ — वृषभ के लिए शनि की कोई विशेष भूमिका नहीं' },
      { en: 'Good only if Saturn is exalted', hi: 'केवल शनि उच्च हो तो अच्छी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'For Taurus ascendant, Saturn is a Yogakaraka — it rules BOTH a trine (9th house, Capricorn) and an angle (10th house, Aquarius). This makes Saturn dasha potentially the best period for Taurus natives, bringing career success, spiritual growth, foreign travel, and fortune. This disproves the common misconception that "Saturn dasha is always bad." Always judge by house lordship, not planetary name.',
      hi: 'वृषभ लग्न के लिए शनि योगकारक है — यह त्रिकोण (9वाँ भाव, मकर) और केन्द्र (10वाँ भाव, कुम्भ) दोनों का स्वामी है। इससे शनि दशा वृषभ जातकों के लिए सम्भवतः सर्वोत्तम काल बनती है — कैरियर सफलता, आध्यात्मिक वृद्धि, विदेश यात्रा और भाग्योदय। यह "शनि दशा सदा बुरी" की सामान्य भ्रान्ति को खण्डित करता है। सदा भावेशत्व से आँकें, ग्रह के नाम से नहीं।',
    },
  },
];

/* ───────────────────────── Page 1 ───────────────────────── */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* Opening Hook */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/20">
        <p className="text-gold-light text-sm leading-relaxed italic">
          {isHi
            ? '"कल्पना कीजिए कि आप पहले से जान सकें कि अगले 7, 10, या 20 वर्षों तक कौन-सा ग्रह आपके जीवन में प्रभावी शक्ति रहेगा। विंशोत्तरी दशा पद्धति आपको यही देती है — एकमात्र डेटा बिन्दु से गणित 120 वर्षीय ग्रह समयरेखा: जन्म के समय चन्द्रमा का नक्षत्र।"'
            : '"Imagine knowing in advance which planet will be the dominant force in your life for the next 7, 10, or even 20 years. That\'s what the Vimshottari Dasha system gives you — a 120-year planetary timeline computed from a single data point: the Moon\'s nakshatra at your birth."'}
        </p>
      </section>

      {/* What is Vimshottari? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'विंशोत्तरी क्या है?' : 'What Is Vimshottari?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वैदिक ज्योतिष में &quot;दशा&quot; एक ग्रह काल-खण्ड है — जीवन का वह कालावधि जिसमें एक ग्रह जातक के अनुभव पर प्रभुत्व रखता है। जहाँ गोचर (transits) बताता है कि ग्रह अभी कहाँ हैं, दशा बताती है कि आपके लिए किसी भी समय कौन-सा ग्रह &quot;सक्रिय&quot; है। विंशोत्तरी (&quot;विंशो&quot; = 20, &quot;उत्तरी&quot; = ऊपर/परे) = 120 वर्षों में फैली पद्धति। यह पाराशरी ज्योतिष की प्राथमिक समय-निर्धारण प्रणाली है — लगभग 95% वैदिक ज्योतिषी इसी का उपयोग करते हैं।</>
            : <>In Vedic astrology, a &quot;dasha&quot; is a planetary time period — a stretch of life during which one planet dominates the native&apos;s experience. While transits (gochar) show where planets are NOW, dashas reveal which planet is &quot;switched on&quot; for YOU at any given time. Vimshottari (&quot;Vimsho&quot; = 20, &quot;Uttari&quot; = above/beyond) = a system spanning 120 years (a mathematical multiple of 20 x 6). It is the PRIMARY timing system in Parashari Jyotish — used by approximately 95% of Vedic astrologers.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>समान कुण्डली किन्तु भिन्न जन्म नक्षत्र वाले दो व्यक्ति समान ग्रहों को पूर्णतया भिन्न क्रम में अनुभव करेंगे। इसलिए समय-आधारित भविष्यवाणी के लिए दशा विश्लेषण सर्वोपरि है। पश्चिमी ज्योतिषी कह सकता है &quot;आपका विवाह हो सकता है।&quot; दशा प्रयोग करने वाला वैदिक ज्योतिषी कह सकता है &quot;विवाह की सर्वाधिक सम्भावना शुक्र-गुरु काल में, अक्टूबर 2027 से फरवरी 2029 के बीच है।&quot; यह विशिष्टता पदानुक्रमिक उपविभाजन प्रणाली के कारण सम्भव है।</>
            : <>Two people with identical charts but different birth nakshatras will experience the same planets in completely different sequences. This is why timing predictions require dasha analysis above all else. A Western astrologer can say &quot;You might get married.&quot; A Vedic astrologer using dashas can say &quot;Marriage is most likely during Venus-Jupiter period, between October 2027 and February 2029.&quot; This specificity is possible because of the hierarchical subdivision system.</>}
        </p>
      </section>

      {/* The 9 Mahadasha Periods — Full Table */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'नौ महादशा काल' : 'The 9 Mahadasha Periods'}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'ग्रह' : 'Planet'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'संस्कृत' : 'Sanskrit'}</th>
                <th className="text-gold-light text-center py-2 px-2 font-semibold">{isHi ? 'वर्ष' : 'Years'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'नक्षत्र' : 'Nakshatras Ruled'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'प्रकृति' : 'Nature'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'जीवन विषय' : 'Life Themes'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Ketu</td>
                <td className="py-2 px-2">केतु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{isHi ? 'अश्विनी, मघा, मूल' : 'Ashwini, Magha, Mula'}</td>
                <td className="py-2 px-2">{isHi ? 'आध्यात्मिक विघटन' : 'Spiritual disruption'}</td>
                <td className="py-2 px-2">{isHi ? 'वैराग्य, पूर्व कर्म, अकस्मात परिवर्तन, आध्यात्मिक जागृति' : 'Detachment, past karma, sudden changes, spiritual awakening'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Venus</td>
                <td className="py-2 px-2">शुक्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">20</td>
                <td className="py-2 px-2">{isHi ? 'भरणी, पू.फा., पू.आषा.' : 'Bharani, P.Phalguni, P.Ashadha'}</td>
                <td className="py-2 px-2">{isHi ? 'भौतिक प्रचुरता' : 'Material abundance'}</td>
                <td className="py-2 px-2">{isHi ? 'विवाह, विलासिता, कला, सम्बन्ध, सुख-सुविधा' : 'Marriage, luxury, arts, relationships, comfort'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Sun</td>
                <td className="py-2 px-2">सूर्य</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">6</td>
                <td className="py-2 px-2">{isHi ? 'कृत्तिका, उ.फा., उ.आषा.' : 'Krittika, U.Phalguni, U.Ashadha'}</td>
                <td className="py-2 px-2">{isHi ? 'अधिकार' : 'Authority'}</td>
                <td className="py-2 px-2">{isHi ? 'कैरियर मान्यता, पिता, सरकार, नेतृत्व' : 'Career recognition, father, government, leadership'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Moon</td>
                <td className="py-2 px-2">चन्द्र</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">10</td>
                <td className="py-2 px-2">{isHi ? 'रोहिणी, हस्त, श्रवण' : 'Rohini, Hasta, Shravana'}</td>
                <td className="py-2 px-2">{isHi ? 'भावनात्मक' : 'Emotional'}</td>
                <td className="py-2 px-2">{isHi ? 'माता, भावनाएँ, यात्रा, लोक छवि, मन' : 'Mother, emotions, travel, public image, mind'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Mars</td>
                <td className="py-2 px-2">मंगल</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">7</td>
                <td className="py-2 px-2">{isHi ? 'मृगशिरा, चित्रा, धनिष्ठा' : 'Mrigashira, Chitra, Dhanishtha'}</td>
                <td className="py-2 px-2">{isHi ? 'क्रिया' : 'Action'}</td>
                <td className="py-2 px-2">{isHi ? 'सम्पत्ति, भाई-बहन, साहस, शल्यक्रिया, संघर्ष' : 'Property, siblings, courage, surgery, conflicts'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Rahu</td>
                <td className="py-2 px-2">राहु</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">18</td>
                <td className="py-2 px-2">{isHi ? 'आर्द्रा, स्वाती, शतभिषा' : 'Ardra, Swati, Shatabhisha'}</td>
                <td className="py-2 px-2">{isHi ? 'आसक्ति' : 'Obsession'}</td>
                <td className="py-2 px-2">{isHi ? 'विदेश सम्बन्ध, प्रौद्योगिकी, अपरम्परागत सफलता, इच्छा' : 'Foreign connections, technology, unconventional success, desire'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">Jupiter</td>
                <td className="py-2 px-2">बृहस्पति</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">16</td>
                <td className="py-2 px-2">{isHi ? 'पुनर्वसु, विशाखा, पू.भा.' : 'Punarvasu, Vishakha, P.Bhadrapada'}</td>
                <td className="py-2 px-2">{isHi ? 'विस्तार' : 'Expansion'}</td>
                <td className="py-2 px-2">{isHi ? 'सन्तान, शिक्षा, ज्ञान, धर्म, सम्पत्ति' : 'Children, education, wisdom, dharma, wealth'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">Saturn</td>
                <td className="py-2 px-2">शनि</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">19</td>
                <td className="py-2 px-2">{isHi ? 'पुष्य, अनुराधा, उ.भा.' : 'Pushya, Anuradha, U.Bhadrapada'}</td>
                <td className="py-2 px-2">{isHi ? 'अनुशासन' : 'Discipline'}</td>
                <td className="py-2 px-2">{isHi ? 'कैरियर परिश्रम, दीर्घकालिक समस्याएँ, संरचना, कर्म, उत्तरदायित्व' : 'Career grind, chronic issues, structure, karma, responsibility'}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">Mercury</td>
                <td className="py-2 px-2">बुध</td>
                <td className="py-2 px-2 text-center text-gold-dark font-bold">17</td>
                <td className="py-2 px-2">{isHi ? 'आश्लेषा, ज्येष्ठा, रेवती' : 'Ashlesha, Jyeshtha, Revati'}</td>
                <td className="py-2 px-2">{isHi ? 'बुद्धि' : 'Intelligence'}</td>
                <td className="py-2 px-2">{isHi ? 'व्यापार, संवाद, कौशल, विश्लेषण, अनुकूलनशीलता' : 'Business, communication, skills, analysis, adaptability'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Why These Specific Years? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ये विशिष्ट वर्ष क्यों?' : 'Why These Specific Years?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>वर्ष गणनाएँ मनमानी नहीं हैं — ये नक्षत्र स्वामियों की कक्षीय अवधियों और उनके अनुमानित &quot;प्रभाव बल&quot; पर आधारित गणितीय प्रतिरूप का अनुसरण करती हैं। कुल (7+20+6+10+7+18+16+19+17 = 120) वैदिक &quot;परम आयुष्&quot; (अधिकतम मानव आयु) के बराबर है। सबसे बड़ी अवधि शुक्र (20 वर्ष) को मिलती है — सुख-सुविधा और भोग प्रधान मानव अनुभव हैं। सबसे छोटी सूर्य (6 वर्ष) को — अधिकार संक्षिप्त होता है। दूसरी सबसे बड़ी शनि (19 वर्ष) को मिलती है, क्योंकि कर्म और अनुशासन का परिपक्व होना दीर्घकाल माँगता है।</>
            : <>The year counts are NOT arbitrary — they follow a mathematical pattern based on the nakshatra lords&apos; orbital periods and their perceived &quot;strength of influence.&quot; The total (7+20+6+10+7+18+16+19+17 = 120) equals the Vedic &quot;Param Ayush&quot; (maximum ideal human lifespan). The largest period goes to Venus (20 years) — comfort and pleasure form the dominant human experience. The smallest to Sun (6 years) — authority is brief. The second-largest goes to Saturn (19 years), because karma and discipline take the longest to mature.</>}
        </p>
      </section>

      {/* The Sequence */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'क्रम और नक्षत्र सम्बन्ध' : 'The Sequence and Nakshatra Connection'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>क्रम सदा एक ही है: केतु &rarr; शुक्र &rarr; सूर्य &rarr; चन्द्र &rarr; मंगल &rarr; राहु &rarr; गुरु &rarr; शनि &rarr; बुध। बुध के बाद पुनः केतु से आरम्भ। यह 27 नक्षत्रों को 3-3 के समूहों में चक्रित करता है — प्रत्येक ग्रह ठीक 3 नक्षत्रों का स्वामी है। अश्विनी (1), मघा (10), मूल (19) = केतु। भरणी (2), पू.फाल्गुनी (11), पू.आषाढ़ा (20) = शुक्र। कृत्तिका (3), उ.फाल्गुनी (12), उ.आषाढ़ा (21) = सूर्य। इसी प्रकार नौवें ग्रह बुध तक — आश्लेषा (9), ज्येष्ठा (18), रेवती (27)।</>
            : <>The sequence is always: Ketu &rarr; Venus &rarr; Sun &rarr; Moon &rarr; Mars &rarr; Rahu &rarr; Jupiter &rarr; Saturn &rarr; Mercury. After Mercury, Ketu starts again. This cycles through the 27 nakshatras in groups of 3 — each planet rules exactly 3 nakshatras. Ashwini (1), Magha (10), Mula (19) = Ketu. Bharani (2), P.Phalguni (11), P.Ashadha (20) = Venus. Krittika (3), U.Phalguni (12), U.Ashadha (21) = Sun. And so on through the ninth planet Mercury — Ashlesha (9), Jyeshtha (18), Revati (27).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ध्यान दें: तीन नक्षत्र जो एक ग्रह के अधिकार में हैं, वे समान रूप से 120-अंश अन्तराल (360/3) पर स्थित हैं। अश्विनी 0° पर, मघा 120° पर, मूल 240° पर — सभी केतु शासित। यह कोई संयोग नहीं है; यह नक्षत्र-ग्रह मानचित्रण को ज्यामितीय सामंजस्य प्रदान करता है।</>
            : <>Notice: the three nakshatras ruled by any single planet are equally spaced at 120-degree intervals (360/3). Ashwini at 0 degrees, Magha at 120 degrees, Mula at 240 degrees — all Ketu-ruled. This is no coincidence; it gives the nakshatra-planet mapping a geometric harmony that connects to the trine (trikona) principle in Jyotish.</>}
        </p>
      </section>

      {/* Classical Origin Card */}
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>विंशोत्तरी पद्धति बृहत् पराशर होराशास्त्र (BPHS), अध्याय 46 से उत्पन्न है। पराशर इसे सामान्य उपयोग के लिए सर्वाधिक उपयुक्त दशा बताते हैं — जब चन्द्रमा 0° से 360° के बीच हो (अर्थात् सदा)। पराशर 40 से अधिक दशा पद्धतियों (अष्टोत्तरी, योगिनी, आदि) का वर्णन करते हैं, किन्तु वे विशिष्ट चन्द्र स्थितियों के लिए निर्दिष्ट हैं। विंशोत्तरी कलियुग की सार्वभौमिक दशा है।</>
            : <>The Vimshottari system originates from Brihat Parashara Hora Shastra (BPHS), Chapter 46. Parashara describes it as the most suitable dasha for general use when the Moon is between 0 degrees and 360 degrees (i.e., always). Parashara describes over 40 dasha systems (Ashtottari, Yogini, etc.), but those are prescribed for specific Moon conditions. Vimshottari is the universal dasha for Kali Yuga.</>}
        </p>
      </section>

      {/* Key Fact Card */}
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'मुख्य तथ्य' : 'Key Fact'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>विंशोत्तरी को विश्व की अन्य सभी समय-निर्धारण प्रणालियों से जो अद्वितीय बनाता है: यह भविष्यवाणी कर सकती है कि घटनाएँ कब होंगी, न कि केवल क्या हो सकता है। एक पश्चिमी ज्योतिषी कह सकता है &quot;आपका विवाह हो सकता है।&quot; दशा प्रयोग करने वाला वैदिक ज्योतिषी कह सकता है &quot;विवाह की सर्वाधिक सम्भावना शुक्र-गुरु काल में, अक्टूबर 2027 से फरवरी 2029 के बीच है।&quot; यह विशिष्टता पदानुक्रमिक उपविभाजन प्रणाली के कारण सम्भव है — जिसे अगले पृष्ठ पर विस्तार से समझाया गया है।</>
            : <>Here is what makes Vimshottari unique among all timing systems worldwide: it can predict WHEN events happen, not just what MIGHT happen. A Western astrologer can say &quot;You might get married.&quot; A Vedic astrologer using dashas can say &quot;Marriage is most likely during Venus-Jupiter period, between October 2027 and February 2029.&quot; This specificity is possible because of the hierarchical subdivision system — explained in detail on the next page.</>}
        </p>
      </section>
    </div>
  );
}

/* ───────────────────────── Page 2 ───────────────────────── */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* Step 1 */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आपकी दशा की गणना — चरण दर चरण' : 'Computing Your Dasha — Step by Step'}
        </h3>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {isHi ? 'चरण 1: जन्म चन्द्रमा का नक्षत्र ज्ञात करें' : 'Step 1: Find the Birth Moon\'s Nakshatra'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चन्द्रमा का निरयन (sidereal) भोगांश ज्ञात करें। प्रत्येक नक्षत्र 13°20&apos; (13.333°) का होता है। नक्षत्र संख्या = floor(भोगांश / 13.333) + 1। उदाहरण: चन्द्रमा 167.3° निरयन पर। floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = हस्त नक्षत्र। हस्त का स्वामी चन्द्रमा है।</>
            : <>Find the Moon&apos;s sidereal (nirayana) longitude. Each nakshatra spans 13 degrees 20 minutes (13.333 degrees). Nakshatra number = floor(longitude / 13.333) + 1. Example: Moon at 167.3 degrees sidereal. floor(167.3 / 13.333) + 1 = floor(12.547) + 1 = 12 + 1 = 13 = Hasta nakshatra. Hasta is ruled by Moon.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {isHi ? 'चरण 2: आरम्भिक महादशा निर्धारित करें' : 'Step 2: Determine the Starting Mahadasha'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>जन्म नक्षत्र का स्वामी ग्रह = जन्म पर चल रही महादशा का स्वामी। हस्त का स्वामी = चन्द्रमा। अतः जन्म पर चन्द्र महादशा चल रही है। यह सीधा और सरल है — नक्षत्र &rarr; स्वामी ग्रह &rarr; वही ग्रह की दशा।</>
            : <>The planet that rules the birth nakshatra = the Mahadasha lord running at birth. Hasta&apos;s lord = Moon. So Moon Mahadasha is running at birth. This is direct and simple — nakshatra &rarr; ruling planet &rarr; that planet&apos;s dasha.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {isHi ? 'चरण 3: शेष दशा की गणना करें' : 'Step 3: Calculate the Remaining Balance'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>यह सबसे महत्त्वपूर्ण गणना है। चन्द्रमा ने नक्षत्र में कितने अंश तय किए हैं, यह ज्ञात करें। हस्त 160° से आरम्भ होता है। चन्द्रमा 167.3° पर है। तय किए अंश = 167.3 - 160 = 7.3°। कुल नक्षत्र = 13.333°। व्यतीत अनुपात = 7.3 / 13.333 = 0.5475 = 54.75%। चन्द्र की पूर्ण अवधि = 10 वर्ष। शेष = 10 x (1 - 0.5475) = 4.525 वर्ष = 4 वर्ष, 6 मास, 9 दिन। यही &quot;दशा शेष&quot; है जो हर कुण्डली में दिखता है।</>
            : <>This is the most critical calculation. Determine how many degrees the Moon has traversed within the nakshatra. Hasta starts at 160 degrees. Moon is at 167.3 degrees. Degrees traversed = 167.3 - 160 = 7.3 degrees. Total nakshatra = 13.333 degrees. Fraction consumed = 7.3 / 13.333 = 0.5475 = 54.75%. Moon&apos;s full period = 10 years. Remaining = 10 x (1 - 0.5475) = 4.525 years = 4 years, 6 months, 9 days. This is the &quot;balance of dasha&quot; shown in every Kundali.</>}
        </p>

        <h4 className="text-gold-dark font-semibold text-sm mb-2">
          {isHi ? 'चरण 4: पूर्ण अनुक्रम बनाएँ' : 'Step 4: Build the Full Sequence'}
        </h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>चन्द्र दशा (4 वर्ष 6 मास 9 दिन शेष) के बाद, अगली दशाएँ क्रम में चलती हैं: मंगल (7 वर्ष), राहु (18 वर्ष), गुरु (16 वर्ष), शनि (19 वर्ष), बुध (17 वर्ष), केतु (7 वर्ष), शुक्र (20 वर्ष), सूर्य (6 वर्ष)। प्रत्येक ठीक वहाँ से आरम्भ होती है जहाँ पिछली समाप्त होती है। कोई अन्तराल नहीं, कोई ओवरलैप नहीं — 120 वर्ष पूरी तरह आच्छादित।</>
            : <>After Moon dasha (4 years 6 months 9 days remaining), the next dashas follow in fixed order: Mars (7 years), Rahu (18 years), Jupiter (16 years), Saturn (19 years), Mercury (17 years), Ketu (7 years), Venus (20 years), Sun (6 years). Each starts exactly where the previous one ends. No gaps, no overlaps — 120 years fully covered.</>}
        </p>
      </section>

      {/* The Subdivision Hierarchy */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'उपविभाजन पदानुक्रम: 5 स्तर' : 'The Subdivision Hierarchy: 5 Levels Deep'}
        </h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">1.</span>
            <div>
              <span className="text-text-primary font-semibold">{isHi ? 'महादशा' : 'Mahadasha'}</span>
              <span className="text-text-secondary"> — {isHi ? 'प्रमुख काल: 6-20 वर्ष। जीवन का व्यापक अध्याय।' : 'Major period: 6-20 years. The broad chapter of life.'}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">2.</span>
            <div>
              <span className="text-text-primary font-semibold">{isHi ? 'अन्तर्दशा (भुक्ति)' : 'Antardasha (Bhukti)'}</span>
              <span className="text-text-secondary"> — {isHi ? 'उप-काल: मासों से वर्षों तक। अध्याय के भीतर दृश्य।' : 'Sub-period: months to years. The scene within the chapter.'}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">3.</span>
            <div>
              <span className="text-text-primary font-semibold">{isHi ? 'प्रत्यन्तर्दशा' : 'Pratyantardasha'}</span>
              <span className="text-text-secondary"> — {isHi ? 'उप-उप-काल: सप्ताहों से मासों तक। दृश्य के भीतर संवाद।' : 'Sub-sub-period: weeks to months. The dialogue within the scene.'}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">4.</span>
            <div>
              <span className="text-text-primary font-semibold">{isHi ? 'सूक्ष्म दशा' : 'Sookshma Dasha'}</span>
              <span className="text-text-secondary"> — {isHi ? 'दिनों का काल। संवाद के भीतर वाक्य।' : 'Period of days. The sentence within the dialogue.'}</span>
            </div>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[2rem]">5.</span>
            <div>
              <span className="text-text-primary font-semibold">{isHi ? 'प्राण दशा' : 'Prana Dasha'}</span>
              <span className="text-text-secondary"> — {isHi ? 'घण्टों का काल। वाक्य के भीतर शब्द।' : 'Period of hours. The word within the sentence.'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Antardasha Calculation */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अन्तर्दशा गणना सूत्र' : 'Antardasha Calculation Formula'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अन्तर्दशा अवधि = (अन्तर्दशा ग्रह के वर्ष / 120) x महादशा अवधि। 10 वर्ष की चन्द्र महादशा के भीतर: चन्द्र-चन्द्र अन्तर्दशा = (10/120) x 10 = 0.833 वर्ष = 10 मास। चन्द्र-मंगल = (7/120) x 10 = 0.583 वर्ष = 7 मास। चन्द्र-राहु = (18/120) x 10 = 1.5 वर्ष = 18 मास। ध्यान दें कि अन्तर्दशा सदा महादशा स्वामी से ही आरम्भ होती है, फिर विंशोत्तरी क्रम में आगे बढ़ती है।</>
            : <>Antardasha duration = (Antardasha planet&apos;s years / 120) x Mahadasha duration. Within a 10-year Moon Mahadasha: Moon-Moon antardasha = (10/120) x 10 = 0.833 years = 10 months. Moon-Mars = (7/120) x 10 = 0.583 years = 7 months. Moon-Rahu = (18/120) x 10 = 1.5 years = 18 months. Note that the Antardasha always begins with the Mahadasha lord itself, then proceeds through the Vimshottari sequence.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रत्यन्तर्दशा उसी सूत्र का पुनरावर्ती प्रयोग है: प्रत्यन्तर्दशा अवधि = (प्रत्यन्तर्दशा ग्रह के वर्ष / 120) x अन्तर्दशा अवधि। उदाहरण: चन्द्र-राहु अन्तर्दशा (18 मास) के भीतर, चन्द्र-राहु-गुरु प्रत्यन्तर्दशा = (16/120) x 1.5 वर्ष = 0.2 वर्ष = लगभग 73 दिन। इस प्रकार एक जन्म क्षण से दिनों की सटीकता प्राप्त होती है।</>
            : <>The Pratyantardasha uses the same formula recursively: Pratyantardasha duration = (Pratyantardasha planet&apos;s years / 120) x Antardasha duration. Example: within the Moon-Rahu antardasha (18 months), Moon-Rahu-Jupiter pratyantardasha = (16/120) x 1.5 years = 0.2 years = roughly 73 days. This is how a single birth moment generates day-level precision.</>}
        </p>
      </section>

      {/* Worked Example Card */}
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण: दिल्ली जन्म कुण्डली' : 'Worked Example: Delhi Birth Chart'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">जन्म विवरण:</span> 15 जनवरी 1990, 10:30 IST, दिल्ली। चन्द्रमा 140.13° निरयन पर। नक्षत्र = floor(140.13 / 13.333) + 1 = floor(10.509) + 1 = 11 = पूर्वा फाल्गुनी। पू.फा. का स्वामी = शुक्र। अतः जन्म पर शुक्र महादशा चल रही है।</>
            : <><span className="text-gold-light font-medium">Birth details:</span> 15 January 1990, 10:30 IST, Delhi. Moon at 140.13 degrees sidereal. Nakshatra = floor(140.13 / 13.333) + 1 = floor(10.509) + 1 = 11 = Purva Phalguni. P.Phalguni&apos;s lord = Venus. So Venus Mahadasha is running at birth.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">शेष गणना:</span> पू.फा. 133.333° से आरम्भ। तय अंश = 140.13 - 133.333 = 6.797°। अनुपात = 6.797 / 13.333 = 50.98% व्यतीत। शुक्र पूर्ण = 20 वर्ष। शेष = 20 x (1 - 0.5098) = 9.804 वर्ष = 9 वर्ष 9 मास 19 दिन।</>
            : <><span className="text-gold-light font-medium">Balance calculation:</span> P.Phalguni starts at 133.333 degrees. Degrees traversed = 140.13 - 133.333 = 6.797 degrees. Fraction consumed = 6.797 / 13.333 = 50.98%. Venus full = 20 years. Remaining = 20 x (1 - 0.5098) = 9.804 years = 9 years 9 months 19 days.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">पूर्ण अनुक्रम:</span> शुक्र: जन्म से ~ अक्टूबर 1999 | सूर्य: ~ अक्टूबर 1999 - अक्टूबर 2005 (6 वर्ष) | चन्द्र: ~ अक्टूबर 2005 - अक्टूबर 2015 (10 वर्ष) | मंगल: ~ अक्टूबर 2015 - अक्टूबर 2022 (7 वर्ष) | राहु: ~ अक्टूबर 2022 - अक्टूबर 2040 (18 वर्ष) | गुरु: ~ अक्टूबर 2040 - अक्टूबर 2056 (16 वर्ष) | शनि: ~ अक्टूबर 2056 - अक्टूबर 2075 (19 वर्ष) | बुध: ~ अक्टूबर 2075 - अक्टूबर 2092 (17 वर्ष) | केतु: ~ अक्टूबर 2092 - अक्टूबर 2099 (7 वर्ष)</>
            : <><span className="text-gold-light font-medium">Full sequence:</span> Venus: birth to ~Oct 1999 | Sun: ~Oct 1999 - Oct 2005 (6y) | Moon: ~Oct 2005 - Oct 2015 (10y) | Mars: ~Oct 2015 - Oct 2022 (7y) | Rahu: ~Oct 2022 - Oct 2040 (18y) | Jupiter: ~Oct 2040 - Oct 2056 (16y) | Saturn: ~Oct 2056 - Oct 2075 (19y) | Mercury: ~Oct 2075 - Oct 2092 (17y) | Ketu: ~Oct 2092 - Oct 2099 (7y)</>}
        </p>
      </section>

      {/* Mind-blown fact */}
      <section className="glass-card rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'अद्भुत सटीकता' : 'Staggering Precision'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>विंशोत्तरी पद्धति 9 x 9 = 81 अद्वितीय महादशा-अन्तर्दशा संयोजन उत्पन्न करती है। प्रत्यन्तर्दशा के साथ 729। सूक्ष्म दशा के साथ 6,561। प्राण दशा के साथ 59,049। यह एकमात्र जन्म क्षण से घण्टों की समय सटीकता उत्पन्न करता है। इतिहास की किसी अन्य ज्योतिष पद्धति में कालिक विस्तार (temporal granularity) का यह स्तर नहीं है।</>
            : <>The Vimshottari system generates 9 x 9 = 81 unique Mahadasha-Antardasha combinations. With Pratyantardasha, that is 729. With Sookshma, 6,561. With Prana, 59,049. This creates a timing resolution of HOURS — from a single birth moment. No other astrological system in history has this level of temporal granularity.</>}
        </p>
      </section>
    </div>
  );
}

/* ───────────────────────── Page 3 ───────────────────────── */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      {/* The Fundamental Rule */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'मूल सिद्धान्त: दशा सक्रियण' : 'The Fundamental Rule: Dasha Activation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक ग्रह की दशा उन भावों को सक्रिय करती है जिनका वह स्वामी है और जिसमें वह स्थित है। मंगल दशा उस कुण्डली के लिए जहाँ मंगल भाव 1 और 8 का स्वामी है &rarr; आत्म (1) और रूपान्तरण/संकट (8) के विषय प्रधान हो जाते हैं। शुक्र दशा जहाँ शुक्र भाव 7 और 12 का स्वामी &rarr; साझेदारी (7) और व्यय/विदेश (12) सक्रिय। यह मूल सिद्धान्त समस्त दशा व्याख्या का आधार है।</>
            : <>A planet&apos;s dasha activates the HOUSES it rules and the house it occupies. Mars dasha for a chart where Mars rules houses 1 and 8 means themes of self (1st) and transformation/crisis (8th) become dominant. Venus dasha where Venus rules houses 7 and 12 means partnerships (7th) and expenses/foreign lands (12th) are activated. This fundamental rule is the foundation of all dasha interpretation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>महत्त्वपूर्ण सिद्धान्त: एक ग्रह केवल वही फल दे सकता है जो वह जन्म कुण्डली में वचन देता है। यदि शुक्र सप्तमेश है और शुभ स्थित है, तो शुक्र दशा सुखी विवाह लाती है। यदि शुक्र षष्ठेश है और पीड़ित है, तो शुक्र दशा सम्बन्ध संघर्ष या स्वास्थ्य समस्याएँ ला सकती है। दशा जन्मकालीन वचन को सक्रिय करती है — शून्य से परिणाम नहीं रचती।</>
            : <>The critical principle: a planet can only give results that it PROMISES in the birth chart. If Venus is the 7th lord and well-placed, Venus dasha brings a happy marriage. If Venus is the 6th lord and afflicted, Venus dasha may bring relationship conflicts or health issues instead. The dasha activates the natal promise — it does not create outcomes from nothing. This is why two people running Venus dasha can have vastly different experiences.</>}
        </p>
      </section>

      {/* Mahadasha + Antardasha Interaction */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'महादशा + अन्तर्दशा अन्तःक्रिया' : 'Mahadasha + Antardasha Interaction'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>महादशा स्वामी प्रधान वातावरण प्रदान करता है। अन्तर्दशा स्वामी उस वातावरण में एक विशिष्ट प्रसंग लाता है। मंगल महादशा / गुरु अन्तर्दशा में: मंगल समग्र विषय (क्रिया, संघर्ष, सम्पत्ति) देता है, गुरु उसे रंग देता है (विस्तार, ज्ञान, सन्तान)। परिणाम: सम्पत्ति विस्तार, प्रयास से शैक्षिक उपलब्धियाँ, संघर्ष के बीच सन्तान। शुक्र महादशा / शनि अन्तर्दशा: सम्बन्धों में अनुशासन, विलासिता में मितव्ययिता, कला में संरचना।</>
            : <>The Mahadasha lord provides the dominant environment. The Antardasha lord brings a specific episode within that environment. During Mars Mahadasha / Jupiter Antardasha: Mars provides the overall theme (action, conflict, property), Jupiter colors it (expansion, wisdom, children). Result: property expansion, educational achievements through effort, children through struggle. Venus Mahadasha / Saturn Antardasha: discipline in relationships, frugality amid luxury, structure in art.</>}
        </p>
      </section>

      {/* When Do Events Happen? */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'घटनाएँ कब घटती हैं? दोहरा गोचर सिद्धान्त' : 'When Do Events Happen? The Double Transit Theory'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>एक घटना तब प्रकट होती है जब दशा स्वामी और गुरु/शनि का गोचर दोनों सम्बन्धित भाव का समर्थन करते हैं। विवाह उदाहरण: शुक्र दशा + गुरु चन्द्र से 7वें भाव में गोचर + शनि 7वें पर दृष्टि। ये तीनों स्थितियाँ एक साथ मिलनी चाहिए। यही कारण है कि शुक्र दशा के पूरे 20 वर्षों में विवाह नहीं होता — केवल उस विशिष्ट अन्तर्दशा और गोचर संयोग में होता है जब तीनों कारक एक साथ आते हैं।</>
            : <>An event manifests when BOTH the dasha lord AND Jupiter/Saturn transit support the relevant house. Marriage example: Venus dasha + Jupiter transiting 7th from Moon + Saturn aspecting the 7th. All three conditions must align simultaneously. This is why marriage does not happen throughout the entire 20-year Venus dasha — it occurs only during that specific Antardasha and transit combination when all three factors converge.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>व्यावहारिक समय-निर्धारण के लिए: (1) प्रासंगिक भाव पहचानें (विवाह = 7, कैरियर = 10, सन्तान = 5), (2) उस भाव के स्वामी या कारक ग्रह की दशा/अन्तर्दशा खोजें, (3) उस काल में गुरु और शनि के गोचर जाँचें कि क्या वे उसी भाव का समर्थन करते हैं। जब तीनों मिलें, वह समय-खिड़की घटना की सम्भावना है।</>
            : <>For practical timing: (1) identify the relevant house (marriage = 7th, career = 10th, children = 5th), (2) find the dasha/antardasha of that house lord or karaka planet, (3) check Jupiter and Saturn transits during that period to see if they support the same house. When all three align, that time window is the likely event window.</>}
        </p>
      </section>

      {/* Dasha Sandhi */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दशा सन्धि: संक्रमण का अशान्त क्षेत्र' : 'Dasha Sandhi: The Turbulent Transition Zone'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>दो महादशाओं के बीच का संक्रमण अशान्त होता है। जाती हुई दशा के अन्तिम लगभग 6 मास और आने वाली के प्रथम लगभग 6 मास अनिश्चितता और परिवर्तन का काल होते हैं। दोनों ग्रहों के बीच जितना अधिक विरोधाभास (जैसे शुक्र &rarr; सूर्य: विलासिता &rarr; अधिकार, या गुरु &rarr; शनि: विस्तार &rarr; संकुचन), संक्रमण उतना ही विघटनकारी। यह जीवन शैली, प्राथमिकताओं और पहचान में मूलभूत बदलाव का समय होता है।</>
            : <>The transition between two Mahadashas is turbulent. The last approximately 6 months of the outgoing dasha and the first approximately 6 months of the incoming one create a period of uncertainty and change. The bigger the contrast between the two planets (e.g., Venus &rarr; Sun: luxury &rarr; authority, or Jupiter &rarr; Saturn: expansion &rarr; contraction), the more disruptive the transition. This is a time of fundamental shifts in lifestyle, priorities, and identity.</>}
        </p>
      </section>

      {/* Real-life Pattern Walkthrough */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'वास्तविक जीवन प्रतिरूप: दशा-जीवन चरण मानचित्रण' : 'Real-Life Pattern: Dasha-Life Phase Mapping'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>केतु दशा से आरम्भ मानकर एक सामान्य जीवन प्रतिरूप:</>
            : <>A typical life pattern assuming Ketu dasha at birth:</>}
        </p>
        <div className="space-y-2 mb-3">
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'केतु (0-7)' : 'Ketu (0-7)'}</span>
            <span className="text-text-secondary">{isHi ? 'बचपन की विघटनकारी घटनाएँ, कार्मिक पारिवारिक प्रतिरूप, स्थान परिवर्तन' : 'Childhood disruptions, karmic family patterns, relocations'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'शुक्र (7-27)' : 'Venus (7-27)'}</span>
            <span className="text-text-secondary">{isHi ? 'शिक्षा, पहला प्रेम, विवाह, कला/सौन्दर्य जागृति, भौतिक आकांक्षाएँ' : 'Education, first love, marriage for many, art/beauty awakening, material aspirations'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'सूर्य (27-33)' : 'Sun (27-33)'}</span>
            <span className="text-text-secondary">{isHi ? 'कैरियर स्थापना, पिता सम्बन्धी घटनाएँ, अधिकार प्राप्ति, आत्म-पहचान' : 'Career establishment, father-related events, gaining authority, self-identity'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'चन्द्र (33-43)' : 'Moon (33-43)'}</span>
            <span className="text-text-secondary">{isHi ? 'भावनात्मक परिपक्वता, माता, यात्रा, गृह, सार्वजनिक छवि, मानसिक वृद्धि' : 'Emotional maturity, mother, travel, home, public image, mental growth'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'मंगल (43-50)' : 'Mars (43-50)'}</span>
            <span className="text-text-secondary">{isHi ? 'सम्पत्ति, स्वास्थ्य/शल्यक्रिया, भाई-बहन मामले, ऊर्जा गिरावट, साहस' : 'Property, health/surgery, sibling issues, energy shifts, bold actions'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'राहु (50-68)' : 'Rahu (50-68)'}</span>
            <span className="text-text-secondary">{isHi ? 'अपरम्परागत सफलता, विदेशी अनुभव, प्रौद्योगिकी, तीव्र इच्छाएँ, भ्रम' : 'Unconventional success, foreign experiences, technology, intense desires, illusions'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'गुरु (68-84)' : 'Jupiter (68-84)'}</span>
            <span className="text-text-secondary">{isHi ? 'ज्ञान संचय, पोते-पोतियाँ, धार्मिक तीर्थयात्रा, दान, विरासत निर्माण' : 'Wisdom accumulation, grandchildren, pilgrimages, charity, legacy building'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'शनि (84-103)' : 'Saturn (84-103)'}</span>
            <span className="text-text-secondary">{isHi ? 'कर्म परिपक्वता, दीर्घकालिक स्वास्थ्य, संरचनाओं का पूर्ण होना, त्याग' : 'Karmic maturity, chronic health, completion of structures, renunciation'}</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <span className="text-gold-dark font-bold min-w-[6rem]">{isHi ? 'बुध (103-120)' : 'Mercury (103-120)'}</span>
            <span className="text-text-secondary">{isHi ? 'बौद्धिक विरासत, संवाद, अन्तिम अनुकूलन, जीवन चक्र पूर्ण' : 'Intellectual legacy, communication, final adaptations, life cycle complete'}</span>
          </div>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ध्यान दें कि यह क्रम सामान्य जीवन चरणों को कैसे प्रतिबिम्बित करता है — यह संयोग नहीं है। यही कारण है कि पराशर ने विंशोत्तरी को सार्वभौमिक दशा प्रणाली के रूप में निर्दिष्ट किया। हालाँकि, अधिकांश लोग केतु दशा से नहीं बल्कि अपने जन्म नक्षत्र के अनुसार बीच से आरम्भ करते हैं, इसलिए प्रत्येक व्यक्ति का जीवन प्रतिरूप अद्वितीय होता है।</>
            : <>Notice how this sequence mirrors typical life phases — this is not coincidence. It is why Parashara prescribed Vimshottari as the default system. However, most people do not start from Ketu but enter the cycle at whatever point their birth nakshatra dictates, which is why each person&apos;s life pattern is unique.</>}
        </p>
      </section>

      {/* Misconceptions Card */}
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;राहु और शनि दशा सदा बुरी होती है&quot;</span> — यह असत्य है। राहु दशा असाधारण सांसारिक सफलता ला सकती है (विदेशी अवसर, प्रौद्योगिकी कैरियर, अपरम्परागत उपलब्धियाँ)। शनि दशा स्थायी संरचनाएँ बनाती है (कैरियर शिखर, सम्पत्ति संचय, अनुशासन)। परिणामों की गुणवत्ता आपकी कुण्डली में ग्रह की मर्यादा और भावेशत्व पर निर्भर करती है, ग्रह की सामान्य प्रतिष्ठा पर नहीं।</>
            : <><span className="text-gold-light font-medium">&quot;Rahu and Saturn dashas are always bad&quot;</span> — WRONG. Rahu dasha can bring extraordinary worldly success (foreign opportunities, technology careers, unconventional achievements). Saturn dasha builds lasting structures (career peak, property accumulation, discipline). The QUALITY of results depends on the planet&apos;s dignity and house rulership in YOUR chart, not on the planet&apos;s general reputation.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;शुक्र दशा = विवाह&quot;</span> — हमेशा नहीं। शुक्र दशा विवाह तभी लाती है जब शुक्र 7वें भाव से सम्बन्धित हो (स्वामित्व, स्थिति, या दृष्टि)। वृश्चिक लग्न के लिए शुक्र 7वें और 12वें का स्वामी है — विवाह के साथ हानि/विदेश भी। सिंह लग्न के लिए शुक्र 3 और 10 का स्वामी — विवाह नहीं बल्कि कैरियर और संवाद।</>
            : <><span className="text-gold-light font-medium">&quot;Venus dasha = marriage&quot;</span> — Not always. Venus dasha brings marriage only when Venus is connected to the 7th house (lordship, placement, or aspect). For Scorpio ascendant, Venus rules 7th and 12th — marriage with losses/foreign. For Leo ascendant, Venus rules 3rd and 10th — not marriage but career and communication.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">&quot;केतु दशा = सब कुछ नष्ट&quot;</span> — केतु दशा आध्यात्मिक जागृति, गहन ध्यान अभ्यास, मोक्ष मार्ग, और भौतिक बन्धनों से मुक्ति का सबसे शक्तिशाली काल है। कई महान सन्तों और योगियों ने केतु दशा में ज्ञान प्राप्त किया। केतु विनाश नहीं लाता — वह उस चीज़ को हटाता है जो आपके विकास में बाधा है।</>
            : <><span className="text-gold-light font-medium">&quot;Ketu dasha = everything destroyed&quot;</span> — Ketu dasha is the most powerful period for spiritual awakening, deep meditation practice, the path to moksha, and liberation from material bondage. Many great saints and yogis attained enlightenment during Ketu dasha. Ketu does not destroy — it removes what obstructs your spiritual growth.</>}
        </p>
      </section>

      {/* Practical Application: Event Timing */}
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'व्यावहारिक प्रयोग: जीवन घटना समय-निर्धारण' : 'Practical Application: Life Event Timing'}
        </h3>
        <div className="overflow-x-auto -mx-1">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'घटना' : 'Event'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'प्राथमिक दशा संकेतक' : 'Primary Dasha Indicators'}</th>
                <th className="text-gold-light text-left py-2 px-2 font-semibold">{isHi ? 'गोचर पुष्टि' : 'Transit Confirmation'}</th>
              </tr>
            </thead>
            <tbody className="text-text-secondary">
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'विवाह' : 'Marriage'}</td>
                <td className="py-2 px-2">{isHi ? 'शुक्र / सप्तमेश दशा-अन्तर्दशा' : 'Venus / 7th lord dasha-antardasha'}</td>
                <td className="py-2 px-2">{isHi ? 'गुरु 7वें में + शनि 7वें पर दृष्टि' : 'Jupiter in 7th + Saturn aspecting 7th'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'कैरियर उन्नति' : 'Career Rise'}</td>
                <td className="py-2 px-2">{isHi ? 'सूर्य / दशमेश / गुरु दशा' : 'Sun / 10th lord / Jupiter dasha'}</td>
                <td className="py-2 px-2">{isHi ? 'शनि 10वें या 11वें में गोचर' : 'Saturn transiting 10th or 11th'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'सन्तान' : 'Children'}</td>
                <td className="py-2 px-2">{isHi ? 'गुरु / पंचमेश दशा-अन्तर्दशा' : 'Jupiter / 5th lord dasha-antardasha'}</td>
                <td className="py-2 px-2">{isHi ? 'गुरु 5वें या 9वें में गोचर' : 'Jupiter transiting 5th or 9th'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'स्वास्थ्य संकट' : 'Health Crisis'}</td>
                <td className="py-2 px-2">{isHi ? 'षष्ठेश / अष्टमेश दशा' : '6th lord / 8th lord dasha'}</td>
                <td className="py-2 px-2">{isHi ? 'शनि 6/8/12 में + राहु/केतु अक्ष' : 'Saturn in 6/8/12 + Rahu/Ketu axis'}</td>
              </tr>
              <tr className="border-b border-white/5">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'विदेश यात्रा' : 'Foreign Travel'}</td>
                <td className="py-2 px-2">{isHi ? 'राहु / द्वादशेश / नवमेश दशा' : 'Rahu / 12th lord / 9th lord dasha'}</td>
                <td className="py-2 px-2">{isHi ? 'गुरु 9/12 में गोचर' : 'Jupiter transiting 9th/12th'}</td>
              </tr>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'आध्यात्मिक जागृति' : 'Spiritual Awakening'}</td>
                <td className="py-2 px-2">{isHi ? 'केतु / द्वादशेश दशा' : 'Ketu / 12th lord dasha'}</td>
                <td className="py-2 px-2">{isHi ? 'केतु 12 या 9 में गोचर' : 'Ketu transiting 12th or 9th'}</td>
              </tr>
              <tr>
                <td className="py-2 px-2 font-medium text-text-primary">{isHi ? 'सम्पत्ति क्रय' : 'Property Purchase'}</td>
                <td className="py-2 px-2">{isHi ? 'मंगल / चतुर्थेश दशा' : 'Mars / 4th lord dasha'}</td>
                <td className="py-2 px-2">{isHi ? 'शनि 4वें में + गुरु 4वें पर दृष्टि' : 'Saturn in 4th + Jupiter aspecting 4th'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Modern Relevance Card */}
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारे ऐप में प्रयोग करें' : 'Try It In Our App'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>हमारा कुण्डली इंजन (/kundali) जन्म से 120 वर्षों तक की पूर्ण विंशोत्तरी दशा तालिका गणित करता है — चन्द्रमा का सटीक निरयन भोगांश, जन्म नक्षत्र, दशा शेष, और सटीक आरम्भ-समाप्ति तिथियों सहित महादशा एवं अन्तर्दशा काल। टिप्पणी (व्याख्यात्मक भाष्य) बताता है कि वर्तमान में कौन-सी दशा चल रही है और आपकी विशिष्ट कुण्डली के लिए उसके सक्रियण का क्या अर्थ है।</>
            : <>Our Kundali engine (/kundali) computes the complete Vimshottari dasha table from birth through 120 years — the Moon&apos;s exact sidereal longitude, birth nakshatra, balance of dasha, and Mahadasha plus Antardasha periods with precise start and end dates. The Tippanni (interpretive commentary) explains which dasha is currently running and what its activation means for your specific chart.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>हमारी इंटरैक्टिव दशा प्रयोगशाला (/learn/labs/dasha) में अपना जन्म विवरण दर्ज करें और चन्द्र &rarr; नक्षत्र &rarr; दशा स्वामी &rarr; शेष गणना को चरण दर चरण होते देखें। यह इस मॉड्यूल में सीखे गए प्रत्येक गणना चरण को वास्तविक समय में प्रदर्शित करती है।</>
            : <>Try our Interactive Dasha Lab (/learn/labs/dasha) — enter your birth details and watch the Moon &rarr; Nakshatra &rarr; Dasha Lord &rarr; Balance calculation happen step by step. It demonstrates every calculation step taught in this module in real time.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module11_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_13_4', phase: 3, topic: 'Transits', moduleNumber: '13.4',
  title: { en: 'Eclipses — Grahan & the Rahu-Ketu Axis', hi: 'ग्रहण — राहु-केतु अक्ष' },
  subtitle: {
    en: 'How eclipses occur at the lunar nodes, their astronomical mechanics, Sutak rules, and how we compute them from first principles',
    hi: 'चन्द्र पातों पर ग्रहण कैसे होते हैं, उनका खगोलीय यन्त्र, सूतक नियम, और हम उन्हें मूल सिद्धान्तों से कैसे गणना करते हैं',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Eclipse Calendar', hi: 'ग्रहण पञ्चाङ्ग' }, href: '/eclipses' },
    { label: { en: 'Module 13-1: How Transits Work', hi: 'मॉड्यूल 13-1: गोचर' }, href: '/learn/modules/13-1' },
    { label: { en: 'Deep Dive: Eclipses in Jyotish', hi: 'विस्तृत: ज्योतिष में ग्रहण' }, href: '/learn/eclipses' },
    { label: { en: 'Tithis — Amavasya & Purnima', hi: 'तिथियाँ — अमावस्या और पूर्णिमा' }, href: '/learn/tithis' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q13_4_01', type: 'mcq',
    question: {
      en: 'In astronomical terms, what is Rahu (the ascending lunar node)?',
      hi: 'खगोलीय शब्दों में राहु (आरोही चन्द्र पात) क्या है?',
    },
    options: [
      { en: 'The point where the Moon crosses the ecliptic moving northward', hi: 'वह बिन्दु जहाँ चन्द्रमा उत्तर की ओर क्रान्तिवृत्त पार करता है' },
      { en: 'A shadowy planet between Mars and Jupiter', hi: 'मंगल और गुरु के बीच एक छाया ग्रह' },
      { en: 'The north pole of the Moon', hi: 'चन्द्रमा का उत्तरी ध्रुव' },
      { en: 'The point of maximum lunar latitude', hi: 'अधिकतम चन्द्र अक्षांश का बिन्दु' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Rahu is the ascending lunar node — the precise point where the Moon\'s orbital path crosses the ecliptic (the Sun\'s apparent path) as the Moon moves from south to north. It is not a physical body but a mathematical point. Its opposite, Ketu (descending node), is where the Moon crosses going south. These two points are always exactly 180° apart.',
      hi: 'राहु आरोही चन्द्र पात है — वह सटीक बिन्दु जहाँ चन्द्रमा की कक्षीय पथ, क्रान्तिवृत्त (सूर्य का प्रत्यक्ष मार्ग) को दक्षिण से उत्तर की ओर जाते समय पार करती है। यह कोई भौतिक पिण्ड नहीं बल्कि एक गणितीय बिन्दु है। इसका विपरीत, केतु (अवरोही पात), वह है जहाँ चन्द्रमा दक्षिण की ओर जाते समय पार करता है। ये दोनों बिन्दु सदैव ठीक 180° दूर होते हैं।',
    },
  },
  {
    id: 'q13_4_02', type: 'mcq',
    question: {
      en: 'By how many degrees is the Moon\'s orbital plane tilted relative to the ecliptic?',
      hi: 'चन्द्रमा की कक्षीय तल क्रान्तिवृत्त के सापेक्ष कितने अंश झुकी है?',
    },
    options: [
      { en: '1.5°', hi: '1.5°' },
      { en: '5.15°', hi: '5.15°' },
      { en: '23.5°', hi: '23.5°' },
      { en: '18.6°', hi: '18.6°' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon\'s orbit is tilted 5.15° relative to the ecliptic. This tilt is the reason eclipses don\'t happen every month — if the Moon orbited exactly in the plane of the ecliptic, every New Moon would be a solar eclipse and every Full Moon a lunar eclipse. The 5.15° tilt means the Moon passes above or below the Sun\'s shadow most of the time, with eclipses only occurring when New/Full Moon coincides with proximity to a node.',
      hi: 'चन्द्रमा की कक्षा क्रान्तिवृत्त के सापेक्ष 5.15° झुकी है। यही झुकाव कारण है कि ग्रहण हर महीने नहीं होते — यदि चन्द्रमा ठीक क्रान्तिवृत्त के तल में परिक्रमा करता, तो प्रत्येक अमावस्या सूर्य ग्रहण और प्रत्येक पूर्णिमा चन्द्र ग्रहण होती। 5.15° झुकाव का अर्थ है कि चन्द्रमा अधिकतर समय सूर्य की छाया के ऊपर या नीचे से गुज़रता है, और ग्रहण तभी होते हैं जब अमावस्या/पूर्णिमा पात के निकट हो।',
    },
  },
  {
    id: 'q13_4_03', type: 'mcq',
    question: {
      en: 'A solar eclipse (Surya Grahan) can only occur on which tithi?',
      hi: 'सूर्य ग्रहण (सूर्य ग्रहण) केवल किस तिथि को हो सकता है?',
    },
    options: [
      { en: 'Purnima (15th tithi — Full Moon)', hi: 'पूर्णिमा (15वीं तिथि — पूर्ण चन्द्र)' },
      { en: 'Amavasya (30th tithi — New Moon)', hi: 'अमावस्या (30वीं तिथि — नया चन्द्र)' },
      { en: 'Ekadashi (11th tithi)', hi: 'एकादशी (11वीं तिथि)' },
      { en: 'Chaturdashi (14th tithi)', hi: 'चतुर्दशी (14वीं तिथि)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A solar eclipse can only occur on Amavasya (the 30th tithi, New Moon day), because only then is the Moon positioned between the Earth and Sun. Solar eclipses require New Moon + proximity to a lunar node (Rahu or Ketu). If New Moon occurs when the Moon is near a node and its latitude is close to zero, the Moon\'s shadow falls on Earth, producing a solar eclipse.',
      hi: 'सूर्य ग्रहण केवल अमावस्या (30वीं तिथि, नया चन्द्र दिन) को हो सकता है, क्योंकि तभी चन्द्रमा पृथ्वी और सूर्य के बीच स्थित होता है। सूर्य ग्रहण के लिए अमावस्या + चन्द्र पात (राहु या केतु) के निकट होना आवश्यक है। यदि अमावस्या तब होती है जब चन्द्रमा किसी पात के निकट हो और उसका अक्षांश शून्य के करीब हो, तो चन्द्रमा की छाया पृथ्वी पर पड़ती है और सूर्य ग्रहण होता है।',
    },
  },
  {
    id: 'q13_4_04', type: 'mcq',
    question: {
      en: 'A lunar eclipse (Chandra Grahan) can only occur on which tithi?',
      hi: 'चन्द्र ग्रहण (चन्द्र ग्रहण) केवल किस तिथि को हो सकता है?',
    },
    options: [
      { en: 'Amavasya (30th tithi — New Moon)', hi: 'अमावस्या (30वीं तिथि — नया चन्द्र)' },
      { en: 'Purnima (15th tithi — Full Moon)', hi: 'पूर्णिमा (15वीं तिथि — पूर्ण चन्द्र)' },
      { en: 'Tritiya (3rd tithi)', hi: 'तृतीया (3री तिथि)' },
      { en: 'Ashtami (8th tithi)', hi: 'अष्टमी (8वीं तिथि)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A lunar eclipse can only occur on Purnima (the 15th tithi, Full Moon day), because only then is the Earth positioned directly between the Sun and Moon. When the Full Moon occurs near a lunar node and the Moon passes through Earth\'s shadow (umbra or penumbra), a lunar eclipse results. This is why Purnima nights have special spiritual significance — the Moon is in direct opposition to the Sun, fully illuminated and potentially eclipsed.',
      hi: 'चन्द्र ग्रहण केवल पूर्णिमा (15वीं तिथि, पूर्ण चन्द्र दिन) को हो सकता है, क्योंकि तभी पृथ्वी सूर्य और चन्द्रमा के बीच सीधे स्थित होती है। जब पूर्णिमा किसी चन्द्र पात के निकट होती है और चन्द्रमा पृथ्वी की छाया (छाया या उपछाया) से गुज़रता है, तो चन्द्र ग्रहण होता है। इसीलिए पूर्णिमा रातों का विशेष आध्यात्मिक महत्त्व है — चन्द्रमा सूर्य के सीधे विरोध में है, पूर्णतः प्रकाशित और सम्भवतः ग्रहण-ग्रस्त।',
    },
  },
  {
    id: 'q13_4_05', type: 'mcq',
    question: {
      en: 'What primarily determines whether a solar eclipse will be total, annular, or partial?',
      hi: 'सूर्य ग्रहण पूर्ण, कंकणाकृति या आंशिक होगा, यह मुख्यतः क्या निर्धारित करता है?',
    },
    options: [
      { en: 'The Moon\'s phase at the time of the eclipse', hi: 'ग्रहण के समय चन्द्रमा की कला' },
      { en: 'The Moon\'s distance from Earth and its ecliptic latitude', hi: 'पृथ्वी से चन्द्रमा की दूरी और उसका क्रान्तिक अक्षांश' },
      { en: 'The position of Jupiter in the natal chart', hi: 'जन्म कुण्डली में गुरु की स्थिति' },
      { en: 'The day of the week on which the eclipse falls', hi: 'जिस सप्ताह के दिन ग्रहण पड़े' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The type of eclipse is determined by two factors: the Moon\'s ecliptic latitude (how closely aligned it is with the node, determining how central the eclipse is) and the Moon\'s distance from Earth (its apparent size). When the Moon is at perigee (closest to Earth), it appears larger than the Sun and produces a total eclipse. When near apogee (farthest), it appears smaller and leaves a ring of sunlight — the annular eclipse. Partial eclipses occur when alignment is off-centre.',
      hi: 'ग्रहण का प्रकार दो कारकों से निर्धारित होता है: चन्द्रमा का क्रान्तिक अक्षांश (यह पात के साथ कितनी निकटता से संरेखित है, यह निर्धारित करता है कि ग्रहण कितना केन्द्रीय है) और पृथ्वी से चन्द्रमा की दूरी (उसका आभासी आकार)। जब चन्द्रमा उपभू (पृथ्वी के निकटतम) पर हो, वह सूर्य से बड़ा दिखता है और पूर्ण ग्रहण होता है। अपभू (दूरतम) के निकट होने पर, वह छोटा दिखता है और सूर्यप्रकाश का एक वलय छोड़ता है — कंकणाकृति ग्रहण। आंशिक ग्रहण तब होते हैं जब संरेखण केन्द्र से विचलित हो।',
    },
  },
  {
    id: 'q13_4_06', type: 'mcq',
    question: {
      en: 'What is a "Blood Moon" in astronomical terms?',
      hi: '"ब्लड मून" खगोलीय शब्दों में क्या है?',
    },
    options: [
      { en: 'A partial lunar eclipse where only the edge of the Moon enters Earth\'s shadow', hi: 'आंशिक चन्द्र ग्रहण जिसमें चन्द्रमा का केवल किनारा पृथ्वी की छाया में प्रवेश करता है' },
      { en: 'A total lunar eclipse where the Moon appears red-orange due to Earth\'s atmospheric refraction', hi: 'पूर्ण चन्द्र ग्रहण जिसमें पृथ्वी के वायुमण्डलीय अपवर्तन के कारण चन्द्रमा लाल-नारंगी दिखता है' },
      { en: 'A penumbral lunar eclipse visible only through telescopes', hi: 'दूरदर्शी से ही दृश्य उपछाया चन्द्र ग्रहण' },
      { en: 'A supermoon coinciding with a lunar eclipse', hi: 'चन्द्र ग्रहण के साथ संयोग वाला सुपरमून' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A Blood Moon is a total lunar eclipse. When the Moon passes completely into Earth\'s umbral shadow, all direct sunlight is blocked — but Earth\'s atmosphere bends (refracts) sunlight around the planet\'s edges. Only the longer red wavelengths pass through this atmospheric filter, painting the Moon with shades of red, orange, and copper. The same physics that makes sunrises and sunsets red. The deeper the Moon is in Earth\'s shadow, the darker and more dramatic the red colour.',
      hi: 'ब्लड मून एक पूर्ण चन्द्र ग्रहण है। जब चन्द्रमा पूरी तरह पृथ्वी की छाया में प्रवेश करता है, तो सभी प्रत्यक्ष सूर्यप्रकाश अवरुद्ध हो जाता है — लेकिन पृथ्वी का वायुमण्डल ग्रह के किनारों के चारों ओर सूर्यप्रकाश को मोड़ता (अपवर्तित करता) है। केवल लंबे लाल तरंगदैर्घ्य इस वायुमण्डलीय छानने से गुज़रते हैं, चन्द्रमा को लाल, नारंगी और तांबे के रंगों से रंग देते हैं। वही भौतिकी जो सूर्योदय और सूर्यास्त को लाल बनाती है। चन्द्रमा जितना गहरा पृथ्वी की छाया में हो, लाल रंग उतना ही गहरा और नाटकीय।',
    },
  },
  {
    id: 'q13_4_07', type: 'mcq',
    question: {
      en: 'According to the Nirnaya Sindhu tradition, how long before a solar eclipse does Sutak begin?',
      hi: 'निर्णय सिन्धु परम्परा के अनुसार, सूर्य ग्रहण से कितने समय पहले सूतक आरम्भ होता है?',
    },
    options: [
      { en: '3 hours', hi: '3 घण्टे' },
      { en: '4 hours', hi: '4 घण्टे' },
      { en: '12 hours', hi: '12 घण्टे' },
      { en: '24 hours', hi: '24 घण्टे' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'According to the Nirnaya Sindhu (a key authority on Dharmashastra), Sutak for a solar eclipse begins 12 hours (4 praharas) before the eclipse contact. Different texts prescribe different durations — Dharmasindhu says 12 hours for solar, 9 hours for lunar; Muhurta Chintamani says 3 praharas (about 9 hours) for solar. In practice, 12 hours for solar eclipse and 9 hours for lunar eclipse is widely observed across North India.',
      hi: 'निर्णय सिन्धु (धर्मशास्त्र पर एक प्रमुख प्राधिकरण) के अनुसार, सूर्य ग्रहण के लिए सूतक ग्रहण स्पर्श से 12 घण्टे (4 प्रहर) पहले आरम्भ होता है। विभिन्न ग्रन्थ अलग-अलग अवधि निर्धारित करते हैं — धर्मसिन्धु सूर्य के लिए 12 घण्टे, चन्द्र के लिए 9 घण्टे कहता है; मुहूर्त चिन्तामणि सूर्य के लिए 3 प्रहर (लगभग 9 घण्टे) कहता है। व्यवहार में, सूर्य ग्रहण के लिए 12 घण्टे और चन्द्र ग्रहण के लिए 9 घण्टे उत्तर भारत में व्यापक रूप से पालन किए जाते हैं।',
    },
  },
  {
    id: 'q13_4_08', type: 'mcq',
    question: {
      en: 'Approximately how long is the Saros cycle — the period after which eclipses repeat in nearly the same geometry?',
      hi: 'सारोस चक्र — जिसके बाद ग्रहण लगभग उसी ज्यामिति में दोहराते हैं — लगभग कितने समय का होता है?',
    },
    options: [
      { en: '9 years, 5 months, 12 days', hi: '9 वर्ष, 5 माह, 12 दिन' },
      { en: '18 years, 11 days, 8 hours', hi: '18 वर्ष, 11 दिन, 8 घण्टे' },
      { en: '33 years exactly', hi: 'ठीक 33 वर्ष' },
      { en: '54 years, 1 month', hi: '54 वर्ष, 1 माह' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Saros cycle is approximately 18 years, 11 days, and 8 hours. After exactly one Saros, the Sun, Moon, and Earth return to nearly the same geometric alignment, producing an eclipse of very similar type, duration, and magnitude. The extra 8 hours means the repeat eclipse occurs about 120° west of the previous one (since Earth rotates in that time). Three consecutive Saros cycles (called an Exeligmos, ~54 years) bring an eclipse back to nearly the same longitude.',
      hi: 'सारोस चक्र लगभग 18 वर्ष, 11 दिन और 8 घण्टे का होता है। ठीक एक सारोस के बाद, सूर्य, चन्द्रमा और पृथ्वी लगभग उसी ज्यामितीय संरेखण में वापस आते हैं, जिससे बहुत समान प्रकार, अवधि और परिमाण का ग्रहण होता है। अतिरिक्त 8 घण्टे का अर्थ है कि दोहराने वाला ग्रहण पिछले वाले से लगभग 120° पश्चिम में होता है (चूँकि उस समय में पृथ्वी उतना घूमती है)। तीन लगातार सारोस चक्र (जिसे एक्सेलिग्मोस कहते हैं, ~54 वर्ष) एक ग्रहण को लगभग उसी देशान्तर पर वापस लाते हैं।',
    },
  },
  {
    id: 'q13_4_09', type: 'true_false',
    question: {
      en: 'Every Amavasya (New Moon) produces a solar eclipse.',
      hi: 'प्रत्येक अमावस्या (नया चन्द्र) सूर्य ग्रहण उत्पन्न करती है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The Moon\'s orbital plane is tilted 5.15° relative to the ecliptic. On most New Moons, the Moon passes above or below the Sun in the sky — no eclipse occurs. A solar eclipse requires the New Moon to happen when the Moon is NEAR one of the lunar nodes (Rahu or Ketu), so its ecliptic latitude is close to zero and its shadow can fall on Earth. This alignment happens only about 2–3 times per year, producing eclipse seasons.',
      hi: 'असत्य। चन्द्रमा की कक्षीय तल क्रान्तिवृत्त के सापेक्ष 5.15° झुकी है। अधिकतर अमावस्याओं पर, चन्द्रमा आकाश में सूर्य के ऊपर या नीचे से गुज़रता है — कोई ग्रहण नहीं होता। सूर्य ग्रहण के लिए अमावस्या तब होना आवश्यक है जब चन्द्रमा किसी चन्द्र पात (राहु या केतु) के निकट हो, ताकि उसका क्रान्तिक अक्षांश शून्य के करीब हो और उसकी छाया पृथ्वी पर पड़ सके। यह संरेखण केवल वर्ष में लगभग 2-3 बार होता है, जिससे ग्रहण ऋतुएँ बनती हैं।',
    },
  },
  {
    id: 'q13_4_10', type: 'true_false',
    question: {
      en: 'Penumbral lunar eclipses are easily visible to the naked eye because the Moon turns visibly dark.',
      hi: 'उपछाया चन्द्र ग्रहण नग्न आँखों से आसानी से दिखते हैं क्योंकि चन्द्रमा स्पष्ट रूप से अंधेरा हो जाता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. In a penumbral lunar eclipse, the Moon passes only through Earth\'s penumbra (the outer, lighter shadow) rather than the umbra (the dark central shadow). The penumbra only slightly dims the Moon\'s brightness — the change is so subtle that casual observers rarely notice anything unusual. Only when the Moon is deep in the penumbra (penumbral magnitude > 0.7) does the darkening become faintly perceptible. Contrast this with total lunar eclipses, which are dramatic and unmistakable.',
      hi: 'असत्य। उपछाया चन्द्र ग्रहण में, चन्द्रमा केवल पृथ्वी की उपछाया (बाहरी, हल्की छाया) से गुज़रता है, छाया (अंधेरी केन्द्रीय छाया) से नहीं। उपछाया केवल थोड़ी ही चन्द्रमा की चमक कम करती है — परिवर्तन इतना सूक्ष्म है कि सामान्य पर्यवेक्षक शायद ही कुछ असामान्य नोटिस करें। केवल तब जब चन्द्रमा उपछाया में गहरा हो (उपछाया परिमाण > 0.7), अंधकार हल्का-सा महसूस होता है। इसे पूर्ण चन्द्र ग्रहणों से तुलना करें, जो नाटकीय और अचूक होते हैं।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Why Eclipses Happen                                        */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ग्रहण क्यों होते हैं' : 'Why Eclipses Happen'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>समुद्र मन्थन की पौराणिक कथा में, स्वर्भानु नामक असुर ने देवताओं के रूप में अमृत पी लिया। सूर्य और चन्द्रमा ने उसे पहचान लिया और विष्णु ने सुदर्शन चक्र से उसका सिर धड़ से अलग कर दिया। शिर राहु बना — आरोही चन्द्र पात; धड़ केतु बना — अवरोही चन्द्र पात। तब से, राहु और केतु आकाश में चक्कर लगाते हैं और समय-समय पर सूर्य व चन्द्रमा को निगल लेते हैं — और ग्रहण होता है। पौराणिक कथा जो बताती है वह खगोलीय सत्य है: ग्रहण ठीक वहाँ होते हैं जहाँ राहु और केतु हैं।</> : <>In the myth of the Samudra Manthan (Ocean Churning), a demon named Svarbhanu disguised himself as a god and drank the nectar of immortality. The Sun and Moon recognised him; Vishnu severed his head with the Sudarshana Chakra. The head became Rahu — the ascending lunar node; the torso became Ketu — the descending lunar node. Ever since, Rahu and Ketu circle the sky, periodically swallowing the Sun and Moon — and an eclipse occurs. What the myth encodes is astronomical fact: eclipses happen precisely where Rahu and Ketu are.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'खगोलीय यन्त्र' : 'The Astronomical Mechanism'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">चन्द्रमा का झुकाव:</span> चन्द्रमा की कक्षीय तल क्रान्तिवृत्त (सूर्य का प्रत्यक्ष मार्ग) के सापेक्ष 5.15° झुकी है। अधिकतर समय चन्द्रमा सूर्य की छाया के ऊपर या नीचे से गुज़रता है।</> : <><span className="text-gold-light font-medium">The Moon&apos;s tilt:</span> The Moon&apos;s orbital plane is tilted 5.15° relative to the ecliptic (the Sun&apos;s apparent path). Most of the time the Moon passes above or below the Sun&apos;s shadow.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">पात बिन्दु:</span> चन्द्रमा महीने में दो बार क्रान्तिवृत्त तल पार करता है। इन बिन्दुओं को चन्द्र पात कहते हैं — उत्तर की ओर जाते समय आरोही पात (राहु), दक्षिण की ओर अवरोही पात (केतु)। यहाँ चन्द्रमा का अक्षांश शून्य है।</> : <><span className="text-gold-light font-medium">The nodal points:</span> The Moon crosses the ecliptic plane twice a month. These crossing points are the lunar nodes — ascending (Rahu) when moving north, descending (Ketu) when moving south. Here the Moon&apos;s ecliptic latitude is zero.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">सूर्य ग्रहण की शर्त:</span> अमावस्या + पात के निकट = सूर्य ग्रहण। चन्द्रमा पृथ्वी और सूर्य के बीच आता है; चन्द्रमा की छाया पृथ्वी की सतह पर पड़ती है।</> : <><span className="text-gold-light font-medium">Solar eclipse condition:</span> New Moon + near a node = solar eclipse. The Moon passes between Earth and Sun; the Moon&apos;s shadow falls on Earth&apos;s surface.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">चन्द्र ग्रहण की शर्त:</span> पूर्णिमा + पात के निकट = चन्द्र ग्रहण। पृथ्वी सूर्य और चन्द्रमा के बीच आती है; चन्द्रमा पृथ्वी की छाया में प्रवेश करता है।</> : <><span className="text-gold-light font-medium">Lunar eclipse condition:</span> Full Moon + near a node = lunar eclipse. Earth passes between Sun and Moon; the Moon enters Earth&apos;s shadow.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'ग्रहण ऋतु' : 'Eclipse Seasons'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>प्रत्येक अमावस्या और पूर्णिमा ग्रहण नहीं होती — केवल लगभग 2–3 ग्रहण ऋतुएँ प्रति वर्ष होती हैं। प्रत्येक ऋतु लगभग 34–38 दिन लम्बी होती है, जब सूर्य किसी पात के 15–18° के भीतर होता है। एक ऋतु में 2–3 ग्रहण हो सकते हैं: एक सूर्य और एक चन्द्र, या दो सूर्य और एक चन्द्र। यही कारण है कि ग्रहण समूहों में आते हैं।</> : <>Not every New Moon and Full Moon is an eclipse — there are only about 2–3 eclipse seasons per year. Each season lasts about 34–38 days, when the Sun is within 15–18° of a node. A single season may produce 2–3 eclipses: one solar and one lunar, or two solar and one lunar. This is why eclipses tend to come in clusters.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Types, Phases & Our Calculation                           */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'प्रकार, चरण और गणना' : 'Types, Phases & Our Calculation'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण 6 प्रकार के होते हैं, जो सूर्य ग्रहण की तीन और चन्द्र ग्रहण की तीन श्रेणियों में विभाजित हैं। प्रत्येक प्रकार चन्द्रमा की पृथ्वी से दूरी, उसके सटीक क्रान्तिक अक्षांश और पर्यवेक्षक की स्थिति पर निर्भर करता है। हमारी ग्रहण गणना का इंजन मेयस एल्गोरिदम और स्विस एफेमेरिस डेटा का उपयोग करके इन मापदण्डों की गणना करता है।</> : <>Eclipses come in 6 types, divided into three solar categories and three lunar categories. Each type depends on the Moon&apos;s distance from Earth, its precise ecliptic latitude, and the observer&apos;s location. Our eclipse calculation engine computes these parameters using Meeus algorithms and Swiss Ephemeris data.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? '6 प्रकार के ग्रहण' : '6 Types of Eclipse'}</h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'पूर्ण सूर्य ग्रहण:' : 'Total Solar:'}</span>{' '}
            {isHi ? 'चन्द्रमा सूर्य को पूर्णतः ढक लेता है। केवल कोरोना दिखता है। चन्द्रमा की छाया (अम्ब्रा) पृथ्वी पर एक संकीर्ण पट्टी बनाती है।' : 'Moon fully covers the Sun. Only the corona is visible. The Moon\'s umbra traces a narrow path on Earth.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'कंकणाकृति सूर्य ग्रहण:' : 'Annular Solar:'}</span>{' '}
            {isHi ? 'चन्द्रमा अपभू के निकट होने से सूर्य से छोटा दिखता है। सूर्य का एक वलय (कंकण) चन्द्रमा के चारों ओर दिखता है।' : 'Moon near apogee appears smaller than Sun. A ring ("annulus") of sunlight surrounds the Moon.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'आंशिक सूर्य ग्रहण:' : 'Partial Solar:'}</span>{' '}
            {isHi ? 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। उपछाया क्षेत्र में पर्यवेक्षक इसे देखते हैं।' : 'Moon covers only part of the Sun. Observers in the penumbra zone see this.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'पूर्ण चन्द्र ग्रहण (ब्लड मून):' : 'Total Lunar (Blood Moon):'}</span>{' '}
            {isHi ? 'चन्द्रमा पूरी तरह पृथ्वी की छाया में। पृथ्वी का वायुमण्डलीय अपवर्तन चन्द्रमा को लाल-नारंगी रंग देता है।' : 'Moon fully within Earth\'s umbra. Atmospheric refraction turns the Moon red-orange.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'आंशिक चन्द्र ग्रहण:' : 'Partial Lunar:'}</span>{' '}
            {isHi ? 'चन्द्रमा का एक भाग पृथ्वी की छाया में। छाया वाला भाग स्पष्ट रूप से गहरा दिखता है।' : 'Part of the Moon enters Earth\'s umbra. The shadowed portion is visibly darker.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'उपछाया चन्द्र ग्रहण:' : 'Penumbral Lunar:'}</span>{' '}
            {isHi ? 'चन्द्रमा केवल पृथ्वी की उपछाया से गुज़रता है। परिवर्तन बहुत सूक्ष्म — नग्न आँखों से शायद ही दिखे।' : 'Moon passes only through Earth\'s penumbra. Change is very subtle — barely perceptible to the naked eye.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'ग्रहण के चरण' : 'Eclipse Phases'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">सूर्य ग्रहण:</span> स्पर्श (C1) — बाह्य संपर्क आरम्भ। मध्य — अधिकतम ग्रहण। मोक्ष (C4) — बाह्य संपर्क समाप्त। पूर्ण/कंकणाकृति ग्रहण में: C2 — आन्तरिक संपर्क आरम्भ (पूर्णता आरम्भ); C3 — आन्तरिक संपर्क समाप्त (पूर्णता समाप्त)।</> : <><span className="text-gold-light font-medium">Solar eclipse:</span> Sparsha (C1) — first external contact. Madhya — maximum eclipse. Moksha (C4) — last external contact. For total/annular: C2 — second contact (totality begins); C3 — third contact (totality ends).</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <><span className="text-gold-light font-medium">चन्द्र ग्रहण:</span> P1 — उपछाया में प्रवेश। U1 — छाया में प्रवेश (आंशिक आरम्भ)। अधिकतम — गहरतम। U2 — छाया से बाहर (आंशिक समाप्त)। P4 — उपछाया से बाहर।</> : <><span className="text-gold-light font-medium">Lunar eclipse:</span> P1 — penumbral entry. U1 — umbral entry (partial begins). Maximum — deepest point. U2 — umbral exit (partial ends). P4 — penumbral exit.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'हमारी गणना पद्धति' : 'How We Calculate'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{isHi ? 'चरण 1:' : 'Step 1:'}</span>{' '}
          {isHi ? 'तिथि तालिका से सभी अमावस्या/पूर्णिमा का पता लगाएँ (पूरे वर्ष के लिए)।' : 'Find all Amavasya/Purnima from the tithi table (pre-computed for the full year).'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{isHi ? 'चरण 2:' : 'Step 2:'}</span>{' '}
          {isHi ? 'स्विस एफेमेरिस से उस क्षण चन्द्रमा का क्रान्तिक अक्षांश प्राप्त करें।' : 'Get Moon\'s ecliptic latitude at that instant from Swiss Ephemeris.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{isHi ? 'चरण 3:' : 'Step 3:'}</span>{' '}
          {isHi ? 'दूरी-अनुमापित सीमा लागू करें: |β| < 1.57° (सूर्य), |β| < 1.02° (चन्द्र)। यदि पार हो, ग्रहण।' : 'Apply distance-scaled threshold: |β| < 1.57° (solar), |β| < 1.02° (lunar). If crossed, eclipse occurs.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">
          <span className="text-gold-light font-medium">{isHi ? 'चरण 4:' : 'Step 4:'}</span>{' '}
          {isHi ? 'स्थलाकृतिक लम्बन का उपयोग करके स्थानीय संपर्क समय गणना करें — ग्रहण का समय पर्यवेक्षक की स्थिति के अनुसार भिन्न होता है।' : 'Compute local contact times using topocentric parallax — eclipse timing varies with observer location.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">{isHi ? 'चरण 5:' : 'Step 5:'}</span>{' '}
          {isHi ? 'परिमाण गणना: सूर्य ग्रहण के लिए — ढके सूर्य का भाग; चन्द्र ग्रहण के लिए — छाया में चन्द्रमा का भाग।' : 'Compute magnitude: for solar — fraction of Sun covered; for lunar — fraction of Moon in shadow (umbra).'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Sutak, Kundali Impact & Saros                             */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सूतक, कुण्डली प्रभाव एवं सारोस' : 'Sutak, Kundali Impact & Saros'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण केवल खगोलीय घटनाएँ नहीं — ये शक्तिशाली ऊर्जा परिवर्तन हैं। जिस समय पृथ्वी, चन्द्रमा और सूर्य सटीक संरेखण में होते हैं, वह समय असाधारण माना जाता है। परम्परागत पञ्चाङ्ग सूतक नियम (ग्रहण पूर्व अशुचि काल) और ग्रहण के दौरान पालनीय आचार निर्धारित करते हैं। ज्योतिष में, ग्रहण जन्मकालीन ग्रहों को सक्रिय करते हैं।</> : <>Eclipses are not merely astronomical events — they are powerful energy shifts. The moment Earth, Moon, and Sun align with mathematical precision is considered extraordinary. Traditional Panchang texts prescribe Sutak rules (pre-eclipse impurity periods) and observances during the eclipse. In Jyotish, eclipses act as powerful activators of natal planets.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सूतक नियम — तीन परम्पराएँ' : 'Sutak Rules — Three Traditions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'धर्मसिन्धु:' : 'Dharmasindhu:'}</span>{' '}
          {isHi ? 'सूर्य ग्रहण के लिए 12 घण्टे (4 प्रहर), चन्द्र ग्रहण के लिए 9 घण्टे (3 प्रहर)।' : 'Solar eclipse — 12 hours (4 praharas) before; lunar eclipse — 9 hours (3 praharas) before.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'निर्णय सिन्धु:' : 'Nirnaya Sindhu:'}</span>{' '}
          {isHi ? 'सूर्य ग्रहण के लिए 12 घण्टे। व्यापक रूप से पालित परम्परा।' : 'Solar eclipse — 12 hours before contact. The most widely followed tradition.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'मुहूर्त चिन्तामणि:' : 'Muhurta Chintamani:'}</span>{' '}
          {isHi ? 'सूर्य ग्रहण के लिए 3 प्रहर (लगभग 9 घण्टे), चन्द्र ग्रहण के लिए 3 प्रहर।' : 'Solar eclipse — 3 praharas (~9 hours); lunar eclipse — 3 praharas before contact.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-3 pt-3 border-t border-gold-primary/10">
          <span className="text-gold-light font-medium">{isHi ? 'सूतक में क्या करें / क्या न करें:' : 'What to do / avoid during Sutak:'}</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mt-1">{isHi ? <>परिहार करें: भोजन पकाना और खाना (दही, पका भोजन), नया कार्य आरम्भ, मैथुन, सोना। अनुशंसित: मन्त्र जप, ध्यान, दान, पवित्र नदी स्नान (ग्रहण स्नान), भगवत् स्मरण। ग्रहण समाप्ति के बाद: स्नान, ताज़ा भोजन पकाना।</> : <>Avoid: cooking and eating food (curd, cooked food), starting new ventures, sexual activity, sleeping. Recommended: mantra japa, meditation, charity, holy river bathing (Grahan Snan), devotional remembrance. After eclipse ends: bath, cook fresh food.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कुण्डली पर ग्रहण का प्रभाव' : 'Eclipse Impact on the Natal Chart'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'जन्मकालीन ग्रहों पर ग्रहण:' : 'Eclipse on natal planets:'}</span>{' '}
          {isHi ? 'जब ग्रहण जन्म कुण्डली के किसी ग्रह पर (±5°) पड़े, तो उस ग्रह के कारकत्व तीव्र रूप से सक्रिय होते हैं — सूर्य पर ग्रहण (पिता, प्रतिष्ठा, स्वास्थ्य); चन्द्रमा पर (माता, मन, भावनाएँ)।' : 'When an eclipse falls on a natal planet (±5°), that planet\'s significations are intensely activated — eclipse on natal Sun (father, status, health); on Moon (mother, mind, emotions); on Mars (energy, conflict, accidents); on Jupiter (wisdom, children, dharma).'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">{isHi ? 'ग्रहण का भाव:' : 'Eclipse in a specific house:'}</span>{' '}
          {isHi ? 'ग्रहण जिस भाव में हो, उस जीवन क्षेत्र में घटनाएँ 6 माह तक प्रकट हो सकती हैं। उदाहरण: 7वें भाव में ग्रहण — विवाह, साझेदारी में परिवर्तन; 10वें भाव में — करियर बदलाव।' : 'Eclipse in a house activates events in that life area for up to 6 months. Example: eclipse in 7th house — shifts in marriage or partnerships; 10th house — career changes; 4th house — home and family events.'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">{isHi ? 'समयरेखा:' : 'Timeline:'}</span>{' '}
          {isHi ? 'ग्रहण के प्रभाव तत्काल नहीं होते — वे 3–6 माह में प्रकट होते हैं। यह वह काल है जब ग्रहण-सम्बन्धित विषय उभरते, परिवर्तित या समाप्त होते हैं।' : 'Eclipse effects are not always immediate — they unfold over 3–6 months. This is the window when eclipse-related themes emerge, shift, or close.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सारोस चक्र' : 'The Saros Cycle'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>सारोस चक्र लगभग 18 वर्ष, 11 दिन और 8 घण्टे का होता है। इस अवधि के बाद, सूर्य, चन्द्रमा और पृथ्वी लगभग उसी ज्यामितीय स्थिति में लौटते हैं — फलतः बहुत समान प्रकार, अवधि और परिमाण का ग्रहण होता है। &ldquo;लगभग&rdquo; इसलिए कि अतिरिक्त 8 घण्टे के कारण पृथ्वी लगभग 120° और घूम जाती है, इसलिए दोहराने वाला ग्रहण पिछले वाले से 120° पश्चिम में होता है।</> : <>The Saros cycle is approximately 18 years, 11 days, and 8 hours. After this period, the Sun, Moon, and Earth return to nearly the same geometric configuration — producing an eclipse of very similar type, duration, and magnitude. &ldquo;Nearly&rdquo; because the extra 8 hours means Earth has rotated about 120° further, so the repeat eclipse occurs 120° west of the previous one.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">{isHi ? <>तीन सारोस चक्रों को मिलाकर एक &ldquo;एक्सेलिग्मोस&rdquo; (~54 वर्ष, 33 दिन) बनता है, जो ग्रहण को लगभग उसी देशान्तर पर वापस लाता है। प्राचीन बाबुलियों ने इस चक्र की खोज की थी। कल्डीय पुरोहित भविष्यवाणी करते थे कि अगला ग्रहण कब होगा — हजारों वर्ष पहले, बिना किसी आधुनिक दूरदर्शी के।</> : <>Three Saros cycles combine to form an &ldquo;Exeligmos&rdquo; (~54 years, 33 days) that brings an eclipse back to nearly the same longitude. The ancient Babylonians discovered this cycle. Chaldean priests could predict when the next eclipse would occur — thousands of years ago, without any modern telescope.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

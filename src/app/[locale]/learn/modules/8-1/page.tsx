'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_8_1', phase: 2, topic: 'Muhurta', moduleNumber: '8.1',
  title: { en: 'Panchang Integration — The Five Limbs Together', hi: 'पंचांग समन्वय — पाँच अंगों का समग्र विश्लेषण' },
  subtitle: {
    en: 'Tithi, Vara, Nakshatra, Yoga, and Karana unite to form the Panchang — a five-dimensional lens on the quality of any moment',
    hi: 'तिथि, वार, नक्षत्र, योग और करण मिलकर पंचांग बनाते हैं — किसी भी क्षण की गुणवत्ता को देखने का पंच-आयामी दृष्टिकोण',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 7-1: Yoga', hi: 'मॉड्यूल 7-1: योग' }, href: '/learn/modules/7-1' },
    { label: { en: 'Module 7-2: Karana', hi: 'मॉड्यूल 7-2: करण' }, href: '/learn/modules/7-2' },
    { label: { en: 'Module 7-3: Vara', hi: 'मॉड्यूल 7-3: वार' }, href: '/learn/modules/7-3' },
    { label: { en: 'Module 5-1: Tithi', hi: 'मॉड्यूल 5-1: तिथि' }, href: '/learn/modules/5-1' },
    { label: { en: 'Module 6-1: Nakshatra', hi: 'मॉड्यूल 6-1: नक्षत्र' }, href: '/learn/modules/6-1' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
    { label: { en: 'Muhurta AI', hi: 'मुहूर्त AI' }, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q8_1_01', type: 'mcq',
    question: {
      en: 'What does the word "Panchang" literally mean?',
      hi: '"पंचांग" शब्द का शाब्दिक अर्थ क्या है?',
    },
    options: [
      { en: 'Five planets', hi: 'पाँच ग्रह' },
      { en: 'Five limbs', hi: 'पाँच अंग' },
      { en: 'Five houses', hi: 'पाँच भाव' },
      { en: 'Five signs', hi: 'पाँच राशियाँ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Panchang = Pancha (five) + Anga (limb). The five limbs are Tithi, Vara (weekday), Nakshatra (Moon\'s star), Yoga (Sun+Moon sum), and Karana (half-tithi). Together they provide a five-dimensional assessment of any moment\'s quality.',
      hi: 'पंचांग = पंच (पाँच) + अंग। पाँच अंग हैं: तिथि, वार, नक्षत्र (चन्द्रमा का नक्षत्र), योग (सूर्य+चन्द्र योग), और करण (अर्ध-तिथि)। ये मिलकर किसी भी क्षण की गुणवत्ता का पंच-आयामी मूल्यांकन प्रदान करते हैं।',
    },
  },
  {
    id: 'q8_1_02', type: 'mcq',
    question: {
      en: 'Which Panchang element tracks the Moon\'s sidereal position alone?',
      hi: 'कौन-सा पंचांग तत्व केवल चन्द्रमा की सायन स्थिति को ट्रैक करता है?',
    },
    options: [
      { en: 'Tithi (Moon-Sun elongation)', hi: 'तिथि (चन्द्र-सूर्य कोणीय दूरी)' },
      { en: 'Nakshatra (Moon\'s sidereal longitude)', hi: 'नक्षत्र (चन्द्रमा का सायन अंश)' },
      { en: 'Yoga (Sun+Moon sum)', hi: 'योग (सूर्य+चन्द्र योग)' },
      { en: 'Vara (weekday)', hi: 'वार (सप्ताह का दिन)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Nakshatra depends solely on the Moon\'s sidereal longitude divided into 27 segments of 13°20\u2032. Tithi uses Moon minus Sun, Yoga uses Moon plus Sun, Karana is derived from Tithi, and Vara depends only on the Julian Day Number.',
      hi: 'नक्षत्र केवल चन्द्रमा के सायन अंश पर निर्भर है, जिसे 13°20\u2032 के 27 खण्डों में बाँटा जाता है। तिथि चन्द्र-सूर्य अन्तर, योग चन्द्र+सूर्य योग, करण तिथि से व्युत्पन्न, और वार केवल जूलियन दिवस संख्या पर निर्भर है।',
    },
  },
  {
    id: 'q8_1_03', type: 'true_false',
    question: {
      en: 'In muhurta selection, the traditional hierarchy of importance is: Nakshatra > Tithi > Yoga > Vara > Karana.',
      hi: 'मुहूर्त चयन में परम्परागत महत्व क्रम है: नक्षत्र > तिथि > योग > वार > करण।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Classical muhurta texts generally place Nakshatra as the most important element (it determines the Moon\'s stellar influence), followed by Tithi (lunar phase energy), then Yoga, Vara, and Karana. However, a single severely negative element (like Vishti karana or Vyatipata yoga) can override otherwise positive factors.',
      hi: 'सत्य। शास्त्रीय मुहूर्त ग्रन्थ सामान्यतः नक्षत्र को सर्वाधिक महत्वपूर्ण मानते हैं (यह चन्द्रमा के तारकीय प्रभाव को निर्धारित करता है), फिर तिथि (चान्द्र कला ऊर्जा), योग, वार, और करण। परन्तु एक भी गम्भीर नकारात्मक तत्व (जैसे विष्टि करण या व्यतीपात योग) अन्यथा सकारात्मक कारकों को निरस्त कर सकता है।',
    },
  },
  {
    id: 'q8_1_04', type: 'mcq',
    question: {
      en: 'Besides the five Panchang limbs, which of these is commonly listed in a daily Panchang?',
      hi: 'पंचांग के पाँच अंगों के अतिरिक्त, दैनिक पंचांग में इनमें से क्या सामान्यतः सूचीबद्ध होता है?',
    },
    options: [
      { en: 'Only the five limbs, nothing else', hi: 'केवल पाँच अंग, और कुछ नहीं' },
      { en: 'Rahu Kaal, Yamaganda, Gulika Kaal, and Choghadiya', hi: 'राहु काल, यमगण्ड, गुलिक काल, और चौघड़िया' },
      { en: 'Only planetary positions', hi: 'केवल ग्रह स्थितियाँ' },
      { en: 'Only festival dates', hi: 'केवल त्योहार तिथियाँ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A complete daily Panchang includes the five limbs plus Rahu Kaal (inauspicious period ruled by Rahu), Yamaganda (inauspicious period ruled by Yama), Gulika Kaal (inauspicious period of Saturn), and Choghadiya (alternating auspicious/inauspicious time blocks). Sunrise and sunset times are also essential.',
      hi: 'एक पूर्ण दैनिक पंचांग में पाँच अंगों के साथ राहु काल (राहु शासित अशुभ अवधि), यमगण्ड (यम शासित अशुभ अवधि), गुलिक काल (शनि की अशुभ अवधि), और चौघड़िया (शुभ/अशुभ समय खण्डों का चक्र) भी होते हैं। सूर्योदय और सूर्यास्त के समय भी आवश्यक हैं।',
    },
  },
  {
    id: 'q8_1_05', type: 'mcq',
    question: {
      en: 'For a marriage muhurta, which combination of Panchang elements is ideal?',
      hi: 'विवाह मुहूर्त हेतु पंचांग तत्वों का कौन-सा संयोग आदर्श है?',
    },
    options: [
      { en: 'Any nakshatra, Rikta tithi, Vishti karana, Saturday', hi: 'कोई भी नक्षत्र, रिक्ता तिथि, विष्टि करण, शनिवार' },
      { en: 'Shubha nakshatra, non-Rikta tithi, auspicious yoga, good vara (Mon/Wed/Thu/Fri), non-Vishti karana', hi: 'शुभ नक्षत्र, अ-रिक्ता तिथि, शुभ योग, अच्छा वार (सोम/बुध/गुरु/शुक्र), अ-विष्टि करण' },
      { en: 'Only check the nakshatra, ignore everything else', hi: 'केवल नक्षत्र देखें, बाकी सब अनदेखा करें' },
      { en: 'Vyatipata yoga with any other combination', hi: 'व्यतीपात योग किसी भी अन्य संयोग के साथ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A marriage muhurta requires all five elements to be favourable: a Shubha (auspicious) nakshatra like Rohini or Uttara Phalguni, a non-Rikta tithi (avoid 4th, 9th, 14th), an auspicious yoga (avoid Vyatipata, Vaidhriti), a benefic vara (Mon/Wed/Thu/Fri), and a non-Vishti karana.',
      hi: 'विवाह मुहूर्त में सभी पाँच तत्वों का शुभ होना आवश्यक है: शुभ नक्षत्र जैसे रोहिणी या उत्तरा फाल्गुनी, अ-रिक्ता तिथि (4, 9, 14वीं से बचें), शुभ योग (व्यतीपात, वैधृति से बचें), शुभ वार (सोम/बुध/गुरु/शुक्र), और अ-विष्टि करण।',
    },
  },
  {
    id: 'q8_1_06', type: 'true_false',
    question: {
      en: 'If four of the five Panchang elements are auspicious but the Karana is Vishti (Bhadra), the time window is still considered safe for important ceremonies.',
      hi: 'यदि पाँच में से चार पंचांग तत्व शुभ हों लेकिन करण विष्टि (भद्र) हो, तो समय खिड़की महत्वपूर्ण अनुष्ठानों के लिए सुरक्षित मानी जाती है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Vishti (Bhadra) karana is a strong prohibitive factor that can veto an otherwise auspicious window. Classical texts warn: "Even if all other elements are favourable, Bhadra on earth should be avoided for auspicious ceremonies." This is the "one critical flaw vetoes" principle.',
      hi: 'असत्य। विष्टि (भद्र) करण एक प्रबल निषेधात्मक कारक है जो अन्यथा शुभ खिड़की को भी निरस्त कर सकता है। शास्त्र कहते हैं: "भले ही अन्य सभी तत्व अनुकूल हों, पृथ्वी पर भद्र शुभ कर्मों हेतु वर्जित है।" यह "एक गम्भीर दोष निरस्त करता है" सिद्धान्त है।',
    },
  },
  {
    id: 'q8_1_07', type: 'mcq',
    question: {
      en: 'Which Panchang element is computed from the SUM of Sun and Moon longitudes?',
      hi: 'कौन-सा पंचांग तत्व सूर्य और चन्द्रमा के अंशों के योग से गणित होता है?',
    },
    options: [
      { en: 'Tithi', hi: 'तिथि' },
      { en: 'Nakshatra', hi: 'नक्षत्र' },
      { en: 'Yoga', hi: 'योग' },
      { en: 'Karana', hi: 'करण' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Yoga is the only Panchang element computed from the SUM of the Sun and Moon sidereal longitudes. Tithi uses the DIFFERENCE (elongation), Nakshatra uses the Moon alone, Karana is derived from Tithi, and Vara uses the Julian Day Number.',
      hi: 'योग एकमात्र पंचांग तत्व है जो सूर्य और चन्द्रमा के सायन अंशों के योग से गणित होता है। तिथि अन्तर (कोणीय दूरी), नक्षत्र केवल चन्द्रमा, करण तिथि से व्युत्पन्न, और वार जूलियन दिवस संख्या का उपयोग करता है।',
    },
  },
  {
    id: 'q8_1_08', type: 'true_false',
    question: {
      en: 'Rahu Kaal is one of the five Panchang limbs (angas).',
      hi: 'राहु काल पंचांग के पाँच अंगों (अंग) में से एक है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Rahu Kaal is NOT one of the five Panchang angas. The five limbs are Tithi, Vara, Nakshatra, Yoga, and Karana. Rahu Kaal is a supplementary inauspicious time period that is listed alongside the Panchang for practical muhurta use, but it is not structurally part of the five-limb system.',
      hi: 'असत्य। राहु काल पंचांग के पाँच अंगों में से नहीं है। पाँच अंग हैं: तिथि, वार, नक्षत्र, योग, और करण। राहु काल एक पूरक अशुभ अवधि है जो व्यावहारिक मुहूर्त उपयोग हेतु पंचांग के साथ सूचीबद्ध होती है, परन्तु यह संरचनात्मक रूप से पंच-अंग प्रणाली का भाग नहीं है।',
    },
  },
  {
    id: 'q8_1_09', type: 'mcq',
    question: {
      en: 'In the Panchang, what does each element uniquely measure?',
      hi: 'पंचांग में प्रत्येक तत्व विशिष्ट रूप से क्या मापता है?',
    },
    options: [
      { en: 'All five measure the same thing from different angles', hi: 'पाँचों एक ही चीज़ को विभिन्न कोणों से मापते हैं' },
      { en: 'Tithi: Moon-Sun angle; Vara: weekday; Nakshatra: Moon\'s star; Yoga: Sun+Moon sum; Karana: half-tithi', hi: 'तिथि: चन्द्र-सूर्य कोण; वार: सप्ताह का दिन; नक्षत्र: चन्द्रमा का तारा; योग: सूर्य+चन्द्र योग; करण: अर्ध-तिथि' },
      { en: 'They all measure planetary positions', hi: 'सभी ग्रह स्थितियाँ मापते हैं' },
      { en: 'They measure the 12 zodiac signs', hi: 'वे 12 राशियाँ मापते हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Each Panchang element captures a unique astronomical dimension: Tithi = Moon-Sun elongation (12° segments), Vara = day of the week (Julian Day mod 7), Nakshatra = Moon\'s sidereal position (13°20\u2032 segments), Yoga = Sun+Moon sidereal sum (13°20\u2032 segments), Karana = half-tithi (6° segments). Together they form a multi-dimensional time-quality matrix.',
      hi: 'प्रत्येक पंचांग तत्व एक अद्वितीय खगोलीय आयाम को पकड़ता है: तिथि = चन्द्र-सूर्य कोणीय दूरी (12° खण्ड), वार = सप्ताह का दिन (JD mod 7), नक्षत्र = चन्द्रमा की सायन स्थिति (13°20\u2032 खण्ड), योग = सूर्य+चन्द्र सायन योग (13°20\u2032 खण्ड), करण = अर्ध-तिथि (6° खण्ड)।',
    },
  },
  {
    id: 'q8_1_10', type: 'true_false',
    question: {
      en: 'The principle "no single bad element overrides all good" is universally true in muhurta selection — there are no exceptions.',
      hi: '"कोई एक बुरा तत्व सभी अच्छे तत्वों को निरस्त नहीं करता" यह सिद्धान्त मुहूर्त चयन में सर्वदा सत्य है — कोई अपवाद नहीं है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. While mild negative factors can be compensated by strong positive ones, certain critical flaws DO override everything else. Vishti (Bhadra) karana on earth and Vyatipata/Vaidhriti yoga are considered absolute vetoes for important ceremonies like marriage. The "one critical flaw vetoes" principle coexists with the general balancing approach.',
      hi: 'असत्य। जबकि हल्के नकारात्मक कारक प्रबल सकारात्मक कारकों से क्षतिपूर्ति हो सकते हैं, कुछ गम्भीर दोष सब कुछ निरस्त कर देते हैं। पृथ्वी पर विष्टि (भद्र) करण और व्यतीपात/वैधृति योग विवाह जैसे महत्वपूर्ण अनुष्ठानों के लिए पूर्ण निषेध माने जाते हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Panchang — The Five Limbs Working Together</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The word &quot;Panchang&quot; comes from Pancha (five) + Anga (limb). These five elements together form a multi-dimensional framework for assessing the quality of any given moment. Each limb captures a distinct astronomical reality: Tithi measures the Moon-Sun angular separation (the lunar phase), Vara identifies the weekday and its ruling planet, Nakshatra locates the Moon among the 27 stellar mansions, Yoga sums the Sun and Moon sidereal longitudes, and Karana divides the tithi into two halves for finer temporal resolution.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The genius of the Panchang system is that no single element tells the whole story. Tithi reveals the relationship between the two luminaries (waxing/waning energy). Vara colours the day with planetary flavour (Jupiter&apos;s wisdom on Thursday, Mars&apos;s aggression on Tuesday). Nakshatra indicates the Moon&apos;s stellar backdrop — which of 27 cosmic archetypes is active. Yoga captures the combined radiance of both luminaries. Karana adds the final layer of precision.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Together, these five elements create what modern systems would call a &quot;feature vector&quot; for time quality. A complete Panchang entry for any moment includes all five limbs plus supplementary data: Rahu Kaal (inauspicious Rahu period), Yamaganda (death-lord period), Gulika Kaal (Saturn&apos;s toxic period), and Choghadiya (alternating good/bad time blocks). Sunrise and sunset anchor the calculations, as the Vedic day begins at sunrise rather than midnight.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">Classical Origin</h4>
        <p className="text-text-secondary text-sm leading-relaxed">The five-limb Panchang system is described in the Surya Siddhanta (one of the oldest astronomical texts), codified in BPHS, and practically elaborated in Muhurta Chintamani, Dharmasindhu, and Nirnaya Sindhu. The Arthashastra of Kautilya (4th century BCE) references Panchang consultation for state decisions. Every Dharmashastra mandates that auspicious rituals (samskaras) must be performed only after verifying all five Panchang elements. This five-factor framework has remained unchanged for at least 2000 years — a testament to its coherence and practical utility.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>Reading a Panchang Entry — A Complete Walkthrough</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Consider a real Panchang entry: Thursday, Shukla Navami, Uttara Phalguni Nakshatra, Shubha Yoga, Taitila Karana. Let us evaluate each element. Vara: Thursday (Guruvara) — ruled by Jupiter, highly auspicious for ceremonies. Tithi: Shukla Navami (9th of bright half) — Navami is a Rikta tithi, somewhat unfavourable for new beginnings but acceptable for religious worship. Nakshatra: Uttara Phalguni — classified as &quot;Dhruva&quot; (fixed), excellent for marriages and permanent structures. Yoga: Shubha — the name means &quot;auspicious,&quot; one of the best yogas. Karana: Taitila — a Chara karana associated with worldly success, auspicious.</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Assessment: four of five elements are positive (Vara, Nakshatra, Yoga, Karana), while Tithi (Navami/Rikta) is the weak link. For a marriage, this is borderline — the astrologer might approve if the bride and groom&apos;s charts specifically benefit from Navami. For a business launch, the strong Jupiter energy (Thursday) and Shubha yoga make it favourable despite the Rikta tithi. Context matters.</p>
        <p className="text-text-secondary text-sm leading-relaxed">The supplementary elements add further nuance. If the chosen hour falls during Rahu Kaal, the astrologer shifts the time. Yamaganda and Gulika Kaal are similarly avoided. Choghadiya provides a quick-reference grid of good and bad periods through the day. The hierarchy of importance is generally: Nakshatra &gt; Tithi &gt; Yoga &gt; Vara &gt; Karana, but a strong negative in any element demands attention.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">Worked Examples</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 1 (Perfect window):</span> Thursday + Shukla Panchami (Nanda tithi, auspicious) + Pushya Nakshatra + Siddhi Yoga + Bava Karana. All five elements are favourable. Additionally, Thursday + Pushya = Sarvartha Siddhi Yoga. This is an exceptional muhurta for almost any positive activity — marriage, business, travel, education.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Example 2 (Vetoed window):</span> Wednesday + Shukla Saptami + Rohini Nakshatra + Dhruva Yoga + Vishti Karana. Four elements are excellent, but Vishti (Bhadra) karana is active. Despite the stellar combination, classical texts advise postponing the ceremony until Bhadra passes — typically 6 hours — and rechecking the Panchang at the new time.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Example 3 (Mixed assessment):</span> Tuesday + Krishna Ekadashi + Ashlesha Nakshatra + Parigha Yoga + Balava Karana. Tuesday is a malefic vara, Ashlesha is a Tikshna (sharp) nakshatra, and Parigha is an inauspicious yoga. However, Ekadashi is sacred (fasting day), and Balava karana is auspicious. This window is unsuitable for material ceremonies but excellent for spiritual practices, fasting, and meditation.</p>
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>The Muhurta Selection Algorithm</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">Muhurta selection integrates all five Panchang limbs into a decision framework. For a major ceremony like marriage, the classical requirements are: (1) Nakshatra must be a Shubha type — Rohini, Mrigashira, Magha, Uttara Phalguni, Hasta, Swati, Anuradha, Mula, Uttara Ashadha, Uttara Bhadrapada, or Revati. (2) Tithi must not be Rikta (4th, 9th, 14th) or Amavasya/Purnima for some ceremonies. Nanda (1st, 6th, 11th), Bhadra (2nd, 7th, 12th), and Jaya (3rd, 8th, 13th) tithis are preferred. (3) Yoga must be auspicious — avoid Vyatipata, Vaidhriti, Vishkambha, Atiganda, Shula, Ganda, Vyaghata, Vajra, and Parigha. (4) Vara should be Monday, Wednesday, Thursday, or Friday. (5) Karana must not be Vishti (Bhadra).</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">The balancing principle states: mild negatives can be compensated by strong positives. A slightly unfavourable yoga can be overridden by an excellent nakshatra and vara combination. However, certain elements act as absolute vetoes — Vishti karana on earth and Vyatipata/Vaidhriti yoga are &quot;hard stops&quot; that no amount of positivity in other elements can compensate. This dual principle — general balancing plus critical vetoes — is the heart of muhurta wisdom.</p>
        <p className="text-text-secondary text-sm leading-relaxed">Our Muhurta AI engine implements this logic computationally: it scans a time range, evaluates each moment on all five Panchang dimensions, applies bonuses for special combinations (Sarvartha Siddhi, Amrita Siddhi), applies penalties for inauspicious elements (Rahu Kaal, Vishti, Vyatipata), and ranks candidate windows by composite score. The algorithm respects the classical hierarchy while providing a transparent breakdown so users can understand exactly why a window was selected or rejected.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">Common Misconceptions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;Only Nakshatra and Tithi matter — the other three elements are filler.&quot; While Nakshatra and Tithi are the most weighted, Yoga and Karana carry real veto power. Vishti karana has ruined many otherwise perfect windows. Vara contributes both directly (day energy) and through compound yogas (Sarvartha Siddhi, Amrita Siddhi).</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Myth:</span> &quot;A Panchang is just a calendar.&quot; A calendar tells you the date. A Panchang tells you the cosmic quality of that date across five independent dimensions plus supplementary periods. Two adjacent days can have radically different Panchang profiles.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Myth:</span> &quot;Modern software has replaced traditional Panchang reading.&quot; Software computes the data, but interpretation requires understanding the classical weighting, activity-specific rules, and the interplay between elements. The algorithm encodes tradition, not replaces it.</p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">Modern Relevance</h4>
        <p className="text-text-secondary text-xs leading-relaxed">The Panchang remains the single most consulted astrological document in India. Over 80% of Hindu weddings are timed using Panchang-based muhurta selection. Businesses consult Panchang for launch dates, farmers for planting schedules, and temples for festival timing. Our app provides a fully computed Panchang with all five limbs, supplementary periods, and an AI-powered muhurta recommender — making this ancient five-dimensional time-quality system accessible to anyone, anywhere in the world.</p>
      </section>
    </div>
  );
}

export default function Module8_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

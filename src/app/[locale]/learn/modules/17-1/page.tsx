'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_17_1', phase: 5, topic: 'Muhurta', moduleNumber: '17.1',
  title: {
    en: 'Muhurta Selection — The Science of Timing',
    hi: 'मुहूर्त चयन — समय निर्धारण का विज्ञान',
  },
  subtitle: {
    en: 'Choosing auspicious moments by combining Panchang elements, planetary strength, lagna, and personal compatibility into a unified scoring system',
    hi: 'पंचांग तत्त्वों, ग्रह बल, लग्न और व्यक्तिगत अनुकूलता को एकीकृत अंकन पद्धति में संयोजित करके शुभ क्षणों का चयन',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 17-2: Muhurta for Marriage', hi: 'मॉड्यूल 17-2: विवाह मुहूर्त' }, href: '/learn/modules/17-2' },
    { label: { en: 'Module 17-3: Muhurta for Property & Travel', hi: 'मॉड्यूल 17-3: सम्पत्ति एवं यात्रा मुहूर्त' }, href: '/learn/modules/17-3' },
    { label: { en: 'Module 17-4: Muhurta for Education & Naming', hi: 'मॉड्यूल 17-4: शिक्षा एवं नामकरण मुहूर्त' }, href: '/learn/modules/17-4' },
    { label: { en: 'Muhurta AI Tool', hi: 'मुहूर्त AI उपकरण' }, href: '/muhurta-ai' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q17_1_01', type: 'mcq',
    question: {
      en: 'What is Muhurta in Vedic astrology?',
      hi: 'वैदिक ज्योतिष में मुहूर्त क्या है?',
    },
    options: [
      { en: 'A type of yoga combination', hi: 'एक प्रकार का योग संयोजन' },
      { en: 'Choosing an auspicious time to begin an important activity', hi: 'किसी महत्वपूर्ण कार्य को आरम्भ करने के लिए शुभ समय का चयन' },
      { en: 'A method of reading past lives', hi: 'पूर्वजन्म पढ़ने की विधि' },
      { en: 'A type of divisional chart', hi: 'एक प्रकार का वर्ग कुण्डली' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Muhurta is the science of selecting an auspicious time for starting important activities. The concept is that the time you BEGIN something creates a "birth chart" for that activity, influencing its outcome — just as your birth time shapes your natal chart.',
      hi: 'मुहूर्त महत्वपूर्ण कार्यों को आरम्भ करने के लिए शुभ समय चयन का विज्ञान है। अवधारणा यह है कि जिस समय आप कुछ आरम्भ करते हैं, वह उस कार्य की "जन्म कुण्डली" बनाता है, जो उसके परिणाम को प्रभावित करता है।',
    },
  },
  {
    id: 'q17_1_02', type: 'mcq',
    question: {
      en: 'Which 5 elements form the Panchang basis for Muhurta selection?',
      hi: 'मुहूर्त चयन के लिए पंचांग के कौन-से 5 तत्त्व आधार बनते हैं?',
    },
    options: [
      { en: 'Sun, Moon, Mars, Mercury, Jupiter', hi: 'सूर्य, चन्द्र, मंगल, बुध, बृहस्पति' },
      { en: 'Tithi, Nakshatra, Yoga, Karana, Vara (weekday)', hi: 'तिथि, नक्षत्र, योग, करण, वार' },
      { en: 'Lagna, Navamsha, Dashamsha, Hora, Drekkana', hi: 'लग्न, नवमांश, दशमांश, होरा, द्रेक्काण' },
      { en: 'Rahu Kaal, Yamaghanda, Gulika, Abhijit, Brahma', hi: 'राहु काल, यमघण्ट, गुलिक, अभिजित, ब्रह्मा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The five Panchang elements — Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon combination), Karana (half-tithi), and Vara (weekday) — form the primary assessment framework. Each element has shubha (auspicious) and ashubha (inauspicious) categories.',
      hi: 'पाँच पंचांग तत्त्व — तिथि, नक्षत्र, योग, करण और वार — प्राथमिक मूल्यांकन ढाँचा बनाते हैं। प्रत्येक तत्त्व में शुभ और अशुभ श्रेणियाँ हैं।',
    },
  },
  {
    id: 'q17_1_03', type: 'true_false',
    question: {
      en: 'In the Muhurta hierarchy, Nakshatra is considered more important than Tithi.',
      hi: 'मुहूर्त पदानुक्रम में नक्षत्र को तिथि से अधिक महत्वपूर्ण माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The classical hierarchy for Muhurta is: Nakshatra > Tithi > Yoga > Vara > Karana. The nakshatra at the time of starting an activity has the strongest influence. This is why most Muhurta consultations begin by identifying suitable nakshatras.',
      hi: 'सत्य। मुहूर्त का शास्त्रीय पदानुक्रम है: नक्षत्र > तिथि > योग > वार > करण। कार्य आरम्भ के समय का नक्षत्र सबसे प्रबल प्रभाव रखता है। इसलिए अधिकांश मुहूर्त परामर्श उपयुक्त नक्षत्रों की पहचान से आरम्भ होते हैं।',
    },
  },
  {
    id: 'q17_1_04', type: 'mcq',
    question: {
      en: 'Which of the following should be AVOIDED in Muhurta selection?',
      hi: 'मुहूर्त चयन में निम्नलिखित में से किससे बचना चाहिए?',
    },
    options: [
      { en: 'Pushya nakshatra', hi: 'पुष्य नक्षत्र' },
      { en: 'Rikta tithis, Vishti karana, and Rahu Kaal', hi: 'रिक्ता तिथियाँ, विष्टि करण और राहु काल' },
      { en: 'Shukla paksha', hi: 'शुक्ल पक्ष' },
      { en: 'Thursday', hi: 'गुरुवार' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rikta tithis (4th, 9th, 14th — called "empty"), Vishti (Bhadra) karana, Vyatipata/Vaidhriti yoga, and Rahu Kaal are the primary elements to avoid. These are considered inauspicious for initiating new activities.',
      hi: 'रिक्ता तिथियाँ (चतुर्थी, नवमी, चतुर्दशी — "खाली" कहलाती हैं), विष्टि (भद्रा) करण, व्यतीपात/वैधृति योग और राहु काल से मुख्य रूप से बचना चाहिए। ये नए कार्यों के आरम्भ के लिए अशुभ माने जाते हैं।',
    },
  },
  {
    id: 'q17_1_05', type: 'mcq',
    question: {
      en: 'Beyond the 5 Panchang elements, what additional factor is critical for Muhurta?',
      hi: 'पंचांग के 5 तत्त्वों के अतिरिक्त, मुहूर्त के लिए कौन-सा अतिरिक्त कारक महत्वपूर्ण है?',
    },
    options: [
      { en: 'The color of clothing worn', hi: 'पहने गए वस्त्रों का रंग' },
      { en: 'Lagna (rising sign at the event time)', hi: 'लग्न (कार्य के समय उदय राशि)' },
      { en: 'The native\'s age only', hi: 'केवल जातक की आयु' },
      { en: 'The direction of wind', hi: 'वायु की दिशा' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Lagna (ascendant) at the time of starting the activity is critical. It acts as the "birth chart" of the event. A strong lagna lord, benefic planets in kendras (1st, 4th, 7th, 10th), and the right lagna for the activity type are essential for a good Muhurta.',
      hi: 'कार्य आरम्भ के समय का लग्न महत्वपूर्ण है। यह कार्य की "जन्म कुण्डली" के रूप में कार्य करता है। लग्नेश का बलवान होना, केन्द्रों में शुभ ग्रह और कार्य के प्रकार के लिए उचित लग्न आवश्यक है।',
    },
  },
  {
    id: 'q17_1_06', type: 'true_false',
    question: {
      en: 'Vyatipata and Vaidhriti yogas are considered highly auspicious for starting new activities.',
      hi: 'व्यतीपात और वैधृति योग नए कार्यों के आरम्भ के लिए अत्यन्त शुभ माने जाते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Vyatipata and Vaidhriti are the two most inauspicious yogas among the 27 Panchang yogas. They are specifically avoided for all auspicious muhurtas. Vyatipata means "great calamity" and Vaidhriti means "obstruction."',
      hi: 'असत्य। व्यतीपात और वैधृति 27 पंचांग योगों में दो सर्वाधिक अशुभ योग हैं। इन्हें सभी शुभ मुहूर्तों में विशेष रूप से टाला जाता है। व्यतीपात का अर्थ है "महान विपत्ति" और वैधृति का अर्थ है "बाधा"।',
    },
  },
  {
    id: 'q17_1_07', type: 'mcq',
    question: {
      en: 'Our Muhurta AI engine scores each time window on a scale of:',
      hi: 'हमारा मुहूर्त AI इंजन प्रत्येक समय विंडो को किस पैमाने पर अंकित करता है?',
    },
    options: [
      { en: '1 to 5 stars', hi: '1 से 5 तारे' },
      { en: '0 to 100', hi: '0 से 100' },
      { en: 'Good / Bad only', hi: 'केवल अच्छा / बुरा' },
      { en: 'A to F grades', hi: 'A से F ग्रेड' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Our Muhurta AI engine scores each time window 0-100, combining four sub-scores: Panchang score (element quality), Transit score (current planetary strength), Timing score (hora, choghadiya), and Personal score (birth chart compatibility).',
      hi: 'हमारा मुहूर्त AI इंजन प्रत्येक समय विंडो को 0-100 अंकित करता है, चार उप-अंकों को संयोजित करते हुए: पंचांग अंक, गोचर अंक, समय अंक (होरा, चौघड़िया), और व्यक्तिगत अंक।',
    },
  },
  {
    id: 'q17_1_08', type: 'mcq',
    question: {
      en: 'What is the concept behind choosing a Muhurta?',
      hi: 'मुहूर्त चयन के पीछे क्या अवधारणा है?',
    },
    options: [
      { en: 'Superstition with no logical basis', hi: 'बिना तर्कसंगत आधार का अन्धविश्वास' },
      { en: 'The start time creates a birth chart for the activity itself', hi: 'आरम्भ समय कार्य की स्वयं की जन्म कुण्डली बनाता है' },
      { en: 'It only matters for weddings', hi: 'यह केवल विवाह के लिए महत्वपूर्ण है' },
      { en: 'Any time is equally good', hi: 'कोई भी समय समान रूप से अच्छा है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Just as a person\'s birth chart shapes their life, the moment you START an activity creates an "inception chart" for that event. A business started during good Muhurta has a strong inception chart, like a person born under favorable stars.',
      hi: 'जैसे किसी व्यक्ति की जन्म कुण्डली उनके जीवन को आकार देती है, वैसे ही जिस क्षण आप कोई कार्य आरम्भ करते हैं, वह उस कार्य की "आरम्भ कुण्डली" बनाता है। शुभ मुहूर्त में आरम्भ किया गया कार्य एक बलवान आरम्भ कुण्डली रखता है।',
    },
  },
  {
    id: 'q17_1_09', type: 'true_false',
    question: {
      en: 'Shubha (auspicious) nakshatras are preferred over all others for initiating new activities.',
      hi: 'नए कार्यों के आरम्भ के लिए शुभ नक्षत्रों को अन्य सभी से अधिक प्राथमिकता दी जाती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Nakshatras are classified as Dhruva (fixed/stable — good for permanent works), Chara (movable — good for travel), Kshipra (swift — good for quick tasks), Mridu (soft — good for arts), and Tikshna (sharp — good for fierce acts). Shubha nakshatras are chosen to match the activity type.',
      hi: 'सत्य। नक्षत्रों को ध्रुव (स्थिर — स्थायी कार्यों के लिए शुभ), चर (गतिशील — यात्रा के लिए), क्षिप्र (शीघ्र — त्वरित कार्यों के लिए), मृदु (कोमल — कलाओं के लिए), और तीक्ष्ण (तीव्र — उग्र कार्यों के लिए) में वर्गीकृत किया जाता है।',
    },
  },
  {
    id: 'q17_1_10', type: 'mcq',
    question: {
      en: 'The four sub-scores in our Muhurta AI scoring system are:',
      hi: 'हमारी मुहूर्त AI अंकन प्रणाली में चार उप-अंक हैं:',
    },
    options: [
      { en: 'Sun, Moon, Mars, Jupiter scores', hi: 'सूर्य, चन्द्र, मंगल, बृहस्पति अंक' },
      { en: 'Panchang, Transit, Timing, Personal', hi: 'पंचांग, गोचर, समय, व्यक्तिगत' },
      { en: 'Lagna, Navamsha, Dasha, Yoga', hi: 'लग्न, नवमांश, दशा, योग' },
      { en: 'Physical, Mental, Spiritual, Material', hi: 'शारीरिक, मानसिक, आध्यात्मिक, भौतिक' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Our engine combines: Panchang score (quality of tithi, nakshatra, yoga, karana, vara), Transit score (current planetary positions and strength), Timing score (hora ruler, choghadiya period), and Personal score (compatibility with the native\'s birth chart).',
      hi: 'हमारा इंजन संयोजित करता है: पंचांग अंक (तिथि, नक्षत्र, योग, करण, वार की गुणवत्ता), गोचर अंक (वर्तमान ग्रह स्थिति और बल), समय अंक (होरा स्वामी, चौघड़िया), और व्यक्तिगत अंक (जातक की जन्म कुण्डली से अनुकूलता)।',
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
          Muhurta — Why the Start Time Matters
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Muhurta is the branch of Jyotish devoted to selecting auspicious times for important activities — marriage, business launch, house entry, travel, education. The core principle: the moment you START something creates a &ldquo;birth chart&rdquo; for that activity. Just as your natal chart shapes your life patterns, the inception chart of an activity shapes its trajectory.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          The five Panchang elements form the primary filter: Tithi (lunar day), Nakshatra (lunar mansion), Yoga (Sun-Moon angular combination), Karana (half-tithi), and Vara (weekday). Each has inherently auspicious and inauspicious categories. Beyond these five, the Lagna (rising sign at the event time) and current planetary strengths add crucial layers of analysis.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          The classical hierarchy of importance is: Nakshatra &gt; Tithi &gt; Yoga &gt; Vara &gt; Karana. This means the nakshatra at the time of starting has the strongest influence. A good nakshatra can partially compensate for a mediocre tithi, but a bad nakshatra undermines even the best tithi. This hierarchy guides how our scoring algorithm weights each factor.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">The Inception Chart Concept</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          Think of Muhurta like choosing the &ldquo;birthday&rdquo; of your project. A company registered under Pushya nakshatra with strong Jupiter in the lagna has a chart that favours growth, nourishment, and expansion. The same company registered during Rahu Kaal with Vishti karana has a chart riddled with delays and obstacles. The Muhurta IS the natal chart of the endeavour.
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
          General Rules of Muhurta Selection
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Elements to AVOID in any Muhurta: Rikta tithis (Chaturthi/4th, Navami/9th, Chaturdashi/14th — called &ldquo;empty&rdquo;). Vishti (Bhadra) karana — the most inauspicious karana. Vyatipata and Vaidhriti yogas — the two &ldquo;disaster&rdquo; yogas. Rahu Kaal — the daily period ruled by Rahu. Amavasya (new moon) for most activities.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Elements to PREFER: Shubha nakshatras appropriate to the activity type. Strong lagna lord (not debilitated, combust, or in dusthana). Benefic planets (Jupiter, Venus, Mercury, Moon) in kendras (1st, 4th, 7th, 10th). Waxing Moon (Shukla paksha generally preferred). The hora (planetary hour) matching the activity type.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          Nakshatras are classified by activity type: Dhruva (fixed — Rohini, Uttara Phalguni, Uttara Ashadha, Uttarabhadrapada) for permanent works like house construction. Kshipra (swift — Ashwini, Pushya, Hasta) for quick tasks. Mridu (soft — Mrigashira, Chitra, Anuradha, Revati) for arts, relationships. Tikshna (sharp — Ardra, Ashlesha, Jyeshtha, Mula) for surgery, warfare, fierce acts. Matching nakshatra type to activity type is the first step.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">Lagna Selection</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          The lagna changes every ~2 hours, so it is the most precise timing tool. For marriage: 2nd, 7th, or 11th house lagna. For business: 1st, 10th, or 11th. For education: 2nd or 5th. For travel: 3rd or 9th. The lagna lord must be strong — not debilitated, combust, or retrograde — and ideally placed in a kendra or trikona.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          Additionally, no malefic planets (Saturn, Mars, Rahu, Ketu) should occupy the 8th house of the Muhurta chart. Jupiter aspecting the lagna or Moon is always beneficial. These lagna-level rules fine-tune the Muhurta within the broader Panchang framework.
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
          The Multi-Factor Scoring Approach
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          Our Muhurta AI engine implements a comprehensive scoring system that evaluates each potential time window across four dimensions, combining them into a single 0-100 score.
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          This multi-factor approach ensures that no single bad element can hide behind good ones. A time window needs consistent quality across all dimensions to score highly. The result is a ranked list of time windows, colour-coded by quality, that the user can choose from with confidence.
        </p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">The Four Scoring Dimensions</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Panchang Score:</span> Evaluates the quality of tithi, nakshatra, yoga, karana, and vara at the given time. Each element is rated shubha/ashubha per classical rules. Activity-specific nakshatra matching adds bonus points.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Transit Score:</span> Assesses current planetary strength — are benefics strong? Are malefics contained? Is the relevant house lord well-placed? This captures the broader celestial weather.</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2"><span className="text-gold-light font-medium">Timing Score:</span> Checks the hora ruler (planetary hour) and choghadiya period. A business started during Jupiter hora scores higher than one during Saturn hora. Amrit and Shubha choghadiyas add points.</p>
        <p className="text-text-secondary text-xs leading-relaxed"><span className="text-gold-light font-medium">Personal Score:</span> When the user provides birth details, the engine checks Tara Bala (star strength from birth nakshatra), Chandrabala (Moon position from natal Moon), and Disha Shool (directional defect). This personalizes the Muhurta to the individual.</p>
      </section>
      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">Score Interpretation</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Scores above 75 indicate excellent Muhurta windows suitable for major events. Scores 50-75 are acceptable for routine activities. Scores below 50 should be avoided for important initiations. In practice, most days have a few high-scoring windows (often early morning or specific evening hours) and several low-scoring periods (particularly during Rahu Kaal and Vishti karana). The engine supports 20 activity types with activity-specific weightings.
        </p>
      </section>
    </div>
  );
}

export default function Module17_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

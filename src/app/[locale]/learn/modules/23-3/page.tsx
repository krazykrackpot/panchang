'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_23_3', phase: 10, topic: 'Prediction', moduleNumber: '23.3',
  title: { en: 'Chakra Systems — Sarvatobhadra & Kota', hi: 'चक्र प्रणालियाँ — सर्वतोभद्र और कोटा' },
  subtitle: { en: 'Grid-based predictive tools for transit analysis and vedha', hi: 'गोचर विश्लेषण और वेध के लिए ग्रिड-आधारित भविष्यवाणी उपकरण' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 23.1: Eclipse Prediction', hi: 'मॉड्यूल 23.1: ग्रहण भविष्यवाणी' }, href: '/learn/modules/23-1' },
    { label: { en: 'Module 23.4: Sphutas & Sensitive Points', hi: 'मॉड्यूल 23.4: स्फुट और संवेदनशील बिन्दु' }, href: '/learn/modules/23-4' },
    { label: { en: 'Module 23.5: Prashna Yogas', hi: 'मॉड्यूल 23.5: प्रश्न योग' }, href: '/learn/modules/23-5' },
    { label: { en: 'Generate Kundali', hi: 'कुण्डली बनाएँ' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q23_3_01', type: 'mcq',
    question: { en: 'What is the Sarvatobhadra Chakra?', hi: 'सर्वतोभद्र चक्र क्या है?' },
    options: [
      { en: 'A 12-house birth chart layout', hi: '12 भावों का जन्म कुण्डली विन्यास' },
      { en: 'A 9x9 grid mapping vowels, consonants, nakshatras, tithis, and varas', hi: 'स्वर, व्यंजन, नक्षत्र, तिथि और वार को मैप करने वाली 9×9 ग्रिड' },
      { en: 'A circular diagram of planetary orbits', hi: 'ग्रहीय कक्षाओं का वृत्ताकार आरेख' },
      { en: 'A table of planetary dignities', hi: 'ग्रहीय गरिमाओं की तालिका' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The Sarvatobhadra Chakra is a comprehensive 9x9 grid that maps Sanskrit vowels, consonants, the 27 nakshatras, 30 tithis, and 7 varas (weekdays) into a single diagram. It is used primarily for Vedha (obstruction) analysis in transit predictions.', hi: 'सर्वतोभद्र चक्र एक व्यापक 9×9 ग्रिड है जो संस्कृत स्वरों, व्यंजनों, 27 नक्षत्रों, 30 तिथियों और 7 वारों (सप्ताह के दिनों) को एक आरेख में मैप करती है। इसका उपयोग मुख्य रूप से गोचर भविष्यवाणियों में वेध (अवरोध) विश्लेषण के लिए होता है।' },
  },
  {
    id: 'q23_3_02', type: 'mcq',
    question: { en: 'What is "Vedha" in the context of Sarvatobhadra Chakra?', hi: 'सर्वतोभद्र चक्र के सन्दर्भ में "वेध" क्या है?' },
    options: [
      { en: 'A type of planetary dignity', hi: 'ग्रहीय गरिमा का एक प्रकार' },
      { en: 'An obstruction created when a transiting planet hits a row/column of your birth nakshatra', hi: 'जब गोचर ग्रह आपके जन्म नक्षत्र की पंक्ति/स्तम्भ से टकराता है तब उत्पन्न अवरोध' },
      { en: 'A benefic yoga between Jupiter and Venus', hi: 'बृहस्पति और शुक्र के बीच शुभ योग' },
      { en: 'The combustion of a planet', hi: 'ग्रह का अस्त होना' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Vedha means "piercing" or "obstruction." In the Sarvatobhadra Chakra, when a transiting malefic planet occupies a position that lies on the same row or column as your birth nakshatra, it creates vedha — an obstruction or challenge in that life area. Benefic vedha from Jupiter or Venus creates support.', hi: 'वेध का अर्थ "छेदना" या "अवरोध" है। सर्वतोभद्र चक्र में, जब कोई गोचर पाप ग्रह ऐसी स्थिति में हो जो आपके जन्म नक्षत्र की पंक्ति या स्तम्भ पर हो, तो यह वेध — उस जीवन क्षेत्र में अवरोध या चुनौती बनाता है। बृहस्पति या शुक्र का शुभ वेध सहायता प्रदान करता है।' },
  },
  {
    id: 'q23_3_03', type: 'true_false',
    question: { en: 'The Kota Chakra has 4 layers representing different levels of personal impact.', hi: 'कोटा चक्र में 4 परतें हैं जो व्यक्तिगत प्रभाव के विभिन्न स्तरों का प्रतिनिधित्व करती हैं।' },
    correctAnswer: true,
    explanation: { en: 'The Kota Chakra is a "fort" diagram with 4 concentric layers: Stambha (pillar/innermost), Madhya (middle), Praakara (wall), and Bahya (outer). Planets transiting your Stambha layer have the most direct personal impact, while those in the Bahya layer affect external circumstances.', hi: 'कोटा चक्र 4 संकेन्द्रित परतों वाला "किला" आरेख है: स्तम्भ (खम्भा/अन्तरतम), मध्य (बीच), प्राकार (दीवार), और बाह्य (बाहरी)। आपकी स्तम्भ परत से गोचर करने वाले ग्रहों का सबसे प्रत्यक्ष व्यक्तिगत प्रभाव होता है, जबकि बाह्य परत वाले बाहरी परिस्थितियों को प्रभावित करते हैं।' },
  },
  {
    id: 'q23_3_04', type: 'mcq',
    question: { en: 'In the Kota Chakra, which layer represents the most direct personal impact?', hi: 'कोटा चक्र में, कौन सी परत सबसे प्रत्यक्ष व्यक्तिगत प्रभाव दर्शाती है?' },
    options: [
      { en: 'Bahya (outer)', hi: 'बाह्य (बाहरी)' },
      { en: 'Praakara (wall)', hi: 'प्राकार (दीवार)' },
      { en: 'Madhya (middle)', hi: 'मध्य (बीच)' },
      { en: 'Stambha (pillar/innermost)', hi: 'स्तम्भ (खम्भा/अन्तरतम)' },
    ],
    correctAnswer: 3,
    explanation: { en: 'Stambha (the pillar or innermost layer) represents the core of the fort — the most personal area. When a planet transits through your Stambha layer, the impact is felt most directly and personally. A malefic in the Stambha layer = direct personal challenge; a benefic = direct personal blessing.', hi: 'स्तम्भ (खम्भा या अन्तरतम परत) किले के केन्द्र — सबसे व्यक्तिगत क्षेत्र का प्रतिनिधित्व करती है। जब कोई ग्रह आपकी स्तम्भ परत से गोचर करता है, तो प्रभाव सबसे प्रत्यक्ष और व्यक्तिगत रूप से अनुभव होता है। स्तम्भ परत में पाप ग्रह = प्रत्यक्ष व्यक्तिगत चुनौती; शुभ ग्रह = प्रत्यक्ष व्यक्तिगत आशीर्वाद।' },
  },
  {
    id: 'q23_3_05', type: 'mcq',
    question: { en: 'What determines which Kota Chakra layer you are on?', hi: 'आप कोटा चक्र की किस परत पर हैं, यह क्या निर्धारित करता है?' },
    options: [
      { en: 'Your Sun sign', hi: 'आपकी सूर्य राशि' },
      { en: 'Your Lagna (ascendant)', hi: 'आपका लग्न' },
      { en: 'Your birth nakshatra', hi: 'आपका जन्म नक्षत्र' },
      { en: 'Your Moon sign', hi: 'आपकी चन्द्र राशि' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Your birth nakshatra (Janma Nakshatra — the nakshatra occupied by the Moon at birth) determines which layer of the Kota Chakra you belong to. The 27 nakshatras are distributed across the 4 layers, and your personal layer defines how transiting planets affect you.', hi: 'आपका जन्म नक्षत्र (जन्म नक्षत्र — जन्म के समय चन्द्रमा जिस नक्षत्र में था) निर्धारित करता है कि आप कोटा चक्र की किस परत पर हैं। 27 नक्षत्र 4 परतों में वितरित हैं, और आपकी व्यक्तिगत परत परिभाषित करती है कि गोचर ग्रह आपको कैसे प्रभावित करते हैं।' },
  },
  {
    id: 'q23_3_06', type: 'true_false',
    question: { en: 'A malefic planet breaching from the outer to inner layers of the Kota Chakra indicates increasing challenge.', hi: 'कोटा चक्र की बाहरी से भीतरी परतों में प्रवेश करता पाप ग्रह बढ़ती चुनौती दर्शाता है।' },
    correctAnswer: true,
    explanation: { en: 'Just as an invading army breaching a fort\'s walls represents increasing danger, a malefic transiting from the Bahya (outer) toward the Stambha (inner) layer indicates progressively greater personal challenge. The reverse — moving outward — shows the challenge is receding.', hi: 'जैसे किले की दीवारों को तोड़ती आक्रमणकारी सेना बढ़ते खतरे का प्रतिनिधित्व करती है, बाह्य (बाहरी) से स्तम्भ (भीतरी) परत की ओर गोचर करता पाप ग्रह उत्तरोत्तर बड़ी व्यक्तिगत चुनौती दर्शाता है। विपरीत — बाहर की ओर जाना — दर्शाता है कि चुनौती घट रही है।' },
  },
  {
    id: 'q23_3_07', type: 'mcq',
    question: { en: 'What is the Surya-Kalanala Chakra used for?', hi: 'सूर्य-कालानल चक्र किसके लिए उपयोग होता है?' },
    options: [
      { en: 'Calculating planetary periods (dashas)', hi: 'ग्रहीय अवधियों (दशाओं) की गणना' },
      { en: 'Timing monthly predictions based on the Sun\'s nakshatra transit', hi: 'सूर्य के नक्षत्र गोचर पर आधारित मासिक भविष्यवाणियों का समय' },
      { en: 'Computing birth chart houses', hi: 'जन्म कुण्डली भावों की गणना' },
      { en: 'Determining marriage compatibility', hi: 'विवाह अनुकूलता निर्धारित करना' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The Surya-Kalanala Chakra is a "fire-wheel" diagram used for timing monthly predictions. It maps the Sun\'s transit through each nakshatra and identifies which birth nakshatras receive vedha (obstruction) during that month. When the Sun transits a nakshatra that creates vedha on yours, that month brings challenges.', hi: 'सूर्य-कालानल चक्र मासिक भविष्यवाणियों के समय के लिए उपयोग होने वाला "अग्नि-चक्र" आरेख है। यह प्रत्येक नक्षत्र से सूर्य के गोचर को मैप करता है और पहचानता है कि उस महीने किन जन्म नक्षत्रों को वेध (अवरोध) प्राप्त होता है। जब सूर्य ऐसे नक्षत्र से गोचर करता है जो आपके पर वेध बनाता है, तो वह महीना चुनौतियाँ लाता है।' },
  },
  {
    id: 'q23_3_08', type: 'true_false',
    question: { en: 'The Sarvatobhadra Chakra includes Sanskrit vowels and consonants in its grid structure.', hi: 'सर्वतोभद्र चक्र में अपनी ग्रिड संरचना में संस्कृत स्वर और व्यंजन शामिल हैं।' },
    correctAnswer: true,
    explanation: { en: 'The Sarvatobhadra Chakra uniquely maps Sanskrit phonemes (vowels and consonants) alongside nakshatras, tithis, and varas. This connects the name-sound (Nama-akshar) to celestial positions, enabling name-based predictions through vedha analysis.', hi: 'सर्वतोभद्र चक्र अद्वितीय रूप से संस्कृत ध्वनियों (स्वर और व्यंजन) को नक्षत्रों, तिथियों और वारों के साथ मैप करता है। यह नाम-ध्वनि (नामाक्षर) को आकाशीय स्थितियों से जोड़ता है, वेध विश्लेषण के माध्यम से नाम-आधारित भविष्यवाणियाँ सक्षम करता है।' },
  },
  {
    id: 'q23_3_09', type: 'mcq',
    question: { en: 'In the Kota Chakra, the "Praakara" layer represents:', hi: 'कोटा चक्र में, "प्राकार" परत किसका प्रतिनिधित्व करती है?' },
    options: [
      { en: 'The innermost core of personal identity', hi: 'व्यक्तिगत पहचान का अन्तरतम केन्द्र' },
      { en: 'The protective wall — external protection and social support', hi: 'रक्षात्मक दीवार — बाहरी सुरक्षा और सामाजिक सहायता' },
      { en: 'The outermost worldly circumstances', hi: 'बाहरी सबसे सांसारिक परिस्थितियाँ' },
      { en: 'The middle zone between self and world', hi: 'आत्म और संसार के बीच मध्य क्षेत्र' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Praakara literally means "wall" or "rampart." In the Kota Chakra, it represents the protective layer — your external support systems, social networks, and defensive structures. Benefics transiting the Praakara strengthen your defenses; malefics weaken them.', hi: 'प्राकार का शाब्दिक अर्थ "दीवार" या "प्राचीर" है। कोटा चक्र में, यह रक्षात्मक परत — आपकी बाहरी सहायता प्रणालियों, सामाजिक नेटवर्क और रक्षात्मक संरचनाओं का प्रतिनिधित्व करती है। प्राकार से गोचर करते शुभ ग्रह आपकी रक्षा मजबूत करते हैं; पाप ग्रह कमजोर करते हैं।' },
  },
  {
    id: 'q23_3_10', type: 'mcq',
    question: { en: 'How does our engine use the Sarvatobhadra Chakra?', hi: 'हमारा इंजन सर्वतोभद्र चक्र का उपयोग कैसे करता है?' },
    options: [
      { en: 'It ignores chakra systems entirely', hi: 'यह चक्र प्रणालियों को पूर्णतः अनदेखा करता है' },
      { en: 'It manually draws the chart for the user to interpret', hi: 'यह उपयोगकर्ता की व्याख्या के लिए चार्ट मैन्युअली बनाता है' },
      { en: 'It pre-computes vedha relationships automatically', hi: 'यह स्वचालित रूप से वेध सम्बन्धों की पूर्व-गणना करता है' },
      { en: 'It only uses the chart for name-based predictions', hi: 'यह चार्ट का उपयोग केवल नाम-आधारित भविष्यवाणियों के लिए करता है' },
    ],
    correctAnswer: 2,
    explanation: { en: 'Our engine pre-computes vedha relationships from the Sarvatobhadra Chakra, determining which transiting planets create obstructions or support for each birth nakshatra. This automated analysis removes the need for manual chart reading.', hi: 'हमारा इंजन सर्वतोभद्र चक्र से वेध सम्बन्धों की स्वचालित पूर्व-गणना करता है, यह निर्धारित करता है कि कौन से गोचर ग्रह प्रत्येक जन्म नक्षत्र के लिए अवरोध या सहायता बनाते हैं। यह स्वचालित विश्लेषण मैन्युअल चार्ट पठन की आवश्यकता समाप्त करता है।' },
  },
];

/* ─── Page 1: Sarvatobhadra Chakra ─────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सर्वतोभद्र चक्र — सर्वशुभ ग्रिड' : 'Sarvatobhadra Chakra — The All-Auspicious Grid'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सर्वतोभद्र चक्र वैदिक ज्योतिष में सबसे परिष्कृत भविष्यवाणी उपकरणों में से एक है। यह 9×9 ग्रिड (81 कोष्ठ) है जो पाँच प्रणालियों को एक साथ मैप करती है: संस्कृत स्वर, संस्कृत व्यंजन, 27 नक्षत्र, 30 तिथियाँ और 7 वार। इन सभी को एक आरेख में रखकर, यह वेध (अवरोध) विश्लेषण के माध्यम से छिपे सम्बन्ध प्रकट करती है।</> : <>The Sarvatobhadra Chakra is one of the most sophisticated predictive tools in Vedic astrology. It is a 9x9 grid (81 cells) that maps together five systems: Sanskrit vowels, Sanskrit consonants, the 27 nakshatras, the 30 tithis, and the 7 varas (weekdays). By placing all these in a single diagram, it reveals hidden connections through Vedha (obstruction) analysis.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'वेध कैसे काम करता है' : 'How Vedha Works'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रत्येक नक्षत्र 9×9 ग्रिड में एक विशिष्ट स्थान रखता है। जब कोई गोचर पाप ग्रह (शनि, मंगल, राहु, केतु, या सूर्य) ऐसे नक्षत्र में होता है जो आपके जन्म नक्षत्र के साथ पंक्ति या स्तम्भ साझा करता है, तो यह वेध — &quot;छेदन&quot; या अवरोध बनाता है। यह उस नक्षत्र से जुड़े जीवन क्षेत्रों में बाधाएँ और चुनौतियाँ दर्शाता है।</> : <>Each nakshatra occupies a specific position in the 9x9 grid. When a transiting malefic planet (Saturn, Mars, Rahu, Ketu, or Sun) occupies a nakshatra that shares a row or column with your birth nakshatra, it creates a Vedha — a &quot;piercing&quot; or obstruction. This indicates obstacles and challenges in the life areas connected to that nakshatra.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'शुभ वेध' : 'Benefic Vedha'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>जब बृहस्पति, शुक्र, चन्द्र (शुक्ल पक्ष), या बुध (अपीड़ित) ऐसे नक्षत्र से गोचर करता है जो आपके जन्म नक्षत्र पर वेध बनाता है, तो प्रभाव सकारात्मक होता है — सहायता, अवसर और शुभ विकास। वही ज्यामितीय सम्बन्ध जो पाप ग्रहों से चुनौती दर्शाता है, शुभ ग्रहों से आशीर्वाद दर्शाता है।</> : <>When Jupiter, Venus, Moon (waxing), or Mercury (unafflicted) transits a nakshatra creating vedha on your birth nakshatra, the effect is positive — support, opportunity, and auspicious developments. The same geometric relationship that shows challenge from malefics shows blessing from benefics.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'नाम सम्बन्ध' : 'Name Connection'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ग्रिड में संस्कृत स्वरों और व्यंजनों का समावेश आपके नाम के प्रथम अक्षर (नामाक्षर) को विशिष्ट नक्षत्रों से जोड़ता है। इसका अर्थ है कि सटीक जन्म समय के बिना भी, सर्वतोभद्र चक्र के माध्यम से व्यक्ति के नाम का उपयोग गोचर भविष्यवाणियों के लिए किया जा सकता है — नाम अपना स्वयं का आकाशीय हस्ताक्षर वहन करता है।</> : <>The inclusion of Sanskrit vowels and consonants in the grid connects your name&apos;s first syllable (Nama-akshar) to specific nakshatras. This means even without a precise birth time, a person&apos;s name can be used for transit predictions through the Sarvatobhadra Chakra — the name carries its own celestial signature.</>}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'व्युत्पत्ति' : 'Etymology'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>&quot;सर्वतोभद्र&quot; का अर्थ है &quot;सभी दिशाओं से शुभ&quot; — ग्रिड किसी भी दिशा (ऊपर, नीचे, बाएँ, दाएँ, तिरछे) से पढ़ने के लिए डिज़ाइन की गई है। यह बहु-दिशात्मक पठन क्षमता इसे प्रतीत होने वाले असम्बन्धित ज्योतिषीय कारकों के बीच छिपे सम्बन्धों की पहचान के लिए अद्वितीय रूप से शक्तिशाली बनाती है।</> : <>&quot;Sarvatobhadra&quot; means &quot;auspicious from all sides&quot; — the grid is designed to be read from any direction (top, bottom, left, right, diagonal). This multi-directional reading capability makes it uniquely powerful for identifying hidden relationships between seemingly unrelated astrological factors.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Kota Chakra ──────────────────────────────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'कोटा चक्र — किलेबन्द आरेख' : 'Kota Chakra — The Fortified Diagram'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>कोटा चक्र ग्रहीय गोचरों को एक किले पर आक्रमण करती (या रक्षा करती) सेना के रूप में दृश्य बनाता है। आपका जन्म नक्षत्र आपको चार संकेन्द्रित परतों में से एक में रखता है। इन परतों से गोचर करते ग्रह आपके व्यक्तिगत केन्द्र की ओर आती या पीछे हटती शक्तियों का प्रतिनिधित्व करते हैं।</> : <>The Kota Chakra visualizes planetary transits as an army approaching (or defending) a fort. Your birth nakshatra places you in one of four concentric layers. Planets transiting through these layers represent forces approaching or receding from your personal center.</>}</p>

        <div className="space-y-3">
          <div className="glass-card rounded-lg p-3 border border-red-500/10">
            <p className="text-red-400 font-bold text-sm">{isHi ? 'चार परतें' : 'The Four Layers'}</p>
            <div className="text-text-secondary text-xs mt-2 space-y-2">{isHi ? <><p><strong className="text-gold-light">स्तम्भ (खम्भा/अन्तरतम):</strong> आपका व्यक्तिगत केन्द्र — पहचान, स्वास्थ्य, जीवनशक्ति। यहाँ ग्रह सीधे प्रभावित करते हैं। स्तम्भ में पाप ग्रह = प्रत्यक्ष व्यक्तिगत संकट। शुभ ग्रह = प्रत्यक्ष व्यक्तिगत आशीर्वाद और रक्षा।</p>
              <p><strong className="text-gold-light">मध्य (बीच):</strong> आपका तात्कालिक वातावरण — परिवार, निकट सम्बन्ध, दैनिक जीवन। यहाँ गोचर आपके अन्तरंग वृत्त और भावनात्मक संसार को प्रभावित करते हैं।</p>
              <p><strong className="text-gold-light">प्राकार (दीवार):</strong> आपकी रक्षात्मक संरचनाएँ — सामाजिक सहायता, व्यावसायिक नेटवर्क, समुदाय। शुभ ग्रह यहाँ आपकी रक्षा मजबूत करते हैं; पाप ग्रह उसे तोड़ते हैं।</p>
              <p><strong className="text-gold-light">बाह्य (बाहरी):</strong> बाहरी परिस्थितियाँ — समाज, राजनीति, विश्व घटनाएँ। ये वातावरण के माध्यम से अप्रत्यक्ष रूप से प्रभावित करती हैं।</p></> : <><p><strong className="text-gold-light">Stambha (Pillar/Innermost):</strong> Your personal core — identity, health, vitality. Planets here hit you directly. A malefic in Stambha = direct personal crisis. A benefic = direct personal blessing and protection.</p>
              <p><strong className="text-gold-light">Madhya (Middle):</strong> Your immediate environment — family, close relationships, daily life. Transits here affect your inner circle and emotional world.</p>
              <p><strong className="text-gold-light">Praakara (Wall):</strong> Your protective structures — social support, professional network, community. Benefics here strengthen your defenses; malefics breach them.</p>
              <p><strong className="text-gold-light">Bahya (Outer):</strong> External circumstances — society, politics, world events. These affect you indirectly through the environment.</p></>}</div>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'गति का पठन' : 'Reading the Movement'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>कोटा चक्र व्याख्या की कुंजी गति की दिशा है। भीतर जाता पाप ग्रह (बाह्य → प्राकार → मध्य → स्तम्भ) = बढ़ती चुनौती, जैसे शत्रु किले की दीवारें तोड़ रहा हो। बाहर जाता पाप ग्रह = चुनौती घट रही है। भीतर जाता शुभ ग्रह = बढ़ता आशीर्वाद, जैसे सुदृढ़ीकरण केन्द्र पर पहुँच रहा हो।</> : <>The key to Kota Chakra interpretation is direction of movement. A malefic moving inward (Bahya → Praakara → Madhya → Stambha) = increasing challenge, like an enemy breaching fort walls. A malefic moving outward = challenge receding. A benefic moving inward = increasing blessings, like reinforcements arriving at the center.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-light text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'किला रूपक' : 'Fort Metaphor'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>किला रूपक गहराई से सहज है: स्तम्भ राजा का कक्ष है, मध्य आन्तरिक प्रांगण है, प्राकार किले की दीवार है, और बाह्य बाहर का भूमि है। शुभ ग्रह मित्र हैं; पाप ग्रह आक्रमणकारी। आपके &quot;किले&quot; (आपकी कुण्डली की समग्र शुभ शक्ति) की ताकत निर्धारित करती है कि आप घेराबन्दी का कितनी अच्छी तरह सामना करते हैं।</> : <>The fort metaphor is deeply intuitive: Stambha is the king&apos;s chamber, Madhya is the inner courtyard, Praakara is the fortress wall, and Bahya is the land outside. Benefic planets are allies; malefic planets are invaders. The strength of your &quot;fort&quot; (your chart&apos;s overall benefic strength) determines how well you withstand the siege.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Surya-Kalanala Chakra & Practical Application ────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सूर्य-कालानल चक्र और व्यावहारिक अनुप्रयोग' : 'Surya-Kalanala Chakra & Practical Application'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>सूर्य-कालानल चक्र मासिक समय भविष्यवाणियों के लिए विशेष रूप से डिज़ाइन किया गया &quot;अग्नि-चक्र&quot; आरेख है। यह प्रत्येक नक्षत्र से सूर्य के गोचर को ट्रैक करता है और पहचानता है कि प्रत्येक सौर मास में कौन से जन्म नक्षत्र प्रभावित होते हैं।</> : <>The Surya-Kalanala Chakra is a &quot;fire-wheel&quot; diagram specifically designed for monthly timing predictions. It tracks the Sun&apos;s transit through each nakshatra and identifies which birth nakshatras are affected during each solar month.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'मासिक भविष्यवाणी विधि' : 'Monthly Prediction Method'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>सूर्य प्रत्येक ~13.3 दिनों में लगभग एक नक्षत्र का गोचर करता है। जैसे-जैसे यह प्रत्येक नक्षत्र से गुजरता है, सूर्य-कालानल चक्र पहचानता है कि कौन से अन्य नक्षत्र वेध प्राप्त करते हैं। यदि सूर्य ऐसे नक्षत्र से गोचर करता है जो आपके जन्म नक्षत्र पर वेध बनाता है, तो वह ~13-दिन की अवधि सौर चुनौतियाँ — अधिकार के मुद्दे, स्वास्थ्य चिन्ता, या अहं संघर्ष लाती है।</> : <>The Sun transits approximately one nakshatra every ~13.3 days. As it moves through each nakshatra, the Surya-Kalanala Chakra identifies which other nakshatras receive vedha. If the Sun transits a nakshatra that creates vedha on your birth nakshatra, that ~13-day period brings solar challenges — authority issues, health concerns, or ego conflicts.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'तीनों चक्रों का संयोजन' : 'Combining All Three Chakras'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>विशेषज्ञ ज्योतिषी तीनों चक्र प्रणालियों का एक साथ उपयोग करते हैं: सर्वतोभद्र व्यापक वेध विश्लेषण (नाम-आधारित भविष्यवाणियों सहित) के लिए, कोटा चक्र ग्रहीय प्रभाव की गहराई और दिशा समझने के लिए, और सूर्य-कालानल सटीक मासिक समय के लिए। जब तीनों एक साथ चुनौती दर्शाते हैं, तो भविष्यवाणी बहुत मजबूत मानी जाती है।</> : <>Expert astrologers use all three chakra systems together: Sarvatobhadra for comprehensive vedha analysis (including name-based predictions), Kota Chakra for understanding the depth and direction of planetary impact, and Surya-Kalanala for precise monthly timing. When all three indicate challenge simultaneously, the prediction is considered very strong.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'स्वचालित वेध गणना' : 'Automated Vedha Computation'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हमारा इंजन प्रत्येक नक्षत्र जोड़ी के लिए सर्वतोभद्र चक्र से सभी वेध सम्बन्धों की पूर्व-गणना करता है। आपका जन्म नक्षत्र दिए जाने पर, यह तुरन्त पहचानता है कि कौन से वर्तमान और आगामी ग्रहीय गोचर वेध बनाते हैं — पाप (बाधाएँ) और शुभ (सहायता) दोनों। यह मैन्युअल ग्रिड पठन की आवश्यकता समाप्त करता है और इन प्राचीन तकनीकों को सभी के लिए सुलभ बनाता है।</> : <>Our engine pre-computes all vedha relationships from the Sarvatobhadra Chakra for every nakshatra pair. Given your birth nakshatra, it instantly identifies which current and upcoming planetary transits create vedha — both malefic (obstacles) and benefic (support). This removes the need for manual grid reading and makes these ancient techniques accessible to everyone.</>}</p>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'ये प्रणालियाँ क्यों महत्वपूर्ण हैं' : 'Why These Systems Matter'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चक्र प्रणालियाँ मानक भाव-आधारित गोचर विश्लेषण से भिन्न दृष्टिकोण प्रदान करती हैं। वे नक्षत्र स्तर पर केन्द्रित हैं — भविष्यवाणी का एक सूक्ष्मतर स्तर। जबकि भाव गोचर बताते हैं कि कौन सा जीवन क्षेत्र सक्रिय है, चक्र प्रणालियाँ प्रभाव की तीव्रता, दिशा और गुणवत्ता बताती हैं। दशा विश्लेषण के साथ मिलकर, वे वैदिक ज्योतिष में सबसे सम्पूर्ण भविष्यवाणी उपकरण-समूह बनाती हैं।</> : <>Chakra systems provide a different lens than standard house-based transit analysis. They focus on the nakshatra level — a finer grain of prediction. While house transits tell you which life area is activated, chakra systems tell you the intensity, direction, and quality of the impact. Together with dasha analysis, they form the most complete predictive toolkit in Vedic astrology.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

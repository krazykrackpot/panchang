'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_8', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.8',
  title: {
    en: "The 'Pythagorean' Theorem — 300 Years Before Pythagoras",
    hi: "'पाइथागोरस प्रमेय' — पाइथागोरस से 300 वर्ष पहले",
  },
  subtitle: {
    en: 'How Baudhayana stated a² + b² = c² in ~800 BCE — three centuries before Pythagoras was born — in a Vedic fire altar manual, with √2 accurate to 5 decimal places',
    hi: 'बौधायन ने ~800 ईपू में a² + b² = c² कैसे कही — पाइथागोरस के जन्म से तीन शताब्दी पहले — एक वैदिक अग्निकुण्ड पुस्तिका में, √2 पाँच दशमलव स्थानों तक सटीक',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य' }, href: '/learn/modules/25-1' },
    { label: { en: 'Module 25-2: Sine (Sanskrit)', hi: 'मॉड्यूल 25-2: ज्या' }, href: '/learn/modules/25-2' },
    { label: { en: 'Module 25-3: π = 3.1416', hi: 'मॉड्यूल 25-3: π' }, href: '/learn/modules/25-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_8_01', type: 'mcq',
    question: {
      en: 'Who first stated the general theorem that the diagonal of a rectangle equals √(length² + breadth²)?',
      hi: 'सबसे पहले किसने सामान्य प्रमेय कही कि आयत का विकर्ण = √(लम्बाई² + चौड़ाई²)?',
    },
    options: [
      { en: 'Pythagoras', hi: 'पाइथागोरस' },
      { en: 'Euclid', hi: 'यूक्लिड' },
      { en: 'Baudhayana', hi: 'बौधायन' },
      { en: 'Aryabhata', hi: 'आर्यभट' },
    ],
    correctAnswer: 2,
    explanation: {
      en: "Baudhayana, in the Baudhayana Sulba Sutra (~800 BCE), stated the theorem in verse 1.48: 'The diagonal of a rectangle produces both [areas] which its length and breadth produce separately.' This is the Pythagorean theorem in general form — stated roughly 230 years before Pythagoras was born (~570 BCE). Euclid's proof came even later, around 300 BCE.",
      hi: 'बौधायन ने, बौधायन शुल्ब सूत्र (~800 ईपू) में, श्लोक 1.48 में प्रमेय कही: "आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो उसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।" यह पाइथागोरस प्रमेय सामान्य रूप में है — पाइथागोरस के जन्म (~570 ईपू) से लगभग 230 वर्ष पहले।',
    },
  },
  {
    id: 'q25_8_02', type: 'mcq',
    question: {
      en: "In which text does Baudhayana's theorem appear?",
      hi: 'बौधायन की प्रमेय किस ग्रन्थ में मिलती है?',
    },
    options: [
      { en: 'Aryabhatiya', hi: 'आर्यभटीय' },
      { en: 'Baudhayana Sulba Sutra', hi: 'बौधायन शुल्ब सूत्र' },
      { en: 'Brahmasphutasiddhanta', hi: 'ब्रह्मस्फुटसिद्धान्त' },
      { en: 'Rigveda', hi: 'ऋग्वेद' },
    ],
    correctAnswer: 1,
    explanation: {
      en: "The theorem appears in the Baudhayana Sulba Sutra, specifically in verse 1.48. The Sulba Sutras are geometrical appendices to the Vedas, written to provide the mathematical instructions needed for constructing precise Vedic fire altars. The Baudhayana Sulba Sutra is the oldest of the four principal Sulba Sutras, dating to approximately 800 BCE.",
      hi: 'प्रमेय बौधायन शुल्ब सूत्र में, विशेष रूप से श्लोक 1.48 में मिलती है। शुल्ब सूत्र वेदों के ज्यामितीय परिशिष्ट हैं, जो वैदिक अग्निकुण्डों के निर्माण के लिए गणितीय निर्देश प्रदान करने के लिए लिखे गए थे।',
    },
  },
  {
    id: 'q25_8_03', type: 'mcq',
    question: {
      en: "Approximately when was the Baudhayana Sulba Sutra written?",
      hi: 'बौधायन शुल्ब सूत्र लगभग कब लिखा गया?',
    },
    options: [
      { en: '~300 BCE', hi: '~300 ईपू' },
      { en: '~500 BCE', hi: '~500 ईपू' },
      { en: '~800 BCE', hi: '~800 ईपू' },
      { en: '~1200 BCE', hi: '~1200 ईपू' },
    ],
    correctAnswer: 2,
    explanation: {
      en: "The Baudhayana Sulba Sutra is dated to approximately 800 BCE, making it one of the oldest mathematical texts in the world. This places it roughly 230 years before Pythagoras was born (~570 BCE) and about 500 years before Euclid's Elements (~300 BCE). The other Sulba Sutras followed: Apastamba (~600 BCE) and Katyayana (~300 BCE).",
      hi: 'बौधायन शुल्ब सूत्र लगभग 800 ईपू का है, जो इसे विश्व के सबसे पुराने गणितीय ग्रन्थों में से एक बनाता है। यह पाइथागोरस के जन्म (~570 ईपू) से लगभग 230 वर्ष पहले और यूक्लिड के Elements (~300 ईपू) से लगभग 500 वर्ष पहले है।',
    },
  },
  {
    id: 'q25_8_04', type: 'mcq',
    question: {
      en: "What does the Sanskrit word 'Sulba' (शुल्ब) mean?",
      hi: "'शुल्ब' संस्कृत शब्द का क्या अर्थ है?",
    },
    options: [
      { en: 'Geometry', hi: 'ज्यामिति' },
      { en: 'Cord or rope', hi: 'रस्सी या डोरी' },
      { en: 'Fire altar', hi: 'अग्निकुण्ड' },
      { en: 'Measurement', hi: 'मापन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: "'Sulba' (शुल्ब) means cord or rope. The Sulba Sutras were literally rope-and-peg geometry manuals — the ancient Indian equivalent of a surveyor's handbook. They gave instructions for using ropes (cords) and pegs to lay out sacred fire altar spaces with geometric precision. The rope was used to create right angles, circles, and precise distances.",
      hi: "'शुल्ब' का अर्थ है रस्सी या डोरी। शुल्ब सूत्र वस्तुतः रस्सी-और-खूँटी ज्यामिति की पुस्तिकाएँ थीं — प्राचीन भारतीय सर्वेक्षक की पुस्तिका के समतुल्य। वे पवित्र अग्निकुण्ड स्थानों को ज्यामितीय परिशुद्धता के साथ रखने के लिए रस्सी और खूँटी का उपयोग करने के निर्देश देती थीं।",
    },
  },
  {
    id: 'q25_8_05', type: 'mcq',
    question: {
      en: 'What were the Sulba Sutras primarily used for?',
      hi: 'शुल्ब सूत्रों का मुख्य उपयोग किस लिए था?',
    },
    options: [
      { en: 'Teaching arithmetic to students', hi: 'विद्यार्थियों को अंकगणित पढ़ाना' },
      { en: 'Astronomical calculations', hi: 'खगोलीय गणनाएँ' },
      { en: 'Constructing Vedic fire altars of precise shapes and areas', hi: 'सटीक आकार और क्षेत्रफल की वैदिक अग्निकुण्ड बनाना' },
      { en: 'Navigation by sea', hi: 'समुद्री नेविगेशन' },
    ],
    correctAnswer: 2,
    explanation: {
      en: "The Sulba Sutras provided the geometry needed to construct Vedic fire altars (Agni) of specific shapes — falcon, tortoise, wheel, chariot wheel — with exact areas. Ritual law demanded mathematical precision: the altars had to be exactly the right shape and size. This religious necessity drove the development of sophisticated geometry, including the Pythagorean theorem, √2, and Pythagorean triples.",
      hi: 'शुल्ब सूत्रों ने वैदिक अग्निकुण्डों (अग्नि) के निर्माण के लिए ज्यामिति प्रदान की — बाज, कछुआ, चक्र — सटीक क्षेत्रफल के साथ। अनुष्ठान नियम ने गणितीय परिशुद्धता की माँग की। इस धार्मिक आवश्यकता ने परिष्कृत ज्यामिति के विकास को प्रेरित किया।',
    },
  },
  {
    id: 'q25_8_06', type: 'mcq',
    question: {
      en: "Baudhayana gives an approximation for √2. To how many decimal places is it accurate?",
      hi: 'बौधायन √2 का सन्निकटन देते हैं। यह कितने दशमलव स्थानों तक सटीक है?',
    },
    options: [
      { en: '2 decimal places', hi: '2 दशमलव स्थान' },
      { en: '3 decimal places', hi: '3 दशमलव स्थान' },
      { en: '5 decimal places', hi: '5 दशमलव स्थान' },
      { en: '10 decimal places', hi: '10 दशमलव स्थान' },
    ],
    correctAnswer: 2,
    explanation: {
      en: "Baudhayana's formula √2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34) gives 1.4142156..., while the modern value is 1.4142135... — a difference of only 0.0000021, accurate to 5 decimal places. This was needed to compute the diagonal of a unit square (which equals s√2) for altar construction. No other ancient civilisation came close to this precision for √2.",
      hi: "बौधायन का सूत्र √2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34) देता है 1.4142156..., जबकि आधुनिक मान है 1.4142135... — केवल 0.0000021 का अंतर, 5 दशमलव स्थानों तक सटीक। किसी अन्य प्राचीन सभ्यता ने √2 के लिए इतनी परिशुद्धता नहीं छुई।",
    },
  },
  {
    id: 'q25_8_07', type: 'mcq',
    question: {
      en: 'Which of the following is a Pythagorean triple listed in the Baudhayana Sulba Sutra?',
      hi: 'बौधायन शुल्ब सूत्र में सूचीबद्ध निम्नलिखित में से कौन सा पाइथागोरीय त्रिक है?',
    },
    options: [
      { en: '(2, 3, 4)', hi: '(2, 3, 4)' },
      { en: '(3, 4, 5)', hi: '(3, 4, 5)' },
      { en: '(4, 6, 8)', hi: '(4, 6, 8)' },
      { en: '(1, 2, 3)', hi: '(1, 2, 3)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: "The Baudhayana Sulba Sutra lists four Pythagorean triples: (3, 4, 5), (5, 12, 13), (8, 15, 17), and (7, 24, 25). The triple (3, 4, 5) is the most famous: 3² + 4² = 9 + 16 = 25 = 5². A rope of length 12 (3+4+5) tied with knots at positions 3 and 7 creates a perfect right angle — this is how ancient builders made right angles before modern tools.",
      hi: 'बौधायन शुल्ब सूत्र चार पाइथागोरीय त्रिकों की सूची देता है: (3, 4, 5), (5, 12, 13), (8, 15, 17), और (7, 24, 25)। त्रिक (3, 4, 5) सबसे प्रसिद्ध है: 3² + 4² = 9 + 16 = 25 = 5²।',
    },
  },
  {
    id: 'q25_8_08', type: 'mcq',
    question: {
      en: 'Approximately when was Pythagoras born?',
      hi: 'पाइथागोरस का जन्म लगभग कब हुआ?',
    },
    options: [
      { en: '~900 BCE', hi: '~900 ईपू' },
      { en: '~700 BCE', hi: '~700 ईपू' },
      { en: '~570 BCE', hi: '~570 ईपू' },
      { en: '~400 BCE', hi: '~400 ईपू' },
    ],
    correctAnswer: 2,
    explanation: {
      en: "Pythagoras was born approximately 570 BCE in Samos, Greece. The Baudhayana Sulba Sutra was written approximately 800 BCE — making it about 230 years older than Pythagoras. Adding the time until Pythagoras could have stated the theorem (~495 BCE), the Indian statement precedes the Greek attribution by approximately 300 years. This gap is why the theorem's conventional name is disputed by historians of mathematics.",
      hi: 'पाइथागोरस का जन्म लगभग 570 ईपू में ग्रीस के सामोस में हुआ। बौधायन शुल्ब सूत्र लगभग 800 ईपू में लिखा गया — पाइथागोरस से लगभग 230 वर्ष पहले। भारतीय कथन ग्रीक आरोपण से लगभग 300 वर्ष पहले है।',
    },
  },
  {
    id: 'q25_8_09', type: 'true_false',
    question: {
      en: "True or False: Baudhayana stated the theorem only for specific triangles (like 3-4-5), not as a general rule.",
      hi: 'सत्य या असत्य: बौधायन ने प्रमेय केवल विशेष त्रिभुजों (जैसे 3-4-5) के लिए कही, सामान्य नियम के रूप में नहीं।',
    },
    options: [
      { en: 'True', hi: 'सत्य' },
      { en: 'False', hi: 'असत्य' },
    ],
    correctAnswer: 1,
    explanation: {
      en: "FALSE. Baudhayana's verse 1.48 states the theorem in general form: 'The diagonal of a rectangle produces both [areas] which its length and breadth produce separately.' This applies to ALL rectangles, not just specific cases. The mention of specific triples (3,4,5 etc.) elsewhere in the Sulba Sutras is additional — the theorem itself is stated generally.",
      hi: 'असत्य। बौधायन का श्लोक 1.48 प्रमेय सामान्य रूप में कहता है: "आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो उसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।" यह सभी आयतों पर लागू होता है, केवल विशेष मामलों पर नहीं।',
    },
  },
  {
    id: 'q25_8_10', type: 'true_false',
    question: {
      en: "True or False: No written work by Pythagoras himself survives — all attributions come from later followers and writers.",
      hi: 'सत्य या असत्य: पाइथागोरस का कोई लिखित कार्य स्वयं नहीं बचा — सभी आरोपण बाद के अनुयायियों और लेखकों से आते हैं।',
    },
    options: [
      { en: 'True', hi: 'सत्य' },
      { en: 'False', hi: 'असत्य' },
    ],
    correctAnswer: 0,
    explanation: {
      en: "TRUE. Not a single written work by Pythagoras himself has survived. Everything attributed to him — the theorem, other mathematical results, his philosophical teachings — comes from the writings of later followers (the Pythagoreans) and ancient commentators. The earliest surviving Greek proof of the theorem appears in Euclid's Elements (~300 BCE), written roughly 200 years after Pythagoras died. This makes it difficult to determine exactly what Pythagoras himself contributed.",
      hi: 'सत्य। पाइथागोरस का एक भी लिखित कार्य स्वयं नहीं बचा। उनसे सम्बन्धित सब कुछ — प्रमेय, अन्य गणितीय परिणाम, दार्शनिक शिक्षाएँ — बाद के अनुयायियों (पाइथागोरियन) और प्राचीन टिप्पणीकारों के लेखन से आता है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Sulba Sutras and Baudhayana's Theorem                 */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'वह प्रमेय जिसे हम गलत नाम से जानते हैं' : "The Theorem We Know By the Wrong Name"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>a² + b² = c². दुनिया के हर स्कूल में यह "पाइथागोरस प्रमेय" के रूप में पढ़ाई जाती है। लेकिन इस परिणाम का सबसे पुराना ज्ञात कथन ग्रीस में नहीं, भारत में मिलता है — बौधायन शुल्ब सूत्र में, जो ~800 ईपू में लिखा गया। पाइथागोरस ~570 ईपू में पैदा हुए — लगभग 230 वर्ष बाद।</>
            : <>a² + b² = c². Taught in every school worldwide as 'Pythagoras's theorem.' But the earliest known statement of this result appears not in Greece, but in India — in the Baudhayana Sulba Sutra, written ~800 BCE. Pythagoras was born ~570 BCE — roughly 230 years later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शुल्ब सूत्र — कर्मकाण्ड से जन्मा गणित' : "Sulba Sutras — Mathematics Born From Ritual"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3">
          {isHi
            ? <>शुल्ब सूत्र वेदों के परिशिष्ट हैं जो अग्निकुण्ड निर्माण की ज्यामिति बताते हैं। "शुल्ब" का अर्थ है रस्सी — ये रस्सी-और-खूँटी ज्यामिति की पुस्तिकाएँ थीं। वेदी का आकार (बाज, कछुआ, चक्र) और क्षेत्रफल बिल्कुल सटीक होना चाहिए था — धार्मिक नियम ने गणितीय परिशुद्धता की माँग की।</>
            : <>The Sulba Sutras are Vedic appendices giving the geometry for fire altar construction. "Sulba" means rope — literally rope-and-peg geometry manuals. Altars had to be specific shapes (falcon, tortoise, wheel) with exact areas — ritual law demanded mathematical precision. Any deviation was considered invalid.</>}
        </p>
        <div className="space-y-2">
          {[
            { name: 'Baudhayana', date: '~800 BCE', note: { en: 'Oldest — contains verse 1.48, the general theorem', hi: 'सबसे पुराना — श्लोक 1.48, सामान्य प्रमेय' }, accent: '#f0d48a' },
            { name: 'Apastamba', date: '~600 BCE', note: { en: 'Refined √2, additional constructions', hi: 'परिष्कृत √2' }, accent: '#fbbf24' },
            { name: 'Katyayana', date: '~300 BCE', note: { en: 'Generalised geometric transformations', hi: 'सामान्यीकृत रूपांतरण' }, accent: '#a78bfa' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="text-xs font-mono w-16 flex-shrink-0" style={{ color: s.accent }}>{s.date}</span>
              <div>
                <span className="text-text-primary text-xs font-semibold">{s.name} Sulba Sutra — </span>
                <span className="text-text-secondary text-xs">{isHi ? s.note.hi : s.note.en}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/20 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'बौधायन शुल्ब सूत्र 1.48' : "Baudhayana Sulba Sutra 1.48"}
        </h4>
        <p
          className="text-gold-primary text-base font-bold mb-2 leading-relaxed text-center"
          style={{ fontFamily: 'var(--font-devanagari-heading)' }}
        >
          दीर्घचतुरश्रस्याक्ष्णयारज्जुः पार्श्वमानी तिर्यङ्मानी च यत्पृथग्भूते कुरुतस्तदुभयं करोति
        </p>
        <p className="text-gold-light/80 text-sm italic text-center mb-1">
          {isHi
            ? '"आयत का विकर्ण वह दोनों [क्षेत्रफल] उत्पन्न करता है जो उसकी लम्बाई और चौड़ाई अलग-अलग उत्पन्न करती हैं।"'
            : '"The diagonal of a rectangle produces both [areas] which its length and breadth produce separately."'}
        </p>
        <p className="text-text-secondary/60 text-xs text-center">
          {isHi ? '= a² + b² = c² — सभी आयतों के लिए सामान्य नियम' : '= a² + b² = c² — a general rule for ALL rectangles'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — √2, Pythagorean Triples, and Altar Geometry              */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? '√2, त्रिक और वेदी ज्यामिति' : '√2, Triples, and Altar Geometry'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रमेय के अलावा, बौधायन ने दो और उल्लेखनीय योगदान दिए: √2 का आश्चर्यजनक रूप से सटीक सन्निकटन, और विशिष्ट पाइथागोरीय त्रिकों की सूची। दोनों सीधे अग्निकुण्ड निर्माण के व्यावहारिक आवश्यकताओं से उभरे।</>
            : <>Beyond the theorem itself, Baudhayana made two more remarkable contributions: an astonishingly accurate approximation of √2, and a list of specific Pythagorean triples. Both emerged directly from the practical demands of fire altar construction.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? '√2 — 800 ईपू में पाँच दशमलव' : '√2 — Five Decimal Places in 800 BCE'}
        </h4>
        <div className="p-3 rounded-lg bg-amber-500/5 border border-amber-500/10 text-center mb-3">
          <p className="text-amber-300 font-mono text-sm font-bold">√2 ≈ 1 + 1/3 + 1/(3×4) − 1/(3×4×34)</p>
          <p className="text-text-secondary text-xs mt-1">= 1.4142156... (modern: 1.4142135...)</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>यह सन्निकटन क्यों? क्योंकि वर्गाकार वेदी को दोगुना करने के लिए मूल का विकर्ण चाहिए — जो s√2 है। यदि आप s = 1 की वेदी से शुरू करते हैं, तो नई भुजा = √2 है। बिना सटीक √2 के, दोगुनी वेदी ठीक नहीं होती।</>
            : <>Why this approximation? Because doubling a square altar requires its diagonal — which is s√2. Starting from an altar of side s=1, the new side = √2. Without accurate √2, the doubled altar isn't right.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'बौधायन का मान आधुनिक मान से केवल 0.0000021 अलग है। अपस्तम्ब शुल्ब सूत्र (~600 ईपू) ने इसे और परिष्कृत किया।'
            : "Baudhayana's value differs from the modern IEEE 754 value by only 0.0000021. Apastamba Sulba Sutra (~600 BCE) refined it further."}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'पाइथागोरीय त्रिक — वेदी में समकोण' : "Pythagorean Triples — Right Angles for the Altar"}
        </h4>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[
            { a: 3, b: 4, c: 5, check: '9+16=25' },
            { a: 5, b: 12, c: 13, check: '25+144=169' },
            { a: 8, b: 15, c: 17, check: '64+225=289' },
            { a: 7, b: 24, c: 25, check: '49+576=625' },
          ].map((t, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] text-center">
              <p className="text-gold-light font-bold text-sm">({t.a}, {t.b}, {t.c})</p>
              <p className="text-text-secondary text-xs font-mono">{t.check}</p>
            </div>
          ))}
        </div>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'इन त्रिकों का व्यावहारिक उपयोग: लम्बाई (a+b+c) की रस्सी में a और a+b पर गाँठें बाँधें, तीनों खूँटों पर फैलाएँ — एक सटीक समकोण बनता है। यही प्राचीन निर्माणकर्ता समकोण बनाते थे।'
            : 'Practical use: tie a rope of length (a+b+c) with knots at a and a+b, stretch on three pegs — a perfect right angle. This is how ancient builders made right angles without modern instruments.'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Pythagoras, Euclid, and the Fair Assessment               */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पाइथागोरस ने वास्तव में क्या किया?' : "What Did Pythagoras Actually Do?"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाइथागोरस (~570–495 ईपू) ने मिस्र और बेबीलोनिया की व्यापक यात्रा की। ग्रीक परम्परा उन्हें प्रमेय के प्रथम औपचारिक निगमनात्मक प्रमाण का श्रेय देती है। लेकिन समस्या: पाइथागोरस का स्वयं का कोई लिखित कार्य नहीं बचा। उनसे सम्बन्धित सब कुछ बाद के लेखकों से आता है।</>
            : <>Pythagoras (~570–495 BCE) travelled extensively to Egypt and Babylon. Greek tradition credits him with the first formal deductive proof of the theorem. But the problem: not a single written work by Pythagoras himself survives. Everything attributed to him comes from later writers.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कालक्रम' : 'The Timeline'}
        </h4>
        <div className="space-y-3">
          {[
            { year: '~800 BCE', event: { en: 'Baudhayana Sulba Sutra — general theorem, √2, and triples', hi: 'बौधायन शुल्ब सूत्र — सामान्य प्रमेय, √2, और त्रिक' }, color: '#f0d48a' },
            { year: '~600 BCE', event: { en: 'Apastamba Sulba Sutra — refined √2', hi: 'आपस्तम्ब शुल्ब सूत्र — परिष्कृत √2' }, color: '#d4a853' },
            { year: '~570 BCE', event: { en: 'Pythagoras born in Samos, Greece', hi: 'पाइथागोरस का जन्म सामोस, ग्रीस में' }, color: '#a78bfa' },
            { year: '~300 BCE', event: { en: "Euclid's Elements — first surviving formal Greek proof", hi: 'यूक्लिड के Elements — पहला जीवित औपचारिक ग्रीक प्रमाण' }, color: '#34d399' },
            { year: '499 CE', event: { en: 'Aryabhatiya — theorem used for astronomical calculations', hi: 'आर्यभटीय — खगोलीय गणनाओं में प्रमेय' }, color: '#fbbf24' },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xs font-mono w-16 flex-shrink-0 mt-0.5" style={{ color: item.color }}>{item.year}</span>
              <p className="text-text-secondary text-xs leading-relaxed">{isHi ? item.event.hi : item.event.en}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'निष्पक्ष मूल्यांकन' : 'The Fair Assessment'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'भारतीय योगदान:' : 'Indian contribution:'}</span>{' '}
            {isHi
              ? 'सामान्य प्रमेय की खोज और व्यावहारिक उपयोग (~800 ईपू), √2 पाँच दशमलव तक, चार पाइथागोरीय त्रिक।'
              : 'Discovery and systematic practical use of the general theorem (~800 BCE), √2 to 5 decimal places, four Pythagorean triples.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'ग्रीक योगदान:' : 'Greek contribution:'}</span>{' '}
            {isHi
              ? 'सम्भवतः प्रथम औपचारिक निगमनात्मक प्रमाण — हालाँकि पाइथागोरस का कोई लिखित कार्य नहीं बचा, इसलिए यूक्लिड (~300 ईपू) ही सबसे पुराना जीवित स्रोत है।'
              : 'Possibly the first formal deductive proof — though no work by Pythagoras survives, so Euclid (~300 BCE) is the oldest surviving source.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed mt-2 italic">
            {isHi
              ? 'गणित के इतिहासकार अब "बौधायन प्रमेय" नाम की ओर झुक रहे हैं। भारतीय गणित पाठ्यपुस्तकों में यह पहले से ही "बौधायन प्रमेय" कही जाती है।'
              : 'Historians of mathematics increasingly favour the name "Baudhayana theorem." Indian mathematics textbooks already call it that.'}
          </p>
        </div>
      </section>
    </div>
  );
}

export default function Module25_8Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

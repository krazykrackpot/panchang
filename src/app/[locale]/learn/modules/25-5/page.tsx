'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_5', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.5',
  title: { en: 'Binary Code — 1800 Years Before Computers', hi: 'द्विआधारी संकेत — कम्प्यूटर से 1800 वर्ष पहले' },
  subtitle: {
    en: 'How Pingala encoded poetic meters in binary notation around 200 BCE — inventing what we now call binary arithmetic, Pascal\'s triangle, and combinatorics',
    hi: 'पिंगल ने ~200 BCE में काव्य छन्दों को द्विआधारी संकेत में कैसे एन्कोड किया — जिसे हम अब द्विआधारी अंकगणित, पास्कल त्रिभुज, और क्रमचय-संचय कहते हैं',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य' }, href: '/learn/modules/25-1' },
    { label: { en: 'Module 25-4: Negative Numbers', hi: 'मॉड्यूल 25-4: ऋण संख्याएँ' }, href: '/learn/modules/25-4' },
    { label: { en: 'Module 25-7: Kerala Calculus', hi: 'मॉड्यूल 25-7: केरल गणित' }, href: '/learn/modules/25-7' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_5_01', type: 'mcq',
    question: {
      en: 'Who invented binary encoding of sequences in ancient India?',
      hi: 'प्राचीन भारत में अनुक्रमों के द्विआधारी एन्कोडिंग का आविष्कार किसने किया?',
    },
    options: [
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Pingala', hi: 'पिंगल' },
      { en: 'Panini', hi: 'पाणिनि' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Pingala, an ancient Indian scholar (~200 BCE), invented binary encoding in his text Chandahshastra (or Chandashāstra), a treatise on Sanskrit prosody (the study of poetic meter). To encode the patterns of short (laghu) and long (guru) syllables in Sanskrit poetry, Pingala developed what is essentially binary notation — 1800 years before Leibniz and 2000+ years before digital computers.',
      hi: 'पिंगल, एक प्राचीन भारतीय विद्वान (~200 BCE), ने अपने छन्दःशास्त्र (Sanskrit छन्दशास्त्र) में द्विआधारी एन्कोडिंग का आविष्कार किया — संस्कृत छन्दशास्त्र (काव्य छन्द का अध्ययन) पर एक ग्रन्थ। संस्कृत कविता में लघु और गुरु अक्षरों के पैटर्न को एन्कोड करने के लिए, पिंगल ने वह विकसित किया जो मूलतः द्विआधारी अंकन है — लाइबनित्ज़ से 1800 वर्ष और डिजिटल कम्प्यूटरों से 2000+ वर्ष पहले।',
    },
  },
  {
    id: 'q25_5_02', type: 'mcq',
    question: {
      en: 'What was the name of Pingala\'s text that contains binary encoding?',
      hi: 'पिंगल के उस ग्रन्थ का नाम क्या था जिसमें द्विआधारी एन्कोडिंग है?',
    },
    options: [
      { en: 'Ashtadhyayi', hi: 'अष्टाध्यायी' },
      { en: 'Chandahshastra', hi: 'छन्दःशास्त्र' },
      { en: 'Natya Shastra', hi: 'नाट्यशास्त्र' },
      { en: 'Arthashastra', hi: 'अर्थशास्त्र' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Chandahshastra (छन्दःशास्त्र, "the science of prosody/meter") is Pingala\'s text. The word "chandas" refers to poetic meter in Sanskrit — the patterns of short and long syllables that give Sanskrit poetry its rhythmic structure. Pingala was likely the brother of the great grammarian Panini. His Chandahshastra systematised 8 meters using combinations of short (laghu, light) and long (guru, heavy) syllables, requiring binary representation to enumerate all possible patterns.',
      hi: 'छन्दःशास्त्र ("छन्द का विज्ञान") पिंगल का ग्रन्थ है। "छन्दस्" संस्कृत में काव्य छन्द को संदर्भित करता है — लघु और दीर्घ अक्षरों के पैटर्न जो संस्कृत कविता को उसकी लयात्मक संरचना देते हैं। पिंगल सम्भवतः महान व्याकरणशास्त्री पाणिनि के भाई थे। उनके छन्दःशास्त्र ने लघु और गुरु अक्षरों के संयोजनों का उपयोग करके 8 छन्दों को व्यवस्थित किया।',
    },
  },
  {
    id: 'q25_5_03', type: 'mcq',
    question: {
      en: 'Approximately what century did Pingala write the Chandahshastra?',
      hi: 'पिंगल ने छन्दःशास्त्र लगभग किस शताब्दी में लिखा?',
    },
    options: [
      { en: '6th century BCE', hi: '6वीं शताब्दी BCE' },
      { en: '~3rd–2nd century BCE (~200 BCE)', hi: '~3री-2री शताब्दी BCE (~200 BCE)' },
      { en: '1st century CE', hi: '1ली शताब्दी CE' },
      { en: '5th century CE', hi: '5वीं शताब्दी CE' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Pingala\'s Chandahshastra is dated to approximately 200–300 BCE (3rd–2nd century BCE), though some scholars argue for an earlier date. This places it roughly contemporary with or slightly later than Euclid\'s Elements (~300 BCE) and Archimedes (~250 BCE) in Greece. The uncertainty arises because ancient Indian texts were transmitted orally for centuries before being written down, making precise dating difficult.',
      hi: 'पिंगल के छन्दःशास्त्र की तिथि लगभग 200–300 BCE (3री-2री शताब्दी BCE) है। यह यूक्लिड के तत्त्व (~300 BCE) और आर्किमिडीज़ (~250 BCE) के समकालीन या थोड़ा बाद में रखता है। अनिश्चितता इसलिए है क्योंकि प्राचीन भारतीय ग्रन्थ लिखे जाने से पहले सदियों तक मौखिक रूप से प्रसारित होते थे।',
    },
  },
  {
    id: 'q25_5_04', type: 'mcq',
    question: {
      en: 'What was the subject matter that Pingala was encoding in binary?',
      hi: 'पिंगल किस विषय को द्विआधारी में एन्कोड कर रहे थे?',
    },
    options: [
      { en: 'Astronomical positions of planets', hi: 'ग्रहों की खगोलीय स्थितियाँ' },
      { en: 'Poetic meters — patterns of short (laghu) and long (guru) syllables', hi: 'काव्य छन्द — लघु और गुरु अक्षरों के पैटर्न' },
      { en: 'Musical notes and rhythms', hi: 'संगीत के स्वर और ताल' },
      { en: 'Temple construction measurements', hi: 'मन्दिर निर्माण माप' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Pingala was encoding Sanskrit poetic meters — the patterns of short (laghu = light) and long (guru = heavy) syllables. Sanskrit poetry is strictly metered: each verse type has a specific sequence of light and heavy syllables. For example, the Gayatri meter has 3 lines of 8 syllables each. To systematically enumerate all possible 8-syllable patterns, Pingala needed to represent all 2⁸ = 256 combinations of L (laghu) and G (guru). This required a binary numbering system.',
      hi: 'पिंगल संस्कृत काव्य छन्दों को एन्कोड कर रहे थे — लघु (हल्का) और गुरु (भारी) अक्षरों के पैटर्न। संस्कृत कविता कड़ाई से छन्दोबद्ध है। सभी सम्भावित 8-अक्षर पैटर्नों को व्यवस्थित रूप से सूचीबद्ध करने के लिए, पिंगल को L (लघु) और G (गुरु) के सभी 2⁸ = 256 संयोजनों का प्रतिनिधित्व करना था। इसके लिए एक द्विआधारी संख्या प्रणाली की आवश्यकता थी।',
    },
  },
  {
    id: 'q25_5_05', type: 'mcq',
    question: {
      en: 'What is Meruprastara — the triangular arrangement Pingala described in the Chandahshastra?',
      hi: 'मेरुप्रस्तार क्या है — पिंगल द्वारा छन्दःशास्त्र में वर्णित त्रिभुजाकार व्यवस्था?',
    },
    options: [
      { en: 'A triangular arrangement of Sanskrit syllables', hi: 'संस्कृत अक्षरों की त्रिभुजाकार व्यवस्था' },
      { en: 'Pascal\'s triangle — a triangular array where each number is the sum of the two above', hi: 'पास्कल त्रिभुज — एक त्रिभुजाकार सरणी जहाँ प्रत्येक संख्या ऊपर की दो का योग है' },
      { en: 'A temple layout plan', hi: 'एक मन्दिर लेआउट योजना' },
      { en: 'A constellation chart', hi: 'एक नक्षत्र चार्ट' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Meruprastara is exactly what we today call Pascal\'s triangle — a triangular array where each number is the sum of the two numbers directly above it. Pingala described this in the Chandahshastra to count the number of meter combinations with a given number of heavy syllables. Row n gives the coefficients of the binomial expansion (a+b)ⁿ. Pingala had this ~2200 years before Blaise Pascal (1653) and ~1500 years before the Chinese mathematician Yang Hui (1261).',
      hi: 'मेरुप्रस्तार वही है जिसे हम आज पास्कल त्रिभुज कहते हैं — एक त्रिभुजाकार सरणी जहाँ प्रत्येक संख्या उसके ऊपर की दो संख्याओं का योग है। पिंगल ने इसे दी गई संख्या के गुरु अक्षरों के साथ छन्द संयोजनों को गिनने के लिए वर्णित किया। पंक्ति n द्विपद विस्तार (a+b)ⁿ के गुणांक देती है। पिंगल के पास यह ब्लेज़ पास्कल (1653) से ~2200 वर्ष और चीनी गणितज्ञ यांग हुई (1261) से ~1500 वर्ष पहले था।',
    },
  },
  {
    id: 'q25_5_06', type: 'mcq',
    question: {
      en: 'Approximately how many years before Pascal\'s triangle did Pingala describe the Meruprastara?',
      hi: 'मेरुप्रस्तार का वर्णन पास्कल त्रिभुज से लगभग कितने वर्ष पहले पिंगल ने किया?',
    },
    options: [
      { en: 'About 500 years', hi: 'लगभग 500 वर्ष' },
      { en: 'About 1200 years', hi: 'लगभग 1200 वर्ष' },
      { en: 'About 1800 years', hi: 'लगभग 1800 वर्ष' },
      { en: 'About 2200 years', hi: 'लगभग 2200 वर्ष' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'Pingala\'s Meruprastara (~200 BCE) predates Pascal\'s triangle (1653 CE) by approximately 1850 years — about 1800 years. The gap is enormous. Pascal himself did not claim to have invented it — he compiled and systematised earlier European work. The true first known occurrence is Pingala\'s. Note also: the Chinese mathematician Yang Hui described it in 1261 CE (about 500 years before Pascal, 1500 years after Pingala). The true priority clearly belongs to India.',
      hi: 'पिंगल का मेरुप्रस्तार (~200 BCE) पास्कल त्रिभुज (1653 CE) से लगभग 1850 वर्ष पहले है। अन्तर विशाल है। पास्कल ने स्वयं इसे आविष्कार करने का दावा नहीं किया था। पहली ज्ञात घटना पिंगल की है। चीनी गणितज्ञ यांग हुई ने इसे 1261 CE में वर्णित किया (पास्कल से ~500 वर्ष पहले, पिंगल के 1500 वर्ष बाद)। वास्तविक प्राथमिकता स्पष्ट रूप से भारत की है।',
    },
  },
  {
    id: 'q25_5_07', type: 'mcq',
    question: {
      en: 'What does the Chandahshastra\'s rule "dvih shunye" (द्विः शून्ये) refer to in terms of binary counting?',
      hi: 'द्विआधारी गणना के संदर्भ में छन्दःशास्त्र के नियम "द्विः शून्ये" का क्या अर्थ है?',
    },
    options: [
      { en: 'When the count reaches zero, double it', hi: 'जब गणना शून्य पर पहुँचे, उसे दोगुना करें' },
      { en: 'When you reach an odd number, subtract 1 and note it; when even, halve it — effectively binary decomposition', hi: 'विषम पर 1 घटाकर नोट करें; सम पर आधा करें — वस्तुतः द्विआधारी विघटन' },
      { en: 'Multiply by two and set to zero', hi: 'दो से गुणा करके शून्य करें' },
      { en: 'A rule for counting syllables in a poem', hi: 'कविता में अक्षर गिनने का नियम' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Pingala\'s "dvih shunye" rule describes a binary decomposition algorithm: to convert a number to binary, repeatedly check if odd (subtract 1, mark as 1) or even (halve, mark as 0). Reading the marks in reverse gives the binary representation. This is exactly the "divide by 2 and record remainders" method taught in schools today for decimal-to-binary conversion. Pingala had this algorithm ~200 BCE — it is one of the earliest known computational algorithms in history.',
      hi: 'पिंगल का "द्विः शून्ये" नियम एक द्विआधारी विघटन एल्गोरिदम का वर्णन करता है: किसी संख्या को द्विआधारी में बदलने के लिए, बार-बार जाँचें कि विषम है (1 घटाएँ, 1 के रूप में चिह्नित करें) या सम (आधा करें, 0 के रूप में चिह्नित करें)। चिह्नों को उल्टे क्रम में पढ़ने पर द्विआधारी प्रतिनिधित्व मिलता है। यह वही "2 से भाग और शेष रिकॉर्ड करें" विधि है जो आज स्कूलों में पढ़ाई जाती है।',
    },
  },
  {
    id: 'q25_5_08', type: 'mcq',
    question: {
      en: 'Who is credited in the Western tradition with inventing binary arithmetic, and in what year?',
      hi: 'पश्चिमी परम्परा में द्विआधारी अंकगणित का आविष्कार करने का श्रेय किसे और किस वर्ष में दिया जाता है?',
    },
    options: [
      { en: 'George Boole, 1854', hi: 'जॉर्ज बूल, 1854' },
      { en: 'Gottfried Leibniz, 1703', hi: 'गॉटफ्रीड लाइबनित्ज़, 1703' },
      { en: 'Claude Shannon, 1937', hi: 'क्लॉड शैनन, 1937' },
      { en: 'Charles Babbage, 1833', hi: 'चार्ल्स बैबेज, 1833' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Gottfried Wilhelm Leibniz published "Explication de l\'Arithmétique Binaire" in 1703, describing binary arithmetic and connecting it to the I Ching hexagrams (Chinese). Leibniz is credited in Western history with "inventing" binary. However, Pingala\'s Chandahshastra predates Leibniz by approximately 1900 years. Leibniz almost certainly did not know of Pingala\'s work. The parallel independent discoveries show that binary representation of two-state patterns is a deep mathematical truth.',
      hi: 'गॉटफ्रीड विल्हेम लाइबनित्ज़ ने 1703 में "एक्सप्लिकेशन डे ल\'अरिथमेटिक बिनेर" प्रकाशित किया, द्विआधारी अंकगणित का वर्णन करते हुए और इसे I Ching हेक्साग्राम से जोड़ते हुए। पश्चिमी इतिहास में लाइबनित्ज़ को द्विआधारी "आविष्कार" का श्रेय दिया जाता है। हालाँकि, पिंगल का छन्दःशास्त्र लाइबनित्ज़ से लगभग 1900 वर्ष पहले का है।',
    },
  },
  {
    id: 'q25_5_09', type: 'true_false',
    question: {
      en: 'In Pingala\'s system, laghu (light/short) syllables correspond to 0 and guru (heavy/long) syllables correspond to 1 in binary.',
      hi: 'पिंगल की प्रणाली में, लघु (हल्के/छोटे) अक्षर द्विआधारी में 0 के अनुरूप हैं और गुरु (भारी/लम्बे) अक्षर 1 के अनुरूप हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In Pingala\'s encoding system, laghu (light/short syllable) functions as the binary "0" and guru (heavy/long syllable) as the binary "1." A sequence of n syllables can be any combination of laghu and guru, giving 2ⁿ possible patterns — exactly the binary concept. Modern computers use exactly this principle: bits are either 0 (off/low voltage) or 1 (on/high voltage). The structural identity between Pingala\'s prosody encoding and modern binary computing is complete.',
      hi: 'सत्य। पिंगल की एन्कोडिंग प्रणाली में, लघु (हल्का/छोटा अक्षर) द्विआधारी "0" और गुरु (भारी/लम्बा अक्षर) "1" के रूप में काम करता है। n अक्षरों का एक अनुक्रम लघु और गुरु का कोई भी संयोजन हो सकता है, जो 2ⁿ सम्भावित पैटर्न देता है — ठीक द्विआधारी अवधारणा। आधुनिक कम्प्यूटर ठीक इसी सिद्धान्त का उपयोग करते हैं: बिट्स या तो 0 या 1 हैं।',
    },
  },
  {
    id: 'q25_5_10', type: 'true_false',
    question: {
      en: 'Modern digital computers use binary (base-2) encoding — the same two-state encoding principle that Pingala used for poetic syllables.',
      hi: 'आधुनिक डिजिटल कम्प्यूटर द्विआधारी (आधार-2) एन्कोडिंग का उपयोग करते हैं — वही द्वि-अवस्था एन्कोडिंग सिद्धान्त जो पिंगल ने काव्य अक्षरों के लिए उपयोग किया था।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Modern computers are built entirely on binary (base-2) logic. Every transistor is either "on" (1) or "off" (0). Every piece of data — text, images, videos, programs — is ultimately stored as sequences of 0s and 1s. This is structurally identical to Pingala\'s laghu (0) / guru (1) encoding of poetic syllables. While Pingala didn\'t know about transistors, the mathematical principle he discovered — that any sequence can be encoded with only two symbols — is the exact foundation of all modern computing.',
      hi: 'सत्य। आधुनिक कम्प्यूटर पूरी तरह से द्विआधारी (आधार-2) तर्क पर बने हैं। प्रत्येक ट्रांजिस्टर "चालू" (1) या "बंद" (0) होता है। प्रत्येक डेटा — पाठ, छवियाँ, वीडियो, प्रोग्राम — अन्ततः 0 और 1 के अनुक्रमों के रूप में संग्रहीत होता है। यह काव्य अक्षरों के पिंगल के लघु (0)/गुरु (1) एन्कोडिंग के समान संरचनात्मक है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Pingala and the Chandahshastra                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पिंगल और छन्दःशास्त्र — कविता का द्विआधारी विज्ञान' : 'Pingala and Chandahshastra — The Binary Science of Poetry'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>~200 BCE में, एक भारतीय छन्दशास्त्री ने कविता को व्यवस्थित करने की कोशिश में एक ऐसा गणितीय उपकरण खोजा जो 2000 वर्ष बाद डिजिटल क्रान्ति का आधार बनेगा। पिंगल को कम्प्यूटर की आवश्यकता नहीं थी — उन्हें केवल अच्छी कविता चाहिए थी।</>
            : <>Around 200 BCE, an Indian prosodist trying to organise poetry discovered a mathematical tool that would, 2000 years later, become the foundation of the digital revolution. Pingala didn't need computers — he just needed good poetry.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'संस्कृत कविता और छन्द की समस्या' : 'Sanskrit Poetry and the Problem of Meter'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>संस्कृत कविता में प्रत्येक अक्षर "लघु" (हल्का, छोटा) या "गुरु" (भारी, लम्बा) होता है। एक 8-अक्षर के छन्द में 2⁸ = 256 सम्भावित लय-पैटर्न हो सकते हैं। प्रश्न था: इन सभी पैटर्नों को व्यवस्थित रूप से कैसे सूचीबद्ध किया जाए?</>
            : <>In Sanskrit poetry, each syllable is either "laghu" (light, short) or "guru" (heavy, long). An 8-syllable meter could have 2⁸ = 256 possible rhythmic patterns. The question was: how to systematically enumerate all these patterns?</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पिंगल का उत्तर: L = 0, G = 1 के रूप में एन्कोड करें। फिर सभी 2ⁿ संयोजन द्विआधारी संख्याओं के अनुरूप हैं। उदाहरण: "LLG" = 001 (द्विआधारी) = 1 (दशमलव)। "GLG" = 101 = 5।</>
            : <>Pingala's answer: encode L = 0, G = 1. Then all 2ⁿ combinations correspond to binary numbers. Example: "LLG" = 001 (binary) = 1 (decimal). "GLG" = 101 = 5.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह खोज आकस्मिक नहीं थी — यह एक व्यवस्थित गणितीय दृष्टिकोण था जिसे संगठित करने की आवश्यकता थी। पिंगल ने ऐसे एल्गोरिदम विकसित किए जो किसी भी n-अक्षर के छन्द के लिए सभी सम्भावित पैटर्न उत्पन्न कर सकते थे।</>
            : <>This discovery wasn't accidental — it was a systematic mathematical approach needed for organisation. Pingala developed algorithms that could generate all possible patterns for any n-syllable meter.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'द्विआधारी एल्गोरिदम — "द्विः शून्ये"' : 'The Binary Algorithm — "Dvih Shunye"'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>पिंगल का "द्विः शून्ये" ("दो बार शून्य") नियम: किसी छन्द संख्या को द्विआधारी में बदलने के लिए —</>
            : <>Pingala's "dvih shunye" ("two zeros") rule: to convert a meter number to binary —</>}
        </p>
        <div className="space-y-1">
          <p className="text-text-secondary text-xs">1. {isHi ? 'यदि संख्या विषम: 1 घटाएँ, "G" (गुरु=1) नोट करें' : 'If number is odd: subtract 1, note "G" (guru=1)'}</p>
          <p className="text-text-secondary text-xs">2. {isHi ? 'यदि संख्या सम: 2 से भाग दें, "L" (लघु=0) नोट करें' : 'If even: divide by 2, note "L" (laghu=0)'}</p>
          <p className="text-text-secondary text-xs">3. {isHi ? 'संख्या 0 होने तक दोहराएँ' : 'Repeat until number reaches 0'}</p>
          <p className="text-text-secondary text-xs">4. {isHi ? 'नोट किए गए अक्षरों को उल्टे क्रम में पढ़ें = द्विआधारी प्रतिनिधित्व' : 'Read noted syllables in reverse = binary representation'}  </p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-2">
          {isHi ? 'यह ठीक वही एल्गोरिदम है जो आज स्कूलों में दशमलव-से-द्विआधारी रूपान्तरण के लिए पढ़ाया जाता है।' : 'This is exactly the algorithm taught in schools today for decimal-to-binary conversion.'}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Meruprastara: Pascal's Triangle 2000 Years Early           */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'मेरुप्रस्तार — पास्कल त्रिभुज 2000 वर्ष पहले' : 'Meruprastara — Pascal\'s Triangle 2000 Years Early'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पिंगल की सबसे बड़ी खोजों में से एक थी "मेरुप्रस्तार" — एक त्रिभुजाकार संख्या व्यवस्था जिसे 1800 वर्ष बाद ब्लेज़ पास्कल "पुनः खोजेंगे।"</>
            : <>One of Pingala's greatest discoveries was "Meruprastara" — a triangular number arrangement that Blaise Pascal would "re-discover" 1800 years later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'मेरुप्रस्तार की संरचना' : 'Structure of Meruprastara'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3 font-mono text-center text-gold-light/70">
          {'    1\n   1 1\n  1 2 1\n 1 3 3 1\n1 4 6 4 1'}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>प्रत्येक संख्या उसके ऊपर की दो संख्याओं का योग है। n-अक्षर के छन्द में ठीक k गुरु अक्षरों वाले पैटर्नों की संख्या = C(n,k) = पंक्ति n का k+1वाँ तत्व।</>
            : <>Each number is the sum of the two numbers above it. The number of n-syllable meter patterns with exactly k guru syllables = C(n,k) = element k+1 in row n.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>उदाहरण: 3-अक्षर के छन्दों के लिए (पंक्ति 3): 1 3 3 1 → 1 पैटर्न बिना गुरु, 3 एक गुरु के साथ, 3 दो के साथ, 1 सभी गुरु। कुल: 1+3+3+1 = 8 = 2³।</>
            : <>Example: For 3-syllable meters (row 3): 1 3 3 1 → 1 pattern with no guru, 3 with one guru, 3 with two, 1 all guru. Total: 1+3+3+1 = 8 = 2³.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'प्राथमिकता का सवाल' : 'The Question of Priority'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'पिंगल (~200 BCE):' : 'Pingala (~200 BCE):'}</span> {isHi ? 'मेरुप्रस्तार — पहली ज्ञात घटना' : 'Meruprastara — first known occurrence'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'हलयुध (~10वीं सदी CE):' : 'Halayudha (~10th century CE):'}</span> {isHi ? 'मेरुप्रस्तार पर विस्तृत टीका' : 'Extensive commentary on Meruprastara'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'यांग हुई (1261 CE):' : 'Yang Hui (1261 CE):'}</span> {isHi ? 'चीनी स्वतन्त्र खोज' : 'Chinese independent discovery'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'ब्लेज़ पास्कल (1653 CE):' : 'Blaise Pascal (1653 CE):'}</span> {isHi ? 'यूरोपीय खोज — पिंगल से ~1850 वर्ष बाद' : 'European discovery — ~1850 years after Pingala'}</p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Legacy: Combinatorics and Computing                        */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = (locale === 'hi' || String(locale) === 'sa');
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'विरासत: क्रमचय-संचय और संगणना' : 'Legacy: Combinatorics and Computing'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पिंगल का छन्दःशास्त्र केवल कविता का नहीं — यह गणित का एक महान ग्रन्थ है। क्रमचय-संचय, द्विपद प्रमेय, और द्विआधारी संख्या प्रणाली — तीनों की जड़ें यहाँ हैं।</>
            : <>Pingala's Chandahshastra is not just about poetry — it is a great mathematical text. Combinatorics, binomial theorem, and binary number system — all three have their roots here.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'पिंगल की तीन महान खोजें' : "Pingala's Three Great Discoveries"}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '1. द्विआधारी संख्या प्रणाली:' : '1. Binary number system:'}</span>{' '}
            {isHi ? 'लघु=0, गुरु=1 — दो प्रतीकों से किसी भी अनुक्रम को एन्कोड करने का सिद्धान्त। आधुनिक संगणना का आधार।' : 'laghu=0, guru=1 — the principle of encoding any sequence with two symbols. Foundation of modern computing.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '2. मेरुप्रस्तार (पास्कल त्रिभुज):' : '2. Meruprastara (Pascal\'s triangle):'}</span>{' '}
            {isHi ? 'द्विपद गुणांकों की त्रिभुजाकार व्यवस्था। C(n,k) की गणना, द्विपद प्रमेय, प्रायिकता सिद्धान्त।' : 'Triangular arrangement of binomial coefficients. Computes C(n,k), binomial theorem, probability theory.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '3. क्रमचय-संचय सूत्र:' : '3. Combinatorics formulas:'}</span>{' '}
            {isHi ? 'n वस्तुओं में से r चुनने के तरीकों की संख्या — C(n,r) = n! / (r! × (n-r)!)।' : 'Number of ways to choose r items from n — C(n,r) = n! / (r! × (n-r)!).'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कविता से कम्प्यूटर तक — एक सीधी रेखा' : 'From Poetry to Computers — A Direct Line'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>2200 वर्षों की यात्रा: पिंगल के लघु/गुरु (0/1) → लाइबनित्ज़ का द्विआधारी (1703) → बूलियन तर्क (1854) → शैनन का सूचना सिद्धान्त (1948) → आधुनिक कम्प्यूटर।</>
            : <>A 2200-year journey: Pingala's laghu/guru (0/1) → Leibniz's binary (1703) → Boolean logic (1854) → Shannon's information theory (1948) → modern computers.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>क्लॉड शैनन ने 1948 में सिद्ध किया कि कोई भी जानकारी (ध्वनि, चित्र, पाठ) को 0 और 1 के अनुक्रमों के रूप में एन्कोड किया जा सकता है — बिट्स। यह ठीक वही सिद्धान्त है जो पिंगल ने कविता के लिए खोजा था।</>
            : <>Claude Shannon proved in 1948 that any information (sound, image, text) can be encoded as sequences of 0s and 1s — bits. This is exactly the principle Pingala discovered for poetry.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_5Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

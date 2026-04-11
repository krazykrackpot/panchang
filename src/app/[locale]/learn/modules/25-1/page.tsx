'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_1', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.1',
  title: { en: 'Zero — The Most Dangerous Idea', hi: 'शून्य — सबसे साहसी विचार' },
  subtitle: {
    en: 'How Brahmagupta defined zero arithmetic in 628 CE, why it terrified medieval Europe, and how it became the foundation of all modern computing',
    hi: 'ब्रह्मगुप्त ने 628 ई. में शून्य गणित की परिभाषा कैसे दी, यह मध्ययुगीन यूरोप को क्यों डराता था, और यह आधुनिक संगणना की नींव कैसे बना',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-4: Negative Numbers', hi: 'मॉड्यूल 25-4: ऋण संख्याएँ' }, href: '/learn/modules/25-4' },
    { label: { en: 'Module 25-5: Binary Code', hi: 'मॉड्यूल 25-5: द्विआधारी संकेत' }, href: '/learn/modules/25-5' },
    { label: { en: 'Module 25-7: Kerala Calculus', hi: 'मॉड्यूल 25-7: केरल गणित' }, href: '/learn/modules/25-7' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_1_01', type: 'mcq',
    question: {
      en: 'Who first defined the rules of arithmetic with zero, including addition, subtraction, and multiplication?',
      hi: 'शून्य के साथ जोड़, घटाव और गुणा के नियम सबसे पहले किसने परिभाषित किए?',
    },
    options: [
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Fibonacci', hi: 'फिबोनाची' },
      { en: 'Bhaskara II', hi: 'भास्कर द्वितीय' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Brahmagupta (598–668 CE), the mathematician-astronomer from Rajasthan, was the first person in history to formally define the rules of arithmetic with zero. In Chapter 18 of his Brahmasphutasiddhanta (628 CE), he laid out: a number plus zero equals the number, a number minus zero equals the number, and a number multiplied by zero equals zero. He also attempted (and partially erred on) division by zero.',
      hi: 'ब्रह्मगुप्त (598–668 ई.), राजस्थान के गणितज्ञ-खगोलशास्त्री, इतिहास में सबसे पहले व्यक्ति थे जिन्होंने शून्य के साथ गणित के नियम औपचारिक रूप से परिभाषित किए। अपने ब्रह्मस्फुटसिद्धान्त (628 ई.) के अध्याय 18 में उन्होंने लिखा: कोई संख्या और शून्य का योग वही संख्या है, शून्य घटाने पर वही संख्या, और शून्य से गुणा करने पर शून्य। शून्य से भाग पर उन्होंने प्रयास किया — आंशिक रूप से भूल के साथ।',
    },
  },
  {
    id: 'q25_1_02', type: 'mcq',
    question: {
      en: 'In which text did Brahmagupta first codify zero arithmetic?',
      hi: 'ब्रह्मगुप्त ने किस ग्रन्थ में शून्य गणित का पहली बार संहिताकरण किया?',
    },
    options: [
      { en: 'Aryabhatiya', hi: 'आर्यभटीय' },
      { en: 'Lilavati', hi: 'लीलावती' },
      { en: 'Brahmasphutasiddhanta', hi: 'ब्रह्मस्फुटसिद्धान्त' },
      { en: 'Surya Siddhanta', hi: 'सूर्यसिद्धान्त' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Brahmasphutasiddhanta ("The Correctly Established Doctrine of Brahma"), composed in 628 CE, is the text where Brahmagupta first codified zero arithmetic. The word "Brahmasphuta" means "the opening of Brahma" — it was a comprehensive astronomical and mathematical treatise. Chapter 18, titled "Kuttaka" (pulverizer/algebra), contains the famous 18 sutras defining operations with zero and negative numbers.',
      hi: 'ब्रह्मस्फुटसिद्धान्त ("ब्रह्मा का सम्यक् स्थापित सिद्धान्त"), 628 ई. में रचित, वह ग्रन्थ है जिसमें ब्रह्मगुप्त ने पहली बार शून्य गणित का संहिताकरण किया। यह एक व्यापक खगोलीय और गणितीय ग्रन्थ था। अध्याय 18, "कुट्टक" (बीजगणित), में शून्य और ऋण संख्याओं के संचालन को परिभाषित करने वाले 18 सूत्र हैं।',
    },
  },
  {
    id: 'q25_1_03', type: 'mcq',
    question: {
      en: 'In which chapter of the Brahmasphutasiddhanta did Brahmagupta define zero operations?',
      hi: 'ब्रह्मस्फुटसिद्धान्त के किस अध्याय में ब्रह्मगुप्त ने शून्य क्रियाएँ परिभाषित कीं?',
    },
    options: [
      { en: 'Chapter 1', hi: 'अध्याय 1' },
      { en: 'Chapter 7', hi: 'अध्याय 7' },
      { en: 'Chapter 12', hi: 'अध्याय 12' },
      { en: 'Chapter 18', hi: 'अध्याय 18' },
    ],
    correctAnswer: 3,
    explanation: {
      en: 'Chapter 18 of the Brahmasphutasiddhanta, titled "Kuttaka" (meaning the pulveriser — an algorithm for solving linear Diophantine equations), contains Brahmagupta\'s rules for arithmetic with zero and negative numbers. This chapter is considered one of the most important mathematical texts in human history, as it introduced concepts that would underpin algebra, computing, and modern mathematics.',
      hi: 'ब्रह्मस्फुटसिद्धान्त का अध्याय 18, "कुट्टक" (रेखीय डायोफेंटाइन समीकरण हल करने का एल्गोरिदम), में ब्रह्मगुप्त के शून्य और ऋण संख्याओं के नियम हैं। यह अध्याय मानव इतिहास में सबसे महत्त्वपूर्ण गणितीय ग्रन्थों में से एक माना जाता है।',
    },
  },
  {
    id: 'q25_1_04', type: 'mcq',
    question: {
      en: 'What is the Sanskrit word for zero used by Brahmagupta?',
      hi: 'ब्रह्मगुप्त द्वारा शून्य के लिए प्रयुक्त संस्कृत शब्द क्या है?',
    },
    options: [
      { en: 'Akasha', hi: 'आकाश' },
      { en: 'Shunya', hi: 'शून्य' },
      { en: 'Bindu', hi: 'बिन्दु' },
      { en: 'Viyat', hi: 'वियत्' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Shunya" (शून्य) is the Sanskrit term meaning "void," "empty," or "nothingness." Brahmagupta used this concept — already present in Buddhist and Hindu philosophy as the nature of emptiness — and transformed it into a precise mathematical quantity that could be operated upon. The word "zero" itself traces through Arabic "sifr" (cipher/empty), which was a translation of Sanskrit "shunya".',
      hi: '"शून्य" संस्कृत शब्द है जिसका अर्थ है "रिक्त," "खाली," या "अनस्तित्व।" ब्रह्मगुप्त ने इस अवधारणा — जो बौद्ध और हिन्दू दर्शन में पहले से थी — को एक सटीक गणितीय राशि में बदला जिस पर क्रियाएँ की जा सकती थीं। "Zero" शब्द अरबी "सिफ्र" (रिक्त) से आया, जो संस्कृत "शून्य" का अनुवाद था।',
    },
  },
  {
    id: 'q25_1_05', type: 'mcq',
    question: {
      en: 'Who brought Indian numerals (including zero) to Europe via his book Liber Abaci (1202 CE)?',
      hi: 'अपनी पुस्तक लिबर अबाची (1202 ई.) के माध्यम से भारतीय अंकों (शून्य सहित) को यूरोप में कौन लाया?',
    },
    options: [
      { en: 'Al-Khwarizmi', hi: 'अल-ख्वारिज़्मी' },
      { en: 'Fibonacci (Leonardo of Pisa)', hi: 'फिबोनाची (पीसा के लियोनार्डो)' },
      { en: 'Pope Sylvester II', hi: 'पोप सिल्वेस्टर द्वितीय' },
      { en: 'Roger Bacon', hi: 'रोजर बेकन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Fibonacci (Leonardo of Pisa, c. 1170–1250) studied with Arab merchants in North Africa and wrote Liber Abaci in 1202. The book systematically explained the Hindu-Arabic numeral system — including zero — to European merchants and scholars. The transmission chain was: India → Arab mathematicians (Al-Khwarizmi translated Indian texts ~820 CE) → Fibonacci\'s Liber Abaci → European adoption. Before this, Europeans used clunky Roman numerals with no zero.',
      hi: 'फिबोनाची (पीसा के लियोनार्डो, लगभग 1170–1250) ने उत्तर अफ्रीका में अरब व्यापारियों के साथ अध्ययन किया और 1202 ई. में लिबर अबाची लिखी। पुस्तक ने हिन्दू-अरबी अंक प्रणाली — शून्य सहित — को यूरोपीय व्यापारियों और विद्वानों को समझाया। संचरण श्रृंखला: भारत → अरब गणितज्ञ (अल-ख्वारिज़्मी ने ~820 ई. में भारतीय ग्रन्थों का अनुवाद किया) → फिबोनाची की लिबर अबाची → यूरोपीय अपनाना।',
    },
  },
  {
    id: 'q25_1_06', type: 'mcq',
    question: {
      en: 'Which European city banned Arabic numerals (including zero) in 1299 CE, fearing fraud?',
      hi: 'किस यूरोपीय शहर ने 1299 ई. में धोखाधड़ी के डर से अरबी अंकों (शून्य सहित) पर प्रतिबन्ध लगाया?',
    },
    options: [
      { en: 'Rome', hi: 'रोम' },
      { en: 'Paris', hi: 'पेरिस' },
      { en: 'Florence', hi: 'फ्लोरेंस' },
      { en: 'Venice', hi: 'वेनिस' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'In 1299, the Arte del Cambio (the Guild of Moneychangers) in Florence, Italy, issued an ordinance banning Arabic numerals from commercial accounts — specifically citing the ease with which a "0" could be altered to a "6" or "9" to commit fraud. Roman numerals were required instead. This "dangerous idea" — that nothing could be a number — was so alien to medieval European thought that several cities actively resisted it.',
      hi: '1299 ई. में फ्लोरेंस, इटली के Arte del Cambio (मनी-चेंजर्स गिल्ड) ने व्यापारिक खातों में अरबी अंकों पर प्रतिबन्ध लगाने वाला अध्यादेश जारी किया — विशेष रूप से यह कहते हुए कि "0" को "6" या "9" में बदलकर धोखाधड़ी आसान हो जाती है। इसके बजाय रोमन अंकों की आवश्यकता थी। यह "खतरनाक विचार" — कि कुछ न होना भी एक संख्या हो सकती है — मध्ययुगीन यूरोपीय विचार के लिए इतना अजीब था कि कई शहरों ने इसका सक्रिय विरोध किया।',
    },
  },
  {
    id: 'q25_1_07', type: 'mcq',
    question: {
      en: 'What did Brahmagupta incorrectly claim about 0÷0?',
      hi: '0÷0 के बारे में ब्रह्मगुप्त ने क्या गलत दावा किया?',
    },
    options: [
      { en: 'He said 0÷0 is undefined', hi: 'उन्होंने कहा 0÷0 अपरिभाषित है' },
      { en: 'He said 0÷0 = 0', hi: 'उन्होंने कहा 0÷0 = 0' },
      { en: 'He said 0÷0 = 1', hi: 'उन्होंने कहा 0÷0 = 1' },
      { en: 'He said 0÷0 = infinity', hi: 'उन्होंने कहा 0÷0 = अनन्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Brahmagupta made a notable error: he claimed that 0÷0 = 0. In modern mathematics, 0÷0 is "indeterminate" — it has no defined value (not zero, not infinity, not 1). Any number times 0 is 0, so there is no unique answer for what 0÷0 should equal. Bhaskara II (12th century) later attempted to define n÷0 as infinity ("khahara"), which is closer to the modern concept of limits but still not rigorous by today\'s standards.',
      hi: 'ब्रह्मगुप्त ने एक उल्लेखनीय भूल की: उन्होंने दावा किया कि 0÷0 = 0। आधुनिक गणित में, 0÷0 "अनिर्धार्य" है — इसका कोई परिभाषित मान नहीं (न शून्य, न अनन्त, न 1)। भास्कर द्वितीय (12वीं शताब्दी) ने बाद में n÷0 को अनन्त ("खहर") के रूप में परिभाषित करने का प्रयास किया।',
    },
  },
  {
    id: 'q25_1_08', type: 'mcq',
    question: {
      en: 'What year did Brahmagupta publish his rules for zero in the Brahmasphutasiddhanta?',
      hi: 'ब्रह्मगुप्त ने अपने शून्य नियम ब्रह्मस्फुटसिद्धान्त में किस वर्ष प्रकाशित किए?',
    },
    options: [
      { en: '499 CE', hi: '499 ई.' },
      { en: '628 CE', hi: '628 ई.' },
      { en: '776 CE', hi: '776 ई.' },
      { en: '820 CE', hi: '820 ई.' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '628 CE is the year Brahmagupta completed the Brahmasphutasiddhanta, making it the oldest text to treat zero as a formal number with its own arithmetic rules. For context: 499 CE is when Aryabhata wrote the Aryabhatiya (used zero as a placeholder but did not define its arithmetic); 820 CE is when Al-Khwarizmi translated Indian mathematics into Arabic; and Fibonacci\'s Liber Abaci came in 1202 CE.',
      hi: '628 ई. वह वर्ष है जब ब्रह्मगुप्त ने ब्रह्मस्फुटसिद्धान्त पूरा किया, जो इसे शून्य को अपने स्वयं के अंकगणितीय नियमों के साथ औपचारिक संख्या के रूप में व्यवहार करने वाला सबसे पुराना ग्रन्थ बनाता है। संदर्भ के लिए: 499 ई. में आर्यभट ने आर्यभटीय लिखी; 820 ई. में अल-ख्वारिज़्मी ने भारतीय गणित का अरबी में अनुवाद किया।',
    },
  },
  {
    id: 'q25_1_09', type: 'true_false',
    question: {
      en: 'Zero was invented by the ancient Babylonians, who used it as a placeholder in cuneiform number systems.',
      hi: 'शून्य का आविष्कार प्राचीन बाबुलियों ने किया था, जिन्होंने इसे कीलाकार संख्या प्रणालियों में प्लेसहोल्डर के रूप में उपयोग किया।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. The Babylonians had a placeholder symbol for an empty position in their base-60 system, but they never treated zero as a number that could be added, subtracted, or multiplied — they had no concept of "zero the quantity." The Mayans independently developed a zero symbol too. India\'s contribution was unique: defining zero as a full-fledged number with arithmetic rules, first done by Brahmagupta in 628 CE. The Babylonian/Mayan zeros were notational tools, not numbers.',
      hi: 'असत्य। बाबुलियों के पास उनकी आधार-60 प्रणाली में एक रिक्त स्थान के लिए प्लेसहोल्डर चिह्न था, लेकिन उन्होंने कभी शून्य को जोड़, घटाव या गुणा की जा सकने वाली संख्या के रूप में नहीं माना। भारत का योगदान अनूठा था: शून्य को अंकगणितीय नियमों के साथ पूर्ण संख्या के रूप में परिभाषित करना, जो ब्रह्मगुप्त ने 628 ई. में पहली बार किया।',
    },
  },
  {
    id: 'q25_1_10', type: 'true_false',
    question: {
      en: 'Without zero, modern binary computing and digital technology would not be possible.',
      hi: 'शून्य के बिना आधुनिक द्विआधारी संगणना और डिजिटल तकनीक सम्भव नहीं होती।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Binary computing is built on exactly two values: 0 and 1. Every bit in every computer, phone, and digital device is either zero or one. The entire digital revolution — internet, artificial intelligence, smartphones — rests on binary arithmetic, which requires zero as a fundamental quantity. Beyond binary, calculus (which uses limits approaching zero), algebra (solving for unknowns), and all modern mathematics require zero as a number. Brahmagupta\'s 628 CE insight is the bedrock of the modern world.',
      hi: 'सत्य। द्विआधारी संगणना ठीक दो मानों पर बनी है: 0 और 1। प्रत्येक कम्प्यूटर, फोन और डिजिटल उपकरण में प्रत्येक बिट या तो शून्य है या एक। पूरी डिजिटल क्रान्ति — इंटरनेट, कृत्रिम बुद्धिमत्ता, स्मार्टफोन — द्विआधारी गणित पर टिकी है, जिसके लिए शून्य एक मूलभूत राशि के रूप में आवश्यक है। ब्रह्मगुप्त की 628 ई. की अन्तर्दृष्टि आधुनिक विश्व की आधारशिला है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Void Becomes a Number                                  */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'शून्य: रिक्तता से संख्या तक' : 'Zero: From Void to Number'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>इतिहास में एक क्षण ऐसा आया जब किसी ने पूछा: क्या "कुछ नहीं" भी एक संख्या हो सकती है? यह प्रश्न इतना क्रान्तिकारी था कि इसने गणित, दर्शन और अन्ततः संगणना को हमेशा के लिए बदल दिया। 628 ई. में राजस्थान के ब्रह्मगुप्त ने इस प्रश्न का उत्तर "हाँ" में दिया और शून्य को एक पूर्ण गणितीय सत्ता बना दिया।</>
            : <>There came a moment in history when someone asked: can "nothing" be a number? The question was so revolutionary that it transformed mathematics, philosophy, and ultimately computing forever. In 628 CE, Brahmagupta of Rajasthan answered "yes" — and made zero a full mathematical entity.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ब्रह्मगुप्त के नियम (628 ई.)' : "Brahmagupta's Rules (628 CE)"}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'जोड़:' : 'Addition:'}</span>{' '}
            {isHi ? 'कोई भी संख्या + शून्य = वही संख्या। (a + 0 = a)' : 'Any number + zero = that number. (a + 0 = a)'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'घटाव:' : 'Subtraction:'}</span>{' '}
            {isHi ? 'कोई भी संख्या − शून्य = वही संख्या। (a − 0 = a)' : 'Any number − zero = that number. (a − 0 = a)'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'शून्य − शून्य:' : 'Zero minus zero:'}</span>{' '}
            {isHi ? 'शून्य − शून्य = शून्य। (0 − 0 = 0)' : 'Zero minus zero = zero. (0 − 0 = 0)'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'गुणन:' : 'Multiplication:'}</span>{' '}
            {isHi ? 'कोई भी संख्या × शून्य = शून्य। (a × 0 = 0)' : 'Any number × zero = zero. (a × 0 = 0)'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'शून्य ÷ शून्य:' : 'Zero ÷ zero:'}</span>{' '}
            {isHi ? 'ब्रह्मगुप्त ने 0÷0 = 0 कहा — यह उनकी प्रसिद्ध भूल थी। आधुनिक गणित में यह "अनिर्धार्य" है।' : 'Brahmagupta claimed 0÷0 = 0 — his famous error. Modern mathematics says this is "indeterminate."'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शून्य से पहले — प्लेसहोल्डर और रिक्तता' : 'Before Zero — Placeholders and Emptiness'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>बाबुलियों (~300 BCE) के पास अपनी आधार-60 प्रणाली में रिक्त स्थान के लिए एक चिह्न था, लेकिन वे इसे कभी संख्या के रूप में नहीं मानते थे। माया सभ्यता ने भी स्वतन्त्र रूप से एक शून्य चिह्न विकसित किया। ये "प्लेसहोल्डर शून्य" थे — अंकन उपकरण, न कि संख्याएँ।</>
            : <>The Babylonians (~300 BCE) had a symbol for an empty position in their base-60 system, but never treated it as a number. The Mayans independently developed a zero symbol too. These were "placeholder zeros" — notational tools, not numbers you could add or multiply.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय दार्शनिक परम्परा में "शून्य" पहले से था — बौद्ध दर्शन में रिक्तता का विचार, हिन्दू दर्शन में ब्रह्म से पहले की अव्यक्त स्थिति। ब्रह्मगुप्त ने इस दार्शनिक शून्य को गणितीय शून्य बनाया।</>
            : <>India already had "shunya" in philosophical tradition — Buddhist emptiness, the unmanifest state in Hindu cosmology. Brahmagupta transformed this philosophical void into a mathematical quantity that could be operated upon.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Dangerous Journey to Europe                            */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'यूरोप तक खतरनाक यात्रा' : 'The Dangerous Journey to Europe'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>शून्य का यूरोप तक का सफर 600 वर्षों में फैला एक अद्भुत इतिहास है। भारत से अरब दुनिया, अरब दुनिया से उत्तरी अफ्रीका, उत्तरी अफ्रीका से मध्ययुगीन यूरोप — और हर कदम पर प्रतिरोध।</>
            : <>Zero's journey to Europe spans a remarkable 600 years. India to the Arab world, Arab world to North Africa, North Africa to medieval Europe — and resistance at every step.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'संचरण की श्रृंखला' : 'The Chain of Transmission'}
        </h4>
        <div className="space-y-3">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '628 ई. — ब्रह्मगुप्त:' : '628 CE — Brahmagupta:'}</span>{' '}
            {isHi ? 'ब्रह्मस्फुटसिद्धान्त में शून्य के नियम परिभाषित।' : 'Defines zero arithmetic in Brahmasphutasiddhanta.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '~820 ई. — अल-ख्वारिज़्मी:' : '~820 CE — Al-Khwarizmi:'}</span>{' '}
            {isHi ? 'बगदाद के ज्ञान के घर में भारतीय गणित का अरबी में अनुवाद। उनका नाम "algorithm" शब्द का स्रोत है।' : 'Translates Indian mathematics into Arabic at the House of Wisdom in Baghdad. His name is the root of the word "algorithm."'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '1202 ई. — फिबोनाची:' : '1202 CE — Fibonacci:'}</span>{' '}
            {isHi ? 'लिबर अबाची में हिन्दू-अरबी अंक प्रणाली यूरोपीय व्यापारियों को सिखाई।' : 'Introduces Hindu-Arabic numerals to European merchants in Liber Abaci.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '1299 ई. — फ्लोरेंस प्रतिबन्ध:' : '1299 CE — Florence ban:'}</span>{' '}
            {isHi ? 'Arte del Cambio ने धोखाधड़ी के डर से अरबी अंकों पर प्रतिबन्ध लगाया।' : 'Arte del Cambio bans Arabic numerals, fearing fraud with easily-modified zeros.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? '~1500 ई. — यूरोपीय स्वीकृति:' : '~1500 CE — European acceptance:'}</span>{' '}
            {isHi ? 'मुद्रण और व्यापार की जरूरतों ने आखिरकार शून्य को स्वीकार करा दिया।' : 'The practical needs of printing and commerce finally force acceptance of zero.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'यूरोप ने विरोध क्यों किया?' : 'Why Did Europe Resist?'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">दार्शनिक संघर्ष:</span> अरस्तू की तर्क प्रणाली में "शून्यता" का अस्तित्व नहीं था — प्रकृति शून्यता से घृणा करती है (natura abhorret vacuum)। यदि शून्य एक संख्या है, तो यह अरस्तू की पूरी विश्व-दृष्टि को चुनौती देता था।</>
            : <><span className="text-gold-light font-medium">Philosophical conflict:</span> Aristotelian logic had no room for "nothingness" — nature abhors a vacuum (natura abhorret vacuum). If zero is a number, it challenged Aristotle's entire worldview, which was also Church doctrine.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">व्यावहारिक डर:</span> व्यापारी चिन्तित थे कि "0" को "6" या "9" में बदलकर धोखाधड़ी की जा सकती है। फ्लोरेंस का 1299 ई. का प्रतिबन्ध इसी डर की अभिव्यक्ति था।</>
            : <><span className="text-gold-light font-medium">Practical fear:</span> Merchants worried that "0" could be altered to "6" or "9" to commit fraud in accounts. Florence's 1299 ban was an expression of this fear — hence calling zero "the dangerous idea."</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Zero and Computing                                          */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'शून्य और आधुनिक संगणना' : 'Zero and Modern Computing'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ब्रह्मगुप्त के शून्य के बिना आधुनिक सभ्यता की कल्पना नहीं की जा सकती। प्रत्येक कम्प्यूटर, स्मार्टफोन, और डिजिटल उपकरण शून्य और एक के द्विआधारी खेल पर चलता है।</>
            : <>Modern civilisation is unimaginable without Brahmagupta's zero. Every computer, smartphone, and digital device runs on the binary dance of zero and one.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शून्य पर टिकी दुनिया' : 'The World Built on Zero'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'द्विआधारी संगणना:' : 'Binary computing:'}</span>{' '}
            {isHi ? 'हर बिट 0 या 1 है। अरबों ट्रांजिस्टर प्रति सेकण्ड 0 और 1 के बीच स्विच करते हैं। यह सब शून्य के बिना असम्भव।' : 'Every bit is 0 or 1. Billions of transistors switch between 0 and 1 per second. All impossible without zero.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'कलन (Calculus):' : 'Calculus:'}</span>{' '}
            {isHi ? 'न्यूटन और लाइबनित्ज़ की कलन शून्य की ओर सीमाओं (limits) पर आधारित है। शून्य के बिना कोई अवकल गणित नहीं — भौतिकी के सभी नियम विफल।' : 'Newton and Leibniz\'s calculus is built on limits approaching zero. No zero = no differential calculus = all laws of physics fail.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'बीजगणित:' : 'Algebra:'}</span>{' '}
            {isHi ? 'समीकरण हल करना — शून्य को एक तरफ लाना — केवल तभी सम्भव जब शून्य एक संख्या हो।' : 'Solving equations — bringing everything to zero — is only possible when zero is a number you can manipulate.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'निर्देशांक प्रणाली:' : 'Coordinate systems:'}</span>{' '}
            {isHi ? 'कार्तेसियन निर्देशांकों का केन्द्रबिन्दु (0,0) — जिस पर सारी भौतिकी, इंजीनियरिंग और GPS आधारित है।' : 'The origin (0,0) of Cartesian coordinates — the foundation of all physics, engineering, GPS, and maps.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'शून्य की विरासत' : "Zero's Legacy"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>628 ई. में ब्रह्मगुप्त ने जो बीज बोया, वह आज विश्व की सम्पूर्ण डिजिटल सभ्यता बन गया है। जब भी आप अपना स्मार्टफोन उठाते हैं — आप ब्रह्मगुप्त के शून्य का उपयोग करते हैं।</>
            : <>The seed Brahmagupta planted in 628 CE has grown into the entire digital civilisation of today. Every time you pick up your smartphone, you are using Brahmagupta's zero — whether you know it or not.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>गणितज्ञ रॉबर्ट कापलान ने लिखा: "शून्य वह लेंस है जिससे देखने पर सब कुछ बड़ा हो जाता है।" और साइन ड्यूशाइन: "शून्य इतिहास का सबसे उर्वर विचार है — इसने एक शून्यता से एक पूरी संख्या रेखा बनाई।"</>
            : <>Mathematician Robert Kaplan wrote: "Zero is the lens through which everything comes into focus." And Charles Seife: "Zero is the most fertile idea in history — from nothing it created a whole number line."</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

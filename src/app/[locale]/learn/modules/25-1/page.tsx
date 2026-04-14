'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-1.json';

const META: ModuleMeta = {
  id: 'mod_25_1', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-4' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-5' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-7' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 3,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_1_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Void Becomes a Number                                  */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Zero: From Void to Number', hi: 'शून्य: रिक्तता से संख्या तक', sa: 'शून्य: रिक्तता से संख्या तक' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>इतिहास में एक क्षण ऐसा आया जब किसी ने पूछा: क्या "कुछ नहीं" भी एक संख्या हो सकती है? यह प्रश्न इतना क्रान्तिकारी था कि इसने गणित, दर्शन और अन्ततः संगणना को हमेशा के लिए बदल दिया। 628 ई. में राजस्थान के ब्रह्मगुप्त ने इस प्रश्न का उत्तर "हाँ" में दिया और शून्य को एक पूर्ण गणितीय सत्ता बना दिया।</>
            : <>There came a moment in history when someone asked: can "nothing" be a number? The question was so revolutionary that it transformed mathematics, philosophy, and ultimately computing forever. In 628 CE, Brahmagupta of Rajasthan answered "yes" — and made zero a full mathematical entity.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Brahmagupta's Rules (628 CE)", hi: "ब्रह्मगुप्त के नियम (628 ई.)", sa: "ब्रह्मगुप्त के नियम (628 ई.)" }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Addition:', hi: 'जोड़:', sa: 'जोड़:' }, locale)}</span>{' '}
            {tl({ en: 'Any number + zero = that number. (a + 0 = a)', hi: 'कोई भी संख्या + शून्य = वही संख्या। (a + 0 = a)', sa: 'कोई भी संख्या + शून्य = वही संख्या। (a + 0 = a)' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Subtraction:', hi: 'घटाव:', sa: 'घटाव:' }, locale)}</span>{' '}
            {tl({ en: 'Any number − zero = that number. (a − 0 = a)', hi: 'कोई भी संख्या − शून्य = वही संख्या। (a − 0 = a)', sa: 'कोई भी संख्या − शून्य = वही संख्या। (a − 0 = a)' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Zero minus zero:', hi: 'शून्य − शून्य:', sa: 'शून्य − शून्य:' }, locale)}</span>{' '}
            {tl({ en: 'Zero minus zero = zero. (0 − 0 = 0)', hi: 'शून्य − शून्य = शून्य। (0 − 0 = 0)', sa: 'शून्य − शून्य = शून्य। (0 − 0 = 0)' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Multiplication:', hi: 'गुणन:', sa: 'गुणन:' }, locale)}</span>{' '}
            {tl({ en: 'Any number × zero = zero. (a × 0 = 0)', hi: 'कोई भी संख्या × शून्य = शून्य। (a × 0 = 0)', sa: 'कोई भी संख्या × शून्य = शून्य। (a × 0 = 0)' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Zero ÷ zero:', hi: 'शून्य ÷ शून्य:', sa: 'शून्य ÷ शून्य:' }, locale)}</span>{' '}
            {tl({ en: 'Brahmagupta claimed 0÷0 = 0 — his famous error. Modern mathematics says this is "indeterminate."', hi: 'ब्रह्मगुप्त ने 0÷0 = 0 कहा — यह उनकी प्रसिद्ध भूल थी। आधुनिक गणित में यह "अनिर्धार्य" है।', sa: 'ब्रह्मगुप्त ने 0÷0 = 0 कहा — यह उनकी प्रसिद्ध भूल थी। आधुनिक गणित में यह "अनिर्धार्य" है।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Before Zero — Placeholders and Emptiness', hi: 'शून्य से पहले — प्लेसहोल्डर और रिक्तता', sa: 'शून्य से पहले — प्लेसहोल्डर और रिक्तता' }, locale)}
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
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Dangerous Journey to Europe', hi: 'यूरोप तक खतरनाक यात्रा', sa: 'यूरोप तक खतरनाक यात्रा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>शून्य का यूरोप तक का सफर 600 वर्षों में फैला एक अद्भुत इतिहास है। भारत से अरब दुनिया, अरब दुनिया से उत्तरी अफ्रीका, उत्तरी अफ्रीका से मध्ययुगीन यूरोप — और हर कदम पर प्रतिरोध।</>
            : <>Zero's journey to Europe spans a remarkable 600 years. India to the Arab world, Arab world to North Africa, North Africa to medieval Europe — and resistance at every step.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Chain of Transmission', hi: 'संचरण की श्रृंखला', sa: 'संचरण की श्रृंखला' }, locale)}
        </h4>
        <div className="space-y-3">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: '628 CE — Brahmagupta:', hi: '628 ई. — ब्रह्मगुप्त:', sa: '628 ई. — ब्रह्मगुप्त:' }, locale)}</span>{' '}
            {tl({ en: 'Defines zero arithmetic in Brahmasphutasiddhanta.', hi: 'ब्रह्मस्फुटसिद्धान्त में शून्य के नियम परिभाषित।', sa: 'ब्रह्मस्फुटसिद्धान्त में शून्य के नियम परिभाषित।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: '~820 CE — Al-Khwarizmi:', hi: '~820 ई. — अल-ख्वारिज़्मी:', sa: '~820 ई. — अल-ख्वारिज़्मी:' }, locale)}</span>{' '}
            {tl({ en: 'Translates Indian mathematics into Arabic at the House of Wisdom in Baghdad. His name is the root of the word "algorithm."', hi: 'बगदाद के ज्ञान के घर में भारतीय गणित का अरबी में अनुवाद। उनका नाम "algorithm" शब्द का स्रोत है।', sa: 'बगदाद के ज्ञान के घर में भारतीय गणित का अरबी में अनुवाद। उनका नाम "algorithm" शब्द का स्रोत है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: '1202 CE — Fibonacci:', hi: '1202 ई. — फिबोनाची:', sa: '1202 ई. — फिबोनाची:' }, locale)}</span>{' '}
            {tl({ en: 'Introduces Hindu-Arabic numerals to European merchants in Liber Abaci.', hi: 'लिबर अबाची में हिन्दू-अरबी अंक प्रणाली यूरोपीय व्यापारियों को सिखाई।', sa: 'लिबर अबाची में हिन्दू-अरबी अंक प्रणाली यूरोपीय व्यापारियों को सिखाई।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: '1299 CE — Florence ban:', hi: '1299 ई. — फ्लोरेंस प्रतिबन्ध:', sa: '1299 ई. — फ्लोरेंस प्रतिबन्ध:' }, locale)}</span>{' '}
            {tl({ en: 'Arte del Cambio bans Arabic numerals, fearing fraud with easily-modified zeros.', hi: 'Arte del Cambio ने धोखाधड़ी के डर से अरबी अंकों पर प्रतिबन्ध लगाया।', sa: 'Arte del Cambio ने धोखाधड़ी के डर से अरबी अंकों पर प्रतिबन्ध लगाया।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: '~1500 CE — European acceptance:', hi: '~1500 ई. — यूरोपीय स्वीकृति:', sa: '~1500 ई. — यूरोपीय स्वीकृति:' }, locale)}</span>{' '}
            {tl({ en: 'The practical needs of printing and commerce finally force acceptance of zero.', hi: 'मुद्रण और व्यापार की जरूरतों ने आखिरकार शून्य को स्वीकार करा दिया।', sa: 'मुद्रण और व्यापार की जरूरतों ने आखिरकार शून्य को स्वीकार करा दिया।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Why Did Europe Resist?', hi: 'यूरोप ने विरोध क्यों किया?', sa: 'यूरोप ने विरोध क्यों किया?' }, locale)}
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
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Zero and Modern Computing', hi: 'शून्य और आधुनिक संगणना', sa: 'शून्य और आधुनिक संगणना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ब्रह्मगुप्त के शून्य के बिना आधुनिक सभ्यता की कल्पना नहीं की जा सकती। प्रत्येक कम्प्यूटर, स्मार्टफोन, और डिजिटल उपकरण शून्य और एक के द्विआधारी खेल पर चलता है।</>
            : <>Modern civilisation is unimaginable without Brahmagupta's zero. Every computer, smartphone, and digital device runs on the binary dance of zero and one.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The World Built on Zero', hi: 'शून्य पर टिकी दुनिया', sa: 'शून्य पर टिकी दुनिया' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Binary computing:', hi: 'द्विआधारी संगणना:', sa: 'द्विआधारी संगणना:' }, locale)}</span>{' '}
            {tl({ en: 'Every bit is 0 or 1. Billions of transistors switch between 0 and 1 per second. All impossible without zero.', hi: 'हर बिट 0 या 1 है। अरबों ट्रांजिस्टर प्रति सेकण्ड 0 और 1 के बीच स्विच करते हैं। यह सब शून्य के बिना असम्भव।', sa: 'हर बिट 0 या 1 है। अरबों ट्रांजिस्टर प्रति सेकण्ड 0 और 1 के बीच स्विच करते हैं। यह सब शून्य के बिना असम्भव।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Calculus:', hi: 'कलन (Calculus):', sa: 'कलन (Calculus):' }, locale)}</span>{' '}
            {tl({ en: "Newton and Leibniz\'s calculus is built on limits approaching zero. No zero = no differential calculus = all laws of physics fail.", hi: "न्यूटन और लाइबनित्ज़ की कलन शून्य की ओर सीमाओं (limits) पर आधारित है। शून्य के बिना कोई अवकल गणित नहीं — भौतिकी के सभी नियम विफल।", sa: "न्यूटन और लाइबनित्ज़ की कलन शून्य की ओर सीमाओं (limits) पर आधारित है। शून्य के बिना कोई अवकल गणित नहीं — भौतिकी के सभी नियम विफल।" }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Algebra:', hi: 'बीजगणित:', sa: 'बीजगणित:' }, locale)}</span>{' '}
            {tl({ en: 'Solving equations — bringing everything to zero — is only possible when zero is a number you can manipulate.', hi: 'समीकरण हल करना — शून्य को एक तरफ लाना — केवल तभी सम्भव जब शून्य एक संख्या हो।', sa: 'समीकरण हल करना — शून्य को एक तरफ लाना — केवल तभी सम्भव जब शून्य एक संख्या हो।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Coordinate systems:', hi: 'निर्देशांक प्रणाली:', sa: 'निर्देशांक प्रणाली:' }, locale)}</span>{' '}
            {tl({ en: 'The origin (0,0) of Cartesian coordinates — the foundation of all physics, engineering, GPS, and maps.', hi: 'कार्तेसियन निर्देशांकों का केन्द्रबिन्दु (0,0) — जिस पर सारी भौतिकी, इंजीनियरिंग और GPS आधारित है।', sa: 'कार्तेसियन निर्देशांकों का केन्द्रबिन्दु (0,0) — जिस पर सारी भौतिकी, इंजीनियरिंग और GPS आधारित है।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Zero's Legacy", hi: "शून्य की विरासत", sa: "शून्य की विरासत" }, locale)}
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

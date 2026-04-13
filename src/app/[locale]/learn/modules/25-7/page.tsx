'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-7.json';

const META: ModuleMeta = {
  id: 'mod_25_7', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.7',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-3' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_7_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_7_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Madhava and the Kerala School                              */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'माधव और केरल स्कूल — कलन का असली जन्मस्थान' : 'Madhava and the Kerala School — The Real Birthplace of Calculus'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>1350 ई. के आसपास, जब यूरोप मध्ययुग के अंत में था और Black Death से उबर रहा था, केरल के एक गाँव में एक गणितज्ञ ऐसी गणनाएँ कर रहा था जो यूरोपीय कलन से 250+ वर्ष आगे थीं।</>
            : <>Around 1350 CE, when Europe was emerging from the Middle Ages and recovering from the Black Death, a mathematician in a Kerala village was performing calculations that would not be matched in Europe for another 250+ years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव की महान खोजें' : "Madhava's Great Discoveries"}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π के लिए अनन्त श्रृंखला:' : 'Infinite series for π:'}</span>{' '}
            {isHi ? 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ... (माधव-लाइबनित्ज़ श्रृंखला)। Europe में 1673 में।' : 'π/4 = 1 − 1/3 + 1/5 − 1/7 + ... (Madhava-Leibniz series). In Europe only in 1673.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'sine की अनन्त श्रृंखला:' : 'Infinite series for sine:'}</span>{' '}
            {isHi ? 'sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... (माधव-Newton श्रृंखला)। Newton को श्रेय ~1670।' : 'sin(x) = x − x³/3! + x⁵/5! − x⁷/7! + ... (Madhava-Newton series). Credit to Newton ~1670.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'cosine की अनन्त श्रृंखला:' : 'Infinite series for cosine:'}</span>{' '}
            {isHi ? 'cos(x) = 1 − x²/2! + x⁴/4! − x⁶/6! + ... Newton को श्रेय।' : 'cos(x) = 1 − x²/2! + x⁴/4! − x⁶/6! + ... Credit to Newton.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π का 11 दशमलव तक मान:' : 'Pi to 11 decimal places:'}</span>{' '}
            {isHi ? '3.14159265359 — यूरोप में ~1600 ई. तक नहीं।' : '3.14159265359 — not matched in Europe until ~1600 CE.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'अभिसरण त्वरण:' : 'Convergence acceleration:'}</span>{' '}
            {isHi ? 'श्रृंखलाओं के लिए सुधार पद जो तेज़ अभिसरण देते हैं — Euler से 300+ वर्ष पहले।' : 'Correction terms for series giving faster convergence — 300+ years before Euler.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव की ऐतिहासिक स्थिति' : "Madhava's Historical Position"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>माधव के मूल ग्रन्थ अधिकतर खो गए हैं। उनका काम बाद के केरल स्कूल के ग्रन्थों में उद्धरणों के माध्यम से जाना जाता है — विशेष रूप से युक्तिभाषा (ज्येष्ठदेव, ~1530) और तन्त्रसंग्रह (नीलकण्ठ सोमयाजी, ~1501)।</>
            : <>Madhava's original works are mostly lost. His work is known through quotations in later Kerala School texts — particularly the Yuktibhasha (Jyeshthadeva, ~1530) and Tantrasangraha (Nilakantha Somayaji, ~1501).</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>20वीं शताब्दी में, विद्वानों (विशेष रूप से K.V. Sarma) के शोध ने माधव के योगदान की सीमा को स्पष्ट किया। 1994 में, गणितज्ञ Victor Katz ने पुष्टि की कि माधव की श्रृंखलाएँ Newton और Leibniz की "टेलर श्रृंखलाओं" के समान हैं।</>
            : <>In the 20th century, scholarship (particularly K.V. Sarma's work) clarified the extent of Madhava's contributions. In 1994, mathematician Victor Katz confirmed that Madhava's series are identical to Newton and Leibniz's "Taylor series."</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Yuktibhasha: Proofs and Proto-Calculus                 */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'युक्तिभाषा — प्रोटो-कलन की प्रमाण-पुस्तक' : 'Yuktibhasha — The Proof-Text of Proto-Calculus'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>~1530 ई. में ज्येष्ठदेव की युक्तिभाषा केरल स्कूल की सबसे महत्त्वपूर्ण विरासत है। यह मलयालम में लिखा गया एकमात्र प्राचीन भारतीय गणित ग्रन्थ है — और इसमें ऐसी गणितीय अवधारणाएँ हैं जो आधुनिक कलन की अग्रदूत हैं।</>
            : <>Jyeshthadeva's Yuktibhasha (~1530 CE) is the most important legacy of the Kerala School. It is the only ancient Indian mathematics text written in Malayalam — and contains mathematical concepts that are precursors to modern calculus.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'युक्तिभाषा में क्या है?' : 'What Is in the Yuktibhasha?'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'π की अनन्त श्रृंखला का प्रमाण:' : 'Proof of the infinite series for π:'}</span>{' '}
            {isHi ? 'एक जटिल लेकिन कठोर ज्यामितीय-बीजगणितीय प्रमाण जो माधव की π श्रृंखला को व्युत्पन्न करता है।' : 'A complex but rigorous geometric-algebraic proof that derives Madhava\'s π series.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'Sine और Cosine श्रृंखलाओं के प्रमाण:' : 'Proofs of sine and cosine series:'}</span>{' '}
            {isHi ? 'विस्तृत प्रमाण जो sin(x) और cos(x) को अनन्त बहुपदों के रूप में व्यक्त करते हैं।' : 'Detailed proofs expressing sin(x) and cos(x) as infinite polynomials.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'पुनरावृत्ति और सीमाएँ:' : 'Iteration and limits:'}</span>{' '}
            {isHi ? 'आधुनिक "limit" अवधारणा के अग्रदूत — किसी प्रक्रिया को अनन्त बार दोहराकर एक निश्चित मान पर पहुँचना।' : 'Precursor to modern "limit" concept — reaching a definite value by iterating a process infinitely many times.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सुधार पद:' : 'Correction terms:'}</span>{' '}
            {isHi ? 'n/(4n²+1) रूप के सुधार पद जो श्रृंखला को बहुत तेज़ी से अभिसरण करते हैं।' : 'Correction terms of the form n/(4n²+1) that make the series converge much faster.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'कलन की मूल अवधारणाएँ — केरल स्कूल में' : 'Core Calculus Concepts — in the Kerala School'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सीमा (Limit):' : 'Limit:'}</span>{' '}
            {isHi ? 'युक्तिभाषा में अनन्त प्रक्रियाओं के माध्यम से निश्चित मानों पर पहुँचने का स्पष्ट विचार।' : 'Clear idea of reaching definite values through infinite processes in the Yuktibhasha.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'अनन्त श्रृंखला योग:' : 'Infinite series summation:'}</span>{' '}
            {isHi ? 'अनन्त पदों के योग के परिणामस्वरूप परिमित संख्या — कलन का मूल तत्व।' : 'The sum of infinitely many terms resulting in a finite number — a core element of calculus.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'सूक्ष्म भिन्नता (Infinitesimal):' : 'Infinitesimals:'}</span>{' '}
            {isHi ? 'श्रृंखला व्युत्पत्तियों में अनन्त रूप से छोटे मात्राओं का अंतर्निहित उपयोग।' : 'Implicit use of infinitely small quantities in the series derivations.'}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — The Transmission Question and Legacy                       */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'संचरण प्रश्न और विरासत' : 'The Transmission Question and Legacy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सबसे बड़ा प्रश्न: क्या केरल स्कूल का ज्ञान यूरोप में पहुँचा? और यदि नहीं, तो इसका इतिहास में क्या स्थान है?</>
            : <>The biggest question: did Kerala School knowledge reach Europe? And if not, what is its place in history?</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'क्या ज्ञान यूरोप पहुँचा? — बहस' : 'Did Knowledge Reach Europe? — The Debate'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">पक्ष में:</span> जेसुइट मिशनरी 16वीं-17वीं शताब्दी में केरल में सक्रिय थे। मत्तेओ रिक्की और क्रिस्टोफर क्लेवियस जैसे जेसुइट पुजारी भारतीय खगोल विज्ञान में रुचि रखते थे। कुछ केरल ग्रन्थ यूरोप भेजे गए होंगे।</>
            : <><span className="text-gold-light font-medium">Evidence for:</span> Jesuit missionaries were active in Kerala in the 16th–17th centuries. Jesuit priests like Matteo Ricci and Christopher Clavius were interested in Indian astronomy. Some Kerala texts may have been sent to Europe.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">विपक्ष में:</span> कोई सीधा दस्तावेज़ी प्रमाण नहीं। Newton और Leibniz के पत्र-व्यवहार में केरल का कोई उल्लेख नहीं। स्वतन्त्र खोज असंभव नहीं।</>
            : <><span className="text-gold-light font-medium">Evidence against:</span> No direct documentary evidence found. No mention of Kerala in Newton or Leibniz correspondence. Independent discovery is not impossible.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">वर्तमान सहमति:</span> अधिकांश इतिहासकार इसे "प्रशंसनीय लेकिन अपुष्ट" मानते हैं। सबसे महत्त्वपूर्ण तथ्य यह है कि भारत में कलन 250+ वर्ष पहले विकसित हुआ — चाहे यूरोप ने इसे जाना या नहीं।</>
            : <><span className="text-gold-light font-medium">Current consensus:</span> Most historians consider it "plausible but unconfirmed." The key fact remains: calculus developed in India 250+ years before Europe — whether Europe knew it or not.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'केरल स्कूल की विरासत' : "The Kerala School's Legacy"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>केरल स्कूल ने साबित किया कि कलन के विकास के लिए न्यूटनीय भौतिकी की आवश्यकता नहीं थी — खगोल विज्ञान और त्रिकोणमिति की ज़रूरतें पर्याप्त थीं। अधिक सटीक ग्रहण की भविष्यवाणी, बेहतर नौवहन, और सूर्योदय/अस्त का सटीक समय — ये व्यावहारिक ज़रूरतें गणित को आगे धकेल रही थीं।</>
            : <>The Kerala School proved that calculus didn't require Newtonian physics — the needs of astronomy and trigonometry were sufficient. More precise eclipse prediction, better navigation, and accurate sunrise/sunset times — these practical needs were driving mathematics forward.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह पञ्चाङ्ग प्रतिदिन ग्रहों की स्थिति, सूर्योदय, और ग्रहण की गणना करता है। इन गणनाओं में आर्यभट की ज्या सारणी, माधव की श्रृंखला-त्वरण तकनीक, और ब्रह्मगुप्त के शून्य — तीनों एक साथ काम करते हैं। भारतीय गणित का जीवित उपयोग।</>
            : <>This Panchang computes planetary positions, sunrise, and eclipses every day. In these calculations, Aryabhata's jya table, Madhava's series-acceleration technique, and Brahmagupta's zero all work together. Living use of Indian mathematics.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_7Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

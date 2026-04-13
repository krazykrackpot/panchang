'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-5.json';

const META: ModuleMeta = {
  id: 'mod_25_5', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.5',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-4' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-7' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_5_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 3,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_5_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Pingala and the Chandahshastra                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
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
  const isHi = isDevanagariLocale(locale);
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
  const isHi = isDevanagariLocale(locale);
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

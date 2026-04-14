'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-2.json';

const META: ModuleMeta = {
  id: 'mod_26_2', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/26-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/26-3' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/26-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 3,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q26_2_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Concept Before Newton                                  */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Gravity: The Indian Tradition', hi: 'गुरुत्वाकर्षण: भारतीय परम्परा', sa: 'गुरुत्वाकर्षण: भारतीय परम्परा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>न्यूटन के सेब की कहानी प्रसिद्ध है — 1665 में गिरते सेब ने गुरुत्वाकर्षण का नियम प्रेरित किया। लेकिन पृथ्वी को एक ऐसी वस्तु के रूप में देखना जो चीज़ों को अपनी ओर खींचती है, भारत में न्यूटन से 1,000 से अधिक वर्ष पहले से एक स्थापित वैज्ञानिक विचार था।</>
            : <>Newton's apple story is famous — a falling apple in 1665 inspired the law of gravity. But seeing the Earth as an object that pulls things toward itself was an established scientific idea in India more than 1,000 years before Newton.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Three Indian Precedents', hi: 'तीन भारतीय पूर्वाभास', sa: 'तीन भारतीय पूर्वाभास' }, locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Varahamihira (505 CE)', hi: 'वराहमिहिर (505 ईस्वी)', sa: 'वराहमिहिर (505 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: "Brihat Samhita — describes Earth\'s inherent attractive force. Asks: why do objects below a spherical Earth not fall off? Answer: Earth attracts everything.", hi: "बृहत् संहिता — पृथ्वी के अंतर्निहित आकर्षण बल का वर्णन। पूछते हैं: गोलाकार पृथ्वी के नीचे की वस्तुएँ क्यों नहीं गिरती? उत्तर: पृथ्वी सब कुछ आकर्षित करती है।", sa: "बृहत् संहिता — पृथ्वी के अंतर्निहित आकर्षण बल का वर्णन। पूछते हैं: गोलाकार पृथ्वी के नीचे की वस्तुएँ क्यों नहीं गिरती? उत्तर: पृथ्वी सब कुछ आकर्षित करती है।" }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Brahmagupta (628 CE)', hi: 'ब्रह्मगुप्त (628 ईस्वी)', sa: 'ब्रह्मगुप्त (628 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Brahmasphutasiddhanta — "The Earth attracts all bodies toward itself." Clear and concise statement.', hi: 'ब्रह्मस्फुटसिद्धान्त — "पृथ्वी सभी पिण्डों को अपनी ओर आकर्षित करती है।" स्पष्ट और संक्षिप्त कथन।', sa: 'ब्रह्मस्फुटसिद्धान्त — "पृथ्वी सभी पिण्डों को अपनी ओर आकर्षित करती है।" स्पष्ट और संक्षिप्त कथन।' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Bhaskaracharya (1150 CE)', hi: 'भास्कराचार्य (1150 ईस्वी)', sa: 'भास्कराचार्य (1150 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Siddhanta Shiromani — most detailed treatment. "The Earth has the quality of attraction. All heavy objects fall to the Earth." Extended discussion in Goladhyaya.', hi: 'सिद्धान्त शिरोमणि — सबसे विस्तृत उपचार। "पृथ्वी में आकर्षण का गुण है। सभी भारी वस्तुएँ पृथ्वी पर गिरती हैं।" गोलाध्याय में विस्तृत चर्चा।', sa: 'सिद्धान्त शिरोमणि — सबसे विस्तृत उपचार। "पृथ्वी में आकर्षण का गुण है। सभी भारी वस्तुएँ पृथ्वी पर गिरती हैं।" गोलाध्याय में विस्तृत चर्चा।' }, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Bhaskaracharya\'s Original Verse", hi: "भास्कराचार्य का मूल श्लोक", sa: "भास्कराचार्य का मूल श्लोक" }, locale)}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4">
          <p className="text-gold-light text-xs italic leading-relaxed">
            {tl({ en: '"The Earth has the power of attraction on all sides. Heavy bodies fall in the sky (toward Earth). Therefore the Earth is the support of all."', hi: '"पृथ्व्याः समन्तात् आकर्षणशक्तिः। पतन्ति गुरूणि नभसि।  अतः पृथ्वी सर्वाधारा।"', sa: '"पृथ्व्याः समन्तात् आकर्षणशक्तिः। पतन्ति गुरूणि नभसि।  अतः पृथ्वी सर्वाधारा।"' }, locale)}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {tl({ en: 'Bhaskaracharya, Siddhanta Shiromani, Goladhyaya (1150 CE)', hi: 'भास्कराचार्य, सिद्धान्त शिरोमणि, गोलाध्याय (1150 ईस्वी)', sa: 'भास्कराचार्य, सिद्धान्त शिरोमणि, गोलाध्याय (1150 ईस्वी)' }, locale)}</p>
        </blockquote>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — What Newton Added                                          */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Newton Added', hi: 'न्यूटन ने क्या जोड़ा', sa: 'न्यूटन ने क्या जोड़ा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारतीय वैज्ञानिकों की अंतर्दृष्टि को स्वीकार करना न्यूटन की उपलब्धि को कम नहीं करता। न्यूटन ने कुछ ऐसा किया जो भारतीय ग्रन्थों ने नहीं किया: उन्होंने गुरुत्वाकर्षण को एक सटीक, सार्वत्रिक गणितीय नियम में औपचारिक रूप दिया।</>
            : <>Acknowledging Indian insights does not diminish Newton's achievement. Newton did something Indian texts did not: he formalized gravity into a precise, universal mathematical law.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Newton\'s Three Contributions", hi: "न्यूटन के तीन योगदान", sa: "न्यूटन के तीन योगदान" }, locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-semibold mb-1">{tl({ en: '1. Precise Mathematical Formula', hi: '1. सटीक गणितीय सूत्र', sa: '1. सटीक गणितीय सूत्र' }, locale)}</p>
            <p className="font-mono text-gold-primary text-sm text-center my-2">F = Gm₁m₂/r²</p>
            <p>{tl({ en: 'Force = gravitational constant × (mass1 × mass2) / distance². Inverse-square law — double the distance, force reduces fourfold.', hi: 'बल = गुरुत्वाकर्षण स्थिरांक × (द्रव्यमान1 × द्रव्यमान2) / दूरी²। व्युत्क्रम-वर्ग नियम — दूरी दोगुनी होने पर बल चौगुना कम।', sa: 'बल = गुरुत्वाकर्षण स्थिरांक × (द्रव्यमान1 × द्रव्यमान2) / दूरी²। व्युत्क्रम-वर्ग नियम — दूरी दोगुनी होने पर बल चौगुना कम।' }, locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{tl({ en: '2. Unification: Terrestrial + Celestial Gravity', hi: '2. एकीकरण: स्थलीय + खगोलीय गुरुत्वाकर्षण', sa: '2. एकीकरण: स्थलीय + खगोलीय गुरुत्वाकर्षण' }, locale)}</p>
            <p>{tl({ en: 'Newton proved that the gravity pulling apples and the gravity keeping the Moon in orbit are the SAME force. This unification was revolutionary.', hi: 'न्यूटन ने साबित किया कि वह गुरुत्वाकर्षण जो सेब गिराता है और वह जो चन्द्रमा को कक्षा में रखता है — एक ही बल है। यह एकीकरण विज्ञान में क्रांतिकारी था।', sa: 'न्यूटन ने साबित किया कि वह गुरुत्वाकर्षण जो सेब गिराता है और वह जो चन्द्रमा को कक्षा में रखता है — एक ही बल है। यह एकीकरण विज्ञान में क्रांतिकारी था।' }, locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{tl({ en: '3. Universality', hi: '3. सार्वत्रिकता', sa: '3. सार्वत्रिकता' }, locale)}</p>
            <p>{tl({ en: 'The law is universal — Earth, Moon, Sun, every body attracts every other by the same formula.', hi: 'यह नियम सार्वत्रिक है — पृथ्वी, चन्द्रमा, सूर्य, हर पिण्ड हर दूसरे पिण्ड को एक ही सूत्र से आकर्षित करता है।', sa: 'यह नियम सार्वत्रिक है — पृथ्वी, चन्द्रमा, सूर्य, हर पिण्ड हर दूसरे पिण्ड को एक ही सूत्र से आकर्षित करता है।' }, locale)}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Fair Assessment', hi: 'न्यायोचित मूल्यांकन', sa: 'न्यायोचित मूल्यांकन' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय योगदान: गुरुत्वाकर्षण को एक वास्तविक भौतिक बल के रूप में पहचानना, इसे पृथ्वी की एक अंतर्निहित संपत्ति के रूप में वर्णित करना, और यह समझाना कि पृथ्वी का गोलाकार रूप क्यों स्थिर है। न्यूटन का योगदान: सटीक गणितीय सूत्र, व्युत्क्रम-वर्ग नियम, स्थलीय और खगोलीय गुरुत्वाकर्षण का एकीकरण, और सार्वत्रिक नियम की खोज। दोनों योगदान वास्तविक और महत्त्वपूर्ण हैं।</>
            : <>Indian contribution: recognizing gravity as a real physical force, describing it as an intrinsic property of the Earth, and explaining why Earth's spherical shape is stable. Newton's contribution: precise mathematical formula, inverse-square law, unification of terrestrial and celestial gravity, and discovery of the universal law. Both contributions are real and significant.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Bhaskaracharya's Broader Genius                           */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Bhaskaracharya: Universal Genius', hi: 'भास्कराचार्य: बहुमुखी प्रतिभा', sa: 'भास्कराचार्य: बहुमुखी प्रतिभा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गुरुत्वाकर्षण का वर्णन केवल भास्कराचार्य की असाधारण प्रतिभा का एक पहलू है। वे शायद प्राचीन भारत के सबसे बहुमुखी गणितज्ञ थे, जो कई क्षेत्रों में अपने युग से सदियों आगे थे।</>
            : <>The description of gravity is just one aspect of Bhaskaracharya's extraordinary genius. He was perhaps ancient India's most versatile mathematician, centuries ahead of his time in multiple fields.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Bhaskaracharya\'s Notable Achievements", hi: "भास्कराचार्य की उल्लेखनीय उपलब्धियाँ", sa: "भास्कराचार्य की उल्लेखनीय उपलब्धियाँ" }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {tl({ en: "Gravity: described Earth\'s attractive force (1150 CE)", hi: "गुरुत्वाकर्षण: पृथ्वी के आकर्षण बल का वर्णन (1150 ईस्वी)", sa: "गुरुत्वाकर्षण: पृथ्वी के आकर्षण बल का वर्णन (1150 ईस्वी)" }, locale)}</p>
          <p>→ {tl({ en: 'Differential calculus: studied instantaneous velocity — 500 years before Newton/Leibniz', hi: 'अवकलन गणित: गतिशील वस्तुओं के वेग का अध्ययन — न्यूटन/लाइबनिज से 500 वर्ष पहले', sa: 'अवकलन गणित: गतिशील वस्तुओं के वेग का अध्ययन — न्यूटन/लाइबनिज से 500 वर्ष पहले' }, locale)}</p>
          <p>→ {tl({ en: "Cyclic quadratic equations: solved Pell\'s equation — 600 years before Europe", hi: "चक्रीय द्विघात समीकरण: पेल समीकरण के समाधान — यूरोप से 600 वर्ष पहले", sa: "चक्रीय द्विघात समीकरण: पेल समीकरण के समाधान — यूरोप से 600 वर्ष पहले" }, locale)}</p>
          <p>→ {tl({ en: 'Trigonometry: sine and cosine sum and difference formulas', hi: 'त्रिकोणमिति: sine और cosine योगफल और अंतर सूत्र', sa: 'त्रिकोणमिति: sine और cosine योगफल और अंतर सूत्र' }, locale)}</p>
          <p>→ {tl({ en: 'Division by zero: discussed the concept of n/0 = ∞', hi: 'शून्य से भाग: n/0 = ∞ की अवधारणा पर चर्चा', sa: 'शून्य से भाग: n/0 = ∞ की अवधारणा पर चर्चा' }, locale)}</p>
          <p>→ {tl({ en: "Spherical Earth: explicit description of Earth\'s spherical shape", hi: "गोलाकार पृथ्वी: पृथ्वी के गोलाकार आकार का स्पष्ट वर्णन", sa: "गोलाकार पृथ्वी: पृथ्वी के गोलाकार आकार का स्पष्ट वर्णन" }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Historical Context', hi: 'ऐतिहासिक प्रासंगिकता', sa: 'ऐतिहासिक प्रासंगिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>1150 ईस्वी में — जब भास्कराचार्य लिख रहे थे — यूरोप गहरे मध्ययुगीन काल में था। विश्वविद्यालय अभी उभर रहे थे (बोलोग्ना 1088, ऑक्सफोर्ड 1096)। वैज्ञानिक विचार मुख्यतः धार्मिक प्रशासन के अधीन था। इसी समय भास्कराचार्य अवकलन गणित के पूर्वाभास, गुरुत्वाकर्षण, और उन्नत बीजगणित लिख रहे थे — यह भारतीय बौद्धिक परम्परा की जीवन्तता का प्रमाण है।</>
            : <>In 1150 CE — when Bhaskaracharya was writing — Europe was in the deep medieval period. Universities were just emerging (Bologna 1088, Oxford 1096). Scientific thought was largely under religious authority. At this same time, Bhaskaracharya was writing precursors to differential calculus, gravity, and advanced algebra — a testament to the vitality of the Indian intellectual tradition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

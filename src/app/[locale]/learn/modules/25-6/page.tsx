'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-6.json';

const META: ModuleMeta = {
  id: 'mod_25_6', phase: 6, topic: 'Indian Contributions', moduleNumber: '25.6',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_6_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_6_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Musical Origin                                         */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Born From a Music Problem', hi: 'एक संगीत समस्या से जन्म', sa: 'संगीतसमस्यायाः उद्भवः' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>फिबोनाची अनुक्रम (1, 1, 2, 3, 5, 8, 13, 21…) को पश्चिम में इटालियन गणितज्ञ लियोनार्डो ऑफ पीसा (फिबोनाची) के नाम पर जाना जाता है, जिन्होंने 1202 ईस्वी में लिबेर अबासी में खरगोश की आबादी की समस्या में इसका उपयोग किया। लेकिन भारतीय संगीतशास्त्री और गणितज्ञ इसी अनुक्रम को कम से कम 1,000 वर्ष पहले — संगीत और कविता के माध्यम से — जानते थे।</>
            : <>The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21…) is named in the West after Italian mathematician Leonardo of Pisa (Fibonacci), who used it in a rabbit population problem in Liber Abaci in 1202 CE. But Indian musicologists and mathematicians knew the same sequence at least 1,000 years earlier — through the mathematics of music and poetry.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Tala and Meter Problem', hi: 'ताल और छन्द की समस्या', sa: 'तालच्छन्दसोः समस्या' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>संस्कृत कविता में दो प्रकार के अक्षर होते हैं: <span className="text-gold-light font-medium">लघु (L)</span> — 1 मात्रा, और <span className="text-gold-light font-medium">गुरु (G)</span> — 2 मात्राएँ। प्रश्न: n मात्राओं की एक पंक्ति को लघु और गुरु अक्षरों का उपयोग करके कितने तरीकों से भरा जा सकता है?</>
            : <>Sanskrit poetry uses two types of syllables: <span className="text-gold-light font-medium">laghu (L)</span> — 1 beat, and <span className="text-gold-light font-medium">guru (G)</span> — 2 beats. The question: how many ways can a line of n beats be filled using laghus and gurus?</>}
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs">
          <p className="text-text-secondary"><span className="text-gold-light">n=1:</span> {tl({ en: 'L → 1 way', hi: 'L → 1 तरीका', sa: 'L → 1 प्रकारः' }, locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=2:</span> {tl({ en: 'LL, G → 2 ways', hi: 'LL, G → 2 तरीके', sa: 'LL, G → 2 प्रकारौ' }, locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=3:</span> {tl({ en: 'LLL, LG, GL → 3 ways', hi: 'LLL, LG, GL → 3 तरीके', sa: 'LLL, LG, GL → 3 प्रकाराः' }, locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=4:</span> {tl({ en: 'LLLL, LLG, LGL, GLL, GG → 5 ways', hi: 'LLLL, LLG, LGL, GLL, GG → 5 तरीके', sa: 'LLLL, LLG, LGL, GLL, GG → 5 प्रकाराः' }, locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=5:</span> {tl({ en: '8 ways', hi: '8 तरीके', sa: '8 प्रकाराः' }, locale)} &nbsp;<span className="text-gold-light">n=6:</span> {tl({ en: '13 ways', hi: '13 तरीके', sa: '13 प्रकाराः' }, locale)}</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {tl({ en: 'The pattern: 1, 2, 3, 5, 8, 13… — that is the Fibonacci sequence!', hi: 'पैटर्न: 1, 2, 3, 5, 8, 13… — यही फिबोनाची अनुक्रम है!', sa: 'आवृत्तिः: 1, 2, 3, 5, 8, 13… — एषः एव फिबोनाची-अनुक्रमः अस्ति!' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Bharata Muni — 200 BCE', hi: 'भरत मुनि — 200 ईसा पूर्व', sa: 'भरतमुनिः — ईसापूर्व 200' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>नाट्यशास्त्र के रचयिता भरत मुनि (लगभग 200 ईसा पूर्व) ने काव्य-छन्दों के विश्लेषण में इस पैटर्न का पहली बार वर्णन किया। उनका कार्य ताल — भारतीय शास्त्रीय संगीत की लयबद्ध चक्र प्रणाली — के साथ गहराई से जुड़ा था, जहाँ अक्षरों के संयोजन को गिनने की आवश्यकता थी। यह फिबोनाची से 1,400 वर्ष पहले था।</>
            : <>Bharata Muni (c. 200 BCE), author of the Natyashastra, first described this pattern in analysing poetic meters. His work was deeply connected to tala — the rhythmic cycle system of Indian classical music — where counting syllable combinations was a practical necessity. This was 1,400 years before Fibonacci.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — From Virahanka to Hemachandra                             */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'From Virahanka to Hemachandra', hi: 'विरहांक से हेमचन्द्र तक', sa: 'विरहाङ्कात् हेमचन्द्रपर्यन्तम्' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भरत मुनि के बाद, भारतीय गणितज्ञों की एक श्रृंखला ने इस अनुक्रम को और परिष्कृत किया। प्रत्येक ने पिछले पर निर्माण किया, अन्ततः एक स्पष्ट गणितीय सूत्र तक पहुँचा — जो फिबोनाची से बहुत पहले।</>
            : <>After Bharata Muni, a chain of Indian mathematicians refined the sequence further. Each built on the previous, eventually arriving at an explicit mathematical formula — long before Fibonacci.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Indian Lineage', hi: 'भारतीय वंश-वृक्ष', sa: 'भारतीयः परम्परावंशः' }, locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Pingala (~300 BCE)', hi: 'पिंगल (~300 ईसा पूर्व)', sa: 'पिङ्गलः (~ईसापूर्व 300)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Chandahshastra — the oldest known treatise on metrical sequences. Pingala developed a coding system for binary sequences and discussed the counting of metrical patterns that implicitly encodes the sequence.', hi: 'छन्दःशास्त्र — मेट्रिकल अनुक्रमों पर सबसे पुराना ज्ञात ग्रन्थ। पिंगल ने द्विआधारी अनुक्रमों का एक कोडिंग सिस्टम विकसित किया और मेट्रिकल पैटर्न की गणना की चर्चा की जो अनुक्रम को निहित रूप से एन्कोड करती है।', sa: 'छन्दःशास्त्र — मेट्रिकल अनुक्रमों पर सबसे पुराना ज्ञात ग्रन्थ। पिंगल ने द्विआधारी अनुक्रमों का एक कोडिंग सिस्टम विकसित किया और मेट्रिकल पैटर्न की गणना की चर्चा की जो अनुक्रम को निहित रूप से एन्कोड करती है।' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Bharata Muni (~200 BCE)', hi: 'भरत मुनि (~200 ईसा पूर्व)', sa: 'भरतमुनिः (~ईसापूर्व 200)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Natyashastra — first explicit description of the sequence in the analysis of tala patterns. Practical applications in music and poetry.', hi: 'नाट्यशास्त्र — ताल पैटर्न के विश्लेषण में अनुक्रम का प्रथम स्पष्ट वर्णन। संगीत और कविता में व्यावहारिक अनुप्रयोग।', sa: 'नाट्यशास्त्रम् — तालपद्धतिविश्लेषणे अनुक्रमस्य प्रथमः स्पष्टः उल्लेखः। संगीते काव्ये च व्यावहारिकः प्रयोगः।' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Virahanka (~600 CE)', hi: 'विरहांक (~600 ईस्वी)', sa: 'विरहाङ्कः (~600 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Commentary on Pingala — explicitly stated the recurrence rule: F(n) = F(n-1) + F(n-2). This was the first time the rule was made mathematically explicit.', hi: 'पिंगल पर टिप्पणी — स्पष्ट रूप से पुनरावृत्ति नियम बताया: F(n) = F(n-1) + F(n-2)। यह पहली बार था जब नियम को गणितीय रूप से स्पष्ट किया गया।', sa: 'पिङ्गलस्य व्याख्यानम् — आवर्तन-नियमः स्पष्टतया उक्तः: F(n) = F(n-1) + F(n-2)। एतत् प्रथमवारं नियमः गणितीयरूपेण स्पष्टीकृतः।' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Gopala (~1100 CE)', hi: 'गोपाल (~1100 ईस्वी)', sa: 'गोपालः (~1100 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Extended work on the sequence and its properties. Comprehensive listing of patterns in metrical poetry.', hi: 'अनुक्रम और उसके गुणों पर विस्तारित कार्य। छन्द कविता में पैटर्न की व्यापक सूची।', sa: 'अनुक्रमस्य तद्गुणानां च विस्तृतः अध्ययनः। छान्दस-काव्येषु आवृत्तीनां सम्पूर्णा सूची।' }, locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{tl({ en: 'Hemachandra (1150 CE)', hi: 'हेमचन्द्र (1150 ईस्वी)', sa: 'हेमचन्द्रः (1150 ईस्वी)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {tl({ en: 'Comprehensive treatise on Jain poetic meters. Full treatment of the recurrence and sequence, exactly 52 years before Fibonacci. Sometimes called the "Hemachandra sequence" in India.', hi: 'जैन काव्य छन्दों पर व्यापक ग्रन्थ। फिबोनाची से ठीक 52 वर्ष पहले पुनरावृत्ति और अनुक्रम का पूर्ण उपचार। भारत में कभी-कभी "हेमचन्द्र अनुक्रम" कहा जाता है।', sa: 'जैन काव्य छन्दों पर व्यापक ग्रन्थ। फिबोनाची से ठीक 52 वर्ष पहले पुनरावृत्ति और अनुक्रम का पूर्ण उपचार। भारत में कभी-कभी "हेमचन्द्र अनुक्रम" कहा जाता है।' }, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Why Music Generates Mathematics', hi: 'क्यों संगीत गणित पैदा करता है', sa: 'संगीतं गणितं कथं जनयति' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय शास्त्रीय संगीत गणितीय रूप से सटीक है। ताल प्रणाली को अनुक्रमों, चक्रों और संयोजनों की सटीक गणना की आवश्यकता है। एक संगीतकार को यह जानने की आवश्यकता होती है कि 8-बीट चक्र में कितने अलग-अलग लय पैटर्न संभव हैं — यह ठीक वही प्रश्न है जो फिबोनाची संख्याओं की ओर ले जाता है। भारतीय परम्परा में गणित और संगीत कभी अलग नहीं थे।</>
            : <>Indian classical music is mathematically precise. The tala system requires exact counting of sequences, cycles, and combinations. A musician needs to know how many distinct rhythmic patterns are possible in an 8-beat cycle — this is precisely the question that leads to Fibonacci numbers. In the Indian tradition, mathematics and music were never separate.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Transmission to Fibonacci and Legacy                      */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Arab-Indian Transmission and Legacy', hi: 'अरब-भारतीय प्रेषण और विरासत', sa: 'अरब-भारतीय-संप्रेषणं तत्परम्परा च' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारत से यूरोप तक ज्ञान का प्रवाह अरब-इस्लामी दुनिया से होकर गया। 8वीं शताब्दी ईस्वी से, अरब विद्वानों ने भारतीय गणितीय ग्रन्थों का बड़े पैमाने पर अनुवाद और विस्तार किया। यही वह मार्ग था जिससे होकर फिबोनाची — जिन्होंने उत्तरी अफ्रीका में अरब गणितज्ञों से सीखा — इस अनुक्रम तक पहुँचे।</>
            : <>The flow of knowledge from India to Europe passed through the Arab-Islamic world. From the 8th century CE, Arab scholars translated and expanded Indian mathematical texts on a large scale. This was the path by which Fibonacci — who learned from Arab mathematicians in North Africa — encountered the sequence.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The Path of Knowledge', hi: 'ज्ञान का मार्ग', sa: 'ज्ञानस्य मार्गः' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{tl({ en: '200 BCE – 1150 CE:', hi: '200 ईसा पूर्व – 1150 ईस्वी:', sa: '200 ईसापूर्व – 1150 ईस्वी:' }, locale)}</span> {tl({ en: 'Sequence developed in Indian prosody — Bharata Muni to Hemachandra.', hi: 'भारतीय छन्दशास्त्र में अनुक्रम का विकास — भरत मुनि से हेमचन्द्र तक।', sa: 'भारतीयछन्दःशास्त्रे अनुक्रमस्य विकासः — भरतमुनेः हेमचन्द्रपर्यन्तम्।' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: '8th–10th century CE:', hi: '8वीं–10वीं शताब्दी ईस्वी:', sa: '8म–10म शताब्द्यः ईस्वी:' }, locale)}</span> {tl({ en: 'Arab scholars translate Indian mathematical texts — Al-Khwarizmi, Al-Biruni. Indian algebra, numeral system, and prosody became available in Arabic.', hi: 'अरब विद्वानों ने भारतीय गणितीय ग्रन्थों का अनुवाद किया — अल-खवारिज्मी, अल-बिरूनी। भारतीय बीजगणित, अंक प्रणाली और छन्दशास्त्र अरबी में उपलब्ध हो गए।', sa: 'अरब-विद्वद्भिः भारतीय-गणितग्रन्थाः अनूदिताः — अल्-ख्वारिज्मी, अल्-बिरूनी। भारतीयं बीजगणितं, अङ्कपद्धतिः, छन्दःशास्त्रं च अरबी-भाषायां सुलभं जातम्।' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: '1170–1190 CE:', hi: '1170–1190 ईस्वी:', sa: '1170–1190 ईस्वी:' }, locale)}</span> {tl({ en: "Fibonacci\'s youth. His father was a Pisan trading representative in Bugia (modern Algeria). Fibonacci studied there and later at Arab centres around the Mediterranean.", hi: "फिबोनाची का युवाकाल। उनके पिता पीसा के व्यापारिक प्रतिनिधि के रूप में बुगिया (आधुनिक अल्जीरिया) में थे। फिबोनाची ने वहाँ और बाद में भूमध्यसागरीय अरब केन्द्रों में अध्ययन किया।", sa: "फिबोनाची का युवाकाल। उनके पिता पीसा के व्यापारिक प्रतिनिधि के रूप में बुगिया (आधुनिक अल्जीरिया) में थे। फिबोनाची ने वहाँ और बाद में भूमध्यसागरीय अरब केन्द्रों में अध्ययन किया।" }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: '1202 CE:', hi: '1202 ईस्वी:', sa: '1202 ईस्वी:' }, locale)}</span> {tl({ en: 'Liber Abaci published. Fibonacci explicitly credits the Indian numeral system. The rabbit problem presents the sequence.', hi: 'लिबेर अबासी प्रकाशित। फिबोनाची स्पष्ट रूप से भारतीय अंक प्रणाली का श्रेय देते हैं। खरगोश समस्या अनुक्रम प्रस्तुत करती है।', sa: 'लिबेर अबाची प्रकाशितः। फिबोनाची स्पष्टतया भारतीय-अङ्कपद्धतेः श्रेयः ददाति। खरगोश-समस्यया अनुक्रमः प्रस्तूयते।' }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Legacy: What Shall We Call It?', hi: 'विरासत: क्या नाम रखा जाए?', sa: 'परम्परा: वयं किं नाम दद्याम?' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>गणित के इतिहासकार यह तेजी से स्वीकार कर रहे हैं कि अनुक्रम को "फिबोनाची अनुक्रम" के रूप में पहचाना जाना ऐतिहासिक रूप से गलत है। कुछ प्रस्ताव:</>
            : <>Historians of mathematics increasingly acknowledge that identifying the sequence as the "Fibonacci sequence" is historically inaccurate. Some proposals:</>}
        </p>
        <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
          <li>{tl({ en: '"Hemachandra-Fibonacci sequence" — acknowledges both contributions', hi: '"हेमचन्द्र-फिबोनाची अनुक्रम" — दोनों की भूमिका को स्वीकार करता है', sa: '"हेमचन्द्र-फिबोनाची-अनुक्रमः" — उभयोः योगदानं स्वीकरोति' }, locale)}</li>
          <li>{tl({ en: '"Virahanka sequence" — for who first made the recurrence explicit', hi: '"विरहांक अनुक्रम" — जिसने पहले पुनरावृत्ति को स्पष्ट किया', sa: '"विरहाङ्क-अनुक्रमः" — यः प्रथमतः आवर्तनं स्पष्टतया उक्तवान् तस्मै' }, locale)}</li>
          <li>{tl({ en: '"Hemachandra sequence" in India — for the most recent complete Indian treatment', hi: 'भारत में "हेमचन्द्र अनुक्रम" — सबसे हाल के पूर्ण भारतीय उपचार के लिए', sa: 'भारते "हेमचन्द्र-अनुक्रमः" — अद्यतनतमस्य सम्पूर्णभारतीयव्यवहारस्य कृते' }, locale)}</li>
        </ul>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {isHi
            ? <>नाम से परे, महत्त्वपूर्ण बात यह है: भारतीय संगीत की गणितीय परम्परा ने — ताल और छन्द के माध्यम से — एक अनुक्रम की खोज की जो प्रकृति के संरचनात्मक सिद्धान्तों में दिखाई देता है, और यह खोज 1,000 वर्षों से अधिक समय के लिए यूरोप से पहले हुई।</>
            : <>Beyond the name, the important point is this: India's mathematical tradition of music — through tala and meter — discovered a sequence that appears in nature's structural principles, and this discovery preceded Europe by over 1,000 years.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module25_6Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

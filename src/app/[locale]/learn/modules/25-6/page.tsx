'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-6.json';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

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
          {t('bornFromAMusicProblem', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>फिबोनाची अनुक्रम (1, 1, 2, 3, 5, 8, 13, 21…) को पश्चिम में इटालियन गणितज्ञ लियोनार्डो ऑफ पीसा (फिबोनाची) के नाम पर जाना जाता है, जिन्होंने 1202 ईस्वी में लिबेर अबासी में खरगोश की आबादी की समस्या में इसका उपयोग किया। लेकिन भारतीय संगीतशास्त्री और गणितज्ञ इसी अनुक्रम को कम से कम 1,000 वर्ष पहले — संगीत और कविता के माध्यम से — जानते थे।</>
            : <>The Fibonacci sequence (1, 1, 2, 3, 5, 8, 13, 21…) is named in the West after Italian mathematician Leonardo of Pisa (Fibonacci), who used it in a rabbit population problem in Liber Abaci in 1202 CE. But Indian musicologists and mathematicians knew the same sequence at least 1,000 years earlier — through the mathematics of music and poetry.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theTalaAndMeterProblem', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>संस्कृत कविता में दो प्रकार के अक्षर होते हैं: <span className="text-gold-light font-medium">लघु (L)</span> — 1 मात्रा, और <span className="text-gold-light font-medium">गुरु (G)</span> — 2 मात्राएँ। प्रश्न: n मात्राओं की एक पंक्ति को लघु और गुरु अक्षरों का उपयोग करके कितने तरीकों से भरा जा सकता है?</>
            : <>Sanskrit poetry uses two types of syllables: <span className="text-gold-light font-medium">laghu (L)</span> — 1 beat, and <span className="text-gold-light font-medium">guru (G)</span> — 2 beats. The question: how many ways can a line of n beats be filled using laghus and gurus?</>}
        </p>
        <div className="mt-3 space-y-1 font-mono text-xs">
          <p className="text-text-secondary"><span className="text-gold-light">n=1:</span> {t('l1Way', locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=2:</span> {t('lLG2Ways', locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=3:</span> {t('lLLLgGl3Ways', locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=4:</span> {t('lLLLLlgLglGllGg5', locale)}</p>
          <p className="text-text-secondary"><span className="text-gold-light">n=5:</span> {t('8Ways', locale)} &nbsp;<span className="text-gold-light">n=6:</span> {t('13Ways', locale)}</p>
        </div>
        <p className="text-text-secondary text-xs leading-relaxed mt-3">
          {t('thePattern1235', locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('bharataMuni200Bce', locale)}
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
          {t('fromVirahankaToHemachandra', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भरत मुनि के बाद, भारतीय गणितज्ञों की एक श्रृंखला ने इस अनुक्रम को और परिष्कृत किया। प्रत्येक ने पिछले पर निर्माण किया, अन्ततः एक स्पष्ट गणितीय सूत्र तक पहुँचा — जो फिबोनाची से बहुत पहले।</>
            : <>After Bharata Muni, a chain of Indian mathematicians refined the sequence further. Each built on the previous, eventually arriving at an explicit mathematical formula — long before Fibonacci.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theIndianLineage', locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('pingala300Bce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('chandahshastraTheOldestKnownTreatiseOn', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('bharataMuni200Bce2', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('natyashastraFirstExplicitDescriptionOfThe', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('virahanka600Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('commentaryOnPingalaExplicitlyStatedThe', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('gopala1100Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('extendedWorkOnTheSequenceAnd', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('hemachandra1150Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('comprehensiveTreatiseOnJainPoeticMeters', locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('whyMusicGeneratesMathematics', locale)}
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
          {t('arabIndianTransmissionAndLegacy', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारत से यूरोप तक ज्ञान का प्रवाह अरब-इस्लामी दुनिया से होकर गया। 8वीं शताब्दी ईस्वी से, अरब विद्वानों ने भारतीय गणितीय ग्रन्थों का बड़े पैमाने पर अनुवाद और विस्तार किया। यही वह मार्ग था जिससे होकर फिबोनाची — जिन्होंने उत्तरी अफ्रीका में अरब गणितज्ञों से सीखा — इस अनुक्रम तक पहुँचे।</>
            : <>The flow of knowledge from India to Europe passed through the Arab-Islamic world. From the 8th century CE, Arab scholars translated and expanded Indian mathematical texts on a large scale. This was the path by which Fibonacci — who learned from Arab mathematicians in North Africa — encountered the sequence.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('thePathOfKnowledge', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{t('200Bce1150Ce', locale)}</span> {t('sequenceDevelopedInIndianProsodyBharata', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('8th10thCenturyCe', locale)}</span> {t('arabScholarsTranslateIndianMathematicalTexts', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('11701190Ce', locale)}</span> {t('fibonaccisYouthHisFatherWasA', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('1202Ce', locale)}</span> {t('liberAbaciPublishedFibonacciExplicitlyCredits', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('legacyWhatShallWeCallIt', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>गणित के इतिहासकार यह तेजी से स्वीकार कर रहे हैं कि अनुक्रम को "फिबोनाची अनुक्रम" के रूप में पहचाना जाना ऐतिहासिक रूप से गलत है। कुछ प्रस्ताव:</>
            : <>Historians of mathematics increasingly acknowledge that identifying the sequence as the "Fibonacci sequence" is historically inaccurate. Some proposals:</>}
        </p>
        <ul className="text-text-secondary text-xs space-y-1 list-disc list-inside">
          <li>{t('hemachandraFibonacciSequenceAcknowledgesBothContributions', locale)}</li>
          <li>{t('virahankaSequenceForWhoFirstMade', locale)}</li>
          <li>{t('hemachandraSequenceInIndiaForThe', locale)}</li>
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

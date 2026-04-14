'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-3.json';

const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_26_3', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.3',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/26-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/26-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/26-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_3_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q26_3_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Passage and Its Context                                */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('sayanaSRigVedaCommentary', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>14वीं शताब्दी ईस्वी में, विजयनगर साम्राज्य के प्रधानमंत्री और महान संस्कृत विद्वान सायणाचार्य ने ऋग्वेद पर एक व्यापक टिप्पणी लिखी। भजन 1.50.4 पर टिप्पणी करते समय — सूर्य देवता को एक भजन — उन्होंने एक कथन लिखा जो 21वीं शताब्दी में वैज्ञानिकों को चौंका देगा।</>
            : <>In the 14th century CE, Sayanacharya — prime minister of the Vijayanagara Empire and great Sanskrit scholar — wrote a comprehensive commentary on the Rig Veda. While commenting on hymn 1.50.4 — a hymn to the Sun god — he wrote a statement that would astonish scientists in the 21st century.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('originalSanskritAndTranslation', locale)}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4 mb-3">
          <p className="text-gold-light text-xs italic leading-relaxed font-devanagari">
            "तथा च स्मर्यते योजनानां सहस्रे द्वे द्वे शते द्वे च योजने  एकेन निमिषार्धेन क्रममाण नमोऽस्तु ते"
          </p>
          <p className="text-text-secondary text-xs mt-2 leading-relaxed">
            {t('thusItIsRememberedO', locale)}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {t('sayanaRigvedabhashyaCommentaryOnHymn', locale)}</p>
        </blockquote>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('understandingTheUnits', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{t('yojana', locale)}</span> {t('ancientIndianDistanceUnitPer', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('nimesha', locale)}</span> {t('aBlinkOfAnEye', locale)}</p>
          <p><span className="text-gold-light font-medium">{t('halfNimesha', locale)}</span> {t('k875Seconds01067', locale)}</p>
          <div className="mt-3 pt-3 border-t border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{t('calculation', locale)}</p>
            <p className="font-mono text-xs text-gold-primary">2,202 × 9.09 mi / 0.1067 s ≈ 186,536 mi/s</p>
            <p className="font-mono text-xs text-emerald-400 mt-1">{t('modern186282MiS', locale)}</p>
            <p className="font-mono text-xs text-gold-light mt-1">{t('error014', locale)}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Scholarly Debate                                       */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('theScholarlyDebateCoincidenceOr', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सायण के पाठ की ईमानदार समझ के लिए दोनों पक्षों की सावधानीपूर्वक जाँच की आवश्यकता है। यहाँ विद्वान वास्तव में क्या तर्क देते हैं।</>
            : <>An honest understanding of Sayana's text requires careful examination of both sides. Here is what scholars actually argue.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('argumentsInSupport', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {t('theNumericalCoincidenceIsExtraordinarily', locale)}</p>
          <p>→ {t('sayanaExplicitlySaysThisIs', locale)}</p>
          <p>→ {t('indianAstronomyAchievedExtremelyPrecise', locale)}</p>
          <p>→ {t('computingStellarVelocitiesMayHave', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('argumentsForScepticism', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {t('yojanaLengthVaries916', locale)}</p>
          <p>→ {t('thisIsAReligiousCommentary', locale)}</p>
          <p>→ {t('noExplanationGivenForHow', locale)}</p>
          <p>→ {t('conventionalHyperboleForSpeedOf', locale)}</p>
          <p>→ {t('noOtherIndianTextCites', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('fairConclusion', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>प्रश्न अनिर्णीत रहता है। संख्यात्मक समझौता उल्लेखनीय है और इसे खारिज नहीं किया जाना चाहिए। लेकिन संदेहकर्ताओं के तर्क भी वैध हैं। यह एक ऐसा मामला है जहाँ ईमानदार विद्वत्ता दोनों संभावनाओं को स्वीकार करती है — एक उल्लेखनीय प्राचीन माप, या एक उल्लेखनीय संयोग।</>
            : <>The question remains undecided. The numerical agreement is remarkable and should not be dismissed. But the sceptics' arguments are also valid. This is a case where honest scholarship acknowledges both possibilities — a remarkable ancient measurement, or a remarkable coincidence.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Sayana and the Broader Tradition                           */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('sayanaAndTheBroaderTradition', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रकाश की गति के प्रश्न से परे, सायण और उनकी वैदिक टिप्पणियाँ अपने आप में असाधारण हैं। उनका कार्य भारतीय बौद्धिक जीवन की जीवन्तता और गहराई का प्रमाण है।</>
            : <>Beyond the speed of light question, Sayana and his Vedic commentaries are extraordinary in their own right. His work is a testament to the vitality and depth of Indian intellectual life.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('whoWasSayana', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {t('primeMinisterOfTheVijayanagara', locale)}</p>
          <p>→ {t('workedUnderPatronageOfKings', locale)}</p>
          <p>→ {t('wroteComprehensiveCommentariesOnAll', locale)}</p>
          <p>→ {t('rigVedaCommentary1380Ce', locale)}</p>
          <p>→ {t('hisWorkRepresentsTheUnbroken', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('speedOfLightATimeline', locale)}
        </h4>
        <div className="space-y-1 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">~1380 ईस्वी / ~1380 CE:</span> {t('sayana2202YojanasPer', locale)}</p>
          <p><span className="text-gold-light font-medium">1676 ईस्वी / 1676 CE:</span> {t('oleRømerFirstEuropeanMeasurement', locale)}</p>
          <p><span className="text-gold-light font-medium">1729 ईस्वी / 1729 CE:</span> {t('jamesBradleyImprovedMeasurementFrom', locale)}</p>
          <p><span className="text-gold-light font-medium">1849 ईस्वी / 1849 CE:</span> {t('fizeauFirstLaboratoryMeasurementGear', locale)}</p>
          <p><span className="text-gold-light font-medium">1865 ईस्वी / 1865 CE:</span> {t('maxwellDerivedCFromElectromagnetic', locale)}</p>
          <p><span className="text-gold-light font-medium">1983 ईस्वी / 1983 CE:</span> {t('cDefinedAsExactly299', locale)}</p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

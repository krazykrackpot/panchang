'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-2.json';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

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
          {t('gravityTheIndianTradition', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>न्यूटन के सेब की कहानी प्रसिद्ध है — 1665 में गिरते सेब ने गुरुत्वाकर्षण का नियम प्रेरित किया। लेकिन पृथ्वी को एक ऐसी वस्तु के रूप में देखना जो चीज़ों को अपनी ओर खींचती है, भारत में न्यूटन से 1,000 से अधिक वर्ष पहले से एक स्थापित वैज्ञानिक विचार था।</>
            : <>Newton's apple story is famous — a falling apple in 1665 inspired the law of gravity. But seeing the Earth as an object that pulls things toward itself was an established scientific idea in India more than 1,000 years before Newton.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('threeIndianPrecedents', locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('varahamihira505Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('brihatSamhitaDescribesEarthsInherentAttractive', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('brahmagupta628Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('brahmasphutasiddhantaTheEarthAttractsAllBodies', locale)}
            </p>
          </div>
          <div>
            <p className="text-gold-light font-semibold text-xs mb-1">{t('bhaskaracharya1150Ce', locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {t('siddhantaShiromaniMostDetailedTreatmentThe', locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('bhaskaracharyasOriginalVerse', locale)}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4">
          <p className="text-gold-light text-xs italic leading-relaxed">
            {t('theEarthHasThePowerOf', locale)}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {t('bhaskaracharyaSiddhantaShiromaniGoladhyaya1150Ce', locale)}</p>
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
          {t('whatNewtonAdded', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारतीय वैज्ञानिकों की अंतर्दृष्टि को स्वीकार करना न्यूटन की उपलब्धि को कम नहीं करता। न्यूटन ने कुछ ऐसा किया जो भारतीय ग्रन्थों ने नहीं किया: उन्होंने गुरुत्वाकर्षण को एक सटीक, सार्वत्रिक गणितीय नियम में औपचारिक रूप दिया।</>
            : <>Acknowledging Indian insights does not diminish Newton's achievement. Newton did something Indian texts did not: he formalized gravity into a precise, universal mathematical law.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('newtonsThreeContributions', locale)}
        </h4>
        <div className="space-y-3 text-text-secondary text-xs leading-relaxed">
          <div>
            <p className="text-gold-light font-semibold mb-1">{t('1PreciseMathematicalFormula', locale)}</p>
            <p className="font-mono text-gold-primary text-sm text-center my-2">F = Gm₁m₂/r²</p>
            <p>{t('forceGravitationalConstantMass1Mass2Distance', locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{t('2UnificationTerrestrialCelestialGravity', locale)}</p>
            <p>{t('newtonProvedThatTheGravityPulling', locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-semibold mb-1">{t('3Universality', locale)}</p>
            <p>{t('theLawIsUniversalEarthMoon', locale)}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('fairAssessment', locale)}
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
          {t('bhaskaracharyaUniversalGenius', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गुरुत्वाकर्षण का वर्णन केवल भास्कराचार्य की असाधारण प्रतिभा का एक पहलू है। वे शायद प्राचीन भारत के सबसे बहुमुखी गणितज्ञ थे, जो कई क्षेत्रों में अपने युग से सदियों आगे थे।</>
            : <>The description of gravity is just one aspect of Bhaskaracharya's extraordinary genius. He was perhaps ancient India's most versatile mathematician, centuries ahead of his time in multiple fields.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('bhaskaracharyasNotableAchievements', locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {t('gravityDescribedEarthsAttractiveForce1150', locale)}</p>
          <p>→ {t('differentialCalculusStudiedInstantaneousVelocity500', locale)}</p>
          <p>→ {t('cyclicQuadraticEquationsSolvedPellsEquation', locale)}</p>
          <p>→ {t('trigonometrySineAndCosineSumAnd', locale)}</p>
          <p>→ {t('divisionByZeroDiscussedTheConcept', locale)}</p>
          <p>→ {t('sphericalEarthExplicitDescriptionOfEarths', locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('historicalContext', locale)}
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

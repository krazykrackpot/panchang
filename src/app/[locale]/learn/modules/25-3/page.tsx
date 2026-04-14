'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-3.json';
const t = (key: string, locale: string) => lt((L as unknown as Record<string, LocaleText>)[key], locale);

const META: ModuleMeta = {
  id: 'mod_25_3', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.3',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-2' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-7' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_3_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_3_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata's Pi                                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('aryabhatasFourDecimalsAndADeep', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>499 ई. में, जब यूरोपीय गणित अभी भी आर्किमिडीज़ की जीवा-विधि से जूझ रहा था, आर्यभट ने एक श्लोक में न केवल π = 3.1416 दिया, बल्कि एक ऐसा शब्द ("आसन्नः") भी जोड़ा जो गणित के इतिहास में 1200 से अधिक वर्षों तक अद्वितीय रहा।</>
            : <>In 499 CE, when European mathematics was still wrestling with Archimedes\' polygon method, Aryabhata gave not just π = 3.1416 in a single verse but added a word ("āsannaḥ") that would remain uniquely perceptive in mathematical history for over 1200 years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('ganitapadaVerse10TextAndInterpretation', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3 font-medium text-center italic text-gold-light/80">
          {t('chaturadhikaAtamaaguaDvaistathSahasrmAyutadvayavikambhasysannoVttapariha', locale)}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">अनुवाद:</span> "100 में 4 जोड़ो, 8 से गुणा करो, और 62000 में जोड़ो। यह 20000 व्यास वाले वृत्त की परिधि का आसन्न (सन्निकट) मान है।"</>
            : <><span className="text-gold-light font-medium">Translation:</span> "Add 4 to 100, multiply by 8, and add to 62000. This is approximately (āsannaḥ) the circumference of a circle whose diameter is 20000."</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">गणना:</span> (100 + 4) × 8 + 62000 = 832 + 62000 = 62832। π = 62832 ÷ 20000 = 3.1416।</>
            : <><span className="text-gold-light font-medium">Calculation:</span> (100 + 4) × 8 + 62000 = 832 + 62000 = 62832. π = 62832 ÷ 20000 = 3.1416.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">आसन्नः का महत्त्व:</span> "आसन्न" = "निकटतम" = "सटीक नहीं।" यह शब्द संकेत देता है कि आर्यभट को पता था यह मान अनुमानित है, और संभवतः उन्होंने महसूस किया था कि π को कोई सरल भिन्न व्यक्त नहीं कर सकती।</>
            : <><span className="text-gold-light font-medium">Significance of āsannaḥ:</span> "Āsannaḥ" = "approaching" = "not exact." This word signals Aryabhata knew his value was approximate, and likely intuited that no simple fraction could exactly represent π — an implicit recognition of irrationality.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('aryabhataVsTheContemporaryWorld', locale)}
        </h4>
        <div className="space-y-1">
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{t('archimedes250Bce', locale)}</span> {t('22371To2272CorrectDecimals', locale)}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{t('aryabhata499Ce', locale)}</span> {t('314164CorrectDecimals', locale)}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{t('china480Ce', locale)}</span> {t('zuChongzhi3551133141596Decimals', locale)}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{t('madhava1375Ce', locale)}</span> {t('31415926535911Decimals', locale)}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{t('europe1600Ce', locale)}</span> {t('vanCeulen20DecimalsButNo', locale)}</p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Madhava's Infinite Series                                  */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('madhavasInfiniteSeries250YearsAhead', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>~1350 ई. में केरल के एक गणितज्ञ ने वह खोजा जिसे यूरोप 1670 में "खोजेगा" — π की अनन्त श्रृंखला। माधव की श्रृंखला न केवल π के लिए थी — यह sin और cos के लिए भी थी, जो कलन (calculus) का आधार है।</>
            : <>Around 1350 CE, a Kerala mathematician discovered what Europe would "discover" in 1670 — an infinite series for π. Madhava's series were not just for π — they were also for sin and cos, the foundation of calculus.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('theMadhavaleibnizSeries', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3 text-center font-mono text-gold-light/90">
          π/4 = 1 − 1/3 + 1/5 − 1/7 + 1/9 − 1/11 + ...
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>यह श्रृंखला π/4 = arctan(1) है — और इसलिए यह arctan की टेलर श्रृंखला का एक विशेष मामला है। इसे "माधव-ग्रेगरी-लाइबनित्ज़ श्रृंखला" भी कहते हैं। यूरोप में ग्रेगरी (1671) और लाइबनित्ज़ (1673) ने इसे स्वतन्त्र रूप से खोजा।</>
            : <>This series is π/4 = arctan(1) — making it a special case of the Taylor series for arctan. Also called the "Madhava-Gregory-Leibniz series." In Europe, Gregory (1671) and Leibniz (1673) independently discovered it.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">समस्या:</span> यह श्रृंखला बहुत धीरे अभिसरित होती है — 11 दशमलव के लिए अरबों पद चाहिए। <span className="text-gold-light font-medium">माधव का समाधान:</span> सुधार पद (correction terms) — एक अतिरिक्त अनुपद जो अभिसरण को नाटकीय रूप से तेज़ कर देता है।</>
            : <><span className="text-gold-light font-medium">Problem:</span> This series converges very slowly — billions of terms needed for 11 decimals. <span className="text-gold-light font-medium">Madhava's solution:</span> Correction terms — additional fractional terms that dramatically accelerate convergence.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {t('madhavasCorrectionTerms', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>n पदों के बाद, माधव ने एक सुधार पद जोड़ा: n/(4n² + 1)। यह सुधार, n पदों की श्रृंखला को हजारों अतिरिक्त पदों के बराबर सटीक बना देता था। यह "त्वरित अभिसरण" तकनीक आधुनिक संख्यात्मक विश्लेषण का अग्रदूत है।</>
            : <>After n terms, Madhava added a correction: n/(4n² + 1). This single correction made the n-term series as accurate as thousands of additional terms. This "accelerated convergence" technique is a precursor to modern numerical analysis.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>माधव की यह विधि यूक्तिभाषा (1530 ई.) में संरक्षित है — जो केरल गणित की मुख्य प्रमाण-पुस्तक है। Module 25-7 में इस पर और विवरण।</>
            : <>Madhava's method is preserved in the Yuktibhasha (1530 CE) — the main proof-text of Kerala mathematics. Module 25-7 covers this in more detail.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Pi in Indian Astronomy and Culture                         */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('practicalUsesOfAndIndianAstronomy', locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारतीय गणितज्ञों ने π की गणना केवल अकादमिक रुचि के लिए नहीं की — इसके व्यावहारिक अनुप्रयोग थे जो खगोल विज्ञान और इंजीनियरिंग को प्रत्यक्ष रूप से प्रभावित करते थे।</>
            : <>Indian mathematicians computed π not out of academic curiosity alone — it had direct practical applications that affected astronomy and engineering.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {t('applicationsOfInAstronomy', locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('earthsCircumference', locale)}</span>{' '}
            {t('aryabhataUsed31416WithRadius3300', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('planetaryOrbits', locale)}</span>{' '}
            {t('computingPlanetaryOrbitalCircumferencesAndPeriods', locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{t('observatoryInstruments', locale)}</span>{' '}
            {t('sphericalAstrolabesGnomonsShankuAndArmillary', locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {t('sIrrationalityAPhilosophicalQuestion', locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>आर्यभट का "आसन्नः" शब्द एक गहरी दार्शनिक प्रश्न उठाता है: क्या ब्रह्माण्ड में कुछ मूल राशियाँ ऐसी हैं जो अपरिमेय हैं? π, √2, e — ये सभी अपरिमेय हैं। गणित के दार्शनिक इसे एक संकेत मानते हैं कि ब्रह्माण्ड की गहराइयाँ किसी भी परिमित मानवीय संख्या प्रणाली से परे हैं।</>
            : <>Aryabhata's "āsannaḥ" raises a deep philosophical question: are there fundamental quantities in the universe that are irrational? π, √2, e — all irrational. Mathematical philosophers see this as a signal that the universe's depths transcend any finite human number system.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>भारतीय दर्शन में, "अनन्त" (अनन्त) और "अपरिमेय" के बीच एक सहज सम्बन्ध था। ब्रह्मगुप्त के शून्य, आर्यभट के अपरिमेय π, और माधव की अनन्त श्रृंखलाएँ — सभी एक ही दार्शनिक परम्परा से उभरे।</>
            : <>In Indian philosophy, there was an intuitive connection between "ananta" (infinity) and the irrational. Brahmagupta's zero, Aryabhata's irrational π, and Madhava's infinite series all emerged from the same philosophical tradition.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

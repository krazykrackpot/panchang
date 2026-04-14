'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/25-2.json';

const META: ModuleMeta = {
  id: 'mod_25_2', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/25-3' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/25-7' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_04', type: 'mcq',
    question: L.questions[3].question as Record<string, string>,
    options: L.questions[3].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_05', type: 'mcq',
    question: L.questions[4].question as Record<string, string>,
    options: L.questions[4].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[4].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_06', type: 'mcq',
    question: L.questions[5].question as Record<string, string>,
    options: L.questions[5].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[5].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_07', type: 'mcq',
    question: L.questions[6].question as Record<string, string>,
    options: L.questions[6].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[6].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_08', type: 'mcq',
    question: L.questions[7].question as Record<string, string>,
    options: L.questions[7].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[7].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_09', type: 'true_false',
    question: L.questions[8].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[8].explanation as Record<string, string>,
  },
  {
    id: 'q25_2_10', type: 'true_false',
    question: L.questions[9].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[9].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata and the Sine Table                               */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: "Aryabhata and the World's First Sine Table", hi: "आर्यभट और विश्व की पहली ज्या सारणी", sa: "आर्यभट और विश्व की पहली ज्या सारणी" }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>499 ई. में, एक 23 वर्षीय भारतीय गणितज्ञ ने एक ऐसी सारणी बनाई जो खगोल विज्ञान, नौवहन और आखिरकार सभी आधुनिक इंजीनियरिंग की नींव बन गई। आर्यभट की ज्या सारणी — जिसे हम आज sine table कहते हैं — न केवल विश्व में पहली थी, बल्कि अगले हजार वर्षों तक सबसे सटीक भी रही।</>
            : <>In 499 CE, a 23-year-old Indian mathematician created a table that would become the foundation of astronomy, navigation, and ultimately all modern engineering. Aryabhata's jya table — what we call the sine table — was not only the first in the world but remained the most accurate for the next thousand years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Jya to Sine — A Story of Bows', hi: 'ज्या से Sine — एक धनुष की कहानी', sa: 'ज्या से Sine — एक धनुष की कहानी' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">धनुष का रूपक:</span> एक वृत्त को धनुष की भाँति कल्पना करें। कोण = चाप (धनुष की वक्रता)। जीवा = डोरी जो चाप के दोनों सिरों को जोड़ती है। अर्धज्या = जीवा का आधा भाग = आधुनिक sine।</>
            : <><span className="text-gold-light font-medium">The bow metaphor:</span> Imagine a circle like a bow. The angle = the arc (the curvature of the bow). The chord = the bowstring connecting both ends of the arc. Half-chord (ardha-jya) = half the bowstring = modern sine.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">यूनानियों से अन्तर:</span> ग्रीक गणितज्ञ पूर्ण जीवाओं की सारणी बनाते थे। भारतीयों ने अर्ध-जीवा (ज्या) का उपयोग किया — जो दोगुना सुरुचिपूर्ण और गणना में अधिक सरल है। जीवा(θ) = 2 × ज्या(θ/2)।</>
            : <><span className="text-gold-light font-medium">Difference from Greeks:</span> Greek mathematicians tabulated full chords. Indians used the half-chord (jya) — twice as elegant and simpler for calculations. chord(θ) = 2 × jya(θ/2).</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">सारणी की संरचना:</span> 24 मान, 3.75° के अन्तराल पर (3°45\' या 225 चापमिनट)। त्रिज्या R = 3438 चापमिनट (एक रेडियन ≈ 3438 चापमिनट)। मान रोलर कोस्टर की तरह आरोही हैं: 225, 449, 671, 890... 3438।</>
            : <><span className="text-gold-light font-medium">Table structure:</span> 24 values at 3.75° intervals (3°45\' or 225 arc-minutes). Radius R = 3438 arc-minutes (one radian ≈ 3438 arc-minutes). Values rise like: 225, 449, 671, 890 ... 3438.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Aryabhatiya's Encoding Magic", hi: "आर्यभटीय का एन्कोडिंग जादू", sa: "आर्यभटीय का एन्कोडिंग जादू" }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>आर्यभट ने 24 ज्या अन्तर-मानों को मात्र 4 श्लोकों में समाया — संस्कृत व्यञ्जन-स्वर जोड़ियों की एक अद्भुत प्रणाली का उपयोग करके। प्रत्येक अक्षर एक विशिष्ट संख्यात्मक मान का प्रतिनिधित्व करता था। यह प्रणाली (जिसे आर्यभट कटपयादि के पूर्वज के रूप में देखते हैं) पूरी सारणी को एक छोटे से स्मृति-सहायक में संकुचित कर देती थी।</>
            : <>Aryabhata compressed 24 sine difference-values into just 4 verses — using a remarkable system of Sanskrit consonant-vowel pairs. Each syllable represented a specific numerical value. This system (a precursor to the Katapayadi notation) compressed the entire table into a compact mnemonic. Modern computing calls this "delta encoding" — storing differences rather than absolute values.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Great Mistranslation                                   */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Great Mistranslation: Jya to Sine', hi: 'महान गलत-अनुवाद: ज्या से Sine', sa: 'महान गलत-अनुवाद: ज्या से Sine' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अंग्रेजी का "sine" शब्द एक ऐसी यात्रा का परिणाम है जिसमें एक अर्थपूर्ण संस्कृत शब्द तीन भाषाओं में अर्थहीन होता गया और अन्ततः एक नई पहचान पा गया। यह भाषाई पुरातत्त्व की एक अद्भुत कहानी है।</>
            : <>The English word "sine" is the result of a journey where a meaningful Sanskrit word passed through three languages, became meaningless in each, and finally acquired a new identity. It is a remarkable story of linguistic archaeology.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Step by Step: Jya → Sine', hi: 'चरण-दर-चरण: ज्या → Sine', sa: 'चरण-दर-चरण: ज्या → Sine' }, locale)}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-medium text-xs">{tl({ en: '1. Sanskrit: Jya (ज्या)', hi: '1. संस्कृत: ज्या (Jya)', sa: '1. संस्कृत: ज्या (Jya)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{tl({ en: "Meaning: bowstring. Aryabhata\'s word, 499 CE.", hi: "अर्थ: धनुष की डोरी। आर्यभट का शब्द, 499 ई.।", sa: "अर्थ: धनुष की डोरी। आर्यभट का शब्द, 499 ई.।" }, locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{tl({ en: '2. Arabic: Jiba (جيب)', hi: '2. अरबी: जिबा (جيب Jiba)', sa: '2. अरबी: जिबा (جيب Jiba)' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{tl({ en: 'Arab translators transliterated "jya" as "jiba." This word has no meaning in Arabic — it was a phonetic approximation. ~820 CE, time of Al-Khwarizmi.', hi: 'अरब अनुवादकों ने "ज्या" को "जिबा" के रूप में लिप्यंतरित किया। अरबी में इसका कोई अर्थ नहीं था। ~820 ई. में अल-ख्वारिज़्मी के समय।', sa: 'अरब अनुवादकों ने "ज्या" को "जिबा" के रूप में लिप्यंतरित किया। अरबी में इसका कोई अर्थ नहीं था। ~820 ई. में अल-ख्वारिज़्मी के समय।' }, locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{tl({ en: '3. Latin: Sinus', hi: '3. लैटिन: Sinus', sa: '3. लैटिन: Sinus' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{tl({ en: 'Medieval Latin translators (like Gerard of Cremona, ~1150 CE) misread Arabic "jiba" as "jaib," which means "pocket/fold/bay" in Arabic. Then translated "jaib" to Latin "sinus" (fold, bay, bosom).', hi: 'मध्ययुगीन लैटिन अनुवादकों (जैसे गेरार्डो ऑफ क्रेमोना, ~1150 ई.) ने अरबी "जिबा" को "जैब" पढ़ा, जिसका अरबी में अर्थ है "जेब/तह।" फिर "जैब" का लैटिन अनुवाद "sinus" (तह, खाड़ी, वक्ष) कर दिया।', sa: 'मध्ययुगीन लैटिन अनुवादकों (जैसे गेरार्डो ऑफ क्रेमोना, ~1150 ई.) ने अरबी "जिबा" को "जैब" पढ़ा, जिसका अरबी में अर्थ है "जेब/तह।" फिर "जैब" का लैटिन अनुवाद "sinus" (तह, खाड़ी, वक्ष) कर दिया।' }, locale)}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{tl({ en: '4. English: Sine', hi: '4. अंग्रेजी: Sine', sa: '4. अंग्रेजी: Sine' }, locale)}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{tl({ en: 'Latin "sinus" was shortened to English "sine." From a bowstring to a bay/fold — linguistic irony at its finest.', hi: 'लैटिन "sinus" को अंग्रेजी "sine" में संक्षिप्त कर दिया गया। मूल धनुष की डोरी से "खाड़ी/तह" तक — भाषाई विडम्बना की पराकाष्ठा।', sa: 'लैटिन "sinus" को अंग्रेजी "sine" में संक्षिप्त कर दिया गया। मूल धनुष की डोरी से "खाड़ी/तह" तक — भाषाई विडम्बना की पराकाष्ठा।' }, locale)}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Indian Roots of Other Trig Words', hi: 'अन्य त्रिकोणमितीय शब्दों की भारतीय जड़ें', sa: 'अन्य त्रिकोणमितीय शब्दों की भारतीय जड़ें' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Cosine:', hi: 'Cosine:', sa: 'Cosine:' }, locale)}</span>{' '}
            {tl({ en: 'From Sanskrit "kojya" (ko-jya = sine of complementary angle). Directly Indian.', hi: 'संस्कृत "कोज्या" (ko-jya = पूरक कोण की ज्या) से। सीधे भारतीय।', sa: 'संस्कृत "कोज्या" (ko-jya = पूरक कोण की ज्या) से। सीधे भारतीय।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Versine:', hi: 'Versine:', sa: 'Versine:' }, locale)}</span>{' '}
            {tl({ en: 'Sanskrit "utkramajya" (1 − cos θ) — widely used in Indian navigation calculations. Later adopted in European navigation too.', hi: 'संस्कृत "उत्क्रमज्या" (1 − cos θ) — भारतीय नौवहन गणनाओं में व्यापक। बाद में यूरोपीय नौवहन में भी।', sa: 'संस्कृत "उत्क्रमज्या" (1 − cos θ) — भारतीय नौवहन गणनाओं में व्यापक। बाद में यूरोपीय नौवहन में भी।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Tangent / Secant:', hi: 'Tangent / Secant:', sa: 'Tangent / Secant:' }, locale)}</span>{' '}
            {tl({ en: 'Not directly Indian — European development — but impossible to define without Indian sine/cosine foundations.', hi: 'ये सीधे भारतीय नहीं — यूरोपीय विकास — लेकिन Indian sine/cosine के बिना इनकी परिभाषा असम्भव थी।', sa: 'ये सीधे भारतीय नहीं — यूरोपीय विकास — लेकिन Indian sine/cosine के बिना इनकी परिभाषा असम्भव थी।' }, locale)}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Impact on Astronomy and Navigation                         */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Impact on Astronomy, Navigation and Kerala Mathematics', hi: 'खगोल विज्ञान, नौवहन और केरल गणित पर प्रभाव', sa: 'खगोल विज्ञान, नौवहन और केरल गणित पर प्रभाव' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आर्यभट की ज्या सारणी केवल एक गणितीय जिज्ञासा नहीं थी — यह भारतीय खगोल विज्ञान की रीढ़ बन गई और केरल के गणितज्ञों ने इसे अगले स्तर तक ले जाया।</>
            : <>Aryabhata's jya table was not merely a mathematical curiosity — it became the backbone of Indian astronomy, and Kerala mathematicians took it to the next level centuries later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Practical Applications', hi: 'व्यावहारिक उपयोग', sa: 'व्यावहारिक उपयोग' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Eclipse prediction:', hi: 'ग्रहण गणना:', sa: 'ग्रहण गणना:' }, locale)}</span>{' '}
            {tl({ en: "Precise positions of Sun and Moon — impossible without jya. This Panchang\'s eclipse algorithm has Aryabhata\'s trigonometry at its core.", hi: "सूर्य और चन्द्रमा की सटीक स्थिति — ज्या के बिना असम्भव। इस पञ्चाङ्ग के ग्रहण एल्गोरिदम में आर्यभट की त्रिकोणमिति है।", sa: "सूर्य और चन्द्रमा की सटीक स्थिति — ज्या के बिना असम्भव। इस पञ्चाङ्ग के ग्रहण एल्गोरिदम में आर्यभट की त्रिकोणमिति है।" }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Navigation:', hi: 'नौवहन:', sa: 'नौवहन:' }, locale)}</span>{' '}
            {tl({ en: 'Indian sailors used pole star altitude and jya tables to determine latitude — the only reliable method before GPS.', hi: 'भारतीय नाविक ध्रुव तारे की ऊँचाई और ज्या सारणियों का उपयोग करके अक्षांश निर्धारित करते थे — GPS से पहले एकमात्र विश्वसनीय तरीका।', sa: 'भारतीय नाविक ध्रुव तारे की ऊँचाई और ज्या सारणियों का उपयोग करके अक्षांश निर्धारित करते थे — GPS से पहले एकमात्र विश्वसनीय तरीका।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Temple architecture:', hi: 'मन्दिर वास्तुकला:', sa: 'मन्दिर वास्तुकला:' }, locale)}</span>{' '}
            {tl({ en: 'The curved profiles of temple shikharas, arch angles, shadow calculations — all applications of jya.', hi: 'मन्दिर के शिखरों की वक्र रेखाएँ, मेहराब का कोण, छाया गणना — सब ज्या के अनुप्रयोग।', sa: 'मन्दिर के शिखरों की वक्र रेखाएँ, मेहराब का कोण, छाया गणना — सब ज्या के अनुप्रयोग।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Muhurta calculation:', hi: 'मुहूर्त गणना:', sa: 'मुहूर्त गणना:' }, locale)}</span>{' '}
            {tl({ en: 'Precise sunrise/sunset times, planetary altitudes — all based on jya. This Panchang does this every day.', hi: 'सूर्योदय/अस्त का सटीक समय, ग्रहों की ऊँचाई — सब ज्या पर आधारित। यह पञ्चाङ्ग प्रतिदिन यही करता है।', sa: 'सूर्योदय/अस्त का सटीक समय, ग्रहों की ऊँचाई — सब ज्या पर आधारित। यह पञ्चाङ्ग प्रतिदिन यही करता है।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: "Kerala's Advancement", hi: "केरल का आगे विकास", sa: "केरल का आगे विकास" }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>~1350 ई. में केरल के माधव ने sine और cosine की अनन्त श्रृंखलाएँ खोजीं — जिन्हें आज "टेलर श्रृंखला" कहते हैं लेकिन जो माधव की थीं। यह sin(x) = x − x³/3! + x⁵/5! − ... है। इसका अर्थ था कि आर्यभट की सारणी की जगह एक अनन्त परिशुद्धता वाली गणितीय सूत्र ले सकती थी।</>
            : <>Around 1350 CE, Kerala's Madhava discovered infinite series for sine and cosine — called "Taylor series" today but actually Madhava's centuries earlier. The series sin(x) = x − x³/3! + x⁵/5! − ... replaced Aryabhata's table with a formula of infinite precision.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>यह खोज यूरोप में Newton और Leibniz के ~250 वर्ष पहले हुई। Module 25-7 में इस पर विस्तार से।</>
            : <>This discovery came ~250 years before Newton and Leibniz in Europe. Module 25-7 covers this in detail.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

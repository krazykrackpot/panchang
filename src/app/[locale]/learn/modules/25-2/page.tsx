'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_2', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.2',
  title: { en: 'Sine Is Sanskrit — Jya to Sine', hi: 'ज्या से Sine — एक शब्द की यात्रा' },
  subtitle: {
    en: 'How Aryabhata created the world\'s first sine table in 499 CE, what "jya" means, and the mistranslation chain that gave English the word "sine"',
    hi: 'आर्यभट ने 499 ई. में विश्व की पहली ज्या सारणी कैसे बनाई, "ज्या" का क्या अर्थ है, और किस अनुवाद-श्रृंखला से अंग्रेजी को "sine" शब्द मिला',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-3: Pi = 3.1416', hi: 'मॉड्यूल 25-3: π = 3.1416' }, href: '/learn/modules/25-3' },
    { label: { en: 'Module 25-7: Kerala Calculus', hi: 'मॉड्यूल 25-7: केरल गणित' }, href: '/learn/modules/25-7' },
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य' }, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_2_01', type: 'mcq',
    question: {
      en: 'Who created the world\'s first systematic sine table?',
      hi: 'विश्व की पहली व्यवस्थित ज्या सारणी किसने बनाई?',
    },
    options: [
      { en: 'Hipparchus of Nicaea', hi: 'हिप्पार्कस' },
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Ptolemy', hi: 'टॉलेमी' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Aryabhata (476–550 CE), writing in the Aryabhatiya in 499 CE, created the world\'s first systematic sine table. The Greek astronomers Hipparchus and Ptolemy had tables of chords (twice the sine of half the angle) — a different and less elegant system. Aryabhata was the first to use half-chords (what we now call sine) as the primary trigonometric function, computing values at 24 equally-spaced intervals of 3.75° each.',
      hi: 'आर्यभट (476–550 ई.), 499 ई. में आर्यभटीय में लिखते हुए, विश्व की पहली व्यवस्थित ज्या सारणी बनाई। ग्रीक खगोलशास्त्री हिप्पार्कस और टॉलेमी के पास जीवाओं (chord) की सारणियाँ थीं — एक अलग और कम सुरुचिपूर्ण प्रणाली। आर्यभट अर्ध-जीवाओं (जिसे हम अब sine कहते हैं) को प्राथमिक त्रिकोणमितीय फलन के रूप में उपयोग करने वाले पहले थे।',
    },
  },
  {
    id: 'q25_2_02', type: 'mcq',
    question: {
      en: 'What year did Aryabhata write the Aryabhatiya containing his sine table?',
      hi: 'आर्यभट ने अपनी ज्या सारणी सहित आर्यभटीय किस वर्ष लिखी?',
    },
    options: [
      { en: '376 CE', hi: '376 ई.' },
      { en: '499 CE', hi: '499 ई.' },
      { en: '628 CE', hi: '628 ई.' },
      { en: '830 CE', hi: '830 ई.' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '499 CE is when Aryabhata completed the Aryabhatiya. He tells us this himself — the text records that it was composed when he was 23 years old, and he was born in 476 CE, giving us 499 CE. The Aryabhatiya is a landmark text in the history of mathematics, covering astronomy, mathematics, and what we now call trigonometry. The sine table in its Ganitapada section remained one of the most accurate in the world for centuries.',
      hi: '499 ई. वह वर्ष है जब आर्यभट ने आर्यभटीय पूरी की। यह वे स्वयं बताते हैं — पाठ में लिखा है कि यह 23 वर्ष की आयु में रचा गया था, और उनका जन्म 476 ई. में हुआ था। आर्यभटीय गणित के इतिहास में एक मील का पत्थर है, जिसमें खगोल विज्ञान, गणित और त्रिकोणमिति शामिल है।',
    },
  },
  {
    id: 'q25_2_03', type: 'mcq',
    question: {
      en: 'What is the Sanskrit word Aryabhata used for "sine"?',
      hi: 'आर्यभट ने "sine" के लिए कौन सा संस्कृत शब्द प्रयोग किया?',
    },
    options: [
      { en: 'Trijya', hi: 'त्रिज्या' },
      { en: 'Jya', hi: 'ज्या' },
      { en: 'Bhuja', hi: 'भुज' },
      { en: 'Karna', hi: 'कर्ण' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Jya" (ज्या) is the Sanskrit term Aryabhata used for what we now call sine. In Sanskrit, "jya" means "bowstring" — visualising the arc of a bow (the angle) and the string that connects its two ends (the chord). Aryabhata\'s innovation was to use the half-chord (ardha-jya, half the bowstring) of double the angle, which is exactly the modern sine function. The abbreviated form "jya" came to mean this half-chord.',
      hi: '"ज्या" वह संस्कृत शब्द है जो आर्यभट ने प्रयोग किया और जिसे हम अब sine कहते हैं। संस्कृत में "ज्या" का अर्थ है "धनुष की डोरी" — चाप (कोण) और उसके दोनों सिरों को जोड़ने वाली डोरी (जीवा) की कल्पना करें। आर्यभट का नवाचार था: दोगुने कोण की अर्ध-जीवा का उपयोग, जो आधुनिक sine फलन है।',
    },
  },
  {
    id: 'q25_2_04', type: 'mcq',
    question: {
      en: 'What does the Sanskrit word "Jya" literally mean?',
      hi: 'संस्कृत शब्द "ज्या" का शाब्दिक अर्थ क्या है?',
    },
    options: [
      { en: 'Shadow', hi: 'छाया' },
      { en: 'Bowstring', hi: 'धनुष की डोरी' },
      { en: 'Circle', hi: 'वृत्त' },
      { en: 'Horizon', hi: 'क्षितिज' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Jya" literally means "bowstring" in Sanskrit. The trigonometric analogy: imagine a bow (a circular arc representing an angle). The bowstring connects the two ends of the arc — this is the chord. The half-chord from the midpoint of the arc to the midpoint of the string is the sine. Indian mathematicians visualised their trigonometry through the physical metaphor of a bow and arrow, which was central to both warfare and the Mahabharata/Ramayana epics.',
      hi: '"ज्या" का संस्कृत में शाब्दिक अर्थ है "धनुष की डोरी।" त्रिकोणमितीय सादृश्य: एक धनुष (कोण को दर्शाने वाला वृत्ताकार चाप) की कल्पना करें। धनुष की डोरी चाप के दोनों सिरों को जोड़ती है — यह जीवा है। चाप के मध्यबिन्दु से डोरी के मध्यबिन्दु तक की अर्ध-जीवा sine है।',
    },
  },
  {
    id: 'q25_2_05', type: 'mcq',
    question: {
      en: 'What is the correct sequence of the mistranslation chain that gave us the English word "sine"?',
      hi: 'अंग्रेजी शब्द "sine" देने वाली गलत-अनुवाद श्रृंखला का सही क्रम क्या है?',
    },
    options: [
      { en: 'Jya → Sinus → Jiba → Sine', hi: 'ज्या → Sinus → जिबा → Sine' },
      { en: 'Jya → Jiba → Sinus → Sine', hi: 'ज्या → जिबा → Sinus → Sine' },
      { en: 'Jya → Chord → Sinus → Sine', hi: 'ज्या → Chord → Sinus → Sine' },
      { en: 'Ardha-jya → Jiba → Sine → Sinus', hi: 'अर्धज्या → जिबा → Sine → Sinus' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The chain is: Jya (ज्या, Sanskrit for bowstring) → Jiba (جيب, Arabic transliteration of jya — meaningless in Arabic) → Sinus (Latin — medieval translators mistook Arabic "jiba" for "jaib" meaning "fold/pocket/bay," then translated it to Latin "sinus" meaning "fold, bay, bosom") → Sine (English). The word "sine" has no Indo-European root meaning — it is an accident of mispronunciation and mistranslation across three languages.',
      hi: 'श्रृंखला है: ज्या (Sanskrit, धनुष की डोरी) → जिबा (Arabic लिप्यंतरण — अरबी में अर्थहीन) → Sinus (Latin — मध्ययुगीन अनुवादकों ने "जिबा" को "जैब" समझा जिसका अर्थ "तह/जेब" है, फिर इसे "sinus" = "तह, खाड़ी" में अनुवादित किया) → Sine (अंग्रेजी)। "Sine" शब्द का कोई भारोपीय मूल अर्थ नहीं — यह तीन भाषाओं में गलत उच्चारण और गलत अनुवाद का परिणाम है।',
    },
  },
  {
    id: 'q25_2_06', type: 'mcq',
    question: {
      en: 'How many values did Aryabhata include in his sine table?',
      hi: 'आर्यभट की ज्या सारणी में कितने मान थे?',
    },
    correctAnswer: 1,
    options: [
      { en: '12', hi: '12' },
      { en: '24', hi: '24' },
      { en: '36', hi: '36' },
      { en: '90', hi: '90' },
    ],
    explanation: {
      en: 'Aryabhata\'s sine table contains 24 values, covering angles from 3.75° to 90° in steps of 3.75° (which is 90°/24). He gave these as first-order differences — a compact way to encode the full table. From these 24 differences, one can reconstruct all 24 sine values. The table appears in just 4 Sanskrit verses in the Aryabhatiya, using a clever encoding in consonant-vowel pairs. It is one of the most elegant mathematical encodings in history.',
      hi: 'आर्यभट की ज्या सारणी में 24 मान हैं, जो 3.75° से 90° तक 3.75° (90°/24) के अन्तराल पर हैं। उन्होंने इन्हें प्रथम-कोटि अन्तरों के रूप में दिया — पूरी सारणी को संक्षेप में एन्कोड करने का तरीका। आर्यभटीय में मात्र 4 संस्कृत श्लोकों में व्यञ्जन-स्वर युग्मों में एन्कोड करके — इतिहास में सबसे सुरुचिपूर्ण गणितीय एन्कोडिंग में से एक।',
    },
  },
  {
    id: 'q25_2_07', type: 'mcq',
    question: {
      en: 'What interval (in degrees) separates each entry in Aryabhata\'s sine table?',
      hi: 'आर्यभट की ज्या सारणी की प्रत्येक प्रविष्टि के बीच कितने अंशों का अन्तराल है?',
    },
    options: [
      { en: '1°', hi: '1°' },
      { en: '3°', hi: '3°' },
      { en: '3.75°', hi: '3.75°' },
      { en: '5°', hi: '5°' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '3.75° is the interval — because 90° divided by 24 equals exactly 3.75°. In Indian reckoning, this is 225 arc-minutes (3° 45\'), and the full circle of 360° is divided into 96 equal parts of 3.75° each. Aryabhata expressed sine values as lengths in a circle of radius 3438 (the number of arc-minutes in one radian), chosen because sin(1°) ≈ 1/3438. This unit circle with R = 3438 is called the "trijya" (radius in arc-minutes).',
      hi: '3.75° अन्तराल है — क्योंकि 90° को 24 से विभाजित करने पर ठीक 3.75° मिलता है। भारतीय गणना में यह 225 चापमिनट (3° 45\') है। आर्यभट ने sine मान 3438 त्रिज्या वाले वृत्त में लम्बाई के रूप में व्यक्त किए (एक रेडियन में चापमिनटों की संख्या), क्योंकि sin(1°) ≈ 1/3438। यह "त्रिज्या" (R = 3438 चापमिनट) है।',
    },
  },
  {
    id: 'q25_2_08', type: 'mcq',
    question: {
      en: 'What is the Sanskrit term "Kojya" equivalent to in modern trigonometry?',
      hi: 'आधुनिक त्रिकोणमिति में संस्कृत शब्द "कोज्या" किसके समतुल्य है?',
    },
    options: [
      { en: 'Tangent', hi: 'स्पर्शज्या (Tangent)' },
      { en: 'Cosine', hi: 'कोज्या (Cosine)' },
      { en: 'Secant', hi: 'छेदक (Secant)' },
      { en: 'Cotangent', hi: 'कोटिज्या (Cotangent)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Kojya" (कोज्या) is the Sanskrit for cosine. "Ko" is a prefix meaning "complementary" (from "koti" — the complement of an angle), and "jya" is sine. So kojya = the sine of the complementary angle = cosine. Indian mathematicians also had "utkramajya" for versine (1 − cos θ), which was widely used in navigation. The versine appears prominently in Indian astronomical calculations because it is always positive and avoids the negative values that cosine can take.',
      hi: '"कोज्या" cosine का संस्कृत नाम है। "को" पूरक का उपसर्ग है ("कोटि" से — कोण का पूरक), और "ज्या" sine है। तो कोज्या = पूरक कोण की ज्या = cosine। भारतीय गणितज्ञों के पास versine (1 − cos θ) के लिए "उत्क्रमज्या" भी था, जो नौवहन में व्यापक रूप से उपयोग किया जाता था।',
    },
  },
  {
    id: 'q25_2_09', type: 'true_false',
    question: {
      en: 'Greek mathematicians invented trigonometry using the same sine function that Indian mathematicians used.',
      hi: 'ग्रीक गणितज्ञों ने उसी sine फलन का उपयोग करके त्रिकोणमिति का आविष्कार किया जो भारतीय गणितज्ञ उपयोग करते थे।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Greek mathematicians (Hipparchus, Ptolemy) used chord tables — values of the full chord for various arc lengths in a circle — not half-chords (sines). The chord of angle θ = 2·sin(θ/2), which is a less elegant formulation. Indians independently developed the half-chord (jya = sine) as the primary function, which is far more convenient for calculations. The sine function as we know it is an Indian invention, not Greek.',
      hi: 'असत्य। ग्रीक गणितज्ञों (हिप्पार्कस, टॉलेमी) ने जीवा सारणियों का उपयोग किया — वृत्त में विभिन्न चापों के लिए पूर्ण जीवा के मान — अर्ध-जीवा (sine) का नहीं। कोण θ की जीवा = 2·sin(θ/2), जो कम सुरुचिपूर्ण है। भारतीयों ने स्वतन्त्र रूप से अर्ध-जीवा (ज्या = sine) को प्राथमिक फलन के रूप में विकसित किया। sine फलन जैसा हम जानते हैं, एक भारतीय आविष्कार है।',
    },
  },
  {
    id: 'q25_2_10', type: 'true_false',
    question: {
      en: 'The English word "sine" ultimately derives from the Sanskrit word "jya" (bowstring), through a chain of mistranslations via Arabic and Latin.',
      hi: 'अंग्रेजी शब्द "sine" अन्ततः संस्कृत शब्द "ज्या" (धनुष की डोरी) से अरबी और लैटिन के माध्यम से गलत-अनुवाद की श्रृंखला से निकला है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The word "sine" traces directly back to Sanskrit "jya" through a fascinating chain: Aryabhata wrote "jya" → Arab translators wrote it as "jiba" (جيب, a transliteration with no meaning in Arabic) → medieval Latin translators mistread "jiba" as "jaib" (جيب, meaning "pocket/fold/bay" in Arabic) → they translated "jaib" to Latin "sinus" (meaning "fold, bay, bosom") → English shortened it to "sine." The word has no genuine etymological meaning in any of the languages it passed through — only Sanskrit "jya" (bowstring) is meaningful.',
      hi: 'सत्य। "Sine" शब्द सीधे संस्कृत "ज्या" से इस श्रृंखला के माध्यम से आता है: आर्यभट ने "ज्या" लिखा → अरब अनुवादकों ने "जिबा" (जिबا, अरबी में अर्थहीन लिप्यंतरण) लिखा → मध्ययुगीन लैटिन अनुवादकों ने "जिबा" को "जैब" (अरबी में "जेब/तह") पढ़ा → उन्होंने "जैब" को लैटिन "sinus" (तह, खाड़ी) में अनुवाद किया → अंग्रेजी ने इसे "sine" बना दिया।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata and the Sine Table                               */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आर्यभट और विश्व की पहली ज्या सारणी' : "Aryabhata and the World's First Sine Table"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>499 ई. में, एक 23 वर्षीय भारतीय गणितज्ञ ने एक ऐसी सारणी बनाई जो खगोल विज्ञान, नौवहन और आखिरकार सभी आधुनिक इंजीनियरिंग की नींव बन गई। आर्यभट की ज्या सारणी — जिसे हम आज sine table कहते हैं — न केवल विश्व में पहली थी, बल्कि अगले हजार वर्षों तक सबसे सटीक भी रही।</>
            : <>In 499 CE, a 23-year-old Indian mathematician created a table that would become the foundation of astronomy, navigation, and ultimately all modern engineering. Aryabhata's jya table — what we call the sine table — was not only the first in the world but remained the most accurate for the next thousand years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'ज्या से Sine — एक धनुष की कहानी' : 'Jya to Sine — A Story of Bows'}
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
          {isHi ? 'आर्यभटीय का एन्कोडिंग जादू' : "Aryabhatiya's Encoding Magic"}
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
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'महान गलत-अनुवाद: ज्या से Sine' : 'The Great Mistranslation: Jya to Sine'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अंग्रेजी का "sine" शब्द एक ऐसी यात्रा का परिणाम है जिसमें एक अर्थपूर्ण संस्कृत शब्द तीन भाषाओं में अर्थहीन होता गया और अन्ततः एक नई पहचान पा गया। यह भाषाई पुरातत्त्व की एक अद्भुत कहानी है।</>
            : <>The English word "sine" is the result of a journey where a meaningful Sanskrit word passed through three languages, became meaningless in each, and finally acquired a new identity. It is a remarkable story of linguistic archaeology.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'चरण-दर-चरण: ज्या → Sine' : 'Step by Step: Jya → Sine'}
        </h4>
        <div className="space-y-3">
          <div>
            <p className="text-gold-light font-medium text-xs">{isHi ? '1. संस्कृत: ज्या (Jya)' : '1. Sanskrit: Jya (ज्या)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'अर्थ: धनुष की डोरी। आर्यभट का शब्द, 499 ई.।' : 'Meaning: bowstring. Aryabhata\'s word, 499 CE.'}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{isHi ? '2. अरबी: जिबा (جيب Jiba)' : '2. Arabic: Jiba (جيب)'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'अरब अनुवादकों ने "ज्या" को "जिबा" के रूप में लिप्यंतरित किया। अरबी में इसका कोई अर्थ नहीं था। ~820 ई. में अल-ख्वारिज़्मी के समय।' : 'Arab translators transliterated "jya" as "jiba." This word has no meaning in Arabic — it was a phonetic approximation. ~820 CE, time of Al-Khwarizmi.'}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{isHi ? '3. लैटिन: Sinus' : '3. Latin: Sinus'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'मध्ययुगीन लैटिन अनुवादकों (जैसे गेरार्डो ऑफ क्रेमोना, ~1150 ई.) ने अरबी "जिबा" को "जैब" पढ़ा, जिसका अरबी में अर्थ है "जेब/तह।" फिर "जैब" का लैटिन अनुवाद "sinus" (तह, खाड़ी, वक्ष) कर दिया।' : 'Medieval Latin translators (like Gerard of Cremona, ~1150 CE) misread Arabic "jiba" as "jaib," which means "pocket/fold/bay" in Arabic. Then translated "jaib" to Latin "sinus" (fold, bay, bosom).'}</p>
          </div>
          <div>
            <p className="text-gold-light font-medium text-xs">{isHi ? '4. अंग्रेजी: Sine' : '4. English: Sine'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">{isHi ? 'लैटिन "sinus" को अंग्रेजी "sine" में संक्षिप्त कर दिया गया। मूल धनुष की डोरी से "खाड़ी/तह" तक — भाषाई विडम्बना की पराकाष्ठा।' : 'Latin "sinus" was shortened to English "sine." From a bowstring to a bay/fold — linguistic irony at its finest.'}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'अन्य त्रिकोणमितीय शब्दों की भारतीय जड़ें' : 'Indian Roots of Other Trig Words'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'Cosine:' : 'Cosine:'}</span>{' '}
            {isHi ? 'संस्कृत "कोज्या" (ko-jya = पूरक कोण की ज्या) से। सीधे भारतीय।' : 'From Sanskrit "kojya" (ko-jya = sine of complementary angle). Directly Indian.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'Versine:' : 'Versine:'}</span>{' '}
            {isHi ? 'संस्कृत "उत्क्रमज्या" (1 − cos θ) — भारतीय नौवहन गणनाओं में व्यापक। बाद में यूरोपीय नौवहन में भी।' : 'Sanskrit "utkramajya" (1 − cos θ) — widely used in Indian navigation calculations. Later adopted in European navigation too.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'Tangent / Secant:' : 'Tangent / Secant:'}</span>{' '}
            {isHi ? 'ये सीधे भारतीय नहीं — यूरोपीय विकास — लेकिन Indian sine/cosine के बिना इनकी परिभाषा असम्भव थी।' : 'Not directly Indian — European development — but impossible to define without Indian sine/cosine foundations.'}
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
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'खगोल विज्ञान, नौवहन और केरल गणित पर प्रभाव' : 'Impact on Astronomy, Navigation and Kerala Mathematics'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आर्यभट की ज्या सारणी केवल एक गणितीय जिज्ञासा नहीं थी — यह भारतीय खगोल विज्ञान की रीढ़ बन गई और केरल के गणितज्ञों ने इसे अगले स्तर तक ले जाया।</>
            : <>Aryabhata's jya table was not merely a mathematical curiosity — it became the backbone of Indian astronomy, and Kerala mathematicians took it to the next level centuries later.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'व्यावहारिक उपयोग' : 'Practical Applications'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'ग्रहण गणना:' : 'Eclipse prediction:'}</span>{' '}
            {isHi ? 'सूर्य और चन्द्रमा की सटीक स्थिति — ज्या के बिना असम्भव। इस पञ्चाङ्ग के ग्रहण एल्गोरिदम में आर्यभट की त्रिकोणमिति है।' : 'Precise positions of Sun and Moon — impossible without jya. This Panchang\'s eclipse algorithm has Aryabhata\'s trigonometry at its core.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'नौवहन:' : 'Navigation:'}</span>{' '}
            {isHi ? 'भारतीय नाविक ध्रुव तारे की ऊँचाई और ज्या सारणियों का उपयोग करके अक्षांश निर्धारित करते थे — GPS से पहले एकमात्र विश्वसनीय तरीका।' : 'Indian sailors used pole star altitude and jya tables to determine latitude — the only reliable method before GPS.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'मन्दिर वास्तुकला:' : 'Temple architecture:'}</span>{' '}
            {isHi ? 'मन्दिर के शिखरों की वक्र रेखाएँ, मेहराब का कोण, छाया गणना — सब ज्या के अनुप्रयोग।' : 'The curved profiles of temple shikharas, arch angles, shadow calculations — all applications of jya.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'मुहूर्त गणना:' : 'Muhurta calculation:'}</span>{' '}
            {isHi ? 'सूर्योदय/अस्त का सटीक समय, ग्रहों की ऊँचाई — सब ज्या पर आधारित। यह पञ्चाङ्ग प्रतिदिन यही करता है।' : 'Precise sunrise/sunset times, planetary altitudes — all based on jya. This Panchang does this every day.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'केरल का आगे विकास' : "Kerala's Advancement"}
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

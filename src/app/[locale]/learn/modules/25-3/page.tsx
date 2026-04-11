'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_3', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.3',
  title: { en: 'Pi = 3.1416 — Aryabhata\'s Approximation', hi: 'π = 3.1416 — आर्यभट का सन्निकटन' },
  subtitle: {
    en: 'How Aryabhata computed pi to 4 decimal places in 499 CE with a key insight about irrationality, and how Madhava of Kerala reached 11 decimals 900 years later',
    hi: 'आर्यभट ने 499 ई. में π को 4 दशमलव तक कैसे गणना की, और केरल के माधव ने 900 वर्ष बाद 11 दशमलव तक कैसे पहुँचे',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 25-2: Sine Is Sanskrit', hi: 'मॉड्यूल 25-2: ज्या से Sine' }, href: '/learn/modules/25-2' },
    { label: { en: 'Module 25-7: Kerala Calculus', hi: 'मॉड्यूल 25-7: केरल गणित' }, href: '/learn/modules/25-7' },
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य' }, href: '/learn/modules/25-1' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_3_01', type: 'mcq',
    question: {
      en: 'What value for pi did Aryabhata give in the Aryabhatiya (499 CE)?',
      hi: 'आर्यभटीय (499 ई.) में आर्यभट ने π का कौन सा मान दिया?',
    },
    options: [
      { en: '3.14', hi: '3.14' },
      { en: '3.1416', hi: '3.1416' },
      { en: '3.14159', hi: '3.14159' },
      { en: '22/7', hi: '22/7' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Aryabhata gave π ≈ 62832/20000 = 3.1416, accurate to 4 decimal places. He stated this in Ganitapada verse 10 of the Aryabhatiya. For comparison: 22/7 ≈ 3.142857 (only 2 correct decimal places); Archimedes\' best was between 223/71 and 22/7 (about 2 decimal places); and the modern value is 3.14159265... Aryabhata\'s value was accurate enough to calculate the circumference of Earth to within 1 km.',
      hi: 'आर्यभट ने π ≈ 62832/20000 = 3.1416 दिया, जो 4 दशमलव तक सटीक है। उन्होंने यह आर्यभटीय के गणितपाद श्लोक 10 में कहा। तुलना: 22/7 ≈ 3.142857 (केवल 2 सही दशमलव); आर्किमिडीज़ का सर्वोत्तम ~2 दशमलव; आधुनिक मान 3.14159265...। आर्यभट का मान पृथ्वी की परिधि को 1 किमी की सीमा में गणना करने के लिए पर्याप्त था।',
    },
  },
  {
    id: 'q25_3_02', type: 'mcq',
    question: {
      en: 'In which verse of the Aryabhatiya did Aryabhata give his value of pi?',
      hi: 'आर्यभटीय के किस श्लोक में आर्यभट ने π का मान दिया?',
    },
    options: [
      { en: 'Ganitapada 1', hi: 'गणितपाद 1' },
      { en: 'Ganitapada 10', hi: 'गणितपाद 10' },
      { en: 'Kalakriyapada 5', hi: 'कालक्रियापाद 5' },
      { en: 'Golapada 17', hi: 'गोलपाद 17' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ganitapada verse 10 of the Aryabhatiya contains Aryabhata\'s pi value. The verse reads (in translation): "Add 4 to 100, multiply by 8, and add to 62000. This is approximately (āsannaḥ) the circumference of a circle whose diameter is 20000." The calculation: (100+4)×8 + 62000 = 832 + 62000 = 62832. Circumference/Diameter = 62832/20000 = 3.1416.',
      hi: 'आर्यभटीय का गणितपाद श्लोक 10 में आर्यभट का π मान है। श्लोक (अनुवाद): "100 में 4 जोड़ो, 8 से गुणा करो, और 62000 में जोड़ो। यह लगभग (आसन्नः) उस वृत्त की परिधि है जिसका व्यास 20000 है।" गणना: (100+4)×8 + 62000 = 832 + 62000 = 62832। परिधि/व्यास = 62832/20000 = 3.1416।',
    },
  },
  {
    id: 'q25_3_03', type: 'mcq',
    question: {
      en: 'What does the Sanskrit word "āsannaḥ" (आसन्नः) — used by Aryabhata in his pi verse — mean?',
      hi: 'π के श्लोक में आर्यभट द्वारा प्रयुक्त संस्कृत शब्द "आसन्नः" का क्या अर्थ है?',
    },
    options: [
      { en: 'Exact', hi: 'सटीक' },
      { en: 'Approximate / approaching', hi: 'सन्निकट / निकटतम' },
      { en: 'Infinite', hi: 'अनन्त' },
      { en: 'Sufficient', hi: 'पर्याप्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Āsannaḥ" (आसन्नः) means "approaching," "near," or "approximate." Aryabhata\'s use of this word is mathematically profound — it implies he understood that his value of π was not exact, that the true value of π cannot be expressed as a simple fraction. This is an implicit recognition that π is irrational (cannot be written as p/q). European mathematicians did not formally prove π\'s irrationality until Johann Heinrich Lambert in 1761 — more than 1200 years after Aryabhata\'s hint.',
      hi: '"आसन्नः" का अर्थ है "निकटतम," "समीप," या "सन्निकट।" आर्यभट द्वारा इस शब्द का उपयोग गणितीय रूप से गहरा है — इसका तात्पर्य है कि उन्होंने समझा था कि उनका π का मान सटीक नहीं है, और π का सही मान एक सरल भिन्न के रूप में व्यक्त नहीं किया जा सकता। यह π की अपरिमेयता (p/q के रूप में नहीं लिखा जा सकता) की अप्रत्यक्ष मान्यता है। यूरोपीय गणितज्ञों ने 1761 में — आर्यभट के संकेत के 1200+ वर्ष बाद — औपचारिक रूप से सिद्ध किया।',
    },
  },
  {
    id: 'q25_3_04', type: 'mcq',
    question: {
      en: 'How accurate was Archimedes\' best approximation of pi compared to Aryabhata\'s?',
      hi: 'आर्यभट की तुलना में आर्किमिडीज़ का π का सर्वोत्तम सन्निकटन कितना सटीक था?',
    },
    options: [
      { en: 'More accurate — Archimedes had 5 decimal places', hi: 'अधिक सटीक — आर्किमिडीज़ के पास 5 दशमलव थे' },
      { en: 'About the same — both had 4 decimal places', hi: 'लगभग समान — दोनों के पास 4 दशमलव थे' },
      { en: 'Less accurate — Archimedes had about 2 correct decimal places', hi: 'कम सटीक — आर्किमिडीज़ के पास लगभग 2 सही दशमलव थे' },
      { en: 'Archimedes did not calculate pi', hi: 'आर्किमिडीज़ ने π की गणना नहीं की' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Archimedes\' best approximation was 223/71 < π < 22/7, giving π between 3.14085 and 3.14286 — roughly 2 correct decimal places. Aryabhata\'s 3.1416 gives π to 4 correct decimal places. The comparison: Archimedes (≈250 BCE) got 2 decimal places with polygons; Aryabhata (499 CE) got 4 decimal places; Madhava (~1350 CE) got 11 decimal places; modern computers have computed π to trillions of decimal places.',
      hi: 'आर्किमिडीज़ का सर्वोत्तम सन्निकटन था 223/71 < π < 22/7, जो π को 3.14085 और 3.14286 के बीच रखता है — लगभग 2 सही दशमलव। आर्यभट का 3.1416 π को 4 सही दशमलव तक देता है। तुलना: आर्किमिडीज़ (~250 BCE) ने बहुभुजों से 2 दशमलव; आर्यभट (499 ई.) ने 4 दशमलव; माधव (~1350 ई.) ने 11 दशमलव।',
    },
  },
  {
    id: 'q25_3_05', type: 'mcq',
    question: {
      en: 'Who computed pi to 11 decimal places, centuries before European mathematicians achieved the same?',
      hi: 'यूरोपीय गणितज्ञों से सदियों पहले π को 11 दशमलव तक किसने गणना की?',
    },
    options: [
      { en: 'Bhaskara II', hi: 'भास्कर द्वितीय' },
      { en: 'Madhava of Sangamagrama', hi: 'माधव संगमग्राम के' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Madhava of Sangamagrama (~1350–1425 CE), founder of the Kerala School of Mathematics, computed π to 11 decimal places — 3.14159265359. He achieved this using his infinite series for π/4 (now called the Madhava-Leibniz series or Gregory-Leibniz series): π/4 = 1 - 1/3 + 1/5 - 1/7 + ... Madhava also developed faster-converging correction terms that made the series practical. Europe did not reach 11 decimal place accuracy until the 17th century.',
      hi: 'संगमग्राम के माधव (~1350–1425 ई.), केरल गणित स्कूल के संस्थापक, ने π को 11 दशमलव — 3.14159265359 — तक गणना की। उन्होंने अपनी अनन्त श्रृंखला π/4 = 1 - 1/3 + 1/5 - 1/7 + ... (अब माधव-लाइबनित्ज़ या ग्रेगरी-लाइबनित्ज़ श्रृंखला कहलाती है) का उपयोग करके यह हासिल किया। यूरोप 17वीं शताब्दी तक 11 दशमलव सटीकता तक नहीं पहुँचा।',
    },
  },
  {
    id: 'q25_3_06', type: 'mcq',
    question: {
      en: 'What century did Madhava of Sangamagrama live in?',
      hi: 'संगमग्राम के माधव किस शताब्दी में रहे?',
    },
    options: [
      { en: '10th century CE', hi: '10वीं शताब्दी ई.' },
      { en: '12th century CE', hi: '12वीं शताब्दी ई.' },
      { en: '14th century CE', hi: '14वीं शताब्दी ई.' },
      { en: '16th century CE', hi: '16वीं शताब्दी ई.' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Madhava lived approximately from 1350 to 1425 CE — the 14th century. He founded what is now called the Kerala School of Astronomy and Mathematics, which flourished from roughly the 14th to 16th centuries CE. The school produced remarkable work in infinite series, trigonometry, and pre-calculus more than 200 years before Newton and Leibniz in Europe. The school was based in the Thrissur district of present-day Kerala.',
      hi: 'माधव लगभग 1350 से 1425 ई. — 14वीं शताब्दी — तक रहे। उन्होंने वह स्थापित किया जिसे अब केरल खगोल विज्ञान और गणित स्कूल कहा जाता है, जो लगभग 14वीं से 16वीं शताब्दी ई. तक फला-फूला। यूरोप में Newton और Leibniz से 200+ वर्ष पहले इस स्कूल ने अनन्त श्रृंखला, त्रिकोणमिति और पूर्व-कलन में उल्लेखनीय कार्य किया।',
    },
  },
  {
    id: 'q25_3_07', type: 'mcq',
    question: {
      en: 'What is the Madhava-Leibniz series for π/4?',
      hi: 'π/4 के लिए माधव-लाइबनित्ज़ श्रृंखला क्या है?',
    },
    options: [
      { en: 'π/4 = 1 + 1/3 + 1/5 + 1/7 + ...', hi: 'π/4 = 1 + 1/3 + 1/5 + 1/7 + ...' },
      { en: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ...', hi: 'π/4 = 1 - 1/3 + 1/5 - 1/7 + ...' },
      { en: 'π/4 = 1/1² + 1/2² + 1/3² + ...', hi: 'π/4 = 1/1² + 1/2² + 1/3² + ...' },
      { en: 'π/4 = 1 - 1/2 + 1/4 - 1/8 + ...', hi: 'π/4 = 1 - 1/2 + 1/4 - 1/8 + ...' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Madhava-Leibniz series is π/4 = 1 - 1/3 + 1/5 - 1/7 + 1/9 - ... (alternating sum of reciprocals of odd numbers). Madhava discovered this around 1350 CE. In Europe, it was independently rediscovered by James Gregory (1671) and Gottfried Leibniz (1673) — hence the dual name. The series converges very slowly (you need thousands of terms for a few decimal places), so Madhava also developed correction terms to speed up convergence dramatically.',
      hi: 'माधव-लाइबनित्ज़ श्रृंखला है: π/4 = 1 - 1/3 + 1/5 - 1/7 + 1/9 - ... (विषम संख्याओं के व्युत्क्रमों का एकान्तर योग)। माधव ने इसे ~1350 ई. में खोजा। यूरोप में, इसे जेम्स ग्रेगरी (1671) और गॉटफ्रीड लाइबनित्ज़ (1673) ने स्वतन्त्र रूप से पुनः खोजा। श्रृंखला बहुत धीरे अभिसरण करती है, इसलिए माधव ने सुधार पद भी विकसित किए।',
    },
  },
  {
    id: 'q25_3_08', type: 'mcq',
    question: {
      en: 'By approximately what year had Europe matched Madhava\'s pi accuracy of 11 decimal places?',
      hi: 'यूरोप ने माधव की 11 दशमलव की π सटीकता लगभग किस वर्ष तक हासिल की?',
    },
    options: [
      { en: 'Around 1400 CE', hi: 'लगभग 1400 ई.' },
      { en: 'Around 1500 CE', hi: 'लगभग 1500 ई.' },
      { en: 'Around 1600 CE', hi: 'लगभग 1600 ई.' },
      { en: 'Around 1700 CE', hi: 'लगभग 1700 ई.' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Europe matched Madhava\'s 11-decimal accuracy only around 1600 CE — roughly 250 years after Madhava achieved it around 1350 CE. Ludolph van Ceulen calculated π to 20 decimal places by 1596, and to 35 decimal places by his death in 1610, using Archimedes\' polygon method but with enormous computation. The infinite series approach (which Madhava pioneered) was rediscovered in Europe by James Gregory and Leibniz in the 1670s.',
      hi: 'यूरोप ने माधव की 11-दशमलव सटीकता लगभग 1600 ई. तक ही हासिल की — माधव द्वारा ~1350 ई. में इसे प्राप्त करने के लगभग 250 वर्ष बाद। लुडोल्फ वान सेउलेन ने 1596 तक π को 20 दशमलव तक और 1610 में अपनी मृत्यु तक 35 दशमलव तक गणना की। अनन्त श्रृंखला दृष्टिकोण (जिसका माधव ने नेतृत्व किया) 1670 के दशक में जेम्स ग्रेगरी और लाइबनित्ज़ द्वारा यूरोप में पुनः खोजा गया।',
    },
  },
  {
    id: 'q25_3_09', type: 'true_false',
    question: {
      en: 'Aryabhata\'s use of the word "āsannaḥ" (approximate) for his pi value implies he understood that pi cannot be expressed as an exact fraction.',
      hi: 'π के लिए "आसन्नः" (सन्निकट) शब्द का उपयोग यह दर्शाता है कि आर्यभट ने समझा था कि π को एक सटीक भिन्न के रूप में व्यक्त नहीं किया जा सकता।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The use of "āsannaḥ" (approaching/approximate) is widely interpreted by historians of mathematics as Aryabhata implicitly recognising that π is irrational — that no exact fractional representation exists. This is a remarkable insight. The formal proof of π\'s irrationality came from Johann Heinrich Lambert in 1761 in Europe, more than 1260 years after Aryabhata\'s text. Whether Aryabhata had a proof or simply an intuition remains debated, but his choice of word is mathematically significant.',
      hi: 'सत्य। "आसन्नः" (निकटतम/सन्निकट) के उपयोग को गणित के इतिहासकारों द्वारा आर्यभट की π की अपरिमेयता की अप्रत्यक्ष पहचान के रूप में व्यापक रूप से समझा जाता है। यह उल्लेखनीय अन्तर्दृष्टि है। π की अपरिमेयता का औपचारिक प्रमाण 1761 में यूरोप में Johann Heinrich Lambert द्वारा आया — आर्यभट के पाठ के 1260+ वर्ष बाद।',
    },
  },
  {
    id: 'q25_3_10', type: 'true_false',
    question: {
      en: 'European mathematicians had matched or surpassed Madhava\'s pi accuracy by 1400 CE.',
      hi: 'यूरोपीय गणितज्ञों ने 1400 ई. तक माधव की π सटीकता को मेल किया या उससे आगे निकल गए थे।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. In 1400 CE, European mathematics was still based on Archimedes\' polygon method, which gave pi to about 3–4 decimal places at most. Madhava had already computed 11 decimal places by ~1375 CE. Europe only surpassed Madhava\'s accuracy in the late 1500s to early 1600s with Ludolph van Ceulen\'s heroic computations (20 decimal places by 1596). The infinite series approach, which is far more efficient, was rediscovered in Europe only in the 1670s by Gregory and Leibniz.',
      hi: 'असत्य। 1400 ई. में, यूरोपीय गणित अभी भी आर्किमिडीज़ की बहुभुज विधि पर आधारित था, जो अधिकतम 3-4 दशमलव देती थी। माधव ने ~1375 ई. तक 11 दशमलव गणना कर ली थी। यूरोप ने 1590 के दशक में लुडोल्फ वान सेउलेन की गणनाओं (1596 तक 20 दशमलव) से माधव की सटीकता को पार किया। अनन्त श्रृंखला दृष्टिकोण 1670 के दशक में ग्रेगरी और लाइबनित्ज़ द्वारा पुनः खोजा गया।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Aryabhata's Pi                                             */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'आर्यभट का π — चार दशमलव और एक गहरा संकेत' : "Aryabhata's π — Four Decimals and a Deep Hint"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>499 ई. में, जब यूरोपीय गणित अभी भी आर्किमिडीज़ की जीवा-विधि से जूझ रहा था, आर्यभट ने एक श्लोक में न केवल π = 3.1416 दिया, बल्कि एक ऐसा शब्द ("आसन्नः") भी जोड़ा जो गणित के इतिहास में 1200 से अधिक वर्षों तक अद्वितीय रहा।</>
            : <>In 499 CE, when European mathematics was still wrestling with Archimedes\' polygon method, Aryabhata gave not just π = 3.1416 in a single verse but added a word ("āsannaḥ") that would remain uniquely perceptive in mathematical history for over 1200 years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'गणितपाद श्लोक 10 — पाठ और व्याख्या' : 'Ganitapada Verse 10 — Text and Interpretation'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-3 font-medium text-center italic text-gold-light/80">
          {isHi
            ? '"चतुरधिकं शतमष्टगुणं द्वाषष्टिस्तथा सहस्राणाम्।\nअयुतद्वयविष्कम्भस्यासन्नो वृत्तपरिणाहः॥"'
            : '"chaturadhikaṃ śatamaṣṭaguṇaṃ dvāṣaṣṭistathā sahasrāṇām.\nayutadvayaviṣkambhasyāsanno vṛttapariṇāhaḥ"'}
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
          {isHi ? 'आर्यभट बनाम समकालीन विश्व' : 'Aryabhata vs. the Contemporary World'}
        </h4>
        <div className="space-y-1">
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'आर्किमिडीज (~250 BCE):' : 'Archimedes (~250 BCE):'}</span> {isHi ? '223/71 से 22/7 तक — ~2 सही दशमलव' : '223/71 to 22/7 — ~2 correct decimals'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'आर्यभट (499 ई.):' : 'Aryabhata (499 CE):'}</span> {isHi ? '3.1416 — 4 सही दशमलव' : '3.1416 — 4 correct decimals'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'चीन (~480 ई.):' : 'China (~480 CE):'}</span> {isHi ? 'ज़ू चोंगज़ी — 355/113 ≈ 3.14159 — 6 दशमलव' : 'Zu Chongzhi — 355/113 ≈ 3.14159 — 6 decimals'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'माधव (~1375 ई.):' : 'Madhava (~1375 CE):'}</span> {isHi ? '3.14159265359 — 11 दशमलव' : '3.14159265359 — 11 decimals'}</p>
          <p className="text-text-secondary text-xs"><span className="text-gold-light font-medium">{isHi ? 'यूरोप (~1600 ई.):' : 'Europe (~1600 CE):'}</span> {isHi ? 'वान सेउलेन — 20+ दशमलव (पर अनन्त श्रृंखला नहीं जानते थे)' : 'van Ceulen — 20+ decimals (but no infinite series yet)'}</p>
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
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'माधव की अनन्त श्रृंखला — 250 वर्ष पहले' : "Madhava's Infinite Series — 250 Years Ahead"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>~1350 ई. में केरल के एक गणितज्ञ ने वह खोजा जिसे यूरोप 1670 में "खोजेगा" — π की अनन्त श्रृंखला। माधव की श्रृंखला न केवल π के लिए थी — यह sin और cos के लिए भी थी, जो कलन (calculus) का आधार है।</>
            : <>Around 1350 CE, a Kerala mathematician discovered what Europe would "discover" in 1670 — an infinite series for π. Madhava's series were not just for π — they were also for sin and cos, the foundation of calculus.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'माधव-लाइबनित्ज़ श्रृंखला' : 'The Madhava-Leibniz Series'}
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
          {isHi ? 'माधव की सुधार पद विधि' : "Madhava's Correction Terms"}
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
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'π का व्यावहारिक उपयोग और भारतीय खगोल विज्ञान' : 'Practical Uses of π and Indian Astronomy'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारतीय गणितज्ञों ने π की गणना केवल अकादमिक रुचि के लिए नहीं की — इसके व्यावहारिक अनुप्रयोग थे जो खगोल विज्ञान और इंजीनियरिंग को प्रत्यक्ष रूप से प्रभावित करते थे।</>
            : <>Indian mathematicians computed π not out of academic curiosity alone — it had direct practical applications that affected astronomy and engineering.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'खगोल विज्ञान में π के अनुप्रयोग' : 'Applications of π in Astronomy'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'पृथ्वी की परिधि:' : "Earth's circumference:"}</span>{' '}
            {isHi ? 'आर्यभट ने π = 3.1416 और त्रिज्या 3300 योजन का उपयोग करके पृथ्वी की परिधि की गणना की। उनका उत्तर ~24835 मील था — आधुनिक मान 24901 मील से केवल 66 मील दूर।' : 'Aryabhata used π = 3.1416 with radius 3300 yojanas to compute Earth\'s circumference — approximately 24835 miles, only 66 miles from the modern value of 24901 miles.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'ग्रहीय कक्षाएँ:' : 'Planetary orbits:'}</span>{' '}
            {isHi ? 'ग्रहों की परिधि और व्यास की गणना — ग्रहण और युति (conjunction) की भविष्यवाणी के लिए — सब π पर निर्भर।' : 'Computing planetary orbital circumferences and periods — for eclipse and conjunction prediction — all dependent on π.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'वेधशाला उपकरण:' : 'Observatory instruments:'}</span>{' '}
            {isHi ? 'गोलाकार astrolabe, gnomon (शङ्कु), और अर्मिलरी क्षेत्र — सभी के निर्माण में π की आवश्यकता।' : 'Spherical astrolabes, gnomons (shanku), and armillary spheres — all require π for construction.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'π की अपरिमेयता — एक दार्शनिक प्रश्न' : "π's Irrationality — A Philosophical Question"}
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

'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/26-3.json';

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
          {tl({ en: "Sayana\'s Rig Veda Commentary", hi: "सायण की ऋग्वेद टिप्पणी", sa: "सायण की ऋग्वेद टिप्पणी" }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>14वीं शताब्दी ईस्वी में, विजयनगर साम्राज्य के प्रधानमंत्री और महान संस्कृत विद्वान सायणाचार्य ने ऋग्वेद पर एक व्यापक टिप्पणी लिखी। भजन 1.50.4 पर टिप्पणी करते समय — सूर्य देवता को एक भजन — उन्होंने एक कथन लिखा जो 21वीं शताब्दी में वैज्ञानिकों को चौंका देगा।</>
            : <>In the 14th century CE, Sayanacharya — prime minister of the Vijayanagara Empire and great Sanskrit scholar — wrote a comprehensive commentary on the Rig Veda. While commenting on hymn 1.50.4 — a hymn to the Sun god — he wrote a statement that would astonish scientists in the 21st century.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Original Sanskrit and Translation', hi: 'मूल संस्कृत और अनुवाद', sa: 'मूल संस्कृत और अनुवाद' }, locale)}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4 mb-3">
          <p className="text-gold-light text-xs italic leading-relaxed font-devanagari">
            "तथा च स्मर्यते योजनानां सहस्रे द्वे द्वे शते द्वे च योजने  एकेन निमिषार्धेन क्रममाण नमोऽस्तु ते"
          </p>
          <p className="text-text-secondary text-xs mt-2 leading-relaxed">
            {tl({ en: '"Thus it is remembered: O [Surya], you who traverse two thousand two hundred and two yojanas in half a nimesha, salutations to you."', hi: '"इस प्रकार स्मरण किया जाता है: हे [सूर्य], जो आधे निमेष में दो हज़ार दो सौ दो योजन पार करता है, तुम्हें नमस्कार है।"', sa: '"इस प्रकार स्मरण किया जाता है: हे [सूर्य], जो आधे निमेष में दो हज़ार दो सौ दो योजन पार करता है, तुम्हें नमस्कार है।"' }, locale)}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {tl({ en: 'Sayana, Rigvedabhashya, commentary on hymn 1.50.4 (~1380 CE)', hi: 'सायण, ऋग्वेदभाष्य, भजन 1.50.4 पर टिप्पणी (~1380 ईस्वी)', sa: 'सायण, ऋग्वेदभाष्य, भजन 1.50.4 पर टिप्पणी (~1380 ईस्वी)' }, locale)}</p>
        </blockquote>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Understanding the Units', hi: 'इकाइयाँ समझना', sa: 'इकाइयाँ समझना' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{tl({ en: 'Yojana:', hi: 'योजन:', sa: 'योजन:' }, locale)}</span> {tl({ en: 'Ancient Indian distance unit. Per Arthashastra ≈ 9.09 miles (14.6 km).', hi: 'प्राचीन भारतीय दूरी की इकाई। अर्थशास्त्र के अनुसार ≈ 9.09 मील (14.6 किमी)।', sa: 'प्राचीन भारतीय दूरी की इकाई। अर्थशास्त्र के अनुसार ≈ 9.09 मील (14.6 किमी)।' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Nimesha:', hi: 'निमेष:', sa: 'निमेष:' }, locale)}</span> {tl({ en: 'A blink of an eye — ancient Indian time unit. ≈ 16/75 seconds.', hi: 'पलक झपकाने का समय — प्राचीन भारतीय समय की इकाई। ≈ 16/75 सेकंड।', sa: 'पलक झपकाने का समय — प्राचीन भारतीय समय की इकाई। ≈ 16/75 सेकंड।' }, locale)}</p>
          <p><span className="text-gold-light font-medium">{tl({ en: 'Half-nimesha:', hi: 'अर्ध-निमेष:', sa: 'अर्ध-निमेष:' }, locale)}</span> {tl({ en: '≈ 8/75 seconds ≈ 0.1067 seconds.', hi: '≈ 8/75 सेकंड ≈ 0.1067 सेकंड।', sa: '≈ 8/75 सेकंड ≈ 0.1067 सेकंड।' }, locale)}</p>
          <div className="mt-3 pt-3 border-t border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{tl({ en: 'Calculation:', hi: 'गणना:', sa: 'गणना:' }, locale)}</p>
            <p className="font-mono text-xs text-gold-primary">2,202 × 9.09 mi / 0.1067 s ≈ 186,536 mi/s</p>
            <p className="font-mono text-xs text-emerald-400 mt-1">{tl({ en: 'Modern: 186,282 mi/s', hi: 'आधुनिक: 186,282 मील/सेकंड', sa: 'आधुनिक: 186,282 मील/सेकंड' }, locale)}</p>
            <p className="font-mono text-xs text-gold-light mt-1">{tl({ en: 'Error: 0.14%', hi: 'त्रुटि: 0.14%', sa: 'त्रुटि: 0.14%' }, locale)}</p>
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
          {tl({ en: 'The Scholarly Debate: Coincidence or Knowledge?', hi: 'विद्वत् बहस: संयोग या ज्ञान?', sa: 'विद्वत् बहस: संयोग या ज्ञान?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सायण के पाठ की ईमानदार समझ के लिए दोनों पक्षों की सावधानीपूर्वक जाँच की आवश्यकता है। यहाँ विद्वान वास्तव में क्या तर्क देते हैं।</>
            : <>An honest understanding of Sayana's text requires careful examination of both sides. Here is what scholars actually argue.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Arguments in Support', hi: 'समर्थन में तर्क', sa: 'समर्थन में तर्क' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {tl({ en: 'The numerical coincidence is extraordinarily precise (0.14% error)', hi: 'संख्यात्मक संयोग बेहद सटीक है (0.14% त्रुटि)', sa: 'संख्यात्मक संयोग बेहद सटीक है (0.14% त्रुटि)' }, locale)}</p>
          <p>→ {tl({ en: 'Sayana explicitly says this "is remembered" — citing an older tradition', hi: 'सायण स्पष्ट रूप से कहते हैं यह "स्मरण किया जाता है" — एक पुरानी परम्परा को उद्धृत कर रहे हैं', sa: 'सायण स्पष्ट रूप से कहते हैं यह "स्मरण किया जाता है" — एक पुरानी परम्परा को उद्धृत कर रहे हैं' }, locale)}</p>
          <p>→ {tl({ en: 'Indian astronomy achieved extremely precise measurements (Aryabhata, Brahmagupta)', hi: 'भारतीय खगोल विज्ञान ने अत्यन्त सटीक माप हासिल किए (आर्यभट, ब्रह्मगुप्त)', sa: 'भारतीय खगोल विज्ञान ने अत्यन्त सटीक माप हासिल किए (आर्यभट, ब्रह्मगुप्त)' }, locale)}</p>
          <p>→ {tl({ en: 'Computing stellar velocities may have required knowledge of finite light speed', hi: 'नाक्षत्र वेग की गणना के लिए प्रकाश की सीमित गति की आवश्यकता हो सकती थी', sa: 'नाक्षत्र वेग की गणना के लिए प्रकाश की सीमित गति की आवश्यकता हो सकती थी' }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Arguments for Scepticism', hi: 'संदेह के तर्क', sa: 'संदेह के तर्क' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {tl({ en: 'Yojana length varies 9–16 km across texts — choosing the "right" value affects the result', hi: 'योजन की लम्बाई ग्रन्थों में 9-16 किमी तक भिन्न होती है — "सही" मान चुनना परिणाम को प्रभावित करता है', sa: 'योजन की लम्बाई ग्रन्थों में 9-16 किमी तक भिन्न होती है — "सही" मान चुनना परिणाम को प्रभावित करता है' }, locale)}</p>
          <p>→ {tl({ en: 'This is a religious commentary, not a scientific treatise', hi: 'यह एक धार्मिक टिप्पणी है, न कि वैज्ञानिक ग्रन्थ', sa: 'यह एक धार्मिक टिप्पणी है, न कि वैज्ञानिक ग्रन्थ' }, locale)}</p>
          <p>→ {tl({ en: 'No explanation given for how such a measurement could have been made', hi: 'कोई व्याख्या नहीं दी गई कि यह माप कैसे किया गया', sa: 'कोई व्याख्या नहीं दी गई कि यह माप कैसे किया गया' }, locale)}</p>
          <p>→ {tl({ en: 'Conventional hyperbole for "speed of the Sun" was common in ancient poetry', hi: 'प्राचीन काव्य में "सूर्य की गति" के लिए परंपरागत अतिशयोक्ति आम थी', sa: 'प्राचीन काव्य में "सूर्य की गति" के लिए परंपरागत अतिशयोक्ति आम थी' }, locale)}</p>
          <p>→ {tl({ en: 'No other Indian text cites this specific value', hi: 'कोई अन्य भारतीय ग्रन्थ इस विशिष्ट मान का हवाला नहीं देता', sa: 'कोई अन्य भारतीय ग्रन्थ इस विशिष्ट मान का हवाला नहीं देता' }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Fair Conclusion', hi: 'निष्पक्ष निष्कर्ष', sa: 'निष्पक्ष निष्कर्ष' }, locale)}
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
          {tl({ en: 'Sayana and the Broader Tradition', hi: 'सायण और व्यापक परम्परा', sa: 'सायण और व्यापक परम्परा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रकाश की गति के प्रश्न से परे, सायण और उनकी वैदिक टिप्पणियाँ अपने आप में असाधारण हैं। उनका कार्य भारतीय बौद्धिक जीवन की जीवन्तता और गहराई का प्रमाण है।</>
            : <>Beyond the speed of light question, Sayana and his Vedic commentaries are extraordinary in their own right. His work is a testament to the vitality and depth of Indian intellectual life.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Who Was Sayana', hi: 'सायण कौन थे', sa: 'सायण कौन थे' }, locale)}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {tl({ en: 'Prime minister of the Vijayanagara Empire (1336–1646 CE)', hi: 'विजयनगर साम्राज्य (1336-1646 ईस्वी) के प्रधानमंत्री', sa: 'विजयनगर साम्राज्य (1336-1646 ईस्वी) के प्रधानमंत्री' }, locale)}</p>
          <p>→ {tl({ en: 'Worked under patronage of kings Bukkaraya and Harihara II', hi: 'राजा बुक्कराय और हरिहर द्वितीय के संरक्षण में कार्य किया', sa: 'राजा बुक्कराय और हरिहर द्वितीय के संरक्षण में कार्य किया' }, locale)}</p>
          <p>→ {tl({ en: 'Wrote comprehensive commentaries on all four Vedas — still the primary reference for Vedic interpretation', hi: 'चारों वेदों पर व्यापक टिप्पणियाँ लिखीं — अभी भी Vedic व्याख्या की प्राथमिक संदर्भ', sa: 'चारों वेदों पर व्यापक टिप्पणियाँ लिखीं — अभी भी Vedic व्याख्या की प्राथमिक संदर्भ' }, locale)}</p>
          <p>→ {tl({ en: 'Rig Veda commentary (~1380 CE) considered most important', hi: '~1380 ईस्वी में रचित ऋग्वेद टिप्पणी सबसे महत्त्वपूर्ण मानी जाती है', sa: '~1380 ईस्वी में रचित ऋग्वेद टिप्पणी सबसे महत्त्वपूर्ण मानी जाती है' }, locale)}</p>
          <p>→ {tl({ en: 'His work represents the unbroken tradition of Sanskrit scholarship in India', hi: 'उनका कार्य भारत की संस्कृत विद्वत्ता की अखंड परम्परा का प्रतिनिधित्व करता है', sa: 'उनका कार्य भारत की संस्कृत विद्वत्ता की अखंड परम्परा का प्रतिनिधित्व करता है' }, locale)}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Speed of Light — A Timeline', hi: 'प्रकाश की गति — एक समयरेखा', sa: 'प्रकाश की गति — एक समयरेखा' }, locale)}
        </h4>
        <div className="space-y-1 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">~1380 ईस्वी / ~1380 CE:</span> {tl({ en: 'Sayana — 2,202 yojanas per half-nimesha in Rig Veda commentary', hi: 'सायण — ऋग्वेद टिप्पणी में 2,202 योजन/अर्ध-निमेष', sa: 'सायण — ऋग्वेद टिप्पणी में 2,202 योजन/अर्ध-निमेष' }, locale)}</p>
          <p><span className="text-gold-light font-medium">1676 ईस्वी / 1676 CE:</span> {tl({ en: "Ole Rømer — first European measurement from Jupiter\'s moons", hi: "ओले रोमर — बृहस्पति के चन्द्रमाओं से पहला यूरोपीय माप", sa: "ओले रोमर — बृहस्पति के चन्द्रमाओं से पहला यूरोपीय माप" }, locale)}</p>
          <p><span className="text-gold-light font-medium">1729 ईस्वी / 1729 CE:</span> {tl({ en: 'James Bradley — improved measurement from starlight aberration', hi: 'जेम्स ब्रैडली — स्टारलाइट विपथन से बेहतर माप', sa: 'जेम्स ब्रैडली — स्टारलाइट विपथन से बेहतर माप' }, locale)}</p>
          <p><span className="text-gold-light font-medium">1849 ईस्वी / 1849 CE:</span> {tl({ en: 'Fizeau — first laboratory measurement (gear-wheel method)', hi: 'फिज़ो — पहला प्रयोगशाला माप (गियर-पहिया विधि)', sa: 'फिज़ो — पहला प्रयोगशाला माप (गियर-पहिया विधि)' }, locale)}</p>
          <p><span className="text-gold-light font-medium">1865 ईस्वी / 1865 CE:</span> {tl({ en: 'Maxwell — derived c from electromagnetic theory', hi: 'मैक्सवेल — विद्युत चुम्बकीय सिद्धान्त से c व्युत्पन्न', sa: 'मैक्सवेल — विद्युत चुम्बकीय सिद्धान्त से c व्युत्पन्न' }, locale)}</p>
          <p><span className="text-gold-light font-medium">1983 ईस्वी / 1983 CE:</span> {tl({ en: 'c defined as exactly 299,792,458 m/s — basis of metre definition', hi: 'c को 299,792,458 m/s पर परिभाषित किया — मीटर की परिभाषा का आधार', sa: 'c को 299,792,458 m/s पर परिभाषित किया — मीटर की परिभाषा का आधार' }, locale)}</p>
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

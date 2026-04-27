'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/28-2.json';

const META: ModuleMeta = {
  id: 'mod_28_2', phase: 8, topic: 'Prashna', moduleNumber: '28.2',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 14,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/28-1' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/prashna-ashtamangala' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q28_2_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q28_2_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q28_2_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
];

/* ---- The 8 Auspicious Objects (hoisted) ---- */
const MANGALA_OBJECTS = [
  { en: 'Darpana (Mirror)', hi: 'दर्पण (आईना)', deity: 'Aditya' },
  { en: 'Kanaka (Gold)', hi: 'कनक (स्वर्ण)', deity: 'Lakshmi' },
  { en: 'Kumkuma (Turmeric)', hi: 'कुंकुम (हल्दी)', deity: 'Durga' },
  { en: 'Purna Kumbha (Full Vessel)', hi: 'पूर्ण कुम्भ', deity: 'Varuna' },
  { en: 'Deepa (Lamp)', hi: 'दीप', deity: 'Agni' },
  { en: 'Grantha (Scripture)', hi: 'ग्रन्थ (शास्त्र)', deity: 'Saraswati' },
  { en: 'Vrishabha (Bull)', hi: 'वृषभ (बैल)', deity: 'Shiva' },
  { en: 'Vyajana (Fan)', hi: 'व्यजन (पंखा)', deity: 'Vayu' },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Kerala Tradition of Ashtamangala', hi: 'अष्टमंगल की केरल परम्परा', sa: 'अष्टमंगल की केरल परम्परा' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टमंगल प्रश्न केरल की एक अनूठी ज्योतिष परम्परा है जो मन्दिरों में "देव प्रश्न" के रूप में प्रचलित है। "अष्ट" = आठ, "मंगल" = शुभ — आठ शुभ वस्तुओं का उपयोग करके प्रश्न का उत्तर खोजा जाता है। यह पद्धति प्रश्न मार्ग ग्रन्थ में विस्तार से वर्णित है और आज भी केरल के प्रमुख मन्दिरों में नियमित रूप से प्रयुक्त होती है।</>
            : <>Ashtamangala Prashna is a unique Kerala astrological tradition practiced extensively in temples as &quot;Deva Prashna.&quot; &quot;Ashta&quot; = eight, &quot;Mangala&quot; = auspicious — eight sacred objects are used to divine the answer to a question. This method is described in detail in the Prashna Marga text and is still regularly practiced in major Kerala temples today.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'The 8 Mangala Dravyas', hi: '8 मंगल द्रव्य', sa: '8 मंगल द्रव्य' }, locale)}
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {MANGALA_OBJECTS.map((obj, i) => (
            <div key={i} className="text-text-secondary text-xs leading-relaxed">
              <span className="text-gold-light font-semibold">{i + 1}.</span>{' '}
              {isHi ? obj.hi : obj.en}
              <span className="text-text-secondary/60 ml-1">({obj.deity})</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'The Casting Methodology', hi: 'विधि प्रक्रिया', sa: 'विधि प्रक्रिया' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टमंगल प्रश्न की प्रक्रिया: सर्वप्रथम आठ शुभ वस्तुएँ देवता के समक्ष या पवित्र स्थान पर रखी जाती हैं। फिर प्रश्नकर्ता एक मुट्ठी कौड़ियाँ (108 या अधिक) उठाता है। कौड़ियाँ तीन बार फेंकी जाती हैं — पहली बार से लग्न, दूसरी बार से चन्द्र स्थिति, और तीसरी बार से अतिरिक्त ग्रहीय जानकारी प्राप्त होती है। प्रत्येक बार खुली (मुख ऊपर) कौड़ियों की संख्या गिनी जाती है और 12 से भाग दिया जाता है — शेषफल राशि संख्या देता है।</>
            : <>The Ashtamangala procedure: First, the eight auspicious objects are placed before the deity or in a sacred space. The querent then picks up a handful of cowrie shells (108 or more). The shells are cast three times — the first cast determines the Lagna, the second the Moon&apos;s position, and the third provides additional planetary information. Each time, the number of face-up shells is counted and divided by 12 — the remainder gives the rashi number (1=Aries through 12=Pisces).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Interpreting the Results', hi: 'परिणामों की व्याख्या', sa: 'परिणामों की व्याख्या' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>कौड़ियों से प्राप्त लग्न और चन्द्र स्थिति के आधार पर एक पूर्ण प्रश्न कुण्डली बनाई जाती है। इसके अतिरिक्त, आठ शुभ वस्तुओं में से कौन सी वस्तु प्रश्नकर्ता के निकटतम है, वह भी विश्लेषण में सम्मिलित होती है। प्रत्येक वस्तु का एक विशिष्ट शुभ/अशुभ अर्थ है — उदाहरणार्थ, दर्पण स्पष्टता और सत्य का, ग्रन्थ ज्ञान का, और दीप आशा का प्रतीक है।</>
            : <>Based on the Lagna and Moon position obtained from the shells, a complete Prashna chart is constructed. Additionally, which of the eight auspicious objects is closest to the querent is factored into the analysis. Each object has a specific auspicious meaning — for example, the Mirror symbolizes clarity and truth, the Scripture represents knowledge, and the Lamp represents hope and divine guidance.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Deva Prashna — Temple Divination', hi: 'देव प्रश्न — मन्दिर भविष्यवाणी', sa: 'देव प्रश्न — मन्दिर भविष्यवाणी' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>देव प्रश्न अष्टमंगल प्रश्न का सबसे पवित्र रूप है, जिसका उपयोग मन्दिर के देवता की इच्छा जानने के लिए किया जाता है। जब कोई मन्दिर अकारण समस्याओं का सामना करता है — दुर्घटनाएँ, आर्थिक कठिनाइयाँ, भक्तों में कमी — तो देव प्रश्न किया जाता है। इसमें ज्योतिषी देवता के "प्रतिनिधि" के रूप में कार्य करता है, और प्रश्न कुण्डली बताती है कि देवता क्या चाहते हैं — जीर्णोद्धार, विशेष पूजा, या दोष निवारण।</>
            : <>Deva Prashna is the most sacred form of Ashtamangala Prashna, used to divine the deity&apos;s wishes in temple matters. When a temple faces inexplicable problems — accidents, financial difficulties, decline in devotees — Deva Prashna is performed. The astrologer acts as the deity&apos;s &quot;representative,&quot; and the Prashna chart reveals what the deity wants — renovation, special worship, or rectification of past errors in ritual.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Try It: Ashtamangala Tool', hi: 'इसे आज़माएँ: अष्टमंगल उपकरण', sa: 'इसे आज़माएँ: अष्टमंगल उपकरण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Our Ashtamangala Prashna tool digitizes this ancient Kerala tradition. Select your question category, virtually cast the cowrie shells, and receive a Prashna chart with interpretation of the 8 Mangala Dravyas, Lagna, and Moon positions — all computed using the same classical methodology described in Prashna Marga.', hi: 'हमारा अष्टमंगल प्रश्न उपकरण इस प्राचीन केरल परम्परा को डिजिटल रूप देता है। अपनी प्रश्न श्रेणी चुनें, वर्चुअल कौड़ियाँ फेंकें, और 8 मंगल द्रव्यों, लग्न और चन्द्र स्थिति की व्याख्या के साथ प्रश्न कुण्डली प्राप्त करें।', sa: 'हमारा अष्टमंगल प्रश्न उपकरण इस प्राचीन केरल परम्परा को डिजिटल रूप देता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module28_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

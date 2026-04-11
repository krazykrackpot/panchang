'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_25_4', phase: 5, topic: 'Indian Mathematics', moduleNumber: '25.4',
  title: { en: 'Negative Numbers — Debt Before Descartes', hi: 'ऋण संख्याएँ — देकार्त से पहले ऋण' },
  subtitle: {
    en: 'How Brahmagupta formalised rules for negative numbers in 628 CE — 1000 years before Europe accepted them — and why Descartes called them "false"',
    hi: 'ब्रह्मगुप्त ने 628 ई. में ऋण संख्याओं के नियम कैसे औपचारिक किए — यूरोप की स्वीकृति से 1000 वर्ष पहले — और देकार्त ने उन्हें "असत्य" क्यों कहा',
  },
  estimatedMinutes: 11,
  crossRefs: [
    { label: { en: 'Module 25-1: Zero', hi: 'मॉड्यूल 25-1: शून्य' }, href: '/learn/modules/25-1' },
    { label: { en: 'Module 25-5: Binary Code', hi: 'मॉड्यूल 25-5: द्विआधारी संकेत' }, href: '/learn/modules/25-5' },
    { label: { en: 'Module 25-3: Pi = 3.1416', hi: 'मॉड्यूल 25-3: π = 3.1416' }, href: '/learn/modules/25-3' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q25_4_01', type: 'mcq',
    question: {
      en: 'Who first formalised the rules for arithmetic with negative numbers?',
      hi: 'ऋण संख्याओं के साथ गणित के नियम सबसे पहले किसने औपचारिक किए?',
    },
    options: [
      { en: 'Mahavira', hi: 'महावीर' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Fibonacci', hi: 'फिबोनाची' },
      { en: 'Diophantus', hi: 'डायोफेन्टस' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Brahmagupta (598–668 CE) was the first mathematician in history to formally define the rules of arithmetic with negative numbers in his Brahmasphutasiddhanta (628 CE). He laid out rules for adding, subtracting, multiplying, and dividing positive numbers ("dhana" — wealth), negative numbers ("rina" — debt), and zero. The Greek Diophantus encountered negative solutions but dismissed them as "absurd." Brahmagupta accepted them as full mathematical entities.',
      hi: 'ब्रह्मगुप्त (598–668 ई.) इतिहास में पहले गणितज्ञ थे जिन्होंने अपने ब्रह्मस्फुटसिद्धान्त (628 ई.) में ऋण संख्याओं के साथ गणित के नियम औपचारिक रूप से परिभाषित किए। ग्रीक डायोफेन्टस को ऋण समाधान मिले लेकिन उन्होंने उन्हें "बेतुका" कहकर अस्वीकार कर दिया। ब्रह्मगुप्त ने उन्हें पूर्ण गणितीय सत्ताओं के रूप में स्वीकार किया।',
    },
  },
  {
    id: 'q25_4_02', type: 'mcq',
    question: {
      en: 'What is the Sanskrit term Brahmagupta used for positive numbers?',
      hi: 'ब्रह्मगुप्त ने धनात्मक संख्याओं के लिए कौन सा संस्कृत शब्द प्रयोग किया?',
    },
    options: [
      { en: 'Rina (ऋण)', hi: 'ऋण' },
      { en: 'Dhana (धन)', hi: 'धन' },
      { en: 'Shunya (शून्य)', hi: 'शून्य' },
      { en: 'Mithya (मिथ्या)', hi: 'मिथ्या' },
    ],
    correctAnswer: 1,
    explanation: {
      en: '"Dhana" (धन) is the Sanskrit word meaning "wealth" or "assets" that Brahmagupta used for positive numbers. The accounting metaphor was deliberate: positive numbers represent assets you possess (dhana = wealth), and negative numbers represent debts you owe (rina = debt/negative). This practical framing — rooted in commerce and accounting — made negative numbers intuitively understandable in the Indian context, unlike in Greece where numbers had to be lengths and therefore couldn\'t be negative.',
      hi: '"धन" संस्कृत शब्द है जिसका अर्थ "सम्पत्ति" या "परिसम्पत्ति" है, जिसे ब्रह्मगुप्त ने धनात्मक संख्याओं के लिए प्रयोग किया। लेखांकन रूपक जानबूझकर था: धनात्मक संख्याएँ आपके पास मौजूद परिसम्पत्तियों (धन) को और ऋण संख्याएँ आपके द्वारा देय ऋणों (ऋण) को दर्शाती हैं।',
    },
  },
  {
    id: 'q25_4_03', type: 'mcq',
    question: {
      en: 'What is the Sanskrit term Brahmagupta used for negative numbers?',
      hi: 'ब्रह्मगुप्त ने ऋण संख्याओं के लिए कौन सा संस्कृत शब्द प्रयोग किया?',
    },
    options: [
      { en: 'Viyat (वियत्)', hi: 'वियत्' },
      { en: 'Ksaya (क्षय)', hi: 'क्षय' },
      { en: 'Rina (ऋण)', hi: 'ऋण' },
      { en: 'Apama (अपमा)', hi: 'अपमा' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '"Rina" (ऋण) means "debt" in Sanskrit — the term Brahmagupta used for negative numbers. The word "rina" is still used in modern Hindi/Sanskrit to mean debt or loan. This monetary framing made negative numbers immediately practical: if you have 3 coins (dhana = +3) and owe 5 coins (rina = −5), your net worth is −2 (you are in debt). Commerce had used debts for millennia; Brahmagupta simply formalised the mathematics.',
      hi: '"ऋण" संस्कृत में "कर्ज" का अर्थ रखता है — वह शब्द जो ब्रह्मगुप्त ने ऋण संख्याओं के लिए प्रयोग किया। "ऋण" आधुनिक हिन्दी/संस्कृत में अभी भी कर्ज का अर्थ रखता है। इस मौद्रिक रूपरेखा ने ऋण संख्याओं को तत्काल व्यावहारिक बना दिया: यदि आपके पास 3 सिक्के (धन = +3) हैं और आप 5 सिक्के देने हैं (ऋण = −5), तो आपकी शुद्ध सम्पत्ति −2 है।',
    },
  },
  {
    id: 'q25_4_04', type: 'mcq',
    question: {
      en: 'What is the result of negative × negative according to Brahmagupta\'s rules?',
      hi: 'ब्रह्मगुप्त के नियमों के अनुसार ऋण × ऋण का परिणाम क्या है?',
    },
    options: [
      { en: 'Negative', hi: 'ऋण' },
      { en: 'Zero', hi: 'शून्य' },
      { en: 'Positive', hi: 'धन' },
      { en: 'Undefined', hi: 'अपरिभाषित' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Brahmagupta correctly stated: rina (negative) × rina (negative) = dhana (positive). His debt-metaphor explanation: if you take away a debt (negate a negative), you gain wealth. Modern algebra confirms: (−a)(−b) = +ab. This rule, which many students find counterintuitive today, was stated clearly by Brahmagupta in 628 CE. European mathematicians debated this rule until the 18th century, with some calling the rule "absurd."',
      hi: 'ब्रह्मगुप्त ने सही कहा: ऋण × ऋण = धन। उनका ऋण-रूपक: यदि आप एक ऋण हटाते हैं (ऋण का निषेध), तो आपको सम्पत्ति मिलती है। आधुनिक बीजगणित पुष्टि करता है: (−a)(−b) = +ab। यह नियम ब्रह्मगुप्त ने 628 ई. में स्पष्ट रूप से बताया था। यूरोपीय गणितज्ञों ने 18वीं शताब्दी तक इस नियम पर बहस की।',
    },
  },
  {
    id: 'q25_4_05', type: 'mcq',
    question: {
      en: 'Who called negative roots of equations "false numbers" (numeri falsi)?',
      hi: 'किसने समीकरणों के ऋण मूलों को "असत्य संख्याएँ" (numeri falsi) कहा?',
    },
    options: [
      { en: 'Isaac Newton', hi: 'आइज़ैक न्यूटन' },
      { en: 'René Descartes', hi: 'रेने देकार्त' },
      { en: 'Blaise Pascal', hi: 'ब्लेज़ पास्कल' },
      { en: 'John Wallis', hi: 'जॉन वालिस' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'René Descartes (1596–1650), in his 1637 work "La Géométrie," called negative roots of polynomial equations "false roots" (fausses racines / numeri falsi). This was over 1000 years after Brahmagupta had fully formalised negative number arithmetic. Even Leibniz (1646–1716) expressed discomfort with negative numbers. The formal acceptance of negative numbers in European mathematics came only in the 18th–19th centuries, with the development of rigorous number theory.',
      hi: 'रेने देकार्त (1596–1650) ने 1637 में "ला ज्योमेट्री" में बहुपद समीकरणों के ऋण मूलों को "असत्य मूल" (fausses racines / numeri falsi) कहा। यह ब्रह्मगुप्त द्वारा ऋण संख्या गणित के पूर्ण औपचारिककरण के 1000+ वर्ष बाद था। यूरोपीय गणित में ऋण संख्याओं की औपचारिक स्वीकृति 18वीं-19वीं शताब्दी में आई।',
    },
  },
  {
    id: 'q25_4_06', type: 'mcq',
    question: {
      en: 'What was the practical origin that made negative numbers intuitive in Indian mathematics?',
      hi: 'वह व्यावहारिक उत्पत्ति क्या थी जिसने भारतीय गणित में ऋण संख्याओं को सहज बनाया?',
    },
    options: [
      { en: 'Measuring negative temperatures', hi: 'ऋण तापमान मापना' },
      { en: 'Accounting and debt in commerce', hi: 'वाणिज्य में लेखांकन और ऋण' },
      { en: 'Representing underground depths', hi: 'भूमिगत गहराई दर्शाना' },
      { en: 'Astronomical retrograde motion', hi: 'खगोलीय वक्री गति' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The practical origin of negative numbers in India was accounting and debt in commerce. Indian merchants had been recording debts (rina = what you owe) and assets (dhana = what you have) for centuries before Brahmagupta. The natural question — "what is your net worth if your debts exceed your assets?" — required negative numbers. Greek mathematics, by contrast, was heavily geometric (numbers as lengths), which made negative lengths physically meaningless and blocked acceptance.',
      hi: 'भारत में ऋण संख्याओं की व्यावहारिक उत्पत्ति वाणिज्य में लेखांकन और ऋण था। ब्रह्मगुप्त से सदियों पहले भारतीय व्यापारी ऋण (ऋण = जो देना है) और परिसम्पत्ति (धन = जो पास है) रिकॉर्ड करते थे। ग्रीक गणित, इसके विपरीत, अत्यधिक ज्यामितीय था (संख्याएँ लम्बाई के रूप में), जिसने ऋण लम्बाइयों को भौतिक रूप से अर्थहीन बना दिया।',
    },
  },
  {
    id: 'q25_4_07', type: 'mcq',
    question: {
      en: 'In what year did Brahmagupta publish his rules for negative numbers?',
      hi: 'ब्रह्मगुप्त ने ऋण संख्याओं के अपने नियम किस वर्ष प्रकाशित किए?',
    },
    options: [
      { en: '476 CE', hi: '476 ई.' },
      { en: '499 CE', hi: '499 ई.' },
      { en: '628 CE', hi: '628 ई.' },
      { en: '850 CE', hi: '850 ई.' },
    ],
    correctAnswer: 2,
    explanation: {
      en: '628 CE — the year Brahmagupta completed the Brahmasphutasiddhanta. This text contains the world\'s first formal rules for negative number arithmetic. The Brahmasphutasiddhanta also contains his zero rules (Module 25-1), Pythagorean triples, and what is now called "Brahmagupta\'s formula" for cyclic quadrilaterals. All in one text, 628 CE — a remarkable achievement in the history of mathematics.',
      hi: '628 ई. — वह वर्ष जब ब्रह्मगुप्त ने ब्रह्मस्फुटसिद्धान्त पूरा किया। इस ग्रन्थ में ऋण संख्या गणित के विश्व के पहले औपचारिक नियम हैं। ब्रह्मस्फुटसिद्धान्त में उनके शून्य नियम (मॉड्यूल 25-1), पाइथागोरस त्रिक, और जिसे अब "ब्रह्मगुप्त का सूत्र" (चक्रीय चतुर्भुज के लिए) कहते हैं, भी हैं।',
    },
  },
  {
    id: 'q25_4_08', type: 'mcq',
    question: {
      en: 'Which Indian mathematician extended Brahmagupta\'s rules for negative numbers in the 9th century?',
      hi: 'किस भारतीय गणितज्ञ ने 9वीं शताब्दी में ब्रह्मगुप्त के ऋण संख्या नियमों का विस्तार किया?',
    },
    options: [
      { en: 'Aryabhata II', hi: 'आर्यभट द्वितीय' },
      { en: 'Mahavira', hi: 'महावीर' },
      { en: 'Bhaskara I', hi: 'भास्कर प्रथम' },
      { en: 'Sridharacharya', hi: 'श्रीधराचार्य' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mahavira (9th century CE), a Jain mathematician, extended and refined Brahmagupta\'s work on negative numbers in his Ganitasarasangraha (~850 CE). He worked extensively with what he called "negative quantities" in the context of algebra and geometric progressions. Mahavira also worked on square roots of negative numbers — anticipating complex numbers — though he ultimately declared that the square root of a negative number "does not exist" (not yet grasping the complex number concept).',
      hi: 'महावीर (9वीं शताब्दी ई.), एक जैन गणितज्ञ, ने अपने गणितसारसंग्रह (~850 ई.) में ब्रह्मगुप्त के ऋण संख्याओं के कार्य का विस्तार और परिशोधन किया। उन्होंने बीजगणित और ज्यामितीय श्रेढ़ी के संदर्भ में "ऋण राशियों" के साथ व्यापक कार्य किया। महावीर ने ऋण संख्याओं के वर्गमूल पर भी काम किया — जटिल संख्याओं की आशा करते हुए।',
    },
  },
  {
    id: 'q25_4_09', type: 'true_false',
    question: {
      en: 'European mathematicians readily accepted negative numbers once they were introduced via Arabic translations of Indian texts.',
      hi: 'भारतीय ग्रन्थों के अरबी अनुवादों के माध्यम से प्रस्तुत होने के बाद यूरोपीय गणितज्ञों ने ऋण संख्याओं को आसानी से स्वीकार कर लिया।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. European resistance to negative numbers was intense and prolonged. Even after Arabic texts introduced them in the 12th century, many European mathematicians rejected them. Francis Maseres (1759) called negative numbers "fictitious." René Descartes (1637) called them "false roots." William Frend (1796) wrote a treatise rejecting negative numbers entirely. The formal acceptance of negative numbers as legitimate mathematical objects only came with the development of rigorous algebra in the 19th century.',
      hi: 'असत्य। ऋण संख्याओं के प्रति यूरोपीय प्रतिरोध तीव्र और लम्बे समय तक रहा। 12वीं शताब्दी में अरबी ग्रन्थों के माध्यम से उन्हें प्रस्तुत किए जाने के बाद भी, कई यूरोपीय गणितज्ञों ने उन्हें अस्वीकार किया। फ्रांसिस मेसरेस (1759) ने उन्हें "काल्पनिक" कहा। देकार्त (1637) ने उन्हें "असत्य मूल" कहा। ऋण संख्याओं की औपचारिक स्वीकृति 19वीं शताब्दी में आई।',
    },
  },
  {
    id: 'q25_4_10', type: 'true_false',
    question: {
      en: 'Mahavira (9th century CE) extended Brahmagupta\'s rules on negative numbers and worked with them in the context of algebra and geometric progressions.',
      hi: 'महावीर (9वीं शताब्दी ई.) ने ब्रह्मगुप्त के ऋण संख्या नियमों का विस्तार किया और बीजगणित तथा ज्यामितीय श्रेढ़ी के संदर्भ में उनके साथ काम किया।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Mahavira\'s Ganitasarasangraha (~850 CE) explicitly extended and refined Brahmagupta\'s work. Mahavira applied negative quantities to problems in series, permutations, combinations, and algebra. He also grappled with square roots of negative numbers — an early encounter with what would later become complex numbers. While he concluded that negative numbers "have no square root" (missing the complex number insight), his systematic treatment of negative arithmetic was a significant advance over Brahmagupta.',
      hi: 'सत्य। महावीर के गणितसारसंग्रह (~850 ई.) ने ब्रह्मगुप्त के कार्य का स्पष्ट रूप से विस्तार और परिशोधन किया। महावीर ने श्रेढ़ी, क्रमचय, संचय और बीजगणित में ऋण राशियों को लागू किया। उन्होंने ऋण संख्याओं के वर्गमूल के साथ भी संघर्ष किया — जो जटिल संख्याओं से एक प्रारम्भिक मुठभेड़ थी।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Brahmagupta's Negative Number Rules                        */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'ब्रह्मगुप्त के ऋण संख्या नियम (628 ई.)' : "Brahmagupta's Negative Number Rules (628 CE)"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>628 ई. में ब्रह्मगुप्त ने जो किया वह क्रान्तिकारी था: उन्होंने एक ऐसी संख्या की कल्पना की जो "कुछ नहीं" से कम है। धन (सम्पत्ति) से ऋण (कर्ज) — यह गणितीय छलाँग थी जो यूरोप को 1000 वर्ष बाद भी डरा रही थी।</>
            : <>What Brahmagupta did in 628 CE was revolutionary: he imagined a number less than "nothing." From dhana (assets) to rina (debt) — this was a mathematical leap that would frighten Europe for another 1000 years.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'धन और ऋण — ब्रह्मगुप्त के 628 ई. के नियम' : 'Dhana and Rina — Brahmagupta\'s Rules (628 CE)'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'जोड़:' : 'Addition:'}</span>{' '}
            {isHi ? 'धन + धन = धन। ऋण + ऋण = ऋण। धन + ऋण = उनके अन्तर की दिशा।' : 'dhana + dhana = dhana. rina + rina = rina. dhana + rina = the sign of the larger magnitude.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'घटाव:' : 'Subtraction:'}</span>{' '}
            {isHi ? 'ऋण में से ऋण घटाना = धन या ऋण (जो बड़ा)। धन में से ऋण घटाना = धन।' : 'rina − rina = dhana or rina (whichever is larger). dhana − rina = dhana.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'गुणा:' : 'Multiplication:'}</span>{' '}
            {isHi ? 'धन × धन = धन। ऋण × ऋण = धन। धन × ऋण = ऋण।' : 'dhana × dhana = dhana. rina × rina = dhana. dhana × rina = rina.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'शून्य के साथ:' : 'With zero:'}</span>{' '}
            {isHi ? 'शून्य + ऋण = ऋण। शून्य − ऋण = धन। शून्य × ऋण = शून्य।' : 'zero + rina = rina. zero − rina = dhana. zero × rina = zero.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'व्यापार से गणित तक — ऋण का जन्म' : 'From Commerce to Mathematics — Birth of Debt'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>भारतीय व्यापारी हजारों वर्षों से खाता-बहियों में धन (सम्पत्ति) और ऋण (कर्ज) अलग-अलग दर्ज करते थे। दो रंगों की स्याही — काली धन के लिए, लाल ऋण के लिए — का उपयोग होता था। "लाल में होना" (in the red) आज भी अंग्रेजी में घाटे का प्रतीक है।</>
            : <>Indian merchants had recorded dhana (assets) and rina (debts) in account books for millennia. Two colours of ink — black for assets, red for debts — were used. "Being in the red" remains an English idiom for being in deficit, a direct inheritance of this accounting tradition.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>ब्रह्मगुप्त ने इस व्यावहारिक लेखांकन को गणितीय भाषा दी। "मेरी शुद्ध सम्पत्ति क्या है यदि मेरे पास 5 स्वर्ण हैं लेकिन मैं 8 स्वर्ण का ऋणी हूँ?" → 5 + (−8) = −3। सरल, व्यावहारिक, क्रान्तिकारी।</>
            : <>Brahmagupta gave this practical accounting a mathematical language. "What is my net worth if I have 5 gold but owe 8 gold?" → 5 + (−8) = −3. Simple, practical, revolutionary.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Europe's 1000-Year Delay                                   */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'यूरोप की 1000 वर्ष की देरी' : "Europe's 1000-Year Delay"}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>भारत में 628 ई. में जो स्वीकृत था, यूरोप में उसे 18वीं-19वीं शताब्दी तक "असत्य" और "बेतुका" कहा जाता रहा। यह देरी क्यों? ग्रीक गणित का ज्यामितीय विश्व-दृष्टिकोण।</>
            : <>What was accepted in India in 628 CE was called "false" and "absurd" in Europe until the 18th–19th centuries. Why the delay? The geometric worldview of Greek mathematics.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'यूरोपीय विरोध की समयरेखा' : 'Timeline of European Resistance'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">~250 BCE — Diophantus:</span>{' '}
            {isHi ? 'ऋण समाधानों को "बेतुका" (absurd) कहकर अस्वीकार किया।' : 'Rejected negative solutions to equations as "absurd."'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1202 CE — Fibonacci:</span>{' '}
            {isHi ? 'लिबर अबाची में ऋण संख्याओं का सीमित उपयोग (ऋण के रूप में) — लेकिन पूरी तरह स्वीकृति नहीं।' : 'Limited use of negative numbers in Liber Abaci (as debts) — but no full acceptance.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1637 — Descartes:</span>{' '}
            {isHi ? '"असत्य मूल" (fausses racines) — ऋण बीजगणितीय मूलों को अस्वीकृत।' : '"False roots" (fausses racines) — rejected negative algebraic roots.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1759 — Maseres:</span>{' '}
            {isHi ? '"काल्पनिक" — ऋण संख्याएँ वास्तविक नहीं।' : '"Fictitious" — negative numbers not real.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">1796 — Frend:</span>{' '}
            {isHi ? 'ऋण संख्याओं को पूरी तरह अस्वीकार करने वाला ग्रन्थ लिखा।' : 'Wrote a treatise rejecting negative numbers entirely.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-medium">~1850 CE:</span>{' '}
            {isHi ? 'कठोर संख्या सिद्धान्त के साथ अन्ततः यूरोपीय स्वीकृति।' : 'Final European acceptance with rigorous number theory.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'यूरोप ने विरोध क्यों किया?' : 'Why Did Europe Resist?'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">ज्यामितीय बाधा:</span> ग्रीक गणित में संख्याएँ = लम्बाइयाँ। एक ऋण लम्बाई भौतिक रूप से असम्भव है। "−3 मीटर" की एक छड़ी नहीं बना सकते।</>
            : <><span className="text-gold-light font-medium">Geometric barrier:</span> In Greek mathematics, numbers = lengths. A negative length is physically impossible. You can't make a stick of "−3 metres."</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भारतीय समाधान:</span> संख्याएँ = राशियाँ (quantities), न कि लम्बाइयाँ। कर्ज एक वास्तविक राशि है, भले ही इसे आप शारीरिक रूप से नहीं पकड़ सकते। यह अमूर्त सोच की जीत थी।</>
            : <><span className="text-gold-light font-medium">Indian solution:</span> Numbers = quantities, not lengths. A debt is a real quantity, even if you can't physically hold it. This was a triumph of abstract thinking over physical intuition.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Legacy in Algebra and Modern Mathematics                   */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'बीजगणित और आधुनिक गणित में विरासत' : 'Legacy in Algebra and Modern Mathematics'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>ब्रह्मगुप्त के ऋण संख्या नियम आज के बीजगणित की रीढ़ हैं। उनके बिना, समीकरण हल करना, कलन, और आधुनिक भौतिकी असम्भव होती।</>
            : <>Brahmagupta's negative number rules are the backbone of modern algebra. Without them, equation solving, calculus, and modern physics would be impossible.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'आधुनिक अनुप्रयोग' : 'Modern Applications'}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'बैंकिंग और वित्त:' : 'Banking and finance:'}</span>{' '}
            {isHi ? 'बैलेंस शीट, ऋण, ब्याज — सब ऋण संख्याओं पर। ब्रह्मगुप्त का "धन-ऋण" आज की पूरी वित्तीय प्रणाली में है।' : 'Balance sheets, loans, interest — all on negative numbers. Brahmagupta\'s "dhana-rina" is in today\'s entire financial system.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'भौतिकी:' : 'Physics:'}</span>{' '}
            {isHi ? 'विद्युत आवेश (+/−), ऊर्जा स्तर, तापमान (°C नीचे शून्य) — सब ऋण संख्याओं के बिना असम्भव।' : 'Electric charge (+/−), energy levels, temperature (°C below zero) — all impossible without negative numbers.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'कम्प्यूटर विज्ञान:' : 'Computer science:'}</span>{' '}
            {isHi ? 'Two\'s complement — कम्प्यूटर में ऋण संख्याओं का बाइनरी प्रतिनिधित्व। हर CPU में।' : 'Two\'s complement — binary representation of negative numbers in computers. In every CPU.'}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{isHi ? 'जटिल संख्याएँ:' : 'Complex numbers:'}</span>{' '}
            {isHi ? '√(−1) = i — जटिल संख्याओं का आधार। क्वांटम यान्त्रिकी और विद्युत इंजीनियरिंग की नींव।' : '√(−1) = i — the basis of complex numbers. The foundation of quantum mechanics and electrical engineering.'}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'महावीर और भास्कर का योगदान' : "Mahavira's and Bhaskara's Contributions"}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>9वीं शताब्दी में महावीर ने ब्रह्मगुप्त के नियमों का विस्तार किया — श्रेढ़ी, क्रमचय और संचय में ऋण राशियाँ। उन्होंने ऋण संख्याओं के वर्गमूल के साथ भी संघर्ष किया — जटिल संख्याओं की ओर पहला कदम।</>
            : <>In the 9th century, Mahavira extended Brahmagupta's rules — applying negative quantities to series, permutations, and combinations. He also wrestled with square roots of negative numbers — a first step toward complex numbers.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>12वीं शताब्दी में भास्कर द्वितीय ने और आगे बढ़ाया — बीजगणित में ऋण मूलों को पूरी तरह स्वीकार करते हुए। उनकी "बीजगणित" (Bijaganita) आधुनिक बीजगणित की प्रत्यक्ष पूर्वज है।</>
            : <>In the 12th century, Bhaskara II advanced further — fully accepting negative roots in algebra. His "Bijaganita" is a direct ancestor of modern algebra.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module25_4Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

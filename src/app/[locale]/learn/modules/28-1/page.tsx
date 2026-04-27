'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/28-1.json';

const META: ModuleMeta = {
  id: 'mod_28_1', phase: 8, topic: 'Prashna', moduleNumber: '28.1',
  title: L.title as Record<string, string>,
  subtitle: L.subtitle as Record<string, string>,
  estimatedMinutes: 12,
  crossRefs: [
    { label: L.crossRefs[0].label as Record<string, string>, href: '/learn/modules/23-5' },
    { label: L.crossRefs[1].label as Record<string, string>, href: '/learn/modules/28-2' },
    { label: L.crossRefs[2].label as Record<string, string>, href: '/prashna' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q28_1_01', type: 'mcq',
    question: L.questions[0].question as Record<string, string>,
    options: L.questions[0].options as LocaleText[],
    correctAnswer: 2,
    explanation: L.questions[0].explanation as Record<string, string>,
  },
  {
    id: 'q28_1_02', type: 'mcq',
    question: L.questions[1].question as Record<string, string>,
    options: L.questions[1].options as LocaleText[],
    correctAnswer: 0,
    explanation: L.questions[1].explanation as Record<string, string>,
  },
  {
    id: 'q28_1_03', type: 'mcq',
    question: L.questions[2].question as Record<string, string>,
    options: L.questions[2].options as LocaleText[],
    correctAnswer: 1,
    explanation: L.questions[2].explanation as Record<string, string>,
  },
  {
    id: 'q28_1_04', type: 'true_false',
    question: L.questions[3].question as Record<string, string>,
    correctAnswer: 0,
    explanation: L.questions[3].explanation as Record<string, string>,
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — What Is Prashna Jyotish?                                  */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'What Is Prashna Jyotish?', hi: 'प्रश्न ज्योतिष क्या है?', sa: 'प्रश्न ज्योतिष क्या है?' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रश्न ज्योतिष (होरारी ज्योतिष) वैदिक ज्योतिष की वह शाखा है जिसमें जन्म कुण्डली के बजाय प्रश्न पूछने के सटीक क्षण की कुण्डली बनाई जाती है। जब जन्म समय अज्ञात हो, जब एक विशिष्ट प्रश्न का तत्काल उत्तर चाहिए, या जब कोई स्थिति इतनी तीव्र हो कि जन्म कुण्डली का विस्तृत विश्लेषण व्यावहारिक न हो — तब प्रश्न ज्योतिष का उपयोग होता है।</>
            : <>Prashna Jyotish (horary astrology) is the branch of Vedic astrology where a chart is cast for the exact moment a question is sincerely asked, rather than for the time of birth. It is used when birth time is unknown, when a specific question demands an immediate answer, or when a situation is so acute that a detailed natal analysis is impractical. The core principle: the cosmos at the moment of a genuine question contains the answer within it.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>प्रश्न ज्योतिष का मूल सिद्धान्त यह है कि ब्रह्माण्ड एक एकीकृत क्षेत्र है — जब कोई व्यक्ति गहन चिन्ता या आवश्यकता से प्रेरित होकर प्रश्न पूछता है, तो उस क्षण की ग्रहीय स्थिति प्रश्न के उत्तर को प्रतिबिम्बित करती है। यह "यथा पिण्डे तथा ब्रह्माण्डे" — जो सूक्ष्म जगत में है वही स्थूल जगत में है — इस वैदिक सिद्धान्त पर आधारित है।</>
            : <>The foundational principle is that the universe is a unified field — when a person asks a question driven by genuine concern or need, the planetary positions at that moment mirror the answer. This rests on the Vedic principle "yatha pinde tatha brahmande" — as in the microcosm, so in the macrocosm. The question&apos;s &quot;birth&quot; is as significant as a person&apos;s birth.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'When to Use Prashna', hi: 'प्रश्न कब उपयोग करें', sa: 'प्रश्न कब उपयोग करें' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Unknown birth time:', hi: 'अज्ञात जन्म समय:', sa: 'अज्ञात जन्म समय:' }, locale)}</span>{' '}
            {tl({ en: 'When the querent has no reliable birth data, Prashna becomes the only viable tool.', hi: 'जब प्रश्नकर्ता के पास विश्वसनीय जन्म डेटा न हो, तो प्रश्न एकमात्र व्यवहार्य उपकरण बन जाता है।', sa: 'जब प्रश्नकर्ता के पास विश्वसनीय जन्म डेटा न हो, तो प्रश्न एकमात्र व्यवहार्य उपकरण बन जाता है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Specific questions:', hi: 'विशिष्ट प्रश्न:', sa: 'विशिष्ट प्रश्न:' }, locale)}</span>{' '}
            {tl({ en: '"Will I get this job?", "Is the lost object recoverable?", "Will this journey be safe?" — these need pointed answers, not life overviews.', hi: '"क्या मुझे यह नौकरी मिलेगी?", "क्या खोई वस्तु मिलेगी?", "क्या यह यात्रा सुरक्षित होगी?" — इन्हें सटीक उत्तर चाहिए, जीवन का विहंगावलोकन नहीं।', sa: '"क्या मुझे यह नौकरी मिलेगी?", "क्या खोई वस्तु मिलेगी?", "क्या यह यात्रा सुरक्षित होगी?" — इन्हें सटीक उत्तर चाहिए, जीवन का विहंगावलोकन नहीं।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Temple divination:', hi: 'मन्दिर भविष्यवाणी:', sa: 'मन्दिर भविष्यवाणी:' }, locale)}</span>{' '}
            {tl({ en: 'In South Indian traditions, Deva Prashna is used to divine the deity\'s wishes for temple renovations, rituals, and resolving temple-related issues.', hi: 'दक्षिण भारतीय परम्पराओं में, देव प्रश्न का उपयोग मन्दिर जीर्णोद्धार, अनुष्ठानों और मन्दिर-सम्बन्धित समस्याओं के समाधान के लिए देवता की इच्छा जानने हेतु किया जाता है।', sa: 'दक्षिण भारतीय परम्पराओं में, देव प्रश्न का उपयोग मन्दिर जीर्णोद्धार, अनुष्ठानों और मन्दिर-सम्बन्धित समस्याओं के समाधान के लिए देवता की इच्छा जानने हेतु किया जाता है।' }, locale)}
          </p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Reading the Prashna Chart                                  */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Reading the Prashna Chart', hi: 'प्रश्न कुण्डली पढ़ना', sa: 'प्रश्न कुण्डली पढ़ना' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रश्न कुण्डली में लग्न प्रश्नकर्ता का प्रतिनिधित्व करता है, और प्रश्न से सम्बन्धित भाव को "प्रश्न भाव" कहते हैं। उदाहरणार्थ — विवाह का प्रश्न = 7वाँ भाव, नौकरी = 10वाँ भाव, सन्तान = 5वाँ भाव, ज्ञान = 4वाँ भाव। लग्नेश और प्रश्न भावेश के बीच का सम्बन्ध (दृष्टि, युति, केन्द्र-त्रिकोण सम्बन्ध) अनुकूल उत्तर का संकेत देता है।</>
            : <>In a Prashna chart, the Lagna represents the querent, and the house relevant to the question is called the &quot;Prashna Bhava.&quot; For example — marriage question = 7th house, job = 10th house, children = 5th house, knowledge/education = 4th house. The relationship between the Lagna lord and the Prashna Bhava lord (aspect, conjunction, kendra-trikona relationship) indicates a favorable answer.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Key Factors in Prashna Analysis', hi: 'प्रश्न विश्लेषण के प्रमुख कारक', sa: 'प्रश्न विश्लेषण के प्रमुख कारक' }, locale)}
        </h4>
        <div className="space-y-2">
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Lagna Lord:', hi: 'लग्नेश:', sa: 'लग्नेश:' }, locale)}</span>{' '}
            {tl({ en: 'Strength, placement, and aspects of the Lagna lord indicate the querent\'s power to achieve the desired outcome.', hi: 'लग्नेश का बल, स्थान और दृष्टि प्रश्नकर्ता की वांछित परिणाम प्राप्त करने की शक्ति को इंगित करती है।', sa: 'लग्नेश का बल, स्थान और दृष्टि प्रश्नकर्ता की वांछित परिणाम प्राप्त करने की शक्ति को इंगित करती है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Moon:', hi: 'चन्द्रमा:', sa: 'चन्द्रमा:' }, locale)}</span>{' '}
            {tl({ en: 'The Moon is the co-significator of the querent. Its condition reveals the emotional state and sincerity of the query. A void-of-course Moon (making no further aspects before leaving its sign) often means "nothing will come of this matter."', hi: 'चन्द्रमा प्रश्नकर्ता का सह-कारक है। इसकी स्थिति भावनात्मक दशा और प्रश्न की ईमानदारी प्रकट करती है।', sa: 'चन्द्रमा प्रश्नकर्ता का सह-कारक है। इसकी स्थिति भावनात्मक दशा और प्रश्न की ईमानदारी प्रकट करती है।' }, locale)}
          </p>
          <p className="text-text-secondary text-xs leading-relaxed">
            <span className="text-gold-light font-semibold">{tl({ en: 'Aaroodha:', hi: 'आरूढ:', sa: 'आरूढ:' }, locale)}</span>{' '}
            {tl({ en: 'The number secretly thought of by the querent, divided by 12, gives the Aaroodha sign — providing an additional layer of validation.', hi: 'प्रश्नकर्ता द्वारा मन में सोची गई संख्या को 12 से भाग देने पर आरूढ राशि मिलती है — जो अतिरिक्त सत्यापन प्रदान करती है।', sa: 'प्रश्नकर्ता द्वारा मन में सोची गई संख्या को 12 से भाग देने पर आरूढ राशि मिलती है — जो अतिरिक्त सत्यापन प्रदान करती है।' }, locale)}
          </p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Validity Conditions', hi: 'वैधता शर्तें', sa: 'वैधता शर्तें' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>प्रश्न की वैधता के लिए कई शर्तें हैं: प्रश्न वास्तविक चिन्ता से उत्पन्न होना चाहिए (परीक्षण प्रश्न अमान्य); एक ही विषय पर बार-बार प्रश्न नहीं पूछना चाहिए; और ज्योतिषी को सन्ध्या काल, ग्रहण, या अन्य अशुभ समय में प्रश्न स्वीकार नहीं करना चाहिए। यदि लग्न के प्रथम या अन्तिम 3 अंश उदित हों (मृत्यु भाग), तो प्रश्न अमान्य माना जाता है।</>
            : <>Several conditions must be met for a valid Prashna: the question must arise from genuine concern (test questions are invalid); the same question should not be asked repeatedly; and the astrologer should not accept questions during Sandhya Kala, eclipses, or other inauspicious times. If the first or last 3 degrees of a sign are rising (Mrityu Bhaga), the question is considered void.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Classical Texts & Practice                                 */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Classical Sources & Modern Practice', hi: 'शास्त्रीय स्रोत और आधुनिक अभ्यास', sa: 'शास्त्रीय स्रोत और आधुनिक अभ्यास' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रश्न ज्योतिष के प्रमुख शास्त्रीय ग्रन्थ हैं: प्रश्न मार्ग (केरल परम्परा, 16वीं शताब्दी), ताजिक नीलकंठी (ताजिक/फारसी प्रभाव), और BPHS के कुछ अध्याय। प्रश्न मार्ग सबसे व्यापक है — इसमें दैनिक जीवन से लेकर मन्दिर प्रश्नों तक सब कुछ कवर है। ताजिक पद्धति वार्षिक फल और प्रश्न दोनों के लिए प्रयुक्त होती है।</>
            : <>The primary classical texts for Prashna are: Prashna Marga (Kerala tradition, 16th century), Tajika Nilakanthi (Tajika/Persian influence), and certain chapters of BPHS. Prashna Marga is the most comprehensive — it covers everything from daily life questions to temple divination (Deva Prashna). The Tajika system is used for both annual predictions and horary questions.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Prashna vs Natal Astrology', hi: 'प्रश्न बनाम जन्म ज्योतिष', sa: 'प्रश्न बनाम जन्म ज्योतिष' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>जन्म ज्योतिष जीवन का सम्पूर्ण मानचित्र देता है — कर्म, प्रवृत्तियाँ, दशा कालखण्ड, और जीवन के बड़े अध्याय। प्रश्न ज्योतिष एक विशिष्ट क्षण का स्नैपशॉट है — "अभी इस प्रश्न का उत्तर क्या है?" यह अल्पकालिक, सटीक, और कार्यमूलक है। दोनों एक-दूसरे के पूरक हैं, विकल्प नहीं। एक अच्छा ज्योतिषी दोनों का उपयोग करता है।</>
            : <>Natal astrology gives a complete life map — karma, tendencies, dasha periods, and major life chapters. Prashna is a snapshot of a specific moment — &quot;what is the answer to this question right now?&quot; It is short-term, precise, and action-oriented. The two complement each other, they are not alternatives. A good astrologer uses both: the natal chart for context and the Prashna chart for the specific question at hand.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-blue-500/15 rounded-xl p-5">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Try It: Prashna Tool', hi: 'इसे आज़माएँ: प्रश्न उपकरण', sa: 'इसे आज़माएँ: प्रश्न उपकरण' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Our Prashna tool lets you cast a horary chart for the current moment. Enter your question, and the tool generates a chart with Lagna, Moon position, and key planetary aspects — giving you the framework for Prashna analysis. For Ashtamangala Prashna (the Kerala tradition using 8 auspicious objects), see Module 28-2.', hi: 'हमारा प्रश्न उपकरण आपको वर्तमान क्षण के लिए होरारी कुण्डली बनाने देता है। अपना प्रश्न दर्ज करें, और उपकरण लग्न, चन्द्र स्थिति और प्रमुख ग्रहीय दृष्टियों के साथ कुण्डली उत्पन्न करता है। अष्टमंगल प्रश्न (8 शुभ वस्तुओं का उपयोग करने वाली केरल परम्परा) के लिए, मॉड्यूल 28-2 देखें।', sa: 'हमारा प्रश्न उपकरण आपको वर्तमान क्षण के लिए होरारी कुण्डली बनाने देता है।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module28_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

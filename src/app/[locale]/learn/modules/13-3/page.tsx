'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_13_3', phase: 3, topic: 'Yogas', moduleNumber: '13.3',
  title: { en: 'Dosha Detection & Cancellation', hi: 'दोष पहचान एवं निवारण' },
  subtitle: {
    en: 'Mangal Dosha, Kala Sarpa Dosha, Pitra Dosha — detection criteria, severity scoring, cancellation rules, and remedial measures',
    hi: 'मंगल दोष, काल सर्प दोष, पितृ दोष — पहचान मानदण्ड, तीव्रता अंकन, निवारण नियम और उपचारात्मक उपाय',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 13-1: Yogas Overview', hi: 'मॉड्यूल 13-1: योग अवलोकन' }, href: '/learn/modules/13-1' },
    { label: { en: 'Module 13-2: Dhana & Arishta Yogas', hi: 'मॉड्यूल 13-2: धन और अरिष्ट योग' }, href: '/learn/modules/13-2' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q13_3_01', type: 'mcq',
    question: {
      en: 'Mangal Dosha is formed when Mars is placed in which houses from Lagna, Moon, or Venus?',
      hi: 'मंगल दोष तब बनता है जब मंगल लग्न, चन्द्र या शुक्र से किन भावों में स्थित हो?',
    },
    options: [
      { en: '3, 6, 10, 11', hi: '3, 6, 10, 11' },
      { en: '1, 2, 4, 7, 8, 12', hi: '1, 2, 4, 7, 8, 12' },
      { en: '5, 9 only', hi: 'केवल 5, 9' },
      { en: '2, 7 only', hi: 'केवल 2, 7' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mangal Dosha forms when Mars occupies the 1st (self/temperament), 2nd (family/speech), 4th (domestic peace), 7th (spouse), 8th (longevity/intimacy), or 12th (bed pleasures/losses) house from Lagna, Moon, or Venus. These houses directly affect marital harmony.',
      hi: 'मंगल दोष तब बनता है जब मंगल लग्न, चन्द्र या शुक्र से 1ले (स्वयं/स्वभाव), 2रे (परिवार/वाणी), 4थे (गृह शान्ति), 7वें (जीवनसाथी), 8वें (आयु/अन्तरंगता) या 12वें (शय्या सुख/हानि) भाव में हो। ये भाव वैवाहिक सामंजस्य को सीधे प्रभावित करते हैं।',
    },
  },
  {
    id: 'q13_3_02', type: 'true_false',
    question: {
      en: 'If both partners have Mangal Dosha, the dosha is considered cancelled for marriage compatibility.',
      hi: 'यदि दोनों साथियों में मंगल दोष हो, तो विवाह अनुकूलता के लिए दोष निरस्त माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. When both partners have Mangal Dosha, their Mars energies are considered balanced — the aggressive/fiery nature matches, reducing the risk of one partner dominating or harming the other. This is one of the most common cancellation conditions.',
      hi: 'सत्य। जब दोनों साथियों में मंगल दोष हो, तो उनकी मंगल ऊर्जा सन्तुलित मानी जाती है — आक्रामक/अग्नि स्वभाव मेल खाता है, एक साथी के दूसरे पर प्रभुत्व या हानि का जोखिम कम होता है। यह सबसे सामान्य निवारण शर्तों में से एक है।',
    },
  },
  {
    id: 'q13_3_03', type: 'mcq',
    question: {
      en: 'How many standard cancellation conditions exist for Mangal Dosha?',
      hi: 'मंगल दोष के कितने मानक निवारण नियम हैं?',
    },
    options: [
      { en: '2', hi: '2' },
      { en: '6', hi: '6' },
      { en: '12', hi: '12' },
      { en: 'None — it can never be cancelled', hi: 'कोई नहीं — इसे कभी निरस्त नहीं किया जा सकता' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'There are 6 major cancellation conditions for Mangal Dosha: (1) Jupiter\'s aspect on Mars, (2) Mars in own/exalted sign, (3) Same dosha in partner\'s chart, (4) Mars in specific signs (Aries, Scorpio, Capricorn), (5) Benefic conjunction with Mars, (6) Mars past 28° in the sign.',
      hi: 'मंगल दोष के 6 प्रमुख निवारण नियम हैं: (1) मंगल पर गुरु की दृष्टि, (2) मंगल स्वराशि/उच्च में, (3) साथी की कुण्डली में समान दोष, (4) मंगल विशिष्ट राशियों (मेष, वृश्चिक, मकर) में, (5) मंगल के साथ शुभ ग्रह का संयोग, (6) राशि में 28° से आगे मंगल।',
    },
  },
  {
    id: 'q13_3_04', type: 'mcq',
    question: {
      en: 'Kala Sarpa Dosha is formed when:',
      hi: 'काल सर्प दोष तब बनता है जब:',
    },
    options: [
      { en: 'Saturn aspects Mars', hi: 'शनि मंगल को दृष्टि करे' },
      { en: 'All 7 planets are hemmed between the Rahu-Ketu axis', hi: 'सभी 7 ग्रह राहु-केतु अक्ष के बीच घिरे हों' },
      { en: 'Jupiter is debilitated', hi: 'गुरु नीच हो' },
      { en: 'Moon is in the 8th house', hi: 'चन्द्रमा 8वें भाव में हो' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Kala Sarpa Dosha forms when all 7 visible planets (Sun through Saturn) are contained on one side of the Rahu-Ketu axis. This creates an imbalance — half the chart is empty while the other half is crowded, concentrating all planetary energy within a hemmed arc.',
      hi: 'काल सर्प दोष तब बनता है जब सभी 7 दृश्य ग्रह (सूर्य से शनि) राहु-केतु अक्ष के एक ओर स्थित हों। इससे असन्तुलन बनता है — आधी कुण्डली खाली जबकि आधी भरी, सारी ग्रह ऊर्जा एक घेरे में केन्द्रित।',
    },
  },
  {
    id: 'q13_3_05', type: 'true_false',
    question: {
      en: 'A planet conjunct Rahu or Ketu breaks the Kala Sarpa Dosha into a partial form.',
      hi: 'राहु या केतु के साथ संयुक्त ग्रह काल सर्प दोष को आंशिक रूप में तोड़ता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. If any planet is conjunct (within a few degrees of) Rahu or Ketu, it is considered to be on the boundary of the axis rather than fully hemmed. This converts complete Kala Sarpa into partial Kala Sarpa, which has significantly reduced effects.',
      hi: 'सत्य। यदि कोई ग्रह राहु या केतु के साथ संयुक्त (कुछ अंशों के भीतर) हो, तो उसे पूर्णतः घिरा नहीं बल्कि अक्ष की सीमा पर माना जाता है। यह पूर्ण काल सर्प को आंशिक काल सर्प में बदल देता है, जिसके प्रभाव काफी कम होते हैं।',
    },
  },
  {
    id: 'q13_3_06', type: 'mcq',
    question: {
      en: 'Pitra Dosha is primarily related to:',
      hi: 'पितृ दोष मुख्यतः किससे सम्बन्धित है?',
    },
    options: [
      { en: 'Marital discord', hi: 'वैवाहिक कलह' },
      { en: 'Ancestral karmic debts and unfulfilled obligations to forefathers', hi: 'पैतृक कार्मिक ऋण और पूर्वजों के प्रति अपूर्ण दायित्व' },
      { en: 'Career obstacles only', hi: 'केवल करियर बाधा' },
      { en: 'Educational failure', hi: 'शैक्षिक असफलता' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Pitra Dosha relates to unresolved karmic obligations to ancestors (pitrs). It is typically indicated by Sun-Rahu conjunction, Sun-Saturn conjunction, or affliction to the 9th house (father, ancestors). It manifests as recurring obstacles in progeny, career blocks, or persistent bad luck across generations.',
      hi: 'पितृ दोष पूर्वजों (पितरों) के प्रति अनसुलझे कार्मिक दायित्वों से सम्बन्धित है। यह प्रायः सूर्य-राहु संयोग, सूर्य-शनि संयोग, या 9वें भाव (पिता, पूर्वज) की पीड़ा से सूचित होता है। यह सन्तान में आवर्ती बाधाओं, करियर अवरोधों या पीढ़ियों में लगातार दुर्भाग्य के रूप में प्रकट होता है।',
    },
  },
  {
    id: 'q13_3_07', type: 'mcq',
    question: {
      en: 'Guru Chandal Dosha is formed by:',
      hi: 'गुरु चाण्डाल दोष किससे बनता है?',
    },
    options: [
      { en: 'Jupiter conjunct Rahu', hi: 'गुरु और राहु का संयोग' },
      { en: 'Jupiter conjunct Saturn', hi: 'गुरु और शनि का संयोग' },
      { en: 'Jupiter in the 12th house', hi: 'गुरु 12वें भाव में' },
      { en: 'Jupiter debilitated in Capricorn', hi: 'गुरु मकर में नीच' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Guru Chandal Dosha forms when Jupiter (wisdom, dharma, guru) is conjunct Rahu (illusion, obsession, rule-breaking). This combination corrupts Jupiter\'s natural wisdom — the native may have unorthodox beliefs, guru-related issues, or difficulty distinguishing right from wrong.',
      hi: 'गुरु चाण्डाल दोष तब बनता है जब गुरु (ज्ञान, धर्म, गुरु) और राहु (भ्रम, आसक्ति, नियम-भंग) संयुक्त हों। यह संयोग गुरु के स्वाभाविक ज्ञान को दूषित करता है — जातक में अपरम्परागत मान्यताएँ, गुरु-सम्बन्धित समस्याएँ, या सही-गलत में भेद करने में कठिनाई हो सकती है।',
    },
  },
  {
    id: 'q13_3_08', type: 'mcq',
    question: {
      en: 'Shrapit Dosha is indicated by:',
      hi: 'शापित दोष किससे सूचित होता है?',
    },
    options: [
      { en: 'Moon with Ketu', hi: 'चन्द्रमा और केतु' },
      { en: 'Saturn conjunct Rahu', hi: 'शनि और राहु का संयोग' },
      { en: 'Mars in the 7th', hi: 'मंगल 7वें में' },
      { en: 'Venus combust', hi: 'शुक्र अस्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Shrapit Dosha (literally "cursed" combination) forms when Saturn and Rahu are conjunct. Saturn (karma, restriction) combined with Rahu (obsession, past-life desires) creates intense karmic pressure — the native faces inexplicable obstacles, delays, and a sense of being "blocked" in the house where this conjunction occurs.',
      hi: 'शापित दोष (शाब्दिक "शापित" संयोग) शनि और राहु के संयोग से बनता है। शनि (कर्म, प्रतिबन्ध) और राहु (आसक्ति, पूर्वजन्म इच्छाएँ) मिलकर तीव्र कार्मिक दबाव बनाते हैं — जातक को अकथनीय बाधाएँ, विलम्ब और जिस भाव में यह संयोग हो वहाँ "अवरुद्ध" होने का अनुभव होता है।',
    },
  },
  {
    id: 'q13_3_09', type: 'true_false',
    question: {
      en: 'An exalted planet in the chart can help cancel or mitigate Kala Sarpa Dosha.',
      hi: 'कुण्डली में उच्च ग्रह काल सर्प दोष को निरस्त या शमित करने में सहायक हो सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. An exalted planet within the hemmed arc provides exceptional strength that can overcome the restrictive effects of Kala Sarpa Dosha. The exalted planet acts as a powerful counterforce — its significations tend to flourish despite the dosha.',
      hi: 'सत्य। घिरे चाप के भीतर उच्च ग्रह असाधारण बल प्रदान करता है जो काल सर्प दोष के प्रतिबन्धक प्रभावों पर विजय पा सकता है। उच्च ग्रह शक्तिशाली प्रतिबल का कार्य करता है — दोष के बावजूद इसके कारकत्व फलते-फूलते हैं।',
    },
  },
  {
    id: 'q13_3_10', type: 'mcq',
    question: {
      en: 'The fundamental principle behind doshas in Vedic astrology is that they represent:',
      hi: 'वैदिक ज्योतिष में दोषों के पीछे मूलभूत सिद्धान्त यह है कि वे प्रतिनिधित्व करते हैं:',
    },
    options: [
      { en: 'Permanent curses that cannot be changed', hi: 'स्थायी शाप जो बदले नहीं जा सकते' },
      { en: 'Karmic patterns that can be understood, mitigated, and worked through', hi: 'कार्मिक प्रतिमान जिन्हें समझा, शमित और साधा जा सकता है' },
      { en: 'Random misfortune', hi: 'यादृच्छिक दुर्भाग्य' },
      { en: 'Punishments from deities', hi: 'देवताओं से दण्ड' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Doshas represent karmic patterns — tendencies inherited from past actions that create specific challenges. They are not curses or punishments. Understanding the dosha reveals the lesson; remedial measures (gemstones, mantras, charity, spiritual practice) help work through the karma consciously.',
      hi: 'दोष कार्मिक प्रतिमान हैं — पिछले कर्मों से विरासत में मिली प्रवृत्तियाँ जो विशिष्ट चुनौतियाँ बनाती हैं। ये शाप या दण्ड नहीं हैं। दोष समझना पाठ प्रकट करता है; उपचारात्मक उपाय (रत्न, मन्त्र, दान, आध्यात्मिक साधना) कर्म को सचेत रूप से साधने में सहायता करते हैं।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Mangal Dosha                                              */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'मंगल दोष' : 'Mangal Dosha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मंगल दोष (कुज दोष या माँगलिक भी कहा जाता है) भारतीय विवाह ज्योतिष में सर्वाधिक चर्चित दोष है। यह तब बनता है जब मंगल लग्न, चन्द्र राशि या शुक्र से 1ले, 2रे, 4थे, 7वें, 8वें या 12वें भाव में हो। ये छह भाव विवाह और गृहस्थ जीवन से सीधे सम्बन्धित हैं — स्वयं (1ला), परिवार (2रा), गृह शान्ति (4था), जीवनसाथी (7वाँ), वैवाहिक आयु (8वाँ) और शय्या सुख (12वाँ)। इन संवेदनशील भावों में मंगल की अग्नि, आक्रामक ऊर्जा विवाह में संघर्ष, प्रभुत्व समस्याएँ या शारीरिक खतरे बना सकती है।</> : <>Mangal Dosha (also called Kuja Dosha or Manglik) is the most commonly discussed dosha in Indian marriage astrology. It forms when Mars (Mangal) is placed in the 1st, 2nd, 4th, 7th, 8th, or 12th house from the Lagna, Moon sign, or Venus. These six houses directly relate to marriage and domestic life — self (1st), family (2nd), domestic peace (4th), spouse (7th), marital longevity (8th), and bed pleasures (12th). Mars&apos;s fiery, aggressive energy in these sensitive houses can create conflict, dominance issues, or physical dangers in marriage.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? '6 निवारण शर्तें' : '6 Cancellation Conditions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1. Jupiter&apos;s aspect on Mars:</span> Jupiter&apos;s benevolent gaze on Mars tames its aggression. The native channels Mars energy constructively — passion becomes purposeful drive rather than destructive force.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2. Mars in own or exalted sign:</span> Mars in Aries, Scorpio (own) or Capricorn (exalted) is dignified and well-behaved. A strong Mars does not create domestic chaos — it provides protection and courage instead.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">3. Same dosha in partner&apos;s chart:</span> Two Manglik individuals balance each other. The fiery energies match rather than clash — this is the most commonly applied cancellation rule.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4. Mars in specific signs (Aries, Scorpio, Capricorn):</span> Mars in these signs is comfortable and does not produce the negative effects typically associated with Mangal Dosha.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">5. Benefic conjunction:</span> A benefic planet (Jupiter, Venus, well-placed Mercury) conjunct Mars softens its energy and redirects it positively.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">6. Mars beyond 28° in the sign:</span> When Mars is at the very end of a sign (past 28°), its energy is transitioning and significantly weakened, reducing the dosha&apos;s impact.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Kala Sarpa Dosha                                          */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'काल सर्प दोष' : 'Kala Sarpa Dosha'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>काल सर्प दोष (शाब्दिक &quot;काल का सर्प&quot;) तब बनता है जब सभी सात दृश्य ग्रह (सूर्य, चन्द्र, मंगल, बुध, गुरु, शुक्र, शनि) राहु-केतु अक्ष के एक ओर हों। कल्पना करें कि जन्म कुण्डली राहु-केतु रेखा द्वारा विभाजित वृत्त है — यदि सभी ग्रह एक आधे में हों तो दूसरा आधा पूर्णतः खाली है। इससे ऊर्जा का तीव्र केन्द्रीकरण और तदनुरूपी शून्य बनता है, जो चरम का जीवन उत्पन्न करता है — उल्लेखनीय उपलब्धियों और अकथनीय विपत्तियों का आवर्तन।</> : <>Kala Sarpa Dosha (literally &quot;serpent of time&quot;) forms when all seven visible planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) are contained on one side of the Rahu-Ketu axis. Imagine the birth chart as a circle divided by the Rahu-Ketu line — if all planets fall on one half, the other half is completely empty. This creates an intense concentration of energy and a corresponding void, producing a life of extremes — periods of remarkable achievement alternating with inexplicable setbacks.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आंशिक बनाम पूर्ण' : 'Partial vs Complete'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">पूर्ण काल सर्प:</span> सभी 7 ग्रह राहु और केतु के बीच सख्ती से हों, कोई ग्रह किसी पात के साथ संयुक्त न हो। यह पूर्ण बल का दोष है। प्रभावों में करियर-सम्बन्ध असन्तुलन, भाग्य का अचानक पलटना और कार्मिक चक्र में फँसे होने का अनुभव सम्मिलित है।</> : <><span className="text-gold-light font-medium">Complete Kala Sarpa:</span> All 7 planets strictly between Rahu and Ketu with no planet conjunct either node. This is the full-strength dosha. Effects include career-relationship imbalance, sudden reversals of fortune, and a feeling of being caught in a karmic loop.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Partial Kala Sarpa:</span> One or more planets conjunct Rahu or Ketu (within ~5°), sitting on the boundary. This significantly reduces the dosha&apos;s intensity. The boundary planet acts as a bridge between the concentrated and empty halves, allowing energy to flow more freely.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'जीवन पर प्रभाव' : 'Effects on Life'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          Kala Sarpa natives often experience: delayed marriage or career establishment, sudden rises followed by unexpected falls, intense spiritual experiences, feeling &quot;different&quot; from peers, and a strong pull toward unconventional paths. Many highly successful individuals have Kala Sarpa — the concentrated energy, when channeled properly, produces extraordinary results in one area of life.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Cancellation:</span> An exalted planet within the hemmed arc provides enough strength to counteract the dosha. Some texts also consider the dosha cancelled after age 33 (half of the Rahu-Ketu 18-year cycle plus buffer). Remedial measures include Rahu-Ketu puja, Naga Panchami observances, and Kala Sarpa Shanti rituals.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Other Doshas & Remedial Principle                         */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अन्य दोष एवं उपचार सिद्धान्त' : 'Other Doshas & Remedial Principles'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मंगल और काल सर्प के अतिरिक्त, कुण्डली विश्लेषण में कई अन्य दोष बार-बार दिखते हैं। प्रत्येक एक विशिष्ट कार्मिक प्रतिमान है — शाप नहीं, बल्कि विरासत में मिली प्रवृत्ति जो पूर्वानुमेय चुनौतियाँ बनाती है। दोष समझना पहला कदम है; उपचार दूसरा। वैदिक परम्परा प्रत्येक दोष के लिए विशिष्ट प्रतिउपाय प्रदान करती है — आध्यात्मिक साधना, दान, रत्न और सचेत व्यवहार समायोजन का संयोजन।</> : <>Beyond Mangal and Kala Sarpa, several other doshas appear frequently in chart analysis. Each represents a specific karmic pattern — not a curse, but an inherited tendency that creates predictable challenges. Understanding the dosha is the first step; remediation is the second. Vedic tradition provides specific countermeasures for each dosha, combining spiritual practice, charity, gemstones, and conscious behavioral adjustment.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पितृ दोष' : 'Pitra Dosha'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Formation:</span> Sun conjunct Rahu, Sun conjunct Saturn, or severe affliction to the 9th house (ancestors). The 9th house represents father, forefathers, and inherited merit (punya). When afflicted, ancestral karmic debts remain unresolved.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Effects:</span> Recurring obstacles in progeny, career blocks that defy logical explanation, persistent pattern of near-misses, strained father-child relationships, and a sense of being held back by invisible forces.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Remedies:</span> Shraddha rituals for ancestors (Pind Daan at Gaya), Pitru Tarpanam during Pitru Paksha, feeding Brahmins, planting Peepal trees, and regular offerings to departed souls.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'गुरु चाण्डाल एवं शापित' : 'Guru Chandal & Shrapit'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">गुरु चाण्डाल (गुरु + राहु):</span> ज्ञान और धार्मिक बोध को दूषित करता है। जातक गलत गुरुओं का अनुसरण कर सकता है, अपरम्परागत या भ्रामक मान्यताएँ रख सकता है, या शिक्षकों और मार्गदर्शकों से समस्याएँ झेल सकता है।</> : <><span className="text-gold-light font-medium">Guru Chandal (Jupiter + Rahu):</span> Corrupts wisdom and dharmic sense. The native may follow false gurus, hold unorthodox or misguided beliefs, or face problems with teachers and mentors. Remedies: strengthen Jupiter with yellow sapphire, recite Guru (Brihaspati) mantras, and donate to educational institutions.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">शापित दोष (शनि + राहु):</span> अकथनीय अवरोध और विलम्ब बनाता है। जातक को जिस भाव में यह संयोग हो वहाँ शापित या दीर्घकालिक दुर्भाग्यशाली अनुभव हो सकता है। पूर्वजन्म ऋण वर्तमान जीवन में बाधाएँ बनाते हैं।</> : <><span className="text-gold-light font-medium">Shrapit Dosha (Saturn + Rahu):</span> Creates inexplicable blocks and delays. The native may feel cursed or chronically unlucky in the house where this conjunction falls. Past-life debts create present-life obstacles. Remedies: Saturn mantras, Rahu pacification, feeding the poor on Saturdays, and Hanuman worship.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'उपचार सिद्धान्त' : 'The Remedial Principle'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>दोष कार्मिक प्रतिमान प्रकट करते हैं — दण्ड नहीं। उपचार सिद्धान्त त्रिविध है: (1) <span className="text-gold-light font-medium">कमजोर को मजबूत करें:</span> दोष प्रतिकार करने वाले शुभ ग्रहों के लिए रत्न और मन्त्र। (2) <span className="text-gold-light font-medium">पीड़ित को शान्त करें:</span> दोष कारक पापी ग्रह के लिए दान, उपवास और मन्त्र। (3) <span className="text-gold-light font-medium">सचेत जागरूकता:</span> प्रतिमान समझना भिन्न चयन करने देता है — कुण्डली मानचित्र है, बन्दीगृह नहीं।</> : <>Doshas reveal karmic patterns — not punishments. The principle behind remedies is threefold: (1) <span className="text-gold-light font-medium">Strengthen the weak:</span> Gemstones and mantras for benefic planets that can counteract the dosha. (2) <span className="text-gold-light font-medium">Pacify the afflicting:</span> Charity, fasting, and mantras for the malefic planet causing the dosha. (3) <span className="text-gold-light font-medium">Conscious awareness:</span> Understanding the pattern allows you to make different choices — the chart is a map, not a prison.</>}</p>
      </section>
    </div>
  );
}

export default function Module13_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

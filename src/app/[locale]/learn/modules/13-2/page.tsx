'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';

const META: ModuleMeta = {
  id: 'mod_13_2', phase: 3, topic: 'Yogas', moduleNumber: '13.2',
  title: { en: 'Dhana Yogas & Arishta Yogas', hi: 'धन योग एवं अरिष्ट योग' },
  subtitle: {
    en: 'Wealth-producing combinations (Dhana/Lakshmi) and suffering-indicating configurations (Daridra/Balarishta) with cancellation conditions',
    hi: 'धन उत्पन्न करने वाले संयोग (धन/लक्ष्मी) और कष्ट-सूचक विन्यास (दारिद्र/बालारिष्ट) निवारण शर्तों सहित',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 13-1: Yogas Overview', hi: 'मॉड्यूल 13-1: योग अवलोकन' }, href: '/learn/modules/13-1' },
    { label: { en: 'Module 13-3: Dosha Detection', hi: 'मॉड्यूल 13-3: दोष पहचान' }, href: '/learn/modules/13-3' },
    { label: { en: 'Yogas Deep Dive', hi: 'योग विस्तार' }, href: '/learn/yogas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q13_2_01', type: 'mcq',
    question: {
      en: 'The "wealth axis" in Vedic astrology primarily involves which houses?',
      hi: 'वैदिक ज्योतिष में "धन अक्ष" मुख्यतः किन भावों से सम्बन्धित है?',
    },
    options: [
      { en: '1, 4, 7, 10', hi: '1, 4, 7, 10' },
      { en: '2, 5, 9, 11', hi: '2, 5, 9, 11' },
      { en: '3, 6, 8, 12', hi: '3, 6, 8, 12' },
      { en: '4, 8, 12', hi: '4, 8, 12' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The wealth axis comprises the 2nd (accumulated wealth, family resources), 5th (speculative gains, past merit), 9th (fortune, divine grace), and 11th (income, fulfillment of desires) houses. Lords of these houses interacting create Dhana Yogas.',
      hi: 'धन अक्ष में 2रा (संचित धन, पारिवारिक संसाधन), 5वाँ (सट्टा लाभ, पूर्व पुण्य), 9वाँ (भाग्य, दैवी कृपा) और 11वाँ (आय, इच्छापूर्ति) भाव सम्मिलित हैं। इन भावों के स्वामियों की परस्पर क्रिया धन योग बनाती है।',
    },
  },
  {
    id: 'q13_2_02', type: 'mcq',
    question: {
      en: 'Lakshmi Yoga is formed when the 9th lord is:',
      hi: 'लक्ष्मी योग तब बनता है जब 9वें भाव का स्वामी:',
    },
    options: [
      { en: 'Debilitated in the 12th house', hi: '12वें भाव में नीच हो' },
      { en: 'Strong (own/exalted sign) and placed in a Kendra', hi: 'बलवान (स्वराशि/उच्च) और केन्द्र में स्थित हो' },
      { en: 'Combust with the Sun', hi: 'सूर्य के साथ अस्त हो' },
      { en: 'In the 8th house', hi: '8वें भाव में हो' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Lakshmi Yoga forms when the 9th lord (house of fortune) is strong — in its own or exalted sign — and placed in a Kendra (1, 4, 7, 10). Additionally, the Lagna lord should also be strong. This yoga bestows lasting wealth, prosperity, and divine grace.',
      hi: 'लक्ष्मी योग तब बनता है जब 9वाँ स्वामी (भाग्य भाव) बलवान हो — स्वराशि या उच्च में — और केन्द्र (1, 4, 7, 10) में स्थित हो। साथ ही लग्न स्वामी भी बलवान हो। यह योग स्थायी धन, समृद्धि और दैवी कृपा प्रदान करता है।',
    },
  },
  {
    id: 'q13_2_03', type: 'true_false',
    question: {
      en: 'A Jupiter-Mercury conjunction in the 2nd or 11th house forms a Dhana Yoga.',
      hi: 'गुरु-बुध संयोग 2रे या 11वें भाव में धन योग बनाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Jupiter (the great benefic of expansion) combined with Mercury (the planet of commerce and calculation) in wealth houses (2nd = accumulated wealth, 11th = income/gains) creates a powerful Dhana Yoga. Both planets enhance each other\'s wealth-giving capacity.',
      hi: 'सत्य। गुरु (विस्तार का महाशुभ) और बुध (वाणिज्य और गणना का ग्रह) धन भावों (2रा = संचित धन, 11वाँ = आय/लाभ) में संयुक्त शक्तिशाली धन योग बनाते हैं। दोनों ग्रह एक-दूसरे की धन-देने की क्षमता को बढ़ाते हैं।',
    },
  },
  {
    id: 'q13_2_04', type: 'mcq',
    question: {
      en: 'Daridra Yoga (poverty indication) forms when the 11th lord is placed in:',
      hi: 'दारिद्र योग (दरिद्रता सूचक) तब बनता है जब 11वें भाव का स्वामी स्थित हो:',
    },
    options: [
      { en: 'A Kendra house', hi: 'केन्द्र भाव में' },
      { en: 'The 6th, 8th, or 12th house', hi: '6वें, 8वें या 12वें भाव में' },
      { en: 'The 5th house', hi: '5वें भाव में' },
      { en: 'The 9th house', hi: '9वें भाव में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When the 11th lord (income and gains) is placed in dusthana houses (6th = debt/enemies, 8th = obstacles/losses, 12th = expenses/foreign lands), the natural flow of income is obstructed, indicating financial struggle.',
      hi: 'जब 11वाँ स्वामी (आय और लाभ) दुःस्थान भावों (6वाँ = ऋण/शत्रु, 8वाँ = बाधा/हानि, 12वाँ = व्यय/विदेश) में हो, तो आय का स्वाभाविक प्रवाह अवरुद्ध होता है, जो आर्थिक संघर्ष इंगित करता है।',
    },
  },
  {
    id: 'q13_2_05', type: 'true_false',
    question: {
      en: 'Daridra Yoga indicates permanent, unchangeable poverty throughout life.',
      hi: 'दारिद्र योग जीवनभर स्थायी, अपरिवर्तनीय दरिद्रता इंगित करता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Daridra Yoga indicates a tendency toward financial struggle, not permanent poverty. It is dasha-dependent — during favorable dasha periods, the struggle may ease significantly. Strong Jupiter aspect can cancel or mitigate the yoga. Remedial measures also help.',
      hi: 'असत्य। दारिद्र योग आर्थिक संघर्ष की प्रवृत्ति इंगित करता है, स्थायी दरिद्रता नहीं। यह दशा-निर्भर है — अनुकूल दशा काल में संघर्ष काफी कम हो सकता है। गुरु की दृष्टि योग को निरस्त या शमित कर सकती है। उपचारात्मक उपाय भी सहायक हैं।',
    },
  },
  {
    id: 'q13_2_06', type: 'mcq',
    question: {
      en: 'Balarishta Yoga (danger to children/infants) is indicated by:',
      hi: 'बालारिष्ट योग (शिशु/बालकों को खतरा) किससे सूचित होता है?',
    },
    options: [
      { en: 'Jupiter in the 5th house', hi: 'गुरु 5वें भाव में' },
      { en: 'Moon with malefics without benefic aspect', hi: 'शुभ दृष्टि बिना पापी ग्रहों के साथ चन्द्रमा' },
      { en: 'Venus in own sign', hi: 'शुक्र स्वराशि में' },
      { en: 'Mercury in the 9th house', hi: 'बुध 9वें भाव में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Balarishta Yoga forms when the Moon (significator of nurturing, early life) is afflicted by malefics (Saturn, Mars, Rahu, Ketu) without the protective aspect of benefics (Jupiter, Venus). In children\'s charts, this indicates health vulnerabilities in early years.',
      hi: 'बालारिष्ट योग तब बनता है जब चन्द्रमा (पोषण, प्रारम्भिक जीवन का कारक) शुभ ग्रहों (गुरु, शुक्र) की रक्षात्मक दृष्टि बिना पापी ग्रहों (शनि, मंगल, राहु, केतु) से पीड़ित हो। बालकों की कुण्डली में यह प्रारम्भिक वर्षों में स्वास्थ्य सम्वेदनशीलता इंगित करता है।',
    },
  },
  {
    id: 'q13_2_07', type: 'mcq',
    question: {
      en: 'Venus in own or exalted sign in the 2nd house forms which type of yoga?',
      hi: '2रे भाव में शुक्र स्वराशि या उच्च में कौन-सा योग बनाता है?',
    },
    options: [
      { en: 'Arishta Yoga', hi: 'अरिष्ट योग' },
      { en: 'Dhana Yoga', hi: 'धन योग' },
      { en: 'Kala Sarpa Yoga', hi: 'काल सर्प योग' },
      { en: 'Grahan Dosha', hi: 'ग्रहण दोष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Venus (planet of luxury, wealth, and material comfort) strong in its own or exalted sign in the 2nd house (accumulated wealth, family resources) creates a Dhana Yoga. The native enjoys material prosperity, fine possessions, and a comfortable family life.',
      hi: 'शुक्र (विलासिता, धन और भौतिक सुख का ग्रह) 2रे भाव (संचित धन, पारिवारिक संसाधन) में स्वराशि या उच्च में बलवान धन योग बनाता है। जातक भौतिक समृद्धि, सुन्दर सम्पत्तियाँ और आरामदायक पारिवारिक जीवन भोगता है।',
    },
  },
  {
    id: 'q13_2_08', type: 'mcq',
    question: {
      en: 'The 8th lord placed in the Lagna (1st house) is an indicator of:',
      hi: '8वें भाव का स्वामी लग्न (1ले भाव) में किसका सूचक है?',
    },
    options: [
      { en: 'Great wealth and fame', hi: 'महान धन और प्रसिद्धि' },
      { en: 'Arishta Yoga — health vulnerabilities and life challenges', hi: 'अरिष्ट योग — स्वास्थ्य सम्वेदनशीलता और जीवन चुनौतियाँ' },
      { en: 'Spiritual liberation', hi: 'आध्यात्मिक मुक्ति' },
      { en: 'Foreign settlement', hi: 'विदेश बसावट' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 8th lord (house of chronic disease, obstacles, longevity issues) placed in the Lagna (self, body, vitality) creates an Arishta Yoga — bringing the 8th house\'s challenging energy directly to the native\'s body and sense of self. It indicates potential for chronic health issues or life disruptions.',
      hi: '8वाँ स्वामी (जीर्ण रोग, बाधा, आयु समस्या का भाव) लग्न (स्वयं, शरीर, जीवनशक्ति) में अरिष्ट योग बनाता है — 8वें भाव की चुनौतीपूर्ण ऊर्जा सीधे जातक के शरीर और आत्मबोध तक लाता है। यह जीर्ण स्वास्थ्य समस्याओं या जीवन अवरोधों की सम्भावना इंगित करता है।',
    },
  },
  {
    id: 'q13_2_09', type: 'true_false',
    question: {
      en: 'A strong Jupiter aspect can cancel or significantly mitigate Daridra Yoga.',
      hi: 'गुरु की शक्तिशाली दृष्टि दारिद्र योग को निरस्त या काफी शमित कर सकती है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Jupiter is the great benefic and significator of wealth, wisdom, and divine protection. Its aspect on afflicted wealth houses or on the 11th lord in dusthana can significantly reduce the poverty indication. Jupiter\'s dasha period often brings relief from financial struggles indicated by Daridra Yoga.',
      hi: 'सत्य। गुरु महाशुभ और धन, ज्ञान तथा दैवी सुरक्षा का कारक है। पीड़ित धन भावों या दुःस्थान में 11वें स्वामी पर इसकी दृष्टि दरिद्रता संकेत को काफी कम कर सकती है। गुरु की दशा काल में प्रायः दारिद्र योग द्वारा इंगित आर्थिक संघर्षों से राहत मिलती है।',
    },
  },
  {
    id: 'q13_2_10', type: 'mcq',
    question: {
      en: 'Saturn and Mars together in the 8th house indicate:',
      hi: '8वें भाव में शनि और मंगल साथ किसका संकेत करते हैं?',
    },
    options: [
      { en: 'Dhana Yoga for hidden wealth', hi: 'गुप्त धन के लिए धन योग' },
      { en: 'Arishta Yoga — accidents, surgeries, or chronic illness risk', hi: 'अरिष्ट योग — दुर्घटना, शल्य चिकित्सा या जीर्ण रोग का जोखिम' },
      { en: 'Pancha Mahapurusha Yoga', hi: 'पञ्च महापुरुष योग' },
      { en: 'Neecha Bhanga Raja Yoga', hi: 'नीच भंग राज योग' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn (chronic disease, delays) and Mars (accidents, surgery, inflammation) together in the 8th house (longevity, sudden events) create a serious Arishta Yoga. The severity is assessed by dasha timing, aspects of benefics, and the overall chart strength.',
      hi: 'शनि (जीर्ण रोग, विलम्ब) और मंगल (दुर्घटना, शल्य चिकित्सा, शोथ) 8वें भाव (आयु, अचानक घटना) में एक साथ गम्भीर अरिष्ट योग बनाते हैं। तीव्रता दशा समय, शुभ ग्रहों की दृष्टि और समग्र कुण्डली बल से आँकी जाती है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Dhana Yogas                                               */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'धन योग — सम्पत्ति संयोग' : 'Dhana Yogas — Wealth Combinations'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>धन योग विशिष्ट ग्रह संयोग हैं जो धन संचय, आर्थिक समृद्धि और भौतिक प्रचुरता इंगित करते हैं। ये मुख्यतः धन अक्ष के स्वामियों की परस्पर क्रिया से बनते हैं — 2रा (संचित धन, पारिवारिक संसाधन), 5वाँ (सट्टा लाभ, पूर्वजन्म पुण्य, बुद्धि), 9वाँ (भाग्य, दैवी कृपा, पैतृक धन), और 11वाँ (आय, लाभ, इच्छापूर्ति) भाव। जब इन भावों के स्वामी संयोग, परस्पर दृष्टि या राशि विनिमय बनाते हैं, तो जातक के जीवन में धन प्रवाह की नलिकाएँ बनती हैं।</> : <>Dhana Yogas are specific planetary combinations that indicate wealth accumulation, financial prosperity, and material abundance. They are formed primarily by the interaction of lords of the wealth axis — the 2nd (stored wealth, family resources), 5th (speculative gains, past-life merit, intellect), 9th (fortune, divine grace, father&apos;s wealth), and 11th (income, gains, fulfillment) houses. When these lords form conjunctions, mutual aspects, or sign exchanges, they create pipelines for wealth to flow into the native&apos;s life.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख धन योग' : 'Key Dhana Yogas'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2nd + 11th lords in mutual Kendras:</span> When the lord of stored wealth and the lord of income occupy each other&apos;s Kendra positions, wealth flows both ways — savings grow and income increases. This is a classic prosperity indicator.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Lakshmi Yoga:</span> The 9th lord in strong dignity (own/exalted sign) placed in a Kendra, with the Lagna lord also strong. Named after the goddess of wealth, this yoga bestows not just money but lasting prosperity supported by divine grace and good fortune.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Jupiter-Mercury in 2nd or 11th:</span> Jupiter (expansion, wisdom) and Mercury (commerce, calculation) together in wealth houses create exceptional financial intelligence. The native has a natural ability to grow wealth through business, investments, or intellectual pursuits.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Venus in own/exalted in 2nd:</span> Venus (luxury, material comfort) strong in the 2nd house (accumulated wealth) produces a life of material abundance, fine possessions, good food, and aesthetic living. The native attracts wealth through charm, art, or social connections.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Daridra Yogas                                             */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दारिद्र योग — दरिद्रता सूचक' : 'Daridra Yogas — Poverty Indicators'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दारिद्र योग आर्थिक कठिनाई, संसाधन अभाव और भौतिक संघर्ष की प्रवृत्तियाँ इंगित करते हैं। यह समझना अत्यन्त महत्वपूर्ण है कि ये योग प्रतिमान बताते हैं, स्थायी दण्डादेश नहीं। ये विशिष्ट दशा कालों में सक्रिय होते हैं और शुभ प्रभावों, विशेषकर गुरु की दृष्टि से काफी शमित हो सकते हैं। अनेक सफल लोगों की कुण्डली में दारिद्र योग हैं — उन्होंने बस अधिक परिश्रम किया या अन्य प्रतिकारी योगों ने कठिनाई पर विजय पाई।</> : <>Daridra Yogas indicate tendencies toward financial difficulty, resource scarcity, and material struggle. It is crucial to understand that these yogas describe patterns, not permanent sentences. They activate during specific dasha periods and can be significantly mitigated by benefic influences, especially Jupiter&apos;s aspect. Many successful people have Daridra Yogas in their charts — they simply worked harder or had other compensating yogas that overcame the difficulty.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य निर्माण' : 'Common Formations'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">11th lord in 6/8/12:</span> The lord of gains trapped in houses of debt (6th), obstacles (8th), or expenses (12th). Income is earned but immediately consumed by debts, crises, or excessive spending.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Malefics in 2nd without benefic aspect:</span> Natural malefics (Saturn, Mars, Rahu, Sun) occupying the 2nd house without the protective gaze of Jupiter or Venus damage accumulated wealth, family harmony, and financial stability.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">2nd lord debilitated or in 6/8/12:</span> The custodian of wealth is weakened or misplaced, making it difficult to save, invest wisely, or maintain family resources.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'निरसन एवं शमन' : 'Cancellation & Mitigation'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Jupiter&apos;s aspect:</span> A strong Jupiter aspecting the afflicted house or planet can substantially cancel Daridra Yoga. Jupiter brings wisdom, expansion, and divine protection to whatever it touches.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Favorable Dasha:</span> Even with Daridra Yoga, the dasha of a well-placed benefic (especially if it forms a Dhana Yoga elsewhere in the chart) can bring temporary but significant financial relief.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Neecha Bhanga:</span> If the debilitated planet causing the yoga has cancellation of debilitation (Neecha Bhanga), the initial struggle transforms into eventual prosperity — the native earns wealth through overcoming adversity.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Arishta Yogas                                             */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अरिष्ट योग — स्वास्थ्य एवं संकट' : 'Arishta Yogas — Health & Danger'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अरिष्ट योग स्वास्थ्य, शारीरिक सुरक्षा या जीवन आयु में सम्वेदनशीलता इंगित करते हैं। ये तब बनते हैं जब पापी ग्रह कुण्डली के संवेदनशील बिन्दुओं को पीड़ित करते हैं — विशेषकर चन्द्रमा (मन, पोषण), लग्न (शरीर, जीवनशक्ति) और 8वाँ भाव (आयु, जीर्ण स्थिति)। अरिष्ट मूल्यांकन फलित और उपचारात्मक ज्योतिष दोनों के लिए आवश्यक है, क्योंकि सम्वेदनशीलता पहचानना निवारक उपायों की अनुमति देता है।</> : <>Arishta Yogas indicate vulnerabilities in health, physical safety, or life longevity. They are formed when malefic planets afflict sensitive chart points — particularly the Moon (mind, nurturing), Lagna (body, vitality), and the 8th house (longevity, chronic conditions). Arishta assessment is essential for both predictive and remedial astrology, as identifying vulnerabilities allows for preventive measures.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख अरिष्ट विन्यास' : 'Key Arishta Configurations'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Balarishta (infant danger):</span> Moon afflicted by malefics without benefic aspect — vulnerable early childhood health. Saturn-Moon (emotional suppression), Mars-Moon (fevers, inflammation), Rahu-Moon (unexplained anxieties). Jupiter&apos;s aspect is the primary protector.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">8th lord in Lagna:</span> The lord of chronic disease and sudden events placed directly in the house of self and body. Creates a lifelong vulnerability to health issues, especially during the dasha of the 8th lord.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Saturn-Mars in 8th house:</span> Two powerful malefics combining in the house of longevity. Saturn brings chronic conditions; Mars brings acute crises (accidents, surgeries, inflammation). Together they indicate periods requiring extreme health vigilance.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'तीव्रता मूल्यांकन' : 'Severity Assessment'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>अरिष्ट तीव्रता निर्भर करती है: (1) कितने पापी ग्रह सम्मिलित हैं — एक सम्भालने योग्य है, दो या अधिक गम्भीर। (2) शुभ प्रतिसन्तुलन — गुरु या शुक्र की दृष्टि पीड़ित बिन्दु पर तीव्रता नाटकीय रूप से कम करती है। (3) लग्न स्वामी बल — बलवान लग्न स्वामी पीड़ाओं को सहने की शारीरिक सहनशक्ति देता है। (4) दशा समय — अरिष्ट योग केवल सम्बन्धित ग्रहों की दशा में सक्रिय होते हैं।</> : <>Arishta severity depends on: (1) How many malefics are involved — one malefic is manageable, two or more is serious. (2) Benefic counterbalance — Jupiter or Venus aspecting the afflicted point reduces severity dramatically. (3) Lagna lord strength — a strong Lagna lord gives physical resilience to withstand afflictions. (4) Dasha timing — Arishta Yogas activate only during the dasha of involved planets.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'उपचारात्मक दृष्टिकोण' : 'Remedial Perspective'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Identifying Arishta Yogas is not meant to create fear but to enable prevention. Jyotish tradition prescribes specific remedies: strengthening benefics through gemstones (yellow sapphire for Jupiter, diamond/white sapphire for Venus), mantras for the afflicting planets, charitable acts associated with the malefic (e.g., feeding crows for Saturn, donating red items for Mars), and spiritual practices. Modern health awareness — regular checkups during vulnerable dasha periods — is the practical application of Arishta analysis.
        </p>
      </section>
    </div>
  );
}

export default function Module13_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

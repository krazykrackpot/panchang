'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_13_1', phase: 3, topic: 'Yogas', moduleNumber: '13.1',
  title: { en: 'Yogas — Planetary Combinations', hi: 'योग — ग्रह संयोग' },
  subtitle: {
    en: 'Specific planetary configurations that produce defined results — Raja, Dhana, Arishta, Nabhasa, and the Pancha Mahapurusha Yogas',
    hi: 'विशिष्ट ग्रह विन्यास जो निश्चित फल उत्पन्न करते हैं — राज, धन, अरिष्ट, नाभस और पञ्च महापुरुष योग',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 13-2: Dhana & Arishta Yogas', hi: 'मॉड्यूल 13-2: धन और अरिष्ट योग' }, href: '/learn/modules/13-2' },
    { label: { en: 'Module 13-3: Dosha Detection & Cancellation', hi: 'मॉड्यूल 13-3: दोष पहचान एवं निवारण' }, href: '/learn/modules/13-3' },
    { label: { en: 'Yogas Deep Dive', hi: 'योग विस्तार' }, href: '/learn/yogas' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q13_1_01', type: 'mcq',
    question: {
      en: 'What fundamentally distinguishes Vedic "yogas" from Western "aspects"?',
      hi: 'वैदिक "योग" पश्चिमी "दृष्टि" से मूलभूत रूप से किस प्रकार भिन्न हैं?',
    },
    options: [
      { en: 'Yogas use degree-based angles only', hi: 'योग केवल अंश-आधारित कोणों का प्रयोग करते हैं' },
      { en: 'Yogas consider house lordship, not just geometric angles', hi: 'योग केवल ज्यामितीय कोणों के बजाय भाव स्वामित्व पर विचार करते हैं' },
      { en: 'There is no difference', hi: 'कोई अन्तर नहीं है' },
      { en: 'Yogas only apply to the Sun and Moon', hi: 'योग केवल सूर्य और चन्द्रमा पर लागू होते हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Vedic yogas are based on house lordship — which houses a planet rules based on the rising sign. A conjunction of the 9th and 10th lords forms a Raja Yoga regardless of the degree angle. Western aspects focus primarily on geometric angles (trine, square, opposition) between planets.',
      hi: 'वैदिक योग भाव स्वामित्व पर आधारित हैं — लग्न के अनुसार ग्रह किन भावों का स्वामी है। 9वें और 10वें भाव के स्वामियों का संयोग अंश कोण की परवाह किए बिना राज योग बनाता है। पश्चिमी दृष्टि मुख्यतः ग्रहों के बीच ज्यामितीय कोणों (त्रिकोण, वर्ग, सम्मुख) पर केन्द्रित है।',
    },
  },
  {
    id: 'q13_1_02', type: 'mcq',
    question: {
      en: 'Which of the following is NOT a major category of yogas?',
      hi: 'निम्नलिखित में से कौन-सी योगों की प्रमुख श्रेणी नहीं है?',
    },
    options: [
      { en: 'Raja Yoga (power/authority)', hi: 'राज योग (शक्ति/अधिकार)' },
      { en: 'Dhana Yoga (wealth)', hi: 'धन योग (सम्पत्ति)' },
      { en: 'Grahan Yoga (eclipse)', hi: 'ग्रहण योग (ग्रहण)' },
      { en: 'Nabhasa Yoga (celestial pattern)', hi: 'नाभस योग (आकाशीय प्रतिमान)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The major yoga categories are Raja (power), Dhana (wealth), Arishta (suffering/health), and Nabhasa (celestial patterns based on planetary distribution). "Grahan Yoga" is not a standard category — though Grahan (eclipse) affects doshas, it is not a yoga classification.',
      hi: 'प्रमुख योग श्रेणियाँ हैं: राज (शक्ति), धन (सम्पत्ति), अरिष्ट (कष्ट/स्वास्थ्य) और नाभस (ग्रह वितरण पर आधारित आकाशीय प्रतिमान)। "ग्रहण योग" मानक श्रेणी नहीं है — यद्यपि ग्रहण दोषों को प्रभावित करता है, यह योग वर्गीकरण नहीं है।',
    },
  },
  {
    id: 'q13_1_03', type: 'mcq',
    question: {
      en: 'Ruchaka Yoga — one of the Pancha Mahapurusha Yogas — is formed by:',
      hi: 'रुचक योग — पञ्च महापुरुष योगों में से एक — किससे बनता है?',
    },
    options: [
      { en: 'Jupiter in own or exalted sign in a Kendra', hi: 'गुरु स्वराशि या उच्च राशि में केन्द्र में' },
      { en: 'Mars in own or exalted sign in a Kendra', hi: 'मंगल स्वराशि या उच्च राशि में केन्द्र में' },
      { en: 'Venus in own or exalted sign in a Kendra', hi: 'शुक्र स्वराशि या उच्च राशि में केन्द्र में' },
      { en: 'Saturn in own or exalted sign in a Kendra', hi: 'शनि स्वराशि या उच्च राशि में केन्द्र में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Ruchaka Yoga is formed when Mars occupies its own sign (Aries/Scorpio) or exaltation sign (Capricorn) in a Kendra house (1st, 4th, 7th, or 10th from Lagna or Moon). It produces a warrior-like personality — courageous, commanding, and physically strong.',
      hi: 'रुचक योग तब बनता है जब मंगल अपनी स्वराशि (मेष/वृश्चिक) या उच्च राशि (मकर) में केन्द्र भाव (लग्न या चन्द्र से 1, 4, 7 या 10वें) में हो। यह योद्धा जैसा व्यक्तित्व उत्पन्न करता है — साहसी, आदेशात्मक और शारीरिक रूप से बलवान।',
    },
  },
  {
    id: 'q13_1_04', type: 'true_false',
    question: {
      en: 'Hamsa Yoga (one of the Pancha Mahapurusha) is formed by Jupiter in own or exalted sign in a Kendra.',
      hi: 'हंस योग (पञ्च महापुरुष में से एक) गुरु के स्वराशि या उच्च राशि में केन्द्र में होने से बनता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Hamsa Yoga forms when Jupiter occupies its own sign (Sagittarius/Pisces) or exaltation (Cancer) in a Kendra house. It bestows spiritual wisdom, righteousness, respect from authority, and a noble character — the "swan" personality that discriminates between the pure and impure.',
      hi: 'सत्य। हंस योग तब बनता है जब गुरु स्वराशि (धनु/मीन) या उच्च (कर्क) में केन्द्र भाव में हो। यह आध्यात्मिक ज्ञान, धार्मिकता, अधिकारियों से सम्मान और उत्तम चरित्र प्रदान करता है — "हंस" व्यक्तित्व जो शुद्ध और अशुद्ध में भेद करता है।',
    },
  },
  {
    id: 'q13_1_05', type: 'mcq',
    question: {
      en: 'Which Pancha Mahapurusha Yoga produces a scholar/intellectual personality?',
      hi: 'कौन-सा पञ्च महापुरुष योग विद्वान/बौद्धिक व्यक्तित्व उत्पन्न करता है?',
    },
    options: [
      { en: 'Ruchaka (Mars)', hi: 'रुचक (मंगल)' },
      { en: 'Bhadra (Mercury)', hi: 'भद्र (बुध)' },
      { en: 'Malavya (Venus)', hi: 'मालव्य (शुक्र)' },
      { en: 'Shasha (Saturn)', hi: 'शश (शनि)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Bhadra Yoga forms when Mercury is in its own sign (Gemini/Virgo) or exaltation (Virgo) in a Kendra. Mercury being the planet of intellect and communication, Bhadra natives are eloquent scholars, skilled writers, and sharp analysts with exceptional learning ability.',
      hi: 'भद्र योग तब बनता है जब बुध स्वराशि (मिथुन/कन्या) या उच्च (कन्या) में केन्द्र में हो। बुध बुद्धि और संचार का ग्रह होने से भद्र जातक वाक्पटु विद्वान, कुशल लेखक और तीक्ष्ण विश्लेषक होते हैं जिनमें असाधारण अधिगम क्षमता होती है।',
    },
  },
  {
    id: 'q13_1_06', type: 'mcq',
    question: {
      en: 'A Raja Yoga is fundamentally formed by the conjunction or exchange of lords of:',
      hi: 'राज योग मूलतः किन स्वामियों के संयोग या विनिमय से बनता है?',
    },
    options: [
      { en: 'Dusthana houses (6, 8, 12)', hi: 'दुःस्थान भाव (6, 8, 12)' },
      { en: 'Kendra and Trikona houses', hi: 'केन्द्र और त्रिकोण भाव' },
      { en: 'Only the 2nd and 11th houses', hi: 'केवल 2रा और 11वाँ भाव' },
      { en: 'Upachaya houses (3, 6, 10, 11)', hi: 'उपचय भाव (3, 6, 10, 11)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Raja Yogas are formed by the conjunction, mutual aspect, or exchange (Parivartana) of Kendra lords (1, 4, 7, 10) with Trikona lords (1, 5, 9). Kendra represents action/manifestation; Trikona represents dharma/fortune. Their union creates the "royal combination" — power with purpose.',
      hi: 'राज योग केन्द्र स्वामियों (1, 4, 7, 10) और त्रिकोण स्वामियों (1, 5, 9) के संयोग, परस्पर दृष्टि या विनिमय (परिवर्तन) से बनते हैं। केन्द्र कर्म/अभिव्यक्ति का प्रतिनिधि है; त्रिकोण धर्म/भाग्य का। इनका मिलन "राजकीय संयोग" बनाता है — उद्देश्य के साथ शक्ति।',
    },
  },
  {
    id: 'q13_1_07', type: 'mcq',
    question: {
      en: 'The strongest Raja Yoga — Dharma-Karma Adhipati Yoga — is formed by:',
      hi: 'सबसे शक्तिशाली राज योग — धर्म-कर्म अधिपति योग — किससे बनता है?',
    },
    options: [
      { en: '1st lord + 7th lord together', hi: '1ले और 7वें भाव के स्वामी साथ' },
      { en: '9th lord + 10th lord together', hi: '9वें और 10वें भाव के स्वामी साथ' },
      { en: '2nd lord + 11th lord together', hi: '2रे और 11वें भाव के स्वामी साथ' },
      { en: '4th lord + 8th lord together', hi: '4थे और 8वें भाव के स्वामी साथ' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Dharma-Karma Adhipati Yoga is the conjunction or exchange of the 9th lord (supreme dharma/fortune) and 10th lord (supreme karma/action). This is considered the most powerful Raja Yoga because it unites the highest trikona (9th = bhagya) with the highest kendra (10th = karma).',
      hi: '9वें स्वामी (परम धर्म/भाग्य) और 10वें स्वामी (परम कर्म) का संयोग या विनिमय धर्म-कर्म अधिपति योग है। यह सबसे शक्तिशाली राज योग माना जाता है क्योंकि यह सर्वोच्च त्रिकोण (9वाँ = भाग्य) को सर्वोच्च केन्द्र (10वाँ = कर्म) से जोड़ता है।',
    },
  },
  {
    id: 'q13_1_08', type: 'true_false',
    question: {
      en: 'A Raja Yoga automatically guarantees wealth and power regardless of dasha and transit.',
      hi: 'राज योग दशा और गोचर की परवाह किए बिना स्वतः धन और शक्ति की गारण्टी देता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. A Raja Yoga is a promise in the chart, but it manifests only when activated by the appropriate dasha period (of one of the yoga-forming planets) and supported by favorable transits. An unactivated Raja Yoga remains dormant — potential without timing.',
      hi: 'असत्य। राज योग कुण्डली में एक वचन है, परन्तु यह तभी प्रकट होता है जब उचित दशा काल (योग बनाने वाले ग्रहों में से एक की) द्वारा सक्रिय हो और अनुकूल गोचर समर्थन करे। असक्रिय राज योग सुप्त रहता है — समय बिना सम्भावना।',
    },
  },
  {
    id: 'q13_1_09', type: 'mcq',
    question: {
      en: 'Malavya Yoga (Pancha Mahapurusha) produces which type of personality?',
      hi: 'मालव्य योग (पञ्च महापुरुष) किस प्रकार का व्यक्तित्व उत्पन्न करता है?',
    },
    options: [
      { en: 'Warrior and commander', hi: 'योद्धा और सेनापति' },
      { en: 'Artist, lover of luxury, and refined aesthetic sense', hi: 'कलाकार, विलासिता प्रेमी और परिष्कृत सौन्दर्य बोध' },
      { en: 'Strict disciplinarian and authority figure', hi: 'कठोर अनुशासक और अधिकारी व्यक्ति' },
      { en: 'Ascetic and renunciant', hi: 'तपस्वी और त्यागी' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Malavya Yoga forms when Venus is in its own sign (Taurus/Libra) or exaltation (Pisces) in a Kendra. Venus being the planet of beauty, art, and luxury, Malavya natives have refined taste, artistic talent, material comforts, and magnetic charm.',
      hi: 'मालव्य योग तब बनता है जब शुक्र स्वराशि (वृषभ/तुला) या उच्च (मीन) में केन्द्र में हो। शुक्र सौन्दर्य, कला और विलासिता का ग्रह होने से मालव्य जातक परिष्कृत रुचि, कलात्मक प्रतिभा, भौतिक सुख और आकर्षक व्यक्तित्व रखते हैं।',
    },
  },
  {
    id: 'q13_1_10', type: 'mcq',
    question: {
      en: 'How many possible Kendra-Trikona lord combinations can form Raja Yogas?',
      hi: 'केन्द्र-त्रिकोण स्वामी संयोगों से कितने राज योग सम्भव हैं?',
    },
    options: [
      { en: '3', hi: '3' },
      { en: '7 major combinations', hi: '7 प्रमुख संयोग' },
      { en: '12', hi: '12' },
      { en: '27', hi: '27' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The 7 major Raja Yoga combinations are: 1st+5th, 1st+9th, 4th+5th, 4th+9th, 7th+5th, 7th+9th, 10th+5th, 10th+9th lords. The 1st lord is both Kendra and Trikona, making combinations with 5th or 9th especially potent. The strongest is 9th+10th (Dharma-Karma Adhipati).',
      hi: '7 प्रमुख राज योग संयोग हैं: 1+5, 1+9, 4+5, 4+9, 7+5, 7+9, 10+5, 10+9 भाव स्वामी। 1ला स्वामी केन्द्र और त्रिकोण दोनों है, 5वें या 9वें के साथ संयोग विशेष शक्तिशाली बनाता है। सबसे बलवान 9+10 (धर्म-कर्म अधिपति) है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — What is a Yoga?                                           */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'योग क्या है?' : 'What is a Yoga?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में &quot;योग&quot; (शाब्दिक अर्थ &quot;संयोग&quot; या &quot;मिलन&quot;) एक विशिष्ट ग्रह विन्यास है जो निश्चित, पूर्वानुमेय फल उत्पन्न करता है। पश्चिमी ज्योतिष के विपरीत जो मुख्यतः व्यक्तिगत दृष्टियों (ग्रहों के बीच कोण) का विश्लेषण करता है, वैदिक योग ग्रहों के भाव स्वामित्व पर विचार करते हैं — लग्न के अनुसार ग्रह किन भावों का स्वामी है — जिससे समान ग्रह कोण भिन्न लग्नों के लिए पूर्णतः भिन्न फल देते हैं।</> : <>In Vedic astrology, a &quot;yoga&quot; (literally &quot;union&quot; or &quot;combination&quot;) is a specific planetary configuration that produces defined, predictable results. Unlike Western astrology which primarily analyzes individual aspects (angles between planets), Vedic yogas consider the house lordship of planets — which houses a planet rules based on the Ascendant — making identical planetary angles produce entirely different results for different rising signs. This lordship-based approach is what gives Jyotish its remarkable predictive specificity.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख योग श्रेणियाँ' : 'Major Yoga Categories'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Raja Yogas (Power):</span> Formed by Kendra-Trikona lord combinations. These confer authority, leadership, social status, and influence. From political power to corporate leadership to spiritual authority — Raja Yogas elevate a person above the ordinary.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Dhana Yogas (Wealth):</span> Combinations involving the 2nd, 5th, 9th, and 11th house lords with benefic influences. These bring financial prosperity, material accumulation, and resource abundance.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Arishta Yogas (Suffering):</span> Configurations indicating health challenges, accidents, or life difficulties. These involve malefic afflictions to sensitive points — especially the Moon, Lagna, and 8th house.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Nabhasa Yogas (Celestial Patterns):</span> Based on overall planetary distribution across the chart — how many planets are in kendras, trikonas, or specific formations. Examples include Gaja Kesari (Jupiter-Moon in kendras) and various Sankhya yogas.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Pancha Mahapurusha Yogas                                  */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'पञ्च महापुरुष योग' : 'Pancha Mahapurusha Yogas'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>पाँच &quot;महान व्यक्ति&quot; योग वैदिक ज्योतिष में सर्वाधिक प्रसिद्ध हैं। प्रत्येक तब बनता है जब पाँच सत्य ग्रहों (मंगल, बुध, गुरु, शुक्र, शनि) में से एक अपनी स्वराशि या उच्च राशि में लग्न या चन्द्र से केन्द्र भाव (1, 4, 7 या 10वें) में हो। सूर्य और चन्द्रमा ज्योति होने से महापुरुष योग नहीं बनाते। राहु और केतु छाया ग्रह होने से भी बहिष्कृत हैं।</> : <>The five &quot;Great Person&quot; yogas are among the most celebrated in Vedic astrology. Each is formed when one of the five true planets (Mars, Mercury, Jupiter, Venus, Saturn) occupies its own sign or exaltation sign in a Kendra house (1st, 4th, 7th, or 10th) from the Lagna or Moon. The Sun and Moon, being luminaries, do not form Mahapurusha Yogas. Rahu and Ketu, being shadow planets, are also excluded.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पाँच योग' : 'The Five Yogas'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1. Ruchaka (Mars):</span> The Warrior. Mars in Aries, Scorpio, or Capricorn in a Kendra. Produces courageous leaders, military commanders, athletes, surgeons. Physical strength, fearlessness, and commanding presence.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">2. Bhadra (Mercury):</span> The Scholar. Mercury in Gemini or Virgo in a Kendra. Produces intellectuals, writers, orators, analysts. Sharp mind, eloquent speech, skill in mathematics and commerce.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">3. Hamsa (Jupiter):</span> The Sage. Jupiter in Sagittarius, Pisces, or Cancer in a Kendra. Produces spiritual leaders, teachers, judges, philanthropists. Wisdom, righteousness, and universal respect.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4. Malavya (Venus):</span> The Artist. Venus in Taurus, Libra, or Pisces in a Kendra. Produces artists, diplomats, luxury lovers. Refined aesthetic sense, charm, material comfort, and sensual enjoyment.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">5. Shasha (Saturn):</span> The Authority. Saturn in Capricorn, Aquarius, or Libra in a Kendra. Produces administrators, judges, leaders of organizations. Discipline, endurance, organizational ability, and earned authority through hard work.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'पूर्ण बल की शर्तें' : 'Conditions for Full Strength'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Mahapurusha Yoga reaches full strength when: (1) the planet is not combust (too close to the Sun), (2) it is not aspected by or conjoined with malefics that weaken it, (3) it is not in retrograde motion (debatable — some texts consider retrogrades strengthening), and (4) the dasha of the yoga-forming planet activates during the native&apos;s productive years. A technically present but weakened Mahapurusha Yoga may manifest partially — the promise exists but delivery is diminished.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Raja Yogas                                                */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'राज योग — राजकीय संयोग' : 'Raja Yogas — The Royal Combinations'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राज योग केन्द्र स्वामियों (1, 4, 7, 10) और त्रिकोण स्वामियों (1, 5, 9) के संयोग, परस्पर दृष्टि या राशि विनिमय (परिवर्तन) से बनते हैं। केन्द्र अभिव्यक्ति के स्तम्भ हैं — स्वयं, गृह, साझेदारी और करियर। त्रिकोण धर्म और भाग्य का प्रतिनिधि हैं — उद्देश्य, सृजनात्मकता और दैवी कृपा। जब ये दोनों शक्तियाँ अपने शासक ग्रहों के माध्यम से मिलती हैं, परिणाम सामान्य परिस्थितियों से ऊपर उठना होता है।</> : <>Raja Yogas are formed by the conjunction, mutual aspect, or sign exchange (Parivartana) of Kendra lords (1st, 4th, 7th, 10th) with Trikona lords (1st, 5th, 9th). Kendras represent the pillars of manifestation — self, home, partnerships, and career. Trikonas represent dharma and fortune — purpose, creativity, and divine grace. When these two forces unite through their ruling planets, the result is elevation beyond ordinary circumstances.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'प्रमुख राज योग संयोग' : 'Key Raja Yoga Combinations'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1st + 5th lords:</span> Self-expression through creativity and intelligence. Success in education, speculation, and leadership through wisdom.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">1st + 9th lords:</span> Personality aligned with fortune. The native is naturally lucky — opportunities seem to find them. Strong dharmic orientation.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4th + 5th lords:</span> Domestic happiness combined with intelligence. Success in education, property, and maternal blessings.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">4th + 9th lords:</span> Home and fortune unite. Inherited property, land wealth, academic success, and comfortable life supported by luck.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th + 5th lords:</span> Career success through intelligence. Professional recognition, creative career achievements, and leadership roles.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">10th + 9th lords (Dharma-Karma Adhipati):</span> The supreme Raja Yoga. Career becomes dharma. The native achieves great professional heights that serve a higher purpose. Kings, prime ministers, and spiritual leaders often have this yoga.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">7th + 9th lords:</span> Fortune through partnerships and marriage. Business partnerships that bring wealth, or marriage that elevates social status.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सक्रियण सिद्धान्त' : 'Activation Principle'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          A Raja Yoga remains a latent promise until the Mahadasha or Antardasha of one of the yoga-forming planets arrives. A person with a powerful 9th+10th lord Raja Yoga born during an unrelated dasha (say, Mercury) may live an ordinary life until Jupiter or Saturn dasha begins (if those are the 9th and 10th lords). This is why timing (dasha analysis) is inseparable from yoga analysis — the chart shows WHAT is possible, the dasha shows WHEN it manifests.
        </p>
      </section>
    </div>
  );
}

export default function Module13_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_12_3', phase: 3, topic: 'Transits', moduleNumber: '12.3',
  title: { en: 'Jupiter Transit & Rahu-Ketu Axis', hi: 'गुरु गोचर एवं राहु-केतु अक्ष' },
  subtitle: {
    en: 'Jupiter\'s annual sign change, the 18-month nodal cycle, and the double-transit theory for timing major life events',
    hi: 'गुरु का वार्षिक राशि परिवर्तन, 18-मासिक नोडल चक्र, और प्रमुख जीवन घटनाओं के समय निर्धारण हेतु दोहरे गोचर सिद्धान्त',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 12-1: Transits (Gochar)', hi: 'मॉड्यूल 12-1: गोचर' }, href: '/learn/modules/12-1' },
    { label: { en: 'Module 12-2: Sade Sati', hi: 'मॉड्यूल 12-2: साढ़े साती' }, href: '/learn/modules/12-2' },
    { label: { en: 'Transit Calendar', hi: 'गोचर पञ्चाङ्ग' }, href: '/transits' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q12_3_01', type: 'mcq',
    question: {
      en: 'How long does Jupiter approximately stay in one zodiac sign?',
      hi: 'गुरु लगभग कितने समय तक एक राशि में रहता है?',
    },
    options: [
      { en: 'About 1 month', hi: 'लगभग 1 मास' },
      { en: 'About 13 months', hi: 'लगभग 13 मास' },
      { en: 'About 2.5 years', hi: 'लगभग 2.5 वर्ष' },
      { en: 'About 7 years', hi: 'लगभग 7 वर्ष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter takes about 12 years to complete one zodiacal revolution, spending approximately 13 months (just over 1 year) in each sign. This makes Jupiter\'s sign change an annual event closely watched in Vedic astrology.',
      hi: 'गुरु एक पूर्ण राशिचक्र परिक्रमा में लगभग 12 वर्ष लेता है, प्रत्येक राशि में लगभग 13 मास (1 वर्ष से थोड़ा अधिक) रहता है। इसलिए गुरु का राशि परिवर्तन एक वार्षिक घटना है जिस पर वैदिक ज्योतिष में विशेष दृष्टि रहती है।',
    },
  },
  {
    id: 'q12_3_02', type: 'mcq',
    question: {
      en: 'Jupiter transiting trikona houses (1, 5, 9) from the Moon is considered:',
      hi: 'चन्द्रमा से त्रिकोण भावों (1, 5, 9) में गुरु गोचर माना जाता है:',
    },
    options: [
      { en: 'Highly auspicious', hi: 'अत्यन्त शुभ' },
      { en: 'Neutral', hi: 'तटस्थ' },
      { en: 'Challenging', hi: 'कठिन' },
      { en: 'Depends entirely on dasha', hi: 'पूर्णतः दशा पर निर्भर' },
    ],
    correctAnswer: 0,
    explanation: {
      en: 'Jupiter in trikona (1st, 5th, 9th) from Moon is considered highly auspicious. The 1st brings personal growth, the 5th enhances intelligence and creativity, and the 9th brings fortune, spiritual progress, and guru blessings.',
      hi: 'चन्द्र से त्रिकोण (1, 5, 9) में गुरु अत्यन्त शुभ माना जाता है। 1ले में व्यक्तिगत विकास, 5वें में बुद्धि और सृजनात्मकता वृद्धि, और 9वें में भाग्य, आध्यात्मिक प्रगति और गुरु कृपा आती है।',
    },
  },
  {
    id: 'q12_3_03', type: 'true_false',
    question: {
      en: 'Rahu and Ketu move in direct (forward) motion through the zodiac like other planets.',
      hi: 'राहु और केतु अन्य ग्रहों की भाँति राशिचक्र में सीधी (अग्र) गति से चलते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Rahu and Ketu always move in retrograde (reverse) motion through the zodiac. While other planets occasionally go retrograde, the lunar nodes are perpetually retrograde, moving from Aries toward Pisces (backward through the signs).',
      hi: 'असत्य। राहु और केतु सदैव वक्री (विपरीत) गति से राशिचक्र में चलते हैं। जबकि अन्य ग्रह कभी-कभी वक्री होते हैं, चन्द्र पात सदा वक्री हैं, मेष से मीन की ओर (राशियों में पीछे की ओर) चलते हैं।',
    },
  },
  {
    id: 'q12_3_04', type: 'mcq',
    question: {
      en: 'Rahu transiting which houses from Moon is generally favorable?',
      hi: 'चन्द्र से राहु का गोचर किन भावों में सामान्यतः शुभ होता है?',
    },
    options: [
      { en: '2, 5, 7, 9', hi: '2, 5, 7, 9' },
      { en: '3, 6, 10, 11', hi: '3, 6, 10, 11' },
      { en: '1, 4, 8, 12', hi: '1, 4, 8, 12' },
      { en: 'No house is favorable', hi: 'कोई भाव शुभ नहीं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Rahu in the 3rd gives courage and adventure, 6th conquers enemies, 10th brings career rise and fame, 11th brings large gains and fulfillment. Rahu in the 1st is also considered favorable by some texts, giving personal magnetism.',
      hi: '3वें में राहु साहस और रोमांच देता है, 6वें में शत्रु पराजय, 10वें में करियर उन्नति और प्रसिद्धि, 11वें में बड़ा लाभ और इच्छापूर्ति। 1ले में राहु को कुछ ग्रन्थ शुभ मानते हैं, व्यक्तिगत आकर्षण देता है।',
    },
  },
  {
    id: 'q12_3_05', type: 'mcq',
    question: {
      en: 'What is the "Double Transit" (Dwigraha Gochar) theory?',
      hi: '"दोहरा गोचर" (द्विग्रह गोचर) सिद्धान्त क्या है?',
    },
    options: [
      { en: 'Two planets in the same sign', hi: 'दो ग्रह एक ही राशि में' },
      { en: 'Both Jupiter and Saturn must aspect a house for its significations to manifest', hi: 'किसी भाव के फल प्रकट होने के लिए गुरु और शनि दोनों को उस भाव को दृष्टि करनी चाहिए' },
      { en: 'Sun and Moon in opposition', hi: 'सूर्य और चन्द्रमा विपरीत में' },
      { en: 'Rahu and Ketu in the same axis', hi: 'राहु और केतु एक ही अक्ष में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Double Transit theory states that for a house\'s significations to fructify, BOTH Jupiter AND Saturn must simultaneously aspect or occupy that house (from Moon or Lagna). For example, marriage occurs when both planets influence the 7th house.',
      hi: 'दोहरा गोचर सिद्धान्त कहता है कि किसी भाव के फल प्रकट होने के लिए गुरु और शनि दोनों को एक साथ उस भाव (चन्द्र या लग्न से) को दृष्टि या अधिवास करना चाहिए। उदाहरणार्थ, विवाह तब होता है जब दोनों ग्रह 7वें भाव को प्रभावित करते हैं।',
    },
  },
  {
    id: 'q12_3_06', type: 'true_false',
    question: {
      en: 'Jupiter aspects the 5th, 7th, and 9th houses from its transit position (in addition to the house it occupies).',
      hi: 'गुरु अपनी गोचर स्थिति से 5वें, 7वें और 9वें भाव को दृष्टि करता है (जिस भाव में बैठा है उसके अतिरिक्त)।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Jupiter has special aspects (Vishesh Drishti) on the 5th, 7th, and 9th houses from its position. This means Jupiter\'s transit activates not just the house it occupies but three additional houses — greatly expanding its influence.',
      hi: 'सत्य। गुरु की अपनी स्थिति से 5वें, 7वें और 9वें भाव पर विशेष दृष्टि (विशेष दृष्टि) होती है। इसका अर्थ है गुरु का गोचर न केवल उस भाव को सक्रिय करता है जिसमें वह बैठा है, बल्कि तीन अतिरिक्त भावों को भी — जिससे उसका प्रभाव बहुत बढ़ जाता है।',
    },
  },
  {
    id: 'q12_3_07', type: 'mcq',
    question: {
      en: 'The Rahu-Ketu transit cycle through the complete zodiac takes approximately:',
      hi: 'पूर्ण राशिचक्र में राहु-केतु गोचर चक्र लगभग कितना समय लेता है?',
    },
    options: [
      { en: '7 years', hi: '7 वर्ष' },
      { en: '12 years', hi: '12 वर्ष' },
      { en: '18 years', hi: '18 वर्ष' },
      { en: '29 years', hi: '29 वर्ष' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Rahu and Ketu take approximately 18 years to transit all 12 signs (about 1.5 years per sign). This 18-year cycle is closely connected to eclipse cycles — every 18 years, eclipses repeat in similar zodiacal positions.',
      hi: 'राहु और केतु सभी 12 राशियों का गोचर लगभग 18 वर्षों में करते हैं (प्रत्येक राशि में लगभग 1.5 वर्ष)। यह 18-वर्षीय चक्र ग्रहण चक्रों से घनिष्ठ रूप से जुड़ा है — प्रत्येक 18 वर्ष में ग्रहण समान राशिचक्र स्थितियों में दोहराते हैं।',
    },
  },
  {
    id: 'q12_3_08', type: 'mcq',
    question: {
      en: 'Ketu transiting over natal Rahu (or vice versa) is called:',
      hi: 'केतु का जन्मकालिक राहु पर गोचर (या इसके विपरीत) कहलाता है:',
    },
    options: [
      { en: 'Grahan Yoga', hi: 'ग्रहण योग' },
      { en: 'Karmic activation of the nodal axis', hi: 'नोडल अक्ष की कार्मिक सक्रियता' },
      { en: 'Guru Chandal', hi: 'गुरु चाण्डाल' },
      { en: 'Shrapit Dosha', hi: 'शापित दोष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When transiting Rahu/Ketu crosses over the natal Ketu/Rahu position, it activates the karmic axis of the birth chart. This brings past-life themes to the surface — unresolved karma demands attention, often through sudden events or encounters.',
      hi: 'जब गोचरी राहु/केतु जन्मकालिक केतु/राहु स्थिति पर आता है, तो जन्म कुण्डली का कार्मिक अक्ष सक्रिय होता है। इससे पूर्वजन्म विषय सतह पर आते हैं — अनसुलझा कर्म अचानक घटनाओं या मिलनों के माध्यम से ध्यान माँगता है।',
    },
  },
  {
    id: 'q12_3_09', type: 'true_false',
    question: {
      en: 'Eclipse seasons occur when the transiting Sun and Moon are near the Rahu-Ketu axis.',
      hi: 'ग्रहण काल तब आता है जब गोचरी सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट होते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Solar and lunar eclipses occur when the Sun and Moon align near the Rahu-Ketu axis (the lunar nodes). This happens roughly twice a year. In Jyotish, eclipse periods are considered karmically charged — events during eclipse seasons have amplified consequences.',
      hi: 'सत्य। सूर्य और चन्द्र ग्रहण तब होते हैं जब सूर्य और चन्द्रमा राहु-केतु अक्ष (चन्द्र पात) के निकट संरेखित होते हैं। यह वर्ष में लगभग दो बार होता है। ज्योतिष में ग्रहण काल कार्मिक रूप से आवेशित माना जाता है — ग्रहण काल की घटनाओं के परिणाम प्रवर्धित होते हैं।',
    },
  },
  {
    id: 'q12_3_10', type: 'mcq',
    question: {
      en: 'For marriage to manifest according to double-transit theory, Jupiter and Saturn must both influence:',
      hi: 'दोहरे गोचर सिद्धान्त के अनुसार विवाह प्रकट होने के लिए गुरु और शनि दोनों को किसे प्रभावित करना चाहिए?',
    },
    options: [
      { en: 'The 5th house', hi: '5वाँ भाव' },
      { en: 'The 10th house', hi: '10वाँ भाव' },
      { en: 'The 7th house', hi: '7वाँ भाव' },
      { en: 'The 2nd house only', hi: 'केवल 2रा भाव' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The 7th house is the house of marriage and partnerships. Both Jupiter and Saturn must aspect or occupy the 7th house (from Moon or Lagna) simultaneously for marriage to be timed. This can include direct occupation or special aspects.',
      hi: '7वाँ भाव विवाह और साझेदारी का भाव है। विवाह का समय निर्धारित होने के लिए गुरु और शनि दोनों को एक साथ 7वें भाव (चन्द्र या लग्न से) पर दृष्टि या अधिवास करना चाहिए। इसमें प्रत्यक्ष अधिवास या विशेष दृष्टि सम्मिलित है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — Jupiter Transit                                           */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'गुरु गोचर' : 'Jupiter Transit'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>गुरु (बृहस्पति) वैदिक ज्योतिष में सबसे बड़ा नैसर्गिक शुभ ग्रह है। राशिचक्र में इसका गोचर — लगभग प्रत्येक 13 मास में राशि परिवर्तन — सर्वाधिक महत्वपूर्ण वार्षिक ज्योतिषीय घटनाओं में से एक है। गुरु जो भी छूता है उसे विस्तारित करता है: धन, ज्ञान, आध्यात्मिकता, सम्बन्ध या सन्तान। इसका राशि परिवर्तन प्रायः आपके जीवन के प्रमुख विषय में दृश्य बदलाव से सहसम्बद्ध होता है।</> : <>Jupiter (Guru/Brihaspati) is the greatest natural benefic in Vedic astrology. Its transit through the zodiac — changing signs approximately every 13 months — is one of the most significant annual astrological events. Jupiter expands whatever it touches: wealth, knowledge, spirituality, relationships, or children. Its sign change often correlates with a visible shift in the dominant theme of your life.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'चन्द्र से गोचर फल' : 'Transit Results from Moon'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Highly Auspicious — Trikona (1, 5, 9):</span> Jupiter in the 1st brings personal growth, optimism, and new beginnings. In the 5th, it enhances intelligence, creativity, romance, and children&apos;s well-being. In the 9th, it brings fortune, dharma, long-distance travel, guru blessings, and spiritual elevation. These are Jupiter&apos;s most powerful positions.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Good — Wealth Houses (2, 7, 11):</span> Jupiter in the 2nd brings financial improvement and family harmony. In the 7th, it supports marriage, partnerships, and business deals. In the 11th, it brings income, social connections, and fulfillment of long-held desires.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (3, 4, 6, 8, 10, 12):</span> Jupiter in these houses brings comparatively muted results. However, Jupiter is a natural benefic — even in unfavorable houses, it rarely causes severe harm. It may slow progress or create lethargy rather than active damage.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'गुरु की विशेष दृष्टि' : 'Jupiter&apos;s Special Aspects'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          Unlike other planets that only aspect the 7th house from their position, Jupiter has special aspects (Vishesh Drishti) on the 5th, 7th, and 9th houses from where it sits. This means Jupiter activates 4 houses simultaneously during transit — the house it occupies plus three aspected houses. This quadruple activation is why Jupiter transits are so impactful. For example, Jupiter in the 3rd from Moon (not ideal by transit rules) still aspects the 7th (marriage), 9th (fortune), and 11th (gains) — providing beneficial influence to those areas.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Rahu-Ketu Transit                                        */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'राहु-केतु गोचर' : 'Rahu-Ketu Transit'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>राहु (उत्तर पात) और केतु (दक्षिण पात) छाया ग्रह हैं — गणितीय बिन्दु जहाँ चन्द्रमा का कक्षा तल क्रान्तिवृत्त को काटता है। ये सदैव वक्री गति (राशिचक्र में पीछे की ओर) से गोचर करते हैं, प्रत्येक राशि में लगभग 18 मास रहते हैं और पूर्ण चक्र लगभग 18 वर्षों में पूरा करते हैं। इनका गोचर अद्वितीय रूप से कार्मिक है — ये प्रभावित भावों में इच्छाएँ (राहु) और विमोचन (केतु) जगाते हैं।</> : <>Rahu (North Node) and Ketu (South Node) are the shadow planets — mathematical points where the Moon&apos;s orbital plane intersects the ecliptic. They always transit in retrograde motion (backward through the zodiac), spending approximately 18 months in each sign and completing a full cycle in about 18 years. Their transits are uniquely karmic — they stir desires (Rahu) and trigger release (Ketu) in the houses they affect.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'राहु गोचर फल' : 'Rahu Transit Results'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">शुभ (चन्द्र से 1, 3, 6, 10, 11):</span> 1ले में राहु व्यक्तिगत आकर्षण और महत्वाकांक्षा देता है। 3वें में साहस, रोमांच और मीडिया/संचार में सफलता। 6वें में शत्रुओं और रोग पर विजय। 10वें में करियर उन्नति और सार्वजनिक मान्यता। 11वें में बड़ा आर्थिक लाभ और प्रभावशाली सम्पर्क।</> : <><span className="text-emerald-400 font-medium">Favorable (1, 3, 6, 10, 11 from Moon):</span> Rahu in the 1st gives personal magnetism and ambition. In the 3rd, it brings courage, adventure, and success in media/communication. In the 6th, it gives victory over enemies and disease. In the 10th, career rise and public recognition. In the 11th, large financial gains and powerful connections.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (2, 4, 5, 7, 8, 9, 12):</span> Rahu in these houses creates confusion, obsessive desires, and sudden disruptions. Rahu in the 8th is especially intense — bringing sudden transformations, hidden dangers, or occult experiences. Rahu in the 7th can create relationship turbulence and attraction to unconventional partners.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्मिक सक्रियता' : 'Karmic Activation'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">नोडल वापसी (~18 वर्ष):</span> जब गोचरी राहु अपनी जन्मकालिक स्थिति पर लौटता है (और केतु अपनी पर), एक प्रमुख कार्मिक चक्र पूर्ण होता है। यह लगभग 18-19, 36-37, 54-55 और 72-73 वर्ष की आयु में होता है। ये निर्णायक वर्ष हैं जब जीवन दिशा नाटकीय रूप से बदलती है।</> : <><span className="text-gold-light font-medium">Nodal Return (~18 years):</span> When transiting Rahu returns to its natal position (and Ketu to its natal position), a major karmic cycle completes. This happens around ages 18-19, 36-37, 54-55, and 72-73. These are pivotal years when life direction shifts dramatically — the universe recalibrates your karmic trajectory.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Eclipse Seasons:</span> When the transiting Sun and Moon come near the Rahu-Ketu axis, solar and lunar eclipses occur. These 2-3 week windows (happening twice yearly) are karmically charged — initiations, endings, and fateful encounters cluster around eclipses. In Jyotish, no auspicious work is begun during eclipse periods.
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Double Transit Theory                                     */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'दोहरा गोचर सिद्धान्त' : 'Double Transit Theory'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>दोहरा गोचर (द्विग्रह गोचर) सिद्धान्त वैदिक ज्योतिष की सर्वाधिक विश्वसनीय समय निर्धारण तकनीकों में से एक है। यह कहता है कि किसी भाव के फल वास्तविक जीवन में प्रकट होने के लिए, गुरु और शनि दोनों को एक साथ उस भाव को प्रभावित (दृष्टि या अधिवास द्वारा) करना चाहिए — चाहे चन्द्र राशि से गिना जाए या लग्न से। यह सिद्धान्त सुन्दर ढंग से दो सबसे धीमे दृश्य ग्रहों को जोड़ता है जिनका संयुक्त प्रभाव ब्रह्माण्डीय समय की सहमति दर्शाता है।</> : <>The Double Transit (Dwigraha Gochar) theory is one of the most reliable timing techniques in Vedic astrology. It states that for any house&apos;s significations to manifest in real life, BOTH Jupiter AND Saturn must simultaneously influence (by aspect or occupation) that house — whether counted from the Moon sign or from the Lagna. This theory elegantly combines the two slowest visible planets whose combined influence represents the consensus of cosmic timing.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'यह कैसे काम करता है' : 'How It Works'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1:</span> Identify which house&apos;s signification you want to time (e.g., 7th house for marriage, 10th for career rise, 5th for children). Check if the natal chart promises this event (yogas, dasha period supporting it).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2:</span> Check Jupiter&apos;s current transit — which houses does it aspect or occupy from Moon/Lagna? Remember Jupiter aspects the 5th, 7th, and 9th from its position, plus the house it occupies.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 3:</span> Check Saturn&apos;s current transit — which houses does it aspect or occupy from Moon/Lagna? Saturn aspects the 3rd, 7th, and 10th from its position, plus the house it occupies.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Step 4:</span> If both Jupiter and Saturn simultaneously influence the target house, the event&apos;s timing window is open. Within this window, the exact date is often triggered by a fast planet (Sun, Moon, or Mars) activating the same point.
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'उदाहरण — विवाह समय' : 'Worked Example — Marriage Timing'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>एक जातक पर विचार करें जिसका चन्द्रमा मेष में है। विवाह के लिए हमें गुरु और शनि दोनों को 7वें भाव (तुला) को प्रभावित करने की आवश्यकता है। मिथुन में गुरु अपनी 5वीं दृष्टि से तुला को देखता है। कुम्भ में शनि अपनी 10वीं दृष्टि (शनि की विशेष दृष्टि) से तुला को देखता है। चूँकि दोनों ग्रह एक साथ 7वें भाव को प्रभावित करते हैं, यह काल विवाह की सम्भावना खोलता है — बशर्ते दशा भी समर्थन करे।</> : <>Consider a native with Moon in Aries (Mesha). For marriage, we need Jupiter and Saturn to both influence the 7th house (Libra/Tula) from Moon. Jupiter in Gemini (Mithuna) aspects Libra with its 5th aspect. Saturn in Aquarius (Kumbha) aspects Libra with its 10th aspect (Saturn&apos;s special Vishesh Drishti). Since both planets simultaneously influence the 7th house, this period opens a marriage window — provided the dasha also supports it.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'महत्वपूर्ण सावधानी' : 'Important Caveat'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          The double transit opens a window of possibility, but the natal chart must promise the event (through appropriate yogas), and the dasha period must support it. All three layers — natal promise, dasha activation, and transit timing — must align for a significant event to occur. This is the &quot;triple condition&quot; of Vedic prediction: promise (chart) + activation (dasha) + timing (transit) = event manifestation.
        </p>
      </section>
    </div>
  );
}

export default function Module12_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

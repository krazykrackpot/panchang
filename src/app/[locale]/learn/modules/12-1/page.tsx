'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_12_1', phase: 3, topic: 'Transits', moduleNumber: '12.1',
  title: { en: 'Transits (Gochar) — Planets in Motion', hi: 'गोचर — गतिमान ग्रह' },
  subtitle: {
    en: 'How current planetary positions overlay the birth chart, creating evolving life themes through slow and fast planet transits',
    hi: 'वर्तमान ग्रह स्थितियाँ जन्म कुण्डली पर कैसे आच्छादित होती हैं, धीमे और तीव्र ग्रह गोचर से जीवन विषय कैसे बनते हैं',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 12-2: Sade Sati', hi: 'मॉड्यूल 12-2: साढ़े साती' }, href: '/learn/modules/12-2' },
    { label: { en: 'Module 12-3: Jupiter & Rahu-Ketu Transit', hi: 'मॉड्यूल 12-3: गुरु एवं राहु-केतु गोचर' }, href: '/learn/modules/12-3' },
    { label: { en: 'Transit Calendar', hi: 'गोचर पञ्चाङ्ग' }, href: '/transits' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q12_1_01', type: 'mcq',
    question: {
      en: 'How long does Saturn approximately stay in one zodiac sign?',
      hi: 'शनि लगभग कितने समय तक एक राशि में रहता है?',
    },
    options: [
      { en: 'About 1 month', hi: 'लगभग 1 मास' },
      { en: 'About 2.5 years', hi: 'लगभग 2.5 वर्ष' },
      { en: 'About 12 years', hi: 'लगभग 12 वर्ष' },
      { en: 'About 18 months', hi: 'लगभग 18 मास' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn takes approximately 29.5 years to complete one zodiacal revolution, spending about 2.5 years in each of the 12 signs. This slow pace is why Saturn transits create long-lasting life themes.',
      hi: 'शनि एक पूर्ण राशिचक्र परिक्रमा में लगभग 29.5 वर्ष लेता है, प्रत्येक 12 राशियों में लगभग 2.5 वर्ष रहता है। इसी धीमी गति के कारण शनि गोचर दीर्घकालिक जीवन विषय निर्मित करता है।',
    },
  },
  {
    id: 'q12_1_02', type: 'true_false',
    question: {
      en: 'In Vedic astrology, transits are primarily read from the Sun sign (Surya Lagna).',
      hi: 'वैदिक ज्योतिष में गोचर मुख्यतः सूर्य राशि (सूर्य लग्न) से पढ़ा जाता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. In Vedic astrology, transits are primarily read from the Moon sign (Chandra Lagna), not the Sun sign. The Moon represents the mind and emotional landscape, making it the natural reference point for experiencing transit effects.',
      hi: 'असत्य। वैदिक ज्योतिष में गोचर मुख्यतः चन्द्र राशि (चन्द्र लग्न) से पढ़ा जाता है, सूर्य राशि से नहीं। चन्द्रमा मन और भावनात्मक संसार का प्रतिनिधि है, इसलिए गोचर फल अनुभव करने का स्वाभाविक सन्दर्भ बिन्दु है।',
    },
  },
  {
    id: 'q12_1_03', type: 'mcq',
    question: {
      en: 'Which planets are considered "slow" (Manda Graha) and create major life themes?',
      hi: 'कौन-से ग्रह "मन्द ग्रह" माने जाते हैं और प्रमुख जीवन विषय निर्मित करते हैं?',
    },
    options: [
      { en: 'Sun, Moon, Mercury', hi: 'सूर्य, चन्द्र, बुध' },
      { en: 'Saturn, Jupiter, Rahu/Ketu', hi: 'शनि, गुरु, राहु/केतु' },
      { en: 'Mars, Venus, Mercury', hi: 'मंगल, शुक्र, बुध' },
      { en: 'Only Saturn', hi: 'केवल शनि' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn (~2.5 years/sign), Jupiter (~1 year/sign), and Rahu-Ketu (~1.5 years/sign) are slow-moving planets. Their transits define the major themes and turning points of life due to their prolonged influence on each house.',
      hi: 'शनि (~2.5 वर्ष/राशि), गुरु (~1 वर्ष/राशि) और राहु-केतु (~1.5 वर्ष/राशि) मन्दगति ग्रह हैं। प्रत्येक भाव पर दीर्घकालिक प्रभाव के कारण इनके गोचर जीवन के प्रमुख विषय और मोड़ निर्धारित करते हैं।',
    },
  },
  {
    id: 'q12_1_04', type: 'mcq',
    question: {
      en: 'Jupiter transiting in which houses from the Moon sign is considered favorable?',
      hi: 'चन्द्र राशि से गुरु का गोचर किन भावों में शुभ माना जाता है?',
    },
    options: [
      { en: '1, 3, 6, 8', hi: '1, 3, 6, 8' },
      { en: '2, 5, 7, 9, 11', hi: '2, 5, 7, 9, 11' },
      { en: '4, 6, 10, 12', hi: '4, 6, 10, 12' },
      { en: '3, 6, 11 only', hi: 'केवल 3, 6, 11' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Jupiter transiting in the 2nd, 5th, 7th, 9th, and 11th houses from the natal Moon is considered favorable. These positions support wealth, intelligence, relationships, fortune, and gains respectively.',
      hi: 'जन्म चन्द्रमा से 2, 5, 7, 9 और 11वें भाव में गुरु गोचर शुभ माना जाता है। ये स्थान क्रमशः धन, बुद्धि, सम्बन्ध, भाग्य और लाभ का समर्थन करते हैं।',
    },
  },
  {
    id: 'q12_1_05', type: 'true_false',
    question: {
      en: 'Fast-moving planets like the Sun and Moon have negligible effects in transit analysis.',
      hi: 'सूर्य और चन्द्रमा जैसे तीव्र गति ग्रहों का गोचर विश्लेषण में नगण्य प्रभाव होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. While fast planets create shorter-duration effects, they act as triggers for events promised by slow planet transits. The Sun (1 month/sign) and Moon (2.25 days/sign) often pinpoint the exact day an event fructifies.',
      hi: 'असत्य। तीव्र ग्रह अल्पकालिक प्रभाव देते हैं, परन्तु मन्द ग्रह गोचर द्वारा प्रतिश्रुत घटनाओं के लिए ट्रिगर का कार्य करते हैं। सूर्य (1 मास/राशि) और चन्द्रमा (2.25 दिन/राशि) प्रायः घटना के सटीक दिन को इंगित करते हैं।',
    },
  },
  {
    id: 'q12_1_06', type: 'mcq',
    question: {
      en: 'In the Ashtakavarga system, a sign with how many bindus is considered favorable for transit?',
      hi: 'अष्टकवर्ग पद्धति में कितने बिन्दु वाली राशि गोचर के लिए शुभ मानी जाती है?',
    },
    options: [
      { en: '1 or more', hi: '1 या अधिक' },
      { en: '4 or more', hi: '4 या अधिक' },
      { en: '8 or more', hi: '8 या अधिक' },
      { en: 'Exactly 7', hi: 'ठीक 7' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'In Ashtakavarga, each planet receives bindus (benefic points) from 8 sources (7 planets + Lagna). A sign with 4 or more bindus (out of 8 maximum) is considered favorable for that planet\'s transit through it.',
      hi: 'अष्टकवर्ग में प्रत्येक ग्रह को 8 स्रोतों (7 ग्रह + लग्न) से बिन्दु (शुभ अंक) प्राप्त होते हैं। 4 या अधिक बिन्दु (अधिकतम 8 में से) वाली राशि उस ग्रह के गोचर के लिए शुभ मानी जाती है।',
    },
  },
  {
    id: 'q12_1_07', type: 'mcq',
    question: {
      en: 'What is Sarvashtakavarga (SAV)?',
      hi: 'सर्वाष्टकवर्ग (SAV) क्या है?',
    },
    options: [
      { en: 'A type of dasha system', hi: 'एक प्रकार की दशा पद्धति' },
      { en: 'The total bindus of all 7 planets combined for each sign', hi: 'प्रत्येक राशि के लिए सभी 7 ग्रहों के कुल बिन्दुओं का योग' },
      { en: 'The number of yogas in a chart', hi: 'कुण्डली में योगों की संख्या' },
      { en: 'A nakshatra classification', hi: 'एक नक्षत्र वर्गीकरण' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sarvashtakavarga is the combined total of all 7 planets\' individual Ashtakavarga bindus for each sign. A sign with 28 or more SAV points (out of 56 maximum) is generally considered auspicious.',
      hi: 'सर्वाष्टकवर्ग प्रत्येक राशि के लिए सभी 7 ग्रहों के व्यक्तिगत अष्टकवर्ग बिन्दुओं का संयुक्त योग है। 28 या अधिक SAV अंक (अधिकतम 56 में से) वाली राशि सामान्यतः शुभ मानी जाती है।',
    },
  },
  {
    id: 'q12_1_08', type: 'true_false',
    question: {
      en: 'Saturn transiting houses 1, 2, 4, 5, 7, 8, 10, and 12 from the Moon is generally considered challenging.',
      hi: 'चन्द्रमा से 1, 2, 4, 5, 7, 8, 10 और 12वें भाव में शनि गोचर सामान्यतः कठिन माना जाता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Saturn is favorable only in the 3rd, 6th, and 11th from Moon (upachaya houses). In all other houses (1,2,4,5,7,8,10,12), Saturn\'s transit tends to bring challenges, delays, and karmic lessons.',
      hi: 'सत्य। शनि केवल चन्द्रमा से 3, 6 और 11वें भाव (उपचय भाव) में शुभ होता है। अन्य सभी भावों (1,2,4,5,7,8,10,12) में शनि गोचर चुनौतियाँ, विलम्ब और कर्म-शिक्षा लाता है।',
    },
  },
  {
    id: 'q12_1_09', type: 'mcq',
    question: {
      en: 'Mars transits one sign in approximately:',
      hi: 'मंगल एक राशि में लगभग कितने समय रहता है?',
    },
    options: [
      { en: '1 week', hi: '1 सप्ताह' },
      { en: '45 days', hi: '45 दिन' },
      { en: '6 months', hi: '6 मास' },
      { en: '1 year', hi: '1 वर्ष' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Mars takes about 1.5 to 2 months (roughly 45 days) per sign normally, completing one full zodiacal round in about 18 months. During retrograde periods, Mars can stay in one sign for up to 6 months.',
      hi: 'मंगल सामान्यतः प्रत्येक राशि में लगभग 1.5 से 2 मास (करीब 45 दिन) रहता है, लगभग 18 मासों में एक पूर्ण राशिचक्र पूरा करता है। वक्री काल में मंगल एक राशि में 6 मास तक रह सकता है।',
    },
  },
  {
    id: 'q12_1_10', type: 'true_false',
    question: {
      en: 'Ashtakavarga analysis can override the general favorable/unfavorable classification of a transit.',
      hi: 'अष्टकवर्ग विश्लेषण गोचर के सामान्य शुभ/अशुभ वर्गीकरण को परिवर्तित कर सकता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. A generally unfavorable transit (e.g., Saturn in 8th from Moon) can be mitigated if the sign has high Ashtakavarga bindus. Conversely, a favorable transit in a low-bindu sign may not deliver expected results. Ashtakavarga fine-tunes predictions.',
      hi: 'सत्य। सामान्यतः अशुभ गोचर (जैसे चन्द्र से 8वें में शनि) यदि उस राशि में अष्टकवर्ग बिन्दु अधिक हों तो शमित हो सकता है। इसके विपरीत, कम बिन्दु वाली राशि में शुभ गोचर भी अपेक्षित फल नहीं दे सकता। अष्टकवर्ग भविष्यवाणी को सूक्ष्म करता है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — What Are Transits?                                        */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'गोचर क्या है?' : 'What Are Transits?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>गोचर का अर्थ है ग्रहों की वर्तमान, वास्तविक समय की स्थिति जो राशिचक्र में गतिमान रहती है और जन्म कुण्डली पर आरोपित होती है। जन्म कुण्डली जन्म क्षण के आकाश का स्थिर चित्र है, जबकि गोचर निरन्तर बदलता आकाशीय वातावरण है जो आपकी कुण्डली के विभिन्न भागों को विभिन्न समय पर सक्रिय करता है। जन्मकालिक और गोचरी ग्रहों की परस्पर क्रिया वैदिक फलित ज्योतिष का प्रमुख यन्त्र है।</> : <>Transits (Gochar) refer to the current, real-time positions of planets as they move through the zodiac, overlaid on your natal birth chart. While the birth chart is a frozen snapshot of the sky at the moment of birth, transits represent the ever-changing celestial weather that activates different parts of your chart at different times. The interaction between natal positions and transiting planets is the primary engine of Vedic predictive astrology.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'मन्द ग्रह — प्रमुख जीवन विषय' : 'Slow Planets — Major Life Themes'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>मन्द ग्रह आपकी जीवन कथा के व्यापक अध्याय निर्धारित करते हैं। शनि प्रत्येक राशि में लगभग 2.5 वर्ष रहता है, जिस भाव में गोचर करता है वहाँ अनुशासन, पुनर्गठन और कर्म-हिसाब का दीर्घकाल बनाता है। गुरु लगभग 13 मास में एक राशि से गुजरता है, विस्तार, अवसर और ज्ञान लाता है। राहु और केतु प्रत्येक राशि में लगभग 18 मास रहते हैं, गहन इच्छाओं और कार्मिक मुक्ति को जगाते हैं।</> : <>The slow-moving planets define the broad chapters of your life story. Saturn spends approximately 2.5 years in each sign, creating extended periods of discipline, restructuring, and karmic reckoning in the house it transits. Jupiter moves through a sign in about 13 months, bringing expansion, opportunity, and wisdom. Rahu and Ketu (the lunar nodes) transit each sign for roughly 18 months, stirring deep desires and karmic release.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-purple-500/15">
        <h4 className="text-purple-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'तीव्र ग्रह — घटना प्रेरक' : 'Fast Planets — Event Triggers'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">{isHi ? <>तीव्र ग्रह ट्रिगर का कार्य करते हैं जो मन्द ग्रह गोचर द्वारा प्रतिश्रुत घटनाओं के सटीक प्रकटीकरण का समय निर्धारित करते हैं। सूर्य लगभग 1 मास में एक राशि पार करता है, चन्द्रमा लगभग 2.25 दिन में, बुध 25 दिन से 2 मास में (वक्री के अनुसार), शुक्र लगभग 1 मास में और मंगल लगभग 45 दिन में। जब अनेक तीव्र ग्रह एक साथ किसी संवेदनशील बिन्दु को सक्रिय करते हैं जो पहले से मन्द ग्रह द्वारा उत्तेजित है, तब घटनाएँ साकार होती हैं।</> : <>Fast-moving planets act as triggers that time the exact manifestation of events promised by slow-planet transits. The Sun transits a sign in about 1 month, the Moon in about 2.25 days, Mercury in 25 days to 2 months (varying with retrograde), Venus in about 1 month, and Mars in about 45 days. When multiple fast planets simultaneously activate a sensitive point already stimulated by a slow planet, events crystallize.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — Transit from Moon Sign                                    */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'चन्द्र राशि से गोचर' : 'Transit from Moon Sign'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>वैदिक ज्योतिष में चन्द्र राशि (जन्म राशि) गोचर मूल्यांकन का प्राथमिक सन्दर्भ बिन्दु है, पश्चिमी ज्योतिष के विपरीत जो सूर्य राशि का उपयोग करता है। चन्द्रमा मन (मनस), भावनात्मक अनुभव और उस व्यक्तिपरक दृष्टि का प्रतिनिधि है जिससे हम जीवन की घटनाओं को देखते हैं। चूँकि गोचर फल मूलतः बदलती परिस्थितियों के अनुभव के बारे में है, चन्द्र लग्न स्वाभाविक आधार है।</> : <>In Vedic astrology, the Moon sign (Janma Rashi) is the primary reference point for evaluating transits, unlike Western astrology which uses the Sun sign. The Moon represents the mind (Manas), emotional experience, and the subjective lens through which we perceive life events. Since transit effects are fundamentally about how we experience changing circumstances, Chandra Lagna is the natural anchor.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'गुरु गोचर फल' : 'Jupiter Transit Results'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">शुभ (चन्द्र से 2, 5, 7, 9, 11):</span> 2वें में गुरु धन और पारिवारिक सामंजस्य लाता है; 5वें में बुद्धि, सन्तान और पुण्य; 7वें में विवाह और साझेदारी; 9वें में भाग्य, धर्म और गुरु कृपा; 11वें में लाभ, इच्छापूर्ति और सामाजिक सफलता।</> : <><span className="text-gold-light font-medium">Favorable (2, 5, 7, 9, 11 from Moon):</span> Jupiter in the 2nd brings wealth and family harmony; in the 5th, intelligence, children, and spiritual merit; in the 7th, marriage and partnerships; in the 9th, fortune, dharma, and guru blessings; in the 11th, gains, fulfillment of desires, and social success.</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-red-400 font-medium">Challenging (1, 3, 4, 6, 8, 10, 12):</span> Jupiter in these houses brings comparatively muted results — expenses, obstacles, or slow progress. However, Jupiter being a natural benefic rarely causes severe harm even in unfavorable positions.
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'शनि गोचर फल' : 'Saturn Transit Results'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-emerald-400 font-medium">शुभ (चन्द्र से 3, 6, 11):</span> 3वें में शनि साहस और प्रतिद्वन्द्वियों पर विजय देता है; 6वें में शत्रु पराजय और स्वास्थ्य सुधार; 11वें में आर्थिक लाभ और दीर्घकालिक लक्ष्यों की प्राप्ति। चन्द्रमा से ये शनि की एकमात्र सुखद स्थितियाँ हैं।</> : <><span className="text-emerald-400 font-medium">Favorable (3, 6, 11 from Moon):</span> Saturn in the 3rd gives courage and victory over rivals; in the 6th, defeat of enemies and improved health; in the 11th, financial gains and achievement of long-term goals. These are Saturn&apos;s only comfortable positions from the Moon.</>}</p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Ashtakavarga System                                       */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अष्टकवर्ग पद्धति' : 'Ashtakavarga System'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>अष्टकवर्ग पद्धति गोचर भविष्यवाणी को सूक्ष्म बनाने का सर्वाधिक शक्तिशाली उपकरण है। 7 ग्रहों (सूर्य से शनि तक) में प्रत्येक को 12 राशियों में 8 स्रोतों से शुभ बिन्दु प्राप्त होते हैं: 7 ग्रह और लग्न। किसी राशि में ग्रह को अधिकतम 8 बिन्दु मिल सकते हैं। यदि ग्रह को किसी राशि में 4 या अधिक बिन्दु हों, तो उस राशि में उसका गोचर शुभ रहता है; 0-3 बिन्दु हों तो गोचर कठिन रहने की सम्भावना है।</> : <>The Ashtakavarga system is one of the most powerful tools for refining transit predictions. Each of the 7 planets (Sun through Saturn) receives benefic points (bindus) in each of the 12 signs from 8 sources: the 7 planets plus the Lagna. The maximum bindus a planet can receive in any sign is 8. If a planet has 4 or more bindus in a sign, its transit through that sign tends to be favorable; with 0-3 bindus, the transit is likely challenging.</>}</p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सर्वाष्टकवर्ग' : 'Sarvashtakavarga (SAV)'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">कुल अंक:</span> सर्वाष्टकवर्ग सभी 7 ग्रहों के व्यक्तिगत अष्टकवर्ग को एक सारांश में जोड़ता है। प्रत्येक राशि को 56 में से कुल अंक मिलता है (7 ग्रह x अधिकतम 8 बिन्दु)। 28 या अधिक SAV अंक वाली राशियाँ सामान्यतः शुभ हैं — इन राशियों से गोचर करने वाले ग्रह सामान्य गोचर नियम की परवाह किए बिना बेहतर फल देते हैं।</> : <><span className="text-gold-light font-medium">Total Score:</span> The Sarvashtakavarga combines all 7 individual planet Ashtakavarga charts into one summary. Each sign gets a total score out of 56 (7 planets x 8 maximum bindus). Signs with 28 or more SAV points are generally auspicious — planets transiting these signs deliver better results regardless of the general transit rule.</>}</p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-amber-500/15">
        <h4 className="text-amber-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'व्यावहारिक प्रयोग' : 'Practical Application'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <><span className="text-gold-light font-medium">उदाहरण:</span> चन्द्र से 8वें भाव में शनि गोचर सामान्यतः अत्यन्त कठिन है। परन्तु यदि जातक के अष्टकवर्ग में उस राशि में शनि के 5 बिन्दु हों, तो गोचर काफी शमित होगा — चुनौतियाँ हैं परन्तु सम्भालने योग्य हैं और छिपे लाभ भी ला सकता है (8वें भाव का रूपान्तरण)।</> : <><span className="text-gold-light font-medium">Example:</span> Saturn transiting the 8th from Moon is generally very difficult. But if Saturn has 5 bindus in that sign in the native&apos;s Ashtakavarga chart, the transit will be significantly mitigated — challenges exist but are manageable and may even bring hidden gains (8th house transformation).</>}</p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Conversely:</span> Jupiter in the 5th from Moon is classically excellent. But if Jupiter has only 1-2 bindus in that sign, the promised bounty may be delayed, partial, or manifest through struggle rather than ease. Ashtakavarga reveals the hidden quality behind the surface-level transit rule.
        </p>
      </section>
    </div>
  );
}

export default function Module12_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

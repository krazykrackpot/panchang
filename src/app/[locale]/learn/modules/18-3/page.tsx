'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_18_3', phase: 5, topic: 'Strength', moduleNumber: '18.3',
  title: {
    en: 'Ashtakavarga — The Bindu Scoring System',
    hi: 'अष्टकवर्ग — बिन्दु अंकन पद्धति',
  },
  subtitle: {
    en: 'How 7 planets contribute beneficial points across 12 signs from 8 sources, creating a transit-prediction matrix that pinpoints favorable and challenging periods',
    hi: 'कैसे 7 ग्रह 8 स्रोतों से 12 राशियों में शुभ बिन्दु योगदान करते हैं, एक गोचर-भविष्यवाणी मैट्रिक्स बनाते हुए जो अनुकूल और चुनौतीपूर्ण अवधियों को इंगित करती है',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 18-1: Shadbala — Planetary Strength', hi: 'मॉड्यूल 18-1: षड्बल — ग्रह शक्ति' }, href: '/learn/modules/18-1' },
    { label: { en: 'Module 18-2: Bhavabala — House Strength', hi: 'मॉड्यूल 18-2: भावबल — भाव शक्ति' }, href: '/learn/modules/18-2' },
    { label: { en: 'Module 12-1: Transits (Gochara)', hi: 'मॉड्यूल 12-1: गोचर' }, href: '/learn/modules/12-1' },
    { label: { en: 'Kundali Tool', hi: 'कुण्डली उपकरण' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q18_3_01', type: 'mcq',
    question: {
      en: 'In Ashtakavarga, how many sources contribute bindus (points) for each planet?',
      hi: 'अष्टकवर्ग में प्रत्येक ग्रह के लिए कितने स्रोत बिन्दु (अंक) योगदान करते हैं?',
    },
    options: [
      { en: '5 (5 planets)', hi: '5 (5 ग्रह)' },
      { en: '7 (7 planets)', hi: '7 (7 ग्रह)' },
      { en: '8 (7 planets + lagna)', hi: '8 (7 ग्रह + लग्न)' },
      { en: '12 (12 houses)', hi: '12 (12 भाव)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Each planet receives bindus from 8 sources: the 7 classical planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) plus the Lagna. Each source either contributes a bindu (1) or not (0) to each of the 12 signs, creating a matrix of beneficial points.',
      hi: 'प्रत्येक ग्रह 8 स्रोतों से बिन्दु प्राप्त करता है: 7 शास्त्रीय ग्रह (सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि) और लग्न। प्रत्येक स्रोत 12 राशियों में से प्रत्येक में बिन्दु (1) देता है या नहीं (0), शुभ बिन्दुओं का एक मैट्रिक्स बनाते हुए।',
    },
  },
  {
    id: 'q18_3_02', type: 'mcq',
    question: {
      en: 'What is the maximum number of bindus a planet can receive in a single sign in its BAV (Bhinna Ashtakavarga)?',
      hi: 'भिन्न अष्टकवर्ग (BAV) में एक ग्रह एक राशि में अधिकतम कितने बिन्दु प्राप्त कर सकता है?',
    },
    options: [
      { en: '4', hi: '4' },
      { en: '7', hi: '7' },
      { en: '8', hi: '8' },
      { en: '12', hi: '12' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Since there are 8 sources (7 planets + lagna), each contributing 0 or 1 bindu, the maximum per sign in BAV is 8. A planet transiting a sign where it has 8 bindus in its own BAV would experience the most favorable conditions possible.',
      hi: 'चूँकि 8 स्रोत (7 ग्रह + लग्न) हैं, प्रत्येक 0 या 1 बिन्दु योगदान करता है, BAV में प्रति राशि अधिकतम 8 है। ग्रह जो उस राशि में गोचर करता है जहाँ उसके अपने BAV में 8 बिन्दु हैं, सर्वाधिक अनुकूल स्थितियाँ अनुभव करेगा।',
    },
  },
  {
    id: 'q18_3_03', type: 'true_false',
    question: {
      en: 'A planet transiting a sign where it has 4 or more bindus in its BAV generally produces favorable results.',
      hi: 'ग्रह जो उस राशि में गोचर कर रहा है जहाँ उसके BAV में 4 या अधिक बिन्दु हैं, सामान्यतः अनुकूल परिणाम देता है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The threshold of 4 bindus (out of 8 maximum) serves as the dividing line. A planet transiting a sign with 4+ own bindus in its BAV tends to give positive results in that sign. Below 4 indicates a challenging transit through that sign.',
      hi: 'सत्य। 4 बिन्दु (8 अधिकतम में से) की सीमा विभाजन रेखा के रूप में कार्य करती है। BAV में 4+ स्वयं के बिन्दु वाली राशि में गोचर करने वाला ग्रह सकारात्मक परिणाम देता है। 4 से कम चुनौतीपूर्ण गोचर इंगित करता है।',
    },
  },
  {
    id: 'q18_3_04', type: 'mcq',
    question: {
      en: 'What is the maximum possible SAV (Sarvashtakavarga) score for a single sign?',
      hi: 'एकल राशि के लिए अधिकतम सम्भव SAV (सर्वाष्टकवर्ग) अंक क्या है?',
    },
    options: [
      { en: '28', hi: '28' },
      { en: '42', hi: '42' },
      { en: '56', hi: '56' },
      { en: '108', hi: '108' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'SAV is the sum of all 7 planets\' BAV tables. Since each planet can contribute 0-8 bindus per sign and there are 7 planets, the theoretical maximum per sign is 7 x 8 = 56. In practice, most signs score between 20 and 35.',
      hi: 'SAV सभी 7 ग्रहों की BAV तालिकाओं का योग है। चूँकि प्रत्येक ग्रह प्रति राशि 0-8 बिन्दु योगदान कर सकता है और 7 ग्रह हैं, प्रति राशि सैद्धान्तिक अधिकतम 7 x 8 = 56 है। व्यवहार में अधिकांश राशियाँ 20 से 35 के बीच अंकित होती हैं।',
    },
  },
  {
    id: 'q18_3_05', type: 'mcq',
    question: {
      en: 'A SAV score of 28+ in a sign indicates:',
      hi: 'किसी राशि में 28+ का SAV अंक इंगित करता है:',
    },
    options: [
      { en: 'The sign is completely inauspicious', hi: 'राशि पूर्णतया अशुभ है' },
      { en: 'A strong location where planets transiting give positive results', hi: 'एक बलवान स्थान जहाँ गोचर करने वाले ग्रह सकारात्मक परिणाम देते हैं' },
      { en: 'The sign has no significance', hi: 'राशि का कोई महत्व नहीं' },
      { en: 'Only Rahu benefits in this sign', hi: 'केवल राहु को इस राशि में लाभ है' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A SAV score of 28+ (half of the theoretical max of 56) indicates a strong sign location. Planets transiting this sign generally produce positive results. The higher the SAV, the more supportive the environment. Signs below 28 SAV are generally weaker locations.',
      hi: 'SAV अंक 28+ (सैद्धान्तिक अधिकतम 56 का आधा) एक बलवान राशि स्थान इंगित करता है। इस राशि में गोचर करने वाले ग्रह सामान्यतः सकारात्मक परिणाम देते हैं। SAV जितना अधिक, वातावरण उतना अधिक सहायक। 28 से कम SAV वाली राशियाँ सामान्यतः दुर्बल स्थान हैं।',
    },
  },
  {
    id: 'q18_3_06', type: 'true_false',
    question: {
      en: 'Trikona Shodhana and Ekadhipati Shodhana are reduction techniques applied to refine the raw Ashtakavarga tables.',
      hi: 'त्रिकोण शोधन और एकाधिपति शोधन कच्ची अष्टकवर्ग तालिकाओं को परिष्कृत करने के लिए लागू की जाने वाली न्यूनीकरण तकनीकें हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Trikona Shodhana reduces bindus by examining trine relationships (signs 1-5-9 from each other), and Ekadhipati Shodhana adjusts for signs ruled by the same planet (e.g., Mars rules both Aries and Scorpio). These reductions reveal subtler patterns hidden in the raw data.',
      hi: 'सत्य। त्रिकोण शोधन त्रिकोण सम्बन्धों (एक-दूसरे से 1-5-9 राशियाँ) की जाँच करके बिन्दु घटाता है, और एकाधिपति शोधन एक ही ग्रह द्वारा शासित राशियों (जैसे मंगल मेष और वृश्चिक दोनों का स्वामी) के लिए समायोजित करता है। ये न्यूनीकरण कच्चे आँकड़ों में छिपे सूक्ष्म प्रतिरूप दर्शाते हैं।',
    },
  },
  {
    id: 'q18_3_07', type: 'mcq',
    question: {
      en: 'What is the Kaksha system in Ashtakavarga?',
      hi: 'अष्टकवर्ग में कक्षा पद्धति क्या है?',
    },
    options: [
      { en: 'A type of yoga', hi: 'एक प्रकार का योग' },
      { en: '8 sub-divisions of each sign, each ruled by one of the 8 sources', hi: 'प्रत्येक राशि के 8 उप-विभाजन, प्रत्येक 8 स्रोतों में से एक द्वारा शासित' },
      { en: 'A method of calculating dasha periods', hi: 'दशा अवधि गणना की एक विधि' },
      { en: 'The total of all BAV tables', hi: 'सभी BAV तालिकाओं का कुल' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Kaksha system divides each 30-degree sign into 8 sub-divisions of 3.75 degrees each, with each Kaksha ruled by one of the 8 sources (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Lagna). This allows pinpointing WHICH months within a long transit are best or worst.',
      hi: 'कक्षा पद्धति प्रत्येक 30-अंश राशि को 3.75 अंश के 8 उप-विभाजनों में बाँटती है, प्रत्येक कक्षा 8 स्रोतों में से एक (सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि, लग्न) द्वारा शासित। यह लम्बे गोचर में किन महीनों में सर्वोत्तम/सबसे कठिन है, इसे इंगित करने में सक्षम बनाता है।',
    },
  },
  {
    id: 'q18_3_08', type: 'mcq',
    question: {
      en: 'Saturn transiting a sign where it has 6 bindus in its own BAV indicates:',
      hi: 'शनि जो उस राशि में गोचर कर रहा है जहाँ उसके स्वयं के BAV में 6 बिन्दु हैं, इंगित करता है:',
    },
    options: [
      { en: 'A very difficult and obstructive period', hi: 'बहुत कठिन और बाधक अवधि' },
      { en: 'A productive and relatively smooth period for Saturn-related matters', hi: 'शनि-सम्बन्धित मामलों के लिए उत्पादक और अपेक्षाकृत सहज अवधि' },
      { en: 'No effect at all', hi: 'कोई प्रभाव नहीं' },
      { en: 'Only financial losses', hi: 'केवल आर्थिक हानि' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Saturn with 6 bindus (well above the 4-bindu threshold) in a sign means its transit through that sign will be productive. Even though Saturn is a natural malefic, high bindu counts in its own BAV soften its effects and channel its energy constructively.',
      hi: 'शनि के 6 बिन्दु (4-बिन्दु सीमा से काफी ऊपर) का अर्थ है कि उस राशि में उसका गोचर उत्पादक होगा। भले ही शनि प्राकृतिक पापी है, उसके स्वयं के BAV में उच्च बिन्दु संख्या उसके प्रभावों को कोमल बनाती है और ऊर्जा को रचनात्मक दिशा देती है।',
    },
  },
  {
    id: 'q18_3_09', type: 'true_false',
    question: {
      en: 'Ashtakavarga and Vimshottari Dasha are two independent systems that should be reconciled for accurate timing predictions.',
      hi: 'अष्टकवर्ग और विंशोत्तरी दशा दो स्वतन्त्र पद्धतियाँ हैं जिन्हें सटीक समय भविष्यवाणियों के लिए समन्वयित किया जाना चाहिए।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Dasha tells you WHAT planet\'s themes are activated; Ashtakavarga tells you WHERE (which signs) transits will be favorable or unfavorable. Combining both gives precise timing: a favorable dasha period + high-bindu transit = excellent results; unfavorable dasha + low-bindu transit = maximum difficulty.',
      hi: 'सत्य। दशा बताती है कौन-से ग्रह के विषय सक्रिय हैं; अष्टकवर्ग बताता है कहाँ (कौन-सी राशियों में) गोचर अनुकूल या प्रतिकूल होगा। दोनों का संयोजन सटीक समय देता है: अनुकूल दशा + उच्च-बिन्दु गोचर = उत्कृष्ट परिणाम; प्रतिकूल दशा + कम-बिन्दु गोचर = अधिकतम कठिनाई।',
    },
  },
  {
    id: 'q18_3_10', type: 'mcq',
    question: {
      en: 'Which of the following best describes Sarvashtakavarga (SAV)?',
      hi: 'निम्नलिखित में से कौन सर्वाष्टकवर्ग (SAV) का सर्वोत्तम वर्णन करता है?',
    },
    options: [
      { en: 'The BAV table for Sun only', hi: 'केवल सूर्य की BAV तालिका' },
      { en: 'The combined total of all 7 planets\' BAV bindus for each sign', hi: 'प्रत्येक राशि के लिए सभी 7 ग्रहों के BAV बिन्दुओं का संयुक्त कुल' },
      { en: 'A prediction technique for marriage', hi: 'विवाह के लिए भविष्यवाणी तकनीक' },
      { en: 'The sum of Shadbala and Bhavabala', hi: 'षड्बल और भावबल का योग' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sarvashtakavarga (SAV) is the aggregate table formed by summing all 7 planets\' Bhinna Ashtakavarga (BAV) tables. It gives a single score per sign (0-56) representing the overall benefic strength of that sign in the chart. High SAV signs are universally favorable locations.',
      hi: 'सर्वाष्टकवर्ग (SAV) सभी 7 ग्रहों की भिन्न अष्टकवर्ग (BAV) तालिकाओं को जोड़कर बनी समग्र तालिका है। यह प्रति राशि एक अंक (0-56) देता है जो कुण्डली में उस राशि की समग्र शुभ शक्ति को दर्शाता है। उच्च SAV राशियाँ सार्वभौमिक रूप से अनुकूल स्थान हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अष्टकवर्ग क्या है?' : 'What is Ashtakavarga?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टकवर्ग एक अद्वितीय वैदिक पद्धति है जो प्रत्येक ग्रह के लिए सभी 12 राशियों में शुभ प्रभाव का संख्यात्मक मानचित्र बनाती है। शब्द का अर्थ है &ldquo;आठ विभाजन&rdquo; &mdash; 8 स्रोतों (7 ग्रह और लग्न) को सन्दर्भित करते हुए जो 12 राशियों में &ldquo;बिन्दु&rdquo; (शुभ अंक, 0 या 1) योगदान करते हैं। प्रत्येक ग्रह के लिए यह 12-राशि तालिका बनाता है जो दिखाती है कि ग्रह का गोचर कहाँ समर्थित और कहाँ चुनौतीपूर्ण होगा।</>
            : <>Ashtakavarga is a unique Vedic system that creates a numerical map of benefic influence across all 12 signs for each planet. The word means &ldquo;eight divisions&rdquo; &mdash; referring to the 8 sources (7 planets plus the Lagna) that contribute &ldquo;bindus&rdquo; (beneficial points, either 0 or 1) to each of the 12 signs. For every planet, this creates a 12-sign table showing where that planet&apos;s transit will be supported and where it will be challenged.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>भिन्न अष्टकवर्ग (BAV)</strong> व्यक्तिगत ग्रह की तालिका है &mdash; 7 ग्रहों में से प्रत्येक का अपना BAV है जिसमें प्रति राशि 0-8 अंक। <strong>सर्वाष्टकवर्ग (SAV)</strong> सभी 7 BAV तालिकाओं का संयुक्त कुल है, प्रति राशि 0-56 अंक देता है। BAV किसी विशिष्ट ग्रह के गोचर गुणवत्ता के बारे में बताता है; SAV कुण्डली में किसी राशि की समग्र शक्ति बताता है।</>
            : <><strong>Bhinna Ashtakavarga (BAV)</strong> is the individual planet&apos;s table &mdash; each of the 7 planets has its own BAV with scores 0-8 per sign. <strong>Sarvashtakavarga (SAV)</strong> is the combined total of all 7 BAV tables, giving a score of 0-56 per sign. BAV tells you about a specific planet&apos;s transit quality; SAV tells you about the overall strength of a sign in the chart.</>}
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-gold-primary/10">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उद्गम' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>अष्टकवर्ग का विस्तृत वर्णन बृहत् पाराशर होरा शास्त्र (अध्याय 66-72) में है और वराहमिहिर की बृहत् जातक में इसे और विस्तृत किया गया। यह पद्धति कम्प्यूटर-युग के एल्गोरिदम से दो सहस्राब्दी से अधिक पुरानी है, फिर भी ग्रह प्रभाव अंकन के प्रति इसका मैट्रिक्स-आधारित दृष्टिकोण आधुनिक गणनात्मक विधियों की पूर्वकल्पना करता है।</>
            : <>Ashtakavarga is described in detail in Brihat Parashara Hora Shastra (chapters 66-72) and further elaborated in Varahamihira&apos;s Brihat Jataka. The system predates computer-era algorithms by over two millennia, yet its matrix-based approach to scoring planetary influence anticipates modern computational methods. Parashara prescribed specific rules for which positions (counted from each source) generate a bindu &mdash; these rules encode empirical observations about when planets in certain relative positions produce beneficial effects.</>}
        </p>
      </section>
    </div>
  );
}

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'BAV और SAV तालिकाएँ पढ़ना' : 'Reading BAV and SAV Tables'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>BAV व्याख्या:</strong> जब ग्रह उस राशि में गोचर करता है जहाँ उसके अपने BAV में 4 या अधिक बिन्दु हैं, परिणाम सामान्यतः अनुकूल होते हैं। 4 से कम बिन्दुओं पर उस राशि से गोचर चुनौतीपूर्ण होता है। उदाहरण: यदि शनि के BAV में मिथुन में 6 और वृषभ में 2 बिन्दु हैं, तो मिथुन से गोचर उत्पादक और वृषभ से कठिन होगा।</>
            : <><strong>BAV interpretation:</strong> When a planet transits a sign where it has 4 or more bindus in its own BAV, results are generally favorable. Below 4 bindus, the transit through that sign tends to be challenging. For example, if Saturn&apos;s BAV shows 6 bindus in Gemini and 2 in Taurus, Saturn&apos;s transit through Gemini will be productive while its transit through Taurus will be difficult.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <><strong>SAV व्याख्या:</strong> 28+ कुल SAV बिन्दु वाली राशियाँ बलवान स्थान हैं &mdash; उनमें गोचर करने वाला कोई भी ग्रह सामान्यतः सहायक वातावरण से लाभान्वित होता है। 28 से कम कुण्डली में अपेक्षाकृत दुर्बल राशि इंगित करता है। SAV एक अवलोकन देता है कि राशिचक्र के कौन-से भाग जातक के लिए शक्तिशाली हैं।</>
            : <><strong>SAV interpretation:</strong> Signs with 28+ total SAV points are strong locations &mdash; any planet transiting them benefits from a generally supportive environment. Below 28 indicates a relatively weak sign in the chart. The SAV gives an overview of which parts of the zodiac are powerful for the native.</>}
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यरत उदाहरण: शनि का BAV' : 'Worked Example: Saturn&apos;s BAV'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Saturn&apos;s Bhinna Ashtakavarga for a sample chart:</span>
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-1">Aries: 3 | Taurus: 2 | Gemini: 6 | Cancer: 4 | Leo: 3 | Virgo: 5</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">Libra: 4 | Scorpio: 2 | Sagittarius: 5 | Capricorn: 3 | Aquarius: 4 | Pisces: 3</p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light">व्याख्या:</span> शनि मिथुन गोचर (6 बिन्दु) = अत्यन्त उत्पादक 2.5 वर्ष। करियर प्रगति, अनुशासन का फल। शनि वृषभ गोचर (2 बिन्दु) = विलम्ब, स्वास्थ्य चिन्ता, करियर बाधाओं सहित कठिन अवधि। शनि कर्क, तुला, कुम्भ (4-4 बिन्दु) = तटस्थ, प्रबन्धनीय अवधि।</>
            : <><span className="text-gold-light font-medium">Interpretation:</span> Saturn transiting Gemini (6 bindus) = highly productive 2.5-year period. Career progress, discipline paying off. Saturn transiting Taurus (2 bindus) = difficult period with delays, health concerns, career obstacles. Saturn in Cancer, Libra, Aquarius (4 bindus each) = neutral, manageable periods.</>}
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'सामान्य भ्रम' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>कई छात्र BAV और SAV को भ्रमित करते हैं और परस्पर विनिमय से प्रयोग करते हैं। BAV ग्रह-विशिष्ट है &mdash; यह एक ग्रह के गोचर गुणवत्ता के बारे में बताता है। SAV समग्र है और एक राशि की समग्र शुभ शक्ति बताता है। एक अन्य सामान्य त्रुटि त्रिकोण शोधन और एकाधिपति शोधन (न्यूनीकरण तकनीकें) की उपेक्षा करना है। कच्चा BAV/SAV प्रथम अनुमान देता है, पर शोधन प्रक्रिया सूक्ष्म प्रतिरूप दर्शाती है।</>
            : <>Many students confuse BAV with SAV and use them interchangeably. BAV is planet-specific &mdash; it tells you about ONE planet&apos;s transit quality. SAV is the aggregate and tells you about the overall benefic strength of a SIGN. Another common error is ignoring Trikona Shodhana and Ekadhipati Shodhana (reduction techniques). Raw BAV/SAV gives a first approximation, but the shodhana (purification) process reveals subtler patterns &mdash; much like how raw data needs statistical refinement.</>}
        </p>
      </section>
    </div>
  );
}

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'अष्टकवर्ग से गोचर भविष्यवाणी' : 'Transit Prediction with Ashtakavarga'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अष्टकवर्ग की वास्तविक शक्ति गोचर विश्लेषण में प्रकट होती है। जब शनि प्रत्येक 2.5 वर्ष में नई राशि में जाता है, उस राशि का BAV अंक तुरन्त बताता है कि अवधि उत्पादक होगी या कष्टकारी। शनि मिथुन में 6 बिन्दु = अनुशासित विकास और ठोस उपलब्धियों की अवधि। शनि वृषभ में 2 बिन्दु = विलम्ब, निराशा, स्वास्थ्य समस्याएँ और करियर बाधाएँ जो धैर्य की माँग करती हैं।</>
            : <>The real power of Ashtakavarga emerges in transit analysis. When Saturn moves into a new sign every 2.5 years, the BAV score for that sign immediately tells you whether the period will be productive or painful. Saturn in Gemini with 6 bindus = a period of disciplined growth and tangible achievements. Saturn in Taurus with 2 bindus = delays, frustrations, health issues, and career obstacles that demand patience.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <><strong>कक्षा पद्धति</strong> इसे और आगे ले जाती है। प्रत्येक 30-अंश राशि 3.75 अंश की 8 उप-खण्डों (कक्षाओं) में विभाजित होती है, शासित: सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि और लग्न (इसी क्रम में)। जैसे ग्रह धीरे-धीरे राशि से गोचर करता है, वह प्रत्येक कक्षा से गुजरता है। जब वह उस स्रोत की कक्षा में प्रवेश करता है जिसने बिन्दु दिया, वह उप-अवधि अनुकूल है। जब 0 देने वाले स्रोत की कक्षा में प्रवेश करता है, वह उप-अवधि चुनौतीपूर्ण है। यह 2.5-वर्षीय शनि गोचर में विशिष्ट महीनों को इंगित करता है।</>
            : <>The <strong>Kaksha system</strong> takes this further. Each 30-degree sign is divided into 8 sub-sections (Kakshas) of 3.75 degrees each, ruled by: Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, and Lagna (in that order). As a planet slowly transits a sign, it passes through each Kaksha. When it enters the Kaksha of a source that contributed a bindu, that sub-period is favorable. When it enters a Kaksha whose source gave 0, that sub-period is challenging. This pinpoints specific months within a 2.5-year Saturn transit.</>}
        </p>
      </section>
      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>अष्टकवर्ग का पुनर्जागरण ठीक इसलिए हो रहा है क्योंकि यह अन्तर्निहित रूप से गणनात्मक है। बिन्दु तालिकाएँ मूलतः 12 (राशि) गुणा 8 (स्रोत) आकार के 7 मैट्रिक्स हैं, गणना में अत्यन्त तीव्र। हमारा कुण्डली इंजन पूर्ण BAV और SAV तालिकाएँ मिलीसेकण्ड में उत्पन्न करता है। यह गोचर भविष्यवाणियों को विशिष्ट और सत्यापन-योग्य बनाता है। अष्टकवर्ग बिन्दुओं को विंशोत्तरी दशा अवधियों के साथ संयोजित करने से ज्योतिष में सबसे सटीक समय ढाँचा प्राप्त होता है: दशा बताती है क्या; अष्टकवर्ग बताता है कहाँ; मिलकर वे बताते हैं कब।</>
            : <>Ashtakavarga is experiencing a renaissance precisely because it is inherently computational. The bindu tables are essentially 7 matrices of size 12 (signs) by 8 (sources), trivially fast to compute. Our Kundali engine generates complete BAV and SAV tables in milliseconds. This makes transit predictions specific and falsifiable &mdash; &ldquo;Saturn&apos;s transit through Gemini (6 bindus) will be better than its transit through Taurus (2 bindus)&rdquo; is a concrete, verifiable claim. Combining Ashtakavarga bindus with Vimshottari Dasha periods produces the most accurate timing framework in Jyotish: dasha tells you WHAT; Ashtakavarga tells you WHERE; together they tell you WHEN.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module18_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

'use client';

import { tl } from '@/lib/utils/trilingual';
import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import L from '@/messages/learn/modules/20-2.json';
import KeyTakeaway from '@/components/learn/KeyTakeaway';

const META: ModuleMeta = {
  id: 'mod_20_2', phase: 7, topic: 'KP System', moduleNumber: '20.2',
  title: L.title as unknown as Record<string, string>,
  subtitle: L.subtitle as unknown as Record<string, string>,
  estimatedMinutes: 15,
  crossRefs: L.crossRefs as unknown as Array<{label: Record<string, string>; href: string}>,
};

const QUESTIONS: ModuleQuestion[] = L.questions as unknown as ModuleQuestion[];

function Page1() {
  const locale = useModuleLocale();
  const isHi = isDevanagariLocale(locale);
  return (
    <div className="space-y-6">
      <KeyTakeaway
        points={[
          'The 249 sub-lord table divides each of the 27 nakshatras into 9 unequal parts using Vimshottari Dasha proportions.',
          'Every degree of the zodiac has a sign lord, star lord, and sub-lord — the sub-lord is the decisive factor in KP analysis.',
        ]}
        locale={locale}
      />
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {tl({ en: 'Nakshatra Sub-Divisions: The KP Innovation', hi: 'नक्षत्र उप-विभाग: केपी का नवाचार', sa: 'नक्षत्र उप-विभाग: केपी का नवाचार' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {tl({ en: 'In traditional Vedic astrology, each nakshatra spans 13 degrees 20 minutes and is divided into 4 equal padas (quarters) of 3 degrees 20 minutes each. KP took this further: it divided each nakshatra into 9 UNEQUAL sub-divisions based on the Vimshottari dasha proportions of the 9 planets. Just as the 120-year Vimshottari cycle allocates different periods to each planet (Ketu 7, Venus 20, Sun 6, Moon 10, Mars 7, Rahu 18, Jupiter 16, Saturn 19, Mercury 17 years), KP allocates proportional slices of each 13-degree-20-minute nakshatra to each planet.', hi: 'पारम्परिक वैदिक ज्योतिष में प्रत्येक नक्षत्र 13 अंश 20 कला में फैला है और 3 अंश 20 कला के 4 समान पादों (चतुर्थांशों) में विभक्त है। केपी ने इसे आगे बढ़ाया: इसने प्रत्येक नक्षत्र को 9 ग्रहों के विंशोत्तरी दशा अनुपातों के आधार पर 9 असमान उप-विभागों में बाँटा। जैसे 120 वर्ष का विंशोत्तरी चक्र प्रत्येक ग्रह को भिन्न अवधि आवंटित करता है (केतु 7, शुक्र 20, सूर्य 6, चन्द्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17 वर्ष), केपी प्रत्येक 13 अंश 20 कला नक्षत्र के आनुपातिक खण्ड प्रत्येक ग्रह को आवंटित करता है।', sa: 'पारम्परिक वैदिक ज्योतिष में प्रत्येक नक्षत्र 13 अंश 20 कला में फैला है और 3 अंश 20 कला के 4 समान पादों (चतुर्थांशों) में विभक्त है। केपी ने इसे आगे बढ़ाया: इसने प्रत्येक नक्षत्र को 9 ग्रहों के विंशोत्तरी दशा अनुपातों के आधार पर 9 असमान उप-विभागों में बाँटा। जैसे 120 वर्ष का विंशोत्तरी चक्र प्रत्येक ग्रह को भिन्न अवधि आवंटित करता है (केतु 7, शुक्र 20, सूर्य 6, चन्द्र 10, मंगल 7, राहु 18, गुरु 16, शनि 19, बुध 17 वर्ष), केपी प्रत्येक 13 अंश 20 कला नक्षत्र के आनुपातिक खण्ड प्रत्येक ग्रह को आवंटित करता है।' }, locale)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'The result: 27 nakshatras times approximately 9 subs each = 249 unique sub-divisions covering the full 360 degrees. Each sub-division is characterized by three lords: the Sign Lord (planet ruling the rashi in which the degree falls), the Star Lord (planet ruling the nakshatra), and the Sub Lord (planet ruling the specific sub-division). This three-tier lordship system is the backbone of all KP analysis.', hi: 'परिणाम: 27 नक्षत्र गुणा प्रत्येक में लगभग 9 उप-भाग = 249 अद्वितीय उप-विभाग जो पूर्ण 360 अंश आवृत करते हैं। प्रत्येक उप-विभाग तीन स्वामियों द्वारा विशेषित है: राशि स्वामी (उस अंश की राशि का शासक ग्रह), नक्षत्र स्वामी (नक्षत्र का शासक ग्रह), और उप स्वामी (विशिष्ट उप-विभाग का शासक ग्रह)। यह त्रि-स्तरीय स्वामित्व प्रणाली सम्पूर्ण केपी विश्लेषण की रीढ़ है।', sa: 'परिणाम: 27 नक्षत्र गुणा प्रत्येक में लगभग 9 उप-भाग = 249 अद्वितीय उप-विभाग जो पूर्ण 360 अंश आवृत करते हैं। प्रत्येक उप-विभाग तीन स्वामियों द्वारा विशेषित है: राशि स्वामी (उस अंश की राशि का शासक ग्रह), नक्षत्र स्वामी (नक्षत्र का शासक ग्रह), और उप स्वामी (विशिष्ट उप-विभाग का शासक ग्रह)। यह त्रि-स्तरीय स्वामित्व प्रणाली सम्पूर्ण केपी विश्लेषण की रीढ़ है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{tl({ en: 'Classical Origin', hi: 'शास्त्रीय उत्पत्ति', sa: 'शास्त्रीयः उद्भवः' }, locale)}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: "The concept of subdividing nakshatras is not new — Parashari astrology uses the 4-pada system (108 padas total, forming the Navamsha). KP\'s innovation was replacing equal padas with UNEQUAL Vimshottari-proportioned subs. Krishnamurti argued that since the Vimshottari dasha governs the timing of life events, the same proportional logic should govern the spatial division of the zodiac. This elegant unification of temporal (dasha) and spatial (sub-lord) systems using the same Vimshottari ratios is what makes KP internally consistent.", hi: "नक्षत्रों को उप-विभाजित करने की अवधारणा नई नहीं है — पाराशरी ज्योतिष 4-पाद पद्धति (कुल 108 पाद, जो नवांश बनाते हैं) का उपयोग करता है। केपी का नवाचार था समान पादों को असमान विंशोत्तरी-अनुपातित उप-भागों से प्रतिस्थापित करना। कृष्णमूर्ति का तर्क था कि चूँकि विंशोत्तरी दशा जीवन घटनाओं के समय को नियन्त्रित करती है, वही आनुपातिक तर्क राशिचक्र के स्थानिक विभाजन को भी नियन्त्रित करना चाहिए। समान विंशोत्तरी अनुपातों का उपयोग करके कालिक (दशा) और स्थानिक (उप-स्वामी) पद्धतियों का यह सुन्दर एकीकरण ही केपी को आन्तरिक रूप से सुसंगत बनाता है।", sa: "नक्षत्रों को उप-विभाजित करने की अवधारणा नई नहीं है — पाराशरी ज्योतिष 4-पाद पद्धति (कुल 108 पाद, जो नवांश बनाते हैं) का उपयोग करता है। केपी का नवाचार था समान पादों को असमान विंशोत्तरी-अनुपातित उप-भागों से प्रतिस्थापित करना। कृष्णमूर्ति का तर्क था कि चूँकि विंशोत्तरी दशा जीवन घटनाओं के समय को नियन्त्रित करती है, वही आनुपातिक तर्क राशिचक्र के स्थानिक विभाजन को भी नियन्त्रित करना चाहिए। समान विंशोत्तरी अनुपातों का उपयोग करके कालिक (दशा) और स्थानिक (उप-स्वामी) पद्धतियों का यह सुन्दर एकीकरण ही केपी को आन्तरिक रूप से सुसंगत बनाता है।" }, locale)}
        </p>
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
          {tl({ en: 'Finding the Sub Lord: Step by Step', hi: 'उप स्वामी ज्ञात करना: चरण दर चरण', sa: 'उप स्वामी ज्ञात करना: चरण दर चरण' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>किसी भी राशिचक्र अंश का उप स्वामी ज्ञात करने के लिए तीन चरणों का पालन करें। पहला, नक्षत्र पहचानें: निरपेक्ष भोगांश को 13.333 अंश से विभक्त कर ज्ञात करें कि वह अंश 27 नक्षत्रों में से किसमें आता है। दूसरा, नक्षत्र के आरम्भिक अंश को घटाकर नक्षत्र के भीतर स्थिति ज्ञात करें। तीसरा, इस स्थिति को उस नक्षत्र के विंशोत्तरी-अनुपातित उप-विभागों से मिलाएँ, जो स्वयं नक्षत्र स्वामी से आरम्भ होते हैं।</>
            : <>To find the Sub Lord of any zodiac degree, follow three steps. First, identify the nakshatra: divide the absolute longitude by 13.333 degrees to find which of the 27 nakshatras the degree falls in. Second, find the position within the nakshatra by subtracting the nakshatra&apos;s starting degree. Third, map this position against the Vimshottari-proportioned sub-divisions of that nakshatra, starting from the nakshatra lord itself.</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? <>प्रत्येक नक्षत्र के भीतर उप-विभाग नक्षत्र स्वामी से आरम्भ होकर विंशोत्तरी क्रम का पालन करते हैं। भरणी (शुक्र-शासित) के लिए क्रम है: शुक्र उप, सूर्य उप, चन्द्र उप, मंगल उप, राहु उप, गुरु उप, शनि उप, बुध उप, केतु उप। प्रत्येक उप की चौड़ाई उसकी विंशोत्तरी अवधि के अनुपात में है। शुक्र उप = 13 अंश 20 कला का 20/120 = 2 अंश 13 कला 20 विकला। सूर्य उप = 13 अंश 20 कला का 6/120 = 0 अंश 40 कला। इत्यादि।</>
            : <>The sub-divisions within each nakshatra follow the Vimshottari sequence starting from the nakshatra lord. For Bharani (Venus-ruled), the sequence is: Venus sub, Sun sub, Moon sub, Mars sub, Rahu sub, Jupiter sub, Saturn sub, Mercury sub, Ketu sub. Each sub&apos;s width is proportional to its Vimshottari period. Venus sub = 20/120 of 13 degrees 20 minutes = 2 degrees 13 minutes 20 seconds. Sun sub = 6/120 of 13 degrees 20 minutes = 0 degrees 40 minutes. And so on.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Worked Example', hi: 'कार्यान्वित उदाहरण', sa: 'सोदाहरणं कार्यम्' }, locale)}
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={tl({ en: 'Example Chart', hi: 'उदाहरण कुण्डली', sa: 'उदाहरणकुण्डली' }, locale)} />
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">15 अंश 30 कला मेष का उप स्वामी ज्ञात करें:</span> चरण 1: 15 अंश 30 कला = 15.5 अंश निरपेक्ष। नक्षत्र = floor(15.5 / 13.333) + 1 = floor(1.162) + 1 = 1 + 1 = दूसरा नक्षत्र = भरणी। नक्षत्र स्वामी = शुक्र। चरण 2: भरणी में स्थिति = 15.5 - 13.333 = 2.167 अंश = 2 अंश 10 कला। चरण 3: भरणी के उप-भाग शुक्र (2 अंश 13 कला 20 विकला) से आरम्भ होते हैं। चूँकि 2 अंश 10 कला, 2 अंश 13 कला 20 विकला से कम है, हम अभी शुक्र उप में हैं। अन्तिम उत्तर: राशि स्वामी = मंगल (मेष), नक्षत्र स्वामी = शुक्र (भरणी), उप स्वामी = शुक्र।</>
            : <><span className="text-gold-light font-medium">Find the Sub Lord of 15 degrees 30 minutes Aries:</span> Step 1: 15 degrees 30 minutes = 15.5 degrees absolute. Nakshatra = floor(15.5 / 13.333) + 1 = floor(1.162) + 1 = 1 + 1 = 2nd nakshatra = Bharani. Star Lord = Venus. Step 2: Position within Bharani = 15.5 degrees - 13.333 degrees = 2.167 degrees = 2 degrees 10 minutes. Step 3: Bharani subs start with Venus (2 degrees 13 minutes 20 seconds). Since 2 degrees 10 minutes is less than 2 degrees 13 minutes 20 seconds, we are still within the Venus sub. Final answer: Sign Lord = Mars (Aries), Star Lord = Venus (Bharani), Sub Lord = Venus.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          <span className="text-gold-light font-medium">Another example — 16 degrees Aries:</span> Position in Bharani = 16 - 13.333 = 2.667 degrees. Venus sub ends at 2.222 degrees. Sun sub = 0.667 degrees, so Sun sub covers 2.222 to 2.889 degrees. Since 2.667 is within this range, Sub Lord = Sun. Result: Mars / Venus / Sun. Just half a degree apart from the previous example, yet a completely different Sub Lord!
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
          {tl({ en: 'Why the Sub Lord Is the Key', hi: 'उप स्वामी क्यों कुञ्जी है', sa: 'उप स्वामी क्यों कुञ्जी है' }, locale)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>केपी की क्रान्तिकारी अन्तर्दृष्टि यह है कि भाव सन्धि का उप स्वामी निर्णय करता है कि उस भाव के कारकत्व जातक के जीवन में प्रकट होंगे या नहीं। राशि स्वामी सामान्य क्षेत्र या वातावरण दिखाता है। नक्षत्र स्वामी उस स्रोत को प्रकट करता है जहाँ से परिणाम आएँगे। किन्तु उप स्वामी अन्तिम निर्णय देता है: &quot;हाँ, यह घटित होगा&quot; या &quot;नहीं, यह नहीं होगा।&quot;</>
            : <>KP&apos;s revolutionary insight is that the Sub Lord of a house cusp DECIDES whether that house&apos;s significations will manifest in the native&apos;s life. The Sign Lord shows the general area or environment. The Star Lord reveals the source from which results will come. But the Sub Lord delivers the final verdict: &quot;yes, this will happen&quot; or &quot;no, this will not happen.&quot;</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {tl({ en: 'For example, to judge marriage potential, examine the Sub Lord of the 7th house cusp. If this Sub Lord signifies houses 2, 7, and 11 (the marriage-supporting group), the native WILL marry. If the Sub Lord signifies houses 1, 6, 10 (independent/adverse to partnership), marriage may be denied or severely delayed. The Sign Lord and Star Lord add context, but the Sub Lord is the deciding vote.', hi: 'उदाहरणार्थ, विवाह सम्भावना का आकलन करने के लिए सप्तम भाव सन्धि के उप स्वामी की जाँच करें। यदि यह उप स्वामी भाव 2, 7 और 11 (विवाह-सहायक समूह) का कारक है, तो जातक का विवाह अवश्य होगा। यदि उप स्वामी भाव 1, 6, 10 (स्वतन्त्र/साझेदारी-विरोधी) का कारक है, तो विवाह अस्वीकृत या अत्यन्त विलम्बित हो सकता है। राशि स्वामी और नक्षत्र स्वामी सन्दर्भ जोड़ते हैं, किन्तु उप स्वामी निर्णायक मत है।', sa: 'उदाहरणार्थ, विवाह सम्भावना का आकलन करने के लिए सप्तम भाव सन्धि के उप स्वामी की जाँच करें। यदि यह उप स्वामी भाव 2, 7 और 11 (विवाह-सहायक समूह) का कारक है, तो जातक का विवाह अवश्य होगा। यदि उप स्वामी भाव 1, 6, 10 (स्वतन्त्र/साझेदारी-विरोधी) का कारक है, तो विवाह अस्वीकृत या अत्यन्त विलम्बित हो सकता है। राशि स्वामी और नक्षत्र स्वामी सन्दर्भ जोड़ते हैं, किन्तु उप स्वामी निर्णायक मत है।' }, locale)}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Common Misconceptions', hi: 'सामान्य भ्रान्तियाँ', sa: 'सामान्याः भ्रान्तयः' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;249 उप-स्वामी सारणी नवांश जैसा एक और वर्गीय चार्ट है।&quot; यह गलत है। नवांश प्रत्येक राशि को 9 समान भागों में विभक्त करता है और एक नई कुण्डली (D-9) बनाता है। केपी उप-स्वामी प्रत्येक नक्षत्र को 9 असमान भागों में विभक्त करते हैं और कोई पृथक कुण्डली नहीं बनाते — उप-स्वामी सूचना सीधे जन्म कुण्डली में भाव सन्धि विश्लेषण के लिए प्रयुक्त होती है।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The 249 sub-lord table is just another divisional chart like Navamsha.&quot; This is incorrect. The Navamsha divides each sign into 9 EQUAL parts and creates a new chart (D-9). KP sub-lords divide each NAKSHATRA into 9 UNEQUAL parts and do NOT create a separate chart — the sub-lord information is used directly within the birth chart for house cusp analysis.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">
          {tl({ en: 'Modern Relevance', hi: 'आधुनिक प्रासंगिकता', sa: 'आधुनिकी प्रासङ्गिकता' }, locale)}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {tl({ en: 'Before computers, KP practitioners had to manually look up the 249 sub-lord table from printed books — a tedious and error-prone process. Today, our KP System tool instantly computes the Sign Lord, Star Lord, and Sub Lord for every planet and house cusp in the chart. This automation has democratized KP astrology, allowing students to focus on interpretation rather than table lookups. The precision of sub-lord computation demands accurate birth time — even a 2-minute difference can shift a cusp sub-lord, which is why KP astrologers are among the strongest advocates for birth time rectification.', hi: 'कम्प्यूटर से पहले, केपी अभ्यासकर्ताओं को मुद्रित पुस्तकों से 249 उप-स्वामी सारणी मैनुअली खोजनी पड़ती थी — एक थकाऊ और त्रुटि-प्रवण प्रक्रिया। आज हमारा केपी सिस्टम उपकरण कुण्डली में प्रत्येक ग्रह और भाव सन्धि का राशि स्वामी, नक्षत्र स्वामी और उप स्वामी तत्काल गणित करता है। इस स्वचालन ने केपी ज्योतिष का लोकतन्त्रीकरण किया है, जिससे विद्यार्थी सारणी खोज के बजाय व्याख्या पर ध्यान केन्द्रित कर सकते हैं। उप-स्वामी गणना की सटीकता के लिए सही जन्म समय अनिवार्य है — 2 मिनट का अन्तर भी सन्धि उप-स्वामी बदल सकता है, इसीलिए केपी ज्योतिषी जन्म समय शोधन के सबसे प्रबल समर्थकों में हैं।', sa: 'कम्प्यूटर से पहले, केपी अभ्यासकर्ताओं को मुद्रित पुस्तकों से 249 उप-स्वामी सारणी मैनुअली खोजनी पड़ती थी — एक थकाऊ और त्रुटि-प्रवण प्रक्रिया। आज हमारा केपी सिस्टम उपकरण कुण्डली में प्रत्येक ग्रह और भाव सन्धि का राशि स्वामी, नक्षत्र स्वामी और उप स्वामी तत्काल गणित करता है। इस स्वचालन ने केपी ज्योतिष का लोकतन्त्रीकरण किया है, जिससे विद्यार्थी सारणी खोज के बजाय व्याख्या पर ध्यान केन्द्रित कर सकते हैं। उप-स्वामी गणना की सटीकता के लिए सही जन्म समय अनिवार्य है — 2 मिनट का अन्तर भी सन्धि उप-स्वामी बदल सकता है, इसीलिए केपी ज्योतिषी जन्म समय शोधन के सबसे प्रबल समर्थकों में हैं।' }, locale)}
        </p>
      </section>
    </div>
  );
}

export default function Module20_2Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

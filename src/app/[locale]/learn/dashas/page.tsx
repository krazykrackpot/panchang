'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';

const L = {
  title: { en: 'Dashas — Planetary Periods', hi: 'दशा — ग्रह अवधियाँ', sa: 'दशाः — ग्रहकालखण्डाः' },
  subtitle: { en: 'The timing system that unfolds destiny through a 120-year planetary cycle', hi: '120 वर्षों की ग्रह चक्र से भाग्य को प्रकट करने वाली समय प्रणाली', sa: '120 वर्षाणां ग्रहचक्रेण भाग्यं प्रकटयतीति कालप्रणालिः' },
  whatTitle: { en: 'What is a Dasha?', hi: 'दशा क्या है?', sa: 'दशा का?' },
  whatContent: {
    en: 'A Dasha is a planetary period — a span of time ruled by a specific Graha. The Vimshottari Dasha system ("Dasha of 120") is the most widely used timing system in Vedic astrology. It divides an entire lifetime into major periods (Maha Dasha), each governed by one of the nine Grahas. The sequence and starting point are determined by the Moon\'s Nakshatra at birth.',
    hi: 'दशा एक ग्रह अवधि है — एक विशिष्ट ग्रह द्वारा शासित समय का अन्तराल। विंशोत्तरी दशा प्रणाली ("120 की दशा") वैदिक ज्योतिष में सबसे व्यापक रूप से प्रयुक्त समय प्रणाली है। यह सम्पूर्ण जीवनकाल को महादशाओं में विभाजित करती है।',
    sa: 'दशा ग्रहकालखण्डः — विशिष्टग्रहेण शासितः कालान्तरः। विंशोत्तरीदशापद्धतिः वैदिकज्योतिषे सर्वाधिकप्रचलिता कालपद्धतिः।'
  },
  whatContent2: {
    en: 'The concept is rooted in Parashari Jyotish: each planet "rules" certain years of your life, activating the houses it owns and occupies in your birth chart. During a planet\'s Dasha, that planet becomes the primary driver of events — its strength, placement, and associations colour everything from career to health to relationships.',
    hi: 'यह अवधारणा पाराशरी ज्योतिष में निहित है: प्रत्येक ग्रह आपके जीवन के कुछ वर्षों पर "शासन" करता है, जन्म कुण्डली में उसके स्वामित्व और स्थिति वाले भावों को सक्रिय करता है। किसी ग्रह की दशा के दौरान, वह ग्रह घटनाओं का प्राथमिक चालक बन जाता है।',
    sa: 'एषा अवधारणा पाराशरज्योतिषे निहिता — प्रत्येकः ग्रहः जीवनस्य कानिचित् वर्षाणि शासति, जन्मकुण्डल्यां स्वभावान् सक्रियान् करोति।'
  },
  vimshottariTitle: { en: 'The Vimshottari System — 120 Years', hi: 'विंशोत्तरी प्रणाली — 120 वर्ष', sa: 'विंशोत्तरीपद्धतिः — 120 वर्षाणि' },
  vimshottariContent: {
    en: 'The nine Maha Dashas follow a fixed sequence, each lasting a specific number of years. The total cycle spans 120 years. The sequence follows the Nakshatra lords in Vimshottari order: Ketu (7) → Venus (20) → Sun (6) → Moon (10) → Mars (7) → Rahu (18) → Jupiter (16) → Saturn (19) → Mercury (17).',
    hi: 'नौ महादशाएँ एक निश्चित क्रम में आती हैं, प्रत्येक निर्धारित वर्षों तक चलती है। कुल चक्र 120 वर्ष का होता है। क्रम विंशोत्तरी क्रम में नक्षत्र स्वामियों का अनुसरण करता है।',
    sa: 'नव महादशाः निश्चितक्रमेण आगच्छन्ति। सम्पूर्णचक्रं 120 वर्षाणि।'
  },
  vimshottariContent2: {
    en: 'Why 120 years? Parashari texts define a full human lifespan as 120 years (Param Ayush). The number has mathematical elegance — it allows clean fractional division across 9 planets for sub-period calculations. The system is prescribed for all charts where the Moon is strong; when the Moon is weak (e.g., in the 6th/8th house or heavily afflicted), some astrologers prefer alternative systems.',
    hi: '120 वर्ष क्यों? पाराशरी ग्रन्थ पूर्ण मानव आयु 120 वर्ष (परम आयुष) परिभाषित करते हैं। यह संख्या गणितीय रूप से सुन्दर है — 9 ग्रहों में उप-अवधि गणना के लिए स्वच्छ भिन्नात्मक विभाजन की अनुमति देती है।',
    sa: 'किमर्थं 120 वर्षाणि? पाराशरग्रन्थाः पूर्णमानवायुः 120 वर्षाणि (परमायुषम्) परिभाषयन्ति।'
  },
  birthNakshatraTitle: { en: 'How Birth Nakshatra Determines Your Starting Dasha', hi: 'जन्म नक्षत्र आपकी प्रारम्भिक दशा कैसे निर्धारित करता है', sa: 'जन्मनक्षत्रं प्रारम्भिकदशां कथं निर्धारयति' },
  birthNakshatraContent: {
    en: 'Each of the 27 Nakshatras is ruled by one of the 9 Dasha planets. The 27 Nakshatras are divided into 3 groups of 9, and each group cycles through the same sequence: Ketu, Venus, Sun, Moon, Mars, Rahu, Jupiter, Saturn, Mercury. Your birth Nakshatra\'s ruler determines which Maha Dasha is running at birth.',
    hi: '27 नक्षत्रों में से प्रत्येक 9 दशा ग्रहों में से एक द्वारा शासित है। 27 नक्षत्र 9 के 3 समूहों में विभाजित हैं, और प्रत्येक समूह उसी क्रम में चक्र करता है। आपके जन्म नक्षत्र का स्वामी निर्धारित करता है कि जन्म पर कौन सी महादशा चल रही है।',
    sa: '27 नक्षत्राणां प्रत्येकं 9 दशाग्रहेषु एकेन शासितम्। 27 नक्षत्राणि 9 इति 3 समूहेषु विभज्यन्ते।'
  },
  calcTitle: { en: 'Calculating Dasha Balance at Birth', hi: 'जन्म पर दशा शेष की गणना', sa: 'जन्मसमये दशाशेषस्य गणना' },
  calcContent: {
    en: 'Your Dasha starting point depends on the Moon\'s exact position in its Nakshatra at birth. The Nakshatra lord determines which Dasha you\'re born into, and the Moon\'s progress through that Nakshatra determines how much of that Dasha remains.',
    hi: 'आपकी दशा का प्रारम्भ बिन्दु जन्म के समय चन्द्र की नक्षत्र में सटीक स्थिति पर निर्भर करता है। नक्षत्र स्वामी यह निर्धारित करता है कि आप किस दशा में जन्मे हैं।',
    sa: 'दशायाः प्रारम्भबिन्दुः जन्मसमये चन्द्रस्य नक्षत्रे सूक्ष्मस्थित्यां निर्भरम्।'
  },
  subTitle: { en: 'Sub-Periods: Antardasha, Pratyantardasha & Beyond', hi: 'उप-अवधियाँ: अन्तर्दशा, प्रत्यन्तरदशा और आगे', sa: 'उपकालखण्डाः: अन्तर्दशा, प्रत्यन्तरदशा च ततः परम्' },
  subContent: {
    en: 'Each Maha Dasha is subdivided into 9 Antardashas (sub-periods), which follow the same Vimshottari sequence starting from the Maha Dasha lord. Each Antardasha is further divided into 9 Pratyantardashas, and so on for even finer timing (Sookshma, Prana). Our software calculates down to the Antardasha level.',
    hi: 'प्रत्येक महादशा 9 अन्तर्दशाओं में विभाजित होती है, जो महादशा स्वामी से प्रारम्भ होकर उसी विंशोत्तरी क्रम में आती हैं। प्रत्येक अन्तर्दशा 9 प्रत्यन्तरदशाओं में विभाजित होती है।',
    sa: 'प्रत्येका महादशा 9 अन्तर्दशासु विभज्यते।'
  },
  subContent2: {
    en: 'The hierarchy of precision: Maha Dasha (years) → Antardasha (months) → Pratyantardasha (weeks) → Sookshma Dasha (days) → Prana Dasha (hours). For most practical predictions, the Maha Dasha and Antardasha combination is sufficient. The Pratyantardasha is used for precise event timing — pinpointing the exact month or week when something manifests.',
    hi: 'सटीकता का क्रम: महादशा (वर्ष) → अन्तर्दशा (माह) → प्रत्यन्तरदशा (सप्ताह) → सूक्ष्म दशा (दिन) → प्राण दशा (घण्टे)। अधिकांश व्यावहारिक भविष्यवाणियों के लिए महादशा और अन्तर्दशा का संयोजन पर्याप्त है।',
    sa: 'सूक्ष्मतायाः क्रमः: महादशा (वर्षाणि) → अन्तर्दशा (मासाः) → प्रत्यन्तरदशा (सप्ताहाः) → सूक्ष्मदशा (दिनानि) → प्राणदशा (होराः)।'
  },
  otherTitle: { en: 'Other Dasha Systems', hi: 'अन्य दशा प्रणालियाँ', sa: 'अन्यदशापद्धतयः' },
  otherContent: {
    en: 'While Vimshottari is the most widely used, Jyotish texts describe over 40 dasha systems. Each has specific conditions when it is most appropriate:',
    hi: 'विंशोत्तरी सबसे व्यापक रूप से प्रयुक्त है, लेकिन ज्योतिष ग्रन्थों में 40 से अधिक दशा प्रणालियाँ वर्णित हैं। प्रत्येक की विशिष्ट शर्तें हैं जब यह सर्वाधिक उपयुक्त होती है:',
    sa: 'विंशोत्तरी सर्वाधिकप्रचलिता, परन्तु ज्योतिषग्रन्थेषु 40 अधिकदशापद्धतयः वर्णिताः।'
  },
  interpretTitle: { en: 'How to Interpret Dashas', hi: 'दशा की व्याख्या कैसे करें', sa: 'दशाव्याख्या कथं करणीया' },
  interpretContent: {
    en: 'A Dasha period activates the planet\'s significations based on its placement in your chart. The results depend on: (1) Which houses the Dasha lord owns, (2) Which house it occupies, (3) Which planets it\'s associated with or aspected by, (4) Its strength (exalted, debilitated, combust, etc.), and (5) The Antardasha lord\'s relationship to the Maha Dasha lord.',
    hi: 'दशा काल ग्रह के संकेतों को उसकी कुण्डली में स्थिति के आधार पर सक्रिय करता है। परिणाम निर्भर करते हैं: (1) दशा स्वामी कौन से भाव का स्वामी है, (2) वह किस भाव में बैठा है, (3) कौन से ग्रह उससे सम्बन्धित हैं, (4) उसका बल, और (5) अन्तर्दशा स्वामी का महादशा स्वामी से सम्बन्ध।',
    sa: 'दशाकालः ग्रहस्य सङ्केतान् सक्रियं करोति।'
  },
  workedExampleTitle: { en: 'Worked Example: Dasha Balance Calculation', hi: 'कार्यशील उदाहरण: दशा शेष गणना', sa: 'कार्यशीलोदाहरणम्: दशाशेषगणना' },
  workedExampleContent: {
    en: 'Let us walk through a complete example. Suppose someone is born with Moon at 14 degrees 30 minutes in Aries.',
    hi: 'एक पूर्ण उदाहरण देखते हैं। मान लीजिये कोई मेष राशि में चन्द्र 14 अंश 30 कला पर जन्मा है।',
    sa: 'एकं पूर्णोदाहरणं पश्यामः। कश्चित् मेषराशौ चन्द्रेण 14 अंशे 30 कलायां जातः।'
  },
  preferenceTitle: { en: 'When to Use Which Dasha System', hi: 'कौन सी दशा प्रणाली कब प्रयोग करें', sa: 'कदा कां दशापद्धतिं प्रयोजयेत्' },
  modulesTitle: { en: 'Related Lesson Modules', hi: 'सम्बन्धित पाठ मॉड्यूल', sa: 'सम्बद्धपाठखण्डाः' },
  tryIt: { en: 'See Your Dasha Periods in Kundali', hi: 'अपनी दशा अवधियाँ कुण्डली में देखें', sa: 'स्वदशाकालखण्डान् कुण्डल्यां पश्यतु' },

  findYourTitle: { en: 'Finding Your Current Dasha', hi: 'अपनी वर्तमान दशा खोजना', sa: 'स्ववर्तमानदशां ज्ञातुम्' },
  findYourContent: {
    en: 'To find your current Dasha, generate your Kundali on this site and navigate to the Dashas tab. The system automatically calculates your complete Vimshottari Dasha timeline from birth based on your Moon\'s Nakshatra position. The currently active Maha Dasha is highlighted, along with the running Antardasha within it. You can see past periods and future ones stretching across your entire 120-year cycle.',
    hi: 'अपनी वर्तमान दशा जानने के लिए इस साइट पर कुण्डली बनाएँ और दशा टैब पर जाएँ। प्रणाली स्वचालित रूप से आपके चन्द्र नक्षत्र की स्थिति से जन्म से पूर्ण विंशोत्तरी दशा समयरेखा गणना करती है। वर्तमान सक्रिय महादशा और उसमें चल रही अन्तर्दशा हाइलाइट की जाती है।',
    sa: 'स्ववर्तमानदशां ज्ञातुं अत्र कुण्डलीं जनयतु दशापत्रं च गच्छतु। पद्धतिः स्वयमेव चन्द्रनक्षत्रस्थित्या जन्मतः पूर्णां विंशोत्तरीदशासमयरेखां गणयति।'
  },
  findYourContent2: {
    en: 'Pay attention to the transition dates between Maha Dashas and between Antardashas — these are the periods of maximum change and adjustment. If you are near a Dasha transition (within 6-12 months), the themes of both the outgoing and incoming Dasha lord will be active simultaneously, creating a blended period.',
    hi: 'महादशाओं और अन्तर्दशाओं के बीच संक्रमण तिथियों पर ध्यान दें — ये अधिकतम परिवर्तन और समायोजन की अवधियाँ हैं। यदि आप दशा संक्रमण के निकट (6-12 माह के भीतर) हैं, तो जाने वाली और आने वाली दशा दोनों के स्वामी के विषय एक साथ सक्रिय होंगे।',
    sa: 'महादशान्तर्दशानां मध्ये सङ्क्रमणतिथिषु अवधानं ददातु — एते अधिकतमपरिवर्तनस्य कालाः।'
  },

  antardashaCalcTitle: { en: 'Antardasha Calculation — A Worked Example', hi: 'अन्तर्दशा गणना — एक कार्यशील उदाहरण', sa: 'अन्तर्दशागणना — कार्यशीलोदाहरणम्' },
  antardashaCalcContent: {
    en: 'Each Maha Dasha is divided into 9 Antardashas proportional to each planet\'s total Dasha years. The formula is: Antardasha duration = (Maha Dasha years x Antardasha planet years) / 120. The sequence starts with the Maha Dasha lord\'s own Antardasha, then follows the Vimshottari order.',
    hi: 'प्रत्येक महादशा 9 अन्तर्दशाओं में विभाजित होती है जो प्रत्येक ग्रह के कुल दशा वर्षों के अनुपात में होती हैं। सूत्र: अन्तर्दशा अवधि = (महादशा वर्ष x अन्तर्दशा ग्रह वर्ष) / 120। क्रम महादशा स्वामी की अपनी अन्तर्दशा से शुरू होता है।',
    sa: 'प्रत्येका महादशा 9 अन्तर्दशासु विभज्यते। सूत्रम्: अन्तर्दशाकालः = (महादशावर्षाणि x अन्तर्दशाग्रहवर्षाणि) / 120।'
  },

  mahadashaThemesTitle: { en: 'Life Themes During Each Maha Dasha', hi: 'प्रत्येक महादशा के जीवन विषय', sa: 'प्रत्येकमहादशायाः जीवनविषयाः' },
  mahadashaThemesContent: {
    en: 'Each Maha Dasha lord activates its core significations. The actual results depend on the planet\'s chart placement, but these are the universal themes each planet tends to emphasize during its rule:',
    hi: 'प्रत्येक महादशा स्वामी अपने मूल संकेतों को सक्रिय करता है। वास्तविक परिणाम ग्रह की कुण्डली स्थिति पर निर्भर हैं, लेकिन ये सार्वभौमिक विषय हैं जो प्रत्येक ग्रह अपने शासनकाल में प्रभावित करता है:',
    sa: 'प्रत्येकमहादशास्वामी स्वमूलसङ्केतान् सक्रियान् करोति।'
  },

  sandhiTitle: { en: 'Dasha Sandhi — The Turbulent Transition Zone', hi: 'दशा सन्धि — अशान्त संक्रमण क्षेत्र', sa: 'दशासन्धिः — अशान्तसङ्क्रमणक्षेत्रम्' },
  sandhiContent: {
    en: 'Dasha Sandhi (junction) is the transition period between two Maha Dashas — typically the last few months of the outgoing Dasha and the first few months of the incoming one. This period is often turbulent because the native is simultaneously experiencing the winding down of one planetary energy and the activation of a completely different one. The contrast can be disorienting.',
    hi: 'दशा सन्धि दो महादशाओं के बीच का संक्रमण काल है — सामान्यतः जाने वाली दशा के अन्तिम कुछ माह और आने वाली के पहले कुछ माह। यह काल अक्सर अशान्त होता है क्योंकि व्यक्ति एक साथ एक ग्रह ऊर्जा के समापन और दूसरी के आरम्भ का अनुभव करता है।',
    sa: 'दशासन्धिः द्वयोः महादशयोः मध्ये सङ्क्रमणकालः — गच्छत्याः दशायाः अन्तिमाः मासाः आगच्छन्त्याश्च प्रथमाः मासाः। एषः कालः प्रायः अशान्तः।'
  },
  sandhiContent2: {
    en: 'The degree of turbulence depends on how different the two Dasha lords are. A transition from Jupiter to Saturn (wisdom to discipline) or from Venus to Sun (luxury to authority) creates more friction than Jupiter to Mercury (both intellectual planets). During Sandhi, avoid major life decisions if possible — let the new energy settle before committing to irreversible choices.',
    hi: 'अशान्ति की मात्रा इस पर निर्भर करती है कि दोनों दशा स्वामी कितने भिन्न हैं। गुरु से शनि (ज्ञान से अनुशासन) या शुक्र से सूर्य (विलास से अधिकार) का संक्रमण गुरु से बुध (दोनों बौद्धिक) की तुलना में अधिक घर्षण पैदा करता है। सन्धि काल में यदि सम्भव हो तो बड़े जीवन निर्णय टालें।',
    sa: 'अशान्तेः मात्रा दशास्वामिनोः भिन्नतायां निर्भरा। सन्धिकाले यदि शक्यं प्रमुखजीवननिर्णयान् परिहरेत्।'
  },

  eventTimingTitle: { en: 'Event Timing — Which Dasha Brings What', hi: 'घटना समय — कौन सी दशा क्या लाती है', sa: 'घटनाकालनिर्धारणम् — का दशा किं आनयति' },
  eventTimingContent: {
    en: 'Certain life events are strongly correlated with specific Dasha periods. While the exact outcome depends on the chart, experienced astrologers look for these classical combinations when timing events:',
    hi: 'कुछ जीवन घटनाएँ विशिष्ट दशा अवधियों से दृढ़ता से सम्बन्धित हैं। सटीक परिणाम कुण्डली पर निर्भर है, लेकिन अनुभवी ज्योतिषी घटनाओं का समय निर्धारण करते समय इन शास्त्रीय संयोजनों को देखते हैं:',
    sa: 'कानिचित् जीवनघटनानि विशिष्टदशाकालखण्डैः दृढं सम्बद्धानि। अनुभवीज्योतिषिणः एतानि शास्त्रीयसंयोजनानि पश्यन्ति:'
  },
};

const DASHA_PERIODS = [
  { planet: 'Ketu', planetHi: 'केतु', planetSa: 'केतुः', years: 7, color: '#9ca3af', nakshatras: 'Ashwini, Magha, Moola', nakshatrasHi: 'अश्विनी, मघा, मूल' },
  { planet: 'Venus', planetHi: 'शुक्र', planetSa: 'शुक्रः', years: 20, color: '#ec4899', nakshatras: 'Bharani, P.Phalguni, P.Ashadha', nakshatrasHi: 'भरणी, पू.फाल्गुनी, पू.आषाढ़ा' },
  { planet: 'Sun', planetHi: 'सूर्य', planetSa: 'सूर्यः', years: 6, color: '#f59e0b', nakshatras: 'Krittika, U.Phalguni, U.Ashadha', nakshatrasHi: 'कृत्तिका, उ.फाल्गुनी, उ.आषाढ़ा' },
  { planet: 'Moon', planetHi: 'चन्द्र', planetSa: 'चन्द्रः', years: 10, color: '#e2e8f0', nakshatras: 'Rohini, Hasta, Shravana', nakshatrasHi: 'रोहिणी, हस्त, श्रवण' },
  { planet: 'Mars', planetHi: 'मंगल', planetSa: 'मङ्गलः', years: 7, color: '#ef4444', nakshatras: 'Mrigashira, Chitra, Dhanishta', nakshatrasHi: 'मृगशिरा, चित्रा, धनिष्ठा' },
  { planet: 'Rahu', planetHi: 'राहु', planetSa: 'राहुः', years: 18, color: '#6366f1', nakshatras: 'Ardra, Swati, Shatabhisha', nakshatrasHi: 'आर्द्रा, स्वाती, शतभिषा' },
  { planet: 'Jupiter', planetHi: 'गुरु', planetSa: 'गुरुः', years: 16, color: '#f0d48a', nakshatras: 'Punarvasu, Vishakha, P.Bhadra', nakshatrasHi: 'पुनर्वसु, विशाखा, पू.भाद्रपद' },
  { planet: 'Saturn', planetHi: 'शनि', planetSa: 'शनिः', years: 19, color: '#3b82f6', nakshatras: 'Pushya, Anuradha, U.Bhadra', nakshatrasHi: 'पुष्य, अनुराधा, उ.भाद्रपद' },
  { planet: 'Mercury', planetHi: 'बुध', planetSa: 'बुधः', years: 17, color: '#22c55e', nakshatras: 'Ashlesha, Jyeshtha, Revati', nakshatrasHi: 'आश्लेषा, ज्येष्ठा, रेवती' },
];

const OTHER_DASHA_SYSTEMS = [
  {
    name: { en: 'Yogini Dasha', hi: 'योगिनी दशा', sa: 'योगिनीदशा' },
    cycle: '36 years',
    planets: '8',
    desc: { en: 'Uses 8 Yoginis (Mangala, Pingala, Dhanya, Bhramari, Bhadrika, Ulka, Siddha, Sankata) mapped to planets. Shorter cycle makes it effective for quick-results timing. Popular in North India.', hi: '8 योगिनियों का उपयोग — छोटा चक्र त्वरित फल समय निर्धारण के लिए प्रभावी। उत्तर भारत में लोकप्रिय।', sa: '8 योगिनीनां प्रयोगः — लघुचक्रं त्वरितफलकालनिर्धारणे प्रभावी।' },
    when: { en: 'Quick timing, North Indian tradition, when Vimshottari seems off', hi: 'त्वरित समय, उत्तर भारतीय परम्परा', sa: 'त्वरितकालनिर्धारणम्' },
  },
  {
    name: { en: 'Ashtottari Dasha', hi: 'अष्टोत्तरी दशा', sa: 'अष्टोत्तरीदशा' },
    cycle: '108 years',
    planets: '8 (excludes Ketu)',
    desc: { en: 'A 108-year cycle using 8 planets (Ketu excluded). Prescribed when Rahu is in a Kendra or Trikona from Lagna lord, or when birth is during Krishna Paksha daytime or Shukla Paksha nighttime.', hi: '108 वर्ष का चक्र, 8 ग्रह (केतु छोड़कर)। राहु लग्नेश से केन्द्र या त्रिकोण में हो तब विहित।', sa: '108 वर्षाणां चक्रं, 8 ग्रहाः (केतुः वर्जितः)।' },
    when: { en: 'Rahu in Kendra/Trikona from Lagna lord, specific birth-time conditions', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में', sa: 'राहुः लग्नेशात् केन्द्रे/त्रिकोणे' },
  },
  {
    name: { en: 'Chara Dasha (Jaimini)', hi: 'चर दशा (जैमिनी)', sa: 'चरदशा (जैमिनीया)' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'A sign-based (rashi) dasha from Jaimini system. Each sign runs for a period determined by its lord\'s distance from it. Uses Chara Karakas (variable significators) instead of fixed planetary rulers. Powerful for career and relationship timing.', hi: 'जैमिनी प्रणाली की राशि-आधारित दशा। प्रत्येक राशि उसके स्वामी की दूरी से निर्धारित अवधि तक चलती है। चर कारकों का प्रयोग।', sa: 'जैमिनीपद्धत्याः राश्याधारिता दशा।' },
    when: { en: 'Jaimini astrology, career/relationship predictions, sign-based analysis', hi: 'जैमिनी ज्योतिष, करियर/सम्बन्ध भविष्यवाणी', sa: 'जैमिनीज्योतिषम्, जीविका/सम्बन्धभविष्यवाणी' },
  },
  {
    name: { en: 'Kalachakra Dasha', hi: 'कालचक्र दशा', sa: 'कालचक्रदशा' },
    cycle: 'Variable',
    planets: 'Sign-based',
    desc: { en: 'An extremely complex sign-based dasha that moves in a serpentine (savya/apsavya) pattern through the zodiac. Considered highly accurate by scholars but difficult to compute manually. Based on the Moon\'s Navamsa position.', hi: 'अत्यन्त जटिल राशि-आधारित दशा जो सर्पाकार (सव्य/अपसव्य) पैटर्न में चलती है। विद्वानों द्वारा अत्यन्त सटीक माना जाता है।', sa: 'अत्यन्तजटिला राश्याधारिता दशा या सर्पाकारपद्धत्या चलति।' },
    when: { en: 'Advanced practitioners, when other systems give contradictory results', hi: 'उन्नत अभ्यासकर्ता, जब अन्य प्रणालियाँ विरोधाभासी परिणाम दें', sa: 'उन्नतप्रयोक्तारः' },
  },
];

const MAHADASHA_THEMES = [
  { planet: 'Ketu', planetHi: 'केतु', years: 7, color: '#9ca3af', themes: { en: 'Spiritual awakening, detachment, loss and letting go, past-life karma surfacing, sudden changes, isolation, research, occult interests. Often starts life with confusion about direction.', hi: 'आध्यात्मिक जागृति, वैराग्य, हानि, पूर्वजन्म कर्म, अचानक परिवर्तन, एकान्त, शोध, गूढ़ रुचियाँ।' } },
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, color: '#ec4899', themes: { en: 'Romance, marriage, luxury, artistic pursuits, vehicles, comfort, financial gains, beauty, partnerships. The longest Dasha — often defines the prime creative and romantic years.', hi: 'रोमांस, विवाह, विलास, कलात्मक गतिविधियाँ, वाहन, आराम, वित्तीय लाभ, सौन्दर्य। सबसे लम्बी दशा — प्रमुख रचनात्मक और रोमांटिक वर्षों को परिभाषित करती है।' } },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, color: '#f59e0b', themes: { en: 'Career authority, government connections, father-related events, self-confidence, leadership, health vitality, ego development, recognition. Short but impactful.', hi: 'करियर अधिकार, सरकारी सम्पर्क, पिता सम्बन्धित घटनाएँ, आत्मविश्वास, नेतृत्व, स्वास्थ्य, मान्यता। छोटी लेकिन प्रभावशाली।' } },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, color: '#e2e8f0', themes: { en: 'Emotional growth, mother-related events, mental peace (or disturbance if afflicted), travel, public life, nurturing, domestic changes, intuition development.', hi: 'भावनात्मक विकास, माता सम्बन्धित घटनाएँ, मानसिक शान्ति, यात्रा, सार्वजनिक जीवन, पोषण, घरेलू परिवर्तन, अन्तर्ज्ञान।' } },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, color: '#ef4444', themes: { en: 'Property, land, siblings, courage, surgery, competition, physical energy, technical skills, disputes, construction. High-energy period with risk of accidents if afflicted.', hi: 'सम्पत्ति, भूमि, भाई-बहन, साहस, शल्य, प्रतियोगिता, शारीरिक ऊर्जा, तकनीकी कौशल, विवाद। उच्च-ऊर्जा काल।' } },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, color: '#6366f1', themes: { en: 'Foreign connections, unconventional paths, technology, obsessive desires, material ambition, illusions, sudden rise or fall, breaking taboos, innovation. Can give extraordinary worldly success or deep confusion.', hi: 'विदेश सम्पर्क, अपरम्परागत मार्ग, प्रौद्योगिकी, जुनूनी इच्छाएँ, भौतिक महत्वाकांक्षा, माया, अचानक उत्थान या पतन। असाधारण सांसारिक सफलता या गहरा भ्रम।' } },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, color: '#f0d48a', themes: { en: 'Wisdom, children, education, dharma, wealth expansion, marriage (for women), spiritual growth, teaching, legal matters, optimism. Generally the most auspicious period.', hi: 'ज्ञान, संतान, शिक्षा, धर्म, धन विस्तार, विवाह (महिलाओं के लिए), आध्यात्मिक वृद्धि, शिक्षण। सामान्यतः सर्वाधिक शुभ काल।' } },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, color: '#3b82f6', themes: { en: 'Hard work, discipline, career structure, service, longevity, chronic health matters, karma, delays that build character, responsibility, democratic values, justice. Slow but lasting results.', hi: 'कठिन परिश्रम, अनुशासन, करियर संरचना, सेवा, दीर्घायु, दीर्घकालिक स्वास्थ्य, कर्म, चरित्र निर्माण, उत्तरदायित्व। धीमे लेकिन स्थायी परिणाम।' } },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, color: '#22c55e', themes: { en: 'Business, commerce, communication, writing, learning, friendships, intellectual pursuits, adaptability, travel for education, maternal uncle. Period of mental agility and versatility.', hi: 'व्यापार, वाणिज्य, संवाद, लेखन, विद्या, मित्रता, बौद्धिक गतिविधियाँ, अनुकूलनशीलता। मानसिक चपलता और बहुमुखता का काल।' } },
];

const VENUS_ANTARDASHA_EXAMPLE = [
  { planet: 'Venus', planetHi: 'शुक्र', years: 20, duration: '(20x20)/120 = 3y 4m', durationHi: '(20x20)/120 = 3 वर्ष 4 माह' },
  { planet: 'Sun', planetHi: 'सूर्य', years: 6, duration: '(20x6)/120 = 1y 0m', durationHi: '(20x6)/120 = 1 वर्ष 0 माह' },
  { planet: 'Moon', planetHi: 'चन्द्र', years: 10, duration: '(20x10)/120 = 1y 8m', durationHi: '(20x10)/120 = 1 वर्ष 8 माह' },
  { planet: 'Mars', planetHi: 'मंगल', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
  { planet: 'Rahu', planetHi: 'राहु', years: 18, duration: '(20x18)/120 = 3y 0m', durationHi: '(20x18)/120 = 3 वर्ष 0 माह' },
  { planet: 'Jupiter', planetHi: 'गुरु', years: 16, duration: '(20x16)/120 = 2y 8m', durationHi: '(20x16)/120 = 2 वर्ष 8 माह' },
  { planet: 'Saturn', planetHi: 'शनि', years: 19, duration: '(20x19)/120 = 3y 2m', durationHi: '(20x19)/120 = 3 वर्ष 2 माह' },
  { planet: 'Mercury', planetHi: 'बुध', years: 17, duration: '(20x17)/120 = 2y 10m', durationHi: '(20x17)/120 = 2 वर्ष 10 माह' },
  { planet: 'Ketu', planetHi: 'केतु', years: 7, duration: '(20x7)/120 = 1y 2m', durationHi: '(20x7)/120 = 1 वर्ष 2 माह' },
];

const EVENT_TIMING = [
  { event: { en: 'Marriage', hi: 'विवाह' }, dashas: { en: 'Venus Dasha, Jupiter Dasha (for women), 7th lord Dasha, Venus Antardasha in any benefic Dasha', hi: 'शुक्र दशा, गुरु दशा (महिलाओं के लिए), 7वें स्वामी की दशा, किसी शुभ दशा में शुक्र अन्तर्दशा' }, color: '#ec4899' },
  { event: { en: 'Career Rise', hi: 'करियर उन्नति' }, dashas: { en: 'Sun Dasha, Saturn Dasha (10th lord), 10th lord Dasha, Yogakaraka Dasha. Saturn-Sun or Sun-Saturn periods for government positions.', hi: 'सूर्य दशा, शनि दशा (10वाँ स्वामी), 10वें स्वामी की दशा, योगकारक दशा। सरकारी पदों के लिए शनि-सूर्य या सूर्य-शनि।' }, color: '#f59e0b' },
  { event: { en: 'Children', hi: 'संतान' }, dashas: { en: 'Jupiter Dasha (primary karaka for children), 5th lord Dasha, Venus Antardasha in Jupiter Dasha, Putrakaraka Dasha (Jaimini).', hi: 'गुरु दशा (संतान का प्रमुख कारक), 5वें स्वामी की दशा, गुरु दशा में शुक्र अन्तर्दशा।' }, color: '#f0d48a' },
  { event: { en: 'Education', hi: 'शिक्षा' }, dashas: { en: 'Mercury Dasha, Jupiter Dasha, 4th/5th/9th lord Dasha. Higher education peaks during Jupiter periods; technical skills during Mercury or Mars.', hi: 'बुध दशा, गुरु दशा, 4/5/9वें स्वामी की दशा। उच्च शिक्षा गुरु काल में; तकनीकी कौशल बुध या मंगल में।' }, color: '#22c55e' },
  { event: { en: 'Foreign Travel/Settlement', hi: 'विदेश यात्रा/बसना' }, dashas: { en: 'Rahu Dasha (primary), 12th lord Dasha, Moon Dasha (if 12th lord or in 12th), Ketu Dasha for spiritual pilgrimages abroad.', hi: 'राहु दशा (प्रमुख), 12वें स्वामी की दशा, चन्द्र दशा (12वें स्वामी या 12वें में हो), आध्यात्मिक विदेश यात्रा के लिए केतु दशा।' }, color: '#6366f1' },
  { event: { en: 'Health Crisis', hi: 'स्वास्थ्य संकट' }, dashas: { en: 'Dasha of planets in 6th/8th house, Dasha of debilitated planets, Saturn Dasha (chronic conditions), Mars Dasha (surgery, accidents), Ketu Dasha (mysterious ailments).', hi: '6/8वें भाव के ग्रह की दशा, नीच ग्रह की दशा, शनि दशा (दीर्घकालिक), मंगल दशा (शल्य), केतु दशा (रहस्यमय रोग)।' }, color: '#ef4444' },
];

export default function LearnDashasPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : {};

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {L.title[locale]}
        </h2>
        <p className="text-text-secondary" style={bodyFont}>{L.subtitle[locale]}</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <SanskritTermCard term="Dasha" devanagari="दशा" transliteration="Dasa" meaning="Planetary Period" />
        <SanskritTermCard term="Maha Dasha" devanagari="महादशा" transliteration="Mahadasa" meaning="Major Period (years)" />
        <SanskritTermCard term="Antardasha" devanagari="अन्तर्दशा" transliteration="Antardasa" meaning="Sub-period (months)" />
        <SanskritTermCard term="Pratyantara" devanagari="प्रत्यन्तर" transliteration="Pratyantara" meaning="Sub-sub-period (days)" />
        <SanskritTermCard term="Vimshottari" devanagari="विंशोत्तरी" transliteration="Vimsottari" meaning="Of 120 (years)" />
      </div>

      {/* Section 1: What is a Dasha */}
      <LessonSection number={1} title={L.whatTitle[locale]}>
        <p style={bodyFont}>{L.whatContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.whatContent2[locale]}</p>
      </LessonSection>

      {/* Section 2: Vimshottari System */}
      <LessonSection number={2} title={L.vimshottariTitle[locale]}>
        <p style={bodyFont}>{L.vimshottariContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.vimshottariContent2[locale]}</p>

        {/* Dasha periods visual bar chart */}
        <div className="mt-6 space-y-2">
          {DASHA_PERIODS.map((d, i) => (
            <motion.div
              key={d.planet}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-3"
            >
              <div className="w-20 text-right text-sm font-semibold" style={{ color: d.color }}>
                {locale === 'en' ? d.planet : d.planetHi}
              </div>
              <div
                className="h-8 rounded-md flex items-center px-3 text-xs font-mono text-white/80"
                style={{
                  width: `${(d.years / 20) * 100}%`,
                  minWidth: '60px',
                  backgroundColor: `${d.color}33`,
                  border: `1px solid ${d.color}55`,
                }}
              >
                {d.years} {locale === 'en' ? 'yrs' : 'वर्ष'}
              </div>
              <div className="text-text-secondary/60 text-xs hidden sm:block">
                {isHi ? d.nakshatrasHi : d.nakshatras}
              </div>
            </motion.div>
          ))}
          <div className="mt-2 text-center text-text-secondary/50 text-xs font-mono">
            Total: 7+20+6+10+7+18+16+19+17 = 120 {locale === 'en' ? 'years' : 'वर्ष'}
          </div>
        </div>
      </LessonSection>

      {/* Section 3: Full reference table */}
      <LessonSection number={3} title={L.birthNakshatraTitle[locale]}>
        <p style={bodyFont}>{L.birthNakshatraContent[locale]}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 border border-gold-primary/10 overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? 'Planet' : 'ग्रह'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? 'Years' : 'वर्ष'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? 'Ruling Nakshatras (1-9)' : 'शासित नक्षत्र (1-9)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? '(10-18)' : '(10-18)'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? '(19-27)' : '(19-27)'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {DASHA_PERIODS.map((d) => {
                const naks = d.nakshatras.split(', ');
                return (
                  <tr key={d.planet} className="hover:bg-gold-primary/3">
                    <td className="py-2 px-2 font-medium" style={{ color: d.color }}>
                      {locale === 'en' ? d.planet : d.planetHi}
                    </td>
                    <td className="py-2 px-2 text-text-secondary font-mono">{d.years}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[0]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[1]}</td>
                    <td className="py-2 px-2 text-text-secondary">{naks[2]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </LessonSection>

      {/* Section 4: Calculating Dasha Balance */}
      <LessonSection number={4} title={L.calcTitle[locale]}>
        <p style={bodyFont}>{L.calcContent[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Step-by-Step Calculation:' : 'चरणबद्ध गणना:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">1. {locale === 'en' ? 'Find Moon\'s Nakshatra at birth (e.g., Pushya)' : 'जन्म के समय चन्द्र का नक्षत्र ज्ञात करें (जैसे, पुष्य)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">2. {locale === 'en' ? 'Nakshatra lord = Dasha lord at birth (Pushya lord = Saturn)' : 'नक्षत्र स्वामी = जन्म पर दशा स्वामी (पुष्य स्वामी = शनि)'}</p>
          <p className="text-gold-light/80 font-mono text-xs">3. {locale === 'en' ? 'Moon\'s progress through Nakshatra = elapsed portion of Dasha' : 'नक्षत्र में चन्द्र की प्रगति = दशा का बीता हुआ भाग'}</p>
          <p className="text-gold-light/80 font-mono text-xs mt-2">
            {locale === 'en' ? 'Example: Moon at 10° in Pushya (3°20\' to 16°40\')' : 'उदाहरण: पुष्य में चन्द्र 10° पर (3°20\' से 16°40\')'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' ? 'Progress = (10° - 3.333°) / 13.333° = 50%' : 'प्रगति = (10° - 3.333°) / 13.333° = 50%'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en' ? 'Remaining Saturn Dasha = 19 × (1 - 0.50) = 9.5 years' : 'शेष शनि दशा = 19 × (1 - 0.50) = 9.5 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 5: Worked example */}
      <LessonSection number={5} title={L.workedExampleTitle[locale]}>
        <p style={bodyFont}>{L.workedExampleContent[locale]}</p>
        <div className="mt-4 space-y-3">
          <div className="p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
            <p className="text-gold-light font-mono text-sm mb-3">
              {locale === 'en' ? 'Given: Moon at 14°30\' Aries (Mesha)' : 'दिया गया: मेष में चन्द्र 14°30\' पर'}
            </p>
            <div className="space-y-1.5 text-gold-light/80 font-mono text-xs">
              <p>{locale === 'en' ? 'Step 1: Identify Nakshatra' : 'चरण 1: नक्षत्र पहचानें'}</p>
              <p className="pl-4">{locale === 'en' ? '14°30\' Aries falls in Bharani (13°20\' - 26°40\' Aries)' : '14°30\' मेष भरणी में आता है (13°20\' - 26°40\' मेष)'}</p>
              <p className="mt-2">{locale === 'en' ? 'Step 2: Nakshatra lord' : 'चरण 2: नक्षत्र स्वामी'}</p>
              <p className="pl-4">{locale === 'en' ? 'Bharani lord = Venus → Birth Dasha = Venus Maha Dasha' : 'भरणी स्वामी = शुक्र → जन्म दशा = शुक्र महादशा'}</p>
              <p className="mt-2">{locale === 'en' ? 'Step 3: Calculate progress through Nakshatra' : 'चरण 3: नक्षत्र में प्रगति गणना'}</p>
              <p className="pl-4">{locale === 'en' ? 'Moon position within Bharani = 14°30\' - 13°20\' = 1°10\' = 1.167°' : 'भरणी में चन्द्र स्थिति = 14°30\' - 13°20\' = 1°10\' = 1.167°'}</p>
              <p className="pl-4">{locale === 'en' ? 'Nakshatra span = 13°20\' = 13.333°' : 'नक्षत्र विस्तार = 13°20\' = 13.333°'}</p>
              <p className="pl-4">{locale === 'en' ? 'Progress = 1.167 / 13.333 = 8.75% elapsed' : 'प्रगति = 1.167 / 13.333 = 8.75% बीता'}</p>
              <p className="mt-2">{locale === 'en' ? 'Step 4: Calculate remaining Dasha' : 'चरण 4: शेष दशा गणना'}</p>
              <p className="pl-4">{locale === 'en' ? 'Venus total = 20 years' : 'शुक्र कुल = 20 वर्ष'}</p>
              <p className="pl-4">{locale === 'en' ? 'Remaining = 20 × (1 - 0.0875) = 18.25 years = 18 years 3 months' : 'शेष = 20 × (1 - 0.0875) = 18.25 वर्ष = 18 वर्ष 3 माह'}</p>
              <p className="mt-2">{locale === 'en' ? 'Step 5: Sequence after Venus' : 'चरण 5: शुक्र के बाद का क्रम'}</p>
              <p className="pl-4 text-gold-light/60">{locale === 'en'
                ? 'Venus (18y 3m remaining) → Sun (6y) → Moon (10y) → Mars (7y) → Rahu (18y) → Jupiter (16y) → Saturn (19y) → Mercury (17y) → Ketu (7y)'
                : 'शुक्र (18 वर्ष 3 माह शेष) → सूर्य (6) → चन्द्र (10) → मंगल (7) → राहु (18) → गुरु (16) → शनि (19) → बुध (17) → केतु (7)'}</p>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* Section 6: Sub-periods hierarchy */}
      <LessonSection number={6} title={L.subTitle[locale]}>
        <p style={bodyFont}>{L.subContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.subContent2[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'Antardasha Duration Formula:' : 'अन्तर्दशा अवधि सूत्र:'}
          </p>
          <p className="text-gold-light/80 font-mono text-xs">
            Antardasha of B in Maha Dasha of A = (Years_A x Years_B) / 120
          </p>
          <p className="text-gold-light/60 font-mono text-xs mt-2">
            {locale === 'en'
              ? 'Example: Mercury Antardasha in Saturn Maha Dasha = (19 x 17) / 120 = 2.69 years ~ 2 yrs 8 months 9 days'
              : 'उदाहरण: शनि महादशा में बुध अन्तर्दशा = (19 x 17) / 120 = 2.69 वर्ष ~ 2 वर्ष 8 माह 9 दिन'}
          </p>
        </div>

        {/* Sub-period hierarchy visual */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { level: { en: 'Maha Dasha', hi: 'महादशा' }, duration: { en: 'Years', hi: 'वर्ष' }, example: { en: 'Saturn: 19 years', hi: 'शनि: 19 वर्ष' }, color: 'border-gold-primary/30 bg-gold-primary/5' },
            { level: { en: 'Antardasha', hi: 'अन्तर्दशा' }, duration: { en: 'Months', hi: 'माह' }, example: { en: 'Sa-Me: 2y 8m', hi: 'शनि-बुध: 2 वर्ष 8 माह' }, color: 'border-blue-400/30 bg-blue-400/5' },
            { level: { en: 'Pratyantara', hi: 'प्रत्यन्तर' }, duration: { en: 'Weeks', hi: 'सप्ताह' }, example: { en: 'Sa-Me-Ve: ~5m', hi: 'शनि-बुध-शुक्र: ~5 माह' }, color: 'border-violet-400/30 bg-violet-400/5' },
            { level: { en: 'Sookshma', hi: 'सूक्ष्म' }, duration: { en: 'Days', hi: 'दिन' }, example: { en: '~2-10 days', hi: '~2-10 दिन' }, color: 'border-emerald-400/30 bg-emerald-400/5' },
            { level: { en: 'Prana', hi: 'प्राण' }, duration: { en: 'Hours', hi: 'घण्टे' }, example: { en: '~hours', hi: '~घण्टे' }, color: 'border-amber-400/30 bg-amber-400/5' },
          ].map((item, i) => (
            <motion.div
              key={item.level.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`rounded-lg p-3 border ${item.color}`}
            >
              <div className="text-gold-light text-xs font-bold mb-1" style={headingFont}>{isHi ? item.level.hi : item.level.en}</div>
              <div className="text-text-secondary text-[10px] font-mono">{isHi ? item.duration.hi : item.duration.en}</div>
              <div className="text-text-tertiary text-[10px] mt-1">{isHi ? item.example.hi : item.example.en}</div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 7: Other Dasha Systems */}
      <LessonSection number={7} title={L.otherTitle[locale]}>
        <p style={bodyFont}>{L.otherContent[locale]}</p>
        <div className="mt-4 space-y-3">
          {OTHER_DASHA_SYSTEMS.map((sys, i) => (
            <motion.div
              key={sys.name.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-gold-light font-bold text-sm" style={headingFont}>{sys.name[locale]}</span>
                <span className="text-text-tertiary text-[10px] font-mono">{sys.cycle} / {sys.planets} {locale === 'en' ? 'planets' : 'ग्रह'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{sys.desc[locale]}</p>
              <div className="mt-2 text-[10px] text-emerald-400/80 font-mono">
                {locale === 'en' ? 'Best used when: ' : 'सर्वोत्तम उपयोग: '}{sys.when[locale]}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 8: Interpretation */}
      <LessonSection number={8} title={L.interpretTitle[locale]} variant="highlight">
        <p style={bodyFont}>{L.interpretContent[locale]}</p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: { en: 'Benefic Dasha Lord in Kendra/Trikona', hi: 'शुभ दशा स्वामी केन्द्र/त्रिकोण में', sa: 'शुभदशास्वामी केन्द्रे/त्रिकोणे' }, result: { en: 'Prosperity, success, good health', hi: 'समृद्धि, सफलता, अच्छा स्वास्थ्य', sa: 'समृद्धिः, सफलता, सुस्वास्थ्यम्' }, color: 'emerald' },
            { label: { en: 'Dasha Lord in Dusthana (6,8,12)', hi: 'दशा स्वामी दुःस्थान (6,8,12) में', sa: 'दशास्वामी दुःस्थाने (6,8,12)' }, result: { en: 'Challenges, health issues, obstacles', hi: 'कठिनाइयाँ, स्वास्थ्य समस्याएँ, बाधाएँ', sa: 'कठिनतायाः, स्वास्थ्यसमस्याः, बाधाः' }, color: 'red' },
            { label: { en: 'Dasha Lord exalted or in own sign', hi: 'दशा स्वामी उच्च या स्वराशि में', sa: 'दशास्वामी उच्चे स्वराशौ वा' }, result: { en: 'Enhanced positive results', hi: 'उन्नत शुभ परिणाम', sa: 'उन्नतशुभफलानि' }, color: 'emerald' },
            { label: { en: 'Dasha Lord debilitated or combust', hi: 'दशा स्वामी नीच या अस्त', sa: 'दशास्वामी नीचे अस्ते वा' }, result: { en: 'Weakened results, delays', hi: 'कमज़ोर परिणाम, देरी', sa: 'दुर्बलफलानि, विलम्बः' }, color: 'amber' },
            { label: { en: 'Yogakaraka Dasha (owns Kendra + Trikona)', hi: 'योगकारक दशा (केन्द्र + त्रिकोण स्वामी)', sa: 'योगकारकदशा (केन्द्र + त्रिकोणस्वामी)' }, result: { en: 'Raja Yoga results — power, wealth, status', hi: 'राजयोग फल — शक्ति, धन, प्रतिष्ठा', sa: 'राजयोगफलानि — शक्तिः, धनं, प्रतिष्ठा' }, color: 'emerald' },
            { label: { en: 'Maha Dasha & Antardasha lords are enemies', hi: 'महादशा और अन्तर्दशा स्वामी शत्रु', sa: 'महादशा-अन्तर्दशास्वामिनौ शत्रू' }, result: { en: 'Internal conflict, contradictory events', hi: 'आन्तरिक संघर्ष, विरोधाभासी घटनाएँ', sa: 'आन्तरिकसंघर्षः, विरोधाभासीघटनाः' }, color: 'red' },
          ].map((item) => (
            <div key={item.label.en} className={`rounded-lg p-3 border border-${item.color}-400/20 bg-${item.color}-400/5`}>
              <div className={`text-${item.color}-400 text-sm font-semibold mb-1`} style={headingFont}>{item.label[locale]}</div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{item.result[locale]}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 9: When to use which system */}
      <LessonSection number={9} title={L.preferenceTitle[locale]}>
        <div className="space-y-3">
          {[
            { system: { en: 'Vimshottari', hi: 'विंशोत्तरी' }, condition: { en: 'Default system for all charts. Use unless specific conditions warrant another system. Works best when Moon is strong and well-placed.', hi: 'सभी कुण्डलियों के लिए डिफ़ॉल्ट प्रणाली। जब तक विशिष्ट शर्तें न हों तब तक इसका प्रयोग करें।' }, color: '#f0d48a' },
            { system: { en: 'Yogini', hi: 'योगिनी' }, condition: { en: 'Cross-verify Vimshottari predictions. Shorter 36-year cycle catches micro-timing that Vimshottari may miss. Use as secondary confirmation.', hi: 'विंशोत्तरी भविष्यवाणियों की पुष्टि के लिए। छोटा 36-वर्ष चक्र सूक्ष्म समय पकड़ता है।' }, color: '#ec4899' },
            { system: { en: 'Ashtottari', hi: 'अष्टोत्तरी' }, condition: { en: 'When Rahu is in Kendra/Trikona from Lagna lord, or the person is born during Krishna Paksha daytime / Shukla Paksha nighttime.', hi: 'राहु लग्नेश से केन्द्र/त्रिकोण में हो, या कृष्ण पक्ष दिन / शुक्ल पक्ष रात में जन्म।' }, color: '#6366f1' },
            { system: { en: 'Chara (Jaimini)', hi: 'चर (जैमिनी)' }, condition: { en: 'For career/relationship timing and when using Jaimini techniques (Chara Karakas, Padas). Best for event-specific predictions like marriage or job change.', hi: 'करियर/सम्बन्ध समय और जैमिनी तकनीकों के साथ। विवाह या नौकरी परिवर्तन जैसी घटना-विशिष्ट भविष्यवाणी।' }, color: '#22c55e' },
          ].map((item) => (
            <div key={item.system.en} className="flex gap-3 items-start">
              <div className="w-24 flex-shrink-0 text-sm font-bold text-right pt-0.5" style={{ color: item.color }}>
                {isHi ? item.system.hi : item.system.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? item.condition.hi : item.condition.en}
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 10: Finding Your Current Dasha */}
      <LessonSection number={10} title={L.findYourTitle[locale]}>
        <p style={bodyFont}>{L.findYourContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.findYourContent2[locale]}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">
            {locale === 'en' ? 'How to find it:' : 'कैसे खोजें:'}
          </p>
          <div className="space-y-1 text-gold-light/80 font-mono text-xs">
            <p>1. {locale === 'en' ? 'Go to /kundali and enter your birth details' : '/kundali पर जाएँ और जन्म विवरण दर्ज करें'}</p>
            <p>2. {locale === 'en' ? 'Click on the "Dashas" tab in the results' : 'परिणामों में "दशा" टैब पर क्लिक करें'}</p>
            <p>3. {locale === 'en' ? 'The highlighted row is your current Maha Dasha' : 'हाइलाइट पंक्ति आपकी वर्तमान महादशा है'}</p>
            <p>4. {locale === 'en' ? 'Expand it to see Antardashas — the highlighted sub-row is your current Antardasha' : 'इसे विस्तार करें अन्तर्दशाएँ देखने के लिए — हाइलाइट उप-पंक्ति आपकी वर्तमान अन्तर्दशा है'}</p>
          </div>
        </div>
      </LessonSection>

      {/* Section 11: Antardasha Calculation */}
      <LessonSection number={11} title={L.antardashaCalcTitle[locale]}>
        <p style={bodyFont}>{L.antardashaCalcContent[locale]}</p>

        <div className="mt-4 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-4 border border-gold-primary/10 overflow-x-auto">
          <p className="text-gold-light text-sm font-semibold mb-3" style={headingFont}>
            {locale === 'en' ? 'Venus Maha Dasha (20 years) — All 9 Antardashas' : 'शुक्र महादशा (20 वर्ष) — सभी 9 अन्तर्दशाएँ'}
          </p>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/10">
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? 'Antardasha' : 'अन्तर्दशा'}</th>
                <th className="text-left py-2 px-2 text-gold-dark">{locale === 'en' ? 'Calculation' : 'गणना'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-primary/5">
              {VENUS_ANTARDASHA_EXAMPLE.map((ad) => (
                <tr key={ad.planet} className="hover:bg-gold-primary/3">
                  <td className="py-2 px-2 font-medium text-text-secondary">
                    {locale === 'en' ? `Venus-${ad.planet}` : `शुक्र-${ad.planetHi}`}
                  </td>
                  <td className="py-2 px-2 text-text-secondary font-mono">
                    {isHi ? ad.durationHi : ad.duration}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="mt-2 text-text-tertiary text-[10px] font-mono">
            {locale === 'en' ? 'Total: 3y4m + 1y + 1y8m + 1y2m + 3y + 2y8m + 3y2m + 2y10m + 1y2m = 20 years' : 'कुल: 3वर्ष4माह + 1वर्ष + 1वर्ष8माह + 1वर्ष2माह + 3वर्ष + 2वर्ष8माह + 3वर्ष2माह + 2वर्ष10माह + 1वर्ष2माह = 20 वर्ष'}
          </p>
        </div>
      </LessonSection>

      {/* Section 12: Maha Dasha Themes */}
      <LessonSection number={12} title={L.mahadashaThemesTitle[locale]}>
        <p style={bodyFont}>{L.mahadashaThemesContent[locale]}</p>
        <div className="mt-4 space-y-3">
          {MAHADASHA_THEMES.map((md, i) => (
            <motion.div
              key={md.planet}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-4 border border-gold-primary/10"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: md.color }} />
                <span className="font-bold text-sm" style={{ color: md.color, ...headingFont }}>
                  {isHi ? md.planetHi : md.planet}
                </span>
                <span className="text-text-tertiary text-[10px] font-mono">{md.years} {locale === 'en' ? 'years' : 'वर्ष'}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>
                {isHi ? md.themes.hi : md.themes.en}
              </p>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 13: Dasha Sandhi */}
      <LessonSection number={13} title={L.sandhiTitle[locale]} variant="highlight">
        <p style={bodyFont}>{L.sandhiContent[locale]}</p>
        <p className="mt-3" style={bodyFont}>{L.sandhiContent2[locale]}</p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { from: { en: 'Jupiter → Saturn', hi: 'गुरु → शनि' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Expansion → contraction. Optimism to reality check. Career restructuring.', hi: 'विस्तार → संकुचन। आशावाद से वास्तविकता जाँच। करियर पुनर्गठन।' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Venus → Sun', hi: 'शुक्र → सूर्य' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Pleasure → duty. Partnership focus to individual authority. Lifestyle shift.', hi: 'आनन्द → कर्तव्य। साझेदारी से व्यक्तिगत अधिकार। जीवनशैली बदलाव।' }, color: 'border-red-400/20 bg-red-400/5' },
            { from: { en: 'Saturn → Mercury', hi: 'शनि → बुध' }, friction: { en: 'Medium', hi: 'मध्यम' }, desc: { en: 'Heavy → light. Slow and deep to fast and versatile. Relief period.', hi: 'भारी → हल्का। धीमा और गहरा से तेज़ और बहुमुखी। राहत काल।' }, color: 'border-amber-400/20 bg-amber-400/5' },
            { from: { en: 'Mercury → Ketu', hi: 'बुध → केतु' }, friction: { en: 'High', hi: 'उच्च' }, desc: { en: 'Rational → mystical. Worldly activity to spiritual withdrawal. Confusion possible.', hi: 'तर्कसंगत → रहस्यमय। सांसारिक गतिविधि से आध्यात्मिक वापसी। भ्रम सम्भव।' }, color: 'border-red-400/20 bg-red-400/5' },
          ].map((item) => (
            <div key={item.from.en} className={`rounded-lg p-3 border ${item.color}`}>
              <div className="text-gold-light text-sm font-bold mb-1" style={headingFont}>
                {isHi ? item.from.hi : item.from.en}
              </div>
              <div className="text-text-tertiary text-[10px] font-mono mb-1">
                {locale === 'en' ? `Friction: ${item.friction.en}` : `घर्षण: ${item.friction.hi}`}
              </div>
              <div className="text-text-secondary text-xs" style={bodyFont}>{isHi ? item.desc.hi : item.desc.en}</div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* Section 14: Event Timing */}
      <LessonSection number={14} title={L.eventTimingTitle[locale]}>
        <p style={bodyFont}>{L.eventTimingContent[locale]}</p>
        <div className="mt-4 space-y-3">
          {EVENT_TIMING.map((et, i) => (
            <motion.div
              key={et.event.en}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="flex gap-3 items-start"
            >
              <div className="w-28 flex-shrink-0 text-right text-sm font-bold pt-0.5" style={{ color: et.color, ...headingFont }}>
                {isHi ? et.event.hi : et.event.en}
              </div>
              <div className="text-text-secondary text-xs leading-relaxed flex-1" style={bodyFont}>
                {isHi ? et.dashas.hi : et.dashas.en}
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* Section 15: Related modules */}
      <LessonSection number={15} title={L.modulesTitle[locale]}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/learn/modules/11-1', label: { en: 'Lesson 11-1: Vimshottari Dasha System', hi: 'पाठ 11-1: विंशोत्तरी दशा प्रणाली' } },
            { href: '/learn/modules/11-2', label: { en: 'Lesson 11-2: Antardasha & Pratyantardasha', hi: 'पाठ 11-2: अन्तर्दशा और प्रत्यन्तरदशा' } },
            { href: '/learn/modules/11-3', label: { en: 'Lesson 11-3: Advanced Dasha Interpretation', hi: 'पाठ 11-3: उन्नत दशा व्याख्या' } },
          ].map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3 border border-gold-primary/10 hover:border-gold-primary/30 transition-colors block"
            >
              <span className="text-gold-light text-xs font-medium" style={headingFont}>
                {isHi ? mod.label.hi : mod.label.en}
              </span>
            </Link>
          ))}
        </div>
      </LessonSection>

      <div className="mt-6 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-sm font-medium"
        >
          {L.tryIt[locale]} →
        </Link>
      </div>
    </div>
  );
}

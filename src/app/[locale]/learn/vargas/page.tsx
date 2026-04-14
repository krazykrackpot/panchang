'use client';

import { tl } from '@/lib/utils/trilingual';
import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import LessonSection from '@/components/learn/LessonSection';
import SanskritTermCard from '@/components/learn/SanskritTermCard';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { isDevanagariLocale } from '@/lib/utils/locale-fonts';
import { lt } from '@/lib/learn/translations';
import type { LocaleText } from '@/lib/learn/translations';
import LT from '@/messages/learn/vargas.json';

/* ─── Trilingual Labels ─── */
const L = {
  title: { en: 'Divisional Charts (Vargas)', hi: 'विभागीय कुण्डलियाँ (वर्ग)', sa: 'विभागकुण्डल्यः (वर्गाः)' , ta: 'வர்க்க ஜாதகங்கள் (வர்கங்கள்)' },
  subtitle: {
    en: 'The 16 Shodasvarga charts of Parashara — how one birth chart unfolds into 16 layers of karmic detail',
    hi: 'पराशर की 16 षोडशवर्ग कुण्डलियाँ — एक जन्म कुण्डली कैसे 16 कार्मिक परतों में खुलती है',
    sa: 'पराशरस्य 16 षोडशवर्गकुण्डल्यः — एका जन्मकुण्डली कथं 16 कार्मिकस्तरेषु प्रकटते',
  },

  // Overview
  overviewTitle: { en: 'What Are Divisional Charts?', hi: 'विभागीय कुण्डली क्या है?', sa: 'विभागकुण्डली का?' },
  overviewText: {
    en: 'Your Rashi chart (D1) is a map of the sky at birth — but it is only the first layer. Parashara, the father of Vedic astrology, taught that each 30° sign can be further subdivided into smaller arcs. When a planet\'s sidereal longitude is projected onto these sub-divisions, it lands in a different sign than it occupies in D1. That new sign becomes its position in the divisional chart. These charts are called Vargas (divisions), and together the 16 primary vargas form the Shodasvarga system — the backbone of predictive Jyotish.',
    hi: 'आपकी राशि कुण्डली (D1) जन्म के समय आकाश का नक्शा है — लेकिन यह केवल पहली परत है। वैदिक ज्योतिष के जनक पराशर ने सिखाया कि प्रत्येक 30° राशि को और छोटे चापों में विभाजित किया जा सकता है। जब किसी ग्रह का नाक्षत्रिक देशान्तर इन उपविभागों पर प्रक्षेपित होता है, तो वह D1 से भिन्न राशि में आता है। यही नई राशि विभागीय कुण्डली में उसकी स्थिति बनती है। इन कुण्डलियों को वर्ग कहते हैं, और 16 प्राथमिक वर्ग मिलकर षोडशवर्ग प्रणाली बनाते हैं — भविष्यवाणी ज्योतिष की रीढ़।',
    sa: 'भवतः राशिकुण्डली (D1) जन्मसमये आकाशस्य मानचित्रम् — किन्तु एषा प्रथमा परतिः एव। पराशरः शिक्षितवान् यत् प्रत्येका 30° राशिः सूक्ष्मतरचापेषु विभक्तुं शक्या। एते वर्गाः इति उच्यन्ते, 16 प्राथमिकवर्गाः षोडशवर्गपद्धतिं रचयन्ति।',
  },

  // How divisions work
  howTitle: { en: 'How Divisions Work — The Math', hi: 'विभाजन कैसे काम करता है — गणित', sa: 'विभाजनं कथं कार्यं करोति — गणितम्' },
  howText: {
    en: 'Every divisional chart follows a simple principle: divide each 30° sign into N equal parts, then map each part to a sign using classical rules. The formula varies by chart — some use cyclic mapping, others use specific Parashara sequences. But the core idea is always: take a planet\'s degree within its sign, determine which sub-division it falls in, and look up the corresponding sign.',
    hi: 'प्रत्येक विभागीय कुण्डली एक सरल सिद्धान्त पर चलती है: प्रत्येक 30° राशि को N बराबर भागों में विभाजित करें, फिर शास्त्रीय नियमों से प्रत्येक भाग को एक राशि में मैप करें। सूत्र चार्ट के अनुसार भिन्न होता है — कुछ चक्रीय मैपिंग करते हैं, अन्य पराशर क्रम का उपयोग करते हैं। मूल विचार सदा यही है: ग्रह का अंश लें, कौन सा उपविभाग है ज्ञात करें, और संगत राशि देखें।',
    sa: 'प्रत्येका विभागकुण्डली एकं सरलं सिद्धान्तम् अनुसरति: प्रत्येकां 30° राशिं N समभागेषु विभजेत्।',
  },

  // Navamsha deep dive
  navamshaTitle: { en: 'The Navamsha (D9) — The Chart Within the Chart', hi: 'नवांश (D9) — कुण्डली के भीतर कुण्डली', sa: 'नवांशः (D9) — कुण्डल्यां कुण्डली' },
  navamshaText: {
    en: 'Of all divisional charts, the Navamsha is supreme. It divides each 30° sign into 9 equal parts of 3°20\' each — corresponding to the 9 Padas of a Nakshatra. The Navamsha is so important that no prediction should be made from D1 alone without checking D9. It reveals: (1) the true strength of planets — a planet exalted in D1 but debilitated in D9 will not deliver its full promise; (2) marriage and partnerships — the 7th house of D9 is the primary indicator; (3) the Dharma and spiritual path — D9 is called the "Dharma chart"; (4) the second half of life — while D1 shows the overall pattern, D9 shows how karma unfolds after maturity.',
    hi: 'सभी विभागीय कुण्डलियों में नवांश सर्वोच्च है। यह प्रत्येक 30° राशि को 3°20\' के 9 बराबर भागों में विभाजित करता है — जो एक नक्षत्र के 9 पादों से मेल खाते हैं। नवांश इतना महत्वपूर्ण है कि D9 की जाँच किए बिना केवल D1 से कोई भविष्यवाणी नहीं करनी चाहिए। यह प्रकट करता है: (1) ग्रहों का सच्चा बल — D1 में उच्च लेकिन D9 में नीच ग्रह पूर्ण वादा पूरा नहीं करेगा; (2) विवाह और साझेदारी — D9 का 7वाँ भाव प्राथमिक संकेतक है; (3) धर्म और आध्यात्मिक पथ — D9 को "धर्म कुण्डली" कहते हैं; (4) जीवन का उत्तरार्ध।',
    sa: 'सर्वासु विभागकुण्डलीषु नवांशः श्रेष्ठः। एषः प्रत्येकां 30° राशिं 3°20\' इत्येतेषु 9 समभागेषु विभजति — ये नक्षत्रस्य 9 पादाः।',
  },

  // Navamsha calculation
  navCalcTitle: { en: 'Calculating the Navamsha', hi: 'नवांश गणना', sa: 'नवांशगणनम्' },
  navCalcText: {
    en: 'The Navamsha mapping follows the element cycle of the signs. For fire signs (Aries, Leo, Sagittarius), the 9 navamshas start from Aries. For earth signs (Taurus, Virgo, Capricorn), they start from Capricorn. For air signs (Gemini, Libra, Aquarius), they start from Libra. For water signs (Cancer, Scorpio, Pisces), they start from Cancer.',
    hi: 'नवांश मैपिंग राशियों के तत्व चक्र का अनुसरण करती है। अग्नि राशियों (मेष, सिंह, धनु) के लिए 9 नवांश मेष से शुरू होते हैं। पृथ्वी राशियों (वृषभ, कन्या, मकर) के लिए मकर से। वायु राशियों (मिथुन, तुला, कुम्भ) के लिए तुला से। जल राशियों (कर्क, वृश्चिक, मीन) के लिए कर्क से।',
    sa: 'नवांशमैपिङ्गं राशीनां तत्त्वचक्रम् अनुसरति। अग्निराशिभ्यः (मेषः, सिंहः, धनुः) नवांशाः मेषात् आरभन्ते।',
  },

  // Vimshopak
  vimshopakTitle: { en: 'Vimshopak Bala — The 20-Point Strength System', hi: 'विंशोपक बल — 20-अंक शक्ति प्रणाली', sa: 'विंशोपकबलम् — 20-अङ्कशक्तिपद्धतिः' },
  vimshopakText: {
    en: 'Parashara designed a scoring system called Vimshopak Bala that weights each varga according to its importance. In the Shodasvarga scheme, the maximum score is 20 points distributed across 16 charts. A planet scores points in each varga where it occupies its own sign, exaltation sign, or a friendly sign. The total gives a composite strength that integrates all 16 layers. A planet with Vimshopak Bala above 15 is very strong; below 5 is seriously weakened.',
    hi: 'पराशर ने विंशोपक बल नामक एक अंक प्रणाली बनाई जो प्रत्येक वर्ग को उसके महत्व के अनुसार भार देती है। षोडशवर्ग योजना में, अधिकतम अंक 20 हैं जो 16 चार्टों में वितरित हैं। एक ग्रह प्रत्येक वर्ग में अंक प्राप्त करता है जहाँ वह स्वराशि, उच्च राशि, या मित्र राशि में है। कुल अंक एक समग्र शक्ति देते हैं। 15 से ऊपर विंशोपक बल बहुत शक्तिशाली है; 5 से नीचे गम्भीर रूप से दुर्बल।',
    sa: 'पराशरः विंशोपकबलम् इति अङ्कपद्धतिं रचितवान्। षोडशवर्गयोजनायां परमाङ्काः 20 सन्ति। 15 अधिकं बलवान्; 5 न्यूनं दुर्बलः।',
  },

  // How to interpret
  interpretTitle: { en: 'How to Interpret a Divisional Chart', hi: 'विभागीय कुण्डली की व्याख्या कैसे करें', sa: 'विभागकुण्डल्याः व्याख्या कथम्' },
  interpretText: {
    en: 'Divisional charts are not read like standalone horoscopes. They are supplementary lenses that zoom into specific life areas. Here is a systematic 7-step method for reading any varga chart:',
    hi: 'विभागीय कुण्डलियाँ स्वतन्त्र कुण्डलियों की तरह नहीं पढ़ी जातीं। ये विशिष्ट जीवन क्षेत्रों पर ज़ूम करने वाले पूरक लेंस हैं। किसी भी वर्ग कुण्डली पढ़ने की व्यवस्थित 7-चरणीय विधि:',
    sa: 'विभागकुण्डल्यः स्वतन्त्रकुण्डलीवत् न पठ्यन्ते। एताः विशिष्टजीवनक्षेत्रेषु दृष्टिं केन्द्रयन्ति।',
  },

  // Golden rules
  rulesTitle: { en: 'The Golden Rules of Varga Interpretation', hi: 'वर्ग व्याख्या के सुनहरे नियम', sa: 'वर्गव्याख्यायाः सुवर्णनियमाः' },
  rulesText: {
    en: 'These five principles separate accurate Jyotish from guesswork. Violating any of them leads to incorrect predictions:',
    hi: 'ये पाँच सिद्धान्त सटीक ज्योतिष को अनुमान से अलग करते हैं। इनमें से किसी का उल्लंघन गलत भविष्यवाणियों की ओर ले जाता है:',
    sa: 'एते पञ्च सिद्धान्ताः सटीकज्योतिषं अनुमानात् पृथक् कुर्वन्ति:',
  },

  // Practical examples
  practicalTitle: { en: 'Practical Interpretation — Worked Examples', hi: 'व्यावहारिक व्याख्या — उदाहरण', sa: 'व्यावहारिकव्याख्या — उदाहरणानि' },
  practicalText: {
    en: 'Let us walk through how to read three of the most commonly used divisional charts with our example chart (15 Aug 1995, 10:30 AM IST, New Delhi):',
    hi: 'आइए हमारे उदाहरण कुण्डली (15 अगस्त 1995, 10:30 AM IST, नई दिल्ली) के साथ तीन सबसे अधिक प्रयुक्त विभागीय कुण्डलियों को कैसे पढ़ें यह समझें:',
    sa: 'अस्माकम् उदाहरणकुण्डल्या (15 ऑगस्ट 1995) सह त्रीणि प्रायः प्रयुक्तानि विभागचार्टानि कथं पठेम इति पश्यामः:',
  },

  // Hierarchy
  hierarchyTitle: { en: 'The Hierarchy of Charts', hi: 'कुण्डलियों का पदानुक्रम', sa: 'कुण्डलीनां पदानुक्रमः' },
  hierarchyText: {
    en: 'Not all vargas are equal in importance. Parashara ranked them in a clear hierarchy. The D1 (Rashi) is the foundation — all other charts depend on it. The D9 (Navamsha) is the second most important and must always be checked. The D10 (Dasamsha) is crucial for career questions. Beyond these three, the relevance of other vargas depends on the specific question being asked.',
    hi: 'सभी वर्ग महत्व में समान नहीं हैं। पराशर ने उन्हें एक स्पष्ट पदानुक्रम में रखा। D1 (राशि) आधार है — अन्य सभी चार्ट इस पर निर्भर हैं। D9 (नवांश) दूसरा सबसे महत्वपूर्ण है और सदा जाँचा जाना चाहिए। D10 (दशांश) करियर प्रश्नों के लिए महत्वपूर्ण है। इन तीनों से परे, अन्य वर्गों की प्रासंगिकता पूछे गए प्रश्न पर निर्भर करती है।',
    sa: 'सर्वे वर्गाः महत्त्वे समानाः न सन्ति। पराशरः तान् स्पष्टपदानुक्रमे स्थापितवान्।',
  },

  // Common mistakes
  mistakesTitle: { en: 'Common Mistakes in Varga Analysis', hi: 'वर्ग विश्लेषण में सामान्य गलतियाँ', sa: 'वर्गविश्लेषणे सामान्यदोषाः' },
  mistakesText: {
    en: 'Even experienced astrologers make these errors. Being aware of them will sharpen your interpretations:',
    hi: 'अनुभवी ज्योतिषी भी ये गलतियाँ करते हैं। इनसे अवगत होने से आपकी व्याख्याएँ तीक्ष्ण होंगी:',
    sa: 'अनुभवशालिनः ज्योतिषिणोऽपि एतान् दोषान् कुर्वन्ति:',
  },

  deeper: { en: 'Dive Deeper', hi: 'और गहराई में', sa: 'गहनतरम्' },
  tryIt: { en: 'Generate Your Vargas Now', hi: 'अभी अपने वर्ग चार्ट बनाएँ', sa: 'इदानीं स्ववर्गचार्टान् रचयतु' },
};

/* ─── 16 Shodasvarga Charts Data ─── */
const VARGAS = [
  {
    key: 'D1', division: 1,
    name: { en: 'Rashi', hi: 'राशि', sa: 'राशिः' },
    fullName: { en: 'Rashi Chart', hi: 'राशि कुण्डली', sa: 'राशिकुण्डली' },
    domain: { en: 'Overall life, personality, physical body', hi: 'समग्र जीवन, व्यक्तित्व, शारीरिक शरीर', sa: 'समग्रजीवनं, व्यक्तित्वं, शारीरिकदेहः' },
    desc: { en: 'The master chart from which all vargas are derived. Shows the overall life trajectory, temperament, physical constitution, and karmic pattern. The foundation of all Jyotish analysis.', hi: 'मूल कुण्डली जिससे सभी वर्ग व्युत्पन्न होते हैं। समग्र जीवन पथ, स्वभाव, शारीरिक संरचना और कार्मिक प्रारूप दर्शाती है।', sa: 'मूलकुण्डली यतः सर्वे वर्गाः व्युत्पद्यन्ते।' },
    rule: { en: '30° = full sign (no division)', hi: '30° = पूर्ण राशि (कोई विभाजन नहीं)', sa: '30° = पूर्णराशिः' },
    weight: 3.5, tier: 'essential' as const,
    keyHouses: { en: 'All 12 houses are analyzed', hi: 'सभी 12 भावों का विश्लेषण', sa: 'सर्वे 12 भावाः विश्लेष्यन्ते' },
  },
  {
    key: 'D2', division: 2,
    name: { en: 'Hora', hi: 'होरा', sa: 'होरा' },
    fullName: { en: 'Hora Chart', hi: 'होरा कुण्डली', sa: 'होराकुण्डली' },
    domain: { en: 'Wealth, financial prosperity, earning capacity', hi: 'धन, वित्तीय समृद्धि, अर्जन क्षमता', sa: 'धनं, वित्तीयसमृद्धिः, अर्जनक्षमता' },
    desc: { en: 'Divides each sign into two halves: Solar (Sun) and Lunar (Moon). Planets in Sun\'s hora earn through authority and effort; Moon\'s hora through trade and public dealings. The balance reveals overall wealth potential.', hi: 'प्रत्येक राशि को दो भागों में विभाजित करता है: सौर (सूर्य) और चंद्र (चन्द्र)। सूर्य होरा में ग्रह अधिकार से धन कमाते हैं; चंद्र होरा में व्यापार से।', sa: 'प्रत्येकां राशिं द्विधा विभजति: सौरं चान्द्रं च।' },
    rule: { en: '30° ÷ 2 = 15° per hora. Odd signs: 0-15° → Leo, 15-30° → Cancer. Even signs: reversed.', hi: '30° ÷ 2 = 15° प्रति होरा। विषम राशि: 0-15° → सिंह, 15-30° → कर्क। सम: विपरीत।', sa: '30° ÷ 2 = 15° प्रतिहोरा।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '2nd (wealth), 11th (gains), Lagna lord position', hi: '2वाँ (धन), 11वाँ (लाभ), लग्नेश स्थिति', sa: '2 (धनम्), 11 (लाभः)' },
  },
  {
    key: 'D3', division: 3,
    name: { en: 'Drekkana', hi: 'द्रेष्काण', sa: 'द्रेष्काणः' },
    fullName: { en: 'Drekkana Chart', hi: 'द्रेष्काण कुण्डली', sa: 'द्रेष्काणकुण्डली' },
    domain: { en: 'Siblings, courage, short journeys, initiative', hi: 'भाई-बहन, साहस, छोटी यात्राएँ, पहल', sa: 'सहोदराः, साहसं, लघुयात्राः' },
    desc: { en: 'Divides each sign into 3 decanates of 10° each. Reveals the native\'s relationship with siblings, co-born, courage in adversity, and self-initiative. The 3rd house of D3 governs younger siblings, 11th house governs elder siblings.', hi: 'प्रत्येक राशि को 10° के 3 द्रेष्काणों में विभाजित करता है। भाई-बहनों से संबंध, विपत्ति में साहस और आत्म-पहल दर्शाता है।', sa: 'प्रत्येकां राशिं 10° इत्येतेषु 3 द्रेष्काणेषु विभजति।' },
    rule: { en: '30° ÷ 3 = 10°. Maps to same sign, 5th from it, 9th from it (trine cycle).', hi: '30° ÷ 3 = 10°। उसी राशि, 5वीं, 9वीं में मैप (त्रिकोण चक्र)।', sa: '30° ÷ 3 = 10°। स्वराशिं, पञ्चमीं, नवमीं प्रति।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '3rd (siblings), 11th (elder siblings), Mars placement', hi: '3वाँ (छोटे भाई-बहन), 11वाँ (बड़े), मंगल स्थिति', sa: '3 (सहोदराः), 11 (ज्येष्ठसहोदराः)' },
  },
  {
    key: 'D4', division: 4,
    name: { en: 'Chaturthamsha', hi: 'चतुर्थांश', sa: 'चतुर्थांशः' },
    fullName: { en: 'Chaturthamsha Chart', hi: 'चतुर्थांश कुण्डली', sa: 'चतुर्थांशकुण्डली' },
    domain: { en: 'Property, fortune, fixed assets, home', hi: 'संपत्ति, भाग्य, स्थावर संपदा, गृह', sa: 'सम्पत्तिः, भाग्यं, स्थावरसम्पदा' },
    desc: { en: 'Divides each sign into 4 parts of 7°30\' each. Governs immovable property, real estate, vehicles, and general fortune. A strong D4 indicates inheritance, successful property ventures, and comfortable living.', hi: 'प्रत्येक राशि को 7°30\' के 4 भागों में विभाजित करता है। अचल संपत्ति, भूमि, वाहन और सामान्य भाग्य को नियंत्रित करता है।', sa: 'प्रत्येकां राशिं 7°30\' इत्येतेषु 4 भागेषु विभजति।' },
    rule: { en: '30° ÷ 4 = 7°30\'. Maps cyclically: same sign, 4th, 7th, 10th (kendra cycle).', hi: '30° ÷ 4 = 7°30\'। चक्रीय: स्वराशि, 4वीं, 7वीं, 10वीं (केन्द्र चक्र)।', sa: '30° ÷ 4 = 7°30\'। केन्द्रचक्रम्।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '4th (home/property), 10th (status), Venus/Mars for vehicles', hi: '4वाँ (गृह/संपत्ति), 10वाँ (स्थिति), शुक्र/मंगल', sa: '4 (गृहम्), 10 (स्थितिः)' },
  },
  {
    key: 'D7', division: 7,
    name: { en: 'Saptamsha', hi: 'सप्तमांश', sa: 'सप्तमांशः' },
    fullName: { en: 'Saptamsha Chart', hi: 'सप्तमांश कुण्डली', sa: 'सप्तमांशकुण्डली' },
    domain: { en: 'Children, progeny, creative output', hi: 'संतान, वंशवृद्धि, सृजनात्मक उपज', sa: 'सन्तानं, वंशवृद्धिः' },
    desc: { en: 'Divides each sign into 7 parts of 4°17\' each. The primary chart for children — their number, nature, relationship with the native, and success. The 5th house shows the first child, 7th the second, 9th the third. Jupiter\'s placement is crucial.', hi: 'प्रत्येक राशि को 4°17\' के 7 भागों में विभाजित करता है। संतान का प्राथमिक चार्ट — उनकी संख्या, स्वभाव, संबंध और सफलता। 5वाँ भाव प्रथम संतान, 7वाँ द्वितीय, 9वाँ तृतीय दर्शाता है।', sa: 'प्रत्येकां राशिं 4°17\' इत्येतेषु 7 भागेषु विभजति। सन्तानस्य प्राथमिकं चार्टम्।' },
    rule: { en: '30° ÷ 7 = 4°17\'. Odd signs: start from same sign. Even signs: start from 7th sign.', hi: '30° ÷ 7 = 4°17\'। विषम: स्वराशि से। सम: 7वीं राशि से।', sa: '30° ÷ 7 = 4°17\'।' },
    weight: 1.0, tier: 'important' as const,
    keyHouses: { en: '5th (first child), 7th (second child), Jupiter & 5th lord', hi: '5वाँ (प्रथम), 7वाँ (द्वितीय), गुरु और 5वें भाव का स्वामी', sa: '5 (प्रथमसन्तानम्), 7 (द्वितीयम्)' },
  },
  {
    key: 'D9', division: 9,
    name: { en: 'Navamsha', hi: 'नवांश', sa: 'नवांशः' },
    fullName: { en: 'Navamsha Chart', hi: 'नवांश कुण्डली', sa: 'नवांशकुण्डली' },
    domain: { en: 'Marriage, dharma, true planet strength, second half of life', hi: 'विवाह, धर्म, ग्रहों का सच्चा बल, जीवन का उत्तरार्ध', sa: 'विवाहः, धर्मः, ग्रहाणां सत्यबलं, जीवनोत्तरार्धः' },
    desc: { en: 'The most important divisional chart. Divides each sign into 9 parts of 3°20\'. Reveals the true strength of every planet, the nature of marriage and spouse, the dharmic path, and how karma unfolds in the second half of life. A planet in its own Navamsha (Vargottama) gains tremendous strength. No prediction is complete without D9 analysis.', hi: 'सबसे महत्वपूर्ण विभागीय कुण्डली। प्रत्येक राशि को 3°20\' के 9 भागों में विभाजित करती है। हर ग्रह के सच्चे बल, विवाह, धार्मिक पथ, और जीवन के उत्तरार्ध में कर्म कैसे फलित होता है — यह सब दर्शाती है। स्वनवांश ग्रह (वर्गोत्तम) को अत्यधिक बल मिलता है।', sa: 'सर्वाधिकमहत्त्वपूर्णा विभागकुण्डली। प्रत्येकां राशिं 3°20\' इत्येतेषु 9 भागेषु विभजति।' },
    rule: { en: '30° ÷ 9 = 3°20\'. Fire signs → start from Aries. Earth → Capricorn. Air → Libra. Water → Cancer.', hi: '30° ÷ 9 = 3°20\'। अग्नि → मेष से। पृथ्वी → मकर। वायु → तुला। जल → कर्क।', sa: '30° ÷ 9 = 3°20\'। अग्निः → मेषात्। पृथिवी → मकरात्।' },
    weight: 3.0, tier: 'essential' as const,
    keyHouses: { en: '1st (dharma), 7th (spouse), Lagna lord, Venus (marriage karaka)', hi: '1वाँ (धर्म), 7वाँ (पत्नी/पति), लग्नेश, शुक्र (विवाह कारक)', sa: '1 (धर्मः), 7 (दाम्पत्यम्)' },
  },
  {
    key: 'D10', division: 10,
    name: { en: 'Dasamsha', hi: 'दशांश', sa: 'दशांशः' },
    fullName: { en: 'Dasamsha Chart', hi: 'दशांश कुण्डली', sa: 'दशांशकुण्डली' },
    domain: { en: 'Career, profession, public reputation, authority', hi: 'करियर, व्यवसाय, सार्वजनिक प्रतिष्ठा, अधिकार', sa: 'व्यवसायः, सार्वजनिकप्रतिष्ठा, अधिकारः' },
    desc: { en: 'One of the most practically useful vargas. Divides each sign into 10 parts of 3° each. Reveals the exact nature of career, professional achievements, relationship with authority figures, and public reputation. The 10th house and its lord in D10 are paramount for career prediction. Also shows Rajayogas specific to career.', hi: 'व्यावहारिक रूप से सबसे उपयोगी वर्गों में से एक। प्रत्येक राशि को 3° के 10 भागों में विभाजित करता है। करियर, व्यावसायिक उपलब्धियों, अधिकारियों से संबंध और सार्वजनिक प्रतिष्ठा का सटीक स्वरूप दर्शाता है।', sa: 'व्यावहारिकतया सर्वाधिकोपयोगिषु वर्गेषु एकः। प्रत्येकां राशिं 3° इत्येतेषु 10 भागेषु विभजति।' },
    rule: { en: '30° ÷ 10 = 3°. Odd signs: start from same sign. Even signs: start from 9th sign.', hi: '30° ÷ 10 = 3°। विषम: स्वराशि से। सम: 9वीं राशि से।', sa: '30° ÷ 10 = 3°।' },
    weight: 3.0, tier: 'essential' as const,
    keyHouses: { en: '10th (karma), 1st (public image), Sun & Saturn (career karakas)', hi: '10वाँ (कर्म), 1वाँ (सार्वजनिक छवि), सूर्य और शनि', sa: '10 (कर्म), 1 (प्रतिमा)' },
  },
  {
    key: 'D12', division: 12,
    name: { en: 'Dwadasamsha', hi: 'द्वादशांश', sa: 'द्वादशांशः' },
    fullName: { en: 'Dwadasamsha Chart', hi: 'द्वादशांश कुण्डली', sa: 'द्वादशांशकुण्डली' },
    domain: { en: 'Parents, ancestry, lineage, inherited traits', hi: 'माता-पिता, वंशावली, विरासत में मिले गुण', sa: 'पितरौ, वंशावलिः, वंशगुणाः' },
    desc: { en: 'Divides each sign into 12 parts of 2°30\' each — essentially creating a "zodiac within a zodiac." Shows the relationship with parents, family lineage, and inherited traits. The 4th house represents the mother, 9th/10th the father. Strong D12 indicates distinguished family background.', hi: 'प्रत्येक राशि को 2°30\' के 12 भागों में विभाजित करता है — "राशिचक्र के भीतर राशिचक्र"। माता-पिता से संबंध, पारिवारिक वंशावली और विरासत में मिले गुण दर्शाता है।', sa: 'प्रत्येकां राशिं 2°30\' इत्येतेषु 12 भागेषु विभजति।' },
    rule: { en: '30° ÷ 12 = 2°30\'. Always starts from the same sign and cycles through all 12.', hi: '30° ÷ 12 = 2°30\'। सदा उसी राशि से शुरू होकर सभी 12 में चक्र।', sa: '30° ÷ 12 = 2°30\'। स्वराशेः आरभ्य 12 राशिषु चक्रम्।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '4th (mother), 9th (father), 10th (father\'s status)', hi: '4वाँ (माता), 9वाँ (पिता), 10वाँ (पिता की स्थिति)', sa: '4 (माता), 9 (पिता)' },
  },
  {
    key: 'D16', division: 16,
    name: { en: 'Shodasamsha', hi: 'षोडशांश', sa: 'षोडशांशः' },
    fullName: { en: 'Shodasamsha Chart', hi: 'षोडशांश कुण्डली', sa: 'षोडशांशकुण्डली' },
    domain: { en: 'Vehicles, comforts, luxuries, mental happiness', hi: 'वाहन, सुख, विलासिता, मानसिक प्रसन्नता', sa: 'वाहनं, सुखं, विलासिता' },
    desc: { en: 'Divides each sign into 16 parts of 1°52.5\' each. Governs vehicles, conveyances, material comforts, and sources of happiness. In the modern context, extends to cars, electronics, and luxury possessions. Strong Venus or Jupiter here indicates acquisition of fine things.', hi: 'प्रत्येक राशि को 1°52.5\' के 16 भागों में विभाजित करता है। वाहन, यातायात, भौतिक सुख और प्रसन्नता के स्रोतों को नियंत्रित करता है।', sa: 'प्रत्येकां राशिं 1°52.5\' इत्येतेषु 16 भागेषु विभजति।' },
    rule: { en: '30° ÷ 16 = 1°52.5\'. Movable signs: start from Aries. Fixed: from Leo. Dual: from Sagittarius.', hi: '30° ÷ 16। चर: मेष से। स्थिर: सिंह से। द्विस्वभाव: धनु से।', sa: '30° ÷ 16। चरात् मेषात्। स्थिरात् सिंहात्।' },
    weight: 2.0, tier: 'important' as const,
    keyHouses: { en: '4th (vehicles/comfort), Venus, 4th lord', hi: '4वाँ (वाहन/सुख), शुक्र, 4वें भाव का स्वामी', sa: '4 (वाहनम्), शुक्रः' },
  },
  {
    key: 'D20', division: 20,
    name: { en: 'Vimshamsha', hi: 'विंशांश', sa: 'विंशांशः' },
    fullName: { en: 'Vimshamsha Chart', hi: 'विंशांश कुण्डली', sa: 'विंशांशकुण्डली' },
    domain: { en: 'Spiritual progress, upasana, devotional life', hi: 'आध्यात्मिक प्रगति, उपासना, भक्ति जीवन', sa: 'आध्यात्मिकप्रगतिः, उपासना' },
    desc: { en: 'Divides each sign into 20 parts of 1°30\' each. Reveals spiritual inclinations, devotional practices (upasana), and progress on the spiritual path. Jupiter and Ketu\'s placement is crucial. Strong D20 indicates natural inclination toward meditation, mantra, and spiritual wisdom.', hi: 'प्रत्येक राशि को 1°30\' के 20 भागों में विभाजित करता है। आध्यात्मिक प्रवृत्तियों, भक्ति साधनाओं और आध्यात्मिक मार्ग पर प्रगति दर्शाता है।', sa: 'प्रत्येकां राशिं 1°30\' इत्येतेषु 20 भागेषु विभजति।' },
    rule: { en: '30° ÷ 20 = 1°30\'. Movable: from Aries. Fixed: from Sagittarius. Dual: from Leo.', hi: '30° ÷ 20 = 1°30\'। चर: मेष से। स्थिर: धनु से। द्विस्वभाव: सिंह से।', sa: '30° ÷ 20 = 1°30\'।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '9th (dharma), 12th (moksha), Jupiter & Ketu', hi: '9वाँ (धर्म), 12वाँ (मोक्ष), गुरु और केतु', sa: '9 (धर्मः), 12 (मोक्षः)' },
  },
  {
    key: 'D24', division: 24,
    name: { en: 'Chaturvimshamsha', hi: 'चतुर्विंशांश', sa: 'चतुर्विंशांशः' },
    fullName: { en: 'Siddhamsha Chart', hi: 'सिद्धांश कुण्डली', sa: 'सिद्धांशकुण्डली' },
    domain: { en: 'Education, learning, knowledge, academic success', hi: 'शिक्षा, विद्या, ज्ञान, शैक्षणिक सफलता', sa: 'शिक्षा, विद्या, ज्ञानम्' },
    desc: { en: 'Divides each sign into 24 parts of 1°15\' each. Governs education, academic achievements, and the nature of knowledge the native acquires. Mercury and Jupiter\'s strength here determines intellectual capacity. The 4th house shows formal education, 5th shows creative intelligence, 9th shows higher learning.', hi: 'प्रत्येक राशि को 1°15\' के 24 भागों में विभाजित करता है। शिक्षा, शैक्षणिक उपलब्धियों और ज्ञान की प्रकृति को नियंत्रित करता है।', sa: 'प्रत्येकां राशिं 1°15\' इत्येतेषु 24 भागेषु विभजति।' },
    rule: { en: '30° ÷ 24 = 1°15\'. Odd signs: from Leo. Even signs: from Cancer.', hi: '30° ÷ 24 = 1°15\'। विषम: सिंह से। सम: कर्क से।', sa: '30° ÷ 24 = 1°15\'।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '4th (education), 5th (intellect), 9th (higher learning), Mercury', hi: '4वाँ (शिक्षा), 5वाँ (बुद्धि), 9वाँ (उच्च शिक्षा), बुध', sa: '4 (शिक्षा), 5 (बुद्धिः), 9 (उच्चशिक्षा)' },
  },
  {
    key: 'D27', division: 27,
    name: { en: 'Nakshatramsha', hi: 'नक्षत्रांश', sa: 'नक्षत्रांशः' },
    fullName: { en: 'Bhamsha Chart', hi: 'भांश कुण्डली', sa: 'भांशकुण्डली' },
    domain: { en: 'Strengths, vitality, stamina, physical endurance', hi: 'बल, ओज, सहनशक्ति, शारीरिक सहनशीलता', sa: 'बलं, ओजः, सहनशक्तिः' },
    desc: { en: 'Divides each sign into 27 parts of 1°6\'40\" each — mirroring the 27 Nakshatras. Indicates physical and mental strength, vitality, and endurance. Mars and Sun\'s placement reveals stamina and fighting spirit. A strong D27 indicates robust health and sustained effort.', hi: 'प्रत्येक राशि को 1°6\'40\" के 27 भागों में विभाजित करता है — 27 नक्षत्रों का दर्पण। शारीरिक और मानसिक बल, ओज और सहनशीलता दर्शाता है।', sa: 'प्रत्येकां राशिं 27 भागेषु विभजति — 27 नक्षत्राणां दर्पणम्।' },
    rule: { en: '30° ÷ 27 ≈ 1°6\'40\". Fire signs: from Aries. Earth: from Cancer. Air: from Libra. Water: from Capricorn.', hi: '30° ÷ 27। अग्नि: मेष से। पृथ्वी: कर्क। वायु: तुला। जल: मकर।', sa: '30° ÷ 27।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: 'Lagna (vitality), Mars, Sun, 6th (disease resistance)', hi: 'लग्न (ओज), मंगल, सूर्य, 6वाँ (रोग प्रतिरोध)', sa: 'लग्नम् (ओजः), मङ्गलः, सूर्यः' },
  },
  {
    key: 'D30', division: 30,
    name: { en: 'Trimshamsha', hi: 'त्रिंशांश', sa: 'त्रिंशांशः' },
    fullName: { en: 'Trimshamsha Chart', hi: 'त्रिंशांश कुण्डली', sa: 'त्रिंशांशकुण्डली' },
    domain: { en: 'Misfortunes, evils, hidden enemies, suffering', hi: 'दुर्भाग्य, पाप, छिपे शत्रु, कष्ट', sa: 'दुर्भाग्यं, पापं, गुप्तशत्रवः' },
    desc: { en: 'Divides each sign into 5 unequal parts assigned to Mars, Saturn, Jupiter, Mercury, and Venus. This is unique — it does not use equal division. Reveals vulnerability to misfortune, evil influences, hidden enemies, and negative karmic patterns. Benefics in D30 kendras protect against such influences.', hi: 'प्रत्येक राशि को मंगल, शनि, गुरु, बुध और शुक्र को सौंपे गए 5 असमान भागों में विभाजित करता है। दुर्भाग्य, बुरे प्रभावों, छिपे शत्रुओं और नकारात्मक कार्मिक प्रारूपों के प्रति संवेदनशीलता दर्शाता है।', sa: 'प्रत्येकां राशिं 5 असमभागेषु विभजति।' },
    rule: { en: 'Unequal: 5° Mars, 5° Saturn, 8° Jupiter, 7° Mercury, 5° Venus (odd signs). Reversed for even.', hi: 'असमान: 5° मंगल, 5° शनि, 8° गुरु, 7° बुध, 5° शुक्र (विषम)। सम में विपरीत।', sa: 'असमानम्: 5° मङ्गलः, 5° शनिः, 8° गुरुः।' },
    weight: 1.0, tier: 'important' as const,
    keyHouses: { en: '6th (enemies), 8th (hidden), 12th (losses), Saturn', hi: '6वाँ (शत्रु), 8वाँ (गुप्त), 12वाँ (हानि), शनि', sa: '6 (शत्रवः), 8 (गुप्तम्), 12 (हानिः)' },
  },
  {
    key: 'D40', division: 40,
    name: { en: 'Khavedamsha', hi: 'खवेदांश', sa: 'खवेदांशः' },
    fullName: { en: 'Khavedamsha Chart', hi: 'खवेदांश कुण्डली', sa: 'खवेदांशकुण्डली' },
    domain: { en: 'Maternal karma, auspicious/inauspicious effects', hi: 'मातृ कर्म, शुभाशुभ प्रभाव', sa: 'मातृकर्म, शुभाशुभप्रभावाः' },
    desc: { en: 'Divides each sign into 40 parts of 0°45\' each. Shows auspicious and inauspicious effects inherited from the maternal lineage. Indicates blessings or karmic debts from the mother\'s side and how they manifest in the native\'s life.', hi: 'प्रत्येक राशि को 0°45\' के 40 भागों में विभाजित करता है। मातृपक्ष से विरासत में मिले शुभ-अशुभ प्रभाव दर्शाता है।', sa: 'प्रत्येकां राशिं 0°45\' इत्येतेषु 40 भागेषु विभजति।' },
    rule: { en: '30° ÷ 40 = 0°45\'. Odd signs: from Aries. Even signs: from Libra.', hi: '30° ÷ 40 = 0°45\'। विषम: मेष से। सम: तुला से।', sa: '30° ÷ 40 = 0°45\'।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '4th (mother), Moon, 4th lord placement', hi: '4वाँ (माता), चन्द्र, 4वें भाव का स्वामी', sa: '4 (माता), चन्द्रः' },
  },
  {
    key: 'D45', division: 45,
    name: { en: 'Akshavedamsha', hi: 'अक्षवेदांश', sa: 'अक्षवेदांशः' },
    fullName: { en: 'Akshavedamsha Chart', hi: 'अक्षवेदांश कुण्डली', sa: 'अक्षवेदांशकुण्डली' },
    domain: { en: 'Paternal karma, character, destiny patterns', hi: 'पितृ कर्म, चरित्र, भाग्य प्रारूप', sa: 'पितृकर्म, चरित्रं, भाग्यप्रारूपम्' },
    desc: { en: 'Divides each sign into 45 parts of 0°40\' each. Reveals effects inherited from the paternal lineage — the father\'s karmic legacy and how it shapes the native\'s destiny, character, and life opportunities.', hi: 'प्रत्येक राशि को 0°40\' के 45 भागों में विभाजित करता है। पितृपक्ष से विरासत में मिले प्रभावों को दर्शाता है — पिता की कार्मिक विरासत।', sa: 'प्रत्येकां राशिं 0°40\' इत्येतेषु 45 भागेषु विभजति।' },
    rule: { en: '30° ÷ 45 = 0°40\'. Movable: from Aries. Fixed: from Leo. Dual: from Sagittarius.', hi: '30° ÷ 45 = 0°40\'। चर: मेष से। स्थिर: सिंह। द्विस्वभाव: धनु से।', sa: '30° ÷ 45 = 0°40\'।' },
    weight: 0.5, tier: 'supporting' as const,
    keyHouses: { en: '9th (father), Sun, 9th/10th lord placement', hi: '9वाँ (पिता), सूर्य, 9वें/10वें भाव का स्वामी', sa: '9 (पिता), सूर्यः' },
  },
  {
    key: 'D60', division: 60,
    name: { en: 'Shashtiamsha', hi: 'षष्ट्यंश', sa: 'षष्ट्यंशः' },
    fullName: { en: 'Shashtiamsha Chart', hi: 'षष्ट्यंश कुण्डली', sa: 'षष्ट्यंशकुण्डली' },
    domain: { en: 'Past life karma, overall assessment, final confirmation', hi: 'पूर्वजन्म कर्म, समग्र मूल्यांकन, अन्तिम पुष्टि', sa: 'पूर्वजन्मकर्म, समग्रमूल्याङ्कनम्' },
    desc: { en: 'The most subtle and microscopically fine divisional chart. Each of the 60 divisions (0°30\' each) is ruled by a specific deity and carries a distinct quality — auspicious, neutral, or inauspicious. Parashara considered D60 the ultimate confirmation chart: if a promise exists in D1 and D9 but D60 contradicts it, the promise weakens. Requires very accurate birth time.', hi: 'सबसे सूक्ष्म विभागीय कुण्डली। 60 विभागों (प्रत्येक 0°30\') में से प्रत्येक एक विशिष्ट देवता द्वारा शासित है। पराशर ने D60 को अन्तिम पुष्टि कुण्डली माना: यदि D1 और D9 में वादा है लेकिन D60 विरोध करता है, तो वादा कमज़ोर होता है। बहुत सटीक जन्म समय आवश्यक।', sa: 'सर्वसूक्ष्मा विभागकुण्डली। 60 विभागाः (प्रत्येकं 0°30\') विशिष्टदेवतया शासिताः।' },
    rule: { en: '30° ÷ 60 = 0°30\'. Each division has a deity name. Starts from same sign, cycles through all 12 five times.', hi: '30° ÷ 60 = 0°30\'। प्रत्येक विभाग का एक देवता नाम। स्वराशि से, सभी 12 में 5 बार चक्र।', sa: '30° ÷ 60 = 0°30\'। स्वराशेः 12 राशिषु पञ्चवारं चक्रम्।' },
    weight: 2.5, tier: 'essential' as const,
    keyHouses: { en: 'All — used as final confirmation of D1 and D9 promises', hi: 'सभी — D1 और D9 के वादों की अन्तिम पुष्टि', sa: 'सर्वे — D1 D9 च वचनानां अन्तिमपुष्टिः' },
  },
];

/* ─── Vimshopak Weight Table ─── */
const VIMSHOPAK_WEIGHTS = [
  { chart: 'D1', weight: 3.5 }, { chart: 'D2', weight: 0.5 }, { chart: 'D3', weight: 0.5 },
  { chart: 'D4', weight: 0.5 }, { chart: 'D7', weight: 1.0 }, { chart: 'D9', weight: 3.0 },
  { chart: 'D10', weight: 3.0 }, { chart: 'D12', weight: 0.5 }, { chart: 'D16', weight: 2.0 },
  { chart: 'D20', weight: 0.5 }, { chart: 'D24', weight: 0.5 }, { chart: 'D27', weight: 0.5 },
  { chart: 'D30', weight: 1.0 }, { chart: 'D40', weight: 0.5 }, { chart: 'D45', weight: 0.5 },
  { chart: 'D60', weight: 2.5 },
];

/* ─── 7-Step Interpretation Method ─── */
const INTERPRETATION_STEPS = [
  {
    step: 1,
    title: { en: 'Confirm in D1 First', hi: 'पहले D1 में पुष्टि करें', sa: 'प्रथमं D1 मध्ये पुष्टयतु' },
    desc: {
      en: 'Never read a divisional chart in isolation. First check if the relevant house/planet in D1 supports the theme. For example, before reading D10 for career, confirm that the 10th house and its lord in D1 are activated by dasha or transit.',
      hi: 'विभागीय कुण्डली को कभी अलग-थलग न पढ़ें। पहले जाँचें कि D1 में संबंधित भाव/ग्रह थीम का समर्थन करता है। उदाहरण: D10 में करियर पढ़ने से पहले, पुष्टि करें कि D1 में 10वाँ भाव और उसका स्वामी दशा या गोचर द्वारा सक्रिय है।',
      sa: 'विभागकुण्डलीं कदापि पृथक् न पठेत्। प्रथमं D1 मध्ये सम्बद्धभावः थीमं समर्थयति इति पश्येत्।',
    },
  },
  {
    step: 2,
    title: { en: 'Check the Varga Lagna', hi: 'वर्ग लग्न की जाँच करें', sa: 'वर्गलग्नं परीक्षयतु' },
    desc: {
      en: 'The ascendant of the divisional chart sets the entire framework. Note which sign rises, its lord, and where that lord sits. A strong Varga Lagna lord (in kendra or trikona, in own/exalted sign) indicates strength in that life area.',
      hi: 'विभागीय कुण्डली का लग्न पूरा ढाँचा निर्धारित करता है। कौन सी राशि उदित है, उसका स्वामी, और वह स्वामी कहाँ बैठा है — यह नोट करें। केन्द्र या त्रिकोण में, स्वराशि/उच्च में मजबूत वर्ग लग्नेश उस जीवन क्षेत्र में शक्ति दर्शाता है।',
      sa: 'विभागकुण्डल्याः लग्नं सम्पूर्णं ढाञ्चां निर्धारयति।',
    },
  },
  {
    step: 3,
    title: { en: 'Locate the Karaka', hi: 'कारक को खोजें', sa: 'कारकं अन्विष्यतु' },
    desc: {
      en: 'Every varga has a natural significator (karaka). For D7 it is Jupiter (children), for D10 it is Sun/Saturn (career), for D9 it is Venus (marriage). Find where the karaka sits in the varga — its house, sign dignity, and aspects received.',
      hi: 'प्रत्येक वर्ग का एक प्राकृतिक कारक होता है। D7 में गुरु (संतान), D10 में सूर्य/शनि (करियर), D9 में शुक्र (विवाह)। वर्ग में कारक कहाँ बैठा है — उसका भाव, राशि गरिमा, और प्राप्त दृष्टियाँ देखें।',
      sa: 'प्रत्येकस्य वर्गस्य प्राकृतिकः कारकः अस्ति। D7 मध्ये गुरुः, D10 मध्ये सूर्यः/शनिः, D9 मध्ये शुक्रः।',
    },
  },
  {
    step: 4,
    title: { en: 'Analyze the Relevant Houses', hi: 'संबंधित भावों का विश्लेषण करें', sa: 'सम्बद्धभावान् विश्लेषयतु' },
    desc: {
      en: 'Each varga has specific houses that matter most. In D10, focus on the 10th house (karma sthana), 1st (public image), and 7th (business partnerships). Check which planets occupy them, what aspects they receive, and whether the lords are strong.',
      hi: 'प्रत्येक वर्ग में विशिष्ट भाव सबसे महत्वपूर्ण होते हैं। D10 में 10वें भाव (कर्म स्थान), 1वें (सार्वजनिक छवि), और 7वें (व्यापार साझेदारी) पर ध्यान दें।',
      sa: 'प्रत्येकस्य वर्गस्य विशिष्टाः भावाः सर्वाधिकमहत्त्वपूर्णाः।',
    },
  },
  {
    step: 5,
    title: { en: 'Check for Vargottama Planets', hi: 'वर्गोत्तम ग्रहों की जाँच करें', sa: 'वर्गोत्तमग्रहान् परीक्षयतु' },
    desc: {
      en: 'A planet in the same sign in both D1 and D9 is called Vargottama — it gains tremendous extra strength, almost like exaltation. This concept extends to other vargas too: if a planet is in the same sign across multiple vargas, its effects become very powerful and reliable.',
      hi: 'D1 और D9 दोनों में एक ही राशि में ग्रह को वर्गोत्तम कहते हैं — इसे उच्च जैसा अतिरिक्त बल मिलता है। यह अवधारणा अन्य वर्गों तक भी विस्तृत है: यदि कोई ग्रह कई वर्गों में एक ही राशि में है, तो उसके प्रभाव बहुत शक्तिशाली होते हैं।',
      sa: 'D1 D9 च उभयोः एकस्यां राश्यां स्थितः ग्रहः वर्गोत्तमः इति उच्यते — एषः उच्चसदृशं बलं प्राप्नोति।',
    },
  },
  {
    step: 6,
    title: { en: 'Apply Dasha Timing', hi: 'दशा समय लागू करें', sa: 'दशासमयं प्रयोजयतु' },
    desc: {
      en: 'The varga chart shows potential, but the Dasha system tells you when it activates. A strong D10 with a powerful 10th lord will give career success during the Maha Dasha or Antar Dasha of the 10th lord (as seen in D1). Always combine varga analysis with dasha timing.',
      hi: 'वर्ग कुण्डली सम्भावना दर्शाती है, लेकिन दशा प्रणाली बताती है कब सक्रिय होगी। शक्तिशाली 10वें स्वामी वाली मजबूत D10 उस स्वामी की महादशा या अन्तर्दशा में करियर सफलता देगी। वर्ग विश्लेषण को सदा दशा समय के साथ जोड़ें।',
      sa: 'वर्गकुण्डली सम्भावनां दर्शयति, दशापद्धतिः कदा सक्रियं भवति इति वदति।',
    },
  },
  {
    step: 7,
    title: { en: 'Cross-Verify with D60', hi: 'D60 से क्रॉस-वेरीफाई करें', sa: 'D60 इत्यनेन परिशोधयतु' },
    desc: {
      en: 'For important predictions, check D60 as the final confirmation. If D1 and D9 promise something but D60 shows the planet in an inauspicious division, the promise weakens. D60 requires very accurate birth time (even 1 minute error can shift divisions).',
      hi: 'महत्वपूर्ण भविष्यवाणियों के लिए, अन्तिम पुष्टि के रूप में D60 की जाँच करें। यदि D1 और D9 कुछ वादा करते हैं लेकिन D60 में ग्रह अशुभ विभाग में है, तो वादा कमज़ोर होता है। D60 को बहुत सटीक जन्म समय चाहिए।',
      sa: 'महत्त्वपूर्णभविष्यवाणिभ्यः D60 अन्तिमपुष्टिरूपेण परीक्षयतु।',
    },
  },
];

/* ─── Golden Rules ─── */
const GOLDEN_RULES = [
  {
    rule: { en: 'D1 is the King', hi: 'D1 राजा है', sa: 'D1 राजा' },
    desc: {
      en: 'No divisional chart can override the Rashi chart. If D1 doesn\'t promise something, no varga can create it from nothing. Vargas refine and confirm — they don\'t create.',
      hi: 'कोई विभागीय कुण्डली राशि कुण्डली को ओवरराइड नहीं कर सकती। यदि D1 कुछ वादा नहीं करता, तो कोई वर्ग शून्य से नहीं बना सकता। वर्ग शोधन और पुष्टि करते हैं — निर्माण नहीं।',
      sa: 'कापि विभागकुण्डली राशिकुण्डलीम् अतिक्रान्तुं न शक्नोति।',
    },
    color: '#d4a853',
  },
  {
    rule: { en: 'The D9 is the Queen', hi: 'D9 रानी है', sa: 'D9 राज्ञी' },
    desc: {
      en: 'After D1, the Navamsha must always be checked. A planet strong in D1 but weak in D9 delivers only 50-60% of its promise. Vargottama planets (same sign in D1 and D9) are exceptionally powerful.',
      hi: 'D1 के बाद, नवांश सदा जाँचा जाना चाहिए। D1 में शक्तिशाली लेकिन D9 में दुर्बल ग्रह अपने वादे का केवल 50-60% देता है। वर्गोत्तम ग्रह असाधारण रूप से शक्तिशाली होते हैं।',
      sa: 'D1 अनन्तरं, नवांशः सदा परीक्षणीयः।',
    },
    color: '#e2e8f0',
  },
  {
    rule: { en: 'One Question, One Varga', hi: 'एक प्रश्न, एक वर्ग', sa: 'एकः प्रश्नः, एकः वर्गः' },
    desc: {
      en: 'For any specific question, identify the relevant varga and analyze it deeply. Checking all 16 charts for every question creates noise, not clarity. Career? → D10. Children? → D7. Education? → D24.',
      hi: 'किसी भी विशिष्ट प्रश्न के लिए, संबंधित वर्ग पहचानें और गहराई से विश्लेषण करें। हर प्रश्न के लिए सभी 16 चार्ट जाँचना स्पष्टता नहीं, शोर पैदा करता है।',
      sa: 'प्रत्येकस्य प्रश्नस्य कृते सम्बद्धं वर्गं पहचानयतु गहनतया विश्लेषयतु च।',
    },
    color: '#f59e0b',
  },
  {
    rule: { en: 'Birth Time Accuracy Matters', hi: 'जन्म समय की सटीकता महत्वपूर्ण', sa: 'जन्मसमयसटीकता महत्त्वपूर्णा' },
    desc: {
      en: 'Higher division charts require more precise birth times. D9 shifts every ~13 minutes. D60 shifts every ~2 minutes. If birth time is uncertain by more than 5 minutes, avoid relying on D30+ charts. Rectification using life events is essential.',
      hi: 'उच्च विभाग कुण्डलियों को अधिक सटीक जन्म समय चाहिए। D9 हर ~13 मिनट बदलता है। D60 हर ~2 मिनट। यदि जन्म समय में 5 मिनट से अधिक अनिश्चितता है, तो D30+ चार्टों पर निर्भर न रहें।',
      sa: 'उच्चविभागकुण्डलीभ्यः अधिकसटीकजन्मसमयः आवश्यकः। D60 प्रत्येकं ~2 निमेषे परिवर्तते।',
    },
    color: '#ef4444',
  },
  {
    rule: { en: 'Dignity Trumps Placement', hi: 'गरिमा स्थान से ऊपर', sa: 'गरिमा स्थानात् उपरि' },
    desc: {
      en: 'In vargas, a planet in its own sign or exalted in a dusthana is still strong. A debilitated planet in a kendra is still weak. Sign dignity in the varga chart carries more weight than house placement for determining strength.',
      hi: 'वर्गों में, दुःस्थान में स्वराशि या उच्च का ग्रह फिर भी शक्तिशाली है। केन्द्र में नीच ग्रह फिर भी दुर्बल है। बल निर्धारण के लिए वर्ग में राशि गरिमा भाव स्थान से अधिक भार रखती है।',
      sa: 'वर्गेषु, दुःस्थाने स्वराशौ अथवा उच्चे ग्रहः तथापि बलवान्।',
    },
    color: '#22c55e',
  },
];

/* ─── Common Mistakes ─── */
const MISTAKES = [
  {
    mistake: { en: 'Reading vargas as standalone charts', hi: 'वर्गों को स्वतन्त्र कुण्डली के रूप में पढ़ना', sa: 'वर्गान् स्वतन्त्रकुण्डलीरूपेण पठनम्' },
    fix: { en: 'Always cross-reference with D1. Vargas supplement the Rashi chart — they don\'t replace it. A yoga found only in a divisional chart without D1 support is unreliable.', hi: 'सदा D1 के साथ क्रॉस-रेफरेंस करें। वर्ग राशि कुण्डली का पूरक हैं — विकल्प नहीं। केवल विभागीय कुण्डली में मिला योग D1 समर्थन के बिना अविश्वसनीय है।', sa: 'सदा D1 सह तुलनां कुर्यात्।' },
  },
  {
    mistake: { en: 'Using inaccurate birth time for higher vargas', hi: 'उच्च वर्गों के लिए गलत जन्म समय का उपयोग', sa: 'उच्चवर्गार्थं अशुद्धजन्मसमयस्य उपयोगः' },
    fix: { en: 'For D60 (0°30\' divisions), even a 2-minute birth time error changes the chart entirely. Stick to D1, D9, and D10 when birth time is approximate. Use D60 only with rectified or precisely recorded times.', hi: 'D60 (0°30\' विभागों) के लिए, 2 मिनट की जन्म समय त्रुटि भी चार्ट पूरी तरह बदल देती है। अनुमानित जन्म समय पर D1, D9, D10 पर ही रहें।', sa: 'D60 कृते 2 निमेषस्य भ्रान्तिरपि चार्टं सम्पूर्णतया परिवर्तयति।' },
  },
  {
    mistake: { en: 'Ignoring the Varga Lagna', hi: 'वर्ग लग्न की उपेक्षा', sa: 'वर्गलग्नस्य उपेक्षा' },
    fix: { en: 'Many beginners focus only on planet positions and forget that the divisional chart has its own ascendant. The Varga Lagna and its lord provide the foundational framework for the entire divisional chart interpretation.', hi: 'कई शुरुआती केवल ग्रह स्थितियों पर ध्यान देते हैं और भूल जाते हैं कि विभागीय कुण्डली का अपना लग्न होता है। वर्ग लग्न और उसका स्वामी पूरी व्याख्या का आधार है।', sa: 'अनेके आरम्भकाः केवलं ग्रहस्थितिषु ध्यानं ददति वर्गलग्नं विस्मरन्ति च।' },
  },
  {
    mistake: { en: 'Applying D1 aspects to vargas', hi: 'D1 दृष्टि को वर्गों में लागू करना', sa: 'D1 दृष्टेः वर्गेषु प्रयोगः' },
    fix: { en: 'Aspects in divisional charts follow the same rules as D1 (7th aspect for all, special aspects for Mars/Jupiter/Saturn), but they are calculated based on the planet\'s position in the varga, not D1. Some classical authorities recommend using only conjunctions and sign-based aspects in vargas.', hi: 'विभागीय कुण्डलियों में दृष्टि D1 के समान नियमों का पालन करती है, लेकिन वर्ग में ग्रह की स्थिति से गणना होती है, D1 से नहीं। कुछ शास्त्रीय अधिकारी वर्गों में केवल युति और राशि-आधारित दृष्टि की सलाह देते हैं।', sa: 'विभागकुण्डलीषु दृष्टिः D1 सदृशनियमान् अनुसरति, किन्तु वर्गे ग्रहस्थितेः गण्यते।' },
  },
  {
    mistake: { en: 'Checking all 16 charts for every query', hi: 'हर प्रश्न के लिए सभी 16 चार्ट जाँचना', sa: 'प्रत्येकप्रश्नार्थं सर्वान् 16 चार्टान् परीक्षणम्' },
    fix: { en: 'This is analysis paralysis. For a career question, you need D1, D9, and D10 — that\'s it. For children, D1, D7, and D9. Being targeted gives clearer and more actionable results than being comprehensive.', hi: 'यह विश्लेषण पक्षाघात है। करियर प्रश्न के लिए D1, D9, D10 — बस। संतान के लिए D1, D7, D9। लक्षित होना व्यापक होने से स्पष्ट परिणाम देता है।', sa: 'एषः विश्लेषणपक्षाघातः। व्यवसायप्रश्नार्थं D1, D9, D10 — एतावदेव।' },
  },
];

/* ─── Deeper Links ─── */
const DEEPER_LINKS = [
  { href: '/learn/kundali', label: { en: 'How a Kundali is Made', hi: 'कुण्डली कैसे बनती है', sa: 'कुण्डली कथम्' }, desc: { en: 'Step-by-step chart construction from birth data', hi: 'जन्म विवरण से चरणबद्ध कुण्डली निर्माण', sa: 'जन्मविवरणात् सोपानकुण्डलीनिर्माणम्' } },
  { href: '/learn/bhavas', label: { en: 'The 12 Houses', hi: '12 भाव', sa: 'द्वादशभावाः' }, desc: { en: 'Significations and classification of all houses', hi: 'सभी भावों के संकेत और वर्गीकरण', sa: 'सर्वभावानां सङ्केताः वर्गीकरणं च' } },
  { href: '/learn/dashas', label: { en: 'Dashas', hi: 'दशाएँ', sa: 'दशाः' }, desc: { en: 'Timing system — when planets deliver their results', hi: 'समय प्रणाली — ग्रह कब परिणाम देते हैं', sa: 'कालपद्धतिः — ग्रहाः कदा फलं ददति' } },
  { href: '/learn/grahas', label: { en: 'The 9 Grahas', hi: '9 ग्रह', sa: 'नवग्रहाः' }, desc: { en: 'Planet dignities, strengths, and rulerships', hi: 'ग्रह गरिमा, बल और स्वामित्व', sa: 'ग्रहगरिमाः, बलं, स्वामित्वं च' } },
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र', sa: 'नक्षत्राणि' }, desc: { en: '27 lunar mansions — basis of Navamsha padas', hi: '27 चान्द्रगृह — नवांश पादों का आधार', sa: '27 चान्द्रगृहाणि — नवांशपादानाम् आधारः' } },
  { href: '/kundali', label: { en: 'Generate Your Kundali', hi: 'कुण्डली बनाएँ', sa: 'कुण्डलीं रचयतु' }, desc: { en: 'See your own divisional charts with AI commentary', hi: 'AI व्याख्या के साथ अपने विभागीय चार्ट देखें', sa: 'AI व्याख्यासह स्ववर्गचार्टान् पश्यतु' } },
];

/* ─── Tier Colors ─── */
const TIER_COLORS: Record<string, { bg: string; text: string; border: string; label: Record<string, string> }> = {
  essential: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/30', label: { en: 'Essential', hi: 'आवश्यक', sa: 'आवश्यकम्' } },
  important: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30', label: { en: 'Important', hi: 'महत्वपूर्ण', sa: 'महत्त्वपूर्णम्' } },
  supporting: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30', label: { en: 'Supporting', hi: 'सहायक', sa: 'सहायकम्' } },
};

/* ─── Page Component ─── */
export default function LearnVargasPage() {
  const locale = useLocale() as Locale;
  const t = (key: string) => lt((LT as unknown as Record<string, LocaleText>)[key], locale);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gold-gradient mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('title')}
        </h2>
        <p className="text-text-secondary">{t('subtitle')}</p>
      </div>

      {/* Key Terms */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <SanskritTermCard term="Varga" devanagari="वर्ग" transliteration="Varga" meaning="Division / Divisional Chart" />
        <SanskritTermCard term="Navamsha" devanagari="नवांश" transliteration="Navāṃśa" meaning="Ninth division (D9)" />
        <SanskritTermCard term="Shodasvarga" devanagari="षोडशवर्ग" transliteration="Ṣoḍaśavarga" meaning="System of 16 charts" />
        <SanskritTermCard term="Vargottama" devanagari="वर्गोत्तम" transliteration="Vargottama" meaning="Same sign in D1 & D9" />
      </div>

      {/* ─── OVERVIEW ─── */}
      <LessonSection title={t('overviewTitle')}>
        <p>{t('overviewText')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'The Core Idea:', hi: 'मूल विचार:', sa: 'मूल विचार:', ta: 'The Core Idea:', te: 'The Core Idea:', bn: 'The Core Idea:', kn: 'The Core Idea:', gu: 'The Core Idea:', mai: 'मूल विचार:', mr: 'मूल विचार:' }, locale)}</p>
          <p className="text-gold-light/80 font-mono text-xs">
            {locale === 'en'
              ? 'Planet at 15°40\' Aries (D1) → In D9: 15°40\' ÷ 3°20\' = 5th navamsha → from Aries (fire sign) = 5th sign = Leo'
              : 'ग्रह 15°40\' मेष (D1) → D9 में: 15°40\' ÷ 3°20\' = 5वाँ नवांश → मेष (अग्नि) से = 5वीं राशि = सिंह'}
          </p>
          <p className="text-text-secondary/70 text-xs mt-2 italic">
            {locale === 'en'
              ? 'Same planet, same degree — but D9 says Leo while D1 says Aries. This new position reveals the hidden layer.'
              : 'एक ही ग्रह, एक ही अंश — लेकिन D9 कहता है सिंह जबकि D1 कहता है मेष। यह नई स्थिति छिपी परत दर्शाती है।'}
          </p>
        </div>
      </LessonSection>

      {/* ─── HOW DIVISIONS WORK ─── */}
      <LessonSection number={1} title={t('howTitle')}>
        <p>{t('howText')}</p>
        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'General Formula:', hi: 'सामान्य सूत्र:', sa: 'सामान्य सूत्र:', ta: 'General Formula:', te: 'General Formula:', bn: 'General Formula:', kn: 'General Formula:', gu: 'General Formula:', mai: 'सामान्य सूत्र:', mr: 'सामान्य सूत्र:' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">sub_division = floor(degree_in_sign / (30 / N))</p>
            <p className="text-gold-light/80 font-mono text-xs">varga_sign = mapping_rule(sign, sub_division)</p>
            <p className="text-gold-light/60 font-mono text-xs mt-2">
              {locale === 'en'
                ? '// N = number of divisions (2 for Hora, 9 for Navamsha, 10 for Dasamsha, etc.)'
                : '// N = विभागों की संख्या (होरा = 2, नवांश = 9, दशांश = 10, आदि)'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── THE 16 SHODASVARGA CHARTS ─── */}
      <LessonSection number={2} title={!isDevanagariLocale(locale) ? 'The 16 Shodasvarga Charts' : tl({ en: '16 षोडशवर्गकुण्डल्यः', hi: '16 षोडशवर्ग कुण्डलियाँ', sa: '16 षोडशवर्ग कुण्डलियाँ', ta: '16 षोडशवर्गकुण्डल्यः', te: '16 षोडशवर्गकुण्डल्यः', bn: '16 षोडशवर्गकुण्डल्यः', kn: '16 षोडशवर्गकुण्डल्यः', gu: '16 षोडशवर्गकुण्डल्यः', mai: '16 षोडशवर्ग कुण्डलियाँ', mr: '16 षोडशवर्ग कुण्डलियाँ' }, locale)}>
        <p className="mb-4">
          {locale === 'en'
            ? 'Each chart zooms into a specific area of life. Charts are grouped into three tiers based on their interpretive weight in the Vimshopak scoring system:'
            : 'प्रत्येक चार्ट जीवन के एक विशिष्ट क्षेत्र पर ज़ूम करता है। चार्ट विंशोपक अंक प्रणाली में उनके व्याख्यात्मक भार के आधार पर तीन श्रेणियों में वर्गीकृत हैं:'}
        </p>

        {/* Tier Legend */}
        <div className="flex flex-wrap gap-3 mb-6">
          {Object.entries(TIER_COLORS).map(([tier, style]) => (
            <span key={tier} className={`text-xs px-3 py-1.5 rounded-full border ${style.bg} ${style.text} ${style.border}`}>
              {style.label[locale] || style.label.en}
            </span>
          ))}
        </div>

        {/* Varga Cards */}
        <div className="space-y-4">
          {VARGAS.map((v, i) => {
            const tier = TIER_COLORS[v.tier];
            return (
              <motion.div
                key={v.key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03, ease: 'easeOut' as const }}
                className={`bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border ${tier.border}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* Chart ID badge */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1 flex-shrink-0">
                    <span className={`text-2xl font-black ${tier.text}`} style={{ fontFamily: 'var(--font-heading)' }}>
                      {v.key}
                    </span>
                    <span className="text-text-secondary/65 text-xs font-mono">÷{v.division}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Title row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h4 className="text-gold-light font-bold text-lg" style={{ fontFamily: 'var(--font-heading)' }}>
                        {tl(v.name, locale)}
                      </h4>
                      <span className="text-text-secondary/75 text-xs">({tl(v.fullName, locale)})</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${tier.bg} ${tier.text} ${tier.border}`}>
                        {tier.label[locale] || tier.label.en}
                      </span>
                    </div>

                    {/* Domain */}
                    <p className="text-gold-primary text-sm font-medium mb-2">{tl(v.domain, locale)}</p>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-3">{tl(v.desc, locale)}</p>

                    {/* Rule + Key Houses */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
                        <div className="text-gold-primary/60 text-xs uppercase tracking-wider mb-1">
                          {tl({ en: 'Division Rule', hi: 'विभाजन नियम', sa: 'विभाजन नियम', ta: 'Division Rule', te: 'Division Rule', bn: 'Division Rule', kn: 'Division Rule', gu: 'Division Rule', mai: 'विभाजन नियम', mr: 'विभाजन नियम' }, locale)}
                        </div>
                        <p className="text-gold-light/70 font-mono text-xs">{tl(v.rule, locale)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-bg-primary/50 border border-gold-primary/5">
                        <div className="text-gold-primary/60 text-xs uppercase tracking-wider mb-1">
                          {tl({ en: 'Key Houses to Analyze', hi: 'विश्लेषण हेतु प्रमुख भाव', sa: 'विश्लेषण हेतु प्रमुख भाव', ta: 'Key Houses to Analyze', te: 'Key Houses to Analyze', bn: 'Key Houses to Analyze', kn: 'Key Houses to Analyze', gu: 'Key Houses to Analyze', mai: 'विश्लेषण हेतु प्रमुख भाव', mr: 'विश्लेषण हेतु प्रमुख भाव' }, locale)}
                        </div>
                        <p className="text-gold-light/70 text-xs">{tl(v.keyHouses, locale)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </LessonSection>

      {/* ─── NAVAMSHA DEEP DIVE ─── */}
      <LessonSection number={3} title={t('navamshaTitle')} variant="highlight">
        <p>{t('navamshaText')}</p>

        {/* Navamsha mapping table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Element', hi: 'तत्व', sa: 'तत्व', ta: 'Element', te: 'Element', bn: 'Element', kn: 'Element', gu: 'Element', mai: 'तत्व', mr: 'तत्व' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Signs', hi: 'राशियाँ', sa: 'राशियाँ', ta: 'Signs', te: 'Signs', bn: 'Signs', kn: 'Signs', gu: 'Signs', mai: 'राशियाँ', mr: 'राशियाँ' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Navamsha Starts From', hi: 'नवांश प्रारम्भ', sa: 'नवांश प्रारम्भ', ta: 'Navamsha Starts From', te: 'Navamsha Starts From', bn: 'Navamsha Starts From', kn: 'Navamsha Starts From', gu: 'Navamsha Starts From', mai: 'नवांश प्रारम्भ', mr: 'नवांश प्रारम्भ' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs hidden sm:table-cell">{tl({ en: '9 Navamsha Signs', hi: '9 नवांश राशियाँ', sa: '9 नवांश राशियाँ', ta: '9 Navamsha Signs', te: '9 Navamsha Signs', bn: '9 Navamsha Signs', kn: '9 Navamsha Signs', gu: '9 Navamsha Signs', mai: '9 नवांश राशियाँ', mr: '9 नवांश राशियाँ' }, locale)}</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              <tr className="border-b border-gold-primary/5">
                <td className="py-2 text-red-400 font-semibold">{tl({ en: 'Fire', hi: 'अग्नि', sa: 'अग्नि', ta: 'Fire', te: 'Fire', bn: 'Fire', kn: 'Fire', gu: 'Fire', mai: 'अग्नि', mr: 'अग्नि' }, locale)}</td>
                <td className="py-2 text-text-secondary">{tl({ en: 'Aries, Leo, Sagittarius', hi: 'मेष, सिंह, धनु', sa: 'मेष, सिंह, धनु', ta: 'Aries, Leo, Sagittarius', te: 'Aries, Leo, Sagittarius', bn: 'Aries, Leo, Sagittarius', kn: 'Aries, Leo, Sagittarius', gu: 'Aries, Leo, Sagittarius', mai: 'मेष, सिंह, धनु', mr: 'मेष, सिंह, धनु' }, locale)}</td>
                <td className="py-2 text-gold-light font-semibold">{tl({ en: 'Aries (1)', hi: 'मेष (1)', sa: 'मेष (1)', ta: 'Aries (1)', te: 'Aries (1)', bn: 'Aries (1)', kn: 'Aries (1)', gu: 'Aries (1)', mai: 'मेष (1)', mr: 'मेष (1)' }, locale)}</td>
                <td className="py-2 text-text-secondary/75 hidden sm:table-cell font-mono">1→2→3→4→5→6→7→8→9</td>
              </tr>
              <tr className="border-b border-gold-primary/5">
                <td className="py-2 text-emerald-400 font-semibold">{tl({ en: 'Earth', hi: 'पृथ्वी', sa: 'पृथ्वी', ta: 'Earth', te: 'Earth', bn: 'Earth', kn: 'Earth', gu: 'Earth', mai: 'पृथ्वी', mr: 'पृथ्वी' }, locale)}</td>
                <td className="py-2 text-text-secondary">{tl({ en: 'Taurus, Virgo, Capricorn', hi: 'वृषभ, कन्या, मकर', sa: 'वृषभ, कन्या, मकर', ta: 'Taurus, Virgo, Capricorn', te: 'Taurus, Virgo, Capricorn', bn: 'Taurus, Virgo, Capricorn', kn: 'Taurus, Virgo, Capricorn', gu: 'Taurus, Virgo, Capricorn', mai: 'वृषभ, कन्या, मकर', mr: 'वृषभ, कन्या, मकर' }, locale)}</td>
                <td className="py-2 text-gold-light font-semibold">{tl({ en: 'Capricorn (10)', hi: 'मकर (10)', sa: 'मकर (10)', ta: 'Capricorn (10)', te: 'Capricorn (10)', bn: 'Capricorn (10)', kn: 'Capricorn (10)', gu: 'Capricorn (10)', mai: 'मकर (10)', mr: 'मकर (10)' }, locale)}</td>
                <td className="py-2 text-text-secondary/75 hidden sm:table-cell font-mono">10→11→12→1→2→3→4→5→6</td>
              </tr>
              <tr className="border-b border-gold-primary/5">
                <td className="py-2 text-sky-400 font-semibold">{tl({ en: 'Air', hi: 'वायु', sa: 'वायु', ta: 'Air', te: 'Air', bn: 'Air', kn: 'Air', gu: 'Air', mai: 'वायु', mr: 'वायु' }, locale)}</td>
                <td className="py-2 text-text-secondary">{tl({ en: 'Gemini, Libra, Aquarius', hi: 'मिथुन, तुला, कुम्भ', sa: 'मिथुन, तुला, कुम्भ', ta: 'Gemini, Libra, Aquarius', te: 'Gemini, Libra, Aquarius', bn: 'Gemini, Libra, Aquarius', kn: 'Gemini, Libra, Aquarius', gu: 'Gemini, Libra, Aquarius', mai: 'मिथुन, तुला, कुम्भ', mr: 'मिथुन, तुला, कुम्भ' }, locale)}</td>
                <td className="py-2 text-gold-light font-semibold">{tl({ en: 'Libra (7)', hi: 'तुला (7)', sa: 'तुला (7)', ta: 'Libra (7)', te: 'Libra (7)', bn: 'Libra (7)', kn: 'Libra (7)', gu: 'Libra (7)', mai: 'तुला (7)', mr: 'तुला (7)' }, locale)}</td>
                <td className="py-2 text-text-secondary/75 hidden sm:table-cell font-mono">7→8→9→10→11→12→1→2→3</td>
              </tr>
              <tr className="border-b border-gold-primary/5">
                <td className="py-2 text-blue-400 font-semibold">{tl({ en: 'Water', hi: 'जल', sa: 'जल', ta: 'Water', te: 'Water', bn: 'Water', kn: 'Water', gu: 'Water', mai: 'जल', mr: 'जल' }, locale)}</td>
                <td className="py-2 text-text-secondary">{tl({ en: 'Cancer, Scorpio, Pisces', hi: 'कर्क, वृश्चिक, मीन', sa: 'कर्क, वृश्चिक, मीन', ta: 'Cancer, Scorpio, Pisces', te: 'Cancer, Scorpio, Pisces', bn: 'Cancer, Scorpio, Pisces', kn: 'Cancer, Scorpio, Pisces', gu: 'Cancer, Scorpio, Pisces', mai: 'कर्क, वृश्चिक, मीन', mr: 'कर्क, वृश्चिक, मीन' }, locale)}</td>
                <td className="py-2 text-gold-light font-semibold">{tl({ en: 'Cancer (4)', hi: 'कर्क (4)', sa: 'कर्क (4)', ta: 'Cancer (4)', te: 'Cancer (4)', bn: 'Cancer (4)', kn: 'Cancer (4)', gu: 'Cancer (4)', mai: 'कर्क (4)', mr: 'कर्क (4)' }, locale)}</td>
                <td className="py-2 text-text-secondary/75 hidden sm:table-cell font-mono">4→5→6→7→8→9→10→11→12</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Worked example */}
        <div className="mt-5 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-3">{tl({ en: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', hi: 'उदाहरण (15 अगस्त 1995, 10:30 AM, दिल्ली):', sa: 'उदाहरण (15 अगस्त 1995, 10:30 AM, दिल्ली):', ta: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', te: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', bn: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', kn: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', gu: 'Worked Example (15 Aug 1995, 10:30 AM, Delhi):', mai: 'उदाहरण (15 अगस्त 1995, 10:30 AM, दिल्ली):', mr: 'उदाहरण (15 अगस्त 1995, 10:30 AM, दिल्ली):' }, locale)}</p>
          <div className="space-y-1">
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', hi: 'सूर्य 118.5° नाक्षत्रिक = कर्क (राशि 4) पर 28.5°', sa: 'सूर्य 118.5° नाक्षत्रिक = कर्क (राशि 4) पर 28.5°', ta: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', te: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', bn: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', kn: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', gu: 'Sun at 118.5° sidereal = Cancer (sign 4) at 28.5°', mai: 'सूर्य 118.5° नाक्षत्रिक = कर्क (राशि 4) पर 28.5°', mr: 'सूर्य 118.5° नाक्षत्रिक = कर्क (राशि 4) पर 28.5°' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', hi: 'कर्क जल राशि है → नवांश कर्क (4) से शुरू', sa: 'कर्क जल राशि है → नवांश कर्क (4) से शुरू', ta: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', te: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', bn: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', kn: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', gu: 'Cancer is a Water sign → Navamsha starts from Cancer (4)', mai: 'कर्क जल राशि है → नवांश कर्क (4) से शुरू', mr: 'कर्क जल राशि है → नवांश कर्क (4) से शुरू' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs">{tl({ en: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', hi: 'नवांश विभाजन: 28.5° ÷ 3.333° = 8.55 → 9वाँ नवांश', sa: 'नवांश विभाजन: 28.5° ÷ 3.333° = 8.55 → 9वाँ नवांश', ta: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', te: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', bn: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', kn: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', gu: 'Navamsha division: 28.5° ÷ 3.333° = 8.55 → 9th navamsha', mai: 'नवांश विभाजन: 28.5° ÷ 3.333° = 8.55 → 9वाँ नवांश', mr: 'नवांश विभाजन: 28.5° ÷ 3.333° = 8.55 → 9वाँ नवांश' }, locale)}</p>
            <p className="text-gold-light/80 font-mono text-xs font-bold text-gold-light">{tl({ en: '9th from Cancer = Pisces → Sun is in Pisces in D9', hi: 'कर्क से 9वीं = मीन → D9 में सूर्य मीन में', sa: 'कर्क से 9वीं = मीन → D9 में सूर्य मीन में', ta: '9th from Cancer = Pisces → Sun is in Pisces in D9', te: '9th from Cancer = Pisces → Sun is in Pisces in D9', bn: '9th from Cancer = Pisces → Sun is in Pisces in D9', kn: '9th from Cancer = Pisces → Sun is in Pisces in D9', gu: '9th from Cancer = Pisces → Sun is in Pisces in D9', mai: 'कर्क से 9वीं = मीन → D9 में सूर्य मीन में', mr: 'कर्क से 9वीं = मीन → D9 में सूर्य मीन में' }, locale)}</p>
            <p className="text-text-secondary/70 text-xs mt-2 italic">
              {locale === 'en'
                ? 'In D1, Sun is in Cancer (friendly sign). In D9, Sun is in Pisces (friendly sign). Both dignified = Sun\'s promises are confirmed.'
                : 'D1 में सूर्य कर्क (मित्र राशि) में। D9 में सूर्य मीन (मित्र राशि) में। दोनों गरिमायुक्त = सूर्य के वादे पुष्ट।'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── NAVAMSHA CALCULATION ─── */}
      <LessonSection number={4} title={t('navCalcTitle')}>
        <p>{t('navCalcText')}</p>

        {/* Key Navamsha concepts */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/20">
            <div className="text-amber-400 font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl({ en: 'Vargottama', hi: 'वर्गोत्तम', sa: 'वर्गोत्तम', ta: 'Vargottama', te: 'Vargottama', bn: 'Vargottama', kn: 'Vargottama', gu: 'Vargottama', mai: 'वर्गोत्तम', mr: 'वर्गोत्तम' }, locale)}
            </div>
            <p className="text-text-secondary text-xs">
              {locale === 'en'
                ? 'When a planet occupies the same sign in both D1 and D9. This happens at 0°-3°20\' of movable signs, 13°20\'-16°40\' of fixed signs, and 26°40\'-30° of dual signs. Vargottama planets are exceptionally strong.'
                : 'जब ग्रह D1 और D9 दोनों में एक ही राशि में हो। चर राशियों में 0°-3°20\', स्थिर में 13°20\'-16°40\', और द्विस्वभाव में 26°40\'-30° पर होता है। वर्गोत्तम ग्रह असाधारण रूप से शक्तिशाली होते हैं।'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/20">
            <div className="text-emerald-400 font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl({ en: 'Pushkara Navamsha', hi: 'पुष्कर नवांश', sa: 'पुष्कर नवांश', ta: 'Pushkara Navamsha', te: 'Pushkara Navamsha', bn: 'Pushkara Navamsha', kn: 'Pushkara Navamsha', gu: 'Pushkara Navamsha', mai: 'पुष्कर नवांश', mr: 'पुष्कर नवांश' }, locale)}
            </div>
            <p className="text-text-secondary text-xs">
              {locale === 'en'
                ? 'Certain Navamsha positions are considered especially auspicious — they "nourish" the planet. These occur when planets fall in specific padas ruled by benefics. A planet in Pushkara Navamsha gains gentle, benefic strength.'
                : 'कुछ नवांश स्थितियाँ विशेष रूप से शुभ मानी जाती हैं — ये ग्रह को "पोषित" करती हैं। पुष्कर नवांश में ग्रह को सौम्य, शुभ बल प्राप्त होता है।'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-500/5 border border-purple-500/20">
            <div className="text-purple-400 font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl({ en: 'Navamsha Drishti', hi: 'नवांश दृष्टि', sa: 'नवांश दृष्टि', ta: 'Navamsha Drishti', te: 'Navamsha Drishti', bn: 'Navamsha Drishti', kn: 'Navamsha Drishti', gu: 'Navamsha Drishti', mai: 'नवांश दृष्टि', mr: 'नवांश दृष्टि' }, locale)}
            </div>
            <p className="text-text-secondary text-xs">
              {locale === 'en'
                ? 'The aspects (drishti) cast by planets in D9 are read independently of D1. Jupiter aspecting the 7th house in D9 blesses marriage even if Jupiter aspects differently in D1. D9 aspects refine D1 predictions.'
                : 'D9 में ग्रहों द्वारा डाली गई दृष्टि D1 से स्वतन्त्र रूप से पढ़ी जाती है। D9 में गुरु की 7वें भाव पर दृष्टि विवाह को आशीर्वाद देती है भले ही D1 में गुरु भिन्न दृष्टि डालता हो।'}
            </p>
          </div>
          <div className="p-4 rounded-lg bg-rose-500/5 border border-rose-500/20">
            <div className="text-rose-400 font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              {tl({ en: '64th Navamsha', hi: '64वाँ नवांश', sa: '64वाँ नवांश', ta: '64th Navamsha', te: '64th Navamsha', bn: '64th Navamsha', kn: '64th Navamsha', gu: '64th Navamsha', mai: '64वाँ नवांश', mr: '64वाँ नवांश' }, locale)}
            </div>
            <p className="text-text-secondary text-xs">
              {locale === 'en'
                ? 'Count 64 navamshas from the Moon\'s navamsha to find the most sensitive point. The lord of the 64th Navamsha indicates danger during its dasha. This is a critical longevity indicator used by classical astrologers.'
                : 'चन्द्र के नवांश से 64 नवांश गिनें। 64वें नवांश का स्वामी अपनी दशा में खतरा दर्शाता है। यह शास्त्रीय ज्योतिषियों द्वारा प्रयुक्त एक महत्वपूर्ण दीर्घायु संकेतक है।'}
            </p>
          </div>
        </div>
      </LessonSection>

      {/* ─── VIMSHOPAK BALA ─── */}
      <LessonSection number={5} title={t('vimshopakTitle')}>
        <p>{t('vimshopakText')}</p>

        {/* Weight table */}
        <div className="mt-5 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/20">
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Chart', hi: 'चार्ट', sa: 'चार्ट', ta: 'Chart', te: 'Chart', bn: 'Chart', kn: 'Chart', gu: 'Chart', mai: 'चार्ट', mr: 'चार्ट' }, locale)}</th>
                <th className="text-center py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Weight', hi: 'भार', sa: 'भार', ta: 'Weight', te: 'Weight', bn: 'Weight', kn: 'Weight', gu: 'Weight', mai: 'भार', mr: 'भार' }, locale)}</th>
                <th className="text-left py-2 text-gold-primary font-semibold text-xs">{tl({ en: 'Proportion', hi: 'अनुपात', sa: 'अनुपात', ta: 'Proportion', te: 'Proportion', bn: 'Proportion', kn: 'Proportion', gu: 'Proportion', mai: 'अनुपात', mr: 'अनुपात' }, locale)}</th>
              </tr>
            </thead>
            <tbody>
              {VIMSHOPAK_WEIGHTS.map((w) => (
                <tr key={w.chart} className="border-b border-gold-primary/5">
                  <td className="py-1.5 text-gold-light font-mono text-xs font-bold">{w.chart}</td>
                  <td className="py-1.5 text-center text-gold-light/70 font-mono text-xs">{w.weight}</td>
                  <td className="py-1.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-bg-primary/50 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-gold-primary/60 to-gold-primary"
                          style={{ width: `${(w.weight / 3.5) * 100}%` }}
                        />
                      </div>
                      <span className="text-text-secondary/65 text-xs font-mono w-10 text-right">{((w.weight / 20) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-bg-primary/50 rounded-lg border border-gold-primary/10">
          <p className="text-gold-light font-mono text-sm mb-2">{tl({ en: 'Strength Levels:', hi: 'शक्ति स्तर:', sa: 'शक्ति स्तर:', ta: 'Strength Levels:', te: 'Strength Levels:', bn: 'Strength Levels:', kn: 'Strength Levels:', gu: 'Strength Levels:', mai: 'शक्ति स्तर:', mr: 'शक्ति स्तर:' }, locale)}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="text-center p-2 rounded bg-emerald-500/10 border border-emerald-500/20">
              <div className="text-emerald-400 font-bold">15-20</div>
              <div className="text-text-secondary/75">{tl({ en: 'Very Strong', hi: 'बहुत शक्तिशाली', sa: 'बहुत शक्तिशाली', ta: 'Very Strong', te: 'Very Strong', bn: 'Very Strong', kn: 'Very Strong', gu: 'Very Strong', mai: 'बहुत शक्तिशाली', mr: 'बहुत शक्तिशाली' }, locale)}</div>
            </div>
            <div className="text-center p-2 rounded bg-amber-500/10 border border-amber-500/20">
              <div className="text-amber-400 font-bold">10-15</div>
              <div className="text-text-secondary/75">{tl({ en: 'Strong', hi: 'शक्तिशाली', sa: 'शक्तिशाली', ta: 'Strong', te: 'Strong', bn: 'Strong', kn: 'Strong', gu: 'Strong', mai: 'शक्तिशाली', mr: 'शक्तिशाली' }, locale)}</div>
            </div>
            <div className="text-center p-2 rounded bg-orange-500/10 border border-orange-500/20">
              <div className="text-orange-400 font-bold">5-10</div>
              <div className="text-text-secondary/75">{tl({ en: 'Moderate', hi: 'मध्यम', sa: 'मध्यम', ta: 'Moderate', te: 'Moderate', bn: 'Moderate', kn: 'Moderate', gu: 'Moderate', mai: 'मध्यम', mr: 'मध्यम' }, locale)}</div>
            </div>
            <div className="text-center p-2 rounded bg-red-500/10 border border-red-500/20">
              <div className="text-red-400 font-bold">0-5</div>
              <div className="text-text-secondary/75">{tl({ en: 'Weak', hi: 'दुर्बल', sa: 'दुर्बल', ta: 'Weak', te: 'Weak', bn: 'Weak', kn: 'Weak', gu: 'Weak', mai: 'दुर्बल', mr: 'दुर्बल' }, locale)}</div>
            </div>
          </div>
        </div>
      </LessonSection>

      {/* ─── HIERARCHY ─── */}
      <LessonSection number={6} title={t('hierarchyTitle')}>
        <p>{t('hierarchyText')}</p>

        <div className="mt-5 space-y-3">
          {/* Essential tier */}
          <div className="p-4 rounded-lg border border-amber-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <div className="text-amber-400 font-bold text-sm mb-2">
              {tl({ en: 'Tier 1 — Always Consult', hi: 'स्तर 1 — सदा परामर्श करें', sa: 'स्तर 1 — सदा परामर्श करें', ta: 'Tier 1 — Always Consult', te: 'Tier 1 — Always Consult', bn: 'Tier 1 — Always Consult', kn: 'Tier 1 — Always Consult', gu: 'Tier 1 — Always Consult', mai: 'स्तर 1 — सदा परामर्श करें', mr: 'स्तर 1 — सदा परामर्श करें' }, locale)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { key: 'D1', name: tl({ en: 'Rashi (Master)', hi: 'राशि (मास्टर)', sa: 'राशि (मास्टर)', ta: 'Rashi (Master)', te: 'Rashi (Master)', bn: 'Rashi (Master)', kn: 'Rashi (Master)', gu: 'Rashi (Master)', mai: 'राशि (मास्टर)', mr: 'राशि (मास्टर)' }, locale) },
                { key: 'D9', name: tl({ en: 'Navamsha (Dharma)', hi: 'नवांश (धर्म)', sa: 'नवांश (धर्म)', ta: 'Navamsha (Dharma)', te: 'Navamsha (Dharma)', bn: 'Navamsha (Dharma)', kn: 'Navamsha (Dharma)', gu: 'Navamsha (Dharma)', mai: 'नवांश (धर्म)', mr: 'नवांश (धर्म)' }, locale) },
                { key: 'D10', name: tl({ en: 'Dasamsha (Career)', hi: 'दशांश (करियर)', sa: 'दशांश (करियर)', ta: 'Dasamsha (Career)', te: 'Dasamsha (Career)', bn: 'Dasamsha (Career)', kn: 'Dasamsha (Career)', gu: 'Dasamsha (Career)', mai: 'दशांश (करियर)', mr: 'दशांश (करियर)' }, locale) },
                { key: 'D60', name: tl({ en: 'Shashtiamsha (Karma)', hi: 'षष्ट्यंश (कर्म)', sa: 'षष्ट्यंश (कर्म)', ta: 'Shashtiamsha (Karma)', te: 'Shashtiamsha (Karma)', bn: 'Shashtiamsha (Karma)', kn: 'Shashtiamsha (Karma)', gu: 'Shashtiamsha (Karma)', mai: 'षष्ट्यंश (कर्म)', mr: 'षष्ट्यंश (कर्म)' }, locale) },
              ].map((c) => (
                <div key={c.key} className="text-center p-2 rounded bg-amber-500/10">
                  <div className="text-amber-400 font-bold">{c.key}</div>
                  <div className="text-text-secondary/75">{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Important tier */}
          <div className="p-4 rounded-lg border border-emerald-500/20 bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27]">
            <div className="text-emerald-400 font-bold text-sm mb-2">
              {tl({ en: 'Tier 2 — Consult for Specific Questions', hi: 'स्तर 2 — विशिष्ट प्रश्नों के लिए', sa: 'स्तर 2 — विशिष्ट प्रश्नों के लिए', ta: 'Tier 2 — Consult for Specific Questions', te: 'Tier 2 — Consult for Specific Questions', bn: 'Tier 2 — Consult for Specific Questions', kn: 'Tier 2 — Consult for Specific Questions', gu: 'Tier 2 — Consult for Specific Questions', mai: 'स्तर 2 — विशिष्ट प्रश्नों के लिए', mr: 'स्तर 2 — विशिष्ट प्रश्नों के लिए' }, locale)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { key: 'D7', name: tl({ en: 'Saptamsha (Children)', hi: 'सप्तमांश (संतान)', sa: 'सप्तमांश (संतान)', ta: 'Saptamsha (Children)', te: 'Saptamsha (Children)', bn: 'Saptamsha (Children)', kn: 'Saptamsha (Children)', gu: 'Saptamsha (Children)', mai: 'सप्तमांश (संतान)', mr: 'सप्तमांश (संतान)' }, locale) },
                { key: 'D16', name: tl({ en: 'Shodasamsha (Comforts)', hi: 'षोडशांश (सुख)', sa: 'षोडशांश (सुख)', ta: 'Shodasamsha (Comforts)', te: 'Shodasamsha (Comforts)', bn: 'Shodasamsha (Comforts)', kn: 'Shodasamsha (Comforts)', gu: 'Shodasamsha (Comforts)', mai: 'षोडशांश (सुख)', mr: 'षोडशांश (सुख)' }, locale) },
                { key: 'D30', name: tl({ en: 'Trimshamsha (Evils)', hi: 'त्रिंशांश (दुःख)', sa: 'त्रिंशांश (दुःख)', ta: 'Trimshamsha (Evils)', te: 'Trimshamsha (Evils)', bn: 'Trimshamsha (Evils)', kn: 'Trimshamsha (Evils)', gu: 'Trimshamsha (Evils)', mai: 'त्रिंशांश (दुःख)', mr: 'त्रिंशांश (दुःख)' }, locale) },
              ].map((c) => (
                <div key={c.key} className="text-center p-2 rounded bg-emerald-500/10">
                  <div className="text-emerald-400 font-bold">{c.key}</div>
                  <div className="text-text-secondary/75">{c.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting tier */}
          <div className="p-4 rounded-lg border border-blue-500/20 bg-blue-500/5">
            <div className="text-blue-400 font-bold text-sm mb-2">
              {tl({ en: 'Tier 3 — Fine-Tuning & Specialization', hi: 'स्तर 3 — सूक्ष्म समायोजन', sa: 'स्तर 3 — सूक्ष्म समायोजन', ta: 'Tier 3 — Fine-Tuning & Specialization', te: 'Tier 3 — Fine-Tuning & Specialization', bn: 'Tier 3 — Fine-Tuning & Specialization', kn: 'Tier 3 — Fine-Tuning & Specialization', gu: 'Tier 3 — Fine-Tuning & Specialization', mai: 'स्तर 3 — सूक्ष्म समायोजन', mr: 'स्तर 3 — सूक्ष्म समायोजन' }, locale)}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs">
              {[
                { key: 'D2', name: tl({ en: 'Hora', hi: 'होरा', sa: 'होरा', ta: 'Hora', te: 'Hora', bn: 'Hora', kn: 'Hora', gu: 'Hora', mai: 'होरा', mr: 'होरा' }, locale) },
                { key: 'D3', name: tl({ en: 'Drekkana', hi: 'द्रेष्काण', sa: 'द्रेष्काण', ta: 'Drekkana', te: 'Drekkana', bn: 'Drekkana', kn: 'Drekkana', gu: 'Drekkana', mai: 'द्रेष्काण', mr: 'द्रेष्काण' }, locale) },
                { key: 'D4', name: tl({ en: 'Chaturthamsha', hi: 'चतुर्थांश', sa: 'चतुर्थांश', ta: 'Chaturthamsha', te: 'Chaturthamsha', bn: 'Chaturthamsha', kn: 'Chaturthamsha', gu: 'Chaturthamsha', mai: 'चतुर्थांश', mr: 'चतुर्थांश' }, locale) },
                { key: 'D12', name: tl({ en: 'Dwadasamsha', hi: 'द्वादशांश', sa: 'द्वादशांश', ta: 'Dwadasamsha', te: 'Dwadasamsha', bn: 'Dwadasamsha', kn: 'Dwadasamsha', gu: 'Dwadasamsha', mai: 'द्वादशांश', mr: 'द्वादशांश' }, locale) },
                { key: 'D20', name: tl({ en: 'Vimshamsha', hi: 'विंशांश', sa: 'विंशांश', ta: 'Vimshamsha', te: 'Vimshamsha', bn: 'Vimshamsha', kn: 'Vimshamsha', gu: 'Vimshamsha', mai: 'विंशांश', mr: 'विंशांश' }, locale) },
                { key: 'D24', name: tl({ en: 'Siddhamsha', hi: 'सिद्धांश', sa: 'सिद्धांश', ta: 'Siddhamsha', te: 'Siddhamsha', bn: 'Siddhamsha', kn: 'Siddhamsha', gu: 'Siddhamsha', mai: 'सिद्धांश', mr: 'सिद्धांश' }, locale) },
                { key: 'D27', name: tl({ en: 'Bhamsha', hi: 'भांश', sa: 'भांश', ta: 'Bhamsha', te: 'Bhamsha', bn: 'Bhamsha', kn: 'Bhamsha', gu: 'Bhamsha', mai: 'भांश', mr: 'भांश' }, locale) },
                { key: 'D40', name: tl({ en: 'Khavedamsha', hi: 'खवेदांश', sa: 'खवेदांश', ta: 'Khavedamsha', te: 'Khavedamsha', bn: 'Khavedamsha', kn: 'Khavedamsha', gu: 'Khavedamsha', mai: 'खवेदांश', mr: 'खवेदांश' }, locale) },
                { key: 'D45', name: tl({ en: 'Akshavedamsha', hi: 'अक्षवेदांश', sa: 'अक्षवेदांश', ta: 'Akshavedamsha', te: 'Akshavedamsha', bn: 'Akshavedamsha', kn: 'Akshavedamsha', gu: 'Akshavedamsha', mai: 'अक्षवेदांश', mr: 'अक्षवेदांश' }, locale) },
              ].map((c) => (
                <div key={c.key} className="text-center p-2 rounded bg-blue-500/10">
                  <div className="text-blue-400 font-bold">{c.key}</div>
                  <div className="text-text-secondary/75">{c.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </LessonSection>

      {/* ─── 7-STEP INTERPRETATION ─── */}
      <LessonSection number={7} title={t('interpretTitle')} variant="highlight">
        <p className="mb-5">{t('interpretText')}</p>

        <div className="space-y-4">
          {INTERPRETATION_STEPS.map((s) => (
            <div key={s.step} className="flex gap-4 p-4 rounded-lg bg-bg-primary/50 border border-gold-primary/10">
              <span className="w-8 h-8 rounded-full bg-gold-primary/15 border border-gold-primary/30 flex items-center justify-center text-gold-light text-sm font-bold flex-shrink-0">
                {s.step}
              </span>
              <div>
                <div className="text-gold-light font-semibold text-sm mb-1">{tl(s.title, locale)}</div>
                <p className="text-text-secondary text-sm">{tl(s.desc, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── GOLDEN RULES ─── */}
      <LessonSection number={8} title={t('rulesTitle')}>
        <p className="mb-5">{t('rulesText')}</p>

        <div className="space-y-3">
          {GOLDEN_RULES.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, ease: 'easeOut' as const }}
              className="flex gap-4 p-4 rounded-lg bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12"
            >
              <div
                className="w-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: r.color }}
              />
              <div>
                <div className="font-bold text-sm mb-1" style={{ color: r.color }}>{tl(r.rule, locale)}</div>
                <p className="text-text-secondary text-sm">{tl(r.desc, locale)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </LessonSection>

      {/* ─── PRACTICAL EXAMPLES ─── */}
      <LessonSection number={9} title={t('practicalTitle')}>
        <p className="mb-5">{t('practicalText')}</p>

        {/* D9 Interpretation Example */}
        <div className="mb-5 p-5 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 border border-amber-500/20">
          <h4 className="text-amber-400 font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Example 1: Reading D9 for Marriage', hi: 'उदाहरण 1: D9 से विवाह पढ़ना', sa: 'उदाहरण 1: D9 से विवाह पढ़ना', ta: 'Example 1: Reading D9 for Marriage', te: 'Example 1: Reading D9 for Marriage', bn: 'Example 1: Reading D9 for Marriage', kn: 'Example 1: Reading D9 for Marriage', gu: 'Example 1: Reading D9 for Marriage', mai: 'उदाहरण 1: D9 से विवाह पढ़ना', mr: 'उदाहरण 1: D9 से विवाह पढ़ना' }, locale)}
          </h4>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>{locale === 'en'
              ? '1. Check D1 first: 7th house (Aries) has Ketu. 7th lord Mars is in 12th house (Virgo) — challenging placement for marriage.'
              : '1. पहले D1 जाँचें: 7वाँ भाव (मेष) में केतु। 7वाँ स्वामी मंगल 12वें भाव (कन्या) में — विवाह के लिए चुनौतीपूर्ण।'}</p>
            <p>{locale === 'en'
              ? '2. Now check D9: Where is Venus (marriage karaka)? What sign rises in D9? Where is the D9 7th lord?'
              : '2. अब D9 जाँचें: शुक्र (विवाह कारक) कहाँ है? D9 में कौन सी राशि उदित है? D9 का 7वाँ स्वामी कहाँ है?'}</p>
            <p>{locale === 'en'
              ? '3. If Venus is exalted or in own sign in D9, marriage will eventually happen despite D1 challenges. The Dasha of Venus or D9 7th lord will trigger the event.'
              : '3. यदि D9 में शुक्र उच्च या स्वराशि में है, तो D1 की चुनौतियों के बावजूद विवाह होगा। शुक्र या D9 7वें स्वामी की दशा में घटना घटित होगी।'}</p>
            <p className="text-gold-light/60 italic text-xs mt-2">
              {locale === 'en'
                ? 'Key insight: D1 shows the circumstances, D9 shows the outcome and quality of marriage.'
                : 'मुख्य अन्तर्दृष्टि: D1 परिस्थितियाँ दिखाता है, D9 विवाह का परिणाम और गुणवत्ता दिखाता है।'}
            </p>
          </div>
        </div>

        {/* D10 Interpretation Example */}
        <div className="mb-5 p-5 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 border border-emerald-500/20">
          <h4 className="text-emerald-400 font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Example 2: Reading D10 for Career', hi: 'उदाहरण 2: D10 से करियर पढ़ना', sa: 'उदाहरण 2: D10 से करियर पढ़ना', ta: 'Example 2: Reading D10 for Career', te: 'Example 2: Reading D10 for Career', bn: 'Example 2: Reading D10 for Career', kn: 'Example 2: Reading D10 for Career', gu: 'Example 2: Reading D10 for Career', mai: 'उदाहरण 2: D10 से करियर पढ़ना', mr: 'उदाहरण 2: D10 से करियर पढ़ना' }, locale)}
          </h4>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>{locale === 'en'
              ? '1. D1 check: 10th house (Cancer) has Sun — indicates government, authority, or leadership roles. 10th lord Moon is in 3rd house (Sagittarius) — communication, media, or short travels in career.'
              : '1. D1 जाँच: 10वाँ भाव (कर्क) में सूर्य — सरकार, अधिकार या नेतृत्व। 10वाँ स्वामी चन्द्र 3वें भाव (धनु) में — करियर में संचार, मीडिया।'}</p>
            <p>{locale === 'en'
              ? '2. D10 analysis: Note the D10 Lagna sign and lord. Which planets occupy the 10th house of D10? Is Sun (career karaka) strong here?'
              : '2. D10 विश्लेषण: D10 लग्न राशि और स्वामी नोट करें। D10 के 10वें भाव में कौन से ग्रह हैं? क्या सूर्य (करियर कारक) यहाँ शक्तिशाली है?'}</p>
            <p>{locale === 'en'
              ? '3. If D10 confirms D1 themes (Sun strong, 10th lord well-placed), career success is assured. If D10 shows a different picture, expect career changes or redirections.'
              : '3. यदि D10 D1 के विषयों की पुष्टि करता है (सूर्य शक्तिशाली, 10वाँ स्वामी सुस्थित), तो करियर सफलता सुनिश्चित। यदि D10 भिन्न चित्र दिखाता है, तो करियर परिवर्तन की अपेक्षा करें।'}</p>
          </div>
        </div>

        {/* D7 Interpretation Example */}
        <div className="p-5 rounded-xl bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 border border-purple-500/20">
          <h4 className="text-purple-400 font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {tl({ en: 'Example 3: Reading D7 for Children', hi: 'उदाहरण 3: D7 से संतान पढ़ना', sa: 'उदाहरण 3: D7 से संतान पढ़ना', ta: 'Example 3: Reading D7 for Children', te: 'Example 3: Reading D7 for Children', bn: 'Example 3: Reading D7 for Children', kn: 'Example 3: Reading D7 for Children', gu: 'Example 3: Reading D7 for Children', mai: 'उदाहरण 3: D7 से संतान पढ़ना', mr: 'उदाहरण 3: D7 से संतान पढ़ना' }, locale)}
          </h4>
          <div className="space-y-2 text-sm text-text-secondary">
            <p>{locale === 'en'
              ? '1. D1 check: 5th house (Aquarius) has Saturn (own sign) — indicates delayed but eventual children. Jupiter (putra karaka) in 2nd house (Scorpio) — supports progeny.'
              : '1. D1 जाँच: 5वाँ भाव (कुम्भ) में शनि (स्वराशि) — विलम्बित लेकिन अन्ततः संतान। गुरु (पुत्र कारक) 2वें भाव (वृश्चिक) में — संतान का समर्थन।'}</p>
            <p>{locale === 'en'
              ? '2. D7 analysis: Check Jupiter\'s position and strength in D7. Is the 5th house of D7 occupied by benefics? Where is the D7 5th lord?'
              : '2. D7 विश्लेषण: D7 में गुरु की स्थिति और बल जाँचें। क्या D7 का 5वाँ भाव शुभ ग्रहों से युक्त है? D7 का 5वाँ स्वामी कहाँ है?'}</p>
            <p>{locale === 'en'
              ? '3. Timing: Children are likely during the Dasha/Antar of the D1 5th lord or Jupiter, provided D7 supports it. The transit of Jupiter over D7 5th house can trigger conception.'
              : '3. समय: D1 5वें स्वामी या गुरु की दशा/अन्तर्दशा में संतान की सम्भावना, बशर्ते D7 समर्थन करे। D7 5वें भाव पर गुरु का गोचर गर्भधारण को प्रेरित कर सकता है।'}</p>
          </div>
        </div>
      </LessonSection>

      {/* ─── COMMON MISTAKES ─── */}
      <LessonSection number={10} title={t('mistakesTitle')}>
        <p className="mb-5">{t('mistakesText')}</p>

        <div className="space-y-3">
          {MISTAKES.map((m, i) => (
            <div key={i} className="p-4 rounded-lg bg-bg-primary/50 border border-red-500/10">
              <div className="flex items-start gap-3 mb-2">
                <span className="text-red-400 text-lg font-bold leading-none mt-0.5">✗</span>
                <div className="text-red-400/80 font-semibold text-sm">{tl(m.mistake, locale)}</div>
              </div>
              <div className="flex items-start gap-3 ml-0">
                <span className="text-emerald-400 text-lg font-bold leading-none mt-0.5">✓</span>
                <p className="text-text-secondary text-sm">{tl(m.fix, locale)}</p>
              </div>
            </div>
          ))}
        </div>
      </LessonSection>

      {/* ─── DEEPER LINKS ─── */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gold-gradient mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {t('deeper')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {DEEPER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-4 hover:border-gold-primary/30 transition-all group"
            >
              <div className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors">
                {tl(link.label, locale)}
              </div>
              <p className="text-text-secondary/75 text-xs mt-1">{tl(link.desc, locale)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ─── CTA ─── */}
      <div className="mt-8 text-center">
        <Link
          href="/kundali"
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gold-primary/10 border border-gold-primary/30 text-gold-light hover:bg-gold-primary/20 transition-colors text-base font-bold"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {t('tryIt')}
        </Link>
      </div>
    </div>
  );
}

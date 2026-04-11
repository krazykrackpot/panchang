'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import { ShareRow } from '@/components/ui/ShareButton';

/* ════════════════════════════════════════════════════════════════
   LABELS — bilingual (en / hi)
   ════════════════════════════════════════════════════════════════ */
const L = {
  title: {
    en: 'The Kerala School — When India Invented Calculus 250 Years Before Europe',
    hi: 'केरल स्कूल — जब भारत ने यूरोप से 250 वर्ष पहले कलनशास्त्र की खोज की',
  },
  subtitle: {
    en: 'Between 1350 and 1550 CE, in a small corner of southern India, a lineage of mathematicians achieved something extraordinary. Working without formal academic institutions, without printing presses, without international communication — they independently discovered infinite series, the foundations of calculus, and computed \u03C0 to 11 decimal places. Their work predates Newton and Leibniz by 250\u2013340 years. This is the story of the Kerala School of Astronomy and Mathematics.',
    hi: '1350 और 1550 ई. के बीच, दक्षिण भारत के एक छोटे कोने में, गणितज्ञों की एक वंश-परम्परा ने कुछ असाधारण किया। बिना औपचारिक शिक्षण संस्थानों के, बिना छापाखाने के, बिना अन्तर्राष्ट्रीय संचार के — उन्होंने स्वतन्त्र रूप से अनन्त श्रेणी, कलनशास्त्र की नींव, और \u03C0 का 11 दशमलव स्थानों तक मान खोजा। उनका कार्य न्यूटन और लाइबनिज से 250\u2013340 वर्ष पहले का है। यह केरल गणित और खगोल विज्ञान विद्यालय की कहानी है।',
  },

  /* Section 1 */
  s1Title: { en: 'The Setting \u2014 Sangamagrama to Trikkandiyur', hi: 'पृष्ठभूमि \u2014 संगमग्राम से त्रिक्कण्डियूर' },
  s1Body: {
    en: 'Madhava of Sangamagrama (~1340\u20131425 CE) \u2014 the founder of the Kerala School \u2014 was born in the village of Sangamagrama, modern-day Irinjalakuda near Thrissur in Kerala. He was not a wandering scholar or a court mathematician; he was a temple-affiliated astronomer working in a tradition called "Illam" \u2014 hereditary scholarly households attached to Hindu temples. His students carried his work forward through five generations: Parameshvara, Nilakantha Somayaji, Jyeshthadeva, Achyuta Pisharati, and others. Knowledge was transmitted through palm-leaf manuscripts, recitation, and direct teacher-student lineage.',
    hi: 'संगमग्राम के माधव (~1340\u20131425 ई.) \u2014 केरल स्कूल के संस्थापक \u2014 का जन्म केरल के त्रिशूर के निकट संगमग्राम (आधुनिक इरिंजलकुडा) गाँव में हुआ था। वे न तो भ्रमणशील विद्वान थे और न ही राजदरबारी गणितज्ञ; वे "इल्लम" \u2014 हिन्दू मन्दिरों से जुड़े वंशानुगत विद्वत् परिवार \u2014 से सम्बद्ध मन्दिर-खगोलशास्त्री थे। उनके शिष्यों ने पाँच पीढ़ियों तक उनके कार्य को आगे बढ़ाया: परमेश्वर, नीलकण्ठ सोमयाजी, ज्येष्ठदेव, अच्युत पिशारटि आदि। ज्ञान ताड़-पत्र पाण्डुलिपियों, पाठ और प्रत्यक्ष गुरु-शिष्य परम्परा के माध्यम से संचारित होता था।',
  },
  s1Why: {
    en: 'Why Kerala? A unique combination of factors: a strong Vedic mathematical tradition stretching back to the Sulba Sutras; thriving maritime trade with Arabia, China, and Southeast Asia that demanded precise navigation and calendar computation; a stable political environment under the Zamorins of Calicut who patronized scholarship; and Kerala\'s geographic isolation that allowed this tradition to develop independently for centuries without disruption from the invasions that affected northern India.',
    hi: 'केरल ही क्यों? कारकों का एक अनूठा संयोग: शुल्ब सूत्रों से चली आ रही सशक्त वैदिक गणितीय परम्परा; अरब, चीन और दक्षिण-पूर्व एशिया के साथ समृद्ध समुद्री व्यापार जिसके लिए सटीक नौवहन और पंचांग गणना आवश्यक थी; कालीकट के ज़मोरिन शासकों के संरक्षण में स्थिर राजनीतिक वातावरण; और केरल का भौगोलिक अलगाव जिसने इस परम्परा को उत्तर भारत को प्रभावित करने वाले आक्रमणों से अबाधित शताब्दियों तक स्वतन्त्र रूप से विकसित होने दिया।',
  },

  /* Section 2 */
  s2Title: {
    en: "Madhava's \u03C0 Series \u2014 The Crown Jewel",
    hi: 'माधव की \u03C0 श्रेणी \u2014 मुकुट-मणि',
  },
  s2Body: {
    en: 'The most famous result of the Kerala School is the infinite series for \u03C0. In Western textbooks, this is called the "Leibniz formula" after Gottfried Leibniz who published it in 1674. But Madhava derived it approximately 324 years earlier, around 1350 CE.',
    hi: 'केरल स्कूल का सबसे प्रसिद्ध परिणाम \u03C0 के लिए अनन्त श्रेणी है। पश्चिमी पाठ्यपुस्तकों में इसे गॉटफ्रीड लाइबनिज (1674) के नाम पर "लाइबनिज सूत्र" कहा जाता है। लेकिन माधव ने इसे लगभग 324 वर्ष पहले, ~1350 ई. में, व्युत्पन्न किया था।',
  },
  s2Slow: {
    en: 'This series converges painfully slowly. After 10 terms you get 3.0418 (not great). After 100 terms: 3.1315 (still only one correct decimal). After 1,000 terms: 3.14059 (just two decimals). You would need millions of terms to get even 6 correct decimals from the raw series.',
    hi: 'यह श्रेणी अत्यन्त धीमी गति से अभिसरित होती है। 10 पदों के बाद 3.0418 (अच्छा नहीं)। 100 पदों के बाद: 3.1315 (अभी भी केवल एक सही दशमलव)। 1,000 पदों के बाद: 3.14059 (केवल दो दशमलव)। कच्ची श्रेणी से 6 सही दशमलव प्राप्त करने के लिए भी लाखों पदों की आवश्यकता होगी।',
  },
  s2Genius: {
    en: "This is where Madhava's genius shines. He didn't just discover the series \u2014 he knew it was slow, and he invented correction terms to accelerate it. After summing N terms of the alternating series, he added a correction factor:",
    hi: 'यहीं माधव की प्रतिभा चमकती है। उन्होंने केवल श्रेणी की खोज नहीं की \u2014 उन्हें पता था कि यह धीमी है, और उन्होंने इसे तेज़ करने के लिए सुधार पद (correction terms) का आविष्कार किया। N पदों का योग करने के बाद, उन्होंने एक सुधार कारक जोड़ा:',
  },
  s2Result: {
    en: 'With just 50 terms plus the correction, Madhava computed \u03C0 accurate to 11 decimal places: 3.14159265358... Europe did not develop comparable series acceleration techniques until Euler in the 1740s \u2014 nearly 400 years later.',
    hi: 'केवल 50 पदों और सुधार के साथ, माधव ने \u03C0 का 11 दशमलव स्थानों तक सटीक मान निकाला: 3.14159265358... यूरोप ने तुलनीय श्रेणी-त्वरण तकनीकें ऑयलर (1740 के दशक) तक विकसित नहीं कीं \u2014 लगभग 400 वर्ष बाद।',
  },

  /* Section 3 */
  s3Title: {
    en: 'The Sine and Cosine Series \u2014 Taylor Series, 300 Years Early',
    hi: 'Sine और Cosine श्रेणी \u2014 टेलर श्रेणी, 300 वर्ष पहले',
  },
  s3Body: {
    en: 'The series sin(x) = x \u2212 x\u00B3/3! + x\u2075/5! \u2212 x\u2077/7! + ... is taught worldwide as the "Taylor series" or "Maclaurin series," named after Brook Taylor (1715) and Colin Maclaurin (1742). Madhava derived this series around 1400 CE \u2014 more than 300 years before either European mathematician.',
    hi: 'श्रेणी sin(x) = x \u2212 x\u00B3/3! + x\u2075/5! \u2212 x\u2077/7! + ... को विश्वभर में "टेलर श्रेणी" या "मैक्लॉरिन श्रेणी" पढ़ाया जाता है, ब्रुक टेलर (1715) और कॉलिन मैक्लॉरिन (1742) के नाम पर। माधव ने यह श्रेणी लगभग 1400 ई. में व्युत्पन्न की \u2014 दोनों यूरोपीय गणितज्ञों से 300+ वर्ष पहले।',
  },
  s3Worked: {
    en: 'Let us verify with a worked example. To compute sin(30\u00B0), we convert to radians: x = \u03C0/6 \u2248 0.5236.',
    hi: 'एक हल किए गए उदाहरण से सत्यापित करें। sin(30\u00B0) की गणना के लिए रेडियन में परिवर्तित करें: x = \u03C0/6 \u2248 0.5236।',
  },
  s3Cosine: {
    en: 'Madhava also derived the cosine series: cos(x) = 1 \u2212 x\u00B2/2! + x\u2074/4! \u2212 x\u2076/6! + ... These are EXACTLY what modern mathematics calls the Taylor/Maclaurin expansions. The key insight is that each term involves the factorial and successive powers of x \u2014 a concept that requires understanding derivatives, even if you don\'t call them that.',
    hi: 'माधव ने cosine श्रेणी भी व्युत्पन्न की: cos(x) = 1 \u2212 x\u00B2/2! + x\u2074/4! \u2212 x\u2076/6! + ... ये ठीक वही हैं जिन्हें आधुनिक गणित Taylor/Maclaurin प्रसार कहता है। मुख्य अन्तर्दृष्टि यह है कि प्रत्येक पद में क्रमगुणित (factorial) और x की क्रमिक घातें शामिल हैं \u2014 एक अवधारणा जिसके लिए अवकलज (derivatives) की समझ आवश्यक है, भले ही आप उन्हें वह नाम न दें।',
  },

  /* Section 4 */
  s4Title: {
    en: 'The Arctangent Series \u2014 The Bridge to \u03C0',
    hi: 'Arctangent श्रेणी \u2014 \u03C0 का सेतु',
  },
  s4Body: {
    en: "Madhava also derived: arctan(x) = x \u2212 x\u00B3/3 + x\u2075/5 \u2212 x\u2077/7 + ... (for |x| \u2264 1). This is called the \"Gregory-Leibniz series\" in Western textbooks, after James Gregory (1671) and Leibniz (1674). Setting x = 1 gives the \u03C0/4 series from Section 2. But here is Madhava's deeper insight: by choosing x = 1/\u221A3, the series converges MUCH faster:",
    hi: 'माधव ने यह भी व्युत्पन्न किया: arctan(x) = x \u2212 x\u00B3/3 + x\u2075/5 \u2212 x\u2077/7 + ... (|x| \u2264 1 के लिए)। पश्चिमी पाठ्यपुस्तकों में इसे जेम्स ग्रेगरी (1671) और लाइबनिज (1674) के नाम पर "ग्रेगरी-लाइबनिज श्रेणी" कहते हैं। x = 1 रखने पर खण्ड 2 वाली \u03C0/4 श्रेणी मिलती है। लेकिन माधव की गहरी अन्तर्दृष्टि यह थी: x = 1/\u221A3 चुनने पर, श्रेणी बहुत तेज़ी से अभिसरित होती है:',
  },
  s4Formula: {
    en: '\u03C0/6 = (1/\u221A3) \u00D7 (1 \u2212 1/(3\u00D73) + 1/(5\u00D79) \u2212 1/(7\u00D727) + ...)',
    hi: '\u03C0/6 = (1/\u221A3) \u00D7 (1 \u2212 1/(3\u00D73) + 1/(5\u00D79) \u2212 1/(7\u00D727) + ...)',
  },
  s4Insight: {
    en: 'Because 1/\u221A3 \u2248 0.577, each successive power shrinks much faster than when x = 1. After just 21 terms (vs thousands with x = 1), Madhava could get \u03C0 to many decimal places. Combined with his correction terms, this is how he achieved 11-decimal accuracy \u2014 a feat not matched in Europe until the 18th century.',
    hi: 'क्योंकि 1/\u221A3 \u2248 0.577, प्रत्येक क्रमिक घात x = 1 की तुलना में बहुत तेज़ी से घटती है। केवल 21 पदों के बाद (x = 1 के साथ हज़ारों के बजाय), माधव \u03C0 का कई दशमलव स्थानों तक मान प्राप्त कर सकते थे। अपने सुधार पदों के साथ मिलाकर, उन्होंने 11-दशमलव सटीकता प्राप्त की \u2014 18वीं शताब्दी तक यूरोप में यह उपलब्धि नहीं मिली।',
  },

  /* Section 5 */
  s5Title: {
    en: 'What IS Calculus? \u2014 Making It Accessible',
    hi: 'कलनशास्त्र क्या है? \u2014 सरल भाषा में',
  },
  s5Body: {
    en: 'Calculus rests on three pillars: (1) Derivatives \u2014 the rate at which things change; (2) Integrals \u2014 how things accumulate; (3) Infinite Series \u2014 expressing functions as infinite sums. The Kerala School mastered pillar (3) completely and had significant work on (1) and (2). Nilakantha\'s planetary correction techniques use what we would recognize as differential methods. Jyeshthadeva\'s Yuktibhasha derives series using infinitesimal subdivision of arcs \u2014 essentially integration.',
    hi: 'कलनशास्त्र तीन स्तम्भों पर टिका है: (1) अवकलज \u2014 परिवर्तन की दर; (2) समाकलन \u2014 संचय की प्रक्रिया; (3) अनन्त श्रेणी \u2014 फलनों को अनन्त योग के रूप में व्यक्त करना। केरल स्कूल ने स्तम्भ (3) पर पूर्ण अधिकार प्राप्त किया और (1) तथा (2) पर भी महत्त्वपूर्ण कार्य किया। नीलकण्ठ की ग्रहीय सुधार तकनीकें अवकलजी विधियों जैसी हैं। ज्येष्ठदेव की युक्तिभाषा चापों के सूक्ष्म विभाजन \u2014 अनिवार्यतः समाकलन \u2014 द्वारा श्रेणियाँ व्युत्पन्न करती है।',
  },
  s5Key: {
    en: 'Here is the critical point: if you can express sin(x) as x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ..., you MUST understand that each term is related to the derivative of the previous term. The coefficient pattern (1, 1/6, 1/120, 1/5040...) is exactly 1/n! \u2014 and the factorial arises from repeated differentiation. Whether or not you use the word "derivative," if you can construct these series, you have the conceptual machinery of calculus.',
    hi: 'यहाँ निर्णायक बात है: यदि आप sin(x) को x \u2212 x\u00B3/6 + x\u2075/120 \u2212 ... के रूप में व्यक्त कर सकते हैं, तो आपको यह समझना ही होगा कि प्रत्येक पद पिछले पद के अवकलज से सम्बन्धित है। गुणांक प्रतिरूप (1, 1/6, 1/120, 1/5040...) ठीक 1/n! है \u2014 और क्रमगुणित बार-बार अवकलन से उत्पन्न होता है। चाहे आप "अवकलज" शब्द का प्रयोग करें या न करें, यदि आप ये श्रेणियाँ बना सकते हैं, तो आपके पास कलनशास्त्र का वैचारिक तन्त्र है।',
  },

  /* Section 6 */
  s6Title: {
    en: 'Nilakantha Somayaji \u2014 Tantrasangraha (1500 CE)',
    hi: 'नीलकण्ठ सोमयाजी \u2014 तन्त्रसंग्रह (1500 ई.)',
  },
  s6Body: {
    en: "Nilakantha Somayaji (~1444\u20131544 CE) was Madhava's most brilliant intellectual descendant. His masterwork, the Tantrasangraha (1500 CE), refined Madhava's planetary models with an astonishing insight: Mercury and Venus orbit the Sun, which in turn orbits the Earth. This partial heliocentric model is geometrically identical to the Tychonic system proposed by Tycho Brahe in 1588 \u2014 88 years later. Nilakantha's model correctly predicted Mercury and Venus's positions better than any previous Indian or Greek model.",
    hi: 'नीलकण्ठ सोमयाजी (~1444\u20131544 ई.) माधव के सबसे प्रतिभाशाली बौद्धिक उत्तराधिकारी थे। उनकी कृति तन्त्रसंग्रह (1500 ई.) ने माधव के ग्रहीय मॉडल को एक चौंकाने वाली अन्तर्दृष्टि से परिष्कृत किया: बुध और शुक्र सूर्य की परिक्रमा करते हैं, जो बदले में पृथ्वी की परिक्रमा करता है। यह आंशिक सौर-केन्द्रीय मॉडल टायको ब्राहे (1588) द्वारा प्रस्तावित टाइकोनिक प्रणाली से ज्यामितीय रूप से समरूप है \u2014 88 वर्ष बाद। नीलकण्ठ का मॉडल किसी भी पूर्ववर्ती भारतीय या यूनानी मॉडल से बेहतर बुध और शुक्र की स्थिति का पूर्वानुमान करता था।',
  },

  /* Section 7 */
  s7Title: {
    en: "Jyeshthadeva \u2014 Yuktibhasha (~1530 CE): The World's First Calculus Textbook",
    hi: 'ज्येष्ठदेव \u2014 युक्तिभाषा (~1530 ई.): विश्व की पहली कलनशास्त्र पाठ्यपुस्तक',
  },
  s7Body: {
    en: "Jyeshthadeva (~1500\u20131575 CE) wrote the Yuktibhasha (\"Rationale in the local language\"), arguably the most important mathematical text you have never heard of. Written in Malayalam \u2014 not Sanskrit \u2014 to make it accessible to a wider audience, it contains detailed PROOFS of all Kerala School results. This is key: Europe credits Newton and Leibniz partly because they provided rigorous proofs. But Jyeshthadeva wrote proofs 150 years earlier.",
    hi: 'ज्येष्ठदेव (~1500\u20131575 ई.) ने युक्तिभाषा ("स्थानीय भाषा में युक्ति") लिखी \u2014 सम्भवतः सबसे महत्त्वपूर्ण गणितीय ग्रन्थ जिसके बारे में आपने कभी नहीं सुना। इसे संस्कृत में नहीं बल्कि मलयालम में लिखा गया \u2014 व्यापक पाठकों तक पहुँच के लिए \u2014 और इसमें केरल स्कूल के सभी परिणामों के विस्तृत प्रमाण हैं। यह निर्णायक है: यूरोप न्यूटन और लाइबनिज को आंशिक रूप से इसलिए श्रेय देता है क्योंकि उन्होंने कठोर प्रमाण दिए। लेकिन ज्येष्ठदेव ने 150 वर्ष पहले प्रमाण लिखे।',
  },
  s7Method: {
    en: "The Yuktibhasha derives the infinite series step by step: it starts from the formula for the sum of a geometric series, builds up to the sum of integer powers (1\u00B2 + 2\u00B2 + ... + n\u00B2, and higher powers), uses these to approximate areas under curves by dividing them into thin strips (essentially Riemann sums), and arrives at the series for \u03C0, sin, cos, and arctan. The logical structure is remarkably similar to how modern calculus textbooks develop these results.",
    hi: 'युक्तिभाषा अनन्त श्रेणी को चरणबद्ध रूप से व्युत्पन्न करती है: यह ज्यामितीय श्रेणी के योग सूत्र से शुरू होती है, पूर्णांक घातों के योग (1\u00B2 + 2\u00B2 + ... + n\u00B2, और उच्चतर घात) तक बढ़ती है, वक्रों के नीचे के क्षेत्रफल का पतली पट्टियों में विभाजन करके सन्निकटन (अनिवार्यतः रीमान योग) करती है, और \u03C0, sin, cos, और arctan की श्रेणियों पर पहुँचती है। तार्किक संरचना आधुनिक कलनशास्त्र की पाठ्यपुस्तकों से उल्लेखनीय रूप से मिलती-जुलती है।',
  },

  /* Section 8 */
  s8Title: {
    en: 'The Transmission Question \u2014 Did Europe Know?',
    hi: 'संचरण प्रश्न \u2014 क्या यूरोप को पता था?',
  },
  s8Body: {
    en: "This is one of the most debated questions in the history of mathematics. Jesuit missionaries were active in Kerala from the 1540s onward. They had access to Kerala mathematical manuscripts and were known to collect and translate Indian texts. The timing is suggestive: Kerala School (~1350\u20131550) \u2192 Jesuits in Kerala (~1540+) \u2192 European calculus (~1660\u20131680).",
    hi: 'यह गणित के इतिहास में सबसे अधिक बहस का विषय है। जेसुइट मिशनरी 1540 के दशक से केरल में सक्रिय थे। उनकी केरल गणितीय पाण्डुलिपियों तक पहुँच थी और वे भारतीय ग्रन्थों का संग्रह और अनुवाद करते थे। समय-रेखा संकेतपूर्ण है: केरल स्कूल (~1350\u20131550) \u2192 केरल में जेसुइट (~1540+) \u2192 यूरोपीय कलनशास्त्र (~1660\u20131680)।',
  },
  s8Evidence: {
    en: 'Specific evidence: Matteo Ricci, the famous Jesuit mathematician, studied at the Jesuit college in Cochin in the 1580s and is known to have had Indian mathematical assistants. The Jesuits in Kerala maintained extensive libraries of local manuscripts. Marin Mersenne, the mathematical correspondent who connected many European mathematicians, corresponded with Jesuits from India.',
    hi: 'विशिष्ट साक्ष्य: प्रसिद्ध जेसुइट गणितज्ञ मैटियो रिक्की ने 1580 के दशक में कोचीन के जेसुइट कॉलेज में अध्ययन किया और उनके पास भारतीय गणितीय सहायक थे। केरल में जेसुइट स्थानीय पाण्डुलिपियों के व्यापक पुस्तकालय रखते थे। गणितीय पत्राचारकर्ता मरीन मेर्सेन, जिन्होंने कई यूरोपीय गणितज्ञों को जोड़ा, भारत के जेसुइट से पत्राचार करते थे।',
  },
  s8Conclusion: {
    en: 'The scholarly debate has three positions: (1) direct transmission \u2014 Kerala results reached Europe via Jesuits; (2) independent discovery \u2014 Newton and Leibniz arrived at calculus without Indian influence; (3) "stimulus diffusion" \u2014 the general ideas reached Europe, inspiring fresh development. The evidence is suggestive but not conclusive. What IS conclusive and beyond debate: the Kerala School discovered these results first, by 250\u2013340 years.',
    hi: 'विद्वत्-बहस में तीन स्थितियाँ हैं: (1) प्रत्यक्ष संचरण \u2014 केरल के परिणाम जेसुइट के माध्यम से यूरोप पहुँचे; (2) स्वतन्त्र खोज \u2014 न्यूटन और लाइबनिज बिना भारतीय प्रभाव के कलनशास्त्र तक पहुँचे; (3) "उद्दीपन प्रसार" \u2014 सामान्य विचार यूरोप पहुँचे, नए विकास को प्रेरित किया। साक्ष्य संकेतपूर्ण हैं लेकिन निर्णायक नहीं। जो निर्णायक और बहस से परे है: केरल स्कूल ने ये परिणाम पहले खोजे, 250\u2013340 वर्ष पहले।',
  },

  /* Section 9 */
  s9Title: {
    en: 'How Our App Uses These Ideas',
    hi: 'हमारा ऐप इन विचारों का उपयोग कैसे करता है',
  },
  s9Body: {
    en: 'Every time you generate a Kundali or view today\'s Panchang on this app, Madhava\'s mathematics runs behind the scenes. Our panchang calculations use series approximations for the Sun\'s and Moon\'s ecliptic longitudes. Every sine and cosine computation in sunrise/sunset timing, eclipse prediction, and planetary position calculation descends directly from Madhava\'s Taylor series. The convergence acceleration idea \u2014 get high accuracy from few terms \u2014 is exactly what modern computational astronomy relies on. When you see a kundali chart with planets placed at precise degree positions, you are looking at the living legacy of the Kerala School.',
    hi: 'जब भी आप इस ऐप पर कुण्डली बनाते हैं या आज का पंचांग देखते हैं, माधव का गणित पर्दे के पीछे चल रहा होता है। हमारी पंचांग गणनाएँ सूर्य और चन्द्रमा के क्रान्तिवृत्तीय देशान्तर के लिए श्रेणी-सन्निकटन का उपयोग करती हैं। सूर्योदय/अस्त समय, ग्रहण भविष्यवाणी, और ग्रहीय स्थिति गणना में प्रत्येक sine और cosine गणना सीधे माधव की टेलर श्रेणी से आती है। अभिसरण त्वरण का विचार \u2014 कम पदों से उच्च सटीकता प्राप्त करना \u2014 ठीक वही है जिस पर आधुनिक खगोलीय गणना निर्भर करती है। जब आप कुण्डली चार्ट में ग्रहों को सटीक अंश स्थिति पर देखते हैं, तो आप केरल स्कूल की जीवित विरासत देख रहे हैं।',
  },

  /* Section 10 */
  s10Title: {
    en: 'The Mathematicians \u2014 A Lineage of Genius',
    hi: 'गणितज्ञ \u2014 प्रतिभा की वंश-परम्परा',
  },

  /* Section 11 */
  s11Title: {
    en: 'What Europe Calls It vs What It Should Be Called',
    hi: 'यूरोप क्या कहता है बनाम इसे क्या कहा जाना चाहिए',
  },
  s11Body: {
    en: 'The following table shows the systematic misattribution in Western mathematics textbooks. In every case, the Kerala School discovered the result 88\u2013390 years before the European mathematician who received credit.',
    hi: 'निम्नलिखित सारणी पश्चिमी गणित पाठ्यपुस्तकों में व्यवस्थित ग़लत श्रेयदान दिखाती है। हर मामले में, केरल स्कूल ने परिणाम उस यूरोपीय गणितज्ञ से 88\u2013390 वर्ष पहले खोजा जिसे श्रेय मिला।',
  },

  backLink: { en: '\u2190 Back to Learn', hi: '\u2190 सीखने पर वापस' },
  prevPage: { en: 'Calculus Overview', hi: 'कलनशास्त्र सारांश' },
  nextPage: { en: 'Pythagoras Was Indian', hi: 'पाइथागोरस भारतीय था' },
};

/* ═══════════════════════════════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════════════════════════════ */

const CONVERGENCE_TABLE = [
  { terms: 10, raw: '3.04184', corrected: '3.14159257...', actual: '3.14159265...' },
  { terms: 20, raw: '3.09162', corrected: '3.14159265348...', actual: '3.14159265...' },
  { terms: 50, raw: '3.12159', corrected: '3.14159265358979...', actual: '3.14159265...' },
  { terms: 100, raw: '3.13159', corrected: '3.14159265358979323...', actual: '3.14159265...' },
];

const SINE_TERMS = [
  { term: 'x', value: '0.52360', running: '0.52360' },
  { term: '\u2212x\u00B3/3!', value: '\u22120.02392', running: '0.49968' },
  { term: '+x\u2075/5!', value: '+0.00033', running: '0.50001' },
  { term: '\u2212x\u2077/7!', value: '\u22120.0000027', running: '0.50000' },
];

const SCHOOL_CHAIN = [
  {
    name: { en: 'Madhava of Sangamagrama', hi: 'संगमग्राम के माधव' },
    years: '~1340\u20131425 CE',
    role: { en: 'Founder', hi: 'संस्थापक' },
    contrib: {
      en: 'Discovered infinite series for \u03C0, sin, cos, arctan. Invented series acceleration correction terms. Computed \u03C0 to 11 decimal places.',
      hi: '\u03C0, sin, cos, arctan के लिए अनन्त श्रेणी की खोज। श्रेणी-त्वरण सुधार पदों का आविष्कार। \u03C0 का 11 दशमलव तक मान।',
    },
  },
  {
    name: { en: 'Parameshvara', hi: 'परमेश्वर' },
    years: '~1360\u20131455 CE',
    role: { en: 'Observer', hi: 'प्रेक्षक' },
    contrib: {
      en: 'Conducted 55 years of systematic astronomical observations \u2014 the longest observational program in pre-telescopic history. Created the Drigganita system based on empirical corrections.',
      hi: '55 वर्षों तक व्यवस्थित खगोलीय प्रेक्षण \u2014 दूरबीन-पूर्व इतिहास में सबसे लम्बा प्रेक्षण कार्यक्रम। अनुभवजन्य सुधारों पर आधारित दृग्गणित प्रणाली।',
    },
  },
  {
    name: { en: 'Nilakantha Somayaji', hi: 'नीलकण्ठ सोमयाजी' },
    years: '~1444\u20131544 CE',
    role: { en: 'Astronomer-Theorist', hi: 'खगोलशास्त्री-सिद्धान्तकार' },
    contrib: {
      en: 'Wrote Tantrasangraha (1500 CE). Developed partial heliocentric model (Mercury and Venus orbit Sun) \u2014 identical to Tycho Brahe\'s model, 88 years before Brahe.',
      hi: 'तन्त्रसंग्रह (1500 ई.) लिखा। आंशिक सौर-केन्द्रीय मॉडल (बुध और शुक्र सूर्य की परिक्रमा) \u2014 ब्राहे से 88 वर्ष पहले।',
    },
  },
  {
    name: { en: 'Jyeshthadeva', hi: 'ज्येष्ठदेव' },
    years: '~1500\u20131575 CE',
    role: { en: 'Textbook Author', hi: 'पाठ्यग्रन्थ लेखक' },
    contrib: {
      en: 'Wrote Yuktibhasha (~1530 CE) \u2014 the world\'s first calculus textbook. Contains full proofs of all Kerala results. Written in Malayalam (vernacular) for accessibility.',
      hi: 'युक्तिभाषा (~1530 ई.) लिखी \u2014 विश्व की पहली कलनशास्त्र पाठ्यपुस्तक। सभी केरल परिणामों के पूर्ण प्रमाण। सुगम्यता के लिए मलयालम (स्थानीय भाषा) में।',
    },
  },
  {
    name: { en: 'Achyuta Pisharati', hi: 'अच्युत पिशारटि' },
    years: '~1550\u20131621 CE',
    role: { en: 'Last Major Figure', hi: 'अन्तिम प्रमुख व्यक्ति' },
    contrib: {
      en: 'Applied tropical corrections to Kerala astronomical models. Extended the tradition for another generation before it gradually declined under colonial pressures.',
      hi: 'केरल खगोलीय मॉडलों में उष्णकटिबन्धीय सुधार लागू किए। औपनिवेशिक दबावों में क्रमिक पतन से पहले एक और पीढ़ी तक परम्परा बढ़ाई।',
    },
  },
];

const ATTRIBUTION_TABLE = [
  { western: 'Leibniz series for \u03C0', euroWho: 'Leibniz', euroWhen: '1674', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~324 years' },
  { western: 'Gregory series for arctan', euroWho: 'Gregory', euroWhen: '1671', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~321 years' },
  { western: 'Taylor/Maclaurin series', euroWho: 'Taylor', euroWhen: '1715', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~365 years' },
  { western: "Newton's sine series", euroWho: 'Newton', euroWhen: '~1666', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~316 years' },
  { western: "Euler's series acceleration", euroWho: 'Euler', euroWhen: '~1740', keralaWho: 'Madhava', keralaWhen: '~1350', gap: '~390 years' },
  { western: 'Tychonic planetary model', euroWho: 'Brahe', euroWhen: '1588', keralaWho: 'Nilakantha', keralaWhen: '1500', gap: '88 years' },
];

/* ═══════════════════════════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════════════════════════ */

const sectionCard = 'bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6';
const fade = (delay: number) => ({ initial: { opacity: 0, y: 20 } as const, animate: { opacity: 1, y: 0 } as const, transition: { duration: 0.5, delay } });

export default function KeralaSchoolPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const hf = isHi ? { fontFamily: 'var(--font-devanagari-heading)' } : { fontFamily: 'var(--font-heading)' };
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <div className="space-y-10">

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <motion.div {...fade(0)}>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={hf}>{l(L.title)}</h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl">{l(L.subtitle)}</p>
        <div className="flex justify-center mt-4">
          <ShareRow pageTitle={l(L.title)} locale={locale} />
        </div>
      </motion.div>

      {/* ── Section 1: The Setting ────────────────────────────────── */}
      <motion.div {...fade(0.08)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s1Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s1Body)}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          {[
            { label: { en: 'Founder', hi: 'संस्थापक' }, value: 'Madhava (~1340)' },
            { label: { en: 'Location', hi: 'स्थान' }, value: 'Irinjalakuda, Kerala' },
            { label: { en: 'Duration', hi: 'अवधि' }, value: '~200 years' },
            { label: { en: 'Key text', hi: 'प्रमुख ग्रन्थ' }, value: 'Yuktibhasha' },
          ].map((stat, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{stat.value}</div>
              <div className="text-text-secondary text-xs mt-1">{l(stat.label)}</div>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-text-secondary text-xs font-semibold mb-1">{isHi ? 'केरल ही क्यों?' : 'Why Kerala?'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{l(L.s1Why)}</p>
        </div>
      </motion.div>

      {/* ── Section 2: Madhava's Pi Series ───────────────────────── */}
      <motion.div {...fade(0.12)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s2Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s2Body)}</p>

        {/* Main formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{isHi ? 'माधव-लाइबनिज श्रेणी' : 'The Madhava-Leibniz Series'}</p>
          <p className="text-gold-light text-xl font-mono tracking-wider">&pi;/4 = 1 &minus; 1/3 + 1/5 &minus; 1/7 + 1/9 &minus; ...</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'माधव ~1350 ई. | लाइबनिज 1674 ई. — 324 वर्ष बाद' : 'Madhava ~1350 CE | Leibniz 1674 CE \u2014 324 years later'}</p>
        </div>

        {/* Slow convergence explanation */}
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s2Slow)}</p>

        {/* Correction term */}
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{l(L.s2Genius)}</p>
        <div className="p-5 rounded-xl bg-emerald-500/8 border border-emerald-500/20 mb-5 text-center">
          <p className="text-xs text-emerald-300 mb-2">{isHi ? 'माधव का सुधार पद (correction term)' : "Madhava's Correction Term"}</p>
          <p className="text-emerald-200 text-lg font-mono">(-1)<sup>N+1</sup> &times; (N/2) / ((N/2)&sup2; + 1)</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'N पदों के योग के बाद इस सुधार को जोड़ें' : 'Add this correction after summing N terms'}</p>
        </div>

        {/* Convergence table */}
        <div className="overflow-x-auto mb-4">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'पद' : 'Terms'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'कच्ची श्रेणी' : 'Raw Series'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'माधव सुधार सहित' : 'With Madhava Correction'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'वास्तविक \u03C0' : 'Actual \u03C0'}</th>
              </tr>
            </thead>
            <tbody>
              {CONVERGENCE_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2 pr-3 text-text-primary font-semibold">{row.terms}</td>
                  <td className="py-2 pr-3 text-red-400 font-mono">{row.raw}</td>
                  <td className="py-2 pr-3 text-emerald-400 font-mono">{row.corrected}</td>
                  <td className="text-right py-2 text-text-secondary font-mono">{row.actual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s2Result)}</p>
      </motion.div>

      {/* ── Section 3: Sine and Cosine Series ────────────────────── */}
      <motion.div {...fade(0.16)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s3Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s3Body)}</p>

        {/* Sine formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{isHi ? 'माधव की Sine श्रेणी (~1400 ई.)' : "Madhava's Sine Series (~1400 CE)"}</p>
          <p className="text-gold-light text-lg font-mono">sin(x) = x &minus; x&sup3;/3! + x&#8309;/5! &minus; x&#8311;/7! + ...</p>
          <p className="text-text-secondary text-xs mt-2">{isHi ? 'जहाँ 3! = 6, 5! = 120, 7! = 5040 (क्रमगुणित)' : 'where 3! = 6, 5! = 120, 7! = 5040 (factorial)'}</p>
        </div>

        {/* Worked example */}
        <div className="p-5 rounded-xl bg-amber-500/8 border border-amber-500/20 mb-5">
          <p className="text-amber-300 font-semibold text-xs mb-3">
            {isHi ? 'हल किया गया उदाहरण: sin(30\u00B0)' : 'Worked Example: sin(30\u00B0)'}
          </p>
          <p className="text-text-secondary text-xs mb-3">{l(L.s3Worked)}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-amber-500/15">
                  <th className="text-left text-amber-300 py-1.5 pr-3">{isHi ? 'पद' : 'Term'}</th>
                  <th className="text-left text-amber-300 py-1.5 pr-3">{isHi ? 'मान' : 'Value'}</th>
                  <th className="text-right text-amber-300 py-1.5">{isHi ? 'चलता योग' : 'Running Sum'}</th>
                </tr>
              </thead>
              <tbody>
                {SINE_TERMS.map((row, i) => (
                  <tr key={i} className="border-b border-amber-500/8">
                    <td className="py-1.5 pr-3 text-text-primary font-mono">{row.term}</td>
                    <td className="py-1.5 pr-3 text-text-secondary font-mono">{row.value}</td>
                    <td className="text-right py-1.5 text-amber-200 font-mono font-semibold">{row.running}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-emerald-300 text-xs mt-3 font-semibold">
            {isHi ? 'परिणाम: 0.50000 \u2248 0.5 \u2714 (वास्तविक sin(30\u00B0) = 0.5 ठीक)' : 'Result: 0.50000 \u2248 0.5 \u2714 (actual sin(30\u00B0) = 0.5 exactly)'}
          </p>
        </div>

        {/* Cosine series */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-4 text-center">
          <p className="text-xs text-text-secondary mb-2">{isHi ? 'माधव की Cosine श्रेणी' : "Madhava's Cosine Series"}</p>
          <p className="text-gold-light text-lg font-mono">cos(x) = 1 &minus; x&sup2;/2! + x&#8308;/4! &minus; x&#8310;/6! + ...</p>
        </div>
        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s3Cosine)}</p>
      </motion.div>

      {/* ── Section 4: Arctangent Series ─────────────────────────── */}
      <motion.div {...fade(0.2)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s4Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s4Body)}</p>

        {/* Arctan formula */}
        <div className="p-5 rounded-xl bg-gold-primary/8 border border-gold-primary/20 mb-5 text-center">
          <p className="text-xs text-text-secondary mb-2">{isHi ? 'माधव की Arctangent श्रेणी' : "Madhava's Arctangent Series"}</p>
          <p className="text-gold-light text-lg font-mono mb-2">arctan(x) = x &minus; x&sup3;/3 + x&#8309;/5 &minus; x&#8311;/7 + ...</p>
          <p className="text-text-secondary text-xs">{isHi ? '|x| \u2264 1 के लिए मान्य' : 'valid for |x| \u2264 1'}</p>
        </div>

        {/* Faster convergence with 1/sqrt(3) */}
        <div className="p-5 rounded-xl bg-purple-500/8 border border-purple-500/20 mb-5 text-center">
          <p className="text-xs text-purple-300 mb-2">{isHi ? 'x = 1/\u221A3 रखने पर (तेज़ अभिसरण)' : 'Setting x = 1/\u221A3 (faster convergence)'}</p>
          <p className="text-purple-200 text-base font-mono">{l(L.s4Formula)}</p>
        </div>

        <p className="text-text-secondary text-sm leading-relaxed">{l(L.s4Insight)}</p>
      </motion.div>

      {/* ── Section 5: What IS Calculus ───────────────────────────── */}
      <motion.div {...fade(0.24)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s5Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s5Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {[
            { num: '1', name: { en: 'Derivatives', hi: 'अवकलज' }, desc: { en: 'Rates of change. How fast is something moving at this instant?', hi: 'परिवर्तन की दर। इस क्षण कुछ कितनी तेज़ी से बदल रहा है?' }, status: { en: 'Partial work', hi: 'आंशिक कार्य' } },
            { num: '2', name: { en: 'Integrals', hi: 'समाकलन' }, desc: { en: 'Accumulation. What is the total area under this curve?', hi: 'संचय। इस वक्र के नीचे कुल क्षेत्रफल क्या है?' }, status: { en: 'Partial work', hi: 'आंशिक कार्य' } },
            { num: '3', name: { en: 'Infinite Series', hi: 'अनन्त श्रेणी' }, desc: { en: 'Expressing functions as infinite sums of simpler terms.', hi: 'फलनों को सरल पदों के अनन्त योग के रूप में व्यक्त करना।' }, status: { en: 'Fully mastered', hi: 'पूर्ण अधिकार' } },
          ].map((pillar, i) => (
            <div key={i} className={`p-4 rounded-xl border ${i === 2 ? 'bg-emerald-500/8 border-emerald-500/20' : 'bg-white/[0.02] border-gold-primary/10'}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${i === 2 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gold-primary/15 text-gold-light'}`}>{pillar.num}</span>
                <span className={`font-semibold text-sm ${i === 2 ? 'text-emerald-300' : 'text-text-primary'}`}>{l(pillar.name)}</span>
              </div>
              <p className="text-text-secondary text-xs leading-relaxed mb-2">{l(pillar.desc)}</p>
              <span className={`text-xs px-2 py-0.5 rounded-full ${i === 2 ? 'bg-emerald-500/15 text-emerald-300' : 'bg-gold-primary/10 text-gold-dark'}`}>{l(pillar.status)}</span>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-xl bg-gold-primary/6 border-l-4 border-gold-primary/50">
          <p className="text-gold-light text-xs font-semibold mb-1">{isHi ? 'निर्णायक तर्क' : 'The Critical Argument'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{l(L.s5Key)}</p>
        </div>
      </motion.div>

      {/* ── Section 6: Nilakantha ────────────────────────────────── */}
      <motion.div {...fade(0.28)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s6Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s6Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-xs mb-2">{isHi ? 'नीलकण्ठ का मॉडल (1500 ई.)' : "Nilakantha's Model (1500 CE)"}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'बुध और शुक्र \u2192 सूर्य की परिक्रमा | सूर्य \u2192 पृथ्वी की परिक्रमा। यह ज्यामितीय रूप से ब्राहे (1588) की टाइकोनिक प्रणाली के समरूप है।'
                : 'Mercury & Venus \u2192 orbit the Sun | Sun \u2192 orbits Earth. Geometrically identical to Brahe\'s (1588) Tychonic system.'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{isHi ? 'टायको ब्राहे का मॉडल (1588 ई.)' : "Tycho Brahe's Model (1588 CE)"}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi
                ? 'ठीक वही संरचना \u2014 लेकिन 88 वर्ष बाद। ब्राहे ने कोपर्निकस और टॉलेमी के बीच समझौते के रूप में इसे प्रस्तावित किया।'
                : 'Exact same structure \u2014 but 88 years later. Brahe proposed it as a compromise between Copernicus and Ptolemy.'}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Section 7: Yuktibhasha ───────────────────────────────── */}
      <motion.div {...fade(0.32)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s7Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s7Body)}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s7Method)}</p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: { en: 'Language', hi: 'भाषा' }, value: { en: 'Malayalam', hi: 'मलयालम' } },
            { label: { en: 'Written', hi: 'रचना' }, value: { en: '~1530 CE', hi: '~1530 ई.' } },
            { label: { en: 'Contains', hi: 'विषयवस्तु' }, value: { en: 'Full proofs', hi: 'पूर्ण प्रमाण' } },
            { label: { en: 'Significance', hi: 'महत्त्व' }, value: { en: '1st calculus text', hi: 'प्रथम कलन ग्रन्थ' } },
          ].map((fact, i) => (
            <div key={i} className="p-3 rounded-xl bg-gold-primary/8 border border-gold-primary/15 text-center">
              <div className="text-gold-light text-sm font-bold">{typeof fact.value === 'string' ? fact.value : l(fact.value)}</div>
              <div className="text-text-secondary text-xs mt-1">{l(fact.label)}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 8: Transmission Question ─────────────────────── */}
      <motion.div {...fade(0.36)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s8Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s8Body)}</p>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s8Evidence)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-amber-500/8 border border-amber-500/20">
            <p className="text-amber-300 font-semibold text-xs mb-2">{isHi ? '1. प्रत्यक्ष संचरण' : '1. Direct Transmission'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'केरल परिणाम जेसुइट के माध्यम से यूरोप पहुँचे' : 'Kerala results reached Europe via Jesuit missionaries'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-blue-500/8 border border-blue-500/20">
            <p className="text-blue-300 font-semibold text-xs mb-2">{isHi ? '2. स्वतन्त्र खोज' : '2. Independent Discovery'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'न्यूटन और लाइबनिज ने बिना भारतीय प्रभाव के कलनशास्त्र विकसित किया' : 'Newton and Leibniz developed calculus without Indian influence'}
            </p>
          </div>
          <div className="p-4 rounded-xl bg-purple-500/8 border border-purple-500/20">
            <p className="text-purple-300 font-semibold text-xs mb-2">{isHi ? '3. उद्दीपन प्रसार' : '3. Stimulus Diffusion'}</p>
            <p className="text-text-secondary text-xs leading-relaxed">
              {isHi ? 'सामान्य विचार यूरोप पहुँचे, स्वतन्त्र विकास को प्रेरित किया' : 'General ideas reached Europe, inspiring independent development'}
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20">
          <p className="text-emerald-300 font-semibold text-xs mb-2">{isHi ? 'जो बहस से परे है' : 'What Is Beyond Debate'}</p>
          <p className="text-text-secondary text-xs leading-relaxed">{l(L.s8Conclusion)}</p>
        </div>
      </motion.div>

      {/* ── Section 9: App Connection ────────────────────────────── */}
      <motion.div {...fade(0.4)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s9Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">{l(L.s9Body)}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { title: { en: 'Planetary Positions', hi: 'ग्रहीय स्थिति' }, desc: { en: 'Series approximations compute Sun/Moon longitude for every Panchang request', hi: 'प्रत्येक पंचांग अनुरोध के लिए श्रेणी-सन्निकटन सूर्य/चन्द्र देशान्तर गणना' } },
            { title: { en: 'Sunrise/Sunset', hi: 'सूर्योदय/अस्त' }, desc: { en: 'Trigonometric series (sin/cos) compute exact rise and set times', hi: 'त्रिकोणमितीय श्रेणी (sin/cos) सटीक उदय और अस्त समय' } },
            { title: { en: 'Eclipse Timing', hi: 'ग्रहण समय' }, desc: { en: 'High-precision series compute shadow angles and contact times', hi: 'उच्च-सटीक श्रेणी छाया कोण और सम्पर्क समय' } },
          ].map((item, i) => (
            <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-gold-primary/12">
              <p className="text-gold-light font-semibold text-sm mb-1">{l(item.title)}</p>
              <p className="text-text-secondary text-xs leading-relaxed">{l(item.desc)}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 10: The Mathematicians Timeline ──────────────── */}
      <motion.div {...fade(0.44)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-5" style={hf}>{l(L.s10Title)}</h3>

        <div className="space-y-4">
          {SCHOOL_CHAIN.map((person, i) => (
            <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-gold-primary/8">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gold-primary/20 border border-gold-primary/30 flex items-center justify-center text-gold-light font-bold text-sm">
                  {i + 1}
                </div>
                {i < SCHOOL_CHAIN.length - 1 && (
                  <div className="w-px h-4 bg-gold-primary/20 mx-auto mt-1" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-text-primary font-semibold text-sm">{l(person.name)}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gold-primary/10 text-gold-dark">{person.years}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300">{l(person.role)}</span>
                </div>
                <p className="text-text-secondary text-xs leading-relaxed">{l(person.contrib)}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Section 11: Attribution Comparison Table ─────────────── */}
      <motion.div {...fade(0.48)} className={sectionCard}>
        <h3 className="text-gold-light font-bold text-xl mb-4" style={hf}>{l(L.s11Title)}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5">{l(L.s11Body)}</p>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'पश्चिमी नाम' : 'Western Name'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'श्रेय दिया गया' : 'Attributed To'}</th>
                <th className="text-left text-gold-light py-2 pr-3">{isHi ? 'केरल खोजकर्ता' : 'Kerala Discoverer'}</th>
                <th className="text-right text-gold-light py-2">{isHi ? 'अन्तर' : 'Years Earlier'}</th>
              </tr>
            </thead>
            <tbody>
              {ATTRIBUTION_TABLE.map((row, i) => (
                <tr key={i} className={`border-b border-gold-primary/8 ${i % 2 === 0 ? 'bg-white/[0.01]' : ''}`}>
                  <td className="py-2.5 pr-3 text-text-primary font-semibold">{row.western}</td>
                  <td className="py-2.5 pr-3">
                    <span className="text-text-secondary">{row.euroWho}</span>
                    <span className="text-text-secondary/60 ml-1">({row.euroWhen})</span>
                  </td>
                  <td className="py-2.5 pr-3">
                    <span className="text-emerald-400 font-semibold">{row.keralaWho}</span>
                    <span className="text-emerald-400/60 ml-1">({row.keralaWhen})</span>
                  </td>
                  <td className="text-right py-2.5 text-amber-400 font-bold">{row.gap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ── Navigation ──────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="flex flex-col sm:flex-row gap-3 pt-4"
      >
        <Link href="/learn" className="text-text-secondary hover:text-gold-light text-sm transition-colors">
          {l(L.backLink)}
        </Link>
        <div className="flex gap-3 sm:ml-auto">
          <Link href="/learn/contributions/calculus" className="px-4 py-2 rounded-xl bg-gold-primary/10 border border-gold-primary/15 text-gold-light text-sm hover:bg-gold-primary/20 transition-colors">
            &larr; {l(L.prevPage)}
          </Link>
          <Link href="/learn/contributions/pythagoras" className="px-4 py-2 rounded-xl bg-gold-primary/15 border border-gold-primary/20 text-gold-light text-sm hover:bg-gold-primary/25 transition-colors">
            {l(L.nextPage)} &rarr;
          </Link>
        </div>
      </motion.div>

    </div>
  );
}

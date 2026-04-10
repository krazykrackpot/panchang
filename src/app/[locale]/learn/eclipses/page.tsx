'use client';

import { useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import { Link } from '@/lib/i18n/navigation';
import type { Locale } from '@/types/panchang';
import EclipseAnimation from '@/components/learn/EclipseAnimation';

/* ─── Inline bilingual labels ─── */
const L = {
  title:    { en: 'Grahan — Eclipses in Vedic Astrology',                      hi: 'ग्रहण — वैदिक ज्योतिष में ग्रहण' },
  subtitle: {
    en: 'Eclipses occur when the Sun, Moon, and Earth align at the lunar nodes — Rahu and Ketu. They are among the most astronomically precise and spiritually charged events in Jyotish, and the only phenomena where the mythological and scientific accounts tell exactly the same story.',
    hi: 'ग्रहण तब होता है जब सूर्य, चन्द्र और पृथ्वी चन्द्र के पातों — राहु और केतु — पर संरेखित होते हैं। ये ज्योतिष की सबसे खगोलीय रूप से सटीक और आध्यात्मिक रूप से आवेशित घटनाएँ हैं।',
  },

  /* Mythology */
  mythTitle: { en: 'The Mythology — Rahu, Ketu & the Samudra Manthan',       hi: 'पौराणिक कथा — राहु, केतु और समुद्र मन्थन' },
  myth1: {
    en: 'During the Samudra Manthan (churning of the cosmic ocean), a demon named Svarbhanu disguised himself as a god and sat between the Sun and Moon to drink the amrita (nectar of immortality). The Sun and Moon recognised the imposter and alerted Lord Vishnu, who immediately hurled his Sudarshan Chakra — severing Svarbhanu\'s head from his body at the precise moment the amrita reached his throat.',
    hi: 'समुद्र मन्थन के दौरान, स्वर्भानु नामक एक असुर देवता के वेश में सूर्य और चन्द्र के बीच बैठ कर अमृत पी गया। सूर्य और चन्द्र ने उसे पहचाना और भगवान विष्णु को सूचित किया, जिन्होंने तुरन्त अपना सुदर्शन चक्र फेंका — जिससे स्वर्भानु का सिर उसके धड़ से उस क्षण अलग हो गया जब अमृत उसके गले तक पहुँचा था।',
  },
  myth2: {
    en: 'The severed head became Rahu — the north lunar node — and the headless body became Ketu — the south lunar node. Both are immortal, having consumed amrita. In eternal vengeance, Rahu periodically swallows the Sun (solar eclipse) and Ketu swallows the Moon (lunar eclipse) — but each time, the Sun or Moon emerges unharmed from the severed neck.',
    hi: 'कटा हुआ सिर राहु बन गया — उत्तर चन्द्र पात — और बिना सिर का धड़ केतु बन गया — दक्षिण चन्द्र पात। दोनों अमर हैं क्योंकि उन्होंने अमृत पी लिया था। शाश्वत प्रतिशोध में, राहु समय-समय पर सूर्य (सूर्य ग्रहण) और केतु चन्द्र (चन्द्र ग्रहण) को निगलता है — परन्तु प्रत्येक बार सूर्य या चन्द्र कटी हुई गर्दन से अक्षत निकल आते हैं।',
  },
  myth3: {
    en: 'This myth is not merely allegory — it is a precise astronomical encoding. Eclipses literally occur when the Sun or Full Moon is conjunct Rahu or Ketu (the lunar nodes). The ancient rishis had discovered the node-eclipse relationship and encoded it in a story that would be remembered across millennia.',
    hi: 'यह कथा केवल रूपक नहीं है — यह एक सटीक खगोलीय एन्कोडिंग है। ग्रहण वस्तुतः तब होता है जब सूर्य या पूर्ण चन्द्र राहु या केतु (चन्द्र पात) के साथ युति में हो। प्राचीन ऋषियों ने पात-ग्रहण सम्बन्ध की खोज की थी और उसे एक ऐसी कथा में पिरोया था जो सहस्राब्दियों तक याद रहे।',
  },

  /* Astronomy */
  astroTitle: { en: 'The Astronomy — Why Eclipses Happen',                    hi: 'खगोल विज्ञान — ग्रहण क्यों होते हैं' },
  astro1: {
    en: 'The Moon\'s orbit is tilted approximately 5.15° with respect to the ecliptic (the plane of Earth\'s orbit around the Sun). This tilt means the Moon is usually above or below the ecliptic — so most New Moons and Full Moons pass without an eclipse.',
    hi: 'चन्द्रमा की कक्षा क्रान्तिवृत्त (पृथ्वी की सूर्य के चारों ओर कक्षा का तल) के सापेक्ष लगभग 5.15° झुकी हुई है। इस झुकाव का अर्थ है कि चन्द्रमा सामान्यतः क्रान्तिवृत्त के ऊपर या नीचे रहता है — इसलिए अधिकांश अमावस्या और पूर्णिमा बिना ग्रहण के गुजर जाती हैं।',
  },
  astro2: {
    en: 'The Moon\'s orbit crosses the ecliptic at exactly two points: the ascending node (Rahu in Sanskrit, ☊ in Western notation) where the Moon crosses from south to north, and the descending node (Ketu, ☋) where it crosses from north to south. At these crossing points, the Moon\'s ecliptic latitude equals zero degrees.',
    hi: 'चन्द्रमा की कक्षा क्रान्तिवृत्त को ठीक दो बिन्दुओं पर काटती है: आरोही पात (राहु, ☊) जहाँ चन्द्रमा दक्षिण से उत्तर की ओर जाता है, और अवरोही पात (केतु, ☋) जहाँ यह उत्तर से दक्षिण की ओर जाता है। इन बिन्दुओं पर चन्द्रमा का क्रान्तिवृत्त अक्षांश शून्य डिग्री होता है।',
  },
  astro3: {
    en: 'A solar eclipse requires a New Moon (Amavasya) occurring when the Moon is near a node — its shadow then falls on Earth. A lunar eclipse requires a Full Moon (Purnima) occurring near a node — the Moon then enters Earth\'s shadow. The closer the Moon is to the node at the moment of lunation, the deeper and more central the eclipse.',
    hi: 'सूर्य ग्रहण के लिए अमावस्या (नया चन्द्र) का पात के निकट होना आवश्यक है — तब चन्द्रमा की छाया पृथ्वी पर पड़ती है। चन्द्र ग्रहण के लिए पूर्णिमा (पूर्ण चन्द्र) का पात के निकट होना आवश्यक है — तब चन्द्रमा पृथ्वी की छाया में प्रवेश करता है। लुनेशन के समय चन्द्रमा जितना पात के निकट होगा, ग्रहण उतना ही गहरा और केन्द्रीय होगा।',
  },

  /* Calculation Engine */
  calcTitle: { en: 'How We Calculate Eclipses — Our Engine',                  hi: 'हम ग्रहण की गणना कैसे करते हैं — हमारा इंजन' },
  calcIntro: {
    en: 'Our eclipse engine finds all eclipses for any year by building on top of the tithi table we already compute for the Panchang calendar. Here is the full pipeline, step by step:',
    hi: 'हमारा ग्रहण इंजन किसी भी वर्ष के सभी ग्रहणों को खोजने के लिए उस तिथि तालिका पर आधारित है जिसकी गणना हम पंचांग कैलेण्डर के लिए पहले से करते हैं। यहाँ चरण-दर-चरण पूरी प्रक्रिया है:',
  },
  step1Title: { en: 'Step 1 — Find All Lunations from the Tithi Table',       hi: 'चरण 1 — तिथि तालिका से सभी लुनेशन खोजें' },
  step1: {
    en: 'Our Panchang calendar pre-computes ~370 tithi entries per year with precise start/end Julian Day numbers. Every Amavasya (tithi #30 — the New Moon) is a solar eclipse candidate. Every Purnima (tithi #15 — the Full Moon) is a lunar eclipse candidate. Because we already compute exact tithi times, we need no separate lunation scanning — we simply filter for tithis #15 and #30 and extract their midpoint times.',
    hi: 'हमारा पंचांग कैलेण्डर प्रत्येक वर्ष के लिए ~370 तिथि प्रविष्टियाँ सटीक प्रारम्भ/समाप्ति जूलियन दिन संख्याओं के साथ पूर्व-गणना करता है। प्रत्येक अमावस्या (तिथि #30 — नया चन्द्र) सूर्य ग्रहण का उम्मीदवार है। प्रत्येक पूर्णिमा (तिथि #15 — पूर्ण चन्द्र) चन्द्र ग्रहण का उम्मीदवार है। हम केवल तिथि #15 और #30 के लिए फ़िल्टर करते हैं और उनके मध्यबिन्दु समय निकालते हैं।',
  },
  step2Title: { en: 'Step 2 — Check Moon\'s Ecliptic Latitude',               hi: 'चरण 2 — चन्द्रमा का क्रान्तिवृत्त अक्षांश जाँचें' },
  step2: {
    en: 'At each lunation midpoint, we query the ephemeris for the Moon\'s ecliptic latitude (β). This value tells us precisely how far above or below the ecliptic the Moon is at that moment. At a node (Rahu or Ketu), β = 0°, which would produce the deepest possible eclipse. As the Moon moves away from the nodes, |β| grows toward ±5.15°. If |β| is large enough, no eclipse occurs even at New Moon or Full Moon — the shadows simply miss.',
    hi: 'प्रत्येक लुनेशन मध्यबिन्दु पर, हम इफेमेरिस से चन्द्रमा का क्रान्तिवृत्त अक्षांश (β) प्राप्त करते हैं। यह मान बताता है कि उस क्षण चन्द्रमा क्रान्तिवृत्त से कितना ऊपर या नीचे है। पात (राहु या केतु) पर β = 0° होता है, जो सबसे गहरा ग्रहण देता है। जैसे-जैसे चन्द्रमा पातों से दूर जाता है, |β| ±5.15° की ओर बढ़ता है।',
  },
  step3Title: { en: 'Step 3 — Apply Distance-Scaled Eclipse Limits',          hi: 'चरण 3 — दूरी-स्केल ग्रहण सीमाएँ लागू करें' },
  step3: {
    en: 'Whether an eclipse occurs depends on the Moon\'s latitude and its distance from Earth (which determines its apparent size). We use the Moon\'s angular velocity as a proxy for distance — a faster Moon is closer (larger apparent disk). The thresholds are:',
    hi: 'ग्रहण होगा या नहीं यह चन्द्रमा के अक्षांश और पृथ्वी से उसकी दूरी (जो उसके प्रत्यक्ष आकार को निर्धारित करती है) पर निर्भर करता है। हम चन्द्रमा की कोणीय गति को दूरी के प्रतिनिधि के रूप में उपयोग करते हैं — तेज़ चन्द्रमा निकट (बड़ा प्रत्यक्ष बिम्ब) है। सीमाएँ इस प्रकार हैं:',
  },
  step4Title: { en: 'Step 4 — Compute Local Circumstances',                   hi: 'चरण 4 — स्थानीय परिस्थितियाँ गणना करें' },
  step4: {
    en: 'For lunar eclipses, the contact times are universal — Earth\'s shadow is so large that the eclipse is seen from the entire night-side hemisphere simultaneously. We simply convert UTC contact times to the user\'s local timezone. For solar eclipses, the situation is more complex: the Moon\'s shadow is a narrow cone, and the contact times, totality path, and local magnitude all depend on the observer\'s geographic coordinates. We compute this using a standard geometric approach based on the Besselian elements of the eclipse. Sutak is then computed from the first contact (sparsha) time using classical timing rules.',
    hi: 'चन्द्र ग्रहण के लिए, सम्पर्क समय सार्वभौमिक हैं — पृथ्वी की छाया इतनी बड़ी है कि ग्रहण पूरे रात्रि-पक्ष से एक साथ दिखता है। हम केवल UTC सम्पर्क समयों को उपयोगकर्ता के स्थानीय टाइमज़ोन में बदलते हैं। सूर्य ग्रहण के लिए, चन्द्रमा की छाया एक संकीर्ण शंकु है, और सम्पर्क समय, पूर्णता पथ और स्थानीय परिमाण सभी पर्यवेक्षक के भौगोलिक निर्देशांकों पर निर्भर करते हैं। सूतक को तब शास्त्रीय नियमों के अनुसार स्पर्श (प्रथम सम्पर्क) समय से गणना की जाती है।',
  },

  /* Eclipse Types */
  typesTitle: { en: 'Types of Eclipses',                                       hi: 'ग्रहण के प्रकार' },
  typesIntro: {
    en: 'Not all eclipses are equal. The type depends on the Moon\'s distance from the node, its distance from Earth, and the observer\'s location.',
    hi: 'सभी ग्रहण समान नहीं होते। प्रकार चन्द्रमा की पात से दूरी, पृथ्वी से उसकी दूरी और पर्यवेक्षक के स्थान पर निर्भर करता है।',
  },

  /* Phases */
  phasesTitle: { en: 'Eclipse Phases & Sanskrit Terminology',                  hi: 'ग्रहण के चरण एवं संस्कृत शब्दावली' },
  phasesIntro: {
    en: 'Every eclipse passes through defined phases, each with a Sanskrit name used in classical texts and modern Panchang calculations:',
    hi: 'प्रत्येक ग्रहण निर्धारित चरणों से गुज़रता है, जिनमें से प्रत्येक का शास्त्रीय ग्रन्थों और आधुनिक पंचांग गणनाओं में उपयोग किया जाने वाला संस्कृत नाम है:',
  },

  /* Sutak */
  sutakTitle: { en: 'Sutak — The Restriction Period',                          hi: 'सूतक — निषेध काल' },
  sutakIntro: {
    en: 'Sutak (also spelled Soothak or Sutak) is the period of ritual restriction that precedes and includes an eclipse. It is considered spiritually polluted time when certain activities are forbidden. Sutak only applies when the eclipse is visible from your location — an eclipse on the other side of Earth carries no Sutak obligation.',
    hi: 'सूतक वह अनुष्ठान-प्रतिबन्ध काल है जो ग्रहण से पहले और उसे सम्मिलित करते हुए आता है। यह आध्यात्मिक रूप से अशुद्ध समय माना जाता है जब कुछ कार्य वर्जित होते हैं। सूतक केवल तभी लागू होता है जब ग्रहण आपके स्थान से दिखाई दे।',
  },
  sutakSources: {
    en: 'Classical texts disagree slightly on Sutak duration. The three main interpretations:',
    hi: 'शास्त्रीय ग्रन्थ सूतक की अवधि पर थोड़े भिन्न हैं। तीन मुख्य व्याख्याएँ:',
  },
  sutakDo: { en: 'Recommended during Sutak & Eclipse',                        hi: 'सूतक और ग्रहण में अनुशंसित' },
  sutakAvoid: { en: 'Avoid during Sutak & Eclipse',                           hi: 'सूतक और ग्रहण में परहेज़ करें' },

  /* Kundali */
  kundaliTitle: { en: 'Eclipses in Kundali Analysis',                         hi: 'कुण्डली विश्लेषण में ग्रहण' },
  kundaliIntro: {
    en: 'In natal astrology (Janma Kundali analysis), eclipses are treated as powerful activation events — not curses, but catalysts. An eclipse is a karmic spotlight, illuminating a specific area of life for deep transformation.',
    hi: 'जन्म कुण्डली विश्लेषण में, ग्रहणों को शक्तिशाली सक्रियण घटनाओं के रूप में माना जाता है — अभिशाप नहीं, बल्कि उत्प्रेरक। एक ग्रहण एक कार्मिक प्रकाशपुञ्ज है जो जीवन के किसी विशेष क्षेत्र को गहन परिवर्तन के लिए प्रकाशित करता है।',
  },

  /* Saros */
  sarosTitle: { en: 'The Saros Cycle & Eclipse Series',                         hi: 'सारोस चक्र एवं ग्रहण श्रृंखला' },
  sarosWhy: {
    en: 'Why do eclipses repeat? Three orbital cycles align almost perfectly:',
    hi: 'ग्रहण क्यों दोहराते हैं? तीन कक्षीय चक्र लगभग पूर्ण रूप से संरेखित होते हैं:',
  },
  sarosSynodic: {
    en: '223 Synodic Months (New Moon to New Moon) = 6,585.32 days. This ensures the Sun-Moon phase (New or Full) repeats.',
    hi: '223 सिनोडिक मास (अमावस्या से अमावस्या) = 6,585.32 दिन। यह सुनिश्चित करता है कि सूर्य-चन्द्र कला (अमावस्या या पूर्णिमा) दोहराती है।',
  },
  sarosDraconic: {
    en: '242 Draconic Months (node to node) = 6,585.36 days. This ensures the Moon returns to almost the same position relative to its nodes (Rahu/Ketu), so the eclipse geometry repeats.',
    hi: '242 ड्रैकोनिक मास (पात से पात) = 6,585.36 दिन। यह सुनिश्चित करता है कि चन्द्र अपने पातों (राहु/केतु) के सापेक्ष लगभग उसी स्थिति में वापस आता है।',
  },
  sarosAnomalistic: {
    en: '239 Anomalistic Months (perigee to perigee) = 6,585.54 days. This ensures the Moon is at nearly the same distance from Earth, so the eclipse magnitude and type (total vs annular) are similar.',
    hi: '239 एनोमैलिस्टिक मास (उपभू से उपभू) = 6,585.54 दिन। यह सुनिश्चित करता है कि चन्द्र पृथ्वी से लगभग समान दूरी पर है, इसलिए ग्रहण का परिमाण और प्रकार समान रहता है।',
  },
  sarosResult: {
    en: 'All three align within 0.04 days of 6,585.32 days — approximately 18 years, 11 days, and 8 hours. After this period, virtually the same eclipse recurs.',
    hi: 'तीनों 6,585.32 दिनों के 0.04 दिन के भीतर संरेखित होते हैं — लगभग 18 वर्ष, 11 दिन, 8 घण्टे। इस अवधि के बाद, लगभग वही ग्रहण पुनः होता है।',
  },
  saros8hours: {
    en: 'The 8-Hour Shift — The extra ⅓ day means Earth has rotated 120° further. So the repeat eclipse occurs ~120° west on Earth\'s surface. The same eclipse is visible from a completely different part of the world. After THREE Saros cycles (54 years 34 days, called the Exeligmos), the eclipse returns to approximately the same longitude — the same part of the world sees it again.',
    hi: '8 घण्टे का विचलन — अतिरिक्त ⅓ दिन का अर्थ है कि पृथ्वी 120° और घूम चुकी है। अगला ग्रहण पृथ्वी की सतह पर ~120° पश्चिम में होता है। तीन सारोस चक्रों (54 वर्ष 34 दिन, एक्सेलिग्मोस) के बाद, ग्रहण लगभग उसी देशान्तर पर वापस आता है।',
  },
  sarosSeriesTitle: {
    en: 'What is a Saros Series?',
    hi: 'सारोस श्रृंखला क्या है?',
  },
  sarosSeries1: {
    en: 'Each eclipse belongs to a Saros series — a family of eclipses recurring every 18.03 years over ~1,200-1,500 years. A typical Saros series contains 70-85 eclipses. The series begins with small partial eclipses near one pole, gradually intensifying to total/annular eclipses near the equator, then fading to small partials at the opposite pole before ending.',
    hi: 'प्रत्येक ग्रहण एक सारोस श्रृंखला से सम्बन्धित है — ~1,200-1,500 वर्षों में हर 18.03 वर्ष में पुनरावर्ती ग्रहणों का एक परिवार। एक सामान्य श्रृंखला में 70-85 ग्रहण होते हैं। श्रृंखला एक ध्रुव के पास छोटे आंशिक ग्रहणों से शुरू होती है, धीरे-धीरे भूमध्य रेखा के पास पूर्ण/वलयाकार ग्रहणों तक तीव्र होती है, फिर विपरीत ध्रुव पर छोटे आंशिक ग्रहणों में क्षीण होकर समाप्त होती है।',
  },
  sarosSeries2: {
    en: 'At any given time, about 40 Saros series are producing solar eclipses and about 40 are producing lunar eclipses (~80 total active series). Series are numbered: for example, the August 12, 2026 total solar eclipse belongs to Saros 126, and the March 3, 2026 total lunar eclipse belongs to Saros 133.',
    hi: 'किसी भी समय, लगभग 40 सारोस श्रृंखलाएँ सूर्य ग्रहण और लगभग 40 चन्द्र ग्रहण उत्पन्न कर रही होती हैं (~80 कुल सक्रिय श्रृंखलाएँ)। उदाहरण: 12 अगस्त 2026 का पूर्ण सूर्य ग्रहण सारोस 126 से सम्बन्धित है, और 3 मार्च 2026 का पूर्ण चन्द्र ग्रहण सारोस 133 से।',
  },
  sarosNodePrecession: {
    en: 'The Nodal Precession (18.6 Year Cycle)',
    hi: 'पात का पुरस्सरण (18.6 वर्ष चक्र)',
  },
  sarosNodePrec1: {
    en: 'The Rahu-Ketu axis is not fixed — it rotates backwards (retrograde) through the zodiac, completing one full revolution in 18.6 years. This means Rahu and Ketu move through all 12 signs over 18.6 years, spending about 1.5 years in each sign. This is why eclipse "seasons" (when the Sun is near a node and eclipses are possible) shift earlier by about 19 days each year.',
    hi: 'राहु-केतु अक्ष स्थिर नहीं है — यह राशिचक्र में पीछे की ओर (वक्री) घूमता है, 18.6 वर्षों में एक पूर्ण चक्कर पूरा करता है। अर्थात् राहु और केतु 18.6 वर्षों में सभी 12 राशियों से गुजरते हैं, प्रत्येक राशि में लगभग 1.5 वर्ष रहते हैं। इसलिए ग्रहण "ऋतुएँ" प्रत्येक वर्ष लगभग 19 दिन पहले आती हैं।',
  },
  sarosNodePrec2: {
    en: 'In Vedic astrology, this precession is one of the most important transit events — Rahu\'s ingress into a new sign affects mundane predictions, national events, and personal charts (especially for those running Rahu or Ketu Mahadasha). The current transit: Rahu is in Pisces and Ketu is in Virgo (2025-2026).',
    hi: 'वैदिक ज्योतिष में, यह पुरस्सरण सबसे महत्वपूर्ण गोचर घटनाओं में से एक है — राहु का नई राशि में प्रवेश मुण्डन भविष्यवाणियों, राष्ट्रीय घटनाओं और व्यक्तिगत कुण्डलियों को प्रभावित करता है (विशेषकर राहु या केतु महादशा वालों के लिए)। वर्तमान गोचर: राहु मीन में और केतु कन्या में (2025-2026)।',
  },
  sarosExampleTitle: {
    en: 'Saros in Action — Predicting Real Eclipses',
    hi: 'सारोस कार्य में — वास्तविक ग्रहणों की भविष्यवाणी',
  },
  sarosExample1: {
    en: 'Let\'s trace a real Saros chain. The total solar eclipse of August 12, 2026 (Saros 126) is part of a family. Add 18 years, 11 days, 8 hours to each date:',
    hi: 'एक वास्तविक सारोस श्रृंखला का अनुसरण करें। 12 अगस्त 2026 का पूर्ण सूर्य ग्रहण (सारोस 126) एक परिवार का हिस्सा है। प्रत्येक तिथि में 18 वर्ष, 11 दिन, 8 घण्टे जोड़ें:',
  },
  sarosExample2: {
    en: 'Notice how the path shifts ~120° westward each time (the 8-hour rotation), and the magnitude slowly changes as the series evolves. This is how ancient astronomers could predict eclipses centuries in advance — by knowing the Saros pattern.',
    hi: 'देखें कि कैसे प्रत्येक बार पथ ~120° पश्चिम की ओर खिसकता है (8 घण्टे का घूर्णन), और श्रृंखला के विकास के साथ परिमाण धीरे-धीरे बदलता है। इसी प्रकार प्राचीन खगोलविद सारोस प्रतिमान जानकर सदियों पहले ग्रहणों की भविष्यवाणी कर सकते थे।',
  },
  sarosLunarExample: {
    en: 'Similarly for lunar eclipses — the total lunar eclipse of March 3, 2026 (Saros 133) connects to:',
    hi: 'इसी प्रकार चन्द्र ग्रहणों के लिए — 3 मार्च 2026 का पूर्ण चन्द्र ग्रहण (सारोस 133) जुड़ता है:',
  },
  sarosSeasonTitle: {
    en: 'Eclipse Seasons — Why They Shift',
    hi: 'ग्रहण ऋतुएँ — ये क्यों खिसकती हैं',
  },
  sarosSeason1: {
    en: 'Because the Rahu-Ketu axis precesses backwards, the times when the Sun aligns with a node (eclipse season) shift earlier by ~19 days each year. In 2026, eclipse seasons are in February-March and August. By 2030, they\'ll have shifted to approximately January-February and July. By 2035, to December-January and June.',
    hi: 'चूँकि राहु-केतु अक्ष पीछे की ओर घूमता है, जब सूर्य किसी पात से संरेखित होता है (ग्रहण ऋतु) वह प्रत्येक वर्ष ~19 दिन पहले खिसकती है। 2026 में ग्रहण ऋतुएँ फरवरी-मार्च और अगस्त में हैं। 2030 तक वे लगभग जनवरी-फरवरी और जुलाई में होंगी। 2035 तक दिसम्बर-जनवरी और जून में।',
  },

  /* Node-Type Matrix */
  nodeMatrixTitle: {
    en: 'The 4 Eclipse Types — Rahu vs Ketu, Solar vs Lunar',
    hi: '4 ग्रहण प्रकार — राहु बनाम केतु, सूर्य बनाम चन्द्र',
  },
  nodeMatrixIntro: {
    en: 'An eclipse can occur at either node (Rahu or Ketu) and can be solar or lunar — giving us a 2×2 matrix of four distinct eclipse types. Classical texts like Brihat Samhita (Varahamihira), Surya Siddhanta, and Arthashastra (Kautilya) assign different mundane and personal significances to each combination. The node where the eclipse occurs determines its karmic flavour.',
    hi: 'ग्रहण किसी भी पात (राहु या केतु) पर हो सकता है और सूर्य या चन्द्र हो सकता है — जिससे चार विशिष्ट ग्रहण प्रकारों का 2×2 आव्यूह बनता है। बृहत् संहिता (वराहमिहिर), सूर्य सिद्धान्त और अर्थशास्त्र (कौटिल्य) जैसे शास्त्रीय ग्रन्थ प्रत्येक संयोजन को भिन्न मुण्डन और व्यक्तिगत महत्त्व देते हैं। जिस पात पर ग्रहण होता है वह उसका कार्मिक स्वरूप निर्धारित करता है।',
  },
  rahuSolar: {
    en: 'Rahu Solar Eclipse (Amavasya at Rahu)',
    hi: 'राहु सूर्य ग्रहण (राहु पर अमावस्या)',
  },
  rahuSolarDesc: {
    en: 'Rahu\'s nature: material desire, obsession, foreign influence, technology, illusion. When Rahu swallows the Sun (soul, authority, kings), it signifies: disruption to ruling powers, political upheaval, deception at the highest levels, and ambition overriding dharma. For individuals: ego crises, identity confusion, father\'s health issues, but also breakthroughs in foreign lands, technology, and unconventional paths. Remedies lean toward Surya mantras and Rahu pacification (donation of sesame, mustard oil on Saturday).',
    hi: 'राहु का स्वभाव: भौतिक इच्छा, जुनून, विदेशी प्रभाव, तकनीक, भ्रम। जब राहु सूर्य (आत्मा, अधिकार, राजा) को ग्रसता है: शासकों में उथल-पुथल, राजनीतिक अस्थिरता, उच्चतम स्तर पर छल, धर्म पर महत्वाकांक्षा का प्रभुत्व। व्यक्तिगत: अहंकार संकट, पहचान भ्रम, पिता का स्वास्थ्य, पर विदेश और तकनीक में सफलता भी। उपाय: सूर्य मन्त्र और राहु शान्ति (तिल, सरसों तेल शनिवार को दान)।',
  },
  ketuSolar: {
    en: 'Ketu Solar Eclipse (Amavasya at Ketu)',
    hi: 'केतु सूर्य ग्रहण (केतु पर अमावस्या)',
  },
  ketuSolarDesc: {
    en: 'Ketu\'s nature: detachment, liberation, past karma, spirituality, loss. When Ketu eclipses the Sun, it strips away ego and worldly attachment. It signifies: fall of arrogant leaders, exposure of hidden truths, spiritual awakenings forced by loss, and karmic debts coming due. For individuals: sudden detachment from career or status, health scares that redirect life purpose, deep spiritual experiences, liberation from old patterns. Often the more transformative of the two solar eclipses. Remedies: Maha Mrityunjaya mantra, Ketu pacification (cat\'s eye stone, donation of blankets).',
    hi: 'केतु का स्वभाव: वैराग्य, मोक्ष, पूर्व कर्म, आध्यात्म, हानि। जब केतु सूर्य को ग्रसता है, यह अहंकार और सांसारिक आसक्ति छीन लेता है। अहंकारी नेताओं का पतन, छिपे सत्यों का उद्घाटन, हानि से प्रेरित आध्यात्मिक जागृति, कर्म ऋणों का परिपक्व होना। व्यक्तिगत: कैरियर/प्रतिष्ठा से अचानक वैराग्य, स्वास्थ्य भय जो जीवन उद्देश्य बदले, गहन आध्यात्मिक अनुभव। प्रायः दो सूर्य ग्रहणों में अधिक परिवर्तनकारी। उपाय: महामृत्युंजय मन्त्र, केतु शान्ति (लहसुनिया, कम्बल दान)।',
  },
  rahuLunar: {
    en: 'Rahu Lunar Eclipse (Purnima at Rahu)',
    hi: 'राहु चन्द्र ग्रहण (राहु पर पूर्णिमा)',
  },
  rahuLunarDesc: {
    en: 'When Rahu eclipses the Moon (mind, emotions, mother, public), it creates: mass emotional manipulation, public hysteria or panic, deceptive media narratives, and collective anxiety. The mind gets clouded by desires and illusions. For individuals: emotional turbulence, mother\'s health issues, mental fog, irrational fears, but also sudden intuitive breakthroughs and psychic awakening. Those in Rahu or Moon dasha feel this most intensely. Remedies: Chandra mantras, pearl, milk donation, Rahu pacification.',
    hi: 'जब राहु चन्द्र (मन, भावनाएं, माता, जनता) को ग्रसता है: सामूहिक भावनात्मक हेरफेर, जन उन्माद, भ्रामक मीडिया, सामूहिक चिन्ता। मन इच्छाओं और भ्रम से ग्रस्त। व्यक्तिगत: भावनात्मक उथल-पुथल, माता का स्वास्थ्य, मानसिक धुंध, अतार्किक भय, पर अचानक सहज ज्ञान और मानसिक जागृति भी। राहु या चन्द्र दशा वाले सबसे तीव्रता से अनुभव करते हैं। उपाय: चन्द्र मन्त्र, मोती, दूध दान, राहु शान्ति।',
  },
  ketuLunar: {
    en: 'Ketu Lunar Eclipse (Purnima at Ketu)',
    hi: 'केतु चन्द्र ग्रहण (केतु पर पूर्णिमा)',
  },
  ketuLunarDesc: {
    en: 'When Ketu eclipses the Moon, it dissolves emotional attachments and forces inner reckoning. It signifies: collective grief or mourning, revelations about the past, ancestral karma surfacing, and spiritual purification through emotional pain. The famous "Blood Moon" is often a Ketu lunar eclipse — the red colour symbolising the burning away of past-life impressions (samskaras). For individuals: deep introspection, release of emotional baggage, past relationships resurfacing for closure, psychic sensitivity heightened. This is the most spiritually potent of all four eclipse types. Remedies: Ketu pacification, Pitri Tarpan (ancestral offerings), meditation, seven-grain donation.',
    hi: 'जब केतु चन्द्र को ग्रसता है, यह भावनात्मक आसक्तियों को विलीन करता है और आन्तरिक लेखा-जोखा करवाता है। सामूहिक शोक, अतीत के बारे में रहस्योद्घाटन, पूर्वजों का कर्म सतह पर, भावनात्मक पीड़ा से आध्यात्मिक शुद्धि। प्रसिद्ध "रक्त चन्द्र" प्रायः केतु चन्द्र ग्रहण होता है — लाल रंग पूर्वजन्म संस्कारों के दहन का प्रतीक। व्यक्तिगत: गहन आत्मनिरीक्षण, भावनात्मक बोझ से मुक्ति, पिछले सम्बन्ध समापन हेतु पुनः प्रकट, मानसिक संवेदनशीलता बढ़ी। चारों ग्रहण प्रकारों में सर्वाधिक आध्यात्मिक रूप से शक्तिशाली। उपाय: केतु शान्ति, पितृ तर्पण, ध्यान, सप्तधान्य दान।',
  },
  nodeMatrixNote: {
    en: 'How to know which node? Check if the eclipse is near Rahu\'s longitude or Ketu\'s longitude (Rahu + 180°) in the sidereal zodiac. Our eclipse engine automatically identifies this.',
    hi: 'कैसे पता करें कौन सा पात? देखें कि ग्रहण सायन राशिचक्र में राहु के अंश या केतु के अंश (राहु + 180°) के निकट है। हमारा ग्रहण इंजन स्वचालित रूप से इसकी पहचान करता है।',
  },

  /* Cross refs */
  crossRef: { en: 'Related Topics',                                            hi: 'सम्बन्धित विषय' },
  viewCalendar: { en: 'View Eclipse Calendar',                                 hi: 'ग्रहण कैलेण्डर देखें' },
};

/* ─── Eclipse types data ─── */
const ECLIPSE_TYPES = [
  {
    name: { en: 'Total Solar Eclipse', hi: 'पूर्ण सूर्य ग्रहण' },
    color: 'text-amber-300', border: 'border-amber-500/20', bg: 'bg-amber-500/5',
    symbol: '☀',
    condition: { en: 'Moon\'s disk completely covers the Sun. |β| < ~0.9°', hi: 'चन्द्र बिम्ब सूर्य को पूर्णतः ढकता है। |β| < ~0.9°' },
    desc: {
      en: 'The most spectacular celestial event. Day turns to night for up to ~7.5 minutes along the path of totality. The solar corona — the Sun\'s outer atmosphere — blazes into view. Stars appear in daytime. Moon must be near perigee (close to Earth) so its apparent disk is large enough to cover the Sun completely.',
      hi: 'सबसे शानदार खगोलीय घटना। पूर्णता के पथ पर ~7.5 मिनट तक दिन रात में बदल जाता है। सूर्य का बाहरी वायुमण्डल — कोरोना — दृश्यमान होता है। दिन में तारे दिखते हैं। चन्द्रमा उपभू के निकट होना चाहिए ताकि उसका प्रत्यक्ष बिम्ब सूर्य को पूर्णतः ढकने के लिए पर्याप्त बड़ा हो।',
    },
  },
  {
    name: { en: 'Annular Solar Eclipse', hi: 'कण्कण सूर्य ग्रहण' },
    color: 'text-orange-400', border: 'border-orange-500/20', bg: 'bg-orange-500/5',
    symbol: '⊙',
    condition: { en: 'Moon near apogee — apparent disk smaller than Sun. Ring of fire visible.', hi: 'चन्द्रमा अपभू के निकट — प्रत्यक्ष बिम्ब सूर्य से छोटा। अग्नि-वलय दृश्यमान।' },
    desc: {
      en: 'The Moon covers the Sun\'s centre but its apparent diameter is slightly smaller (Moon is near apogee — far from Earth), leaving a brilliant ring of sunlight around the dark lunar disk. Annular eclipses produce no corona-viewing opportunity, but the "ring of fire" is striking. They are more frequent than total solar eclipses because the Moon spends more time near apogee.',
      hi: 'चन्द्रमा सूर्य के केन्द्र को ढकता है परन्तु उसका प्रत्यक्ष व्यास थोड़ा छोटा होता है (चन्द्रमा अपभू के निकट — पृथ्वी से दूर), जिससे अँधेरे चन्द्र बिम्ब के चारों ओर सूर्य के प्रकाश की एक तेजस्वी वलय रहती है।',
    },
  },
  {
    name: { en: 'Partial Solar Eclipse', hi: 'आंशिक सूर्य ग्रहण' },
    color: 'text-yellow-400', border: 'border-yellow-500/20', bg: 'bg-yellow-500/5',
    symbol: '◑',
    condition: { en: 'Moon covers only part of the Sun. 0.9° < |β| < ~1.6°', hi: 'चन्द्रमा सूर्य का केवल एक भाग ढकता है। 0.9° < |β| < ~1.6°' },
    desc: {
      en: 'The Moon passes across only a part of the Sun\'s disk. The penumbra (partial shadow) sweeps a wide region on either side of the central path. A partial solar eclipse is visible over a much larger geographic area than a total or annular eclipse. At maximum, the Sun appears as a crescent.',
      hi: 'चन्द्रमा केवल सूर्य के बिम्ब के एक भाग को पार करता है। उपछाया (आंशिक छाया) केन्द्रीय पथ के दोनों ओर एक विस्तृत क्षेत्र में फैलती है। आंशिक सूर्य ग्रहण पूर्ण या कण्कण ग्रहण की तुलना में बहुत बड़े भौगोलिक क्षेत्र में दृश्यमान होता है।',
    },
  },
  {
    name: { en: 'Total Lunar Eclipse (Blood Moon)', hi: 'पूर्ण चन्द्र ग्रहण (रक्त चन्द्र)' },
    color: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/5',
    symbol: '🌑',
    condition: { en: 'Moon fully inside Earth\'s umbral shadow. |β| < ~0.5°', hi: 'चन्द्रमा पृथ्वी की उपछाया में पूर्णतः। |β| < ~0.5°' },
    desc: {
      en: 'The Moon passes completely into the darkest part of Earth\'s shadow (umbra). The Moon does not go dark — instead it turns deep red or copper-orange. Earth\'s atmosphere refracts sunlight, bending red wavelengths (which scatter least) around the planet and onto the Moon. The exact colour depends on atmospheric conditions: clear air produces a bright orange-red; heavy volcanic dust can make the Moon nearly black.',
      hi: 'चन्द्रमा पृथ्वी की छाया (उपछाया) के सबसे अँधेरे भाग में पूरी तरह प्रवेश करता है। चन्द्रमा काला नहीं होता — बल्कि गहरे लाल या ताम्र-नारंगी रंग में बदल जाता है। पृथ्वी का वायुमण्डल सूर्यप्रकाश को अपवर्तित करता है, लाल तरंगदैर्घ्य को ग्रह के चारों ओर चन्द्रमा पर मोड़ता है।',
    },
  },
  {
    name: { en: 'Partial Lunar Eclipse', hi: 'आंशिक चन्द्र ग्रहण' },
    color: 'text-rose-400', border: 'border-rose-500/20', bg: 'bg-rose-500/5',
    symbol: '◑',
    condition: { en: 'Moon partially enters the umbral shadow. 0.5° < |β| < ~1.0°', hi: 'चन्द्रमा आंशिक रूप से उपछाया में प्रवेश करता है। 0.5° < |β| < ~1.0°' },
    desc: {
      en: 'Only part of the Moon enters Earth\'s umbral (dark inner) shadow. The umbral portion takes on a reddish-brown hue while the rest of the Moon remains its normal colour. The boundary between the lit and shadowed parts is visibly curved, demonstrating Earth\'s spherical shape — an observation known to ancient Indian astronomers.',
      hi: 'चन्द्रमा का केवल एक भाग पृथ्वी की उपछाया (गहरी आन्तरिक छाया) में प्रवेश करता है। उपछाया वाला भाग लाल-भूरा रंग लेता है जबकि शेष चन्द्रमा अपने सामान्य रंग में रहता है।',
    },
  },
  {
    name: { en: 'Penumbral Lunar Eclipse', hi: 'उपछाया चन्द्र ग्रहण' },
    color: 'text-slate-400', border: 'border-slate-500/20', bg: 'bg-slate-500/5',
    symbol: '○',
    condition: { en: 'Moon enters only the penumbral shadow. 1.0° < |β| < ~1.6°', hi: 'चन्द्रमा केवल उपच्छाया में प्रवेश करता है। 1.0° < |β| < ~1.6°' },
    desc: {
      en: 'The Moon passes through Earth\'s outer penumbral shadow — a region of partial sunlight, not total blockage. The dimming is subtle and often imperceptible to the naked eye except near maximum phase when the Moon\'s limb closest to the umbra may look slightly dusky. Not listed in most Panchang sutak observances because there is no visible "biting" of the Moon.',
      hi: 'चन्द्रमा पृथ्वी की बाहरी उपच्छाया से गुज़रता है — आंशिक सूर्यप्रकाश का क्षेत्र, पूर्ण अवरोध नहीं। मंद होना सूक्ष्म होता है और अधिकतम चरण के निकट को छोड़कर नग्न आँखों से अक्सर अगोचर होता है।',
    },
  },
];

/* ─── Eclipse phases ─── */
const PHASES = [
  {
    sanskrit: 'स्पर्श (Sparsha)',
    name: { en: 'First Contact', hi: 'प्रथम सम्पर्क' },
    code: 'P1 / C1',
    desc: { en: 'Shadow first touches the luminary. For lunar: penumbra touches the Moon (P1). For solar: penumbra touches Earth (C1). This is when Sutak is traditionally considered to begin (applying classical rules backward from this point).', hi: 'छाया सबसे पहले ज्योतिर्मय को स्पर्श करती है। यहीं से सूतक काल की गणना पारम्परिक रूप से की जाती है।' },
  },
  {
    sanskrit: 'खग्रास (Khagras)',
    name: { en: 'Totality Begins', hi: 'पूर्णता आरम्भ' },
    code: 'U1 / C2',
    desc: { en: 'Moon fully enters the umbral shadow (U1 for lunar) or Moon\'s disk fully covers the Sun (C2 for solar). Only for total/annular eclipses. The Khagras moment is recorded in classical texts as the deepest ritual restriction.', hi: 'चन्द्रमा पूर्णतः उपछाया में प्रवेश करता है (U1 चन्द्र के लिए) या चन्द्र बिम्ब सूर्य को पूर्णतः ढकता है (C2 सूर्य के लिए)। केवल पूर्ण/कण्कण ग्रहणों के लिए।' },
  },
  {
    sanskrit: 'मध्य (Madhya)',
    name: { en: 'Maximum Eclipse', hi: 'अधिकतम ग्रहण' },
    code: 'Max',
    desc: { en: 'The deepest point of the eclipse — when the shadow\'s centre is nearest to the Moon (lunar) or when the Moon\'s centre is nearest to the Sun\'s centre (solar). This is the moment of greatest spiritual intensity in Vedic tradition.', hi: 'ग्रहण का सबसे गहरा बिन्दु — जब छाया का केन्द्र चन्द्रमा (चन्द्र) के निकटतम हो या जब चन्द्र का केन्द्र सूर्य के केन्द्र के निकटतम हो (सूर्य)।' },
  },
  {
    sanskrit: 'मोक्ष (Moksha)',
    name: { en: 'Last Contact', hi: 'अन्तिम सम्पर्क' },
    code: 'P4 / C4',
    desc: { en: 'Shadow fully leaves the luminary. The eclipse is complete. This is the moment for ritual bath (snan), ending of sutak observances, and beginning of eclipse-completion rituals. The name Moksha — liberation — signals the return to normal sacred time.', hi: 'छाया ज्योतिर्मय को पूर्णतः छोड़ देती है। ग्रहण पूर्ण होता है। यह स्नान, सूतक समाप्ति और ग्रहण-पूर्णता अनुष्ठानों का क्षण है। मोक्ष नाम सामान्य पवित्र समय की वापसी का संकेत देता है।' },
  },
];

/* ─── Sutak data ─── */
const SUTAK_SOURCES = [
  {
    text: { en: 'Dharmasindhu', hi: 'धर्मसिन्धु' },
    solar: { en: '4 day-prahars (~12 hours, scales with season)', hi: '4 दिन-प्रहर (~12 घण्टे, मौसम के साथ बदलता है)' },
    lunar: { en: '3 night-prahars (~9 hours, scales with season)', hi: '3 रात-प्रहर (~9 घण्टे, मौसम के साथ बदलता है)' },
    color: 'text-amber-400',
  },
  {
    text: { en: 'Nirnaya Sindhu', hi: 'निर्णय सिन्धु' },
    solar: { en: 'Fixed 12 hours before eclipse', hi: 'ग्रहण से ठीक 12 घण्टे पहले' },
    lunar: { en: 'Fixed 9 hours before eclipse', hi: 'ग्रहण से ठीक 9 घण्टे पहले' },
    color: 'text-blue-300',
  },
  {
    text: { en: 'Muhurta Chintamani', hi: 'मुहूर्त चिन्तामणि' },
    solar: { en: 'From sunrise on the eclipse day', hi: 'ग्रहण के दिन सूर्योदय से' },
    lunar: { en: 'From sunrise on the eclipse day', hi: 'ग्रहण के दिन सूर्योदय से' },
    color: 'text-violet-400',
  },
];

const SUTAK_DO = [
  { en: 'Chanting of mantras, japa, prayer', hi: 'मन्त्र जाप, प्रार्थना' },
  { en: 'Reading scriptures (Gita, Upanishads, Ramayana)', hi: 'शास्त्र पाठ (गीता, उपनिषद, रामायण)' },
  { en: 'Meditation and pranayama', hi: 'ध्यान और प्राणायाम' },
  { en: 'Giving charity and donations', hi: 'दान-दक्षिणा देना' },
  { en: 'Ritual bath at eclipse end (Moksha snan)', hi: 'ग्रहण मोक्ष पर स्नान' },
  { en: 'Worshipping the deity on whose day the eclipse falls', hi: 'जिस देवता का दिन हो उनकी पूजा' },
];

const SUTAK_AVOID = [
  { en: 'Eating food prepared before Sutak began', hi: 'सूतक से पहले बना खाना खाना' },
  { en: 'Starting new ventures, signing contracts', hi: 'नए कार्य आरम्भ, अनुबंध पर हस्ताक्षर' },
  { en: 'Marriage, griha pravesh, sacred thread ceremony', hi: 'विवाह, गृह प्रवेश, यज्ञोपवीत संस्कार' },
  { en: 'Sleeping (considered inauspicious during eclipse)', hi: 'सोना (ग्रहण के दौरान अशुभ माना जाता है)' },
  { en: 'Sexual activity', hi: 'यौन सम्बन्ध' },
  { en: 'Cutting hair, nails', hi: 'बाल, नाखून काटना' },
];

/* ─── Kundali eclipse effects ─── */
const KUNDALI_EFFECTS = [
  {
    situation: { en: 'Eclipse conjunct natal Sun', hi: 'जन्म सूर्य पर ग्रहण' },
    effect: { en: 'Transformation of identity, career, authority. Father-related themes. Leadership changes. A pivotal year for self-definition.', hi: 'पहचान, करियर, अधिकार का परिवर्तन। पिता-सम्बन्धी विषय। नेतृत्व परिवर्तन। आत्म-परिभाषा के लिए महत्वपूर्ण वर्ष।' },
    color: 'text-amber-300',
  },
  {
    situation: { en: 'Eclipse conjunct natal Moon', hi: 'जन्म चन्द्र पर ग्रहण' },
    effect: { en: 'Emotional upheaval or breakthrough. Changes in home, mother, public standing. Inner world re-alignment. Often marks a powerful emotional turning point.', hi: 'भावनात्मक उथल-पुथल या सफलता। घर, माँ, सार्वजनिक प्रतिष्ठा में परिवर्तन। आन्तरिक जगत का पुनर्संरेखण।' },
    color: 'text-blue-300',
  },
  {
    situation: { en: 'Eclipse on natal Rahu/Ketu axis', hi: 'जन्म राहु/केतु अक्ष पर ग्रहण' },
    effect: { en: 'Major karmic reset. Past-life patterns surface for resolution. Sudden life direction changes. Spiritual awakenings or crises. The most intensely fated eclipse contact.', hi: 'प्रमुख कार्मिक रीसेट। पूर्वजन्म के पैटर्न समाधान के लिए उभरते हैं। जीवन की दिशा में अचानक परिवर्तन। सबसे भाग्य-निर्धारित ग्रहण सम्पर्क।' },
    color: 'text-violet-400',
  },
  {
    situation: { en: 'Eclipse on natal Ascendant (Lagna)', hi: 'जन्म लग्न पर ग्रहण' },
    effect: { en: 'Physical appearance, health, and overall life direction transform. A new chapter begins. Identity shifts at a fundamental level. Others perceive you differently.', hi: 'शारीरिक उपस्थिति, स्वास्थ्य और समग्र जीवन दिशा में परिवर्तन। एक नया अध्याय आरम्भ होता है। पहचान मौलिक स्तर पर बदलती है।' },
    color: 'text-emerald-400',
  },
  {
    situation: { en: 'Eclipse activating a house (no natal planet)', hi: 'भाव में ग्रहण (बिना जन्म ग्रह)' },
    effect: { en: 'Events in the life area governed by that house: 1st = body, 2nd = wealth, 4th = home, 7th = relationships, 10th = career. Effects build over 6 months around the eclipse.', hi: 'उस भाव द्वारा शासित जीवन क्षेत्र में घटनाएँ: पहला = शरीर, दूसरा = धन, चौथा = घर, सातवाँ = सम्बन्ध, दसवाँ = करियर।' },
    color: 'text-text-secondary',
  },
  {
    situation: { en: 'Solar eclipse near natal birthday', hi: 'जन्मदिन के निकट सूर्य ग्रहण' },
    effect: { en: 'Transformative solar return year. Themes set at the eclipse activate through the next year. The year carries an intensified, fated quality. Often marks major life milestones.', hi: 'परिवर्तनकारी सोलर रिटर्न वर्ष। ग्रहण पर निर्धारित विषय अगले वर्ष सक्रिय होते हैं। वर्ष में तीव्र, भाग्य-निर्मित गुणवत्ता होती है।' },
    color: 'text-gold-light',
  },
];

/* ─── Cross references ─── */
const CROSS_REFS = [
  { href: '/eclipses', label: { en: 'Eclipse Calendar', hi: 'ग्रहण कैलेण्डर' }, desc: { en: 'All upcoming solar & lunar eclipses with timings', hi: 'सभी आगामी सूर्य और चन्द्र ग्रहण समय के साथ' } },
  { href: '/learn/tithis', label: { en: 'Tithis', hi: 'तिथि' }, desc: { en: 'Amavasya & Purnima — the lunations that can produce eclipses', hi: 'अमावस्या और पूर्णिमा — ग्रहण उत्पन्न करने वाली तिथियाँ' } },
  { href: '/learn/nakshatras', label: { en: 'Nakshatras', hi: 'नक्षत्र' }, desc: { en: 'Eclipses in Bharani, Krittika, etc. — nakshatra-based eclipse signification', hi: 'भरणी, कृत्तिका आदि में ग्रहण — नक्षत्र-आधारित ग्रहण महत्त्व' } },
  { href: '/learn/rashis', label: { en: 'Rashis', hi: 'राशि' }, desc: { en: 'Which zodiac sign the eclipse falls in — house and sign effects', hi: 'ग्रहण किस राशि में पड़ता है — भाव और राशि प्रभाव' } },
];

export default function LearnEclipsesPage() {
  const locale = useLocale() as Locale;
  const isHi = locale !== 'en';
  const headingFont = isHi
    ? { fontFamily: 'var(--font-devanagari-heading)' }
    : { fontFamily: 'var(--font-heading)' };
  const bodyFont = isHi ? { fontFamily: 'var(--font-devanagari-body)' } : undefined;
  const l = (obj: { en: string; hi: string }) => (isHi ? obj.hi : obj.en);

  return (
    <div className="space-y-8">
      {/* ═══ Header ═══ */}
      <div>
        <h2 className="text-3xl font-bold text-gold-gradient mb-3" style={headingFont}>
          {l(L.title)}
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-3xl" style={bodyFont}>
          {l(L.subtitle)}
        </p>
      </div>

      {/* ═══ 1. Mythology ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.mythTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4" style={bodyFont}>
          <p>{l(L.myth1)}</p>
          <p>{l(L.myth2)}</p>

          {/* Visual: Rahu-Ketu diagram */}
          <div className="flex justify-center my-6">
            <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-2xl p-6 max-w-lg w-full">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-5 text-center">
                {isHi ? 'राहु → सूर्य ग्रहण · केतु → चन्द्र ग्रहण' : 'Rahu → Solar Eclipse · Ketu → Lunar Eclipse'}
              </div>
              <svg viewBox="0 0 400 100" className="w-full h-24" aria-hidden="true">
                {/* Ecliptic line */}
                <line x1="20" y1="50" x2="380" y2="50" stroke="#d4a853" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
                {/* Moon orbit arc */}
                <path d="M 20 80 Q 200 10 380 80" fill="none" stroke="#8a8478" strokeWidth="1.5" opacity="0.5" />
                {/* Rahu node */}
                <circle cx="120" cy="50" r="8" fill="#d4a853" opacity="0.15" stroke="#d4a853" strokeWidth="1.5" />
                <text x="120" y="54" textAnchor="middle" fontSize="10" fill="#d4a853" fontWeight="bold">☊</text>
                <text x="120" y="68" textAnchor="middle" fontSize="9" fill="#d4a853" opacity="0.8">{isHi ? 'राहु' : 'Rahu'}</text>
                {/* Ketu node */}
                <circle cx="280" cy="50" r="8" fill="#8b5cf6" opacity="0.15" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="280" y="54" textAnchor="middle" fontSize="10" fill="#8b5cf6" fontWeight="bold">☋</text>
                <text x="280" y="68" textAnchor="middle" fontSize="9" fill="#8b5cf6" opacity="0.8">{isHi ? 'केतु' : 'Ketu'}</text>
                {/* Sun label */}
                <circle cx="60" cy="50" r="12" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="1" />
                <text x="60" y="54" textAnchor="middle" fontSize="11" fill="#f59e0b">☀</text>
                <text x="60" y="82" textAnchor="middle" fontSize="8" fill="#f59e0b" opacity="0.7">{isHi ? 'सूर्य' : 'Sun'}</text>
                {/* Moon near Rahu */}
                <circle cx="140" cy="42" r="7" fill="#e2e8f0" opacity="0.25" stroke="#e2e8f0" strokeWidth="1" />
                <text x="140" y="46" textAnchor="middle" fontSize="9" fill="#e2e8f0">☽</text>
                {/* Earth */}
                <circle cx="200" cy="50" r="10" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="1" />
                <text x="200" y="54" textAnchor="middle" fontSize="9" fill="#3b82f6">⊕</text>
                <text x="200" y="70" textAnchor="middle" fontSize="8" fill="#3b82f6" opacity="0.7">{isHi ? 'पृथ्वी' : 'Earth'}</text>
                {/* Inclination label */}
                <text x="330" y="30" textAnchor="middle" fontSize="8" fill="#8a8478" opacity="0.8">5.15°</text>
              </svg>
              <div className="grid grid-cols-2 gap-3 mt-4 text-xs text-center">
                <div className="p-2 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                  <div className="text-amber-300 font-bold mb-1">{isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse'}</div>
                  <div className="text-text-secondary/70">{isHi ? 'अमावस्या + राहु/केतु के निकट' : 'Amavasya + Moon near Rahu/Ketu'}</div>
                </div>
                <div className="p-2 bg-blue-500/5 border border-blue-500/15 rounded-lg">
                  <div className="text-blue-300 font-bold mb-1">{isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse'}</div>
                  <div className="text-text-secondary/70">{isHi ? 'पूर्णिमा + राहु/केतु के निकट' : 'Purnima + Moon near Rahu/Ketu'}</div>
                </div>
              </div>
            </div>
          </div>

          <p>{l(L.myth3)}</p>
        </div>
      </motion.section>

      {/* ═══ 2. Astronomy ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.astroTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-4" style={bodyFont}>
          <p>{l(L.astro1)}</p>
          <p>{l(L.astro2)}</p>
          <p>{l(L.astro3)}</p>

          {/* Interactive animation — Solar & Lunar Eclipse */}
          <EclipseAnimation locale={locale} />

          {/* Visual: Moon orbital inclination diagram */}
          <div className="flex justify-center my-4">
            <div className="bg-bg-primary/40 border border-gold-primary/10 rounded-xl p-5 max-w-md w-full">
              <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-4 text-center">
                {isHi ? 'चन्द्र कक्षा — क्रान्तिवृत्त से 5.15° झुकी हुई' : "Moon's Orbit — 5.15° Inclined to the Ecliptic"}
              </div>
              <svg viewBox="0 0 320 120" className="w-full h-28" aria-hidden="true">
                {/* Ecliptic plane */}
                <line x1="10" y1="60" x2="310" y2="60" stroke="#d4a853" strokeWidth="1.5" opacity="0.5" />
                <text x="315" y="63" fontSize="8" fill="#d4a853" opacity="0.6">{isHi ? 'क्रान्तिवृत्त' : 'Ecliptic'}</text>
                {/* Moon orbit — tilted line */}
                <line x1="10" y1="95" x2="310" y2="25" stroke="#8b5cf6" strokeWidth="1.5" opacity="0.6" strokeDasharray="5 3" />
                {/* 5.15° arc indicator */}
                <path d="M 160 60 A 20 20 0 0 0 168 43" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.7" />
                <text x="172" y="50" fontSize="8" fill="#8b5cf6" opacity="0.9">5.15°</text>
                {/* Rahu node (ascending) */}
                <circle cx="90" cy="60" r="5" fill="#d4a853" opacity="0.2" stroke="#d4a853" strokeWidth="1.5" />
                <text x="90" y="64" textAnchor="middle" fontSize="9" fill="#d4a853">☊</text>
                <text x="90" y="78" textAnchor="middle" fontSize="8" fill="#d4a853" opacity="0.7">{isHi ? 'राहु' : 'Rahu'}</text>
                {/* Ketu node (descending) */}
                <circle cx="230" cy="60" r="5" fill="#8b5cf6" opacity="0.2" stroke="#8b5cf6" strokeWidth="1.5" />
                <text x="230" y="64" textAnchor="middle" fontSize="9" fill="#8b5cf6">☋</text>
                <text x="230" y="78" textAnchor="middle" fontSize="8" fill="#8b5cf6" opacity="0.7">{isHi ? 'केतु' : 'Ketu'}</text>
                {/* Moon positions */}
                <circle cx="60" cy="82" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.5" />
                <text x="60" y="98" textAnchor="middle" fontSize="7" fill="#8a8478">{isHi ? 'β = −4°' : 'β = −4°'}</text>
                <circle cx="160" cy="48" r="5" fill="#e2e8f0" opacity="0.7" stroke="#e2e8f0" strokeWidth="1" />
                <text x="160" y="40" textAnchor="middle" fontSize="7" fill="#e2e8f0">{isHi ? 'β ≈ 0°' : 'β ≈ 0°'}</text>
                <text x="160" y="32" textAnchor="middle" fontSize="7" fill="#22c55e">{isHi ? '→ ग्रहण!' : '→ Eclipse!'}</text>
                <circle cx="270" cy="35" r="5" fill="none" stroke="#e2e8f0" strokeWidth="1.2" opacity="0.5" />
                <text x="270" y="28" textAnchor="middle" fontSize="7" fill="#8a8478">{isHi ? 'β = +3°' : 'β = +3°'}</text>
              </svg>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 3. Calculation Engine ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(L.calcTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-6" style={bodyFont}>
          {l(L.calcIntro)}
        </p>

        <div className="space-y-5">
          {/* Step 1 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">01</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{l(L.step1Title)}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{l(L.step1)}</p>
              <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
                <p>{isHi ? '// तिथि #30 (अमावस्या) → सूर्य ग्रहण उम्मीदवार' : '// Tithi #30 (Amavasya) → solar eclipse candidate'}</p>
                <p>{isHi ? '// तिथि #15 (पूर्णिमा) → चन्द्र ग्रहण उम्मीदवार' : '// Tithi #15 (Purnima) → lunar eclipse candidate'}</p>
                <p className="text-text-secondary/60">t_mid = (entry.startJd + entry.endJd) / 2</p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">02</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{l(L.step2Title)}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{l(L.step2)}</p>
              <div className="mt-3 p-3 bg-bg-primary/50 rounded-lg font-mono text-xs text-gold-light/80 space-y-1">
                <p className="text-text-secondary/60">{isHi ? '// चन्द्र अक्षांश प्राप्त करें' : '// Query Moon ecliptic latitude'}</p>
                <p>β = moonEclipticLatitude(t_mid)  <span className="text-text-secondary/50">// degrees</span></p>
                <p>{isHi ? '// β = 0° पर नोड, ±5.15° पर नोड से दूर' : '// β = 0° at node, ±5.15° furthest from node'}</p>
              </div>
            </div>
          </div>

          {/* Step 3 — with threshold tables */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">03</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{l(L.step3Title)}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed space-y-4" style={bodyFont}>
              <p>{l(L.step3)}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Solar thresholds */}
                <div>
                  <div className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
                    {isHi ? 'सूर्य ग्रहण — अमावस्या पर' : 'Solar Eclipse — At New Moon'}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { range: '|β| < ~0.9°', type: { en: 'Central (Total or Annular)', hi: 'केन्द्रीय (पूर्ण या कण्कण)' }, color: 'text-amber-300 bg-amber-500/8 border-amber-500/20' },
                      { range: '|β| < ~1.6°', type: { en: 'Partial solar eclipse', hi: 'आंशिक सूर्य ग्रहण' }, color: 'text-yellow-400 bg-yellow-500/8 border-yellow-500/20' },
                      { range: '|β| > ~1.6°', type: { en: 'No eclipse', hi: 'ग्रहण नहीं' }, color: 'text-text-secondary/60 bg-bg-primary/30 border-gold-primary/8' },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-2 items-center px-3 py-1.5 rounded-lg border text-xs font-mono ${row.color}`}>
                        <span className="opacity-90 w-20 shrink-0">{row.range}</span>
                        <span className="opacity-80">{l(row.type)}</span>
                      </div>
                    ))}
                    <div className="text-text-secondary/60 text-xs px-1 mt-1">
                      {isHi ? 'पूर्ण बनाम कण्कण: चन्द्र दूरी पर निर्भर — निकट = पूर्ण, दूर = कण्कण' : 'Total vs Annular: depends on Moon distance — closer = total, farther = annular'}
                    </div>
                  </div>
                </div>
                {/* Lunar thresholds */}
                <div>
                  <div className="text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
                    {isHi ? 'चन्द्र ग्रहण — पूर्णिमा पर' : 'Lunar Eclipse — At Full Moon'}
                  </div>
                  <div className="space-y-1.5">
                    {[
                      { range: '|β| < ~0.5°', type: { en: 'Total lunar (Blood Moon)', hi: 'पूर्ण चन्द्र (रक्त चन्द्र)' }, color: 'text-red-400 bg-red-500/8 border-red-500/20' },
                      { range: '|β| < ~1.0°', type: { en: 'Partial lunar eclipse', hi: 'आंशिक चन्द्र ग्रहण' }, color: 'text-rose-400 bg-rose-500/8 border-rose-500/20' },
                      { range: '|β| < ~1.6°', type: { en: 'Penumbral lunar eclipse', hi: 'उपच्छाया चन्द्र ग्रहण' }, color: 'text-slate-400 bg-slate-500/8 border-slate-500/20' },
                      { range: '|β| > ~1.6°', type: { en: 'No eclipse', hi: 'ग्रहण नहीं' }, color: 'text-text-secondary/60 bg-bg-primary/30 border-gold-primary/8' },
                    ].map((row, i) => (
                      <div key={i} className={`flex gap-2 items-center px-3 py-1.5 rounded-lg border text-xs font-mono ${row.color}`}>
                        <span className="opacity-90 w-20 shrink-0">{row.range}</span>
                        <span className="opacity-80">{l(row.type)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="border border-gold-primary/12 rounded-xl overflow-hidden">
            <div className="bg-gold-primary/8 px-5 py-3 flex items-center gap-3">
              <span className="text-gold-primary font-bold text-lg font-mono">04</span>
              <h4 className="text-gold-light font-bold text-base" style={headingFont}>{l(L.step4Title)}</h4>
            </div>
            <div className="px-5 py-4 text-text-secondary text-sm leading-relaxed" style={bodyFont}>
              <p>{l(L.step4)}</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 4. Types of Eclipses ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(L.typesTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {l(L.typesIntro)}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ECLIPSE_TYPES.map((et, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-xl border p-4 ${et.bg} ${et.border}`}
            >
              <div className={`text-2xl mb-2 ${et.color}`}>{et.symbol}</div>
              <h4 className={`font-bold text-sm mb-1 ${et.color}`} style={headingFont}>{l(et.name)}</h4>
              <div className="text-text-secondary/70 text-xs font-mono mb-2 leading-snug">{l(et.condition)}</div>
              <p className="text-text-secondary text-xs leading-relaxed" style={bodyFont}>{l(et.desc)}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 5. Eclipse Phases ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(L.phasesTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {l(L.phasesIntro)}
        </p>
        <div className="space-y-3">
          {PHASES.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col sm:flex-row sm:items-start gap-3 border border-gold-primary/10 rounded-xl p-4"
            >
              <div className="shrink-0 flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0 sm:w-36">
                <span className="text-gold-primary font-bold text-base" style={headingFont}>{phase.sanskrit}</span>
                <span className="text-text-secondary/60 text-xs font-mono">{phase.code}</span>
              </div>
              <div>
                <div className="text-gold-light text-sm font-semibold mb-1" style={headingFont}>{l(phase.name)}</div>
                <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>{l(phase.desc)}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact times visual timeline */}
        <div className="mt-6 p-4 bg-bg-primary/40 rounded-xl border border-gold-primary/10">
          <div className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3 text-center">
            {isHi ? 'चन्द्र ग्रहण कालक्रम' : 'Lunar Eclipse Timeline'}
          </div>
          <div className="flex items-center gap-0 w-full overflow-x-auto">
            {[
              { code: 'P1', label: { en: 'Penumbra\nstarts', hi: 'उपच्छाया\nआरम्भ' }, color: 'bg-slate-400/60' },
              { code: 'U1', label: { en: 'Umbra\nstarts', hi: 'उपछाया\nआरम्भ' }, color: 'bg-red-500/60' },
              { code: 'Max', label: { en: 'Maximum\neclipse', hi: 'अधिकतम\nग्रहण' }, color: 'bg-red-600/80' },
              { code: 'U2', label: { en: 'Umbra\nends', hi: 'उपछाया\nसमाप्त' }, color: 'bg-red-500/60' },
              { code: 'P4', label: { en: 'Penumbra\nends', hi: 'उपच्छाया\nसमाप्त' }, color: 'bg-slate-400/60' },
            ].map((item, i, arr) => (
              <div key={i} className="flex items-center shrink-0">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <div className="text-xs font-bold font-mono text-gold-primary">{item.code}</div>
                  <div className="text-text-secondary/60 text-xs text-center whitespace-pre-line leading-tight max-w-12">
                    {l(item.label)}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div className="h-0.5 w-10 sm:w-16 bg-gold-primary/15 mx-1" />
                )}
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ 6. Sutak ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(L.sutakTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bodyFont}>
          {l(L.sutakIntro)}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-4" style={bodyFont}>
          {l(L.sutakSources)}
        </p>

        {/* Sutak source table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gold-primary/15">
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'ग्रन्थ' : 'Text'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse'}</th>
                <th className="text-left py-2 px-3 text-gold-dark text-xs uppercase tracking-wider">{isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse'}</th>
              </tr>
            </thead>
            <tbody>
              {SUTAK_SOURCES.map((src, i) => (
                <tr key={i} className="border-b border-gold-primary/5 hover:bg-gold-primary/5 transition-colors">
                  <td className={`py-2.5 px-3 font-bold text-sm ${src.color}`} style={headingFont}>{l(src.text)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs" style={bodyFont}>{l(src.solar)}</td>
                  <td className="py-2.5 px-3 text-text-secondary text-xs" style={bodyFont}>{l(src.lunar)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Do & Avoid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <h4 className="text-emerald-400 font-bold text-sm mb-3 uppercase tracking-wide" style={headingFont}>
              {l(L.sutakDo)}
            </h4>
            <ul className="space-y-2">
              {SUTAK_DO.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm" style={bodyFont}>
                  <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
                  <span>{isHi ? item.hi : item.en}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-red-400 font-bold text-sm mb-3 uppercase tracking-wide" style={headingFont}>
              {l(L.sutakAvoid)}
            </h4>
            <ul className="space-y-2">
              {SUTAK_AVOID.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-text-secondary text-sm" style={bodyFont}>
                  <span className="text-red-400 mt-0.5 shrink-0">−</span>
                  <span>{isHi ? item.hi : item.en}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* ═══ 7. Eclipses in Kundali ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-2" style={headingFont}>
          {l(L.kundaliTitle)}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-5" style={bodyFont}>
          {l(L.kundaliIntro)}
        </p>
        <div className="space-y-3">
          {KUNDALI_EFFECTS.map((eff, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col sm:flex-row gap-3 border border-gold-primary/10 rounded-xl p-4"
            >
              <div className={`shrink-0 font-bold text-sm sm:w-52 ${eff.color}`} style={headingFont}>
                {l(eff.situation)}
              </div>
              <p className="text-text-secondary text-sm leading-relaxed" style={bodyFont}>
                {l(eff.effect)}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ═══ 8. Saros Cycle ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.sarosTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5" style={bodyFont}>
          {/* Why eclipses repeat */}
          <p className="font-semibold text-gold-light">{l(L.sarosWhy)}</p>
          <div className="space-y-3 ml-1">
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">1.</span>
              <p className="text-sm">{l(L.sarosSynodic)}</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">2.</span>
              <p className="text-sm">{l(L.sarosDraconic)}</p>
            </div>
            <div className="flex gap-3 items-start">
              <span className="text-gold-light font-mono text-sm font-bold shrink-0 mt-0.5">3.</span>
              <p className="text-sm">{l(L.sarosAnomalistic)}</p>
            </div>
          </div>
          <p>{l(L.sarosResult)}</p>

          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '6,585.32', label: { en: 'Days (Saros)', hi: 'दिन (सारोस)' }, color: 'text-gold-light' },
              { value: '18y 11d 8h', label: { en: 'Duration', hi: 'अवधि' }, color: 'text-gold-light' },
              { value: '54y 34d', label: { en: 'Exeligmos (3×)', hi: 'एक्सेलिग्मोस' }, color: 'text-violet-400' },
              { value: '120°', label: { en: 'Westward Shift', hi: 'पश्चिम विचलन' }, color: 'text-blue-300' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{l(stat.label)}</div>
              </div>
            ))}
          </div>

          {/* 8-hour shift */}
          <p>{l(L.saros8hours)}</p>

          {/* Saros Series */}
          <h4 className="text-lg font-bold text-gold-light mt-4" style={headingFont}>{l(L.sarosSeriesTitle)}</h4>
          <p>{l(L.sarosSeries1)}</p>
          <p>{l(L.sarosSeries2)}</p>

          {/* Saros lifecycle diagram */}
          <div className="border border-gold-primary/10 rounded-xl p-4 bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
            <div className="text-gold-dark text-xs uppercase tracking-wider font-bold mb-3">{isHi ? 'सारोस श्रृंखला का जीवन चक्र (~1,200-1,500 वर्ष)' : 'Lifecycle of a Saros Series (~1,200-1,500 years)'}</div>
            <div className="flex items-center gap-1 text-[10px]">
              <div className="flex-1 h-3 rounded-l-full bg-gradient-to-r from-transparent to-amber-500/30" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/30 to-amber-500/60" />
              <div className="flex-1 h-3 bg-amber-500/60" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/60 to-red-500/70" />
              <div className="flex-1 h-3 bg-red-500/70" />
              <div className="flex-1 h-3 bg-gradient-to-r from-red-500/70 to-amber-500/60" />
              <div className="flex-1 h-3 bg-gradient-to-r from-amber-500/60 to-amber-500/30" />
              <div className="flex-1 h-3 rounded-r-full bg-gradient-to-r from-amber-500/30 to-transparent" />
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-text-secondary/50">
              <span>{isHi ? 'शुरू: छोटे आंशिक (ध्रुव)' : 'Start: Small partials (pole)'}</span>
              <span className="text-red-400">{isHi ? 'चरम: पूर्ण/वलयाकार (भूमध्य)' : 'Peak: Total/Annular (equator)'}</span>
              <span>{isHi ? 'अंत: छोटे आंशिक (विपरीत ध्रुव)' : 'End: Small partials (opp. pole)'}</span>
            </div>
            <div className="text-center text-text-secondary/40 text-[9px] mt-1">70-85 {isHi ? 'ग्रहण प्रति श्रृंखला' : 'eclipses per series'}</div>
          </div>

          {/* Series stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              { value: '~80', label: { en: 'Active Series (any time)', hi: 'सक्रिय श्रृंखलाएँ (किसी भी समय)' }, color: 'text-blue-300' },
              { value: '70-85', label: { en: 'Eclipses per Series', hi: 'ग्रहण प्रति श्रृंखला' }, color: 'text-emerald-400' },
              { value: '1,200-1,500y', label: { en: 'Series Lifespan', hi: 'श्रृंखला जीवनकाल' }, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{l(stat.label)}</div>
              </div>
            ))}
          </div>

          {/* Nodal Precession */}
          <h4 className="text-lg font-bold text-gold-light mt-4" style={headingFont}>{l(L.sarosNodePrecession)}</h4>
          <p>{l(L.sarosNodePrec1)}</p>
          <p>{l(L.sarosNodePrec2)}</p>

          {/* Nodal precession stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: '18.6y', label: { en: 'Full Nodal Cycle', hi: 'पूर्ण पात चक्र' }, color: 'text-gold-light' },
              { value: '~1.5y', label: { en: 'Per Sign', hi: 'प्रति राशि' }, color: 'text-violet-400' },
              { value: '~19d', label: { en: 'Annual Shift', hi: 'वार्षिक विचलन' }, color: 'text-blue-300' },
              { value: '~3°/month', label: { en: 'Rahu Speed', hi: 'राहु गति' }, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-3 border border-gold-primary/10 rounded-xl bg-gradient-to-br from-[#2d1b69]/20 to-[#0a0e27]">
                <div className={`text-xl font-bold font-mono mb-0.5 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/60 text-[10px]" style={bodyFont}>{l(stat.label)}</div>
              </div>
            ))}
          </div>

          {/* ══ WORKED EXAMPLES ══ */}
          <h4 className="text-lg font-bold text-gold-light mt-6" style={headingFont}>{l(L.sarosExampleTitle)}</h4>
          <p className="text-sm">{l(L.sarosExample1)}</p>

          {/* Solar: Saros 126 chain */}
          <div className="border border-amber-500/15 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-amber-500/5 border-b border-amber-500/10">
              <span className="text-amber-300 font-bold text-sm">{isHi ? 'सारोस 126 — पूर्ण सूर्य ग्रहण श्रृंखला' : 'Saros 126 — Total Solar Eclipse Chain'}</span>
            </div>
            <div className="divide-y divide-gold-primary/5">
              {[
                { date: 'Jul 22, 1990', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'फिनलैण्ड → साइबेरिया → प्रशान्त' : 'Finland → Siberia → Pacific', mag: '1.039', highlight: false },
                { date: 'Aug 1, 2008', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'कनाडा → आर्कटिक → साइबेरिया → चीन' : 'Canada → Arctic → Siberia → China', mag: '1.039', highlight: false },
                { date: 'Aug 12, 2026', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'आर्कटिक → ग्रीनलैण्ड → आइसलैण्ड → स्पेन' : 'Arctic → Greenland → Iceland → Spain', mag: '1.039', highlight: true },
                { date: 'Aug 24, 2044', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'कनाडा → मोन्टाना → उत्तरी डकोटा' : 'Canada → Montana → N. Dakota', mag: '1.036', highlight: false },
                { date: 'Sep 3, 2062', type: isHi ? 'पूर्ण' : 'Total', path: isHi ? 'इण्डोनेशिया → ऑस्ट्रेलिया' : 'Indonesia → Australia', mag: '1.031', highlight: false },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-2.5 text-sm ${row.highlight ? 'bg-amber-500/8' : ''}`}>
                  <span className={`font-mono text-xs w-28 shrink-0 ${row.highlight ? 'text-gold-light font-bold' : 'text-text-secondary/70'}`}>{row.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${row.highlight ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-amber-500/5 text-amber-400/60 border-amber-500/10'}`}>{row.type}</span>
                  <span className="text-text-secondary/70 text-xs flex-1" style={bodyFont}>{row.path}</span>
                  <span className="font-mono text-xs text-text-secondary/50">{row.mag}</span>
                  {row.highlight && <span className="text-[9px] text-gold-light font-bold">← {isHi ? 'अगला!' : 'NEXT!'}</span>}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-amber-500/3 text-[10px] text-text-secondary/40">
              {isHi ? 'प्रत्येक ग्रहण के बीच: +18 वर्ष 11 दिन 8 घण्टे। पथ ~120° पश्चिम खिसकता है।' : 'Between each: +18 years 11 days 8 hours. Path shifts ~120° westward.'}
            </div>
          </div>

          <p className="text-sm">{l(L.sarosExample2)}</p>

          {/* Lunar: Saros 133 chain */}
          <p className="text-sm mt-2">{l(L.sarosLunarExample)}</p>
          <div className="border border-indigo-500/15 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-indigo-500/5 border-b border-indigo-500/10">
              <span className="text-indigo-300 font-bold text-sm">{isHi ? 'सारोस 133 — पूर्ण चन्द्र ग्रहण श्रृंखला' : 'Saros 133 — Total Lunar Eclipse Chain'}</span>
            </div>
            <div className="divide-y divide-gold-primary/5">
              {[
                { date: 'Feb 9, 1990', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'यूरोप, अफ्रीका, एशिया' : 'Europe, Africa, Asia', mag: '1.073', highlight: false },
                { date: 'Feb 20, 2008', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप, अफ्रीका' : 'Americas, Europe, Africa', mag: '1.107', highlight: false },
                { date: 'Mar 3, 2026', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप, अफ्रीका' : 'Americas, Europe, Africa', mag: '1.151', highlight: true },
                { date: 'Mar 14, 2044', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'एशिया, ऑस्ट्रेलिया, प्रशान्त' : 'Asia, Australia, Pacific', mag: '1.193', highlight: false },
                { date: 'Mar 25, 2062', type: isHi ? 'पूर्ण' : 'Total', region: isHi ? 'अमेरिका, यूरोप' : 'Americas, Europe', mag: '1.227', highlight: false },
              ].map((row, i) => (
                <div key={i} className={`flex items-center gap-4 px-4 py-2.5 text-sm ${row.highlight ? 'bg-indigo-500/8' : ''}`}>
                  <span className={`font-mono text-xs w-28 shrink-0 ${row.highlight ? 'text-indigo-300 font-bold' : 'text-text-secondary/70'}`}>{row.date}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border shrink-0 ${row.highlight ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25' : 'bg-indigo-500/5 text-indigo-400/60 border-indigo-500/10'}`}>{row.type}</span>
                  <span className="text-text-secondary/70 text-xs flex-1" style={bodyFont}>{row.region}</span>
                  <span className="font-mono text-xs text-text-secondary/50">{row.mag}</span>
                  {row.highlight && <span className="text-[9px] text-indigo-300 font-bold">← {isHi ? 'अगला!' : 'NEXT!'}</span>}
                </div>
              ))}
            </div>
            <div className="px-4 py-2 bg-indigo-500/3 text-[10px] text-text-secondary/40">
              {isHi ? 'परिमाण बढ़ रहा है (1.073 → 1.227) — यह श्रृंखला अपने चरम की ओर है!' : 'Magnitude is increasing (1.073 → 1.227) — this series is heading toward its peak!'}
            </div>
          </div>

          {/* Eclipse Seasons */}
          <h4 className="text-lg font-bold text-gold-light mt-6" style={headingFont}>{l(L.sarosSeasonTitle)}</h4>
          <p className="text-sm">{l(L.sarosSeason1)}</p>

          {/* Eclipse season shift table */}
          <div className="border border-gold-primary/10 rounded-xl overflow-hidden">
            <div className="px-4 py-2 bg-gold-primary/5 border-b border-gold-primary/10">
              <span className="text-gold-light font-bold text-sm">{isHi ? 'ग्रहण ऋतु विचलन (पात पुरस्सरण के कारण)' : 'Eclipse Season Drift (due to Nodal Precession)'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gold-primary/10 bg-gold-primary/3">
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'वर्ष' : 'Year'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'ऋतु 1' : 'Season 1'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'ऋतु 2' : 'Season 2'}</th>
                    <th className="text-left px-4 py-2 text-gold-dark font-bold">{isHi ? 'राहु राशि' : 'Rahu Sign'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-primary/5">
                  {[
                    { year: '2024', s1: 'Mar-Apr', s2: 'Sep-Oct', rahu: isHi ? 'मीन' : 'Pisces', current: false },
                    { year: '2025', s1: 'Mar', s2: 'Sep', rahu: isHi ? 'मीन' : 'Pisces', current: false },
                    { year: '2026', s1: 'Feb-Mar', s2: 'Aug', rahu: isHi ? 'मीन → कुम्भ' : 'Pisces → Aquarius', current: true },
                    { year: '2028', s1: 'Jan', s2: 'Jul', rahu: isHi ? 'कुम्भ' : 'Aquarius', current: false },
                    { year: '2030', s1: 'Jun', s2: 'Nov-Dec', rahu: isHi ? 'मकर → धनु' : 'Capricorn → Sagittarius', current: false },
                    { year: '2033', s1: 'Mar-Apr', s2: 'Sep-Oct', rahu: isHi ? 'वृश्चिक' : 'Scorpio', current: false },
                    { year: '2035', s1: 'Mar', s2: 'Sep', rahu: isHi ? 'तुला → कन्या' : 'Libra → Virgo', current: false },
                  ].map((row, i) => (
                    <tr key={i} className={row.current ? 'bg-gold-primary/5' : ''}>
                      <td className={`px-4 py-2 font-mono ${row.current ? 'text-gold-light font-bold' : 'text-text-secondary/70'}`}>
                        {row.year} {row.current && <span className="text-[9px] text-gold-primary">← {isHi ? 'अभी' : 'NOW'}</span>}
                      </td>
                      <td className="px-4 py-2 text-text-secondary/70">{row.s1}</td>
                      <td className="px-4 py-2 text-text-secondary/70">{row.s2}</td>
                      <td className="px-4 py-2 text-violet-400/70" style={bodyFont}>{row.rahu}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-2 bg-gold-primary/3 text-[10px] text-text-secondary/40">
              {isHi ? 'ग्रहण ऋतुएँ प्रत्येक वर्ष ~19 दिन पहले खिसकती हैं। राहु हर ~1.5 वर्ष में नई राशि में प्रवेश करता है।' : 'Eclipse seasons shift ~19 days earlier each year. Rahu enters a new sign every ~1.5 years.'}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══ 9. The 4 Eclipse Types — Node × Type Matrix ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl sm:text-2xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.nodeMatrixTitle)}
        </h3>
        <div className="text-text-secondary text-base leading-relaxed space-y-5" style={bodyFont}>
          <p>{l(L.nodeMatrixIntro)}</p>

          {/* 2×2 Matrix Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Rahu Solar */}
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/10 flex items-center gap-2">
                <span className="text-lg">☊</span>
                <span className="text-amber-300 font-bold text-sm" style={headingFont}>{l(L.rahuSolar)}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {l(L.rahuSolarDesc)}
              </div>
              <div className="px-4 py-2 bg-amber-500/3 border-t border-amber-500/8">
                <div className="text-[10px] text-amber-400/60 font-mono">
                  {isHi ? 'स्वरूप: महत्वाकांक्षा, भ्रम, भौतिक उथल-पुथल' : 'Nature: Ambition, illusion, material upheaval'}
                </div>
              </div>
            </div>

            {/* Ketu Solar */}
            <div className="border border-violet-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-violet-500/8 border-b border-violet-500/10 flex items-center gap-2">
                <span className="text-lg">☋</span>
                <span className="text-violet-300 font-bold text-sm" style={headingFont}>{l(L.ketuSolar)}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {l(L.ketuSolarDesc)}
              </div>
              <div className="px-4 py-2 bg-violet-500/3 border-t border-violet-500/8">
                <div className="text-[10px] text-violet-400/60 font-mono">
                  {isHi ? 'स्वरूप: वैराग्य, कर्म परिपाक, आध्यात्मिक जागृति' : 'Nature: Detachment, karmic reckoning, spiritual awakening'}
                </div>
              </div>
            </div>

            {/* Rahu Lunar */}
            <div className="border border-amber-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-amber-500/8 border-b border-amber-500/10 flex items-center gap-2">
                <span className="text-lg">☊</span>
                <span className="text-amber-300 font-bold text-sm" style={headingFont}>{l(L.rahuLunar)}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {l(L.rahuLunarDesc)}
              </div>
              <div className="px-4 py-2 bg-amber-500/3 border-t border-amber-500/8">
                <div className="text-[10px] text-amber-400/60 font-mono">
                  {isHi ? 'स्वरूप: भावनात्मक भ्रम, सामूहिक चिन्ता, मानसिक जागृति' : 'Nature: Emotional illusion, mass anxiety, psychic awakening'}
                </div>
              </div>
            </div>

            {/* Ketu Lunar */}
            <div className="border border-red-500/20 rounded-xl overflow-hidden">
              <div className="px-4 py-2.5 bg-red-500/8 border-b border-red-500/10 flex items-center gap-2">
                <span className="text-lg">☋</span>
                <span className="text-red-300 font-bold text-sm" style={headingFont}>{l(L.ketuLunar)}</span>
              </div>
              <div className="px-4 py-3 text-xs leading-relaxed text-text-secondary/80" style={bodyFont}>
                {l(L.ketuLunarDesc)}
              </div>
              <div className="px-4 py-2 bg-red-500/3 border-t border-red-500/8">
                <div className="text-[10px] text-red-400/60 font-mono">
                  {isHi ? 'स्वरूप: पूर्वज कर्म, शोक, मोक्ष, सर्वाधिक आध्यात्मिक' : 'Nature: Ancestral karma, grief, moksha, most spiritual of all 4'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick reference table */}
          <div className="border border-gold-primary/10 rounded-xl overflow-hidden mt-2">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gold-primary/10 bg-gold-primary/3">
                  <th className="text-left px-4 py-2 text-gold-dark font-bold"></th>
                  <th className="text-left px-4 py-2 text-amber-400 font-bold">☊ {isHi ? 'राहु पर' : 'At Rahu'}</th>
                  <th className="text-left px-4 py-2 text-violet-400 font-bold">☋ {isHi ? 'केतु पर' : 'At Ketu'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-primary/5">
                <tr>
                  <td className="px-4 py-2.5 text-amber-300 font-bold">☀ {isHi ? 'सूर्य' : 'Solar'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'सत्ता उथल-पुथल, भ्रम, विदेश प्रभाव' : 'Power upheaval, deception, foreign influence'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'अहंकार पतन, कर्म परिपाक, आध्यात्मिक मोड़' : 'Ego fall, karmic reckoning, spiritual turning point'}</td>
                </tr>
                <tr>
                  <td className="px-4 py-2.5 text-indigo-300 font-bold">☽ {isHi ? 'चन्द्र' : 'Lunar'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'सामूहिक भय, मानसिक धुंध, इच्छा-प्रेरित भ्रम' : 'Mass fear, mental fog, desire-driven illusion'}</td>
                  <td className="px-4 py-2.5 text-text-secondary/70" style={bodyFont}>{isHi ? 'पूर्वज कर्म सतह पर, शोक, मोक्ष, रक्त चन्द्र' : 'Ancestral karma surfaces, grief, moksha, Blood Moon'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="text-text-secondary/50 text-xs italic">{l(L.nodeMatrixNote)}</p>
        </div>
      </motion.section>

      {/* ═══ 10. Cross References ═══ */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-6 sm:p-8"
      >
        <h3 className="text-xl font-bold text-gold-gradient mb-4" style={headingFont}>
          {l(L.crossRef)}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {CROSS_REFS.map((ref, i) => (
            <Link
              key={i}
              href={ref.href as '/'}
              className="flex flex-col gap-1 p-4 border border-gold-primary/15 rounded-xl hover:border-gold-primary/35 hover:bg-gold-primary/5 transition-all group"
            >
              <span className="text-gold-light font-semibold text-sm group-hover:text-gold-primary transition-colors" style={headingFont}>
                {l(ref.label)}
              </span>
              <span className="text-text-secondary/70 text-xs" style={bodyFont}>{l(ref.desc)}</span>
            </Link>
          ))}
        </div>
        <Link
          href="/eclipses"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gold-primary/15 hover:bg-gold-primary/25 border border-gold-primary/30 hover:border-gold-primary/50 text-gold-light rounded-xl text-sm font-semibold transition-all"
          style={headingFont}
        >
          {l(L.viewCalendar)} →
        </Link>
      </motion.section>
    </div>
  );
}

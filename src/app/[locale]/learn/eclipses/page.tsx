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
  sarosTitle: { en: 'The Saros Cycle',                                        hi: 'सारोस चक्र' },
  saros1: {
    en: 'Ancient astronomers — both Babylonian and Indian — discovered that eclipses repeat in a cycle of approximately 18 years, 11 days, and 8 hours (6,585.32 days). This is the Saros cycle. After one Saros, the Sun, Moon, and lunar nodes return to nearly the same relative geometry, producing an eclipse that is similar in type and magnitude to its predecessor.',
    hi: 'प्राचीन खगोलविदों — बेबीलोनियाई और भारतीय दोनों — ने पाया कि ग्रहण लगभग 18 वर्ष, 11 दिन और 8 घण्टे (6,585.32 दिन) के एक चक्र में दोहराते हैं। यह सारोस चक्र है। एक सारोस के बाद, सूर्य, चन्द्रमा और चन्द्र पात लगभग उसी सापेक्ष ज्यामिति में वापस आते हैं।',
  },
  saros2: {
    en: 'The extra 8 hours means the repeat eclipse occurs 120° further west on Earth\'s surface — so after three Saros cycles (54 years, 34 days — the Exeligmos), an eclipse returns to nearly the same longitude. Each eclipse belongs to a Saros series, numbered from 1 to ~180 active series at any time. Our eclipse engine identifies the Saros series number for every eclipse it computes.',
    hi: 'अतिरिक्त 8 घण्टे का अर्थ है कि अगला ग्रहण पृथ्वी की सतह पर 120° पश्चिम में होता है — इसलिए तीन सारोस चक्रों (54 वर्ष, 34 दिन — एक्सेलिग्मोस) के बाद, ग्रहण लगभग उसी देशान्तर पर वापस आता है। प्रत्येक ग्रहण एक सारोस श्रृंखला से सम्बन्धित है, किसी भी समय ~180 सक्रिय श्रृंखलाओं में से।',
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
        <div className="text-text-secondary text-base leading-relaxed space-y-4" style={bodyFont}>
          <p>{l(L.saros1)}</p>
          <p>{l(L.saros2)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            {[
              { value: '18y 11d 8h', label: { en: 'Saros Cycle Length', hi: 'सारोस चक्र अवधि' }, color: 'text-gold-light' },
              { value: '54y 34d', label: { en: 'Exeligmos (3× Saros)', hi: 'एक्सेलिग्मोस (3× सारोस)' }, color: 'text-violet-400' },
              { value: '~180', label: { en: 'Active Saros Series', hi: 'सक्रिय सारोस श्रृंखलाएँ' }, color: 'text-blue-300' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-4 border border-gold-primary/10 rounded-xl bg-bg-primary/30">
                <div className={`text-2xl font-bold font-mono mb-1 ${stat.color}`}>{stat.value}</div>
                <div className="text-text-secondary/70 text-xs" style={bodyFont}>{l(stat.label)}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ═══ 9. Cross References ═══ */}
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

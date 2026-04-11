'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_23_1', phase: 10, topic: 'Prediction', moduleNumber: '23.1',
  title: { en: 'Eclipse Prediction — When Sun, Moon & Nodes Align', hi: 'ग्रहण भविष्यवाणी — जब सूर्य, चन्द्र और राहु-केतु एक रेखा में आएँ' },
  subtitle: { en: 'Understanding the mechanics and astrological significance of solar and lunar eclipses', hi: 'सूर्य और चन्द्र ग्रहणों की यांत्रिकी और ज्योतिषीय महत्व को समझना' },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 23.2: Retrograde & Combustion', hi: 'मॉड्यूल 23.2: वक्री और अस्त' }, href: '/learn/modules/23-2' },
    { label: { en: 'Module 23.3: Chakra Systems', hi: 'मॉड्यूल 23.3: चक्र प्रणालियाँ' }, href: '/learn/modules/23-3' },
    { label: { en: 'Module 12.3: Rahu-Ketu Axis', hi: 'मॉड्यूल 12.3: राहु-केतु अक्ष' }, href: '/learn/modules/12-3' },
    { label: { en: 'Eclipse Calendar', hi: 'ग्रहण पंचांग' }, href: '/panchang/grahan' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q23_1_01', type: 'mcq',
    question: { en: 'What astronomical condition is required for a solar eclipse?', hi: 'सूर्य ग्रहण के लिए कौन सी खगोलीय स्थिति आवश्यक है?' },
    options: [
      { en: 'Full Moon near a node', hi: 'राहु-केतु के निकट पूर्णिमा' },
      { en: 'New Moon near a node', hi: 'राहु-केतु के निकट अमावस्या' },
      { en: 'Half Moon near a node', hi: 'राहु-केतु के निकट अर्ध चन्द्र' },
      { en: 'Any Moon phase near a node', hi: 'राहु-केतु के निकट कोई भी चन्द्र कला' },
    ],
    correctAnswer: 1,
    explanation: { en: 'A solar eclipse occurs when the Moon passes between the Sun and Earth at New Moon (Amavasya), but only when the New Moon occurs near Rahu or Ketu (within ~15° of a node). The Moon blocks the Sun\'s light from reaching Earth.', hi: 'सूर्य ग्रहण तब होता है जब चन्द्रमा अमावस्या पर सूर्य और पृथ्वी के बीच से गुजरता है, लेकिन केवल तब जब अमावस्या राहु या केतु के निकट (नोड से ~15° के भीतर) हो। चन्द्रमा सूर्य के प्रकाश को पृथ्वी तक पहुँचने से रोकता है।' },
  },
  {
    id: 'q23_1_02', type: 'mcq',
    question: { en: 'What is the Saros cycle?', hi: 'सैरोस चक्र क्या है?' },
    options: [
      { en: 'A 12-year cycle of Jupiter transits', hi: 'बृहस्पति गोचर का 12 वर्षीय चक्र' },
      { en: 'A cycle of eclipses repeating every ~18 years, 11 days, 8 hours', hi: 'लगभग 18 वर्ष, 11 दिन, 8 घण्टे में दोहराने वाला ग्रहण चक्र' },
      { en: 'A 30-year Saturn return cycle', hi: '30 वर्षीय शनि वापसी चक्र' },
      { en: 'A monthly lunar cycle of 29.5 days', hi: '29.5 दिनों का मासिक चान्द्र चक्र' },
    ],
    correctAnswer: 1,
    explanation: { en: 'The Saros cycle is a period of approximately 18 years, 11 days, and 8 hours (223 synodic months) after which eclipses repeat in a similar pattern. This was known to ancient Babylonian astronomers and is still used in eclipse prediction.', hi: 'सैरोस चक्र लगभग 18 वर्ष, 11 दिन और 8 घण्टे (223 सिनोडिक मास) की अवधि है जिसके बाद ग्रहण समान पैटर्न में दोहराते हैं। यह प्राचीन बेबीलोनी खगोलविदों को ज्ञात था और आज भी ग्रहण भविष्यवाणी में उपयोग किया जाता है।' },
  },
  {
    id: 'q23_1_03', type: 'true_false',
    question: { en: 'A lunar eclipse occurs at New Moon when the Earth is between the Sun and Moon.', hi: 'चन्द्र ग्रहण अमावस्या पर होता है जब पृथ्वी सूर्य और चन्द्रमा के बीच होती है।' },
    correctAnswer: false,
    explanation: { en: 'A lunar eclipse occurs at Full Moon (Purnima), not New Moon. At Full Moon, the Earth is between the Sun and Moon, and Earth\'s shadow falls on the Moon. At New Moon, it\'s a solar eclipse (Moon between Sun and Earth).', hi: 'चन्द्र ग्रहण पूर्णिमा पर होता है, अमावस्या पर नहीं। पूर्णिमा पर पृथ्वी सूर्य और चन्द्रमा के बीच होती है, और पृथ्वी की छाया चन्द्रमा पर पड़ती है। अमावस्या पर सूर्य ग्रहण होता है (चन्द्रमा सूर्य और पृथ्वी के बीच)।' },
  },
  {
    id: 'q23_1_04', type: 'mcq',
    question: { en: 'How many eclipses typically occur per year?', hi: 'आमतौर पर प्रति वर्ष कितने ग्रहण होते हैं?' },
    options: [
      { en: '1-2 eclipses', hi: '1-2 ग्रहण' },
      { en: '4-7 eclipses', hi: '4-7 ग्रहण' },
      { en: '10-12 eclipses', hi: '10-12 ग्रहण' },
      { en: 'Exactly 2 eclipses', hi: 'ठीक 2 ग्रहण' },
    ],
    correctAnswer: 1,
    explanation: { en: 'There are typically 4-7 eclipses per year (a mix of solar and lunar), though only 2-3 may be visible from any given location. The minimum is 2 solar eclipses per year; the maximum total (solar + lunar) is 7.', hi: 'आमतौर पर प्रति वर्ष 4-7 ग्रहण होते हैं (सूर्य और चन्द्र ग्रहणों का मिश्रण), हालाँकि किसी भी स्थान से केवल 2-3 दिखाई दे सकते हैं। न्यूनतम 2 सूर्य ग्रहण प्रति वर्ष; अधिकतम कुल (सूर्य + चन्द्र) 7 है।' },
  },
  {
    id: 'q23_1_05', type: 'mcq',
    question: { en: 'For a lunar eclipse to be possible, the Sun-Rahu angular distance at Full Moon must be within approximately:', hi: 'चन्द्र ग्रहण सम्भव होने के लिए, पूर्णिमा पर सूर्य-राहु कोणीय दूरी लगभग कितनी होनी चाहिए?' },
    options: [
      { en: '5°', hi: '5°' },
      { en: '10°', hi: '10°' },
      { en: '18°', hi: '18°' },
      { en: '30°', hi: '30°' },
    ],
    correctAnswer: 2,
    explanation: { en: 'For a lunar eclipse, the Sun must be within approximately 18° of a lunar node (Rahu or Ketu) at the time of Full Moon. For a solar eclipse, the threshold is tighter at about 15° at New Moon.', hi: 'चन्द्र ग्रहण के लिए, पूर्णिमा के समय सूर्य को चन्द्र नोड (राहु या केतु) से लगभग 18° के भीतर होना चाहिए। सूर्य ग्रहण के लिए, सीमा अमावस्या पर लगभग 15° पर अधिक कड़ी है।' },
  },
  {
    id: 'q23_1_06', type: 'true_false',
    question: { en: 'A solar eclipse on your natal Moon is considered auspicious and indicates a period of emotional stability.', hi: 'आपके जन्म चन्द्रमा पर सूर्य ग्रहण शुभ माना जाता है और भावनात्मक स्थिरता की अवधि दर्शाता है।' },
    correctAnswer: false,
    explanation: { en: 'A solar eclipse on the natal Moon is considered a significant transit that typically indicates emotional upheaval, inner transformation, or disruption in mental peace for approximately 6 months. It activates karmic patterns related to the Moon\'s house and sign.', hi: 'जन्म चन्द्रमा पर सूर्य ग्रहण एक महत्वपूर्ण गोचर माना जाता है जो आमतौर पर लगभग 6 महीनों के लिए भावनात्मक उथल-पुथल, आन्तरिक परिवर्तन, या मानसिक शान्ति में व्यवधान दर्शाता है। यह चन्द्रमा के भाव और राशि से सम्बन्धित कार्मिक प्रतिमानों को सक्रिय करता है।' },
  },
  {
    id: 'q23_1_07', type: 'mcq',
    question: { en: 'What is "Grahan Dosha" in Vedic astrology?', hi: 'वैदिक ज्योतिष में "ग्रहण दोष" क्या है?' },
    options: [
      { en: 'A yoga formed by benefics in Kendras', hi: 'केन्द्रों में शुभ ग्रहों द्वारा बनने वाला योग' },
      { en: 'A karmic pattern from being born during an eclipse', hi: 'ग्रहण के दौरान जन्म लेने से उत्पन्न कार्मिक प्रतिमान' },
      { en: 'A dosha caused by Mars in the 7th house', hi: 'सप्तम भाव में मंगल से उत्पन्न दोष' },
      { en: 'A condition where all planets are retrograde', hi: 'जहाँ सभी ग्रह वक्री हों ऐसी स्थिति' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Grahan Dosha is the astrological condition of being born during an eclipse. The luminaries (Sun or Moon) conjunct Rahu or Ketu within tight orbs in the birth chart. It indicates specific karmic patterns and challenges related to identity (solar) or emotions (lunar).', hi: 'ग्रहण दोष ग्रहण के दौरान जन्म लेने की ज्योतिषीय स्थिति है। ज्योति पिण्ड (सूर्य या चन्द्रमा) जन्म कुण्डली में राहु या केतु के साथ कड़े ओर्ब में युक्त होते हैं। यह पहचान (सौर) या भावनाओं (चान्द्र) से सम्बन्धित विशिष्ट कार्मिक प्रतिमान और चुनौतियाँ दर्शाता है।' },
  },
  {
    id: 'q23_1_08', type: 'true_false',
    question: { en: 'The "eclipse season" — the 2-week window around each eclipse — is traditionally considered auspicious for starting new ventures.', hi: '"ग्रहण काल" — प्रत्येक ग्रहण के आसपास 2 सप्ताह की अवधि — परम्परागत रूप से नये कार्य शुरू करने के लिए शुभ माना जाता है।' },
    correctAnswer: false,
    explanation: { en: 'The eclipse season is traditionally considered inauspicious for beginnings (marriage, business launch, house purchase, etc.). The disrupted energy of eclipses is seen as destabilizing. However, eclipses are excellent for endings, closure, and deep inner work.', hi: 'ग्रहण काल परम्परागत रूप से नये कार्यों (विवाह, व्यापार शुरू करना, गृह खरीद आदि) के लिए अशुभ माना जाता है। ग्रहणों की बाधित ऊर्जा अस्थिर करने वाली देखी जाती है। हालाँकि, ग्रहण समाप्ति, पूर्णता और गहन आन्तरिक कार्य के लिए उत्कृष्ट हैं।' },
  },
  {
    id: 'q23_1_09', type: 'mcq',
    question: { en: 'An eclipse in which house is associated with career changes?', hi: 'किस भाव में ग्रहण कैरियर परिवर्तन से सम्बद्ध है?' },
    options: [
      { en: '4th house', hi: 'चतुर्थ भाव' },
      { en: '7th house', hi: 'सप्तम भाव' },
      { en: '10th house', hi: 'दशम भाव' },
      { en: '12th house', hi: 'द्वादश भाव' },
    ],
    correctAnswer: 2,
    explanation: { en: 'The 10th house rules career, public reputation, and authority. An eclipse transiting through the 10th house activates major career changes — promotion, job change, shift in professional direction, or changes in public standing. Effects last approximately 6 months.', hi: 'दशम भाव कैरियर, सार्वजनिक प्रतिष्ठा और अधिकार का शासक है। दशम भाव से गुजरता ग्रहण प्रमुख कैरियर परिवर्तनों को सक्रिय करता है — पदोन्नति, नौकरी परिवर्तन, व्यावसायिक दिशा में बदलाव, या सार्वजनिक स्थिति में परिवर्तन। प्रभाव लगभग 6 महीने तक रहता है।' },
  },
  {
    id: 'q23_1_10', type: 'mcq',
    question: { en: 'Our eclipse prediction engine checks which condition at each lunation?', hi: 'हमारा ग्रहण भविष्यवाणी इंजन प्रत्येक ल्यूनेशन पर कौन सी स्थिति जाँचता है?' },
    options: [
      { en: 'Moon\'s speed relative to the Sun', hi: 'सूर्य के सापेक्ष चन्द्रमा की गति' },
      { en: 'Sun-Rahu proximity at each New/Full Moon', hi: 'प्रत्येक अमावस्या/पूर्णिमा पर सूर्य-राहु समीपता' },
      { en: 'Jupiter\'s aspect on the Moon', hi: 'चन्द्रमा पर बृहस्पति की दृष्टि' },
      { en: 'Saturn\'s transit through nakshatras', hi: 'नक्षत्रों से शनि का गोचर' },
    ],
    correctAnswer: 1,
    explanation: { en: 'Our engine computes the angular distance between the Sun and Rahu (the ascending node) at every New Moon and Full Moon. If the distance is less than ~15° at New Moon → possible solar eclipse; less than ~18° at Full Moon → possible lunar eclipse.', hi: 'हमारा इंजन प्रत्येक अमावस्या और पूर्णिमा पर सूर्य और राहु (उत्तरी नोड) के बीच कोणीय दूरी की गणना करता है। यदि अमावस्या पर दूरी ~15° से कम → सम्भावित सूर्य ग्रहण; पूर्णिमा पर ~18° से कम → सम्भावित चन्द्र ग्रहण।' },
  },
];

/* ─── Page 1: Eclipse Mechanics ────────────────────────────────────────── */

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहण यांत्रिकी — सूर्य, चन्द्र और राहु-केतु' : 'Eclipse Mechanics — Sun, Moon & Nodes'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण तब होते हैं जब सूर्य और चन्द्रमा राहु-केतु अक्ष के निकट होते हैं — वे दो बिन्दु जहाँ चन्द्रमा का कक्षीय तल क्रान्तिवृत्त को काटता है। यह अक्ष कोई भौतिक वस्तु नहीं बल्कि एक ज्यामितीय बिन्दु है, और प्राचीन भारतीय खगोलविदों ने दूरबीनों के अस्तित्व से हजारों वर्ष पहले इसके महत्व को पहचान लिया था।</> : <>Eclipses occur when the Sun and Moon are near the Rahu-Ketu axis — the two points where the Moon&apos;s orbital plane intersects the ecliptic. This axis is not a physical object but a geometrical point, and ancient Indian astronomers recognized its importance thousands of years before telescopes existed.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'सूर्य ग्रहण' : 'Solar Eclipse (Surya Grahan)'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>अमावस्या पर होता है जब चन्द्रमा सूर्य और पृथ्वी के बीच से गुजरता है। चन्द्रमा सूर्य के प्रकाश को रोकता है। यह केवल तब होता है जब अमावस्या राहु या केतु से लगभग 15° के भीतर हो। प्रकार: पूर्ण (चन्द्रमा सूर्य को पूरी तरह ढकता है), वलयाकार (चन्द्रमा थोड़ा छोटा, एक वलय बनाता है), आंशिक (आंशिक आच्छादन)।</> : <>Occurs at New Moon (Amavasya) when the Moon passes between the Sun and Earth. The Moon blocks the Sun&apos;s light. This only happens when the New Moon is within approximately 15° of Rahu or Ketu. Types: total (Moon fully covers Sun), annular (Moon slightly smaller, creating a ring), partial (partial coverage).</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'चन्द्र ग्रहण' : 'Lunar Eclipse (Chandra Grahan)'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>पूर्णिमा पर होता है जब पृथ्वी सूर्य और चन्द्रमा के बीच आती है। पृथ्वी की छाया चन्द्रमा पर पड़ती है। पूर्णिमा का नोड से लगभग 18° के भीतर होना आवश्यक है। व्यापक सीमा (सूर्य ग्रहण के 15° की तुलना में) इसलिए है क्योंकि पृथ्वी की छाया चन्द्रमा से बड़ी है। चन्द्र ग्रहण पृथ्वी के सम्पूर्ण रात्रि पक्ष से दिखाई देते हैं।</> : <>Occurs at Full Moon (Purnima) when the Earth passes between the Sun and Moon. Earth&apos;s shadow falls on the Moon. Requires the Full Moon to be within approximately 18° of a node. The wider threshold (vs. 15° for solar) is because Earth&apos;s shadow is larger than the Moon&apos;s. Lunar eclipses are visible from the entire nightside of Earth.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'ग्रहण आवृत्ति' : 'Eclipse Frequency'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>विश्व भर में प्रति वर्ष लगभग 4-7 ग्रहण होते हैं — सूर्य और चन्द्र का मिश्रण। हालाँकि, किसी भी स्थान से आमतौर पर केवल 2-3 दिखाई देते हैं। ग्रहण लगभग 6 महीने के अन्तराल पर &quot;ऋतुओं&quot; में आते हैं, जब सूर्य नोडल अक्ष के निकट होता है। प्रत्येक ऋतु कुछ सप्ताहों में 2-3 ग्रहण उत्पन्न करती है।</> : <>There are approximately 4-7 eclipses per year globally — a mix of solar and lunar. However, only 2-3 are typically visible from any given location. Eclipses come in &quot;seasons&quot; about 6 months apart, when the Sun is near the nodal axis. Each season produces 2-3 eclipses within a few weeks.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'हर अमावस्या/पूर्णिमा पर क्यों नहीं?' : 'Why Not Every New/Full Moon?'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>चन्द्रमा की कक्षा क्रान्तिवृत्त (सूर्य के दृश्य पथ) से लगभग 5° झुकी हुई है। इसलिए अधिकांश अमावस्या और पूर्णिमा पर, चन्द्रमा सूर्य के तल के ऊपर या नीचे से गुजरता है — कोई संरेखण नहीं, कोई ग्रहण नहीं। केवल जब कोई ल्यूनेशन चन्द्रमा के अपने दो नोड्स (राहु या केतु) में से किसी एक के निकट होने से मेल खाता है, तब संरेखण ग्रहण के लिए पर्याप्त निकट होता है।</> : <>The Moon&apos;s orbit is tilted about 5° relative to the ecliptic (the Sun&apos;s apparent path). So at most New and Full Moons, the Moon passes above or below the Sun&apos;s plane — no alignment, no eclipse. Only when a lunation coincides with the Moon being near one of its two nodes (Rahu or Ketu) does the alignment become close enough for an eclipse.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 2: Prediction Algorithm & Saros Cycle ───────────────────────── */

function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहण भविष्यवाणी एल्गोरिदम' : 'Eclipse Prediction Algorithm'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>मूल भविष्यवाणी विधि सुरुचिपूर्ण रूप से सरल है: प्रत्येक अमावस्या और पूर्णिमा पर, सूर्य और राहु (उत्तरी नोड) के बीच कोणीय दूरी की गणना करें। यदि दूरी एक सीमा से नीचे आती है, तो ग्रहण सम्भव है। प्राचीन भारतीय खगोलविदों ने इसे सहस्राब्दियों पहले सूर्य सिद्धान्त एल्गोरिदम में संकलित किया था।</> : <>The core prediction method is elegantly simple: at every New Moon and Full Moon, compute the angular distance between the Sun and Rahu (the ascending node). If the distance falls below a threshold, an eclipse is possible. Ancient Indian astronomers encoded this into Surya Siddhanta algorithms millennia ago.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'चरणबद्ध एल्गोरिदम' : 'Step-by-Step Algorithm'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>1. प्रत्येक अमावस्या/पूर्णिमा पर सूर्य और राहु का देशान्तर गणना करें। 2. कोणीय दूरी गणना करें: |सूर्य_देशान्तर - राहु_देशान्तर|। 3. यदि पूर्णिमा पर और दूरी &lt; 18° → चन्द्र ग्रहण सम्भव। 4. यदि अमावस्या पर और दूरी &lt; 15° → सूर्य ग्रहण सम्भव। 5. अधिक सटीकता के लिए, युति/प्रतियुति के क्षण चन्द्रमा का अक्षांश भी जाँचें।</> : <>1. Compute the Sun&apos;s longitude and Rahu&apos;s longitude at each New/Full Moon. 2. Calculate the angular distance: |Sun_lon - Rahu_lon|. 3. If at Full Moon and distance &lt; 18° → lunar eclipse possible. 4. If at New Moon and distance &lt; 15° → solar eclipse possible. 5. For greater precision, also check the Moon&apos;s latitude at the moment of conjunction/opposition.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'सैरोस चक्र' : 'The Saros Cycle'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>ग्रहण एक उल्लेखनीय पैटर्न में दोहराते हैं: प्रत्येक 223 सिनोडिक मास (18 वर्ष, 11 दिन, 8 घण्टे) में, लगभग समान ग्रहण होता है। यह इसलिए होता है क्योंकि 223 सिनोडिक मास के बाद, सूर्य-चन्द्र-नोड ज्यामिति लगभग समान विन्यास में लौटती है। 8 घण्टे का अन्तर का अर्थ है कि प्रत्येक पुनरावृत्ति देशान्तर में ~120° खिसकती है, इसलिए वही ग्रहण विश्व के भिन्न भाग से दिखाई देता है।</> : <>Eclipses repeat in a remarkable pattern: every 223 synodic months (18 years, 11 days, 8 hours), a nearly identical eclipse occurs. This happens because after 223 synodic months, the Sun-Moon-Node geometry returns to almost the same configuration. The 8-hour shift means each repeat moves ~120° in longitude, so the same eclipse is visible from a different part of the world.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'हमारे इंजन का कार्यान्वयन' : 'Our Engine Implementation'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>हमारा पंचांग इंजन मीयस-सटीकता स्थितियों का उपयोग करके प्रत्येक ल्यूनेशन की नोडल अक्ष से जाँच करता है। प्रत्येक आगामी अमावस्या और पूर्णिमा के लिए, हम सूर्य-राहु दूरी गणना करते हैं और सम्भावित ग्रहणों को चिह्नित करते हैं। हम चन्द्रमा के दृश्य व्यास और कोणीय पृथक्करण के आधार पर ग्रहण प्रकार (सूर्य के लिए पूर्ण/वलयाकार/आंशिक; चन्द्र के लिए पूर्ण/आंशिक/उपच्छायात्मक) भी गणना करते हैं।</> : <>Our Panchang engine checks every lunation against the nodal axis using Meeus-precision positions. For each upcoming New and Full Moon, we compute the Sun-Rahu distance and flag potential eclipses. We also compute the eclipse type (total/annular/partial for solar; total/partial/penumbral for lunar) based on the Moon&apos;s apparent diameter and angular separation.</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'ऐतिहासिक सटीकता' : 'Historical Precision'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>भारतीय खगोलविद सूर्य सिद्धान्त विधियों का उपयोग करके उल्लेखनीय सटीकता से ग्रहणों की भविष्यवाणी कर सकते थे। आर्यभट (5वीं शताब्दी ईस्वी) ने चन्द्रमा के कक्षीय मापदण्डों की इतनी सटीक गणना की कि उनकी ग्रहण भविष्यवाणियाँ वास्तविक घटनाओं से मिनटों के भीतर थीं। नोड प्रत्यागमन अवधि (18.6 वर्ष) सेकण्डों के भीतर ज्ञात थी। आधुनिक एल्गोरिदम केवल उसे परिष्कृत करते हैं जो प्राचीन भारतीय गणित ने स्थापित किया था।</> : <>Indian astronomers could predict eclipses with remarkable accuracy using Surya Siddhanta methods. Aryabhata (5th century CE) computed the Moon&apos;s orbital parameters so precisely that his eclipse predictions were within minutes of actual events. The node regression period (18.6 years) was known to within seconds. Modern algorithms simply refine what ancient Indian mathematics established.</>}</p>
      </section>
    </div>
  );
}

/* ─── Page 3: Astrological Significance ────────────────────────────────── */

function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en' && String(locale) !== 'ta';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'ग्रहणों का ज्योतिषीय महत्व' : 'Astrological Significance of Eclipses'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">{isHi ? <>ग्रहण आपकी जन्म कुण्डली में गोचर द्वारा जिन भावों में पड़ते हैं उन्हें सक्रिय करते हैं। उनके प्रभाव शक्तिशाली और दीर्घकालिक होते हैं — सूर्य ग्रहण के लिए आमतौर पर 6 महीने और चन्द्र ग्रहण के लिए 3 महीने। ग्रहण का भाव और राशि निर्धारित करते हैं कि कौन सा जीवन क्षेत्र सक्रिय होता है।</> : <>Eclipses activate the houses where they fall by transit in your birth chart. Their effects are potent and long-lasting — typically 6 months for a solar eclipse and 3 months for a lunar eclipse. The house and sign of the eclipse determine which life area is activated.</>}</p>

        <div className="space-y-3">
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'जन्म चन्द्रमा पर ग्रहण' : 'Eclipse on Natal Moon'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>आपके जन्म चन्द्रमा पर सूर्य ग्रहण सबसे तीव्र गोचरों में से एक है। यह लगभग 6 महीनों के लिए भावनात्मक उथल-पुथल, आन्तरिक परिवर्तन और भावनात्मक प्रतिमानों का पुनर्स्थापन दर्शाता है। जन्म चन्द्रमा का भाव निर्धारित करता है कि कौन सा जीवन क्षेत्र इस भावनात्मक पुनर्गठन से गुजरता है। जन्म चन्द्रमा पर चन्द्र ग्रहण समान रूप से शक्तिशाली है लेकिन अधिक बाह्य भावनात्मक घटनाओं के रूप में प्रकट होता है।</> : <>A solar eclipse conjunct your natal Moon is one of the most intense transits possible. It indicates emotional upheaval, inner transformation, and a reset of emotional patterns for approximately 6 months. The house of the natal Moon determines which life area undergoes this emotional restructuring. A lunar eclipse on the natal Moon is similarly powerful but manifests more as external emotional events.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'भाव-विशिष्ट प्रभाव' : 'House-Specific Effects'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>प्रथम भाव: पहचान परिवर्तन। चतुर्थ भाव: गृह/मातृ परिवर्तन। सप्तम भाव: साझेदारी उथल-पुथल। दशम भाव: कैरियर परिवर्तन। द्वितीय/अष्टम अक्ष: आर्थिक बदलाव। पंचम/एकादश अक्ष: संतान, सृजनात्मकता, सामाजिक वृत्त परिवर्तन। षष्ठ/द्वादश अक्ष: स्वास्थ्य और आध्यात्मिक जागरण। अक्ष महत्वपूर्ण है — ग्रहण सदैव विपरीत भावों को एक साथ सक्रिय करते हैं।</> : <>1st house: identity transformation. 4th house: home/mother changes. 7th house: partnership upheaval. 10th house: career change. 2nd/8th axis: financial shifts. 5th/11th axis: children, creativity, social circle changes. 6th/12th axis: health and spiritual awakening. The axis matters — eclipses always activate opposite houses simultaneously.</>}</p>
          </div>
          <div className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-lg p-3">
            <p className="text-gold-light font-bold text-sm">{isHi ? 'ग्रहण ऋतु और ग्रहण दोष' : 'Eclipse Season & Grahan Dosha'}</p>
            <p className="text-text-secondary text-xs mt-1">{isHi ? <>&quot;ग्रहण ऋतु&quot; — प्रत्येक ग्रहण के आसपास 2 सप्ताह की अवधि — नये कार्यों (विवाह, व्यापार आरम्भ, गृह खरीद) के लिए अशुभ मानी जाती है। हालाँकि, ग्रहण समाप्ति और पूर्णता के लिए उत्कृष्ट हैं। ग्रहण दोष: ग्रहण के दौरान जन्म विशिष्ट कार्मिक प्रतिमान उत्पन्न करता है। जन्म पर सूर्य-राहु/केतु युति = सूर्य ग्रहण दोष (पहचान/अधिकार चुनौतियाँ)। चन्द्र-राहु/केतु = चन्द्र ग्रहण दोष (भावनात्मक/मानसिक प्रतिमान)।</> : <>The &quot;eclipse season&quot; — the 2-week window around each eclipse — is considered inauspicious for new beginnings (marriage, business launch, house purchase). However, eclipses are excellent for endings and closure. Grahan Dosha: being born during an eclipse creates specific karmic patterns. Sun-Rahu/Ketu conjunction at birth = Surya Grahan Dosha (identity/authority challenges). Moon-Rahu/Ketu = Chandra Grahan Dosha (emotional/mental patterns).</>}</p>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'व्यावहारिक अनुप्रयोग' : 'Practical Application'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">{isHi ? <>हमारे ग्रहण पृष्ठ पर आगामी ग्रहणों को ट्रैक करें। ध्यान दें कि वे आपकी जन्म कुण्डली में किस भाव से गोचर करते हैं। ग्रहण काल में प्रमुख शुरुआतें टालें, लेकिन ऊर्जा का उपयोग ध्यान, पुराने प्रतिमानों को छोड़ने और आन्तरिक कार्य के लिए करें। यदि कोई ग्रहण किसी जन्मकालीन ग्रह के 3° के भीतर पड़ता है, तो अगले 6 महीनों में उस ग्रह के कारकत्व से सम्बन्धित महत्वपूर्ण घटनाओं की अपेक्षा करें।</> : <>Track upcoming eclipses on our Grahan page. Note which house they transit in your birth chart. Avoid major initiations during the eclipse season, but use the energy for meditation, releasing old patterns, and inner work. If an eclipse falls within 3° of a natal planet, expect significant events related to that planet&apos;s significations within the following 6 months.</>}</p>
      </section>
    </div>
  );
}

export default function Module23_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';
import ExampleChart from '@/components/learn/ExampleChart';

const META: ModuleMeta = {
  id: 'mod_19_1', phase: 6, topic: 'Jaimini', moduleNumber: '19.1',
  title: { en: 'Chara Karakas — 7 Variable Significators', hi: 'चर कारक — 7 परिवर्तनशील कारक' },
  subtitle: {
    en: 'Jaimini\'s revolutionary system where planetary degrees — not fixed assignments — determine who signifies self, career, spouse, and more',
    hi: 'जैमिनी की क्रान्तिकारी पद्धति जहाँ ग्रहों के अंश — स्थिर नियुक्तियाँ नहीं — निर्धारित करते हैं कि कौन आत्मा, जीविका, पत्नी आदि का कारक है',
  },
  estimatedMinutes: 14,
  crossRefs: [
    { label: { en: 'Module 19-2: Rashi Drishti', hi: 'मॉड्यूल 19-2: राशि दृष्टि' }, href: '/learn/modules/19-2' },
    { label: { en: 'Module 19-3: Argala', hi: 'मॉड्यूल 19-3: अर्गला' }, href: '/learn/modules/19-3' },
    { label: { en: 'Module 19-4: Special Lagnas', hi: 'मॉड्यूल 19-4: विशेष लग्न' }, href: '/learn/modules/19-4' },
    { label: { en: 'Kundali Generator', hi: 'कुण्डली निर्माता' }, href: '/kundali' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q19_1_01', type: 'mcq',
    question: {
      en: 'In Jaimini\'s system, which planet becomes the Atmakaraka?',
      hi: 'जैमिनी पद्धति में कौन-सा ग्रह आत्मकारक बनता है?',
    },
    options: [
      { en: 'The Sun, always', hi: 'सूर्य, सदैव' },
      { en: 'The planet with the highest degree in its sign', hi: 'अपनी राशि में सर्वाधिक अंश वाला ग्रह' },
      { en: 'The lagna lord', hi: 'लग्नेश' },
      { en: 'The Moon, always', hi: 'चन्द्रमा, सदैव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Atmakaraka is the planet with the highest degree (within its sign) among the 7 Chara Karaka planets (Sun through Saturn). This is a variable assignment based on the individual chart.',
      hi: 'आत्मकारक वह ग्रह है जिसके अंश (अपनी राशि में) 7 चर कारक ग्रहों (सूर्य से शनि तक) में सर्वाधिक हों। यह व्यक्तिगत कुण्डली पर आधारित परिवर्तनशील नियुक्ति है।',
    },
  },
  {
    id: 'q19_1_02', type: 'mcq',
    question: {
      en: 'How many planets are used in the standard 7-karaka Chara Karaka scheme?',
      hi: 'मानक 7-कारक चर कारक पद्धति में कितने ग्रह प्रयुक्त होते हैं?',
    },
    options: [
      { en: '5 (Sun to Saturn excluding nodes)', hi: '5 (सूर्य से शनि, राहु-केतु छोड़कर)' },
      { en: '7 (Sun through Saturn)', hi: '7 (सूर्य से शनि तक)' },
      { en: '9 (all including Rahu and Ketu)', hi: '9 (राहु-केतु सहित सभी)' },
      { en: '8 (Sun through Rahu)', hi: '8 (सूर्य से राहु तक)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The standard scheme uses 7 planets: Sun, Moon, Mars, Mercury, Jupiter, Venus, and Saturn. Some scholars use an 8-karaka scheme that includes Rahu (with 30° minus its degree).',
      hi: 'मानक पद्धति 7 ग्रह प्रयोग करती है: सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र और शनि। कुछ विद्वान 8-कारक पद्धति प्रयोग करते हैं जिसमें राहु (30° ऋण उसके अंश) भी सम्मिलित होता है।',
    },
  },
  {
    id: 'q19_1_03', type: 'true_false',
    question: {
      en: 'In the Chara Karaka system, the Sun is always the significator of the father.',
      hi: 'चर कारक पद्धति में सूर्य सदैव पिता का कारक होता है।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. That is the Parashari (fixed karaka) approach. In Jaimini\'s Chara Karaka system, any planet can signify any role depending on its degree. The Sun might be Atmakaraka (self) in one chart and Darakaraka (spouse) in another.',
      hi: 'असत्य। यह पाराशरी (स्थिर कारक) दृष्टिकोण है। जैमिनी की चर कारक पद्धति में कोई भी ग्रह अपने अंश के आधार पर किसी भी भूमिका का कारक बन सकता है। सूर्य एक कुण्डली में आत्मकारक और दूसरी में दारकारक हो सकता है।',
    },
  },
  {
    id: 'q19_1_04', type: 'mcq',
    question: {
      en: 'The Darakaraka (spouse significator) is the planet with:',
      hi: 'दारकारक (पत्नी/पति कारक) वह ग्रह है जिसके:',
    },
    options: [
      { en: 'The highest degree', hi: 'अंश सर्वाधिक हों' },
      { en: 'The second highest degree', hi: 'अंश दूसरे सर्वाधिक हों' },
      { en: 'The lowest degree among the 7 planets', hi: '7 ग्रहों में अंश न्यूनतम हों' },
      { en: 'The degree closest to the Moon', hi: 'अंश चन्द्रमा के निकटतम हों' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'The Darakaraka is the planet with the lowest degree among the 7 Chara Karaka planets. The sequence from highest to lowest is: AK, AmK, BK, MK, PK, GK, DK.',
      hi: 'दारकारक 7 चर कारक ग्रहों में न्यूनतम अंश वाला ग्रह होता है। सर्वाधिक से न्यूनतम का क्रम है: AK, AmK, BK, MK, PK, GK, DK।',
    },
  },
  {
    id: 'q19_1_05', type: 'mcq',
    question: {
      en: 'What is the Karakamsha lagna?',
      hi: 'कारकांश लग्न क्या है?',
    },
    options: [
      { en: 'The birth lagna placed in the Navamsha chart', hi: 'नवांश कुण्डली में रखा गया जन्म लग्न' },
      { en: 'The sign occupied by the Atmakaraka in the Navamsha (D9)', hi: 'नवांश (D9) में आत्मकारक की राशि' },
      { en: 'The Moon\'s sign in the D9 chart', hi: 'D9 कुण्डली में चन्द्रमा की राशि' },
      { en: 'The 10th house from the Atmakaraka', hi: 'आत्मकारक से दशम भाव' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Karakamsha lagna is the Navamsha sign of the Atmakaraka. It is one of the most important reference points in Jaimini astrology, used to determine spiritual path, career, and deepest life motivations.',
      hi: 'कारकांश लग्न आत्मकारक की नवांश राशि है। यह जैमिनी ज्योतिष के सर्वाधिक महत्त्वपूर्ण सन्दर्भ बिन्दुओं में से एक है, जो आध्यात्मिक पथ, जीविका और जीवन की गहनतम प्रेरणाओं को निर्धारित करता है।',
    },
  },
  {
    id: 'q19_1_06', type: 'true_false',
    question: {
      en: 'Two planets can share the same Chara Karaka designation if they have exactly the same degree.',
      hi: 'यदि दो ग्रहों के अंश बिल्कुल समान हों तो वे एक ही चर कारक पदनाम साझा कर सकते हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. If two planets have very close degrees, the one with the higher minutes/seconds takes the higher karaka. In practice, exact ties down to the arc-second are virtually impossible, so each planet receives a unique karaka designation.',
      hi: 'असत्य। यदि दो ग्रहों के अंश बहुत निकट हों, तो जिसकी कला/विकला अधिक हो वह ऊपरी कारक लेता है। व्यवहार में विकला स्तर तक सटीक समानता लगभग असम्भव है, अतः प्रत्येक ग्रह को अद्वितीय कारक पदनाम मिलता है।',
    },
  },
  {
    id: 'q19_1_07', type: 'mcq',
    question: {
      en: 'In the 8-karaka scheme, how is Rahu\'s degree calculated?',
      hi: '8-कारक पद्धति में राहु के अंश कैसे गणित किये जाते हैं?',
    },
    options: [
      { en: 'Same as its actual degree in the sign', hi: 'राशि में उसके वास्तविक अंश के समान' },
      { en: '30° minus its actual degree in the sign', hi: '30° ऋण राशि में उसके वास्तविक अंश' },
      { en: 'Its degree is always taken as 0°', hi: 'उसके अंश सदैव 0° माने जाते हैं' },
      { en: 'Double its actual degree', hi: 'उसके वास्तविक अंश का दोगुना' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Since Rahu moves in retrograde (reverse) motion, its effective degree for Chara Karaka calculation is 30° minus its actual degree within the sign. For example, Rahu at 22° becomes 8° for karaka sorting.',
      hi: 'चूँकि राहु वक्री (उल्टी) गति से चलता है, चर कारक गणना के लिए उसका प्रभावी अंश 30° ऋण राशि में उसका वास्तविक अंश होता है। उदाहरणार्थ, 22° पर राहु कारक क्रम में 8° बन जाता है।',
    },
  },
  {
    id: 'q19_1_08', type: 'mcq',
    question: {
      en: 'The Amatyakaraka signifies:',
      hi: 'अमात्यकारक किसका कारक है?',
    },
    options: [
      { en: 'Spouse and partnerships', hi: 'पत्नी/पति और साझेदारी' },
      { en: 'Career, profession, and advisors', hi: 'जीविका, व्यवसाय और सलाहकार' },
      { en: 'Mother and emotional wellbeing', hi: 'माता और भावनात्मक कल्याण' },
      { en: 'Children and creativity', hi: 'सन्तान और सृजनशीलता' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Amatyakaraka (AmK) is the planet with the second-highest degree. "Amatya" means minister/advisor. It signifies career, profession, and the people who guide or support the native in their worldly pursuits.',
      hi: 'अमात्यकारक (AmK) दूसरे सर्वाधिक अंश वाला ग्रह है। "अमात्य" का अर्थ मन्त्री/सलाहकार है। यह जीविका, व्यवसाय और उन व्यक्तियों का कारक है जो जातक को सांसारिक कार्यों में मार्गदर्शन या सहायता करते हैं।',
    },
  },
  {
    id: 'q19_1_09', type: 'true_false',
    question: {
      en: 'Some Jaimini astrologers consider the Atmakaraka more important than the Lagna lord for understanding a person\'s core nature.',
      hi: 'कुछ जैमिनी ज्योतिषी व्यक्ति की मूल प्रकृति समझने के लिए आत्मकारक को लग्नेश से अधिक महत्त्वपूर्ण मानते हैं।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. In Jaimini philosophy, the Atmakaraka represents the soul\'s deepest desire and karmic mission. Many Jaimini practitioners give it primacy over the Lagna lord, especially when analyzing the Navamsha (D9) chart through the Karakamsha.',
      hi: 'सत्य। जैमिनी दर्शन में आत्मकारक आत्मा की गहनतम इच्छा और कार्मिक उद्देश्य का प्रतिनिधित्व करता है। अनेक जैमिनी ज्योतिषी इसे लग्नेश से ऊपर मानते हैं, विशेषकर कारकांश के माध्यम से नवांश (D9) कुण्डली का विश्लेषण करते समय।',
    },
  },
  {
    id: 'q19_1_10', type: 'mcq',
    question: {
      en: 'Given: Sun 25°, Moon 18°, Mars 22°, Mercury 10°, Jupiter 28°, Venus 15°, Saturn 8°. Which planet is the Bhratrikaraka (siblings)?',
      hi: 'दिया गया: सूर्य 25°, चन्द्र 18°, मंगल 22°, बुध 10°, बृहस्पति 28°, शुक्र 15°, शनि 8°। भ्रातृकारक (भाई-बहन) कौन-सा ग्रह है?',
    },
    options: [
      { en: 'Sun (25°)', hi: 'सूर्य (25°)' },
      { en: 'Mars (22°)', hi: 'मंगल (22°)' },
      { en: 'Moon (18°)', hi: 'चन्द्र (18°)' },
      { en: 'Jupiter (28°)', hi: 'बृहस्पति (28°)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sorted by degree: Jupiter(28°)=AK, Sun(25°)=AmK, Mars(22°)=BK. Mars with the third-highest degree becomes the Bhratrikaraka (siblings significator).',
      hi: 'अंश क्रम: बृहस्पति(28°)=AK, सूर्य(25°)=AmK, मंगल(22°)=BK। तीसरे सर्वाधिक अंश वाला मंगल भ्रातृकारक (भाई-बहनों का कारक) बनता है।',
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
          {isHi ? 'जैमिनी के परिवर्तनशील कारक' : 'Jaimini&apos;s Variable Significators'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>पाराशरी ज्योतिष में कारक स्थिर हैं: सूर्य सदैव पिता, चन्द्रमा सदैव माता, मंगल सदैव भाई-बहन, इत्यादि का प्रतिनिधित्व करता है। महर्षि जैमिनी ने एक क्रान्तिकारी विकल्प प्रस्तुत किया — चर कारक (&quot;परिवर्तनशील कारक&quot;) पद्धति — जहाँ प्रत्येक ग्रह की भूमिका उसके स्वाभाविक स्वरूप से नहीं बल्कि उसकी राशि में अंश से निर्धारित होती है। किसी भी राशि में सर्वाधिक अंश वाला ग्रह आत्मकारक (आत्म-कारक) बनता है, अगला अमात्यकारक (जीविका), और इसी प्रकार सातवाँ दारकारक (पत्नी/पति) बनता है।</>
            : <>In Parashari astrology, significators are fixed: the Sun always represents the father, the Moon always represents the mother, Mars always represents siblings, and so on. Maharishi Jaimini introduced a revolutionary alternative — the Chara Karaka (&quot;variable significator&quot;) system — where the role each planet plays is determined not by its inherent nature but by its degree within its sign. The planet at the highest degree in any sign becomes the Atmakaraka (self-significator), the next highest becomes the Amatyakaraka (career), and so on down to the seventh, which becomes the Darakaraka (spouse).</>}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>अवरोही अंश क्रम में सात चर कारक हैं: <strong>आत्मकारक (AK)</strong> — आत्मा, आत्मा की इच्छा; <strong>अमात्यकारक (AmK)</strong> — जीविका, मन्त्री, सलाहकार; <strong>भ्रातृकारक (BK)</strong> — भाई-बहन, साहस; <strong>मातृकारक (MK)</strong> — माता, भावनात्मक पोषण; <strong>पुत्रकारक (PK)</strong> — सन्तान, सृजनशीलता, पुण्य; <strong>ज्ञातिकारक (GK)</strong> — शत्रु, रोग, बाधाएँ; <strong>दारकारक (DK)</strong> — पत्नी/पति, साझेदारी।</>
            : <>The seven Chara Karakas in descending order of degree are: <strong>Atmakaraka (AK)</strong> — the self, soul&apos;s desire; <strong>Amatyakaraka (AmK)</strong> — career, minister, advisor; <strong>Bhratrikaraka (BK)</strong> — siblings, courage; <strong>Matrikaraka (MK)</strong> — mother, emotional nourishment; <strong>Putrakaraka (PK)</strong> — children, creativity, merit; <strong>Gnatikaraka (GK)</strong> — enemies, disease, obstacles; <strong>Darakaraka (DK)</strong> — spouse, partnerships.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'राहु का विशेष नियम' : 'Rahu&apos;s Special Treatment'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>कुछ जैमिनी विद्वान 8-कारक पद्धति प्रयोग करते हैं जिसमें राहु सम्मिलित है। चूँकि राहु वक्री गति से चलता है, उसका अंश 30° ऋण राशि में उसका वास्तविक अंश गणित किया जाता है। उदाहरणार्थ, किसी राशि में 22° पर राहु को कारक क्रम में 8° माना जाता है। यह उल्टी गणना राहु की सदा वक्री प्रकृति का ध्यान रखती है। 8-कारक पद्धति में एक अतिरिक्त कारक — पितृकारक (पिता) — मातृकारक और पुत्रकारक के बीच जोड़ा जाता है।</>
            : <>Some Jaimini scholars use an 8-karaka scheme that includes Rahu. Since Rahu moves in retrograde motion, its degree is calculated as 30° minus its actual degree within the sign. For example, Rahu at 22° in a sign is treated as having 8° for karaka sorting purposes. This reversed calculation accounts for Rahu&apos;s perpetually retrograde nature. In the 8-karaka scheme, an additional karaka — Pitrikaraka (father) — is inserted between Matrikaraka and Putrakaraka.</>}
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
          {isHi ? 'चर कारक गणना' : 'Computing Chara Karakas'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>गणना सरल है: सभी 7 ग्रह (सूर्य, चन्द्र, मंगल, बुध, बृहस्पति, शुक्र, शनि) लें और प्रत्येक ग्रह का अपनी राशि में अंश (0° से 29°59&apos;) नोट करें। केवल राशि में अंश ही महत्त्वपूर्ण है — इस क्रम के लिए राशि स्वयं अप्रासंगिक है। सातों ग्रहों को सर्वाधिक से न्यूनतम अंश में क्रमित करें। शीर्ष पर ग्रह आत्मकारक है, अगला अमात्यकारक, इत्यादि।</>
            : <>The calculation is straightforward: take all 7 planets (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn) and note each planet&apos;s degree within its sign (0° to 29°59&apos;). Only the degree within the sign matters — the sign itself is irrelevant for this sorting. Sort all seven planets from highest degree to lowest. The planet at the top is Atmakaraka, the next is Amatyakaraka, and so on.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <ExampleChart ascendant={1} planets={{ 1: [2], 4: [1], 9: [4], 10: [0] }} title={isHi ? 'उदाहरण कुण्डली' : 'Example Chart'} />
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Given positions:</span> Sun at 25°14&apos; Aries, Moon at 18°07&apos; Gemini, Mars at 22°45&apos; Leo, Mercury at 10°33&apos; Virgo, Jupiter at 28°02&apos; Taurus, Venus at 15°21&apos; Libra, Saturn at 8°48&apos; Capricorn.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 1 — Extract degrees within sign:</span> Sun = 25°14&apos;, Moon = 18°07&apos;, Mars = 22°45&apos;, Mercury = 10°33&apos;, Jupiter = 28°02&apos;, Venus = 15°21&apos;, Saturn = 8°48&apos;.
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          <span className="text-gold-light font-medium">Step 2 — Sort highest to lowest:</span> Jupiter (28°02&apos;) → Sun (25°14&apos;) → Mars (22°45&apos;) → Moon (18°07&apos;) → Venus (15°21&apos;) → Mercury (10°33&apos;) → Saturn (8°48&apos;).
        </p>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">कारक नियुक्ति:</span> बृहस्पति(28°02&apos;) = AK (आत्मकारक), सूर्य(25°14&apos;) = AmK (अमात्यकारक), मंगल(22°45&apos;) = BK (भ्रातृकारक), चन्द्र(18°07&apos;) = MK (मातृकारक), शुक्र(15°21&apos;) = PK (पुत्रकारक), बुध(10°33&apos;) = GK (ज्ञातिकारक), शनि(8°48&apos;) = DK (दारकारक)।</>
            : <><span className="text-gold-light font-medium">Step 3 — Assign karakas:</span> Jupiter = AK (Atmakaraka), Sun = AmK (Amatyakaraka), Mars = BK (Bhratrikaraka), Moon = MK (Matrikaraka), Venus = PK (Putrakaraka), Mercury = GK (Gnatikaraka), Saturn = DK (Darakaraka).</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> &quot;चर कारक के लिए ग्रह का कुल भोगांश (राशिचक्र में निरपेक्ष अंश) प्रयोग होता है।&quot; यह गलत है। केवल अपनी राशि में अंश (0° से 30°) ही मायने रखता है। मेष में 5° (निरपेक्ष 5°) का ग्रह और वृश्चिक में 5° (निरपेक्ष 215°) का ग्रह समान माना जाता है — दोनों अपनी राशि में 5° पर हैं।</>
            : <><span className="text-gold-light font-medium">Misconception:</span> &quot;The planet&apos;s total longitude (absolute degree in the zodiac) is used for Chara Karaka.&quot; This is wrong. Only the degree within its own sign (0° to 30°) matters. A planet at 5° Aries (absolute 5°) and a planet at 5° Scorpio (absolute 215°) are treated equally — both are at 5° within their sign.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <>चर कारकों ने आधुनिक ज्योतिष अभ्यासकर्ताओं में नवीन रुचि प्राप्त की है क्योंकि वे कुण्डली व्याख्या में गहन व्यक्तिगत परत जोड़ते हैं। जहाँ पाराशरी स्थिर कारक सामान्य सिद्धान्त देते हैं, वहीं चर कारक प्रकट करते हैं कि प्रत्येक व्यक्ति के लिए विशिष्ट रूप से क्या महत्त्वपूर्ण है। सॉफ्टवेयर इन्हें तत्काल गणित कर सकता है, जिससे जैमिनी तकनीकें पहले से कहीं अधिक सुलभ हो गयी हैं।</>
            : <>Chara Karakas have gained renewed interest among modern Jyotish practitioners because they add a deeply personalized layer to chart interpretation. While Parashari fixed karakas give general principles, Chara Karakas reveal what is uniquely significant for each individual. Software can compute these instantly, making Jaimini techniques more accessible than ever.</>}
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
          {isHi ? 'आत्मकारक का सर्वोच्च महत्त्व' : 'The Atmakaraka&apos;s Supreme Significance'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आत्मकारक — सर्वाधिक अंश वाला ग्रह — इस जन्म में आत्मा की इच्छा का प्रतिनिधित्व करता है। जैमिनी ज्योतिष में यह कुण्डली का राजा है। जहाँ लग्न भौतिक अवतार दिखाता है और चन्द्रमा मन दिखाता है, वहीं AK प्रकट करता है कि आत्मा वास्तव में क्या अनुभव करना, सीखना या पूर्ण करना चाहती है। सूर्य AK होने पर मान्यता और नेतृत्व की खोज; चन्द्र AK होने पर भावनात्मक तृप्ति और पोषण की लालसा; शनि AK होने पर कठिनाइयों द्वारा वैराग्य और अनुशासन सीखने वाली आत्मा।</>
            : <>The Atmakaraka — the planet with the highest degree — represents the soul&apos;s desire in this life. It is the king of the chart in Jaimini astrology. While the Lagna shows the physical incarnation and the Moon shows the mind, the AK reveals what the soul truly seeks to experience, learn, or accomplish. A Sun as AK seeks recognition and leadership; a Moon as AK craves emotional fulfillment and nurturing; a Saturn as AK indicates a soul learning detachment and discipline through hardship.</>}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'कारकांश — D9 में AK' : 'Karakamsha — The AK in D9'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>आत्मकारक की नवांश (D9) राशि कारकांश कहलाती है। जब इस राशि को जन्म कुण्डली (D1) में सन्दर्भ लग्न के रूप में प्रयोग किया जाता है, तो यह कारकांश लग्न बनती है — जैमिनी ज्योतिष का सर्वाधिक शक्तिशाली विश्लेषण उपकरण। कारकांश में और उसे दृष्ट करने वाले ग्रह जातक का आध्यात्मिक पथ, गहनतम व्यावसायिक आह्वान और मोक्ष यात्रा की प्रकृति प्रकट करते हैं। बृहस्पति कारकांश में या दृष्ट करे तो विष्णु भक्ति या सात्त्विक आध्यात्मिक पथ; शुक्र हो तो लक्ष्मी पूजा या तान्त्रिक मार्ग; शनि हो तो उग्र देवताओं की उपासना या गहन तपस्या।</>
            : <>The Navamsha (D9) sign of the Atmakaraka is called the Karakamsha. When this sign is used as the reference lagna in the birth chart (D1), it becomes the Karakamsha Lagna — one of the most powerful analytical tools in Jaimini astrology. Planets in and aspecting the Karakamsha reveal the native&apos;s spiritual path, deepest career calling, and the nature of their moksha journey. Jupiter in or aspecting Karakamsha suggests devotion to Vishnu or a sattvic spiritual path; Venus suggests worship of Lakshmi or tantric paths; Saturn suggests worship of dark deities or deep austerity practices.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Example'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi
            ? <><span className="text-gold-light font-medium">उदाहरण:</span> बृहस्पति AK है 28° वृषभ में। D9 में बृहस्पति मकर में पड़ता है। अतः कारकांश मकर है। D1 कुण्डली में मकर को लग्न मानकर देखें: यदि शुक्र मकर (कारकांश) में हो, तो जातक में कलात्मक प्रतिभा है और वह स्त्री देवताओं की उपासना कर सकता है। यदि मंगल कर्क से मकर को दृष्ट करे (सप्तम दृष्टि), तो जातक का अनुशासित, योद्धा-सदृश आध्यात्मिक अभ्यास है। कारकांश से दशम (तुला) आत्मा की सच्ची व्यावसायिक पुकार निर्धारित करता है।</>
            : <><span className="text-gold-light font-medium">Case:</span> Jupiter is AK at 28° Taurus. In the D9 chart, Jupiter falls in Capricorn. Therefore, the Karakamsha is Capricorn. Looking at the D1 chart from Capricorn as lagna: if Venus is in Capricorn (Karakamsha), the native has artistic talent and may pursue worship of feminine deities. If Mars aspects Capricorn from Cancer (7th aspect), the native has a disciplined, warrior-like spiritual practice. The 10th from Karakamsha (Libra) determines the soul&apos;s true career calling.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-2">{isHi ? 'AK लग्नेश से ऊपर क्यों' : 'Why AK Can Surpass the Lagna Lord'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed mb-2">
          {isHi
            ? <>लग्नेश दिखाता है कि जातक संसार से कैसे अन्तर्क्रिया करता है — शारीरिक रूप, स्वास्थ्य और व्यक्तित्व प्रक्षेपण। किन्तु आत्मकारक गहन &quot;क्यों&quot; प्रकट करता है — वह कार्मिक उद्देश्य जो आत्मा ने इस अवतार में पूर्ण करने के लिए चुना। समान लग्न किन्तु भिन्न आत्मकारक वाले दो व्यक्तियों के जीवन पथ बहुत भिन्न होंगे। लग्नेश बाह्य संसार में मार्गदर्शन करता है; आत्मकारक आन्तरिक दिशासूचक चलाता है। जैमिनी अभ्यास में AK और कारकांश का विश्लेषण प्रायः उन अस्पष्टताओं को सुलझाता है जो पाराशरी विधियों से अनुत्तरित रहती हैं।</>
            : <>The Lagna lord shows how the native interacts with the world — their physical appearance, health, and personality projection. But the Atmakaraka reveals the deeper &quot;why&quot; — the karmic purpose the soul chose this incarnation to fulfill. Two people with the same Lagna but different Atmakarakas will have very different life trajectories. The Lagna lord navigates the external world; the Atmakaraka drives the internal compass. In Jaimini practice, analyzing the AK and Karakamsha often resolves ambiguities that Parashari methods leave unanswered.</>}
        </p>
      </section>
    </div>
  );
}

export default function Module19_1Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

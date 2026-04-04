'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_5_3', phase: 2, topic: 'Tithi', moduleNumber: '5.3',
  title: { en: 'Tithi Calculations — Parana, Kshaya, Vriddhi', hi: 'तिथि गणना — पारण, क्षय, वृद्धि' },
  subtitle: {
    en: 'Understanding variable tithi duration, skipped and repeated tithis, and the critical rules for breaking Ekadashi fasts',
    hi: 'तिथि की परिवर्तनशील अवधि, छूटी और दोहरी तिथियों तथा एकादशी उपवास तोड़ने के महत्वपूर्ण नियमों को समझना',
  },
  estimatedMinutes: 15,
  crossRefs: [
    { label: { en: 'Module 5-1: Tithi', hi: 'मॉड्यूल 5-1: तिथि' }, href: '/learn/modules/5-1' },
    { label: { en: 'Module 5-2: Paksha', hi: 'मॉड्यूल 5-2: पक्ष' }, href: '/learn/modules/5-2' },
    { label: { en: 'Daily Panchang', hi: 'दैनिक पंचांग' }, href: '/panchang' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q5_3_01', type: 'mcq',
    question: {
      en: 'The Moon\'s daily motion varies between approximately:',
      hi: 'चन्द्रमा की दैनिक गति लगभग कितने के बीच बदलती है?',
    },
    options: [
      { en: '5 degrees/day to 8 degrees/day', hi: '5 अंश/दिन से 8 अंश/दिन' },
      { en: '11.8 degrees/day to 15.4 degrees/day', hi: '11.8 अंश/दिन से 15.4 अंश/दिन' },
      { en: '20 degrees/day to 25 degrees/day', hi: '20 अंश/दिन से 25 अंश/दिन' },
      { en: '1 degree/day to 3 degrees/day', hi: '1 अंश/दिन से 3 अंश/दिन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Moon\'s daily motion ranges from about 11.8 degrees/day at apogee (farthest from Earth) to about 15.4 degrees/day at perigee (closest to Earth). This variation is due to its elliptical orbit.',
      hi: 'चन्द्रमा की दैनिक गति अपभू (पृथ्वी से दूरस्थ) पर लगभग 11.8 अंश/दिन से उपभू (पृथ्वी के निकटतम) पर लगभग 15.4 अंश/दिन तक होती है। यह भिन्नता उसकी दीर्घवृत्ताकार कक्षा के कारण है।',
    },
  },
  {
    id: 'q5_3_02', type: 'true_false',
    question: {
      en: 'A Kshaya tithi occurs when a tithi begins and ends entirely between two consecutive sunrises, so no sunrise falls during that tithi.',
      hi: 'क्षय तिथि तब होती है जब कोई तिथि दो क्रमागत सूर्योदयों के बीच पूर्णतया आरम्भ और समाप्त हो जाती है, अतः उस तिथि के दौरान कोई सूर्योदय नहीं होता।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Kshaya means "loss" or "decay." When the Moon is moving fast (near perigee), a short tithi can start after one sunrise and end before the next sunrise, meaning that tithi never governs any day.',
      hi: 'सत्य। क्षय का अर्थ "हानि" या "ह्रास" है। जब चन्द्रमा तीव्र गति (उपभू के निकट) से चल रहा हो, एक लघु तिथि एक सूर्योदय के बाद आरम्भ होकर अगले सूर्योदय से पहले ही समाप्त हो सकती है, अर्थात् वह तिथि किसी भी दिन पर शासन नहीं करती।',
    },
  },
  {
    id: 'q5_3_03', type: 'mcq',
    question: {
      en: 'A Vriddhi (extra/repeated) tithi occurs when:',
      hi: 'वृद्धि (अतिरिक्त/दोहरी) तिथि कब होती है?',
    },
    options: [
      { en: 'The Moon is at perigee and moves very fast', hi: 'चन्द्रमा उपभू पर है और अत्यन्त तीव्र गति से चलता है' },
      { en: 'A slow-moving Moon causes a tithi to span three sunrises', hi: 'मन्दगति चन्द्रमा के कारण एक तिथि तीन सूर्योदयों तक फैल जाती है' },
      { en: 'An eclipse occurs during the tithi', hi: 'तिथि के दौरान ग्रहण होता है' },
      { en: 'Two tithis start at the same time', hi: 'दो तिथियाँ एक ही समय आरम्भ होती हैं' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'When the Moon moves slowly (near apogee), a tithi can last long enough to be present at three consecutive sunrises. This means the same tithi governs two successive calendar days — it is repeated or "vriddhi" (augmented).',
      hi: 'जब चन्द्रमा मन्द गति (अपभू के निकट) से चलता है, तो एक तिथि इतनी दीर्घ हो सकती है कि तीन क्रमागत सूर्योदयों पर उपस्थित रहे। इसका अर्थ है कि एक ही तिथि दो लगातार दिनों पर शासन करती है — यह "वृद्धि" (बढ़ी हुई) तिथि कहलाती है।',
    },
  },
  {
    id: 'q5_3_04', type: 'mcq',
    question: {
      en: 'Parana (breaking the Ekadashi fast) should ideally be done:',
      hi: 'पारण (एकादशी उपवास तोड़ना) आदर्श रूप से कब करना चाहिए?',
    },
    options: [
      { en: 'Immediately at sunrise on Dwadashi day', hi: 'द्वादशी दिवस पर सूर्योदय के तुरन्त बाद' },
      { en: 'After Dwadashi tithi begins but before it ends, within the prescribed window', hi: 'द्वादशी तिथि आरम्भ होने के बाद किन्तु समाप्त होने से पहले, निर्धारित समय-सीमा में' },
      { en: 'Any time on the day after Ekadashi', hi: 'एकादशी के अगले दिन कभी भी' },
      { en: 'Only at midnight', hi: 'केवल मध्यरात्रि में' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The Parana window opens when Dwadashi tithi begins (i.e., the Ekadashi tithi has ended) and closes when Dwadashi tithi ends. Breaking the fast too early (while Ekadashi still prevails) or too late (after Dwadashi ends) diminishes the spiritual merit.',
      hi: 'पारण का समय-सीमा द्वादशी तिथि आरम्भ होने पर (अर्थात् एकादशी तिथि समाप्त होने पर) खुलती है और द्वादशी तिथि समाप्त होने पर बन्द होती है। बहुत जल्दी (जब एकादशी चल रही हो) या बहुत देर से (द्वादशी समाप्त होने के बाद) उपवास तोड़ने से आध्यात्मिक पुण्य कम होता है।',
    },
  },
  {
    id: 'q5_3_05', type: 'mcq',
    question: {
      en: 'Given Moon at 167 degrees and Sun at 348 degrees at sunrise, calculate the tithi:',
      hi: 'सूर्योदय पर चन्द्रमा 167 अंश और सूर्य 348 अंश पर हो, तो तिथि ज्ञात करें:',
    },
    options: [
      { en: 'Chaturdashi (14th)', hi: 'चतुर्दशी (14वीं)' },
      { en: 'Purnima (15th)', hi: 'पूर्णिमा (15वीं)' },
      { en: 'Pratipada (1st)', hi: 'प्रतिपदा (1ली)' },
      { en: 'Trayodashi (13th)', hi: 'त्रयोदशी (13वीं)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Elongation = 167 - 348 = -181, add 360 = 179 degrees. Tithi = floor(179 / 12) + 1 = floor(14.916) + 1 = 14 + 1 = 15. Tithi 15 of Shukla Paksha is Purnima.',
      hi: 'कोणीय दूरी = 167 - 348 = -181, 360 जोड़ें = 179 अंश। तिथि = floor(179 / 12) + 1 = floor(14.916) + 1 = 14 + 1 = 15। शुक्ल पक्ष की 15वीं तिथि पूर्णिमा है।',
    },
  },
  {
    id: 'q5_3_06', type: 'true_false',
    question: {
      en: 'When a tithi spans two sunrises (present at both), that date has that tithi. This is the most common scenario.',
      hi: 'जब कोई तिथि दो सूर्योदयों तक फैली हो (दोनों पर उपस्थित), तो वह तिथि उस दिन की मानी जाती है। यह सबसे सामान्य स्थिति है।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. The standard case is that a tithi is present at one sunrise and has ended before the next. That sunrise day is named after that tithi. A tithi spanning two sunrises means it governs both days (vriddhi).',
      hi: 'सत्य। सामान्य स्थिति यह है कि एक तिथि एक सूर्योदय पर उपस्थित हो और अगले से पहले समाप्त हो जाए। वह सूर्योदय-दिवस उस तिथि के नाम पर होता है। दो सूर्योदयों तक फैली तिथि दोनों दिनों पर शासन करती है (वृद्धि)।',
    },
  },
  {
    id: 'q5_3_07', type: 'mcq',
    question: {
      en: 'If the Moon-Sun elongation at sunrise is exactly 180 degrees, which tithi is about to end?',
      hi: 'यदि सूर्योदय पर चन्द्र-सूर्य कोणीय दूरी ठीक 180 अंश हो, तो कौन-सी तिथि समाप्त होने वाली है?',
    },
    options: [
      { en: 'Chaturdashi (14th)', hi: 'चतुर्दशी (14वीं)' },
      { en: 'Purnima (15th)', hi: 'पूर्णिमा (15वीं)' },
      { en: 'Amavasya (30th)', hi: 'अमावस्या (30वीं)' },
      { en: 'Krishna Pratipada (16th)', hi: 'कृष्ण प्रतिपदा (16वीं)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Purnima spans 168 to 180 degrees. At exactly 180 degrees, Purnima is at its endpoint. The moment elongation crosses 180 degrees, Krishna Paksha Pratipada begins (180 to 192 degrees).',
      hi: 'पूर्णिमा 168 से 180 अंश तक फैली है। ठीक 180 अंश पर पूर्णिमा अपने अन्तिम बिन्दु पर है। जैसे ही कोणीय दूरी 180 अंश पार करती है, कृष्ण पक्ष प्रतिपदा (180 से 192 अंश) आरम्भ होती है।',
    },
  },
  {
    id: 'q5_3_08', type: 'mcq',
    question: {
      en: 'To find precisely when a tithi ends, which computational method is used?',
      hi: 'किसी तिथि के ठीक समाप्ति समय को ज्ञात करने हेतु कौन-सी गणना विधि प्रयुक्त होती है?',
    },
    options: [
      { en: 'Simple linear interpolation between two known points', hi: 'दो ज्ञात बिन्दुओं के बीच सरल रैखिक प्रक्षेप' },
      { en: 'Binary search (iterative bisection) to find the exact moment Moon-Sun elongation crosses a 12-degree boundary', hi: 'द्विभाजन खोज (पुनरावर्ती विभाजन) द्वारा चन्द्र-सूर्य कोणीय दूरी के 12-अंश सीमा पार करने का ठीक क्षण ज्ञात करना' },
      { en: 'Looking up a pre-printed table from the previous year', hi: 'पिछले वर्ष की छपी तालिका देखना' },
      { en: 'Counting 24 hours from the tithi start', hi: 'तिथि आरम्भ से 24 घण्टे गिनना' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Modern Panchang software uses binary search (bisection): compute elongation at two times bracketing the boundary, then repeatedly halve the interval until the crossing moment is found to the desired precision (typically within one second).',
      hi: 'आधुनिक पंचांग सॉफ्टवेयर द्विभाजन खोज का उपयोग करता है: सीमा के दोनों ओर दो समयों पर कोणीय दूरी गणना करें, फिर अन्तराल को बार-बार आधा करें जब तक सीमा-पार का क्षण वांछित सटीकता (सामान्यतः एक सेकण्ड के भीतर) तक न मिल जाए।',
    },
  },
  {
    id: 'q5_3_09', type: 'true_false',
    question: {
      en: 'Kshaya tithis are extremely common and occur multiple times every month.',
      hi: 'क्षय तिथियाँ अत्यन्त सामान्य हैं और प्रत्येक मास में कई बार होती हैं।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. Kshaya tithis are relatively rare — typically only a few occur per year. They require the Moon to be near perigee (fastest motion) and the Sun to be near aphelion (slowest motion) simultaneously, creating the conditions for a very short tithi.',
      hi: 'असत्य। क्षय तिथियाँ अपेक्षाकृत दुर्लभ हैं — सामान्यतः वर्ष में केवल कुछ ही होती हैं। इसके लिए चन्द्रमा का उपभू (तीव्रतम गति) के निकट और सूर्य का अपसौर (मन्दतम गति) के निकट एक साथ होना आवश्यक है, जो अत्यन्त लघु तिथि की स्थिति उत्पन्न करता है।',
    },
  },
  {
    id: 'q5_3_10', type: 'mcq',
    question: {
      en: 'In the worked example (Moon=167, Sun=348), when does Purnima end?',
      hi: 'कार्यान्वित उदाहरण (चन्द्र=167, सूर्य=348) में पूर्णिमा कब समाप्त होती है?',
    },
    options: [
      { en: 'When elongation reaches 168 degrees', hi: 'जब कोणीय दूरी 168 अंश तक पहुँचे' },
      { en: 'When elongation reaches 180 degrees', hi: 'जब कोणीय दूरी 180 अंश तक पहुँचे' },
      { en: 'When elongation reaches 192 degrees', hi: 'जब कोणीय दूरी 192 अंश तक पहुँचे' },
      { en: 'Exactly 24 hours after it began', hi: 'आरम्भ होने के ठीक 24 घण्टे बाद' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Purnima is tithi 15, spanning from 168 to 180 degrees. It ends the moment elongation reaches exactly 180 degrees. At 179 degrees (from our example), Purnima is nearing its end — the binary search would find the exact minute when 180 degrees is reached.',
      hi: 'पूर्णिमा 15वीं तिथि है, 168 से 180 अंश तक। यह उस क्षण समाप्त होती है जब कोणीय दूरी ठीक 180 अंश तक पहुँचती है। हमारे उदाहरण में 179 अंश पर पूर्णिमा समाप्ति के निकट है — द्विभाजन खोज ठीक वह मिनट ज्ञात करेगी जब 180 अंश प्राप्त होते हैं।',
    },
  },
];

function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'तिथि की अवधि क्यों बदलती है' : 'Why Tithi Duration Varies'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'एक तिथि तब पूर्ण होती है जब चन्द्रमा सूर्य से 12 अंश की कोणीय दूरी अर्जित करता है। इसमें लगने वाला समय पूर्णतः इस पर निर्भर करता है कि उस क्षण चन्द्रमा सूर्य की तुलना में कितनी तीव्रता से चल रहा है। चन्द्रमा की गति स्थिर नहीं है — वह केपलर के द्वितीय नियम का पालन करता है, अपनी दीर्घवृत्ताकार कक्षा में समान समय में समान क्षेत्रफल को आच्छादित करता है। उपभू (पृथ्वी से निकटतम, लगभग 3,56,500 किमी) के निकट चन्द्रमा लगभग 15.4 अंश प्रतिदिन चलता है। अपभू (दूरस्थतम, लगभग 4,06,700 किमी) के निकट यह मात्र 11.8 अंश प्रतिदिन चलता है। इसी बीच सूर्य की दृश्य गति लगभग 0.9 से 1.0 अंश प्रतिदिन होती है।'
            : 'A tithi is completed when the Moon gains 12 degrees of elongation over the Sun. The time this takes depends entirely on how fast the Moon is moving relative to the Sun at that moment. The Moon&apos;s speed is not constant — it follows Kepler&apos;s second law, sweeping out equal areas in equal times along its elliptical orbit. Near perigee (closest to Earth, about 356,500 km), the Moon races at roughly 15.4 degrees per day. Near apogee (farthest, about 406,700 km), it crawls at roughly 11.8 degrees per day. Meanwhile, the Sun&apos;s apparent motion is approximately 0.9 to 1.0 degrees per day.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'अतः शुद्ध सापेक्ष गति (चन्द्र घटा सूर्य) लगभग 10.8 से 14.5 अंश प्रतिदिन तक होती है। अधिकतम गति पर एक तिथि 12 / 14.5 = लगभग 19.9 घण्टे लेती है। न्यूनतम गति पर 12 / 10.8 = लगभग 26.7 घण्टे। यही कारण है कि कोई भी दो क्रमागत तिथियाँ समान अवधि की नहीं होतीं, और पंचांग को निश्चित अनुसूची का पालन करने के बजाय प्रत्येक दिन और स्थान हेतु नये सिरे से गणना करना पड़ता है।'
            : 'The net relative speed (Moon minus Sun) thus ranges from about 10.8 to 14.5 degrees per day. A tithi at maximum speed takes 12 / 14.5 = approximately 19.9 hours. A tithi at minimum speed takes 12 / 10.8 = approximately 26.7 hours. This is why no two consecutive tithis are identical in length, and why the Panchang must be computed fresh for every day and location rather than simply following a fixed schedule.'}
        </p>
      </section>

      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'सूर्योदय की तिथि' : 'Tithi at Sunrise'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'हिन्दू दिनांक (दिवस) एक सूर्योदय से अगले सूर्योदय तक गिना जाता है। स्थानीय सूर्योदय के क्षण जो तिथि चल रही हो वही उस दिन की अधिकृत तिथि होती है। सबसे सामान्य स्थिति में एक तिथि एक सूर्योदय के बाद आरम्भ होकर अगले से पहले समाप्त हो जाती है — वह तिथि पहले सूर्योदय पर उपस्थित होती है किन्तु दूसरे पर नहीं, और दिन उसके नाम पर होता है। जब कोई तिथि दो सूर्योदयों तक फैली हो (दोनों पर उपस्थित) तो वृद्धि की स्थिति होती है। जब कोई तिथि दो सूर्योदयों के बीच पूर्णतया समा जाए (किसी पर उपस्थित न हो) तो क्षय की स्थिति होती है।'
            : 'The Hindu calendar day (divasa) is reckoned from one sunrise to the next. The tithi prevailing at the moment of local sunrise determines that day&apos;s official tithi. In the most common scenario, a tithi starts after one sunrise and ends before the next — that tithi is present at the first sunrise but not the second, and the day bears its name. When a tithi spans two sunrises (is present at both), we have a Vriddhi situation. When a tithi fits entirely between two sunrises (present at neither), we have a Kshaya situation.'}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-[10px] uppercase tracking-widest font-bold mb-2">{isHi ? 'शास्त्रीय उत्पत्ति' : 'Classical Origin'}</h4>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'क्षय और वृद्धि तिथियों के नियम धर्मशास्त्र ग्रन्थों जैसे निर्णय सिन्धु (17वीं शताब्दी) और धर्म सिन्धु में संहिताबद्ध हैं, जो त्योहारों और अनुष्ठानों के निर्धारण के लिए प्रामाणिक मार्गदर्शक हैं। सूर्य सिद्धान्त गणितीय आधार प्रदान करता है, जबकि मुहूर्त चिन्तामणि जैसे ग्रन्थ मुहूर्त ज्योतिष के लिए व्यावहारिक निहितार्थों का विस्तार करते हैं। सूर्योदय-आधारित गणना की परम्परा सभी हिन्दू पंचांग पद्धतियों में सार्वभौमिक है।'
            : 'The rules for handling Kshaya and Vriddhi tithis are codified in Dharmashastra texts like the Nirnaya Sindhu (17th century) and Dharma Sindhu, which serve as authoritative guides for festival and ritual scheduling. Surya Siddhanta provides the mathematical foundation, while texts like Muhurta Chintamani elaborate on the practical implications for electional astrology. The sunrise-reckoning convention is universal across all Hindu Panchang traditions.'}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'वृद्धि तिथि एवं पारण समय' : 'Vriddhi (Extra) Tithi & Parana Timing'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'वृद्धि (अधिक या दोहरी) तिथि तब होती है जब चन्द्रमा इतना मन्द चलता है कि एक तिथि तीन क्रमागत सूर्योदयों तक फैल जाती है। उदाहरणार्थ, यदि एकादशी सूर्योदय अ से पहले आरम्भ हो और सूर्योदय स के बाद समाप्त हो, तो दिवस अ-ब और दिवस ब-स दोनों के सूर्योदय पर एकादशी होगी। पंचांग में यह दो लगातार दिनों पर एकादशी के रूप में दिखता है। निर्णय सिन्धु विस्तृत नियम प्रदान करता है कि किन अनुष्ठानों हेतु किस दिन का प्रयोग करना चाहिए।'
            : 'A Vriddhi (also called Adhika or repeated) tithi occurs when the Moon moves so slowly that a single tithi spans three consecutive sunrises. For example, if Ekadashi begins before Sunrise A and ends after Sunrise C, then both Day A-to-B and Day B-to-C have Ekadashi at their respective sunrises. In the calendar, this appears as Ekadashi being listed on two consecutive days. The Nirnaya Sindhu provides detailed rules for which of the two days should be used for specific observances.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'पारण एकादशी उपवास तोड़ने की क्रिया है। इसका समय अत्यन्त महत्वपूर्ण है: उपवास एकादशी तिथि समाप्त होने के बाद (अर्थात् द्वादशी आरम्भ होने पर) किन्तु द्वादशी तिथि स्वयं समाप्त होने से पहले तोड़ना चाहिए। यदि द्वादशी भोजन से पहले ही समाप्त हो जाए तो उपवास एक विशिष्ट अन्तिम समय (सामान्यतः सूर्योदय के बाद दिन का एक-चौथाई) से पहले तोड़ना अनिवार्य है। इसके अतिरिक्त, कुछ परम्पराओं के अनुसार पारण हरि वासर — द्वादशी तिथि के प्रथम चतुर्थांश — में नहीं करना चाहिए। ये नियम पारण समय-निर्धारण को व्यावहारिक पंचांग उपयोग की सबसे जटिल गणनाओं में से एक बनाते हैं।'
            : 'Parana refers to the act of breaking an Ekadashi fast. The timing is critical: one must break the fast after Ekadashi tithi has ended (i.e., Dwadashi has begun) but before Dwadashi tithi itself ends. If Dwadashi ends before one can eat, the fast must be broken before a specific cutoff time (typically one-fourth of the day after sunrise). Additionally, Parana must not be done during Hari Vasara — the first quarter of Dwadashi tithi — according to some traditions. These rules make Parana timing one of the most complex calculations in practical Panchang usage.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed mb-2">
          {isHi ? <><span className="text-gold-light font-medium">वृद्धि उदाहरण:</span> मान लें सप्तमी तिथि सोमवार प्रातः 4:30 (सूर्योदय 6:15 से पहले) आरम्भ होकर बुधवार प्रातः 7:45 पर समाप्त होती है। सप्तमी सोमवार और मंगलवार दोनों के सूर्योदय पर उपस्थित है। सोमवार प्रथम सप्तमी और मंगलवार वृद्धि (दोहरी) सप्तमी है। सप्तमी से जुड़े अधिकांश त्योहारों हेतु प्रथम दिन (सोमवार) प्रयुक्त होता है।</> : <><span className="text-gold-light font-medium">Vriddhi Example:</span> Suppose Saptami tithi begins at 4:30 AM (before sunrise at 6:15 AM) on Monday and ends at 7:45 AM on Wednesday. Saptami is present at sunrise on both Monday and Tuesday. Monday is the first Saptami day and Tuesday is the Vriddhi (repeated) Saptami day. For most festivals tied to Saptami, the first day (Monday) is used.</>}
        </p>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">पारण उदाहरण:</span> एकादशी तिथि बुधवार प्रातः 9:42 पर समाप्त होती है। द्वादशी तिथि बुधवार 9:42 से गुरुवार 11:15 तक चलती है। बुधवार सूर्योदय 6:10 है। पारण का समय 9:42 (जब द्वादशी आरम्भ हो) पर खुलता है और भक्त को 9:42 से गुरुवार 11:15 के बीच उपवास तोड़ना चाहिए — आदर्श रूप से बुधवार प्रातः 9:42 के तुरन्त बाद।</> : <><span className="text-gold-light font-medium">Parana Example:</span> Ekadashi tithi ends at 9:42 AM on Wednesday. Dwadashi tithi runs from 9:42 AM Wednesday to 11:15 AM Thursday. Sunrise Wednesday is 6:10 AM. The Parana window opens at 9:42 AM (when Dwadashi begins) and the devotee should break the fast between 9:42 AM and 11:15 AM Thursday — ideally on Wednesday morning itself after 9:42 AM.</>}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> "पारण एकादशी के अगले दिन सुबह कभी भी किया जा सकता है।" यह गलत है और एकादशी तिथि चलते हुए (यदि एकादशी देर सुबह समाप्त हो) उपवास तोड़ सकता है। सदैव एकादशी समाप्ति का सटीक समय देखें। यदि यह प्रातः 10:30 पर समाप्त होती है तो 7:00 बजे भोजन करना एकादशी के दौरान ही उपवास तोड़ना होगा, जिससे व्रत का पुण्य नष्ट हो जाएगा।</> : <><span className="text-gold-light font-medium">Misconception:</span> "Parana can be done any time the next morning after Ekadashi." This is incorrect and can lead to breaking the fast while Ekadashi tithi is still running (if Ekadashi ends late morning). Always check the exact Ekadashi end time. If it ends at 10:30 AM, eating at 7 AM would break the fast during Ekadashi itself, losing the vrat&apos;s merit.</>}
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
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>{isHi ? 'कार्यान्वित गणना: भोगांश से तिथि निकालना' : 'Worked Calculation: Computing Tithi from Longitudes'}</h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? 'आइए एक पूर्ण तिथि गणना चरणबद्ध रूप से करें। किसी दिन सूर्योदय पर हमारा खगोलीय इंजन बताता है: चन्द्रमा का स्पष्ट भोगांश = 167 अंश, सूर्य का स्पष्ट भोगांश = 348 अंश। चरण 1: कोणीय दूरी निकालें। कोणीय दूरी = चन्द्र - सूर्य = 167 - 348 = -181 अंश। चूँकि यह ऋणात्मक है, 360 जोड़ें: -181 + 360 = 179 अंश। चरण 2: तिथि संख्या निकालें। तिथि = floor(179 / 12) + 1 = floor(14.9167) + 1 = 14 + 1 = 15। शुक्ल पक्ष में 15वीं तिथि पूर्णिमा है। चन्द्रमा सूर्य के लगभग विपरीत है — पूर्ण चन्द्र के अनुरूप।'
            : 'Let us work through a complete tithi calculation step by step. At sunrise on a given day, our astronomical engine reports: Moon&apos;s true longitude = 167 degrees, Sun&apos;s true longitude = 348 degrees. Step 1: Compute elongation. Elongation = Moon - Sun = 167 - 348 = -181 degrees. Since this is negative, add 360: -181 + 360 = 179 degrees. Step 2: Compute tithi number. Tithi = floor(179 / 12) + 1 = floor(14.9167) + 1 = 14 + 1 = 15. Tithi 15 in Shukla Paksha is Purnima. The Moon is nearly opposite the Sun — consistent with a full Moon.'}
        </p>
        <p className="text-text-secondary text-sm leading-relaxed">
          {isHi
            ? 'चरण 3: पूर्णिमा कब समाप्त होती है? पूर्णिमा 168 से 180 अंश तक फैली है। वर्तमान कोणीय दूरी 179 अंश है — 180 के बहुत निकट। हमें ठीक वह क्षण ज्ञात करना है जब कोणीय दूरी = 180 अंश हो। द्विभाजन खोज से: क्रमिक अर्ध-अन्तरालों पर कोणीय दूरी जाँचें। यदि 2 घण्टे बाद कोणीय दूरी = 181.5 अंश, तो सीमा-पार अभी और तब के बीच हुआ। पुनः द्विभाजन: 1 घण्टे पर कोणीय दूरी = 180.3 अंश — अभी भी पार। 30 मिनट पर: 179.6 अंश — अभी नहीं। द्विभाजन जारी रखें जब तक सटीकता एक मिनट न हो जाए। मान लें उत्तर सूर्योदय से 47 मिनट है। तब पूर्णिमा सूर्योदय + 47 मिनट पर समाप्त होती है।'
            : 'Step 3: When does Purnima end? Purnima spans 168 to 180 degrees. The current elongation is 179 degrees — very close to 180. We need to find the exact moment when elongation = 180 degrees. Using binary search: check the elongation at successive half-intervals. If at 2 hours later elongation = 181.5 degrees, the crossing happened between now and then. Bisect again: at 1 hour, elongation = 180.3 degrees — still past. At 30 minutes: 179.6 degrees — not yet. Continue bisecting until precision reaches one minute. Suppose the answer is 47 minutes from sunrise. Then Purnima ends at sunrise + 47 minutes.'}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-emerald-500/15">
        <h4 className="text-emerald-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'कार्यान्वित उदाहरण' : 'Worked Examples'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">क्षय उदाहरण:</span> मान लें नवमी मंगलवार प्रातः 8:15 (सूर्योदय 6:20 के बाद) आरम्भ होती है और चन्द्रमा उपभू के निकट 15.2 अंश/दिन चल रहा है। शुद्ध सापेक्ष गति = 15.2 - 1.0 = 14.2 अंश/दिन। तिथि अवधि = 12 / 14.2 = 20.3 घण्टे। नवमी 8:15 + 20.3 घण्टे = बुधवार प्रातः 4:33 (सूर्योदय 6:20 से पहले) समाप्त। परिणाम: नवमी किसी सूर्योदय पर उपस्थित नहीं। यह क्षय तिथि है। मंगलवार को सूर्योदय पर अष्टमी और बुधवार को दशमी — नवमी पंचांग से छूट गई।</> : <><span className="text-gold-light font-medium">Kshaya Example:</span> Suppose Navami begins at 8:15 AM Tuesday (after sunrise at 6:20 AM) and the Moon is near perigee, moving at 15.2 degrees/day. Net relative speed = 15.2 - 1.0 = 14.2 degrees/day. Tithi duration = 12 / 14.2 = 20.3 hours. Navami ends at 8:15 AM + 20.3 hours = 4:33 AM Wednesday (before sunrise at 6:20 AM). Result: Navami is not present at any sunrise. It is a Kshaya tithi. Tuesday has Ashtami at sunrise, and Wednesday has Dashami at sunrise — Navami is skipped in the calendar.</>}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-red-500/15">
        <h4 className="text-red-400 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'सामान्य भ्रान्तियाँ' : 'Common Misconceptions'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi ? <><span className="text-gold-light font-medium">भ्रान्ति:</span> "तिथि समाप्ति समय 12 अंश को चन्द्रमा की औसत गति से भाग देकर निकाला जा सकता है।" यह एक सन्निकटन तो देता है किन्तु एक घण्टे से अधिक की त्रुटि हो सकती है क्योंकि चन्द्रमा की गति दिनभर निरन्तर बदलती रहती है। द्विभाजन खोज विधि प्रत्येक चरण पर चन्द्र और सूर्य की स्थिति पुनः गणना करती है, वास्तविक-समय गति परिवर्तन को पकड़ती है, यही कारण है कि आधुनिक पंचांग सॉफ्टवेयर मिनट-स्तर की सटीकता प्राप्त करता है।</> : <><span className="text-gold-light font-medium">Misconception:</span> "You can compute tithi end time by simply dividing 12 degrees by the average Moon speed." While this gives an approximation, it can be off by over an hour because the Moon&apos;s speed changes continuously throughout the day. The binary search method recomputes Moon and Sun positions at each iteration, capturing the real-time speed variation, which is why modern Panchang software achieves minute-level accuracy.</>}
        </p>
      </section>

      <section className="glass-card rounded-xl p-5 border border-blue-500/15">
        <h4 className="text-blue-300 text-[10px] uppercase tracking-widest font-bold mb-3">{isHi ? 'आधुनिक प्रासंगिकता' : 'Modern Relevance'}</h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? 'हमारा पंचांग इंजन तिथि-तालिका मॉड्यूल में ठीक यही द्विभाजन खोज विधि लागू करता है। प्रत्येक दिन के लिए यह मीयस एल्गोरिदम से सूर्योदय पर चन्द्र और सूर्य भोगांश गणना करता है, कोणीय दूरी निकालता है, तिथि पहचानता है, फिर पुनरावर्ती द्विभाजन से एक मिनट के भीतर सटीक आरम्भ और समाप्ति समय ज्ञात करता है। क्षय और वृद्धि तिथियाँ स्वचालित रूप से पहचानी और चिह्नित की जाती हैं। एकादशी व्रत हेतु पारण समय द्वादशी के सटीक आरम्भ और समाप्ति समय ज्ञात कर सूर्योदय-सूर्यास्त खिड़की से प्रतिच्छेदन द्वारा निकाला जाता है।'
            : 'Our Panchang engine implements precisely this binary search approach in the tithi-table module. For each day, it computes Moon and Sun longitudes at sunrise using Meeus algorithms, derives the elongation, identifies the tithi, then uses iterative bisection to find the exact start and end times to within one minute. Kshaya and Vriddhi tithis are automatically detected and flagged. The Parana window for Ekadashi fasts is computed by finding the exact Dwadashi start and end times, then intersecting with the sunrise-to-sunset window.'}
        </p>
      </section>
    </div>
  );
}

export default function Module5_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}

'use client';

import ModuleContainer, { type ModuleMeta, type ModuleQuestion, useModuleLocale } from '@/components/learn/ModuleContainer';

const META: ModuleMeta = {
  id: 'mod_26_3', phase: 6, topic: 'Indian Contributions', moduleNumber: '26.3',
  title: { en: 'Speed of Light — 14th Century Text', hi: 'प्रकाश की गति — 14वीं शताब्दी का ग्रन्थ' },
  subtitle: {
    en: 'A 14th century CE Sanskrit commentary on the Rig Veda contains a value for the speed of light accurate to 0.14% — 300 years before Ole Rømer',
    hi: 'ऋग्वेद पर 14वीं शताब्दी की एक संस्कृत टिप्पणी में प्रकाश की गति का एक मान है जो 0.14% सटीक है — ओले रोमर से 300 वर्ष पहले',
  },
  estimatedMinutes: 12,
  crossRefs: [
    { label: { en: 'Module 26-1: Earth Rotates', hi: 'मॉड्यूल 26-1: पृथ्वी घूमती है' }, href: '/learn/modules/26-1' },
    { label: { en: 'Module 26-2: Gravity Before Newton', hi: 'मॉड्यूल 26-2: न्यूटन से पहले गुरुत्वाकर्षण' }, href: '/learn/modules/26-2' },
    { label: { en: 'Module 26-4: Cosmic Time', hi: 'मॉड्यूल 26-4: ब्रह्मांडीय समय' }, href: '/learn/modules/26-4' },
  ],
};

const QUESTIONS: ModuleQuestion[] = [
  {
    id: 'q26_3_01', type: 'mcq',
    question: {
      en: 'Who gave a value for the speed of light in a 14th century Sanskrit text?',
      hi: 'किसने 14वीं शताब्दी के एक संस्कृत ग्रन्थ में प्रकाश की गति का एक मान दिया?',
    },
    options: [
      { en: 'Aryabhata', hi: 'आर्यभट' },
      { en: 'Sayana', hi: 'सायण' },
      { en: 'Brahmagupta', hi: 'ब्रह्मगुप्त' },
      { en: 'Bhaskaracharya', hi: 'भास्कराचार्य' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sayana (also Sayanacharya, c. 1315–1387 CE), a 14th century Vedic scholar and commentator, gave a remarkably precise value for the speed of light in his commentary on the Rig Veda. He was the prime minister of the Vijayanagara Empire and one of the most important Sanskrit commentators in history — his commentaries on the Vedas remain the primary reference for Vedic interpretation. The speed of light value appears in his commentary on Rig Veda hymn 1.50.4, a hymn to the Sun god Surya.',
      hi: 'सायण (सायणाचार्य भी, लगभग 1315-1387 ईस्वी), एक 14वीं शताब्दी के वैदिक विद्वान और टिप्पणीकार, ने ऋग्वेद पर अपनी टिप्पणी में प्रकाश की गति के लिए एक उल्लेखनीय सटीक मान दिया। वे विजयनगर साम्राज्य के प्रधानमंत्री थे और इतिहास के सबसे महत्त्वपूर्ण संस्कृत टिप्पणीकारों में से एक थे। प्रकाश की गति का मान ऋग्वेद के सूर्य देवता को समर्पित भजन 1.50.4 पर उनकी टिप्पणी में प्रकट होता है।',
    },
  },
  {
    id: 'q26_3_02', type: 'mcq',
    question: {
      en: 'In which text did Sayana give the speed of light value?',
      hi: 'किस ग्रन्थ में सायण ने प्रकाश की गति का मान दिया?',
    },
    options: [
      { en: 'Arthashastra', hi: 'अर्थशास्त्र' },
      { en: 'Sayana\'s commentary on the Rig Veda', hi: 'ऋग्वेद पर सायण की टिप्पणी' },
      { en: 'Surya Siddhanta', hi: 'सूर्य सिद्धान्त' },
      { en: 'Pancha Siddhantika', hi: 'पञ्च सिद्धान्तिका' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The value appears in Sayana\'s commentary (bhashya) on the Rig Veda, the oldest of the four Vedas and one of the oldest texts in any language. Sayana wrote extensive commentaries on all the Vedas, and his commentary on the Rig Veda (Rigveda Bhashya) is considered a masterwork of Sanskrit scholarship. The specific passage occurs in his commentary on Rig Veda hymn 1.50.4 — a hymn to Surya (the Sun). Sayana interprets a verse about the Sun\'s rays and, in doing so, states a specific velocity in terms of yojanas per half-nimesha.',
      hi: 'यह मान ऋग्वेद पर सायण की टिप्पणी (भाष्य) में प्रकट होता है, जो चार वेदों में सबसे पुराना और किसी भी भाषा के सबसे पुराने ग्रन्थों में से एक है। सायण ने सभी वेदों पर विस्तृत टिप्पणियाँ लिखीं, और ऋग्वेद पर उनकी टिप्पणी (ऋग्वेदभाष्य) संस्कृत विद्वत्ता की एक मास्टरवर्क मानी जाती है। विशिष्ट अंश ऋग्वेद के भजन 1.50.4 — सूर्य को समर्पित — पर उनकी टिप्पणी में आता है।',
    },
  },
  {
    id: 'q26_3_03', type: 'mcq',
    question: {
      en: 'Which specific hymn in the Rig Veda contains the passage that Sayana commented on regarding light speed?',
      hi: 'ऋग्वेद के किस विशिष्ट भजन में वह अंश है जिस पर सायण ने प्रकाश की गति के संबंध में टिप्पणी की?',
    },
    options: [
      { en: 'Rig Veda 1.1.1 — hymn to Agni', hi: 'ऋग्वेद 1.1.1 — अग्नि को भजन' },
      { en: 'Rig Veda 1.50.4 — hymn to Surya', hi: 'ऋग्वेद 1.50.4 — सूर्य को भजन' },
      { en: 'Rig Veda 10.90 — Purusha Sukta', hi: 'ऋग्वेद 10.90 — पुरुष सूक्त' },
      { en: 'Rig Veda 9.114 — Soma hymn', hi: 'ऋग्वेद 9.114 — सोम भजन' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sayana\'s speed of light value appears in his commentary on Rig Veda 1.50.4, a verse from the 50th hymn of the first Mandala, addressed to Surya (the Sun god). The original verse praises the Sun\'s swift movement across the sky. Sayana, in interpreting how fast the Sun\'s light travels, states: "Thus it is remembered: O Surya, you who traverse 2,202 yojanas in half a nimesha." This is his gloss on the velocity of the Sun\'s light rays. The question debated by modern scholars is whether Sayana was stating a known astronomical value or using a traditional hyperbolic expression of the Sun\'s speed.',
      hi: 'सायण के प्रकाश की गति के मान ऋग्वेद 1.50.4 पर उनकी टिप्पणी में प्रकट होते हैं, पहले मण्डल के 50वें भजन का एक श्लोक, सूर्य (सूर्य देवता) को संबोधित। मूल श्लोक आकाश में सूर्य की तेज गति की प्रशंसा करता है। सायण, सूर्य के प्रकाश कितनी तेज़ यात्रा करता है की व्याख्या करते हुए कहते हैं: "इस प्रकार स्मरण किया गया है: हे सूर्य, तुम जो आधे निमेष में 2,202 योजन पार करते हो।" यह सूर्य की प्रकाश किरणों की गति पर उनकी टिप्पणी है।',
    },
  },
  {
    id: 'q26_3_04', type: 'mcq',
    question: {
      en: 'What value did Sayana give for the speed of light in his Rig Veda commentary?',
      hi: 'ऋग्वेद टिप्पणी में सायण ने प्रकाश की गति के लिए क्या मान दिया?',
    },
    options: [
      { en: '1,000 yojanas per half-nimesha', hi: '1,000 योजन प्रति अर्ध-निमेष' },
      { en: '2,202 yojanas per half-nimesha', hi: '2,202 योजन प्रति अर्ध-निमेष' },
      { en: '4,404 yojanas per nimesha', hi: '4,404 योजन प्रति निमेष' },
      { en: '10,000 yojanas per muhurta', hi: '10,000 योजन प्रति मुहूर्त' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'Sayana stated that the Sun\'s light travels "2,202 yojanas in half a nimesha." A yojana is an ancient Indian unit of distance — approximately 9.09 miles (14.6 km). A nimesha is an ancient Indian unit of time — roughly 16/75 of a second; half a nimesha is approximately 8/75 seconds (about 0.1067 seconds). Converting: 2,202 yojanas × 9.09 miles/yojana = 20,015 miles, divided by ~0.1067 seconds = approximately 187,600 miles per second. The modern speed of light is 186,282 miles per second. Sayana\'s value is ~186,536 miles per second — an astonishing approximation.',
      hi: 'सायण ने कहा कि सूर्य का प्रकाश "आधे निमेष में 2,202 योजन" यात्रा करता है। योजन एक प्राचीन भारतीय दूरी की इकाई है — लगभग 9.09 मील (14.6 किमी)। निमेष एक प्राचीन भारतीय समय की इकाई है — लगभग 16/75 सेकंड; आधा निमेष लगभग 8/75 सेकंड (लगभग 0.1067 सेकंड)। रूपान्तरण: 2,202 योजन × 9.09 मील/योजन = 20,015 मील, ~0.1067 सेकंड से विभाजित = लगभग 187,600 मील प्रति सेकंड। प्रकाश की आधुनिक गति 186,282 मील प्रति सेकंड है।',
    },
  },
  {
    id: 'q26_3_05', type: 'mcq',
    question: {
      en: 'What is the modern speed of light in miles per second?',
      hi: 'मील प्रति सेकंड में प्रकाश की आधुनिक गति क्या है?',
    },
    options: [
      { en: '150,000 miles per second', hi: '150,000 मील प्रति सेकंड' },
      { en: '186,282 miles per second', hi: '186,282 मील प्रति सेकंड' },
      { en: '200,000 miles per second', hi: '200,000 मील प्रति सेकंड' },
      { en: '225,000 miles per second', hi: '225,000 मील प्रति सेकंड' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'The modern precise value of the speed of light in vacuum is 186,282.397 miles per second (299,792,458 metres per second — this is now a defined constant). Sayana\'s value, when computed using the conversion 1 yojana ≈ 9.09 miles and 1 half-nimesha ≈ 0.1067 seconds, comes out to approximately 186,536 miles per second. The difference is about 254 miles per second, giving an accuracy of 99.86% — or an error of only 0.14%. Whether this represents actual measurement or coincidence is debated by scholars.',
      hi: 'निर्वात में प्रकाश की गति का आधुनिक सटीक मान 186,282.397 मील प्रति सेकंड है (299,792,458 मीटर प्रति सेकंड — यह अब एक परिभाषित स्थिरांक है)। सायण का मान, जब 1 योजन ≈ 9.09 मील और 1 अर्ध-निमेष ≈ 0.1067 सेकंड रूपान्तरण का उपयोग करके गणना की जाती है, लगभग 186,536 मील प्रति सेकंड आता है। अंतर लगभग 254 मील प्रति सेकंड है, जो 99.86% की सटीकता देता है — या केवल 0.14% की त्रुटि।',
    },
  },
  {
    id: 'q26_3_06', type: 'mcq',
    question: {
      en: 'How accurate is Sayana\'s computed speed of light compared to the modern value?',
      hi: 'आधुनिक मान की तुलना में सायण की गणना की गई प्रकाश की गति कितनी सटीक है?',
    },
    options: [
      { en: 'About 85% accurate (15% error)', hi: 'लगभग 85% सटीक (15% त्रुटि)' },
      { en: 'About 95% accurate (5% error)', hi: 'लगभग 95% सटीक (5% त्रुटि)' },
      { en: 'About 99.86% accurate (0.14% error)', hi: 'लगभग 99.86% सटीक (0.14% त्रुटि)' },
      { en: 'Exactly 100% accurate (0% error)', hi: 'बिल्कुल 100% सटीक (0% त्रुटि)' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'When Sayana\'s value of 2,202 yojanas per half-nimesha is converted using standard unit conversions (1 yojana ≈ 9.09 miles, 1 half-nimesha ≈ 1/75th of a second × 8 = ~0.1067s), the result is approximately 186,536 miles per second. The modern speed of light is 186,282 miles per second. The percentage error is: (186,536 - 186,282) / 186,282 × 100 ≈ 0.14%. This level of accuracy — 99.86% — is remarkable for a 14th century text. The key scholarly debate is whether this represents intentional measurement or a striking numerical coincidence.',
      hi: 'जब सायण के 2,202 योजन प्रति अर्ध-निमेष के मान को मानक इकाई रूपान्तरण (1 योजन ≈ 9.09 मील, 1 अर्ध-निमेष ≈ ~0.1067 सेकंड) का उपयोग करके परिवर्तित किया जाता है, तो परिणाम लगभग 186,536 मील प्रति सेकंड है। प्रकाश की आधुनिक गति 186,282 मील प्रति सेकंड है। प्रतिशत त्रुटि: (186,536 - 186,282) / 186,282 × 100 ≈ 0.14%। 14वीं शताब्दी के ग्रन्थ के लिए यह सटीकता — 99.86% — उल्लेखनीय है।',
    },
  },
  {
    id: 'q26_3_07', type: 'mcq',
    question: {
      en: 'What measurement unit is central to computing Sayana\'s speed of light?',
      hi: 'सायण की प्रकाश की गति की गणना में कौन सी माप इकाई केन्द्रीय है?',
    },
    options: [
      { en: 'Hasta (cubit ≈ 18 inches)', hi: 'हस्त (हाथ ≈ 18 इंच)' },
      { en: 'Yojana (≈ 9.09 miles)', hi: 'योजन (≈ 9.09 मील)' },
      { en: 'Gavyuti (≈ 4 miles)', hi: 'गव्यूति (≈ 4 मील)' },
      { en: 'Krosa (≈ 2.25 miles)', hi: 'क्रोस (≈ 2.25 मील)' },
    ],
    correctAnswer: 1,
    explanation: {
      en: 'A yojana is the distance unit used in Sayana\'s statement. The exact length of a yojana has varied across texts and time periods — this is one of the key complexities in interpreting the passage. Different scholars use different conversions: some use 9.09 miles, others use 8 km, and some as high as 13-16 km. The value of 9.09 miles per yojana is derived from Arthashastra measurements and is widely used in astronomical contexts. The conversion that gives 0.14% accuracy uses 1 yojana = 9.09 miles. If a different yojana value is used, the correspondence changes significantly.',
      hi: 'योजन वह दूरी की इकाई है जो सायण के कथन में उपयोग की गई है। एक योजन की सटीक लम्बाई ग्रन्थों और समय अवधियों में भिन्न रही है — यह अंश की व्याख्या करने में एक प्रमुख जटिलता है। विभिन्न विद्वान विभिन्न रूपान्तरणों का उपयोग करते हैं: कुछ 9.09 मील, अन्य 8 किमी, और कुछ 13-16 किमी तक। 9.09 मील प्रति योजन का मान अर्थशास्त्र माप से व्युत्पन्न है और खगोलीय संदर्भों में व्यापक रूप से उपयोग किया जाता है।',
    },
  },
  {
    id: 'q26_3_08', type: 'mcq',
    question: {
      en: 'Ole Rømer made the first definitive measurement of the speed of light in what year?',
      hi: 'ओले रोमर ने प्रकाश की गति का पहला निश्चित माप किस वर्ष किया?',
    },
    options: [
      { en: '1543 CE', hi: '1543 ईस्वी' },
      { en: '1609 CE', hi: '1609 ईस्वी' },
      { en: '1676 CE', hi: '1676 ईस्वी' },
      { en: '1729 CE', hi: '1729 ईस्वी' },
    ],
    correctAnswer: 2,
    explanation: {
      en: 'Ole Rømer, a Danish astronomer, made the first definitive measurement of the speed of light in 1676 CE, using observations of Jupiter\'s moon Io. He noticed that Io\'s eclipses by Jupiter occurred slightly later than predicted when Earth was far from Jupiter, and slightly earlier when Earth was closer. He correctly attributed this discrepancy to the finite travel time of light across the varying Earth-Jupiter distance. His measurement gave approximately 220,000 km/s — about 26% too high, but the first to establish that light travels at a finite, measurable speed. Sayana\'s text was written around 1380 CE — about 300 years before Rømer.',
      hi: 'ओले रोमर, एक डेनिश खगोलशास्त्री, ने 1676 ईस्वी में बृहस्पति के चन्द्रमा Io के अवलोकनों का उपयोग करके प्रकाश की गति का पहला निश्चित माप किया। उन्होंने देखा कि बृहस्पति द्वारा Io के ग्रहण पृथ्वी के बृहस्पति से दूर होने पर भविष्यवाणी से थोड़ा बाद में और पास होने पर थोड़ा पहले हुए। उन्होंने इस विसंगति को सही ढंग से पृथ्वी-बृहस्पति की भिन्न दूरी में प्रकाश के परिमित यात्रा समय के लिए जिम्मेदार ठहराया। सायण का ग्रन्थ लगभग 1380 ईस्वी में लिखा गया था — रोमर से लगभग 300 वर्ष पहले।',
    },
  },
  {
    id: 'q26_3_09', type: 'true_false',
    question: {
      en: 'Ole Rømer made the first European measurement of the speed of light approximately 300 years after Sayana wrote his Rig Veda commentary.',
      hi: 'ओले रोमर ने सायण के ऋग्वेद टिप्पणी लिखने के लगभग 300 वर्ष बाद प्रकाश की गति का पहला यूरोपीय माप किया।',
    },
    correctAnswer: true,
    explanation: {
      en: 'True. Sayana wrote his commentary on the Rig Veda around 1380 CE (he lived c. 1315–1387 CE). Ole Rømer measured the speed of light in 1676 CE. The gap is approximately 296 years — close to 300 years. Rømer\'s measurement was the first in European science to demonstrate that light has a finite, measurable speed. Before Rømer, most European scientists (including Descartes) believed light traveled instantaneously. The historical sequence is: Sayana\'s text (~1380 CE) → Rømer\'s measurement (1676 CE) → Maxwell\'s electromagnetic theory (1865 CE) → Einstein\'s special relativity (1905 CE).',
      hi: 'सत्य। सायण ने लगभग 1380 ईस्वी में ऋग्वेद पर अपनी टिप्पणी लिखी (वे लगभग 1315-1387 ईस्वी में जीवित थे)। ओले रोमर ने 1676 ईस्वी में प्रकाश की गति मापी। अंतर लगभग 296 वर्ष है — लगभग 300 वर्ष। रोमर का माप यूरोपीय विज्ञान में पहला था जिसने प्रदर्शित किया कि प्रकाश की एक परिमित, मापने योग्य गति है। रोमर से पहले, अधिकांश यूरोपीय वैज्ञानिकों (देकार्त सहित) का मानना था कि प्रकाश तात्कालिक रूप से यात्रा करता है।',
    },
  },
  {
    id: 'q26_3_10', type: 'true_false',
    question: {
      en: 'Scholars universally agree that Sayana\'s speed of light value was the result of intentional scientific measurement by ancient Indians.',
      hi: 'विद्वान सार्वभौमिक रूप से सहमत हैं कि सायण के प्रकाश की गति का मान प्राचीन भारतीयों द्वारा जानबूझकर वैज्ञानिक माप का परिणाम था।',
    },
    correctAnswer: false,
    explanation: {
      en: 'False. This is actively debated among scholars. Sceptics point out: (1) the exact length of a yojana varies across texts, and the specific value that gives 0.14% accuracy requires choosing one particular yojana length; (2) Sayana may have been using a conventional poetic expression about the Sun\'s speed, not making a scientific measurement; (3) the passage is in a religious commentary on a hymn, not a scientific treatise; (4) no explanation is given for how such a measurement could have been made. Proponents note: the numerical coincidence is extraordinarily precise. The honest conclusion is that it remains uncertain — possibly intentional knowledge, possibly a remarkable coincidence.',
      hi: 'असत्य। यह विद्वानों के बीच सक्रिय रूप से बहस में है। संदेहकर्ता बताते हैं: (1) योजन की सटीक लम्बाई ग्रन्थों में भिन्न होती है, और वह विशिष्ट मान जो 0.14% सटीकता देता है एक विशेष योजन लम्बाई चुनने की आवश्यकता है; (2) सायण एक पारंपरिक काव्यात्मक अभिव्यक्ति का उपयोग कर रहे होंगे, न कि वैज्ञानिक माप कर रहे; (3) यह अंश एक धार्मिक टिप्पणी में है, न कि वैज्ञानिक ग्रन्थ में; (4) यह नहीं बताया गया कि ऐसा माप कैसे किया गया होगा। समर्थक बताते हैं: संख्यात्मक संयोग असाधारण रूप से सटीक है।',
    },
  },
];

/* ------------------------------------------------------------------ */
/*  PAGE 1 — The Passage and Its Context                                */
/* ------------------------------------------------------------------ */
function Page1() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सायण की ऋग्वेद टिप्पणी' : 'Sayana\'s Rig Veda Commentary'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>14वीं शताब्दी ईस्वी में, विजयनगर साम्राज्य के प्रधानमंत्री और महान संस्कृत विद्वान सायणाचार्य ने ऋग्वेद पर एक व्यापक टिप्पणी लिखी। भजन 1.50.4 पर टिप्पणी करते समय — सूर्य देवता को एक भजन — उन्होंने एक कथन लिखा जो 21वीं शताब्दी में वैज्ञानिकों को चौंका देगा।</>
            : <>In the 14th century CE, Sayanacharya — prime minister of the Vijayanagara Empire and great Sanskrit scholar — wrote a comprehensive commentary on the Rig Veda. While commenting on hymn 1.50.4 — a hymn to the Sun god — he wrote a statement that would astonish scientists in the 21st century.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'मूल संस्कृत और अनुवाद' : 'Original Sanskrit and Translation'}
        </h4>
        <blockquote className="border-l-2 border-gold-primary/40 pl-4 mb-3">
          <p className="text-gold-light text-xs italic leading-relaxed font-devanagari">
            "तथा च स्मर्यते योजनानां सहस्रे द्वे द्वे शते द्वे च योजने  एकेन निमिषार्धेन क्रममाण नमोऽस्तु ते"
          </p>
          <p className="text-text-secondary text-xs mt-2 leading-relaxed">
            {isHi
              ? '"इस प्रकार स्मरण किया जाता है: हे [सूर्य], जो आधे निमेष में दो हज़ार दो सौ दो योजन पार करता है, तुम्हें नमस्कार है।"'
              : '"Thus it is remembered: O [Surya], you who traverse two thousand two hundred and two yojanas in half a nimesha, salutations to you."'}
          </p>
          <p className="text-text-secondary text-xs mt-1">— {isHi ? 'सायण, ऋग्वेदभाष्य, भजन 1.50.4 पर टिप्पणी (~1380 ईस्वी)' : 'Sayana, Rigvedabhashya, commentary on hymn 1.50.4 (~1380 CE)'}</p>
        </blockquote>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-amber-500/15 rounded-xl p-5">
        <h4 className="text-amber-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'इकाइयाँ समझना' : 'Understanding the Units'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">{isHi ? 'योजन:' : 'Yojana:'}</span> {isHi ? 'प्राचीन भारतीय दूरी की इकाई। अर्थशास्त्र के अनुसार ≈ 9.09 मील (14.6 किमी)।' : 'Ancient Indian distance unit. Per Arthashastra ≈ 9.09 miles (14.6 km).'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'निमेष:' : 'Nimesha:'}</span> {isHi ? 'पलक झपकाने का समय — प्राचीन भारतीय समय की इकाई। ≈ 16/75 सेकंड।' : 'A blink of an eye — ancient Indian time unit. ≈ 16/75 seconds.'}</p>
          <p><span className="text-gold-light font-medium">{isHi ? 'अर्ध-निमेष:' : 'Half-nimesha:'}</span> {isHi ? '≈ 8/75 सेकंड ≈ 0.1067 सेकंड।' : '≈ 8/75 seconds ≈ 0.1067 seconds.'}</p>
          <div className="mt-3 pt-3 border-t border-gold-primary/10">
            <p className="text-gold-light font-medium mb-1">{isHi ? 'गणना:' : 'Calculation:'}</p>
            <p className="font-mono text-xs text-gold-primary">2,202 × 9.09 mi / 0.1067 s ≈ 186,536 mi/s</p>
            <p className="font-mono text-xs text-emerald-400 mt-1">{isHi ? 'आधुनिक: 186,282 मील/सेकंड' : 'Modern: 186,282 mi/s'}</p>
            <p className="font-mono text-xs text-gold-light mt-1">{isHi ? 'त्रुटि: 0.14%' : 'Error: 0.14%'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 2 — The Scholarly Debate                                       */
/* ------------------------------------------------------------------ */
function Page2() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'विद्वत् बहस: संयोग या ज्ञान?' : 'The Scholarly Debate: Coincidence or Knowledge?'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>सायण के पाठ की ईमानदार समझ के लिए दोनों पक्षों की सावधानीपूर्वक जाँच की आवश्यकता है। यहाँ विद्वान वास्तव में क्या तर्क देते हैं।</>
            : <>An honest understanding of Sayana's text requires careful examination of both sides. Here is what scholars actually argue.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-emerald-500/15 rounded-xl p-5">
        <h4 className="text-emerald-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'समर्थन में तर्क' : 'Arguments in Support'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {isHi ? 'संख्यात्मक संयोग बेहद सटीक है (0.14% त्रुटि)' : 'The numerical coincidence is extraordinarily precise (0.14% error)'}</p>
          <p>→ {isHi ? 'सायण स्पष्ट रूप से कहते हैं यह "स्मरण किया जाता है" — एक पुरानी परम्परा को उद्धृत कर रहे हैं' : 'Sayana explicitly says this "is remembered" — citing an older tradition'}</p>
          <p>→ {isHi ? 'भारतीय खगोल विज्ञान ने अत्यन्त सटीक माप हासिल किए (आर्यभट, ब्रह्मगुप्त)' : 'Indian astronomy achieved extremely precise measurements (Aryabhata, Brahmagupta)'}</p>
          <p>→ {isHi ? 'नाक्षत्र वेग की गणना के लिए प्रकाश की सीमित गति की आवश्यकता हो सकती थी' : 'Computing stellar velocities may have required knowledge of finite light speed'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-red-500/15 rounded-xl p-5">
        <h4 className="text-red-400 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'संदेह के तर्क' : 'Arguments for Scepticism'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {isHi ? 'योजन की लम्बाई ग्रन्थों में 9-16 किमी तक भिन्न होती है — "सही" मान चुनना परिणाम को प्रभावित करता है' : 'Yojana length varies 9–16 km across texts — choosing the "right" value affects the result'}</p>
          <p>→ {isHi ? 'यह एक धार्मिक टिप्पणी है, न कि वैज्ञानिक ग्रन्थ' : 'This is a religious commentary, not a scientific treatise'}</p>
          <p>→ {isHi ? 'कोई व्याख्या नहीं दी गई कि यह माप कैसे किया गया' : 'No explanation given for how such a measurement could have been made'}</p>
          <p>→ {isHi ? 'प्राचीन काव्य में "सूर्य की गति" के लिए परंपरागत अतिशयोक्ति आम थी' : 'Conventional hyperbole for "speed of the Sun" was common in ancient poetry'}</p>
          <p>→ {isHi ? 'कोई अन्य भारतीय ग्रन्थ इस विशिष्ट मान का हवाला नहीं देता' : 'No other Indian text cites this specific value'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'निष्पक्ष निष्कर्ष' : 'Fair Conclusion'}
        </h4>
        <p className="text-text-secondary text-xs leading-relaxed">
          {isHi
            ? <>प्रश्न अनिर्णीत रहता है। संख्यात्मक समझौता उल्लेखनीय है और इसे खारिज नहीं किया जाना चाहिए। लेकिन संदेहकर्ताओं के तर्क भी वैध हैं। यह एक ऐसा मामला है जहाँ ईमानदार विद्वत्ता दोनों संभावनाओं को स्वीकार करती है — एक उल्लेखनीय प्राचीन माप, या एक उल्लेखनीय संयोग।</>
            : <>The question remains undecided. The numerical agreement is remarkable and should not be dismissed. But the sceptics' arguments are also valid. This is a case where honest scholarship acknowledges both possibilities — a remarkable ancient measurement, or a remarkable coincidence.</>}
        </p>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  PAGE 3 — Sayana and the Broader Tradition                           */
/* ------------------------------------------------------------------ */
function Page3() {
  const locale = useModuleLocale();
  const isHi = locale !== 'en';
  return (
    <div className="space-y-6">
      <section>
        <h3 className="text-gold-light font-bold text-lg mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
          {isHi ? 'सायण और व्यापक परम्परा' : 'Sayana and the Broader Tradition'}
        </h3>
        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {isHi
            ? <>प्रकाश की गति के प्रश्न से परे, सायण और उनकी वैदिक टिप्पणियाँ अपने आप में असाधारण हैं। उनका कार्य भारतीय बौद्धिक जीवन की जीवन्तता और गहराई का प्रमाण है।</>
            : <>Beyond the speed of light question, Sayana and his Vedic commentaries are extraordinary in their own right. His work is a testament to the vitality and depth of Indian intellectual life.</>}
        </p>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-gold-primary/12 rounded-xl p-5">
        <h4 className="text-gold-dark text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'सायण कौन थे' : 'Who Was Sayana'}
        </h4>
        <div className="space-y-2 text-text-secondary text-xs leading-relaxed">
          <p>→ {isHi ? 'विजयनगर साम्राज्य (1336-1646 ईस्वी) के प्रधानमंत्री' : 'Prime minister of the Vijayanagara Empire (1336–1646 CE)'}</p>
          <p>→ {isHi ? 'राजा बुक्कराय और हरिहर द्वितीय के संरक्षण में कार्य किया' : 'Worked under patronage of kings Bukkaraya and Harihara II'}</p>
          <p>→ {isHi ? 'चारों वेदों पर व्यापक टिप्पणियाँ लिखीं — अभी भी Vedic व्याख्या की प्राथमिक संदर्भ' : 'Wrote comprehensive commentaries on all four Vedas — still the primary reference for Vedic interpretation'}</p>
          <p>→ {isHi ? '~1380 ईस्वी में रचित ऋग्वेद टिप्पणी सबसे महत्त्वपूर्ण मानी जाती है' : 'Rig Veda commentary (~1380 CE) considered most important'}</p>
          <p>→ {isHi ? 'उनका कार्य भारत की संस्कृत विद्वत्ता की अखंड परम्परा का प्रतिनिधित्व करता है' : 'His work represents the unbroken tradition of Sanskrit scholarship in India'}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#2d1b69]/40 via-[#1a1040]/50 to-[#0a0e27] border border-purple-500/15 rounded-xl p-5">
        <h4 className="text-purple-300 text-xs uppercase tracking-widest font-bold mb-3">
          {isHi ? 'प्रकाश की गति — एक समयरेखा' : 'Speed of Light — A Timeline'}
        </h4>
        <div className="space-y-1 text-text-secondary text-xs leading-relaxed">
          <p><span className="text-gold-light font-medium">~1380 ईस्वी / ~1380 CE:</span> {isHi ? 'सायण — ऋग्वेद टिप्पणी में 2,202 योजन/अर्ध-निमेष' : 'Sayana — 2,202 yojanas per half-nimesha in Rig Veda commentary'}</p>
          <p><span className="text-gold-light font-medium">1676 ईस्वी / 1676 CE:</span> {isHi ? 'ओले रोमर — बृहस्पति के चन्द्रमाओं से पहला यूरोपीय माप' : 'Ole Rømer — first European measurement from Jupiter\'s moons'}</p>
          <p><span className="text-gold-light font-medium">1729 ईस्वी / 1729 CE:</span> {isHi ? 'जेम्स ब्रैडली — स्टारलाइट विपथन से बेहतर माप' : 'James Bradley — improved measurement from starlight aberration'}</p>
          <p><span className="text-gold-light font-medium">1849 ईस्वी / 1849 CE:</span> {isHi ? 'फिज़ो — पहला प्रयोगशाला माप (गियर-पहिया विधि)' : 'Fizeau — first laboratory measurement (gear-wheel method)'}</p>
          <p><span className="text-gold-light font-medium">1865 ईस्वी / 1865 CE:</span> {isHi ? 'मैक्सवेल — विद्युत चुम्बकीय सिद्धान्त से c व्युत्पन्न' : 'Maxwell — derived c from electromagnetic theory'}</p>
          <p><span className="text-gold-light font-medium">1983 ईस्वी / 1983 CE:</span> {isHi ? 'c को 299,792,458 m/s पर परिभाषित किया — मीटर की परिभाषा का आधार' : 'c defined as exactly 299,792,458 m/s — basis of metre definition'}</p>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  EXPORT                                                              */
/* ------------------------------------------------------------------ */
export default function Module26_3Page() {
  return <ModuleContainer meta={META} pages={[<Page1 key="p1" />, <Page2 key="p2" />, <Page3 key="p3" />]} questions={QUESTIONS} />;
}
